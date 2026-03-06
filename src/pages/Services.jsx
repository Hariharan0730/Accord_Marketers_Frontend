import "../styles/services.css";

export default function Services() {
  return (
    <section className="services-page">
      <div className="container container-ser">
        <h1 className="services-page-title">Our Services</h1>

        <p className="services-page-desc">
          Accord Marketers provides AI-powered digital marketing services designed
          to help businesses increase visibility, engagement, and conversions in
          today’s competitive digital landscape.
        </p>

        <div className="services-page-grid">

          <div id="seo" className="services-page-card">
            <h3>Search Engine Optimization (SEO)</h3>
            <p>
              Improve your website’s ranking and organic traffic through
              intelligent keyword research, content optimization, and technical SEO.
            </p>
          </div>

          <div id="smm" className="services-page-card">
            <h3>Social Media Marketing</h3>
            <p>
              Build strong brand presence and engage your audience across social
              media platforms using data-backed strategies.
            </p>
          </div>

          <div id="ads" className="services-page-card">
            <h3>Paid Advertising</h3>
            <p>
              Run AI-optimized ad campaigns on Google and social platforms to
              maximize ROI and reduce ad spend waste.
            </p>
          </div>

          <div id="content" className="services-page-card">
            <h3>Content Marketing</h3>
            <p>
              Create valuable, relevant content that attracts, educates, and
              converts your target audience.
            </p>
          </div>

          <div id="website" className="services-page-card">
            <h3>Website Optimization</h3>
            <p>
              Enhance website performance, user experience, and conversion rates
              through data-driven improvements.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}