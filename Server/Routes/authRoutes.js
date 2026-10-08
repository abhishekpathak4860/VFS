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

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.post("/logout-all-devices", allDevicesLogout);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/google", loginwithGoogle);
router.get("/user", checkAuth, getMe);

export default router;
