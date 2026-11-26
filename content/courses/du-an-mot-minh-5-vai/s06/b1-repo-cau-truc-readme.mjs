/**
 * 6.1 — Repo, cấu trúc thư mục, quy ước đặt tên & README (dm5-6-1-repo-cau-truc-readme).
 * Chương 6 — Nền kỹ thuật & quy trình code (mũ Dev, PM giám sát).
 * Nguồn đã kiểm: Toyota T-Connect GitHub exposure (Oct 2022, Toyota Motor Corp. disclosure);
 * Uber GitHub secret breach (2016/2017, U.S. FTC settlement 2018);
 * Martin Fowler — Modular Monolith / Package-by-Feature conventions.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, bash, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L61 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.1', 'Chương 6 · Bài 6.1', `
<h2>${t('6.1 — Repository layout, folder structure, naming conventions &amp; README', '6.1 — Repo, cấu trúc thư mục, quy ước đặt tên &amp; README')}</h2>
<p class="lead">${t(
    'Design documents on paper look clean — until Week 2 when 40 screens start turning into hundreds of Java, TypeScript, SQL, and config files. Without an explicit repository layout, package-by-feature rules, naming conventions, and a working <code>README.md</code> from Commit #1, even a solo project collapses into a junk drawer where every change breaks something unrelated. This lesson teaches you how to lay the physical foundation of a professional repository under <strong>Dev Lead / C3–C4</strong> with <strong>C1 PM</strong> governance — reusable for any software project, demonstrated on LabFlow AI.',
    'Tài liệu thiết kế trên giấy lúc nào cũng đẹp — cho tới Tuần 2 khi 40 màn hình bắt đầu biến thành hàng trăm tệp Java, TypeScript, SQL và cấu hình. Nếu không khoá rõ bố cục kho mã (repository), cấu trúc thư mục theo tính năng, quy ước đặt tên và một tệp <code>README.md</code> chạy được ngay từ Commit #1, ngay cả đồ án làm một mình cũng nhanh chóng biến thành ngăn kéo lộn xộn mà sửa một chỗ là gãy chỗ khác. Bài này dạy bạn dựng nền vật lý chuẩn doanh nghiệp cho kho mã dưới mũ <strong>Dev C3–C4</strong> và sự giám sát của <strong>PM C1</strong> — dùng lại được cho mọi đề tài, lấy LabFlow AI làm ví dụ xuyên suốt.')}</p>

<h3>${t('Everyday picture: the difference between a home kitchen drawer and a restaurant prep station', 'Liên tưởng đời thường: ngăn kéo bếp ở nhà so với quầy bếp nhà hàng')}</h3>
<p>${t(
    'At home, throwing a peeler, rubber bands, spices, and scissors into one kitchen drawer works fine when you cook instant noodles for yourself. Walk into a restaurant kitchen serving 200 orders a night and that drawer becomes a disaster: chefs collide, salt gets mistaken for sugar, and a new hire spends twenty minutes hunting for a thermometer. Professional kitchens use <em>mise en place</em> — every station has a fixed zone, every container is labelled identically, and the opening checklist sits taped to the wall. A software repository is your kitchen: <strong>folder structure is the station layout, naming conventions are the labels, <code>.gitignore</code> is the trash chute, and <code>README.md</code> is the opening checklist on the wall.</strong>',
    'Ở nhà, ném dao gọt vỏ, dây chun, gói gia vị và kéo vào chung một ngăn kéo bếp vẫn ổn khi bạn chỉ tự nấu mì gói. Nhưng bước vào bếp nhà hàng phục vụ 200 đơn mỗi tối, ngăn kéo đó là thảm hoạ: đầu bếp va vào nhau, nhầm muối với đường, nhân viên mới mất hai mươi phút chỉ để tìm cái nhiệt kế. Bếp chuyên nghiệp dùng quy tắc <em>mise en place</em> — mỗi khu có vị trí cố định, mọi hộp dán nhãn đồng nhất, và bảng quy trình mở ca dán ngay trên tường. Kho mã phần mềm chính là căn bếp của bạn: <strong>cấu trúc thư mục là sơ đồ khu bếp, quy ước đặt tên là nhãn dán, <code>.gitignore</code> là ống xả rác, còn <code>README.md</code> là bảng mở ca dán trên tường.</strong>')}</p>

<h3>${t('1. Why repo hygiene matters from Commit #1 — before writing a single feature', '1. Vì sao vệ sinh kho mã phải chốt ngay từ Commit #1 — trước khi code bất kỳ tính năng nào')}</h3>
<p>${t(
    'Many student teams think "we will clean up folders and write README the night before Final Presentation." In reality, structural entropy compounds daily: once 60 classes sit in a flat <code>controllers/</code> and <code>services/</code> dump, refactoring them mid-sprint creates massive merge conflicts, breaks import paths, and ruins Git history right before a milestone. Worse, a sloppy Day-1 repo is the #1 way credentials leak.',
    'Nhiều nhóm sinh viên hay nghĩ "cứ code cho chạy đã, đêm trước ngày bảo vệ mình dọn thư mục rồi viết README sau." Thực tế, sự hỗn loạn cấu trúc tăng theo cấp số nhân từng ngày: một khi 60 lớp đã đổ chung vào đống <code>controllers/</code> và <code>services/</code>, việc sắp xếp lại giữa sprint sẽ gây nổ xung đột merge, đứt đường dẫn import và làm nát lịch sử Git ngay sát hạn mốc. Tệ hơn, một kho mã cẩu thả từ Ngày 1 là con đường số 1 khiến mật khẩu bị rò rỉ.')}</p>

${cl('danger', `<strong>🕵️ ${t('Real-world security incidents (verified sources)', 'Góc bảo mật &amp; sự cố thật có nguồn kiểm chứng')}</strong>
<ul>
<li>${t('<strong>Toyota T-Connect Source Code Exposure (October 2022 — Toyota Motor Corporation official disclosure):</strong> A contractor accidentally uploaded source code containing a data-server access key to a public GitHub repository in December 2017. It sat exposed for nearly five years, potentially exposing <strong>296,019 customer email addresses and management numbers</strong>.', '<strong>Sự cố rò rỉ mã nguồn Toyota T-Connect (tháng 10/2022 — thông cáo chính thức của Toyota Motor Corporation):</strong> Một nhà thầu vô tình đẩy mã nguồn chứa khoá truy cập máy chủ dữ liệu lên kho GitHub công khai từ tháng 12/2017. Khoá nằm phơi suốt gần năm năm, làm lộ nguy cơ tới <strong>296.019 email và mã quản lý khách hàng</strong>.')}</li>
<li>${t('<strong>Uber Private GitHub Breach (2016, disclosed 2017 — U.S. FTC settlement 2018):</strong> Attackers obtained access to a <em>private</em> GitHub repository used by Uber engineers, found hardcoded AWS credentials inside the repo, and exfiltrated records of <strong>57 million riders and drivers</strong>. Lesson: <strong>even a private repo is NEVER a safe place for <code>.env</code> or passwords!</strong>', '<strong>Sự cố rò rỉ kho GitHub riêng tư của Uber (2016, công bố 2017 — hồ sơ dàn xếp FTC Hoa Kỳ 2018):</strong> Kẻ tấn công chiếm quyền vào một kho GitHub <em>private</em> của kỹ sư Uber, tìm thấy khoá AWS ghi cứng trong mã nguồn và rút dữ liệu của <strong>57 triệu hành khách và tài xế</strong>. Bài học: <strong>ngay cả repo private cũng TUYỆT ĐỐI không phải nơi cất <code>.env</code> hay mật khẩu!</strong>')}</li>
</ul>
<p>${t('<strong>Concrete defense from Commit #1:</strong> Commit a strict <code>.gitignore</code> + <code>.env.example</code> (placeholders only, zero real passwords) BEFORE creating any Spring/React config. Never commit <code>.env</code>, <code>target/</code>, <code>node_modules/</code>, <code>.idea/workspace.xml</code>, or personal IDE junk (see ', '<strong>Cách phòng cụ thể từ Commit #1:</strong> Commit một tệp <code>.gitignore</code> chặt + <code>.env.example</code> (chỉ chứa tên biến rỗng, không có mật khẩu thật) TRƯỚC KHI tạo cấu hình Spring/React. Tuyệt đối không commit <code>.env</code>, <code>target/</code>, <code>node_modules/</code>, <code>.idea/workspace.xml</code> hay rác IDE cá nhân (xem chi tiết ở ')}${cs('git', 'git-1-5-gitignore', 'Git 1.5 — .gitignore')} ${t('and ', 'và ')}${cs('agile-teamwork', 'agl-10-7-su-co-that', 'Agile Teamwork 10.7')}).</p>`)}

<h3>${t('2. General blueprint: monorepo vs multi-repo &amp; Package-by-Feature vs Package-by-Layer', '2. Quy trình tổng quát: chọn bố cục kho mã &amp; chia theo tính năng thay vì chia theo tầng')}</h3>
<p>${t('Before creating folders, the Dev Lead (C3/C4) and PM (C1) lock two architectural repo decisions:', 'Trước khi tạo thư mục, Dev Lead (C3/C4) và PM (C1) phải chốt hai quyết định nền tảng cho kho mã:')}</p>

<h4>${t('Decision A — One monorepo vs separate BE/FE repos', 'Quyết định A — Một kho chung (monorepo) hay tách riêng repo BE/FE')}</h4>
<p>${t('For a 1-person (5-role) or 5-student capstone with one backend, one frontend, one database, and one release package, a <strong>single monorepo</strong> (<code>backend/</code> + <code>frontend/</code> + <code>database/</code> + <code>docs/</code> + <code>docker-compose.yml</code>) beats splitting into two repos: one Git tag (<code>iter1</code>, <code>iter2</code>, <code>iter3</code>) freezes the exact matching backend, frontend, migration, and docs together; one PR can deliver a full vertical slice without version drift; and your Software Package matches a single commit SHA.', 'Với đồ án 1 người (5 vai) hoặc nhóm 5 sinh viên có một backend, một frontend, một CSDL và một gói nộp, dùng <strong>một kho chung (monorepo)</strong> gồm <code>backend/</code> + <code>frontend/</code> + <code>database/</code> + <code>docs/</code> + <code>docker-compose.yml</code> vượt trội hơn tách hai repo: đúng một tag Git (<code>iter1</code>, <code>iter2</code>, <code>iter3</code>) đóng băng trọn bộ backend, frontend, migration và tài liệu khớp nhau; một PR giao trọn lát cắt dọc mà không lệch phiên bản; và Software Package trỏ về đúng một commit SHA duy nhất.')}</p>

<h4>${t('Decision B — Package-by-Feature (vertical) vs Package-by-Layer (horizontal)', 'Quyết định B — Chia theo nghiệp vụ (Package-by-Feature) vs Chia theo tầng (Package-by-Layer)')}</h4>
${bang(
  [t('Dimension', 'Tiêu chí'), t('Package-by-Layer (controllers/, services/, repos/)', 'Chia theo tầng (controllers/, services/, repos/)'), t('Package-by-Feature (auth/, catalog/, reservation/) — Recommended', 'Chia theo nghiệp vụ (auth/, catalog/, reservation/) — Khuyến nghị')],
  [
    [t('<strong>Finding files for 1 feature</strong>', '<strong>Tìm tệp cho 1 tính năng</strong>'), t('Jump across 5 top-level folders to edit one screen; high mental load.', 'Phải nhảy qua lại 5 thư mục lớn để sửa một màn hình; rất rối mắt.'), t('Everything for one domain lives in ONE folder (controller, service, repo, entity, dto).', 'Mọi thứ của một miền nằm gọn trong MỘT thư mục (controller, service, repo, entity, dto).')],
    [t('<strong>Enforcing module boundaries</strong>', '<strong>Giữ ranh giới modular monolith</strong>'), t('Almost impossible — everything is <code>public</code> so any service imports any repository.', 'Gần như bất khả thi — mọi lớp đều <code>public</code> nên service nào cũng gọi bừa repository của miền khác.'), t('Natural encapsulation — internal classes can be package-private; only facades/DTOs are public.', 'Đóng gói tự nhiên — lớp nội bộ để package-private; chỉ mở công khai facade/DTO.')],
    [t('<strong>Vertical-slice ownership (SWP391)</strong>', '<strong>Sở hữu theo miền dọc (SWP391)</strong>'), t('5 people constantly collide in the same folders.', '5 người liên tục đụng nhau trong cùng vài thư mục.'), t('Each vertical slice maps cleanly to its own domain folders — minimal merge conflicts.', 'Mỗi miền dọc ánh xạ gọn vào đúng thư mục nghiệp vụ của mình — cực ít xung đột merge.')],
    [t('<strong>Path to microservices later</strong>', '<strong>Lộ trình tách dịch vụ sau này</strong>'), t('Must untangle a "big ball of mud" across the whole codebase.', 'Phải gỡ rối cả "cuộn len rối" trải khắp mã nguồn.'), t('Cut along the existing feature folder boundary cleanly.', 'Cắt gọn đúng theo ranh giới thư mục tính năng đã có sẵn.')]
  ]
)}

<p>${t('For deeper framework specifics, read ', 'Để xem sâu hơn cấu trúc theo từng framework, đọc thêm ')}${cs('spring-boot', 'sb-0-2-cau-truc-du-an', 'Spring Boot 0.2 — Anatomy of a Spring Boot project')} ${t('and ', 'và ')}${cs('react', 'rx-7-3-cau-truc', 'React 7.3 — Feature-based folder structure')}${t('. On LabFlow AI, check the exact locked tree in ', '. Với LabFlow AI, đối chiếu cây thư mục đã chốt tại ')}${lf('Cấu trúc repo')}${t(' (we do not copy it here — inspect it directly). Below is the <strong>blank reusable monorepo skeleton</strong> you can adapt to ANY topic:', ' (ta không chép lại ở đây — hãy mở trực tiếp trang dự án để đối chiếu). Dưới đây là <strong>khung monorepo trống dùng lại được</strong> cho MỌI đề tài:')}</p>

<pre><code>&lt;project-slug&gt;/
├── .github/
│   ├── workflows/ci.yml           # Automated build + lint + test gate (Lesson 6.3)
│   └── PULL_REQUEST_TEMPLATE.md   # Forced PR description &amp; checklist (Lesson 6.2)
├── .githooks/                     # Optional local seatbelt hooks (commit-msg)
├── backend/                       # API service (e.g., Spring Boot — package-by-feature)
│   ├── src/main/java/&lt;org&gt;/&lt;app&gt;/
│   │   ├── common/                # Shared envelope, error handler, pagination, audit
│   │   ├── security/              # Auth filter, RBAC config, CurrentUser
│   │   ├── &lt;domain-1&gt;/            # Feature A: Controller, Service, Repo, Entity, dto/
│   │   └── &lt;domain-2&gt;/            # Feature B: one-way dependency rule only!
│   ├── src/main/resources/
│   │   ├── application.yml        # Reads \${ENV_VARS}, NEVER real passwords
│   │   └── db/migration/          # Flyway V1__init.sql, V2__...
│   └── src/test/java/&lt;org&gt;/&lt;app&gt;/ # Mirrors main package tree
├── frontend/                      # SPA (e.g., React + Vite + TypeScript)
│   └── src/
│       ├── app/                   # Router, shared layout, role route guards
│       ├── components/            # Reusable dumb UI (DataTable, Modal, FormField)
│       ├── features/&lt;domain&gt;/     # Feature-owned pages, hooks, API calls, types
│       └── lib/                   # Single HTTP client, date/format helpers
├── database/seed/                 # Idempotent fake demo data scripts (zero real PII!)
├── docs/                          # SRS, SDS, ADR/, CONTRIBUTING.md, RUNBOOK.md
├── .editorconfig                  # Unified indent, UTF-8, LF line endings
├── .env.example                   # Required env var keys + safe placeholder values
├── .gitignore                     # Blocks .env, build artifacts, OS/IDE junk
├── docker-compose.yml             # Local stack in 1 command (Lesson 6.4)
└── README.md                      # 10-minute clean-machine onboarding guide</code></pre>

<h3>${t('3. Cross-stack Naming Conventions (blank reusable standard + LabFlow example)', '3. Bộ quy ước đặt tên xuyên suốt toàn stack (mẫu chuẩn dùng lại được + ví dụ LabFlow)')}</h3>
<p>${t('Inconsistent naming slows down reviews, confuses automated scripts, and causes silent bugs (like Windows case-insensitive imports passing locally while Linux CI fails!). Lock one concise naming table inside <code>docs/CONTRIBUTING.md</code> under ', 'Đặt tên mỗi nơi một kiểu làm chậm review, rối script tự động và gây lỗi ngầm (ví dụ máy Windows không phân biệt hoa/thường vẫn chạy, đẩy lên CI Linux lập tức gãy!). Hãy khoá gọn một bảng quy ước đặt tên trong <code>docs/CONTRIBUTING.md</code> dưới mũ ')}${mu('C3', en)} ${mu('C4', en)} ${t('and sign it off under ', 'và chốt duyệt dưới mũ ')}${mu('C1', en)}:</p>

${bang(
  [t('Layer / Artifact', 'Tầng / Tạo tác'), t('General Reusable Rule', 'Quy ước tổng quát dùng lại được'), t('LabFlow Example', 'Ví dụ trên LabFlow'), t('Anti-Pattern (Avoid)', 'Kiểu sai cần tránh')],
  [
    [t('<strong>Database tables &amp; columns</strong>', '<strong>Bảng &amp; cột CSDL</strong>'), t('<code>snake_case</code>, plural table names, UTC timestamps suffixed <code>_at</code>', '<code>snake_case</code>, tên bảng số nhiều, cột mốc giờ UTC hậu tố <code>_at</code>'), '<code>reservation_items</code>, <code>created_at</code>, <code>lab_id</code>', '<code>ReservationItem</code>, <code>tbl_Lab</code>, <code>Date1</code>'],
    [t('<strong>Flyway migrations</strong>', '<strong>Tệp migration Flyway</strong>'), t('<code>V&lt;n&gt;__&lt;short_snake_desc&gt;.sql</code> (double underscore!)', '<code>V&lt;n&gt;__&lt;mo_ta_snake_case&gt;.sql</code> (hai dấu gạch dưới!)'), '<code>V1__init_schema.sql</code>, <code>V2__add_waitlist.sql</code>', '<code>v1_init.sql</code>, <code>fix_db_final2.sql</code>'],
    [t('<strong>Java packages &amp; classes</strong>', '<strong>Package &amp; lớp Java</strong>'), t('Packages: lowercase singular; Classes: <code>PascalCase</code> + clear role suffix', 'Package: chữ thường số ít; Lớp: <code>PascalCase</code> + hậu tố rõ vai'), '<code>vn.labflow.reservation.ReservationService</code>', '<code>ReservationMgr</code>, <code>Helper2</code>, <code>MyUtil</code>'],
    [t('<strong>REST API paths &amp; JSON</strong>', '<strong>Đường dẫn REST &amp; JSON</strong>'), t('Plural <code>kebab-case</code> nouns under <code>/api/v1/</code>; JSON fields <code>camelCase</code>', 'Danh từ số nhiều <code>kebab-case</code> sau <code>/api/v1/</code>; JSON <code>camelCase</code>'), '<code>POST /api/v1/reservations</code>, <code>startAt</code>', '<code>/getAllLabs</code>, <code>/api/Create_Booking</code>'],
    [t('<strong>React components &amp; files</strong>', '<strong>Component &amp; tệp React</strong>'), t('Components: <code>PascalCase.tsx</code>; hooks: <code>useXxx.ts</code>; utils: <code>kebab-case.ts</code>', 'Component: <code>PascalCase.tsx</code>; hook: <code>useXxx.ts</code>; tiện ích: <code>kebab-case.ts</code>'), '<code>ReservationWizard.tsx</code>, <code>useAvailability.ts</code>', '<code>page1.tsx</code>, <code>Form_new_final.tsx</code>'],
    [t('<strong>Env variables</strong>', '<strong>Biến môi trường</strong>'), t('<code>SCREAMING_SNAKE_CASE</code> grouped by service prefix', '<code>SCREAMING_SNAKE_CASE</code> gom theo tiền tố dịch vụ'), '<code>DB_URL</code>, <code>JWT_SECRET</code>, <code>MAILTRAP_USER</code>', '<code>pass</code>, <code>myKey123</code>'],
    [t('<strong>Git branches &amp; tags</strong>', '<strong>Nhánh &amp; tag Git</strong>'), t('<code>&lt;type&gt;/&lt;TICKET&gt;-&lt;slug&gt;</code>; tags per milestone/SemVer', '<code>&lt;loai&gt;/&lt;MA-THE&gt;-&lt;mo-ta&gt;</code>; tag theo mốc/SemVer'), '<code>feat/lf-22-reservation-wizard</code>, <code>iter1</code>', '<code>test</code>, <code>cuong-branch</code>, <code>final-v2</code>'],
    [t('<strong>Docs &amp; Reports</strong>', '<strong>Tài liệu &amp; Hồ sơ nộp</strong>'), t('Match school/client file pattern (e.g., <code>SEP490_&lt;Gxxx&gt;_&lt;template name&gt;_v&lt;x.y&gt;.&lt;ext&gt;</code>) + version synced with Record of Changes', 'Theo đúng mẫu tên tệp của trường/khách (vd <code>SEP490_&lt;Gxxx&gt;_&lt;tên mẫu&gt;_v&lt;x.y&gt;.&lt;đuôi&gt;</code>) + số phiên bản khớp Record of Changes'), '<code>SEP490_Gxxx_Report4_Software Design Specification_v1.0.docx</code>', '<code>baocao_moi_nhat_fixed.docx</code>']
  ]
)}

<h3>${t('4. Writing a README.md that lets a stranger (or lecturer) run the app in 10 minutes', '4. Viết README.md giúp người lạ (hoặc giảng viên) chạy được hệ thống trong 10 phút')}</h3>
<p>${t('We will not repeat general technical-writing theory covered in ', 'Ta không lặp lại lý thuyết viết README chung đã có ở ')}${cs('agile-teamwork', 'agl-5-1-readme', 'Agile Teamwork 5.1 — README that works out of the box')}${t('. Instead, treat <code>README.md</code> as an <strong>executable contract</strong> verified by hat ', '. Thay vào đó, hãy coi <code>README.md</code> là một <strong>hợp đồng chạy được</strong> do mũ ')}${mu('C5', en)} ${t('on a clean directory (and aligned with the quick-start guide in your SEP490 Software Package — ask your lecturer for the exact filename and structure). Every strong project README contains exactly 8 concise blocks:', 'kiểm chứng trên thư mục trống (và khớp phần hướng dẫn chạy nhanh trong Software Package của SEP490 — hỏi thầy tên tệp và cấu trúc cụ thể). Mọi tệp README chuẩn đều có đúng 8 khối gọn gàng:')}</p>

${out(`# <Project Name> — <1-line value proposition>
> Mode note (if solo 5-role): 1 developer operating 5 roles (C1–C5) transparently; 100% hand-coded.

## 1. What this system solves & Core Architecture
- 3-line summary + link to Architecture Diagram / ADR / SRS & SDS in docs/

## 2. Prerequisites (pinned versions!)
- Java 21 (Temurin) · Node 22 LTS · Docker Desktop (Compose v2) · Git 2.4x

## 3. Quick Start (< 5 commands on a clean machine)
1. git clone <url> && cd <project>
2. cp .env.example .env
3. docker compose up -d postgres
4. set -a; source .env; set +a && (cd backend && ./mvnw spring-boot:run)
   # Spring Boot does NOT auto-read .env (only Docker Compose does).
   # Alternative: load .env in IDE Run Config, or set spring.config.import=optional:file:.env[.properties]
5. cd frontend && npm ci && npm run dev

## 4. Verify It Works (Health + Seed Demo Accounts)
- Health check URL -> expected JSON { "status": "UP" }
- Demo accounts table (FAKE data only: student1@demo.local / Demo@1234 — NEVER real PII!)

## 5. How to Run Tests & Local CI
- Backend: cd backend && ./mvnw verify
- Frontend: cd frontend && npm run lint && npm run typecheck && npm run build

## 6. Repository Map & Module Dependency Rules
- Short 10-line directory map + one-way dependency rule (e.g., reservation -> catalog, NEVER reverse)

## 7. Project Governance & Contribution Rules
- Link to docs/CONTRIBUTING.md (branch naming, commit format, PR checklist, CT Work board)

## 8. Known Limitations & License / Academic Integrity Note`)}

${note(t('<strong>Clean-Machine Test (C5 QA Hat) &amp; Spring Boot <code>.env</code> Gotcha:</strong> Never declare your README "done" until you clone your repo into a brand-new folder (e.g., <code>/tmp/clean-test</code>) and follow ONLY the commands written in <code>README.md</code> without relying on anything pre-installed or cached in your main folder. Remember: <code>docker compose</code> reads <code>.env</code> automatically, but <strong>Spring Boot does NOT</strong> — without <code>set -a; source .env; set +a</code> (or loading <code>.env</code> in your IDE / adding <code>spring.config.import: optional:file:.env[.properties]</code>), step 4 fails immediately with missing <code>DB_URL</code>/<code>DB_PASSWORD</code>. Every missing step is a real bug in README!', '<strong>Bài test Máy Sạch (mũ QA C5) &amp; bẫy <code>.env</code> của Spring Boot:</strong> Đừng bao giờ coi <code>README.md</code> là "xong" cho tới khi bạn clone repo sang một thư mục hoàn toàn mới (vd <code>/tmp/clean-test</code>) rồi gõ ĐÚNG từng lệnh trong <code>README.md</code> mà không dựa vào bất kỳ tệp nào sẵn có ở thư mục làm việc cũ. Lưu ý quan trọng: chỉ <code>docker compose</code> tự đọc <code>.env</code>, còn <strong>Spring Boot KHÔNG tự đọc <code>.env</code></strong> — nếu thiếu <code>set -a; source .env; set +a</code> (hoặc nạp <code>.env</code> trong cấu hình Run của IDE / khai báo <code>spring.config.import: optional:file:.env[.properties]</code>), bước 4 sẽ gãy ngay vì thiếu <code>DB_URL</code>/<code>DB_PASSWORD</code>. Mỗi chỗ vấp là một lỗi thật của README!'))}

<h3>${t('5. Step-by-step: Standing up Commit #1 with role handoffs', '5. Quy trình từng bước: Dựng Commit #1 với đúng nhịp đổi mũ')}</h3>
<ol>
<li>${mu('C1', en)} ${t('<strong>Lock Repo Governance &amp; Skeleton:</strong> Create the GitHub repository (private if still in progress, or public per lecturer instruction — note Lesson 6.2 on GitHub Free private repo branch-rule limits), initialize <code>.gitignore</code>, <code>.editorconfig</code>, <code>.env.example</code>, <code>docs/CONTRIBUTING.md</code>, and <code>README.md</code>. Verify CT Work project <code>connect</code> is linked to GitHub (see ', '<strong>Khoá quản trị &amp; bộ khung kho mã:</strong> Tạo repo trên GitHub (private nếu còn dở, hoặc public nếu giảng viên cho phép — xem thêm lưu ý về giới hạn khoá nhánh của GitHub Free ở Bài 6.2), khởi tạo <code>.gitignore</code>, <code>.editorconfig</code>, <code>.env.example</code>, <code>docs/CONTRIBUTING.md</code> và <code>README.md</code>. Kiểm tra trang <code>connect</code> trên CT Work đã nối với GitHub (xem ')}${cs('git', 'git-kd-10-noi-ct-work', 'Git KĐ.10 — Connect GitHub to CT Work')}).</li>
<li>${mu('C3', en)} ${t('<strong>Initialize Backend Feature Skeleton:</strong> Generate minimal Spring Boot skeleton (JDK 21, Maven wrapper <code>./mvnw</code>), create empty package-by-feature directories matching your SDS modules, add <code>V1__init.sql</code> placeholder, and make sure <code>application.yml</code> reads <code>${ENV_VAR}</code> with <code>ddl-auto: validate</code>.', '<strong>Khởi tạo khung Backend theo tính năng:</strong> Tạo khung Spring Boot tối giản (JDK 21, kèm Maven wrapper <code>./mvnw</code>), dựng sẵn thư mục package-by-feature khớp các module trong SDS, thêm tệp <code>V1__init.sql</code> và cấu hình <code>application.yml</code> đọc <code>${ENV_VAR}</code> kèm <code>ddl-auto: validate</code>.')}</li>
<li>${mu('C4', en)} ${t('<strong>Initialize Frontend Feature Skeleton:</strong> Create Vite + React + TypeScript scaffold with <code>src/app/</code>, <code>src/components/</code>, <code>src/features/</code>, <code>src/lib/</code>, plus ESLint + TypeScript strict config (<code>"strict": true</code>).', '<strong>Khởi tạo khung Frontend theo tính năng:</strong> Tạo khung Vite + React + TypeScript với các thư mục <code>src/app/</code>, <code>src/components/</code>, <code>src/features/</code>, <code>src/lib/</code>, bật ESLint và TypeScript strict (<code>"strict": true</code>).')}</li>
<li>${mu('C5', en)} ${t('<strong>Run the Clean-Machine Hygiene Audit:</strong> Check <code>git status</code> and <code>git ls-files</code> to prove ZERO secrets, ZERO build folders, and ZERO OS/IDE junk are tracked; run the README steps from scratch in a clean directory.', '<strong>Chạy kiểm toán vệ sinh trên thư mục sạch:</strong> Chạy <code>git status</code> và <code>git ls-files</code> để chứng minh KHÔNG có bí mật, KHÔNG có thư mục build và KHÔNG có rác OS/IDE nào bị theo dõi; làm lại đúng các bước trong README từ thư mục mới.')}</li>
</ol>

<p>${t('Quick hygiene check commands every C5 QA can run in 10 seconds:', 'Bộ lệnh kiểm toán vệ sinh kho mã mà C5 QA chạy trong 10 giây:')}</p>
${bash(`# 1. Verify no secret/build files are tracked by Git
git ls-files | grep -E "(\\.env$|node_modules/|target/|\\.DS_Store|workspace\\.xml)" || echo "CLEAN"

# 2. Check line-ending & editor consistency
cat .editorconfig | head -n 12`)}

<h3>${t('6. Five classic repository mistakes — and how to avoid them', '6. Năm lỗi kinh điển khi dựng repo — và cách tránh')}</h3>
<ul>
<li>${t('<strong>Committing <code>target/</code>, <code>node_modules/</code>, or <code>.idea/</code>:</strong> Bloats repo to hundreds of megabytes and breaks teammates\' IDE configs. Fix: commit comprehensive <code>.gitignore</code> on Commit #1 (see ', '<strong>Lỡ commit <code>target/</code>, <code>node_modules/</code> hoặc <code>.idea/</code>:</strong> Làm repo phình hàng trăm MB và hỏng cấu hình IDE của người khác. Cách tránh: commit <code>.gitignore</code> chuẩn ngay Commit #1 (xem ')}${cs('git', 'git-18-1-lo-commit-build', 'Git 18.1')}).</li>
<li>${t('<strong>Case-sensitivity trap (Windows/Mac vs Linux CI):</strong> Importing <code>./LabCard</code> when the file is <code>labCard.tsx</code> works on macOS/Windows default filesystems and crashes in GitHub Actions Linux. Fix: strict PascalCase naming + run CI on Ubuntu.', '<strong>Bẫy phân biệt hoa/thường (Windows/Mac so với Linux CI):</strong> Import <code>./LabCard</code> trong khi tệp tên <code>labCard.tsx</code> vẫn chạy trên máy macOS/Windows nhưng nổ ngay trên GitHub Actions Linux. Cách tránh: tuân thủ chặt PascalCase + chạy CI trên Ubuntu.')}</li>
<li>${t('<strong>Circular module imports:</strong> <code>catalog</code> importing <code>reservation</code> while <code>reservation</code> imports <code>catalog</code> destroys modular monolith boundaries. Fix: write the allowed one-way dependency arrows in <code>README.md</code> and enforce them in Lesson 6.3.', '<strong>Import vòng tròn giữa hai module:</strong> <code>catalog</code> gọi <code>reservation</code> trong khi <code>reservation</code> gọi lại <code>catalog</code> phá vỡ ranh giới modular monolith. Cách tránh: ghi rõ mũi tên phụ thuộc một chiều trong <code>README.md</code> và khoá bằng kiểm tra ở Bài 6.3.')}</li>
<li>${t('<strong>Unpinned tool versions in README:</strong> Writing "Install Java and Node" leads to someone running Java 17 or Node 18 and hitting cryptic build errors. Fix: pin exact versions (<code>JDK 21</code>, <code>Node 22 LTS</code>) and commit <code>./mvnw</code> + <code>package-lock.json</code>.', '<strong>Không ghim phiên bản công cụ trong README:</strong> Chỉ ghi "Cài Java và Node" khiến người chấm cài Java 17 hoặc Node 18 rồi gặp lỗi biên dịch kỳ quặc. Cách tránh: ghim đúng phiên bản (<code>JDK 21</code>, <code>Node 22 LTS</code>) và commit sẵn <code>./mvnw</code> + <code>package-lock.json</code>.')}</li>
<li>${t('<strong>Outdated README at milestone week:</strong> Changing a port or env variable in Week 6 without updating <code>.env.example</code> and <code>README.md</code> breaks the examiner\'s clean-machine check. Fix: any PR adding an env var MUST update <code>.env.example</code> and <code>README.md</code> in the same PR.', '<strong>README lỗi thời tới tuần nộp mốc:</strong> Tuần 6 đổi cổng hoặc thêm biến môi trường mà quên cập nhật <code>.env.example</code> và <code>README.md</code> khiến giảng viên chạy không lên. Cách tránh: mọi PR thêm biến môi trường BẮT BUỘC sửa luôn <code>.env.example</code> và <code>README.md</code> trong cùng PR.')}</li>
</ul>

${phongVan([
  [t('"Why did you organize your Spring Boot and React code by feature instead of by technical layer (controllers/services/repositories)?"', '"Vì sao bạn tổ chức mã nguồn Spring Boot và React theo tính năng (package-by-feature) thay vì theo tầng kỹ thuật (controllers/services/repositories)?"'), t('Because our architecture is a modular monolith and our work is divided into vertical slices. Package-by-feature keeps everything needed to change one business flow in one folder, lets us keep internal classes package-private to enforce one-way module dependencies, drastically reduces merge conflicts across 5 slices, and gives us clean cut lines if a module ever needs to be extracted into a separate service.', 'Vì kiến trúc dự án là modular monolith và công việc chia theo miền dọc. Package-by-feature gom mọi thứ cần sửa cho một luồng nghiệp vụ vào đúng một thư mục, cho phép giữ các lớp nội bộ ở phạm vi package-private để ép phụ thuộc một chiều giữa các module, giảm mạnh xung đột merge giữa 5 miền và tạo sẵn đường cắt sạch nếu sau này cần tách một module thành dịch vụ riêng.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Keep the exact same monorepo layout, swapping only the domain folders inside <code>backend/</code> and <code>frontend/src/features/</code>: <code>auth/</code>, <code>shop/</code>, <code>product/</code>, <code>cart/</code>, <code>order/</code>, <code>payment/</code>, <code>shipment/</code>, <code>review/</code>. Enforce one-way arrows (e.g., <code>order</code> reads <code>product</code> &amp; triggers <code>payment</code>, never <code>product</code> importing <code>order</code>) and put fake sandbox payment keys only in <code>.env.example</code>.', 'Giữ nguyên toàn bộ khung monorepo, chỉ đổi tên thư mục miền bên trong <code>backend/</code> và <code>frontend/src/features/</code> thành: <code>auth/</code>, <code>shop/</code>, <code>product/</code>, <code>cart/</code>, <code>order/</code>, <code>payment/</code>, <code>shipment/</code>, <code>review/</code>. Giữ luật mũi tên một chiều (vd <code>order</code> đọc <code>product</code> và gọi <code>payment</code>, cấm <code>product</code> gọi ngược <code>order</code>) và chỉ ghi tên khoá cổng thanh toán sandbox rỗng trong <code>.env.example</code>.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Add a <code>docs/ownership.csv</code> (or <code>.github/CODEOWNERS</code>) mapping each feature folder to its owning student so everyone sees who owns which vertical slice. Run a 20-minute Week-1 onboarding drill where Member 2–5 each clone the repo using ONLY <code>README.md</code> — any step that fails gets fixed before coding starts.', 'Thêm tệp <code>docs/ownership.csv</code> (hoặc <code>.github/CODEOWNERS</code>) ánh xạ từng thư mục tính năng tới đúng sinh viên phụ trách để cả nhóm thấy rõ ranh giới miền dọc. Chạy buổi thử việc 20 phút ở Tuần 1: thành viên 2–5 tự clone kho bằng ĐÚNG các bước trong <code>README.md</code> — chỗ nào vấp sửa ngay trước khi vào code.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Enterprise projects often split into multiple repos (or managed Nx/Turborepo/Gradle multi-module monorepos) with dedicated DevOps/Architect teams owning repository templates, mandatory pre-commit secret scanners (Gitleaks/TruffleHog), ArchUnit/ESLint import-boundary rules, and standardized onboarding playbooks checked during ISO 27001 / CMMI audits.', 'Dự án doanh nghiệp thường tách nhiều repo (hoặc dùng monorepo quản lý bằng Nx/Turborepo/Gradle multi-module) với đội DevOps/Kiến trúc sư giữ sẵn repo mẫu, bắt buộc gắn máy quét bí mật (Gitleaks/TruffleHog), luật biên import bằng ArchUnit/ESLint và tài liệu onboarding chuẩn hoá chịu kiểm toán ISO 27001 / CMMI.')]
], en)}

${viecLabflow([
  [t('Under hats C1 + C3 + C4, set up your LabFlow repository skeleton matching ', 'Dưới mũ C1 + C3 + C4, dựng bộ khung kho mã LabFlow khớp sơ đồ tại ')+lf('Cấu trúc repo')+t(': commit <code>.gitignore</code>, <code>.editorconfig</code>, <code>.env.example</code>, <code>docs/CONTRIBUTING.md</code> (with the cross-stack naming table), <code>README.md</code> (all 8 blocks), and empty feature packages for <code>backend/</code> and <code>frontend/</code>. Link the repo in CT Work <code>connect</code> (project <strong>LF #2</strong>).', ': commit <code>.gitignore</code>, <code>.editorconfig</code>, <code>.env.example</code>, <code>docs/CONTRIBUTING.md</code> (kèm bảng quy ước đặt tên xuyên stack), <code>README.md</code> (đủ 8 khối) và các thư mục tính năng khung cho <code>backend/</code> và <code>frontend/</code>. Nối kho vào trang <code>connect</code> trên CT Work (dự án <strong>LF #2</strong>).'), t('Running <code>git ls-files</code> shows zero secrets/build junk; cloning into a clean folder and following <code>README.md</code> builds both empty skeletons cleanly; CT Work <code>code</code> displays your repository.', 'Chạy <code>git ls-files</code> không thấy bí mật/rác build; clone sang thư mục sạch và làm theo <code>README.md</code> build sạch cả hai khung; trang <code>code</code> trên CT Work hiển thị được kho mã của bạn.')]
], en)}

${thuatNgu([
  ['Monorepo (Kho mã hợp nhất)', t('Keeping related components (backend, frontend, DB scripts, docs, compose) in one Git repository so tags and vertical-slice PRs stay synchronized.', 'Đặt các thành phần liên quan (backend, frontend, script DB, tài liệu, compose) trong cùng một kho Git để tag và PR miền dọc luôn khớp nhau.')],
  ['Package-by-Feature', t('Organizing code folders by business domain (<code>reservation/</code>, <code>loan/</code>) rather than technical layer (<code>controllers/</code>, <code>services/</code>).', 'Tổ chức thư mục mã theo miền nghiệp vụ (<code>reservation/</code>, <code>loan/</code>) thay vì theo tầng kỹ thuật (<code>controllers/</code>, <code>services/</code>).')],
  ['.env.example', t('A committed template listing every required environment variable name with safe dummy values — never containing real secrets.', 'Tệp mẫu được commit liệt kê đủ tên biến môi trường bắt buộc kèm giá trị giả an toàn — tuyệt đối không chứa bí mật thật.')],
  ['.editorconfig', t('A small cross-IDE config file unifying indentation, charset (UTF-8), and line endings (LF) across Windows, macOS, and Linux.', 'Tệp cấu hình nhỏ dùng chung cho mọi IDE nhằm thống nhất thụt lề, bảng mã UTF-8 và ký tự xuống dòng LF giữa Windows, macOS và Linux.')],
  ['Clean-Machine Test (Bài test máy sạch)', t('Cloning the repo into a fresh directory and executing only the README instructions to prove zero undocumented local dependencies exist.', 'Clone repo sang thư mục hoàn toàn mới và chỉ chạy đúng lệnh trong README để chứng minh không phụ thuộc ngầm vào máy cá nhân.')]
], en)}

${tomTat([
  t('Lock repo hygiene on Commit #1: <code>.gitignore</code> + <code>.env.example</code> + <code>.editorconfig</code> stop credential leaks (Toyota 2022, Uber 2016) and OS junk before they ever enter Git history.', 'Khoá vệ sinh kho mã ngay Commit #1: <code>.gitignore</code> + <code>.env.example</code> + <code>.editorconfig</code> chặn lộ mật khẩu (Toyota 2022, Uber 2016) và rác hệ điều hành trước khi chúng kịp lọt vào lịch sử Git.'),
  t('Use one monorepo + Package-by-Feature with strict one-way module dependency arrows to protect your modular monolith and vertical slices.', 'Dùng một monorepo + Package-by-Feature kèm mũi tên phụ thuộc một chiều để bảo vệ kiến trúc modular monolith và các lát cắt dọc.'),
  t('Document one cross-stack naming table in <code>docs/CONTRIBUTING.md</code> covering DB, Flyway, Java, REST, React, Env, Git, and Report files.', 'Ghi gọn một bảng quy ước đặt tên xuyên suốt toàn stack trong <code>docs/CONTRIBUTING.md</code> phủ từ DB, Flyway, Java, REST, React, Env, Git tới tên tệp báo cáo.'),
  t('Treat <code>README.md</code> as an executable contract verified by C5 QA on a clean clone — not an afterthought written before defense.', 'Coi <code>README.md</code> là hợp đồng chạy được do C5 QA kiểm chứng trên bản clone sạch — không phải đoạn chữ viết vội đêm trước bảo vệ.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${cs('agile-teamwork', 'agl-5-1-readme', 'Agile Teamwork 5.1 — README')} · ${cs('git', 'git-1-5-gitignore', 'Git 1.5 — .gitignore')} · ${cs('spring-boot', 'sb-0-2-cau-truc-du-an', 'Spring Boot 0.2')} · ${cs('react', 'rx-7-3-cau-truc', 'React 7.3')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-6-2-git-flow-mot-nguoi', t('6.2 — Solo Git Flow that runs like a 5-person team', '6.2 — Git flow một người mà như năm người'))}.</p>
`);
};

export default {
  title: '6.1 — Repository layout, folder structure, naming conventions & README|||6.1 — Repo, cấu trúc thư mục, quy ước đặt tên & README',
  slug: 'dm5-6-1-repo-cau-truc-readme',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng nền vật lý kho mã ngay từ Commit #1: phòng rò rỉ bí mật (Toyota T-Connect 2022, Uber 2016), monorepo + Package-by-Feature, bảng quy ước đặt tên xuyên suốt toàn stack, mẫu README 8 khối chạy được trên máy sạch và áp sang sàn TMĐT, nhóm SEP490 và doanh nghiệp.',
  content: L61(true) + L61(false),
};
