/**
 * Ảnh minh hoạ vẽ bằng AI (28/11/2026) — Antigravity CLI (`agy`, gói Google AI Ultra của chủ web) vẽ,
 * thu về WebP rồi đẩy lên R2 cùng chỗ với ảnh Fluent Emoji: `https://media.cuongthai.com/hoc/hinh/<slug>.webp`.
 *
 * Bài học dùng y như ảnh thường (`anh: 'ai-apple'`) — chỉ cần TÊN bắt đầu bằng `ai-` và khai prompt trong
 * `scripts/hinh/ai/<nhóm>.json` dạng `{ "ai-apple": "a red apple" }` (prompt tiếng Anh, tả VẬT/CẢNH, không chữ).
 * Kiểu vẽ chung cho mọi ảnh nằm ở KIEU dưới đây ⇒ cả bộ đồng nhất.
 *
 *   npx tsx scripts/hinh/ve-ai.mts --kiem            # đếm: đã khai / đã có trên R2 / còn thiếu (không vẽ, không đẩy)
 *   npx tsx scripts/hinh/ve-ai.mts                   # vẽ + đẩy MỌI ảnh còn thiếu (R2 THẬT)
 *   npx tsx scripts/hinh/ve-ai.mts --thu ai-apple    # vẽ + đẩy đúng mấy slug
 *   npx tsx scripts/hinh/ve-ai.mts --nhom cau-nen    # chỉ một tệp nhóm
 *
 * Chạy trên Mac (cần `~/.local/bin/agy` đã đăng nhập). Vẽ theo lô 8 ảnh/lượt agy (đỡ tốn lượt gọi);
 * ảnh lỗi/thiếu thì lượt sau tự vẽ lại. Hết hạn mức (RESOURCE_EXHAUSTED) ⇒ CHỜ tới giờ hồi (đọc "Resets in …", mặc định 30 phút) rồi vẽ lại đúng lô đó.
 */
import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { headObject, putObject } from '../../src/config/r2.js';

const KIEU =
  'Style: friendly modern flat vector illustration for a language-learning flashcard, soft rounded shapes, ' +
  'clean bold outlines, bright but gentle colors, centered subject with generous padding, plain pure white background, ' +
  'square 1:1, NO text, NO letters, NO numbers, NO watermark. Characters (if any) are young Vietnamese/Asian adults, ' +
  'cheerful and modest, office or campus casual clothes.';
const LO = 8;
const AGY = path.join(os.homedir(), '.local/bin/agy');
const KHOA = (s: string) => `hoc/hinh/${s}.webp`;

const args = process.argv.slice(2);
const coLa = args.filter((a) => a.startsWith('-') && !['--kiem', '--thu', '--nhom', '--phan'].includes(a));
if (coLa.length) {
  console.error(`Cờ lạ: ${coLa.join(' ')}\nDùng: --kiem · --thu <slug…> · --nhom <tên> · không cờ = vẽ + đẩy MỌI ảnh thiếu lên R2 THẬT`);
  process.exit(2);
}
const chiKiem = args.includes('--kiem');
const nhom = args.includes('--nhom') ? args[args.indexOf('--nhom') + 1] : null;
// --phan i/n: chạy n luồng song song, luồng i lấy mọi ảnh thứ k với k % n == i-1 (giữ thứ tự ưu tiên trong tệp).
const [phanI, phanN] = args.includes('--phan') ? args[args.indexOf('--phan') + 1]!.split('/').map(Number) : [1, 1];

const DIR = path.join(import.meta.dirname, 'ai');
const P: Record<string, string> = {};
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.json') && (!nhom || x === `${nhom}.json`))) {
  for (const [k, v] of Object.entries(JSON.parse(readFileSync(path.join(DIR, f), 'utf8')) as Record<string, string>)) {
    if (!/^ai-[a-z0-9-]+$/.test(k)) { console.error(`✗ ${f}: tên "${k}" phải dạng ai-<chữ-thường-số-gạch>`); process.exit(1); }
    P[k] = v;
  }
}
let ds = Object.keys(P).filter((_, k) => k % phanN! === phanI! - 1); // giữ thứ tự khai trong tệp (cấp dễ trước)
if (args[0] === '--thu') ds = args.slice(1).filter((s) => P[s] || (console.error(`✗ ${s} chưa khai prompt`), false));

const coSan = new Set<string>(); let iH = 0;
await Promise.all(Array.from({ length: 16 }, async () => { while (iH < ds.length) { const s = ds[iH++]!; if (await headObject(KHOA(s))) coSan.add(s); } }));
const thieu = ds.filter((s) => !coSan.has(s));
console.log(`${ds.length} ảnh đã khai · ${ds.length - thieu.length} đã có trên R2 · ${thieu.length} còn thiếu`);
if (chiKiem || !thieu.length) process.exit(0);

const TAM = path.join(os.tmpdir(), `ve-ai-${process.pid}`); console.log(`luồng ${phanI}/${phanN}`);
let moi = 0;
for (let i = 0; i < thieu.length; i += LO) {
  const lo = thieu.slice(i, i + LO);
  rmSync(TAM, { recursive: true, force: true }); mkdirSync(TAM, { recursive: true });
  const brief = [
    `Generate ${lo.length} separate images with your image generation tool and save each one as a PNG in the current directory with EXACTLY the file name given.`,
    KIEU, '', ...lo.map((s) => `- ${s}.png: ${P[s]}`), '',
    'Do not create any other files. When done, reply with the list of files saved.',
  ].join('\n');
  try {
    execFileSync(AGY, ['-p', brief, '--model', 'gemini-3.8-flash-medium', '--sandbox', '--dangerously-skip-permissions',
      '--print-timeout', '1800s', '--output-format', 'json'], { cwd: TAM, stdio: ['ignore', 'pipe', 'pipe'], timeout: 2_000_000, maxBuffer: 64 << 20 });
  } catch (e: any) {
    const msg = String(e?.stdout ?? '') + String(e?.stderr ?? '');
    if (msg.includes('RESOURCE_EXHAUSTED')) {
      const m = /Resets in ([0-9hms]+)/.exec(msg)?.[1] ?? '';
      const giay = (+(/(\d+)h/.exec(m)?.[1] ?? 0)) * 3600 + (+(/(\d+)m/.exec(m)?.[1] ?? 0)) * 60 + 300 || 1800;
      console.error(`⏸ hết hạn mức Antigravity — chờ ${Math.round(giay / 60)} phút rồi vẽ lại lô này`);
      await new Promise((r) => setTimeout(r, giay * 1000));
      i -= LO; continue;
    }
    console.error(`✗ lô ${i / LO + 1}: agy lỗi (${String(e?.message ?? e).slice(0, 160)}) — ảnh có sẵn trong lô vẫn được đẩy`);
  }
  for (const s of lo) {
    const f = path.join(TAM, `${s}.png`);
    if (!existsSync(f)) { console.error(`✗ ${s}: agy không tạo tệp`); process.exitCode = 1; continue; }
    const webp = await sharp(f).resize(384, 384, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).webp({ quality: 84 }).toBuffer();
    await putObject(KHOA(s), webp, 'image/webp');
    moi++;
    console.log(`↑ ${s} (${(webp.length / 1024).toFixed(1)} KB)`);
  }
}
rmSync(TAM, { recursive: true, force: true });
console.log(`✓ xong — đẩy mới ${moi}/${thieu.length}`);
