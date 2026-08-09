/**
 * en-listening-audio.mjs — PHA 1 (chạy LOCAL) của bài nghe My Language EN:
 * sinh file MP3 từ `transcript` bằng Google translate_tts (giọng en, miễn phí,
 * không cần key) rồi upload R2 tại key `audio/my-language/en/<slug>.mp3`.
 *
 *   node scripts/en-listening-audio.mjs            # dry: chỉ sinh + đo, không upload
 *   node scripts/en-listening-audio.mjs --apply    # upload R2 (bỏ qua item đã có, trừ --force)
 *   node scripts/en-listening-audio.mjs --apply --force   # tạo lại kể cả đã có
 *
 * PHA 2 (lúc deploy): scripts/my-language-en-seed.mjs tạo LangListeningItem trỏ
 * tới URL R2 này — KHÔNG sinh audio ở pha đó. Tách pha giống ảnh thẻ feed:
 * asset tĩnh lên R2 từ local, DB seed trong container chỉ tham chiếu URL.
 *
 * ⚠ transcript = ĐÚNG văn bản đọc → audio khớp transcript 100%. Đừng đổi `slug`
 * sau khi đã phát hành (URL đổi + Cloudflare có thể cache — xem cardRev bên feed).
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FORCE = args.includes('--force');

const allItems = (await import(pathToFileURL(path.join(ROOT, 'content/my-language/en-listening.mjs')).href)).default;
// Chỉ item TTS (có `slug`) mới sinh audio; item YouTube (có `youtubeUrl`) bỏ qua.
const items = allItems.filter((it) => it.slug);

const PUBLIC_BASE = (process.env.R2_PUBLIC_URL || 'https://media.cuongthai.com').replace(/\/$/, '');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** Cắt câu ≤ max ký tự, không cắt giữa từ (giống chunkText trong makerlab/tts.ts). */
function chunkText(text, max = 190) {
  const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…])\s+/);
  const chunks = [];
  let cur = '';
  for (const s of sentences) {
    if (s.length > max) {
      if (cur) { chunks.push(cur); cur = ''; }
      let rest = s;
      while (rest.length > max) {
        const cut = rest.lastIndexOf(' ', max);
        const at = cut > max * 0.5 ? cut : max;
        chunks.push(rest.slice(0, at).trim());
        rest = rest.slice(at).trim();
      }
      cur = rest;
      continue;
    }
    if ((cur + ' ' + s).trim().length > max) { chunks.push(cur); cur = s; }
    else cur = (cur + ' ' + s).trim();
  }
  if (cur) chunks.push(cur);
  return chunks.filter(Boolean);
}

/** Google translate_tts: keyless, ~200 ký tự/lần → ghép MP3 (frame-concat hợp lệ). */
async function synthesizeGoogleEN(text) {
  const parts = chunkText(text, 190);
  const out = [];
  for (const part of parts) {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob'
      + `&tl=en&q=${encodeURIComponent(part)}&total=${parts.length}&idx=${out.length}&textlen=${part.length}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://translate.google.com/' } });
    if (!res.ok) throw new Error(`google tts HTTP ${res.status} (chunk ${out.length + 1}/${parts.length})`);
    out.push(Buffer.from(await res.arrayBuffer()));
    await new Promise((r) => setTimeout(r, 350)); // nhẹ tay với endpoint miễn phí
  }
  return { audio: Buffer.concat(out), chunks: parts.length };
}

async function r2Exists(url) {
  const res = await fetch(`${url}?cb=${Date.now()}`, { method: 'GET' }).catch(() => null);
  return !!(res && res.ok);
}

let s3 = null;
async function getS3() {
  if (s3) return s3;
  const { S3Client } = await import('@aws-sdk/client-s3');
  s3 = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: process.env.R2_ENDPOINT_URL,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return s3;
}

console.log(`── en-listening-audio : ${APPLY ? (FORCE ? 'APPLY+FORCE' : 'APPLY') : 'DRY'} · ${items.length} bài ──`);
let ok = 0;
for (const it of items) {
  const key = `audio/my-language/en/${it.slug}.mp3`;
  const url = `${PUBLIC_BASE}/${key}`;

  if (APPLY && !FORCE && (await r2Exists(url))) {
    console.log(`   ⏭  ${it.slug}: đã có trên R2 → ${url}`);
    ok += 1;
    continue;
  }

  const { audio, chunks } = await synthesizeGoogleEN(it.transcript);
  const kb = (audio.length / 1024).toFixed(0);
  // header MP3 hợp lệ? (0xFFEx / ID3) — chống lưu trang lỗi HTML thành .mp3
  const b0 = audio[0], b1 = audio[1];
  const isMp3 = (b0 === 0xff && (b1 & 0xe0) === 0xe0) || (b0 === 0x49 && b1 === 0x44); // FFEx hoặc "ID"
  if (!isMp3) { console.error(`   ✗ ${it.slug}: dữ liệu trả về không phải MP3 (header ${b0?.toString(16)} ${b1?.toString(16)})`); process.exit(1); }
  console.log(`   🔊 ${it.slug}: ${chunks} đoạn · ${kb}KB${APPLY ? '' : ' (dry — chưa upload)'}`);

  if (APPLY) {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    await (await getS3()).send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: audio,
      ContentType: 'audio/mpeg',
      CacheControl: 'public, max-age=2592000',
    }));
    if (!(await r2Exists(url))) { console.error(`   ✗ ${it.slug}: upload xong nhưng đọc lại không được: ${url}`); process.exit(1); }
    console.log(`   ✅ ${it.slug}: đã lên R2 & đọc lại được → ${url}`);
    ok += 1;
  }
}
console.log(`── xong: ${ok}/${items.length} ${APPLY ? 'trên R2' : '(dry)'} ──`);
