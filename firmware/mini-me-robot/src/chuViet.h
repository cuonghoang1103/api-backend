#pragma once
/**
 * ============================================================
 * CHỮ TIẾNG VIỆT CÓ DẤU trên màn ngực (01/10/2026)
 * ============================================================
 *
 * Font sẵn của Arduino_GFX chỉ có ASCII, nên mọi nhãn cũ phải viết không
 * dấu ("DANG NGHE"). Người dùng muốn màn hình trông CHUYÊN NGHIỆP — và
 * muốn đọc được robot nghe ra câu gì, đang nói câu gì. Phụ đề không dấu
 * thì đọc như đánh đố.
 *
 * Font: Be Vietnam Pro SemiBold 21px, khử răng cưa 16 mức, sinh bởi
 * `shell/phong-viet/dung.py` ra `phong_viet.h` (~30 KB flash).
 *
 * ⚠️ Vẽ cả DÒNG vào một đệm RAM rồi đẩy MỘT lần SPI — không vẽ từng điểm.
 * Vẽ từng điểm là hàng nghìn lệnh SPI nhỏ, và lúc robot đang nói thì
 * vòng loop() mà bị giữ lâu là loa đói đệm, nghe "giật giật" (đã dính
 * một lần với drawFace — xem face.cpp).
 */
#include <Arduino_GFX_Library.h>

namespace chuViet {

/** Chiều cao một dòng chữ (px), kể cả chữ hoa hai dấu và dấu nặng. */
int caoDong();

/** Độ rộng (px) khi vẽ `n` byte đầu của chuỗi UTF-8 (n < 0: cả chuỗi). */
int doRong(const char* utf8, int n = -1);

/**
 * Bao nhiêu BYTE đầu của chuỗi vừa một dòng rộng `w` px — ngắt ở khoảng
 * trắng nếu được, không thì ngắt giữa từ. Dùng để chia phụ đề thành trang.
 */
int vuaDong(const char* utf8, int w);

enum Canh : uint8_t { TRAI, GIUA, PHAI };

/**
 * Tô ô (x, y, w, caoDong()) bằng `nen` rồi vẽ `n` byte đầu của chuỗi
 * (n < 0: cả chuỗi) màu `mau`. Chữ tràn thì bị cắt ở mép ô.
 * Trả về độ rộng chữ đã vẽ.
 */
int ve(Arduino_GFX* tft, int x, int y, int w, const char* utf8, uint16_t mau, uint16_t nen,
       Canh canh = TRAI, int n = -1);

}  // namespace chuViet
