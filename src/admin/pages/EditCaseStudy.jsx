import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import "../styles/caseform.css";

export default function EditCaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [metric, setMetric] = useState({ label: "", value: "" });

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const { data } = await API.get(`/api/case-studies/admin/${id}`);

        setFormData({
          ...data,
          publishDate: data.publishDate
            ? new Date(data.publishDate).toISOString().slice(0, 16)
            : "",
          coverImage: null 
        });

      } catch (error) {
        console.error("Error fetching case study", error);
      }
    };

    fetchCase();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0]
      }));
      return;
    }


    if (name === "status" && value === "published") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        publishDate: ""
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const addMetric = () => {
    if (!metric.label || !metric.value) return;

    setFormData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), metric]
    }));

    setMetric({ label: "", value: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "metrics") {
          data.append("metrics", JSON.stringify(formData.metrics));
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await API.put(`/api/case-studies/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/admin/case-studies");

    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (!formData) return <h2>Loading...</h2>;

  return (
    <div className="case-form-container">
      <h2>Edit Case Study</h2>

      <form onSubmit={handleSubmit} className="case-form">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />

        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="coverImage"
          onChange={handleChange}
        />

        <input
          name="industry"
          value={formData.industry || ""}
          onChange={handleChange}
        />

        <textarea
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          required
        />

        <textarea
          name="strategy"
          value={formData.strategy}
          onChange={handleChange}
          required
        />

        <textarea
          name="result"
          value={formData.result}
          onChange={handleChange}
          required
        />

        
        <div className="metric-section">
          <h4>Metrics</h4>

          {formData.metrics?.map((m, index) => (
            <p key={index}>{m.label} - {m.value}</p>
          ))}

          <input
            placeholder="Metric Label"
            value={metric.label}
            onChange={(e) =>
              setMetric({ ...metric, label: e.target.value })
            }
          />

          <input
            placeholder="Metric Value"
            value={metric.value}
            onChange={(e) =>
              setMetric({ ...metric, value: e.target.value })
            }
          />

          <button type="button" onClick={addMetric}>
            Add Metric
          </button>
        </div>

        
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        
        {formData.status === "draft" && (
          <input
            type="datetime-local"
            name="publishDate"
            value={formData.publishDate || ""}
            onChange={handleChange}
          />
        )}

        <label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          Featured
        </label>

        <button type="submit" className="btn-primary">
          Update Case Study
        </button>

      </form>
    </div>
  );
}