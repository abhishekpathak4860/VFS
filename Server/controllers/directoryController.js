// controllers/directoryController.js

import mongoose from "mongoose";
import Directory from "../models/Directory.js";
import File from "../models/File.js";
import User from "../models/User.js";

// GET DIRECTORY CONTENT
export const getDirectoryContent = async (req, res, next) => {
  try {
    let folderId;

    const { id } = req.params;
    const user = req.user.founduser;
    // const { uid } = req.cookies;

    if (!id) {
      // const user = await User.findById(uid);

      folderId = user.rootDirId;
    } else {
      folderId = new mongoose.Types.ObjectId(id);
    }

    const folders = await Directory.find({
      parentDir: folderId,
    });

    const files = await File.find({
      parentDir: folderId,
    });

    res.json({
      id: folderId.toString(),
      folders,
      files,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE FOLDER
export const createFolder = async (req, res, next) => {
  try {
    const { foldername } = req.params;
    const { uid } = req.cookies;

    const parentDirId = req.headers.parentdirid;

    const newFolder = await Directory.create({
      name: foldername,

      parentDir: parentDirId ? new mongoose.Types.ObjectId(parentDirId) : null,

      ownerId: new mongoose.Types.ObjectId(uid),

      type: "folder",
    });

    res.status(201).json({
      message: "Folder Created Successfully!",
      folderId: newFolder._id,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE FOLDER
export const deleteFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Directory.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    await Directory.deleteMany({
      parentDir: new mongoose.Types.ObjectId(id),
    });

    await File.deleteMany({
      parentDir: new mongoose.Types.ObjectId(id),
    });

    res.json({
      message: "folder deleted",
    });
  } catch (err) {
    next(err);
  }
};

// RENAME FOLDER
export const renameFolder = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Directory.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          name: req.body.newFolderName,
        },
      },
    );

    res.json({
      message: "Folder Renamed Successfully",
    });
  } catch (err) {
    next(err);
  }
};
