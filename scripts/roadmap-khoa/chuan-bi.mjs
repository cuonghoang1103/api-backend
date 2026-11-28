#!/usr/bin/env node
/**
 * Roadmap sơ đồ đầu khoá (28/11/2026) — BƯỚC 1: chuẩn bị ngữ cảnh cho máy soạn (Antigravity / Gemini).
 *
 * Đọc MỘT tệp khoá (content/courses/<x>.mjs hoặc content/academy/<MÃ>.mjs), tách từng chương thành một thư mục
 * `<thuMucRa>/<slugKhoa>/c<NN>/` chứa `chuong.md` — bài web gốc của chương (chỉ phần tiếng Việt, bỏ thẻ HTML,
 * cắt gọn đầu + cuối mỗi bài) + mục lục toàn khoá + danh mục khoá trên web — để máy soạn viết 4 ý cho từng bài
 * (học gì · cần biết trước · học xong làm được gì · kết hợp với) bám đúng nội dung bài.
 *
 *   node scripts/roadmap-khoa/chuan-bi.mjs --file content/courses/postgresql.mjs --out /tmp/rm
 *
 * Bước 2: scripts/roadmap-khoa/chay-agy.sh <thuMucRa>/<slugKhoa>  ·  Bước 3: scripts/roadmap-khoa/gop.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const OUT = val('--out');
if (!FILE || !OUT) { console.error('cần --file <khoá.mjs> --out <thư mục>'); process.exit(1); }
const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');

export function slugify(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}
const vi = (s) => { const p = String(s ?? '').split('|||'); return (p.length > 1 ? p[1] : p[0]).trim(); };

/** Bỏ các khối `<div class="ml-en …">…</div>` (đếm độ sâu thẻ div) rồi bỏ mọi thẻ còn lại. */
export function chuViet(html) {
  let s = String(html || '');
  for (;;) {
    const m = /<div[^>]*class="[^"]*\bml-en\b[^"]*"[^>]*>/i.exec(s);
    if (!m) break;
    let i = m.index + m[0].length; let sau = 1;
    const re = /<\/?div\b[^>]*>/gi; re.lastIndex = i;
    let t;
    while (sau > 0 && (t = re.exec(s))) { sau += t[0][1] === '/' ? -1 : 1; i = re.lastIndex; }
    s = s.slice(0, m.index) + s.slice(sau > 0 ? s.length : i);
  }
  return s
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<pre[\s\S]*?<\/pre>/gi, (b) => ' [code] ' + b.replace(/<[^>]+>/g, '').slice(0, 300) + ' ')
    .replace(/<\/(p|h[1-6]|li|div|tr)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}
const gon = (s, dau = 2600, cuoi = 900) => (s.length <= dau + cuoi + 50 ? s : `${s.slice(0, dau)}\n[…lược bớt…]\n${s.slice(-cuoi)}`);

async function napKhoa(f) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  const spec = mod.default;
  const c = spec.course;
  return { spec, slug: c.slug || slugify(c.title), ten: vi(c.title), ma: c.courseCode || null };
}

/** Danh mục khoá trên web để máy soạn gợi ý "kết hợp với khoá …" — chỉ được chọn slug trong danh sách này. */
async function danhMuc() {
  const kq = [];
  const dirC = path.join(GOC, 'content/courses');
  for (const f of fs.readdirSync(dirC)) {
    if (!f.endsWith('.mjs') || f.startsWith('_')) continue;
    const t = fs.readFileSync(path.join(dirC, f), 'utf8');
    const s = /\n\s{4}slug:\s*'([^']+)'/.exec(t); const ti = /\n\s{4}title:\s*'([^']+)'/.exec(t);
    if (s && ti) kq.push(`${s[1]} — ${vi(ti[1])}`);
  }
  // Academy: các môn ngành Kỹ thuật phần mềm hay được nhắc chéo.
  const MA = ['PRF192', 'PRO192', 'CSD201', 'DBI202', 'LAB211', 'OSG202', 'NWC203c', 'CEA201', 'CSI104', 'MAD101', 'MAE101',
    'MAS291', 'JPD113', 'JPD123', 'WED201c', 'PRJ301', 'SWE201c', 'SWR302', 'SWT301', 'SWD392', 'SWP391', 'FER202', 'SDN302',
    'MMA301', 'WDP301', 'PRM392', 'IOT102'];
  for (const m of MA) {
    const p = path.join(GOC, 'content/academy', `${m}.mjs`);
    if (!fs.existsSync(p)) continue;
    const t = fs.readFileSync(p, 'utf8');
    const s = /\n\s{4}slug:\s*'([^']+)'/.exec(t); const ti = /\n\s{4}title:\s*'([^']+)'/.exec(t);
    if (s) kq.push(`${s[1]} — ${m}${ti ? ' · ' + vi(ti[1]) : ''} (Academy)`);
  }
  return kq;
}

const { spec, slug, ten, ma } = await napKhoa(FILE);
const chuong = (spec.sections || []).map((s, i) => ({
  i, ten: vi(s.title), moTa: vi(s.description || ''),
  bai: (s.lessons || []).map((l) => ({ slug: l.slug || slugify(l.title), ten: vi(l.title), moTa: vi(l.description || ''), loai: l.type || '', noiDung: chuViet(l.content || '') })),
})).filter((c) => c.bai.length);
const mucLuc = chuong.map((c) => `## ${c.ten}\n${c.bai.map((b) => `- ${b.slug} — ${b.ten}`).join('\n')}`).join('\n');
const dm = await danhMuc();
const goc = path.join(path.resolve(OUT), slug);
fs.mkdirSync(goc, { recursive: true });
fs.writeFileSync(path.join(goc, 'khoa.json'), JSON.stringify({ slug, ten, ma, file: path.relative(GOC, path.resolve(FILE)), chuong: chuong.map((c) => ({ i: c.i, ten: c.ten, bai: c.bai.map((b) => b.slug) })) }, null, 1));
for (const c of chuong) {
  const d = path.join(goc, `c${String(c.i).padStart(2, '0')}`);
  fs.mkdirSync(d, { recursive: true });
  const than = c.bai.map((b) => `### BÀI \`${b.slug}\` — ${b.ten}\n${b.moTa ? `Mô tả: ${b.moTa}\n` : ''}${b.loai ? `Loại: ${b.loai}\n` : ''}\n${gon(b.noiDung) || '(bài không có phần chữ — ví dụ quiz)'}\n`).join('\n');
  fs.writeFileSync(path.join(d, 'chuong.md'),
    `# Khoá: ${ten}${ma ? ` (${ma})` : ''} — slug khoá \`${slug}\`\n\n` +
    `# CHƯƠNG CẦN VIẾT: ${c.ten}\n${c.moTa ? `Mô tả chương: ${c.moTa}\n` : ''}\n` +
    `Danh sách slug bài của chương (viết ĐỦ, ĐÚNG các slug này): ${c.bai.map((b) => b.slug).join(', ')}\n\n` +
    `---\n# NỘI DUNG BÀI WEB GỐC CỦA CHƯƠNG (tiếng Việt, đã lược)\n\n${than}\n---\n` +
    `# MỤC LỤC TOÀN KHOÁ (để chọn canBietBai / ketHopBai — chỉ dùng slug có ở đây)\n${mucLuc}\n\n---\n` +
    `# DANH MỤC KHOÁ TRÊN WEB (để chọn ketHopKhoa — chỉ dùng slug có ở đây)\n${dm.join('\n')}\n`);
  fs.writeFileSync(path.join(d, 'slug.txt'), c.bai.map((b) => b.slug).join('\n') + '\n');
}
console.log(`${slug}: ${chuong.length} chương, ${chuong.reduce((n, c) => n + c.bai.length, 0)} bài → ${goc}`);
