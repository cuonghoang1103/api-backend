/**
 * 🖼️ Tài liệu gốc JPD123 (RIÊNG TƯ) — xuất ảnh từng trang + chuyển file nghe + MÃ HOÁ + tải lên R2.
 * ─────────────────────────────────────────────────────────────────────────
 * Slide cô, bài tập, đề ôn, hướng dẫn thi nói, bài đọc Irodori, danh sách từ mới, 66 track CD: tất cả có bản quyền của
 * người khác ⇒ chỉ tài khoản được phép (SACH_RIENG_USER_IDS / ADMIN) xem, qua backend `/api/v1/sach-rieng/dekiru/*`.
 * Cùng khoá `SACH_RIENG_KHOA` và cùng cách mã hoá (AES-256-GCM) với ảnh Sách gốc. Ảnh/âm thanh trung gian nằm NGOÀI repo.
 *
 *   npx tsx scripts/sach-rieng/tai-lieu-tai-len.mts --ra <thư mục tạm> [--chi-danh-muc] [--bo-nghe] [--lam-lai]
 *
 * Cần `pdftoppm`, `cwebp`, `ffmpeg`, `textutil` (macOS). CỐ Ý chạm bucket thật (tệp đã mã hoá, tiền tố rieng/sach/dekiru/).
 */
import 'dotenv/config';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { headObject, putObject } from '../../src/config/r2.js';
import { khoaTuEnv, maHoa } from '../../src/services/sachRieng/maHoa.js';
import { khoaR2 } from '../../src/services/sachRieng/sachRieng.service.js';

const run = promisify(execFile);
const arg = (k: string, d = '') => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1]! : d; };
const co = (k: string) => process.argv.includes(k);

const GOC = path.join(os.homedir(), 'Downloads/JPD123 new');
const RA = arg('--ra');
const PDF_SLIDE = arg('--pdf-slide'); // thư mục PDF đã chuyển từ PPT (LibreOffice)
if (!RA || !PDF_SLIDE) throw new Error('Thiếu --ra <thư mục tạm> và --pdf-slide <thư mục PDF slide>');

type Doc = { id: string; nhom: string; ten: string; pdf: string; bai?: number; lienKet: string[]; rong: number };
const nn = (n: number) => String(n).padStart(2, '0');
const DS: Doc[] = [];
const slot = [
  [1, 'JPD123 Slot 1 L4.1', 'Slot 1 — Bài 4.1', 4], [2, 'JPD123 Slot 2 L4.2+ Kanji L4', 'Slot 2 — Bài 4.2 + Kanji 4', 4],
  [3, 'JPD123 Slot 3 Ôn Kanji 4+ L4.2 tiếp+ L4.3', 'Slot 3 — Ôn Kanji 4, Bài 4.2 tiếp, 4.3', 4], [4, 'JPD123 Slot 4 L4.3 tiếp+ Ôn tập L4+ Chữa BT', 'Slot 4 — Bài 4.3 tiếp, ôn tập, chữa BT', 4],
  [5, 'JPD123 Slot 5 L5.1', 'Slot 5 — Bài 5.1', 5], [6, 'JPD123 Slot 6 L5.1 tiếp+ L5.2', 'Slot 6 — Bài 5.1 tiếp, 5.2', 5],
  [7, 'JPD123 Slot 7 L5.2 tiếp', 'Slot 7 — Bài 5.2 tiếp', 5], [8, 'JPD123 Slot 8 L5.3', 'Slot 8 — Bài 5.3', 5],
  [9, 'JPD123 Slot 9 Kanji 5+ Ôn tập L5+ Chữa B5', 'Slot 9 — Kanji 5, ôn tập, chữa BT 5', 5], [10, 'JPD123 Slot 10 Ôn Kanji 5+ Ôn L4,5+ L6.1', 'Slot 10 — Ôn Kanji 5, ôn Bài 4–5, Bài 6.1', 6],
  [11, 'JPD123 Slot 11 Test 1+ L6.1 tiếp', 'Slot 11 — Test 1, Bài 6.1 tiếp', 6], [12, 'JPD123 Slot 12 L6.2', 'Slot 12 — Bài 6.2', 6],
  [13, 'JPD123 Slot 13 L6.3', 'Slot 13 — Bài 6.3', 6], [14, 'JPD123 Slot 14 Kanji 6+ Ôn tập L6+ Chữa B6', 'Slot 14 — Kanji 6, ôn tập, chữa BT 6', 6],
  [15, 'JPD123 Slot 15 Ôn Kanji 6+ L7.1', 'Slot 15 — Ôn Kanji 6, Bài 7.1', 7], [16, 'JPD123 Slot 16 L7.2', 'Slot 16 — Bài 7.2', 7],
  [17, 'JPD123 Slot 17 L7.2 tiếp+ Kanji 7', 'Slot 17 — Bài 7.2 tiếp, Kanji 7', 7], [18, 'JPD123 Slot 18 L7.3', 'Slot 18 — Bài 7.3', 7],
  [19, 'JPD123 Slot 19 Ôn Kanji 7+ Ôn L7+ Chữa BT7', 'Slot 19 — Ôn Kanji 7, ôn tập, chữa BT 7', 7], [20, 'JPD123 Slot 20 Test 2+ ÔN TẬP', 'Slot 20 — Test 2 + ôn tập', 0],
] as const;
for (const [n, f, ten, bai] of slot) {
  DS.push({ id: `slot-${nn(n)}`, nhom: 'slide-lop', ten, pdf: path.join(PDF_SLIDE, `${f}.pdf`), ...(bai ? { bai } : {}), lienKet: [n === 20 ? 'cuoi-ky-slot' : `slot-${nn(n)}-`], rong: 1280 });
}
DS.push({ id: 'slot-30-on-tap', nhom: 'slide-lop', ten: 'Slot 30 — Ôn tập cuối kỳ', pdf: path.join(PDF_SLIDE, 'Slot 30 ÔN TẬP.pdf'), lienKet: ['cuoi-ky-slot'], rong: 1280 });
DS.push({ id: 'slot-30-on-nghe', nhom: 'slide-lop', ten: 'Slot 30 — Ôn nghe Bài 4–7', pdf: path.join(PDF_SLIDE, 'Slot 30 Ôn nghe bài 4~7.pdf'), lienKet: ['cuoi-ky-nghe', 'cuoi-ky-slot'], rong: 1280 });
for (const b of [4, 5, 6, 7]) {
  DS.push({ id: `tong-hop-b${b}`, nhom: 'tong-hop', ten: `Slide tổng hợp từ vựng & ngữ pháp Bài ${b}`, pdf: path.join(PDF_SLIDE, `JPD123 Slide tổng hợp từ vựng và ngữ pháp bài ${b}.pdf`), bai: b,
    lienKet: [`b${b}-tu-vung`, `b${b}-ngu-phap`, `slide-tong-hop-b${b}`], rong: 1280 });
  const bt = (loai: string, ten: string, k: string) => path.join(GOC, '2. JPD123 Bài tập', `JPD123 BT ${loai}`, `Dekiru so cap BT ${k} ${nn(b)}.pdf`);
  DS.push({ id: `bt-tu-vung-${nn(b)}`, nhom: 'bai-tap', ten: `BT từ vựng Bài ${b}`, pdf: bt('Tu vung', '', 'Tu vung'), bai: b, lienKet: ['bt-b45-', 'bt-tu-vung-ngu-phap-b6-7', `b${b}-bai-tap`], rong: 1100 });
  DS.push({ id: `bt-ngu-phap-${nn(b)}`, nhom: 'bai-tap', ten: `BT ngữ pháp Bài ${b}`, pdf: bt('Ngu phap', '', 'Ngu phap'), bai: b, lienKet: ['bt-b45-', 'bt-tu-vung-ngu-phap-b6-7', `b${b}-bai-tap`], rong: 1100 });
}
const CK = path.join(GOC, '4. Ôn giữa kỳ và cuối kỳ');
DS.push({ id: 'chia-the-te-b7', nhom: 'bai-tap', ten: 'Bài tập chia thể て Bài 7', pdf: path.join(CK, '2. Ôn thi cuối kỳ/Bài tập chia thể te bài 7.pdf'), bai: 7, lienKet: ['chia-the-te-bt-bai-7'], rong: 1100 });
DS.push({ id: 'on-giua-ky-b45', nhom: 'on-thi', ten: 'Ôn giữa kỳ Bài 4–5', pdf: path.join(CK, '1. Ôn thi giữa kỳ/JPD123 ôn giữa kỳ bài 4,5.pdf'), lienKet: ['on-giua-ky-b4-5'], rong: 1100 });
DS.push({ id: 'on-kanji-mid', nhom: 'on-thi', ten: 'Ôn Kanji giữa kỳ', pdf: path.join(CK, '1. Ôn thi giữa kỳ/JPD123 Ôn Kanji Mid.pdf'), lienKet: ['on-giua-ky-b4-5'], rong: 1100 });
DS.push({ id: 'on-cuoi-ky-chu-han', nhom: 'on-thi', ten: 'Ôn cuối kỳ — chữ Hán Bài 4–7', pdf: path.join(CK, '2. Ôn thi cuối kỳ/on cuoi ky chu han b4~7.pdf'), lienKet: ['cuoi-ky-chu-han'], rong: 1100 });
DS.push({ id: 'on-cuoi-ky-ngu-phap', nhom: 'on-thi', ten: 'Ôn cuối kỳ — ngữ pháp Bài 4–7', pdf: path.join(CK, '2. Ôn thi cuối kỳ/on cuoi ky ngu phap jpd2 b4~7.pdf'), lienKet: ['cuoi-ky-ngu-phap'], rong: 1100 });
DS.push({ id: 'thi-noi-huong-dan', nhom: 'thi-noi', ten: 'Hướng dẫn thi nói (dành cho SV)', pdf: path.join(CK, '2. Ôn thi cuối kỳ/Speaking/1. JPD123 HD thi nói (Dành cho SV).pdf'), lienKet: ['cuoi-ky-thi-noi', 'cuoi-ky-noi'], rong: 1100 });
DS.push({ id: 'thi-noi-demo', nhom: 'thi-noi', ten: 'Speaking Demo (dành cho SV)', pdf: path.join(CK, '2. Ôn thi cuối kỳ/Speaking/2. JPD123 Speaking Demo (Dành cho SV).pdf'), lienKet: ['cuoi-ky-thi-noi', 'cuoi-ky-noi'], rong: 1100 });
const DT = path.join(GOC, '5. Bài đọc thêm');
DS.push({ id: 'irodori-so-cap', nhom: 'doc-them', ten: 'Irodori — Bài đọc sơ cấp', pdf: path.join(DT, '4. Irodori Bài đọc Sơ cấp.pdf'), lienKet: [], rong: 1100 });
DS.push({ id: 'irodori-so-trung', nhom: 'doc-them', ten: 'Irodori — Bài đọc sơ trung cấp', pdf: path.join(DT, '5. Irodori Bài đọc Sơ trung cấp.pdf'), lienKet: [], rong: 1100 });
DS.push({ id: 'irodori-trung-cap', nhom: 'doc-them', ten: 'Irodori — Bài đọc trung cấp', pdf: path.join(DT, '6. Irodori Bài đọc Trung cấp.pdf'), lienKet: [], rong: 1100 });
DS.push({ id: 'tu-moi-dekiru', nhom: 'tu-moi', ten: 'Danh sách từ mới Dekiru Nihongo (beginner)', pdf: path.join(GOC, 'New words list - Dekiru Nihongo Beginner.pdf'), lienKet: [], rong: 1100 });

const coSan = async (f: string) => { try { return (await stat(f)).size > 0; } catch { return false; } };
async function dong<T>(ds: T[], n: number, f: (x: T, i: number) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < ds.length) { const k = i++; await f(ds[k]!, k); } }));
}

async function main() {
  const khoa = khoaTuEnv();
  if (!khoa) throw new Error('Thiếu SACH_RIENG_KHOA trong .env');
  const goiLen = async (key: string, du: Buffer) => putObject(key, maHoa(du, khoa), 'application/octet-stream', 'private, no-store');
  await mkdir(path.join(RA, 'tam'), { recursive: true });

  // 1. Ảnh trang từng tài liệu.
  const danhMuc: Array<Doc & { soTrang: number; pdf: undefined; rong: undefined }> = [] as never;
  for (const d of DS) {
    if (!(await coSan(d.pdf))) throw new Error(`Không thấy tệp: ${d.pdf}`);
    const { stdout } = await run('pdfinfo', [d.pdf]);
    const soTrang = Number(/Pages:\s+(\d+)/.exec(stdout)?.[1]);
    if (!soTrang) throw new Error(`Không đọc được số trang: ${d.pdf}`);
    danhMuc.push({ ...d, soTrang, pdf: undefined, rong: undefined } as never);
    if (co('--chi-danh-muc')) continue;
    const thuMuc = path.join(RA, 'anh', d.id);
    await mkdir(thuMuc, { recursive: true });
    const trang = Array.from({ length: soTrang }, (_, k) => k + 1);
    let moi = 0;
    await dong(trang, 6, async (p) => {
      const key = khoaR2.taiLieu(d.id, p);
      if (!co('--lam-lai') && await headObject(key)) return;
      const tam = path.join(RA, 'tam', `${d.id}-${p}`);
      const webp = path.join(thuMuc, `p-${String(p).padStart(3, '0')}.webp`);
      await run('pdftoppm', ['-f', String(p), '-l', String(p), '-scale-to-x', String(d.rong), '-scale-to-y', '-1', '-png', '-singlefile', d.pdf, tam]);
      await run('cwebp', ['-quiet', '-q', '72', `${tam}.png`, '-o', webp]);
      await rm(`${tam}.png`, { force: true });
      await goiLen(key, await readFile(webp));
      moi++;
    });
    console.log(`✓ ${d.id}: ${soTrang} trang (${moi} mới)`);
  }

  // 2. Ghi chú: hai link làm thử (docx cô gửi).
  const link = async (f: string) => (await run('textutil', ['-convert', 'txt', '-stdout', f])).stdout.match(/https?:\/\/\S+/)?.[0] ?? null;
  const lienNgoai = [
    { ten: 'Link làm thử Midterm test (Google Form của cô)', url: await link(path.join(CK, '1. Ôn thi giữa kỳ/Link làm thử Midterm test.docx')) },
    { ten: 'Link làm thử Final test (Google Form của cô)', url: await link(path.join(CK, '2. Ôn thi cuối kỳ/Link làm thử Final test.docx')) },
  ].filter((x) => x.url);

  // 3. File nghe: wma → m4a (AAC mono 80k) rồi mã hoá.
  const tracks: number[] = [];
  if (!co('--bo-nghe')) {
    const NGHE = path.join(GOC, '3. File nghe bài 4~7');
    for (const L of ['Lesson 4', 'Lesson 5', 'Lesson 6', 'Lesson 7']) {
      for (const f of (await readdir(path.join(NGHE, L))).filter((x) => x.endsWith('.wma')).sort()) {
        const n = Number(/Track\s*(\d+)/.exec(f)![1]);
        const key = khoaR2.amNghe(n);
        tracks.push(n);
        if (!co('--lam-lai') && await headObject(key)) continue;
        const m4a = path.join(RA, 'tam', `t${n}.m4a`);
        await run('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(NGHE, L, f), '-vn', '-ac', '1', '-c:a', 'aac', '-b:a', '80k', m4a]);
        await goiLen(key, await readFile(m4a));
        await rm(m4a, { force: true });
      }
    }
    console.log(`✓ file nghe: ${tracks.length} track`);
  }

  // 4. Danh mục.
  const tong = danhMuc.reduce((a, d) => a + d.soTrang, 0);
  await goiLen(khoaR2.taiLieuDanhMuc, Buffer.from(JSON.stringify({ taiLieu: danhMuc, lienNgoai, track: tracks.sort((a, b) => a - b) })));
  console.log(`✓ danh mục: ${danhMuc.length} tài liệu · ${tong} trang · ${tracks.length} track`);
  await rm(path.join(RA, 'tam'), { recursive: true, force: true });
}
main().then(() => process.exit(0)).catch((e) => { console.error('❌', e.message); process.exit(1); });
