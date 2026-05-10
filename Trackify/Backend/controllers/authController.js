const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { User } = require("../models");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return next(new ApiError(400, "Email already registered"));

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });

    const token = generateToken(user.id);

    return res.status(201).json(
      new ApiResponse(201, {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      }, "Account created successfully")
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ApiError(400, "Validation failed", errors.array()));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return next(new ApiError(401, "Invalid email or password"));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError(401, "Invalid email or password"));

    const token = generateToken(user.id);

    return res.status(200).json(
      new ApiResponse(200, {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      }, "Login successful")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(
      new ApiResponse(200, { user }, "User fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };