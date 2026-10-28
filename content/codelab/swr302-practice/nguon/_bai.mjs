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
/** Mô tả quá ngắn (< 220 ký tự EN) ⇒ thêm một câu hướng dẫn cách làm (bộ xuất đòi đề ≥ 300 ký tự). */
function duMoTa(moTa, loai) {
  if (!moTa || typeof moTa !== 'object' || String(moTa.en || '').length >= 220) return moTa;
  const them = {
    table: ['Each row is graded on its own; the explanation of every answer appears after you submit.', 'Mỗi dòng được chấm riêng; giải thích từng đáp án hiện sau khi nộp.'],
    choice: ['Each question is graded on its own; the explanation appears after you submit.', 'Mỗi câu được chấm riêng; giải thích hiện sau khi nộp.'],
    order: ['Drag the items into the right order; the explanation appears after you submit.', 'Kéo các mục về đúng thứ tự; giải thích hiện sau khi nộp.'],
  }[loai];
  return { en: `${moTa.en}<p>${them[0]}</p>`, vi: `${moTa.vi || ''}<p>${them[1]}</p>` };
}

export function phanLoai(q) {
  const { cot = 'Answer', luaChon, hang, deBang, ...rest } = q;
  const dapAn = {};
  hang.forEach(([, d], i) => { dapAn[`r${i}.k`] = d; });
  return tinhDe({
    ...rest,
    moTa: duMoTa(rest.moTa, 'table'),
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

/** Xáo phương án theo hạt giống cố định (băm câu hỏi) ⇒ đáp án không dồn về "a", mỗi lần xuất vẫn như nhau. */
function xao(c) {
  if (c.giuThuTu) return { lc: c.lc, dap: c.dap };
  let h = 2166136261;
  for (const ch of String(c.en)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const idx = c.lc.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const doi = {};
  const lc = idx.map((cu, moi) => { doi[c.lc[cu][0]] = LC[moi]; return [LC[moi], c.lc[cu][1]]; });
  const dap = Array.isArray(c.dap) ? c.dap.map((d) => doi[d]).sort() : doi[c.dap];
  return { lc, dap };
}

export function tracNghiem(q) {
  const { cau, giuThuTu, ...rest } = q;
  const da = cau.map((c) => xao(giuThuTu ? { ...c, giuThuTu } : c));
  let giaiThich = rest.giaiThich;
  const m = typeof giaiThich === 'string' && /^<p>Answers: [a-j ·,+]+(\.| — )/.exec(giaiThich);
  if (m) giaiThich = `<p>Answers: ${da.map((x) => (Array.isArray(x.dap) ? x.dap.join('+') : x.dap)).join(' · ')}${m[1]}${giaiThich.slice(m[0].length)}`;
  return tinhDe({
    ...rest,
    giaiThich,
    moTa: duMoTa(rest.moTa, 'choice'),
    loai: 'choice',
    cauHoi: cau.map((c, i) => ({
      ma: `q${i + 1}`,
      de: hai(c.en, c.vi),
      luaChon: lcGoc(...da[i].lc),
      dapAn: Array.isArray(da[i].dap) ? (c.nhieu ? [da[i].dap] : da[i].dap) : [da[i].dap],
      ...(c.nhieu ? { nhieu: true } : {}),
      giaiThich: giai(c.giai[0], c.giai[1]),
    })),
  });
}

export function sapXep(q) {
  const { cau, ...rest } = q;
  return tinhDe({
    ...rest,
    moTa: duMoTa(rest.moTa, 'order'),
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
