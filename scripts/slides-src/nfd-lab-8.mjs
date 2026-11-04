/**
 * nfd-lab-8 — Networking for Developers, Lab 8 "Kiểm toán tầng CDN của LabFlow" (slug netdev-8-5-lab-cdn-labflow).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c81..c84-*.out.txt).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-8', code: 'NFD LAB 8', title: 'Auditing LabFlow’s CDN layer', sub: 'Networking for Developers · Chapter 8' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 8 — CDN & caching', bai: 'Lab 8' }, [
  { cover: true, t: 'Lab 8 — Auditing LabFlow’s CDN layer', sub: 'Prove the cache works, catch a swallowed header,<br>and hit the edge’s limits on purpose', nhan: 'Chapter 8 · Lab 8 · Course project part 8' },

  { t: 'The situation', giua: true, body: `
${box('', 'LabFlow put a CDN in front of the app and the results are mixed: some pages are fast, a "fixed" logo is still stale after a deploy, the CDN bill is high with a low hit rate, and big report/upload endpoints fail. The audit wants proof — read from headers, not guessed — of what the cache does on each request, and the root cause of each complaint.', 'lam')}
${steps([
    'Prove HIT/MISS/EXPIRED on real responses',
    'Explain the low hit rate (query-fragmented keys) and the stale asset',
    'Find the layer that overrides a cache header, and diagnose the 524/413 failures',
  ])}` },

  { t: 'The system: a miniature CDN', giua: true, body: `
${bang(['Piece', 'Address', 'Role'], [
    ['edge', '10.10.2.10:8080', 'caching nginx (X-Cache from $upstream_cache_status)'],
    ['origin', '10.10.2.10:8081', 'serves files with correct Cache-Control'],
    ['broken edge', '10.10.2.10:8082', 'proxy_hide_header + no-store (the trap)'],
    ['slow / limit', ':8080/cham/ · 1 MB body', 'a 1 s read timeout and client_max_body_size 1m'],
  ], { fs: 18 })}
${box('', 'Bring it up with <code class="i">bash lab/code/dung-output-ch8.sh</code>. One edge, one origin, one deliberately-broken edge, and endpoints that reproduce the timeout and body-size walls.', 'lam')}` },

  { t: 'Requirements', giua: true, body: `
${steps([
    '<b>R1 Hit/miss/expired</b>: show MISS → HIT → HIT on a file, and MISS → HIT → EXPIRED across a TTL',
    '<b>R2 Cache key</b>: show <code class="i">?v=1</code> and <code class="i">?v=2</code> are separate entries; explain the low hit rate',
    '<b>R3 Swallowed header</b>: show the origin’s <code class="i">max-age=3600</code> and the broken edge’s <code class="i">no-store</code>; name the two directives',
    '<b>R4 Edge limits</b>: produce a <b>504</b> (slow origin) and a <b>413</b> (oversized body); give the right redesign',
  ])}` },

  { t: 'Report template', giua: true, body: `
${steps([
    '<b>R1 Hit/miss/expired</b> — the MISS→HIT→HIT and MISS→HIT→EXPIRED sequences, and which requests reached the origin',
    '<b>R2 Cache key</b> — the two entries for <code class="i">?v=1</code> / <code class="i">?v=2</code>, the low hit rate, and the hashed-filename fix',
    '<b>R3 Swallowed header</b> — <code class="i">Cache-Control</code> at origin vs broken edge, and the two nginx directives',
    '<b>R4 Edge limits</b> — the 504 and 413, with the 202+poll and presigned-URL redesign',
  ])}
${box('', 'One short paragraph per requirement. Paste the real header line that proves each claim — a MISS/HIT/EXPIRED, a <code class="i">Cache-Control</code> value, a status code — not a description of it.', 'lam')}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '2.5', 'MISS→HIT→HIT and MISS→HIT→EXPIRED, with origin-touch explained'],
    ['R2', '2.5', '?v=1 vs ?v=2 shown as separate keys; hashed-filename fix stated'],
    ['R3', '2.5', 'origin vs broken edge Cache-Control shown; proxy_hide_header + add_header named'],
    ['R4', '2.5', '504 and 413 reproduced; 202+poll and presigned-URL redesign given'],
  ], { fs: 18 })}
${box('', 'Full marks is not "it cached" — it is <b>reading the header that proves what the cache did</b> and naming the cause. Half marks for a correct observation with the wrong (or missing) root cause: e.g. seeing the 413 but "fixing" it by raising the limit instead of moving the upload off the edge.', 'lam')}` },

  { t: 'Hints', giua: true, body: `
${steps([
    'R1: <code class="i">curl -sD - -o /dev/null :8080/img/logo.txt | grep -i x-cache</code>, three times; then <code class="i">:8080/</code> with a 31 s wait for EXPIRED',
    'R2: same file with <code class="i">?v=1</code> (twice) then <code class="i">?v=2</code>',
    'R3: compare <code class="i">grep -i cache-control</code> at <code class="i">:8081</code> vs <code class="i">:8082</code>',
    'R4: <code class="i">:8080/cham/api/slow</code> for 504; <code class="i">head -c 2000000 /dev/zero | curl --data-binary @- :8080/img/</code> for 413',
  ])}
${box('', 'Read the cache line with <code class="i">grep -i x-cache</code> / <code class="i">grep -i cache-control</code>; read the status with <code class="i">-o /dev/null -w "%{http_code}"</code>. Always compare the <b>origin hop</b> (<code class="i">:8081</code>) with the <b>edge hop</b> (<code class="i">:8080</code>/<code class="i">:8082</code>) — the difference names the layer.', 'lam')}` },

  { t: 'Solution — the four checks', body: `
${term(ra('c81-hitmiss', 'curl', 3), { sm: true, title: 'R1 — MISS then HIT then HIT' })}
${term(ra('c82-key', 'curl', 3), { sm: true, title: 'R2 — ?v=1 MISS/HIT, ?v=2 MISS (separate key)' })}
${term(ra('c83-nuot', 'curl', 2), { sm: true, title: 'R3 — origin max-age=3600 vs broken edge no-store' })}
${term(ra('c84-limit', 'curl', 1), { sm: true, title: 'R4 — slow origin via 1 s timeout → 504' })}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>read the cache status</b> of any response and say which requests reached the origin</li>
<li>You can explain a <b>low hit rate</b> from query-fragmented keys and fix it with hashed filenames</li>
<li>You can find the <b>layer</b> that overrode a cache header — and verify on the wire, not in the config</li>
<li>You can reproduce the edge’s <b>524/504 and 413</b> and redesign around them (202+poll, presigned URLs)</li>
</ul>
<p style="margin:0">${kw('HIT/MISS/EXPIRED', 'trạng thái cache')} ${kw('cache key', 'khoá cache')} ${kw('proxy_hide_header', 'nuốt header')} ${kw('524 / 413', 'giới hạn biên')}</p>` },
]);
