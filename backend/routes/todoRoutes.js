const express = require("express");
const Todo = require("../models/todoList");
const router = express.Router();

// ✅ Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("❌ Error fetching todos:", err.message);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ Add a new todo
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed || false,
      deadline: req.body.deadline,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("❌ Error saving todo:", err.message);
    res.status(500).json({ error: "Failed to save todo" });
  }
});

// ✅ Update a todo by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        deadline: req.body.deadline,
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error("❌ Error updating todo:", err.message);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ✅ Delete a todo by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting todo:", err.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
