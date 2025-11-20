import express from "express";
import { createWriteStream } from "fs";
import fs from "fs";
import { readdir, rename, open, rm, mkdir, writeFile } from "fs/promises";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
let filesData = JSON.parse(fs.readFileSync("./filesDB.json", "utf-8"));
let foldersData = JSON.parse(fs.readFileSync("./foldersDB.json", "utf-8"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

//serving directories
router.get("/{:id}", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      const directoryData = foldersData[0]; // serving directory from root folder
      const files = directoryData.content.files.map((fileId) => {
        return filesData.find((file) => file.id === fileId);
      });
      const folder = directoryData.content.directories.map((folderId) => {
        return foldersData.find((Fid) => Fid.id == folderId);
      });
      res.json({ ...directoryData, files, folder });
    } else {
      const directoryData = foldersData.find((folder) => folder.id === id);
      const files = directoryData.content.files.map((fileId) => {
        return filesData.find((file) => file.id === fileId);
      });
      const folder = directoryData.content.directories.map((folderId) => {
        return foldersData.find((fid) => fid.id == folderId);
      });
      res.json({ ...directoryData, files, folder });
    }
  } catch (err) {
    console.log(err);
  }
});

//upload folder
router.post("/:foldername", async (req, res) => {
  try {
    // await mkdir(newDirPath, { recursive: true });
    // res.status(200).json({ message: "Folder Created Successfully!" });
    const { foldername } = req.params;

    const { parentdirid: parentDir } = req.headers;

    const Id = crypto.randomUUID();

    // await mkdir(newDirPath, { recursive: true }); // create directory
    // now create the new directory object

    foldersData.push({
      id: Id,
      name: foldername,
      parentDir: parentDir,
      content: { files: [], directories: [] },
    });
    const folder = foldersData.find((folder) => folder.id == parentDir); // get parent folder directory to insert the child directory id ok

    //now add the child directory id

    if (folder) {
      folder.content.directories.push(Id);
    }

    await writeFile("./foldersDB.json", JSON.stringify(foldersData));

    res.status(200).json({ message: "Folder Created Successfully!" });
  } catch (error) {
    res.send({ message: "Folder is not uploaded" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { parentdirid: parentDir } = req.headers;
    foldersData = foldersData.filter((folder) => folder.id != id); // filter out deleted folder
    const folder = foldersData.find((folder) => folder.id == parentDir); //get parent folder

    if (folder) {
      // remove child folder from parent folder
      folder.content.directories = folder.content.directories.filter(
        (folderId) => folderId != id
      );
    }
    filesData = filesData.filter((files) => files.parentDir != id);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    res.json({ message: "folder deleted" });
  } catch (err) {
    res.send({ message: "Folder is not deleted" });
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const folderData = foldersData.find((folder) => folder.id === id);
  folderData.name = req.body.newFolderName;
  await writeFile("./foldersDB.json", JSON.stringify(foldersData));
  res.json({ message: "Folder Renamed Successfully" });
});
export default router;
