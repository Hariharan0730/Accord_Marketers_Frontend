import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/blog.css";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);
export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(
          `/api/blogs?page=${page}&category=${category}&status=published`
        );

        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("No Blogs available yet.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, category]);
  useEffect(() => {

    socket.on("blogViewUpdated", (data) => {

      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === data.blogId
            ? { ...blog, views: data.views }
            : blog
        )
      );

    });

    return () => socket.off("blogViewUpdated");

  }, []);
  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading blogs...</h2>;

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>{error}</h2>
      </div>
    );

  if (blogs.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>No blogs available yet.</h2>
      </div>
    );

  return (
    <div className="blog-page-p container">
      <h1>Our Blog</h1>

      
      <div className="blog-filter-b">
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
        >
          <option value="">All Categories</option>
          <option value="SEO">SEO</option>
          <option value="AI">AI</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      <div className="blog-grid">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog._id}>
            <img src={blog.featuredImage} alt={blog.title} />

            <h3>{blog.title}</h3>

            <p className="blog-meta">
              {blog.category} • {blog.readTime} min read • {blog.views} views
            </p>

            <p>{blog.excerpt}</p>
            <Link to={`/blog/${blog.slug}`} className="read-more">
              Read More →
            </Link>
          </div>
        ))}
      </div>

      
      <div className="pagination-blog">

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
    </div>
  );
}