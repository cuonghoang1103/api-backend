/**
 * VAI CT WORK của một phiên CuongMini (chế độ đóng vai, 27/11/2026) — máy chủ: `src/services/work/vaiDong.ts`.
 *
 * Đồ án "một mình 5 vai": người dùng mở 5 phiên CLI (C1 Leader, C2 BA, C3 BE, C4 FE, C5 QA) cùng MỘT token `ctw_` cá
 * nhân. Mỗi phiên giữ vai riêng (`/vai C3` hoặc `cuongmini --vai C3`), lưu vào nhãn phiên (`phien.ts › datVaiPhien`) nên
 * `/resume` và `-c` mở lại đúng vai.
 *
 *   - Lời gọi tool CT Work mang `params._meta["ctwork/vai"]` (mcp.ts) — đổi vai giữa phiên không phải nối lại MCP,
 *     và 5 tiến trình song song không giẫm nhau (vai không lưu ở máy chủ).
 *   - Trợ lý nhận một đoạn gợi ý ngắn theo vai (ghép vào ghi chú dự án của lượt — loop.ts).
 * File thuần (không Electron) — test: `vaiCtwork.test.ts`.
 */

export const VAI = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
export type Vai = (typeof VAI)[number];
export const laVai = (v: unknown): v is Vai => typeof v === 'string' && (VAI as readonly string[]).includes(v);

export const VAI_NGAN: Record<Vai, string> = { C1: 'Leader', C2: 'BA', C3: 'BE', C4: 'FE', C5: 'QA' };
/** "C3 BE" — dùng trong tên phiên và thanh trạng thái. */
export const nhanVaiNgan = (v: Vai): string => `${v} ${VAI_NGAN[v]}`;

/** "c3", "3", "BE", "qa", "leader" ⇒ vai; rỗng/"off"/"none" ⇒ null; không nhận ra ⇒ undefined. */
export function docVai(raw: string | null | undefined): Vai | null | undefined {
  const s = String(raw ?? '').trim().toUpperCase();
  if (!s || s === 'OFF' || s === 'NONE' || s === 'TAT' || s === 'BO' || s === '-') return null;
  const m = /^C?([1-5])$/.exec(s);
  if (m) return `C${m[1]}` as Vai;
  const TEN: Record<string, Vai> = { PM: 'C1', LEADER: 'C1', LEAD: 'C1', BA: 'C2', BE: 'C3', BACKEND: 'C3', FE: 'C4', FRONTEND: 'C4', QA: 'C5', TEST: 'C5', TESTER: 'C5' };
  return TEN[s];
}

/** Gợi ý ngắn cho trợ lý theo vai — cùng tinh thần `GOI_Y_VAI` của máy chủ. */
export const GOI_Y_VAI: Record<Vai, string> = {
  C1: 'Support the student acting as C1 Leader / PM: sprint plan, WBS, risks (RAID), change requests, meetings, weekly report. Keep scope and dates honest; do not write production code in this role.',
  C2: 'Support the student acting as C2 BA: requirements, use cases, business rules, system messages, glossary, Q&A. Ask for missing acceptance criteria; keep every requirement traceable.',
  C3: 'Support the student acting as C3 Dev BE: backend code, APIs, database, unit tests. Link work to the CT Work issue, keep PRs small, never approve your own work.',
  C4: 'Support the student acting as C4 Dev FE: screens, UI states, validation messages, front-end tests. Match the screen names in the SRS.',
  C5: 'Support the student acting as C5 QA: test design, test cases, test runs, defects, UAT, review decisions. Stay independent from the author — question, verify, record evidence.',
};

/** Đoạn ghép vào ghi chú dự án của lượt (AGENTS.md…) khi phiên có vai. */
export function ghiChuVai(vai: Vai): string {
  return [
    `## CT Work acting role: ${nhanVaiNgan(vai)}`,
    'One student plays all five roles (C1 Leader · C2 BA · C3 BE · C4 FE · C5 QA) on ONE CT Work account. This session is the',
    `${nhanVaiNgan(vai)} session: every CT Work change you make is recorded under ${vai}. Never describe the roles as different people.`,
    GOI_Y_VAI[vai],
    'If the user asks for work that belongs to another role, say which role it belongs to and suggest switching with `/vai C1…C5` (or opening that role\'s session).',
  ].join('\n');
}

/** Tên phiên tự đặt: "<tên> · C3 BE". */
export function tenPhienTheoVai(ten: string | null | undefined, vai: Vai): string {
  const t = String(ten ?? '').trim();
  return `${t || 'CuongMini'} · ${nhanVaiNgan(vai)}`.slice(0, 60);
}

/** Tên phiên đã do người dùng tự đặt (khác tên tự sinh theo vai) thì không đè. */
export function laTenTuVai(ten: string | null | undefined): boolean {
  return /· C[1-5] (Leader|BA|BE|FE|QA)$/.test(String(ten ?? '').trim());
}

const theoCuoc = new Map<string, Vai>();
/** CLI: một tiến trình = một cuộc ⇒ vai cuối cùng đặt trong tiến trình (lời gọi CT Work không mang cuộc — menu /ctwork). */
let cuoiTienTrinh: Vai | null = null;

export function datVaiCuoc(cuocId: string, vai: Vai | null): void {
  if (vai) theoCuoc.set(cuocId, vai); else theoCuoc.delete(cuocId);
  cuoiTienTrinh = vai;
}

export function vaiCuaCuoc(cuocId?: string | null): Vai | null {
  if (cuocId) return theoCuoc.get(cuocId) ?? null;
  return cuoiTienTrinh;
}

/** `_meta` gửi kèm `tools/call` của CT Work. */
export function metaVai(vai: Vai | null | undefined): Record<string, unknown> | undefined {
  return vai ? { 'ctwork/vai': vai } : undefined;
}
