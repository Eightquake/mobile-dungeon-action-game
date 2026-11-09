import './ui/style.css';
import { requestPersistentStorage } from './save/persistent-storage';
import { detectInstallEnvironment, renderInstallHint } from './ui/install-hint';
import { renderRotatePrompt } from './ui/rotate-prompt';
import { registerServiceWorker } from './ui/service-worker';
import { renderTitleScreen } from './ui/title-screen';

const root = document.querySelector<HTMLElement>('#app');
if (root) {
  renderTitleScreen(root);
  renderInstallHint(root, detectInstallEnvironment(false));
  renderRotatePrompt(document.body);
}
// UC-012 steps 2 and 3. Neither is awaited: the title screen never waits for them (UC-013 BR-002).
registerServiceWorker();
void requestPersistentStorage(navigator.storage);
