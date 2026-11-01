# csd201-practice — tiến độ & cách làm tiếp (01/11/2026)

Bộ luyện Code Lab của CSD201 (Academy `data-structures-and-algorithms`). Quyết định của chủ web 01/11: **web không chấm** —
mỗi đề tải về một thư mục, người học làm trên máy với JDK của mình, chạy `node cham.mjs`, đạt hết thì bấm
"Tự đánh dấu đã giải" (`tests.loai = 'manual'` + `chayTaiMay`). Khuôn chép từ `pro192-practice` (cùng `_chung.mjs`,
`_cham-mau.mjs`, `_Kiem.java`, `_dung.mjs`), thêm phần riêng của CTDL & GT.

## Đã xong (đã commit)

| Chương | Module (slug = slug bài học) | Đề |
|---|---|---|
| 0 | `csd201-big-o` 3 (đếm phép toán arrayMax, công thức đóng 7 vòng lặp ⏱, nhị phân vs tuần tự ⏱) · `csd201-on-ch0` 4 (tổng tiền tố ⏱, tìm trùng O(n) ⏱, mảng gấp đôi ⏱, CarList f1–f4) | 7 |
| 1 | `csd201-mang` 3 (chèn/xoá dời, xoá mọi phần tử một lượt ⏱, xoay 3 lần đảo ⏱) · `csd201-linked-list` 4 (SLL ⏱, insertAt/deleteAt, vòng chỉ tail, kép) · `csd201-doubly-sentinel` 3 (header/trailer, sắp có lính canh, lịch sử trình duyệt) · `csd201-java-list-api` 3 (Iterator.remove ⏱, trộn bằng iterator ⏱, ArrayDeque vs remove(0) ⏱) · `csd201-luyen-tap-list` 3 (đảo tại chỗ ⏱, Floyd ⏱, trộn nối lại ⏱) · `csd201-on-ch1` 3 (Josephus ⏱, palindrome O(1) ⏱, 🎯 **PE MyList Car f1–f4**) | 19 |
| 2 | `csd201-stack-queue` 3 (stack liên kết, queue liên kết ⏱, đảo k phần tử đầu) · `csd201-stack-queue-cai-dat` 3 (stack mảng ⏱, queue mảng vòng first/last như slide, queue bằng 2 stack ⏱) · `csd201-stack-ung-dung` 4 (ngoặc + vị trí lỗi, hậu tố, shunting-yard, undo/redo) · `csd201-deque` 3 (deque mảng vòng, max cửa sổ trượt ⏱, số âm đầu mỗi cửa sổ ⏱) · `csd201-priority-queue-heap` 3 (min-heap kiểm bất biến ⏱, top-k heap cỡ k ⏱, cấp cứu Comparator) · `csd201-on-ch2` 4 (round-robin, hàng bệnh nhân f1–f4 kiểu PE, phần tử lớn hơn kế tiếp ⏱, hình chữ nhật lớn nhất ⏱) | 20 |
| 3 | `csd201-de-quy` 3 (tổng/đếm/max đoạn mảng, đảo chuỗi + palindrome, đổi cơ số — cấm vòng lặp) · `csd201-de-quy-vi-du` 3 (Hà Nội + đếm bước, Fibonacci có nhớ ⏱, luỹ thừa nhanh mod m ⏱) · `csd201-de-quy-phan-tich` 3 (đếm lời gọi fib bằng hệ thức ⏱, nghịch thế chia để trị ⏱, đoạn con max chia để trị ⏱) · `csd201-de-quy-thiet-ke` 3 (đệ quy đuôi → vòng lặp ⏱, loang vùng ngăn xếp tường minh ⏱, máy tính đệ quy xuống) · `csd201-on-ch3` 4 (đệ quy trên danh sách kiểu PE, quay lui tập con/hoán vị, N quân hậu ⏱, đường đi lưới có nhớ ⏱) | 16 |
| 4 | `csd201-cay-duyet` 3 (size/height/depth cây tổng quát, dung lượng thư mục hậu thứ tự, in theo tầng) · `csd201-cay-nhi-phan` 3 (proper/perfect, cây trong mảng + complete, dựng từ pre+in ⏱) · `csd201-duyet-cay` 3 (bốn phép duyệt, trung thứ tự ngăn xếp tường minh ⏱, cây biểu thức) · `csd201-bst` 3 (chèn/tìm lặp ⏱, floor/ceiling/đếm khoảng tỉa nhánh ⏱, isBST) · `csd201-bst-chen-xoa` 3 (xoá sao chép, xoá hợp nhất, cắt về [lo,hi]) · `csd201-avl` 3 (quay trái/phải, chèn AVL 4 trường hợp ⏱, hệ số cân bằng ⏱) · `csd201-heap-cai-dat` 3 (heap trên xuống vs Floyd ⏱, heap sort ⏱, trộn k dãy ⏱) · `csd201-on-ch4` 3 (thống kê BST kiểu PE, k-nhỏ-nhất + LCA, 🎯 **PE BSTree Car f1–f4**) | 24 |
| 5 | `csd201-do-thi` 3 (bậc/cạnh/đỉnh lẻ trên ma trận, BFS+DFS duyệt hết đỉnh như Graph của PE — ca 1 trùng đáp án đề thật, thành phần liên thông) · `csd201-do-thi-bieu-dien` 3 (danh sách cạnh → ma trận + danh sách kề, BFS CSR 10⁶ đỉnh ⏱, đếm walk bằng luỹ thừa ma trận) · `csd201-dfs` 3 (chu trình + topo theo thời điểm kết thúc, Kahn nhỏ nhất trước ⏱, thành phần bằng DFS lặp ⏱) · `csd201-bfs` 3 (đường ít cạnh nhất, mê cung 2000² ⏱, BFS nhiều nguồn ⏱) · `csd201-dijkstra` 3 (ma trận 99=∞ kiểu PE — ca 1 trùng đáp án đề SP26 B5 P4, PQ 200k đỉnh ⏱, lưới phí ⏱) · `csd201-mst` 3 (Prim ma trận, Kruskal + union-find ⏱, nối thành phố có đường sẵn) · `csd201-euler` 3 (kiểm Euler, Hierholzer lặp ⏱, Hamilton quay lui) · `csd201-on-ch5` 3 (tô màu tuần tự 2 thứ tự, Floyd cạnh âm + truy vết, 🎯 **PE Graph f1/f2** với phần (1) Graph.java THẬT) | 24 |
| 6 | `csd201-sap-xep-co-ban` 3 (chọn in từng lượt + đếm đổi/so sánh, chèn in lượt + số lần dời, nổi bọt dừng sớm) · `csd201-sap-xep-hieu-qua` 3 (Shell Knuth ⏱, Comparator hai khoá ổn định, cặp gần nhất sau khi sắp ⏱) · `csd201-quicksort` 3 (Lomuto in từng lần phân hoạch, quicksort trung vị 3 + Hoare + đệ quy phía nhỏ ⏱ trên đã sắp/ngược/bằng nhau, quickselect ⏱) · `csd201-mergesort` 3 (trộn từ trên xuống in từng lần trộn, từ dưới lên không đệ quy ⏱, bản ghi ổn định) · `csd201-heapsort` 3 (dấu vết heap sort, mảng lệch ≤ k ⏱, trung vị chạy hai heap ⏱) · `csd201-sap-xep-tuyen-tinh` 3 (counting sort ổn định ⏱, radix LSD từng lượt, bucket [0,1) ⏱) · `csd201-so-sanh-sap-xep` 3 (cờ Hà Lan, số lần đổi tối thiểu = n − số chu trình ⏱, sắp một lần + tìm nhị phân ⏱) · `csd201-on-ch6` 3 (merge sort danh sách Car ⏱, sắp đoạn [i..j] kiểu PE, sắp chèn nối lại nút) | 24 |
| 7 | `csd201-bam` 3 (cặp tổng K bằng HashSet ⏱, tần suất từ + top k, nhóm đảo chữ) · `csd201-ham-bam` 3 (băm đa thức = String.hashCode + đếm va chạm, lớp Plate equals/hashCode, Rabin–Karp ⏱) · `csd201-va-cham` 3 (dò tuyến tính có dấu DELETED, dò bậc hai biển số (m không nguyên tố bỏ sót ô), dây chuyền) · `csd201-load-factor` 3 (dây chuyền tự băm lại α > 0,75 ⏱, hashCode tồi trong HashMap ⏱, tập int địa chỉ mở có nới ⏱) · `csd201-on-ch7` 3 (dãy liên tiếp dài nhất ⏱, đếm đoạn con tổng K ⏱, danh mục sách dây chuyền kiểu PE f1–f4) | 15 |
| 8 | `csd201-nen-van-ban` 3 (RLE + tỉ lệ nén, DNA 2 bit/base, mã tiền tố + giải mã) · `csd201-kmp` 3 (bảng T[] như slide + vị trí + số so sánh, KMP 2·10⁶ ký tự ⏱, chu kỳ ngắn nhất ⏱) · `csd201-huffman` 3 (cây Huffman quy ước slide + mã/giải mã, tổng bit = tổng các lần gộp ⏱, entropy/độ dài TB/tỉ lệ) · `csd201-lzw-rle` 3 (LZW mã hoá đánh số từ 1 ⏱, LZW giải mã ca KwKwK, RLE ảnh đen trắng) · `csd201-on-ch8` 3 (vét cạn + số so sánh kiểu PE, nhật ký tin nhắn f1–f3 kiểu PE, so sánh RLE/LZW/Huffman) | 15 |
| 11 🎯 | `csd201-on-pe` 4 — ĐỀ THẬT: SP26 Paper 1 (ShipmentCLL vòng countFruits/removeById + FruitBST insert/countInRange; sửa HAI tệp, Main/Assignment/Fruit thật) · SP26 B5 P4 Q1 MyList Drum · Q2 BSTree Tiger (khoá sound, xoá sao chép + quay trái nút thứ 4 tiền thứ tự) · Q3 Graph (BFS đoạn 3–7, Dijkstra + 4 đỉnh cuối vào S). Ca 1 mỗi lựa chọn = đúng đáp án trong `content/exams/CSD201-PE1`/`PE3` (đã đối chiếu từng dòng) | 4 |
| 9 Nâng cao | `csd201-cay-can-bang` 3 (kiểm cây đỏ-đen theo thứ tự 4 luật — tiền thứ tự quyết định nút báo, skip list mức cho trước + đếm bước ⏱ 200k, B-tree CLRS tách chủ động ⏱ 10⁶ khoá t = 32 → cao 4) · `csd201-dijkstra-mst` 3 (Union-Find hạng + nén lặp — chuỗi 10⁶ cha + dãy xấu ⏱, đếm phép chép mảng động gấp đôi vs +k + dự đoán 10⁹ không cấp phát ⏱, co ở 1/4 chống dao động ⏱) | 6 |
| 10 ⭐ CS | `csd201-cs1-on` 6 (phiên bản lỗi đầu ≤ 32 lần hỏi + tràn số, phần tử đơn ⏱, số thiếu thứ k ⏱, bó hoa ⏱, cực đại khoảng cách nhỏ nhất ⏱, trung vị hai mảng O(log min) ⏱) · `csd201-cs2-on` 6 (cờ Hà Lan, ≤ k ký tự khác ⏱, đoạn chia hết k ⏱, mảng hiệu chuyến bay ⏱, nước mưa O(1) bộ nhớ ⏱, đoạn con vòng ⏱) · `csd201-cs3-on` 6 (số chính phương ⏱, vé du lịch ⏱, dãy có thứ tự mod 10⁹+7 ⏱, tích lớn nhất ⏱, số LIS ⏱, búp bê Nga O(n log n) ⏱) · `csd201-cs4-on` 6 (đặt dấu ± ⏱, mảng con chung ⏱, trộn hai xâu ⏱, đếm dãy con mod p ⏱, hầm ngục điền ngược ⏱, cắt palindrome ⏱) · `csd201-cs5-on` 6 (bỏ ít khoảng ⏱, bắn bóng + bẫy so sánh trừ ⏱, ghép số lớn nhất ⏱, chia kẹo ⏱, quickselect 3 ngả ⏱, cặp a[i] > 2a[j] ⏱) · `csd201-cs6-on` 6 (khôi phục IP, tập con có trùng ⏱, k chữ số tổng n, hoán vị đẹp ⏱, đường Hamilton trên lưới (kiểm bằng DP bitmask), chia k nhóm bằng nhau) · `csd201-cs7-on` 6 (nhỏ thứ k không đệ quy ⏱, path sum III ⏱, từ điển '.' Trie ⏱, XOR lớn nhất ⏱, đếm nhỏ hơn bên phải Fenwick ⏱, gần trùng TreeSet ⏱) · `csd201-cs8-on` 6 (chữ cái lạ Kahn + PQ, ≤ k điểm dừng ⏱, cây cầu ngắn nhất ⏱, đỉnh an toàn ⏱, 0-1 BFS ⏱, đường tăng dài nhất ⏱ rắn 10⁶ ô) · `csd201-cs9-on` 6 (trùng gần k ⏱, tổng k ⏱, ký tự duy nhất ⏱, bộ ba trừ một (O(1) bộ nhớ), đếm bit DP, đảo 32 bit) · `csd201-cs10-on` 8 (LRU tự dựng danh sách kép + soi liên kết prev ⏱, LFU O(1) ⏱, MinStack ⏱, trung vị hai heap ⏱, RandomizedSet O(1) ⏱, TimeMap floorEntry ⏱, trộn k danh sách dùng lại nút ⏱, tích trừ chính nó không chia ⏱) | 62 |
| **tổng** | 66 module | **236** |

⏱ = có ca kiểm độ phức tạp. 🎯 = đề đúng khuôn PE của trường.

## Cơ chế riêng CSD201 (khác pro192)

- **Soi cấu trúc thật** (`_Kiem.java`, phần "CSD201"): `Kiem.don(list,"head","tail","next","info")` đi theo `next` từ head + kiểm
  tail là nút cuối; `kep(...)` kiểm danh sách kép hai chiều (`head.prev == null`, `p.next.prev == p`, tail cuối); `vong(start,…)`
  đi vòng và báo "NOT CIRCULAR"/"BROKEN RING"; `chuoi(first,next,info,max)` có phát hiện chu trình; `nguoc`, `dem`; `cay(root,
  "left","right","info")` in HÌNH cây `B(A,C)` từ liên kết thật, `cao(...)`; `lay(o, field)` đọc trường bất kỳ (kể cả private).
  Mọi đề có `harness` tự kèm `cham/Kiem.java`.
- **⏱ Kiểm độ phức tạp**: spec `hen: { n, ms, can, cham, en?, vi? }` ⇒ đề tự có đoạn "Complexity check" (EN/VI) + ràng buộc;
  ca PERF trong lớp kiểm gọi `Kiem.hen(label, ms, Runnable)` — chạy trên luồng daemon, `join(ms)`; quá hạn in
  `TOO SLOW - not finished after … ms`, ném lỗi in `THROWS …` (đệ quy sâu ⇒ `StackOverflowError`). Hạn 3–4 s; lời giải đúng
  chạy < 1/10 hạn; bản sai cần hàng chục giây (đã thử đột biến: tìm tuần tự, đảo đệ quy, ArrayList.remove(0)). Số liệu lớn
  sinh tất định bằng `Kiem.ngauNhien(n, bound, seed)`. `timeoutMs` mặc định 20 s khi có `hen`.
- **Lớp kiểm theo lệnh** (`_ds.mjs › lopKiem({ truoc, lenh, trangThai, them })`): mỗi dòng stdin một lệnh, in
  `lệnh -> kết quả | trạng thái` (trạng thái đọc từ liên kết thật), ngoại lệ được in `THROWS …` thay vì sập.
- **Luật mã nguồn mới** trong `_cham-mau.mjs`: `raw: true` (soát cả chú thích/chuỗi — dùng cho "không tiếng Việt có dấu"),
  `same: { 'Main.java': vân tay }` (tệp cho sẵn không được sửa; vân tay = sha1 bỏ mọi khoảng trắng — `giuNguyen(tep)` trong
  `_chung.mjs`); `rec: 'no' | 'yes'` (+ `fn`) = luật đệ quy: tách thân từng hàm bằng khớp ngoặc trên mã đã bỏ chú thích, xem hàm có
  tự gọi chính nó không (`deQuy('no', 'Tail')` cấm đệ quy, `deQuy('yes', 'Fib', 'fib')` bắt buộc đệ quy). `release: 8` MẶC ĐỊNH cho mọi đề (`javac --release 8`, như JDK 1.8 phòng thi). `tepThem` = tệp thêm ở gốc bài.
- **🎯 Đề PE đúng khuôn** (`_pe.mjs › dePeFile`): `Main.java` sinh y bản given (menu "Test f1 (1 mark)…", `nextInt`,
  "Your output:", `Lib.viewFile`), `Lib.java` / `Queue.java` / `Stack.java` là bản THẬT trong given materials đề SP26 B5 Paper 4
  (`nguon/_pe/`, đổi CRLF→LF); tệp người học (`MyList.java`/`BSTree.java`/`Graph.java`) = phần (1) cho sẵn + phần (2) có dấu
  `//>> //<<`. Mỗi ca = một lần chạy Main với một lựa chọn: ca hiện dùng `data.txt` của đề (có trong bản tải ở gốc + `tests/N/`),
  ca ẩn dùng `data.txt` khác cùng bố cục. Luật G1 (tệp cho sẵn giữ nguyên) + P1 (tệp người học chỉ ASCII).
  `hoc: { 'A.java': …, 'B.java': … }` = đề sửa NHIỀU tệp (P1, P2…); `mainJava` = Main thật của đề (SP26 P1 in "(2.5 mark)", không có "0. Exit").
  Tệp thật của đề SP26 P1 + B5 P4 nằm ở `nguon/_pe/pe1_*`, `pe3_*` (CRLF→LF; data.txt P1 đã cắt 2 dấu cách thừa sau F08).

- **⭐ CS — đề kiểu phỏng vấn** (`_cs.mjs › deCs`): người học viết một lớp với hàm static; lớp kiểm theo lệnh `RUN …`
  (mảng viết `1,2,3`, `-` = rỗng), `RANDOM` = so với lời giải VÉT CẠN nằm trong lớp kiểm trên hàng nghìn đầu vào ngẫu nhiên
  (hạt giống cố định, in ca sai đầu tiên — y như Ex*.java của gen/java/csN tự kiểm PASS/FAIL), `PERF` = ⏱.

## Còn thiếu / việc tiếp theo

Mọi bài dạy của khoá đã có module (Mục 0 → Ch8, Nâng cao 9.1–9.2, ⭐ CS.1–CS.10, 🎯 Luyện PE 11.1). Việc tuỳ chọn:
- Thêm đề thật khác vào `csd201-on-pe` (khuôn: `dePeFile({ hoc: {tệp: lời giải}, mainJava, cho, data, dataAn })`, lời giải chèn
  vào tệp THẬT bằng `chenSau(tệpThật, [[mốc, mã], …], hàmPhụ)` trong `csd201-on-pe.mjs`; tệp đề vendored ở `nguon/_pe/`).
- Nạp lên prod sau khi deploy (lệnh ở cuối tệp) — CHƯA nạp.
Nguồn ý đề + code thật: `~/Documents/FLM-nguon/_repo/CSD201/gen/src/practice/chN.txt` + `gen/java/chN/Pe*.java`,
`gen/src/extra/csN-on.txt` + `gen/java/csN/Ex*.java` (CHỈ ĐỌC — không sửa flm-nguon).
- Frontend: `frontend/src/lib/codelabToc.ts` đã có `KHOA_CUA_TRACK['csd201-practice']` + `TEN_CHUONG` 0–11.

## Khuôn & lệnh

- Một module = `nguon/<slug-bài-học>.mjs` → `moDun({ slug, ten: 'N.M …', de: [deJava({...}), …] })`. Đánh số chương: 0 = Mục 0,
  1–8 = chương, 9.x = Nâng cao, 10.x = ⭐ CS, 11.x = Luyện PE.
- Code: viết LỜI GIẢI, đánh dấu phần người học làm bằng `//>> <mã giữ chỗ> ⏎ <dòng 2>` … `//<<` ⇒ khởi đầu tự suy ra. Khởi đầu
  phải BIÊN DỊCH được và phải TRƯỢT.
- Output mong đợi KHÔNG viết tay: `node content/codelab/csd201-practice/nguon/_dung.mjs [--chi <tiền tố module>]` chạy lời giải
  bằng chính cham.mjs (`--record`) ⇒ `_ket-qua.json`; ghi `_track.json`; `scripts/codelab-xuat-de.mjs`; `codelab-kiem-noi-dung`;
  rồi giải nén JSON đã xuất ra thư mục tạm và chạy `node cham.mjs`: lời giải ALL CHECKS PASSED, khởi đầu trượt, `javac --release 8`.
- Văn bản đề: EN + VI; mọi `<` trong chữ đề phải escape (`c('List<Integer>')` — đừng viết sẵn `&lt;` trong `c()`, nó escape lần nữa).
- Nạp prod (sau deploy, trong container backend): `node scripts/codelab-create-track.mjs --file content/codelab/csd201-practice/_track.json --apply`
  rồi `node scripts/codelab-seed-authored.mjs --dir content/codelab/csd201-practice --apply --update`.
