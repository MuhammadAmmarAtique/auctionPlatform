import Router from "express";
import {
  deleteAuctionItem,
  getAllPaymentProofs,
  getPaymentProofDetail,
  updatePaymentProof,
} from "../controllers/superAdmin.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.delete(
  "/deleteAuctionItem/:auctionId",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteAuctionItem
);

router.get(
  "/getAllPaymentProofs",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllPaymentProofs
);
router.get(
  "/getPaymentProofDetail/:paymentProofId",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getPaymentProofDetail
);

router.put(
  "/updatePaymentProof/:paymentProofId",
  isAuthenticated,
  isAuthorized("Super Admin"),
  updatePaymentProof
);

export default router;
