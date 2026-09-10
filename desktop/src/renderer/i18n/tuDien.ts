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
};
