// After every successful auction, whenever the "Auctioneer" sends commission money through any online transaction, they must submit commission proof/payment proof to the "Super Admin" as well.
import mongoose from "mongoose";

const commissionProofSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageProof: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
// Initially, when the auctioneer submits the commission proof, the status will be set to "Pending". 
// The Super Admin or their team will then review the proof. 
// If the proof is found to be fake, the status will change to "Rejected". 
// If the money is received in the bank account, the status will change to "Approved". 
// After that, the verifyCommissionCron job will automatically check the commission amount. 
// If the amount is accurate, the status will be updated to "Settled".
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Rejected", "Approved", "Settled"],
  },
  amount: Number,
  comment: String,
},  
{ timestamps: true }
);

export const CommissionProof = mongoose.model("CommissionProof", commissionProofSchema);
