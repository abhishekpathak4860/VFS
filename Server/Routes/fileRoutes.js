import express from "express";

import {
  serveFile,
  uploadFile,
  deleteFile,
  renameFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/:id", serveFile);

router.post("/:filename", uploadFile);

router.delete("/:id", deleteFile);

router.patch("/:id", renameFile);

export default router;
