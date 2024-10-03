// There are 3 types of users: "Auctioneer", "Bidder", and "Super Admin"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { // storing full name here
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: [3, "Full Name must contain at least 3 characters."],
      maxLength: [40, "Full Name cannot exceed 40 characters."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: [8, "Minimum length of Password must be eight!"],
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      minLength: [11, "Minimum length of Phone Number must be eleven!"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Auctioneer", "Bidder", "Super Admin"],
      required: true,
    },
    profileImage: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    // The "Auctioneer" is required to provide payment methods
    paymentMethods: {
      bankTransfer: { 
        bankAccountNumber: String,
        bankAccountName: String,
        bankName: String,
      },
      easypaisa: {
        easypaisaAccountNumber: String,
      },
      paypal: {
        paypalEmail: String,
      },
    },
    // This field is only applicable to the "Auctioneer"
    unpaidCommission: {
      type: Number,
      default: 0,
    },
    // The following 2 fields are only applicable to the "Bidder"
    auctionWon: {
      type: Number,
      default: 0,
    },
    moneySpent: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.verifyPassword = async function (userEntereredPassword) {
  const response = await bcrypt.compare(userEntereredPassword, this.password);
  return response;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, username:this.username, email:this.email},
     process.env.ACCESS_TOKEN_SECRET, 
     {expiresIn: process.env.ACCESS_TOKEN_EXPIRY,});
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY, });
};

export const User = mongoose.model("User", userSchema);
