import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// 1. Import Routes
import aiRoutes from './routes/summarizeRoutes'; 
import authRoutes from './routes/authRoutes'; // New Auth Routes
import historyRoutes from './routes/historyRoutes';
const app = express();
//middlewares
// Enable CORS so your React frontend (port 3000/5173) can talk to this backend
app.use(cors()); 
// Parse JSON bodies (essential for Login, Signup, and Translation)
app.use(express.json()); 
// Auth routes: Creates /api/auth/signup, /api/auth/login, /api/auth/verify-otp
app.use('/api/auth', authRoutes);
// AI routes: Creates /api/summarize and /api/translate
app.use('/api', aiRoutes);
app.use('/api/history', historyRoutes);
// Root test route
app.get('/test', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #0d9488;">🚀 TexSum AI Backend is ALIVE</h1>
      <p>Port: 8080 | Database Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}</p>
    </div>
  `);
});

/**
 * 4. DATABASE & SERVER STARTUP
 */
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connected successfully");
    
    const PORT = 8080;
    // '0.0.0.0' allows access from other devices on your local network if needed
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n--- Server Started ---`);
      console.log(`🚀 API Base: http://localhost:${PORT}/api`);
      console.log(`🔐 Auth:     http://localhost:${PORT}/api/auth`);
      console.log(`📍 Test:     http://localhost:${PORT}/test`);
      console.log(`----------------------\n`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });