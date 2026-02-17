# Water Tracker

Competitive drinking water tracker for office employees. Users create/join competitions, log daily water intake, view GitHub-style activity heatmaps, and compete on a leaderboard scored by volume + consistency.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5 (strict)
- **Database**: PostgreSQL 16 (Docker) + Prisma 7 ORM with `@prisma/adapter-pg` driver adapter
- **Styling**: Tailwind CSS v4
- **Auth**: Better Auth (email/password) with Prisma adapter + `nextCookies()` plugin
- **Utilities**: `nanoid` (invite codes), `date-fns` v4 (date math)

## Commands

```bash
docker compose up -d                    # Start PostgreSQL
npx prisma migrate dev --name <name>    # Apply schema changes
npx prisma generate                     # Regenerate Prisma client
npm run dev                             # Start dev server (Turbopack)
npm run build                           # Production build
npx tsc --noEmit                        # Type-check without emitting
```

## Project Structure

```
src/
├── lib/                    # Singletons + pure business logic
│   ├── prisma.ts           # DB client (globalThis singleton with PrismaPg adapter)
│   ├── auth.ts             # Better Auth server instance (config + Prisma adapter)
│   ├── auth-session.ts     # getSession/getCurrentUser helpers for server components/API routes
│   ├── auth-client.ts      # createAuthClient() for client components
│   └── scoring.ts          # Volume + streak scoring (pure functions)
├── app/
│   ├── layout.tsx          # Root HTML shell (fonts, Tailwind)
│   ├── globals.css         # Tailwind base import
│   ├── login/page.tsx      # Public login page (server component)
│   ├── (app)/              # Auth-guarded route group (redirect if no session)
│   │   ├── layout.tsx      # Auth guard + nav bar
│   │   ├── page.tsx        # Dashboard — server component, lists competitions
│   │   └── competitions/   # new/, join/, [competitionId]/ pages
│   └── api/                # REST endpoints
│       ├── auth/[...all]/   # Better Auth catch-all handler (GET + POST)
│       ├── me/             # GET current user (for client components)
│       └── competitions/   # CRUD, join, entries, leaderboard, heatmap
└── components/             # Reusable client components (flat directory)
```

Key directories:

- `prisma/` — Schema definition + migrations. Config in root `prisma.config.ts`
- `src/generated/prisma/` — Auto-generated Prisma client (gitignored)

## Database

Schema lives in `prisma/schema.prisma`. Seven models:

- **User** — identified by unique `email`, has `name`, relations to sessions/accounts
- **Session** — Better Auth session (token, expiresAt, ipAddress, userAgent)
- **Account** — Better Auth account (providerId, password for credentials)
- **Verification** — Better Auth email verification tokens
- **Competition** — has `inviteCode` (nanoid), date range, creator
- **CompetitionMember** — join table with `@@unique([userId, competitionId])`
- **WaterEntry** — `amount` (ml, Int), `date` (@db.Date), indexed on `[userId, competitionId, date]`

Prisma v7: `datasource` block has `provider` only — URL is configured in `prisma.config.ts:11`.

## API Shape

All API routes return JSON. Error shape: `{ error: string }`. Success shape: resource object or `{ success: true }`.

Status codes used: 200, 201, 400, 401, 403, 404.

REST endpoints:

- `GET/POST /api/competitions` — list user's competitions / create + auto-join
- `POST /api/competitions/join` — join by invite code `{ code }`
- `GET /api/competitions/[id]` — competition details (members only)
- `GET/POST /api/competitions/[id]/entries` — list/add water entries
- `DELETE /api/competitions/[id]/entries/[entryId]` — remove entry (owner only)
- `GET /api/competitions/[id]/leaderboard` — ranked scores
- `GET /api/competitions/[id]/heatmap?month=YYYY-MM` — daily totals for heatmap
- `GET /api/me` — current user id + name

## Scoring (src/lib/scoring.ts)

- `volumeScore = totalMl / 1000` (1 point per liter)
- `streakScore = longestStreak * 2` (2 points per consecutive day with entries)
- `combinedScore = volumeScore + streakScore`

Streak = longest run of consecutive calendar days with at least one entry.

## Naming Conventions

- Files: **kebab-case** (`water-input.tsx`, `entries-list.tsx`)
- Dynamic route params: **camelCase** in brackets (`[competitionId]`)
- Page exports: `export default function XxxPage()` / `XxxLayout()`
- Component exports: `export function ComponentName()` (named exports)
- Auth client calls: `authClient.signIn.email()`, `authClient.signUp.email()`, `authClient.signOut()`
- Props interfaces: `ComponentNameProps`, co-located in same file

## Adding New Feature or Fixing Bugs

**IMPORTANT**: When you work on a new feature or bug, create a git branch first. Then, work on change in that branch for the remainder of the session.

## Additional Documentation

When working on specific areas, check these files for relevant patterns:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) — auth guard pattern, data flow, state management, component conventions
