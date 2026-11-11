/**
 * XẾP LỚP sau test đầu vào IELTS (Đề 0) — HÀM THUẦN theo docs/ielts-lo-trinh-0-8.md mục 4.3 + 1.5.
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️ BẢN SONG SINH: `src/services/ielts/xepLop.ts` (máy chủ) là cùng mã, chỉ khác dòng import bảng quy đổi
 * band. Web dùng để hiện kết quả NGAY; máy chủ tính LẠI từ số thô khi lưu (không tin tap/ngay web gửi lên).
 * `src/services/ielts/xepLop.test.ts` chạy cả hai trên cùng lưới đầu vào và bắt mọi chỗ lệch;
 * `frontend/src/lib/ielts/xepLop.test.ts` phủ từng hàng của bảng 4.3.
 *
 * Đầu vào:
 *  - `sangLoc`: số câu ĐÚNG / 30 của phần sàng lọc 10'.
 *  - `nghe`, `doc`: số câu ĐÚNG / 40 (điểm thô — quy band theo bảng 1.4). KHÔNG phải band.
 *  - `viet`, `noi`: BAND (0–9, bước .5) do AI chấm.
 *  Kỹ năng chưa làm (undefined) không tính vào Overall.
 */
import { bandTuDiem } from './cham';

export type DauVaoXepLop = { sangLoc: number; nghe?: number; doc?: number; viet?: number; noi?: number };
export type KetQuaXepLop = { tap: number; ngay: number; lyDo: string[]; duongOnKem: string[] };

export type KyNangXepLop = 'nghe' | 'doc' | 'viet' | 'noi';
/** Bản đầy đủ (web hiện bảng 4 kỹ năng; máy chủ lưu). */
export type XepLopChiTiet = KetQuaXepLop & {
  overall: number | null;
  band: Record<KyNangXepLop, number | null>;
  /** Kỹ năng quyết định vị trí khi lệch ≥ 2.0 (xếp theo kỹ năng yếu nhất thay vì Overall). */
  theoKyNang: KyNangXepLop | null;
};

const TEN: Record<KyNangXepLop, string> = { nghe: 'Listening', doc: 'Reading', viet: 'Writing', noi: 'Speaking' };
const bandNgheDoc = (dung: number, kyNang: 'doc' | 'nghe') => bandTuDiem(dung, kyNang);

/** Làm tròn band tổng kiểu IELTS (mục 1.5): .25 → .5 · .75 → nguyên kế · .125 → .0 · .625 → .5. */
export function lamTronBandTong(x: number): number {
  const nguyen = Math.floor(x);
  const du = x - nguyen;
  if (du < 0.25 - 1e-9) return nguyen;
  if (du < 0.75 - 1e-9) return nguyen + 0.5;
  return nguyen + 1;
}

/** Band tổng = trung bình các band có mặt, làm tròn theo 1.5; null khi chưa có kỹ năng nào. */
export function bandTong(bands: (number | null | undefined)[]): number | null {
  const co = bands.filter((b): b is number => typeof b === 'number' && Number.isFinite(b));
  if (!co.length) return null;
  return lamTronBandTong(co.reduce((s, b) => s + b, 0) / co.length);
}

const kepBand = (x: unknown): number | null => {
  const v = Number(x);
  if (x == null || !Number.isFinite(v)) return null;
  return Math.max(0, Math.min(9, Math.round(v * 2) / 2));
};
const kepSo = (x: unknown, max: number): number | null => {
  const v = Number(x);
  if (x == null || !Number.isFinite(v)) return null;
  return Math.max(0, Math.min(max, Math.round(v)));
};

/** Bảng luật mục 4.3 (hàng 2–11) theo một MỐC band (Overall, hoặc kỹ năng yếu nhất khi lệch ≥ 2.0). */
function theoBang(moc: number, sangLoc: number): { tap: number; ngay: number; ghiChu: string } {
  if (moc < 3.5) return { tap: 1, ngay: 1, ghiChu: 'học lại từ nền (mất gốc → 4.0)' };
  if (moc <= 4.0) {
    return sangLoc < 20
      ? { tap: 1, ngay: 7, ghiChu: `sàng lọc ${sangLoc}/30 dưới 20 nên ôn nửa sau Tập 1; làm bài kiểm tra d6-kiem-tra trước khi vào Ngày 7` }
      : { tap: 2, ngay: 1, ghiChu: `sàng lọc ${sangLoc}/30 từ 20 trở lên cho thấy nền ngữ pháp đã đủ để vào thẳng Tập 2` };
  }
  if (moc === 4.5) return { tap: 2, ngay: 13, ghiChu: 'làm bài kiểm tra chặng Ngày 12 trước, dưới 70 % thì lùi về Ngày 7' };
  if (moc === 5.0) return { tap: 3, ngay: 1, ghiChu: 'chặng 5.0 → 6.0, trọng tâm Writing + paraphrase' };
  if (moc === 5.5) return { tap: 3, ngay: 16, ghiChu: 'làm bài kiểm tra chặng Ngày 12 trước' };
  if (moc === 6.0) return { tap: 4, ngay: 1, ghiChu: 'chặng 6.0 → 7.0; bài đầu tiên là Đề 6' };
  if (moc === 6.5) return { tap: 4, ngay: 16, ghiChu: 'nửa sau Tập 4: độ chính xác, collocation, Passage 3 / Part 4' };
  if (moc === 7.0) return { tap: 5, ngay: 1, ghiChu: 'chặng 7.0 → 8.0' };
  if (moc === 7.5) return { tap: 5, ngay: 16, ghiChu: 'nửa sau Tập 5' };
  return { tap: 5, ngay: 8, ghiChu: 'Tập 5 chỉ luyện đề — Đề 9–12 (Ngày 8 · 16 · 24 · 30) và các ngày mổ đề; nên đăng ký thi' };
}

export function xepLopChiTiet(kq: DauVaoXepLop): XepLopChiTiet {
  const sangLoc = kepSo(kq.sangLoc, 30) ?? 0;
  const ngheSo = kepSo(kq.nghe, 40);
  const docSo = kepSo(kq.doc, 40);
  const band: Record<KyNangXepLop, number | null> = {
    nghe: ngheSo == null ? null : bandNgheDoc(ngheSo, 'nghe'),
    doc: docSo == null ? null : bandNgheDoc(docSo, 'doc'),
    viet: kepBand(kq.viet),
    noi: kepBand(kq.noi),
  };
  const overall = bandTong([band.nghe, band.doc, band.viet, band.noi]);
  const coBand = (Object.keys(band) as KyNangXepLop[]).filter((k) => band[k] != null);
  const tomTat = coBand.length
    ? `Band ước tính: ${coBand.map((k) => `${TEN[k]} ${band[k]!.toFixed(1)}`).join(' · ')} ⇒ Overall ${overall!.toFixed(1)} (sàng lọc ${sangLoc}/30).`
    : `Mới có phần sàng lọc: ${sangLoc}/30.`;
  const goc = { overall, band, theoKyNang: null, duongOnKem: [] as string[] };

  // Hàng 1: sàng lọc < 10, HOẶC Overall < 3.5, HOẶC L và R đều < 8/40.
  if (sangLoc < 10) {
    return { ...goc, tap: 1, ngay: 1, lyDo: [tomTat, `Sàng lọc ${sangLoc}/30 dưới 10 ⇒ bắt đầu Tập 1 Ngày 1 (mất gốc → 4.0), không cần làm tiếp các phần sau.`] };
  }
  if (ngheSo != null && docSo != null && ngheSo < 8 && docSo < 8) {
    return { ...goc, tap: 1, ngay: 1, lyDo: [tomTat, `Listening ${ngheSo}/40 và Reading ${docSo}/40 đều dưới 8 ⇒ bắt đầu Tập 1 Ngày 1 để dựng lại nền nghe – đọc.`] };
  }
  if (overall == null) {
    // Chỉ có sàng lọc (≥ 10): chưa đủ dữ liệu cho Overall — xếp TẠM theo sàng lọc như hàng 2/3.
    const r = sangLoc < 20 ? { tap: 1, ngay: 7 } : { tap: 2, ngay: 1 };
    return { ...goc, ...r, lyDo: [tomTat, `Chưa có band 4 kỹ năng nên xếp TẠM theo sàng lọc (${sangLoc}/30 ${sangLoc < 20 ? 'dưới 20 ⇒ Tập 1 Ngày 7' : 'từ 20 ⇒ Tập 2 Ngày 1'}); làm đủ test đầu vào để xếp chính xác.`] };
  }
  if (overall < 3.5) {
    return { ...goc, tap: 1, ngay: 1, lyDo: [tomTat, 'Overall dưới 3.5 ⇒ bắt đầu Tập 1 Ngày 1 (mất gốc → 4.0).'] };
  }

  // Luật kỹ năng lệch: lệch ≥ 2.0 ⇒ xếp theo kỹ năng yếu nhất thay vì Overall.
  const yeuNhat = coBand.reduce<KyNangXepLop | null>((y, k) => (y == null || band[k]! < band[y]! ? k : y), null);
  const theoKyNang = yeuNhat != null && overall - band[yeuNhat]! >= 2 - 1e-9 ? yeuNhat : null;
  const moc = theoKyNang ? band[theoKyNang]! : overall;
  const r = theoBang(moc, sangLoc);
  const lyDo = [tomTat];
  if (theoKyNang) {
    lyDo.push(`${TEN[theoKyNang]} ${moc.toFixed(1)} thấp hơn Overall ${overall.toFixed(1)} từ 2.0 band trở lên ⇒ xếp theo kỹ năng yếu nhất: Tập ${r.tap} Ngày ${r.ngay} (${r.ghiChu}) để không hụt nền.`);
  } else {
    lyDo.push(`Overall ${overall.toFixed(1)} ⇒ bắt đầu Tập ${r.tap} Ngày ${r.ngay}: ${r.ghiChu}.`);
  }
  // Lệch ≥ 1.0 (trừ kỹ năng đã dùng làm mốc) ⇒ đường ôn kèm = bài cùng kỹ năng của tập ngay dưới.
  const duongOnKem: string[] = [];
  if (r.tap > 1) {
    for (const k of coBand) {
      if (k === theoKyNang) continue;
      if (overall - band[k]! >= 1 - 1e-9) duongOnKem.push(`${TEN[k]} — bài ${TEN[k]} của Tập ${r.tap - 1}, 1 bài/ngày trước bài chính`);
    }
  }
  if (duongOnKem.length) {
    lyDo.push(`${duongOnKem.map((d) => d.split(' — ')[0]).join(', ')} thấp hơn Overall từ 1.0 band ⇒ thêm đường ôn kèm từ Tập ${r.tap - 1}.`);
  }
  return { ...goc, tap: r.tap, ngay: r.ngay, theoKyNang, duongOnKem, lyDo: lyDo.slice(0, 3) };
}

/** Hợp đồng gọn cho trung tâm thi. */
export function xepLop(kq: DauVaoXepLop): KetQuaXepLop {
  const { tap, ngay, lyDo, duongOnKem } = xepLopChiTiet(kq);
  return { tap, ngay, lyDo, duongOnKem };
}

/** "Chỉ đẩy lên": vị trí mới chỉ thay vị trí cũ khi xa hơn (tập lớn hơn, hoặc cùng tập mà ngày lớn hơn). */
export function viTriXaHon(a: { tap: number; ngay: number }, b: { tap: number; ngay: number }): { tap: number; ngay: number } {
  if (b.tap > a.tap || (b.tap === a.tap && b.ngay > a.ngay)) return { tap: b.tap, ngay: b.ngay };
  return { tap: a.tap, ngay: a.ngay };
}
