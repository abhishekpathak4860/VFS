// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // creating index for email
    },

    password: {
      type: String,
      required: true,
    },

    rootDirId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
