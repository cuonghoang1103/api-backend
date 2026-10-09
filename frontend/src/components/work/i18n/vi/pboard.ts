import type { pboard as En } from '../en/pboard';
import type { Strings } from '../core';

export const pboard: Strings<typeof En> = {
  saved: 'Đã lưu cột board',
  saveFailed: 'Không lưu được cột board',
  newColumn: 'Cột mới',
  title: 'Cột board',
  desc: 'Chọn cách trạng thái ánh xạ vào cột trên board. Gộp nhiều trạng thái vào một cột, hoặc giữ mỗi trạng thái một cột.',
  perStatus: 'Mỗi trạng thái một cột',
  custom: 'Dùng cột tuỳ chỉnh',
  eachStatus: 'Mỗi trạng thái của workflow mặc định thành một cột. Trạng thái của workflow khác vào cột gần khớp nhất.',
  columns: 'Cột',
  moveUp: 'Chuyển {n} lên',
  moveDown: 'Chuyển {n} xuống',
  colName: 'Tên cột',
  noLimit: 'Không giới hạn',
  wipTip: 'Giới hạn WIP (để trống = không giới hạn)',
  wipFor: 'Giới hạn WIP của {n}',
  removeCol: 'Xoá cột {n}',
  removeColT: 'Xoá cột',
  addColumn: 'Thêm cột',
  mapping: 'Ánh xạ trạng thái',
  colFor: 'Cột cho {n}',
  chooseCol: 'Chọn cột…',
  untitledCol: 'Cột chưa đặt tên',
  unassigned: '{count} trạng thái chưa thuộc cột nào — thẻ ở đó sẽ biến khỏi board.',
};
