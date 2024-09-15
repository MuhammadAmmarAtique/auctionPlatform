import Router from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  refreshAcessToken,
  deleteUser,
  fetchLeaderboard,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/get-user").get(isAuthenticated, getUser);
router.route("/refreshAcessToken").post(refreshAcessToken);
router.route("/delete-user").delete(isAuthenticated, deleteUser);
router.route("/fetch-Leaderboard").get(fetchLeaderboard);

export default router;
