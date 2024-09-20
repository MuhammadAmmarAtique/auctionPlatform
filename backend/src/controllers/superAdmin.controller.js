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

const updatePaymentProof = asyncHandler(async (req, res) => {
  // 1) take comission payment proof id
  // 2) add checks so that user must give at least one of status or amount to update comission payment proof obj
  // 3) update object based on what is provided by admin
  // 4) return response

  // 1)
  const { paymentProofId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentProofId)) {
    throw new ApiError(400, "Invalid Payment Proof id!");
  }

  // 2)
  const { status, amount } = req.body;

  if (!status && !amount) {
    throw new ApiError(
      400,
      "Must provide at least one of status or amount to update commission proof."
    );
  }

  // 3)
  const updates = {};

  if (status) {
    updates.status = status;
  }
  // As a Admin we can change amount if auctioneer wrote less or more amount then he actually transfered in admin's bank account as a comission.
  if (amount) {
    updates.amount = amount;
  }

  const updatedCommissionProof = await CommissionProof.findByIdAndUpdate(
    paymentProofId,
    updates,
    {
      new: true,
    }
  );

  // 4)
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Commission proof updated successfully",
        updatedCommissionProof
      )
    );
});

export {
  deleteAuctionItem,
  getAllPaymentProofs,
  getPaymentProofDetail,
  updatePaymentProof,
};
