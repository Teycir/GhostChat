"use client";

interface ConnectionStatusProps {
  connected: boolean;
  connecting: boolean;
  latency?: number;
}

export default function ConnectionStatus({ connected, connecting, latency }: ConnectionStatusProps) {
  const getSignalIcon = () => {
    if (!connected || !latency) return "";
    if (latency < 100) return "🟢";
    if (latency < 300) return "🟡";
    return "🟠";
  };

  return (
    <div
      style={{
        fontSize: 10,
        marginTop: 4,
        color: connected ? "#0f0" : connecting ? "#ff0" : "#f00",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {connected
        ? `✓ Connected ${getSignalIcon()} ${latency ? `${latency}ms` : ""}`
        : connecting
          ? "Establishing connection..."
          : "✗ Disconnected"}
    </div>
  );
}
