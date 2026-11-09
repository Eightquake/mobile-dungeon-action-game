// The game loop (ADR-007, ADR-008, docs/Performance.md section 4): fixed simulation steps from an accumulator, at most
// a few per displayed frame, and one render per frame with the interpolation factor between the last two states.

export interface FixedClock {
  /** Time not yet simulated, in milliseconds. */
  accumulator: number;
  /** Time stamp of the last frame, or null before the first frame. */
  last: number | null;
}

export function createClock(): FixedClock {
  return { accumulator: 0, last: null };
}

/**
 * Advances the clock to `now` and returns how many fixed steps to run. A slow frame runs at most `maxSteps`; the time
 * beyond that is dropped, so the game slows down instead of falling into a spiral of slower frames.
 */
export function advanceClock(
  clock: FixedClock,
  now: number,
  stepMs: number,
  maxSteps: number,
): number {
  if (clock.last !== null) clock.accumulator += Math.max(0, now - clock.last);
  clock.last = now;
  let steps = Math.floor(clock.accumulator / stepMs);
  if (steps > maxSteps) {
    steps = maxSteps;
    clock.accumulator = 0;
  } else {
    clock.accumulator -= steps * stepMs;
  }
  return steps;
}

/** How far the display stands between the previous and the current state, from 0 to 1. */
export function interpolation(clock: FixedClock, stepMs: number): number {
  return Math.min(1, clock.accumulator / stepMs);
}

export interface LoopCallbacks {
  /** Runs one fixed simulation step. */
  step(): void;
  /** Draws one frame between the previous state (0) and the current one (1). */
  render(alpha: number): void;
}

export interface GameLoop {
  start(): void;
  /** Stops requesting frames (NFR-015). */
  stop(): void;
  readonly running: boolean;
}

export function createGameLoop(
  stepsPerSecond: number,
  maxStepsPerFrame: number,
  callbacks: LoopCallbacks,
): GameLoop {
  const stepMs = 1000 / stepsPerSecond;
  const clock = createClock();
  let frame: number | null = null;

  function onFrame(now: number): void {
    frame = requestAnimationFrame(onFrame);
    const steps = advanceClock(clock, now, stepMs, maxStepsPerFrame);
    for (let i = 0; i < steps; i++) callbacks.step();
    callbacks.render(interpolation(clock, stepMs));
  }

  return {
    start() {
      if (frame !== null) return;
      // A fresh clock: the time the loop stood still is never simulated afterwards.
      clock.accumulator = 0;
      clock.last = null;
      frame = requestAnimationFrame(onFrame);
    },
    stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    },
    get running() {
      return frame !== null;
    },
  };
}
