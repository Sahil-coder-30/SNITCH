const fs = require('fs');
const file = './src/controllers/auth.controller.js';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the newly added functions
const getMeIndex = content.indexOf('export async function authGetMeController');

if (getMeIndex !== -1) {
  // Add imports at the top
  if (!content.includes('otpModel')) {
    content = content.replace('import { sendEmail } from "../services/mail.service.js";', 'import { sendEmail } from "../services/mail.service.js";\nimport otpModel from "../models/otp.model.js";\nimport blacklistModel from "../models/blacklist.model.js";');
  }

  // Keep original code up to this index
  const header = content.substring(0, getMeIndex);

  const newControllers = `
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
    err.message = err.message || "Something went wrong while fetching user data.";
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

    const storedOtp = await otpModel.findOne({ email, type: 'email_verification' });
    if (!storedOtp) {
      const err = new Error("OTP expired or not found. Please request a new one.");
      err.statusCode = 400;
      return next(err);
    }

    if (storedOtp.otp !== otp) {
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
    err.message = err.message || "Something went wrong during OTP verification.";
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
    
    // Add token to MongoDB blacklist
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

    // Rate Limiting (Using OTP records count instead of Redis)
    const recentOtps = await otpModel.countDocuments({ email, type: 'email_verification' });
    if (recentOtps >= 3) {
      const err = new Error("Too many OTP requests. Please wait a few minutes before trying again.");
      err.statusCode = 429;
      return next(err);
    }

    // Delete old OTP and generate new one
    await otpModel.deleteMany({ email, type: 'email_verification' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otpModel.create({ email, otp, type: 'email_verification' });

    // Send SNITCH branded email
    await sendEmail({
      to: email,
      subject: "New verification code — SNITCH",
      text: \`SNITCH — Welcome to the arena!\\n\\nHey \${user.username || "there"},\\n\\nYour new verification code is:\\n\\n  \${otp}\\n\\nThis code expires in 5 minutes.\\n\\n— The SNITCH Team\`.trim(),
      html: \`<div style="font-family: sans-serif; padding: 20px;">
        <h2>Verify your SNITCH account</h2>
        <p>Hey \${user.username || "there"},</p>
        <p>Your new verification code is:</p>
        <h1 style="color: #667eea; letter-spacing: 5px;">\${otp}</h1>
        <p>This code expires in 5 minutes.</p>
        <p>— The SNITCH Team</p>
      </div>\`
    });

    return res.status(200).json({
      message: "New verification code sent to your email.",
      expiresIn: 300,
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while resending the code.";
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
      const err = new Error("Email not verified. Please verify your email before resetting password.");
      err.statusCode = 403;
      return next(err);
    }

    // Delete old and generate new
    await otpModel.deleteMany({ email, type: 'password_reset' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await otpModel.create({ email, otp, type: 'password_reset' });

    const resetUrl = \`http://localhost:5173/forgot-password?email=\${encodeURIComponent(email)}&otp=\${otp}\`;

    await sendEmail({
      to: email,
      subject: "Password Reset Code — SNITCH",
      text: \`SNITCH\\n\\nHey \${user.username || "there"},\\n\\nYour password reset code is: \${otp}\\n\\nOr click here to reset: \${resetUrl}\\n\\nThis code expires in 5 minutes.\\n\\n— The SNITCH Team\`.trim(),
      html: \`<div style="font-family: sans-serif; padding: 20px;">
        <h2>Reset your SNITCH password</h2>
        <p>Hey \${user.username || "there"},</p>
        <p>Your password reset code is:</p>
        <h1 style="color: #667eea; letter-spacing: 5px;">\${otp}</h1>
        <p>Or <a href="\${resetUrl}">click here to reset your password</a></p>
        <p>This code expires in 5 minutes.</p>
        <p>— The SNITCH Team</p>
      </div>\`
    });

    return res.status(200).json({
      message: "Password reset OTP sent to your email successfully.",
      email,
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while sending reset code.";
    return next(err);
  }
}

export async function authResetPasswordController(req, res, next) {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      const err = new Error("Email, OTP and new password are required.");
      err.statusCode = 400;
      return next(err);
    }

    const storedOtp = await otpModel.findOne({ email, type: 'password_reset' });
    if (!storedOtp || storedOtp.otp !== otp) {
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

    if (user.verified === false) {
      const err = new Error("Email not verified. Please verify your email before resetting password.");
      err.statusCode = 403;
      return next(err);
    }

    // Handle standard users vs google users
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        const err = new Error("New password cannot be the same as the old password.");
        err.statusCode = 400;
        return next(err);
      }
    }

    // Hash the new password before saving it to the DB!
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    
    await otpModel.deleteMany({ email, type: 'password_reset' });

    return res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (err) {
    console.error(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong while resetting password.";
    return next(err);
  }
}
`;
  
  fs.writeFileSync(file, header + newControllers);
  console.log('Successfully refactored auth.controller.js!');
} else {
  console.log('Could not find authGetMeController line.');
}
