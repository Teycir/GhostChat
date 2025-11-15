"use client";

import React, { useEffect, useState } from "react";
import { getMessages, storeMessage } from "@/lib/storage";
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

  const initialized = React.useRef(false);
  const peerConnection = React.useRef<any>(null);
  const startTime = React.useRef(Date.now());
  const typingTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const connectionTimeout = React.useRef<NodeJS.Timeout | null>(null);

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
        const fileData = deserializeFileMessage(data);
        if (fileData) {
          storeMessage({
            text: "",
            peerId: fromPeerId,
            isSelf: false,
            file: fileData,
          });
          setMessages(getMessages().slice());
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "file-chunk" || parsed.type === "file") return;
        } catch {}
        storeMessage({ text: data, peerId: fromPeerId, isSelf: false });
        setMessages(getMessages().slice());
        playNotificationSound();
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
        }
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

      return () => {
        clearInterval(uptimeInterval);
        clearInterval(latencyInterval);
        destroy();
        clearSession();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
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

    storeMessage({ text: input, peerId, isSelf: true });
    setMessages(getMessages().slice());

    if (connected) {
      sendToAll(input);
    } else {
      setMessageQueue((prev) => [...prev, input]);
    }

    setInput("");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await fileToBase64(file);
    if (!result.success) {
      setError(result.error || "Failed to process file");
      return;
    }

    storeMessage({ text: "", peerId, isSelf: true, file: result.fileData });
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
        <ConnectionStatus connected={connected} connecting={connecting} latency={latency} />
        <InviteSection
          peerId={peerId}
          inviteLink={inviteLink}
          connected={connected}
        />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {messages.length > 0 && (
          <div style={{ marginBottom: 12, position: "sticky", top: 0, background: "#000", paddingBottom: 8, zIndex: 10 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              style={{
                width: "100%",
                padding: "6px 12px",
                background: "#111",
                border: "1px solid #333",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                outline: "none",
              }}
            />
          </div>
        )}
        <MessageList messages={messages} searchQuery={searchQuery} />
        {isTyping && (
          <div style={{ opacity: 0.6, fontSize: 11, fontStyle: "italic" }}>
            Peer is typing...
          </div>
        )}
      </div>

      {uploadProgress && <UploadProgress {...uploadProgress} />}
      <MessageInput
        input={input}
        setInput={setInput}
        connected={connected}
        onSend={sendMessage}
        onFileSelect={handleFileSelect}
        onTyping={() => connected && sendToAll("__typing__")}
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
