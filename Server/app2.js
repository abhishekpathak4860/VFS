import express from "express";
import cors from "cors";
import fileRoute from "./Routes/fileRoutes.js";
import folderRoute from "./Routes/directoryRoutes.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();
app.use(express.json());
//enable cors
app.get("/", (req, res) => {
  res.json("server is running");
});
app.use(
  cors({
    origin: [FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
//serving directory
app.use("/directory", folderRoute);
//upload folder
app.use("/folder/upload", folderRoute);

app.use("/file", fileRoute);

// app.listen(5000, () => {
//   console.log("Server started successfully");
// });
export default app;
