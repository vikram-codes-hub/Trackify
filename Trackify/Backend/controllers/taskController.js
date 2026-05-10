const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Task, User, Project } = require("../models");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const USER_ATTRS = ["id", "name", "email"];

// GET /api/tasks?search=&status=&priority=&assignedTo=&project=&page=&limit=
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      assignedTo,
      project,
      page  = 1,
      limit = 10,
    } = req.query;

    const where = {};

    // non-admins only see tasks assigned to them
    if (req.user.role !== "admin") {
      where.assignedToId = req.user.id;
    } else {
      if (assignedTo) where.assignedToId = assignedTo;
    }

    if (status)   where.status   = status;
    if (priority) where.priority = priority;
    if (project)  where.projectId = project;

    // ILIKE = case-insensitive LIKE in PostgreSQL
    if (search) {
      where[Op.or] = [
        { title:       { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, as: "assignedTo", attributes: USER_ATTRS },
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: Project, attributes: ["id", "title"] },
      ],
      order: [["createdAt", "DESC"]],
      limit:  parseInt(limit),
      offset,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        tasks,
        pagination: {
          total: count,
          page:  parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit)),
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

    const projectExists = await Project.findByPk(project);
    if (!projectExists) return next(new ApiError(404, "Project not found"));

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedToId: assignedTo || null,
      projectId:    project,
      createdById:  req.user.id,
      dueDate:      dueDate || null,
    });

    const full = await Task.findByPk(task.id, {
      include: [
        { model: User, as: "assignedTo", attributes: USER_ATTRS },
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: Project, attributes: ["id", "title"] },
      ],
    });

    return res.status(201).json(
      new ApiResponse(201, { task: full }, "Task created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: "assignedTo", attributes: USER_ATTRS },
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: Project, attributes: ["id", "title"] },
      ],
    });

    if (!task) return next(new ApiError(404, "Task not found"));

    if (
      req.user.role !== "admin" &&
      task.assignedToId !== req.user.id
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

    const task = await Task.findByPk(req.params.id);
    if (!task) return next(new ApiError(404, "Task not found"));

    if (req.user.role !== "admin") {
      // regular user: can only update status of their own task
      if (task.assignedToId !== req.user.id) {
        return next(new ApiError(403, "You can only update your own tasks"));
      }
      if (req.body.status) task.status = req.body.status;
    } else {
      // admin: update everything
      const { title, description, status, priority, assignedTo, dueDate } = req.body;
      if (title)                    task.title       = title;
      if (description !== undefined) task.description = description;
      if (status)                   task.status      = status;
      if (priority)                 task.priority    = priority;
      if (assignedTo !== undefined) task.assignedToId = assignedTo;
      if (dueDate !== undefined)    task.dueDate     = dueDate;
    }

    await task.save();

    const full = await Task.findByPk(task.id, {
      include: [
        { model: User, as: "assignedTo", attributes: USER_ATTRS },
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: Project, attributes: ["id", "title"] },
      ],
    });

    return res.status(200).json(
      new ApiResponse(200, { task: full }, "Task updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return next(new ApiError(404, "Task not found"));

    await task.destroy();

    return res.status(200).json(
      new ApiResponse(200, {}, "Task deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, getTaskById, updateTask, deleteTask };