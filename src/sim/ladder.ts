// The challenge ladder: which tiers a run may attempt (UC-001 steps 2 and 3, A2, BR-002).

/**
 * The tiers the player may start a run at, lowest first.
 * UC-001 BR-002: tier 1, every cleared tier, and the tier directly above the highest cleared tier.
 */
export function unlockedTiers(highestCleared: number, tierCount: number): number[] {
  const top = Math.min(Math.max(highestCleared, 0) + 1, tierCount);
  const tiers: number[] = [];
  for (let id = 1; id <= top; id++) tiers.push(id);
  return tiers;
}

/**
 * The tier a run starts at without asking, or null when the player chooses from the unlocked tiers.
 * UC-001 A2: a player who has not cleared any tier skips the choice and starts at tier 1.
 */
export function tierWithoutChoice(highestCleared: number, tierCount: number): number | null {
  const tiers = unlockedTiers(highestCleared, tierCount);
  return tiers.length === 1 ? 1 : null;
}
