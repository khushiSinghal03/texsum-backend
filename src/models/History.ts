import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'summary' | 'translation';
  inputContent: string;
  outputContent: string;
  createdAt: Date;
}

const HistorySchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['summary', 'translation'], required: true },
  inputContent: { type: String, required: true },
  outputContent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// The "Defensive" check is perfect for dev mode
const History = mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);

export default History;