/**
 * CT Language — THI THỬ CHUẨN (Đợt B, 14/11/2026): phần THUẦN (không CSDL, không tệp) — khuôn dữ liệu đề,
 * kiểm tính hợp lệ, chấm điểm, xếp lớp, tuần thi, giới hạn free.
 *
 *   npx tsx --test src/services/ctlanguage/thiThuan.test.ts
 *
 * ⛔ ĐỀ TỰ SOẠN — không chép đề thật của Hanban (HSK/HSKK), JLPT (JEES/Japan Foundation), IDP/British Council
 * (IELTS). Chỉ theo CẤU TRÚC (số phần, số câu, dạng câu, thời gian, thang điểm); câu chữ viết mới hoàn toàn.
 * Đề thật có HÌNH (HSK 1–2, JLPT 聴解) ⇒ ở đây thay bằng mô tả chữ (app chưa có kho tranh).
 *
 * App iOS chấm LẠI y hệt ở máy (`MoHinhThiCTL.swift › ChamThiCTL`) để khách (chưa đăng nhập) vẫn có phiếu điểm —
 * sửa luật chấm ở đây thì sửa cả bên đó (test hai bên dùng chung bộ ví dụ).
 */

export const NN_THI = ['en', 'ja', 'zh'] as const;
export type NnThi = (typeof NN_THI)[number];

/** Giọng đọc phần NGHE — phải có trong `GIONG` của `services/ielts/docTo.service.ts` (test đối chiếu). */
export const GIONG_THI = ['uk-nu', 'uk-nam', 'us-nu', 'us-nam', 'au-nu', 'au-nam', 'ja-nu', 'ja-nam', 'ja2-nu', 'ja2-nam', 'zh-nu', 'zh-nam'] as const;
const GIONG_THEO_NN: Record<NnThi, RegExp> = { en: /^(uk|us|au)-/, ja: /^ja2?-/, zh: /^zh-/ };

export const KIEU_CAU = ['chon', 'sapXep', 'dien', 'noi'] as const;
export type KieuCau = (typeof KIEU_CAU)[number];
export const KY_NANG = ['nghe', 'doc', 'viet', 'noi', 'tu-vung', 'ngu-phap'] as const;
export type KyNang = (typeof KY_NANG)[number];

export interface CauNghe { g: string; t: string }

export interface CauThi {
  id: string;
  kieu: KieuCau;
  /** Kịch bản nghe của RIÊNG câu này (đọc bằng TTS máy chủ). */
  nghe?: CauNghe[];
  /** Chữ hiện trên màn (đề bài). Câu nghe thuần có thể bỏ trống. */
  de?: string;
  /** chon: 2–4 lựa chọn. */
  luaChon?: string[];
  /** chon: chỉ số (0-based) · sapXep/dien: danh sách đáp án chấp nhận. */
  dapAn?: number | string[];
  /** sapXep: các mảnh (đã xáo sẵn). */
  manh?: string[];
  /** noi: câu để nhắc lại / câu trả lời mẫu. */
  mau?: string;
  /** noi: nhacLai (nghe rồi nhắc lại — máy chấm phát âm) | traLoi (trả lời câu hỏi — tự chấm theo mẫu). */
  noiKieu?: 'nhacLai' | 'traLoi';
  /** Giải thích tiếng Việt: vì sao đúng, bẫy ở đâu, từ/ngữ pháp liên quan. */
  giaiThich: string;
  /** Từ/ngữ pháp then chốt (chữ gốc) — sai câu này ⇒ gợi ý ôn các từ này (khớp sổ từ nếu tra được). */
  tu?: string[];
  /** Hệ số điểm trong phần (mặc định 1). */
  diem?: number;
}

export interface NhomCau {
  huongDan: string;
  /** Đoạn đọc chung cho cả nhóm. */
  doan?: string;
  /** Kịch bản nghe chung cho cả nhóm (hội thoại dài nhiều câu hỏi). */
  nghe?: CauNghe[];
  /** Số lần được nghe (mặc định 2; JLPT nghe 1 lần). */
  ngheLan?: number;
  cau: CauThi[];
}

export interface PhanThi {
  id: string;
  ten: string;
  kyNang: KyNang;
  phut: number;
  diemToiDa: number;
  nhom: NhomCau[];
}

export interface MucXepLop { cap: string; nhan: string; loTrinh: string }

export interface DeThi {
  id: string;
  nn: NnThi;
  /** HSK | HSKK | JLPT | IELTS | XEP-LOP */
  kyThi: string;
  /** HSK1 · HSK2 · HSK3 · HSKK-SO · N5 · N4 · IELTS-MINI · XEP-LOP */
  cap: string;
  ten: string;
  moTa: string;
  /** Điểm đạt (tổng). 0 = không có ngưỡng (xếp lớp). */
  diemDat: number;
  /** Có lên bảng Vinh danh tuần không (phần nói tự chấm ⇒ false). */
  xepHang: boolean;
  phan: PhanThi[];
  /** Chỉ đề xếp lớp: `muc[i]` ứng với `phan[i]`; đạt ≥ `nguong`% phần i thì xét tiếp phần i+1; qua hết ⇒ `vuot`. */
  xepLop?: { nguong: number; muc: MucXepLop[]; vuot: MucXepLop };
}

export const KY_THI = ['HSK', 'HSKK', 'JLPT', 'IELTS', 'XEP-LOP'] as const;

/**
 * Số câu CHUẨN theo từng phần của mỗi cấp (đúng cấu trúc kỳ thi). Đề thiếu/thừa ⇒ kiểm đề báo lỗi.
 * JLPT theo cấu trúc từ 12/2020 (N5 21+22+24, N4 28+29+28). HSKK sơ cấp: 15 nhắc lại + 10 nghe-trả lời + 2 trả lời.
 */
export const SO_CAU_CHUAN: Record<string, Record<string, number>> = {
  HSK1: { nghe: 20, doc: 20 },
  HSK2: { nghe: 35, doc: 25 },
  HSK3: { nghe: 40, doc: 30, viet: 10 },
  'HSKK-SO': { noi: 27 },
  N5: { 'tu-vung': 21, 'ngu-phap': 22, nghe: 24 },
  N4: { 'tu-vung': 28, 'ngu-phap': 29, nghe: 28 },
  'IELTS-MINI': { nghe: 20, doc: 20 },
};

/** Thứ tự + tên hiển thị các cấp theo ngôn ngữ (danh mục phòng thi). */
export const CAP_THEO_NN: Record<NnThi, Array<{ kyThi: string; cap: string; ten: string; moTa: string }>> = {
  zh: [
    { kyThi: 'HSK', cap: 'HSK1', ten: 'HSK 1', moTa: 'Nghe 20 câu · Đọc 20 câu · 40 phút · đạt 120/200' },
    { kyThi: 'HSK', cap: 'HSK2', ten: 'HSK 2', moTa: 'Nghe 35 câu · Đọc 25 câu · 55 phút · đạt 120/200' },
    { kyThi: 'HSK', cap: 'HSK3', ten: 'HSK 3', moTa: 'Nghe 40 · Đọc 30 · Viết 10 · 90 phút · đạt 180/300' },
    { kyThi: 'HSKK', cap: 'HSKK-SO', ten: 'HSKK Sơ cấp', moTa: 'Nói: nhắc lại 15 · nghe-trả lời 10 · trả lời 2 · đạt 60/100' },
  ],
  ja: [
    { kyThi: 'JLPT', cap: 'N5', ten: 'JLPT N5', moTa: '文字・語彙 21 · 文法・読解 22 · 聴解 24 · 90 phút · đạt 80/180' },
    { kyThi: 'JLPT', cap: 'N4', ten: 'JLPT N4', moTa: '文字・語彙 28 · 文法・読解 29 · 聴解 28 · 115 phút · đạt 90/180' },
  ],
  en: [
    { kyThi: 'IELTS', cap: 'IELTS-MINI', ten: 'IELTS Mini', moTa: 'Listening 20 câu · Reading 20 câu · 45 phút · đạt 24/40' },
  ],
};

// ─── Chuẩn hoá chữ khi so đáp án ─────────────────────────────

/** Bỏ khoảng trắng + dấu câu (cả dấu toàn khổ CJK), hạ chữ thường, NFC — "河上 有一条小船。" = "河上有一条小船". */
export function chuanHoaDapAn(s: string): string {
  return String(s ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　.,!?;:'"“”‘’。，、！？；：「」『』（）()·…—-]/g, '');
}

function demKyTu(s: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of chuanHoaDapAn(s)) m.set(c, (m.get(c) ?? 0) + 1);
  return m;
}

function cungKyTu(a: string, b: string): boolean {
  const x = demKyTu(a), y = demKyTu(b);
  if (x.size !== y.size) return false;
  for (const [k, v] of x) if (y.get(k) !== v) return false;
  return true;
}

// ─── Kiểm đề ─────────────────────────────────────────────────

export function tatCaCau(de: DeThi): Array<{ phan: PhanThi; nhom: NhomCau; cau: CauThi }> {
  const ra: Array<{ phan: PhanThi; nhom: NhomCau; cau: CauThi }> = [];
  for (const phan of de.phan ?? []) for (const nhom of phan.nhom ?? []) for (const cau of nhom.cau ?? []) ra.push({ phan, nhom, cau });
  return ra;
}

const coChu = (v: unknown, toiThieu = 1): v is string => typeof v === 'string' && v.trim().length >= toiThieu;

function kiemNghe(ds: unknown, nn: NnThi, o: string, loi: string[]) {
  if (!Array.isArray(ds) || !ds.length) { loi.push(`${o}: nghe phải là mảng có ít nhất 1 câu`); return; }
  for (const n of ds as CauNghe[]) {
    if (!n || !(GIONG_THI as readonly string[]).includes(n.g)) loi.push(`${o}: giọng "${n?.g}" không có trong GIONG_THI`);
    else if (!GIONG_THEO_NN[nn].test(n.g)) loi.push(`${o}: giọng "${n.g}" không thuộc ngôn ngữ ${nn}`);
    if (!coChu(n?.t)) loi.push(`${o}: câu nghe trống`);
    else if (n.t.length > 1500) loi.push(`${o}: câu nghe dài quá 1500 ký tự (trần của /ielts/doc)`);
  }
}

/** Trả danh sách lỗi (rỗng = đề hợp lệ). */
export function kiemDe(de: DeThi): string[] {
  const loi: string[] = [];
  const o0 = de?.id ?? '(không id)';
  if (!de || typeof de !== 'object') return ['đề không phải đối tượng'];
  if (!/^[a-z0-9-]{3,40}$/.test(String(de.id ?? ''))) loi.push(`${o0}: id phải khớp ^[a-z0-9-]{3,40}$`);
  if (!(NN_THI as readonly string[]).includes(de.nn)) loi.push(`${o0}: nn phải là en|ja|zh`);
  if (!(KY_THI as readonly string[]).includes(de.kyThi)) loi.push(`${o0}: kyThi không hợp lệ`);
  if (!coChu(de.cap)) loi.push(`${o0}: thiếu cap`);
  if (!coChu(de.ten)) loi.push(`${o0}: thiếu ten`);
  if (!coChu(de.moTa)) loi.push(`${o0}: thiếu moTa`);
  if (!Number.isFinite(de.diemDat) || de.diemDat < 0) loi.push(`${o0}: diemDat phải ≥ 0`);
  if (typeof de.xepHang !== 'boolean') loi.push(`${o0}: xepHang phải true/false`);
  if (!Array.isArray(de.phan) || !de.phan.length) { loi.push(`${o0}: không có phần nào`); return loi; }

  const idPhan = new Set<string>();
  const idCau = new Set<string>();
  const demKy: Record<string, number> = {};
  let tongDiem = 0;
  for (const p of de.phan) {
    const op = `${o0}/${p?.id}`;
    if (!coChu(p?.id) || idPhan.has(p.id)) loi.push(`${op}: id phần trống hoặc trùng`);
    idPhan.add(p.id);
    if (!coChu(p.ten)) loi.push(`${op}: thiếu tên phần`);
    if (!(KY_NANG as readonly string[]).includes(p.kyNang)) loi.push(`${op}: kyNang không hợp lệ`);
    if (!(p.phut > 0 && p.phut <= 120)) loi.push(`${op}: phut phải 1–120`);
    if (!(p.diemToiDa > 0)) loi.push(`${op}: diemToiDa phải > 0`);
    tongDiem += p.diemToiDa || 0;
    if (!Array.isArray(p.nhom) || !p.nhom.length) { loi.push(`${op}: không có nhóm câu`); continue; }
    for (const [gi, g] of p.nhom.entries()) {
      const og = `${op}/nhóm ${gi + 1}`;
      if (!coChu(g.huongDan, 8)) loi.push(`${og}: thiếu huongDan (tiếng Việt, ≥ 8 ký tự)`);
      if (g.nghe !== undefined) kiemNghe(g.nghe, de.nn, og, loi);
      if (g.ngheLan !== undefined && !(g.ngheLan >= 1 && g.ngheLan <= 3)) loi.push(`${og}: ngheLan 1–3`);
      if (!Array.isArray(g.cau) || !g.cau.length) { loi.push(`${og}: không có câu`); continue; }
      for (const c of g.cau) {
        const oc = `${o0}/câu ${c?.id}`;
        if (!coChu(c?.id) || idCau.has(c.id)) loi.push(`${oc}: id câu trống hoặc trùng`);
        idCau.add(c.id);
        demKy[p.kyNang] = (demKy[p.kyNang] ?? 0) + 1;
        if (!(KIEU_CAU as readonly string[]).includes(c.kieu)) { loi.push(`${oc}: kieu không hợp lệ`); continue; }
        if (!coChu(c.giaiThich, 20)) loi.push(`${oc}: giaiThich phải ≥ 20 ký tự (tiếng Việt)`);
        if (c.nghe !== undefined) kiemNghe(c.nghe, de.nn, oc, loi);
        if (p.kyNang === 'nghe' && !c.nghe && !g.nghe) loi.push(`${oc}: câu phần Nghe phải có kịch bản nghe (của câu hoặc của nhóm)`);
        if (c.diem !== undefined && !(c.diem > 0)) loi.push(`${oc}: diem phải > 0`);
        if (c.tu !== undefined && (!Array.isArray(c.tu) || c.tu.some((t) => !coChu(t)))) loi.push(`${oc}: tu phải là mảng chữ`);
        if (c.kieu === 'chon') {
          const lc = c.luaChon;
          if (!Array.isArray(lc) || lc.length < 2 || lc.length > 4 || lc.some((x) => !coChu(x))) loi.push(`${oc}: luaChon phải có 2–4 lựa chọn không trống`);
          else {
            if (new Set(lc.map((x) => x.trim())).size !== lc.length) loi.push(`${oc}: có lựa chọn trùng nhau ⇒ không còn đúng MỘT đáp án`);
            if (typeof c.dapAn !== 'number' || !Number.isInteger(c.dapAn) || c.dapAn < 0 || c.dapAn >= lc.length) loi.push(`${oc}: dapAn phải là chỉ số 0…${lc.length - 1}`);
          }
          if (!coChu(c.de) && !c.nghe && !g.nghe && !g.doan) loi.push(`${oc}: không có đề bài, đoạn đọc hay kịch bản nghe`);
        } else if (c.kieu === 'sapXep') {
          if (!Array.isArray(c.manh) || c.manh.length < 3 || c.manh.some((x) => !coChu(x))) loi.push(`${oc}: manh phải có ≥ 3 mảnh`);
          if (!Array.isArray(c.dapAn) || !c.dapAn.length || c.dapAn.some((x) => !coChu(x))) loi.push(`${oc}: dapAn phải là mảng câu đúng`);
          else if (Array.isArray(c.manh)) {
            for (const d of c.dapAn) if (!cungKyTu(d, c.manh.join(''))) loi.push(`${oc}: đáp án "${d}" không ghép được từ đúng các mảnh`);
            if (chuanHoaDapAn(c.manh.join('')) === chuanHoaDapAn(c.dapAn[0])) loi.push(`${oc}: các mảnh đang để đúng thứ tự đáp án — phải xáo`);
          }
        } else if (c.kieu === 'dien') {
          if (!Array.isArray(c.dapAn) || !c.dapAn.length || c.dapAn.some((x) => !coChu(x))) loi.push(`${oc}: dapAn phải là mảng đáp án chấp nhận`);
          if (!coChu(c.de) && !c.nghe && !g.nghe) loi.push(`${oc}: thiếu đề bài`);
        } else if (c.kieu === 'noi') {
          if (!coChu(c.mau)) loi.push(`${oc}: thiếu mau (câu nhắc lại / câu trả lời mẫu)`);
          if (c.noiKieu !== 'nhacLai' && c.noiKieu !== 'traLoi') loi.push(`${oc}: noiKieu phải là nhacLai|traLoi`);
          if (c.noiKieu === 'nhacLai' && !c.nghe) loi.push(`${oc}: câu nhắc lại phải có nghe`);
        }
      }
    }
  }

  const chuan = SO_CAU_CHUAN[de.cap];
  if (chuan) {
    for (const [k, n] of Object.entries(chuan)) if ((demKy[k] ?? 0) !== n) loi.push(`${o0}: phần "${k}" có ${demKy[k] ?? 0} câu, chuẩn ${de.cap} là ${n}`);
    for (const k of Object.keys(demKy)) if (!(k in chuan)) loi.push(`${o0}: cấp ${de.cap} không có phần "${k}"`);
  }
  if (de.diemDat > tongDiem) loi.push(`${o0}: diemDat ${de.diemDat} lớn hơn tổng điểm ${tongDiem}`);

  if (de.kyThi === 'XEP-LOP') {
    const x = de.xepLop;
    if (!x || !(x.nguong > 0 && x.nguong <= 100) || !Array.isArray(x.muc) || x.muc.length !== de.phan.length || !x.vuot) loi.push(`${o0}: xepLop phải có nguong, vuot và muc đúng bằng số phần`);
    else for (const m of [...x.muc, x.vuot]) if (!coChu(m?.cap) || !coChu(m?.nhan) || !coChu(m?.loTrinh, 20)) loi.push(`${o0}: mức xếp lớp thiếu cap/nhan/loTrinh`);
    if (de.xepHang) loi.push(`${o0}: đề xếp lớp không lên bảng xếp hạng`);
  } else if (de.xepLop) loi.push(`${o0}: chỉ đề XEP-LOP mới có xepLop`);
  return loi;
}

// ─── Chấm ────────────────────────────────────────────────────

/** Câu trả lời: chon ⇒ số; sapXep/dien ⇒ chữ; noi ⇒ số 0…1 (mức đạt do máy chấm phát âm / người học tự chấm). */
export type TraLoi = Record<string, number | string | null | undefined>;

/** Mức đạt của MỘT câu: 0…1. */
export function chamCau(c: CauThi, tl: number | string | null | undefined): number {
  if (tl === null || tl === undefined || tl === '') return 0;
  if (c.kieu === 'chon') return typeof tl === 'number' && tl === c.dapAn ? 1 : 0;
  if (c.kieu === 'noi') {
    const v = typeof tl === 'number' ? tl : Number(tl);
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
  }
  if (typeof tl !== 'string' || !Array.isArray(c.dapAn)) return 0;
  const toi = chuanHoaDapAn(tl);
  return toi !== '' && c.dapAn.some((d) => chuanHoaDapAn(d) === toi) ? 1 : 0;
}

export interface DiemPhan { id: string; ten: string; kyNang: KyNang; dung: number; tong: number; diem: number; diemToiDa: number }
export interface KetQuaCham {
  diem: number;
  diemToiDa: number;
  dung: number;
  tong: number;
  dat: boolean;
  phan: DiemPhan[];
  /** id các câu chưa đạt trọn (mức < 1). */
  sai: string[];
  /** Từ/ngữ pháp cần ôn — gom từ `tu` của các câu sai, không trùng, tối đa 60. */
  tuCanOn: string[];
  /** Chỉ đề xếp lớp. */
  xepLop?: MucXepLop & { vuot: boolean };
}

/** Điểm phần = tổng(mức đạt × hệ số) ÷ tổng hệ số × diemToiDa, làm tròn. Điểm đề = tổng điểm các phần. */
export function chamDe(de: DeThi, traLoi: TraLoi): KetQuaCham {
  const phan: DiemPhan[] = [];
  const sai: string[] = [];
  const tuCanOn: string[] = [];
  for (const p of de.phan) {
    let dat = 0, heSo = 0, dung = 0, tong = 0;
    for (const g of p.nhom) for (const c of g.cau) {
      const m = chamCau(c, traLoi?.[c.id]);
      const h = c.diem ?? 1;
      dat += m * h; heSo += h; tong += 1;
      if (m >= 1) dung += 1;
      else {
        sai.push(c.id);
        for (const t of c.tu ?? []) if (!tuCanOn.includes(t) && tuCanOn.length < 60) tuCanOn.push(t);
      }
    }
    phan.push({ id: p.id, ten: p.ten, kyNang: p.kyNang, dung, tong, diem: heSo > 0 ? Math.round((dat / heSo) * p.diemToiDa) : 0, diemToiDa: p.diemToiDa });
  }
  const diem = phan.reduce((a, b) => a + b.diem, 0);
  const ra: KetQuaCham = {
    diem,
    diemToiDa: phan.reduce((a, b) => a + b.diemToiDa, 0),
    dung: phan.reduce((a, b) => a + b.dung, 0),
    tong: phan.reduce((a, b) => a + b.tong, 0),
    dat: de.diemDat > 0 ? diem >= de.diemDat : true,
    phan, sai, tuCanOn,
  };
  if (de.xepLop) ra.xepLop = xepLop(de, phan);
  return ra;
}

/** Xếp lớp: phần đầu tiên chưa đạt ngưỡng ⇒ nên BẮT ĐẦU ở mức của phần đó; qua hết ⇒ `vuot`. */
export function xepLop(de: DeThi, phan: Array<{ dung: number; tong: number }>): MucXepLop & { vuot: boolean } {
  const x = de.xepLop!;
  for (let i = 0; i < x.muc.length; i++) {
    const p = phan[i];
    if (!p || p.tong === 0 || (p.dung / p.tong) * 100 < x.nguong) return { ...x.muc[i], vuot: false };
  }
  return { ...x.vuot, vuot: true };
}

// ─── Bản gửi cho app ────────────────────────────────────────

/** Tóm tắt một đề cho danh mục (không lộ câu hỏi). */
export function tomTatDe(de: DeThi) {
  return {
    id: de.id, nn: de.nn, kyThi: de.kyThi, cap: de.cap, ten: de.ten, moTa: de.moTa,
    diemDat: de.diemDat, xepHang: de.xepHang,
    diemToiDa: de.phan.reduce((a, p) => a + p.diemToiDa, 0),
    phut: de.phan.reduce((a, p) => a + p.phut, 0),
    soCau: tatCaCau(de).length,
    phan: de.phan.map((p) => ({ id: p.id, ten: p.ten, kyNang: p.kyNang, phut: p.phut, soCau: p.nhom.reduce((a, g) => a + g.cau.length, 0), diemToiDa: p.diemToiDa })),
  };
}

/**
 * Đề gửi cho app. Free: giữ đáp án (xem được câu nào sai + đáp án đúng) nhưng BỎ `giaiThich` (giải thích chi tiết là
 * quyền Pro — máy chủ phán, C14); mỗi phần để lại giải thích của 2 câu đầu làm mẫu.
 */
export function deChoApp(de: DeThi, laPro: boolean): DeThi & { coGiaiThich: boolean } {
  if (laPro) return { ...de, coGiaiThich: true };
  return {
    ...de,
    coGiaiThich: false,
    phan: de.phan.map((p) => {
      let n = 0;
      return { ...p, nhom: p.nhom.map((g) => ({ ...g, cau: g.cau.map((c) => (n++ < 2 ? c : { ...c, giaiThich: '' })) })) };
    }),
  };
}

// ─── Tuần + giới hạn free ───────────────────────────────────

const GIO_VN = 7 * 3_600_000;

/** 00:00 thứ Hai (giờ Việt Nam) của tuần chứa `bayGio` — mốc reset lượt free. */
export function dauTuanVn(bayGio: Date): Date {
  const vn = new Date(bayGio.getTime() + GIO_VN);
  const thu = (vn.getUTCDay() + 6) % 7; // T2 = 0
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() - thu) - GIO_VN);
}

/** Free: mỗi CẤP một đề mỗi tuần (làm lại đúng đề đó trong tuần thì được). Pro: không giới hạn. Xếp lớp: luôn được. */
export const LUOT_FREE_MOI_CAP_TUAN = 1;

export function duocThi(o: { laPro: boolean; kyThi: string; deId: string; deDaThiTuanNay: string[] }): { duoc: boolean; conLai: number | null } {
  if (o.laPro || o.kyThi === 'XEP-LOP') return { duoc: true, conLai: null };
  const khac = new Set(o.deDaThiTuanNay);
  const conLai = Math.max(0, LUOT_FREE_MOI_CAP_TUAN - khac.size);
  return { duoc: khac.has(o.deId) || khac.size < LUOT_FREE_MOI_CAP_TUAN, conLai };
}

/** Vinh danh: mỗi người MỘT dòng (điểm cao nhất; bằng điểm ⇒ làm nhanh hơn; vẫn bằng ⇒ nộp sớm hơn). */
export function xepVinhDanh<T extends { userId: number; diem: number; giay: number; luc: Date }>(ds: T[], toiDa = 50): Array<T & { hang: number }> {
  const hon = (a: T, b: T) => b.diem - a.diem || a.giay - b.giay || a.luc.getTime() - b.luc.getTime();
  const totNhat = new Map<number, T>();
  for (const d of ds) {
    const c = totNhat.get(d.userId);
    if (!c || hon(d, c) < 0) totNhat.set(d.userId, d);
  }
  return [...totNhat.values()].sort(hon).slice(0, toiDa).map((d, i) => ({ ...d, hang: i + 1 }));
}
