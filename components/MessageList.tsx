"use client";

import { useEffect, useRef } from "react";
import { parseMarkdown } from "@/lib/markdown";

interface Message {
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

interface MessageListProps {
  messages: Message[];
  searchQuery?: string;
}

export default function MessageList({ messages, searchQuery = "" }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

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
          key={i}
          style={{
            marginBottom: 12,
            textAlign: msg.isSelf ? "right" : "left",
          }}
        >
          <div
            onClick={() => {
              if (msg.text) {
                navigator.clipboard.writeText(msg.text);
              }
            }}
            style={{
              display: "inline-block",
              padding: "8px 12px",
              background: msg.isSelf ? "#fff" : "#333",
              color: msg.isSelf ? "#000" : "#fff",
              borderRadius: 8,
              maxWidth: "70%",
              cursor: msg.text ? "pointer" : "default",
            }}
            title={msg.text ? "Click to copy" : ""}
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
        </div>
      ))}
      <div ref={endRef} />
    </>
  );
}
