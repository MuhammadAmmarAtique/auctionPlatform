import Router from "express";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js"
const router = Router();

router.route("/create-checkout-session").post(isAuthenticated, isAuthorized("Auctioneer"), createCheckoutSession);

export default router;
