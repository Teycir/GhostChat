'use client'

import { useEffect, useState } from 'react'
import { getIdentity } from '@/lib/identity'
import { getMessages, storeMessage } from '@/lib/storage'
import { createPeer, signalPeer } from '@/lib/webrtc'
import { joinRoom, sendSignal, leaveRoom } from '@/lib/signaling'

interface ChatCoreProps {
  roomId: string;
}

export default function ChatCore({ roomId }: ChatCoreProps) {
  const [identity, setIdentity] = useState({ peerId: '' })
  const [messages, setMessages] = useState(getMessages())
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [peerCount, setPeerCount] = useState(0)

  useEffect(() => {
    const id = getIdentity()
    setIdentity(id)

    joinRoom(roomId, id.peerId, (fromPeerId, signal) => {
      if (!signal) {
        const peer = createPeer(
          true,
          fromPeerId,
          (sig) => sendSignal(roomId, fromPeerId, id.peerId, sig),
          (data) => handleIncomingMessage(fromPeerId, data)
        )
        peer.on('connect', () => {
          setConnected(true)
          setPeerCount((c) => c + 1)
        })
      } else {
        const existingPeer = createPeer(
          false,
          fromPeerId,
          (sig) => sendSignal(roomId, fromPeerId, id.peerId, sig),
          (data) => handleIncomingMessage(fromPeerId, data)
        )
        existingPeer.on('connect', () => {
          setConnected(true)
          setPeerCount((c) => c + 1)
        })
        signalPeer(fromPeerId, signal)
      }
    })

    document.addEventListener('visibilitychange', () => {
      document.body.style.filter = document.hidden ? 'blur(10px)' : 'none'
    })

    return () => leaveRoom(roomId, id.peerId)
  }, [roomId])

  const handleIncomingMessage = (fromPeerId: string, data: string) => {
    const msg = {
      text: data,
      peerId: fromPeerId,
      isSelf: false
    }
    storeMessage(msg)
    setMessages([...getMessages()])
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const msg = {
      text: input,
      peerId: identity.peerId,
      isSelf: true
    }

    storeMessage(msg)
    setMessages([...getMessages()])
    
    const { getAllPeers } = require('@/lib/webrtc')
    getAllPeers().forEach((peer) => {
      if (peer.connected) peer.send(input)
    })
    
    setInput('')
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Room: {roomId} | Your ID: {identity.peerId.slice(0, 8)}...
        </div>
        <div style={{ fontSize: 10, opacity: 0.4, marginTop: 4 }}>
          {connected ? `Connected (${peerCount} peers)` : 'Waiting for peers...'}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: 40 }}>
            No messages yet. Start chatting!
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: msg.isSelf ? 'right' : 'left'
            }}
          >
            <div style={{
              display: 'inline-block',
              padding: '8px 12px',
              background: msg.isSelf ? '#0066ff' : '#333',
              borderRadius: 8,
              maxWidth: '70%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #333', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 12,
            background: '#111',
            border: '1px solid #333',
            borderRadius: 8,
            color: '#fff',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          style={{
            padding: '12px 24px',
            background: connected ? '#0066ff' : '#333',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            cursor: connected ? 'pointer' : 'not-allowed',
            fontWeight: 600
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
