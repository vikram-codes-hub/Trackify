const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal Server Error";

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // Sequelize unique constraint (duplicate email etc.)
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    const field = err.errors[0]?.path || "field";
    message = `${field} already exists`;
  }

  // Sequelize foreign key constraint
  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Referenced record does not exist";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError")  { statusCode = 401; message = "Invalid token"; }
  if (err.name === "TokenExpiredError")  { statusCode = 401; message = "Token expired"; }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };