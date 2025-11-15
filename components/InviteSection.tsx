"use client";

import { useState } from "react";
import { generateQRCode } from "@/lib/qr-code";

interface InviteSectionProps {
  peerId: string;
  inviteLink: string;
  connected: boolean;
}

export default function InviteSection({
  peerId,
  inviteLink,
  connected,
}: InviteSectionProps) {
  const [linkCreated, setLinkCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (connected) return null;

  return (
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
                Share this link with peer:
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
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                      console.error("Clipboard failed:", err);
                    }
                  }}
                  style={{
                    padding: "6px 12px",
                    background: copied ? "#2d5" : "#fff",
                    border: "none",
                    borderRadius: 6,
                    color: copied ? "#fff" : "#000",
                    fontSize: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={() => setShowQR(!showQR)}
                  style={{
                    padding: "6px 12px",
                    background: "#333",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  {showQR ? "Hide QR" : "Show QR"}
                </button>
              </div>
              {showQR && (
                <div
                  style={{
                    marginTop: 12,
                    marginBottom: 12,
                    padding: 16,
                    background: "#fff",
                    borderRadius: 12,
                    display: "inline-block",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <img
                    src={generateQRCode(inviteLink)}
                    alt="QR Code"
                    style={{
                      display: "block",
                      width: "180px",
                      height: "180px",
                      imageRendering: "pixelated",
                    }}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 9,
                      color: "#666",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    Scan to join chat
                  </div>
                </div>
              )}
            </>
          )}
          <div style={{ opacity: 0.6, fontSize: 10 }}>
            Peer must paste it in their browser or scan QR code to start chat
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
  );
}
