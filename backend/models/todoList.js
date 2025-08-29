const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },        // "First Task"
  description: { type: String, required: true },  // "Develop a MERN stack app"
  completed: { type: Boolean, default: false },   // false
  deadline: { type: Date, required: true }        // 2025-08-30T12:00
}, { timestamps: true });

module.exports = mongoose.model("Todo", TodoSchema);
