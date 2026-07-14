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
import { aiService, DEFAULT_CHAT_MODEL_ID, type ChatModelMeta } from '../services/ai.service.js';
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

// ─── Vision image limits (Pro/Max chat) ──────────────────
// Kept conservative so a request stays well under the 10mb express.json cap even
// with several images + history. Frontend compresses before upload; these are
// the server-side defense.
const MAX_CHAT_IMAGES = 4;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB decoded per image
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

interface ParsedImage { media_type: string; data: string }

/**
 * Validate + normalize the `images` field (array of data URLs) from the chat
 * body into `{ media_type, data }` blocks. Throws AppError on any malformed or
 * oversized input. Returns [] when there are no images.
 */
function parseChatImages(raw: unknown): ParsedImage[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    throw new AppError('images must be an array of data URLs', 400, 'INVALID_IMAGES');
  }
  if (raw.length > MAX_CHAT_IMAGES) {
    throw new AppError(`Too many images (max ${MAX_CHAT_IMAGES})`, 400, 'TOO_MANY_IMAGES');
  }
  const out: ParsedImage[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') {
      throw new AppError('Each image must be a data URL string', 400, 'INVALID_IMAGE');
    }
    const match = /^data:([^;,]+);base64,(.+)$/s.exec(item.trim());
    if (!match) {
      throw new AppError('Image must be a base64 data URL', 400, 'INVALID_IMAGE_FORMAT');
    }
    const mediaType = match[1].toLowerCase();
    const data = match[2];
    if (!ALLOWED_IMAGE_TYPES.has(mediaType)) {
      throw new AppError(`Unsupported image type ${mediaType} (png/jpeg/webp/gif only)`, 400, 'UNSUPPORTED_IMAGE_TYPE');
    }
    // base64 decodes to ~3/4 of its length; guard against oversized payloads.
    if (Math.floor((data.length * 3) / 4) > MAX_IMAGE_BYTES) {
      throw new AppError('Image too large (max 4MB each)', 400, 'IMAGE_TOO_LARGE');
    }
    out.push({ media_type: mediaType, data });
  }
  return out;
}

// ─── PDF document limits (Pro/Max chat) ──────────────────
const MAX_CHAT_DOCS = 3;
const MAX_DOC_BYTES = 6 * 1024 * 1024; // 6MB decoded per PDF (stays under the 10mb body cap)

interface ParsedDoc { data: string }

/**
 * Validate + normalize the `documents` field (array of PDF data URLs) into
 * `{ data }` blocks. PDFs only. Throws AppError on malformed/oversized input.
 */
function parseChatDocuments(raw: unknown): ParsedDoc[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) {
    throw new AppError('documents must be an array of data URLs', 400, 'INVALID_DOCUMENTS');
  }
  if (raw.length > MAX_CHAT_DOCS) {
    throw new AppError(`Too many files (max ${MAX_CHAT_DOCS})`, 400, 'TOO_MANY_DOCUMENTS');
  }
  const out: ParsedDoc[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') {
      throw new AppError('Each file must be a data URL string', 400, 'INVALID_DOCUMENT');
    }
    const match = /^data:([^;,]+);base64,(.+)$/s.exec(item.trim());
    if (!match) {
      throw new AppError('File must be a base64 data URL', 400, 'INVALID_DOCUMENT_FORMAT');
    }
    if (match[1].toLowerCase() !== 'application/pdf') {
      throw new AppError('Only PDF files are supported', 400, 'UNSUPPORTED_DOCUMENT_TYPE');
    }
    const data = match[2];
    if (Math.floor((data.length * 3) / 4) > MAX_DOC_BYTES) {
      throw new AppError('PDF too large (max 6MB each)', 400, 'DOCUMENT_TOO_LARGE');
    }
    out.push({ data });
  }
  return out;
}

// ─── SSE Constants ────────────────────────────────────────
const SSE_KEEPALIVE_INTERVAL_MS = 15_000; // 15s — keep connection alive through Nginx AND reset client idle timers before slow (Opus) first-token
const SSE_TIMEOUT_MS = 240_000;           // 4 phút — room for long (10k–15k token) Pro/Max answers

// ════════════════════════════════════════════════════════════════
// POST /api/v1/ai/chat
// SSE streaming — real-time token-by-token Gemini response
// ════════════════════════════════════════════════════════════════
router.post('/chat', optionalAuth, quotaMiddleware(), async (req: any, res: Response) => {
  // ─── 1. Validate input FIRST ──────────────────────────────
  // Validation MUST happen before flushHeaders() to avoid double-response
  const { message, sessionId, documentType, topK } = req.body as ChatMessageDto;
  const requestedModel = typeof (req.body as { model?: unknown }).model === 'string'
    ? (req.body as { model: string }).model
    : DEFAULT_CHAT_MODEL_ID;

  // Parse/validate attached images FIRST (before SSE headers) so a bad payload
  // returns a plain 400 rather than an SSE error frame. Images are honored only
  // on the Pro/Max (Claude) path inside the service; other models ignore them.
  let images: Array<{ media_type: string; data: string }> = [];
  let documents: Array<{ data: string }> = [];
  try {
    images = parseChatImages((req.body as { images?: unknown }).images);
    documents = parseChatDocuments((req.body as { documents?: unknown }).documents);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ success: false, message: err.message, code: err.code });
      return;
    }
    res.status(400).json({ success: false, message: 'Invalid attachments', code: 'INVALID_ATTACHMENTS' });
    return;
  }

  // A message is required unless the user sent at least one attachment.
  if (!message?.trim() && images.length === 0 && documents.length === 0) {
    // Cannot throw to next() here — headers not set yet
    res.status(400).json({
      success: false,
      message: 'Message is required',
      code: 'MISSING_MESSAGE',
    });
    return;
  }

  if (message && message.length > 10000) {
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
    message: (message ?? '').trim(),
    documentType,
    topK: topK ?? 5,
    model: requestedModel,
    history: Array.isArray((req.body as { history?: unknown }).history)
      ? (req.body as { history: Array<{ role: 'user' | 'assistant'; content: string }> }).history
      : undefined,
    images: images.length > 0 ? images : undefined,
    documents: documents.length > 0 ? documents : undefined,
  };

  // Mutable model metadata — streamChat fills this in; we forward it to the
  // client so a Claude→default fallback reverts the model switcher in the UI.
  const modelMeta: ChatModelMeta = { requested: requestedModel, effective: requestedModel, fellBack: false };
  let modelFrameSent = false;
  const sendModelFrame = (): void => {
    if (modelFrameSent || res.writableEnded) return;
    modelFrameSent = true;
    res.write(`data: ${JSON.stringify({ type: 'model', requested: modelMeta.requested, effective: modelMeta.effective, fellBack: modelMeta.fellBack, reason: modelMeta.reason })}\n\n`);
  };

  let tokenCount = 0;
  let accumulated = '';

  try {
    // async generator: yields each text chunk from Gemini stream
    for await (const chunk of aiService.streamChat(chatContext, modelMeta)) {
      // Emit the resolved model once (before the first token) so the client can
      // revert the picker immediately if a Claude tier fell back to default.
      sendModelFrame();
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
    sendModelFrame(); // ensure the client learns the effective model even if 0 chunks streamed
    res.write(
      `data: ${JSON.stringify({ type: 'done', text: '', done: true, tokens: tokenCount, model: modelMeta.effective, fellBack: modelMeta.fellBack, messageId: modelMeta.savedMessageId })}\n\n`,
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
router.get('/analytics/overview', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const [sessionCount, messageCount, userMsgCount, tokenAgg, identifiedSessions, recentMsgs] = await Promise.all([
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.chatMessage.count({ where: { role: 'user' } }),
      prisma.chatMessage.aggregate({ _sum: { tokenCount: true } }),
      prisma.chatSession.count({ where: { userId: { not: null } } }),
      // Real response time: user→assistant gap within a session, over recent msgs.
      prisma.chatMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 2000,
        select: { sessionId: true, role: true, createdAt: true },
      }),
    ]);

    const bySession = new Map<string, Array<{ role: string; t: number }>>();
    for (const m of recentMsgs) {
      const arr = bySession.get(m.sessionId) ?? [];
      arr.push({ role: m.role, t: m.createdAt.getTime() });
      bySession.set(m.sessionId, arr);
    }
    const diffs: number[] = [];
    for (const arr of bySession.values()) {
      arr.sort((a, b) => a.t - b.t);
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1].role === 'user' && arr[i].role === 'assistant') {
          const d = arr[i].t - arr[i - 1].t;
          if (d > 0 && d < 300000) diffs.push(d);
        }
      }
    }
    const avgResponseTimeMs = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : 0;

    res.json({
      success: true,
      data: {
        totalSessions: sessionCount,
        totalMessages: messageCount,
        totalUserMessages: userMsgCount,
        totalTokens: tokenAgg._sum.tokenCount ?? 0,
        avgResponseTimeMs,
        avgResponseTime: avgResponseTimeMs, // back-compat
        identifiedSessions,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN: GET /api/v1/ai/admin/usage/users
// Per-user chat usage (messages, tokens, sessions) + Pro/Max status — so admins
// can manage who's using the Pro/Max tiers and how heavily.
// ════════════════════════════════════════════════════════════════
router.get('/admin/usage/users', authenticate, requireAdmin(), async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    const [msgAgg, sessions] = await Promise.all([
      prisma.chatMessage.groupBy({ by: ['sessionId'], _count: { _all: true }, _sum: { tokenCount: true } }),
      prisma.chatSession.findMany({ where: { userId: { not: null } }, select: { id: true, userId: true, updatedAt: true } }),
    ]);
    const sessMap = new Map(sessions.map((s) => [s.id, s]));
    const perUser = new Map<number, { messages: number; tokens: number; sessions: number; lastActive: number }>();
    for (const g of msgAgg) {
      const s = sessMap.get(g.sessionId);
      if (!s?.userId) continue;
      const u = perUser.get(s.userId) ?? { messages: 0, tokens: 0, sessions: 0, lastActive: 0 };
      u.messages += g._count._all;
      u.tokens += g._sum.tokenCount ?? 0;
      u.sessions += 1;
      u.lastActive = Math.max(u.lastActive, s.updatedAt.getTime());
      perUser.set(s.userId, u);
    }
    const userIds = [...perUser.keys()];
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, username: true, email: true, isPro: true, proExpiresAt: true },
        })
      : [];
    const uMap = new Map(users.map((u) => [u.id, u]));
    const rows = userIds
      .map((id) => {
        const agg = perUser.get(id)!;
        const u = uMap.get(id);
        return {
          userId: id,
          username: u?.username ?? null,
          email: u?.email ?? null,
          isPro: !!u?.isPro,
          proExpiresAt: u?.proExpiresAt ?? null,
          messages: agg.messages,
          tokens: agg.tokens,
          sessions: agg.sessions,
          lastActive: new Date(agg.lastActive).toISOString(),
        };
      })
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 100);
    res.json({ success: true, data: rows });
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
