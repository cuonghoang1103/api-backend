#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * MÁY KIỂM thư viện "Học mỗi ngày" (src/services/techTrends/hocFeed/thuVien.ts).
 *
 *   npx tsx scripts/feed-hoc-kiem.ts              # chạy lại code + kiểm cấu trúc
 *   npx tsx scripts/feed-hoc-kiem.ts --url        # + gõ lại MỌI URL nguồn (mạng)
 *   npx tsx scripts/feed-hoc-kiem.ts --anh <dir>  # + xuất ảnh bìa ra <dir> để soát mắt
 *
 * Luật (đỏ = exit 1):
 *   • code `node`     : stdout phải KHỚP `out` (bỏ khoảng trắng cuối dòng)
 *   • code `node-loi` : stderr phải CHỨA `out`
 *   • code `python`   : như node; máy không có python3 ⇒ BỎ QUA (vàng)
 *   • code `khong`    : KHÔNG được có `out` (không chạy thì không được khoe output)
 *   • code `pg`       : ghi tay từ PostgreSQL thật — báo vàng để người soát biết
 *   • id không trùng; mỗi bài ≥1 nguồn; poll có đáp án hợp lệ + có khối `dapan`
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { THU_VIEN } from '../src/services/techTrends/hocFeed/thuVien.js';
import { dungSvg } from '../src/services/techTrends/hocFeed/veAnh.js';

const args = process.argv.slice(2);
const kiemUrl = args.includes('--url');
const anhIdx = args.indexOf('--anh');
const anhDir = anhIdx >= 0 ? args[anhIdx + 1] : null;

let loi = 0;
let canh = 0;
const do_ = (m: string) => { loi++; console.log(`  ✗ ${m}`); };
const vang = (m: string) => { canh++; console.log(`  ⚠ ${m}`); };
const chuan = (s: string) => s.replace(/[ \t]+$/gm, '').trim();

const coPython = spawnSync('python3', ['--version']).status === 0;
const tmp = mkdtempSync(join(tmpdir(), 'feed-hoc-'));

const ids = new Set<string>();
for (const b of THU_VIEN) {
  console.log(`• ${b.id} [${b.nhom} · ${b.dinhDang}]`);
  if (ids.has(b.id)) do_('id trùng');
  ids.add(b.id);
  if (!b.nguon.length) do_('thiếu nguồn');
  if (b.poll) {
    if (b.poll.dung < 0 || b.poll.dung >= b.poll.luaChon.length) do_('poll.dung ngoài phạm vi');
    if (!b.khoi.some((k) => k.k === 'dapan')) do_('có poll mà không có khối dapan');
  }
  for (const [i, k] of b.khoi.entries()) {
    if (k.k !== 'code') continue;
    const nhan = `khối code #${i} (${k.chay})`;
    if (k.chay === 'khong') { if (k.out) do_(`${nhan}: không chạy mà có out`); continue; }
    if (k.chay === 'pg') { vang(`${nhan}: output PostgreSQL ghi tay — soát bằng mắt`); continue; }
    if (!k.out) { do_(`${nhan}: thiếu out`); continue; }
    if (k.chay === 'python' && !coPython) { vang(`${nhan}: máy không có python3, bỏ qua`); continue; }
    const file = join(tmp, `${b.id}-${i}.${k.chay === 'python' ? 'py' : 'mjs'}`);
    writeFileSync(file, k.src);
    const r = spawnSync(k.chay === 'python' ? 'python3' : process.execPath, [file], { encoding: 'utf8', timeout: 10_000 });
    if (k.chay === 'node-loi') {
      if (!r.stderr.includes(k.out)) do_(`${nhan}: stderr không chứa lỗi mong đợi\n      có: ${r.stderr.split('\n').find((l) => /Error/.test(l)) ?? r.stderr.slice(0, 200)}`);
    } else if (chuan(r.stdout) !== chuan(k.out)) {
      do_(`${nhan}: output lệch\n      mong: ${JSON.stringify(chuan(k.out))}\n      thật: ${JSON.stringify(chuan(r.stdout))}${r.stderr ? `\n      stderr: ${r.stderr.slice(0, 200)}` : ''}`);
    }
  }
}
rmSync(tmp, { recursive: true, force: true });

if (kiemUrl) {
  console.log('\n— Gõ lại URL nguồn —');
  const urls = new Set<string>();
  for (const b of THU_VIEN) for (const n of [...b.nguon, ...(b.hocThem ?? [])]) urls.add(n.url);
  for (const b of THU_VIEN) if (b.anh.mau === 'anh') urls.add(b.anh.url);
  for (const u of urls) {
    try {
      const res = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 cuongthai-feed-check' }, signal: AbortSignal.timeout(20_000) });
      // cuongthai.com/courses/* luôn trả 200 (SPA) ⇒ kiểm khoá qua API thật.
      let ok = res.ok;
      const m = u.match(/^https:\/\/cuongthai\.com\/courses\/([a-z0-9-]+)$/);
      if (m) {
        const api = await fetch(`https://cuongthai.com/api/v1/courses/${m[1]}`, { signal: AbortSignal.timeout(20_000) });
        ok = api.ok && ((await api.json()) as { success?: boolean }).success === true;
      }
      if (u.startsWith('https://www.youtube.com/watch')) {
        const o = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(20_000) });
        ok = o.ok;
      }
      if (ok) console.log(`  ✓ ${u}`);
      else do_(`${res.status} ${u}`);
    } catch (e) {
      do_(`lỗi mạng ${u}: ${(e as Error).message}`);
    }
  }
}

if (anhDir) {
  const sharp = (await import('sharp')).default;
  mkdirSync(anhDir, { recursive: true });
  for (const b of THU_VIEN) {
    for (const [k, d] of dungSvg(b.anh).entries()) {
      await sharp(Buffer.from(d.svg)).png().toFile(join(anhDir, `${b.id}-${k + 1}.png`));
    }
  }
  console.log(`\nẢnh xem thử: ${anhDir}`);
}

console.log(`\n${THU_VIEN.length} bài · ${loi} lỗi · ${canh} cảnh báo`);
process.exit(loi ? 1 : 0);
