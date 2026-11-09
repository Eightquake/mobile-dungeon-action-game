# ADR-007: Three.js with a fixed tilted camera as renderer

**Status:** Proposed  
**Date:** 2026-11-09  
**Requirements:** C-001, NFR-007, NFR-008, NFR-014, NFR-015, NFR-016, NFR-023

## Context

The Vision puts smooth over spectacular and asks the game to be kind to the device: consistent frame pacing on an
ordinary phone (NFR-007), effect budgets that no build may break (NFR-008), low battery use (NFR-014), and nothing
running in the background (NFR-015). The precache must stay at most 5 MB (NFR-016), every library must be free
(C-001), and the game must run in Safari on iOS and Chrome on Android (NFR-023).

The owner decided on 2026-11-09 how the game looks: **3D with a fixed, tilted three-quarter top-down camera and a
low-poly art style**, in the spirit of the action RPG the Vision names as its reference. The camera follows the hero
but never rotates, and the player never controls it.

The reference phone is an **iPhone 13 Pro**: current Safari with WebGL 2 and WebGPU, and a 120 Hz screen. NFR-023
also covers Chrome on Android, where WebGPU is missing on many phones while WebGL 2 is nearly everywhere.

So the renderer must run on WebGL 2 alone. Three.js requires WebGL 2 since r163; its newer `WebGPURenderer` falls
back to WebGL 2 where WebGPU is missing, and new renderer features go into `WebGPURenderer` rather than
`WebGLRenderer`.

The renderer must not own the game loop or the simulation: ADR-008 needs a fixed-timestep simulation that runs
without rendering, on a flat 2D ground plane, and a renderer that only draws interpolated state. A fixed camera
keeps the game rules the same as in a top-down 2D game: height is only visual.

### Options

| Option | For | Against |
|--------|-----|---------|
| **A. Three.js, `WebGLRenderer`** | The most used 3D library on the web, MIT; mature and well documented; loads glTF models with skeletal animation; instancing for many identical enemies and projectiles; we call `render()` ourselves, so the loop stays ours; works on WebGL 2, so on every target browser | Only rendering: input, audio, collision, and scenes are ours (which ADR-008 wants anyway); new features land in `WebGPURenderer` first |
| B. Three.js, `WebGPURenderer` with WebGL 2 fallback | Where the library is heading; WebGPU on the iPhone, node materials (TSL) | Android phones without WebGPU take the fallback, so we test two backends; larger bundle; younger code |
| C. Babylon.js | Complete 3D engine with tooling, inspector, and physics | Larger bundle; the engine owns more of the loop and the scene, which works against a separate deterministic simulation |
| D. PlayCanvas engine | Fast, MIT, good on mobile | Built around its own editor and entity system; the free editor tier makes projects public; smaller community for questions |
| E. PixiJS v8 (2D) with pre-rendered sprites | Lightest renderer; easiest to keep smooth | Every animation needed in 8 or 16 directions to look 3D; few free sprite sets in that style; contradicts the owner's choice of 3D |
| F. Own renderer on raw WebGL 2 | Smallest, full control | Model loading, skinning, batching, and context-loss handling all built by hand; slow start for a hobby project |

## Decision

Recommended: **Option A, Three.js with `WebGLRenderer`**, the version pinned in `package.json`.

- **Camera:** one `PerspectiveCamera` with a narrow field of view, tilted down at a fixed angle and following the
  hero at a fixed distance. Angle, distance, and field of view are tuning data. The camera never rotates, so
  readability, effect budgets, and touch layout are designed for one view.
- **Style:** low-poly models in glTF binary (`.glb`) with skeletal animation, flat or vertex colors and small shared
  textures. Free assets only (C-001), with their licenses recorded next to them.
- **Lighting:** one directional light plus ambient or hemisphere light, cheap materials (`MeshLambertMaterial` or
  `MeshToonMaterial`), and no real-time shadow maps. Characters get blob shadows (a soft dark disc under the feet);
  floor lighting can be baked into vertex colors or textures.
- **Many objects:** enemies and projectiles of one kind share one geometry and material and are drawn with
  `InstancedMesh` where possible; meshes, effects, and damage numbers come from pools (docs/Performance.md).
- **Loop:** the game loop is ours (ADR-008). Three.js's `setAnimationLoop` is not used; the loop calls `render()`
  once per displayed frame with the interpolation factor.
- **Setup:** antialiasing off by default, with the device-pixel-ratio cap and the frame cap of docs/Performance.md
  applied in the renderer setup.
- **Background and context loss:** on `visibilitychange` to hidden, the loop stops requesting frames (NFR-015).
  When the browser loses the WebGL context, the run pauses as UC-003 A1 describes and the GPU resources are rebuilt on restore.
- **Imports:** only the parts of Three.js we use are imported, so the bundle stays within the precache budget
  (NFR-016), which the CI size check enforces (ADR-011).

## Consequences

- The renderer reads simulation state and owns nothing else, so a later switch, for example to option B when
  WebGPU is available in every target browser, costs only the `src/render/` folder and is a new ADR.
- 3D costs more per frame than 2D sprites. The budgets in docs/Performance.md (triangles, draw calls, animated
  characters, texture memory) are measured on the reference phone before content grows.
- The fixed camera makes free 3D asset packs usable and gives turning in any direction for free, but every model and
  effect has to read well from one angle on a small screen.
- Input, audio, collision, and scene flow are written by us, which keeps the simulation deterministic and headless.
- **Alternatives considered:** B to F as in the table. This ADR replaces the earlier draft that recommended PixiJS
  for 2D; that draft was never accepted.
