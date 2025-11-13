import Peer, { DataConnection } from 'peerjs';

let peer: Peer | null = null;
const connections = new Map<string, DataConnection>();

export function initPeer(roomId: string, onMessage: (peerId: string, data: string) => void, onConnect: () => void, onDisconnect?: () => void) {
  if (peer) return peer;

  const id = Math.random().toString(36).substr(2, 9);
  peer = new Peer(id, {
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
  });

  peer.on('connection', (conn) => {
    console.log('[PEER] Incoming connection from:', conn.peer);
    setupConnection(conn, onMessage, onConnect, onDisconnect);
  });

  peer.on('error', (err) => console.error('[PEER] Error:', err));

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
