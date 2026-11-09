/**
 * Chữ của giao diện Trò chuyện kiểu Claude (`Ctc*`, 09/11/2026).
 *
 * Từ điển RIÊNG, nhỏ, đi cùng các component `Ctc*`: cùng cơ chế với `dich()` —
 * tiếng Việt là khoá, tiếng Anh là bản dịch, câu lạ trả lại nguyên tiếng Việt.
 * Ngôn ngữ đang chọn lấy từ `useDich()` nên đổi ngôn ngữ là đổi theo ngay.
 *
 * Muốn gộp vào `i18n/tuDien.ts` sau này thì chép nguyên khối dưới sang đó và
 * thay `c(` bằng `dich(` — các khoá đã là câu tiếng Việt đầy đủ.
 */
import { useCallback } from 'react';
import { useDich } from '../../i18n';

const EN: Record<string, string> = {
  'Chào bạn, hôm nay mình giúp gì?': 'Hi there, how can I help today?',
  'Cuộc trò chuyện mới': 'New chat',
  'Tìm cuộc trò chuyện…': 'Search chats…',
  'Hôm nay': 'Today',
  '7 ngày qua': 'Previous 7 days',
  '30 ngày qua': 'Previous 30 days',
  'Cũ hơn': 'Older',
  'Đã ghim': 'Pinned',
  'Đổi tên': 'Rename',
  'Ghim': 'Pin',
  'Bỏ ghim': 'Unpin',
  'Xoá': 'Delete',
  'Lưu trữ': 'Archive',
  'Bỏ lưu trữ': 'Unarchive',
  'Tách nhánh': 'Branch off',
  'Chuyển vào thư mục': 'Move to folder',
  'Bỏ khỏi thư mục': 'Remove from folder',
  'Xoá cuộc trò chuyện này?': 'Delete this chat?',
  'Không thể hoàn tác.': 'This cannot be undone.',
  'Huỷ': 'Cancel',
  'Thư mục': 'Folders',
  'Tất cả': 'All',
  'Chưa phân loại': 'Uncategorised',
  'Kho lưu trữ': 'Archive',
  'Về danh sách': 'Back to the list',
  'Thư mục mới…': 'New folder…',
  'Xoá thư mục (các cuộc bên trong về Chưa phân loại)': 'Delete folder (its chats become uncategorised)',
  'Chưa có cuộc trò chuyện nào.': 'No chats yet.',
  'Không khớp cuộc nào.': 'No matching chats.',
  'Kho lưu trữ đang trống.': 'The archive is empty.',
  'Thu gọn thanh bên': 'Collapse sidebar',
  'Mở thanh bên': 'Open sidebar',
  'Thao tác': 'Options',
  'Chép': 'Copy',
  'Đã chép': 'Copied',
  'Tạo lại câu trả lời': 'Regenerate response',
  'Sửa tin nhắn': 'Edit message',
  'Lưu & gửi': 'Save & send',
  'Tách nhánh từ đây (cuộc hiện tại giữ nguyên)': 'Branch off from here (this chat stays intact)',
  'Nhắn cho CuongMini…': 'Message CuongMini…',
  'Trả lời…': 'Reply…',
  'Gửi': 'Send',
  'Dừng': 'Stop',
  'Đính kèm & công cụ': 'Attachments & tools',
  'Tải ảnh hoặc tệp lên': 'Upload images or files',
  'Chụp màn hình': 'Take a screenshot',
  'Nói chuyện rảnh tay': 'Hands-free voice chat',
  'Cần Pro': 'Needs Pro',
  'Tối đa 4 ảnh · 3 tài liệu mỗi lượt': 'Up to 4 images · 3 documents per message',
  'Chọn model': 'Choose a model',
  'Xuống cuối': 'Scroll to bottom',
  'CuongMini có thể nhầm. Hãy kiểm tra lại thông tin quan trọng.':
    'CuongMini can make mistakes. Please double-check important information.',
  'Thả file vào đây': 'Drop files here',
  'Đính kèm file cần tài khoản Pro': 'Attaching files needs a Pro account',
  'Đính kèm file cần tài khoản Pro.': 'Attaching files needs a Pro account.',
  'Nhanh · mặc định': 'Fast · default',
  'Nhanh, thông minh · việc hằng ngày': 'Fast and smart · everyday tasks',
  'Cân bằng · viết, code, phân tích': 'Balanced · writing, code, analysis',
  'Mạnh nhất · bài khó, đọc file dài': 'Most capable · hard problems, long files',
  '{ten} cần tài khoản Pro — lượt này dùng {thuong}.': '{ten} needs a Pro account — this reply used {thuong}.',
  '{ten} đang tạm bận — lượt này dùng {thuong}.': '{ten} is busy right now — this reply used {thuong}.',
  '{ten} đã chạm hạn mức hôm nay — lượt này dùng {thuong}.': '{ten} hit today\'s limit — this reply used {thuong}.',
  ' File đính kèm có thể không được đọc.': ' Attachments may not have been read.',
  'Cuộc này chưa được lưu nên chưa tách nhánh được — hãy gửi một câu trước.':
    'This chat is not saved yet, so it cannot be branched — send a message first.',
  'Không cắt được trên máy chủ: {loi}': 'Could not trim the chat on the server: {loi}',
  'Cuộc chưa đặt tên': 'Untitled chat',
  'Đang tìm trên web': 'Searching the web',
  'Đang đọc': 'Reading',
};

/** `c('câu')` / `cP('câu {x}', { x })` — xem đầu tệp. */
export function useCtcChu() {
  const { nn } = useDich();
  const c = useCallback((cau: string): string => (nn === 'en' ? EN[cau] ?? cau : cau), [nn]);
  const cP = useCallback(
    (cau: string, thay: Record<string, string | number>): string =>
      c(cau).replace(/\{(\w+)\}/g, (nguyen, ten: string) => (ten in thay ? String(thay[ten]) : nguyen)),
    [c],
  );
  return { c, cP, nn };
}
