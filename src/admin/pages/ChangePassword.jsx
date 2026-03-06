import { useState } from "react";
import API from "../../api/axios";
import "../styles/changepassword.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/api/admin/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message);
    }
  };

  return (
    <div className="change-card">
      <h2>Change Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Current Password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
        />
        <input type="password" placeholder="New Password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}