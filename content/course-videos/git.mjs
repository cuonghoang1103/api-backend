/**
 * Curated YouTube track for the "Git & GitHub" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/git.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/git.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'git',
  defaultVideoTrack: 'YT',
  lessons: {

    /* ── Mục 0 — Giới thiệu, Vì sao cần Git, Cài đặt & Cách học ── */
    'git-0-0-slides': { yt: 'r8jQ9hVA2qs', credit: "GitHub — A brief introduction to Git for beginners | GitHub" },
    'git-0-1-gioi-thieu-lo-trinh': { yt: 'zTjRZNkhiEU', credit: "freeCodeCamp.org — Learn Git – Full Course for Beginners" },
    'git-0-2-van-de-git-giai-quyet': { yt: 'lJu5xwbGgRk', credit: "Computerphile — Git Version Control _final_new_final.new - Computerphile" },
    'git-0-3-cai-dat-cau-hinh': { yt: 'AdzKzlp66sQ', credit: "ProgrammingKnowledge — How to Install and Configure Git and GitHub on Windows 11" },
    'git-0-4-cach-hoc': { yt: 'CvUiKWv2-C0', credit: "Dave Gray — Git Tutorial for Absolute Beginners" },

    /* ── Chương 1 — Mô hình: ảnh chụp, không phải bản khác biệt ── */
    'git-1-0-slides': { yt: 'e9lnsKot_SQ', credit: "ByteByteGo — How Git Works: Explained in 4 Minutes" },
    'git-1-1-ba-cai-cay': { yt: '1GFIZFXGMXY', credit: "Envato Tuts+ — Git Basics: The Three Trees" },
    'git-1-2-commit-la-gi': { yt: 'Ala6PHlYjmw', credit: "LearnThatStack — Git Will Finally Make Sense After This" },
    'git-1-3-vong-lap-hang-ngay': { yt: 'S0_pOvrfN0U', credit: "Nick Janetakis — Creating Laser Focused Git Commits Using Git Add Patch" },
    'git-1-4-loi-nhan-commit': { yt: 'Dy5t_H2PRrk', credit: "Eric Murphy — How to Make Actually Good Commits in Git" },
    'git-1-5-gitignore': { yt: 'Oh6SeuOMnV4', credit: "Net Ninja — Git Crash Course #9 - .gitignore File" },

    /* ── Chương 2 — Đọc lịch sử: khảo cổ trên chính mã của bạn ── */
    'git-2-0-slides': { yt: 'UZN7tPC4dHk', credit: "Ben Kadel — Full Git Tutorial (Part 7) - Git Log Fully Explained" },
    'git-2-1-git-log': { yt: '8yjCjakdGQs', credit: "Bogdan Stashchuk — Git log options - oneline, graph, stat | Advanced Git - 02" },
    'git-2-2-show-va-diff': { yt: 'UvMJb2eeo6g', credit: "GitKraken — Git Tutorial #33: How to Use Git Diff Between Branches, Commits, and More | Learn Git" },
    'git-2-3-blame-va-pickaxe': { yt: '8uuueHkWy-E', credit: "anthonywritescode — how I use git blame (beginner - intermediate) anthony explains #528" },
    'git-2-4-bisect': { yt: 'Q-kqm0AgJZ8', credit: "Joshua Morony — Git bisect is insanely good (and so easy)" },
    'git-2-5-dieu-tra-thuc-te': { yt: 'KKeucpfAuuA', credit: "Jim Hester — Using git bisect to pinpoint bugs in your commit history" },

    /* ── Chương 3 — Nhánh & hợp nhất ── */
    'git-3-0-slides': { yt: 'e2IbNHi4uCI', credit: "freeCodeCamp.org — Git Branches Tutorial" },
    'git-3-1-nhanh-la-gi': { yt: 'mhZQRBp8dXE', credit: "Brief — Git Internals - Branches" },
    'git-3-2-hai-kieu-merge': { yt: 'W5ek8Y3UUs4', credit: "Cloud With Raj — Git Branch and Merge | Fast Forward Merge Vs Recursive Three Way Merge | with Quiz!" },
    'git-3-3-xung-dot': { yt: 'DloR0BOGNU0', credit: "Philomatics — Never fear merge conflicts again - git merge/pull tutorial" },
    'git-3-4-rebase-vs-merge': { yt: 'CRlGDDprdOQ', credit: "Academind — Git MERGE vs REBASE" },
    'git-3-5-rebase-tuong-tac': { yt: '42392W7SgnE', credit: "Philomatics — git interactive rebase - Undo, Edit & Squash git commits with a single command" },

    /* ── Chương 4 — Hoàn tác: lưới an toàn ── */
    'git-4-0-slides': { yt: '-JqV3MPWrik', credit: "Tower — How to Undo Mistakes in Git" },
    'git-4-1-ban-do-hoan-tac': { yt: 'Dr1EjJFX86E', credit: "HenrikM Dev — Git Reset vs Revert vs Rebase - Fix Your Mistakes the Right Way" },
    'git-4-2-reset': { yt: 's1idhUiCk38', credit: "GitKraken — Git Tutorial #34: How to Use Git Reset Soft, Mixed, and Hard | Learn Git" },
    'git-4-3-revert': { yt: 'GytsxgB4-HU', credit: "Philomatics — Undo a git commit - git reset/revert - pushed/not pushed" },
    'git-4-4-reflog': { yt: 'K7-wrGpnqUM', credit: "System Crafters — How to Rescue Your Commits with Git Reflog" },
    'git-4-5-stash': { yt: 'fXGug4itlTk', credit: "GitKraken — Git Tutorial #15: How to Use Git Stash, Apply, and Pop | Learn Git with GitKraken" },

    /* ── Chương 5 — Remote & GitHub ── */
    'git-5-0-slides': { yt: 'Gg4bLk8cGNo', credit: "David Mahler — Introduction to Git - Remotes" },
    'git-5-1-remote-fetch-pull': { yt: 'T13gDBXarj0', credit: "The Modern Coder — Git Pull vs Fetch: When To Use Each" },
    'git-5-2-xac-thuc': { yt: 'Lhyu_2iLO8w', credit: "HenrikM Dev — How to Git Clone From GitHub via HTTPS and SSH [2 Ways]" },
    'git-5-3-push': { yt: 'wBc0WcyTtOA', credit: "Cameron McKenzie — Git Set Upstream Example | Learn Branch Management in Git" },
    'git-5-4-fork-upstream': { yt: 'deEYHVpE1c8', credit: "Faraday Academy — Git Forking & Fetch: How to Keep your Fork in Sync with an Upstream Repository" },

    /* ── Chương 6 — Pull request & code review ── */
    'git-6-0-slides': { yt: 'nCKdihvneS0', credit: "GitHub — How to create a pull request in 4 min | GitHub for Beginners" },
    'git-6-1-giai-phau-pr': { yt: 'XmIlJYdBgvc', credit: "Ben Kadel — Full Git Tutorial (Part 6) - Pull Requests & Code Reviews" },
    'git-6-2-review': { yt: 'LheeJPkdCu8', credit: "Matt Stauffer — How to Review a Pull Request Like a Senior Developer" },
    'git-6-3-chien-luoc-merge': { yt: 'rFRtsiQEJZw', credit: "Dev Leonardo — How to Close a Pull Request - Merge Commit vs Squash vs Rebase on GitHub" },
    'git-6-4-bao-ve-nhanh': { yt: 'HWRzJKO7C0o', credit: "Swiftful Thinking — How to Add Branch Rules, CodeOwners, Pull Request Templates  | Git & Source Control #11" },

    /* ── Chương 7 — Quy trình nhóm, tag & phát hành ── */
    'git-7-0-slides': { yt: 'gQVUCTVt39o', credit: "GitHub — Branching strategies: GitHub Flow and Git Flow #30MinutesToMerge" },
    'git-7-1-chien-luoc-nhanh': { yt: 'GQQqf-C2ha4', credit: "TechWorld with Nana — 3 Git Workflows Every Developer Should Know (And When to Use Each)" },
    'git-7-2-tag-semver': { yt: '4wPjo5C-v8Y', credit: "GitKraken — How to Manage Releases with Semantic Versioning and Git Tags" },
    'git-7-3-phat-hanh-changelog': { yt: 'Ob9llA_QhQY', credit: "Kahan Data Solutions — How to Release Code With Github" },

    /* ── Chương 8 — Viết lại lịch sử an toàn ── */
    'git-8-0-slides': { yt: 'qsTthZi23VE', credit: "freeCodeCamp.org — Advanced Git Tutorial - Interactive Rebase, Cherry-Picking, Reflog, Submodules and more" },
    'git-8-1-amend': { yt: 'q53umU5vMkk', credit: "The Modern Coder — Git Amend Tutorial: Rewrite Git History" },
    'git-8-2-force-with-lease': { yt: 'BkKBWgPXMwE', credit: "Steven Lee — git push   force vs git push   force with lease" },
    'git-8-3-go-bi-mat': { yt: 'msUDPYsbABY', credit: "GitGuardian — How to permanently remove files from git and  rewrite your git history" },

    /* ── Chương 9 — Bên dưới nắp capo: kho đối tượng ── */
    'git-9-0-slides': { yt: 'lG90LZotrpo', credit: "CS50 — Git Internals by John Britton of GitHub - CS50 Tech Talk" },
    'git-9-1-thu-muc-git': { yt: 'bSA91XTzeuA', credit: "Computerphile — Inside the Hidden Git Folder - Computerphile" },
    'git-9-2-bon-doi-tuong': { yt: 'MyvyqdQ3OjI', credit: "Brief — Git Internals - Git Objects" },
    'git-9-3-packfile-gc': { yt: 'xo6YqzUROcg', credit: "Bogdan Stashchuk — Git Garbage Collection | Advanced Git - 14" },

    /* ── Chương 10 — Kho mã lớn & quy trình nâng cao ── */
    'git-10-0-slides': { yt: 'LMG_-uJVdsw', credit: "GitLab Unfiltered — Speed Run: Partial Clone, Sparse Checkout, and File Locking" },
    'git-10-1-worktree': { yt: 'Vf_0QpLsFRs', credit: "Net Ninja — Git Worktrees Tutorial #1 - What are Git Worktrees?" },
    'git-10-2-submodule-subtree': { yt: 'JESI498HSMA', credit: "Philomatics — Why everyone hates git submodules" },
    'git-10-3-monorepo-lfs': { yt: 'jOVWHIDvpe8', credit: "Bryant Son — Optimize checkout and clone time for GitHub monorepos using sparse-checkout and filter commands" },

    /* ── Chương 11 — Nền tảng GitHub ── */
    'git-11-0-slides': { yt: 'NUELGzIHT-I', credit: "GitHub — The ultimate beginner's guide to GitHub in 2026" },
    'git-11-1-issue-projects-gh': { yt: 'c67GaAkf1BE', credit: "GitHub — How to use GitHub issues and projects | GitHub for Beginners" },
    'git-11-2-actions': { yt: 'R8_veQiYBjI', credit: "TechWorld with Nana — GitHub Actions Tutorial - Basic Concepts and CI/CD Pipeline with Docker" },
    'git-11-4-bao-mat-kho': { yt: 'zhxXaFzzJYA', credit: "GitHub — Getting started with GitHub security | GitHub for Beginners" },

    /* ── Chương 12 — Hook, ký commit & tự động hoá ── */
    'git-12-0-slides': { yt: '1OFiiPretCM', credit: "GitGuardian — What are GitHooks? Explained in 5 minutes" },
    'git-12-1-hooks': { yt: 'ObksvAZyWdo', credit: "GitGuardian — Complete guide to GitHooks - Creating your own pre-commit hooks" },
    'git-12-2-ky-commit': { yt: '4166ExAnxmo', credit: "Nick Janetakis — Signing and Verifying Git Commits on the Command Line and GitHub" },
    'git-12-4-chinh-sach-may-chu': { yt: 'ZTbM-h9RZOo', credit: "Mickey Gousset — Introduction to GitHub Actions - Part 6 - Repository Rulesets" },

    /* ── Chương 13 — Cứu hộ & Git trong quy trình thật ── */
    'git-13-0-slides': { yt: 'FsSTd4Vcm90', credit: "International PHP Conference — Git: Undoing Things and recovering from Mistakes | Tobias Günther | IPC Spring 2018" },
    'git-13-1-cuu-ho': { yt: 'lX9hsdsAeTk', credit: "freeCodeCamp.org — How to Undo Mistakes With Git Using the Command Line" },
    'git-13-2-quy-trinh-that': { yt: 'jhtbhSpV5YA', credit: "Ako Dev — How to use GIT when working with a team?" },

    /* ── Chương 14 — Git hằng ngày trong công cụ: VS Code, giao diện đồ hoạ & cấu hình ── */
    'git-14-0-slides': { yt: 'NFjz1AGKA4c', credit: "GitHub — How to use Git and GitHub in VS Code | Tutorial for beginners" },
    'git-14-1-vs-code': { yt: 'i_23KUAEtUM', credit: "Visual Studio Code — Using Git with Visual Studio Code (Official Beginner Tutorial)" },
    'git-14-2-gitlens-desktop': { yt: 'oJdlGtsbc3U', credit: "GitKraken — GitLens Tutorial: How to use the VS Code Extension" },
    'git-14-3-cau-hinh': { yt: 'G3NJzFX6XhY', credit: "codingjerk — Configure your Git" },
    'git-14-4-windows-crlf': { yt: 'zn7m2Mdm_Vg', credit: "ASCODE — CR LF line endings - understanding and fixing the invisible characters hiding between the lines" },

    /* ── Chương 15 — GitHub cho sinh viên: hồ sơ, portfolio & mã nguồn mở ── */
    'git-15-0-slides': { yt: 'z8UPAVTh2aE', credit: "Miraya — How To Make Your GitHub Stand Out (Gets You Hired!)" },
    'git-15-1-ho-so-github': { yt: 'DWFs6aqknqw', credit: "Magdeline Huang — How to level up your GitHub profile README (Basic to Pro!)" },
    'git-15-2-github-pages': { yt: 'b2r9Cdvssi0', credit: "GitHub — Getting started with GitHub Pages for beginners | Tutorial" },
    'git-15-3-student-pack-codespaces': { yt: 'HIVFdN9VGgw', credit: "GitHub — GitHub GitHub Education: free programs, technology, and opportunities available for Students" },
    'git-15-4-dong-gop-ma-nguon-mo': { yt: 'WldXhauP024', credit: "GitHub — Getting started with open source contributions for beginners" },

    /* ── Chương 16 — Dự án nhóm cuối khoá: vận hành một dự án nhóm trên GitHub ── */
    'git-16-0-slides': { yt: 'ygqx50-JHEE', credit: "HenrikM Dev — How To Use Git to Collaborate with Others [Git Tutorial]" },
    'git-16-1-khoi-tao-repo-nhom': { yt: 'IUgvj0lPYVM', credit: "FullStackWithLawrence — Pro Tips For Setting Up Your GitHub Repo - Part I" },
    'git-16-2-sprint-mo-phong': { yt: '02aQhH5cNBg', credit: "Kahan Data Solutions — A typical GitHub workflow // what to expect" },
    'git-16-3-phat-hanh-hotfix': { yt: '5q75eeEYApk', credit: "Cameron McKenzie — Gitflow Hotfix Branch Example" },
    'git-16-4-su-co-nhom': { yt: 'FdZecVxzJbk', credit: "Corey Schafer — Git Tutorial: Fixing Common Mistakes and Undoing Bad Commits" },
  },
};
