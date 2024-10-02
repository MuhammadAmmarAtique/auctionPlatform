// This cron will run every min to look for those ended auctions who were successfully sold and whose comission is not calcualted yet, then calculating auctions "unpaid comission" & updating their database i.e auction, auctioneer(User) & highestBidder(User) objects fields & also sending email to highest bidder to let them as he has won the auction and asking him to do their payment.

import cron from "node-cron";
import { Auction } from "../models/auction.model.js";
import { User } from "../models/user.model.js";
import { Bid } from "../models/bid.model.js";
import { sendEmail } from "../utlis/nodemailer.js";

const auctionEnded = async () => {
  try {
    // console.log(`Cron for auctionEnded started...`); 
    const allEndedAuctions = await Auction.find({
      endTime: { $lt: new Date() },
      currentBid: { $gt: 0 },
      commissionCalculated: false,
    });

    if (allEndedAuctions.length > 0) {
      for (const auction of allEndedAuctions) {
        // a) updating auction
        const comission = auction.currentBid * 0.05; // 5 % of currentBid/highestBid
        auction.commissionCalculated = true;

        const highestBid = await Bid.findOne({
          amount: auction.currentBid,
          auctionItem: auction._id,
        });

        auction.highestBidder = highestBid.bidder.id;
        await auction.save();

        //  b) updating  auctioneer
        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommission = comission;
        await auctioneer.save();

        // c) updating highest Bidder
        const highestBidder = await User.findById(highestBid.bidder.id);
        highestBidder.auctionWon += 1;
        highestBidder.moneySpent += auction.currentBid;
        await highestBidder.save();

        // d) Sending email to highest Bidder as he/she has won the auction + asking him to pay amount he bided!
        const email = highestBidder.email;
        const subject = `Congratulations! You won the auction for ${auction.title}`;
        const message = `Dear ${highestBidder.username}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2. **Easypaise**:\n- You can send payment via Easypaise: ${auctioneer.paymentMethods.easypaisa.easypaisaAccountNumber}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed with in this week. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\ auctionPlatform Team`;

        await sendEmail({
          email,
          subject,
          message,
        });
      }
    }
    // console.log(`Cron for auctionEnded ended!`); 
  } catch (error) {
    console.log("Error in auctionEndedCron:::", error);
  }
};

export const auctionEndedCron = cron.schedule("* * * * * ", auctionEnded);
