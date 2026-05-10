const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const { projectValidator } = require("../validators/projectValidator");

router.use(verifyToken); // all project routes are protected

router.get("/", getProjects);
router.post("/", requireAdmin, projectValidator, createProject);
router.get("/:id", getProjectById);
router.put("/:id", requireAdmin, projectValidator, updateProject);
router.delete("/:id", requireAdmin, deleteProject);

module.exports = router;