// Node.js 1.1 — Variables & scope: var, let, const. Đáp án hành vi đã chạy bằng Node 22.23.3 (scratchpad n02/kiem-node/a1.cjs).
import { modul, cs, jsBai, q, bang1, tn, pre, c } from './_node.mjs';

const TN = [
  tn('scope', 'phạm vi', 'The region of code where a name can be seen — nested boxes: file › function › block.'),
  tn('block scope', 'phạm vi khối', 'let/const live inside the nearest { } (if, for, plain block).'),
  tn('hoisting', 'kéo khai báo lên đầu', 'Declarations are registered before the code runs; var starts as undefined.'),
  tn('Temporal Dead Zone (TDZ)', 'vùng chết tạm thời', 'From the start of the block to the let/const line: touching the name throws ReferenceError.'),
  tn('binding', 'ràng buộc tên', 'The link between a name and a value. const locks the binding, not the object.'),
];

export default modul('nodejs-1-1-bien-pham-vi', '1.1 Variables & scope: var, let, const', [
  cs({
    ten: 'Predict it: var, let and const around a block',
    kho: 'EASY', phut: 6,
    en: 'Each question is a few lines from lesson 1.1. Decide what Node prints <b>before</b> you look at the options — then check by running it with <code>node file.js</code> (a CommonJS file).',
    vi: 'Mỗi câu là vài dòng giống bài 1.1. Tự đoán Node in gì <b>trước</b> khi xem phương án — rồi kiểm bằng <code>node file.js</code> (tệp CommonJS).',
    cau: [
      q('q1', [`Inside a function: ${pre("if (true) { var a = 1; let b = 2; const c = 3; }\nconsole.log(typeof a, typeof b, typeof c);")}`, 'Bên trong một hàm, dòng log in gì?'],
        ['number undefined undefined', 'number number number', 'undefined undefined undefined', 'ReferenceError: b is not defined'],
        ['var ignores the block and leaks to the whole function, so <code>a</code> is a number. <code>b</code> and <code>c</code> live only inside the braces; outside, <code>typeof</code> answers "undefined" safely instead of throwing.', 'var bỏ qua khối nên rò ra cả hàm ⇒ a là number. b và c chỉ sống trong cặp ngoặc; ra ngoài, typeof trả "undefined" một cách an toàn chứ không ném lỗi.']),
      q('q2', [`${pre("try { console.log(x); let x = 1; }\ncatch (e) { console.log(e.name); }")}`, 'Dùng biến let trước dòng khai báo.'],
        ['ReferenceError', 'undefined', '1', 'TypeError'],
        ['<code>x</code> is hoisted to the top of the block but stays in the Temporal Dead Zone until its line runs. Touching it throws <code>ReferenceError: Cannot access \'x\' before initialization</code> — a loud error at the exact wrong line.', 'x được kéo lên đầu khối nhưng nằm trong TDZ tới khi dòng khai báo chạy. Chạm vào ⇒ ReferenceError — lỗi to, đúng dòng sai.']),
      q('q3', [`${pre("console.log(typeof y);\nvar y = 5;")}`, 'Đọc biến var trước dòng khai báo.'],
        ['undefined', 'number', 'ReferenceError', '5'],
        ['var is hoisted <i>and</i> pre-initialised to <code>undefined</code>, so no error — the silent value that lets a bug travel far from its cause.', 'var được kéo lên VÀ gán sẵn undefined ⇒ không lỗi — giá trị câm khiến bug đi rất xa nguyên nhân.']),
      q('q4', [`${pre("const user = { name: 'An', tags: [] };\nuser.tags.push('work');\nconsole.log(JSON.stringify(user));")}`, 'push vào mảng nằm trong một object const.'],
        ['{"name":"An","tags":["work"]}', 'TypeError: Assignment to constant variable.', '{"name":"An","tags":[]}', 'SyntaxError'],
        ['const locks the <b>name</b> <code>user</code>, not the object it points at. Changing the content (push, property write) is allowed.', 'const khoá TÊN user, không khoá object nó trỏ tới. Sửa nội dung (push, gán thuộc tính) vẫn được.']),
      q('q5', [`${pre("const fr = Object.freeze({ name: 'An', address: { city: 'Hue' } });\nfr.name = 'B';\nfr.address.city = 'Hanoi';\nconsole.log(JSON.stringify(fr));")}`, 'Object.freeze rồi ghi vào tầng ngoài và tầng trong (tệp không strict).'],
        ['{"name":"An","address":{"city":"Hanoi"}}', '{"name":"B","address":{"city":"Hanoi"}}', '{"name":"An","address":{"city":"Hue"}}', 'TypeError: Cannot assign to read only property'],
        ['freeze is <b>shallow</b>: the write to <code>name</code> is silently ignored (non-strict file, no error), but the inner <code>address</code> object was never frozen, so <code>city</code> changes.', 'freeze chỉ đóng băng MỘT tầng: ghi name bị bỏ qua âm thầm (tệp không strict), nhưng object address bên trong chưa bị đóng băng nên city đổi.']),
    ],
    goiY: [
      ['Ask two things for every name: which box (block or function) owns it, and has its declaration line run yet?', 'Với mỗi tên hỏi hai điều: hộp nào (khối hay hàm) sở hữu nó, và dòng khai báo đã chạy chưa?'],
      ['const = the name cannot be repointed. Writing inside the object is a different operation.', 'const = tên không trỏ lại được. Ghi vào bên trong object là chuyện khác.'],
    ],
    loi: [
      ['Believing <code>const</code> means "cannot change" and being surprised that <code>push</code> works.', 'Tin rằng const nghĩa là "không đổi được" rồi ngạc nhiên khi push vẫn chạy.'],
      ['Expecting <code>undefined</code> from a let used early (that is var\'s behaviour) — let throws ReferenceError.', 'Tưởng let dùng sớm cho undefined (đó là kiểu của var) — let ném ReferenceError.'],
      ['Thinking Object.freeze protects nested objects too.', 'Nghĩ Object.freeze bảo vệ cả object lồng bên trong.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'The lesson puzzle: write the output, line by line',
    kho: 'EASY', phut: 6,
    en: `This is the end-of-lesson puzzle with new numbers. Synchronous lines run first; timer callbacks wait until the loops have finished.${pre("for (var i = 0; i < 2; i++) setTimeout(() => console.log('A', i), 0);\nfor (let j = 1; j < 3; j++) setTimeout(() => console.log('B', j), 0);\nconsole.log('C', i);\n{ let k = 9; }\nconsole.log('D', typeof k);")}`,
    vi: 'Câu đố cuối bài 1.1 với số mới. Dòng đồng bộ chạy trước; callback của hẹn giờ chờ tới khi các vòng lặp xong.',
    cau: [
      q('p1', ['Which is the complete output (Node 22, CommonJS file)?', 'Output đầy đủ là gì (Node 22, tệp CommonJS)?'],
        ['C 2 · D undefined · A 2 · A 2 · B 1 · B 2', 'A 0 · A 1 · B 1 · B 2 · C 2 · D undefined', 'C 2 · D undefined · A 0 · A 1 · B 1 · B 2', 'C 2 · ReferenceError: k is not defined'],
        ['Sync first: <code>C 2</code> (the shared <code>i</code> already ended at 2) and <code>D undefined</code> (<code>k</code> cannot leave its block; typeof does not throw). Then the timers in the order they were scheduled: both var callbacks read the one shared <code>i</code> = 2; the let loop made a new <code>j</code> per turn: 1, 2.', 'Đồng bộ trước: C 2 (biến i dùng chung đã dừng ở 2) và D undefined (k không ra khỏi khối; typeof không ném). Rồi tới hẹn giờ theo thứ tự đặt: hai callback var cùng đọc một i = 2; vòng let tạo j mới mỗi vòng: 1, 2.']),
      q('p2', ['How many separate variables named <code>j</code> exist while the timers wait?', 'Lúc các hẹn giờ đang chờ, có bao nhiêu biến j riêng biệt?'],
        ['Two — one per loop turn, each kept alive by its own callback', 'One, shared by both callbacks', 'Zero — j is destroyed when the loop ends', 'Three — including the final failed check j = 3'],
        ['let creates a fresh binding for each iteration and each callback closes over its own. The final value 3 is computed on a copy used only for the exit test; no callback holds it.', 'let tạo ràng buộc mới cho mỗi vòng, mỗi callback giữ cái của nó. Giá trị 3 cuối cùng chỉ dùng để kiểm điều kiện thoát; không callback nào giữ nó.']),
      q('p3', ['Change only the first loop to <code>for (let i = 0; i &lt; 2; i++)</code>. What happens to the line <code>console.log(\'C\', i)</code>?', 'Đổi vòng đầu thành let i. Dòng console.log(\'C\', i) ra sao?'],
        ['It throws ReferenceError: i is not defined — i no longer exists outside the loop', 'It prints C 2, same as before — let only changes what the timers see', 'It prints C undefined, because let is hoisted like var but left empty', 'It prints C 0, because let keeps the first value the loop gave to i'],
        ['With let, <code>i</code> belongs to the loop block. Reading a name that exists in no box throws ReferenceError (unlike <code>typeof</code>, which is safe). That is the price of the fix — and a good one: the stale value can no longer be read.', 'Với let, i thuộc khối vòng lặp. Đọc một tên không tồn tại ở hộp nào ⇒ ReferenceError (khác typeof, vốn an toàn). Đó là cái giá của bản sửa — và là cái giá tốt.']),
    ],
    goiY: [
      ['Split the program in two passes: everything synchronous, then the timer callbacks in scheduling order.', 'Tách hai lượt: mọi thứ đồng bộ, rồi các callback hẹn giờ theo thứ tự đặt.'],
      ['For each callback ask: which variable does it read, and what value does that variable hold when the callback finally runs?', 'Với mỗi callback hỏi: nó đọc biến nào, và biến đó giữ giá trị gì lúc callback thật sự chạy?'],
    ],
    loi: [
      ['Printing the timer lines first because they appear first in the code.', 'In dòng hẹn giờ trước vì chúng đứng trước trong code.'],
      ['Answering A 0, A 1 — reading the value at scheduling time instead of at run time.', 'Trả lời A 0, A 1 — đọc giá trị lúc đặt hẹn thay vì lúc chạy.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'Fix the silent bug: save every note, not the last one three times',
    kho: 'EASY', phut: 10,
    en: `<p>The Notes API needs <code>saveAll(ids, save)</code>: for every id it must schedule <code>save(id)</code> to run <b>later</b> (with <code>setTimeout(…, 0)</code> — a stand-in for a database write). The starter has the exact bug from the lesson slide: <code>var id</code> is ONE shared variable, so when the callbacks finally run they all see the last id.</p>${pre("saveAll([10, 20, 30], (id) => console.log('saved note', id));\n// starter prints: saved note 30 · saved note 30 · saved note 30   ← wrong, and nothing crashes\n// fixed prints  : saved note 10 · saved note 20 · saved note 30")}`,
    vi: `<p>Notes API cần <code>saveAll(ids, save)</code>: với mỗi id, lên lịch <code>save(id)</code> chạy <b>sau</b> (bằng <code>setTimeout(…, 0)</code> — thay cho một lần ghi CSDL). Code khởi đầu có đúng bug trong slide bài học: <code>var id</code> là MỘT biến dùng chung, nên khi các callback chạy, chúng đều thấy id cuối cùng.</p>`,
    yc: [
      ['Every id is saved exactly once, in the order of the array.', 'Mỗi id được lưu đúng một lần, theo thứ tự mảng.'],
      ['Keep the deferral: <code>save</code> must NOT run synchronously inside <code>saveAll</code> (use <code>setTimeout</code>).', 'Giữ việc hoãn: save KHÔNG được chạy đồng bộ ngay trong saveAll (dùng setTimeout).'],
      ['No <code>var</code> left in the file.', 'Không còn var nào trong tệp.'],
    ],
    goiY: [
      ['Change the declaration of the loop variable and of <code>id</code> — one word each.', 'Đổi khai báo của biến vòng lặp và của id — mỗi chỗ một từ.'],
      ['Even shorter: <code>for (const id of ids) setTimeout(() =&gt; save(id), 0);</code> — a fresh <code>id</code> per turn.', 'Ngắn hơn: for (const id of ids) setTimeout(() => save(id), 0); — mỗi vòng một id mới.'],
    ],
    loi: [
      ['Calling <code>save(id)</code> directly to "fix" it — the order looks right, but you removed the deferral the real code needs (and the test that checks nothing ran yet fails).', 'Gọi save(id) trực tiếp để "sửa" — thứ tự trông đúng nhưng bạn đã bỏ việc hoãn mà code thật cần (và kiểm "chưa chạy gì" trượt).'],
      ['Changing only <code>var i</code> to <code>let i</code> but keeping <code>var id</code> inside the loop — <code>id</code> is still shared, still 30, 30, 30.', 'Chỉ đổi var i thành let i nhưng giữ var id trong vòng — id vẫn dùng chung, vẫn 30, 30, 30.'],
    ],
    gt: ['A <code>var</code> declared inside a loop belongs to the whole function: there is one <code>id</code>, overwritten every turn, and the callbacks only read it after the loop is over. <code>let</code>/<code>const</code> in a <code>for</code> or <code>for…of</code> create a new binding per iteration, so each closure keeps its own value. The data was silently wrong before — no exception — which is why the lesson calls it the expensive kind of bug.',
      'var khai báo trong vòng lặp thuộc về cả hàm: chỉ có một id, bị ghi đè mỗi vòng, và callback chỉ đọc nó khi vòng lặp đã xong. let/const trong for / for…of tạo ràng buộc mới mỗi vòng nên mỗi closure giữ giá trị riêng. Trước đó dữ liệu sai âm thầm — không ngoại lệ — đó là loại bug đắt nhất mà bài học nói.'],
    kn: ['var vs let in loops', 'closures over loop variables', 'setTimeout'],
    tns: TN,
    viDu: [{ input: "saveAll([10, 20, 30], (id) => saved.push(id)); /* then wait for the timers */", output: '[10,20,30]', explanation: 'The starter gives [30,30,30].|||Code khởi đầu cho [30,30,30].' }],
    dau: `// Schedules save(id) for every id, to run later (stand-in for a DB write).
function saveAll(ids, save) {
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    setTimeout(() => save(id), 0);
  }
}
`,
    giai: `// Schedules save(id) for every id, to run later (stand-in for a DB write).
// for...of with const creates a NEW binding "id" on every turn, so each
// callback closes over its own id instead of one shared, overwritten variable.
function saveAll(ids, save) {
  for (const id of ids) {
    setTimeout(() => save(id), 0); // still deferred: runs after saveAll returns
  }
}
`,
    cases: [
      { moTa: ['saveAll([10, 20, 30]) saves 10, 20, 30', 'lưu 10, 20, 30'], chuanBi: 'const saved = []; saveAll([10, 20, 30], (id) => saved.push(id)); await new Promise((r) => setTimeout(r, 5));', goi: 'saved' },
      { moTa: ['save has not run yet when saveAll returns (still deferred)', 'save chưa chạy lúc saveAll trả về (vẫn hoãn)'], chuanBi: 'const saved = []; saveAll([1, 2], (id) => saved.push(id)); const now = saved.length; await new Promise((r) => setTimeout(r, 5));', goi: '[now, saved]' },
      { an: true, chuanBi: "const saved = []; saveAll(['n7', 'n8', 'n9', 'n10'], (id) => saved.push(id)); await new Promise((r) => setTimeout(r, 5));", goi: 'saved' },
      { an: true, chuanBi: 'const saved = []; saveAll([], (id) => saved.push(id)); await new Promise((r) => setTimeout(r, 5));', goi: 'saved' },
    ],
    kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'No var declarations left', vi: 'Không còn khai báo var' }, khop: '\\bvar\\b', phuDinh: true }],
  }),

  cs({
    ten: 'const or let? Pick the declaration a reviewer expects',
    kho: 'MEDIUM', phut: 6, loai: 'table',
    en: 'The lesson rule, in order: <b>const</b> by default; <b>let</b> only when the name is reassigned; <b>var</b> never. For each line from a Notes API service, choose the keyword that rule gives. Remember: changing the <i>inside</i> of an object or array is not reassigning the name.',
    vi: 'Luật của bài, theo thứ tự: mặc định <b>const</b>; <b>let</b> chỉ khi tên bị gán lại; <b>var</b> không bao giờ. Với mỗi dòng trong service của Notes API, chọn từ khoá mà luật đó cho. Nhớ: sửa BÊN TRONG object/mảng không phải là gán lại tên.',
    bang: [bang1('t1', ['Choose the declaration for each variable.', 'Chọn khai báo cho từng biến.'],
      [{ ma: 'tinh', ten: 'Variable and how it is used|||Biến và cách dùng' }, { ma: 'kw', ten: 'Keyword|||Từ khoá', luaChon: ['const', 'let', 'var'] }],
      [
        { o: { tinh: 'notes = [] — later only notes.push(note) is called' }, a: { kw: 'const' } },
        { o: { tinh: 'total = 0 — then total += note.words inside a loop' }, a: { kw: 'let' } },
        { o: { tinh: 'note = await repo.findById(id) — never assigned again' }, a: { kw: 'const' } },
        { o: { tinh: 'status — assigned "draft" in the if branch and "published" in the else branch' }, a: { kw: 'let' } },
        { o: { tinh: 'user = { name: "An" } — later user.name = "Binh"' }, a: { kw: 'const' } },
        { o: { tinh: 'attempts — starts at 0, retry loop does attempts++' }, a: { kw: 'let' } },
        { o: { tinh: 'config = Object.freeze({ limit: 20 }) — only read afterwards' }, a: { kw: 'const' } },
      ],
      ['Only rows where the <b>name itself</b> receives a new value (<code>+=</code>, <code>++</code>, assignment in two branches) need <code>let</code>. <code>push</code> and <code>user.name = …</code> change the object, not the binding, so <code>const</code> is right — and it tells the next reader "this name never moves". <code>var</code> is never the answer in new code.', 'Chỉ những hàng mà CHÍNH TÊN nhận giá trị mới (+=, ++, gán ở hai nhánh) mới cần let. push và user.name = … sửa object chứ không sửa ràng buộc ⇒ const đúng — và nó báo người đọc sau "tên này không bao giờ đổi". var không bao giờ là đáp án trong code mới.'])],
    goiY: [
      ['Look for an <code>=</code>, <code>+=</code> or <code>++</code> whose LEFT side is the bare name.', 'Tìm =, += hoặc ++ mà vế TRÁI là đúng cái tên trần.'],
      ['A dot or a method call (<code>notes.push</code>, <code>user.name =</code>) means you are editing the object — const still fits.', 'Có dấu chấm hoặc gọi phương thức (notes.push, user.name =) nghĩa là đang sửa object — const vẫn hợp.'],
    ],
    loi: [
      ['Choosing let for an array that only gets push calls.', 'Chọn let cho một mảng chỉ bị push.'],
      ['Using let "just in case" — it removes the guarantee the reader gets for free from const.', 'Dùng let "cho chắc" — làm mất bảo đảm mà const cho người đọc miễn phí.'],
    ],
    tns: TN,
  }),

  jsBai({
    ten: 'deepFreeze: lock a config object for real',
    kho: 'HARD', phut: 18,
    en: `<p>The lesson showed that <code>Object.freeze</code> is shallow: <code>{"name":"An","address":{"city":"Hue"}}</code> still lets <code>address.city</code> change. Write <code>deepFreeze(obj)</code> so a config object (nested objects and arrays) is frozen at <b>every</b> level.</p>${pre("const cfg = deepFreeze({ db: { host: 'localhost', ports: [5432] }, name: 'notes' });\ncfg.db.host = 'evil';        // ignored\ncfg.db.ports.push(1);        // TypeError: Cannot add property 1, object is not extensible\nObject.isFrozen(cfg.db);     // true")}`,
    vi: `<p>Bài học cho thấy Object.freeze chỉ một tầng. Viết <code>deepFreeze(obj)</code> để object cấu hình (lồng object và mảng) bị đóng băng ở MỌI tầng.</p>`,
    yc: [
      ['Return the same object you received (not a copy).', 'Trả về đúng object nhận vào (không sao chép).'],
      ['Freeze every nested object and array, at any depth.', 'Đóng băng mọi object và mảng lồng nhau, ở mọi độ sâu.'],
      ['Primitives (numbers, strings, null) are left alone — <code>deepFreeze(5)</code> returns 5.', 'Giá trị nguyên thuỷ để nguyên — deepFreeze(5) trả 5.'],
      ['Must not loop forever on an object that refers to itself (<code>cfg.self = cfg</code>).', 'Không được lặp vô hạn với object tự trỏ vào chính nó (cfg.self = cfg).'],
    ],
    goiY: [
      ['Recursion: freeze <code>obj</code>, then call <code>deepFreeze</code> on every value from <code>Object.values(obj)</code> that is an object.', 'Đệ quy: freeze obj, rồi gọi deepFreeze cho mọi giá trị trong Object.values(obj) là object.'],
      ['Arrays are objects too, so the same code handles them. <code>typeof null === \'object\'</code> — check for null first.', 'Mảng cũng là object nên cùng một code xử lý được. typeof null === \'object\' — kiểm null trước.'],
      ['For the self-reference: if a value is already frozen, skip it — and freeze the parent BEFORE visiting its children.', 'Với tự trỏ: giá trị đã bị đóng băng thì bỏ qua — và freeze cha TRƯỚC khi đi vào con.'],
    ],
    loi: [
      ['Returning <code>Object.freeze(obj)</code> only — exactly the shallow behaviour the lesson warned about.', 'Chỉ trả Object.freeze(obj) — đúng kiểu một tầng mà bài học cảnh báo.'],
      ['Forgetting <code>null</code>: <code>typeof null</code> is "object", and <code>Object.values(null)</code> throws TypeError.', 'Quên null: typeof null là "object", và Object.values(null) ném TypeError.'],
      ['Freezing children first and the parent last — a self-reference then recurses until "Maximum call stack size exceeded".', 'Freeze con trước, cha sau — gặp tự trỏ là đệ quy tới "Maximum call stack size exceeded".'],
    ],
    gt: ['Freeze is per object, so a deep freeze has to visit every object reachable from the root. Freezing the current object first and skipping values that are already frozen does two jobs: it avoids work on shared sub-objects and it ends the recursion on cycles (the second visit finds a frozen object). Writes to a frozen object are silently ignored in sloppy code and throw in strict code — <code>push</code> on a frozen array always throws because it must add a property.',
      'freeze tác dụng trên từng object, nên đóng băng sâu phải đi qua mọi object với tới được từ gốc. Freeze object hiện tại TRƯỚC và bỏ qua giá trị đã bị đóng băng làm hai việc: tránh làm lại với object con dùng chung và chấm dứt đệ quy khi có vòng (lần thăm thứ hai gặp object đã đóng băng). Ghi vào object đóng băng bị bỏ qua âm thầm ở code không strict, ném lỗi ở strict — push lên mảng đóng băng luôn ném vì nó phải thêm thuộc tính.'],
    kn: ['Object.freeze', 'recursion', 'const vs immutability'],
    tns: [...TN, tn('shallow vs deep', 'nông vs sâu', 'Shallow = only the top level; deep = every nested level.')],
    viDu: [{ input: "const cfg = deepFreeze({ db: { host: 'a', ports: [1] } }); cfg.db.host = 'b'; cfg.db.host", output: '"a"', explanation: 'The nested write is ignored because db is frozen too.|||Lần ghi lồng bị bỏ qua vì db cũng bị đóng băng.' }],
    dau: `// Freeze an object and everything inside it.
function deepFreeze(obj) {
  return Object.freeze(obj);
}
`,
    giai: `// Freeze an object and everything inside it (objects AND arrays, any depth).
function deepFreeze(obj) {
  // primitives (and null, whose typeof is "object") have nothing to freeze
  if (obj === null || typeof obj !== 'object') return obj;
  // already frozen: done — this is also what stops a self-reference (cfg.self = cfg)
  if (Object.isFrozen(obj)) return obj;
  Object.freeze(obj);               // parent FIRST, so a cycle finds it frozen
  for (const value of Object.values(obj)) {
    deepFreeze(value);              // arrays are objects: same code path
  }
  return obj;                       // the same object, not a copy
}
`,
    cases: [
      { moTa: ['nested write is ignored, nested object is frozen', 'ghi lồng bị bỏ qua, object lồng bị đóng băng'], goi: "(() => { const cfg = { db: { host: 'localhost' }, name: 'notes' }; const out = deepFreeze(cfg); cfg.db.host = 'evil'; return [out === cfg, Object.isFrozen(cfg.db), cfg.db.host]; })()" },
      { moTa: ['arrays inside are frozen (push throws)', 'mảng bên trong bị đóng băng (push ném lỗi)'], goi: "(() => { const cfg = deepFreeze({ db: { ports: [5432] } }); let threw = false; try { cfg.db.ports.push(1); } catch (e) { threw = e.name; } return [threw, cfg.db.ports.length]; })()" },
      { moTa: ['primitives come back unchanged', 'giá trị nguyên thuỷ trả về nguyên'], goi: '[deepFreeze(5), deepFreeze(null), deepFreeze("x")]' },
      { an: true, goi: "(() => { const cfg = { a: { b: { c: { d: [ { e: 1 } ] } } } }; deepFreeze(cfg); return [Object.isFrozen(cfg.a.b.c), Object.isFrozen(cfg.a.b.c.d), Object.isFrozen(cfg.a.b.c.d[0])]; })()" },
      { an: true, goi: "(() => { const cfg = { name: 'notes', limits: { page: 20 } }; cfg.self = cfg; cfg.limits.owner = cfg; deepFreeze(cfg); return [Object.isFrozen(cfg), Object.isFrozen(cfg.limits)]; })()" },
    ],
  }),
]);
