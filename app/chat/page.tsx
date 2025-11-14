'use client'

import { useState, useEffect, Suspense } from 'react'
import ChatCore from '@/components/ChatCore'
import { useSearchParams } from 'next/navigation'

function ChatContent() {
  const searchParams = useSearchParams()
  const invitePeerId = searchParams.get('peer')
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (invitePeerId) {
      setJoined(true)
    }
  }, [invitePeerId])

  if (!joined) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: '#000',
        color: '#fff'
      }}>
        <img
          src="/assets/ghostNobg.png"
          alt="Ghost"
          width={180}
          height={180}
          style={{ marginBottom: 30, opacity: 0.9 }}
        />
        <h1 style={{
          fontSize: 64,
          marginBottom: 16,
          fontWeight: 700,
          letterSpacing: -1
        }}>
          GhostChat
        </h1>
        <p style={{
          fontSize: 22,
          marginBottom: 50,
          opacity: 0.7,
          maxWidth: 500,
          textAlign: 'center',
          lineHeight: 1.5
        }}>
          Your messages vanish like ghosts. <br />
          Direct P2P chat with zero traces.
        </p>
        <button
          onClick={() => setJoined(true)}
          style={{
            padding: '18px 48px',
            background: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,255,255,0.1)'
          }}
        >
          Start Chatting
        </button>
      </div>
    )
  }

  return <ChatCore invitePeerId={invitePeerId} />
}

export default function Chat() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
      <ChatContent />
    </Suspense>
  )
}
