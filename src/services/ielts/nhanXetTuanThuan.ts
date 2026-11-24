/**
 * NHẬN XÉT HỌC TẬP HẰNG TUẦN của CuongMini (tiếng Anh) — phần THUẦN (không CSDL, không mạng), 24/11/2026.
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Chia việc:
 *   · MÃ tính mọi con số (`tinhSoLieu`), chọn 3 điểm yếu có bằng chứng (`chonDiemYeu`), xếp kế hoạch tuần sau có link
 *     thẳng tới buổi/bài (`lapKeHoach`).
 *   · LLM (việc `language_weekly`) CHỈ viết chữ quanh các con số đó (`dungPrompt`). Mã kiểm lại (`kiemNhanXet`): con số
 *     nào trong chữ của model không có trong dữ liệu đưa vào ⇒ bỏ đoạn đó, thay bằng chữ dự phòng do mã viết.
 *   · Không có dữ liệu ⇒ không gọi LLM; báo cáo nói thẳng là chưa có gì và gợi ý bắt đầu.
 * Phần CSDL + gọi model: `nhanXetTuan.service.ts`. Test: `nhanXetTuan.test.ts`.
 */

/* ───────────────────────────── Khoá học + mục lục ───────────────────────────── */

export const KHOA_EN = ['sach1', 'sach2', 'sach3', 'sach4', 'sach5', 'giaotiep1'] as const;
export type KhoaEn = (typeof KHOA_EN)[number];
export const laKhoaEn = (v: string): v is KhoaEn => (KHOA_EN as readonly string[]).includes(v);

export const DUONG = {
  soLoi: '/language/en/ielts/so-loi',
  theTu: '/language/en/ielts/the-tu',
  thiMay: '/language/en/ielts/thi-may',
  hocTuVung: '/language/en/hoc-tu-vung',
  nhanXet: '/language/en/nhan-xet-tuan',
} as const;

/** Mục lục nhẹ (`content/ielts/muc-luc-khoa.json`, sinh bằng `scripts/ielts-muc-luc-khoa.mts`). */
export type MucLucBuoi = { phut: number; bai: [id: string, kind: string, ten: string, phut: number][]; quiz: [id: string, ten: string, lessonId: string][] };
export type MucLucKhoa = { duong: string; ten: string; soBuoi: number; buoi: Record<string, MucLucBuoi> };
export type MucLuc = { khoa: Record<string, MucLucKhoa> };

/** Tra cứu nhanh dựng từ mục lục. */
export type ChiMuc = {
  bai: Map<string, { stage: string; buoi: number; ten: string; phut: number }>;
  quiz: Map<string, { stage: string; buoi: number; ten: string; lessonId: string }>;
};
export function dungChiMuc(ml: MucLuc): ChiMuc {
  const bai: ChiMuc['bai'] = new Map();
  const quiz: ChiMuc['quiz'] = new Map();
  for (const [stage, k] of Object.entries(ml.khoa)) {
    for (const [n, b] of Object.entries(k.buoi)) {
      for (const [id, , ten, phut] of b.bai) bai.set(`${stage}:${id}`, { stage, buoi: Number(n), ten, phut });
      for (const [id, ten, lessonId] of b.quiz) quiz.set(`${stage}:${id}`, { stage, buoi: Number(n), ten, lessonId });
    }
  }
  return { bai, quiz };
}

/** Số buổi từ id bài/bài tập: `d3-…` (Tập 1) · `t2d14-…` · `gtd7-…`. */
export function buoiTuId(id: string): number | null {
  const m = /^(?:t\dd|gtd|d)(\d{1,3})-/.exec(id);
  return m ? Number(m[1]) : null;
}

/* ───────────────────────────── Tuần (giờ Việt Nam) ───────────────────────────── */

const MOT_NGAY = 86_400_000;
const LECH_VN = 7 * 3_600_000;

/** 'YYYY-MM-DD' theo giờ VN. */
export const ngayVN = (d: Date): string => new Date(d.getTime() + LECH_VN).toISOString().slice(0, 10);
export const congNgay = (ngay: string, n: number): string => new Date(Date.parse(`${ngay}T00:00:00Z`) + n * MOT_NGAY).toISOString().slice(0, 10);
/** Thứ Hai của tuần chứa ngày (giờ VN) đó. */
export function thuHaiCua(ngay: string): string {
  const thu = new Date(`${ngay}T00:00:00Z`).getUTCDay(); // 0 = CN
  return congNgay(ngay, -((thu + 6) % 7));
}
export const tuanCua = (d: Date): string => thuHaiCua(ngayVN(d));
export const tuanHopLe = (s: unknown): s is string =>
  typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && thuHaiCua(s) === s;
/** [0h thứ Hai, 0h thứ Hai tuần sau) giờ VN, đổi ra Date (UTC). */
export function khungTuan(tuan: string): { tuLuc: Date; denLuc: Date } {
  const tu = Date.parse(`${tuan}T00:00:00Z`) - LECH_VN;
  return { tuLuc: new Date(tu), denLuc: new Date(tu + 7 * MOT_NGAY) };
}
/** Tuần đã KHÉP LẠI gần nhất (tuần trước tuần đang diễn ra). */
export const tuanDaXongGanNhat = (bayGio: Date): string => congNgay(tuanCua(bayGio), -7);
export const THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;
const ddmm = (ngay: string) => `${ngay.slice(8, 10)}/${ngay.slice(5, 7)}`;

/* ───────────────────────────── Dữ liệu thô (service gom) ───────────────────────────── */

export type TienDoTho = { stage: string; kind: string; muc: string; xong: boolean; diem: number | null; createdAt: Date; updatedAt: Date };
export type LuotThiTho = {
  kyNang: string; cheDo: string; dung: number | null; tong: number | null; band: number | null; giay: number; createdAt: Date;
  /** Writing: trung bình từng tiêu chí của lượt (TR/TA gộp thành 'TR'). Speaking: fc/lr/gra/p. */
  tieuChi?: Record<string, number> | null;
  /** Speaking: điểm phát âm Azure trung bình (0–100) của lượt, nếu có. */
  azure?: number | null;
};
export type SoLoiTho = { kyNang: string; dang: string; lyDo: string | null; lanSai: number; daXong: boolean; hanOn: Date; createdAt: Date; updatedAt: Date; lanOnCuoi: Date | null };
export type TheCtlTho = { chu: string; themLuc: Date; khoangNgay: number; lanOnCuoi: Date | null; denHan: Date; trongSoHtv: boolean };

export type DuLieuTho = {
  tuan: string;
  bayGio: Date;
  /** Tiến độ các khoá tiếng Anh (bai + baitap), mọi thời điểm. */
  tienDo: TienDoTho[];
  /** Ngày có học (bảng hoc_ngay) của các khoá tiếng Anh — 'YYYY-MM-DD'. */
  ngayHocKhoa: string[];
  /** Thẻ IELTS: số thẻ đã thuộc (khoảng ≥ 21 ngày) và tổng số thẻ. */
  theIelts: { tong: number; daThuoc: number };
  onIelts: { ngay: string; diem: number; moi: boolean }[];
  luotThi: LuotThiTho[];
  soLoi: SoLoiTho[];
  /** Hoạt động app CT Language (tiếng Anh) theo ngày. */
  ctlNgay: { ngay: string; giay: number; theOn: number; goi: number; thi: number }[];
  theCtl: TheCtlTho[];
  ctlThi: { kyThi: string; cap: string; diem: number | null; diemToiDa: number | null; nopLuc: Date }[];
  xepLop: { tap: number; ngay: number; overall: number | null } | null;
  /** Lộ trình từ vựng theo ngày (tiếng Anh): id bài + khoá từ, đúng thứ tự. null = kho không có. */
  loTrinhTu: { id: string; ten: string; k: string[] }[] | null;
};

/* ───────────────────────────── Đọc chiTiet của lượt thi máy ───────────────────────────── */

const so = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** Writing: trung bình từng tiêu chí qua các Task của lượt (TA gộp vào TR). */
export function tieuChiViet(chiTiet: unknown): Record<string, number> | null {
  const ai = (chiTiet as { ai?: Record<string, { tieuChi?: { ma?: string; band?: number }[] }> } | null)?.ai;
  if (!ai || typeof ai !== 'object') return null;
  const gom = new Map<string, number[]>();
  for (const kq of Object.values(ai)) {
    for (const t of kq?.tieuChi ?? []) {
      const b = so(t?.band);
      if (b == null || !t?.ma) continue;
      const ma = t.ma === 'TA' ? 'TR' : t.ma;
      gom.set(ma, [...(gom.get(ma) ?? []), b]);
    }
  }
  return gom.size ? Object.fromEntries([...gom].map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])) : null;
}
/** Speaking: bốn tiêu chí + điểm Azure trung bình theo số từ. */
export function tieuChiNoi(chiTiet: unknown): { tieuChi: Record<string, number> | null; azure: number | null } {
  const c = chiTiet as { tieuChi?: Record<string, unknown>; banGhi?: { phatAm?: { tong?: number; soTu?: number } | null }[] } | null;
  const tc: Record<string, number> = {};
  for (const k of ['fc', 'lr', 'gra', 'p']) { const v = so(c?.tieuChi?.[k]); if (v != null) tc[k] = v; }
  const co = (c?.banGhi ?? []).map((b) => b?.phatAm).filter((p): p is { tong: number; soTu: number } => !!p && so(p.tong) != null && (so(p.soTu) ?? 0) > 0);
  const tongTu = co.reduce((s, p) => s + p.soTu, 0);
  return { tieuChi: Object.keys(tc).length ? tc : null, azure: tongTu ? co.reduce((s, p) => s + p.tong * p.soTu, 0) / tongTu : null };
}

/* ───────────────────────────── Số liệu tuần (MÃ tính) ───────────────────────────── */

export type KhoaSoLieu = {
  stage: string; ten: string; duong: string;
  baiXong: number; baiXongTruoc: number; daXongTong: number; tongBai: number; tiLe: number;
  buoiKeTiep: number | null; soBuoi: number;
  baiTap: { so: number; tb: number | null; thap: { id: string; ten: string; buoi: number | null; diem: number; lessonId: string | null }[] };
  hoatDongCuoi: string | null;
};
export type KyNangSo = { so: number; bandTb: number | null; bandTruoc: number | null; dungTb: number | null };
export type SoLieuTuan = {
  tuan: string; tuNgay: string; denNgay: string; soNgayTinh: number; dangDo: boolean; trong: boolean;
  ngayHoc: { so: number; tren: number; truoc: number; ds: string[] };
  chuoi: number;
  phut: { tong: number; baiHoc: number; thiMay: number; appCTL: number; onThe: number; truoc: number };
  theoNgay: { ngay: string; thu: string; phut: number; coHoc: boolean }[];
  khoa: KhoaSoLieu[];
  tuVung: {
    ielts: { moi: number; luotOn: number; tiLeNho: number | null; quen: number; daThuoc: number; moiTruoc: number };
    ctl: { moi: number; daOn: number; nhoSau: number; tongThe: number; denHan: number; moiTruoc: number };
    loTrinh: { ngayKeTiep: { id: string; ten: string } | null; ngayDaXong: number; tongNgay: number } | null;
  };
  thi: {
    soLuot: number; soLuotTruoc: number;
    kyNang: Record<'doc' | 'nghe' | 'viet' | 'noi', KyNangSo>;
    tieuChiViet: Record<string, number> | null;
    tieuChiNoi: Record<string, number> | null;
    azure: number | null;
    bandTong: number | null;
  };
  soLoi: { moi: number; saiLai: number; theoDang: { dang: string; ky: string; so: number; lanSai: number }[]; theoLyDo: { lyDo: string; so: number; ngoaiDangDau: number }[]; denHan: number; vung: number };
  ctlThi: { so: number; ds: { kyThi: string; cap: string; diem: number | null; diemToiDa: number | null }[] };
  xepLop: { tap: number; ngay: number; overall: number | null } | null;
};

export const LY_DO_TEN: Record<string, string> = {
  paraphrase: 'bẫy paraphrase / đồng nghĩa', 'so-tu': 'không đọc kỹ yêu cầu số từ', 'chinh-ta': 'sai chính tả',
  'ngu-phap': 'sai ngữ pháp (số ít/nhiều, dạng từ)', 'ng-false': 'nhầm NOT GIVEN với FALSE/NO', 'doc-sot': 'đọc lướt sót ý',
  'nghe-sot': 'nghe sót / không theo kịp', 'tu-vung': 'không biết từ', 'het-gio': 'hết giờ / bỏ trống', khac: 'lý do khác',
};
export const KY_TEN: Record<string, string> = { doc: 'Reading', nghe: 'Listening', viet: 'Writing', noi: 'Speaking', tuvung: 'Từ vựng', tong: 'Full test' };
export const TIEU_CHI_TEN: Record<string, string> = {
  TR: 'Task Response / Achievement', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammatical Range & Accuracy',
  fc: 'Fluency & Coherence', lr: 'Lexical Resource', gra: 'Grammatical Range & Accuracy', p: 'Pronunciation',
};

const tron1 = (x: number) => Math.round(x * 10) / 10;
const tb = (ds: number[]): number | null => (ds.length ? ds.reduce((a, b) => a + b, 0) / ds.length : null);
const trongKhoang = (d: Date, tu: Date, den: Date) => d.getTime() >= tu.getTime() && d.getTime() < den.getTime();
const PHUT_BAI_MAC_DINH = 25;
/** Một lần chấm thẻ ≈ 12 giây (ước tính, ghi rõ trên giao diện). */
const PHUT_MOI_THE = 0.2;

export function tinhSoLieu(d: DuLieuTho, ml: MucLuc, cm: ChiMuc = dungChiMuc(ml)): SoLieuTuan {
  const { tuLuc, denLuc: cuoiTuan } = khungTuan(d.tuan);
  const denLuc = new Date(Math.min(cuoiTuan.getTime(), d.bayGio.getTime()));
  const truocTu = new Date(tuLuc.getTime() - 7 * MOT_NGAY);
  const dangDo = d.bayGio.getTime() < cuoiTuan.getTime();
  const ngayTuan = Array.from({ length: 7 }, (_, i) => congNgay(d.tuan, i));
  const homNay = ngayVN(d.bayGio);
  const soNgayTinh = dangDo ? Math.max(1, ngayTuan.filter((x) => x <= homNay).length) : 7;
  const trongTuan = (ngay: string) => ngay >= d.tuan && ngay <= congNgay(d.tuan, 6) && ngay <= homNay;
  const tuanTruoc = (ngay: string) => ngay >= congNgay(d.tuan, -7) && ngay < d.tuan;

  // ── Phút theo ngày + tập ngày có học ──
  const phutNgay = new Map<string, number>();
  const coHoc = new Set<string>();
  const cong = (ngay: string, phut: number) => { phutNgay.set(ngay, (phutNgay.get(ngay) ?? 0) + phut); };
  let baiHoc = 0, thiMay = 0, appCTL = 0, onThe = 0;
  let phutTruoc = 0;
  const ngayTruoc = new Set<string>();

  const baiXongTheoKhoa = new Map<string, number>();
  const baiXongTruocTheoKhoa = new Map<string, number>();
  for (const t of d.tienDo) {
    if (t.kind === 'bai' && t.xong) {
      const n = ngayVN(t.createdAt);
      const phut = cm.bai.get(`${t.stage}:${t.muc}`)?.phut ?? PHUT_BAI_MAC_DINH;
      if (trongKhoang(t.createdAt, tuLuc, denLuc)) {
        baiXongTheoKhoa.set(t.stage, (baiXongTheoKhoa.get(t.stage) ?? 0) + 1);
        baiHoc += phut; cong(n, phut); coHoc.add(n);
      } else if (trongKhoang(t.createdAt, truocTu, tuLuc)) {
        baiXongTruocTheoKhoa.set(t.stage, (baiXongTruocTheoKhoa.get(t.stage) ?? 0) + 1);
        phutTruoc += phut; ngayTruoc.add(n);
      }
    } else if (t.kind === 'baitap') {
      const n = ngayVN(t.updatedAt);
      if (trongTuan(n)) coHoc.add(n); else if (tuanTruoc(n)) ngayTruoc.add(n);
    }
  }
  for (const n of d.ngayHocKhoa) { if (trongTuan(n)) coHoc.add(n); else if (tuanTruoc(n)) ngayTruoc.add(n); }
  for (const l of d.luotThi) {
    const n = ngayVN(l.createdAt);
    const p = Math.round(l.giay / 60);
    if (trongKhoang(l.createdAt, tuLuc, denLuc)) { thiMay += p; cong(n, p); coHoc.add(n); }
    else if (trongKhoang(l.createdAt, truocTu, tuLuc)) { phutTruoc += p; ngayTruoc.add(n); }
  }
  for (const c of d.ctlNgay) {
    const p = Math.round(c.giay / 60);
    const co = c.giay > 0 || c.theOn > 0 || c.goi > 0 || c.thi > 0;
    if (trongTuan(c.ngay)) { appCTL += p; cong(c.ngay, p); if (co) coHoc.add(c.ngay); }
    else if (tuanTruoc(c.ngay)) { phutTruoc += p; if (co) ngayTruoc.add(c.ngay); }
  }
  const onTheoNgay = new Map<string, number>();
  for (const r of d.onIelts) onTheoNgay.set(r.ngay, (onTheoNgay.get(r.ngay) ?? 0) + 1);
  for (const [n, so] of onTheoNgay) {
    const p = so * PHUT_MOI_THE;
    if (trongTuan(n)) { onThe += p; cong(n, p); coHoc.add(n); }
    else if (tuanTruoc(n)) { phutTruoc += p; ngayTruoc.add(n); }
  }
  for (const m of d.soLoi) {
    if (m.lanOnCuoi && trongKhoang(m.lanOnCuoi, tuLuc, denLuc)) coHoc.add(ngayVN(m.lanOnCuoi));
  }
  for (const t of d.theCtl) {
    if (trongKhoang(t.themLuc, tuLuc, denLuc)) coHoc.add(ngayVN(t.themLuc));
    if (t.lanOnCuoi && trongKhoang(t.lanOnCuoi, tuLuc, denLuc)) coHoc.add(ngayVN(t.lanOnCuoi));
  }

  // Chuỗi ngày: liên tiếp tới hết khung (hoặc hôm nay/hôm qua nếu tuần đang dở) — từ mọi nguồn có ngày.
  const tatCaNgay = new Set<string>([...coHoc, ...ngayTruoc, ...d.ngayHocKhoa, ...d.ctlNgay.filter((c) => c.giay > 0 || c.theOn > 0).map((c) => c.ngay), ...onTheoNgay.keys()]);
  let moc = dangDo ? homNay : congNgay(d.tuan, 6);
  if (!tatCaNgay.has(moc)) moc = congNgay(moc, -1);
  let chuoi = 0;
  while (tatCaNgay.has(moc)) { chuoi++; moc = congNgay(moc, -1); }

  // ── Khoá học ──
  const khoa: KhoaSoLieu[] = [];
  for (const stage of KHOA_EN) {
    const k = ml.khoa[stage];
    if (!k) continue;
    const cuaKhoa = d.tienDo.filter((t) => t.stage === stage);
    const xong = new Set(cuaKhoa.filter((t) => t.kind === 'bai' && t.xong).map((t) => t.muc));
    const tongBai = Object.values(k.buoi).reduce((s, b) => s + b.bai.length, 0);
    const daXongTong = Object.values(k.buoi).reduce((s, b) => s + b.bai.filter(([id]) => xong.has(id)).length, 0);
    const baiTapTuan = cuaKhoa.filter((t) => t.kind === 'baitap' && t.diem != null && trongKhoang(t.updatedAt, tuLuc, denLuc));
    const thap = baiTapTuan.filter((t) => (t.diem ?? 100) < 70).sort((a, b) => (a.diem ?? 0) - (b.diem ?? 0)).slice(0, 5).map((t) => {
      const q = cm.quiz.get(`${stage}:${t.muc}`);
      return { id: t.muc, ten: q?.ten ?? t.muc, buoi: q?.buoi ?? buoiTuId(t.muc), diem: t.diem ?? 0, lessonId: q?.lessonId ?? null };
    });
    const cuoi = cuaKhoa.reduce<Date | null>((m, t) => (!m || t.updatedAt > m ? t.updatedAt : m), null);
    khoa.push({
      stage, ten: k.ten, duong: k.duong,
      baiXong: baiXongTheoKhoa.get(stage) ?? 0, baiXongTruoc: baiXongTruocTheoKhoa.get(stage) ?? 0,
      daXongTong, tongBai, tiLe: tongBai ? Math.round((daXongTong / tongBai) * 100) : 0,
      buoiKeTiep: buoiKeTiep(k, xong), soBuoi: k.soBuoi,
      baiTap: { so: baiTapTuan.length, tb: baiTapTuan.length ? Math.round(tb(baiTapTuan.map((t) => t.diem ?? 0))!) : null, thap },
      hoatDongCuoi: cuoi ? ngayVN(cuoi) : null,
    });
  }

  // ── Từ vựng ──
  const onTuan = d.onIelts.filter((r) => trongTuan(r.ngay));
  const nho = onTuan.filter((r) => r.diem >= 3).length;
  const ieltsTu = {
    moi: onTuan.filter((r) => r.moi).length,
    luotOn: onTuan.length,
    tiLeNho: onTuan.length >= 10 ? Math.round((nho / onTuan.length) * 100) : null,
    quen: onTuan.filter((r) => r.diem === 1).length,
    daThuoc: d.theIelts.daThuoc,
    moiTruoc: d.onIelts.filter((r) => tuanTruoc(r.ngay) && r.moi).length,
  };
  const ctlTu = {
    moi: d.theCtl.filter((t) => trongKhoang(t.themLuc, tuLuc, denLuc)).length,
    daOn: d.theCtl.filter((t) => t.lanOnCuoi && trongKhoang(t.lanOnCuoi, tuLuc, denLuc)).length,
    nhoSau: d.theCtl.filter((t) => t.khoangNgay >= 21).length,
    tongThe: d.theCtl.length,
    denHan: d.theCtl.filter((t) => t.denHan.getTime() <= d.bayGio.getTime()).length,
    moiTruoc: d.theCtl.filter((t) => trongKhoang(t.themLuc, truocTu, tuLuc)).length,
  };
  let loTrinh: SoLieuTuan['tuVung']['loTrinh'] = null;
  if (d.loTrinhTu?.length) {
    const coTu = new Set(d.theCtl.filter((t) => t.trongSoHtv).map((t) => khoaTuEn(t.chu)));
    let daXongNgay = 0;
    let ke: { id: string; ten: string } | null = null;
    for (const b of d.loTrinhTu) {
      const co = b.k.filter((k) => coTu.has(k)).length;
      if (b.k.length && co / b.k.length >= 0.8) daXongNgay++;
      else if (!ke) ke = { id: b.id, ten: b.ten };
    }
    loTrinh = { ngayKeTiep: ke, ngayDaXong: daXongNgay, tongNgay: d.loTrinhTu.length };
  }

  // ── Thi máy ──
  const thiTuan = d.luotThi.filter((l) => trongKhoang(l.createdAt, tuLuc, denLuc));
  const thiTruoc = d.luotThi.filter((l) => trongKhoang(l.createdAt, truocTu, tuLuc));
  const kyNang = {} as SoLieuTuan['thi']['kyNang'];
  for (const ky of ['doc', 'nghe', 'viet', 'noi'] as const) {
    const n = thiTuan.filter((l) => l.kyNang === ky);
    const bands = n.map((l) => l.band).filter((b): b is number => b != null);
    const bandsTruoc = thiTruoc.filter((l) => l.kyNang === ky).map((l) => l.band).filter((b): b is number => b != null);
    const dung = n.filter((l) => l.tong && l.dung != null).map((l) => (l.dung! / l.tong!) * 100);
    kyNang[ky] = {
      so: n.length,
      bandTb: bands.length ? tron1(tb(bands)!) : null,
      bandTruoc: bandsTruoc.length ? tron1(tb(bandsTruoc)!) : null,
      dungTb: dung.length ? Math.round(tb(dung)!) : null,
    };
  }
  const tbTieuChi = (ds: LuotThiTho[]): Record<string, number> | null => {
    const gom = new Map<string, number[]>();
    for (const l of ds) for (const [k, v] of Object.entries(l.tieuChi ?? {})) if (Number.isFinite(v)) gom.set(k, [...(gom.get(k) ?? []), v]);
    if (!gom.size) return null;
    return Object.fromEntries([...gom].map(([k, v]) => [k, tron1(tb(v)!)]));
  };
  const azureDs = thiTuan.filter((l) => l.kyNang === 'noi' && l.azure != null).map((l) => l.azure!);
  const tong = thiTuan.filter((l) => l.kyNang === 'tong' && l.band != null).map((l) => l.band!);

  // ── Sổ lỗi ──
  const loiTuan = d.soLoi.filter((m) => trongKhoang(m.updatedAt, tuLuc, denLuc) && !m.daXong);
  const theoDang = new Map<string, { dang: string; ky: string; so: number; lanSai: number }>();
  for (const m of loiTuan) {
    const k = `${m.kyNang}|${m.dang}`;
    const c = theoDang.get(k) ?? { dang: m.dang, ky: m.kyNang, so: 0, lanSai: 0 };
    c.so++; c.lanSai += m.lanSai; theoDang.set(k, c);
  }
  const dangDau = [...theoDang.values()].sort((a, b) => b.so - a.so || b.lanSai - a.lanSai)[0];
  const theoLyDo = new Map<string, { so: number; ngoaiDangDau: number }>();
  for (const m of loiTuan) {
    if (!m.lyDo) continue;
    const c = theoLyDo.get(m.lyDo) ?? { so: 0, ngoaiDangDau: 0 };
    c.so++;
    if (!dangDau || m.dang !== dangDau.dang || m.kyNang !== dangDau.ky) c.ngoaiDangDau++;
    theoLyDo.set(m.lyDo, c);
  }

  const ctlThiTuan = d.ctlThi.filter((t) => trongKhoang(t.nopLuc, tuLuc, denLuc));

  const soLieu: SoLieuTuan = {
    tuan: d.tuan, tuNgay: d.tuan, denNgay: congNgay(d.tuan, 6), soNgayTinh, dangDo, trong: false,
    ngayHoc: { so: coHoc.size, tren: soNgayTinh, truoc: ngayTruoc.size, ds: [...coHoc].sort() },
    chuoi,
    phut: {
      tong: Math.round(baiHoc + thiMay + appCTL + onThe), baiHoc: Math.round(baiHoc), thiMay: Math.round(thiMay),
      appCTL: Math.round(appCTL), onThe: Math.round(onThe), truoc: Math.round(phutTruoc),
    },
    theoNgay: ngayTuan.map((n, i) => ({ ngay: n, thu: THU[i]!, phut: Math.round(phutNgay.get(n) ?? 0), coHoc: coHoc.has(n) })),
    khoa,
    tuVung: { ielts: ieltsTu, ctl: ctlTu, loTrinh },
    thi: {
      soLuot: thiTuan.length, soLuotTruoc: thiTruoc.length, kyNang,
      tieuChiViet: tbTieuChi(thiTuan.filter((l) => l.kyNang === 'viet')),
      tieuChiNoi: tbTieuChi(thiTuan.filter((l) => l.kyNang === 'noi')),
      azure: azureDs.length ? Math.round(tb(azureDs)!) : null,
      bandTong: tong.length ? tron1(tb(tong)!) : null,
    },
    soLoi: {
      moi: d.soLoi.filter((m) => trongKhoang(m.createdAt, tuLuc, denLuc)).length,
      saiLai: d.soLoi.filter((m) => trongKhoang(m.updatedAt, tuLuc, denLuc) && m.createdAt < tuLuc && m.lanSai > 1 && !m.daXong).length,
      theoDang: [...theoDang.values()].sort((a, b) => b.so - a.so || b.lanSai - a.lanSai).slice(0, 5),
      theoLyDo: [...theoLyDo].map(([lyDo, c]) => ({ lyDo, so: c.so, ngoaiDangDau: c.ngoaiDangDau })).sort((a, b) => b.so - a.so).slice(0, 3),
      denHan: d.soLoi.filter((m) => !m.daXong && m.hanOn.getTime() <= d.bayGio.getTime()).length,
      vung: d.soLoi.filter((m) => m.daXong && m.lanOnCuoi && trongKhoang(m.lanOnCuoi, tuLuc, denLuc)).length,
    },
    ctlThi: { so: ctlThiTuan.length, ds: ctlThiTuan.slice(0, 5).map((t) => ({ kyThi: t.kyThi, cap: t.cap, diem: t.diem, diemToiDa: t.diemToiDa })) },
    xepLop: d.xepLop,
  };
  soLieu.trong = soLieu.ngayHoc.so === 0 && soLieu.phut.tong === 0 && khoa.every((k) => k.baiXong === 0 && k.baiTap.so === 0)
    && soLieu.thi.soLuot === 0 && ctlTu.moi === 0 && ctlTu.daOn === 0 && ieltsTu.luotOn === 0;
  return soLieu;
}

/** Khoá từ tiếng Anh — y như `khoaTuHtv('en', …)`: chữ thường, gộp khoảng trắng. */
export const khoaTuEn = (chu: string) => chu.trim().toLowerCase().replace(/\s+/g, ' ');

/** Buổi đầu tiên còn bài (đã soạn) chưa xong. Buổi không có trong mục lục (Tập 1 Ngày 1) ⇒ xong nếu có bài nào của buổi đó xong. */
export function buoiKeTiep(k: MucLucKhoa, xong: ReadonlySet<string>): number | null {
  const daCoBuoi = new Set([...xong].map(buoiTuId).filter((n): n is number => n != null));
  for (let n = 1; n <= k.soBuoi; n++) {
    const b = k.buoi[String(n)];
    if (!b) { if (!daCoBuoi.has(n)) return n; continue; }
    if (b.bai.some(([id]) => !xong.has(id))) return n;
  }
  return null;
}

/* ───────────────────────────── Điểm yếu + điểm mạnh (MÃ chọn) ───────────────────────────── */

export type LienKet = { nhan: string; href: string };
export type DiemYeu = { ma: string; loai: string; tieuDe: string; bangChung: string; muc: number; lienKet: LienKet };

export function chonDiemYeu(s: SoLieuTuan): DiemYeu[] {
  if (s.trong) return [];
  const ds: DiemYeu[] = [];
  const ieltsChinh = s.khoa.find((k) => k.stage.startsWith('sach') && k.baiXong > 0) ?? s.khoa.find((k) => k.stage.startsWith('sach') && k.daXongTong > 0);

  const d0 = s.soLoi.theoDang[0];
  if (d0 && d0.so >= 2) {
    ds.push({
      ma: 'dang-cau', loai: 'dang-cau', tieuDe: `Dạng câu "${d0.dang}" (${KY_TEN[d0.ky] ?? d0.ky})`,
      bangChung: `${d0.so} câu sai dạng "${d0.dang}" trong tuần, cộng dồn ${d0.lanSai} lần sai (tính cả lần làm lại).`,
      muc: Math.min(95, 50 + 5 * d0.so), lienKet: { nhan: 'Mở Sổ lỗi', href: DUONG.soLoi },
    });
  }
  const tcViet = s.thi.tieuChiViet;
  if (tcViet && Object.keys(tcViet).length >= 2) {
    const [ma, band] = Object.entries(tcViet).sort((a, b) => a[1] - b[1])[0]!;
    const khac = Object.entries(tcViet).filter(([k]) => k !== ma).map(([, v]) => v);
    const lech = (tb(khac) ?? band) - band;
    ds.push({
      ma: 'tieu-chi-viet', loai: 'tieu-chi-viet', tieuDe: `Writing — ${TIEU_CHI_TEN[ma] ?? ma}`,
      bangChung: `${ma} trung bình ${band} qua ${s.thi.kyNang.viet.so} bài Writing, thấp nhất trong ${Object.keys(tcViet).length} tiêu chí`
        + (s.thi.kyNang.viet.bandTb != null ? ` (band Writing ${s.thi.kyNang.viet.bandTb}).` : '.'),
      muc: Math.min(95, 55 + Math.round(lech * 30)), lienKet: { nhan: 'Viết lại một bài ở phòng thi máy', href: DUONG.thiMay },
    });
  }
  const tcNoi = s.thi.tieuChiNoi;
  if (tcNoi && Object.keys(tcNoi).length >= 2) {
    const [ma, band] = Object.entries(tcNoi).sort((a, b) => a[1] - b[1])[0]!;
    const khac = Object.entries(tcNoi).filter(([k]) => k !== ma).map(([, v]) => v);
    const lech = (tb(khac) ?? band) - band;
    ds.push({
      ma: 'tieu-chi-noi', loai: 'tieu-chi-noi', tieuDe: `Speaking — ${TIEU_CHI_TEN[ma] ?? ma}`,
      bangChung: `${ma.toUpperCase()} trung bình ${band} qua ${s.thi.kyNang.noi.so} lượt Speaking`
        + (ma === 'p' && s.thi.azure != null ? `; điểm phát âm Azure trung bình ${s.thi.azure}/100.` : '.'),
      muc: Math.min(95, 55 + Math.round(lech * 30)), lienKet: { nhan: 'Luyện Speaking ở phòng thi máy', href: DUONG.thiMay },
    });
  }
  const coBand = (['doc', 'nghe', 'viet', 'noi'] as const).filter((k) => s.thi.kyNang[k].bandTb != null);
  if (coBand.length >= 2) {
    const sx = [...coBand].sort((a, b) => s.thi.kyNang[a].bandTb! - s.thi.kyNang[b].bandTb!);
    const thap = sx[0]!, cao = sx[sx.length - 1]!;
    const gap = s.thi.kyNang[cao].bandTb! - s.thi.kyNang[thap].bandTb!;
    if (gap >= 0.5) {
      ds.push({
        ma: 'ky-nang', loai: 'ky-nang', tieuDe: `Kỹ năng ${KY_TEN[thap]} kéo band xuống`,
        bangChung: `${KY_TEN[thap]} band ${s.thi.kyNang[thap].bandTb}, thấp hơn ${KY_TEN[cao]} (${s.thi.kyNang[cao].bandTb}) ${gap} band.`,
        muc: Math.min(90, 50 + Math.round(gap * 20)), lienKet: { nhan: `Thi máy ${KY_TEN[thap]}`, href: DUONG.thiMay },
      });
    }
  }
  const thapNhat = s.khoa.flatMap((k) => k.baiTap.thap.map((t) => ({ ...t, k }))).sort((a, b) => a.diem - b.diem);
  if (thapNhat.length) {
    const t = thapNhat[0]!;
    const href = t.lessonId ? `${t.k.duong}?bai=${encodeURIComponent(t.lessonId)}` : t.buoi ? `${t.k.duong}?buoi=${t.buoi}` : t.k.duong;
    ds.push({
      ma: 'bai-tap', loai: 'bai-tap', tieuDe: `Bài tập "${t.ten}"`,
      bangChung: `Bài tập "${t.ten}" (${t.k.ten}${t.buoi ? `, Ngày ${t.buoi}` : ''}) đạt ${t.diem}%`
        + (thapNhat.length > 1 ? `; tuần này có ${thapNhat.length} bài tập dưới 70%.` : '.'),
      muc: Math.min(85, 40 + (70 - t.diem)), lienKet: { nhan: 'Làm lại bài này', href },
    });
  }
  // Lý do sai lặp lại — chỉ khi nó trải ra NGOÀI dạng câu đứng đầu (không thì trùng điểm yếu "dạng câu").
  const ld = s.soLoi.theoLyDo.find((x) => x.so >= 3 && (x.ngoaiDangDau ?? x.so) >= 2);
  if (ld) {
    ds.push({
      ma: 'ly-do', loai: 'ly-do', tieuDe: `Lỗi lặp lại: ${LY_DO_TEN[ld.lyDo] ?? ld.lyDo}`,
      bangChung: `${ld.so} câu sai trong tuần được ghi lý do "${LY_DO_TEN[ld.lyDo] ?? ld.lyDo}".`,
      muc: Math.min(80, 45 + 3 * ld.so), lienKet: { nhan: 'Lọc Sổ lỗi theo lý do', href: DUONG.soLoi },
    });
  }
  const tv = s.tuVung.ielts;
  if (tv.tiLeNho != null && tv.luotOn >= 20 && tv.tiLeNho < 70) {
    ds.push({
      ma: 'tu-vung', loai: 'tu-vung', tieuDe: 'Từ vựng ôn lặp nhớ chưa chắc',
      bangChung: `Ôn ${tv.luotOn} lượt thẻ, tỷ lệ nhớ ${tv.tiLeNho}% (${tv.quen} lượt bấm "Quên").`,
      muc: Math.min(80, 50 + Math.round((70 - tv.tiLeNho) / 2)), lienKet: { nhan: 'Ôn thẻ đến hạn', href: DUONG.theTu },
    });
  } else if (s.tuVung.ctl.denHan >= 30) {
    ds.push({
      ma: 'tu-vung', loai: 'tu-vung', tieuDe: 'Thẻ từ đến hạn bị dồn',
      bangChung: `${s.tuVung.ctl.denHan} thẻ trong sổ tay đã đến hạn ôn mà chưa ôn.`,
      muc: Math.min(70, 40 + Math.floor(s.tuVung.ctl.denHan / 5)), lienKet: { nhan: 'Ôn thẻ trong Học từ vựng', href: DUONG.hocTuVung },
    });
  }
  if (s.soLoi.denHan >= 10) {
    ds.push({
      ma: 'so-loi-ton', loai: 'so-loi', tieuDe: 'Sổ lỗi tồn chưa ôn',
      bangChung: `${s.soLoi.denHan} câu trong Sổ lỗi đã đến hạn làm lại.`,
      muc: Math.min(70, 35 + s.soLoi.denHan), lienKet: { nhan: 'Làm lại câu đến hạn', href: DUONG.soLoi },
    });
  }
  // Đều đặn: chỉ xét khi đã qua ít nhất 4 ngày của tuần (tuần dở 2 ngày học 2 ngày không phải là yếu).
  if (s.soNgayTinh >= 4 && s.ngayHoc.so <= Math.floor(s.soNgayTinh / 2)) {
    ds.push({
      ma: 'deu-dan', loai: 'deu-dan', tieuDe: 'Học chưa đều',
      bangChung: `Chỉ ${s.ngayHoc.so}/${s.soNgayTinh} ngày có học` + (s.ngayHoc.truoc ? ` (tuần trước ${s.ngayHoc.truoc}/7).` : '.'),
      muc: Math.max(40, 75 - 10 * s.ngayHoc.so), lienKet: { nhan: 'Xem kế hoạch tuần sau', href: DUONG.nhanXet },
    });
  }
  if (ieltsChinh && s.thi.soLuot === 0) {
    ds.push({
      ma: 'chua-do-band', loai: 'do-band', tieuDe: 'Chưa đo band trong tuần',
      bangChung: `0 lượt thi máy trong tuần dù đã xong ${ieltsChinh.daXongTong} bài ${ieltsChinh.ten}.`,
      muc: 30, lienKet: { nhan: 'Làm một phần thi máy', href: DUONG.thiMay },
    });
  }
  // Mỗi loại tối đa một mục, lấy 3 mục nặng nhất (ổn định: cùng mức ⇒ giữ thứ tự khai báo).
  const theoLoai = new Set<string>();
  return ds.map((x, i) => ({ x, i })).sort((a, b) => b.x.muc - a.x.muc || a.i - b.i).map((p) => p.x)
    .filter((x) => (theoLoai.has(x.loai) ? false : (theoLoai.add(x.loai), true))).slice(0, 3);
}

export function goiYDiemManh(s: SoLieuTuan): string[] {
  if (s.trong) return [];
  const ds: { muc: number; cau: string }[] = [];
  if (s.ngayHoc.so >= 5) ds.push({ muc: 80 + s.ngayHoc.so, cau: `Học đều ${s.ngayHoc.so}/${s.soNgayTinh} ngày` + (s.chuoi >= 3 ? `, chuỗi ${s.chuoi} ngày liên tiếp.` : '.') });
  for (const k of s.khoa) {
    if (k.baiXong >= 3) ds.push({ muc: 60 + k.baiXong, cau: `Xong ${k.baiXong} bài ${k.ten} (tuần trước ${k.baiXongTruoc}); cả khoá đạt ${k.tiLe}%.` });
    if (k.baiTap.so >= 3 && (k.baiTap.tb ?? 0) >= 85) ds.push({ muc: 70, cau: `${k.baiTap.so} bài tập ${k.ten}, trung bình ${k.baiTap.tb}%.` });
  }
  for (const ky of ['doc', 'nghe', 'viet', 'noi'] as const) {
    const x = s.thi.kyNang[ky];
    if (x.bandTb != null && x.bandTruoc != null && x.bandTb > x.bandTruoc) ds.push({ muc: 90, cau: `${KY_TEN[ky]} lên band ${x.bandTb} (tuần trước ${x.bandTruoc}).` });
  }
  if (s.tuVung.ielts.tiLeNho != null && s.tuVung.ielts.tiLeNho >= 85) ds.push({ muc: 65, cau: `Ôn ${s.tuVung.ielts.luotOn} lượt thẻ với tỷ lệ nhớ ${s.tuVung.ielts.tiLeNho}%.` });
  const tuMoi = s.tuVung.ielts.moi + s.tuVung.ctl.moi;
  if (tuMoi >= 40) ds.push({ muc: 60, cau: `Thêm ${tuMoi} từ mới vào thẻ ôn lặp.` });
  if (s.soLoi.vung >= 3) ds.push({ muc: 62, cau: `${s.soLoi.vung} câu trong Sổ lỗi đã ôn vững.` });
  return ds.sort((a, b) => b.muc - a.muc).slice(0, 3).map((x) => x.cau);
}

/* ───────────────────────────── Kế hoạch tuần sau (MÃ xếp) ───────────────────────────── */

export type ViecKeHoach = { nhan: string; href: string; phut: number; loai: 'hoc' | 'on' | 'thi' | 'tu' };
export type NgayKeHoach = { thu: string; ngay: string; viec: ViecKeHoach[] };

export function lapKeHoach(s: SoLieuTuan, yeu: DiemYeu[], ml: MucLuc): NgayKeHoach[] {
  const tuanSau = congNgay(s.tuan, 7);
  const ngay: NgayKeHoach[] = THU.map((thu, i) => ({ thu, ngay: congNgay(tuanSau, i), viec: [] }));
  const them = (i: number, v: ViecKeHoach) => { ngay[i]!.viec.push(v); };

  // Khoá chính: nhiều bài xong nhất tuần này ⇒ hoạt động gần nhất ⇒ vị trí xếp lớp ⇒ Tập 1.
  const ielts = s.khoa.filter((k) => k.stage.startsWith('sach'));
  const giaoTiep = s.khoa.find((k) => k.stage === 'giaotiep1');
  const coHoat = (k: KhoaSoLieu) => k.baiXong > 0 || k.baiTap.so > 0;
  let chinh: KhoaSoLieu | undefined = [...ielts].filter(coHoat).sort((a, b) => b.baiXong - a.baiXong)[0]
    ?? [...ielts].filter((k) => k.hoatDongCuoi && k.buoiKeTiep != null).sort((a, b) => (b.hoatDongCuoi ?? '').localeCompare(a.hoatDongCuoi ?? ''))[0];
  let buoiDau: number | null = chinh?.buoiKeTiep ?? null;
  if (!chinh || buoiDau == null) {
    // Chưa học khoá IELTS nào (hoặc khoá đang học đã xong hết): theo xếp lớp, không có thì Tập 1 Ngày 1.
    const tap = s.xepLop ? Math.min(5, Math.max(1, s.xepLop.tap)) : 1;
    chinh = ielts.find((k) => k.stage === `sach${tap}` && k.buoiKeTiep != null) ?? ielts.find((k) => k.buoiKeTiep != null);
    const tuXepLop = s.xepLop && chinh?.stage === `sach${tap}` ? s.xepLop.ngay : 1;
    buoiDau = chinh ? Math.max(chinh.buoiKeTiep ?? 1, tuXepLop) : null;
  }
  const phu = giaoTiep && (coHoat(giaoTiep) || giaoTiep.daXongTong > 0) && giaoTiep.buoiKeTiep != null ? giaoTiep : null;

  const nhip = s.trong ? 2 : s.ngayHoc.so >= 5 ? 4 : s.ngayHoc.so >= 3 ? 3 : 2;
  const phutBuoi = (k: KhoaSoLieu, n: number) => ml.khoa[k.stage]?.buoi[String(n)]?.phut || 60;
  const buoiHoc = (k: KhoaSoLieu, n: number): ViecKeHoach => ({
    nhan: `${k.ten} — Ngày ${n}`, href: `${k.duong}?buoi=${n}`, phut: phutBuoi(k, n), loai: 'hoc',
  });
  const oHoc = nhip >= 4 ? [0, 1, 3, 5] : nhip === 3 ? [0, 2, 4] : [0, 3];
  if (chinh && buoiDau != null) {
    oHoc.forEach((o, i) => { const n = buoiDau! + i; if (n <= chinh!.soBuoi) them(o, buoiHoc(chinh!, n)); });
  }
  if (phu) {
    const oPhu = nhip >= 4 ? [2, 5] : [1, 5];
    oPhu.forEach((o, i) => { const n = phu.buoiKeTiep! + i; if (n <= phu.soBuoi) them(o, buoiHoc(phu, n)); });
  } else if (s.trong && giaoTiep) {
    them(1, buoiHoc(giaoTiep, giaoTiep.buoiKeTiep ?? 1));
  }
  // Điểm yếu ⇒ ngày ôn T4 · T6 · CN.
  const oYeu = [2, 4, 6];
  yeu.filter((y) => y.ma !== 'deu-dan').forEach((y, i) => them(oYeu[i]!, { nhan: `Sửa điểm yếu: ${y.tieuDe} — ${y.lienKet.nhan}`, href: y.lienKet.href, phut: 30, loai: y.loai === 'do-band' ? 'thi' : 'on' }));
  // Từ vựng: lộ trình theo ngày (nếu đang học) hoặc thẻ IELTS; ngày nào chưa có việc từ thì thêm.
  const lt = s.tuVung.loTrinh?.ngayKeTiep;
  const dungTheIelts = s.tuVung.ielts.luotOn > 0;
  ngay.forEach((d, i) => {
    if (i === 6) return;
    if (lt && (i % 2 === 0)) d.viec.push({ nhan: `Học từ vựng — ${lt.ten}`, href: `${DUONG.hocTuVung}?bai=${encodeURIComponent(lt.id)}`, phut: 15, loai: 'tu' });
    else if (dungTheIelts) d.viec.push({ nhan: 'Ôn thẻ từ IELTS đến hạn', href: DUONG.theTu, phut: 15, loai: 'tu' });
    else if (!lt) d.viec.push({ nhan: 'Học 20 từ mới theo lộ trình', href: DUONG.hocTuVung, phut: 15, loai: 'tu' });
  });
  // Chủ nhật: tổng ôn + đo band (nếu học IELTS) + xem nhận xét tuần.
  if (s.soLoi.denHan > 0) them(6, { nhan: `Làm lại ${s.soLoi.denHan} câu Sổ lỗi đến hạn`, href: DUONG.soLoi, phut: 20, loai: 'on' });
  if (!s.trong && chinh) them(6, { nhan: 'Đo band: một phần thi máy (Reading hoặc Listening)', href: DUONG.thiMay, phut: 35, loai: 'thi' });
  if (s.trong) {
    them(0, { nhan: s.xepLop ? 'Xem lại kết quả xếp lớp, rồi vào buổi được xếp' : 'Làm test đầu vào (Đề 0) để biết bắt đầu từ Tập nào', href: DUONG.thiMay, phut: 40, loai: 'thi' });
  }
  them(6, { nhan: 'Mở nhận xét tuần mới của CuongMini', href: DUONG.nhanXet, phut: 5, loai: 'on' });
  return ngay;
}

/* ───────────────────────────── Prompt + kiểm chữ của model ───────────────────────────── */

export type NhanXet = {
  tongQuan: string;
  diemManh: string[];
  diemYeu: { ma: string; nhanXet: string; cachSua: string }[];
  keHoachGhiChu: Record<string, string>;
  loiNhan: string;
};

/** Bản số liệu GỌN gửi model (bỏ mảng dài, giữ đủ con số để viết). */
export function soLieuGon(s: SoLieuTuan) {
  return {
    tuan: `${ddmm(s.tuNgay)}–${ddmm(s.denNgay)}`, tuanDangDo: s.dangDo, soNgayDaQua: s.soNgayTinh,
    ngayHoc: { so: s.ngayHoc.so, tren: s.ngayHoc.tren, tuanTruoc: s.ngayHoc.truoc }, chuoiNgay: s.chuoi,
    phutUocTinh: s.phut,
    khoa: s.khoa.filter((k) => k.daXongTong > 0 || k.baiXong > 0 || k.baiTap.so > 0).map((k) => ({
      ten: k.ten, baiXongTuan: k.baiXong, baiXongTuanTruoc: k.baiXongTruoc, tiLeCaKhoa: k.tiLe, buoiKeTiep: k.buoiKeTiep,
      baiTap: { so: k.baiTap.so, diemTb: k.baiTap.tb, duoi70: k.baiTap.thap.map((t) => ({ ten: t.ten, ngay: t.buoi, diem: t.diem })) },
    })),
    tuVung: s.tuVung,
    thiMay: s.thi,
    soLoi: { ...s.soLoi, theoLyDo: s.soLoi.theoLyDo.map((x) => ({ lyDo: LY_DO_TEN[x.lyDo] ?? x.lyDo, so: x.so })) },
    thiThuCTL: s.ctlThi,
  };
}

export const HE_THONG = [
  'Bạn là CuongMini — gia sư tiếng Anh của cuongthai.com, viết NHẬN XÉT HỌC TẬP TUẦN cho một sinh viên IT người Việt (đích IELTS Academic 8.0 + giao tiếp khi đi làm).',
  'Giọng: chuyên nghiệp, thẳng, cụ thể như một giảng viên giỏi; xưng "mình", gọi "bạn". KHÔNG khen chung chung ("bạn học tốt lắm"), không sáo rỗng, không emoji.',
  'Bạn nhận SỐ LIỆU ĐÃ TÍNH SẴN, danh sách ĐIỂM YẾU đã chọn (kèm bằng chứng) và KẾ HOẠCH tuần sau. Luật cứng:',
  '  1. Chỉ dùng con số có trong dữ liệu. KHÔNG tự tính, làm tròn lại, ước lượng hay bịa số mới. Không có số thì nói bằng chữ.',
  '  2. Không đổi, thêm hay bỏ điểm yếu: viết đúng các "ma" được đưa, đúng thứ tự.',
  '  3. Mỗi điểm yếu: "nhanXet" = vì sao điều đó kéo band/khả năng giao tiếp xuống (dẫn bằng chứng); "cachSua" = 2–3 việc làm được ngay tuần sau, cụ thể tới thao tác (vd. dạng TFNG: gạch từ khoá câu hỏi, tìm đồng nghĩa trong bài, phân biệt FALSE = trái nghĩa với NOT GIVEN = không nhắc).',
  '  4. "diemManh": 1–3 câu, mỗi câu dựa trên một mục trong "diemManhGoiY" (được diễn đạt lại, giữ nguyên số). Không có gợi ý ⇒ mảng rỗng.',
  '  5. "keHoachGhiChu": với vài ngày trong kế hoạch, một câu ≤ 25 từ nói VÌ SAO làm việc đó hôm ấy. Khoá là T2…CN. Không lặp lại tên bài.',
  '  6. "loiNhan": 1–2 câu cuối, ấm nhưng thực tế, nhắc đúng một việc quan trọng nhất tuần sau.',
  'Viết tiếng Việt; thuật ngữ IELTS giữ tiếng Anh (Task Response, Lexical Resource…). Trả về DUY NHẤT một JSON hợp lệ, không markdown:',
  '{"tongQuan":"2–3 câu tóm tắt tuần, có số","diemManh":["…"],"diemYeu":[{"ma":"…","nhanXet":"…","cachSua":"…"}],"keHoachGhiChu":{"T2":"…"},"loiNhan":"…"}',
].join('\n');

export function dungPrompt(s: SoLieuTuan, yeu: DiemYeu[], manh: string[], keHoach: NgayKeHoach[]): { system: string; user: string } {
  const dauVao = {
    soLieu: soLieuGon(s),
    diemYeu: yeu.map((y) => ({ ma: y.ma, tieuDe: y.tieuDe, bangChung: y.bangChung })),
    diemManhGoiY: manh,
    keHoach: keHoach.map((d) => ({ thu: d.thu, viec: d.viec.map((v) => `${v.nhan} (~${v.phut} phút)`) })),
  };
  return { system: HE_THONG, user: JSON.stringify(dauVao) };
}

/** Mọi con số trong một chuỗi (dạng chuẩn: '6.5', '72', '0.5'). */
export function cacSo(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map(chuanSo);
}
const chuanSo = (x: string) => {
  const n = Number(x.replace(',', '.'));
  return Number.isFinite(n) ? String(Math.round(n * 100) / 100) : x;
};
/** Con số được phép: có trong dữ liệu đưa model + số nhỏ (0–10, nửa band) + vài mốc lời khuyên phổ biến. */
export function tapSoChoPhep(dauVao: string): Set<string> {
  const tap = new Set(cacSo(dauVao));
  for (let i = 0; i <= 20; i++) { tap.add(String(i / 2)); tap.add(String(i)); }
  for (const x of [15, 20, 25, 30, 40, 45, 60, 90, 100, 150, 250]) tap.add(String(x));
  return tap;
}
export function chuoiSach(text: unknown, toiDa: number, tap: Set<string>): string | null {
  if (typeof text !== 'string') return null;
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  if (cacSo(t).some((x) => !tap.has(x))) return null;
  return t.length > toiDa ? `${t.slice(0, toiDa - 1)}…` : t;
}

export function docJson(text: string): unknown {
  let t = (text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return JSON.parse(t.replace(/[\x00-\x1F]+/g, ' '));
}

/**
 * Kiểm + chuẩn hoá chữ của model. Trường nào hỏng (sai kiểu, có số lạ) ⇒ dùng chữ dự phòng của mã cho trường đó.
 * `soBiThay` = số trường đã thay (ghi log để biết model có hay bịa không).
 */
export function kiemNhanXet(raw: unknown, duPhong: NhanXet, dauVao: string): { nhanXet: NhanXet; soBiThay: number } {
  const tap = tapSoChoPhep(dauVao);
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  let thay = 0;
  const lay = (v: unknown, n: number, dp: string) => { const x = chuoiSach(v, n, tap); if (x == null) thay++; return x ?? dp; };
  const tongQuan = lay(r.tongQuan, 600, duPhong.tongQuan);
  let diemManh = Array.isArray(r.diemManh) ? r.diemManh.map((x) => chuoiSach(x, 300, tap)).filter((x): x is string => !!x).slice(0, 3) : [];
  if (!diemManh.length && duPhong.diemManh.length) { diemManh = duPhong.diemManh; thay++; }
  const yeuRaw = Array.isArray(r.diemYeu) ? (r.diemYeu as Record<string, unknown>[]) : [];
  const diemYeu = duPhong.diemYeu.map((dp) => {
    const m = yeuRaw.find((y) => y && y.ma === dp.ma);
    return { ma: dp.ma, nhanXet: lay(m?.nhanXet, 600, dp.nhanXet), cachSua: lay(m?.cachSua, 700, dp.cachSua) };
  });
  const keHoachGhiChu: Record<string, string> = {};
  if (r.keHoachGhiChu && typeof r.keHoachGhiChu === 'object') {
    for (const [k, v] of Object.entries(r.keHoachGhiChu as Record<string, unknown>)) {
      if (!(THU as readonly string[]).includes(k)) continue;
      const x = chuoiSach(v, 220, tap);
      if (x) keHoachGhiChu[k] = x; else thay++;
    }
  }
  const loiNhan = lay(r.loiNhan, 360, duPhong.loiNhan);
  return { nhanXet: { tongQuan, diemManh, diemYeu, keHoachGhiChu, loiNhan }, soBiThay: thay };
}

const CACH_SUA: Record<string, string> = {
  'dang-cau': 'Mở Sổ lỗi, lọc đúng dạng này, đọc lại giải thích từng câu rồi viết một "công thức" 1 dòng cho dạng đó; làm lại các câu đến hạn trước khi học bài mới.',
  'tieu-chi-viet': 'Viết lại một bài đã chấm, chỉ tập trung sửa đúng tiêu chí này; so bản viết lại với bản cũ theo từng đoạn trước khi nộp chấm lại.',
  'tieu-chi-noi': 'Ghi âm lại các câu trả lời có điểm thấp, nghe lại và sửa đúng tiêu chí này; luyện 3 câu Part 1 + 1 bài Part 2 mỗi ngày.',
  'ky-nang': 'Dành hai buổi luyện riêng kỹ năng này ở phòng thi máy (chế độ Practice), xem lại từng câu sai và ghi lý do vào Sổ lỗi.',
  'bai-tap': 'Làm lại bài tập này sau khi đọc lại phần lý thuyết của bài; ghi các câu sai vào Sổ lỗi.',
  'ly-do': 'Trước khi chọn đáp án, tự hỏi đúng câu hỏi gắn với lỗi này (vd. "bài có nhắc tới ý này không?") và đánh dấu bằng chứng trong bài.',
  'tu-vung': 'Ôn thẻ đến hạn mỗi ngày trước khi học từ mới; thẻ quên nhiều lần thì đặt một câu ví dụ của riêng bạn.',
  'so-loi-ton': 'Mỗi ngày làm lại 10 câu Sổ lỗi đến hạn trước khi học bài mới.',
  'deu-dan': 'Chốt một khung giờ cố định mỗi ngày; ngày bận chỉ cần 15 phút ôn thẻ để giữ chuỗi.',
  'chua-do-band': 'Làm một phần Reading hoặc Listening chế độ Full test vào cuối tuần để có band so sánh.',
};

/** Chữ dự phòng do MÃ viết — dùng khi không gọi được model hoặc model viết hỏng/bịa số. */
export function nhanXetDuPhong(s: SoLieuTuan, yeu: DiemYeu[], manh: string[]): NhanXet {
  if (s.trong) {
    return {
      tongQuan: `Tuần ${ddmm(s.tuNgay)}–${ddmm(s.denNgay)} chưa có hoạt động học tiếng Anh nào được ghi nhận trên tài khoản (khoá IELTS, Giao tiếp, thẻ từ, thi máy hay app CT Language).`,
      diemManh: [], diemYeu: [], keHoachGhiChu: {},
      loiNhan: s.xepLop
        ? 'Bắt đầu lại từ đúng buổi đã được xếp lớp; mỗi ngày 30–45 phút là đủ để có nhận xét thật vào tuần sau.'
        : 'Hãy làm test đầu vào trước để biết nên bắt đầu từ Tập nào; mỗi ngày 30–45 phút là đủ để có nhận xét thật vào tuần sau.',
    };
  }
  const khoaCo = s.khoa.filter((k) => k.baiXong > 0);
  const phanKhoa = khoaCo.length ? `, xong ${khoaCo.map((k) => `${k.baiXong} bài ${k.ten}`).join(', ')}` : '';
  const phanThi = s.thi.soLuot ? `, ${s.thi.soLuot} lượt thi máy` : '';
  const tongQuan = `Tuần ${ddmm(s.tuNgay)}–${ddmm(s.denNgay)}: học ${s.ngayHoc.so}/${s.soNgayTinh} ngày, khoảng ${s.phut.tong} phút${phanKhoa}${phanThi}.`
    + (yeu.length ? ` Ưu tiên tuần sau: ${yeu[0]!.tieuDe}.` : '');
  return {
    tongQuan,
    diemManh: manh,
    diemYeu: yeu.map((y) => ({ ma: y.ma, nhanXet: y.bangChung, cachSua: CACH_SUA[y.ma] ?? 'Ôn lại đúng phần này theo link bên dưới.' })),
    keHoachGhiChu: {},
    loiNhan: s.ngayHoc.so >= 5
      ? 'Nhịp học đang tốt — tuần sau giữ nhịp và dồn sức vào điểm yếu số 1.'
      : 'Tuần sau ưu tiên học đều mỗi ngày, kể cả ngày bận chỉ 15 phút ôn thẻ.',
  };
}

/* ───────────────────────────── Email tóm tắt ───────────────────────────── */

export function dungThuTomTat(s: SoLieuTuan, nx: NhanXet, yeu: DiemYeu[], url: string) {
  const rows = [
    { label: 'Ngày có học', value: `${s.ngayHoc.so}/${s.soNgayTinh} (tuần trước ${s.ngayHoc.truoc}/7)` },
    { label: 'Thời gian ước tính', value: `${s.phut.tong} phút` },
    ...s.khoa.filter((k) => k.baiXong > 0).map((k) => ({ label: k.ten, value: `${k.baiXong} bài xong · cả khoá ${k.tiLe}%` })),
    { label: 'Từ mới', value: String(s.tuVung.ielts.moi + s.tuVung.ctl.moi) },
    ...(s.thi.soLuot ? [{ label: 'Lượt thi máy', value: String(s.thi.soLuot) }] : []),
  ];
  return {
    tieuDe: `Nhận xét tuần ${ddmm(s.tuNgay)}–${ddmm(s.denNgay)} của CuongMini`,
    rows,
    yeu: yeu.map((y) => `${y.tieuDe}: ${y.bangChung}`),
    tongQuan: nx.tongQuan,
    loiNhan: nx.loiNhan,
    url,
  };
}

/* ───────────────────────────── Nguồn dữ liệu (nói rõ có / không) ───────────────────────────── */

export type NguonDuLieu = { ma: string; ten: string; co: boolean; ghiChu: string };

/**
 * Nguồn nào máy chủ CÓ lưu và tuần này có dữ liệu không; nguồn nào KHÔNG lưu (nên báo cáo không thể nói tới).
 * `co` = tuần này có ít nhất một bản ghi; nguồn "không lưu" luôn `co: false`.
 */
export function nguonDuLieu(d: DuLieuTho, s: SoLieuTuan): NguonDuLieu[] {
  const { tuLuc, denLuc } = khungTuan(d.tuan);
  const trong = (x: Date) => trongKhoang(x, tuLuc, denLuc);
  return [
    { ma: 'khoa-sach', ten: 'Tiến độ khoá IELTS Tập 1–5 + Giao tiếp (bài xong, điểm bài tập)', co: s.khoa.some((k) => k.baiXong > 0 || k.baiTap.so > 0), ghiChu: 'Đồng bộ theo tài khoản khi đã đăng nhập.' },
    { ma: 'thi-may', ten: 'Thi máy IELTS (lượt thi, band, AI chấm Writing/Speaking của phòng thi)', co: s.thi.soLuot > 0, ghiChu: 'Band Reading/Listening chỉ có ở chế độ Full test 40 câu.' },
    { ma: 'so-loi', ten: 'Sổ lỗi IELTS (dạng câu, lý do sai, lịch ôn)', co: d.soLoi.some((m) => trong(m.updatedAt) || (m.lanOnCuoi != null && trong(m.lanOnCuoi))), ghiChu: '' },
    { ma: 'the-ielts', ten: 'Thẻ từ IELTS (ôn lặp ngắt quãng)', co: s.tuVung.ielts.luotOn > 0, ghiChu: '' },
    { ma: 'so-tu-ctl', ten: 'Sổ tay CT Language + lộ trình Học từ vựng (từ mới, từ nhớ sâu)', co: s.tuVung.ctl.moi > 0 || s.tuVung.ctl.daOn > 0, ghiChu: 'Từ "nhớ sâu" = khoảng ôn ≥ 21 ngày.' },
    { ma: 'app-ctl', ten: 'Thời gian học trên app CT Language (iOS)', co: d.ctlNgay.some((c) => c.ngay >= d.tuan && c.ngay <= congNgay(d.tuan, 6) && c.giay > 0), ghiChu: 'Phút do app đo khi màn học mở.' },
    { ma: 'thi-ctl', ten: 'Thi thử CT Language', co: s.ctlThi.so > 0, ghiChu: '' },
    { ma: 'ai-le', ten: 'AI chấm viết / nói / phát âm lẻ trong bài học', co: false, ghiChu: 'Không lưu kết quả trên máy chủ ⇒ không đưa vào nhận xét.' },
    { ma: 'am-sai', ten: 'Từng âm phát âm sai', co: false, ghiChu: 'Máy chủ chỉ giữ điểm phát âm tổng của lượt Speaking, không giữ từng âm.' },
    { ma: 'podcast', ten: 'Podcast đã nghe', co: false, ghiChu: 'Chưa lưu theo tài khoản.' },
    { ma: 'phut-web', ten: 'Thời gian thật trên web', co: false, ghiChu: 'Không đo; phút là ƯỚC TÍNH từ số phút của bài đã xong + thời gian thi + số thẻ đã ôn.' },
  ];
}
