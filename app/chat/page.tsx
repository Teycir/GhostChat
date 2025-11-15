'use client'

import { Suspense } from 'react'
import ChatCore from '@/components/ChatCore'
import { useSearchParams } from 'next/navigation'

function ChatContent() {
  const searchParams = useSearchParams()
  const invitePeerId = searchParams.get('peer')

  return <ChatCore invitePeerId={invitePeerId} />
}

export default function Chat() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>}>
      <ChatContent />
    </Suspense>
  )
}
