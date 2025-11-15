"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: "90%" }}>
        <img src="/assets/ghostNobg.png" alt="Ghost" style={{ width: "120px", height: "120px", marginBottom: 20 }} className="ghost-icon" />
        <h1 style={{ fontSize: "clamp(32px, 8vw, 48px)", marginBottom: 12, fontWeight: 700 }}>GhostChat</h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 18px)", opacity: 0.7, marginBottom: 32 }} className="vanish-text">Your messages vanish like ghosts</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => router.push("/chat")}
            className="start-btn"
          >
            Start Chatting
          </button>
          <a
            href="https://github.com/Teycir/GhostChat#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="start-btn how-to-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            How to Use
          </a>
        </div>
      </div>
    </div>
  );
}
