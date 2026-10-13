// routes/authRoutes.js

import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  allDevicesLogout,
  loginwithGoogle,
  getMe,
  getAllUsers,
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
import {
  adminLogoutUser,
  adminManagerLogin,
} from "../controllers/adminAuthController.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

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
router.get("/users", checkAuth, authorizeRole("admin", "manager"), getAllUsers);

router.get("/auth/github/callback", githubCallback);
router.post("/admin-manager/login", adminManagerLogin);
router.post(
  "/users/:userId/logout",
  checkAuth,
  authorizeRole("admin"),
  adminLogoutUser,
);
export default router;
