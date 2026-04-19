import { Request, Response } from 'express';
import { translateTextWithAI } from '../services/translateService'; // Your AI service
import History from '../models/History';

export const handleTranslation = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, userId } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and Target Language are required" });
    }

    // 1. Get the translation from Gemini/AI
    const translatedText = await translateTextWithAI(text, targetLanguage);

    // 2. SAVE TO HISTORY
    if (userId && userId !== "undefined") {
      try {
        await History.create({
          userId: userId,
          type: 'translation', // Mark this as a translation
          inputContent: text.substring(0, 500),
          outputContent: translatedText,
          createdAt: new Date()
        });
        console.log("✅ Translation saved to history");
      } catch (dbError) {
        console.error("❌ History Save Error:", dbError);
      }
    }

    // 3. Return response to user
    res.status(200).json({
      success: true,
      translatedText
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Translation failed" });
  }
};