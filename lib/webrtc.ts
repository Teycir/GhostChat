import SimplePeer from 'simple-peer'

export interface PeerConnection {
  peer: SimplePeer.Instance;
  peerId: string;
}

const peers = new Map<string, SimplePeer.Instance>();

export function createPeer(initiator: boolean, peerId: string, onSignal: (signal: any) => void, onData: (data: string) => void): SimplePeer.Instance {
  console.log('[WEBRTC] Creating peer:', peerId, 'initiator:', initiator);
  const peer = new SimplePeer({
    initiator,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
  });

  peer.on('signal', (signal) => {
    console.log('[WEBRTC] Signal generated for:', peerId);
    onSignal(signal);
  });
  peer.on('data', (data) => onData(data.toString()));
  peer.on('error', (err) => console.error('[WEBRTC] Peer error:', peerId, err));
  peer.on('close', () => {
    console.log('[WEBRTC] Peer closed:', peerId);
    peers.delete(peerId);
  });
  peer.on('connect', () => console.log('[WEBRTC] Peer connected:', peerId));

  peers.set(peerId, peer);
  return peer;
}

export function signalPeer(peerId: string, signal: any) {
  const peer = peers.get(peerId);
  if (peer) peer.signal(signal);
}

export function sendMessage(peerId: string, message: string) {
  const peer = peers.get(peerId);
  if (peer) peer.send(message);
}

export function getPeer(peerId: string): SimplePeer.Instance | undefined {
  return peers.get(peerId);
}

export function getAllPeers(): Map<string, SimplePeer.Instance> {
  return peers;
}
