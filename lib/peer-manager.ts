import Peer, { DataConnection } from 'peerjs';

let peer: Peer | null = null;
const connections = new Map<string, DataConnection>();

function getPeerConfig() {
  const customHost = localStorage.getItem('peerjs_host');
  const customPort = localStorage.getItem('peerjs_port');
  const customPath = localStorage.getItem('peerjs_path');
  const customKey = localStorage.getItem('peerjs_key');
  
  if (customHost) {
    return {
      host: customHost,
      port: customPort ? parseInt(customPort) : 443,
      path: customPath || '/',
      key: customKey || 'peerjs',
      secure: true
    };
  }
  
  return {};
}

export function initPeer(roomId: string, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void) {
  if (peer) return peer;

  const id = Math.random().toString(36).substr(2, 9);
  const peerConfig = getPeerConfig();
  
  peer = new Peer(id, {
    ...peerConfig,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { 
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ]
    }
  });

  peer.on('connection', (conn) => {
    console.log('[PEER] Incoming connection from:', conn.peer);
    setupConnection(conn, onMessage, onConnect, onDisconnect);
  });

  peer.on('error', (err) => {
    console.error('[PEER] Error:', err);
    if (err.type === 'network' || err.type === 'server-error') {
      console.log('[PEER] Network error, connection may fail');
    }
  });

  return peer;
}

function setupConnection(conn: DataConnection, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void) {
  connections.set(conn.peer, conn);
  
  conn.on('data', (data) => {
    onMessage(conn.peer, data as string);
  });

  conn.on('open', () => {
    console.log('[PEER] Connected to:', conn.peer);
    onConnect();
  });

  conn.on('close', () => {
    console.log('[PEER] Disconnected from:', conn.peer);
    connections.delete(conn.peer);
    if (onDisconnect) onDisconnect();
  });
}

export function connectToPeer(remotePeerId: string, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void) {
  if (!peer) return;
  
  const conn = peer.connect(remotePeerId);
  setupConnection(conn, onMessage, onConnect, onDisconnect);
}

export function sendToPeer(peerId: string, data: string) {
  const conn = connections.get(peerId);
  if (conn && conn.open) {
    conn.send(data);
  }
}

export function sendToAll(data: string) {
  connections.forEach((conn) => {
    if (conn.open) conn.send(data);
  });
}

export function getPeerId() {
  return peer?.id || '';
}

export function destroy() {
  connections.forEach(conn => conn.close());
  connections.clear();
  peer?.destroy();
  peer = null;
}

export function setPeerJSConfig(host: string, port: number, path: string, key: string) {
  localStorage.setItem('peerjs_host', host);
  localStorage.setItem('peerjs_port', port.toString());
  localStorage.setItem('peerjs_path', path);
  localStorage.setItem('peerjs_key', key);
}

export function clearPeerJSConfig() {
  localStorage.removeItem('peerjs_host');
  localStorage.removeItem('peerjs_port');
  localStorage.removeItem('peerjs_path');
  localStorage.removeItem('peerjs_key');
}

export function getPeerJSConfig() {
  return {
    host: localStorage.getItem('peerjs_host') || '0.peerjs.com (default)',
    port: localStorage.getItem('peerjs_port') || '443',
    path: localStorage.getItem('peerjs_path') || '/',
    key: localStorage.getItem('peerjs_key') || 'peerjs'
  };
}
