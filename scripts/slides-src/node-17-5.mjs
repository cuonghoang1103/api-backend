/**
 * node-17-5 — Node.js · Chapter 17 · Lesson 17.5 "Zero downtime: 5.3% lost, or 0%" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-17-5.
 * Nguồn: nodejs-17-5-deploy-khong-gian-doan. Output THẬT: that/c17/{deploy, prod-swap} (Docker Desktop 29.8.0, nginx:1.27-alpine, app mẫu c17/app;
 *   bộ dò GET /health/live mỗi ~25 ms, kết nối mới mỗi lần, cửa sổ 9 s, deploy bắt đầu ở 1,5 s, 5 lần ⇒ trung vị).
 * Khác web: cách 1 mất 16/301 (5,32 %, cửa sổ 0,43 s) — web 4/254 (1,5 %); cách 2 35/291 (12,03 %) — web 4/250 (1,6 %); bộ dò ở đây dày hơn nên % cao hơn,
 *   kết luận giống. THÊM: cách 3 có 502 ở 2/5 lần (old worker nginx còn đẩy vào blue khi blue vừa dừng) ⇒ cách 4 chờ 1 s trước khi bỏ blue: 0 ở 5/5 lần.
 *   Website: nginx giữ 80/443 cố định; deploy-nha.sh dựng lại backend+frontend TẠI CHỖ (`up -d --no-build`), rồi nạp lại nginx (sự cố 11/09: tráo IP ⇒ 502 15 phút).
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-17-5', code: 'NODE 17.5', title: 'Zero downtime: 5.3% lost, or 0%', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });
const NG = (src, o = {}) => sql(src, { lang: 'nginx', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.5' }, [
  { cover: true, t: 'Zero downtime:<br>5.3% lost, or 0%', sub: '"Zero-downtime deploy" is said about setups nobody measured. Here: fire requests continuously through the deploy and count the failures.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>How to measure downtime: a probe that never stops</li>
<li>Stop, then start: 16 of 301 requests lost</li>
<li>"Blue-green" without a proxy: worse, not better — and why</li>
<li>Blue-green with a proxy in front: 0 — plus the 502 we found</li>
<li>Health check as the gate · rolling vs blue-green vs canary</li>
</ul>` + two(box('Why it matters to you', 'You deploy several times a day. Each failed request is a real user seeing an error page.', 'lam'), box('Measure, do not claim', 'Every number here comes from a probe that kept firing through the whole switch.', 'xanh')) },

  { t: 'The method: a probe that never stops', to: true, giua: true, body: flow([{ t: 'probe', s: 'GET /health/live every ~25 ms', mau: TIM }, { t: 'public port :4760', s: 'what users hit', mau: CAM }, { t: 'the deploy', s: 'starts at 1.5 s', mau: LAM }, { t: 'count', s: 'every failure, 9 s window', mau: DO }], { h: 130 }) +
    cards([['A new connection every time', 'Like a new visitor. Keep-alive would hide failures behind one lucky connection.'], ['Every method 5 times', 'The machine is busy; the median of 5 runs is what we report.'], ['Failure = anything but 200', 'Connection refused, connection reset, a 502 from the proxy, a timeout.']], 3) +
    sql(`// the probe (simplified from that/c17/deploy.mjs)
while (!done) {
  const ok = await get('http://127.0.0.1:4760/health/live', { agent: false, timeout: 1000 });
  results.push([Date.now() - t0, ok]);        // ok = true, or the error: ECONNREFUSED, HTTP 502…
  await sleep(25);
}`, { lang: 'javascript', sm: true, hl: [3] }) },

  { t: 'Method 1: stop, then start', to: true, giua: true, body: B(`docker stop -t 10 blue && docker rm blue
docker run -d --name blue -p 4760:3000 app:new`, { sm: false }) +
    TT('c17/deploy', 4, 6, 'docker stop · docker rm · docker run on the same port · 5 runs · real', { n: 104, hl: [3], sm: false }) +
    two(box('16 of 301 failed (5.32%)', 'A 0.43-second hole: nothing listens on port 4760 between the stop and the new start.', 'do2'), box('That is what docker compose up does', 'to a single container when the image changed: recreate in place. The web lesson measured 1.5% with a slower probe.', 'cam')) },

  { t: 'Method 2: "blue-green" without a proxy', to: true, giua: true, body: B(`docker run -d --name green -p 4761:3000 app:new      # 1. green on a second port
until curl -sf :4761/health/live; do sleep 0.05; done  # 2. wait until healthy
docker stop -t 10 blue && docker rm blue              # 3. remove blue
docker rm -f green && docker run -d --name green -p 4760:3000 app:new   # 4. rebind`, { sm: false, hl: [4] }) +
    TT('c17/deploy', 8, 10, 'the standard advice, implemented literally · 5 runs · real', { n: 104, hl: [3], sm: false }) +
    box('35 of 291 failed (12.03%) — worse than method 1', 'The hole is now 1.05 s: blue is gone, and green must be re-created to take the real port.', 'do2') },

  { t: 'Why the health check did not help', to: true, giua: true, body: two(box('It was never about which container was healthy', 'The outage is the port. Between the moment blue releases :4760 and the moment green binds it, nothing listens — every request is refused.', 'do2'),
    box('The health check still has value', 'If green is broken, blue is still serving: the difference between a failed deploy and an outage.', 'xanh')) +
    flow([{ t: 'blue on :4760', s: 'serving', mau: NODE }, { t: 'blue removed', s: ':4760 has NO listener', mau: DO }, { t: 'green re-created', s: 'still starting', mau: DO }, { t: 'green on :4760', s: 'serving again', mau: NODE }], { h: 130 }) +
    box('Calling this "blue-green" is where the confusion starts', 'The pattern is right; the implementation left out the one piece that makes it work.', 'cam') },

  { t: 'Method 3: something long-lived holds the address', to: true, giua: true, body: NG(`events {}
http {
  server {
    listen 80;                                   # published as :4760, never restarts
    location / { proxy_pass http://node17-blue:3000; }   # only THIS line changes
  }
}`, { sm: false, hl: [4, 5] }) +
    B(`docker run -d --name green --network node17-net app:new   # 1-2: green up, wait healthy
# rewrite nginx.conf IN PLACE (bind-mounted file), then:
docker exec node17-nginx nginx -s reload                   # 3: proxy points at green
docker stop -t 10 blue && docker rm blue                   # 4: only now drop blue`, { sm: false, hl: [3] }) +
    box('Like a receptionist who never goes home', 'Callers always dial the same number. The receptionist decides which desk picks up — moving the call to a new desk never makes the phone stop ringing.', 'lam') },

  { t: 'Method 3, measured — and the 502 we found', to: true, giua: true, body: TT('c17/deploy', 12, 18, 'nginx:1.27-alpine in front · 5 runs each · real', { n: 104, hl: [2, 6], sm: false }) +
    two(box('Method 3: one 502 in 2 of 5 runs', 'Blue was stopped right after the reload. An old nginx worker still handed one request to blue as it shut down.', 'cam'), box('Method 4: wait 1 s first — 0 in 5 of 5', 'Let the old workers drain, then drop blue. The public port never closed.', 'xanh')) +
    box('The structural difference', 'Something long-lived owns the address. The swap is a change of destination, not a change of listener. Everything else is detail.', 'lam') },

  { t: 'Four methods, side by side', to: true, giua: true, body: thanh([['1 · stop, start', 5.32, DO, '5.32% · 16 / 301'], ['2 · no proxy', 12.03, DO, '12.03% · 35 / 291'], ['3 · nginx, drop at once', 0, CAM, '0 median · a 502 in 2 of 5 runs'], ['4 · nginx, wait 1 s', 0.01, NODE, '0 in 5 of 5 runs']], { w: 1100, x0: 330, wMax: 380, h0: 64, chu: 22, ghi: 'share of probe requests that failed · median of 5 runs · real' }) +
    box('The probe here is denser than the web lesson\'s', 'Every ~25 ms instead of ~35 ms, so the same hole catches more requests: 5.3% here, 1.5% there. Same conclusion.', 'lam') },

  { t: 'Five steps of a real zero-downtime swap', to: true, giua: true, body: steps([
    '<b>The proxy holds the public port PERMANENTLY</b> — nginx, Traefik, a load balancer. It does not restart on deploy',
    '<b>Start the new version ALONGSIDE the old</b> — another port or name; the old one keeps serving',
    '<b>Health-check the NEW one until it is truly ready</b> — "the route answered", not "the container started"',
    '<b>Switch the proxy\'s target</b> — reload the config; open connections drain from the old one',
    '<b>Wait, then drop the old one</b> — and give it the grace period of 17.3',
  ]) + box('Step 5 is where method 3 lost its 502', 'Dropping blue in the same breath as the reload leaves no time to drain.', 'cam') },

  { t: 'Why the health check must be the gate', to: true, giua: true, body: B(`# RIGHT: wait for exactly what users will call
until curl -sf http://127.0.0.1:3741/health/live >/dev/null; do sleep 0.05; done

# WRONG: "it is running" is not "it is ready"
docker ps | grep green && echo "ready!"`, { sm: false, hl: [2, 5] }) +
    cards([['Container started', 'The process exists. The routes may not be mounted yet.'], ['App ready', 'Connected to the database, caches warm, routes answering. Can be seconds later.'], ['Switching on the first', 'docker ps says Up, every request 502s. The most confusing outage there is.']], 3) +
    box('Gate on a real route', 'The check must be an HTTP answer from the running app — the same path users take. A liveness route is the cheapest honest one.', 'xanh') },

  { t: 'Rolling, blue-green, canary, recreate', to: true, giua: true, body: bang(['strategy', 'how', 'cost', 'catch'], [
    ['Blue-green', '2 full versions, switch all at once', 'double resources briefly', 'instant rollback: switch back'],
    ['Rolling', 'replace one replica at a time', 'a little extra', 'BOTH versions live for a while'],
    ['Canary', '5% of traffic first, watch metrics', 'most infrastructure', 'the safest'],
    ['Recreate', 'stop all, start all', 'none', 'method 1: 5.3% here'],
  ], { co: 21, hl: [0] }) + box('Rolling means two versions talk to one database', 'Every schema change must work with the code still running: add a nullable column, deploy code that writes it, backfill, THEN make it NOT NULL (chapter 7).', 'cam') +
    flow([{ t: 'deploy 1', s: 'add a nullable column', mau: LAM }, { t: 'deploy 2', s: 'code writes it', mau: LAM }, { t: 'backfill', s: 'old rows', mau: CAM }, { t: 'deploy 3', s: 'NOT NULL, switch reads', mau: NODE }], { h: 110 }) },

  { t: 'A real trap: WebSockets do not roll', to: true, giua: true, body: cards([['An HTTP request', 'lasts milliseconds and finishes inside the grace period.'], ['A Socket.IO connection', 'lasts hours and is simply cut on every deploy.'], ['What the client saw (chapter 11)', 'a reconnect with a new socket id, rooms not rejoined, five messages sent meanwhile: zero received.']], 3) +
    box('Every deploy is a disconnect storm for realtime users', 'The fix is on the client: on reconnect, rejoin rooms and refetch what was missed. No deploy strategy fixes it for you.', 'do2') +
    sql(`socket.on('connect', () => {          // fires again after every reconnect
  socket.emit('rooms:rejoin', myRooms);    // rooms are NOT remembered across processes
  refetchMissedSince(lastSeenId);          // fill the gap from the database
});`, { lang: 'javascript', sm: false, hl: [2, 3] }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c17/prod-swap', 1, 11, 'grep in docker-compose.yml and deploy-nha.sh · real', { n: 104, hl: [2, 5, 6, 8, 10], sm: true }) +
    two(box('Right: nginx owns 80 and 443', 'Never restarted by a deploy — the property that matters most.', 'xanh'), box('The gap: backend recreated in place', 'up -d --no-build, then nginx reload, then health: method 1 behind a proxy.', 'cam')) +
    box('11/09/2026: the swap that broke everything', 'Recreated containers swapped IPs; nginx kept the old ones: 502 on both domains for 15 minutes — hence the reload right after the swap.', 'do2') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your deploy: docker compose up -d backend, then curl /health until 200. A colleague says "we do blue-green: the health check runs before we call it done". (1) Is it zero-downtime? (2) What single structural piece is missing? (3) In a blue-green swap behind nginx, when may you drop the old container?', '') +
    box('Hint', 'Slides 6, 8 and 11.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) No: compose recreates the one container in place — method 1, a hole on every deploy. Checking health AFTER the swap gates nothing. (2) Something long-lived holding the port (a proxy), with old and new running side by side. (3) After the new one passes its health check, the proxy is reloaded, and a short wait lets the old workers drain.', 'xanh')}</div>` },

  { t: 'Lesson 17.5 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['stop, then start', '16 / 301 failed (5.32%)', 'a closed port is an outage'],
    ['"blue-green", no proxy', '35 / 291 failed (12.03%)', 'the health check gates nothing without a proxy'],
    ['nginx, drop at once', '0 median · one 502 in 2 of 5', 'let the old workers drain'],
    ['nginx, wait 1 s', '0 in 5 of 5', 'a long-lived thing owns the address'],
    ['this website', 'nginx holds 80/443 · backend recreated', 'gate the switch, not the aftermath'],
  ], { co: 22 }) + box('Next: 17.6 — when the deploy lies: stale builds, smoke tests, rollback', 'Green checks, a healthy container, and a feature that is gone.', 'lam') },
]);
