# Mona Mayhem

## Project Overview

- Astro 6 application for a GitHub contribution battle arena.
- Application source lives in `src/`; the main page is `src/pages/index.astro`.
- The dynamic API endpoint is `src/pages/api/contributions/[username].ts`.
- The app uses server output with `@astrojs/node` in standalone mode. Keep this behavior unless deployment requirements change.
- TypeScript extends Astro's strict configuration. The separate `docs/` site and `workshop/` materials are not part of the Astro application.
- See [README.md](../README.md) for setup and deployment context.

## Commands

```text
npm install
npm run dev       # Start the local Astro server
npm run build     # Run the production build
npm run preview   # Preview the production build
npx astro check   # Run Astro's type and diagnostics checks when needed
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution is disabled, for example `npm.cmd install`.

## Retro Arcade Design Guide

The battle page (`src/pages/index.astro`) uses a dark retro-arcade visual theme. Follow these conventions when adding or modifying UI.

### Colors

- Background: `--bg: #0d0d0d` (near-black), panels: `--panel: #1a1a1a`.
- Accent colors are defined as CSS custom properties on `:root` and referenced via `var(...)`, never hard-coded inline:
  - `--neon-blue: #3b9bff`
  - `--neon-purple: #8a2be2`
- Use blue for primary/informational elements (title, inputs, button borders, contribution grid borders) and purple for secondary/emphasis elements (subtitle, focus states, totals, VS badge). When introducing a new accent, add it as a new `--neon-*` custom property rather than a literal color value.

### Fonts

- Headings and UI chrome (title, subtitle, button) use **"Press Start 2P"** from Google Fonts, loaded via `<link>` tags in the page `<head>`, with `monospace` as the fallback.
- Body copy and data (inputs, contribution details) use plain `monospace` for readability, since Press Start 2P is hard to read at small sizes/long strings (usernames).

### Animation Style

- Motion should feel like an arcade/CRT display: glowing, pulsing, and shimmering rather than sliding panels or bouncing UI.
- Keep animations subtle and slow (roughly 1.5–3s loops) so the page stays readable; avoid rapid strobing.
- Prefer `opacity`, `color`, `text-shadow`/`box-shadow`, `background-position`, and `transform: scale`/`translate` for effects; avoid layout-shifting animations.
- Always provide a `prefers-reduced-motion: reduce` fallback that disables or significantly tones down looping animations.
- Reuse existing animation patterns where possible: pulsing glow on headings, color-shifting text for loading states, and hover-triggered glow on interactive/data elements (e.g. contribution squares).

## Astro Guidance

- Prefer Astro pages and components for server-rendered UI; add client-side JavaScript only where interaction requires it.
- Keep route files in `src/pages` and use Astro's file-based routing conventions.
- Preserve `export const prerender = false` for API routes that need server execution.
- Type API routes with `APIRoute` and return explicit JSON responses with appropriate status codes and headers.
- Keep secrets and GitHub credentials in environment variables; never hard-code them or commit local `.env` files.
- Run `npm run build` after changes to routes, configuration, or TypeScript. There are currently no repository lint or test scripts.
