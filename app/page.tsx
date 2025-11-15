"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 120, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>
          👻
        </div>
        <h1 style={{ fontSize: 48, marginBottom: 12, fontWeight: 700 }}>GhostChat</h1>
        <p style={{ fontSize: 18, opacity: 0.7, marginBottom: 32 }}>Ephemeral P2P Chat</p>
        <button
          onClick={() => router.push("/chat")}
          style={{
            padding: "16px 48px",
            background: "#fd0",
            color: "#000",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}
