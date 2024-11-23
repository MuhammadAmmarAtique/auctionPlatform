import { asyncHandler } from "../utlis/asyncHandler.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_KEY);

// It is designed to handle requests from the frontend to set up a checkout payment session using Stripe.

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userUnpaidComission = req.body.Auctioneer_Unpaid_Comission;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: "Auctioneer Unpaid Commission",
          },
          unit_amount: userUnpaidComission * 100, // Converting PKR to paisas b/c Stripe works with the smallest currency unit
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/me", //ADDED FRONTEND URLS
    cancel_url: "http://localhost:5173/me",
  });
  res.json({ id: session.id });
});
