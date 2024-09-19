import Router from "express";
import { placeBid } from "../controllers/bid.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/place-bid/:auctionId",isAuthenticated,isAuthorized("Bidder"), placeBid);

export default router;
