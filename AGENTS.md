<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kindred client

Community/volunteer events app. Next.js 16.4.3 (App Router), React 19.3.0, Tailwind 4 (CSS-first), shadcn `base-nova` on `@base-ui/react`, better-auth + MongoDB. Most pages are client components using `authClient` hooks.

## Commands

- `npm install` — npm only (`package-lock.json`; no pnpm/yarn/bun lockfile).
- `npm run dev` — Next dev server.
- `npm run lint` — `eslint` (ESLint 9 flat config, `eslint-config-next/core-web-vitals` + `typescript`); lints whole repo.
- `npx tsc --noEmit` — no typecheck script.
- `npm run build` / `npm run start`
- No tests configured. Verify with lint, `tsc`, and `npm run build` if routing/build config changes.

## Next.js / build quirks

- Read `node_modules/next/dist/docs/` before using Next APIs (version differs from older docs).
- `next.config.ts`: `cacheComponents: false`, `partialPrefetching: false`, `reactCompiler: true` (`babel-plugin-react-compiler`), `experimental.agentFeedback: true`. Images allow `i.ibb.co` and `i.ibb.co.com`.
- CSS compiled via `@tailwindcss/turbopack` loader in `next.config.ts` turbopack rules; no Tailwind/PostCSS config files. Theme tokens in `src/app/globals.css` (`@theme inline`).
- `next dev` regenerates the nextjs-agent-rules block at top — keep it in commits.

## Layout & UI

- `src/app` (App Router). Root layout (`src/app/layout.tsx`) wraps pages in `ThemeProvider`, `Navbar`, `Footer` with fonts Inter/Lora.
- `src/components/ui` — shadcn primitives (style `base-nova`, `@base-ui/react`). Use Base UI APIs (e.g. `<PopoverTrigger render={...}>`), not Radix `asChild`. Add via `npx shadcn@latest add <name>`.
- `src/components/{shared,home,events}` — app components; `src/lib` — auth/utilities.
- `cn` re-exported from npm package `cn` (`src/lib/utils.ts`), not `clsx`/`tailwind-merge`.
- Routes: auth (`/signin`, `/signup`), events under `/events/*` (`upcoming-events`, `explore-events`, `create-event`, `manage-events`, `joined-events`, `[id]`), `/profile`. Navbar links point to `/events/*`.

## Auth & environment

- better-auth + MongoDB. Server: `src/lib/auth.ts` (MongoClient, db name hardcoded `kindredDB` from `MONGODB_URI`, adapter `@better-auth/mongo-adapter`). Client: `src/lib/auth-client.ts` (`createAuthClient`, uses `process.env.BETTER_AUTH_URL`). Handler: `src/app/api/auth/[...all]/route.ts`.
- Email/password and Google OAuth enabled. Client reads session via `authClient.useSession()`; server imports `auth`.
- Required env (`.env` gitignored): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_GOOGLE_CLIENT_ID`, `BETTER_AUTH_GOOGLE_CLIENT_SECRET`.

## Backend API (separate service)

- Event pages call a separate backend at `http://localhost:8000` (e.g. `GET /events`, `GET /events/user/:userId`, `POST /events`). This is not mocked in the Next app.

## Conventions & gotchas

- Most pages are client components (`"use client"`) driven by `authClient` hooks.
- Brand colors are hardcoded hex classes (green `#3F773C`, accent `#F5A51C`, background `#FAFAF6`, border `#E5E9DF`) rather than theme tokens; dark mode coverage incomplete. Match existing style.
- Images from ImgBB allowed via Next image remote patterns.
