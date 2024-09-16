import jwt from "jsonwebtoken";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;
    if (!token) {
      next( new ApiError(401, "unauthorized request"))
    }

    let decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedInfo._id);
    if (!user) {
      next( new ApiError("Invalid access Token", 401))
    }

    req.user = user;
    next();
  } catch (error) {
    next( new ApiError(400, "User Authentication failed!", error))
  }
};

const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ApiError(403, `${req.user.role} is not allowed to access this resource!`)
      );
    }
    next();
  };
};

export { isAuthenticated, isAuthorized };
