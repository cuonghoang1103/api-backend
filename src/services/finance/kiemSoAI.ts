/**
 * CHỐT KIỂM SỐ cho câu trả lời của cố vấn AI (28/09/2026) — thuần, có test.
 * ─────────────────────────────────────────────────────────────────────
 * Luật của module: MÃ tính, model chỉ diễn đạt. Lời nhắc có dặn "không tự
 * cộng", nhưng dặn không phải là kiểm. Ở đây mọi con số trong câu trả lời bị
 * bóc ra và đối chiếu với BẢNG đã gửi cho model:
 *
 *   · "4.707.347₫" phải khớp đúng một số trong bảng (±0,5 ₫).
 *   · "4,7 triệu" được làm tròn tới 0,1 triệu ⇒ khớp nếu bảng có số nào nằm
 *     trong ±50.000 ₫ quanh 4.700.000 — model được nói gọn, không được bịa.
 *   · Ngày dd/mm/yyyy, tháng mm/yyyy phải là ngày/tháng có trong bảng.
 *   · Số nguyên nhỏ (≤ 12) bỏ qua — "3 khoản", "bước 1".
 *
 * Số nào không khớp ⇒ trả về danh sách để bên gọi bắt model viết lại, hoặc
 * gắn cảnh báo cho người đọc. Không bao giờ âm thầm cho qua.
 */
import { Prisma } from '@prisma/client';

export interface SoTrongChu {
  goc: string;
  giaTri: number;
  /** Nửa bước làm tròn mà cách viết cho phép. */
  saiSo: number;
  loai: 'so' | 'ngay' | 'thang';
}

const DON_VI: Record<string, number> = { 'tỷ': 1e9, 'ty': 1e9, 'triệu': 1e6, 'trieu': 1e6, 'tr': 1e6, 'nghìn': 1e3, 'ngàn': 1e3, 'k': 1e3 };

/** Bóc mọi con số (tiền, %, ngày) ra khỏi một đoạn chữ tiếng Việt. */
export function bocSo(chu: string): SoTrongChu[] {
  const ra: SoTrongChu[] = [];
  let s = chu;
  // Ngày trước — kẻo "28/09/2026" bị đọc thành 28, 09, 2026.
  s = s.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, (m, d, mo, y) => {
    ra.push({ goc: m, giaTri: Date.UTC(Number(y), Number(mo) - 1, Number(d)), saiSo: 0, loai: 'ngay' });
    return ' ';
  });
  s = s.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (m, y, mo, d) => {
    ra.push({ goc: m, giaTri: Date.UTC(Number(y), Number(mo) - 1, Number(d)), saiSo: 0, loai: 'ngay' });
    return ' ';
  });
  s = s.replace(/\b(\d{1,2})\/(\d{4})\b/g, (m, mo, y) => {
    ra.push({ goc: m, giaTri: Number(y) * 12 + Number(mo) - 1, saiSo: 0, loai: 'thang' });
    return ' ';
  });
  s = s.replace(/\b(\d{4})-(\d{2})\b/g, (m, y, mo) => {
    ra.push({ goc: m, giaTri: Number(y) * 12 + Number(mo) - 1, saiSo: 0, loai: 'thang' });
    return ' ';
  });
  const re = /(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?(?:\.(\d+))?\s*(tỷ|ty|triệu|trieu|tr|nghìn|ngàn|k)?(?![\p{L}\d])/giu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const nguyen = m[1].replace(/\./g, '');
    const le = m[2] ?? m[3] ?? '';
    // "1.5" kiểu Anh chỉ khi phần nguyên không có dấu chấm ngăn nghìn.
    const donVi = m[4] ? DON_VI[m[4].toLowerCase()] ?? 1 : 1;
    const giaTri = Number(`${nguyen}${le ? `.${le}` : ''}`) * donVi;
    const buoc = (le ? Math.pow(10, -le.length) : 1) * donVi;
    ra.push({ goc: m[0].trim(), giaTri, saiSo: buoc / 2 + 1e-6, loai: 'so' });
  }
  return ra;
}

export interface KetQuaKiemSo {
  hopLe: boolean;
  soKhongKhop: string[];
  soDaKiem: number;
}

/**
 * Đối chiếu số trong `traLoi` với số trong `bang` (chuỗi JSON đã gửi model,
 * cộng các câu người dùng đã hỏi — họ được nhắc lại số của chính họ).
 */
export function kiemSo(traLoi: string, ...nguon: string[]): KetQuaKiemSo {
  const cho = nguon.flatMap((x) => bocSo(x));
  const soCho = cho.filter((x) => x.loai === 'so').map((x) => x.giaTri);
  const ngayCho = new Set(cho.filter((x) => x.loai === 'ngay').map((x) => x.giaTri));
  const thangCho = new Set(cho.filter((x) => x.loai === 'thang').map((x) => x.giaTri));
  // Ngày có trong bảng thì tháng của nó cũng hợp lệ.
  for (const n of ngayCho) { const d = new Date(n); thangCho.add(d.getUTCFullYear() * 12 + d.getUTCMonth()); }

  const khong: string[] = [];
  let dem = 0;
  for (const x of bocSo(traLoi)) {
    if (x.loai === 'ngay') { dem++; if (!ngayCho.has(x.giaTri)) khong.push(x.goc); continue; }
    if (x.loai === 'thang') { dem++; if (!thangCho.has(x.giaTri)) khong.push(x.goc); continue; }
    if (Number.isInteger(x.giaTri) && x.giaTri >= 0 && x.giaTri <= 12 && x.saiSo <= 0.5 + 1e-6) continue;
    dem++;
    const ok = soCho.some((v) => Math.abs(Math.abs(v) - Math.abs(x.giaTri)) <= x.saiSo + 0.5);
    if (!ok) khong.push(x.goc);
  }
  return { hopLe: khong.length === 0, soKhongKhop: [...new Set(khong)], soDaKiem: dem };
}

/**
 * Số tiền người dùng nêu trong câu hỏi ("trả thêm 2 triệu mỗi tháng",
 * "có 50tr") — để MÃ tính kịch bản đúng số đó trước khi hỏi model.
 */
export function tienTrongCauHoi(cauHoi: string): { soTien: number; moiThang: boolean } | null {
  const ds = bocSo(cauHoi).filter((x) => x.loai === 'so' && x.giaTri >= 50_000);
  if (ds.length === 0) return null;
  const soTien = Math.max(...ds.map((x) => x.giaTri));
  const moiThang = /(mỗi|hằng|hàng)\s*tháng|\/\s*tháng|1 tháng|một tháng/i.test(cauHoi);
  return { soTien: Math.round(soTien), moiThang };
}

// ─── Phép tính do MÃ làm, model chỉ chọn số hạng ─────────────────────────

/**
 * Model KHÔNG được tự cộng — nhưng người dùng vẫn hỏi "tổng hai khoản là bao
 * nhiêu". Lối ra: model viết `[[tinh: 19.674.433₫ + 28.315.400₫]]`, mã
 * kiểm từng số hạng có trong bảng rồi tự tính bằng Decimal và thay vào.
 * Chỉ + − × ÷ và ngoặc; số viết kiểu Việt. Số hạng không có trong bảng ⇒
 * không tính, để lại dấu cảnh báo.
 */
export function thayPhepTinh(chu: string, ...nguon: string[]): { chu: string; ketQua: string[]; loi: string[] } {
  const ketQua: string[] = [];
  const loi: string[] = [];
  const ra = chu.replace(/\[\[\s*tinh\s*:\s*([^\]]+?)\s*\]\]/gi, (_m, bieuThuc: string) => {
    const coTien = /₫|đ\b|vnd/i.test(bieuThuc);
    const kiem = kiemSo(bieuThuc.replace(/[+\-*/×÷()]/g, ' '), ...nguon);
    if (!kiem.hopLe) { loi.push(bieuThuc); return `⚠️(không tính được: ${kiem.soKhongKhop.join(', ')} không có trong bảng)`; }
    const gt = tinhBieuThuc(bieuThuc);
    if (!gt) { loi.push(bieuThuc); return '⚠️(phép tính không hợp lệ)'; }
    const s = coTien
      ? `${gt.toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP).toNumber().toLocaleString('vi-VN')}₫`
      : gt.toDecimalPlaces(2).toNumber().toLocaleString('vi-VN', { maximumFractionDigits: 2 });
    ketQua.push(s);
    return s;
  });
  return { chu: ra, ketQua, loi };
}

/** Bộ tính biểu thức nhỏ (đệ quy xuống), Decimal, không `eval`. */
export function tinhBieuThuc(bt: string): Prisma.Decimal | null {
  const tok: string[] = [];
  const s = bt.replace(/₫|đ\b|vnd/gi, '').replace(/×/g, '*').replace(/÷/g, '/');
  const re = /\s*(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?|[+\-*/()])\s*/gy;
  let m: RegExpExecArray | null;
  let viTri = 0;
  while (viTri < s.length && (m = re.exec(s))) { tok.push(m[1]); viTri = re.lastIndex; }
  if (s.slice(viTri).trim()) return null;
  let i = 0;
  const so = (t: string) => new Prisma.Decimal(t.replace(/\./g, '').replace(',', '.'));
  const hang = (): Prisma.Decimal | null => {
    const t = tok[i++];
    if (t === '(') { const v = tong(); if (tok[i++] !== ')') return null; return v; }
    if (t === '-') { const v = hang(); return v ? v.negated() : null; }
    if (t && /^\d/.test(t)) return so(t);
    return null;
  };
  const tich = (): Prisma.Decimal | null => {
    let v = hang();
    while (v && (tok[i] === '*' || tok[i] === '/')) {
      const op = tok[i++]; const r = hang();
      if (!r) return null;
      if (op === '/' && r.isZero()) return null;
      v = op === '*' ? v.times(r) : v.dividedBy(r);
    }
    return v;
  };
  const tong = (): Prisma.Decimal | null => {
    let v = tich();
    while (v && (tok[i] === '+' || tok[i] === '-')) {
      const op = tok[i++]; const r = tich();
      if (!r) return null;
      v = op === '+' ? v.plus(r) : v.minus(r);
    }
    return v;
  };
  const v = tong();
  return v && i === tok.length ? v : null;
}
