# Use Case: Equip Item

## Overview

**Use Case ID:** UC-006  
**Use Case Name:** Equip Item  
**Primary Actor:** Player  
**Goal:** The player equips an item found in the run into a gear slot and plays on with what it changes.  
**Trigger:** Player chooses to see the items found in the run on the pause screen.  
**Status:** Draft  

**Requirements:** [FR-005, FR-006, FR-007, C-025, C-026](../requirements.md)  
**Priority:** High

## Preconditions

- A run is paused.

## Main Success Scenario

1. Player chooses to see the items found in the run.
2. System lists the found items that are not equipped, legendaries first, each with the gear slot it fits and, for a legendary, the description of its legendary power.
3. Player selects an item.
4. System shows the selected item next to the item equipped in the same gear slot, with the difference in what the hero's skills do.
5. Player chooses to equip the selected item.
6. System equips the item into its gear slot, moves the previously equipped item back to the found items, and stores the paused run on the device.
7. System shows the pause screen with the new item equipped.

## Alternative Flows

### A1: No found items

**Trigger:** The hero has not collected any item that is not equipped (step 2)  
**Flow:**

1. System shows that no items were found yet in this run.
2. Use case ends.

### A2: Player keeps the current item

**Trigger:** Player chooses not to equip the selected item (step 5)  
**Flow:**

1. System keeps the equipped item.
2. Use case continues at step 2.

### A3: Gear slot empty

**Trigger:** No item is equipped in the gear slot of the selected item (step 4)  
**Flow:**

1. System shows the selected item alone, with what it adds to the hero's skills.
2. Use case continues at step 5.

### A4: Storing fails

**Trigger:** The device refuses to store the paused run (step 6)  
**Flow:**

1. System keeps the change in memory, tells the player that it is not saved yet, and retries storing at the next checkpoint.
2. Use case continues at step 7.

## Postconditions

### Success Postconditions

- The selected item is equipped into its gear slot, and the hero's skills follow its effects when the run resumes.
- The previously equipped item is listed among the found items again.

### Failure Postconditions

- The items equipped before the use case started stay equipped.

## Business Rules

### BR-001: Equip only while paused

Items are equipped only from the pause screen, so the player never manages items during combat (C-025).

### BR-002: One item per gear slot

Every gear slot holds at most one item, and the hero has at most 6 gear slots (C-026).

### BR-003: Leftovers are salvaged

Every item of a run, equipped or not, is salvaged automatically when the run ends, except a legendary that becomes a waiting legendary, as UC-005 Finish Run describes (FR-007).

### BR-004: Effects described in skill terms

A legendary power is described by what it changes in a named skill, not only by a percentage.
