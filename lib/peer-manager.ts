import { trackSent, trackReceived } from './bandwidth-monitor';
import * as ProtocolManager from './peer-protocol-manager';

let peerId: string | null = null;

export async function initPeer(
  roomId: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void,
  onFallback?: () => void
): Promise<{ id: string } | null> {
  if (peerId) {
    console.log('[PEER] Already initialized:', peerId);
    return { id: peerId };
  }

  const wrappedOnMessage = (fromPeerId: string, data: string) => {
    trackReceived(data.length);
    onMessage(fromPeerId, data);
  };

  try {
    const id = await ProtocolManager.initPeer(
      wrappedOnMessage,
      onConnect,
      onDisconnect,
      onFallback
    );
    
    if (id) {
      peerId = id;
      console.log('[PEER] Initialized with ID:', peerId);
      return { id: peerId };
    }
    
    return null;
  } catch (err) {
    console.error('[PEER] Initialization failed:', err);
    return null;
  }
}

export function connectToPeer(
  remotePeerId: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void
) {
  const wrappedOnMessage = (fromPeerId: string, data: string) => {
    trackReceived(data.length);
    onMessage(fromPeerId, data);
  };

  ProtocolManager.connectToPeer(remotePeerId, wrappedOnMessage, onConnect, onDisconnect);
}

export function sendToAll(data: string) {
  trackSent(data.length);
  ProtocolManager.sendToAll(data);
}

export function getPeerId() {
  return peerId || '';
}

export function destroy() {
  ProtocolManager.destroy();
  peerId = null;
}

export function getConnectionCount(): number {
  return 0;
}

export function getConnections(): string[] {
  return [];
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
