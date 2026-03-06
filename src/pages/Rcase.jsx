import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/rcase.css";

export default function Rcase() {

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCases = async () => {
      try {

        const { data } = await API.get(
          "/api/case-studies?limit=2&random=true"
        );

        // SAFE SET
        setCases(Array.isArray(data.caseStudies) ? data.caseStudies : []);

      } catch (error) {
        console.error("Error fetching case studies:", error);
        setCases([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCases();

  }, []);

  if (loading) return null;

  return (
    <section className="home-case-section">

      <div className="container">

        <h2>Case Studies</h2>

        <div className="home-case-grid">

          {Array.isArray(cases) && cases.map((item) => (

            <Link
              key={item._id}
              to={`/case-studies/${item.slug}`}
              className="home-case-card"
            >

              <div className="case-img">
                <img src={item.coverImage} alt={item.title} />
              </div>

              <div className="home-case-overlay">

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.industry}</p>
                </div>

                <div className="home-arrow">↗</div>

              </div>

            </Link>

          ))}

        </div>

        <Link to="/case-studies" className="view-all-btn">
          View More Case Studies →
        </Link>

      </div>

    </section>
  );
}