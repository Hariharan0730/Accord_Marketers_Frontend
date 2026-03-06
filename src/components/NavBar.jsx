import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {

  const [siteTitle, setSiteTitle] = useState("Accord");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const res = await API.get("/api/settings/public");
        setSiteTitle(res.data?.website?.siteTitle || "Accord");
      } catch (err) {
        console.log(err);
      }
    };

    fetchSettings();

  }, []);

  return (
    <header>
      <nav className="navbar">
        <div className="container navbar-inner">

          <div className="logo">
            <Link to="/">{siteTitle}</Link>
          </div>


          <div
            className={`nav-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

          <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>

        </div>
      </nav>
    </header>
  );
}