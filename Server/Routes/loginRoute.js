import express from "express";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { db } = req;
    const data = req.body;

    const foundUser = await db
      .collection("users")
      .findOne({ email: data.email });

    if (!foundUser) {
      return res
        .status(404)
        .json({ error: "user not exists", message: "user not exists" });
    }

    if (foundUser.password !== data.password) {
      return res.status(401).json({ message: "password not match" });
    }

    res.cookie("uid", foundUser._id.toString(), {
      httpOnly: true,
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000 * 24 * 7,
    });

    res.status(200).json({
      message: "user login successfully",
      rootId: foundUser.rootDirId,
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
