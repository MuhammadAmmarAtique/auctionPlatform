// errorHandler.js
import { ApiError } from  "../utlis/ApiError.js"

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data
    });
  }

  // For other, unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null
  });
};

export default errorHandler;
