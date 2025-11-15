"use client";

import { useEffect, useRef, useState } from "react";
import { parseMarkdown } from "@/lib/markdown";
import { copyWithAutoClean } from "@/lib/clipboard-manager";

interface Message {
  id: string;
  text: string;
  peerId: string;
  isSelf: boolean;
  read?: boolean;
  expiresAt?: number;
  sensitive?: boolean;
  file?: {
    name: string;
    size: number;
    type: string;
    data: string;
  };
}

interface MessageListProps {
  messages: Message[];
  searchQuery?: string;
  onDelete: (id: string) => void;
}

export default function MessageList({ messages, searchQuery = "", onDelete }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(Date.now());
  const [revealedSensitive, setRevealedSensitive] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMessages = searchQuery
    ? messages.filter((msg) => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const highlightText = (text: string) => {
    const parsed = parseMarkdown(text);
    if (!searchQuery) return parsed;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return parsed.replace(regex, '<mark style="background: #ff0; color: #000">$1</mark>');
  };

  useEffect(() => {
    if (!searchQuery) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchQuery]);

  if (messages.length === 0) {
    return (
      <div style={{ textAlign: "center", opacity: 0.5, marginTop: 40 }}>
        No messages yet. Start chatting!
      </div>
    );
  }

  if (searchQuery && filteredMessages.length === 0) {
    return (
      <div style={{ textAlign: "center", opacity: 0.5, marginTop: 40 }}>
        No messages found for "{searchQuery}"
      </div>
    );
  }

  return (
    <>
      {filteredMessages.map((msg, i) => (
        <div
          key={msg.id}
          style={{
            marginBottom: 12,
            textAlign: msg.isSelf ? "right" : "left",
          }}
        >
          <div style={{ display: "inline-block", position: "relative", maxWidth: "70%" }}>
            <div
              onClick={() => {
                if (msg.sensitive && !revealedSensitive.has(msg.id)) {
                  setRevealedSensitive(new Set(revealedSensitive).add(msg.id));
                  setTimeout(() => {
                    setRevealedSensitive(prev => {
                      const next = new Set(prev);
                      next.delete(msg.id);
                      return next;
                    });
                  }, 3000);
                } else if (msg.text) {
                  copyWithAutoClean(msg.text);
                }
              }}
              className={msg.text ? "tooltip-btn" : ""}
              data-title={msg.sensitive && !revealedSensitive.has(msg.id) ? "Click to reveal (3s)" : msg.text ? "Click to copy (auto-clear 10s)" : undefined}
              style={{
                padding: "8px 12px",
                background: msg.isSelf ? "#fff" : "#333",
                color: msg.isSelf ? "#000" : "#fff",
                borderRadius: 8,
                cursor: msg.text ? "pointer" : "default",
                filter: msg.sensitive && !revealedSensitive.has(msg.id) ? "blur(8px)" : "none",
                transition: "filter 0.2s",
              }}
            >
            {msg.file ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {msg.file.type.startsWith("image/") ? (
                  <img
                    src={msg.file.data}
                    alt={msg.file.name}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      borderRadius: 4,
                      display: "block",
                    }}
                  />
                ) : (
                  <>
                    <span style={{ fontSize: 24 }}>📄</span>
                    <a
                      href={msg.file.data}
                      download={msg.file.name}
                      style={{
                        color: msg.isSelf ? "#000" : "#fff",
                        textDecoration: "none",
                        fontSize: 11,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{msg.file.name}</div>
                      <div style={{ opacity: 0.7, fontSize: 9 }}>
                        {(msg.file.size / 1024).toFixed(1)}KB
                      </div>
                    </a>
                  </>
                )}
              </div>
            ) : msg.text ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightText(msg.text),
                }}
              />
            ) : null}
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 4, fontSize: 9, opacity: 0.6, justifyContent: msg.isSelf ? "flex-end" : "flex-start", alignItems: "center" }}>
              {msg.expiresAt && (() => {
                const remaining = Math.max(0, Math.ceil((msg.expiresAt - now) / 1000));
                return <span style={{ color: remaining <= 5 ? "#f00" : "#fff" }}>⏱️ {remaining}s</span>;
              })()}
              {msg.isSelf && msg.read && <span className="tooltip-btn" data-title="Read">✓✓</span>}
              {msg.isSelf && !msg.read && <span className="tooltip-btn" data-title="Sent">✓</span>}
              <button
                onClick={() => onDelete(msg.id)}
                className="tooltip-btn"
                data-title="Delete for everyone"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 12,
                  opacity: 0.5,
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </>
  );
}
