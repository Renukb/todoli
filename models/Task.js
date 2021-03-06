const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//ideas is name of the model
mongoose.model("tasks", TaskSchema);
