import Gun from 'gun'

let gun: any;

export function initGun() {
  if (typeof window === 'undefined') return null;
  
  if (!gun) {
    gun = Gun({
      peers: [
        'http://localhost:8765/gun',
        'https://relay.peer.ooo/gun',
        'https://peer.wallie.io/gun',
        'https://gun-relay.js.org/gun',
        'https://plankton-app-6qfp3.ondigitalocean.app/gun'
      ],
      localStorage: false,
      radisk: false
    });
  }
  return gun;
}

const processedSignals = new Set<string>();

export function joinRoom(roomId: string, peerId: string, onPeerSignal: (fromPeerId: string, signal: any) => void) {
  const g = initGun();
  if (!g) return;

  console.log('[SIGNALING] Joining room:', roomId, 'as peer:', peerId);
  const room = g.get(`room-${roomId}`);
  
  room.get('peers').get(peerId).put({ online: true });
  console.log('[SIGNALING] Announced presence');
  
  room.get('signals').get(peerId).on((data: any) => {
    if (data && data.from && data.signal && data.timestamp) {
      const signalId = `${data.from}-${data.timestamp}`;
      if (processedSignals.has(signalId)) return;
      processedSignals.add(signalId);
      
      console.log('[SIGNALING] Received signal from:', data.from);
      const cleanSignal = JSON.parse(JSON.stringify(data.signal));
      onPeerSignal(data.from, cleanSignal);
    }
  });
  
  room.get('peers').map().on((peer: any, id: string) => {
    if (id !== peerId && peer?.online) {
      console.log('[SIGNALING] Discovered peer:', id);
      onPeerSignal(id, null);
    }
  });
}

export function sendSignal(roomId: string, toPeerId: string, fromPeerId: string, signal: any) {
  const g = initGun();
  if (!g) return;

  g.get(`room-${roomId}`).get('signals').get(toPeerId).put({
    from: fromPeerId,
    signal,
    timestamp: Date.now()
  });
}

export function leaveRoom(roomId: string, peerId: string) {
  const g = initGun();
  if (!g) return;

  g.get(`room-${roomId}`).get('peers').get(peerId).put({ online: false });
}
