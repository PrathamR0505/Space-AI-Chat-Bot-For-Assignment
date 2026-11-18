import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import { getGeminiClient, getGeminiModel } from './config/gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware
app.use(express.json({ limit: '5mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!getGeminiClient();
  const model = getGeminiModel();

  res.status(200).json({
    status: 'online',
    service: 'SPACEVERSE AI Backend',
    geminiStatus: hasKey ? 'configured' : 'missing_api_key',
    model,
    timestamp: new Date().toISOString(),
  });
});

// Chat API Routes
app.use('/api', chatRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`🌌 SPACEVERSE Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Gemini Model: ${getGeminiModel()}`);
  const hasKey = !!getGeminiClient();
  if (hasKey) {
    console.log(`✅ Gemini API Key is configured.`);
  } else {
    console.log(`⚠️ Gemini API Key is not configured in backend/.env`);
  }
});

// Keep process active
setInterval(() => {}, 1000 * 60 * 60);
