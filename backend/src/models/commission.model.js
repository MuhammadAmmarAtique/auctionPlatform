import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  amount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
{ timestamps: true }
);

export const Commission = mongoose.model("Commission", commissionSchema);
