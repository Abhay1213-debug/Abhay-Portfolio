import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-image-wrapper">
        <div className="about-image-card">
          <div className="about-image-glow"></div>
          <div className="about-image-container">
            <img
              src="/images/abhay_profile.jpg"
              alt="Abhay Prabhakar"
              className="about-image"
            />
            <div className="about-image-badge">
              <span className="status-dot"></span>
              <span className="badge-text">Masters' Union • MBA Candidate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I believe business is best learned by building it. From scaling a D2C venture to co-founding new startups, I've always been driven by identifying opportunities and executing them. Currently pursuing my MBA at Masters' Union, I'm passionate about strategy, entrepreneurship, and building businesses that create lasting impact.
        </p>
        <div className="about-highlights">
          <div className="about-badge">
            <span className="about-badge-num">Gold Medalist</span>
            <span className="about-badge-label">Batch Topper (400+ Students)</span>
          </div>
          <div className="about-badge">
            <span className="about-badge-num">₹52.3K</span>
            <span className="about-badge-label">1st Month Revenue @ Basera</span>
          </div>
          <div className="about-badge">
            <span className="about-badge-num">1,000+</span>
            <span className="about-badge-label">CRM Customers Managed</span>
          </div>
          <div className="about-badge">
            <span className="about-badge-num">350+</span>
            <span className="about-badge-label">Dealers Onboarded to Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
