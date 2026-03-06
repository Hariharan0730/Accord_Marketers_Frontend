import { useState, useEffect } from "react";
import API from "../../api/axios";
import ChangePassword from "./ChangePassword";
import "../styles/settings.css";

export default function Settings() {

    const [tab, setTab] = useState(
        localStorage.getItem("settingsTab") || "profile"
    );

    const changeTab = (newTab) => {
        setTab(newTab);
        localStorage.setItem("settingsTab", newTab);
    };

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        profileImage: null
    });

    const [website, setWebsite] = useState({
        siteTitle: "",
        contactEmail: "",
        phone: ""
    });

    const [emailSettings, setEmailSettings] = useState({
        smtpEmail: "",
        smtpPassword: "",
        senderName: ""
    });

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchWebsite();
        fetchEmailSettings();
    }, []);

    const fetchProfile = async () => {
        try {

            const res = await API.get("/api/admin/profile");

            setProfile({
                name: res.data.name || "",
                email: res.data.email || "",
                profileImage: res.data.profileImage || null
            });

        } catch (err) {
            console.error("Profile fetch error:", err);
        }
    };

    const fetchWebsite = async () => {
        try {

            const res = await API.get("/api/settings");

            setWebsite({
                siteTitle: res.data?.website?.siteTitle || "",
                contactEmail: res.data?.website?.contactEmail || "",
                phone: res.data?.website?.phone || ""
            });

        } catch (err) {
            console.error("Website fetch error:", err);
        }
    };
    const fetchEmailSettings = async () => {
        try {

            const res = await API.get("/api/settings");

            setEmailSettings(res.data.email || {});

        } catch (err) {
            console.error("Email settings fetch error:", err);
        }
    };

    const updateProfile = async () => {

        try {

            const formData = new FormData();

            formData.append("name", profile.name);
            formData.append("email", profile.email);

            if (profile.profileImage) {
                formData.append("profileImage", profile.profileImage);
            }

            await API.put("/api/admin/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Profile updated");

            window.location.reload();

        } catch (err) {
            console.error("Profile update error:", err);
        }

    };

    const updateWebsite = async () => {

        try {

            await API.put("/api/settings/website", website);

            alert("Website settings updated");

            fetchWebsite();

        } catch (err) {
            console.error("Website update error:", err);
        }

    };

    const updateEmail = async () => {
        try {

            await API.put("/api/settings/email", emailSettings);

            alert("Email settings updated");

            fetchEmailSettings();

        } catch (err) {
            console.error("Email update error:", err);
        }
    };

    const clearLogs = async () => {

        if (!window.confirm("Clear activity logs?")) return;

        try {

            await API.delete("/api/settings/clear-logs");

            alert("Activity logs cleared");

        } catch (err) {
            console.error("Clear logs error:", err);
        }

    };

    return (

        <div className="settings-container">

            <h2>Settings</h2>

            <div className="settings-tabs">

                <button
                    className={tab === "profile" ? "active" : ""}
                    onClick={() => changeTab("profile")}
                >
                    Profile
                </button>

                <button
                    className={tab === "security" ? "active" : ""}
                    onClick={() => changeTab("security")}
                >
                    Security
                </button>

                <button
                    className={tab === "website" ? "active" : ""}
                    onClick={() => changeTab("website")}
                >
                    Website
                </button>

                <button
                    className={tab === "email" ? "active" : ""}
                    onClick={() => changeTab("email")}
                >
                    Email
                </button>

                <button
                    className={tab === "system" ? "active" : ""}
                    onClick={() => changeTab("system")}
                >
                    System
                </button>

            </div>

            <div className="settings-content">

                {tab === "profile" && (
                    <div className="settings-card profile-section">

                        <h3>Admin Profile</h3>

                        <div className="profile-avatar">

                            <div className="avatar-wrapper">

                                <img
                                    src={
                                        profile.profileImage
                                            ? typeof profile.profileImage === "string"
                                                ? profile.profileImage
                                                : URL.createObjectURL(profile.profileImage)
                                            : "https://ui-avatars.com/api/?name=" + profile.name
                                    }
                                    alt="profile"
                                    onClick={() => setShowPreview(true)}
                                    style={{ cursor: "pointer" }}
                                />

                                <label className="avatar-edit">
                                    ✏
                                    <input
                                        type="file"
                                        hidden
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                profileImage: e.target.files[0]
                                            })
                                        }
                                    />
                                </label>

                            </div>

                        </div>

                        <div className="profile-field">
                            <label>Name</label>
                            <input
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({ ...profile, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="profile-field">
                            <label>Email</label>
                            <input
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({ ...profile, email: e.target.value })
                                }
                            />
                        </div>

                        <button className="profile-save" onClick={updateProfile}>
                            Save Changes
                        </button>

                    </div>
                )}

                {tab === "security" && <ChangePassword />}

                {tab === "website" && (
                    <div className="settings-card">

                        <h3>Website Settings</h3>

                        <div className="settings-field">
                            <label>Site Title</label>
                            <input
                                value={website.siteTitle || ""}
                                onChange={(e) =>
                                    setWebsite({
                                        ...website,
                                        siteTitle: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="settings-field">
                            <label>Contact Email</label>
                            <input
                                value={website.contactEmail || ""}
                                onChange={(e) =>
                                    setWebsite({
                                        ...website,
                                        contactEmail: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="settings-field">
                            <label>Phone Number</label>
                            <input
                                value={website.phone || ""}
                                onChange={(e) =>
                                    setWebsite({
                                        ...website,
                                        phone: e.target.value
                                    })
                                }
                            />
                        </div>

                        <button onClick={updateWebsite}>
                            Save Website Settings
                        </button>

                    </div>
                )}

                {tab === "email" && (
                    <div className="settings-card">

                        <h3>Email Settings</h3>

                        <div className="settings-field">
                            <label>SMTP Email</label>
                            <input
                                value={emailSettings.smtpEmail || ""}
                                onChange={(e) =>
                                    setEmailSettings({
                                        ...emailSettings,
                                        smtpEmail: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="settings-field">
                            <label>SMTP Password</label>
                            <input
                                type="password"
                                autoComplete="off"
                                value={emailSettings.smtpPassword || ""}
                                onChange={(e) =>
                                    setEmailSettings({
                                        ...emailSettings,
                                        smtpPassword: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="settings-field">
                            <label>Sender Name</label>
                            <input
                                value={emailSettings.senderName || ""}
                                onChange={(e) =>
                                    setEmailSettings({
                                        ...emailSettings,
                                        senderName: e.target.value
                                    })
                                }
                            />
                        </div>

                        <button onClick={updateEmail}>
                            Save Email Settings
                        </button>

                    </div>
                )}

                {tab === "system" && (
                    <div className="settings-card">

                        <h3>System</h3>

                        <div className="system-buttons">

                            <button onClick={clearLogs}>
                                Clear Activity Logs
                            </button>

                        </div>

                    </div>
                )}

                {showPreview && (
                    <div
                        className="image-preview-overlay"
                        onClick={() => setShowPreview(false)}
                    >
                        <div
                            className="image-preview-box"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={
                                    profile.profileImage
                                        ? typeof profile.profileImage === "string"
                                            ? profile.profileImage
                                            : URL.createObjectURL(profile.profileImage)
                                        : "https://ui-avatars.com/api/?name=" + profile.name
                                }
                                alt="preview"
                            />

                            <button
                                className="preview-close"
                                onClick={() => setShowPreview(false)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </div>

    );

}