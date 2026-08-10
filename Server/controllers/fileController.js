// controllers/fileController.js

import mongoose from "mongoose";
import { createWriteStream } from "fs";
import path from "path";
import fs from "fs";

import File from "../models/File.js";
import Session from "../models/session.js";

// SERVE FILE
export const serveFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fileData = await File.findById(id);

    if (!fileData) {
      return res.status(404).json({
        message: "file not found",
      });
    }

    const fullPath = path.join(
      process.cwd(),
      "Storage",
      `${id}${fileData.extension}`,
    );

    if (req.query.action === "download") {
      res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
    }

    res.sendFile(fullPath);
  } catch (err) {
    next(err);
  }
};

// UPLOAD FILE
export const uploadFile = async (req, res, next) => {
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
    const { filename } = req.params;

    const extension = path.extname(filename);

    const fileId = new mongoose.Types.ObjectId();

    const parentDirId = req.headers.parentdirid;

    const writeStream = createWriteStream(`./Storage/${fileId}${extension}`);

    req.pipe(writeStream);

    req.on("end", async () => {
      await File.create({
        _id: fileId,

        name: filename,

        extension,

        parentDir: new mongoose.Types.ObjectId(parentDirId),

        ownerId: new mongoose.Types.ObjectId(userId),

        type: "file",
      });

      res.status(201).json({
        message: "file uploaded",
      });
    });
  } catch (err) {
    next(err);
  }
};

// DELETE FILE
export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fileData = await File.findById(id);

    if (!fileData) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    const fileName = `${id}${fileData.extension}`;

    await fs.promises.rm(`./Storage/${fileName}`);

    await File.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    res.status(200).json({
      message: "file deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// RENAME FILE
export const renameFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    await File.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          name: req.body.newfilename,
        },
      },
    );

    res.status(200).json({
      message: "Renamed",
    });
  } catch (err) {
    next(err);
  }
};
