import Router from "express";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
const router = Router();

router.route("/create-checkout-session").post(createCheckoutSession);

export default router;
