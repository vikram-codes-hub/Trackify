const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// GET /api/tasks?search=&status=&assignedTo=&project=&page=&limit=
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      assignedTo,
      project,
      priority,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Non-admin users only see their own tasks
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    if (status) filter.status = status;
    if (assignedTo && req.user.role === "admin") filter.assignedTo = assignedTo;
    if (project) filter.project = project;
    if (priority) filter.priority = priority;

    // Text search on title and description
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("project", "title")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      }, "Tasks fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const { title, description, status, priority, assignedTo, project, dueDate } = req.body;

    // Check project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return next(new ApiError(404, "Project not found"));
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || null,
      project,
      createdBy: req.user._id,
      dueDate: dueDate || null,
    });

    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");
    await task.populate("createdBy", "name email");

    return res.status(201).json(
      new ApiResponse(201, { task }, "Task created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .populate("createdBy", "name email");

    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    // Non-admin can only view their assigned tasks
    if (
      req.user.role !== "admin" &&
      task.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, "Access denied to this task"));
    }

    return res.status(200).json(
      new ApiResponse(200, { task }, "Task fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    // Regular user can only update status of their own tasks
    if (req.user.role !== "admin") {
      if (task.assignedTo?.toString() !== req.user._id.toString()) {
        return next(new ApiError(403, "You can only update your own tasks"));
      }
      // Only allow status update for regular users
      if (req.body.status) task.status = req.body.status;
    } else {
      // Admin can update everything
      const { title, description, status, priority, assignedTo, dueDate } = req.body;
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");
    await task.populate("createdBy", "name email");

    return res.status(200).json(
      new ApiResponse(200, { task }, "Task updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new ApiError(404, "Task not found"));
    }

    await task.deleteOne();

    return res.status(200).json(
      new ApiResponse(200, {}, "Task deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, getTaskById, updateTask, deleteTask };