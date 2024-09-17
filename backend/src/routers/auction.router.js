import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addNewAuctionItem,
  getAllAuctionItems,
} from "../controllers/auction.controller.js";

const router = Router();

router.post(
  "/add-new-auction-Item",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);

router.get("/get-All-Auction-Items", getAllAuctionItems);

export default router;
