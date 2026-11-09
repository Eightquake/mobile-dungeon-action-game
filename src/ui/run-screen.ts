// The run screen (UC-001 steps 4 and 5, UC-002 step 2): creates the run, shows the 3D view and the virtual stick,
// and hands control of the hero to the player. Loaded on demand, so the title screen never waits for Three.js.
import { createRunView } from '../render/scene';
import { createRun, step, TIERS, TUNING, type RunState } from '../sim';
import { createGameLoop } from './game-loop';
import { createStick } from './stick';

/** A new run seed. Randomness is fine here: the seed is an input of the simulation, not part of it (ADR-008). */
export function newSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
}

export function startRun(root: HTMLElement, tierId: number): RunState {
  // UC-001 step 4. No save exists before walking skeleton PR 4, so no tier is cleared and no codex power equipped.
  const run = createRun(
    { seed: newSeed(), tierId, highestCleared: 0, codexPowers: [] },
    TUNING,
    TIERS,
  );
  const tier = TIERS[run.tierId - 1];
  if (!tier) throw new RangeError(`No tier ${run.tierId}`);

  const screen = document.createElement('section');
  screen.className = 'run-screen';
  screen.setAttribute('aria-label', 'Run');
  const canvas = document.createElement('canvas');
  canvas.className = 'run-canvas';
  screen.append(canvas);
  root.replaceChildren(screen);

  const view = createRunView(canvas, TUNING, tier);
  // UC-001 step 5: the virtual stick hands control of the hero to the player. The skill buttons arrive with UC-002
  // step 3 and the pause button with UC-003 (walking skeleton PR 4).
  const stick = createStick(screen, TUNING.stick);
  const loop = createGameLoop(
    TUNING.simulation.steps_per_second,
    TUNING.simulation.max_steps_per_frame,
    {
      step: () => step(run, stick.input, TUNING, tier),
      render: (alpha) => view.render(run, alpha),
    },
  );

  addEventListener('resize', view.resize);
  // NFR-015: a hidden game requests no frames. Nothing resumes without the player (UC-004 BR-002); until the pause
  // screen of UC-003 arrives in walking skeleton PR 4, a Continue button stands in for it.
  const resume = document.createElement('button');
  resume.className = 'run-continue';
  resume.textContent = 'Continue';
  resume.hidden = true;
  resume.addEventListener('click', () => {
    resume.hidden = true;
    loop.start();
  });
  screen.append(resume);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      loop.stop();
      stick.release();
      resume.hidden = false;
    }
  });

  loop.start();
  return run;
}
