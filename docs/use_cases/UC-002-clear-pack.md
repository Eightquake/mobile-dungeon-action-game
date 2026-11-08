# Use Case: Clear Pack

## Overview

**Use Case ID:** UC-002  
**Use Case Name:** Clear Pack  
**Primary Actor:** Player  
**Goal:** The player defeats a pack of enemies with the hero, moving and using skills with tight, responsive controls and weighty hits.  
**Trigger:** A pack of enemies notices the hero during a run.  
**Status:** Draft  

**Requirements:** [FR-002, FR-003, FR-004, FR-005, NFR-001, NFR-002, NFR-003, NFR-004, NFR-005, NFR-006, NFR-007, NFR-008, NFR-012, C-024, C-025](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Partly — moving the hero with the virtual stick (step 2) only

## Preconditions

- A run is in progress and the player controls the hero.

## Main Success Scenario

1. System shows the pack moving toward the hero.
2. Player drags the virtual stick; system moves the hero in that direction at a speed that follows the stick's deflection.
3. Player presses a skill button.
4. System performs the skill, as changed by the legendary powers of the hero's items and codex powers, and starts its cooldown.
5. System applies the damage of every hit to the enemies it reaches and shows the hit feedback for each hit: a hit reaction on the enemy, a hit sound, and a damage number.
6. System lets the enemies attack and shows every hit on the hero with its own hit feedback and the hero's remaining health.
7. Player repeats steps 2 to 6 until the last enemy of the pack is defeated.
8. System shows the defeat of the last enemy and drops the items the pack yields.
9. System collects the dropped items when the hero comes near them and lists them as found in the run.

## Alternative Flows

### A1: Skill on cooldown

**Trigger:** Player presses a skill button whose skill is still on cooldown (step 3)  
**Flow:**

1. System keeps the skill unused and shows the remaining cooldown on the button.
2. Use case continues at step 2.

### A2: Hero dies

**Trigger:** The hero's health reaches zero (step 6)  
**Flow:**

1. System shows the hero's defeat.
2. System continues with UC-005 Finish Run.
3. Use case ends.

### A3: Legendary drops

**Trigger:** A dropped item is a legendary (step 8)  
**Flow:**

1. System marks the legendary so the player can tell it from other items at a glance.
2. Use case continues at step 9.

### A4: Legendary collected

**Trigger:** The hero collects a legendary (step 9)  
**Flow:**

1. System continues with UC-007 Unlock Codex Power.
2. Use case continues at step 9 for the remaining dropped items.

### A5: Guardian defeated

**Trigger:** The defeated pack contained the guardian of the tier (step 8)  
**Flow:**

1. System shows that the tier is cleared.
2. System continues with UC-005 Finish Run.
3. Use case ends.

### A6: Player pauses

**Trigger:** Player presses the pause button, or the game is hidden (step 2)  
**Flow:**

1. System continues with UC-003 Pause Run.
2. Use case ends.

### A7: Effect budget reached

**Trigger:** A skill or a legendary power would create more enemies, projectiles, or visual effects than the effect budget allows (step 4)  
**Flow:**

1. System keeps enemies and projectiles within their budgets as the tuning data sets: the spawner adds no enemy above the enemy budget, and extra projectiles of a skill are merged into the projectiles it already has, with their damage added.
2. System leaves out the visual effects above the effect budget, oldest first.
3. Use case continues at step 5.

## Postconditions

### Success Postconditions

- Every enemy of the pack is defeated.
- The items the pack dropped and the hero collected are listed as found in the run.

### Failure Postconditions

- The run state is never lost: when the hero dies or the run pauses, the run is ended or paused as UC-005 or UC-003 describe.

## Business Rules

### BR-001: Feedback on every hit

Every hit that deals damage shows a hit reaction, plays a hit sound, and shows a damage number, starting in the first rendered frame after the hit (NFR-002).

### BR-002: Weight from tuning data

Hit-stop, knockback, and screen shake of a hit, and the damage, cooldown, and speed of every skill and enemy, come from tuning data (C-024).

### BR-003: Powers change behavior

A legendary power changes what a skill does — its shape, its number of hits, its movement, or what it triggers — rather than only raising a number.

### BR-004: Budgets never break pacing

No combination of items and codex powers exceeds the budgets for enemies, projectiles, and visual effects; the simulation enforces the enemy and projectile budgets the same way on every device. Gameplay outcomes never depend on whether a visual effect was shown (NFR-008).

### BR-005: Readable numbers

A damage number shows at most 4 significant digits (NFR-012).

### BR-006: Controls only

During combat the player needs nothing but the virtual stick and the skill buttons (C-025).
