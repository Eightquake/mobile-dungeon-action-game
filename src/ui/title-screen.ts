/** The game's working title until the owner picks a name. */
export const GAME_TITLE = '[WORKING TITLE]';

/** Shows the title screen with its Play button (UC-001 step 1). The resume option arrives with UC-004. */
export function renderTitleScreen(root: HTMLElement, onPlay: () => void): void {
  const heading = document.createElement('h1');
  heading.className = 'title';
  heading.textContent = GAME_TITLE;
  const play = document.createElement('button');
  play.className = 'play';
  play.textContent = 'Play';
  play.addEventListener('click', onPlay, { once: true });
  const menu = document.createElement('div');
  menu.className = 'title-menu';
  menu.append(heading, play);
  root.replaceChildren(menu);
}
