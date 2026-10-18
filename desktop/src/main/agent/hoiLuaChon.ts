/**
 * ============================================================
 * HỎI NGƯỜI DÙNG BẰNG LỰA CHỌN — tool `hoi_nguoi_dung` (đợt 3, 18/10/2026)
 * ============================================================
 *
 * Tương đương AskUserQuestion của Claude Code: agent hỏi 1–4 câu, mỗi câu 2–4
 * lựa chọn (+ "Khác" gõ tự do). Vòng lặp DỪNG THẬT chờ người dùng — cùng cơ
 * chế với thẻ duyệt (`xinPhep.ts`): ba cách thoát đều giải phóng lời hứa
 * (trả lời · bấm Dừng · hết giờ), thiếu một là lượt treo vĩnh viễn.
 *
 * Khác thẻ duyệt: hết giờ / bị huỷ KHÔNG phải "từ chối" mà là "người dùng
 * chưa trả lời" — agent được bảo tự chọn hướng an toàn nhất và nói rõ.
 */

export interface LuaChon { nhan: string; moTa?: string }
export interface CauHoi { cauHoi: string; tieuDe?: string; luaChon: LuaChon[]; nhieu?: boolean }

/** Câu trả lời của MỘT câu hỏi: các nhãn đã chọn + chữ tự do (ô "Khác"). */
export interface TraLoiCau { chon: string[]; khac?: string | undefined }

export type KetQuaHoi =
  | { ok: true; traLoi: TraLoiCau[] }
  | { ok: false; lyDo: 'hetGio' | 'huy' | 'boQua' };

/** 30 phút: câu hỏi chặn cả việc, nhưng người dùng có thể đang đi pha cà phê. */
const HET_GIO_MS = 30 * 60_000;

const dangCho = new Map<string, { xong: (k: KetQuaHoi) => void; soCau: number }>();
let dem = 0;

/** Kiểm + dọn tham số model gửi. Trả chuỗi lỗi khi sai (đưa lại cho model sửa). */
export function docCauHoi(args: Record<string, unknown>): CauHoi[] | string {
  const tho = Array.isArray(args.cau_hoi) ? args.cau_hoi : null;
  if (!tho || tho.length === 0) return 'thiếu "cau_hoi" (mảng 1–4 câu).';
  if (tho.length > 4) return 'tối đa 4 câu hỏi một lần.';
  const ra: CauHoi[] = [];
  for (const [i, x] of tho.entries()) {
    if (!x || typeof x !== 'object') return `câu ${i + 1} không hợp lệ.`;
    const o = x as Record<string, unknown>;
    const cau = typeof o.cau_hoi === 'string' ? o.cau_hoi.trim().slice(0, 500) : '';
    if (!cau) return `câu ${i + 1} thiếu "cau_hoi".`;
    const lc = Array.isArray(o.lua_chon) ? o.lua_chon : [];
    const luaChon: LuaChon[] = [];
    for (const l of lc) {
      if (typeof l === 'string' && l.trim()) luaChon.push({ nhan: l.trim().slice(0, 80) });
      else if (l && typeof l === 'object' && typeof (l as { nhan?: unknown }).nhan === 'string') {
        const ll = l as { nhan: string; mo_ta?: unknown };
        const nhan = ll.nhan.trim().slice(0, 80);
        if (nhan) luaChon.push({ nhan, ...(typeof ll.mo_ta === 'string' && ll.mo_ta.trim() ? { moTa: ll.mo_ta.trim().slice(0, 240) } : {}) });
      }
    }
    if (luaChon.length < 2 || luaChon.length > 4) return `câu ${i + 1} cần 2–4 lựa chọn (đang có ${luaChon.length}). Ô "Khác" app tự thêm.`;
    if (new Set(luaChon.map((l) => l.nhan)).size !== luaChon.length) return `câu ${i + 1} có hai lựa chọn trùng nhãn.`;
    ra.push({
      cauHoi: cau, luaChon,
      ...(typeof o.tieu_de === 'string' && o.tieu_de.trim() ? { tieuDe: o.tieu_de.trim().slice(0, 30) } : {}),
      ...(o.nhieu === true ? { nhieu: true } : {}),
    });
  }
  return ra;
}

/** Đặt câu hỏi và CHỜ. `phat` đẩy thẻ lên giao diện. */
export function hoi(
  cau: CauHoi[],
  phat: (id: string) => void,
  signal: AbortSignal,
  hetGioMs = HET_GIO_MS,
): Promise<KetQuaHoi> {
  const id = `hoi_${++dem}_${Date.now().toString(36)}`;
  return new Promise<KetQuaHoi>((resolve) => {
    let xongRoi = false;
    const ketThuc = (k: KetQuaHoi): void => {
      if (xongRoi) return;
      xongRoi = true;
      clearTimeout(dongHo);
      dangCho.delete(id);
      signal.removeEventListener('abort', huy);
      resolve(k);
    };
    function huy(): void { ketThuc({ ok: false, lyDo: 'huy' }); }
    const dongHo = setTimeout(() => ketThuc({ ok: false, lyDo: 'hetGio' }), hetGioMs);
    dangCho.set(id, { xong: ketThuc, soCau: cau.length });
    if (signal.aborted) { huy(); return; }
    signal.addEventListener('abort', huy, { once: true });
    phat(id);
  });
}

/** Giao diện trả lời. `traLoi = null` ⇒ người dùng bấm "Bỏ qua". `false` = không có câu hỏi đó. */
export function traLoiHoi(id: string, traLoi: TraLoiCau[] | null): boolean {
  const m = dangCho.get(id);
  if (!m) return false;
  if (traLoi === null) { m.xong({ ok: false, lyDo: 'boQua' }); return true; }
  const sach = Array.from({ length: m.soCau }, (_, i) => {
    const t = traLoi[i];
    return {
      chon: Array.isArray(t?.chon) ? t!.chon.filter((x) => typeof x === 'string').map((x) => x.slice(0, 80)).slice(0, 4) : [],
      ...(typeof t?.khac === 'string' && t.khac.trim() ? { khac: t.khac.trim().slice(0, 2000) } : {}),
    };
  });
  m.xong({ ok: true, traLoi: sach });
  return true;
}

/** Chữ đưa lại cho model. */
export function moTaKetQua(cau: CauHoi[], k: KetQuaHoi): string {
  if (!k.ok) {
    const vi = k.lyDo === 'boQua' ? 'NGƯỜI DÙNG BỎ QUA câu hỏi' : k.lyDo === 'hetGio' ? 'NGƯỜI DÙNG CHƯA TRẢ LỜI (hết giờ)' : 'Câu hỏi bị huỷ (người dùng bấm Dừng)';
    return `${vi}. Tự chọn hướng an toàn/ít đảo ngược nhất, NÓI RÕ bạn đã chọn gì và vì sao — đừng hỏi lại cùng câu.`;
  }
  return cau.map((c, i) => {
    const t = k.traLoi[i]!;
    const phan = [...t.chon, ...(t.khac ? [`(tự gõ) ${t.khac}`] : [])];
    return `Câu ${i + 1}: ${c.cauHoi}\n→ ${phan.length ? phan.join(' · ') : '(không chọn gì)'}`;
  }).join('\n\n') + '\n\n(Đây là câu trả lời của chính người dùng — làm theo.)';
}

/** Huỷ mọi câu hỏi đang treo (đóng app / xoá hội thoại). */
export function huyMoiHoi(): void {
  for (const [, m] of dangCho) m.xong({ ok: false, lyDo: 'huy' });
  dangCho.clear();
}

export function soCauDangCho(): number { return dangCho.size; }
