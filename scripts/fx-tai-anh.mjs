/**
 * fx-tai-anh.mjs — lấy ĐỀ THI đã chọn trên fuexam.me: chữ mọi bài viết (đáp án tham khảo nếu có) + ẢNH/TỆP
 * đính kèm. Playwright, hồ sơ riêng, 1 luồng, chậm.
 *
 *   node scripts/fx-tai-anh.mjs --dang-nhap                       # lần đầu: USER tự đăng nhập rồi thoát Chromium
 *   node scripts/fx-tai-anh.mjs [--ds <ds-chu-de.json>] [--ra <thư mục>] [--moi-loai 4] [--chi-chu]
 *
 * --ds : danh sách MỌI chủ đề [{ma, title, href, date}] (thu ở bước A trong built-in browser, 09/11/2026:
 *        ~/Documents/FLM-nguon/_fx/ds-chu-de.json — 1.217 chủ đề / 266 môn).
 * Chọn: mỗi (môn, loại đề) lấy --moi-loai đề MỚI NHẤT (kỳ SP/SU/FA + năm, rồi ngày đăng).
 * Đề đã tải đợt 30/10 (~/Downloads/De-thi-fuexam/<môn>/<đề>/_noi-dung.txt có link) ⇒ chỉ lấy CHỮ, không tải lại ảnh.
 *
 * Vì sao Playwright: /attachments/... CHUYỂN HƯỚNG sang S3 ký sẵn (s3.cloudfly.vn) không CORS ⇒ script trong
 * trang không đọc được byte ảnh. context.request mang cookie hồ sơ + đi theo chuyển hướng.
 * Lịch sự (nội quy fuexam cấm tool tự động gây tải): nghỉ 0,8 s/tệp, 1,2 s/đề, 403/429 ⇒ DỪNG HẲN.
 * Chạy lại: bỏ qua tệp đã có, đề đã có _de.json đủ tệp.
 * Ra: <ra>/<MÃ>/<slug>-<id>/NNN_<tên> + _de.json {ma, title, loai, ky, date, href, tep[], baiViet[], linkNgoai[]}
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const home = (p) => p.replace(/^~/, os.homedir());
const DS = home(val('--ds', '~/Documents/FLM-nguon/_fx/ds-chu-de.json'));
const RA = home(val('--ra', '~/Downloads/De-thi-fuexam-0911'));
const HO_SO = home(val('--ho-so', '~/Documents/FLM-nguon/_fx/ho-so'));
const MOI_LOAI = +val('--moi-loai', 4);
const CHI_CHU = args.includes('--chi-chu');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export function loaiDe(t) {
  const s = ' ' + t.toUpperCase().replace(/[-_]/g, ' ') + ' ';
  if (/PRACTICE EXAM/.test(s)) return 'PE';
  if (/\bC\d+FE\b/.test(s)) return 'FE';
  if (/\bPE\d\b/.test(s)) return 'PE';
  if (/\s(RE|B5\s+RE)\s+W\s*$/.test(s)) return 'WRITING';
  if (/\s(RE|B5\s+RE)\s+R\s*$/.test(s)) return 'READING';
  if (/\s(RE|B5\s+RE)\s+L\s*$/.test(s)) return 'LISTENING';
  if (/\sRE\s*$/.test(s)) return 'FE';
  const m = s.match(/\b(PE|FE|PT\s?\d?|ASS(?:IGNMENT)?\s?\d?|LAB\s?\d*|QUIZ\s?\d*|TE|MID(?:TERM)?|SPEAKING|WRITING|LISTENING|READING|VOCAB|KANJI|GRAMMAR|PROJECT|PRESENTATION|FINAL)\b/);
  if (!m) return 'KHAC';
  let x = m[1].replace(/\s+/g, '');
  if (/^PT\d?$/.test(x)) x = 'PT'; if (/^ASS/.test(x)) x = 'ASS'; if (/^LAB/.test(x)) x = 'LAB'; if (/^QUIZ/.test(x)) x = 'QUIZ'; if (x === 'MIDTERM') x = 'MID';
  return x;
}
export function kyDe(t) { const m = t.toUpperCase().match(/\b(SP|SU|FA)\s?(\d{2})\b/); return m ? { ma: `${m[1]}${m[2]}`, so: (+m[2]) * 10 + ({ SP: 1, SU: 2, FA: 3 })[m[1]] } : { ma: '', so: 0 }; }
export function chonDe(ds, moiLoai = 4) {
  const nhom = new Map();
  for (const t of ds) {
    const id = (t.href.match(/\.(\d+)\/?$/) || [])[1];
    if (!id) continue;
    const loai = loaiDe(t.title), ky = kyDe(t.title), k = `${t.ma}|${loai}`;
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push({ ...t, id, loai, ky: ky.ma, kySo: ky.so });
  }
  const chon = [];
  for (const [, g] of nhom) { g.sort((a, b) => b.kySo - a.kySo || String(b.date).localeCompare(String(a.date))); chon.push(...g.slice(0, moiLoai)); }
  return chon;
}
function daCoTu3010() {
  const goc = path.join(os.homedir(), 'Downloads', 'De-thi-fuexam');
  const s = new Set();
  if (!fs.existsSync(goc)) return s;
  for (const mon of fs.readdirSync(goc)) {
    const d = path.join(goc, mon);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const de of fs.readdirSync(d)) {
      const f = path.join(d, de, '_noi-dung.txt');
      if (fs.existsSync(f) && fs.existsSync(path.join(d, de, '_xong'))) { const m = fs.readFileSync(f, 'utf8').match(/fuexam\.me\/threads\/[^/\s]+\.(\d+)/); if (m) s.add(m[1]); }
    }
  }
  return s;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ctx = await chromium.launchPersistentContext(HO_SO, { headless: !args.includes('--dang-nhap'), viewport: { width: 1200, height: 900 } });
  if (args.includes('--dang-nhap')) {
    const p = ctx.pages()[0] || await ctx.newPage();
    await p.goto('https://fuexam.me/login/');
    console.log('→ Đăng nhập fuexam trong cửa sổ vừa mở, xong thì THOÁT Chromium (Cmd+Q).');
    await new Promise((r) => ctx.on('close', r));
    process.exit(0);
  }
  const thu = await ctx.request.get('https://fuexam.me/account/');
  if (!/data-logged-in="true"/.test(await thu.text())) { console.error('⛔ Hồ sơ chưa đăng nhập — chạy lại với --dang-nhap'); await ctx.close(); process.exit(2); }

  const chon = chonDe(JSON.parse(fs.readFileSync(DS, 'utf8')), MOI_LOAI);
  const daCo = daCoTu3010();
  fs.mkdirSync(RA, { recursive: true });
  fs.writeFileSync(path.join(RA, '_chon.json'), JSON.stringify(chon.map((t) => ({ ...t, daCo3010: daCo.has(t.id) })), null, 1));
  console.log(`Chọn ${chon.length} đề (${new Set(chon.map((t) => t.ma)).size} môn); ${chon.filter((t) => daCo.has(t.id)).length} đề đã có ảnh từ 30/10 ⇒ chỉ lấy chữ`);
  const page = await ctx.newPage();
  let n = 0, tepMoi = 0, loi = 0;
  for (const t of chon) {
    n++;
    const thuMuc = path.join(RA, t.ma, `${slug(t.title)}-${t.id}`);
    const fDe = path.join(thuMuc, '_de.json');
    if (fs.existsSync(fDe)) { const o = JSON.parse(fs.readFileSync(fDe, 'utf8')); if (o.xong) continue; }
    fs.mkdirSync(thuMuc, { recursive: true });
    let info;
    try {
      const r = await page.goto(new URL(t.href, 'https://fuexam.me').href, { waitUntil: 'domcontentloaded', timeout: 90000 });
      if (r && (r.status() === 403 || r.status() === 429)) { console.error(`⛔ ${r.status()} ở ${t.href} — DỪNG HẲN`); break; }
      info = await page.evaluate(() => {
        const txt = (el) => (el ? el.innerText.replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n').trim() : '');
        const baiViet = [...document.querySelectorAll('.message--post')].map((p) => ({ tacGia: p.getAttribute('data-author') || '', ngay: p.querySelector('time')?.getAttribute('datetime') || '', chu: txt(p.querySelector('.message-body .bbWrapper') || p.querySelector('.message-body')) }));
        const tep = [...new Set([...document.querySelectorAll('a[href*="/attachments/"], img[src*="/attachments/"]')].map((x) => (x.getAttribute('href') || x.getAttribute('src')).replace(/\?.*$/, '')).filter((h) => /\/attachments\/[^/]+\.\d+\/?$/.test(h)))];
        const linkNgoai = [...new Set([...document.querySelectorAll('.message-body a[href^="http"]')].map((a) => a.href).filter((h) => !/fuexam\.me/.test(h)))];
        return { baiViet, tep, linkNgoai };
      });
    } catch (e) { loi++; console.log(`  ✗ ${t.ma} ${t.title}: ${e.message.slice(0, 80)}`); await sleep(3000); continue; }
    const daTai = [];
    if (!CHI_CHU && !daCo.has(t.id)) {
      for (const [i, u] of info.tep.entries()) {
        const ten = (u.match(/\/attachments\/([^/]+)\.\d+\/?$/) || [, `tep-${i + 1}`])[1].replace(/-(webp|png|jpe?g|gif|pdf|docx?|xlsx?|pptx?|zip|rar|txt|sql|java|cs)$/i, '.$1');
        const fn = `${String(i + 1).padStart(3, '0')}_${slug(ten)}`;
        const dich = path.join(thuMuc, fn);
        if (fs.existsSync(dich) && fs.statSync(dich).size > 0) { daTai.push(fn); continue; }
        let r;
        try { r = await ctx.request.get(new URL(u, 'https://fuexam.me').href, { timeout: 120000 }); } catch (e) { loi++; continue; }
        if (r.status() === 403 || r.status() === 429) { console.error(`⛔ ${r.status()} ở ${u} — DỪNG HẲN`); await ctx.close(); process.exit(3); }
        if (!r.ok()) { loi++; console.log(`  ✗ ${t.ma} ${fn}: HTTP ${r.status()}`); continue; }
        fs.writeFileSync(dich, await r.body());
        daTai.push(fn); tepMoi++;
        await sleep(800);
      }
    }
    const xong = CHI_CHU || daCo.has(t.id) || daTai.length === info.tep.length;
    fs.writeFileSync(fDe, JSON.stringify({ ...t, daCo3010: daCo.has(t.id), tep: daTai, tepNguon: info.tep, baiViet: info.baiViet, linkNgoai: info.linkNgoai, xong }, null, 1));
    console.log(`[${n}/${chon.length}] ${t.ma} · ${t.title}: ${daCo.has(t.id) ? 'chữ (ảnh có từ 30/10)' : `${daTai.length}/${info.tep.length} tệp`} · ${info.baiViet.length} bài viết`);
    await sleep(1200);
  }
  console.log(`XONG: ${tepMoi} tệp mới · ${loi} lỗi`);
  await ctx.close();
}
