import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("uid", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
