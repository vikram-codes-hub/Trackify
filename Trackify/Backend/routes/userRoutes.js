const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

router.get("/", verifyToken, requireAdmin, getUsers);

module.exports = router;
