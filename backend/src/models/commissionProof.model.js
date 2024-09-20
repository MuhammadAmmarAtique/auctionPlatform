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
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected", "Settled"],
  },
  amount: Number,
  comment: String,
},  
{ timestamps: true }
);

export const CommissionProof = mongoose.model("CommissionProof", commissionProofSchema);
