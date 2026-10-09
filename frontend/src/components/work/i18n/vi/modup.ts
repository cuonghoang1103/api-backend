import type { modup as En } from '../en/modup';
import type { Strings } from '../core';

export const modup: Strings<typeof En> = {
  turnedOn: 'Đã bật {count} mô-đun',
  nothingNew: 'Không có gì mới để bật',
  failed: 'Không bật được các mô-đun',
  available: 'Mô-đun có sẵn',
  offLine: '{count} mô-đun có sẵn nhưng đang tắt trong dự án này.',
  recommendedLine: '{count} mô-đun được khuyên dùng cho dự án {kind} và có sau khi dự án được tạo.',
  nothingChanges: 'Không gì thay đổi cho tới khi bạn bật.',
  enableAll: 'Bật mọi mô-đun khuyên dùng cho loại dự án này',
  recommended: 'Khuyên dùng',
  newSince: 'Mới có sau khi tạo dự án',
  adminCan: 'Quản trị dự án có thể bật các mô-đun này.',
};
