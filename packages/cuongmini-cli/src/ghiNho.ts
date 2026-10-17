/**
 * `# …` GHI NHỚ NHANH — dòng bắt đầu bằng `# ` lưu thành quy ước dự án.
 *
 * Lõi đọc `AGENTS.md` / `CLAUDE.md` / `.agentrc.md` ở gốc dự án MỖI lượt
 * (`desktop/src/main/agent/ghiChu.ts`, ưu tiên theo đúng thứ tự đó) — nên ghi
 * vào file ĐANG được lõi đọc là cách chắc chắn nhất để model thấy ngay từ lượt
 * sau. Lõi không có kênh "thêm bài học" cho giao diện (chỉ tool `ghi_nho` của
 * chính agent), nên không dùng bộ nhớ lõi ở đây.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { L } from './i18n';

export const TEN_FILE_QUY_UOC = ['AGENTS.md', 'CLAUDE.md', '.agentrc.md'] as const;
/** Tiêu đề mục — theo ngôn ngữ lúc TẠO; nhận cả hai khi tìm mục đã có. */
export const TIEU_DE_CAC = ['## Ghi nhớ nhanh', '## Quick notes']; // i18n-bo-qua: so khớp nội dung file
export const tieuDeMuc = (): string => L('## Ghi nhớ nhanh', '## Quick notes');

/** File quy ước lõi đang đọc (file đầu tiên có trong dự án), hoặc AGENTS.md sẽ được tạo. */
export function fileQuyUoc(goc: string, coFile: (p: string) => boolean = existsSync): { duong: string; taoMoi: boolean } {
  for (const t of TEN_FILE_QUY_UOC) {
    const p = path.join(goc, t);
    if (coFile(p)) return { duong: p, taoMoi: false };
  }
  return { duong: path.join(goc, 'AGENTS.md'), taoMoi: true };
}

/** `# dùng pnpm` ⇒ `dùng pnpm`; không phải dòng ghi nhớ ⇒ null. (`#` đứng một mình hoặc `#tag` không tính.) */
export function tachGhiNho(text: string): string | null {
  const m = /^#\s+(\S[\s\S]*)$/.exec(text.trim());
  if (!m) return null;
  return m[1]!.replace(/\s*\n\s*/g, ' ').trim().slice(0, 500);
}

/**
 * Chèn một gạch đầu dòng vào mục "Ghi nhớ nhanh" (tạo mục nếu chưa có). Thuần.
 * Ghi vào CUỐI mục — không chen vào giữa phần người dùng tự viết.
 */
export function chenGhiNho(noiDung: string, ghiNho: string): string {
  const dong = `- ${ghiNho}`;
  const goc = noiDung.replace(/\s+$/, '');
  if (!goc) return `${L('# Quy ước dự án', '# Project conventions')}\n\n${tieuDeMuc()}\n\n${dong}\n`;
  const ds = goc.split('\n');
  const i = ds.findIndex((d) => TIEU_DE_CAC.includes(d.trim()));
  if (i < 0) return `${goc}\n\n${tieuDeMuc()}\n\n${dong}\n`;
  let j = i + 1;
  while (j < ds.length && !/^#{1,2}\s/.test(ds[j]!)) j += 1;
  let cuoi = j;
  while (cuoi > i + 1 && !ds[cuoi - 1]!.trim()) cuoi -= 1;
  ds.splice(cuoi, 0, dong);
  return `${ds.join('\n')}\n`;
}

export function luuGhiNho(goc: string, ghiNho: string): { duong: string; taoMoi: boolean } {
  const f = fileQuyUoc(goc);
  const cu = f.taoMoi ? '' : readFileSync(f.duong, 'utf8');
  writeFileSync(f.duong, chenGhiNho(cu, ghiNho));
  return f;
}
