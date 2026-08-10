// controllers/authController.js

import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/User.js";
import Directory from "../models/Directory.js";
import { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Session from "../models/session.js";

export const secretKey = "my-secret-key";

// REGISTER
export const registerUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const data = req.body;

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const foundUser = await User.findOne({
      email: data.email,
    });

    if (foundUser) {
      return res.status(409).json({
        message: "user already exists",
      });
    }

    session.startTransaction();

    const rootDirectory = await Directory.create(
      [
        {
          name: "rootDirectory",

          parentDir: null,

          ownerId: null,

          type: "folder",
        },
      ],
      { session },
    );

    const rootDirId = rootDirectory[0]._id;

    const createdUser = await User.create(
      [
        {
          name: data.name,

          email: data.email,

          password: hashedPassword,

          rootDirId,
        },
      ],
      { session },
    );

    const userId = createdUser[0]._id;

    await Directory.updateOne(
      {
        _id: rootDirId,
      },
      {
        $set: {
          ownerId: userId,
        },
      },
      { session },
    );

    await session.commitTransaction();

    res.status(200).json({
      message: "user created successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    if (err.code == 11000) {
      if (err.keyValue.email) {
        res.status(409).json({
          message: "user already exists",
        });
      }
    } else {
      next(err);
    }
  } finally {
    session.endSession();
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const data = req.body;

    const foundUser = await User.findOne({
      email: data.email,
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "user not exists",
        message: "user not exists",
      });
    }
    // creating new hash
    const isValidPassword = await bcrypt.compare(
      data.password,
      foundUser.password,
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "password not match",
      });
    }

    const allSessions = await Session.find({
      userId: foundUser.id,
    });
    // maximum  only 2 devices can login in
    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }

    console.log(allSessions);
    const session = await Session.create({ userId: foundUser._id });
    const sid = session._id;

    // save to cookie ok
    res.cookie("token", sid, {
      signed: true,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      secure: process.env.NODE_ENV === "production",

      maxAge: 60 * 60 * 1000 * 24 * 7,
    });

    res.status(200).json({
      message: "user login successfully",

      rootId: foundUser.rootDirId,

      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  const { token } = req.signedCookies;
  // console.log(token);

  if (!token) {
    res.clearCookie("token");
    return res.status(401).json({ error: "user not logged in" });
  }

  const session = await Session.findById(token);
  if (!session) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Session not found" });
  }
  await Session.deleteOne(session._id);
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

export const allDevicesLogout = async (req, res) => {
  try {
    const { token } = req.signedCookies;

    if (!token) {
      res.clearCookie("token");
      return res.status(401).json({ error: "user not logged in" });
    }

    const session = await Session.findById(token);
    if (!session) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Session not found" });
    }

    const userId = session.userId;

    // Delete all sessions associated with this userId
    await Session.deleteMany({ userId });

    // Clear the auth cookie on the current client
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Match your login cookie configuration
      sameSite: "lax", // Match your login cookie configuration
    });

    return res.status(200).json({
      message: "Successfully logged out from all devices.",
    });
  } catch (error) {
    console.error("Error in allDevicesLogout:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
