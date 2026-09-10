import { useState } from "react";
import "./styles/Career.css";

interface CareerItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  tag?: string;
  bullets: string[];
}

const experienceData: CareerItem[] = [
  {
    role: "Co-Founder – Strategy & Operations",
    company: "BASERA (Premium Home Décor)",
    period: "NOW",
    location: "Gurugram",
    tag: "E-Commerce & Operations",
    bullets: [
      "Generated ₹52.3K first-month revenue launching a premium home décor venture across 8 SKUs.",
      "Engineered a value-based pricing model via competitor benchmarking & willingness-to-pay analysis.",
      "Rationalized a 35-SKU portfolio into 8 high-velocity products through weekly performance metrics.",
      "Managed supplier coordination across 3+ vendors, streamlining fulfillment & product availability.",
      "Leveraged Generative AI for product visuals and digital ad creatives, elevating brand positioning.",
    ],
  },
  {
    role: "Marketing Intern",
    company: "Okaya EV Pvt. Ltd.",
    period: "2024",
    location: "Delhi",
    tag: "Digital & CRM Growth",
    bullets: [
      "Managed CRM operations for 1,000+ customers, resolving after-sales queries & boosting retention.",
      "Spearheaded dealer onboarding to Google Business for 350+ dealers, expanding nationwide visibility.",
      "Executed 6 multi-platform digital campaigns via Metricool, scheduling 100+ high-engagement posts.",
      "Analyzed customer feedback & campaign analytics, driving a measurable 12% increase in engagement.",
    ],
  },
  {
    role: "Finance Intern",
    company: "One's Own Financer",
    period: "2024",
    location: "Remote",
    tag: "Investment Analysis",
    bullets: [
      "Screened 100+ equities through quantitative & technical analysis, yielding 25+ actionable trade calls.",
      "Evaluated 20+ trading strategies via historical backtesting, identifying 3 high-alpha models.",
      "Analyzed financial statements of 15+ companies to assess capital structure, solvency, and growth potential.",
    ],
  },
];

const educationData: CareerItem[] = [
  {
    role: "PGP in Technology & Business Management",
    company: "Masters' Union",
    period: "NOW",
    location: "Gurugram",
    tag: "Young Leaders Cohort",
    bullets: [
      "Pursuing flagship management program with emphasis on venture creation, strategy, and operations.",
      "Hands-on immersion in business scalability, corporate finance, and emerging technologies.",
    ],
  },
  {
    role: "Bachelor of Commerce (Hons)",
    company: "Jagannath University",
    period: "2025",
    location: "Delhi",
    tag: "Gold Medalist (CGPA: 8.6/10)",
    bullets: [
      "Awarded Gold Medalist & Batch Topper among 400+ undergraduate students.",
      "Specialized in Financial Accounting, Advanced Corporate Finance, Auditing, and Business Economics.",
      "Active leader across collegiate academic initiatives, debate forums, and business conclaves.",
    ],
  },
  {
    role: "CBSE Class XII (92.8%) & Class X (93.2%)",
    company: "Aditya Birla Public School",
    period: "2022",
    location: "Amethi",
    tag: "Top 5% & Elected Headboy",
    bullets: [
      "Ranked in top 5% among 100+ students in CBSE Board Examinations.",
      "Elected Headboy of the school, leading the student council and institutional ceremonies.",
    ],
  },
];

const leadershipData: CareerItem[] = [
  {
    role: "Head Coordinator",
    company: "Jagannath University",
    period: "2025",
    location: "Delhi",
    tag: "Campus Operations",
    bullets: [
      "Executed 20+ university events by mobilizing 80+ volunteers and engaging 2,000+ attendees.",
      "Anchored 2 flagship college cultural & management festivals before crowds of 1,000+.",
      "Directed end-to-end logistics, sponsor deliverables, and stage management without hitches.",
    ],
  },
  {
    role: "Elected Headboy",
    company: "Aditya Birla Public School",
    period: "2022",
    location: "Amethi",
    tag: "Student Leadership",
    bullets: [
      "Led 15+ student council initiatives, directly engaging 500+ students in academic & cultural activities.",
      "Conducted 50+ official school assemblies, delegating duties and representing the student body.",
    ],
  },
  {
    role: "Lead Organizer – Book Donation Drive",
    company: "Social Impact Initiative",
    period: "2023",
    location: "Delhi",
    tag: "Community Upliftment",
    bullets: [
      "Spearheaded a 4-month drive collecting 800+ educational books for 200+ underprivileged children.",
      "Coordinated 40+ student volunteers, facilitating book & material donations valued at over ₹1 Lakh.",
    ],
  },
];

const Career = () => {
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "leadership" | "upcoming"
  >("experience");

  const currentItems =
    activeTab === "experience"
      ? experienceData
      : activeTab === "education"
      ? educationData
      : activeTab === "leadership"
      ? leadershipData
      : [];

  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> journey
        </h2>

        <div className="career-tabs">
          <button
            className={`career-tab-btn ${activeTab === "experience" ? "active" : ""}`}
            onClick={() => setActiveTab("experience")}
            data-cursor="disable"
          >
            Experience & Ventures
          </button>
          <button
            className={`career-tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
            data-cursor="disable"
          >
            Upcoming Ventures
          </button>
          <button
            className={`career-tab-btn ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
            data-cursor="disable"
          >
            Education & Honors
          </button>
          <button
            className={`career-tab-btn ${activeTab === "leadership" ? "active" : ""}`}
            onClick={() => setActiveTab("leadership")}
            data-cursor="disable"
          >
            Leadership & Impact
          </button>
        </div>

        {currentItems.length > 0 && (
          <div className="career-info">
            <div className="career-timeline">
              <div className="career-dot"></div>
            </div>

            {currentItems.map((item, idx) => (
              <div className="career-info-box" key={idx}>
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{item.role}</h4>
                    <h5>{item.company}</h5>
                    {item.tag && <span className="career-tag-pill">{item.tag}</span>}
                  </div>
                  <h3>{item.period}</h3>
                </div>
                <div className="career-desc">
                  <ul>
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Ventures Section - placed right where experience and ventures end */}
        {(activeTab === "experience" || activeTab === "upcoming") && (
          <div className="upcoming-ventures-wrapper" id="upcoming-ventures">
            <div className="upcoming-ventures-badge-row">
              <span className="upcoming-sub-badge">Upcoming Ventures</span>
            </div>

            <div className="upcoming-venture-content">
              <h3 className="venture-company-name">Solar Care</h3>
              <h4 className="venture-founder-role">Role: <span>Founder</span></h4>

              <div className="venture-display-card">
                <div className="venture-card-icon" title="Solar Care Overview">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
                <p className="venture-card-description">
                  Solar Care is an early-stage clean energy venture focused on making solar solutions more accessible, reliable, and affordable. The initiative aims to simplify the adoption of solar energy for homes and businesses by combining customer-centric service with practical, sustainable solutions. Currently in its building phase, the venture is focused on laying a strong foundation for long-term growth and impact.
                </p>
              </div>

              <div className="venture-button-row">
                <a
                  href="https://solarcaresetup.lovable.app"
                  target="_blank"
                  rel="noreferrer"
                  className="venture-website-link"
                  data-cursor="disable"
                >
                  <svg className="venture-globe" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>Visit Website</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;

