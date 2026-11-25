/**
 * Đọc code cũ và refactor — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 20/11/2026 theo bảng soát khoảng trống P0-2:
 * intern outsourcing thường được giao BẢO TRÌ / sửa lỗi trên dự án Java/Spring/JSP cũ; kho thiếu danh mục code smell và refactoring.
 * Người học: SV SE FPT năm 3 (Node.js + Spring Boot), mục tiêu OJT FPT Software SP27, chưa tự gõ code nhiều.
 * KHÔNG dạy lại — chỉ dẫn link: testing 10.2 + Lab 10 (khái niệm characterization test), inside-cuongthai ch2 (tour repo Node lớn),
 * agile-teamwork 8.1 (onboarding), software-architecture 10.4/11.4 (di trú ở tầm kiến trúc), SWD392 ch4/7 (GoF/SOLID),
 * git ch2 (đọc lịch sử, blame), debug-co-phuong-phap (gỡ lỗi), ide-va-do-nghe-dev ch2 (phím tắt IntelliJ).
 * Kế hoạch + bảng phủ: content/courses/doc-code-cu-va-refactor/_KE-HOACH.md. Soạn theo content/courses/docker/_HOP-DONG.md.
 * Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật, GIỮ NGUYÊN slug bài và title chương.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './doc-code-cu-va-refactor/s00-bat-dau.mjs';
import s01 from './doc-code-cu-va-refactor/s01-dung-chay.mjs';
import s02 from './doc-code-cu-va-refactor/s02-ban-do.mjs';
import s03 from './doc-code-cu-va-refactor/s03-luoi-an-toan.mjs';
import s04 from './doc-code-cu-va-refactor/s04-smell.mjs';
import s05 from './doc-code-cu-va-refactor/s05-refactor.mjs';
import s06 from './doc-code-cu-va-refactor/s06-code-chet-bao-mat.mjs';
import s07 from './doc-code-cu-va-refactor/s07-nang-cap.mjs';
import s08 from './doc-code-cu-va-refactor/s08-sua-loi-nguoi-khac.mjs';
import s09 from './doc-code-cu-va-refactor/s09-du-an-cuoi-khoa.mjs';

// Các chương đã soạn chi tiết thay phần tử tương ứng của khung (giữ nguyên slug bài + title chương).
const DA_SOAN = [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09];

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'doc-code-cu-va-refactor',
    title: 'Legacy Code: Reading, Testing and Refactoring',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/doc-code-cu-va-refactor.png?v=1',
    shortDescription: 'Most first jobs are maintenance. Run an old Java/Spring or Node codebase, map it, pin behaviour with tests, spot code smells, refactor safely with your IDE, upgrade Java/Spring Boot and ship small reviewable fixes.|||Việc đầu tiên khi đi làm thường là bảo trì. Dựng chạy codebase Java/Spring hay Node cũ, vẽ bản đồ, khoá hành vi bằng test, nhận ra code smell, refactor an toàn bằng IDE, nâng Java/Spring Boot, gửi bản sửa nhỏ.',
    description: 'Khoá thực hành cho người sắp OJT ở công ty outsourcing, nơi intern hay được giao sửa lỗi và bảo trì dự án có sẵn hơn là viết mới. Bạn nhận một ứng dụng web Java cũ (Servlet/JSP + JDBC, Java 8, build bằng Maven đời cũ) và một API Node.js cũ, rồi đi đủ vòng: dựng chạy được dù README thiếu, vẽ bản đồ thư mục và luồng request bằng IDE, đọc schema và stored procedure, viết test đặc tả hành vi hiện tại trước khi sửa, nhận diện code smell theo danh mục, refactor theo danh mục Fowler bằng công cụ tự động của IntelliJ/VS Code, gỡ code chết và lỗ hổng trong thư viện cũ, nâng Java 8 → 17/21 và Spring Boot 2 → 3, rồi sửa lỗi bằng PR nhỏ theo quy ước của dự án. Mỗi chương có lab trên chính repo đó; dự án cuối khoá là một đợt bảo trì trọn vẹn có bàn giao.',
    whatYouLearn: 'Dựng chạy một dự án cũ thiếu tài liệu; tìm điểm vào và lần một request qua Servlet/JSP, Spring và Express bằng find usages/call hierarchy; đọc schema, stored procedure và lịch sử git để hiểu "vì sao"; viết characterization test và tạo seam để test code khó test; nhận diện các code smell phổ biến; thực hiện refactoring theo danh mục (Extract Method, Move, Extract Class, Replace Conditional with Polymorphism…) bằng IDE; xoá code chết an toàn; vá thư viện có lỗ hổng; nâng phiên bản Java/Spring/Node theo từng bước có CI; sửa lỗi trong code người khác bằng PR nhỏ, tách refactor khỏi thay đổi hành vi.',
    requirements: 'Đọc được Java và JavaScript cơ bản, biết Git, SQL nhập môn, HTTP. Nên học "IDE & đồ nghề dev" (phím tắt IntelliJ) và "Debug có phương pháp" trước hoặc song song.',
    documentsNote: 'Tài liệu chính: "Working Effectively with Legacy Code" (Michael Feathers) • "Refactoring", 2nd ed. và refactoring.com/catalog (Martin Fowler) • refactoring.guru (code smells) • JetBrains IntelliJ IDEA Docs — Refactoring • OpenRewrite docs (docs.openrewrite.org) • Spring Boot 3.0 Migration Guide (GitHub wiki spring-projects/spring-boot) • Oracle JDK Migration Guide • OWASP Dependency-Check • Node.js release notes/changelog.',
  },
  sections: khung('lgc', [
    ['Section 0 — Maintenance is the real job', 'Mục 0 — Bảo trì mới là công việc thật', 'Vì sao đọc và sửa code cũ là kỹ năng được trả tiền nhiều nhất của người mới.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Why your first job is mostly other people\'s code', 'Bắt đầu tại đây (1/2) — Vì sao công việc đầu tiên chủ yếu là code của người khác', 'Định nghĩa của Feathers: legacy code là code chưa có test · Lịch sử: Fowler "Refactoring" 1999 và bản 2018 · Liên tưởng: sửa điện trong một ngôi nhà cũ không có sơ đồ · Lộ trình 9 chương và dự án bảo trì cuối khoá · Câu phỏng vấn: "bạn tiếp cận một codebase lạ thế nào"'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Editing blind: fix one thing, break three', 'Bắt đầu tại đây (2/2) — Sửa mù: sửa một chỗ, hỏng ba chỗ', 'Sửa không có test, refactor lẫn đổi hành vi trong một commit · Sự cố thật có nguồn: Knight Capital 2012 (code chết bị kích hoạt lại) · Ariane 5 1996 (dùng lại code cũ ngoài giả định) · Tình huống OJT: ticket "sửa nhỏ" trong servlet 2.000 dòng'],
      ['moi-truong-lab', 'Lab setup: an old Java 8 Servlet/JSP app and an old Express API', 'Dựng môi trường lab: ứng dụng Java 8 Servlet/JSP cũ và một API Express cũ', 'Cài nhiều JDK song song (SDKMAN trên Mac/Linux, cài tay trên Windows) · Tomcat 9, MySQL/SQL Server bằng Docker · nvm cho Node cũ · Lab: clone hai repo, chưa chạy — ghi lại mọi chỗ thiếu'],
    ]],
    ['Chapter 1 — Getting an old project to run', 'Chương 1 — Dựng chạy một dự án cũ', 'Chưa chạy được thì chưa hiểu được.', [
      ['build-cu', 'Old build tools: Ant, early Maven POMs, WAR files, Tomcat javax vs jakarta', 'Công cụ build cũ: Ant, POM Maven đời đầu, file WAR, Tomcat javax và jakarta', 'Đọc pom.xml/build.xml để biết cần gì · Tomcat 9 (javax) vs 10+ (jakarta) — vì sao WAR cũ không chạy trên Tomcat mới · Lab: build ra WAR và deploy lên Tomcat 9'],
      ['jdk-node', 'Version hell: JDK 8 vs 17, old Node, node-gyp and native modules', 'Địa ngục phiên bản: JDK 8 và 17, Node cũ, node-gyp và module native', 'Đọc lỗi "Unsupported class file major version" · .nvmrc, .sdkmanrc · node-sass, bcrypt biên dịch hỏng và cách thay · Tình huống: máy công ty Windows, dự án viết cho Linux'],
      ['maven-that', 'Maven for real projects: multi-module, dependency conflicts, internal repos', 'Maven trong dự án thật: nhiều module, xung đột phụ thuộc, kho nội bộ', 'mvn dependency:tree, -U, -o · Nearest-wins và exclusions · settings.xml trỏ kho nội bộ công ty (Nexus/Artifactory) — không commit mật khẩu · Gradle mức đọc hiểu'],
      ['du-lieu-docker', 'Database dump, seed data and a Docker Compose for the old stack', 'Dump cơ sở dữ liệu, dữ liệu mẫu và Docker Compose cho stack cũ', 'Khôi phục từ file .sql/.bak · Dữ liệu tối thiểu để đăng nhập được · Docker hoá môi trường để cả nhóm chạy giống nhau · Góc an ninh: không mang dump dữ liệu thật của khách về máy cá nhân'],
      ['readme', 'Writing the README you wish you had', 'Viết README mà bạn ước đã có sẵn', 'Cài gì, chạy gì, tài khoản thử, lỗi hay gặp · Đây là PR đầu tiên có giá trị nhất của một intern'],
      ['lab', 'Lab: From clone to login page in under two hours', 'Lab: Từ clone tới trang đăng nhập trong dưới hai giờ', 'Cả hai repo · Đạt khi: người khác làm theo README của bạn chạy được ngay'],
      ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu: javax/jakarta · major version · dependency tree · dữ liệu khách'],
    ]],
    ['Chapter 2 — Mapping an unfamiliar codebase', 'Chương 2 — Vẽ bản đồ một codebase lạ', 'Không đọc từng dòng — đọc có chủ đích.', [
      ['ban-do-thu-muc', 'The shape of the repo: folders, layers, entry points', 'Hình dáng repo: thư mục, tầng, điểm vào', 'web.xml và servlet-mapping, @Controller, file routes Express · Đếm dòng theo thư mục (cloc) để biết chỗ nặng · Liên kết inside-cuongthai ch2 (tour repo Node lớn — không dạy lại)'],
      ['lan-request', 'Tracing one request with Find Usages and Call Hierarchy', 'Lần một request bằng Find Usages và Call Hierarchy', 'JSP form → Servlet → DAO → SQL · Spring: controller → service → repository · Express: route → middleware → handler · Lab: vẽ sơ đồ tuần tự cho chức năng "mượn sách"'],
      ['schema-sp', 'Reading the database: schema, foreign keys, stored procedures and triggers', 'Đọc cơ sở dữ liệu: schema, khoá ngoại, stored procedure và trigger', 'Sinh sơ đồ ER từ DB có sẵn (DBeaver) · Logic nghiệp vụ trốn trong stored procedure/trigger · Lab: tìm vì sao xoá độc giả thì phiếu mượn biến mất'],
      ['lich-su', 'Reading history for the "why": git log, blame, old tickets', 'Đọc lịch sử để hiểu "vì sao": git log, blame, ticket cũ', 'blame theo dòng, log -S tìm lúc một chuỗi xuất hiện · Commit message tệ thì đọc ticket/PR · Liên kết git ch2 (lệnh đã dạy) · Hỏi đúng người, hỏi kèm bản đồ bạn đã vẽ'],
      ['so-do', 'Drawing what you learned: C4 context/container and a sequence diagram', 'Vẽ lại điều đã hiểu: C4 context/container và sơ đồ tuần tự', 'Một trang, cập nhật vào repo · Mermaid/PlantUML để sơ đồ sống cùng code'],
      ['lab', 'Lab: A one-page map of the legacy library app', 'Lab: Bản đồ một trang của ứng dụng thư viện cũ', 'Đạt khi: điểm vào, 3 luồng chính, bảng chính, chỗ rủi ro — người mới đọc 10 phút là định hướng được'],
      ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu: tìm điểm vào · call hierarchy · logic trong trigger · git log -S'],
    ]],
    ['Chapter 3 — A safety net before you touch anything', 'Chương 3 — Dựng lưới an toàn trước khi chạm vào code', 'Khoá hành vi hiện tại bằng test — kể cả hành vi sai.', [
      ['characterization', 'Characterization tests on real legacy Java and Node code', 'Characterization test trên code Java và Node cũ thật', 'Khái niệm đã dạy ở testing 10.2/Lab 10 — ở đây áp lên servlet và DAO · Ghi lại output hiện tại, kể cả bug · JUnit 5 + Mockito, Jest/Vitest'],
      ['golden-master', 'Golden master and approval tests for reports, HTML and exports', 'Golden master và approval test cho báo cáo, HTML và file xuất', 'Chụp output lớn rồi so khác biệt · Loại bỏ phần thay đổi (ngày giờ, id) · ApprovalTests'],
      ['seam', 'Seams and breaking dependencies: extract interface, sprout, wrap', 'Seam và cắt phụ thuộc: tách interface, sprout, wrap', 'Code gọi thẳng DriverManager, new Date(), static — làm sao test · Sprout method: thêm code mới đã có test bên cạnh code cũ · Liên tưởng: lắp van khoá trước khi sửa ống nước'],
      ['test-qua-http', 'When nothing can be isolated: testing through HTTP and a real database (Testcontainers)', 'Khi không tách được gì: test qua HTTP với cơ sở dữ liệu thật (Testcontainers)', 'Test đầu-cuối mỏng cho luồng quan trọng · Dữ liệu khởi tạo cố định · Chi phí và giới hạn'],
      ['lab', 'Lab: Pin the behaviour of "borrow a book" before refactoring it', 'Lab: Khoá hành vi chức năng "mượn sách" trước khi refactor', 'Đạt khi: ≥ 8 test xanh mô tả cả trường hợp lỗi, đổi một dòng logic là có test đỏ'],
      ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu: test giữ bug hay sửa bug · seam · sprout vs wrap · golden master'],
    ]],
    ['Chapter 4 — Code smells: naming what feels wrong', 'Chương 4 — Code smell: gọi tên cái cảm giác "sai sai"', 'Một danh mục chung để cả đội nói cùng một ngôn ngữ.', [
      ['smell-ham', 'Smells inside functions: Long Method, Long Parameter List, Magic Numbers', 'Smell trong hàm: hàm dài, nhiều tham số, số ma thuật', 'Ví dụ thật từ servlet 300 dòng · Khi comment là dấu hiệu cần đặt tên lại · Lab: chấm 5 hàm theo danh mục'],
      ['smell-lop', 'Smells between classes: God Servlet, Feature Envy, Data Clumps', 'Smell giữa các lớp: God Servlet, Feature Envy, Data Clumps', 'Servlet làm cả SQL, HTML và nghiệp vụ · Một nhóm tham số luôn đi cùng nhau · Tiền lưu bằng double, trạng thái bằng String'],
      ['smell-thay-doi', 'Smells of change: Duplicated Code, Shotgun Surgery, Divergent Change, switch on type', 'Smell khi thay đổi: code lặp, Shotgun Surgery, Divergent Change, switch theo loại', 'Một yêu cầu nhỏ phải sửa 12 file · Một file đổi vì 5 lý do khác nhau · Scriptlet SQL trong JSP'],
      ['cong-cu', 'Tools that smell for you: IDE inspections, SonarLint, ESLint, complexity', 'Công cụ ngửi giúp bạn: inspection IDE, SonarLint, ESLint, độ phức tạp', 'Cyclomatic/cognitive complexity · Đừng sửa mọi cảnh báo — ưu tiên chỗ hay thay đổi (hotspot = độ phức tạp × tần suất sửa) · Liên kết SWD392 (SOLID/GoF) không dạy lại'],
      ['lab', 'Lab: A smell report for the legacy app, ranked by risk', 'Lab: Báo cáo smell cho ứng dụng cũ, xếp theo rủi ro', 'Đạt khi: 10 smell có vị trí, tên trong danh mục, đề xuất refactoring và lý do ưu tiên'],
      ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu: nhận diện smell từ đoạn code · hotspot · Primitive Obsession'],
    ]],
    ['Chapter 5 — Refactoring with the IDE: the Fowler catalogue in small steps', 'Chương 5 — Refactor bằng IDE: danh mục Fowler theo từng bước nhỏ', 'Đổi cấu trúc, giữ nguyên hành vi — chạy test sau mỗi bước.', [
      ['co-ban', 'The basic moves: Rename, Extract Variable/Method, Inline, Change Signature', 'Bước cơ bản: đổi tên, tách biến/hàm, gộp lại, đổi chữ ký hàm', 'Làm bằng IntelliJ (Shift+F6, Ctrl+Alt+V/M) và VS Code (F2, Ctrl+.) · Vì sao refactor tự động an toàn hơn sửa tay · Commit sau mỗi bước xanh'],
      ['dieu-kien', 'Simplifying conditionals: guard clauses, polymorphism instead of switch', 'Đơn giản hoá điều kiện: guard clause, đa hình thay cho switch', 'Ba tầng if lồng nhau thành guard clause · switch theo loại thành lớp con/strategy · Lab: tính phí trễ hạn theo loại độc giả'],
      ['di-chuyen', 'Moving features: Move Method/Field, Extract Class, Introduce Parameter Object', 'Di chuyển trách nhiệm: chuyển hàm/trường, tách lớp, gom tham số thành đối tượng', 'Feature Envy → Move Method · God Servlet → Servlet mỏng + Service + DAO · Lab: tách SQL khỏi JSP'],
      ['du-lieu', 'Organising data: magic numbers, primitives to objects, encapsulated collections', 'Tổ chức dữ liệu: số ma thuật, kiểu nguyên thuỷ thành đối tượng, đóng gói tập hợp', 'Tiền từ double sang BigDecimal/Money · Trạng thái từ String sang enum · Mỗi thay đổi có test bảo vệ'],
      ['nhip-refactor', 'Rhythm and discipline: never mix refactor and behaviour change, preparatory refactoring', 'Nhịp và kỷ luật: không trộn refactor với đổi hành vi, refactor dọn đường', '"Làm cho thay đổi trở nên dễ, rồi làm thay đổi dễ" (Kent Beck) · Tách PR refactor khỏi PR tính năng · Khi nào KHÔNG nên refactor (deadline, code sắp bỏ)'],
      ['lab', 'Lab: Refactor the borrow/return module from God Servlet to layered code', 'Lab: Refactor module mượn/trả từ God Servlet thành code phân tầng', 'Chỉ dùng refactor tự động của IDE khi có thể · Đạt khi: test Ch3 vẫn xanh sau mỗi commit, ≥ 10 commit nhỏ'],
      ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu: chọn refactoring cho smell · guard clause · không trộn thay đổi'],
    ]],
    ['Chapter 6 — Dead code, old dependencies and security debt', 'Chương 6 — Code chết, thư viện cũ và nợ bảo mật', 'Dọn những thứ không ai dám xoá.', [
      ['code-chet', 'Finding and removing dead code safely', 'Tìm và xoá code chết an toàn', 'IntelliJ unused declaration, knip/ts-prune cho Node, độ phủ test · Log hoặc đếm lượt gọi trước khi xoá · Knight Capital: vì sao cờ và code chết phải đi cùng nhau · git giữ lịch sử — đừng comment-out'],
      ['thu-vien-cu', 'Auditing dependencies: npm audit, Maven versions plugin, OWASP Dependency-Check', 'Kiểm thư viện: npm audit, Maven versions plugin, OWASP Dependency-Check', 'Đọc báo cáo CVE: có thật sự ảnh hưởng không · Thư viện bỏ hoang (log4j 1.x) · Sự cố thật: Log4Shell CVE-2021-44228 (12/2021)'],
      ['lo-hong-cu', 'The hacker\'s view of old code: concatenated SQL, unescaped JSP, plaintext passwords', 'Góc hacker trong code cũ: SQL nối chuỗi, JSP không thoát, mật khẩu lưu thô', 'Khai thác thử trên bản lab (SQL injection, XSS) · Sửa: PreparedStatement, JSTL c:out, bcrypt khi đăng nhập lại · Chỉ thử trên môi trường lab của mình'],
      ['lab', 'Lab: Remove dead code, patch two vulnerable dependencies, fix one injection', 'Lab: Xoá code chết, vá hai thư viện có lỗ hổng, sửa một lỗi injection', 'Đạt khi: test vẫn xanh, báo cáo audit trước/sau, payload tấn công không còn tác dụng'],
      ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu: bằng chứng code chết · đọc CVE · PreparedStatement · XSS trong JSP'],
    ]],
    ['Chapter 7 — Upgrading safely: Java, Spring Boot and Node', 'Chương 7 — Nâng cấp phiên bản an toàn: Java, Spring Boot và Node', 'Từng bước, CI xanh sau mỗi bước.', [
      ['java-8-17', 'Java 8 → 17/21: removed APIs, modules, reflective access, new language features', 'Java 8 → 17/21: API bị gỡ, module, truy cập phản chiếu, tính năng ngôn ngữ mới', 'javax.xml.bind và JAXB phải thêm thư viện · --add-opens · Nâng từng mốc LTS (8 → 11 → 17 → 21) · Lab: nâng repo thư viện lên Java 17'],
      ['spring-boot-3', 'Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator', 'Spring Boot 2 → 3: javax → jakarta, Spring Security 6, properties migrator', 'Lên 2.7 trước rồi mới lên 3.x · spring-boot-properties-migrator · SecurityFilterChain thay WebSecurityConfigurerAdapter · Đọc Migration Guide chính thức'],
      ['openrewrite', 'Automating migrations with OpenRewrite recipes', 'Tự động hoá di trú bằng recipe OpenRewrite', 'Chạy recipe Java 17 và Spring Boot 3 · Đọc diff máy sinh, không nhận mù · So với để AI tự sửa'],
      ['node', 'Node 14 → 20/22: CommonJS vs ESM, OpenSSL 3, removed APIs, lockfile v3', 'Node 14 → 20/22: CommonJS và ESM, OpenSSL 3, API bị gỡ, lockfile v3', 'Lỗi ERR_REQUIRE_ESM, ERR_OSSL_EVP_UNSUPPORTED · Nâng Express 4 → 5 mức nhận biết · Liên kết software-architecture 10.4/11.4 (strangler fig ở tầm kiến trúc)'],
      ['lab', 'Lab: Upgrade the legacy app to Java 17 and Tomcat 10 (jakarta) with green tests', 'Lab: Nâng ứng dụng cũ lên Java 17 và Tomcat 10 (jakarta), test vẫn xanh', 'Đạt khi: mỗi mốc một PR, CI xanh, ghi chú nâng cấp cho đội'],
      ['quiz', 'Chapter 7 quiz', 'Kiểm tra Chương 7', '10 câu: thứ tự nâng · javax/jakarta · OpenRewrite · lỗi OpenSSL 3'],
    ]],
    ['Chapter 8 — Fixing bugs in someone else\'s code', 'Chương 8 — Sửa lỗi trong code của người khác', 'Bản sửa nhỏ, đúng quy ước, dễ review.', [
      ['quy-uoc', 'Respecting the project\'s conventions, even when you disagree', 'Tôn trọng quy ước của dự án, kể cả khi bạn không đồng ý', 'Đọc .editorconfig, checkstyle, eslint · Không reformat cả file · Boy Scout rule có giới hạn'],
      ['sua-toi-thieu', 'The minimal fix: test first, smallest change, separate cleanup PR', 'Bản sửa tối thiểu: test trước, thay đổi nhỏ nhất, PR dọn dẹp tách riêng', 'Test đỏ tái hiện lỗi → sửa → xanh · Diff dễ đọc trong 5 phút · Tình huống OJT: leader yêu cầu tách PR 900 dòng'],
      ['pr-review', 'PR description and review for maintenance work', 'Mô tả PR và review cho việc bảo trì', 'Nguyên nhân gốc · phạm vi ảnh hưởng · cách kiểm · rủi ro · Trả lời review không tự ái · Liên kết agile-teamwork ch3/ch4 và thuc-tap-cung-claude'],
      ['nguoi-viet-cu', 'When the author is gone: asking, documenting decisions, ADRs', 'Khi người viết đã nghỉ: hỏi ai, ghi lại quyết định, ADR', 'Ai còn biết: BA, tester, khách · Ghi chú ngay trong code khi phát hiện điều bất ngờ · ADR ngắn cho quyết định lớn'],
      ['lab', 'Lab: Three tickets in the legacy app, three small PRs', 'Lab: Ba ticket trong ứng dụng cũ, ba PR nhỏ', 'Đạt khi: mỗi PR < 200 dòng, có test, mô tả đủ 4 mục, qua checklist review'],
      ['quiz', 'Chapter 8 quiz', 'Kiểm tra Chương 8', '10 câu: bản sửa tối thiểu · tách PR · quy ước · ADR'],
    ]],
    ['Chapter 9 — Capstone: a maintenance sprint on an old Java web app', 'Chương 9 — Dự án cuối khoá: một sprint bảo trì ứng dụng web Java cũ', 'Nhận bàn giao, bảo trì, bàn giao lại.', [
      ['de-bai', 'The brief: handover pack, backlog of 8 tickets, rules', 'Đề bài: gói bàn giao, backlog 8 ticket, luật chơi', 'Lỗi, tính năng nhỏ, nâng Java, refactor một module, vá bảo mật · Không viết lại từ đầu · Rubric chấm'],
      ['thuc-hien', 'Doing the sprint: map, pin, change, prove', 'Thực hiện sprint: vẽ bản đồ, khoá hành vi, thay đổi, chứng minh', 'Nhật ký hằng ngày · PR nhỏ · Test trước/sau · Mỗi ticket "Đạt khi" rõ ràng'],
      ['ban-giao', 'Handover: updated README, map, upgrade notes, known risks', 'Bàn giao: README mới, bản đồ, ghi chú nâng cấp, rủi ro còn lại', 'Người kế tiếp chạy được trong 30 phút · Danh sách nợ kỹ thuật xếp ưu tiên'],
      ['phong-van', 'Interview questions on legacy code and refactoring', 'Câu hỏi phỏng vấn về code cũ và refactor', '"Bạn tiếp cận codebase lạ thế nào" · "Refactor khác viết lại ở đâu" · "Kể một code smell và cách sửa" · "Sửa code không có test thế nào" · Trả lời theo STAR bằng chính dự án này'],
      ['tong-ket', 'Final quiz and maintenance checklist', 'Kiểm tra tổng kết và checklist bảo trì', '20 câu trộn cả khoá · Checklist "trước khi sửa code người khác"'],
    ]],
  ]).map((chuong, i) => DA_SOAN[i] || chuong),
};
