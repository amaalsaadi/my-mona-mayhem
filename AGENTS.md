# Mona Mayhem

## Project Overview

- Astro 6 application for a GitHub contribution battle arena.
- Application source lives in `src/`; the main page is `src/pages/index.astro`.
- The dynamic API endpoint is `src/pages/api/contributions/[username].ts`.
- The app uses server output with `@astrojs/node` in standalone mode. Keep this behavior unless deployment requirements change.
- TypeScript extends Astro's strict configuration. The separate `docs/` site and `workshop/` materials are not part of the Astro application.
- See [README.md](README.md) for setup and deployment context.

## Commands

```text
npm install
npm run dev       # Start the local Astro server
npm run build     # Run the production build
npm run preview   # Preview the production build
npx astro check   # Run Astro's type and diagnostics checks when needed
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution is disabled, for example `npm.cmd install`.

## Astro Guidance

- Prefer Astro pages and components for server-rendered UI; add client-side JavaScript only where interaction requires it.
- Keep route files in `src/pages` and use Astro's file-based routing conventions.
- Preserve `export const prerender = false` for API routes that need server execution.
- Type API routes with `APIRoute` and return explicit JSON responses with appropriate status codes and headers.
- Keep secrets and GitHub credentials in environment variables; never hard-code them or commit local `.env` files.
- Run `npm run build` after changes to routes, configuration, or TypeScript. There are currently no repository lint or test scripts.