import { useState, useEffect } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://itelect2-project-1.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks when component mounts or token changes
  useEffect(() => {
    fetchTasks();
  }, [token]);

  async function fetchTasks() {
    setLoading(true);
    setError(null);

    try {
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/tasks`, { headers });

      if (!response.ok) {
        throw new Error(`Error fetching tasks (${response.status})`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLoginSuccess(newToken) {
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    setToken(null);
  }

  return (
    <main className="task-manager">
      <header className="app-header">
        <h1>Task Manager</h1>
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </header>

      {!token ? (
        <section className="auth-section">
          <p className="info-message">Please log in to manage tasks.</p>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </section>
      ) : (
        <section className="tasks-section">
          <p className="count">{tasks.length} tasks in your list</p>
          <TaskForm token={token} onTaskAdded={fetchTasks} />

          {loading && <p className="status-message">Loading tasks...</p>}
          {error && <p className="error-message">Failed to load tasks: {error}</p>}
          {!loading && !error && <TaskList tasks={tasks} />}
        </section>
      )}
    </main>
  );
}

export default App;