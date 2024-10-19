import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApiError } from "../utlis/ApiError.js";
import mongoose from "mongoose";
import { Auction } from "../models/auction.model.js";
import { User } from "../models/user.model.js";
import { CommissionProof } from "../models/commissionProof.model.js";
import { Commission } from "../models/commission.model.js";

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

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched all payment prooofs!",
        AllPaymentProofs
      )
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

const deletePaymentProof = asyncHandler(async (req, res) => {
  const { paymentProofId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentProofId)) {
    throw new ApiError(400, "Invalid Payment Proof id!");
  }

  const response = await CommissionProof.findByIdAndDelete(paymentProofId);
  if (!response) {
    throw new ApiError(
      404,
      "CommissionProof doesnot exist or Incorrect  Payment Proof id!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted CommissionProof!"));
});

const getRegisteredUserCountByMonth = asyncHandler(async (req, res) => {
  const allUsers = await User.aggregate([
    // 1) it will group document who has same role & same month and year of createion
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    // 2) projecting & making data structure better
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    //3) sorting documents in ascending order by year i.e 2023, 2024
    {
      $sort: {
        year: 1,
      },
    },
  ]);

  // 4) separating bidders and auctioneers
  const bidders = allUsers.filter((user) => user.role === "Bidder");
  const auctioneers = allUsers.filter((user) => user.role === "Auctioneer");

  // 5) now we will transform Users data in a Array which will tell us from 1st month to 12th month, how many users are registered in each month, it will be helpful to show this data as a graph in frontend

  const transformData = (data, months = 12) => {
    //making empty array with 12 elements (all values are zero)
    let result = Array(months).fill(0);
    //  filling  "result" array with actual data
    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });
    // returning result
    return result;
  };

  const biddersRegisteredInEachMonth = transformData(bidders);
  const auctioneersRegisteredInEachMonth = transformData(auctioneers);

  // 6) return response

  res.status(200).json(
    new ApiResponse(
      200,
      "Successfully fetched Users data and Transformed them into a Array showing in which month how many users are registered!",
      {
        biddersRegisteredInEachMonth,
        auctioneersRegisteredInEachMonth,
      }
    )
  );
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const paymentsReceived = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalRevenue: { $sum: "$amount" },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  const transformData = (data, months = 12) => {
    let result = Array(months).fill(0);

    data.forEach((elem) => {
      result[elem.month - 1] = elem.totalRevenue;
    });

    return result;
  };

  const monthlyRevenue = transformData(paymentsReceived);

  res.status(200).json(
    new ApiResponse(
      200,
      "Successfully fetched Monthly Revenue and Transformed it into a Array showing how much Super Admin earned per month!",
      {
        monthlyRevenue,
      }
    )
  );
});

export {
  deleteAuctionItem,
  getAllPaymentProofs,
  getPaymentProofDetail,
  updatePaymentProof,
  deletePaymentProof,
  getRegisteredUserCountByMonth,
  getMonthlyRevenue,
};
