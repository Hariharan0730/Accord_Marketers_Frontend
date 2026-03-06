import { useState, useEffect } from "react";
import API from "../../api/axios";
import { FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/header.css";

export default function Header({ toggleSidebar, collapsed }) {

    const [admin, setAdmin] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/api/admin/profile");
            setAdmin(res.data);
        } catch (err) {
            console.error("Profile load error:", err);
        }
    };

    const getAvatar = () => {

        if (admin?.profileImage && admin.profileImage !== "") {
            return admin.profileImage;
        }

        const letter = (admin?.name || "A").charAt(0).toUpperCase();

        return `https://ui-avatars.com/api/?name=${letter}&background=2563eb&color=fff&size=128`;
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
    };

    return (

        <>
        <header className="admin-header">

            <div className="header-left">

                <button className="menu-toggle" onClick={toggleSidebar}>
                    {collapsed ? <FiMenu /> : <FiX />}
                </button>

                <h1>Admin Dashboard</h1>

            </div>

            <div className="header-right">

                <div
                    className="profile-trigger"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    <img src={getAvatar()} alt="admin avatar" />
                </div>

                {showMenu && (

                    <div className="profile-menu">

                        <div className="profile-info">

                            <img
                                className="img"
                                src={getAvatar()}
                                alt="admin avatar"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPreview(true)}
                            />

                            <div className="profile-text">
                                <strong>{admin?.name || "Admin"}</strong>
                                <p>{admin?.email || ""}</p>
                            </div>

                        </div>

                        <hr />

                        <button
                            className="menu-item"
                            onClick={() => (window.location.href = "/admin/settings")}
                        >
                            <FaUserCog className="menu-icon" />
                            <span>Account Settings</span>
                        </button>

                        <button
                            className="menu-item logout-item"
                            onClick={logout}
                        >
                            <FaSignOutAlt className="menu-icon" />
                            <span>Logout</span>
                        </button>

                    </div>

                )}

            </div>

        </header>


        {showPreview && (
            <div
                className="image-preview-overlay"
                onClick={() => setShowPreview(false)}
            >
                <div
                    className="image-preview-box"
                    onClick={(e) => e.stopPropagation()}
                >

                    <img src={getAvatar()} alt="preview" />

                    <button
                        className="preview-close"
                        onClick={() => setShowPreview(false)}
                    >
                        ✕
                    </button>

                </div>
            </div>
        )}

        </>
    );
}