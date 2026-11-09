# Use Case: Install Game

## Overview

**Use Case ID:** UC-012  
**Use Case Name:** Install Game  
**Primary Actor:** Player  
**Secondary Actors:** Browser  
**Goal:** The player opens the game from a link and keeps it on the home screen like an app, with its save protected from being cleared.  
**Trigger:** Player opens the link to the game in the browser.  
**Status:** Approved  

**Requirements:** [FR-021, NFR-016, NFR-023, C-001, C-002, C-018](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Yes

## Preconditions

- The device has a network connection.

## Main Success Scenario

1. Player opens the link to the game.
2. System loads the title screen and stores the files for playing offline on the device.
3. System asks the Browser to keep the save's storage persistent.
4. System shows a hint on the title screen that explains how to add the game to the home screen on this device, and why it protects the save.
5. Player adds the game to the home screen as the hint explains.
6. Browser places the game's icon on the home screen.
7. Player launches the game from the icon.
8. System opens the title screen full screen and locked to landscape where the device allows it, without the browser's address bar, and no longer shows the hint.

## Alternative Flows

### A1: Player dismisses the hint

**Trigger:** Player dismisses the hint instead of adding the game (step 5)  
**Flow:**

1. System hides the hint and keeps the explanation available in the settings.
2. Use case ends.

### A2: Browser cannot install web apps

**Trigger:** The Browser offers no way to add the game to the home screen (step 4)  
**Flow:**

1. System shows instead that the game can be played in the browser and that the save is safer after an export, as UC-010 Export Save describes.
2. Use case ends.

### A3: Game already installed

**Trigger:** The game runs from the home screen icon already (step 4)  
**Flow:**

1. System shows no hint.
2. Use case ends.

### A4: Loading fails

**Trigger:** The network connection breaks before the files for playing offline are stored (step 2)  
**Flow:**

1. System keeps the files stored so far and completes storing them at the next visit with a network connection.
2. Use case ends.

### A5: Persistent storage refused

**Trigger:** The Browser does not grant persistent storage (step 3)  
**Flow:**

1. System continues without it and, from the first codex power on, recommends a save export as UC-010 Export Save describes, in the hint of step 4.
2. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The game's icon is on the home screen and launches the game full screen.
- The files for playing offline are stored on the device.
- The Browser was asked to keep the save's storage persistent.

### Failure Postconditions

- An existing save on the device is never changed by installing.

## Business Rules

### BR-001: No store, no cost

The game is installed from a link only, never from an app store, and installing costs the player nothing (C-001, C-002).

### BR-002: One hint, never a nag

The install hint shows on the title screen until the player adds the game or dismisses the hint. After that it only appears in the settings.

### BR-003: Small first load

The files stored on the first visit total at most 5 MB, compressed as transferred (NFR-016).
