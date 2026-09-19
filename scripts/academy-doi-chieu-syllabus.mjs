/**
 * Đối chiếu file môn Academy với dữ liệu syllabus GỐC của FLM.
 *
 * Vì sao cần: 175 môn được viết lại bám theo syllabus FLM, và thứ sinh viên
 * dựa vào để học — trọng số điểm, số CLO, số buổi, ISBN giáo trình — là chỗ
 * sai thì tai hại nhất mà mắt người lại dễ bỏ sót nhất. Máy kiểm, không đọc tay.
 *
 * Dùng:
 *   node scripts/academy-doi-chieu-syllabus.mjs --ma PRF193 --syl <file-syllabus.json>
 *   node scripts/academy-doi-chieu-syllabus.mjs --tatca --thumuc <thư mục json>
 *
 * File syllabus JSON là bản rút gọn thu từ FLM, dạng:
 *   { ma, sylID, url, chung:{...}, taiLieu:[[...]], clo:[[...]], buoi:[[...]], danhGia:[[...]] }
 *
 * Mã thoát: 0 = đạt · 1 = có lỗi phải sửa trước khi deploy.
 */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

/** Gộp toàn bộ chữ của một môn (mọi bài, mọi trường) để tra sự có mặt. */
function chuCuaMon(spec) {
  const p = [];
  const di = (o) => {
    if (o == null) return;
    if (typeof o === 'string') { p.push(o); return; }
    if (Array.isArray(o)) { o.forEach(di); return; }
    if (typeof o === 'object') { Object.values(o).forEach(di); }
  };
  di(spec.sections);
  di(spec.course);
  return p.join('\n');
}

/** Bỏ dấu cách/xuống dòng để so "có nhắc tới hay không" mà không kẹt định dạng. */
const nen = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const nenChat = (s) => String(s || '').replace(/[\s\u00a0]/g, '').toLowerCase();

function doiChieu(ma, spec, syl) {
  const loi = [];
  const canhBao = [];
  const chu = chuCuaMon(spec);
  const chuChat = nenChat(chu);

  // ── 1. Định danh: sylID và số quyết định phải xuất hiện để SV tự kiểm chứng ──
  if (syl.sylID && !chuChat.includes(nenChat(syl.sylID)))
    loi.push(`thiếu sylID ${syl.sylID} — sinh viên không tự đối chiếu được với FLM`);
  const qd = syl.chung?.['DecisionNo MM/dd/yyyy'];
  if (qd) {
    const soQd = (qd.match(/([\d]+\/QĐ[^\s]*)/) || [])[1];
    if (soQd && !chuChat.includes(nenChat(soQd)))
      canhBao.push(`thiếu số quyết định ${soQd}`);
  }

  // ── 2. Số tín chỉ, thang điểm, điểm qua môn ──
  for (const [khoa, nhan] of [['NoCredit', 'số tín chỉ'], ['MinAvgMarkToPass', 'điểm qua môn']]) {
    const v = syl.chung?.[khoa];
    if (v && !new RegExp(`\\b${v}\\b`).test(chu))
      canhBao.push(`không thấy ${nhan} = ${v}`);
  }

  // ── 3. CLO: phải đủ số lượng, và mỗi CLO phải được nhắc tên ──
  const cloRows = (syl.clo || []).slice(1).filter((r) => r.length >= 2 && /CLO/i.test(r[1] || ''));
  for (const r of cloRows) {
    const ten = nen(r[1]);
    if (!new RegExp(ten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(chu))
      loi.push(`thiếu ${ten} (FLM có ${cloRows.length} CLO)`);
  }

  // ── 4. Đánh giá: từng đầu điểm + trọng số, và tổng phải bằng 100% ──
  const dgRows = (syl.danhGia || []).slice(1).filter((r) => r.length >= 5 && r[1]);
  let tong = 0;
  for (const r of dgRows) {
    const loai = nen(r[1]);
    const tt = nen(r[4]);                      // "20.0%"
    const so = Number(String(tt).replace(/[^\d.]/g, ''));
    if (Number.isFinite(so)) tong += so;
    // tên đầu điểm phải xuất hiện
    if (loai && !nenChat(chu).includes(nenChat(loai)))
      loi.push(`thiếu đầu điểm "${loai}"`);
    // trọng số phải xuất hiện đúng con số (chấp cả "20%" lẫn "20.0%")
    if (Number.isFinite(so)) {
      const daNhac = new RegExp(`${so}\\s*(?:[.,]0)?\\s*%`).test(chu) ||
                     new RegExp(`${so.toFixed(1).replace('.', '[.,]')}\\s*%`).test(chu);
      if (!daNhac) loi.push(`thiếu trọng số ${tt} của "${loai}"`);
    }
  }
  if (dgRows.length && Math.abs(tong - 100) > 0.5)
    canhBao.push(`tổng trọng số trong FLM = ${tong}% (không tròn 100%) — nêu rõ trong bài`);

  // ── 5. Giáo trình: ISBN và link phải nguyên vẹn (sai 1 ký tự là tra không ra) ──
  for (const r of (syl.taiLieu || []).slice(1)) {
    const hang = r.join(' ');
    for (const isbn of hang.match(/97[89][\d-]{10,}/g) || [])
      if (!chuChat.includes(nenChat(isbn))) loi.push(`thiếu ISBN ${isbn}`);
    for (const url of hang.match(/https?:\/\/[^\s|]+/g) || [])
      if (!chu.includes(url.replace(/[.,)]$/, ''))) loi.push(`thiếu link giáo trình ${url}`);
  }

  // ── 6. Kế hoạch buổi: mọi buổi phải được phủ ──
  //
  // ⚠️ KHÔNG so khớp chuỗi cứng. Bản đầu dùng "26 ký tự đầu của chủ đề" và
  // báo oan CẢ 5 buổi trên PRF193: bài viết "C/C++ Operators (Assignment,
  // Arithmetic)" (bỏ chữ "Operators" lần hai) và gộp "Session 58–60" thành
  // dải. Báo oan là thứ làm người ta ngừng đọc cảnh báo — xem
  // feedback_phep_kiem_dat_vi_ly_do_sai.
  //
  // Một buổi coi là ĐÃ PHỦ khi: (a) số buổi được nhắc (lẻ hoặc trong dải),
  // HOẶC (b) ≥70% từ đặc trưng của chủ đề xuất hiện trong nội dung môn.
  const buoiRows = (syl.buoi || []).slice(1).filter((r) => r.length >= 2 && r[1]);

  const soDaNhac = new Set();
  for (const m of chu.matchAll(/(?:sessions?|buổi|slot)\s*(\d{1,2})\s*(?:[–—-]\s*(\d{1,2}))?/gi)) {
    const a = Number(m[1]); const b = m[2] ? Number(m[2]) : a;
    if (b >= a && b - a < 30) for (let i = a; i <= b; i++) soDaNhac.add(i);
  }

  const BO_QUA = new Set(['the', 'and', 'in', 'of', 'to', 'for', 'a', 'an', 'with', 'on', 'using',
    'contd', 'cont', 'part', 'guide', 'project', 'practice', 'discussion', 'session', 'introduction']);
  const tuDacTrung = (s) => [...new Set(nen(s).toLowerCase().split(/[^a-z0-9+#]+/)
    .filter((w) => w.length >= 3 && !BO_QUA.has(w)))];

  const thieuBuoi = [];
  for (const r of buoiRows) {
    const so = Number(r[0]);
    if (Number.isFinite(so) && soDaNhac.has(so)) continue;
    const tu = tuDacTrung(r[1]);
    if (!tu.length) continue;
    const trung = tu.filter((w) => chuChat.includes(w)).length;
    if (trung / tu.length < 0.7) thieuBuoi.push(`${r[0]}. ${nen(r[1]).slice(0, 54)} (khớp ${trung}/${tu.length} từ)`);
  }
  if (thieuBuoi.length) loi.push(`KHÔNG phủ ${thieuBuoi.length}/${buoiRows.length} buổi:\n      - ` + thieuBuoi.slice(0, 12).join('\n      - '));

  // ── 7. Chốt kỹ thuật: title/slug ≤255, slug không trùng, có syncOrder ──
  const slugs = [];
  for (const s of spec.sections || []) for (const l of s.lessons || []) {
    slugs.push(l.slug);
    if ((l.title || '').length > 255) loi.push(`title ${(l.title || '').length} ký tự > 255: ${l.slug}`);
    if ((l.slug || '').length > 255) loi.push(`slug quá dài: ${l.slug}`);
  }
  const trung = [...new Set(slugs.filter((s, i) => slugs.indexOf(s) !== i))];
  if (trung.length) loi.push(`slug trùng: ${trung.join(', ')}`);
  if (!spec.course?.syncOrder) canhBao.push('course.syncOrder chưa bật — bài mới sẽ rơi xuống sau quiz');

  return { loi, canhBao, soBuoi: buoiRows.length, soCLO: cloRows.length, soBai: slugs.length };
}

// ───────────────────────────── chạy ─────────────────────────────
const dsMa = val('--ma') ? [val('--ma')] : null;
const thuMuc = val('--thumuc');
const sylFile = val('--syl');

const viec = [];
if (dsMa && sylFile) viec.push({ ma: dsMa[0], syl: JSON.parse(fs.readFileSync(sylFile, 'utf8')) });
else if (thuMuc) {
  for (const f of fs.readdirSync(thuMuc).filter((x) => x.endsWith('.json'))) {
    const syl = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8'));
    if (syl.ma) viec.push({ ma: syl.ma, syl });
  }
} else { console.error('cần --ma <MÃ> --syl <file.json>  hoặc  --thumuc <thư mục>'); process.exit(1); }

let hong = 0;
for (const { ma, syl } of viec) {
  const f = `content/academy/${ma}.mjs`;
  if (!fs.existsSync(f)) { console.log(`✗ ${ma}: chưa có ${f}`); hong++; continue; }
  const spec = (await import(path.resolve(f))).default;
  const kq = doiChieu(ma, spec, syl);
  const nhan = kq.loi.length ? '✗' : (kq.canhBao.length ? '!' : '✓');
  console.log(`${nhan} ${ma.padEnd(9)} ${String(kq.soBai).padStart(3)} bài · FLM: ${kq.soBuoi} buổi, ${kq.soCLO} CLO`);
  for (const x of kq.loi) console.log(`    ✗ ${x}`);
  for (const x of kq.canhBao) console.log(`    ! ${x}`);
  if (kq.loi.length) hong++;
}
console.log(`\n${viec.length - hong}/${viec.length} môn đạt.`);
process.exit(hong ? 1 : 0);
