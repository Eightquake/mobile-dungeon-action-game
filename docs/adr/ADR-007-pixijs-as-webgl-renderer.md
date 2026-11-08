# ADR-007: PixiJS as WebGL renderer

**Status:** Proposed  
**Date:** 2026-11-08  
**Requirements:** C-001, NFR-007, NFR-008, NFR-014, NFR-015, NFR-016, NFR-023

## Context

The Vision puts smooth over spectacular and asks the game to be kind to the device: consistent frame pacing on an
ordinary mid-range phone (NFR-007), effect budgets that no build may break (NFR-008), low battery use (NFR-014), and
nothing running in the background (NFR-015). The precache must stay at most 5 MB (NFR-016), and every library must be
free (C-001).

The Vision does not say whether the game is drawn in 2D (top-down or isometric sprites) or in 3D. This ADR assumes
**2D**, because it is the cheapest way to meet NFR-007 and NFR-014 with many enemies and effects on screen. The owner
confirms or overrules this in `docs/STATUS.md`; a 3D answer changes the recommendation to option C.

The renderer must not own the game loop or the simulation: ADR-008 needs a fixed-timestep simulation that runs
without rendering, and a renderer that only draws interpolated state.

### Options

| Option | For | Against |
|--------|-----|---------|
| **A. PixiJS v8** | Mature 2D WebGL renderer with automatic sprite batching and a particle container for many sprites; MIT; tree-shakeable; we can drive rendering manually, so the loop stays ours; WebGL2 with fallback | Only rendering: input, audio, collision, and scenes are ours to build (which ADR-008 wants anyway) |
| B. Phaser | Complete framework: scenes, input, audio, physics | Larger bundle; the framework owns the loop and its physics, which works against a separate deterministic simulation; game logic tends to live in framework objects that cannot be replayed headless |
| C. Three.js | The standard for 3D on the web, MIT | 3D asset pipeline and lighting cost; higher GPU load on mid-range phones; only worth it if the game is 3D |
| D. Babylon.js | Full 3D engine with tooling | Largest bundle; 3D only |
| E. Own renderer on raw WebGL2 | Smallest, full control | Batching, texture atlases, text, and context-loss handling all built by hand; slow start for a hobby project |
| F. Canvas 2D | No dependency | Not WebGL; CPU-bound with many sprites, so it cannot hold NFR-007 under effect-heavy builds |

## Decision

Recommended: **Option A, PixiJS v8 with its WebGL renderer.**

- The game loop is ours (ADR-008). Pixi's automatic ticker is not used; the loop calls the render step once per
  displayed frame with the interpolation factor.
- The WebGL renderer is the default. WebGPU stays off until it is measured on the reference phone.
- Textures come from atlases built at build time; sprites and effects come from pools (docs/Performance.md).
- The device-pixel-ratio cap and the frame cap of docs/Performance.md are applied in the renderer setup.
- On `visibilitychange` to hidden, the loop stops requesting frames (NFR-015); WebGL context loss is handled by
  pausing the run and rebuilding the GPU resources on restore.

## Consequences

- The renderer is replaceable: it reads simulation state and owns nothing else, so a later switch costs only the
  `src/render/` folder.
- Input, audio, collision, and scene flow are written by us, which keeps the simulation deterministic and headless.
- If the owner chooses 3D, this ADR is rejected and a new one recommends Three.js.
- **Alternatives considered:** B to F as in the table.
