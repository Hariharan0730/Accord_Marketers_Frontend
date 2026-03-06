import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/login.css";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await API.post("/api/admin/login", {
                email,
                password,
            });


            localStorage.setItem("token", res.data.token);


            navigate("/admin/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <h2>Admin Login</h2>

                {error && (
                    <div className="admin-login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p
                        style={{
                            fontSize: "14px",
                            textAlign:"right",
                            marginBottom: "10px",
                            cursor: "pointer",
                            color: "#3b82f6"
                        }}
                        onClick={() => navigate("/admin/forgot-password")}
                    >
                        Forgot Password?
                    </p>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}