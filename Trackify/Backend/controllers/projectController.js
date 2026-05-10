const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Project, User, Task, ProjectMember } = require("../models");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const USER_ATTRS = ["id", "name", "email"];

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereClause = {};
    let includeMembers = {
      model: User,
      as: "members",
      attributes: USER_ATTRS,
      through: { attributes: [] },
    };

    // non-admin: show projects where user is member OR creator OR has tasks assigned
    if (req.user.role !== "admin") {
      const memberProjects = await ProjectMember.findAll({
        where: { userId: req.user.id },
      });
      const memberProjectIds = memberProjects.map((m) => m.projectId);

      // also find projects where user has tasks assigned to them
      const assignedTasks = await Task.findAll({
        where: { assignedToId: req.user.id },
        attributes: ["projectId"],
      });
      const assignedProjectIds = assignedTasks.map((t) => t.projectId);

      // merge all project IDs the user has access to
      const allProjectIds = [...new Set([...memberProjectIds, ...assignedProjectIds])];

      whereClause = {
        [Op.or]: [
          { id: { [Op.in]: allProjectIds } },
          { createdById: req.user.id },
        ],
      };
    }

    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        includeMembers,
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        projects,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
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

    const { title, description, members = [] } = req.body;

    const project = await Project.create({
      title,
      description,
      createdById: req.user.id,
    });

    if (members.length > 0) {
      await project.setMembers(members);
    }

    const full = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: User, as: "members", attributes: USER_ATTRS, through: { attributes: [] } },
      ],
    });

    return res.status(201).json(
      new ApiResponse(201, { project: full }, "Project created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: User, as: "members", attributes: USER_ATTRS, through: { attributes: [] } },
      ],
    });

    if (!project) return next(new ApiError(404, "Project not found"));

    // non-admin: allow if creator OR member
    if (req.user.role !== "admin") {
      const isMember = project.members.some((m) => m.id === req.user.id);
      const isCreator = project.createdById === req.user.id;
      if (!isMember && !isCreator) {
        return next(new ApiError(403, "Access denied to this project"));
      }
    }

    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      include: [
        { model: User, as: "assignedTo", attributes: USER_ATTRS },
        { model: User, as: "createdBy", attributes: USER_ATTRS },
      ],
      order: [["createdAt", "DESC"]],
    });

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

    const project = await Project.findByPk(req.params.id);
    if (!project) return next(new ApiError(404, "Project not found"));

    const { title, description, members } = req.body;
    if (title)                     project.title       = title;
    if (description !== undefined) project.description = description;
    await project.save();

    if (members) await project.setMembers(members);

    const full = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "createdBy", attributes: USER_ATTRS },
        { model: User, as: "members", attributes: USER_ATTRS, through: { attributes: [] } },
      ],
    });

    return res.status(200).json(
      new ApiResponse(200, { project: full }, "Project updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return next(new ApiError(404, "Project not found"));

    await project.destroy();

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