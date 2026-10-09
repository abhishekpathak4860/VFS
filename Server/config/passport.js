import "dotenv/config";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          photos: profile.photos,
          accessToken,
        });
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
