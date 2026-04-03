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
                <a href="https://unravel-bm4y.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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
        return res.status(400).send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #020617; color: white; min-height: 100vh;">
                <h1 style="color: #ef4444;">Verification Failed</h1>
                <p>The link is invalid or has expired.</p>
                <a href="https://unravel-liart.vercel.app/register" style="color: #60a5fa;">Try registering again</a>
            </div>
        `);
    }

    if (!user) {
        return res.status(400).send("User not found");
    }

    user.verified = true;
    await user.save();

    const successHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background-color: #020617; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; 
            }
            .card { 
                background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(10px); 
                border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 24px; 
                text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); max-width: 400px; width: 90%;
            }
            .icon { 
                background: #22c55e; color: white; width: 60px; height: 60px; line-height: 60px; 
                border-radius: 50%; font-size: 30px; margin: 0 auto 20px; 
            }
            h1 { 
                margin: 0 0 10px; font-size: 28px; font-weight: 800;
                background: linear-gradient(to right, #60a5fa, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            }
            p { color: #94a3b8; line-height: 1.6; margin-bottom: 30px; }
            .btn { 
                display: inline-block; background: #2563eb; color: white; padding: 14px 28px; 
                text-decoration: none; border-radius: 12px; font-weight: bold; transition: 0.3s;
                box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
            }
            .btn:hover { background: #3b82f6; transform: translateY(-2px); }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">✓</div>
            <h1>Verified!</h1>
            <p>Hi <b>${user.username}</b>, your account is now active. You can start unraveling your thoughts right away.</p>
            <a href="https://unravel-liart.vercel.app/login" class="btn">Login to Unravel</a>
        </div>
    </body>
    </html>
    `;

    res.send(successHtml);
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
   res.cookie("token", token, { /* your existing settings */ });

    // 🚀 THE FIX: Include 'token' in the JSON response
    return res.status(200).json({
        message: "Login successful",
        success: true,
        token: token, // <--- ADD THIS LINE
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