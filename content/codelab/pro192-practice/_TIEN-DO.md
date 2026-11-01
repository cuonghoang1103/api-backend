# pro192-practice — tiến độ & cách làm tiếp (01/11/2026)

Bộ luyện Code Lab của PRO192 (Academy `object-oriented-programming`). Quyết định của chủ web 01/11: **web không chấm** —
mỗi đề tải về một thư mục, người học làm trên máy với JDK của mình, chạy `node cham.mjs`, đạt hết thì bấm
"Tự đánh dấu đã giải" (`tests.loai = 'manual'` + `chayTaiMay`, như 23 đề manual của testing-practice).

## Đã xong (đã commit)

| Chương | Module (slug = slug bài học) | Đề |
|---|---|---|
| 1 | `pro192-1-1-tu-duy-oo` 3 · `pro192-1-2-cu-phap-java` 4 · `pro192-on-ch1` 5 · `pro192-lab-1-danh-muc-sach` 1 | 13 |
| 2 | `pro192-2-1-lop-doi-tuong` 4 · `pro192-on-ch2` 4 · `pro192-lab-2-sach-va-thanh-vien` 1 | 9 |
| 3 | `pro192-3-1-dong-goi` 3 · `pro192-on-ch3` 4 · `pro192-lab-3-dong-goi-va-luat-du-lieu` 1 | 8 |
| 4 | `pro192-4-1-ke-thua` 3 · `pro192-4-2-da-hinh` 3 · `pro192-on-ch4` 4 · `pro192-lab-4-ke-thua-va-da-hinh` 1 | 11 |
| 5 | `pro192-5-1-abstract-interface` 4 · `pro192-on-ch5` 4 · `pro192-lab-5-truu-tuong-va-interface` 1 | 9 |
| 6 | `pro192-6-1-ngoai-le` 4 · `pro192-on-ch6` 4 · `pro192-lab-6-ngoai-le-muon-tra` 1 | 9 |
| 7 | `pro192-7-1-mang-doi-tuong` 3 · `pro192-on-ch7` 4 · `pro192-lab-7-danh-sach-doi-tuong` 1 | 8 |
| 8 | `pro192-8-1-collections` 4 · `pro192-on-ch8` 4 · `pro192-lab-8-collections` 1 | 9 |
| 9 | `pro192-9-1-file-io` 4 · `pro192-on-ch9` 4 · `pro192-lab-9-luu-tep` 1 | 9 |
| **tổng** | 29 module | **85** |

Đăng ký track: `src/services/codeLab.practice.ts` (`'object-oriented-programming': 'pro192-practice'`; PRACTICE_CATALOG có sẵn dòng PRO192).

## Còn thiếu (làm tiếp theo đúng khuôn)

1. **🎓 LAB211 thực chiến** — 6 bài `pro192-lab211-p0011-change-base-number`, `-p0021-student-management`, `-p0056-worker-management`,
   `-p0070-ebank-login`, `-p0071-task-management`, `-p0073-handy-expense` (+ `pro192-lab211-cach-qua-review` L.0: vài đề nhỏ soát luật).
   Nguồn: `~/Documents/FLM-nguon/_repo/PRO192/gen/lab/l211-*` (CHỈ có `solution/`, không có starter). Việc cần làm:
   - `node nguon/_lay-lab.mjs l211-p0011 …` (chép + đổi khai báo sang List/Map theo luật thầy 29/10);
   - starter: chưa có ⇒ viết một bộ "rút thân hàm" (giữ model/constants/view/main/dto, thay thân phương thức của
     service/repository/controller/utils bằng `// TODO` + giá trị mặc định) hoặc soạn tay TODO như `gen/lab/labN/starter.mjs`;
   - P0056 in ngày hôm nay ⇒ cần phép "chuẩn hoá" (thay `dd/MM/yyyy` bằng chữ cố định cả ở mong đợi lẫn output — thêm tuỳ chọn
     `thayThe: [[regex, chuỗi]]` vào `_cham-mau.mjs › norm`); P0070 có captcha ngẫu nhiên + `.properties` ⇒ cần (a) chép tệp
     không phải .java của `src/` vào classpath khi biên dịch, (b) captcha: ca nhập tương tác (đọc dòng captcha rồi gõ lại) hoặc
     để đề này `khongCham` (chỉ chấm luật L1–L7 + biên dịch). `lab.json` có `cham: false` cho hai bài này.
2. **⭐ Chuyên sâu CS.1–CS.8** — module `pro192-cs1-on` … `pro192-cs8-on` (3–6 đề/bài, Java 17+: đặt `java: 17` trong spec ⇒
   `javac --release 17` và cham.mjs đòi JDK 17). Ý đề + lời giải chạy thật có sẵn ở `gen/src/extra/csN-on.txt` + `gen/java/csN/`.
   Đề đa luồng (CS.8): output phải tất định (join, CountDownLatch, kết quả cuối) — đừng in thứ tự xen kẽ của luồng.
3. **🏁 Dự án cuối khoá** `pro192-du-an-ct-library` — `gen/lab/da/` có starter (8 "TODO DA") + solution + data CSV 200/300/2000 dòng.
4. (tuỳ) 🎯 Luyện PE `pro192-luyen-pe-1..4` — đề kiểu PE câu 1–4 trên dữ liệu khác.
5. Frontend (tuỳ, cùng commit riêng bằng index riêng vì tệp có thay đổi của phiên khác): `frontend/src/lib/codelabToc.ts` —
   thêm `'pro192-practice': 'object-oriented-programming'` vào `KHOA_CUA_TRACK` (cờ `solved` trên trang bài học) và tên chương vào
   `TEN_CHUONG['pro192-practice']`.
6. Nạp prod (sau deploy, trong container backend): `node scripts/codelab-create-track.mjs --file content/codelab/pro192-practice/_track.json --apply`
   rồi `node scripts/codelab-seed-authored.mjs --dir content/codelab/pro192-practice --apply --update`.

## Khuôn & lệnh

- Một module = `nguon/<slug-bài-học>.mjs` → `moDun({ slug, ten: 'N.M …', de: [deJava({...}), …] })` (`_chung.mjs`).
  Đề lab/LAB211: `deLab('<lab>', {…, thay: [[cũ, mới]], menuRac: '<lựa chọn liệt kê>'})` — ca 1 = harness chính thức, thêm
  ca ẩn từ chính input đó với dữ liệu khác + một ca "chọn menu sai đủ kiểu".
- Code: viết LỜI GIẢI, đánh dấu phần người học phải làm bằng `//>> <mã giữ chỗ> ⏎ <dòng 2>` … `//<<` ⇒ khởi đầu tự suy ra
  (hoặc `khoiDau: { 'Tệp.java': … }` cho hẳn tệp khác). Khởi đầu phải BIÊN DỊCH được (trừ đề `khoiDauLoi: true` — "sửa cho biên
  dịch được") và phải TRƯỢT.
- Đề OOP: `main: 'KiemTra', kiem: true, harness: { 'KiemTra.java': … }` — lớp kiểm trong `cham/` dùng `Kiem` (reflection:
  `kieu`, `truong`, `tatCaPrivate`, `phuongThuc`, `tao`, `goi`) để soi cấu trúc mà vẫn biên dịch được với code khởi đầu thiếu hàm.
- Luật mã nguồn: `quyTac: [{ id, en, vi, re, file?, need? }]` (regex trên mã đã bỏ chú thích + nội dung chuỗi); `lab211: true` bật
  L1–L7 (System.exit, chỉ nextLine, khai báo List/Map, catch rỗng, trường private, switch có default, @Override).
- Output mong đợi KHÔNG viết tay: `node content/codelab/pro192-practice/nguon/_dung.mjs [--chi <tiền tố module>]` chạy lời giải
  bằng chính cham.mjs (`--record`) ⇒ `_ket-qua.json`; ghi `_track.json`; gọi `scripts/codelab-xuat-de.mjs`; chạy
  `codelab-kiem-noi-dung`; rồi giải nén JSON đã xuất ra thư mục tạm và chạy `node cham.mjs`: lời giải ALL CHECKS PASSED, khởi đầu
  trượt, `javac --release 8|17` cho cả hai. Lab/LAB211: ca 1 phải trùng `harness/expected.txt` của khoá.
- Văn bản đề: EN + VI; mọi `<` trong chữ đề phải escape (`c('List<String>')` hoặc `&lt;`) — kiem-noi-dung bắt.
