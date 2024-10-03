import { ApiError } from "../utlis/ApiError.js";

const errorHandler = (err, req, res, next) => {
   // ApiError (for custom errors thrown manually)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }
   // Mongoose Validation Error
   if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages, // Send all validation errors
    });
  }

   // General Error (fallback for unexpected errors)
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });
  
  // Error logging for debugging
  console.error(
    `[Error] - ${new Date().toISOString()}: An error occurred in the backend application`
  );
  console.error(`err: ${err}`);
  console.error(`Error Message: ${err.message}`);
  console.error(`Stack Trace: ${err.stack}`);
};

export default errorHandler;
