import { SplitText } from "gsap-trial/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  
  try {
    if (smoother && typeof smoother.paused === "function") {
      smoother.paused(false);
    }
  } catch (e) {
    console.warn("smoother.paused error:", e);
  }

  try {
    const mainElem = document.getElementsByTagName("main")[0];
    if (mainElem) {
      mainElem.classList.add("main-active");
    }
  } catch (e) {
    console.warn("main-active class error:", e);
  }

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  try {
    const landingH1 = document.querySelector(".landing-intro h1");
    if (landingH1) {
      var landingText = new SplitText(
        [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
        {
          type: "chars,lines",
          linesClass: "split-line",
        }
      );
      if (landingText && landingText.chars && landingText.chars.length > 0) {
        gsap.fromTo(
          landingText.chars,
          { opacity: 0, y: 80, filter: "blur(5px)" },
          {
            opacity: 1,
            duration: 1.2,
            filter: "blur(0px)",
            ease: "power3.inOut",
            y: 0,
            stagger: 0.025,
            delay: 0.3,
          }
        );
      }
    }
  } catch (e) {
    console.warn("landingText SplitText error:", e);
  }

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  try {
    let TextProps = { type: "chars,lines", linesClass: "split-h2" };
    const h2Info = document.querySelector(".landing-h2-info");
    const h2Info1 = document.querySelector(".landing-h2-info-1");
    const h21 = document.querySelector(".landing-h2-1");
    const h22 = document.querySelector(".landing-h2-2");

    if (h2Info && h2Info1) {
      var landingText2 = new SplitText(".landing-h2-info", TextProps);
      var landingText3 = new SplitText(".landing-h2-info-1", TextProps);
      if (landingText2?.chars && landingText3?.chars) {
        LoopText(landingText2, landingText3);
      }
    }

    if (h21 && h22) {
      var landingText4 = new SplitText(".landing-h2-1", TextProps);
      var landingText5 = new SplitText(".landing-h2-2", TextProps);
      if (landingText4?.chars && landingText5?.chars) {
        LoopText(landingText4, landingText5);
      }
    }
  } catch (e) {
    console.warn("LoopText error:", e);
  }
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  if (!Text1?.chars || !Text2?.chars) return;
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
