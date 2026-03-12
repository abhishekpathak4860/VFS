import express from "express";
import { ObjectId } from "mongodb";
import { createWriteStream } from "fs";
import path from "path";
import fs from "fs";

const router = express.Router();

// SERVE FILE
router.get("/:id", async (req, res, next) => {
  try {
    const { db } = req;
    const { id } = req.params;

    const fileData = await db.collection("files").findOne({
      _id: new ObjectId(id),
    });

    if (!fileData) {
      return res.status(404).json({ message: "file not found" });
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
});

// UPLOAD FILE
router.post("/:filename", async (req, res, next) => {
  try {
    const { db } = req;
    const { uid } = req.cookies;
    const { filename } = req.params;

    const extension = path.extname(filename);
    const fileId = new ObjectId();

    const parentDirId = req.headers.parentdirid;

    const writeStream = createWriteStream(`./Storage/${fileId}${extension}`);

    req.pipe(writeStream);

    req.on("end", async () => {
      await db.collection("files").insertOne({
        _id: fileId,
        name: filename,
        extension: extension,
        parentDir: new ObjectId(parentDirId),
        ownerId: new ObjectId(uid),
        type: "file",
      });

      res.status(201).json({ message: "file uploaded" });
    });
  } catch (err) {
    next(err);
  }
});

// DELETE FILE
router.delete("/:id", async (req, res, next) => {
  try {
    const { db } = req;
    const { id } = req.params;

    const fileData = await db.collection("files").findOne({
      _id: new ObjectId(id),
    });

    if (!fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileName = `${id}${fileData.extension}`;

    await fs.promises.rm(`./Storage/${fileName}`);

    await db.collection("files").deleteOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({ message: "file deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// RENAME FILE
router.patch("/:id", async (req, res, next) => {
  try {
    const { db } = req;
    const { id } = req.params;

    await db.collection("files").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: req.body.newfilename,
        },
      },
    );

    res.status(200).json({ message: "Renamed" });
  } catch (err) {
    next(err);
  }
});

export default router;
