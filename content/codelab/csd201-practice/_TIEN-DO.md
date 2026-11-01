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
| **tổng** | 8 module | **26** |

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
  `_chung.mjs`). `release: 8` MẶC ĐỊNH cho mọi đề (`javac --release 8`, như JDK 1.8 phòng thi). `tepThem` = tệp thêm ở gốc bài.
- **🎯 Đề PE đúng khuôn** (`_pe.mjs › dePeFile`): `Main.java` sinh y bản given (menu "Test f1 (1 mark)…", `nextInt`,
  "Your output:", `Lib.viewFile`), `Lib.java` / `Queue.java` / `Stack.java` là bản THẬT trong given materials đề SP26 B5 Paper 4
  (`nguon/_pe/`, đổi CRLF→LF); tệp người học (`MyList.java`/`BSTree.java`/`Graph.java`) = phần (1) cho sẵn + phần (2) có dấu
  `//>> //<<`. Mỗi ca = một lần chạy Main với một lựa chọn: ca hiện dùng `data.txt` của đề (có trong bản tải ở gốc + `tests/N/`),
  ca ẩn dùng `data.txt` khác cùng bố cục. Luật G1 (tệp cho sẵn giữ nguyên) + P1 (tệp người học chỉ ASCII).

## Còn thiếu (làm tiếp theo đúng khuôn)

Ch2 (stack/queue/PQ) · Ch3 (đệ quy) · Ch4 (cây, BST, AVL, heap + 🎯 PE BSTree) · Ch5 (đồ thị + 🎯 PE Graph) · Ch6 (sắp xếp) ·
Ch7 (băm) · Ch8 (KMP, Huffman, LZW/RLE) · Nâng cao (A.1, A.2) · ⭐ CS.1–CS.10 · 🎯 Luyện PE (`csd201-on-pe`: đề thật SP26 B5 P4).
Nguồn ý đề + code thật: `~/Documents/FLM-nguon/_repo/CSD201/gen/src/practice/chN.txt` + `gen/java/chN/Pe*.java`,
`gen/src/extra/csN-on.txt` + `gen/java/csN/Ex*.java` (CHỈ ĐỌC — không sửa flm-nguon).

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
