const { Op, fn, col, literal } = require("sequelize");
const { Task, User, Project } = require("../models");
const ApiError    = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// GET /api/stats  (admin only)
const getStats = async (req, res, next) => {
  try {
    const now = new Date();

    // ── Basic counts ──────────────────────────────────────────────
    const totalProjects = await Project.count();
    const totalTasks    = await Task.count();
    const completedTasks = await Task.count({ where: { status: "done" } });
    const overdueTasks   = await Task.count({
      where: {
        status:  { [Op.ne]: "done" },
        dueDate: { [Op.lt]: now },
      },
    });

    const completionRate = totalTasks
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    // ── Tasks by status ───────────────────────────────────────────
    const todoCount     = await Task.count({ where: { status: "todo" } });
    const progressCount = await Task.count({ where: { status: "in-progress" } });

    // ── Leaderboard: top 5 users by completed tasks ───────────────
    const leaderboard = await Task.findAll({
      where: { status: "done", assignedToId: { [Op.ne]: null } },
      attributes: [
        "assignedToId",
        [fn("COUNT", col("Task.id")), "completed"],
      ],
      include: [
        {
          model: User,
          as: "assignedTo",
          attributes: ["id", "name", "email"],
        },
      ],
      group: ["assignedToId", "assignedTo.id"],
      order: [[literal("completed"), "DESC"]],
      limit: 5,
      subQuery: false,
    });

    return res.status(200).json(
      new ApiResponse(200, {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
        tasksByStatus: {
          todo:       todoCount,
          inProgress: progressCount,
          done:       completedTasks,
        },
        leaderboard: leaderboard.map((row) => ({
          user:      row.assignedTo,
          completed: parseInt(row.dataValues.completed, 10),
        })),
      }, "Stats fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
