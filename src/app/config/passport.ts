/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import envVars from "./env";
import User from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        // Check if email exists
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (!user) {
          // If not, create a new user
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user: any, done: (error: any, id?: unknown) => void) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
