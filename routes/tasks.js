const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helper/auth");

// Load Task Model
require("../models/Task");
const Task = mongoose.model("tasks");

// Task Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Task.find({ user: req.user.id }) //only visible to logged in user
    .sort({ date: "desc" })
    .then((tasks) => {
      res.render("tasks/index", {
        tasks: tasks,
      });
    });
});

// Add Task
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("tasks/add");
});

//Edit task form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Task.findOne({
    _id: req.params.id,
  }).then((task) => {
    if (task.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/tasks");
    } else {
      res.render("tasks/edit", {
        task: task,
      });
    }
  });
});

// Process Form
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };
    new Task(newUser).save().then((task) => {
      req.flash("success_msg", "Task added");
      res.redirect("/tasks");
    });
  }
});

//Update Process Form
router.put("/:id", ensureAuthenticated, (req, res) => {
  Task.findOne({
    _id: req.params.id,
  }).then((task) => {
    // new values
    task.title = req.body.title;
    task.details = req.body.details;

    task.save().then((task) => {
      req.flash("success_msg", "Task updated");
      res.redirect("/tasks");
    });
  });
});

//Delete task
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Task.remove({
    _id: req.params.id,
  }).then(() => {
    req.flash("success_msg", "Task removed");
    res.redirect("/tasks");
  });
});

module.exports = router;
