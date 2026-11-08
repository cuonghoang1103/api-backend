/** Node.js · Lab 17 — Đưa Notes API lên server: soát Dockerfile (ảnh, cache, bí mật, PID 1, health), quyết định sau deploy (giữ / quay lui ảnh / sửa tiến lên). */
import { modul, cs, ord, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';
import { NAIVE, MULTI } from './_dockerfile-c17.mjs';

const L1 = cs({
  ten: 'Lab 17 · 1 — One deploy, in the order the website runs it', kho: 'EASY', phut: 6, loai: 'order', dangBai: 'lab',
  en: 'The build-elsewhere, swap-on-the-server flow of chapter 17 (deploy-nha.sh), with every guard in its place.',
  vi: 'Luồng build ở nơi khác, chỉ tráo trên server của chương 17 (deploy-nha.sh), với mọi chốt chặn đúng chỗ.',
  cau: [
    ord('o1', ['From a commit to “live and pushed”.', 'Từ một commit tới “đã chạy và đã đẩy”.'], [
      'Lock the SHA to deploy, and build both images from that commit only',
      'Check the image can really start (libc ↔ Prisma engine) before pushing',
      'Push the images tagged with the git SHA to the registry',
      'On the server: pull, then run the migrations with set -euo pipefail',
      'Swap the containers (the proxy keeps the port) and reload nginx',
      'Smoke-test every module route, inside and from outside through nginx',
      'Only then push that SHA to main',
    ], ['A green build does not mean the image runs (18/08: API 502 for seven minutes); a failed migrate must stop the swap; a tag that never moves is what makes rollback one command; the smoke test is the check that knows which features you shipped.', 'Build xanh không có nghĩa ảnh chạy được (18/08: API 502 bảy phút); migrate hỏng phải chặn bước tráo; thẻ không bao giờ di chuyển là thứ biến quay lui thành một lệnh; smoke test là phép kiểm biết bạn đã đưa lên những tính năng nào.']),
  ],
  goiY: [['Every step that can fail must come before the steps it would make dangerous.', 'Mọi bước có thể hỏng phải đứng trước các bước mà nó khiến trở nên nguy hiểm.'], ['Migrations before the swap; the swap before the smoke test.', 'Migration trước khi tráo; tráo trước smoke test.']],
  loi: [['Swapping before migrating: new code on the old schema.', 'Tráo trước khi migrate: mã mới trên lược đồ cũ.'], ['Tagging only :latest.', 'Chỉ gắn thẻ :latest.']],
  tns: [tn('registry', 'kho ảnh')],
  kn: ['deployment'],
});

function reviewDockerfile(text, scripts = {}) {
  const raw = text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const stages = [];
  for (const l of raw) { if (/^FROM\s/i.test(l)) stages.push([l]); else if (stages.length) stages[stages.length - 1].push(l); }
  const fin = stages[stages.length - 1];
  const is = (kw) => (l) => new RegExp(`^${kw}\\s`, 'i').test(l);
  const found = new Set();
  // 17.1 — thẻ ảnh phải là phiên bản chính xác hoặc digest
  const tag = (fin[0].split(/\s+/)[1].split('@')[0].split(':')[1]) || 'latest';
  if (!fin[0].includes('@sha256:') && !/^\d+\.\d+\.\d+(-|$)/.test(tag)) found.add('UNPINNED_TAG');
  for (const st of stages) {
    // 17.2 — COPY toàn bộ thư mục trước khi cài ⇒ mỗi commit chạy lại npm ci
    const inst = st.findIndex((l) => /^RUN\s.*\bnpm\s+(ci|install|i)\b/i.test(l));
    const all = st.findIndex((l) => /^COPY\s+(--\S+\s+)*\.\/?\s+\S+$/i.test(l));
    if (inst >= 0 && all >= 0 && all < inst) found.add('COPY_BEFORE_INSTALL');
    // 17.2 — ARG khai quá sớm: RUN đầu tiên sau nó không dùng nó
    st.forEach((l, i) => {
      const m = /^ARG\s+([A-Za-z_]\w*)/i.exec(l);
      if (!m) return;
      const run = st.slice(i + 1).find(is('RUN'));
      if (run && !new RegExp(`\\$\\{?${m[1]}\\b`).test(run)) found.add('ARG_TOO_EARLY');
    });
  }
  // 17.4 — bí mật đi theo ảnh (giai đoạn cuối)
  const SECRET = /(TOKEN|SECRET|PASSWORD|_KEY|APIKEY|DATABASE_URL)/i;
  if (fin.some((l) => (/^(ARG|ENV)\s+(\w+)/i.exec(l) || [])[2]?.match(SECRET) || /^COPY\s+(--\S+\s+)*\S*\.env(?!\.example)\S*\s/i.test(l))) found.add('SECRET_IN_IMAGE');
  // 17.3 — ai là PID 1?
  const arr = (l) => (l ? (l.replace(/^\S+\s+/, '').startsWith('[') ? JSON.parse(l.replace(/^\S+\s+/, '')) : ['/bin/sh', '-c']) : []);
  const ep = arr(fin.filter(is('ENTRYPOINT')).pop());
  const argv = ep.length ? ep : arr(fin.filter(is('CMD')).pop());
  const prog = (argv[0] || '').split('/').pop();
  let pidOk = prog === 'node' || prog === 'tini' || prog === 'dumb-init';
  if ((prog === 'sh' || prog === 'bash') && argv[1] !== '-c') {
    const body = (scripts[argv[1]] || scripts[String(argv[1]).replace(/^\.\//, '')] || '').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    pidOk = /^exec\s+(\S*\/)?node\b/.test(body[body.length - 1] || '');
  }
  if (!pidOk) found.add('NOT_EXEC_PID1');
  const users = fin.filter(is('USER'));
  if (!users.length || /^USER\s+(root|0)\s*$/i.test(users[users.length - 1])) found.add('ROOT_USER');
  if (!fin.some((l) => /^ENV\s+NODE_ENV(=|\s+)"?production"?\s*$/i.test(l))) found.add('NO_NODE_ENV');
  // 17.3 — healthcheck không có start-period ⇒ app khởi động chậm bị đánh dấu unhealthy
  if (fin.some((l) => is('HEALTHCHECK')(l) && !/^HEALTHCHECK\s+NONE/i.test(l) && !/--start-period=/i.test(l))) found.add('HEALTHCHECK_NO_START_PERIOD');
  const ORDER = ['UNPINNED_TAG', 'COPY_BEFORE_INSTALL', 'ARG_TOO_EARLY', 'SECRET_IN_IMAGE', 'NOT_EXEC_PID1', 'ROOT_USER', 'NO_NODE_ENV', 'HEALTHCHECK_NO_START_PERIOD'];
  return ORDER.filter((c) => found.has(c));
}
const PROD = `# syntax=docker/dockerfile:1
FROM node:22.23.4-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
FROM node:22.23.4-slim
RUN apt-get update && apt-get install -y --no-install-recommends tini && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY docker-entrypoint.sh ./
ARG GIT_SHA
RUN echo "$GIT_SHA" > version.txt
USER node
HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:3000/health/live', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
ENTRYPOINT ["/usr/bin/tini", "--", "sh", "docker-entrypoint.sh"]
CMD ["node", "src/index.js"]`;
const L2 = await jsBai({
  ten: 'Lab 17 · 2 — reviewDockerfile(text, scripts): one review that covers 17.1 to 17.4', kho: 'HARD', phut: 35, dangBai: 'lab',
  en: '<p>Review a Dockerfile before it reaches the server. Ignore blank lines and <code>#</code> comments; keywords are case-insensitive; the <b>final stage</b> runs from the last <code>FROM</code>. Return the codes found, in this order:</p><ol><li><code>UNPINNED_TAG</code> — the final <code>FROM</code> tag does not start with an exact <code>x.y.z</code> and there is no <code>@sha256:</code>;</li><li><code>COPY_BEFORE_INSTALL</code> — in any stage, a <code>COPY</code> of the whole context (source <code>.</code> or <code>./</code>, flags allowed) comes before that stage’s first <code>RUN … npm ci|install|i</code>;</li><li><code>ARG_TOO_EARLY</code> — in any stage, the first <code>RUN</code> after an <code>ARG X</code> does not reference <code>$X</code> or <code>${X}</code>;</li><li><code>SECRET_IN_IMAGE</code> — in the final stage, an <code>ARG</code>/<code>ENV</code> whose name contains TOKEN, SECRET, PASSWORD, _KEY, APIKEY or DATABASE_URL, or a <code>COPY</code> of a <code>.env…</code> file (not <code>.env.example</code>);</li><li><code>NOT_EXEC_PID1</code> — PID 1 (exec-form <code>ENTRYPOINT</code> if any, else <code>CMD</code>; shell form = <code>/bin/sh -c</code>) is not <code>node</code>, <code>tini</code> or <code>dumb-init</code>, except <code>sh</code>/<code>bash</code> running a script from <code>scripts</code> whose last command starts with <code>exec node</code> (or <code>exec /…/node</code>);</li><li><code>ROOT_USER</code>, <code>NO_NODE_ENV</code> — as in 17.1;</li><li><code>HEALTHCHECK_NO_START_PERIOD</code> — a final-stage <code>HEALTHCHECK</code> (not <code>NONE</code>) without <code>--start-period=</code>.</li></ol>',
  vi: '<p>Soát một Dockerfile trước khi nó tới server. Bỏ dòng trống và chú thích <code>#</code>; từ khoá không phân biệt hoa thường; <b>giai đoạn cuối</b> chạy từ <code>FROM</code> cuối cùng. Trả về các mã tìm thấy, theo thứ tự:</p><ol><li><code>UNPINNED_TAG</code> — thẻ của <code>FROM</code> cuối không bắt đầu bằng <code>x.y.z</code> chính xác và không có <code>@sha256:</code>;</li><li><code>COPY_BEFORE_INSTALL</code> — ở giai đoạn bất kỳ, một <code>COPY</code> toàn bộ context (nguồn <code>.</code> hoặc <code>./</code>, có thể kèm cờ) đứng trước <code>RUN … npm ci|install|i</code> đầu tiên của giai đoạn đó;</li><li><code>ARG_TOO_EARLY</code> — ở giai đoạn bất kỳ, <code>RUN</code> đầu tiên sau một <code>ARG X</code> không dùng <code>$X</code> hay <code>${X}</code>;</li><li><code>SECRET_IN_IMAGE</code> — ở giai đoạn cuối, một <code>ARG</code>/<code>ENV</code> có tên chứa TOKEN, SECRET, PASSWORD, _KEY, APIKEY hoặc DATABASE_URL, hoặc một <code>COPY</code> tệp <code>.env…</code> (không phải <code>.env.example</code>);</li><li><code>NOT_EXEC_PID1</code> — PID 1 (<code>ENTRYPOINT</code> dạng exec nếu có, không thì <code>CMD</code>; dạng shell = <code>/bin/sh -c</code>) không phải <code>node</code>, <code>tini</code> hay <code>dumb-init</code>, trừ <code>sh</code>/<code>bash</code> chạy một script trong <code>scripts</code> mà lệnh cuối bắt đầu bằng <code>exec node</code> (hoặc <code>exec /…/node</code>);</li><li><code>ROOT_USER</code>, <code>NO_NODE_ENV</code> — như bài 17.1;</li><li><code>HEALTHCHECK_NO_START_PERIOD</code> — một <code>HEALTHCHECK</code> ở giai đoạn cuối (không phải <code>NONE</code>) thiếu <code>--start-period=</code>.</li></ol>',
  goiY: [['Split into stages first ([[FROM…, …], …]); some rules loop over every stage, the rest look at the last one.', 'Chia thành các giai đoạn trước ([[FROM…, …], …]); vài luật duyệt mọi giai đoạn, số còn lại chỉ xem giai đoạn cuối.'], ['Collect codes in a Set, then return ORDER.filter((c) => set.has(c)) so the order is fixed.', 'Gom mã vào một Set, rồi trả ORDER.filter((c) => set.has(c)) để thứ tự cố định.']],
  loi: [['Reusing the 17.1 linter unchanged: it ignores the cache order, the ARG position, secrets and the health check.', 'Dùng lại nguyên bộ soát 17.1: nó bỏ qua thứ tự cache, vị trí ARG, bí mật và health check.'], ['Flagging the tini ENTRYPOINT as “not node”: tini is PID 1 on purpose, it forwards SIGTERM and reaps zombies.', 'Gắn cờ ENTRYPOINT tini là “không phải node”: tini ở PID 1 là cố ý, nó chuyển SIGTERM và dọn zombie.']],
  gt: ['The production file of this lab passes every rule: pinned base, install before source, ARG GIT_SHA right before its RUN, the registry token via a secret mount, tini at PID 1, a non-root user, NODE_ENV, and a liveness healthcheck written with node -e (slim has no curl) with a start period. The naive file fails five of the eight rules.', 'Tệp production của lab qua mọi luật: ảnh nền đã ghim, cài trước mã nguồn, ARG GIT_SHA ngay trước RUN của nó, token registry qua secret mount, tini ở PID 1, người dùng không phải root, NODE_ENV, và healthcheck liveness viết bằng node -e (slim không có curl) có start period. Tệp ngây thơ trượt năm trong tám luật.'],
  kn: ['Docker', 'review', 'parsing'],
  tns: [tn('code review', 'review mã'), tn('start period', 'thời gian khởi động', 'healthcheck failures do not count while booting')],
  dau: `/** review a Dockerfile against chapter 17 */
function reviewDockerfile(text, scripts = {}) {
  // Write your solution here
  const found = [];
  if (/FROM node:\\d+(\\s|$)/.test(text)) found.push('UNPINNED_TAG');
  if (/CMD \\["npm"/.test(text)) found.push('NOT_EXEC_PID1');
  if (!/USER /.test(text)) found.push('ROOT_USER');
  return found;
}
`,
  giai: '// Reference solution\n' + nguon(reviewDockerfile),
  cases: [
    { goi: goi('reviewDockerfile', NAIVE), moTa: ['The naive Dockerfile', 'Dockerfile ngây thơ'] },
    { goi: goi('reviewDockerfile', PROD, { 'docker-entrypoint.sh': '#!/bin/sh\nset -e\nmkdir -p /app/uploads\nexec "$@"\n' }), moTa: ['The lab’s production Dockerfile', 'Dockerfile production của lab'] },
    { goi: goi('reviewDockerfile', MULTI), an: true },
    { goi: goi('reviewDockerfile', 'FROM node:22-slim\nARG BUILD_TIME\nARG NPM_TOKEN\nWORKDIR /app\nCOPY --chown=node:node ./ /app\nRUN npm ci\nCOPY .env.production .\nENV NODE_ENV=production\nUSER node\nHEALTHCHECK CMD node -e "process.exit(0)"\nCMD ["sh", "start.sh"]', { 'start.sh': 'npx prisma migrate deploy\nnode dist/index.js' }), an: true },
    { goi: goi('reviewDockerfile', 'FROM node:22.23.4-slim@sha256:0d1e\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY src ./src\nARG GIT_SHA\nRUN echo ${GIT_SHA} > v.txt\nENV NODE_ENV production\nUSER 0\nHEALTHCHECK NONE\nCMD ["sh", "./start.sh"]', { 'start.sh': 'npx prisma migrate deploy\nexec node src/index.js\n' }), an: true },
  ],
});

function afterDeploy({ smoke, migrations, previousTag }) {
  // 1) smoke test: 404 = chưa gắn (build cũ / deploy dở), 502/503 = app không chạy
  const failing = smoke.filter((r) => r.status === 404 || r.status === 502 || r.status === 503).map((r) => `${r.route} ${r.status}`);
  if (!failing.length) return { action: 'keep', failing };
  // 2) quay lui được bằng ảnh chỉ khi có thẻ KHÔNG DI CHUYỂN để quay về
  if (!previousTag || previousTag === 'latest') return { action: 'rebuild-previous', failing, reason: 'no immutable tag to return to' };
  // 3) mã quay lui được, CSDL thì không: migration phá huỷ ⇒ sửa tiến lên
  const BAD = [[/\bDROP\s+(TABLE|COLUMN)\b|^DROP\b/i, 'drops data the old code reads'], [/\bRENAME\b/i, 'old code uses the old name'], [/\bALTER\s+COLUMN\s+\S+\s+(SET\s+DATA\s+)?TYPE\b/i, 'changes a type the old code expects'], [/\bSET\s+NOT\s+NULL\b|\bADD\s+COLUMN\b.*\bNOT\s+NULL\b(?!.*\bDEFAULT\b)/i, 'old code inserts rows without this column']];
  for (const sql of migrations) {
    const hit = BAD.find(([rx]) => rx.test(sql));
    if (hit) return { action: 'roll-forward', failing, reason: hit[1] };
  }
  return { action: 'rollback-image', failing, to: previousTag };
}
const SM = (o) => Object.entries(o).map(([route, status]) => ({ route, status }));
const L3 = await jsBai({
  ten: 'Lab 17 · 3 — afterDeploy(state): keep, roll back the image, or roll forward?', kho: 'HARD', phut: 20, dangBai: 'lab',
  en: '<p>The deploy is done; decide what happens next. <code>state = { smoke, migrations, previousTag }</code>: <code>smoke</code> are <code>{ route, status }</code> results of the smoke test, <code>migrations</code> the SQL applied by this deploy, <code>previousTag</code> the tag of the image that ran before (or <code>null</code>). <code>failing</code> = the smoke results with status 404, 502 or 503, as <code>"&lt;route&gt; &lt;status&gt;"</code>. Return, checking in order:</p><ol><li>no failing route → <code>{ action: "keep", failing }</code>;</li><li><code>previousTag</code> missing or <code>"latest"</code> → <code>{ action: "rebuild-previous", failing, reason: "no immutable tag to return to" }</code>;</li><li>a migration that is not additive (the four rules of 17.6: drop table/column, rename, change type, set NOT NULL / add NOT NULL column without DEFAULT) → <code>{ action: "roll-forward", failing, reason: &lt;why of the first such statement&gt; }</code> with the same <code>why</code> texts as 17.6;</li><li>otherwise → <code>{ action: "rollback-image", failing, to: previousTag }</code>.</li></ol>',
  vi: '<p>Deploy xong rồi; quyết định việc tiếp theo. <code>state = { smoke, migrations, previousTag }</code>: <code>smoke</code> là kết quả <code>{ route, status }</code> của smoke test, <code>migrations</code> là SQL lần deploy này đã chạy, <code>previousTag</code> là thẻ của ảnh chạy trước đó (hoặc <code>null</code>). <code>failing</code> = các kết quả smoke có status 404, 502 hoặc 503, dạng <code>"&lt;route&gt; &lt;status&gt;"</code>. Trả về, xét theo thứ tự:</p><ol><li>không route nào hỏng → <code>{ action: "keep", failing }</code>;</li><li><code>previousTag</code> thiếu hoặc là <code>"latest"</code> → <code>{ action: "rebuild-previous", failing, reason: "no immutable tag to return to" }</code>;</li><li>có migration không phải cộng thêm (bốn luật của 17.6: xoá bảng/cột, đổi tên, đổi kiểu, đặt NOT NULL / thêm cột NOT NULL không DEFAULT) → <code>{ action: "roll-forward", failing, reason: &lt;why của câu đầu tiên như thế&gt; }</code> với cùng các chuỗi <code>why</code> như 17.6;</li><li>còn lại → <code>{ action: "rollback-image", failing, to: previousTag }</code>.</li></ol>',
  goiY: [['Reuse rollbackSafety’s four rules from 17.6.', 'Dùng lại bốn luật của rollbackSafety ở 17.6.'], ['The order of the checks is the decision: no point checking migrations when there is no image to return to.', 'Thứ tự các phép kiểm chính là quyết định: không cần xét migration khi không có ảnh nào để quay về.']],
  loi: [['Rolling back the image after a migration that dropped a column: old code against a new schema, worse than the bug.', 'Quay lui ảnh sau migration đã xoá cột: mã cũ chạy trên lược đồ mới, tệ hơn cả lỗi.'], ['Treating 401 as failing: it proves the route is mounted.', 'Coi 401 là hỏng: nó chứng minh route đã gắn.']],
  gt: ['Roll back first, investigate afterwards — but a rollback is a choice with a cost, not a free undo button: the new feature leaves with the bug, and the database does not roll back with the code. An immutable tag makes it one 0.82-second command; an additive migration makes it safe.', 'Quay lui trước, điều tra sau — nhưng quay lui là một lựa chọn có giá, không phải nút hoàn tác miễn phí: tính năng mới đi theo lỗi, và CSDL không quay lui cùng mã. Thẻ bất biến biến nó thành một lệnh 0,82 giây; migration cộng thêm làm nó an toàn.'],
  kn: ['deployment', 'rollback', 'decision'],
  tns: [tn('immutable tag', 'thẻ bất biến', 'a tag that never moves, e.g. the git SHA')],
  dau: `/** what to do after the deploy */
function afterDeploy({ smoke, migrations, previousTag }) {
  // Write your solution here
  const failing = smoke.filter((r) => r.status >= 400).map((r) => r.route + ' ' + r.status);
  if (!failing.length) return { action: 'keep', failing };
  return { action: 'rollback-image', failing, to: previousTag };
}
`,
  giai: '// Reference solution\n' + nguon(afterDeploy),
  cases: [
    { goi: goi('afterDeploy', { smoke: SM({ '/api/v1/system/health': 200, '/api/v1/notes': 401, '/api/v1/reports': 404 }), migrations: ['ALTER TABLE reports ADD COLUMN owner_id int;'], previousTag: 'a1f3c9e' }), moTa: ['Stale build, additive migration, SHA tag', 'Build cũ, migration cộng thêm, thẻ SHA'] },
    { goi: goi('afterDeploy', { smoke: SM({ '/api/v1/system/health': 200, '/api/v1/notes': 401, '/api/v1/reports': 401 }), migrations: [], previousTag: 'a1f3c9e' }), moTa: ['Everything mounted', 'Mọi thứ đã gắn'] },
    { goi: goi('afterDeploy', { smoke: SM({ '/api/v1/reports': 404 }), migrations: ['CREATE INDEX x ON reports(owner_id);', 'ALTER TABLE reports DROP COLUMN legacy_owner;'], previousTag: '7d2e801' }), an: true },
    { goi: goi('afterDeploy', { smoke: SM({ '/api/v1/feed': 502 }), migrations: [], previousTag: 'latest' }), an: true },
    { goi: goi('afterDeploy', { smoke: SM({ '/api/v1/feed': 503, '/api/v1/gifs': 404 }), migrations: ['ALTER TABLE notes ADD COLUMN status text NOT NULL DEFAULT \'draft\';'], previousTag: '7d2e801' }), an: true },
  ],
});

export default modul('nodejs-17-lab-trien-khai', 'Lab 17 — Shipping the Notes API: review the Dockerfile, decide after the deploy', [L1, L2, L3]);
