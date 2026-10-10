'use client';

/**
 * NoteCtworkIssue — chip NỘI TUYẾN tham chiếu một thẻ CT Work.
 *
 * ─── THAM CHIẾU, không sao chép ───
 * Node chỉ lưu `issueId` (khoá chính của thẻ) cùng `key`/`title`/`statusColor` làm
 * BẢN NHỚ để hiện ngay khi chưa tải xong (và còn gì đó để đọc nếu sau này mất quyền).
 * Mỗi lần hiển thị, NodeView gọi `/notes/ctwork/issues/:id` lấy trạng thái + màu + URL
 * SỐNG. Mất quyền / thẻ đã xoá ⇒ backend trả 404 ⇒ chip tự xám đi, không lộ gì.
 *
 * Hình lưu: { type: "ctworkIssue", attrs: { issueId, key, title, statusColor } }
 *
 * Chèn chip = backend tự ghi liên kết ghi chú↔thẻ khi LƯU trang (notes.service
 * đọc các node này trong contentJson) ⇒ thẻ hiện ghi chú ở mục "Ghi chú liên kết".
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { CircleDashed } from 'lucide-react';
import { notesApi, type CtworkIssueChip } from '@/lib/api';

export interface CtworkIssueAttrs {
  issueId: number | null;
  key: string;
  title: string;
  statusColor: string;
}

export const NoteCtworkIssue = Node.create({
  name: 'ctworkIssue',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      issueId: {
        default: null,
        parseHTML: (el: HTMLElement) => { const v = Number(el.getAttribute('data-issue-id')); return Number.isInteger(v) && v > 0 ? v : null; },
        renderHTML: (a: { issueId: number | null }) => (a.issueId ? { 'data-issue-id': String(a.issueId) } : {}),
      },
      key:         { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-key') ?? '',      renderHTML: (a: { key: string }) => ({ 'data-key': a.key }) },
      title:       { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-title') ?? '',    renderHTML: (a: { title: string }) => ({ 'data-title': a.title }) },
      statusColor: { default: '', parseHTML: (el: HTMLElement) => el.getAttribute('data-color') ?? '',    renderHTML: (a: { statusColor: string }) => ({ 'data-color': a.statusColor }) },
    };
  },

  parseHTML() { return [{ tag: 'a[data-type="ctwork-issue"]' }, { tag: 'span[data-type="ctwork-issue"]' }]; },

  // Fallback TĨNH (contentHtml máy chủ, nơi không chạy React): một <a> gọn hiện mã + tiêu đề.
  renderHTML({ HTMLAttributes, node }) {
    const a = node.attrs as CtworkIssueAttrs;
    return ['a', mergeAttributes(HTMLAttributes, {
      'data-type': 'ctwork-issue',
      class: 'note-ctwork-chip',
    }), `${a.key || 'CT Work'}${a.title ? ` · ${a.title}` : ''}`];
  },

  addNodeView() { return ReactNodeViewRenderer(ChipView); },

  addCommands() {
    return {
      insertCtworkIssue:
        (attrs: Partial<CtworkIssueAttrs>) =>
        ({ commands }: { commands: any }) =>
          commands.insertContent({ type: this.name, attrs }),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

export default NoteCtworkIssue;

// Bộ nhớ tạm theo id trong một phiên để nhiều chip cùng thẻ không gọi lại nhiều lần.
const chipCache = new Map<number, CtworkIssueChip | null>();

function ChipView({ node }: NodeViewProps) {
  const attrs = node.attrs as CtworkIssueAttrs;
  const issueId = attrs.issueId;
  const [live, setLive] = useState<CtworkIssueChip | null>(issueId != null ? chipCache.get(issueId) ?? null : null);
  const [gone, setGone] = useState(false);
  const [loaded, setLoaded] = useState(issueId != null && chipCache.has(issueId));

  useEffect(() => {
    if (issueId == null) { setGone(true); setLoaded(true); return; }
    if (chipCache.has(issueId)) { const c = chipCache.get(issueId)!; setLive(c); setGone(c === null); setLoaded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await notesApi.ctworkIssue(issueId);
        const data = res.data.data;
        if (cancelled) return;
        chipCache.set(issueId, data);
        setLive(data); setGone(false); setLoaded(true);
      } catch {
        if (cancelled) return;
        chipCache.set(issueId, null);
        setGone(true); setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [issueId]);

  const key = live?.key || attrs.key || 'CT Work';
  const title = live?.title ?? attrs.title ?? '';
  const color = live?.statusColor || attrs.statusColor || '#64748b';
  const url = live?.url ?? '';
  const statusName = live?.status?.name ?? '';

  const inner = (
    <>
      <span
        className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ backgroundColor: gone ? '#94a3b8' : color }}
        aria-hidden
      />
      <span className="font-medium tabular-nums">{key}</span>
      {title && <span className="truncate opacity-80">{title}</span>}
      {gone && loaded && <span className="opacity-60">· (không truy cập được)</span>}
      {statusName && !gone && <span className="opacity-50">· {statusName}</span>}
    </>
  );

  return (
    <NodeViewWrapper
      as="span"
      data-type="ctwork-issue"
      className="inline-flex max-w-full items-baseline align-baseline"
    >
      {url && !gone ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseDown={(e) => e.stopPropagation()}
          className="inline-flex max-w-[22rem] items-center gap-1.5 rounded-[5px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 px-1.5 py-0.5 text-[12.5px] leading-tight text-slate-700 no-underline transition-colors hover:border-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08]"
          title={statusName ? `${key} · ${title} · ${statusName}` : `${key}${title ? ` · ${title}` : ''}`}
        >
          {!loaded && <CircleDashed className="h-3 w-3 animate-spin opacity-50" />}
          {inner}
        </a>
      ) : (
        <span
          className="inline-flex max-w-[22rem] items-center gap-1.5 rounded-[5px] border border-dashed border-slate-300 bg-slate-50 px-1.5 py-0.5 text-[12.5px] leading-tight text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
          title={gone ? 'Thẻ CT Work này không còn truy cập được' : key}
        >
          {!loaded && <CircleDashed className="h-3 w-3 animate-spin opacity-50" />}
          {inner}
        </span>
      )}
    </NodeViewWrapper>
  );
}
