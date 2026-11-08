# ADR-010: GitHub Pages as static host

**Status:** Proposed  
**Date:** 2026-11-08  
**Requirements:** C-001, C-002, C-015, NFR-016, NFR-021

## Context

ADR-001 delivers the game as a PWA from a free static host (C-002). The host must cost nothing and must not be able
to send a bill (C-001), serve HTTPS (required for service workers), and serve the content-hashed files and the service
worker of ADR-002 (C-015). The repository `Eightquake/mobile-dungeon-action-game` is **public** (checked
2026-11-08). The terms below were checked on 2026-11-08 and must be re-checked before acceptance.

### Options

| Option | Free-tier terms | For | Against |
|--------|-----------------|-----|---------|
| **A. GitHub Pages, deployed by GitHub Actions** | Free for public repositories on GitHub Free (private repositories need a paid plan). Published site max 1 GB, soft bandwidth cap 100 GB/month, deployments time out after 10 minutes; the 10-builds-per-hour soft cap does not apply to custom Actions workflows. No billing possible on a free account. Not for commercial sites or sensitive transactions | Same platform as the code and CI, no new account, deploy from `main` with `actions/deploy-pages`, HTTPS on `eightquake.github.io` | No custom HTTP headers; every file gets a short fixed cache lifetime. Served under a sub-path, so the base path and service worker scope must be set. A future paid one-time purchase would need a new hosting review |
| B. Cloudflare Pages | Free plan: 500 builds/month, 20,000 files per site, 25 MiB per file, no bandwidth limit listed, custom headers via `_headers` | Custom headers, global CDN, unmetered bandwidth | Another account and dashboard; deploy tokens to manage as secrets |
| C. Netlify Free | 300 credits/month; bandwidth costs credits (about 15 GB if nothing else uses them); the pricing page does not say what happens at the limit | Simple deploys, headers support | Credits shrink with traffic; overage behaviour on the free plan must be confirmed before use |
| D. Vercel Hobby | Free for non-commercial use only | Good tooling | Hobby terms forbid commercial use, which the Vision's possible one-time purchase would become |
| E. Codeberg Pages or GitLab Pages | Free | Open alternatives | A second forge next to GitHub, less tooling |

The missing custom headers in option A are acceptable: browsers check the service worker script for updates without
the HTTP cache by default, the hashed assets are served from the service worker's cache, and only the entry HTML is
revalidated, which a short cache lifetime allows (ADR-002).

## Decision

Recommended: **Option A, GitHub Pages deployed by a GitHub Actions workflow from `main`.**

- The workflow builds the production bundle and publishes it with `actions/deploy-pages` after all checks of ADR-011
  pass.
- Vite's `base` and the service worker scope are set to the repository's sub-path.
- No custom domain, since a domain costs money (C-001).
- If custom headers become necessary, or the repository becomes private, this ADR is superseded by one choosing
  option B.

## Consequences

- No new account, secret, or bill; hosting lives next to the code.
- Hosting depends on the repository staying public; making it private stops the site unless a new ADR moves hosting.
- The precache budget (NFR-016) is far below the 1 GB site limit; bandwidth for a hobby audience is far below
  100 GB/month, and CI can report the build size.
- **Alternatives considered:** B to E as in the table.
