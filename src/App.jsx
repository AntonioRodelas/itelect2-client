import { useState } from "react";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import "./App.css";

const STARTING_TASKS = [
  { id: 1, title: "Complete backend API integration review", dueDate: "2026-10-25" },
  { id: 2, title: "Test GT13 local state implementation", dueDate: "2026-10-21" },
  { id: 3, title: "Prepare database migration seeders", dueDate: "2026-10-28" },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      dueDate: "2026-10-30",
    };
    setTasks([...tasks, newTask]);
  }

  return (
    <main className="task-manager">
      <h1>Task Manager</h1>
      <p className="count">{tasks.length} tasks in your list</p>
      <TaskForm onAdd={addTask} />
      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;