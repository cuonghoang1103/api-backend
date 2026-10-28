/**
 * Bài hướng dẫn từng bước của phòng lab (/cpu-lab, /os-lab) — công cụ cho bước dựng video.
 *
 *   npx tsx scripts/labs-tours.mts --measure http://localhost:3311   # chạy MỌI tour ở chế độ quay (?record=1) trong
 *                                                                    # Chromium thật, ghi mốc thời gian từng bước vào
 *                                                                    # src/components/labs/tours.timing.json; tour nào
 *                                                                    # kẹt / thiếu hành động ⇒ thoát mã 1
 *   npx tsx scripts/labs-tours.mts --md                              # viết src/components/labs/TOURS.md (dòng thời gian
 *                                                                    # danh nghĩa + số đo thật nếu có tours.timing.json)
 *   npx tsx scripts/labs-tours.mts --md --check                      # TOURS.md có khớp mã không (không ghi)
 *
 * Playwright lấy từ node_modules ở gốc repo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOURS } from '../src/components/labs/tour/index.ts';
import { LABS } from '../src/components/labs/registry.ts';
import { ACT_GAP, QUIZ_MS, actsMs, stepMs, type Tour, type TourAct } from '../src/components/labs/tour/types.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const LABS_DIR = path.join(here, '../src/components/labs');
const TIMING = path.join(LABS_DIR, 'tours.timing.json');
const MD = path.join(LABS_DIR, 'TOURS.md');
const START_DELAY = 900; // LabShell đợi 900 ms sau khi gắn rồi mới bắt đầu tour ở chế độ quay

interface Measured { id: string; lang: string; totalMs: number; steps: Array<{ idx: number; t: number }>; quizAt: number; doneAt: number; sfx: Array<{ t: number; name: string }> }

const urlOf = (t: Tour, lang = 'vi') => `${LABS[t.ns].gallery}?record=1&tour=${t.id}&lang=${lang}`;
const act = (a: TourAct) => `${a.a}${a.v !== undefined ? `(${JSON.stringify(a.v)})` : ''}${a.upTo ? ` ×≤${a.upTo}` : ''}${a.delay ? ` +${a.delay}ms` : ''}`;
const sec = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

/** Dòng thời gian danh nghĩa ở rate 1 (không tính thời gian mô phỏng tự chạy khi "Chạy" — cột số đo có số thật). */
function nominal(t: Tour, lang: 'vi' | 'en') {
  let at = START_DELAY;
  return t.steps.map((st, idx) => {
    const dwell = stepMs(st, lang);
    const doMs = actsMs(st.do);
    const len = st.task ? doMs + dwell * 0.35 + actsMs(st.task.solve) + Math.max(dwell * 0.25, 600) : Math.max(dwell, doMs + 600);
    const row = { idx, at, len: Math.round(len), dwell };
    at += len;
    return row;
  });
}

async function measure(base: string) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const out: Measured[] = [];
  const bad: string[] = [];
  const queue = [...TOURS];
  const worker = async () => {
    for (let t = queue.shift(); t; t = queue.shift()) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p = await ctx.newPage();
      const errs: string[] = [];
      p.on('pageerror', (e) => errs.push(e.message));
      try {
        await p.goto(base + urlOf(t), { waitUntil: 'domcontentloaded', timeout: 180000 });
        await p.waitForFunction(() => document.documentElement.dataset.labTour === 'done', null, { timeout: 300000 });
        const r = await p.evaluate(() => {
          const w = window as unknown as { __labTour: { stuck: string[]; missing: string[] }; __labTourLog: Array<{ t: number; idx: number; phase: string }>; __labSfxLog?: Array<{ t: number; name: string }> };
          return { tour: w.__labTour, log: w.__labTourLog, sfx: w.__labSfxLog ?? [] };
        });
        if (r.tour.stuck.length || r.tour.missing.length) bad.push(`${t.id}: stuck ${r.tour.stuck.join(',')} missing ${r.tour.missing.join(',')}`);
        if (errs.length) bad.push(`${t.id}: page errors ${errs.join(' | ').slice(0, 300)}`);
        const steps = r.log.filter((x) => x.phase === 'step').map((x) => ({ idx: x.idx, t: x.t + START_DELAY }));
        const quizAt = (r.log.find((x) => x.phase === 'quiz')?.t ?? 0) + START_DELAY;
        const doneAt = (r.log.find((x) => x.phase === 'done')?.t ?? 0) + START_DELAY;
        out.push({ id: t.id, lang: 'vi', totalMs: doneAt, steps, quizAt, doneAt, sfx: r.sfx });
        console.log(`✓ ${t.id} ${sec(doneAt)}`);
      } catch (e) {
        bad.push(`${t.id}: ${(e as Error).message.split('\n')[0]}`);
        console.log(`✗ ${t.id}`);
      } finally { await ctx.close(); }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  await browser.close();
  out.sort((a, b) => TOURS.findIndex((t) => t.id === a.id) - TOURS.findIndex((t) => t.id === b.id));
  fs.writeFileSync(TIMING, JSON.stringify({ measuredAt: new Date().toISOString().slice(0, 10), base: 'record=1, rate=1, viewport 1280×800, lang=vi', tours: out }, null, 1) + '\n');
  if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
}

function md(): string {
  const timing: { measuredAt?: string; tours?: Measured[] } = fs.existsSync(TIMING) ? JSON.parse(fs.readFileSync(TIMING, 'utf8')) : {};
  const M = new Map((timing.tours ?? []).map((x) => [x.id, x]));
  const L: string[] = [];
  L.push('# Hướng dẫn từng bước của phòng lab — dòng thời gian cho video');
  L.push('');
  L.push('> Tệp này SINH TỰ ĐỘNG bởi `npx tsx scripts/labs-tours.mts --md` (từ `frontend/`). Đừng sửa tay — sửa kịch bản ở');
  L.push('> `tour/tours-cpu.ts`, `tour/tours-os.ts` rồi chạy lại. Số đo thật: `--measure <base-url>` ghi `tours.timing.json`.');
  L.push('');
  L.push('## Cách quay một tour');
  L.push('');
  L.push('1. Mở `<site>/<cpu-lab|os-lab>?record=1&tour=<id>&lang=vi` (thêm `&rate=2` để chạy nhanh gấp đôi khi thử). Chế độ quay chỉ còn');
  L.push('   mô phỏng trên nền phẳng (che hết thanh điều hướng của site), tour tự bắt đầu sau 0,9 s và tự đi hết, không ngẫu nhiên');
  L.push('   (phòng máy "bí ẩn" luôn là sự cố đầu tiên). Viewport khuyên dùng 1280×800 (16:9 sau khi cắt) hoặc 1080×1350 (dọc).');
  L.push('2. Playwright: `page.goto(url)` → quay màn hình → chờ `document.documentElement.dataset.labTour === "done"` → dừng quay.');
  L.push('   Trạng thái sống: `window.__labTour = { id, idx, total, phase, stuck, missing }` (`stuck`/`missing` rỗng = tour chạy đúng).');
  L.push('3. Mốc thời gian thật của từng bước: `window.__labTourLog = [{ t, idx, phase }]` (ms, tính từ lúc tour bắt đầu — cộng 900 ms');
  L.push('   nếu tính từ lúc trang mở). Remotion dùng mốc này để chèn lời đọc / phụ đề đúng bước.');
  L.push('4. Âm thanh: quay màn hình không thu tiếng. Mọi tiếng "cute" phát ra (kể cả khi tắt loa) được ghi ở');
  L.push('   `window.__labSfxLog = [{ t, name }]` — Remotion chèn lại bằng cùng bộ tổng hợp (`labs/sfx.ts`, tên tiếng → nốt) hoặc tệp tiếng tương ứng.');
  L.push('5. Mỗi bước: tour tự làm `do` (đặt bit, nạp chương trình, nhảy vi bước…), đọc lời trong thẻ; bước có việc thì chờ 35% thời');
  L.push('   lượng rồi tự "làm giúp", chờ điều kiện đạt, nghỉ thêm 25%. Cuối tour: câu hỏi hiện 2,6 s rồi tự chọn đáp án đúng, giữ tới 7 s.');
  L.push('');
  L.push(`Thời lượng danh nghĩa một bước = 1,2 s + 62 ms × số ký tự (tiêu đề + lời), kẹp 3,5–11 s; khoảng nghỉ giữa hai hành động ${ACT_GAP} ms; câu hỏi ${QUIZ_MS / 1000} s.`);
  if (timing.measuredAt) L.push(`Số đo thật: ${timing.measuredAt} (${(timing as { base?: string }).base ?? ''}).`);
  L.push('');
  L.push('## Mục lục');
  L.push('');
  L.push('| tour | phòng lab | mô phỏng | bước | danh nghĩa (vi) | đo thật (vi) | URL quay |');
  L.push('|---|---|---|---|---|---|---|');
  for (const t of TOURS) {
    const n = nominal(t, 'vi');
    const last = n[n.length - 1];
    const m = M.get(t.id);
    L.push(`| [${t.id}](#${t.id}) | ${t.ns} | ${t.sim} | ${t.steps.length} | ${sec(last.at + last.len + QUIZ_MS)} | ${m ? sec(m.totalMs) : '—'} | \`${urlOf(t)}\` |`);
  }
  for (const t of TOURS) {
    const n = nominal(t, 'vi'), ne = nominal(t, 'en');
    const m = M.get(t.id);
    L.push('');
    L.push(`## ${t.id}`);
    L.push('');
    L.push(`**${t.title[1]}** / ${t.title[0]} — ${t.ns} · \`${t.sim}\`${t.presets.length ? ` · preset mặc định của: ${t.presets.join(', ')}` : ' · tour làm quen (mọi preset chưa có tour riêng)'}`);
    L.push('');
    L.push(t.summary[1]);
    L.push('');
    L.push('| # | bắt đầu (vi) | dài (vi) | bắt đầu đo thật | vùng tô sáng | tiêu đề | tour tự làm | việc của người học → lời giải |');
    L.push('|---|---|---|---|---|---|---|---|');
    t.steps.forEach((st, k) => {
      const mt = m?.steps.find((x) => x.idx === k)?.t;
      const task = st.task ? `${st.task.text[1]} → ${st.task.solve.map(act).join(', ')}` : '';
      L.push(`| ${k + 1} | ${sec(n[k].at)} | ${sec(n[k].len)} (en ${sec(ne[k].len)}) | ${mt !== undefined ? sec(mt) : '—'} | ${st.target ? `\`${st.target}\`` : '—'} | ${st.title[1].replace(/\|/g, '\\|')} | ${(st.do ?? []).map(act).join(', ').replace(/\|/g, '\\|') || '—'} | ${task.replace(/\|/g, '\\|')} |`);
    });
    const qAt = m ? sec(m.quizAt) : sec(n[n.length - 1].at + n[n.length - 1].len);
    L.push(`| ✓ | ${qAt} | ${sec(QUIZ_MS)} | ${m ? sec(m.quizAt) : '—'} | — | Câu hỏi: ${t.quiz.q[1].replace(/\|/g, '\\|')} | đáp án đúng: ${String.fromCharCode(65 + t.quiz.answer)} | — |`);
    if (m?.sfx.length) L.push('', `Tiếng (đo thật): ${m.sfx.slice(0, 40).map((x) => `${sec(x.t + START_DELAY)} ${x.name}`).join(' · ')}${m.sfx.length > 40 ? ' …' : ''}`);
  }
  L.push('');
  return L.join('\n');
}

const args = process.argv.slice(2);
if (args[0] === '--measure') await measure(args[1] ?? 'http://localhost:3000');
if (args.includes('--md')) {
  const text = md();
  if (args.includes('--check')) {
    const cur = fs.existsSync(MD) ? fs.readFileSync(MD, 'utf8') : '';
    if (cur !== text) { console.error('TOURS.md lệch so với kịch bản — chạy: npx tsx scripts/labs-tours.mts --md'); process.exit(1); }
    console.log('TOURS.md khớp.');
  } else { fs.writeFileSync(MD, text); console.log('wrote', MD); }
}
