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
