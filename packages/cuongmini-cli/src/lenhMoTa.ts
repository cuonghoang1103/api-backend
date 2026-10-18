/**
 * MÔ TẢ LỆNH `/` hai thứ tiếng. Danh sách lệnh chung lấy từ `ct-lenh`
 * (`desktop/.../lenhGach.ts`, chỉ có tiếng Việt) — bảng dưới dịch theo TÊN
 * lệnh, không sửa file của app. Lệnh chỉ có ở CLI khai ở đây luôn.
 *
 * File này KHÔNG import `ct-lenh` để test (tsx) nạp được không cần alias.
 */
import { L } from './i18n';

export interface LenhGachCli { ten: string; mo: string; khac?: string[]; thamSo?: string; nhom?: 'co-ban' | 'phien' | 'lam-viec' | 'cong-cu' }

/** Lệnh chỉ có ở CLI — `mo`/`thamSo` là getter để đổi theo ngôn ngữ lúc vẽ. */
export const LENH_CLI: LenhGachCli[] = [
  { ten: '/login', get mo() { return L('Đăng nhập lại / đổi tài khoản', 'Sign in again / switch account'); }, khac: ['/dangnhap'], nhom: 'co-ban' },
  { ten: '/logout', get mo() { return L('Đăng xuất (xoá phiên trên máy) rồi thoát', 'Sign out (remove local session) and quit'); }, khac: ['/dangxuat'], nhom: 'co-ban' },
  { ten: '/exit', get mo() { return L('Thoát CuongMini', 'Quit CuongMini'); }, khac: ['/quit', '/thoat', '/q'], nhom: 'co-ban' },
  { ten: '/config', get mo() { return L('Cài đặt: giao diện, thông báo, chế độ & model mặc định, trình duyệt', 'Settings: theme, notifications, default mode & model, browser'); }, khac: ['/caidat', '/settings'], nhom: 'co-ban' },
  { ten: '/language', get mo() { return L('Đổi ngôn ngữ giao diện Tiếng Việt ↔ English', 'Switch interface language: English ↔ Vietnamese'); }, khac: ['/ngon-ngu', '/ngonngu', '/lang'], get thamSo() { return '[vi|en]'; }, nhom: 'co-ban' },
  { ten: '/theme', get mo() { return L('Đổi giao diện sáng / tối / tự động', 'Switch light / dark / auto theme'); }, khac: ['/giaodien'], get thamSo() { return L('[sang|toi|tu-dong]', '[light|dark|auto]'); }, nhom: 'co-ban' },
  { ten: '/tasks', get mo() { return L('Agent phụ và lệnh nền: đang chạy, đã xong, chi tiết', 'Subagents and background shells: running, finished, details'); }, khac: ['/agents', '/viec-phu'], nhom: 'phien' },
  { ten: '/gateway', get mo() { return L('Chọn cổng AI: cổng chính · Claude chính hãng · modelapi (mật khẩu do quản trị cấp)', 'Pick the AI gateway: main · official Claude · modelapi (admin-issued password)'); }, khac: ['/cong', '/cong-phu'], nhom: 'phien' },
  { ten: '/browser', get mo() { return L('Bật/tắt cho AI dùng trình duyệt ở phiên này', 'Turn the AI browser on/off for this session'); }, khac: ['/trinh-duyet', '/trinhduyet', '/chrome'], thamSo: '[on|off]', nhom: 'phien' },
  { ten: '/fullscreen', get mo() { return L('Toàn màn hình (ô nhập ghim đáy, cuộn bằng chuột) bật/tắt — lưu cho lần sau', 'Fullscreen (input pinned to the bottom, mouse scrolling) on/off — saved for next time'); }, khac: ['/toan-man-hinh', '/fs'], thamSo: '[on|off]', nhom: 'phien' },
  { ten: '/transcript', get mo() { return L('Xem lại toàn bộ bảng ghi (ctrl+r)', 'Browse the full transcript (ctrl+r)'); }, khac: ['/banghi'], nhom: 'phien' },
  { ten: '/terminal-setup', get mo() { return L('Cài Shift+Enter xuống dòng cho terminal hoặc xem hướng dẫn', 'Set up Shift+Enter for newlines in your terminal'); }, khac: ['/caiterminal'], nhom: 'cong-cu' },
  { ten: '/add-dir', get mo() { return L('Cho agent đọc/sửa thêm một thư mục ngoài dự án', 'Let the agent work in an extra directory'); }, khac: ['/themthumuc'], get thamSo() { return L('<đường dẫn>', '<path>'); }, nhom: 'lam-viec' },
  { ten: '/copy', get mo() { return L('Chép câu trả lời (cuối, hoặc thứ N từ cuối) · q = câu hỏi · all = cả hội thoại', 'Copy an answer (last, or Nth from last) · q = a question · all = whole conversation'); }, khac: ['/chep'], thamSo: '[N|q [N]|all]', nhom: 'lam-viec' },
  { ten: '/mouse', get mo() { return L('Bắt chuột ở toàn màn hình (mặc định TẮT: bôi đen chép tự nhiên, con lăn vẫn cuộn)', 'Capture the mouse in fullscreen (default OFF: select & copy naturally, the wheel still scrolls)'); }, khac: ['/chuot'], thamSo: '[on|off]', nhom: 'phien' },
];

/** Bản tiếng Anh của mô tả + tham số các lệnh CHUNG (khớp theo tên trong `LENH_AGENT`). */
export const LENH_EN: Record<string, { mo: string; thamSo?: string }> = {
  '/clear': { mo: 'Clear the conversation and start a new task' },
  '/model': { mo: 'Choose the model (including fallback gateway)', thamSo: '[name]' },
  '/effort': { mo: 'Change effort level (steps, subagents)', thamSo: '[low|medium|high|xhigh|max|ultracode]' },
  '/compact': { mo: 'Summarize older turns now to free context (full copy kept)', thamSo: '[notes to keep]' },
  '/context': { mo: 'Context usage: prompt, history, tool results, images' },
  '/usage': { mo: '5-hour usage, reset time, daily spend cap, extension key' },
  '/cost': { mo: 'Cost of this task so far' },
  '/status': { mo: 'Version, gateway, network, project, git branch' },
  '/plan': { mo: 'Plan only (no edits, no commands) — approve before doing', thamSo: '<task>' },
  '/review': { mo: 'Review the current diff, list issues with file:line — no edits', thamSo: '[scope]' },
  '/diff': { mo: 'Show the git diff of the open project' },
  '/init': { mo: 'Scan the project and create/update AGENTS.md (read every turn)' },
  '/undo': { mo: 'Undo every file the agent changed in this task' },
  '/rewind': { mo: 'Go back to an earlier question: cut the conversation + revert files', thamSo: '[question #]' },
  '/resume': { mo: 'Resume an earlier task', thamSo: '[number|keyword]' },
  '/export': { mo: 'Export the conversation to a Markdown file' },
  '/memory': { mo: 'View/forget the agent\'s memory (lessons)' },
  '/hooks': { mo: 'Manage hooks' },
  '/mcp': { mo: 'Manage MCP servers' },
  '/kynang': { mo: 'Find and install skills from AI Templates into the project', thamSo: '[keyword | cai <name>]' },
  '/quyen': { mo: 'View, add a prefix ("npm test"), revoke "always allow" permissions', thamSo: '[add <prefix> | remove [n]]' },
  '/sessions': { mo: 'Other CuongMini sessions open on this machine (agents can message each other)' },
  '/rename': { mo: 'Name this session (other sessions see this name)', thamSo: '<name>' },
  '/worktree': { mo: 'Work in a separate git worktree (branch agent/…) — leaves your tree alone', thamSo: '[name | list | remove <path>]' },
  '/ctwork': { mo: 'One-tap CT Work connection (token created with your signed-in account, kept in this machine\'s secret store)', thamSo: '[read | write | off]' },
  '/hen': { mo: 'What the agent is WAITING for and its scheduled wake-ups — view / cancel', thamSo: '[cancel [id]]' },
  '/offline': { mo: 'Toggle on-device (offline) AI for this tab' },
  '/doctor': { mo: 'Diagnose: network, server, gateway, offline AI, folder permissions' },
  '/help': { mo: 'Show slash commands' },
};

/** Mô tả lệnh theo ngôn ngữ hiện tại. */
export function moLenh(l: { ten: string; mo: string }): string {
  return L(l.mo, LENH_EN[l.ten]?.mo ?? l.mo);
}

export function thamSoLenh(l: { ten: string; thamSo?: string }): string | undefined {
  if (!l.thamSo) return undefined;
  return L(l.thamSo, LENH_EN[l.ten]?.thamSo ?? l.thamSo);
}

const TEN_NHOM: Record<string, [string, string]> = {
  'co-ban': ['Cơ bản', 'Basics'], phien: ['Phiên & model', 'Session & model'], 'lam-viec': ['Làm việc', 'Work'], 'cong-cu': ['Công cụ', 'Tools'],
};

/** `/help` theo nhóm, hai thứ tiếng (thay `moTaTroGiup` chỉ tiếng Việt của app). */
export function troGiup(ds: readonly LenhGachCli[], lenhDuAn: ReadonlyArray<{ ten: string; mo: string }>): string {
  const nhom = Object.keys(TEN_NHOM).map((n) => {
    const dong = ds.filter((l) => (l.nhom ?? 'co-ban') === n).map((l) => {
      const ts = thamSoLenh(l);
      const khac = l.khac?.length ? ` _(${l.khac.join(', ')})_` : '';
      return `- \`${l.ten}${ts ? ` ${ts}` : ''}\`${khac} — ${moLenh(l)}`;
    });
    return dong.length ? `**${L(TEN_NHOM[n]![0], TEN_NHOM[n]![1])}**\n${dong.join('\n')}` : '';
  }).filter(Boolean);
  const duAn = lenhDuAn.length
    ? `\n\n**${L('Lệnh của dự án', 'Project commands')}** (\`.claude/commands\`)\n${lenhDuAn.map((l) => `- \`${l.ten}\` — ${l.mo}`).join('\n')}`
    : '';
  return `${nhom.join('\n\n')}${duAn}`;
}
