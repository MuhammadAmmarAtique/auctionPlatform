import { Router } from "express";
import { addNewAuctionItem } from "../controllers/auction.controller.js";
import { isAuthenticated } from "../middlewares/auth.js"

const router = Router();
router.post("/add-new-auction-Item",isAuthenticated,addNewAuctionItem);

export default router;
