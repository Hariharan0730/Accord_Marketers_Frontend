import { NavLink } from "react-router-dom";
import { FaHome, FaBlog, FaHistory, FaFolderOpen, FaCog, FaEnvelope } from "react-icons/fa";
import "../styles/sidebar.css";

export default function Sidebar({ collapsed, mobileOpen, closeMobileSidebar }) {

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "active" : ""}`}>

            <div className="sidebar-header">
                <h2>{collapsed ? "AM" : "Accord Marketers"}</h2>
            </div>

            <nav className="sidebar-nav">

                <NavLink to="/admin/dashboard" onClick={closeMobileSidebar}>
                    <FaHome className="icon" />
                    <span className="text">Dashboard</span>
                </NavLink>

                <NavLink to="/admin/blogs" onClick={closeMobileSidebar}>
                    <FaBlog className="icon" />
                    <span className="text">Blogs</span>
                </NavLink>

                <NavLink to="/admin/case-studies" onClick={closeMobileSidebar}>
                    <FaFolderOpen className="icon" />
                    <span className="text">Case Studies</span>
                </NavLink>

                <NavLink to="/admin/activity" onClick={closeMobileSidebar}>
                    <FaHistory className="icon" />
                    <span className="text">Activity</span>
                </NavLink>

                <NavLink to="/admin/contacts" onClick={closeMobileSidebar}>
                    <FaEnvelope className="icon" />
                    <span className="text">Leads</span>
                </NavLink>

                <NavLink to="/admin/settings" onClick={closeMobileSidebar}>
                    <FaCog className="icon" />
                    <span className="text">Settings</span>
                </NavLink>

            </nav>

        </aside>

    );
}