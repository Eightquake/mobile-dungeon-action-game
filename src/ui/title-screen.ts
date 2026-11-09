/** The game's working title until the owner picks a name. */
export const GAME_TITLE = '[WORKING TITLE]';

/** Shows the title screen. Its buttons arrive with UC-001 Start Run and UC-013 Launch Game Offline. */
export function renderTitleScreen(root: HTMLElement): void {
  const heading = document.createElement('h1');
  heading.className = 'title';
  heading.textContent = GAME_TITLE;
  root.replaceChildren(heading);
}
