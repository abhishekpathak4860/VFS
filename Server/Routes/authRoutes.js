// routes/authRoutes.js

import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  allDevicesLogout,
} from "../controllers/authController.js";
import {
  sendOtpController,
  verifyOtpController,
} from "../controllers/otpController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/logout-all-devices", allDevicesLogout);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);

export default router;
