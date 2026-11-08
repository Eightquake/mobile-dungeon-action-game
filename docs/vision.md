# [WORKING TITLE] — Vision

> A short-session action RPG for phones where every run is complete in itself, loot changes how you play, and the game never asks for your time when you're not playing.

---

## How to use this document

This is the north star for the game, not a design spec. When a feature idea conflicts with a pillar or a non-goal, **this document wins** unless it is deliberately revised. Revisions should be explicit commits with a stated reason, not quiet drift. If a decision feels hard, ask: *which pillar does this serve, and which does it weaken?*

---

## The player experience

You open the game on the bus, on the couch, or before bed. Within seconds you're in a run. The controls feel tight and every hit lands with weight; clearing a pack is satisfying on its own. A legendary drops and it doesn't just raise a number. It changes what your skills *do*, and you start playing differently mid-run.

Five to ten minutes later the run ends with a clear, satisfying summary: what you found, what you unlocked, how far you climbed. That's a natural place to stop, and the game lets you. If life interrupts mid-fight, you pause and come back later exactly where you were.

Between sessions, nothing is waiting for you. No timers ticking, no rewards expiring, no reason to feel guilty for being away. When you return, the game is glad to see you, but it never needed you to come back.

Over months, your codex of legendary powers grows, you experiment with new combinations, and you push higher on the challenge ladder because you got *better*, not because you put in more hours.

---

## Design pillars

1. **Combat feel first.** Responsive controls, weighty hits, clear feedback. Killing a pack must be fun with zero loot. If combat isn't fun on its own, no amount of loot will fix it.

2. **Loot changes playstyle, not just stats.** Favor items that modify how skills behave over flat percentage bonuses. The best drops make you think "what can I build with this?", not "is this 3% better?"

3. **Permanent collection.** A Cube-style codex where unlocked legendary powers stay available forever. No drop is wasted; every legendary expands what's possible. Because the collection is permanent, it must also be safe: a player's progress is never silently lost, and players can always take their save with them.

4. **Short, suspendable runs.** Around 5–10 minutes, pausable and resumable at any moment. A run fits in the gaps of a real life. Nothing interrupts a run, including updates to the game itself; changes take effect at natural stopping points.

5. **A clear skill ladder.** A tiered, Greater Rift-style challenge that tests build quality and player skill, not time invested. Progress on the ladder should feel earned and legible.

6. **Respect for the player's time.** Generous drops, bad-luck protection, and power that soft-caps so playing well matters more than grinding. An hour of thoughtful play beats ten hours of autopilot.

7. **Healthy sessions by design, never by restriction.** Natural stopping points with a satisfying end-of-run summary. No auto-chaining of runs. At most an opt-in, player-set reminder that never locks or penalizes anything. We shape good habits through good structure, not through punishment.

---

## Non-goals (hard constraints)

These are not trade-offs to revisit casually. They define what this game is not.

- **No microtransactions, gacha, or loot boxes.**
- **No energy systems** or energy meters (not even optional), **no timers, daily quests, login streaks, or idle rewards.**
- **No time-limited content or FOMO.** Any seasons are optional fresh starts with no exclusive rewards.
- **Fully playable offline.**
- **Monetization, if any:** a one-time purchase plus optional real expansions.

---

## Mobile principles

- **Simple inputs, deep interactions.** Virtual stick plus 3–4 skill buttons. Depth comes from how items and skills interact, not from more buttons.
- **Minimal inventory management.** Few gear slots, auto-salvage, and the codex for powers. Time in menus is time not playing.
- **Readable numbers.** Avoid runaway damage scaling. A player should be able to glance at a number and understand it.
- **Play from a link, no store required.** Anyone can start playing from a link and keep the game on their home screen like an app. App stores are an option for later if the game finds an audience, not a cost to pay before anyone has played it.
- **Smooth over spectacular.** Consistent frame pacing on an ordinary mid-range phone matters more than visual flourish. Effects are budgeted, and no build, however powerful, may make the game stutter. Combat feel depends on it.
- **Kind to the device.** A normal session should not drain the battery or overheat the phone. When the game is in the background, it does nothing.

---

## Risks to design against

- **One dominant build killing experimentation.** If everyone plays the same build, pillar 2 has failed. Balance toward many viable builds over a single optimal one.
- **Endgame becoming a grind for passive power.** If the best way to climb is to play more rather than play better, pillars 5 and 6 have failed.
- **Menu and inventory friction on small screens.** Every extra tap between runs erodes the short-session promise.
- **Build power outrunning device performance.** Legendaries that multiply projectiles and effects are the heart of pillar 2, and also the fastest way to break pillar 1. Design powers with the effect budget in mind.
- **Losing a player's collection.** Progress stored on the device can be cleared by things outside the player's control. If a codex disappears, pillar 3 has failed for that player.

---

## References

- **Diablo 3: Reaper of Souls** — the core loop: Greater Rifts, build-defining legendaries, Kanai's Cube.
- **Vampire Survivors, Brotato** — short-run build experimentation that works on mobile.
- **Grimvalor** — premium mobile action feel.
- **Diablo Immortal** — *anti-reference* for monetization and engagement systems.

---

## Open questions

- **Rested bonus?** Considered, currently leaning against. It rewards absence and reintroduces timer pressure, which sits uneasily with pillar 7 and the no-timers non-goal. If included at all, it must be small, capped at roughly one session's worth, and affect only non-essential progress. Undecided.
