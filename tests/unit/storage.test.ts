import { describe, it, expect, beforeEach } from 'vitest'
import { storeMessage, getMessages, clearMessages } from '@/lib/storage'

describe('Memory Storage', () => {
  beforeEach(() => {
    clearMessages()
  })

  it('should store messages in memory', () => {
    const msg = { text: 'Hello', peerId: 'peer1', isSelf: true }
    storeMessage(msg)
    
    const messages = getMessages()
    expect(messages).toHaveLength(1)
    expect(messages[0].text).toBe('Hello')
  })

  it('should limit messages to 100', () => {
    for (let i = 0; i < 150; i++) {
      storeMessage({ text: `Message ${i}`, peerId: 'peer1', isSelf: true })
    }
    
    const messages = getMessages()
    expect(messages).toHaveLength(100)
    expect(messages[0].text).toBe('Message 50')
  })

  it('should clear all messages', () => {
    storeMessage({ text: 'Test', peerId: 'peer1', isSelf: true })
    clearMessages()
    
    expect(getMessages()).toHaveLength(0)
  })
})
