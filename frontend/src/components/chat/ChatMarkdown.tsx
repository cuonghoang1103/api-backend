'use client';

/**
 * ChatMarkdown — the ONE renderer for CuongMini assistant replies, shared by
 * the /chat page and the floating ChatModal.
 *
 * Fixes the "chưa xuống dòng / ký tự lạ / code không đẹp" complaints:
 *  - remark-breaks: single newlines from the model become real line breaks
 *    (standard markdown collapses them — the main "no line break" cause).
 *  - remark-gfm + STYLED tables/hr/task-lists (previously unstyled → looked
 *    like garbled text).
 *  - Code blocks get a header (language + copy button) and Prism syntax
 *    highlighting, lazy-loaded so it stays out of initial JS (same pattern as
 *    social/CodeBlock).
 */
import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Check, Copy } from 'lucide-react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sanitizeSvg } from '@/lib/safeSvg';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

/**
 * Hình vẽ do AI xuất ra dưới dạng khối ```svg.
 *
 * Vì sao là SVG chứ không phải ảnh sinh bằng AI: hình học cần ĐÚNG — đúng điểm
 * thẳng hàng, đúng góc vuông, đúng nhãn A/B/C nằm cạnh đúng đỉnh. Model sinh
 * ảnh vẽ ra thứ "trông giống hình học" nhưng nhãn sai chỗ và đường không đi qua
 * điểm cần đi qua. SVG là toạ độ, model tính được, và sai thì nhìn ra ngay.
 *
 * Chuỗi luôn đi qua `sanitizeSvg` — câu trả lời của model là dữ liệu không tin
 * được, mà SVG thì chạy được script. Lọc hỏng thì hiện mã gốc chứ không im lặng.
 */
function SvgFigure({ source }: { source: string }) {
  const [state, setState] = useState<{ svg: string | null; reason?: string }>({ svg: null, reason: 'ssr' });

  // Câu trả lời chảy về từng mẩu: giữa chừng chuỗi mới là NỬA cái SVG
  // (`<circle cx="220" cy="240" stro`) — đưa vào DOMParser thì tất nhiên
  // "sai cú pháp", và người dùng thấy báo lỗi đỏ nhấp nháy giữa lúc máy còn
  // đang vẽ. Chỉ dựng khi đã thấy thẻ đóng `</svg>`.
  const done = /<\/svg\s*>\s*$/i.test(source.trim());

  useEffect(() => {
    if (!done) { setState({ svg: null, reason: 'drawing' }); return; }
    setState(sanitizeSvg(source));
  }, [source, done]);

  if (!state.svg) {
    if (state.reason === 'ssr') return null; // sẽ dựng ngay sau khi hydrate
    if (state.reason === 'drawing') {
      return (
        <div className="chat-figure my-3 flex h-32 items-center justify-center rounded-xl border text-xs opacity-60">
          Đang vẽ hình…
        </div>
      );
    }
    return (
      <div className="my-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-500">
        Không dựng được hình ({state.reason}).
      </div>
    );
  }
  return (
    <figure className="chat-figure my-3 overflow-x-auto rounded-xl border p-3">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: state.svg }} />
    </figure>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — ignore */ }
  };
  return (
    <div className="my-2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">{language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#94a3b8] transition-colors hover:text-[#22d3ee]"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-[#4ade80]" /> : <Copy size={12} />}
          {copied ? 'Đã chép' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto text-xs leading-relaxed">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{ margin: 0, background: 'transparent', padding: '0.75rem', fontSize: '0.75rem' }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono, ui-monospace, monospace)' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// ── Công thức toán (KaTeX) ────────────────────────────────────────
// Cùng cách làm với phòng thi (`app/exam/ExamRichContent.tsx`): nạp KaTeX
// LƯỜI (chỉ khi trong câu trả lời thật sự có dấu công thức) rồi dựng thẳng
// trên DOM đã mount. Không thêm remark-math/rehype-katex vì `katex` đã có sẵn
// trong dự án — thêm hai gói nữa chỉ để làm việc y hệt là rủi ro không cần
// (mỗi dependency mới là một lần Docker build có thể vỡ).
const MATH_RE = /\$|\\\(|\\\[/;
const MATH_DELIMS = [
  { left: '$$', right: '$$', display: true },
  { left: '\\[', right: '\\]', display: true },
  { left: '\\(', right: '\\)', display: false },
  { left: '$', right: '$', display: false },
];

/**
 * `renderMath = false` khi câu trả lời ĐANG chảy về: mỗi token là một lần
 * react-markdown vẽ lại, mà KaTeX thì thay hẳn nút chữ bằng cây <span> của
 * nó — hai bên giẫm chân nhau sẽ ra công thức nhấp nháy rồi biến mất. Dựng
 * một lần lúc câu trả lời đã xong là đủ và chắc.
 *
 * `memo` cũng vì lý do đó: bấm nút Chép/Tải làm bong bóng vẽ lại, nếu
 * ChatMarkdown vẽ lại theo thì React khôi phục lại nút chữ gốc và công thức
 * vừa dựng biến mất.
 */
function ChatMarkdown({ content, renderMath = true }: { content: string; renderMath?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !renderMath || !MATH_RE.test(content)) return;
    let cancelled = false;
    (async () => {
      try {
        await import('katex/dist/katex.min.css' as unknown as string);
        const mod = await import('katex/dist/contrib/auto-render.mjs' as unknown as string);
        const renderMathInElement = (mod.default || mod) as (
          e: HTMLElement, o: Record<string, unknown>,
        ) => void;
        if (cancelled || !ref.current) return;
        renderMathInElement(ref.current, {
          delimiters: MATH_DELIMS,
          throwOnError: false,
          // Bỏ qua khối code: `$` trong code là ký tự shell/PHP, không phải công thức.
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        });
      } catch { /* nạp lỗi thì để nguyên chữ LaTeX thô, không làm hỏng câu trả lời */ }
    })();
    return () => { cancelled = true; };
  }, [content, renderMath]);

  return (
    <div ref={ref} className="chat-markdown break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const text = String(children ?? '').replace(/\n$/, '');
            // Inline code (no language class AND single-line) → chip.
            if (!className && !text.includes('\n')) {
              return (
                <code className="rounded border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-1.5 py-0.5 font-mono text-xs text-[#22d3ee]" {...props}>
                  {children}
                </code>
              );
            }
            // ```svg → dựng thành HÌNH, không phải khối mã.
            if ((match?.[1] ?? '').toLowerCase() === 'svg' || /^<svg[\s>]/i.test(text)) {
              return <SvgFigure source={text} />;
            }
            return <CodeBlock language={match?.[1] ?? ''} code={text} />;
          },
          // Block code wrapper — CodeBlock already renders its own container.
          pre({ children }) {
            return <>{children}</>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] underline underline-offset-2 transition-colors hover:text-[#8b5cf6]">
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="mb-2 mt-3 text-base font-bold text-[#f1f5f9] first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-1.5 mt-3 text-[0.95rem] font-bold text-[#f1f5f9] first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-1 mt-2.5 text-sm font-semibold text-[#f1f5f9] first:mt-0">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-[#f1f5f9]">{children}</strong>;
          },
          blockquote({ children }) {
            return <blockquote className="my-2 border-l-2 border-[#22d3ee]/40 pl-3 text-[#94a3b8]">{children}</blockquote>;
          },
          hr() {
            return <hr className="my-3 border-white/10" />;
          },
          // GFM tables — previously completely unstyled ("ký tự lạ khó nhìn").
          table({ children }) {
            return (
              <div className="my-2 overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full border-collapse text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-white/[0.04]">{children}</thead>;
          },
          th({ children }) {
            return <th className="border-b border-white/10 px-3 py-1.5 text-left font-semibold text-[#f1f5f9]">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-white/[0.05] px-3 py-1.5 align-top">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default memo(ChatMarkdown);
