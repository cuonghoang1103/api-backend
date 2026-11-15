# Hợp đồng soạn khoá "Coding Interview Prep" (/courses/dsa-interview) — 15/11/2026

> Đọc HẾT tệp này + bài mẫu `ch01/b1-hash-map.mjs` (mở cả tệp mã nó dùng trong `ma/ch01/`) trước khi viết một dòng.
> Nhiều agent soạn song song, mỗi agent MỘT chương; tệp này giữ cho cả khoá như do một người viết.
> Chỗ nào tệp này không nói ⇒ bắt chước đúng bài mẫu 1.1.

## 0. Người học — viết cho ĐÚNG người này

- **Cường**, sinh viên Kỹ thuật phần mềm FPTU, sắp nộp hồ sơ thực tập OJT kỳ SP27 (hạn giữa 12/2026) ⇒ khoá này là
  thứ HỌC CHÍNH để qua vòng coding. Chất lượng (đầy đủ · dễ hiểu · chuyên sâu · THẤY được · LÀM được · liên hệ đời thật)
  đặt trên tốc độ.
- Đã học môn CSD201 (Academy, Java) nhưng vẫn phải **tự đủ** cho người chưa học: mỗi khái niệm dùng tới phải được giải
  thích tại chỗ (ngắn, đúng) rồi mới đi sâu. Khoá này thiên về **MẪU BÀI + cách trình bày khi phỏng vấn**, không giảng lại
  cấu trúc dữ liệu như giáo trình.
- **Yếu tiếng Anh**: trong khối VI, MỌI thuật ngữ tiếng Anh có nghĩa Việt ngay cạnh lần đầu: "monotonic stack (ngăn xếp
  đơn điệu)". Tên đề LeetCode giữ nguyên tiếng Anh. Đoạn hội thoại phỏng vấn trong khối VI kèm vài cụm tiếng Anh nên thuộc.
- Thi ở trường bằng **Java** (FPT), phỏng vấn có thể dùng TypeScript/JavaScript hoặc Java ⇒ MỌI lời giải có cả hai.
- Máy: Mac M1 Max, Node 26, Java 21 (biên dịch `--release 17`).

## 1. Phạm vi tệp — LUẬT CỨNG (nhiều phiên dùng chung repo + chung git index)

Agent Chương N (NN = 2 chữ số) CHỈ được tạo/sửa:
- `content/courses/dsa-interview/sNN-*.mjs` (tệp chương — đã có sẵn bản giữ chỗ, sửa nó),
- `content/courses/dsa-interview/chNN/**` (mỗi bài một tệp `bK-<ten>.mjs`),
- `content/courses/dsa-interview/ma/chNN/**` (mã chạy thật + output + mô phỏng + bảng vết),
- `content/courses/dsa-interview/_tien-do/chNN.md` (tiến độ/bàn giao của chương).
KHÔNG sửa: `dsa-interview.mjs`, `_chung.mjs`, `_chay.mjs`, `_kiem.mjs`, `_HOP-DONG.md`, `_KE-HOACH.md`, chương khác, bất cứ
tệp nào ngoài thư mục trên. Cần thêm hàm vào `_chung.mjs`? ⇒ viết hàm cục bộ trong `chNN/_rieng.mjs` của mình, và ghi đề xuất
vào `_tien-do/chNN.md`. Nháp/thử nghiệm: `$TMPDIR/dsa-nhap/chNN/`. KHÔNG push, KHÔNG deploy, KHÔNG seed, KHÔNG chạy gì đụng
CSDL hay R2.

**Commit** (sau khi mọi bộ kiểm ở mục 8 xanh), chỉ đường dẫn của mình:
```bash
git add content/courses/dsa-interview/sNN-*.mjs content/courses/dsa-interview/chNN content/courses/dsa-interview/ma/chNN content/courses/dsa-interview/_tien-do/chNN.md
git commit -m "content(dsa-interview): Chương N — <tên ngắn>" -m "<2–4 dòng: bài nào, bao nhiêu đề, đo gì>" -m "Claude-Session: https://claude.ai/code/session_015xWfqDjqzgxPuGgordi9ip" -- content/courses/dsa-interview/sNN-*.mjs content/courses/dsa-interview/chNN content/courses/dsa-interview/ma/chNN content/courses/dsa-interview/_tien-do/chNN.md
```
Không `git commit -a`, không `git add .`, không Co-Authored-By. Chương dài thì được commit nhiều lần (mỗi lần bộ kiểm xanh).

## 2. Slug + tiêu đề — LUẬT CỨNG (URL đã công khai)

- `title` của CHƯƠNG giữ NGUYÊN từng ký tự như tệp giữ chỗ (bộ seed neo chương bằng nó; `dsa-interview.mjs › ghep` ném lỗi).
- Bài ĐẦU của chương giữ nguyên slug + vị trí đầu (bộ seed neo chương bằng slug bài đầu).
- Mọi slug bài khung giữ nguyên (danh sách: `_slug-goc.json`). `title` của BÀI được đổi (dạng `'N.M — English|||N.M — Tiếng Việt'`, ≤ 180 ký tự; số N.M theo VỊ TRÍ hiển thị).
- Bài MỚI: slug `dsa-N-K-<ten>` với K chưa dùng trong chương (khung đã dùng 1–4). Bài mới chỉ thêm khi mục 5 bảo thêm.
- Mọi bài: `type: 'LESSON'` (quiz: `'QUIZ'`), `isFreePreview: true`, `description` 1 câu tiếng Việt.

## 3. Định dạng bài (bắt chước `ch01/b1-hash-map.mjs`)

- Mỗi bài một tệp `chNN/bK-<ten>.mjs` `export default { title, slug, type, isFreePreview, description, content }`.
  Tệp chương `sNN-*.mjs` import các bài theo đúng thứ tự hiển thị.
- `content` là template literal, **viết XEN KẼ**: cặp khối `<div class="ml-en">…</div>` + `<div class="ml-vi">…</div>` cho lời
  giảng; **mã, output, bảng vết, mô phỏng đặt GIỮA hai cặp khối** (ngoài khối ngôn ngữ ⇒ hiện cho cả hai thứ tiếng).
  Khối EN là bản song song ĐẦY ĐỦ ý của khối VI (không rút gọn) và **không có chữ tiếng Việt** (bộ `course-lang-check` bắt);
  đặt hộp `csd()` và thẻ `lienKet()` tiếng Việt trong khối VI.
- Thư viện `../_chung.mjs` (đọc chú thích từng hàm): `ma(rel,{vung,nhan})` · `maHai(tsRel, javaRel, {vung})` ·
  `ketQua(rel)` (output THẬT từ `<rel>.out`) · `oMang(arr,{to,nhan,tu,den,chiSo})` + `bangVet(cot, hang)` (bảng trạng thái
  qua từng vòng) · `lc(id, slug, ten, doKho, {premium})` · `bangDe(de, lang)` · `moPhong(rel, lang, tieuDe, phu)` ·
  `csd(slug, lang, tenBai, html)` · `hoiThoai(dong, lang)` · `gap(tieuDe, html)` (gập lời giải/gợi ý) · `nguon(...)` · `lienKet(...)` · `baiNay(slug)`.
- **Thoát ký tự trong template literal** (bộ kiểm chặn): không backtick trần (`&#96;`), không gạch chéo ngược, không `${`
  ngoài lời gọi hàm. Mã KHÔNG bao giờ dán vào template — luôn đọc từ tệp qua `ma()/maHai()`. `<` `>` `&` trong chữ thường ⇒
  `&lt;` `&gt;` `&amp;`. Chuỗi nháy đơn (title/quiz): dùng `’` hoặc nháy kép, không `\'`.
- Khối được phép: `.eyebrow .lead h3 p ul ol table .kv-grid>.kv>.k/.v .callout(.ok|.warn|.danger) .pitfall.co-tieu-de .lz-flow>.lz-step(.lz-k/.lz-t/.lz-d) details/summary .out .link-card`. Không svg/iframe/script/style tag (bị lọc). Được `style=""` nội tuyến nhỏ.
- **Không chép nguyên văn đề LeetCode** (bản quyền): diễn đạt lại đề bằng lời của mình + một ví dụ nhỏ tự đặt.

## 4. Mã chạy THẬT — LUẬT CỨNG

Mọi đoạn mã/output trong bài nằm trong `ma/chNN/`:
- `<ten>.ts` — TypeScript chạy độc lập bằng tsx (không import gì), in output tất định; dòng `// @java: TenLop.java` ⇒ bộ chạy
  bắt output TS và Java GIỐNG nhau (sau khi bỏ khoảng trắng + dấu `"`): TS in mảng bằng `JSON.stringify`, Java bằng
  `Arrays.toString`/`List.toString` là khớp. Danh sách lồng/Map thì tự in cho khớp.
- `<TenLop>.java` — một lớp `public` trùng tên tệp, có `main`, `javac --release 17`. Lời giải kiểu LeetCode (hàm static).
- `// #region ten` … `// #endregion` để bài trích đúng phần lời giải (bài chỉ hiện hàm, không hiện phần test).
- `// @thoi-gian` — tệp ĐO THỜI GIAN (n = 10³ … 10⁶, lấy lần nhanh nhất trong vài lượt, in `node`/`java` version + arch). Mỗi
  chương ≥ 1 phép đo cho THẤY khác biệt O(n²) vs O(n) / O(n log n) / O(2ⁿ) vs DP… Đọc số và giải thích tỉ lệ tăng như bài 1.1.
- `<ten>.sim.js` — chương trình mô phỏng cho trang `/algorithms` (chạy trong Web Worker). API: `new Array1DTracer(t)` (`set(arr)`,
  `select(i[,j])`, `deselect`, `patch(i)`, `depatch`) · `new LogTracer(t)` (`println(s)`) · `new Array2DTracer(t)` (`set(m)`,
  `select(r,c)`, `deselect`, `patch`, `depatch`) · `new GraphTracer(t, directed)` (`addNode(id, w, x, y)` toạ độ 0..1,
  `addEdge(s,t,w)`, `visit(t,s)`, `leave`, `select`, `deselect`, `updateNode(id,w)`) · `new ChartTracer(t)` · `Tracer.delay()`
  = một bước hình. Xem mẫu `ma/ch01/two-sum.sim.js` và `frontend/src/components/algorithms/catalog.ts` (chỉ ĐỌC). Mỗi bài dạy ≥ 1 mô phỏng, có `log.println` giải thích từng bước.
- `<ten>.vet.mjs` — hàm JS chạy thuật toán THẬT và trả về các dòng trạng thái ⇒ bài dựng `bangVet()` từ đó (mẫu
  `ma/ch01/two-sum.vet.mjs` + đầu tệp `ch01/b1-hash-map.mjs`). KHÔNG gõ tay bảng vết.
- Chạy: `node content/courses/dsa-interview/_chay.mjs --chi chNN` (ghi `.out`), rồi `--kiem --chi chNN` phải ✅.
  Sửa mã ⇒ chạy lại ⇒ bài tự nhận output mới.

## 5. Mỗi chương gồm

| Loại | Nội dung |
|---|---|
| Bài dạy (các slug khung) | mục 6. VI prose ≥ 10.000 ký tự/bài (không tính mã), tổng `content` thường 50–90k |
| Bài mới (chỉ khi bảng mục 9 ghi) | như bài dạy |
| Bộ luyện (`…-luyen`) | mục 7 |
| Quiz chương (bài MỚI cuối chương, slug `dsa-N-K-quiz`) | mục 7b |

## 6. Giải phẫu một bài dạy (đủ các phần, theo thứ tự hợp lý)

1. eyebrow + h2 + lead: bài này trả lời câu hỏi gì, vì sao người phỏng vấn thích dạng này.
2. **Hình dung đời thường** (liên tưởng cụ thể, kiểu "thu ngân thối tiền") → rồi mới định nghĩa chuẩn, thuật ngữ có nghĩa Việt.
3. Hộp `csd()` khi chạm nội dung CSD201 (slug thật — liệt kê bằng lệnh ở mục 8): 1 câu ôn nhanh + "ở đây đi sâu thêm gì".
4. **Dấu hiệu nhận ra** mẫu (kv-grid) — câu chữ trong đề + ràng buộc n gợi ý độ phức tạp.
5. **Đề giải mẫu chính**: diễn đạt lại đề → vét cạn nói thành lời + độ phức tạp → chỉ ra phần việc lặp/phí → ý chính →
   khung lời giải (`maHai`) → `ketQua` cả TS lẫn Java → giải thích từng dòng quan trọng (vì sao `<` chứ không `<=`…).
6. **Bảng vết** (`bangVet` + `oMang`, sinh từ `.vet.mjs`) cho THẤY con trỏ/cửa sổ/ngăn xếp/hàng đợi/bảng DP qua từng vòng,
   có đoạn đọc bảng; + `moPhong()` link mô phỏng tương tác.
7. **Độ phức tạp chắc tay**: thời gian + bộ nhớ, lập luận (khấu hao nếu cần); chỗ hợp thì số đo `@thoi-gian`.
8. **2–4 đề biến thể** giải mẫu ngắn hơn (cùng mẫu, khác vỏ) — mỗi đề có mã TS+Java chạy thật.
9. **Đời thật / đi làm**: mẫu này nằm ở đâu trong hệ thống thật (rate limit = cửa sổ trượt, autocomplete = trie, lịch build
   = topo sort, undo = stack, lịch họp = intervals, `git bisect` = nhị phân…). Ưu tiên ví dụ CÓ THẬT trong chính repo này
   (grep `src/`, `frontend/src/` — trích đúng tên tệp/hàm, không bịa).
10. **🕵️ Góc kẻ xấu** khi có thật và tự nhiên (ReDoS, HashDoS, đệ quy sâu làm sập stack, input lớn làm treo O(n²), bỏ qua
    rate limit…) + cách phòng. Không ép nếu không có.
11. **Bẫy** (`.pitfall.co-tieu-de`): lỗi thật hay gặp, DEMO bằng mã chạy thật khi được (như bẫy `{}`/`Integer ==` ở 1.1).
12. **🎤 Nói to khi phỏng vấn**: `hoiThoai([...], 'en')` trong khối EN và bản tiếng Việt `hoiThoai([...], 'vi')` trong khối VI
    (kèm cụm tiếng Anh); 8–12 lượt: hỏi làm rõ → vét cạn → cải tiến + độ phức tạp → xin phép code → vừa code vừa nói quyết
    định tinh tế → tự test ca biên → câu hỏi nối tiếp (follow-up) của người phỏng vấn. Dòng `N` giải thích vì sao.
13. **Lỗi hay gặp** (ul, 4–6 ý).
14. **Đề luyện** `bangDe(DE, lang)` 6–10 đề LeetCode THẬT (qua `lc()` — bộ kiểm hỏi GraphQL của LeetCode xem đúng số/tên/độ
    khó/Premium). Ưu tiên đề miễn phí; đề Premium ghi `{premium:true}` và gợi ý bản miễn phí tương đương (NeetCode/LintCode).
15. `<h3>🧪 Practice (15–20 min)</h3>` / `<h3>🧪 Thực hành (15–20 phút)</h3>` (`callout ok` + `ol` + **Đạt khi:** kiểm được) ·
    `<h3>🗂 Key terms</h3>` / `<h3>🗂 Thuật ngữ trong bài</h3>` (kv-grid 5–8, bên VI "gốc (nghĩa Việt)") ·
    `<h3>📌 Summary</h3>` / `<h3>📌 Tóm tắt</h3>` (5–6 ý) · 2–3 thẻ `nguon()` (URL GET 200 — bộ kiểm --mang thử).

## 7. Bộ luyện (`dsa-N-4-luyen` hoặc theo bảng mục 9)

6–8 đề (dễ → khó) phủ các mẫu của chương. Mỗi đề: `<h3>` số + tên + `lc()` · đề diễn đạt lại + ví dụ nhỏ · "Nhận ra mẫu
thế nào" · `gap('💡 Gợi ý 1', …)` · `gap('💡 Gợi ý 2', …)` · `gap('✅ Lời giải từng bước', …)` (cách nghĩ → mã TS+Java đặt ngoài
khối ngôn ngữ ngay sau → output thật → độ phức tạp → ca biên đã thử). Lưu ý: `gap` nằm trong khối ngôn ngữ nên lời giải chữ
ở cả hai khối; mã + output đặt NGOÀI ngay sau cặp khối (không gập). Đầu bài: bảng thứ tự + thời gian mục tiêu (Easy 15′,
Medium 25′, Hard 40′) + cách luyện (tự bấm giờ, nói to, nộp LeetCode). Cuối bài: 🧪/🗂/📌 như bài dạy.

## 7b. Quiz chương (bài mới cuối chương)

- `content`: khối EN/VI: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>` / `<h3>Tự kiểm trước khi làm</h3>` (`ul` 5–6 "Tôi làm được…").
- `quiz: { timeLimitSeconds: 900, questions: [10 câu] }`, mỗi câu `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
  Phương án chỉ là code/số giống nhau hai thứ tiếng thì viết một lần.
- Tình huống thật ("Bạn viết sliding window, test 3 qua 2 hỏng với k = 0…", "ràng buộc n ≤ 2·10⁵, chọn độ phức tạp nào"),
  đọc mã → đoán output, chọn mẫu cho đề lạ, độ phức tạp, ca biên. Không hỏi định nghĩa suông.
- `explanation`: vì sao đúng + vì sao phương án hấp dẫn nhất SAI. **Rải đáp án**: mỗi vị trí 2–3 lần. Phương án sai hợp lý,
  dài tương đương đáp án đúng. Mọi output nhắc tới trong câu hỏi phải là output THẬT (chạy trong nháp).

## 8. Kiểm trước khi commit (tất cả phải ✅)

```bash
cd /Users/admin/Downloads/api-backend
node content/courses/dsa-interview/_chay.mjs --chi chNN          # chạy thật, ghi .out
node content/courses/dsa-interview/_chay.mjs --kiem --chi chNN   # so lại
node content/courses/dsa-interview/_kiem.mjs --mang               # slug/tiêu đề/link nội bộ/CSD201/LeetCode/link ngoài/quiz
node scripts/course-content-check.mjs ./content/courses/dsa-interview.mjs
node scripts/course-lang-check.mjs --list ./content/courses/dsa-interview.mjs | grep "dsa-N-"   # bài của mình không được nằm trong danh sách "nặng"
node scripts/course-depth-audit.mjs ./content/courses/dsa-interview/sNN-*.mjs
# slug CSD201 thật:
node -e "import('./content/academy/CSD201.mjs').then(m=>{for(const s of m.default.sections)for(const l of s.lessons)console.log(l.slug,'|',l.title.split('|||')[1]?.slice(0,80))})"
```
Rồi **đọc lại** bài như người mới: con số trong chữ có khớp output không, bảng vết có khớp lời giải không, đáp án quiz có
thật sự đúng không. Một bài mà chữ nói "4 bước" còn bảng vết có 5 dòng là bài hỏng.

## 9. Dàn bài từng chương (slug khung giữ nguyên; ★ = bài mới thêm)

| Ch | Bài | Nội dung bắt buộc |
|---|---|---|
| 1 | 1-1 hash-map (XONG, bài mẫu) · 1-2 prefix-sum · 1-3 sap-xep · ★1-5 bit · 1-4 luyen · ★1-6 quiz | prefix sum (range sum, subarray sum = k bằng map tổng tiền tố, 2D prefix, hiệu mảng/difference array); sắp xếp làm công cụ (sort + quét, comparator TS/Java, ổn định, top-k bằng sort, counting/bucket sort cho top-k tần suất); bit (XOR single number, n&(n−1), đếm bit, bitmask tập con, dịch bit, bẫy số âm/`>>>`/32-bit JS) |
| 2 | 2-1 hai-con-tro · 2-2 cua-so · 2-3 nhanh-cham · 2-4 luyen · ★2-5 quiz | hai con trỏ đối đầu (sorted two sum, 3Sum + khử trùng, container, palindrome, trapping rain water) + cùng chiều (remove duplicates, move zeroes, merge sorted); cửa sổ cố định + co giãn (khuôn "mở rộng phải, co trái khi vi phạm", longest substring no repeat, min window substring, at most k distinct, permutation in string) — liên hệ rate limiter sliding window log/counter (repo có `src/middleware/orderRateLimit.ts` dùng express-rate-limit cửa sổ cố định: so sánh fixed vs sliding); nhanh-chậm (Floyd chu trình + điểm vào chu trình, giữa danh sách, happy number, find duplicate number) |
| 3 | 3-1 stack · 3-2 queue · 3-3 linked-list · 3-4 luyen · ★3-5 quiz | stack (ngoặc hợp lệ, min stack, RPN, decode string) + monotonic stack (daily temperatures, next greater, largest rectangle histogram, stock span) — undo/redo, call stack, trình duyệt back; queue/deque (BFS preview, sliding window maximum bằng deque đơn điệu, queue bằng hai stack, mảng vòng; bẫy `Array.shift()` O(n) trong JS — đo thật); linked list (đảo vòng lặp + đệ quy, merge two sorted, node giả/dummy, xoá nút thứ n từ cuối, reorder, LRU cache = map + danh sách đôi — liên hệ cache thật) |
| 4 | 4-1 co-ban · 4-2 xoay · 4-3 khong-gian-dap-an · 4-4 luyen · ★4-5 quiz | MỘT khuôn nhị phân bất biến (lo/hi nửa mở, lower_bound/upper_bound, first/last position), tràn số `(lo+hi)/2` Java, `>>> 1`; mảng xoay (search rotated, find min), tìm đỉnh, ma trận 2D; nhị phân trên đáp án (Koko, ship packages within D days, split array largest sum, min days bouquets) — đời thật: `git bisect`, tìm phiên bản gây lỗi, dò ngưỡng cấu hình |
| 5 | 5-1 duyet · 5-2 de-quy · 5-3 bst · ★5-5 trie · 5-4 luyen · ★5-6 quiz | duyệt pre/in/post (đệ quy + lặp bằng stack), theo tầng (BFS, level order, right side view, zigzag); đệ quy trên cây (khuôn "hàm trả gì cho cha", độ sâu, cân bằng, đường kính, path sum, max path sum, invert, same tree, serialize); BST (kiểm hợp lệ bằng khoảng, kth smallest = inorder, LCA, insert/delete); trie (insert/search/startsWith, word search II tiền tố, autocomplete — liên hệ ô tìm kiếm); bẫy đệ quy sâu (stack overflow Java/JS — đo độ sâu tối đa thật) |
| 6 | 6-1 heap · 6-2 trung-vi · 6-3 khoang · 6-4 luyen · ★6-5 quiz | heap (JS KHÔNG có heap sẵn ⇒ tự viết MinHeap TS gọn để dùng khi phỏng vấn; Java `PriorityQueue` + comparator, bẫy `a - b` tràn số), top-k (heap kích thước k vs sort vs quickselect, đo thật), merge k sorted lists, k closest points, task scheduler; hai heap trung vị động (find median from data stream, sliding window median ý tưởng); khoảng (merge, insert, non-overlapping, meeting rooms I/II — Premium ⇒ gợi ý bản miễn phí, minimum arrows, sweep line +1/−1) — đời thật: lịch phòng lab/lịch họp, hàng đợi ưu tiên job |
| 7 | 7-1 bieu-dien · 7-2 bfs-dfs · 7-3 topo · 7-4 dijkstra · ★7-5 luyen · ★7-6 quiz | biểu diễn (danh sách kề từ danh sách cạnh, lưới 4/8 hướng, ma trận kề, khi nào dùng gì); BFS/DFS (number of islands, flood fill, rotting oranges = BFS nhiều nguồn, clone graph, pacific atlantic, shortest path lưới không trọng số, word ladder); topo (Kahn + DFS 3 màu, course schedule I/II, phát hiện chu trình) — đời thật: thứ tự build/`npm` dependency, migration, môn tiên quyết FPT; Dijkstra (heap, network delay time, cheapest flights ràng buộc k ⇒ Bellman-Ford biến thể) + union-find (path compression + union by rank, number of provinces, redundant connection, accounts merge) |
| 8 | 8-1 mau · 8-2 to-hop · 8-3 cat-nhanh · 8-4 luyen · ★8-5 quiz | khuôn chọn → đệ quy → bỏ chọn, cây trạng thái (bảng vết đường đi), subsets/permutations/combinations/combination sum (I/II khử trùng bằng sort + bỏ qua cùng tầng), letter combinations, generate parentheses, palindrome partitioning; cắt nhánh (N-Queens bằng 3 Set, word search, sudoku), đo số nút duyệt có/không cắt nhánh; độ phức tạp 2ⁿ·n, n!·n — bảng n tối đa |
| 9 | 9-1 nhap-mon · 9-2 mot-chieu · 9-3 hai-chieu · 9-4 nhan-dien · ★9-5 greedy · ★9-6 luyen · ★9-7 quiz | đệ quy → nhớ → bảng → tối ưu bộ nhớ (climbing stairs/fib, đo thật 2ⁿ vs n); 1D (house robber I/II, coin change, decode ways, word break, LIS O(n²) + O(n log n), max subarray Kadane); 2D (unique paths, LCS, edit distance, 0/1 knapsack/partition equal subset, longest palindromic substring); nhận diện + "nói trạng thái trước khi code" (4 câu hỏi: trạng thái, chuyển, cơ sở, thứ tự); greedy (jump game I/II, gas station, interval scheduling, khi nào greedy SAI — phản ví dụ coin change với [1,3,4]) |
| 10 | 10-1 noi · 10-2 code-sach · 10-3 test · 10-4 online · ★10-5 quiz | (chương kỹ năng) câu mẫu EN/VI theo từng pha, xin gợi ý đúng cách, xử lý khi bí; code sạch dưới áp lực; tự test (chạy tay, ca biên theo checklist); OA HackerRank/Codility (đọc stdin bằng Node `readline`/`fs` và Java `BufferedReader`/`Scanner` — chạy thật với tệp input, quản lý thời gian, bẫy chậm I/O Java Scanner — đo thật) |
| 11 | 11-1 lo-trinh · 11-2 thu-1 · 11-3 thu-2 · 11-4 tong-ket · ★11-5 thu-3 · ★11-6 kiem-tra-cuoi-khoa | lộ trình 6 tuần (bảng ngày, ôn lặp khoảng cách, nhật ký lỗi, nối hạn OJT giữa 12); 3 bộ phỏng vấn thử (đề, bấm giờ 45′, kịch bản người phỏng vấn, rubric tự chấm 4 trục: giao tiếp · giải quyết vấn đề · code · test); sau phỏng vấn; bài thi cuối khoá ≥ 20 câu |

Mục 0 (0-8, 0-9, 0-1 big-o, 0-2 khung, ★0-3 quiz) do người điều phối soạn: Big-O, bảng giới hạn n ↔ độ phức tạp, khung 6 bước
UMPIRE-kiểu (hỏi làm rõ · ví dụ · vét cạn · tối ưu · code · test). Các chương tham chiếu tới chúng bằng `baiNay('dsa-0-1-big-o')`,
`baiNay('dsa-0-2-khung')`. Chương khác tham chiếu chéo bằng slug khung (đã cố định) — đừng link tới bài ★ của chương khác.

## 10. Báo cáo (ghi vào `_tien-do/chNN.md` và trả về người điều phối, tiếng Việt, ngắn)

Danh sách bài + độ dài (ký tự) · số đề LC · số tệp mã/mô phỏng/phép đo · commit · chỗ chưa chắc · đề xuất hàm chung (nếu có).
