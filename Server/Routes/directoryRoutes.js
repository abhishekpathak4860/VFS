import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET directory content
router.get("/:id", async (req, res, next) => {
  try {
    let folderId;

    const { db } = req;
    const { id } = req.params;
    const { uid } = req.cookies;

    if (!id) {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(uid) });

      folderId = user.rootDirId;
    } else {
      folderId = new ObjectId(id);
    }

    const folders = await db
      .collection("directories")
      .find({ parentDir: folderId })
      .toArray();

    const files = await db
      .collection("files")
      .find({ parentDir: folderId })
      .toArray();

    res.json({
      id: folderId.toString(),
      folders,
      files,
    });
  } catch (err) {
    next(err);
  }
});

// CREATE FOLDER
router.post("/:foldername", async (req, res, next) => {
  try {
    const { db } = req;
    const { foldername } = req.params;
    const { uid } = req.cookies;

    const parentDirId = req.headers.parentdirid;

    const newFolder = await db.collection("directories").insertOne({
      name: foldername,
      parentDir: parentDirId ? new ObjectId(parentDirId) : null,
      ownerId: new ObjectId(uid),
      type: "folder",
    });

    res.status(201).json({
      message: "Folder Created Successfully!",
      folderId: newFolder.insertedId,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE FOLDER
router.delete("/:id", async (req, res, next) => {
  try {
    const { db } = req;
    const { id } = req.params;

    await db.collection("directories").deleteOne({ _id: new ObjectId(id) });

    await db.collection("directories").deleteMany({
      parentDir: new ObjectId(id),
    });

    await db.collection("files").deleteMany({
      parentDir: new ObjectId(id),
    });

    res.json({ message: "folder deleted" });
  } catch (err) {
    next(err);
  }
});

// RENAME FOLDER
router.patch("/:id", async (req, res, next) => {
  try {
    const { db } = req;
    const { id } = req.params;

    await db.collection("directories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: req.body.newFolderName,
        },
      },
    );

    res.json({ message: "Folder Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
