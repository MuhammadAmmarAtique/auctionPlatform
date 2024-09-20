import Router from "express";
import { deleteAuctionItem, getAllPaymentProofs, getPaymentProofDetail } from "../controllers/superAdmin.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/deleteAuctionItem/:auctionId")
  .delete(isAuthenticated, isAuthorized("Super Admin"), deleteAuctionItem);

router.get("/getAllPaymentProofs",isAuthenticated, isAuthorized("Super Admin"),getAllPaymentProofs);
router.get("/getPaymentProofDetail/:paymentProofId",isAuthenticated, isAuthorized("Super Admin"),getPaymentProofDetail);
  
export default router;
