import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

/**
 * Helper: Sends the verification email
 */
const sendEmailHelper = async (email: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing email credentials in .env");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: `"TexSum AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 400px;">
        <h2 style="color: #0d9488;">TexSum AI Verification</h2>
        <p>Your 6-digit verification code is:</p>
        <h1 style="background: #f3f4f6; padding: 10px; display: inline-block; letter-spacing: 5px; color: #111; border-radius: 5px;">${otp}</h1>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

/**
 * SIGNUP: Handles new users and unverified retry attempts
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // If user exists and is already verified, prevent duplicate signup
      if (user.isVerified) {
        return res.status(400).json({ msg: "User already exists. Please log in." });
      }
      // If user exists but isn't verified, update their info for a fresh attempt
      user.name = name;
      user.password = password; 
    } else {
      user = new User({ name, email, password });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = generatedOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 Min Expiry

    await user.save();
    await sendEmailHelper(email, generatedOtp);

    res.status(201).json({ success: true, msg: "OTP sent to your email" });
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ success: false, msg: "Failed to send verification email" });
  }
};

/**
 * VERIFY OTP: Validates code and activates the account
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body; // Matches 'otp' key from frontend
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      user: { _id: user._id, name: user.name, email: user.email }, 
      msg: "Account verified successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Verification failed" });
  }
};

/**
 * LOGIN: Traditional email/password access
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.status(200).json({ 
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
      msg: "Login successful" 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error during login" });
  }
};