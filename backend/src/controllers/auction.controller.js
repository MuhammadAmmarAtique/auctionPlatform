import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { Auction } from "../models/auction.model.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";
import mongoose from "mongoose";

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

const getAllAuctionItems = asyncHandler(async (req, res) => {
  const allAuctionItems = await Auction.find();

  if (allAuctionItems.length === 0) {
    throw new ApiError(500, "No auction item is present in database");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched all Auction Items!"));
});

const getAuctionItemDetails = asyncHandler(async (req, res) => {
  const { auctionItemId } = req.params;
  const auctionItemDetails = await Auction.findById({
    _id: new mongoose.Types.ObjectId(auctionItemId),
  });

  if (!auctionItemDetails) {
    throw new ApiError(500, "No auction itek found in database!");
  }
  const bidders = auctionItemDetails.bids.sort((a, b) => b.amount - a.amount);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched auction item details with its bidders in ascending order",
        { "auctionItemDetails:::": auctionItemDetails, "bidders:::": bidders }
      )
    );
});

const getUserAuctionItems = asyncHandler(async (req, res) => {
  const userAuctionItems = await Auction.find({
    createdBy: req.user._id,
  });

  if (userAuctionItems.length === 0) {
    throw new ApiError(
      400,
      "User/Auctioneer doesnot have any auctions listed!"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Successfully fetched all user Auction Items",
        userAuctionItems
      )
    );
});

const deleteAuctionItem = asyncHandler(async (req, res) => {
  const { auctionItemId } = req.params;
  const response = await Auction.findByIdAndDelete({
    _id: new mongoose.Types.ObjectId(auctionItemId),
  });

  if (!response) {
    throw new ApiError(
      400,
      "Auction item already deleted or not found in database b/c of wrong auctionId"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted User Auction item!"));
});

export {
  addNewAuctionItem,
  getAllAuctionItems,
  getAuctionItemDetails,
  getUserAuctionItems,
  deleteAuctionItem,
};
