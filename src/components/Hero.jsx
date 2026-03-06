import "../styles/hero.css";
import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="hero">
      <div className=" hero-content">
        <h1>
          AI-Powered Digital Marketing <br />
          That Grows Your Business
        </h1>

        <p>
          Accord Marketers helps brands grow faster using data-driven and
          AI-enabled digital marketing strategies.
        </p>

        <Link to="/contact"className="hero-btn">
          Get Free Consultation
        </Link>
      </div>
    </section>
  );
}