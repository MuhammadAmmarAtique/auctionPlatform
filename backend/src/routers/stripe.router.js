import Router from "express";
import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/stripe.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js"
const router = Router();

// Route for creating a checkout session
router.route("/create-checkout-session").post(isAuthenticated, isAuthorized("Auctioneer"), createCheckoutSession);
// Route for Stripe webhook (use express.raw for Stripe signature validation )
//  It Parses the incoming request body as raw JSON 
// Raw JSON looks like a plain text string, exactly as it is sent in the HTTP request body e.g {"name": "ammar"}
router.route('/webhook').post(express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
