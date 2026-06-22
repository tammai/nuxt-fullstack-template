---
name: api-development
description: "Nitro API route conventions for this Nuxt v4 project — Cloudflare binding patterns (D1, KV, R2), auth guards, Zod validation, error handling, and response shape. Use when writing or reviewing server/api/ routes, adding Cloudflare service calls, implementing auth-protected endpoints, or debugging Nitro event handler issues."
---

# API Development — Nitro + Cloudflare

## Route File Naming

```
server/api/users.get.ts       → GET /api/users
server/api/users.post.ts      → POST /api/users
server/api/users/[id].get.ts  → GET /api/users/:id
server/api/users/[id].put.ts  → PUT /api/users/:id
server/api/users/[id].delete.ts → DELETE /api/users/:id
```

## Canonical Route Template

```typescript
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

export default defineEventHandler(async (event) => {
  // 1. Auth guard (omit for public routes)
  const session = await requireUserSession(event)

  // 2. Input validation
  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  // 3. Business logic with Cloudflare bindings
  const db = useDB(event)
  // ... query db ...

  // 4. Consistent response shape
  return { data: result, error: null, meta: {} }
})
```

## Cloudflare Bindings

```typescript
// D1 — Drizzle ORM (preferred)
const db = useDB(event)  // returns drizzle(env.DB, { schema })
const users = await db.select().from(schema.users).all()

// D1 — raw prepared statement (fallback)
const { DB } = event.context.cloudflare.env
const row = await DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()

// KV
const kv = useKV(event)  // returns env.KV
await kv.put('session:abc', JSON.stringify(data), { expirationTtl: 3600 })
const val = await kv.get('session:abc')

// R2
const { STORAGE } = event.context.cloudflare.env
await STORAGE.put(`avatars/${userId}.jpg`, body, { httpMetadata: { contentType: 'image/jpeg' } })
const obj = await STORAGE.get(`avatars/${userId}.jpg`)
// obj?.body is a ReadableStream
```

## Auth Patterns

```typescript
// Require session — throws 401 if not logged in
const session = await requireUserSession(event)
const { user } = session

// Optional session — returns null if not logged in
const session = await getUserSession(event)
```

## Error Handling

```typescript
// 400 Bad Request
throw createError({ statusCode: 400, statusMessage: 'Email is required' })

// 401 Unauthorized (handled by requireUserSession)
// 403 Forbidden
throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })

// 404 Not Found
throw createError({ statusCode: 404, statusMessage: 'User not found' })

// 500 — never expose internal details
throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
```

Never expose database errors, stack traces, or internal field names to the client.

## Response Convention

Always return `{ data, error, meta }`:

```typescript
// Success
return { data: user, error: null, meta: { total: 1 } }

// No content (204-equivalent via null)
return { data: null, error: null, meta: {} }
```

## R2 Key Naming Convention

```
avatars/{userId}.{ext}
uploads/{featureSlug}/{uuid}.{ext}
exports/{userId}/{timestamp}.csv
```

Always use UUID or deterministic keys — never user-supplied filenames (path traversal risk).

## Nuxt v4 Server Docs

For the latest Nitro server route, middleware, and server utility APIs:

```
WebFetch("https://nuxt.com/llms-full.txt", "Find server routes, Nitro, and server utilities documentation")
```

## Skills to Load

- `nuxt4-patterns` — load first for SSR modes, route rules, and data fetching patterns
- `wrangler` — for D1/KV/R2 binding configuration and wrangler.toml syntax
- `zod` — for input validation schemas
- `drizzle` — for Drizzle ORM query patterns
