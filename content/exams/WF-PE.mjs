/**
 * Web Foundations — Practical Exam (PE): 5 bài thực hành, nộp .zip.
 *
 * Đề tự soạn, bám sát `content/courses/web-foundations/s00…s10` (11 chương).
 * Khác WF-FE / WF-PT1 / WF-PT2 (trắc nghiệm thuần), đề này bắt VIẾT MÃ CHẠY
 * ĐƯỢC: một hàm dọn danh sách chữ đầy ca biên, một vòng JSON đọc-biến đổi-ghi,
 * một bộ định tuyến HTTP trả đúng mã trạng thái, một bộ kiểm khả năng tiếp cận
 * cho HTML, và năm truy vấn SQL viết lại bằng JavaScript.
 *
 * ⚠️ MỌI `sampleSolution` VÀ MỌI `expectedOutput` DƯỚI ĐÂY ĐÃ CHẠY THẬT trên
 * Node **v22.21.0** / darwin-arm64 (macOS 25.6), bằng đúng cách bộ kiểm ghép
 * bài: `starterCode` với vùng lời giải thay bằng `sampleSolution`, ghi ra một
 * file `.cjs` trong thư mục tạm KHÔNG có `node_modules`, chạy bằng `node`.
 *   • Câu 1, 2, 4, 5: chạy một lượt, chép nguyên văn stdout.
 *   • Câu 3 dựng máy chủ thật (`node:http`, `listen(0)` — cổng do hệ điều hành
 *     cấp) rồi tự gọi chính nó 13 lượt bằng `fetch`. Đã chạy **3 lượt liên
 *     tiếp** và `diff` từng byte: kết quả giống hệt nhau, nên nó KHÔNG phụ
 *     thuộc thời gian hay số cổng. Máy chủ tự tắt bằng
 *     `closeAllConnections()` + `close()` — thiếu dòng đầu thì tiến trình treo
 *     vì `fetch` của Node giữ kết nối keep-alive.
 *   • Câu 2 ghi/đọc file thật, nhưng ghi vào `__dirname` (chính thư mục chứa
 *     file bài làm) rồi xoá đi, nên nó không đụng tới thư mục làm việc.
 *
 * ⚠️ VÌ SAO KHÔNG CÂU NÀO KHAI `khongChayDuoc`. Cả 5 lời giải mẫu là file
 * JavaScript TỰ CHỨA — chỉ dùng module có sẵn của Node (`node:fs`, `node:http`)
 * và `fetch` dựng sẵn, không gói ngoài, không cơ sở dữ liệu, không mạng ra
 * ngoài. Đó cũng là lý do câu 5 (SQL nhập môn) KHÔNG khai `language: 'sql'`:
 * nhãn đó nằm trong tập `KHONG_CHAY_DUOC` của `scripts/exam-check.mjs` và sẽ
 * làm câu ấy chỉ được kiểm cấu trúc. Bắt viết JavaScript tính ra ĐÚNG cái mà
 * truy vấn SQL kia trả về thì bộ kiểm chạy thật được, mà kiến thức bị hỏi vẫn
 * là ngữ nghĩa SQL của chương 8.
 *
 * ⚠️ MỨC ĐỘ — đây là khoá cho người MỚI HOÀN TOÀN, không phải khoá Node.js.
 * Vì thế mọi thứ khoá chưa dạy đều nằm trong phần ĐỀ CHO SẴN: `require`,
 * `http.createServer`, `fs.readFileSync`, bộ tách thẻ HTML, hàm `bacTieuDe`.
 * Học viên chỉ viết HÀM THUẦN bằng những thứ chương 4–5 đã dạy (`filter`,
 * `map`, `for…of`, object literal, template literal). Vài phương thức khoá
 * không dạy mà đề vẫn cần — `slice`, `sort`, `toLowerCase`, `Number.isNaN` —
 * được ghi thẳng trong "Bảng tra nhanh" của phần hướng dẫn, nên không câu nào
 * đòi kiến thức chưa từng đưa cho học viên.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/WF-PE.mjs --apply
 */
import { B, c, codeQ } from './_lib/wf-exam-kit.mjs';

/**
 * Rubric riêng cho từng câu: tổng `maxScore` đúng bằng `points` của câu (2),
 * nên điểm từng tiêu chí cộng lại ra thẳng điểm câu — không phải quy đổi.
 */
const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({
  id,
  criterion: B(en, vi),
  weight: maxScore,
  maxScore,
}));

/* ── Bảng tra nhanh: những thứ đề dùng mà bài giảng chưa có ví dụ ───────── */

const BANG_TRA_EN =
  '<table>' +
  '<thead><tr><th>What</th><th>What it does</th><th>Example</th></tr></thead>' +
  '<tbody>' +
  '<tr><td>' + c('"abc".slice(1)') + '</td><td>a piece of a string (or of an array), from an index</td><td>' + c('"Lan".slice(0, 1) === "L"') + '</td></tr>' +
  '<tr><td>' + c('"AB".toLowerCase()') + '</td><td>lower / upper case of a string</td><td>' + c('"AN".toLowerCase() === "an"') + '</td></tr>' +
  '<tr><td>' + c('arr.sort(ss)') + '</td><td>sorts <b>in place</b> using a compare function: return a negative number to put <code>a</code> first, positive to put <code>b</code> first, 0 to keep them together. <b>It changes the array you call it on</b> — copy first with <code>arr.slice()</code>.</td><td>' + c('[3,1].slice().sort((a, b) => b - a)') + '</td></tr>' +
  '<tr><td>' + c('Number("12")') + '</td><td>text to number; text that is not a number gives <code>NaN</code></td><td>' + c('Number("abc")') + ' is <code>NaN</code></td></tr>' +
  '<tr><td>' + c('Number.isNaN(x)') + '</td><td>the only reliable NaN test — <code>NaN === NaN</code> is <b>false</b></td><td>' + c('Number.isNaN(Number("abc")) === true') + '</td></tr>' +
  '<tr><td>' + c('JSON.parse / JSON.stringify') + '</td><td>text ⇄ object (chapter 6.4). <code>JSON.stringify(x, null, 2)</code> indents by 2 spaces.</td><td>' + c('JSON.parse(\'{"a":1}\').a === 1') + '</td></tr>' +
  '<tr><td>' + c('arr.push(x)') + ' / ' + c('str.split(" ")') + ' / ' + c('arr.join(",")') + '</td><td>already taught — chapters 4.4 and 10.1</td><td>' + c('"a b".split(" ").join("-")') + '</td></tr>' +
  '</tbody></table>';

const BANG_TRA_VI =
  '<table>' +
  '<thead><tr><th>Thứ gì</th><th>Làm gì</th><th>Ví dụ</th></tr></thead>' +
  '<tbody>' +
  '<tr><td>' + c('"abc".slice(1)') + '</td><td>cắt một khúc của chuỗi (hoặc của mảng), tính từ một chỉ số</td><td>' + c('"Lan".slice(0, 1) === "L"') + '</td></tr>' +
  '<tr><td>' + c('"AB".toLowerCase()') + '</td><td>hạ chữ thường / nâng chữ hoa</td><td>' + c('"AN".toLowerCase() === "an"') + '</td></tr>' +
  '<tr><td>' + c('arr.sort(ss)') + '</td><td>sắp xếp <b>tại chỗ</b> bằng một hàm so sánh: trả số ÂM thì <code>a</code> đứng trước, số DƯƠNG thì <code>b</code> đứng trước, 0 thì giữ nguyên. <b>Nó SỬA chính mảng bạn gọi</b> — hãy chép ra trước bằng <code>arr.slice()</code>.</td><td>' + c('[3,1].slice().sort((a, b) => b - a)') + '</td></tr>' +
  '<tr><td>' + c('Number("12")') + '</td><td>đổi chữ thành số; chữ không phải số thì ra <code>NaN</code></td><td>' + c('Number("abc")') + ' là <code>NaN</code></td></tr>' +
  '<tr><td>' + c('Number.isNaN(x)') + '</td><td>cách kiểm NaN đáng tin duy nhất — <code>NaN === NaN</code> là <b>false</b></td><td>' + c('Number.isNaN(Number("abc")) === true') + '</td></tr>' +
  '<tr><td>' + c('JSON.parse / JSON.stringify') + '</td><td>chữ ⇄ object (bài 6.4). <code>JSON.stringify(x, null, 2)</code> thụt lề 2 dấu cách.</td><td>' + c('JSON.parse(\'{"a":1}\').a === 1') + '</td></tr>' +
  '<tr><td>' + c('arr.push(x)') + ' / ' + c('str.split(" ")') + ' / ' + c('arr.join(",")') + '</td><td>đã học rồi — bài 4.4 và 10.1</td><td>' + c('"a b".split(" ").join("-")') + '</td></tr>' +
  '</tbody></table>';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>You need nothing but <b>Node 22</b> — the one you installed in lesson 0.3. Check it with <code>node -v</code>. No <code>npm install</code>, no library, no database, no internet.</li>' +
  '<li>Make five folders, <code>bai1 … bai5</code>. Each question gives you a <b>Starter</b> block: copy it <b>verbatim</b> into <code>baiN/bai.js</code> and write your answer <b>only</b> between the two <code>ĐỀ CHO SẴN</code> markers. Run it with <code>node bai.js</code> from inside that folder.</li>' +
  '<li>The starter block does the parts the course has not taught yet (<code>require</code>, the HTTP server, reading a file, the tag reader). <b>Do not change it</b>, and do not delete the lines that print — the printed lines <em>are</em> the answer sheet. Note that a folder with no <code>package.json</code> runs in CommonJS mode, which is why the starter says <code>require(...)</code> and not <code>import</code>.</li>' +
  '<li><b>Run it before you submit.</b> Every question shows the exact output your file must print, line for line. A function that has never been run is not an answer — chapter 10.1: solve the simple version, run it, then add the edge cases one at a time.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first: the file has to run and print exactly what the question shows. But the marks also go to the <em>decisions</em> — the empty-input case handled instead of crashing, the original data left unmodified, the right status code for the right reason, a comparison written <code>===</code> and not <code>==</code>. Each question is 2 points and lists its own criteria.</p>' +
  '<p><b>Quick reference.</b> A few things below appear in the questions without having had a worked example in the lessons. They are all one line each; here they are, so no question asks for something you have never been shown.</p>' +
  BANG_TRA_EN +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Bạn không cần gì ngoài <b>Node 22</b> — đúng cái đã cài ở bài 0.3. Kiểm bằng <code>node -v</code>. Không <code>npm install</code>, không thư viện, không cơ sở dữ liệu, không cần mạng.</li>' +
  '<li>Tạo năm thư mục <code>bai1 … bai5</code>. Mỗi câu cho bạn một khối <b>Mã cho sẵn</b>: chép <b>nguyên văn</b> vào <code>baiN/bai.js</code> rồi viết lời giải <b>chỉ</b> ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Chạy bằng <code>node bai.js</code> ngay trong thư mục đó.</li>' +
  '<li>Khối cho sẵn lo giúp bạn những phần khoá chưa dạy (<code>require</code>, máy chủ HTTP, đọc file, bộ đọc thẻ). <b>Đừng sửa nó</b>, và đừng xoá những dòng in ra — chính mấy dòng in ấy LÀ bài làm của bạn. Lưu ý: thư mục không có <code>package.json</code> thì Node chạy ở chế độ CommonJS, nên khối cho sẵn viết <code>require(...)</code> chứ không phải <code>import</code>.</li>' +
  '<li><b>Chạy thử trước khi nộp.</b> Mỗi câu đều in sẵn ĐÚNG kết quả file của bạn phải in ra, từng dòng một. Một hàm chưa từng được chạy thì chưa phải lời giải — đúng bài 10.1: giải bản đơn giản nhất, chạy nó, rồi thêm từng ca biên một.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước: file phải chạy được và in đúng từng dòng như đề. Nhưng điểm cũng nằm ở các <em>quyết định</em> — ca đầu vào rỗng được xử lý thay vì làm vỡ chương trình, dữ liệu gốc được giữ nguyên, đúng mã trạng thái vì đúng lý do, phép so sánh viết <code>===</code> chứ không phải <code>==</code>. Mỗi câu 2 điểm và có bộ tiêu chí riêng.</p>' +
  '<p><b>Bảng tra nhanh.</b> Vài thứ dưới đây có xuất hiện trong đề mà bài giảng chưa có ví dụ chạy được. Mỗi thứ chỉ một dòng; đưa sẵn ở đây để không câu nào hỏi thứ bạn chưa từng được thấy.</p>' +
  BANG_TRA_VI +
  '</div>';

export default {
  course: { slug: 'web-foundations' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — five files you have to run before you believe them',
        'Thi thực hành — năm file phải chạy thật rồi mới được tin',
      ),
      description: B(
        'Five hands-on questions in plain JavaScript, submitted as a .zip. Clean up a messy list of names, turn one JSON file into another, route HTTP requests to the right status code, check a page for the accessibility rules of chapter 2, and rewrite five SQL queries as JavaScript that returns exactly the same rows. Nothing but Node 22 — no library, no database — covering chapters 2, 4, 5, 6, 8 and 10.',
        'Năm câu thực hành bằng JavaScript thuần, nộp dưới dạng .zip. Dọn một danh sách tên lộn xộn, biến một file JSON thành một file JSON khác, định tuyến các yêu cầu HTTP về đúng mã trạng thái, soi một trang theo các quy tắc khả năng tiếp cận của chương 2, và viết lại năm truy vấn SQL bằng JavaScript sao cho ra đúng từng dòng. Chỉ cần Node 22 — không thư viện, không cơ sở dữ liệu — bao phủ các chương 2, 4, 5, 6, 8 và 10.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Câu 1 · chương 4 (+ 10) ──────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q1 — Clean up a list people typed by hand (chapters 4.2, 4.4 and 10.1).</b> Ten lines came out of a sign-up form. Write ' + c('chuanHoaTen(dongNhap)') + ' in <code>bai1/bai.js</code>, returning an object ' + c('{ ten, boQua, trung }') + ':</p>' +
            '<ul>' +
            '<li><b>Extra spaces go away</b> — at the start, at the end, and between words: ' + c('"  an   nguyen  "') + ' becomes ' + c('"An Nguyen"') + '. (Tip: ' + c('"a  b".split(" ")') + ' gives ' + c('["a", "", "b"]') + ' — the empty strings are exactly what you have to drop.)</li>' +
            '<li><b>Each word: first letter upper case, the rest lower case.</b> ' + c('"nGuYeN"') + ' becomes ' + c('"Nguyen"') + '.</li>' +
            '<li><b>A line with no word left is not a name</b> — it does not go into <code>ten</code>, it counts into <code>boQua</code>. An empty string and a line of only spaces both land here.</li>' +
            '<li><b>Duplicates.</b> Two lines that come out the same after cleaning are the same person, whatever case they were typed in: keep the <b>first</b>, count the rest into <code>trung</code>.</li>' +
            '<li><b>Keep the order they arrived in.</b> Do not sort.</li>' +
            '</ul>' +
            '<p>Three things are graded that a function which prints the right five names can still get wrong: ' + c('chuanHoaTen([])') + ' must return ' + c('{ ten: [], boQua: 0, trung: 0 }') + ' and not crash, the array handed to the function must come back <b>unmodified</b>, and <code>boQua</code> and <code>trung</code> must count different things — a blank line is not a duplicate.</p>',

            '<p><b>Câu 1 — Dọn một danh sách người ta gõ tay (bài 4.2, 4.4 và 10.1).</b> Mười dòng vừa đi ra từ một biểu mẫu đăng ký. Hãy viết ' + c('chuanHoaTen(dongNhap)') + ' trong <code>bai1/bai.js</code>, trả về một object ' + c('{ ten, boQua, trung }') + ':</p>' +
            '<ul>' +
            '<li><b>Khoảng trắng thừa biến mất</b> — ở đầu, ở cuối, và giữa các từ: ' + c('"  an   nguyen  "') + ' thành ' + c('"An Nguyen"') + '. (Gợi ý: ' + c('"a  b".split(" ")') + ' cho ra ' + c('["a", "", "b"]') + ' — mấy chuỗi rỗng ấy chính là thứ bạn phải bỏ đi.)</li>' +
            '<li><b>Mỗi từ: chữ cái đầu viết HOA, phần còn lại viết thường.</b> ' + c('"nGuYeN"') + ' thành ' + c('"Nguyen"') + '.</li>' +
            '<li><b>Dòng không còn từ nào thì không phải một cái tên</b> — nó không vào <code>ten</code>, mà đếm vào <code>boQua</code>. Chuỗi rỗng và dòng chỉ toàn khoảng trắng đều rơi vào đây.</li>' +
            '<li><b>Trùng nhau.</b> Hai dòng sau khi dọn ra giống nhau là cùng một người, dù lúc gõ hoa thường thế nào: giữ dòng <b>đầu tiên</b>, phần còn lại đếm vào <code>trung</code>.</li>' +
            '<li><b>Giữ nguyên thứ tự chúng đi vào.</b> Đừng sắp xếp.</li>' +
            '</ul>' +
            '<p>Có ba thứ bị chấm mà một hàm in ra đúng năm cái tên vẫn có thể làm sai: ' + c('chuanHoaTen([])') + ' phải trả về ' + c('{ ten: [], boQua: 0, trung: 0 }') + ' chứ không được vỡ, mảng đưa vào hàm phải trở ra <b>y nguyên</b>, và <code>boQua</code> với <code>trung</code> phải đếm hai thứ khác nhau — một dòng trắng không phải là một dòng trùng.</p>',
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const DONG_NHAP = [\n" +
            "  '  an   nguyen  ',\n" +
            "  'AN NGUYEN',\n" +
            "  'tran thi   binh',\n" +
            "  '',\n" +
            "  '     ',\n" +
            "  'le',\n" +
            "  'nGuYeN  vAn a',\n" +
            "  'Tran Thi Binh',\n" +
            "  'NGUYEN VAN A',\n" +
            "  ' pham  quoc cuong ',\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function chuanHoaTen(dongNhap) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const kq = chuanHoaTen(DONG_NHAP);\n" +
            "for (const t of kq.ten) console.log('- ' + t);\n" +
            "console.log(`giu=${kq.ten.length} boQua=${kq.boQua} trung=${kq.trung}`);\n" +
            "console.log('goc con nguyen: ' + (DONG_NHAP.length === 10 && DONG_NHAP[0] === '  an   nguyen  '));\n" +
            "console.log(JSON.stringify(chuanHoaTen([])));\n" +
            "console.log(JSON.stringify(chuanHoaTen(['   ', '', ' '])));\n" +
            "console.log(JSON.stringify(chuanHoaTen(['le', 'LE', 'Le  ', '  le'])));\n" +
            "",
          expectedOutput:
            "- An Nguyen\n" +
            "- Tran Thi Binh\n" +
            "- Le\n" +
            "- Nguyen Van A\n" +
            "- Pham Quoc Cuong\n" +
            "giu=5 boQua=2 trung=3\n" +
            "goc con nguyen: true\n" +
            "{\"ten\":[],\"boQua\":0,\"trung\":0}\n" +
            "{\"ten\":[],\"boQua\":3,\"trung\":0}\n" +
            "{\"ten\":[\"Le\"],\"boQua\":0,\"trung\":3}",
          sampleSolution:
            "function chuanHoaTen(dongNhap) {\n" +
            "  const ten = [];\n" +
            "  const daCo = [];\n" +
            "  let boQua = 0;\n" +
            "  let trung = 0;\n" +
            "\n" +
            "  for (const dong of dongNhap) {\n" +
            "    const tu = dong.split(' ').filter((t) => t !== '');\n" +
            "    if (tu.length === 0) {\n" +
            "      boQua = boQua + 1;\n" +
            "      continue;\n" +
            "    }\n" +
            "    const chuan = tu\n" +
            "      .map((t) => t.slice(0, 1).toUpperCase() + t.slice(1).toLowerCase())\n" +
            "      .join(' ');\n" +
            "    const khoa = chuan.toLowerCase();\n" +
            "    if (daCo.filter((k) => k === khoa).length > 0) {\n" +
            "      trung = trung + 1;\n" +
            "      continue;\n" +
            "    }\n" +
            "    daCo.push(khoa);\n" +
            "    ten.push(chuan);\n" +
            "  }\n" +
            "\n" +
            "  return { ten: ten, boQua: boQua, trung: trung };\n" +
            "}\n" +
            "",
          rubric: rubric([
            ['dontrang',
              'Extra spaces are gone at both ends <em>and</em> between words, and each word comes out with one upper-case first letter — the five kept names print exactly as expected.',
              'Khoảng trắng thừa biến mất ở cả hai đầu <em>và</em> ở giữa các từ, và mỗi từ ra đúng một chữ cái đầu viết hoa — năm cái tên được giữ in ra đúng như mong đợi.',
              0.6],
            ['dembien',
              'The counters split correctly: <code>boQua=2</code> for the two lines with no word left and <code>trung=3</code> for the three repeats, and the case-insensitive comparison is what decides a repeat — <code>"le"</code>, <code>"LE"</code>, <code>"Le  "</code> and <code>"  le"</code> are one name plus three duplicates.',
              'Hai bộ đếm tách đúng: <code>boQua=2</code> cho hai dòng không còn từ nào và <code>trung=3</code> cho ba dòng lặp lại, và phép so sánh không phân biệt hoa thường mới là thứ quyết định một dòng trùng — <code>"le"</code>, <code>"LE"</code>, <code>"Le  "</code> và <code>"  le"</code> là một cái tên cộng ba lần trùng.',
              0.6],
            ['cabien',
              'The empty-array call returns the zero-filled object instead of throwing, and the all-blank call returns <code>boQua</code> equal to the number of lines — neither case is special-cased with an <code>if</code> at the top, they simply fall out of the loop.',
              'Lời gọi với mảng rỗng trả về object toàn số 0 chứ không ném lỗi, và lời gọi toàn dòng trắng trả <code>boQua</code> bằng đúng số dòng — không ca nào phải chặn riêng bằng một <code>if</code> ở đầu hàm, chúng tự rơi ra từ vòng lặp.',
              0.5],
            ['khongsuagoc',
              'The array passed in is still the same length with the same first element after the call: the function builds new arrays rather than pushing into, splicing or sorting the one it was given.',
              'Mảng truyền vào sau lời gọi vẫn đúng số phần tử và vẫn đúng phần tử đầu: hàm dựng mảng MỚI chứ không push vào, splice hay sort chính mảng nó nhận.',
              0.3],
          ]),
        }),

        /* ── Câu 2 · chương 4 + 6.4 ───────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q2 — One JSON file in, another JSON file out (chapters 4.4 and 6.4).</b> The starter writes <code>bai-viet.json</code> for you and hands its <b>text</b> to your function. Write ' + c('dungBangTin(vanBanJson)') + ' in <code>bai2/bai.js</code>; it returns the <b>text</b> of the new file, which the starter then writes to <code>bang-tin.json</code> and reads back.</p>' +
            '<ul>' +
            '<li>Only posts with ' + c('dang === true') + ' get in. The draft has 900 views and still must not appear — a big number is not a reason.</li>' +
            '<li>Order: most views first. <b>Two posts on 300 views</b> are the reason the question exists: break the tie by the smaller <code>id</code>, so the order is fixed and not "whatever sort happened to do".</li>' +
            '<li>Each post comes out as ' + c('{ xepHang, id, tieuDe, luotXem, tag }') + ' in that order, with <code>xepHang</code> starting at 1 after sorting.</li>' +
            '<li><code>tag</code> is lower-cased and <b>de-duplicated inside one post</b>: ' + c("['css', 'CSS', 'co ban']") + ' becomes ' + c("['css', 'co ban']") + '. A post with no tag keeps an empty array.</li>' +
            '<li>The whole file is ' + c('{ capNhat, tong, bai, tag }') + ', where <code>capNhat</code> is copied from the input and <code>tag</code> counts <b>how many posts</b> use each tag — so a tag written twice in one post counts once.</li>' +
            '<li>Return the text with ' + c('JSON.stringify(x, null, 2)') + ' — the file has to be readable by a human.</li>' +
            '</ul>' +
            '<p>Two more things are graded. The input file must still hold its five posts in its original order afterwards, which rules out sorting the array you parsed in place. And calling the function twice on the same text must give the same text back, character for character — the last printed line checks it.</p>',

            '<p><b>Câu 2 — Một file JSON vào, một file JSON khác ra (bài 4.4 và 6.4).</b> Khối cho sẵn tự ghi <code>bai-viet.json</code> rồi đưa <b>văn bản</b> của nó cho hàm của bạn. Hãy viết ' + c('dungBangTin(vanBanJson)') + ' trong <code>bai2/bai.js</code>; nó trả về <b>văn bản</b> của file mới, và khối cho sẵn sẽ ghi ra <code>bang-tin.json</code> rồi đọc lại.</p>' +
            '<ul>' +
            '<li>Chỉ bài có ' + c('dang === true') + ' được vào. Bản nháp có 900 lượt xem và vẫn không được xuất hiện — con số to không phải là một lý do.</li>' +
            '<li>Thứ tự: nhiều lượt xem trước. <b>Hai bài cùng 300 lượt</b> chính là lý do câu này tồn tại: phá hoà bằng <code>id</code> nhỏ hơn, để thứ tự là cố định chứ không phải "sort làm sao thì ra vậy".</li>' +
            '<li>Mỗi bài ra dưới dạng ' + c('{ xepHang, id, tieuDe, luotXem, tag }') + ' đúng thứ tự đó, với <code>xepHang</code> bắt đầu từ 1 SAU khi đã sắp xếp.</li>' +
            '<li><code>tag</code> được hạ chữ thường và <b>bỏ trùng trong cùng một bài</b>: ' + c("['css', 'CSS', 'co ban']") + ' thành ' + c("['css', 'co ban']") + '. Bài không có tag nào thì giữ một mảng rỗng.</li>' +
            '<li>Cả file là ' + c('{ capNhat, tong, bai, tag }') + ', trong đó <code>capNhat</code> chép từ đầu vào và <code>tag</code> đếm <b>bao nhiêu BÀI</b> dùng mỗi tag — nên một tag viết hai lần trong một bài chỉ tính một.</li>' +
            '<li>Trả về văn bản bằng ' + c('JSON.stringify(x, null, 2)') + ' — file phải đọc được bằng mắt người.</li>' +
            '</ul>' +
            '<p>Có thêm hai thứ bị chấm. File đầu vào sau đó vẫn phải còn đủ năm bài theo đúng thứ tự cũ, tức là không được sort ngay trên mảng vừa parse ra. Và gọi hàm hai lần trên cùng một văn bản phải trả về văn bản giống hệt, từng ký tự — dòng in cuối cùng kiểm đúng điều đó.</p>',
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const fs = require('node:fs');\n" +
            "\n" +
            "const FILE_VAO = __dirname + '/bai-viet.json';\n" +
            "const FILE_RA = __dirname + '/bang-tin.json';\n" +
            "\n" +
            "fs.writeFileSync(FILE_VAO, JSON.stringify({\n" +
            "  capNhat: '2026-03-01',\n" +
            "  baiViet: [\n" +
            "    { id: 4, tieuDe: 'Hoc CSS tu dau',    luotXem: 120, dang: true,  tag: ['css', 'CSS', 'co ban'] },\n" +
            "    { id: 1, tieuDe: 'Hoc HTML tu dau',   luotXem: 300, dang: true,  tag: ['html', 'co ban'] },\n" +
            "    { id: 7, tieuDe: 'Ban nhap chua xong', luotXem: 900, dang: false, tag: ['html'] },\n" +
            "    { id: 2, tieuDe: 'JavaScript co ban', luotXem: 300, dang: true,  tag: ['js'] },\n" +
            "    { id: 9, tieuDe: 'Ghi chu ngan',      luotXem: 0,   dang: true,  tag: [] },\n" +
            "  ],\n" +
            "}, null, 2), 'utf8');\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function dungBangTin(vanBanJson) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const vanBan = fs.readFileSync(FILE_VAO, 'utf8');\n" +
            "fs.writeFileSync(FILE_RA, dungBangTin(vanBan), 'utf8');\n" +
            "\n" +
            "const ra = JSON.parse(fs.readFileSync(FILE_RA, 'utf8'));\n" +
            "console.log(`capNhat=${ra.capNhat} tong=${ra.tong}`);\n" +
            "for (const b of ra.bai) console.log(`#${b.xepHang} id=${b.id} xem=${b.luotXem} tag=[${b.tag.join(',')}] ${b.tieuDe}`);\n" +
            "console.log('tag=' + JSON.stringify(ra.tag));\n" +
            "\n" +
            "const goc = JSON.parse(fs.readFileSync(FILE_VAO, 'utf8'));\n" +
            "console.log('file vao con nguyen: ' + (goc.baiViet.length === 5 && goc.baiViet[0].id === 4));\n" +
            "console.log('doc lai lan 2 giong het: ' + (fs.readFileSync(FILE_RA, 'utf8') === dungBangTin(vanBan)));\n" +
            "\n" +
            "fs.unlinkSync(FILE_VAO);\n" +
            "fs.unlinkSync(FILE_RA);\n" +
            "",
          expectedOutput:
            "capNhat=2026-03-01 tong=4\n" +
            "#1 id=1 xem=300 tag=[html,co ban] Hoc HTML tu dau\n" +
            "#2 id=2 xem=300 tag=[js] JavaScript co ban\n" +
            "#3 id=4 xem=120 tag=[css,co ban] Hoc CSS tu dau\n" +
            "#4 id=9 xem=0 tag=[] Ghi chu ngan\n" +
            "tag={\"html\":1,\"co ban\":2,\"js\":1,\"css\":1}\n" +
            "file vao con nguyen: true\n" +
            "doc lai lan 2 giong het: true",
          sampleSolution:
            "function dungBangTin(vanBanJson) {\n" +
            "  const du = JSON.parse(vanBanJson);\n" +
            "\n" +
            "  const daDang = du.baiViet.filter((b) => b.dang === true);\n" +
            "\n" +
            "  const daSap = daDang.slice().sort((a, b) => {\n" +
            "    if (b.luotXem !== a.luotXem) return b.luotXem - a.luotXem;\n" +
            "    return a.id - b.id;\n" +
            "  });\n" +
            "\n" +
            "  const bai = daSap.map((b, i) => {\n" +
            "    const tag = [];\n" +
            "    for (const t of b.tag) {\n" +
            "      const thuong = t.toLowerCase();\n" +
            "      if (tag.filter((x) => x === thuong).length === 0) tag.push(thuong);\n" +
            "    }\n" +
            "    return { xepHang: i + 1, id: b.id, tieuDe: b.tieuDe, luotXem: b.luotXem, tag: tag };\n" +
            "  });\n" +
            "\n" +
            "  const dem = {};\n" +
            "  for (const b of bai) {\n" +
            "    for (const t of b.tag) {\n" +
            "      dem[t] = (dem[t] === undefined ? 0 : dem[t]) + 1;\n" +
            "    }\n" +
            "  }\n" +
            "\n" +
            "  return JSON.stringify({ capNhat: du.capNhat, tong: bai.length, bai: bai, tag: dem }, null, 2);\n" +
            "}\n" +
            "",
          rubric: rubric([
            ['locvasap',
              'The draft is filtered out by <code>dang</code> and not by its view count, and the two posts tied on 300 views come out id 1 before id 2 because the compare function falls through to the id — not by luck.',
              'Bản nháp bị loại theo <code>dang</code> chứ không theo số lượt xem, và hai bài hoà 300 lượt ra id 1 trước id 2 vì hàm so sánh có nhánh rơi xuống <code>id</code> — chứ không phải nhờ may.',
              0.6],
            ['tagbotrung',
              'Tags are lower-cased and de-duplicated <em>within a post</em>, so <code>css</code> counts 1 and <code>co ban</code> counts 2; the post with no tag keeps <code>[]</code> instead of disappearing or becoming <code>null</code>.',
              'Tag được hạ chữ thường và bỏ trùng <em>trong phạm vi một bài</em>, nên <code>css</code> đếm 1 còn <code>co ban</code> đếm 2; bài không có tag nào giữ <code>[]</code> chứ không biến mất và cũng không thành <code>null</code>.',
              0.5],
            ['hinhdang',
              'The output object has exactly the four keys asked for, each post carries <code>xepHang</code> numbered from 1 after sorting, and the text is produced with the two-space indent so the file is readable.',
              'Object kết quả có đúng bốn khoá đề yêu cầu, mỗi bài mang <code>xepHang</code> đánh số từ 1 sau khi sắp xếp, và văn bản được sinh ra với thụt lề hai dấu cách để file đọc được.',
              0.5],
            ['khongdungdaugoc',
              'The parsed array is copied before being sorted, so the input file still lists its five posts starting at id 4; running the function a second time on the same text returns an identical string.',
              'Mảng vừa parse được chép ra trước khi sắp xếp, nên file đầu vào vẫn liệt kê năm bài bắt đầu từ id 4; chạy hàm lần thứ hai trên cùng văn bản trả về đúng một chuỗi giống hệt.',
              0.4],
          ]),
        }),

        /* ── Câu 3 · chương 6 (+ 5) ───────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q3 — Route the request, and answer with the right number (chapter 6).</b> The starter runs a real HTTP server on a port the OS picks, then calls itself thirteen times and prints the status code, the <code>Location</code> header and the body. All you write is ' + c('dinhTuyen(yeuCau)') + ' — a plain function, no server code — where ' + c('yeuCau = { method, duongDan, truyVan, than }') + ' and you return ' + c('{ ma, than, header }') + ' (<code>header</code> optional).</p>' +
            '<ul>' +
            '<li>' + c('GET /api/ghi-chu') + ' → <b>200</b> with the whole list. With ' + c('?xong=true') + ' or ' + c('?xong=false') + ', only the matching notes. Remember chapter 6.5: a query string always arrives as <b>text</b>, so <code>truyVan.xong</code> is the string <code>"true"</code>, never the boolean. Any other value → <b>400</b>.</li>' +
            '<li>' + c('GET /api/ghi-chu/2') + ' → <b>200</b> with that one note; an id that does not exist → <b>404</b>; ' + c('/api/ghi-chu/abc') + ' → <b>400</b>, because ' + c('Number("abc")') + ' is <code>NaN</code> and a request that cannot even be understood is not a missing note.</li>' +
            '<li>' + c('POST /api/ghi-chu') + ' with ' + c('{ "tieuDe": "Hoc Git" }') + ' → <b>201</b>, the created note as the body, and a <code>Location</code> header pointing at it. Missing or empty <code>tieuDe</code> → <b>400</b>. A title that already exists, ignoring case → <b>409</b>, the code chapter 6.3 gives to "this clashes with what is already there".</li>' +
            '<li>' + c('DELETE /api/ghi-chu/2') + ' → <b>204</b> with <b>no body at all</b>; deleting it again → <b>404</b>.</li>' +
            '<li>Anything else → <b>404</b>.</li>' +
            '</ul>' +
            '<p>The list lives in <code>GHI_CHU</code>, declared with <code>let</code> on purpose: build a new array with <code>filter</code> to delete rather than reaching for a method you have not been taught. Three traps are being graded — answering 404 where the request was malformed (<code>abc</code>), answering 200 with an error inside the body (chapter 6.3 says never), and comparing <code>truyVan.xong</code> to a boolean, which silently matches nothing at all.</p>',

            '<p><b>Câu 3 — Định tuyến yêu cầu, và trả lời bằng đúng con số (chương 6).</b> Khối cho sẵn dựng một máy chủ HTTP thật trên cổng do hệ điều hành cấp, rồi tự gọi chính nó mười ba lượt và in ra mã trạng thái, header <code>Location</code> và phần thân. Thứ bạn viết chỉ là ' + c('dinhTuyen(yeuCau)') + ' — một hàm thuần, không có dòng mã máy chủ nào — với ' + c('yeuCau = { method, duongDan, truyVan, than }') + ' và trả về ' + c('{ ma, than, header }') + ' (<code>header</code> không bắt buộc).</p>' +
            '<ul>' +
            '<li>' + c('GET /api/ghi-chu') + ' → <b>200</b> kèm cả danh sách. Có ' + c('?xong=true') + ' hoặc ' + c('?xong=false') + ' thì chỉ những ghi chú khớp. Nhớ bài 6.5: query string LUÔN tới nơi dưới dạng <b>chữ</b>, nên <code>truyVan.xong</code> là chuỗi <code>"true"</code>, không bao giờ là boolean. Giá trị khác → <b>400</b>.</li>' +
            '<li>' + c('GET /api/ghi-chu/2') + ' → <b>200</b> kèm đúng ghi chú đó; id không tồn tại → <b>404</b>; ' + c('/api/ghi-chu/abc') + ' → <b>400</b>, vì ' + c('Number("abc")') + ' là <code>NaN</code> và một yêu cầu còn không hiểu nổi thì không phải là một ghi chú bị thiếu.</li>' +
            '<li>' + c('POST /api/ghi-chu') + ' với ' + c('{ "tieuDe": "Hoc Git" }') + ' → <b>201</b>, thân là ghi chú vừa tạo, kèm header <code>Location</code> trỏ tới nó. Thiếu <code>tieuDe</code> hoặc rỗng → <b>400</b>. Tiêu đề đã có rồi, không phân biệt hoa thường → <b>409</b>, đúng cái mã mà bài 6.3 dành cho "cái này đụng với thứ đang có".</li>' +
            '<li>' + c('DELETE /api/ghi-chu/2') + ' → <b>204</b> và <b>không có thân nào cả</b>; xoá lần nữa → <b>404</b>.</li>' +
            '<li>Mọi thứ khác → <b>404</b>.</li>' +
            '</ul>' +
            '<p>Danh sách nằm ở <code>GHI_CHU</code>, cố ý khai bằng <code>let</code>: hãy dựng một mảng mới bằng <code>filter</code> để xoá, thay vì với tay tới một phương thức chưa được dạy. Có ba cái bẫy đang bị chấm — trả 404 cho một yêu cầu viết sai (<code>abc</code>), trả 200 rồi nhét lỗi vào trong thân (bài 6.3 nói: đừng bao giờ), và so <code>truyVan.xong</code> với một boolean, thứ âm thầm không khớp với gì hết.</p>',
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const http = require('node:http');\n" +
            "\n" +
            "let GHI_CHU = [\n" +
            "  { id: 1, tieuDe: 'Hoc HTML', xong: true },\n" +
            "  { id: 2, tieuDe: 'Hoc CSS', xong: false },\n" +
            "  { id: 3, tieuDe: 'Hoc SQL', xong: false },\n" +
            "];\n" +
            "const TIEN_TO = '/api/ghi-chu/';\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function dinhTuyen(yeuCau) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const may = http.createServer((req, res) => {\n" +
            "  let tho = '';\n" +
            "  req.on('data', (mieng) => { tho = tho + mieng; });\n" +
            "  req.on('end', () => {\n" +
            "    const url = new URL(req.url, 'http://x');\n" +
            "    const truyVan = {};\n" +
            "    for (const cap of url.searchParams) truyVan[cap[0]] = cap[1];\n" +
            "\n" +
            "    let than = null;\n" +
            "    if (tho !== '') { try { than = JSON.parse(tho); } catch (e) { than = null; } }\n" +
            "\n" +
            "    const kq = dinhTuyen({ method: req.method, duongDan: url.pathname, truyVan: truyVan, than: than });\n" +
            "    const header = Object.assign({}, kq.header);\n" +
            "    if (kq.ma === 204) { res.writeHead(204, header); return res.end(); }\n" +
            "    header['Content-Type'] = 'application/json; charset=utf-8';\n" +
            "    res.writeHead(kq.ma, header);\n" +
            "    res.end(JSON.stringify(kq.than));\n" +
            "  });\n" +
            "});\n" +
            "\n" +
            "const CA = [\n" +
            "  ['GET', '/api/ghi-chu', null],\n" +
            "  ['GET', '/api/ghi-chu?xong=true', null],\n" +
            "  ['GET', '/api/ghi-chu?xong=1', null],\n" +
            "  ['GET', '/api/ghi-chu/2', null],\n" +
            "  ['GET', '/api/ghi-chu/99', null],\n" +
            "  ['GET', '/api/ghi-chu/abc', null],\n" +
            "  ['POST', '/api/ghi-chu', { tieuDe: 'Hoc Git' }],\n" +
            "  ['POST', '/api/ghi-chu', { tieuDe: 'hoc git' }],\n" +
            "  ['POST', '/api/ghi-chu', { xong: true }],\n" +
            "  ['DELETE', '/api/ghi-chu/2', null],\n" +
            "  ['DELETE', '/api/ghi-chu/2', null],\n" +
            "  ['GET', '/api/lung-tung', null],\n" +
            "  ['GET', '/api/ghi-chu', null],\n" +
            "];\n" +
            "\n" +
            "may.listen(0, async () => {\n" +
            "  const goc = 'http://127.0.0.1:' + may.address().port;\n" +
            "  for (const ca of CA) {\n" +
            "    const r = await fetch(goc + ca[1], {\n" +
            "      method: ca[0],\n" +
            "      headers: ca[2] === null ? {} : { 'Content-Type': 'application/json' },\n" +
            "      body: ca[2] === null ? undefined : JSON.stringify(ca[2]),\n" +
            "    });\n" +
            "    const chu = await r.text();\n" +
            "    const loc = r.headers.get('location');\n" +
            "    console.log(`${ca[0]} ${ca[1]} -> ${r.status} loc=${loc === null ? '-' : loc} | ${chu === '' ? '(than rong)' : chu}`);\n" +
            "  }\n" +
            "  may.closeAllConnections();\n" +
            "  may.close();\n" +
            "});\n" +
            "",
          expectedOutput:
            "GET /api/ghi-chu -> 200 loc=- | [{\"id\":1,\"tieuDe\":\"Hoc HTML\",\"xong\":true},{\"id\":2,\"tieuDe\":\"Hoc CSS\",\"xong\":false},{\"id\":3,\"tieuDe\":\"Hoc SQL\",\"xong\":false}]\n" +
            "GET /api/ghi-chu?xong=true -> 200 loc=- | [{\"id\":1,\"tieuDe\":\"Hoc HTML\",\"xong\":true}]\n" +
            "GET /api/ghi-chu?xong=1 -> 400 loc=- | {\"loi\":\"xong phai la true hoac false\"}\n" +
            "GET /api/ghi-chu/2 -> 200 loc=- | {\"id\":2,\"tieuDe\":\"Hoc CSS\",\"xong\":false}\n" +
            "GET /api/ghi-chu/99 -> 404 loc=- | {\"loi\":\"khong tim thay ghi chu\"}\n" +
            "GET /api/ghi-chu/abc -> 400 loc=- | {\"loi\":\"id phai la so\"}\n" +
            "POST /api/ghi-chu -> 201 loc=/api/ghi-chu/4 | {\"id\":4,\"tieuDe\":\"Hoc Git\",\"xong\":false}\n" +
            "POST /api/ghi-chu -> 409 loc=- | {\"loi\":\"tieuDe da ton tai\"}\n" +
            "POST /api/ghi-chu -> 400 loc=- | {\"loi\":\"thieu tieuDe\"}\n" +
            "DELETE /api/ghi-chu/2 -> 204 loc=- | (than rong)\n" +
            "DELETE /api/ghi-chu/2 -> 404 loc=- | {\"loi\":\"khong tim thay ghi chu\"}\n" +
            "GET /api/lung-tung -> 404 loc=- | {\"loi\":\"khong co duong dan nay\"}\n" +
            "GET /api/ghi-chu -> 200 loc=- | [{\"id\":1,\"tieuDe\":\"Hoc HTML\",\"xong\":true},{\"id\":3,\"tieuDe\":\"Hoc SQL\",\"xong\":false},{\"id\":4,\"tieuDe\":\"Hoc Git\",\"xong\":false}]",
          sampleSolution:
            "function dinhTuyen(yeuCau) {\n" +
            "  const method = yeuCau.method;\n" +
            "  const duongDan = yeuCau.duongDan;\n" +
            "\n" +
            "  if (duongDan === '/api/ghi-chu') {\n" +
            "    if (method === 'GET') {\n" +
            "      const loc = yeuCau.truyVan.xong;\n" +
            "      if (loc === undefined) return { ma: 200, than: GHI_CHU };\n" +
            "      if (loc !== 'true' && loc !== 'false') {\n" +
            "        return { ma: 400, than: { loi: 'xong phai la true hoac false' } };\n" +
            "      }\n" +
            "      return { ma: 200, than: GHI_CHU.filter((g) => g.xong === (loc === 'true')) };\n" +
            "    }\n" +
            "\n" +
            "    if (method === 'POST') {\n" +
            "      const than = yeuCau.than;\n" +
            "      if (than === null || typeof than.tieuDe !== 'string' || than.tieuDe === '') {\n" +
            "        return { ma: 400, than: { loi: 'thieu tieuDe' } };\n" +
            "      }\n" +
            "      const trung = GHI_CHU.filter((g) => g.tieuDe.toLowerCase() === than.tieuDe.toLowerCase());\n" +
            "      if (trung.length > 0) return { ma: 409, than: { loi: 'tieuDe da ton tai' } };\n" +
            "\n" +
            "      const moi = { id: GHI_CHU.length + 1, tieuDe: than.tieuDe, xong: false };\n" +
            "      GHI_CHU.push(moi);\n" +
            "      return { ma: 201, than: moi, header: { Location: TIEN_TO + moi.id } };\n" +
            "    }\n" +
            "  }\n" +
            "\n" +
            "  if (duongDan.slice(0, TIEN_TO.length) === TIEN_TO) {\n" +
            "    const phanId = duongDan.slice(TIEN_TO.length);\n" +
            "    const id = Number(phanId);\n" +
            "    if (phanId === '' || Number.isNaN(id)) {\n" +
            "      return { ma: 400, than: { loi: 'id phai la so' } };\n" +
            "    }\n" +
            "    const khop = GHI_CHU.filter((g) => g.id === id);\n" +
            "\n" +
            "    if (method === 'GET') {\n" +
            "      if (khop.length === 0) return { ma: 404, than: { loi: 'khong tim thay ghi chu' } };\n" +
            "      return { ma: 200, than: khop[0] };\n" +
            "    }\n" +
            "\n" +
            "    if (method === 'DELETE') {\n" +
            "      if (khop.length === 0) return { ma: 404, than: { loi: 'khong tim thay ghi chu' } };\n" +
            "      GHI_CHU = GHI_CHU.filter((g) => g.id !== id);\n" +
            "      return { ma: 204 };\n" +
            "    }\n" +
            "  }\n" +
            "\n" +
            "  return { ma: 404, than: { loi: 'khong co duong dan nay' } };\n" +
            "}\n" +
            "",
          rubric: rubric([
            ['machinh',
              'The happy paths answer with the codes chapter 6.3 assigns: 200 for both reads, 201 for the create with a <code>Location</code> header naming the new note, and 204 for the delete <b>with an empty body</b> — not 200, and not 204 with JSON in it.',
              'Các đường đi thuận trả đúng mã mà bài 6.3 quy định: 200 cho cả hai phép đọc, 201 cho phép tạo kèm header <code>Location</code> chỉ đúng ghi chú mới, và 204 cho phép xoá <b>với thân rỗng</b> — không phải 200, và cũng không phải 204 mà bên trong vẫn có JSON.',
              0.6],
            ['400va404',
              '<code>/api/ghi-chu/abc</code> is 400 while <code>/api/ghi-chu/99</code> is 404: a request that cannot be parsed is separated from a resource that is not there. <code>?xong=1</code> is 400 for the same reason.',
              '<code>/api/ghi-chu/abc</code> ra 400 còn <code>/api/ghi-chu/99</code> ra 404: một yêu cầu không đọc nổi được tách khỏi một tài nguyên không có ở đó. <code>?xong=1</code> ra 400 vì cùng lý do ấy.',
              0.5],
            ['409',
              'Posting a title that already exists answers 409 and does not create a second note — and the comparison ignores case, so <code>"hoc git"</code> collides with <code>"Hoc Git"</code>; a missing or empty <code>tieuDe</code> answers 400, a different failure from a clash.',
              'Gửi một tiêu đề đã tồn tại trả 409 và KHÔNG tạo thêm ghi chú thứ hai — và phép so sánh bỏ qua hoa thường, nên <code>"hoc git"</code> đụng với <code>"Hoc Git"</code>; thiếu <code>tieuDe</code> hoặc rỗng thì trả 400, một kiểu hỏng khác với đụng độ.',
              0.5],
            ['truyvanlachu',
              'The query string is compared as text (<code>"true"</code> / <code>"false"</code>) and turned into a boolean only when filtering, and the delete rebuilds the array with <code>filter</code> so the final listing shows notes 1, 3 and 4.',
              'Query string được so sánh dưới dạng chữ (<code>"true"</code> / <code>"false"</code>) và chỉ được đổi thành boolean ở lúc lọc, còn phép xoá dựng lại mảng bằng <code>filter</code> nên lần liệt kê cuối hiện ra các ghi chú 1, 3 và 4.',
              0.4],
          ]),
        }),

        /* ── Câu 4 · chương 2 (+ 4) ───────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q4 — Write the checker that would have caught your own pages (chapter 2.3 and 2.5).</b> The starter gives you ' + c('docThe(html)') + ', which turns a page into an array of ' + c('{ ten, dong, dongThe, thuocTinh }') + ', and ' + c('bacTieuDe(ten)') + ', which turns <code>"h3"</code> into <code>3</code> and anything else into <code>0</code>. Write ' + c('kiemTraTrang(html)') + ' in <code>bai4/bai.js</code>, returning an array of problem strings — empty means the page passes. Look only at <b>opening</b> tags.</p>' +
            '<ul>' +
            '<li>' + c('MAIN=<n>') + ' when the page does not have exactly one <code>&lt;main&gt;</code>.</li>' +
            '<li>' + c('H1=<n>') + ' when it does not have exactly one <code>&lt;h1&gt;</code>.</li>' +
            '<li>' + c('THIEU_ALT@<dòng>') + ' for an <code>&lt;img&gt;</code> with <b>no <code>alt</code> attribute at all</b>. Careful — lesson 2.5 is explicit that ' + c('alt=""') + ' is the <em>correct</em> way to mark a decorative image, so it must not be reported.</li>' +
            '<li>' + c('NHAY_BAC h<a>-><b>@<dòng>') + ' when a heading jumps more than one level down from the previous heading (h1 then h3). Going back <em>up</em> is fine: h3 then h2 is not a problem.</li>' +
            '<li>' + c('O_KHONG_NHAN id=<id>@<dòng>') + ' for an <code>&lt;input&gt;</code> whose <code>id</code> no <code>&lt;label for&gt;</code> points at, and ' + c('NHAN_MO_COI for=<for>@<dòng>') + ' for a <code>&lt;label&gt;</code> pointing at an <code>id</code> that no input has. Lesson 2.5: the pair is what makes clicking the label focus the field.</li>' +
            '</ul>' +
            '<p>The four pages check four different things: one is clean and must print <code>DAT</code>, one hides two missing <code>alt</code>s <em>around</em> a correct <code>alt=""</code>, one jumps levels twice, and the last is missing its <code>&lt;main&gt;</code>, has two <code>&lt;h1&gt;</code> and a label/input pair that miss each other. The order of the problems matters: the checks run in the order listed above. An empty string must return ' + c('["MAIN=0","H1=0"]') + ' rather than crash.</p>',

            '<p><b>Câu 4 — Viết cái bộ kiểm mà lẽ ra đã bắt được trang của chính bạn (bài 2.3 và 2.5).</b> Khối cho sẵn đưa bạn ' + c('docThe(html)') + ', thứ biến một trang thành mảng các ' + c('{ ten, dong, dongThe, thuocTinh }') + ', và ' + c('bacTieuDe(ten)') + ', thứ biến <code>"h3"</code> thành <code>3</code> còn mọi thứ khác thành <code>0</code>. Hãy viết ' + c('kiemTraTrang(html)') + ' trong <code>bai4/bai.js</code>, trả về một mảng chuỗi mô tả lỗi — rỗng nghĩa là trang đạt. Chỉ xét thẻ <b>MỞ</b>.</p>' +
            '<ul>' +
            '<li>' + c('MAIN=<n>') + ' khi trang không có đúng một <code>&lt;main&gt;</code>.</li>' +
            '<li>' + c('H1=<n>') + ' khi trang không có đúng một <code>&lt;h1&gt;</code>.</li>' +
            '<li>' + c('THIEU_ALT@<dòng>') + ' cho một <code>&lt;img&gt;</code> <b>không có thuộc tính <code>alt</code> nào cả</b>. Cẩn thận — bài 2.5 nói thẳng rằng ' + c('alt=""') + ' là cách <em>ĐÚNG</em> để đánh dấu một ảnh trang trí, nên nó không được báo lỗi.</li>' +
            '<li>' + c('NHAY_BAC h<a>-><b>@<dòng>') + ' khi một tiêu đề nhảy xuống quá một bậc so với tiêu đề trước đó (h1 rồi h3). Đi ngược <em>LÊN</em> thì không sao: h3 rồi h2 không phải lỗi.</li>' +
            '<li>' + c('O_KHONG_NHAN id=<id>@<dòng>') + ' cho một <code>&lt;input&gt;</code> mà <code>id</code> của nó không được <code>&lt;label for&gt;</code> nào trỏ tới, và ' + c('NHAN_MO_COI for=<for>@<dòng>') + ' cho một <code>&lt;label&gt;</code> trỏ tới một <code>id</code> mà không ô nhập nào có. Bài 2.5: chính cặp này làm cho bấm vào nhãn thì con trỏ nhảy vào ô.</li>' +
            '</ul>' +
            '<p>Bốn trang kiểm bốn thứ khác nhau: một trang sạch và phải in <code>DAT</code>, một trang giấu hai chỗ thiếu <code>alt</code> <em>ở hai bên</em> một <code>alt=""</code> hoàn toàn đúng, một trang nhảy bậc hai lần, và trang cuối thì mất <code>&lt;main&gt;</code>, có hai <code>&lt;h1&gt;</code> và một cặp nhãn/ô nhập trỏ trượt nhau. Thứ tự các lỗi có tính: các phép kiểm chạy theo đúng thứ tự liệt kê ở trên. Chuỗi rỗng phải trả về ' + c('["MAIN=0","H1=0"]') + ' chứ không được vỡ.</p>',
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// docThe(html) — bộ tách thẻ nhỏ, đề cho sẵn. Trả về MỘT mảng, mỗi thẻ là\n" +
            "// { ten, dong, dongThe, thuocTinh }:\n" +
            "//   ten       tên thẻ, đã hạ chữ thường  ('img', 'h2', 'label'…)\n" +
            "//   dong      số dòng của thẻ trong chuỗi HTML, đếm từ 1\n" +
            "//   dongThe   true nếu là thẻ ĐÓNG (</main>), false nếu là thẻ MỞ\n" +
            "//   thuocTinh object các thuộc tính, ví dụ { src: 'a.png', alt: '' }\n" +
            "function docThe(html) {\n" +
            "  const the = [];\n" +
            "  let i = 0;\n" +
            "  let dong = 1;\n" +
            "  while (i < html.length) {\n" +
            "    if (html[i] === '\\n') { dong = dong + 1; i = i + 1; continue; }\n" +
            "    if (html[i] !== '<') { i = i + 1; continue; }\n" +
            "    const het = html.indexOf('>', i);\n" +
            "    if (het < 0) break;\n" +
            "    let noi = html.slice(i + 1, het);\n" +
            "    i = het + 1;\n" +
            "    if (noi.slice(0, 1) === '!' || noi.slice(0, 1) === '?') continue;\n" +
            "    const dongThe = noi.slice(0, 1) === '/';\n" +
            "    if (dongThe) noi = noi.slice(1);\n" +
            "    if (noi.slice(-1) === '/') noi = noi.slice(0, -1);\n" +
            "    const cach = noi.indexOf(' ');\n" +
            "    const ten = (cach < 0 ? noi : noi.slice(0, cach)).toLowerCase();\n" +
            "    const thuocTinh = {};\n" +
            "    const phan = cach < 0 ? '' : noi.slice(cach + 1);\n" +
            "    let j = 0;\n" +
            "    while (j < phan.length) {\n" +
            "      while (j < phan.length && phan[j] === ' ') j = j + 1;\n" +
            "      if (j >= phan.length) break;\n" +
            "      const bang = phan.indexOf('=', j);\n" +
            "      if (bang < 0) { thuocTinh[phan.slice(j).trim().toLowerCase()] = ''; break; }\n" +
            "      const nhay = phan[bang + 1];\n" +
            "      const cuoi = phan.indexOf(nhay, bang + 2);\n" +
            "      thuocTinh[phan.slice(j, bang).trim().toLowerCase()] = phan.slice(bang + 2, cuoi);\n" +
            "      j = cuoi + 1;\n" +
            "    }\n" +
            "    the.push({ ten: ten, dong: dong, dongThe: dongThe, thuocTinh: thuocTinh });\n" +
            "  }\n" +
            "  return the;\n" +
            "}\n" +
            "\n" +
            "// bacTieuDe('h3') -> 3 ; bacTieuDe('p') -> 0\n" +
            "function bacTieuDe(ten) {\n" +
            "  const bang = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };\n" +
            "  return bang[ten] === undefined ? 0 : bang[ten];\n" +
            "}\n" +
            "\n" +
            "const TRANG = [\n" +
            "  ['dat.html',\n" +
            "    '<main>\\n' +\n" +
            "    '  <h1>Blog cua toi</h1>\\n' +\n" +
            "    '  <h2>Bai moi nhat</h2>\\n' +\n" +
            "    '  <img src=\"bia.png\" alt=\"Anh bia cua bai viet\">\\n' +\n" +
            "    '  <img src=\"duong-ke.png\" alt=\"\">\\n' +\n" +
            "    '  <form action=\"/dang-ky\" method=\"post\">\\n' +\n" +
            "    '    <label for=\"email\">Email</label>\\n' +\n" +
            "    '    <input id=\"email\" name=\"email\" type=\"email\">\\n' +\n" +
            "    '  </form>\\n' +\n" +
            "    '</main>\\n'],\n" +
            "  ['thieu-alt.html',\n" +
            "    '<main>\\n' +\n" +
            "    '  <h1>Thu vien anh</h1>\\n' +\n" +
            "    '  <img src=\"mot.png\">\\n' +\n" +
            "    '  <img src=\"hai.png\" alt=\"Anh hai\">\\n' +\n" +
            "    '  <img src=\"ba.png\">\\n' +\n" +
            "    '</main>\\n'],\n" +
            "  ['nhay-bac.html',\n" +
            "    '<main>\\n' +\n" +
            "    '  <h1>Huong dan</h1>\\n' +\n" +
            "    '  <h3>Buoc mot</h3>\\n' +\n" +
            "    '  <h2>Phan hai</h2>\\n' +\n" +
            "    '  <h4>Chi tiet</h4>\\n' +\n" +
            "    '</main>\\n'],\n" +
            "  ['loan.html',\n" +
            "    '<div>\\n' +\n" +
            "    '  <h1>Tieu de mot</h1>\\n' +\n" +
            "    '  <h1>Tieu de hai</h1>\\n' +\n" +
            "    '  <form action=\"/tim\" method=\"get\">\\n' +\n" +
            "    '    <input id=\"tu-khoa\" name=\"q\" type=\"text\">\\n' +\n" +
            "    '    <label for=\"tuoi\">Tuoi</label>\\n' +\n" +
            "    '  </form>\\n' +\n" +
            "    '</div>\\n'],\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function kiemTraTrang(html) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "for (const trang of TRANG) {\n" +
            "  const loi = kiemTraTrang(trang[1]);\n" +
            "  console.log(`${trang[0]} -> ${loi.length === 0 ? 'DAT' : loi.length + ' loi'}`);\n" +
            "  for (const l of loi) console.log('   * ' + l);\n" +
            "}\n" +
            "console.log('trang rong -> ' + JSON.stringify(kiemTraTrang('')));\n" +
            "",
          expectedOutput:
            "dat.html -> DAT\n" +
            "thieu-alt.html -> 2 loi\n" +
            "   * THIEU_ALT@3\n" +
            "   * THIEU_ALT@5\n" +
            "nhay-bac.html -> 2 loi\n" +
            "   * NHAY_BAC h1->h3@3\n" +
            "   * NHAY_BAC h2->h4@5\n" +
            "loan.html -> 4 loi\n" +
            "   * MAIN=0\n" +
            "   * H1=2\n" +
            "   * O_KHONG_NHAN id=tu-khoa@5\n" +
            "   * NHAN_MO_COI for=tuoi@6\n" +
            "trang rong -> [\"MAIN=0\",\"H1=0\"]",
          sampleSolution:
            "function kiemTraTrang(html) {\n" +
            "  const the = docThe(html).filter((t) => t.dongThe === false);\n" +
            "  const loi = [];\n" +
            "\n" +
            "  const soMain = the.filter((t) => t.ten === 'main').length;\n" +
            "  if (soMain !== 1) loi.push('MAIN=' + soMain);\n" +
            "\n" +
            "  const soH1 = the.filter((t) => t.ten === 'h1').length;\n" +
            "  if (soH1 !== 1) loi.push('H1=' + soH1);\n" +
            "\n" +
            "  for (const t of the) {\n" +
            "    if (t.ten === 'img' && t.thuocTinh.alt === undefined) loi.push('THIEU_ALT@' + t.dong);\n" +
            "  }\n" +
            "\n" +
            "  let truoc = 0;\n" +
            "  for (const t of the) {\n" +
            "    const bac = bacTieuDe(t.ten);\n" +
            "    if (bac === 0) continue;\n" +
            "    if (truoc !== 0 && bac > truoc + 1) loi.push('NHAY_BAC h' + truoc + '->h' + bac + '@' + t.dong);\n" +
            "    truoc = bac;\n" +
            "  }\n" +
            "\n" +
            "  const cacId = the.filter((t) => t.ten === 'input').map((t) => t.thuocTinh.id);\n" +
            "  const cacFor = the.filter((t) => t.ten === 'label').map((t) => t.thuocTinh.for);\n" +
            "  for (const t of the) {\n" +
            "    if (t.ten === 'input' && cacFor.filter((f) => f === t.thuocTinh.id).length === 0) {\n" +
            "      loi.push('O_KHONG_NHAN id=' + (t.thuocTinh.id === undefined ? '?' : t.thuocTinh.id) + '@' + t.dong);\n" +
            "    }\n" +
            "    if (t.ten === 'label' && cacId.filter((v) => v === t.thuocTinh.for).length === 0) {\n" +
            "      loi.push('NHAN_MO_COI for=' + (t.thuocTinh.for === undefined ? '?' : t.thuocTinh.for) + '@' + t.dong);\n" +
            "    }\n" +
            "  }\n" +
            "\n" +
            "  return loi;\n" +
            "}\n" +
            "",
          rubric: rubric([
            ['altrong',
              'A missing <code>alt</code> is reported and <code>alt=""</code> is <b>not</b> — the test is whether the attribute exists (<code>undefined</code>), not whether it is truthy, which is the whole point of lesson 2.5.',
              'Thiếu <code>alt</code> thì bị báo còn <code>alt=""</code> thì <b>không</b> — phép kiểm là thuộc tính CÓ TỒN TẠI hay không (<code>undefined</code>), chứ không phải nó có "thật" hay không, và đó chính là điều bài 2.5 dạy.',
              0.6],
            ['bactieude',
              'Heading levels are compared to the previous heading, a jump of two or more is reported once per offending heading, and going back up a level is silently accepted — <code>nhay-bac.html</code> reports exactly two problems, not three.',
              'Bậc tiêu đề được so với tiêu đề LIỀN TRƯỚC, nhảy từ hai bậc trở lên thì báo một lần cho mỗi tiêu đề phạm lỗi, còn đi ngược lên một bậc thì im lặng chấp nhận — <code>nhay-bac.html</code> báo đúng hai lỗi, không phải ba.',
              0.5],
            ['nhanvao',
              'The label/input check runs in <b>both</b> directions from the collected <code>id</code> and <code>for</code> values, so <code>loan.html</code> reports the orphan input <em>and</em> the orphan label, each with its own line number.',
              'Phép kiểm nhãn/ô nhập chạy theo <b>cả hai</b> chiều từ tập <code>id</code> và tập <code>for</code> đã gom, nên <code>loan.html</code> báo cả ô nhập mồ côi <em>lẫn</em> nhãn mồ côi, mỗi cái kèm số dòng của nó.',
              0.5],
            ['demmoc',
              'Only opening tags are counted, so <code>&lt;/main&gt;</code> does not make <code>MAIN=2</code>; the empty page returns the two count problems instead of throwing; and the problems come out in the order the question lists them.',
              'Chỉ thẻ MỞ được đếm, nên <code>&lt;/main&gt;</code> không làm ra <code>MAIN=2</code>; trang rỗng trả về hai lỗi đếm chứ không ném lỗi; và các lỗi ra đúng thứ tự đề liệt kê.',
              0.4],
          ]),
        }),

        /* ── Câu 5 · chương 8 ─────────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q5 — Five SQL queries, written as JavaScript that returns the same rows (chapter 8).</b> Two tables live in the starter as arrays of objects — ' + c('hoc_vien') + ' and ' + c('bai_nop') + ', the second declared with <code>let</code>. Write the five functions in <code>bai5/bai.js</code> so that each returns exactly what the query above it would return.</p>' +
            '<ul>' +
            '<li>' + c('truyVanChon(gioiHan)') + ' — ' + c('SELECT tieu_de, diem FROM bai_nop WHERE da_cham = true ORDER BY diem DESC LIMIT <gioiHan>') + '. Each row has only those two columns, in that order.</li>' +
            '<li>' + c('truyVanNoiTrong()') + ' — ' + c('SELECT bai_nop.tieu_de, hoc_vien.ten FROM bai_nop INNER JOIN hoc_vien ON bai_nop.hoc_vien_id = hoc_vien.id') + '.</li>' +
            '<li>' + c('truyVanNoiTrai()') + ' — the same with <code>LEFT JOIN</code>. This pair is the whole lesson 8.4: one row of <code>bai_nop</code> has ' + c('hoc_vien_id = null') + ', and it is exactly what tells the two apart — <b>INNER drops it, LEFT keeps it with</b> ' + c('ten: null') + '.</li>' +
            '<li>' + c('capNhatDiem(id, diem)') + ' — ' + c('UPDATE bai_nop SET diem = <diem>, da_cham = true WHERE id = <id>') + ', returning ' + c('{ soDong }') + ', the number of rows it changed. An id that matches nothing gives <code>0</code> and is not an error.</li>' +
            '<li>' + c('xoaBaiNop(id)') + ' — ' + c('DELETE FROM bai_nop WHERE id = <id>') + ', also returning ' + c('{ soDong }') + '. Delete with <code>filter</code> — <code>bai_nop</code> is <code>let</code> for exactly this reason.</li>' +
            '</ul>' +
            '<p><b>The missing WHERE.</b> Lesson 8.3 spends a page on ' + c('DELETE FROM posts;') + ' — one forgotten line, every row gone. So both writing functions must refuse when the <code>id</code> is <code>undefined</code> or <code>null</code>: return ' + c("{ soDong: 0, loi: 'THIEU_WHERE' }") + ' and touch nothing. Note that a plain ' + c('if (!id)') + ' would <em>also</em> refuse ' + c('id = 0') + ', which is a real id — chapter 4.2, the six falsy values.</p>' +
            '<p>The last two blocks re-run two of the queries <b>after</b> the update and the delete, so a function that quietly cached its result, or that sorted the table itself instead of a copy, shows up there.</p>',

            '<p><b>Câu 5 — Năm truy vấn SQL, viết lại bằng JavaScript sao cho ra đúng những dòng ấy (chương 8).</b> Hai bảng nằm sẵn trong khối cho sẵn dưới dạng mảng các object — ' + c('hoc_vien') + ' và ' + c('bai_nop') + ', cái thứ hai khai bằng <code>let</code>. Hãy viết năm hàm trong <code>bai5/bai.js</code> sao cho mỗi hàm trả về đúng thứ mà truy vấn ghi ngay trên nó trả về.</p>' +
            '<ul>' +
            '<li>' + c('truyVanChon(gioiHan)') + ' — ' + c('SELECT tieu_de, diem FROM bai_nop WHERE da_cham = true ORDER BY diem DESC LIMIT <gioiHan>') + '. Mỗi dòng chỉ có đúng hai cột đó, theo đúng thứ tự đó.</li>' +
            '<li>' + c('truyVanNoiTrong()') + ' — ' + c('SELECT bai_nop.tieu_de, hoc_vien.ten FROM bai_nop INNER JOIN hoc_vien ON bai_nop.hoc_vien_id = hoc_vien.id') + '.</li>' +
            '<li>' + c('truyVanNoiTrai()') + ' — y hệt nhưng với <code>LEFT JOIN</code>. Cặp này chính là toàn bộ bài 8.4: một dòng của <code>bai_nop</code> có ' + c('hoc_vien_id = null') + ', và đó đúng là thứ phân biệt hai truy vấn — <b>INNER làm nó rụng, LEFT giữ nó lại với</b> ' + c('ten: null') + '.</li>' +
            '<li>' + c('capNhatDiem(id, diem)') + ' — ' + c('UPDATE bai_nop SET diem = <diem>, da_cham = true WHERE id = <id>') + ', trả về ' + c('{ soDong }') + ', tức số dòng nó đã đổi. Một id không khớp gì cho <code>0</code> và đó không phải lỗi.</li>' +
            '<li>' + c('xoaBaiNop(id)') + ' — ' + c('DELETE FROM bai_nop WHERE id = <id>') + ', cũng trả về ' + c('{ soDong }') + '. Hãy xoá bằng <code>filter</code> — <code>bai_nop</code> khai <code>let</code> đúng vì lý do này.</li>' +
            '</ul>' +
            '<p><b>Cái WHERE bị quên.</b> Bài 8.3 dành hẳn một đoạn cho ' + c('DELETE FROM posts;') + ' — quên một dòng, bay sạch cả bảng. Nên cả hai hàm GHI đều phải từ chối khi <code>id</code> là <code>undefined</code> hoặc <code>null</code>: trả về ' + c("{ soDong: 0, loi: 'THIEU_WHERE' }") + ' và không đụng vào gì cả. Lưu ý một cái ' + c('if (!id)') + ' trần trụi sẽ từ chối <em>luôn cả</em> ' + c('id = 0') + ', vốn là một id thật — bài 4.2, sáu giá trị falsy.</p>' +
            '<p>Hai khối cuối chạy lại hai truy vấn <b>SAU</b> lệnh cập nhật và lệnh xoá, nên một hàm âm thầm nhớ lại kết quả cũ, hay một hàm sắp xếp thẳng trên bảng thay vì trên bản sao, sẽ lộ ra ở đó.</p>',
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const hoc_vien = [\n" +
            "  { id: 1, ten: 'An',    lop: 'A1' },\n" +
            "  { id: 2, ten: 'Binh',  lop: 'A1' },\n" +
            "  { id: 3, ten: 'Cuong', lop: 'A2' },\n" +
            "];\n" +
            "\n" +
            "let bai_nop = [\n" +
            "  { id: 1, hoc_vien_id: 1,    tieu_de: 'Bai tap HTML', diem: 8,    da_cham: true },\n" +
            "  { id: 2, hoc_vien_id: 1,    tieu_de: 'Bai tap CSS',  diem: 6,    da_cham: true },\n" +
            "  { id: 3, hoc_vien_id: 2,    tieu_de: 'Bai tap JS',   diem: 9,    da_cham: true },\n" +
            "  { id: 4, hoc_vien_id: 2,    tieu_de: 'Ban nhap',     diem: null, da_cham: false },\n" +
            "  { id: 5, hoc_vien_id: null, tieu_de: 'Bai vo chu',   diem: 7,    da_cham: true },\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function truyVanChon(gioiHan) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function truyVanNoiTrong() {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function truyVanNoiTrai() {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function capNhatDiem(id, diem) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function xoaBaiNop(id) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const inBang = (nhan, dong) => {\n" +
            "  console.log(`${nhan} -> ${dong.length} dong`);\n" +
            "  for (const d of dong) console.log('   ' + JSON.stringify(d));\n" +
            "};\n" +
            "\n" +
            "inBang('A/SELECT..ORDER BY..LIMIT 3', truyVanChon(3));\n" +
            "inBang('B/INNER JOIN', truyVanNoiTrong());\n" +
            "inBang('C/LEFT JOIN', truyVanNoiTrai());\n" +
            "console.log('D/UPDATE id=4   ' + JSON.stringify(capNhatDiem(4, 5)));\n" +
            "console.log('D/UPDATE id=99  ' + JSON.stringify(capNhatDiem(99, 5)));\n" +
            "console.log('D/UPDATE thieu  ' + JSON.stringify(capNhatDiem(undefined, 5)));\n" +
            "console.log('E/DELETE id=2   ' + JSON.stringify(xoaBaiNop(2)));\n" +
            "console.log('E/DELETE id=2   ' + JSON.stringify(xoaBaiNop(2)));\n" +
            "console.log('E/DELETE thieu  ' + JSON.stringify(xoaBaiNop(null)));\n" +
            "console.log('con lai: ' + bai_nop.map((b) => b.id).join(','));\n" +
            "inBang('A/chay lai sau khi sua', truyVanChon(5));\n" +
            "inBang('C/chay lai sau khi sua', truyVanNoiTrai());\n" +
            "",
          expectedOutput:
            "A/SELECT..ORDER BY..LIMIT 3 -> 3 dong\n" +
            "   {\"tieu_de\":\"Bai tap JS\",\"diem\":9}\n" +
            "   {\"tieu_de\":\"Bai tap HTML\",\"diem\":8}\n" +
            "   {\"tieu_de\":\"Bai vo chu\",\"diem\":7}\n" +
            "B/INNER JOIN -> 4 dong\n" +
            "   {\"tieu_de\":\"Bai tap HTML\",\"ten\":\"An\"}\n" +
            "   {\"tieu_de\":\"Bai tap CSS\",\"ten\":\"An\"}\n" +
            "   {\"tieu_de\":\"Bai tap JS\",\"ten\":\"Binh\"}\n" +
            "   {\"tieu_de\":\"Ban nhap\",\"ten\":\"Binh\"}\n" +
            "C/LEFT JOIN -> 5 dong\n" +
            "   {\"tieu_de\":\"Bai tap HTML\",\"ten\":\"An\"}\n" +
            "   {\"tieu_de\":\"Bai tap CSS\",\"ten\":\"An\"}\n" +
            "   {\"tieu_de\":\"Bai tap JS\",\"ten\":\"Binh\"}\n" +
            "   {\"tieu_de\":\"Ban nhap\",\"ten\":\"Binh\"}\n" +
            "   {\"tieu_de\":\"Bai vo chu\",\"ten\":null}\n" +
            "D/UPDATE id=4   {\"soDong\":1}\n" +
            "D/UPDATE id=99  {\"soDong\":0}\n" +
            "D/UPDATE thieu  {\"soDong\":0,\"loi\":\"THIEU_WHERE\"}\n" +
            "E/DELETE id=2   {\"soDong\":1}\n" +
            "E/DELETE id=2   {\"soDong\":0}\n" +
            "E/DELETE thieu  {\"soDong\":0,\"loi\":\"THIEU_WHERE\"}\n" +
            "con lai: 1,3,4,5\n" +
            "A/chay lai sau khi sua -> 4 dong\n" +
            "   {\"tieu_de\":\"Bai tap JS\",\"diem\":9}\n" +
            "   {\"tieu_de\":\"Bai tap HTML\",\"diem\":8}\n" +
            "   {\"tieu_de\":\"Bai vo chu\",\"diem\":7}\n" +
            "   {\"tieu_de\":\"Ban nhap\",\"diem\":5}\n" +
            "C/chay lai sau khi sua -> 4 dong\n" +
            "   {\"tieu_de\":\"Bai tap HTML\",\"ten\":\"An\"}\n" +
            "   {\"tieu_de\":\"Bai tap JS\",\"ten\":\"Binh\"}\n" +
            "   {\"tieu_de\":\"Ban nhap\",\"ten\":\"Binh\"}\n" +
            "   {\"tieu_de\":\"Bai vo chu\",\"ten\":null}",
          sampleSolution:
            "function truyVanChon(gioiHan) {\n" +
            "  return bai_nop\n" +
            "    .filter((b) => b.da_cham === true)\n" +
            "    .slice()\n" +
            "    .sort((a, b) => b.diem - a.diem)\n" +
            "    .slice(0, gioiHan)\n" +
            "    .map((b) => ({ tieu_de: b.tieu_de, diem: b.diem }));\n" +
            "}\n" +
            "\n" +
            "function truyVanNoiTrong() {\n" +
            "  const ra = [];\n" +
            "  for (const b of bai_nop) {\n" +
            "    for (const h of hoc_vien) {\n" +
            "      if (b.hoc_vien_id === h.id) ra.push({ tieu_de: b.tieu_de, ten: h.ten });\n" +
            "    }\n" +
            "  }\n" +
            "  return ra;\n" +
            "}\n" +
            "\n" +
            "function truyVanNoiTrai() {\n" +
            "  const ra = [];\n" +
            "  for (const b of bai_nop) {\n" +
            "    const khop = hoc_vien.filter((h) => h.id === b.hoc_vien_id);\n" +
            "    if (khop.length === 0) {\n" +
            "      ra.push({ tieu_de: b.tieu_de, ten: null });\n" +
            "    } else {\n" +
            "      for (const h of khop) ra.push({ tieu_de: b.tieu_de, ten: h.ten });\n" +
            "    }\n" +
            "  }\n" +
            "  return ra;\n" +
            "}\n" +
            "\n" +
            "function capNhatDiem(id, diem) {\n" +
            "  if (id === undefined || id === null) return { soDong: 0, loi: 'THIEU_WHERE' };\n" +
            "  let soDong = 0;\n" +
            "  for (const b of bai_nop) {\n" +
            "    if (b.id === id) {\n" +
            "      b.diem = diem;\n" +
            "      b.da_cham = true;\n" +
            "      soDong = soDong + 1;\n" +
            "    }\n" +
            "  }\n" +
            "  return { soDong: soDong };\n" +
            "}\n" +
            "\n" +
            "function xoaBaiNop(id) {\n" +
            "  if (id === undefined || id === null) return { soDong: 0, loi: 'THIEU_WHERE' };\n" +
            "  const truoc = bai_nop.length;\n" +
            "  bai_nop = bai_nop.filter((b) => b.id !== id);\n" +
            "  return { soDong: truoc - bai_nop.length };\n" +
            "}\n" +
            "",
          rubric: rubric([
            ['chonsapcat',
              'The first query filters, then sorts descending, then cuts to the limit, <b>in that order</b>, and each row carries only <code>tieu_de</code> and <code>diem</code> — not the whole record with two extra columns riding along.',
              'Truy vấn đầu lọc, rồi sắp giảm dần, rồi mới cắt theo giới hạn, <b>đúng thứ tự đó</b>, và mỗi dòng chỉ mang <code>tieu_de</code> và <code>diem</code> — không phải cả bản ghi kèm hai cột thừa đi theo.',
              0.5],
            ['hainoi',
              'INNER returns 4 rows and LEFT returns 5: the submission with <code>hoc_vien_id = null</code> disappears from one and appears in the other with <code>ten: null</code>. The student with no submission is absent from both, because both start from <code>bai_nop</code>.',
              'INNER trả 4 dòng còn LEFT trả 5: bài nộp có <code>hoc_vien_id = null</code> biến mất ở cái này và hiện ra ở cái kia với <code>ten: null</code>. Học viên không nộp bài nào vắng mặt ở cả hai, vì cả hai đều bắt đầu từ <code>bai_nop</code>.',
              0.6],
            ['demdong',
              '<code>soDong</code> is the number of rows the write actually touched — 1 for the real id, 0 for id 99 and 0 for the second delete of the same row — and 0 is treated as "nothing matched", not as a failure.',
              '<code>soDong</code> là số dòng phép ghi thật sự đụng tới — 1 cho id có thật, 0 cho id 99 và 0 cho lần xoá thứ hai của cùng một dòng — và 0 được hiểu là "không khớp dòng nào" chứ không phải một lỗi.',
              0.5],
            ['thieuwhere',
              'Both writing functions refuse a missing <code>id</code> with <code>THIEU_WHERE</code> and change nothing, and the guard tests for <code>undefined</code>/<code>null</code> specifically rather than for falsiness, so an id of 0 would still be accepted.',
              'Cả hai hàm ghi đều từ chối khi thiếu <code>id</code> bằng <code>THIEU_WHERE</code> và không đổi gì cả, và phép chặn kiểm đúng <code>undefined</code>/<code>null</code> chứ không kiểm "giá trị falsy", nên một id bằng 0 vẫn được nhận.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};
