const ApiError = require("../utils/apiError");

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return next(new ApiError(403, "Access denied: Admins only"));
};

module.exports = { requireAdmin };