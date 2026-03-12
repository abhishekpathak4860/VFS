import { ObjectId } from "mongodb";

export default async function checkAuth(req, res, next) {
  try {
    const { uid } = req.cookies;

    if (!uid) {
      return res.status(401).json({ error: "user not logged in" });
    }

    const { db } = req;

    const foundUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(uid) });

    if (!foundUser) {
      return res.status(401).json({ error: "user not logged in" });
    }

    // attach user to request (very useful later)
    req.user = foundUser;

    next();
  } catch (err) {
    next(err);
  }
}
