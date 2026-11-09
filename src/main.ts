import './ui/style.css';
import { requestPersistentStorage } from './save/persistent-storage';
import { TIERS, tierWithoutChoice } from './sim';
import { detectInstallEnvironment, renderInstallHint } from './ui/install-hint';
import { renderRotatePrompt } from './ui/rotate-prompt';
import { registerServiceWorker } from './ui/service-worker';
import { renderTitleScreen } from './ui/title-screen';

// The run screen and Three.js load while the title screen shows, so the title appears first and Play starts at once
// (NFR-009). The files are precached, so this works offline (UC-013).
const runScreen = import('./ui/run-screen');

const root = document.querySelector<HTMLElement>('#app');
if (root) {
  renderTitleScreen(root, () => {
    // UC-001 A2: no tier is cleared before saves arrive (walking skeleton PR 4), so the tier choice is skipped.
    const tier = tierWithoutChoice(0, TIERS.length) ?? 1;
    void runScreen.then(({ startRun }) => startRun(root, tier));
  });
  renderInstallHint(root, detectInstallEnvironment(false));
  renderRotatePrompt(document.body);
}
// UC-012 steps 2 and 3. Neither is awaited: the title screen never waits for them (UC-013 BR-002).
registerServiceWorker();
void requestPersistentStorage(navigator.storage);
