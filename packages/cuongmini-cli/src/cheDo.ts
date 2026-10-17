/**
 * NĂM CHẾ ĐỘ QUYỀN — cùng bộ với app (`CHE_DO_QUYEN` trong `shared/ipc.ts`).
 * `shift+tab` xoay vòng theo đúng thứ tự dưới đây.
 *
 * ⚠️ `boQuaHet` không bao giờ bật "lặng lẽ": app chỉ cho bật qua cửa xác nhận
 * (xem chú thích lớn ở `CHE_DO_QUYEN`), nên CLI xoay tới nó thì HỎI trước —
 * trừ khi người dùng tự gõ `--che-do bo-qua-het` lúc mở.
 */
export type CheDoQuyen = 'keHoach' | 'hoi' | 'tuSua' | 'tuSuaVaLenh' | 'boQuaHet';

export interface MoTaCheDo { id: CheDoQuyen; ten: string; ngan: string; mo: string; icon: string; mau: string }

export const CHE_DO: MoTaCheDo[] = [
  { id: 'keHoach', ten: 'Lập kế hoạch', ngan: 'Kế hoạch', mo: 'Chỉ đọc — không sửa, không chạy lệnh', icon: '⏸', mau: '#22d3ee' },
  { id: 'hoi', ten: 'Hỏi trước mọi việc', ngan: 'Hỏi trước', mo: 'Mỗi lần sửa/chạy lệnh đều hỏi bạn', icon: '✋', mau: '#4ade80' },
  { id: 'tuSua', ten: 'Tự sửa file', ngan: 'Tự sửa', mo: 'Sửa file không hỏi, lệnh vẫn hỏi', icon: '✎', mau: '#a78bfa' },
  { id: 'tuSuaVaLenh', ten: 'Tự động', ngan: 'Tự động', mo: 'Sửa + chạy lệnh an toàn không hỏi', icon: '⚡', mau: '#fbbf24' },
  { id: 'boQuaHet', ten: 'Bỏ qua hết', ngan: 'Bỏ qua hết', mo: 'Không hỏi gì — chỉ dùng khi tin tưởng', icon: '⚠', mau: '#f87171' },
];

export function moTaCheDo(id: string | undefined | null): MoTaCheDo {
  return CHE_DO.find((c) => c.id === id) ?? CHE_DO[0]!;
}

/** Chế độ kế tiếp khi bấm `shift+tab`. */
export function cheDoKe(id: string | undefined | null): CheDoQuyen {
  const i = Math.max(0, CHE_DO.findIndex((c) => c.id === id)); // chưa rõ = đang ở mặc định (Lập kế hoạch)
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
