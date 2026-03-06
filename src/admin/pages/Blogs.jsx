import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "../styles/blogs.css";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {

        setLoading(true);

        try {

            const res = await API.get("/api/blogs", {
                params: {
                    page,
                    search,
                    status
                }
            });

            setBlogs(res.data.blogs);
            setTotalPages(res.data.totalPages);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };


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


    useEffect(() => {
        fetchBlogs();
    }, [page, search, status]);


    const toggleFeatured = async (id) => {

        try {

            await API.put(`/api/blogs/${id}/featured`);

            setBlogs((prev) =>
                prev.map((blog) =>
                    blog._id === id
                        ? { ...blog, isFeatured: !blog.isFeatured }
                        : blog
                )
            );

        } catch (err) {
            console.log(err);
        }

    };


    const deleteBlog = async (id) => {

        if (!window.confirm("Delete this blog?")) return;

        try {

            await API.delete(`/api/blogs/${id}`);

            fetchBlogs();

        } catch (err) {

            if (err.response?.status === 404) {
                setBlogs(prev => prev.filter(blog => blog._id !== id));
            }

            console.log(err);
        }

    };


    return (
        <div className="blog-page">

            <div className="blog-header">
                <h2>Manage Blogs</h2>
            </div>

            
            <div className="blog-filters">

                <input
                    type="text"
                    placeholder="Search title..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>

                <Link to="/admin/blogs/create" className="create-btn">
                    + Create Blog
                </Link>

            </div>


            {loading ? (

                <p>Loading...</p>

            ) : (

                <>
                    <table className="blog-table">

                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Views</th>
                                <th>Featured</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {blogs.map((blog) => (

                                <tr key={blog._id}>

                                    <td>{blog.title}</td>

                                    <td>
                                        <span className={`status ${blog.status}`}>
                                            {blog.status}
                                        </span>
                                    </td>

                                    <td>{blog.category}</td>

                                    <td>{blog.views}</td>

                                    <td>
                                        <button
                                            className={blog.isFeatured ? "featured on" : "featured"}
                                            onClick={() => toggleFeatured(blog._id)}
                                        >
                                            {blog.isFeatured ? "Yes" : "No"}
                                        </button>
                                    </td>

                                    <td>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <div className="blog-actions">

                                            <Link
                                                to={`/admin/blogs/edit/${blog._id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteBlog(blog._id)}
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>


                    <div className="pagination">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>

                </>
            )}

        </div>
    );
}