/// <reference types="@cloudflare/workers-types" />

declare module 'nitro-cloudflare-dev' {
  interface CloudflareEnv {
    DB: D1Database
    KV: KVNamespace
  }
}

export {}
