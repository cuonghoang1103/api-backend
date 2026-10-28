/**
 * Khung đề LỚN cho SWR302 (Lab chương, Deep Lab, mốc dự án): một module = một đề "bản in" chấm 'js'.
 *   deLon({ slug, ten, baiHoc, dangBai, tieuDe, phu, moTa, chucNangChinh, yeuCauChung, cayThuMuc, moHinh, duLieuMau?,
 *           chucNang:[{ ten, diem, moTa?, yeuCau, hook }], idBatBuoc, truDiem, tep:{ 'answers/x.js': [dau, giai] }, kiem,
 *           goiY, loiHayGap, giaiThich:{en,vi}, khaiNiem, thuatNgu, boYeu?, phut?, viDu?, tienQuyet? })
 * Mỗi kiểm gắn nhom 'f1'…'fN' theo thứ tự chucNang (tổng điểm = 10, như đề trường).
 *
 * Bộ dựng kiểm nhanh cho câu trả lời dạng object (khoá ⇒ giá trị cho phép):
 *   kiemBang(bien, dapAn, { nhom, an, ten, chuThich })   — mỗi khoá một kiểm, so không phân biệt hoa/thường; giá trị là chuỗi
 *                                                         hoặc mảng các đáp án chấp nhận
 *   kiemTap(bieuThuc, tap, …) / kiemSo(bieuThuc, so, …)   — tập (không thứ tự) / số (sai số)
 */
import { doiDau, KHOA, NOP_BAI, kiemKhoa } from './_chung.mjs';

const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v.en : v);

export function deLon(d) {
  const { tep, kiem, chucNang } = d;
  const tong = chucNang.reduce((s, c) => s + c.diem, 0);
  if (Math.abs(tong - 10) > 1e-9) throw new Error(`${d.slug}: tổng điểm ${tong} ≠ 10`);
  const khoiDau = {}, loiGiai = {};
  for (const [t, [dau, giai]] of Object.entries(tep)) { khoiDau[t] = dau; loiGiai[t] = giai; }
  return doiDau({
    slug: d.slug,
    ten: d.ten,
    moTaModule: d.moTaModule || d.moTaNgan,
    capDo: d.capDo || (d.dangBai === 'project' ? 'INTERMEDIATE' : 'ADVANCED'),
    khoa: KHOA,
    baiHoc: d.baiHoc,
    de: [{
      dangBai: d.dangBai || 'lab',
      tieuDe: d.tieuDe,
      doKho: d.doKho || 'HARD', phut: d.phut || 60, diem: 100,
      ngonNgu: 'javascript',
      viDu: d.viDu || [{ input: 'answers/*.js — one object per row of the template', output: 'Rubric table: marks per question (e.g. B. 2.5/3)', explanation: 'Every rubric line is checked separately; hidden checks run on Submit.|||Mỗi dòng rubric được kiểm riêng; kiểm ẩn chạy khi Nộp.' }],
      khaiNiem: d.khaiNiem || [],
      tienQuyet: d.tienQuyet || [],
      the: ['swr302', d.dangBai || 'lab', ...(d.the || [])],
      banIn: {
        tieuDe: d.tieuDe, phu: d.phu, moTa: d.moTa,
        chucNangChinh: d.chucNangChinh, yeuCauChung: d.yeuCauChung,
        cayThuMuc: d.cayThuMuc, wireframe: d.wireframe, moHinh: d.moHinh, duLieuMau: d.duLieuMau,
        chucNang, idBatBuoc: d.idBatBuoc, truDiem: d.truDiem, nopBai: d.nopBai || NOP_BAI,
      },
      thuatNgu: d.thuatNgu || [],
      goiY: d.goiY, loiHayGap: d.loiHayGap,
      moTaNgan: d.moTaNgan,
      giaiThich: d.giaiThich,
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(tep), kiem },
      khoiDau, loiGiai,
      ...(d.boYeu ? { boYeu: d.boYeu } : {}),
    }],
  });
}

/** Mỗi khoá của object `bien` một kiểm. dapAn = { K1: 'X' | ['X','Y'] }. */
export function kiemBang(bien, dapAn, { nhom, an = [], ten = (k) => `${bien}.${k}`, tenVi, goiY = {} } = {}) {
  return kiemKhoa(Object.entries(dapAn).map(([k, v]) => ({
    moTa: { en: ten(k), vi: (tenVi || ten)(k) },
    bieuThuc: `${bien}[${JSON.stringify(k)}]`,
    chap: Array.isArray(v) ? v : [v],
    ...(nhom ? { nhom } : {}),
    ...(an.includes(k) ? { an: true } : {}),
    ...(goiY[k] ? { goiY: goiY[k] } : {}),
  })));
}

export function kiemTap(bieuThuc, tap, moTa, ex = {}) {
  return kiemKhoa([{ moTa, bieuThuc: `(${bieuThuc} || []).map(String)`, chap: [tap], kieu: 'tap', ...ex }])[0];
}
export function kiemSo(bieuThuc, so, moTa, ex = {}) {
  return kiemKhoa([{ moTa, bieuThuc, chap: [so], kieu: 'so', saiSo: ex.saiSo ?? 0.006, ...ex }])[0];
}

/** Đáp án object ⇒ chuỗi JS gọn (mỗi khoá một dòng, kèm chú thích tuỳ chọn). */
export function objDong(ten, obj, chuThich = {}) {
  const q = (v) => (Array.isArray(v) ? `[${v.map(q).join(', ')}]` : typeof v === 'number' ? String(v) : `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`);
  return `const ${ten} = {\n${Object.entries(obj).map(([k, v]) => `  ${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${q(v)},${chuThich[k] ? `  // ${chuThich[k]}` : ''}`).join('\n')}\n};\n`;
}
/** Khung trống: mọi khoá = '' (hoặc [] khi đáp án là mảng). */
export function objTrong(ten, obj, mau = {}) {
  return objDong(ten, Object.fromEntries(Object.keys(obj).map((k) => [k, mau[k] ?? (Array.isArray(obj[k]) && Array.isArray(obj[k][0]) ? [] : '')])));
}
export { L };
