import mongoose, { Schema, Document } from 'mongoose';

export interface ITranslation extends Document {
  originalText: string;
  translatedText: string;
  targetLanguage: string;
  createdAt: Date;
}


const TranslationSchema = new mongoose.Schema({
  originalText: String,
  translatedText: String,
  targetLanguage: String,
  modelUsed: String, // Store which model actually worked!
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITranslation>('Translation', TranslationSchema);