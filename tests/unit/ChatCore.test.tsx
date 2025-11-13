import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatCore from '@/components/ChatCore'

vi.mock('@/lib/webrtc', () => ({
  createPeer: vi.fn(() => ({
    on: vi.fn(),
    send: vi.fn(),
    destroy: vi.fn(),
  })),
}))

vi.mock('@/lib/signaling', () => ({
  initSignaling: vi.fn(() => ({
    announce: vi.fn(),
    listen: vi.fn(),
    cleanup: vi.fn(),
  })),
}))

describe('ChatCore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders chat interface with room name', () => {
    render(<ChatCore roomId="test-room" />)
    expect(screen.getByText(/test-room/i)).toBeInTheDocument()
  })

  it('displays message input and send button', () => {
    render(<ChatCore roomId="test-room" />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('sends message when send button clicked', async () => {
    render(<ChatCore roomId="test-room" />)
    const input = screen.getByPlaceholderText(/type a message/i)
    const sendBtn = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })

  it('clears input after sending message', async () => {
    render(<ChatCore roomId="test-room" />)
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement
    const sendBtn = screen.getByRole('button', { name: /send/i })

    fireEvent.change(input, { target: { value: 'Test' } })
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('does not send empty messages', () => {
    render(<ChatCore roomId="test-room" />)
    const sendBtn = screen.getByRole('button', { name: /send/i })
    
    fireEvent.click(sendBtn)
    
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
