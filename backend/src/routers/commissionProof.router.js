import Router from "express";
import { calculateComission } from "../controllers/commissionProof.controller.js";
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

export default router;
