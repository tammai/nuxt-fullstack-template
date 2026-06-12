import type { H3Event } from 'h3'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export function useDB(event: H3Event) {
  const { DB } = event.context.cloudflare.env
  return drizzle(DB, { schema })
}
