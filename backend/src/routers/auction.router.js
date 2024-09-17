import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addNewAuctionItem,
  getAllAuctionItems,
  getAuctionItemDetails,
  getUserAuctionItems,
} from "../controllers/auction.controller.js";

const router = Router();

router.post(
  "/add-new-auction-Item",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);

router.get("/get-All-Auction-Items", getAllAuctionItems);
router.get(
  "/getAuctionItemDetails/:auctionItemId",
  isAuthenticated,
  getAuctionItemDetails
);
router.get(
  "/getuserAuctionItems",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getUserAuctionItems
);

export default router;
