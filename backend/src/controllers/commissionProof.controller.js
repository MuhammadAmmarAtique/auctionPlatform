import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Auction } from "../models/auction.model.js";
import { CommissionProof } from "../models/commissionProof.model.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";

const calculateComission = asyncHandler(async (req, res) => {
  // 1) find auctioneer + auction (we are supposing that auction is ended)
  // 2) if no one placed bid, no need to calcualte comission
  // 3) else calculate comission through  current bid as its highest bid placed e.g (10% of total amount) & update auctioneer "unpaid Comssiion" field.

  // 1)
  let auctioneer = await User.findById(req.user._id);
  if (auctioneer.unpaidCommission > 0) {
    throw new ApiError(400, "Super Admin Comission is already calculated!");
  }

  let auction = await Auction.findOne({
    createdBy: req.user._id,
  });
  if (!auction) {
    throw new ApiError(400, "You doesnot have any Auction Listed!");
  }
  // 2)
  if (auction.currentBid === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "No bid is placed on auction, No need to calculate comission for super Admin"
        )
      );
  }
  // 3)
  else {
    let highestBid = auction.currentBid;
    let superAdminCommission = highestBid * 0.1; // 10% of highestBid
    auctioneer.unpaidCommission = superAdminCommission;
    await auctioneer.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Successfully calculated Super Admin Comission and added amount in unpaid Comission field of Auctioneer!",
          { "auctioneer:": auctioneer }
        )
      );
  }
});

const proofOfComission = asyncHandler(async (req, res) => {
  // 1) take amount + comment
  // 2) take payment proof image
  // 3) upload in clodinary
  // 4) create comission Proof / Payment Proof object
  // 5) return response

  // 1)
  const { amount, comment } = req.body;
  if (!amount) {
    throw new ApiError(400, "Must give amount you paid to super Admin");
  }
  if (!comment?.trim()) {
    throw new ApiError(400, "Must add comment explaining payment details!");
  }

  // 2)
  if (!req.files.paymentProof || Object.keys(req.files).length === 0) {
    throw new ApiError(
      400,
      "Must give image as a payment proof of money transfered to Super Admin Bank Account!"
    );
  }
  const paymentProofImg = req.files?.paymentProof;

  // 3)
  const uploadedPaymentProofImg = await uploadOnCloudinary(
    paymentProofImg.tempFilePath
  );

  // 4)
  const comissionProof = await CommissionProof.create({
    userId: req.user._id,
    imageProof: {
      public_id: uploadedPaymentProofImg.public_id,
      url: uploadedPaymentProofImg.url,
    },
    amount,
    comment,
  });

  // 5)
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Payment proof successfully uploaded by Auctioneer for Super Admin",
        comissionProof
      )
    );
});

export { calculateComission, proofOfComission };
