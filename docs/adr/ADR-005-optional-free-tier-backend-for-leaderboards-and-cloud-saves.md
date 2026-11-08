# ADR-005: Optional free-tier backend for leaderboards and cloud saves

**Status:** Accepted  
**Date:** 2026-11-08  
**Requirements:** C-001, C-004, C-019, C-020, C-021, C-022, NFR-025, NFR-026, NFR-027

## Context

The game is fully playable offline (Vision non-goal) and runs on the player's device (ADR-001). Two features would benefit from a server: leaderboards for the challenge ladder, and cloud saves so a player's collection survives a lost phone or can move between devices.

The project must cost nothing. Free tiers change over time, some expire after a trial period, and some providers bill automatically once a quota is exceeded. A hobby backend that is abused or goes viral must not be able to create a bill.

## Decision

A cloud backend is allowed for leaderboards and cloud saves, under these rules:

- **Optional and additive.** Every backend feature is opt-in. The game is fully playable without it, and a backend that is down, rate-limited, or out of quota never blocks or degrades play. Offline remains the default.
- **Free tier only, and it must fail closed.** Use only free tiers that do not expire (no trial credits). Prefer providers where exceeding a quota stops the service instead of billing, or where a hard spending cap is possible. If neither is possible, the provider is not used.
- **The device stays the source of truth for saves.** Cloud saves are backup and sync on top of the local save (ADR-004). A sync never silently overwrites progress; conflicts are resolved in a way the player can see.
- **Minimal personal data.** Store as little as possible about players. Avoid storing passwords or email addresses ourselves. Players can delete their cloud data. The design must be compatible with GDPR.
- **No engagement mechanics through the back door.** Leaderboards must respect the Vision: no time-limited rewards, no FOMO, no reset schedules that pressure players to log in.
- **Secure by default.** The backend is attack surface. It authenticates requests, validates all input, rate-limits every endpoint (which also protects the free quota), and keeps secrets out of the repo.

The choice of provider, identity approach, and leaderboard verification are separate decisions, written as Proposed ADRs for the owner.

## Consequences

- Leaderboards reopen the cheating question from ADR-001. Without a server-authoritative simulation, any score can be faked. Leaderboards are treated as for-fun until a verification approach is decided; keeping the game simulation deterministic keeps replay-based verification possible later.
- Backend features are built after the core game, each from its own use case, and never on the critical path of a run.
- Free-tier terms must be re-checked when choosing a provider and whenever the provider changes its pricing. Quota usage should be visible so the owner notices before limits are reached.
- More moving parts: deployment, monitoring, and a security surface that the static game alone did not have.
