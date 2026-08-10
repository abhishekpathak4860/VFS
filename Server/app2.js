import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileRoute from "./routes/fileRoutes.js";
import folderRoute from "./routes/directoryRoutes.js";
import { secretKey } from "./controllers/authController.js";

import checkAuth from "./auth.js";
import authRoute from "./routes/authRoutes.js";

import { connectDB } from "./config/db.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const app = express();
app.use(express.json());
app.use(cookieParser(secretKey));
//enable cors
// app.get("/", (req, res) => {
//   res.json("server is running");
// });
app.use(
  cors({
    origin: [FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

try {
  await connectDB();
  // const db = await connectDB();
  // console.log("DB Connected Successfully");
  // app.use((req, res, next) => {
  //   req.db = db;
  //   next();
  // });

  //serving directory
  app.use("/directory", checkAuth, folderRoute);
  //upload folder
  app.use("/folder/upload", checkAuth, folderRoute);

  app.use("/file", checkAuth, fileRoute);

  app.use("/", authRoute);

  app.get("/", (req, res) => {
    res.set({
      "Set-Cookie": "name=abhi",
    });
    res.json("server is running");
  });

  // app.get(/^\/(\d+)$/, (req, res) => {
  //   console.log(req.params);
  //   res.json({ double: req.params[0] * 2 });
  // });

  // error handling with middleware
  app.use((err, req, res, next) => {
    res.status(500).json({ message: "something went wrong" });
  });
  app.listen(5000, () => {
    console.log("Server started successfully");
  });
} catch (err) {
  console.log("db not connected");
  console.log(err);
}
// export default app;
