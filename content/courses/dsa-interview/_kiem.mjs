#!/usr/bin/env node
/**
 * _kiem.mjs — bộ kiểm riêng của khoá dsa-interview (15/11/2026). Chạy SAU _chay.mjs và TRƯỚC khi commit.
 *
 *   node content/courses/dsa-interview/_kiem.mjs          # cấu trúc + link nội bộ + quiz (không cần mạng)
 *   node content/courses/dsa-interview/_kiem.mjs --mang   # thêm: hỏi LeetCode GraphQL từng đề + GET mọi link ngoài
 *
 * Kiểm:
 *  1. Mọi slug bài + tiêu đề CHƯƠNG của khung gốc (_slug-goc.json) còn nguyên; bài đầu mỗi chương giữ nguyên
 *     (course-seed.mjs neo chương bằng slug bài ĐẦU, rồi mới tới tiêu đề) · slug không trùng · title ≤ 180 ký tự.
 *  2. Link nội bộ: /courses/dsa-interview/learn?lessonSlug=X phải có X; /academy/courses/data-structures-and-algorithms/…
 *     phải là slug CSD201 thật; /courses/<khoá khác>/learn?lessonSlug=Y phải có trong content/courses/<khoá>.mjs.
 *  3. Quiz: 10 câu (bài thi cuối khoá ≥ 20), mỗi câu có explanation song ngữ, đáp án rải đều (không vị trí nào > 40 %).
 *  4. (--mang) "LC <số> · <tên>" + slug + độ khó + Premium khớp LeetCode thật · mọi https:// khác GET ⇒ 200.
 * Bộ đệm mạng: $TMPDIR/dsa-nhap/kiem-cache.json (xoá để kiểm lại từ đầu).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');   // LeetCode qua IPv6 hay treo (agent Ch3 gặp 15/11)

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, '../../..');
const MANG = process.argv.includes('--mang');
const khoa = (await import(pathToFileURL(path.join(DIR, '../dsa-interview.mjs')))).default;
const goc = JSON.parse(fs.readFileSync(path.join(DIR, '_slug-goc.json'), 'utf8'));
let loi = 0;
const bao = (s) => { loi++; console.log('❌ ' + s); };

/* 1. Cấu trúc ------------------------------------------------------------------------------------------- */
const bai = khoa.sections.flatMap((s) => s.lessons.map((l) => ({ ...l, chuong: s.title })));
const slugs = new Set();
for (const l of bai) {
  if (slugs.has(l.slug)) bao(`slug trùng: ${l.slug}`);
  slugs.add(l.slug);
  if (l.title.length > 180) bao(`${l.slug}: title ${l.title.length} > 180 ký tự`);
  if (!/^dsa-\d+-\d+-[a-z0-9-]+$/.test(l.slug)) bao(`${l.slug}: slug sai khuôn dsa-N-M-ten`);
}
for (const g of goc) {
  const s = khoa.sections.find((x) => x.title === g.title);
  if (!s) { bao(`mất chương (tiêu đề đã đổi?): ${g.title}`); continue; }
  if (s.lessons[0]?.slug !== g.lessons[0]) bao(`${g.title}: bài đầu phải là ${g.lessons[0]} (đang là ${s.lessons[0]?.slug})`);
  for (const sl of g.lessons) if (!s.lessons.some((l) => l.slug === sl)) bao(`${g.title}: mất bài ${sl}`);
}

/* 2. Link nội bộ ------------------------------------------------------------------------------------------ */
const csdSlugs = new Set();
{
  const m = (await import(pathToFileURL(path.join(REPO, 'content/academy/CSD201.mjs')))).default;
  for (const s of m.sections) for (const l of s.lessons) csdSlugs.add(l.slug);
}
const khoaKhac = new Map();
async function slugCuaKhoa(k) {
  if (khoaKhac.has(k)) return khoaKhac.get(k);
  const f = path.join(REPO, 'content/courses', `${k}.mjs`);
  let set = null;
  if (fs.existsSync(f)) {
    const m = (await import(pathToFileURL(f))).default;
    set = new Set(m.sections.flatMap((s) => s.lessons.map((l) => l.slug)));
  }
  khoaKhac.set(k, set);
  return set;
}
const ngoai = new Map();     // url → slug bài đầu tiên chứa nó
const deLc = new Map();      // slug LC → { id, ten, doKho, premium, o }
for (const l of bai) {
  const c = l.content ?? '';
  for (const m of c.matchAll(/href="\/courses\/([a-z0-9-]+)\/learn\?lessonSlug=([a-z0-9-]+)"/g)) {
    if (m[1] === 'dsa-interview') { if (!slugs.has(m[2])) bao(`${l.slug}: link tới bài không có ${m[2]}`); continue; }
    const set = await slugCuaKhoa(m[1]);
    if (!set) bao(`${l.slug}: khoá ${m[1]} không có tệp content/courses/${m[1]}.mjs`);
    else if (!set.has(m[2])) bao(`${l.slug}: khoá ${m[1]} không có bài ${m[2]}`);
  }
  for (const m of c.matchAll(/href="\/academy\/courses\/data-structures-and-algorithms\/learn\?lessonSlug=([a-z0-9-]+)"/g)) {
    if (!csdSlugs.has(m[1])) bao(`${l.slug}: CSD201 không có bài ${m[1]}`);
  }
  for (const m of c.matchAll(/href="\/(?!courses\/|academy\/courses\/data-structures-and-algorithms\/|algorithms\?)([^"]*)"/g)) {
    if (!/^(algorithms|code-lab\/|exam|so-tay|roadmap)/.test(m[1])) console.log(`⚠️  ${l.slug}: link nội bộ chưa kiểm được: /${m[1].slice(0, 80)}`);
  }
  for (const m of c.matchAll(/<a class="lc" href="https:\/\/leetcode\.com\/problems\/([a-z0-9-]+)\/"[^>]*>LC (\d+) · ([^<]+)<\/a> <small>\((Easy|Medium|Hard)( · 🔒 Premium)?\)<\/small>/g)) {
    const ten = m[3].replace(/&amp;/g, '&');
    const cu = deLc.get(m[1]);
    const moi = { id: m[2], ten, doKho: m[4], premium: !!m[5], o: l.slug };
    if (cu && (cu.id !== moi.id || cu.ten !== moi.ten)) bao(`LC ${m[1]} ghi hai kiểu khác nhau (${cu.o} vs ${l.slug})`);
    deLc.set(m[1], moi);
  }
  for (const m of c.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    const u = m[1].replace(/&amp;/g, '&');
    if (/^https:\/\/leetcode\.com\/problems\//.test(u)) continue;
    if (!ngoai.has(u)) ngoai.set(u, l.slug);
  }
  if (/href="https:\/\/leetcode\.com\/problems\//.test(c.replace(/<a class="lc" href="https:\/\/leetcode\.com\/problems\/[^"]+"/g, ''))) {
    bao(`${l.slug}: có link LeetCode viết tay — dùng lc() để bộ kiểm soát được`);
  }
}

/* 3. Quiz ------------------------------------------------------------------------------------------------- */
for (const l of bai.filter((x) => x.quiz)) {
  const q = l.quiz.questions;
  const cuoi = /kiem-tra-cuoi/.test(l.slug);
  if (cuoi ? q.length < 20 : q.length !== 10) bao(`${l.slug}: ${q.length} câu (cần ${cuoi ? '≥ 20' : '10'})`);
  const dem = [0, 0, 0, 0];
  q.forEach((c, i) => {
    dem[c.correctIndex]++;
    if (c.options.length !== 4) bao(`${l.slug} câu ${i + 1}: ${c.options.length} phương án`);
    if (!c.explanation || !c.explanation.includes('|||')) bao(`${l.slug} câu ${i + 1}: thiếu explanation song ngữ`);
    const dai = c.options.map((o) => o.length);
    if (dai[c.correctIndex] === Math.max(...dai) && dai[c.correctIndex] > 1.6 * [...dai].sort((a, b) => b - a)[1]) {
      console.log(`⚠️  ${l.slug} câu ${i + 1}: đáp án đúng dài hơn hẳn các phương án khác`);
    }
  });
  if (Math.max(...dem) > Math.ceil(q.length * 0.4)) bao(`${l.slug}: đáp án dồn một vị trí ${JSON.stringify(dem)}`);
}

/* 4. Mạng ------------------------------------------------------------------------------------------------- */
if (MANG) {
  const cf = path.join(process.env.TMPDIR || os.tmpdir(), 'dsa-nhap', 'kiem-cache.json');
  fs.mkdirSync(path.dirname(cf), { recursive: true });
  const cache = fs.existsSync(cf) ? JSON.parse(fs.readFileSync(cf, 'utf8')) : { lc: {}, url: {} };
  for (const [slug, d] of deLc) {
    let q = cache.lc[slug];
    if (!q) {
      let mangLoi = null;
      for (let lan = 0; lan < 3 && !q; lan++) {
        try {
          const r = await fetch('https://leetcode.com/graphql', {
            method: 'POST', headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
            body: JSON.stringify({ query: 'query q($s:String!){question(titleSlug:$s){questionFrontendId title difficulty isPaidOnly}}', variables: { s: slug } }),
            signal: AbortSignal.timeout(20000),
          });
          q = (await r.json())?.data?.question ?? null;
          if (!q) break;
        } catch (e) { mangLoi = e; await new Promise((ok) => setTimeout(ok, 1500)); }
      }
      if (!q && mangLoi) { bao(`${d.o}: không hỏi được LeetCode cho "${slug}" (${mangLoi.message}) — chạy lại`); continue; }
      if (q) cache.lc[slug] = q;
      await new Promise((ok) => setTimeout(ok, 250));
    }
    if (!q) { bao(`${d.o}: LeetCode không có đề slug "${slug}"`); continue; }
    if (q.questionFrontendId !== d.id) bao(`${d.o}: ${slug} là LC ${q.questionFrontendId}, bài ghi ${d.id}`);
    if (q.title !== d.ten) bao(`${d.o}: ${slug} tên thật "${q.title}", bài ghi "${d.ten}"`);
    if (q.difficulty !== d.doKho) bao(`${d.o}: ${slug} độ khó thật ${q.difficulty}, bài ghi ${d.doKho}`);
    if (q.isPaidOnly !== d.premium) bao(`${d.o}: ${slug} Premium thật = ${q.isPaidOnly}, bài ghi ${d.premium}`);
  }
  for (const [u, o] of ngoai) {
    if (cache.url[u] === 200) continue;
    let st = 0;
    try {
      const r = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) cuongthai-link-check' }, signal: AbortSignal.timeout(20000) });
      st = r.status;
    } catch (e) { st = String(e.message || e); }
    if (st === 200) cache.url[u] = 200; else bao(`${o}: link ngoài ${u} → ${st}`);
  }
  fs.writeFileSync(cf, JSON.stringify(cache, null, 1));
  console.log(`🌐 đã kiểm ${deLc.size} đề LeetCode, ${ngoai.size} link ngoài`);
}

const quiz = bai.filter((x) => x.quiz).length;
const kt = bai.filter((x) => !x.quiz).map((x) => x.content.length);
console.log(`${loi ? '❌' : '✅'} ${bai.length} bài (${quiz} quiz) · TB ${Math.round(kt.reduce((a, b) => a + b, 0) / kt.length).toLocaleString('vi-VN')} ký tự/bài dạy · ${deLc.size} đề LC · ${loi} lỗi`);
process.exit(loi ? 1 : 0);
