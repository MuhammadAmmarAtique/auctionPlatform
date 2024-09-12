import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: [3, "minimum length of username must be three!"],
      maxLength: [10, "maximum length of username cannot be greater then ten!"],
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
      minLength: [8, "minimum length of password must be eight!"],
      select: false,
    },
    address: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      trim: true,
      minLength: [11, "minimum length of phone number must be eleven!"],
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
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber: String,
        bankAccountName: String,
        bankName: String,
      },
      easypaisa: {
        easypaisaAccountNumber: Number,
      },
      paypal: {
        paypalEmail: String,
      },
    },
    unpaidCommission: {
      type: Number,
      default: 0,
    },
    auctionWon: {
      type: Number,
      default: 0,
    },
    moneyWon: {
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
