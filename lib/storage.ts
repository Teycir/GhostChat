export interface Message {
  id: string;
  text: string;
  peerId: string;
  isSelf: boolean;
  read?: boolean;
  expiresAt?: number;
  createdAt?: number;
  sensitive?: boolean;
  file?: {
    name: string;
    size: number;
    type: string;
    data: string;
  };
}

let messages: Message[] = [];
let maxMessages = 50;

function overwriteMemory(msg: Message) {
  const randomStr = () => Math.random().toString(36).repeat(10);
  msg.text = randomStr();
  msg.id = randomStr();
  msg.peerId = randomStr();
  if (msg.file) {
    msg.file.data = randomStr();
    msg.file.name = randomStr();
  }
}

export function storeMessage(msg: Message) {
  msg.createdAt = Date.now();
  messages.push(msg);
  if (messages.length > maxMessages) {
    const removed = messages.shift();
    if (removed) overwriteMemory(removed);
  }
}

export function getMessages(): Message[] {
  return messages;
}

export function deleteMessage(id: string) {
  const msg = messages.find(m => m.id === id);
  if (msg) overwriteMemory(msg);
  messages = messages.filter(m => m.id !== id);
}

export function markAsRead(id: string) {
  const msg = messages.find(m => m.id === id);
  if (msg) msg.read = true;
}

export function setMaxMessages(max: number) {
  maxMessages = max;
  while (messages.length > maxMessages) {
    const removed = messages.shift();
    if (removed) overwriteMemory(removed);
  }
}

export function clearMessages() {
  messages.forEach(m => overwriteMemory(m));
  messages = [];
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    clearMessages();
    for (let i = 0; i < 100; i++) {
      messages.push({ id: Math.random().toString(), text: Math.random().toString(), peerId: '', isSelf: false });
    }
    messages = [];
  });
}
