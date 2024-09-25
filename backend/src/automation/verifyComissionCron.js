// This cron job runs every minute to scan the database for commission proofs that have been approved by the "Super Admin" or their team.
// It handles the following scenarios for auctioneer payments:
// 1) The unpaid commission matches the submitted amount (exact payment).
// 2) The unpaid commission is higher than the submitted amount (partial payment).
// 3) The unpaid commission is lower than the submitted amount (overpayment).
// Based on these conditions, the job updates the auctioneer's account and commission status in the database.
// Additionally, it creates a new "Commission" object in the database to log the transaction.

import cron from "node-cron";
import { CommissionProof } from "../models/commissionProof.model.js";
import { Commission } from "../models/commission.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utlis/nodemailer.js";

const verifyComission = async () => {
  try {
    const allApprovedComissionProofs = await CommissionProof.find({
      status: "Approved",
    });

    if (allApprovedComissionProofs.length > 0) {
      for (const comissionproof of allApprovedComissionProofs) {
        const auctioneer = await User.findById(comissionproof.userId);

        // 1)
        if (auctioneer.unpaidCommission === comissionproof.amount) {
          auctioneer.unpaidCommission = 0;
          await auctioneer.save();

          await sendEmail({
            email: auctioneer.email,
            subject: "Commission Payment Fully Settled",
            message: `Dear ${auctioneer.username},\n\nWe have received the full amount of your unpaid commission. Your account is now fully settled, and you can add new auctions.\n\nBest regards,\nYour Auction Platform Team`,
          });

          comissionproof.status = "Settled";
          await comissionproof.save();
        }

        // 2)
        if (auctioneer.unpaidCommission > comissionproof.amount) {
          auctioneer.unpaidCommission -= comissionproof.amount;
          await auctioneer.save();

          await sendEmail({
            email: auctioneer.email,
            subject: "Commission Payment Review",
            message: `Dear ${auctioneer.username},\n\nThank you for submitting your commission payment. We have deducted the amount you paid from your unpaid commission. However, you still owe ${auctioneer.unpaidCommission} in unpaid commissions. Please settle the remaining balance to continue adding new auctions.\n\nBest regards,\nYour Auction Platform Team`,
          });
        }

        // 3)
        if (auctioneer.unpaidCommission < comissionproof.amount) {
          const overpaidAmount =
            comissionproof.amount - auctioneer.unpaidCommission;
          auctioneer.unpaidCommission = 0;
          await auctioneer.save();

          await sendEmail({
            email: auctioneer.email,
            subject: "Overpayment of Commission",
            message: `Dear ${auctioneer.username},\n\nWe have received your commission payment. It appears you overpaid by ${overpaidAmount}. Your unpaid commission is now fully settled, and we will refund the excess amount to your account. You can now add new auctions.\n\nBest regards,\nYour Auction Platform Team`,
          });

          comissionproof.status = "Settled";
          await comissionproof.save();
        }

        // Doing entry of all "approved/valid" payments in database, so that we can know how much "Super Admin" is making money
        await Commission.create({
          amount: comissionproof.amount,
          user: comissionproof.user,
        });
      }
    }
  } catch (error) {
    console.log("Error in verifyComissionCron:::", error);
  }
};

export const verifyComissionCron = cron.schedule("* * * * *", verifyComission);
