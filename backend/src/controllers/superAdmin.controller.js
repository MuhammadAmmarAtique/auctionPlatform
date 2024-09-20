import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApiError } from "../utlis/ApiError.js";
import mongoose from "mongoose";
import { Auction } from "../models/auction.model.js";
import { CommissionProof } from "../models/commissionProof.model.js";

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

const getAllPaymentProofs = asyncHandler(async (req, res) => {
  const AllPaymentProofs = await CommissionProof.find();

  if (AllPaymentProofs.length === 0) {
    throw new ApiError(200, "No payment proofs exist or found in database");
  }

  res.status(200).json(
    new ApiResponse(200, "Successfully fetched all payment prooofs!", {
      "AllPaymentProofs:": AllPaymentProofs,
    })
  );
});

const getPaymentProofDetail = asyncHandler(async (req, res) => {
  const { paymentProofId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentProofId)) {
    throw new ApiError(400, "Invalid Payment Proof id!");
  }

  const paymentProof = await CommissionProof.findById(paymentProofId);
  if (!paymentProof) {
    throw new ApiError(
      400,
      "Payment proof doesnot exist in database or incorrect payment proof id!"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully fetched payment proof!", paymentProof)
    );
});

export { deleteAuctionItem, getAllPaymentProofs, getPaymentProofDetail };
