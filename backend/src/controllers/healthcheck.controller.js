import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";

export const healthcheck = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Everything is okay!", {}));
});
