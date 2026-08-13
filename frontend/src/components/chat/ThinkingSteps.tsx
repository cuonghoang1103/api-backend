'use client';

/**
 * Khối "đang suy luận" — các bước model nghĩ, hiện trong lúc chờ câu trả lời.
 *
 * Đây là suy luận THẬT, không phải hoạt ảnh cho vui: backend gửi
 * `reasoning_effort` lên cổng, cổng trả về `reasoning_content` trong stream
 * (đo thật 13/08/2026 — xem ghi chú ở `claudeChat.ts`). Không gửi tham số đó
 * thì cổng không trả về bước nào cả, và khối này tự ẩn.
 *
 * Dạng chữ model trả về: các tiêu đề in đậm dính liền nhau, ví dụ
 * `**Analyzing cyclic quadrilateral****Confirming right angles**`. Vì thế
 * phải TÁCH theo cặp `**…**` chứ không tách theo dòng — chúng không có dấu
 * xuống dòng nào giữa các bước.
 */

import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown } from 'lucide-react';

/**
 * Tách chuỗi suy luận thô thành từng bước.
 *
 * Xử lý được cả lúc đang chảy dở: mẩu `**Đang viết tiêu đề` chưa có `**` đóng
 * vẫn được tính là một bước (bước đang chạy), nếu không thì bước mới nhất —
 * đúng cái người dùng đang chờ xem — bị giấu cho tới khi nó viết xong.
 */
export function parseThinkingSteps(raw: string): string[] {
  if (!raw) return [];
  const steps: string[] = [];
  const re = /\*\*([\s\S]+?)\*\*/g;
  let m: RegExpExecArray | null;
  let end = 0;
  while ((m = re.exec(raw)) !== null) {
    const s = m[1].trim();
    if (s) steps.push(s);
    end = re.lastIndex;
  }

  const tail = raw.slice(end);
  const open = tail.lastIndexOf('**');
  if (open >= 0) {
    const partial = tail.slice(open + 2).trim();
    if (partial) steps.push(partial);
  } else if (steps.length === 0) {
    // Model không dùng tiêu đề in đậm — tách theo dòng cho đỡ mất chữ.
    return raw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(-40);
  }

  // Bỏ bước lặp liền nhau (mẩu cuối chảy dở rồi chảy xong hay tạo ra cặp trùng).
  return steps.filter((s, i) => i === 0 || s !== steps[i - 1]);
}

interface Props {
  /** Chuỗi suy luận thô, đã nối theo thứ tự chảy về. */
  reasoning?: string;
  /** Lượt này đang chảy chữ hay đã xong. */
  streaming: boolean;
  /** Câu trả lời đã bắt đầu hiện chưa — quyết định mở hay thu khối này. */
  hasAnswer: boolean;
  skin: 'terminal' | 'studio';
}

function ThinkingStepsInner({ reasoning, streaming, hasAnswer, skin }: Props) {
  const steps = useMemo(() => parseThinkingSteps(reasoning || ''), [reasoning]);
  // Người dùng bấm rồi thì tôn trọng lựa chọn của họ; chưa bấm thì tự mở khi
  // đang nghĩ và tự thu khi câu trả lời bắt đầu ra.
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? (streaming && !hasAnswer);

  if (steps.length === 0) return null;

  const studio = skin === 'studio';
  const cText = studio ? 'var(--studio-text-soft)' : '#94a3b8';
  const cFaint = studio ? 'var(--studio-text-faint)' : '#64748b';
  const cLine = studio ? 'var(--studio-border)' : 'rgba(34,211,238,0.2)';
  const cAccent = studio ? 'var(--studio-accent)' : '#22d3ee';

  return (
    <div className={`mb-2 ${studio ? '' : 'font-mono'}`}>
      <button
        type="button"
        onClick={() => setManual(!open)}
        aria-expanded={open}
        className="group flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[12px] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2"
        style={{ color: cText }}
      >
        <Brain className={`h-3.5 w-3.5 ${streaming && !hasAnswer ? 'animate-pulse' : ''}`} style={{ color: cAccent }} />
        <span>
          {streaming && !hasAnswer
            ? 'CuongMini đang suy luận…'
            : `Đã suy luận · ${steps.length} bước`}
        </span>
        <ChevronDown
          className="h-3 w-3 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden pl-[7px]"
            style={{ borderLeft: `1px solid ${cLine}`, marginLeft: 7 }}
          >
            {steps.map((s, i) => {
              const last = i === steps.length - 1;
              const running = streaming && !hasAnswer && last;
              return (
                <motion.li
                  key={`${i}-${s.slice(0, 24)}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 py-[3px] text-[12px] leading-5"
                  style={{ color: running ? cText : cFaint }}
                >
                  <span
                    className={`mt-[6px] block h-1.5 w-1.5 shrink-0 rounded-full ${running ? 'animate-pulse' : ''}`}
                    style={{ background: running ? cAccent : cLine }}
                  />
                  <span>{s}</span>
                </motion.li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * `memo` bắt buộc: mỗi token chảy về là một lần vẽ lại bong bóng chat. Không
 * bọc thì danh sách bước nhấp nháy suốt lượt trả lời — cùng lý do đã bọc
 * `ChatMarkdown`, xem [[feedback_katex_render_after_streaming]].
 */
const ThinkingSteps = memo(ThinkingStepsInner);
export default ThinkingSteps;
