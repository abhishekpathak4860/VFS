// routes/authRoutes.js

import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  allDevicesLogout,
  loginwithGoogle,
  getMe,
} from "../controllers/authController.js";
import {
  sendOtpController,
  verifyOtpController,
} from "../controllers/otpController.js";
import checkAuth from "../auth.js";
import {
  githubCallback,
  startGithubLogin,
} from "../controllers/githubController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/logout-all-devices", allDevicesLogout);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/google", loginwithGoogle);
router.get("/user", checkAuth, getMe);
router.get("/auth/github", startGithubLogin);

router.get("/auth/github/callback", githubCallback);
export default router;
