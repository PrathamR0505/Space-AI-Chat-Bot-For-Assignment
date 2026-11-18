import express from 'express';
import { getGeminiClient, getGeminiModel, SPACEVERSE_SYSTEM_INSTRUCTION } from '../config/gemini.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // 1. Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request: "messages" array is required and cannot be empty.',
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content || typeof lastMessage.content !== 'string' || !lastMessage.content.trim()) {
      return res.status(400).json({
        error: 'Invalid request: The last message must have non-empty text content.',
      });
    }

    // 2. Check Gemini client & API Key
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured.',
        details: 'Please set your GEMINI_API_KEY in backend/.env file and restart the server.',
        code: 'API_KEY_MISSING',
      });
    }

    // 3. Format messages for Gemini API
    // Gemini uses roles 'user' and 'model'
    const contents = messages
      .filter((msg) => msg && msg.content && typeof msg.content === 'string' && msg.content.trim())
      .map((msg) => ({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content.trim() }],
      }));

    if (contents.length === 0) {
      return res.status(400).json({
        error: 'No valid message content to send to Gemini.',
      });
    }

    const modelName = getGeminiModel();

    // 4. Call Gemini API
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: SPACEVERSE_SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    // 5. Extract text response
    const replyText = response.text;

    if (!replyText) {
      return res.status(502).json({
        error: 'No text response received from Gemini.',
        details: 'The model did not return any candidate text.',
      });
    }

    return res.status(200).json({
      reply: replyText,
      model: modelName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);

    const errorMessage = error?.message || 'Unknown server error';
    const status = error?.status || 500;

    // Detect common Gemini error patterns
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid')) {
      return res.status(401).json({
        error: 'Invalid Gemini API key.',
        details: 'The provided GEMINI_API_KEY is not valid. Please check your key at Google AI Studio.',
        code: 'INVALID_API_KEY',
      });
    }

    if (errorMessage.includes('RESOURCE_EXHAUSTED') || status === 429) {
      return res.status(429).json({
        error: 'Gemini API rate limit or quota exceeded.',
        details: 'Too many requests or quota exhausted. Please try again in a few moments.',
        code: 'RATE_LIMIT_EXCEEDED',
      });
    }

    if (errorMessage.includes('SAFETY') || errorMessage.includes('blocked')) {
      return res.status(400).json({
        error: 'Response flagged by safety filters.',
        details: 'The cosmic query could not be completed due to safety guidelines.',
        code: 'SAFETY_BLOCKED',
      });
    }

    return res.status(500).json({
      error: 'Failed to generate cosmic response.',
      details: errorMessage,
      code: 'GENERATION_ERROR',
    });
  }
});

export default router;
