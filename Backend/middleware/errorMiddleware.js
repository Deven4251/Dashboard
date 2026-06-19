import mongoose from "mongoose";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource identifier";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value already exists";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
