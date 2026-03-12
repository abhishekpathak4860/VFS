import express from "express";
import fs from "fs";
import { writeFile } from "fs/promises";
let userData = JSON.parse(fs.readFileSync("./usersDB.json", "utf-8"));
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { db } = req;
    const data = req.body;

    const foundUser = userData.find((user) => user.email == data.email);
    if (foundUser) {
      return res
        .status(409)
        .json({ error: "user already exists", message: "user already exists" });
    }
    const userRootDir = await db.collection("directories").insertOne({
      // create root folder
      name: "rootDirctory",
      parentDir: null,
      type: "folder",
    });
    const rootDirId = userRootDir.insertedId;

    const createdUser = await db.collection("users").insertOne({
      name: data?.name,
      email: data?.email,
      password: data?.password,
      rootDirId: rootDirId,
    });
    const userId = createdUser.insertedId;

    await db
      .collection("directories")
      .updateOne({ _id: rootDirId }, { $set: { ownerId: userId } });

    res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
