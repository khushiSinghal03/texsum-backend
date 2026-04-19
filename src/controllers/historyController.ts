import { Request, Response } from 'express';
import mongoose from 'mongoose';
import History from '../models/History';

export const getUserHistory = async (req: Request, res: Response) => {
  try {
    // 1. Force userId to be a string
    const userIdRaw = req.params.userId;
    
    // If for some reason it's an array, take the first element
    const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;

    // 2. Validate format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid User ID format." 
      });
    }

    // 3. Query Database with the cleaned string
    const history = await History.find({
         userId: userId.trim() 
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error("❌ History Error:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};