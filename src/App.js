import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

const API_URL = "http://3.141.34.170:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return alert("Escribe una tarea antes de agregar.");
    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      await axios.post(API_URL, { title, date: formattedDate });
      fetchTasks();
      setTitle("");
    } catch (err) {
      console.error("Error al crear la tarea:", err);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/toggle`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error al completar tarea:", err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
  const filteredTasks = tasks.filter(
    (task) =>
      (!task.isCompleted &&
        (!task.date || task.date === formattedSelectedDate))
  );

  return (
    <div className="background">
      <div className="dashboard">
        <header className="header">
          <h1 className="app-title">🗓️ Gestor de Tareas</h1>
          <p className="date">
            {selectedDate.toLocaleDateString("es-PE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
          />
        </div>

        <div className="task-input">
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTask}>Agregar</button>
        </div>

        <div className="task-section">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">✨ No hay tareas para este día.</p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li key={task._id} className="task-card">
                  <div
                    className="task-title"
                    onClick={() => completeTask(task._id)}
                    title="Haz clic para marcar como hecha"
                  >
                    🟢 {task.title}
                    <div className="task-date">
                      📅{" "}
                      {task.date
                        ? new Date(task.date).toLocaleDateString("es-PE")
                        : "Sin fecha"}
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                    title="Eliminar tarea"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
