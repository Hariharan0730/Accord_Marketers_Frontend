import "../styles/whyai.css";

export default function WhyAI() {
  return (
    <section className="whyai">
      <div className="container">
        <h2 className="section-title">Why AI in Digital Marketing?</h2>

        <p className="whyai-intro">
          Artificial Intelligence helps businesses understand customers better,
          predict behavior, and run smarter marketing campaigns with higher ROI.
        </p>

        <div className="whyai-points">
          <div className="whyai-card">
            <h3>Data-Driven Decisions</h3>
            <p>
              AI analyzes large volumes of data to identify patterns and insights
              humans might miss.
            </p>
          </div>

          <div className="whyai-card">
            <h3>Better Targeting</h3>
            <p>
              Reach the right audience at the right time with personalized
              marketing strategies.
            </p>
          </div>

          <div className="whyai-card">
            <h3>Improved ROI</h3>
            <p>
              Optimize campaigns continuously to reduce cost and improve
              conversion rates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}