import { Request, Response } from 'express';
import { extractTextFromFile } from '../services/fileExtractService';
import { summarizeTextWithAI } from '../services/summarizeService';
import History from '../models/History'; // We only need History now

export const handleSummarize = async (req: Request, res: Response) => {
  try {
    // 1. Get userId and settings from req.body
    // Note: ensure your frontend sends userId in the FormData
    const { length, style, text, userId } = req.body;
    const file = req.file;

    let textToProcess = text || "";
    let sourceName = "Manual Input";

    // 2. Process File if exists
    if (file) {
      sourceName = file.originalname;
      textToProcess = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
    }

    // 3. Validation
    if (!textToProcess || textToProcess.trim().length < 10) {
      return res.status(400).json({ error: "Text too short (min 10 chars)." });
    }

    // 4. Call AI Service
    const summary = await summarizeTextWithAI(textToProcess, length, style);

    // 5. SAVE TO HISTORY (The Missing Link)
    // If the user is logged in, save this task to their account
    if (userId && userId !== "undefined") {
      try {
        await History.create({
          userId: userId,
          type: 'summary',
          inputContent: textToProcess.substring(0, 500), // Store first 500 chars to avoid huge DB entries
          outputContent: summary,
          createdAt: new Date()
        });
        console.log("✅ Summary saved to user history");
      } catch (dbError) {
        console.error("❌ Failed to save to history:", dbError);
        // We don't return error here so the user still gets their summary
      }
    }

    // 6. Return response
    res.status(200).json({
      success: true,
      summary
    });

  } catch (error: any) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ error: error.message || "Summarization failed" });
  }
};