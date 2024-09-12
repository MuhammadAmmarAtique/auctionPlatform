import { asyncHandler } from "../utlis/asyncHandler.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { ApiError } from "../utlis/ApiError.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1) take username,email, password, profile image (all required fields + add checks so user must give them)
  // 2) using username and email check if user already exists or not
  // 3) upload profile image in cloudinary
  // 4) take address, phone number, payments methods (unrequired fields) if user gives and create a db entry
  // 5) return response

  const {
    username,
    email,
    password,
    address,
    phoneNumber,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (!username?.trim() || !email?.trim() || !password?.trim()) {
    throw new ApiError(
      400,
      "username, email & password are must required for registration"
    );
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(400, "User with same email or Password already exists!");
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "Profile image is must required for registration");
  }
  let profileImg = req.files.profileImg;
  const uploadedProfileImg = await uploadOnCloudinary(profileImg.tempFilePath);

  if (!uploadedProfileImg) {
    throw new ApiError(
      500,
      "Problem during uloading Profile image in Cloudinary during registration!"
    );
  }

  const user = await User.create({
    username,
    email,
    password,
    profileImage: {
      publicId: uploadedProfileImg.public_id,
      url: uploadedProfileImg.url,
    },
  });

  if (!user) {
    throw new ApiError(
      500,
      "Problem during database entry of registered User!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User registered Successfully!", user));
});

export { registerUser };
