import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/admin/reset-password", {
        token,
        newPassword
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2>Reset Password</h2>

        {message && (
          <div className="admin-login-error">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}