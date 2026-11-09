// The deterministic simulation (ADR-008): state in, inputs in, state out.
export { TIERS, TUNING } from './data';
export { tierWithoutChoice, unlockedTiers } from './ladder';
export { createRun, step, type RunState, type StepInput } from './run';
export type { TierData, Tuning } from './tuning';
