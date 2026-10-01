#pragma once
/**
 * ============================================================
 * CẢM ỨNG MÀN NGỰC — FT6336U qua I2C
 * ============================================================
 *
 * Hai vùng (01/10/2026):
 *
 *   VÙNG MẮT — cử chỉ cho một con robot LÀM BẠN, không có nút:
 *     chạm và kéo     → hai mắt NHÌN THEO ngón tay
 *     giữ yên ≥1,2s   → "được vuốt ve": mắt trái tim 3 giây
 *     chạm hai lần    → nháy mắt
 *
 *   DẢI DƯỚI (đồng hồ · trạng thái · pin) — là NÚT:
 *     chạm một cái    → nói (robot nghe ngay, khỏi gọi "Odin") hoặc,
 *                       nếu robot đang nói, bắt nó im
 *     vuốt lên/xuống  → âm lượng ±5% mỗi nấc
 *
 * Vì sao có nút: ở quán cà phê, gọi "Odin" giữa tiếng ồn hay trượt, còn
 * cổng đánh thức mà mở rộng thì robot trả lời cả bàn bên (đo 01/10).
 *
 * Không có chân INT (`PIN_CTP_INT = -1`, xem config.h): hỏi vòng qua
 * I2C ~30 lần/giây. Đủ mượt cho ngón tay, rẻ cho CPU.
 */
#include <Arduino.h>
#include "config.h"

namespace camUng {

/**
 * Toạ độ THÔ của tấm cảm ứng → toạ độ MÀN, theo ba cờ trong config.h.
 *
 * Để `inline` trong header vì bàn thử `thu_cham.cpp` dùng CHUNG đúng phép
 * này: hiệu chỉnh trên bàn thử mà firmware lại dùng phép khác thì chỉnh
 * xong vẫn sai, và không có gì báo.
 *
 * Tấm cảm ứng dọc 320×480; màn xoay ngang `W`×`H` (480×320 ở hướng 1).
 */
inline void anhXa(uint16_t rx, uint16_t ry, int W, int H, int& sx, int& sy) {
  const long ngang = CHAM_DOI_TRUC ? ry : rx;
  const long rangN = CHAM_DOI_TRUC ? 480 : 320;
  const long doc = CHAM_DOI_TRUC ? rx : ry;
  const long rangD = CHAM_DOI_TRUC ? 320 : 480;
  sx = (int)(ngang * W / rangN);
  sy = (int)(doc * H / rangD);
  if (CHAM_LAT_X) sx = W - 1 - sx;
  if (CHAM_LAT_Y) sy = H - 1 - sy;
  if (sx < 0) sx = 0;
  if (sx >= W) sx = W - 1;
  if (sy < 0) sy = 0;
  if (sy >= H) sy = H - 1;
}

/** Dò FT6336U. `false` = không thấy — robot vẫn chạy, chỉ không cảm ứng. */
bool begin(int W, int H);

/** Gọi mỗi vòng loop. Tự ghìm nhịp, nên gọi dày cũng không tốn. */
void tick();

/**
 * Việc của hai cử chỉ ở dải dưới — `main.cpp` lo, vì chỉ nó có WebSocket
 * và biết robot đang nói hay đang nghe. `buoc` = số nấc (+ lên, − xuống).
 */
void datSuKien(void (*khiChamDai)(), void (*khiDoiAmLuong)(int buoc));

}  // namespace camUng
