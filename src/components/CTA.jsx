import "../styles/cta.css";
import { Link } from "react-router-dom";
export default function CTA() {
  return (
    <section className="cta">
      <div className="container cta-box">
        <h2>Ready to Grow Your Business?</h2>
        <p>
          Let Accord Marketers help you scale faster with AI-powered digital
          marketing solutions.
        </p>
        <Link to="/contact" className="cta-btn">Contact Us</Link>
      </div>
    </section>
  );
}