import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema({
  amount: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true }
);

export const Commission = mongoose.model("Commission", commissionSchema);
