import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const colors = ["#534AB7", "#e74c3c", "#2ecc71", "#f39c12", "#1abc9c", "#e91e63", "#3498db"];

const AddHabit = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#534AB7",
  });
  const [error, setError] = useState("");
  const { token } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://job-tracker2.onrender.com/api/v1/habits", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add habit");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", width: "440px", maxWidth: "90vw", border: "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>←</button>
          <h2 style={{ fontSize: "18px", fontWeight: "600" }}>Add New Habit</h2>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem", fontSize: "14px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Habit Name</label>
          <input type="text" placeholder="e.g. Exercise, Read, Meditate" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "1rem" }}
            required />

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "4px", display: "block" }}>Description (optional)</label>
          <input type="text" placeholder="e.g. 30 minutes of exercise" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ display: "block", width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", marginBottom: "1rem" }} />

          <label style={{ fontSize: "13px", color: "#666", marginBottom: "8px", display: "block" }}>Color</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
            {colors.map((color) => (
              <div key={color} onClick={() => setForm({ ...form, color })}
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: color, cursor: "pointer",
                  border: form.color === color ? "3px solid #333" : "3px solid transparent" }} />
            ))}
          </div>

          <button type="submit"
            style={{ width: "100%", padding: "11px", background: form.color, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "500" }}>
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;