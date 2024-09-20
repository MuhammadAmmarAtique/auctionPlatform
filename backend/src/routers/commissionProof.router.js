import Router from "express";
import { calculateComission, proofOfComission } from "../controllers/commissionProof.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/calculate-comission",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  calculateComission
);

router.post(
  "/proofOfComission",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfComission
)

export default router;
