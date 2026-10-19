/**
 * Đợt 8D (19/10/2026) — lõi THUẦN của thanh bên dự án gọn: mục CỐT LÕI theo loại dự án, ghim / bỏ ghim, tìm mục.
 * Không import gì (chạy được bằng `npx tsx --test frontend/src/components/work/shell/sidebarNav.test.ts` từ gốc repo).
 *
 * Người dùng (19/10): "App nhiều chức năng và tự show ra all nút … rối và khó dùng. Mặc định nó ẩn rồi dùng gì chính
 * nó ấn ra xem". Dự án học tiếng Nhật cá nhân từng có 20+ mục. Giờ nhóm chính chỉ là bộ cốt lõi của loại dự án
 * (+ mục người dùng ghim, + mục đang mở); phần còn lại vào "Thêm…".
 */

export type SidebarKind = 'PERSONAL' | 'SCHOOL' | 'SOFTWARE' | 'CLIENT';
export interface NavPinEntry { pin: string[]; hide: string[] }
export type NavPinMap = Record<string, NavPinEntry>;

/** Bộ cốt lõi theo loại dự án — thứ tự ở đây là thứ tự hiện. Mục không có quyền / mô-đun tắt vẫn bị lọc bỏ ở ngoài. */
export const CORE_BY_KIND: Record<SidebarKind, readonly string[]> = {
  // Cá nhân / tự học: Board, Thẻ, Docs, Lịch (Dòng thời gian).
  PERSONAL: ['board', 'list', 'docs', 'timeline'],
  // Nhóm ở trường: + Backlog, Chat, Họp, Nộp bài.
  SCHOOL: ['board', 'backlog', 'list', 'docs', 'chat', 'meetings', 'submit', 'timeline'],
  // Phần mềm: Backlog, Board, Thẻ, Docs, Chat, Code (khi nối repo), Phát hành.
  SOFTWARE: ['backlog', 'board', 'list', 'docs', 'chat', 'code', 'releases'],
  // Làm cho khách: như phần mềm + Phê duyệt, Cổng khách.
  CLIENT: ['backlog', 'board', 'list', 'docs', 'chat', 'code', 'releases', 'approvals', 'portal'],
};

/** Mục mà một số mẫu dự án dùng hằng ngày (mẫu môn học FPT). */
const CORE_BY_TEMPLATE: Record<string, readonly string[]> = {
  SWT301: ['tests'],
  SWR302: ['requirements', 'wiegers'],
  CAPSTONE: ['requirements', 'wiegers'],
  SWP391: ['requirements'],
};

/** Loại dự án: ưu tiên `kind` máy chủ trả; dự án cũ thiếu trường ⇒ suy từ mẫu như máy chủ. */
export function sidebarKind(p: { kind?: string | null; template?: string | null }): SidebarKind {
  const k = p.kind;
  if (k === 'PERSONAL' || k === 'SCHOOL' || k === 'SOFTWARE' || k === 'CLIENT') return k;
  const t = p.template ?? '';
  if (t === 'FREELANCE' || t === 'COMPANY') return 'CLIENT';
  if (t === 'SWR302' || t === 'SWT301' || t === 'SWP391' || t === 'CAPSTONE') return 'SCHOOL';
  return 'SOFTWARE';
}

/** Bộ cốt lõi của MỘT dự án: theo loại + mẫu; Kanban không có sprint ⇒ bỏ Backlog. */
export function coreFor(p: { kind?: string | null; template?: string | null; type?: string | null }): string[] {
  const out = [...CORE_BY_KIND[sidebarKind(p)]];
  for (const x of CORE_BY_TEMPLATE[p.template ?? ''] ?? []) if (!out.includes(x)) out.push(x);
  return p.type === 'KANBAN' ? out.filter((x) => x !== 'backlog') : out;
}

/** Mục nào nằm ở nhóm chính. */
export function isPrimary(path: string, core: readonly string[], e: NavPinEntry | undefined): boolean {
  if (e?.hide.includes(path)) return false;
  return core.includes(path) || !!e?.pin.includes(path);
}

/** Trạng thái mới sau khi ghim (on = true) / bỏ ghim một mục. */
export function togglePin(path: string, on: boolean, core: readonly string[], e: NavPinEntry | undefined): NavPinEntry {
  const pin = (e?.pin ?? []).filter((p) => p !== path);
  const hide = (e?.hide ?? []).filter((p) => p !== path);
  const inCore = core.includes(path);
  if (on && !inCore) pin.push(path);
  if (!on && inCore) hide.push(path);
  return { pin, hide };
}

/** Thứ tự nhóm chính: bộ cốt lõi theo thứ tự của loại dự án, rồi mục đã ghim theo thứ tự ghim. */
export function primaryOrder(core: readonly string[], e: NavPinEntry | undefined): string[] {
  const out = core.filter((p) => isPrimary(p, core, e));
  for (const p of e?.pin ?? []) if (!out.includes(p)) out.push(p);
  return out;
}

/** Đã tuỳ chỉnh khác mặc định chưa (để hiện "Khôi phục mặc định"). */
export const isCustomized = (e: NavPinEntry | undefined) => !!e && (e.pin.length > 0 || e.hide.length > 0);

/** Chữ để so khi tìm: thường, bỏ dấu tiếng Việt (gõ "hop" ra "Họp", "phe duyet" ra "Phê duyệt"). */
export function foldSearch(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

/** Khớp truy vấn với nhãn (+ từ khoá phụ, vd tên tiếng Anh): mọi từ của truy vấn phải có mặt. */
export function matchesQuery(q: string, ...texts: (string | undefined)[]): boolean {
  const words = foldSearch(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = foldSearch(texts.filter(Boolean).join(' '));
  return words.every((w) => hay.includes(w));
}
