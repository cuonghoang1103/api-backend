/** Node.js 17.1 — Ảnh Docker: 430 MB → 65,5 MB, ảnh nền, bẫy alpine/musl và Mach-O, multi-stage, NODE_ENV / USER / npm ci. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';
import { NAIVE, SLIM, MULTI, MULTI_LEAKY } from './_dockerfile-c17.mjs';

const E1 = cs({
  ten: 'What is really inside a 430 MB image', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.1: four Dockerfiles for one 1,990-byte app.',
  vi: 'Câu hỏi về bài 17.1: bốn Dockerfile cho một app 1.990 byte.',
  cau: [
    q('c1', ['The naive image is 430 MB to download and 1.73 GB on disk. Which size does every deploy and rollback wait for?', 'Ảnh ngây thơ nặng 430 MB khi tải và 1,73 GB trên đĩa. Mỗi lần deploy và quay lui phải chờ kích thước nào?'],
      ['The download size: the compressed layers pulled from the registry', 'The on-disk size, because layers are unpacked before they are sent', 'Neither: Docker only sends the layers that contain your own code', 'The size of node_modules, since the base image is cached forever'],
      ['On-disk size is what piles up: ten old naive versions are 17 GB, on the same disk as your database.', 'Kích thước trên đĩa là thứ chất đống: mười phiên bản ngây thơ cũ là 17 GB, trên cùng ổ với CSDL.']),
    q('c2', ['bcrypt was installed on a Mac. Without .dockerignore, COPY . . then RUN npm install. The build says OK; running fails with invalid ELF header. Why?', 'bcrypt được cài trên Mac. Không có .dockerignore, COPY . . rồi RUN npm install. Build báo OK; chạy thì lỗi invalid ELF header. Vì sao?'],
      ['The Mac’s node_modules (a Mach-O binary) was copied in, and npm install saw bcrypt already there and did not rebuild it', 'bcrypt cannot be built on Linux at all, so it must be replaced by bcryptjs', 'Docker Desktop translates binaries on the fly, but only for the amd64 platform', 'npm install always downloads macOS binaries when the lockfile was made on a Mac'],
      ['One line fixes it: node_modules in .dockerignore. The image then installs its own Linux binary and runs (exit 0).', 'Một dòng sửa được: node_modules trong .dockerignore. Ảnh khi đó tự cài bản Linux của nó và chạy (exit 0).']),
    q('c3', ['Same error, with and without ENV NODE_ENV=production in the runner. What changed?', 'Cùng một lỗi, có và không có ENV NODE_ENV=production trong runner. Điều gì thay đổi?'],
      ['Without it: an 889-byte stack trace that leaked a sentence with a “password”; with it: 148 bytes, Internal Server Error', 'Nothing visible: NODE_ENV only changes which npm scripts can run', 'With it, Express disables error handling and the client gets no response', 'Without it, the image is 19 MB bigger because dev tools stay installed'],
      ['Many libraries change behaviour on this variable — it is a behaviour line, not a size line. USER node is the other one: naive and slim ran as root.', 'Nhiều thư viện đổi hành vi theo biến này — nó là dòng về hành vi, không phải kích thước. USER node là dòng còn lại: bản ngây thơ và slim chạy bằng root.']),
    qn('c4', ['Which statements are true? (choose all that apply)', 'Những câu nào đúng? (chọn mọi câu đúng)'],
      ['node:22 is a tag, not a version: today it is v22.23.4, next month something else', 'Only the last stage of a multi-stage build becomes the image', 'npm ci follows the lockfile exactly and fails on drift', 'alpine is always the right base because it is the smallest'],
      [0, 1, 2],
      ['alpine uses musl instead of glibc: native modules such as sharp or bcrypt need a musl build or break. With native modules choose slim; the 19 MB saved is not worth “Error loading shared library”.', 'alpine dùng musl thay vì glibc: module native như sharp hay bcrypt cần bản dựng cho musl không thì hỏng. Có module native thì chọn slim; 19 MB tiết kiệm không đáng một buổi chiều “Error loading shared library”.']),
  ],
  goiY: [['Think about what the registry stores and the server pulls.', 'Nghĩ về thứ registry lưu và server kéo về.'], ['A .node file is compiled for one operating system.', 'Một tệp .node được biên dịch cho đúng một hệ điều hành.']],
  loi: [['FROM node:22 for production: gcc, make, python, git and curl ship to the server.', 'FROM node:22 cho production: gcc, make, python, git và curl được mang lên server.'], ['Trusting “build OK” — the bcrypt image built green and could not start.', 'Tin “build OK” — ảnh bcrypt build xanh mà không khởi động nổi.']],
  tns: [tn('image layer', 'tầng ảnh'), tn('base image', 'ảnh nền'), tn('multi-stage build', 'build nhiều giai đoạn'), tn('musl / glibc', 'musl / glibc', 'two C libraries; native binaries are built for one')],
  kn: ['Docker', 'images'],
});

const E2 = cs({
  ten: 'Pick the base image for the situation', kho: 'EASY', phut: 5, loai: 'table',
  en: 'node:22, node:22-slim, node:22-alpine or distroless? (Lesson 17.1: 416 MB / 82.6 MB / 61.5 MB download.)',
  vi: 'node:22, node:22-slim, node:22-alpine hay distroless? (Bài 17.1: tải 416 MB / 82,6 MB / 61,5 MB.)',
  bang: [bang1('b1', ['Which base for the runner stage?', 'Ảnh nền nào cho giai đoạn runner?'], [{ ma: 'x', ten: 'Situation' }, { ma: 'b', ten: 'Base', luaChon: ['node:22 (full)', 'node:22-slim', 'node:22-alpine', 'distroless'] }], [
    { o: { x: 'Production API that resizes images with sharp (native module)' }, a: { b: 'node:22-slim' } },
    { o: { x: 'Pure-JavaScript API (express, pg, zod), smallest image wanted, shell still handy for debugging' }, a: { b: 'node:22-alpine' } },
    { o: { x: 'Security first: nothing but Node and the app, no shell inside the container at all' }, a: { b: 'distroless' } },
    { o: { x: 'The BUILDER stage that must compile a native module from source (python3, make, g++)' }, a: { b: 'node:22 (full)' } },
    { o: { x: 'A sensible default for most projects, no toolchain, glibc' }, a: { b: 'node:22-slim' } },
  ], ['The toolchain belongs in the builder only (the website installs python3, make, g++ there); the runner gets runtime libraries only. alpine’s musl breaks native modules; distroless removes the shell, so you can no longer get inside to type commands.', 'Bộ công cụ biên dịch chỉ thuộc về builder (website cài python3, make, g++ ở đó); runner chỉ nhận thư viện lúc chạy. musl của alpine làm hỏng module native; distroless bỏ shell, nên bạn không vào trong gõ lệnh được nữa.'])],
  goiY: [['Native module ⇒ glibc.', 'Module native ⇒ glibc.'], ['A builder stage is thrown away, so its size does not matter.', 'Giai đoạn builder bị bỏ đi, nên kích thước của nó không quan trọng.']],
  loi: [['alpine for sharp “because it is smaller”.', 'alpine cho sharp “vì nó nhỏ hơn”.'], ['The full image as the runner.', 'Ảnh đầy đủ làm runner.']],
  tns: [tn('distroless', 'distroless', 'an image with no shell and no package manager')],
  kn: ['Docker'],
});

function lintDockerfile(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const lastFrom = lines.map((l) => /^FROM\s/i.test(l)).lastIndexOf(true);
  const fin = lines.slice(lastFrom);                                   // chỉ giai đoạn CUỐI thành ảnh
  const image = fin[0].split(/\s+/)[1];
  const [repo, tagPart = 'latest'] = image.split('@')[0].split(':');
  const found = [];
  // ảnh nền: node:<số> hay node:latest = Debian đầy đủ + gcc, make, python, git, curl
  if (repo === 'node' && /^(latest|[\d.]+)$/.test(tagPart)) found.push('FULL_BASE');
  // thẻ không phải phiên bản: chỉ "x.y.z" (có thể kèm -slim…) hoặc @sha256 mới là ghim
  if (!image.includes('@sha256:') && !/^\d+\.\d+\.\d+(-|$)/.test(tagPart)) found.push('UNPINNED_TAG');
  if (fin.some((l) => /^COPY\s+\.\s+\.\s*$/i.test(l))) found.push('COPY_ALL');
  if (fin.some((l) => /^RUN\s.*\bnpm\s+(install|i)\b/i.test(l))) found.push('NPM_INSTALL');
  const cmd = fin.filter((l) => /^CMD\s/i.test(l)).pop() || '';
  if (/^CMD\s+(\[\s*"npm"|npm\s)/i.test(cmd)) found.push('NPM_PID1');
  const users = fin.filter((l) => /^USER\s/i.test(l));
  if (!users.length || /^USER\s+(root|0)\s*$/i.test(users[users.length - 1])) found.push('ROOT_USER');
  if (!fin.some((l) => /^ENV\s+NODE_ENV(=|\s+)"?production"?\s*$/i.test(l))) found.push('NO_NODE_ENV');
  return found;
}
const E3 = await jsBai({
  ten: 'lintDockerfile(text): find the four tutorial lines and three missing ones', kho: 'MEDIUM', phut: 18,
  en: '<p>Write a small linter for the image that reaches the server — the <b>final stage</b> (from the last <code>FROM</code> to the end). Ignore blank lines and <code>#</code> comments; keywords are case-insensitive. Return the codes found, in this order:</p><ol><li><code>FULL_BASE</code> — the final <code>FROM</code> is <code>node:&lt;digits/dots&gt;</code> or <code>node:latest</code> (or <code>node</code> with no tag);</li><li><code>UNPINNED_TAG</code> — the tag does not start with an exact <code>x.y.z</code> version and there is no <code>@sha256:</code> digest;</li><li><code>COPY_ALL</code> — a line <code>COPY . .</code>;</li><li><code>NPM_INSTALL</code> — a <code>RUN</code> using <code>npm install</code> / <code>npm i</code> (not <code>npm ci</code>);</li><li><code>NPM_PID1</code> — the last <code>CMD</code> starts npm (<code>["npm", …]</code> or shell form <code>npm …</code>);</li><li><code>ROOT_USER</code> — no <code>USER</code>, or the last one is <code>root</code>/<code>0</code>;</li><li><code>NO_NODE_ENV</code> — no <code>ENV NODE_ENV=production</code> (also <code>ENV NODE_ENV production</code>).</li></ol>',
  vi: '<p>Viết một bộ soát nhỏ cho ảnh tới được server — <b>giai đoạn cuối</b> (từ <code>FROM</code> cuối cùng tới hết). Bỏ dòng trống và chú thích <code>#</code>; từ khoá không phân biệt hoa thường. Trả về các mã tìm thấy, theo thứ tự:</p><ol><li><code>FULL_BASE</code> — <code>FROM</code> cuối là <code>node:&lt;số/dấu chấm&gt;</code> hoặc <code>node:latest</code> (hoặc <code>node</code> không thẻ);</li><li><code>UNPINNED_TAG</code> — thẻ không bắt đầu bằng phiên bản chính xác <code>x.y.z</code> và không có digest <code>@sha256:</code>;</li><li><code>COPY_ALL</code> — dòng <code>COPY . .</code>;</li><li><code>NPM_INSTALL</code> — một <code>RUN</code> dùng <code>npm install</code> / <code>npm i</code> (không phải <code>npm ci</code>);</li><li><code>NPM_PID1</code> — <code>CMD</code> cuối khởi chạy npm (<code>["npm", …]</code> hoặc dạng shell <code>npm …</code>);</li><li><code>ROOT_USER</code> — không có <code>USER</code>, hoặc cái cuối là <code>root</code>/<code>0</code>;</li><li><code>NO_NODE_ENV</code> — không có <code>ENV NODE_ENV=production</code> (cũng nhận <code>ENV NODE_ENV production</code>).</li></ol>',
  goiY: [['Find the index of the last FROM with lastIndexOf on a boolean map, then slice.', 'Tìm chỉ số FROM cuối bằng lastIndexOf trên mảng boolean, rồi slice.'], ['Split the image: "node:22.23.4-slim" → repo "node", tag "22.23.4-slim"; a missing tag means "latest".', 'Tách ảnh: "node:22.23.4-slim" → repo "node", thẻ "22.23.4-slim"; thiếu thẻ nghĩa là "latest".']],
  loi: [['Linting every stage: a builder on node:22 with npm ci is fine — it never reaches the server.', 'Soát mọi giai đoạn: builder dùng node:22 với npm ci là ổn — nó không bao giờ tới server.'], ['Treating node:22-slim as pinned: it is a moving tag; next month it is another Node.', 'Coi node:22-slim là đã ghim: nó là thẻ di động; tháng sau là một Node khác.']],
  gt: ['Every line of the naive file is copied from a tutorial and is fine on a laptop; together they ship 430 MB, 36 extra packages, an npm cache and a shutdown that drops requests (17.3). The multi-stage file of the lesson passes every rule and is 81.7 MB, smaller than single-stage slim.', 'Mỗi dòng của tệp ngây thơ đều chép từ một hướng dẫn và chạy ổn trên laptop; gộp lại chúng mang lên 430 MB, 36 gói thừa, cache npm và một lần tắt làm rơi request (17.3). Tệp multi-stage của bài qua mọi luật và nặng 81,7 MB, nhỏ hơn cả slim một giai đoạn.'],
  kn: ['Docker', 'parsing', 'regex'],
  tns: [tn('final stage', 'giai đoạn cuối'), tn('digest', 'digest', 'an immutable content hash of an image'), tn('lint', 'soát lỗi')],
  dau: `/** lint the stage that becomes the image */
function lintDockerfile(text) {
  // Write your solution here
  const found = [];
  if (text.includes('FROM node:22\\n')) found.push('FULL_BASE');
  if (text.includes('COPY . .')) found.push('COPY_ALL');
  if (text.includes('npm install')) found.push('NPM_INSTALL');
  return found;
}
`,
  giai: '// Reference solution\n' + nguon(lintDockerfile),
  cases: [
    { goi: goi('lintDockerfile', NAIVE), moTa: ['The naive Dockerfile (430 MB)', 'Dockerfile ngây thơ (430 MB)'] },
    { goi: goi('lintDockerfile', MULTI), moTa: ['The lesson’s multi-stage file (81.7 MB)', 'Tệp multi-stage của bài (81,7 MB)'] },
    { goi: goi('lintDockerfile', SLIM), an: true },
    { goi: goi('lintDockerfile', MULTI_LEAKY), an: true },
    { goi: goi('lintDockerfile', 'from node:latest\nworkdir /app\ncopy . .\nrun npm i\nuser root\nenv NODE_ENV production\ncmd npm run start:prod'), an: true },
    { goi: goi('lintDockerfile', 'FROM node:22.23.4-alpine@sha256:abc123\nENV NODE_ENV="production"\nUSER node\nCMD ["node", "index.js"]'), an: true },
  ],
});

function finalStage(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const stages = [];
  for (const l of lines) {
    const f = /^FROM\s+(\S+)(?:\s+AS\s+(\S+))?/i.exec(l);
    if (f) { stages.push({ name: f[2] || String(stages.length), from: f[1], lines: [] }); continue; }
    if (stages.length) stages[stages.length - 1].lines.push(l);
  }
  const byName = new Map(stages.map((s) => [s.name, s]));
  // node_modules của một giai đoạn có devDependencies không? — tìm lệnh npm ci/install của nó
  const devDeps = (s) => {
    const inst = s.lines.filter((l) => /^RUN\s.*\bnpm\s+(ci|install|i)\b/i.test(l)).pop();
    if (inst) return !/--omit=dev|--production|--only=prod/i.test(inst);
    const c = s.lines.find((l) => /^COPY\s+--from=(\S+)\s+\S*node_modules/i.test(l));
    if (c) { const src = byName.get(/--from=(\S+)/i.exec(c)[1]); return src ? devDeps(src) : false; }
    return false;                                          // không có node_modules nào
  };
  const fin = stages[stages.length - 1];
  const copiesFrom = [...new Set(fin.lines.map((l) => /^COPY\s+--from=(\S+)/i.exec(l)).filter(Boolean).map((m) => m[1]))];
  return { stages: stages.map((s) => s.name), final: fin.name, copiesFrom, devDepsInImage: devDeps(fin) };
}
const E4 = await jsBai({
  ten: 'finalStage(text): which stage ships, and do devDependencies reach the server?', kho: 'HARD', phut: 22,
  en: '<p>Only the last stage becomes the image. Parse a (possibly multi-stage) Dockerfile and return <code>{ stages, final, copiesFrom, devDepsInImage }</code>:</p><ul><li><code>stages</code> — stage names in order (<code>FROM x AS name</code>; a stage without a name is called by its index, <code>"0"</code>, <code>"1"</code>…);</li><li><code>final</code> — the last stage’s name; <code>copiesFrom</code> — distinct <code>--from=</code> sources of its <code>COPY</code> lines, in order;</li><li><code>devDepsInImage</code> — does the final image contain devDependencies? A stage’s node_modules has them if its last <code>RUN npm ci|install|i</code> lacks <code>--omit=dev</code> / <code>--production</code> / <code>--only=prod</code>; a stage with no such RUN but a <code>COPY --from=X … node_modules</code> inherits X’s answer (follow the chain); a stage with neither has no node_modules (false).</li></ul>',
  vi: '<p>Chỉ giai đoạn cuối thành ảnh. Phân tích một Dockerfile (có thể nhiều giai đoạn) và trả về <code>{ stages, final, copiesFrom, devDepsInImage }</code>:</p><ul><li><code>stages</code> — tên các giai đoạn theo thứ tự (<code>FROM x AS tên</code>; giai đoạn không tên được gọi bằng chỉ số, <code>"0"</code>, <code>"1"</code>…);</li><li><code>final</code> — tên giai đoạn cuối; <code>copiesFrom</code> — các nguồn <code>--from=</code> khác nhau trong các dòng <code>COPY</code> của nó, theo thứ tự;</li><li><code>devDepsInImage</code> — ảnh cuối có chứa devDependencies không? node_modules của một giai đoạn có chúng nếu <code>RUN npm ci|install|i</code> cuối cùng của nó thiếu <code>--omit=dev</code> / <code>--production</code> / <code>--only=prod</code>; giai đoạn không có RUN đó nhưng có <code>COPY --from=X … node_modules</code> thì nhận câu trả lời của X (đi theo chuỗi); giai đoạn không có cả hai thì không có node_modules (false).</li></ul>',
  goiY: [['First group the lines under their FROM into { name, from, lines } objects.', 'Trước hết gom các dòng dưới FROM của chúng thành object { name, from, lines }.'], ['devDeps(stage) is naturally recursive: look at its own install, else at the stage it copied node_modules from.', 'devDeps(stage) tự nhiên là đệ quy: xem lệnh cài của chính nó, không thì xem giai đoạn nó chép node_modules từ đó.']],
  loi: [['Copying node_modules from the builder (which ran a full npm ci): the compiler and the test runner ship anyway — the reason the deps stage exists.', 'Chép node_modules từ builder (đã chạy npm ci đầy đủ): trình biên dịch và bộ chạy test vẫn lên server — đó là lý do có giai đoạn deps.'], ['Judging the image by its first stage.', 'Đánh giá ảnh theo giai đoạn đầu.']],
  gt: ['builder can be 500 MB — it is thrown away after the build; deps is separate so that its install layer is cached independently and holds only production packages; runner is the only thing that reaches the server. In the naive image typescript alone was 23 MB of code never run there.', 'builder có thể nặng 500 MB — nó bị bỏ sau khi build; deps tách riêng để tầng cài đặt được cache độc lập và chỉ giữ gói production; runner là thứ duy nhất tới server. Trong ảnh ngây thơ, riêng typescript đã là 23 MB mã không bao giờ chạy ở đó.'],
  kn: ['Docker', 'multi-stage', 'parsing'],
  tns: [tn('devDependencies', 'phụ thuộc lúc phát triển'), tn('--omit=dev', '--omit=dev', 'install production dependencies only')],
  dau: `/** describe the stage that ships */
function finalStage(text) {
  // Write your solution here
  const froms = text.split('\\n').filter((l) => /^FROM/i.test(l.trim()));
  const names = froms.map((l, i) => (/ AS (\\S+)/i.exec(l) || [, String(i)])[1]);
  return { stages: names, final: names[0], copiesFrom: [], devDepsInImage: /npm ci\\n/.test(text) };
}
`,
  giai: '// Reference solution\n' + nguon(finalStage),
  cases: [
    { goi: goi('finalStage', MULTI), moTa: ['builder → deps → runner', 'builder → deps → runner'] },
    { goi: goi('finalStage', MULTI_LEAKY), moTa: ['node_modules copied from the builder', 'node_modules chép từ builder'] },
    { goi: goi('finalStage', NAIVE), an: true },
    { goi: goi('finalStage', SLIM), an: true },
    { goi: goi('finalStage', 'FROM node:22-slim AS a\nRUN npm ci --production\nFROM node:22-slim AS b\nCOPY --from=a /app/node_modules ./node_modules\nFROM node:22-slim\nCOPY --from=b /app/node_modules ./node_modules\nCOPY --from=b /app/x ./x'), an: true },
  ],
});

export default modul('nodejs-17-1-anh-docker', '17.1 The image: what goes in, and what ships', [E1, E2, E3, E4]);
