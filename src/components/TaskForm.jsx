import { useState } from "react";

function TaskForm({ token, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://itelect2-project-1.onrender.com";

  // Helper to decode JWT token to get userId if needed by backend
  function getUserIdFromToken(jwtToken) {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      return payload.id || payload.userId;
    } catch {
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setLoading(true);
    setError(null);

    const userId = getUserIdFromToken(token);

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          dueDate: "2026-10-30",
          userId: userId, // Include userId so Sequelize validation passes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create task");
      }

      const newTask = await response.json();
      setTitle("");
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title of a new task"
        disabled={loading}
      />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}

export default TaskForm;