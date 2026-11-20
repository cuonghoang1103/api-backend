#!/usr/bin/env node
/**
 * "💻 LỆNH & CODE TRONG VIDEO" (20/11/2026) — lenh.json (trích từ hình video) ⇒ GIẢI THÍCH bằng LLM ⇒
 * content/lesson-commands/<courseSlug>.json, thứ `lenh-video-seed.mjs` nạp vào `lesson_video_commands` mỗi deploy.
 *
 *   LLM_BACKGROUND_ENABLED=true npx tsx scripts/lenh-video.mjs                 # mọi lenh.json trong ~/Videos/CuongThai-KhoaHoc
 *   LLM_BACKGROUND_ENABLED=true npx tsx scripts/lenh-video.mjs --khoa git      # vài khoá (phẩy)
 *   npx tsx scripts/lenh-video.mjs --kho                                       # KHÔNG gọi model: đếm mục + ƯỚC tiền
 *   … --tu <thư mục có *.lenh.json> --ra <thư mục ra>                           # chạy thử ngoài cây thật
 *   … --tran-usd 3 · --toi-da-video 50                                         # trần của MỘT lượt chạy (mặc định 2 $ / ∞)
 *
 * Trước đó: ở dự án video, `bash xuat/lenh/chay.sh <id…>` ghi `lenh.json` cạnh video (thư mục bài trong ~/Videos).
 *
 * CHI PHÍ (purpose `video_lenh` = gpt-6-luna, effort medium — `src/services/llm/gateway.ts`): một video ~15–30 mục ⇒ ~4–8k
 * token vào + ~4–7k ra (gồm token suy luận) ⇒ ~0,02–0,03 $ theo bảng giá ƯỚC của gateway. Video không có lệnh/code nào
 * (bài khái niệm) ⇒ 0 lời gọi. Chạy lại: mục có cùng khoá nội dung (`khoaMuc`) dùng lại giải thích cũ ⇒ 0 $.
 * Rẻ hơn ~4×: LLM_MODEL_VIDEO_LENH=gpt-5.6-luna.
 *
 * An toàn: feature `bulk_gen` ⇒ bị chặn trừ khi LLM_BACKGROUND_ENABLED=true, qua trần MỀM $/ngày của budget.ts, cộng
 * trần riêng của lượt chạy (`--tran-usd`). Bí mật trong lệnh đã được bộ trích thay bằng <…> trước khi tới đây.
 *
 * Ánh xạ video → bài BẰNG URL như phụ đề: `videoUrl` của lenh.json (r2Url của thong-tin.json) phải trùng `vi.url` trong
 * content/course-videos/*.mjs. Chưa gắn bản đồ ⇒ bỏ qua (báo đếm).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chiMucUrl } from './phu-de-tu-video-rieng.lib.mjs';
import { HE_THONG, bocJson, chiaLo, ghepGiai, khoaMuc, noiDungLo, vietJsonLenh } from './lenh-video.lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const mo = (p) => path.resolve(String(p).replace(/^~(?=$|\/)/, os.homedir()));
const VIDEO_DIR = mo(val('--video-dir', '~/Videos/CuongThai-KhoaHoc'));
const TU = val('--tu', '') ? mo(val('--tu')) : null;
const RA_DIR = val('--ra', '') ? mo(val('--ra')) : path.join(ROOT, 'content/lesson-commands');
const CHI_KHOA = val('--khoa', '') ? new Set(val('--khoa').split(',').map((s) => s.trim()).filter(Boolean)) : null;
const KHO = args.includes('--kho');
const TRAN_USD = Number(val('--tran-usd', '2'));
// Sổ chi CỘNG DỒN qua nhiều lượt (--so-chi <tệp>): trần của lượt này = --tran-usd − tổng đã ghi trong sổ.
const SO_CHI = val('--so-chi', '') ? mo(val('--so-chi')) : null;
const DA_CHI = SO_CHI && existsSync(SO_CHI)
  ? readFileSync(SO_CHI, 'utf8').split('\n').reduce((n, d) => n + (Number(/usd=([\d.]+)/.exec(d)?.[1]) || 0), 0) : 0;
const TOI_DA_VIDEO = Number(val('--toi-da-video', 'Infinity'));
// Kho giải thích theo KHOÁ NỘI DUNG (`khoaMuc`), sống ngoài repo: video chưa gắn bản đồ course-videos (link R2 mới chưa
// deploy) vẫn được giải thích trước (`--ca-chua-gan`) — lượt chạy sau khi gắn dùng lại, 0 $.
const CACHE = mo(val('--cache', '~/.cache/cuongthai/lenh-video-giai.json'));
const CA_CHUA_GAN = args.includes('--ca-chua-gan');
const kho = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : { giai: {}, bo: [] };
const khoBo = new Set(kho.bo ?? []);
const luuKho = () => { mkdirSync(path.dirname(CACHE), { recursive: true }); writeFileSync(`${CACHE}.tam`, JSON.stringify(kho)); renameSync(`${CACHE}.tam`, CACHE); };

function timLenh(d, out = []) {
  if (!existsSync(d)) return out;
  for (const n of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, n.name);
    if (n.isDirectory()) timLenh(p, out);
    else if (n.name === 'lenh.json' || n.name.endsWith('.lenh.json')) out.push(p);
  }
  return out;
}

async function main() {
  const banDo = [];
  const mapDir = path.join(ROOT, 'content/course-videos');
  for (const f of readdirSync(mapDir).filter((f) => f.endsWith('.mjs')).sort()) banDo.push((await import(pathToFileURL(path.join(mapDir, f)).href)).default);
  const theoUrl = chiMucUrl(banDo);

  const llm = KHO ? null : (await import('../src/services/interview/llm/index.ts')).llmComplete;
  const { priceOf } = await import('../src/services/llm/gateway.ts');
  const model = process.env.LLM_MODEL_VIDEO_LENH || 'gpt-6-luna';
  const gia = priceOf(model);

  const tep = timLenh(TU ?? VIDEO_DIR).sort();
  const theoKhoa = new Map(); // courseSlug → { lessonSlug → muc }
  const cuCache = new Map(); // courseSlug → lessons cũ (để dùng lại giải thích)
  const docCu = (khoa) => {
    if (!cuCache.has(khoa)) {
      const f = path.join(RA_DIR, `${khoa}.json`);
      cuCache.set(khoa, existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).lessons ?? {} : {});
    }
    return cuCache.get(khoa);
  };
  const tk = { video: 0, cu: 0, chuaGan: 0, rong: 0, goi: 0, dungLai: 0, moi: 0, bo: 0, boChiTiet: 0, boDong: 0, vao: 0, raTok: 0, usd: 0, uocUsd: 0 };
  let dungVi = '';

  for (const f of tep) {
    if (dungVi) break;
    const lj = JSON.parse(readFileSync(f, 'utf8'));
    // URL video = r2Url HIỆN TẠI của thư mục video (cạnh lenh.json, hoặc <video-dir>/<thuMucVideo>) — KHÔNG phải r2Url lúc
    // trích: render xong thì goi-youtube giữ r2Url CŨ tới khi len-r2 tải bản mới. Chỉ nhận khi SRT hiện tại có đúng vân tay
    // lenh.json mang theo (cùng bản render ⇒ cùng mốc); lệch ⇒ video đã render lại sau lần trích ⇒ bỏ, chờ trích lại.
    const thuMuc = [path.dirname(f), lj.thuMucVideo ? path.join(VIDEO_DIR, lj.thuMucVideo) : null]
      .find((d) => d && existsSync(path.join(d, 'thong-tin.json')));
    if (thuMuc) {
      const tt = JSON.parse(readFileSync(path.join(thuMuc, 'thong-tin.json'), 'utf8'));
      const srtF = path.join(thuMuc, 'phude.vi.srt');
      const sha = existsSync(srtF) ? createHash('sha1').update(readFileSync(srtF, 'utf8')).digest('hex') : null;
      if (lj.srtSha && sha && lj.srtSha !== sha) { tk.cu++; console.warn(`  · ${lj.bai}: lenh.json của bản render CŨ (SRT đã đổi) — trích lại rồi chạy lại`); continue; }
      if (tt.tron) { tk.chuaGan++; continue; }
      lj.videoUrl = tt.r2Url ?? null;
    }
    const dich = (theoUrl.get(lj.videoUrl) ?? []).filter((d) => !CHI_KHOA || CHI_KHOA.has(d.courseSlug));
    if (!dich.length) {
      tk.chuaGan++;
      const theoKhoaVideo = !CHI_KHOA || CHI_KHOA.has(lj.khoaWeb ?? '') || [...(CHI_KHOA ?? [])].some((k) => String(lj.thuMucVideo ?? '').startsWith(`${k}/`));
      if (!(CA_CHUA_GAN && theoKhoaVideo)) { console.warn(`  · ${lj.bai}: video chưa gắn bản đồ course-videos (${lj.videoUrl ?? 'không có r2Url'}) — bỏ qua`); continue; }
      console.warn(`  · ${lj.bai}: chưa gắn bản đồ — vẫn giải thích vào kho (--ca-chua-gan)`);
    }
    if (!lj.muc?.length) { tk.rong++; continue; }
    if (tk.video >= TOI_DA_VIDEO) break;
    tk.video++;

    // giải thích cũ theo khoá nội dung (cùng khoá/bài nào cũng được — "git status" giống nhau ở mọi nơi thì khác output)
    const cuTheoKhoa = new Map();
    const boCu = new Set(); // mục model đã bảo bỏ ở lượt trước (không phải lệnh/code) ⇒ không hỏi lại
    for (const d of dich) {
      const cu = docCu(d.courseSlug)[d.lessonSlug];
      for (const it of cu?.items ?? []) if (it.k) cuTheoKhoa.set(it.k, it);
      for (const k of cu?.bo ?? []) boCu.add(k);
    }
    const boMoi = [];
    const items = new Array(lj.muc.length).fill(null);
    const canGoi = [];
    lj.muc.forEach((m, i) => {
      const k = khoaMuc(m);
      const cu = cuTheoKhoa.get(k) ?? (kho.giai[k] ? { ...kho.giai[k], k } : null);
      if (khoBo.has(k) && !cu) { boMoi.push(k); tk.dungLai++; return; }
      if (cu) { items[i] = { ...cu, t: m.t, ...(m.tenCanh ? { canh: m.tenCanh } : {}) }; tk.dungLai++; } else if (boCu.has(k)) { boMoi.push(k); tk.dungLai++; } else canGoi.push(i);
    });

    for (const lo of chiaLo(canGoi.map((i) => ({ ...lj.muc[i], _i: i })))) {
      const user = noiDungLo({ tenBai: lj.tenBai, khoa: lj.khoa }, lo);
      if (KHO) {
        // ước: 1 token ≈ 3,2 ký tự (tiếng Việt + mã) vào; ra ≈ 230 token/mục (kể cả suy luận ~20 %)
        const vao = Math.ceil((HE_THONG.length + user.length) / 3.2), ra = lo.length * 230;
        tk.vao += vao; tk.raTok += ra; tk.uocUsd += (vao * gia.in + ra * gia.out) / 1e6; tk.goi++;
        continue;
      }
      if (DA_CHI + tk.usd >= TRAN_USD) { dungVi = `chạm trần ${TRAN_USD} $ (đã chi trước ${DA_CHI.toFixed(4)} $ + lượt này ${tk.usd.toFixed(4)} $)`; break; }
      let r;
      try {
        r = await llm({
          step: 'generation', purpose: 'video_lenh', feature: 'bulk_gen',
          maxTokens: 12000, maxRetries: 2, timeoutMs: 180_000,
          system: HE_THONG, messages: [{ role: 'user', content: user }],
        });
      } catch (e) {
        console.warn(`  ✗ ${lj.bai}: gọi model hỏng — ${String(e?.message ?? e).slice(0, 200)}`);
        if (/BUDGET|LLM_BACKGROUND_ENABLED|chạy nền/i.test(String(e?.message ?? e) + String(e?.code ?? ''))) { dungVi = String(e?.message ?? e).slice(0, 160); }
        continue;
      }
      tk.goi++; tk.vao += r.inputTokens; tk.raTok += r.outputTokens;
      const p = priceOf(r.model); tk.usd += (r.inputTokens * p.in + r.outputTokens * p.out) / 1e6;
      const j = bocJson(r.text);
      const theoI = new Map((Array.isArray(j?.muc) ? j.muc : []).map((g) => [Number(g?.i), g]));
      lo.forEach((m, k) => {
        const g = ghepGiai(m, theoI.get(k));
        if (!g) { tk.bo++; if (theoI.get(k)?.bo === true) { boMoi.push(khoaMuc(m)); khoBo.add(khoaMuc(m)); kho.bo = [...khoBo]; } return; }
        { const { t: _t, canh: _c, k: kk, ...giu } = g.muc; kho.giai[kk] = giu; }
        tk.boChiTiet += g.bo.chiTiet; tk.boDong += g.bo.dong;
        items[m._i] = g.muc; tk.moi++;
      });
      if (r.biCat) console.warn(`  ⚠ ${lj.bai}: câu trả lời bị cắt (chạm maxTokens) — mục thiếu sẽ chờ lượt sau`);
    }
    if (KHO) continue;
    luuKho();
    const xong = items.filter(Boolean);
    for (const d of dich) {
      if (!theoKhoa.has(d.courseSlug)) theoKhoa.set(d.courseSlug, {});
      theoKhoa.get(d.courseSlug)[d.lessonSlug] = { track: d.track, videoUrl: lj.videoUrl, bai: lj.bai, model, ...(boMoi.length ? { bo: [...new Set(boMoi)].sort() } : {}), items: xong };
    }
    console.log(`  ✓ ${lj.bai} → ${dich.map((d) => `${d.courseSlug}/${d.lessonSlug}`).join(', ')}: ${xong.length}/${lj.muc.length} mục`);
  }

  if (KHO) {
    console.log(`\n[ƯỚC] ${tk.video} video có mục · ${tk.goi} lời gọi · ~${tk.vao} token vào · ~${tk.raTok} ra · ≈ ${tk.uocUsd.toFixed(3)} $ (${model}, giá ước ${gia.in}/${gia.out} $/1M)`
      + ` · dùng lại ${tk.dungLai} mục · chưa gắn ${tk.chuaGan} · rỗng ${tk.rong}`);
    return;
  }
  if (!existsSync(RA_DIR)) mkdirSync(RA_DIR, { recursive: true });
  for (const [khoa, moi] of theoKhoa) {
    const lessons = { ...docCu(khoa), ...moi };
    const f = path.join(RA_DIR, `${khoa}.json`);
    // 21/11: che chuỗi khoá CÔNG KHAI (vân tay SSH, khối PGP) để gitleaks không chặn commit — không phải bí mật nhưng
    // repo cấm --no-verify; đồng thời không đưa vân tay máy dạy lên web.
    const noiDung = vietJsonLenh({ courseSlug: khoa, sinhBoi: 'scripts/lenh-video.mjs', lessons })
      .replace(/SHA256:[A-Za-z0-9+\/]{43}/g, 'SHA256:<vân tay>')
      .replace(/"(?![0-9a-f]{40,64}")[A-Za-z0-9+\/=]{40,}"/g, '"<…>"')   // giữ mã băm git (hex 40/64)
      .replace(/(-u|--user)(\s+|=)([^\s:"']+):([^\s"'@]+)/g, '$1$2$3:<mật khẩu>');   // mật khẩu demo trong curl -u
    const doi = !existsSync(f) || readFileSync(f, 'utf8') !== noiDung;
    if (doi) writeFileSync(f, noiDung);
    console.log(`${doi ? '✓ ghi' : '= không đổi'} ${path.relative(process.cwd(), f)}: ${Object.keys(lessons).length} bài`);
  }
  console.log(`\nvideo ${tk.video} · lời gọi ${tk.goi} · mục mới ${tk.moi} · dùng lại ${tk.dungLai} · model bỏ ${tk.bo}`
    + ` · loại phần-cờ bịa ${tk.boChiTiet} · loại chú-thích-dòng sai ${tk.boDong} · ${tk.vao} token vào / ${tk.raTok} ra ≈ ${tk.usd.toFixed(4)} $ (ước)`
    + ` · chưa gắn ${tk.chuaGan} · bản render cũ ${tk.cu} · rỗng ${tk.rong}${dungVi ? `\n⛔ DỪNG: ${dungVi}` : ''}`);
  if (SO_CHI && tk.goi) {
    const dong = `${new Date().toISOString()} usd=${tk.usd.toFixed(4)} goi=${tk.goi} vao=${tk.vao} ra=${tk.raTok} video=${tk.video} moi=${tk.moi} khoa=${[...theoKhoa.keys()].join(',')} (ước theo bảng giá gateway; cộng dồn ${(DA_CHI + tk.usd).toFixed(4)} $)\n`;
    writeFileSync(SO_CHI, (existsSync(SO_CHI) ? readFileSync(SO_CHI, 'utf8') : '') + dong);
  }
  if (!TU) console.log('Tiếp: commit content/lesson-commands/ — deploy nạp bằng scripts/lenh-video-seed.mjs.');
}

main().then(() => process.exit(process.exitCode ?? 0)).catch((e) => { console.error(e); process.exit(1); });
