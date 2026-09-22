'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, X, Send, Zap, Terminal, ChevronRight, Loader2 } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { taoMachChat, type MachChat } from '@/lib/nguCanhChat';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_COMMANDS = [
  { label: '/skills', prompt: 'Kể về các kỹ năng lập trình của anh Cường' },
  { label: '/projects', prompt: 'Cho tôi xem các dự án của anh Cường' },
  { label: '/cert', prompt: 'Anh Cường đang học những chứng chỉ gì?' },
  { label: '/contact', prompt: 'Cho tôi xin link Facebook và GitHub của anh Cường' },
];

const INITIAL_GREETING = 'Tôi là CuongMini. Là 1 AI Chat Bot do Hoàng Nghĩa Cường tạo ra. Bạn có câu hỏi gì không?';

const C = {
  bg: '#0a0f0d',
  surface: 'rgba(0,20,10,0.85)',
  green: '#00ff66',
  cyan: '#00f0ff',
  amber: '#ffb800',
  red: '#ff3333',
  dim: 'rgba(0,255,102,0.4)',
  border: 'rgba(0,255,102,0.12)',
};

function parseMarkdown(text: string): string {
  const raw = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="cyber-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="cyber-code">$1</code>')
    .replace(/\n/g, '<br/>');
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['a', 'strong', 'em', 'code', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

export default function CyberTerminal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * MẠCH HỘI THOẠI — vòng nhớ + việc gửi, nằm ở `@/lib/nguCanhChat`.
   *
   * `POST /ai/chat` KHÔNG nhớ hộ: ngữ cảnh model thấy đến duy nhất từ mảng
   * `history` mà client gửi kèm. Khung này trước đây gửi thân chỉ có
   * `{ message, topK }` nên mỗi câu là một cuộc đời mới.
   *
   * Để ở ref chứ không ở state: nó không vẽ ra gì cả, và `sendMessage` phải
   * đọc được giá trị MỚI NHẤT — một biến state bị đóng băng trong `useCallback`
   * sẽ luôn trả về danh sách rỗng.
   */
  const machRef = useRef<MachChat | null>(null);
  const daChaoRef = useRef(false);
  const mach = useCallback((): MachChat => {
    if (!machRef.current) machRef.current = taoMachChat();
    return machRef.current;
  }, []);

  // ── Typewriter effect ─────────────────────────────────────────────────────────
  const typewriter = useCallback((text: string, onChar?: (char: string) => void): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          onChar?.(text[i]);
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 28);
    });
  }, []);

  // ── Auto-greet on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    // Chỉ chào MỘT lần: StrictMode chạy effect hai lượt, và lượt thứ hai sẽ
    // ghi lời chào lần nữa vào ngữ cảnh.
    if (daChaoRef.current) return;
    daChaoRef.current = true;
    const greet = async () => {
      await new Promise((r) => setTimeout(r, 400));
      const fullMsg: Message = { id: Date.now(), role: 'assistant', content: '', timestamp: new Date() };
      setMessages([fullMsg]);
      await typewriter(INITIAL_GREETING, (ch) => {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[0]) updated[0].content += ch;
          return updated;
        });
      });
      // Lời chào là một lượt người dùng ĐỌC THẤY trên màn hình, nên nó phải
      // nằm trong ngữ cảnh — nếu không, model sẽ chào lại lần nữa.
      mach().ghiLuot('assistant', INITIAL_GREETING);
      setGreetingDone(true);
    };
    greet();
  }, [typewriter, mach]);

  // ── No auto-scroll — user controls their own scroll position entirely ──

  // ── Send message ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const noiDung = text.trim();

    const userMsg: Message = { id: Date.now(), role: 'user', content: noiDung, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Khung trả lời, chỉ dựng khi máy chủ đã nhận — hỏng trước đó thì người
    // dùng chỉ thấy đúng một dòng báo lỗi, không kèm một ô trống câm.
    const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: '', timestamp: new Date() };
    let daNhan = '';

    try {
      await mach().hoi(noiDung, {
        onMoDau: () => setMessages((prev) => [...prev, aiMsg]),
        onChunk: (chu) => {
          daNhan += chu;
          setMessages((prev) => {
            const updated = [...prev];
            const cuoi = updated[updated.length - 1];
            if (cuoi) updated[updated.length - 1] = { ...cuoi, content: daNhan };
            return updated;
          });
        },
      });
    } catch {
      const errMsg: Message = { id: Date.now() + 2, role: 'assistant', content: '[ERROR] Kết nối AI thất bại. Vui lòng thử lại.', timestamp: new Date() };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      // Chỉ tắt khi luồng đã chảy XONG. Tắt sớm (bản cũ thả ngay lúc nhận được
      // header) cho phép gửi câu thứ hai trong lúc câu đầu còn đang trả lời —
      // và câu thứ hai ấy mang đi một ngữ cảnh thiếu mất câu trả lời đang viết.
      setIsLoading(false);
    }
  }, [isLoading, mach]);

  // ── Keyboard submit ────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (isMinimized) return null;

  return (
    <>
      {/* CRT Scanlines CSS */}
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes flicker { 0% { opacity: 0.97; } 5% { opacity: 0.95; } 10% { opacity: 0.97; } 15% { opacity: 0.93; } 100% { opacity: 0.97; } }
        @keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 6px ${C.green}, 0 0 12px ${C.green}; } 50% { text-shadow: 0 0 10px ${C.green}, 0 0 20px ${C.green}; } }
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .terminal-flicker { animation: flicker 8s linear infinite; }
        .cyber-link { color: ${C.cyan} !important; text-decoration: none; transition: all 0.2s; }
        .cyber-link:hover { color: ${C.green} !important; text-shadow: 0 0 8px ${C.green}; text-decoration: underline; }
        .cyber-code { background: rgba(0,255,102,0.1); border: 1px solid rgba(0,255,102,0.2); padding: 1px 5px; border-radius: 3px; font-family: monospace; color: ${C.amber}; }
        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: transparent; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(0,255,102,0.2); border-radius: 2px; }
        .quick-btn:hover .quick-rain { display: block; }
      `}</style>

      {/* Terminal Container */}
      <div
        className="fixed z-[200] w-[720px] max-w-[95vw] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,255,102,0.15)] terminal-flicker"
        style={{
          bottom: '80px',
          right: '24px',
          background: C.surface,
          border: `1px solid ${C.border}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Window Header Bar */}
        <div
          className="flex items-center justify-between px-4 py-2 select-none"
          style={{ background: 'rgba(0,15,8,0.95)', borderBottom: `1px solid ${C.border}` }}
        >
          {/* Left: traffic lights */}
          <div className="flex items-center gap-2 window-controls">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-green-500/40" title="AI Online" />
            <button
              onClick={() => setIsMinimized(true)}
              className="w-3 h-3 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors"
            />
          </div>

          {/* Title */}
          <div className="flex items-center gap-2 font-mono text-xs" style={{ color: C.dim }}>
            <Terminal size={10} style={{ color: C.green }} />
            <span>cuongmini@cyber:~#</span>
          </div>

          {/* Right: minimize toggle */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-white/5 transition-colors"
          >
            <Minimize2 size={10} style={{ color: C.dim }} />
          </button>
        </div>

        {/* Terminal Body */}
        <div
          className="terminal-scroll"
          style={{
            height: '480px',
            maxHeight: '480px',
            overflowY: 'auto',
            padding: '12px 16px',
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            fontSize: '13px',
          }}
        >
          {/* Boot text */}
          <div className="mb-3 font-mono text-[10px]" style={{ color: 'rgba(0,255,102,0.35)' }}>
            <div>CUONGMINI_OS v2.0.0 — SECURE LINUX TERMINAL</div>
            <div style={{ color: C.green }}>Loading AI kernel modules... <span className="cursor-blink">▋</span></div>
            <div style={{ color: C.green }}>Neural matrix initialized.</div>
            <div style={{ color: 'rgba(0,240,255,0.5)' }}>Connection established to Gemini API.</div>
            <div className="mt-2" style={{ borderTop: `1px solid ${C.border}` }} />
          </div>

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-3"
              >
                {/* Prompt line */}
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: C.green, fontWeight: 700 }}>cuongmini@cyber</span>
                  <span style={{ color: C.dim }}>:</span>
                  <span style={{ color: C.cyan }}>~#</span>
                  {msg.role === 'user' && (
                    <span className="ml-auto text-[10px] font-mono" style={{ color: 'rgba(0,255,102,0.4)' }}>
                      YOU
                    </span>
                  )}
                  {msg.role === 'assistant' && idx === 0 && greetingDone && (
                    <span className="ml-auto text-[10px] font-mono" style={{ color: 'rgba(0,240,255,0.4)' }}>
                      [AUTO]
                    </span>
                  )}
                </div>

                {/* Content */}
                {msg.role === 'assistant' ? (
                  <div
                    className="whitespace-pre-wrap"
                    style={{
                      color: C.green,
                      textShadow: `0 0 8px ${C.green}`,
                      lineHeight: 1.6,
                      paddingLeft: '12px',
                      borderLeft: `2px solid rgba(0,255,102,0.2)`,
                    }}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                  />
                ) : (
                  <div
                    className="whitespace-pre-wrap"
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6,
                      paddingLeft: '12px',
                      borderLeft: `2px solid rgba(255,184,0,0.3)`,
                    }}
                  >
                    {msg.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-3"
              style={{ color: C.cyan, paddingLeft: '12px', borderLeft: `2px solid rgba(0,240,255,0.2)` }}
            >
              <Loader2 size={12} className="animate-spin" />
              <span className="text-xs font-mono">AI_PROCESSING<span className="cursor-blink">▋</span></span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Commands */}
        <div
          className="px-4 py-2 flex flex-wrap gap-2"
          style={{ borderTop: `1px solid ${C.border}`, background: 'rgba(0,10,5,0.6)' }}
        >
          {QUICK_COMMANDS.map((cmd) => (
            <button
              key={cmd.label}
              onClick={() => sendMessage(cmd.prompt)}
              className="quick-btn relative px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95"
              style={{
                background: 'rgba(0,255,102,0.07)',
                border: `1px solid rgba(0,255,102,0.2)`,
                color: C.dim,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.green;
                (e.currentTarget as HTMLElement).style.borderColor = C.green;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px rgba(0,255,102,0.2)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = C.dim;
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,102,0.2)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <Zap size={8} className="inline mr-1" style={{ color: C.amber }} />
              {cmd.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="terminal-input flex items-center gap-3 px-4 py-3"
          style={{ background: 'rgba(0,12,6,0.8)', borderTop: `1px solid ${C.border}` }}
        >
          <span style={{ color: C.green, fontFamily: 'monospace', fontSize: '14px' }}>{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a command or question..."
            className="flex-1 bg-transparent outline-none font-mono text-sm"
            style={{
              color: C.green,
              caretColor: C.green,
              textShadow: `0 0 6px ${C.green}`,
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded transition-all disabled:opacity-30"
            style={{
              background: input.trim() ? 'rgba(0,255,102,0.15)' : 'transparent',
              border: `1px solid ${input.trim() ? C.green : 'rgba(0,255,102,0.2)'}`,
            }}
            onMouseEnter={(e) => { if (input.trim()) (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px rgba(0,255,102,0.3)`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <Send size={13} style={{ color: input.trim() ? C.green : C.dim }} />
          </button>
        </div>
      </div>

      {/* Minimized Dock Button */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed z-[199] bottom-20 right-8 flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-sm font-bold transition-all hover:scale-105 active:scale-95 animate-pulse"
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            color: C.green,
            boxShadow: `0 0 30px rgba(0,255,102,0.2), 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          <Zap size={14} style={{ color: C.green, filter: `drop-shadow(0 0 4px ${C.green})` }} />
          <span style={{ textShadow: `0 0 8px ${C.green}` }}>CUONGMINI</span>
          <ChevronRight size={12} style={{ color: C.dim }} />
        </button>
      )}
    </>
  );
}
