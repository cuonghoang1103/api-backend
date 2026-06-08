/**
 * ============================================================
 * useChatSSE — Next.js Hook cho AI Chatbot Streaming
 *
 * How to use:
 *
 *   const {
 *     messages,      // Array of ChatMessage
 *     sendMessage,   // (content: string) => Promise<void>
 *     isStreaming,   // boolean
 *     stopStreaming, // () => void
 *     clearMessages, // () => void
 *     error,
 *   } = useChatSSE({ sessionId, documentType });
 *
 * SSE Protocol:
 *   Backend → Frontend:
 *     data: {"type":"connected","sessionId":"..."}\n\n
 *     data: {"type":"chunk","text":"Xin","done":false}\n\n
 *     data: {"type":"chunk","text":" chào","done":false}\n\n
 *     data: {"type":"done","text":"","done":true,"tokens":45}\n\n
 *     data: {"type":"error","error":"..."}\n\n
 * ============================================================
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface UseChatSSEOptions {
  sessionId?: string;
  documentType?: string;
  topK?: number;
  onComplete?: (fullText: string, tokens: number) => void;
  onError?: (error: Error) => void;
}

export function useChatSSE(options: UseChatSSEOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMsgIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      // ─── 1. Add user message ─────────────────────────
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // ─── 2. Add assistant placeholder ──────────────
      const assistantMsgId = `assistant-${Date.now()}`;
      assistantMsgIdRef.current = assistantMsgId;
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: '', createdAt: new Date() },
      ]);

      setError(null);
      setIsStreaming(true);

      // ─── 3. Create abort controller ───────────────
      abortControllerRef.current = new AbortController();

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/ai/chat`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(typeof window !== 'undefined' && localStorage.getItem('token')
              ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
              : {}),
          },
          credentials: 'include',
          body: JSON.stringify({
            message: content.trim(),
            sessionId: options.sessionId,
            documentType: options.documentType,
            topK: options.topK ?? 5,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error('No response body from server');
        }

        // ─── 4. Parse SSE stream ───────────────────
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ''; // Accumulate partial lines
        let tokenCount = 0;
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode bytes → string
          // Use stream:true to handle multi-byte UTF-8 characters across chunks
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines (lines ending with \n)
          const lines = buffer.split('\n');
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const dataStr = line.slice(6); // Remove "data: "
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              switch (data.type) {
                case 'chunk': {
                  // Token chunk from Gemini
                  if (data.text) {
                    accumulated += data.text;
                    tokenCount++;

                    // Update assistant message in real-time
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMsgId
                          ? { ...msg, content: accumulated }
                          : msg,
                      ),
                    );
                  }
                  break;
                }

                case 'done': {
                  // Stream completed
                  options.onComplete?.(accumulated, data.tokens ?? tokenCount);
                  break;
                }

                case 'error': {
                  throw new Error(data.error || 'Unknown stream error');
                }

                default:
                  break;
              }
            } catch {
              // JSON parse error — chunk was split mid-JSON
              // Push back to buffer for next iteration
              buffer = line + '\n' + buffer;
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim() && buffer.startsWith('data: ')) {
          const dataStr = buffer.slice(6);
          try {
            const data = JSON.parse(dataStr);
            if (data.type === 'chunk' && data.text) {
              accumulated += data.text;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, content: accumulated }
                    : msg,
                ),
              );
            }
          } catch {
            // Ignore leftover partial data
          }
        }
      } catch (err) {
        const streamError = err instanceof Error ? err : new Error('Unknown error');

        if (streamError.name === 'AbortError') {
          console.log('[ChatSSE] Request aborted');
        } else {
          setError(streamError);
          options.onError?.(streamError);

          // Update assistant message with error
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, content: `❌ Lỗi: ${streamError.message}. Thử lại nhé.` }
                : msg,
            ),
          );
        }
      } finally {
        setIsStreaming(false);
        assistantMsgIdRef.current = null;
      }
    },
    [isStreaming, options],
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    messages,
    sendMessage,
    stopStreaming,
    clearMessages,
    isStreaming,
    error,
  };
}
