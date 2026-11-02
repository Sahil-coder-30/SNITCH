---
name: passport-google-auth
description: Blueprint and implementation guide for Passport.js Google OAuth 2.0 authentication with JWTs, HTTP-only cookies, and MongoDB/Mongoose.
---

# Passport.js Google OAuth 2.0 Authentication Skill

This skill provides an end-to-end guide and production-ready pattern to implement **Google OAuth 2.0** authentication using **Passport.js**, **Express**, **JWT (JSON Web Tokens)** stored in **HTTP-only cookies**, and **MongoDB/Mongoose**, along with **React frontend integration**.

---

## 1. Architecture & Flow Overview

```
[ Frontend (React) ] 
       │
       │ 1. Click "Sign in with Google" (window.location.href = /api/auth/google)
       ▼
[ Backend (Express + Passport) ] 
       │
       │ 2. Redirect to Google Accounts Consent Screen
       ▼
[ Google OAuth 2.0 Server ] 
       │
       │ 3. User authenticates & Google redirects with auth code
       ▼
[ Backend Callback (/api/auth/google/callback) ]
       │
       │ 4. Passport exchanges code for Google profile (id, email, name, avatar)
       │ 5. Upsert User in DB (link googleId if existing, or create new verified user)
       │ 6. Generate signed JWT token
       │ 7. Set token in HTTP-only, secure cookie
       │ 8. Redirect browser to Frontend (e.g., http://localhost:5173/login or /dashboard)
       ▼
[ Frontend (React) ]
       │
       │ 9. Dispatches `getMe()` / profile request with `withCredentials: true`
       ▼
[ Backend (identifyUser Middleware) ]
       │
       │ 10. Validates JWT from cookie, returns user session
```

---

## 2. Prerequisites & Dependencies

Install the required backend packages:

```bash
npm install passport passport-google-oauth20 jsonwebtoken cookie-parser mongoose bcryptjs dotenv cors
```

---

## 3. Environment Variables (`.env`)

Add the following environment variables:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_cloud_console
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

> **Google Cloud Console Setup:**
> 1. Go to [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
> 2. Create **OAuth 2.0 Client IDs** (Web application).
> 3. Add Authorized JavaScript origins: `http://localhost:3000`, `http://localhost:5173`.
> 4. Add Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`.

---

## 4. Backend Implementation

### Step 4.1: User Model (`src/models/user.model.js`)

Ensure the user schema supports optional passwords (when signing up via Google) and stores the `googleId`, `profilePicture`, and `verified` state.

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Required ONLY if the user is not registering via Google OAuth
      required: function () {
        return !this.googleId;
      },
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "BUYER", "SELLER"],
      default: "BUYER",
    },
    googleId: {
      type: String,
      sparse: true, // Allows null/unique index flexibility
    },
    profilePicture: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
```

---

### Step 4.2: Passport Configuration (`src/config/passport.js`)

Configure the `passport-google-oauth20` strategy. Keep the strategy callback simple by returning the Google `profile` payload to the route controller.

```javascript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Pass the extracted Google profile to the callback controller
      return done(null, profile);
    }
  )
);

export default passport;
```

---

### Step 4.3: Express App Setup (`src/app/app.js`)

Initialize Passport middleware and cookie parser in your Express application:

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "../config/passport.js";
import authRouter from "../routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS with credentials for cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Initialize Passport (session: false because we use JWTs)
app.use(passport.initialize());

// Mount Routes
app.use("/api/auth", authRouter);

export default app;
```

---

### Step 4.4: Auth Controller Callback & Handlers (`src/controllers/auth.controller.js`)

Handle Google callback profile extraction, account linking/upsertion, token generation, cookie dispatch, and password setup for Google-created accounts.

```javascript
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

/**
 * Handle Google OAuth Callback
 */
export const authGoogleCallbackController = async (req, res, next) => {
  try {
    const profile = req.user;

    if (!profile) {
      return res.status(400).redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=OAuthFailed`);
    }

    const email = profile.emails?.[0]?.value;
    const isEmailVerified = profile.emails?.[0]?.verified ?? true;
    const googleId = profile.id;
    const displayName = profile.displayName || profile.name?.givenName || email.split("@")[0];
    const profilePic = profile.photos?.[0]?.value || "";

    if (!email) {
      return res.status(400).redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=NoEmailProvided`);
    }

    // 1. Check if user already exists by email
    let user = await userModel.findOne({ email });

    if (!user) {
      // 2. Generate a unique username if conflict exists
      let username = displayName.replace(/\s+/g, "").toLowerCase();
      const existingUsername = await userModel.findOne({ username });
      if (existingUsername) {
        username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // 3. Create new user
      user = await userModel.create({
        username,
        email,
        googleId,
        profilePicture: profilePic,
        verified: isEmailVerified,
      });
    } else {
      // 4. Link Google ID if user registered with email previously
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.verified = true;
        isUpdated = true;
      }
      if (!user.profilePicture && profilePic) {
        user.profilePicture = profilePic;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Set HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Redirect back to frontend
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=ServerError`);
  }
};

/**
 * Get Current Logged-in User profile
 */
export const authGetMeController = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

/**
 * Set password for Google-authenticated users who want standard email/password login
 */
export const authCreatePassword = async (req, res, next) => {
  try {
    const { email, password, confirmPass } = req.body;
    if (!email || !password || !confirmPass) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPass) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.password) {
      return res.status(400).json({ message: "User already has a password set." });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Password created successfully. You can now log in with your password." });
  } catch (err) {
    next(err);
  }
};
```

---

### Step 4.5: Auth Routes (`src/routes/auth.routes.js`)

Define the trigger and callback endpoints using `passport.authenticate`:

```javascript
import express from "express";
import passport from "../config/passport.js";
import {
  authGoogleCallbackController,
  authGetMeController,
  authCreatePassword,
} from "../controllers/auth.controller.js";
import { identifyUser } from "../middleware/identifyUser.middleware.js";

const authRouter = express.Router();

// 1. Route to trigger Google Consent Screen
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 2. Google OAuth callback route
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=GoogleAuthFailed`,
  }),
  authGoogleCallbackController
);

// 3. User verification & password routes
authRouter.get("/get-me", identifyUser, authGetMeController);
authRouter.post("/set-password", authCreatePassword);

export default authRouter;
```

---

### Step 4.6: JWT Verification Middleware (`src/middleware/identifyUser.middleware.js`)

Verify the JWT sent in the HTTP-only cookie:

```javascript
import jwt from "jsonwebtoken";

export const identifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
```

---

## 5. Frontend (React) Integration

### Step 5.1: Triggering Google Login Button (`Login.jsx`)

Redirect the entire window to the backend OAuth trigger route (`/api/auth/google`):

```jsx
import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Direct browser redirect to backend OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="google-login-btn"
    >
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="currentColor"
          d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.08 0-9.24-4.2-9.24-9.36s4.16-9.36 9.24-9.36c2.88 0 4.8 1.2 5.88 2.28l2.6-2.52C19.44 1.16 16.24 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c7.2 0 12-5.08 12-12.2 0-.84-.08-1.48-.2-2.12h-11.8z"
        />
      </svg>
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
```

---

### Step 5.2: Hydrating Auth State on App Load

On app startup or after redirect back to the client, call the `/api/auth/get-me` endpoint with `credentials: "include"` / `withCredentials: true`:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // ALWAYS send cookies with requests
});

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/get-me");
  return response.data.user;
};
```

---

## 6. Key Security Checklist & Best Practices

| Best Practice | Implementation Note |
|---|---|
| **No Passwords on OAuth Accounts** | Set `password: { required: function() { return !this.googleId; } }` and `select: false`. |
| **HTTP-Only Cookies** | Prevents XSS attacks from reading the JWT token in JavaScript. |
| **SameSite: "lax"** | Allows cookie delivery on the top-level GET redirection from Google callback. |
| **HTTPS in Production** | Set `secure: process.env.NODE_ENV === "production"`. |
| **Account Merging by Email** | If a user signed up with email/password first, link `googleId` on first Google login without overwriting password. |
| **Sessionless Passport** | Use `session: false` in `passport.authenticate` since authentication is purely token/JWT driven. |
