import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/adminlayout.css";

export default function AdminLayout() {

    const [collapsed, setCollapsed] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {

        if (window.innerWidth <= 426) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }

    };

    
    const closeMobileSidebar = () => {
        if (window.innerWidth <= 426) {
            setMobileOpen(false);
        }
    };

    return (

        <div className={`admin-container ${collapsed ? "collapsed" : ""}`}>

            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                closeMobileSidebar={closeMobileSidebar}
            />

            
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                ></div>
            )}

            <div className="admin-content-area">

                <Header
                    toggleSidebar={toggleSidebar}
                    collapsed={collapsed}
                />

                <main className="admin-main">
                    <Outlet />
                </main>

            </div>

        </div>

    );

}