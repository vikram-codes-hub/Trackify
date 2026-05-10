const { body } = require("express-validator");

const projectValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Project title is required")
    .isLength({ min: 2, max: 100 }).withMessage("Title must be 2–100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description max 500 characters"),

  body("members")
    .optional()
    .isArray().withMessage("Members must be an array"),
];

module.exports = { projectValidator };