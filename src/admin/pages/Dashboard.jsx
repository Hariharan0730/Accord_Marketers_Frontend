import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "../styles/dashboard.css";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [scheduledDrafts, setScheduledDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [caseStats, setCaseStats] = useState(null);
    const [showScheduledModal, setShowScheduledModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [newPublishDate, setNewPublishDate] = useState("");
    const [scheduledCaseDrafts, setScheduledCaseDrafts] = useState([]);
    const [showCaseModal, setShowCaseModal] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const [newCasePublishDate, setNewCasePublishDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const statsRes = await API.get("/api/blogs/stats");
            const activityRes = await API.get("/api/activity", { params: { page: 1 } });
            const weeklyRes = await API.get("/api/blogs/weekly-views");
            const scheduledRes = await API.get("/api/blogs/scheduled");
            const caseStatsRes = await API.get("/api/case-studies/stats");
            const scheduledCaseRes = await API.get("/api/case-studies/scheduled");


            setScheduledCaseDrafts(scheduledCaseRes.data);
            setCaseStats(caseStatsRes.data);
            setStats(statsRes.data);
            setRecentLogs(activityRes.data.logs.slice(0, 5));
            setChartData(weeklyRes.data);
            setScheduledDrafts(scheduledRes.data);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getRemainingTime = (publishDate) => {
        const diff = new Date(publishDate) - currentTime;
        if (diff <= 0) return "Publishing...";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            formattedDate: date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            formattedTime: date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }),
        };
    };

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div className="dashboard-container">

            
            <div className="stats-grid">
                <div className="stat-card clickable"
                    onClick={() => navigate("/admin/blogs")}>
                    <h4>Total Blogs</h4>
                    <p>{stats?.totalBlogs || 0}</p>
                </div>
                <div
                    className="stat-card clickable"
                    onClick={() => navigate("/admin/case-studies")}
                >
                    <h4>Total Case Studies</h4>
                    <p>{caseStats?.totalCaseStudies || 0}</p>
                </div>

                <div className="stat-card clickable"
                    onClick={() => navigate("/admin/blogs?status=draft")}>
                    <h4>Draft Blogs</h4>
                    <p>{stats?.draftCount || 0}</p>
                </div>
                <div
                    className="stat-card clickable"
                    onClick={() => navigate("/admin/case-studies?status=draft")}
                >
                    <h4>Draft Case Studies</h4>
                    <p>{caseStats?.draftCaseStudies || 0}</p>
                </div>

                <div className="stat-card clickable"
                    onClick={() => navigate("/admin/blogs?featured=true")}>
                    <h4>Featured Blogs</h4>
                    <p>{stats?.featuredCount || 0}</p>
                </div>

                <div
                    className="stat-card clickable"
                    onClick={() => navigate("/admin/case-studies?featured=true")}
                >
                    <h4>Featured Case Studies</h4>
                    <p>{caseStats?.featuredCaseStudies || 0}</p>
                </div>
            </div>

            
            <div className="chart-card">
                <h3>Views (Last 7 Days)</h3>
                {chartData.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No data available</p>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Line type="monotone" dataKey="views" stroke="#3bf6b8" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            

            <div className="info-grid">
                <div className="info-card">
                    <h3>Top Performing</h3>
                    <p>Feature Coming Next 🔥</p>
                </div>

                <div className="info-card">
                    <h3>Draft Summary</h3>
                    <p>{stats?.draftCount || 0} blogs waiting to publish</p>
                </div>
                {scheduledCaseDrafts.length > 0 && (
                    <div
                        className="info-card clickable"
                        onClick={() => setShowCaseModal(true)}
                    >
                        <h3>Scheduled Case Studies</h3>
                        <p>{scheduledCaseDrafts.length} case studies scheduled</p>
                    </div>
                )}
                
                {scheduledDrafts.length > 0 && (
                    <div
                        className="info-card clickable"
                        onClick={() => setShowScheduledModal(true)}
                    >
                        <h3>Scheduled Drafts</h3>
                        <p>{scheduledDrafts.length} blogs scheduled</p>
                    </div>
                )}
            </div>
            <div className="activity-preview">
                <h3>Recent Activity</h3>

                {recentLogs.length === 0 ? (
                    <p>No recent activity</p>
                ) : (
                    recentLogs.map((log) => {
                        const { formattedDate, formattedTime } =
                            formatDate(log.createdAt);

                        return (
                            <div key={log._id} className="activity-item">
                                <span>{log.action}</span>
                                <small>
                                    {formattedDate} • {formattedTime}
                                </small>
                            </div>
                        );
                    })
                )}

                <div className="view-more-wrapper">
                    <button
                        className="view-more-btn"
                        onClick={() => navigate("/admin/activity")}
                    >
                        View More →
                    </button>
                </div>
            </div>

            
            {showScheduledModal && (
                <div className="modal-overlay">
                    <div className="modal-box large-modal">

                        <div className="modal-header">
                            <h3>Scheduled Drafts</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowScheduledModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="scheduled-scroll">
                            {scheduledDrafts.map((blog) => (
                                <div key={blog._id} className="scheduled-item">
                                    <div>
                                        <strong>{blog.title}</strong>
                                        <p>
                                            Publishing in: {getRemainingTime(blog.publishDate)}
                                        </p>
                                    </div>

                                    <button
                                        className="edit-schedule-btn"
                                        onClick={() => {
                                            setSelectedBlog(blog);

                                            setNewPublishDate(
                                                new Date(blog.publishDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showCaseModal && (
                <div className="modal-overlay">
                    <div className="modal-box large-modal">

                        <div className="modal-header">
                            <h3>Scheduled Case Studies</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowCaseModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="scheduled-scroll">
                            {scheduledCaseDrafts.map((item) => (
                                <div key={item._id} className="scheduled-item">
                                    <div>
                                        <strong>{item.title}</strong>
                                        <p>
                                            Publishing in: {getRemainingTime(item.publishDate)}
                                        </p>
                                    </div>

                                    <button
                                        className="edit-schedule-btn"
                                        onClick={() => {
                                            setSelectedCase(item);

                                            setNewCasePublishDate(
                                                new Date(item.publishDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
            {selectedCase && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edit Case Study Schedule</h3>

                        <input
                            type="datetime-local"
                            value={newCasePublishDate}
                            onChange={(e) => setNewCasePublishDate(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                className="save-btn"
                                onClick={async () => {
                                    try {
                                        const isoDate = new Date(newCasePublishDate).toISOString();

                                        await API.put(
                                            `/api/case-studies/${selectedCase._id}/schedule`,
                                            { publishDate: isoDate }
                                        );

                                        await fetchDashboard();

                                        setSelectedCase(null);
                                        setShowCaseModal(false);

                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                Save
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setSelectedCase(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
            {selectedBlog && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edit Schedule</h3>

                        <input
                            type="datetime-local"
                            value={newPublishDate}
                            onChange={(e) => setNewPublishDate(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button
                                className="save-btn"
                                onClick={async () => {
                                    try {
                                        if (!newPublishDate) {
                                            alert("Please select a date");
                                            return;
                                        }

                                        const isoDate = new Date(newPublishDate).toISOString();

                                        const response = await API.put(
                                            `/api/blogs/${selectedBlog._id}/schedule`,
                                            { publishDate: isoDate }
                                        );

                                        if (response.status === 200) {

                                            await fetchDashboard();

                                            setSelectedBlog(null);
                                            setShowScheduledModal(false);
                                        }
                                    } catch (err) {
                                        console.error("Update failed:", err.response?.data || err);
                                    }
                                }}
                            >
                                Save
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setSelectedBlog(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}