// Node.js 0.0 (1/2) — What a backend is, and what Node.js does on it. Bài định hướng ⇒ đề nhẹ: bảng/sắp thứ tự/trắc nghiệm + một hàm nhỏ.
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('backend / server', 'backend / máy chủ', 'The program that holds the data and answers requests; the user never sees it.'),
  tn('client', 'máy khách', 'The part the user touches — a web page or an app — that asks the server for things.'),
  tn('request–response', 'yêu cầu – phản hồi', 'The ask-and-answer cycle almost every feature is built from.'),
  tn('untrusted client', 'client không đáng tin', 'Anyone can change what the browser sends, so real checks live on the server.'),
  tn('Node.js', 'Node.js', 'What lets you write the server in JavaScript instead of PHP, Java or Python.'),
];

export default modul('nodejs-0-0-start-here-1', '0.0 Start here (1/2): what a backend is', [
  cs({
    ten: 'Client or server: who must do this job?',
    kho: 'EASY', phut: 5, loai: 'table',
    en: 'The client asks; the server checks who is asking, reads or writes the database and answers. For each job in a Notes app, decide where it <b>must</b> happen. Remember the lesson\'s reason: anyone can open the browser dev tools and change what the page sends.',
    vi: 'Client hỏi; server kiểm ai đang hỏi, đọc/ghi CSDL rồi trả lời. Với mỗi việc trong một app ghi chú, quyết định nó PHẢI xảy ra ở đâu. Nhớ lý do của bài: ai cũng mở được dev tools của trình duyệt và sửa thứ trang gửi đi.',
    bang: [bang1('c1', ['Where must each job run?', 'Mỗi việc phải chạy ở đâu?'],
      [{ ma: 'viec', ten: 'Job|||Việc' }, { ma: 'noi', ten: 'Where|||Ở đâu', luaChon: ['client', 'server'] }],
      [
        { o: { viec: 'Draw the note list and the "New note" button' }, a: { noi: 'client' } },
        { o: { viec: 'Check that the password is correct at login' }, a: { noi: 'server' } },
        { o: { viec: 'Store every user\'s notes so they survive a closed browser' }, a: { noi: 'server' } },
        { o: { viec: 'Decide whether user 7 may read user 9\'s note' }, a: { noi: 'server' } },
        { o: { viec: 'Show a red border while the title field is empty (a hint for the user)' }, a: { noi: 'client' } },
        { o: { viec: 'Reject a note whose title is empty, even if the page did not stop it' }, a: { noi: 'server' } },
        { o: { viec: 'Charge money for a Pro account' }, a: { noi: 'server' } },
      ],
      ['Anything that protects data, money or other people must run on the server, because the client can be changed by whoever holds it. The client is great for drawing and for friendly hints — a red border is a <i>suggestion</i>; the same check on the server is the <i>guarantee</i>.', 'Mọi thứ bảo vệ dữ liệu, tiền hay người khác phải chạy ở server, vì client có thể bị người cầm nó sửa. Client rất hợp để vẽ và gợi ý thân thiện — viền đỏ là GỢI Ý; cùng phép kiểm đó ở server mới là BẢO ĐẢM.'])],
    goiY: [['Ask: if a user edited the page to skip this, would something bad happen to data, money or another user?', 'Hỏi: nếu người dùng sửa trang để bỏ qua việc này, dữ liệu, tiền hay người khác có bị hại không?'], ['A check may appear on BOTH sides: the client for comfort, the server for truth.', 'Một phép kiểm có thể ở CẢ hai phía: client cho dễ chịu, server cho chắc chắn.']],
    loi: [['Trusting a check that only exists in the browser.', 'Tin một phép kiểm chỉ có trong trình duyệt.'], ['Thinking the server should draw the UI — in this course the server answers with data (JSON).', 'Nghĩ server phải vẽ giao diện — trong khoá này server trả dữ liệu (JSON).']],
    tns: TN,
  }),

  cs({
    ten: 'One request–response pair, step by step',
    kho: 'EASY', phut: 4, loai: 'order',
    en: 'A user presses "Save" on a new note. Put what happens in order — the cycle almost everything in this course is a variation of.',
    vi: 'Người dùng bấm "Lưu" một ghi chú mới. Sắp các bước theo thứ tự — vòng mà gần như mọi thứ trong khoá này là biến thể của nó.',
    cau: [
      ord('r1', ['Order the steps.', 'Sắp các bước.'], [
        'The client sends a request: "save this note" with the title and text',
        'The server checks who is asking (is this user logged in?)',
        'The server validates the data again (title not empty…)',
        'The server writes the note to the database',
        'The server sends back a response: the saved note, or an error',
        'The client shows the result to the user',
      ], ['Ask → check identity → check data → touch the database → answer → display. The two checks happen on the server because the client cannot be trusted; the database lives on the server for the same reason.', 'Hỏi → kiểm danh tính → kiểm dữ liệu → chạm CSDL → trả lời → hiển thị. Hai phép kiểm ở server vì client không đáng tin; CSDL nằm ở server cũng vì lý do đó.']),
    ],
    goiY: [['The client both starts and ends the cycle.', 'Client vừa mở đầu vừa kết thúc vòng.'], ['Check before you write: nothing reaches the database before the server has verified who and what.', 'Kiểm trước khi ghi: không gì tới CSDL trước khi server xác minh ai và cái gì.']],
    loi: [['Writing to the database before checking the user.', 'Ghi CSDL trước khi kiểm người dùng.'], ['Ending at "database write" — the client still needs an answer.', 'Kết thúc ở "ghi CSDL" — client vẫn cần câu trả lời.']],
    tns: TN,
  }),

  cs({
    ten: 'Why JavaScript on the server, and what you need to start',
    kho: 'EASY', phut: 5,
    en: 'Quick questions on the rest of the first "Start here" lesson.',
    vi: 'Câu hỏi nhanh về phần còn lại của bài "Bắt đầu tại đây" đầu tiên.',
    cau: [
      q('w1', ['What does Node.js add to JavaScript?', 'Node.js thêm gì cho JavaScript?'],
        ['It lets JavaScript run on the server, so one language runs the whole stack', 'It is a new language that replaces JavaScript', 'It makes the browser faster', 'It is a database for JavaScript apps'],
        ['Before 2009 the server was PHP, Java, Ruby or Python while the browser ran JavaScript. Node put JavaScript on the server too — skills carry across and you stop translating ideas between two languages.', 'Trước 2009 server viết bằng PHP, Java, Ruby, Python còn trình duyệt chạy JavaScript. Node đưa JavaScript lên server — kỹ năng dùng lại được, không phải dịch ý tưởng giữa hai ngôn ngữ.']),
      q('w2', ['Why does the real data live on the server and not in the browser?', 'Vì sao dữ liệu thật nằm ở server chứ không ở trình duyệt?'],
        ['The client cannot be trusted — anyone can change what the page sends or stores', 'Browsers have no storage at all, so the data has nowhere else to live', 'Servers are always faster than browsers, so data is quicker to read there', 'It is only a historical convention from before JavaScript existed'],
        ['The lesson\'s rule: "a check done only in the browser is a suggestion, not a guarantee".', 'Luật của bài: "phép kiểm chỉ làm trong trình duyệt là gợi ý, không phải bảo đảm".']),
      q('w3', ['What are you expected to know before Chapter 1?', 'Trước Chương 1 bạn cần biết gì?'],
        ['Basic coding in any language (variables, loops, functions) and the will to type every example', 'Solid JavaScript, SQL and how to deploy a server to a VPS on your own', 'Express and React, because the course starts directly with a full-stack app', 'Nothing at all — not even what a variable or a loop is'],
        ['No prior JavaScript (Chapter 1 rebuilds it), no backend, database or server experience — just basic coding and typing the examples yourself.', 'Không cần JavaScript trước (Chương 1 dựng lại), không cần backend, CSDL hay server — chỉ cần lập trình cơ bản và tự gõ ví dụ.']),
    ],
    goiY: [['"Runtime", not "language".', '"Môi trường chạy", không phải "ngôn ngữ".'], ['Trust is the reason behind every server-side choice in this lesson.', 'Niềm tin là lý do đằng sau mọi lựa chọn phía server trong bài.']],
    loi: [['Calling Node.js a language or a framework.', 'Gọi Node.js là ngôn ngữ hay framework.'], ['Thinking you must master JavaScript first — the course rebuilds the parts a backend uses.', 'Nghĩ phải thạo JavaScript trước — khoá dựng lại đúng phần backend dùng.']],
    tns: TN,
  }),

  jsBai({
    ten: 'The server re-checks: validate a new note',
    kho: 'MEDIUM', phut: 12,
    en: `<p>Your first backend function, in plain JavaScript (Chapter 1 explains every piece; here you only need <code>if</code>, strings and arrays). The page already shows a red border when the title is empty — but that is a suggestion. Write <code>validateNewNote(body)</code> for the server: it returns an array of error messages (empty array = valid), in this order:</p>
<ol><li><code>title</code> missing, not a string, or only spaces ⇒ <code>'title is required'</code>.</li>
<li><code>title</code> longer than 100 characters (after trimming) ⇒ <code>'title is too long'</code>.</li>
<li>The client sent <code>ownerId</code> ⇒ <code>'ownerId is set by the server'</code> — the server decides who owns a note (from the login), never the client.</li></ol>${pre("validateNewNote({ title: 'Buy milk' })                 // []\nvalidateNewNote({ title: '   ' })                      // ['title is required']\nvalidateNewNote({ title: 'Hi', ownerId: 1 })           // ['ownerId is set by the server']")}`,
    vi: `<p>Hàm backend đầu tiên, viết JavaScript thuần (Chương 1 giải thích từng phần; ở đây chỉ cần if, chuỗi, mảng). Trang đã có viền đỏ khi tiêu đề rỗng — nhưng đó là gợi ý. Viết validateNewNote(body) cho server: trả mảng thông báo lỗi (mảng rỗng = hợp lệ) theo thứ tự: thiếu/không phải chuỗi/chỉ có khoảng trắng ⇒ 'title is required'; dài hơn 100 ký tự (sau khi trim) ⇒ 'title is too long'; client gửi ownerId ⇒ 'ownerId is set by the server'.</p>`,
    yc: [
      ['Return an array of messages in the order listed; <code>[]</code> when valid.', 'Trả mảng thông báo theo thứ tự đã liệt kê; [] khi hợp lệ.'],
      ['Trim before measuring the title.', 'Trim trước khi đo tiêu đề.'],
      ['Reject any <code>ownerId</code> sent by the client, whatever its value.', 'Từ chối mọi ownerId client gửi, giá trị gì cũng vậy.'],
    ],
    goiY: [['Start with <code>const errors = [];</code> and <code>push</code> a message for each rule that fails; return <code>errors</code> at the end.', 'Bắt đầu với const errors = []; push thông báo cho mỗi luật trượt; cuối cùng return errors.'], ['<code>typeof body.title === \'string\'</code> tells you it is a string; <code>body.title.trim() === \'\'</code> tells you it is only spaces. Use <code>\'ownerId\' in body</code> for the last rule.', 'typeof body.title === \'string\' cho biết là chuỗi; body.title.trim() === \'\' cho biết chỉ có khoảng trắng. Dùng \'ownerId\' in body cho luật cuối.']],
    loi: [['Checking <code>if (!body.title)</code> only — a title of three spaces passes.', 'Chỉ kiểm if (!body.title) — tiêu đề ba dấu cách vẫn qua.'], ['Accepting <code>ownerId</code> from the body — any user could create notes in someone else\'s name.', 'Nhận ownerId từ body — ai cũng tạo được ghi chú dưới tên người khác.']],
    gt: ['The browser check helps honest users; this function protects the data from everyone else. Collecting all messages (instead of stopping at the first) lets the client show every problem at once. The <code>ownerId</code> rule is the lesson\'s "untrusted client" in one line: fields that decide permissions come from the server\'s knowledge of who is logged in, never from the request body.',
      'Phép kiểm trong trình duyệt giúp người dùng ngay thẳng; hàm này bảo vệ dữ liệu khỏi mọi người còn lại. Gom đủ thông báo (thay vì dừng ở lỗi đầu) để client hiện mọi vấn đề một lần. Luật ownerId là "client không đáng tin" gói trong một dòng: trường quyết định quyền đến từ việc server biết ai đang đăng nhập, không bao giờ từ body của request.'],
    kn: ['server-side validation', 'untrusted client'],
    tns: TN,
    viDu: [{ input: "validateNewNote({ title: '   ', ownerId: 1 })", output: '["title is required","ownerId is set by the server"]', explanation: 'Both problems are reported.|||Báo cả hai lỗi.' }],
    dau: `function validateNewNote(body) {
  const errors = [];
  if (!body.title) errors.push('title is required');
  return errors;
}
`,
    giai: `// The page's red border is a suggestion; this check is the guarantee.
function validateNewNote(body) {
  const errors = [];
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title === '') {
    errors.push('title is required');           // missing, not a string, or only spaces
  } else if (title.length > 100) {
    errors.push('title is too long');
  }
  if ('ownerId' in body) {
    errors.push('ownerId is set by the server'); // who owns a note comes from the login, not the client
  }
  return errors;
}
`,
    cases: [
      { moTa: ['a valid note', 'ghi chú hợp lệ'], goi: "validateNewNote({ title: 'Buy milk', text: '2 litres' })" },
      { moTa: ['only spaces ⇒ title is required', 'chỉ khoảng trắng ⇒ title is required'], goi: "validateNewNote({ title: '   ' })" },
      { moTa: ['ownerId from the client is rejected', 'ownerId từ client bị từ chối'], goi: "validateNewNote({ title: 'Hi', ownerId: 1 })" },
      { an: true, goi: "[validateNewNote({}), validateNewNote({ title: 42 }), validateNewNote({ title: 'x'.repeat(101) }), validateNewNote({ title: '  ' + 'y'.repeat(100) + '  ' })]" },
      { an: true, goi: "[validateNewNote({ title: '', ownerId: null }), validateNewNote({ title: 'ok', ownerId: undefined })]" },
    ],
  }),
]);
