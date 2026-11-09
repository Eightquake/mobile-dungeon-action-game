// The run state and its fixed simulation step (ADR-008): UC-001 step 4 creates a run, UC-002 step 2 moves the hero.
// The state is plain serializable data. step() changes it in place and allocates nothing (docs/Performance.md
// section 3).
import { unlockedTiers } from './ladder';
import { createStreams, type RandomStreams } from './prng';
import type { TierData, Tuning } from './tuning';

export interface Hero {
  id: number;
  x: number;
  z: number;
  /** Position before the last step, for interpolated rendering. */
  prevX: number;
  prevZ: number;
}

export interface RunState {
  /** Unsigned 32-bit seed of the run (entity model RUN.seed). */
  seed: number;
  tierId: number;
  /** Simulation steps run so far (entity model RUN.simulation_step). */
  step: number;
  /** Entity ids come from this counter, never from the clock or randomness (ADR-008). */
  nextEntityId: number;
  startingItems: string[];
  /** Legendary power ids equipped at run start (entity model RUN.codex_powers). */
  codexPowers: string[];
  hero: Hero;
  random: RandomStreams;
}

/**
 * The input of one simulation step: the stick quantized to whole levels per axis (ADR-008).
 * x points right on the floor, z toward the camera; both lie in [-levels, levels].
 */
export interface StepInput {
  moveX: number;
  moveZ: number;
}

export interface NewRun {
  seed: number;
  tierId: number;
  /** Highest tier the player has cleared, 0 for none. */
  highestCleared: number;
  codexPowers: string[];
}

/** UC-001 step 4: a new run for the chosen tier with a new seed, the starting items, and the equipped codex powers. */
export function createRun(start: NewRun, tuning: Tuning, tiers: readonly TierData[]): RunState {
  // UC-001 BR-002: a run starts only at an unlocked tier.
  if (!unlockedTiers(start.highestCleared, tiers.length).includes(start.tierId)) {
    throw new RangeError(`Tier ${start.tierId} is not unlocked`);
  }
  const tier = tiers[start.tierId - 1];
  if (!tier) throw new RangeError(`No tier ${start.tierId}`);
  const seed = start.seed >>> 0;
  let nextEntityId = 1;
  // UC-001 step 4: the hero stands at the entrance of the tier.
  const hero: Hero = {
    id: nextEntityId++,
    x: tier.entrance.x,
    z: tier.entrance.z,
    prevX: tier.entrance.x,
    prevZ: tier.entrance.z,
  };
  return {
    seed,
    tierId: tier.id,
    step: 0,
    nextEntityId,
    // UC-001 BR-003: every run of a tier starts with the same items; only the seed and the codex powers differ.
    startingItems: [...tuning.hero.starting_items],
    codexPowers: [...start.codexPowers],
    hero,
    random: createStreams(seed),
  };
}

function clamp(value: number, limit: number): number {
  return value < -limit ? -limit : value > limit ? limit : value;
}

/** Advances the run by one fixed step. */
export function step(run: RunState, input: StepInput, tuning: Tuning, tier: TierData): void {
  const hero = run.hero;
  hero.prevX = hero.x;
  hero.prevZ = hero.z;

  // UC-002 step 2: the hero moves in the stick's direction at a speed that follows its deflection.
  // Only +, -, *, / and sqrt, which IEEE 754 rounds the same on every engine (ADR-008).
  const levels = tuning.stick.levels;
  const length = Math.sqrt(input.moveX * input.moveX + input.moveZ * input.moveZ);
  if (length > 0) {
    const deflection = (length < levels ? length : levels) / levels;
    const distance = (tuning.hero.speed / tuning.simulation.steps_per_second) * deflection;
    hero.x = clamp(hero.x + (input.moveX / length) * distance, tier.floor.half_width);
    hero.z = clamp(hero.z + (input.moveZ / length) * distance, tier.floor.half_depth);
  }

  run.step++;
}
