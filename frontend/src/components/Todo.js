import axios from "axios";
import React, { useEffect, useState } from "react";

// Set axios base URL to match your Azure backend URL
axios.defaults.baseURL = "https://todo-list-asfgcsbnc9bpb4dn.centralindia-01.azurewebsites.net";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
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
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(
        rowData.deadline ? new Date(rowData.deadline).toISOString().slice(0, 16) : ""
      );
    } else {
      setEditableId(null);
      setEditedTask("");
      setEditedStatus("");
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

    axios
      .post("/addTodoList", {
        task: newTask,
        status: newStatus,
        deadline: new Date(newDeadline),
      })
      .then((response) => {
        setTodoList([...todoList, response.data]);
        setNewTask("");
        setNewStatus("");
        setNewDeadline("");
      })
      .catch((err) => console.log(err));
  };

  // Save edited task
  const saveEditedTask = (id) => {
    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const editedData = {
      task: editedTask,
      status: editedStatus,
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
        setEditedTask("");
        setEditedStatus("");
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
                  <th>Status</th>
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
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                          />
                        ) : (
                          data.task
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                          />
                        ) : (
                          data.status
                        )}
                      </td>
                      <td>
                        {editableId === data._id ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editedDeadline}
                            onChange={(e) => setEditedDeadline(e.target.value)}
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
                    <td colSpan="4" className="text-center">
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
              <label>Status</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
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
