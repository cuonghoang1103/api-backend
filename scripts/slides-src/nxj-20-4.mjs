/*DU_LIEU*/
const DU_LIEU = {
 "n20-4:file:src/app/api/hello/route.ts": "// app/api/hello/route.ts — the NEW route of release v2\nexport function GET() {\n  return Response.json({ hello: 'v2' });\n}\n",
 "n20-4:vps": "$ docker run -d --name prod -p 8080:3000 nxj-std   # \"the VPS\", running release v1\n/ver → 200\n/api/hello → 404\n$ git commit -am \"add /api/hello\" && ./deploy --no-build   # copy files, restart the container, skip the build\n/ver → 200\n/api/hello → 404\n$ docker inspect -f 'image {{.Image}}' nxj-prod | cut -c1-25; echo \"source has: $(ls src/app/api/hello/route.ts)\"\nimage sha256:6ff8e07407ee\nsource has: src/app/api/hello/route.ts",
 "n20-4:file:smoke.sh": "#!/bin/sh\n# smoke.sh — after every deploy: these routes must NOT be 404\nBASE=${1:-http://127.0.0.1:8080}\nfail=0\nfor r in / /ver /api/hello; do\n  code=$(curl -s -o /dev/null -w '%{http_code}' \"$BASE$r\")\n  echo \"$r → $code\"\n  [ \"$code\" = 404 ] && fail=1\ndone\n[ $fail = 0 ] && echo \"SMOKE OK\" || { echo \"SMOKE FAILED: stale or partial build\"; exit 1; }\n",
 "n20-4:smoke": "$ sh smoke.sh http://localhost:8080\n/ → 200\n/ver → 200\n/api/hello → 404\nSMOKE FAILED: stale or partial build\nexit 1\n$ docker build -t nxj-std:v2 . && docker rm -f prod && docker run -d --name prod … nxj-std:v2   # a FULL deploy\n/ → 200\n/ver → 200\n/api/hello → 200\nSMOKE OK\nexit 0",
 "n20-4:inode": "$ docker run -d --name nxj-bind -v \"$PWD/site.conf:/etc/site.conf\" alpine:3 sleep 600 >/dev/null; echo \"container reads: $(docker exec nxj-bind cat /etc/site.conf) · host inode $(stat -f %i site.conf)\"\ncontainer reads: release=v1 · host inode 158954408\n$ printf 'release=v2\\n' > site.conf.new && mv site.conf.new site.conf   # how editors and rsync save\nhost: release=v2 · inode 158954412\ncontainer reads: \ncat: can't open '/etc/site.conf': No such file or directory\n$ printf 'release=v3\\n' > site.conf   # write IN PLACE (same inode)\nhost: release=v3 · inode 158954412\ncontainer reads: release=v3",
 "n20-4:cdn": "$ curl -sI https://cuongthai.com/_next/static/chunks/<a file that does not exist yet>.js   # twice\nrequest 1: HTTP/2 404  cache-control: public, max-age=31536000, immutable \nrequest 2: HTTP/2 404  cache-control: public, max-age=31536000, immutable ",
 "n20-4:kho": "$ sed -n '931,934p' deploy-nha.sh; grep -c \"SMOKE_ROUTES\\|/api/v1/\" deploy-nha.sh | sed 's/^/dòng nhắc route trong deploy-nha.sh: /'\ninfo \"Smoke-test các route lõi...\"\n# ⚠️ Đọc danh sách route từ `deploy.sh` CỦA ĐÚNG COMMIT ĐANG DEPLOY\n# (`git show ${SHA}:deploy.sh`), KHÔNG phải file trong cây làm việc.\n#\ndòng nhắc route trong deploy-nha.sh: 4\n$ grep -n \"Ghi ĐÈ TẠI CHỖ\" CLAUDE.md | cut -c1-120\n827:| 2026-08-25 | Bước 6c mới thêm báo `KQ=OK` — `nginx -t` xanh, `reload` xanh — nhưng **HTTP/2 vẫn tắt và mọi header \n$ grep -n 'location ^~ /_next/static/\\|immutable\" always' nginx/nginx.conf\n215:        location ^~ /_next/static/ {\n228:            add_header Cache-Control \"public, max-age=31536000, immutable\" always;\n453:            add_header Cache-Control \"public, max-age=31536000, immutable\" always;\n510:            add_header Cache-Control \"public, max-age=31536000, immutable\" always;"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, path, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n20-4 · lab c20 · Docker Desktop 29.8 (Mac) đóng vai VPS · cổng 19347 · curl tới cuongthai.com 14/11/2026)
export const deck = { key: 'nxj-20-4', code: 'NXJ 20.4', title: 'Deploying to a VPS, and the “stale build” bugs', sub: 'Chapter 20 · Lesson 20.4' };
const O = (k) => { const v = DU_LIEU[`n20-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const doan = (khoi, dau) => { const l = O(khoi).split('\n'); const i = l.findIndex((x) => x.startsWith('$ ') && x.includes(dau)); if (i < 0) throw new Error('thiếu lệnh ' + dau); const r = []; for (let j = i + 1; j < l.length && !l[j].startsWith('$ '); j++) r.push(l[j]); return r; };
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);
const V1 = doan('vps', '"the VPS"'), V2 = doan('vps', '--no-build'), V3 = doan('vps', 'docker inspect');
const SM1 = doan('smoke', 'sh smoke.sh http://localhost:8080'), SM2 = doan('smoke', 'a FULL deploy');
const I1 = doan('inode', 'container reads: $(docker exec'), I2 = doan('inode', 'how editors and rsync save'), I3 = doan('inode', 'write IN PLACE');
const CDN = doan('cdn', 'does not exist yet'), KHO = O('kho').split('\n');
const NGX = doan('kho', "location ^~"), KS = doan('kho', "sed -n '931,934p'");
if (!/\[ "\$code" = 404 \] && fail=1/.test(O('file:smoke.sh'))) throw new Error('mã lab đổi');
const H_SMOKE = "#!/bin/sh\n# smoke.sh — after every deploy: these routes must NOT be 404\nBASE=${1:-http://127.0.0.1:8080}\nfail=0\nfor r in / /ver /api/hello; do\n  code=$(curl -s -o /dev/null -w '%{http_code}' \"$BASE$r\")\n  echo \"$r → $code\"\n  [ \"$code\" = 404 ] && fail=1\ndone\n[ $fail = 0 ] && echo \"SMOKE OK\" || { echo \"SMOKE FAILED\"; exit 1; }";

export const S = [
  { cover: true, nhan: 'Chapter 20 · Lesson 20.4', t: 'Deploying to a VPS, and<br>the “stale build” bugs', sub: 'A new route that 404s after “deploying”, a smoke test that catches it, a config file the container never sees, and a 404 cached for a year',
    en: 'Lesson twenty point four: deploying to a VPS, and the stale build bugs. A new route that returns four oh four after deploying, a smoke test that catches it, a config file the container never sees, and a four oh four cached for a year.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Commit a route, restart the container: <b>/api/hello → 404</b> — same image</li>
    <li>A 10-line smoke test turns that into <b>exit 1</b>; a full rebuild makes it <b>SMOKE OK</b></li>
    <li>Replace a bind-mounted file with <code>mv</code>: the container never sees v2</li>
    <li>cuongthai.com answers a missing chunk with <b>404 + “immutable, 1 year”</b></li>
    <li>One question for every impossible bug: is this really my latest build?</li></ul>`,
    en: 'Five takeaways. Commit a route and restart the container: four oh four, because it is the same image. A ten-line smoke test catches it. A config file replaced with mv is never seen by the container. This course’s site answers a missing chunk with a four oh four marked immutable for a year. And one question for every impossible bug.' },
  { t: 'A VPS, and what a deploy really is', to: true, body: D(path([{ t: 'build image', s: 'code + next build', mau: '#2563eb' }, { t: 'push', s: 'registry', mau: '#475569' }, { t: 'pull + swap', s: 'on the VPS', mau: '#ea580c', on: true }, { t: 'smoke test', s: 'curl routes', mau: '#16a34a' }], { w: 1110, h: 220, fs: 24, nhan: ['', '', ''] }),
    two(box('VPS = a computer you rent', 'Always on, a public IP, your containers. cuongthai.com: 6 GB of RAM — why images are built elsewhere and only <i>swapped</i> there.', 'lam'),
      box('Every step can silently not happen', 'Copy without build. Restart without pull. Build from an uncommitted tree. The site stays up — running something else.', 'do2'))),
    en: 'A VPS is a computer you rent: always on, a public IP. A deploy is four steps: build the image, push it, pull and swap it on the server, then smoke-test. Every step can silently not happen, and the site stays up, running something else.' },
  { t: 'Stale build: the route exists, the server 404s', body: two(D(tn([...sach(V1), '— commit /api/hello, restart, no build —', ...sach(V2), ...sach(V3)].join('\n'), { fs: 15, wrap: 56, title: 'the “VPS” (real)' })),
    D(box('Restart = same container, same image', 'The source has <code>route.ts</code>; the running image (sha256:6ff8…) was built before it. Restart re-runs the old build — /api/hello stays 404.', 'do2'),
      box('cuongthai.com, 02/07/2026', 'A sync-only deploy left the old <code>dist/</code> running: the GIF route 404’d while the code was on main. Fixed by one full rebuild.', 'lam')), 'r64'),
    en: 'The stale build. The VPS runs release v1: slash ver two hundred, slash api slash hello four oh four. Commit the new route and restart the container without building: still four oh four, and the image id has not changed. That is exactly what happened to this course’s GIF route on the second of July.' },
  { t: 'A smoke test makes it impossible to miss', body: two(D(tsx(H_SMOKE, { hl: [8], sm: true })),
    D(tn([...sach(SM1)].join('\n'), { fs: 15, wrap: 50, title: 'after the stale deploy (real)' }), tn(sach(SM2).join('\n'), { fs: 15, wrap: 50, title: 'after a FULL deploy (real)' }),
      box('404 = not mounted', 'Unauthenticated <code>curl</code>: 200 or 401 means the route exists; 404 means the running build does not have it. Fail the deploy, don’t log it.', 'xanh')), 'r64'),
    en: 'A smoke test makes it impossible to miss. Ten lines: curl each core route, fail if any returns four oh four. After the stale deploy: smoke failed, exit one. After a full rebuild and swap: smoke OK. Two hundred or four oh one means mounted; four oh four means not there.' },
  { t: 'A bind-mounted file, replaced with mv', body: two(D(tn([...sach(I1), '$ printf v2 > site.conf.new && mv site.conf.new site.conf', ...sach(I2), '$ printf v3 > site.conf        # in place', ...sach(I3)].join('\n'), { fs: 14, wrap: 64, title: 'docker run -v $PWD/site.conf:/etc/site.conf (real)' })),
    D(box('A single-file mount follows the inode', '<code>mv</code> (and editors, rsync, <code>sed -i</code>) write a <i>new</i> file and rename it: new inode. The container still holds the old one — on Docker Desktop it is gone (“No such file”); on a Linux VPS it keeps reading the old content.', 'do2'),
      box('cuongthai.com, 25/08/2026', '<code>nginx -t</code> OK, reload OK — and nginx was still using the old config. Fix: write in place (<code>cat new &gt; nginx.conf</code>), then check the hash <i>inside</i> the container.', 'lam')), 'r46'),
    en: 'A bind-mounted file replaced with mv. The host now says v2, with a new inode, but the container still holds the old file: on Docker Desktop it simply vanished; on a Linux server it keeps reading the old content. Write in place instead, same inode, and the container sees v3. This course’s nginx config was bitten by exactly this.' },
  { t: 'A 404 that is cached for a year', body: two(D(tn(sach(CDN).join('\n'), { fs: 14, wrap: 60, title: 'curl -sI cuongthai.com/_next/static/chunks/<missing>.js ×2 (real, 14/11)' }),
      tn(sach(NGX).join('\n'), { fs: 13, wrap: 64, title: 'nginx/nginx.conf (real)' })),
    D(box('always = also on 404', 'The <code>/_next/static/</code> block adds <code>public, max-age=31536000, immutable</code> with <code>always</code> — so a chunk requested a moment before it exists is a 404 that browsers and CDNs may keep for a year.', 'do2'),
      box('The same family', 'A CDN caching a 404; <code>public/</code> frozen at <code>next start</code> (18.4) — something kept an old answer.', 'lam')), 'r64'),
    en: 'A four oh four cached for a year. Ask this course’s site twice for a chunk that does not exist: four oh four, with cache control public, one year, immutable. The nginx rule adds that header with always, which includes errors. A chunk requested a moment too early becomes a four oh four that a browser or CDN may keep for a year.' },
  { t: 'The question to ask first', to: true, giua: true, body: steps([
      `Ask a route: ${c('curl -s -o /dev/null -w "%{http_code}" …/new-route')} — 404 = stale`,
      `Ask the container which image it runs: ${c('docker inspect -f {{.Image}}')} vs the image you built`,
      'Ask what the server read at start: public/ files, env, mounted config (restart? inode?)',
      'Ask what the cache in front keeps: Cache-Control on errors, CDN purge',
    ]),
    en: 'When production behaves impossibly, ask first: is this really my latest build? Ask a route with curl. Ask the container which image it runs. Ask what the server read when it started. And ask what the cache in front of it keeps.' },
  { t: 'cuongthai.com: the smoke test reads the deployed commit', body: two(D(tn(sach(KS).join('\n'), { fs: 14, wrap: 60, title: 'deploy-nha.sh (real)' })),
    D(box('Routes from the commit being deployed', 'The list is read with <code>git show SHA:deploy.sh</code> — not the working tree — so the smoke test checks what actually shipped.', 'xanh'),
      box('Three incidents, one shape', 'Stale dist (02/07) · nginx bind-mount inode (25/08) · <code>public/</code> 404 after rebuild (30/07): “what is running is not what you think”.', 'lam')), 'r64'),
    en: 'This course’s deploy script reads the smoke-test route list from the commit being deployed, not from the working tree. And its history has three incidents with one shape: a stale dist folder, an nginx file replaced by inode, and public files frozen at start.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🌀', '“It’s on main but not live”', ['restart without rebuild', 'two features break, looks like the database']],
      neu: ['❓', 'What if nobody smoke-tests?', ['users find the 404', 'hours of debugging the wrong layer']],
      xau: ['🕵️', 'Stale also means unpatched', ['your security fix is “deployed”', 'the old vulnerable build still answers']],
      phong: ['🛡️', 'Prove what runs', ['smoke test that fails the deploy', 'compare image id / BUILD_ID after swap']],
    }),
    en: 'Real life: it is on main but not live, and two broken features look like a database problem. What if nobody smoke-tests? Users find the four oh four. A stale build also means unpatched: your security fix is deployed, and the old vulnerable build still answers. Prove what runs.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('VPS', 'a rented server'), kw('Stale build', 'old image still running'), kw('Swap', 'replace the container'), kw('Smoke test', 'curl core routes, fail on 404'),
      kw('Bind mount', 'host file in a container'), kw('Inode', 'what a single-file mount follows'), kw('Write in place', 'same inode'), kw('Cache-Control … always', 'also on errors'), kw('Image id', 'which build runs'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: VPS; stale build; swap; smoke test; bind mount; inode; write in place; cache control with always; and image id.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Add a route, restart without rebuilding, curl it',
      `Write ${c('smoke.sh')}; make your deploy fail on any 404`,
      `Bind-mount one file; replace it with ${c('mv')}, then in place`,
      `${c('curl -sI')} a missing asset on your site — read Cache-Control`,
    ]), box('Keep these', `<ul><li>Restart ≠ deploy</li><li>Smoke-test fails the deploy</li><li>Single-file mounts: write in place</li><li>Never cache errors for a year</li></ul>`, 'lam'), ''),
    en: 'Your turn: add a route and restart without rebuilding; write a smoke test that fails the deploy; replace a bind-mounted file with mv, then in place; and check the cache header your site sends for a missing asset.' },
];
export const slides = lamDeck({ chuong: 'Chapter 20 — Build and deploy to production', bai: '20.4' }, S);
