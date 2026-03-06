import "../styles/process.css";
import { Link } from "react-router-dom";
export default function Process() {
    return (
        <section className="process">
            <div className="h1-cont"> <h1>Our Process</h1></div>
            <div className="container process-wrapper">

                
                <div className="process-steps">

                    <div className="process-step">
                        <span className="step-number">01</span>
                        <h3>Analyze</h3>
                        <p>
                            We understand your business goals, audience, and current digital presence.
                        </p>
                    </div>

                    <div className="process-step">
                        <span className="step-number">02</span>
                        <h3>Strategize</h3>
                        <p>
                            AI-powered insights help us create a tailored marketing strategy for your brand.
                        </p>
                    </div>

                    <div className="process-step">
                        <span className="step-number">03</span>
                        <h3>Execute</h3>
                        <p>
                            We launch and manage campaigns across platforms with continuous optimization.
                        </p>
                    </div>

                    <div className="process-step">
                        <span className="step-number">04</span>
                        <h3>Optimize</h3>
                        <p>
                            Performance is monitored and improved regularly to maximize results.
                        </p>
                    </div>

                </div>

                
                <div className="process-content">
                    <h2>Strategic Steps to Reach Your Digital Goals</h2>
                    <p>
                        Our structured AI-driven process ensures measurable growth. From research
                        to execution and optimization, we continuously refine strategies to deliver
                        long-term digital success.
                    </p>

                    <Link to="/contact" className="process-btn">
                        Get Started
                    </Link>
                </div>

            </div>
        </section>
    );
}