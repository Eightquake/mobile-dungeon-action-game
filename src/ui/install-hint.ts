/** Which install hint the title screen shows (UC-012 step 4 and its alternative flows). */
export type InstallHint =
  /** UC-012 A3: the game runs from the home screen icon already, or the hint was dismissed (A1). */
  | 'none'
  /** iOS and iPadOS: every browser adds to the home screen through the share menu. */
  | 'ios'
  /** Browsers that install web apps from their menu: Chrome, Edge, Samsung Internet, Firefox on Android. */
  | 'menu'
  /** UC-012 A2: the browser cannot install web apps; play in the browser and export the save. */
  | 'browser-only';

export interface InstallEnvironment {
  /** Runs as an installed app: display-mode fullscreen or standalone, or navigator.standalone on iOS. */
  installed: boolean;
  /** The player dismissed the hint or added the game (UC-012 BR-002). */
  dismissed: boolean;
  ios: boolean;
  android: boolean;
  /** The browser fires beforeinstallprompt, so it can install web apps (Chromium on every platform). */
  installPromptSupported: boolean;
}

export function chooseInstallHint(env: InstallEnvironment): InstallHint {
  // UC-012 A3: already installed, no hint.
  if (env.installed) return 'none';
  // UC-012 BR-002: one hint, never a nag.
  if (env.dismissed) return 'none';
  if (env.ios) return 'ios';
  if (env.android || env.installPromptSupported) return 'menu';
  // UC-012 A2: no way to add the game to the home screen.
  return 'browser-only';
}

/** Reads the install environment of this browser. */
export function detectInstallEnvironment(dismissed: boolean): InstallEnvironment {
  const nav = navigator as Navigator & { standalone?: boolean };
  const displayMode = (mode: string): boolean => matchMedia(`(display-mode: ${mode})`).matches;
  const ua = nav.userAgent;
  return {
    installed: displayMode('fullscreen') || displayMode('standalone') || nav.standalone === true,
    dismissed,
    // iPadOS reports itself as a Mac, but a Mac has no touch screen.
    ios: /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1),
    android: /Android/.test(ua),
    installPromptSupported: 'onbeforeinstallprompt' in window,
  };
}

const WHY =
  'Your save is then safe from being cleared by the browser, and the game opens full screen.';

const TEXT: Record<Exclude<InstallHint, 'none'>, { title: string; body: string }> = {
  ios: {
    title: 'Add the game to your home screen',
    body: `Tap the Share button, then "Add to Home Screen". ${WHY}`,
  },
  menu: {
    title: 'Add the game to your home screen',
    body: `Open the browser menu and choose "Add to Home screen" or "Install app". ${WHY}`,
  },
  'browser-only': {
    title: 'Play right here in the browser',
    body: 'This browser cannot add the game to the home screen. Your save is safer after an export.',
  },
};

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Shows the install hint in `root` (UC-012 step 4). Dismissing it hides it (A1). Until the save exists (ADR-004,
 * walking skeleton PR 4), the dismissal lasts for this session only.
 */
export function renderInstallHint(root: HTMLElement, env: InstallEnvironment): void {
  const hint = chooseInstallHint(env);
  if (hint === 'none') return;
  const text = TEXT[hint];

  const box = document.createElement('aside');
  box.className = 'install-hint';
  box.setAttribute('aria-labelledby', 'install-hint-title');
  const title = document.createElement('h2');
  title.id = 'install-hint-title';
  title.textContent = text.title;
  const body = document.createElement('p');
  body.textContent = text.body;
  const actions = document.createElement('div');
  actions.className = 'install-hint-actions';
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.textContent = 'Not now';
  // UC-012 A1: the player dismisses the hint. Keeping it in the settings comes with UC-015.
  dismiss.addEventListener('click', () => box.remove());
  actions.append(dismiss);
  box.append(title, body, actions);
  root.append(box);

  // Chromium lets the page open its own install dialog; offer it as a button next to the explanation.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    const prompt = event as BeforeInstallPromptEvent;
    if (actions.querySelector('.install-hint-add')) return;
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'install-hint-add';
    add.textContent = 'Add to home screen';
    add.addEventListener('click', () => void prompt.prompt());
    actions.prepend(add);
  });
  // UC-012 step 6: once the Browser placed the icon, the hint is done (BR-002).
  window.addEventListener('appinstalled', () => box.remove());
}
