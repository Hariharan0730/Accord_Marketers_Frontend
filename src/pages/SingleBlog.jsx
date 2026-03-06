import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/s-blog.css";
import API from "../api/axios";

export default function SingleBlog() {

  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasTrackedView = useRef(false);

  useEffect(() => {

    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    const fetchBlog = async () => {
      try {

        const { data } = await API.get(`/api/blogs/${slug}`);
        setBlog(data);

        const viewed = localStorage.getItem(`viewed-${slug}`);

        if (!viewed) {
          await API.post(`/api/blogs/${slug}/view`);
          localStorage.setItem(`viewed-${slug}`, "true");
        }

      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }

  }, [slug]);
  const formatDate = (dateString) => {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  };

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  if (!blog)
    return <h2 style={{ textAlign: "center" }}>Blog not found</h2>;

  return (
    <div className="single-blog">

      <div className="blog-hero">

        <img src={blog.featuredImage} alt={blog.title} />

        <div className="overlay">
          <h1>{blog.title}</h1>

          <div className="blog-author">

            <img
              src={
                blog.author?.profileImage ||
                "https://ui-avatars.com/api/?name=" + blog.author?.name
              }
            />

            <span>
              {blog.author?.name} • {formatDate(blog.createdAt)} • {blog.readTime} min read • {blog.views} views
            </span>

          </div>
        </div>

      </div>

      <div className="blog-content">
        <div className="blog-paper">
          <div
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="blog-divider"></div>

          <div className="tags">
            {blog.tags?.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        </div>

        <Link to="/blog" className="back-btn">
          ← Back to Blogs
        </Link>

      </div>

    </div>
  );
}