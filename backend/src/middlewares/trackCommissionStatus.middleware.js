import { User } from "../models/user.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { asyncHandler } from "../utlis/asyncHandler.js";

export const trackCommissionStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.unpaidCommission > 0) {
    next(
      new ApiError(
        400,
        "You cannot add new Auction item until you have paid Commission to Super Admin of last Successful Auction!"
      )
    );
  }
  next();
});
