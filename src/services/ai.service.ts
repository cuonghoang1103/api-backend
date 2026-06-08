/**
 * ============================================================
 * AI Service — Gemini Streaming + RAG Knowledge Base
 *
 * Cung cấp các hàm nghiệp vụ cho AI chatbot:
 * - Non-blocking Gemini API calls
 * - Streaming response (Server-Sent Events)
 * - RAG: Retrieval Augmented Generation với pgvector
 * - Document chunking & indexing
 * - Chat session management
 * - Feedback tracking
 *
 * Gemini SDK Streaming Architecture:
 *
 *   Browser ──▶ POST /api/v1/ai/chat
 *                │
 *                ├── 1. Save user message → chat_messages table
 *                │
 *                ├── 2. Build system prompt + RAG context
 *                │     └── Query document_chunks (pgvector similarity)
 *                │
 *                └── 3. model.startChat() + sendMessageStream()
 *                      │
 *                      ├── Token 1 → yield "Xin" ──▶ res.write()
 *                      ├── Token 2 → yield " chào" ──▶ res.write()
 *                      ├── Token 3 → yield " bạn" ──▶ res.write()
 *                      │         ...
 *                      └── Final   → yield "" (done) ──▶ res.write() + res.end()
 *                              └── 4. Save full response → chat_messages table
 *
 * Note: Gemini SDK streaming uses WebSocket under the hood.
 * The Node.js process stays non-blocking throughout.
 * ============================================================
 */

import {
  GoogleGenerativeAI,
  type GenerativeModel,
  type ChatSession,
  type GenerateContentResult,
} from '@google/generative-ai';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

// ─── Lazy-initialized Gemini client ───────────────────────────
let _genAI: GoogleGenerativeAI | null = null;
let _chatModel: GenerativeModel | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    if (!config.geminiApiKey) {
      throw new AppError(
        'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in .env',
        503,
        'AI_NOT_CONFIGURED',
      );
    }
    _genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return _genAI;
}

function getModel(): GenerativeModel {
  if (!_chatModel) {
    _chatModel = getGenAI().getGenerativeModel({
      model: config.aiChatModel,
      generationConfig: {
        maxOutputTokens: config.aiMaxTokens,
        temperature: config.aiTemperature,
      },
    });
  }
  return _chatModel;
}

// ─── Session ID generator ────────────────────────────────────
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── System prompt builder ────────────────────────────────────
function buildSystemPrompt(ragContext: string): string {
  return (
    `Bạn là trợ lý AI thông minh của CuongHoangDev Portfolio. `
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

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
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
   * Lấy các document chunks liên quan dựa trên documentType.
   * Trong production, đây sẽ dùng vector similarity search với pgvector.
   * Hiện tại dùng basic filtering — nâng cấp lên cosine similarity sau.
   */
  private async getRAGContext(
    documentType: string | undefined,
    topK: number,
  ): Promise<string> {
    if (!documentType) return '';

    const chunks = await prisma.documentChunk.findMany({
      where: { documentType },
      take: topK,
      orderBy: { createdAt: 'desc' },
    });

    if (chunks.length === 0) return '';

    return chunks
      .map((c) => `[${c.documentType}:${c.documentId}]\n${c.content}`)
      .join('\n\n');
  }

  // ─── Non-streaming chat ─────────────────────────────────
  /**
   * Gửi message đến Gemini, nhận response đầy đủ (không streaming).
   * Dùng cho: fallback, serverless functions, batch processing.
   */
  async sendChat(context: ChatContext) {
    const model = getModel();
    const { sessionId, message, documentType, topK } = context;

    // Build RAG context
    const ragContext = await this.getRAGContext(
      documentType,
      topK ?? 5,
    );
    const systemPrompt = buildSystemPrompt(ragContext);

    // Save user message
    if (sessionId) {
      await this.saveUserMessage(sessionId, message, context.userId);
    }

    // Create chat session
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        {
          role: 'model',
          parts: [{ text: 'Tôi đã hiểu. Tôi sẽ trả lời dựa trên ngữ cảnh được cung cấp.' }],
        },
      ],
    });

    // Send message
    const result: GenerateContentResult = await chat.sendMessage(message);
    const text = result.response.text();

    // Save assistant message
    if (sessionId && text) {
      await this.saveAssistantMessage(sessionId, text);
    }

    return { text, sessionId };
  }

  // ─── Streaming chat (AsyncGenerator) ─────────────────────
  /**
   * Stream chat response token-by-token.
   *
   * Đây là AsyncGenerator — cho phép consumer lặp qua từng token:
   *
   *   for await (const token of aiService.streamChat(ctx)) {
   *     res.write(`data: ${JSON.stringify({ text: token })}\n\n`);
   *   }
   *
   * Gemini SDK gọi API một lần, nhưng trả về stream.
   * Mỗi lần `for await...of` sẽ yield một chunk text mới.
   */
  async *streamChat(
    context: ChatContext,
  ): AsyncGenerator<string, void, unknown> {
    const model = getModel();
    const { sessionId, message, documentType, topK } = context;

    // Build RAG context
    const ragContext = await this.getRAGContext(
      documentType,
      topK ?? 5,
    );
    const systemPrompt = buildSystemPrompt(ragContext);

    // Save user message
    if (sessionId) {
      await this.saveUserMessage(sessionId, message, context.userId);
    }

    // Create chat with system prompt
    const chat: ChatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        {
          role: 'model',
          parts: [{ text: 'Tôi đã hiểu. Tôi sẽ trả lời dựa trên ngữ cảnh được cung cấp.' }],
        },
      ],
    });

    // Start streaming
    const streamResult = await chat.sendMessageStream(message);

    // Accumulate full response for saving
    let fullResponse = '';

    // Iterate through stream chunks (each chunk = a few tokens)
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      // Yield each chunk to consumer
      // Consumer will write each chunk to SSE response
      yield chunkText;
    }

    // Save full response to database after stream completes
    if (sessionId && fullResponse) {
      await this.saveAssistantMessage(sessionId, fullResponse);
    }
  }

  // ─── Get full stream result (for advanced use) ────────────
  /**
   * Lấy toàn bộ stream result từ Gemini.
   * Dùng khi cần access thêm metadata (usage, safety ratings).
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
   */
  async indexDocument(data: {
    documentId: string;
    documentType: string;
    content: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ chunksCreated: number }> {
    const { documentId, documentType, content, metadata } = data;

    // Delete existing chunks for this document
    await prisma.documentChunk.deleteMany({
      where: { documentId, documentType },
    });

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
    const count = await prisma.documentChunk.count();
    await prisma.documentChunk.deleteMany();
    return { deleted: count };
  }

  // ─── Get all chunks ──────────────────────────────────────
  async getAllChunks(documentType?: string) {
    return prisma.documentChunk.findMany({
      where: documentType ? { documentType } : undefined,
      orderBy: [{ documentType: 'asc' }, { chunkIndex: 'asc' }],
      take: 1000,
    });
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

  // ─── Reset Gemini model instance ───────────────────────────
  /**
   * Reset model cache. Dùng khi thay đổi model config.
   */
  resetModel(): void {
    _chatModel = null;
    console.log('[AIService] Model cache reset');
  }
}

export const aiService = new AIService();
