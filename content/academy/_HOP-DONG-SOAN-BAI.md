# PRF193 — HỢP ĐỒNG SOẠN BÀI (đọc hết trước khi viết một chữ)

Bạn soạn một PHẦN của môn **PRF193 — Programming Fundamentals (with C/C++)** cho
Academy của cuongthai.com. Đây là **BẢN MẪU cho 175 môn tiếp theo** → chất lượng
là tất cả. Web dạy học thật, sinh viên FPTU đang học.

Thư mục làm việc (scratchpad): `SCRATCH=/private/tmp/claude-501/-Users-admin-Downloads-api-backend/ee04f3fb-1823-47ce-943f-e6c755bf20a1/scratchpad/prf193`
Repo: `/Users/admin/Downloads/api-backend`

## 1. Bạn nộp gì

MỘT file `$SCRATCH/<tên được giao>.mjs`, dạng:

```js
import { bi, doc, quiz } from './_helpers.mjs';

const l11 = doc('prf193-1-1-basics', '1.1 — ...|||1.1 — ...', 'mô tả 1 câu…', [[
  `…HTML tiếng ANH…`,
  `…HTML tiếng VIỆT…`,
]]);
// … các bài khác …
const q1 = quiz('prf193-quiz-1', 'Quiz 1 — …|||Quiz 1 — …', [ …câu hỏi… ]);

export default [
  { title: 'Chapter 1 — …|||Chương 1 — …', description: '…', lessons: [l11, /*…*/ q1] },
];
```

`export default` là MẢNG các section theo đúng thứ tự, mỗi section là
`{ title, description, lessons: [...] }`. Không export gì khác.

Kiểm trước khi nộp: `node -e "import('$SCRATCH/<file>.mjs').then(m=>console.log(m.default.length,'sections',m.default.reduce((s,x)=>s+x.lessons.length,0),'lessons'))"`

## 2. LUẬT CỨNG — vi phạm là seed chết hoặc trang hỏng

1. **`title` và `slug` ≤ 255 ký tự.** `title` song ngữ `EN|||VI` tính CẢ HAI VẾ
   (cột DB là `VarChar(255)`, dài hơn là seed chết GIỮA CHỪNG và mất im lặng các
   bài phía sau). Nhắm ≤ 150 ký tự cho an toàn. Tự kiểm bằng node.
2. **Định dạng song ngữ là `EN|||VI`** — tiếng Anh TRƯỚC, tiếng Việt SAU. Áp dụng
   cho `title` của bài, `title` của section, và MỌI chuỗi trong quiz
   (`question`, từng `option`, `explanation`). `description` của bài/section chỉ
   tiếng Việt (không có `|||`).
3. **Trong chuỗi template literal: TUYỆT ĐỐI KHÔNG dùng backtick lồng, KHÔNG
   `${...}`.** Ký tự `$` đứng một mình thì được, `${` thì không.
4. **HTML phải escape:** `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Nghĩa là mọi
   code C/C++ trong `<pre><code>` phải escape: `#include &lt;iostream&gt;`,
   `cout &lt;&lt; x`, `a &amp;&amp; b`, `int&amp; r`, `vector&lt;int&gt;`.
5. **Xuống dòng trong chuỗi C/C++ viết `\\n`** (hai dấu chéo) — vì file .mjs là
   template literal, `\n` sẽ bị JS biến thành ký tự xuống dòng thật.
   `printf("Tong = %d\\n", s);` ✅ · `printf("...\n")` ❌
6. **Không `<script>`, không `<style>`, không thuộc tính `style=`, không màu
   inline.** Màu nằm trong class CSS.
7. **slug**: dùng ĐÚNG slug được giao (sinh viên đã lưu link). Không tự đổi.

## 3. CODE C/C++ PHẢI CHẠY THẬT — chỗ hay sai nhất

Mọi đoạn code bạn viết phải được **biên dịch và chạy thật**:

```bash
mkdir -p $SCRATCH/cpp
# viết file, rồi:
g++ -std=c++17 -Wall -Wextra -o /tmp/p $SCRATCH/cpp/<ten>.cpp && /tmp/p
# code C thuần thì: cc -std=c11 -Wall ...
```

- Lưu MỌI chương trình vào `$SCRATCH/cpp/<slug>-<n>.cpp` (bằng chứng; người khác
  sẽ biên dịch lại toàn bộ).
- **Ưu tiên chương trình HOÀN CHỈNH** (có `#include` + `main()`) để học viên
  copy-chạy được ngay, và để bộ kiểm tự động biên dịch được. Nếu buộc phải in
  một mẩu rời (2–4 dòng minh hoạ cú pháp), đặt class `frag` lên thẻ code:
  `<pre><code class="language-cpp frag">` — bộ kiểm sẽ bọc nó vào `main()` rồi
  mới biên dịch, nên mẩu rời vẫn phải **hợp lệ về cú pháp**.
- **Output in ra phải là output THẬT** đã chạy, dán vào khối
  `<div class="out">…</div>` ngay dưới `<pre>`. Không đoán, không làm tròn, không
  bịa. Nếu chương trình đọc `cin`, ghi rõ input dùng để chạy.
- Không cảnh báo `-Wall -Wextra` (trừ khi cảnh báo CHÍNH LÀ bài học, lúc đó nói rõ).
- **Không dùng `using namespace std;` trong bài mẫu "chuẩn"?** → Vẫn dùng được
  (giáo trình trường dùng), nhưng nhắc học viên một lần rằng dự án thật thì nên
  `std::`.
- Code phải in ra tiếng Việt KHÔNG DẤU trong chuỗi C/C++ (`"Tong = "`), vì
  console DevC++ trên Windows hay hỏng font. Phần giải thích ngoài code thì có
  dấu bình thường.

## 4. Kho class CSS được phép (đã có sẵn trong `globals.css`, đừng phát minh class mới)

| Class | Dùng cho |
|---|---|
| `<span class="eyebrow">` | dòng nhãn đầu bài: `PRF193 · Session 13–15 · CLO2` |
| `<p class="lead">` | câu mở đầu |
| `<h2> <h3> <h4>` | tiêu đề trong bài (đừng dùng `<h1>`) |
| `<div class="callout">` `.callout.ok` `.callout.warn` `.callout.danger` | khung nhấn |
| `<span class="badge">` | thẻ nhỏ mono: `CLO2`, `Buổi 16`, `PE` |
| `<div class="pitfall">` | **lỗi sinh viên hay mắc** (tự có tiêu đề "⚠️ Bẫy thường gặp" / "⚠️ Common trap") |
| `<div class="pitfall co-tieu-de"><strong>Tiêu đề.</strong> …` | pitfall tự mang tiêu đề riêng |
| `<div class="note-ct">` | **ghi chú của web** (tự hiện "💡 Ghi chú của CuongThai") — dùng cho MỌI thứ bạn bổ sung ngoài syllabus |
| `<p class="nhan">` | nhãn nhỏ in hoa, VD `<p class="nhan">Nguồn: FLM · Syllabus 13190</p>` |
| `<div class="out">` | **output thật của chương trình**, đặt NGAY sau `</pre>` |
| `<pre><code class="language-cpp">` / `language-c` | code (thêm ` frag` nếu là mẩu rời) |
| `<div class="diagram"><pre>…</pre></div>` | sơ đồ ASCII (ô nhớ, stack, lưu đồ) |
| `<table><thead><tr><th>…</th></tr></thead><tbody><tr><td>…</td></tr></tbody></table>` | bảng |
| `<div class="kv-grid"><div class="kv"><span class="k">…</span><span class="v">…</span></div></div>` | lưới thông tin khoá–giá trị |
| `<div class="meo">` | mẹo nhỏ (nền xanh) |
| `<div class="dap-an">` | **đáp án / lời giải** (nền xanh đậm hơn) |
| `<p class="ghi-chu">` | chú thích nhỏ, chữ mờ |
| `<div class="formula">` | một công thức đứng riêng |

Không dùng `<div class="giang">` (dành cho bài dạng slide), không `anh-slide`,
không `trich-slide`, không `link-card`, không `sim-*`.

## 5. Mỗi BÀI DẠY bắt buộc có (theo đúng thứ tự này)

1. `<span class="eyebrow">PRF193 · Session &lt;buổi&gt; · CLO&lt;n&gt;</span>` +
   `<h2>` tên bài + `<p class="lead">` 1–2 câu "học xong làm được gì".
2. **Nhắc buổi FLM**: một dòng `<p class="nhan">Nguồn: FLM · Syllabus 13190 · buổi N — "&lt;tên buổi nguyên văn tiếng Anh&gt;"</p>`
   (dùng ĐÚNG tên buổi trong bảng 60 buổi được giao cho bạn).
3. Giải thích khái niệm — viết cho người **chưa từng lập trình**: ví dụ đời
   thường trước, cú pháp sau. Tránh viết như tra cứu; viết như dạy.
4. **Bảng hoặc sơ đồ** khi nó giúp hiểu nhanh hơn (kiểu dữ liệu, thứ tự ưu tiên
   toán tử, ô nhớ con trỏ, luồng if/else…). Ít nhất 1 bảng HOẶC 1 sơ đồ mỗi bài.
5. **Ít nhất một chương trình hoàn chỉnh chạy được + khối `.out` output thật.**
6. `<div class="pitfall">` — 2–4 lỗi sinh viên hay mắc thật sự cho chủ đề đó
   (không phải lỗi chung chung).
7. **Bài tập + lời giải**: `<h3>Bài tập</h3>` (EN: `<h3>Exercise</h3>`) với 1–3
   đề; mỗi đề có lời giải trong `<div class="dap-an">` gồm code ĐÃ CHẠY + output
   thật + một câu giải thích "vì sao làm vậy".
8. Dài bao nhiêu: mỗi nửa ngôn ngữ **khoảng 2.500–5.000 ký tự HTML**. Bài Lab /
   Progress Test / ôn tập có thể ngắn hơn (1.500+) nhưng phải có việc làm cụ thể.

Hai nửa EN và VI phải **tương đương nội dung** (không phải nửa này dài gấp đôi
nửa kia). Đừng dịch máy: bản Việt phải đọc tự nhiên, dùng thuật ngữ Việt kèm
tiếng Anh trong ngoặc lần đầu (VD "vòng lặp (loop)").

## 6. TÁCH BẠCH NGUỒN — luật quan trọng nhất của môn này

Sinh viên phải phân biệt được **đâu là quy định của trường, đâu là của web**:

- Thứ lấy từ FLM (tên buổi, CLO, trọng số điểm, tên giáo trình, công cụ, nhiệm
  vụ SV) → ghi nguồn: `<p class="nhan">Nguồn: FLM · Syllabus 13190 · QĐ 932/QĐ-ĐHFPT ngày 22/08/2025</p>`
  và giữ **nguyên văn tiếng Anh** của FLM khi nhắc tên buổi/CLO.
- Thứ bạn tự bổ sung (mẹo, công cụ ngoài, kinh nghiệm, bài tập tự soạn, cách
  học) → bọc trong `<div class="note-ct">` hoặc mở đầu bằng
  "**Bổ sung của CuongThai (không phải quy định của trường):**".
- **KHÔNG BỊA.** Không có dữ liệu thì viết "trường không công bố". Không tự phát
  minh trọng số điểm, số câu thi, tên giảng viên, deadline, tên nhóm Lab.
- Không hứa hẹn thay trường ("chắc chắn ra đề này"). Nói "thường gặp", "theo
  dạng câu hỏi FLM công bố (trắc nghiệm + trả lời ngắn)".

## 7. Quiz cuối chương

```js
const q = quiz('prf193-quiz-N', 'Quiz N — Topic|||Quiz N — Chủ đề', [
  { id: 'q1',
    question: 'What does 7 / 2 give in C++?|||Trong C++, 7 / 2 cho kết quả?',
    options: ['3.5|||3.5', '3 (integer division)|||3 (chia nguyên)', '4|||4', 'Compile error|||Lỗi biên dịch'],
    correctIndex: 1, points: 1,
    explanation: 'int/int truncates → 3.|||int/int bỏ phần lẻ → 3; cần double mới ra 3.5.' },
  // câu đọc code: thêm code: 'int a=5;\\nprintf("%d", a++);', codeLang: 'cpp'
], 480);
```

- 6–8 câu mỗi quiz, `correctIndex` 0-based, MỌI câu có `explanation` song ngữ.
- Ít nhất 2 câu dạng **đọc code đoán output** (dùng `code` + `codeLang: 'cpp'`) —
  và bạn phải CHẠY THẬT đoạn code đó để biết đáp án đúng. Trong `code` vẫn viết
  `\\n` cho xuống dòng của C/C++ **và** `\\n` cho xuống dòng giữa các dòng code
  (chuỗi này không phải HTML nên KHÔNG escape `<`, `>`, `&` ở đây — nó được
  render trong `<pre>` bởi React).
- 4 phương án, không "tất cả đều đúng", không đáp án dài hơn hẳn các đáp án khác.

## 8. EXEMPLAR — sao chép đúng cái khung này

```js
const l32 = doc('prf193-3-2-for-loop',
  '3.2 — The for loop: counted repetition|||3.2 — Vòng lặp for: lặp có đếm',
  'Cú pháp for, ba thành phần (khởi tạo/điều kiện/cập nhật), lặp lồng, bẫy off-by-one; ví dụ tính tổng 1..n và in bảng cửu chương.',
  [[
    `<span class="eyebrow">PRF193 · Session 16 · CLO2</span>
<h2>The <code>for</code> loop</h2>
<p class="lead">After this lesson you can repeat work a known number of times, and you can read any <code>for</code> header and say exactly how many times its body runs.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13190 · buổi 16 — "Repetition Statements (for loop)"</p>
<h3>Why a loop</h3>
<p>Printing 1 to 5 by hand is five lines. Printing 1 to 1000 by hand is impossible — but the <em>pattern</em> is the same each time, and a pattern that repeats is exactly what a loop is for.</p>
<table>
  <thead><tr><th>Part</th><th>Runs</th><th>Job</th></tr></thead>
  <tbody>
    <tr><td><code>int i = 1</code></td><td>once, first</td><td>create and set the counter</td></tr>
    <tr><td><code>i &lt;= 5</code></td><td>before every pass</td><td>keep going while true</td></tr>
    <tr><td><code>i++</code></td><td>after every pass</td><td>move the counter on</td></tr>
  </tbody>
</table>
<pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i &lt;= 5; i++) {
        cout &lt;&lt; "i = " &lt;&lt; i &lt;&lt; endl;
        sum += i;
    }
    cout &lt;&lt; "sum = " &lt;&lt; sum &lt;&lt; endl;
    return 0;
}
</code></pre>
<div class="out">i = 1<br>i = 2<br>i = 3<br>i = 4<br>i = 5<br><b>sum = 15</b></div>
<div class="pitfall"><b>Off-by-one.</b> <code>i &lt; 5</code> runs 4 times (1,2,3,4); <code>i &lt;= 5</code> runs 5. <b>Semicolon.</b> <code>for (...);</code> gives the loop an EMPTY body — the block after it runs once. <b>Shadowing.</b> <code>i</code> declared inside the header dies at the closing brace.</div>
<h3>Exercise</h3>
<p><b>E1.</b> Print the 7 times table (7 x 1 .. 7 x 10), one line per row.</p>
<div class="dap-an"><pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    for (int i = 1; i &lt;= 10; i++)
        cout &lt;&lt; "7 x " &lt;&lt; i &lt;&lt; " = " &lt;&lt; 7 * i &lt;&lt; endl;
    return 0;
}
</code></pre>
<div class="out">7 x 1 = 7<br>7 x 2 = 14<br>…<br><b>7 x 10 = 70</b></div>
<p>One row per pass, so the row number IS the counter — no extra variable needed.</p></div>`,
    `<span class="eyebrow">PRF193 · Buổi 16 · CLO2</span>
<h2>Vòng lặp <code>for</code></h2>
<p class="lead">Học xong bài này bạn lặp được một việc đúng số lần đã biết, và đọc bất kỳ dòng <code>for</code> nào cũng nói ngay được thân nó chạy mấy lần.</p>
<p class="nhan">Nguồn: FLM · Syllabus 13190 · buổi 16 — "Repetition Statements (for loop)"</p>
… (nửa tiếng Việt tương đương, cùng code, cùng output) …`,
  ]]);
```

## 9. Nhớ

- Viết cho sinh viên kỳ 1, **chưa từng lập trình**. Không "như bạn đã biết".
- Không nhồi chữ rỗng. Mỗi đoạn phải mang một thông tin dùng được.
- Không emoji rải rác trong thân bài (chỉ nhãn box tự có sẵn).
- Không viết "chúng ta sẽ học ở bài sau" quá nhiều; nói cụ thể tên bài/buổi.
- Xong thì báo lại: bao nhiêu bài, bao nhiêu chương trình đã biên dịch & chạy,
  title dài nhất bao nhiêu ký tự, có gì bạn không chắc.
