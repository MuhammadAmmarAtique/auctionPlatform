import Router from "express";
import { proofOfComission } from "../controllers/commissionProof.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/proofOfComission",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfComission
)

export default router;
