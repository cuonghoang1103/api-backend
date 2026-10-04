'use client';

/**
 * CT Work — TÀI LIỆU DỰ ÁN (đợt S2a, mô-đun docs): mảnh dùng chung.
 * Backend: src/services/work/pages.service.ts — client: workDocsApi (lib/work-api.ts).
 *
 * Luật hiển thị: mọi thứ Docs chỉ hiện khi `studioOn(config, 'docs')`. Quyền sửa
 * lấy từ server (`page.canEdit` / `list.canEdit`) VÀ `config.permissions.editDocs`
 * (tắt khi người xem bật khoá chỉnh sửa) — đừng tự suy từ vai.
 */

import { useQuery } from '@tanstack/react-query';
import { Eye, Lock } from 'lucide-react';
import {
  workDocsApi, workDocsKeys, type PageStatus, type PageVisibility, type ProjectConfig, type WorkPageItem,
} from '@/lib/work-api';
import { Pill } from '../studio/shared';

export const PAGE_STATUS: Record<PageStatus, { label: string; tone: 'neutral' | 'orange' | 'green' | 'blue' }> = {
  DRAFT: { label: 'Draft', tone: 'neutral' },
  IN_REVIEW: { label: 'In review', tone: 'orange' },
  APPROVED: { label: 'Approved', tone: 'green' },
  ARCHIVED: { label: 'Archived', tone: 'neutral' },
};

export const PageStatusPill = ({ status, className }: { status: PageStatus; className?: string }) => (
  <Pill tone={PAGE_STATUS[status].tone} className={className}>{PAGE_STATUS[status].label}</Pill>
);

/** Chấm trạng thái nhỏ trong cây (Draft không có chấm — đỡ rối mắt). */
export function StatusDot({ status }: { status: PageStatus }) {
  if (status === 'DRAFT') return null;
  const c = status === 'APPROVED' ? 'var(--w-green)' : status === 'IN_REVIEW' ? 'var(--w-orange)' : 'var(--w-status-todo)';
  return <span title={PAGE_STATUS[status].label} aria-label={PAGE_STATUS[status].label} className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c }} />;
}

export function VisibilityBadge({ visibility, compact }: { visibility: PageVisibility; compact?: boolean }) {
  if (visibility === 'CLIENT') {
    return (
      <span title="Visible to the client" className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-accent-text)]">
        <Eye size={11} aria-hidden="true" />{!compact && 'Client'}
      </span>
    );
  }
  if (compact) return null;
  return (
    <span title="Only the project team can see this page" className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-text-2)]">
      <Lock size={11} aria-hidden="true" />Internal
    </span>
  );
}

export const docsBase = (config: Pick<ProjectConfig, 'workspace' | 'key'>) => `/work/${config.workspace.slug}/${config.key}/docs`;

export function useDocsList(pid: number | undefined, enabled = true) {
  return useQuery({
    queryKey: workDocsKeys.list(pid ?? 0),
    queryFn: () => workDocsApi.list(pid!),
    enabled: !!pid && enabled,
    staleTime: 15_000,
  });
}

export interface TreeNode { page: WorkPageItem; children: TreeNode[]; depth: number }

/** Danh sách phẳng ⇒ cây (cha mất/không thấy được ⇒ nổi lên gốc). */
export function buildTree(pages: WorkPageItem[]): TreeNode[] {
  const byId = new Map(pages.map((p) => [p.id, p]));
  const kids = new Map<number | null, WorkPageItem[]>();
  for (const p of pages) {
    const parent = p.parentId !== null && byId.has(p.parentId) ? p.parentId : null;
    const arr = kids.get(parent) ?? [];
    arr.push(p);
    kids.set(parent, arr);
  }
  const sort = (a: WorkPageItem, b: WorkPageItem) => a.position - b.position || a.id - b.id;
  const make = (parent: number | null, depth: number, seen: Set<number>): TreeNode[] =>
    (kids.get(parent) ?? []).sort(sort).filter((p) => !seen.has(p.id)).map((p) => {
      seen.add(p.id);
      return { page: p, depth, children: make(p.id, depth + 1, seen) };
    });
  return make(null, 0, new Set());
}

/** Tải tệp .md của một trang (Blob — chạy cả trong app desktop). */
export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
