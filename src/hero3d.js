// Hero depth layer: three objects from Abhay's story (football, gold medal,
// mountain peak) float in front of the portrait at different depths. They
// respond to the pointer and drift apart as the hero scrolls away.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector3, Color,
  SphereGeometry, TorusGeometry, CylinderGeometry, ConeGeometry, IcosahedronGeometry,
  BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial,
  MeshPhysicalMaterial, PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace,
  AmbientLight, DirectionalLight, PointLight, MathUtils,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CYAN = new Color("#2ee6d6");
const VIOLET = new Color("#a46bff");
const PINK = new Color("#ff4fd8");

// Truncated-icosahedron seams (the classic football pattern), projected onto a sphere.
function footballSeams(radius) {
  const ico = new IcosahedronGeometry(1, 0);
  const pos = ico.getAttribute("position");
  const verts = [];
  const key = (v) => v.toArray().map((n) => n.toFixed(4)).join(",");
  const map = new Map();
  const faces = [];
  for (let i = 0; i < pos.count; i += 3) {
    const f = [];
    for (let j = 0; j < 3; j++) {
      const v = new Vector3().fromBufferAttribute(pos, i + j);
      const k = key(v);
      if (!map.has(k)) { map.set(k, verts.length); verts.push(v); }
      f.push(map.get(k));
    }
    faces.push(f);
  }
  const edges = new Map();
  faces.forEach(([a, b, c]) => [[a, b], [b, c], [c, a]].forEach(([p, q]) => {
    const k = p < q ? `${p}-${q}` : `${q}-${p}`;
    edges.set(k, [Math.min(p, q), Math.max(p, q)]);
  }));
  const third = (a, b) => verts[a].clone().lerp(verts[b], 1 / 3);
  const segs = [];
  // Hexagon-hexagon seams: middle third of every original edge.
  edges.forEach(([a, b]) => segs.push([third(a, b), third(b, a)]));
  // Pentagon seams: around each original vertex, inside each face.
  faces.forEach(([a, b, c]) => {
    segs.push([third(a, b), third(a, c)]);
    segs.push([third(b, c), third(b, a)]);
    segs.push([third(c, a), third(c, b)]);
  });
  const pts = [];
  const STEPS = 6;
  segs.forEach(([p, q]) => {
    for (let s = 0; s < STEPS; s++) {
      const u = p.clone().lerp(q, s / STEPS).normalize().multiplyScalar(radius);
      const v = p.clone().lerp(q, (s + 1) / STEPS).normalize().multiplyScalar(radius);
      pts.push(u.x, u.y, u.z, v.x, v.y, v.z);
    }
  });
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  return g;
}

function makeFootball() {
  const g = new Group();
  const shell = new Mesh(
    new SphereGeometry(0.62, 64, 48),
    new MeshPhysicalMaterial({
      color: "#dfe9ff", metalness: 0, roughness: 0.08, transmission: 0.92,
      thickness: 0.9, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.05, attenuationColor: CYAN, attenuationDistance: 2.2,
    })
  );
  const seams = new LineSegments(footballSeams(0.625), new LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.95 }));
  g.add(shell, seams);
  return g;
}

function makeMedal() {
  const g = new Group();
  const gold = new MeshPhysicalMaterial({ color: "#e9c46a", metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const disk = new Mesh(new CylinderGeometry(0.46, 0.46, 0.09, 64), gold);
  disk.rotation.x = Math.PI / 2;
  const rim = new Mesh(new TorusGeometry(0.47, 0.045, 20, 80), gold);
  const inner = new Mesh(new TorusGeometry(0.3, 0.018, 12, 64), gold);
  inner.position.z = 0.05;
  const ribbonMat = new MeshPhysicalMaterial({ color: VIOLET, metalness: 0.1, roughness: 0.35, sheen: 1, sheenColor: PINK, side: 2 });
  const ribbonL = new Mesh(new CylinderGeometry(0.11, 0.11, 0.9, 3, 1, true), ribbonMat);
  ribbonL.scale.set(1, 1, 0.12);
  ribbonL.position.set(-0.17, 0.82, -0.02);
  ribbonL.rotation.z = 0.32;
  const ribbonR = ribbonL.clone();
  ribbonR.position.x = 0.17;
  ribbonR.rotation.z = -0.32;
  g.add(disk, rim, inner, ribbonL, ribbonR);
  return g;
}

function makePeak() {
  const geo = new ConeGeometry(0.62, 1.05, 9, 3);
  const p = geo.getAttribute("position");
  // Deterministic ridge noise so the peak reads as rock, not a perfect cone.
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y > 0.5) continue;
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const n = Math.sin(a * 3.1 + y * 5.0) * 0.07 + Math.sin(a * 7.3 - y * 3.0) * 0.04;
    const s = 1 + n;
    p.setX(i, p.getX(i) * s);
    p.setZ(i, p.getZ(i) * s);
  }
  geo.computeVertexNormals();
  const g = new Group();
  const rock = new Mesh(geo, new MeshPhysicalMaterial({
    color: "#a58cff", metalness: 0.2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, flatShading: true,
    iridescence: 0.5, iridescenceIOR: 1.35,
  }));
  const snow = new Mesh(new ConeGeometry(0.2, 0.34, 9, 1), new MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.3, clearcoat: 0.6, flatShading: true }));
  snow.position.y = 0.345;
  g.add(rock, snow);
  return g;
}

export function initHero3D(host) {
  const canvas = document.createElement("canvas");
  canvas.className = "hero-3d";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new AmbientLight(0xffffff, 0.35));
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  const rimC = new PointLight(CYAN, 18, 12);
  rimC.position.set(-4, 1, 2);
  const rimP = new PointLight(PINK, 14, 12);
  rimP.position.set(4, -2, 2);
  scene.add(key, rimC, rimP);

  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const objs = [
    { m: makeFootball(), spin: [0.25, 0.4, 0], depth: 1.0 },
    { m: makeMedal(), spin: [0, 0, 0.05], sway: 0.55, depth: 1.6 },
    { m: makePeak(), spin: [0, 0.3, 0], depth: 0.6 },
  ];
  objs.forEach((o) => scene.add(o.m));

  // Layouts in world units relative to the portrait's on-screen centre.
  let layout = [];
  let portraitCenter = new Vector3();
  const tmp = new Vector3();

  function screenToWorld(x, y, z) {
    // x,y in canvas pixels -> point on plane at depth z
    const rect = canvas.getBoundingClientRect();
    tmp.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1, 0.5).unproject(camera);
    const dir = tmp.sub(camera.position).normalize();
    const dist = (z - camera.position.z) / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(dist));
  }

  const portrait = host.querySelector("[data-photo='01-portrait']");
  function resize() {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    const pr = portrait.getBoundingClientRect();
    const cx = pr.left - r.left + pr.width / 2;
    const cy = pr.top - r.top + pr.height / 2;
    const w = pr.width, h = pr.height;
    portraitCenter = screenToWorld(cx, cy, 0);
    // World units per CSS pixel at depth z, so objects keep the same size relative to the portrait on any screen.
    const upp = (z) => (2 * (camera.position.z - z) * Math.tan(MathUtils.degToRad(camera.fov / 2))) / r.height;
    const size = (px, z, base) => (px * upp(z)) / base;
    const phone = r.width < 800;
    layout = phone
      ? [
          // Phone: the portrait sits top-left, so the objects use the open space to its right.
          { p: screenToWorld(cx - w * 0.52, cy + h * 0.18, 1.2), s: size(w * 0.42, 1.2, 1.25) },
          { p: screenToWorld(cx + w * 0.86, cy - h * 0.2, 2.0), s: size(w * 0.34, 2.0, 1.0) },
          { p: screenToWorld(cx + w * 0.8, cy + h * 0.28, 0.4), s: size(w * 0.42, 0.4, 1.25) },
        ]
      : [
          // football: lower-left edge of the portrait, overlapping it
          { p: screenToWorld(cx - w * 0.5, cy + h * 0.28, 1.2), s: size(w * 0.5, 1.2, 1.25) },
          // medal: right edge, closest to camera
          { p: screenToWorld(cx + w * 0.5, cy - h * 0.12, 2.0), s: size(w * 0.36, 2.0, 1.0) },
          // peak: lower-right
          { p: screenToWorld(cx + w * 0.44, cy + h * 0.42, 0.4), s: size(w * 0.5, 0.4, 1.25) },
        ];
  }

  let px = 0, py = 0, tx = 0, ty = 0;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    addEventListener("pointermove", (e) => {
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" }).observe(host);

  const t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = (now - t0) / 1000;
    px += (tx - px) * 0.06;
    py += (ty - py) * 0.06;
    // Scroll progress through the hero: 0 at top, 1 when it has left.
    const r = host.getBoundingClientRect();
    const sp = MathUtils.clamp(-r.top / Math.max(r.height, 1), 0, 1);
    objs.forEach((o, i) => {
      const L = layout[i];
      if (!L) return;
      const bob = Math.sin(t * 0.9 + i * 2.1) * 0.08;
      // Pointer parallax scales with depth; scroll pushes objects apart and up.
      o.m.position.set(
        L.p.x + px * 0.25 * o.depth + (L.p.x - portraitCenter.x) * sp * 0.6,
        L.p.y + bob - py * 0.18 * o.depth + sp * (1.2 + o.depth * 1.6),
        L.p.z + sp * o.depth * 1.5
      );
      o.m.scale.setScalar(L.s);
      o.m.rotation.x = o.spin[0] * t + py * 0.3 + sp * 1.2;
      o.m.rotation.y = (o.sway ? Math.sin(t * 0.6) * o.sway : o.spin[1] * t) + px * 0.5;
      o.m.rotation.z = o.spin[2] * Math.sin(t) * 2;
    });
    renderer.render(scene, camera);
  }

  resize();
  addEventListener("resize", resize);
  if (document.fonts) document.fonts.ready.then(resize);
  // The portrait may change size once a real photo loads.
  new ResizeObserver(resize).observe(portrait);
  requestAnimationFrame(frame);
}
