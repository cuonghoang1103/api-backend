/**
 * node-03-3 — Node.js · Chapter 3 · Lesson 3.3 "Streams: the 348 MB experiment" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s03-*.mjs › nodejs-3-3-stream. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c3), tệp log tự sinh 6 000 000 dòng ≈ 347,8 MB.
 * Khác bài web: gzip trên tệp của máy quay ra 5772 ms, 347,8 → 62,9 MB (web 1169 ms, 348 → 15 MB: tệp web lặp hơn). Video theo số mới.
 * Bổ sung: trần 2 GiB đo thật (ERR_FS_FILE_TOO_LARGE), backpressure đo thật (bỏ qua write(): +331 MB; tôn trọng: hàng chờ tối đa 16 KB), .pipe() rò rỉ vs pipeline chạy thật.
 */
import { lamDeck, two, box, kw, vsd, bang, steps, cards, flow, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-03-3', code: 'NODE 3.3', title: 'Streams: the 348 MB experiment', sub: 'Node.js — from zero to production' };
const so = (ten, re) => Number(ra(ten).match(re)[1]);
const A = { ram: so('c3/read-all', /RAM after :\s*(\d+)/), t: so('c3/read-all', /time: (\d+)/) };
const S = { ram: so('c3/read-stream', /RAM peak  :\s*(\d+)/), t: so('c3/read-stream', /time: (\d+)/) };

export const slides = lamDeck({ chuong: 'Chapter 3 — Core Modules', bai: '3.3' }, [
  { cover: true, t: 'Streams:<br>the 348 MB experiment', sub: 'Process data piece by piece as it arrives, instead of loading it all first.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A measured experiment: <b>readFileSync vs stream</b> on a 348 MB file</li>
<li>The <b>four kinds</b> of stream</li>
<li><code class="i">pipeline</code>: connect streams safely (and why not <code class="i">.pipe()</code>)</li>
<li><b>Backpressure</b>: the idea that makes streams powerful</li>
</ul>
${kw('stream', 'data that flows in small chunks, processed as each chunk arrives')}` },

  { t: 'Experiment A: load the whole file', giua: true, body: `${runJs(ma('c3/read-all'), ra('c3/read-all'), { hl: [8], hlOut: [3, 4] })}` },

  { t: 'Experiment B: the same count, as a stream', giua: true, body: `${runJs(ma('c3/read-stream'), ra('c3/read-stream'), { hl: [7, 8], hlOut: [2, 3] })}` },

  { t: 'Read the result', to: true, giua: true, body: `${bang(['Method', 'Peak RAM', 'Time'], [
    ['readFileSync (whole file)', `<b style="color:#b0281a">${A.ram} MB</b>`, `${A.t} ms`],
    ['createReadStream (chunks)', `<b style="color:#15803d">${S.ram} MB</b>`, `${S.t} ms`],
  ], { co: 26, hl: [1] })}
${box('Conclusion', `The stream used about a third of the memory <b>and</b> finished sooner: it starts on the first chunk while the disk is still delivering the rest.`, 'xanh')}
${box('Now scale it', `Ten people upload a 348 MB file at once: the load-it-all way needs about 10 × ${A.ram} MB ≈ <b>${(10 * A.ram / 1024).toFixed(1)} GB</b>, and the OS kills the container. The stream way stays flat.`, 'do2')}` },

  { t: 'A hard ceiling: one Buffer, 2 GiB', to: true, giua: true, body: `${runJs(ma('c3/too-large'), ra('c3/too-large'), { hl: [4, 6], hlOut: [2, 3], sm: false })}
${box('No matter how much RAM you have', 'readFile on a file over 2 GiB throws. Big files <b>must</b> be streamed.', 'do2')}` },

  { t: 'Four kinds of stream', to: true, giua: true, body: cards([
    ['📖 Readable', 'A source of data: reading a file, an HTTP <b>request</b>.'],
    ['✍️ Writable', 'A destination: writing a file, an HTTP <b>response</b>.'],
    ['🔁 Transform', 'Changes data as it flows through: compression, encryption.'],
    ['↔️ Duplex', 'Reads AND writes: a TCP socket.'],
  ], 2) + flow([{ t: 'Readable', s: 'file', mau: '#2563eb' }, { t: 'Transform', s: 'gzip', mau: '#7c3aed' }, { t: 'Writable', s: 'file.gz', mau: '#15803d' }], { w: 1100, h: 130 }) },

  { t: 'pipeline: compress 348 MB, streaming', giua: true, body: `${runJs(ma('c3/gzip', 2, 16), ra('c3/gzip'), { hl: [10], hlOut: [1, 2, 3] })}
` },

  { t: 'Always pipeline, never a.pipe(b).pipe(c)', giua: true, body: `${two(js(ma('c3/pipe-leak', 4, 17), { sm: true, hl: [5, 7, 10] }), term(ra('c3/pipe-leak'), { hl: [2, 4] }), 'r64')}
${box('Why', 'The old <code class="i">.pipe()</code> does not pass errors along and does not clean up: if the write fails, the read stream stays open and you leak a file descriptor on every error. <code class="i">pipeline</code> destroys the whole chain and gives you <b>one place</b> to catch the error.', 'do2')}` },

  { t: 'Backpressure: the idea that makes streams powerful', to: true, giua: true, body: `${steps([
    '<b>The source reads fast</b>: chunks flow to the destination',
    '<b>The destination\'s buffer is full</b>: <code class="i">write()</code> returns <b>false</b>',
    '<b>The source pauses</b>: memory stops growing',
    '<b>\'drain\' fires</b>: the source flows again',
  ])}
${kw('backpressure', 'the slow side telling the fast side "wait": like water pressure building back up a pipe')}
${box('Free with pipeline', 'You get backpressure for free with pipeline. You lose it the moment you write your own loop and ignore what <code class="i">write()</code> returns.', 'lam')}
${flow([{ t: 'fast source', s: 'disk: reads fast', mau: '#2563eb' }, { t: 'buffer', s: 'highWaterMark', mau: '#ca8a04' }, { t: 'slow destination', s: 'network: writes slowly', mau: '#b0281a' }], { w: 1100, h: 130 })}` },

  { t: 'Backpressure, measured', giua: true, body: `${js(ma('c3/backpressure', 11, 16), { sm: true, hl: [3] })}${js(ma('c3/backpressure', 22, 28), { sm: true, hl: [5] })}${term(ra('c3/backpressure'), { hl: [1, 2] })}
${box('Read it', 'Ignoring <code class="i">write()</code> queued 313 MB inside the process. Respecting it kept the queue at 16 KB: the writer paused on every <b>false</b> and resumed on every <b>drain</b>.', 'xanh')}` },

  { t: 'Read a huge file line by line', giua: true, body: `${runJs(ma('c3/grep-errors'), ra('c3/grep-errors'), { hl: [5, 6], hlOut: [3] })}
${box('readline + for await', 'Handles any file size with a small, fixed amount of memory. Perfect for scanning logs.', 'xanh')}` },

  { t: 'This website streams its downloads', to: true, giua: true, body: `${flow([{ t: 'object storage', s: 'R2', mau: '#ea580c' }, { t: 'Node', s: 'small fixed buffer', mau: '#15803d' }, { t: 'response', s: 'to the viewer', mau: '#2563eb' }], { w: 1100, h: 130 })}
${two(box('Load it all', 'A 500 MB video needs 500 MB of RAM <b>per viewer</b>, and the viewer waits for the whole file to load into the server first.', 'do2'), box('Stream it', 'A small fixed buffer whatever the file size, and the viewer starts watching <b>immediately</b>.', 'xanh'))}
${kw('chunk', 'one piece of a stream, a Buffer of about 64 KB when reading a file')}` },

  { t: 'Exercise: fix this copy', to: true, giua: true, body: vsd(js(`// copies uploads/a.zip to backup/
createReadStream('uploads/a.zip')
  .pipe(createWriteStream('backup/a.zip'));
// what if backup/ is full?`, { sm: false }), `<div data-k="dapan">${js(`await pipeline(
  createReadStream('uploads/a.zip'),
  createWriteStream('backup/a.zip'),
);  // errors reach your try/catch,
    // both streams are closed`, { sm: false })}</div>`, '✗ Find two problems', '✓ Answer') + box('Hint', 'What happens to the read stream when the write fails? Where does the error go?', '') + kw('file descriptor', 'the number the OS gives an open file; leak enough of them and you hit EMFILE (lesson 3.1)') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why did the stream version use about a third of the memory?</li>
<li>What does <code class="i">write()</code> returning <code class="i">false</code> mean, and what should you do?</li>
<li>Why prefer <code class="i">pipeline</code> over <code class="i">.pipe()</code>?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Only one chunk at a time is in memory. &nbsp; 2. The destination\'s buffer is full: stop writing and wait for \'drain\'. &nbsp; 3. It forwards errors and destroys every stream in the chain.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Stream = process <b>chunk by chunk</b>: flat memory, starts sooner</li>
<li>Readable, Writable, Transform, Duplex</li>
<li>Connect with <b>pipeline</b>: errors + clean-up in one place</li>
<li><b>Backpressure</b>: write() false ⇒ pause ⇒ 'drain' ⇒ resume</li>
</ul>
${box('Next', 'Lesson 3.4 — EventEmitter.', 'lam')}` },
]);
