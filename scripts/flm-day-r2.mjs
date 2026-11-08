/**
 * flm-day-r2.mjs — đẩy ảnh slide FLM mà MÁY THUÊ đã dựng lên R2, KHÔNG đặt khoá R2 lên máy thuê.
 *
 *   node --env-file=.env scripts/flm-day-r2.mjs --host thue3 --kho-xa '~/flm-tai/kho' --kho ~/Documents/FLM-nguon/_kho [--vong]
 *
 * Mỗi môn trên máy thuê có <kho-xa>/<MÃ>/slide-map.cho-day.json + _slide/<deck>/NNN.webp
 * (scripts/flm-tai-lieu.py --khong-day). Mac (giữ khoá):
 *   1. liệt kê file ảnh qua ssh;
 *   2. ký link PUT (hạn 3 giờ, đúng Content-Type + Cache-Control) cho từng ảnh;
 *   3. gửi danh sách qua stdin, máy thuê curl PUT song song 16 luồng — khoá không rời Mac;
 *   4. kiểm từng ảnh bằng HeadObject trên API R2 (KHÔNG GET qua media.cuongthai.com: CDN sẽ cache 404 một năm);
 *   5. đủ ⇒ kéo slide-map + muc-luc + text về <kho>/<MÃ>/, ghi slide-map.json, xoá _slide trên máy thuê.
 * --vong: lặp mỗi 2 phút tới khi không còn môn chờ và có file <kho>/_dung-day.
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const HOST = val('--host', 'thue3');
const XA = val('--kho-xa', '~/flm-tai/kho');
const KHO = val('--kho', '~/Documents/FLM-nguon/_kho').replace(/^~/, os.homedir());
const VONG = args.includes('--vong');
const B = process.env.R2_BUCKET_NAME;
const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto', endpoint: process.env.R2_ENDPOINT_URL,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const ssh = (cmd, input) => {
  const r = spawnSync('ssh', ['-o', 'ConnectTimeout=20', HOST, cmd], { input, maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(`ssh ${cmd.slice(0, 60)}: ${r.stderr}`);
  return r.stdout.toString();
};
const log = (s) => console.log(`[${new Date().toTimeString().slice(0, 8)}] ${s}`);

async function mon(ma) {
  const map = JSON.parse(ssh(`cat ${XA}/${ma}/slide-map.cho-day.json`));
  const files = ssh(`cd ${XA}/${ma}/_slide && find . -name '*.webp' -printf '%P\\t%s\\n'`).trim().split('\n').filter(Boolean).map((l) => { const [p, s] = l.split('\t'); return { p, s: +s }; });
  const can = map.decks.reduce((a, d) => a + (d.n || 0), 0);
  if (files.length !== can) throw new Error(`${ma}: máy thuê có ${files.length} ảnh, bản đồ ghi ${can}`);
  const key = (p) => `images/academy/${map.prefix}/${p}`;
  // bỏ ảnh đã có đúng kích thước (chạy lại an toàn)
  const thieu = [];
  for (let i = 0; i < files.length; i += 32) {
    await Promise.all(files.slice(i, i + 32).map(async (f) => {
      try { const h = await s3.send(new HeadObjectCommand({ Bucket: B, Key: key(f.p) })); if (h.ContentLength === f.s) return; } catch {}
      thieu.push(f);
    }));
  }
  if (thieu.length) {
    const lines = [];
    for (const f of thieu) {
      const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: B, Key: key(f.p), ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }), { expiresIn: 3 * 3600 });
      lines.push(`${f.p}\t${url}`);
    }
    const out = ssh(`cd ${XA}/${ma}/_slide && rm -f ../_put.loi && while IFS=$'\\t' read -r f u; do printf '%s\\t%s\\n' "$f" "$u"; done | xargs -P 16 -d '\\n' -n 1 sh -c 'f=$(printf %s "$1" | cut -f1); u=$(printf %s "$1" | cut -f2-); curl -sS -f --retry 3 -X PUT -H "Content-Type: image/webp" -H "Cache-Control: public, max-age=31536000, immutable" --data-binary @"$f" "$u" -o /dev/null || echo "$f" >> ../_put.loi' _; test -f ../_put.loi && wc -l < ../_put.loi || echo 0`, lines.join('\n') + '\n');
    if (+out.trim() > 0) throw new Error(`${ma}: ${out.trim()} ảnh PUT hỏng — chạy lại sẽ thử lại`);
  }
  // kiểm lại toàn bộ trên API R2
  let sai = 0;
  for (let i = 0; i < files.length; i += 32) {
    await Promise.all(files.slice(i, i + 32).map(async (f) => {
      try { const h = await s3.send(new HeadObjectCommand({ Bucket: B, Key: key(f.p) })); if (h.ContentLength !== f.s) sai++; } catch { sai++; }
    }));
  }
  if (sai) throw new Error(`${ma}: ${sai} ảnh chưa khớp trên R2`);
  // kéo phần nhẹ về Mac
  const dich = path.join(KHO, ma);
  fs.mkdirSync(dich, { recursive: true });
  execFileSync('rsync', ['-a', '--exclude', '_slide', `${HOST}:${XA.replace(/^~\//, '')}/${ma}/`, `${dich}/`], { stdio: 'pipe' });
  fs.writeFileSync(path.join(dich, 'slide-map.json'), JSON.stringify(map, null, 1));
  ssh(`rm -rf ${XA}/${ma}/_slide ${XA}/${ma}/_put.loi && mv ${XA}/${ma}/slide-map.cho-day.json ${XA}/${ma}/slide-map.da-day.json`);
  return `${files.length} ảnh (${thieu.length} mới) · ${(files.reduce((a, f) => a + f.s, 0) / 1e6).toFixed(0)} MB`;
}

async function vong() {
  const ds = ssh(`cd ${XA} 2>/dev/null && ls */slide-map.cho-day.json 2>/dev/null | cut -d/ -f1 || true`).trim().split('\n').filter(Boolean);
  for (const ma of ds) {
    try { log(`✓ ${ma}: ${await mon(ma)}`); } catch (e) { log(`⛔ ${e.message}`); }
  }
  return ds.length;
}

do {
  const n = await vong();
  if (!VONG) break;
  if (!n && fs.existsSync(path.join(KHO, '_dung-day'))) break;
  await new Promise((r) => setTimeout(r, 120000));
} while (true);
