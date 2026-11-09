# ADR-008: Deterministic fixed-timestep simulation

**Status:** Accepted  
**Date:** 2026-11-09  
**Requirements:** NFR-001, NFR-007, NFR-017, NFR-022, C-003, C-024

## Context

ADR-005 notes that leaderboards can only be verified later if the game simulation stays deterministic, so that a
submitted run can be replayed from its seed and input log (NFR-022, UC-018 BR-002). The same property makes pausing
and resuming exact (UC-004 BR-001), makes the paused-run snapshot small (NFR-017), and makes combat bugs reproducible
from a recording. A variable timestep would tie game outcomes to frame rate, which breaks all of this and makes combat
feel depend on the device.

JavaScript numbers are IEEE-754 doubles. Addition, subtraction, multiplication, division, and `Math.sqrt` are exactly
rounded and give the same result in every engine. The ECMAScript specification leaves `Math.sin`, `Math.cos`,
`Math.atan2`, `Math.exp`, `Math.pow`, `Math.log`, and similar functions *implementation-approximated*, so V8,
JavaScriptCore, and SpiderMonkey may differ in the last bits, and a replay can drift.

### Options

| Option | For | Against |
|--------|-----|---------|
| **A. Fixed timestep, seeded PRNG, doubles with a deterministic math module** | Readable code with ordinary numbers; only the few non-exact functions need our own implementation | Needs lint rules and a cross-engine test to stay honest |
| B. Fixed timestep with fixed-point integer math everywhere | Determinism by construction | Every formula in fixed-point; harder to read and tune; tuning data needs conversion |
| C. Variable timestep | Simplest loop | Outcomes depend on frame rate; no replay, no exact resume; rejected by NFR-022 |
| D. Server-authoritative simulation | Cheat-proof | Needs a backend in every run; violates C-003 |

## Decision

Decided: **Option A.**

- **Separation.** The simulation (`src/sim/`) is a pure module: state in, inputs in, state out. No DOM, no rendering,
  no audio, no network, no wall-clock, no `Math.random`. It runs headless in Node for tests.
- **Fixed timestep.** The simulation advances in fixed steps; the step rate lives in tuning data (60 steps per second
  recommended for combat feel and hit-stop resolution; 30 is the fallback if measurements on the reference phone
  demand it). The loop uses an accumulator, caps the steps per displayed frame to avoid a spiral of death, and renders
  with interpolation between the last two states (docs/Performance.md).
- **Randomness.** A small seeded PRNG on 32-bit integer operations (for example sfc32 or xoshiro128**) with separate
  streams derived from the run seed for spawning, loot, combat, and enemy behavior, so that a change in one stream
  does not shift the others. Cosmetic randomness (particles, screen shake) uses its own unseeded generator outside the
  simulation and never feeds back.
- **Math.** The simulation imports trigonometry and other non-exact functions only from `src/sim/math`, implemented
  with exact operations (polynomials or lookup tables). Lint forbids the `Math` functions above inside `src/sim/`.
- **Inputs.** Stick input is quantized (direction and strength in fixed steps) and recorded per simulation step
  together with skill presses; this is the input log.
- **Ordering.** Iteration order is explicit: arrays and insertion-ordered maps only, stable sorts with full
  tie-breakers, entity ids from a counter in the state.
- **Snapshot.** The state is plain serializable data, so a paused run (RUN.snapshot) is a direct copy.
- **Version.** A replay is valid only with the same game version (simulation code and tuning data); results carry the
  game version (entity model).
- **Verification.** CI replays golden input logs in Node, Chromium, Firefox, and WebKit and compares a hash of the end
  state (ADR-009, ADR-011).

## Consequences

- Exact pause and resume, reproducible bugs, and a path to verified leaderboards without a server in the run.
- Every contributor must follow the simulation rules; lint and the cross-engine replay test enforce them.
- Interpolated rendering adds up to one simulation step of visual delay; at 60 steps per second this is about 17 ms,
  within the 100 ms of NFR-001.
- Changing tuning data or simulation code invalidates older replays; leaderboard entries keep their game version.
- **Alternatives considered:** B, C, D as in the table. B stays available for single subsystems if the cross-engine
  test ever finds drift that option A cannot fix.
