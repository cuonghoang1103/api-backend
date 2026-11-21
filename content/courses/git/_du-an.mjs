/**
 * Git & GitHub — "Dự án xuyên suốt khoá" (hợp đồng: docs/du-an-hop-dong.md v1).
 *
 * MỘT nguồn sự thật cho cả hai nơi:
 *   1. `duAn` ở cấp gốc của content/courses/git.mjs (import default từ file này);
 *   2. bài mốc trong từng chương: `baiMoc(N, { demoEn, demoVi })` dựng ra bài
 *      { slug: 'git-moc-N', type: 'EXERCISE', mocDuAn: N, … } từ chính DU_AN.moc[N-1].
 *   3. bài bảo vệ cuối khoá: `baiBaoVe({ … })` dựng từ DU_AN.baoVe.
 * Sửa yêu cầu một mốc ⇒ sửa Ở ĐÂY, bài trong chương tự đổi theo.
 *
 * Dự án của khoá Git KHÔNG phải viết app: người học chọn một REPO thật (cá nhân
 * hoặc nhóm 3–5 người) và VẬN HÀNH nó bằng Git/GitHub suốt khoá.
 *
 * ⚠️ File này được bộ kiểm course-content-check quét (import default từ git.mjs):
 * không backtick trần trong template, không gạch chéo ngược đơn. Chuỗi dữ liệu
 * viết bằng nháy đơn; tiếng Anh dùng ’ thay cho nháy đơn.
 */

const DE_TAI = [
  {
    slug: 'swp391-nhom',
    ten: 'Your real SWP391 team repository|||Repo nhóm SWP391 thật của bạn',
    moTa: 'A team of 4–5 builds a Java web app (Servlet/JSP or Spring Boot, sometimes with a React front end) for SWP391. You run its repository like a company team: protected main, one branch per task card, reviewed pull requests, CI, and a tagged release per iteration.|||Nhóm 4–5 người làm web Java (Servlet/JSP hoặc Spring Boot, có khi kèm React) cho SWP391. Bạn vận hành repo như một nhóm ở công ty: main được bảo vệ, mỗi thẻ việc một nhánh, pull request có review, CI, và một bản phát hành gắn tag cho mỗi iteration.',
    doKho: 3,
    tinhNang: [
      'Protected main: no direct push, at least 1 approval, required CI check|||main được bảo vệ: cấm push thẳng, cần ≥ 1 approval, CI là kiểm tra bắt buộc',
      'One branch per task card (feat/SWP-12-login), deleted after merge|||Mỗi thẻ việc một nhánh (feat/SWP-12-login), xoá sau khi merge',
      'PR template + real line comments + "request changes" at least once|||Mẫu PR + bình luận theo dòng thật + ít nhất một lần "request changes"',
      'A .gitignore that keeps build/, target/, nbproject/private/ and .env out|||.gitignore giữ build/, target/, nbproject/private/ và .env ở ngoài',
      'A conflict in a shared file (web.xml, pom.xml) resolved on a PR and explained|||Một xung đột ở file chung (web.xml, pom.xml) được giải trên PR và có giải thích',
      'Tags v0.1.0 … v1.0.0 per iteration, GitHub Releases with notes, one hotfix from a tag|||Tag v0.1.0 … v1.0.0 theo iteration, GitHub Release có ghi chú, một hotfix từ tag',
      'CODEOWNERS, CONTRIBUTING.md and a RUNBOOK.md for the team’s own incidents|||CODEOWNERS, CONTRIBUTING.md và RUNBOOK.md cho chính các sự cố của nhóm',
      'Contribution graph shows every member committing through PRs|||Biểu đồ đóng góp cho thấy mọi thành viên đều commit qua PR',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Leader creates the org/repo, invites 4 members, each member pushes one identity-check commit|||Trưởng nhóm tạo repo, mời 4 thành viên, mỗi người push một commit kiểm danh tính' },
      { moc: 2, dung: 'Java/NetBeans/Maven .gitignore, .env.example for DB credentials, first atomic commits|||.gitignore cho Java/NetBeans/Maven, .env.example cho thông tin CSDL, các commit nguyên tử đầu tiên' },
      { moc: 3, dung: 'Answer "who changed DBContext.java and why" with shortlog/blame/log -S|||Trả lời "ai sửa DBContext.java và vì sao" bằng shortlog/blame/log -S' },
      { moc: 4, dung: 'feat/SWP-* branches, one real web.xml or pom.xml conflict resolved|||Nhánh feat/SWP-*, một xung đột web.xml hoặc pom.xml thật được giải' },
      { moc: 5, dung: 'Revert a bad commit already on main instead of resetting it|||Revert một commit hỏng đã lên main thay vì reset' },
      { moc: 6, dung: 'Every member has origin + tracking branches; no one works on local main|||Mọi thành viên có origin + nhánh theo dõi; không ai làm trên main cục bộ' },
      { moc: 7, dung: 'Ruleset on main, PR template, CODEOWNERS by package folder|||Ruleset trên main, mẫu PR, CODEOWNERS theo thư mục package' },
      { moc: 8, dung: 'CONTRIBUTING.md with GitHub flow, v0.1.0 at the end of iteration 1|||CONTRIBUTING.md theo GitHub flow, v0.1.0 cuối iteration 1' },
      { moc: 9, dung: 'Clean personal branches before review; drill removing a fake DB password from a copy|||Dọn nhánh cá nhân trước review; diễn tập gỡ mật khẩu CSDL giả khỏi một bản sao' },
      { moc: 10, dung: 'Find the biggest blobs (a committed .war or .jar?) and decide what to do|||Tìm blob lớn nhất (lỡ commit .war hay .jar?) và quyết định xử lý' },
      { moc: 11, dung: 'Worktree for a hotfix while your feature is half done|||Worktree để làm hotfix khi tính năng đang dở' },
      { moc: 12, dung: 'Issues per user story, Projects board per sprint, Maven build in Actions|||Issue theo user story, bảng Projects theo sprint, build Maven trên Actions' },
      { moc: 13, dung: 'Shared hooks (core.hooksPath) block .env and bad messages for all 5 members|||Hook dùng chung (core.hooksPath) chặn .env và lời nhắn sai cho cả 5 người' },
      { moc: 14, dung: 'RUNBOOK.md written from the team’s real accidents, plus a recovery drill|||RUNBOOK.md viết từ tai nạn thật của nhóm, kèm một buổi diễn tập cứu' },
      { moc: 15, dung: '.gitattributes ends CRLF noise between Windows and Mac members|||.gitattributes chấm dứt nhiễu CRLF giữa bạn dùng Windows và Mac' },
      { moc: 16, dung: 'README that a recruiter can read: screenshots, roles, how to run|||README nhà tuyển dụng đọc được: ảnh, vai trò từng người, cách chạy' },
      { moc: 17, dung: 'Full sprint: 4 issues → 4 PRs → v1.0.0 → hotfix v1.0.1|||Một sprint trọn: 4 issue → 4 PR → v1.0.0 → hotfix v1.0.1' },
      { moc: 18, dung: 'Postmortem of one real team accident + the rule that prevents it|||Hậu kiểm một tai nạn thật của nhóm + luật ngăn nó tái diễn' },
    ],
    thamKhaoThat: [
      'GitHub flow — the branch + pull request process GitHub documents at docs.github.com|||GitHub flow — quy trình nhánh + pull request được GitHub mô tả ở docs.github.com',
      'Chapters 16–18 of this course simulate exactly this kind of Java web team repo|||Chương 16–18 của khoá này mô phỏng đúng loại repo nhóm Java web này',
    ],
    anh: null,
  },
  {
    slug: 'do-an-mon',
    ten: 'Your course project repo (FER202 / SDN302 / PRJ301)|||Repo đồ án môn (FER202 / SDN302 / PRJ301)',
    moTa: 'A solo or pair project for one subject: a React app for FER202, a Node/Express API for SDN302, a Servlet app for PRJ301. Small code base, but you run it with the same discipline as a team repo; a classmate or mentor is your reviewer.|||Đồ án một người hoặc hai người cho một môn: app React cho FER202, API Node/Express cho SDN302, app Servlet cho PRJ301. Mã nhỏ nhưng bạn vận hành bằng đúng kỷ luật của repo nhóm; một bạn cùng lớp hoặc mentor làm người review.',
    doKho: 1,
    tinhNang: [
      'Atomic Conventional Commits from the first day|||Commit nguyên tử theo Conventional Commits từ ngày đầu',
      '.gitignore for node_modules/, dist/, .env (or target/ for Java)|||.gitignore cho node_modules/, dist/, .env (hoặc target/ với Java)',
      'One branch + one PR per feature, reviewed by a classmate|||Mỗi tính năng một nhánh + một PR, bạn cùng lớp review',
      'GitHub Actions: npm ci + build (and tests if any) on every PR|||GitHub Actions: npm ci + build (và test nếu có) trên mọi PR',
      'GitHub Pages demo for front-end projects|||Bản demo trên GitHub Pages với dự án front-end',
      'Tag v1.0.0 = the version you submit, with release notes|||Tag v1.0.0 = bản nộp, kèm release notes',
      'README with screenshots, how to run, what you learned|||README có ảnh, cách chạy, điều bạn học được',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Create the repo, add your reviewer as collaborator|||Tạo repo, thêm người review làm collaborator' },
      { moc: 2, dung: 'node_modules/ and .env never tracked; .env.example committed|||node_modules/ và .env không bao giờ bị theo dõi; commit .env.example' },
      { moc: 3, dung: 'Find when a component or route was introduced with log -S / blame|||Tìm khi nào một component hay route xuất hiện bằng log -S / blame' },
      { moc: 4, dung: 'feat/cart, feat/router … merged with at least one real conflict|||feat/cart, feat/router … merge với ít nhất một xung đột thật' },
      { moc: 5, dung: 'Revert a broken component, recover a deleted branch with reflog|||Revert một component hỏng, cứu nhánh đã xoá bằng reflog' },
      { moc: 6, dung: 'Push over SSH or the credential manager, tags pushed explicitly|||Push qua SSH hoặc credential manager, đẩy tag một cách tường minh' },
      { moc: 7, dung: 'Self-review checklist + one classmate review per PR, squash merge|||Checklist tự review + một bạn review mỗi PR, squash merge' },
      { moc: 8, dung: 'v0.1.0 after the first working screen, CHANGELOG.md|||v0.1.0 sau màn hình chạy được đầu tiên, CHANGELOG.md' },
      { moc: 9, dung: 'rebase -i to tidy a messy feature branch before the PR|||rebase -i dọn một nhánh tính năng lộn xộn trước PR' },
      { moc: 10, dung: 'Audit: is a dist/ or a video lurking in history?|||Kiểm toán: có dist/ hay video nào nằm trong lịch sử không?' },
      { moc: 11, dung: 'Worktree for "fix the demo before class" while a feature is open|||Worktree để "sửa demo trước giờ học" khi tính năng đang mở' },
      { moc: 12, dung: 'Issues as your own to-do list, CI required before merge|||Issue làm danh sách việc của chính bạn, CI bắt buộc trước khi merge' },
      { moc: 13, dung: 'pre-commit runs lint, commit-msg checks the type prefix|||pre-commit chạy lint, commit-msg kiểm tiền tố type' },
      { moc: 14, dung: 'RUNBOOK.md for a solo dev: the five commands that saved you|||RUNBOOK.md cho người làm một mình: năm lệnh đã cứu bạn' },
      { moc: 15, dung: 'Aliases + includeIf so school work uses the school email|||Alias + includeIf để việc trường dùng email trường' },
      { moc: 16, dung: 'Pages demo + README + pinned on your profile|||Demo Pages + README + ghim trên hồ sơ' },
      { moc: 17, dung: 'Pair sprint: 4 small issues, release v1.0.0, hotfix v1.0.1|||Sprint hai người: 4 issue nhỏ, phát hành v1.0.0, hotfix v1.0.1' },
      { moc: 18, dung: 'Reproduce one Chapter 18 accident on a copy, write its postmortem|||Tái hiện một tai nạn Chương 18 trên bản sao, viết hậu kiểm' },
    ],
    thamKhaoThat: [
      'The Vite guide "Deploying a Static Site" (GitHub Pages section) — the same path used in Chapter 15|||Hướng dẫn "Deploying a Static Site" của Vite (mục GitHub Pages) — đúng đường Chương 15 dùng',
      'Any well-kept student portfolio repo: one feature per PR, a green CI badge, a live demo link|||Mọi repo portfolio sinh viên được giữ tốt: mỗi tính năng một PR, huy hiệu CI xanh, link demo chạy được',
    ],
    anh: null,
  },
  {
    slug: 'thu-vien-nho',
    ten: 'A small library of your own (npm package or Java library)|||Một thư viện nhỏ của riêng bạn (gói npm hoặc thư viện Java)',
    moTa: 'A small reusable library — for example Vietnamese number/date formatting, a slug generator with Vietnamese diacritics, or a form validation helper. Libraries live and die by versioning: other people depend on your tags, so semver, changelogs and releases matter more than anywhere else.|||Một thư viện nhỏ dùng lại được — ví dụ định dạng số/ngày kiểu Việt Nam, tạo slug bỏ dấu tiếng Việt, hay bộ kiểm form. Thư viện sống nhờ đánh phiên bản: người khác phụ thuộc vào tag của bạn, nên semver, changelog và release quan trọng hơn ở bất cứ đâu.',
    doKho: 2,
    tinhNang: [
      'Strict semantic versioning: breaking change ⇒ major bump|||Semver nghiêm: thay đổi phá vỡ ⇒ tăng số major',
      'CHANGELOG.md driven by Conventional Commits|||CHANGELOG.md dựa trên Conventional Commits',
      'Annotated tags + GitHub Releases for every version|||Tag có chú thích + GitHub Release cho mọi phiên bản',
      'CI matrix (two Node or JDK versions) with tests|||CI ma trận (hai phiên bản Node hoặc JDK) có test',
      'Issue templates, CONTRIBUTING.md, a LICENSE|||Mẫu issue, CONTRIBUTING.md, một LICENSE',
      'At least one PR from someone else’s fork merged|||Ít nhất một PR từ fork của người khác được merge',
      'A maintenance branch (v1.x) receiving a backported fix|||Một nhánh bảo trì (v1.x) nhận một bản sửa được backport',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Public repo with LICENSE and a one-paragraph README|||Repo public có LICENSE và README một đoạn' },
      { moc: 2, dung: 'src/ + tests/ committed separately, build output ignored|||src/ + tests/ commit riêng, kết quả build bị ignore' },
      { moc: 3, dung: 'Explain one function’s history with blame + log -L|||Giải thích lịch sử một hàm bằng blame + log -L' },
      { moc: 4, dung: 'A feature branch rebased onto main before merge|||Một nhánh tính năng được rebase lên main trước khi merge' },
      { moc: 5, dung: 'Revert a release-breaking commit and explain why not reset|||Revert một commit làm hỏng bản phát hành và giải thích vì sao không reset' },
      { moc: 6, dung: 'A friend forks, you add their fork as a remote to test their branch|||Một bạn fork, bạn thêm fork đó làm remote để thử nhánh của họ' },
      { moc: 7, dung: 'Review an outside PR with suggestions; require CI|||Review một PR từ ngoài bằng suggestion; bắt buộc CI' },
      { moc: 8, dung: 'v0.1.0 → v0.2.0 → v1.0.0 with a CHANGELOG entry each|||v0.1.0 → v0.2.0 → v1.0.0, mỗi bản một mục CHANGELOG' },
      { moc: 9, dung: 'Never rewrite a published tag; tidy only unpublished branches|||Không bao giờ viết lại tag đã công bố; chỉ dọn nhánh chưa công bố' },
      { moc: 10, dung: 'Show what a tag object contains with cat-file|||Cho thấy một đối tượng tag chứa gì bằng cat-file' },
      { moc: 11, dung: 'Worktree for the v1.x maintenance branch|||Worktree cho nhánh bảo trì v1.x' },
      { moc: 12, dung: 'CI matrix + Dependabot + a release workflow on tag push|||CI ma trận + Dependabot + workflow phát hành khi push tag' },
      { moc: 13, dung: 'Signed tags/commits so users can verify releases|||Ký tag/commit để người dùng kiểm được bản phát hành' },
      { moc: 14, dung: 'Recover a deleted release tag from reflog or a clone|||Cứu một tag phát hành bị xoá từ reflog hoặc một bản clone' },
      { moc: 15, dung: '.gitattributes (eol, export-ignore) and an .editorconfig|||.gitattributes (eol, export-ignore) và .editorconfig' },
      { moc: 16, dung: 'README with install/usage, badges, "good first issue" labels|||README có cài đặt/cách dùng, huy hiệu, nhãn "good first issue"' },
      { moc: 17, dung: 'A sprint with an outside contributor, release + backport|||Một sprint có người đóng góp từ ngoài, phát hành + backport' },
      { moc: 18, dung: 'Postmortem: "a breaking change shipped as a patch"|||Hậu kiểm: "một thay đổi phá vỡ bị phát hành dưới dạng bản vá"' },
    ],
    thamKhaoThat: [
      'date-fns (github.com/date-fns/date-fns) — semver, CHANGELOG and a release per tag|||date-fns (github.com/date-fns/date-fns) — semver, CHANGELOG và một release mỗi tag',
      'Keep a Changelog (keepachangelog.com) and Semantic Versioning (semver.org)|||Keep a Changelog (keepachangelog.com) và Semantic Versioning (semver.org)',
    ],
    anh: null,
  },
  {
    slug: 'repo-tai-lieu',
    ten: 'A documentation / content repository (study notes, open handbook)|||Repo tài liệu / nội dung (ghi chú môn học, sổ tay mở)',
    moTa: 'No app at all: a repository of Markdown — your notes for a subject, an exam-prep handbook for your class, or a team wiki. Git is just as useful for prose: every edit reviewed in a PR, a CI that lints Markdown and checks links, and a GitHub Pages site readers actually visit.|||Không có app nào: một repo Markdown — ghi chú môn học của bạn, sổ tay ôn thi cho lớp, hay wiki của nhóm. Git có ích cho văn bản không kém mã: mỗi chỉnh sửa được review trong PR, CI kiểm Markdown và link, và một trang GitHub Pages người đọc thật sự vào.',
    doKho: 1,
    tinhNang: [
      'One folder per chapter, CODEOWNERS per folder|||Mỗi chương một thư mục, CODEOWNERS theo thư mục',
      'Every edit through a PR with at least one reviewer|||Mọi chỉnh sửa đi qua PR có ít nhất một người review',
      'CI: Markdown lint + link check on PRs|||CI: kiểm Markdown + kiểm link trên PR',
      'GitHub Pages site built from the repo|||Trang GitHub Pages dựng từ repo',
      'Tagged editions (v2026.1 = Fall 2026 edition) with release notes|||Ấn bản gắn tag (v2026.1 = ấn bản Fall 2026) có ghi chú phát hành',
      'Images kept small or in LFS, never 20 MB screenshots in history|||Ảnh giữ nhỏ hoặc dùng LFS, không bao giờ có ảnh chụp 20 MB trong lịch sử',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Repo with README + first chapter folder, classmates invited|||Repo có README + thư mục chương đầu, mời bạn cùng lớp' },
      { moc: 2, dung: 'One commit per topic, .DS_Store and editor files ignored|||Mỗi chủ đề một commit, ignore .DS_Store và file của trình soạn thảo' },
      { moc: 3, dung: 'Who wrote this paragraph and why — blame on a .md file|||Ai viết đoạn này và vì sao — blame trên file .md' },
      { moc: 4, dung: 'Two people edit the same page ⇒ a prose conflict resolved|||Hai người sửa cùng một trang ⇒ giải một xung đột văn bản' },
      { moc: 5, dung: 'Restore a deleted page from history with restore --source|||Khôi phục một trang đã xoá từ lịch sử bằng restore --source' },
      { moc: 6, dung: 'Classmates contribute through branches or forks|||Bạn cùng lớp đóng góp qua nhánh hoặc fork' },
      { moc: 7, dung: 'Review prose with suggested changes, require 1 approval|||Review văn bản bằng suggested changes, bắt buộc 1 approval' },
      { moc: 8, dung: 'Edition tags (v2026.1) and a changelog of what changed per edition|||Tag ấn bản (v2026.1) và changelog mỗi ấn bản đổi gì' },
      { moc: 9, dung: 'Remove a classmate’s phone number from history on a copy (drill)|||Gỡ số điện thoại của bạn khỏi lịch sử trên một bản sao (diễn tập)' },
      { moc: 10, dung: 'Find the heaviest image blobs; decide resize vs LFS|||Tìm blob ảnh nặng nhất; quyết định thu nhỏ hay LFS' },
      { moc: 11, dung: 'LFS or a size rule for images; sparse-checkout one chapter|||LFS hoặc luật dung lượng ảnh; sparse-checkout một chương' },
      { moc: 12, dung: 'markdownlint + link check in Actions, Pages deploy workflow|||markdownlint + kiểm link trên Actions, workflow deploy Pages' },
      { moc: 13, dung: 'pre-commit blocks images over 1 MB|||pre-commit chặn ảnh trên 1 MB' },
      { moc: 14, dung: 'Recover a page lost in a bad merge|||Cứu một trang bị mất trong một lần merge hỏng' },
      { moc: 15, dung: '.gitattributes: *.md text eol=lf, images binary|||.gitattributes: *.md text eol=lf, ảnh là binary' },
      { moc: 16, dung: 'The Pages site is the portfolio piece; pin it|||Trang Pages chính là sản phẩm portfolio; ghim nó' },
      { moc: 17, dung: 'An exam-season sprint: 4 chapters, 4 PRs, edition release|||Sprint mùa thi: 4 chương, 4 PR, phát hành ấn bản' },
      { moc: 18, dung: 'Postmortem: "a merge deleted a whole chapter"|||Hậu kiểm: "một lần merge xoá mất cả chương"' },
    ],
    thamKhaoThat: [
      'MDN Web Docs content (github.com/mdn/content) — every article edit is a reviewed pull request|||Nội dung MDN Web Docs (github.com/mdn/content) — mỗi chỉnh sửa bài viết là một pull request được review',
      'The Pro Git book source (github.com/progit/progit2) — a whole book run as a Git repository|||Mã nguồn sách Pro Git (github.com/progit/progit2) — cả một cuốn sách vận hành như một repo Git',
    ],
    anh: null,
  },
  {
    slug: 'monorepo-fullstack',
    ten: 'A front-end + back-end monorepo|||Monorepo frontend + backend',
    moTa: 'One repository holding frontend/ (React or Next.js), backend/ (Node or Spring) and docs/. The interesting Git problems appear here: who owns which folder, CI that only runs for the part that changed, people who only need half the tree, and releasing two apps from one history.|||Một repo chứa frontend/ (React hoặc Next.js), backend/ (Node hoặc Spring) và docs/. Những bài toán Git thú vị xuất hiện ở đây: ai sở hữu thư mục nào, CI chỉ chạy cho phần bị đổi, người chỉ cần nửa cây thư mục, và phát hành hai app từ cùng một lịch sử.',
    doKho: 3,
    tinhNang: [
      'CODEOWNERS per top-level folder|||CODEOWNERS theo từng thư mục cấp đầu',
      'Path-filtered CI: frontend jobs only when frontend/** changes|||CI lọc theo đường dẫn: job frontend chỉ chạy khi frontend/** đổi',
      'sparse-checkout instructions for front-end-only members|||Hướng dẫn sparse-checkout cho thành viên chỉ làm frontend',
      'worktrees for parallel hotfix and feature work|||worktree cho hotfix và tính năng song song',
      'Prefixed tags per app (frontend-v1.2.0, backend-v1.1.0)|||Tag có tiền tố theo app (frontend-v1.2.0, backend-v1.1.0)',
      'Design assets in Git LFS (or a documented reason not to)|||Tài nguyên thiết kế trong Git LFS (hoặc lý do ghi rõ vì sao không)',
      'An ADR explaining monorepo vs two repos vs submodule|||Một ADR giải thích monorepo vs hai repo vs submodule',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Create the repo with frontend/, backend/, docs/ skeletons|||Tạo repo với khung frontend/, backend/, docs/' },
      { moc: 2, dung: 'One root .gitignore + per-folder ignores; scoped commits feat(frontend): …|||Một .gitignore gốc + ignore theo thư mục; commit có phạm vi feat(frontend): …' },
      { moc: 3, dung: 'git log -- backend/ to read one app’s history only|||git log -- backend/ để đọc lịch sử riêng một app' },
      { moc: 4, dung: 'Cross-folder feature (API + UI) on one branch, merged once|||Tính năng xuyên thư mục (API + UI) trên một nhánh, merge một lần' },
      { moc: 5, dung: 'Revert only the backend half of a mixed commit|||Revert chỉ nửa backend của một commit lẫn lộn' },
      { moc: 6, dung: 'Push prefixed tags; prune merged remote branches|||Push tag có tiền tố; dọn nhánh remote đã merge' },
      { moc: 7, dung: 'CODEOWNERS: frontend team must approve frontend/**|||CODEOWNERS: nhóm frontend phải duyệt frontend/**' },
      { moc: 8, dung: 'Release two apps from one history with prefixed tags|||Phát hành hai app từ một lịch sử bằng tag có tiền tố' },
      { moc: 9, dung: 'Split a mixed commit into frontend and backend commits|||Tách một commit lẫn lộn thành commit frontend và commit backend' },
      { moc: 10, dung: 'Measure the repo; which folder costs the most?|||Đo repo; thư mục nào tốn dung lượng nhất?' },
      { moc: 11, dung: 'sparse-checkout cone for frontend/ + an ADR on structure|||sparse-checkout dạng cone cho frontend/ + ADR về cấu trúc' },
      { moc: 12, dung: 'Actions with paths: filters, required checks per app|||Actions với bộ lọc paths:, kiểm tra bắt buộc theo app' },
      { moc: 13, dung: 'Hooks that lint only staged files of the touched app|||Hook chỉ lint file đã staging của app bị đụng' },
      { moc: 14, dung: 'Recover after a bad cross-app merge|||Cứu sau một lần merge xuyên app bị hỏng' },
      { moc: 15, dung: 'Workspace settings + .gitattributes for both stacks|||Cài đặt workspace + .gitattributes cho cả hai stack' },
      { moc: 16, dung: 'README with an architecture diagram and per-app run steps|||README có sơ đồ kiến trúc và bước chạy từng app' },
      { moc: 17, dung: 'Sprint touching both apps, two releases, one hotfix|||Sprint đụng cả hai app, hai bản phát hành, một hotfix' },
      { moc: 18, dung: 'Postmortem: "frontend deploy broke because backend tag was wrong"|||Hậu kiểm: "deploy frontend hỏng vì tag backend sai"' },
    ],
    thamKhaoThat: [
      'vercel/next.js and babel/babel — large monorepos run on GitHub|||vercel/next.js và babel/babel — các monorepo lớn vận hành trên GitHub',
      'cuongthai.com itself: one repository with the back end at the root plus frontend/ and desktop/|||Chính cuongthai.com: một repo với backend ở gốc cộng frontend/ và desktop/',
    ],
    anh: null,
  },
  {
    slug: 'dong-gop-oss',
    ten: 'Contributing to a real open-source project (good first issue)|||Đóng góp vào một dự án mã nguồn mở thật (good first issue)',
    moTa: 'You pick an active open-source project with issues labelled "good first issue", fork it, and land one or more real pull requests by following its CONTRIBUTING rules. Because you are not an admin there, the milestones that need admin rights (rulesets, Actions settings, releases) are done in a small companion repo of your own.|||Bạn chọn một dự án mã nguồn mở đang hoạt động có issue gắn nhãn "good first issue", fork nó, và đưa được một hoặc nhiều pull request thật bằng cách theo đúng luật CONTRIBUTING của họ. Vì bạn không phải admin ở đó, các mốc cần quyền admin (ruleset, cài đặt Actions, release) làm trên một repo đồng hành nhỏ của riêng bạn.',
    doKho: 2,
    tinhNang: [
      'Fork + origin/upstream remotes, fork kept in sync|||Fork + hai remote origin/upstream, fork luôn được đồng bộ',
      'Read and follow CONTRIBUTING.md and the code of conduct|||Đọc và theo CONTRIBUTING.md cùng quy tắc ứng xử',
      'Claim an issue politely, one focused PR per issue|||Xin nhận issue lịch sự, mỗi issue một PR gọn',
      'DCO sign-off (-s) or CLA if the project requires it|||Ký DCO (-s) hoặc CLA nếu dự án yêu cầu',
      'Rebase on upstream/main and force-with-lease your own PR branch|||Rebase lên upstream/main và force-with-lease nhánh PR của chính bạn',
      'Respond to review until merged or clearly closed|||Phản hồi review tới khi được merge hoặc đóng rõ ràng',
      'A companion repo for the admin-only milestones|||Một repo đồng hành cho các mốc cần quyền admin',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Choose the project, fork it, create the companion repo|||Chọn dự án, fork nó, tạo repo đồng hành' },
      { moc: 2, dung: 'Match the project’s commit style exactly (read its log first)|||Theo đúng phong cách commit của dự án (đọc log của họ trước)' },
      { moc: 3, dung: 'Investigate the code behind your issue with blame/log -S|||Điều tra đoạn mã liên quan issue của bạn bằng blame/log -S' },
      { moc: 4, dung: 'Branch from upstream/main, never from your fork’s stale main|||Tạo nhánh từ upstream/main, không từ main cũ của fork' },
      { moc: 5, dung: 'Undo a wrong local change without touching the PR history others reviewed|||Hoàn tác một thay đổi sai cục bộ mà không đụng lịch sử PR người khác đã review' },
      { moc: 6, dung: 'origin = your fork, upstream = the project; sync with fetch upstream|||origin = fork của bạn, upstream = dự án; đồng bộ bằng fetch upstream' },
      { moc: 7, dung: 'Open the PR following their template; answer review comments|||Mở PR theo mẫu của họ; trả lời bình luận review' },
      { moc: 8, dung: 'Read how the project branches and releases; write it down|||Đọc cách dự án chia nhánh và phát hành; ghi lại' },
      { moc: 9, dung: 'Rebase your PR on new upstream commits, force-with-lease|||Rebase PR lên commit upstream mới, force-with-lease' },
      { moc: 10, dung: 'Partial clone (--filter=blob:none) of a big project|||Clone một phần (--filter=blob:none) một dự án lớn' },
      { moc: 11, dung: 'Worktree per PR when you have two PRs open|||Mỗi PR một worktree khi bạn mở hai PR' },
      { moc: 12, dung: 'Read their CI logs and fix your PR until green|||Đọc log CI của họ và sửa PR tới khi xanh' },
      { moc: 13, dung: 'Sign-off / signed commits as the project requires|||Sign-off / commit có chữ ký theo yêu cầu của dự án' },
      { moc: 14, dung: 'Recover a PR branch you accidentally reset|||Cứu một nhánh PR lỡ bị reset' },
      { moc: 15, dung: 'Respect their .editorconfig/.gitattributes; no whitespace noise|||Tôn trọng .editorconfig/.gitattributes của họ; không nhiễu khoảng trắng' },
      { moc: 16, dung: 'Merged PR linked from your profile README|||PR đã merge được dẫn link từ profile README' },
      { moc: 17, dung: 'Second contribution, or help review someone else’s PR|||Đóng góp thứ hai, hoặc giúp review PR của người khác' },
      { moc: 18, dung: 'Postmortem of a review round that went badly, and what you changed|||Hậu kiểm một vòng review không suôn sẻ và bạn đã đổi gì' },
    ],
    thamKhaoThat: [
      'firstcontributions/first-contributions — a safe repo built for a first practice PR|||firstcontributions/first-contributions — repo an toàn dựng sẵn cho PR tập đầu tiên',
      'goodfirstissue.dev and the GitHub "good first issue" label search|||goodfirstissue.dev và tìm theo nhãn "good first issue" trên GitHub',
    ],
    anh: null,
  },
];

/* ─────────────────────────── Mốc (18) ─────────────────────────── */
// Thứ tự = thứ tự học trong git.mjs: Khởi động nhanh → Chương 1 … 16 → Chương 18.
const MOC = [
  {
    so: 1, slug: 'git-moc-1', sauChuong: 'Quick start|||Khởi động nhanh',
    ten: 'Day 0: the project repository exists and everyone can push|||Ngày 0: repo dự án tồn tại và mọi người push được',
    lead: 'Turn the topic you registered into a real repository on GitHub. Every later milestone happens in THIS repository, so get the identities and access right today.|||Biến đề tài bạn đã đăng ký thành một repo thật trên GitHub. Mọi mốc sau đều làm trên CHÍNH repo này, nên hôm nay phải làm đúng danh tính và quyền truy cập.',
    yeuCau: [
      'Create the repository on GitHub (team: the leader creates it; OSS topic: fork the project AND create your companion repo)|||Tạo repo trên GitHub (nhóm: trưởng nhóm tạo; đề tài OSS: fork dự án VÀ tạo repo đồng hành)',
      'A README.md with: topic name, one-paragraph goal, members and roles|||README.md có: tên đề tài, một đoạn mục tiêu, thành viên và vai trò',
      'Invite every member (or your reviewer) as a collaborator; every invitation accepted|||Mời mọi thành viên (hoặc người review) làm collaborator; mọi lời mời đã được nhận',
      'Every member clones with git clone (never the ZIP) and pushes one commit that adds their name to README|||Mọi thành viên clone bằng git clone (không tải ZIP) và push một commit thêm tên mình vào README',
      'Every commit shows the right author: git log --format="%h %an <%ae>" lists real names and the emails linked to each GitHub account|||Mọi commit hiện đúng tác giả: git log --format="%h %an <%ae>" liệt kê tên thật và email gắn với tài khoản GitHub của từng người',
    ],
    nangCao: [
      'Create the repo from the terminal with gh repo create|||Tạo repo từ terminal bằng gh repo create',
      'Connect the repo to CT Work (webhook) as in lesson KĐ.10|||Nối repo với CT Work (webhook) như bài KĐ.10',
    ],
    datKhi: [
      'The repository URL opens for your reviewer/lecturer|||Link repo mở được với người review/giảng viên',
      'Settings → Collaborators shows no pending invitation|||Settings → Collaborators không còn lời mời đang chờ',
      'git log shows one commit per member with a real name and a verified-account email (avatar visible on GitHub)|||git log có mỗi thành viên một commit với tên thật và email của tài khoản (GitHub hiện avatar)',
    ],
    goiY: [
      'Run git config --global user.name and user.email on EACH machine before the first commit|||Chạy git config --global user.name và user.email trên TỪNG máy trước commit đầu tiên',
      'A grey avatar on a commit = the email is not linked to any GitHub account; fix the config, then amend while it is unpushed|||Avatar xám trên commit = email không gắn với tài khoản GitHub nào; sửa config rồi amend khi chưa push',
      '403 on push usually means the credential manager logged in as another account — see KĐ.3|||Lỗi 403 khi push thường là credential manager đang đăng nhập tài khoản khác — xem KĐ.3',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the repository (and, for OSS, to your fork + companion repo)|||Link repo (với đề tài OSS: link fork + repo đồng hành)',
      'Output of git log --format="%h %an <%ae> %s"|||Output của git log --format="%h %an <%ae> %s"',
      'Screenshot of Settings → Collaborators|||Ảnh chụp Settings → Collaborators',
    ],
  },
  {
    so: 2, slug: 'git-moc-2', sauChuong: 'Chapter 1|||Chương 1',
    ten: 'Clean commits: an ignore file that protects you, and atomic messages|||Commit sạch: file ignore bảo vệ bạn, và lời nhắn nguyên tử',
    lead: 'Make the history of your repository something you are proud to show: nothing generated, nothing secret, every commit one idea with a message a stranger understands.|||Làm cho lịch sử repo thành thứ bạn tự hào khoe: không có file sinh ra, không có bí mật, mỗi commit một ý với lời nhắn người lạ đọc vẫn hiểu.',
    yeuCau: [
      'A .gitignore that fits your stack (node_modules/, dist/, build/, target/, nbproject/private/, .env, OS files)|||.gitignore khớp stack của bạn (node_modules/, dist/, build/, target/, nbproject/private/, .env, file của hệ điều hành)',
      'A committed .env.example with placeholder values; the real .env never tracked|||Commit .env.example với giá trị giữ chỗ; .env thật không bao giờ bị theo dõi',
      'At least 5 new commits in Conventional Commits form (feat:, fix:, docs:, chore:…), each doing ONE thing|||Ít nhất 5 commit mới theo Conventional Commits (feat:, fix:, docs:, chore:…), mỗi commit làm MỘT việc',
      'At least one commit built with git add -p from a file that held two unrelated changes|||Ít nhất một commit dựng bằng git add -p từ một file chứa hai thay đổi không liên quan',
      'If anything generated or secret was already tracked: git rm --cached it, commit, and note it in the README|||Nếu đã lỡ theo dõi file sinh ra hay bí mật: git rm --cached, commit, và ghi chú trong README',
    ],
    nangCao: [
      'A commit body that explains WHY for at least two commits|||Thân commit giải thích VÌ SAO cho ít nhất hai commit',
      'A global ignore file (core.excludesFile) for your OS/editor junk|||File ignore toàn cục (core.excludesFile) cho rác của hệ điều hành/trình soạn thảo',
    ],
    datKhi: [
      'git ls-files | grep -E "(^|/)(node_modules|build|target|dist)/|\\.env$" prints nothing|||git ls-files | grep -E "(^|/)(node_modules|build|target|dist)/|\\.env$" không in ra gì',
      'git status is clean after a fresh build/run of the project|||git status sạch sau khi build/chạy lại dự án',
      'git log --oneline shows ≥ 5 typed, imperative subjects under 72 characters|||git log --oneline cho thấy ≥ 5 tiêu đề có type, thể mệnh lệnh, dưới 72 ký tự',
    ],
    goiY: [
      'Build or run the project once, then run git status: whatever new appears is your ignore list|||Build hoặc chạy dự án một lần rồi git status: thứ gì mới hiện ra chính là danh sách cần ignore',
      'git check-ignore -v <file> tells you which line ignores a file|||git check-ignore -v <file> cho biết dòng nào đang ignore một file',
      'If .env was ever pushed, rotate the secret first — removing it from history comes in milestone 9|||Nếu .env từng bị push, đổi khoá trước — gỡ khỏi lịch sử là việc của mốc 9',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to .gitignore and .env.example in the repo|||Link tới .gitignore và .env.example trong repo',
      'Output of git log --oneline -10 and of the ls-files check above|||Output của git log --oneline -10 và của phép kiểm ls-files ở trên',
    ],
  },
  {
    so: 3, slug: 'git-moc-3', sauChuong: 'Chapter 2|||Chương 2',
    ten: 'Read your own history: five questions answered with commands|||Đọc lịch sử của chính bạn: năm câu hỏi trả lời bằng lệnh',
    lead: 'Write HISTORY-NOTES.md in your repo: five real questions about your own project, each answered by a command and its real output — the same archaeology a senior does on day one at a new job.|||Viết HISTORY-NOTES.md trong repo: năm câu hỏi thật về dự án của bạn, mỗi câu trả lời bằng một lệnh và output thật — đúng việc khảo cổ mà một senior làm ngày đầu ở công ty mới.',
    yeuCau: [
      'Who has touched which part most? (git shortlog -sn, optionally -- <folder>)|||Ai đụng phần nào nhiều nhất? (git shortlog -sn, có thể thêm -- <thư mục>)',
      'Which commit and which person wrote one important line? (git blame -L)|||Commit nào và ai viết một dòng quan trọng? (git blame -L)',
      'When did a string/function first appear or disappear? (git log -S)|||Một chuỗi/hàm xuất hiện hay biến mất lần đầu khi nào? (git log -S)',
      'What changed between two points? (git diff <a>..<b> --stat, git show)|||Giữa hai thời điểm đã đổi gì? (git diff <a>..<b> --stat, git show)',
      'Bisect drill: on a throw-away branch, plant a bug a few commits back, then find it with git bisect run|||Diễn tập bisect: trên một nhánh nháp, gieo một lỗi vài commit trước, rồi tìm ra bằng git bisect run',
    ],
    nangCao: [
      'git log -L to follow the history of one function|||git log -L để theo lịch sử một hàm',
      'A pretty-format alias you will keep using|||Một alias pretty-format bạn sẽ dùng tiếp',
    ],
    datKhi: [
      'HISTORY-NOTES.md has 5 questions, each with the exact command and real output from YOUR repo|||HISTORY-NOTES.md có 5 câu hỏi, mỗi câu có đúng lệnh và output thật từ repo CỦA BẠN',
      'The bisect section names the first bad commit and the throw-away branch is deleted afterwards|||Phần bisect nêu đúng commit hỏng đầu tiên và nhánh nháp đã được xoá sau đó',
    ],
    goiY: [
      'Pick questions you really asked this week ("why is this config here?")|||Chọn câu hỏi bạn thật sự đã hỏi tuần này ("vì sao có cấu hình này?")',
      'bisect run needs a test that exits 0 for good and non-zero for bad — a one-line grep works|||bisect run cần một phép thử trả 0 khi tốt, khác 0 khi hỏng — một lệnh grep một dòng là đủ',
      'Always finish with git bisect reset|||Luôn kết thúc bằng git bisect reset',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to HISTORY-NOTES.md|||Link tới HISTORY-NOTES.md',
    ],
  },
  {
    so: 4, slug: 'git-moc-4', sauChuong: 'Chapter 3|||Chương 3',
    ten: 'Branches and merges: one branch per task, and a conflict you resolved calmly|||Nhánh và hợp nhất: mỗi việc một nhánh, và một xung đột bạn giải bình tĩnh',
    lead: 'From now on nothing is written on main directly. Work flows through short-lived branches, and you will meet — and resolve — at least one real conflict.|||Từ giờ không có gì được viết thẳng lên main. Việc chảy qua các nhánh ngắn hạn, và bạn sẽ gặp — rồi giải — ít nhất một xung đột thật.',
    yeuCau: [
      'A branch naming rule written in the README (e.g. feat/<card>-<short-name>, fix/…)|||Luật đặt tên nhánh ghi trong README (vd feat/<mã-thẻ>-<tên-ngắn>, fix/…)',
      'At least 3 feature branches merged into main|||Ít nhất 3 nhánh tính năng đã merge vào main',
      'At least one fast-forward merge and one three-way merge commit, visible in git log --graph|||Ít nhất một merge fast-forward và một merge commit ba chiều, thấy được trong git log --graph',
      'At least one real conflict resolved; write in the merge commit body what each side wanted and what you kept|||Ít nhất một xung đột thật được giải; ghi trong thân merge commit mỗi bên muốn gì và bạn giữ gì',
      'One personal branch tidied with git rebase -i (squash/reword) before merging|||Một nhánh cá nhân được dọn bằng git rebase -i (squash/reword) trước khi merge',
    ],
    nangCao: [
      'Turn on rerere and let it replay one resolution|||Bật rerere và để nó tự giải lại một xung đột',
      'Use merge.conflictstyle zdiff3 and explain the base section|||Dùng merge.conflictstyle zdiff3 và giải thích phần base',
    ],
    datKhi: [
      'git log --graph --oneline --all shows the branches, at least one merge commit and no work committed directly on main after this milestone|||git log --graph --oneline --all cho thấy các nhánh, ít nhất một merge commit và không có việc nào commit thẳng lên main sau mốc này',
      'No conflict markers left anywhere: git grep -n "^<<<<<<<" prints nothing|||Không còn dấu xung đột nào: git grep -n "^<<<<<<<" không in ra gì',
      'Merged branches are deleted (git branch --merged main shows only main)|||Nhánh đã merge được xoá (git branch --merged main chỉ còn main)',
    ],
    goiY: [
      'A conflict needs both branches to change the SAME lines — two people edit the same README section on purpose|||Xung đột cần hai nhánh sửa CÙNG dòng — cố ý cho hai người sửa cùng một mục README',
      'Read the three parts: ours, base (with zdiff3), theirs. Decide by meaning, not by deleting one side|||Đọc ba phần: ours, base (với zdiff3), theirs. Quyết định theo ý nghĩa, không phải xoá bừa một bên',
      'Only rebase branches nobody else has pulled|||Chỉ rebase nhánh chưa ai khác kéo về',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Screenshot or text of git log --graph --oneline --all -20|||Ảnh hoặc chữ của git log --graph --oneline --all -20',
      'Link to the merge commit that resolved the conflict|||Link tới merge commit đã giải xung đột',
    ],
  },
  {
    so: 5, slug: 'git-moc-5', sauChuong: 'Chapter 4|||Chương 4',
    ten: 'Undo without fear: an UNDO.md for your team, proven by a drill|||Hoàn tác không sợ: UNDO.md cho nhóm, chứng minh bằng một buổi diễn tập',
    lead: 'Every team eventually breaks main. Prepare the undo playbook now, while nothing is on fire, and prove each command on a throw-away branch.|||Nhóm nào rồi cũng có lúc làm hỏng main. Chuẩn bị sổ tay hoàn tác ngay bây giờ, khi chưa có gì cháy, và chứng minh từng lệnh trên một nhánh nháp.',
    yeuCau: [
      'UNDO.md: a table "situation → command → is it safe on a pushed branch?" with at least 6 rows|||UNDO.md: bảng "tình huống → lệnh → có an toàn trên nhánh đã push không?" với ít nhất 6 dòng',
      'Drill on a throw-away branch: reset --soft, --mixed, --hard and write what each did to the three trees|||Diễn tập trên nhánh nháp: reset --soft, --mixed, --hard và ghi mỗi lệnh đã làm gì với ba cây',
      'Revert one commit that is already on main (a real or a deliberately planted mistake) through a PR or a normal push|||Revert một commit đã nằm trên main (lỗi thật hoặc cố ý gieo) qua PR hoặc push bình thường',
      'Recover a "lost" commit with git reflog after a reset --hard|||Cứu một commit "đã mất" bằng git reflog sau reset --hard',
      'Use git stash (with a message) to switch branches mid-work, then pop it back|||Dùng git stash (có lời nhắn) để đổi nhánh giữa chừng, rồi pop lại',
    ],
    nangCao: [
      'Revert a merge commit with -m 1 and explain what reverting the revert means|||Revert một merge commit bằng -m 1 và giải thích "revert cái revert" nghĩa là gì',
      'git restore --source=<commit> to bring back one file only|||git restore --source=<commit> để lấy lại đúng một file',
    ],
    datKhi: [
      'main contains a "Revert …" commit and no rewritten history (no force push on main)|||main có một commit "Revert …" và không có lịch sử bị viết lại (không force push lên main)',
      'UNDO.md lists the reflog recovery with the real reflog lines from your drill|||UNDO.md ghi cách cứu bằng reflog kèm các dòng reflog thật từ buổi diễn tập',
    ],
    goiY: [
      'Pushed? ⇒ revert. Not pushed? ⇒ reset/amend are fine|||Đã push? ⇒ revert. Chưa push? ⇒ reset/amend thoải mái',
      'Before any reset --hard, run git status and git stash list — that is the only part reflog cannot save|||Trước mọi reset --hard, chạy git status và git stash list — đó là phần duy nhất reflog không cứu được',
      'HEAD@{1} is "where HEAD was one move ago", not "one commit ago"|||HEAD@{1} là "HEAD ở đâu một bước di chuyển trước", không phải "một commit trước"',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to UNDO.md and to the revert commit on main|||Link tới UNDO.md và tới commit revert trên main',
      'Screenshot of the reflog you used in the drill|||Ảnh reflog bạn dùng trong buổi diễn tập',
    ],
  },
  {
    so: 6, slug: 'git-moc-6', sauChuong: 'Chapter 5|||Chương 5',
    ten: 'Remotes done right: tracking branches, tags and a tidy GitHub|||Remote cho đúng: nhánh theo dõi, tag và một GitHub gọn gàng',
    lead: 'Make every member’s clone a correct mirror of GitHub: authenticated properly, tracking the right branches, with stale branches cleaned up.|||Biến bản clone của mọi thành viên thành tấm gương đúng của GitHub: xác thực đúng cách, theo dõi đúng nhánh, nhánh cũ được dọn.',
    yeuCau: [
      'Each member authenticates with SSH or the credential manager / a fine-grained token — never a password in the URL|||Mỗi thành viên xác thực bằng SSH hoặc credential manager / token fine-grained — không bao giờ để mật khẩu trong URL',
      'Every working branch has an upstream (git push -u once); git branch -vv shows [origin/…]|||Mọi nhánh làm việc có upstream (git push -u một lần); git branch -vv hiện [origin/…]',
      'Use fetch + inspect (git log HEAD..origin/main) before integrating, at least once on record|||Dùng fetch + xem trước (git log HEAD..origin/main) trước khi tích hợp, có ghi lại ít nhất một lần',
      'Push one annotated tag explicitly (git push origin <tag>)|||Push một tag có chú thích một cách tường minh (git push origin <tag>)',
      'Delete merged branches on GitHub and prune them locally (git fetch --prune)|||Xoá nhánh đã merge trên GitHub và dọn chúng ở máy (git fetch --prune)',
    ],
    nangCao: [
      'OSS/library topics: add a second remote (upstream or a friend’s fork) and fetch a branch from it|||Đề tài OSS/thư viện: thêm remote thứ hai (upstream hoặc fork của bạn bè) và fetch một nhánh từ đó',
      'Set fetch.prune=true and pull.ff=only (or pull.rebase) for the team|||Đặt fetch.prune=true và pull.ff=only (hoặc pull.rebase) cho cả nhóm',
    ],
    datKhi: [
      'git remote -v shows no token or password in any URL|||git remote -v không hiện token hay mật khẩu trong URL nào',
      'git branch -vv: every non-main branch tracks origin/<same name>|||git branch -vv: mọi nhánh khác main đều theo dõi origin/<cùng tên>',
      'The tag is visible on GitHub (Releases/Tags page)|||Tag thấy được trên GitHub (trang Releases/Tags)',
    ],
    goiY: [
      'fetch never changes your files; pull = fetch + merge (or rebase)|||fetch không bao giờ đổi file của bạn; pull = fetch + merge (hoặc rebase)',
      'git push does not send tags unless you ask (git push origin v0.1.0 or --follow-tags)|||git push không gửi tag nếu bạn không yêu cầu (git push origin v0.1.0 hoặc --follow-tags)',
      'A "[gone]" in git branch -vv means the remote branch was deleted — safe to delete yours if merged|||"[gone]" trong git branch -vv nghĩa là nhánh remote đã bị xoá — xoá nhánh của bạn được nếu đã merge',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Output of git remote -v and git branch -vv (each member, or yourself if solo)|||Output của git remote -v và git branch -vv (mỗi thành viên, hoặc của bạn nếu làm một mình)',
      'Link to the pushed tag|||Link tới tag đã push',
    ],
  },
  {
    so: 7, slug: 'git-moc-7', sauChuong: 'Chapter 6|||Chương 6',
    ten: 'Pull requests and real code review, behind a protected main|||Pull request và code review thật, sau một main được bảo vệ',
    lead: 'Switch the repository to the way companies work: main accepts changes only through reviewed pull requests.|||Chuyển repo sang cách công ty làm việc: main chỉ nhận thay đổi qua pull request đã được review.',
    yeuCau: [
      'A PR template (.github/pull_request_template.md): why, what, how to test, screenshots, linked issue|||Mẫu PR (.github/pull_request_template.md): vì sao, làm gì, cách test, ảnh, issue liên quan',
      'At least 3 merged PRs, each with at least one line comment from a reviewer|||Ít nhất 3 PR đã merge, mỗi PR có ít nhất một bình luận theo dòng của người review',
      'At least one PR that received "Request changes" and was fixed with follow-up commits|||Ít nhất một PR bị "Request changes" và được sửa bằng các commit tiếp theo',
      'Choose a merge strategy (merge / squash / rebase), enable only that one, write the reason in CONTRIBUTING.md|||Chọn một chiến lược merge (merge / squash / rebase), chỉ bật nó, ghi lý do trong CONTRIBUTING.md',
      'Protect main with a ruleset or branch protection: PR required, ≥ 1 approval, no force push, no deletion|||Bảo vệ main bằng ruleset hoặc branch protection: bắt buộc PR, ≥ 1 approval, cấm force push, cấm xoá',
    ],
    nangCao: [
      'CODEOWNERS so the right person is requested automatically|||CODEOWNERS để tự động yêu cầu đúng người review',
      'Use a suggested change in a review and let the author commit it from the UI|||Dùng suggested change trong review và để tác giả commit từ giao diện',
    ],
    datKhi: [
      'A direct git push to main is rejected (protected branch message)|||git push thẳng lên main bị từ chối (thông báo nhánh được bảo vệ)',
      '3 PR links, each showing review comments and an approval before merge|||3 link PR, mỗi PR có bình luận review và một approval trước khi merge',
    ],
    goiY: [
      'Solo topics: ask a classmate to be your reviewer and swap — you review theirs|||Đề tài làm một mình: nhờ một bạn cùng lớp review và đổi lại — bạn review của họ',
      'A good PR is small: under ~300 changed lines is reviewable in one sitting|||PR tốt là PR nhỏ: dưới ~300 dòng đổi thì review được trong một lần ngồi',
      'Review the change, not the person: ask questions, suggest, explain why|||Review thay đổi, không review con người: đặt câu hỏi, gợi ý, giải thích vì sao',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Links to 3 PRs (one with Request changes)|||Link 3 PR (một PR có Request changes)',
      'Screenshot of the ruleset/branch protection page and of the rejected direct push|||Ảnh trang ruleset/branch protection và ảnh lần push thẳng bị từ chối',
    ],
  },
  {
    so: 8, slug: 'git-moc-8', sauChuong: 'Chapter 7|||Chương 7',
    ten: 'A team workflow on paper, and your first real release|||Quy trình nhóm trên giấy, và bản phát hành thật đầu tiên',
    lead: 'Write down how your team branches and releases, then ship v0.1.0 the way it is written — and prove the hotfix path works.|||Viết ra nhóm bạn chia nhánh và phát hành thế nào, rồi phát hành v0.1.0 đúng như đã viết — và chứng minh đường hotfix chạy được.',
    yeuCau: [
      'CONTRIBUTING.md: chosen strategy (GitHub flow / trunk-based / git-flow) and WHY it fits your team size|||CONTRIBUTING.md: chiến lược đã chọn (GitHub flow / trunk-based / git-flow) và VÌ SAO hợp với quy mô nhóm',
      'An annotated, semver tag v0.1.0 on the commit you consider your first usable version|||Một tag có chú thích theo semver v0.1.0 trên commit bạn coi là bản dùng được đầu tiên',
      'A GitHub Release for v0.1.0 with notes grouped by type (Features / Fixes)|||Một GitHub Release cho v0.1.0 có ghi chú theo nhóm (Tính năng / Sửa lỗi)',
      'CHANGELOG.md with an entry for v0.1.0 (and an "Unreleased" section)|||CHANGELOG.md có mục cho v0.1.0 (và mục "Unreleased")',
      'A hotfix v0.1.1: branch from the tag, fix, tag, and bring the fix back to main|||Một hotfix v0.1.1: tạo nhánh từ tag, sửa, gắn tag, và đưa bản sửa về main',
    ],
    nangCao: [
      'git describe --tags in your build/about page|||git describe --tags trong trang build/giới thiệu',
      'Generate the notes with GitHub’s "Generate release notes" and then edit them|||Sinh ghi chú bằng "Generate release notes" của GitHub rồi biên tập lại',
    ],
    datKhi: [
      'git tag -n shows v0.1.0 and v0.1.1 with messages; git cat-file -t v0.1.0 prints "tag"|||git tag -n hiện v0.1.0 và v0.1.1 kèm lời nhắn; git cat-file -t v0.1.0 in "tag"',
      'The hotfix commit is reachable from main (git branch --contains <fix> lists main)|||Commit hotfix tới được từ main (git branch --contains <fix> có main)',
    ],
    goiY: [
      'Lightweight tag = just a name; annotated tag = an object with author, date and message — releases want annotated|||Tag nhẹ = chỉ là cái tên; tag có chú thích = một đối tượng có tác giả, ngày, lời nhắn — phát hành cần loại có chú thích',
      'Before 1.0.0 anything may change; still bump MINOR for features and PATCH for fixes|||Trước 1.0.0 cái gì cũng có thể đổi; vẫn tăng MINOR cho tính năng và PATCH cho sửa lỗi',
      'Hotfix: git switch -c hotfix/0.1.1 v0.1.0|||Hotfix: git switch -c hotfix/0.1.1 v0.1.0',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the v0.1.0 and v0.1.1 releases|||Link tới bản phát hành v0.1.0 và v0.1.1',
      'Link to CONTRIBUTING.md and CHANGELOG.md|||Link tới CONTRIBUTING.md và CHANGELOG.md',
    ],
  },
  {
    so: 9, slug: 'git-moc-9', sauChuong: 'Chapter 8|||Chương 8',
    ten: 'Rewrite history safely: tidy before review, and a leaked-secret drill|||Viết lại lịch sử an toàn: dọn trước review, và diễn tập lộ bí mật',
    lead: 'Rewriting history is a power tool: use it on your own unpublished work, never on shared history — and practise the one emergency where rewriting shared history is required.|||Viết lại lịch sử là dụng cụ mạnh: dùng trên việc chưa công bố của chính bạn, không bao giờ trên lịch sử chung — và tập trước đúng một tình huống khẩn cấp buộc phải viết lại lịch sử chung.',
    yeuCau: [
      'One PR whose branch you tidied with amend / rebase -i (fixup, reword) before asking for review|||Một PR có nhánh bạn đã dọn bằng amend / rebase -i (fixup, reword) trước khi xin review',
      'Update a PR branch after a rebase with git push --force-with-lease (never plain --force, never on main)|||Cập nhật nhánh PR sau rebase bằng git push --force-with-lease (không dùng --force trần, không bao giờ trên main)',
      'Leaked-secret drill on a CLONE (git clone --no-local … /tmp/drill): commit a FAKE secret, remove it from all history with git filter-repo, prove it is gone with git log -S|||Diễn tập lộ bí mật trên một BẢN CLONE (git clone --no-local … /tmp/drill): commit một bí mật GIẢ, gỡ khỏi toàn bộ lịch sử bằng git filter-repo, chứng minh đã hết bằng git log -S',
      'SECURITY.md section "We leaked a key": rotate first, then clean history, then tell everyone to re-clone|||Mục "Chúng tôi lỡ lộ khoá" trong SECURITY.md: đổi khoá trước, rồi dọn lịch sử, rồi báo mọi người clone lại',
    ],
    nangCao: [
      'git commit --fixup + git rebase -i --autosquash on a real PR|||git commit --fixup + git rebase -i --autosquash trên một PR thật',
      'Turn on push protection / secret scanning if your plan offers it|||Bật push protection / secret scanning nếu gói của bạn có',
    ],
    datKhi: [
      'The PR timeline shows a force-with-lease update and a clean, logical commit list|||Dòng thời gian của PR cho thấy một lần cập nhật force-with-lease và danh sách commit gọn, hợp lý',
      'In the drill clone, git log --all -S <fake secret> prints nothing after filter-repo|||Trong bản clone diễn tập, git log --all -S <bí mật giả> không in gì sau filter-repo',
      'main of the real repo was never force-pushed|||main của repo thật chưa từng bị force push',
    ],
    goiY: [
      'Use an obviously fake value such as FAKE-DEMO-TOKEN-0000 — never paste a real key, even for a drill|||Dùng giá trị rõ ràng là giả như FAKE-DEMO-TOKEN-0000 — không bao giờ dán khoá thật, kể cả để diễn tập',
      'filter-repo refuses to run on a non-fresh clone on purpose; that is why the drill uses git clone --no-local|||filter-repo cố tình từ chối chạy trên bản clone không còn mới; vì vậy buổi diễn tập dùng git clone --no-local',
      'After a rewrite, every commit hash from the first touched commit onward changes — compare git log before/after|||Sau khi viết lại, mọi mã băm từ commit đầu tiên bị đụng trở đi đều đổi — so git log trước/sau',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the tidied PR|||Link tới PR đã được dọn',
      'Text of the drill: filter-repo output and the empty git log -S|||Chữ của buổi diễn tập: output filter-repo và git log -S rỗng',
      'Link to SECURITY.md|||Link tới SECURITY.md',
    ],
  },
  {
    so: 10, slug: 'git-moc-10', sauChuong: 'Chapter 9|||Chương 9',
    ten: 'Audit your repository from the inside: objects, size and health|||Kiểm toán repo từ bên trong: đối tượng, dung lượng và sức khoẻ',
    lead: 'Open the hood of your own repository: what objects it holds, which blobs are heaviest, whether everything is intact — and write down what you would do about it.|||Mở nắp capo repo của chính bạn: nó chứa đối tượng gì, blob nào nặng nhất, mọi thứ còn nguyên vẹn không — và ghi ra bạn sẽ xử lý thế nào.',
    yeuCau: [
      'REPO-HEALTH.md with the output of git count-objects -vH and git fsck|||REPO-HEALTH.md có output của git count-objects -vH và git fsck',
      'The 5 largest blobs in all history (rev-list --objects --all + cat-file --batch-check) and where they come from|||5 blob lớn nhất trong toàn bộ lịch sử (rev-list --objects --all + cat-file --batch-check) và chúng từ đâu ra',
      'Walk one commit by hand: cat-file -p of the commit, its tree, and one blob; explain each line|||Đi tay qua một commit: cat-file -p của commit, của tree, và của một blob; giải thích từng dòng',
      'cat-file -p of your annotated tag from milestone 8 — show it is a separate object pointing to a commit|||cat-file -p tag có chú thích ở mốc 8 — cho thấy nó là một đối tượng riêng trỏ tới một commit',
      'A decision: if a large/generated file is in history, plan (filter-repo, LFS, or accept) with the reason|||Một quyết định: nếu có file lớn/sinh ra trong lịch sử, lập kế hoạch (filter-repo, LFS, hoặc chấp nhận) kèm lý do',
    ],
    nangCao: [
      'Compare size-pack before and after git gc|||So size-pack trước và sau git gc',
      'Explain why two identical files in different folders share one blob|||Giải thích vì sao hai file giống hệt ở hai thư mục dùng chung một blob',
    ],
    datKhi: [
      'REPO-HEALTH.md contains real output from YOUR repo and git fsck reports no errors|||REPO-HEALTH.md chứa output thật từ repo CỦA BẠN và git fsck không báo lỗi',
      'Each of the top-5 blobs has a path and a verdict (keep / shrink / remove)|||Mỗi blob trong top 5 có đường dẫn và kết luận (giữ / thu nhỏ / gỡ)',
    ],
    goiY: [
      'git rev-list --objects --all | git cat-file --batch-check="%(objecttype) %(objectname) %(objectsize) %(rest)" | sort -k3 -n | tail -5|||git rev-list --objects --all | git cat-file --batch-check="%(objecttype) %(objectname) %(objectsize) %(rest)" | sort -k3 -n | tail -5',
      'git cat-file -t tells the type, -p pretty-prints, -s gives the size|||git cat-file -t cho biết loại, -p in đẹp, -s cho kích thước',
      '"dangling" objects in fsck are normal leftovers, not corruption|||Đối tượng "dangling" trong fsck là phần thừa bình thường, không phải hỏng',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to REPO-HEALTH.md|||Link tới REPO-HEALTH.md',
    ],
  },
  {
    so: 11, slug: 'git-moc-11', sauChuong: 'Chapter 10|||Chương 10',
    ten: 'Structure for growth: worktrees, repo layout decision, binary assets|||Cấu trúc để lớn lên: worktree, quyết định bố cục repo, tài nguyên nhị phân',
    lead: 'Decide how your repository should be shaped as it grows, write the decision down, and use worktrees so an urgent fix never forces you to stash half a feature.|||Quyết định repo nên có hình dạng thế nào khi lớn lên, ghi quyết định ra, và dùng worktree để một bản sửa gấp không bao giờ buộc bạn stash nửa tính năng.',
    yeuCau: [
      'Do one real hotfix or review in a second worktree while a feature branch stays open; show git worktree list|||Làm một hotfix hoặc review thật trong worktree thứ hai trong khi nhánh tính năng vẫn mở; cho xem git worktree list',
      'docs/adr/0001-repo-structure.md: monorepo vs separate repos vs submodule/subtree — context, options, decision, consequences|||docs/adr/0001-repo-structure.md: monorepo vs nhiều repo vs submodule/subtree — bối cảnh, phương án, quyết định, hệ quả',
      'Binary assets policy: Git LFS with .gitattributes, or a written size rule and why LFS is not needed|||Chính sách tài nguyên nhị phân: Git LFS với .gitattributes, hoặc luật dung lượng ghi rõ và vì sao không cần LFS',
      'Remove the extra worktree properly (git worktree remove) after use|||Gỡ worktree phụ đúng cách (git worktree remove) sau khi dùng',
    ],
    nangCao: [
      'Monorepo topics: sparse-checkout --cone for one app and measure the difference|||Đề tài monorepo: sparse-checkout --cone cho một app và đo khác biệt',
      'OSS topic: partial clone (--filter=blob:none) of the upstream project|||Đề tài OSS: clone một phần (--filter=blob:none) dự án upstream',
    ],
    datKhi: [
      'The ADR is merged through a PR and states one decision|||ADR được merge qua PR và nêu một quyết định',
      'The hotfix commit and the feature commit were made in different worktrees on the same day without any stash|||Commit hotfix và commit tính năng được làm trong hai worktree khác nhau cùng ngày mà không cần stash',
    ],
    goiY: [
      'git worktree add ../repo-hotfix -b hotfix/x origin/main|||git worktree add ../repo-hotfix -b hotfix/x origin/main',
      'A branch can be checked out in only one worktree at a time — that is a feature, not a bug|||Một nhánh chỉ được checkout ở một worktree mỗi lúc — đó là tính năng, không phải lỗi',
      'Submodules pin a commit of another repo; most student teams are better served by one repo|||Submodule ghim một commit của repo khác; phần lớn nhóm sinh viên hợp với một repo hơn',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Output of git worktree list during the hotfix|||Output của git worktree list trong lúc làm hotfix',
      'Link to the ADR and to .gitattributes (if LFS)|||Link tới ADR và tới .gitattributes (nếu dùng LFS)',
    ],
  },
  {
    so: 12, slug: 'git-moc-12', sauChuong: 'Chapter 11|||Chương 11',
    ten: 'Run it on GitHub: issues, a board, CI as a required check, security on|||Vận hành trên GitHub: issue, bảng việc, CI là kiểm tra bắt buộc, bật bảo mật',
    lead: 'Move the team’s to-do list, automation and security onto GitHub so that the repository itself enforces quality.|||Đưa danh sách việc, tự động hoá và bảo mật của nhóm lên GitHub để chính repo tự giữ chất lượng.',
    yeuCau: [
      'Issues with labels and a milestone; issue templates for bug and feature|||Issue có nhãn và milestone; mẫu issue cho lỗi và tính năng',
      'A Projects board (Todo / In progress / Review / Done) used for at least one week|||Một bảng Projects (Todo / In progress / Review / Done) được dùng ít nhất một tuần',
      'Every PR links its issue with "Closes #n" so merging closes it|||Mọi PR liên kết issue bằng "Closes #n" để merge xong tự đóng',
      'A GitHub Actions workflow that builds (and tests/lints) on every PR, added as a required status check|||Một workflow GitHub Actions build (và test/lint) trên mọi PR, được đặt làm status check bắt buộc',
      'Dependabot alerts/updates and secret scanning or push protection turned on where your plan allows|||Bật Dependabot alert/update và secret scanning hoặc push protection ở chỗ gói của bạn cho phép',
    ],
    nangCao: [
      'A CI badge in the README|||Huy hiệu CI trong README',
      'Use gh issue / gh pr from the terminal for a whole task|||Dùng gh issue / gh pr từ terminal cho trọn một việc',
    ],
    datKhi: [
      'A PR with a failing check cannot be merged (screenshot of the blocked merge button)|||Một PR có kiểm tra đỏ không merge được (ảnh nút merge bị khoá)',
      'At least 3 issues closed automatically by merged PRs|||Ít nhất 3 issue tự đóng nhờ PR đã merge',
    ],
    goiY: [
      'Start the workflow from the smallest thing that can fail: npm ci && npm run build (or mvn -B package)|||Bắt đầu workflow từ thứ nhỏ nhất có thể đỏ: npm ci && npm run build (hoặc mvn -B package)',
      'A check only appears in the ruleset list after it has run at least once|||Một check chỉ hiện trong danh sách của ruleset sau khi nó đã chạy ít nhất một lần',
      'Secrets for CI go in Settings → Secrets, never in the workflow file|||Bí mật cho CI đặt ở Settings → Secrets, không bao giờ trong file workflow',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to a green Actions run and to the workflow file|||Link tới một lượt Actions xanh và tới file workflow',
      'Screenshot of the board and of the blocked merge|||Ảnh bảng việc và ảnh nút merge bị khoá',
    ],
  },
  {
    so: 13, slug: 'git-moc-13', sauChuong: 'Chapter 12|||Chương 12',
    ten: 'Guard rails: shared hooks and signed commits|||Lan can: hook dùng chung và commit có chữ ký',
    lead: 'Catch mistakes before they become commits, for every member, and make your commits provably yours.|||Bắt lỗi trước khi nó thành commit, cho mọi thành viên, và làm cho commit của bạn chứng minh được là của bạn.',
    yeuCau: [
      'A pre-commit hook kept IN the repo (core.hooksPath=.githooks, or husky) that blocks .env files and obvious fake/real keys|||Một hook pre-commit nằm TRONG repo (core.hooksPath=.githooks, hoặc husky) chặn file .env và khoá rõ ràng',
      'A commit-msg hook that rejects subjects not in Conventional Commits form|||Một hook commit-msg từ chối tiêu đề không theo Conventional Commits',
      'Setup instructions in CONTRIBUTING.md so every member enables the hooks in one command|||Hướng dẫn trong CONTRIBUTING.md để mọi thành viên bật hook bằng một lệnh',
      'Sign your commits (SSH signing is simplest) and get the "Verified" badge on GitHub|||Ký commit (ký bằng SSH là đơn giản nhất) và có huy hiệu "Verified" trên GitHub',
      'Remember hooks are client-side only: the same rule is also enforced by CI or a ruleset|||Nhớ hook chỉ chạy phía máy khách: cùng luật đó còn được CI hoặc ruleset cưỡng chế',
    ],
    nangCao: [
      'Ruleset: require signed commits on main|||Ruleset: bắt buộc commit có chữ ký trên main',
      'A pre-push hook that runs the tests|||Hook pre-push chạy test',
    ],
    datKhi: [
      'A screenshot/text of the hook rejecting a commit that adds .env, and one rejecting "update stuff"|||Ảnh/chữ hook từ chối một commit thêm .env, và một lần từ chối "update stuff"',
      'Your recent commits show "Verified" on GitHub; git log --show-signature verifies locally|||Commit gần đây của bạn hiện "Verified" trên GitHub; git log --show-signature kiểm được ở máy',
    ],
    goiY: [
      'A hook is just an executable file; exit 1 = reject, and its message is printed to the committer|||Hook chỉ là một file chạy được; exit 1 = từ chối, và thông báo của nó in ra cho người commit',
      'git config core.hooksPath .githooks makes the repo’s hooks folder the active one|||git config core.hooksPath .githooks biến thư mục hook của repo thành thư mục đang dùng',
      'SSH signing: gpg.format=ssh, user.signingkey=<path to .pub>, commit.gpgsign=true, and add the key on GitHub as a SIGNING key|||Ký SSH: gpg.format=ssh, user.signingkey=<đường dẫn .pub>, commit.gpgsign=true, và thêm khoá trên GitHub dưới dạng khoá KÝ',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the .githooks folder (or husky config)|||Link tới thư mục .githooks (hoặc cấu hình husky)',
      'Screenshot of a Verified commit and of the hook rejections|||Ảnh một commit Verified và ảnh các lần hook từ chối',
    ],
  },
  {
    so: 14, slug: 'git-moc-14', sauChuong: 'Chapter 13|||Chương 13',
    ten: 'A runbook written from your own repo, proven by a recovery drill|||Sổ tay cứu hộ viết từ chính repo của bạn, chứng minh bằng một buổi diễn tập',
    lead: 'When something breaks at 11 p.m. before a deadline, nobody reads a textbook. Write the page your team will actually open, and rehearse it.|||Khi có gì đó hỏng lúc 11 giờ đêm trước hạn nộp, không ai đọc giáo trình. Viết đúng trang nhóm bạn sẽ mở ra, và tập trước nó.',
    yeuCau: [
      'RUNBOOK.md with at least 8 situations: symptom → first safe command → fix → prevention|||RUNBOOK.md có ít nhất 8 tình huống: triệu chứng → lệnh an toàn đầu tiên → cách sửa → cách phòng',
      'Drill on a throw-away clone: (1) delete an unmerged branch and recover it, (2) reset --hard over commits and recover them, (3) undo a wrong merge|||Diễn tập trên bản clone nháp: (1) xoá một nhánh chưa merge rồi cứu, (2) reset --hard đè mất commit rồi cứu, (3) hoàn tác một lần merge sai',
      'Record the exact commands and real output of the drill in the runbook|||Ghi đúng lệnh và output thật của buổi diễn tập vào sổ tay',
      'A "first 60 seconds" box at the top: stop, git status, git log --oneline -5, git reflog -5, ask before force-anything|||Ô "60 giây đầu tiên" ở đầu trang: dừng tay, git status, git log --oneline -5, git reflog -5, hỏi trước khi force bất cứ thứ gì',
    ],
    nangCao: [
      'Recover a dropped stash with git fsck --unreachable|||Cứu một stash đã drop bằng git fsck --unreachable',
      'A backup routine: git bundle create of the repo before risky operations|||Thói quen sao lưu: git bundle create repo trước các thao tác rủi ro',
    ],
    datKhi: [
      'RUNBOOK.md has 8+ situations and the 3 drills, each with real command output|||RUNBOOK.md có 8+ tình huống và 3 buổi diễn tập, mỗi cái có output lệnh thật',
      'Another member (or a classmate) follows one recipe without your help and it works|||Một thành viên khác (hoặc bạn cùng lớp) làm theo một công thức mà không cần bạn giúp và thành công',
    ],
    goiY: [
      'Use the situations your team actually hit; Chapters 16 and 18 list the classic ones|||Dùng tình huống nhóm bạn thật sự gặp; Chương 16 và 18 liệt kê các tình huống kinh điển',
      'A deleted branch tip is still in git reflog (HEAD’s log) for weeks|||Đầu nhánh đã xoá vẫn nằm trong git reflog (nhật ký của HEAD) nhiều tuần',
      'Never run the drill on the real clone you work in|||Đừng bao giờ diễn tập trên bản clone bạn đang làm việc',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to RUNBOOK.md|||Link tới RUNBOOK.md',
    ],
  },
  {
    so: 15, slug: 'git-moc-15', sauChuong: 'Chapter 14|||Chương 14',
    ten: 'Same repo, every machine: line endings, editor settings, identities|||Một repo, mọi máy: ký tự xuống dòng, cài đặt trình soạn thảo, danh tính',
    lead: 'Remove the noise that makes Windows and Mac teammates fight: line endings, whitespace, the wrong email on school commits.|||Gỡ thứ nhiễu khiến bạn dùng Windows và bạn dùng Mac cãi nhau: ký tự xuống dòng, khoảng trắng, email sai trên commit của trường.',
    yeuCau: [
      '.gitattributes with * text=auto plus explicit eol rules (e.g. *.sh eol=lf, *.bat eol=crlf) and binary types|||.gitattributes có * text=auto cùng luật eol rõ ràng (vd *.sh eol=lf, *.bat eol=crlf) và các loại binary',
      'Renormalize once (git add --renormalize .) in a dedicated commit|||Chuẩn hoá lại một lần (git add --renormalize .) trong một commit riêng',
      '.editorconfig for indentation and final newline|||.editorconfig cho thụt lề và dòng trống cuối file',
      'includeIf in your global config so commits in your school folder use your school email (show with --show-origin)|||includeIf trong cấu hình toàn cục để commit trong thư mục trường dùng email trường (cho xem bằng --show-origin)',
      'A short "Using VS Code with this repo" section in CONTRIBUTING.md|||Mục ngắn "Dùng VS Code với repo này" trong CONTRIBUTING.md',
    ],
    nangCao: [
      'Team aliases documented (lg, st, last)|||Alias của nhóm có tài liệu (lg, st, last)',
      'Detect a case-only rename problem and fix it with git mv|||Phát hiện lỗi đổi tên chỉ khác hoa/thường và sửa bằng git mv',
    ],
    datKhi: [
      'git ls-files --eol shows i/lf for text files (except the ones you deliberately set to crlf)|||git ls-files --eol hiện i/lf cho file văn bản (trừ file bạn cố ý đặt crlf)',
      'A Windows member edits a file and the diff shows only the real change, no whole-file rewrite|||Một bạn dùng Windows sửa một file và diff chỉ hiện đúng phần đổi, không viết lại cả file',
      'git config --show-origin user.email inside the project prints the included school config|||git config --show-origin user.email trong dự án in ra file cấu hình trường được include',
    ],
    goiY: [
      '.gitattributes beats everyone’s core.autocrlf — that is why it is the team-wide fix|||.gitattributes thắng core.autocrlf của từng người — vì vậy nó là cách sửa cho cả nhóm',
      'Renormalize in its own commit so blame can skip it (.git-blame-ignore-revs)|||Chuẩn hoá trong commit riêng để blame bỏ qua được (.git-blame-ignore-revs)',
      'includeIf "gitdir:~/school/" needs the trailing slash|||includeIf "gitdir:~/school/" cần dấu gạch chéo ở cuối',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Links to .gitattributes, .editorconfig and the renormalize commit|||Link tới .gitattributes, .editorconfig và commit chuẩn hoá',
      'Output of git ls-files --eol | head and git config --show-origin user.email|||Output của git ls-files --eol | head và git config --show-origin user.email',
    ],
  },
  {
    so: 16, slug: 'git-moc-16', sauChuong: 'Chapter 15|||Chương 15',
    ten: 'Make it a portfolio piece: README, license, Pages, profile|||Biến nó thành sản phẩm portfolio: README, giấy phép, Pages, hồ sơ',
    lead: 'A recruiter spends about a minute on a repository. Make that minute count: what it is, that it runs, who did what.|||Nhà tuyển dụng dành khoảng một phút cho một repo. Làm cho phút đó có giá trị: nó là gì, nó chạy được, ai làm gì.',
    yeuCau: [
      'README: one-line pitch, screenshot/GIF, features, tech stack, how to run in ≤ 5 commands, architecture sketch, each member’s contribution|||README: một câu giới thiệu, ảnh/GIF, tính năng, stack, cách chạy trong ≤ 5 lệnh, sơ đồ kiến trúc, đóng góp của từng người',
      'A LICENSE chosen on purpose (and a note if the school forbids public code)|||Một LICENSE được chọn có chủ đích (và ghi chú nếu trường cấm công khai mã)',
      'GitHub Pages for the demo (front end) or the documentation (back end / docs topics)|||GitHub Pages cho bản demo (front end) hoặc tài liệu (đề tài back end / tài liệu)',
      'The repository pinned on your profile, with a profile README linking to it|||Repo được ghim trên hồ sơ, có profile README dẫn link tới nó',
      'OSS topic: your merged (or reviewed) PR linked from the profile README|||Đề tài OSS: PR đã merge (hoặc đã được review) dẫn link từ profile README',
    ],
    nangCao: [
      'Repository topics, description and social preview image set|||Đặt topics, mô tả và ảnh xem trước của repo',
      'A short "What I learned" section in your own words|||Mục ngắn "Tôi học được gì" bằng lời của bạn',
    ],
    datKhi: [
      'The Pages URL opens in a private window|||Link Pages mở được trong cửa sổ ẩn danh',
      'A classmate who never saw the project runs it from the README alone|||Một bạn chưa từng thấy dự án chạy được nó chỉ nhờ README',
    ],
    goiY: [
      'Vite on Pages needs base: "/<repo-name>/" — see lesson 15.2|||Vite trên Pages cần base: "/<tên-repo>/" — xem bài 15.2',
      'Write the contribution section from git shortlog -sn and the PR list, not from memory|||Viết mục đóng góp từ git shortlog -sn và danh sách PR, không viết theo trí nhớ',
      'Private school repo? Ask the lecturer first; you can publish a cleaned copy later|||Repo trường để private? Hỏi giảng viên trước; bạn có thể công bố một bản đã làm sạch sau',
    ],
    nop: ['repo', 'demo', 'anh'],
    bangChung: [
      'Link to the README, the Pages site and your profile|||Link tới README, trang Pages và hồ sơ của bạn',
    ],
  },
  {
    so: 17, slug: 'git-moc-17', sauChuong: 'Chapter 16|||Chương 16',
    ten: 'One full sprint, for real: issues → branches → reviews → v1.0.0 → hotfix|||Một sprint trọn vẹn, làm thật: issue → nhánh → review → v1.0.0 → hotfix',
    lead: 'Everything together, on your own repository: plan a sprint, run it through the whole pipeline, ship v1.0.0 and survive the first hotfix.|||Tất cả cùng lúc, trên chính repo của bạn: lập một sprint, chạy nó qua cả dây chuyền, phát hành v1.0.0 và vượt qua hotfix đầu tiên.',
    yeuCau: [
      'A milestone "Sprint N" with at least 4 issues, each assigned and estimated|||Một milestone "Sprint N" có ít nhất 4 issue, mỗi issue có người nhận và ước lượng',
      'Each issue → its own branch → its own PR with review → merged with CI green|||Mỗi issue → một nhánh riêng → một PR riêng có review → merge khi CI xanh',
      'At least one conflict between two sprint PRs resolved on the PR (update branch / rebase) and explained in a comment|||Ít nhất một xung đột giữa hai PR của sprint được giải trên PR (update branch / rebase) và giải thích trong bình luận',
      'Release v1.0.0 with release notes; then a hotfix v1.0.1 from the tag, merged back to main|||Phát hành v1.0.0 có release notes; rồi hotfix v1.0.1 từ tag, đưa về main',
      'A short sprint retrospective in the milestone or a discussion: what went well, what to change|||Một buổi retro ngắn trong milestone hoặc discussion: điều gì tốt, điều gì cần đổi',
    ],
    nangCao: [
      'Insights → Contributors shows every member’s commits in the sprint|||Insights → Contributors cho thấy commit của mọi thành viên trong sprint',
      'Automate the release notes from labels (.github/release.yml)|||Tự động hoá release notes theo nhãn (.github/release.yml)',
    ],
    datKhi: [
      'The milestone is 100% closed; every issue is closed by a merged PR|||Milestone đóng 100%; mọi issue được đóng bởi một PR đã merge',
      'git log --graph --oneline v1.0.0..main shows the hotfix merged back|||git log --graph --oneline v1.0.0..main cho thấy hotfix đã được đưa về',
    ],
    goiY: [
      'Keep each sprint issue small enough for one PR of a few hundred lines|||Giữ mỗi issue của sprint đủ nhỏ để một PR vài trăm dòng',
      'Merge order matters: the second PR must be updated with main before it merges|||Thứ tự merge quan trọng: PR thứ hai phải cập nhật main trước khi merge',
      'Chapter 16 runs exactly this sprint on a simulated team — copy its rhythm|||Chương 16 chạy đúng sprint này trên một nhóm mô phỏng — chép nhịp của nó',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the milestone, the v1.0.0 and v1.0.1 releases|||Link tới milestone, bản phát hành v1.0.0 và v1.0.1',
      'Link to the PR where the conflict was resolved|||Link tới PR nơi xung đột được giải',
    ],
  },
  {
    so: 18, slug: 'git-moc-18', sauChuong: 'Chapter 18|||Chương 18',
    ten: 'Accidents and postmortems: reproduce, rescue, prevent|||Tai nạn và hậu kiểm: tái hiện, cứu, phòng',
    lead: 'Turn the classic team accidents into lessons your repository remembers: reproduce two of them on a copy, rescue them, write one postmortem, and add the rule that stops it happening again.|||Biến các tai nạn kinh điển của nhóm thành bài học mà repo tự nhớ: tái hiện hai tai nạn trên một bản sao, cứu chúng, viết một bản hậu kiểm, và thêm luật ngăn nó tái diễn.',
    yeuCau: [
      'Reproduce and rescue at least 2 accidents from Chapter 18 (committed build/, conflict in a shared file, push rejected, work on main by mistake, self-merge, bad merge on main) on a throw-away copy of YOUR repo|||Tái hiện và cứu ít nhất 2 tai nạn của Chương 18 (lỡ commit build/, xung đột file chung, push bị từ chối, làm nhầm trên main, tự merge, merge hỏng trên main) trên một bản sao nháp của repo CỦA BẠN',
      'POSTMORTEM.md for one real (or realistic) incident: timeline, symptom, root cause, rescue commands with output, prevention|||POSTMORTEM.md cho một sự cố thật (hoặc sát thật): dòng thời gian, triệu chứng, nguyên nhân gốc, lệnh cứu kèm output, cách phòng',
      'Blameless tone: describe the process gap, not the person|||Giọng không đổ lỗi: mô tả lỗ hổng quy trình, không mô tả con người',
      'Add the prevention to the repo itself (ignore rule, ruleset, hook, CI check) and link it from the postmortem|||Thêm cách phòng vào chính repo (luật ignore, ruleset, hook, kiểm tra CI) và dẫn link từ bản hậu kiểm',
    ],
    nangCao: [
      'Run the three-person lab of Chapter 18 (lab18) with your real teammates|||Chạy lab ba người của Chương 18 (lab18) với chính các bạn cùng nhóm',
      'Add the incident to RUNBOOK.md from milestone 14|||Thêm sự cố vào RUNBOOK.md của mốc 14',
    ],
    datKhi: [
      'POSTMORTEM.md contains real commands and output and links to the prevention commit/setting|||POSTMORTEM.md có lệnh và output thật và link tới commit/cài đặt phòng ngừa',
      'Trying the accident again on the real repo is now blocked or harmless|||Thử lại tai nạn đó trên repo thật giờ bị chặn hoặc vô hại',
    ],
    goiY: [
      'Reverting a merge on main: git revert -m 1 <merge>; to re-land the work later, revert the revert|||Hoàn tác một merge trên main: git revert -m 1 <merge>; muốn đưa lại việc sau này thì revert cái revert',
      'Work done on main by mistake (unpushed): git branch feat/x, then git reset --hard origin/main on main|||Lỡ làm trên main (chưa push): git branch feat/x, rồi git reset --hard origin/main trên main',
      'A postmortem answers "why did our process allow this?" five times, not "who did it?"|||Bản hậu kiểm hỏi "vì sao quy trình cho phép chuyện này?" năm lần, không hỏi "ai làm?"',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to POSTMORTEM.md and to the prevention commit or ruleset screenshot|||Link tới POSTMORTEM.md và tới commit phòng ngừa hoặc ảnh ruleset',
    ],
  },
];

const GIOI_THIEU = [
  '<p><strong>After this course you can run a repository the way a professional team does.</strong> Not just add/commit/push: you will set up a protected main, work through short-lived branches and reviewed pull requests, resolve conflicts calmly, undo anything without losing work, tag and release with semantic versions, put CI and hooks in charge of the boring rules, rewrite history only when it is safe, recover a repository your team thinks is broken, and present the result as a portfolio piece.</p>',
  '<p><strong>Why a course-long project?</strong> Git is learned by living in a repository, not by reading about one. So at the start you register one REAL repository — your SWP391 team repo, a course project, a small library, a documentation repo, a monorepo, or a contribution to an open-source project — and after every chapter a milestone asks you to apply exactly that chapter to it. At the end the repository itself is your evidence: its history, its pull requests, its releases.</p>',
  '<p><strong>How it is graded.</strong> 18 milestones (one after the Quick start and after each chapter), each with "Done when" criteria you can check yourself and evidence to submit (links to the repo, PRs, releases, screenshots of logs). The course ends with a defence: you explain the history of YOUR repository and handle incidents live, scored on a 10-point rubric.</p>',
  '|||',
  '<p><strong>Học xong khoá này bạn tự vận hành được một repo theo đúng cách một nhóm chuyên nghiệp ở công ty làm.</strong> Không chỉ add/commit/push: bạn dựng main được bảo vệ, làm việc qua nhánh ngắn hạn và pull request có review, giải xung đột bình tĩnh, hoàn tác mọi thứ mà không mất việc, gắn tag và phát hành theo semver, giao các luật nhàm chán cho CI và hook, chỉ viết lại lịch sử khi an toàn, cứu một repo mà cả nhóm tưởng đã hỏng, và trình bày kết quả như một sản phẩm portfolio.</p>',
  '<p><strong>Vì sao làm một dự án xuyên suốt khoá?</strong> Git học bằng cách sống trong một repo, không phải đọc về nó. Vì vậy ngay từ đầu bạn đăng ký một repo THẬT — repo nhóm SWP391, đồ án môn, một thư viện nhỏ, một repo tài liệu, một monorepo, hay đóng góp vào một dự án mã nguồn mở — và sau mỗi chương có một mốc yêu cầu áp đúng kiến thức chương đó vào repo của bạn. Cuối khoá, chính repo là bằng chứng: lịch sử của nó, các pull request, các bản phát hành.</p>',
  '<p><strong>Cách chấm.</strong> 18 mốc (một mốc sau Khởi động nhanh và sau mỗi chương), mỗi mốc có tiêu chí "Đạt khi" tự kiểm được và bằng chứng cần nộp (link repo, PR, release, ảnh log). Khoá kết thúc bằng buổi bảo vệ: bạn giải thích lịch sử repo CỦA BẠN và xử lý sự cố trực tiếp, chấm theo rubric 10 điểm.</p>',
].join('');

const BAO_VE = {
  rubric: [
    { tieuChi: 'Clean, meaningful history|||Lịch sử sạch và có nghĩa', diem: 2, moTa: 'Atomic commits, Conventional Commits, no generated files or secrets tracked, merge commits that explain conflicts.|||Commit nguyên tử, theo Conventional Commits, không theo dõi file sinh ra hay bí mật, merge commit có giải thích xung đột.' },
    { tieuChi: 'Branch + PR + review workflow|||Quy trình nhánh + PR + review', diem: 2, moTa: 'Protected main, every change through a reviewed PR, real review comments, conflicts handled on PRs, merge strategy chosen on purpose.|||main được bảo vệ, mọi thay đổi qua PR có review, bình luận review thật, xung đột xử lý trên PR, chiến lược merge chọn có chủ đích.' },
    { tieuChi: 'Releases and automation|||Phát hành và tự động hoá', diem: 1.5, moTa: 'Annotated semver tags, releases with notes, a hotfix from a tag, CI as a required check, shared hooks.|||Tag semver có chú thích, release có ghi chú, một hotfix từ tag, CI là kiểm tra bắt buộc, hook dùng chung.' },
    { tieuChi: 'Safety and recovery|||An toàn và cứu hộ', diem: 1.5, moTa: 'UNDO.md and RUNBOOK.md proven by drills, leaked-secret procedure, no force push on shared branches, a postmortem with a prevention rule.|||UNDO.md và RUNBOOK.md được chứng minh bằng diễn tập, quy trình lộ khoá, không force push lên nhánh chung, một bản hậu kiểm có luật phòng.' },
    { tieuChi: 'Documentation and presentation|||Tài liệu và trình bày', diem: 1, moTa: 'README a stranger can run from, CONTRIBUTING.md, license, Pages or docs, contributions of each member visible.|||README người lạ chạy theo được, CONTRIBUTING.md, giấy phép, Pages hoặc tài liệu, đóng góp từng thành viên thấy rõ.' },
    { tieuChi: 'Answers to the panel|||Trả lời hội đồng', diem: 2, moTa: 'Explains the repository’s own history with commands, predicts what a command will do, handles a live incident calmly and safely.|||Giải thích lịch sử repo của chính mình bằng lệnh, đoán trước một lệnh sẽ làm gì, xử lý một sự cố trực tiếp bình tĩnh và an toàn.' },
  ],
  cauHoiMau: [
    'Open your git log --graph. Walk us through the last merge commit: which two lines of work met there, and was there a conflict?|||Mở git log --graph của bạn. Dẫn chúng tôi qua merge commit gần nhất: hai luồng việc nào gặp nhau ở đó, có xung đột không?',
    'Pick any line in your main source file. Show who wrote it, in which commit, and why — using only Git.|||Chọn một dòng bất kỳ trong file mã chính. Cho thấy ai viết, ở commit nào, và vì sao — chỉ dùng Git.',
    'Why is this file in your .gitignore? What would happen if it were committed?|||Vì sao file này nằm trong .gitignore? Nếu nó bị commit thì chuyện gì xảy ra?',
    'Your .gitignore lists .env, yet git status shows .env modified. Explain and fix it now.|||.gitignore của bạn có .env, vậy mà git status hiện .env bị sửa. Giải thích và sửa ngay.',
    'Show us the conflict you resolved in milestone 4. What did each side want and how did you decide?|||Cho xem xung đột bạn đã giải ở mốc 4. Mỗi bên muốn gì và bạn quyết định thế nào?',
    'Why did you choose squash (or merge, or rebase) as your merge strategy? What do you lose with it?|||Vì sao bạn chọn squash (hoặc merge, hoặc rebase) làm chiến lược merge? Bạn mất gì khi chọn nó?',
    'Try to push directly to main now. What happens, and which setting causes it?|||Thử push thẳng lên main ngay bây giờ. Chuyện gì xảy ra, và cài đặt nào gây ra?',
    'A teammate pushed a commit that breaks the build on main. Show the exact commands you would run, and why not reset.|||Một bạn push một commit làm hỏng build trên main. Cho xem đúng các lệnh bạn sẽ chạy, và vì sao không reset.',
    'I run git reset --hard HEAD~3 on your branch right now. Get the three commits back.|||Tôi chạy git reset --hard HEAD~3 trên nhánh của bạn ngay bây giờ. Lấy lại ba commit đó.',
    'What is the difference between git fetch and git pull, and when did you deliberately use fetch?|||git fetch khác git pull thế nào, và lúc nào bạn đã cố ý dùng fetch?',
    'Why is --force-with-lease safer than --force? Show a case where it saved you or would have.|||Vì sao --force-with-lease an toàn hơn --force? Cho xem một trường hợp nó đã cứu bạn hoặc sẽ cứu bạn.',
    'You found a real API key in commit history from last month. What do you do first, second and third?|||Bạn phát hiện một khoá API thật trong lịch sử commit tháng trước. Việc đầu tiên, thứ hai, thứ ba là gì?',
    'Show your v1.0.0 tag object with git cat-file -p. What is inside, and how does it differ from a lightweight tag?|||Cho xem đối tượng tag v1.0.0 bằng git cat-file -p. Bên trong có gì, và khác tag nhẹ thế nào?',
    'Why did your hotfix branch start from the tag and not from main?|||Vì sao nhánh hotfix của bạn bắt đầu từ tag mà không từ main?',
    'Your next release adds a feature and removes an old API. What version number comes after 1.4.2, and why?|||Bản phát hành tới thêm một tính năng và gỡ một API cũ. Sau 1.4.2 là số phiên bản nào, vì sao?',
    'Which checks are required on your main, and what happens to a PR when one fails?|||main của bạn bắt buộc những kiểm tra nào, và PR ra sao khi một kiểm tra đỏ?',
    'Your pre-commit hook blocks .env. Can a member bypass it? What stops a bypassed mistake from reaching main?|||Hook pre-commit của bạn chặn .env. Thành viên có lách được không? Cái gì ngăn lỗi đã lách đó đi tới main?',
    'What does "Verified" on your commits prove, and what does it not prove?|||"Verified" trên commit của bạn chứng minh điều gì, và không chứng minh điều gì?',
    'Which are the three largest objects in your history, and what did you decide about them?|||Ba đối tượng lớn nhất trong lịch sử của bạn là gì, và bạn đã quyết định gì về chúng?',
    'Explain your repository structure decision (ADR). When would you change your mind?|||Giải thích quyết định cấu trúc repo (ADR). Khi nào bạn sẽ đổi ý?',
    'A Windows teammate’s PR shows every line of a file changed. Diagnose it and show the fix in your repo.|||PR của một bạn dùng Windows hiện mọi dòng của file bị đổi. Chẩn đoán và cho xem cách sửa trong repo của bạn.',
    'Walk us through your postmortem. What rule did you add, and how do you know it works?|||Dẫn chúng tôi qua bản hậu kiểm. Bạn đã thêm luật gì, và sao biết nó chạy?',
    'Who contributed what to this repository? Prove it with Git and GitHub, not with words.|||Ai đóng góp gì cho repo này? Chứng minh bằng Git và GitHub, không bằng lời.',
    'If the requirement changes tomorrow and you must ship a fix for v1.0.x while v1.1 is half done, how do you organise branches?|||Nếu ngày mai yêu cầu đổi và bạn phải phát hành bản sửa cho v1.0.x trong khi v1.1 đang dở, bạn tổ chức nhánh thế nào?',
  ],
  chuanBi: [
    'All 18 milestones submitted, or a note explaining the missing ones|||Đã nộp đủ 18 mốc, hoặc có ghi chú giải thích mốc còn thiếu',
    'A fresh clone of the repository on the demo machine, with your SSH/credentials working|||Một bản clone mới của repo trên máy demo, SSH/thông tin đăng nhập chạy được',
    'README, CONTRIBUTING.md, UNDO.md, RUNBOOK.md, POSTMORTEM.md and CHANGELOG.md present and up to date|||README, CONTRIBUTING.md, UNDO.md, RUNBOOK.md, POSTMORTEM.md và CHANGELOG.md có mặt và cập nhật',
    'Releases page shows at least v0.1.0, v1.0.0 and one hotfix|||Trang Releases có ít nhất v0.1.0, v1.0.0 và một hotfix',
    'main protected, CI green on the latest commit, no open PR older than a week without a comment|||main được bảo vệ, CI xanh ở commit mới nhất, không có PR mở quá một tuần mà không có bình luận',
    'git status clean, no stray branches, git fsck without errors|||git status sạch, không có nhánh thừa, git fsck không lỗi',
    'A throw-away clone ready in another folder for the live incident question|||Một bản clone nháp sẵn ở thư mục khác cho câu hỏi sự cố trực tiếp',
    'Each team member can explain at least one PR they authored and one they reviewed|||Mỗi thành viên giải thích được ít nhất một PR mình viết và một PR mình review',
  ],
};

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU,
  deTai: DE_TAI,
  tuChon: {
    yeuCauToiThieu: [
      'A real repository that will keep changing for at least 6 weeks (not a one-day hello world)|||Một repo thật sẽ còn thay đổi ít nhất 6 tuần (không phải hello world một ngày)',
      'At least one other person who will review your pull requests (teammate, classmate or mentor)|||Ít nhất một người khác sẽ review pull request của bạn (bạn cùng nhóm, cùng lớp hoặc mentor)',
      'You (or your team leader) have admin rights to set branch protection, Actions and releases — otherwise add a companion repo|||Bạn (hoặc trưởng nhóm) có quyền admin để đặt bảo vệ nhánh, Actions và release — nếu không thì thêm một repo đồng hành',
      'Real content that can conflict: code, documentation or data edited by more than one branch|||Nội dung thật có thể xung đột: mã, tài liệu hay dữ liệu được sửa từ nhiều nhánh',
      'Something worth releasing in versions (an app, a library, an edition of a handbook)|||Có thứ đáng phát hành theo phiên bản (một app, một thư viện, một ấn bản sổ tay)',
      'No real personal data or secrets; the lecturer/reviewer can be given read access|||Không chứa dữ liệu cá nhân hay bí mật thật; giảng viên/người review được cấp quyền đọc',
    ],
    goiYQuyMo: 'Right size: 1–5 people, a few thousand lines of code or a few dozen pages, enough work for about 15–30 pull requests over the course. Too small: a single-file script nobody else touches. Too big: a fork of a huge project where you cannot change any settings (use the open-source topic with a companion repo instead).|||Vừa sức: 1–5 người, vài nghìn dòng mã hoặc vài chục trang, đủ việc cho khoảng 15–30 pull request trong suốt khoá. Quá nhỏ: một script một file không ai khác đụng vào. Quá to: fork một dự án khổng lồ mà bạn không đổi được cài đặt nào (khi đó chọn đề tài mã nguồn mở kèm repo đồng hành).',
  },
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

export default DU_AN;

/* ───────────────────── Dựng bài mốc & bài bảo vệ ───────────────────── */

const tach = (s, i) => {
  const p = String(s).split('|||');
  return (p[i] ?? p[0]).trim();
};
const esc = (s) => String(s).replace(/&(?!(#\d+|[a-z]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Chuỗi dữ liệu có thể chứa lệnh với < > (vd <file>) ⇒ thoát; rồi bọc lệnh git/ten file trong <code> thì để nguyên chữ.
const li = (arr, i) => arr.map((x) => '<li>' + esc(tach(x, i)) + '</li>').join('');

const NHAN = [
  {
    eyebrow: (m) => 'Course project · Milestone ' + m.so + ' of ' + MOC.length + ' · after ' + tach(m.sauChuong, 0),
    topic: 'This milestone applies to the topic you registered at the start of the course. The table below says what it means for each suggested topic; a self-chosen topic follows the same requirements.',
    req: '✅ Required', stretch: '⭐ Stretch (optional)', map: '🧭 What this milestone means for each topic',
    hints: '💡 Hints — open one layer at a time', hintNote: 'Try the task first. Read hint 1 only when stuck, then hint 2, then hint 3.',
    demo: '▶️ Demo: a sample run on a throw-away repository',
    demoNote: 'The commands below were run for real on a scratch repository in /tmp, and the output is the real output of that run (hashes will differ on your machine). It shows the moves, not the answer for your repository — your repository, your history and your evidence are what you submit.',
    done: '🎯 Done when', submit: '📤 What to submit',
    submitNote: 'Paste the links and notes into the submission box below this lesson, then mark the milestone as done. Your lecturer or the defence panel will open exactly these links.',
  },
  {
    eyebrow: (m) => 'Dự án cuối khoá · Mốc ' + m.so + '/' + MOC.length + ' · sau ' + tach(m.sauChuong, 1),
    topic: 'Mốc này áp vào đề tài bạn đã đăng ký đầu khoá. Bảng bên dưới cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung.',
    req: '✅ Yêu cầu bắt buộc', stretch: '⭐ Nâng cao (tuỳ chọn)', map: '🧭 Mốc này nghĩa là gì với từng đề tài',
    hints: '💡 Gợi ý — mở từng tầng một', hintNote: 'Tự làm trước. Kẹt mới đọc gợi ý 1, rồi gợi ý 2, rồi gợi ý 3.',
    demo: '▶️ Chạy mẫu: một lượt làm thử trên repo nháp',
    demoNote: 'Các lệnh dưới đây được chạy THẬT trên một repo nháp trong /tmp, và output là output thật của lượt chạy đó (mã băm trên máy bạn sẽ khác). Nó cho thấy các bước đi, không phải lời giải cho repo của bạn — repo, lịch sử và bằng chứng của CHÍNH bạn mới là thứ để nộp.',
    done: '🎯 Đạt khi', submit: '📤 Nộp gì',
    submitNote: 'Dán link và ghi chú vào ô nộp bài bên dưới bài này, rồi đánh dấu mốc đã xong. Giảng viên hoặc hội đồng bảo vệ sẽ mở đúng những link này.',
  },
];

/**
 * baiMoc(so, { demoEn, demoVi, description? }) → bài EXERCISE của mốc `so`.
 * demoEn/demoVi: HTML (khối lệnh + .out + đoạn giải thích) của lượt chạy THẬT.
 */
export function baiMoc(so, { demoEn = '', demoVi = '', description } = {}) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error('git _du-an: không có mốc ' + so);
  const khoi = (i) => {
    const N = NHAN[i];
    const ban = DE_TAI.map((d) => {
      const b = d.banDoChuong.find((x) => x.moc === so);
      return '<div class="kv"><span class="k">' + esc(tach(d.ten, i)) + '</span><span class="v">' + esc(b ? tach(b.dung, i) : '—') + '</span></div>';
    }).join('');
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + esc(N.eyebrow(m)) + '</span>',
      '<h2>' + esc(tach(m.ten, i)) + '</h2>',
      '<p class="lead">' + esc(tach(m.lead, i)) + '</p>',
      '<p>' + N.topic + '</p>',
      '<h3>' + N.req + '</h3>',
      '<ol>' + li(m.yeuCau, i) + '</ol>',
      '<h3>' + N.stretch + '</h3>',
      '<ul>' + li(m.nangCao, i) + '</ul>',
      '<h3>' + N.map + '</h3>',
      '<div class="kv-grid">' + ban + '</div>',
      '<h3>' + N.hints + '</h3>',
      '<div class="callout warn"><ol>' + li(m.goiY, i) + '</ol><p>' + N.hintNote + '</p></div>',
      ...((i === 0 ? demoEn : demoVi) ? ['<h3>' + N.demo + '</h3>', '<p class="note-ct">' + N.demoNote + '</p>', i === 0 ? demoEn : demoVi] : []),
      '<h3>' + N.done + '</h3>',
      '<div class="callout ok"><ul>' + li(m.datKhi, i) + '</ul></div>',
      '<h3>' + N.submit + '</h3>',
      '<ul>' + li(m.bangChung, i) + '</ul>',
      '<p>' + N.submitNote + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🛠 Project milestone ' + so + ' — ' + tach(m.ten, 0) + '|||🛠 Mốc dự án ' + so + ' — ' + tach(m.ten, 1),
    slug: m.slug,
    type: 'EXERCISE',
    mocDuAn: so,
    isFreePreview: true,
    description: description || ('Mốc dự án ' + so + ' (sau ' + tach(m.sauChuong, 1) + '): ' + tach(m.ten, 1) + ' — yêu cầu, tiêu chí đạt, gợi ý theo tầng và một lượt chạy mẫu thật.'),
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}

/** baiBaoVe({ themEn, themVi }) → bài EXERCISE cuối khoá { baoVeDuAn: true } dựng từ DU_AN.baoVe. */
export function baiBaoVe({ themEn = '', themVi = '' } = {}) {
  const khoi = (i) => {
    const rub = BAO_VE.rubric.map((r) => '<tr><td>' + esc(tach(r.tieuChi, i)) + '</td><td>' + r.diem + '</td><td>' + esc(tach(r.moTa, i)) + '</td></tr>').join('');
    const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
    const t = i === 0
      ? { eb: 'Course project · Finish & defend', h2: 'Finish your repository and defend it', lead: 'Eighteen milestones built a repository with a real history. This last step polishes it, then you defend it in front of a panel (the AI defence room below plays the panel): you explain the history of YOUR repository and handle an incident live.', c: '☑️ Before the defence — checklist', r: '🧮 Rubric (' + tong + ' points)', th: '<tr><th>Criterion</th><th>Points</th><th>What the panel looks for</th></tr>', q: '🎤 Questions the panel likes to ask', qn: 'Expect questions about YOUR repository: the panel opens your git log, your PRs and your releases and asks why. Practise each answer with a command on screen, not with words only.', f: 'When you are ready, open the defence room below. It asks one question at a time, may give you a live incident on your throw-away clone, and scores you on the rubric with written feedback.' }
      : { eb: 'Dự án cuối khoá · Hoàn thiện & bảo vệ', h2: 'Hoàn thiện repo và bảo vệ nó', lead: 'Mười tám mốc đã dựng nên một repo có lịch sử thật. Bước cuối này đánh bóng nó, rồi bạn bảo vệ trước hội đồng (phòng bảo vệ AI bên dưới đóng vai hội đồng): bạn giải thích lịch sử repo CỦA BẠN và xử lý một sự cố trực tiếp.', c: '☑️ Trước buổi bảo vệ — checklist', r: '🧮 Rubric (' + tong + ' điểm)', th: '<tr><th>Tiêu chí</th><th>Điểm</th><th>Hội đồng tìm gì</th></tr>', q: '🎤 Câu hội đồng hay hỏi', qn: 'Câu hỏi xoay quanh repo CỦA BẠN: hội đồng mở git log, PR và release của bạn rồi hỏi vì sao. Tập trả lời mỗi câu bằng một lệnh trên màn hình, không chỉ bằng lời.', f: 'Khi đã sẵn sàng, mở phòng bảo vệ bên dưới. Nó hỏi từng câu một, có thể giao một sự cố trực tiếp trên bản clone nháp của bạn, và chấm theo rubric kèm nhận xét viết.' };
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + t.eb + '</span>',
      '<h2>' + t.h2 + '</h2>',
      '<p class="lead">' + t.lead + '</p>',
      i === 0 ? themEn : themVi,
      '<h3>' + t.c + '</h3>',
      '<div class="callout ok"><ul>' + li(BAO_VE.chuanBi, i) + '</ul></div>',
      '<h3>' + t.r + '</h3>',
      '<table><thead>' + t.th + '</thead><tbody>' + rub + '</tbody></table>',
      '<h3>' + t.q + '</h3>',
      '<p>' + t.qn + '</p>',
      '<ol>' + li(BAO_VE.cauHoiMau, i) + '</ol>',
      '<p class="note-ct">' + t.f + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🎓 Finish & defend your course project|||🎓 Hoàn thiện & bảo vệ dự án cuối khoá',
    slug: 'git-bao-ve-du-an',
    type: 'EXERCISE',
    baoVeDuAn: true,
    isFreePreview: true,
    description: 'Bài cuối khoá: checklist hoàn thiện repo dự án, rubric 10 điểm, câu hội đồng hay hỏi về lịch sử repo của chính bạn, và phòng bảo vệ AI.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}
