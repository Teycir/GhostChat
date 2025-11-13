import Peer, { DataConnection } from 'peerjs';
import { getTURNServers } from './turn-config';

let peer: Peer | null = null;
const connections = new Map<string, DataConnection>();

function getPeerConfig() {
  const customHost = localStorage.getItem('peerjs_host');
  
  if (customHost) {
    const port = localStorage.getItem('peerjs_port');
    const path = localStorage.getItem('peerjs_path');
    return {
      host: customHost,
      port: port ? parseInt(port) : 443,
      path: path || '/',
      secure: true
    };
  }
  
  return {
    host: 'ghostchat-signaling.teycir.workers.dev',
    port: 443,
    path: '/',
    secure: true
  };
}

export function initPeer(roomId: string, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void) {
  if (peer) return peer;

  const id = Math.random().toString(36).substr(2, 9);
  const peerConfig = getPeerConfig();
  
  peer = new Peer(id, {
    ...peerConfig,
    config: {
      iceServers: getTURNServers()
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

export function connectToPeer(remotePeerId: string, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void, retryCount = 0) {
  if (!peer) return;
  
  const conn = peer.connect(remotePeerId);
  
  const retryTimeout = setTimeout(() => {
    if (!conn.open && retryCount < 3) {
      console.log(`[PEER] Retry attempt ${retryCount + 1}/3`);
      conn.close();
      connectToPeer(remotePeerId, onMessage, onConnect, onDisconnect, retryCount + 1);
    }
  }, 5000 * (retryCount + 1));
  
  conn.on('open', () => {
    clearTimeout(retryTimeout);
  });
  
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

export function setPeerJSConfig(host: string, port: number, path: string) {
  localStorage.setItem('peerjs_host', host);
  localStorage.setItem('peerjs_port', port.toString());
  localStorage.setItem('peerjs_path', path);
}

export function clearPeerJSConfig() {
  localStorage.removeItem('peerjs_host');
  localStorage.removeItem('peerjs_port');
  localStorage.removeItem('peerjs_path');
}

export function getPeerJSConfig() {
  return {
    host: localStorage.getItem('peerjs_host') || '',
    port: localStorage.getItem('peerjs_port') || '',
    path: localStorage.getItem('peerjs_path') || ''
  };
}
