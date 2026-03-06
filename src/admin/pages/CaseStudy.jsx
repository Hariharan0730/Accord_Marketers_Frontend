import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "../styles/casestudy.css";

export default function CaseStudies() {

    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCases = async () => {

        setLoading(true);

        try {

            const { data } = await API.get("/api/case-studies", {
                params: { page }
            });

            setCases(data.caseStudies);
            setTotalPages(data.totalPages);

        } catch (error) {

            console.error("Error fetching case studies", error);

        } finally {

            setLoading(false);

        }
    };


    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this case study?"))
            return;

        try {

            await API.delete(`/api/case-studies/${id}`);

            fetchCases();

        } catch (error) {

            console.error("Delete failed", error);

        }
    };


    useEffect(() => {
        fetchCases();
    }, [page]);


    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="case-page">

            <div className="page-header">
                <h2>Case Studies</h2>

                <Link to="/admin/case-studies/create" className="btn-primary">
                    + Create Case Study
                </Link>
            </div>

            <table className="admin-table">

                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {cases.map((item) => (

                        <tr key={item._id}>

                            <td>{item.title}</td>

                            <td>
                                <span
                                    className={`status-badge ${item.status === "published"
                                            ? "status-published"
                                            : "status-draft"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </td>

                            <td>
                                <span className={item.isFeatured ? "featured-badge" : "not-featured"}>
                                    {item.isFeatured ? "Yes" : "No"}
                                </span>
                            </td>

                            <td>
                                <div className="case-study-action">

                                    <Link
                                        to={`/admin/case-studies/edit/${item._id}`}
                                        className="action-link"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="delete-btn"
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

        </div>
    );
}