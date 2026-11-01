#!/usr/bin/env node
/**
 * Dựng + KIỂM THẬT bộ csd201-practice (đề Java chạy trên máy người học) — chép từ pro192-practice/nguon/_dung.mjs:
 *
 *   node content/codelab/csd201-practice/nguon/_dung.mjs [--chi <tiền tố slug module>] [--khong-kiem]
 *
 *  1. nạp mọi module với CSD201_DUNG=1 ⇒ đề nào lời giải/ca đổi (băm lệch _ket-qua.json) thì dựng bản LỜI GIẢI vào thư mục
 *     tạm và chạy `node cham.mjs --record` ⇒ output mong đợi = output thật của lời giải (sập/quá giờ ⇒ lỗi) ⇒ ghi cache;
 *  2. ghi _track.json (thứ tự module = thứ tự bài trong khoá);
 *  3. chạy bộ xuất chung `scripts/codelab-xuat-de.mjs --track csd201-practice` (tiến trình mới, đọc cache) ⇒ JSON;
 *  4. từ CHÍNH JSON đã xuất (thứ người học tải về): giải nén code khởi đầu và lời giải ra thư mục tạm, chạy `node cham.mjs`:
 *     lời giải phải ALL CHECKS PASSED (exit 0), khởi đầu phải trượt (exit 1); biên dịch cả hai bằng `javac --release <8|17>`
 *     (mọi đề CSD201 phải chạy được trên JDK 8 của phòng thi).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

process.env.CSD201_DUNG = '1';
const NGUON = path.dirname(fileURLToPath(import.meta.url));
const TRACK_DIR = path.dirname(NGUON);
const GOC = path.resolve(TRACK_DIR, '../../..');
const args = process.argv.slice(2);
const CHI = args.includes('--chi') ? args[args.indexOf('--chi') + 1] : null;
const KHONG_KIEM = args.includes('--khong-kiem');
const SONG_SONG = Math.max(2, Math.min(8, os.cpus().length - 2));

const { CAN_GHI } = await import('./_chung.mjs');
const tepMod = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort();
const mods = [];
for (const f of tepMod) mods.push((await import(pathToFileURL(path.join(NGUON, f)).href)).default);

function chay(cmd, argv, opts = {}) {
  return new Promise((res) => {
    const p = spawn(cmd, argv, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => res({ code, out }));
  });
}
async function pool(items, fn) {
  const kq = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: SONG_SONG }, async () => { while (i < items.length) { const k = i++; kq[k] = await fn(items[k], k); } }));
  return kq;
}
function viet(dir, files) {
  for (const [f, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), text);
  }
}
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'csd201-dung-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

// ── 1. output mong đợi ──
const cachePath = path.join(NGUON, '_ket-qua.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
const canChay = CAN_GHI.filter((d) => !d.coKq);
let loi = 0;
console.log(`① ${CAN_GHI.length} đề · ${canChay.length} cần chạy lời giải để ghi output mong đợi`);
await pool(canChay, async (d) => {
  const dir = path.join(TMP, 'ghi', d.id);
  viet(dir, { ...d.giai, ...d.harness, 'cham.mjs': d.cham });
  const rec = path.join(dir, 'rec.json');
  const r = await chay(process.execPath, ['cham.mjs', '--record', rec], { cwd: dir });
  if (r.code !== 0 || !fs.existsSync(rec)) { loi++; console.log(`  ✗ ${d.id}: lời giải không chạy được\n${r.out}`); return; }
  const kq = JSON.parse(fs.readFileSync(rec, 'utf8'));
  const sap = kq.map((x, i) => (x.crash ? `ca ${i + 1}: ${x.crash}` : null)).filter(Boolean);
  if (sap.length) { loi++; console.log(`  ✗ ${d.id}: lời giải sập/quá giờ\n    ${sap.join('\n    ')}`); return; }
  if (kq.some((x) => /[^\x09\x0a\x0d\x20-\x7e]/.test(x.out))) console.log(`  ⚠ ${d.id}: output có ký tự ngoài ASCII (Windows cp1252 có thể in khác)`);
  cache[d.id] = { bam: d.bam, ra: kq.map((x) => x.out) };
  console.log(`  ✓ ${d.id}: ${kq.length} ca ghi output`);
});
for (const k of Object.keys(cache)) if (!CAN_GHI.some((d) => d.id === k)) delete cache[k];
fs.writeFileSync(cachePath, JSON.stringify(Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))), null, 1) + '\n');
if (loi) { console.log(`✗ ${loi} lỗi khi ghi output`); process.exit(1); }

// ── 2. _track.json ──
const course = (await import(pathToFileURL(path.join(GOC, 'content/academy/CSD201.mjs')).href)).default;
const ORDER = new Map(course.sections.flatMap((s) => s.lessons.map((l) => l.slug)).map((slug, i) => [slug, i]));
for (const m of mods) if (!ORDER.has(m.baiHoc)) { console.log(`✗ module ${m.slug}: bài ${m.baiHoc} không có trong CSD201.mjs`); loi++; }
mods.sort((a, b) => (ORDER.get(a.baiHoc) ?? 1e9) - (ORDER.get(b.baiHoc) ?? 1e9));
const en = (t) => (typeof t === 'string' ? t : t.en);
// cấp độ theo số chương trong tên module: 0–1 cơ bản, 2–8 trung cấp, 9+ (nâng cao, ⭐ CS, luyện PE) nâng cao
const capDo = (m) => { const n = Number((/^(\d+)\./.exec(m.ten) || [])[1]); return n <= 1 ? 'BEGINNER' : n <= 8 ? 'INTERMEDIATE' : 'ADVANCED'; };
const track = {
  groupSlug: 'fptu',
  slug: 'csd201-practice',
  name: 'CSD201 — Luyện tập Cấu trúc dữ liệu & Giải thuật bằng Java (chạy & tự chấm trên máy)',
  language: 'java',
  color: '#2f6f9f',
  docsUrl: 'https://docs.oracle.com/javase/8/docs/api/',
  status: 'PUBLISHED',
  level: 'INTERMEDIATE',
  description: 'Bộ luyện môn CSD201 (Data Structures and Algorithms, Java) theo từng bài học: độ phức tạp, mảng động, danh sách liên kết đơn/vòng/kép, ngăn xếp, hàng đợi, hàng đợi ưu tiên, đệ quy, cây nhị phân, BST, AVL, heap, đồ thị (BFS, DFS, Dijkstra, cây khung nhỏ nhất, Euler), sắp xếp, băm, xử lý văn bản (KMP, Huffman, LZW, RLE), ⭐ thuật toán phỏng vấn và đề PE đúng khuôn trường (MyList/BSTree/Graph đọc data.txt, ghi f1.txt…). Website KHÔNG chấm: mỗi đề tải về một thư mục (code khởi đầu + máy chấm cham.mjs + ca mẫu), bạn làm trên máy với JDK của mình rồi chạy "node cham.mjs" — nó biên dịch bằng javac --release 8, chạy nhiều ca (có ca ẩn), so output từng dòng có diff, đi theo đúng các liên kết head/next/prev/left/right của cấu trúc bạn dựng (reflection), đo độ phức tạp trên input lớn có hạn giờ rồi cho điểm; đạt hết thì bấm "Tự đánh dấu đã giải".',
  modules: mods.filter((m) => !CHI || m.slug.startsWith(CHI) || true).map((m) => ({
    slug: m.slug,
    name: m.ten,
    level: capDo(m),
    description: `Luyện: ${m.de.map((d) => en(d.tieuDe)).join(' · ')}`,
  })),
};
fs.writeFileSync(path.join(TRACK_DIR, '_track.json'), JSON.stringify(track, null, 2) + '\n');
console.log(`② _track.json: ${track.modules.length} module · ${mods.reduce((s, m) => s + m.de.length, 0)} đề`);

// ── 3. xuất JSON bằng bộ xuất chung ──
const xuat = spawnSync(process.execPath, ['scripts/codelab-xuat-de.mjs', '--track', 'csd201-practice', ...(CHI ? [] : [])], { cwd: GOC, encoding: 'utf8', env: { ...process.env, CSD201_DUNG: '' } });
const dongXuat = (xuat.stdout + xuat.stderr).trim().split('\n');
console.log(`③ codelab-xuat-de: ${dongXuat[dongXuat.length - 1]}`);
if (xuat.status !== 0) { console.log(dongXuat.filter((l) => /✗|-\s/.test(l)).join('\n')); process.exit(1); }
const nd = spawnSync(process.execPath, ['scripts/codelab-kiem-noi-dung.mjs', '--track', 'csd201-practice'], { cwd: GOC, encoding: 'utf8' });
const dongNd = (nd.stdout + nd.stderr).trim().split('\n');
console.log(`③b codelab-kiem-noi-dung: ${dongNd[dongNd.length - 1]}`);
if (nd.status !== 0) { console.log(dongNd.filter((l) => /✗/.test(l)).join('\n')); loi++; }
if (KHONG_KIEM) process.exit(loi ? 1 : 0);

// ── 4. kiểm thật từ JSON ──
const jsons = fs.readdirSync(TRACK_DIR).filter((f) => /^csd201-practice__.*\.json$/.test(f)).sort();
const viec = [];
for (const f of jsons) {
  const p = JSON.parse(fs.readFileSync(path.join(TRACK_DIR, f), 'utf8'));
  if (CHI && !p.moduleSlug.startsWith(CHI)) continue;
  p.exercises.forEach((ex, i) => viec.push({ mod: p.moduleSlug, i, ex }));
}
const tong = { dat: 0, truot: 0 };
const kq = await pool(viec, async ({ mod, i, ex }) => {
  const ten = `${mod}#${i + 1}`;
  const java = ex.testsJson.chayTaiMay.java;
  const out = [];
  for (const loai of ['loiGiai', 'khoiDau']) {
    const dir = path.join(TMP, 'kiem', ten.replace('#', '_'), loai);
    viet(dir, Object.fromEntries((loai === 'loiGiai' ? ex.solutionCodeJson : ex.starterCodeJson).map((b) => [b.name, b.code])));
    const r = await chay(process.execPath, ['cham.mjs'], { cwd: dir, env: { ...process.env, NO_COLOR: '1' } });
    const diem = /Score \/ Điểm: (\d+)\/(\d+)/.exec(r.out);
    const javaFiles = [];
    const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name); if (e.isDirectory()) walk(q); else if (e.name.endsWith('.java')) javaFiles.push(q); } };
    walk(dir);
    const bin = path.join(dir, '.rel');
    const rel = spawnSync('javac', ['--release', String(java), '-Xlint:-options', '-encoding', 'UTF-8', '-nowarn', '-d', bin, ...javaFiles], { encoding: 'utf8' });
    out.push({ loai, code: r.code, diem: diem ? `${diem[1]}/${diem[2]}` : '?', relOk: rel.status === 0, relErr: rel.stderr, log: r.out });
  }
  const [g, k] = out;
  const khongBD = !!ex.testsJson.chayTaiMay.khoiDauKhongBienDich; // đề "sửa cho biên dịch được": khởi đầu PHẢI lỗi biên dịch
  const dung = g.code === 0 && /ALL CHECKS PASSED/.test(g.log) && k.code === 1 && g.relOk && (khongBD ? !k.relOk : k.relOk);
  if (dung) tong.dat++; else tong.truot++;
  return `${dung ? '✓' : '✗'} ${ten} ${ex.title.slice(0, 60)} — lời giải ${g.diem}${g.relOk ? '' : ` ✗javac --release ${java}`} · khởi đầu ${k.diem}${k.code === 1 ? ' (trượt ✓)' : ' (KHÔNG trượt ✗)'}${k.relOk ? (khongBD ? ' ✗khởi đầu LẼ RA phải lỗi biên dịch' : '') : (khongBD ? ' (khởi đầu lỗi biên dịch — đúng ý đề)' : ` ✗khởi đầu không biên dịch --release ${java}`)}`
    + (dung ? '' : `\n${g.code !== 0 ? g.log.split('\n').filter((l) => /✘|\s{4}/.test(l)).slice(0, 12).join('\n') : ''}${g.relOk ? '' : g.relErr.slice(0, 800)}${k.relOk || khongBD ? '' : k.relErr.slice(0, 800)}`);
});
for (const l of kq) console.log('  ' + l);
console.log(`④ ${tong.dat}/${viec.length} đề: lời giải đạt hết + khởi đầu trượt + javac --release đúng bản${tong.truot ? ` — ✗ ${tong.truot} đề lỗi` : ''}`);
process.exit(tong.truot || loi ? 1 : 0);
