/**
 * Danh mục của trang "Tùy chỉnh" (/chat → Tùy chỉnh) — CHỈ những thứ CuongMini THẬT SỰ có (10/11/2026).
 *
 * - Kỹ năng (`loai: 'ky-nang'`): đúng danh sách trắng `KY_NANG_TRO_LY` của máy chủ
 *   (src/services/troLy/kyNangTroLy.ts). Chọn kỹ năng ⇒ gửi `kyNang: <id>` ⇒ máy chủ nối khối luật tương ứng.
 * - Công cụ (`loai: 'cong-cu'`): khả năng luôn có của khung chat (sơ đồ, công thức, chạy Python, gọi thoại).
 * - Trình kết nối / Plugin: sản phẩm có thật của CuongThai, mỗi cái trỏ tới đúng trang dùng/tải nó.
 * KHÔNG có số lượt cài: chưa đo, nên không hiện (không bịa số).
 */
export type MauThe = 'violet' | 'blue' | 'green' | 'amber' | 'rose' | 'teal' | 'slate';

export interface KyNangThe {
  id: string;
  ten: string;
  mota: string;
  icon: 'image' | 'code' | 'sigma' | 'languages' | 'japan' | 'pen' | 'workflow' | 'terminal' | 'mic' | 'globe';
  mau: MauThe;
  loai: 'ky-nang' | 'cong-cu';
  /** Câu mẫu cho nút "Dùng thử". */
  viDu: string;
  /** Cần tài khoản Pro (ảnh đi đường Claude). */
  canPro?: boolean;
  moi?: boolean;
}

export const KY_NANG: KyNangThe[] = [
  { id: 'code', ten: 'Lập trình', mota: 'Nguyên nhân → cách sửa → đoạn mã đã sửa, có tô màu. Không bịa API, nêu cạm bẫy hay gặp.', icon: 'code', mau: 'violet', loai: 'ky-nang', viDu: 'Vì sao useEffect của mình chạy hai lần trong React 18? Sửa thế nào?' },
  { id: 'toan', ten: 'Toán học', mota: 'Giải từng bước có đánh số, công thức LaTeX, chốt bằng dòng Đáp số và tự kiểm lại.', icon: 'sigma', mau: 'blue', loai: 'ky-nang', viDu: 'Giải phương trình x² − 5x + 6 = 0 và kiểm lại nghiệm.' },
  { id: 'anh', ten: 'Đọc ảnh', mota: 'Chép đề trong ảnh, đọc ảnh chụp màn hình lỗi, sơ đồ, chữ viết tay — chỗ mờ thì nói rõ.', icon: 'image', mau: 'teal', loai: 'ky-nang', viDu: 'Mình gửi ảnh đề bài, bạn chép lại và giải giúp nhé.', canPro: true },
  { id: 'tieng-anh', ten: 'Gia sư tiếng Anh', mota: 'Từ vựng kèm IPA và ví dụ, ngữ pháp ngắn gọn, sửa câu tiếng Anh và giải thích từng lỗi.', icon: 'languages', mau: 'green', loai: 'ky-nang', viDu: 'Sửa giúp câu: "I am agree with you about this problem."' },
  { id: 'tieng-nhat', ten: 'Gia sư tiếng Nhật', mota: 'Kanji kèm cách đọc, mẫu câu theo cấp JLPT, Hán Việt, ví dụ có dịch.', icon: 'japan', mau: 'rose', loai: 'ky-nang', viDu: 'Giải thích mẫu 〜てもいい và cho 2 ví dụ.', moi: true },
  { id: 'tieng-viet', ten: 'Tiếng Việt chuẩn', mota: 'Sửa chính tả, dấu, câu chữ; viết lại văn bản đúng văn phong mà không thêm ý bịa.', icon: 'pen', mau: 'amber', loai: 'ky-nang', viDu: 'Sửa chính tả và viết lại cho trang trọng: "em xin fép nghỉ hok hôm nay ạ"', moi: true },
  { id: 'so-do', ten: 'Sơ đồ & biểu đồ', mota: 'Vẽ sơ đồ luồng, ERD, sequence bằng Mermaid hoặc hình SVG ngay trong câu trả lời.', icon: 'workflow', mau: 'slate', loai: 'cong-cu', viDu: 'Vẽ sơ đồ ERD cho hệ thống thư viện: Sách, Độc giả, Phiếu mượn.' },
  { id: 'python', ten: 'Chạy Python', mota: 'Khối mã Python trong câu trả lời có nút Chạy — chạy ngay trong trình duyệt, không cần cài gì.', icon: 'terminal', mau: 'blue', loai: 'cong-cu', viDu: 'Viết đoạn Python tính dãy Fibonacci 20 số đầu để mình bấm chạy thử.' },
  { id: 'goi-thoai', ten: 'Gọi thoại', mota: 'Nói chuyện bằng giọng với CuongMini — nói xong cứ im, nó tự hiểu là hết câu.', icon: 'mic', mau: 'violet', loai: 'cong-cu', viDu: '' },
];

export const ID_KY_NANG_MAY_CHU = new Set(['anh', 'code', 'toan', 'tieng-anh', 'tieng-nhat', 'tieng-viet']);

export interface KetNoiThe {
  id: string;
  ten: string;
  mota: string;
  icon: 'globe' | 'github' | 'kanban' | 'download';
  mau: MauThe;
  /** 'cong-tac' = bật/tắt ngay ở đây; 'lien-ket' = mở trang dùng nó. */
  kieu: 'cong-tac' | 'lien-ket';
  href?: string;
  nhanNut?: string;
  ghiChu?: string;
}

export const KET_NOI: KetNoiThe[] = [
  { id: 'web', ten: 'Tìm kiếm web', mota: 'Cho CuongMini tìm tin mới khi câu hỏi cần, kèm thẻ nguồn để bạn bấm kiểm lại.', icon: 'globe', mau: 'blue', kieu: 'cong-tac' },
  { id: 'github', ten: 'GitHub', mota: 'Gắn một kho mã công khai vào phiên Code: CuongMini đọc README và cây thư mục để trả lời đúng dự án.', icon: 'github', mau: 'slate', kieu: 'lien-ket', href: '#code', nhanNut: 'Mở Code', ghiChu: 'Kho riêng tư: sắp có' },
  { id: 'ct-work', ten: 'CT Work', mota: 'Quản lý dự án kiểu Jira của CuongThai. App CuongMini nối vào bằng token cá nhân (lệnh /ctwork) để đọc thẻ, cập nhật việc.', icon: 'kanban', mau: 'violet', kieu: 'lien-ket', href: '/work', nhanNut: 'Mở CT Work' },
];

export interface PluginThe {
  id: string;
  ten: string;
  mota: string;
  href: string;
  nhanNut: string;
  mau: MauThe;
  icon: 'desktop' | 'terminal' | 'vscode' | 'kanban';
}

export const PLUGIN: PluginThe[] = [
  { id: 'desktop', ten: 'CuongMini Desktop', mota: 'App cho macOS/Windows: AI Code làm việc trực tiếp trên mã trong máy bạn, robot trợ lý, gọi thoại.', href: '/download', nhanNut: 'Tải app', mau: 'violet', icon: 'desktop' },
  { id: 'vscode', ten: 'CuongMini Code cho trình soạn', mota: 'Cài một chạm vào VS Code, Cursor, Windsurf, VSCodium — hỏi và sửa mã ngay trong trình soạn.', href: '/ai-code', nhanNut: 'Xem cách cài', mau: 'blue', icon: 'vscode' },
  { id: 'cli', ten: 'CuongMini CLI', mota: 'Dùng AI Code ngay trong terminal của bạn.', href: '/ai-code', nhanNut: 'Xem cách cài', mau: 'slate', icon: 'terminal' },
  { id: 'ct-work-app', ten: 'CT Work Desktop', mota: 'App riêng cho CT Work: bảng việc, sprint, báo cáo — chạy song song với app CuongMini.', href: '/download/ct-work', nhanNut: 'Tải app', mau: 'green', icon: 'kanban' },
];
