import Router from "express";
import { deleteAuctionItem, getAllPaymentProofs } from "../controllers/superAdmin.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/deleteAuctionItem/:auctionId")
  .delete(isAuthenticated, isAuthorized("Super Admin"), deleteAuctionItem);

router.get("/getAllPaymentProofs",isAuthenticated, isAuthorized("Super Admin"),getAllPaymentProofs)
  
export default router;
