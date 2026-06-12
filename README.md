# Nuxt Fullstack Template

A production-ready Nuxt 4 starter for Cloudflare Pages with auth, database, and KV out of the box.

## Stack

| Layer | Package |
|-------|---------|
| Framework | Nuxt 4 |
| UI | Nuxt UI v4 (Tailwind v4, blue/slate theme, `lg` size default) |
| State | Pinia + Pinia Colada |
| Utils | VueUse |
| Validation | Zod |
| Auth | nuxt-auth-utils (session-based, local + Google/GitHub OAuth) |
| Database | Drizzle ORM + Cloudflare D1 |
| KV | Cloudflare KV |
| Deploy | Cloudflare Pages |

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

## Development

```bash
pnpm dev
```

Cloudflare D1 and KV bindings are available locally via `nitro-cloudflare-dev`. Replace the placeholder IDs in `wrangler.toml` with your real resource IDs before deploying.

## Database

```bash
pnpm db:generate   # generate migrations from schema changes
pnpm db:migrate    # apply migrations to local D1
pnpm db:studio     # open Drizzle Studio
```

Schema lives in `server/database/schema.ts`. Access the DB in server code via `useDB(event)`.

## KV

Access KV in server code via `useKV(event)`.

## Auth

- Local login: `POST /api/auth/login` — replace the hardcoded credential check in `server/api/auth/login.post.ts` with a real DB lookup
- Logout: `POST /api/auth/logout`
- Google OAuth: `/auth/google`
- GitHub OAuth: `/auth/github`

## Verification

```bash
./init.sh          # install + typecheck + lint + unit tests + build
pnpm test:e2e      # E2E tests (on-demand, requires dev server)
```

## Deploy

```bash
pnpm build
```

Deploy the `.output` directory to Cloudflare Pages. Set environment variables in the Cloudflare dashboard.
