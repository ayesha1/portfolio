// ══════════════════════════════════════════
// THREE.JS ISOMETRIC SHOWROOM DIORAMA
// Open L-shaped room with IKEA sign
// ══════════════════════════════════════════

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRNG } from './seed.js';

let renderer, scene, camera, controls;
let animationId = null;
let hotspots = [];
let autoRotateAngle = 0;
let autoRotateDir = 1;
let userInteracting = false;
let userInteractTimeout = null;
const AUTO_ROTATE_SPEED = 0.0012;
const ANGLE_MIN = -0.25;
const ANGLE_MAX = 0.6;
let hotspotEls = [];

// ── Helpers ──
function box(w, h, d, material, pos, castShadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  m.castShadow = castShadow;
  m.receiveShadow = true;
  return m;
}

function cyl(rT, rB, h, seg, material, pos, castShadow = true) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), material);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  m.castShadow = castShadow;
  m.receiveShadow = true;
  return m;
}

function sph(r, material, pos, castShadow = true) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), material);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  m.castShadow = castShadow;
  return m;
}

function M(color, roughness = 0.65, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

export function buildScene(canvas, params) {
  dispose();

  const container = canvas.parentElement;
  const w = container.clientWidth;
  const h = container.clientHeight;
  const rng = createRNG(params.seed);

  // ── Renderer ──
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0ece4);

  // ── Camera — isometric-ish, zoomed in ──
  camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
  camera.position.set(5.5, 4.5, 5.5);
  camera.lookAt(0, 1.2, 0);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.minDistance = 5;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 1.2, 0);
  controls.autoRotate = false; // We handle rotation manually

  // Track user interaction to pause auto-rotate
  autoRotateAngle = 0;
  autoRotateDir = 1;
  userInteracting = false;
  const onInteractStart = () => {
    userInteracting = true;
    clearTimeout(userInteractTimeout);
  };
  const onInteractEnd = () => {
    clearTimeout(userInteractTimeout);
    userInteractTimeout = setTimeout(() => { userInteracting = false; }, 3000);
  };
  canvas.addEventListener('pointerdown', onInteractStart);
  canvas.addEventListener('pointerup', onInteractEnd);
  canvas.addEventListener('wheel', () => { onInteractStart(); onInteractEnd(); });

  // ── Lighting ──
  scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));

  const sun = new THREE.DirectionalLight(0xfff5e0, 2.0);
  sun.position.set(-5, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 30;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -8;
  sun.shadow.bias = -0.0004;
  sun.shadow.radius = 3;
  scene.add(sun);

  const fill2 = new THREE.DirectionalLight(0xd0e0f8, 0.4);
  fill2.position.set(5, 4, -3);
  scene.add(fill2);

  const rim = new THREE.DirectionalLight(0xffd8a0, 0.3);
  rim.position.set(-3, 3, -5);
  scene.add(rim);

  // ── Colors ──
  const C = {
    wallDark: M(0x4a4e5a, 0.75),
    wallInner: M(0x5a5e6a, 0.7),
    floor: M(0xd4a862, 0.5, 0.03),
    platform: M(0xc09050, 0.55, 0.03),
    platformEdge: M(0xb08040, 0.5, 0.05),
    cream: M(0xfaf5ee, 0.55),
    white: M(0xf5f2ed, 0.45),
    whiteClean: M(0xffffff, 0.4),
    wood: M(0xd4a862, 0.5, 0.05),
    woodLight: M(0xe8c888, 0.45, 0.05),
    woodDark: M(0xb08840, 0.5, 0.05),
    fabric: M(0xe0d5c5, 0.82),
    fabricDark: M(0xc8baa8, 0.8),
    fabricSofa: M(0xe8ddd0, 0.75),
    blanket: M(0x9a9088, 0.85),
    blanketStripe: M(0x706860, 0.8),
    pillow: M(0xd8d0c4, 0.8),
    rug: M(0xd0ccc4, 0.9),
    blue: M(0x3a5a8a, 0.6),
    blueSign: M(0x003399, 0.5),
    yellow: M(0xffcc00, 0.45),
    green: M(0x4a9a3a, 0.65),
    greenDark: M(0x2d6a1e, 0.7),
    brown: M(0x8b5e3c, 0.6),
    black: M(0x2a2a2e, 0.4, 0.3),
    gray: M(0x888888, 0.4, 0.2),
    grayLight: M(0xc0c0c0, 0.35, 0.15),
    metal: M(0xb0b0b0, 0.2, 0.7),
    ceramic: M(0xf5f2ed, 0.35, 0.05),
    warmGlow: new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xffe080, emissiveIntensity: 0.5, roughness: 0.5 }),
    bookBlue: M(0x3a5a8a, 0.7),
    bookBrown: M(0x8a6040, 0.7),
    bookOrange: M(0xd08040, 0.65),
    artBg1: M(0xf0c8a0, 0.7),
    artBg2: M(0xd4a888, 0.7),
    artShape1: M(0xc07040, 0.65),
    artShape2: M(0x3a5a5a, 0.65),
  };

  // ═══ PLATFORM (rounded rectangle base) ═══
  const platW = 8, platD = 6.5, platH = 0.25;
  const plat = box(platW, platH, platD, C.floor, [0, -platH / 2, 0], false);
  plat.receiveShadow = true;
  scene.add(plat);

  // Platform edge/rim
  const rim2 = box(platW + 0.2, 0.08, platD + 0.2, C.platformEdge, [0, -platH + 0.04, 0], false);
  scene.add(rim2);

  // ═══ L-SHAPED WALLS ═══
  const wallH = 4.2, wallThick = 0.25;

  // Back wall (full width)
  const backWall = box(platW, wallH, wallThick, C.wallDark, [0, wallH / 2, -platD / 2 + wallThick / 2]);
  scene.add(backWall);

  // Left wall (full depth)
  const leftWall = box(wallThick, wallH, platD, C.wallDark, [-platW / 2 + wallThick / 2, wallH / 2, 0]);
  scene.add(leftWall);

  // Wall inner faces (slightly lighter)
  scene.add(box(platW - 0.02, wallH - 0.02, 0.01, C.wallInner, [0, wallH / 2, -platD / 2 + wallThick + 0.01], false));
  scene.add(box(0.01, wallH - 0.02, platD - 0.02, C.wallInner, [-platW / 2 + wallThick + 0.01, wallH / 2, 0], false));

  // ═══ IKEA SIGN (on top of back wall) ═══
  // Blue sign board
  const signW = 3.2, signH = 1.0, signD = 0.3;
  const signBoard = box(signW, signH, signD, C.blueSign, [1.5, wallH + signH / 2, -platD / 2 + 0.15]);
  scene.add(signBoard);

  // Yellow "IKEA" letters (chunky 3D blocks)
  const letterH = 0.45, letterD2 = 0.15;
  const ly = wallH + signH / 2;
  const lz = -platD / 2 + 0.15 + signD / 2 + 0.01;
  const lxBase = 0.4;

  // I
  scene.add(box(0.12, letterH, letterD2, C.yellow, [lxBase, ly, lz]));

  // K
  scene.add(box(0.12, letterH, letterD2, C.yellow, [lxBase + 0.5, ly, lz]));
  const kArm1 = box(0.12, 0.24, letterD2, C.yellow, [lxBase + 0.65, ly + 0.1, lz]);
  kArm1.rotation.z = -0.5;
  scene.add(kArm1);
  const kArm2 = box(0.12, 0.24, letterD2, C.yellow, [lxBase + 0.65, ly - 0.1, lz]);
  kArm2.rotation.z = 0.5;
  scene.add(kArm2);

  // E
  scene.add(box(0.12, letterH, letterD2, C.yellow, [lxBase + 1.1, ly, lz]));
  scene.add(box(0.22, 0.1, letterD2, C.yellow, [lxBase + 1.22, ly + 0.18, lz]));
  scene.add(box(0.18, 0.08, letterD2, C.yellow, [lxBase + 1.2, ly, lz]));
  scene.add(box(0.22, 0.1, letterD2, C.yellow, [lxBase + 1.22, ly - 0.18, lz]));

  // A
  scene.add(box(0.12, letterH, letterD2, C.yellow, [lxBase + 1.65, ly, lz]));
  scene.add(box(0.12, letterH, letterD2, C.yellow, [lxBase + 1.95, ly, lz]));
  scene.add(box(0.22, 0.1, letterD2, C.yellow, [lxBase + 1.8, ly + 0.18, lz]));
  scene.add(box(0.18, 0.08, letterD2, C.yellow, [lxBase + 1.8, ly, lz]));

  // ═══ TRACK LIGHTS (on back wall top) ═══
  const trackY = wallH - 0.15;
  const trackZ = -platD / 2 + wallThick + 0.3;
  // Track bar
  scene.add(box(3.5, 0.05, 0.05, C.whiteClean, [1, trackY, trackZ], false));
  // Spotlights
  [-0.3, 0.5, 1.3, 2.1].forEach(lx => {
    scene.add(cyl(0.06, 0.04, 0.12, 8, C.whiteClean, [lx + 0.3, trackY - 0.1, trackZ]));
    // Light cone (subtle)
    const cone = new THREE.SpotLight(0xfff0d0, 0.3, 4, Math.PI / 6, 0.6);
    cone.position.set(lx + 0.3, trackY - 0.15, trackZ);
    cone.target.position.set(lx + 0.3, 0, trackZ + 1);
    scene.add(cone);
    scene.add(cone.target);
  });

  // ═══ WINDOWS (left wall) ═══
  const winY = 2.2, winZ1 = -1.5, winZ2 = 0.8;
  [winZ1, winZ2].forEach(wz => {
    const winX = -platW / 2 + wallThick + 0.02;
    // Window hole (bright panel)
    scene.add(box(0.02, 1.5, 1.0, C.warmGlow, [winX, winY, wz], false));
    // Frame
    scene.add(box(0.06, 1.6, 0.06, C.cream, [winX + 0.02, winY, wz - 0.5], false));
    scene.add(box(0.06, 1.6, 0.06, C.cream, [winX + 0.02, winY, wz + 0.5], false));
    scene.add(box(0.06, 0.06, 1.06, C.cream, [winX + 0.02, winY + 0.8, wz], false));
    scene.add(box(0.06, 0.06, 1.06, C.cream, [winX + 0.02, winY - 0.8, wz], false));
    // Cross bars
    scene.add(box(0.04, 1.5, 0.04, C.cream, [winX + 0.02, winY, wz], false));
    scene.add(box(0.04, 0.04, 1.0, C.cream, [winX + 0.02, winY, wz], false));
  });

  // ═══ BED (back-left corner) ═══
  buildBed(scene, C, -2.5, 0, -1.8);

  // ═══ SOFA (center-front) ═══
  buildSofa(scene, C, -0.5, 0, 1.0);

  // ═══ COFFEE TABLE ═══
  buildCoffeeTable(scene, C, -0.5, 0, 2.2);

  // ═══ RUG (under sofa/table) ═══
  scene.add(box(2.5, 0.02, 1.8, C.rug, [-0.5, 0.01, 1.6], false));

  // ═══ KITCHEN CABINETS (right side, against back wall) ═══
  buildKitchen(scene, C);

  // ═══ DRESSER (left wall, near window) ═══
  buildDresser(scene, C, -3.5, 0, 0.8);

  // ═══ SIDE TABLE (left wall, between windows) ═══
  buildSideTable(scene, C, -3.5, 0, -0.4);

  // ═══ BOOKSHELF (right side, front) ═══
  buildBookshelf(scene, C, 3, 0, 2);

  // ═══ WALL ART ═══
  buildWallArt(scene, C);

  // ═══ PLANTS ═══
  buildPlant(scene, C, -3.5, 0.75, -0.4, 0.15); // on side table
  buildPlant(scene, C, 2.3, 0.88, -2.3, 0.12); // on kitchen counter
  buildPlant(scene, C, 3.5, 0, 0.5, 0.2); // floor plant near bookshelf

  // ═══ BOOKS STACK (on floor near sofa) ═══
  buildBookStack(scene, C, 1.0, 0, 2.2);

  // ═══ RADIATOR (under left window) ═══
  scene.add(box(0.08, 0.6, 0.8, C.cream, [-3.7, 0.35, -1.5], false));

  // ═══ HOTSPOTS ═══
  hotspots = [
    { pos: new THREE.Vector3(-0.5, 1.2, 1.0), name: 'KIVIK', price: '$799', desc: 'Sofa, Hillared beige' },
    { pos: new THREE.Vector3(-2.5, 1.2, -1.8), name: 'MALM', price: '$349', desc: 'Bed frame, high, white stained oak' },
    { pos: new THREE.Vector3(-0.5, 0.7, 2.2), name: 'STOCKHOLM', price: '$249', desc: 'Coffee table, walnut veneer' },
    { pos: new THREE.Vector3(2.2, 1.5, -2.5), name: 'METOD', price: '$1,299', desc: 'Kitchen, white/Voxtorp walnut' },
    { pos: new THREE.Vector3(-3.5, 1.0, 0.8), name: 'NORDLI', price: '$199', desc: 'Chest of 3 drawers, white' },
    { pos: new THREE.Vector3(3, 1.2, 2), name: 'KALLAX', price: '$69.99', desc: 'Shelf unit, white stained oak' },
  ];

  createHotspotElements(container);
  animate();
  window.addEventListener('resize', onResize);
}

// ═══ FURNITURE BUILDERS ═══

function buildSofa(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Base/seat — chunky rounded
  g.add(box(2.2, 0.45, 0.9, C.fabricSofa, [0, 0.5, 0]));

  // Back
  g.add(box(2.2, 0.55, 0.2, C.fabricSofa, [0, 0.95, -0.35]));

  // Arms
  g.add(box(0.2, 0.45, 0.9, C.fabricSofa, [-1.1, 0.65, 0]));
  g.add(box(0.2, 0.45, 0.9, C.fabricSofa, [1.1, 0.65, 0]));

  // Legs (small rounded)
  [[-0.9, -0.35], [-0.9, 0.3], [0.9, -0.35], [0.9, 0.3]].forEach(([lx, lz]) => {
    g.add(cyl(0.04, 0.035, 0.25, 8, C.woodLight, [lx, 0.125, lz]));
  });

  // Seat cushions
  [-0.5, 0.5].forEach(cx => {
    g.add(box(0.95, 0.12, 0.75, C.fabric, [cx, 0.78, 0.05]));
  });

  // Pillows
  g.add(box(0.4, 0.35, 0.15, C.pillow, [-0.7, 0.95, -0.2]));
  g.add(box(0.35, 0.3, 0.15, C.pillow, [0.65, 0.9, -0.22]));

  // Throw blanket (draped over arm)
  g.add(box(0.6, 0.04, 0.7, C.blanket, [-0.9, 0.85, 0.1]));
  // Stripe on blanket
  g.add(box(0.6, 0.045, 0.08, C.blanketStripe, [-0.9, 0.86, 0.0]));
  g.add(box(0.6, 0.045, 0.08, C.blanketStripe, [-0.9, 0.86, 0.2]));

  scene.add(g);
}

function buildBed(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Frame
  g.add(box(1.8, 0.3, 2.2, C.woodLight, [0, 0.15, 0]));

  // Mattress
  g.add(box(1.65, 0.2, 2.0, C.fabric, [0, 0.4, 0]));

  // Headboard
  g.add(box(1.8, 0.9, 0.12, C.fabricDark, [0, 0.8, -1.0]));

  // Pillows
  [-0.4, 0.4].forEach(px => {
    g.add(box(0.5, 0.14, 0.35, C.cream, [px, 0.58, -0.7]));
  });

  // Duvet
  g.add(box(1.55, 0.1, 1.4, C.fabric, [0, 0.55, 0.15]));

  // Throw folded at foot
  g.add(box(1.2, 0.05, 0.35, C.fabricDark, [0, 0.58, 0.8]));

  scene.add(g);
}

function buildCoffeeTable(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Top
  g.add(box(1.0, 0.04, 0.55, C.wood, [0, 0.4, 0]));

  // Legs — splayed
  [[-0.4, -0.2], [-0.4, 0.2], [0.4, -0.2], [0.4, 0.2]].forEach(([lx, lz]) => {
    g.add(cyl(0.03, 0.025, 0.38, 8, C.woodDark, [lx, 0.19, lz]));
  });

  // Items on table
  // Plate with something
  g.add(cyl(0.1, 0.1, 0.015, 12, C.ceramic, [-0.2, 0.43, 0]));
  g.add(box(0.08, 0.04, 0.08, C.woodLight, [-0.2, 0.46, 0])); // toast/cracker

  // Cup and saucer
  g.add(cyl(0.05, 0.05, 0.01, 10, C.ceramic, [0.2, 0.42, 0.05]));
  g.add(cyl(0.03, 0.025, 0.04, 10, C.ceramic, [0.2, 0.45, 0.05]));

  scene.add(g);
}

function buildKitchen(scene, C) {
  const backZ = -3.25 + 0.25;
  const baseX = 2.2;

  // ── Upper cabinets ──
  for (let i = 0; i < 4; i++) {
    const cab = box(0.7, 1.2, 0.35, C.cream, [baseX + i * 0.75, 3.0, backZ]);
    scene.add(cab);
    // Subtle door line
    scene.add(box(0.005, 1.1, 0.01, C.grayLight, [baseX + i * 0.75, 3.0, backZ + 0.18], false));
  }

  // ── Lower cabinets ──
  for (let i = 0; i < 4; i++) {
    const cab = box(0.7, 0.85, 0.55, C.cream, [baseX + i * 0.75, 0.425, backZ + 0.1]);
    scene.add(cab);
    // Handle
    scene.add(box(0.12, 0.02, 0.02, C.metal, [baseX + i * 0.75, 0.65, backZ + 0.4], false));
  }

  // ── Countertop ──
  scene.add(box(3.2, 0.05, 0.6, C.woodLight, [baseX + 1.1, 0.88, backZ + 0.1]));

  // ── Backsplash gap (warm glow strip) ──
  scene.add(box(3, 0.08, 0.02, C.warmGlow, [baseX + 1.1, 0.95, backZ - 0.1], false));

  // ── Oven ──
  scene.add(box(0.55, 0.5, 0.5, C.black, [baseX + 1.5, 1.6, backZ], true));
  scene.add(box(0.4, 0.3, 0.01, M(0x111118, 0.1, 0.3), [baseX + 1.5, 1.55, backZ + 0.26], false));

  // ── Stovetop ──
  scene.add(box(0.5, 0.02, 0.4, C.black, [baseX + 1.5, 0.9, backZ + 0.15], false));
  // Burners
  [[-.1, -.08], [.1, -.08], [-.1, .08], [.1, .08]].forEach(([bx, bz]) => {
    scene.add(cyl(0.05, 0.05, 0.005, 12, M(0x333333, 0.3, 0.5), [baseX + 1.5 + bx, 0.91, backZ + 0.15 + bz], false));
  });

  // ── Utensil holder on counter ──
  scene.add(cyl(0.04, 0.035, 0.12, 8, C.ceramic, [baseX + 2.5, 0.96, backZ + 0.15]));
  // Utensils sticking up
  scene.add(box(0.01, 0.1, 0.01, C.woodDark, [baseX + 2.48, 1.07, backZ + 0.14]));
  scene.add(box(0.01, 0.1, 0.01, C.gray, [baseX + 2.52, 1.07, backZ + 0.16]));

  // ── Cutting boards leaning ──
  const cb = box(0.15, 0.2, 0.02, C.woodDark, [baseX + 0.3, 0.99, backZ + 0.0]);
  cb.rotation.x = -0.15;
  scene.add(cb);
}

function buildDresser(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Body
  g.add(box(0.9, 0.7, 0.45, C.cream, [0, 0.38, 0]));

  // Legs
  [[-0.35, -0.15], [-0.35, 0.15], [0.35, -0.15], [0.35, 0.15]].forEach(([lx, lz]) => {
    g.add(cyl(0.03, 0.025, 0.1, 8, C.woodLight, [lx, 0.05, lz]));
  });

  // Drawer lines
  for (let i = 0; i < 3; i++) {
    g.add(box(0.8, 0.006, 0.01, C.grayLight, [0, 0.2 + i * 0.2, 0.23], false));
    // Handle
    g.add(box(0.12, 0.015, 0.015, C.metal, [0, 0.28 + i * 0.2, 0.24], false));
  }

  // Vases on top
  g.add(cyl(0.04, 0.03, 0.15, 8, C.ceramic, [-0.2, 0.8, 0]));
  g.add(cyl(0.03, 0.025, 0.12, 8, C.cream, [-0.05, 0.78, 0]));

  scene.add(g);
}

function buildSideTable(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  g.add(box(0.45, 0.04, 0.35, C.wood, [0, 0.55, 0]));
  // Legs
  [[-0.17, -0.12], [-0.17, 0.12], [0.17, -0.12], [0.17, 0.12]].forEach(([lx, lz]) => {
    g.add(cyl(0.025, 0.02, 0.55, 8, C.wood, [lx, 0.275, lz]));
  });

  scene.add(g);
}

function buildBookshelf(scene, C, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);

  // Frame
  g.add(box(0.8, 1.1, 0.35, C.woodLight, [0, 0.55, 0]));

  // Shelves
  [0.35, 0.7].forEach(sy => {
    g.add(box(0.72, 0.03, 0.32, C.wood, [0, sy, 0], false));
  });

  // Books
  for (let b = 0; b < 4; b++) {
    const colors = [C.bookBlue, C.bookBrown, C.bookOrange, C.blue];
    g.add(box(0.08, 0.2, 0.18, colors[b], [-0.25 + b * 0.13, 0.82, 0]));
  }

  // Items on lower shelf
  g.add(cyl(0.05, 0.05, 0.08, 8, C.ceramic, [0.2, 0.2, 0]));
  g.add(box(0.15, 0.15, 0.01, C.artBg1, [-0.15, 0.25, 0.1], false)); // small frame

  scene.add(g);
}

function buildWallArt(scene, C) {
  const wallX = -4 + 0.25 + 0.04;

  // Art frames on left wall
  [[-1.5, 2.5], [0.5, 2.3]].forEach(([az, ay], i) => {
    const frame = box(0.04, 0.6, 0.5, C.cream, [wallX, ay, az]);
    scene.add(frame);
    const artBg = i === 0 ? C.artBg1 : C.artBg2;
    scene.add(box(0.02, 0.5, 0.4, artBg, [wallX + 0.02, ay, az], false));

    // Abstract shapes
    if (i === 0) {
      scene.add(cyl(0.08, 0.08, 0.01, 12, C.artShape1, [wallX + 0.03, ay + 0.05, az - 0.05], false));
      scene.add(box(0.01, 0.15, 0.12, C.artShape2, [wallX + 0.03, ay - 0.1, az + 0.08], false));
    } else {
      scene.add(sph(0.08, C.artShape1, [wallX + 0.04, ay, az], false));
    }
  });

  // Art on back wall (right side)
  const backZ2 = -3.25 + 0.25 + 0.04;
  scene.add(box(0.5, 0.6, 0.04, C.cream, [3.5, 2, backZ2], false));
  scene.add(box(0.4, 0.5, 0.02, C.artBg2, [3.5, 2, backZ2 + 0.02], false));
  scene.add(cyl(0.1, 0.1, 0.01, 12, C.artShape2, [3.5, 2.05, backZ2 + 0.03], false));
}

function buildPlant(scene, C, x, y, z, size) {
  // Pot
  scene.add(cyl(size * 0.6, size * 0.5, size * 0.8, 8, C.brown, [x, y + size * 0.4, z]));

  // Foliage
  for (let i = 0; i < 5; i++) {
    const lf = sph(size * 0.4 + Math.random() * size * 0.2, i % 2 === 0 ? C.green : C.greenDark,
      [x + (Math.random() - 0.5) * size * 0.5, y + size * 1.0 + Math.random() * size * 0.5, z + (Math.random() - 0.5) * size * 0.5]);
    scene.add(lf);
  }
}

function buildBookStack(scene, C, x, y, z) {
  const colors = [C.blueSign, C.bookBrown, C.blueSign, C.bookOrange];
  for (let i = 0; i < 4; i++) {
    scene.add(box(0.2, 0.04, 0.15, colors[i], [x, 0.02 + i * 0.045, z]));
  }
}

// ═══ HOTSPOT SYSTEM ═══
function createHotspotElements(container) {
  hotspotEls.forEach(el => el.remove());
  hotspotEls = [];

  let hc = container.querySelector('.hotspot-container');
  if (!hc) {
    hc = document.createElement('div');
    hc.className = 'hotspot-container';
    hc.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:15;overflow:hidden;';
    container.appendChild(hc);
  }
  hc.innerHTML = '';

  hotspots.forEach((hs, i) => {
    const dot = document.createElement('div');
    dot.className = 'hotspot-dot';
    dot.style.pointerEvents = 'auto';

    const tooltip = document.createElement('div');
    tooltip.className = 'hotspot-tooltip';
    tooltip.innerHTML = `
      <div class="hs-name">${hs.name}</div>
      ${hs.price ? `<div class="hs-price">${hs.price}</div>` : ''}
      <div class="hs-desc">${hs.desc}</div>
    `;
    dot.appendChild(tooltip);

    dot.addEventListener('mouseenter', () => dot.classList.add('active'));
    dot.addEventListener('mouseleave', () => dot.classList.remove('active'));
    dot.addEventListener('click', (e) => { e.stopPropagation(); dot.classList.toggle('pinned'); });

    hc.appendChild(dot);
    hotspotEls.push(dot);
  });
}

function updateHotspotPositions() {
  if (!camera || !renderer || !hotspots.length) return;
  const w2 = renderer.domElement.clientWidth;
  const h2 = renderer.domElement.clientHeight;

  hotspots.forEach((hs, i) => {
    const el = hotspotEls[i];
    if (!el) return;
    const p = hs.pos.clone().project(camera);
    if (p.z > 1) { el.style.display = 'none'; return; }
    const px = (p.x * 0.5 + 0.5) * w2;
    const py = (-p.y * 0.5 + 0.5) * h2;
    if (px < -20 || px > w2 + 20 || py < -20 || py > h2 + 20) { el.style.display = 'none'; return; }
    el.style.display = 'block';
    el.style.left = px + 'px';
    el.style.top = py + 'px';
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);

  // Ping-pong auto-rotation when user isn't interacting
  if (!userInteracting && controls) {
    autoRotateAngle += AUTO_ROTATE_SPEED * autoRotateDir;

    // Reverse direction at limits
    if (autoRotateAngle >= ANGLE_MAX) {
      autoRotateAngle = ANGLE_MAX;
      autoRotateDir = -1;
    } else if (autoRotateAngle <= ANGLE_MIN) {
      autoRotateAngle = ANGLE_MIN;
      autoRotateDir = 1;
    }

    // Calculate camera position on an arc
    const radius = camera.position.length();
    const baseAngle = Math.PI / 4; // 45 degrees (starting isometric angle)
    const angle = baseAngle + autoRotateAngle;
    const height = camera.position.y;

    camera.position.x = Math.sin(angle) * radius * Math.cos(Math.atan2(height, radius));
    camera.position.z = Math.cos(angle) * radius * Math.cos(Math.atan2(height, radius));
  }

  controls.update();
  renderer.render(scene, camera);
  updateHotspotPositions();
}

function onResize() {
  const c = renderer?.domElement?.parentElement;
  if (!c) return;
  camera.aspect = c.clientWidth / c.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(c.clientWidth, c.clientHeight);
}

export function dispose() {
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
  window.removeEventListener('resize', onResize);
  hotspotEls.forEach(el => el.remove());
  hotspotEls = [];
  hotspots = [];
  if (scene) {
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
  }
  if (renderer) { renderer.dispose(); renderer = null; }
  scene = null; camera = null; controls = null;
}
