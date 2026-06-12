# CLAUDE.md

Nuxt 4 fullstack template targeting Cloudflare Pages. Stack: Nuxt UI, VueUse, Pinia + Pinia Colada, Zod, Drizzle ORM, Cloudflare D1 + KV, nuxt-auth-utils.

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Run `./init.sh`** to verify environment
4. **Read `feature_list.json`** to find the next unfinished feature
5. **Review recent commits** with `git log --oneline -5`

If verification is failing, repair that before adding new scope.

## Working Rules

- **One feature at a time**: pick exactly one `not-started` feature from `feature_list.json`
- **Verification required**: run all checks in `init.sh` before marking a feature done
- **Update artifacts**: update `progress.md` and `feature_list.json` before ending a session
- **Stay in scope**: don't touch files unrelated to the active feature
- **Leave clean state**: next session must be able to run `./init.sh` immediately

## Stack Notes

- Package manager: **pnpm**
- Nuxt version: **4** (`app/` directory layout)
- Cloudflare bindings accessed via `event.context.cloudflare.env` — no NuxtHub
- Local Cloudflare bindings need `nitro-cloudflare-dev` and a `wrangler.toml`
- Auth is session-based via `nuxt-auth-utils` (not JWT)
- DB helper: `useDB(event)` in `server/utils/db.ts`
- KV helper: `useKV(event)` in `server/utils/kv.ts`

## Verification Commands

```bash
./init.sh           # full check: install + typecheck + lint + test:unit + build
pnpm typecheck      # type safety
pnpm lint           # code style
pnpm test:unit      # unit tests (Vitest)
pnpm build          # Cloudflare Pages build
pnpm test:e2e       # E2E tests (Playwright, on-demand — requires dev server)
```

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] `./init.sh` passes (typecheck + lint + unit tests + build)
- [ ] Evidence recorded in `feature_list.json` (`evidence` field) and `progress.md`
- [ ] Repo is restartable from `./init.sh`

## End of Session

1. Update `progress.md` with current state and next action
2. Update `feature_list.json` — set `status` to `"in-progress"` or `"done"`, fill `evidence`
3. Record any blockers or open decisions
4. Commit with a descriptive message

## Escalation

- **Architecture decisions**: ask user
- **Cloudflare binding issues**: check `wrangler.toml` and `cloudflare-env.d.ts` first
- **Repeated typecheck failures**: update `progress.md`, flag for human review
- **Scope ambiguity**: re-read `feature_list.json` for the active feature's description
