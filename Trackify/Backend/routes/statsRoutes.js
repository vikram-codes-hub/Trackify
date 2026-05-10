const express = require("express");
const router  = express.Router();
const { getStats }    = require("../controllers/statsController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireAdmin }= require("../middleware/roleMiddleware");

router.get("/", verifyToken, requireAdmin, getStats);

module.exports = router;
