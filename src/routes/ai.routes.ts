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
import multer from 'multer';

import { prisma } from '../config/database.js';
import { aiService } from '../services/ai.service.js';
import { optionalAuth, authenticate, requireAdmin } from '../middleware/auth.js';
import { quotaMiddleware } from '../services/quota.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import type { ChatMessageDto } from '../types/index.js';

const router = Router();

// Multer config for bulk file upload (.md / .txt)
const textUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file is plenty for knowledge docs
  fileFilter: (_req, file, cb) => {
    const allowed = ['.md', '.txt', '.markdown', '.text', ''];
    const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
    const okExt = allowed.includes(ext);
    const okMime = ['text/plain', 'text/markdown', 'text/x-markdown', 'application/octet-stream'].includes(file.mimetype);
    if (okExt || okMime) cb(null, true);
    else cb(new AppError(`File type ${ext || file.mimetype} not allowed. Use .md or .txt`, 400, 'INVALID_FILE_TYPE'));
  },
});

// ─── SSE Constants ────────────────────────────────────────
const SSE_KEEPALIVE_INTERVAL_MS = 25_000; // 25s — keep connection alive through Nginx
const SSE_TIMEOUT_MS = 180_000;           // 3 phút max response time

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/chat
// SSE streaming — real-time token-by-token Gemini response
// ════════════════════════════════════════════════════════════════
router.post('/chat', optionalAuth, quotaMiddleware(), async (req: any, res: Response) => {
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
    logger.error('AI-SSE stream error', { error: streamError instanceof Error ? streamError.message : String(streamError) });
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

    // Ownership check (mirror of the DELETE route): a session that belongs
    // to a user may only be read by that user. Anonymous sessions
    // (userId = null, created before login) stay readable by anyone holding
    // the id — that's the anonymous chat case. Without this an IDOR let any
    // caller read another user's conversation by its session id.
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });
    if (session?.userId && session.userId !== req.user?.userId) {
      throw new AppError('You are not allowed to view this session', 403, 'FORBIDDEN');
    }

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
    if (!sessionId) throw new AppError('Session ID required', 400, 'MISSING_SESSION_ID');

    // Frontend-only stub IDs (created before the user is
    // authenticated, or after a failed send) never reach the
    // server. Short-circuit them so the route stays idempotent.
    if (sessionId.startsWith('local_')) {
      res.json({ success: true, message: 'Local session removed' });
      return;
    }

    // Verify ownership: a user can only delete their own session.
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true },
    });
    if (!session) {
      // Idempotent: pretend we deleted it. A second tab racing
      // with this one shouldn't surface as a 500 to the user.
      res.json({ success: true, message: 'Session already removed' });
      return;
    }
    if (session.userId && session.userId !== req.user?.userId) {
      throw new AppError('You are not allowed to delete this session', 403, 'FORBIDDEN');
    }

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
router.get('/admin/config', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
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
router.put('/admin/config/:key', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    const result = await aiService.updateConfig(key, value, description, req.userId);

    // Reset model if chat_model changed
    if (key === 'chat_model') {
      aiService.resetOpenAI();
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: GET /api/v1/ai/admin/stats
// ════════════════════════════════════════════════════════════════
router.get('/admin/stats', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const [feedbackStats, config, chunksPage] = await Promise.all([
      aiService.getFeedbackStats(),
      aiService.getConfig(),
      aiService.getAllChunks(),
    ]);

    res.json({
      success: true,
      data: {
        feedback: feedbackStats,
        config,
        totalChunks: chunksPage.total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: POST /api/v1/ai/admin/documents/upload-files
// Bulk upload .md / .txt files → index into RAG store
// Multipart fields: files (1..N), documentType (optional, defaults to 'custom'),
//                   documentIdPrefix (optional, defaults to file basename)
// ════════════════════════════════════════════════════════════════
router.post(
  '/admin/documents/upload-files',
  authenticate,
  requireAdmin(),
  textUpload.array('files', 20),
  async (req: any, res: Response<ApiResponse>, next) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        throw new AppError('No files uploaded (field "files")', 400, 'NO_FILES');
      }
      const documentType = (req.body.documentType as string) || 'custom';
      const documentIdPrefix = (req.body.documentIdPrefix as string) || '';

      const results: Array<{
        fileName: string;
        documentId: string;
        documentType: string;
        chunksCreated: number;
        bytes: number;
      }> = [];

      const errors: Array<{ fileName: string; error: string }> = [];

      for (const file of files) {
        try {
          // Derive documentId from filename (strip extension, kebab-case it)
          const baseName = file.originalname.replace(/\.[^.]+$/, '').trim();
          const safeName = baseName
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 60) || 'unnamed';
          const documentId = documentIdPrefix
            ? `${documentIdPrefix}-${safeName}`
            : safeName;

          const content = file.buffer.toString('utf-8').trim();
          if (!content) {
            errors.push({ fileName: file.originalname, error: 'Empty file' });
            continue;
          }

          const result = await aiService.indexDocument({
            documentId,
            documentType,
            content,
            metadata: {
              source: 'bulk_upload',
              fileName: file.originalname,
              fileSizeBytes: file.size,
              uploadedAt: new Date().toISOString(),
            },
          });

          results.push({
            fileName: file.originalname,
            documentId,
            documentType,
            chunksCreated: result.chunksCreated,
            bytes: file.size,
          });
        } catch (err) {
          errors.push({
            fileName: file.originalname,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      const totalChunks = results.reduce((s, r) => s + r.chunksCreated, 0);

      res.status(201).json({
        success: true,
        data: {
          uploaded: results.length,
          failed: errors.length,
          totalChunks,
          results,
          errors,
        },
        message: `Uploaded ${results.length}/${files.length} files, indexed ${totalChunks} chunks`,
      });
    } catch (error) {
      next(error);
    }
  },
);

// ════════════════════════════════════════════════════════════════
// ADMIN: POST /api/v1/ai/admin/documents/backfill-embeddings
// Re-compute embeddings for chunks that don't have one yet.
// Run once after deploying the embedding feature to populate the
// 17 chunks that were indexed before embeddings existed.
// ════════════════════════════════════════════════════════════════
router.post('/admin/documents/backfill-embeddings', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const result = await aiService.backfillMissingEmbeddings();
    res.json({
      success: true,
      data: result,
      message: `Scanned ${result.scanned} chunks: ${result.embedded} embedded, ${result.failed} failed`,
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: POST /api/v1/ai/admin/documents
// Index document into RAG store
// ════════════════════════════════════════════════════════════════
router.post('/admin/documents', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
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
router.get('/admin/documents', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { documentType, page, pageSize } = req.query;
    const result = await aiService.getAllChunks(
      documentType as string | undefined,
      page ? parseInt(page as string, 10) : 1,
      pageSize ? parseInt(pageSize as string, 10) : 50,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ADMIN: DELETE /api/v1/ai/admin/documents/:documentId
// Delete all chunks belonging to a single document (by documentId + documentType)
// ════════════════════════════════════════════════════════════════
router.delete('/admin/documents/:documentId', authenticate, requireAdmin(), async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { documentId } = req.params;
    const { documentType } = req.query;

    if (!documentId) throw new AppError('documentId is required', 400);
    if (!documentType || typeof documentType !== 'string') {
      throw new AppError('documentType query param is required', 400);
    }

    const deleted = await prisma.documentChunk.deleteMany({
      where: {
        documentId,
        documentType,
      },
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || (msg.includes('relation') && msg.includes('does not exist'))) {
        return { count: 0 };
      }
      throw err;
    });

    res.json({
      success: true,
      data: { deleted: deleted.count },
      message: `Deleted ${deleted.count} chunks for ${documentId}`,
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: DELETE /api/v1/ai/admin/knowledge/clear-all
// Clear all RAG chunks
// ════════════════════════════════════════════════════════════════
router.delete('/admin/knowledge/clear-all', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const { deleted } = await aiService.clearAllChunks();
    res.json({ success: true, message: `Cleared ${deleted} chunks` });
  } catch (error) {
    next(error);
  }
});

export default router;
