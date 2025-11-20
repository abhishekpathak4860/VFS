import express from "express";
import cors from "cors";
import fileRoute from "./Routes/fileRoutes.js";
import folderRoute from "./Routes/directoryRoutes.js";

const app = express();
app.use(express.json());
//enable cors
app.use(cors());
//serving directory
app.use("/directory", folderRoute);
//upload folder
app.use("/folder/upload", folderRoute);

app.use("/file", fileRoute);

app.listen(5000, () => {
  console.log("Server started successfully");
});
