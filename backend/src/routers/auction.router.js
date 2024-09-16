import { Router } from "express";
import { addNewAuctionItem } from "../controllers/auction.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = Router();
router.post(
  "/add-new-auction-Item",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);

export default router;
