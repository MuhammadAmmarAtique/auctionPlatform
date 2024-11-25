import { asyncHandler } from "../utlis/asyncHandler.js";
import { User } from "../models/user.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.SECRET_KEY);

// This controller is designed to handle requests from the frontend to set up a checkout payment session using Stripe.

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userUnpaidComission = req.body.Auctioneer_Unpaid_Comission;
  const userId = req.user._id.toString();

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
    metadata: { userId }, // Passing user ID for below webhook processing
  });
  res.json({ id: session.id });
});

// This controller will Handles incoming requests from Stripe CLI for successful "unpaidCommission" payments by 
// "Auctioneer" to update the auctioneer's database accordingly.

export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"]; //The Stripe signature to verify the request is genuine or not
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body passed to req.body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Getting user ID which is passed in `metadata` during above checkout session creation
    const userId = session.metadata.userId;

    if (userId) {
      // Update the user's unpaidCommission to 0 in the database
      await User.findByIdAndUpdate(userId, { unpaidCommission: 0 });

      console.log(`Unpaid commission updated to 0 for user: ${userId}`);
    }
  }

  res.status(200).json({ received: true });
});

// To get request from stripe upon successfull payment add below line in windows command prompt.
// Stripe CLI is used for locat host not for Production.
// stripe listen --forward-to http://localhost:3000/api/v1/stripe/webhook
