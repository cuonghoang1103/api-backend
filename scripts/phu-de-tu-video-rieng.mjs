#!/usr/bin/env node
/**
 * SINH PHỤ ĐỀ CHO VIDEO RIÊNG của khoá (bài giảng tiếng Việt tự dựng, phát từ R2) ⇒
 * content/lesson-transcripts/<courseSlug>.json — thứ `phu-de-video-rieng-seed.mjs` nạp vào
 * `lesson_own_transcripts` mỗi lần deploy, để PHÒNG HỌC VIDEO CÙNG AI đọc được lời giảng.
 *
 *   npx tsx scripts/phu-de-tu-video-rieng.mjs              # mọi video đã gắn vi.url trong content/course-videos
 *   npx tsx scripts/phu-de-tu-video-rieng.mjs --khoa git   # chỉ vài khoá (phẩy để nhiều khoá)
 *   npx tsx scripts/phu-de-tu-video-rieng.mjs --kho        # chỉ in, không ghi tệp
 *
 * ⚠️ PHẢI chạy bằng `tsx`, không phải `node`: id bài ↔ thư mục video lấy bằng cách nạp
 * `src/bai/<id>/kichban.ts` của dự án dựng video (KHOA/CHUONG/BAI.slug) — y như `xuat/lam-bai.mts` làm.
 *
 * Chạy ở MÁY CÓ dữ liệu dựng video (máy Mac): cần
 *   --video-dir  (mặc định ~/Videos/CuongThai-KhoaHoc)         thong-tin.json + phude.vi.srt mỗi bài
 *   --nguon-dir  (mặc định ~/Documents/video-bai-giang)        public/bai/<id>/thoigian.json + src/bai/<id>/kichban.ts
 *
 * Ánh xạ video → bài BẰNG URL: r2Url trong thong-tin.json phải trùng `vi.url` trong content/course-videos/*.mjs
 * (đúng thứ trang học phát). Video chưa gắn vào bản đồ thì bỏ qua — gắn vào bản đồ trước (xuat/gan-web.mts).
 *
 * GỘP chứ không xoá: mục cũ trong tệp JSON mà video không có trên máy này vẫn được GIỮ nếu URL của nó vẫn
 * khớp bản đồ; mục có URL không còn trong bản đồ (video đã thay) thì bị bỏ — phụ đề của video cũ trỏ sai mốc.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chiMucUrl, demTu, dungMuc, vietJson } from './phu-de-tu-video-rieng.lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const mo = (p) => path.resolve(String(p).replace(/^~(?=$|\/)/, os.homedir()));
const VIDEO_DIR = mo(val('--video-dir', '~/Videos/CuongThai-KhoaHoc'));
const NGUON_DIR = mo(val('--nguon-dir', '~/Documents/video-bai-giang'));
const RA_DIR = path.join(ROOT, 'content/lesson-transcripts');
const CHI_KHOA = val('--khoa', '') ? new Set(val('--khoa', '').split(',').map((s) => s.trim()).filter(Boolean)) : null;
const KHO = args.includes('--kho');

const docJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

/** Thời lượng THẬT của một tệp video (ffprobe) — chỉ cần cho bản ghép; không có ffprobe/tệp ⇒ NaN. */
function thoiLuongTep(f) {
  if (!existsSync(f)) return NaN;
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());
  } catch { return NaN; }
}

function timThongTin(d, out = []) {
  if (!existsSync(d)) return out;
  for (const n of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, n.name);
    if (n.isDirectory()) timThongTin(p, out);
    else if (n.name === 'thong-tin.json') out.push(p);
  }
  return out;
}

async function main() {
  // 1. Bản đồ URL → bài, từ chính các tệp seed track video.
  const mapDir = path.join(ROOT, 'content/course-videos');
  const banDo = [];
  for (const f of readdirSync(mapDir).filter((f) => f.endsWith('.mjs')).sort()) {
    banDo.push((await import(pathToFileURL(path.join(mapDir, f)).href)).default);
  }
  const theoUrl = chiMucUrl(banDo);

  // 2. Thư mục bài ↔ id dự án dựng (để tìm thoigian.json).
  const idTheoThuMuc = new Map();
  const baiDir = path.join(NGUON_DIR, 'public/bai');
  if (existsSync(baiDir)) {
    for (const id of readdirSync(baiDir)) {
      const kb = path.join(NGUON_DIR, 'src/bai', id, 'kichban.ts');
      if (!existsSync(kb) || !existsSync(path.join(baiDir, id, 'thoigian.json'))) continue;
      try {
        const m = await import(pathToFileURL(kb).href);
        if (m.KHOA?.slug && m.CHUONG?.slug && m.BAI?.slug) {
          idTheoThuMuc.set(path.join(VIDEO_DIR, m.KHOA.slug, m.CHUONG.slug, m.BAI.slug), id);
        }
      } catch (e) {
        console.warn(`  ⚠ không nạp được kichban của ${id}: ${String(e?.message ?? e).slice(0, 120)}`);
      }
    }
  } else {
    console.warn(`⚠ không thấy ${baiDir} — mọi video sẽ dùng SRT (không có các phần)`);
  }
  const thoiGianCua = (thuMuc) => {
    const id = idTheoThuMuc.get(thuMuc);
    return id ? docJson(path.join(baiDir, id, 'thoigian.json')) : null;
  };

  // 3. Từng video đã lên R2 VÀ đã gắn vào bản đồ.
  const theoKhoa = new Map(); // courseSlug → { lessonSlug → muc }
  let soVideo = 0, chuaGan = 0, boQua = 0;
  for (const p of timThongTin(VIDEO_DIR).sort()) {
    const tt = docJson(p);
    if (!tt.r2Url || tt.boQuaWeb) continue;
    const dich = (theoUrl.get(tt.r2Url) ?? []).filter((d) => !CHI_KHOA || CHI_KHOA.has(d.courseSlug));
    if (!dich.length) { if (!CHI_KHOA) chuaGan++; continue; }

    const thuMuc = path.dirname(p);
    const docSrtTep = (d) => { const f = path.join(d, 'phude.vi.srt'); return existsSync(f) ? readFileSync(f, 'utf8') : ''; };
    const phan = tt.tron && Array.isArray(tt.cacPhan) && tt.cacPhan.length
      ? tt.cacPhan.map((ten) => {
        const d = path.join(path.dirname(thuMuc), ten);
        const ttp = existsSync(path.join(d, 'thong-tin.json')) ? docJson(path.join(d, 'thong-tin.json')) : {};
        return { thoiGian: thoiGianCua(d), thoiLuongGiay: Number(ttp.thoiLuongGiay), thoiLuongVideo: thoiLuongTep(path.join(d, 'video.mp4')) };
      })
      : [{ thoiGian: thoiGianCua(thuMuc), thoiLuongGiay: Number(tt.thoiLuongGiay) }];

    const { muc, canhBao } = dungMuc({ thongTin: tt, srt: docSrtTep(thuMuc), phan });
    const nhan = path.relative(VIDEO_DIR, thuMuc);
    if (!muc) { boQua++; console.warn(`  ⚠ ${nhan}: ${canhBao.join('; ')}`); continue; }
    if (canhBao.length) console.warn(`  ⚠ ${nhan}: ${canhBao.join('; ')}`);
    soVideo++;
    for (const d of dich) {
      if (!theoKhoa.has(d.courseSlug)) theoKhoa.set(d.courseSlug, {});
      theoKhoa.get(d.courseSlug)[d.lessonSlug] = { ...muc, track: d.track };
    }
  }

  // 4. Gộp với tệp cũ rồi ghi (chỉ khi đổi).
  const urlTheoBai = new Map();
  for (const [url, ds] of theoUrl) for (const d of ds) urlTheoBai.set(`${d.courseSlug}/${d.lessonSlug}/${d.track}`, url);
  if (!KHO) mkdirSync(RA_DIR, { recursive: true });
  const cacKhoa = new Set([...theoKhoa.keys(),
    ...(existsSync(RA_DIR) ? readdirSync(RA_DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)) : [])]);
  for (const khoa of [...cacKhoa].sort()) {
    if (CHI_KHOA && !CHI_KHOA.has(khoa)) continue;
    const tep = path.join(RA_DIR, `${khoa}.json`);
    const cu = existsSync(tep) ? docJson(tep).lessons ?? {} : {};
    const lessons = {};
    let giu = 0, bo = 0;
    for (const [slug, m] of Object.entries(cu)) {
      if (urlTheoBai.get(`${khoa}/${slug}/${m.track ?? 'VI'}`) === m.videoUrl) { lessons[slug] = m; giu++; } else bo++;
    }
    const moi = theoKhoa.get(khoa) ?? {};
    for (const [slug, m] of Object.entries(moi)) { lessons[slug] = m; }
    const so = Object.keys(lessons).length;
    if (!so) continue;
    const noiDung = vietJson({ courseSlug: khoa, sinhBoi: 'scripts/phu-de-tu-video-rieng.mjs', lessons });
    const doi = !existsSync(tep) || readFileSync(tep, 'utf8') !== noiDung;
    const cau = Object.values(lessons).reduce((n, m) => n + m.cues.length, 0);
    const coPhan = Object.values(lessons).filter((m) => m.parts.length).length;
    console.log(`${doi ? (KHO ? '~ sẽ ghi' : '✓ ghi') : '= không đổi'} ${path.relative(ROOT, tep)}: ${so} bài`
      + ` (mới/cập nhật ${Object.keys(moi).length}, giữ ${Math.max(0, giu - Object.keys(moi).filter((s) => s in cu).length)}, bỏ ${bo})`
      + ` · ${cau} câu · ${coPhan}/${so} có các phần · ${demTu(Object.values(lessons).flatMap((m) => m.cues))} từ`);
    if (doi && !KHO) writeFileSync(tep, noiDung);
  }
  console.log(`\nvideo đã dựng phụ đề: ${soVideo} · lên R2 mà chưa gắn bản đồ course-videos: ${chuaGan} · bỏ qua: ${boQua}`);
  console.log('Tiếp: commit content/lesson-transcripts/ — deploy sẽ tự nạp (phu-de-video-rieng-seed.mjs).');
}

main().catch((e) => { console.error(e); process.exit(1); });
