import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// 1. Import Routes
import aiRoutes from './routes/summarizeRoutes'; 
import authRoutes from './routes/authRoutes'; 
import historyRoutes from './routes/historyRoutes';

const app = express();

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://texsum-ai-frontend.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}

)); 
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
app.use('/api/history', historyRoutes);

// Root test route
app.get('/test', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #0d9488;">🚀 TexSum AI Backend is ALIVE</h1>
      <p>Port: ${process.env.PORT || 8080} | Database Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}</p>
    </div>
  `);
});
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = Number(process.env.PORT) || 8080;

// Step A: Start the server immediately

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n--- Server Started ---`);
  console.log(`🚀 API Base: http://localhost:${PORT}/api`);
  console.log(`📍 Test: http://localhost:${PORT}/test`);
  console.log(`----------------------\n`);
});

// Step B: Connect to Database separately
if (!MONGO_URI) {
  console.warn("⚠️ WARNING: MONGO_URI is not defined in Environment Variables.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      console.error("❌ DB Connection Error:", err.message);
      
    });
}