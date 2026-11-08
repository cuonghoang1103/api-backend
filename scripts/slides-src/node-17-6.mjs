/**
 * node-17-6 — Node.js · Chapter 17 · Lesson 17.6 "When the deploy lies: stale builds, smoke tests, rollback" (slide EN, đợt 12 — 08/11/2026).
 * MỘT deck, HAI tập: node-17-6 (17.6a, slide 1–10) · node-17-6-2 (17.6b, slide 11–20).
 * Nguồn: nodejs-17-6-deploy-hong-quay-lui. Output THẬT: that/c17/{prod-curl, stale, setflags, rollback, prod-smoke} (curl công khai cuongthai.com chỉ đọc;
 *   tái hiện build cũ bằng app Express 5 nhỏ trong Docker Desktop 29.8.0).
 * Khác web: hôm nay /api/v1/gifs trả 401 (đã sống lại) — 404 là của ngày sự cố 02/07/2026, tái hiện cục bộ · website: smoke test nay đọc 78 route từ deploy.sh,
 *   chạy bởi deploy-nha.sh (đường chuẩn từ 18/08/2026), + kiểm TỪ NGOÀI sau sự cố 11/09 (smoke trong container báo "sạch (52 route)" lúc hai tên miền 502).
 */
import { lamDeck, two, box, cards, flow, bang, TT, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-17-6', code: 'NODE 17.6', title: 'When the deploy lies: stale builds, smoke tests, rollback', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 17 — Docker and deployment', bai: '17.6' }, [
  { cover: true, t: 'When the deploy lies:<br>stale builds, smoke tests, rollback', sub: 'The deploy printed green, the container is healthy, /health returns 200 — and a feature that worked yesterday is gone.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A real incident on this website, and the five-second diagnosis</li>
<li>200, 401, 404, 502: what each one tells you about a route</li>
<li>A smoke test that fails the deploy when a route is missing</li>
<li>How builds go stale, and why :latest cannot be rolled back</li>
<li>Rollback — and the order to check things when a deploy fails</li>
</ul>` + box('Why it matters to you', '"Healthy" is a much weaker claim than it sounds. This lesson is about the failures that get past every check you already have.', 'lam') },

  { t: 'The incident: 2026-07-02', to: true, giua: true, body: cards([['What users reported', 'The GIF picker stopped working. Chat history had "disappeared". Both worked the day before. Logging in again did not help.'], ['What every check said', 'The container was up. The health check passed. dist/routes/gifs.routes.js existed inside the image.'], ['What was true', 'A partial deploy had shipped a stale dist/index.js that never mounted /api/v1/gifs.']], 3) +
    flow([{ t: 'deploy: green', s: 'no error printed', mau: NODE }, { t: 'container: Up', s: 'healthy', mau: NODE }, { t: '/health: 200', s: 'one route', mau: NODE }, { t: '/gifs: gone', s: 'users see it', mau: DO }], { h: 130 }) +
    box('Every green signal was true', 'Each check answered its own narrow question correctly. None of them asked: "is every feature I shipped actually reachable?"', 'cam') },

  { t: 'The diagnosis took one command', to: true, giua: true, body: B(`curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/gifs              # that day: 404
curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/messages/threads   # that day: 401`, { sm: false }) +
    TT('c17/prod-curl', 1, 8, 'the same commands today, 08/11/2026 · public, read-only · real', { n: 104, hl: [2, 4, 6, 8], sm: false }) +
    box('No login, no body — just the status code', 'Today /gifs answers 401: mounted again. On 2026-07-02 it answered 404 while /messages/threads answered 401. That difference was the whole diagnosis.', 'cam') },

  { t: 'What a status code says about a route', to: true, giua: true, body: bang(['code', 'meaning for the route', 'so the problem is…'], [
    ['200', 'mounted and public', 'not here — it is alive'],
    ['401 / 403', 'MOUNTED, it just wants credentials', 'elsewhere: your data, your token, your client'],
    ['404', 'does NOT exist in the running process', 'a stale build or a half-finished deploy'],
    ['502 / 503', 'the proxy is alive, the app is not', 'the container: read its logs, not the route\'s'],
  ], { co: 23, hl: [1, 2] }) + two(box('Worth memorising', 'It costs five seconds and answers the question people spend hours on: "is my code even running?"', 'xanh'), box('Here 401 is GOOD news', 'It proves the route exists in the running process. The bug, if any, is in what you send it.', 'lam')) },

  { t: 'Diagnose with curl, not with the browser', to: true, giua: true, body: cards([['The browser sends cookies', 'You are logged in, so a 401 never shows — you see a broken page instead.'], ['It follows redirects and caches', 'An old response, or the login page, can stand in for the real answer.'], ['It shows one error page for all four', '404, 401, 502 and 503 all become "something went wrong".']], 3) +
    box('curl -s -o /dev/null -w "%{http_code}"', 'No cookies, no cache, no redirects: the status code and nothing else. Exactly the distinction you need.', 'lam') +
    box('Two causes, one symptom', 'The "missing chat history" turned out to be a separate bug the same day: nothing was lost, a per-viewer deletedAt filter hid it. Measure each symptom; do not assume one cause.', 'cam') },

  { t: 'Reproduced: new code on disk, old image running', to: true, giua: true, body: TT('c17/stale', 2, 10, 'yesterday\'s image a1f3c9e still running; today\'s src/index.js (with /gifs) on disk · real', { n: 104, hl: [3, 6, 8, 10], sm: false }) +
    two(box('/health: 200', 'The health check hits one route, and that route was fine.', 'xanh'), box('/messages 401, /gifs 404', 'One is mounted, one is not — in the same process. That pair is the signature of a stale build.', 'do2')) },

  { t: 'Why the health check stayed green', to: true, giua: true, body: flow([{ t: 'health check', s: 'GET /health', mau: NODE }, { t: 'one route', s: 'proves one route', mau: NODE }, { t: '78 other routes', s: 'never asked', mau: CAM }, { t: 'a missing module', s: 'invisible', mau: DO }], { h: 130 }) +
    two(box('A health check answers "is the process alive?"', 'It was designed to be cheap and narrow (chapter 15). It was never meant to prove that every feature shipped.', 'lam'), box('A smoke test answers "did the deploy deliver everything?"', 'One request per module, right after the deploy. A different question needs a different check.', 'xanh')) +
    bang(['check', 'asks', 'runs', 'fails when'], [['liveness /health', 'is the process alive?', 'every 15 s, forever', 'the process hangs or dies'], ['smoke test', 'is every module mounted?', 'once, right after a deploy', 'any route returns 404']], { co: 22 }) },

  { t: 'The guard: smoke-test that routes are mounted', to: true, giua: true, body: B(`smoke_failed=false
for route in gifs messages/threads notes; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4770/api/v1/$route")
  echo "  /api/v1/$route  $code"
  if [ "$code" = "404" ]; then
    echo "  FAIL: /api/v1/$route returned 404 — stale build or half-finished deploy"
    smoke_failed=true
  fi
done
$smoke_failed && exit 1 || echo "  smoke test clean"`, { sm: true, hl: [5, 10] }) +
    TT('c17/stale', 12, 17, 'bash smoke.sh against the stale container · real', { n: 104, hl: [3, 6], sm: true }) },

  { t: 'Which routes belong in that list', to: true, giua: true, body: cards([['Only param-less GET routes', 'that answer non-404 to a bare, unauthenticated request: 401 or 200 both mean "mounted".'], ['Never POST-only routes', '/auth/login or /stickers answer 404 to a GET — every deploy would fail for the wrong reason.'], ['Add one per new module', 'The moment you add a feature is the moment the guard is cheapest to extend — and the moment it is forgotten.']], 3) +
    box('A check that cries wolf gets deleted', 'Within a week. A false alarm on every deploy is worse than no check: it trains everyone to ignore red.', 'do2') +
    box('This website: 78 routes, from inside AND outside', 'The list in deploy.sh has 78 routes. On 11/09/2026 the inside check said "clean (52 routes)" while both domains returned 502 — so a check from outside, through nginx, was added.', 'lam') },

  { t: 'How a build goes stale in the first place', to: true, giua: true, body: cards([['The deploy only synced, never rebuilt', 'Exactly the incident: new source on disk, old image in the container.'], ['A cache hit it should not have had', 'A COPY declared too narrowly makes Docker believe nothing changed (17.2).'], ['The build passed, the push failed', 'The registry keeps the old tag; docker pull silently pulls the same old image back.'], ['Tag :latest', 'You cannot say which image is running, and "the previous one" has no name to go back to.']], 2) +
    box('The rule that follows', 'Tag every image with something that never moves: the git SHA or a version. app:7d2e801 says which commit is in production; app:latest says nothing.', 'xanh') },

  { t: ':latest moves; a SHA tag does not', to: true, giua: true, body: TT('c17/rollback', 2, 3, 'image ids behind each tag, after two deploys · real', { n: 104, hl: [2], sm: false }) +
    cards([['Yesterday', 'latest and a1f3c9e point to the same image (8058483267b0).'], ['Today', 'latest moved to 8d4484873ed5. a1f3c9e still points to yesterday.'], ['So', 'Rolling back to a1f3c9e is one command. Rolling back to "the previous latest" is impossible: nothing points to it.']], 3) +
    B(`docker build -t api:7d2e801 -t api:latest .   # tag with the commit, AND latest if you like
docker image ls api                              # every SHA tag is a version you can return to`, { sm: false }) },

  { t: 'Rollback: by image, or by code', to: true, giua: true, body: B(`# by IMAGE — fastest: start the previous tag
docker run -d --name api -p 4771:3000 node17-api:a1f3c9e

# by CODE — slower, keeps git history straight
git revert <bad_sha>     # then the checklist, then deploy as usual`, { sm: false, hl: [2, 5] }) +
    TT('c17/rollback', 5, 7, 'the same tiny app, rolled back both ways · median · real', { n: 104, hl: [1, 2], sm: false }) +
    box('0.82 s against 5.05 s here', 'On a real backend the rebuild is minutes; this website measured ~40 s by re-tagging an old image, against a 15-minute rebuild.', 'cam') },

  { t: 'Reverting code does not revert the database', to: true, giua: true, body: two(box('The trap', 'If the bad deploy ran a migration, the schema already changed. The old image now runs old code against a new schema — which can be worse than the bug you rolled back from.', 'do2'),
    box('One-way steps', 'Dropping a column or changing a type makes the way back unsafe. Data written by the bad version does not un-write itself.', 'cam')) +
    flow([{ t: 'add nullable', s: 'old code ignores it', mau: NODE }, { t: 'write it', s: 'new code', mau: NODE }, { t: 'backfill', s: 'old rows', mau: LAM }, { t: 'switch reads', s: 'still reversible', mau: LAM }, { t: 'only then remove', s: 'the one-way step, last', mau: CAM }], { h: 120 }) +
    box('Why chapter 7 insisted on additive migrations', 'Every step of that sequence can be undone on its own — so a rollback stays possible at every moment.', 'lam') },

  { t: 'The order to check when a deploy fails', to: true, giua: true, body: steps([
    '<b>Is the container running?</b> docker ps. Exit 137 = killed: out of memory, or the grace period ran out (17.3)',
    '<b>Did it say anything as it died?</b> docker logs --tail=50. A missing environment variable surfaces here (17.4)',
    '<b>Is the route mounted?</b> curl for 401 vs 404 — separates a stale build from everything else',
    '<b>Did the migrations apply?</b> prisma migrate status. P3009 = a failed migration BLOCKING every later deploy',
    '<b>Still nothing?</b> ROLL BACK FIRST, investigate afterwards. Production is not the place to debug',
  ]) + box('Step 5 is the one people learn the hard way', 'Under pressure the instinct is to find the cause first — and every minute of that is a minute of outage. Roll back, confirm healthy, reproduce somewhere else.', 'do2') },

  { t: 'A real trap: the script that keeps going', to: true, giua: true, body: TT('c17/setflags', 2, 19, 'the same three-step deploy script, three sets of shell flags · the migrate step fails on purpose · real', { n: 104, hl: [6, 13, 18], sm: true }) +
    box('set -e alone is not enough', 'migrate | tee "succeeded", so the script swapped anyway. pipefail closes that.', 'do2') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c17/prod-smoke', 3, 18, 'grep in deploy-nha.sh, deploy.sh and the project\'s CLAUDE.md · real', { n: 104, hl: [2, 4, 6, 8, 10, 12, 13], sm: true }) +
    two(box('The guard is real', '78 routes, run by deploy-nha.sh after every swap, plus a check from outside since 11/09. Images are tagged by commit SHA.', 'xanh'), box('Scars written down', '18/08: a green build that could not start — 502 for seven minutes; re-tagging the old image took ~40 s, not a 15-minute rebuild.', 'lam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'After a deploy, users say "the new Reports page shows an error". The container is Up, /health is 200. (1) What two curl commands tell you, in five seconds, whether the build is stale? (2) It is stale and the deploy ran a migration that dropped a column. Is "start the previous image" safe? (3) What change stops this deploy shipping green next time?', '') +
    box('Hint', 'Slides 5, 14 and 9.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) curl -s -o /dev/null -w "%{http_code}" on /api/v1/reports and on a known older route: 404 vs 401 = the new module is not mounted. (2) No — the old code expects the dropped column; restore the schema (or roll forward with a fix) first. Drops belong last, after nothing reads the column. (3) Add a GET route of the Reports module to the smoke-test list, so a 404 fails the deploy.', 'xanh')}</div>` },

  { t: 'Lesson 17.6 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['stale build', '/health 200 · /messages 401 · /gifs 404', 'curl the route, not the browser'],
    ['smoke test', 'one 404 ⇒ exit 1', 'every module, one GET, every deploy'],
    ['tags', 'latest moved · a1f3c9e did not', 'tag with the git SHA'],
    ['rollback', 'image 0.82 s · rebuild 5.05 s', 'roll back first; mind the schema'],
    ['shell flags', 'no flags / set -e + pipe: swapped anyway', 'set -euo pipefail'],
  ], { co: 22 }) + box('Next: chapter 18 — architecture', 'Layers, coupling, monolith or services — measured on the same backend.', 'lam') },
]);
