import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.cookies.uid; // cookie set at login

  if (!uid) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { db } = req;
  const user = await db.collection("users").findOne({ _id: new ObjectId(uid) });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    name: user.name,
    email: user.email,
    id: user.id,
  });
});

export default router;
