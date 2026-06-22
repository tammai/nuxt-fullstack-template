---
name: database
description: "D1 database conventions for this Nuxt v4 project — Drizzle ORM schema patterns, migration workflow, seed data, and query helpers. Use when defining tables, writing migrations, adding columns, seeding data, or working with Drizzle ORM queries against Cloudflare D1."
---

# Database — Drizzle ORM + Cloudflare D1

## Schema File

All tables defined in `server/database/schema.ts`:

```typescript
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at')
})

// Export types for use in API routes and components
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Table name | snake_case, plural | `user_profiles`, `blog_posts` |
| Column name | snake_case | `created_at`, `avatar_url` |
| Primary key | `id INTEGER AUTOINCREMENT` | `id: integer('id').primaryKey({ autoIncrement: true })` |
| Foreign key | `{table}_id` | `user_id: integer('user_id').references(() => users.id)` |
| Timestamp | `TEXT DEFAULT datetime('now')` | `created_at`, `updated_at` |

## Migration Workflow

```bash
# 1. Edit server/database/schema.ts
# 2. Generate migration SQL
pnpm db:generate

# 3. Apply locally
pnpm db:migrate

# 4. Check .wrangler/state/d1/ for local SQLite state
```

**Never edit generated migration files.** If a migration was wrong, create a new one.

## useDB Helper

```typescript
// In any server/api/ route:
const db = useDB(event)  // returns drizzle(env.DB, { schema })

// Select
const users = await db.select().from(schema.users).all()
const user = await db.select().from(schema.users).where(eq(schema.users.id, id)).get()

// Insert
const [newUser] = await db.insert(schema.users).values({ email, name }).returning()

// Update
await db.update(schema.users)
  .set({ updatedAt: new Date().toISOString() })
  .where(eq(schema.users.id, id))

// Delete
await db.delete(schema.users).where(eq(schema.users.id, id))
```

## Relations

```typescript
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] })
}))
```

## Seed Data

Optional `server/database/seed.ts`:

```typescript
import { useDB } from './utils/db'
// Run via: node -e "import('./server/database/seed.ts').then(m => m.seed())"
export async function seed() {
  // insert initial data
}
```

## Skills to Load

- `drizzle` — detailed Drizzle ORM query patterns and advanced usage
- `wrangler` — D1 binding configuration in wrangler.toml
