/**
 * 🤖 AI THỐNG KÊ chi tiêu cổng Claude chính hãng (23/10/2026) — trang admin /admin/commerce?tab=anthropic.
 * ─────────────────────────────────────────────────────────────────────────
 * Admin bấm một câu hỏi có sẵn ⇒ MÃ gom số liệu thật từ sổ `anthropic_usage_logs` (hôm nay theo lịch giờ Việt Nam):
 * tổng, theo việc, theo model, theo key, bảng xếp hạng người dùng + trần/hạn mức từng người. Rồi Sonnet 5.5 (cổng chính
 * hãng, key của chủ app) chỉ VIẾT phần nhận xét + ĐỀ XUẤT giới hạn. Nguyên tắc:
 *  - Mọi con số hiển thị trong bảng do MÃ tính, không phải model bịa; model chỉ diễn giải từ đúng dữ liệu đã đưa.
 *  - Model KHÔNG tự đổi trần. Nó đề xuất `hanhDong`; admin bấm "Áp dụng" thì giao diện gọi PUT /tran/nguoi/:id có sẵn.
 *    `hanhDong` bị lọc ở đây: chỉ người có trong bảng xếp hạng, không phải admin, số trong 0–1000.
 *  - USD là SỐ TỰ ĐO (usage × bảng giá trong mã), không phải số dư thật.
 *  - Model gãy/hết key ⇒ vẫn trả bảng số liệu, `traLoi = null` kèm lý do.
 */
import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/logger.js';
import { dauNgayVn, dauThangVn, goiCuaNguoi, xemHanMucChinhHang } from './hanMuc.js';
import { dsKeyAdmin } from './thongKe.js';
import { goiVanBanChinhHang } from './dinhTuyen.js';

export const MODEL_THONG_KE = 'claude-sonnet-5-5';

export const CAU_HOI_SAN = [
  { id: 'tong', nhan: 'Hôm nay đã tiêu bao nhiêu $?', y: 'Tóm tắt tổng chi hôm nay (USD, số lượt, lỗi người dùng thấy — tách khỏi lần thử lại tự động), so với hôm qua và trung bình 7 ngày trước; nói rõ nhanh hay chậm hơn bình thường.' },
  { id: 'nguon', nhan: 'Tiền hôm nay đến từ đâu, việc gì, model nào?', y: 'Chia tiền hôm nay theo VIỆC (AI Code, thi, CT Work…), theo MODEL và theo KEY; chỉ ra khoản lớn nhất và vì sao đáng chú ý.' },
  { id: 'xep-hang', nhan: 'Xếp hạng người dùng nhiều nhất hôm nay', y: 'Nêu top người dùng chi nhiều nhất hôm nay từ cao xuống thấp (tên, gói, USD, việc chính), và nhận xét ai đáng lo.' },
  { id: 'gan-tran', nhan: 'Ai sắp chạm trần?', y: 'Liệt kê người đã/sắp chạm trần ngày hoặc tháng (so đã dùng với trần), kèm mức đã dùng %.' },
  { id: 'bat-thuong', nhan: 'Có gì bất thường không?', y: 'Tìm bất thường: người chi vọt so với 7 ngày trước, tỉ lệ lỗi THẬT cao (không tính lần cổng tự thử lại thành công; nêu nguyên nhân theo mã lỗi), một việc/model tăng đột biến, lượt đắt bất thường.' },
  { id: 'de-xuat', nhan: 'Đề xuất giới hạn / tăng hạn mức từng người', y: 'Đề xuất đặt hoặc nới trần ngày/tháng cho từng người đáng xét (hạ người dùng quá tay, nới người dùng hợp lý). Mỗi đề xuất phải có lý do dựa trên số liệu và đưa vào `hanhDong`.' },
  { id: 'key', nhan: 'Các key còn bao nhiêu, đủ tới cuối tháng không?', y: 'Đánh giá từng key: đã dùng/ngân sách, còn lại, và dự báo (chi trung bình/ngày × số ngày còn lại) có đủ tới cuối chu kỳ không.' },
] as const;
export type IdCauHoi = (typeof CAU_HOI_SAN)[number]['id'];

const TEN_VIEC: Record<string, string> = {
  agent_code: 'AI Code (app/CLI)', agent_taitro: 'AI Code — admin tài trợ', exam_tutor: 'CuongMini trong phòng thi',
  thu_ket_noi: 'Thử kết nối', tim_web: 'Tìm web', language_tutor: 'Trò chuyện ngoại ngữ', work_setup: 'Create with CuongMini (CT Work)',
  work_ai: 'Trợ lý CT Work', admin_thong_ke: 'AI thống kê (chính admin)',
};
const lamTron = (n: number, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

/* ── LỖI: lần THỬ hỏng ≠ lỗi người dùng thấy (28/10/2026) ─────────────────────────────────────────────
 * `goi.ts › guiChinhHang` ghi MỘT dòng `thanhCong: false` cho MỖI lần thử hỏng TRƯỚC khi luồng mở (`MANG`,
 * `HTTP_<mã>`), kể cả khi nó tự thử key kế (429/529/5xx/401/403/hết credit) hoặc gửi lại bản tối giản cùng key
 * (400 vì tham số beta/thinking) rồi THÀNH CÔNG — người dùng không thấy gì. Sổ không có mã lượt/yêu cầu để nối các
 * lần thử với nhau, nên dùng ước đoán: lần thử hỏng TRƯỚC luồng được coi là "đã tự xử lý" khi CÙNG người + CÙNG
 * việc có một lượt thành công BẮT ĐẦU trong `CUA_SO_TU_XU_LY_MS` sau nó (bắt đầu = createdAt − thoiGianMs, vì dòng
 * thành công chỉ được ghi khi luồng xong). Luồng đứt giữa chừng (`LUONG_GAY` / không mã) thì cổng KHÔNG gửi lại
 * (chữ đã chảy tới người dùng) ⇒ luôn tính là lỗi thật. */
export const CUA_SO_TU_XU_LY_MS = 120_000;
/** Lần thử lại bắt đầu ngay sau khi dòng hỏng được ghi (ghi không chờ) — cho lệch vài giây. */
const LECH_TRUOC_MS = 5_000;

/** Mã lỗi xảy ra TRƯỚC khi luồng mở — loại cổng tự thử lại được. */
export function laLoiTruocLuong(ma: string | null): boolean {
  return ma === 'MANG' || /^HTTP_\d{3}$/.test(ma ?? '');
}

/** Nhãn tiếng Việt cho một mã lỗi trong sổ. */
export function nhanMaLoi(ma: string | null): string {
  if (!ma || ma === 'LUONG_GAY') return 'Luồng trả lời đứt giữa chừng (có thể do người dùng bấm Dừng hoặc rớt mạng)';
  if (ma === 'MANG') return 'Mất kết nối mạng tới Anthropic';
  const m = /^HTTP_(\d{3})$/.exec(ma);
  if (!m) return ma;
  const s = Number(m[1]);
  if (s === 429) return 'Bị giới hạn tốc độ (rate limit) — cổng thử key kế';
  if (s === 529) return 'Anthropic quá tải (overloaded) — cổng thử key kế';
  if (s === 402) return 'Key hết credit — cổng thử key kế';
  if (s === 401 || s === 403) return 'Key sai / bị khoá — cổng thử key kế';
  if (s === 400) return 'Yêu cầu bị từ chối: tham số beta/thinking (cổng tự gửi lại bản tối giản), key hết credit, hoặc yêu cầu sai';
  if (s === 408 || s === 409) return 'Anthropic hết thời gian / xung đột — cổng thử key kế';
  if (s >= 500) return `Anthropic lỗi máy chủ (${s}) — cổng thử key kế`;
  return `HTTP ${s}`;
}

export interface DongLoiSo { userId: number | null; viec: string; maLoi: string | null; createdAt: Date }
export interface DongOkSo { userId: number | null; viec: string; createdAt: Date; thoiGianMs: number }
export interface MaLoiDem { ma: string; nhan: string; tong: number; tuXuLy: number; that: number }
export interface TomTatLoi {
  /** Tổng lần THỬ hỏng ghi sổ. */
  tong: number;
  /** Cổng tự thử lại (key kế / bản tối giản) và thành công — người dùng không thấy lỗi. */
  tuXuLy: number;
  /** Không thấy lần thử lại nào thành công — người dùng có thể đã thấy lỗi (hoặc được lùi sang cổng khác). */
  that: number;
  theoMa: MaLoiDem[];
}

const khoaCap = (userId: number | null, viec: string) => `${userId ?? 'null'}|${viec}`;

/** Phân loại từng lần thử hỏng: đã tự xử lý hay lỗi thật; gom chung + theo người + theo mã. Thuần, để test. */
export function phanTichLoi(loi: DongLoiSo[], ok: DongOkSo[], cuaSoMs = CUA_SO_TU_XU_LY_MS): {
  chung: TomTatLoi; theoNguoi: Map<number | null, TomTatLoi>;
} {
  const batDauOk = new Map<string, number[]>();
  for (const r of ok) {
    const k = khoaCap(r.userId, r.viec);
    const ds = batDauOk.get(k) ?? [];
    ds.push(r.createdAt.getTime() - Math.max(0, r.thoiGianMs));
    batDauOk.set(k, ds);
  }
  const moi = (): { tong: number; tuXuLy: number; that: number; ma: Map<string, MaLoiDem> } => ({ tong: 0, tuXuLy: 0, that: 0, ma: new Map() });
  const chung = moi();
  const nguoi = new Map<number | null, ReturnType<typeof moi>>();
  const cong = (g: ReturnType<typeof moi>, ma: string, tuXuLy: boolean) => {
    g.tong++;
    if (tuXuLy) g.tuXuLy++; else g.that++;
    const d = g.ma.get(ma) ?? { ma, nhan: nhanMaLoi(ma === 'KHONG_MA' ? null : ma), tong: 0, tuXuLy: 0, that: 0 };
    d.tong++;
    if (tuXuLy) d.tuXuLy++; else d.that++;
    g.ma.set(ma, d);
  };
  for (const r of loi) {
    const t = r.createdAt.getTime();
    const tuXuLy = laLoiTruocLuong(r.maLoi)
      && (batDauOk.get(khoaCap(r.userId, r.viec)) ?? []).some((b) => b >= t - LECH_TRUOC_MS && b <= t + cuaSoMs);
    const ma = r.maLoi || 'KHONG_MA';
    cong(chung, ma, tuXuLy);
    const g = nguoi.get(r.userId) ?? moi();
    cong(g, ma, tuXuLy);
    nguoi.set(r.userId, g);
  }
  const ra = (g: ReturnType<typeof moi>): TomTatLoi => ({
    tong: g.tong, tuXuLy: g.tuXuLy, that: g.that,
    theoMa: [...g.ma.values()].sort((a, b) => b.tong - a.tong || a.ma.localeCompare(b.ma)),
  });
  return { chung: ra(chung), theoNguoi: new Map([...nguoi.entries()].map(([k, v]) => [k, ra(v)])) };
}

/** % lỗi người dùng thấy trên số yêu cầu ước tính (lượt thành công + lỗi thật). */
export function tiLeLoiThat(luot: number, l: Pick<TomTatLoi, 'tong' | 'that'>): number | null {
  const yeuCau = luot - l.tong + l.that;
  return yeuCau > 0 ? Math.round((l.that / yeuCau) * 1000) / 10 : null;
}

export interface HanhDongDeXuat {
  loai: 'dat_tran' | 'xoa_tran';
  userId: number;
  ten: string;
  /** free = CuongMini Free (Sonic/Heshin 5.5) · cao = model Claude cao (cần vé). */
  hang?: 'free' | 'cao';
  ngayUsd?: number | null;
  thangUsd?: number | null;
  lyDo: string;
}

export interface DongXepHang {
  userId: number | null; ten: string; email: string | null; goi: string;
  usdHomNay: number; usdHomQua: number; tbNgay7: number; usdThang: number;
  /** Số dòng sổ hôm nay — GỒM cả lần thử hỏng. */
  luot: number;
  /** Tổng lần THỬ hỏng (giữ tên cũ); tách ra ở `loiTuXuLy` + `loiThat`. */
  loi: number; loiTuXuLy: number; loiThat: number; tiLeLoiThatPct: number | null; loiTheoMa: MaLoiDem[];
  viecChinh: string; viecTheoTien: Array<{ viec: string; usd: number }>;
  han: null | {
    free: { daNgay: number; tranNgay: number | null; daThang: number; tranThang: number | null; nguon: string };
    cao: { daNgay: number; tranNgay: number | null; daThang: number; tranThang: number | null; nguon: string };
  };
}

export async function gomSoLieu(luc = new Date()) {
  const dau = dauNgayVn(luc);
  const hqDau = new Date(dau.getTime() - 86_400_000);
  const b7Dau = new Date(dau.getTime() - 7 * 86_400_000);
  const dauT = dauThangVn(luc);
  const tongNgay = (tu: Date, den?: Date) => prisma.anthropicUsage.aggregate({
    where: { createdAt: { gte: tu, ...(den ? { lt: den } : {}) } }, _sum: { costUsd: true }, _count: true,
  });
  const [homNay, homQua, bay, dongLoi, theoViec, theoModel, theoKey, nguoiViec, nguoiHqRaw, nguoi7Raw, nguoiThangRaw, keys] = await Promise.all([
    tongNgay(dau), tongNgay(hqDau, dau), tongNgay(b7Dau, dau),
    prisma.anthropicUsage.findMany({
      where: { createdAt: { gte: dau }, thanhCong: false },
      select: { userId: true, viec: true, maLoi: true, createdAt: true }, take: 20_000,
    }),
    prisma.anthropicUsage.groupBy({ by: ['viec'], where: { createdAt: { gte: dau } }, _sum: { costUsd: true }, _count: true }),
    prisma.anthropicUsage.groupBy({ by: ['model', 'hang'], where: { createdAt: { gte: dau } }, _sum: { costUsd: true }, _count: true }),
    prisma.anthropicUsage.groupBy({ by: ['keyId'], where: { createdAt: { gte: dau } }, _sum: { costUsd: true }, _count: true }),
    prisma.anthropicUsage.groupBy({ by: ['userId', 'viec'], where: { createdAt: { gte: dau } }, _sum: { costUsd: true }, _count: true }),
    prisma.anthropicUsage.groupBy({ by: ['userId'], where: { createdAt: { gte: hqDau, lt: dau } }, _sum: { costUsd: true } }),
    prisma.anthropicUsage.groupBy({ by: ['userId'], where: { createdAt: { gte: b7Dau, lt: dau } }, _sum: { costUsd: true } }),
    prisma.anthropicUsage.groupBy({ by: ['userId'], where: { createdAt: { gte: dauT } }, _sum: { costUsd: true } }),
    dsKeyAdmin(luc).catch(() => []),
  ]);
  /* Lượt thành công của đúng các cặp (người, việc) có lần thử hỏng TRƯỚC luồng — để biết lần nào đã tự xử lý. */
  const capCanXet = [...new Map(dongLoi.filter((r) => laLoiTruocLuong(r.maLoi))
    .map((r) => [khoaCap(r.userId, r.viec), { userId: r.userId, viec: r.viec }])).values()].slice(0, 300);
  const dongOk = capCanXet.length ? await prisma.anthropicUsage.findMany({
    where: { createdAt: { gte: dau }, thanhCong: true, OR: capCanXet },
    select: { userId: true, viec: true, createdAt: true, thoiGianMs: true }, take: 50_000,
  }) : [];
  const loiPhanTich = phanTichLoi(dongLoi, dongOk);
  const KHONG_LOI: TomTatLoi = { tong: 0, tuXuLy: 0, that: 0, theoMa: [] };

  const g = new Map<number | null, { usd: number; luot: number; viec: Array<{ viec: string; usd: number }> }>();
  for (const r of nguoiViec) {
    const cu = g.get(r.userId) ?? { usd: 0, luot: 0, viec: [] };
    const u = r._sum.costUsd ?? 0;
    cu.usd += u; cu.luot += r._count; cu.viec.push({ viec: TEN_VIEC[r.viec] ?? r.viec, usd: lamTron(u) });
    g.set(r.userId, cu);
  }
  const xep = [...g.entries()].sort((a, b) => b[1].usd - a[1].usd).slice(0, 25);
  const ids = xep.map(([id]) => id).filter((x): x is number => x !== null);
  const users = ids.length ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, email: true, username: true, fullName: true } }) : [];
  const lay = (ds: Array<{ userId: number | null; _sum: { costUsd: number | null } }>, id: number | null) =>
    ds.find((r) => r.userId === id)?._sum.costUsd ?? 0;

  const xepHang: DongXepHang[] = await Promise.all(xep.map(async ([id, v], i) => {
    const u = users.find((x) => x.id === id);
    let goi = 'không rõ';
    let han: DongXepHang['han'] = null;
    if (id !== null && i < 15) { // chỉ tra trần cho 15 người đầu — mỗi người vài truy vấn.
      goi = await goiCuaNguoi(id).catch(() => 'khac');
      const [f, c] = await Promise.all([xemHanMucChinhHang(id, 'free', luc), xemHanMucChinhHang(id, 'cao', luc)]).catch(() => [null, null] as const);
      if (f && c) {
        const m = (h: typeof f) => ({ daNgay: lamTron(h.daDungNgay, 2), tranNgay: h.tranNgay, daThang: lamTron(h.daDungThang, 2), tranThang: h.tranThang, nguon: h.nguon });
        han = { free: m(f), cao: m(c) };
      }
    } else if (id !== null) goi = 'chưa tra';
    const viec = v.viec.sort((a, b) => b.usd - a.usd);
    return {
      userId: id, ten: id === null ? 'Hệ thống / không gắn người' : u?.fullName || u?.username || `#${id}`, email: u?.email ?? null, goi,
      usdHomNay: lamTron(v.usd), usdHomQua: lamTron(lay(nguoiHqRaw, id)), tbNgay7: lamTron(lay(nguoi7Raw, id) / 7), usdThang: lamTron(lay(nguoiThangRaw, id), 2),
      luot: v.luot,
      ...((l) => ({ loi: l.tong, loiTuXuLy: l.tuXuLy, loiThat: l.that, tiLeLoiThatPct: tiLeLoiThat(v.luot, l), loiTheoMa: l.theoMa }))(loiPhanTich.theoNguoi.get(id) ?? KHONG_LOI),
      viecChinh: viec[0]?.viec ?? '—', viecTheoTien: viec.slice(0, 4), han,
    };
  }));

  const tong = homNay._sum.costUsd ?? 0;
  const gioVn = (luc.getTime() - dau.getTime()) / 3_600_000;
  const ngayConLai = Math.max(0, (new Date(Date.UTC(luc.getUTCFullYear(), luc.getUTCMonth() + 1, 1)).getTime() - luc.getTime()) / 86_400_000);
  return {
    luc: luc.toISOString(),
    ghiChu: 'USD là số tự đo (usage Anthropic trả × bảng giá trong mã), không phải số dư thật. Ngày tính theo lịch giờ Việt Nam.',
    ghiChuLoi: '`luot` = số dòng sổ, GỒM cả lần thử hỏng. `loi` = tổng lần THỬ hỏng; `loiTuXuLy` = cổng tự thử key kế / gửi lại bản tối giản và thành công trong ~2 phút (người dùng KHÔNG thấy lỗi); `loiThat` = phần còn lại, người dùng có thể đã thấy lỗi (hoặc được lùi sang cổng khác). `tiLeLoiThatPct` = loiThat ÷ (lượt thành công + loiThat). `loiTheoMa` chia theo mã lỗi kèm nhãn nguyên nhân. Key chạm ngân sách tháng thì bị bỏ qua TRƯỚC khi gọi nên không sinh dòng lỗi.',
    homNay: {
      usd: lamTron(tong), luot: homNay._count,
      loi: loiPhanTich.chung.tong, loiTuXuLy: loiPhanTich.chung.tuXuLy, loiThat: loiPhanTich.chung.that,
      tiLeLoiThatPct: tiLeLoiThat(homNay._count, loiPhanTich.chung), loiTheoMa: loiPhanTich.chung.theoMa,
      gioDaQua: lamTron(gioVn, 1),
      duBaoCaNgayUsd: gioVn >= 1 ? lamTron((tong / gioVn) * 24, 2) : null,
    },
    homQua: { usd: lamTron(homQua._sum.costUsd ?? 0), luot: homQua._count },
    tb7NgayTruoc: { usdMoiNgay: lamTron((bay._sum.costUsd ?? 0) / 7), luotMoiNgay: Math.round(bay._count / 7) },
    theoViec: theoViec.map((r) => ({ viec: TEN_VIEC[r.viec] ?? r.viec, usd: lamTron(r._sum.costUsd ?? 0), luot: r._count })).sort((a, b) => b.usd - a.usd),
    theoModel: theoModel.map((r) => ({ model: r.model, hang: r.hang, usd: lamTron(r._sum.costUsd ?? 0), luot: r._count })).sort((a, b) => b.usd - a.usd),
    theoKey: theoKey.map((r) => ({ key: keys.find((k) => k.id === r.keyId)?.nhan ?? (r.keyId === null ? 'không rõ' : `#${r.keyId}`), usd: lamTron(r._sum.costUsd ?? 0), luot: r._count })),
    keys: keys.map((k) => ({
      nhan: k.nhan, trangThai: k.trangThai, daDungChuKyUsd: k.daDungUsd, nganSachThangUsd: k.nganSachThangUsd, conLaiUocUsd: k.conLaiUocUsd,
      lamMoiLuc: k.chuKy.lamMoiLuc, boQua: k.boQua,
    })),
    ngayConLaiTrongThang: lamTron(ngayConLai, 1),
    xepHang,
  };
}
export type SoLieu = Awaited<ReturnType<typeof gomSoLieu>>;

/** Lọc đề xuất của model: chỉ người CÓ trong bảng, không phải admin, số hợp lý. */
export function locHanhDong(tho: unknown, soLieu: Pick<SoLieu, 'xepHang'>): HanhDongDeXuat[] {
  if (!Array.isArray(tho)) return [];
  const ra: HanhDongDeXuat[] = [];
  const so = (v: unknown): number | null | undefined => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 1000 ? Math.round(n * 100) / 100 : undefined;
  };
  for (const h of tho.slice(0, 12)) {
    const o = (h ?? {}) as Record<string, unknown>;
    const nguoi = soLieu.xepHang.find((x) => x.userId === Number(o.userId));
    if (!nguoi || nguoi.userId === null || nguoi.goi === 'admin') continue;
    const loai = o.loai === 'xoa_tran' ? 'xoa_tran' : o.loai === 'dat_tran' ? 'dat_tran' : null;
    if (!loai) continue;
    const lyDo = String(o.lyDo ?? '').trim().slice(0, 300);
    if (loai === 'xoa_tran') { ra.push({ loai, userId: nguoi.userId, ten: nguoi.ten, lyDo }); continue; }
    const hang = o.hang === 'cao' ? 'cao' : 'free';
    const ngayUsd = so(o.ngayUsd);
    const thangUsd = so(o.thangUsd);
    if (ngayUsd === undefined && thangUsd === undefined) continue;
    ra.push({ loai, userId: nguoi.userId, ten: nguoi.ten, hang, ...(ngayUsd !== undefined ? { ngayUsd } : {}), ...(thangUsd !== undefined ? { thangUsd } : {}), lyDo });
  }
  return ra;
}

/** Tách JSON ra khỏi câu trả lời (model có thể bọc ```json). */
export function tachJson(text: string): { traLoi?: unknown; hanhDong?: unknown } | null {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(t.slice(a, b + 1)); } catch { return null; }
}

const HE_THONG = [
  'Bạn là trợ lý tài chính cho CHỦ ứng dụng, phân tích chi tiêu cổng Claude chính hãng (key của chủ app). Trả lời bằng TIẾNG VIỆT, ngắn, thẳng, có số.',
  'Chỉ dùng số trong DỮ LIỆU được đưa; không bịa số, không suy đoán thứ không có trong dữ liệu. USD là số tự đo, không phải số dư thật — nhắc một lần nếu liên quan.',
  'Trần "null" = không giới hạn. Gói "admin" luôn không giới hạn: không đề xuất trần cho admin.',
  'Trả về DUY NHẤT một JSON hợp lệ (không chữ ngoài JSON): {"traLoi": "<markdown ngắn: tối đa ~14 dòng, dùng gạch đầu dòng và **đậm** cho số quan trọng>", "hanhDong": [ ... ]}.',
  '`hanhDong` là mảng đề xuất đổi trần, CHỈ khi câu hỏi yêu cầu giới hạn/nới hạn mức, hoặc khi có người rõ ràng cần xử lý; không thì []. Mỗi phần tử: {"loai":"dat_tran"|"xoa_tran","userId":<số trong xepHang>,"hang":"free"|"cao","ngayUsd":<số|null>,"thangUsd":<số|null>,"lyDo":"<1 câu dựa trên số liệu>"}. `free` = CuongMini Free (Sonic/Heshin 5.5), `cao` = model Claude cao.',
  'Đề xuất hợp lý: hạ trần người dùng vọt so với trung bình 7 ngày, nới trần người dùng đều đặn gần chạm trần. Tối đa 8 đề xuất.',
  'LỖI: đọc `ghiChuLoi`. Lần thử hỏng đã được cổng tự xử lý (`loiTuXuLy`) KHÔNG phải lỗi người dùng thấy — không gọi đó là "tỉ lệ lỗi cao", chỉ nhắc ngắn là cổng đã tự thử lại. Chỉ đánh giá tỉ lệ lỗi bằng `loiThat` / `tiLeLoiThatPct`. Khi nói về lỗi, nêu nguyên nhân theo `loiTheoMa` (vd: 429 = giới hạn tốc độ, 529 = Anthropic quá tải, 400 = tham số beta/thinking hoặc key hết credit, MANG = mất mạng, luồng đứt = có thể người dùng bấm Dừng). Không đề xuất hạ trần chỉ vì lỗi.',
].join('\n');

export async function traLoiThongKe(adminId: number, o: { id?: string; cauHoi?: string }, luc = new Date()) {
  const san = CAU_HOI_SAN.find((c) => c.id === o.id);
  const tuDo = String(o.cauHoi ?? '').trim().slice(0, 300);
  if (!san && !tuDo) throw new Error('Thiếu câu hỏi');
  const soLieu = await gomSoLieu(luc);
  const yeuCau = san ? `${san.nhan}\nYêu cầu: ${san.y}` : `Câu hỏi của admin: ${tuDo}`;
  let traLoi: string | null = null;
  let hanhDong: HanhDongDeXuat[] = [];
  let loi: string | null = null;
  let usd = 0;
  try {
    const r = await goiVanBanChinhHang({
      system: HE_THONG,
      messages: [{ role: 'user', content: `${yeuCau}\n\nDỮ LIỆU (JSON):\n${JSON.stringify({ ...soLieu, xepHang: soLieu.xepHang.map((x) => ({ ...x, email: undefined })) }).slice(0, 60_000)}` }],
      model: MODEL_THONG_KE, hang: 'free', maxTokens: 3000, userId: adminId, viec: 'admin_thong_ke',
      nhanh: { effort: 'medium' },
      signal: AbortSignal.timeout(90_000),
    });
    usd = r.usd;
    const j = tachJson(r.text);
    if (j && typeof j.traLoi === 'string') {
      traLoi = j.traLoi;
      hanhDong = locHanhDong(j.hanhDong, soLieu);
    } else {
      traLoi = r.text.trim() || null; // model không theo khuôn JSON: vẫn cho đọc, không có nút áp dụng.
    }
  } catch (err) {
    loi = (err as Error).message.slice(0, 300);
    logger.warn('[ai-thong-ke] model hỏng — chỉ trả bảng số liệu', { error: loi });
  }
  return { cauHoiId: san?.id ?? null, soLieu, traLoi, hanhDong, loi, model: MODEL_THONG_KE, usdLuotNay: lamTron(usd) };
}
