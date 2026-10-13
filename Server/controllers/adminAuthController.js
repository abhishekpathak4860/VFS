import mongoose from "mongoose";
import User from "../models/User.js";
import Session from "../models/session.js";

export const adminManagerLogin = async (req, res, next) => {
  try {
    const { role, passkey } = req.body;

    if (!["admin", "manager"].includes(role) || !passkey) {
      return res.status(400).json({
        message: "Valid role and passkey are required",
      });
    }

    const expectedPasskey =
      role === "admin"
        ? process.env.ADMIN_PASSKEY
        : process.env.MANAGER_PASSKEY;

    if (!expectedPasskey || passkey !== expectedPasskey) {
      return res.status(401).json({
        message: "Invalid role or passkey",
      });
    }

    const user = await User.findOne({ role }).sort({ createdAt: 1 });

    if (!user) {
      return res.status(404).json({
        message: `${role} account not found. Run your seed file first.`,
      });
    }
    const allSessions = await Session.find({
      userId: user._id,
    });
    // maximum  only 2 devices can login in
    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }

    const session = await Session.create({
      userId: user._id,
    });

    res.cookie("token", session._id, {
      signed: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: `${role} login successful`,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogoutUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "user") {
      return res.status(400).json({
        message: "Only normal user sessions can be terminated here",
      });
    }

    const result = await Session.deleteMany({
      userId: user._id,
    });

    return res.status(200).json({
      message: "User logged out successfully",
      sessionsDeleted: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};
