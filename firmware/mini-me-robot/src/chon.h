#pragma once
/**
 * ============================================================
 * KHUNG CHỌN TRÊN MÀN NGỰC (15/11/2026)
 * ============================================================
 *
 * Server gửi {t:"chon_mo", id, q, o:[...], ms}: robot che vùng mắt (480×240) bằng câu hỏi + 2–4 nút
 * (Có/Không, A/B/C/D…). Chạm một nút ⇒ {t:"chon", id, i}. Server chấm rồi gửi
 * {t:"chon_ket", id, dung, chon, mat}: nút đúng tô XANH, nút chọn sai tô ĐỎ, 1,6 giây sau đóng khung và
 * mắt hiện biểu cảm `mat` (vui / tức). {t:"chon_dong"} ⇒ đóng ngay (đã trả lời bằng giọng, hoặc hết hạn).
 *
 * Trả lời bằng GIỌNG vẫn được — dải dưới (nút nói) không bị che. Cảm ứng chỉ là đường thứ hai.
 * Lúc khung mở `eyes::loop()` KHÔNG chạy (main.cpp) — hai bên cùng vẽ một vùng thì nhấp nháy.
 */
#include <Arduino_GFX_Library.h>

namespace chon {

void begin(Arduino_GFX* tft, int yTren, int cao);

/** Mở khung. `luaChon` tối đa 4, mỗi cái ≤ 60 byte UTF-8. */
void mo(uint32_t id, const char* cauHoi, const char* const* luaChon, int n, uint32_t msHan);

/** Kết quả từ server: `dung` < 0 = không có đáp án đúng (câu Có/Không). */
void ketQua(uint32_t id, int dung, int daChon, const char* mat);

void dong();
bool dangMo();

/** Toạ độ màn của một cú chạm vùng mắt ⇒ chỉ số nút (−1 = trượt). Đánh dấu nút đang chờ. */
int cham(int x, int y);
uint32_t idHienTai();

/** Mỗi vòng loop: hết hạn, đóng sau khi hiện kết quả. Trả true đúng lần khung vừa ĐÓNG (main vẽ lại mắt). */
bool tick();

/** Biểu cảm cần đặt cho mắt lúc khung vừa đóng ("" = không). */
const char* matSauKhiDong();

}  // namespace chon
