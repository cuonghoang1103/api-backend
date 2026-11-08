/** Node.js 17.4 — Bí mật: rm không xoá gì, ARG/ENV lộ trong history và Config.Env, secret mount, biến môi trường lúc chạy, kiểm cấu hình lúc khởi động. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Still there after you deleted it', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.4 (every secret value in the lesson is fake).',
  vi: 'Câu hỏi về bài 17.4 (mọi giá trị bí mật trong bài đều là giả).',
  cau: [
    q('c1', ['RUN echo "//registry…:_authToken=$NPM_TOKEN" > .npmrc && npm ci && rm -f .npmrc, with ARG NPM_TOKEN. ls -a /app shows no .npmrc. Where is the token?', 'RUN echo "//registry…:_authToken=$NPM_TOKEN" > .npmrc && npm ci && rm -f .npmrc, với ARG NPM_TOKEN. ls -a /app không thấy .npmrc. Token nằm ở đâu?'],
      ['In docker history: the RUN command is stored with its build arguments in plain text', 'Nowhere: the file was created and removed in one RUN, so the token is gone', 'In a lower layer, readable with docker save, like the .env file', 'Only in the CI logs, never in the image itself'],
      ['The deletion inside one RUN is genuinely correct for the FILE — but the ARG value travels with the command. The mistake looks like the fix, which is why it survives review.', 'Xoá trong cùng một RUN là đúng thật với TỆP — nhưng giá trị ARG đi theo câu lệnh. Lỗi trông giống bản sửa, nên nó lọt qua review.']),
    q('c2', ['COPY .env . in one layer, RUN rm .env in the next. What does docker save + unpacking the layers show?', 'COPY .env . ở một tầng, RUN rm .env ở tầng sau. docker save rồi giải nén các tầng thấy gì?'],
      ['app/.env with the whole DATABASE_URL line, in the lower layer', 'Nothing: rm rewrote the lower layer when it ran', 'An empty .env, because rm truncates the file before deleting it', 'Only the file name, the content is encrypted by Docker'],
      ['A layer never changes; rm in a later layer only writes a note “this file is gone” on top. Rebuild without the COPY — and rotate the secret, because the old image already exists.', 'Một tầng không bao giờ thay đổi; rm ở tầng sau chỉ ghi chú “tệp này đã mất” lên trên. Build lại không có COPY đó — và đổi bí mật, vì ảnh cũ đã tồn tại.']),
    q('c3', ['RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci, built with --secret id=npmrc,src=$HOME/.npmrc. Result?', 'RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci, build với --secret id=npmrc,src=$HOME/.npmrc. Kết quả?'],
      ['0 matches in history, 0 in every unpacked layer: the file existed for that one RUN only', 'The token is in history but encrypted, so it is safe to push', 'The file stays in /root/.npmrc, so it must be removed with rm afterwards', 'The secret is copied into Config.Env so npm can read it at runtime'],
      ['Mounted in memory (tmpfs) for one command, never written to a layer. In CI, docker/build-push-action takes secrets: and hands them to BuildKit the same way.', 'Gắn trong bộ nhớ (tmpfs) cho một lệnh, không bao giờ ghi vào tầng nào. Trong CI, docker/build-push-action nhận secrets: và chuyển cho BuildKit đúng như vậy.']),
    qn('c4', ['Which statements are true? (choose all that apply)', 'Những câu nào đúng? (chọn mọi câu đúng)'],
      ['NEXT_PUBLIC_* variables are inlined into the JavaScript bundle at build time', 'docker inspect on a running container shows its -e environment', 'Being able to run docker on a server is effectively root', 'Docker secrets are exposed as environment variables, so inspect shows them'],
      [0, 1, 2],
      ['Docker/Swarm secrets are mounted as files under /run/secrets/*, not env variables. A third-party key in NEXT_PUBLIC_ is published to every visitor — the website’s GIPHY 403 incident.', 'Secret của Docker/Swarm được gắn dạng tệp dưới /run/secrets/*, không phải biến môi trường. Một khoá bên thứ ba trong NEXT_PUBLIC_ được công bố cho mọi khách — sự cố 403 GIPHY của website.']),
    q('c5', ['An image with STRIPE_KEY as ARG + ENV was pushed last week. The FIRST thing to do?', 'Một ảnh có STRIPE_KEY dạng ARG + ENV đã đẩy lên tuần trước. Việc ĐẦU TIÊN cần làm?'],
      ['Rotate the key, so the leaked value is worthless', 'Rebuild the image without the ARG and push it with the same tag', 'Delete the tag from the registry, then the image is gone everywhere', 'Add .env to .dockerignore and redeploy'],
      ['Old tags still exist in the registry, CI caches and teammates’ laptops; deleting a layer does not un-pull it. Rotation is the only action that really helps; everything else is cleanup.', 'Thẻ cũ vẫn nằm trong registry, cache CI và laptop đồng đội; xoá một tầng không thu hồi được bản đã kéo về. Đổi khoá là việc duy nhất thật sự có ích; còn lại là dọn dẹp.']),
  ],
  goiY: [['Anyone who can pull the image can read every layer and its history.', 'Ai kéo được ảnh đều đọc được mọi tầng và lịch sử của nó.'], ['A notebook where you can only add pages.', 'Một cuốn sổ chỉ thêm trang được.']],
  loi: [['rm -f in a later layer “to clean up”.', 'rm -f ở tầng sau “cho sạch”.'], ['A third-party key as NEXT_PUBLIC_.', 'Khoá bên thứ ba dạng NEXT_PUBLIC_.']],
  tns: [tn('secret mount', 'gắn bí mật', 'RUN --mount=type=secret'), tn('Config.Env', 'Config.Env', 'environment baked into the image config'), tn('rotate', 'xoay vòng (đổi) bí mật')],
  kn: ['Docker', 'secrets', 'security'],
});

const CHO = ['build ARG', 'secret mount', 'runtime env', 'public (bundle)'];
const E2 = cs({
  ten: 'Where does each value belong?', kho: 'EASY', phut: 5, loai: 'table',
  en: 'One image, many environments: the same tag runs in staging and production, only the environment handed to it differs.',
  vi: 'Một ảnh, nhiều môi trường: cùng một thẻ chạy ở staging và production, chỉ môi trường trao cho nó là khác.',
  bang: [bang1('b1', ['Pick the mechanism', 'Chọn cơ chế'], [{ ma: 'x', ten: 'Value' }, { ma: 'w', ten: 'Belongs in', luaChon: CHO }], [
    { o: { x: 'DATABASE_URL with the production password' }, a: { w: 'runtime env' } },
    { o: { x: 'The private npm registry token needed by npm ci' }, a: { w: 'secret mount' } },
    { o: { x: 'YTDLP_NGAY, a date that forces a fresh yt-dlp install' }, a: { w: 'build ARG' } },
    { o: { x: 'NEXT_PUBLIC_API_URL=https://cuongthai.com/api' }, a: { w: 'public (bundle)' } },
    { o: { x: 'R2_SECRET_ACCESS_KEY for uploads' }, a: { w: 'runtime env' } },
    { o: { x: 'An SSH key used only to clone a private git dependency while building' }, a: { w: 'secret mount' } },
  ], ['A build ARG exists only during the build and shows in history: versions and flags, never secrets. A secret mount exists for one RUN: build-time tokens and SSH keys. Runtime env is not in the image: every production secret. NEXT_PUBLIC_ is source code sent to every browser — only values you would print on a poster.', 'ARG lúc build chỉ tồn tại khi build và hiện trong history: phiên bản và cờ, không bao giờ là bí mật. Secret mount tồn tại cho một RUN: token và khoá SSH lúc build. Biến môi trường lúc chạy không nằm trong ảnh: mọi bí mật production. NEXT_PUBLIC_ là mã nguồn gửi tới mọi trình duyệt — chỉ những giá trị bạn dám in lên áp phích.'])],
  goiY: [['Is it needed at build time or at run time?', 'Cần lúc build hay lúc chạy?'], ['Would it be fine on a public poster?', 'In lên áp phích công khai có ổn không?']],
  loi: [['Production secrets as ARG/ENV.', 'Bí mật production dạng ARG/ENV.'], ['A registry token as ARG “because it is only for the build”.', 'Token registry dạng ARG “vì chỉ dùng lúc build”.']],
  tns: [tn('runtime environment', 'môi trường lúc chạy')],
  kn: ['secrets'],
});

function loadConfig(env, schema) {
  // Kiểm MỌI biến bắt buộc lúc khởi động và chết to tiếng: thiếu một biến ⇒ dừng với TÊN của nó, không nửa chạy nửa không.
  const missing = Object.keys(schema).filter((k) => schema[k].required && (env[k] === undefined || env[k] === ''));
  if (missing.length) throw new Error(`MISSING ENVIRONMENT VARIABLES: ${missing.join(', ')}`);
  const cfg = {};
  for (const [k, rule] of Object.entries(schema)) {
    const raw = env[k] === undefined || env[k] === '' ? rule.default : env[k];
    if (raw === undefined) continue;
    if (rule.type === 'number') {
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new Error(`INVALID ENVIRONMENT VARIABLE: ${k} must be a number`);
      cfg[k] = n;
    } else cfg[k] = String(raw);
  }
  return Object.freeze(cfg);
}
const SCHEMA = { DATABASE_URL: { required: true }, R2_ACCESS_KEY_ID: { required: true }, R2_SECRET_ACCESS_KEY: { required: true }, PORT: { type: 'number', default: 3001 } };
const E3 = await jsBai({
  ten: 'loadConfig(env, schema): die loudly at boot, with the missing names', kho: 'MEDIUM', phut: 12,
  en: '<p>The most common deploy config failure: a variable added to your local .env never reaches the server, and the feature dies at its first request with <code>undefined</code>. Write <code>loadConfig(env, schema)</code>. <code>schema</code> maps a name to <code>{ required?, type?: "number", default? }</code>. A value counts as missing when it is <code>undefined</code> or <code>""</code>.</p><ol><li>If any required name is missing, throw <code>Error("MISSING ENVIRONMENT VARIABLES: A, B")</code> listing <b>all</b> missing names in schema order;</li><li>otherwise build the config: missing optional values take their <code>default</code> (no default ⇒ key omitted); <code>type: "number"</code> converts with <code>Number</code>, and a non-finite result throws <code>Error("INVALID ENVIRONMENT VARIABLE: &lt;name&gt; must be a number")</code>; everything else is a string;</li><li>return the config frozen (<code>Object.freeze</code>).</li></ol>',
  vi: '<p>Lỗi cấu hình deploy hay gặp nhất: một biến thêm vào .env ở máy không bao giờ tới server, và tính năng chết ngay request đầu với <code>undefined</code>. Viết <code>loadConfig(env, schema)</code>. <code>schema</code> ánh xạ tên ⇒ <code>{ required?, type?: "number", default? }</code>. Giá trị được coi là thiếu khi là <code>undefined</code> hoặc <code>""</code>.</p><ol><li>Nếu thiếu tên bắt buộc nào, ném <code>Error("MISSING ENVIRONMENT VARIABLES: A, B")</code> liệt kê <b>mọi</b> tên thiếu theo thứ tự trong schema;</li><li>không thì dựng cấu hình: giá trị tuỳ chọn bị thiếu lấy <code>default</code> (không có default ⇒ bỏ khoá); <code>type: "number"</code> đổi bằng <code>Number</code>, kết quả không hữu hạn thì ném <code>Error("INVALID ENVIRONMENT VARIABLE: &lt;tên&gt; must be a number")</code>; còn lại là chuỗi;</li><li>trả cấu hình đã đóng băng (<code>Object.freeze</code>).</li></ol>',
  goiY: [['Collect every missing name first, then throw once — the operator fixes all of them in one go.', 'Gom mọi tên thiếu trước, rồi ném một lần — người vận hành sửa hết trong một lượt.'], ['Number("abc") is NaN; Number.isFinite rejects NaN and Infinity.', 'Number("abc") là NaN; Number.isFinite loại NaN và Infinity.']],
  loi: [['Reading process.env.X lazily inside the handler: CI green, build green, container up — and the upload feature 500s at its first call.', 'Đọc process.env.X trễ bên trong handler: CI xanh, build xanh, container chạy — rồi tính năng upload lỗi 500 ở lần gọi đầu.'], ['Throwing at the first missing variable: the next deploy fails again for the second one.', 'Ném ở biến thiếu đầu tiên: lần deploy sau lại hỏng vì biến thứ hai.']],
  gt: ['Measured in the lesson: without R2_ACCESS_KEY_ID the app prints the missing name and exits 1; with all three it prints config OK and runs. A container that dies at boot with its reason is a gift; one that runs and fails quietly is an incident (18.6, “fail loudly”).', 'Đo trong bài: thiếu R2_ACCESS_KEY_ID thì app in tên biến thiếu và thoát 1; đủ cả ba thì in config OK và chạy. Một container chết lúc khởi động kèm lý do là một món quà; cái chạy rồi hỏng âm thầm là một sự cố (18.6, “hỏng thì hỏng to”).'],
  kn: ['configuration', 'fail fast'],
  tns: [tn('fail fast', 'hỏng sớm', 'stop at boot instead of at the first request'), tn('Object.freeze', 'Object.freeze')],
  dau: `/** validate the environment at boot */
function loadConfig(env, schema) {
  // Write your solution here
  const cfg = {};
  for (const [k, rule] of Object.entries(schema)) {
    if (rule.required && !env[k]) throw new Error('MISSING ENVIRONMENT VARIABLE: ' + k);
    cfg[k] = env[k] ?? rule.default;
  }
  return cfg;
}
`,
  giai: '// Reference solution\n' + nguon(loadConfig),
  cases: [
    { goi: `loadConfig({ DATABASE_URL: "postgres://app:FAKE@db/notes", R2_ACCESS_KEY_ID: "FAKE", R2_SECRET_ACCESS_KEY: "FAKE" }, ${JSON.stringify(SCHEMA)})`, moTa: ['All three present, PORT defaulted', 'Đủ cả ba, PORT lấy mặc định'] },
    { goi: `loadConfig({ DATABASE_URL: "postgres://app:FAKE@db/notes", R2_SECRET_ACCESS_KEY: "" }, ${JSON.stringify(SCHEMA)})`, nem: 'Error', thongDiep: '^MISSING ENVIRONMENT VARIABLES: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY$', moTa: ['Two missing (one empty)', 'Thiếu hai (một cái rỗng)'] },
    { goi: `loadConfig({ DATABASE_URL: "x", R2_ACCESS_KEY_ID: "y", R2_SECRET_ACCESS_KEY: "z", PORT: "abc" }, ${JSON.stringify(SCHEMA)})`, nem: 'Error', thongDiep: '^INVALID ENVIRONMENT VARIABLE: PORT must be a number$', an: true },
    { goi: `(() => { const c = loadConfig({ DATABASE_URL: "x", R2_ACCESS_KEY_ID: "y", R2_SECRET_ACCESS_KEY: "z", PORT: "4950" }, ${JSON.stringify(SCHEMA)}); return [c.PORT, typeof c.PORT, Object.isFrozen(c)]; })()`, an: true },
    { goi: 'loadConfig({}, { SENTRY_DSN: {}, LOG_LEVEL: { default: "info" } })', an: true },
  ],
});

function findSecretLeaks(dockerfile) {
  const SECRET = /(TOKEN|SECRET|PASSWORD|PASSWD|_KEY|APIKEY|DATABASE_URL|CREDENTIAL)/i;
  const lines = dockerfile.split('\n').map((l) => l.trim());
  const lastFrom = lines.map((l) => /^FROM\s/i.test(l)).lastIndexOf(true);
  const out = [];
  lines.forEach((l, i) => {
    if (!l || l.startsWith('#')) return;
    const n = i + 1;
    const final = i > lastFrom;                                         // chỉ giai đoạn cuối đi theo ảnh
    let m;
    if ((m = /^ARG\s+([A-Za-z_][\w]*)/i.exec(l)) && SECRET.test(m[1])) out.push({ line: n, name: m[1], where: final ? 'history' : 'build-logs' });
    if ((m = /^ENV\s+([A-Za-z_][\w]*)/i.exec(l)) && SECRET.test(m[1]) && final) out.push({ line: n, name: m[1], where: 'config-env' });
    if ((m = /^COPY\s+(?:--\S+\s+)*(\S*\.env\S*)\s/i.exec(l)) && !/\.example$/.test(m[1]) && final) out.push({ line: n, name: m[1], where: 'layer' });
  });
  return out;
}
const LEAKY = `FROM node:22-slim
ARG NPM_TOKEN
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
WORKDIR /app
COPY package*.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci && rm -f .npmrc
COPY .env .
RUN rm .env
COPY src ./src
CMD ["node", "src/index.js"]`;
const FIXED = `# syntax=docker/dockerfile:1
FROM node:22-slim AS builder
ARG STRIPE_KEY
ENV STRIPE_KEY=$STRIPE_KEY
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
FROM node:22-slim
ARG APP_VERSION
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY .env.example ./
COPY src ./src
CMD ["node", "src/index.js"]`;
const E4 = await jsBai({
  ten: 'findSecretLeaks(dockerfile): the three hiding places, and the builder exception', kho: 'MEDIUM', phut: 18,
  en: '<p>Scan a Dockerfile for the leaks of the lesson. A name looks secret if it contains <code>TOKEN</code>, <code>SECRET</code>, <code>PASSWORD</code>, <code>PASSWD</code>, <code>_KEY</code>, <code>APIKEY</code>, <code>DATABASE_URL</code> or <code>CREDENTIAL</code> (any case). The <b>final stage</b> is everything after the last <code>FROM</code>. Return <code>{ line, name, where }</code> (1-based line numbers of the original text) in line order:</p><ul><li><code>ARG &lt;secret&gt;</code> — <code>where: "history"</code> in the final stage, <code>"build-logs"</code> in an earlier stage (thrown away, but build args are printed in build logs and CI output);</li><li><code>ENV &lt;secret&gt;…</code> in the final stage — <code>"config-env"</code> (readable with inspect, present in every container);</li><li><code>COPY</code> (flags allowed) of a source whose name contains <code>.env</code> and does not end in <code>.example</code>, in the final stage — <code>"layer"</code> (a later <code>rm</code> does not remove it).</li></ul>',
  vi: '<p>Quét một Dockerfile tìm các chỗ rò của bài. Một tên trông như bí mật nếu chứa <code>TOKEN</code>, <code>SECRET</code>, <code>PASSWORD</code>, <code>PASSWD</code>, <code>_KEY</code>, <code>APIKEY</code>, <code>DATABASE_URL</code> hoặc <code>CREDENTIAL</code> (hoa thường bất kỳ). <b>Giai đoạn cuối</b> là mọi thứ sau <code>FROM</code> cuối cùng. Trả về <code>{ line, name, where }</code> (số dòng tính từ 1 của văn bản gốc) theo thứ tự dòng:</p><ul><li><code>ARG &lt;bí mật&gt;</code> — <code>where: "history"</code> ở giai đoạn cuối, <code>"build-logs"</code> ở giai đoạn trước (bị bỏ đi, nhưng build arg vẫn in ra log build và output CI);</li><li><code>ENV &lt;bí mật&gt;…</code> ở giai đoạn cuối — <code>"config-env"</code> (đọc được bằng inspect, có trong mọi container);</li><li><code>COPY</code> (có thể kèm cờ) một nguồn có tên chứa <code>.env</code> và không kết thúc bằng <code>.example</code>, ở giai đoạn cuối — <code>"layer"</code> (rm sau đó không xoá được).</li></ul>',
  goiY: [['Find the index of the last FROM first; every rule then asks “is this line after it?”.', 'Tìm chỉ số FROM cuối trước; mọi luật sau đó hỏi “dòng này có sau nó không?”.'], ['Keep the original line numbers: iterate with forEach((l, i) => …) before filtering blanks.', 'Giữ số dòng gốc: duyệt bằng forEach((l, i) => …) trước khi lọc dòng trống.']],
  loi: [['Trusting the rm -f inside the RUN: correct for the file, useless for the ARG value stored with the command.', 'Tin rm -f bên trong RUN: đúng với tệp, vô dụng với giá trị ARG lưu kèm câu lệnh.'], ['Calling a builder-stage ARG safe: the final image has 0 matches, but the value is still printed in build logs — use a secret mount.', 'Gọi ARG ở giai đoạn builder là an toàn: ảnh cuối có 0 kết quả, nhưng giá trị vẫn in ra log build — dùng secret mount.']],
  gt: ['Anyone who can pull your image can read history and Config.Env without even running it, and open any layer with docker save. If a value appears in the Dockerfile or the build command, assume it is public; production secrets come from runtime env, build-time ones from a secret mount.', 'Ai kéo được ảnh đều đọc được history và Config.Env mà không cần chạy, và mở được mọi tầng bằng docker save. Nếu một giá trị xuất hiện trong Dockerfile hay lệnh build, coi như nó là công khai; bí mật production đến từ môi trường lúc chạy, bí mật lúc build đến từ secret mount.'],
  kn: ['Docker', 'secrets', 'parsing'],
  tns: [tn('docker history', 'docker history', 'the command (and build args) of every layer'), tn('docker save', 'docker save', 'export an image as a tar of layers')],
  dau: `/** where can a secret be read from this image? */
function findSecretLeaks(dockerfile) {
  // Write your solution here
  return dockerfile.split('\\n').map((l, i) => ({ l: l.trim(), n: i + 1 }))
    .filter(({ l }) => /^ENV\\s/i.test(l) && /TOKEN|SECRET|PASSWORD/i.test(l))
    .map(({ l, n }) => ({ line: n, name: l.split(/\\s+/)[1].split('=')[0], where: 'config-env' }));
}
`,
  giai: '// Reference solution\n' + nguon(findSecretLeaks),
  cases: [
    { goi: goi('findSecretLeaks', LEAKY), moTa: ['The careful-looking Dockerfile of the lesson', 'Dockerfile trông cẩn thận của bài'] },
    { goi: goi('findSecretLeaks', FIXED), moTa: ['Secret mount, builder-only ARG, .env.example', 'Secret mount, ARG chỉ ở builder, .env.example'] },
    { goi: goi('findSecretLeaks', 'FROM node:22-slim\nenv stripe_secret_key=sk_test_FAKE\nCOPY --chown=node:node .env.production ./\narg api_version=3\nARG GIPHY_APIKEY'), an: true },
    { goi: goi('findSecretLeaks', 'FROM node:22-slim\nWORKDIR /app\nCOPY src ./src\nCMD ["node", "src/index.js"]'), an: true },
  ],
});

function layerView(layers, secretRe) {
  // Hệ tệp hợp nhất: tầng trên che tầng dưới. "Xoá" chỉ là một ghi chú (whiteout) ở tầng trên — byte ở tầng dưới còn nguyên.
  const rx = new RegExp(secretRe);
  const fs = new Map();
  const leaks = [];
  layers.forEach((layer, i) => {
    for (const [path, content] of Object.entries(layer.add || {})) {
      fs.set(path, content);
      if (rx.test(content)) leaks.push({ layer: i, path });
    }
    for (const path of layer.remove || []) fs.delete(path);
  });
  const visible = [...fs.keys()].sort();
  const stillInImage = leaks.filter((l) => !fs.has(l.path) || !rx.test(fs.get(l.path))).map((l) => `${l.path} (layer ${l.layer})`);
  return { visible, leaks: leaks.map((l) => `${l.path} (layer ${l.layer})`), hiddenButPresent: stillInImage };
}
const LAYERS = [
  { add: { 'app/package.json': '{"name":"notes"}' } },
  { add: { 'app/.env': 'DATABASE_URL=postgres://app:FAKE-s3cret@db/notes' } },
  { remove: ['app/.env'] },
  { add: { 'app/src/index.js': 'console.log("hi")' } },
];
const E5 = await jsBai({
  ten: 'layerView(layers, secretRe): why rm in a later layer deletes nothing', kho: 'HARD', phut: 16,
  en: '<p>Model an image as a stack of layers that never change. Each layer is <code>{ add?: { path: content }, remove?: [path] }</code>, applied in order: <code>add</code> first, then <code>remove</code> (a remove only hides the path from the layers <b>above</b>). Write <code>layerView(layers, secretRe)</code> returning:</p><ul><li><code>visible</code> — the paths a container sees at the end, sorted;</li><li><code>leaks</code> — every added file whose content matches <code>new RegExp(secretRe)</code>, as <code>"&lt;path&gt; (layer &lt;index&gt;)"</code> in the order they were added;</li><li><code>hiddenButPresent</code> — those leaks that are <b>not visible</b> any more (removed, or overwritten with content that no longer matches): readable by anyone who unpacks the layers.</li></ul>',
  vi: '<p>Mô hình hoá ảnh như một chồng tầng không bao giờ thay đổi. Mỗi tầng là <code>{ add?: { path: nội dung }, remove?: [path] }</code>, áp theo thứ tự: <code>add</code> trước, rồi <code>remove</code> (remove chỉ che đường dẫn khỏi các tầng <b>bên trên</b>). Viết <code>layerView(layers, secretRe)</code> trả về:</p><ul><li><code>visible</code> — các đường dẫn container thấy ở cuối, đã sắp;</li><li><code>leaks</code> — mọi tệp được thêm có nội dung khớp <code>new RegExp(secretRe)</code>, dạng <code>"&lt;path&gt; (layer &lt;chỉ số&gt;)"</code> theo thứ tự được thêm;</li><li><code>hiddenButPresent</code> — những leak <b>không còn thấy</b> nữa (bị xoá, hoặc bị ghi đè bằng nội dung không còn khớp): ai giải nén các tầng đều đọc được.</li></ul>',
  goiY: [['Keep one Map for the merged view, and a separate list of every secret-looking file ever added.', 'Giữ một Map cho góc nhìn hợp nhất, và một danh sách riêng mọi tệp trông như bí mật từng được thêm.'], ['A leak is hidden when the final view has no such path, or has it with harmless content.', 'Một leak bị che khi góc nhìn cuối không có đường dẫn đó, hoặc có nhưng nội dung vô hại.']],
  loi: [['Checking only the final file system (what ls shows): it says “clean” for an image that still carries the password.', 'Chỉ kiểm hệ tệp cuối (thứ ls hiện ra): nó báo “sạch” cho một ảnh vẫn mang mật khẩu.'], ['Thinking an overwrite erases: the old content is still in its own layer.', 'Nghĩ ghi đè là xoá: nội dung cũ vẫn ở tầng của nó.']],
  gt: ['Like a notebook where you can only add pages: crossing out a line on page 5 does not erase page 3, and docker pull downloads every page. The only real removal is a rebuild without the COPY — plus rotating the secret, because the old image already exists elsewhere.', 'Như cuốn sổ chỉ thêm được trang: gạch một dòng ở trang 5 không xoá trang 3, và docker pull tải về mọi trang. Cách xoá thật duy nhất là build lại không có COPY đó — cộng đổi bí mật, vì ảnh cũ đã nằm ở nơi khác.'],
  kn: ['Docker', 'union filesystem', 'Map'],
  tns: [tn('union filesystem', 'hệ tệp hợp nhất'), tn('whiteout', 'whiteout', 'the marker that hides a deleted file')],
  dau: `/** what is visible, and what is still inside? */
function layerView(layers, secretRe) {
  // Write your solution here
  const fs = new Map();
  for (const l of layers) {
    for (const [p, c] of Object.entries(l.add || {})) fs.set(p, c);
    for (const p of l.remove || []) fs.delete(p);
  }
  const rx = new RegExp(secretRe);
  const leaks = [...fs].filter(([, c]) => rx.test(c)).map(([p]) => p);
  return { visible: [...fs.keys()].sort(), leaks, hiddenButPresent: [] };
}
`,
  giai: '// Reference solution\n' + nguon(layerView),
  cases: [
    { goi: goi('layerView', LAYERS, 'FAKE-s3cret|_authToken='), moTa: ['COPY .env . then RUN rm .env', 'COPY .env . rồi RUN rm .env'] },
    { goi: goi('layerView', [{ add: { 'app/index.js': 'x' } }], 'password'), moTa: ['Nothing secret', 'Không có gì bí mật'] },
    { goi: goi('layerView', [{ add: { 'root/.npmrc': '//registry/:_authToken=npm_FAKE' } }, { add: { 'root/.npmrc': '# cleared' } }, { add: { 'app/.env': 'X=1' }, remove: ['app/.env'] }, { add: { 'app/config.json': '{"password":"FAKE"}' } }], '_authToken=|"password"'), an: true },
    { goi: goi('layerView', [], 'x'), an: true },
  ],
});

export default modul('nodejs-17-4-bi-mat-cau-hinh', '17.4 Secrets and configuration', [E1, E2, E3, E4, E5]);
