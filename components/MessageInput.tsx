"use client";

import { useRef } from "react";
import { getMaxFileSizeMB } from "@/lib/file-transfer";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  connected: boolean;
  onSend: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTyping: () => void;
}

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😮", "🔥", "😢", "🙏", "👏", "🎉", "😍", "😎", "🤔", "😱", "💯", "✨"];

export default function MessageInput({
  input,
  setInput,
  connected,
  onSend,
  onFileSelect,
  onTyping,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const maxChars = 500;

  return (
    <div style={{ borderTop: "1px solid #333" }}>
      {input.length > 0 && (
        <div
          style={{
            padding: "4px 16px",
            fontSize: 10,
            opacity: 0.6,
            textAlign: "right",
          }}
        >
          {input.length}/{maxChars}
        </div>
      )}
      <div
        style={{
          padding: 16,
          display: "flex",
          gap: 8,
        }}
      >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        style={{ display: "none" }}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={!connected}
        style={{
          padding: "12px",
          background: connected ? "#333" : "#222",
          border: "none",
          borderRadius: 8,
          color: connected ? "#fff" : "#666",
          cursor: connected ? "pointer" : "not-allowed",
          fontSize: 16,
        }}
        title={`Send file (max ${getMaxFileSizeMB()}MB)`}
      >
        +
      </button>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (connected && e.target.value) {
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => onTyping(), 300);
          }
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" && connected) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={
          connected ? "Type a message..." : "Waiting for connection..."
        }
        disabled={!connected}
        style={{
          flex: 1,
          padding: 12,
          background: connected ? "#fff" : "#111",
          border: "1px solid #333",
          borderRadius: 8,
          color: connected ? "#000" : "#666",
          outline: "none",
          cursor: connected ? "text" : "not-allowed",
        }}
        maxLength={maxChars}
      />
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => setInput(input + emoji)}
          disabled={!connected}
          style={{
            padding: "6px 8px",
            background: connected ? "#333" : "#222",
            border: "none",
            borderRadius: 6,
            cursor: connected ? "pointer" : "not-allowed",
            fontSize: 14,
          }}
        >
          {emoji}
        </button>
      ))}
      </div>
    </div>
  );
}
