/**
 * ============================================================
 * TỪ ĐIỂN Việt → Anh cho GIAO DIỆN APP
 * ============================================================
 *
 * Khoá là chính câu tiếng Việt trong mã. Lý do chọn thế: xem đầu `index.ts`.
 *
 * ─── ⛔ CHỈ DỊCH CHỮ CỦA APP ───
 * KHÔNG đưa vào đây:
 *  • Nội dung tải từ web (tên bài học, tên khoá, bài viết, tin nhắn) — nó là
 *    dữ liệu của người dùng và của máy chủ, dịch nó là bịa lại nội dung.
 *  • Chỗ SONG NGỮ cố ý (bài học Việt–Anh trong Code Lab, My Language) — cả
 *    điểm của chúng là hiện hai thứ tiếng cùng lúc.
 *  • Tên riêng và thuật ngữ đã là tiếng Anh sẵn: `AI Chat`, `Code Lab`,
 *    `Maker Lab`, `Exp Hub`, `CV Builder`, `Tech Trends`, `Pro`.
 *
 * ─── VĂN PHONG BẢN TIẾNG ANH ───
 * Người dùng đổi sang tiếng Anh để trông CHUYÊN NGHIỆP, nên bản Anh viết theo
 * lối phần mềm chuyên nghiệp: câu ngắn, viết hoa kiểu câu (`Sync now`, không
 * phải `Sync Now`), động từ ở dạng nguyên thể cho nút bấm, không dùng "please".
 *
 * Thiếu một mục thì `t()` trả lại nguyên câu tiếng Việt — lạ mắt nhưng vẫn
 * dùng được, khác hẳn một khoá lòi ra hay một ô trống.
 */
export const TU_DIEN: Record<string, string> = {
  // ── Điều hướng: nhãn các trang ──────────────────────────
  'Tổng quan': 'Dashboard',
  'Bảng tin': 'Feed',
  'Tin nhắn': 'Messages',
  'Ghi chú': 'Notes',
  'Bạn bè': 'Friends',
  'Mẫu AI': 'AI Templates',
  'Giọng nói': 'Voice',
  'Học viện': 'Academy',
  'Khoá học': 'Courses',
  'Phòng thi': 'Exam Room',
  'Ngoại ngữ': 'Languages',
  'Thuật toán': 'Algorithms',
  'Mô phỏng': 'Simulations',
  'Lộ trình': 'Roadmaps',
  'Phỏng vấn': 'Interviews',
  'Xưởng nội dung': 'Creator Studio',
  'Dự án': 'Projects',
  'Kho mã': 'Repositories',
  'Nhạc': 'Music',
  'Trò chơi': 'Games',
  'Tài chính': 'Finance',
  'Diễn đàn': 'Forum',
  'Đã lưu': 'Saved',
  'Trang cá nhân': 'Profile',

  // ── Nhóm trong thanh bên ────────────────────────────────
  'Chính': 'Main',
  'Học tập': 'Learning',
  'Làm & sáng tạo': 'Build & create',
  'Khác': 'More',

  // ── Thanh bên ───────────────────────────────────────────
  'Thu gọn thành biểu tượng': 'Collapse to icons',
  'Ẩn hẳn thanh bên': 'Hide the sidebar',
  'Hiện lại thanh bên': 'Show the sidebar',
  'Hiện lại thanh bên  (⌘B)': 'Show the sidebar  (⌘B)',
  'Điều hướng chính': 'Main navigation',
  'Có màn hình riêng trong app': 'Has a native screen in the app',
  'Cần tài khoản Pro': 'Requires a Pro account',
  'Thu gọn': 'Collapse',

  // ── Thanh trạng thái ────────────────────────────────────
  'Trực tuyến': 'Online',
  'Ngoại tuyến': 'Offline',
  'Đồng bộ ngay': 'Sync now',
  'Đã đồng bộ': 'Synced',
  'Thu nhỏ': 'Zoom out',
  'Phóng to': 'Zoom in',

  // ── Thanh tiêu đề & bảng lệnh ───────────────────────────
  'Cài đặt': 'Settings',
  'Giới thiệu': 'About',
  'Mở bảng lệnh': 'Open the command palette',
  'Tìm kiếm hoặc chạy lệnh': 'Search or run a command',
  'Mở': 'Open',
  'Ứng dụng': 'Application',
  'Mở trang hiện tại trên web': 'Open this page on the web',
  'Trình duyệt': 'Browser',
  'Tải lại ứng dụng': 'Reload the app',
  'Bảng lệnh': 'Command palette',
  'Tìm trang hoặc lệnh…': 'Search pages or commands…',
  'Tìm trang hoặc lệnh': 'Search pages or commands',
  'Kết quả': 'Results',
  'Không có kết quả nào.': 'No results.',
  'Tài khoản': 'Account',

  // ── Trang Cài đặt ───────────────────────────────────────
  'Giao diện': 'Appearance',
  'Chủ đề': 'Theme',
  'Sáng': 'Light',
  'Tối': 'Dark',
  'Theo hệ thống': 'Match system',
  'Ngôn ngữ': 'Language',
  'Tiếng Việt': 'Vietnamese',
  'Tiếng Anh': 'English',
  'Chữ trong app đổi ngay, không cần khởi động lại. Nội dung tải từ web (bài học, bài viết, tin nhắn) giữ nguyên ngôn ngữ gốc.':
    'The app’s own text changes immediately — no restart needed. Content loaded from the web (lessons, posts, messages) keeps its original language.',
  '“Theo hệ thống” sẽ đổi theo cài đặt sáng/tối của máy.':
    '“Match system” follows your computer’s light/dark setting.',
  'Trợ lý Odin': 'Odin assistant',
  'Hiển thị bảng trợ lý ở cạnh phải. Tắt đi thì app vẫn dùng bình thường.':
    'Show the assistant panel on the right. Turning it off changes nothing else.',
  'Dung lượng': 'Storage',
  'Cache HTTP (ảnh, tệp tĩnh)': 'HTTP cache (images, static files)',
  'Dữ liệu ứng dụng đã dùng': 'App data used',
  'Hạn mức trình duyệt cấp': 'Browser quota',
  'Đang xoá…': 'Clearing…',
  'Xoá cache HTTP': 'Clear HTTP cache',
  'Chỉ xoá ảnh và tệp tĩnh đã tải. **Không** đụng tới nháp hay dữ liệu ngoại tuyến của bạn.':
    'Only clears downloaded images and static files. It does **not** touch your drafts or offline data.',
  'Không': 'None',

  // ── Robot ───────────────────────────────────────────────
  'Mở AI Chat': 'Open AI Chat',
  'Cỡ': 'Size',
  'Tự dính mép màn hình': 'Snap to screen edge',
  'Tắt robot nổi': 'Turn off the floating robot',
  'Tắt robot trong app': 'Turn off the in-app robot',

  // ── AI Code: chế độ quyền ───────────────────────────────
  'Kế hoạch': 'Plan only',
  'Chỉ đọc. Agent trình bày cách làm, không đụng file, không chạy lệnh.':
    'Read-only. The agent explains its approach — no file changes, no commands.',
  'Hỏi từng việc': 'Ask every time',
  'Sửa file và chạy lệnh được, nhưng mỗi việc đều hiện ra để bạn duyệt.':
    'Can edit files and run commands, but every action is shown for your approval.',
  'Tự nhận sửa file': 'Auto-approve edits',
  'Sửa file khỏi hỏi. Lệnh thì vẫn hỏi từng cái.':
    'Edits files without asking. Commands are still approved one by one.',
  'Tự nhận cả lệnh an toàn': 'Auto-approve edits & safe commands',
  'Sửa file và lệnh thường khỏi hỏi. Lệnh nguy hiểm VẪN hỏi.':
    'Edits and ordinary commands run without asking. Dangerous commands STILL ask.',
  'Bỏ qua tất cả': 'Skip all approvals',
  'KHÔNG hỏi gì hết, kể cả lệnh nguy hiểm. Đọc cảnh báo trước khi bật.':
    'Asks NOTHING, dangerous commands included. Read the warning before turning it on.',
  '(đang chạy dở, dừng lại mới đổi được)': '(a task is running — stop it to change this)',
  'Đang là mặc định khi mở dự án': 'Default for new projects',
  'Đặt làm mặc định khi mở dự án': 'Make this the default for new projects',
  'Lệnh bị xếp **nguy hiểm** vẫn hỏi ở mọi chế độ — trừ **Bỏ qua tất cả**.':
    'Commands flagged **dangerous** are always confirmed — except under **Skip all approvals**.',

  // ── Cửa cảnh báo "Bỏ qua tất cả" ────────────────────────
  'Bỏ qua tất cả — cảnh báo': 'Skip all approvals — warning',
  'Bỏ qua tất cả — đọc trước khi bật': 'Skip all approvals — read this first',
  'Agent sẽ tự làm mọi việc, **không hiện thẻ duyệt nào nữa**:':
    'The agent will act on its own, **with no approval prompts at all**:',
  'Chạy **mọi lệnh**, kể cả loại bị xếp nguy hiểm — `rm -rf`, `git push --force`, `npm publish`, cài gói, đổi cấu hình máy.':
    'Runs **any command**, including ones flagged dangerous — `rm -rf`, `git push --force`, `npm publish`, installing packages, changing your machine’s configuration.',
  'Đọc được `.env` của bạn — khoá API, mật khẩu cơ sở dữ liệu — và có thể gửi chúng ra ngoài bằng một lệnh mạng.':
    'Can read your `.env` — API keys, database passwords — and could send them out over the network with a single command.',
  'Sửa, xoá, đổi tên file khỏi hỏi. **Hoàn tác chỉ lùi được file, không lùi được lệnh đã chạy.**':
    'Edits, deletes and renames files without asking. **Undo restores files only — it cannot undo a command that already ran.**',
  'Tải file từ web về máy, kể cả file chạy được.':
    'Downloads files from the web onto your machine, executables included.',
  'Chỉ bật khi bạn đang ngồi xem màn hình. Đổi dự án hoặc mở việc khác là nó **tự tắt**; muốn tắt ngay thì chọn lại một chế độ khác.':
    'Only turn this on while you are watching the screen. It **switches itself off** when you change project or open another task; to stop it now, pick a different mode.',
  'Huỷ': 'Cancel',
  'Tôi đã đọc — bật bỏ qua tất cả': 'I’ve read this — skip all approvals',

  // ══ AI Chat / AI Code ══════════════════════════════════
  'Trợ lý AI': 'AI assistant',
  'Chế độ trợ lý': 'Assistant mode',
  'Trò chuyện': 'Chat',
  'Lập trình': 'Code',
  'Hỏi gì cũng được': 'Ask anything',
  'Nhắn cho trợ lý…  (dán hoặc kéo thả ảnh, PDF, Word)':
    'Message the assistant…  (paste or drop images, PDFs, Word files)',
  'Gửi': 'Send',
  'Dừng': 'Stop',
  'Dừng — giết hẳn tiến trình': 'Stop — kill the process outright',
  'Làm tiếp': 'Continue',
  'Thử lại': 'Try again',
  'Nạp lại': 'Reload',
  'Tạo': 'Create',
  'Tất cả': 'All',
  'Lùi': 'Back',
  'Tới': 'Forward',
  'Đóng': 'Close',
  'Đóng bảng': 'Close the panel',
  'Về danh sách': 'Back to the list',
  'Chép': 'Copy',
  'Chép câu này': 'Copy this message',
  'Đang tải…': 'Loading…',
  'Đang vẽ sơ đồ…': 'Drawing the diagram…',
  'Đang kiểm tra quyền…': 'Checking your access…',
  'Đang mở việc…': 'Opening the task…',
  'Ẩn thanh bên': 'Hide the side panel',

  // ── Việc & lịch sử ──────────────────────────────────────
  'Việc mới': 'New task',
  'Mở việc mới': 'Open a new task',
  'Việc đang mở': 'Open tasks',
  'Việc đã lưu': 'Saved tasks',
  'Cuộc mới': 'New chat',
  'Cuộc đã lưu': 'Saved chats',
  'Cuộc trò chuyện đã lưu': 'Saved conversations',
  'Bắt đầu cuộc mới': 'Start a new chat',
  'Bắt đầu việc mới (xoá hội thoại, KHÔNG hoàn lại hạn mức)':
    'Start a new task (clears the transcript — does NOT refund quota)',
  'Tìm việc cũ…': 'Search past tasks…',
  'Tìm cuộc cũ…': 'Search past chats…',
  'Chưa có việc nào được lưu.': 'No saved tasks yet.',
  'Chưa có việc nào được lưu. Mỗi việc bạn hỏi sẽ tự lưu lại sau khi agent chạy xong.':
    'No saved tasks yet. Each task is saved automatically once the agent finishes.',
  'Xoá việc này khỏi danh sách (không đụng tới mã nguồn)':
    'Remove this task from the list (your code is untouched)',
  'Xoá lịch sử hiển thị': 'Clear the visible transcript',
  'Hiện lịch sử': 'Show history',
  'Hiện lịch sử trò chuyện': 'Show chat history',
  'Xuống cuối hội thoại': 'Jump to the end',
  'Xếp cuộc này vào thư mục': 'Move this chat into a folder',
  'Kho lưu trữ': 'Archive',
  'Chưa phân loại': 'Uncategorised',
  '— chưa phân loại —': '— uncategorised —',
  'tên thư mục mới, ví dụ Java…': 'new folder name, e.g. Java…',
  'Hội thoại lưu trên máy bạn. Mở lại một việc thì agent nhớ tiếp từ đúng chỗ đó — nhưng **quyền đã cấp và nút Hoàn tác không khôi phục theo**.':
    'Transcripts are stored on your machine. Reopening a task lets the agent pick up exactly where it left off — but **granted permissions and Undo history do not come back with it**.',

  // ── Hàng chờ ────────────────────────────────────────────
  'Xếp hàng': 'Queue',
  'Xếp câu này vào hàng chờ — gửi ngay khi lượt hiện tại xong':
    'Queue this message — it is sent as soon as the current turn finishes',
  'sẽ gửi lần lượt khi lượt hiện tại xong': 'will be sent in order once the current turn finishes',
  'Bỏ khỏi hàng chờ': 'Remove from the queue',

  // ── Duyệt quyền ─────────────────────────────────────────
  'Agent muốn chạy lệnh': 'The agent wants to run a command',
  'Agent muốn gọi tool của server ngoài': 'The agent wants to call an external server’s tool',
  'Cho phép': 'Allow',
  'Cho phép lần này': 'Allow once',
  'Cho phép cả file này': 'Allow this whole file',
  'Luôn cho phép': 'Always allow',
  'Luôn cho phép lệnh này': 'Always allow this command',
  'Từ chối': 'Deny',
  'Đừng hỏi lại trong cuộc này': 'Don’t ask again during this task',
  'Nhớ cho dự án này, kể cả lần sau mở lại app. Gõ /quyen để xem và thu hồi.':
    'Remembered for this project, including after you restart the app. Type /quyen to review or revoke.',
  'Nguy hiểm:': 'Dangerous:',
  'Nguồn': 'Source',
  '**Việc này đi RA NGOÀI.** Nhánh sẽ nằm trên origin và PR sẽ hiện cho người khác cùng repo — họ nhận thông báo ngay. Không có nút hoàn tác.':
    '**This leaves your machine.** The branch lands on origin and the PR becomes visible to everyone on the repo — they are notified straight away. There is no undo.',
  '**Toàn bộ nội dung cũ sẽ bị thay.** Đây là ghi chú thật của bạn, không phải file trong dự án — lấy lại được ở lịch sử phiên bản của Ghi chú, nhưng không có nút hoàn tác ở đây.':
    '**The existing content will be replaced entirely.** This is a real note of yours, not a project file — it can be recovered from the Notes version history, but there is no undo here.',
  'Thay đổi quá lớn để so từng dòng — bảng dưới hiện nguyên cả hai bản.':
    'Too large to diff line by line — both versions are shown in full below.',

  // ── Chân màn hình: chế độ đang bật ──────────────────────
  'Đang **chỉ đọc** — chưa sửa file, chưa chạy lệnh. Không đọc `.env` và các file khoá.':
    'Currently **read-only** — no file changes, no commands. `.env` and other secret files are off limits.',
  'Agent **sửa file và chạy lệnh** — mỗi việc đều phải bạn duyệt. Lệnh shell **đọc được cả** `.env`, hãy đọc kỹ trước khi duyệt.':
    'The agent **edits files and runs commands** — every action needs your approval. Shell commands **can read** `.env`, so read each one before approving.',
  'Agent **tự sửa file, không hỏi**. Lệnh vẫn hỏi từng cái. Dùng nút Hoàn tác nếu nó sửa nhầm.':
    'The agent **edits files without asking**. Commands are still approved one by one. Use Undo if it edits the wrong thing.',
  'Agent **tự sửa file và tự chạy lệnh thường**, không hỏi. Chỉ lệnh bị xếp **nguy hiểm** mới dừng lại hỏi bạn.':
    'The agent **edits files and runs ordinary commands** without asking. Only commands flagged **dangerous** stop to ask you.',

  // ── Thư mục dự án, worktree, MCP, hook ──────────────────
  'File trong dự án': 'Files in the project',
  'Agent chỉ đọc được thư mục bạn tự chọn — không đọc chỗ nào khác trên máy.':
    'The agent can only read the folder you picked — nowhere else on your machine.',
  'Thôi cho đọc thư mục này': 'Stop giving access to this folder',
  'Tách nhánh': 'Branch off',
  'tên nhánh mới…': 'new branch name…',
  'Thư mục này không phải kho git, nên chưa dùng worktree được.':
    'This folder is not a git repository, so worktrees are not available yet.',
  'Nhánh mới mang tiền tố `agent/`. Xoá worktree KHÔNG xoá nhánh, và không xoá ép khi còn thay đổi chưa commit.':
    'New branches are prefixed `agent/`. Removing a worktree does NOT delete the branch, and it will not force-remove one with uncommitted changes.',
  'dự án': 'project',
  'chính': 'primary',
  'đang mở': 'open',
  'đang chạy': 'running',
  '.mcp.json trong dự án': '.mcp.json inside the project',
  'Dự án này khai server MCP trong `.mcp.json`. Bật lên nghĩa là **repo được chạy lệnh trên máy bạn**, với biến môi trường của bạn. Chỉ duyệt nếu bạn tin nguồn của nó.':
    'This project declares MCP servers in `.mcp.json`. Enabling them means **the repo gets to run commands on your machine**, with your environment variables. Only approve it if you trust where it came from.',
  'Nó chạy trên máy bạn và có thể làm bất cứ điều gì server đó lập trình sẵn.':
    'It runs on your machine and can do whatever that server was built to do.',
  'Chỉ duyệt nếu bạn tin nguồn của nó.': 'Only approve it if you trust the source.',
  'Tôi tin dự án này — bật': 'I trust this project — enable it',
  'Mở file cấu hình': 'Open the config file',
  'Hook và kỹ năng của dự án': 'Project hooks & skills',
  'Hook không có `khop` sẽ chạy sau **mọi** tool, kể cả `read_file`. Luôn đặt `khop`.':
    'A hook with no `khop` runs after **every** tool, `read_file` included. Always set `khop`.',
  'Dự án này khai **{n}** hook trong `.claude/settings.json`. Chúng chạy **tự động ở mọi lời gọi tool**, không hỏi lại. Đây là những lệnh sẽ chạy trên máy bạn:':
    'This project declares **{n}** hooks in `.claude/settings.json`. They run **automatically on every tool call**, without asking again. These are the commands that will run on your machine:',
  'Chưa có hook nào chạy trong phiên này.': 'No hooks have run in this session.',
  'Lần chạy gần đây': 'Recent runs',
  'đạt, không in gì': 'passed, no output',
  'Tên tool để thử khớp': 'Tool name to test the match against',
  'tên tool giả, vd edit_file': 'a sample tool name, e.g. edit_file',
  'Kỹ năng model đang thấy': 'Skills the model can see',
  '.claude/skills/&lt;tên&gt;/SKILL.md': '.claude/skills/&lt;name&gt;/SKILL.md',

  // ── Bảng lệnh, trình duyệt, đính kèm ────────────────────
  'Bảng chạy lệnh': 'Command runner',
  'Chạy lệnh trong thư mục dự án — npm test, git status… (không phải terminal đầy đủ)':
    'Run commands in the project folder — npm test, git status… (not a full terminal)',
  'Không tốn lượt agent nào. Chạy thật trong thư mục dự án.':
    'Uses none of your agent quota. Runs for real inside the project folder.',
  'Kéo để đổi chiều cao bảng lệnh': 'Drag to resize the command panel',
  'Kéo để đổi bề rộng · bấm đúp để về mặc định': 'Drag to resize · double-click to reset',
  'Lệnh': 'Command',
  'Chạy': 'Run',
  'Chạy thử': 'Dry run',
  'Chạy trong hộp cát Python (WebAssembly) — không đụng tới máy bạn':
    'Runs in a Python sandbox (WebAssembly) — your machine is untouched',
  'Đóng khung trình duyệt': 'Close the browser panel',
  'Đóng việc này': 'Close this task',
  'Mở bằng trình duyệt máy': 'Open in your system browser',
  'Mở bằng trình duyệt hệ thống': 'Open in your system browser',
  'Xoá địa chỉ': 'Clear the address',
  'localhost:3000 hoặc https://…': 'localhost:3000 or https://…',
  'Đính kèm file': 'Attach a file',
  'Đính kèm file — ảnh, PDF, log, gì cũng được': 'Attach a file — images, PDFs, logs, anything',
  'Bỏ ảnh này': 'Remove this image',
  'Trả mọi file agent đã sửa trong việc này về nguyên trạng':
    'Restore every file the agent changed in this task',

  // ── Model, mức nỗ lực, Pro ──────────────────────────────
  'Model và mức nỗ lực': 'Model & effort',
  'Bậc model': 'Model tier',
  'Mức nỗ lực': 'Effort',
  'Mức càng cao càng tốn hạn mức 5 giờ. Ultracode có thể dùng hết hạn mức':
    'Higher effort burns more of your 5-hour quota. Ultracode can use it up entirely',
  'Chế độ Lập trình dành cho tài khoản Pro': 'Code mode is for Pro accounts',
  'Agent mở dự án trên máy bạn, đọc mã, tra cứu ghi chú của bạn và trả lời kèm trích dẫn tới đúng dòng. Chế độ Trò chuyện vẫn dùng bình thường.':
    'The agent opens a project on your machine, reads the code, searches your notes, and answers with citations down to the exact line. Chat mode keeps working as usual.',
  'Xem gói Pro': 'See Pro plans',
  'Chưa kết nối được máy chủ': 'Can’t reach the server',
  'Chế độ Lập trình cần mạng để kiểm tra quyền và hạn mức.':
    'Code mode needs a connection to check your access and quota.',
  'Chế độ Lập trình cần khoá AI ở máy chủ. Hãy thử lại sau.':
    'Code mode needs an AI key on the server. Please try again later.',
  'Máy chủ chưa bật AI': 'AI is not enabled on the server',
  'Kế hoạch còn {n} việc chưa xong mà agent đã dừng.':
    'The agent stopped with {n} plan items still unfinished.',

  // ── Giọng nói ───────────────────────────────────────────
  'Giữ để nói với trợ lý': 'Hold to talk to the assistant',
  'Nói chuyện với trợ lý': 'Talk to the assistant',
  'Mở màn nói chuyện': 'Open the voice screen',
  'Nói chuyện — rảnh tay, tự nghe tiếp sau mỗi câu':
    'Voice mode — hands free, it keeps listening after each reply',
  'Cổng AI đang chậm chứ app không treo — bấm Dừng nếu muốn thử lại.':
    'The AI gateway is slow — the app is not frozen. Press Stop if you want to retry.',

  // ── Gợi ý câu hỏi mẫu ───────────────────────────────────
  'Giải thích cho tôi luồng xác thực trong dự án này.':
    'Walk me through the authentication flow in this project.',
  'Hàm xử lý thanh toán nằm ở đâu, và nó gọi những gì?':
    'Where does payment handling live, and what does it call?',
  'Tôi đang sửa dở gì? Tóm tắt các thay đổi chưa commit.':
    'What am I in the middle of? Summarise my uncommitted changes.',
  'Trong ghi chú của tôi có kế hoạch nào cho dự án này không?':
    'Do my notes contain any plan for this project?',

  // ── Bảng gợi ý ──────────────────────────────────────────
  '↑↓ chọn · Enter hoặc Tab để chèn · Esc để bỏ':
    '↑↓ to select · Enter or Tab to insert · Esc to dismiss',
  '↑↓ chọn · Enter hoặc Tab để dùng · Esc để bỏ':
    '↑↓ to select · Enter or Tab to use · Esc to dismiss',

  // ══ Tổng quan ══════════════════════════════════════════
  'Lịch học tuần này': 'This week’s timetable',
  'Bấm vào buổi để chấm điểm danh': 'Click a session to mark attendance',
  'Một ngày của bạn': 'Your day',
  'việc hôm nay': 'tasks today',
  'tin nhắn chưa đọc': 'unread messages',
  'thông báo mới': 'new notifications',
  'tổng EXP': 'total XP',
  'cấp': 'level',
  'Chưa có gì ở đây. Gõ vào ô trên để thêm việc đầu tiên':
    'Nothing here yet. Type above to add your first task',
  'Thêm một bước nhỏ…': 'Add a small step…',
  'Ghi chú cho việc này — bối cảnh, các bước, đường dẫn…':
    'Notes for this task — context, steps, links…',
  'Ghi chú, hạn, nhắc': 'Notes, due date, reminder',
  'Ghi chú và cài đặt': 'Notes & settings',
  'Nhắc': 'Remind',
  'Xoá việc': 'Delete task',
  'Xoá': 'Delete',
  'Xoá hết': 'Clear all',
  'Bấm để sửa': 'Click to edit',
  'Phạm vi kế hoạch': 'Plan scope',
  'Bắt đầu': 'Start',
  'Kết thúc': 'End',
  'Làm mới': 'Refresh',
  'Bật': 'On',
  'Tắt': 'Off',

  // ── Thời khoá biểu ──────────────────────────────────────
  'Thời khoá biểu': 'Timetable',
  'Soạn thời khoá biểu': 'Edit timetable',
  'Sửa buổi học': 'Edit session',
  'Chưa có thời khoá biểu': 'No timetable yet',
  'Thêm buổi học để thấy lịch tuần, nhắc trước giờ và đếm buổi nghỉ.':
    'Add sessions to see your week, get reminders before class, and track absences.',
  'Mở FAP → bôi đen cả bảng thời khoá biểu → sao chép → dán vào đây.':
    'Open FAP → select the whole timetable → copy → paste it here.',
  'Đọc xong bạn xem lại từng dòng bên dưới rồi mới lưu.':
    'Review every row below before saving.',
  'Môn': 'Subject',
  'Mã lớp': 'Class code',
  'Mã bài': 'Slot code',
  'Phòng': 'Room',
  'Thứ': 'Day',
  'Có mặt': 'Present',
  'Có phép': 'Excused',
  'Vắng': 'Absent',
  'Bỏ chấm': 'Clear mark',
  'Bỏ trống giờ này': 'Leave this slot empty',

  // ══ Nhạc ═══════════════════════════════════════════════
  'Thư viện': 'Library',
  'Thư viện của bạn': 'Your library',
  'Khu vực nhạc': 'Music area',
  'Tìm bài hát': 'Search for a song',
  'Tìm trong thư viện hoặc trên YouTube…': 'Search your library or YouTube…',
  'Kết quả trên YouTube': 'YouTube results',
  'Trên YouTube': 'On YouTube',
  'Bài lấy từ YouTube — rút âm thanh về máy chủ để nghe được trong app':
    'Taken from YouTube — the audio is extracted on the server so it plays inside the app',
  '— thêm vào thư viện là nghe được như mọi bài khác':
    '— add it to your library and it plays like any other track',
  'Thêm vào thư viện và phát': 'Add to library and play',
  'Chưa có bài hát nào. Gõ tên bài vào ô tìm để lấy từ YouTube.':
    'No songs yet. Type a title in the search box to pull one from YouTube.',
  'Tên bài': 'Title',
  'Nghệ sĩ': 'Artist',
  'Thời lượng': 'Duration',
  'Đã có trên máy': 'Already downloaded',
  'đã tải': 'downloaded',
  'chưa tải': 'not downloaded',
  'đã tải về máy này': 'downloaded to this machine',
  'Xoá bản đã tải': 'Delete the downloaded copy',
  'Xoá hẳn khỏi thư viện (chỉ admin)': 'Remove from the library permanently (admin only)',

  // ── Trình phát ──────────────────────────────────────────
  'Đang phát': 'Now playing',
  'đang phát': 'playing',
  'ĐANG PHÁT': 'NOW PLAYING',
  'Bài trước': 'Previous track',
  'Bài sau': 'Next track',
  'Về đầu bài': 'Back to start',
  'Tua bài hát': 'Seek',
  'Đi nhanh': 'Skip',
  'Âm lượng': 'Volume',
  'Lặp': 'Repeat',
  'Phát ngẫu nhiên': 'Shuffle',
  'Điều khiển phát nhạc': 'Playback controls',
  'Điều khiển phát nhạc (đã thu gọn)': 'Playback controls (collapsed)',
  'Mở rộng thanh phát': 'Expand the player',
  'Thu gọn thanh phát': 'Collapse the player',
  'Thu gọn — nhạc vẫn phát bình thường': 'Collapse — playback continues as normal',
  'Đang tải lời…': 'Loading lyrics…',
  'Tắt nhạc sau': 'Stop playing in',
  'Hết bài này': 'After this track',

  // ── Playlist ────────────────────────────────────────────
  'Tạo playlist': 'Create playlist',
  'Tên playlist mới': 'New playlist name',
  'Tên playlist…': 'Playlist name…',
  'danh sách của riêng bạn': 'your own list',
  'Bỏ khỏi playlist': 'Remove from playlist',
  'Chưa có playlist nào. Tạo một cái ở trang Nhạc.':
    'No playlists yet. Create one on the Music page.',
  'Playlist này chưa có bài nào. Mở một bài rồi bấm “Thêm vào playlist” ở màn hình đang phát.':
    'This playlist is empty. Open a track and use “Add to playlist” on the now-playing screen.',

  // ── Bàn DJ ──────────────────────────────────────────────
  'Bàn DJ': 'DJ deck',
  'Crossfader giữa mâm A và mâm B': 'Crossfader between deck A and deck B',
  'TỐC ĐỘ': 'TEMPO',
  'LỌC': 'FILTER',
  'NHẠC THƯỜNG': 'NORMAL PLAYBACK',
  'ĐÈN CHẠY THEO NHẠC THẬT': 'LIGHTS DRIVEN BY THE REAL AUDIO',
  'Nhạc ở bàn DJ được tải nguyên bài về bộ nhớ rồi mới phát, nên đổi tốc độ và lọc không làm méo tiếng. Bài dài có thể mất vài giây để nạp.':
    'DJ-deck tracks are loaded fully into memory before playing, so tempo changes and filters do not distort the sound. Long tracks can take a few seconds to load.',

  // ══ Trợ lý Odin ════════════════════════════════════════
  'Giữ để nói với Odin': 'Hold to talk to Odin',
  'Giữ để nói (hoặc giữ phím ` )': 'Hold to talk (or hold the ` key)',
  'Bấm để đọc đầy đủ trong AI Chat': 'Open the full reply in AI Chat',
  'Bấm để đọc đầy đủ →': 'Read the full reply →',
  'Ngắt lời bằng giọng': 'Interrupt by speaking',
  'Trong màn nói chuyện, cứ nói chen vào là trợ lý im ngay — không phải chạm. Dùng **tai nghe** thì chính xác nhất; loa ngoài mở to có thể rò tiếng vào micro làm nó tự ngắt lời chính mình, khi đó hãy tắt mục này.':
    'On the voice screen, simply speaking cuts the assistant off — no tapping needed. **Headphones** work best; loud speakers can leak into the mic and make it interrupt itself, in which case turn this off.',
  'Đọc câu trả lời thành tiếng': 'Read replies aloud',
  'Tốc độ đọc': 'Speech rate',
  'Áp cho mọi giọng, đổi là ăn ngay — không phải đọc lại. Giữ cao độ nên chậm lại không thành giọng trầm đục.':
    'Applies to every voice and takes effect immediately — no need to re-read. Pitch is preserved, so slowing down does not turn the voice into a low mumble.',
  'Đang lấy danh sách giọng từ máy chủ…': 'Fetching the voice list from the server…',
  'Máy chủ chưa có giọng nào cho ngôn ngữ này.': 'The server has no voices for this language.',
  '— giọng mặc định của máy chủ —': '— the server’s default voice —',
  'Nhỏ hơn': 'Smaller',
  'To hơn': 'Bigger',
  'Đang mở Ghi chú…': 'Opening Notes…',
  'Đang nạp…': 'Loading…',
  '— chọn bài —': '— pick a track —',
  '— chọn —': '— pick one —',

  // ══ Tin nhắn · Bảng tin · Bạn bè · Pro ═════════════════
  'Chưa có cuộc trò chuyện nào.': 'No conversations yet.',
  'Chọn một cuộc trò chuyện để bắt đầu.': 'Pick a conversation to get started.',
  'Chưa có tin nhắn. Gõ câu đầu tiên bên dưới.': 'No messages yet. Type the first one below.',
  'Nhắn tin…': 'Write a message…',
  'Thu hồi': 'Unsend',
  'Tin nhắn đã được thu hồi': 'Message unsent',
  'Gọi thoại': 'Voice call',
  'Nhận cuộc gọi': 'Answer',
  'Cúp máy': 'Hang up',
  'Đang chờ': 'Waiting',
  '· đang online': '· online',

  'Bạn đang nghĩ gì?': 'What’s on your mind?',
  'Tuỳ chọn bài viết': 'Post options',
  'Viết bình luận…': 'Write a comment…',
  'Nội dung bình luận': 'Comment text',
  'Chưa có bình luận nào.': 'No comments yet.',
  'Đang tải bình luận…': 'Loading comments…',
  'Trả lời': 'Reply',
  'Đã sao chép liên kết': 'Link copied',
  'Xem ảnh': 'View image',
  'Ảnh trước': 'Previous image',
  'Ảnh sau': 'Next image',
  'Xu hướng hôm nay': 'Trending today',
  'Gợi ý theo dõi': 'Suggested follows',
  'Bài mới từ cuongthai.com': 'New from cuongthai.com',
  'Bài liên quan': 'Related posts',
  'Xem trên YouTube': 'Watch on YouTube',
  'Vlog, reaction, podcast và hướng dẫn — có bình luận và lượt thích.':
    'Vlogs, reactions, podcasts and how-tos — with comments and likes.',
  'Theo dõi và nhắn tin thì mở trên web': 'Following and messaging happen on the web',
  'Lọc theo loại': 'Filter by type',
  'Lọc theo series': 'Filter by series',
  'Loại nội dung': 'Content type',
  'Bỏ hết bộ lọc': 'Clear all filters',
  'Sắp xếp': 'Sort',
  'Mốc thời gian': 'Timeline',
  'Tìm bài': 'Search posts',
  'Tìm theo tiêu đề, tóm tắt hoặc thẻ…': 'Search by title, summary or tag…',
  'Chi tiết': 'Details',
  'Trước': 'Previous',
  'Quay lại': 'Back',
  'Đang tìm…': 'Searching…',

  'Tìm bạn': 'Find friends',
  'Tìm theo tên hoặc tên đăng nhập…': 'Search by name or username…',
  'Chưa có người bạn nào. Sang tab **Tìm bạn** để bắt đầu.':
    'No friends yet. Head to the **Find friends** tab to get started.',
  'Bạn chưa gửi lời mời nào.': 'You haven’t sent any requests.',
  'Không có lời mời nào đang chờ.': 'No pending requests.',
  'Chưa có gợi ý nào.': 'No suggestions yet.',
  'Gợi ý cho bạn': 'Suggested for you',
  'Đã gửi lời mời': 'Request sent',
  'Đang chờ bạn trả lời': 'Waiting for your reply',
  'Huỷ kết bạn': 'Remove friend',

  'Tài khoản Pro': 'Pro account',
  'Cờ Pro trên tài khoản': 'Pro flag on your account',
  'Quyền lợi có hiệu lực': 'Benefits active',
  'Quyền lợi do máy chủ quyết định.': 'Benefits are decided by the server.',
  'Ngày hết hạn': 'Expires on',
  'Đang tải trạng thái Pro…': 'Loading Pro status…',
  'Không xem được trạng thái Pro': 'Can’t read your Pro status',
  'Kiểm tra lại': 'Check again',
  'Nhập mã kích hoạt và thanh toán thực hiện trên web — cả hai đều đổi quyền lợi thật nên cần kết nối ổn định.':
    'Activation codes and payments are handled on the web — both change real entitlements, so they need a stable connection.',
  'bản đã lưu': 'saved copy',

  'Không tìm thấy': 'Not found',
  'Mục bạn mở không còn tồn tại, hoặc đường dẫn đã cũ.':
    'What you opened no longer exists, or the link is out of date.',
  'Không có trang cho đường dẫn': 'No page for the path',
  'Trang gặp lỗi': 'This page hit an error',
  'File này nằm **NGOÀI thư mục dự án**. Đọc kỹ đường dẫn trước khi duyệt.':
    'This file is **OUTSIDE the project folder**. Read the path carefully before approving.',
  'Agent ĐANG lái được trình duyệt: mở trang, đọc sau khi JS chạy, xem console. Bấm/gõ vẫn phải bạn duyệt. Bấm để tắt. (Nhớ cho những việc sau.)':
    'The agent CAN drive the browser: open pages, read them after JavaScript runs, check the console. Clicks and typing still need your approval. Click to turn off. (Remembered for future tasks.)',
  'Bật cho agent MỞ TRANG WEB — YouTube, tài liệu, localhost — ngay cạnh bảng ghi, đọc nội dung sau khi JS chạy và xem lỗi console. Mọi thao tác bấm/gõ vẫn hỏi bạn. (Nhớ cho những việc sau.)':
    'Let the agent OPEN WEB PAGES — YouTube, docs, localhost — right beside the transcript, read them after JavaScript runs, and check the console. Clicks and typing still ask you first. (Remembered for future tasks.)',

  // ══ Phòng thi ══════════════════════════════════════════
  'Tìm đề thi': 'Search exams',
  'Tìm theo mã môn (PRO192), tên đề hoặc kỳ…': 'Search by subject code (PRO192), exam name or term…',
  'Lọc theo môn': 'Filter by subject',
  'Lọc theo dạng đề': 'Filter by exam type',
  'Không đề nào khớp bộ lọc đang chọn.': 'No exams match the current filters.',
  'Mã đề': 'Exam code',
  'Số câu': 'Questions',
  'Thời gian làm': 'Time limit',
  'Thang điểm': 'Marking scale',
  'Đang mở đề…': 'Opening the exam…',
  'Nộp rồi không sửa lại được.': 'Once submitted, it cannot be changed.',
  'Nộp bài bằng file .zip': 'Submit as a .zip file',
  'Nén cả thư mục bài làm rồi chọn file ở đây. Máy chủ giải nén và chấm.':
    'Zip your whole solution folder and pick the file here. The server unpacks and marks it.',
  'Ghi lại từ đầu': 'Record again',
  'Chuyển bài': 'Switch question',
  'Bài tiếp theo': 'Next question',
  'Viết bài của bạn ở đây…': 'Write your answer here…',
  'Viết mã của bạn ở đây…': 'Write your code here…',
  'Đang làm tiếp lượt thi mở dở trước đó — bài đã làm vẫn còn.':
    'Resuming your earlier attempt — everything you had done is still there.',
  'Bấm “Vào thi” là bắt đầu tính giờ ({n} phút).': 'Pressing “Start” begins the {n}-minute timer.',
  'Bấm “Vào thi” là bắt đầu tính giờ.': 'Pressing “Start” begins the timer.',
  'Bài làm được lưu xuống máy sau mỗi thao tác, nên đóng app rồi mở lại vẫn còn — và bấm “Vào thi” lần nữa sẽ NỐI LẠI lượt đang dở chứ không đốt lượt mới.':
    'Your work is saved locally after every action, so closing and reopening the app keeps it — and pressing “Start” again RESUMES the attempt in progress instead of burning a new one.',
  'Vào': 'Enter',

  // ══ Học viện · Khoá học ════════════════════════════════
  'Tìm môn học': 'Search subjects',
  'Tìm theo mã môn (LAB211) hoặc tên môn…': 'Search by subject code (LAB211) or name…',
  'Không môn nào khớp. Thử mã môn, ví dụ `PRF192`.':
    'No subjects match. Try a subject code, e.g. `PRF192`.',
  'Kỳ này chưa có môn nào được đăng.': 'No subjects have been published for this term yet.',
  'Môn này chưa có bài học nào được đăng.': 'No lessons have been published for this subject yet.',
  'Nội dung môn học': 'Subject contents',
  'Học xong bạn làm được gì': 'What you’ll be able to do',
  'Cần có trước': 'Prerequisites',
  'xem thử': 'preview',
  'Miễn phí': 'Free',
  'Tìm khoá học': 'Search courses',
  'Tìm khoá học…': 'Search courses…',
  'Lộ trình này chưa có mục nào.': 'This roadmap has no items yet.',
  'Đóng video': 'Close the video',
  'Đang phát trong app': 'Playing in the app',
  'Điểm qua': 'Overview',

  // ══ Code Lab ═══════════════════════════════════════════
  'Tìm bài tập': 'Search exercises',
  'Tìm bài tập trong toàn bộ kho…': 'Search every exercise in the library…',
  'Không bài nào khớp. Thử từ khoá ngắn hơn, ví dụ `join`.':
    'No exercises match. Try a shorter keyword, e.g. `join`.',
  'Mã khởi đầu': 'Starter code',
  'Đầu vào': 'Input',
  'Đầu ra': 'Output',
  'Ví dụ': 'Example',
  'Ràng buộc': 'Constraints',
  'Bài học và bài tập đã được kiểm bằng cách CHẠY THẬT':
    'Lessons and exercises are verified by ACTUALLY RUNNING them',
  'Đã kiểm': 'Verified',

  // ══ CV Builder ═════════════════════════════════════════
  'Hồ sơ CV': 'CV profile',
  'Hồ sơ gốc dùng để sinh các bản CV. Sửa được cả khi ngoại tuyến.':
    'The master profile your CVs are generated from. Editable offline too.',
  'Đang tải hồ sơ CV…': 'Loading your CV profile…',
  'Không mở được hồ sơ': 'Can’t open the profile',
  'Thông tin liên hệ': 'Contact details',
  'Vài dòng tóm tắt kinh nghiệm và thế mạnh của bạn…':
    'A few lines summarising your experience and strengths…',
  'Đang lưu…': 'Saving…',
  'Đã lưu trên máy': 'Saved on this device',

  // ══ Mẫu AI · Tech Trends · chung ═══════════════════════
  'Tìm mẫu': 'Search templates',
  'Loại mẫu': 'Template type',
  'Danh mục': 'Category',
  'Tác giả': 'Author',
  'Giấy phép': 'Licence',
  'Phiên bản': 'Version',
  'Nội dung tệp': 'File contents',
  'Xem trên GitHub': 'View on GitHub',
  'Mở trên web': 'Open on the web',
  'Liên kết': 'Links',
  'Nhận xét': 'Reviews',
  'Trạng thái': 'Status',
  'Thời gian': 'Time',
  'Xoá tìm kiếm': 'Clear the search',
  'Danh sách bài': 'Article list',
  'Đang tải bài…': 'Loading the article…',
  'Không tải được danh sách': 'Couldn’t load the list',
  'Danh sách là bản đã lưu.': 'Showing the saved copy of the list.',
  'Bản đã lưu trên máy.': 'Saved copy on this device.',
  'Bài đã mở được lưu lại để đọc khi không có mạng.':
    'Articles you open are saved so you can read them offline.',
  'Đọc được offline': 'Available offline',
  'Mở bản đầy đủ trên web': 'Open the full version on the web',
  'Tính năng này đã có trên **cuongthai.com** nhưng chưa được đưa vào bản desktop. Nó nằm trong kế hoạch — xem `docs/electron-implementation-plan.md`.':
    'This feature already exists on **cuongthai.com** but has not been brought into the desktop app yet. It is on the roadmap — see `docs/electron-implementation-plan.md`.',
  'Ứng dụng desktop cho cuongthai.com — nền tảng CuongHoangDev.':
    'The desktop app for cuongthai.com — the CuongHoangDev platform.',
  'Nền tảng': 'Platform',
  'Máy chủ API': 'API server',
  // ── Thanh "Odin đang…" (chuỗi do `viecDangLam` sinh) ────
  'bước {nay}/{tran}': 'step {nay}/{tran}',
  'Đang chờ bạn duyệt — Odin dừng ở đây tới khi bạn bấm.':
    'Waiting for your approval — Odin stops here until you decide.',
  'Odin đang code…': 'Odin is coding…',
  'Odin đang xem kết quả lệnh…': 'Odin is reading the command output…',
  'Odin đang đọc mã dự án…': 'Odin is reading your code…',
  'Odin đang đọc dự án…': 'Odin is reading the project…',
  'Odin đang chuẩn bị…': 'Odin is getting ready…',
  'Odin đang đọc file…': 'Odin is reading a file…',
  'Odin đang xem thư mục…': 'Odin is listing a folder…',
  'Odin đang tìm trong mã…': 'Odin is searching the code…',
  'Odin đang sửa file…': 'Odin is editing a file…',
  'Odin đang tạo file…': 'Odin is creating a file…',
  'Odin đang sửa nhiều chỗ…': 'Odin is making several edits…',
  'Odin đang xoá file…': 'Odin is deleting a file…',
  'Odin đang đổi tên file…': 'Odin is renaming a file…',
  'Odin đang chạy lệnh…': 'Odin is running a command…',
  'Odin đang xem git…': 'Odin is checking git…',
  'Odin đang xem thay đổi…': 'Odin is reviewing the changes…',
  'Odin đang mở trang…': 'Odin is opening a page…',
  'Odin đang đọc trang…': 'Odin is reading the page…',
  'Odin đang lấy danh sách liên kết…': 'Odin is collecting the links…',
  'Odin đang tải file…': 'Odin is downloading a file…',
  'Odin đang tải cả lô file…': 'Odin is downloading a batch of files…',
  'Odin đang chụp màn hình trang…': 'Odin is taking a screenshot…',
  'Odin đang đọc lỗi trang…': 'Odin is reading the page errors…',
  'Odin đang đọc trang web…': 'Odin is reading the web page…',
  'Odin đang tìm trên web…': 'Odin is searching the web…',
  'Odin agent phụ đang làm…': 'Odin’s sub-agent is working…',
  'Odin đang cập nhật kế hoạch…': 'Odin is updating the plan…',
  'Odin đang gọi công cụ ngoài…': 'Odin is calling an external tool…',
  'Odin đang chạy…': 'Odin is working…',
  // ── Thanh công cụ AI Code ───────────────────────────────
  'Trình duyệt: BẬT': 'Browser: ON',
  'Trình duyệt: tắt': 'Browser: off',
  'Khung web': 'Web panel',
  'Khung web: MỞ': 'Web panel: OPEN',
  'Đóng khung trình duyệt bên phải': 'Close the browser panel on the right',
  'Mở trình duyệt ngay cạnh bảng ghi — xem trang chạy trong lúc agent sửa mã':
    'Open the browser next to the transcript — watch your page while the agent edits code',
  'Bảng lệnh: MỞ': 'Command runner: OPEN',
  'Ghi chú: BẬT': 'Notes: ON',
  'Ghi chú: tắt': 'Notes: off',
  'Chưa chọn thư mục dự án': 'No project folder chosen',
  'Chọn thư mục dự án…': 'Choose a project folder…',
  'Chọn thư mục dự án trước đã — agent chỉ đọc được trong đó':
    'Choose a project folder first — that is the only place the agent can read',
  'Thả file hoặc thư mục vào đây — agent sẽ đọc được nó':
    'Drop a file or folder here — the agent will be able to read it',
  'Chưa có file nào để hoàn tác trong việc này.': 'No files to undo in this task.',
  'Tab này chưa mở dự án nào.': 'This tab has no project open.',
  'Không có quyền nào bị thu hồi.': 'No permissions were revoked.',

  // ── Đầu ra lệnh gạch chéo (/kynang · /quyen · /tien) ────
  '**Kho AI Templates** — 871 kỹ năng · 421 agent phụ · 286 lệnh.\n\n- Tìm: `/kynang <từ khoá>` (bỏ dấu cũng ra — `bao mat`)\n- Cài: `/kynang cai <tên>` · ghi đè: thêm `--de`\n\n_Hook và MCP không cài từ đây — chúng là lệnh sẽ chạy, và có cửa duyệt riêng._':
    '**AI Templates library** — 871 skills · 421 sub-agents · 286 commands.\n\n- Search: `/kynang <keyword>`\n- Install: `/kynang cai <name>` · overwrite: add `--de`\n\n_Hooks and MCP servers are not installed from here — they are commands that will run, and they have their own approval gate._',
  'Không có gì khớp "{tu}".': 'Nothing matches “{tu}”.',
  'Dự án `{goc}` chưa có quyền nào được "Luôn cho phép".\n\n_Nút đó nằm trên thẻ duyệt, cạnh "Cho phép"._':
    'Project `{goc}` has nothing set to “Always allow” yet.\n\n_That button is on the approval card, next to “Allow”._',
  '**{n}** thứ đang được tự duyệt ở `{goc}`:': '**{n}** things are auto-approved in `{goc}`:',
  'Thu hồi tất cả: `/quyen xoa` · thu hồi một cái: `/quyen xoa <nguyên văn>`':
    'Revoke everything: `/quyen xoa` · revoke one: `/quyen xoa <exact text>`',
  '**Chi phí việc này**': '**Cost of this task**',
  '- Đã tiêu: **~${tien}**\n': '- Spent: **~${tien}**\n',
  '- Số bước đã đi: {n}\n': '- Steps taken: {n}\n',
  '- Hạn mức 5 giờ: còn **{con}** / {tran} token\n':
    '- 5-hour quota: **{con}** of {tran} tokens left\n',
  '- File đã sửa (hoàn tác được): {n}\n\n': '- Files changed (undoable): {n}\n\n',
  '_Con số là ƯỚC LƯỢNG — cổng không công khai giá._':
    '_These figures are ESTIMATES — the gateway does not publish its prices._',
  // ── Mức dùng (Cài đặt) ──────────────────────────────────
  'Mức dùng': 'Usage',
  'Không đọc được mức dùng': 'Couldn’t read your usage',
  'Máy chủ đang chạy bản cũ hơn app nên chưa có ô này. Nó sẽ tự hiện sau lần cập nhật máy chủ kế tiếp — bạn không cần làm gì.': 'The server is running an older build than the app, so this panel isn’t there yet. It will appear on its own after the next server update — nothing for you to do.',
  'Đang đọc…': 'Reading…',
  'Đọc lại': 'Refresh',
  'Hạn mức bắt đầu hồi lại từ {gio}.': 'Your allowance starts recovering at {gio}.',
  'Ví riêng của bạn, tính trong {n} giờ vừa qua.':
    'Your own allowance, measured over the last {n} hours.',
  'Tài khoản quản trị — không bị chặn. Số liệu vẫn được ghi.':
    'Admin account — never blocked. Usage is still recorded.',
  'Mỗi tài khoản có ví RIÊNG cho từng mảng, tính trượt trong {n} giờ vừa qua — người khác dùng nhiều không ảnh hưởng tới bạn, và AI Code hết không làm AI Chat dừng theo.':
    'Every account has its OWN allowance per area, measured over a rolling {n}-hour window — heavy use by other people does not affect you, and running out on AI Code does not stop AI Chat.',
  // ── Bậc model trong AI Chat ─────────────────────────────
  'Thường': 'Standard',
  'Nhanh, đủ cho hỏi đáp hằng ngày': 'Fast, enough for everyday questions',
  'Suy luận sâu hơn — cần tài khoản Pro': 'Deeper reasoning — requires a Pro account',
  'Mạnh nhất, đọc ảnh và tài liệu — cần Pro': 'The strongest tier, reads images and documents — requires Pro',
  '{mo} (bạn chưa có Pro)': '{mo} (you don’t have Pro)',

  // ── Câu lỗi ghép chuỗi ──────────────────────────────────
  'Không tạo được thư mục: {loi}': 'Couldn’t create the folder: {loi}',
  'Không xoá được thư mục: {loi}': 'Couldn’t delete the folder: {loi}',
  'Không xếp được: {loi}': 'Couldn’t move it: {loi}',
  'Không mở được việc cũ: {loi}': 'Couldn’t reopen that task: {loi}',
  'Không xoá được: {loi}': 'Couldn’t delete it: {loi}',
  'Không ghim được: {loi}': 'Couldn’t pin it: {loi}',
  'Không lưu trữ được: {loi}': 'Couldn’t archive it: {loi}',
  'Không đổi tên được: {loi}': 'Couldn’t rename it: {loi}',
  'Không tách nhánh được: {loi}': 'Couldn’t branch off: {loi}',
  'Đã cắt trên màn hình nhưng máy chủ chưa cắt được: {loi}':
    'Stopped on screen, but the server hasn’t stopped yet: {loi}',

  // ── Phạm vi & nhịp lặp của Bảng việc ────────────────────
  'Hôm nay': 'Today',
  'việc phải xong trong ngày': 'due today',
  'Tuần này': 'This week',
  'việc của cả tuần': 'due this week',
  'Tháng này': 'This month',
  'việc của cả tháng': 'due this month',
  'Quý này': 'This quarter',
  'mục tiêu vài tháng': 'goals spanning a few months',
  'Năm nay': 'This year',
  'mục tiêu dài hạn': 'long-term goals',
  'Không đặt': 'None',
  'Thấp': 'Low',
  'Vừa': 'Medium',
  'Không lặp': 'Doesn’t repeat',
  /* ⚠️ Những mục dưới đây đi qua `dich(bien)`, KHÔNG phải `dich('chuỗi')` —
     nên `tuDien.test.ts` không thấy chúng (nó chỉ soi chuỗi hằng). Thêm hoặc
     đổi nhãn trong các hằng ấy thì phải nhớ sang đây, không ai nhắc. */

  // ── Hoạt động trong ngày (Tổng quan) ────────────────────
  'hoatdong|Học tập': 'Study',
  'hoatdong|Làm việc': 'Work',
  'hoatdong|Thể dục': 'Exercise',
  'hoatdong|Nấu ăn': 'Cooking',
  'hoatdong|Đi ngủ': 'Sleep',
  'hoatdong|Nghỉ ngơi': 'Rest',
  'hoatdong|Giải trí': 'Leisure',

  // ── Thứ trong tuần (Soạn lịch) ──────────────────────────
  'Thứ 2': 'Monday',
  'Thứ 3': 'Tuesday',
  'Thứ 4': 'Wednesday',
  'Thứ 5': 'Thursday',
  'Thứ 6': 'Friday',
  'Thứ 7': 'Saturday',
  'Chủ nhật': 'Sunday',

  // ── Nhắc trước giờ học ──────────────────────────────────
  'Không nhắc': 'No reminder',
  'Trước 5 phút': '5 minutes before',
  'Trước 10 phút': '10 minutes before',
  'Trước 15 phút': '15 minutes before',
  'Trước 30 phút': '30 minutes before',
  'Trước 1 giờ': '1 hour before',
  // ── Màn đăng nhập ───────────────────────────────────────
  'Đăng nhập': 'Sign in',
  'Đăng ký': 'Sign up',
  'Chào mừng trở lại': 'Welcome back',
  'Tên đăng nhập': 'Username',
  'Mật khẩu': 'Password',
  'Quên mật khẩu?': 'Forgot your password?',
  'Tạo tài khoản': 'Create an account',
  'Mở trang đăng ký trên cuongthai.com': 'Open the sign-up page on cuongthai.com',
  'hoặc': 'or',
  'Đã mở trình duyệt. Đăng nhập ở đó rồi quay lại — app sẽ tự nhận.':
    'Your browser is open. Sign in there and come back — the app will pick it up.',
  'Đang ngoại tuyến. Đăng nhập cần mạng — máy chủ phải xác thực tài khoản.':
    'You’re offline. Signing in needs a connection — the server has to verify your account.',

  // ── Hàng đợi đồng bộ ────────────────────────────────────
  'Hàng đợi đồng bộ': 'Sync queue',
  'Đang chờ gửi': 'Waiting to send',
  'Không có thay đổi nào đang chờ gửi.': 'Nothing is waiting to be sent.',
  'Cần bạn xử lý': 'Needs your attention',
  '**{n}** thay đổi cần bạn xử lý — app không tự gửi lại được.':
    '**{n}** changes need your attention — the app can’t resend them on its own.',
  'Gửi lỗi (tự thử lại)': 'Failed to send (retrying)',
  'Bỏ thay đổi này': 'Discard this change',
  // ── Xưởng Remix ─────────────────────────────────────────
  'Xưởng Remix': 'Remix Studio',
  'AI kèm cặp': 'AI coach',
  'Máy chủ chưa cắm khoá cổng AI, nên phần này tạm nghỉ. Mọi thứ còn lại của Xưởng Remix vẫn chạy bình thường.':
    'The server has no AI gateway key, so this part is resting. Everything else in Remix Studio works as usual.',
  'AI đọc ĐÚNG bảng số đo ở trên — nó không nghe được bài của bạn. Nên nó giải thích số liệu và chỉ việc cần làm, chứ không nhận xét về giai điệu.':
    'The AI reads exactly the measurements above — it cannot hear your track. So it explains the numbers and names the next move; it does not judge your melody.',
  'Mổ xẻ bài này': 'Break this track down',
  'Hỏi một câu — ví dụ: làm sao cho drop mạnh hơn?': 'Ask something — for example: how do I make the drop hit harder?',
  'Hỏi': 'Ask',
  'Câu trả lời bị cắt giữa chừng vì chạm trần độ dài. Hỏi lại một câu hẹp hơn để nhận đủ.':
    'The answer was cut off at the length limit. Ask something narrower to get the whole thing.',
  'Máy chủ trả về câu trả lời rỗng. Thử hỏi lại một câu hẹp hơn.':
    'The server returned an empty answer. Try asking something narrower.',
  'Những con số này KHÔNG có trong bảng đo:': 'These numbers are NOT in the measurements:',
  'AI có thể đã tự nghĩ ra — đối chiếu lại trước khi làm theo.':
    'The AI may have invented them — check before acting on them.',
  'Master theo bản mẫu': 'Match a reference master',
  'Chọn một bài bạn muốn bản của mình nghe giống. App đo nó rồi ép bài của bạn về đúng mức to, phổ tần và độ rộng stereo của nó.':
    'Pick a track you want yours to sound like. The app measures it, then pulls your track to its loudness, frequency balance and stereo width.',
  'Chọn bản mẫu': 'Choose a reference',
  'Đổi bản mẫu': 'Change reference',
  'Trần đỉnh': 'Peak ceiling',
  'Đang master…': 'Mastering…',
  'dải động': 'dynamic range',
  'Trước khi master': 'Before',
  'Sau khi master': 'After',
  'đã sát bản mẫu': 'already close to the reference',
  'Đây không thay được tai người. Nó khớp bốn con số; nó không biết bản mix của bạn có đục ở quãng trung hay không.':
    'This does not replace your ears. It matches four numbers; it cannot tell whether your mix is muddy in the mids.',
  'Chỉnh nhịp và tông rồi xuất': 'Adjust tempo and key, then export',
  'Nhịp đích': 'Target tempo',
  'Dịch tông': 'Shift key',
  'nửa cung': 'semitones',
  'bài đang ở': 'track is at',
  'kéo': 'stretch',
  'Chỉnh và xuất': 'Adjust and export',
  'Đang chỉnh…': 'Adjusting…',
  'Sẽ chỉnh cả bốn stem đã tách.': 'All four separated stems will be adjusted.',
  'Chưa tách stem thì chỉnh thẳng bản gốc — vẫn dùng được để đánh nối.':
    'With no stems yet, the original is adjusted directly — still useful for mixing between tracks.',
  'Kèm một tệp MIDI mẫu vinahouse đúng tông của bài.':
    'Includes a vinahouse MIDI template in the track\u2019s own key.',
  'Không nạp được bài — main không trả về phiên nào.':
    'The track could not be loaded — the main process returned no session.',
  'Xưởng Remix chỉ chạy trong app desktop': 'Remix Studio only runs in the desktop app',
  'Trang này cần đọc ghi tệp trên máy, thứ mà trình duyệt không cho phép.':
    'This page needs to read and write files on your machine, which a browser will not allow.',
  'Tách giọng, đo nhịp và tông, chấm bài — rồi kéo thẳng sang FL Studio.':
    'Split vocals, measure tempo and key, grade your mix — then drag straight into FL Studio.',
  'Model tách stem': 'Stem separation model',
  'Tải về': 'Download',
  // 'Đang tải…' đã có ở trên với nghĩa *Loading…* (đang nạp dữ liệu). Ở đây là
  // *Downloading…* (đang kéo tệp model về). Cùng khoá thì TypeScript báo trùng và
  // chọn bừa một nghĩa thì một trong hai chỗ sai — đúng ca mà tiền tố ngữ cảnh lo.
  'taimodel|Đang tải…': 'Downloading…',
  'Xoá model để lấy lại đĩa': 'Delete the model to free up disk space',
  'Kéo một bài nhạc vào đây': 'Drop a track here',
  'mp3 · m4a · wav · flac · ogg — bài nào cũng được':
    'mp3 · m4a · wav · flac · ogg — any track works',
  'Không đọc được định dạng này. Thử mp3, m4a, wav hay flac.':
    'That format cannot be read. Try mp3, m4a, wav or flac.',
  'Đang đọc bài…': 'Reading track…',
  'Chọn tệp': 'Choose a file',
  'Bài đang mở': 'Open track',
  'Đóng bài và xoá tệp tạm': 'Close the track and delete its temporary files',
  'Nhịp': 'Tempo',
  'Tông': 'Key',
  'Độ to': 'Loudness',
  'Dải động': 'Dynamic range',
  'đỉnh thật': 'true peak',
  'rộng stereo': 'stereo width',
  'đáng tin': 'reliable',
  'tạm': 'so-so',
  'nên nghe lại': 'check by ear',
  'Máy không chắc về tông. Đáp án xếp nhì là':
    'The key detection is not confident. Its runner-up is',
  ' — hai tông này dùng chung bộ nốt nên thuật toán hay nhầm. Nghe thử trước khi kéo cả bài theo.':
    ' — these two keys share the same notes, which is exactly where this method slips. Listen before you shift the whole track.',
  'Ghép hoà âm được với': 'Mixes harmonically with',
  'Phổ tần': 'Frequency spectrum',
  'Phổ tần theo dải quãng tám': 'Frequency spectrum by octave band',
  'Tách 4 stem': 'Split into 4 stems',
  'Đang tách…': 'Splitting…',
  'Mở thư mục': 'Open folder',
  'Phải tải model trước khi tách. Chọn một model ở trên rồi bấm Tải về.':
    'Download a model before splitting. Pick one above and press Download.',
  'khúc': 'chunk',
  'Xong trong': 'Finished in',
  'Tệp WAV 32-bit float — kéo thẳng vào FL Studio được.':
    '32-bit float WAV files — drag them straight into FL Studio.',
  // Nhãn stem: gọi qua biến (`dich(s.nhan)`) nên bộ quét của tuDien.test.ts
  // KHÔNG thấy chúng. Thiếu ở đây thì không có phép kiểm nào đỏ, mà giao diện
  // tiếng Anh vẫn hiện tiếng Việt — im lặng, đúng thứ phép kiểm kia sinh ra để
  // chặn. Nên phải tự nhớ thêm vào.
  'Giọng hát': 'Vocals',
  'Trống': 'Drums',
  // 'Bass' giống hệt ở hai thứ tiếng ⇒ KHÔNG đưa vào từ điển: `dich()` rơi về
  // nguyên văn là đúng, và mục chép y nguyên bị tuDien.test.ts từ chối.
  'Nhạc nền': 'Backing',
  'Thứ bạn cần nhất cho một bản remix': 'What a remix needs most',
  'Dựng fill và chuyển đoạn': 'For fills and transitions',
  'Thường bỏ đi, thay bằng bass vinahouse': 'Usually dropped for a vinahouse bass',
  'Đàn, kèn, và mọi thứ còn lại': 'Keys, horns and everything else',
};
