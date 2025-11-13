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
      <div style={{ maxWidth: 400, margin: '100px auto', padding: 40, textAlign: 'center' }}>
        <img 
          src="/assets/ghostNobg.png" 
          alt="Ghost" 
          width={80} 
          height={80} 
          style={{ margin: '0 auto 20px', display: 'block' }}
        />
        <h2 style={{ marginBottom: 20 }}>Start New Chat</h2>
        <button
          onClick={() => setJoined(true)}
          style={{
            width: '100%',
            padding: 12,
            background: '#fff',
            border: 'none',
            borderRadius: 12,
            color: '#000',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(255,255,255,0.1)'
          }}
        >
          Create Room
        </button>
        <div style={{
          marginTop: 16,
          fontSize: 10,
          opacity: 0.5,
          textAlign: 'center',
          color: '#999',
          lineHeight: 1.6
        }}>
          Create Room -&gt; Create Link -&gt; Share Link -&gt;<br/>
          Friend Pastes It in Browser Address Bar -&gt; Chat!
        </div>
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
