/**
 * yt-tu-dong.mjs — tự tìm video YouTube TIẾNG ANH có phụ đề cho từng bài của một môn Academy, ghi vào
 * content/course-videos/<courseSlug>.mjs (luồng YT nhúng ngay trong bài, như CEA201/CSD201).
 *
 *   node scripts/yt-tu-dong.mjs --ma AIS201 [--dry] [--n 15] [--nghi 1500]
 *
 * Không dùng LLM (rẻ): mỗi bài 1 lượt tìm + vài lượt mở trang xem. Chọn video theo điểm:
 *   độ khớp từ khoá (tiêu đề bài ↔ tiêu đề video) · kênh uy tín (danh sách dưới) · thời lượng 4–60 phút ·
 *   lượt xem · KHÔNG Shorts, KHÔNG ngôn ngữ khác (Hindi/Urdu…), KHÔNG kênh vô danh ít view.
 * Bắt buộc trước khi nhận: trang xem trả playabilityStatus OK (không hội viên/tuổi) + playableInEmbed:true +
 * CÓ phụ đề tiếng Anh (thủ công hoặc tự động) ⇒ người xem bật được phụ đề EN và "Tự động dịch → Tiếng Việt".
 * Ưu tiên video có sẵn phụ đề tiếng Việt thật (điểm cộng).
 * Bỏ qua: quiz, Mục 0 (giới thiệu/giáo trình), bài thi/kiểm tra/tài liệu, bài đã có video. Không dùng lại ID trong môn.
 * Bài không tìm được video đạt chuẩn ⇒ BỎ TRỐNG (ghi vào báo cáo), không nhét video sai.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const MA = val('--ma'); const DRY = args.includes('--dry');
const UNG = args.includes('--ung'); // chỉ xuất ứng viên đã kiểm ra TSV cho agent duyệt (ngành IT), không ghi .mjs
const AP = val('--ap'); // áp lựa chọn đã duyệt: file TSV `slug<TAB>id|-`
// Môn ngôn ngữ (11/11/2026): tên bài là tiếng Việt/Trung/Nhật/Hàn + nhiều buổi trùng tên ⇒ agent viết sẵn câu tìm tiếng Anh
// cho từng bài (`slug<TAB>query`, '-' = bỏ) và --nn nới lọc: cho tiêu đề chữ Nhật/Trung/Hàn, âm thanh en|ja|zh|ko; VẪN bắt phụ đề EN.
const QF = val('--q'); const NN = args.includes('--nn');
const TRUY_VAN = QF ? Object.fromEntries(fs.readFileSync(QF, 'utf8').split('\n').map((x) => x.split('\t')).filter((x) => x.length >= 2 && x[0].trim()).map((x) => [x[0].trim(), x[1].trim()])) : null;
const KHONG_LATIN = NN ? /[^\x00-\x7F‘-‟–—|·•…\u3000-\u30ff\u3400-\u9fff\uac00-\ud7af\uff00-\uffef]/ : /[^\x00-\x7F‘-‟–—|·•…–—]/;
const AM_THANH_OK = (a) => !a || a.startsWith('en') || (NN && /^(ja|zh|ko)/.test(a));
const N = Number(val('--n', 15)); const NGHI = Number(val('--nghi', 1500));
if (!MA) { console.error('cần --ma <MÃ>'); process.exit(1); }
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', 'accept-language': 'en-US,en;q=0.9' };

// Kênh giảng dạy uy tín (cộng điểm mạnh). Không có trong danh sách vẫn được chọn nếu đủ điểm và đủ lượt xem.
const KENH_TOT = [
  'MIT OpenCourseWare', 'Stanford Online', 'Stanford', 'CS50', 'Harvard', 'Yale Courses', 'CrashCourse', 'Khan Academy', 'freeCodeCamp.org',
  'Computerphile', 'Numberphile', '3Blue1Brown', 'StatQuest with Josh Starmer', 'IBM Technology', 'Google Cloud Tech', 'Microsoft Developer',
  'AWS Events', 'Amazon Web Services', 'Neso Academy', 'Ben Eater', 'NetworkChuck', 'Fireship', 'Traversy Media', 'Web Dev Simplified',
  'The Coding Train', 'Corey Schafer', 'sentdex', 'Andrej Karpathy', 'DeepLearningAI', 'Two Minute Papers', 'Yannic Kilcher', 'Lex Fridman',
  'Professor Messer', 'PowerCert Animated Videos', 'Practical Networking', 'John Hammond', 'LiveOverflow', 'David Bombal', 'SANS Institute',
  'Jeff Geerling', 'Low Level Learning', 'Abdul Bari', 'mycodeschool', 'Gate Smashers', 'NPTEL-NOC IITM', 'nptelhrd', 'CMU Database Group',
  'Hussein Nasser', 'ByteByteGo', 'TechWorld with Nana', 'Kevin Stratvert', 'Leila Gharani', 'Excel Campus - Jon', 'Guy in a Cube',
  'The Economist', 'Harvard Business Review', 'Marginal Revolution University', 'Patrick Boyle', 'The Plain Bagel', 'Ben Felix', 'CFA Institute',
  'Corporate Finance Institute', 'Kenji Explains', 'Aswath Damodaran', 'TED', 'TED-Ed', 'TEDx Talks', 'Wharton School', 'Stanford Graduate School of Business',
  'MIT Sloan School of Management', 'Big Think', 'Simplilearn', 'edureka!', 'Great Learning', 'Brian Douglas', 'MATLAB', 'Steve Brunton',
  'Real Engineering', 'The Engineering Mindset', 'GreatScott!', 'EEVblog', 'Andreas Spiess', 'Articulated Robotics', 'The Construct',
  'Qiskit', 'Zach Star', 'Physics Videos by Eugene Khutoryansky', 'Nielsen Norman Group', 'Figma', 'Google Design', 'AJ&Smart', 'DesignCourse',
  'Event Manager Blog', 'Atlassian', 'Scrum.org', 'Project Management Institute', 'Ali Abdaal', 'Supply Chain Secrets', 'MIT CTL',
  // Ngôn ngữ — kênh dạy chuyên nghiệp (môn nn)
  'Japanese Ammo with Misa', 'JapanesePod101.com', 'Tokini Andy', 'Cure Dolly', 'Game Gengo', 'Nihongo no Mori', 'Japanese with Shun', 'NHK WORLD-JAPAN', 'Comprehensible Japanese', 'Learn Japanese with JapanesePod101.com',
  'Talk To Me In Korean', 'Go! Billy Korean', 'KoreanClass101.com', 'Learn Korean with KoreanClass101.com', 'Korean Unnie', 'Korean Class 101', 'Arirang TV',
  'Yoyo Chinese', 'Mandarin Blueprint', 'ChineseClass101.com', 'Learn Chinese with ChineseClass101.com', 'Mandarin Corner', 'Grace Mandarin Chinese', 'Everyday Chinese', 'Chinese Zero to Hero', 'ChinesePod', 'Learn Chinese with Litao', 'Mandarin Monkey',
  'BBC Learning English', 'English with Lucy', 'Oxford Online English', 'mmmEnglish', 'Rachel\'s English', 'engVid', 'Learn English with EnglishClass101.com', 'Speak English With Vanessa', 'British Council | LearnEnglish', 'Cambridge English', 'Linguisticator', 'The Ling Space', 'NativLang', 'Langfocus', 'Scribbr', 'Purdue OWL',
];
const LOAI_KENH = /hindi|urdu|bangla|tamil|telugu|marathi|tutorials? in hindi|\bgujarati\b|projects?\b|infotech|with ?ai\b|learn ?ai|ai tech|tech hub|clickbait|motivation/i;
const LOAI_TIEU_DE = /hindi|urdu|bangla|tamil|telugu|#shorts|in 60 seconds|in 1 minute|reaction|meme|asmr|compilation/i;
const DUNG = new Set('a an the and or of to in on for with by from at as is are be how what why your you this that its it into vs versus using use part lesson session chapter week introduction intro overview basics basic fundamentals principles concepts concept tutorial explained explain course lecture'.split(' '));

const tach = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s+#]/gu, ' ').split(/\s+/).filter((w) => w.length > 1 && !DUNG.has(w));
const giay = (d) => { const p = String(d).split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : 0; };
const luotXem = (s) => { const m = String(s).replace(/,/g, '').match(/([\d.]+)\s*([KMB]?)/i); if (!m) return 0; return Number(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase()] || 1); };

let rong = 0;
async function timKiem(q) {
  if (rong >= 5) { console.error('⏸ YouTube trả rỗng liên tục — nghỉ 10 phút'); await ngu(600000); rong = 0; }
  for (let lan = 0; lan < 3; lan++) {
    try {
      const html = await fetch('https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&hl=en&gl=US', { headers: UA }).then((r) => r.text());
      const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s); if (!m) throw new Error('no data');
      const out = []; const walk = (o) => { if (!o || typeof o !== 'object') return; if (o.videoRenderer) { const v = o.videoRenderer; out.push({ id: v.videoId, title: v.title?.runs?.map((r) => r.text).join('') || '', ch: v.ownerText?.runs?.[0]?.text || '', dur: v.lengthText?.simpleText || '', views: v.viewCountText?.simpleText || '' }); return; } for (const k of Object.keys(o)) walk(o[k]); };
      walk(JSON.parse(m[1])); rong = out.length ? 0 : rong + 1; return out.slice(0, N);
    } catch { await ngu(5000 * (lan + 1)); }
  }
  rong++; return [];
}
async function moTrang(id) {
  for (let lan = 0; lan < 3; lan++) {
    try {
      const h = await fetch('https://www.youtube.com/watch?v=' + id + '&hl=en', { headers: UA }).then((r) => r.text());
      const st = (h.match(/"playabilityStatus":\{"status":"([A-Z_]+)"/) || [])[1];
      if (!st) throw new Error('no status');
      const emb = (h.match(/"playableInEmbed":(true|false)/) || [])[1] === 'true';
      const tracks = [...h.matchAll(/"languageCode":"([a-zA-Z-]+)"(?:,"kind":"asr")?/g)].map((x) => x[1]);
      const capBlock = (h.match(/"captionTracks":\[(.*?)\]/) || [])[1] || '';
      const langs = [...capBlock.matchAll(/"languageCode":"([a-zA-Z-]+)"/g)].map((x) => x[1]);
      const goc = (h.match(/"title":"((?:[^"\\]|\\.)*)","lengthSeconds"/) || [])[1];
      const kenh = (h.match(/"ownerChannelName":"((?:[^"\\]|\\.)*)"/) || [])[1];
      const ngonNgu = (h.match(/"defaultAudioLanguage":"([a-zA-Z-]+)"/) || [])[1] || '';
      return { st, emb, en: langs.some((l) => l.startsWith('en')), vi: langs.some((l) => l.startsWith('vi')), title: goc ? JSON.parse('"' + goc + '"') : '', ch: kenh ? JSON.parse('"' + kenh + '"') : '', audio: ngonNgu, _t: tracks.length };
    } catch { await ngu(8000 * (lan + 1)); }
  }
  return null;
}

const { ganMuc0Flm } = await import(path.resolve('scripts/lib/academy-muc0-flm.mjs'));
const spec = await ganMuc0Flm((await import(path.resolve('content/academy', MA + '.mjs'))).default, `content/academy/${MA}.mjs`);
const c = spec.course || spec; const secs = spec.sections || c.sections || [];
const tenMon = String(c.title || '').split('|||')[0].replace(/\(.*?\)/g, '').trim();
// Spec cũ (PRF192…) không khai course.slug ⇒ tìm bản đồ video sẵn có chứa bài của môn này để lấy đúng slug CSDL;
// không có thì theo luật của seeder (slugify title). Đừng bao giờ ghi ra 'undefined.mjs'.
if (!c.slug) {
  const baiMon = new Set(secs.flatMap((s) => (s.lessons || []).map((l) => l.slug)));
  for (const f of fs.readdirSync('content/course-videos').filter((x) => x.endsWith('.mjs') && x !== 'undefined.mjs')) {
    const m = (await import(path.resolve('content/course-videos', f))).default;
    if (Object.keys(m.lessons || {}).some((k) => baiMon.has(k))) { c.slug = m.courseSlug; break; }
  }
  if (!c.slug) c.slug = String(c.title || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  console.log(`(spec không khai slug ⇒ dùng '${c.slug}')`);
}
const fVid = path.join('content/course-videos', c.slug + '.mjs');
const cu = fs.existsSync(fVid) ? (await import(path.resolve(fVid))).default : { courseSlug: c.slug, defaultVideoTrack: 'YT', lessons: {} };
const daDung = new Set(Object.values(cu.lessons || {}).map((x) => x.yt));
const BO_MUC = /^(📚|🧪|📑)|Mục 0|Section 0|tài liệu|course materials|giới thiệu môn|kiểm tra|exam|slide khác/i;
const BO_BAI = /quiz|kiểm tra|exam|final|progress test|\bPT\d|assignment|đề thi|syllabus|grading|cách tính điểm|chuẩn đầu ra|learning outcomes|giáo trình|materials|textbook|tài liệu/i;

const baoCao = { ma: MA, slug: c.slug, them: 0, trong: [], loai: [] };
const moi = {};
const ungVien = [];
let bai = 0;
if (AP) {
  // Áp lựa chọn đã duyệt: chỉ nhận ID nằm trong file ứng viên của chính bài đó (không nhận ID tự nghĩ ra).
  const ung = JSON.parse(fs.readFileSync(`content/course-videos/_ung/${MA}.json`, 'utf8'));
  const theoSlug = Object.fromEntries(ung.map((x) => [x.slug, x]));
  let them = 0; const loi = [];
  for (const dong of fs.readFileSync(AP, 'utf8').split('\n').map((x) => x.trim()).filter(Boolean)) {
    const [slug, id] = dong.split('\t'); if (!id || id === '-') continue;
    const u = theoSlug[slug]; const v = u?.ds.find((x) => x.id === id);
    if (!v) { loi.push(`${slug} ${id}: không nằm trong ứng viên`); continue; }
    if (daDung.has(id)) { loi.push(`${slug} ${id}: đã dùng cho bài khác`); continue; }
    if (cu.lessons?.[slug]) continue;
    moi[slug] = { yt: id, credit: `${v.ch} — ${v.title}` }; daDung.add(id); them++;
  }
  if (loi.length) { console.error('✗ ' + loi.join('\n✗ ')); process.exit(1); }
  baoCao.them = them; bai = them;
}

for (const s of (AP ? [] : secs)) {
  const tMuc = String(s.title || '');
  if (BO_MUC.test(tMuc)) continue;
  const tChuong = tMuc.split('|||')[0].replace(/^(Chapter|Chương|Session|Buổi)\s*[\d.]+\s*[—:-]\s*/i, '');
  for (const l of s.lessons || []) {
    if (l.type === 'QUIZ' || cu.lessons?.[l.slug] || moi[l.slug]) continue;
    const tBai = String(l.title || '').split('|||')[0];
    if (BO_BAI.test(tBai)) continue;
    // Bỏ biểu tượng đầu dòng (📘/📑…), tiền tố 'Session 32 —', 'Chapter 1.' — không thì YouTube tìm ra 'guitar session 32'.
    const chuDe = tBai.replace(/^[^\p{L}\p{N}]+/u, '').replace(/^(Lesson|Bài|Session|Buổi|Slot)\s*[\d.]+\s*[—:-]\s*/i, '').replace(/^(Chapter|Chương)\s*\d+[.:]?\s*/i, '').replace(/\s*[—–-]\s*(slides?|reading).*$/i, '').trim();
    if (!chuDe) continue;
    if (TRUY_VAN && (!TRUY_VAN[l.slug] || TRUY_VAN[l.slug] === '-')) continue;
    bai++;
    const q = TRUY_VAN ? TRUY_VAN[l.slug].slice(0, 120) : `${chuDe} ${tenMon}`.slice(0, 120);
    const ds = await timKiem(q); await ngu(NGHI);
    const kw = TRUY_VAN ? new Set(tach(q)) : new Set([...tach(chuDe), ...tach(tChuong)]);
    const kwBai = TRUY_VAN ? tach(q) : tach(chuDe);
    const ung = ds.map((v) => {
      const tv = new Set(tach(v.title)); const trung = kwBai.filter((w) => tv.has(w)).length; const trungC = [...kw].filter((w) => tv.has(w)).length;
      const sec = giay(v.dur); const xem = luotXem(v.views); const tot = KENH_TOT.some((k) => v.ch.toLowerCase() === k.toLowerCase());
      let d = trung * 3 + trungC + (tot ? 6 : 0) + Math.min(4, Math.log10(xem + 1) - 2);
      if (sec < 180 || sec > 3 * 3600) d -= 10; else if (sec > 60 * 60) d -= 2;
      if (LOAI_KENH.test(v.ch) || LOAI_TIEU_DE.test(v.title)) d -= 20;
      if (KHONG_LATIN.test(v.title.replace(/[À-ɏ]/g, ''))) d -= 8; // tiêu đề chữ không Latin ⇒ ngôn ngữ khác
      // Kênh ngoài danh sách uy tín phải tự chứng minh: đủ lượt xem + khớp chủ đề rõ ràng (chặn kênh vô danh/AI sinh).
      const canTrung = kwBai.length >= 3 ? 2 : 1;
      if (!tot && xem < 20000) d -= 6;
      if (!tot && trung < canTrung) d -= 8;
      if (kwBai.length && trung === 0) d -= 6;
      return { ...v, d, tot };
    }).filter((v) => v.id && !daDung.has(v.id)).sort((a, b) => b.d - a.d);
    let chon = null; const daKiem = [];
    for (const v of ung.slice(0, UNG ? 5 : 4)) {
      if (v.d < 3) break;
      const t = await moTrang(v.id); await ngu(NGHI);
      if (!t) { baoCao.loai.push(`${l.slug} ${v.id} không đọc được trang`); continue; }
      if (t.st !== 'OK' || !t.emb) { baoCao.loai.push(`${l.slug} ${v.id} ${t.st} embed=${t.emb}`); continue; }
      if (!t.en) { baoCao.loai.push(`${l.slug} ${v.id} không có phụ đề EN`); continue; }
      if (!AM_THANH_OK(t.audio)) { baoCao.loai.push(`${l.slug} ${v.id} âm thanh ${t.audio}`); continue; }
      if (KHONG_LATIN.test((t.title || '').replace(/[À-ɏ]/g, ''))) { baoCao.loai.push(`${l.slug} ${v.id} tiêu đề gốc không phải tiếng Anh`); continue; }
      chon = chon || { yt: v.id, credit: `${t.ch || v.ch} — ${t.title || v.title}` };
      daKiem.push({ id: v.id, ch: t.ch || v.ch, title: t.title || v.title, dur: v.dur, views: v.views, vi: t.vi });
      if (!UNG) break;
      if (daKiem.length >= 4) break;
    }
    if (UNG) { ungVien.push({ slug: l.slug, chuong: tChuong, bai: TRUY_VAN ? `${chuDe} ⟶ tìm: ${q}` : chuDe, ds: daKiem }); console.log(`… ${l.slug}: ${daKiem.length} ứng viên`); continue; }
    if (chon) { moi[l.slug] = { yt: chon.yt, credit: chon.credit }; daDung.add(chon.yt); baoCao.them++; console.log(`✓ ${l.slug} → ${chon.yt} · ${chon.credit.slice(0, 90)}`); }
    else { baoCao.trong.push(`${l.slug} — ${chuDe}`); console.log(`· ${l.slug} — chưa có video đạt chuẩn`); }
  }
}
if (UNG) {
  fs.mkdirSync('content/course-videos/_ung', { recursive: true });
  fs.writeFileSync(`content/course-videos/_ung/${MA}.json`, JSON.stringify(ungVien));
  const tsv = ungVien.map((u) => [`## ${u.slug} | ${u.chuong} | ${u.bai}`, ...u.ds.map((v) => `   ${v.id} | ${v.ch} | ${v.title} | ${v.dur} | ${v.views}${v.vi ? ' | VI-sub' : ''}`)].join('\n')).join('\n');
  fs.writeFileSync(`content/course-videos/_ung/${MA}.txt`, tsv + '\n');
  console.log(`\n${MA}: ${ungVien.length} bài có ứng viên ⇒ content/course-videos/_ung/${MA}.txt`); process.exit(0);
}
const gop = { courseSlug: c.slug, defaultVideoTrack: cu.defaultVideoTrack || 'YT', lessons: { ...(cu.lessons || {}), ...moi } };
if (!DRY && baoCao.them) {
  // 11/11/2026: GIỮ MỌI TRƯỜNG của bài (vi, defaultVideoTrack…). Bản cũ chỉ ghi yt + credit ⇒ xoá câm link video bài giảng
  // của OSG202 (70), SDN302 (20), PRJ301 (15), CSI (1) và prod mất video. `vi` ghi dạng `vi: { url: '…' }` vì
  // video-bai-giang/xuat/gan-web.mts + gan-chung đọc đúng dạng nháy đơn đó.
  const truong = (k, x) => (k === 'vi' && x && typeof x.url === 'string' && Object.keys(x).length === 1 ? `vi: { url: '${x.url}' }` : `${k}: ${JSON.stringify(x)}`);
  const dong = Object.entries(gop.lessons).map(([k, v]) => {
    const { yt, credit, ...khac } = v;
    const ds = [yt !== undefined && truong('yt', yt), credit !== undefined && truong('credit', credit), ...Object.entries(khac).filter(([, x]) => x !== undefined).map(([kk, x]) => truong(kk, x))].filter(Boolean);
    return `    ${JSON.stringify(k)}: { ${ds.join(', ')} },`;
  }).join('\n');
  const viTruoc = Object.values(cu.lessons || {}).filter((x) => x?.vi?.url).length, viSau = Object.values(gop.lessons).filter((x) => x?.vi?.url).length;
  if (viSau < viTruoc) { console.error(`✗ dừng: số bài có video bài giảng (vi) giảm ${viTruoc} → ${viSau} — không ghi ${fVid}`); process.exit(1); }
  fs.writeFileSync(fVid, `/**\n * YouTube track cho ${MA} — ${tenMon}. Mục tự động: scripts/yt-tu-dong.mjs (phát được khi nhúng, có phụ đề EN ⇒ tự dịch VI).\n *   node scripts/verify-youtube-videos.mjs --file ./${fVid}\n */\nexport default {\n  courseSlug: ${JSON.stringify(c.slug)},\n  defaultVideoTrack: ${JSON.stringify(gop.defaultVideoTrack)},\n${cu.goYt && Object.keys(cu.goYt).length ? `  goYt: ${JSON.stringify(cu.goYt)},\n` : ''}  lessons: {\n${dong}\n  },\n};\n`);
}
fs.mkdirSync('content/course-videos/_bao-cao', { recursive: true });
fs.writeFileSync(`content/course-videos/_bao-cao/${MA}.json`, JSON.stringify(baoCao, null, 1));
console.log(`\n${MA}: ${bai} bài xét · thêm ${baoCao.them} · trống ${baoCao.trong.length} · loại ${baoCao.loai.length}${DRY ? ' (dry)' : ''}`);
