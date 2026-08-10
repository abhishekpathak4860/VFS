import Otp from "../models/Otp.js";
import { sendOtp } from "../utils/sendOtp.js";

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Call the utility function
    await sendOtp(email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("sendOtpController error:", error);
    return res.status(500).json({
      error: "Failed to send OTP email. Please try again later.",
    });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Find the OTP document in MongoDB
    const otpRecord = await Otp.findOne({ email: email.toLowerCase() });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    // Check if the provided OTP matches
    if (otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    // OTP verified successfully -> Delete it so it can't be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("verifyOtpController error:", error);
    return res.status(500).json({ error: "Server error during verification" });
  }
};
