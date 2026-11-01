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
| `swt301-test-types` (2.4, slide 118 Security Tests) | `tst-5-2-xac-thuc` | security testing: phân quyền, mức truy cập thông tin | test API tự động với token thật: 401 token giả/hết hạn (đồng hồ cố định), 403 sai vai trò, 404 lượt đặt của người khác (IDOR, OWASP A01), role trong body → 400 |
| `swt301-system-acceptance` (2.3) | `tst-7-2-luong` | system testing: kiểm các tác vụ đầu-cuối của cả sản phẩm, hộp đen, môi trường giống thật | tự động hoá bằng Playwright trên trình duyệt thật: setup project + storageState (đo thật: KHÔNG nhanh hơn ở LabFlow, nêu khi nào đáng), một lượt đặt đi từ sinh viên tới admin bằng hai browser context, dựng dữ liệu qua API; Lab 7 cài 8 bug ở chỗ nối |
| `swt301-whitebox-coverage` (5.1) | `tst-8-1-do-phu` | statement coverage đếm câu lệnh đã chạy, decision coverage đòi cả hai kết quả; 100% statement ≠ 100% decision | đo bằng Vitest (v8/istanbul) trên LabFlow Lite: bộ test chỉ `toBeDefined` đạt 100% cả bốn chỉ số mà hai bug cài sẵn vẫn xanh; điều kiện ADMIN chưa bao giờ đúng dù đủ nhánh (khe hở condition coverage/MC/DC); file không ai import biến mất khỏi báo cáo; ngưỡng trong cấu hình |
| `swt301-junit-hands-on` (8.5, hộp "100% coverage did not find the bug — mutation testing") | `tst-8-2-mutation` | coverage chỉ chứng minh dòng đã chạy; mutation testing (PIT) đo test có nhận ra thay đổi không | StrykerJS 10.1.1 trên dự án thật: cùng bộ test 100% độ phủ chỉ diệt 41,49% (94 đột biến); đọc đột biến sống → 9 test mới (88,96% → 98,16%); đột biến tương đương; incremental; giá 10,5 s so với 0,8 s |
| `swt301-ci-automation` (8.6, flaky + `Thread.sleep`) | `tst-8-3-flaky` | test chập chờn đỏ khi code không đổi; sleep cố định quá ngắn trên CI chậm, quá dài ở chỗ khác | năm nguyên nhân tái hiện và đo (đồng hồ thật đỏ trước 07:00, 21/100 ngẫu nhiên, 28/100 mạng, 33/100 tranh chấp, 13/20 khi xáo thứ tự); retry biến 17/50 thành 0/50 mà lượt đặt trùng vẫn còn; cách ly bằng tag; sửa tận gốc |

Một chiều thêm (01/11, Chương 8): `tst-8-4-toc-do` → `swt301-ci-automation` (8.6: thời gian chạy theo tầng; phía SWT301 8.6 đã có thẻ sang `tst-8-3-flaky`).

Ngoài SWT301 (01/11, Chương 2): `tst-2-1-async` → khoá Node.js `nodejs-1-4-bat-dong-bo` (ôn async/await, thẻ một chiều).

SDN302 (Academy, slug `server-side-development-nodejs-express-mongodb`) ↔ Testing — hai chiều:

| SDN302 | Courses testing | Giống | Courses sâu thêm |
|---|---|---|---|
| `sdn302-4-1-rest-mvc` (4.1) | `tst-3-4-thiet-ke` | tách routes → controllers → services → models | đo cái giá với test: service nhận phụ thuộc qua tham số 11 dòng test, service tự import pool/mail 21 dòng + 2 vi.mock + đồng hồ giả |
| `sdn302-5-2-jwt-cors` (5.2) | `tst-5-2-xac-thuc` | JWT Bearer bảo vệ route Express | mọi luật bảo vệ thành test: token thiếu/sai/giả/hết hạn, vai trò, dữ liệu người khác; biên hết hạn 09:59:59/10:00:00 |

Một chiều sang khoá Node.js (Courses): `tst-3-4` → `nodejs-14-2-unit-test`; `tst-4-1` → `nodejs-14-4-db-that`; `tst-4-4` → `nodejs-7-3-crud-transaction`;
`tst-5-1` → `nodejs-14-3-supertest`; `tst-8-1`, `tst-8-3` → `nodejs-14-5-do-phu-flaky-ci`; `tst-5-2` → `nodejs-8-3-requireauth-phan-quyen`; `tst-5-3` → `nodejs-6-3-validate-schema`; `tst-5-4` → `nodejs-6-5-hop-dong-api`.
Một chiều sang khoá API Design (phiên khác soạn — KHÔNG sửa file của nó): `tst-5-3` → `api-2-2-validation`.

Không cặp (đợt mẫu): `tst-1-2-matcher` (SWT301 không dạy matcher JS; phần `assertThrows` đã nằm trong bảng JUnit ↔ Vitest của 1.1), Lab 1 (kiểm thử đột biến — SWT301 chưa có bài tương ứng; Chương 8 Courses đã nối: 5.1 ↔ 8.1, 8.5 ↔ 8.2, 8.6 ↔ 8.3).
Không cặp Chương 2: `tst-2-1-async`, `tst-2-4-ngau-nhien`, Lab 2, quiz (SWT301 không dạy promise, fake timers hay seed). Không cặp Chương 3–4: 3.2 (vi.mock/MSW), 3.3, 4.2–4.4, các Lab và quiz. Không cặp Chương 5: 5.1, 5.3, 5.4 (SWT301 không dạy test API/contract), Lab 5, quiz. Không cặp SWT301 ở Chương 6 (SWT301 không dạy test giao diện tự động). Chương 7 (01/11): chỉ 7.2 ↔ `swt301-system-acceptance` (hai chiều); 7.1, 7.3, 7.4, Lab 7, quiz không cặp (SWT301 không dạy Playwright, test chập chờn hay so sánh ảnh chụp); 7.1 có thẻ một chiều sang Courses `nextjs` `nextjs-19-4-playwright-e2e`. Chương 8–11 Courses còn là khung — gắn thêm khi soạn (gợi ý: Ch8 coverage ↔ `swt301-whitebox-coverage`, Ch8 flaky ↔ nhắc lại 7.3; Ch10 TDD ↔ `swt301-tdd-bdd`).

FER202 (Academy, slug `front-end-web-development-with-react`) ↔ Testing — hai chiều (01/11, Chương 6):

| FER202 | Courses testing | Giống | Courses sâu thêm |
|---|---|---|---|
| `fer202-a2-1-testing` (A2.1) | `tst-6-1-testing-library` | render, screen, ưu tiên getByRole, user-event (Jest + RTL) | Vitest + jsdom, form/danh sách LabFlow thật, MSW cho màn hình gọi API, đo bẫy cleanup + jsdom/happy-dom (CORS preflight), Next.js route handler/Server Component, Lab 6 cài 8 bug (2 bug trợ năng) |

Một chiều sang Courses khác (Chương 6): `tst-6-1` → `react` `rx-9-1-testing-library`; `tst-6-2` → `rx-9-2-async`; `tst-6-3` → `rx-6-1-fetch`;
`tst-6-4` → `nextjs` `nextjs-19-2-unit-test-vitest`, `nextjs-11-3-route-handlers`.

Chương 9 Courses (01/11) — Test trong CI:

| Phía kia | Courses testing | Chiều | Giống | Courses sâu thêm |
|---|---|---|---|---|
| SWT301 `swt301-ci-automation` (8.6) | `tst-9-1-github-actions`, `tst-9-3-bat-buoc` | hai chiều (SWT301 thêm MỘT cặp `bi()` có 2 thẻ) | CI build + test mọi thay đổi, đỏ/xanh theo mã thoát, không merge khi đỏ | workflow thật chạy bằng act: npm ci, cache, service PostgreSQL, Playwright --with-deps; một cổng ci-ok, skipped = đạt, pipefail, quarantine |
| Courses `github-actions` `ga-5-1-cache-mua-gi` | `tst-9-1-github-actions` | hai chiều | cache: npm lưu ~/.npm, npm ci vẫn chạy | cả workflow test đo bằng act trên laptop (49,6 s → 15,0 s) |
| Courses `github-actions` `ga-5-4-artifact` | `tst-9-2-bao-cao` | hai chiều | artifact sống lâu hơn runner | bằng chứng test nào cần upload, if: !cancelled(), act nhận tên trùng mà v4 từ chối |
| Courses `github-actions` `ga-14-1-cong-chat-luong` | `tst-9-3-bat-buoc` | hai chiều | job tổng hợp cần always() vì skipped = đạt (bên đó đo trên PR thật của GitHub) | cổng là code có test, \| tee nuốt mã thoát, quarantine |
| Courses `github-actions` `ga-2-5-ma-tran`, `ga-7-2-concurrency` | `tst-9-4-ma-tran` | hai chiều | fail-fast, concurrency | Node 20 đỏ qua MSW, shard theo thời gian, 147 s vs 36 s |
| Courses `git` `git-6-4-bao-ve-nhanh` | `tst-9-3-bat-buoc` | hai chiều | check bắt buộc chặn merge | phía CI: cổng ci-ok thật sự đỏ |
| Courses `nodejs` `nodejs-14-5-do-phu-flaky-ci` | `tst-9-1-github-actions` | hai chiều (theo yêu cầu điều phối Ch9 — trước đây Node chỉ một chiều) | CI chạy bộ test mỗi lần push | workflow của dự án khoá học, tổng duyệt bằng act |

Không cặp Chương 9: Lab 9 và quiz (SWT301 không có bài sửa pipeline); 9.2 không cặp SWT301 (SWT301 không dạy reporter/artifact).
