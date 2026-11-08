/** Node.js 3.3 — Stream: thí nghiệm 348 MB, đếm dòng theo chunk, tách dòng xuyên chunk, transform bằng async generator, backpressure. */
import { doiDau, KHOA, cs, q, ord, tn, nodeBai, nguon, goi, FAKE_EMITTER } from './_node-c3-5.mjs';

const E1 = cs({
  ten: '3.3 · The 348 MB experiment, read carefully', kho: 'EASY', phut: 7,
  en: 'Questions on the lesson’s measurements (readFileSync 395 MB peak · 3662 ms, createReadStream 120 MB · 2544 ms, gzip pipeline 75 MB) and on the stream rules.',
  vi: 'Các câu về số đo của bài (readFileSync đỉnh 395 MB · 3662 ms, createReadStream 120 MB · 2544 ms, pipeline gzip 75 MB) và các luật của stream.',
  cau: [
    q('c1', ['Why did the streaming version finish FASTER, not just use less memory?', 'Vì sao bản dùng stream xong NHANH hơn, chứ không chỉ tốn ít RAM hơn?'],
      ['It starts working on the first chunk while the disk is still delivering the rest', 'createReadStream reads with several threads, readFileSync with only one', 'Streams skip the bytes that are not newlines, so there is less to read', 'The second run hit the operating system’s file cache, so the disk was not used'],
      ['Reading and counting overlap: the CPU counts chunk 1 while chunk 2 is on its way. readFileSync makes the CPU wait for the whole file first.', 'Đọc và đếm chồng lên nhau: CPU đếm chunk 1 trong lúc chunk 2 đang tới. readFileSync bắt CPU chờ cả file trước.']),
    q('c2', ['Node 22, a 3 GB file, a server with 64 GB of RAM. What does <code>await fs.promises.readFile(file)</code> do?', 'Node 22, một file 3 GB, server có 64 GB RAM. <code>await fs.promises.readFile(file)</code> làm gì?'],
      ['Rejects with ERR_FS_FILE_TOO_LARGE: readFile refuses files larger than 2 GiB', 'Succeeds, because 3 GB fits easily in 64 GB of RAM', 'Succeeds but blocks the event loop until the file is read', 'Returns only the first 2 GiB and silently drops the rest'],
      ['Measured on Node 22 with a 2 GiB + 10 byte file: “File size (2147483658) is greater than 2 GiB”. Above that size, streaming is not an optimisation — it is the only way.', 'Đo trên Node 22 với file 2 GiB + 10 byte: “File size (2147483658) is greater than 2 GiB”. Trên cỡ đó, stream không còn là tối ưu — nó là cách duy nhất.']),
    q('c3', ['Why <code>pipeline(a, b, c)</code> instead of <code>a.pipe(b).pipe(c)</code>?', 'Vì sao <code>pipeline(a, b, c)</code> thay vì <code>a.pipe(b).pipe(c)</code>?'],
      ['.pipe() does not forward errors or clean up — a failed write leaks the open read stream', '.pipe() was removed in Node 22 and only pipeline exists now', 'pipeline is faster because it skips backpressure', '.pipe() converts every chunk to a string first'],
      ['pipeline destroys every stream in the chain on error and gives you one place to catch it. With .pipe(), a write failure halfway leaves a file descriptor open on every failure.', 'pipeline huỷ mọi stream trong chuỗi khi có lỗi và cho bạn một chỗ duy nhất để bắt. Với .pipe(), ghi hỏng giữa chừng để lại một file descriptor mở sau mỗi lần hỏng.']),
    q('c4', ['A TCP socket is which kind of stream?', 'Một socket TCP là loại stream nào?'],
      ['Duplex — readable and writable', 'Transform — it changes the bytes', 'Readable — the server only reads from it', 'Writable — the server only writes to it'],
      ['You read what the other side sends AND write what you send back, independently. A Transform (gzip) is a Duplex whose output is computed from its input.', 'Bạn đọc thứ đầu kia gửi VÀ ghi thứ mình trả lại, độc lập nhau. Transform (gzip) là một Duplex mà đầu ra tính từ đầu vào.']),
    q('c5', ['A writable with <code>highWaterMark: 4</code>: <code>w.write(\'ab\')</code> then <code>w.write(\'cd\')</code> returns…', 'Một writable có <code>highWaterMark: 4</code>: <code>w.write(\'ab\')</code> rồi <code>w.write(\'cd\')</code> trả về…'],
      ['true, then false — the buffer reached 4 bytes, wait for "drain"', 'true, then true — 4 bytes still fit in a buffer of 4', 'false, then false — write() returns false while it is busy', 'true, then it throws because the buffer is full'],
      ['write() returns false once the buffered length reaches highWaterMark (checked on Node 22: true, false, writableLength 4). The data is NOT lost — false is a request to stop until "drain".', 'write() trả false khi độ dài đang đệm chạm highWaterMark (kiểm trên Node 22: true, false, writableLength 4). Dữ liệu KHÔNG mất — false là lời đề nghị dừng tới khi có "drain".']),
  ],
  goiY: [['Look at both numbers of each run: peak RAM AND time.', 'Nhìn cả hai con số của mỗi lần chạy: RAM đỉnh VÀ thời gian.'], ['“false” from write() is a signal, not an error.', '“false” từ write() là một tín hiệu, không phải lỗi.']],
  loi: [['Thinking enough RAM makes readFile safe for any file.', 'Tưởng đủ RAM thì readFile an toàn với mọi file.'], ['Treating write() === false as “the chunk was dropped”.', 'Coi write() === false là “chunk đã bị bỏ”.']],
  tns: [tn('chunk', 'mẩu dữ liệu'), tn('highWaterMark', 'ngưỡng đệm', 'how much a stream buffers before write() says false'), tn('file descriptor', 'mô tả tệp (fd)')],
  kn: ['streams'],
});

const E2 = cs({
  ten: '3.3 · Backpressure, step by step', kho: 'EASY', phut: 4, loai: 'order',
  en: 'Put the lesson’s backpressure cycle in order: a fast disk feeding a slow network.',
  vi: 'Sắp xếp vòng backpressure của bài theo đúng thứ tự: ổ đĩa nhanh cấp dữ liệu cho mạng chậm.',
  cau: [
    ord('o1', ['Order the events of one backpressure cycle.', 'Sắp các sự kiện của một vòng backpressure.'],
      ['The source reads fast; chunks flow into the destination', 'The destination’s buffer fills up and write() returns false', 'The source pauses — memory stops growing', 'The destination flushes its buffer and emits "drain"', 'The source resumes reading'],
      ['pipeline does this for you. A hand-written loop that ignores the false from write() skips steps 3–5 — and the memory blow-up you used streams to avoid comes back.', 'pipeline làm việc này giúp bạn. Vòng lặp tự viết mà phớt lờ giá trị false của write() bỏ qua bước 3–5 — và vụ nổ RAM mà bạn dùng stream để tránh lại quay về.']),
  ],
  goiY: [['Who notices the problem first: the source or the destination?', 'Ai thấy vấn đề trước: nguồn hay đích?'], ['"drain" can only come after a false.', '"drain" chỉ đến sau một lần false.']],
  loi: [['Putting "drain" before the buffer fills.', 'Đặt "drain" trước khi bộ đệm đầy.'], ['Thinking the source is told to stop by an error.', 'Tưởng nguồn được bảo dừng bằng một lỗi.']],
  tns: [tn('backpressure', 'áp lực ngược', 'the slow side holding back the fast side'), tn('drain', 'sự kiện “đã rút cạn”')],
  kn: ['streams', 'backpressure'],
});

/* ─── 3. đếm dòng theo chunk ─── */
function countLines(chunks) {
  // each chunk is an array of byte values; a line ends at byte 10 ("\n")
  let lines = 0;
  for (const chunk of chunks) {
    for (const b of chunk) if (b === 10) lines++;
  }
  return lines;
}
const E3 = nodeBai({
  ten: '3.3 · Count lines chunk by chunk', kho: 'EASY', phut: 8,
  en: `<p>The lesson’s streaming version:</p><pre>fs.createReadStream(file)
  .on('data', (chunk) =&gt; { for (const ch of chunk) if (ch === 10) lines++; })</pre><p>Write <code>countLines(chunks)</code>: <code>chunks</code> is the list of chunks the stream delivered, each an array of byte values. Return how many newline bytes (10) there are in total — the same count the lesson got for its 6,000,000-line file. Do not join the chunks into one big array first: that is the memory you are trying not to spend.</p>`,
  vi: `<p>Bản dùng stream của bài:</p><pre>fs.createReadStream(file)
  .on('data', (chunk) =&gt; { for (const ch of chunk) if (ch === 10) lines++; })</pre><p>Viết <code>countLines(chunks)</code>: <code>chunks</code> là danh sách các chunk stream đã đưa, mỗi chunk là mảng giá trị byte. Trả về tổng số byte xuống dòng (10) — đúng con số bài đếm được cho file 6.000.000 dòng. Đừng ghép mọi chunk thành một mảng lớn trước: đó chính là RAM bạn đang cố không tiêu.</p>`,
  dauVao: ['chunks — array of arrays of bytes (0–255)', 'chunks — mảng các mảng byte (0–255)'], dauRa: ['number of bytes equal to 10', 'số byte bằng 10'],
  goiY: [['Two nested loops: over chunks, then over the bytes of one chunk.', 'Hai vòng lồng nhau: qua các chunk, rồi qua các byte của một chunk.'], ['A newline split across chunks is impossible here: it is a single byte.', 'Ký tự xuống dòng không thể bị cắt đôi giữa hai chunk: nó chỉ là một byte.']],
  loi: [['Counting chunks instead of newline bytes.', 'Đếm số chunk thay vì số byte xuống dòng.'], ['chunks.flat() first — correct answer, but it rebuilds the whole file in memory.', 'chunks.flat() trước — đúng kết quả, nhưng dựng lại cả file trong RAM.']],
  gt: ['This is the lesson’s experiment in miniature: the work per chunk is the same as on the whole file, so the answer is identical — only the peak memory differs. A hidden check feeds 200 chunks; the source check forbids <code>flat()</code>/<code>concat</code>.', 'Đây là thí nghiệm của bài thu nhỏ: việc làm trên mỗi chunk giống hệt trên cả file, nên kết quả y nhau — chỉ RAM đỉnh khác. Một kiểm ẩn đưa 200 chunk; kiểm mã nguồn cấm <code>flat()</code>/<code>concat</code>.'],
  kn: ['streams'], tns: [tn('peak memory', 'bộ nhớ đỉnh')],
  dau: `/** total number of newline bytes (10) across all chunks */
function countLines(chunks) {
  // Write your solution here
  return chunks.length;
}
`,
  giai: '// Reference solution — the lesson\'s data handler, applied to each chunk in turn\n' + nguon(countLines),
  cases: [
    { goi: goi('countLines', [[104, 105, 10, 111, 107, 10]]), moTa: ['One chunk, two lines', 'Một chunk, hai dòng'] },
    { goi: goi('countLines', [[104, 105], [10, 111], [107, 10, 10]]), moTa: ['Three chunks', 'Ba chunk'] },
    { goi: goi('countLines', []), an: true },
    { goi: goi('countLines', [[], [10], []]), an: true },
    { goi: 'countLines(Array.from({ length: 200 }, (_, i) => Array.from({ length: 50 }, (_, j) => (i * 50 + j) % 7 === 0 ? 10 : 65)))', an: true },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'Do not rebuild the whole file with flat()/concat', vi: 'Không dựng lại cả file bằng flat()/concat' }, khop: '\\.flat\\(|\\.concat\\(|\\.\\.\\.chunks', phuDinh: true }],
});

/* ─── 4. tách dòng xuyên chunk ─── */
function createLineSplitter() {
  let rest = '';   // the start of a line whose "\n" has not arrived yet
  const clean = (line) => (line.endsWith('\r') ? line.slice(0, -1) : line);   // Windows "\r\n" endings
  return {
    push(text) {
      const parts = (rest + text).split('\n');
      rest = parts.pop();            // the last piece has no "\n" yet — keep it
      return parts.map(clean);
    },
    end() {
      const last = rest;
      rest = '';
      return last === '' ? [] : [clean(last)];   // a file may end without a final newline
    },
  };
}
const E4 = nodeBai({
  ten: '3.3 · Split lines that cross chunk boundaries (readline by hand)', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson reads <code>big.log</code> line by line with <code>readline.createInterface({ input, crlfDelay: Infinity })</code>. Chunks do not respect lines: <code>"ERR"</code> can arrive in one chunk and <code>"OR db down\\n"</code> in the next. Write <code>createLineSplitter()</code> → <code>{ push(text), end() }</code>:</p>
<ul><li><code>push(text)</code> returns the array of lines <b>completed</b> by this chunk (a line ends at <code>"\\n"</code>; a <code>"\\r"</code> right before it is removed, for Windows <code>\\r\\n</code> files);</li><li>an unfinished line is kept for the next push;</li><li><code>end()</code> returns the last line if the file did not end with a newline (<code>[]</code> otherwise).</li></ul>`,
  vi: `<p>Bài đọc <code>big.log</code> từng dòng bằng <code>readline.createInterface({ input, crlfDelay: Infinity })</code>. Chunk không tôn trọng dòng: <code>"ERR"</code> có thể tới trong một chunk và <code>"OR db down\\n"</code> ở chunk sau. Viết <code>createLineSplitter()</code> → <code>{ push(text), end() }</code>:</p>
<ul><li><code>push(text)</code> trả về mảng các dòng <b>hoàn tất</b> nhờ chunk này (dòng kết thúc ở <code>"\\n"</code>; <code>"\\r"</code> ngay trước nó bị bỏ, cho file Windows <code>\\r\\n</code>);</li><li>dòng chưa xong được giữ cho lần push sau;</li><li><code>end()</code> trả dòng cuối nếu file không kết thúc bằng xuống dòng (ngược lại <code>[]</code>).</li></ul>`,
  dauVao: ['text chunks (no lone "\\r" except before "\\n")', 'các chunk chữ (không có "\\r" lẻ ngoài trước "\\n")'], dauRa: ['arrays of lines, without line endings', 'mảng các dòng, không kèm ký tự xuống dòng'],
  goiY: [['(rest + text).split("\\n"): every piece except the last is a complete line.', '(rest + text).split("\\n"): mọi mảnh trừ mảnh cuối là một dòng đã xong.'], ['The last piece becomes the new rest — even when it is "".', 'Mảnh cuối trở thành rest mới — kể cả khi nó là "".'], ['Strip "\\r" per line AFTER splitting: a chunk can end between "\\r" and "\\n".', 'Bỏ "\\r" theo từng dòng SAU khi tách: chunk có thể kết thúc giữa "\\r" và "\\n".']],
  loi: [['text.split("\\n") per chunk: "ERR" and "OR db down" become two broken lines.', 'text.split("\\n") cho từng chunk: "ERR" và "OR db down" thành hai dòng gãy.'], ['Forgetting end(): the last line of a file without a final newline is lost.', 'Quên end(): dòng cuối của file không có xuống dòng cuối bị mất.'], ['Splitting on "\\r\\n" only: a chunk boundary between \\r and \\n breaks it.', 'Chỉ tách theo "\\r\\n": ranh giới chunk giữa \\r và \\n làm hỏng.']],
  gt: ['Same carry idea as the StringDecoder of lesson 3.2, one level up: there the unit was a character, here it is a line. Every case was compared with Node’s <code>readline</code> (crlfDelay: Infinity) on the same chunks.', 'Cùng ý tưởng “nhớ sang” như StringDecoder ở bài 3.2, lên một tầng: ở đó đơn vị là ký tự, ở đây là dòng. Mọi ca đã được so với <code>readline</code> của Node (crlfDelay: Infinity) trên cùng các chunk.'],
  kn: ['streams', 'readline'], tns: [tn('line ending', 'ký tự kết thúc dòng', '"\\n" (Unix) or "\\r\\n" (Windows)'), tn('carry', 'phần nhớ sang')],
  dau: `/** readline by hand: lines may cross chunk boundaries */
function createLineSplitter() {
  // Write your solution here — this splits every chunk on its own
  return {
    push(text) { return text.split('\\n').filter((l) => l !== ''); },
    end() { return []; },
  };
}
`,
  giai: '// Reference solution — keep the unfinished line between chunks\n' + nguon(createLineSplitter),
  cases: [
    { goi: '(() => { const s = createLineSplitter(); return [s.push("GET /a 200\\nERR"), s.push("OR db down\\nGET /b 200\\n"), s.end()]; })()', moTa: ['"ERROR" split across two chunks', '"ERROR" bị cắt qua hai chunk'] },
    { goi: '(() => { const s = createLineSplitter(); return [s.push("a\\r\\nb\\r\\n"), s.end()]; })()', moTa: ['Windows line endings', 'Kết thúc dòng kiểu Windows'] },
    { goi: '(() => { const s = createLineSplitter(); return [s.push("no newline at the end"), s.end()]; })()', moTa: ['Last line without "\\n"', 'Dòng cuối không có "\\n"'] },
    { goi: '(() => { const s = createLineSplitter(); return [s.push("x\\r"), s.push("\\ny\\n\\n"), s.push(""), s.end()]; })()', an: true },
    { goi: '(() => { const s = createLineSplitter(); return [s.push("a"), s.push("b"), s.push("c\\nd"), s.end(), s.push("e\\n")]; })()', an: true },
    { goi: '(() => { const s = createLineSplitter(); const out = []; const text = "line1\\nERROR one\\nline3\\nERROR two\\n"; for (let i = 0; i < text.length; i += 3) out.push(...s.push(text.slice(i, i + 3))); return out.concat(s.end()); })()', an: true },
  ],
});

/* ─── 5. transform bằng async generator ─── */
async function* grepErrors(lines) {
  let n = 0;
  // pull ONE line at a time and hand matches on immediately — nothing is collected
  for await (const line of lines) {
    n++;
    if (line.includes('ERROR')) yield `${n}: ${line}`;
  }
}
const SOURCE = `function source(lines, read) { return (async function* () { for (const l of lines) { await new Promise((r) => setTimeout(r, 1)); read.count++; yield l; } })(); }
async function collect(it, max) { const out = []; for await (const x of it) { out.push(x); if (out.length === max) break; } return out; }`;
const E5 = nodeBai({
  ten: '3.3 · A transform stage for pipeline(): grep ERROR lines', kho: 'MEDIUM', phut: 15,
  en: `<p><code>pipeline()</code> accepts an <b>async generator function</b> as a transform stage:</p><pre>await pipeline(lineStream, async function* (lines) { … yield … }, output);</pre><p>Write <code>async function* grepErrors(lines)</code>: read the async iterable <code>lines</code> one by one, count them from 1, and <code>yield</code> <code>"&lt;n&gt;: &lt;line&gt;"</code> for every line that contains <code>ERROR</code> — exactly the lesson’s <code>if (line.includes('ERROR'))</code> filter, plus the line number.</p><p>It must <b>stream</b>: when the consumer stops after the first two matches, the source must not have been read to the end. A hidden test checks how many lines you pulled.</p>`,
  vi: `<p><code>pipeline()</code> nhận một <b>hàm async generator</b> làm một chặng transform:</p><pre>await pipeline(lineStream, async function* (lines) { … yield … }, output);</pre><p>Viết <code>async function* grepErrors(lines)</code>: đọc async iterable <code>lines</code> từng dòng, đếm từ 1, và <code>yield</code> <code>"&lt;n&gt;: &lt;dòng&gt;"</code> cho mọi dòng chứa <code>ERROR</code> — đúng bộ lọc <code>if (line.includes('ERROR'))</code> của bài, thêm số dòng.</p><p>Nó phải <b>chảy</b>: khi bên tiêu thụ dừng sau hai dòng khớp đầu tiên, nguồn không được bị đọc tới cuối. Một kiểm ẩn đếm bạn đã kéo bao nhiêu dòng.</p>`,
  dauVao: ['lines — an async iterable of strings', 'lines — async iterable các chuỗi'], dauRa: ['an async iterable of "n: line" strings', 'async iterable các chuỗi "n: dòng"'],
  yc: [['Use for await…of and yield; do not build an array of all lines.', 'Dùng for await…of và yield; không dựng mảng chứa mọi dòng.'], ['Line numbers count every line, not only the matching ones.', 'Số dòng đếm mọi dòng, không chỉ dòng khớp.']],
  goiY: [['async function* lets you both await (for await…of) and yield.', 'async function* cho phép vừa await (for await…of) vừa yield.'], ['Yield inside the loop, right when you find a match.', 'Yield ngay trong vòng lặp, lúc vừa tìm thấy dòng khớp.'], ['When the consumer breaks, the generator is closed at its current yield — and so is the for await over the source.', 'Khi bên tiêu thụ break, generator bị đóng ngay tại yield hiện tại — và vòng for await trên nguồn cũng vậy.']],
  loi: [['Collecting all lines first and filtering afterwards: right output, but the whole file sits in memory and a consumer that stops early still waited for everything.', 'Gom mọi dòng trước rồi mới lọc: đúng kết quả, nhưng cả file nằm trong RAM và bên tiêu thụ dừng sớm vẫn phải chờ hết.'], ['Counting only matching lines, so the numbers do not point to the real line in the log.', 'Chỉ đếm dòng khớp, nên số không trỏ đúng dòng thật trong log.']],
  gt: ['A generator is pull-based: nothing runs until the consumer asks for the next value. That is backpressure for free — exactly why pipeline() accepts generators. In the hidden test the consumer stops after 2 matches on a 1000-line source; the reference pulls 6 lines, a collect-everything version pulls 1000.', 'Generator chạy theo kiểu kéo: không gì chạy cho tới khi bên tiêu thụ xin giá trị kế tiếp. Đó là backpressure miễn phí — chính vì thế pipeline() nhận generator. Ở kiểm ẩn bên tiêu thụ dừng sau 2 dòng khớp trên nguồn 1000 dòng; lời giải kéo 6 dòng, bản gom hết kéo 1000.'],
  kn: ['streams', 'async iterators'], tns: [tn('async generator', 'hàm sinh bất đồng bộ', 'async function* — can await and yield'), tn('pull-based', 'kéo theo nhu cầu')],
  chung: SOURCE,
  dau: `/** transform stage: yield "n: line" for every line containing ERROR */
async function* grepErrors(lines) {
  // Write your solution here — this version collects everything first
  const all = [];
  for await (const line of lines) all.push(line);
  for (let i = 0; i < all.length; i++) if (all[i].includes('ERROR')) yield (i + 1) + ': ' + all[i];
}
`,
  giai: '// Reference solution — one line in, maybe one line out, nothing stored\n' + nguon(grepErrors),
  cases: [
    { chuanBi: 'const read = { count: 0 };', goi: 'await collect(grepErrors(source(["GET /a 200", "ERROR db down", "GET /b 200", "ERROR timeout"], read)))', moTa: ['Two matches with their line numbers', 'Hai dòng khớp kèm số dòng'] },
    { chuanBi: 'const read = { count: 0 };', goi: 'await collect(grepErrors(source(["all good", "still good"], read)))', moTa: ['No match', 'Không có dòng khớp'] },
    { chuanBi: 'const read = { count: 0 };', goi: 'Object.prototype.toString.call(grepErrors(source([], read)))', moTa: ['It is an async generator', 'Nó là một async generator'] },
    { chuanBi: 'const read = { count: 0 }; const lines = Array.from({ length: 1000 }, (_, i) => (i === 2 || i === 5 || i === 900) ? "ERROR #" + i : "ok " + i);', goi: '({ got: await collect(grepErrors(source(lines, read)), 2), linesPulled: read.count })', moTa: ['Stops pulling when the consumer stops', 'Ngừng kéo khi bên tiêu thụ dừng'], an: true },
    { chuanBi: 'const read = { count: 0 };', goi: 'await collect(grepErrors(source(["ERROR first", "x", "an ERROR in the middle", "error lowercase"], read)))', an: true },
  ],
});

/* ─── 6. backpressure bằng tay ─── */
async function writeAll(chunks, dest) {
  for (const chunk of chunks) {
    // write() returning false means "my buffer is full" — wait for 'drain' before the next chunk
    if (!dest.write(chunk)) await new Promise((resolve) => dest.once('drain', resolve));
  }
  // end() flushes what is left; 'finish' means every byte reached the destination
  await new Promise((resolve) => { dest.once('finish', resolve); dest.end(); });
}
const DEST = `${FAKE_EMITTER}
function mkDest(hwm, msPerChunk) { var d = __em({ buffered: 0, maxBuffered: 0, received: [], endCalls: 0, writesAfterEnd: 0 }); var needDrain = false, timer = null, ended = false;
function pump() { if (timer !== null) return; timer = setTimeout(function () { timer = null; if (d.buffered > 0) d.buffered--; if (d.buffered === 0) { if (needDrain) { needDrain = false; d.emit('drain'); } if (ended) { ended = 'done'; d.emit('finish'); return; } } if (d.buffered > 0) pump(); }, msPerChunk); }
d.write = function (c) { if (ended) { d.writesAfterEnd++; return false; } d.buffered++; d.received.push(c); if (d.buffered > d.maxBuffered) d.maxBuffered = d.buffered; pump(); var ok = d.buffered < hwm; if (!ok) needDrain = true; return ok; };
d.end = function () { d.endCalls++; ended = true; if (d.buffered === 0) setTimeout(function () { d.emit('finish'); }, 0); };
return d; }
function report(d) { return { received: d.received, maxBuffered: d.maxBuffered, endCalls: d.endCalls, writesAfterEnd: d.writesAfterEnd, stillBuffered: d.buffered }; }`;
const E6 = nodeBai({
  ten: '3.3 · Respect backpressure in your own write loop', kho: 'HARD', phut: 25,
  en: `<p>The lesson’s warning: <i>you lose backpressure the moment you write your own loop that ignores the return value of write()</i>. Write <code>async writeAll(chunks, dest)</code> that writes every chunk to a writable <code>dest</code>, in order, and resolves when everything has been delivered:</p>
<ul><li><code>dest.write(chunk)</code> returns <code>false</code> when its buffer is full → wait for the <code>'drain'</code> event (<code>dest.once('drain', fn)</code>) before writing the next chunk;</li><li>when it returns <code>true</code>, keep going — do not wait for a drain that will never come;</li><li>after the last chunk call <code>dest.end()</code> once and resolve on the <code>'finish'</code> event.</li></ul><p>The fake destination consumes one chunk every few ms (virtual clock) and records its peak buffer: it must never go above its <code>highWaterMark</code>.</p>`,
  vi: `<p>Cảnh báo của bài: <i>bạn mất backpressure ngay khi tự viết vòng lặp phớt lờ giá trị trả về của write()</i>. Viết <code>async writeAll(chunks, dest)</code> ghi mọi chunk vào writable <code>dest</code>, đúng thứ tự, và resolve khi mọi thứ đã tới nơi:</p>
<ul><li><code>dest.write(chunk)</code> trả <code>false</code> khi bộ đệm đầy → chờ sự kiện <code>'drain'</code> (<code>dest.once('drain', fn)</code>) rồi mới ghi chunk kế;</li><li>khi nó trả <code>true</code>, cứ ghi tiếp — đừng chờ một drain sẽ không bao giờ tới;</li><li>sau chunk cuối gọi <code>dest.end()</code> một lần và resolve ở sự kiện <code>'finish'</code>.</li></ul><p>Đích giả tiêu thụ một chunk mỗi vài ms (đồng hồ ảo) và ghi lại đỉnh bộ đệm: nó không bao giờ được vượt <code>highWaterMark</code>.</p>`,
  dauVao: ['chunks — array; dest — { write, end, once, on }', 'chunks — mảng; dest — { write, end, once, on }'], dauRa: ['a Promise that resolves after "finish"', 'một Promise resolve sau "finish"'],
  yc: [['Check the return value of every write().', 'Kiểm giá trị trả về của mọi lần write().'], ['Call dest.end() exactly once, after the last write.', 'Gọi dest.end() đúng một lần, sau lần write cuối.']],
  goiY: [['Turn the event into something you can await: await new Promise((r) => dest.once("drain", r)).', 'Biến sự kiện thành thứ await được: await new Promise((r) => dest.once("drain", r)).'], ['Only wait when write() said false.', 'Chỉ chờ khi write() nói false.'], ['Register the "finish" listener before calling end(), so you cannot miss it.', 'Đăng ký listener "finish" trước khi gọi end(), để không thể lỡ nó.']],
  loi: [['for (const c of chunks) dest.write(c) — the buffer grows to the size of the whole input.', 'for (const c of chunks) dest.write(c) — bộ đệm phình tới cỡ toàn bộ đầu vào.'], ['Waiting for "drain" after EVERY write: when write() returned true no drain is coming, and the promise never settles.', 'Chờ "drain" sau MỌI lần write: khi write() trả true thì không có drain nào tới, và promise không bao giờ xong.'], ['Resolving right after end(): the data is not delivered yet — wait for "finish".', 'Resolve ngay sau end(): dữ liệu chưa tới nơi — chờ "finish".']],
  gt: ['This is what <code>pipeline()</code> does internally. With highWaterMark 3 the reference never buffers more than 3 chunks however many you send; the loop that ignores false buffers all 12. The rule is general: any time a producer is faster than a consumer, the consumer must be able to say “stop”, and the producer must listen.', 'Đây là việc <code>pipeline()</code> làm bên trong. Với highWaterMark 3, lời giải không bao giờ đệm quá 3 chunk dù gửi bao nhiêu; vòng lặp phớt lờ false đệm cả 12. Luật này chung: bất cứ khi nào bên sản xuất nhanh hơn bên tiêu thụ, bên tiêu thụ phải nói được “dừng”, và bên sản xuất phải nghe.'],
  kn: ['streams', 'backpressure', 'events'], tns: [tn('writable', 'stream ghi'), tn('finish', 'sự kiện “đã ghi xong”'), tn('producer / consumer', 'bên sản xuất / bên tiêu thụ')],
  chung: DEST,
  dau: `/** write every chunk to dest without letting its buffer grow past its highWaterMark */
async function writeAll(chunks, dest) {
  // Write your solution here — this ignores what write() returns
  for (const chunk of chunks) dest.write(chunk);
  dest.end();
}
`,
  giai: '// Reference solution — wait for "drain" whenever write() says false\n' + nguon(writeAll),
  cases: [
    { chuanBi: 'const d = mkDest(3, 5); const chunks = Array.from({ length: 12 }, (_, i) => "chunk" + i);', goi: '(await writeAll(chunks, d), report(d))', moTa: ['12 chunks into a buffer of 3', '12 chunk vào bộ đệm 3'] },
    { chuanBi: 'const d = mkDest(100, 1);', goi: '(await writeAll(["a", "b", "c"], d), report(d))', moTa: ['A big buffer: write() never says false', 'Bộ đệm lớn: write() không bao giờ nói false'] },
    { chuanBi: 'const d = mkDest(2, 3);', goi: '(await writeAll([], d), report(d))', moTa: ['Nothing to write: still end() once', 'Không có gì để ghi: vẫn end() một lần'], an: true },
    { chuanBi: 'const d = mkDest(1, 2); const chunks = Array.from({ length: 30 }, (_, i) => i);', goi: '(await writeAll(chunks, d), report(d))', an: true },
    { chuanBi: 'const d = mkDest(4, 10); let done = false; writeAll(["x", "y", "z"], d).then(() => { done = true; });', goi: '(await new Promise((r) => setTimeout(r, 5)), { doneTooEarly: done, stillBuffered: d.buffered })', moTa: ['Does not resolve before the data is delivered', 'Không resolve trước khi dữ liệu tới nơi'], an: true },
  ],
});

export default doiDau({ slug: 'nodejs-3-3-stream', ten: '3.3 Streams: the 348 MB experiment', khoa: KHOA, baiHoc: 'nodejs-3-3-stream', de: [E1, E2, E3, E4, E5, E6] });
