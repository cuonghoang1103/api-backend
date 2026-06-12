import { Router, type Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/system/health ────────────────────────
router.get('/health', async (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ─── GET /api/v1/system/gemini-models ─────────────────
// Debug endpoint: lists all models accessible by the configured API key
router.get('/gemini-models', async (_req, res: Response<ApiResponse>) => {
  if (!config.geminiApiKey) {
    res.status(503).json({ success: false, message: 'GEMINI_API_KEY not configured' });
    return;
  }
  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const modelList = await genAI.listModels();
    const names = modelList.map((m: any) => m.name?.replace('models/', '') ?? 'unknown');
    res.json({ success: true, data: { models: names } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, message: msg });
  }
});

export default router;
