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
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const maxChars = 500;

  const wrapText = (prefix: string, suffix: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = input.substring(start, end);
    const newText = input.substring(0, start) + prefix + selected + suffix + input.substring(end);
    setInput(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

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
          padding: "8px 16px",
          display: "flex",
          gap: 4,
          borderBottom: "1px solid #222",
        }}
      >
        <button onClick={() => wrapText('# ', '')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontWeight: "bold" }} data-title="# Heading" className="tooltip-btn">H1</button>
        <button onClick={() => wrapText('## ', '')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontWeight: "bold" }} data-title="## Subheading" className="tooltip-btn">H2</button>
        <button onClick={() => wrapText('### ', '')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontWeight: "bold" }} data-title="### Small Heading" className="tooltip-btn">H3</button>
        <button onClick={() => wrapText('**', '**')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontWeight: "bold" }} data-title="**Bold**" className="tooltip-btn">B</button>
        <button onClick={() => wrapText('*', '*')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontStyle: "italic" }} data-title="*Italic*" className="tooltip-btn">I</button>
        <button onClick={() => wrapText('__', '__')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, textDecoration: "underline" }} data-title="__Underline__" className="tooltip-btn">U</button>
        <button onClick={() => wrapText('~~', '~~')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, textDecoration: "line-through" }} data-title="~~Strikethrough~~" className="tooltip-btn">S</button>
        <button onClick={() => wrapText('==', '==')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#ff0" : "#111", border: "1px solid #333", borderRadius: 4, color: "#000", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="==Highlight==" className="tooltip-btn">H</button>
        <button onClick={() => wrapText('`', '`')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontFamily: "monospace" }} data-title="`Code`" className="tooltip-btn">{"<>"}</button>
        <button onClick={() => wrapText('```\n', '\n```')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11, fontFamily: "monospace" }} data-title="```Code Block```" className="tooltip-btn">{"{}"}</button>

        <button onClick={() => wrapText('[', '](url)')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="[Link](url)" className="tooltip-btn">🔗</button>
        <button onClick={() => wrapText('![alt](', ')')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="![Image](url)" className="tooltip-btn">🖼️</button>
        <button onClick={() => wrapText('^', '^')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="^Superscript^" className="tooltip-btn">x²</button>
        <button onClick={() => wrapText('~', '~')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="~Subscript~" className="tooltip-btn">x₂</button>
        <button onClick={() => wrapText('---\n', '')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="--- Horizontal Rule" className="tooltip-btn">─</button>
        <button onClick={() => wrapText('| ', ' |')} disabled={!connected} style={{ padding: "4px 8px", background: connected ? "#222" : "#111", border: "1px solid #333", borderRadius: 4, color: connected ? "#fff" : "#666", cursor: connected ? "pointer" : "not-allowed", fontSize: 11 }} data-title="| Table |" className="tooltip-btn">☷</button>
      </div>
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
        data-title="<=10MB"
        className="tooltip-btn"
      >
        +
      </button>
      <input
        ref={inputRef}
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
          className="emoji-btn"
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
