// The peak act: a 3D constellation of skills. Every skill is a glass tile wired
// by a light thread to the project where it was proven ("proof threads").
// Scroll walks the camera through three clusters; hover or tap lights a skill.
// Content is read from the accessible <ul class="skills-list"> in the page, so
// the HTML stays the single source of truth.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector3, Color, Raycaster, Vector2,
  SphereGeometry, TubeGeometry, QuadraticBezierCurve3, MeshBasicMaterial, MeshPhysicalMaterial,
  PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace, AmbientLight, PointLight, MathUtils,
  BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, AdditiveBlending, RingGeometry,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const CLUSTERS = [
  { id: "strategy", name: "Strategy", color: new Color("#2ee6d6"), css: "#2ee6d6" },
  { id: "execution", name: "Execution", color: new Color("#a46bff"), css: "#b48cff" },
  { id: "analysis", name: "Analysis", color: new Color("#ff4fd8"), css: "#ff6be0" },
];

const smooth = (x) => { x = MathUtils.clamp(x, 0, 1); return x * x * (3 - 2 * x); };

export function initSkills3D(section) {
  const stage = section.querySelector(".skills-stage");
  const host = section.querySelector(".skills-canvas");
  const card = section.querySelector(".proof-card");
  const clusterLabel = section.querySelector(".skills-cluster");
  const projects = [...section.querySelectorAll(".skills-anchors li")].map((li) => ({
    id: li.dataset.id, name: li.textContent.trim(), href: li.dataset.href,
  }));
  const skills = [...section.querySelectorAll(".skills-list li")].map((li) => ({
    name: li.querySelector("b").textContent.trim(),
    proof: li.querySelector("span").textContent.trim(),
    cluster: CLUSTERS.findIndex((c) => c.id === li.dataset.cluster),
    proj: li.dataset.proj.split(/\s+/),
  }));

  const mobile = () => innerWidth < 800;

  // ---------- renderer ----------
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const labels = new CSS2DRenderer();
  labels.domElement.className = "skills-labels";
  labels.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(labels.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new AmbientLight(0xffffff, 0.4));
  const camera = new PerspectiveCamera(42, 1, 0.1, 200);

  // Star dust for depth.
  {
    const n = 900, pts = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 14 + Math.random() * 30, a = Math.random() * Math.PI * 2, y = (Math.random() - 0.5) * 22;
      pts.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    scene.add(new Points(g, new PointsMaterial({ color: 0x9d8cff, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false })));
  }

  // ---------- project anchors (the core) ----------
  const core = new Group();
  scene.add(core);
  const anchorPos = {};
  const anchorEls = {};
  const coreRing = new Mesh(new RingGeometry(1.95, 1.98, 96), new MeshBasicMaterial({ color: 0x9d8cff, transparent: true, opacity: 0.35, side: 2 }));
  coreRing.rotation.x = Math.PI / 2;
  coreRing.position.y = -2.1;
  core.add(coreRing);
  projects.forEach((p, i) => {
    const a = (i / projects.length) * Math.PI * 2 + 0.3;
    const pos = new Vector3(Math.cos(a) * 1.96, -2.1, Math.sin(a) * 1.96);
    anchorPos[p.id] = pos;
    const orb = new Mesh(new SphereGeometry(0.11, 24, 16), new MeshBasicMaterial({ color: 0xffffff }));
    orb.position.copy(pos);
    core.add(orb);
    const el = document.createElement("div");
    el.className = "anchor-label";
    el.textContent = p.name;
    const lab = new CSS2DObject(el);
    lab.position.copy(pos).add(new Vector3(0, -0.32, 0));
    core.add(lab);
    anchorEls[p.id] = el;
  });

  // ---------- clusters + skill tiles ----------
  const R = 6;
  const clusterCenters = CLUSTERS.map((_, c) => {
    const th = (c / 3) * Math.PI * 2;
    return { th, pos: new Vector3(Math.sin(th) * R, 1.0, Math.cos(th) * R) };
  });
  const nodes = [];
  const byCluster = CLUSTERS.map(() => []);
  skills.forEach((s, i) => byCluster[s.cluster].push(i));

  byCluster.forEach((list, c) => {
    const C = clusterCenters[c];
    const right = new Vector3(Math.cos(C.th), 0, -Math.sin(C.th)); // tangent
    list.forEach((si, k) => {
      const s = skills[si];
      // Two staggered rows, slight depth jitter, facing outward.
      const cols = Math.ceil(list.length / 2);
      const row = k % 2, col = Math.floor(k / 2);
      const off = (col - (cols - 1) / 2) * 1.45 + (row ? 0.45 : -0.15);
      const pos = C.pos.clone()
        .add(right.clone().multiplyScalar(off))
        .add(new Vector3(0, row ? -0.42 : 0.42, 0))
        .add(C.pos.clone().normalize().multiplyScalar((k % 3) * 0.3 - 0.3));
      const w = Math.min(0.32 + s.name.length * 0.052, 1.4);
      const tile = new Mesh(
        new RoundedBoxGeometry(w, 0.3, 0.07, 4, 0.05),
        new MeshPhysicalMaterial({
          color: "#161833", metalness: 0.3, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1,
          emissive: CLUSTERS[c].color, emissiveIntensity: 0.12,
        })
      );
      tile.position.copy(pos);
      tile.lookAt(pos.clone().multiplyScalar(2));
      tile.userData.index = si;
      scene.add(tile);
      const el = document.createElement("div");
      el.className = "skill-label";
      el.style.setProperty("--c", CLUSTERS[c].css);
      el.textContent = s.name;
      const lab = new CSS2DObject(el);
      tile.add(lab);
      lab.position.set(0, 0, 0.05);

      // Proof threads to each project.
      const threads = s.proj.filter((p) => anchorPos[p]).map((p) => {
        const a = pos.clone(), b = anchorPos[p].clone();
        const mid = a.clone().lerp(b, 0.5).add(new Vector3(0, 1.4 + Math.random() * 0.5, 0));
        const curve = new QuadraticBezierCurve3(a, mid, b);
        const geo = new TubeGeometry(curve, 64, 0.011, 6, false);
        const mat = new MeshBasicMaterial({ color: CLUSTERS[c].color, transparent: true, opacity: 0.12, blending: AdditiveBlending, depthWrite: false });
        const tube = new Mesh(geo, mat);
        scene.add(tube);
        const pulse = new Mesh(new SphereGeometry(0.06, 12, 8), new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
        scene.add(pulse);
        return { tube, curve, pulse, total: geo.index.count, proj: p };
      });
      nodes.push({ tile, el, threads, cluster: c, base: pos.clone(), phase: Math.random() * 6.28, glow: 0 });
    });
  });

  // ---------- interaction ----------
  const ray = new Raycaster();
  const mouse = new Vector2();
  let hover = -1, locked = -1, lockedAt = 0;
  const tiles = nodes.map((n) => n.tile);
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(tiles, false)[0];
    return hit ? hit.object.userData.index : -1;
  }
  const canvasEl = renderer.domElement;
  canvasEl.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    hover = pick(e);
    canvasEl.style.cursor = hover >= 0 ? "pointer" : "";
  });
  canvasEl.addEventListener("pointerleave", () => { hover = -1; });
  canvasEl.addEventListener("click", (e) => {
    const i = pick(e);
    locked = i; lockedAt = performance.now();
  });

  // ---------- proof card ----------
  let shown = -1;
  const cName = card.querySelector(".pc-skill");
  const cProof = card.querySelector(".pc-proof");
  const cTag = card.querySelector(".pc-cluster");
  const cProj = card.querySelector(".pc-projects");
  function showCard(i) {
    if (i === shown) return;
    shown = i;
    const s = skills[i];
    const C = CLUSTERS[s.cluster];
    card.style.setProperty("--c", C.css);
    cTag.textContent = C.name;
    cName.textContent = s.name;
    cProof.textContent = s.proof;
    cProj.innerHTML = "";
    s.proj.forEach((id) => {
      const p = projects.find((x) => x.id === id);
      if (!p) return;
      const a = document.createElement(p.href ? "a" : "span");
      if (p.href) a.href = p.href;
      a.textContent = p.name;
      cProj.appendChild(a);
    });
    card.classList.remove("swap");
    void card.offsetWidth;
    card.classList.add("swap");
  }

  // ---------- layout ----------
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    labels.setSize(w, h);
    camera.aspect = w / h;
    camera.fov = mobile() ? 50 : 40;
    // Keep the constellation clear of the proof card: shift the view left on desktop, up on phones.
    if (mobile()) camera.setViewOffset(w, h, 0, -h * 0.02, w, h);
    else camera.setViewOffset(w, h, w * 0.1, -h * 0.04, w, h);
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener("resize", resize);

  const isVisible = () => { const r = section.getBoundingClientRect(); return r.bottom > -200 && r.top < innerHeight + 200; };

  const camPos = new Vector3(), look = new Vector3(), lookCur = new Vector3(), camCur = new Vector3();
  let first = true, lastCluster = -1;
  const t0 = performance.now();

  function frame(now) {
    requestAnimationFrame(frame);
    if (!isVisible()) return;
    const t = (now - t0) / 1000;
    const p = MathUtils.clamp(parseFloat(getComputedStyle(section).getPropertyValue("--sc-p")) || 0, 0, 1);

    // Which cluster, and how far through it. Last 22% of each third travels on.
    const k = MathUtils.clamp(p * 3, 0, 2.9999);
    const c = Math.floor(k), local = k - c;
    const travel = c < 2 ? smooth((local - 0.78) / 0.22) : 0;
    const th = MathUtils.lerp(clusterCenters[c].th, clusterCenters[Math.min(c + 1, 2)].th, travel);
    const dist = R + (mobile() ? 14.5 : 7.6);
    camPos.set(Math.sin(th) * dist, 3.1 + Math.sin(t * 0.3) * 0.08, Math.cos(th) * dist);
    look.set(Math.sin(th) * R * 0.42, -0.35, Math.cos(th) * R * 0.42);
    if (first) { camCur.copy(camPos); lookCur.copy(look); first = false; }
    camCur.lerp(camPos, 0.08);
    lookCur.lerp(look, 0.08);
    camera.position.copy(camCur);
    camera.lookAt(lookCur);

    // Active skill from scroll, unless the visitor is pointing at one.
    const list = byCluster[travel > 0.5 ? Math.min(c + 1, 2) : c];
    const scrollIdx = list[Math.min(Math.floor(MathUtils.clamp(local / 0.78, 0, 0.999) * list.length), list.length - 1)];
    if (locked >= 0 && now - lockedAt > 6000) locked = -1;
    const active = hover >= 0 ? hover : locked >= 0 ? locked : scrollIdx;
    const activeCluster = skills[active].cluster;
    if (activeCluster !== lastCluster) {
      lastCluster = activeCluster;
      const C = CLUSTERS[activeCluster];
      clusterLabel.textContent = `0${activeCluster + 1} · ${C.name}`;
      clusterLabel.style.setProperty("--c", C.css);
    }
    showCard(active);

    const phone = mobile();
    const lit = new Set(skills[active].proj);
    Object.entries(anchorEls).forEach(([id, el]) => el.classList.toggle("on", lit.has(id)));

    nodes.forEach((n, i) => {
      const on = i === active;
      n.glow += ((on ? 1 : 0) - n.glow) * 0.12;
      n.tile.position.y = n.base.y + Math.sin(t * 0.8 + n.phase) * 0.06;
      n.tile.scale.setScalar(1 + n.glow * 0.18);
      n.tile.material.emissiveIntensity = 0.12 + n.glow * 0.45;
      const inCluster = n.cluster === activeCluster;
      n.el.classList.toggle("on", on);
      n.el.style.opacity = on ? 1 : inCluster && !phone ? 0.82 : 0;
      n.threads.forEach((th2, j) => {
        th2.tube.material.opacity = 0.1 + n.glow * 0.9;
        const draw = on ? smooth(n.glow * 1.15) : 1;
        th2.tube.geometry.setDrawRange(0, Math.floor(th2.total * draw));
        if (on) {
          const u = (t * 0.45 + j * 0.37) % 1;
          th2.pulse.position.copy(th2.curve.getPoint(u));
          th2.pulse.material.opacity = n.glow;
        } else th2.pulse.material.opacity = 0;
      });
    });
    core.rotation.y = Math.sin(t * 0.2) * 0.05;

    renderer.render(scene, camera);
    labels.render(scene, camera);
  }
  requestAnimationFrame(frame);
  section.classList.add("skills--live");
}
