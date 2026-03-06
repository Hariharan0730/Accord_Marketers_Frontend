import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/case.css";

export default function CaseStudies() {

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    const fetchCaseStudies = async () => {
      try {

        setLoading(true);

        const { data } = await API.get(
          `/api/case-studies?page=${page}&limit=6`
        );

        setCases(data.caseStudies);
        setTotalPages(data.totalPages);
        setError(null);

      } catch (err) {
        console.error("Error fetching case studies:", err);
        setError("No Case Studies available yet.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();

  }, [page]);


  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading case studies...</h2>;

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>{error}</h2>
      </div>
    );

  if (cases.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>No case studies available yet.</h2>
      </div>
    );


  return (
    <div className="case-page container">

      <h1>Our Case Studies</h1>

      <div className="case-grid">

        {cases.map((item) => (
          <div className="case-card" key={item._id}>

            <img src={item.coverImage} alt={item.title} />

            <h3>{item.title}</h3>

            <p className="case-meta">
              {item.industry}
            </p>

            <p>{item.excerpt}</p>

            <Link to={`/case-studies/${item.slug}`} className="read-more-c">
              View Case Study →
            </Link>

          </div>
        ))}

      </div>


      

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

    </div>
  );
}