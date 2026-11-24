/**
 * CT Language trên web — SỔ TỪ dùng CHUNG với app iOS theo tài khoản (24/11/2026). THUẦN — không mạng, không DOM.
 *
 * Máy chủ: `GET/POST /api/v1/ctlanguage/so-tu` (api-backend `src/services/ctlanguage/soTuDongBo*.ts`). Hợp đồng do app
 * iOS đặt (`ios-app/.../App/SoTuCTL.swift` + `DongBoSoTuCTL.swift`) — web CHỈ đọc/ghi đúng khuôn đó, không thêm trường:
 *   · bản ghi `so`   — một sổ tay; khoa = id sổ (UUID), duLieu {ten, nn, taoLuc, nguon}
 *   · bản ghi `the`  — một thẻ + SM-2; khoa = `<nn>-<muc.id>`, duLieu {muc, nn, themLuc, heSo, khoangNgay, lanDung, lanQuen,
 *                      denHan, lanOnCuoi, so[]}
 *   · bản ghi `ngay` — một ngày đã học (yyyy-MM-dd, giờ máy), chỉ thêm.
 * Bản mới hơn thắng theo từng bản ghi (máy chủ quyết) ⇒ web ghi `capNhat` = bây giờ (mili-giây) mỗi lần sửa.
 *
 * Mục "Học từ vựng" của app dùng MỘT sổ mỗi ngôn ngữ có `nguon = "hoc-tu-vung:<nn>"`: từ học xong được thêm vào sổ đó
 * (ôn lặp), và máy mới nhận lại mọi thẻ trong sổ đó là "đã học" (`KhoHocTuVungCTL.nhanTuSoOn`). Web làm y như vậy ⇒
 * học trên máy tính thì điện thoại thấy "đã học", và ngược lại.
 */

export type NnCTL = 'en' | 'ja' | 'zh';
export const NN_CTL: readonly NnCTL[] = ['en', 'ja', 'zh'];
export const laNnCTL = (v: string): v is NnCTL => (NN_CTL as readonly string[]).includes(v);

/** Mục từ điển gọn (khớp `MucTu` của app). id âm = từ ngoài từ điển / bộ từ soạn sẵn. */
export interface MucTuCTL {
  id: number;
  chu: string;
  chuPhu?: string | null;
  doc?: string | null;
  hanViet?: string | null;
  nghiaVi?: string | null;
  nghiaEn?: string | null;
  thongDung?: boolean | null;
}

export interface TheTuCTL {
  muc: MucTuCTL;
  nn: NnCTL;
  themLuc: string;
  heSo: number;
  khoangNgay: number;
  lanDung: number;
  lanQuen: number;
  denHan: string;
  lanOnCuoi: string | null;
  so: string[] | null;
}

export interface SoTayCTL { id: string; ten: string; nn: NnCTL; taoLuc: string; nguon: string | null }

export type LoaiBanGhi = 'so' | 'the' | 'ngay';
export interface BanGhiSoTu {
  loai: LoaiBanGhi;
  khoa: string;
  capNhat: string;
  xoa?: boolean;
  duLieu?: Record<string, unknown>;
}

/** Bản sao sổ của tài khoản trên trình duyệt (dựng từ các bản ghi kéo về). */
export interface GuongSoTu {
  the: Map<string, TheTuCTL>;
  so: Map<string, SoTayCTL>;
  ngay: Set<string>;
  /** Mốc kéo (`phien_ban` lớn nhất đã nhận) — chuỗi vì là bigint. */
  moc: string;
}

export const guongRong = (): GuongSoTu => ({ the: new Map(), so: new Map(), ngay: new Set(), moc: '0' });

/** Giới hạn số thẻ của bản miễn phí — app chặn ở máy (`KhoSoTu.GIOI_HAN_FREE`), web theo đúng số đó. */
export const GIOI_HAN_FREE = 200;
/** Một lần đẩy tối đa (máy chủ `LO_TOI_DA`). */
export const LO_DAY = 500;

/** Nguồn của sổ "Học từ vựng" từng ngôn ngữ (app: `KhoHocTuVungCTL.nguonSo`). */
export const nguonSoHtv = (nn: NnCTL) => `hoc-tu-vung:${nn}`;
/** Nguồn của sổ tạo từ một bộ chuyên ngành (app: `ApiSoChuyenNganh.nguon`). */
export const nguonSoCn = (ma: string) => `cn:${ma}`;
export const khoaThe = (nn: NnCTL, id: number) => `${nn}-${id}`;

/** Khoá từ — y hệt máy chủ (`khoaTuHtv`) và app: en chữ thường + gộp khoảng trắng, ja/zh nguyên chữ. */
export function khoaTu(nn: string, chu: string): string {
  const s = chu.normalize('NFC').trim().replace(/\s+/g, ' ');
  return nn === 'en' ? s.toLowerCase() : s;
}

/** id tạm (âm, ổn định) khi từ không kèm id mục từ điển — FNV-1a 32 bit như `KhoHocTuVungCTL.idTam`. */
export function idTam(k: string): number {
  let h = 0x811c9dc5;
  for (const ch of k) {
    h = (h ^ ch.codePointAt(0)!) >>> 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return -(200_000_000 + (h % 700_000_000));
}

/** Giờ ISO có mili-giây (đúng khuôn app gửi). */
export const isoLuc = (d: Date) => new Date(Math.floor(d.getTime())).toISOString();

/** Khoá ngày theo GIỜ MÁY người dùng (app: `KhoSoTu.khoaNgay`). */
export function khoaNgay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Đã "thuộc": khoảng ôn ≥ 21 ngày (app: `TheTu.daThuoc`). */
export const daThuocThe = (t: TheTuCTL) => t.khoangNgay >= 21;

// ─── Đọc bản ghi kéo về ───────────────────────────────────────────────────────────────────────────────────────────

const laChuoi = (v: unknown): v is string => typeof v === 'string';
const laSo = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Đọc duLieu của thẻ (đã chuẩn hoá ở máy chủ) — sai khuôn ⇒ null (bỏ qua, không làm hỏng cả sổ). */
export function docThe(d: unknown): TheTuCTL | null {
  if (!d || typeof d !== 'object') return null;
  const r = d as Record<string, unknown>;
  const m = r.muc as Record<string, unknown> | undefined;
  if (!m || !laSo(m.id) || !laChuoi(m.chu) || !laChuoi(r.nn) || !laNnCTL(r.nn)) return null;
  if (!laChuoi(r.themLuc) || !laChuoi(r.denHan) || !laSo(r.heSo) || !laSo(r.khoangNgay)) return null;
  const chuoi = (v: unknown) => (laChuoi(v) ? v : null);
  return {
    muc: {
      id: m.id, chu: m.chu, chuPhu: chuoi(m.chuPhu), doc: chuoi(m.doc), hanViet: chuoi(m.hanViet),
      nghiaVi: chuoi(m.nghiaVi), nghiaEn: chuoi(m.nghiaEn), thongDung: typeof m.thongDung === 'boolean' ? m.thongDung : null,
    },
    nn: r.nn,
    themLuc: r.themLuc,
    heSo: r.heSo,
    khoangNgay: r.khoangNgay,
    lanDung: laSo(r.lanDung) ? r.lanDung : 0,
    lanQuen: laSo(r.lanQuen) ? r.lanQuen : 0,
    denHan: r.denHan,
    lanOnCuoi: chuoi(r.lanOnCuoi),
    so: Array.isArray(r.so) ? r.so.filter(laChuoi) : null,
  };
}

/** Áp một lô bản ghi kéo về (máy chủ đã chọn bản thắng ⇒ cứ thế ghi đè / xoá). Trả gương MỚI. */
export function apKeo(g: GuongSoTu, ds: readonly BanGhiSoTu[], moc?: string): GuongSoTu {
  const a: GuongSoTu = { the: new Map(g.the), so: new Map(g.so), ngay: new Set(g.ngay), moc: moc ?? g.moc };
  for (const r of ds) {
    if (r.loai === 'ngay') { a.ngay.add(r.khoa); continue; }
    if (r.loai === 'the') {
      if (r.xoa) { a.the.delete(r.khoa); continue; }
      const t = docThe(r.duLieu);
      if (t && khoaThe(t.nn, t.muc.id) === r.khoa) a.the.set(r.khoa, t);
      continue;
    }
    if (r.loai === 'so') {
      if (r.xoa) { a.so.delete(r.khoa); continue; }
      const d = r.duLieu as Record<string, unknown> | undefined;
      if (d && laChuoi(d.ten) && laChuoi(d.nn) && laNnCTL(d.nn)) {
        a.so.set(r.khoa, { id: r.khoa, ten: d.ten, nn: d.nn, taoLuc: laChuoi(d.taoLuc) ? d.taoLuc : r.capNhat, nguon: laChuoi(d.nguon) ? d.nguon : null });
      }
    }
  }
  return a;
}

// ─── Dựng bản ghi để đẩy ──────────────────────────────────────────────────────────────────────────────────────────

export function banGhiThe(t: TheTuCTL, luc: Date): BanGhiSoTu {
  const muc: Record<string, unknown> = { id: t.muc.id, chu: t.muc.chu };
  for (const k of ['chuPhu', 'doc', 'hanViet', 'nghiaVi', 'nghiaEn'] as const) if (t.muc[k]) muc[k] = t.muc[k];
  if (typeof t.muc.thongDung === 'boolean') muc.thongDung = t.muc.thongDung;
  return {
    loai: 'the', khoa: khoaThe(t.nn, t.muc.id), capNhat: isoLuc(luc),
    duLieu: {
      muc, nn: t.nn, themLuc: t.themLuc, heSo: t.heSo, khoangNgay: t.khoangNgay, lanDung: t.lanDung, lanQuen: t.lanQuen,
      denHan: t.denHan, lanOnCuoi: t.lanOnCuoi, so: t.so?.length ? t.so : null,
    },
  };
}

export function banGhiSo(s: SoTayCTL, luc: Date): BanGhiSoTu {
  return { loai: 'so', khoa: s.id, capNhat: isoLuc(luc), duLieu: { ten: s.ten.slice(0, 60), nn: s.nn, taoLuc: s.taoLuc, nguon: s.nguon } };
}

export const banGhiNgay = (d: Date): BanGhiSoTu => ({ loai: 'ngay', khoa: khoaNgay(d), capNhat: isoLuc(d), duLieu: {} });

/** Thẻ mới (đến hạn ngay — như app `KhoSoTu.themNhieu`). */
export function theMoi(muc: MucTuCTL, nn: NnCTL, soId: string | null, luc: Date): TheTuCTL {
  const s = isoLuc(luc);
  return { muc, nn, themLuc: s, heSo: 2.5, khoangNgay: 0, lanDung: 0, lanQuen: 0, denHan: s, lanOnCuoi: null, so: soId ? [soId] : null };
}

// ─── Ôn lặp SM-2 rút gọn (app: `LichOn.cham`) ─────────────────────────────────────────────────────────────────────

export type ChamOn = 'quen' | 'kho' | 'nho' | 'de';
export const CHAM_ON: readonly { ma: ChamOn; nhan: string }[] = [
  { ma: 'quen', nhan: 'Quên' }, { ma: 'kho', nhan: 'Khó' }, { ma: 'nho', nhan: 'Nhớ' }, { ma: 'de', nhan: 'Dễ' },
];

export function chamThe(t0: TheTuCTL, c: ChamOn, bayGio: Date): TheTuCTL {
  const t = { ...t0 };
  const ms = bayGio.getTime();
  if (c === 'quen') {
    t.lanQuen += 1;
    t.lanDung = 0;
    t.khoangNgay = 0;
    t.heSo = Math.max(1.3, t.heSo - 0.2);
    t.denHan = isoLuc(new Date(ms + 10 * 60_000));
  } else {
    t.lanDung += c === 'de' ? 2 : 1;
    const goc = t.lanDung === 1 ? 1 : t.lanDung === 2 ? 3 : t.khoangNgay * t.heSo;
    const nhan = c === 'kho' ? 0.6 : c === 'de' ? 1.4 : 1;
    t.khoangNgay = Math.max(c === 'kho' ? 0.5 : 1, Math.round(goc * nhan * 10) / 10);
    t.heSo = Math.min(3, Math.max(1.3, t.heSo + (c === 'kho' ? -0.15 : c === 'de' ? 0.15 : 0)));
    t.denHan = isoLuc(new Date(ms + t.khoangNgay * 86_400_000));
  }
  t.lanOnCuoi = isoLuc(bayGio);
  return t;
}

/** "10 phút" · "1 ngày" · "3 ngày" — chữ dưới nút chấm (app: `LichOn.moTa`). */
export function moTaCham(t: TheTuCTL, c: ChamOn, bayGio: Date): string {
  const sau = chamThe(t, c, bayGio);
  const giay = (Date.parse(sau.denHan) - bayGio.getTime()) / 1000;
  if (giay < 3600) return `${Math.round(giay / 60)} phút`;
  if (giay < 86_400) return `${Math.round(giay / 3600)} giờ`;
  const ngay = giay / 86_400;
  return ngay < 30 ? `${Math.round(ngay)} ngày` : `${Math.round(ngay / 30)} tháng`;
}

// ─── Truy vấn ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** Các sổ của một ngôn ngữ có đúng nguồn (thường chỉ một; hai máy cùng tạo lúc mất mạng thì có thể hai). */
export const soTheoNguon = (g: GuongSoTu, nn: NnCTL, nguon: string) => [...g.so.values()].filter((s) => s.nn === nn && s.nguon === nguon);

/** Thẻ của một ngôn ngữ nằm trong một trong các sổ. */
export function theTrongSo(g: GuongSoTu, nn: NnCTL, soIds: readonly string[]): TheTuCTL[] {
  const ids = new Set(soIds);
  return [...g.the.values()].filter((t) => t.nn === nn && (t.so ?? []).some((x) => ids.has(x)));
}

export const denHan = (ds: readonly TheTuCTL[], bayGio: Date) => ds.filter((t) => Date.parse(t.denHan) <= bayGio.getTime())
  .sort((a, b) => Date.parse(a.denHan) - Date.parse(b.denHan));

/** Thẻ trong sổ "Học từ vựng" theo khoá từ (để tính "đã học / đã thuộc"). */
export function theHtvTheoKhoa(g: GuongSoTu, nn: NnCTL): Map<string, TheTuCTL> {
  const so = soTheoNguon(g, nn, nguonSoHtv(nn)).map((s) => s.id);
  const m = new Map<string, TheTuCTL>();
  for (const t of theTrongSo(g, nn, so)) m.set(khoaTu(nn, t.muc.chu), t);
  return m;
}

export function soNgayLienTiep(ngay: ReadonlySet<string>, bayGio: Date): number {
  const d = new Date(bayGio);
  if (!ngay.has(khoaNgay(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (ngay.has(khoaNgay(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/**
 * Thêm từ vào một sổ (thêm thẻ nếu chưa có) — đúng luật `KhoSoTu.themNhieu`: thẻ đã có (cùng id, hoặc cùng chữ trong cùng
 * ngôn ngữ) thì chỉ gắn thêm sổ; thẻ mới bị chặn khi chạm giới hạn bản miễn phí. Trả bản ghi cần đẩy (gương CHƯA đổi —
 * bên gọi áp bằng `apKeo` sau khi đẩy, hoặc ngay để giao diện phản hồi tức thì).
 */
export function themVaoSo(
  g: GuongSoTu, ds: readonly MucTuCTL[], nn: NnCTL, soId: string | null, opt: { laPro: boolean; bayGio: Date; sua?: (t: TheTuCTL) => TheTuCTL },
): { banGhi: BanGhiSoTu[]; moi: number; chan: boolean } {
  const banGhi: BanGhiSoTu[] = [];
  let moi = 0, chan = false;
  const theoChu = new Map<string, TheTuCTL>();
  for (const t of g.the.values()) if (t.nn === nn && !theoChu.has(t.muc.chu)) theoChu.set(t.muc.chu, t);
  let tong = g.the.size;
  const daDay = new Set<string>();
  for (const m of ds) {
    const co = g.the.get(khoaThe(nn, m.id)) ?? theoChu.get(m.chu);
    if (co) {
      const k = khoaThe(co.nn, co.muc.id);
      if (soId && !(co.so ?? []).includes(soId) && !daDay.has(k)) {
        daDay.add(k);
        banGhi.push(banGhiThe({ ...co, so: [...(co.so ?? []), soId] }, opt.bayGio));
      }
      continue;
    }
    if (!opt.laPro && tong >= GIOI_HAN_FREE) { chan = true; break; }
    let t = theMoi(m, nn, soId, opt.bayGio);
    if (opt.sua) t = opt.sua(t);
    const k = khoaThe(nn, m.id);
    if (daDay.has(k)) continue;
    daDay.add(k);
    theoChu.set(m.chu, t);
    banGhi.push(banGhiThe(t, opt.bayGio));
    tong++;
    moi++;
  }
  return { banGhi, moi, chan };
}

/** Bản ghi `the` → thẻ (để áp ngay vào gương trước khi máy chủ trả lời). */
export function apNgay(g: GuongSoTu, ds: readonly BanGhiSoTu[]): GuongSoTu { return apKeo(g, ds); }

/** UUID cho sổ mới (khoá sổ: [A-Za-z0-9-]{1,64}). */
export function uuidSo(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c?.randomUUID) return c.randomUUID().toUpperCase();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (x) => {
    const r = (Math.random() * 16) | 0;
    return (x === 'x' ? r : (r & 0x3) | 0x8).toString(16).toUpperCase();
  });
}
