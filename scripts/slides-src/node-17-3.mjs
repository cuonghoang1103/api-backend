/**
 * node-17-3 — Node.js · Chapter 17 · Lesson 17.3 "PID 1: the CMD line that loses every in-flight request" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-17-3.
 * Nguồn: nodejs-17-3-pid-1-tat-em. Output THẬT: that/c17/{pid1, grace, entry, health, prod-image} (Docker Desktop 29.8.0, node:22-slim, app mẫu c17/app).
 * Khác web: `docker stop` MẶC ĐỊNH ở máy quay giết sau 3,14 s (3/3, đo bằng PID 1 = sleep) — web ghi 1,26 s trên 29.5.3, tài liệu Docker Engine ghi 10 s ⇒ cùng kết luận
 *   "đặt rõ, đừng thừa kế"; request 3 s vẫn sống ở mặc định 3,14 s, request 5 s thì mất (0/3) · shell form: PID 1 = /bin/sh, bị SIGKILL sau 3,15 s, exit 137 ·
 *   Docker trơn KHÔNG tự khởi động lại container unhealthy (restart count 0) — web nói "bị restart mãi" (chỉ đúng với Swarm/Kubernetes/autoheal; đã sửa ở nguồn).
 */
import { lamDeck, two, box, cards, flow, bang, TT, steps, sql, tep } from './_c9-chung.mjs';

export const deck = { key: 'node-17-3', code: 'NODE 17.3', title: 'PID 1: the CMD line that loses every in-flight request', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const D = (src, o = {}) => sql(src, { lang: 'dockerfile', sm: o.sm ?? true, hl: o.hl });
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });
const Y = (src, o = {}) => sql(src, { lang: 'yaml', sm: o.sm ?? true, hl: o.hl });
const JS = (src, o = {}) => sql(src, { lang: 'javascript', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.3' }, [
  { cover: true, t: 'PID 1: the CMD line that loses<br>every in-flight request', sub: 'Your graceful shutdown handler can be correct and still never run in production — because of how one line of the Dockerfile is written.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Who is PID 1 — three ways to write CMD, measured</li>
<li>What it costs: a request in flight during a deploy</li>
<li>The grace period, and the default that is not what you think</li>
<li>When you really need a script first: exec, and --init</li>
<li>Health checks an orchestrator can act on — and what Docker does NOT do</li>
</ul>` + box('Why it matters to you', 'Every deploy stops the old container. Whether the users in the middle of a request get an answer is decided right here.', 'lam') },

  { t: 'Who is PID 1?', to: true, giua: true, body: flow([{ t: 'docker stop', s: 'or a deploy', mau: TIM }, { t: 'SIGTERM', s: 'to process 1 ONLY', mau: CAM }, { t: 'PID 1', s: 'whatever CMD started', mau: LAM }, { t: 'your Node app?', s: 'only if PID 1 IS node', mau: NODE }], { h: 130 }) +
    D(`CMD ["npm", "start"]          # PID 1 = npm
CMD node src/index.js         # PID 1 = /bin/sh  (shell form!)
CMD ["node", "src/index.js"]  # PID 1 = node     (exec form)`, { sm: false, hl: [3] }) +
    box('SIGTERM = "please stop"', 'A signal is a short message from the operating system. SIGTERM asks politely and can be caught; SIGKILL cannot be caught and ends the process immediately.', 'lam') },

  { t: 'Three CMD lines, one image, measured', to: true, giua: true, body: TT('c17/pid1', 4, 20, 'same node:22-slim image + app · docker stop · real', { n: 104, hl: [2, 4, 8, 10, 14, 17], sm: true }) +
    box('Only the exec form printed "SIGTERM received"', 'The handler was in the code all along. In the other two it simply never got the signal.', 'cam') },

  { t: 'Why the other two never heard it', to: true, giua: true, body: cards([['npm start', 'npm is PID 1. It got SIGTERM, died at once ("npm error signal SIGTERM") and took its child down. Node was never asked to shut down. Exit code 1 after 0.68 s.'], ['shell form', '/bin/sh is PID 1 and does NOT forward signals to its children. Node heard nothing; after the grace period Docker sent SIGKILL. Exit 137 after 3.15 s.'], ['exec form', 'node IS PID 1. It got SIGTERM, ran the handler: stop accepting, finish, close the pool, exit 0 in 0.13 s.']], 3) +
    box('Exit code 137 = 128 + 9', '9 is SIGKILL. In deploy logs, 137 means one of two things: the grace period ran out (this lesson) or the out-of-memory killer (chapter 16).', 'do2') },

  { t: 'What it costs: a request in flight', to: true, giua: true, body: TT('c17/grace', 2, 10, 'GET /slow takes 3 s · docker stop -t 5 one second in · real', { n: 104, hl: [3, 7], sm: false }) +
    two(box('npm start: the user gets nothing', 'curl exit 52 — the connection was cut mid-request. The same deploy, the same instant.', 'do2'), box('exec form: the user gets the answer', '{"done":true}, HTTP 200 after 3.14 s, then the process exits 0.', 'xanh')) },

  { t: 'The second half: the grace period', to: true, giua: true, body: flow([{ t: 'SIGTERM', s: 't = 0', mau: CAM }, { t: 'grace period', s: 'your app finishes up', mau: LAM }, { t: 'SIGKILL', s: 'cannot be caught', mau: DO }, { t: 'exit 137', s: 'whatever was in flight is lost', mau: DO }], { h: 130 }) +
    box('Getting the signal is necessary, not sufficient', 'Docker waits a fixed time after SIGTERM, then kills. If the slowest request needs longer than that, it dies with the process — even though the app did everything right.', 'cam') +
    two(box('docker stop -t N, or stop_grace_period', 'N seconds of grace. -t 0 means no grace at all.', 'lam'), box('Who sends SIGTERM in real life', 'docker stop, docker compose up recreating a container, a Kubernetes rolling update: every deploy.', 'lam')) },

  { t: 'Grace period, measured with a 3-second request', to: true, giua: true, body: TT('c17/grace', 12, 16, 'CMD ["node",…] · one 3-second request · stop 1 s in · 3 runs each · real', { n: 104, hl: [3], sm: false }) +
    two(box('-t 0: lost, 0 of 3', 'SIGKILL straight away. Exit 137 in 0.15 s.', 'do2'), box('default, 5, 10: answered, 3 of 3', 'The process exits by itself after ~2.1 s — as soon as the request finishes. A longer grace costs nothing when it is not needed.', 'xanh')) +
    box('Why the default was enough here', 'The request only needed about two more seconds after the stop. The next slide gives it more work than that.', 'cam') },

  { t: 'How long IS the default?', to: true, giua: true, body: TT('c17/grace', 18, 23, 'PID 1 = sleep (ignores SIGTERM) · then a 5-second request · real', { n: 104, hl: [2, 5], sm: true }) +
    bang(['where', 'default grace', 'source'], [['this machine: Docker Desktop 29.8.0', '3.14 s (3 of 3)', 'measured above'], ['the web lesson: Docker 29.5.3', '1.26 s', 'measured there'], ['Docker Engine documentation', '10 s', 'the commonly quoted number']], { co: 20, hl: [0] }) +
    box('Three numbers for "the default"', 'Which is exactly why you set it explicitly instead of inheriting it. Here a 5-second request died with the default and lived with -t 10.', 'cam') },

  { t: 'A graceful shutdown, step by step', to: true, giua: true, body: JS(tep('c17/app/src/index.js', 34, 41), { sm: true, hl: [1, 3, 4, 6] }) +
    steps(['<b>SIGTERM to PID 1</b> — must be node: exec form', '<b>Stop accepting</b> new connections — server.close()', '<b>Let in-flight requests finish</b> — the reason this exists', '<b>Close the DB pool, the queue workers</b> — return half-done jobs (ch. 13)', '<b>process.exit(0)</b> — before the grace period runs out']) },

  { t: 'Set the grace period explicitly', to: true, giua: true, body: Y(`# docker-compose.yml
services:
  backend:
    stop_grace_period: 30s   # explicit — never inherit a default you never measured`, { sm: false, hl: [4] }) +
    B(`docker stop -t 30 backend                              # the same thing, by hand
docker inspect -f '{{.Config.StopTimeout}}' backend    # <nil> = inherited default`, { sm: false }) +
    cards([['Longer than the slowest request', 'An upload, a report, an AI call. If it can take 20 s, 10 s of grace drops it.'], ['Longer than the app\'s own timer', 'If the app force-exits after 30 s, give Docker more than 30 s, or Docker kills it first.'], ['Not unlimited', 'A stuck process must still die. The grace is a ceiling, not a wait — a healthy app exits as soon as it is done.']], 3) },

  { t: 'When you genuinely need a script first', to: true, giua: true, body: two(B(`#!/bin/sh
# start.sh: migrate, then the app
npx prisma migrate deploy
exec node dist/index.js`, { sm: false, hl: [4] }),
    box('exec', 'Replaces the shell process with node instead of starting a child. node becomes PID 1 and receives signals directly. Without it, sh stays PID 1 — back to the shell-form row.', 'xanh') +
    box('or: docker run --init', 'Docker puts a tiny init (tini) at PID 1 that forwards signals to your app.', 'lam')) +
    flow([{ t: 'without exec', s: 'PID 1 sh → PID 8 node', mau: DO }, { t: 'SIGTERM', s: 'stops at sh', mau: CAM }, { t: 'with exec', s: 'PID 1 node', mau: NODE }, { t: 'SIGTERM', s: 'reaches the app', mau: NODE }], { h: 120 }) },

  { t: 'exec, measured', to: true, giua: true, body: TT('c17/entry', 2, 10, 'two entrypoint scripts that differ by one word · docker stop -t 5 · real', { n: 104, hl: [2, 3, 7, 9], sm: false }) +
    two(box('Without exec', 'PID 1 = sh. Node never logged SIGTERM; killed after the full 5 s, exit 137.', 'do2'), box('With exec', 'PID 1 = node. SIGTERM received, closed, exit 0 in 0.23 s.', 'xanh')) },

  { t: 'A real trap: PID 1 also buries the dead', to: true, giua: true, body: TT('c17/entry', 12, 17, 'zombie.js leaves 20 orphaned children (like ffmpeg or yt-dlp called through a shell) · real', { n: 104, hl: [3, 6], sm: false }) +
    cards([['Who reaps orphans', 'When a child\'s parent exits first, the child is handed to PID 1, which must "reap" it when it ends. init does this; node does not.'], ['Zombies', 'Finished processes nobody reaped: 12 here after 2.5 s. They pile up until the process table is full.'], ['--init', 'tini at PID 1 reaps them: 0 zombies. If your app never spawns anything, node as PID 1 is fine.']], 3) },

  { t: 'Health checks an orchestrator can act on', to: true, giua: true, body: D(`HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \\
  CMD node -e "fetch('http://127.0.0.1:3000/health/live')
    .then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"`, { sm: false, hl: [1] }) +
    cards([['--start-period', 'While the app boots, failures do not count. The parameter people omit.'], ['the liveness URL', 'Not one that touches the database (chapter 15) — or a DB blip marks every container unhealthy at once.'], ['node -e, not curl', 'slim images have no curl (slide 10 of 17.1). The check must exist inside the image.']], 3) +
    two(box('Liveness: "is the process alive?"', 'Answers without touching anything shared. Failing it means: restart me.', 'xanh'), box('Readiness: "can I take traffic?"', 'May check the database. Failing it means: send traffic elsewhere for now (chapter 15).', 'lam')) },

  { t: '--start-period, measured · what Docker does NOT do', to: true, giua: true, body: TT('c17/health', 2, 8, 'an app that needs 12 s to boot · interval 2 s · retries 3 · restart: unless-stopped · real', { n: 104, hl: [3, 7], sm: false }) +
    two(box('Without --start-period: "unhealthy" at 6 s', 'for a service that is merely still booting. Anything that waits for "healthy" (compose depends_on, a deploy script) sees a failure.', 'cam'),
      box('Plain Docker does not restart it', 'Restart count 0: restart policies react to EXIT, not to health. Swarm, Kubernetes or an autoheal tool are what kill unhealthy containers.', 'lam')) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c17/prod-pid1', 1, 16, 'grep in Dockerfile.backend, docker-compose.yml, src/index.ts · real', { n: 104, hl: [3, 6, 8, 9, 11, 14, 16], sm: true }) +
    two(box('Right: tini at PID 1, then exec', 'tini → fix-uploads-perms.sh → exec "$@": node gets SIGTERM, zombies get reaped.', 'xanh'), box('Two gaps', 'No stop_grace_period for the backend (only nginx) while the app waits up to 30 s; the healthcheck runs SELECT 1.', 'cam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Dockerfile ends with CMD npm run start:prod, where start:prod is "prisma migrate deploy && node dist/index.js". Your slowest route takes 8 s. (1) Who is PID 1, and does your SIGTERM handler run? (2) Rewrite the start so it does. (3) What do you set, and to at least how much?', '') +
    box('Hint', 'Slides 5, 12 and 11.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) npm is PID 1 (with a shell under it): it dies on SIGTERM and kills node — the handler never runs. (2) A start.sh that runs the migration and ends with exec node dist/index.js, with CMD ["sh", "start.sh"] — or keep npm and add --init / tini. (3) stop_grace_period (or docker stop -t), comfortably above 8 s and above the app\'s own force-exit timer.', 'xanh')}</div>` },

  { t: 'Lesson 17.3 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['CMD ["npm","start"]', 'no SIGTERM in the app · request cut', 'exec form: CMD ["node", …]'],
    ['CMD node … (shell)', 'PID 1 = sh · SIGKILL · exit 137', 'never the shell form for the app'],
    ['default grace', '3.14 s here · 5 s request lost', 'stop_grace_period, explicitly'],
    ['entry script', 'without exec: 137 · with exec: 0', 'end it with exec'],
    ['unhealthy', 'restart count 0', 'Docker restarts on exit, not on health'],
  ], { co: 22 }) + box('Next: 17.4 — secrets that are still there after you deleted them', 'docker history, a password in Config.Env, and the secret mount that leaves nothing behind.', 'lam') },
]);
