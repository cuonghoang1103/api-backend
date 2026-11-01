/** Web Foundations · deck bài 14.4 — Đo hiệu năng (Core Web Vitals). */
import { deckWf, js, html, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-14-4', code: 'WF 14.4', title: 'Measuring performance', sub: 'Web Foundations · Chapter 14' };

export const slides = deckWf({ chuong: 'Chapter 14 — Shipping it', bai: '14.4' }, [
  { cover: true, t: 'Measuring performance', sub: 'Core Web Vitals in plain words, measured on three versions of one page — a 64 becomes a 99' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain <b>LCP, CLS, INP</b> (and TBT) in one sentence each</li>
    <li>Measure a page with <b>Lighthouse</b> and with the browser’s own APIs</li>
    <li>Fix the three classic causes: <b>huge images, layout shifts, long tasks</b></li>
    <li>Know why <b>lab</b> numbers and <b>field</b> numbers differ</li>
    <li>Measure on a slow phone profile, not your laptop</li></ul>` },

  { t: 'Core Web Vitals in plain words', to: true, giua: true, body: tbl(['Metric', 'Question it answers', 'Good'], [
      ['LCP — Largest Contentful Paint', 'When did the main content appear?', '≤ 2.5 s'],
      ['CLS — Cumulative Layout Shift', 'Did things jump around while loading?', '≤ 0.1'],
      ['INP — Interaction to Next Paint', 'When I tap, how fast does the page react?', '≤ 200 ms'],
      ['TBT — Total Blocking Time (lab)', 'How long was the main thread too busy?', '≤ 200 ms'],
    ]) + box('Who cares', 'Users leave slow pages; Google uses these metrics in search ranking.', 'info') },

  { t: 'The slow page', giua: true, body: `${html(null, `<script>
  // a "tracking" script in <head>: blocks parsing (300 ms of work)
  const t = performance.now(); while (performance.now() - t < 300) {}
</script>
…
<div id="banner-slot"></div>
<img src="hero-big.jpg" alt="New collection">          <!-- 2.5 MB, no size -->
<main><h1>New collection</h1> … </main>
<script>
  setTimeout(() => { /* insert a 220 px promo banner above everything */ }, 800);
</script>`, { gon: false })}
    ${box('Excerpt of slow.html', 'Three problems, each one common on real sites: a huge photo with no dimensions, a banner inserted late above the content, and a script that blocks the main thread.', 'bad')}` },

  { t: 'Three versions, measured', giua: true, body: `${term('_t14/out/perf-measure', null, { title: 'node measure.mjs   (Chromium, 412×823, 1.6 Mbps, 150 ms RTT, CPU ×4)' })}
    ${term('_t14/out/perf-lighthouse', null, { title: 'lighthouse 13.6.0 --form-factor=mobile' })}` },

  { t: 'Fix 1: the image (LCP 12.3 s ⇒ 1.2 s)', to: true, giua: true, body: steps([
      'Serve the size the page needs: 1200 px WebP (185 KB), not a 2400 px camera JPEG (2.5 MB).',
      'Tell the browser early: <code class="i">&lt;link rel="preload" as="image"&gt;</code> + <code class="i">fetchpriority="high"</code>.',
      'Never lazy-load the hero image — lazy is for images below the fold.',
    ]) + box('Biggest win', '13× less data. On a phone network, bytes are time.', 'ok') },

  { t: 'Fix 2: reserve space (CLS 0.209 ⇒ 0)', giua: true, body: `${html(null, `<style>
  img { width: 100%; height: auto; display: block; }
  #banner-slot { min-height: 220px; }   /* the banner's room is kept from the start */
</style>
…
<div id="banner-slot"></div>
<img src="hero.webp" alt="New collection" width="1200" height="800" fetchpriority="high">`, { gon: false })}
    ${box('Two rules', 'Give images <code class="i">width</code>/<code class="i">height</code> (or <code class="i">aspect-ratio</code>), and reserve room for anything injected later (banners, ads, cookie bars).', 'ok')}` },

  { t: 'Fix 3: long tasks (TBT 1,150 ms ⇒ 0)', giua: true, body: two(js('_t14/perf/tracking-chunked.js'), `${box('defer moved the work, it did not remove it', 'fast.html deferred 300 ms of work ⇒ it ran after first paint as one long task ⇒ TBT 1,150 ms and a score of 76.', 'bad')}
    ${box('Split it', '30 slices of 10 ms in idle time ⇒ no task over 50 ms ⇒ TBT 0, score 99.', 'ok')}`, 'r64') },

  { t: 'Lab vs field', to: true, giua: true, body: two(box('Lab data', '<ul><li>Lighthouse, our measure.mjs</li><li>One simulated device and network</li><li>Repeatable — great for comparing fixes</li></ul>', 'info'), box('Field data', '<ul><li>Real users (Chrome UX Report, web-vitals library)</li><li>Every phone, every network</li><li>The truth Google uses — the 75th percentile</li></ul>', 'ok')) },

  { t: 'A performance checklist', to: true, giua: true, body: steps([
      'Measure first, on a mobile profile — never optimise blind.',
      'Images: right size, modern format, dimensions, preload the hero.',
      'Reserve space for late content; avoid inserting above existing content.',
      'Keep the main thread free: defer, split long tasks, ship less JS (14.1).',
      'Re-measure after each change; keep the before/after numbers.',
    ]) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>LCP · CLS · INP — load, stability, response</li>
    <li>Images are usually the biggest win</li>
    <li>Reserve space ⇒ no shifts</li>
    <li>Split long tasks; defer is not enough</li></ul>`,
    box('Practice (25 min)', 'Run Lighthouse (mobile) on a page you built, fix one image and one layout shift, and run it again.<br><br><b>Done when</b>: you have both reports, LCP and CLS improved, and you can name which change moved which number.', 'ok')) },
]);
