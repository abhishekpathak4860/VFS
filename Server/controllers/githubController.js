import crypto from "crypto";
import passport from "../config/passport.js";
import User from "../models/User.js";
import Directory from "../models/Directory.js";
import Session from "../models/session.js";

const frontendUrl = process.env.FRONTEND_URL;

const cookieOptions = {
  signed: true,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const startGithubLogin = (req, res, next) => {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
  });

  passport.authenticate("github", {
    scope: ["user:email"],
    state,
  })(req, res, next);
};

export const githubCallback = (req, res, next) => {
  const returnedState = req.query.state;
  const savedState = req.cookies?.github_oauth_state;

  res.clearCookie("github_oauth_state", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  if (!returnedState || !savedState || returnedState !== savedState) {
    return res.status(400).send("Invalid GitHub OAuth state");
  }

  passport.authenticate(
    "github",
    { session: false },
    async (error, profile) => {
      if (error || !profile) {
        return res.redirect(`${frontendUrl}/login?error=github`);
      }

      try {
        // Fetch verified email addresses from GitHub.
        const emailResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${profile.accessToken}`,
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );

        if (!emailResponse.ok) {
          throw new Error("Could not retrieve GitHub email");
        }

        const emails = await emailResponse.json();

        const primaryEmail = emails.find(
          (item) => item.primary && item.verified,
        );

        if (!primaryEmail) {
          return res.redirect(`${frontendUrl}/login?error=github_email`);
        }

        const email = primaryEmail.email.toLowerCase();

        let user = await User.findOne({ email });

        if (user && user.authProvider === "local") {
          // Do not silently link a password account to GitHub.
          return res.redirect(`${frontendUrl}/login?error=use_existing_login`);
        }

        if (!user) {
          const rootDirectory = await Directory.create({
            name: "rootDirectory",
            parentDir: null,
            ownerId: null,
            type: "folder",
          });

          try {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              picture: profile.photos?.[0]?.value || "",
              rootDirId: rootDirectory._id,
              authProvider: "github",
            });

            rootDirectory.ownerId = user._id;
            await rootDirectory.save();
          } catch (creationError) {
            await Directory.deleteOne({ _id: rootDirectory._id });
            throw creationError;
          }
        } else if (profile.photos?.[0]?.value) {
          user.picture = profile.photos[0].value;
          await user.save();
        }

        const allSessions = await Session.find({
          userId: user._id,
        });
        if (allSessions.length >= 2) {
          await allSessions[0].deleteOne();
        }

        const userSession = await Session.create({
          userId: user._id,
        });
        const sid = userSession._id;

        res.cookie("token", sid, cookieOptions);

        return res.redirect(`${frontendUrl}/${user.rootDirId}`);
      } catch (err) {
        console.error("GitHub login error:", err);
        return res.redirect(`${frontendUrl}/login?error=github`);
      }
    },
  )(req, res, next);
};
