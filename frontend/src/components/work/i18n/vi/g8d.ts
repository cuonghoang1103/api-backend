import type { g8d as En } from '../en/g8d';
import type { Strings } from '../core';

/** CTW đợt 8D (19/10/2026): CT Work gọn — thanh bên dự án (ghim/bỏ ghim, "Thêm…"), tìm cài đặt, menu bộ lọc. */
export const g8d: Strings<typeof En> = {
  mainNav: 'Trang chính',
  more: 'Thêm…',
  moreN: 'Thêm trang ({n})',
  moreHide: 'Thu gọn',
  findItem: 'Tìm trang…',
  noMatch: 'Không có trang nào khớp.',
  pinX: 'Ghim {l} lên thanh bên',
  unpinX: 'Bỏ ghim {l}',
  pinTip: 'Ghim lên thanh bên',
  unpinTip: 'Bỏ ghim — cất vào Thêm…',
  resetPins: 'Khôi phục mặc định',
  searchSettings: 'Tìm cài đặt…',
  noSettingMatch: 'Không có cài đặt nào khớp “{q}”.',
  gAi: 'AI & agent',
  filters: 'Bộ lọc',
  filtersTitle: 'Thêm bộ lọc — loại người làm, loại thẻ, lọc nhanh, nhãn, bộ phận',
  fQuick: 'Lọc nhanh',
  fType: 'Loại thẻ',
  fAssignee: 'Người thực hiện',
  fLabels: 'Nhãn',
  fTeam: 'Bộ phận',
  clearAll: 'Xoá bộ lọc',
  moreIssue: 'Thao tác khác',
};
