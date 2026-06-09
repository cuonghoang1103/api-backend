/**
 * ============================================================
 * AI Routes — Chatbot SSE & Admin Endpoints
 *
 * Core endpoint:
 *   POST /api/v1/ai/chat
 *     → Server-Sent Events (SSE) streaming
 *     → Token-by-token response from Gemini
 *     → Real-time updates to browser
 *
 * SSE Format:
 *   data: {"text":"chunk","done":false}\n\n
 *   data: {"text":"","done":true,"tokens":45}\n\n
 *
 * Browser uses EventSource with POST body:
 *   const es = new EventSource(url, { method: 'POST' });
 *   // Note: EventSource only supports GET, so use fetch() + ReadableStream instead
 * ============================================================
 */

import { Router, type Response } from 'express';

import { prisma } from '../config/database.js';
import { aiService } from '../services/ai.service.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import type { ChatMessageDto } from '../types/index.js';

const router = Router();

// ─── SSE Constants ────────────────────────────────────────
const SSE_KEEPALIVE_INTERVAL_MS = 25_000; // 25s — keep connection alive through Nginx
const SSE_TIMEOUT_MS = 180_000;           // 3 phút max response time

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/chat
// SSE streaming — real-time token-by-token Gemini response
// ════════════════════════════════════════════════════════════════
router.post('/chat', optionalAuth, async (req: any, res: Response) => {
  // ─── 1. Validate input FIRST ──────────────────────────────
  // Validation MUST happen before flushHeaders() to avoid double-response
  const { message, sessionId, documentType, topK } = req.body as ChatMessageDto;

  if (!message?.trim()) {
    // Cannot throw to next() here — headers not set yet
    res.status(400).json({
      success: false,
      message: 'Message is required',
      code: 'MISSING_MESSAGE',
    });
    return;
  }

  if (message.length > 10000) {
    res.status(400).json({
      success: false,
      message: 'Message too long (max 10000 characters)',
      code: 'MESSAGE_TOO_LONG',
    });
    return;
  }

  // ─── 2. Set SSE headers BEFORE flushing ─────────────────
  // These headers are REQUIRED for SSE to work:
  // - Content-Type: tells browser to treat response as event stream
  // - Cache-Control: no-cache prevents browser caching
  // - Connection: keep-alive maintains TCP connection
  // - X-Accel-Buffering: no disables Nginx proxy buffering
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Critical: disable Nginx buffering
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-SSE-Enabled', 'true');

  // CORS for SSE (if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Flush headers IMMEDIATELY to establish SSE connection
  // If this is not called, the browser waits forever
  res.flushHeaders();

  // ─── 3. Send initial "connected" event ──────────────────
  res.write(
    `data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`,
  );

  // ─── 4. Set up cleanup timers ─────────────────────────
  let keepaliveTimer: ReturnType<typeof setInterval>;
  let timeoutTimer: ReturnType<typeof setTimeout>;

  const clearTimers = (): void => {
    clearInterval(keepaliveTimer);
    clearTimeout(timeoutTimer);
  };

  // Keepalive: send comment ':' every 25s to prevent Nginx 60s timeout
  keepaliveTimer = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': keepalive\n\n');
    }
  }, SSE_KEEPALIVE_INTERVAL_MS);

  // Timeout: force close after 3 minutes
  timeoutTimer = setTimeout(() => {
    if (!res.writableEnded) {
      clearTimers();
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: 'Response timeout. Please try again.',
          done: true,
        })}\n\n`,
      );
      res.end();
    }
  }, SSE_TIMEOUT_MS);

  // ─── 5. Handle client disconnect ──────────────────────
  // When user navigates away or closes tab
  req.on('close', () => {
    clearTimers();
  });

  // ─── 6. Stream response from Gemini ────────────────────
  const chatContext = {
    userId: req.userId,
    sessionId,
    message: message.trim(),
    documentType,
    topK: topK ?? 5,
  };

  let tokenCount = 0;
  let accumulated = '';

  try {
    // async generator: yields each text chunk from Gemini stream
    for await (const chunk of aiService.streamChat(chatContext)) {
      // Safety: max 10000 tokens
      tokenCount++;
      if (tokenCount > 10000) {
        clearTimers();
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: 'Response too long, truncated.',
            done: true,
          })}\n\n`,
        );
        res.end();
        return;
      }

      // Write SSE data frame
      // Format: "data: {"text":"chunk","done":false}\n\n"
      const sseFrame = JSON.stringify({ type: 'chunk', text: chunk, done: false });
      const ok = res.write(`data: ${sseFrame}\n\n`);

      // If buffer is full (network slow), wait for drain
      if (!ok) {
        await new Promise<void>((resolve) => {
          res.once('drain', resolve);
        });
      }

      // Safety: accumulated text too long
      accumulated += chunk;
      if (accumulated.length > 50000) {
        clearTimers();
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: 'Response too long, truncated at 50000 chars.',
            done: true,
          })}\n\n`,
        );
        res.end();
        return;
      }
    }

    // ─── 7. Send completion frame ───────────────────────
    clearTimers();
    res.write(
      `data: ${JSON.stringify({ type: 'done', text: '', done: true, tokens: tokenCount })}\n\n`,
    );
    res.end();
  } catch (streamError) {
    console.error('[AI-SSE] Stream error:', streamError);
    clearTimers();

    // If headers already sent, write error frame
    if (!res.writableEnded) {
      const errMsg =
        streamError instanceof Error ? streamError.message : 'Stream interrupted';
      res.write(
        `data: ${JSON.stringify({ type: 'error', error: errMsg, done: true })}\n\n`,
      );
      res.end();
    }
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/chat/sync
// Non-streaming fallback
// ════════════════════════════════════════════════════════════════
router.post('/chat/sync', optionalAuth, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { message, sessionId, documentType, topK } = req.body as ChatMessageDto;

    if (!message?.trim()) {
      throw new AppError('Message is required', 400, 'MISSING_MESSAGE');
    }

    const result = await aiService.sendChat({
      userId: req.userId,
      sessionId,
      message: message.trim(),
      documentType,
      topK: topK ?? 5,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/v1/ai/chat/sessions
// ════════════════════════════════════════════════════════════════
router.get('/chat/sessions', optionalAuth, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const sessions = await aiService.getSessions(req.userId);
    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/chat/sessions
// ════════════════════════════════════════════════════════════════
router.post('/chat/sessions', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { title } = req.body;
    const result = await aiService.createSession(req.userId, title);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/v1/ai/chat/history/:sessionId
// ════════════════════════════════════════════════════════════════
router.get('/chat/history/:sessionId', optionalAuth, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) throw new AppError('Session ID required', 400);

    const messages = await aiService.getChatHistory(sessionId);
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// DELETE /api/v1/ai/chat/sessions/:sessionId
// ════════════════════════════════════════════════════════════════
router.delete('/chat/sessions/:sessionId', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) throw new AppError('Session ID required', 400);

    await aiService.deleteSession(sessionId);
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/feedback
// ════════════════════════════════════════════════════════════════
router.post('/feedback', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { messageId, rating, feedbackType, comment } = req.body;

    if (!messageId) throw new AppError('messageId required', 400, 'MISSING_MESSAGE_ID');
    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('rating must be 1-5', 400, 'INVALID_RATING');
    }
    if (!feedbackType) throw new AppError('feedbackType required', 400, 'MISSING_FEEDBACK_TYPE');

    const result = await aiService.submitFeedback({
      messageId,
      userId: req.userId,
      rating,
      feedbackType,
      comment,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/v1/ai/feedback/stats
// ════════════════════════════════════════════════════════════════
router.get('/feedback/stats', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const stats = await aiService.getFeedbackStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// GET /api/v1/ai/analytics/overview
// ════════════════════════════════════════════════════════════════
router.get('/analytics/overview', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const [sessionCount, messageCount, recentSessions] = await Promise.all([
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.chatSession.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    let avgResponseTime = 0;
    if (recentSessions.length > 1) {
      const diffs = recentSessions
        .slice(1)
        .map((s, i) => s.createdAt.getTime() - recentSessions[i].createdAt.getTime())
        .filter(d => d > 0 && d < 300000);
      avgResponseTime = diffs.length > 0
        ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length)
        : 0;
    }

    res.json({
      success: true,
      data: {
        totalSessions: sessionCount,
        totalMessages: messageCount,
        avgResponseTime,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: GET /api/v1/ai/admin/config
// ════════════════════════════════════════════════════════════════
router.get('/admin/config', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const config = await aiService.getConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: PUT /api/v1/ai/admin/config/:key
// ════════════════════════════════════════════════════════════════
router.put('/admin/config/:key', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    const result = await aiService.updateConfig(key, value, description, req.userId);

    // Reset model if chat_model changed
    if (key === 'chat_model') {
      aiService.resetModel();
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: GET /api/v1/ai/admin/stats
// ════════════════════════════════════════════════════════════════
router.get('/admin/stats', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const [feedbackStats, config, chunks] = await Promise.all([
      aiService.getFeedbackStats(),
      aiService.getConfig(),
      aiService.getAllChunks(),
    ]);

    res.json({
      success: true,
      data: {
        feedback: feedbackStats,
        config,
        totalChunks: chunks.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: POST /api/v1/ai/admin/documents
// Index document into RAG store
// ════════════════════════════════════════════════════════════════
router.post('/admin/documents', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { documentId, documentType, content, metadata } = req.body;

    if (!documentId || !documentType || !content) {
      throw new AppError('documentId, documentType, content required', 400, 'MISSING_FIELDS');
    }

    const result = await aiService.indexDocument({ documentId, documentType, content, metadata });

    res.status(201).json({
      success: true,
      data: result,
      message: `Indexed ${result.chunksCreated} chunks`,
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: GET /api/v1/ai/admin/documents
// List all document chunks
// ════════════════════════════════════════════════════════════════
router.get('/admin/documents', authenticate, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { documentType } = req.query;
    const chunks = await aiService.getAllChunks(documentType as string | undefined);
    res.json({ success: true, data: chunks });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: DELETE /api/v1/ai/admin/knowledge/clear-all
// Clear all RAG chunks
// ════════════════════════════════════════════════════════════════
router.delete('/admin/knowledge/clear-all', authenticate, async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const { deleted } = await aiService.clearAllChunks();
    res.json({ success: true, message: `Cleared ${deleted} chunks` });
  } catch (error) {
    next(error);
  }
});

export default router;
