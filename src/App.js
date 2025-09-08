import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaCheckCircle, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Add Task
  const addTask = () => {
    if (task.trim() === "") return;
    setTodos([...todos, { id: Date.now().toString(), text: task, completed: false }]);
    setTask("");
  };

  // Toggle Complete
  const toggleComplete = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Delete Task
  const deleteTask = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Start Editing
  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  // Save Edit
  const saveEdit = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditIndex(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  // Drag & Drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTodos(items);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div className="col-md-6 col-lg-5">
        {/* App Title */}
        <div className="text-center text-white mb-4">
          <h1 className="fw-bold">✨ To-Do List</h1>
          <p className="mb-0">Stay productive, stay organized</p>
        </div>

        {/* Input Section */}
        <div className="card shadow-lg border-0 rounded-4 mb-4">
          <div className="card-body">
            <div className="d-flex">
              <input
                type="text"
                className="form-control rounded-pill shadow-sm"
                placeholder="Add a new task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <button
                className="btn btn-primary ms-2 rounded-pill px-4 shadow-sm"
                onClick={addTask}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-3">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="todo-list">
                {(provided) => (
                  <ul
                    className="list-group"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {todos.length === 0 && (
                      <li className="list-group-item text-center text-muted">
                        No tasks yet. Start adding!
                      </li>
                    )}

                    {todos.map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(provided) => (
                          <li
                            className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 rounded"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {/* Editing Mode */}
                            {editIndex === index ? (
                              <div className="d-flex w-100">
                                <input
                                  type="text"
                                  className="form-control me-2"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                />
                                <button
                                  className="btn btn-success me-2"
                                  onClick={() => saveEdit(todo.id)}
                                >
                                  <FaSave />
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  onClick={cancelEdit}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span
                                  style={{
                                    textDecoration: todo.completed ? "line-through" : "",
                                    color: todo.completed ? "gray" : "black",
                                  }}
                                  className="fw-semibold"
                                >
                                  {todo.text}
                                </span>
                                <div>
                                  <button
                                    className="btn btn-sm btn-success me-2 rounded-circle"
                                    onClick={() => toggleComplete(todo.id)}
                                  >
                                    <FaCheckCircle />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-warning me-2 rounded-circle"
                                    onClick={() => startEditing(index)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger rounded-circle"
                                    onClick={() => deleteTask(todo.id)}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}
