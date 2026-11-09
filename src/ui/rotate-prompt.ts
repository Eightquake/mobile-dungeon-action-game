/**
 * The prompt to rotate the phone to landscape (UC-013 A4, NFR-024). It is always in the page; CSS shows it only on
 * touch screens in portrait orientation, so it reacts to a rotation without code.
 */
export function renderRotatePrompt(root: HTMLElement): void {
  const prompt = document.createElement('div');
  prompt.className = 'rotate-prompt';
  prompt.setAttribute('role', 'alert');
  prompt.textContent = 'Turn your phone sideways to play.';
  root.append(prompt);
}
