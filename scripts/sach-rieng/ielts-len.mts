/**
 * 🔒 Tài liệu riêng IELTS — chuyển mã + MÃ HOÁ + tải lên R2 (12/11/2026).
 * ─────────────────────────────────────────────────────────────────────────
 * Vào: thư mục tệp đã giải nén (`--vao`) + danh mục JSON BẢN RÕ (`--danh-muc`, phiên IELTS soạn — khuôn ở cuối tệp).
 *  · video ⇒ ffmpeg h264 (h264_nvenc nếu có GPU NVIDIA, không thì libx264) cao ≤ 720p (thấp hơn thì giữ), AAC 96k,
 *    +faststart ⇒ SR2 (mã hoá chia khúc, tua được) ⇒ rieng/sach/ielts/media/<id>.bin
 *  · audio: mp3/m4a/wav/ogg giữ nguyên, định dạng khác ⇒ m4a AAC 96k ⇒ SR2 ⇒ rieng/sach/ielts/media/<id>.bin
 *  · pdf ⇒ pdftoppm từng trang (rộng 1400px) ⇒ WebP ⇒ SR1 ⇒ rieng/sach/ielts/trang/<id>/p-001.bin …
 *  · cuối cùng: danh mục (điền kichThuoc / thoiLuongGiay / soTrang / mime / bamNguon, BỎ `tep`) ⇒ SR1 ⇒ danh-muc.bin
 * Mục đã lên với cùng băm nguồn (sha256 tệp + phiên bản xử lý) ⇒ bỏ qua. Chạy lại sau khi đứt mạng ⇒ đi tiếp.
 *
 *   npx tsx scripts/sach-rieng/ielts-len.mts --vao <thư mục> --danh-muc <tệp.json> [tuỳ chọn]
 *     --env <tệp>        nạp biến môi trường từ tệp này (R2_* + SACH_RIENG_KHOA) — máy nhà không có .env
 *     --tam <thư mục>    chỗ để tệp chuyển mã / mã hoá tạm (mặc định ~/.cache/ielts-len)
 *     --thu              chạy KHÔ: kiểm danh mục, băm, in kế hoạch — không ffmpeg, không ghi R2
 *     --chi <id>         chỉ xử lý một mục (các mục khác giữ số liệu cũ trên R2)
 *     --chi-danh-muc     không xử lý tệp nào, chỉ đẩy lại danh mục (sửa baiGan / trongTam / mốc)
 *     --chi-chuyen-ma    chỉ chuyển mã vào --tam (KHÔNG cần khoá, không chạm R2) — lượt sau có khoá sẽ dùng lại
 *     --gpu <n>          số lượt mã hoá video chạy song song (mặc định 1)
 *     --video nvenc|x264 ép bộ mã hoá video (mặc định: nvenc nếu ffmpeg có)
 *     --lam-lai          bỏ qua phép so băm, làm lại hết
 *     --r2-that          BẮT BUỘC khi ghi vào bucket THẬT (không có STORAGE_SANDBOX) — chống chạy nhầm
 *
 * Cần: ffmpeg + ffprobe, pdftoppm + pdfinfo (poppler-utils), node + npm ci của repo (dùng sharp để ra WebP).
 * Thử cục bộ: `STORAGE_SANDBOX=1` (kho giả trong $TMPDIR/ctw-r2-sandbox, backend dev cùng cờ đọc được ngay).
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import dotenv from 'dotenv';

const run = promisify(execFile);
const argv = process.argv.slice(2);
const arg = (k: string, d = '') => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1]! : d; };
const co = (k: string) => argv.includes(k);

const ENV = arg('--env');
if (ENV) { const r = dotenv.config({ path: ENV }); if (r.error) throw new Error(`Không đọc được --env ${ENV}: ${r.error.message}`); }

// Nạp SAU khi có env (config/env.ts đọc process.env lúc import).
const { config } = await import('../../src/config/env.js');
const { getR2Client } = await import('../../src/config/r2.js');
const { GetObjectCommand, HeadObjectCommand, PutObjectCommand } = await import('@aws-sdk/client-s3');
const { khoaTuEnv, maHoa, giaiMa } = await import('../../src/services/sachRieng/maHoa.js');
const { taoLuongMaHoaSR2, kichThuocSR2 } = await import('../../src/services/sachRieng/maHoaKhuc.js');
const { khoaR2Ielts, kiemDanhMucIelts } = await import('../../src/services/sachRieng/ielts.js');
type MucIelts = import('../../src/services/sachRieng/ielts.js').MucIelts;
type DanhMucIelts = import('../../src/services/sachRieng/ielts.js').DanhMucIelts;

const VAO = arg('--vao');
const DM_VAO = arg('--danh-muc');
const TAM = path.resolve(arg('--tam', path.join(os.homedir(), '.cache/ielts-len')));
const THU = co('--thu');
const CHI = arg('--chi');
const CHI_DM = co('--chi-danh-muc');
const CHI_CM = co('--chi-chuyen-ma');
const LAM_LAI = co('--lam-lai');
const GPU = Math.max(1, Number(arg('--gpu', '1')) || 1);
const RONG_TRANG = 1400;
/** Đổi tham số xử lý ⇒ tăng số này ⇒ mọi mục bị coi là mới. */
const PB = { video: 'v1-720-aac96', audio: 'v1', pdf: `v1-${RONG_TRANG}w-q72` } as const;
const R2_TOI_DA = 4.9 * 1024 ** 3; // PUT một lần của R2 ≤ ~5 GiB

if (!DM_VAO || (!VAO && !CHI_DM)) {
  console.error('Cách dùng: npx tsx scripts/sach-rieng/ielts-len.mts --vao <thư mục tệp> --danh-muc <danh-muc.json> [--thu] [--chi <id>] …');
  process.exit(2);
}

/* ── Tiện ích ─────────────────────────────────────────────────────── */
const log = (...a: unknown[]) => console.log(new Date().toISOString().slice(11, 19), ...a);
const mb = (n: number) => `${(n / 1024 / 1024).toFixed(1)} MB`;
function den(n: number) {
  let dang = 0; const cho: Array<() => void> = [];
  return async <T>(f: () => Promise<T>): Promise<T> => {
    if (dang >= n) await new Promise<void>((r) => cho.push(r));
    dang++;
    try { return await f(); } finally { dang--; cho.shift()?.(); }
  };
}
const denGpu = den(GPU);
const denMang = den(1); // tải lên tuần tự — mạng nhà dùng chung với phiên video
const denMuc = den(GPU + 1); // số mục xử lý cùng lúc (băm + chuyển mã + tải lên chồng nhau, không đọc 11 GB song song)
async function bamTep(f: string) {
  const h = createHash('sha256');
  await pipeline(createReadStream(f), h);
  return h.digest('hex');
}
async function ffprobe(f: string) {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', f], { maxBuffer: 16 << 20 });
  const j = JSON.parse(stdout) as { format?: { duration?: string; format_name?: string }; streams?: Array<{ codec_type?: string; codec_name?: string; width?: number; height?: number }> };
  const v = j.streams?.find((s) => s.codec_type === 'video');
  const a = j.streams?.find((s) => s.codec_type === 'audio');
  return { giay: Number(j.format?.duration) || 0, dang: j.format?.format_name ?? '', v, a };
}
let boMaVideo: 'nvenc' | 'x264' | null = null;
async function chonBoMa() {
  if (boMaVideo) return boMaVideo;
  const ep = arg('--video');
  if (ep === 'nvenc' || ep === 'x264') return (boMaVideo = ep);
  const { stdout } = await run('ffmpeg', ['-hide_banner', '-encoders'], { maxBuffer: 8 << 20 });
  boMaVideo = /h264_nvenc/.test(stdout) ? 'nvenc' : 'x264';
  if (boMaVideo === 'x264') log('⚠ ffmpeg không có h264_nvenc ⇒ dùng libx264 (CPU, chậm hơn)');
  return boMaVideo;
}
const MIME_AUDIO: Record<string, string> = { '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.oga': 'audio/ogg' };

/* ── R2 ──────────────────────────────────────────────────────────── */
const KHOA = khoaTuEnv();
const canR2 = !CHI_CM;
if (canR2 && !THU) {
  if (!KHOA) throw new Error('Thiếu SACH_RIENG_KHOA (dùng --env <tệp>)');
  if (!config.r2.enabled) throw new Error('Thiếu cấu hình R2 (R2_BUCKET_NAME, R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)');
  if (!config.r2.sandbox && !co('--r2-that')) throw new Error('Sắp ghi vào bucket R2 THẬT — thêm --r2-that nếu cố ý (thử thì đặt STORAGE_SANDBOX=1).');
}
const BUCKET = config.r2.bucketName;
const r2 = () => getR2Client();
async function coObject(key: string): Promise<number | null> {
  try { return (await r2().send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }))).ContentLength ?? 0; } catch { return null; }
}
async function putBuffer(key: string, body: Buffer) {
  await thuLai(key, () => r2().send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentLength: body.length, ContentType: 'application/octet-stream', CacheControl: 'private, no-store' })));
}
async function putTep(key: string, f: string) {
  const n = (await stat(f)).size;
  if (n > R2_TOI_DA) throw new Error(`${key}: ${mb(n)} vượt trần PUT một lần của R2 — hạ chất lượng hoặc chia tệp`);
  await thuLai(key, () => r2().send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: createReadStream(f), ContentLength: n, ContentType: 'application/octet-stream', CacheControl: 'private, no-store' })));
  const co = await coObject(key);
  if (co !== n) throw new Error(`${key}: lên R2 ${co ?? 'không thấy'} byte, cần ${n}`);
}
async function thuLai(ten: string, f: () => Promise<unknown>) {
  for (let lan = 1; ; lan++) {
    try { await f(); return; } catch (e) {
      if (lan >= 4) throw e;
      log(`  ! ${ten} lần ${lan} lỗi: ${(e as Error).message} — thử lại sau ${15 * lan}s`);
      await new Promise((r) => setTimeout(r, 15_000 * lan));
    }
  }
}
async function danhMucCu(): Promise<DanhMucIelts | null> {
  if (!KHOA || !config.r2.enabled) return null;
  try {
    const tepDm = khoaR2Ielts.danhMuc;
    const res = await r2().send(new GetObjectCommand({ Bucket: BUCKET, Key: tepDm }));
    return kiemDanhMucIelts(JSON.parse(giaiMa(Buffer.from(await res.Body!.transformToByteArray()), KHOA).toString('utf8')));
  } catch (e) {
    if ((e as { name?: string }).name === 'NoSuchKey' || (e as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return null;
    throw e;
  }
}

/* ── Danh mục vào ─────────────────────────────────────────────────── */
type MucVao = MucIelts & { tep?: string };
const tho = JSON.parse(await readFile(DM_VAO, 'utf8')) as { muc?: Array<{ id?: string; tep?: unknown }> };
const dmVao = kiemDanhMucIelts(tho);
const tepCua = new Map<string, string>();
const loiTep: string[] = [];
for (const x of tho.muc ?? []) {
  const id = String(x.id ?? '');
  if (CHI_DM) continue;
  if (typeof x.tep !== 'string' || !x.tep) { loiTep.push(`${id}: thiếu "tep" (đường tương đối trong --vao)`); continue; }
  const p = path.resolve(VAO, x.tep);
  if (!p.startsWith(path.resolve(VAO) + path.sep)) { loiTep.push(`${id}: "tep" thoát ra ngoài --vao`); continue; }
  tepCua.set(id, p);
}
for (const m of dmVao.muc) if (!CHI_DM && tepCua.has(m.id) && !existsSync(tepCua.get(m.id)!)) loiTep.push(`${m.id}: không thấy tệp ${tepCua.get(m.id)}`);
if (CHI && !dmVao.muc.some((m) => m.id === CHI)) loiTep.push(`--chi ${CHI}: không có trong danh mục`);
if (loiTep.length) { console.error(`❌ Danh mục vào sai:\n- ${loiTep.join('\n- ')}`); process.exit(1); }

/* ── Xử lý từng mục ───────────────────────────────────────────────── */
type KetQua = Pick<MucIelts, 'kichThuoc' | 'thoiLuongGiay' | 'soTrang' | 'mime' | 'bamNguon'>;

async function chuyenMaVideo(id: string, vao: string, bam8: string): Promise<string> {
  const ra = path.join(TAM, `${id}-${bam8}.mp4`);
  if (existsSync(ra) && (await stat(ra)).size > 0) { log(`  ↺ ${id}: dùng lại bản chuyển mã trong --tam`); return ra; }
  const p = await ffprobe(vao);
  if (!p.v) throw new Error(`${id}: không có luồng hình`);
  const bo = await chonBoMa();
  const tamRa = `${ra}.dang.mp4`;
  const vf = `scale=w=-2:h='min(720,trunc(ih/2)*2)':flags=lanczos,format=yuv420p`;
  const v = bo === 'nvenc'
    ? ['-c:v', 'h264_nvenc', '-preset', 'p5', '-tune', 'hq', '-rc', 'vbr', '-cq', '27', '-b:v', '0', '-maxrate', '3M', '-bufsize', '6M', '-profile:v', 'high']
    : ['-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-maxrate', '3M', '-bufsize', '6M', '-profile:v', 'high'];
  const t0 = Date.now();
  await denGpu(() => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', vao, '-map', '0:v:0', '-map', '0:a:0?', '-vf', vf, ...v,
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-movflags', '+faststart', tamRa], { maxBuffer: 16 << 20 }));
  // Nguồn đã là h264 ≤ 720p mà bản mới LỚN hơn ⇒ giữ hình gốc, chỉ đóng gói lại (faststart, âm AAC).
  const nGoc = (await stat(vao)).size, nMoi = (await stat(tamRa)).size;
  if (p.v.codec_name === 'h264' && (p.v.height ?? 9999) <= 720 && nMoi > nGoc) {
    await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', vao, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'copy',
      ...(p.a?.codec_name === 'aac' ? ['-c:a', 'copy'] : ['-c:a', 'aac', '-b:a', '96k', '-ac', '2']), '-movflags', '+faststart', tamRa]);
    log(`  = ${id}: nguồn đã nhỏ (${p.v.width}x${p.v.height} h264) ⇒ giữ hình gốc`);
  }
  await rename(tamRa, ra);
  log(`  ✓ ${id}: chuyển mã ${mb(nGoc)} → ${mb((await stat(ra)).size)} (${bo}, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  return ra;
}

async function chuanBiAudio(id: string, vao: string, bam8: string): Promise<{ tep: string; mime: string; tam: boolean }> {
  const duoi = path.extname(vao).toLowerCase();
  if (MIME_AUDIO[duoi]) return { tep: vao, mime: MIME_AUDIO[duoi]!, tam: false };
  const ra = path.join(TAM, `${id}-${bam8}.m4a`);
  if (!existsSync(ra)) {
    await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', vao, '-vn', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', `${ra}.dang.m4a`]);
    await rename(`${ra}.dang.m4a`, ra);
  }
  return { tep: ra, mime: 'audio/mp4', tam: true };
}

async function lenMedia(id: string, tep: string): Promise<number> {
  const n = (await stat(tep)).size;
  const sr2 = path.join(TAM, `${id}.sr2`);
  await pipeline(createReadStream(tep, { highWaterMark: 1 << 20 }), taoLuongMaHoaSR2(KHOA!, n), createWriteStream(sr2));
  if ((await stat(sr2)).size !== kichThuocSR2(n)) throw new Error(`${id}: tệp SR2 sai độ dài`);
  const t0 = Date.now();
  await denMang(() => putTep(khoaR2Ielts.media(id), sr2));
  await rm(sr2, { force: true });
  log(`  ⇪ ${id}: ${mb(n)} lên R2 (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  return n;
}

async function xuLyPdf(id: string, vao: string, bam8: string): Promise<{ soTrang: number; kichThuoc: number }> {
  const { stdout } = await run('pdfinfo', [vao]);
  const soTrang = Number(/Pages:\s+(\d+)/.exec(stdout)?.[1]);
  if (!soTrang) throw new Error(`${id}: không đọc được số trang`);
  const sharp = (await import('sharp')).default;
  const thuMuc = path.join(TAM, `${id}-${bam8}`);
  await mkdir(thuMuc, { recursive: true });
  let tong = 0;
  const lam = den(Math.max(2, Math.min(6, os.cpus().length - 1)));
  await Promise.all(Array.from({ length: soTrang }, (_, k) => lam(async () => {
    const p = k + 1;
    const webp = path.join(thuMuc, `p-${String(p).padStart(3, '0')}.webp`);
    if (!existsSync(webp)) {
      const png = path.join(thuMuc, `p-${p}`);
      await run('pdftoppm', ['-f', String(p), '-l', String(p), '-scale-to-x', String(RONG_TRANG), '-scale-to-y', '-1', '-png', '-singlefile', vao, png]);
      await sharp(`${png}.png`).webp({ quality: 72 }).toFile(`${webp}.dang`);
      await rename(`${webp}.dang`, webp);
      await rm(`${png}.png`, { force: true });
    }
    if (CHI_CM) return;
    const du = await readFile(webp);
    tong += du.length;
    await denMang(() => putBuffer(khoaR2Ielts.trang(id, p), maHoa(du, KHOA!)));
  })));
  if (!CHI_CM) await rm(thuMuc, { recursive: true, force: true });
  log(`  ✓ ${id}: ${soTrang} trang${CHI_CM ? ' (đã ra WebP trong --tam)' : ` · ${mb(tong)} lên R2`}`);
  return { soTrang, kichThuoc: tong };
}

async function xuLy(m: MucIelts, vao: string, bam: string): Promise<KetQua> {
  const bam8 = bam.slice(0, 12);
  const bamNguon = `${bam}:${PB[m.loai]}`;
  if (m.loai === 'pdf') return { ...(await xuLyPdf(m.id, vao, bam8)), bamNguon };
  if (m.loai === 'video') {
    const tep = await chuyenMaVideo(m.id, vao, bam8);
    const giay = (await ffprobe(tep)).giay;
    if (CHI_CM) return { kichThuoc: 0, bamNguon };
    const n = await lenMedia(m.id, tep);
    await rm(tep, { force: true });
    return { kichThuoc: n, thoiLuongGiay: Math.round(giay), mime: 'video/mp4', bamNguon };
  }
  const a = await chuanBiAudio(m.id, vao, bam8);
  const giay = (await ffprobe(a.tep)).giay;
  if (CHI_CM) return { kichThuoc: 0, bamNguon };
  const n = await lenMedia(m.id, a.tep);
  if (a.tam) await rm(a.tep, { force: true });
  return { kichThuoc: n, thoiLuongGiay: Math.round(giay), mime: a.mime, bamNguon };
}

/** Mục cũ còn dùng được (cùng băm, tệp còn trên R2)? */
async function conTrenR2(m: MucIelts): Promise<boolean> {
  if (m.loai === 'pdf') return !!m.soTrang && (await coObject(khoaR2Ielts.trang(m.id, 1))) !== null && (await coObject(khoaR2Ielts.trang(m.id, m.soTrang))) !== null;
  const n = await coObject(khoaR2Ielts.media(m.id));
  return n !== null && n === kichThuocSR2(m.kichThuoc);
}

async function main() {
  await mkdir(TAM, { recursive: true });
  log(`R2: ${CHI_CM ? '(không dùng — chỉ chuyển mã)' : config.r2.sandbox ? `SANDBOX (${config.r2.sandbox})` : `THẬT · bucket ${BUCKET}`} · tạm: ${TAM}${THU ? ' · CHẠY KHÔ' : ''}`);
  const cu = await danhMucCu();
  const cuTheoId = new Map((cu?.muc ?? []).map((m) => [m.id, m]));
  log(`Danh mục vào: ${dmVao.muc.length} mục · trên R2: ${cu ? `${cu.muc.length} mục` : 'chưa có'}`);

  const kq = new Map<string, KetQua>();
  const seLen = new Set<string>(); // (--thu) mục sẽ xử lý
  const loi: string[] = [];
  const viec: Array<Promise<void>> = [];
  for (const m of dmVao.muc) {
    if (CHI_DM || (CHI && m.id !== CHI)) continue;
    const vao = tepCua.get(m.id)!;
    viec.push(denMuc(async () => {
      try {
        const bam = await bamTep(vao);
        const bamNguon = `${bam}:${PB[m.loai]}`;
        const old = cuTheoId.get(m.id);
        if (!LAM_LAI && old && old.bamNguon === bamNguon && old.loai === m.loai && await conTrenR2(old)) {
          log(`  · ${m.id}: đã có (cùng băm) — bỏ qua`);
          return;
        }
        if (THU) { log(`  → ${m.id} [${m.loai}] ${path.relative(VAO, vao)} (${mb((await stat(vao)).size)}) — ${old ? 'ĐỔI' : 'MỚI'}`); seLen.add(m.id); return; }
        kq.set(m.id, await xuLy(m, vao, bam));
      } catch (e) {
        loi.push(`${m.id}: ${(e as Error).message}`);
        log(`  ✗ ${m.id}: ${(e as Error).message}`);
      }
    }));
  }
  await Promise.all(viec);
  if (CHI_CM) { log(`Xong chuyển mã (${kq.size} mục, ${loi.length} lỗi). Chạy lại không có --chi-chuyen-ma (có khoá) để mã hoá + tải lên.`); process.exit(loi.length ? 1 : 0); }

  // Danh mục cuối: chữ (tiêu đề, bài gắn, mốc…) LUÔN lấy từ bản vào; số liệu lấy từ lượt này hoặc bản cũ trên R2.
  const muc: MucIelts[] = [];
  const thieu: string[] = [];
  for (const m of dmVao.muc) {
    const moi = kq.get(m.id);
    const old = cuTheoId.get(m.id);
    if (moi) muc.push({ ...m, ...moi });
    else if (old && old.loai === m.loai) muc.push({ ...m, kichThuoc: old.kichThuoc, thoiLuongGiay: old.thoiLuongGiay, soTrang: old.soTrang, mime: old.mime, bamNguon: old.bamNguon });
    else if (seLen.has(m.id)) muc.push({ ...m, kichThuoc: 1, soTrang: m.loai === 'pdf' ? 1 : undefined }); // (--thu) chỗ giữ
    else thieu.push(m.id);
  }
  for (const id of cuTheoId.keys()) if (!dmVao.muc.some((m) => m.id === id)) log(`  ⚠ ${id}: có trên R2 nhưng không còn trong danh mục vào ⇒ bỏ khỏi danh mục (tệp vẫn nằm trên R2)`);
  if (thieu.length) log(`  ⚠ chưa có tệp trên R2 nên CHƯA đưa vào danh mục: ${thieu.join(', ')}`);
  const dmRa: DanhMucIelts = kiemDanhMucIelts({ phienBan: 1, capNhat: new Date().toISOString(), muc }, true);
  const json = Buffer.from(JSON.stringify(dmRa));
  if (THU) { log(`(khô) danh mục sẽ có ${dmRa.muc.length} mục · ${mb(json.length)} — không ghi gì.`); process.exit(loi.length ? 1 : 0); }
  await putBuffer(khoaR2Ielts.danhMuc, maHoa(json, KHOA!));
  const tong = dmRa.muc.reduce((a, m) => a + m.kichThuoc, 0);
  log(`✓ danh mục: ${dmRa.muc.length} mục · ${mb(tong)} · ${loi.length} lỗi${loi.length ? `\n- ${loi.join('\n- ')}` : ''}`);
  log('  (backend đệm danh mục 5 phút — mục mới hiện trên web sau tối đa 5 phút)');
  // Dọn thư mục tạm rỗng của các lượt cũ.
  for (const f of await readdir(TAM)) if (f.endsWith('.sr2') || f.endsWith('.dang.mp4') || f.endsWith('.dang.m4a')) await rm(path.join(TAM, f), { force: true });
  process.exit(loi.length ? 1 : 0);
}

main().catch((e) => { console.error('❌', (e as Error).message); process.exit(1); });

/*
 * ── KHUÔN DANH MỤC VÀO (bản rõ, phiên IELTS soạn) ─────────────────────────
 * {
 *   "phienBan": 1,
 *   "muc": [
 *     {
 *       "id": "rd-b01-skimming",              // [a-z0-9-], ≤ 80 ký tự, duy nhất, KHÔNG đổi sau khi lên (là tên tệp trên R2)
 *       "loai": "video",                      // "video" | "audio" | "pdf"
 *       "tep": "Reading/Buoi 01/01 Skimming.mp4",   // đường TƯƠNG ĐỐI trong --vao (không lên R2)
 *       "tieuDe": "Buổi 1 — Skimming & scanning",
 *       "nguon": "Khoá IELTS Reading online",       // tên khoá / bộ tài liệu gốc
 *       "nhom": "Reading",                          // tuỳ chọn — trang tổng gom theo nhóm
 *       "tomTat": "…",                              // tuỳ chọn
 *       "baiGan": [
 *         { "lessonId": "d4-doc", "trongTam": "Xem 05:30–12:00: cách đọc lướt tiêu đề…",
 *           "moc": [ { "giay": 330, "ghiChu": "Skimming là gì" }, { "giay": 720, "ghiChu": "Làm mẫu đề Cam 15" } ] }
 *       ]                                           // có thể rỗng; pdf KHÔNG có "moc"
 *     }
 *   ]
 * }
 * Pipeline tự điền: kichThuoc, thoiLuongGiay (video/audio), soTrang (pdf), mime, bamNguon.
 */
