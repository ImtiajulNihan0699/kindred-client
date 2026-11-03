<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kindred client

Community/volunteer events app. Next.js 16 App Router, Tailwind 4, shadcn (`base-nova`), better-auth + MongoDB. Early stage: auth and marketing pages are real; event pages are stubs.

## Commands

- `npm install` — npm only (`package-lock.json`; no pnpm/yarn/bun lockfile).
- `npm run dev`
- `npm run lint` — bare `eslint` with ESLint 9 flat config; lints the whole repo.
- `npx tsc --noEmit` — there is no typecheck script.
- `npm run build`
- No tests or test runner are configured. Verify changes with lint, `tsc`, and (when routing/build config changes) `npm run build`.

## Next.js 16 quirks

- Read `node_modules/next/dist/docs/` before using Next APIs; this version differs from older docs.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`; check the bundled docs for caching/data-fetching implications before adding server data code.
- `next dev` regenerates the `nextjs-agent-rules` block at the top of this file. Keep it in commits.
- CSS is compiled via the `@tailwindcss/turbopack` loader configured in `next.config.ts`; don't add Tailwind/PostCSS config files.

## Layout

- `src/app` — App Router routes. Root layout wraps every page in `ThemeProvider`, `Navbar`, and `Footer`.
- `src/components/ui` — shadcn-generated primitives. The project uses style `base-nova` on `@base-ui/react`, not Radix: use Base UI APIs (e.g. `<PopoverTrigger render={...}>`), not Radix's `asChild`.
- `src/components/{shared,home}` — app components; `src/lib` — auth and utilities.
- Add primitives with `npx shadcn@latest add <name>` instead of hand-writing files in `components/ui`.
- `cn` is re-exported from the npm package `cn` (`src/lib/utils.ts`), not from `clsx`/`tailwind-merge`.
- Tailwind is CSS-first: theme tokens live in `src/app/globals.css` (`@theme inline`); there is no `tailwind.config`.

## Auth and environment

- better-auth + MongoDB. Server config: `src/lib/auth.ts`; client: `src/lib/auth-client.ts`; catch-all handler: `src/app/api/auth/[...all]/route.ts`.
- The database name is hardcoded to `kindredDB`; the connection comes from `MONGODB_URI`.
- Required env (`.env` is gitignored): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_GOOGLE_CLIENT_ID`, `BETTER_AUTH_GOOGLE_CLIENT_SECRET`.
- Email/password and Google OAuth are both enabled. Client components read session state with `authClient.useSession()`; server code imports `auth`.

## Conventions and gotchas

- Most pages are client components (`"use client"`) driven by `authClient` hooks.
- Brand colors are hardcoded hex classes throughout (green `#3F773C`, accent `#F5A51C`, background `#FAFAF6`, border `#E5E9DF`) rather than theme tokens, and dark mode coverage is incomplete. Match the existing style unless asked to migrate.
- `/create-event` and `/manage-events` are placeholders; `Navbar` links to `/upcoming-events`, which has no route yet.
