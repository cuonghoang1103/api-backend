/**
 * 9.3 — Đọc tài liệu thiết kế cơ bản và chi tiết (BD/DD) dạng Excel (agl-9-3-tai-lieu-bd-dd). Soạn 24/11/2026.
 * DD mẫu: ../_mau.mjs (dự án hư cấu). Output NFC/NFD + toàn góc/nửa góc: chạy thật Node 22.22.2 trên máy soạn
 * (scratchpad/agl/lab/nfc.mjs). Mã cài đặt DD: scratchpad/agl/lab/dang-ky/src/kiem-tra.mjs (chạy thật, 20/20 test qua).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, out, js, ac, ag, cs, vo, taiMau } from '../_chung.mjs';
import { DD_BIA, DD_LICH_SU, DD_MUC, DD_SU_KIEN, DD_THONG_BAO, DD_BANG, QA, bangHtml } from '../_mau.mjs';

const NFC_OUT = out(`$ node nfc.mjs
Hiển thị giống nhau: Nguyễn Nguyễn | bằng nhau (===)? false
NFC: .length = 6 | byte UTF-8 = 8
NFD: .length = 8 | byte UTF-8 = 10
Đếm sau chuẩn hoá NFC: 6
Toàn góc (全角): ＡＢＣ１２３ .length = 6 | byte UTF-8 = 18
Nửa góc (半角): ABC123 .length = 6 | byte UTF-8 = 6`);

const NFC_JS = js(`
const nfc = 'Nguyễn'.normalize('NFC'), nfd = nfc.normalize('NFD');
console.log('Hiển thị giống nhau:', nfc, nfd, '| bằng nhau (===)?', nfc === nfd);
console.log('NFC: .length =', nfc.length, '| byte UTF-8 =', Buffer.byteLength(nfc));
console.log('NFD: .length =', nfd.length, '| byte UTF-8 =', Buffer.byteLength(nfd));
console.log('Đếm sau chuẩn hoá NFC:', [...nfd.normalize('NFC')].length);
const zen = 'ＡＢＣ１２３', han = 'ABC123';
console.log('Toàn góc (全角):', zen, '.length =', zen.length, '| byte UTF-8 =', Buffer.byteLength(zen));
console.log('Nửa góc (半角):', han, '.length =', han.length, '| byte UTF-8 =', Buffer.byteLength(han));`);

const MA_KIEM = js(`
// Kiểm tra dữ liệu màn hình SCR-PAT-REG-01 theo DD v1.2 (bảng "Định nghĩa mục" + "Xử lý sự kiện" BTN-01).
// Mỗi lỗi trả về MÃ THÔNG BÁO của DD (MSG-Exxx), không tự đặt câu chữ — câu chữ nằm ở bảng thông báo.
const doDai = (s) => [...s.normalize('NFC')].length;      // QA-004: đếm ký tự hiển thị sau NFC

export function kiemTra(input, homNay) {
  const loi = {};
  const fullName = s('fullName').trim();                  // ITM-01 ghi chú: bỏ khoảng trắng đầu/cuối
  // …
  if (!fullName) loi.fullName = ['MSG-E001', TEN_MUC.fullName];
  else if (doDai(fullName) > 50) loi.fullName = ['MSG-E002', TEN_MUC.fullName, 50];
  // … ITM-02 → ITM-07 theo đúng thứ tự trong bảng
  // Bước 2 — kiểm tương quan: chỉ khi cả hai ô mật khẩu đã qua kiểm đơn mục (QA-007).
  if (!loi.password && !loi.passwordConfirm && password !== passwordConfirm) loi.passwordConfirm = ['MSG-E007'];
  return { hopLe: Object.keys(loi).length === 0, loi };
}`);

export const L93 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Outsourcing projects', 'Chương 9 · Dự án outsourcing', `
<h2>${t('9.3 — Reading basic and detailed design documents (BD/DD) in Excel', '9.3 — Đọc tài liệu thiết kế cơ bản và chi tiết (BD/DD) dạng Excel')}</h2>
<p class="lead">${t(
    'Your first real task on a Japanese project is rarely "write code". It is "read this design document and tell me how long it takes". The document is usually an Excel workbook with a dozen sheets, item IDs everywhere and a few Japanese words. This lesson teaches you to read it systematically, turn it into a list of work, and catch the ambiguities before they become bugs.',
    'Việc thật đầu tiên ở dự án Nhật hiếm khi là "viết code". Nó là "đọc tài liệu thiết kế này rồi cho anh biết mất bao lâu". Tài liệu thường là một tệp Excel hơn chục sheet, mã mục khắp nơi, lác đác chữ Nhật. Bài này dạy bạn đọc có phương pháp, biến nó thành danh sách việc, và bắt chỗ mơ hồ trước khi chúng thành bug.')}</p>

<h3>${t('Why Excel, of all tools?', 'Sao lại là Excel?')}</h3>
<p>${t(
    'Japanese enterprise projects have written designs in spreadsheets for decades: grids are good for tables of items, the customer can open them without special tools, and every cell can be reviewed and commented. You may find this old-fashioned; your job is to read it fluently. (Some newer projects use Confluence, Markdown or Figma — the structure you learn here is the same.)',
    'Dự án doanh nghiệp Nhật viết thiết kế bằng bảng tính từ hàng chục năm nay: lưới ô hợp với bảng định nghĩa mục, khách mở được không cần công cụ đặc biệt, và ô nào cũng review, chú thích được. Bạn có thể thấy nó cổ; việc của bạn là đọc thành thạo. (Vài dự án mới dùng Confluence, Markdown hay Figma — cấu trúc học ở đây vẫn y vậy.)')}</p>

<h3>${t('BD vs DD: what each answers', 'BD và DD: mỗi loại trả lời câu gì')}</h3>
${bang(['', t('Basic design (BD, 基本設計)', 'Thiết kế cơ bản (BD, 基本設計)'), t('Detailed design (DD, 詳細設計)', 'Thiết kế chi tiết (DD, 詳細設計)')], [
    [t('Question', 'Câu hỏi'), t('<em>What</em> does the user see and do?', 'Người dùng <em>thấy gì, làm gì</em>?'), t('<em>How</em> does the program process it?', 'Chương trình <em>xử lý thế nào</em>?')],
    [t('Reader', 'Người đọc'), t('Customer, BrSE, testers, devs', 'Khách, BrSE, tester, dev'), t('Devs, reviewers, UT writers', 'Dev, người review, người viết UT')],
    [t('Typical sheets', 'Sheet hay gặp'), t('Screen list (画面一覧), screen transition diagram (画面遷移図), screen layout, item definitions, table list / ER, interface list, batch list, message list, CRUD matrix', 'Danh sách màn hình (画面一覧), sơ đồ chuyển màn hình (画面遷移図), bố cục màn hình, định nghĩa mục, danh sách bảng / ER, danh sách giao tiếp, danh sách batch, danh sách thông báo, ma trận CRUD'), t('Item definitions with exact rules, event processing step by step, SQL, table definitions, class/method design', 'Định nghĩa mục với quy tắc chính xác, xử lý sự kiện từng bước, SQL, định nghĩa bảng, thiết kế lớp/hàm')],
    [t('Written by', 'Ai viết'), t('Customer or vendor, approved by customer', 'Khách hoặc vendor, khách duyệt'), t('Usually the offshore team — sometimes you', 'Thường là đội offshore — đôi khi chính bạn')],
  ])}

<h3>${t('Anatomy of a DD workbook', 'Giải phẫu một tệp DD')}</h3>
<p>${t('Below is a complete, small DD for one screen of a (fictional) clinic booking system — the same document used throughout chapter 9. Read it once now; we will then read it the professional way.', 'Dưới đây là một DD nhỏ, đầy đủ cho một màn hình của hệ thống đặt lịch phòng khám (hư cấu) — cũng là tài liệu dùng xuyên suốt chương 9. Đọc lướt một lượt; sau đó ta đọc lại theo cách dân chuyên.')}</p>
${taiMau('DD-mau_SCR-PAT-REG-01.xlsx', en)}
<h4>${t('Sheet "Cover" and change history', 'Sheet "Bìa" và lịch sử sửa đổi')}</h4>
${bang([t('Field', 'Mục'), t('Value', 'Giá trị')], DD_BIA.map(([a, b]) => [`<strong>${a}</strong>`, b]))}
${bangHtml(DD_LICH_SU)}
<h4>${t('Sheet "Item definitions" (項目定義)', 'Sheet "Định nghĩa mục" (項目定義)')}</h4>
${bangHtml(DD_MUC)}
<p><em>${DD_MUC.ghiChu}</em></p>
<h4>${t('Sheet "Event processing" (イベント処理)', 'Sheet "Xử lý sự kiện" (イベント処理)')}</h4>
${bangHtml(DD_SU_KIEN)}
<h4>${t('Sheet "Messages" (メッセージ一覧)', 'Sheet "Thông báo" (メッセージ一覧)')}</h4>
${bangHtml(DD_THONG_BAO)}
<h4>${t('Sheet "Table definition" (テーブル定義) — patient', 'Sheet "Định nghĩa bảng" (テーブル定義) — patient')}</h4>
${bangHtml(DD_BANG)}

<h3>${t('Reading it the professional way: six passes', 'Đọc kiểu dân chuyên: sáu lượt')}</h3>
<ol>
<li>${t('<strong>Cover and history first.</strong> Which version are you reading? What changed since the last one? (Here v1.2 changed BTN-01: show <em>all</em> errors at once — code written against v1.1 is now wrong.) Many teams also mark changed cells in red text: 修正箇所は赤字.', '<strong>Bìa và lịch sử trước.</strong> Bạn đang đọc bản nào? Bản này đổi gì so với bản trước? (Ở đây v1.2 đổi BTN-01: hiện <em>tất cả</em> lỗi một lần — code viết theo v1.1 giờ sai.) Nhiều đội còn tô chữ đỏ ô đã sửa: 修正箇所は赤字.')}</li>
<li>${t('<strong>Follow the IDs, not the prose.</strong> Every rule has an address: <code>SCR-PAT-REG-01 / ITM-03</code>, <code>MSG-E004</code>. Use those IDs in your code comments, test cases, commit messages and questions. "The phone field" is ambiguous; "ITM-03" is not.', '<strong>Đi theo mã, không theo câu chữ.</strong> Quy tắc nào cũng có địa chỉ: <code>SCR-PAT-REG-01 / ITM-03</code>, <code>MSG-E004</code>. Dùng chính các mã đó trong chú thích code, test case, commit và câu hỏi. "Ô số điện thoại" thì mơ hồ; "ITM-03" thì không.')}</li>
<li>${t('<strong>Read the item table column by column</strong>, not row by row: first all "Required" values, then all lengths, then all formats. Inconsistencies jump out (e.g. ITM-06 length 8–64 duplicates ITM-05 — fine; a length of 50 here and VARCHAR(30) in the table sheet — a bug in the document).', '<strong>Đọc bảng định nghĩa mục theo cột</strong>, không theo hàng: trước hết mọi giá trị "Bắt buộc", rồi mọi độ dài, rồi mọi định dạng. Chỗ không khớp tự lộ ra (ví dụ độ dài 50 ở đây mà bảng DB ghi VARCHAR(30) — lỗi của tài liệu).')}</li>
<li>${t('<strong>Walk the events like a debugger.</strong> For each step ask: what is the input, what is checked, what happens on error, where does it stop? Does step 2 run if step 1 failed? (The document does not say — that is a question.)', '<strong>Đi qua từng sự kiện như debugger.</strong> Mỗi bước hỏi: đầu vào là gì, kiểm gì, lỗi thì sao, dừng ở đâu? Bước 2 có chạy nếu bước 1 lỗi không? (Tài liệu không nói — đó là một câu hỏi.)')}</li>
<li>${t('<strong>Cross-check sheets.</strong> Every MSG used in "Event processing" must exist in "Messages"; every item stored must have a column in "Table definition" with a compatible type and length; every message text must make sense for every field it is used with.', '<strong>Đối chiếu chéo các sheet.</strong> Mọi MSG dùng trong "Xử lý sự kiện" phải có trong "Thông báo"; mọi mục được lưu phải có cột trong "Định nghĩa bảng" với kiểu và độ dài khớp; câu thông báo phải hợp lý với mọi mục dùng nó.')}</li>
<li>${t('<strong>Hunt for what is missing.</strong> Boundaries (= today?), normalisation (spaces, upper/lower case, full-width characters), concurrency (two people registering the same e-mail at the same second), error paths, and promises made by a message (MSG-I001 promises an activation e-mail that no sheet describes).', '<strong>Săn thứ còn thiếu.</strong> Giá trị biên (= hôm nay?), chuẩn hoá (khoảng trắng, hoa/thường, ký tự toàn góc), đồng thời (hai người đăng ký cùng email cùng một giây), đường lỗi, và lời hứa nằm trong câu thông báo (MSG-I001 hứa một email kích hoạt mà không sheet nào mô tả).')}</li>
</ol>
${cl('warn', t('<strong>The rule of the day:</strong> when the document is unclear, you do <em>not</em> decide silently. You write a Q&amp;A item with your proposal (lesson 9.5) and code according to the proposal, marking it in a comment, until the answer arrives.', '<strong>Luật vàng:</strong> tài liệu chưa rõ thì bạn <em>không</em> tự quyết lặng lẽ. Bạn viết một dòng Q&amp;A kèm đề xuất (bài 9.5) và code theo đề xuất, ghi chú lại trong code, cho tới khi có câu trả lời.'))}

<h3>${t('Small Japanese vocabulary for design documents', 'Ít từ tiếng Nhật hay gặp trong tài liệu thiết kế')}</h3>
${bang([t('Japanese', 'Tiếng Nhật'), t('Reading', 'Đọc'), t('Meaning', 'Nghĩa')], [
    ['項目名', 'kōmoku-mei', t('item name', 'tên mục')], ['必須', 'hissu', t('required (○ = yes, × or blank = no, △ = conditional)', 'bắt buộc (○ = có, × hoặc trống = không, △ = có điều kiện)')],
    ['桁数', 'ketasū', t('number of digits/characters (length)', 'số chữ số/ký tự (độ dài)')], ['型', 'kata', t('type', 'kiểu')],
    ['初期値', 'shokichi', t('initial/default value', 'giá trị mặc định')], ['備考', 'bikō', t('remarks', 'ghi chú')],
    ['全角 / 半角', 'zenkaku / hankaku', t('full-width / half-width characters', 'ký tự toàn góc / nửa góc')], ['未定 / TBD', 'mitei', t('not decided yet', 'chưa quyết')],
    ['仕様', 'shiyō', t('specification', 'đặc tả')], ['不具合', 'fuguai', t('defect, bug', 'lỗi')],
  ])}
<p>${t('Japanese language courses at FPT University: ', 'Học tiếng Nhật bài bản: các môn ')}${ac('elementary-japanese-1-a11', 'jpd113-gioi-thieu', 'JPD113')}${t(' and its follow-ups.', ' và các môn tiếp theo.')}</p>

<h3>${t('A trap you can measure: "50 characters"', 'Một cái bẫy đo được: "50 ký tự"')}</h3>
<p>${t(
    'The item table says ITM-01 is 1–50 characters. But "character" is not one thing for a computer. Vietnamese names typed on a Mac or copied from some PDFs arrive in decomposed form (NFD): "ễ" becomes <em>e + circumflex + tilde</em>, three code points. Japanese customers often mean full-width characters, which take 3 bytes each in UTF-8 (2 in Shift_JIS). Run it yourself (Node 22):',
    'Bảng mục ghi ITM-01 dài 1–50 ký tự. Nhưng với máy tính, "ký tự" không phải một thứ duy nhất. Tên tiếng Việt gõ trên máy Mac hoặc chép từ vài tệp PDF đến dưới dạng tổ hợp (NFD): "ễ" thành <em>e + dấu mũ + dấu ngã</em>, ba code point. Khách Nhật thường nghĩ tới ký tự toàn góc, mỗi ký tự 3 byte trong UTF-8 (2 byte trong Shift_JIS). Tự chạy thử (Node 22):')}</p>
${NFC_JS}
${NFC_OUT}
<p>${t(
    'Two strings that look identical are not equal, and their <code>.length</code> differs. If your code counts <code>.length</code>, a legitimate 45-character Vietnamese name may be rejected; if the DB counts bytes, it may overflow. This is exactly the kind of point you raise as a question (QA-004 in the sample Q&amp;A list) rather than guess.',
    'Hai chuỗi trông y hệt mà không bằng nhau, <code>.length</code> cũng khác. Nếu code đếm bằng <code>.length</code>, một tên tiếng Việt hợp lệ 45 ký tự có thể bị từ chối; nếu DB đếm byte, nó có thể tràn cột. Đây đúng là loại chỗ bạn đặt câu hỏi (QA-004 trong Q&amp;A mẫu) chứ không đoán.')}</p>

<h3>${t('From document to code: keep the IDs', 'Từ tài liệu sang code: giữ nguyên mã')}</h3>
<p>${t('An excerpt of the implementation used in this chapter (full source in the lab, lesson 9.8). Notice how each rule points back to the document and to the Q&amp;A that settled it:', 'Trích đoạn phần cài đặt dùng trong chương (mã đầy đủ ở lab, bài 9.8). Để ý mỗi quy tắc trỏ ngược về tài liệu và về câu Q&amp;A đã chốt nó:')}</p>
${MA_KIEM}
<p>${t('Why return message IDs instead of text? Because the text belongs to the message sheet. When the customer changes the wording in v1.3, you change one table, not twenty <code>if</code> statements — and UT cases can assert the ID.', 'Sao trả mã thông báo thay vì câu chữ? Vì câu chữ thuộc về sheet thông báo. Khi khách đổi câu ở v1.3, bạn sửa một bảng chứ không phải hai mươi câu <code>if</code> — và case UT kiểm được chính mã.')}</p>

<h3>${t('Lab: read the DD and list the work', 'Lab: đọc DD và liệt kê việc cần làm')}</h3>
<p>${t('Using only the DD above:', 'Chỉ dùng DD ở trên:')}</p>
<ol>
<li>${t('Write the list of programming tasks (backend + frontend) a developer must do for this screen. Aim for 10–15 lines, each referencing IDs.', 'Viết danh sách việc lập trình (backend + frontend) mà dev phải làm cho màn hình này. Khoảng 10–15 dòng, dòng nào cũng ghi mã.')}</li>
<li>${t('Find at least <strong>six</strong> points that are unclear, inconsistent or missing. For each, write the question and your proposal.', 'Tìm ít nhất <strong>sáu</strong> chỗ chưa rõ, không nhất quán hoặc còn thiếu. Mỗi chỗ viết câu hỏi và đề xuất của bạn.')}</li>
<li>${t('Bonus: find one point where the document makes a promise outside the screen\'s scope.', 'Thêm: tìm một chỗ tài liệu "hứa" một thứ nằm ngoài phạm vi màn hình.')}</li>
</ol>
${giai(t('Model answer — work list', 'Đáp án mẫu — danh sách việc'), `<ol>
<li>${t('FE: layout of SCR-PAT-REG-01 with ITM-01…07, BTN-01, LNK-01 (password fields masked)', 'FE: bố cục SCR-PAT-REG-01 gồm ITM-01…07, BTN-01, LNK-01 (ô mật khẩu che ●●●)')}</li>
<li>${t('FE: show error text under each field; keep entered values except the two password fields (BTN-01 step 1)', 'FE: hiện lỗi dưới từng mục; giữ dữ liệu đã nhập trừ 2 ô mật khẩu (BTN-01 bước 1)')}</li>
<li>${t('FE: ITM-07 "terms" link opens SCR-CMN-TERM-01 in a new tab; LNK-01 → SCR-AUTH-LOGIN-01', 'FE: liên kết "điều khoản" ở ITM-07 mở SCR-CMN-TERM-01 tab mới; LNK-01 → SCR-AUTH-LOGIN-01')}</li>
<li>${t('BE: API POST /api/patients/register', 'BE: API POST /api/patients/register')}</li>
<li>${t('BE: single-item checks ITM-01…07 returning all errors at once (v1.2)', 'BE: kiểm đơn mục ITM-01…07, trả tất cả lỗi một lần (v1.2)')}</li>
<li>${t('BE: correlation check ITM-06 = ITM-05 → MSG-E007', 'BE: kiểm tương quan ITM-06 = ITM-05 → MSG-E007')}</li>
<li>${t('BE: duplicate e-mail check → MSG-E005 (and a UNIQUE constraint for concurrent requests)', 'BE: kiểm trùng email → MSG-E005 (kèm ràng buộc UNIQUE cho trường hợp đồng thời)')}</li>
<li>${t('BE: hash password per AT-BD-SEC-02; INSERT patient with status = 0', 'BE: băm mật khẩu theo AT-BD-SEC-02; INSERT patient với status = 0')}</li>
<li>${t('BE: DB error → MSG-E999 + ERROR log', 'BE: lỗi DB → MSG-E999 + log ERROR')}</li>
<li>${t('BE: message table MSG-E001…E009, E999, I001 with parameters', 'BE: bảng thông báo MSG-E001…E009, E999, I001 có tham số')}</li>
<li>${t('DB: migration for table patient (8 columns, UNIQUE email)', 'DB: migration bảng patient (8 cột, email UNIQUE)')}</li>
<li>${t('Test: UT spec + evidence (lesson 9.4)', 'Test: UT spec + evidence (bài 9.4)')}</li>
</ol>`)}
${giai(t('Model answer — unclear points (the sample Q&amp;A list)', 'Đáp án mẫu — các chỗ chưa rõ (Q&amp;A mẫu)'), bangHtml(QA, { chiCot: [1, 2, 3, 4] }) + `<p>${t('Also acceptable: concurrency of the duplicate check (two requests at the same time — needs the UNIQUE constraint to decide); what "status = 9 locked" means for an existing e-mail; whether LNK-01 should warn about unsaved input.', 'Cũng được tính: kiểm trùng khi đồng thời (hai request cùng lúc — cần ràng buộc UNIQUE quyết định); email đã có nhưng status = 9 (bị khoá) thì sao; LNK-01 có cảnh báo mất dữ liệu đang nhập không.')}</p>`)}

<h3>${t('Rubric (self-check)', 'Rubric (tự chấm)')}</h3>
${bang([t('Criterion', 'Tiêu chí'), t('Points', 'Điểm')], [
    [t('Every task references at least one ID', 'Mọi dòng việc ghi ít nhất một mã'), '2'],
    [t('Both FE and BE and DB covered, including error paths (E999)', 'Đủ FE, BE, DB, có cả đường lỗi (E999)'), '2'],
    [t('≥ 6 unclear points, each with a proposal', '≥ 6 chỗ chưa rõ, mỗi chỗ có đề xuất'), '3'],
    [t('Found the out-of-scope promise (activation e-mail)', 'Tìm ra lời hứa ngoài phạm vi (email kích hoạt)'), '2'],
    [t('No invented requirement presented as fact', 'Không bịa yêu cầu rồi coi như sự thật'), '1'],
  ])}

<h3>${t('Hacker\'s corner: the rule nobody wrote', 'Góc hacker: quy tắc không ai viết')}</h3>
<p>${t(
    'Design documents describe what the screen should accept; attackers look for what it does not reject. The DD above never says the API must refuse unknown fields — so a careless implementation that copies the whole request body into the database row could let someone send <code>"status": 1</code> and activate their own account (OWASP calls this "mass assignment"). The fix is in code (copy only the listed fields, as <code>kiemTra</code> does with <code>sach</code>), and the habit is in review: for every API ask "what if the request contains more than the document lists?"',
    'Tài liệu thiết kế mô tả màn hình phải nhận gì; kẻ tấn công tìm thứ nó không từ chối. DD ở trên không hề nói API phải từ chối trường lạ — nên một bản cài đặt ẩu chép nguyên body request vào dòng DB có thể để ai đó gửi <code>"status": 1</code> và tự kích hoạt tài khoản (OWASP gọi là "mass assignment"). Cách sửa nằm ở code (chỉ chép các mục có trong danh sách, như <code>kiemTra</code> làm với <code>sach</code>), còn thói quen nằm ở review: API nào cũng hỏi "nếu request chứa nhiều hơn tài liệu liệt kê thì sao?"')} ${cs('api-design', 'api-6-3-owasp-api', t('More in API design.', 'Xem thêm ở khoá API design.'))}</p>

${phongVan([
    [t('How do you start on a feature when you receive a design document?', 'Nhận tài liệu thiết kế, bạn bắt đầu một chức năng thế nào?'), t('Check version and history, read the item table by columns, walk each event step, cross-check messages and tables, list gaps as Q&amp;A with proposals, then estimate and only then code — referencing IDs everywhere.', 'Xem phiên bản và lịch sử, đọc bảng mục theo cột, đi qua từng bước sự kiện, đối chiếu thông báo và bảng, liệt kê chỗ thiếu thành Q&amp;A có đề xuất, rồi ước lượng, sau đó mới code — chỗ nào cũng ghi mã.')],
    [t('What is the difference between basic and detailed design?', 'Thiết kế cơ bản khác thiết kế chi tiết thế nào?'), t('BD describes the system from the outside (screens, items, transitions, tables) and is agreed with the customer; DD describes the internal processing needed to implement it and is mostly for developers and UT.', 'BD mô tả hệ thống từ bên ngoài (màn hình, mục, chuyển màn hình, bảng) và thống nhất với khách; DD mô tả xử lý bên trong để cài đặt, chủ yếu cho dev và UT.')],
    [t('The document is ambiguous and the deadline is tomorrow. What do you do?', 'Tài liệu mơ hồ mà mai là hạn. Bạn làm gì?'), t('Raise it immediately as a Q&amp;A with a concrete proposal, tell my leader, implement the proposal behind a clearly marked comment, and list it as an open risk in the daily report.', 'Đặt Q&amp;A ngay kèm đề xuất cụ thể, báo leader, cài đặt theo đề xuất với chú thích rõ ràng trong code, và ghi là rủi ro đang mở trong báo cáo ngày.')],
  ], en)}

${thuatNgu([
    ['BD (基本設計)', t('Basic/external design: what users see', 'Thiết kế cơ bản/bên ngoài: người dùng thấy gì')],
    ['DD (詳細設計)', t('Detailed/internal design: how it is processed', 'Thiết kế chi tiết/bên trong: xử lý thế nào')],
    [t('Item definition', 'Định nghĩa mục'), t('Table of fields with required/type/length/format', 'Bảng các trường: bắt buộc/kiểu/độ dài/định dạng')],
    [t('Single-item check / correlation check', 'Kiểm đơn mục / kiểm tương quan'), t('Validating one field / validating relations between fields', 'Kiểm một trường / kiểm quan hệ giữa các trường')],
    [t('Message ID', 'Mã thông báo'), t('Key of a user-visible text in the message list', 'Khoá của một câu hiển thị trong danh sách thông báo')],
    ['NFC / NFD', t('Composed / decomposed Unicode normal forms', 'Dạng chuẩn Unicode dựng sẵn / tổ hợp')],
    [t('Full-width / half-width', 'Toàn góc / nửa góc'), t('Wide (Ａ) vs narrow (A) characters in Japanese text', 'Ký tự rộng (Ａ) và hẹp (A) trong văn bản Nhật')],
  ], en)}

${tomTat([
    t('Read version and history first; follow IDs, not prose.', 'Đọc phiên bản và lịch sử trước; đi theo mã, không theo câu chữ.'),
    t('Read item tables by columns, walk events step by step, cross-check sheets, hunt for what is missing.', 'Đọc bảng mục theo cột, đi từng bước sự kiện, đối chiếu chéo sheet, săn thứ còn thiếu.'),
    t('Unclear ⇒ Q&amp;A with a proposal, never a silent decision.', 'Chưa rõ ⇒ Q&amp;A kèm đề xuất, không tự quyết lặng lẽ.'),
    t('Keep document IDs in code, tests and commits.', 'Giữ mã tài liệu trong code, test, commit.'),
  ], en)}
<p>${t('Related: how requirements are written in the first place — ', 'Liên quan: yêu cầu được viết ra thế nào từ đầu — ')}${ac('software-requirements', 'swr302-gioi-thieu', 'SWR302')}; ${t('next', 'tiếp theo')}: ${ag('agl-9-4-test-spec', t('9.4 — test spec and evidence', '9.4 — test spec và evidence'))}.</p>
`);
};
