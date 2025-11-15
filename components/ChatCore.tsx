"use client";

import React, { useEffect, useState } from "react";
import { getMessages, storeMessage, deleteMessage, markAsRead, setMaxMessages } from "@/lib/storage";
import {
  initPeer,
  connectToPeer,
  sendToAll,
  destroy,
} from "@/lib/peer-manager";
import { inviteManager } from "@/lib/invite-manager";
import { isMobile, requestWakeLock, ensureHTTPS } from "@/lib/mobile-utils";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateMessage } from "@/lib/input-validation";
import { getConnectionErrorMessage } from "@/lib/error-messages";
import { saveSession, clearSession } from "@/lib/session-recovery";
import {
  fileToBase64,
  deserializeFileMessage,
  serializeFileMessage,
} from "@/lib/file-transfer";
import { playNotificationSound, initAudioContext } from "@/lib/notification-sound";
import { containsSensitiveContent } from "@/lib/sensitive-content";
import { generateFingerprint } from "@/lib/connection-fingerprint";
import { stripImageMetadata } from "@/lib/metadata-stripper";


import ErrorHandler from "./ErrorHandler";
import ConnectionStatus from "./ConnectionStatus";
import InviteSection from "./InviteSection";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UploadProgress from "./UploadProgress";
import DiagnosticsFooter from "./DiagnosticsFooter";

interface ChatCoreProps {
  invitePeerId: string | null;
}

interface Message {
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

export default function ChatCore({ invitePeerId }: ChatCoreProps) {
  const [peerId, setPeerId] = useState("");
  const [messages, setMessages] = useState(getMessages());
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fallbackWarning, setFallbackWarning] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    sent: number;
    total: number;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [latency, setLatency] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [selfDestructTimer, setSelfDestructTimer] = useState<number>(0);
  const [messageLimit, setMessageLimit] = useState<number>(50);
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [fingerprint, setFingerprint] = useState<string>("");
  const [sessionTimeout, setSessionTimeout] = useState<number>(15);
  const [verificationCode, setVerificationCode] = useState<string>("");

  const initialized = React.useRef(false);
  const peerConnection = React.useRef<any>(null);
  const startTime = React.useRef(Date.now());
  const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const connectionTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const lastActivity = React.useRef(Date.now());
  const typingDelayTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const fakeTrafficInterval = React.useRef<NodeJS.Timeout | null>(null);
  const idleBlurTimeout = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      if (isMobile()) {
        ensureHTTPS();
        requestWakeLock();
      }

      const handleMessage = (fromPeerId: string, data: string) => {
        if (data === "__typing__") {
          setIsTyping(true);
          if (typingTimeout.current) clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "delete") {
            deleteMessage(parsed.id);
            setMessages(getMessages().slice());
            return;
          }
          if (parsed.type === "read") {
            markAsRead(parsed.id);
            setMessages(getMessages().slice());
            return;
          }
          if (parsed.type === "message") {
            const expiresAt = parsed.expiresAt ? parsed.expiresAt : undefined;
            const sensitive = containsSensitiveContent(parsed.text);
            storeMessage({ id: parsed.id, text: parsed.text, peerId: fromPeerId, isSelf: false, expiresAt, sensitive });
            setMessages(getMessages().slice());
            playNotificationSound();
            sendToAll(JSON.stringify({ type: "read", id: parsed.id }));
            return;
          }
          if (parsed.type === "disconnect") {
            handleDisconnect("Peer disconnected");
            return;
          }
          if (parsed.type === "panic") return;

          if (parsed.type === "noise") return;
          if (parsed.type === "file-chunk" || parsed.type === "file") return;
          // If we reach here with unknown type, ignore it
          return;
        } catch {
          // If JSON parsing fails, check if it's a file or just ignore
        }
        const fileData = deserializeFileMessage(data);
        if (fileData) {
          const id = crypto.randomUUID();
          storeMessage({ id, text: "", peerId: fromPeerId, isSelf: false, file: fileData });
          setMessages(getMessages().slice());
          return;
        }
        // Ignore any other non-JSON data (likely noise or malformed packets)
      };

      const handleConnect = (peer?: any) => {
        setConnected(true);
        setConnecting(false);
        initAudioContext();
        if (connectionTimeout.current) {
          clearTimeout(connectionTimeout.current);
          connectionTimeout.current = null;
        }
        setMessageQueue((prev) => {
          prev.forEach((msg) => sendToAll(msg));
          return [];
        });
        if (peer) {
          peerConnection.current = peer;
          const remote = peer.peer || invitePeerId || '';
          setRemotePeerId(remote);
          if (peerId && remote) {
            const fp = generateFingerprint(peerId, remote);
            setFingerprint(fp);
            const code = String(Math.abs(fp.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 1000000)).padStart(6, '0');
            setVerificationCode(code);
          }
        }
        startFakeTraffic();
      };

      const handleDisconnect = (reason?: string) => {
        setConnected(false);
        setConnecting(false);
        setLatency(undefined);
        peerConnection.current = null;
        destroy();
        setTimeout(() => {
          window.location.href = '/chat';
        }, 2000);
      };

      const handleFallback = () => {
        setFallbackWarning(true);
      };

      const peer = await initPeer(
        "",
        handleMessage,
        handleConnect,
        handleDisconnect,
        handleFallback,
      );

      if (peer && peer.id) {
        setPeerId(peer.id);
        saveSession(peer.id);
        const link = `${window.location.origin}/chat?peer=${peer.id}`;
        setInviteLink(link);

        if (invitePeerId) {
          setConnecting(true);
          const validPeerId = await inviteManager.validateInvite(invitePeerId);
          connectToPeer(
            validPeerId || invitePeerId,
            handleMessage,
            handleConnect,
            handleDisconnect,
          );
          
          connectionTimeout.current = setTimeout(() => {
            if (!connected) {
              setConnecting(false);
              setError(getConnectionErrorMessage({ type: "peer-unavailable" }));
            }
          }, 15000);
        }
      }

      const handleVisibilityChange = () => {
        document.body.style.filter = document.hidden ? "blur(10px)" : "none";
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const latencyInterval = setInterval(() => {
        if (connected && peerConnection.current && peerConnection.current._pc) {
          peerConnection.current._pc.getStats().then((stats: any) => {
            stats.forEach((report: any) => {
              if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                setLatency(report.currentRoundTripTime ? Math.round(report.currentRoundTripTime * 1000) : undefined);
              }
            });
          }).catch(() => {});
        }
      }, 2000);

      const expiryInterval = setInterval(() => {
        const now = Date.now();
        const msgs = getMessages();
        let changed = false;
        msgs.forEach(msg => {
          if (msg.expiresAt && msg.expiresAt <= now) {
            deleteMessage(msg.id);
            if (connected) sendToAll(JSON.stringify({ type: "delete", id: msg.id }));
            changed = true;
          }
        });
        if (changed) setMessages(getMessages().slice());
      }, 1000);

      const startFakeTraffic = () => {
        if (fakeTrafficInterval.current) clearInterval(fakeTrafficInterval.current);
        const sendNoise = () => {
          if (connected) {
            sendToAll(JSON.stringify({ type: "noise", data: Math.random().toString(36) }));
          }
          const delay = 3000 + Math.random() * 2000;
          fakeTrafficInterval.current = setTimeout(sendNoise, delay);
        };
        sendNoise();
      };

      const resetInactivity = () => {
        lastActivity.current = Date.now();
        document.body.style.filter = "none";
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        if (idleBlurTimeout.current) clearTimeout(idleBlurTimeout.current);
        if (connected && sessionTimeout > 0) {
          inactivityTimeout.current = setTimeout(() => {
            destroy();
            window.location.href = '/chat';
          }, sessionTimeout * 60000);
        }
        idleBlurTimeout.current = setTimeout(() => {
          document.body.style.filter = "blur(10px)";
        }, 30000);
      };

      const handlePanic = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
          e.preventDefault();
          getMessages().forEach(m => deleteMessage(m.id));
          setMessages([]);
        }
      };

      document.addEventListener('keydown', handlePanic);
      document.addEventListener('mousedown', resetInactivity);
      document.addEventListener('keydown', resetInactivity);
      resetInactivity();

      const handleBeforeUnload = () => {
        if (connected) {
          sendToAll(JSON.stringify({ type: "disconnect" }));
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        if (connected) {
          sendToAll(JSON.stringify({ type: "disconnect" }));
        }
        clearInterval(uptimeInterval);
        clearInterval(latencyInterval);
        clearInterval(expiryInterval);
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        if (fakeTrafficInterval.current) clearTimeout(fakeTrafficInterval.current);
        if (idleBlurTimeout.current) clearTimeout(idleBlurTimeout.current);
        destroy();
        clearSession();
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('keydown', handlePanic);
        document.removeEventListener('mousedown', resetInactivity);
        document.removeEventListener('keydown', resetInactivity);
      };
    })();
  }, []);



  const sendMessage = () => {
    if (!input.trim()) return;

    const validation = validateMessage(input);
    if (!validation.valid) {
      setError(validation.error || "Invalid message");
      return;
    }

    if (!checkRateLimit("messages", 10, 10000)) {
      setError("Sending too fast. Wait a moment.");
      return;
    }

    const id = crypto.randomUUID();
    const expiresAt = selfDestructTimer > 0 ? Date.now() + selfDestructTimer * 1000 : undefined;
    const sensitive = containsSensitiveContent(input);
    storeMessage({ id, text: input, peerId, isSelf: true, expiresAt, sensitive });
    setMessages(getMessages().slice());

    if (connected) {
      sendToAll(JSON.stringify({ type: "message", id, text: input, expiresAt }));
    } else {
      setMessageQueue((prev) => [...prev, JSON.stringify({ type: "message", id, text: input, expiresAt })]);
    }

    setInput("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let processedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        const stripped = await stripImageMetadata(file);
        const blob = await fetch(stripped).then(r => r.blob());
        processedFile = new File([blob], file.name, { type: file.type });
      } catch {}
    }

    const result = await fileToBase64(processedFile);
    if (!result.success) {
      setError(result.error || "Failed to process file");
      return;
    }

    const id = crypto.randomUUID();
    storeMessage({ id, text: "", peerId, isSelf: true, file: result.fileData });
    setMessages(getMessages().slice());

    const chunks = serializeFileMessage(result.fileData!);

    if (connected) {
      setUploadProgress({ fileName: file.name, sent: 0, total: chunks.length });
      chunks.forEach((chunk, i) => {
        sendToAll(chunk);
        setUploadProgress({
          fileName: file.name,
          sent: i + 1,
          total: chunks.length,
        });
      });
      setTimeout(() => setUploadProgress(null), 2000);
    } else {
      setMessageQueue((prev) => [...prev, ...chunks]);
    }

    e.target.value = "";
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ErrorHandler error={error} />
      {fallbackWarning && (
        <div
          style={{
            padding: 12,
            background: "#ff0",
            color: "#000",
            fontSize: 11,
            textAlign: "center",
            borderBottom: "1px solid #333",
          }}
        >
          Custom server unavailable. Using free public server (0.peerjs.com)
          <button
            onClick={() => setFallbackWarning(false)}
            style={{
              marginLeft: 8,
              padding: "2px 8px",
              background: "#000",
              color: "#ff0",
              border: "none",
              borderRadius: 4,
              fontSize: 10,
              cursor: "pointer",
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
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 16, fontSize: 12, opacity: 0.6 }}>
          Your ID: {peerId.slice(0, 8)}...
        </div>
        <button
          onClick={() => {
            getMessages().forEach(m => deleteMessage(m.id));
            setMessages([]);
          }}
          style={{
            background: "linear-gradient(135deg, #fd0 0%, #fa0 100%)",
            color: "#000",
            border: "none",
            borderRadius: 6,
            padding: "8px 24px",
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🚨</span>
          <span style={{ fontSize: 10 }}>CLEAR ALL</span>
        </button>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <ConnectionStatus connected={connected} connecting={connecting} latency={latency} />
        {fingerprint && (
          <div style={{ marginTop: 8, padding: 8, background: "#1a1a1a", borderRadius: 6, fontSize: 10, textAlign: "center" }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ opacity: 0.6 }}>Fingerprint: </span>
              <span style={{ fontSize: 16, letterSpacing: 2 }}>{fingerprint}</span>
            </div>
            <div>
              <span style={{ opacity: 0.6 }}>Verification code: </span>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: "#0f0" }}>{verificationCode}</span>
            </div>
            <div style={{ opacity: 0.5, fontSize: 9, marginTop: 4 }}>Verify peer sees same code (out-of-band)</div>
          </div>
        )}
        <InviteSection
          peerId={peerId}
          inviteLink={inviteLink}
          connected={connected}
        />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {messages.length > 0 && (
          <div style={{ marginBottom: 12, position: "sticky", top: 0, paddingBottom: 8, zIndex: 10 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              style={{
                width: "100%",
                padding: 8,
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 6,
                color: "#fff",
                fontSize: 10,
                outline: "none",
              }}
            />
          </div>
        )}
        <MessageList 
          messages={messages} 
          searchQuery={searchQuery}
          onDelete={(id) => {
            deleteMessage(id);
            setMessages(getMessages().slice());
            if (connected) sendToAll(JSON.stringify({ type: "delete", id }));
          }}
        />
        {isTyping && (
          <div style={{ opacity: 0.6, fontSize: 11, fontStyle: "italic" }}>
            Peer is typing...
          </div>
        )}
      </div>

      {uploadProgress && <UploadProgress {...uploadProgress} />}
      <div style={{ borderTop: "1px solid #333", padding: "8px 16px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <label style={{ fontSize: 10, opacity: 0.6, whiteSpace: "nowrap" }}>Self-destruct:</label>
          <select
            value={selfDestructTimer}
            onChange={(e) => setSelfDestructTimer(Number(e.target.value))}
            style={{
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            <option value={0}>Never</option>
            <option value={5}>5s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <label style={{ fontSize: 10, opacity: 0.6, whiteSpace: "nowrap" }}>Max messages:</label>
          <select
            value={messageLimit}
            onChange={(e) => {
              const limit = Number(e.target.value);
              setMessageLimit(limit);
              setMaxMessages(limit);
              setMessages(getMessages().slice());
            }}
            style={{
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <label style={{ fontSize: 10, opacity: 0.6, whiteSpace: "nowrap" }}>Timeout:</label>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
            style={{
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            <option value={0}>Never</option>
            <option value={5}>5m</option>
            <option value={15}>15m</option>
            <option value={30}>30m</option>
            <option value={60}>1h</option>
          </select>
        </div>

      </div>
      <MessageInput
        input={input}
        setInput={setInput}
        connected={connected}
        onSend={sendMessage}
        onFileSelect={handleFileSelect}
        onTyping={() => {
          if (!connected) return;
          if (typingDelayTimeout.current) clearTimeout(typingDelayTimeout.current);
          typingDelayTimeout.current = setTimeout(() => {
            sendToAll("__typing__");
          }, Math.random() * 300);
        }}
      />
      <DiagnosticsFooter
        connected={connected}
        connecting={connecting}
        peerId={peerId}
        messageCount={messages.length}
        queueLength={messageQueue.length}
        uptime={uptime}
        error={error}
        fallbackWarning={fallbackWarning}
      />
    </div>
  );
}
