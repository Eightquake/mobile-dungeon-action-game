# 0004. Saves in IndexedDB with export and import

- Status: Accepted
- Date: 2026-11-08

## Context

The Vision makes the codex of legendary powers a permanent collection and says a player's progress must never be silently lost, and that players can always take their save with them. The game must work fully offline, so saves live on the device. Optional cloud saves (ADR 0005) are a backup on top of the local save, never a replacement for it. Browsers can clear site storage, and on iOS this can happen for sites not added to the home screen.

## Decision

- Saves are stored in IndexedDB. The Cache API is for files only and is not used for saves.
- The game requests persistent storage (`navigator.storage.persist()`) so the browser is less likely to evict the save.
- The save format carries a version number from the first release. Every format change ships with a migration from the previous version.
- Players can export their save and import it again, for example as a file or a copyable code. This works offline and needs no account.
- The game encourages adding it to the home screen, since that protects storage on iOS.

## Consequences

- Progress is safe without accounts or servers, and players own their save.
- Export and import make save editing trivial. Accepted, see ADR 0001.
- Imported saves are untrusted input. They must be validated and must never crash the game or corrupt an existing save.
- Every save format change costs a migration and a test, which is the price of keeping pillar 3's promise.
