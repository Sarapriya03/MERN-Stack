const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: false },       
  status: { type: String, required: false },     
  title: { type: String, required: false },      // accept frontend "title"
  description: { type: String, required: false },// accept frontend "description"
  completed: { type: Boolean, default: false },  
  deadline: { type: Date }                       
});

module.exports = mongoose.model("Todo", TodoSchema);
