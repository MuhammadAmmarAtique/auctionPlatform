import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { Auction } from "../models/auction.model.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";

const addNewAuctionItem = asyncHandler(async (req, res) => {
  // 1) take all required text fields + add checks so that user must give them
  // 2) add checks related to auction start and end time
  // 3) take auction item pic + add check
  // 4) upload on cloudinary
  // 5) create object
  // 6) return response

  // 1)
  const {
    title,
    description,
    startingBid,
    category,
    condition,
    startTime,
    endTime,
  } = req.body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !startingBid?.trim() ||
    !category?.trim() ||
    !condition?.trim() ||
    !startTime?.trim() ||
    !endTime?.trim()
  ) {
    throw new ApiError(
      400,
      "Must enter all input fields required for adding new auction item"
    );
  }
  // 2)
  // a)
  if (new Date(startTime) < Date.now()) {
    throw new ApiError(
      400,
      "Auction start time must be greater then current time!"
    );
  }
  // b)
  if (new Date(startTime) > new Date(endTime)) {
    throw new ApiError(400, "Auction start time must be less then end time!");
  }
  // c)
  const existedAuction = await Auction.findOne({
    createdBy: req.user._id,
    endTime: { $gt: `${Date.now()}` },
  });

  if (existedAuction) {
    throw new ApiError(
      400,
      "You cannot create new auction until your first auction ends!"
    );
  }

  // 3)
  if (!req.files?.auctionItemImage) {
    throw new ApiError(400, "Must give image of an auction item!");
  }
  const auctionItemImage = req.files.auctionItemImage;

  // 4)
  const uploadedAuctionItemImage = await uploadOnCloudinary(
    auctionItemImage.tempFilePath
  );

  if (!uploadedAuctionItemImage) {
    throw new ApiError(
      500,
      "Problem during uploading auction item image in cloudinary"
    );
  }

  // 5)
  const auctionItem = await Auction.create({
    title,
    description,
    startingBid,
    category,
    condition,
    startTime,
    endTime,
    createdBy: req.user._id,
    image: {
      public_id: uploadedAuctionItemImage.public_id,
      url: uploadedAuctionItemImage.url,
    },
  });

  if (!auctionItem) {
    throw new ApiError(
      500,
      "Problem during adding new auction item in database!"
    );
  }

  // 6)
  res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully added new Auction item!", auctionItem)
    );
});

export { addNewAuctionItem };
