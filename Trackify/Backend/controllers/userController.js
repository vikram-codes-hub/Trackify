const { User } = require("../models");
const ApiResponse = require("../utils/apiResponse");

// GET /api/users — Admin only: list all users for dropdowns
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
      order: [["name", "ASC"]],
    });
    return res.status(200).json(
      new ApiResponse(200, { users }, "Users fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
