import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../styles/contacts.css";

export default function Contacts() {

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchContacts = async () => {
        try {

            setLoading(true);

            const res = await API.get("/api/contact/admin", {
                params: { page }
            });

            setContacts(res.data.contacts);
            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.error("Contact fetch error:", err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [page]);


    const updateStatus = async (id, status) => {

        try {

            await API.put(`/api/contact/admin/${id}`, { status });

            setContacts((prev) =>
                prev.map((c) =>
                    c._id === id ? { ...c, status } : c
                )
            );

        } catch (err) {
            console.error("Status update error:", err);
        }
    };


    const deleteContact = async (id) => {

        if (!window.confirm("Delete this lead?")) return;

        try {

            await API.delete(`/api/contact/admin/${id}`);

            setContacts((prev) =>
                prev.filter((c) => c._id !== id)
            );

        } catch (err) {
            console.error("Delete error:", err);
        }
    };


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };


    return (

        <div className="contacts-container">

            <div className="contacts-header">
                <h2>Contact Leads</h2>
            </div>

            <table className="contacts-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {loading ? (
                        <tr>
                            <td colSpan="6">Loading...</td>
                        </tr>
                    ) : contacts.length === 0 ? (
                        <tr>
                            <td colSpan="6">No leads found</td>
                        </tr>
                    ) : (

                        contacts.map((contact) => (

                            <tr key={contact._id}>

                                <td>{contact.name}</td>

                                <td>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="email-link"
                                    >
                                        {contact.email}
                                    </a>
                                </td>

                                <td className="message-cell">
                                    {contact.message?.length > 40
                                        ? contact.message.slice(0, 40) + "..."
                                        : contact.message}
                                </td>

                                <td>

                                    <select
                                        value={contact.status}
                                        onChange={(e) =>
                                            updateStatus(contact._id, e.target.value)
                                        }
                                        className={`status ${contact.status}`}
                                    >

                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="closed">Closed</option>

                                    </select>

                                </td>

                                <td>{formatDate(contact.createdAt)}</td>

                                <td className="actions">

                                    <button
                                        className="view-btn"
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        View
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteContact(contact._id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

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

            {selectedContact && (

                <div
                    className="contact-modal"
                    onClick={() => setSelectedContact(null)}
                >

                    <div
                        className="contact-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="lead-header">

                            <div className="lead-avatar">
                                {selectedContact.name?.charAt(0).toUpperCase()}
                            </div>

                            <div className="lead-info">
                                <h3>{selectedContact.name}</h3>
                                <p className="lead-email">{selectedContact.email}</p>
                            </div>

                        </div>


                        <div className="lead-message">

                            <h4>Message</h4>

                            <p>
                                {selectedContact.message}
                            </p>

                        </div>


                        <div className="lead-meta">

                            <div>
                                <span>Status</span>
                                <strong className={`status-badge ${selectedContact.status}`}>
                                    {selectedContact.status}
                                </strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>{formatDate(selectedContact.createdAt)}</strong>
                            </div>

                            <div>
                                <span>IP Address</span>
                                <strong>{selectedContact.ipAddress || "Unknown"}</strong>
                            </div>

                        </div>


                        <div className="lead-actions">

                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedContact.email}&su=Regarding your message to Accord Marketers&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for reaching out to Accord Marketers.%0D%0A%0D%0AWe would be happy to assist you. Could you please provide a few more details about your requirement so that we can help you better?%0D%0A%0D%0ALooking forward to your response.%0D%0A%0D%0ARegards,%0D%0AAccord Marketers`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="reply-btn"
                            >
                                Reply via Email
                            </a>

                            <button
                                className="close-btn-lead"
                                onClick={() => setSelectedContact(null)}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
}