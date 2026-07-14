/**
 * ============================================================
 * AI Service — Hugging Face DeepSeek R1 + RAG Knowledge Base
 *
 * Cung cấp các hàm nghiệp vụ cho AI chatbot:
 * - Non-blocking Hugging Face API calls (OpenAI-compatible)
 * - Streaming response (Server-Sent Events)
 * - RAG: Retrieval Augmented Generation với pgvector
 * - Document chunking & indexing
 * - Chat session management
 * - Feedback tracking
 *
 * Hugging Face DeepSeek R1 Streaming Architecture:
 *
 *   Browser ──▶ POST /api/v1/ai/chat
 *                │
 *                ├── 1. Save user message → chat_messages table
 *                │
 *                ├── 2. Build system prompt + RAG context
 *                │     └── Query document_chunks (pgvector similarity)
 *                │
 *                └── 3. OpenAI client.chat.completions.create() + stream: true
 *                      │
 *                      ├── Token 1 → yield "Xin" ──▶ res.write()
 *                      ├── Token 2 → yield " chào" ──▶ res.write()
 *                      ├── Token 3 → yield " bạn" ──▶ res.write()
 *                      │         ...
 *                      └── Final   → yield "" (done) ──▶ res.write() + res.end()
 *                              └── 4. Save full response → chat_messages table
 *
 * Note: Using OpenAI SDK v4 with Hugging Face Inference API base URL.
 * ============================================================
 */

import OpenAI from 'openai';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  chatWithFallback,
  computeEmbeddings,
  cosineSimilarity,
} from './aiProviders.js';
import { claudeChatAvailable, completeClaudeChat, streamClaudeChat, proModel, maxModel, proMaxTokens, maxMaxTokens, type ClaudeMessage, type ClaudeContentBlock } from './claudeChat.js';
import { isProEffective } from './pro.service.js';
import { logger } from '../utils/logger.js';

// ─── Conversation history helpers (multi-turn memory) ────────────────
// The chat surfaces send recent turns so the model has context. We cap the
// count + per-message length so the prompt stays bounded (cost + latency).
const MAX_HISTORY_TURNS = 10;
const MAX_HISTORY_CHARS = 6000;
export interface ChatTurn { role: 'user' | 'assistant'; content: string }
function sanitizeHistory(history?: ChatTurn[]): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CHARS) }));
}

// ─── Chat model registry (user-facing "CuongMini" tiers) ─────────────
// The frontend model switcher sends one of these ids. `default` = Groq Llama
// (fast, streamed). `claude` tiers go through the Anthropic gateway; if they
// fail they degrade to the default and the UI reverts the button.
export type ChatModelTier = 'default' | 'claude';
export interface ChatModelDef {
  id: string;
  label: string;
  tier: ChatModelTier;
  /** Gateway model id (claude tiers only). */
  gatewayModel?: () => string;
  /** Max output tokens (claude tiers only) — a cap so long answers aren't cut. */
  maxTokens?: () => number;
}
export const DEFAULT_CHAT_MODEL_ID = 'cuongmini-3.11';
export const CHAT_MODELS: Record<string, ChatModelDef> = {
  'cuongmini-3.11': { id: 'cuongmini-3.11', label: 'CuongMini3.11', tier: 'default' },
  'cuongmini-pro': { id: 'cuongmini-pro', label: 'CuongMini Pro', tier: 'claude', gatewayModel: proModel, maxTokens: proMaxTokens },
  'cuongmini-max': { id: 'cuongmini-max', label: 'CuongMini Max', tier: 'claude', gatewayModel: maxModel, maxTokens: maxMaxTokens },
};
function resolveChatModel(id?: string): ChatModelDef {
  return (id && CHAT_MODELS[id]) || CHAT_MODELS[DEFAULT_CHAT_MODEL_ID];
}

/** Mutable metadata the route reads to tell the client which model actually
 *  answered (so a Claude→Groq fallback reverts the model button). */
export interface ChatModelMeta {
  requested: string;
  effective: string;
  fellBack: boolean;
  reason?: string;
  /** DB id of the saved assistant message (so the client can attach feedback). */
  savedMessageId?: number;
}

/** Rough token estimate (~4 chars/token) — used when the gateway doesn't return usage. */
function estimateTokens(text: string): number {
  return Math.max(1, Math.round((text || '').length / 4));
}

// ─── Groq (OpenAI-compatible) client ─────────────────────────────
// Re-export getGroq() for backward compatibility with other code paths
// (system.routes.ts uses it to list available models). The actual chat
// logic uses the provider factory in aiProviders.ts which supports
// auto-fallback Groq → OpenRouter → OpenAI.
let _groq: OpenAI | null = null;

function getGroq(): OpenAI {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY || config.groqApiKey;
    if (!apiKey) {
      throw new AppError(
        'GROQ_API_KEY is not configured. Please set GROQ_API_KEY in .env',
        503,
        'AI_NOT_CONFIGURED',
      );
    }
    _groq = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
    });
  }
  return _groq;
}

// ─── Session ID generator ────────────────────────────────────
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── System prompt builder ────────────────────────────────────
function buildSystemPrompt(ragContext: string): string {
  return (
    'Bạn là CuongMini — trợ lý AI thông minh của CuongHoangDev Portfolio. '
    + 'Khi được hỏi bạn là ai, hãy trả lời: "Tôi là CuongMini, trợ lý AI của CuongHoangDev."\n'
    + 'Hãy trả lời bằng tiếng Việt, thân thiện và chính xác.\n\n'
    + '## Nguyên tắc trả lời:\n'
    + '- Trả lời ngắn gọn, có ví dụ code khi cần\n'
    + '- Nếu không biết, hãy nói thẳng\n'
    + '- Ưu tiên thông tin từ ngữ cảnh hệ thống\n'
    + (ragContext
      ? `\n## Ngữ cảnh từ hệ thống:\n${ragContext}\n`
      : '')
  );
}

// ─── ChatContext interface ────────────────────────────────────
interface ChatContext {
  userId?: number;
  sessionId?: string;
  message: string;
  documentType?: string;
  topK?: number;
  /** Selected model id from the frontend switcher (see CHAT_MODELS). */
  model?: string;
  /** Prior conversation turns for multi-turn memory (most recent last). */
  history?: ChatTurn[];
  /** Attached images (base64) for the vision-capable Pro/Max tiers only. */
  images?: ChatImageInput[];
  /** Attached PDFs (base64) for the document-capable Pro/Max tiers only. */
  documents?: ChatDocumentInput[];
}

/** A validated, base64-encoded image ready for a Claude image block. */
export interface ChatImageInput {
  media_type: string;
  data: string;
}
/** A validated, base64-encoded PDF ready for a Claude document block. */
export interface ChatDocumentInput {
  data: string;
}

/**
 * Build the user-turn content for the Claude API. With no attachments it's a
 * plain string (unchanged behaviour); otherwise a content-block array with
 * documents + images FIRST (Anthropic's recommended order) then the text.
 */
function buildUserContent(
  message: string,
  images?: ChatImageInput[],
  documents?: ChatDocumentInput[],
): string | ClaudeContentBlock[] {
  const hasImages = !!images?.length;
  const hasDocs = !!documents?.length;
  if (!hasImages && !hasDocs) return message;
  const blocks: ClaudeContentBlock[] = [];
  for (const doc of documents ?? []) {
    blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: doc.data } });
  }
  for (const img of images ?? []) {
    blocks.push({ type: 'image', source: { type: 'base64', media_type: img.media_type, data: img.data } });
  }
  if (message.trim()) blocks.push({ type: 'text', text: message });
  return blocks;
}

// ─── AI Service ──────────────────────────────────────────────

export class AIService {
  // ─── Create new session ─────────────────────────────────
  async createSession(
    userId?: number,
    title?: string,
  ): Promise<{ sessionId: string }> {
    const sessionId = generateSessionId();

    await prisma.chatSession.create({
      data: {
        id: sessionId,
        userId,
        title: title || `Chat ${new Date().toLocaleString('vi-VN')}`,
      },
    });

    return { sessionId };
  }

  // ─── Get all sessions ────────────────────────────────────
  async getSessions(userId?: number) {
    return prisma.chatSession.findMany({
      where: userId ? { userId } : undefined,
      include: {
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }

  // ─── Delete session ─────────────────────────────────────
  // The schema declares `onDelete: Cascade` on
  //   ChatMessage.sessionId
  //   ChatAnalytics.sessionId
  // so PostgreSQL removes the dependent rows automatically when
  // the parent session is dropped. We only need to:
  //   1. delete feedback rows whose message would otherwise be
  //      orphaned (FK to ChatMessage, not the session directly)
  //   2. delete the session itself
  //
  // Using `deleteMany` for the final step (rather than `delete`)
  // makes the call idempotent — re-deleting a missing session
  // returns 0 instead of throwing P2025, so a stale UI / second
  // tab can't crash the user with a 500.
  async deleteSession(sessionId: string): Promise<{ deleted: boolean }> {
    const result = await prisma.$transaction(async (tx) => {
      // Best-effort feedback cleanup. `messageId` is a FK to
      // ChatMessage (not the session), so we have to walk
      // through the message IDs first to find which feedback
      // rows point at this session's messages.
      const messageIds = await tx.chatMessage.findMany({
        where: { sessionId },
        select: { id: true },
      });
      const ids = messageIds.map((m) => m.id);
      if (ids.length > 0) {
        try {
          await tx.chatFeedback.deleteMany({
            where: { messageId: { in: ids } },
          });
        } catch {
          // chat_feedback may not be a model on this schema
          // revision — best-effort, ignore.
        }
      }
      // Final step: drop the session. The DB cascades messages
      // and analytics rows automatically.
      const { count } = await tx.chatSession.deleteMany({
        where: { id: sessionId },
      });
      return { deleted: count > 0 };
    });
    return result;
  }

  // ─── Get chat history ───────────────────────────────────
  async getChatHistory(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Save user message ───────────────────────────────────
  private async saveUserMessage(
    sessionId: string,
    content: string,
    userId?: number,
  ): Promise<void> {
    // Ensure session exists BEFORE creating messages that reference it
    // (foreign key chat_messages_session_id_fkey would otherwise fail).
    // Persist userId so per-user analytics (Pro/Max usage) can attribute chats.
    await prisma.chatSession.upsert({
      where: { id: sessionId },
      create: { id: sessionId, userId: userId ?? null, title: `Chat ${new Date().toLocaleString('vi-VN')}` },
      update: { updatedAt: new Date(), ...(userId ? { userId } : {}) },
    });

    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content, tokenCount: estimateTokens(content) },
    });
  }

  // ─── Save assistant message ────────────────────────────────
  // Returns the created row so callers can surface its id (for feedback) and
  // stores a token estimate (real usage isn't uniformly exposed by the gateway).
  private async saveAssistantMessage(
    sessionId: string,
    content: string,
    tokenCount?: number,
  ): Promise<{ id: number }> {
    const msg = await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content, tokenCount: tokenCount ?? estimateTokens(content) },
      select: { id: true },
    });
    return msg;
  }

  /** Save the assistant message AND record its id on meta (for client feedback). */
  private async saveAssistantAndTrack(sessionId: string, content: string, meta?: ChatModelMeta, tokenCount?: number): Promise<void> {
    const saved = await this.saveAssistantMessage(sessionId, content, tokenCount);
    if (meta) meta.savedMessageId = saved.id;
  }

  // ─── Fetch RAG context (semantic search with keyword fallback) ──────
  /**
   * Lấy các document chunks liên quan dựa trên user message.
   *
   * Strategy:
   * 1. Nếu documentType được chỉ định → filter theo type, score theo semantic/keyword
   * 2. Nếu không có type → tìm trên toàn bộ chunks bằng semantic search
   *
   * Embedding strategy:
   * - If ANY chunks in the candidate set have embeddings → use cosine similarity
   * - Otherwise → fall back to keyword scoring
   *
   * Gracefully returns empty string if table does not exist yet (first run).
   */
  async getRAGContext(
    documentType: string | undefined,
    topK: number,
    userMessage?: string,
  ): Promise<string> {
    let chunks: Array<{
      id: number;
      content: string;
      documentId: string;
      documentType: string;
      embedding: Prisma.JsonValue | null;
    }>;

    try {
      // Step 1: fetch candidate set
      if (documentType) {
        chunks = await prisma.documentChunk.findMany({
          where: { documentType },
          take: Math.max(topK * 4, 20),
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, documentId: true, documentType: true, embedding: true },
        });
      } else {
        chunks = await prisma.documentChunk.findMany({
          orderBy: { createdAt: 'desc' },
          take: Math.max(topK * 4, 20),
          select: { id: true, content: true, documentId: true, documentType: true, embedding: true },
        });
      }

      if (chunks.length === 0) return '';
      if (!userMessage) {
        return chunks
          .slice(0, topK)
          .map((c) => `[${c.documentType}:${c.documentId}]\n${c.content}`)
          .join('\n\n');
      }

      // Step 2: detect if any candidate has an embedding
      const hasAnyEmbedding = chunks.some((c) => c.embedding != null);

      if (hasAnyEmbedding) {
        // Semantic search path
        try {
          const queryEmbedding = await computeEmbeddings([userMessage]);
          if (queryEmbedding.length > 0) {
            const q = queryEmbedding[0];
            const scored = chunks.map((c) => {
              const emb = c.embedding as number[] | null;
              if (!emb || !Array.isArray(emb) || emb.length === 0) {
                // Chunk missing embedding: give it a 0 score for now
                return { chunk: c, score: 0 };
              }
              return { chunk: c, score: cosineSimilarity(q, emb) };
            });
            scored.sort((a, b) => b.score - a.score);

            // Filter out zero-similarity chunks (likely irrelevant) unless we have < topK
            let topChunks = scored.filter((s) => s.score > 0.1).slice(0, topK);
            if (topChunks.length < topK) {
              // Backfill with highest-scored remaining
              const backfill = scored
                .filter((s) => !topChunks.find((t) => t.chunk.id === s.chunk.id))
                .slice(0, topK - topChunks.length);
              topChunks = [...topChunks, ...backfill];
            }

            return topChunks
              .map((s) => `[${s.chunk.documentType}:${s.chunk.documentId}]\n${s.chunk.content}`)
              .join('\n\n');
          }
        } catch (embErr) {
          logger.warn('AIService Embedding query failed, falling back to keyword', { error: embErr instanceof Error ? embErr.message : String(embErr) });
          // fall through to keyword
        }
      }

      // Step 3: keyword fallback
      const words = userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      if (words.length === 0) {
        return chunks.slice(0, topK)
          .map((c) => `[${c.documentType}:${c.documentId}]\n${c.content}`)
          .join('\n\n');
      }
      const scored = chunks.map((c) => {
        const lower = c.content.toLowerCase();
        const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
        return { chunk: c, score };
      });
      scored.sort((a, b) => b.score - a.score);
      const topChunks = scored.filter((s) => s.score > 0).slice(0, topK);
      const final = topChunks.length > 0 ? topChunks : scored.slice(0, topK);

      return final
        .map((s) => `[${s.chunk.documentType}:${s.chunk.documentId}]\n${s.chunk.content}`)
        .join('\n\n');
    } catch (err) {
      // Table may not exist yet (first run before prisma db push completes)
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || msg.includes('relation') && msg.includes('does not exist')) {
        logger.warn('AIService document_chunks table not found, skipping RAG context');
        return '';
      }
      throw err;
    }
  }

  // ─── Non-streaming chat ─────────────────────────────────
  /**
   * Gửi message đến Groq (OpenAI-compatible), nhận response đầy đủ (không streaming).
   * Dùng cho: fallback, serverless functions, batch processing.
   */
  async sendChat(context: ChatContext) {
    const { sessionId, message, documentType, topK } = context;

    // Build RAG context
    const ragContext = await this.getRAGContext(
      documentType,
      topK ?? 5,
      message,
    );
    const systemPrompt = buildSystemPrompt(ragContext);

    // Save user message
    if (sessionId) {
      await this.saveUserMessage(sessionId, message, context.userId);
    }

    try {
      // Use provider factory with auto-fallback (Groq → OpenRouter → OpenAI)
      const result = await chatWithFallback({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      });

      if (sessionId && result.text) {
        await this.saveAssistantMessage(sessionId, result.text);
      }
      return { text: result.text, sessionId };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('AIService Chat error', { error: errMsg });
      throw err;
    }
  }

  // ─── Streaming chat (AsyncGenerator) ─────────────────────
  /**
   * Stream chat response token-by-token from Groq.
   * Uses OpenAI SDK with stream: true for real SSE streaming.
   */
  async *streamChat(
    context: ChatContext,
    meta?: ChatModelMeta,
  ): AsyncGenerator<string, void, unknown> {
    const { sessionId, message, documentType, topK } = context;

    // Build RAG context
    const ragContext = await this.getRAGContext(
      documentType,
      topK ?? 5,
      message,
    );
    const systemPrompt = buildSystemPrompt(ragContext);

    // Save user message
    if (sessionId) {
      await this.saveUserMessage(sessionId, message, context.userId);
    }

    // ─── Selected model routing ──────────────────────────────
    // Default = Groq Llama (streamed below). "Pro"/"Max" = Claude via the
    // Anthropic gateway. If a Claude tier fails OR isn't configured, we set
    // meta.fellBack and drop through to the Groq path so the user still gets an
    // answer — and the route tells the client to revert the model button.
    const selected = resolveChatModel(context.model);
    const history = sanitizeHistory(context.history);
    if (meta) { meta.requested = selected.id; meta.effective = selected.id; meta.fellBack = false; }

    if (selected.tier === 'claude') {
      // Pro/Max models are a Pro perk. Non-Pro (incl. guests) silently get the
      // default model back + a 'pro_required' signal so the UI reverts the
      // picker and can nudge them to upgrade.
      const allowPro = await isProEffective(context.userId);
      if (!allowPro) {
        if (meta) { meta.fellBack = true; meta.effective = DEFAULT_CHAT_MODEL_ID; meta.reason = 'pro_required'; }
      } else if (!claudeChatAvailable()) {
        if (meta) { meta.fellBack = true; meta.effective = DEFAULT_CHAT_MODEL_ID; meta.reason = 'claude_not_configured'; }
      } else {
        // Images + PDFs are a perk of the Pro/Max (Claude) tiers only — attach
        // them to the current user turn. History stays text-only.
        const userContent = buildUserContent(message, context.images, context.documents);
        const claudeMessages: ClaudeMessage[] = [...history, { role: 'user', content: userContent }];
        const gwModel = selected.gatewayModel!();
        const outTokens = selected.maxTokens ? selected.maxTokens() : 8192;
        // 1) Try REAL streaming — tokens flow immediately (no idle-out, no long
        //    blank spinner). If it fails BEFORE any token, fall through to the
        //    non-stream call; if it fails AFTER partial text, keep the partial.
        let streamed = '';
        try {
          for await (const delta of streamClaudeChat({ model: gwModel, system: systemPrompt, messages: claudeMessages, maxTokens: outTokens })) {
            streamed += delta;
            yield delta;
          }
          // Empty stream (no error but zero tokens) → treat as failure so we
          // try the non-stream path rather than returning a blank answer.
          if (!streamed.trim()) throw new Error('empty claude stream');
          if (sessionId) await this.saveAssistantAndTrack(sessionId, streamed, meta);
          return;
        } catch (err) {
          if (streamed) {
            // Partial answer already shown — save it and stop (don't restart).
            if (sessionId) await this.saveAssistantAndTrack(sessionId, streamed, meta);
            logger.warn('AIService Claude stream broke mid-answer, kept partial', { model: selected.id });
            return;
          }
          logger.warn('AIService Claude streaming failed, trying non-stream', { model: selected.id, error: err instanceof Error ? err.message : String(err) });
        }
        // 2) Non-stream fallback (proven interview path). Simulate streaming.
        try {
          const text = await completeClaudeChat({ model: gwModel, system: systemPrompt, messages: claudeMessages, maxTokens: outTokens });
          for (let i = 0; i < text.length; i += 4) yield text.slice(i, i + 4);
          if (sessionId && text) await this.saveAssistantAndTrack(sessionId, text, meta);
          return;
        } catch (err) {
          logger.warn('AIService Claude non-stream failed, falling back to default', { model: selected.id, error: err instanceof Error ? err.message : String(err) });
          if (meta) { meta.fellBack = true; meta.effective = DEFAULT_CHAT_MODEL_ID; meta.reason = 'claude_error'; }
          // fall through to Groq default
        }
      }
    }

    // Try streaming with Groq first (fast, real-time SSE).
    // If Groq fails, fallback to non-streaming chatWithFallback() and yield
    // the entire response in one chunk.
    let groq: OpenAI | null = null;
    let groqAvailable = false;
    try {
      groq = getGroq();
      groqAvailable = true;
    } catch {
      groqAvailable = false;
    }

    if (groqAvailable && groq) {
      try {
        const stream = await groq.chat.completions.create({
          model: config.groqChatModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message },
          ],
          max_tokens: config.aiMaxTokens,
          temperature: config.aiTemperature,
          stream: true,
        });

        let fullResponse = '';
        // Idle-watchdog: if no chunk arrives within 8s, abort the stream
        // controller and throw so the outer catch returns an error
        // frame. Without this the OpenAI SDK can stall on
        // "Premature close" and the user sees the spinner spin for
        // tens of seconds.
        const STREAM_IDLE_TIMEOUT_MS = 8_000;
        let lastActivity = Date.now();
        let abortTimer: ReturnType<typeof setTimeout> | null = null;

        const armIdleTimer = () => {
          if (abortTimer) clearTimeout(abortTimer);
          abortTimer = setTimeout(() => {
            try { stream.controller?.abort?.(); } catch {}
          }, STREAM_IDLE_TIMEOUT_MS);
        };
        armIdleTimer();

        let completed = false;
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.choices?.[0]?.delta?.content || '';
            if (chunkText) {
              fullResponse += chunkText;
              yield chunkText;
            }
            lastActivity = Date.now();
            armIdleTimer();
          }
          completed = true;
        } catch (err) {
          if (Date.now() - lastActivity >= STREAM_IDLE_TIMEOUT_MS) {
            throw new Error('Stream idle timeout');
          }
          throw err;
        } finally {
          if (abortTimer) clearTimeout(abortTimer);
        }

        // Only abort the stream controller if we didn't complete normally.
        // Calling abort() after a normal stream end causes the OpenAI SDK
        // to emit "Premature close" — the response was valid, skip abort.
        if (!completed) {
          try { stream.controller?.abort?.(); } catch {}
        }

        if (sessionId && fullResponse) {
          await this.saveAssistantAndTrack(sessionId, fullResponse, meta);
        }
        return;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
 logger.warn('AIService Groq streaming failed', { error: errMsg });
        // Groq stream failed — fall through to non-stream fallback below.
        // Do NOT throw; let the chatWithFallback path handle it.
      }
    }

    // ─── Non-stream fallback ─────────────────────────────────
    // Groq streaming failed or Groq wasn't available.
    // Use chatWithFallback (Groq non-stream → OpenRouter → OpenAI).
    try {
      const result = await chatWithFallback({
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: message },
        ],
      });

      // Simulate streaming: yield the text in chunks of ~4 chars
      // so the UI gets real-time updates instead of a single flash.
      if (result.text) {
        for (let i = 0; i < result.text.length; i += 4) {
          yield result.text.slice(i, i + 4);
        }
      }

      if (sessionId && result.text) {
        await this.saveAssistantMessage(sessionId, result.text);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error('AIService All providers failed', { error: errMsg });
      throw err;
    }
  }

  // ─── Get full stream result (for advanced use) ────────────
  /**
   * Lấy toàn bộ stream result từ Hugging Face.
   * Dùng khi cần access thêm metadata (usage, model info).
   */
  async getStreamResult(context: ChatContext): Promise<{
    stream: AsyncGenerator<string, void, unknown>;
    sessionId: string | undefined;
  }> {
    const { sessionId } = context;
    const stream = this.streamChat(context);
    return { stream, sessionId };
  }

  // ─── Index document into RAG store ───────────────────────
  /**
   * Chunk a document and store in document_chunks table.
   * Sử dụng khi admin upload tài liệu để chatbot có ngữ cảnh.
   * Gracefully handles missing table (no-op if table doesn't exist yet).
   */
  async indexDocument(data: {
    documentId: string;
    documentType: string;
    content: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ chunksCreated: number; embeddedChunks: number }> {
    const { documentId, documentType, content, metadata } = data;

    // Delete existing chunks for this document
    try {
      await prisma.documentChunk.deleteMany({
        where: { documentId, documentType },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('does not exist') && !(msg.includes('relation') && msg.includes('does not exist'))) {
        throw err;
      }
    }

    // Chunk text
    const chunks = this.chunkText(
      content,
      config.aiChunkSize,
      config.aiChunkOverlap,
    );

    // Compute embeddings for all chunks in one batched call.
    // If this fails (e.g. no API key), we still index the text — keyword
    // fallback in getRAGContext() will keep working.
    let embeddings: number[][] = [];
    try {
      embeddings = await computeEmbeddings(chunks);
    } catch (embErr) {
 logger.warn('AIService failed to compute embeddings', {
 documentId,
 error: embErr instanceof Error ? embErr.message : String(embErr),
 });
    }

    // Insert new chunks (with embeddings if we got them)
    await Promise.all(
      chunks.map((chunkContent, index) =>
        prisma.documentChunk.create({
          data: {
            content: chunkContent,
            documentId,
            documentType,
            chunkIndex: index,
            metadata: (metadata ?? undefined) as Prisma.InputJsonValue,
            // Prisma's Json type accepts number[] directly via JSONB
            embedding: embeddings[index]
              ? (embeddings[index] as unknown as Prisma.InputJsonValue)
              : Prisma.DbNull,
          },
        }),
      ),
    );

    return {
      chunksCreated: chunks.length,
      embeddedChunks: embeddings.length,
    };
  }

  /**
   * Re-compute embeddings for all existing chunks that don't have one yet.
   * Run this once after deploying the embedding feature to backfill the
   * 17 documents uploaded before this feature existed.
   */
  async backfillMissingEmbeddings(): Promise<{
    scanned: number;
    embedded: number;
    failed: number;
  }> {
    try {
      const chunks = await prisma.documentChunk.findMany({
        where: { embedding: { equals: Prisma.DbNull } },
        select: { id: true, content: true },
      });

      if (chunks.length === 0) {
        return { scanned: 0, embedded: 0, failed: 0 };
      }

      logger.info('AIService backfilling chunks with embeddings', { total: chunks.length });
      let embedded = 0;
      let failed = 0;

      // Process in batches of 20 to avoid hitting rate limits
      const BATCH = 20;
      for (let i = 0; i < chunks.length; i += BATCH) {
        const batch = chunks.slice(i, i + BATCH);
        try {
          const embs = await computeEmbeddings(batch.map((c) => c.content));
          await Promise.all(
            batch.map((c, idx) =>
              prisma.documentChunk.update({
                where: { id: c.id },
                data: { embedding: embs[idx] as unknown as Prisma.InputJsonValue },
              }),
            ),
          );
          embedded += batch.length;
        } catch (batchErr) {
          logger.warn('AIService batch failed', { start: i, end: i + BATCH, error: batchErr instanceof Error ? batchErr.message : String(batchErr) });
          failed += batch.length;
        }
      }

      logger.info('AIService backfill done', { embedded, failed });
      return { scanned: chunks.length, embedded, failed };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist')) {
        return { scanned: 0, embedded: 0, failed: 0 };
      }
      throw err;
    }
  }

  // ─── Chunk text for RAG ─────────────────────────────────
  /**
   * Chia văn bản thành các chunks nhỏ để lưu vào vector DB.
   * Cắt tại ranh giới câu/đoạn để giữ ngữ cảnh.
   *
   * Safety: overlap MUST be < chunkSize, otherwise start never advances
   * and we loop forever, which crashed the process with OOM (see
   * `aiChunkSize=1000`, `aiChunkOverlap=200` defaults working fine, but
   * caller must never pass `overlap >= chunkSize`).
   */
  private chunkText(
    text: string,
    chunkSize: number,
    overlap: number,
  ): string[] {
    if (chunkSize <= 0) {
      throw new AppError('chunkSize must be > 0', 500, 'INVALID_CHUNK_SIZE');
    }
    if (overlap < 0 || overlap >= chunkSize) {
      throw new AppError(
        `chunkOverlap (${overlap}) must be in [0, chunkSize) (chunkSize=${chunkSize})`,
        500,
        'INVALID_CHUNK_OVERLAP',
      );
    }
    if (text.length === 0) return [];

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = start + chunkSize;

      if (end >= text.length) {
        end = text.length;
      } else {
        // Tìm điểm cắt tốt nhất (end of sentence/paragraph) trong khoảng
        // [start + chunkSize/2, start + chunkSize] để tránh chunk quá nhỏ.
        const minCut = start + Math.floor(chunkSize / 2);
        const candidates = [
          text.lastIndexOf('\n\n', end),
          text.lastIndexOf('\n', end),
          text.lastIndexOf('. ', end),
          text.lastIndexOf('! ', end),
          text.lastIndexOf('? ', end),
          text.lastIndexOf('; ', end),
          text.lastIndexOf(', ', end),
        ].filter((pos) => pos > minCut);

        if (candidates.length > 0) {
          end = candidates[0] + 1; // Include the separator
        }
      }

      const chunk = text.slice(start, end).trim();
      if (chunk.length > 10) {
        chunks.push(chunk);
      }

      // Slide forward with overlap
      const nextStart = end - overlap;
      if (nextStart <= start) {
        // Safety: if the window doesn't move forward (e.g. chunk smaller
        // than overlap), force a forward step to guarantee termination.
        start = end;
      } else {
        start = nextStart;
      }
    }

    return chunks;
  }

  // ─── Clear all chunks ────────────────────────────────────
  async clearAllChunks(): Promise<{ deleted: number }> {
    try {
      const count = await prisma.documentChunk.count();
      await prisma.documentChunk.deleteMany();
      return { deleted: count };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || (msg.includes('relation') && msg.includes('does not exist'))) {
        logger.warn('AIService document_chunks table not found, nothing to clear');
        return { deleted: 0 };
      }
      throw err;
    }
  }

  // ─── Get all chunks (paginated) ─────────────────────
  /**
   * Returns chunks with pagination metadata.
   * @param documentType filter by type (optional)
   * @param page 1-indexed page number (default 1)
   * @param pageSize chunks per page (default 50, max 500)
   */
  async getAllChunks(
    documentType?: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<{
    chunks: Array<{
      id: number;
      documentId: string;
      documentType: string;
      chunkIndex: number;
      content: string;
      createdAt: Date;
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.min(500, Math.max(1, Math.floor(pageSize)));
    const skip = (safePage - 1) * safePageSize;

    try {
      const where = documentType ? { documentType } : undefined;

      const [chunks, total] = await Promise.all([
        prisma.documentChunk.findMany({
          where,
          orderBy: [{ documentType: 'asc' }, { chunkIndex: 'asc' }],
          skip,
          take: safePageSize,
        }),
        prisma.documentChunk.count({ where }),
      ]);

      return {
        chunks,
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages: Math.ceil(total / safePageSize),
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || (msg.includes('relation') && msg.includes('does not exist'))) {
        logger.warn('AIService document_chunks table not found, returning empty');
        return { chunks: [], total: 0, page: 1, pageSize: safePageSize, totalPages: 0 };
      }
      throw err;
    }
  }

  // ─── Submit feedback ─────────────────────────────────────
  async submitFeedback(data: {
    messageId: number;
    userId?: number;
    rating: number;
    feedbackType: string;
    comment?: string;
  }) {
    return prisma.chatFeedback.create({
      data: {
        messageId: data.messageId,
        userId: data.userId,
        rating: data.rating,
        feedbackType: data.feedbackType,
        comment: data.comment,
      },
    });
  }

  // ─── Get feedback stats ─────────────────────────────────
  async getFeedbackStats() {
    const [aggregate, positiveCount, negativeCount, recent] = await Promise.all([
      prisma.chatFeedback.aggregate({ _avg: { rating: true }, _count: true }),
      prisma.chatFeedback.count({ where: { rating: { gte: 4 } } }),
      prisma.chatFeedback.count({ where: { rating: { lte: 2 } } }),
      prisma.chatFeedback.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          message: { select: { content: true, sessionId: true } },
          user: { select: { username: true } },
        },
      }),
    ]);

    return {
      totalFeedbacks: aggregate._count,
      averageRating: aggregate._avg.rating ?? 0,
      positiveCount,
      negativeCount,
      // Back-compat keys.
      total: aggregate._count,
      avgRating: aggregate._avg.rating ?? 0,
      recent,
    };
  }

  // ─── Get AI config ──────────────────────────────────────
  async getConfig() {
    const configs = await prisma.aiConfig.findMany();
    const configMap: Record<string, string> = {};
    for (const c of configs) {
      configMap[c.configKey] = c.configValue ?? '';
    }
    return configMap;
  }

  // ─── Update AI config ────────────────────────────────────
  async updateConfig(
    key: string,
    value: string | undefined,
    description: string | undefined,
    updatedBy?: number,
  ) {
    return prisma.aiConfig.upsert({
      where: { configKey: key },
      create: {
        configKey: key,
        configValue: value,
        description,
        updatedBy,
      },
      update: {
        ...(value !== undefined && { configValue: value }),
        ...(description !== undefined && { description }),
        updatedBy,
      },
    });
  }

  // ─── Reset Groq client cache ──────────────────────────────
  /**
   * Reset Groq client cache. Dùng khi thay đổi API key hoặc model.
   */
  resetOpenAI(): void {
    _groq = null;
    logger.info('AIService Groq client cache reset');
  }
}

export const aiService = new AIService();
