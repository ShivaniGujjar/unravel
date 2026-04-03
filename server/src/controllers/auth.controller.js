import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import bcrypt from "bcrypt";
import cookie from "cookie-parser";



export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="https://perplexity-0rr0.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });



}


export async function verifyEmail(req, res) {
    const { token } = req.query;
    let user;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await userModel.findOne({ email: decoded.email });
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false
        });
    }

    if (!user) {
        return res.status(400).json({
            message: "Invalid token",
            success: false,
            err: "User not found"
        });
    }

    user.verified = true;
    await user.save();

    const html = `
        <p>Hi ${user.username},</p>
        <p>Your email has been successfully verified! You can now log in to your account and start using Perplexity.</p>
        <p>Best regards,<br>The Perplexity Team</p>
    `;

    res.send(html);
}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User with this email does not exist",
            success: false
        });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid password",
            success: false
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Email not verified",
            success: false
        });
    }

    // 🛡️ TOKEN GENERATION (Make sure this is above res.cookie)
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    // 🚀 THE CRITICAL FIX FOR LOCALHOST
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,   // 👈 localhost ke liye false hi hona chahiye
  sameSite: "lax", // 👈 localhost ke liye lax hi hona chahiye
  path: "/",
  maxAge: 24 * 60 * 60 * 1000 
});

    // Send the response
    return res.status(200).json({
        message: "Login successful",
        success: true,
        user: { id: user._id, username: user.username, email: user.email }
    });
}


export async function getMe(req, res) {
  try {
    console.log("req.user:", req.user);

    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const user = await userModel.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.error("GET ME ERROR:", error);

    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}



export const protect = async (req, res, next) => {
  try {
    // 1. Get token from Cookies (since your login uses res.cookie)
    const token = req.cookies.token;

    if (!token) {
      console.log("Authorization failed: No token found in cookies");
      return res.status(401).json({
        message: "Unauthorized: Please login first",
        success: false,
      });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to the request object
    // Note: Use 'id' to match your getMe and chat controller logic
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      success: false,
    });
  }
};



// server/src/controllers/auth.controller.js

export async function logout(req, res) {
    try {
        // 🚀 THE FIX: Clear the "token" cookie
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0), // Sets expiration to 1970 (deletes it)
            sameSite: "lax",
            secure: false,        // Match your login settings
            path: "/",
        });

        return res.status(200).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error during logout",
            success: false,
        });
    }
}