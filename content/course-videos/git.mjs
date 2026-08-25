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
    /* ── Mục 0 — Giới thiệu, vì sao Git, cài đặt & cách học ── */
    'git-0-1-gioi-thieu-lo-trinh': { yt: 'zTjRZNkhiEU', credit: '' },   // Learn Git – Full Course for Beginners
    'git-0-2-van-de-git-giai-quyet': { yt: 'uEG3wA9lzNw', credit: '' }, // Git tutorial for beginners: Introduction to Git version control
    'git-0-3-cai-dat-cau-hinh': { yt: '8X4u9sca3Io', credit: '' },      // Setting Up SSH Keys for GitHub
    'git-0-4-cach-hoc': { yt: 'CvUiKWv2-C0', credit: '' },              // Git Tutorial for Absolute Beginners

    /* ── Chương 1 — Mô hình: ảnh chụp, không phải bản vá ── */
    'git-1-1-ba-cai-cay': { yt: 'b-G92QVXGeY', credit: '' },        // Git Index (Staging area)
    'git-1-2-commit-la-gi': { yt: 'ZzrUtG5DY2A', credit: '' },      // How Git ACTUALLY Works (Blobs, Trees, Commits)
    'git-1-3-vong-lap-hang-ngay': { yt: 'rOM8OwExIL0', credit: '' },// Stage Specific Lines Using Git Add Patch (Edit)
    'git-1-4-loi-nhan-commit': { yt: 'ZgUlLthxBp8', credit: '' },   // Git Commit Best Practices | How to Write a Good Commit Message
    'git-1-5-gitignore': { yt: 'zd7bUQsDyW0', credit: '' },         // Git Ignore Explained: How to Use .gitignore Files (Beginner Guide)

    /* ── Chương 2 — Đọc lịch sử: khảo cổ trên mã của chính mình ── */
    'git-2-1-git-log': { yt: '8yjCjakdGQs', credit: '' },           // Git log options - oneline, graph, stat | Advanced Git - 02
    'git-2-2-show-va-diff': { yt: 'UvMJb2eeo6g', credit: '' },      // Git Tutorial #33: How to Use Git Diff Between Branches, Commits, and More
    'git-2-3-blame-va-pickaxe': { yt: 'gPWxY1sRcvk', credit: '' },  // Episode 31 | Git Blame & Bisect: Find the Bug in Seconds (Code Archaeology Explained!)
    'git-2-4-bisect': { yt: 'vm0Hu4pWlBQ', credit: '' },            // How To Find ANY Bug with Git Bisect
    'git-2-5-dieu-tra-thuc-te': { yt: 'KKeucpfAuuA', credit: '' },  // Using git bisect to pinpoint bugs in your commit history

    /* ── Chương 3 — Nhánh & hoà nhánh ── */
    'git-3-1-nhanh-la-gi': { yt: '8300d2-xQMg', credit: '' },       // Git Internals: Demystifying References, Branches & HEAD
    'git-3-2-hai-kieu-merge': { yt: 'mS8oUqqc2G8', credit: '' },    // Git Tutorial #11: How to Merge Branches and Resolve Conflicts | GitKraken
    'git-3-3-xung-dot': { yt: 'CaXaWKlSdPE', credit: '' },          // How to Resolve Merge Conflicts Between Branches | Git & Source Control #7
    'git-3-4-rebase-vs-merge': { yt: 'cjSjlHUmaBU', credit: '' },   // Git Merge vs Rebase Explained Visually | Which One Should You Use?
    'git-3-5-rebase-tuong-tac': { yt: '296lTWWwIxE', credit: '' },  // Git rebase vs merge - tutorial and comparison (có interactive rebase)

    /* ── Chương 4 — Hoàn tác: tấm lưới an toàn ── */
    'git-4-1-ban-do-hoan-tac': { yt: 'Dr1EjJFX86E', credit: '' },   // Git Reset vs Revert vs Rebase - Fix Your Mistakes the Right Way
    'git-4-2-reset': { yt: 'shOiK07whWQ', credit: '' },             // UNDO GIT COMMITS | git reset (soft, mixed, hard) | git revert | git reflog
    'git-4-3-revert': { yt: 'BHfI9BMiK3E', credit: '' },            // Git Tutorial for beginners 04 : undo (amend, cherry-pick, reset, reflog, revert)
    'git-4-4-reflog': { yt: 'RN1emSoGvBI', credit: '' },            // Git Reflog: Recover Lost Commits & Undo Mistakes Like a Pro!
    'git-4-5-stash': { yt: 'fXGug4itlTk', credit: '' },             // Git Tutorial #15: How to Use Git Stash, Apply, and Pop | GitKraken

    /* ── Chương 5 — Remote & GitHub ── */
    'git-5-1-remote-fetch-pull': { yt: 'RfRhxydSfiA', credit: '' }, // 'Git Pull' vs. 'Git Fetch': Key Differences Explained
    'git-5-2-xac-thuc': { yt: 'kHkQnuYzwoo', credit: '' },          // Using Personal Access Tokens with GIT and GitHub
    'git-5-3-push': { yt: 'wBc0WcyTtOA', credit: '' },              // Git Set Upstream Example | Learn Branch Management in Git
    'git-5-4-fork-upstream': { yt: 'rONHQLNoPZU', credit: '' },     // How to Contribute to Open Source Repositories using Git Fork

    /* ── Chương 6 — Pull request & duyệt mã ── */
    'git-6-1-giai-phau-pr': { yt: 'oxEbx6Xcb5s', credit: '' },      // GitHub Workflow Explained | Pull Requests, Code Reviews & Team Collaboration
    'git-6-2-review': { yt: 'LheeJPkdCu8', credit: '' },            // How to Review a Pull Request Like a Senior Developer
    'git-6-3-chien-luoc-merge': { yt: '0chZFIZLR_0', credit: '' },  // Git MERGE vs REBASE: Everything You Need to Know
    'git-6-4-bao-ve-nhanh': { yt: 'HWRzJKO7C0o', credit: '' },      // How to Add Branch Rules, CodeOwners, Pull Request Templates | Git & Source Control #11

    /* ── Chương 7 — Quy trình nhóm, tag & phát hành ── */
    'git-7-1-chien-luoc-nhanh': { yt: '-7WyApPXH-w', credit: '' },     // Branching Strategies (Gitflow, Trunk-based Development, Github Flow)
    'git-7-2-tag-semver': { yt: 'DMP0SPnNxEY', credit: '' },           // HOW TO MANAGE RELEASES USING GIT TAGS AND SEMANTIC VERSIONING
    'git-7-3-phat-hanh-changelog': { yt: 'BbdFfvZNWNw', credit: '' },  // How to Version and Changelog your projects automatically to GitHub using Release It

    /* ── Chương 8 — Viết lại lịch sử một cách an toàn ── */
    'git-8-1-amend': { yt: '2oL9BHbf14A', credit: '' },             // Git Tutorial Part 6 - Fixing mistakes in Git (git reset, amend, reflog, cherry pick, force push)
    'git-8-2-force-with-lease': { yt: 'CDnYNTrFKdY', credit: '' },  // Git Masterclass - 22 - push with force vs force-with-lease
    'git-8-3-go-bi-mat': { yt: 'eoF2p3ZDiAc', credit: '' },         // [Git_Filter_Repo] Use Git-Filter-Repo to remove secrets from the repository and history!

    /* ── Chương 9 — Bên trong: kho đối tượng ── */
    'git-9-1-thu-muc-git': { yt: 'bSA91XTzeuA', credit: '' },       // Inside the Hidden Git Folder - Computerphile
    'git-9-2-bon-doi-tuong': { yt: '1eHwkyOmb-4', credit: '' },     // Git Internals: Demystifying Git Objects (Blobs, Trees, Commits, Tags)
    'git-9-3-packfile-gc': { yt: 'uxUmgN0KxkY', credit: '' },       // Git Garbage Collection Visualized #VisualGit

    /* ── Chương 10 — Kho lớn & quy trình nâng cao ── */
    'git-10-1-worktree': { yt: 'Vf_0QpLsFRs', credit: '' },         // Git Worktrees Tutorial #1 - What are Git Worktrees?
    'git-10-2-submodule-subtree': { yt: 'gSlXo2iLBro', credit: '' },// Git Submodules Tutorial | For Beginners
    'git-10-3-monorepo-lfs': { yt: 'jOVWHIDvpe8', credit: '' },     // Optimize checkout and clone time for GitHub monorepos using sparse-checkout and filter commands

    /* ── Chương 11 — Nền tảng GitHub ── */
    'git-11-1-issue-projects-gh': { yt: 'TJdiBpyrmXc', credit: '' },// Use the GitHub CLI to manage your issues & projects
    'git-11-2-actions': { yt: 'nK7PZOrPqkA', credit: '' },          // GitHub Actions YAML Tutorial for Beginners (Workflow Syntax Explained)

    /* ── Chương 12 — Hook, ký commit & tự động hoá ── */
    'git-12-1-hooks': { yt: 'eEhAX_Cn5A8', credit: '' },            // Husky: get feedback NOW with Git Pre-commit Hooks
    'git-12-2-ky-commit': { yt: 'UBldRx-qtEo', credit: '' },        // How to Configure GPG Key for GitHub | Verify Git Commits with GPG Signature

    /* ── Chương 13 — Cứu hộ & Git trong quy trình thật ── */
    'git-13-1-cuu-ho': { yt: 'lX9hsdsAeTk', credit: '' },           // How to Undo Mistakes With Git Using the Command Line
    'git-13-2-quy-trinh-that': { yt: 'GQQqf-C2ha4', credit: '' },   // 3 Git Workflows Every Developer Should Know (And When to Use Each)
  },
};
