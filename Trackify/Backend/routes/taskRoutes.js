const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const { taskValidator } = require("../validators/taskValidator");

router.use(verifyToken); // all task routes are protected

router.get("/", getTasks);
router.post("/", requireAdmin, taskValidator, createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);         // both admin and user (controller handles the difference)
router.delete("/:id", requireAdmin, deleteTask);

module.exports = router;