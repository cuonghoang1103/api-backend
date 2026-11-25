# Kế hoạch soạn khoá `doc-code-cu-va-refactor` — Đọc code cũ và refactor

Khung dựng 20/11/2026: `content/courses/doc-code-cu-va-refactor.mjs` (prefix bài `lgc-`, 10 phần = Mục 0 + 9 chương, 58 bài).
Ảnh bìa: `scripts/covers/doc-code-cu-va-refactor.png` (logo tự vẽ `scripts/icons/code-refactor.svg`) — **chưa đẩy R2**.
Category `backend`, level `INTERMEDIATE`. Nguồn yêu cầu: bảng soát khoảng trống P0-2 (+ P1-4 Maven: gộp thành bài `lgc-1-3-maven-that`).

**Người học:** SV SE FPT năm 3, mục tiêu OJT FPT Software SP27 — intern outsourcing hay được giao bảo trì/sửa lỗi dự án Java/Spring/JSP cũ.
**Quy trình soạn:** như `content/courses/docker/_HOP-DONG.md` + chuẩn chung (liên tưởng, tình huống OJT, góc hacker ở ch6, lab trên repo thật,
lab + quiz mỗi chương). Khi soạn: thay phần tử `sections` bằng `doc-code-cu-va-refactor/sNN-*.mjs`, **GIỮ NGUYÊN slug bài và title chương**.

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (yêu cầu) | Bài (slug) |
|---|---|
| Dựng chạy dự án cũ (Java/Spring/JSP + Node) | `lgc-1-1-build-cu`, `lgc-1-2-jdk-node`, `lgc-1-3-maven-that`, `lgc-1-4-du-lieu-docker`, `lgc-1-5-readme` |
| Đọc hiểu codebase lạ, vẽ bản đồ | `lgc-2-1-ban-do-thu-muc` … `lgc-2-5-so-do` |
| Characterization test trước khi sửa | `lgc-3-1-characterization`, `lgc-3-2-golden-master`, `lgc-3-3-seam`, `lgc-3-4-test-qua-http` |
| Code smell | `lgc-4-1-smell-ham` … `lgc-4-4-cong-cu` |
| Refactoring danh mục Fowler bằng IDE | `lgc-5-1-co-ban` … `lgc-5-5-nhip-refactor` |
| Code chết / phụ thuộc cũ (+ góc hacker) | `lgc-6-1-code-chet`, `lgc-6-2-thu-vien-cu`, `lgc-6-3-lo-hong-cu` |
| Nâng cấp phiên bản an toàn | `lgc-7-1-java-8-17`, `lgc-7-2-spring-boot-3`, `lgc-7-3-openrewrite`, `lgc-7-4-node` |
| Sửa lỗi trong code người khác + PR nhỏ | `lgc-8-1-quy-uoc` … `lgc-8-4-nguoi-viet-cu` |
| Dự án: bảo trì ứng dụng Java web cũ | `lgc-9-1-de-bai`, `lgc-9-2-thuc-hien`, `lgc-9-3-ban-giao` |
| Câu phỏng vấn | `lgc-9-4-phong-van` |
| Lab + quiz mỗi chương | `lgc-N-*-lab`, `lgc-N-*-quiz` (N = 1…8), tổng kết `lgc-9-5-tong-ket` |

## 2. Tránh trùng — liên kết chéo

| Ở bài | Dẫn sang | Ranh giới |
|---|---|---|
| `lgc-3-1` | `testing` 10.2 + Lab 10 | Khái niệm characterization test ở đó; ở đây áp lên servlet/DAO Java + Node cũ |
| `lgc-2-1` | `inside-cuongthai` ch2 | Tour repo Node lớn ở đó; ở đây là repo Java/JSP cũ + phương pháp chung |
| Mục 0, `lgc-2-1` | `agile-teamwork` 8.1 | Onboarding ở mức thói quen; ở đây là kỹ thuật |
| `lgc-7-4` | `software-architecture` 10.4/11.4 | Strangler fig / di trú ở tầm kiến trúc |
| `lgc-4-4`, `lgc-5-2` | Academy SWD392 ch4/ch7 | GoF/SOLID là lý thuyết ở đó; ở đây là thao tác refactor |
| `lgc-2-4` | `git` ch2 | Lệnh log/blame đã dạy |
| `lgc-5-1` | `ide-va-do-nghe-dev` ch2 | Phím tắt refactor của IntelliJ |
| `lgc-8-3` | `agile-teamwork` ch3–4, `thuc-tap-cung-claude` | PR/review; mạch ticket Java/Spring nên dùng lại repo lab của khoá này (mục 3.2 bảng soát) |
| `lgc-6-3` | `web-security`, `spring-boot` ch10 | Bảo mật web chuyên sâu |
| — | Academy LAB211 Part 7 | Không trùng: LAB211 là bài tập trường |

## 3. Nguồn chính thống

Feathers "Working Effectively with Legacy Code" (2004) • Fowler "Refactoring" 2nd ed. (2018) + refactoring.com/catalog • refactoring.guru/refactoring/smells •
JetBrains IntelliJ IDEA Docs — Refactor code, Code inspections • VS Code Docs — Refactoring (TypeScript) • OpenRewrite docs • Spring Boot 3.0 Migration Guide
(github.com/spring-projects/spring-boot/wiki) • Oracle JDK 17/21 Migration Guide • Jakarta EE 9 namespace change • Apache Tomcat migration guides •
OWASP Dependency-Check, OWASP Top 10 • NVD CVE-2021-44228 • Node.js release notes. Sự cố dẫn: SEC report Knight Capital (2013), báo cáo ESA Ariane 501 (1996).

## 4. Môi trường lab

- Repo `legacy-thu-vien` (soạn cùng Mục 0): Java 8, Servlet/JSP + JDBC, Maven POM đời cũ, Tomcat 9, MySQL 8 hoặc SQL Server 2019 trong Docker; có
  God Servlet, SQL nối chuỗi, scriptlet trong JSP, mật khẩu lưu thô, code chết — CỐ Ý cho lab. Repo `legacy-express`: Node 14, Express 4 callback, `request` (đã bỏ).
- JDK 8/17/21 song song (SDKMAN trên Mac/Linux; Windows cài tay + JAVA_HOME), nvm/fnm, IntelliJ IDEA Community, VS Code, DBeaver, SonarLint.
- Chỉ khai thác lỗ hổng trên bản lab của mình. Không dùng dữ liệu thật của khách.

## 5. Mục lục khung (tự sinh từ tệp khoá)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Mục 0 — Bảo trì mới là công việc thật** | | |
| | `lgc-0-8-bat-dau-tai-day` | Bắt đầu tại đây (1/2) — Vì sao công việc đầu tiên chủ yếu là code của người khác |
| | `lgc-0-9-bat-dau-khi-khong-co` | Bắt đầu tại đây (2/2) — Sửa mù: sửa một chỗ, hỏng ba chỗ |
| | `lgc-0-1-moi-truong-lab` | 0.1 — Dựng môi trường lab: ứng dụng Java 8 Servlet/JSP cũ và một API Express cũ |
| **Chương 1 — Dựng chạy một dự án cũ** | | |
| | `lgc-1-1-build-cu` | 1.1 — Công cụ build cũ: Ant, POM Maven đời đầu, file WAR, Tomcat javax và jakarta |
| | `lgc-1-2-jdk-node` | 1.2 — Địa ngục phiên bản: JDK 8 và 17, Node cũ, node-gyp và module native |
| | `lgc-1-3-maven-that` | 1.3 — Maven trong dự án thật: nhiều module, xung đột phụ thuộc, kho nội bộ |
| | `lgc-1-4-du-lieu-docker` | 1.4 — Dump cơ sở dữ liệu, dữ liệu mẫu và Docker Compose cho stack cũ |
| | `lgc-1-5-readme` | 1.5 — Viết README mà bạn ước đã có sẵn |
| | `lgc-1-6-lab` | 1.6 — Lab: Từ clone tới trang đăng nhập trong dưới hai giờ |
| | `lgc-1-7-quiz` | 1.7 — Kiểm tra Chương 1 |
| **Chương 2 — Vẽ bản đồ một codebase lạ** | | |
| | `lgc-2-1-ban-do-thu-muc` | 2.1 — Hình dáng repo: thư mục, tầng, điểm vào |
| | `lgc-2-2-lan-request` | 2.2 — Lần một request bằng Find Usages và Call Hierarchy |
| | `lgc-2-3-schema-sp` | 2.3 — Đọc cơ sở dữ liệu: schema, khoá ngoại, stored procedure và trigger |
| | `lgc-2-4-lich-su` | 2.4 — Đọc lịch sử để hiểu "vì sao": git log, blame, ticket cũ |
| | `lgc-2-5-so-do` | 2.5 — Vẽ lại điều đã hiểu: C4 context/container và sơ đồ tuần tự |
| | `lgc-2-6-lab` | 2.6 — Lab: Bản đồ một trang của ứng dụng thư viện cũ |
| | `lgc-2-7-quiz` | 2.7 — Kiểm tra Chương 2 |
| **Chương 3 — Dựng lưới an toàn trước khi chạm vào code** | | |
| | `lgc-3-1-characterization` | 3.1 — Characterization test trên code Java và Node cũ thật |
| | `lgc-3-2-golden-master` | 3.2 — Golden master và approval test cho báo cáo, HTML và file xuất |
| | `lgc-3-3-seam` | 3.3 — Seam và cắt phụ thuộc: tách interface, sprout, wrap |
| | `lgc-3-4-test-qua-http` | 3.4 — Khi không tách được gì: test qua HTTP với cơ sở dữ liệu thật (Testcontainers) |
| | `lgc-3-5-lab` | 3.5 — Lab: Khoá hành vi chức năng "mượn sách" trước khi refactor |
| | `lgc-3-6-quiz` | 3.6 — Kiểm tra Chương 3 |
| **Chương 4 — Code smell: gọi tên cái cảm giác "sai sai"** | | |
| | `lgc-4-1-smell-ham` | 4.1 — Smell trong hàm: hàm dài, nhiều tham số, số ma thuật |
| | `lgc-4-2-smell-lop` | 4.2 — Smell giữa các lớp: God Servlet, Feature Envy, Data Clumps |
| | `lgc-4-3-smell-thay-doi` | 4.3 — Smell khi thay đổi: code lặp, Shotgun Surgery, Divergent Change, switch theo loại |
| | `lgc-4-4-cong-cu` | 4.4 — Công cụ ngửi giúp bạn: inspection IDE, SonarLint, ESLint, độ phức tạp |
| | `lgc-4-5-lab` | 4.5 — Lab: Báo cáo smell cho ứng dụng cũ, xếp theo rủi ro |
| | `lgc-4-6-quiz` | 4.6 — Kiểm tra Chương 4 |
| **Chương 5 — Refactor bằng IDE: danh mục Fowler theo từng bước nhỏ** | | |
| | `lgc-5-1-co-ban` | 5.1 — Bước cơ bản: đổi tên, tách biến/hàm, gộp lại, đổi chữ ký hàm |
| | `lgc-5-2-dieu-kien` | 5.2 — Đơn giản hoá điều kiện: guard clause, đa hình thay cho switch |
| | `lgc-5-3-di-chuyen` | 5.3 — Di chuyển trách nhiệm: chuyển hàm/trường, tách lớp, gom tham số thành đối tượng |
| | `lgc-5-4-du-lieu` | 5.4 — Tổ chức dữ liệu: số ma thuật, kiểu nguyên thuỷ thành đối tượng, đóng gói tập hợp |
| | `lgc-5-5-nhip-refactor` | 5.5 — Nhịp và kỷ luật: không trộn refactor với đổi hành vi, refactor dọn đường |
| | `lgc-5-6-lab` | 5.6 — Lab: Refactor module mượn/trả từ God Servlet thành code phân tầng |
| | `lgc-5-7-quiz` | 5.7 — Kiểm tra Chương 5 |
| **Chương 6 — Code chết, thư viện cũ và nợ bảo mật** | | |
| | `lgc-6-1-code-chet` | 6.1 — Tìm và xoá code chết an toàn |
| | `lgc-6-2-thu-vien-cu` | 6.2 — Kiểm thư viện: npm audit, Maven versions plugin, OWASP Dependency-Check |
| | `lgc-6-3-lo-hong-cu` | 6.3 — Góc hacker trong code cũ: SQL nối chuỗi, JSP không thoát, mật khẩu lưu thô |
| | `lgc-6-4-lab` | 6.4 — Lab: Xoá code chết, vá hai thư viện có lỗ hổng, sửa một lỗi injection |
| | `lgc-6-5-quiz` | 6.5 — Kiểm tra Chương 6 |
| **Chương 7 — Nâng cấp phiên bản an toàn: Java, Spring Boot và Node** | | |
| | `lgc-7-1-java-8-17` | 7.1 — Java 8 → 17/21: API bị gỡ, module, truy cập phản chiếu, tính năng ngôn ngữ mới |
| | `lgc-7-2-spring-boot-3` | 7.2 — Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator |
| | `lgc-7-3-openrewrite` | 7.3 — Tự động hoá di trú bằng recipe OpenRewrite |
| | `lgc-7-4-node` | 7.4 — Node 14 → 20/22: CommonJS và ESM, OpenSSL 3, API bị gỡ, lockfile v3 |
| | `lgc-7-5-lab` | 7.5 — Lab: Nâng ứng dụng cũ lên Java 17 và Tomcat 10 (jakarta), test vẫn xanh |
| | `lgc-7-6-quiz` | 7.6 — Kiểm tra Chương 7 |
| **Chương 8 — Sửa lỗi trong code của người khác** | | |
| | `lgc-8-1-quy-uoc` | 8.1 — Tôn trọng quy ước của dự án, kể cả khi bạn không đồng ý |
| | `lgc-8-2-sua-toi-thieu` | 8.2 — Bản sửa tối thiểu: test trước, thay đổi nhỏ nhất, PR dọn dẹp tách riêng |
| | `lgc-8-3-pr-review` | 8.3 — Mô tả PR và review cho việc bảo trì |
| | `lgc-8-4-nguoi-viet-cu` | 8.4 — Khi người viết đã nghỉ: hỏi ai, ghi lại quyết định, ADR |
| | `lgc-8-5-lab` | 8.5 — Lab: Ba ticket trong ứng dụng cũ, ba PR nhỏ |
| | `lgc-8-6-quiz` | 8.6 — Kiểm tra Chương 8 |
| **Chương 9 — Dự án cuối khoá: một sprint bảo trì ứng dụng web Java cũ** | | |
| | `lgc-9-1-de-bai` | 9.1 — Đề bài: gói bàn giao, backlog 8 ticket, luật chơi |
| | `lgc-9-2-thuc-hien` | 9.2 — Thực hiện sprint: vẽ bản đồ, khoá hành vi, thay đổi, chứng minh |
| | `lgc-9-3-ban-giao` | 9.3 — Bàn giao: README mới, bản đồ, ghi chú nâng cấp, rủi ro còn lại |
| | `lgc-9-4-phong-van` | 9.4 — Câu hỏi phỏng vấn về code cũ và refactor |
| | `lgc-9-5-tong-ket` | 9.5 — Kiểm tra tổng kết và checklist bảo trì |

## 6. Tiến độ soạn chi tiết (22/11/2026)

| Phần | Tệp | Trạng thái |
|---|---|---|
| Mục 0 (3 bài) | `s00-bat-dau.mjs` | ✅ soạn xong — 6 ý Bắt đầu (Feathers 2004, Opdyke 1990/92, Fowler 1999/2018, Spolsky 2000, GAO-16-468, SEC 34-70694, ESA Ariane 501) |
| Chương 1 (7 bài, quiz 12 câu) | `s01-dung-chay.mjs` | ✅ soạn xong |
| Chương 2 (7 bài, quiz 12 câu) | `s02-ban-do.mjs` | ✅ soạn xong |
| Chương 3 (6 bài, quiz 12 câu) | `s03-luoi-an-toan.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — `MOI_TRUONG_3`) |
| Chương 4 (6 bài, quiz 12 câu) | `s04-smell.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — PMD 7.7.0, ESLint 8.57.1, jscpd 3.5.10) |
| Chương 5 (7 bài, quiz 12 câu) | `s05-refactor.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — TypeScript 5.9.3 Language Service, PMD 7.7.0, ESLint 8.57.1) |
| Chương 6 (5 bài, quiz 12 câu) | `s06-code-chet-bao-mat.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — npm 6.14.18, OWASP Dependency-Check 13.0.0 trên JDK 21, JaCoCo 0.8.12) |
| Chương 7 (6 bài, quiz 12 câu) | `s07-nang-cap.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — JDK 8/11/17/21/25, Tomcat 9.0.124/10.1.62, Spring Boot 2.5.15→3.5.16 (+thử 4.1.3), OpenRewrite 6.46.1, Node 14→26) |
| Chương 8 (6 bài, quiz 12 câu) | `s08-sua-loi-nguoi-khac.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — Checkstyle 9.3, Prettier 3.10.1, google-java-format 1.27.0, editorconfig-checker 4.0.2, Git 2.55) |
| Chương 9 (5 bài, quiz tổng kết 20 câu) | `s09-du-an-cuoi-khoa.mjs` | ✅ soạn xong 24/11 (agent rfc, máy nhà Linux — JDK 17/21, Tomcat 10.1.62, MySQL 8.0, Node 24; sprint 8 ticket làm thật) |

Nối vào khoá bằng mảng `DA_SOAN` trong `../doc-code-cu-va-refactor.mjs` (thay phần tử khung cùng chỉ số; slug + title chương khớp khung — đã kiểm).
Tiện ích chung: `_chung.mjs` (dùng lại bộ tô màu của khoá spring-boot + `ml()` song ngữ, `thuatNgu()`, `Q()`).

**Repo lab** `lab/legacy-thu-vien/` (nguồn, commit cuối) + `lab/_tao-lich-su.py` (dựng lịch sử 13 commit 2016–2019, mã băm cố định
— output git trong bài khớp khi dựng lại). Gói zip: `python3 lab/_tao-lich-su.py lab/legacy-thu-vien /tmp/x/legacy-thu-vien && (cd /tmp/x && zip -qr legacy-thu-vien-v1.zip legacy-thu-vien)`
⇒ **CHƯA đẩy R2**: đường trong bài là `ZIP_LAB` (`files/courses/doc-code-cu-va-refactor/legacy-thu-vien-v1.zip`).
Lỗi THẬT của lab dùng làm bài (đừng "sửa" trong nguồn lab): javax.xml.bind (JDK 11+), maven-war-plugin 2.2 (JDK mới), POM thiếu
sourceEncoding, header.jsp thiếu pageEncoding (menu lỗi font — tự lộ ra khi chạy), `dangMuon > max` (SV mượn 4), CASCADE loans→readers,
phí trong sp_overdue_report ≠ Java, available sách 7 lệch sẵn trong dump, commit `4780c81` "refactor" đổi hành vi tìm kiếm trống,
11 chỗ SQL nối chuỗi (grep thấy 9), JSP mở được khi chưa đăng nhập + error.jsp in stack trace, driver 5.1.49 "Public Key Retrieval".
Repo `lab/legacy-express` (soạn 24/11 cùng Ch3): API Express 4.17 kiểu callback, Node 14 (`.nvmrc`), moment 2.24, Jest 26 + supertest 4, lockfile v1
(npm 6) — dùng tiếp cho 7.4. Lỗi THẬT cố ý: `Math.ceil` ngày lẻ (Node 20.000 ≠ Java 18.000 cho phiếu 1 lúc 10:00 24/11/2026), `==` so id,
`lib/kho.js` try/catch bọc cả callback (callback gọi hai lần ⇒ "loi doc du lieu"), Express in stack trace khi NODE_ENV≠production.
⇒ **CHƯA đẩy R2**: `ZIP_EXPRESS` (`files/courses/doc-code-cu-va-refactor/legacy-express-v1.zip`), gói: `(cd lab && zip -qr /tmp/legacy-express-v1.zip legacy-express -x 'legacy-express/node_modules/*')`.
Lời giải Ch3: `lab/loi-giai/ch3/` (README trong đó). Phát hiện mới từ Ch3 (dùng cho Ch5–8): trả cùng phiếu hai lần vẫn "thành công" và cộng bản sách ma;
`readerId` không phải số in lỗi SQL thô (mã 200); `bookId` lạ ⇒ "Illegal operation on empty result set"; ExportServlet ghi tệp tên `C:\thuvien\export\books.csv`
và CSV đổi theo `file.encoding`; dump không có `DROP PROCEDURE` (nạp lần 2 lỗi 1304); nạp fixture bằng client `mysql` phải `--default-character-set=utf8mb4`;
thêm JUnit 5 làm test JUnit 4 biến mất tới khi có vintage; PIT trên nhánh mượn 69% → 80% (còn sống: close/printStackTrace/setCharacterEncoding).
Khung mục 4 ghi `legacy-express` dùng `request` (đã bỏ) — bản hiện tại CHƯA có; thêm khi soạn 6.2/7.4. Bài 1.2 dùng thư mục tạm với node-sass.

**Chương 4 (24/11):** `legacy-express` thêm `routes/muon.js` (POST /api/muon, "Lan 05/2019") + dòng `app.use('/api/muon', …)` trong `app.js` — CỐ Ý:
`taoPhieu` 8 tham số (tham số `loai` chết), callback lồng 4 tầng, số ma thuật 3/14/10/30/1/7, `>=` (khác `>` của Java ⇒ khách bị chặn ở 1 cuốn),
luật "đang có sách quá hạn thì không cho mượn (trừ GV)" CHỈ có ở Node, và GHI THẲNG `data/phieu.json` bằng `fs.writeFile` (đọc-tính-ghi không khoá):
2 POST đồng thời ⇒ cùng trả id 6; đo 5 lượt: 4 lượt mất phiếu, 1 lượt hỏng JSON ⇒ mọi endpoint 500 ("loi doc du lieu"). Dùng cho Ch5 (Move writes vào kho)
và Ch8 (ticket "app báo tạo phiếu nhưng thủ thư không thấy"). ⇒ **gói lại `legacy-express-v1.zip`** trước khi đẩy R2 (lệnh gói ở trên không đổi).
Lời giải Ch4: `lab/loi-giai/ch4/` (pom-ch4.xml, smell-pmd.xml, do-phuc-tap.xml, diem-nong.py, eslintrc-smell.json, README).
Số đo dùng lại ở chương sau: PMD 12 vi phạm (doPost NCSS 111 / cyclomatic 20 / cognitive 36; GodClass KHÔNG bắt vì WMC 25), CPD 2 bản chép,
ESLint 51 → 36 sau khi chỉnh (--max-warnings 36), hotspot BookServlet 150 (6 lần sửa × WMC 25), ticket giả định TV-95 "thêm loại NCS" = 9 chỗ / 6 tệp.

**Chương 5 (24/11):** refactor THẬT trên nhánh `ch5` (18 commit Java, 21 → 33 test; 11 commit Node, 8 → 21 test), commit nào cũng xanh
(vòng kiểm từng commit trong bài 5.6). Lời giải: `lab/loi-giai/ch5/` = `git format-patch` (áp bằng `git am`) + `tools/ts-sua.mjs`
(TypeScript Language Service không giao diện — liệt kê/tách/đổi tên/bỏ tham số), `tools/tcr.sh`, `tools/phuc-tap.py`.
Cấu trúc sau Ch5 (Ch6–9 dựa vào): `service/MuonTraService` (KetQua), `dao/PhieuMuonDAO` (SQL NỐI CHUỖI GIỮ NGUYÊN — 6.3 sửa),
`dao/ThongKeDAO` (header.jsp hết SQL, còn 1 dòng scriptlet), `model/LoaiDocGia` (enum; `tu()` chuỗi lạ ⇒ KHACH, null ⇒ NPE), `model/KhoangMuon`,
`model/Tien` (long đồng; `hienThiKieuCu()` giữ "18000.0"); Node `lib/luat.js` (bảng luật, hasOwnProperty), `lib/so-phieu.js`, `kho.ghi`.
`package.json` legacy-express: `"test": "jest --runInBand"` (test POST /api/muon ghi chung tệp). Thêm test: `LoginServletCookieTest` (7, không CSDL),
`LoaiDocGiaTest` (3), `MuonTraServiceTest` (2, DAO giả), `__tests__/muon.dac-ta.test.js` (8), `luat.test.js` (3), `so-phieu.test.js` (2).
Nhánh phụ: `ch5-tv41` (fix `>=`, đảo 2 test _BUG), `ch5-ncs` (TV-95 theo đặc tả 4.3: 5 cuốn/21 ngày/1.500 đ/không trần; Node chanKhiQuaHan true).
**Mã ticket đã dùng — giữ thống nhất ở Ch6–9:** TV-41 (`>` giới hạn), TV-95 (NCS), TV-96 (cookie `admin:` ⇒ 500 + token kèm rác vẫn nhận — khoá bằng
2 test _BUG), TV-97 (đổi cách in phí sang "18.000 đ"), **TV-98 (race ghi data/phieu.json — DÀNH cho lab 8.5; test tái hiện có trong bài 5.5,
chưa commit)**, TV-102 (sửa SQL injection PhieuMuonDAO — bài 6.3), LIB-105 (ticket lab 5.6).
Số đo sau Ch5: PMD smell-pmd 12 → 8 (mới sinh: literal "books" ×4 trong MuonTraService), doPost 20/36 → 7/7, ESLint (cấu hình 4.4) 36 → 16
(muon.js 20 → 4, phi.js 7 → 0, so-phieu.js 3 mới), golden master 3 trang giống hệt (menu vẫn mojibake). Còn cố ý: `==` Node (đổi `===` làm đỏ test
docGia chuỗi), `Math.ceil`, `sp_overdue_report` đồng giá 2000.

**Chương 6 (24/11):** nhánh `ch6` (từ `ch5`) — Java 12 commit (33 → 49 test), Node 1 commit (21 test). Lời giải `lab/loi-giai/ch6/`
(java/*.patch, node/*.patch, `tan-cong.sh` 9 đòn chạy trước/sau, tools: mot-ngay.sh, compose.jacoco.yml, ham-chua-chay.py, export-chet.js,
tom-tat-audit.py, tom-tat-odc.py, chay-bam.sh, README). KHÔNG đổi nguồn `lab/legacy-thu-vien` / `lab/legacy-express` (zip như Ch4).
Cấu trúc sau Ch6 (Ch7–9 dựa vào): ExportServlet, `BookDAO.findById`, `xoaSach`, hằng PAGE_SIZE/DATE_FORMAT/EXPORT_DIR đã xoá; mọi SQL dùng
PreparedStatement (PhieuMuonDAO nhận int, `MuonTraService.soNguyen`); `util/Html.thoat` (books/readers/header.jsp); `util/MatKhau` PBKDF2-SHA256
600.000 vòng, tiền tố `pbkdf2-sha256$`, nâng cấp dần trong LoginServlet + `tools/BamMatKhauCu` + `db/migrations/V6_3__mat_khau_bam.sql`
(VARCHAR(255)); lỗi hệ thống in "Loi he thong … (ma loi xxxxxxxx)"; reload4j 1.2.27; `com.mysql:mysql-connector-j` 26.10.0 (kéo protobuf-java
4.36.1), `db.driver=com.mysql.cj.jdbc.Driver`; Node express 4.22.3, moment 2.31.0 (`--save-exact`).
Số đo dùng lại: npm audit --production 24 (18 khuyến cáo) → 0, toàn bộ 66 → 47 (dev: Jest 26 — Ch7); ODC 8 CVE (log4j 6, Connector/J 5.1 2)
→ Connector/J 9.7.0 vẫn 4 CVE (CPU 7/2026) → 26.10.0: 0; đăng nhập ~0,7 s (PBKDF2 trên JDK 8), tên không tồn tại 3 ms (TV-106 dò tên — thử
thách thêm 6.4); PoC qs CVE-2022-24999 trả 200/4 ms (không chạm tới); request@2.88.2 thêm 44 gói production + 7 lỗ hổng (bản sao thí nghiệm,
KHÔNG đưa vào lab — thay request để bài 7.4 nếu muốn). Phát hiện thật: mật khẩu so bằng collation `_ci` + PAD SPACE ("ADMIN123", "admin123   "
vào được); xoá độc giả `0 OR 1=1` xoá cả 5 + CASCADE phiếu; tên có dấu nháy (O'Brien) không thêm được; commons-lang 2.6 escapeHtml đổi chữ Việt
thành thực thể; Tomcat image ghi access log sẵn; dependency:analyze báo nhầm jstl + mysql driver.
Mã ticket mới: TV-103 (xoá export), TV-104 (xoá xoaSach), TV-105 (đăng nhập/PBKDF2), TV-106 (dò tên qua thời gian — để ngỏ), LIB-110 (lab 6.4).
Còn lại cho Ch7–8: TV-96 cookie giả (bí mật "thuvien2016" trong TokenUtil, cookie không HttpOnly), TV-98 race, Jest 26, javax → jakarta.


**Chương 7 (24/11):** nhánh `ch7` (từ `ch6`) — Java 7 commit (49 test giữ nguyên), Node 3 commit (21 test). Nhánh phụ: `ch7-rewrite` (Java, output
OpenRewrite nguyên văn + sửa), `thu-express5` (Node). **Repo lab MỚI `lab/legacy-spring-api`** (Spring Boot 2.5.15, Java 8, H2, 8 test MockMvc;
1 commit, dựng lại bằng `lab/_tao-git-spring.sh` ⇒ mã băm `644975a` như trong bài) ⇒ **CẦN gói + đẩy R2 `legacy-spring-api-v1.zip`**
(`ZIP_SPRING` khai trong s07): `bash lab/_tao-git-spring.sh lab/legacy-spring-api /tmp/x/legacy-spring-api && (cd /tmp/x && zip -qr legacy-spring-api-v1.zip legacy-spring-api)`.
Lời giải `lab/loi-giai/ch7/` (README trong đó). KHÔNG đổi nguồn `lab/legacy-thu-vien` / `lab/legacy-express` (zip như Ch4).
Cấu trúc sau Ch7 (Ch8–9 dựa vào): Java 17 (`maven.compiler.release` 17 + enforcer [17,)), compiler 3.13.0, war 3.4.0, surefire 3.5.2, sourceEncoding UTF-8;
`jakarta.servlet-api 6.0.0` + `jakarta.servlet.jsp-api 3.1.1` (provided), Jakarta Tags 3.0 (jstl-api 3.0.2 loại el-api + glassfish 3.0.1), report.jsp
`uri="jakarta.tags.core"`, web.xml 6.0; Dockerfile `maven:3.9-eclipse-temurin-17` → `tomcat:10.1-jdk17-temurin`; TokenUtil dùng HexFormat;
`MuonTraService.KetQua` và `KhoangMuon` là **record** (truy cập bằng `kq.trang()`…); `NANG-CAP.md` ở gốc repo. Node: `.nvmrc` 24, engines `>=22`,
lockfile v3, jest 30.5.2, supertest 7.3.2, test seam nới regex câu lỗi V8. Spring: nhánh `nang-cap` = Boot 3.5.16/Java 17, GET `/api/sach/` giữ có chủ đích (TV-120).
Số đo dùng lại: 49 test JDK 17/21; golden master giống hệt trên Tomcat 9/JDK17, Tomcat 10.1/JDK17 và JDK21, và qua `webapps-javaee`; e2e 3/3 (103 s);
npm audit 26 (3 low/18 moderate/5 high) → 18 moderate (dev, Jest 30) / production 0; OpenRewrite "Estimate time saved" 2h (Spring), 2h 26m (Java).
Mã ticket mới: LIB-115 (lab 7.5), TV-118 (PR mốc 4 Spring), TV-120 (bỏ dấu "/" cuối phía app di động). Còn lại cho Ch8: TV-96 cookie, TV-98 race,
error.jsp in stack trace (CWE-209 — thấy lại ở 7.5), commons-lang 2.6.


**Chương 8 (24/11):** nhánh `ch8` (từ `ch7`) của legacy-thu-vien = `744ec02` (.editorconfig) → `19419e6` (tools/checkstyle-du-an.xml)
→ merge `tv-108`, `tv-96`, `tv-109` (--no-ff) → `8f7434d` (.github/pull_request_template.md + tools/mo-ta-pr.sh) → `5358c29` (docs/adr/0001, 0002
+ ghi chú ReportServlet). Nhánh minh hoạ giữ lại: `format-aosp` (PR định dạng 2 lượt trên tv-108 — KHÔNG merge). legacy-express `ch8` = `ch7` + merge `tv-98`
(lib/tuan-tu.js, __tests__/muon.dong-thoi.test.js, __tests__/tuan-tu.test.js). Lời giải `lab/loi-giai/ch8/` (patch dựng lại đúng cây ch8 — đã thử `git am`).
KHÔNG đổi nguồn `lab/legacy-thu-vien` / `lab/legacy-express` (zip như Ch4).
Số đo dùng lại (Ch9): 50 test JDK 17, e2e 3/3 (36 s), golden master giống hệt, Checkstyle bộ luật dự án 0 (sun 439 / google 879), legacy-express 24 test;
PR: tv-108 19/10, tv-96 9/9, tv-109 10/3, tv-98 64/2; PR trộn 583/252; gjf Google +1492/−1262, AOSP +559/−244 (cần 2 lượt); Prettier 14/14 tệp.
Phát hiện thật: lệch duy nhất của dump là sách 7 THIẾU 1 bản (chiều ngược TV-108 — kịch bản Q&A #14: sách mất, không sửa); google-java-format sắp import
+ cắt chuỗi (27/31 tệp khác ngoài khoảng trắng); tuanTu v1 treo cả hàng đợi khi hàm xử lý ném lỗi đồng bộ (ECONNABORTED ×2); md5("adminthuvien2016")
⇒ cookie admin giả được (302 /books).
Mã ticket mới (giữ thống nhất ở Ch9): TV-108 (trả hai lần), TV-109 (error.jsp), TV-110 (bí mật cố định TokenUtil — ưu tiên cao, CHƯA sửa),
TV-111 (JSP mở thẳng), TV-112 (sửa dữ liệu sách 7 — không cần), TV-113 (giao dịch ghiTra+congLaiSach), TV-114 (phieu.json → MySQL),
TV-115 (chú thích "ước tính" trên báo cáo), TV-116 (Node cắt ngày lẻ như Java). Q&A #14–16 (kịch bản). Còn lại cho Ch9 backlog: TV-41, TV-95, TV-97,
TV-106, TV-110, TV-111, TV-113, TV-115/116, commons-lang 2.6, mojibake header.jsp.


**Chương 9 (24/11):** nhánh `ch9` (từ `ch8`) của legacy-thu-vien = 10 merge `--no-ff`: tv-41, tv-110, tv-111, tv-113, tv-117, tv-95, tv-122-dac-ta,
tv-122, tv-121, ban-giao. legacy-express `ch9` = `ch8` + merge `tv-95`. Lời giải `lab/loi-giai/ch9/` (patch theo thứ tự merge, NHAT-KY.md, PR/*.md 10 mô tả,
README-du-an.md, tools/chay9.sh). KHÔNG đổi nguồn `lab/legacy-thu-vien` / `lab/legacy-express` (zip như Ch4 — vẫn cần gói lại legacy-express-v1.zip + legacy-spring-api-v1.zip).
Cấu trúc sau Ch9: Java 21 (release 21, enforcer [21,), ảnh maven:3.9-eclipse-temurin-21 → tomcat:10.1-jdk21-temurin); JSP ở `WEB-INF/jsp/` (index.jsp ngoài);
`TokenUtil` HMAC-SHA256 + `khop()` (khoá `THUVIEN_REMEMBER_KEY` ≥ 32 ký tự, .env + .env.example); `PhieuMuonDAO.traPhieu` (giao dịch); `dao/DocGiaDAO`; LoaiDocGia NCS;
golden đã duyệt (menu hết lỗi font, form có NCS); README/docs/ban-do.md/RUI-RO.md mới.
Số đo cuối: 61 test JDK 21, e2e 4/4 (113 s), golden giống hệt, Checkstyle dự án 0, PMD smell 8, Node 24 test, clone sạch → trang sách 31 s (có đệm Docker).
Phát hiện thật (đã vào bài): test TV-113 đỏ SAI lý do (NPE mock thiếu getWriter, cả trước và sau); golden lần 1 TV-117 thừa dòng trống; golden bắt form NCS (unit test không thấy);
TV-122 219 dòng ⇒ tách 2 PR; trang 404 Tomcat lộ phiên bản 10.1.62; `role` không nơi nào kiểm (TV-124); CASCADE xoá phiếu (TV-125).
Mã ticket mới: TV-117 (menu), TV-121 (Java 21), TV-122 (DocGiaDAO), TV-123 (token không hạn), TV-124 (phân quyền), TV-125 (xoá độc giả). Còn mở: xem RUI-RO.md.
