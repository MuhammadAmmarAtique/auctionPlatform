import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { Auction } from "../models/auction.model.js";
import { Bid } from "../models/bid.model.js";
import mongoose from "mongoose";

export const placeBid = asyncHandler(async (req, res) => {
  // 1- find auction by id on which bid will be placed by user (Bidder)
  // 2- take amount (add check its not empty &  it must be greater then Auction starting bid + current bid)
  // 3- if bid is already placed by bidder then handling that case first by updating auction and bid object
  // 4- else placing new bid on auction by updating auction object &
  // 5- creating new bid object

  // 1)
  const { auctionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw new ApiError(400, "Invalid auction id");
  }
  const auction = await Auction.findById(auctionId);
  if (!auction) {
    throw new ApiError(
      400,
      "Incorrect auction id or Auction doesnot exists in database!"
    );
  }

  // 2)
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    throw new ApiError(400, "Must Enter valid amount for placing bid!");
  }

  if (amount <= auction.startingBid) {
    throw new ApiError(
      400,
      `Bid amount must be greater then Starting Bid i.e ${auction.startingBid} `
    );
  }

  if (auction.currentBid > 0 && amount <= auction.currentBid) {
    throw new ApiError(
      400,
      `Bid amount must be greater then Current Bid i.e ${auction.currentBid} `
    );
  }

  // 3)
  const existedBid = await Bid.findOne({
    "bidder.id": req.user._id,
  });

  if (existedBid) {
    // a) updating existed bid
    existedBid.amount = amount;
    await existedBid.save();

    // b) updating auction
    auction.currentBid = amount;
    auction.highestBidder = req.user._id;
    //finding existed bid inside auction and updating it
    const existedBidInAuctionObj = auction.bids.find(
      (bid) => bid.userId.equals(req.user._id) // Use .equals() to compare ObjectId values
    );
    existedBidInAuctionObj.amount = amount;
    await auction.save();

    res.status(200).json(
      new ApiResponse(
        200,
        "Successfully updated your bid on this Auction Item",
        {
          "Updated existedBid::: ": existedBid,
          "Updated Auction Item with your updated Bid::: ": auction,
        }
      )
    );
  } else {
    // 4)
    auction.currentBid = amount;
    auction.bids.push({
      userId: req.user._id,
      userName: req.user.username,
      profileImage: req.user.profileImage.url,
      amount: amount,
    });
    auction.highestBidder = req.user._id;
    await auction.save();

    // 5)
    const bid = await Bid.create({
      amount: amount,
      bidder: {
        id: req.user._id,
        userName: req.user.username,
        profileImage: req.user.profileImage.url,
      },
      auctionItem: auctionId,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        "Successfully placed your bid on this Auction Item",
        {
          "bid::: ": bid,
          "Updated Auction Item with newly Placed Bid::: ": auction,
        }
      )
    );
  }
});
