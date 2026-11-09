// The virtual stick (UC-002 step 2, C-025): a floating stick under the left thumb. It appears where the thumb lands
// on the left half of the screen and reports its deflection quantized to whole levels per axis (ADR-008).
import type { StepInput } from '../sim';

export interface StickTuning {
  radius_px: number;
  dead_zone: number;
  levels: number;
}

/**
 * Writes the quantized deflection of a drag of (dx, dy) CSS pixels into `out`. Screen right is +x and screen down
 * is +z, the direction toward the camera. Inside the dead zone the stick counts as released; beyond the radius it is
 * fully deflected.
 */
export function quantizeStick(dx: number, dy: number, stick: StickTuning, out: StepInput): void {
  const length = Math.hypot(dx, dy);
  if (length < stick.dead_zone * stick.radius_px) {
    out.moveX = 0;
    out.moveZ = 0;
    return;
  }
  const scale = (stick.levels * Math.min(length, stick.radius_px)) / (stick.radius_px * length);
  // `+ 0` turns -0 into 0, so the input log never holds two spellings of the centre.
  out.moveX = Math.round(dx * scale) + 0;
  out.moveZ = Math.round(dy * scale) + 0;
}

/** The stick's touch zone and its drawing. `input` always holds the current quantized deflection. */
export interface Stick {
  readonly input: StepInput;
  /** Releases the stick, for example when the run stops. */
  release(): void;
}

export function createStick(root: HTMLElement, tuning: StickTuning): Stick {
  const input: StepInput = { moveX: 0, moveZ: 0 };
  const zone = document.createElement('div');
  zone.className = 'stick-zone';
  zone.setAttribute('aria-label', 'Movement stick');
  const base = document.createElement('div');
  base.className = 'stick-base';
  base.style.width = base.style.height = `${tuning.radius_px * 2}px`;
  const knob = document.createElement('div');
  knob.className = 'stick-knob';
  base.append(knob);
  zone.append(base);
  root.append(zone);

  let pointerId: number | null = null;
  let originX = 0;
  let originY = 0;

  function release(): void {
    pointerId = null;
    input.moveX = 0;
    input.moveZ = 0;
    base.classList.remove('active');
    knob.style.transform = '';
  }

  zone.addEventListener('pointerdown', (event) => {
    if (pointerId !== null) return;
    event.preventDefault();
    pointerId = event.pointerId;
    zone.setPointerCapture(event.pointerId);
    originX = event.clientX;
    originY = event.clientY;
    base.style.left = `${originX}px`;
    base.style.top = `${originY}px`;
    base.classList.add('active');
  });
  zone.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - originX;
    const dy = event.clientY - originY;
    quantizeStick(dx, dy, tuning, input);
    // The knob shows the deflection the hero follows, so what the thumb sees is what the hero does.
    const r = tuning.radius_px / tuning.levels;
    knob.style.transform = `translate(${input.moveX * r}px, ${input.moveZ * r}px)`;
  });
  const end = (event: PointerEvent): void => {
    if (event.pointerId === pointerId) release();
  };
  zone.addEventListener('pointerup', end);
  zone.addEventListener('pointercancel', end);
  zone.addEventListener('lostpointercapture', end);

  return { input, release };
}
