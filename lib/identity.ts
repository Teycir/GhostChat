export interface Identity {
  peerId: string;
}

export function generateIdentity(): Identity {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return { peerId: crypto.randomUUID() };
  }
  return { peerId: Math.random().toString(36).substring(2) + Date.now().toString(36) };
}

export function getIdentity(): Identity {
  if (typeof window === 'undefined') return { peerId: '' };
  
  let identity = (window as any).__identity;
  if (!identity) {
    identity = generateIdentity();
    (window as any).__identity = identity;
  }
  return identity;
}
