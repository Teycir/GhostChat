const MAX_MESSAGE_LENGTH = 10000;
const MAX_PEER_ID_LENGTH = 50;

export function validateMessage(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (text.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` };
  }
  
  return { valid: true };
}

export function validatePeerId(peerId: string): { valid: boolean; error?: string } {
  if (!peerId || peerId.trim().length === 0) {
    return { valid: false, error: 'Peer ID cannot be empty' };
  }
  
  if (peerId.length > MAX_PEER_ID_LENGTH) {
    return { valid: false, error: 'Invalid peer ID' };
  }
  
  if (!/^[a-zA-Z0-9-_]+$/.test(peerId)) {
    return { valid: false, error: 'Invalid peer ID format' };
  }
  
  return { valid: true };
}

export function sanitizeMessage(text: string): string {
  return text.trim().slice(0, MAX_MESSAGE_LENGTH);
}
