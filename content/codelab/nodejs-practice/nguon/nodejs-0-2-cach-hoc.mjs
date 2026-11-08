// Node.js 0.2 — How to study this course. Thông báo lỗi trong đề là output thật của Node 22.23.3 (n02/kiem-node/err: TypeError
// không bắt; EADDRINUSE khi listen trùng cổng; fetch tới cổng đóng ⇒ "fetch failed", cause.code ECONNREFUSED).
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('five-step loop', 'vòng năm bước', 'Read, retype, break, explain, practise — the cycle for every lesson.'),
  tn('break it deliberately', 'cố ý làm hỏng', 'Remove a line and watch what dies — in a scratch project only.'),
  tn('stack trace', 'dấu vết ngăn xếp', 'The "at fn (file:line:column)" lines under an error: where it happened, newest call first.'),
  tn('the explain test', 'phép thử giải thích', 'If you cannot explain it out loud with no notes, you only recognised it.'),
  tn('scratch project', 'dự án nháp', 'A throwaway project where breaking things is safe.'),
];

const LOI = `/app/src/services/notes.js:12
    return note.title;
                ^

TypeError: Cannot read properties of undefined (reading 'title')
    at getTitle (/app/src/services/notes.js:12:17)
    at listTitles (/app/src/routes/notes.js:8:20)
    at Layer.handle (/app/node_modules/express/lib/router/layer.js:95:5)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)

Node.js v22.23.3`;

export default modul('nodejs-0-2-cach-hoc', '0.2 How to study this course', [
  cs({
    ten: 'The five-step loop, in order',
    kho: 'EASY', phut: 3, loai: 'order',
    en: '"Reading code feels like learning. It is not." Put the five steps the lesson asks for, for every lesson, in order.',
    vi: '"Đọc code có cảm giác như học. Không phải vậy." Sắp năm bước bài học yêu cầu cho mỗi bài theo đúng thứ tự.',
    cau: [
      ord('l1', ['Order the loop.', 'Sắp vòng lặp.'], [
        'Read once — the whole lesson, no typing, just build the map',
        'Retype every example by hand — never copy-paste',
        'Break it — change a value, delete an await, watch the error',
        'Explain it out loud, no notes, as if teaching',
        'Practise — solve the matching Code Lab exercises',
      ], ['You need the map before typing, the typed code before you can break it, the errors before you can explain what each line does — and only then do the drills stick.', 'Cần bản đồ trước khi gõ, cần code đã gõ mới làm hỏng được, cần thấy lỗi mới giải thích được từng dòng — và chỉ khi đó bài luyện mới vào đầu.']),
    ],
    goiY: [['You cannot break code you have not typed yet.', 'Không thể làm hỏng code chưa gõ.'], ['Practice comes last — you are doing it right now.', 'Luyện tập đến cuối — bạn đang làm nó đây.']],
    loi: [['Skipping "break it" because breaking working code feels like a waste of time.', 'Bỏ bước "làm hỏng" vì thấy phá code đang chạy là phí thời gian.'], ['Copy-pasting the examples — you lose the typos that teach you to read errors.', 'Copy-paste ví dụ — mất luôn những lỗi gõ dạy bạn đọc thông báo lỗi.']],
    tns: TN,
  }),

  cs({
    ten: 'Which rule would have saved you?',
    kho: 'EASY', phut: 5, loai: 'table',
    en: 'The lesson\'s "Rules that save months". For each situation, choose the rule that was broken.',
    vi: '"Những luật tiết kiệm hàng tháng" của bài. Với mỗi tình huống, chọn luật đã bị phá.',
    bang: [bang1('r1', ['Which rule?', 'Luật nào?'],
      [{ ma: 'tinh', ten: 'Situation|||Tình huống' }, { ma: 'luat', ten: 'Rule|||Luật', luaChon: ['Read the error, all of it', 'One change at a time', 'Reproduce before you fix', 'Official docs first', 'Commit small and often'] }],
      [
        { o: { tinh: 'You changed the port AND the database URL; it still fails and you do not know which change broke it' }, a: { luat: 'One change at a time' } },
        { o: { tinh: 'You googled "node crash" for 20 minutes; line 1 of the error already said EADDRINUSE and line 3 said index.js:14' }, a: { luat: 'Read the error, all of it' } },
        { o: { tinh: 'You "fixed" a bug you could never trigger yourself, and it came back next week' }, a: { luat: 'Reproduce before you fix' } },
        { o: { tinh: 'A 2019 blog post told you to use a flag Node 22 removed long ago' }, a: { luat: 'Official docs first' } },
        { o: { tinh: 'Two hours of edits, it broke, and there is no working version to go back to' }, a: { luat: 'Commit small and often' } },
      ],
      ['Each rule removes one way of losing hours: errors usually contain the answer and the location; one change at a time keeps cause and effect connected; a bug you cannot trigger cannot be proven fixed; nodejs.org and expressjs.com are more current than any blog; and a recent commit is a safe place to return to.', 'Mỗi luật loại một cách mất hàng giờ: thông báo lỗi thường có sẵn đáp án và vị trí; mỗi lần một thay đổi giữ nguyên nhân – kết quả gắn với nhau; bug không tái hiện được thì không chứng minh được đã sửa; nodejs.org và expressjs.com mới hơn mọi blog; một commit gần đây là chỗ an toàn để quay về.'])],
    goiY: [['Match the pain (confusion, wasted search, recurring bug, outdated advice, no way back) to the rule that prevents it.', 'Ghép nỗi đau (rối, tìm vô ích, bug quay lại, lời khuyên cũ, không đường lui) với luật ngăn nó.'], ['"The answer is usually on line 1 and the location on line 3."', '"Đáp án thường ở dòng 1 và vị trí ở dòng 3."']],
    loi: [['Changing several things at once "to save time".', 'Đổi nhiều thứ một lúc "cho nhanh".'], ['Trusting the first search result over the official docs.', 'Tin kết quả tìm kiếm đầu tiên hơn tài liệu chính thức.']],
    tns: TN,
  }),

  cs({
    ten: 'Break it on purpose: which error will you see?',
    kho: 'MEDIUM', phut: 6,
    en: '"If you have never seen EADDRINUSE, ECONNREFUSED, or \'Cannot read properties of undefined\' on purpose, the first time will be at 11pm with production down." Each experiment below was run on Node 22. Predict what you get.',
    vi: '"Nếu chưa từng cố ý thấy EADDRINUSE, ECONNREFUSED hay \'Cannot read properties of undefined\', lần đầu sẽ là 11 giờ đêm khi production sập." Mỗi thí nghiệm dưới đây đã chạy trên Node 22. Đoán bạn sẽ nhận gì.',
    cau: [
      q('b1', ['You start the server twice on port 3000 (the first one is still running).', 'Bạn chạy server hai lần trên cổng 3000 (cái đầu vẫn đang chạy).'],
        ['Error: listen EADDRINUSE: address already in use :::3000', 'Error: connect ECONNREFUSED 127.0.0.1:3000', 'The second server silently shares the port', 'TypeError: Cannot read properties of undefined'],
        ['Only one process can listen on a port. EADDRINUSE = "address in use": find the old process (or change the port).', 'Chỉ một process được lắng nghe một cổng. EADDRINUSE = "địa chỉ đang dùng": tìm process cũ (hoặc đổi cổng).']),
      q('b2', ['The database is stopped and your code connects to it (or <code>fetch</code>es a port where nothing listens).', 'CSDL đã tắt mà code kết nối tới (hoặc fetch một cổng không ai nghe).'],
        ['ECONNREFUSED — nothing is listening at that address', 'EADDRINUSE', 'A 404 Not Found response', 'The request waits forever with no error'],
        ['The OS answers "refused" immediately when no process listens on that port. With fetch in Node 22 the message is "fetch failed" and <code>err.cause.code</code> is ECONNREFUSED — read the cause, not only the message.', 'Hệ điều hành trả "từ chối" ngay khi không process nào nghe cổng đó. Với fetch ở Node 22 thông báo là "fetch failed" và err.cause.code là ECONNREFUSED — đọc cả cause, không chỉ message.']),
      q('b3', ['You delete the <code>await</code> in <code>const note = await repo.findById(id); return note.title;</code>', 'Bạn xoá await trong const note = await repo.findById(id); return note.title;'],
        ['No crash: note is a pending Promise, so the function returns undefined — the silent kind of bug', 'SyntaxError: await is required before an async call — the file will not run', 'TypeError: Cannot read properties of undefined — note itself is undefined', 'It still works: Node waits automatically because findById is an async function'],
        ['A Promise is an object, so <code>note.title</code> is simply undefined. Lesson 1.4 calls this Mistake 1 — the "my API returns an empty object" bug.', 'Promise là một object nên note.title chỉ là undefined. Bài 1.4 gọi đây là Lỗi 1 — bug "API của tôi trả object rỗng".']),
      q('b4', ['A route passes <code>undefined</code> into <code>getTitle(note)</code>, which does <code>return note.title</code>.', 'Route truyền undefined vào getTitle(note), hàm làm return note.title.'],
        ['TypeError: Cannot read properties of undefined (reading \'title\')', 'ReferenceError: note is not defined (the parameter has no value)', 'No error — undefined is returned and the route sends an empty body', 'SyntaxError: Unexpected token "." (title cannot follow undefined)'],
        ['Reading a property of undefined throws a TypeError naming the property. The stack trace under it says which function and which file:line — the next exercise teaches you to read it.', 'Đọc thuộc tính của undefined ném TypeError có kèm tên thuộc tính. Dấu vết ngăn xếp bên dưới cho biết hàm nào, tệp:dòng nào — bài kế tiếp dạy bạn đọc nó.']),
    ],
    goiY: [['EADDRINUSE = someone already listens here. ECONNREFUSED = nobody listens there.', 'EADDRINUSE = đã có người nghe ở đây. ECONNREFUSED = không ai nghe ở đó.'], ['A missing await rarely crashes by itself — it produces wrong values.', 'Thiếu await hiếm khi tự làm sập — nó sinh giá trị sai.']],
    loi: [['Confusing EADDRINUSE (your own port is taken) with ECONNREFUSED (the other side is down).', 'Nhầm EADDRINUSE (cổng của mình bị chiếm) với ECONNREFUSED (bên kia đã tắt).'], ['Reading only "fetch failed" and missing the real cause.', 'Chỉ đọc "fetch failed" mà bỏ qua nguyên nhân thật.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Read the error, all of it: parse a Node crash report',
    kho: 'HARD', phut: 18,
    en: `<p>"Read the error, all of it. The answer is usually on line 1 and the location on line 3. Most beginners read neither." Write <code>readError(text)</code> that reads a crash printed by Node and returns what a careful reader would say:</p>${pre(LOI)}
<ul><li><code>type</code> and <code>message</code>: from the first line that looks like <code>Name: message</code>, where Name is <code>Error</code> or ends in <code>Error</code> (e.g. <code>TypeError</code>, <code>RangeError</code>). Node may add a code in brackets — <code>Error [ERR_MODULE_NOT_FOUND]: Cannot find module …</code> — then <code>code</code> is <code>'ERR_MODULE_NOT_FOUND'</code>, otherwise <code>null</code>.</li>
<li><code>where</code>: the first stack line <code>at fn (file:line:col)</code> whose file is <b>your</b> code — skip files containing <code>node_modules</code> and files starting with <code>node:</code>. Return <code>{ fn, file, line, column }</code> with numbers for line/column, or <code>null</code> if there is none. A frame without a function name looks like <code>at /app/x.js:3:9</code> — then <code>fn</code> is <code>null</code>.</li>
<li>No error line at all ⇒ return <code>null</code>.</li></ul>${pre("readError(text)\n// { type: 'TypeError', message: \"Cannot read properties of undefined (reading 'title')\", code: null,\n//   where: { fn: 'getTitle', file: '/app/src/services/notes.js', line: 12, column: 17 } }")}`,
    vi: `<p>"Đọc hết thông báo lỗi. Đáp án thường ở dòng 1, vị trí ở dòng 3." Viết readError(text) đọc báo cáo sập của Node: type/message từ dòng đầu dạng "Tên: thông điệp" (Tên là Error hoặc kết thúc bằng Error); nếu có mã trong ngoặc vuông thì code là mã đó, không thì null; where là dòng "at" đầu tiên thuộc code CỦA BẠN (bỏ node_modules và node:) dạng { fn, file, line, column } (fn null nếu khung không có tên hàm), hoặc null; không có dòng lỗi ⇒ trả null.</p>`,
    yc: [
      ['Return <code>{ type, message, code, where }</code> or <code>null</code>.', 'Trả { type, message, code, where } hoặc null.'],
      ['<code>where</code> is your own first frame (no node_modules, no node: internals); line/column are numbers.', 'where là khung đầu tiên của code bạn (không node_modules, không node:); line/column là số.'],
      ['Ignore the source preview at the top (<code>file:12</code>, the code line, the caret).', 'Bỏ qua phần xem trước mã ở đầu (file:12, dòng code, dấu ^).'],
    ],
    goiY: [
      ['Split into lines: <code>text.split(\'\\n\')</code>. Error line: <code>/^(\\w*Error)(?: \\[(\\w+)\\])?: (.*)$/</code>.', 'Tách dòng: text.split(\'\\n\'). Dòng lỗi: /^(\\w*Error)(?: \\[(\\w+)\\])?: (.*)$/.'],
      ['Frame with a name: <code>/^\\s*at (.+?) \\((.+):(\\d+):(\\d+)\\)$/</code>; without: <code>/^\\s*at (.+):(\\d+):(\\d+)$/</code>. Try the first, then the second.', 'Khung có tên: /^\\s*at (.+?) \\((.+):(\\d+):(\\d+)\\)$/; không tên: /^\\s*at (.+):(\\d+):(\\d+)$/. Thử cái đầu rồi cái sau.'],
      ['The file path is everything up to the LAST two <code>:number</code> parts — paths can contain colons (<code>file:///…</code>).', 'Đường dẫn tệp là mọi thứ trước HAI phần :số cuối — đường dẫn có thể chứa dấu hai chấm (file:///…).'],
    ],
    loi: [
      ['Taking the very first line as the error — that is the source preview (<code>/app/…/notes.js:12</code>), not the message.', 'Lấy dòng đầu tiên làm lỗi — đó là phần xem trước mã, không phải thông điệp.'],
      ['Blaming the first stack frame even when it is inside <code>node_modules/express</code> — the bug is almost always in the first frame of YOUR code.', 'Đổ lỗi cho khung đầu tiên dù nó nằm trong node_modules/express — bug gần như luôn ở khung đầu tiên của code BẠN.'],
      ['Returning line and column as strings.', 'Trả line và column dạng chuỗi.'],
    ],
    gt: ['A Node crash has three parts: a source preview with a caret, the <code>Name: message</code> line (what went wrong), and the stack (where, newest call first). Matching the error line by its shape skips the preview; scanning the frames and skipping <code>node_modules</code> and <code>node:</code> finds the place you can actually fix. The greedy <code>(.+)</code> before <code>:(\\d+):(\\d+)</code> keeps paths with colons intact. This is the habit the lesson asks for, written as code.',
      'Báo cáo sập của Node có ba phần: xem trước mã kèm dấu ^, dòng "Tên: thông điệp" (sai cái gì), và ngăn xếp (ở đâu, lời gọi mới nhất trước). Khớp dòng lỗi theo hình dạng giúp bỏ qua phần xem trước; duyệt các khung và bỏ node_modules, node: tìm ra chỗ bạn thật sự sửa được. (.+) tham lam trước :(\\d+):(\\d+) giữ nguyên đường dẫn có dấu hai chấm. Đây là thói quen bài học yêu cầu, viết thành code.'],
    kn: ['reading errors', 'stack traces', 'regular expressions'],
    tns: TN,
    viDu: [{ input: 'readError(<the crash above>)', output: '{"type":"TypeError","message":"Cannot read properties of undefined (reading \'title\')","code":null,"where":{"fn":"getTitle","file":"/app/src/services/notes.js","line":12,"column":17}}', explanation: 'Line 1 is a preview; the error line and the first own frame matter.|||Dòng 1 là phần xem trước; quan trọng là dòng lỗi và khung đầu tiên của bạn.' }],
    chung: `const CRASH = ${JSON.stringify(LOI)};`,
    dau: `function readError(text) {
  const lines = text.split('\\n');
  const [type, message] = lines[0].split(': ');
  const at = lines.find((l) => l.trim().startsWith('at '));
  return { type, message, code: null, where: at || null };
}
`,
    giai: `// Read a Node crash the way the lesson asks: WHAT went wrong, then WHERE in your code.
const ERROR_LINE = /^(\\w*Error)(?: \\[(\\w+)\\])?: (.*)$/;     // TypeError: … / Error [ERR_X]: …
const FRAME_NAMED = /^\\s*at (.+?) \\((.+):(\\d+):(\\d+)\\)$/;  // at fn (file:line:col)
const FRAME_BARE = /^\\s*at (.+):(\\d+):(\\d+)$/;               // at file:line:col

function readError(text) {
  const lines = text.split('\\n');
  const errLine = lines.find((l) => ERROR_LINE.test(l));      // skips the source preview + caret
  if (!errLine) return null;
  const [, type, code, message] = errLine.match(ERROR_LINE);

  let where = null;
  for (const l of lines) {
    let fn = null, file, line, column;
    const named = l.match(FRAME_NAMED);
    const bare = named ? null : l.match(FRAME_BARE);
    if (named) [, fn, file, line, column] = named;
    else if (bare) [, file, line, column] = bare;
    else continue;
    if (file.includes('node_modules') || file.startsWith('node:')) continue; // not your code
    where = { fn, file, line: Number(line), column: Number(column) };
    break;                                                    // the FIRST frame of your own code
  }
  return { type, message, code: code || null, where };
}
`,
    cases: [
      { moTa: ['the crash from the statement', 'báo cáo sập trong đề'], goi: 'readError(CRASH)' },
      { moTa: ['an error with a [CODE]', 'lỗi có [MÃ]'], goi: "readError(\"node:internal/modules/esm/resolve:265\\n    throw new ERR_MODULE_NOT_FOUND(\\n          ^\\n\\nError [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/src/math' imported from /app/src/index.js\\n    at finalizeResolution (node:internal/modules/esm/resolve:265:11)\\n    at moduleResolve (node:internal/modules/esm/resolve:933:10)\\n\\nNode.js v22.23.3\")" },
      { moTa: ['no error line ⇒ null', 'không có dòng lỗi ⇒ null'], goi: "readError('Server listening on 3000\\nGET /notes 200 4ms')" },
      { an: true, goi: "readError(\"RangeError: Invalid array length\\n    at new Array (<anonymous>)\\n    at /app/node_modules/lib/x.js:3:9\\n    at /app/src/jobs/report.js:41:5\\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\")" },
      { an: true, goi: "readError(\"Uncaught SyntaxError: x\\nSyntaxError: Unexpected token '}'\\n    at wrapSafe (node:internal/modules/cjs/loader:1469:18)\\n    at Object.<anonymous> (file:///C:/notes-api/src/a.js:7:2)\")" },
      { an: true, goi: "readError(\"Error: DB connection lost\\n    at node:internal/x:1:1\")" },
    ],
  }),
]);
