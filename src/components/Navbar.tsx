import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother | null = null;

const Navbar = () => {
  useEffect(() => {
    try {
      if (
        document.querySelector("#smooth-wrapper") &&
        document.querySelector("#smooth-content")
      ) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.7,
          speed: 1.7,
          effects: true,
          autoResize: true,
          ignoreMobileResize: true,
        });

        if (smoother && typeof smoother.scrollTop === "function") {
          smoother.scrollTop(0);
          smoother.paused(true);
        }
      }
    } catch (e) {
      console.warn("ScrollSmoother error:", e);
      document.body.style.overflowY = "auto";
    }

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        let targetElem = e.currentTarget as HTMLAnchorElement;
        let section = targetElem.getAttribute("data-href");
        if (section) {
          if (
            smoother &&
            typeof smoother.scrollTo === "function" &&
            window.innerWidth > 1024
          ) {
            e.preventDefault();
            smoother.scrollTo(section, true, "top top");
          } else {
            const targetSection = document.querySelector(section);
            if (targetSection) {
              e.preventDefault();
              targetSection.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      });
    });

    const onResize = () => {
      try {
        if (smoother) {
          ScrollSmoother.refresh(true);
        }
      } catch (e) {
        // ignore resize error
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div className="header">
        <div className="navbar-brand">
          <a href="/#" className="navbar-title" data-cursor="disable">
            AP
          </a>
          <span className="navbar-separator">/</span>
          <a
            href="mailto:abhay.prabhakar2028@mastersunion.org"
            className="navbar-connect"
            data-cursor="disable"
          >
            abhay.prabhakar2028@mastersunion.org
          </a>
        </div>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career">
              <HoverLinks text="EXPERIENCE" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#achievements" href="#achievements">
              <HoverLinks text="ACHIEVEMENTS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
