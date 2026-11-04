/**
 * nfd-08-3 — Networking for Developers, bài 8.3 "Khi proxy ghi đè header cache của bạn" (slug netdev-8-3-nginx-nuot-header).
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c83-*.out.txt). Dựa trên sự cố THẬT của cuongthai.com (23/08/2026).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-08-3', code: 'NFD 8.3', title: 'When your proxy overrides your cache headers', sub: 'Networking for Developers · Chapter 8' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 8 — CDN & caching', bai: '8.3' }, [
  { cover: true, t: 'When your proxy overrides your cache headers', sub: 'The layer fight — and the real outage where<br>nginx ate every Cache-Control header', nhan: 'Chapter 8 · Lesson 8.3' },

  { t: 'What this lesson gives you', to: true, giua: true, body: `
<ul>
<li><b>Who sets the cache headers</b> — app, nginx, CDN, browser — and who <b>wins</b></li>
<li>The lab: an origin sends <code class="i">Cache-Control: max-age=3600</code>; a broken edge rewrites it to <code class="i">no-store</code></li>
<li>The real cuongthai outage: nginx <code class="i">proxy_hide_header</code> + <code class="i">no-store</code> made Next.js caching <b>never</b> work</li>
<li><code class="i">add_header</code>, <code class="i">proxy_hide_header</code>, <code class="i">proxy_pass_header</code> — what each actually does</li>
<li>The one habit that saves you: <code class="i">curl -I</code> at <b>every</b> hop, not just the origin</li>
</ul>` },

  { t: 'Four layers can touch the header', giua: true, body: `
${bang(['Layer', 'What it can do to Cache-Control'], [
    ['<b>App</b> (Next.js/Express)', 'sets the intended value on the response'],
    ['<b>nginx</b> (reverse proxy)', 'can hide, replace or add headers — <b>last word before the CDN</b>'],
    ['<b>CDN</b> (edge)', 'applies its own rules; may honour or override the origin'],
    ['<b>Browser</b>', 'obeys whatever finally arrives'],
  ], { fs: 19 })}
${box('', 'The header the user’s browser sees is whatever the <b>last layer that touched it</b> set. A perfect <code class="i">Cache-Control</code> in your app means nothing if nginx rewrites it on the way out.', 'lam')}` },

  { t: 'The lab: origin right, edge wrong', body: `
${term(ra('c83-nuot', 'curl', 2), { sm: true, title: 'origin (:8081) sends max-age=3600; broken edge (:8082) rewrites to no-store' })}
${box('', 'Same file, same origin header. The broken edge runs <code class="i">proxy_hide_header Cache-Control;</code> then <code class="i">add_header Cache-Control "no-store";</code> — so it <b>strips</b> the good header and <b>stamps</b> its own. Downstream, nothing is ever cached.', 'do2')}` },

  { t: 'The real outage (cuongthai.com, 23 Aug 2026)', giua: true, body: `
${steps([
    'Next.js set a 7-day <code class="i">Cache-Control</code> on <code class="i">/playground/**</code> (94 MB of assets) — correct',
    'But nginx’s <code class="i">location /</code> ran <code class="i">proxy_hide_header Cache-Control;</code> then pasted <code class="i">no-store</code> on <b>every</b> response',
    'So the rule in <code class="i">next.config.js</code> never took effect — not for one single day',
    'Same mechanism ate <code class="i">public/</code> too: 12 SVG logos + a robot.json reloaded on every navigation',
  ])}
${box('Lesson', '<b>nginx beats next.config.js, always.</b> Setting a cache header in the app without a matching <code class="i">location</code> in nginx is just decoration. Give the branch its own <code class="i">location</code> and do <b>not</b> <code class="i">proxy_hide_header</code> there.', 'do2')}` },

  { t: 'The nginx directives in play', giua: true, body: `
${bang(['Directive', 'Does'], [
    ['<code class="i">add_header X v;</code>', 'ADD a header on the way out (does not replace an upstream one by itself)'],
    ['<code class="i">proxy_hide_header X;</code>', 'STRIP header X coming from upstream before sending it on'],
    ['<code class="i">proxy_pass_header X;</code>', 'explicitly let an upstream header through'],
    ['<code class="i">add_header … always;</code>', 'add even on error responses (4xx/5xx), not just 2xx/3xx'],
  ], { fs: 18 })}
${box('', 'The trap is the combination: <code class="i">proxy_hide_header Cache-Control;</code> + <code class="i">add_header Cache-Control no-store;</code> silently wins over anything upstream sent. Also note <code class="i">add_header</code> in a nested block <b>replaces</b> the parent’s add_headers — easy to lose a header by adding another.', 'lam')}` },

  { t: 'Verify at every hop — do not read the config', giua: true, body: `
${steps([
    'Ask the <b>origin/app</b> directly (bypass the proxy): <code class="i">curl -I http://app:3000/x</code>',
    'Ask <b>through nginx</b>: <code class="i">curl -I https://site/x</code> — compare the Cache-Control',
    'Ask <b>through the CDN</b>: <code class="i">curl -I https://public-domain/x</code> and read <code class="i">cf-cache-status</code>',
  ])}
${box('Key idea', 'Reading the config and <b>believing</b> it is how this bug survives for weeks. The header on the wire is the truth; <code class="i">curl -I</code> at each hop shows exactly which layer changed it. "It is written" is not "it is in effect."', 'do2')}` },

  { t: 'Rules that prevent it', giua: true, body: `
${steps([
    'Decide <b>one</b> owner of cache headers per path (usually the app) and do not fight it downstream',
    'If nginx must set caching, give the cacheable branch its own <code class="i">location</code> without <code class="i">proxy_hide_header</code>',
    'Never paste a blanket <code class="i">no-store</code> in <code class="i">location /</code> — it swallows everything beneath it',
    'Add a hop-by-hop <code class="i">curl -I</code> check to your deploy/smoke test',
  ])}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Four layers can change <code class="i">Cache-Control</code> — app, nginx, CDN, browser; the <b>last one to touch it wins</b></li>
<li>The lab: a broken edge <code class="i">proxy_hide_header</code> + <code class="i">no-store</code> strips a correct <code class="i">max-age=3600</code></li>
<li>Real outage: nginx’s blanket <code class="i">no-store</code> made a 7-day Next.js cache rule useless for the site’s whole life</li>
<li><code class="i">add_header</code> / <code class="i">proxy_hide_header</code> / <code class="i">proxy_pass_header</code> decide what survives — know which runs last</li>
<li><b>Verify on the wire</b> with <code class="i">curl -I</code> at every hop; "it is written" ≠ "it is in effect"</li>
</ul>
<p style="margin:0">${kw('proxy_hide_header', 'tước header thượng nguồn')} ${kw('add_header', 'thêm header')} ${kw('layer fight', 'tranh tầng')} ${kw('curl -I', 'đọc header ở mỗi chặng')}</p>` },
]);
