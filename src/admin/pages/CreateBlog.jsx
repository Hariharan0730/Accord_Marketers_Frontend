import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../styles/createblog.css";

export default function CreateBlog() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    publishDate: "",
    isFeatured: false,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: ""
    }
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("seo.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, [key]: value }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };
  const formatContent = (text) => {
    return text
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h2>${line.replace("# ", "")}</h2>`;
        }
        if (line.startsWith("- ")) {
          return `<li>${line.replace("- ", "")}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "seo") {
          data.append("seo", JSON.stringify(formData.seo));
        } else if (key === "content") {
          data.append("content", formatContent(formData.content));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (image) data.append("image", image);

      await API.post("/api/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate("/admin/blogs");
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="excerpt"
          placeholder="Short Excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Blog Content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <label>
          Featured:
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Publish Immediately</option>
        </select>

        <input
          type="datetime-local"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <h3>SEO Settings</h3>

        <input
          type="text"
          name="seo.metaTitle"
          placeholder="Meta Title"
          onChange={handleChange}
        />

        <textarea
          name="seo.metaDescription"
          placeholder="Meta Description"
          onChange={handleChange}
        />

        <input
          type="text"
          name="seo.keywords"
          placeholder="Keywords (comma separated)"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}