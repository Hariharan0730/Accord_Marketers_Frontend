import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/s-case.css";

export default function SingleCaseStudy() {

  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchCaseStudy = async () => {
      try {
        const { data } = await API.get(`/api/case-studies/${slug}`);
        setCaseStudy(data);
      } catch (err) {
        console.error("Error fetching case study:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();

  }, [slug]);

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  if (!caseStudy)
    return <h2 style={{ textAlign: "center" }}>Case Study Not Found</h2>;

  return (
    <div className="single-case">

      
      <div className="case-hero">
        <img src={caseStudy.coverImage} alt={caseStudy.title} />

        <div className="hero-overlay">
          <h1>{caseStudy.title}</h1>

          {caseStudy.client?.name && (
            <p className="hero-client">{caseStudy.client.name}</p>
          )}
        </div>
      </div>


      
      <div className="case-content">

        <div className="paper-c">

          
          <section className="case-intro">
            <p>{caseStudy.excerpt}</p>
          </section>


          
          {caseStudy.servicesUsed?.filter(Boolean).length > 0 && (
            <section className="case-services">

              <h3>Services Used</h3>

              <div className="services-list">
                {caseStudy.servicesUsed
                  .filter(Boolean)
                  .map((service, i) => (
                    <span key={i}>{service}</span>
                  ))}
              </div>

            </section>
          )}


          
          <section className="case-section">
            <h2>The Challenge</h2>
            <p>{caseStudy.problem}</p>
          </section>


          
          <section className="case-section">
            <h2>The Strategy</h2>
            <p>{caseStudy.strategy}</p>
          </section>


          
          {caseStudy.execution && (
            <section className="case-section">
              <h2>Execution</h2>
              <p>{caseStudy.execution}</p>
            </section>
          )}


          
          {caseStudy.metrics?.length > 0 && (
            <section className="case-metrics">

              {caseStudy.metrics.map((metric, i) => (
                <div className="metric-card" key={i}>
                  <h3>{metric.value}</h3>
                  <p>{metric.label}</p>
                </div>
              ))}

            </section>
          )}


          
          <section className="case-section">
            <h2>Impact</h2>
            <p>{caseStudy.result}</p>
          </section>
        </div>


        
        <Link to="/case-studies" className="case-back">
          ← Back to Case Studies
        </Link>

      </div>

    </div>
  );
}