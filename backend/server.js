const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const TodoModel = require("./models/todoList");

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup (allow local + Render frontend)
app.use(cors({
  origin: [
    "http://localhost:3000",          // local React dev
    "https://todo-list-fe-p3q9.onrender.com" // your Render frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully..."))
.catch((err) => console.error("❌ MongoDB connection error:", err));


// ----------------- API Routes -----------------

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
    console.log("📥 Received payload:", req.body); 
    const newTodo = await TodoModel.create({
      task: req.body.task,
      status: req.body.status,
      deadline: req.body.deadline || false,
    });
    console.log("✅ Saved todo:", newTodo);
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
      task: req.body.task,
      status: req.body.status,
      deadline: req.body.deadline,
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


// ----------------- Serve React build (optional if backend only) -----------------
const clientBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});


// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
