/**
 * Trắc nghiệm / sắp thứ tự cho các bộ luyện sinh bằng mã (OSG202, CEA201, MAD101, NWC204) — dùng chung cho `tinh()`.
 *
 * Vì sao có tệp này (30/10/2026): `tinh()` cũ xoay đáp án theo k = seed + 3i + 1 trong khi nguồn luôn để đáp án đúng ở đầu,
 * nên cả đề có đáp án a → b → c → d lặp vòng: biết 2 câu đầu là suy ra cả đề thi thử. Giao diện và API không xáo lại.
 *
 * Luật:
 * - Thứ tự hiện chỉ phụ thuộc NỘI DUNG câu hỏi (băm ổn định), không phụ thuộc vị trí câu hay thứ tự viết trong nguồn.
 * - Giữa các câu trong cùng đề không được có bước nhảy đều (kể cả cùng một chữ) trên ≥ 4 câu liền nhau;
 *   đề ≥ 8 câu thì không chữ nào được chiếm quá 40 % đáp án.
 * - Lời giải KHÔNG BAO GIỜ viết tay chữ cái: danh sách đáp án sinh ở đây, sau khi xáo. Giải thích nói theo NỘI DUNG phương án.
 */

/** HTML ⇒ chữ thường, để băm và soạn answers.md. */
export const thuanChu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** FNV-1a 32 bit: ổn định giữa các lần chạy, không phụ thuộc máy. */
export function bam(s) {
  let h = 0x811c9dc5;
  for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
/** mulberry32. */
function tao(hat) {
  let a = hat >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Fisher–Yates theo khoá (chuỗi) ⇒ mảng mới. */
export function xaoTheoKhoa(mang, khoa) {
  const a = [...mang]; const r = tao(bam(khoa));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CHU_CAI = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const dsDap = (c) => (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn);

/** Một câu: thứ tự theo nội dung (xếp trước rồi xáo, nên đảo dòng trong nguồn không đổi kết quả) ⇒ mã a, b, c… theo vị trí mới. */
function xaoMotCau(c, muoi) {
  const ds = [...c.luaChon].sort((x, y) => (String(x.noiDung) < String(y.noiDung) ? -1 : 1));
  const khoa = `${muoi}|${thuanChu(c.de)}|${ds.map((o) => thuanChu(o.noiDung)).join('|')}`;
  const moi = xaoTheoKhoa(ds, khoa).map((o, j) => ({ ma: CHU_CAI[j], noiDung: o.noiDung, cu: o.ma }));
  const anh = Object.fromEntries(moi.map((o) => [o.cu, o.ma]));
  const dapAn = Array.isArray(c.dapAn[0]) ? [c.dapAn[0].map((m) => anh[m]).sort()] : c.dapAn.map((m) => anh[m]);
  return { ...c, luaChon: moi.map(({ ma, noiDung }) => ({ ma, noiDung })), dapAn };
}

/** Có ≥ 4 câu liền nhau mà bước nhảy giữa hai đáp án kế tiếp đều bằng nhau (mod số phương án)? Bước 0 = cùng một chữ. */
export function coMauLap(cauHoi) {
  const v = cauHoi.map((c) => CHU_CAI.indexOf(dsDap(c)[0]));
  const n = Math.max(...cauHoi.map((c) => c.luaChon.length));
  for (let i = 0; i + 3 < v.length; i++) {
    const b = (v[i + 1] - v[i] + n) % n;
    if ((v[i + 2] - v[i + 1] + n) % n === b && (v[i + 3] - v[i + 2] + n) % n === b) return true;
  }
  if (v.length >= 8) {
    const dem = {};
    for (const x of v) dem[x] = (dem[x] || 0) + 1;
    if (Math.max(...Object.values(dem)) > Math.ceil(v.length * 0.4)) return true;
  }
  return false;
}

/** Xáo cả đề; dính mẫu lặp ⇒ đổi muối (vẫn xác định, không ngẫu nhiên). */
export function xaoCauHoi(cauHoi) {
  for (let muoi = 0; muoi < 4096; muoi++) {
    const kq = cauHoi.map((c) => xaoMotCau(c, muoi));
    if (!coMauLap(kq)) return kq;
  }
  throw new Error('xaoCauHoi: không tìm được thứ tự không lặp');
}

/** Lời giải cuối đề: đáp án thật (chữ + nội dung) kèm giải thích từng câu, rồi phần tổng kết viết tay (nếu có). */
export function loiGiaiTracNghiem(cauHoi, thanCu) {
  const ds = cauHoi.map((c) => {
    const d = dsDap(c).map((m) => `<b>${m})</b> ${c.luaChon.find((o) => o.ma === m).noiDung}`).join(' + ');
    return `<li><p>${d}</p>${c.giaiThich || ''}</li>`;
  }).join('');
  const than = String(thanCu || '').trim();
  if (/^<p>[a-f](?:\+[a-f])*(?: · |\.)/.test(than)) throw new Error(`Lời giải viết tay chữ cái: ${than.slice(0, 60)}`);
  return `<p><b>Answer key / Đáp án</b></p><ol>${ds}</ol>${than}`;
}

/** Sắp thứ tự: thứ tự hiện xáo theo nội dung, không được trùng đáp án và không được là phép xoay của đáp án; mã không lộ thứ tự đúng. */
export function xaoThuTu(c) {
  const dung = c.dapAn.join('|');
  const laXoay = (ds) => `${dung}|${dung}|`.includes(`${ds.join('|')}|`);
  for (let muoi = 0; muoi < 4096; muoi++) {
    const ds = xaoTheoKhoa([...c.muc].sort((x, y) => (String(x.noiDung) < String(y.noiDung) ? -1 : 1)), `${muoi}|${thuanChu(c.de)}|${c.muc.map((m) => thuanChu(m.noiDung)).sort().join('|')}`);
    if (ds.length > 2 && laXoay(ds.map((m) => m.ma))) continue;
    if (ds.length <= 2 && ds.map((m) => m.ma).join('|') === dung) continue;
    const anh = Object.fromEntries(ds.map((m, i) => [m.ma, `m${i + 1}`]));
    return { ...c, muc: ds.map((m) => ({ ...m, ma: anh[m.ma] })), dapAn: c.dapAn.map((m) => anh[m]) };
  }
  throw new Error('xaoThuTu: không xáo được');
}
