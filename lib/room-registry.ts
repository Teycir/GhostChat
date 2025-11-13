export function registerPeer(roomId: string, peerId: string) {
  const key = `room-${roomId}`;
  const peers = getPeersInRoom(roomId);
  if (!peers.includes(peerId)) {
    peers.push(peerId);
    localStorage.setItem(key, JSON.stringify(peers));
  }
  window.dispatchEvent(new StorageEvent('storage', { key }));
}

export function getPeersInRoom(roomId: string): string[] {
  const key = `room-${roomId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function unregisterPeer(roomId: string, peerId: string) {
  const key = `room-${roomId}`;
  const peers = getPeersInRoom(roomId).filter(id => id !== peerId);
  if (peers.length > 0) {
    localStorage.setItem(key, JSON.stringify(peers));
  } else {
    localStorage.removeItem(key);
  }
}

export function watchRoom(roomId: string, callback: (peerId: string) => void) {
  const key = `room-${roomId}`;
  const interval = setInterval(() => {
    const peers = getPeersInRoom(roomId);
    peers.forEach(peerId => callback(peerId));
  }, 1000);
  
  return () => clearInterval(interval);
}
