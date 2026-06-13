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

// ─── OpenRouter OpenAI-compatible client ──────────────────────
let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENROUTER_API_KEY || config.openRouterApiKey;
    if (!apiKey) {
      throw new AppError(
        'OPENROUTER_API_KEY is not configured. Please set OPENROUTER_API_KEY in .env',
        503,
        'AI_NOT_CONFIGURED',
      );
    }
    _openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1/',
      apiKey,
    });
  }
  return _openai;
}

// ─── Model identifier ──────────────────────────────────────────
// DeepSeek R1 Distill Qwen 32B via OpenRouter (VPS-friendly)
const DEFAULT_MODEL = 'deepseek-ai/deepseek-r1-distill-qwen-32b';

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
    await prisma.chatMessage.create({
      data: { sessionId, role: 'user', content },
    });

    await prisma.chatSession.upsert({
      where: { id: sessionId },
      create: { id: sessionId, title: `Chat ${new Date().toLocaleString('vi-VN')}` },
      update: { updatedAt: new Date() },
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
   * Gửi message đến Hugging Face DeepSeek, nhận response đầy đủ (không streaming).
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
      const openai = getOpenAI();

      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: config.aiMaxTokens,
        temperature: config.aiTemperature,
        stream: false,
      });

      const text = response.choices[0]?.message?.content || '';

      if (sessionId && text) {
        await this.saveAssistantMessage(sessionId, text);
      }
      return { text, sessionId };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[AIService] HuggingFace API error:', errMsg);
      throw err;
    }
  }

  // ─── Streaming chat (AsyncGenerator) ─────────────────────
  /**
   * Stream chat response token-by-token from Hugging Face DeepSeek.
   * Uses OpenAI SDK with stream: true for server-sent events.
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

    try {
      const openai = getOpenAI();

      const stream = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
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
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[AIService] HuggingFace streaming error:', errMsg);
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
   */
  private chunkText(
    text: string,
    chunkSize: number,
    overlap: number,
  ): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = start + chunkSize;

      if (end >= text.length) {
        end = text.length;
      } else {
        // Tìm điểm cắt tốt nhất (end of sentence/paragraph)
        const candidates = [
          text.lastIndexOf('\n\n', end),
          text.lastIndexOf('\n', end),
          text.lastIndexOf('. ', end),
          text.lastIndexOf('! ', end),
          text.lastIndexOf('? ', end),
          text.lastIndexOf('; ', end),
          text.lastIndexOf(', ', end),
        ].filter((pos) => pos > start + chunkSize / 2);

        if (candidates.length > 0) {
          end = candidates[0] + 1; // Include the separator
        }
      }

      const chunk = text.slice(start, end).trim();
      if (chunk.length > 10) {
        chunks.push(chunk);
      }

      // Slide forward with overlap
      start = end - overlap;
      if (start <= 0 || start >= text.length) break;
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

  // ─── Get all chunks ──────────────────────────────────────
  async getAllChunks(documentType?: string) {
    try {
      return prisma.documentChunk.findMany({
        where: documentType ? { documentType } : undefined,
        orderBy: [{ documentType: 'asc' }, { chunkIndex: 'asc' }],
        take: 1000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('does not exist') || (msg.includes('relation') && msg.includes('does not exist'))) {
        console.warn('[AIService] document_chunks table not found, returning empty');
        return [];
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

  // ─── Reset OpenAI client cache ──────────────────────────────
  /**
   * Reset client cache. Dùng khi thay đổi model config.
   */
  resetOpenAI(): void {
    _openai = null;
    console.log('[AIService] HuggingFace OpenAI client cache reset');
  }
}

export const aiService = new AIService();
