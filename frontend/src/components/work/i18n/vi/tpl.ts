import type { tpl as En } from '../en/tpl';
import type { Strings } from '../core';

export const tpl: Strings<typeof En> = {
  default: 'Mặc định',
  custom: 'Tuỳ chỉnh',
  savedT: 'Đã lưu mẫu cho {t}',
  offT: 'Đã tắt mẫu cho {t}',
  saveFailed: 'Không lưu được mẫu',
  resetDone: 'Đã đặt lại mẫu về mặc định',
  removed: 'Đã gỡ mẫu',
  resetFailed: 'Không đặt lại được mẫu',
  discardQ: 'Bỏ các thay đổi của mẫu này?',
  resetDefault: 'Đặt lại về mặc định',
  removeTpl: 'Gỡ mẫu',
  prefills: 'Điền sẵn mô tả khi có người tạo',
  leaveEmpty: ' Để trống để tắt mẫu cho loại này.',
  onlyAdmins: ' Chỉ quản trị dự án được đổi.',
  noTplPh: 'Không có mẫu — mô tả bắt đầu trống.',
  noTpl: 'Loại này không có mẫu.',
  lookingDefault: 'Bạn đang xem mẫu mặc định của CT Work. Lưu sẽ tạo bản tuỳ chỉnh cho dự án này.',
};
