import type { invite as En } from '../en/invite';
import type { Strings } from '../core';

export const invite: Strings<typeof En> = {
  expired: 'Lời mời đã hết hạn',
  expiredBody: 'Lời mời chỉ có hiệu lực trong thời gian giới hạn. Hãy nhờ người mời gửi lời mời mới.',
  used: 'Lời mời đã được dùng',
  usedBody: 'Mỗi link mời chỉ dùng được số lần nhất định. Nếu bạn đã tham gia, hãy mở không gian của bạn; nếu chưa, hãy xin link mới.',
  notFound: 'Không tìm thấy lời mời',
  notFoundBody: 'Link có thể bị thiếu, hoặc lời mời đã bị huỷ. Kiểm tra bạn đã chép đủ link, hoặc xin link mới.',
  joined: 'Bạn đã tham gia {name}',
  theWs: 'không gian',
  acceptFailed: 'Không chấp nhận được lời mời',
  loading: 'Đang tải lời mời',
  goWs: 'Tới không gian của bạn',
  backHome: 'Về trang chủ',
  invitedYou: 'đã mời bạn',
  joinA: 'Tham gia',
  joinB: 'trên CT Work',
  nPeople: '{count} người',
  restricted: 'Lời mời này gửi tới một địa chỉ email cụ thể. Đăng nhập — hoặc tạo tài khoản — bằng đúng địa chỉ đó để chấp nhận.',
  accept: 'Chấp nhận lời mời',
  signIn: 'Đăng nhập để chấp nhận',
  register: 'Tạo tài khoản miễn phí',
  newHint: 'Chưa có tài khoản? Đăng ký bằng email được mời, xác minh email rồi bạn sẽ quay lại đây để chấp nhận.',
  notExpecting: 'Không phải bạn chờ? Cứ đóng trang này — không có gì xảy ra cho tới khi bạn chấp nhận.',
};
