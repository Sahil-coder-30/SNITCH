import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import otpModel from "../models/otp.model.js";
import blacklistModel from "../models/blacklist.model.js";
import { config } from "../config/config.js";

export const authRegisterController = async (req, res, next) => {
  try {
    const { username, email, password, contact, role } = req.body;

    const userAlreadyExists = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    console.log(userAlreadyExists);

    if (userAlreadyExists) {
      return res.status(400).json({
        message: "User with the given email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      contact,
      role,
    });

    const emailVerificationToken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role : newUser.role,
      },
      config.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `http://localhost:3000/api/auth/verify-email/${emailVerificationToken}`;

    await sendEmail({
      to: newUser.email,
      subject: "SNITCH — Verify Email",
      text: `SNITCH SYSTEM // REGISTRATION\n\nVERIFY LINK: ${verificationLink}\nEXPIRES: 24 HOURS\n\nWELCOME TO THE ARENA.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SNITCH</title>
</head>
<body style="margin:0;padding:0;background-color:#0C0C0C;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0C0C;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-top:3px solid #D4AF7A;">

        <!-- Header -->
        <tr><td style="padding:40px 48px 28px;border-bottom:1px solid #1E1E1E;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;letter-spacing:0.12em;color:#D4AF7A;">SNITCH</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.35em;color:#D4AF7A;font-family:Arial,sans-serif;text-transform:uppercase;">Welcome</p>
          <h1 style="margin:0 0 24px;font-size:32px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.1;">Verify Your<br>Email</h1>
          <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;font-family:Arial,sans-serif;">Hi ${newUser.username}, welcome to SNITCH. Click the button below to verify your email address and activate your account.</p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#D4AF7A;">
              <a href="${verificationLink}" style="display:inline-block;padding:16px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#000000;text-decoration:none;">Verify Email</a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;font-family:Arial,sans-serif;">This link expires in <strong style="color:rgba(255,255,255,0.55);">24 hours</strong>. If you didn't create an account, you can safely ignore this email.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;border-top:1px solid #1E1E1E;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);font-family:Arial,sans-serif;letter-spacing:0.05em;">&copy; ${new Date().getFullYear()} SNITCH &mdash; All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });

    res.status(201).json({
      message:
        "user registered successfully, please verify your email to activate your account",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Something went wrong while registering.";
    return next(error);
  }
};

export const authVerifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({
      message:
        "Email verified successfully, you can now log in to your account",
    });
  } catch (error) {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Something went wrong while verifying email.";
    return next(error);
  }
};

export const authLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(409).json({
        message: "user does not exist with this email...",
      });
    }
    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }
    if(!user.password){
      return res.status(403).json({
        message :"This account was created with Google. Please set a password first before logging in normally.",
        needsPassword : true,
        email : user.email,
      })
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(409).json({
        message: "You have entered the wrong password...",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role : user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: "user login successfully...",
    });
  } catch (err) {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
};

export const authCreatePassword = async (req , res, next)=>{
  const {email , password , confirmPass} = req.body;
  if(!email || !password || !confirmPass){
    return res.status(409).json({
      message : "All fields are required..."
    })
  }

  const user = await userModel.findOne({email : email}).select("+password");
  if(!user){
    return res.status(409).json({
      message : "user does not exist..."
    })
  }
  if(user.password){
    return res.status(409).json({
      message : "user have already created the password..."
    })
  }
  
  if(password != confirmPass){
    return res.status(409).json({
      message : "pass and conPass should be same..."
    })
  }

  // Skip same-password check — user has no password yet (Google OAuth flow)
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({
    message : "password created successfully you can login now...",
    user : {
      id : user._id,
      email : user.email,
    }
  })

};

export const authGoogleCallbackController = async (req, res, next) => {

  try {
    const user = req.user;

    if (!user) {
      return res.status(409).json({
        message: "There is the issue in signing in..."
      })
    }

    const email = user.emails[0].value;
    const verified = user.emails[0].verified;
    const Google_id = user.id;
    const username = user.displayName;
    const profilePic = user.photos[0].value;

    const alreadyUser = await userModel.findOne({ email });

    if (!alreadyUser) {
      const newUser = await userModel.create({
        username: username,
        email: email,
        googleId: Google_id,
        profilePicture: profilePic,
        verified: verified,
      })

      const token = jwt.sign({
        id : newUser._id,
        email : newUser.email,
        role : newUser.role,
      }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.redirect("http://localhost:5173/register");

    }

    if(!alreadyUser.googleId){
      alreadyUser.googleId = Google_id;
      alreadyUser.verified = true;
      await alreadyUser.save();
    }


    const token = jwt.sign({
      id : alreadyUser._id,
      email : alreadyUser.email,
      role : alreadyUser.role,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    
    res.cookie("token" , token , {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000*7, // 1 week
    })

    return res.redirect("http://localhost:5173/login");

  } catch (err) {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging in.";
    return next(err);
  }
};

export async function authGetMeController(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      return next(err);
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while fetching user data.";
    return next(err);
  }
}

export async function authVerifyOtpController(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const err = new Error("Email and OTP are required.");
      err.statusCode = 400;
      return next(err);
    }

    const storedOtpDoc = await otpModel.findOne({ email, type: 'email_verification' });
    const storedOtp = storedOtpDoc ? storedOtpDoc.otp : null;

    if (!storedOtp) {
      const err = new Error(
        "OTP expired or not found. Please request a new one.",
      );
      err.statusCode = 400;
      return next(err);
    }

    if (storedOtp != otp) {
      const err = new Error("Invalid OTP. Please try again.");
      err.statusCode = 401;
      return next(err);
    }

    // OTP is valid, mark user as verified
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      return next(err);
    }

    user.verified = true;
    await user.save();
    await otpModel.deleteMany({ email, type: 'email_verification' });

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong during OTP verification.";
    return next(err);
  }
}

export async function authLogoutController(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      const err = new Error("No active session found.");
      err.statusCode = 400;
      return next(err);
    }
    await blacklistModel.create({ token });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logout successful." });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while logging out.";
    return next(err);
  }
}

export async function authResendOtpController(req, res, next) {
  try {
    // ── 1. Validate body ───────────────────────────────────────────────────
    if (!req.body) {
      const err = new Error("Request body is missing.");
      err.statusCode = 400;
      return next(err);
    }

    const { email } = req.body;

    if (!email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      return next(err);
    }
    // ── 2. Find user ───────────────────────────────────────────────────────
    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }

    if (user.verified) {
      const err = new Error("This email is already verified. You can sign in.");
      err.statusCode = 400;
      return next(err);
    }

    // ── 3. Rate limiting — max 3 resends per 10 minutes ───────────────────
    const recentOtps = await otpModel.countDocuments({ email, type: 'email_verification' });

    if (recentOtps >= 3) {
      const err = new Error(
        "Too many OTP requests. Please wait 10 minutes before trying again.",
      );
      err.statusCode = 429;
      return next(err);
    }

    // ── 4. Delete old OTP and generate new one ─────────────────────────────
    await otpModel.deleteMany({ email, type: 'email_verification' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otpModel.create({ email, otp, type: 'email_verification' });

    // ── 5. Send branded email ──────────────────────────────────────────────
    await sendEmail({
      to: email,
      subject: "SNITCH — Verification Code",

      text: `SNITCH SYSTEM // VERIFICATION\n\nCODE: ${otp}\nEXPIRES: 5 MIN\n\nWELCOME TO THE ARENA.`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SNITCH Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0C0C0C;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0C0C;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-top:3px solid #D4AF7A;">

        <!-- Header -->
        <tr><td style="padding:40px 48px 28px;border-bottom:1px solid #1E1E1E;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;letter-spacing:0.12em;color:#D4AF7A;">SNITCH</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.35em;color:#D4AF7A;font-family:Arial,sans-serif;text-transform:uppercase;">Verification Code</p>
          <h1 style="margin:0 0 24px;font-size:32px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.1;">Your One-Time Code</h1>
          <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;font-family:Arial,sans-serif;">Use the code below to verify your identity. It expires in <strong style="color:rgba(255,255,255,0.85);">5 minutes</strong>.</p>

          <!-- OTP Box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#0C0C0C;border:1px solid #2A2A2A;padding:32px;text-align:center;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Verification Code</p>
              <p style="margin:0;font-size:48px;font-weight:bold;letter-spacing:0.25em;color:#D4AF7A;font-family:Georgia,serif;">${otp}</p>
            </td></tr>
          </table>

          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;font-family:Arial,sans-serif;">Do not share this code. If you didn't request this, you can safely ignore this email.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;border-top:1px solid #1E1E1E;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);font-family:Arial,sans-serif;letter-spacing:0.05em;">&copy; ${new Date().getFullYear()} SNITCH &mdash; All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return res.status(200).json({
      message: "New verification code sent to your email.",
      expiresIn: 300, // seconds
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while resending the code.";
    return next(err);
  }
}

export async function authForgetPasswordController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      const err = new Error("Email is required.");
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }

    if (user.verified === false) {
      const err = new Error(
        "Email not verified. Please verify your email before resetting password.",
      );
      err.statusCode = 403;
      return next(err);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otpModel.deleteMany({ email, type: 'password_reset' });
    await otpModel.create({ email, otp, type: 'password_reset' });

    const resetUrl = `http://localhost:5173/forgot-password?email=${encodeURIComponent(email)}&otp=${otp}`;

    await sendEmail({
      to: email,
      subject: "SNITCH — Password Reset",
      text: `SNITCH SYSTEM // RELOAD PROTOCOL\n\nCODE: ${otp}\nEXPIRES: 5 MIN\n\nRESET LINK: ${resetUrl}\n\nWELCOME TO THE ARENA.`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your SNITCH Password</title>
</head>
<body style="margin:0;padding:0;background-color:#0C0C0C;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0C0C0C;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border-top:3px solid #D4AF7A;">

        <!-- Header -->
        <tr><td style="padding:40px 48px 28px;border-bottom:1px solid #1E1E1E;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;letter-spacing:0.12em;color:#D4AF7A;">SNITCH</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 48px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.35em;color:#D4AF7A;font-family:Arial,sans-serif;text-transform:uppercase;">Password Reset</p>
          <h1 style="margin:0 0 24px;font-size:32px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.1;">Reset Your Password</h1>
          <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;font-family:Arial,sans-serif;">We received a request to reset the password for your account. Use the code below or click the button to set a new password. This expires in <strong style="color:rgba(255,255,255,0.85);">5 minutes</strong>.</p>

          <!-- OTP Box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#0C0C0C;border:1px solid #2A2A2A;padding:32px;text-align:center;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:Arial,sans-serif;">Reset Code</p>
              <p style="margin:0;font-size:48px;font-weight:bold;letter-spacing:0.25em;color:#D4AF7A;font-family:Georgia,serif;">${otp}</p>
            </td></tr>
          </table>

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
            <tr><td style="background:#D4AF7A;">
              <a href="${resetUrl}" style="display:inline-block;padding:16px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#000000;text-decoration:none;">Reset Password</a>
            </td></tr>
          </table>

          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;font-family:Arial,sans-serif;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 48px;border-top:1px solid #1E1E1E;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);font-family:Arial,sans-serif;letter-spacing:0.05em;">&copy; ${new Date().getFullYear()} SNITCH &mdash; All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return res.status(200).json({
      message: "Password reset OTP sent to your email successfully.",
      email,
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while sending reset code.";
    return next(err);
  }
}

export async function authResetPasswordController(req, res, next) {
  try {
    const { email, otp, password , confirmPass} = req.body;

    if (!email || !otp || !password || !confirmPass) {
      const err = new Error("Email, OTP and new password are required.");
      err.statusCode = 400;
      return next(err);
    }
    if(password != confirmPass){
      const err = new Error("Password and confirm password do not match.");
      err.statusCode = 400;
      return next(err);
    }

    const storedOtpDoc = await otpModel.findOne({ email, type: 'password_reset' });
    if (!storedOtpDoc || storedOtpDoc.otp != otp) {
      const err = new Error("Invalid or expired OTP.");
      err.statusCode = 400;
      return next(err);
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      const err = new Error("No account found with this email address.");
      err.statusCode = 404;
      return next(err);
    }


    if(user.verified === false) {
      const err = new Error(
        "Email not verified. Please verify your email before resetting password.",
      );
      err.statusCode = 403;
      return next(err);
    }

    // Only check same-password if user already has a password hash
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        const err = new Error("New password cannot be the same as the old password.");
        err.statusCode = 400;
        return next(err);
      }
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    
    await otpModel.deleteMany({ email, type: 'password_reset' });

    return res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message =
      err.message || "Something went wrong while resetting password.";
    return next(err);
  }
}

