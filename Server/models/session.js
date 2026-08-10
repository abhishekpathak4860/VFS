// models/User.js

import mongoose, { Schema } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7,
    },
  },
  {
    strict: "throw",
  },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
