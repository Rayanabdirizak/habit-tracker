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

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en", { weekday: "short" }),
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

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

  const getProgress = (completedDates) => {
    const completed = last7Days.filter((d) => completedDates.includes(d.date)).length;
    return Math.round((completed / 7) * 100);
  };

  useEffect(() => { fetchHabits(); }, []);

  const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;
  const remaining = habits.length - completedToday;
  const allDone = habits.length > 0 && remaining === 0;

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a" }}>🌱 Habit Tracker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#534AB7" }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: "14px", color: "#666" }}>{user?.username}</span>
          <button onClick={() => navigate("/add-habit")}
            style={{ padding: "8px 16px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
            + Add Habit
          </button>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ padding: "8px 14px", background: "#fff0f0", color: "#c0392b", border: "1px solid #fcc", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Reminder Banner */}
      {!loading && habits.length > 0 && (
        <div style={{ background: allDone ? "#d1fae5" : "#fffbeb", border: `1px solid ${allDone ? "#6ee7b7" : "#fcd34d"}`, borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", color: allDone ? "#065f46" : "#92400e" }}>
          {allDone
            ? "🎉 Amazing! You completed all your habits today! Keep it up!"
            : `⏰ You have ${remaining} habit${remaining > 1 ? "s" : ""} remaining today. Keep going!`}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { value: habits.length, label: "Total Habits", color: "#534AB7" },
          { value: completedToday, label: "Done Today", color: "#10b981" },
          { value: remaining, label: "Remaining", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: "12px", padding: "1rem", textAlign: "center", border: "1px solid #eee", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: "30px", fontWeight: "700", color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Calendar */}
      {!loading && habits.length > 0 && (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", border: "1px solid #eee" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "10px" }}>This Week</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
            {last7Days.map((day) => {
              const count = habits.filter((h) => h.completedDates.includes(day.date)).length;
              const isToday = day.date === today;
              return (
                <div key={day.date} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{day.label}</div>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600",
                    background: count === habits.length && count > 0 ? "#534AB7" : count > 0 ? "#ede9fe" : "#f5f5f5",
                    color: count === habits.length && count > 0 ? "#fff" : count > 0 ? "#534AB7" : "#ccc",
                    border: isToday ? "2px solid #534AB7" : "2px solid transparent" }}>
                    {count > 0 ? count : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Habits List */}
      {loading && <p style={{ color: "#888", textAlign: "center" }}>Loading habits...</p>}
      {!loading && habits.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
          <p style={{ fontSize: "48px" }}>🌱</p>
          <p style={{ fontSize: "16px", marginTop: "1rem" }}>No habits yet. Add your first one!</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          const streak = getStreak(habit.completedDates);
          const progress = getProgress(habit.completedDates);

          return (
            <div key={habit._id} style={{ background: "#fff", border: `1.5px solid ${isCompleted ? habit.color : "#eee"}`, borderRadius: "14px", padding: "1rem 1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => toggleHabit(habit._id)}
                    style={{ width: "34px", height: "34px", borderRadius: "50%", border: `2px solid ${habit.color}`, background: isCompleted ? habit.color : "transparent", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    {isCompleted ? "✓" : ""}
                  </button>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "600", color: isCompleted ? "#aaa" : "#1a1a1a", textDecoration: isCompleted ? "line-through" : "none", margin: 0 }}>
                      {habit.name}
                    </h3>
                    {habit.description && <p style={{ fontSize: "13px", color: "#888", margin: "2px 0 0" }}>{habit.description}</p>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {streak > 0 && (
                    <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>🔥 {streak}d</span>
                  )}
                  <button onClick={() => deleteHabit(habit._id)}
                    style={{ padding: "5px 10px", borderRadius: "8px", border: "1px solid #fcc", background: "#fff0f0", color: "#c0392b", cursor: "pointer", fontSize: "12px" }}>
                    🗑
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>7-day progress</span>
                  <span style={{ fontSize: "11px", color: habit.color, fontWeight: "600" }}>{progress}%</span>
                </div>
                <div style={{ background: "#f0f0f0", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: habit.color, borderRadius: "99px", transition: "width 0.3s ease" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;