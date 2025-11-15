import * as SimplePeerProtocol from './peer-simplepeer';
import * as PeerJSProtocol from './peer-peerjs';

type Protocol = 'simplepeer' | 'peerjs';

let currentProtocol: Protocol | null = null;

export async function initPeer(
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void,
  onFallback?: () => void
): Promise<string | null> {
  try {
    console.log('[PROTOCOL] Trying simple-peer + Cloudflare Worker...');
    const id = await SimplePeerProtocol.initSimplePeer(onMessage, onConnect, onDisconnect);
    currentProtocol = 'simplepeer';
    console.log('[PROTOCOL] Using simple-peer');
    return id;
  } catch (err) {
    console.warn('[PROTOCOL] simple-peer failed:', err);
    console.log('[PROTOCOL] Falling back to PeerJS...');
    
    try {
      const id = await PeerJSProtocol.initPeerJS(onMessage, onConnect, onDisconnect);
      currentProtocol = 'peerjs';
      console.log('[PROTOCOL] Using PeerJS (fallback)');
      if (onFallback) onFallback();
      return id;
    } catch (fallbackErr) {
      console.error('[PROTOCOL] Both protocols failed');
      throw fallbackErr;
    }
  }
}

export function connectToPeer(
  remotePeerId: string,
  onMessage: (peerId: string, data: string) => void,
  onConnect: (remotePeerId?: string) => void,
  onDisconnect?: (reason?: string) => void
) {
  if (currentProtocol === 'simplepeer') {
    SimplePeerProtocol.connectSimplePeer(remotePeerId, onMessage, onConnect, onDisconnect);
  } else if (currentProtocol === 'peerjs') {
    PeerJSProtocol.connectPeerJS(remotePeerId, onMessage, onConnect, onDisconnect);
  } else {
    throw new Error('No protocol initialized');
  }
}

export function sendToAll(data: string) {
  if (currentProtocol === 'simplepeer') {
    SimplePeerProtocol.sendSimplePeer(data);
  } else if (currentProtocol === 'peerjs') {
    PeerJSProtocol.sendPeerJS(data);
  }
}

export function destroy() {
  if (currentProtocol === 'simplepeer') {
    SimplePeerProtocol.destroySimplePeer();
  } else if (currentProtocol === 'peerjs') {
    PeerJSProtocol.destroyPeerJS();
  }
  currentProtocol = null;
}

export function getCurrentProtocol(): Protocol | null {
  return currentProtocol;
}
