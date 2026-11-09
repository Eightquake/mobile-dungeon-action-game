# Performance Guidelines

A living document. Every change follows it (C-027); a change that breaks a budget here is not done. Numbers marked
**TODO** are filled in from measurements on the reference phone, never guessed. When a number is measured, write it
here with the date and the build it was measured on.

Each guideline names the Vision principle it serves:

- **Smooth** — *Smooth over spectacular*: consistent frame pacing on an ordinary mid-range phone matters more than
  visual flourish; effects are budgeted, and no build may make the game stutter.
- **Kind** — *Kind to the device*: a normal session does not drain the battery or overheat the phone; in the
  background, the game does nothing.

Related requirements: NFR-007 (frame pacing), NFR-008 (effect budget), NFR-014 (battery), NFR-015 (idle in
background), NFR-016 (first load size), NFR-001 to NFR-006 (combat feel). Related decisions: ADR-007 (renderer),
ADR-008 (simulation).

## 1. Reference phone — Smooth, Kind

All thresholds are measured on one real phone, not on a desktop browser or an emulator.

| Item                          | Value |
|-------------------------------|-------|
| Reference phone               | iPhone 13 Pro, current iOS, 120 Hz screen. |
| Browser                       | Current Safari on the iPhone. |
| Battery health at measurement | **TODO** — record it with every battery measurement. |
| Frame rate Safari gives a page on the 120 Hz screen | **TODO** — measure before choosing the default frame cap. |
| Slow-motion camera            | iPhone 16 Pro Max at 240 fps (NFR-001; low priority, see section 11). |

## 2. Budgets — Smooth

No combination of items and codex powers may exceed these at any moment. The simulation and the renderer enforce them
(UC-002 A7, UC-002 BR-004); gameplay never depends on whether a visual effect was shown.

| Budget                                     | Limit    | Enforced by |
|--------------------------------------------|----------|-------------|
| Live enemies                               | **TODO** | spawner     |
| Live projectiles (hero and enemies)        | **TODO** | simulation  |
| Live visual effects (particles, decals)    | **TODO** | renderer: oldest dropped first |
| Damage numbers on screen                   | **TODO** | renderer: merged per target |
| Animated (skinned) characters on screen    | **TODO** | spawner |
| Triangles drawn per frame                  | **TODO** | model budget per asset |
| Draw calls per frame                       | **TODO** | instancing and shared materials |
| Dynamic lights                             | 1 directional + ambient (ADR-007) | renderer setup |
| Texture memory                             | **TODO** | shared textures, texture budget |
| Simulation time per step (p95)             | **TODO** | profiler |
| Render time per frame (p95)                | **TODO** | profiler |
| JavaScript heap after a 10-minute run      | **TODO** | profiler |
| Precache size (NFR-016)                    | 5 MB compressed (assumed, OQ-011) | CI budget job |

Legendary powers are designed against these budgets: a power that multiplies projectiles shares the projectile
budget, it does not get its own.

## 3. No allocations in the game loop — Smooth

Garbage-collection pauses are the most common cause of stutter in browser games.

- Enemies, projectiles, effects, damage numbers, and meshes come from **object pools** sized from the budgets above.
  Pools grow only during loading, never during a run.
- The per-step simulation and the per-frame render create **no new objects, arrays, closures, or strings**. Reuse
  scratch vectors; avoid `map`, `filter`, spread, and template strings in hot paths.
- Text that changes every frame (damage numbers, timers) uses pre-rendered glyphs or bitmap fonts, not new text
  objects.
- Check: a 60-second recording in the browser profiler during the stress-test scene shows no major GC pause above
  **TODO** ms.

## 4. Fixed-timestep simulation, interpolated rendering — Smooth

As ADR-008 describes:

- The simulation advances in fixed steps (rate in tuning data); rendering happens once per displayed frame and
  interpolates between the last two simulation states.
- The loop caps the number of simulation steps per frame (**TODO**) so that a slow frame does not cause a spiral of
  slower frames.
- Frame time spikes are measured and reported as the share of frames above 1.5 times the frame interval (NFR-007).

## 5. Cheap 3D — Smooth, Kind

As ADR-007 describes: the camera is fixed and tilted, so everything is built for one view.

- Low-poly models in `.glb` with skeletal animation; flat or vertex colors and small shared textures.
- One directional light plus ambient light, `MeshLambertMaterial` or `MeshToonMaterial`. **No real-time shadow
  maps**: characters get blob shadows; floor lighting is baked into vertex colors or textures.
- Enemies and projectiles of one kind share geometry and material and are drawn with `InstancedMesh` where possible.
- No post-processing passes and antialiasing off by default; turning either on needs a measurement on the reference phone.
- Geometry, materials, and textures are created while loading and reused; nothing is created or disposed during a run,
  except when the browser took the graphics away and the paused run rebuilds them (UC-003 A1).

## 6. Device-pixel-ratio cap — Smooth, Kind

High-density phone screens multiply the pixels to fill without improving readability in motion.

- The canvas renders at `min(devicePixelRatio, cap)` with cap = **TODO** (start measuring at 2).
- The UI (buttons, text) stays sharp through CSS sizing; only the game canvas is capped.

## 7. Default frame cap — Kind, Smooth

- The game renders at most the frame cap the player chose (UC-015). Offered values: 30 and 60.
- Default: **TODO** — chosen after measuring battery use (NFR-014) and frame pacing (NFR-007) at both values. A steady
  30 beats an unsteady 60.
- The cap skips display refreshes in the loop; it never relies on timers.

## 8. Nothing runs in the background — Kind

- On `visibilitychange` to hidden: pause the run (UC-003 A1), stop requesting animation frames, stop audio, and clear
  every timer and interval, within 1 second (NFR-015).
- On `pagehide` and `freeze`: store the run state.
- On return: show the pause screen; nothing resumes without the player (UC-004 BR-002).
- No polling, no background sync, no wake locks. The service worker does nothing but serve files (C-015).

## 9. Loading — Kind, Smooth

- The precache holds the app shell and the first run's assets only (ADR-002); later content is cached on first use.
- Assets are compressed (models as `.glb` with compressed geometry where it pays off, small shared textures, audio in
  a compressed format both target browsers play).
- Nothing loads during a run; the assets a tier needs are ready before the run starts (NFR-009).

## 10. Profiling on real phones — Smooth, Kind

Desktop measurements do not count. Before a change that touches rendering, the simulation, effects, or a legendary
power is merged:

1. Build the production bundle.
2. Open the **stress-test scene** on the reference phone. The scene spawns enemies, projectiles, and effects up to
   every budget of section 2 with the most effect-heavy build in the tuning data, and runs scripted for 60 seconds
   (seeded, so every run is the same).
3. Record frame times with the built-in frame-time overlay (test build) and, for detail, remote debugging
   (Chrome DevTools for Android, Safari Web Inspector for iOS).
4. Check NFR-007: at least 99% of frames within 1.5 times the frame interval, no frame above 100 ms.
5. For battery and heat (NFR-014): play a full 10-minute run from a full charge at room temperature and note the
   battery drop and whether the phone throttles.
6. Write the result in the measurement log below.

## 11. Combat-feel playtest checklist

The combat-feel NFRs are checked by playing on the reference phone. Results go into the acceptance protocol.

| NFR     | Check by playing |
|---------|------------------|
| NFR-001 | Film 10 stick moves and 10 skill presses in 240 fps slow motion (iPhone 16 Pro Max); count frames from touch to visible reaction. Pass: at most 100 ms in 9 of 10. Low priority: run it when input handling or the loop changes, not before every merge. |
| NFR-002 | Film a fight; for 10 hits, name the enemy that was hit from the recording. Pass: 10 of 10, each with reaction and sound. |
| NFR-003 | Play 3 runs; rate "hits feel weighty" from 1 to 5. Pass: 4 or higher. |
| NFR-004 | Play 3 runs with drops switched off (test build); rate clearing a pack from 1 to 5. Pass: 4 or higher. |
| NFR-005 | Measure skill and UI buttons on screen with a ruler. Pass: each at least 9 mm by 9 mm. |
| NFR-006 | Play 10 minutes with constant input. Pass: no zoom, pull-to-refresh, text selection, or context menu. |

## Measurement log

| Date | Build | Phone | Scene | Result | Notes |
|------|-------|-------|-------|--------|-------|
| —    | —     | —     | —     | No measurements yet | — |
