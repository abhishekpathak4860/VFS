// models/File.js

import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    extension: {
      type: String,
      required: true,
    },

    parentDir: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      default: "file",
    },
  },
  {
    timestamps: true,
  },
);

const File = mongoose.model("File", fileSchema);

export default File;
