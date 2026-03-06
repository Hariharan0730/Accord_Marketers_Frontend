import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import ReactQuill from "react-quill-new";
import RichEditor from "../components/RichEditor";
import "react-quill/dist/quill.snow.css";
import "../styles/editblog.css";

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await API.get(`/api/blogs/admin/${id}`);
                const blog = res.data;

                setFormData({
                    title: blog.title || "",
                    excerpt: blog.excerpt || "",
                    content: blog.content || "",
                    category: blog.category || "",
                    tags: blog.tags ? blog.tags.join(", ") : "",
                    status: blog.status || "draft",
                    publishDate: blog.publishDate
                        ? new Date(blog.publishDate).toISOString().slice(0, 16)
                        : "",
                    isFeatured: blog.isFeatured || false,
                    seo: {
                        metaTitle: blog.seo?.metaTitle || "",
                        metaDescription: blog.seo?.metaDescription || "",
                        keywords: blog.seo?.keywords
                            ? blog.seo.keywords.join(", ")
                            : ""
                    }
                });
            } catch (err) {
                console.error("Fetch blog error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "seo") {
                    data.append("seo", JSON.stringify(formData.seo));
                } else if (key === "publishDate" && !formData.publishDate) {

                } else {
                    data.append(key, formData[key]);
                }
            });

            if (image) {
                data.append("image", image);
            }

            await API.put(`/api/blogs/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            navigate("/admin/blogs");
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading blog...</p>;
    if (!formData) return <p>Blog not found</p>;

    return (
        <div className="edit-blog-container">
            <h2>Edit Blog</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                />

                <RichEditor
                    value={formData.content}
                    onChange={(val) =>
                        setFormData((prev) => ({ ...prev, content: val }))
                    }
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="tags"
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
                    <option value="published">Publish</option>
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
                    value={formData.seo.metaTitle}
                    onChange={handleChange}
                />

                <textarea
                    name="seo.metaDescription"
                    value={formData.seo.metaDescription}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="seo.keywords"
                    value={formData.seo.keywords}
                    onChange={handleChange}
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Updating..." : "Update Blog"}
                </button>
            </form>
        </div>
    );
}