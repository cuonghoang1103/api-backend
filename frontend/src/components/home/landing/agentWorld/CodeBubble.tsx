'use client';

/**
 * Bong bóng code trên đầu Code Buddy (10/11/2026): một cửa sổ editor tí hon, Python tô màu cú pháp tự gõ
 * từng ký tự, chạy xong hiện "✓ tests pass", giữ một lúc rồi chuyển đoạn khác.
 *
 * HIỆU NĂNG — không thêm timer nào:
 * · Token tô màu tính SẴN một lần. "Gõ" = ghi lại nội dung của DÒNG đang gõ (phần đã gõ, đã tô màu). Chỉ đổi
 *   văn bản ⇒ không đụng cây thuộc tính của compositor. (Bản đầu cắt dòng bằng `clip-path` theo `ch`: đo
 *   10/11, mỗi lần đổi clip-path làm Chrome xếp lại lớp — Layerize ~380 ms / 4 s ở CPU chậm 4×.)
 * · Con trỏ là một KÝ TỰ ("▏") tô màu ở cuối chữ vừa gõ, nhấp nháy bằng đổi màu chữ — chỉ là văn bản. (Bản đầu di con trỏ bằng
 *   `transform` + animation opacity, rồi bằng inline-block: đo 10/11, cả hai đều bắt Chrome xếp lại lớp
 *   compositor mỗi khung — Layerize ~380 ms / 4 s ở CPU chậm 4×.)
 * · Mọi thứ do `tick(now)` gọi từ VÒNG rAF DUY NHẤT của AgentScene ⇒ cảnh ra
 *   khỏi màn hình / tab ẩn là tự dừng.
 * · Giảm chuyển động ⇒ hiện nguyên đoạn code, không gõ, không nhấp nháy.
 *
 * Code là bản PHÁC HOẠ (module `cuongthai` là giả tưởng) nhưng là Python hợp lệ, đúng thành ngữ.
 */
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';

export interface Snippet {
  file: string;
  status: string;
  code: string;
}

export const SNIPPETS_WIDE: Snippet[] = [
  {
    file: 'daily_plan.py',
    status: '✓ 3/3 drills passed · 0.42s',
    code: `import asyncio
from cuongthai import academy, lab, exam

async def plan_today(me):
    lesson = await academy.next(me)
    drills = await lab.pick(lesson, n=3)
    done = await asyncio.gather(
        *(lab.grade(d) for d in drills))
    print(f"✓ {sum(done)}/{len(done)}")
    return await exam.practice(lesson)

asyncio.run(plan_today(academy.me()))`,
  },
  {
    file: 'cuongmini.py',
    status: '✓ tests pass · 12 passed',
    code: `from cuongthai import cuongmini

@cuongmini.tool
async def hint(q: str) -> str:
    """A nudge, never the answer."""
    notes = await cuongmini.search(q)
    return await cuongmini.ask(
        q, context=notes, mode="hint")`,
  },
];
/** Màn hẹp: chỉ đoạn ngắn. */
export const SNIPPETS_NARROW: Snippet[] = [SNIPPETS_WIDE[1]];

/* ─── Tô màu Python tối giản (đủ cho các đoạn ở trên) ─── */
const KW = new Set(['import', 'from', 'as', 'async', 'await', 'def', 'return', 'for', 'in', 'if', 'else', 'not', 'and', 'or', 'with', 'class', 'lambda', 'yield', 'None', 'True', 'False']);
const BUILTIN = new Set(['print', 'sum', 'len', 'str', 'int', 'list', 'dict', 'range', 'min', 'max']);
type Tok = [cls: string, text: string];
const TOKEN = /("""[\s\S]*?"""|f?"[^"]*"|f?'[^']*'|#.*$|@[\w.]+|\d+(?:\.\d+)?|[A-Za-z_]\w*|\s+|.)/g;

function highlight(line: string): Tok[] {
  const out: Tok[] = [];
  let prev = '';
  for (const m of Array.from(line.matchAll(TOKEN))) {
    const t = m[0];
    const rest = line.slice((m.index ?? 0) + t.length);
    let cls = 'p';
    if (/^\s+$/.test(t)) cls = '';
    else if (t.startsWith('#')) cls = 'c';
    else if (/^f?["']/.test(t)) cls = 's';
    else if (t.startsWith('@')) cls = 'd';
    else if (/^\d/.test(t)) cls = 'n';
    else if (KW.has(t)) cls = 'k';
    else if (prev === 'def') cls = 'f';
    else if (BUILTIN.has(t)) cls = 'b';
    else if (/^[A-Za-z_]/.test(t) && rest.startsWith('(')) cls = 'f';
    else if (/^[A-Za-z_]/.test(t) && rest.startsWith('=') && !rest.startsWith('==')) cls = 'a';
    if (cls) prev = t;
    out.push([cls, t]);
  }
  return out;
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** HTML của `col` ký tự đầu một dòng đã tô màu. */
function htmlUpTo(toks: Tok[], col: number) {
  let out = '';
  let left = col;
  for (const [cls, t] of toks) {
    if (left <= 0) break;
    const part = esc(t.slice(0, left));
    out += cls ? `<span class="aw-t-${cls}">${part}</span>` : part;
    left -= t.length;
  }
  return out;
}

export interface CodeBubbleHandle {
  tick: (now: number) => void;
}

/** Nhịp gõ: ~32 ký tự/giây, khựng nhẹ ở đầu dòng; giữ 3,6 giây khi xong; mờ đi 0,35 giây rồi đổi đoạn. */
const MS_PER_CHAR = 31;
const MS_NEWLINE = 150;
const HOLD = 3600;
const FADE = 350;

const CodeBubble = forwardRef<CodeBubbleHandle, { snippets: Snippet[]; still: boolean; hidden: boolean; shift: number }>(
  function CodeBubble({ snippets, still, hidden, shift }, ref) {
    const prepared = useMemo(
      () => snippets.map((s) => ({ ...s, lines: s.code.split('\n').map((l) => ({ text: l, toks: highlight(l) })) })),
      [snippets],
    );
    const maxLines = Math.max(...prepared.map((p) => p.lines.length));
    const rootRef = useRef<HTMLDivElement>(null);
    const st = useRef({ idx: 0, line: 0, col: 0, next: 0, phase: 'type' as 'type' | 'hold' | 'fade', until: 0, shown: -1 });

    // Dòng của đoạn đang gõ + con trỏ: tra một lần mỗi đoạn, không querySelector trong mỗi nhịp gõ.
    const els = useRef<{ lines: HTMLElement[]; done: number; blink: string }>({ lines: [], done: 0, blink: '' });
    const paint = () => {
      const s = st.current;
      const e = els.current;
      const snip = prepared[s.idx];
      // Dòng đã gõ xong ⇒ ghi trọn một lần; dòng đang gõ ghi lại theo từng ký tự.
      while (e.done < s.line && e.lines[e.done]) {
        const l = snip.lines[e.done];
        e.lines[e.done++].innerHTML = htmlUpTo(l.toks, l.text.length);
      }
      const cur = e.lines[s.line];
      if (cur) cur.innerHTML = htmlUpTo(snip.lines[s.line].toks, s.col) + '<span class="aw-code-caret">▏</span>';
    };

    const show = (i: number) => {
      const root = rootRef.current;
      if (!root) return;
      root.querySelectorAll<HTMLElement>('.aw-code-snip').forEach((el) => {
        el.dataset.on = el.dataset.i === String(i) ? '1' : '0';
      });
      const tab = root.querySelector<HTMLElement>('.aw-code-file');
      if (tab) tab.textContent = prepared[i].file;
      const status = root.querySelector<HTMLElement>('.aw-code-status');
      if (status) {
        status.textContent = prepared[i].status;
        status.dataset.on = '0';
      }
      root.dataset.fade = '0';
      const lines = Array.from(root.querySelectorAll<HTMLElement>(`.aw-code-snip[data-i="${i}"] .aw-code-line`));
      lines.forEach((el) => (el.textContent = ''));
      els.current = { lines, done: 0, blink: '' };
    };

    useImperativeHandle(ref, () => ({
      tick(now: number) {
        if (still) return;
        const s = st.current;
        const snip = prepared[s.idx];
        if (s.shown !== s.idx) {
          show(s.idx);
          s.shown = s.idx;
          paint();
        }
        // Con trỏ: đứng yên lúc đang gõ, nhấp nháy ~1 Hz lúc dừng (như editor thật).
        const blink = s.phase === 'type' ? '0' : String(Math.floor(now / 530) % 2);
        if (blink !== els.current.blink && rootRef.current) {
          rootRef.current.dataset.blink = blink;
          els.current.blink = blink;
        }
        if (now < s.next) return;
        if (s.phase === 'type') {
          const line = snip.lines[s.line];
          if (s.col < line.text.length) {
            // Gõ cả cụm khoảng trắng thụt lề một nhịp (người thật cũng vậy).
            const m = line.text.slice(s.col).match(/^ +/);
            s.col += m && s.col === 0 ? m[0].length : 1;
            s.next = now + MS_PER_CHAR * (0.6 + Math.random() * 0.9);
          } else if (s.line < snip.lines.length - 1) {
            s.line++;
            s.col = 0;
            s.next = now + MS_NEWLINE;
          } else {
            s.phase = 'hold';
            s.next = now + HOLD;
            const status = rootRef.current?.querySelector<HTMLElement>('.aw-code-status');
            if (status) status.dataset.on = '1';
          }
          paint();
        } else if (s.phase === 'hold') {
          s.phase = 'fade';
          s.next = now + FADE;
          if (rootRef.current) rootRef.current.dataset.fade = '1';
        } else {
          s.idx = (s.idx + 1) % prepared.length;
          s.shown = -1;
          s.line = 0;
          s.col = 0;
          s.phase = 'type';
          s.next = now + 200;
        }
      },
    }));

    return (
      <div
        ref={rootRef}
        className="aw-code"
        data-still={still ? '' : undefined}
        data-hidden={hidden ? '' : undefined}
        style={{ '--shift': `${shift}px`, '--lines': maxLines } as React.CSSProperties}
        aria-hidden
      >
        <div className="aw-code-bar">
          <i />
          <i />
          <i />
          <span className="aw-code-file">{prepared[0].file}</span>
          <span className="aw-code-lang">Python</span>
        </div>
        <div className="aw-code-body">
          <div className="aw-code-gutter">
            {Array.from({ length: maxLines }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <div className="aw-code-text">
            {prepared.map((p, i) => (
              <pre key={p.file} className="aw-code-snip" data-i={i} data-on={i === 0 ? '1' : '0'}>
                {/* Đang gõ: dòng RỖNG, tick() tự điền (React không giữ con nào để khỏi va chạm). Đứng yên: in trọn. */}
                {p.lines.map((l, k) =>
                  still ? (
                    <span key={k} className="aw-code-line">
                      {l.toks.map(([cls, t], j) => (cls ? <span key={j} className={`aw-t-${cls}`}>{t}</span> : t))}
                    </span>
                  ) : (
                    <span key={k} className="aw-code-line" />
                  ),
                )}
              </pre>
            ))}
          </div>
        </div>
        <p className="aw-code-status" data-on={still ? '1' : '0'}>
          {prepared[0].status}
        </p>
      </div>
    );
  },
);

export default CodeBubble;
