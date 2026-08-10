import { ObjectId } from "mongodb";
import User from "./models/User.js";
import crypto from "crypto";
import { secretKey } from "./controllers/authController.js";
import Session from "./models/session.js";
export default async function checkAuth(req, res, next) {
  try {
    const { token } = req.signedCookies;
    // console.log(token);

    if (!token) {
      res.clearCookie("token");
      return res.status(401).json({ error: "user not logged in" });
    }

    const session = await Session.findById(token);
    if (!session) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Session not found" });
    }
    const userId = session.userId;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(401).json({ error: "user not found" });
    }

    // attach user to request (very useful later)
    req.user = foundUser;

    next();
  } catch (err) {
    next(err);
  }
}
