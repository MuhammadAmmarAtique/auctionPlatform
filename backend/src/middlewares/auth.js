import jwt from "jsonwebtoken";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "unAuthorized request");
    }

    let decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedInfo) {
      throw new ApiError(401, "Invalid token");
    }

    const user = await User.findById(decodedInfo._id);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "Invalid Token or Authorization failed", error);
  }
};

export { isAuthenticated };
