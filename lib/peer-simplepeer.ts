import SimplePeer from 'simple-peer';
import { getTURNServers } from './turn-config';
import { getCurrentWorker, getNextWorker, resetWorkerPool } from './cloudflare-workers-pool';

let ws: WebSocket | null = null;
let myId: string | null = null;
let peer: SimplePeer.Instance | null = null;
let remotePeerId: string | null = null;
let storedOnMessage: ((peerId: string, data: string) => void) | null = null;
let storedOnConnect: (() => void) | null = null;
let storedOnDisconnect: (() => void) | undefined = undefined;

async function tryConnectWorker(
  workerUrl: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: () => void,
  onDisconnect?: () => void
): Promise<string | null> {
  storedOnMessage = onMessage;
  storedOnConnect = onConnect;
  storedOnDisconnect = onDisconnect;
  
  return new Promise((resolve, reject) => {
    myId = Math.random().toString(36).substr(2, 9);
    
    console.log('[SIMPLEPEER] Trying worker:', workerUrl);
    ws = new WebSocket(`${workerUrl}?key=peerjs&id=${myId}&token=token`);
    
    ws.onopen = () => {
      console.log('[SIMPLEPEER] WebSocket connected, ID:', myId);
      resolve(myId);
    };
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.type === 'OPEN') {
        console.log('[SIMPLEPEER] Server acknowledged');
        return;
      }
      
      if (msg.type === 'SIGNAL' && msg.signal) {
        if (!peer) {
          console.log('[SIMPLEPEER] Incoming connection from:', msg.src);
          remotePeerId = msg.src;
          peer = new SimplePeer({
            initiator: false,
            config: { iceServers: getTURNServers() }
          });
          
          setupPeer(peer, storedOnMessage!, storedOnConnect!, storedOnDisconnect, msg.src);
        }
        
        peer.signal(msg.signal);
      }
    };
    
    ws.onerror = (err) => {
      console.error('[SIMPLEPEER] WebSocket error:', err);
      reject(err);
    };
    
    ws.onclose = () => {
      console.log('[SIMPLEPEER] WebSocket closed');
      if (storedOnDisconnect) storedOnDisconnect();
    };
    
    setTimeout(() => reject(new Error('Worker timeout')), 5000);
  });
}

export async function initSimplePeer(
  onMessage: (peerId: string, data: string) => void,
  onConnect: () => void,
  onDisconnect?: () => void
): Promise<string | null> {
  resetWorkerPool();
  
  let currentWorker = getCurrentWorker();
  
  while (currentWorker) {
    try {
      const id = await tryConnectWorker(currentWorker, onMessage, onConnect, onDisconnect);
      console.log('[SIMPLEPEER] Connected to worker:', currentWorker);
      return id;
    } catch (err) {
      console.warn('[SIMPLEPEER] Worker failed:', currentWorker, err);
      const nextWorker = getNextWorker();
      if (!nextWorker) {
        throw new Error('All Cloudflare Workers failed');
      }
      currentWorker = nextWorker;
    }
  }
  
  throw new Error('No workers available');
}

function setupPeer(
  p: SimplePeer.Instance,
  onMessage: (peerId: string, data: string) => void,
  onConnect: () => void,
  onDisconnect?: () => void,
  targetPeerId?: string
) {
  p.on('signal', (signal) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const dst = targetPeerId || remotePeerId || 'unknown';
      console.log('[SIMPLEPEER] Sending signal to:', dst);
      ws.send(JSON.stringify({
        type: 'SIGNAL',
        src: myId,
        dst,
        signal
      }));
    }
  });
  
  p.on('connect', () => {
    console.log('[SIMPLEPEER] P2P connected');
    onConnect();
  });
  
  p.on('data', (data) => {
    onMessage('remote', data.toString());
  });
  
  p.on('close', () => {
    console.log('[SIMPLEPEER] P2P closed');
    if (onDisconnect) onDisconnect();
  });
  
  p.on('error', (err) => {
    console.error('[SIMPLEPEER] P2P error:', err);
    if (onDisconnect) onDisconnect();
  });
}

export function connectSimplePeer(
  targetPeerId: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: () => void,
  onDisconnect?: () => void
) {
  console.log('[SIMPLEPEER] Connecting to:', targetPeerId);
  remotePeerId = targetPeerId;
  
  peer = new SimplePeer({
    initiator: true,
    config: { iceServers: getTURNServers() }
  });
  
  setupPeer(peer, onMessage, onConnect, onDisconnect, targetPeerId);
}

export function sendSimplePeer(data: string) {
  if (peer) {
    peer.send(data);
  }
}

export function destroySimplePeer() {
  peer?.destroy();
  ws?.close();
  peer = null;
  ws = null;
  myId = null;
  remotePeerId = null;
  storedOnMessage = null;
  storedOnConnect = null;
  storedOnDisconnect = undefined;
}
