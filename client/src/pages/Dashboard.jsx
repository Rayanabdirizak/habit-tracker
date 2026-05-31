import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAppContext();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const fetchHabits = async () => {
    try {
      const { data } = await axios.get("https://job-tracker2.onrender.com/api/v1/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(data.habits);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id) => {
    try {
      const { data } = await axios.patch(
        `https://job-tracker2.onrender.com/api/v1/habits/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits(habits.map((h) => (h._id === id ? data.habit : h)));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await axios.delete(`https://job-tracker2.onrender.com/api/v1/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(habits.filter((h) => h._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getStreak = (completedDates) => {
    let streak = 0;
    const date = new Date();
    while (true) {
      const dateStr = date.toISOString().split("T")[0];
      if (completedDates.includes(dateStr)) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  useEffect(() => { fetchHabits(); }, []);

  const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>🌱 Habit Tracker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#e8e4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: "14px", color: "#666" }}>{user?.username}</span>
          <button onClick={() => navigate("/add-habit")}
            style={{ padding: "8px 16px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            + Add Habit
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ padding: "8px 16px", background: "#fff0f0", color: "#c0392b", border: "1px solid #fcc", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: "10px", padding: "1rem", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#534AB7" }}>{habits.length}</div>
          <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Total Habits</div>
        </div>
        <div style={{ background: "#fff", borderRadius: "10px", padding: "1rem", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#2ecc71" }}>{completedToday}</div>
          <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Done Today</div>
        </div>
        <div style={{ background: "#fff", borderRadius: "10px", padding: "1rem", textAlign: "center", border: "1px solid #eee" }}>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#f39c12" }}>{habits.length - completedToday}</div>
          <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Remaining</div>
        </div>
      </div>

      {/* Habits List */}
      {loading && <p style={{ color: "#888" }}>Loading habits...</p>}
      {!loading && habits.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
          <p style={{ fontSize: "48px" }}>🌱</p>
          <p style={{ fontSize: "16px", marginTop: "1rem" }}>No habits yet. Add your first one!</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          const streak = getStreak(habit.completedDates);
          return (
            <div key={habit._id} style={{ background: "#fff", border: `1px solid ${isCompleted ? habit.color : "#eee"}`, borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button onClick={() => toggleHabit(habit._id)}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", border: `2px solid ${habit.color}`, background: isCompleted ? habit.color : "transparent", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {isCompleted ? "✓" : ""}
                </button>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "600", color: isCompleted ? "#888" : "#333", textDecoration: isCompleted ? "line-through" : "none" }}>
                    {habit.name}
                  </h3>
                  {habit.description && <p style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{habit.description}</p>}
                  {streak > 0 && <p style={{ fontSize: "12px", color: "#f39c12", marginTop: "2px" }}>🔥 {streak} day streak</p>}
                </div>
              </div>
              <button onClick={() => deleteHabit(habit._id)}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #fcc", background: "#fff0f0", color: "#c0392b", cursor: "pointer", fontSize: "13px" }}>
                🗑 Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;