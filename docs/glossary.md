# Glossary

One name per concept. Requirements, use cases, test cases, and code use these terms.

| Term                   | Definition                                                                                                                                                  | Avoid               |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| Player                 | The person who plays the game on their phone.                                                                                                               |                     |
| Owner                  | The person who builds and runs the project, reviews agent work, and operates the optional cloud backend.                                                    | Admin               |
| Hero                   | The figure the player controls during a run.                                                                                                                | Avatar              |
| Run                    | One self-contained attempt at a tier of the challenge ladder, from its start to its end-of-run summary, lasting around 5 to 10 minutes of play.             | Match               |
| Session                | A stretch of time in which the player plays one or more runs before putting the phone away.                                                                 |                     |
| Pack                   | A group of enemies that attacks the hero together.                                                                                                          |                     |
| Enemy                  | A hostile figure in a run that the hero can damage and defeat.                                                                                              | Mob                 |
| Guardian               | The enemy at the end of a tier; defeating it clears the tier.                                                                                              | Boss                |
| Skill                  | An action the hero performs when the player presses a skill button, such as an attack or a dash.                                                             | Ability             |
| Skill Button           | One of the 3 to 4 on-screen buttons that trigger the hero's skills.                                                                                         |                     |
| Virtual Stick          | The on-screen control the player drags with a thumb to move the hero.                                                                                       | Joystick            |
| Item                   | A piece of equipment that drops during a run and can be equipped into a gear slot.                                                                         | Loot item           |
| Starting Items         | The fixed items every run of a tier starts with, the same for every player.                                                                                |                     |
| Gear Slot              | One of the hero's few places for an equipped item, such as weapon or armor.                                                                                |                     |
| Legendary              | A rare item that carries a legendary power.                                                                                                                 |                     |
| Legendary Power        | An effect of a legendary that changes how a skill behaves, not only a number.                                                                               |                     |
| Codex                  | The player's permanent collection of unlocked legendary powers, kept across all runs.                                                                       | Cube                |
| Codex Power            | A legendary power that is unlocked in the codex and can be equipped into a codex slot.                                                                      |                     |
| Codex Slot             | One of the places that holds a codex power the hero carries into a run.                                                                                     |                     |
| Waiting Legendary      | A legendary kept in the save after its run ended because its legendary power is not in the codex yet; it waits until the player sacrifices it.              |                     |
| Sacrifice              | Destroying a waiting legendary by the player's choice to add its legendary power to the codex for good.                                                     | Extract             |
| Salvage                | Removing the items of a run when it ends, without a menu, except the legendaries that become waiting legendaries; salvage yields nothing.                   |                     |
| Bad-Luck Protection    | The rule that raises the chance of a legendary drop after every run that ended without one.                                                                 | Pity timer          |
| Challenge Ladder       | The ordered list of tiers that tests build quality and player skill.                                                                                        | Greater Rift, Rift  |
| Tier                   | One step of the challenge ladder with a fixed difficulty.                                                                                                   | Difficulty level    |
| Tier Clear             | The record that the player defeated the guardian of a tier, with the run's play time.                                                                      |                     |
| End-of-Run Summary     | The screen that ends every run and shows what the player found, unlocked, and how far they climbed.                                                         | Results screen      |
| Title Screen           | The first screen after a launch, from which the player starts or resumes a run and opens the codex, the challenge ladder, and the settings.               |                     |
| Pause Screen           | The screen shown while a run is paused, from which the player resumes, equips found items, changes settings, or abandons the run.                         |                     |
| Natural Stopping Point | A moment where the game is not in a run: the end-of-run summary or a launch of the game.                                                                    |                     |
| Paused Run             | A run whose simulation is stopped and whose state is stored on the device, so it can be resumed later, also after the game was closed.                    | Suspended run       |
| Stored Run             | The state of the one unfinished run kept on the device: a paused run, or the last checkpoint of a run whose game was closed without a pause.              |                     |
| Checkpoint             | A copy of a running run's state that the game stores at most 10 seconds of play apart.                                                                     |                     |
| Save                   | All of the player's progress stored on the device: codex, waiting legendaries, ladder progress, equipped codex powers, settings, bad-luck protection, and a stored run, if any. | Savegame            |
| Save Export            | A copy of the save as a file or a copyable code that the player can keep or import elsewhere.                                                               | Backup file         |
| Restorable Copy        | A save that an import, a cloud restore, or a failed migration replaced, kept on the device so the player can go back to it.                              |                     |
| Save Format Version    | The number that identifies the structure of a save, raised with every change of that structure.                                                            |                     |
| Update                 | A new version of the game that the browser downloads in the background.                                                                                    | Patch               |
| Build                  | The combination of items, codex powers, and skills the player chooses for a hero.                                                                           | Loadout             |
| Seed                   | The number from which all randomness of a run is derived, so that the same seed and inputs produce the same run.                                          |                     |
| Input Log              | The recorded player inputs of a run per simulation step, used to replay the run.                                                                           | Replay file         |
| Frame Cap              | The highest number of frames per second the game renders.                                                                                                   | FPS limit           |
| Reference Phone        | The iPhone 13 Pro on which every performance and battery threshold is measured.                                                                             | Test device         |
| Stress-Test Scene      | A scripted scene that fills the screen up to every effect budget, used to measure frame pacing.                                                             | Benchmark level     |
| Effect Budget          | The highest allowed number of live enemies, projectiles, or visual effects at one time.                                                                    |                     |
| Tuning Data            | The data files that hold combat and balance values, such as damage, drop chances, and hit-stop durations.                                                  |                     |
| Play Reminder          | An opt-in message the player sets up, shown after a play time they choose, that never locks or limits anything.                                           | Session limit       |
| Online Features        | The optional features that use the cloud backend: leaderboard and cloud save.                                                                               | Online mode         |
| Recovery Code          | The code that shows the player key of an online identity, so the player can use the same online identity on another device; whoever holds it controls the player's cloud data. |                     |
| Online Identity        | The random key and display name under which a device uses the online features; it holds no personal data and is never part of a save export.            |                     |
| Pending Submission     | A ladder result kept on the device until it is sent to the leaderboard.                                                                                   |                     |
| Cloud Backend          | The optional free-tier server that stores leaderboard entries and cloud saves.                                                                              | Server              |
| Leaderboard            | The list of ladder results that players submitted through the online features.                                                                             | Ranking             |
| Cloud Save             | A copy of the save stored in the cloud backend as a backup of the save on the device.                                                                       | Cloud sync          |
