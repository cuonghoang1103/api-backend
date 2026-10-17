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

/** [đang-làm tiếng Việt, tiếng Anh] theo tên tool. */
const VIEC_TOOL: Record<string, [string, string]> = {
  read_file: ['Đang đọc file', 'Reading file'], list_dir: ['Đang xem thư mục', 'Listing directory'], grep: ['Đang tìm trong mã', 'Searching code'],
  glob: ['Đang tìm file', 'Finding files'], edit_file: ['Đang code', 'Editing'], create_file: ['Đang tạo file', 'Creating file'],
  sua_nhieu_cho: ['Đang code', 'Editing'], xoa_file: ['Đang xoá file', 'Deleting file'], doi_ten_file: ['Đang đổi tên file', 'Renaming file'],
  run_command: ['Đang chạy lệnh', 'Running command'], chay_lenh_nen: ['Đang chạy lệnh nền', 'Starting background command'],
  git_status: ['Đang xem git', 'Checking git'], git_diff: ['Đang xem thay đổi', 'Reading diff'], git_commit: ['Đang commit', 'Committing'],
  git_day: ['Đang đẩy lên GitHub', 'Pushing to GitHub'], tao_pr: ['Đang mở Pull Request', 'Opening pull request'],
  github_ket_noi: ['Đang kết nối GitHub', 'Connecting GitHub'], github_dang_du_an: ['Đang đưa dự án lên GitHub', 'Publishing to GitHub'],
  cai_cong_cu: ['Đang cài công cụ', 'Installing tool'], web_mo: ['Đang mở trang web', 'Opening page'], web_doc: ['Đang đọc trang web', 'Reading page'],
  doc_web: ['Đang đọc trang web', 'Reading page'], tim_web: ['Đang tra cứu trên web', 'Searching the web'],
  giao_viec_phu: ['Agent phụ đang làm', 'Subagent working'], cap_nhat_ke_hoach: ['Đang lập kế hoạch', 'Planning'],
  dung_ky_nang: ['Đang dùng skill', 'Using skill'], ghi_nho: ['Đang ghi nhớ bài học', 'Saving memory'], doc_anh: ['Đang xem ảnh', 'Viewing image'],
  sua_anh: ['Đang sửa ảnh', 'Editing image'], doc_dau_ra_nen: ['Đang đọc đầu ra lệnh nền', 'Reading background output'],
  dung_lenh_nen: ['Đang dừng lệnh nền', 'Stopping background command'],
};
export const TOOL_GHI = new Set(['edit_file', 'create_file', 'sua_nhieu_cho', 'xoa_file', 'doi_ten_file']);
export const TOOL_LENH = new Set(['run_command', 'chay_lenh_nen']);
const NHAN_TOOL: Record<string, [string, string]> = {
  read_file: ['Đọc', 'Read'], list_dir: ['Thư mục', 'List'], grep: ['Tìm', 'Search'], glob: ['Tìm file', 'Glob'], edit_file: ['Sửa', 'Update'],
  create_file: ['Tạo', 'Write'], sua_nhieu_cho: ['Sửa', 'Update'], xoa_file: ['Xoá', 'Delete'], doi_ten_file: ['Đổi tên', 'Rename'],
  run_command: ['Lệnh', 'Bash'], chay_lenh_nen: ['Lệnh nền', 'Background'], doc_dau_ra_nen: ['Đầu ra nền', 'BashOutput'], dung_lenh_nen: ['Dừng nền', 'KillShell'],
  git_status: ['Git', 'Git'], git_diff: ['Diff', 'Diff'], git_commit: ['Commit', 'Commit'], git_day: ['Đẩy GitHub', 'Push'],
  tao_pr: ['Pull Request', 'Pull Request'], github_ket_noi: ['GitHub', 'GitHub'], github_dang_du_an: ['Lên GitHub', 'Publish'],
  cai_cong_cu: ['Cài công cụ', 'Install'], web_mo: ['Mở web', 'Navigate'], web_doc: ['Đọc web', 'Read page'], tim_web: ['Tìm web', 'WebSearch'],
  doc_web: ['Đọc web', 'WebFetch'], giao_viec_phu: ['Agent phụ', 'Task'], dung_ky_nang: ['Skill', 'Skill'],
  cap_nhat_ke_hoach: ['Kế hoạch', 'Plan'], ghi_nho: ['Ghi nhớ', 'Memory'], doc_anh: ['Xem ảnh', 'View image'], sua_anh: ['Sửa ảnh', 'Edit image'],
};

const theoNN = (p: [string, string]): string => L(p[0], p[1]);

export function nhanTool(ten: string): string {
  if (ten.startsWith('mcp__')) return ten.split('__').slice(1).join(' · ');
  const p = NHAN_TOOL[ten];
  return p ? theoNN(p) : ten;
}

/** Câu "Đang …" cho một tool (`undefined` nếu chưa có bản dịch riêng). */
export function viecTool(ten: string): string | undefined {
  const p = VIEC_TOOL[ten];
  return p ? theoNN(p) : undefined;
}

export type Pha = 'cho' | 'nghi' | 'viet' | 'tool' | 'duyet';

export function cauTrangThai(t: { pha: Pha; toolDang: string; toolCuoi: string; batDauLuot: number; nghiThat?: boolean }, bayGio = Date.now()): string {
  // Khung `nghi` (cổng chính hãng: model đang nghĩ, chữ ẩn) — nói đúng điều đang xảy ra, không xoay câu vui.
  if (t.nghiThat && t.pha === 'nghi') return L('Đang suy nghĩ', 'Thinking');
  switch (t.pha) {
    case 'duyet': return L('Đang chờ bạn duyệt', 'Waiting for your approval');
    case 'viet': return L('Đang viết câu trả lời', 'Writing');
    case 'tool': return viecTool(t.toolDang) ?? (t.toolDang.startsWith('mcp__') ? L('Đang gọi công cụ ngoài', 'Calling external tool') : L('Đang làm', 'Working'));
    case 'nghi':
      if (t.toolCuoi && TOOL_GHI.has(t.toolCuoi)) return L('Đang code', 'Coding');
      if (t.toolCuoi === 'run_command') return L('Đang xem kết quả lệnh', 'Reading command output');
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
