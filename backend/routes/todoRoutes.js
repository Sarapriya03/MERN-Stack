const express = require("express");
const Todo = require("../models/todoList");
const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a todo
router.post("/", async (req, res) => {
  const newTodo = new Todo({
    task: req.body.task,
  });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// Update a todo
router.put("/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

module.exports = router;
