import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5001/api/v1/auth/register", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "400px", maxWidth: "90vw", border: "1px solid #eee" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "0.5rem" }}>Create account 🌱</h2>
        <p style={{ color: "#888", marginBottom: "1.5rem", fontSize: "14px" }}>Start building better habits today</p>
        {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "14px" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Username</label>
          <input type="text" placeholder="yourname" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "1rem" }}
          />
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "1rem" }}
          />
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Password</label>
          <input type="password" placeholder="••••••" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "1.5rem" }}
          />
          <button type="submit"
            style={{ width: "100%", padding: "11px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500" }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "14px", color: "#666" }}>
          Already have an account? <Link to="/login" style={{ color: "#534AB7" }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;