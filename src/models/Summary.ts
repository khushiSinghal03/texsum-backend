import mongoose, { Schema, Document } from 'mongoose';

export interface ISummary extends Document {
  originalName: string; // The filename (e.g., "report.pdf") or "Manual Input"
  summaryText: string;  // The output from Gemini
  charCount: number;    // Length of the summary
  createdAt: Date;
}

const SummarySchema: Schema = new Schema({
  originalName: { type: String, required: true },
  summaryText: { type: String, required: true },
  charCount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISummary>('Summary', SummarySchema);