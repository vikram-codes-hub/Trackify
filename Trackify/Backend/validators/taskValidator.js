const { body } = require("express-validator");

const taskValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ min: 2, max: 150 }).withMessage("Title must be 2–150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description max 1000 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]).withMessage("Invalid priority"),

  body("project")
    .notEmpty().withMessage("Project ID is required")
    .isInt({ min: 1 }).withMessage("Invalid project ID"),

  body("assignedTo")
    .optional()
    .isInt({ min: 1 }).withMessage("Invalid user ID"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Invalid date format"),
];

const updateTaskStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
];

module.exports = { taskValidator, updateTaskStatusValidator };