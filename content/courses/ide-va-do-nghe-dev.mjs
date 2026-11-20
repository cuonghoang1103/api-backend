/**
 * IDE và đồ nghề dev — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 20/11/2026 theo bảng soát khoảng trống P0-5:
 * người học "chưa tự gõ code"; thạo IDE là điều kiện để làm được gỡ lỗi (debug-co-phuong-phap) và bảo trì code cũ
 * (doc-code-cu-va-refactor). IntelliJ có 0 bài trong kho, regex chỉ "vừa đủ".
 * KHÔNG dạy debugger (thuộc debug-co-phuong-phap ch3–5). KHÔNG dạy lại: git ch14 (Git trong VS Code), linux-bash ch3 (grep),
 * web-foundations 1.2 (cài VS Code nhập môn) và 11.5 (regex vừa đủ), docker 13.2 (debugger trong container), log-tu-a-den-z ch2.
 * Kế hoạch + bảng phủ: content/courses/ide-va-do-nghe-dev/_KE-HOACH.md. Soạn theo content/courses/docker/_HOP-DONG.md.
 * Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật, GIỮ NGUYÊN slug bài và title chương.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'ide-va-do-nghe-dev',
    title: 'IDE & Developer Toolbox',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ide-va-do-nghe-dev.png?v=1',
    shortDescription: 'Work at the speed of a senior: VS Code and IntelliJ IDEA in depth (navigation, automatic refactoring, run configurations, the plugins that matter), a terminal that works for you, practical regex for project-wide find and replace, Git inside the IDE, and setting up a new machine in an hour — on Mac and Windows.|||Làm việc nhanh như senior: VS Code và IntelliJ IDEA chuyên sâu (điều hướng, refactor tự động, cấu hình chạy, plugin cần có), terminal làm việc thay bạn, regex thực dụng để tìm/thay toàn dự án, Git trong IDE, và cài máy mới trong một giờ — trên cả Mac và Windows.',
    description: 'Khoá ngắn về đồ nghề hằng ngày của lập trình viên, dành cho người đã học ngôn ngữ nhưng vẫn tìm code bằng mắt, đổi tên bằng tay và mất cả buổi sáng để cài môi trường. Bạn học VS Code cho Node.js/TypeScript/React và IntelliJ IDEA cho Java/Spring Boot tới mức điều hướng một dự án lạ chỉ bằng bàn phím, để IDE refactor thay mình, cấu hình chạy/test đúng cách; dùng terminal hiệu quả (lịch sử, alias, rg, fzf, jq); viết regex đủ chắc để tìm/thay hàng trăm chỗ trong dự án mà không làm hỏng; dùng Git trong IDE (commit từng đoạn, so nhánh, giải xung đột, Local History cứu file); và dựng dotfiles + script để cài máy mới, kể cả Windows/PowerShell và WSL2. Mỗi chương có lab "làm bằng phím" có đo thời gian; cuối khoá dựng bộ đồ nghề của riêng bạn.',
    whatYouLearn: 'Điều hướng code bằng phím trong VS Code và IntelliJ (tìm file, ký hiệu, định nghĩa, nơi dùng, call hierarchy); đa con trỏ và chỉnh sửa hàng loạt; dùng refactor tự động; cấu hình settings, extension/plugin và run configuration cho nhóm; dùng shell hiệu quả với rg, fd, fzf, jq; viết regex có nhóm, lookaround, và dùng đúng trong Java, JavaScript và ô tìm/thay của IDE; tránh ReDoS; dùng Git trong IDE an toàn; tạo dotfiles và script cài máy; làm việc thoải mái trên Windows với PowerShell, winget và WSL2.',
    requirements: 'Đã cài và viết thử được chương trình nhỏ bằng Java hoặc JavaScript. Biết Git cơ bản.',
    documentsNote: 'Tài liệu chính: VS Code Docs (code.visualstudio.com/docs) • JetBrains IntelliJ IDEA Docs + IntelliJ IDEA Reference Card (phím tắt) • JetBrains Free Educational Licenses • ripgrep, fd, fzf, jq README chính thức • MDN — Regular expressions • Java SE API — java.util.regex.Pattern • regular-expressions.info • OWASP — Regular expression Denial of Service (ReDoS) • Microsoft Learn — PowerShell, winget, WSL.',
  },
  sections: khung('ide', [
    ['Section 0 — Tools decide your speed', 'Mục 0 — Đồ nghề quyết định tốc độ', 'Vì sao người mới chậm không phải vì gõ chậm.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Why fluent tools matter more than typing speed', 'Bắt đầu tại đây (1/2) — Vì sao thạo đồ nghề quan trọng hơn gõ nhanh', 'Lịch sử ngắn: vi/Emacs → Eclipse → IntelliJ (2001) → VS Code (2015) → Language Server Protocol (2016) · Liên tưởng: thợ mộc biết dùng máy vs đục tay · Lộ trình 7 chương · Liên hệ khoá Debug và khoá Code cũ (khoá này là nền cho hai khoá đó)'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Working without your tools: searching by eye, renaming by hand', 'Bắt đầu tại đây (2/2) — Làm việc không có đồ nghề: tìm bằng mắt, đổi tên bằng tay', 'Tình huống OJT: mất cả buổi sáng tìm nơi định nghĩa một hàm · Đổi tên tay sót 3 chỗ, build hỏng · Sự cố thật có nguồn: Stack Overflow 20/07/2016 sập 34 phút vì một regex · Đo thời gian trước khoá để so sau khoá'],
      ['cai-dat', 'Installing VS Code and IntelliJ IDEA (free student licence), on Mac and Windows', 'Cài VS Code và IntelliJ IDEA (giấy phép sinh viên miễn phí), trên Mac và Windows', 'Community vs Ultimate, đăng ký JetBrains Educational License bằng email trường · JDK, Node qua trình quản lý phiên bản · Lab: mở hai dự án mẫu (Spring Boot, Express + React)'],
    ]],
    ['Chapter 1 — VS Code in depth for Node.js, TypeScript and React', 'Chương 1 — VS Code chuyên sâu cho Node.js, TypeScript và React', 'Bàn phím trước, chuột sau.', [
      ['dieu-huong', 'Navigation: Quick Open, Command Palette, Go to Symbol/Definition/References', 'Điều hướng: Quick Open, Command Palette, Go to Symbol/Definition/References', 'Ctrl/⌘+P, Ctrl/⌘+Shift+P, F12, Shift+F12, Ctrl/⌘+Shift+O, Ctrl/⌘+T · Quay lại vị trí trước (Alt/⌃+-) · Lab: trả lời 10 câu "hàm này được gọi ở đâu" trong 10 phút'],
      ['chinh-sua', 'Editing fast: multi-cursor, line moves, snippets, rename and quick fixes', 'Chỉnh sửa nhanh: đa con trỏ, di chuyển dòng, snippet, đổi tên và quick fix', 'Ctrl/⌘+D, Alt+Click, Ctrl/⌘+Shift+L · Refactor TS: Extract function/constant, Move to new file · Snippet tự viết cho dự án · Lab: sửa 50 dòng JSON thành object JS không dùng chuột'],
      ['cau-hinh', 'Settings, workspace settings and .vscode for the team; tasks.json', 'Settings, workspace settings và thư mục .vscode cho cả nhóm; tasks.json', 'User vs Workspace settings · format on save, ESLint/Prettier thống nhất · extensions.json gợi ý extension cho nhóm · tasks.json chạy build/test · Settings Sync'],
      ['extension', 'Extensions worth installing — and the security risk of extensions', 'Extension đáng cài — và rủi ro bảo mật của extension', 'ESLint, Prettier, GitLens, Error Lens, REST Client/Thunder Client, Docker, Dev Containers, Prisma, Tailwind · Góc hacker: extension giả mạo/typosquat trên Marketplace, Workspace Trust khi mở repo lạ · Cài ít nhưng đúng'],
      ['lab', 'Lab: A timed keyboard-only task list in the sample Express + React app', 'Lab: Danh sách việc làm bằng bàn phím có bấm giờ trong ứng dụng Express + React mẫu', 'Tìm, đổi tên, tách hàm, chạy task test · Đạt khi: hoàn thành dưới 15 phút, không chạm chuột'],
      ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu: phím tắt điều hướng · workspace settings · Workspace Trust'],
    ]],
    ['Chapter 2 — IntelliJ IDEA for Java and Spring Boot', 'Chương 2 — IntelliJ IDEA cho Java và Spring Boot', 'IDE bạn sẽ mở mỗi sáng khi OJT trên dự án Java.', [
      ['du-an', 'Opening projects right: Maven/Gradle import, Project SDK, language level, indexing', 'Mở dự án cho đúng: import Maven/Gradle, Project SDK, language level, lập chỉ mục', 'Lỗi đỏ khắp nơi vì sai JDK · Reload Maven project · Invalidate Caches khi nào (và khi nào không) · Tình huống OJT: máy công ty proxy chặn tải thư viện'],
      ['dieu-huong', 'Navigation: Search Everywhere, Find Usages, Call and Type Hierarchy', 'Điều hướng: Search Everywhere, Find Usages, Call và Type Hierarchy', 'Shift Shift, Ctrl/⌘+N, Ctrl/⌘+B, Ctrl/⌘+Alt+B, Alt+F7, Ctrl+Alt+H, Ctrl/⌘+F12 · Keymap Windows vs macOS · Lab: lần một request từ controller tới repository chỉ bằng phím'],
      ['refactor-sinh-code', 'Automatic refactoring, code generation and live templates', 'Refactor tự động, sinh code và live template', 'Shift+F6, Ctrl/⌘+Alt+M/V/C/F/P, Ctrl/⌘+F6 · Alt+Insert / ⌘N sinh constructor, getter · sout, psvm, iter và live template tự viết · Postfix completion (.var, .if, .for) · Intention actions Alt+Enter'],
      ['chay-test', 'Run configurations for Spring Boot and Tomcat, env vars, tests and coverage', 'Run configuration cho Spring Boot và Tomcat, biến môi trường, test và độ phủ', 'Active profiles, VM options, .env (EnvFile) · Chạy một test/một class/cả module · Coverage · Debugger ở khoá Debug ch4 (không dạy ở đây)'],
      ['cong-cu-kem', 'Built-in tools and plugins: HTTP Client, Database, Maven, SonarLint, Lombok', 'Công cụ đi kèm và plugin: HTTP Client, Database, Maven, SonarLint, Lombok', 'File .http gửi request ngay trong IDE · Database tool (Ultimate) hoặc plugin thay thế · Plugin nên và không nên cài'],
      ['lab', 'Lab: A timed Spring Boot task list: navigate, refactor, run tests', 'Lab: Danh sách việc Spring Boot có bấm giờ: điều hướng, refactor, chạy test', 'Đạt khi: hoàn thành dưới 20 phút, mọi refactor bằng công cụ tự động, test xanh'],
      ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu: SDK/language level · phím tắt · postfix completion · run configuration'],
    ]],
    ['Chapter 3 — A terminal that works for you', 'Chương 3 — Terminal làm việc thay bạn', 'Ít gõ lại, tìm nhanh, đọc JSON dễ.', [
      ['shell', 'Shell essentials: history search, aliases, functions, prompt, the integrated terminal', 'Nền tảng shell: tìm lịch sử, alias, hàm, prompt, terminal tích hợp trong IDE', 'Ctrl+R, !!, !$ · .zshrc/.bashrc và PowerShell $PROFILE · Terminal tích hợp VS Code/IntelliJ · Liên kết linux-bash (không dạy lại cú pháp)'],
      ['cong-cu-hien-dai', 'Modern CLI tools: ripgrep, fd, fzf, bat, jq, tldr', 'Công cụ dòng lệnh hiện đại: ripgrep, fd, fzf, bat, jq, tldr', 'rg nhanh và tôn trọng .gitignore · fzf chọn file/lịch sử · jq đọc và lọc JSON từ API · Lab: tìm mọi endpoint POST trong dự án và đếm theo file'],
      ['tmux', 'Sessions and panes: tmux basics or Windows Terminal panes', 'Phiên và ô chia: tmux cơ bản hoặc chia ô Windows Terminal', 'Giữ phiên khi mất kết nối SSH · Layout chạy backend + frontend + log · Góc an toàn: lịch sử shell có lưu mật khẩu đã gõ — cách tránh'],
      ['lab', 'Lab: Ten everyday tasks in one line each', 'Lab: Mười việc hằng ngày, mỗi việc một dòng lệnh', 'Tìm file, tìm chuỗi, đọc JSON, đếm, đổi tên hàng loạt · Đạt khi: 10 lệnh đúng, giải thích được từng phần'],
      ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu: rg vs grep · jq · Ctrl+R · lịch sử có bí mật'],
    ]],
    ['Chapter 4 — Practical regex: find and replace across a whole project', 'Chương 4 — Regex thực dụng: tìm và thay trên toàn dự án', 'Từ "vừa đủ" tới viết chắc tay.', [
      ['cu-phap', 'Full syntax: classes, quantifiers, greedy vs lazy, groups, backreferences, flags', 'Cú pháp đầy đủ: lớp ký tự, lượng từ, tham lam/lười, nhóm, tham chiếu ngược, cờ', 'Xây regex từng bước trên regex101 · Unicode và tiếng Việt (cờ u, \\p{L}) · Liên kết web-foundations 11.5 (bản vừa đủ) và log-tu-a-den-z ch2 (regex đọc log)'],
      ['lookaround', 'Lookahead and lookbehind, and when a regex should not be used', 'Lookahead, lookbehind, và khi nào KHÔNG nên dùng regex', 'Tìm chỗ gọi hàm thiếu await, chuỗi không theo sau bởi… · Không parse HTML/JSON bằng regex — dùng parser · Tình huống thật: validate email bằng regex khổng lồ'],
      ['trong-ngon-ngu', 'Regex in Java and JavaScript: Pattern/Matcher, escaping, replaceAll', 'Regex trong Java và JavaScript: Pattern/Matcher, thoát ký tự, replaceAll', 'Hai lần backslash trong chuỗi Java · String.matches khớp cả chuỗi · JS: /g, matchAll, replace với hàm · Biên dịch Pattern một lần'],
      ['tim-thay', 'Project-wide find and replace in VS Code, IntelliJ and rg', 'Tìm/thay toàn dự án trong VS Code, IntelliJ và rg', 'Luôn xem trước, giới hạn thư mục, commit trước khi thay · IntelliJ Structural Search mức nhận biết · Lab: đổi tên một API ở 120 chỗ an toàn'],
      ['redos', 'The hacker\'s view: ReDoS and catastrophic backtracking', 'Góc hacker: ReDoS và quay lui thảm hoạ', 'Sự cố thật: Cloudflare 02/07/2019, Stack Overflow 20/07/2016 · Mẫu nguy hiểm (a+)+ · Cách phòng: giới hạn độ dài đầu vào, regex an toàn, timeout, công cụ kiểm · Theo OWASP ReDoS'],
      ['lab', 'Lab: Fifteen real refactor-by-regex tasks', 'Lab: Mười lăm việc thay thế bằng regex thật', 'Đổi định dạng ngày trong log, đổi console.log thành logger, đổi import, trích dữ liệu · Đạt khi: diff đúng 100%, không thay nhầm'],
      ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu: tham lam/lười · lookbehind · thoát ký tự Java · nhận ra regex nguy hiểm'],
    ]],
    ['Chapter 5 — Git inside the IDE', 'Chương 5 — Git trong IDE', 'Bấm nút nhưng biết nút đó chạy lệnh gì.', [
      ['intellij-git', 'IntelliJ Git: commit window, partial commits, shelve, annotate, compare branches', 'Git trong IntelliJ: cửa sổ commit, commit từng đoạn, shelve, annotate, so nhánh', 'Chọn từng hunk để commit · Shelve vs stash · Annotate (blame) với điều hướng tới commit · Phần VS Code đã dạy ở git ch14 — không dạy lại'],
      ['xung-dot', 'Resolving conflicts in the three-way merge tool', 'Giải xung đột bằng công cụ merge ba bên', 'Đọc ba cột: của bạn, của họ, kết quả · Chấp nhận từng thay đổi · Chạy test trước khi hoàn tất · Lab: giải 3 xung đột trong dự án Spring'],
      ['local-history', 'Local History: recovering files Git never saw', 'Local History: cứu file mà Git chưa từng thấy', 'IntelliJ Local History và VS Code Timeline · Cứu file bị xoá/ghi đè trước khi commit · Tình huống thật: lỡ reset --hard mất code chưa commit'],
      ['lab', 'Lab: A feature branch from start to merged, entirely in the IDE', 'Lab: Một nhánh tính năng từ đầu tới khi merge, hoàn toàn trong IDE', 'Đạt khi: commit nhỏ đúng chuẩn, không commit nhầm file, giải xung đột xong test xanh'],
      ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu: partial commit · shelve · đọc merge ba bên · Local History'],
    ]],
    ['Chapter 6 — A new machine in an hour: dotfiles, Windows and WSL2', 'Chương 6 — Cài máy mới trong một giờ: dotfiles, Windows và WSL2', 'Máy hỏng hay đổi máy công ty — không mất một tuần.', [
      ['dotfiles', 'Dotfiles in a Git repo: shell, Git config, editor settings, symlinks', 'Dotfiles trong một repo Git: shell, cấu hình Git, cài đặt editor, symlink', 'Cái gì nên đưa vào, cái gì tuyệt đối không (token, SSH key riêng) · Góc hacker: dotfiles public lộ token — quét bằng gitleaks trước khi push'],
      ['cai-tu-dong', 'Scripted installs: Homebrew Brewfile, winget/scoop, SDKMAN, nvm/fnm', 'Cài tự động bằng script: Brewfile Homebrew, winget/scoop, SDKMAN, nvm/fnm', 'Một lệnh cài đủ JDK, Node, Docker, IDE, công cụ CLI · Ghim phiên bản theo dự án · Lab: script cài máy mới chạy được hai lần không lỗi'],
      ['git-ssh', 'Identity setup: Git config, SSH keys with passphrase, signing, two identities', 'Thiết lập danh tính: cấu hình Git, SSH key có passphrase, ký commit, hai danh tính', 'Tách tài khoản công ty và cá nhân (includeIf — đã dạy ở git 14.3, ở đây áp dụng) · ssh-agent, keychain · Liên kết agile-teamwork (an ninh thông tin khi đi làm)'],
      ['windows', 'Windows for developers: Terminal, PowerShell, winget, WSL2, Dev Containers', 'Windows cho lập trình viên: Terminal, PowerShell, winget, WSL2, Dev Containers', 'Select-String (grep), Get-ChildItem -Recurse, Test-NetConnection, Get-Process · Execution policy · Code trong WSL2 thay vì /mnt/c (hiệu năng) · Dev Containers để cả nhóm giống nhau'],
      ['lab', 'Lab: Rebuild your dev machine from your dotfiles repo', 'Lab: Dựng lại máy dev từ repo dotfiles của bạn', 'Thử trên máy ảo hoặc tài khoản người dùng mới · Đạt khi: dưới 60 phút từ máy trắng tới chạy được hai dự án mẫu'],
      ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu: thứ không đưa vào dotfiles · includeIf · WSL2 và /mnt/c · cmdlet tương đương'],
    ]],
    ['Chapter 7 — Capstone: your personal toolbox, proven', 'Chương 7 — Dự án cuối khoá: bộ đồ nghề của riêng bạn, có bằng chứng', 'Đo lại tốc độ đầu khoá và cuối khoá.', [
      ['de-bai', 'The brief: dotfiles repo, IDE settings, cheat sheet and a timed speed-run', 'Đề bài: repo dotfiles, cài đặt IDE, bảng tra nhanh và một lượt chạy đua có bấm giờ', 'Speed-run 20 việc trên hai dự án mẫu (Spring Boot, Express + React) · So với thời gian đo ở Mục 0'],
      ['bang-tra', 'Your one-page cheat sheet for VS Code, IntelliJ, terminal and regex', 'Bảng tra một trang của bạn cho VS Code, IntelliJ, terminal và regex', 'Chỉ ghi thứ bạn thật sự dùng · Bản Mac và Windows'],
      ['phong-van', 'Interview and first-week questions about tools', 'Câu hỏi phỏng vấn và tuần đầu đi làm về đồ nghề', '"Bạn tìm nơi một hàm được gọi thế nào" · "Bạn refactor đổi tên an toàn ra sao" · "Regex này có vấn đề gì" · Chuẩn bị máy ngày đầu OJT'],
      ['tong-ket', 'Final quiz', 'Kiểm tra tổng kết', '20 câu trộn cả khoá'],
    ]],
  ]),
};
