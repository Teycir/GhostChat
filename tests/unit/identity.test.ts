import { describe, it, expect } from 'vitest'
import { generateIdentity } from '@/lib/identity'

describe('Ephemeral Identity', () => {
  it('should generate unique peer IDs', () => {
    const id1 = generateIdentity()
    const id2 = generateIdentity()
    
    expect(id1.peerId).toBeDefined()
    expect(id2.peerId).toBeDefined()
    expect(id1.peerId).not.toBe(id2.peerId)
  })

  it('should generate valid UUID format', () => {
    const id = generateIdentity()
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    
    expect(id.peerId).toMatch(uuidRegex)
  })
})
