/** Web Foundations · deck bài 14.3 — Đưa lên hosting. */
import { deckWf, js, bash, term, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-14-3', code: 'WF 14.3', title: 'Deploying', sub: 'Web Foundations · Chapter 14' };

export const slides = deckWf({ chuong: 'Chapter 14 — Shipping it', bai: '14.3' }, [
  { cover: true, t: 'Deploying', sub: 'What a host really does for your dist/ folder — SPA fallback, cache headers, HTTPS, and a smoke test that proves it worked' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain what "deploy" means: <b>build → upload → serve → verify</b></li>
    <li>Choose a host: static (Pages/Netlify/Vercel) or a server (VPS)</li>
    <li>Fix the <b>404 on refresh</b> of a single-page app</li>
    <li>Set <b>cache headers</b> that are fast and never stale</li>
    <li>Prove a deploy with a <b>smoke test</b> instead of hoping</li></ul>` },

  { t: 'Deploy = four steps', giua: true, body: `${flow([{ t: 'build', s: 'npm ci && npm run build' }, { t: 'upload', s: 'dist/ → host', mau: '#2f7d4f' }, { t: 'serve', s: 'HTTPS, headers', mau: '#b85a2b' }, { t: 'verify', s: 'smoke test', mau: '#7c3aed' }])}
    ${box('Each step can fail on its own', 'Build on a clean machine, upload the RIGHT folder, serve with the right rules, and check the live site — not your laptop.', 'info')}` },

  { t: 'Where to host', to: true, giua: true, body: tbl(['Kind', 'Examples', 'Good for'], [
      ['Static host', 'GitHub Pages, Netlify, Cloudflare Pages', 'HTML/CSS/JS only — portfolios, SPAs'],
      ['Platform (PaaS)', 'Vercel, Render, Railway', 'front-end + server functions, Next.js'],
      ['Your own server', 'a VPS with nginx', 'full control, more work'],
    ]) + box('All of them do the same four things', 'Build your project, store dist/, serve it over HTTPS with rules you configure.', 'ok') },

  { t: 'A tiny host, to see what it does', giua: true, body: `${js('_t14/server.mjs', null, { chi: [14, 30] })}
    ${box('', 'Three jobs: find the file in dist/, fall back to index.html for app routes (if --spa), and send the right cache header.', 'info')}` },

  { t: 'The SPA trap: 404 on refresh', giua: true, body: `${two(term('_t14/out/smoke-nospa', null, { title: 'node server.mjs  (plain static)' }), term('_t14/out/smoke-spa', null, { title: 'node server.mjs --spa' }))}
    ${box('Why', '<code class="i">/products/42</code> exists only inside your JavaScript router. A plain static host looks for a file with that name, finds none ⇒ 404. Fallback: serve <code class="i">index.html</code> for unknown paths without an extension.', 'bad')}` },

  { t: 'Cache headers that are fast and never stale', giua: true, body: `${term('_t14/out/headers', null, { title: 'curl -sI /  and  /assets/index-27wt_Xcd.js' })}
    ${tbl(['File', 'Header', 'Why'], [['index.html', 'no-cache', 'must always point at the newest assets'], ['/assets/*-hash.js', 'max-age=31536000, immutable', 'a change ⇒ a new name (14.1)']])}` },

  { t: 'Smoke test: prove it, do not hope', giua: true, body: two(js('_t14/smoke.mjs', null, { chi: [3, 18] }), steps(['Run right after each deploy', 'A handful of cheap GET requests', 'Exit code 1 ⇒ the deploy failed ⇒ roll back']), 'r73') },

  { t: 'HTTPS and a domain', to: true, giua: true, body: steps([
      'Buy a domain; point DNS (A / CNAME record) at the host.',
      'The host issues a free TLS certificate (Let’s Encrypt) — HTTPS on.',
      'Redirect http:// ⇒ https://; browsers block many features on plain HTTP.',
      'Set the public env vars (14.2) in the host’s dashboard, then rebuild.',
    ]) + box('Check it', '<code class="i">curl -sI https://your-domain</code> ⇒ <code class="i">HTTP/2 200</code>; the browser shows the padlock; http:// answers 301 to https://.', 'ok') },

  { t: 'Deploy traps', to: true, giua: true, body: vsd('<ul><li>Uploading the source folder instead of <code class="i">dist/</code></li><li>Env var set after the build (VITE_ values are baked in)</li><li>Caching index.html for a day</li><li>"It deployed" = the command finished</li></ul>', '<ul><li>Host runs <code class="i">npm run build</code>, serves <code class="i">dist</code></li><li>Change env ⇒ rebuild + redeploy</li><li>HTML <code class="i">no-cache</code>, hashed assets immutable</li><li>"It deployed" = smoke test green</li></ul>', '✗ Trap', '✓ Instead') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>build → upload → serve → verify</li>
    <li>SPA ⇒ fallback to index.html</li>
    <li>HTML no-cache, hashed assets 1 year</li>
    <li>Smoke test after every deploy</li></ul>`,
    box('Practice (30 min)', 'Deploy the 14.1 project to Netlify or GitHub Pages with a client-side route (<code class="i">/about</code>) and run the smoke test against the live URL.<br><br><b>Done when</b>: refreshing <code class="i">/about</code> on the live site is not 404, <code class="i">curl -sI</code> shows the cache headers, and the smoke test exits 0.', 'ok')) },
]);
