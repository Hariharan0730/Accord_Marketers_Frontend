import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../styles/caseform.css";

export default function CreateCaseStudy() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        coverImage: null,
        industry: "",
        problem: "",
        strategy: "",
        result: "",
        status: "draft",
        publishDate: "",   
        isFeatured: false,
        metrics: []
    });
    const [metric, setMetric] = useState({ label: "", value: "" });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    const addMetric = () => {
        if (!metric.label || !metric.value) return;

        setFormData({
            ...formData,
            metrics: [...formData.metrics, metric]
        });

        setMetric({ label: "", value: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "metrics") {
                    data.append("metrics", JSON.stringify(formData.metrics));
                } else {
                    data.append(key, formData[key]);
                }
            });

            await API.post("/api/case-studies", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("/admin/case-studies");

        } catch (error) {
            console.error("Create failed", error);
        }
    };

    return (
        <div className="case-form-container">
            <h2>Create Case Study</h2>

            <form onSubmit={handleSubmit} className="case-form">

                <input
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    required
                />

                <input
                    name="slug"
                    placeholder="Slug"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="excerpt"
                    placeholder="Excerpt"
                    onChange={handleChange}
                    required
                />

                <input
                    type="file"
                    name="coverImage"
                    onChange={handleChange}
                    required
                />

                <input
                    name="industry"
                    placeholder="Industry"
                    onChange={handleChange}
                />

                <textarea
                    name="problem"
                    placeholder="Problem"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="strategy"
                    placeholder="Strategy"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="result"
                    placeholder="Result"
                    onChange={handleChange}
                    required
                />

                <div className="metric-section">
                    <h4>Add Metrics</h4>

                    <input
                        className="metric-input"
                        placeholder="Metric Label"
                        value={metric.label}
                        onChange={(e) =>
                            setMetric({ ...metric, label: e.target.value })
                        }
                    />

                    <input
                        className="metric-input"
                        placeholder="Metric Value"
                        value={metric.value}
                        onChange={(e) =>
                            setMetric({ ...metric, value: e.target.value })
                        }
                    />

                    <button type="button" onClick={addMetric}>
                        Add Metric
                    </button>

                    {formData.metrics.map((m, index) => (
                        <p key={index}>{m.label} - {m.value}</p>
                    ))}
                </div>

                <select name="status" onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <input
                    type="datetime-local"
                    name="publishDate"
                    onChange={handleChange}
                />

                <label>
                    <input
                        type="checkbox"
                        name="isFeatured"
                        onChange={handleChange}
                    />
                    Featured
                </label>

                <button type="submit" className="btn-primary">
                    Create Case Study
                </button>

            </form>
        </div>
    );
}