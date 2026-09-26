'use client';

/**
 * Tiện ích chữ dùng chung cho thanh bên, trang chủ Sổ tay và bảng lệnh ⌘K.
 *
 * ⚠️ `foldVi` PHẢI giữ nguyên độ dài chuỗi (mỗi ký tự gốc ra đúng một ký tự),
 * vì vị trí khớp tìm trên chuỗi đã gập được dùng lại để TÔ ĐẬM trên chuỗi gốc.
 * Bản ở máy chủ (`foldVi` trong `src/services/notes.service.ts`) theo đúng luật
 * này — sửa một bên thì sửa cả bên kia.
 *
 * ⚠️ KHÔNG dùng `\b` của regex để bắt "đầu từ": `\b` của JS chỉ hiểu [A-Za-z0-9_],
 * nên "ệ" bị coi là ranh giới từ và "Hệ" khớp nhầm ở giữa chữ. Ở đây "đầu từ"
 * = đứng đầu chuỗi hoặc ngay sau một khoảng trắng.
 */
import { Fragment, type ReactNode } from 'react';

export function foldVi(input: string): string {
  let out = '';
  for (const ch of input) {
    const lower = ch.toLowerCase();
    if (lower === 'đ') { out += 'd'; continue; }
    const base = lower.normalize('NFD').replace(/[̀-ͯ]/g, '');
    out += base.length === ch.length ? base : lower.length === ch.length ? lower : ch;
  }
  return out;
}

/** Khoá so trùng tên anh em: không phân biệt hoa thường, gộp khoảng trắng thừa.
 *  CỐ Ý không bỏ dấu — "Ma trận" và "Mã trận" là hai tên khác nhau. */
export function normName(input: string): string {
  return input.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Mọi vị trí [start, end) khớp `q` trong `text` (bỏ dấu, không phân biệt hoa thường). */
export function matchRanges(text: string, q: string): [number, number][] {
  const fq = foldVi(q.trim());
  if (!fq || !text) return [];
  const ft = foldVi(text);
  const out: [number, number][] = [];
  let from = 0;
  while (from <= ft.length) {
    const i = ft.indexOf(fq, from);
    if (i < 0) break;
    out.push([i, i + fq.length]);
    from = i + Math.max(1, fq.length);
  }
  return out;
}

export function foldIncludes(text: string, q: string): boolean {
  const fq = foldVi(q.trim());
  return !fq || foldVi(text).includes(fq);
}

/** Vẽ `text` với phần khớp `q` được tô đậm. */
export function Highlight({ text, q, className = '' }: { text: string; q: string; className?: string }): ReactNode {
  const ranges = matchRanges(text, q);
  if (ranges.length === 0) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  ranges.forEach(([s, e], i) => {
    if (s > last) parts.push(<Fragment key={`t${i}`}>{text.slice(last, s)}</Fragment>);
    parts.push(
      <mark
        key={`m${i}`}
        className={`rounded-[3px] bg-amber-200/70 px-[1px] font-semibold text-inherit dark:bg-amber-400/25 ${className}`}
      >
        {text.slice(s, e)}
      </mark>,
    );
    last = e;
  });
  if (last < text.length) parts.push(<Fragment key="tail">{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}

/** Hộp thư — một NoteSubject bình thường, nhận diện bằng clientId (quy ước chung
 *  với tính năng Ghi nhanh). Tên là phương án dự phòng khi API cũ chưa trả clientId. */
export const INBOX_CLIENT_ID = 'he-thong:hop-thu';
export function isInboxSubject(s: { clientId?: string | null; name: string; emoji?: string | null }): boolean {
  if (s.clientId) return s.clientId === INBOX_CLIENT_ID;
  return s.name.trim() === '📥 Hộp thư';
}

/** Tên hiển thị của môn: Hộp thư đã mang sẵn 📥 trong TÊN, bỏ đi để khỏi hiện "📥 📥". */
export function subjectName(s: { clientId?: string | null; name: string; emoji?: string | null }): string {
  return isInboxSubject(s) ? s.name.replace(/^📥\s*/u, '') || 'Hộp thư' : s.name;
}
/** "emoji Tên" để làm đường dẫn. */
export function subjectCrumb(s: { clientId?: string | null; name: string; emoji?: string | null }): string {
  return `${isInboxSubject(s) ? '📥' : s.emoji || '📚'} ${subjectName(s)}`;
}

export function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diff = Math.max(0, Date.now() - t) / 1000;
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}
