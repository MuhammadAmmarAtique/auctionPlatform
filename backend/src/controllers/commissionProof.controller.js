import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { User } from "../models/user.model.js";
import { CommissionProof } from "../models/commissionProof.model.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";

export const proofOfComission = asyncHandler(async (req, res) => {
  // 0) add check whether auctioneer has to pay the comission or not (may be he already had paid)
  // 1) take amount + comment
  // 2) take payment proof image
  // 3) upload in clodinary
  // 4) create comission Proof / Payment Proof object
  // 5) return response

  // 0)
  const auctioneer = await User.findById(req.user._id);
  if (auctioneer.unpaidCommission === 0) {
    return res.status(200).json(new ApiResponse(200, "You don't have any unpaid commissions"))
  }

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