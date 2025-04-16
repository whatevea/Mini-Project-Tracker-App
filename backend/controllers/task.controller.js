const Task = require("../models/task.model");
const Project = require("../models/project.model");
const STATUS = require("../constants/StatusEnum");
const router = require("express").Router();

const createTask = async (req, res) => {
  try {
    const { title, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Task title and project ID are required",
      });
    }

    const projectExists = await Project.findById(projectId);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const newTask = await Task.create({
      title,
      projectId,
      status: "todo", // Default status
    });

    res.status(201).json({
      success: true,
      data: newTask,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status || !STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${STATUS.join(", ")}`,
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// Get all tasks for a specific project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Define routes
router.post("/task", createTask);
router.put("/task/:taskId/status", updateTaskStatus);
router.get("/project/:projectId/tasks", getTasksByProject);

module.exports = router;
