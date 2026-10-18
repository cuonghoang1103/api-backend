/**
 * NĂM CHẾ ĐỘ QUYỀN — cùng bộ với app (`CHE_DO_QUYEN` trong `shared/ipc.ts`).
 * `shift+tab` xoay vòng theo đúng thứ tự dưới đây.
 *
 * ⚠️ `boQuaHet` không bao giờ bật "lặng lẽ": app chỉ cho bật qua cửa xác nhận
 * (xem chú thích lớn ở `CHE_DO_QUYEN`), nên CLI xoay tới nó thì HỎI trước —
 * trừ khi người dùng tự gõ `--che-do bo-qua-het` lúc mở.
 */
import { L } from './i18n';

export type CheDoQuyen = 'keHoach' | 'hoi' | 'tuSua' | 'tuSuaVaLenh' | 'boQuaHet';

export interface MoTaCheDo { id: CheDoQuyen; ten: string; ngan: string; mo: string; icon: string; mau: string }

export const CHE_DO: MoTaCheDo[] = [
  { id: 'keHoach', get ten() { return L('Lập kế hoạch', 'Plan mode'); }, get ngan() { return L('Kế hoạch', 'Plan'); }, get mo() { return L('Chỉ đọc — không sửa, không chạy lệnh', 'Read-only — no edits, no commands'); }, icon: '⏸', mau: '#22d3ee' },
  { id: 'hoi', get ten() { return L('Hỏi trước mọi việc', 'Ask before edits'); }, get ngan() { return L('Hỏi trước', 'Ask'); }, get mo() { return L('Đủ công cụ — mỗi lần sửa/chạy lệnh đều hỏi bạn', 'All tools — asks before every edit or command'); }, icon: '✋', mau: '#4ade80' },
  { id: 'tuSua', get ten() { return L('Tự sửa file', 'Accept edits'); }, get ngan() { return L('Tự sửa', 'Edits'); }, get mo() { return L('Sửa file không hỏi, lệnh vẫn hỏi', 'Edits without asking, commands still ask'); }, icon: '✎', mau: '#a78bfa' },
  { id: 'tuSuaVaLenh', get ten() { return L('Tự động', 'Auto mode'); }, get ngan() { return L('Tự động', 'Auto'); }, get mo() { return L('Sửa + chạy lệnh an toàn không hỏi', 'Edits + safe commands without asking'); }, icon: '⚡', mau: '#fbbf24' },
  { id: 'boQuaHet', get ten() { return L('Bỏ qua hết', 'Bypass permissions'); }, get ngan() { return L('Bỏ qua hết', 'Bypass'); }, get mo() { return L('Không hỏi gì — chỉ dùng khi tin tưởng', 'Never asks — only when you trust it'); }, icon: '⚠', mau: '#f87171' },
];

export function moTaCheDo(id: string | undefined | null): MoTaCheDo {
  // Chưa biết (lõi chưa trả workspace) ⇒ hiện mặc định của lõi: Hỏi trước.
  return CHE_DO.find((c) => c.id === id) ?? CHE_DO[1]!;
}

/** Chế độ kế tiếp khi bấm `shift+tab`. */
/**
 * Đợt 4 — đổi chế độ GIỮA lượt (lỗi thật 18/10: duyệt xong thẻ MCP thì hiện "⚠ Việc này đang chạy dở — hãy dừng
 * trước khi đổi chế độ" dù người dùng không định đổi — phím shift+tab, thói quen "Yes, don't ask again" của Claude
 * Code, rơi xuống phím toàn cục khi thẻ vừa đóng). Lõi từ chối đổi chế độ khi đang chạy ⇒ KHÔNG gọi lõi: HOÃN tới
 * khi lượt xong. Phím đổi chế độ trong ~800ms sau khi trả lời thẻ duyệt bị bỏ qua (phím thừa của thẻ).
 */
export function quyetDoiCheDo(o: { dangChay: boolean; vuaDuyetMs: number | null; bayGio: number }): 'ngay' | 'hoan' | 'boQua' {
  if (o.vuaDuyetMs !== null && o.bayGio - o.vuaDuyetMs < 800) return 'boQua';
  return o.dangChay ? 'hoan' : 'ngay';
}

export function cheDoKe(id: string | undefined | null): CheDoQuyen {
  const i = CHE_DO.findIndex((c) => c.id === id) < 0 ? 1 : CHE_DO.findIndex((c) => c.id === id); // chưa rõ = mặc định của lõi (Hỏi trước)
  return CHE_DO[(i + 1) % CHE_DO.length]!.id;
}

const BI_DANH: Record<string, CheDoQuyen> = {
  kehoach: 'keHoach', plan: 'keHoach', chidoc: 'keHoach', readonly: 'keHoach',
  hoi: 'hoi', hoitruoc: 'hoi', ask: 'hoi', default: 'hoi',
  tusua: 'tuSua', acceptedits: 'tuSua', edit: 'tuSua',
  tudong: 'tuSuaVaLenh', tusuavalenh: 'tuSuaVaLenh', auto: 'tuSuaVaLenh',
  boquahet: 'boQuaHet', bypass: 'boQuaHet', bypasspermissions: 'boQuaHet', yolo: 'boQuaHet',
};

/** Chữ người dùng gõ ở `--che-do` ⇒ mã chế độ. Bỏ dấu, gạch, khoảng trắng, hoa/thường. */
export function cheDoTuChu(chu: string): CheDoQuyen | null {
  const k = chu.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[\s_.-]+/g, '');
  return BI_DANH[k] ?? null;
}
