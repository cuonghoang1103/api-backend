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
import { chatWithFallback } from './aiProviders.js';

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
    `Bạn là CuongMini — trợ lý AI thông minh của CuongHoangDev Portfolio. `
    + `Khi được hỏi bạn là ai, hãy trả lời: "Tôi là CuongMini, trợ lý AI của CuongHoangDev."\n`
    + `Hãy trả lời bằng tiếng Việt, thân thiện và chính xác.\n\n`
    + `## Nguyên tắc trả lời:\n`
    + `- Trả lời ngắn gọn, có ví dụ code khi cần\n`
    + `- Nếu không biết, hãy nói thẳng\n`
    + `- Ưu tiên thông tin từ ngữ cảnh hệ thống\n`
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
  async deleteSession(sessionId: string): Promise<void> {
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });
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
    _userId?: number,
  ): Promise<void> {
    // Ensure session exists BEFORE creating messages that reference it
    // (foreign key chat_messages_session_id_fkey would otherwise fail).
    await prisma.chatSession.upsert({
      where: { id: sessionId },
      create: { id: sessionId, title: `Chat ${new Date().toLocaleString('vi-VN')}` },
      update: { updatedAt: new Date() },
    });

    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content },
    });
  }

  // ─── Save assistant message ────────────────────────────────
  private async saveAssistantMessage(
    sessionId: string,
    content: string,
  ): Promise<void> {
    await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content },
    });
  }

  // ─── Fetch RAG context from pgvector ─────────────────────
  /**
   * Lấy các document chunks liên quan dựa trên user message.
   * Khi documentType được chỉ định → lọc theo type.
   * Khi không có → dùng text search keyword matching trên toàn bộ chunks.
   * Vector embedding (pgvector) sẽ được bật sau khi setup embedding model.
   *
   * Gracefully returns empty string if table does not exist yet (first run).
   */
  async getRAGContext(
    documentType: string | undefined,
    topK: number,
    userMessage?: string,
  ): Promise<string> {
    let chunks;

    try {
      if (documentType) {
        chunks = await prisma.documentChunk.findMany({
          where: { documentType },
          take: topK,
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // No type specified — fetch all recent chunks then keyword-rank them
        const all = await prisma.documentChunk.findMany({
          orderBy: { createdAt: 'desc' },
          take: topK * 4,
        });

        if (!userMessage) {
          chunks = all.slice(0, topK);
        } else {
          // Simple keyword scoring: count matching words
          const words = userMessage.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
          const scored = all.map((c) => {
            const lower = c.content.toLowerCase();
            const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
            return { chunk: c, score };
          });
          scored.sort((a, b) => b.score - a.score);
          chunks = scored.filter((s) => s.score > 0).slice(0, topK).map((s) => s.chunk);
        }
      }

      if (chunks.length === 0) return '';

      return chunks
        .map((c) => `[${c.documentType}:${c.documentId}]\n${c.content}`)
        .join('\n\n');
    } catch (err) {
      // Table may not exist yet (first run before prisma db push completes)
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || msg.includes('relation') && msg.includes('does not exist')) {
        console.warn('[AIService] document_chunks table not found, skipping RAG context');
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
      console.error('[AIService] Chat error:', errMsg);
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
            { role: 'user', content: message },
          ],
          max_tokens: config.aiMaxTokens,
          temperature: config.aiTemperature,
          stream: true,
        });

        let fullResponse = '';

        for await (const chunk of stream) {
          const chunkText = chunk.choices[0]?.delta?.content || '';
          if (chunkText) {
            fullResponse += chunkText;
            yield chunkText;
          }
        }

        if (sessionId && fullResponse) {
          await this.saveAssistantMessage(sessionId, fullResponse);
        }
        return;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[AIService] Groq streaming failed, falling back to non-stream: ${errMsg}`,
        );
        // Fall through to non-stream fallback
      }
    }

    // Fallback: use provider factory (Groq non-stream → OpenRouter → OpenAI)
    try {
      const result = await chatWithFallback({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      });

      // Yield entire text in one chunk (no real streaming, but at least it works)
      if (result.text) yield result.text;

      if (sessionId && result.text) {
        await this.saveAssistantMessage(sessionId, result.text);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[AIService] All providers failed:', errMsg);
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
  }): Promise<{ chunksCreated: number }> {
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

    // Insert new chunks
    await Promise.all(
      chunks.map((chunkContent, index) =>
        prisma.documentChunk.create({
          data: {
            content: chunkContent,
            documentId,
            documentType,
            chunkIndex: index,
            metadata: (metadata ?? undefined) as Prisma.InputJsonValue,
          },
        }),
      ),
    );

    return { chunksCreated: chunks.length };
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
        console.warn('[AIService] document_chunks table not found, nothing to clear');
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
        console.warn('[AIService] document_chunks table not found, returning empty');
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
    const [aggregate, recent] = await Promise.all([
      prisma.chatFeedback.aggregate({
        _avg: { rating: true },
        _count: true,
      }),
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
    console.log('[AIService] Groq client cache reset');
  }
}

export const aiService = new AIService();
