# ADR-013: Random player key with a recovery code as the online identity

**Status:** Proposed  
**Date:** 2026-11-09  
**Requirements:** C-001, C-019, C-020, C-021, NFR-026

## Context

The online features need to know which cloud save and which leaderboard entries belong to which player, without
storing a password or an email address (C-020), and the player must be able to delete all of it (C-021). The entity
model already names a random `player_key` per device (ONLINE_IDENTITY, CLOUD_PLAYER), and ONLINE_IDENTITY is never
part of a save export.

The open question is OQ-022 (blocking UC-021): how does a player get the same identity on a new phone, so that they
can restore their cloud save there? Losing the phone is the main reason to have a cloud save at all, so the answer
must work without the old phone.

ADR-012 proposes a backend we write ourselves, so any of the options below can be built there.

### Options

| Option | How it works | For | Against |
|--------|--------------|-----|---------|
| **A. Random key + recovery code** | On UC-017 the device makes a random 256-bit player key. The game shows it once as a recovery code (grouped, for example 13 groups of 4 characters in Crockford Base32) with a copy button and asks the player to keep it. On a new device, entering the code restores the identity. The backend stores only a hash of the key | No account, no personal data, no third party; works offline to create; small to build | A lost code means the cloud data can't be reached from a new device (the local save is untouched, C-019); the code is a secret the player must keep safe |
| B. Passkey (WebAuthn) | The device registers a passkey with the backend; the platform syncs it (iCloud Keychain, Google Password Manager) | Nothing to write down; phishing-resistant | Syncs only within one platform, so iPhone to Android fails; more code (WebAuthn server checks); a passkey without a username is unusual UX |
| C. Sign in with an outside provider (Google, Apple, GitHub) | OAuth sign-in; the backend keeps the provider's user id | Familiar; survives a lost phone | The provider learns who plays; Apple sign-in needs a paid developer account (C-001); more personal data than C-020 wants |
| D. Key inside the save export | The player key travels in the save export file (UC-010) | Nothing extra to keep | Contradicts the entity model (ONLINE_IDENTITY is never part of a save export), and anyone given an export could delete the player's cloud data |

## Decision

Recommended: **Option A, a random player key with a recovery code.**

- UC-017 creates the key with the browser's cryptographic random generator and registers it with the display name.
  The backend stores a hash of the key, never the key, and identifies the player by it on every request.
- The game shows the recovery code when the online features are enabled and keeps it viewable in the settings.
  It is never sent anywhere except to the backend.
- On a new device, UC-021 starts by entering the recovery code. The game derives the key, and the backend answers
  only to a matching hash. Wrong codes count against a per-device rate limit (NFR-026).
- UC-022 deletes the CLOUD_PLAYER and everything that hangs off it for the key that asks.
- Passkeys (Option B) can be added later as a second way in, without replacing the code.

## Consequences

- OQ-022 can be answered with this decision once it is Accepted; UC-021 and the glossary then gain the recovery code,
  and the entity model notes that CLOUD_PLAYER.player_key holds a hash.
- A player who loses both the phone and the recovery code loses the cloud copy, and the backend can't help: there
  is no account to recover. The game says this plainly when it shows the code.
- Whoever holds the code controls the cloud data, so the game never logs it, never puts it in a URL, and shows it
  only on request.
- No third party learns anything about the player, and the backend holds no personal data beyond the display name.
- Alternatives considered: passkeys (B) as a later addition; outside sign-in (C) and the key in the export (D)
  ruled out by C-020, C-001, and the entity model.
