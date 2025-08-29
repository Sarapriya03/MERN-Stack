const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },       // matches frontend "Task"
  status: { type: String, required: true },     // matches frontend "Status"
  deadline: { type: Date, required: true }      // matches frontend "Deadline"
});

module.exports = mongoose.model("Todo", TodoSchema);
