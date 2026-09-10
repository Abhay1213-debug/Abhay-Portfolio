import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a
                href="mailto:abhay.prabhakar2028@mastersunion.org"
                data-cursor="disable"
              >
                abhay.prabhakar2028@mastersunion.org
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+918756767681" data-cursor="disable">
                +91 87567 67681
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social & Links</h4>
            <a
              href="https://www.linkedin.com/in/abhay-prabhakar-8b2b2217b/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="mailto:abhay.prabhakar2028@mastersunion.org"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
            <a
              href="tel:+918756767681"
              data-cursor="disable"
              className="contact-social"
            >
              Call Directly <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Strategy, Operations <br /> & <span>Investment Analysis</span>
            </h2>
            <h5>
              <MdCopyright /> 2026 Abhay Prabhakar
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
