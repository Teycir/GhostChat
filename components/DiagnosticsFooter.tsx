"use client";

import { getStats } from "@/lib/bandwidth-monitor";
import { getCurrentProtocol } from "@/lib/peer-protocol-manager";
import { getCurrentWorker } from "@/lib/cloudflare-workers-pool";

interface DiagnosticsFooterProps {
  connected: boolean;
  connecting: boolean;
  peerId: string;
  messageCount: number;
  queueLength: number;
  uptime: number;
  error: string | null;
  fallbackWarning: boolean;
}

export default function DiagnosticsFooter({
  connected,
  connecting,
  peerId,
  messageCount,
  queueLength,
  uptime,
  error,
  fallbackWarning,
}: DiagnosticsFooterProps) {
  const stats = getStats();
  const worker = getCurrentWorker();
  const serverName = worker.includes("teycir")
    ? "CF-1"
    : worker.includes("teycitek")
      ? "CF-2"
      : "PeerJS";

  return (
    <div
      style={{
        padding: "8px 12px",
        background: "#0a0a0a",
        borderTop: "1px solid #333",
        fontSize: 10,
        opacity: 0.8,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "6px 12px",
      }}
    >
      <span>
        Status:{" "}
        <span
          style={{
            color: connected ? "#0f0" : connecting ? "#ff0" : "#f00",
          }}
        >
          {connected ? "Connected" : connecting ? "Connecting" : "Disconnected"}
        </span>
      </span>
      <span>Protocol: {getCurrentProtocol() || "..."}</span>
      <span>ID: {peerId ? peerId.slice(0, 8) : "..."}</span>
      <span>Messages: {messageCount}</span>
      <span>Queue: {queueLength}</span>
      <span>
        Uptime: {Math.floor(uptime / 60)}m {uptime % 60}s
      </span>
      <span>Sent: {(stats.bytesSent / 1024).toFixed(1)}KB</span>
      <span>Recv: {(stats.bytesReceived / 1024).toFixed(1)}KB</span>
      <span title={worker}>Server: {serverName}</span>
      {error && (
        <span style={{ color: "#f00" }}>Error: {error.slice(0, 15)}...</span>
      )}
      {fallbackWarning && <span style={{ color: "#ff0" }}>Fallback</span>}
    </div>
  );
}
