// models/Directory.js

import mongoose from "mongoose";

const directorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    parentDir: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
      default: null,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      default: "folder",
    },
  },
  {
    timestamps: true,
  },
);

const Directory = mongoose.model("Directory", directorySchema);

export default Directory;
