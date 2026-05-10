const { validationResult } = require("express-validator");
const Project = require("../models/Project");
const Task = require("../models/Task");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Admin sees all, user sees only projects they are member of
    const filter =
      req.user.role === "admin"
        ? {}
        : { members: req.user._id };

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate("createdBy", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(filter),
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        projects,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }, "Projects fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const { title, description, members } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    await project.populate("createdBy", "name email");
    await project.populate("members", "name email");

    return res.status(201).json(
      new ApiResponse(201, { project }, "Project created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Check access
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (req.user.role !== "admin" && !isMember) {
      return next(new ApiError(403, "Access denied to this project"));
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, { project, tasks }, "Project fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    const { title, description, members } = req.body;
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (members) project.members = members;

    await project.save();
    await project.populate("createdBy", "name email");
    await project.populate("members", "name email");

    return res.status(200).json(
      new ApiResponse(200, { project }, "Project updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Delete all tasks under this project too
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();

    return res.status(200).json(
      new ApiResponse(200, {}, "Project and its tasks deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};