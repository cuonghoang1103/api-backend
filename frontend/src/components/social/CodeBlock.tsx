'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy } from 'lucide-react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { linkifyToNodes } from '@/lib/linkify';

// react-syntax-highlighter's Prism build ships every grammar — load it on
// demand so it stays out of page-initial JS chunks.
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: '#282c34',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.8rem',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          {filename && (
            <span className="ml-2 text-xs font-medium" style={{ color: '#abb2bf' }}>
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="ml-2 text-xs font-medium uppercase" style={{ color: '#61afef' }}>
              {language}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all"
          style={{
            color: copied ? '#28c840' : '#abb2bf',
            background: copied ? 'rgba(40,200,64,0.1)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: 'transparent',
            fontSize: '0.8rem',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            color: '#4b5263',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none',
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/**
 * Utility to extract code blocks from markdown-like text.
 * Handles ```language\ncode\n``` patterns.
 */
export function extractCodeBlocks(text: string): Array<{
  code: string;
  language: string;
  fullMatch: string;
}> {
  const blocks: Array<{ code: string; language: string; fullMatch: string }> = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      fullMatch: match[0],
    });
  }
  return blocks;
}

// ─── Bài dài có cấu trúc (bài giảng / bản tin) ────────────────────────────
// Một bài của loạt "100 Ngày Java" dài ~5000 ký tự với tiêu đề mở đầu, các
// mục có emoji và đường kẻ ngăn phần. Trước đây TẤT CẢ rơi vào một thẻ <p>
// text-sm nên nhìn như một khối chữ phẳng, không phân biệt được đâu là tên
// bài. Ở đây ta nhận lại cấu trúc đó và cho nó đúng thứ bậc thị giác.
//
// Chế độ này chỉ bật cho bài THẬT SỰ có cấu trúc (xem `looksStructured`) —
// một câu trạng thái mở đầu bằng emoji vẫn hiển thị y như cũ.

/** Dòng chỉ gồm ký tự kẻ ngang: `━━━━`, `────`, `-----`.
    ─-╿ là khối Box Drawing (chứa cả `─` lẫn `━`). */
const HR_RE = /^\s*(?:[─-╿]{4,}|-{5,}|={5,}|_{5,})\s*$/;

/** Độ dài tối đa của một dòng còn được coi là tiêu đề (dài hơn = câu văn). */
const MAX_HEADING_LEN = 80;

/**
 * Tách emoji mở đầu một dòng, kèm phần chữ còn lại.
 *
 * Viết bằng codePoint chứ không dùng `\p{Extended_Pictographic}` vì tsconfig
 * của frontend đang target ES2017, nơi unicode property escape chưa hợp lệ.
 * Vòng lặp cuối nuốt cả variation selector và chuỗi ZWJ để không cắt đôi
 * những emoji ghép như ✍️ hay 👨‍💻.
 */
function leadingEmoji(line: string): { emoji: string; rest: string } | null {
  const cp = line.codePointAt(0);
  if (cp === undefined) return null;
  const pictographic =
    (cp >= 0x1f000 && cp <= 0x1faff) || // 📮 📦 🎯 — khối emoji chính
    (cp >= 0x2600 && cp <= 0x27bf) ||   // ☀ ✍ ✅ ❗ — misc symbols + dingbats
    (cp >= 0x2300 && cp <= 0x23ff) ||   // ⏭ ⏰ ⌛ — misc technical
    (cp >= 0x2190 && cp <= 0x21ff) ||   // ↩ ↪
    (cp >= 0x25a0 && cp <= 0x25ff) ||   // ▶ ◀ ◻
    (cp >= 0x2b00 && cp <= 0x2bff) ||   // ⬅ ⭐
    cp === 0x203c || cp === 0x2049 || cp === 0x24c2; // ‼ ⁉ Ⓜ
  if (!pictographic) return null;

  let i = cp > 0xffff ? 2 : 1;
  for (;;) {
    const c = line.charCodeAt(i);
    if (c === 0xfe0f || c === 0xfe0e || c === 0x20e3) { i += 1; continue; }
    if (c === 0x200d) {
      const next = line.codePointAt(i + 1);
      i += 1 + (next !== undefined && next > 0xffff ? 2 : 1);
      continue;
    }
    break;
  }
  const rest = line.slice(i).trim();
  return rest ? { emoji: line.slice(0, i), rest } : null;
}

/**
 * Dòng thứ `i` có phải một tiêu đề mục không?
 *
 * Dấu hiệu quyết định là ĐỨNG RIÊNG — trên dưới đều là dòng trống — chứ
 * không phải dấu câu: tiêu đề thật vẫn có thể kết thúc bằng dấu (Ngày 1
 * của loạt Java tên là "HELLO, JAVA!"), còn một câu văn mở đầu bằng emoji
 * thì gần như luôn dính liền đoạn của nó.
 */
function headingOf(lines: string[], i: number): { emoji: string; rest: string } | null {
  const t = (lines[i] ?? '').trim();
  if (!t || t.length > MAX_HEADING_LEN) return null;
  if (i > 0 && lines[i - 1].trim()) return null;
  if (i < lines.length - 1 && lines[i + 1].trim()) return null;
  const lead = leadingEmoji(t);
  // Kết thúc bằng dấu ngắt câu giữa chừng ⇒ là câu văn, không phải tiêu đề.
  if (!lead || /[.,;]$/.test(lead.rest)) return null;
  return lead;
}

/**
 * Bài có đáng được trình bày theo cấu trúc không? Phải vừa đủ dài, vừa có
 * dấu hiệu rõ ràng (đường kẻ ngăn phần, hoặc từ hai tiêu đề trở lên) — để
 * một bài đăng thường "🎉 xong dự án rồi" không bị biến thành tiêu đề.
 */
function looksStructured(content: string): boolean {
  if (content.length < 400) return false;
  const lines = content.split('\n');
  let rules = 0;
  let heads = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (HR_RE.test(lines[i])) rules += 1;
    else if (headingOf(lines, i)) heads += 1;
  }
  return rules >= 1 || heads >= 2;
}

/** Chữ thường + `inline code` + link/mention. */
function InlineRich({ text }: { text: string }) {
  // split() với nhóm bắt giữ ⇒ phần tử chỉ số LẺ chính là ruột của cặp `…`.
  const parts = text.split(/`([^`\n]+)`/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="inline-code-chip">{part}</code>
        ) : (
          <span key={i}>{linkifyToNodes(part)}</span>
        ),
      )}
    </>
  );
}

/**
 * Một mảng chữ (giữa hai khối code) → tiêu đề / mục / đường kẻ / đoạn văn.
 * `allowTitle` chỉ đúng với mảng ĐẦU TIÊN của bài: tiêu đề bài là dòng
 * tiêu đề đầu tiên, những dòng sau chỉ là tiêu đề mục.
 */
function RichText({ text, allowTitle }: { text: string; allowTitle: boolean }) {
  const out: React.ReactNode[] = [];
  let buf: string[] = [];
  let titleTaken = !allowTitle;

  const flush = (key: string) => {
    while (buf.length && !buf[0].trim()) buf.shift();
    while (buf.length && !buf[buf.length - 1].trim()) buf.pop();
    if (!buf.length) return;
    out.push(
      <p
        key={key}
        className="whitespace-pre-wrap text-[14.5px] leading-[1.75]"
        style={{ color: 'var(--text-primary)' }}
      >
        <InlineRich text={buf.join('\n')} />
      </p>,
    );
    buf = [];
  };

  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (HR_RE.test(line)) {
      flush(`p-${i}`);
      out.push(
        <hr
          key={`hr-${i}`}
          className="my-3 border-0"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)' }}
        />,
      );
      return;
    }

    const head = headingOf(lines, i);
    if (!head) { buf.push(line); return; }

    flush(`p-${i}`);

    // Tiêu đề BÀI: to nhất, có nền và vạch màu bên trái để nhận ra ngay khi
    // lướt. Nền dùng màu bán trong suốt nên đọc tốt ở cả nền sáng lẫn tối,
    // còn chữ vẫn là --text-primary (chống lỗi chữ đen trên nền đen).
    if (!titleTaken && out.length === 0) {
      titleTaken = true;
      out.push(
        <h3
          key={`title-${i}`}
          className="mb-2 mt-0.5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[17px] font-extrabold leading-snug sm:text-[19px]"
          style={{
            color: 'var(--text-primary)',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.16), rgba(6,182,212,0.10))',
            borderLeft: '3px solid #8b5cf6',
          }}
        >
          <span aria-hidden className="text-[19px] leading-tight sm:text-[21px]">{head.emoji}</span>
          <span>{head.rest}</span>
        </h3>,
      );
      return;
    }

    out.push(
      <h4
        key={`head-${i}`}
        className="mb-1 mt-3.5 flex items-center gap-1.5 text-[15px] font-bold leading-snug sm:text-[15.5px]"
      >
        <span aria-hidden>{head.emoji}</span>
        <span className="text-violet-theme">{head.rest}</span>
      </h4>,
    );
  });

  flush('p-end');
  return <>{out}</>;
}

/**
 * Renders text with code blocks highlighted using CodeBlock component.
 * Parts that are NOT code blocks are rendered as styled paragraphs — or,
 * for long structured posts, as a proper title / section / rule hierarchy.
 */
export function RenderContentWithCode({
  content,
  structureFrom,
}: {
  content: string;
  /**
   * Bài ĐẦY ĐỦ, khi `content` mới là đoạn xem trước. Kiểu trình bày phải
   * quyết định theo bài thật: đoạn cắt 600 ký tự đầu của một bài giảng có
   * thể chưa kịp chứa đường kẻ ngăn phần nào, và khi đó chính bài đáng
   * được trình bày nhất lại rơi về kiểu chữ phẳng.
   */
  structureFrom?: string;
}) {
  const codeBlocks = extractCodeBlocks(content);
  const structured = looksStructured(structureFrom ?? content);

  // Hàm thường chứ không phải component lồng: một component định nghĩa lại
  // trong thân render sẽ mang identity mới mỗi lần render và làm React
  // tháo/dựng lại toàn bộ cây con bên dưới.
  const renderText = (text: string, first: boolean, k: string) =>
    structured ? (
      <RichText key={k} text={text} allowTitle={first} />
    ) : (
      <p key={k} className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {linkifyToNodes(text)}
      </p>
    );

  if (codeBlocks.length === 0) {
    return <div className="space-y-1">{renderText(content, true, 'text-only')}</div>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  codeBlocks.forEach((block, i) => {
    // Text before code block
    const beforeText = content.slice(lastIndex, content.indexOf(block.fullMatch, lastIndex));
    if (beforeText.trim()) {
      parts.push(renderText(beforeText, i === 0, `text-${i}`));
    }

    // Code block
    parts.push(
      <div key={`code-${i}`} className="my-3">
        <CodeBlock code={block.code} language={block.language} />
      </div>
    );

    lastIndex = content.indexOf(block.fullMatch, lastIndex) + block.fullMatch.length;
  });

  // Remaining text
  const afterText = content.slice(lastIndex);
  if (afterText.trim()) {
    parts.push(renderText(afterText, false, 'text-end'));
  }

  return <div className="space-y-1">{parts}</div>;
}
