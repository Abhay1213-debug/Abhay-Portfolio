import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./style.css";
import { inject } from "@vercel/analytics";

inject();

// Mobile menu
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "✕" : "☰";
});
document.querySelectorAll("#nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  })
);

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Highlight the current section in the nav
const links = [...document.querySelectorAll("#nav-links a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    }),
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));
