# Open Questions

Questions about the specification that the specification does not answer yet. A question is `Resolved` only when
the answer is in the specification itself; **Resolved in** names where. Resolved and withdrawn questions stay as
history.

## OQ-001: Does a legendary's power unlock in the codex automatically when the hero picks the legendary up?

**Element:** FR-013
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Resolved
**Assumed:** (a) The power unlocks automatically when the hero picks up a legendary whose power is not in the codex yet.

The Vision says no drop is wasted and asks for minimal inventory management, but does not say whether unlocking needs a player action (such as sacrificing the item between runs). Readings: (a) automatic on pickup, listed in the end-of-run summary; (b) the player extracts the power from the item between runs.

**Answer:** (b) A sacrifice is made. A legendary whose power is not in the codex yet is kept after its run as a waiting legendary; the player sacrifices it on the end-of-run summary or later in the codex, which adds its power to the codex. Waiting legendaries never expire, so no drop is lost.
**Answered by:** Owner, 2026-11-09
**Resolved in:** FR-013, UC-007, UC-005 step 4, UC-002 A4, Glossary: Waiting Legendary, Entity: WAITING_LEGENDARY

## OQ-002: Is a tier of the challenge ladder cleared by defeating its guardian, without a countdown?

**Element:** FR-016
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) No countdown in a run. A tier clear records the play time, which the challenge ladder view and the leaderboard show as a tie-breaker.

The Vision asks for a tiered challenge in the style of a well-known timed rift system, but its non-goals forbid timers. Readings: (a) a tier is cleared by defeating the guardian, the play time is recorded but nothing counts down; (b) a tier must be cleared within a countdown. The no-timers non-goal reads as real-world timers, so (b) may be allowed, but it is the owner's call.

## OQ-003: Does bad-luck protection count runs without a legendary, or enemies defeated without one?

**Element:** FR-018
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) Per run, with the step size and the cap in tuning data.

The Vision names bad-luck protection without a mechanism. Readings: (a) the legendary drop chance rises after every run that ended without a legendary; (b) it rises with every enemy defeated without a legendary drop.

## OQ-004: Is the play reminder an in-game message only, without system notifications?

**Element:** FR-025
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) In-game only, shown at the end-of-run summary, never during a run, never blocking.

The Vision allows at most an opt-in, player-set reminder that never locks or penalizes. A system notification from a web app needs a notification permission and, while the game is closed, a push service. Readings: (a) an in-game message shown at the next end-of-run summary after the chosen play time; (b) a system notification.

## OQ-005: Is 100 ms from touch to visible reaction the right responsiveness threshold?

**Element:** NFR-001
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Resolved
**Assumed:** 100 ms in 9 of 10 attempts, measured with a 240 fps camera on the reference phone.

The Vision asks for responsive controls without a number. 100 ms is a common limit for an action to feel instant.

**Answer:** Keep 100 ms. The slow-motion check can use an iPhone 16 Pro Max at 240 fps, but it is not a priority to run.
**Answered by:** Owner, 2026-11-09
**Resolved in:** NFR-001

## OQ-006: Is an owner rating of 4 out of 5 over 3 playtest runs an acceptable check for hit weight and fun?

**Element:** NFR-003
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** The owner rates after 3 runs on the reference phone; 4 or higher passes. The same scale applies to NFR-004.

Hit weight (NFR-003) and fun without loot (NFR-004) cannot be measured by a tool. A rating by the owner after a playtest makes them checkable by playing.

## OQ-007: Are 5 seconds and 2 taps from the home screen icon to controlling the hero the right limits?

**Element:** NFR-009
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** At most 5 seconds with the game cached, and at most 2 taps after the title screen appears.

The Vision says that within seconds you are in a run, without a number.

## OQ-008: Are 4 significant digits and a maximum of 99,999 the right limits for readable numbers?

**Element:** NFR-012
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** At most 4 significant digits shown, and no damage or health value above 99,999 at the highest tier.

The Vision asks for readable numbers and no runaway damage scaling, without a limit.

## OQ-009: How is the soft-cap of power measured?

**Element:** NFR-013
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a), measured with a damage benchmark of the simulation.

The Vision says power soft-caps so playing well matters more than grinding. A measurable form needs a benchmark. Readings: (a) a full codex gives at most 1.5 times the damage of the best 3 legendaries for the same build; (b) a cap on total stat bonuses; (c) a cap per tier on the expected clear time.

## OQ-010: Is 4% battery for a 10-minute run the right limit?

**Element:** NFR-014
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** At most 4% of the reference phone's battery for a 10-minute run at default settings.

The Vision says a normal session does not drain the battery or overheat the phone, without a number.

## OQ-011: Is 5 MB the right limit for the files precached on the first visit?

**Element:** NFR-016
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** At most 5 MB, compressed as transferred.

ADR-002 says the precache must stay small, without a number.

## OQ-012: Is the game played in landscape orientation?

**Element:** NFR-024
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Resolved
**Assumed:** Landscape, with a rotate prompt in portrait.

The Vision asks for a virtual stick plus 3 to 4 skill buttons but names no orientation. Two-thumb controls suit landscape; one-handed play on a bus suits portrait. The answer changes the layout of every in-run screen.

**Answer:** Landscape, with the movement stick for one thumb and the skill buttons on the other side of the screen for the other thumb.
**Answered by:** Owner, 2026-11-09
**Resolved in:** NFR-024

## OQ-013: Is 6 the right maximum number of gear slots?

**Element:** C-026
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** At most 6 gear slots.

The Vision asks for few gear slots without a number.

## OQ-014: Which phone is the reference phone for all performance and battery thresholds?

**Element:** Glossary: Reference Phone
**Raised by:** /requirements, 2026-11-08
**Blocking:** No
**Status:** Resolved
**Assumed:** A mid-range Android phone that the owner owns, plus one iPhone for Safari checks; named in Performance.md once chosen.

The Vision says an ordinary mid-range phone. Every performance threshold depends on the device; the owner has to have it at hand to measure.

**Answer:** Two reference phones: an iPhone 13 Pro and a Samsung Galaxy S8.
**Answered by:** Owner, 2026-11-09
**Resolved in:** Glossary: Reference Phone, NFR-023

## OQ-015: Do equipped items carry over from one run to the next?

**Element:** UC-005 BR-003
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) Items belong to one run; every run of a tier starts with the same starting items (UC-001 BR-003).

The Vision makes every run complete in itself and the codex the permanent collection, but does not say whether gear persists. Readings: (a) every run starts with the same starting items, and only codex powers carry over; (b) equipped items carry over between runs.

## OQ-016: Can the player choose which skills the hero takes into a run?

**Element:** FR-003
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** The first version has one hero with a fixed set of 4 skills; skill choice is a later use case if the owner wants it.

The Vision names 3 to 4 skill buttons and a build of items and skills, but no skill choice or hero classes.

## OQ-017: When does a new session start for the play reminder?

**Element:** UC-016 BR-004
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a), with 30 minutes away starting a new session.

A play reminder needs a session play time. Readings: (a) from the launch, or from the return to the game after at least 30 minutes away; (b) from the launch only.

## OQ-018: What is the maximum length of a display name?

**Element:** UC-017 A3
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** 1 to 16 characters.

The leaderboard shows display names on a small screen.

## OQ-019: Does a resumed run wait for the player's first touch before the simulation continues?

**Element:** UC-004 BR-002
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) It waits for the first touch.

The Vision says the player comes back exactly where they were. Readings: (a) the run stays still until the player touches the stick or a skill button; (b) a short countdown; (c) it continues at once.

## OQ-020: Are dropped items collected automatically when the hero comes near them?

**Element:** UC-002 step 9
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) Collected automatically.

The Vision asks for minimal inventory management. Readings: (a) collected automatically within a pickup radius from tuning data; (b) collected by a tap.

## OQ-021: Does the run end when the hero dies, without a revive?

**Element:** UC-002 A2
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** (a) The run ends at the first death.

The Vision says runs are complete in themselves and the ladder tests skill. Readings: (a) the run ends at the hero's first death; (b) a limited number of revives per run.

## OQ-022: How does a player get the same online identity on a new device to restore a cloud save?

**Element:** UC-021
**Raised by:** /use-case-spec, 2026-11-08
**Blocking:** Yes
**Status:** Open

UC-021 needs the online identity that stored the cloud save, but how a player carries that identity to a new phone (recovery code, sign-in with an outside identity provider, or another way) is the identity decision that ADR-005 leaves to a later ADR.

## OQ-023: Does salvaging an item yield anything?

**Element:** Glossary: Salvage
**Raised by:** /spec-review fix, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** Salvage yields nothing. Items belong to one run, and a legendary whose power is not in the codex yet is kept as a waiting legendary instead of being salvaged (UC-007 BR-003).

The Vision asks for auto-salvage but names no salvage reward, and no use case would spend one. A reward would need a currency, which adds menu time between runs.

## OQ-024: Does an abandoned run count for bad-luck protection?

**Element:** UC-005 BR-004
**Raised by:** /spec-review fix, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** No. Only runs that end with a tier clear or the hero's death count, so starting and abandoning runs never raises the legendary drop chance.

Counting abandoned runs would reward time spent over skill (pillars 5 and 6).

## OQ-025: May a paused run be resumed on a newer game version after an update?

**Element:** UC-004 A1
**Raised by:** /spec-review fix, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** Yes. The stored run is migrated when the update takes effect at launch and can be finished, but it is marked as played on two versions and never submitted to the leaderboard, since it cannot be replayed.

ADR-003 says a suspended run must survive an update. A deterministic replay needs one game version per run (NFR-022). The alternative is to hold the update back until no stored run exists, which can delay an update indefinitely.

## OQ-026: How many restorable copies does the game keep?

**Element:** UC-011 BR-003
**Raised by:** /spec-review fix, 2026-11-08
**Blocking:** No
**Status:** Open
**Assumed:** The 3 most recent, whatever replaced the save (import, cloud restore, failed migration).

One copy could be pushed out at once by the next replacement, and that would break the promise that progress is never silently lost.
