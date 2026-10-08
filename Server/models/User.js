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
    },

    rootDirId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
    },
    picture: {
      type: String,
      default: "https://pngtree.com/so/user-profile-image",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
