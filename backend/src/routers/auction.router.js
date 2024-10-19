import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js";
import { trackCommissionStatus } from "../middlewares/trackCommissionStatus.middleware.js";
import {
  addNewAuctionItem,
  getAllAuctionItems,
  getAuctionItemDetails,
  getUserAuctionItems,
  deleteAuctionItem,
  republishAuctionItem
} from "../controllers/auction.controller.js";

const router = Router();

router.post(
  "/add-new-auction-Item",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  trackCommissionStatus,
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
router.delete(
  "/deleteAuctionItem/:auctionItemId",
  isAuthenticated,
  isAuthorized("Auctioneer Super Admin"),
  deleteAuctionItem
);
router.put(
  "/republishAuctionItem/:auctionItemId",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  republishAuctionItem
);

export default router;
