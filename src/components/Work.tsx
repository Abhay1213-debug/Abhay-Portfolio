import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Project {
  number: string;
  name: string;
  category: string;
  tools: string;
  image: string;
  link?: string;
}

const projects: Project[] = [
  {
    number: "01",
    name: "BASERA",
    category: "Home Decor Venture",
    tools: "Shopify, Meta Ads, GenAI, Pricing Strategy, Vendor Management",
    image: "/images/project_basera.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
  {
    number: "02",
    name: "OKAYA EV",
    category: "Marketing & CRM Operations",
    tools: "CRM Operations, Metricool, Google Business, Campaign Analytics",
    image: "/images/project_okaya.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
  {
    number: "03",
    name: "EQUITY ANALYSIS",
    category: "One's Own Financer",
    tools: "Technical Analysis, Backtesting, Financial Statements, Advanced Excel",
    image: "/images/project_finance.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
  {
    number: "04",
    name: "CAMPUS FESTIVALS",
    category: "Leadership & Events",
    tools: "Operations Management, 80+ Volunteers, 20+ Events, 2,000+ Participants",
    image: "/images/project_events.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
  {
    number: "05",
    name: "BOOK DRIVE",
    category: "Social Impact Initiative",
    tools: "Community Outreach, 800+ Books, 200+ Children, ₹1 Lakh+ Impact",
    image: "/images/project_bookdrive.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
  {
    number: "06",
    name: "VENTURE SCALING",
    category: "IIT Madras Top 2%",
    tools: "Business Development, Start-to-Scale Frameworks, Technical Analysis",
    image: "/images/project_research.jpg",
    link: "https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (!box || box.length === 0) return;
      const container = document.querySelector(".work-container");
      if (!container) return;
      const rectLeft = container.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Featured <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project) => (
            <div className="work-box" key={project.number}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools & Competencies</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.name}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
