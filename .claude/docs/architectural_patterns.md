# Architectural Patterns

## 1. Inline Auth Guard (Better Auth)

Auth is powered by Better Auth with email/password. The server instance lives in `src/lib/auth.ts` and session helpers in `src/lib/auth-session.ts`. The client-side auth client lives in `src/lib/auth-client.ts`.

Every API route and server component calls `getCurrentUser()` from `@/lib/auth-session` at the top. There is no Next.js middleware — auth is duplicated inline.

**API routes** — return 401 JSON:
```
src/app/api/competitions/route.ts
src/app/api/competitions/[competitionId]/route.ts
src/app/api/competitions/[competitionId]/entries/route.ts
src/app/api/competitions/[competitionId]/entries/[entryId]/route.ts
src/app/api/competitions/[competitionId]/leaderboard/route.ts
src/app/api/competitions/[competitionId]/heatmap/route.ts
src/app/api/competitions/join/route.ts
src/app/api/me/route.ts
```

**Server components/layouts** — redirect to `/login`:
```
src/app/(app)/layout.tsx (redirect if no session)
src/app/login/page.tsx (reverse: redirect to / if already logged in)
```

**Auth catch-all route**: `src/app/api/auth/[...all]/route.ts` handles all Better Auth endpoints (sign-in, sign-up, sign-out, etc.).

## 2. Membership Guard

After auth, routes that operate on a specific competition verify the user is a member via the compound unique key `userId_competitionId`.

```
src/app/api/competitions/[competitionId]/route.ts:14-20
src/app/api/competitions/[competitionId]/entries/route.ts:42-48 (POST only)
```

Ownership check for delete uses `entry.userId !== user.id`:
```
src/app/api/competitions/[competitionId]/entries/[entryId]/route.ts:20-24
```

## 3. Async Route Params (Next.js 15+)

Dynamic route params are typed as `Promise` and destructured after `await`. Unused `request` arg is named `_request`.

```
src/app/api/competitions/[competitionId]/route.ts:7-12
src/app/api/competitions/[competitionId]/entries/route.ts:7-12
src/app/api/competitions/[competitionId]/entries/[entryId]/route.ts:7-12
src/app/api/competitions/[competitionId]/leaderboard/route.ts:8-13
src/app/api/competitions/[competitionId]/heatmap/route.ts:8-13
```

## 4. Server Components vs Client Components

**Server components** are used for pages that can fetch data directly with Prisma:
```
src/app/(app)/page.tsx          — Dashboard (reads DB, renders competition grid)
src/app/(app)/layout.tsx        — Auth guard + nav
src/app/login/page.tsx          — Login form (server action)
```

**Client components** (`"use client"`) are used for pages/components with interactivity:
```
src/app/(app)/competitions/[competitionId]/page.tsx  — fetches data via REST
src/app/(app)/competitions/new/page.tsx              — form with local state
src/app/(app)/competitions/join/page.tsx              — form with local state
src/components/*.tsx                                  — all interactive
```

## 5. Auth Client vs REST API

**Auth actions** use the Better Auth client (`src/lib/auth-client.ts`):
- Sign in: `authClient.signIn.email({ email, password })`
- Sign up: `authClient.signUp.email({ name, email, password })`
- Sign out: `authClient.signOut()` with `onSuccess` redirect

**REST endpoints** handle all data mutations (entries, competitions, joins). Client components call these via `fetch()`.

## 6. Client Data Flow: Callback Props + Full Re-fetch

No global state manager. Parent page owns a `fetchData` function (wrapped in `useCallback`) that fetches all data via `Promise.all`. Child components receive mutation callbacks as props.

Parent defines and passes callbacks:
```
src/app/(app)/competitions/[competitionId]/page.tsx:40-60  — fetchData definition
src/app/(app)/competitions/[competitionId]/page.tsx:98     — onEntryAdded={fetchData}
src/app/(app)/competitions/[competitionId]/page.tsx:103    — onEntryDeleted={fetchData}
```

Children accept and invoke on success:
```
src/components/water-input.tsx:7-8     — onEntryAdded prop declaration
src/components/water-input.tsx:27      — called after successful POST
src/components/entries-list.tsx:14-15  — onEntryDeleted prop declaration
src/components/entries-list.tsx:24     — called after successful DELETE
```

No optimistic updates — always waits for server round trip then re-fetches all data.

## 7. Parallel Data Fetching with Promise.all

Used on both server and client to avoid sequential waterfalls.

**Client-side** (competition detail page):
```
src/app/(app)/competitions/[competitionId]/page.tsx:41-45
```

**Server-side** (dashboard rank computation, leaderboard scoring):
```
src/app/(app)/page.tsx:23-43
src/app/api/competitions/[competitionId]/leaderboard/route.ts:20-41
```

## 8. Prisma Client Singleton

Uses `globalThis` caching to survive Next.js hot-module reloads in development. Prisma v7 pattern with `PrismaPg` driver adapter (WASM query engine, no native binary).

```
src/lib/prisma.ts:4-17
```

## 9. Tailwind Component Patterns

Repeated class combinations across the codebase:

- **Card**: `bg-white rounded-lg shadow p-5` — used in every `src/components/*.tsx` wrapper div
- **Primary button**: `bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50`
- **Secondary button**: `border border-gray-300 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50`
- **Text input**: `w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
- **Page container**: `max-w-4xl mx-auto px-4 py-6` (set in app layout `src/app/(app)/layout.tsx:18`)
- **Form container**: `max-w-lg mx-auto` (create/join forms)

## 10. API Error Response Convention

All error responses use shape `{ error: string }` with appropriate HTTP status. No try/catch wrapping — unhandled Prisma errors become 500s from Next.js defaults.

Validation follows early-return pattern: check → return error → continue to happy path.

```
src/app/api/competitions/route.ts:35-37      — 400 missing fields
src/app/api/competitions/join/route.ts:9-11  — 400 missing code
src/app/api/competitions/[competitionId]/entries/route.ts:53-55  — 400 invalid amount
```
