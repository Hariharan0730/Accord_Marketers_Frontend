import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../styles/activitylog.css";

export default function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [sort, setSort] = useState("latest");
    const [selectedLog, setSelectedLog] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        try {
            setLoading(true);

            const res = await API.get("/api/activity", {
                params: { page, sort, date: selectedDate }
            });

            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);

        } catch (err) {
            console.error("Activity fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, sort, selectedDate]);

    
    const openLogDetails = (log) => {
        setSelectedLog(log);
    };

    const closePopup = () => {
        setSelectedLog(null);
    };

    
    const clearLogs = async () => {
        if (!window.confirm("Are you sure you want to clear all activity logs?"))
            return;

        try {
            await API.delete("/api/activity/clear");

            setLogs([]);
            setTotalPages(1);
            setPage(1);

        } catch (err) {
            console.error("Clear logs error:", err);
        }
    };

    
    const deleteSingleLog = async (id) => {
        if (!window.confirm("Delete this log?")) return;

        try {
            await API.delete(`/api/activity/${id}`);

            setLogs((prev) => prev.filter((log) => log._id !== id));

        } catch (err) {
            console.error("Delete log error:", err);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const formattedTime = date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        return { formattedDate, formattedTime };
    };

    return (
        <div className="activity-container">

            <div className="activity-header">
                <h2>Activity Log</h2>

                <div className="activity-controls">
                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>

                    <div className="activity-filters">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setPage(1);
                            }}
                        />

                        {selectedDate && (
                            <button
                                className="clear-date-btn"
                                onClick={() => {
                                    setSelectedDate("");
                                    setPage(1);
                                }}
                            >
                                Clear Date
                            </button>
                        )}
                    </div>

                    <button className="clear-btn" onClick={clearLogs}>
                        Clear Logs
                    </button>
                </div>
            </div>

            <table className="activity-table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Content</th>
                        <th>Admin</th>
                        <th>Date</th>
                        <th>Manage</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="table-loading">
                                Loading...
                            </td>
                        </tr>
                    ) : logs.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="empty-state">
                                {selectedDate ? (
                                    <>
                                        <div className="empty-title">No logs found</div>
                                        <div className="empty-date">
                                            on{" "}
                                            {new Date(selectedDate).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    "No activity found"
                                )}
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => {
                            const { formattedDate, formattedTime } =
                                formatDateTime(log.createdAt);

                            return (
                                <tr key={log._id}>
                                    <td className="action">{log.action}</td>

                                    <td>
                                        <span className={`content-type ${log.contentType}`}>
                                            {log.contentType}
                                        </span>
                                        {" - "}
                                        {log.contentTitle}
                                    </td>

                                    <td>
                                        {log.admin?.email || log.adminEmail || "System"}
                                    </td>

                                    <td>
                                        <div className="date-time">
                                            <span className="date">{formattedDate}</span>
                                            <span className="time">{formattedTime}</span>
                                        </div>
                                    </td>

                                    <td className="manage-buttons">

                                        <button
                                            className="view-btn"
                                            onClick={() => openLogDetails(log)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="delete-log-btn"
                                            onClick={() => deleteSingleLog(log._id)}
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages || loading}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            

            {selectedLog && (
                <div className="activity-modal">
                    <div className="activity-modal-content">

                        <h3>{selectedLog.action}</h3>

                        <p><strong>Content :</strong> {selectedLog.contentType}</p>
                        <p><strong>Title :</strong> {selectedLog.contentTitle}</p>

                        
                        {selectedLog.changes && selectedLog.changes.length > 0 && (
                            <>
                                <h4>Changes</h4>

                                <table className="changes-table">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Old Value</th>
                                            <th>New Value</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedLog.changes.map((c, i) => (
                                            <tr key={i}>
                                                <td>{c.field}</td>
                                                <td>{String(c.oldValue)}</td>
                                                <td>{String(c.newValue)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}

                        
                        {selectedLog.metadata && (
                            <>
                                <h4>Details</h4>

                                <ul className="metadata-list">
                                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}</strong>: {Array.isArray(value) ? value.join(", ") : String(value)}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <p>
                            <strong>Admin:</strong> {selectedLog.admin?.email || selectedLog.adminEmail}
                        </p>

                        <button className="close-btn" onClick={closePopup}>
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}