# ADR-010: Vercel Hobby as static host

**Status:** Accepted  
**Date:** 2026-11-09  
**Requirements:** C-001, C-002, C-015, C-023, NFR-016, NFR-021

## Context

ADR-001 delivers the game as a PWA from a free static host (C-002). The host must cost nothing and must not be able
to send a bill (C-001), serve HTTPS (required for service workers), and serve the content-hashed files and the service
worker of ADR-002 (C-015). The repository `Eightquake/mobile-dungeon-action-game` is **public** (checked
2026-11-08). The terms below were checked on 2026-11-08; the Vercel terms were re-checked on 2026-11-09 against
`vercel.com/docs/plans/hobby` and `vercel.com/docs/limits/fair-use-guidelines`.

### Options

| Option | Free-tier terms | For | Against |
|--------|-----------------|-----|---------|
| A. GitHub Pages, deployed by GitHub Actions | Free for public repositories on GitHub Free (private repositories need a paid plan). Published site max 1 GB, soft bandwidth cap 100 GB/month, deployments time out after 10 minutes. No billing possible on a free account. Not for commercial sites or sensitive transactions | Same platform as the code and CI, no new account, deploy from `main` with `actions/deploy-pages`, HTTPS on `eightquake.github.io` | No custom HTTP headers; every file gets a short fixed cache lifetime. Served under a sub-path, so the base path and service worker scope must be set. Depends on the repository staying public |
| B. Cloudflare Pages | Free plan: 500 builds/month, 20,000 files per site, 25 MiB per file, no bandwidth limit listed, custom headers via `_headers` | Custom headers, global CDN, unmetered bandwidth | Another account and dashboard; deploy tokens to manage as secrets |
| C. Netlify Free | 300 credits/month; bandwidth costs credits (about 15 GB if nothing else uses them); the pricing page does not say what happens at the limit | Simple deploys, headers support | Credits shrink with traffic; overage behaviour on the free plan must be confirmed before use |
| **D. Vercel Hobby** | Free, no billing cycle. Per month: 100 GB Fast Data Transfer, 1,000,000 CDN requests; 100 deployments per day. When a limit is exceeded, the feature pauses until 30 days have passed; nothing is charged. Non-commercial personal use only (donations are allowed) | Custom headers and cache rules in `vercel.json`, served from the domain root (no sub-path), preview deployment per PR to play on the phone, works for a private repository too | Another account and dashboard; a deploy token to keep as a secret. Hobby terms forbid commercial use, which the Vision's possible one-time purchase would become |
| E. Codeberg Pages or GitLab Pages | Free | Open alternatives | A second forge next to GitHub, less tooling |

## Decision

The owner chose **Option D, Vercel Hobby**, deployed by GitHub Actions with the Vercel CLI.

- **Deploy from CI, not from Vercel's Git integration.** `vercel.json` sets `git.deploymentEnabled` to `false`, so
  Vercel never builds on its own. The deploy job of ADR-011 runs `vercel build` and `vercel deploy --prebuilt --prod`
  only on `main` after all jobs pass. A separate preview job does the same without `--prod` for each pull request
  from this repository after the same jobs pass; it is skipped for pull requests that get no secrets (Dependabot,
  forks). The Vercel CLI is a pinned dev dependency, so the license check of ADR-011 covers it.
- **Secrets.** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` live in GitHub Actions secrets, never in the
  repository (C-023). Deploy and preview jobs run on `push` and `pull_request` only, never on `pull_request_target`
  (ADR-011).
- **Headers.** `vercel.json` serves the service worker script and the entry HTML with `Cache-Control: no-cache`, and
  the content-hashed assets with a long `immutable` lifetime (ADR-002, C-015).
- **Paths.** The game is served from the root of the project's `*.vercel.app` domain; Vite's `base` is `/` and the
  service worker scope is `/`.
- **Static only.** No Vercel Functions, Image Optimization, Analytics, Speed Insights, or other Vercel product is
  used, so no further limit applies. A backend under ADR-005 needs its own ADR.
- No custom domain, since a domain costs money (C-001).

## Consequences

- Hosting no longer depends on the repository staying public; a private repository can still deploy from Actions
  (the CI limits of ADR-011 then apply).
- Custom headers give exact cache control for the service worker and the entry HTML instead of a fixed short lifetime.
- Each PR gets a preview URL the owner can open on the reference phone before merging. Hobby protects previews with
  Vercel Authentication by default, so the owner signs in on the phone once.
- The owner creates the Vercel Hobby account and project, creates the token, and adds the three secrets; agents
  cannot do that.
- If a monthly limit is exceeded, the site pauses for up to 30 days. Installed players keep playing offline (NFR-021);
  only new installs and updates wait. The precache budget (NFR-016) keeps a full first load at most 5 MB, so 100 GB
  is about 20,000 first installs a month.
- **Commercial use is forbidden on Hobby.** Any paid one-time purchase, ads, or paid work on the game needs a new
  hosting ADR first (for example option B, or option A while the repository is public).
- **Alternatives considered:** A, B, C, E as in the table. A was the original recommendation; the owner chose D.
