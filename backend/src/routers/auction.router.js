import { Router } from "express";
import { addNewAuctionItem } from "../controllers/auction.controller.js";

const router = Router();
router.post("/add-new-auction-Item",addNewAuctionItem);

export default router;
