#pragma once
/**
 * ============================================================
 * LÚC RẢNH — cho robot trông như đang SỐNG (01/10/2026)
 * ============================================================
 *
 * Người dùng muốn một con robot "làm bạn". Robot chỉ động đậy khi được
 * hỏi thì trông như cái loa có mắt. Module này lo những lúc không ai nói
 * chuyện với nó:
 *
 *   thức, rảnh     → thỉnh thoảng đảo mắt nhìn quanh phòng (8–20 giây/lần)
 *   tiếng động lớn → giật mình (mắt tròn xoe), mỗi 45 giây tối đa một lần
 *   lâu không ai   → ngủ hẳn (mắt nhắm, dải ghi "ĐANG NGỦ"): 5 phút ban
 *                    ngày, 1 phút ban đêm (23h–6h)
 *   chạm / có người nói thật với nó → dậy (giật mình nhẹ rồi tỉnh)
 *
 * Chỉ dùng mắt và đồng hồ — không tốn lượt gọi server nào. Lượt VAD rác ở
 * quán KHÔNG đánh thức: chỉ những gì chắc chắn là người (chạm, lượt server
 * đã nhận, robot cất tiếng) mới gọi `coNguoi()`.
 */
#include <Arduino.h>

namespace songDong {

/**
 * Gọi mỗi vòng loop. `ranh` = không nghe, không nghĩ, không nói. `mucMic`
 * và `nen` cùng thang 24 bit (audio::level(), audio::noise()).
 */
void tick(bool ranh, int32_t mucMic, int32_t nen);

/** Giờ địa phương (0–23) từ đồng hồ mạng; -1 = chưa biết. */
void datGio(int gio);

/** Có người thật đang tương tác — đếm lại thời gian rảnh, đang ngủ thì dậy. */
void coNguoi();

bool dangNgu();

}  // namespace songDong
