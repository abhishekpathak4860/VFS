import express from "express";
import { createWriteStream } from "fs";
import fs from "fs";
import { readdir, rename, open, rm, mkdir, writeFile } from "fs/promises";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
let filesData = JSON.parse(fs.readFileSync("./filesDB.json", "utf-8"));
let foldersData = JSON.parse(fs.readFileSync("./foldersDB.json", "utf-8"));
// console.log(filesData)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// // serving files
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);
  const extension = fileData.extension;
  if (req.query.action == "download") {
    res.set("Content-Disposition", `attachment; filename=${fileData.name}`);
  }

  const fullPath = path.join(__dirname, "..", "Storage", `${id}${extension}`);
  res.sendFile(fullPath);
});

//upload file
router.post("/:filename", (req, res) => {
  const { filename } = req.params;
  const FileExtension = path.extname(filename);
  const { parentdirid: parentDir } = req.headers; // send folder id in the headers or insert in the root folder if id is not present.
  //|| foldersData[0].id;
  const Id = crypto.randomUUID();
  const fileName = `${Id}${FileExtension}`;
  const writeStream = createWriteStream(`./Storage/${fileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    filesData.push({
      id: Id,
      extension: FileExtension,
      name: filename,
      parentDir,
      type: "file",
    });
    const folder = foldersData.find((folder) => folder.id == parentDir);
    if (folder) {
      folder.content.files.push(Id);
    }
    await writeFile("./filesDB.json", JSON.stringify(filesData)); //write file
    await writeFile("./foldersDB.json", JSON.stringify(foldersData)); //write folder
    res.json({ message: "file uploaded" });
  });
});

// delete file/folder
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id);
  if (!fileData) {
    return res.status(404).json({ error: "File not found" });
  }
  const { extension } = fileData;
  const fileName = `${id}${extension}`;

  try {
    await rm(`./Storage/${fileName}`, { recursive: true }); //remove from storage folder

    const folder = foldersData.find(
      (folder) => folder.id == fileData.parentDir
    ); // delete that file id fron the connected folder

    if (folder) {
      folder.content.files = folder.content.files.filter(
        (fileId) => fileId != id
      );
    }
    filesData = filesData.filter((fileId) => fileId.id != id); // remove from filesDbJson file
    // remove from filesDbJson file
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./foldersDB.json", JSON.stringify(foldersData));
    res.status(200).send("file deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// updating file/folder name
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  //const { oldfilename, newfilename } = req.body;
  const fileData = filesData.find((file) => file.id === id);
  fileData.name = req.body.newfilename;
  await writeFile("./filesDB.json", JSON.stringify(filesData));
  // if (req.params.path === undefined) {
  //   await rename(`./Storage/${oldfilename}`, `./Storage/${newfilename}`);
  //   res.json({ message: "Renamed" });
  // } else {
  //   const arr = req.params.path;
  //   const filepath = arr.join("/");
  //   await rename(
  //     `./Storage/${filepath}/${oldfilename}`,
  //     `./Storage/${filepath}/${newfilename}`
  //   );
  // }

  res.json({ message: "Renamed" });
});

export default router;
