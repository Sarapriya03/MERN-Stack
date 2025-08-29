const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./models/todoList");

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS setup (allow local + Render frontend)
app.use(cors({
  origin: [
    "http://localhost:3000",          
    "https://todo-list-fe-p3q9.onrender.com"   // your frontend
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
app.get("/api/todos", async (req, res) => {
  try {
    const todoList = await TodoModel.find({});
    res.json(todoList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    console.log("📥 Received payload:", req.body);
    const newTodo = await TodoModel.create(req.body);
    res.json(newTodo);
  } catch (err) {
    console.error("❌ Error while saving todo:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      task: req.body.title || req.body.task,
      status: req.body.description || req.body.status,
      completed: req.body.completed || false,
      deadline: req.body.deadline,
    };
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    res.json(deletedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Health check (for Render)
app.get("/", (req, res) => {
  res.send("✅ Todo API is running...");
});


// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
