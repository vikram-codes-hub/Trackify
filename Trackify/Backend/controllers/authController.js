const { validationResult } = require("express-validator");
const User = require("../models/User");
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "Email already registered"));
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    return res.status(201).json(
      new ApiResponse(201, {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, "Invalid email or password"));
    }

    const token = generateToken(user._id);

    return res.status(200).json(
      new ApiResponse(200, {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }, "Login successful")
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(
      new ApiResponse(200, { user }, "User fetched successfully")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };