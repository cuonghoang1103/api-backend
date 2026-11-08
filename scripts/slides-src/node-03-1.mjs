/**
 * node-03-1 — Node.js · Chapter 3 · Lesson 3.1 "path and fs" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s03-*.mjs › nodejs-3-1-path-fs. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c3).
 * Bổ sung so với bài web: path.posix vs path.win32 chạy thật (hai hệ trên một máy), resolve chạy thật, path traversal chạy thật (bị chặn),
 * thứ tự ba phong cách fs chạy thật, công thức fs chạy thật, check-then-read (TOCTOU) dựng lại trong một chương trình, mã lỗi thật EISDIR / ENOTDIR.
 */
import { lamDeck, two, box, kw, vsd, bang, steps, flow, cards, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-03-1', code: 'NODE 3.1', title: 'path and fs', sub: 'Node.js — from zero to production' };

export const slides = lamDeck({ chuong: 'Chapter 3 — Core Modules', bai: '3.1' }, [
  { cover: true, t: 'path and fs', sub: 'Build paths safely. Touch the disk without blocking, and without races.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why you <b>never glue paths</b> with strings (on two operating systems)</li>
<li><code class="i">join</code> vs <code class="i">resolve</code>, and the <b>path traversal</b> trap</li>
<li><code class="i">fs</code> has <b>three styles</b>: which one to use, which one blocks</li>
<li>Everyday recipes, and why "check if the file exists" is a bug</li>
</ul>
${kw('core module', 'a module built into Node: no npm install needed (node:path, node:fs…)')}` },

  { t: 'Never build a path by gluing strings', giua: true, body: `${runJs(ma('c3/path-demo'), ra('c3/path-demo'), { hl: [4, 9, 10], hlOut: [1, 5, 6] })}
${box('Two things join does for free', 'It resolves <code class="i">..</code> and it removes duplicate slashes. <code class="i">/var/www//uploads</code> usually works… until it is a URL, a cache key, or an S3 key, where <code class="i">//</code> makes an invisible empty folder.', 'do2')}` },

  { t: 'Same code, two operating systems', to: true, giua: true, body: `${runJs(ma('c3/two-os'), ra('c3/two-os'), { hl: [4, 5, 6], hlOut: [1, 2, 4] })}
${two(box('Windows', 'Separator is <code class="i">\\</code>. Gluing <code class="i">/</code> by hand gives mixed slashes.', 'do2'), box('path.join', 'Uses the separator of the machine it runs on: <code class="i">path.sep</code>.', 'xanh'))}` },

  { t: 'join vs resolve, and taking a path apart', giua: true, body: `${term(ra('c3/resolve', 2, 6), { title: 'node resolve.js · real output (started in /private/tmp/notes-api-demo)' })}${bang(['Function', 'What it does'], [
    ['<code class="i">path.join</code>', 'Glue pieces with the right separator'],
    ['<code class="i">path.resolve</code>', 'Build an <b>absolute</b> path, from the current working directory'],
    ['<code class="i">extname / basename / parse</code>', 'Take a path apart (instead of <code class="i">split(\'.\')</code>)'],
  ], { co: 21 })}
${box('resolve, right to left', 'It walks from the right until it has an absolute path, then fills in <code class="i">process.cwd()</code> if needed. Use it when the result must NOT depend on where the process was started.', 'lam')}
${kw('working directory', 'the folder the process was started from (process.cwd())')}` },

  { t: 'Security trap: path traversal', giua: true, body: `${runJs(ma('c3/traversal', 3, 15), ra('c3/traversal'), { hl: [3, 5, 6], hlOut: [3, 4] })}
${box('Never', '<code class="i">path.join(uploadDir, req.params.filename)</code> with a name from the user. <code class="i">../../etc/passwd</code> escapes your folder. Resolve, then check it still <b>starts with</b> your folder + separator.', 'do2')}` },

  { t: 'fs has three styles', giua: true, body: js(ma('c3/fs-three'), { sm: true, hl: [6, 7, 8] }) + two(term(ra('c3/fs-three'), { hl: [1] }), bang(['Style', 'Use it?'], [
    ['<code class="i">fs/promises</code> + await', '<b>Yes</b>: the one this course uses'],
    ['callback', 'Older; still all over libraries'],
    ['<code class="i">readFileSync</code>', '<b style="color:#b0281a">Blocks the loop</b>: only at startup'],
  ], { co: 20, hl: [0] })) + box('Why sync is dangerous', 'While <code class="i">readFileSync</code> runs, the whole process serves nobody (Chapter 2). OK to load config before the server listens; inside a request handler it is always a bug.', 'do2') },

  { t: 'Everyday recipes', giua: true, body: `${runJs(ma('c3/fs-recipes'), ra('c3/fs-recipes'), { hl: [4, 7, 10, 13], hlOut: [1, 2] })}` },

  { t: 'Does the file exist? Do not ask', giua: true, body: `${vsd(js(`// race: the file can vanish
// between the check and the read
if (existsSync(p)) {
  await fs.readFile(p);
}`, { sm: true }), js(`// just try, then handle failure
try { await fs.readFile(p); }
catch (err) {
  if (err.code === 'ENOENT') { /* not found */ }
  else throw err;
}`, { sm: true }))}
${two(term(ra('c3/toctou'), { title: 'node toctou.mjs · the "other process" is simulated', hl: [1] }), box('TOCTOU', 'Time Of Check To Time Of Use: the world changes between your check and your action. The check gave you a false promise.', ''))}` },

  { t: 'Error codes you will handle', giua: true, body: `${js(ma('c3/enoent', 4, 13), { sm: true, hl: [4] })}${two(term(ra('c3/enoent'), { hl: [1, 2, 3] }), bang(['Code', 'Meaning'], [
    ['<b>ENOENT</b>', 'No such file or folder: the one you handle most'],
    ['<b>EACCES</b>', 'Permission denied: common in Docker (not root)'],
    ['<b>EISDIR / ENOTDIR</b>', 'Folder used as a file, or the other way round'],
    ['<b>EMFILE</b>', 'Too many open files: a file-handle leak'],
  ], { co: 19 }), 'r46')}` },

  { t: 'This website barely touches its disk', to: true, giua: true, body: `${flow([{ t: 'upload', s: 'request body', mau: '#2563eb' }, { t: 'Node', s: 'streams it on', mau: '#15803d' }, { t: 'Cloudflare R2', s: 'object storage', mau: '#ea580c' }], { w: 1100, h: 130 })}
${box('Why', 'A container is replaceable: whatever it writes inside disappears at the next deploy. Treat the container file system as <b>scratch space</b> (Chapter 10, Chapter 17).', 'lam')}
${cards([['Code', 'Baked into the image at build time.'], ['Uploads', 'Object storage (R2), never the container disk.'], ['Logs', 'Written to stdout, collected outside (Chapter 15).']])}
${kw('container', 'a packaged, disposable copy of your app and its files (Docker)')}` },

  { t: 'Building a path that survives every platform', to: true, giua: true, body: steps([
    '<b>Never glue strings.</b> <code class="i">dir + "/" + name</code> breaks on Windows, doubles slashes, cannot normalise <code class="i">..</code>',
    '<b>path.join for pieces.</b> Right separator, no extra slashes. The daily tool.',
    '<b>path.resolve for an absolute path.</b> Right to left, then fills in <code class="i">process.cwd()</code>.',
    '<b>Check the result before using it.</b> resolve + startsWith(root + sep) stops directory traversal.',
  ]) + vsd(js(`const p = dir + '/' + name;`, { sm: false }), js(`const p = path.join(dir, name);`, { sm: false }), '✗ Glued', '✓ Joined') },

  { t: 'Exercise: predict the result', to: true, giua: true, body: two(js(ma('c3/ex-path'), { sm: true }), `<div data-k="dapan">${term(ra('c3/ex-path'), { title: 'real output' })}</div>`, 'r73') + box('Hint', 'join resolves <code class="i">..</code>. extname takes only the LAST dot. resolve starts from <code class="i">/srv/app</code> and climbs up twice.', '') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why is <code class="i">path.join(UPLOADS, req.params.name)</code> dangerous?</li>
<li>When is <code class="i">readFileSync</code> acceptable in a server?</li>
<li>Why is <code class="i">if (existsSync(p)) readFile(p)</code> a bug?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. A name like <code class="i">../../etc/passwd</code> escapes the folder. &nbsp; 2. Only at startup, before the server listens. &nbsp; 3. The file can disappear between the check and the read: try, then handle ENOENT.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>path.join</b> to glue, <b>path.resolve</b> for absolute paths</li>
<li>User input in a path: resolve + <b>startsWith</b> check</li>
<li>Use <b>fs/promises</b>; Sync only at startup</li>
<li>Do not check-then-act: <b>try, then handle err.code</b></li>
</ul>
${box('Next', 'Lesson 3.2 — Buffers: binary data.', 'lam')}` },
]);
