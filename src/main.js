import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "lenis/dist/lenis.css";
import "./vendor/scrollcraft.css";
import "./style.css";
import "./vendor/scrollcraft.js";
import Lenis from "lenis";
import { inject } from "@vercel/analytics";

inject();

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const webgl = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && c.getContext("webgl2"));
  } catch {
    return false;
  }
})();
const rich = webgl && !reduce;

// Without WebGL or with reduced motion, the Skills act becomes a plain,
// readable section (the list of skills and their proof) instead of a pinned 3D world.
const skills = document.getElementById("skills");
if (!rich) {
  skills.removeAttribute("data-sc-act");
  skills.removeAttribute("data-sc-span");
  skills.classList.add("skills--static");
}

window.ScrollCraft.mount(document);

// Buttery scroll: Lenis drives native scroll, so the engine's scroll reads still work.
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -64 } });
}

// Mobile menu
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-btn");
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "✕" : "☰";
};
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.querySelectorAll("#nav-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Highlight the current section in the nav
const links = [...document.querySelectorAll("#nav-links a")];
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));

// 3D layers load on demand so the first paint stays light.
if (rich) {
  import("./hero3d.js").then(({ initHero3D }) => initHero3D(document.getElementById("hero")));
  // Load the Skills world when the visitor approaches it, or once the page is idle.
  let started = false;
  const startSkills = () => {
    if (started) return;
    started = true;
    io.disconnect();
    import("./skills3d.js").then(({ initSkills3D }) => initSkills3D(skills));
  };
  const io = new IntersectionObserver(([e]) => e.isIntersecting && startSkills(), { rootMargin: "1500px 0px" });
  io.observe(skills);
  addEventListener("load", () => setTimeout(startSkills, 2500));
}
