import { useState } from "react";
import API from "../api/axios";
import "../styles/contact.css";

export default function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await API.post("/api/contact", form);

      setSuccess("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {

      setError("Failed to send message");

    }

    setLoading(false);
  };

  return (
    <section className="contact">

      <div className="container">

        <h1 className="contact-title">Contact Us</h1>

        <p className="contact-desc">
          Get in touch with Accord Marketers to discuss how AI-powered digital
          marketing can help grow your business.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          ></textarea>

          <button type="submit">

            {loading ? "Sending..." : "Send Message"}

          </button>

          {success && <p className="contact-success">{success}</p>}
          {error && <p className="contact-error">{error}</p>}

        </form>

      </div>

    </section>
  );
}