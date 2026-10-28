/**
 * Bộ dựng BÀI NHỎ (luyện từng bài học) của SWR302 — gọn để soạn nhiều đề mà vẫn đủ trường bắt buộc.
 *   phanLoai({ … cot:'Type', luaChon:[…], hang:[[câu EN, đáp án | [đáp án…], câu VI?]] })   ⇒ bảng phân loại (table)
 *   tracNghiem({ … cau:[{ en, vi, lc:[[ma, nội dung]…], dap:'b' | ['a','c'], giai:[en, vi], nhieu? }] }) ⇒ choice
 *   sapXep({ … cau:[{ en, vi, dung:[nội dung theo ĐÚNG thứ tự], hien:[chỉ số hiển thị], giai:[en, vi] }] }) ⇒ order
 *   baiJs({ … bien, tep:[dau, giai], kiem, ten tệp? })                                ⇒ bài 'js' một tệp trả lời
 *   moDun({ slug, ten, moTaModule, baiHoc, de:[…] })                                ⇒ module cho bộ xuất
 * Mọi đề song ngữ: tiêu đề EN, moTa {en, vi}; câu hỏi EN + dòng VI nghiêng (hai()).
 */
import { doiDau, KHOA, hai, giai, lc as lcGoc, tinhDe, jsDe } from './_chung.mjs';

const LC = 'abcdefghij';

export function phanLoai(q) {
  const { cot = 'Answer', luaChon, hang, deBang, ...rest } = q;
  const dapAn = {};
  hang.forEach(([, d], i) => { dapAn[`r${i}.k`] = d; });
  return tinhDe({
    ...rest,
    loai: 'table',
    bang: [{
      ma: 'b1',
      de: deBang ? hai(deBang.en, deBang.vi) : hai('Choose the right value for every row.', 'Chọn giá trị đúng cho mỗi dòng.'),
      cot: [{ ma: 's', ten: q.cotCau || 'Statement' }, { ma: 'k', ten: cot, luaChon }],
      hang: hang.map(([en, , vi], i) => ({ ma: `r${i}`, o: { s: vi ? `${en} — <i>${vi}</i>` : en } })),
      dapAn,
      giaiThich: giai(q.giaiBang?.[0] || q.giaiThich, q.giaiBang?.[1] || ''),
    }],
  });
}

export function tracNghiem(q) {
  const { cau, ...rest } = q;
  return tinhDe({
    ...rest,
    loai: 'choice',
    cauHoi: cau.map((c, i) => ({
      ma: `q${i + 1}`,
      de: hai(c.en, c.vi),
      luaChon: lcGoc(...c.lc),
      dapAn: Array.isArray(c.dap) ? (c.nhieu ? [c.dap] : c.dap) : [c.dap],
      ...(c.nhieu ? { nhieu: true } : {}),
      giaiThich: giai(c.giai[0], c.giai[1]),
    })),
  });
}

export function sapXep(q) {
  const { cau, ...rest } = q;
  return tinhDe({
    ...rest,
    loai: 'order',
    cauHoi: cau.map((c, i) => {
      const muc = c.dung.map((noiDung, j) => ({ ma: LC[j], noiDung }));
      const hien = c.hien || muc.map((_, j) => j).reverse();
      return { ma: `q${i + 1}`, de: hai(c.en, c.vi), muc: hien.map((j) => muc[j]), dapAn: muc.map((m) => m.ma), giaiThich: giai(c.giai[0], c.giai[1]) };
    }),
  });
}

/** Bài 'js' một (hoặc vài) tệp trả lời: tep = { 'answer.js': [dau, giai] } */
export function baiJs(q) {
  const { tep, kiem, ...rest } = q;
  return jsDe({ ...rest, tep, kiem });
}

export function moDun({ slug, ten, moTaModule, baiHoc, de }) {
  return doiDau({ slug, ten, moTaModule, khoa: KHOA, baiHoc: baiHoc || slug, de });
}
