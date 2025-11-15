const EMOJI_SET = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🔶', '🔷', '🔸', '🔹', '💠', '🔺', '🔻'];

export function generateFingerprint(peerId1: string, peerId2: string): string {
  const combined = [peerId1, peerId2].sort().join('');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash = hash & hash;
  }
  const emojis = [];
  for (let i = 0; i < 4; i++) {
    emojis.push(EMOJI_SET[Math.abs(hash >> (i * 4)) % EMOJI_SET.length]);
  }
  return emojis.join('');
}
