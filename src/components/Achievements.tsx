import { useState } from "react";
import { FaAward, FaCertificate, FaTrophy } from "react-icons/fa6";
import "./styles/Achievements.css";

interface AwardItem {
  title: string;
  issuer: string;
  highlight: string;
  description: string;
  tag: string;
}

const certifications: AwardItem[] = [
  {
    title: "Business Development: From Start to Scale",
    issuer: "NPTEL • IIT Madras",
    highlight: "Top 2% Nationwide",
    description:
      "Achieved elite top 2% ranking among 2,500+ candidates nationwide. Specialized in go-to-market strategies, customer discovery, unit economics, and venture scaling.",
    tag: "IIT Madras",
  },
  {
    title: "Technical Analysis: Art to Trade in Stock Market",
    issuer: "Infosys Springboard",
    highlight: "Equity & Quant Analytics",
    description:
      "Comprehensive certification covering technical chart patterns, momentum indicators, risk management, and quantitative trade execution in Indian equity markets.",
    tag: "Infosys",
  },
  {
    title: "A2Z of Finance",
    issuer: "Elearnmarkets",
    highlight: "Corporate Finance & Valuation",
    description:
      "Mastery of financial statement analysis, ratio benchmarking, equity valuation methodologies, and corporate finance frameworks.",
    tag: "Finance",
  },
  {
    title: "E-Business",
    issuer: "NPTEL • IIT Kharagpur",
    highlight: "Digital Commerce & Systems",
    description:
      "In-depth curriculum in electronic commerce business models, supply chain integration, digital payment infrastructures, and online enterprise strategy.",
    tag: "IIT Kharagpur",
  },
];

const honors: AwardItem[] = [
  {
    title: "Gold Medalist & Batch Topper",
    issuer: "Jagannath University • B.Com (Hons)",
    highlight: "CGPA: 8.6 / 10 • Rank 1 of 400+",
    description:
      "Awarded the prestigious University Gold Medal for highest academic standing across 400+ undergraduate commerce students.",
    tag: "Gold Medal",
  },
  {
    title: "Best Debater of the University",
    issuer: "University Parliamentary Debate",
    highlight: "1st Place (100+ Participants)",
    description:
      "Recognized as top debater for persuasive rhetoric, critical argumentation, and macroeconomic policy analysis.",
    tag: "Public Speaking",
  },
  {
    title: "Commerce Talent Search Exam (CTSE)",
    issuer: "National Commerce Council",
    highlight: "Rank 2 • ₹5,000 Cash Prize",
    description:
      "Secured 2nd position in national commerce competition testing economics, financial accounting, and business acumen.",
    tag: "Academic",
  },
  {
    title: "CBSE Cluster Football Championship",
    issuer: "CBSE Sports Board",
    highlight: "4th Place (90+ Schools)",
    description:
      "Led team to the semifinals in inter-school football championship competing against 90+ premier institutions.",
    tag: "Athletics",
  },
  {
    title: "6+ Medals in Athletics & Sports",
    issuer: "Inter-School Sports Meets",
    highlight: "Track, Football & Basketball",
    description:
      "Multiple podium finishes demonstrating high endurance, discipline, team collaboration, and tactical leadership.",
    tag: "Sports",
  },
  {
    title: "5+ Inter-House Academic Trophies",
    issuer: "Aditya Birla Public School",
    highlight: "Mathematics & Extempore",
    description:
      "Consistently secured first-place finishes in regional mathematics Olympiads, English forensics, and impromptu extempore speaking.",
    tag: "Leadership",
  },
];

const Achievements = () => {
  const [filter, setFilter] = useState<"all" | "certs" | "honors">("all");

  const displayList =
    filter === "certs"
      ? certifications
      : filter === "honors"
      ? honors
      : [...certifications, ...honors];

  return (
    <div className="achievements-section section-container" id="achievements">
      <div className="achievements-container">
        <div className="achievements-header">
          <h2>
            Honors <span>&</span> Certifications
          </h2>
          <p className="achievements-subtitle">
            Recognitions for academic distinction, industry-certified competencies, and cross-functional leadership.
          </p>

          <div className="achievements-filter">
            <button
              className={`achieve-filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              data-cursor="disable"
            >
              <FaAward /> All ({certifications.length + honors.length})
            </button>
            <button
              className={`achieve-filter-btn ${filter === "certs" ? "active" : ""}`}
              onClick={() => setFilter("certs")}
              data-cursor="disable"
            >
              <FaCertificate /> Certifications ({certifications.length})
            </button>
            <button
              className={`achieve-filter-btn ${filter === "honors" ? "active" : ""}`}
              onClick={() => setFilter("honors")}
              data-cursor="disable"
            >
              <FaTrophy /> Honors & Awards ({honors.length})
            </button>
          </div>
        </div>

        <div className="achievements-grid">
          {displayList.map((item, index) => (
            <div className="achieve-card" key={index}>
              <div className="achieve-card-top">
                <span className="achieve-pill">{item.tag}</span>
                <span className="achieve-highlight">{item.highlight}</span>
              </div>
              <h3 className="achieve-title">{item.title}</h3>
              <h4 className="achieve-issuer">{item.issuer}</h4>
              <p className="achieve-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
