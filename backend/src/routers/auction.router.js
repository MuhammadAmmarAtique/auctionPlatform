import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addNewAuctionItem,
  getAllAuctionItems,
  getAuctionItemDetails
} from "../controllers/auction.controller.js";

const router = Router();

router.post(
  "/add-new-auction-Item",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);

router.get("/get-All-Auction-Items", getAllAuctionItems);
router.get("/getAuctionItemDetails/:auctionItemId",isAuthenticated,  getAuctionItemDetails);

export default router;
