import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApiError } from "../utlis/ApiError.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// generateAccessAndRefreshToken method will be used for registration,login & refreshing access token.
const generateAccessandRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const AccessToken = await user.generateAccessToken();
  const RefreshToken = await user.generateRefreshToken();
  user.refreshToken = RefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    AccessToken,
    RefreshToken,
  };
};

//cookies options to be used in registration,login,logout,refreshAcessToken & deleteUser.
const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  // 1) take username,email, password,address, phone number,role (all required fields + add checks so user must give them)
  // 2) using username and email check if user already exists or not
  // 3) take profile image, add two checks a) if user give it or not b)if it's an image file or not
  // 4) upload profile image in cloudinary
  // 5) add a check for auctioneer(user) so that it must give all 3 payments methods.
  // 6) create user
  // 7) create refresh & access token for user
  // 8) return response with cookies

  // 1)
  const {
    username,
    email,
    password,
    address,
    phoneNumber,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (
    !username?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !address?.trim() ||
    !phoneNumber?.trim() ||
    !role?.trim()
  ) {
    throw new ApiError(
      400,
      "Must enter all form fields which are required for registration!"
    );
  }

  // 2)
  const existedUser = await User.findOne({email});
  if (existedUser) {
    throw new ApiError(400, "User with same email already exists!");
  }

  // 3)
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "Profile image is must required for registration");
  }
  let profileImg = req.files.profileImg;

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedMimeTypes.includes(profileImg.mimetype)) {
    throw new ApiError(
      400,
      "Only thses image files (JPEG, PNG, GIF) for profile image are allowed."
    );
  }
  // 4)
  const uploadedProfileImg = await uploadOnCloudinary(profileImg.tempFilePath);

  if (!uploadedProfileImg) {
    throw new ApiError(
      500,
      "Problem during uloading Profile image in Cloudinary during registration!"
    );
  }

  // 5)
  if (role === "Auctioneer") {
    // a)
    if (
      !bankAccountNumber?.trim() ||
      !bankAccountName?.trim() ||
      !bankName?.trim()
    ) {
      res
        .status(400)
        .json(
          new ApiError(
            400,
            "Must give all payment details related to bank for registration!"
          )
        );
    }
    // b)
    if (!easypaisaAccountNumber?.trim()) {
      res
        .status(400)
        .json(
          new ApiError(
            400,
            "Must provide your easypaisa account number for registration!"
          )
        );
    }
    // c)
    if (!paypalEmail?.trim()) {
      res
        .status(400)
        .json(
          new ApiError(400, "Must provide your paypal email for registration!")
        );
    }
  }

  // 6)
  const user = await User.create({
    username,
    email,
    password,
    address,
    phoneNumber,
    role,
    profileImage: {
      publicId: uploadedProfileImg.public_id,
      url: uploadedProfileImg.url,
    },
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      easypaisa: {
        easypaisaAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });

  if (!user) {
    throw new ApiError(
      500,
      "Problem during database entry of registered User!"
    );
  }

  // 7)
  const { AccessToken, RefreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  // 8)
  res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(new ApiResponse(200, "User registered Successfully!", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(
      400,
      "Both email & password fields are required for login!"
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found! or Incorrect Email!");
  }

  const correctPassword = await user.verifyPassword(password);
  if (correctPassword === false) {
    throw new ApiError(400, "Incorrect Password! Enter Again!");
  }

  const { AccessToken, RefreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(new ApiResponse(200, "User login successful!", user));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: "" },
    },
    { new: true }
  );
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out Successfully", updatedUser));
});

const getUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetch User!", req.user));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;
  if (!userRefreshToken) {
    throw new ApiError(400, "unauthorized request");
  }

  const decodedInfo = jwt.verify(
    userRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (Object.values(decodedInfo).length === 0) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const { AccessToken, RefreshToken } = await generateAccessandRefreshToken(
    decodedInfo._id
  );

  res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("refreshToken", RefreshToken, options)
    .json(new ApiResponse(200, "Successfully refreshed access cookie"));
});

const deleteUser = asyncHandler(async (req,res) => {
  await User.findByIdAndDelete(req.user._id)
  
  res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, "User deleted Successfully!"));
 
 })

const fetchLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaders = users.sort((a, b) => b.moneySpent - a.moneySpent);

  if (leaders.length === 0) {
    throw new ApiError(500,"No bidder has spend money on any auction or No leaders found" )
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Fetched leader board Successfully!", leaders));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  refreshAcessToken,
  deleteUser,
  fetchLeaderboard,
};
