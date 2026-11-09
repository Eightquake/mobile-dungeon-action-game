# ADR-012: Cloudflare Workers and D1 as the backend for the online features

**Status:** Proposed  
**Date:** 2026-11-09  
**Requirements:** C-001, C-004, C-019, C-020, C-021, C-023, C-028, NFR-025, NFR-026, NFR-027

## Context

ADR-005 allows an optional backend for the online features (UC-017 to UC-022) and leaves the provider to this ADR.
The provider must be free without a trial or a credit card, must stop serving instead of billing when a quota is
exceeded (C-001, C-004), and must let us authenticate, validate, and rate-limit every request (NFR-026) so one abuser
cannot use up the quota for everyone. ADR-010 keeps the Vercel host static, so the backend runs somewhere else. The
backend code is ours and falls under AGPL-3.0 (C-028).

The load is small: a cloud save is one save export per player (a few KB to a few hundred KB), and a leaderboard entry
is one row per player and tier plus its input log. A hobby game with a few hundred players makes a few thousand
requests a day.

### Options

Terms checked on 2026-11-09 on the providers' pricing and limits pages.

| Option | Free-tier terms | For | Against |
|--------|-----------------|-----|---------|
| **A. Cloudflare Workers + D1** | Workers Free: 100,000 requests/day, 10 ms CPU per request. D1 Free: 5 GB, 5 million rows read and 100,000 rows written per day. Over the daily limit, Workers answers with error 1027 (fail closed when configured); KV and D1 operations fail with an error. Free plan, no charge | Our own code, so authentication, validation, and rate limits are exactly what NFR-026 asks; fails closed; daily quotas reset; no inactivity pause; code in this repo under AGPL | We write and run the API ourselves (more code, more attack surface); 10 ms CPU rules out a server-side replay (ADR-014); a Cloudflare account and an API token for deploys |
| B. Firebase Spark (Firestore + Authentication) | No payment method needed. Firestore 1 GiB, 50,000 reads and 20,000 writes per day; Spark services stop at the quota instead of billing. No Cloud Functions on Spark | Managed auth with anonymous sign-in, client SDK, no server code | No server code: every check lives in security rules, and per-player rate limits (NFR-026) are hard to express there; Google's SDK adds to the 5 MB precache budget (NFR-016); upgrading to Blaze is one click and needs a card |
| C. Supabase Free | 500 MB database, 50,000 auth MAU, 500,000 Edge Function calls, 5 GB egress; projects **pause after 1 week of inactivity**; continued overage leads to restrictions (read-only, HTTP 402) under the fair-use policy | Postgres, anonymous sign-ins, Edge Functions for checks | A quiet week pauses the project until the owner unpauses it by hand, so cloud saves and deleting cloud data (C-021) silently stop working; restriction behaviour is policy, not a hard daily cap |
| D. No backend | – | Nothing to run | UC-017 to UC-022 are dropped |

## Decision

Recommended: **Option A, Cloudflare Workers with D1.**

- One Worker serves a small JSON API for the online use cases; its code lives in `backend/` in this repository,
  is TypeScript like the game (ADR-006), and is tested with Vitest.
- D1 holds CLOUD_PLAYER, CLOUD_SAVE, and LEADERBOARD_ENTRY of the entity model. No KV, because its free tier allows
  only 1,000 writes a day.
- The Worker route is set to **fail closed**, so traffic over the daily limit gets an error, never another service.
- Every request is authenticated (ADR-013), every field is validated against the same schema the game uses, and a
  per-player rate limit kept in D1 bounds each player's share of the daily quota (NFR-026). Request bodies are
  capped in size.
- CORS allows only the game's origin on Vercel.
- Deploys use Wrangler from a GitHub Actions job after merge to `main`, with a Cloudflare API token limited to this
  Worker and database as a GitHub secret, never in the repository (C-023).
- The owner watches usage in the Cloudflare dashboard. Whether the free plan offers usage alerts at 80% (NFR-027) is
  checked when the account is created; if not, a scheduled job reads the usage and opens a GitHub issue.

## Consequences

- The game never depends on the backend (NFR-025): every call is made in the background with a timeout, and a 1027
  or any other error only marks the online features unavailable (UC-013 A2).
- We own the API, so its security is ours: input validation, rate limits, and secrets are reviewed like game code.
  The `security` job of ADR-011 covers `backend/` too.
- A deploy secret exists for the first time, which ADR-010 avoided for the frontend.
- The 10 ms CPU limit makes a server-side replay of a whole run impossible on the free plan; ADR-014 decides
  verification with that in mind.
- A Cloudflare account is needed. If Cloudflare changes the free plan to bill or to need a card, the provider is
  re-decided (ADR-005).
- Alternatives considered: Firebase Spark (Option B) is the fallback if writing our own API turns out too costly;
  Supabase (Option C) is ruled out by the inactivity pause.
