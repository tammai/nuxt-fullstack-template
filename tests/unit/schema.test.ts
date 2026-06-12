import { describe, it, expect } from 'vitest'
import { users } from '../../server/database/schema'

describe('users schema', () => {
  it('defines expected columns', () => {
    const columnNames = Object.keys(users)
    expect(columnNames).toContain('id')
    expect(columnNames).toContain('email')
    expect(columnNames).toContain('createdAt')
  })
})
