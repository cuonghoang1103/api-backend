/**
 * Câu trạng thái "Đang …", nhãn tool, giờ/thời lượng — y như khung chat VS
 * Code (`webview/main.ts`) để người dùng chuyển qua lại không thấy lạ.
 */
import { L } from './i18n';

/** Câu chờ lúc model đang nghĩ (chưa gọi tool, chưa có chữ) — đổi mỗi vài giây cho thấy nó còn sống. */
const NGHI: Array<[string, string]> = [
  ['Đang suy nghĩ', 'Thinking'], ['Đang ngẫm nghĩ', 'Pondering'], ['Đang sắp xếp ý', 'Organizing'], ['Đang lục trí nhớ', 'Recalling'],
  ['Đang cân nhắc', 'Considering'], ['Đang phân tích', 'Analyzing'], ['Đang tìm cách hay nhất', 'Finding the best approach'], ['Đang học ngữ cảnh', 'Reading context'],
];
export const SAO = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

export const TOOL_GHI = new Set(['edit_file', 'create_file', 'sua_nhieu_cho', 'xoa_file', 'doi_ten_file', 'sua_o_notebook', 'ghi_file_ngoai']);
export const TOOL_LENH = new Set(['run_command', 'chay_lenh_nen']);
/**
 * Nhãn MỘT dòng kiểu Claude Code (`● Read(src/a.ts)`). MỌI tool lõi/máy chủ đều phải có ở đây —
 * thiếu là lộ tên nội bộ (`web_lien_ket`) ra giao diện (ảnh người dùng 18/10). Test `dot3.test.ts`
 * quét danh sách tool của máy chủ để không ai quên.
 */
export const NHAN_TOOL: Record<string, [string, string]> = {
  read_file: ['Đọc', 'Read'], list_dir: ['Thư mục', 'List'], grep: ['Tìm', 'Search'], glob: ['Tìm file', 'Glob'], edit_file: ['Sửa', 'Update'],
  create_file: ['Tạo', 'Write'], sua_nhieu_cho: ['Sửa', 'Update'], xoa_file: ['Xoá', 'Delete'], doi_ten_file: ['Đổi tên', 'Rename'],
  sua_o_notebook: ['Notebook', 'NotebookEdit'], ghi_file_ngoai: ['Ghi ngoài dự án', 'WriteOutside'],
  run_command: ['Lệnh', 'Bash'], chay_lenh_nen: ['Lệnh nền', 'Background'], doc_dau_ra_nen: ['Đầu ra nền', 'BashOutput'], dung_lenh_nen: ['Dừng nền', 'KillShell'],
  terminal_mo: ['Terminal', 'Terminal'], terminal_gui: ['Gõ terminal', 'Terminal input'], terminal_doc: ['Đọc terminal', 'Terminal output'], terminal_dong: ['Đóng terminal', 'Close terminal'],
  git_status: ['Git', 'Git status'], git_diff: ['Diff', 'Diff'], git_commit: ['Commit', 'Commit'], git_day: ['Đẩy GitHub', 'Push'],
  tao_pr: ['Pull Request', 'Pull Request'], github_ket_noi: ['GitHub', 'GitHub'], github_dang_du_an: ['Lên GitHub', 'Publish'],
  cai_cong_cu: ['Cài công cụ', 'Install'],
  web_mo: ['Mở web', 'Navigate'], web_doc: ['Đọc trang', 'Read page'], web_anh: ['Chụp trang', 'Screenshot'], web_lien_ket: ['Liên kết', 'Links'],
  web_console: ['Console', 'Console'], web_bam: ['Bấm', 'Click'], web_go: ['Gõ', 'Type'], web_tai: ['Tải về', 'Download'], web_tai_nhieu: ['Tải nhiều', 'Download all'],
  tim_web: ['Tìm web', 'WebSearch'], doc_web: ['Đọc web', 'WebFetch'], web_search: ['Tìm web', 'WebSearch'], web_fetch: ['Đọc web', 'WebFetch'],
  giao_viec_phu: ['Agent phụ', 'Task'], giao_viec_ghi: ['Agent phụ ghi', 'TaskWrite'], gop_viec_phu: ['Gộp agent phụ', 'Merge subagent'],
  dung_ky_nang: ['Skill', 'Skill'], cap_nhat_ke_hoach: ['Kế hoạch', 'Plan'],
  nho_bai_hoc: ['Ghi nhớ', 'Memory'], doc_bo_nho: ['Đọc bộ nhớ', 'Recall'], quen_bai_hoc: ['Quên', 'Forget'], ghi_nho: ['Ghi nhớ', 'Memory'],
  doc_anh: ['Xem ảnh', 'View image'], sua_anh: ['Sửa ảnh', 'Edit image'], xuat_so_do: ['Xuất sơ đồ', 'Export diagram'],
  notes_search: ['Tìm ghi chú', 'Search notes'], notes_read: ['Đọc ghi chú', 'Read note'], notes_tree: ['Cây ghi chú', 'Notes tree'],
  notes_tao: ['Tạo ghi chú', 'Create note'], notes_ghi: ['Ghi ghi chú', 'Write note'],
  hoi_nguoi_dung: ['Hỏi bạn', 'Ask'], cho_doi: ['Chờ', 'Wait'], hen_goi_lai: ['Hẹn', 'Schedule'], huy_hen: ['Huỷ hẹn', 'Cancel schedule'],
  liet_ke_phien: ['Phiên khác', 'Sessions'], nhan_phien: ['Nhắn phiên', 'Send message'],
  /* Đợt 4 */
  may_chup: ['Chụp màn hình', 'Screenshot'], may_bam: ['Bấm chuột', 'Click'], may_go: ['Gõ phím', 'Type'], may_phim: ['Phím tắt', 'Key'],
  may_cuon: ['Cuộn', 'Scroll'], lsp_hoi: ['LSP', 'LSP'], chay_notebook: ['Chạy notebook', 'Run notebook'],
  /* Đợt 6 */
  ctwork_huong_dan: ['Hướng dẫn CT Work', 'CT Work guide'], nap_tool_mcp: ['Nạp tool', 'Load tools'],
};

/** Câu "Đang …" (thanh trạng thái). Không có ⇒ suy từ nhãn. */
const VIEC_TOOL: Record<string, [string, string]> = {
  read_file: ['Đang đọc file', 'Reading file'], list_dir: ['Đang xem thư mục', 'Listing directory'], grep: ['Đang tìm trong mã', 'Searching code'],
  glob: ['Đang tìm file', 'Finding files'], edit_file: ['Đang code', 'Editing'], create_file: ['Đang tạo file', 'Creating file'],
  sua_nhieu_cho: ['Đang code', 'Editing'], xoa_file: ['Đang xoá file', 'Deleting file'], doi_ten_file: ['Đang đổi tên file', 'Renaming file'],
  run_command: ['Đang chạy lệnh', 'Running command'], chay_lenh_nen: ['Đang chạy lệnh nền', 'Starting background command'],
  git_status: ['Đang xem git', 'Checking git'], git_diff: ['Đang xem thay đổi', 'Reading diff'], git_commit: ['Đang commit', 'Committing'],
  git_day: ['Đang đẩy lên GitHub', 'Pushing to GitHub'], tao_pr: ['Đang mở Pull Request', 'Opening pull request'],
  github_ket_noi: ['Đang kết nối GitHub', 'Connecting GitHub'], github_dang_du_an: ['Đang đưa dự án lên GitHub', 'Publishing to GitHub'],
  cai_cong_cu: ['Đang cài công cụ', 'Installing tool'], web_mo: ['Đang mở trang web', 'Opening page'], web_doc: ['Đang đọc trang web', 'Reading page'],
  web_anh: ['Đang chụp trang', 'Taking a screenshot'], web_lien_ket: ['Đang lấy liên kết', 'Collecting links'], web_bam: ['Đang bấm', 'Clicking'],
  web_go: ['Đang gõ', 'Typing'], web_tai: ['Đang tải về', 'Downloading'], web_console: ['Đang đọc console', 'Reading console'],
  doc_web: ['Đang đọc trang web', 'Reading page'], tim_web: ['Đang tra cứu trên web', 'Searching the web'],
  giao_viec_phu: ['Agent phụ đang làm', 'Subagent working'], giao_viec_ghi: ['Agent phụ đang sửa', 'Subagent editing'], cap_nhat_ke_hoach: ['Đang lập kế hoạch', 'Planning'],
  dung_ky_nang: ['Đang dùng skill', 'Using skill'], ghi_nho: ['Đang ghi nhớ bài học', 'Saving memory'], nho_bai_hoc: ['Đang ghi nhớ bài học', 'Saving memory'],
  doc_anh: ['Đang xem ảnh', 'Viewing image'], sua_anh: ['Đang sửa ảnh', 'Editing image'], doc_dau_ra_nen: ['Đang đọc đầu ra lệnh nền', 'Reading background output'],
  dung_lenh_nen: ['Đang dừng lệnh nền', 'Stopping background command'], hoi_nguoi_dung: ['Đang chờ bạn trả lời', 'Waiting for your answer'],
  cho_doi: ['Đang chờ', 'Waiting'], hen_goi_lai: ['Đang hẹn giờ', 'Scheduling'], nhan_phien: ['Đang nhắn phiên khác', 'Messaging a session'],
  liet_ke_phien: ['Đang xem phiên khác', 'Listing sessions'], gop_viec_phu: ['Đang gộp thay đổi', 'Merging changes'],
  may_chup: ['Đang chụp màn hình', 'Taking a screenshot'], may_bam: ['Đang bấm chuột', 'Clicking'], may_go: ['Đang gõ phím', 'Typing'],
  may_phim: ['Đang bấm phím', 'Pressing keys'], may_cuon: ['Đang cuộn', 'Scrolling'], lsp_hoi: ['Đang hỏi LSP', 'Querying LSP'], chay_notebook: ['Đang chạy notebook', 'Running notebook'],
  ctwork_huong_dan: ['Đang tra hướng dẫn CT Work', 'Looking up the CT Work guide'], nap_tool_mcp: ['Đang nạp tool', 'Loading tools'],
};

/** Tool gom được khi gọi LIÊN TIẾP (chỉ đọc) — `● Read 3 pages` thay vì 3 khối. */
export const TOOL_GOM = new Set(['read_file', 'list_dir', 'grep', 'glob', 'web_doc', 'web_lien_ket', 'web_anh', 'web_mo', 'web_console', 'doc_web', 'tim_web', 'git_status', 'git_diff', 'doc_dau_ra_nen', 'notes_read', 'notes_search', 'doc_bo_nho', 'terminal_doc']);

/** Nhãn của NHÓM n lời gọi cùng tool. */
export function nhanNhom(ten: string, n: number): string {
  const s = n > 1 ? 's' : '';
  switch (ten) {
    case 'read_file': return L(`Đọc ${n} file`, `Read ${n} file${s}`);
    case 'web_doc': case 'doc_web': return L(`Đọc ${n} trang`, `Read ${n} page${s}`);
    case 'web_mo': return L(`Mở ${n} trang`, `Visited ${n} page${s}`);
    case 'web_lien_ket': return L(`Lấy liên kết ${n} lần`, `Collected links ${n} times`);
    case 'web_anh': return L(`Chụp ${n} ảnh trang`, `Took ${n} screenshot${s}`);
    case 'grep': return L(`Tìm ${n} mẫu`, `Searched ${n} pattern${s}`);
    case 'glob': return L(`Tìm file ${n} lần`, `Globbed ${n} pattern${s}`);
    case 'list_dir': return L(`Xem ${n} thư mục`, `Listed ${n} director${n > 1 ? 'ies' : 'y'}`);
    case 'tim_web': return L(`Tìm web ${n} lần`, `Searched the web ${n} times`);
    default: return `${nhanTool(ten)} ×${n}`;
  }
}

const theoNN = (p: [string, string]): string => L(p[0], p[1]);

export function nhanTool(ten: string): string {
  // Đợt 5: `● CT Work · sprint_current` (server CT Work dựng sẵn) — kiểu Claude Code.
  if (ten.startsWith('mcp__ctwork__')) return `CT Work · ${ten.slice('mcp__ctwork__'.length)}`;
  if (ten.startsWith('mcp__')) return ten.split('__').slice(1).join(' · ');
  const p = NHAN_TOOL[ten];
  if (p) return theoNN(p);
  // Tên lạ (tool mới của máy chủ, nhãn nội bộ "kết nối"): đừng lộ snake_case — viết hoa chữ đầu.
  const t = ten.replace(/_/g, ' ').trim();
  return t ? t[0]!.toUpperCase() + t.slice(1) : ten;
}

/*
 * TÓM TẮT KẾT QUẢ của lõi là tiếng Việt ("6 liên kết", "24000/36356 ký tự", "0/5 việc"). Giao diện
 * tiếng Anh ⇒ dịch theo cụm (DÀI TRƯỚC — tự sắp). Cụm không có trong bảng giữ nguyên (thường là số/tên file).
 * Test `dot3.test.ts` quét MỌI `tomTat: '…'` trong lõi: bản tiếng Anh không được còn chữ tiếng Việt (QA 18/10:
 * "gửi failed", "⏳ Waiting for 3 giây").
 */
const CUM_TOM_TAT: Array<[RegExp, string]> = ([
  // Câu trọn (cụ thể nhất).
  ['từ chối ở hộp hệ thống', 'denied at the OS prompt'], ['chờ người dùng gõ mật khẩu', 'waiting for you to type the password'],
  ['không tạo được khu riêng', 'could not create the sandbox'], ['không có kỹ năng đó', 'no such skill'], ['không có loại đó', 'no such type'],
  ['không có mã đó', 'no such id'], ['không có phiên đó', 'no such session'], ['không có tool này', 'unknown tool'], ['không có cửa sổ', 'no window'],
  ['không có liên kết', 'no links'], ['không có kết quả', 'no result'], ['không có terminal', 'no terminal'], ['không có quyền', 'no permission'],
  ['không có tool', 'unknown tool'], ['không có git', 'git not found'], ['không có gì', 'nothing'],
  /* Đợt 6 */
  ['không nạp được', 'nothing loaded'], ['chỉ đọc', 'read only'], ['nạp', 'loaded'],
  ['không mở được khung', 'could not open the frame'], ['không chuẩn bị được', 'could not prepare'], ['không thấy phần tử', 'element not found'],
  ['không commit được', 'could not commit'], ['không đăng ký được', 'could not register'], ['không mở PR được', 'could not open the PR'],
  ['không đẩy được', 'could not push'], ['không dừng được', 'could not stop'], ['không hẹn được', 'could not schedule'],
  ['không lưu được', 'could not save'], ['không sửa được', 'could not edit'], ['không mở được', 'could not open'], ['không bật được', 'could not start'],
  ['không đổi', 'unchanged'], ['không khớp', 'no match'], ['không trả lời', 'no answer'],
  ['chưa bật quyền sửa', 'editing not enabled'], ['chưa chọn thư mục', 'no folder chosen'], ['chưa mở dự án', 'no project open'],
  ['chưa đăng nhập', 'not signed in'], ['chưa mở', 'not open'], ['chưa đạt', 'not met'],
  ['không chụp được', 'screenshot failed'], ['chưa chụp', 'no screenshot yet'], ['không làm được', 'could not do it'], ['ngoài dự án', 'outside the project'],
  ['chạy hỏng', 'run failed'], ['chưa bật', 'not enabled'], ['không có LSP', 'no LSP'], ['LSP lỗi', 'LSP error'], ['ký hiệu', 'symbols'], ['có kiểu', 'type info'],
  ['nội dung chưa vào', 'content not applied'], ['nội dung rỗng', 'empty content'], ['câu hỏi sai dạng', 'malformed question'],
  ['việc không hợp lệ', 'invalid task'], ['loại không hỗ trợ', 'unsupported type'], ['hết lượt việc phụ', 'subagent limit reached'],
  ['cổng AI đang quá tải', 'AI gateway overloaded'], ['đứt giữa chừng', 'connection dropped'], ['lệch khoảng trắng', 'whitespace mismatch'],
  ['nghi bản scan', 'likely scanned'], ['quy ước dự án', 'project rules'], ['đọc bộ nhớ', 'read memory'], ['Kết quả dò.', 'Probe result.'],
  ['đã lên GitHub', 'published to GitHub'], ['đã mở PR', 'PR opened'], ['đã commit', 'committed'], ['đã đẩy', 'pushed'], ['đã thoát', 'exited'],
  ['đã tồn tại', 'already exists'], ['đích đã có', 'target exists'], ['đã trả lời', 'answered'], ['đã dừng', 'stopped'], ['đã bỏ', 'discarded'],
  ['cần LibreOffice', 'LibreOffice required'], ['ngoài phạm vi', 'out of scope'], ['thư mục sai', 'wrong directory'],
  ['sai chế độ', 'wrong mode'], ['sai loại file', 'wrong file type'], ['điều kiện sai', 'bad condition'], ['regex sai', 'bad regex'], ['mẫu sai', 'bad pattern'],
  ['định dạng lạ', 'unknown format'], ['công cụ lạ', 'unknown tool'], ['đuôi lạ', 'unknown extension'], ['đuôi lệch', 'extension mismatch'],
  ['loại lạ', 'unknown type'], ['phím lạ', 'unknown key'], ['tool lạ', 'unknown tool'], ['việc lạ', 'unknown task'],
  ['hook chặn', 'blocked by hook'], ['bị chặn', 'blocked'], ['bị từ chối', 'denied'], ['tự duyệt', 'auto-approved'], ['ghi đè', 'overwrite'],
  ['file chờ gộp', 'files pending merge'], ['chờ gộp', 'pending merge'], ['file đổi', 'files changed'], ['tạo mới', 'new file'],
  ['phép khớp', 'edits matched'], ['đoạn khớp', 'matches'], ['xung đột', 'conflicts'], ['bỏ chờ', 'wait cancelled'], ['tiếp ngay', 'continued'],
  ['đạt sau', 'met after'], ['mã thoát', 'exit code'], ['hết giờ', 'timed out'], ['sẵn sàng', 'ready'], ['có sẵn', 'already installed'],
  ['đang chạy', 'running'], ['ảnh quá lớn', 'image too large'], ['ảnh không đọc được', 'unreadable image'], ['trang trống', 'empty page'],
  ['là thư mục', 'is a directory'], ['mất terminal', 'terminal gone'], ['thiếu đường dẫn', 'missing path'], ['thiếu lệnh', 'missing command'],
  ['thiếu bộ chọn', 'missing selector'], ['thiếu lời nhắn', 'missing message'], ['thiếu nhiệm vụ', 'missing task'], ['thiếu nội dung', 'missing content'],
  ['thiếu tham số', 'missing arguments'], ['thiếu tiêu đề', 'missing title'], ['thiếu chữ', 'missing text'], ['thiếu đích', 'missing target'],
  ['thiếu mẫu', 'missing pattern'], ['thiếu', 'missing'], ['bộ chọn', 'selector'], ['sửa ảnh', 'image edit'], ['đưa lên', 'upload'],
  ['quá nhiều', 'too many'], ['quá lớn', 'too large'], ['quá dài', 'too long'], ['nhị phân', 'binary'], ['kỹ năng', 'skill'],
  // Từ đơn (sau cùng).
  ['liên kết', 'links'], ['ký tự', 'chars'], ['kết quả', 'results'], ['thư mục', 'dirs'], ['việc', 'tasks'], ['dòng', 'lines'], ['trang', 'pages'],
  ['phần', 'parts'], ['lỗi', 'errors'], ['chỗ', 'spots'], ['mục', 'items'], ['ô', 'cells'], ['bỏ qua', 'skipped'], ['hỏng', 'failed'], ['tải', 'downloaded'],
  ['phiên', 'sessions'], ['xoá', 'deleted'], ['ảnh', 'image'], ['nền', 'background'], ['xong', 'done'], ['gộp', 'merged'], ['hẹn', 'scheduled'],
  ['quên', 'forgot'], ['nhớ', 'saved'], ['cập nhật', 'updated'], ['đóng', 'closed'], ['trùng', 'duplicate'], ['khớp', 'match'], ['rỗng', 'empty'],
  ['trống', 'empty'], ['sạch', 'clean'], ['cắt', 'truncated'], ['huỷ', 'cancelled'], ['tạo', 'created'], ['đọc', 'read'], ['gửi', 'send'],
  ['cuộn', 'scroll'], ['đẩy', 'push'], ['không có', 'none'],
] as Array<[string, string]>)
  .sort((x, y) => y[0].length - x[0].length)
  .map(([vi, en]) => [new RegExp(`(^|[^\\p{L}])${vi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\p{L}])`, 'giu'), `$1${en}`]);

/** Danh từ đếm được ⇒ số ít khi n = 1, số nhiều khi n ≠ 1 ("1 results" ⇒ "1 result", "3 file" ⇒ "3 files"). */
const DEM: Array<[string, string]> = [
  ['result', 'results'], ['link', 'links'], ['char', 'chars'], ['line', 'lines'], ['page', 'pages'], ['part', 'parts'], ['error', 'errors'],
  ['spot', 'spots'], ['item', 'items'], ['cell', 'cells'], ['session', 'sessions'], ['task', 'tasks'], ['dir', 'dirs'], ['file', 'files'],
  ['image', 'images'], ['terminal', 'terminals'], ['match', 'matches'], ['tool', 'tools'], ['subagent', 'subagents'], ['schedule', 'schedules'],
];
export function soNhieu(s: string): string {
  return s.replace(/(^|[^\d.,/])(\d+) ([a-z]+)\b/g, (toan, dau: string, so: string, tu: string) => {
    const m = DEM.find(([it, nhieu]) => tu === it || tu === nhieu);
    return m ? `${dau}${so} ${so === '1' ? m[0] : m[1]}` : toan;
  });
}

export function dichTomTat(tomTat: string): string {
  if (!tomTat || L('vi', 'en') === 'vi') return tomTat;
  let r = tomTat
    .replace(/chờ (\d+)s rồi thử lại \(lần (\d+)\/(\d+)\)/, 'retrying in $1s (attempt $2/$3)')
    .replace(/(^|\s)huỷ (\d+) hẹn/u, '$1cancelled $2 schedules');
  for (const [re, en] of CUM_TOM_TAT) r = r.replace(re, en);
  return soNhieu(r);
}

/**
 * Lý do một lệnh bị xếp "cần xem kỹ / nguy hiểm" (`desktop/.../lenh.ts`, tiếng Việt) ⇒ tiếng Anh. Khớp NGUYÊN câu;
 * câu lạ giữ nguyên. Test quét `lenh.ts` để không câu nào lọt.
 */
const LY_DO_EN = new Map<string, string>([
  ['bật/tắt tính năng Windows', 'turns Windows features on/off'], ['cài gói mới — chạy script của gói đó', 'installs a new package — runs its scripts'],
  ['cài phần mềm/mô-đun cho máy', 'installs software/modules on the machine'], ['cài vào hệ thống', 'installs into the system'],
  ['cài/gỡ phần mềm của máy', 'installs/removes software on the machine'], ['chạy chuỗi lệnh qua shell khác — nội dung không kiểm được', 'runs a string through another shell — contents cannot be checked'],
  ['chạy file .ps1 — nội dung không kiểm được', 'runs a .ps1 file — contents cannot be checked'], ['chạy mã ngay trên dòng lệnh', 'runs inline code'],
  ['chạy mã/tiến trình khác — nội dung không kiểm được', 'runs other code/processes — contents cannot be checked'], ['chạy một lệnh khác hàng loạt', 'runs another command in bulk'],
  ['chạy sang Linux con — ra ngoài tầm mọi phép kiểm ở đây', 'runs inside WSL — outside every check here'], ['chạy với quyền quản trị', 'runs as administrator'],
  ['chuyển file — có thể ra ngoài dự án', 'moves files — possibly outside the project'], ['đẩy lên kho từ xa — người khác thấy ngay', 'pushes to a remote — others see it immediately'],
  ['điều khiển container/cụm máy', 'controls containers/clusters'], ['điều khiển Linux con / container', 'controls WSL / containers'],
  ['đổi biến môi trường cố định của máy', 'changes persistent machine environment variables'], ['đổi chính sách chạy script của máy', 'changes the machine script execution policy'],
  ['đổi dịch vụ chạy nền của máy', 'changes machine services'], ['đổi lịch sử git', 'rewrites git history'], ['đổi quyền file', 'changes file permissions'],
  ['đổi tác vụ tự chạy của máy', 'changes scheduled tasks'], ['đổi tài khoản/nhóm của máy', 'changes machine users/groups'], ['đổi tường lửa/mạng của máy', 'changes firewall/network settings'],
  ['đổi Windows Defender', 'changes Windows Defender'], ['dựng/tải mã rồi chạy', 'builds/downloads code and runs it'], ['eval — chạy chuỗi tuỳ ý', 'eval — runs an arbitrary string'],
  ['find kèm -delete/-exec — xoá hoặc chạy hàng loạt', 'find with -delete/-exec — deletes or runs in bulk'], ['fork bomb', 'fork bomb'],
  ['ghi vào thư mục hệ thống', 'writes to a system directory'], ['giết tiến trình khác', 'kills other processes'], ['gọi ra Internet — có thể tải mã lạ về', 'reaches the Internet — may download unknown code'],
  ['nối tới máy khác', 'connects to another machine'], ['npx — chạy binary trong dự án, hoặc tải một gói từ Internet', 'npx — runs a project binary, or downloads a package from the Internet'],
  ['phát hành gói ra công khai', 'publishes a package publicly'], ['PowerShell chạy mã mã hoá/file .ps1 — nội dung không kiểm được', 'PowerShell runs encoded code/.ps1 — contents cannot be checked'],
  ['sửa registry của Windows', 'edits the Windows registry'], ['tắt máy / giết tiến trình', 'shuts down / kills processes'], ['tắt/khởi động lại máy', 'shuts down/restarts the machine'],
  ['thao tác đĩa ở mức thấp', 'low-level disk operation'], ['thao tác đĩa/khởi động ở mức thấp', 'low-level disk/boot operation'],
  ['toán tử & gọi một lệnh/script khác', 'the & operator calls another command/script'], ['vứt bỏ thay đổi chưa lưu', 'discards unsaved changes'],
  ['xoá — không hoàn tác được', 'deletes — cannot be undone'], ['xoá file — không hoàn tác được', 'deletes files — cannot be undone'], ['xoá nhánh', 'deletes a branch'],
  ['xoá thư mục — không hoàn tác được', 'deletes a directory — cannot be undone'], ['xoá/cắt trắng file — không hoàn tác được', 'deletes/truncates files — cannot be undone'],
  ['nhắc tới file có thể chứa khoá/mật khẩu', 'mentions a file that may hold keys/passwords'],
  ['nhắc tới file có thể chứa khoá/mật khẩu — shell ĐỌC ĐƯỢC những file mà agent bị chặn', 'mentions a file that may hold keys/passwords — the shell CAN read files the agent is blocked from'],
  ['PowerShell có ghi/thay đổi trong phạm vi dự án', 'PowerShell writes/changes things inside the project'],
  ['PowerShell không đúng khuôn `-Command "…"` — nội dung không kiểm được', 'PowerShell is not in the `-Command "…"` form — contents cannot be checked'],
  ['gồm nhiều lệnh nối nhau hoặc có chuyển hướng', 'chains several commands or redirects output'],
  ['gửi tin nhắn cho một phiên CuongMini khác trên máy này', 'sends a message to another CuongMini session on this machine'],
]);
export const dichLyDo = (s: string): string => L(s, LY_DO_EN.get(s) ?? s);

/** Điều kiện CHỜ của lõi (`choHen.ts › moTaDieuKien`, tiếng Việt) ⇒ tiếng Anh. */
export function dichMoTaCho(s: string): string {
  if (L('vi', 'en') === 'vi') return s;
  return s.replace(/^(\d+) giây$/, '$1s')
    .replace(/^lệnh nền (\S+) in ra (.*)$/, 'background $1 to print $2')
    .replace(/^lệnh nền (\S+) kết thúc$/, 'background $1 to finish')
    .replace(/^file (.*) xuất hiện$/, 'file $1 to appear')
    .replace(/^(.*) trả 2xx$/, '$1 to return 2xx')
    .replace(/^tiến trình (\d+) kết thúc$/, 'process $1 to exit');
}

/** Dòng "[Đánh thức — hẹn #h1 lúc 07:26] …" của lõi (gửi model bằng tiếng Việt) — chỉ đổi phần HIỂN THỊ. */
export function dichDanhThuc(s: string): string {
  return L(s, s.replace(/^\[Đánh thức — hẹn (#\S+) lúc ([\d:]+)\]/, '[Wake-up — schedule $1 at $2]'));
}

/** Câu "Đang …" cho một tool (`undefined` nếu chưa có bản dịch riêng). */
export function viecTool(ten: string): string | undefined {
  const p = VIEC_TOOL[ten];
  return p ? theoNN(p) : undefined;
}

export type Pha = 'cho' | 'nghi' | 'viet' | 'tool' | 'duyet';

export function cauTrangThai(t: { pha: Pha; toolDang: string; toolCuoi: string; batDauLuot: number; nghiThat?: boolean; hoi?: unknown }, bayGio = Date.now()): string {
  // Khung `nghi` (cổng chính hãng: model đang nghĩ, chữ ẩn) — nói đúng điều đang xảy ra, không xoay câu vui.
  if (t.nghiThat && t.pha === 'nghi') return L('Đang suy nghĩ', 'Thinking');
  switch (t.pha) {
    // Thẻ HỎI (`hoi_nguoi_dung`) cũng là pha 'duyet' — nhưng người dùng đang TRẢ LỜI chứ không duyệt gì.
    case 'duyet': return t.hoi ? L('Đang chờ bạn trả lời', 'Waiting for your answer') : L('Đang chờ bạn duyệt', 'Waiting for your approval');
    case 'viet': return L('Đang viết câu trả lời', 'Writing');
    case 'tool': return viecTool(t.toolDang) ?? (t.toolDang.startsWith('mcp__') ? L('Đang gọi công cụ ngoài', 'Calling external tool') : L('Đang làm', 'Working'));
    case 'nghi':
      if (t.toolCuoi && TOOL_GHI.has(t.toolCuoi)) return L('Đang code', 'Coding');
      if (t.toolCuoi === 'run_command') return L('Đang xem kết quả lệnh', 'Reading command output');
      if (/^(web_|doc_web|tim_web)/.test(t.toolCuoi)) return L('Đang xem web', 'Browsing');
      if (t.toolCuoi) return L('Đang đọc mã dự án', 'Exploring the codebase');
      return theoNN(NGHI[Math.floor((bayGio - t.batDauLuot) / 3500) % NGHI.length]!);
    default: return L('Đang khởi động', 'Starting');
  }
}

/** `6:27 PM` — đúng kiểu giờ Claude Code hiện dưới mỗi lượt. */
export const gio = (d = new Date()): string => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/** `42s` · `3m 05s` · `1h 02m`. */
export function giay(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`;
}

/**
 * Tách kết quả `run_command` của lõi: `$ lệnh\n<đầu>\n\n<đầu ra>` (xem
 * `toolRunCommand` trong `desktop/src/main/agent/tools.ts`).
 */
export function tachKetQuaLenh(chiTiet: string | undefined): { lenh: string | null; ra: string } {
  if (!chiTiet) return { lenh: null, ra: '' };
  if (!chiTiet.startsWith('$ ')) return { lenh: null, ra: chiTiet };
  const xuong = chiTiet.indexOf('\n');
  const lenh = (xuong < 0 ? chiTiet.slice(2) : chiTiet.slice(2, xuong)).trim();
  if (xuong < 0) return { lenh, ra: '' };
  const sau = chiTiet.slice(xuong + 1);
  const trong = sau.indexOf('\n\n');
  return { lenh, ra: (trong < 0 ? sau : sau.slice(trong + 2)).replace(/^\(không có đầu ra\)$/, '') }; // i18n-bo-qua: chữ của lõi
}

/** Kết quả tool có vẻ hỏng không (để tô chấm đỏ). */
// Khớp chữ do LÕI trả về (tiếng Việt) — không phải chuỗi giao diện.
export const coVeHong = (tomTat: string): boolean => /^(lỗi|error|thất bại|failed|bị chặn|bị từ chối|không có quyền)|exit code [1-9]|mã thoát [1-9]|hết giờ/i.test(tomTat); // i18n-bo-qua

/** `~$0.049` / `~$0.0042` — một kiểu viết tiền cho dòng kết lượt (đã đo: sổ máy chủ làm tròn tới 4 chữ số). */
export const tienGon = (t: number): string => `~$${t < 0.01 ? t.toFixed(4) : t.toFixed(3)}`;
