/**
 * Phần THUẦN của `scripts/lenh-video.mjs` ("💻 Lệnh & code trong video", 20/11/2026) — không đĩa, không mạng — để test.
 *
 * Đầu vào: `lenh.json` của một video (video-bai-giang/xuat/trich-lenh.mts): `muc[]` = { t, loai:'lenh'|'ma', canh, tenCanh,
 * nhac, lenh, ra[], ma, tep, sua[], loi[] } — lệnh/code NGUYÊN VĂN trên hình + output thật + lời giảng quanh mốc.
 * Đầu ra: mục cho `lesson_video_commands.items` (xem src/services/video/lenhVideo.ts › MucLenhVideo).
 *
 * Model chỉ VIẾT GIẢI THÍCH. Lệnh, code, output, mốc giây đều do bộ trích lấy từ video — model không được đụng; phần
 * tách cờ (`chiTiet.phan`) phải là chuỗi con nguyên văn của lệnh, chú thích dòng (`dong.so`) phải nằm trong khối code —
 * sai là bị loại ở `ghepGiai` (và lần nữa ở máy chủ, `docMucLenh`).
 */
import { createHash } from 'node:crypto';

const gon = (s, max = 400) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

/** Khoá nội dung của một mục — giải thích đã có cho đúng khoá này thì dùng lại, không gọi model. */
export function khoaMuc(m) {
  const goc = m.loai === 'lenh'
    ? ['lenh', m.lenh, (m.ra ?? []).slice(0, 8).join('\n')]
    : ['ma', m.ma, JSON.stringify(m.sua ?? [])];
  return createHash('sha1').update(JSON.stringify(goc)).digest('hex').slice(0, 16);
}

export const HE_THONG = `Bạn là trợ giảng lập trình của cuongthai.com, viết cho người MỚI HỌC người Việt.
Bạn nhận danh sách LỆNH TERMINAL và KHỐI CODE đã được trích NGUYÊN VĂN từ hình của một video bài giảng (kèm output thật hiện trên video và lời giảng quanh đó). Viết phần giải thích hiện dưới video, để người xem hiểu mỗi lệnh/khối code đang làm gì.

LUẬT BẮT BUỘC:
1. Chỉ giải thích đúng thứ CÓ trong lệnh/code. KHÔNG bịa cờ, tham số, tuỳ chọn hay hành vi không có. Không chắc một cờ nghĩa gì thì nói ngắn điều chắc chắn, đừng đoán.
2. Với LỆNH ("lenh"):
   - "giai": 1–2 câu: lệnh này làm gì, trong bối cảnh bài.
   - "chiTiet": tách lệnh thành từng phần theo thứ tự: tên lệnh / lệnh con, MỖI cờ, mỗi tham số, toán tử (| && ; > < 2>&1). Mỗi phần { "phan", "nghia" }. "phan" PHẢI là chuỗi con NGUYÊN VĂN của lệnh (chép đúng từng ký tự). Lệnh rất ngắn (vd "ls") thì 1 phần.
   - "ketQua": kết quả mong đợi. Có OUTPUT TRÊN VIDEO thì diễn giải đúng output đó (dòng nào nói gì); không có thì nói lệnh in ra gì / im lặng nghĩa là thành công.
   - "ghiChu" (tuỳ): cảnh báo nếu lệnh xoá/ghi đè/không hoàn tác được, hoặc một mẹo thật sự hữu ích. Không có thì bỏ.
3. Với KHỐI CODE ("ma"):
   - "giai": 1–3 câu: khối code làm gì.
   - "ngon": ngôn ngữ (js, jsx, ts, tsx, html, css, json, sql, py, java, c, cpp, cs, go, sh, yaml, dockerfile, prisma, php, xml, text).
   - "dong": chú thích như COMMENT cho các dòng QUAN TRỌNG (không cần mọi dòng): { "so": số dòng đúng như đánh số trong input, "giai": ≤ 18 từ }.
   - Có mục SỬA TRONG VIDEO thì "ghiChu" nói đã sửa gì và vì sao.
4. "bo": true nếu mục KHÔNG phải lệnh/code người học cần (chỉ là log/output rời, nhãn giao diện, cây DOM của DevTools, dòng giữ chỗ). Khi bo: true chỉ cần { "i", "bo" }.
5. Giữ nguyên tên lệnh/hàm/tệp bằng tiếng Anh trong dấu \`…\`; phần còn lại tiếng Việt tự nhiên, ngắn gọn, không chào hỏi, không lặp lại lời giảng.
6. Chuỗi trông như mật khẩu/khoá thật thì gọi là "khoá bí mật", không chép lại.

Trả về DUY NHẤT một đối tượng JSON: {"muc":[{"i":0,...},{"i":1,...}]} — đủ MỌI mục theo đúng "i".`;

/** Tin nhắn người dùng cho một lô mục (`muc` = các mục của lenh.json, `i` = chỉ số trong lô). */
export function noiDungLo({ tenBai, khoa }, muc) {
  const L = [`KHOÁ: ${khoa} · BÀI: ${tenBai}`, `Có ${muc.length} mục (i = 0…${muc.length - 1}).`, ''];
  muc.forEach((m, i) => {
    L.push(`#${i} [${m.loai}] lúc ${Math.floor(m.t / 60)}:${String(Math.floor(m.t % 60)).padStart(2, '0')} · phần "${gon(m.tenCanh ?? m.canh, 80)}"`);
    if (m.loai === 'lenh') {
      L.push(`LỆNH: ${m.lenh}`);
      L.push(m.ra?.length ? `OUTPUT TRÊN VIDEO:\n${m.ra.slice(0, 8).map((d) => `  ${d.slice(0, 200)}`).join('\n')}` : 'OUTPUT TRÊN VIDEO: (không có dòng nào)');
    } else {
      if (m.tep) L.push(`TỆP: ${m.tep}`);
      const dong = String(m.ma ?? '').split('\n');
      L.push(`CODE (${dong.length} dòng, đánh số):`);
      dong.slice(0, 120).forEach((d, k) => L.push(`${String(k + 1).padStart(3)}| ${d}`));
      if (dong.length > 120) L.push(`   … (còn ${dong.length - 120} dòng)`);
      if (m.sua?.length) L.push(`SỬA TRONG VIDEO: ${m.sua.map((z) => `"${gon(z.truoc, 160)}" → "${gon(z.sau, 160)}"`).join(' ; ')}`);
    }
    if (m.loi?.length) L.push(`LỜI GIẢNG: ${gon(m.loi.join(' '), 500)}`);
    L.push('');
  });
  return L.join('\n');
}

/** Chia mục thành lô vừa một lời gọi (≤ 18 mục, ≤ ~14k ký tự). */
export function chiaLo(muc, toiDa = 18, kyTu = 14000) {
  const lo = [];
  let cur = [], dem = 0;
  for (const m of muc) {
    const n = (m.lenh?.length ?? 0) + (m.ma?.length ?? 0) + (m.ra ?? []).join('').length + 600;
    if (cur.length && (cur.length >= toiDa || dem + n > kyTu)) { lo.push(cur); cur = []; dem = 0; }
    cur.push(m); dem += n;
  }
  if (cur.length) lo.push(cur);
  return lo;
}

/** Bóc JSON khỏi câu trả lời (chịu được ```json … ``` và chữ thừa). */
export function bocJson(text) {
  const s = String(text ?? '');
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch { return null; }
}

const chuoi = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);

/**
 * Ghép giải thích của model vào mục gốc. Trả `null` khi model bảo bỏ (`bo`) hoặc thiếu giải thích.
 * Loại phần tách cờ KHÔNG nằm nguyên văn trong lệnh, và chú thích dòng ngoài khối code — đó là chỗ model hay bịa.
 */
export function ghepGiai(m, g) {
  if (!g || g.bo === true) return null;
  const giai = chuoi(g.giai, 1200);
  if (!giai) return null;
  const ra = { t: m.t, loai: m.loai, ...(m.tenCanh ? { canh: m.tenCanh } : {}), giai, k: khoaMuc(m) };
  const bo = { chiTiet: 0, dong: 0 };
  if (m.loai === 'lenh') {
    ra.lenh = m.lenh;
    if (m.nhac) ra.nhac = m.nhac;
    if (m.ra?.length) ra.ra = m.ra.slice(0, 12);
    const ct = (Array.isArray(g.chiTiet) ? g.chiTiet : [])
      .map((p) => ({ phan: chuoi(p?.phan, 200), nghia: chuoi(p?.nghia, 600) }))
      .filter((p) => p.phan && p.nghia);
    const dung = ct.filter((p) => m.lenh.includes(p.phan));
    bo.chiTiet = ct.length - dung.length;
    if (dung.length) ra.chiTiet = dung.slice(0, 16);
  } else {
    ra.ma = m.ma;
    if (m.tep) ra.tep = m.tep;
    const ngon = chuoi(g.ngon, 24); if (ngon) ra.ngon = ngon.toLowerCase();
    if (m.sua?.length) ra.sua = m.sua;
    const soDong = String(m.ma).split('\n').length;
    const dd = (Array.isArray(g.dong) ? g.dong : [])
      .map((d) => ({ so: Math.trunc(Number(d?.so)), giai: chuoi(d?.giai, 400) }))
      .filter((d) => d.giai && Number.isFinite(d.so));
    const dung = dd.filter((d) => d.so >= 1 && d.so <= soDong && String(m.ma).split('\n')[d.so - 1].trim());
    bo.dong = dd.length - dung.length;
    if (dung.length) ra.dong = dung.slice(0, 60);
  }
  const ketQua = chuoi(g.ketQua, 800); if (ketQua) ra.ketQua = ketQua;
  const ghiChu = chuoi(g.ghiChu, 800); if (ghiChu) ra.ghiChu = ghiChu;
  return { muc: ra, bo };
}

/** sha1 của đúng những gì seed ghi. */
export function vanTayLenh(videoUrl, items) {
  return createHash('sha1').update(JSON.stringify([videoUrl, items])).digest('hex');
}

/** JSON gọn mà đọc được trong diff: mỗi mục một dòng; không có mốc "sinh lúc" (chạy lại ra đúng từng byte). */
export function vietJsonLenh(tep) {
  const L = ['{', `  "courseSlug": ${JSON.stringify(tep.courseSlug)},`, `  "sinhBoi": ${JSON.stringify(tep.sinhBoi)},`, '  "lessons": {'];
  const slugs = Object.keys(tep.lessons).sort();
  slugs.forEach((slug, i) => {
    const m = tep.lessons[slug];
    const dau = { ...m }; delete dau.items;
    L.push(`    ${JSON.stringify(slug)}: {${JSON.stringify(dau).slice(1, -1)},`);
    L.push('      "items": [' + (m.items.length ? '\n' + m.items.map((x) => `        ${JSON.stringify(x)}`).join(',\n') + '\n      ' : '') + ']');
    L.push(`    }${i < slugs.length - 1 ? ',' : ''}`);
  });
  L.push('  }', '}');
  return L.join('\n') + '\n';
}
