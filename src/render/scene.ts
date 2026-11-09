// The 3D view of a run (ADR-007): one fixed, tilted perspective camera that follows the hero, one directional light
// plus hemisphere light, cheap Lambert materials, a blob shadow instead of shadow maps, no antialiasing, and a capped
// device pixel ratio (docs/Performance.md sections 5 and 6). Everything is created here, before the run starts;
// render() only moves what exists and allocates nothing.
import {
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import type { RunState, TierData, Tuning } from '../sim';

export interface RunView {
  render(run: RunState, alpha: number): void;
  resize(): void;
  dispose(): void;
}

const DEG = Math.PI / 180;

export function createRunView(canvas: HTMLCanvasElement, tuning: Tuning, tier: TierData): RunView {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: 'high-performance',
  });
  const scene = new Scene();
  scene.background = new Color(0x14110f);

  const camera = new PerspectiveCamera(tuning.camera.fov_deg, 1, 0.5, 200);
  const tilt = tuning.camera.tilt_deg * DEG;
  const offsetY = Math.sin(tilt) * tuning.camera.distance;
  const offsetZ = Math.cos(tilt) * tuning.camera.distance;

  scene.add(new HemisphereLight(0xd8d0c0, 0x30281f, 1.2));
  const sun = new DirectionalLight(0xffe6c0, 1.8);
  sun.position.set(-6, 12, 8);
  scene.add(sun);

  const width = tier.floor.half_width * 2;
  const depth = tier.floor.half_depth * 2;
  const floor = new Mesh(
    new PlaneGeometry(width, depth),
    new MeshLambertMaterial({ color: 0x4a3b2e }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  // Grid lines make movement visible on the bare floor of the walking skeleton.
  const grid = new GridHelper(
    Math.max(width, depth),
    Math.max(width, depth) / 2,
    0x6b5640,
    0x5a4636,
  );
  grid.position.y = 0.01;
  scene.add(grid);

  const heroBody = new Mesh(
    new CylinderGeometry(0.45, 0.55, 1.6, 10),
    new MeshLambertMaterial({ color: 0xc9a227 }),
  );
  heroBody.position.y = 0.8;
  const heroHead = new Mesh(
    new SphereGeometry(0.4, 10, 8),
    new MeshLambertMaterial({ color: 0xe8d2b0 }),
  );
  heroHead.position.y = 1.9;
  const shadow = new Mesh(
    new CircleGeometry(0.8, 16),
    new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  scene.add(heroBody, heroHead, shadow);

  function resize(): void {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tuning.camera.max_pixel_ratio));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    camera.updateProjectionMatrix();
  }
  resize();

  return {
    render(run, alpha) {
      const hero = run.hero;
      const x = hero.prevX + (hero.x - hero.prevX) * alpha;
      const z = hero.prevZ + (hero.z - hero.prevZ) * alpha;
      heroBody.position.x = heroHead.position.x = shadow.position.x = x;
      heroBody.position.z = heroHead.position.z = shadow.position.z = z;
      camera.position.set(x, offsetY, z + offsetZ);
      camera.lookAt(x, 0, z);
      renderer.render(scene, camera);
    },
    resize,
    dispose() {
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          (object.material as MeshLambertMaterial).dispose();
        }
      });
      grid.dispose();
      renderer.dispose();
    },
  };
}
