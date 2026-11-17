#!/usr/bin/env node
/**
 * SINH PHỤ ĐỀ CHO VIDEO RIÊNG của khoá (bài giảng tiếng Việt tự dựng, phát từ R2) ⇒
 * content/lesson-transcripts/<courseSlug>.json — thứ `phu-de-video-rieng-seed.mjs` nạp vào
 * `lesson_own_transcripts` mỗi lần deploy, để PHÒNG HỌC VIDEO CÙNG AI đọc được lời giảng.
 *
 *   node scripts/phu-de-tu-video-rieng.mjs              # mọi video đã gắn vi.url trong content/course-videos
 *   node scripts/phu-de-tu-video-rieng.mjs --khoa git   # chỉ vài khoá (phẩy để nhiều khoá)
 *   node scripts/phu-de-tu-video-rieng.mjs --kho        # chỉ in, không ghi tệp
 *   PHUDE_BO_QUA=obj-,sio- node scripts/phu-de-tu-video-rieng.mjs   # bỏ hẳn kịch bản các tiền tố này (mục lục chia theo câu)
 *
 * id bài ↔ thư mục video lấy bằng cách nạp `src/bai/<id>/kichban.ts` của dự án dựng video (KHOA/CHUONG/BAI.slug) — y như
 * `xuat/lam-bai.mts`. Việc nạp chạy trong TIẾN TRÌNH CON `node --import tsx scripts/phu-de-doc-kichban.mjs` theo lô
 * (17/11/2026 — nạp cả nghìn kịch bản trong một tiến trình làm nổ heap luồng hook của tsx), nên chạy bằng `node` là đủ.
 *
 * MỤC LỤC (`parts`) có cho MỌI video (17/11/2026): cảnh của thoigian.json, hoặc cảnh của kịch bản căn theo SRT, gộp thành
 * chương 1–4 phút; không có cảnh ⇒ chia theo câu chuyển ý. Xem `chiaChuong` trong lib.
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

  // 2. Thư mục bài ↔ id dự án dựng (để tìm thoigian.json — hoặc ít nhất danh sách CẢNH của kịch bản).
  //
  // ⚠️ 17/11/2026: trước đây chỉ nhận id CÓ public/bai/<id>/thoigian.json. Video dựng trên máy thuê / máy Linux để
  // thoigian.json ở máy đó ⇒ 0/78 bài api-design có mục lục. Nay nhận MỌI id có kichban.ts: thiếu thoigian.json thì
  // dùng `CANH` của kịch bản (tên cảnh + câu mở cảnh, không mốc) — `canCanhTheoSrt` căn mốc theo SRT của video thật.
  // Hai id cùng trỏ một thư mục (bản nháp `_x`, bản dựng lại) ⇒ ưu tiên id CÓ thoigian.json, rồi id không có `_`.
  const BO_QUA = (process.env.PHUDE_BO_QUA ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  const idTheoThuMuc = new Map();
  const baiDir = path.join(NGUON_DIR, 'public/bai');
  const srcDir = path.join(NGUON_DIR, 'src/bai');
  const coThoiGian = (id) => existsSync(path.join(baiDir, id, 'thoigian.json'));
  const hang = (id) => (coThoiGian(id) ? 2 : 0) + (id.startsWith('_') ? 0 : 1);
  /* Kịch bản KHÔNG có thoigian.json chỉ nạp khi nó có thể là của một video đang cần: tên thư mục bài (BAI.slug) phải
     xuất hiện nguyên văn trong tệp. Nạp hết 3.600+ kịch bản thì vài tệp nặng (dbi-cau-noi…) làm nổ heap cả tiến trình. */
  const thuMucCan = new Set();
  for (const p of timThongTin(VIDEO_DIR)) {
    try {
      const tt = docJson(p);
      if (!tt.r2Url || tt.boQuaWeb) continue;
      const dich = (theoUrl.get(tt.r2Url) ?? []).filter((d) => !CHI_KHOA || CHI_KHOA.has(d.courseSlug));
      if (!dich.length) continue;
      thuMucCan.add(path.basename(path.dirname(p)));
      for (const ten of Array.isArray(tt.cacPhan) ? tt.cacPhan : []) thuMucCan.add(String(ten));
    } catch { /* thong-tin.json hỏng — bước 3 sẽ báo */ }
  }
  const coTheCan = (kb) => {
    const chu = readFileSync(kb, 'utf8');
    for (const m of chu.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)) if (thuMucCan.has(m[1])) return true;
    return false;
  };
  if (existsSync(srcDir)) {
    // PHUDE_BO_QUA=id1,tien-to- (khớp id hoặc tiền tố kết thúc bằng '-'): bỏ hẳn những kịch bản biết là nạp không nổi.
    const can = readdirSync(srcDir).sort().filter((id) => {
      if (BO_QUA.some((b) => id === b || (b.endsWith('-') && id.startsWith(b)))) return false;
      const kb = path.join(srcDir, id, 'kichban.ts');
      return existsSync(kb) && (coThoiGian(id) || coTheCan(kb));
    });
    // Nạp theo LÔ, mỗi lô một tiến trình con — xem đầu `phu-de-doc-kichban.mjs` vì sao (heap luồng hook của tsx).
    const docLo = (lo) => execFileSync(
      process.execPath,
      ['--import', 'tsx', path.join(ROOT, 'scripts/phu-de-doc-kichban.mjs'), NGUON_DIR, ...lo],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] },
    );
    const LO = 120;
    for (let i = 0; i < can.length; i += LO) {
      const lo = can.slice(i, i + LO);
      // PHUDE_DEM=1 in tiến độ.
      if (process.env.PHUDE_DEM) console.error(`  · kịch bản ${i + 1}–${i + lo.length}/${can.length}`);
      let ra = '';
      try { ra = docLo(lo); } catch {
        // Cả lô chết (thường một tệp làm nổ bộ nhớ) ⇒ thử lại từng tệp, chỉ bỏ đúng tệp hỏng.
        for (const id of lo) {
          try { ra += docLo([id]); } catch { console.warn(`  ⚠ kịch bản ${id} làm sập tiến trình nạp — bỏ qua (thêm vào PHUDE_BO_QUA cho nhanh)`); }
        }
      }
      for (const dong of ra.split('\n').filter(Boolean)) {
        const k = JSON.parse(dong);
        const thuMuc = path.join(VIDEO_DIR, k.khoa, k.chuong, k.bai);
        const cu = idTheoThuMuc.get(thuMuc);
        if (cu && hang(cu.id) >= hang(k.id)) continue;
        idTheoThuMuc.set(thuMuc, { id: k.id, canh: k.canh });
      }
    }
  } else {
    console.warn(`⚠ không thấy ${srcDir} — mọi video sẽ dùng SRT, mục lục chia theo câu`);
  }
  /** thoigian.json (có mốc); thiếu ⇒ cảnh của kịch bản (KHÔNG mốc — `dungMuc` sẽ căn theo SRT). */
  const thoiGianCua = (thuMuc) => {
    const x = idTheoThuMuc.get(thuMuc);
    if (!x) return null;
    if (coThoiGian(x.id)) return docJson(path.join(baiDir, x.id, 'thoigian.json'));
    if (!x.canh?.length) return null;
    return {
      chiKichBan: true,
      canh: x.canh.map((c) => ({ id: c?.id, ten: c?.ten, cau: (c?.cau ?? []).map((k) => ({ hien: k?.hien })) })),
    };
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
    const tuCanh = Object.values(lessons).filter((m) => m.nguonPhan === 'canh').length;
    console.log(`${doi ? (KHO ? '~ sẽ ghi' : '✓ ghi') : '= không đổi'} ${path.relative(ROOT, tep)}: ${so} bài`
      + ` (mới/cập nhật ${Object.keys(moi).length}, giữ ${Math.max(0, giu - Object.keys(moi).filter((s) => s in cu).length)}, bỏ ${bo})`
      + ` · ${cau} câu · ${coPhan}/${so} có mục lục (${tuCanh} theo cảnh) · ${demTu(Object.values(lessons).flatMap((m) => m.cues))} từ`);
    if (doi && !KHO) writeFileSync(tep, noiDung);
  }
  console.log(`\nvideo đã dựng phụ đề: ${soVideo} · lên R2 mà chưa gắn bản đồ course-videos: ${chuaGan} · bỏ qua: ${boQua}`);
  console.log('Tiếp: commit content/lesson-transcripts/ — deploy sẽ tự nạp (phu-de-video-rieng-seed.mjs).');
}

main().catch((e) => { console.error(e); process.exit(1); });
