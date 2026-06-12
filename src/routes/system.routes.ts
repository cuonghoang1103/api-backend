import { Router, type Response } from 'express';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─── GET /api/v1/system/health ────────────────────────
router.get('/health', async (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ─── GET /api/v1/system/gemini-models ─────────────────
// Debug endpoint: tests which model names are valid on the v1beta endpoint
router.get('/gemini-models', async (_req, res: Response<ApiResponse>) => {
  const testModels = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash', 'gemini-3.5-flash'];
  const results: Record<string, string> = {};
  for (const model of testModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=FAKE_KEY`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'test' }] }] })
      });
      const data = await resp.json() as { error?: { message?: string } };
      const msg: string = data?.error?.message || '';
      results[model] = msg.includes('not found') ? 'NOT_FOUND' : 'EXISTS';
    } catch {
      results[model] = 'NETWORK_ERROR';
    }
  }
  res.json({ success: true, data: { models: results } });
});

export default router;
