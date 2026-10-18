'use client';

/**
 * Trình xem tệp mã: tô màu cú pháp (highlight.js — chỉ các ngữ pháp của exp-hub/hljsCore, nạp lười) + số dòng, bấm số
 * dòng để đánh dấu. Tệp > 400 KB hiện chữ trơn (tô màu cả tệp lớn làm đứng trình duyệt). DiffView: diff unified.
 */

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { escapeHtml, languageOf, parsePatch, splitHighlighted } from './codeText';

const HIGHLIGHT_MAX = 400_000;

export function CodeBlock({ path, content }: { path: string; content: string }) {
  const lang = languageOf(path);
  const [html, setHtml] = useState<string[] | null>(null);
  const [hi, setHi] = useState<number | null>(null);
  const plain = useMemo(() => content.replace(/\n$/, '').split('\n').map(escapeHtml), [content]);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    if (!lang || content.length > HIGHLIGHT_MAX) return;
    void import('@/components/exp-hub/hljsCore').then(({ default: hljs }) => {
      if (!alive) return;
      try {
        const out = hljs.highlight(content.replace(/\n$/, ''), { language: lang, ignoreIllegals: true }).value;
        setHtml(splitHighlighted(out));
      } catch { /* ngữ pháp không có ⇒ chữ trơn */ }
    });
    return () => { alive = false; };
  }, [content, lang]);

  useEffect(() => {
    const m = /^#L(\d+)$/.exec(window.location.hash);
    if (m) setHi(Number(m[1]));
  }, [path]);

  const lines = html ?? plain;
  return (
    <div className="w-code-view overflow-x-auto">
      <table>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i} id={`L${i + 1}`} className={cn(hi === i + 1 && 'cv-hi')}>
              <td
                className="cv-num"
                onClick={() => { setHi(i + 1); try { history.replaceState(null, '', `#L${i + 1}`); } catch { /* bỏ qua */ } }}
              >
                {i + 1}
              </td>
              {/* HTML do highlight.js sinh (đã thoát ký tự) hoặc escapeHtml — không có HTML thô của tệp. */}
              <td className="cv-code" dangerouslySetInnerHTML={{ __html: l || ' ' }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DiffView({ patch }: { patch: string }) {
  const rows = useMemo(() => parsePatch(patch), [patch]);
  return (
    <div className="w-code-view overflow-x-auto">
      <table>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.kind === 'add' ? 'cv-add' : r.kind === 'del' ? 'cv-del' : r.kind === 'hunk' || r.kind === 'meta' ? 'cv-hunk' : undefined}>
              <td className="cv-num !cursor-default">{r.oldNo ?? ''}</td>
              <td className="cv-num !cursor-default">{r.newNo ?? ''}</td>
              <td className="cv-code">
                <span aria-hidden="true" className="mr-2 inline-block w-2 select-none opacity-70">{r.kind === 'add' ? '+' : r.kind === 'del' ? '−' : ' '}</span>
                {r.text || ' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
