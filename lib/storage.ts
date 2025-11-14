export interface Message {
  text: string;
  peerId: string;
  isSelf: boolean;
  file?: {
    name: string;
    size: number;
    type: string;
    data: string;
  };
}

let messages: Message[] = [];

export function storeMessage(msg: Message) {
  messages.push(msg);
  if (messages.length > 100) messages.shift();
}

export function getMessages(): Message[] {
  return messages;
}

export function clearMessages() {
  messages = [];
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', clearMessages);
}
