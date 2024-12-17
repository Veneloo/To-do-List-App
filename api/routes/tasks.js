const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Add new task
router.post("/", async (req, res) => {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();
    res.json(newTask);
});

// Update task
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});


// Delete task
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
});

// Update task's completed status
router.put("/:id/completed", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task's completion status" });
    }
});


// Example for Create Post
router.get("/examples/create", async (req, res) => {
    try {
        const newTask = new Task({
            title: "Example Task",
            description: "This is a task created from the example link",
            completed: false,
        });

        await newTask.save();
        res.send({
            message: "Example task created successfully",
            task: newTask,
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to create example task" });
    }
});

// Example for Edit Post
router.get("/examples/edit", async (req, res) => {
    try {
        const task = await Task.findOne(); // Find any task to edit
        if (!task) {
            return res.status(404).send({ message: "No tasks available to edit" });
        }

        task.title = "Edited Example Task";
        task.description = "This is an updated task from the example link";
        await task.save();

        res.send({
            message: "Example task edited successfully",
            task,
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to edit example task" });
    }
});

// Example for Delete Post
router.get("/examples/delete", async (req, res) => {
    try {
        const task = await Task.findOne(); // Find any task to delete
        if (!task) {
            return res.status(404).send({ error: "No tasks available to delete" });
        }

        await Task.deleteOne({ _id: task._id });

        res.send({
            message: "Example task deleted successfully",
            task: task, // Include details of the deleted task
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete example task", details: error.message });
    }
});


module.exports = router;
