/**
 * nfd-13-3 — Networking for Developers, bài 13.3 "Tối ưu: keep-alive, cache, nén, CDN" (slug netdev-13-3-toi-uu). Capstone.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c133-*.out.txt) — nén 67KB→1.8KB; cache MISS 3s → HIT 0.0006s (đo trước/sau).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-13-3', code: 'NFD 13.3', title: 'Optimise: cache, compression, keep-alive, CDN', sub: 'Networking for Developers · Chapter 13' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 13 — Capstone', bai: '13.3' }, [
  { cover: true, t: 'Optimise: cache, compression, keep-alive, CDN', sub: 'One change at a time —<br>measured before and after', nhan: 'Chapter 13 · Lesson 13.3 · Capstone' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The tuning knobs that move real numbers: <b>compression</b>, <b>edge caching</b>, <b>keep-alive</b>, <b>HTTP/2</b>, <b>CDN</b></li>
<li>Each applied to the stack and shown as a <b>measured before/after</b></li>
<li><b>Compression</b>: a 67 KB response → under 2 KB</li>
<li><b>Edge cache</b>: a 3-second origin call → a sub-millisecond hit</li>
<li>How to assemble the <b>before/after table</b> that is your capstone deliverable</li>
</ul>` },

  { t: 'The rule: one change, before and after', giua: true, body: `
${box('Key idea', 'Change <b>exactly one</b> knob, re-measure against the baseline, record the delta. Turn on three things at once and a faster page teaches you nothing — you can’t say which helped, by how much, or whether one hurt.', 'do2')}
${steps([
    'Start from the recorded baseline (13.2)',
    'Flip one knob (compression, then cache, then keep-alive…)',
    'Re-run the same measurement; write the before→after number',
  ])}` },

  { t: 'Compression', body: `
${term(ra('c133-toiuu', 'echo "== compression', 3), { sm: true, title: 'same /big.html: client without gzip vs with gzip' })}
${box('', 'Turning on gzip at the edge takes the same response from <b>67,092 bytes to 1,809</b> — a <b>37×</b> smaller download for text (HTML/CSS/JS/JSON). The client advertises <code class="i">Accept-Encoding</code>; the edge compresses. This shrinks the <b>total − ttfb</b> (download) gap directly. Never compress already-compressed bytes (images, video).', 'xanh')}` },

  { t: 'Edge caching', body: `
${term(ra('c133-toiuu', 'echo "== edge cache', 3), { sm: true, title: 'a slow (3 s) origin response: MISS hits origin, HIT served at the edge' })}
${box('', 'The first request is a <code class="i">MISS</code> and pays the full <b>3.0 s</b> origin cost; the second is a <code class="i">HIT</code> served from the edge in <b>~0.3 ms</b> — the origin is not touched at all. For a cacheable response, this collapses the <b>ttfb</b> gap to almost nothing and takes load off the origin. The win is dramatic precisely because the origin was slow.', 'xanh')}` },

  { t: 'Keep-alive, HTTP/2, CDN', giua: true, body: `
${bang(['Knob', 'What it removes', 'Which gap'], [
    ['<b>keep-alive</b> (edge→API)', 'a TCP handshake per request to the backend', 'ttfb (fewer round trips upstream)'],
    ['<b>HTTP/2</b> (client→edge)', 'the 6-connection limit; one connection, many streams', 'many-asset pages'],
    ['<b>CDN</b>', 'distance — a nearby edge terminates TLS and caches', 'dns + connect + ttfb (closer)'],
  ], { fs: 18 })}
${box('', 'The lab edge keeps a pool of connections to the API (<code class="i">keepalive</code> + <code class="i">proxy_http_version 1.1</code>), so repeated requests skip the upstream handshake. In production a CDN does the same for the client leg, nearer the user.', 'lam')}` },

  { t: 'Match the knob to the gap', giua: true, body: `
${steps([
    'Big <b>download</b> (total − ttfb) → <b>compression</b> (and don’t ship huge assets)',
    'Repeated expensive <b>ttfb</b> on cacheable responses → <b>edge cache</b>',
    'Per-request upstream handshakes → <b>keep-alive</b> to the backend',
    'Far users / many small assets → <b>CDN</b> and <b>HTTP/2</b>',
  ])}
${box('', 'Every optimisation targets a specific gap in your baseline. Measure which gap dominates, then pick the knob for it — do not guess, and do not change all four at once.', 'do2')}` },

  { t: 'The before/after table (deliverable)', giua: true, body: `
${bang(['Change', 'Before', 'After'], [
    ['Compression (gzip)', '67,092 B', '1,809 B (37×)'],
    ['Edge cache (MISS→HIT)', '3.0 s', '~0.3 ms'],
    ['Keep-alive upstream', '+handshake/req', 'reused connection'],
    ['(your HTTP/2 / CDN test)', 'baseline', 'measured delta'],
  ], { fs: 19 })}
${box('', 'This table IS the capstone’s headline artefact. Each row is one change, one measurement, one defensible number — the difference between an engineer who <b>tunes</b> and one who <b>fiddles</b>.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Change <b>one knob at a time</b> and re-measure against the baseline — the delta is the result</li>
<li><b>Compression</b>: 67 KB → 1.8 KB (37×) on text — shrinks the download gap</li>
<li><b>Edge cache</b>: a 3 s origin call → ~0.3 ms hit — collapses ttfb for cacheable responses</li>
<li><b>keep-alive</b> skips upstream handshakes; <b>HTTP/2</b> and a <b>CDN</b> help many-asset and far-user cases</li>
<li>Assemble the <b>before/after table</b> — one change, one number, each defensible</li>
</ul>
<p style="margin:0">${kw('compression', 'nén')} ${kw('edge cache', 'cache biên')} ${kw('keep-alive', 'giữ kết nối')} ${kw('HTTP/2 / CDN', 'ghép kênh / biên')} ${kw('before/after', 'trước/sau')}</p>` },
]);
