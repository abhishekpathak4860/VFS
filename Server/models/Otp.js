import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Document auto-deletes after 300 seconds (5 minutes)
    },
  },
  {
    timestamps: false, // Set to false since we explicitly defined createdAt
  },
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
