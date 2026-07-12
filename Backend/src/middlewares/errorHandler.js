const errorHandler = (err, req, res, next) => {
  // Our custom errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Zod validation errors (if you add zod later)
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: err.errors[0].message
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value entered"
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    return res.status(400).json({
      success: false,
      message
    });
  }

  // Unexpected errors - log but don't leak details
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

module.exports = errorHandler;