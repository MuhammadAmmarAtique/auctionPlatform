import { ApiError } from "../utlis/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // For other, unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });

  console.error(
    `[Error] - ${new Date().toISOString()}: An error occurred in the backend application`
  );
  console.err(`err: ${err}`);
  console.error(`Error Message: ${err.message}`);
  console.error(`Stack Trace: ${err.stack}`);
};

export default errorHandler;
