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
| 🎓 LAB211 | `pro192-lab211-cach-qua-review` 4 (khung Note từ TODO + 3 đề "sửa lỗi thầy bắt": lỗi thường gặp, service giữ repo, Java 8) · `-p0011-change-base-number` 1 · `-p0021-student-management` 1 · `-p0056-worker-management` 1 · `-p0070-ebank-login` 1 · `-p0071-task-management` 1 · `-p0073-handy-expense` 1 | 10 |
| **tổng** | 36 module | **95** |

Đăng ký track: `src/services/codeLab.practice.ts` (`'object-oriented-programming': 'pro192-practice'`; PRACTICE_CATALOG có sẵn dòng PRO192).

### 🎓 LAB211 — cơ chế đã thêm (01/11, đợt 2)

- **Starter rút thân** (`nguon/_rut-than.mjs`, gọi từ `_lay-lab.mjs` khi nguồn chỉ có `solution/`): thân mọi hàm của
  `controller/ service/ repository/`, `utils/Validation|CaptchaUtils|FileUtils` và các hàm nhập của `Main` (giữ `main`,
  `inputChoice`, `inputLine`, mọi constructor) ⇒ `// TODO: <dòng chú thích trên hàm>` + `return <mặc định>` (số 0, false, "", List/Map
  rỗng, còn lại null). Quét Java bằng mặt nạ chú thích/chuỗi. Thêm tên giữ theo bài: `RUT_THEM` trong `_lay-lab.mjs`.
- **Đề "sửa lỗi review"**: `deLab(lab, { id, bay: { thay: [{ tep, tim, thanh }], tepMoi: {} } })` ⇒ khởi đầu = ĐÁP ÁN cài lỗi.
- **Luật thầy T1–T4** (`LUAT_THAY` trong `_chung.mjs`, tự bật cho lab `l211-*`): chỉ view/main in; chỉ main có Scanner; service
  không nhắc tới `*Repository`; Scanner không phải trường static. L2 nay chỉ soát tệp có `Scanner` (Random.nextInt không tính).
- **`release: 8`** cho mọi deLab: cham.mjs biên dịch `--release 8 -Xlint:-options` khi JDK ≥ 9 (bắt `var`, `List.of`…).
- **Ngày hôm nay (P0056)**: `homNay: 'dd/MM/yyyy'` ⇒ cham.mjs thay ngày hôm nay (theo mẫu) trong output bằng chính chữ mẫu,
  cả lúc ghi (`--record`) lẫn lúc so — khớp luôn `expected.txt` của khoá (vốn ghi `dd/MM/yyyy`).
- **Captcha ngẫu nhiên (P0070)**: `captcha: { show: 'Captcha: ([A-Za-z0-9]{5})(?!…)', as: 'XXXXX', prompt: '<lời nhắc nhập captcha>$' }`
  ⇒ ca chạy TƯƠNG TÁC (spawn): gõ input từng dòng, tới dòng có `{CAP1}`/`{CAPMID}`/`{CAP}` thì đợi chương trình đứng ở lời nhắc
  captcha (yên 200 ms; lời nhắc khác thì yên 1,5 s), lấy captcha CUỐI CÙNG đã in rồi điền; khi so che thành `XXXXX` (đúng
  `expected.txt` của khoá). Captcha không đúng 5 chữ/số ⇒ không che ⇒ lệch dòng; ≥ 3 captcha trong một ca mà giống hệt ⇒ trượt
  ("phải sinh mới mỗi lần"). Đột biến đã thử: captcha cố định, nhận chuỗi trống — đều trượt.
- **Tệp không phải .java trong `src/`** (Language_*.properties) được chép vào classpath. Dấu cách cuối giá trị `.properties`
  viết thành `\u0020` lúc vendor (bộ xuất chung cắt khoảng trắng cuối dòng của mọi tệp code — đã làm mất "Account number:  ").
- **Vòng lặp vô tận khi hết input** (Main bắt `catch (Exception)` quanh `nextLine()`): output > 2 MB ⇒ dừng ngay, báo rõ
  (trước đó starter chạy đủ 15 s mỗi ca). `menuThoat` = lựa chọn thoát cho ca `menuRac` (mặc định '0').

## Còn thiếu (làm tiếp theo đúng khuôn)

1. (LAB211 xong — xem trên.) Có thể thêm đề "sửa lỗi review" cho từng bài từ `bay/truoc-khi-sua` của khoá, nhưng các bản đó
   viết lại gần hết (package `constant`, câu chữ khác) nên không hợp làm đề sửa N chỗ.
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
