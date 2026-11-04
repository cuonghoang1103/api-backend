/**
 * nfd-08-4 — Networking for Developers, bài 8.4 "Giới hạn của CDN: timeout, kích thước và nội dung động" (slug netdev-8-4-gioi-han-cdn).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c84-*.out.txt) — biên timeout ⇒ 504; thân quá lớn ⇒ 413.
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-08-4', code: 'NFD 8.4', title: 'CDN limits', sub: 'Networking for Developers · Chapter 8' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 8 — CDN & caching', bai: '8.4' }, [
  { cover: true, t: 'CDN limits', sub: 'Timeouts (524), body size (413) and dynamic content —<br>route long work and big uploads around the edge', nhan: 'Chapter 8 · Lesson 8.4' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li>The edge’s <b>request timeout</b> — Cloudflare cuts at ~100 s with a <b>524</b> (the lab shows it as 504)</li>
<li>Which layer emits <b>502 / 503 / 504 / 524</b> and what each means</li>
<li>Long work ⇒ don’t hold the request: return <b>202</b>, do it in the background, poll for the result</li>
<li>The edge’s <b>body-size cap</b> — the lab shows a <b>413</b></li>
<li>Big uploads ⇒ a <b>presigned URL</b> straight to object storage (R2/S3), bypassing the edge</li>
</ul>` },

  { t: 'The edge will not wait forever', body: `
${term(ra('c84-limit', 'curl', 1), { sm: true, title: 'origin takes 3 s; the edge’s read timeout is 1 s → 504' })}
${box('', 'The lab edge has a 1-second read timeout; a 3-second origin yields <b>504</b>. Cloudflare does the same at about <b>100–125 seconds</b> and returns <b>524</b>: "I reached your origin but it did not answer in time." Any single request that runs longer than the edge timeout is doomed, no matter how healthy the origin is.', 'do2')}` },

  { t: 'The gateway codes', giua: true, body: `
${bang(['Code', 'Means — who emits it'], [
    ['<b>502</b> Bad Gateway', 'the proxy reached the origin but got a broken/empty reply'],
    ['<b>503</b> Service Unavailable', 'the proxy has no healthy origin to send to (overloaded/down)'],
    ['<b>504</b> Gateway Timeout', 'the origin did not answer within the proxy’s read timeout'],
    ['<b>524</b> (Cloudflare)', 'Cloudflare-specific 504: origin connected but silent past ~100 s'],
  ], { fs: 18 })}
${box('', '502/503/504 come from <b>the proxy/edge</b>, describing the origin — not from your app. 524 is Cloudflare’s own. Reading the right one tells you whether the origin is broken, missing or just too slow. (Full treatment in Chapter 10.)', 'lam')}` },

  { t: 'Long work: do not hold the request', giua: true, body: `
${steps([
    'Client asks to start the job → server returns <b>202 Accepted</b> + a status URL immediately',
    'The work runs in a <b>background worker/queue</b>, not inside the HTTP request',
    'Client <b>polls</b> the status URL (or uses SSE/WebSocket — Chapter 9) until done, then downloads the result',
  ])}
${box('Cloudflare’s own advice', 'For anything near the timeout — big reports, video processing, AI generation — "implement status polling of large HTTP processes." The request that starts the job is fast; the job itself is not on the request’s clock.', 'xanh')}` },

  { t: 'Body-size limits', giua: true, body: `
${term(ra('c84-limit', 'head', 1), { sm: true, title: 'a 2 MB body through a 1 MB limit → 413' })}
${bang(['Layer', 'Typical request-body cap'], [
    ['nginx (our lab)', '<code class="i">client_max_body_size</code> — 1 MB here, 1 MB default'],
    ['Cloudflare (free/pro)', '~100 MB per request upload'],
    ['API gateways / serverless', 'often 5–10 MB (AWS API Gateway: 10 MB)'],
  ], { fs: 19 })}
${box('', 'The edge caps request bodies, and the cap is small. The lab uses <code class="i">client_max_body_size 1m</code>, so a 2 MB upload returns <b>413 Payload Too Large</b>. Pushing a large file <b>through</b> the edge wastes its bandwidth and still hits a wall eventually — raising the number only moves it. The fix is to not send big bytes through the edge at all (next slide).', 'do2')}` },

  { t: 'Big uploads: go around the edge', giua: true, body: `
${steps([
    'Browser asks your API for a <b>presigned URL</b> (a short-lived, signed PUT to R2/S3)',
    'Browser uploads the file <b>directly</b> to object storage — not through your API or the CDN',
    'Browser tells your API the object key; your API records it. The big bytes never touched the edge',
  ])}
${box('', 'This is how LabFlow and cuongthai.com take large uploads: a presigned PUT straight to Cloudflare R2. The edge and your origin only ever see small JSON — no 413, no wasted bandwidth, no timeout.', 'lam')}` },

  { t: 'What not to route through the edge', giua: true, body: `
${bang(['Fits the edge', 'Route around it'], [
    ['Cached static assets, public GETs', 'Requests that run longer than the edge timeout'],
    ['Short dynamic JSON', 'Large uploads/downloads (use presigned object storage)'],
    ['Normal API traffic', 'Long-lived streams that the edge may buffer/cut (Chapter 9)'],
  ], { fs: 19 })}
${box('', 'The edge is built for many short requests. Anything long, huge or continuously streaming needs a different shape: start-and-poll, presigned storage, or a connection designed to stay open. Fighting the edge’s limits head-on always loses.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>The edge has a <b>request timeout</b> (~100 s on Cloudflare → <b>524</b>; the lab shows 504 at 1 s) — long requests are doomed</li>
<li><b>502/503/504</b> come from the proxy about the origin (broken / missing / too slow); <b>524</b> is Cloudflare’s</li>
<li>Long work ⇒ <b>202 + background + poll</b>, never hold the HTTP request open</li>
<li>The edge caps body size (<b>413</b>); big uploads ⇒ <b>presigned URL</b> straight to R2/S3</li>
<li>The edge is for many <b>short</b> requests; route long/huge/streaming work <b>around</b> it</li>
</ul>
<p style="margin:0">${kw('524 / 504', 'timeout ở biên')} ${kw('202 Accepted', 'việc chạy nền + hỏi lại')} ${kw('413', 'thân quá lớn')} ${kw('presigned URL', 'upload thẳng R2')}</p>` },
]);
