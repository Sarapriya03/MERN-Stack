import axios from "axios";
import React, { useEffect, useState } from "react";

// Set axios base URL to match your backend URL
axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [editedDeadline, setEditedDeadline] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // Fetch tasks
  useEffect(() => {
    axios
      .get("/getTodoList")
      .then((result) => setTodoList(result.data))
      .catch((err) => console.log(err));
  }, []);

  // Toggle edit
  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data._id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTitle(rowData.title);
      setEditedDescription(rowData.description);
      setEditedCompleted(rowData.completed);
      setEditedDeadline(
        rowData.deadline
          ? new Date(rowData.deadline).toISOString().slice(0, 16)
          : ""
      );
    } else {
      setEditableId(null);
      setEditedTitle("");
      setEditedDescription("");
      setEditedCompleted(false);
      setEditedDeadline("");
    }
  };

  // Add task
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const payload = {
      title: newTask,
      description: newStatus,
      completed: newStatus === "Completed",
      deadline: newDeadline,
    };
    console.log("🚀 Sending payload:", payload);

    axios
      .post("/addTodoList", payload)
      .then((response) => {
        console.log("✅ Server response:", response.data);
        setTodoList([...todoList, response.data]);
        setNewTask("");
        setNewStatus("");
        setNewDeadline("");
      })
      .catch((err) => console.error("❌ Add Task error:", err));
  };

  // Save edited task
  const saveEditedTask = (id) => {
    if (!editedTitle || !editedDescription || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const editedData = {
      title: editedTitle,
      description: editedDescription,
      completed: editedCompleted,
      deadline: new Date(editedDeadline),
    };

    axios
      .put(`/updateTodoList/${id}`, editedData)
      .then((response) => {
        const updatedTodos = todoList.map((todo) =>
          todo._id === id ? response.data : todo
        );
        setTodoList(updatedTodos);
        setEditableId(null);
        setEditedTitle("");
        setEditedDescription("");
        setEditedCompleted(false);
        setEditedDeadline("");
      })
      .catch((err) => console.log(err));
  };

  // Delete task
  const deleteTask = (id) => {
    axios
      .delete(`/deleteTodoList/${id}`)
      .then(() => {
        const filteredTodos = todoList.filter((todo) => todo._id !== id);
        setTodoList(filteredTodos);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Todo Table */}
        <div className="col-md-7">
          <h2 className="text-center">Todo List</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Completed</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoList.length > 0 ? (
                  todoList.map((data) => (
                    <tr key={data._id}>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                          />
                        ) : (
                          data.title
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedDescription}
                            onChange={(e) =>
                              setEditedDescription(e.target.value)
                            }
                          />
                        ) : (
                          data.description
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <select
                            className="form-control"
                            value={editedCompleted ? "Completed" : "Pending"}
                            onChange={(e) =>
                              setEditedCompleted(e.target.value === "Completed")
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : data.completed ? (
                          "Completed"
                        ) : (
                          "Pending"
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editedDeadline}
                            onChange={(e) =>
                              setEditedDeadline(e.target.value)
                            }
                          />
                        ) : data.deadline ? (
                          new Date(data.deadline).toLocaleString()
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => saveEditedTask(data._id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => toggleEditable(data._id)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm ms-1"
                          onClick={() => deleteTask(data._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Task */}
        <div className="col-md-5">
          <h2 className="text-center">Add Task</h2>
          <form className="bg-light p-4" onSubmit={addTask}>
            <div className="mb-3">
              <label>Task</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Description"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <select
                className="form-control"
                value={newStatus === "Completed" ? "Completed" : "Pending"}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Deadline</label>
              <input
                className="form-control"
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success btn-sm">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Todo;
