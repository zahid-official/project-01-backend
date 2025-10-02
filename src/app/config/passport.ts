/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import envVars from "./env";
import User from "../modules/user/user.model";
import { AccountStatus, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

// Configure google oauth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },

    // Verify callback
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

        // Check if user is verified
        if (user && !user?.isVerified) {
          return done(null, false, {
            message: `User is not verified. Please verify your email to proceed.`,
          });
        }

        // Check if user is blocked or inactive
        if (
          user &&
          (user?.accountStatus === AccountStatus.BLOCKED ||
            user?.accountStatus === AccountStatus.INACTIVE)
        ) {
          return done(null, false, {
            message: `User is ${user.accountStatus}. Please contact support for more information.`,
          });
        }

        // Check if user is deleted
        if (user && user?.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

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

// Configure local strategy for email and password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    // Verify callback
    async (email: string, password: string, done: any) => {
      try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        // Check if user is verified
        if (!user?.isVerified) {
          return done(null, false, {
            message: `User is not verified. Please verify your email to proceed.`,
          });
        }

        // Check if user is blocked or inactive
        if (
          user?.accountStatus === AccountStatus.BLOCKED ||
          user?.accountStatus === AccountStatus.INACTIVE
        ) {
          return done(null, false, {
            message: `User is ${user.accountStatus}. Please contact support for more information.`,
          });
        }

        // Check if user is deleted
        if (user?.isDeleted) {
          return done(null, false, {
            message: `User is deleted. Please contact support for more information.`,
          });
        }

        // Check user authentication method
        const googleAuthenticated = user?.auths?.some(
          (auth) => auth.provider === "google"
        );
        if (googleAuthenticated && !user?.password) {
          return done(null, false, {
            message:
              "Please log in with Google first and set a password to enable email login.",
          });
        }

        // Compare password with database stored password
        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password as string
        );
        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser(
  (user: any, done: (error: any, id?: unknown) => void) => {
    done(null, user._id);
  }
);

// Deserialize user
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
