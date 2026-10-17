/**
 * Câu trạng thái "Đang …", nhãn tool, giờ/thời lượng — y như khung chat VS
 * Code (`webview/main.ts`) để người dùng chuyển qua lại không thấy lạ.
 */

/** Câu chờ lúc model đang nghĩ (chưa gọi tool, chưa có chữ) — đổi mỗi vài giây cho thấy nó còn sống. */
export const NGHI = ['Đang suy nghĩ', 'Đang ngẫm nghĩ', 'Đang sắp xếp ý', 'Đang lục trí nhớ', 'Đang cân nhắc', 'Đang phân tích', 'Đang tìm cách hay nhất', 'Đang học ngữ cảnh'];
export const SAO = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

export const VIEC_TOOL: Record<string, string> = {
  read_file: 'Đang đọc file', list_dir: 'Đang xem thư mục', grep: 'Đang tìm trong mã', glob: 'Đang tìm file',
  edit_file: 'Đang code', create_file: 'Đang tạo file', sua_nhieu_cho: 'Đang code', xoa_file: 'Đang xoá file', doi_ten_file: 'Đang đổi tên file',
  run_command: 'Đang chạy lệnh', chay_lenh_nen: 'Đang chạy lệnh nền', git_status: 'Đang xem git', git_diff: 'Đang xem thay đổi',
  git_commit: 'Đang commit', git_day: 'Đang đẩy lên GitHub', tao_pr: 'Đang mở Pull Request', github_ket_noi: 'Đang kết nối GitHub',
  github_dang_du_an: 'Đang đưa dự án lên GitHub', cai_cong_cu: 'Đang cài công cụ', web_mo: 'Đang mở trang web', web_doc: 'Đang đọc trang web',
  doc_web: 'Đang đọc trang web', tim_web: 'Đang tra cứu trên web', giao_viec_phu: 'Agent phụ đang làm', cap_nhat_ke_hoach: 'Đang lập kế hoạch',
  dung_ky_nang: 'Đang dùng skill', ghi_nho: 'Đang ghi nhớ bài học', doc_anh: 'Đang xem ảnh', sua_anh: 'Đang sửa ảnh',
};
export const TOOL_GHI = new Set(['edit_file', 'create_file', 'sua_nhieu_cho', 'xoa_file', 'doi_ten_file']);
export const TOOL_LENH = new Set(['run_command', 'chay_lenh_nen']);
export const NHAN_TOOL: Record<string, string> = {
  read_file: 'Đọc', list_dir: 'Thư mục', grep: 'Tìm', glob: 'Tìm file', edit_file: 'Sửa', create_file: 'Tạo',
  sua_nhieu_cho: 'Sửa', xoa_file: 'Xoá', doi_ten_file: 'Đổi tên', run_command: 'Lệnh', chay_lenh_nen: 'Lệnh nền',
  git_status: 'Git', git_diff: 'Diff', git_commit: 'Commit', git_day: 'Đẩy GitHub', tao_pr: 'Pull Request',
  github_ket_noi: 'GitHub', github_dang_du_an: 'Lên GitHub', cai_cong_cu: 'Cài công cụ', web_mo: 'Mở web',
  web_doc: 'Đọc web', tim_web: 'Tìm web', doc_web: 'Đọc web', giao_viec_phu: 'Agent phụ', dung_ky_nang: 'Skill',
  cap_nhat_ke_hoach: 'Kế hoạch', ghi_nho: 'Ghi nhớ', doc_anh: 'Xem ảnh', sua_anh: 'Sửa ảnh',
};

export function nhanTool(ten: string): string {
  if (ten.startsWith('mcp__')) return ten.split('__').slice(1).join(' · ');
  return NHAN_TOOL[ten] ?? ten;
}

export type Pha = 'cho' | 'nghi' | 'viet' | 'tool' | 'duyet';

export function cauTrangThai(t: { pha: Pha; toolDang: string; toolCuoi: string; batDauLuot: number }, bayGio = Date.now()): string {
  switch (t.pha) {
    case 'duyet': return 'Đang chờ bạn duyệt';
    case 'viet': return 'Đang viết câu trả lời';
    case 'tool': return VIEC_TOOL[t.toolDang] ?? (t.toolDang.startsWith('mcp__') ? 'Đang gọi công cụ ngoài' : 'Đang làm');
    case 'nghi':
      if (t.toolCuoi && TOOL_GHI.has(t.toolCuoi)) return 'Đang code';
      if (t.toolCuoi === 'run_command') return 'Đang xem kết quả lệnh';
      if (t.toolCuoi) return 'Đang đọc mã dự án';
      return NGHI[Math.floor((bayGio - t.batDauLuot) / 3500) % NGHI.length]!;
    default: return 'Đang khởi động';
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
  return { lenh, ra: (trong < 0 ? sau : sau.slice(trong + 2)).replace(/^\(không có đầu ra\)$/, '') };
}

/** Kết quả tool có vẻ hỏng không (để tô chấm đỏ). */
export const coVeHong = (tomTat: string): boolean => /^(lỗi|error|thất bại|failed|bị chặn|bị từ chối|không có quyền)|exit code [1-9]|mã thoát [1-9]|hết giờ/i.test(tomTat);
