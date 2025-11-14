"use client";

import React, { useEffect, useState } from "react";
import { getMessages, storeMessage } from "@/lib/storage";
import {
  initPeer,
  connectToPeer,
  sendToAll,
  destroy,
  getConnectionCount,
} from "@/lib/peer-manager";
import { getStats } from "@/lib/bandwidth-monitor";
import { getCurrentProtocol } from "@/lib/peer-protocol-manager";
import { getCurrentWorker } from "@/lib/cloudflare-workers-pool";
import { inviteManager } from "@/lib/invite-manager";
import {
  isIOSPWA,
  isMobile,
  requestWakeLock,
  ensureHTTPS,
} from "@/lib/mobile-utils";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateMessage } from "@/lib/input-validation";
import { generateQRCode } from "@/lib/qr-code";
import { getConnectionErrorMessage } from "@/lib/error-messages";
import { saveSession, getSession, clearSession } from "@/lib/session-recovery";
import { fileToBase64, deserializeFileMessage, serializeFileMessage, getMaxFileSizeMB } from "@/lib/file-transfer";
import ErrorHandler from "./ErrorHandler";

interface ChatCoreProps {
  invitePeerId: string | null;
}

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

export default function ChatCore({ invitePeerId }: ChatCoreProps) {
  const [peerId, setPeerId] = useState("");
  const [messages, setMessages] = useState(getMessages());
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [showInvite, setShowInvite] = useState(true);
  const [linkCreated, setLinkCreated] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);


  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [fallbackWarning, setFallbackWarning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{fileName: string, sent: number, total: number} | null>(null);
  const initialized = React.useRef(false);
  const startTime = React.useRef(Date.now());
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    if (initialized.current) return;
    initialized.current = true;
    
    let mounted = true;
    
    (async () => {
    if (isMobile()) {
      ensureHTTPS();
      requestWakeLock();
    }
    const handleMessage = (fromPeerId: string, data: string) => {
      console.log("[CHAT] Received message:", data.slice(0, 100), "from:", fromPeerId);
      const fileData = deserializeFileMessage(data);
      if (fileData) {
        storeMessage({ text: '', peerId: fromPeerId, isSelf: false, file: fileData });
        setMessages(getMessages().slice());
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'file-chunk' || parsed.type === 'file') {
          return;
        }
      } catch {}
      storeMessage({ text: data, peerId: fromPeerId, isSelf: false });
      setMessages(getMessages().slice());
    };

    const handleConnect = () => {
      console.log("[CHAT] Connection established");
      setConnected(true);
      setConnecting(false);
      setMessageQueue((prev) => {
        prev.forEach((msg) => sendToAll(msg));
        return [];
      });
    };

    const handleDisconnect = () => {
      console.log("[CHAT] Connection lost");
      setConnected(false);
      setConnecting(false);
      setError(getConnectionErrorMessage({ type: 'disconnected' }));
    };

    const handleFallback = () => {
      setFallbackWarning(true);
    };

    const peer = await initPeer("", handleMessage, handleConnect, handleDisconnect, handleFallback);

    if (peer && peer.id) {
      console.log("[CHAT] Peer initialized with ID:", peer.id);
      setPeerId(peer.id);
      saveSession(peer.id);
      const link = `${window.location.origin}/chat?peer=${peer.id}`;
      setInviteLink(link);

      if (invitePeerId) {
        console.log("[CHAT] Connecting to invite:", invitePeerId);
        setConnecting(true);
        const validPeerId = await inviteManager.validateInvite(invitePeerId);
        connectToPeer(
          validPeerId || invitePeerId,
          handleMessage,
          handleConnect,
          handleDisconnect,
        );
      }
    }

    const handleVisibilityChange = () => {
      document.body.style.filter = document.hidden ? "blur(10px)" : "none";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      clearInterval(uptimeInterval);
      destroy();
      clearSession();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    })();
  }, []);

  const sendMessage = () => {
    console.log('[SEND] sendMessage called, input:', input, 'connected:', connected);
    if (!input.trim()) {
      console.log('[SEND] Empty input, returning');
      return;
    }

    const validation = validateMessage(input);
    if (!validation.valid) {
      console.log('[SEND] Validation failed:', validation.error);
      setError(validation.error || "Invalid message");
      return;
    }

    if (!checkRateLimit("messages", 10, 10000)) {
      console.log('[SEND] Rate limit hit');
      setError("Sending too fast. Wait a moment.");
      return;
    }

    console.log('[SEND] Storing message');
    storeMessage({ text: input, peerId, isSelf: true });
    setMessages(getMessages().slice());

    if (connected) {
      console.log('[SEND] Sending to peer');
      sendToAll(input);
    } else {
      console.log('[SEND] Queueing message');
      setMessageQueue((prev) => [...prev, input]);
    }

    setInput("");
    console.log('[SEND] Message sent successfully');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[FILE] Processing file:', file.name);
    const result = await fileToBase64(file);
    if (!result.success) {
      setError(result.error || "Failed to process file");
      return;
    }

    console.log('[FILE] File converted to base64');
    storeMessage({ text: '', peerId, isSelf: true, file: result.fileData });
    setMessages(getMessages().slice());

    const chunks = serializeFileMessage(result.fileData!);
    console.log('[FILE] File split into', chunks.length, 'chunks');
    
    if (connected) {
      setUploadProgress({ fileName: file.name, sent: 0, total: chunks.length });
      chunks.forEach((chunk, i) => {
        sendToAll(chunk);
        setUploadProgress({ fileName: file.name, sent: i + 1, total: chunks.length });
      });
      setTimeout(() => setUploadProgress(null), 2000);
    } else {
      setMessageQueue((prev) => [...prev, ...chunks]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>


      <ErrorHandler
        error={error}
        onRetry={handleRetry}
        onDismiss={() => setError(null)}
      />
      {fallbackWarning && (
        <div style={{
          padding: 12,
          background: '#ff0',
          color: '#000',
          fontSize: 11,
          textAlign: 'center',
          borderBottom: '1px solid #333'
        }}>
          Custom server unavailable. Using free public server (0.peerjs.com)
          <button
            onClick={() => setFallbackWarning(false)}
            style={{
              marginLeft: 8,
              padding: '2px 8px',
              background: '#000',
              color: '#ff0',
              border: 'none',
              borderRadius: 4,
              fontSize: 10,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      )}
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            Your ID: {peerId.slice(0, 8)}...
          </div>
        </div>

      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            fontSize: 10,
            marginTop: 4,
            color: connected ? "#0f0" : connecting ? "#ff0" : "#f00",
          }}
        >
          {connected
            ? "✓ Connected"
            : connecting
              ? "Establishing connection..."
              : "✗ Disconnected"}
        </div>
        {showInvite && !connected && (
          <div style={{ marginTop: 12 }}>
            {!linkCreated ? (
              <button
                onClick={() => setLinkCreated(true)}
                disabled={!peerId}
                style={{
                  padding: "6px 12px",
                  background: peerId ? "#fff" : "#333",
                  border: "none",
                  borderRadius: 8,
                  color: peerId ? "#000" : "#666",
                  fontSize: 11,
                  cursor: peerId ? "pointer" : "not-allowed",
                  fontWeight: 600,
                }}
              >
                {peerId ? "Create Invite Link" : "Initializing..."}
              </button>
            ) : (
              <div style={{ fontSize: 11, lineHeight: 1.5 }}>
                {inviteLink ? (
                  <>
                    <div style={{ marginBottom: 8, opacity: 0.8 }}>
                      Share this link with your friend:
                    </div>
                    <div
                      style={{
                        padding: 8,
                        background: "#1a1a1a",
                        borderRadius: 6,
                        wordBreak: "break-all",
                        fontSize: 10,
                        marginBottom: 8,
                        border: "1px solid #333",
                      }}
                    >
                      {inviteLink}
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: 8, opacity: 0.6, fontSize: 10 }}>
                    Generating link...
                  </div>
                )}
                {inviteLink && (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(inviteLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: copied ? '#0f0' : '#fff',
                          border: 'none',
                          borderRadius: 6,
                          color: copied ? '#000' : '#000',
                          fontSize: 10,
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button
                        onClick={() => {
                          console.log('[QR] Toggle clicked, current:', showQR);
                          setShowQR(!showQR);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#333',
                          border: 'none',
                          borderRadius: 6,
                          color: '#fff',
                          fontSize: 10,
                          cursor: 'pointer'
                        }}
                      >
                        {showQR ? 'Hide QR' : 'Show QR'}
                      </button>
                    </div>
                    {showQR && inviteLink && (
                      <div style={{ 
                        marginTop: 12,
                        marginBottom: 12,
                        padding: 16,
                        background: '#fff',
                        borderRadius: 12,
                        display: 'inline-block',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        <img
                          src={generateQRCode(inviteLink)}
                          alt="QR Code"
                          style={{ 
                            display: 'block',
                            width: '180px',
                            height: '180px',
                            imageRendering: 'pixelated'
                          }}
                          onLoad={() => console.log('[QR] Image loaded')}
                          onError={(e) => console.error('[QR] Image failed:', e)}
                        />
                        <div style={{
                          marginTop: 8,
                          fontSize: 9,
                          color: '#666',
                          textAlign: 'center',
                          fontWeight: 500
                        }}>
                          Scan to join chat
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div style={{ opacity: 0.6, fontSize: 10 }}>
                  They paste it in their browser or scan QR code
                </div>
                <div
                  style={{
                    opacity: 0.5,
                    fontSize: 9,
                    marginTop: 8,
                    color: "#ff0",
                  }}
                >
                  ⚠️ Link expires when you close this tab
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", opacity: 0.5, marginTop: 40 }}>
            No messages yet. Start chatting!
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: msg.isSelf ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: msg.isSelf ? "#fff" : "#333",
                color: msg.isSelf ? "#000" : "#fff",
                borderRadius: 8,
                maxWidth: "70%",
              }}
            >
              {msg.file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {msg.file.type.startsWith('image/') ? (
                    <img
                      src={msg.file.data}
                      alt={msg.file.name}
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: 4, display: 'block' }}
                    />
                  ) : (
                    <>
                      <span style={{ fontSize: 24 }}>📄</span>
                      <a
                        href={msg.file.data}
                        download={msg.file.name}
                        style={{ color: msg.isSelf ? '#000' : '#fff', textDecoration: 'none', fontSize: 11 }}
                      >
                        <div style={{ fontWeight: 600 }}>{msg.file.name}</div>
                        <div style={{ opacity: 0.7, fontSize: 9 }}>{(msg.file.size / 1024).toFixed(1)}KB</div>
                      </a>
                    </>
                  )}
                </div>
              ) : msg.text ? (
                msg.text
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {uploadProgress && (
        <div style={{
          padding: 8,
          background: '#1a1a1a',
          borderTop: '1px solid #333',
          fontSize: 10
        }}>
          <div style={{ marginBottom: 4 }}>Uploading: {uploadProgress.fileName}</div>
          <div style={{ background: '#333', height: 4, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              background: '#0f0',
              height: '100%',
              width: `${(uploadProgress.sent / uploadProgress.total) * 100}%`,
              transition: 'width 0.1s'
            }} />
          </div>
          <div style={{ marginTop: 4, opacity: 0.7 }}>
            {uploadProgress.sent} / {uploadProgress.total} chunks
          </div>
        </div>
      )}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid #333",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
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
            console.log('[INPUT] onChange:', e.target.value);
            setInput(e.target.value);
          }}
          onKeyPress={(e) => {
            console.log('[INPUT] Key pressed:', e.key, 'input value:', input, 'connected:', connected);
            if (e.key === "Enter" && connected) {
              e.preventDefault();
              sendMessage();
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
        />
      </div>
      <div
        style={{
          padding: "8px 12px",
          background: "#0a0a0a",
          borderTop: "1px solid #333",
          fontSize: 8,
          opacity: 0.7,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "6px 12px",
        }}
      >
        <span>
          Status: <span style={{ color: connected ? "#0f0" : connecting ? "#ff0" : "#f00" }}>
            {connected ? "Connected" : connecting ? "Connecting" : "Disconnected"}
          </span>
        </span>
        <span>Protocol: {getCurrentProtocol() || "..."}</span>
        <span>ID: {peerId ? peerId.slice(0, 8) : "..."}</span>
        <span>Messages: {messages.length}</span>
        <span>Queue: {messageQueue.length}</span>
        <span>Uptime: {Math.floor(uptime / 60)}m {uptime % 60}s</span>
        <span>Sent: {(getStats().bytesSent / 1024).toFixed(1)}KB</span>
        <span>Recv: {(getStats().bytesReceived / 1024).toFixed(1)}KB</span>
        <span title={getCurrentWorker()}>Server: {getCurrentWorker().includes('teycir') ? 'CF-1' : getCurrentWorker().includes('teycitek') ? 'CF-2' : 'PeerJS'}</span>
        {error && <span style={{ color: "#f00" }}>Error: {error.slice(0, 15)}...</span>}
        {fallbackWarning && <span style={{ color: "#ff0" }}>Fallback</span>}
      </div>
    </div>
  );
}
