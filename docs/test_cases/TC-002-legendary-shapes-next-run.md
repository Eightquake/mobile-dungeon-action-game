# Test Case: Legendary Shapes the Next Run

## Overview

**ID:** TC-002  
**Goal:** A player finds a legendary, equips it in the run, keeps it as a waiting legendary after the hero dies, sacrifices it to unlock its codex power, and carries the codex power into the next run — verifying that no drop is wasted and the collection is permanent.  
**Priority:** High  
**Status:** Draft

## Roles

- Player (fights, equips, and chooses codex powers)

## Preconditions

- The save has tier 1 cleared and no codex power (test fixture `tests/fixtures/saves/v1-tier1-empty-codex.json`).
- The seed `2002` drops the legendary carrying the legendary power `test-split-shot` in the first pack (tuning data of the test build).

## Flow

| Step | Name                   | Description                                                                         | Test Data               | Use Case                                             |
|------|------------------------|-------------------------------------------------------------------------------------|-------------------------|------------------------------------------------------|
| 1    | Start run              | The player starts a run at tier 1                                                   | tier 1, seed=2002       | [UC-001](../use_cases/UC-001-start-run.md)            |
| 2    | Clear pack             | The player defeats the first pack and walks over the legendary                      | stick right, skill 1    | [UC-002](../use_cases/UC-002-clear-pack.md)           |
| 3    | Verify notice          | A notice names the legendary and its power `test-split-shot`, marked as new          | -                       | -                                                    |
| 4    | Equip legendary        | The player pauses, opens the found items, and equips the legendary                  | -                       | [UC-006](../use_cases/UC-006-equip-item.md)           |
| 5    | Verify skill changed   | After resuming, skill 1 fires three projectiles instead of one                      | skill 1 ×1              | -                                                    |
| 6    | Die and finish         | The hero is defeated; the run ends without a tier clear                             | test command: hero dies | [UC-005](../use_cases/UC-005-finish-run.md)           |
| 7    | Verify summary         | The end-of-run summary lists the legendary as a new waiting legendary               | -                       | -                                                    |
| 8    | Sacrifice legendary    | On the summary, the player sacrifices the legendary; `test-split-shot` is shown as a new codex power | test-split-shot | [UC-007](../use_cases/UC-007-sacrifice-legendary.md) |
| 9    | Equip codex power      | The player accepts the offer to equip the power and puts it in slot 1                | slot 1, test-split-shot | [UC-008](../use_cases/UC-008-equip-codex-powers.md)   |
| 10   | Start next run         | The player starts the next run                                                      | tier 1, seed=2003       | [UC-001](../use_cases/UC-001-start-run.md)            |
| 11   | Verify power carried   | Skill 1 fires three projectiles while the hero wears only starting items            | skill 1 ×1              | -                                                    |

## Validation

1. **No unlock on pickup**: After step 3, the codex is still empty.
2. **Death keeps the legendary**: After step 6, the save holds one waiting legendary carrying `test-split-shot`.
3. **Waiting survives a reload**: Reloading the page after step 7 and before step 8 still shows the waiting legendary in the codex.
4. **Sacrifice is stored at once**: Reloading the page after step 8 shows `test-split-shot` in the codex and no waiting legendary.
5. **Items do not carry over**: In step 11 the hero wears only the starting items.

## Postconditions

- The codex holds one codex power, `test-split-shot`, equipped in codex slot 1.
- A run at tier 1 with seed 2003 is in progress.
