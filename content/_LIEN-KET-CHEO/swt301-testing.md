# Liên kết chéo SWT301 (Academy) ↔ Testing (Courses)

Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`. Academy: `software-testing`. Courses: `testing`.
Thẻ `<a class="link-card lien-ket-cheo">` cuối khối `ml-en` và `ml-vi` (bên Courses: trong bài; bên SWT301: một cặp `bi(en, vi)`
thêm vào cuối mảng `content` của bài). Chỉ gắn khi đã đọc nội dung bài SWT301 thật (01/11/2026, đợt mẫu Mục 0 + Chương 1).

| SWT301 | Courses testing | Giống | Courses sâu thêm |
|---|---|---|---|
| `swt301-fundamentals-principles` (1.1) | `tst-0-8-bat-dau-tai-day` | định nghĩa kiểm thử, testing ≠ debugging, verification vs validation | test tự động đầu tiên bằng `node:test`, dòng thời gian có nguồn 1878→2023, vì sao tự động hoá ra đời (hồi quy) |
| `swt301-why-testing-necessary` (1.2) | `tst-0-9-bat-dau-khi-khong-co` | chuỗi error → defect → failure → effect, lỗi muộn thì đắt | 5 sự cố thật có nguồn (Knight Capital, Therac-25, Ariane 5, Mars Climate Orbiter, CrowdStrike 2024) + test còn thiếu; tái hiện "trường 21" chạy được |
| `swt301-test-levels` (2.2) | `tst-0-1-kim-tu-thap` | cấp component (unit) và integration | đo thật unit vs HTTP (≈0,015 ms vs ≈1 ms), đặt test LabFlow Lite vào từng cấp |
| `swt301-ci-automation` (8.6) | `tst-0-1-kim-tu-thap` | kim tự tháp Mike Cohn, dạng sai "cây kem" | testing trophy (Dodds 2018), đo tốc độ; CI dựng ở Chương 9 |
| `swt301-junit-hands-on` (8.5) | `tst-0-2-cai-dat` | runner, expected/actual, exit code 1 khi hỏng | Vitest 5 + npm script, lọc test, watch (và vì sao không chạy trong CI/agent AI), JUnit ↔ Vitest |
| `swt301-junit-hands-on` (8.5) | `tst-1-3-ten-test` | `@DisplayName`, `@ParameterizedTest`/`@CsvSource` | `it.each` với `%s`/`$prop`, tên test = chẩn đoán (bug cài sẵn), `.only` bị CI từ chối |
| `swt301-lab2-vi-du-login` (L2.13) | `tst-1-1-cau-truc` | AAA, mỗi case một test | test không khẳng định + `requireAssertions`, `expect.soft`, F.I.R.S.T., bẫy thứ tự tham số JUnit/Vitest |
| `swt301-lab2-labflow-nghiep-vu` (L2.10) | `tst-0-3-gioi-thieu-du-an` | hành trình đặt phòng LabFlow, BR-04/05/06 | LabFlow Lite (Node) — dự án xuyên khoá, test mọi cấp |
| `swt301-blackbox-ep-bva` (4.2) | `tst-1-4-ham-thuan` | phân vùng hợp lệ/không hợp lệ | mỗi phân vùng thành dòng `it.each`, phân vùng "không phải số nguyên" |
| `swt301-blackbox-bva-template` (4.3) | `tst-1-4-ham-thuan` | BVA bắt off-by-one mà EP bỏ lọt | lỗi `< 14` cài sẵn → đúng 1 dòng đỏ; biên trên lưới 30 phút; property-based (fast-check) |
| `swt301-blackbox-decision-state` (4.4) | `tst-1-4-ham-thuan` | bảng quyết định, mỗi cột một luật | cột → dòng `it.each` cho BR-06, số chỗ tại biên 30/31 |
| `swt301-blackbox-state-transition` (4.5) | `tst-2-2-thoi-gian` | trạng thái đổi theo sự kiện: sai PIN lần 3 nuốt thẻ ↔ sai mật khẩu lần 5 khoá tài khoản (BR-02) | chuyển đổi ngược theo thời gian (hết khoá sau đúng 15 phút) test bằng fake timers/đồng hồ tiêm, biên 14:59.999/15:00; Lab 2 cài bug vào chính các chuyển đổi |
| `swt301-experience-based` (6.1) | `tst-2-3-loi` | error guessing — danh sách chỗ hay hỏng từ kinh nghiệm | mỗi phỏng đoán thành test chạy được: repository giả ném ECONNREFUSED, ghi hỏng, khẳng định mã lỗi + cause; bẫy try/catch xanh khi không có gì ném |
| `swt301-test-levels` (2.2) | `tst-3-1-phan-loai` | thay thành phần xung quanh bằng stub (top-down) / driver (bottom-up) để test cô lập | đủ 5 loại double (dummy, stub, spy, mock, fake) dựng bằng Vitest quanh tính năng gửi thư; kiểm trạng thái vs tương tác |
| `swt301-test-levels` (2.2) | `tst-4-1-vi-sao` | integration testing: các thành phần làm việc cùng nhau | tích hợp với PostgreSQL 17 thật (Testcontainers); lỗi đặt trùng chỉ lộ khi hai kết nối thật tranh nhau, sửa bằng ràng buộc EXCLUDE |

Ngoài SWT301 (01/11, Chương 2): `tst-2-1-async` → khoá Node.js `nodejs-1-4-bat-dong-bo` (ôn async/await, thẻ một chiều).

SDN302 (Academy, slug `server-side-development-nodejs-express-mongodb`) ↔ Testing — hai chiều:

| SDN302 | Courses testing | Giống | Courses sâu thêm |
|---|---|---|---|
| `sdn302-4-1-rest-mvc` (4.1) | `tst-3-4-thiet-ke` | tách routes → controllers → services → models | đo cái giá với test: service nhận phụ thuộc qua tham số 11 dòng test, service tự import pool/mail 21 dòng + 2 vi.mock + đồng hồ giả |

Một chiều sang khoá Node.js (Courses): `tst-3-4` → `nodejs-14-2-unit-test`; `tst-4-1` → `nodejs-14-4-db-that`; `tst-4-4` → `nodejs-7-3-crud-transaction`.

Không cặp (đợt mẫu): `tst-1-2-matcher` (SWT301 không dạy matcher JS; phần `assertThrows` đã nằm trong bảng JUnit ↔ Vitest của 1.1), Lab 1 (kiểm thử đột biến — SWT301 chưa có bài tương ứng; Chương 8 Courses sẽ nối với SWT301 Ch.5 coverage).
Không cặp Chương 2: `tst-2-1-async`, `tst-2-4-ngau-nhien`, Lab 2, quiz (SWT301 không dạy promise, fake timers hay seed). Không cặp Chương 3–4: 3.2 (vi.mock/MSW), 3.3, 4.2–4.4, các Lab và quiz. Chương 5–11 Courses còn là khung — gắn thêm khi soạn (gợi ý: Ch8 coverage ↔ `swt301-whitebox-coverage`; Ch10 TDD ↔ `swt301-tdd-bdd`).
