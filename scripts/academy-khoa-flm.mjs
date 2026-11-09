/**
 * academy-khoa-flm.mjs — DỰNG TRỌN KHUNG KHOÁ của một môn Academy theo FLM:
 * chương ↔ bài theo đúng kế hoạch buổi của syllabus, slide của trường gắn vào đúng buổi/chương,
 * link, sách, tài liệu, kiểm tra & thi. Phần bài giảng chi tiết + video để trống chỗ, bổ sung sau
 * (user chốt 09/11/2026: "đầy đủ toàn bộ khoá của môn học… để sau này chỉ cần bổ sung bài giảng
 * chi tiết + làm video").
 *
 *   node scripts/academy-khoa-flm.mjs --kho ~/Documents/FLM-nguon/_kho --ma CHI111
 *   node scripts/academy-khoa-flm.mjs --kho ~/Documents/FLM-nguon/_kho --tatca [--bao-cao <tsv>]
 *
 * Vào : content/academy/_syllabus-flm/<MÃ>.json · <kho>/<MÃ>/slide-map.json (nếu có) ·
 *       <kho>/<MÃ>/muc-luc.json + text/ (nếu có) · content/exams/*.mjs (đếm đề trong Phòng thi)
 * Ra  : content/academy/_khoa-flm/<MÃ>.mjs (mảng section) — ghép lúc seed qua
 *       scripts/lib/academy-muc0-flm.mjs: Mục 0 → khối mở đầu sẵn có → KHOÁ FLM → các mục cũ của web.
 *
 * --tatca: mọi môn có syllabus FLM trừ BO_QUA (môn user xác nhận đã đầy đủ). Môn có Mục 0 làm tay vẫn được
 * dựng khoá (chương 2+ của chúng mới là khung) — Mục 0 tự sinh thì không.
 *
 * GHÉP SLIDE ↔ BUỔI (ghi mức tin cậy vào báo cáo + vào chính bài):
 *   buoi      tên deck ghi số buổi ("Session 1 2 3", "session 05")         ⇒ đúng buổi
 *   chuong    tên deck ghi số chương ("ch01", "Chapter 3", "C1", "CSI 01") ⇒ buổi đầu chương đó
 *   thu-tu    số deck = số chương dò được                                 ⇒ ghép theo thứ tự
 *   uoc-luong không dò được                                                ⇒ rải đều theo thứ tự, GHI RÕ là ước lượng
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const KHO = (val('--kho') || '~/Documents/FLM-nguon/_kho').replace(/^~/, os.homedir());
const DIR = 'content/academy';
const OUT = path.join(DIR, '_khoa-flm');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const URL_RE = /https?:\/\/[^\s<>"'`)\]]+[^\s<>"'`).,;:\]]/g;
const o = (s) => { const t = String(s ?? '').trim(); return t ? esc(t).replace(URL_RE, (u) => `<a href="${u.replace(/&amp;/g, '&')}" target="_blank" rel="noopener">${u}</a>`).replace(/\n/g, '<br>') : ''; };
/** Tiêu đề song ngữ: cột title của CSDL ≤255 ⇒ mỗi nửa ≤120. */
const ti = (en, vi) => `${cat(en, 120)}|||${cat(vi, 120)}`;
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const cat = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
const GUID = /\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}/g;
// Rác hiệu ứng động pptx (bản trích trước 09/11 02:25): "style.visibilitystyle.visibility…", "ppt_xppt_y", "#ppt_w"…
const TK = '(?:style\\.(?:visibility|rotation|opacity|color|fontSize|fontWeight)|#?ppt_[xywh]|fillcolor|fill\\.(?:on|type|color)|stroke\\.(?:on|color)|imagedata\\.\\w+)';
// chỉ xoá khi ≥2 mã DÍNH LIỀN (một `style.color` đứng riêng có thể là code JS thật trên slide)
const RAC_HIEU_UNG = new RegExp(`${TK}{2,}`, 'g');
const che = (s) => String(s ?? '').replace(RAC_HIEU_UNG, '').replace(/\n{3,}/g, '\n\n').replace(GUID, '').replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]').replace(/(?<!\d)(?:\+?84|0)(?:[\s.-]?\d){8,10}(?!\d)/g, '[sđt]');
const kv = (k, v) => `  <div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`;
const pct = (s) => { const m = String(s || '').match(/([\d.]+)\s*%/); return m ? parseFloat(m[1]) : null; };

/* ── đọc syllabus (hai định dạng: bản thu 09/11 có buoiCotHeader; bản cũ có hàng tiêu đề trong buoi) ── */
function rowsOf(tbl) { if (!Array.isArray(tbl) || tbl.length < 2) return []; const h = tbl[0]; return tbl.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? '']))); }
function buoiCua(syl) {
  let h, rows;
  if (syl.buoiCotHeader) { h = syl.buoiCotHeader; rows = syl.buoi || []; } else { h = (syl.buoi || [])[0] || []; rows = (syl.buoi || []).slice(1); }
  const get = (r, ...ks) => { for (const k of ks) { const i = h.indexOf(k); if (i >= 0 && r[i]) return r[i]; } return ''; };
  return rows.filter((r) => r.length && !/^session$/i.test(String(r[0]).trim()))
    .map((r, i) => ({
      so: parseInt(String(r[0]).match(/\d+/)?.[0] || String(i + 1), 10), nhan: String(r[0]).trim() || String(i + 1),
      topic: get(r, 'Topic'), type: get(r, 'Learning-Teaching Type'), lo: get(r, 'LO', 'CLO'), itu: get(r, 'ITU'),
      mat: get(r, 'Student Materials'), task: get(r, "Student's Tasks"), urls: get(r, 'URLs'),
    }));
}

/* ── chương: dò số chương trong chủ đề từng buổi ── */
const RE_CHUONG_CHU = /\b(?:chapter|chương|chap\.?|unit|lesson|bài|module)\s*0*(\d{1,2})(?!\d)/i;
const RE_CHUONG_SO = /(?:^|\n)\s*0*(\d{1,2})\s*[.)]\s*(?=\D)(?!\d)/;
const RE_MUC = /(?:^|[\s(—–-])0*(\d{1,2})\.\d{1,2}(?!\d)/;
const RE_PHAN = /\b(?:part|phần|topic|week|tuần)\s*0*(\d{1,2})(?!\d)/i;
const RE_DANH_GIA = /(progress\s*test|\bPT\s*\d|quiz|mid[\s-]?term|review|ôn tập|assignment|presentation|thuyết trình|practical\s*exam|\bPE\b|final\s*(exam|test)|\bFE\b|kiểm tra|thi cuối|bảo vệ|defen[cs]e|lab\s*\d|workshop)/i;

function soChuong(topic) {
  const t = String(topic || '');
  for (const re of [RE_CHUONG_CHU, RE_CHUONG_SO, RE_MUC, RE_PHAN]) { const m = t.match(re); if (m) return +m[1]; }
  return null;
}
function tenChuong(topic, n) {
  const t = String(topic || '').replace(/\r/g, '');
  const tot = (x) => x && /[A-Za-zÀ-ỹ一-龥]{3}/.test(x) && !/^\(/.test(x.trim()) && x.trim().split(/\s+/).length >= 2;
  const lam = (x) => cat(String(x).replace(new RegExp(`\\s*0*${n}\\.\\d{1,2}[\\s\\S]*$`), '').replace(/\s*[—–-]\s*$/, ''), 90);
  // 1. "Chapter 6: Tiêu đề" / "Unit 3 - Tiêu đề" (phải có dấu ngăn cách thật)
  let m = t.match(new RegExp(`(?:chapter|chương|chap\\.?|unit|lesson|bài|module)\\s*0*${n}\\s*[:.\\-–—]\\s*([^\\n]+)`, 'i'));
  if (m && tot(m[1])) return lam(m[1]);
  // 2. "1. Tiêu đề" đầu dòng
  m = t.match(new RegExp(`(?:^|\\n)\\s*0*${n}\\s*[.)]\\s*([^\\n\\d][^\\n]*)`));
  if (m && tot(m[1])) return lam(m[1]);
  // 3. dòng đầu, bỏ số mục "6.2 "
  const d = t.split('\n')[0].replace(/^\s*\d{1,2}(?:\.\d{1,2})*\s*[.):-]?\s*/, '');
  return tot(d) ? cat(d, 90) : '';
}
function chiaChuong(buoi) {
  let cur = null, coSo = 0;
  const gan = buoi.map((b) => {
    const n = soChuong(b.topic);
    if (n != null && (cur == null || (n >= cur && n <= cur + 3))) { if (n !== cur) coSo++; cur = n; }
    return cur;
  });
  const chuongs = [];
  buoi.forEach((b, i) => {
    const n = gan[i];
    const last = chuongs.at(-1);
    if (!last || last.n !== n) chuongs.push({ n, buoi: [b], ten: n == null ? '' : tenChuong(b.topic, n) });
    else last.buoi.push(b);
  });
  const dung = coSo >= 2 && chuongs.length <= 30 && chuongs.filter((c) => c.n != null).length >= 2;
  if (dung) return { chuongs, cach: 'so-chuong' };
  // không dò được ⇒ khối 5 buổi
  const k = [];
  for (let i = 0; i < buoi.length; i += 5) k.push({ n: k.length + 1, buoi: buoi.slice(i, i + 5), ten: '', khoi: true });
  return { chuongs: k, cach: 'khoi-5-buoi' };
}

/* ── ghép deck ↔ buổi ── */
function soBuoiTrongTen(ten) {
  // "session 10 - 21 slides" KHÔNG phải dải 10–21: bỏ cụm "<số> slide(s)/trang" trước khi dò
  ten = String(ten).replace(/\b\d{1,4}\s*(?:slides?|trang|pages?|p)\b/gi, ' ');
  const m = String(ten).match(/\b(?:sessions?|buổi|slot)\s*[:#]?\s*((?:\d{1,3}(?:\s*(?:,|&|-|–|_|and|\s)\s*)?)+)/i);
  if (!m) return null;
  const ds = [];
  for (const part of m[1].split(/[,&\s_]+|and/).filter(Boolean)) {
    const r = part.match(/^(\d{1,3})[-–](\d{1,3})$/);
    if (r) for (let x = +r[1]; x <= +r[2] && ds.length < 20; x++) ds.push(x);
    else if (/^\d{1,3}$/.test(part)) ds.push(+part);
  }
  return ds.length ? ds : null;
}
function soChuongTrongTen(ten) {
  const t = String(ten).replace(/\b(?:19|20)\d\d\b/g, ' ').replace(/\b\d+(?:st|nd|rd|th)\s*ed(?:ition)?\b|\b\d+e\b/gi, ' ');
  let m = t.match(/(?:chapter|chương|chap|ch|unit|lesson|lecture|lec|bài|module|part|week|topic|c)[\s._-]*0*(\d{1,2})(?!\d)/i);
  if (m) return +m[1];
  m = t.match(/(?:^|[\s_-])0*(\d{1,2})(?=[\s_.-]|$)/);
  return m ? +m[1] : null;
}
const STOP = new Set('the and for with from into that this are was were what when how why chapter chapters session sessions slide slides part lesson lessons lecture module unit week introduction intro course overview review bài buổi chương phần tuần của và các những trong cho với một này được là có không ppt pptx pdf interactive edition'.split(' '));
function tuKhoa(s) {
  return new Set(String(s || '').toLowerCase().normalize('NFC').split(/[^a-zà-ỹ0-9一-龥]+/i).filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w)));
}
function giong(a, b) { if (!a.size || !b.size) return 0; let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.sqrt(a.size * b.size); }
/**
 * Ghép deck ↔ buổi. (1) số buổi ghi trong tên deck = MỐC chắc chắn. (2) Giữa các mốc: quy hoạch động gán mỗi deck
 * một buổi sao cho THỨ TỰ deck không đảo ngược và tổng điểm lớn nhất; điểm = độ giống từ khoá (tên deck + dòng đầu
 * slide 1–2) với chủ đề buổi + thưởng 1,0 khi số chương trong tên deck = số chương của buổi + phạt rất nhẹ khi lệch
 * vị trí "đều" (để deck không tín hiệu rải đều thay vì dồn về đầu).
 */
function ghepDeck(decks, buoi, chuongs) {
  const theoSo = new Map(buoi.map((b, i) => [b.so, i]));
  const kq = decks.map(() => null);
  decks.forEach((d, i) => {
    const ds = soBuoiTrongTen(d.ten) || soBuoiTrongTen(d.file);
    const idx = ds?.map((x) => theoSo.get(x)).filter((x) => x != null);
    if (idx?.length) kq[i] = { buoi: idx, tin: 'buoi' };
  });
  const chuongCuaBuoi = new Array(buoi.length).fill(null);
  chuongs.forEach((c) => { if (!c.khoi && c.n != null) c.buoi.forEach((b) => { chuongCuaBuoi[buoi.indexOf(b)] = c.n; }); });
  const coChuong = chuongs.some((c) => !c.khoi && c.n != null);
  const tkBuoi = buoi.map((b) => tuKhoa(b.topic));
  const tkDeck = decks.map((d) => tuKhoa([d.ten, ...(d.chu || []).slice(0, 2).map((t) => String(t || '').split('\n').slice(0, 2).join(' '))].join(' ')));
  const soCh = decks.map((d) => (coChuong ? soChuongTrongTen(d.ten) : null));
  const day = buoi.map((b, i) => !RE_DANH_GIA.test(b.topic.split('\n')[0]));
  const soChuongCo = new Set(chuongCuaBuoi.filter((x) => x != null));
  const totNhat = (di) => { let bj = -1, sc = 0; tkBuoi.forEach((t, j) => { const g = giong(tkDeck[di], t); if (g > sc) { sc = g; bj = j; } }); return { bj, sc }; };
  // (a) deck tên KHÔNG có số (CSD203: "heap", "avltrees"…) — thứ tự file là ABC, không phải thứ tự học ⇒ gắn
  //     riêng từng deck vào buổi giống nhất; không đủ giống ⇒ để "Slide khác".
  // (b) deck có số chương KHÔNG có trong kế hoạch (ECO121 vĩ mô dạy ch24–36, gói có cả ch01–23 vi mô) ⇒ chỉ gắn
  //     khi nội dung khớp rõ; không thì "Slide khác".
  const rieng = new Set();
  decks.forEach((d, i) => {
    if (kq[i]) return;
    const khongSo = !/\d/.test(d.ten);
    const ngoai = coChuong && soCh[i] != null && soChuongCo.size >= 2 && !soChuongCo.has(soCh[i]);
    if (!khongSo && !ngoai) return;
    rieng.add(i);
    const { bj, sc } = totNhat(i);
    kq[i] = sc >= (ngoai ? 0.3 : 0.2) ? { buoi: [bj], tin: 'noi-dung' } : null;
    if (!kq[i]) kq[i] = { roi: true };
  });
  // các đoạn giữa hai mốc (mốc = deck ghép theo số buổi)
  const neo = decks.map((d, i) => i).filter((i) => kq[i] && kq[i].tin === 'buoi');
  const bien = [-1, ...neo, decks.length];
  for (let k = 0; k + 1 < bien.length; k++) {
    const a = bien[k], b = bien[k + 1];
    const doan = []; for (let i = a + 1; i < b; i++) if (!rieng.has(i)) doan.push(i);
    if (!doan.length) continue;
    const lo = a >= 0 ? Math.max(...kq[a].buoi) : 0;
    const hi = b < decks.length ? Math.min(...kq[b].buoi) : buoi.length - 1;
    const cot = []; for (let j = lo; j <= Math.max(lo, hi); j++) cot.push(j);
    const K = doan.length, S = cot.length;
    const diem = (ii, jj) => {
      const di = doan[ii], bj = cot[jj];
      let sc = giong(tkDeck[di], tkBuoi[bj]);
      if (soCh[di] != null && chuongCuaBuoi[bj] === soCh[di]) sc += 1.0;
      if (!day[bj]) sc -= 0.05;
      const ky = ((ii + 0.5) / K) * (S - 1);
      return sc - 0.02 * Math.abs(jj - ky) / Math.max(1, S);
    };
    const best = Array.from({ length: K }, () => new Array(S).fill(-Infinity));
    const from = Array.from({ length: K }, () => new Array(S).fill(-1));
    for (let jj = 0; jj < S; jj++) best[0][jj] = diem(0, jj);
    for (let ii = 1; ii < K; ii++) {
      let m = -Infinity, mj = -1;
      for (let jj = 0; jj < S; jj++) {
        if (best[ii - 1][jj] > m) { m = best[ii - 1][jj]; mj = jj; }
        best[ii][jj] = m + diem(ii, jj); from[ii][jj] = mj;
      }
    }
    let jj = 0; for (let x = 1; x < S; x++) if (best[K - 1][x] > best[K - 1][jj]) jj = x;
    for (let ii = K - 1; ii >= 0; ii--) {
      const di = doan[ii], bj = cot[jj];
      const g = giong(tkDeck[di], tkBuoi[bj]);
      const ch = soCh[di] != null && chuongCuaBuoi[bj] === soCh[di];
      kq[di] = { buoi: [bj], tin: ch ? 'chuong' : (g >= 0.22 ? 'noi-dung' : 'uoc-luong') };
      if (ii > 0) jj = from[ii][jj];
    }
  }
  return kq.map((x) => (x && x.roi ? null : x));
}

/* ── link & tài liệu ── */
const RAC = /(schemas\.openxmlformats|schemas\.microsoft|purl\.org|w3\.org\/|localhost|127\.0\.0\.1|example\.com|ns\.adobe|openxmlformats|microsoft\.com\/office\/)/i;
function gomLink(ma, syl, map) {
  const l = new Map();
  const them = (u, nguon) => { u = u.replace(/[.,;:)\]]+$/, ''); if (RAC.test(u) || u.length > 400) return; if (!l.has(u)) l.set(u, new Set()); l.get(u).add(nguon); };
  const quet = (s, nguon) => { for (const u of String(s || '').match(URL_RE) || []) them(u, nguon); };
  const c = syl.chung || {};
  Object.values(c).forEach((v) => quet(v, 'syllabus'));
  (syl.taiLieu || []).forEach((r) => r.forEach((x) => quet(x, 'giáo trình')));
  (syl.buoi || []).forEach((r) => r.forEach((x) => quet(x, 'kế hoạch buổi')));
  (syl.danhGia || []).forEach((r) => r.forEach((x) => quet(x, 'đánh giá')));
  (map?.decks || []).forEach((d) => (d.chu || []).forEach((t) => quet(t, `slide ${d.ten}`)));
  const tdir = path.join(KHO, ma, 'text');
  if (fs.existsSync(tdir)) {
    const di = (p) => { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); const st = fs.statSync(q); if (st.isDirectory()) di(q); else if (st.size < 3_000_000) quet(fs.readFileSync(q, 'utf8'), `tài liệu ${path.basename(f).replace(/\.txt$/, '')}`); } };
    di(tdir);
  }
  return [...l.entries()].map(([u, s]) => ({ u, nguon: [...s] }));
}
let DE_THI = null;
function deThi() {
  if (DE_THI) return DE_THI;
  DE_THI = new Map();
  const d = 'content/exams';
  for (const f of fs.existsSync(d) ? fs.readdirSync(d) : []) {
    if (!f.endsWith('.mjs')) continue;
    const t = fs.readFileSync(path.join(d, f), 'utf8');
    const ma = (t.match(/courseCode["']?\s*:\s*["']([A-Za-z0-9]+)["']/) || [])[1];
    if (!ma) continue;
    const kinds = [...t.matchAll(/["']?kind["']?\s*:\s*["'](PE|FE|PT|TE|MID|QUIZ|PT1|PT2)["']/g)].map((m) => m[1]);
    const e = DE_THI.get(ma) || { de: 0, loai: new Set() };
    e.de += (t.match(/["']?code["']?\s*:\s*["'][^"']+["']/g) || []).length || 1;
    kinds.forEach((k) => e.loai.add(k));
    DE_THI.set(ma, e);
  }
  return DE_THI;
}

/* ── dựng ── */
export function dungKhoa(ma, syl, map, mucLuc) {
  const lo = ma.toLowerCase();
  const buoi = buoiCua(syl);
  if (!buoi.length) return { sections: [], bao: { ma, loi: 'không có kế hoạch buổi' } };
  const { chuongs, cach } = chiaChuong(buoi);
  const decks = (map?.decks || []).filter((d) => d.n > 0);
  const ghep = ghepDeck(decks, buoi, chuongs);
  // deck nằm ở buổi ĐẦU của tập buổi được ghép; các buổi còn lại của tập trỏ về đó
  const deckO = new Map(), troVe = new Map();
  ghep.forEach((g, i) => {
    if (!g) return;
    const dau = Math.min(...g.buoi);
    if (!deckO.has(dau)) deckO.set(dau, []);
    deckO.get(dau).push({ d: decks[i], tin: g.tin });
    g.buoi.filter((x) => x !== dau).forEach((x) => { if (!troVe.has(x)) troVe.set(x, []); troVe.get(x).push({ d: decks[i], dau }); });
  });
  const cq = rowsOf(syl.cauHoiKienTao);
  const cqTheoBuoi = new Map();
  cq.forEach((r) => { const k = parseInt(r['Session No'], 10); if (!cqTheoBuoi.has(k)) cqTheoBuoi.set(k, []); cqTheoBuoi.get(k).push(r); });
  const thi = deThi().get(ma);
  const linkThi = `/exam?course=${encodeURIComponent(ma)}`;
  const TIN = {
    buoi: ['matched by the session number in the deck name', 'ghép theo số buổi ghi trong tên deck'],
    chuong: ['matched by the chapter number in the deck name', 'ghép theo số chương ghi trong tên deck'],
    'thu-tu': ['matched by order (one deck per chapter)', 'ghép theo thứ tự (mỗi chương một deck)'],
    'noi-dung': ['matched by content (deck title ↔ session topic)', 'ghép theo nội dung (tên deck ↔ chủ đề buổi)'],
    'uoc-luong': ['⚠️ ESTIMATED placement — the deck name gives no session/chapter number', '⚠️ GHÉP ƯỚC LƯỢNG — tên deck không ghi số buổi/chương, cần soát lại'],
  };

  const anhDeck = (d) => Array.from({ length: d.n }, (_, i) => {
    const n = i + 1;
    const src = `${map.base}/${d.key}/${String(n).padStart(3, '0')}.webp`;
    const chu = d.chu && d.chu[i] ? che(d.chu[i]).trim() : '';
    const alt = cat(`${ma} · ${d.ten} · slide ${n}${chu ? ': ' + chu.split('\n')[0] : ''}`, 180);
    return `<div class="anh-slide"><img src="${src}" alt="${esc(alt)}" loading="lazy" width="${d.w || 1280}" height="${d.h || 720}" /><p class="chu-thich">${esc(d.ten)} · slide ${n}/${d.n}</p></div>` +
      (chu ? `\n<div class="trich-slide"><p class="nhan">Trên slide · On the slide</p><p>${esc(chu).replace(/\n/g, '<br>')}</p></div>` : '');
  }).join('\n');

  const sections = [];
  const tenBuoi = (b) => cat(b.topic.split('\n')[0] || `Session ${b.nhan}`, 140);
  chuongs.forEach((c, ci) => {
    const so = ci + 1;
    const dai = c.buoi.length > 1 ? `${c.buoi[0].nhan}–${c.buoi.at(-1).nhan}` : c.buoi[0].nhan;
    const tenEn = c.khoi ? `Sessions ${dai}` : (c.n == null ? `Getting started (sessions ${dai})` : `${c.ten || `Chapter ${c.n}`} (sessions ${dai})`);
    const tenVi = c.khoi ? `Buổi ${dai}` : (c.n == null ? `Mở đầu (buổi ${dai})` : `${c.ten || `Chương ${c.n}`} (buổi ${dai})`);
    const lessons = c.buoi.map((b) => {
      const bi_ = buoi.indexOf(b);
      const dg = RE_DANH_GIA.test(b.topic.split('\n')[0]);
      const ds = deckO.get(bi_) || [];
      const tv = troVe.get(bi_) || [];
      const cqs = cqTheoBuoi.get(b.so) || [];
      const tong = ds.reduce((a, x) => a + x.d.n, 0);
      const parts = [];
      parts.push(bi(
        `<span class="eyebrow">${esc(ma)} · Chapter ${so} · Session ${esc(b.nhan)}${dg ? ' · assessment / review' : ''}</span>\n<h2>Session ${esc(b.nhan)} — ${esc(tenBuoi(b))}</h2>\n<p class="nhan">Source: FLM syllabus ${esc(syl.sylID)}${syl.thamKhao ? ` of ${esc(syl.thamKhao.ma)} (reference — none published for ${esc(ma)})` : ''} · session plan</p>`,
        `<span class="eyebrow">${esc(ma)} · Chương ${so} · Buổi ${esc(b.nhan)}${dg ? ' · kiểm tra / ôn tập' : ''}</span>\n<h2>Buổi ${esc(b.nhan)} — ${esc(tenBuoi(b))}</h2>\n<p class="nhan">Nguồn: syllabus FLM ${esc(syl.sylID)}${syl.thamKhao ? ` của môn ${esc(syl.thamKhao.ma)} (tham khảo — trường chưa công bố cho ${esc(ma)})` : ''} · kế hoạch buổi</p>`,
      ));
      const kvs = (L) => `<div class="kv-grid">\n${[
        [L === 'en' ? 'Type' : 'Hình thức', b.type], ['LO', b.lo], ['ITU', b.itu], [L === 'en' ? 'Slides in this lesson' : 'Slide trong bài', tong ? `${tong}` : (tv.length ? (L === 'en' ? `see session ${buoi[tv[0].dau].nhan}` : `xem buổi ${buoi[tv[0].dau].nhan}`) : (L === 'en' ? 'none from FLM' : 'FLM không có'))],
      ].filter(([, v]) => String(v || '').trim()).map(([k, v]) => kv(k, o(v))).join('\n')}\n</div>`;
      parts.push(bi(kvs('en'), kvs('vi')));
      parts.push(bi('<h3>What this session covers (FLM, verbatim)</h3>', '<h3>Nội dung buổi học (FLM, nguyên văn)</h3>') + `\n<p>${o(b.topic) || '—'}</p>`);
      if (b.mat.trim()) parts.push(bi('<h3>Materials to read</h3>', '<h3>Tài liệu cần đọc</h3>') + `\n<p>${o(b.mat)}</p>`);
      if (b.task.trim()) parts.push(bi("<h3>Student's tasks</h3>", '<h3>Nhiệm vụ sinh viên</h3>') + `\n<p>${o(b.task)}</p>`);
      if (b.urls.trim()) parts.push(bi('<h3>Links from the syllabus</h3>', '<h3>Link trong syllabus</h3>') + `\n<p>${o(b.urls)}</p>`);
      if (cqs.length) parts.push(bi('<h3>Constructive questions — answer them yourself first</h3>', '<h3>Câu hỏi kiến tạo — tự trả lời trước</h3>') + `\n<ul>\n${cqs.map((r) => `<li><strong>${esc(r.Name)}</strong> — ${o(r.Details)}</li>`).join('\n')}\n</ul>`);
      if (dg && thi) parts.push(bi(`<div class="note-ct">🧪 Practise in the <a href="${linkThi}">Exam Room — ${esc(ma)}</a> (${thi.de} practice papers${thi.loai.size ? ': ' + [...thi.loai].join(', ') : ''}).</div>`, `<div class="note-ct">🧪 Luyện tại <a href="${linkThi}">Phòng thi — ${esc(ma)}</a> (${thi.de} đề luyện${thi.loai.size ? ': ' + [...thi.loai].join(', ') : ''}).</div>`));
      for (const { d, tin } of ds) {
        parts.push(bi(`<h3>📑 School slides — ${esc(d.ten)} (${d.n} slides)</h3>\n<p class="ghi-chu">${TIN[tin][0]}${tin === 'buoi' || tin === 'chuong' || tin === 'thu-tu' ? '' : ''}. File: ${esc(d.file.split('/').pop())}</p>`,
          `<h3>📑 Slide của trường — ${esc(d.ten)} (${d.n} slide)</h3>\n<p class="ghi-chu">${TIN[tin][1]}. Tệp: ${esc(d.file.split('/').pop())}</p>`));
        parts.push(anhDeck(d));
        const lk = [...new Set((d.chu || []).flatMap((t) => String(t || '').match(URL_RE) || []).map((u) => u.replace(/[.,;:)\]]+$/, '')))].filter((u) => !RAC.test(u));
        if (lk.length) parts.push(bi(`<h3>🔗 Links on these slides — watch/read them</h3>`, `<h3>🔗 Link trong slide — xem/đọc thêm</h3>`) + `\n<ul>\n${lk.map((u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(cat(u, 120))}</a></li>`).join('\n')}\n</ul>`);
      }
      if (!ds.length && tv.length) parts.push(bi(`<p class="ghi-chu">📑 The slides for this session are in <strong>session ${esc(buoi[tv[0].dau].nhan)}</strong> (${tv.map((x) => esc(x.d.ten)).join(', ')}) — the deck covers several sessions.</p>`, `<p class="ghi-chu">📑 Slide của buổi này nằm ở <strong>buổi ${esc(buoi[tv[0].dau].nhan)}</strong> (${tv.map((x) => esc(x.d.ten)).join(', ')}) — một deck dùng cho nhiều buổi.</p>`));
      parts.push(bi('<div class="note-ct">📝 Detailed lecture and 🎬 video for this session: coming later. For now follow the slides, the materials and the tasks above.</div>', '<div class="note-ct">📝 Bài giảng chi tiết và 🎬 video cho buổi này: sẽ bổ sung sau. Trước mắt học theo slide, tài liệu và nhiệm vụ ở trên.</div>'));
      return {
        title: ti(`${dg ? '🧪' : (tong ? '📑' : '📘')} Session ${b.nhan} — ${tenBuoi(b)}`, `${dg ? '🧪' : (tong ? '📑' : '📘')} Buổi ${b.nhan} — ${tenBuoi(b)}`),
        slug: `${lo}-flm-b${String(b.so).padStart(3, '0')}${buoi.filter((x) => x.so === b.so).length > 1 ? '-' + bi_ : ''}`,
        type: 'DOCUMENT',
        isFreePreview: ci === 0,
        description: cat(`Buổi ${b.nhan} theo syllabus FLM${tong ? ` · ${tong} slide` : ''}.`, 200),
        content: parts.join('\n'),
      };
    });
    sections.push({
      title: ti(`FLM ${so} · ${tenEn}`, `FLM ${so} · ${tenVi}`),
      description: `Sessions ${dai} of the FLM plan.|||Buổi ${dai} theo kế hoạch FLM.`,
      lessons,
    });
  });

  /* 🧪 Kiểm tra & thi */
  const danhGia = rowsOf(syl.danhGia);
  const lichDG = buoi.filter((b) => RE_DANH_GIA.test(b.topic.split('\n')[0]));
  const thiLessons = danhGia.map((r, i) => {
    const ten = String(r.Category || `Mark ${i + 1}`).trim();
    const f = [['Type / Loại', r.Type], ['Weight / Trọng số', r.Weight], ['Parts / Số phần', r.Part], ['Completion criteria / Điều kiện hoàn thành', r['Completion Criteria']], ['Duration / Thời lượng', r.Duration], ['CLO', r.CLO], ['Question type / Dạng câu hỏi', r['Question Type']], ['No. of questions / Số câu', r['No Question']], ['Knowledge & skill / Kiến thức & kỹ năng', r['Knowledge and Skill']], ['Grading guide / Hướng dẫn chấm', r['Grading Guide']], ['Note / Ghi chú', r.Note]].filter(([, v]) => String(v || '').trim());
    const lienQuan = lichDG.filter((b) => { const w = ten.toLowerCase().split(/[^a-zà-ỹ0-9]+/i).filter((x) => x.length > 3); return w.some((x) => b.topic.toLowerCase().includes(x)); });
    return {
      title: ti(`🧪 ${ten} — ${String(r.Weight || '').trim()}`, `🧪 ${ten} — ${String(r.Weight || '').trim()}`),
      slug: `${lo}-flm-thi-${i + 1}`,
      type: 'DOCUMENT',
      description: cat(`${ten} ${r.Weight || ''}`, 200),
      content: [
        bi(`<span class="eyebrow">${esc(ma)} · Assessment ${i + 1}/${danhGia.length}</span>\n<h2>${esc(ten)}</h2>\n<p class="nhan">Source: FLM syllabus ${esc(syl.sylID)} · assessment table (verbatim)</p>`, `<span class="eyebrow">${esc(ma)} · Đầu điểm ${i + 1}/${danhGia.length}</span>\n<h2>${esc(ten)}</h2>\n<p class="nhan">Nguồn: syllabus FLM ${esc(syl.sylID)} · bảng đánh giá (nguyên văn)</p>`),
        `<div class="kv-grid">\n${f.map(([k, v]) => kv(esc(k), o(v))).join('\n')}\n</div>`,
        lienQuan.length ? bi(`<h3>Sessions in the plan that mention it</h3>\n<ul>${lienQuan.map((b) => `<li>Session ${esc(b.nhan)} — ${esc(tenBuoi(b))}</li>`).join('')}</ul>`, `<h3>Buổi trong kế hoạch có nhắc tới</h3>\n<ul>${lienQuan.map((b) => `<li>Buổi ${esc(b.nhan)} — ${esc(tenBuoi(b))}</li>`).join('')}</ul>`) : '',
        thi ? bi(`<div class="note-ct">🧪 Practice papers: <a href="${linkThi}">Exam Room — ${esc(ma)}</a> (${thi.de} papers${thi.loai.size ? ': ' + [...thi.loai].join(', ') : ''}).</div>`, `<div class="note-ct">🧪 Đề luyện: <a href="${linkThi}">Phòng thi — ${esc(ma)}</a> (${thi.de} đề${thi.loai.size ? ': ' + [...thi.loai].join(', ') : ''}).</div>`)
          : bi('<p class="ghi-chu">No practice paper for this subject in the Exam Room yet.</p>', '<p class="ghi-chu">Phòng thi chưa có đề luyện cho môn này.</p>'),
        bi('<div class="note-ct">📝 Exam-strategy notes and worked past papers: coming later.</div>', '<div class="note-ct">📝 Chiến lược làm bài và chữa đề: sẽ bổ sung sau.</div>'),
      ].filter(Boolean).join('\n'),
    };
  });
  if (lichDG.length) thiLessons.unshift({
    title: `🗓 Assessment & review sessions in the plan (${lichDG.length})|||🗓 Lịch kiểm tra & ôn tập trong kế hoạch (${lichDG.length})`,
    slug: `${lo}-flm-thi-lich`, type: 'DOCUMENT', description: 'Các buổi kiểm tra/ôn tập theo FLM.',
    content: bi(`<span class="eyebrow">${esc(ma)} · Assessments</span>\n<h2>When you are tested</h2>`, `<span class="eyebrow">${esc(ma)} · Kiểm tra & thi</span>\n<h2>Khi nào bị kiểm tra</h2>`) +
      `\n<table><thead><tr><th>Session<br><small>Buổi</small></th><th>Topic<br><small>Nội dung</small></th><th>LO</th></tr></thead><tbody>\n${lichDG.map((b) => `<tr><td><strong>${esc(b.nhan)}</strong></td><td>${o(b.topic)}</td><td>${o(b.lo)}</td></tr>`).join('\n')}\n</tbody></table>`,
  });
  if (thiLessons.length) sections.push({ title: `🧪 Assessments & exams (FLM)|||🧪 Kiểm tra & thi (FLM)`, description: 'Every mark, its weight and where to practise.|||Mọi đầu điểm, trọng số và nơi luyện đề.', lessons: thiLessons });

  /* 📚 Tài liệu & học thêm */
  const tl = rowsOf(syl.taiLieu);
  const links = gomLink(ma, syl, map);
  const tlLessons = [];
  if (tl.length) tlLessons.push({
    title: '📚 Textbooks & materials named by the university|||📚 Giáo trình & tài liệu trường quy định', slug: `${lo}-flm-tl-sach`, type: 'DOCUMENT', description: 'Sách, tài liệu theo syllabus.',
    content: bi(`<span class="eyebrow">${esc(ma)} · Materials</span>\n<h2>Books & materials</h2>\n<p class="lead">Buy or borrow the exact <strong>edition</strong> listed. Materials with no author/ISBN are internal FPT files (download them inside FLM).</p>`, `<span class="eyebrow">${esc(ma)} · Tài liệu</span>\n<h2>Sách & tài liệu</h2>\n<p class="lead">Mua/mượn đúng <strong>lần xuất bản</strong> ghi trong bảng. Tài liệu không có tác giả/ISBN là tệp nội bộ của FPT (tải trong FLM).</p>`) +
      '\n' + tl.map((r) => `<div class="callout"><p><strong>${o(r['Material Description'])}</strong>${truthy(r['Is Main Material']) ? ' — <em>main · chính</em>' : ''}</p><p>${[r.Author, r.Publisher, r['Published Date'], r.Edition].filter((x) => String(x || '').trim()).map(o).join(' · ')}${r.ISBN ? ` · ISBN <code>${esc(r.ISBN)}</code>` : ''}</p>${r.Note ? `<p>${o(r.Note)}</p>` : ''}</div>`).join('\n'),
  });
  if (links.length) tlLessons.push({
    title: `🔗 Every link mentioned in FLM, slides & materials (${links.length})|||🔗 Mọi link được nhắc trong FLM, slide & tài liệu (${links.length})`, slug: `${lo}-flm-tl-link`, type: 'DOCUMENT', description: 'Link học thêm gom từ syllabus, slide và tài liệu.',
    content: bi(`<span class="eyebrow">${esc(ma)} · Further study</span>\n<h2>Links for further study</h2>\n<p class="lead">Collected automatically from the syllabus, the slides and the material pack. Some may have moved since the university published them.</p>`, `<span class="eyebrow">${esc(ma)} · Học thêm</span>\n<h2>Link học thêm</h2>\n<p class="lead">Gom tự động từ syllabus, slide và gói tài liệu. Một số link có thể đã đổi chỗ kể từ khi trường công bố.</p>`) +
      `\n<ul>\n${links.map((x) => `<li><a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(cat(x.u, 120))}</a> <small>— ${esc(cat(x.nguon.slice(0, 3).join(', ') + (x.nguon.length > 3 ? '…' : ''), 160))}</small></li>`).join('\n')}\n</ul>`,
  });
  const files = (mucLuc?.file || []).filter((f) => !/(\btemp\b|\bcv\b|resume|danh s[aá]ch|b[aả]ng đi[eể]m|đ[aá]p [aá]n|answer key|solution|submission)/i.test(f.duongDan));
  if (files.length) {
    const nhom = files.reduce((m, f) => ((m[f.loai || '?'] = (m[f.loai || '?'] || 0) + 1), m), {});
    tlLessons.push({
      title: `🗂 What is in the FLM material pack (${files.length} files)|||🗂 Gói tài liệu FLM gồm những gì (${files.length} tệp)`, slug: `${lo}-flm-tl-goi`, type: 'DOCUMENT', description: 'Danh mục tệp trong gói tài liệu sinh viên trên FLM.',
      content: bi(`<span class="eyebrow">${esc(ma)} · Material pack</span>\n<h2>The student material pack</h2>\n<p class="lead">${Object.entries(nhom).map(([k, v]) => `${v} ${esc(k)}`).join(' · ')}. Slides are shown in the lessons above; the other files are downloaded inside FLM with your FPT account.</p>`, `<span class="eyebrow">${esc(ma)} · Gói tài liệu</span>\n<h2>Gói tài liệu sinh viên</h2>\n<p class="lead">${Object.entries(nhom).map(([k, v]) => `${v} ${esc(k)}`).join(' · ')}. Slide đã gắn vào các bài phía trên; các tệp khác tải trong FLM bằng tài khoản FPT.</p>`) +
        `\n<table><thead><tr><th>File<br><small>Tệp</small></th><th>Type<br><small>Loại</small></th><th>Size<br><small>Dung lượng</small></th></tr></thead><tbody>\n${files.slice(0, 400).map((f) => `<tr><td>${esc(f.duongDan.replace(/^\d+_[^/]+\//, ''))}</td><td>${esc(f.loai)}</td><td>${(f.bytes / 1e6).toFixed(1)} MB</td></tr>`).join('\n')}\n</tbody></table>`,
    });
  }
  if (tlLessons.length) sections.push({ title: '📚 Materials & further study (FLM)|||📚 Tài liệu & học thêm (FLM)', description: 'Books, links and the material pack.|||Sách, link và gói tài liệu.', lessons: tlLessons });

  // deck không ghép được (không có buổi) — không để rơi
  const roi = decks.filter((d, i) => !ghep[i]);
  if (roi.length) sections.push({ title: '📑 Other school slides (not tied to a session in the plan)|||📑 Slide khác của trường (ngoài kế hoạch buổi)', description: '', lessons: roi.map((d) => ({ title: ti(`📑 ${d.ten} (${d.n} slides)`, `📑 ${d.ten} (${d.n} slide)`), slug: `${lo}-flm-slide-${d.key}`, type: 'DOCUMENT', description: `${d.n} slide`, content: anhDeck(d) })) });

  const dem = ghep.reduce((m, g) => ((m[g?.tin || 'roi'] = (m[g?.tin || 'roi'] || 0) + 1), m), {});
  return { sections, bao: { ma, buoi: buoi.length, chuong: chuongs.length, cach, deck: decks.length, slide: decks.reduce((a, d) => a + d.n, 0), ghep: dem, link: links.length, thi: thi ? thi.de : 0, bai: sections.reduce((a, s) => a + s.lessons.length, 0) } };
}
function truthy(s) { return /^true$/i.test(String(s || '').trim()); }

async function main() {
  let ds;
  if (val('--ma')) ds = val('--ma').split(',');
  else if (has('--tatca')) {
    // mọi môn CÓ syllabus FLM (kể cả môn có Mục 0 làm tay mà chương 2+ mới là khung), trừ môn user xác nhận đã đầy đủ
    const { BO_QUA } = await import('./academy-muc0-flm.mjs');
    ds = fs.readdirSync(path.join(DIR, '_syllabus-flm')).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''))
      .filter((ma) => !BO_QUA.has(ma) && fs.existsSync(path.join(DIR, `${ma}.mjs`)) && JSON.parse(fs.readFileSync(path.join(DIR, '_syllabus-flm', `${ma}.json`), 'utf8')).sylID);
  }
  else { console.error('cần --ma <MÃ> hoặc --tatca'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const bao = [];
  for (const ma of ds.sort()) {
    const fSyl = path.join(DIR, '_syllabus-flm', `${ma}.json`);
    const fMon = path.join(DIR, `${ma}.mjs`);
    if (!fs.existsSync(fSyl) || !fs.existsSync(fMon)) { console.log(`  – ${ma}: thiếu syllabus/file môn`); continue; }
    const syl = JSON.parse(fs.readFileSync(fSyl, 'utf8'));
    // môn mượn khung (syl.thamKhao) ⇒ dùng slide + gói tài liệu của môn tham chiếu nếu bản thân không có
    const nguonKho = (f) => (fs.existsSync(path.join(KHO, ma, f)) ? path.join(KHO, ma, f) : (syl.thamKhao ? path.join(KHO, syl.thamKhao.ma, f) : path.join(KHO, ma, f)));
    const fMap = nguonKho('slide-map.json');
    const map = fs.existsSync(fMap) ? JSON.parse(fs.readFileSync(fMap, 'utf8')) : null;
    const fMuc = nguonKho('muc-luc.json');
    const mucLuc = fs.existsSync(fMuc) ? JSON.parse(fs.readFileSync(fMuc, 'utf8')) : null;
    const spec = (await import(path.resolve(fMon))).default;
    const { sections, bao: b } = dungKhoa(ma, syl, map, mucLuc);
    if (!sections.length) { console.log(`  – ${ma}: ${b.loi}`); continue; }
    const slugCu = new Set((spec.sections || spec.course.sections || []).flatMap((s) => (s.lessons || []).map((l) => l.slug)));
    const tatCa = sections.flatMap((s) => s.lessons);
    const trung = tatCa.filter((l) => slugCu.has(l.slug)).map((l) => l.slug);
    const trungNoi = tatCa.map((l) => l.slug).filter((s, i, a) => a.indexOf(s) !== i);
    const titleCu = new Set((spec.sections || spec.course.sections || []).map((s) => s.title));
    if (trung.length || trungNoi.length || sections.some((s) => titleCu.has(s.title))) { console.log(`  ⛔ ${ma}: trùng slug/tiêu đề ${[...trung, ...trungNoi].slice(0, 5).join(',')}`); process.exitCode = 1; continue; }
    fs.writeFileSync(path.join(OUT, `${ma}.mjs`), `// SINH TỰ ĐỘNG bởi scripts/academy-khoa-flm.mjs — ĐỪNG SỬA TAY (sửa dữ liệu/script rồi sinh lại).\n// Ghép vào môn lúc seed: scripts/lib/academy-muc0-flm.mjs\nexport default ${JSON.stringify(sections, null, 1)};\n`);
    bao.push(b);
    console.log(`  ✓ ${ma}: ${b.chuong} chương (${b.cach}) · ${b.bai} bài · ${b.deck} deck/${b.slide} slide ${JSON.stringify(b.ghep)} · ${b.link} link · ${b.thi} đề`);
  }
  if (val('--bao-cao')) fs.writeFileSync(val('--bao-cao'), ['ma\tbuoi\tchuong\tcach\tbai\tdeck\tslide\tbuoi_ghep\tchuong_ghep\tthutu\tuocluong\troi\tlink\tthi\tnoidung', ...bao.map((b) => [b.ma, b.buoi, b.chuong, b.cach, b.bai, b.deck, b.slide, b.ghep.buoi || 0, b.ghep.chuong || 0, b.ghep['thu-tu'] || 0, b.ghep['uoc-luong'] || 0, b.ghep.roi || 0, b.link, b.thi, b.ghep['noi-dung'] || 0].join('\t'))].join('\n'));
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
