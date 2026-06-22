---
name: webapp-harness
description: "Orchestrates the full Nuxt v4 Fullstack MVP build on Cloudflare Pages — runs architect, frontend, API, database, and QA agents in the correct order, then produces a final summary. Use when: 'build the app', 'start development', 'run the harness', 'implement this feature', 'bắt đầu build', or when the user wants to scaffold a complete feature end-to-end."
---

# Webapp Harness Orchestrator — Nuxt v4 Fullstack MVP

## Phase 0: Context Check / Kiểm tra ngữ cảnh

Before running, check project state:

1. If `_workspace/01_architect_blueprint.md` exists → this is a re-run or extension
   - Ask user: "I found an existing harness run. Do you want to: (a) extend it, (b) rebuild from scratch?"
   - If extend: skip phases whose outputs already exist; run only new or changed phases
   - If rebuild: delete `_workspace/` contents, start from Phase 1
2. If `package.json` is missing → remind user to run `pnpm install` before proceeding
3. If neither → first run on scaffolded project; proceed to Phase 1

## Phase 1: Architecture / Kiến trúc (Sequential)

**Run the architect agent first.** All builder agents depend on its output.

```
Agent(
  subagent_type: "architect",
  description: "Architect — design system blueprint",
  prompt: "Read the project brief from _workspace/00_brief.md if it exists, otherwise ask the user for the feature or app to build. Produce _workspace/01_architect_blueprint.md with: pages list, component tree, D1 schema (snake_case tables), R2 key conventions, KV key conventions, and API contracts table (method, path, Cloudflare binding, request shape, response shape). Active services: D1 (DB), KV, R2 (STORAGE)."
)
```

Wait for completion. Verify `_workspace/01_architect_blueprint.md` exists before continuing.

## Phase 2: Parallel Build / Xây dựng song song

Start all builder agents simultaneously after blueprint is confirmed.

```
# All three run in parallel (run_in_background: true)

Agent(
  subagent_type: "frontend-dev",
  run_in_background: true,
  prompt: "Read _workspace/01_architect_blueprint.md. Build all Nuxt v4 pages, components, and layouts per the blueprint. Follow fullstack-mvp.md conventions: Nuxt UI components, Google Sans, semantic Tailwind only, mobile-first, data-test attributes, Pinia Colada for server data. Log decisions to _workspace/02_frontend-dev_decisions.md."
)

Agent(
  subagent_type: "api-dev",
  run_in_background: true,
  prompt: "Read _workspace/01_architect_blueprint.md. Implement all Nitro API routes in server/api/. Use Cloudflare bindings via event.context.cloudflare.env (DB → useDB(event), KV → useKV(event), STORAGE → env.STORAGE). Validate all input with Zod. Return { data, error, meta } shape. Protect routes with requireUserSession(event). Log to _workspace/02_api-dev_decisions.md."
)

Agent(
  subagent_type: "database-dev",
  run_in_background: true,
  prompt: "Read _workspace/01_architect_blueprint.md. Implement the D1 schema using Drizzle ORM in server/database/schema.ts. Export TypeScript types ($inferSelect). Run pnpm db:generate to produce migration files. If seed data is needed, create server/database/seed.ts."
)
```

Wait for all three to complete before proceeding.

## Phase 3: QA / Kiểm tra (Sequential)

Run QA after all builders complete.

```
Agent(
  subagent_type: "qa",
  run_in_background: false,
  prompt: "Validate integration across all completed modules. (1) Compare API route response shapes against Pinia Colada useQuery usage in frontend components. (2) Compare server/database/schema.ts column names against TypeScript type usages. (3) Verify wrangler.toml binding names (DB, KV, STORAGE) match event.context.cloudflare.env.* usage in server code. (4) Check requireUserSession usage vs useUserSession in components. Output _workspace/qa_final_report.md listing all mismatches with file paths and suggested fixes."
)
```

## Phase 4: Summary / Tổng kết

After QA completes, collect all `_workspace/` outputs and produce a final summary:

- Files created (count by type: pages, components, API routes, DB schema, tests)
- QA issues found (with file:line references from qa_final_report.md)
- Verification commands: `./init.sh` or `pnpm typecheck && pnpm lint && pnpm test:unit`
- Next steps: update `feature_list.json` and `progress.md` per CLAUDE.md workflow

## Error Handling

| Failure | Action |
|---------|--------|
| Architect fails | Retry once. If still failing, stop — cannot proceed without blueprint. |
| Builder agent fails | Retry once. If still failing, note the gap in summary and continue with remaining agents. |
| QA fails | Note issues in summary. Do not block delivery. |
| Conflicting outputs | Keep both files with source labels. Never delete. |

## Data Workspace / Không gian làm việc

```
_workspace/
├── 00_brief.md                    ← write your feature brief here before running
├── 01_architect_blueprint.md      ← architect output (pages, schema, API contracts)
├── 02_frontend-dev_decisions.md   ← UI decision log
├── 02_api-dev_decisions.md        ← API decision log
├── qa_{module}_report.md          ← QA report per module
└── qa_final_report.md             ← final QA summary
```

Preserve all `_workspace/` files — they form the audit trail for the session.
