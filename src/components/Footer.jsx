import "../styles/footer.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Footer() {

  const [website, setWebsite] = useState({
    siteTitle: "Accord Marketers",
    contactEmail: "",
    phone: ""
  });

  useEffect(() => {

    const fetchSettings = async () => {
      try {

        const res = await API.get("/api/settings/public");

        setWebsite(res.data.website);

      } catch (err) {
        console.log("Footer settings error:", err);
      }
    };

    fetchSettings();

  }, []);

  return (
    <footer className="footer">

      <div className="container footer-inner">

        

        <div className="footer-brand">

          <h3>
            <Link to="/">
              {website.siteTitle || "Accord"}
            </Link>
          </h3>

          <p>
            AI-powered digital marketing agency helping brands grow smarter,
            faster, and more efficiently in the modern digital world.
          </p>


        </div>

        

        <div className="footer-links">

          <h4>Quick Links</h4>

          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

        </div>


        <div className="footer-links">

          <h4>Our Services</h4>

          <ul>
            <li><Link to="/services#seo">SEO Optimization</Link></li>
            <li><Link to="/services#smm">Social Media Marketing</Link></li>
            <li><Link to="/services#ads">Paid Advertising</Link></li>
            <li><Link to="/services#content">Content Strategy</Link></li>
            <li><Link to="/services#website">Website Optimization</Link></li>
          </ul>

        </div>

        

        <div className="footer-contact">

          <h4>Contact Us</h4>

          <p>Email: {website.contactEmail}</p>
          <p>Phone: {website.phone}</p>
          <p>Chennai, Tamil Nadu</p>

        </div>

      </div>

      

      <div className="footer-bottom">
        
        <div className="footer-social-bottom">
          <span>Instagram</span>
          <span>|</span>
          <span>LinkedIn</span>
          <span>|</span>
          <span>Facebook</span>
        </div>

        <p>
          © {new Date().getFullYear()} {website.siteTitle}. All rights reserved.
        </p>



        <div className="footer-legal">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>

      </div>

    </footer>
  );
}