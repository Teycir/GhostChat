import Peer, { DataConnection } from 'peerjs';
import { getTURNServers } from './turn-config';

let peer: Peer | null = null;
const connections = new Map<string, DataConnection>();

const CONFIG = {
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true
};

export async function initPeerJS(
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    peer = new Peer(id, {
      ...CONFIG,
      config: { iceServers: getTURNServers() },
      debug: 2
    });

    peer.on('open', (id) => {
      console.log('[PEERJS] Connected with ID:', id);
      resolve(id);
    });

    peer.on('connection', (conn) => {
      setupConnection(conn, onMessage, onConnect, onDisconnect);
    });

    peer.on('error', (err) => {
      console.error('[PEERJS] Error:', err.type, err.message);
      reject(err);
    });

    setTimeout(() => reject(new Error('PeerJS timeout')), 10000);
  });
}

function setupConnection(
  conn: DataConnection,
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void
) {
  connections.set(conn.peer, conn);

  conn.on('data', (data) => {
    onMessage(conn.peer, data as string);
  });

  conn.on('open', () => {
    console.log('[PEERJS] Connection open:', conn.peer);
    onConnect(conn.peer);
  });

  conn.on('close', () => {
    connections.delete(conn.peer);
    if (onDisconnect) onDisconnect('peer-left');
  });

  conn.on('error', (err) => {
    console.error('[PEERJS] Connection error:', err);
    connections.delete(conn.peer);
    const errMsg = err?.message || err?.toString() || '';
    if (errMsg.includes('Ice connection failed') || errMsg.includes('disconnected')) {
      if (onDisconnect) onDisconnect('peer-left');
    } else {
      if (onDisconnect) onDisconnect('network-error');
    }
  });
}

export function connectPeerJS(
  remotePeerId: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void
) {
  if (!peer) throw new Error('Peer not initialized');
  
  const conn = peer.connect(remotePeerId, {
    reliable: true,
    serialization: 'json'
  });
  
  setupConnection(conn, onMessage, onConnect, onDisconnect);
}

export function sendPeerJS(data: string) {
  connections.forEach((conn) => {
    if (conn.open) conn.send(data);
  });
}

export function destroyPeerJS() {
  connections.forEach(conn => conn.close());
  connections.clear();
  peer?.destroy();
  peer = null;
}
