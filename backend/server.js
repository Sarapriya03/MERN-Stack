const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const TodoModel = require("./models/todoList");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (use env var in Azure)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully..."))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API routes

// Get all todos
app.get("/getTodoList", async (req, res) => {
  try {
    const todoList = await TodoModel.find({});
    res.json(todoList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
app.post("/addTodoList", async (req, res) => {
  try {
    const newTodo = await TodoModel.create({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed || false,
    });
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo
app.put("/updateTodoList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    };
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete("/deleteTodoList/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    res.json(deletedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve React frontend (after build)
const clientBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(clientBuildPath));

// Fallback route: send React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// ✅ Start server (Azure provides PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});