import Router from "express";
import { deleteAuctionItem } from "../controllers/superAdmin.controller.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/deleteAuctionItem")
  .delete(isAuthenticated, isAuthorized("Super Admin"), deleteAuctionItem);

export default router;
