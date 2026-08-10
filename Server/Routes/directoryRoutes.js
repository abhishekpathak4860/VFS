// routes/directoryRoutes.js

import express from "express";

import {
  getDirectoryContent,
  createFolder,
  deleteFolder,
  renameFolder,
} from "../controllers/directoryController.js";

const router = express.Router();

router.get("/:id", getDirectoryContent);

router.post("/:foldername", createFolder);

router.delete("/:id", deleteFolder);

router.patch("/:id", renameFolder);

export default router;
