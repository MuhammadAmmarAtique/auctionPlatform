import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApiError } from "../utlis/ApiError.js";
import mongoose from "mongoose";
import { Auction } from "../models/auction.model.js";
import { response } from "express";

const deleteAuctionItem = asyncHandler(async (req, res) => {
  const { auctionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw new ApiError(400, "Invalid auction id!");
  }

  const response = await Auction.findByIdAndDelete(auctionId);
  if (!response) {
    throw new ApiError(404, "Auction doesnot exist or Incorrect Auction id!");
  }

  res.status(200).json(new ApiResponse(200, "Successfully deleted Auction!"));
});

export { deleteAuctionItem };
