🌐 [Português (Brasil)](README.pt_BR.md) | [Español](README.es.md)

# 🎮 Mona Mayhem

> Build a retro GitHub contribution battle arena with Astro, VS Code, and GitHub Copilot.

**Mona Mayhem** is a hands-on workshop template for building an arcade-style website that compares two GitHub contribution graphs in a playful head-to-head showdown.

This repository is the **starting point**: you'll use GitHub Copilot to plan, scaffold, build, theme, and polish the app step by step.

**Best for:** live workshops, self-guided learning, and anyone who wants a fun project for practicing agentic Copilot workflows.

- 🕹️ **Build something fun** instead of a generic demo app
- 🤖 **Practice real Copilot workflows** in either VS Code or the CLI
- 🧱 **Start from a clean template** with a guided path from idea to finished experience

![Mona Mayhem Screenshot](https://github.com/user-attachments/assets/5eca79e2-cb9f-4e93-aa0d-23666ebde3b7)
*What you'll build by the end of the workshop*

## ✨ Why this repo works well as a workshop

By the end of the workshop, you'll have experience with:

- planning features with Copilot before writing code
- scaffolding Astro pages and API routes
- iterating on UI direction with design-first prompts
- using agentic workflows for implementation, review, and polish

If you want a workshop repo that feels more like a mini game studio than a tutorial app, this is it.

## 📚 Workshop

The workshop supports two tracks — pick the one that matches how you like to build:

- **VS Code track** — Chat, Plan Mode, Agent Mode, background agents, and editor-native review loops
- **CLI track** — `copilot`, `@file` context, `/plan`, autonomous edits, `/fleet`, `/delegate`, and `/review`

| Part | Title | Copilot Focus |
|------|-------|---------------|
| [00](workshop/00-overview.md) | Overview | Track selection and learning goals |
| [01](workshop/01-setup.md) | Setup & Context Engineering | Instructions, permissions, and environment setup |
| [02](workshop/02-plan-and-scaffold.md) | Plan & Scaffold | Planning the API and page architecture |
| [03](workshop/03-agent-mode.md) | Build the Game | Agentic implementation and iteration |
| [04](workshop/04-design-vibes.md) | Design-First Theming | Visual design planning and implementation |
| [05](workshop/05-polish.md) | Polish & Parallel Work | Parallelism, reviews, and quality passes |
| [06](workshop/06-bonus.md) | Bonus & Extensions | Open-ended feature ideas and extra Copilot experiments |

## 🚀 Quick Start

1. **Create your own repo first** by either:
   - clicking **Use this template** to create a new repo, or
   - forking this repository.
2. Choose your workshop path:
   - **VS Code:** clone your repo and open it in VS Code.
   - **GitHub Copilot CLI:** clone your repo locally, install `copilot`, and work from your terminal.
3. Follow the [workshop guide](workshop/00-overview.md)

## 🧭 What you'll find in this repository

- `workshop/` — the guided workshop sequence
- `src/` — the Astro app you’ll build out during the exercises
- `docs/` — supporting documentation and published workshop content
- `public/` — static assets for the site experience

## Prerequisites

### Shared

- GitHub Copilot (Pro, Business, or Enterprise)
- Git
- Node.js

### VS Code track

- VS Code v1.107+
- GitHub Copilot extension signed in

### CLI track

- GitHub Copilot CLI (`copilot`)
- Node.js 22+ if you plan to install the CLI via `npm install -g @github/copilot`
- Or Homebrew / WinGet if you prefer a native package manager install

## Technology Stack

- **Framework**: [Astro](https://astro.build/) v6
- **Runtime**: Node.js with [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) adapter
- **Font**: Press Start 2P (retro gaming font)
- **API**: GitHub's contribution graph API

## Deployment Notes

### Current GitHub Pages setup

The workflow in `.github/workflows/deploy.yml` currently deploys static workshop/docs content from `docs/` and `workshop/` to GitHub Pages. It does not build or deploy the Astro app from `src/`.

### If you want to deploy the Astro app to GitHub Pages

GitHub Pages is static hosting, so the Astro app should use static output.

1. Change `output` in `astro.config.mjs` from `server` to `static`.
2. Remove the Node adapter (`@astrojs/node`) from `astro.config.mjs` and `package.json`.
3. Update the GitHub Actions workflow to run `npm ci` and `npm run build`, then upload `dist/` as the Pages artifact.
4. If deploying to a project page (`https://<user>.github.io/<repo>/`), set `site` and `base` in `astro.config.mjs`.

If you plan to keep API routes running in production, use a server platform instead of GitHub Pages (for example, Vercel, Netlify, or a Node host).

## License

MIT
