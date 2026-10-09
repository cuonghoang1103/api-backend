import type { pexport as En } from '../en/pexport';
import type { Strings } from '../core';

export const pexport: Strings<typeof En> = {
  downloaded: 'Đã tải Project Tracking',
  failed: 'Không xuất được Project Tracking',
  ptDesc: 'Tệp Excel giảng viên yêu cầu mỗi vòng lặp, dựng từ board này — không phải chép tay nữa.',
  product: '— mỗi yêu cầu một dòng (thẻ gắn nhãn',
  productB: 'hoặc có Screen ID): PIC, iteration, Complexity, Planned LOC, Quality, Graded LOC, trạng thái, tiến độ SRS · SDS · Coding · Test · Integrate, Evidence.',
  summaryDesc: '— theo người: số yêu cầu, đã xong, LOC kế hoạch mỗi vòng lặp, LOC được chấm, và số đạt Quality L2 trở lên.',
  missing: 'Dự án chưa có trường {f} — các cột đó sẽ trống. Thêm ở Cài đặt → Trường (tên phải khớp).',
  downloadPt: 'Tải Project Tracking (.xlsx)',
  renameHint: 'Đổi tên thành {f} trước khi nộp. Muốn danh sách thẻ thường, dùng Xuất ở trang Thẻ.',
  started: 'Đã bắt đầu xuất — chạy nền',
  wholeTitle: 'Xuất cả dự án (sao lưu)',
  wholeDesc: 'Một tệp ZIP chứa mọi bảng của dự án dạng JSON — thẻ, bình luận, lịch sử, nhật ký giờ, sprint, phiên bản, giai đoạn, phê duyệt, bàn giao, tài liệu và các phiên bản, change request, RAID, cuộc họp, tài chính và báo cáo — kèm danh sách tệp đính kèm. Chỉ quản trị dự án; mỗi lần xuất và tải đều ghi vào nhật ký kiểm tra.',
  inclFiles: 'Kèm tệp đính kèm',
  whenTotal: '(khi tổng dung lượng từ {s} trở xuống — nếu không chỉ kèm danh sách)',
  exportN: 'Bản xuất #{n}',
  progress: 'Tiến độ xuất',
  filesLine: ' · {a}/{b} tệp',
  listed: ' · liệt kê {n} tệp đính kèm',
  failedX: 'Thất bại:',
};
