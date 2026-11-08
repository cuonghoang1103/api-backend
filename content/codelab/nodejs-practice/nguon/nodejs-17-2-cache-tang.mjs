/** Node.js 17.2 — Cache tầng: luật một câu, đổi chỗ hai dòng 4,36 s vs 0,47 s, .dockerignore, ARG khai muộn, build cho đúng kiến trúc. */
import { modul, cs, q, qn, ord, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'The cache rule, the context, and four silent cache breakers', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.2.',
  vi: 'Câu hỏi về bài 17.2.',
  cau: [
    q('c1', ['What does the layer cache compare to decide whether a COPY step can be reused?', 'Cache tầng so sánh gì để quyết định một bước COPY có dùng lại được không?'],
      ['A checksum of the files copied (plus the layer below)', 'The modification time of the Dockerfile', 'The current date, so caches expire every night', 'The network: whether the registry has a newer layer'],
      ['For RUN it is the command text plus the layer below — never the clock, never the network. When an input changes, that layer and every layer after it rebuild.', 'Với RUN là chữ của lệnh cộng tầng bên dưới — không bao giờ là đồng hồ hay mạng. Khi đầu vào đổi, tầng đó và mọi tầng sau nó build lại.']),
    q('c2', ['package.json lives in ./api, the Dockerfile in the project root. COPY package*.json ./ finishes in 0.0 s with DONE. What happens next?', 'package.json nằm trong ./api, Dockerfile ở gốc dự án. COPY package*.json ./ xong trong 0,0 s và in DONE. Chuyện gì xảy ra tiếp?'],
      ['npm ci fails with EUSAGE (no lockfile) — the glob matched nothing and did not complain', 'Docker searches subfolders and copies ./api/package.json automatically', 'The build stops at the COPY with “file not found”', 'npm ci succeeds because it downloads package.json from the registry'],
      ['A COPY with a glob does not complain when it matches no file. When you see this, check the build context first, not npm.', 'COPY có ký tự đại diện không phàn nàn khi không khớp tệp nào. Gặp cảnh này, kiểm build context trước, đừng đổ cho npm.']),
    q('c3', ['Without .dockerignore, the COPY . . build sent 66.16 MB of context. What else was true of that image?', 'Không có .dockerignore, bản build COPY . . gửi 66,16 MB context. Điều gì khác cũng đúng với ảnh đó?'],
      ['It contained the whole DATABASE_URL line of the (fake) .env and the .git folder', 'It was smaller, because the Mac’s node_modules replaced the npm ci layer', 'It built faster, because nothing had to be downloaded', 'It was identical to the image built with .dockerignore'],
      ['With .dockerignore: 465 B sent, 5.98 s vs 10.76 s, 84.3 MB vs 103 MB, no .env, no .git. Selective COPY decides what goes into the image; .dockerignore decides what may ever leave your machine.', 'Có .dockerignore: gửi 465 B, 5,98 s so với 10,76 s, 84,3 MB so với 103 MB, không .env, không .git. COPY chọn lọc quyết định thứ vào ảnh; .dockerignore quyết định thứ được phép rời khỏi máy bạn.']),
    qn('c4', ['Which of these silently break the cache? (choose all that apply)', 'Những thứ nào làm vỡ cache âm thầm? (chọn mọi câu đúng)'],
      ['A moving base tag re-pulled with a new patch', 'A fresh CI runner with no --cache-from', 'An ARG that changes every build, declared at the top', 'Adding a comment line after the last RUN'],
      [0, 1, 2],
      ['Plus COPY . . before installing. docker build --progress=plain prints CACHED next to each reused step: if npm ci is not CACHED after a code-only change, something above it changed.', 'Cộng thêm COPY . . trước khi cài. docker build --progress=plain in CACHED cạnh mỗi bước dùng lại: nếu npm ci không CACHED sau khi chỉ đổi mã, có thứ gì phía trên nó đã đổi.']),
    q('c5', ['An Apple Silicon Mac builds for a typical amd64 VPS. Measured: a 300-million-step loop 369 ms native vs 4,609 ms emulated, but npm ci 3.82 s vs 4.41 s. Why so different?', 'Một Mac Apple Silicon build cho VPS amd64 thông thường. Đo được: vòng lặp 300 triệu bước 369 ms gốc so với 4.609 ms giả lập, nhưng npm ci 3,82 s so với 4,41 s. Vì sao chênh nhau thế?'],
      ['npm ci mostly waits on the network; emulation only hurts what computes', 'npm ci is written in Go, which is never emulated', 'Docker caches the amd64 npm ci layer from the registry', 'The loop used worker threads, which emulation cannot share'],
      ['Build with --platform set to the target, or buildx for both. Running the wrong one gives exec format error, or works 12.5× slower on CPU work.', 'Build với --platform đặt theo máy đích, hoặc buildx cho cả hai. Chạy sai kiến trúc thì báo exec format error, hoặc chạy chậm 12,5 lần với việc CPU.']),
  ],
  goiY: [['Rarely-changing things at the top, often-changing at the bottom.', 'Thứ hiếm đổi ở trên, thứ hay đổi ở dưới.'], ['The context is whatever was sent to BuildKit.', 'Context là thứ đã được gửi cho BuildKit.']],
  loi: [['Blaming npm for an empty COPY glob.', 'Đổ lỗi npm cho một COPY glob rỗng.'], ['Relying on selective COPY and skipping .dockerignore.', 'Dựa vào COPY chọn lọc mà bỏ .dockerignore.']],
  tns: [tn('build context', 'build context', 'the folder sent to the builder'), tn('BuildKit', 'BuildKit'), tn('CACHED', 'CACHED', 'the step reused a stored layer')],
  kn: ['Docker', 'build cache'],
});

const E2 = cs({
  ten: 'Five layers in the right order', kho: 'EASY', phut: 4, loai: 'order',
  en: 'Order the Dockerfile so that a one-line source change re-runs only the build.',
  vi: 'Sắp Dockerfile sao cho đổi một dòng mã nguồn chỉ chạy lại bước build.',
  cau: [
    ord('o1', ['From rarely to often changed.', 'Từ hiếm đổi tới hay đổi.'], [
      'FROM node:22.23.4-slim (+ system packages)',
      'COPY package*.json ./',
      'RUN npm ci',
      'COPY src ./src',
      'RUN npm run build',
    ], ['npm ci is the most expensive layer and stays cached until the lockfile changes; the source changes every commit so it comes after it; the build re-runs on every code change, but that is work you really have to do. Measured: 4.36 s → 0.47 s (9.3×).', 'npm ci là tầng đắt nhất và được cache tới khi lockfile đổi; mã nguồn đổi mỗi commit nên đứng sau nó; build chạy lại mỗi lần đổi mã, nhưng đó là việc bắt buộc phải làm. Đo được: 4,36 s → 0,47 s (9,3 lần).']),
    ord('o2', ['FROM · ARG GIT_SHA · WORKDIR · COPY . . · RUN npm ci --omit=dev · RUN echo $GIT_SHA > version.txt — reorder it (lesson exercise).', 'FROM · ARG GIT_SHA · WORKDIR · COPY . . · RUN npm ci --omit=dev · RUN echo $GIT_SHA > version.txt — sắp lại (bài tập của bài).'], [
      'FROM node:22.23.4-slim',
      'WORKDIR /app',
      'COPY package*.json ./',
      'RUN npm ci --omit=dev',
      'COPY src ./src',
      'ARG GIT_SHA',
      'RUN echo $GIT_SHA > version.txt',
    ], ['Every RUN after an ARG receives that variable, so a new value breaks its cache: declare build args as late as possible (6.53 s at the top vs 1.79 s right before its RUN).', 'Mọi RUN sau một ARG đều nhận biến đó, nên giá trị mới làm vỡ cache của nó: khai ARG càng muộn càng tốt (6,53 s khi ở đầu so với 1,79 s khi ngay trước RUN dùng nó).']),
  ],
  goiY: [['Ask of each line: how often does its input change?', 'Hỏi mỗi dòng: đầu vào của nó đổi thường xuyên tới đâu?'], ['An ARG that changes every commit belongs just above the one RUN that uses it.', 'ARG đổi mỗi commit đứng ngay trên RUN duy nhất dùng nó.']],
  loi: [['COPY . . before npm ci.', 'COPY . . trước npm ci.'], ['ARG at the top of the file.', 'ARG ở đầu tệp.']],
  tns: [tn('ARG', 'ARG', 'a build-time variable')],
  kn: ['Docker'],
});

function contextFiles(files, dockerignore) {
  // Mỗi dòng là một luật; "!" mở lại; luật KHỚP SAU CÙNG thắng. Luật khớp chính đường dẫn, mọi thứ bên trong nó,
  // hoặc theo ký tự đại diện (* trong một đoạn, ** qua nhiều đoạn), luôn tính từ gốc context.
  const rules = dockerignore.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const neg = l.startsWith('!');
    const p = (neg ? l.slice(1) : l).replace(/^\/+|\/+$/g, '');
    const rx = new RegExp('^' + p.split(/(\*\*\/|\*\*|\*)/).map((t) => (t === '**/' ? '(?:.*/)?' : t === '**' ? '.*' : t === '*' ? '[^/]*' : t.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))).join('') + '(/.*)?$');
    return { neg, rx };
  });
  return files.filter((f) => {
    let ignored = false;
    for (const r of rules) if (r.rx.test(f)) ignored = !r.neg;
    return !ignored;
  });
}
const FILES = ['Dockerfile', 'package.json', 'package-lock.json', 'src/index.js', 'src/routes/notes.js', '.env', '.env.example', '.git/HEAD', '.git/objects/ab/cdef', 'node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node', 'node_modules/express/index.js', 'dist/index.js', 'debug.log', 'logs/app.log', 'README.md'];
const E3 = await jsBai({
  ten: 'contextFiles(files, dockerignore): what leaves your machine', kho: 'MEDIUM', phut: 15,
  en: '<p>Before line 1 runs, Docker sends the build context to BuildKit, filtered by <code>.dockerignore</code>. Write <code>contextFiles(files, dockerignore)</code> returning the files that are <b>sent</b>, in input order. Rules (a simplified .dockerignore):</p><ul><li>one pattern per line; blank lines and lines starting with <code>#</code> are ignored; leading/trailing <code>/</code> are removed; paths are relative to the context root;</li><li>a pattern matches a path that equals it <b>or lies inside it</b> (<code>node_modules</code> matches <code>node_modules/express/index.js</code>);</li><li><code>*</code> matches any characters except <code>/</code>; <code>**/</code> matches zero or more directories (so <code>**/*.log</code> also matches <code>debug.log</code>), a bare <code>**</code> matches anything;</li><li><code>!pattern</code> re-includes; when several rules match, the <b>last</b> one wins.</li></ul>',
  vi: '<p>Trước khi dòng 1 chạy, Docker gửi build context cho BuildKit, đã lọc qua <code>.dockerignore</code>. Viết <code>contextFiles(files, dockerignore)</code> trả về các tệp được <b>gửi đi</b>, theo thứ tự đầu vào. Luật (.dockerignore rút gọn):</p><ul><li>mỗi dòng một mẫu; dòng trống và dòng bắt đầu bằng <code>#</code> bị bỏ; <code>/</code> ở đầu/cuối được cắt; đường dẫn tính từ gốc context;</li><li>mẫu khớp đường dẫn bằng đúng nó <b>hoặc nằm bên trong nó</b> (<code>node_modules</code> khớp <code>node_modules/express/index.js</code>);</li><li><code>*</code> khớp mọi ký tự trừ <code>/</code>; <code>**/</code> khớp không hoặc nhiều thư mục (nên <code>**/*.log</code> khớp cả <code>debug.log</code>), <code>**</code> đứng riêng khớp mọi thứ;</li><li><code>!mẫu</code> mở lại; khi nhiều luật cùng khớp, luật <b>sau cùng</b> thắng.</li></ul>',
  goiY: [['Turn each pattern into a RegExp: escape regex characters, **/ → (?:.*/)?, ** → .*, * → [^/]*, and allow an optional (/.*)? at the end for “inside it”.', 'Biến mỗi mẫu thành RegExp: escape ký tự regex, **/ → (?:.*/)?, ** → .*, * → [^/]*, và cho phép (/.*)? ở cuối cho “nằm bên trong”.'], ['For each file walk all rules in order and keep the result of the last match.', 'Với mỗi tệp duyệt mọi luật theo thứ tự và giữ kết quả của lần khớp cuối.']],
  loi: [['Matching only exact paths: node_modules/… and .git/… are still sent — wrong-OS binaries and the whole history.', 'Chỉ khớp đường dẫn chính xác: node_modules/… và .git/… vẫn bị gửi — binary sai hệ điều hành và toàn bộ lịch sử.'], ['Letting * cross “/”: *.log then also drops logs/app.log, which is not what .dockerignore does.', 'Cho * vượt qua “/”: *.log khi đó bỏ cả logs/app.log, không đúng với .dockerignore.']],
  gt: ['Four lines — node_modules, .git, .env, dist — commit them on day one. node_modules is the wrong OS (the invalid ELF header of 17.1), .git holds a secret you deleted in a later commit, .env was readable in the image, and dist is rebuilt inside anyway.', 'Bốn dòng — node_modules, .git, .env, dist — commit ngay ngày đầu. node_modules sai hệ điều hành (lỗi invalid ELF header của 17.1), .git giữ một bí mật bạn đã xoá ở commit sau, .env đọc được trong ảnh, còn dist được build lại bên trong.'],
  kn: ['Docker', 'glob', 'regex'],
  tns: [tn('.dockerignore', '.dockerignore'), tn('negation', 'phủ định', '!pattern re-includes')],
  dau: `/** files sent in the build context */
function contextFiles(files, dockerignore) {
  // Write your solution here
  const rules = dockerignore.split('\\n').map((l) => l.trim()).filter(Boolean);
  return files.filter((f) => !rules.includes(f));
}
`,
  giai: '// Reference solution\n' + nguon(contextFiles),
  cases: [
    { goi: goi('contextFiles', FILES, 'node_modules\n.git\n.env\ndist'), moTa: ['The four-line .dockerignore', '.dockerignore bốn dòng'] },
    { goi: goi('contextFiles', FILES, ''), moTa: ['No .dockerignore at all', 'Không có .dockerignore'] },
    { goi: goi('contextFiles', FILES, '# secrets\n.env*\n!.env.example\n*.log\nnode_modules/\n/.git'), an: true },
    { goi: goi('contextFiles', FILES, '**/*.log\nsrc\n!src/index.js\nREADME.md'), an: true },
    { goi: goi('contextFiles', ['a.txt', 'b.txt'], '*\n!b.txt'), an: true },
  ],
});

function rebuiltSteps(dockerfile, change) {
  const steps = dockerfile.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const glob = (p) => new RegExp('^' + p.replace(/^\.\//, '').replace(/\/$/, '').split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*') + '(/.*)?$');
  const touches = (src) => src === '.' || src === './' ? change.files.length > 0 : change.files.some((f) => glob(src).test(f));
  const args = [];
  let busted = false;
  const out = [];
  for (const s of steps) {
    const [kw, ...rest] = s.split(/\s+/);
    const k = kw.toUpperCase();
    if (!busted) {
      if (k === 'FROM' && change.baseMoved) busted = true;                                     // tầng đáy mới ⇒ mọi thứ build lại
      if (k === 'ARG') args.push(rest[0].split('=')[0]);                                       // khai báo: chưa phá gì
      if (k === 'RUN' && args.some((a) => (change.args || []).includes(a))) busted = true;     // RUN nhận mọi ARG đã khai ⇒ giá trị mới phá cache
      if (k === 'COPY') {
        const srcs = rest.filter((t) => !t.startsWith('--')).slice(0, -1);                     // bỏ cờ, bỏ đích
        if (!rest.some((t) => t.startsWith('--from=')) && srcs.some(touches)) busted = true;    // checksum tệp được chép đã đổi
      }
    }
    if (busted) out.push(s);
  }
  return out;
}
const BAD = 'FROM node:22-slim\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["node", "src/index.js"]';
const GOOD = 'FROM node:22.23.4-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY src ./src\nCMD ["node", "src/index.js"]';
const ARG_TOP = 'FROM node:22.23.4-slim\nARG BUILD_TIME\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY src ./src\nRUN echo $BUILD_TIME > built.txt';
const ARG_LATE = 'FROM node:22.23.4-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY src ./src\nARG BUILD_TIME\nRUN echo $BUILD_TIME > built.txt';
const E4 = await jsBai({
  ten: 'rebuiltSteps(dockerfile, change): which steps re-run after a change?', kho: 'HARD', phut: 25,
  en: '<p>Simulate the layer cache of a <b>single-stage</b> Dockerfile with a warm cache. <code>change = { files, args, baseMoved }</code>: the context files whose content changed, the build args whose value changed, and whether the base tag now points to a new image. Walk the steps in order (blank lines and comments skipped); once one step is invalidated, it and <b>every later step</b> rebuild. A step is invalidated by:</p><ul><li><code>FROM</code> — when <code>baseMoved</code>;</li><li><code>COPY</code> (without <code>--from</code>) — when a changed file matches one of its sources: <code>.</code> matches any file; otherwise the source matches a file equal to it or inside it, <code>*</code> matching anything but <code>/</code> (<code>package*.json</code>, <code>src</code>, <code>src/</code>); flags like <code>--chown=…</code> are not sources, the last token is the destination;</li><li><code>RUN</code> — when any <code>ARG</code> declared above it (name before an optional <code>=default</code>) is in <code>args</code>. An <code>ARG</code> line itself never invalidates.</li></ul><p>Return the rebuilt step lines, in order.</p>',
  vi: '<p>Mô phỏng cache tầng của một Dockerfile <b>một giai đoạn</b> với cache đã ấm. <code>change = { files, args, baseMoved }</code>: các tệp trong context đã đổi nội dung, các build arg đã đổi giá trị, và thẻ ảnh nền giờ có trỏ tới ảnh mới không. Duyệt các bước theo thứ tự (bỏ dòng trống và chú thích); một khi một bước bị vô hiệu, nó và <b>mọi bước sau</b> đều build lại. Một bước bị vô hiệu khi:</p><ul><li><code>FROM</code> — khi <code>baseMoved</code>;</li><li><code>COPY</code> (không có <code>--from</code>) — khi một tệp đã đổi khớp một nguồn của nó: <code>.</code> khớp mọi tệp; còn lại nguồn khớp tệp bằng đúng nó hoặc nằm trong nó, <code>*</code> khớp mọi thứ trừ <code>/</code> (<code>package*.json</code>, <code>src</code>, <code>src/</code>); cờ như <code>--chown=…</code> không phải nguồn, token cuối là đích;</li><li><code>RUN</code> — khi một <code>ARG</code> khai phía trên (tên đứng trước <code>=mặc định</code> nếu có) nằm trong <code>args</code>. Bản thân dòng <code>ARG</code> không bao giờ làm vô hiệu.</li></ul><p>Trả về các dòng bước được build lại, theo thứ tự.</p>',
  goiY: [['Keep a single boolean busted; before it flips, check the step’s own rule; after it flips, every step is pushed.', 'Giữ một boolean busted; trước khi nó bật, xét luật riêng của bước; sau khi bật, bước nào cũng được đẩy vào.'], ['Remember declared ARG names in an array as you walk; a RUN checks that array against change.args.', 'Ghi nhớ tên các ARG đã khai vào một mảng khi duyệt; RUN so mảng đó với change.args.']],
  loi: [['Invalidating only the changed step: Docker rebuilds every layer AFTER it too, which is why npm ci re-ran on every commit.', 'Chỉ vô hiệu bước đã đổi: Docker build lại cả mọi tầng SAU nó, nên npm ci mới chạy lại ở mọi commit.'], ['Treating the ARG line as the invalidated step: the cache break shows up at the first RUN after it.', 'Coi dòng ARG là bước bị vô hiệu: chỗ vỡ cache hiện ra ở RUN đầu tiên sau nó.']],
  gt: ['COPY . . first: a one-line change to src/index.js re-runs npm ci (4.36 s). Package files first: npm ci stays CACHED, only COPY src and what follows re-run (0.47 s). An ARG BUILD_TIME at the top re-ran npm ci on every build (6.53 s); moved right before its RUN, only that step re-ran (1.79 s).', 'COPY . . trước: đổi một dòng src/index.js làm npm ci chạy lại (4,36 s). Tệp package trước: npm ci vẫn CACHED, chỉ COPY src và các bước sau chạy lại (0,47 s). ARG BUILD_TIME ở đầu làm npm ci chạy lại mỗi lần build (6,53 s); dời tới ngay trước RUN của nó thì chỉ bước đó chạy lại (1,79 s).'],
  kn: ['Docker', 'build cache', 'simulation'],
  tns: [tn('cache invalidation', 'vô hiệu cache'), tn('warm cache', 'cache đã ấm')],
  dau: `/** which steps re-run? */
function rebuiltSteps(dockerfile, change) {
  // Write your solution here — this only marks the COPY steps themselves
  const steps = dockerfile.split('\\n').map((l) => l.trim()).filter(Boolean);
  return steps.filter((s) => /^COPY/i.test(s) && change.files.some((f) => s.includes(f.split('/')[0])));
}
`,
  giai: '// Reference solution\n' + nguon(rebuiltSteps),
  cases: [
    { goi: goi('rebuiltSteps', BAD, { files: ['src/index.js'], args: [], baseMoved: false }), moTa: ['COPY . . first, one source line changed', 'COPY . . trước, đổi một dòng mã'] },
    { goi: goi('rebuiltSteps', GOOD, { files: ['src/index.js'], args: [], baseMoved: false }), moTa: ['Package files first, same change', 'Tệp package trước, cùng thay đổi'] },
    { goi: goi('rebuiltSteps', GOOD, { files: ['package-lock.json'], args: [], baseMoved: false }), an: true },
    { goi: goi('rebuiltSteps', ARG_TOP, { files: [], args: ['BUILD_TIME'], baseMoved: false }), an: true },
    { goi: goi('rebuiltSteps', ARG_LATE, { files: [], args: ['BUILD_TIME'], baseMoved: false }), an: true },
    { goi: goi('rebuiltSteps', GOOD, { files: ['README.md'], args: [], baseMoved: true }), an: true },
    { goi: goi('rebuiltSteps', 'FROM node:22.23.4-slim\nARG NODE_VER=22\nCOPY --chown=node:node package.json package-lock.json ./\nRUN npm ci\nCOPY --chown=node:node src/ ./src/\nRUN npm test', { files: ['README.md', 'src/lib/x.js'], args: ['OTHER'], baseMoved: false }), an: true },
  ],
});

export default modul('nodejs-17-2-cache-tang', '17.2 Layer cache, build context and .dockerignore', [E1, E2, E3, E4]);
