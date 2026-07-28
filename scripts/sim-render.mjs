#!/usr/bin/env node
/**
 * Xưởng dựng video cho trang /simulation.
 * ======================================
 *
 * Dựng file **mp4 H.264** từ một kịch bản mô phỏng, KHÔNG quay màn hình.
 *
 * VÌ SAO KHÔNG DÙNG NÚT "QUAY" CÓ SẴN
 * -----------------------------------
 * Nút quay trong trang dùng MediaRecorder theo THỜI GIAN THỰC: máy chậm thì
 * rớt khung, `stop()` vứt phần chưa mã hoá, và Chrome chỉ xuất được `.webm`
 * (VP8/VP9) — định dạng mà iPhone đời cũ không phát được, trong khi bài giảng
 * thì phải xem được trên điện thoại. Nó cũng bắt người dạy ngồi canh từng
 * video một.
 *
 * Ở đây làm ngược lại: trang lộ ra `window.__SIMULATION__.renderAt(ms)` vẽ
 * khung hình tại một mốc thời gian ẢO rồi đóng băng đồng hồ. Ta gọi nó
 * 30 lần cho mỗi giây video, chụp canvas từng khung, rồi để ffmpeg ghép.
 * Kết quả: không bao giờ rớt khung, dựng lại bao nhiêu lần cũng ra file y
 * hệt, và chạy hàng loạt qua đêm được.
 *
 * Đường tiếng dựng riêng bằng `OfflineAudioContext` (xem `sfx.ts`) rồi ghép
 * vào bằng ffmpeg — cùng bộ công thức âm thanh với bản chạy trực tiếp.
 *
 * CÁCH DÙNG
 *   node scripts/sim-render.mjs --scenario nodejs-event-loop
 *   node scripts/sim-render.mjs --group nodejs --lang vi --fps 30
 *   node scripts/sim-render.mjs --scenario nodejs-event-loop --opts demo=io
 *
 * Cần: dev server (hoặc bản build) đang chạy ở `--base`, và `ffmpeg` trong PATH.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/* ── Tham số dòng lệnh ──────────────────────────────────────── */

function parseArgs(argv) {
  const out = {
    base: 'http://localhost:3300',
    lang: 'vi',
    fps: 30,
    // CRF 18 chứ không phải 20. Đo trên chính bài 2.2 (1197 khung 1080p),
    // SSIM giữa video và dãy PNG gốc — riêng VÙNG CHỮ của khung mã, nơi nén
    // làm hỏng trước tiên:
    //   CRF 16 → 2,77 MB/phút · SSIM 0,999088 (toàn khung)
    //   CRF 18 → 2,40 MB/phút · SSIM 0,998775 · vùng chữ 0,998579
    //   CRF 20 → 2,09 MB/phút · SSIM 0,998359 · vùng chữ 0,998072
    //   CRF 23 → 1,72 MB/phút · SSIM 0,997439 · vùng chữ 0,996956
    // 18 đắt hơn 20 khoảng 15% dung lượng mà chữ nét hơn đo được. Cả bộ ~20
    // video bài giảng chỉ tốn ~40MB trên R2 nên không có lý do tiết kiệm ở đây.
    // ĐỪNG hạ keyint xuống 60 để tua mượt: đo được 1,59 MB → 3,81 MB (2,4 lần).
    crf: 18,
    outDir: path.resolve('_render'),
    tailMs: 1500,
    // Video bài giảng chạy CHẬM hơn bản xem trên trang: ở 1× người xem vừa kịp
    // nhìn hình đã sang bước khác, không đọc kịp phụ đề — mà phụ đề chính là
    // lời giảng. 0,75× cho một bước ~1,7s thành ~2,3s. (Thử 0,5× trước, user
    // duyệt 28/7 là "chậm quá một chút" — 0,75× là mức chốt.)
    speed: 0.75,
    scenario: null,
    group: null,
    opts: {},
    keepFrames: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--base') out.base = next();
    else if (a === '--lang') out.lang = next();
    else if (a === '--fps') out.fps = Number(next());
    else if (a === '--crf') out.crf = Number(next());
    else if (a === '--out') out.outDir = path.resolve(next());
    else if (a === '--tail') out.tailMs = Number(next());
    else if (a === '--speed') out.speed = Number(next());
    else if (a === '--scenario') out.scenario = next();
    else if (a === '--group') out.group = next();
    else if (a === '--keep-frames') out.keepFrames = true;
    else if (a === '--opts') {
      for (const pair of next().split(',')) {
        const [k, v] = pair.split('=');
        if (k && v !== undefined) out.opts[k] = v;
      }
    } else if (a === '--help' || a === '-h') {
      console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    }
  }
  return out;
}

const args = parseArgs(process.argv);

/* ── Tiện ích ───────────────────────────────────────────────── */

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, cmdArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => {
      err += d.toString();
    });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} thoát mã ${code}\n${err.slice(-2500)}`))));
  });
}

const pad = (n, w = 5) => String(n).padStart(w, '0');
const human = (ms) => `${(ms / 1000).toFixed(1)}s`;

/**
 * URL của một kịch bản ở chế độ khung trần.
 *
 * `chrome=off` bỏ navbar/robot AI/thanh nhạc toàn cục — chúng là DOM nên
 * không lọt vào canvas, nhưng vẫn che khung khi trang tự cuộn. `loops=1` vì
 * video bài giảng chạy MỘT lượt; lặp là chuyện của trình phát.
 */
function scenarioUrl(scenarioId, opts) {
  const sp = new URLSearchParams({
    scenario: scenarioId,
    lang: args.lang,
    chrome: 'off',
    caption: 'on',
    loops: '1',
    speed: '1',
    ...opts,
  });
  return `${args.base}/simulation?${sp.toString()}`;
}

/* ── Dựng một video ─────────────────────────────────────────── */

async function renderOne(page, scenarioId, opts) {
  const url = scenarioUrl(scenarioId, opts);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => !!window.__SIMULATION__?.renderAt, null, { timeout: 30000 });
  // Font tự lưu trữ phải nạp xong TRƯỚC khung đầu tiên, nếu không vài khung
  // đầu video dùng font dự phòng rồi "nhảy" một nhịp.
  await page.evaluate(() => document.fonts.ready);

  const meta = await page.evaluate(() => window.__SIMULATION__.meta());
  const suffix = Object.entries(opts)
    .map(([k, v]) => `${k}-${v}`)
    .join('_');
  const name = [scenarioId, suffix, args.lang].filter(Boolean).join('__');

  // Thời gian ẢO của kịch bản là cố định; TỐC ĐỘ chỉ đổi số khung ta lấy mẫu
  // trên quãng đó. Ở 0,5× mỗi giây video ứng với nửa giây thời gian kịch bản,
  // nên video dài gấp đôi mà nội dung không đổi một chữ.
  const wallMs = meta.totalDurationMs / args.speed + args.tailMs;
  const frameCount = Math.ceil((wallMs / 1000) * args.fps);
  console.log(`\n▶ ${scenarioId}${suffix ? ` (${suffix})` : ''} — ${meta.stepCount} bước, ${human(meta.totalDurationMs)} @ ${args.speed}× + ${human(args.tailMs)} đuôi = ${human(wallMs)} / ${frameCount} khung`);

  const work = fs.mkdtempSync(path.join(os.tmpdir(), `sim-${scenarioId}-`));

  try {
    // 1. Đường tiếng — dựng ngoại tuyến, nhanh hơn thời gian thực nhiều lần.
    const wavB64 = await page.evaluate((sp) => window.__SIMULATION__.renderAudioWav(sp), args.speed);
    const wavPath = path.join(work, 'audio.wav');
    fs.writeFileSync(wavPath, Buffer.from(wavB64, 'base64'));

    // 2. Khung hình — từng khung một, tất định.
    const t0 = Date.now();
    for (let i = 0; i < frameCount; i++) {
      const ms = ((i * 1000) / args.fps) * args.speed;
      const dataUrl = await page.evaluate((t) => {
        window.__SIMULATION__.renderAt(t);
        return document.querySelector('canvas').toDataURL('image/png');
      }, ms);
      fs.writeFileSync(path.join(work, `f${pad(i)}.png`), Buffer.from(dataUrl.slice(22), 'base64'));
      if (i % 60 === 0 || i === frameCount - 1) {
        const pct = Math.round(((i + 1) / frameCount) * 100);
        process.stdout.write(`\r   khung ${i + 1}/${frameCount} (${pct}%)   `);
      }
    }
    process.stdout.write(`\r   ${frameCount} khung xong trong ${human(Date.now() - t0)}          \n`);

    // 3. Đóng gói. yuv420p + faststart là hai thứ quyết định video có phát
    //    được trên iOS Safari và có bắt đầu phát ngay khi tải hay không.
    fs.mkdirSync(args.outDir, { recursive: true });
    const outFile = path.join(args.outDir, `${name}.mp4`);
    await run('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-framerate', String(args.fps),
      '-i', path.join(work, 'f%05d.png'),
      '-i', wavPath,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf),
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k',
      '-shortest', '-movflags', '+faststart',
      outFile,
    ]);

    const size = fs.statSync(outFile).size;
    const probe = await probeDuration(outFile);
    console.log(`   ✓ ${outFile} — ${(size / 1048576).toFixed(1)} MB, ${probe.toFixed(2)}s`);

    return {
      scenarioId,
      options: opts,
      lang: args.lang,
      file: outFile,
      bytes: size,
      durationSeconds: Math.round(probe),
      lesson: meta.lesson,
      name: meta.name,
      speed: args.speed,
    };
  } finally {
    if (!args.keepFrames) fs.rmSync(work, { recursive: true, force: true });
    else console.log(`   (giữ khung hình ở ${work})`);
  }
}

/** Thời lượng thật của file, đọc bằng ffprobe — không tin vào phép tính. */
function probeDuration(file) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
    let out = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.on('error', reject);
    p.on('close', () => resolve(Number(out.trim()) || 0));
  });
}

/* ── Chạy ───────────────────────────────────────────────────── */

async function main() {
  if (!args.scenario && !args.group) {
    console.error('Cần --scenario <id> hoặc --group <id>. Xem --help.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1200 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('   ! lỗi trang:', e.message));

  const results = [];
  try {
    let list;
    if (args.scenario) {
      list = [{ id: args.scenario, opts: args.opts }];
    } else {
      // Hỏi chính trang xem mục này có những kịch bản nào — sổ đăng ký nằm
      // trong bundle, không việc gì phải chép lại danh sách ở đây.
      await page.goto(`${args.base}/simulation?chrome=off`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => !!window.__SIMULATION__);
      const ids = await page.evaluate(() => window.__SIMULATION_SCENARIOS__ ?? []);
      list = ids.filter((s) => s.group === args.group).map((s) => ({ id: s.id, opts: args.opts }));
      if (list.length === 0) {
        throw new Error(`Mục "${args.group}" không có kịch bản nào (trang trả về ${ids.length} kịch bản).`);
      }
    }

    for (const item of list) {
      results.push(await renderOne(page, item.id, item.opts));
    }
  } finally {
    await browser.close();
  }

  // Bản kê để bước tải lên R2 + vá giáo trình đọc, thay vì đoán tên file.
  fs.mkdirSync(args.outDir, { recursive: true });
  const manifest = path.join(args.outDir, 'manifest.json');
  fs.writeFileSync(manifest, JSON.stringify({ renderedAt: new Date().toISOString(), fps: args.fps, speed: args.speed, videos: results }, null, 2));
  console.log(`\n✓ Xong ${results.length} video. Bản kê: ${manifest}`);
}

main().catch((e) => {
  console.error('\n✗', e.message);
  process.exit(1);
});
