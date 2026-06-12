import type { H3Event } from 'h3'

export function useKV(event: H3Event) {
  return event.context.cloudflare.env.KV
}
