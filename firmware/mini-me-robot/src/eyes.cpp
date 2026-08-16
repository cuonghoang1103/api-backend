#include "eyes.h"

#include <Arduino_GFX_Library.h>
#include <esp_random.h>
#include <math.h>
#include <strings.h>

#include "config.h"
#include "dai_ve.h"

namespace eyes {

// ============================================================
// Hằng số hình học
// ============================================================
//
// Màn GC9A01 là 240×240 nhưng KÍNH LÀ HÌNH TRÒN — bốn góc của khung
// nhớ có tồn tại mà không ai nhìn thấy. Mọi thứ vẽ ra đều phải nằm
// trong đường tròn bán kính 120, nếu không nó biến mất mà không có
// lỗi nào báo.
static constexpr int W = 240, H = 240;
static constexpr int CX = 120, CY = 120;

static constexpr int R_VIEN_NGOAI = 119;  // mép kính
static constexpr int R_VIEN_TRONG = 98;   // mép trong của vành ống kính
// 68 chứ không phải 63: ở 63 con mống nổi lềnh bềnh giữa một vòng đen
// rộng 37 px, nhìn như thấu kính bị thụt sâu chứ không như con mắt. Đổi
// lại tầm liếc hẹp đi 7 px — đáng, vì mắt liếc ít mà đầy đặn trông
// sống hơn mắt liếc rộng mà rỗng.
static constexpr int R_MONG = 68;         // mống mắt lúc bình thường
static constexpr int R_DONG_TU = 26;      // đồng tử lúc bình thường

// Mống được phép trôi bao xa trước khi chạm vành. Chạm vành trông như
// mắt lồi ra ngoài hốc — chừa lại 8 px là vừa đủ để không bao giờ chạm.
static constexpr int TRUOT_TOI_DA = R_VIEN_TRONG - R_MONG - 8;

// ⚠️ 24 hàng, KHÔNG PHẢI cả màn. Xem giải thích dài trong eyes.h:
// sprite một dải tốn 11,5 KB thay vì 115 KB, và quan trọng hơn là mỗi
// lần đẩy chỉ giữ CPU ~2,3 ms nên loa không bị đói đệm.
static constexpr int CAO_DAI = 24;
static constexpr int SO_DAI = H / CAO_DAI;  // 10
static_assert(H % CAO_DAI == 0, "CAO_DAI phải chia hết 240");

/**
 * ⚠️⚠️ MẶT NẠ CHỈ 10 BIT — ĐỪNG BAO GIỜ GÁN 0xFFFF.
 *
 * Bản đầu đánh dấu "bẩn hết" bằng `banBan = 0xFFFF`, nhưng chỉ có 10
 * dải nên sáu bit cao KHÔNG BAO GIỜ được xoá. Hệ quả dây chuyền:
 * `banBan == 0` không bao giờ đúng → `khungMoi` không bao giờ bật lại
 * → `dangVe` chỉ được chụp ĐÚNG MỘT LẦN lúc khởi động, và cả 28 biểu
 * cảm sau đó đều vẽ lại cái ảnh chụp đầu tiên ấy.
 *
 * Triệu chứng: mắt lên hình đẹp, chớp đều, mà đổi biểu cảm thì KHÔNG
 * GÌ XẢY RA — trừ hiệu ứng vạch quét/nhiễu, vì hai cái đó đọc thẳng
 * `bieuCam` chứ không qua ảnh chụp. Chính chỗ lệch đó chỉ ra thủ phạm.
 *
 * Bắt được nhờ dựng bộ giả lập chạy đúng mã vẽ này trên máy Mac rồi
 * XUẤT ẢNH RA NHÌN (`scratchpad/mat-preview`). Đọc mã thì không thấy:
 * cả hai dòng liên quan đều đúng nếu xét riêng.
 */
static constexpr uint16_t MAT_NA = (uint16_t)((1u << SO_DAI) - 1);  // 0x03FF

// ============================================================
// Bảng màu
// ============================================================

static inline uint16_t RGB(uint8_t r, uint8_t g, uint8_t b) {
  return (uint16_t)(((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3));
}

/** Pha hai màu RGB565. t=0 trả a, t=1 trả b. */
static uint16_t pha(uint16_t a, uint16_t b, float t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const int ar = (a >> 11) & 0x1F, ag = (a >> 5) & 0x3F, ab = a & 0x1F;
  const int br = (b >> 11) & 0x1F, bg = (b >> 5) & 0x3F, bb = b & 0x1F;
  const int r = ar + (int)((br - ar) * t);
  const int g = ag + (int)((bg - ag) * t);
  const int bl = ab + (int)((bb - ab) * t);
  return (uint16_t)((r << 11) | (g << 5) | bl);
}

static const uint16_t C_NEN = RGB(0, 0, 0);
static const uint16_t C_VIEN_TOI = RGB(18, 22, 30);   // thân ống kính
static const uint16_t C_VIEN_SANG = RGB(64, 74, 92);  // gờ kim loại bắt sáng
static const uint16_t C_DONG_TU = RGB(2, 4, 8);
static const uint16_t C_LOE = RGB(255, 255, 255);

// Mống mắt: sáng ở rìa, tối vào giữa — đúng cách ống kính thật bắt
// sáng. Ngược lại (tối rìa, sáng giữa) trông như đèn pin, không như mắt.
struct Mau {
  uint16_t ria, giua;
};
static const Mau M_XANH   = {RGB(150, 245, 255), RGB(0, 60, 130)};
static const Mau M_AM     = {RGB(255, 214, 130), RGB(120, 45, 0)};   // vàng ấm
static const Mau M_DO     = {RGB(255, 130, 96), RGB(130, 8, 0)};
static const Mau M_HONG   = {RGB(255, 160, 210), RGB(140, 0, 70)};
static const Mau M_LUC    = {RGB(150, 255, 180), RGB(0, 100, 40)};
static const Mau M_TIM    = {RGB(200, 170, 255), RGB(60, 20, 130)};
static const Mau M_XAM    = {RGB(150, 160, 175), RGB(35, 40, 50)};

// ============================================================
// Hình dạng mắt tại một thời điểm
// ============================================================

enum Dang : uint8_t { D_TRON = 0, D_TIM, D_SAO, D_XOAY, D_NHAM, D_CUOI };

/**
 * ⚠️ `tilt` DƯƠNG nghĩa là mép NGOÀI của mí đi xuống.
 *
 * Định nghĩa theo trong/ngoài chứ không theo trái/phải, vì cảm xúc là
 * đối xứng gương: giận thì hai mép TRONG cùng chúi xuống, buồn thì hai
 * mép NGOÀI cùng chúi xuống. Lưu theo trái/phải thì mỗi biểu cảm phải
 * khai hai lần và sai một dấu là mặt méo.
 */
struct Hinh {
  float miTren;     // 0..1 mí trên che tới đâu
  float miDuoi;
  float nghiengTren;  // -1..1
  float nghiengDuoi;
  float rMong;      // px
  float rDongTu;    // px
  float nhinX, nhinY;  // -1..1
  Mau mau;
  uint8_t dang;
  float sang;       // 0..1 độ sáng chung, dùng cho pin yếu / ngủ
};

static Hinh HINH_MAC_DINH() {
  Hinh h;
  h.miTren = 0.06f;
  h.miDuoi = 0.04f;
  h.nghiengTren = 0;
  h.nghiengDuoi = 0;
  h.rMong = R_MONG;
  h.rDongTu = R_DONG_TU;
  h.nhinX = 0;
  h.nhinY = 0;
  h.mau = M_XANH;
  h.dang = D_TRON;
  h.sang = 1.0f;
  return h;
}

// ============================================================
// Trạng thái
// ============================================================

// Một khung nhớ dải DÙNG CHUNG cho cả hai mắt: vẽ mắt trái → đẩy →
// vẽ đè mắt phải → đẩy. Hai khung riêng chẳng nhanh hơn (bus SPI vẫn
// nối tiếp) mà tốn gấp đôi RAM trong.
static DaiVe dai;
static bool sanSang = false;
static bool batMan = true;

/**
 * ⚠️ BA bản sao của cùng một hình, và cả ba đều cần thiết.
 *
 *   hienTai — hoạt ảnh cập nhật 60 lần/giây, chạy liên tục
 *   dangVe  — ẢNH CHỤP của hienTai lúc khung hình này bắt đầu
 *   daVe    — thứ đang thật sự nằm trên kính
 *
 * Vì sao cần `dangVe`: một khung đầy đủ mất tới 56 ms trải trên nhiều
 * lần gọi `loop()`, mà `hienTai` vẫn chạy trong lúc đó. Vẽ thẳng từ
 * `hienTai` thì dải trên cùng lấy hình lúc t=0 còn dải dưới cùng lấy
 * hình lúc t=56 ms — con ngươi bị CẮT LÀM ĐÔI theo chiều ngang, lệch
 * nhau vài pixel. Trên màn tĩnh không thấy, nhưng lúc mắt đang liếc
 * thì đó là một vết nứt chạy ngang mặt.
 *
 * Còn `daVe` là mốc để biết dải nào cần vẽ lại — phải là thứ TRÊN KÍNH,
 * không phải thứ đang tính dở.
 */
struct Mat {
  Hinh dich;     // đích hoạt ảnh đang tiến tới
  Hinh hienTai;  // hoạt ảnh, cập nhật liên tục
  Hinh dangVe;   // ảnh chụp cho khung đang vẽ
  Hinh daVe;     // đang nằm trên kính
  float tVe = 0; // mốc thời gian của khung đang vẽ (giây)
  uint16_t banBan = MAT_NA;  // bitmask 10 dải
  bool khungMoi = true;      // dải sắp vẽ là dải ĐẦU của một khung mới
  // ⚠️ `Arduino_TFT*`, KHÔNG phải `Arduino_GFX*`: `writeAddrWindow()`
  // chỉ có ở lớp TFT. Đây là lớp mà mọi driver màn (GC9A01, ILI9488…)
  // kế thừa, nên không mất tính tổng quát.
  Arduino_TFT* gfx = nullptr;
  Arduino_DataBus* bus = nullptr;   // đường đẩy khối, xem eyes.h
  bool guong;   // mắt phải: lật trong/ngoài
};
static Mat matT, matP;

static Expr bieuCam = BOOTING;
static Expr bieuCamNen = NEUTRAL;
static const char* TEN[_COUNT] = {
    "neutral", "happy", "sad", "angry", "surprised", "sleepy", "love",
    "thinking", "confused", "wink", "listening", "speaking", "scanning",
    "charging", "booting", "error", "lowbat", "off", "curious", "scared",
    "dizzy", "suspicious", "excited", "bored", "shy", "proud", "annoyed",
    "sleeping"};

static uint32_t hetHanLuc = 0;

// Nhìn: đích do server đặt, giá trị thật trôi dần tới đó.
static float nhinDichX = 0, nhinDichY = 0;
static float nhinX = 0, nhinY = 0;

// Liếc vi mô. Mắt người không bao giờ đứng yên tuyệt đối; bỏ cái này
// đi thì mắt robot trông như ảnh dán chứ không như đang sống.
static uint32_t liecTiepLuc = 0;
static float liecX = 0, liecY = 0;

// Chớp mắt.
static uint32_t chopTiepLuc = 0;
static uint32_t chopBatDau = 0;
static uint8_t chopConLai = 0;
static bool dangChop = false;
static int8_t nhayMat = 0;  // 0 không nháy, -1 nháy mắt trái, 1 mắt phải

static int32_t mucAm = 0;      // biên độ tiếng đang phát
static float mucAmMuot = 0;

static bool wifiOk = false, serverOk = false;
static int pinPct = -1;

// Con trỏ vẽ: dải nào tới lượt.
static uint8_t daiKe = 0;
static uint32_t khungTruocLuc = 0;
static uint32_t phaBatDau = 0;  // mốc thời gian của biểu cảm hiện tại

// ============================================================
// Nội suy
// ============================================================

static inline float tien(float a, float b, float k) { return a + (b - a) * k; }

static uint16_t phaMau(uint16_t a, uint16_t b, float k) { return pha(a, b, k); }

static void tienHinh(Hinh& a, const Hinh& b, float k) {
  a.miTren = tien(a.miTren, b.miTren, k);
  a.miDuoi = tien(a.miDuoi, b.miDuoi, k);
  a.nghiengTren = tien(a.nghiengTren, b.nghiengTren, k);
  a.nghiengDuoi = tien(a.nghiengDuoi, b.nghiengDuoi, k);
  a.rMong = tien(a.rMong, b.rMong, k);
  a.rDongTu = tien(a.rDongTu, b.rDongTu, k);
  a.nhinX = tien(a.nhinX, b.nhinX, k);
  a.nhinY = tien(a.nhinY, b.nhinY, k);
  a.sang = tien(a.sang, b.sang, k);
  a.mau.ria = phaMau(a.mau.ria, b.mau.ria, k);
  a.mau.giua = phaMau(a.mau.giua, b.mau.giua, k);

  // Dạng KHÔNG nội suy được — nửa trái tim nửa hình tròn là hình gì?
  // Nhảy thẳng.
  //
  // ⚠️ Bản đầu chỉ cho nhảy khi mí đã khép quá 55% ("giấu cú đổi sau
  // một cái chớp"). Ý hay, nhưng những biểu cảm CẦN đổi dạng lại đúng
  // là những cái mở mắt to nhất: EXCITED (ngôi sao) mí = 0, LOVE (trái
  // tim) mí = 0,02. Điều kiện không bao giờ đúng, nên trái tim và ngôi
  // sao KHÔNG BAO GIỜ hiện ra — mà nhìn màn thì vẫn thấy một con mắt
  // bình thường, không có gì báo là thiếu.
  //
  // Tệ hơn: dạng cũ còn KẸT LẠI. Sau SLEEPING (mắt nhắm, D_NHAM) thì
  // LISTENING/SPEAKING kế thừa nét gạch ngang đó và mắt biến thành một
  // vạch cong suốt cả cuộc nói chuyện.
  a.dang = b.dang;
}

// ============================================================
// Bảng biểu cảm
// ============================================================

/** Hình đích cho một biểu cảm. `t` = giây kể từ lúc vào biểu cảm đó. */
static Hinh hinhCua(Expr e, float t) {
  Hinh h = HINH_MAC_DINH();
  switch (e) {
    case NEUTRAL:
      break;

    case HAPPY:
      // Mắt cười ^^ — mí dưới nâng cao, mống nở. Đây là biểu cảm mà
      // mí DƯỚI làm gần hết việc, không phải mí trên.
      // ⚠️ Mí gần như MỞ HẲN, dù mắt cười trông như đang nheo. Nét
      // cong của D_CUOI CHÍNH LÀ con mắt; đặt mí 0,42 như bản đầu thì
      // mí đen phủ lên đúng nét ấy và mắt vui thành mắt nhắm tịt.
      h.miDuoi = 0.03f;
      h.miTren = 0.03f;
      h.rMong = R_MONG + 6;
      h.dang = D_CUOI;
      break;

    case SAD:
      // Mép NGOÀI mí trên chúi xuống + nhìn xuống.
      h.miTren = 0.34f;
      h.nghiengTren = 0.85f;
      h.nhinY = 0.42f;
      h.rMong = R_MONG - 4;
      h.mau = M_XANH;
      h.sang = 0.72f;
      break;

    case ANGRY:
      // Mép TRONG chúi xuống — dấu âm. Đây là dấu hiệu duy nhất phân
      // biệt giận với buồn nếu chỉ nhìn mí trên.
      // Khép VỪA thôi. Cái làm nên vẻ giận là ĐỘ NGHIÊNG của mí, không
      // phải độ khép; khép sâu cộng nghiêng gắt thì chỉ còn lại mấy
      // mảnh mống ở góc và mặt trông như hỏng màn.
      h.miTren = 0.22f;
      h.nghiengTren = -0.95f;
      h.miDuoi = 0.10f;
      h.rMong = R_MONG - 8;
      h.rDongTu = R_DONG_TU - 7;
      h.mau = M_DO;
      break;

    case SURPRISED:
      h.miTren = 0.0f;
      h.miDuoi = 0.0f;
      h.rMong = R_MONG + 14;
      h.rDongTu = R_DONG_TU + 12;
      break;

    case SLEEPY:
      h.miTren = 0.60f + 0.06f * sinf(t * 1.6f);
      h.miDuoi = 0.14f;
      h.nhinY = 0.30f;
      h.rMong = R_MONG - 6;
      h.sang = 0.55f;
      break;

    case SLEEPING:
      h.miTren = 0.04f;
      h.miDuoi = 0.04f;
      h.dang = D_NHAM;
      h.sang = 0.35f;
      break;

    case LOVE:
      h.dang = D_TIM;
      h.mau = M_HONG;
      // Trái tim đập — to nhỏ theo nhịp, nhanh hơn tim thật một chút
      // cho ra vẻ đang phấn khích.
      h.rMong = R_MONG + 8 + 7 * sinf(t * 5.0f);
      h.miTren = 0.02f;
      break;

    case THINKING:
      // Nhìn chếch lên — hướng mắt người ta hay đưa khi đang lục trí nhớ.
      h.nhinX = 0.55f * sinf(t * 0.9f);
      h.nhinY = -0.45f;
      h.miTren = 0.18f;
      h.rMong = R_MONG - 3;
      break;

    case CONFUSED:
      h.miTren = 0.24f;
      h.nghiengTren = 0.6f;
      h.nhinX = 0.35f;
      h.rMong = R_MONG - 2;
      break;

    case WINK:
      // Bản thân WINK không tự nháy — `nhayMat` lo phần đó, vì nó chỉ
      // tác động lên MỘT mắt còn bảng này tả cả hai.
      h.miDuoi = 0.03f;
      h.dang = D_CUOI;
      break;

    // ── Trạng thái máy ──
    case LISTENING:
      // Mống nở và thở nhẹ: tín hiệu "đang mở tai" mà không cần chữ.
      h.rMong = R_MONG + 8 + 3 * sinf(t * 3.2f);
      h.rDongTu = R_DONG_TU + 4;
      h.miTren = 0.02f;
      h.mau = M_LUC;
      break;

    case SPEAKING: {
      // Đồng tử NẢY THEO TIẾNG. Đây là thứ khiến mắt và loa trông như
      // cùng một sinh vật thay vì hai bộ phận rời.
      const float m = mucAmMuot;  // 0..1
      h.rDongTu = R_DONG_TU + 2 + 16 * m;
      h.rMong = R_MONG + 4 + 5 * m;
      h.miTren = 0.04f;
      break;
    }

    case SCANNING:
      h.rMong = R_MONG + 2;
      h.rDongTu = R_DONG_TU - 10;
      h.mau = M_LUC;
      h.miTren = 0.0f;
      break;

    case CHARGING:
      h.mau = M_LUC;
      h.sang = 0.55f + 0.45f * (0.5f + 0.5f * sinf(t * 2.2f));
      h.miTren = 0.30f;
      h.miDuoi = 0.30f;
      break;

    case BOOTING: {
      // Khẩu độ máy ảnh mở dần trong 1,2 giây. Không có gì "hữu ích"
      // nhưng nó là ấn tượng đầu tiên, và nó nói cho người dùng biết
      // cả hai màn đều sống trước khi robot làm bất cứ việc gì.
      const float k = t < 1.2f ? t / 1.2f : 1.0f;
      h.rMong = R_MONG * k;
      h.rDongTu = R_DONG_TU * k;
      h.miTren = 0.5f * (1 - k);
      h.miDuoi = 0.5f * (1 - k);
      break;
    }

    case ERROR:
      h.mau = M_DO;
      h.rMong = R_MONG - 10;
      h.rDongTu = R_DONG_TU - 12;
      h.sang = (fmodf(t, 0.5f) < 0.25f) ? 1.0f : 0.35f;
      break;

    case LOWBAT:
      h.mau = M_AM;
      h.sang = 0.30f + 0.25f * (0.5f + 0.5f * sinf(t * 1.1f));
      h.miTren = 0.42f;
      h.rMong = R_MONG - 10;
      break;

    case OFF:
      h.sang = 0;
      h.miTren = 0.5f;
      h.miDuoi = 0.5f;
      h.rMong = 0;
      break;

    // ── Biểu cảm mở rộng ──
    case CURIOUS:
      h.miTren = 0.10f;
      h.nghiengTren = -0.35f;
      h.rMong = R_MONG + 6;
      h.nhinX = 0.30f * sinf(t * 1.4f);
      break;

    case SCARED:
      // Mắt mở hết cỡ, đồng tử CO LẠI — phản xạ thật của người sợ, và
      // là lý do biểu cảm này khác "ngạc nhiên" dù mí giống nhau.
      h.miTren = 0;
      h.miDuoi = 0;
      h.rMong = R_MONG + 16;
      h.rDongTu = R_DONG_TU - 12;
      h.nhinX = 0.10f * sinf(t * 22.0f);  // run
      h.nhinY = 0.06f * sinf(t * 27.0f);
      break;

    case DIZZY:
      h.dang = D_XOAY;
      h.mau = M_XAM;
      h.rMong = R_MONG + 4;
      break;

    case SUSPICIOUS:
      h.miTren = 0.40f;
      h.miDuoi = 0.26f;
      h.nghiengTren = -0.30f;
      h.nhinX = 0.55f;
      h.rMong = R_MONG - 6;
      break;

    case EXCITED:
      h.dang = D_SAO;
      h.mau = M_AM;
      h.rMong = R_MONG + 10;
      h.miTren = 0;
      break;

    case BORED:
      h.miTren = 0.52f;
      h.nhinX = 0.5f * sinf(t * 0.35f);
      h.nhinY = 0.25f;
      h.rMong = R_MONG - 4;
      h.sang = 0.7f;
      break;

    case SHY:
      h.miTren = 0.40f;
      h.nhinY = 0.55f;
      h.nhinX = -0.35f;
      h.mau = M_HONG;
      h.rMong = R_MONG - 2;
      break;

    case PROUD:
      h.miDuoi = 0.30f;
      h.miTren = 0.06f;
      h.rMong = R_MONG + 4;
      h.mau = M_AM;
      break;

    case ANNOYED:
      h.miTren = 0.46f;
      h.nghiengTren = -0.55f;
      h.nhinX = 0.42f;
      h.rMong = R_MONG - 6;
      break;

    default:
      break;
  }
  return h;
}

// ============================================================
// Hình cơ bản — CHỈ vẽ những hàng nằm trong dải
// ============================================================
//
// ⚠️ Vì sao tự viết thay vì dùng `fillCircle` của thư viện: sprite chỉ
// cao 24 hàng, nên một đường tròn bán kính 63 nằm ngoài dải vẫn khiến
// `fillCircle` chạy đủ 126 vòng lặp rồi bị cắt hết ở khâu ghi. Nhân với
// 10 dải × 2 mắt × 14 lớp gradient thì đó là hàng trăm nghìn vòng lặp
// vô ích mỗi khung hình. Bản dưới đây kẹp chỉ số vòng lặp ngay từ đầu.

/** Đĩa đặc. `d0` = hàng đầu của dải trong toạ độ màn. */
static void dia(int d0, int cx, int cy, int r, uint16_t c) {
  if (r <= 0) return;
  const int y1 = min(d0 + CAO_DAI - 1, cy + r);
  for (int y = max(d0, cy - r); y <= y1; y++) {
    const int dy = y - cy;
    const int dx = (int)sqrtf((float)(r * r - dy * dy));
    dai.drawFastHLine(cx - dx, y - d0, 2 * dx + 1, c);
  }
}

/** Vành khuyên đặc giữa rNgoai và rTrong. */
static void vanh(int d0, int cx, int cy, int rNgoai, int rTrong, uint16_t c) {
  if (rNgoai <= 0) return;
  if (rTrong <= 0) return dia(d0, cx, cy, rNgoai, c);
  const int y1 = min(d0 + CAO_DAI - 1, cy + rNgoai);
  for (int y = max(d0, cy - rNgoai); y <= y1; y++) {
    const int dy = y - cy;
    const int dxN = (int)sqrtf((float)(rNgoai * rNgoai - dy * dy));
    if (abs(dy) >= rTrong) {
      dai.drawFastHLine(cx - dxN, y - d0, 2 * dxN + 1, c);
    } else {
      const int dxT = (int)sqrtf((float)(rTrong * rTrong - dy * dy));
      dai.drawFastHLine(cx - dxN, y - d0, dxN - dxT, c);
      dai.drawFastHLine(cx + dxT + 1, y - d0, dxN - dxT, c);
    }
  }
}

/**
 * Nửa mặt phẳng bị mí che, cắt trong đường tròn kính.
 *
 * Mí là một ĐƯỜNG THẲNG NGHIÊNG, không phải một cạnh ngang. Với mỗi
 * hàng, phần bị che là một đoạn liên tục — hoặc từ mép trái tới x
 * biên, hoặc từ x biên tới mép phải, tuỳ dấu của độ dốc. Nhờ vậy mỗi
 * hàng chỉ tốn một lệnh vẽ đường ngang.
 */
static void mi(int d0, float phan, float nghieng, bool tren, uint16_t c) {
  if (phan <= 0.001f) return;
  // ⚠️ 0,45 chứ không phải 0,62. Mí là một NỬA MẶT PHẲNG, nên độ dốc
  // càng lớn thì một bên càng bị quét sạch: ở 0,62 thì đầu này của mí
  // chênh đầu kia tới 148 px trên bề ngang 240 — mắt giận biến thành
  // hai mảnh vụn ở góc thay vì một con mắt gườm.
  const float doc = nghieng * 0.45f;  // ~24° ở mức tối đa
  // phan=0 → mép nằm ngoài kính (không che gì), phan=1 → che hết.
  const float yMep = tren ? (CY - R_VIEN_NGOAI + phan * 2 * R_VIEN_NGOAI)
                          : (CY + R_VIEN_NGOAI - phan * 2 * R_VIEN_NGOAI);

  const int y1 = min(d0 + CAO_DAI - 1, CY + R_VIEN_NGOAI);
  for (int y = max(d0, CY - R_VIEN_NGOAI); y <= y1; y++) {
    const int dy = y - CY;
    const int dxK = (int)sqrtf((float)(R_VIEN_NGOAI * R_VIEN_NGOAI - dy * dy));
    const int xT = CX - dxK, xP = CX + dxK;

    int a, b;  // đoạn bị che trên hàng này
    if (fabsf(doc) < 0.001f) {
      const bool che = tren ? (y < yMep) : (y > yMep);
      if (!che) continue;
      a = xT;
      b = xP;
    } else {
      const float xb = CX + (y - yMep) / doc;
      // Trên: che khi y < yMep + (x-CX)*doc.
      const bool phaiCuaBien = tren ? (doc > 0) : (doc < 0);
      if (phaiCuaBien) {
        a = max(xT, (int)ceilf(xb));
        b = xP;
      } else {
        a = xT;
        b = min(xP, (int)floorf(xb));
      }
      if (a > b) continue;
    }
    dai.drawFastHLine(a, y - d0, b - a + 1, c);
  }
}

/** Trái tim, cho biểu cảm love. */
static void traiTim(int d0, int cx, int cy, int r, uint16_t c) {
  const int rr = r * 55 / 100;
  dia(d0, cx - rr + 2, cy - rr / 2, rr, c);
  dia(d0, cx + rr - 2, cy - rr / 2, rr, c);
  // Mũi nhọn phía dưới: dựng bằng các đường ngang thu hẹp dần, vì
  // fillTriangle của sprite phải quét cả tam giác rồi mới cắt theo dải.
  const int yD = cy + r;
  const int yT = cy - rr / 2;
  const int y1 = min(d0 + CAO_DAI - 1, yD);
  for (int y = max(d0, yT); y <= y1; y++) {
    const float k = (float)(y - yT) / (float)(yD - yT + 1);
    const int nua = (int)((2 * rr - 2) * (1.0f - k));
    if (nua > 0) dai.drawFastHLine(cx - nua, y - d0, 2 * nua + 1, c);
  }
}

/** Ngôi sao 5 cánh, cho biểu cảm excited. */
static void ngoiSao(int d0, int cx, int cy, int r, uint16_t c) {
  // Sprite tự cắt phần ngoài dải; sao chỉ xuất hiện ở một biểu cảm nên
  // phần quét thừa không đáng để tối ưu như hình tròn.
  const float rTrong = r * 0.42f;
  int px = 0, py = 0;
  for (int i = 0; i <= 10; i++) {
    const float g = -PI / 2 + i * PI / 5;
    const float rr = (i & 1) ? rTrong : (float)r;
    const int x = cx + (int)(cosf(g) * rr);
    const int y = cy + (int)(sinf(g) * rr) - d0;
    if (i > 0) dai.fillTriangle(cx, cy - d0, px, py, x, y, c);
    px = x;
    py = y;
  }
}

/** Xoáy ốc Archimedes, cho biểu cảm dizzy. */
static void xoayOc(int d0, int cx, int cy, int r, float pha_, uint16_t c) {
  int px = cx, py = cy - d0;
  for (int i = 1; i <= 90; i++) {
    const float g = pha_ + i * 0.28f;
    const float rr = r * (float)i / 90.0f;
    const int x = cx + (int)(cosf(g) * rr);
    const int y = cy + (int)(sinf(g) * rr) - d0;
    dai.drawLine(px, py, x, y, c);
    dai.drawLine(px, py + 1, x, y + 1, c);
    px = x;
    py = y;
  }
}

// ============================================================
// Vẽ một dải của một mắt
// ============================================================

static void veDai(Mat& m, int chiSoDai) {
  const int d0 = chiSoDai * CAO_DAI;
  // Ảnh chụp, KHÔNG phải `hienTai` — xem giải thích ở struct Mat.
  const Hinh& h = m.dangVe;
  const float t = m.tVe;

  dai.fillSprite(C_NEN);

  // ── 1. Thân ống kính ──
  // Bốn vành lồng nhau, sáng dần ra ngoài. Đây là thứ biến cái màn
  // tròn phẳng thành một ỐNG KÍNH có chiều sâu — bỏ nó đi thì mắt
  // trông như hình vẽ trên giấy.
  vanh(d0, CX, CY, R_VIEN_NGOAI, R_VIEN_NGOAI - 4, C_VIEN_SANG);
  vanh(d0, CX, CY, R_VIEN_NGOAI - 4, R_VIEN_NGOAI - 11, C_VIEN_TOI);
  vanh(d0, CX, CY, R_VIEN_NGOAI - 11, R_VIEN_TRONG, pha(C_VIEN_TOI, C_NEN, 0.55f));

  if (h.sang > 0.02f && h.rMong > 1) {
    const int mx = CX + (int)(h.nhinX * TRUOT_TOI_DA);
    const int my = CY + (int)(h.nhinY * TRUOT_TOI_DA * 0.8f);
    const int rM = (int)h.rMong;

    const uint16_t cRia = pha(C_NEN, h.mau.ria, h.sang);
    const uint16_t cGiua = pha(C_NEN, h.mau.giua, h.sang);

    switch (h.dang) {
      case D_TIM:
        traiTim(d0, mx, my, rM, cRia);
        break;

      case D_SAO:
        ngoiSao(d0, mx, my, rM + 8, cRia);
        break;

      case D_XOAY:
        dia(d0, mx, my, rM, pha(C_NEN, C_VIEN_TOI, 0.8f));
        xoayOc(d0, mx, my, rM - 2, t * 3.2f, cRia);
        break;

      case D_NHAM:
      case D_CUOI:
        // Mắt cười / nhắm: một nét cong dày thay cho cả con mắt. Cong
        // theo parabol chứ không theo cung tròn — parabol dẹt ở giữa,
        // cong nhanh ở hai đầu, giống nét vẽ tay hơn.
        {
          const bool len = (h.dang == D_CUOI);
          const int nua = rM + 12;
          const int day = len ? 13 : 9;
          for (int dx = -nua; dx <= nua; dx++) {
            const float u = (float)dx / nua;
            const int cong = (int)((len ? -1 : 1) * 26 * (u * u - 0.5f));
            dai.drawFastVLine(mx + dx, my + cong - day / 2 - d0, day, cRia);
          }
        }
        break;

      default: {
        // ── Mống mắt: 14 lớp gradient ──
        // Sáng ở rìa, tối vào giữa. Vẽ từ ngoài vào trong, lớp sau đè
        // lớp trước — rẻ hơn tính khoảng cách từng điểm, và ở 14 lớp
        // thì mắt thường không thấy bậc.
        const int LOP = 14;
        for (int i = 0; i < LOP; i++) {
          const float k = (float)i / (LOP - 1);
          const int r = (int)(rM * (1.0f - k * 0.92f));
          dia(d0, mx, my, r, pha(cRia, cGiua, k));
        }
        // Vành tối ngoài cùng: tách mống khỏi thân ống kính.
        vanh(d0, mx, my, rM, rM - 3, pha(cRia, C_NEN, 0.55f));

        // ── Vân toả tia ──
        // Mống mắt thật có vân toả từ tâm.
        //
        // ⚠️ RẤT MỜ (0,12) và KHÔNG chạm vào đồng tử. Bản đầu để 0,25
        // và kéo tia từ sát mép đồng tử ra tới mép mống: ở cỡ thu nhỏ
        // trông ổn, nhưng phóng lên đúng 240 px thì nó thành cái NAN
        // HOA XE ĐẠP — mắt hoá bánh xe. Vân là chất liệu, không phải
        // hoa văn; thấy được nó nghĩa là đã quá tay.
        if (rM > 26) {
          const uint16_t cVan = pha(cRia, C_LOE, 0.12f);
          const int r0 = (int)h.rDongTu + 4, r1 = rM - 7;
          if (r1 > r0) {
            for (int i = 0; i < 28; i++) {
              const float g = i * (2 * PI / 28) + t * 0.12f;
              const float c_ = cosf(g), s_ = sinf(g);
              dai.drawLine(mx + (int)(c_ * r0), my + (int)(s_ * r0) - d0,
                           mx + (int)(c_ * r1), my + (int)(s_ * r1) - d0, cVan);
            }
          }
          // Rãnh tối ăn theo vòng: cái làm thấu kính trông có TẦNG,
          // thay vì một mảng màu phẳng dán lên.
          vanh(d0, mx, my, rM - 11, rM - 14, pha(cRia, cGiua, 0.55f));
        }

        // ── Đồng tử ──
        dia(d0, mx, my, (int)h.rDongTu, C_DONG_TU);

        // ── Đốm loé ──
        // ⚠️ ĐỪNG BỎ HAI CHẤM NÀY. Chúng là thứ rẻ nhất trên cả màn
        // hình mà lại quyết định nhiều nhất: có chúng thì mắt trông
        // ướt và có hồn, không có thì nó là hai cái lỗ đen.
        //
        // Luôn nằm ở TRÊN-TRÁI cho cả hai mắt, không lật gương: nguồn
        // sáng trong phòng là một, nên phản chiếu phải cùng phía. Lật
        // đối xứng là lỗi mà mắt người bắt được ngay dù không gọi tên
        // được.
        {
          // 0,34 chứ không 0,42: đốm to quá thì nó ăn hết nửa đồng tử
          // và phần đen còn lại trông như bị lệch tâm.
          const int rL = max(4, (int)(h.rDongTu * 0.34f));
          dia(d0, mx - (int)(h.rDongTu * 0.42f), my - (int)(h.rDongTu * 0.46f), rL,
              pha(C_NEN, C_LOE, h.sang));
          // Đốm phụ phải TRẮNG hẳn. Bản đầu để 0,55 nên nó ra màu xám,
          // và xám nằm trên nền mống xanh thì đọc thành một vết bẩn
          // chứ không thành phản chiếu.
          dia(d0, mx + (int)(rM * 0.40f), my + (int)(rM * 0.38f), max(3, rL / 2),
              pha(C_NEN, C_LOE, h.sang * 0.92f));
        }
        break;
      }
    }
  }

  // ── Hiệu ứng riêng của vài trạng thái ──
  if (bieuCam == SCANNING) {
    // Vạch quét chạy dọc, có vệt mờ phía sau — đúng kiểu máy quét.
    const int y = CY - R_VIEN_TRONG + (int)(fmodf(t * 190.0f, 2.0f * R_VIEN_TRONG));
    for (int k = 0; k < 7; k++) {
      const int yy = y - k;
      if (yy < d0 || yy >= d0 + CAO_DAI) continue;
      const int dy = yy - CY;
      if (abs(dy) >= R_VIEN_TRONG) continue;
      const int dx = (int)sqrtf((float)(R_VIEN_TRONG * R_VIEN_TRONG - dy * dy));
      dai.drawFastHLine(CX - dx, yy - d0, 2 * dx + 1,
                        pha(C_NEN, RGB(140, 255, 170), 1.0f - k * 0.14f));
    }
  } else if (bieuCam == ERROR) {
    // Nhiễu sọc: vài hàng bị đẩy ngang. Không dùng random() để hai mắt
    // nhiễu GIỐNG NHAU — hai kiểu nhiễu khác nhau trông như một màn
    // hỏng chứ không như một lỗi hệ thống.
    for (int k = 0; k < 3; k++) {
      const int yy = d0 + (int)(fmodf(t * 300 + k * 79 + chiSoDai * 37, CAO_DAI));
      dai.drawFastHLine(0, yy - d0, W, pha(C_NEN, RGB(255, 60, 40), 0.75f));
    }
  }

  // ── 2. Mí mắt — vẽ SAU CÙNG vì nó che mọi thứ ──
  //
  // ⚠️ DẤU Ở ĐÂY TỪNG NGƯỢC, và nó ngược theo kiểu khó thấy nhất: mặt
  // vẫn có biểu cảm, chỉ là SAI biểu cảm. Giận thì hai mép NGOÀI chúi
  // xuống (thành ra trông như buồn ngơ ngác), buồn thì hai mép TRONG
  // chúi xuống (trông như đang gườm).
  //
  // Quy ước: `nghieng` dương = mép NGOÀI đi xuống. Mắt TRÁI có mép
  // ngoài ở bên trái màn (x nhỏ) → cần độ dốc ÂM. Mắt PHẢI thì ngược.
  // Vì vậy mắt trái mới là cái bị đảo dấu, chứ không phải mắt phải.
  const float ngT = m.guong ? h.nghiengTren : -h.nghiengTren;
  const float ngD = m.guong ? h.nghiengDuoi : -h.nghiengDuoi;
  mi(d0, h.miTren, ngT, true, C_NEN);
  mi(d0, h.miDuoi, ngD, false, C_NEN);

  // ── 3. Chỉ báo trạng thái ở rìa dưới ──
  // Đặt trên VÀNH ống kính chứ không đè lên mống: nó là thông tin phụ,
  // không được tranh chỗ với biểu cảm.
  if (chiSoDai >= SO_DAI - 3) {
    if (!m.guong) {
      // Mắt trái: hai chấm WiFi / server.
      dia(d0, CX - 13, CY + 108, 4, wifiOk ? RGB(0, 210, 90) : RGB(150, 30, 20));
      dia(d0, CX + 13, CY + 108, 4, serverOk ? RGB(0, 210, 90) : RGB(150, 30, 20));
    } else if (pinPct >= 0) {
      // Mắt phải: cung pin chạy theo rìa dưới. Màu chở thông tin —
      // liếc một cái là biết, khỏi đọc số.
      const uint16_t c = pinPct > 50   ? RGB(0, 210, 90)
                         : pinPct > 20 ? RGB(255, 170, 0)
                                       : RGB(230, 40, 30);
      const int n = 1 + (pinPct * 11) / 100;
      for (int i = 0; i < n; i++) {
        const float g = PI * (0.30f + 0.40f * i / 11.0f);
        dia(d0, CX - (int)(cosf(g) * 108), CY + (int)(sinf(g) * 108), 3, c);
      }
    }
  }
}

// ============================================================
// Đẩy dải xuống màn
// ============================================================

static void dayDai(Mat& m, int chiSoDai) {
  if (!m.gfx) return;   // mắt chưa cắm
  // Đặt cửa sổ địa chỉ MỘT lần rồi bơm cả khối — KHÔNG dùng
  // `draw16bitRGBBitmap()`, nó vẽ từng điểm ảnh một. Xem eyes.h.
  //
  // Thư viện tự kéo CS của đúng con màn này (mỗi màn một đối tượng bus
  // riêng, chung một SPIClass) và tự bọc beginTransaction/endTransaction.
  const int y0 = chiSoDai * CAO_DAI;
  m.gfx->startWrite();
  m.gfx->writeAddrWindow(0, y0, W, CAO_DAI);
  m.bus->writePixels(dai.bo, (uint32_t)W * CAO_DAI);
  m.gfx->endWrite();
}

// ============================================================
// Đánh dấu dải bẩn
// ============================================================

static void banHang(Mat& m, int y0, int y1) {
  if (y1 < 0 || y0 >= H) return;
  const int a = max(0, y0) / CAO_DAI;
  const int b = min(H - 1, y1) / CAO_DAI;
  for (int i = a; i <= b; i++) m.banBan |= (uint16_t)(1u << i);
}

/**
 * So khung hiện tại với khung đã vẽ để biết phải vẽ lại những đâu.
 *
 * ⚠️ ĐÂY LÀ CHỖ QUYẾT ĐỊNH TỐC ĐỘ. Vẽ lại cả 240 hàng mỗi khung là
 * 56 ms cho hai mắt; nhưng lúc chỉ có con ngươi trôi vài pixel thì
 * vùng thật sự đổi chỉ khoảng 130 hàng, tức nhanh gần gấp đôi. Liếc
 * vi mô xảy ra liên tục nên đây là trường hợp THƯỜNG GẶP, không phải
 * ca hiếm.
 */
static void tinhBan(Mat& m) {
  const Hinh& a = m.daVe;
  const Hinh& b = m.hienTai;

  // Mí, màu, dạng đổi → cả mắt phải vẽ lại.
  if (a.dang != b.dang || fabsf(a.miTren - b.miTren) > 0.002f ||
      fabsf(a.miDuoi - b.miDuoi) > 0.002f ||
      fabsf(a.nghiengTren - b.nghiengTren) > 0.004f ||
      fabsf(a.nghiengDuoi - b.nghiengDuoi) > 0.004f ||
      fabsf(a.sang - b.sang) > 0.008f || a.mau.ria != b.mau.ria) {
    m.banBan = MAT_NA;
  } else {
    // Chỉ mống/đồng tử/hướng nhìn đổi → vẽ lại hợp của hai vị trí.
    auto hop = [](const Hinh& h, int& y0, int& y1) {
      const int my = CY + (int)(h.nhinY * TRUOT_TOI_DA * 0.8f);
      const int r = (int)h.rMong + 6;
      y0 = my - r;
      y1 = my + r;
    };
    int a0, a1, b0, b1;
    hop(a, a0, a1);
    hop(b, b0, b1);
    if (a0 != b0 || a1 != b1 || fabsf(a.nhinX - b.nhinX) > 0.001f ||
        fabsf(a.rDongTu - b.rDongTu) > 0.3f || fabsf(a.rMong - b.rMong) > 0.3f) {
      banHang(m, min(a0, b0), max(a1, b1));
    }
  }
}

// ============================================================
// Hoạt ảnh
// ============================================================

static uint32_t soNgauNhien() {
  // Không dùng random() của Arduino: nó cần seed, mà lúc khởi động
  // chưa có nguồn ngẫu nhiên nào nên mọi lần bật máy sẽ chớp mắt theo
  // đúng một chuỗi giống hệt nhau — nhìn ra ngay là máy móc.
  return esp_random();
}

static void henChopTiep() {
  // 2,4–6,2 giây. Người thật chớp 15-20 lần/phút; thưa hơn thì trông
  // đờ đẫn, dày hơn thì trông bồn chồn.
  chopTiepLuc = millis() + 2400 + (soNgauNhien() % 3800);
}

static void henLiecTiep() {
  liecTiepLuc = millis() + 700 + (soNgauNhien() % 2600);
  // Liếc RẤT nhỏ — 7% tầm trượt. To hơn là mắt trông lơ đãng, như
  // đang nhìn quanh phòng thay vì nhìn người đối diện.
  liecX = ((int)(soNgauNhien() % 200) - 100) / 100.0f * 0.07f;
  liecY = ((int)(soNgauNhien() % 200) - 100) / 100.0f * 0.05f;
}

/** Chớp: khép NHANH, mở CHẬM hơn. Ngược lại trông như bị giật. */
static float heSoChop(uint32_t troi) {
  const uint32_t KHEP = 70, GIU = 24, MO = 130;
  if (troi < KHEP) return (float)troi / KHEP;
  if (troi < KHEP + GIU) return 1.0f;
  if (troi < KHEP + GIU + MO) return 1.0f - (float)(troi - KHEP - GIU) / MO;
  return -1.0f;  // xong
}

static void capNhat() {
  const uint32_t now = millis();
  const float t = (now - phaBatDau) / 1000.0f;

  // Hết hạn biểu cảm tạm.
  if (hetHanLuc && now > hetHanLuc) {
    hetHanLuc = 0;
    set(bieuCamNen, 0);
    return;
  }

  // Biên độ tiếng → 0..1. Thang log vì tai nghe theo log; thang tuyến
  // tính thì đồng tử chỉ nhúc nhích ở những âm to nhất.
  {
    const float m = mucAm <= 0 ? 0.0f : min(1.0f, logf(1.0f + mucAm / 4000.0f) / 4.8f);
    // Lên nhanh xuống chậm: nảy theo kịp âm tiết mà không giật cục.
    mucAmMuot = m > mucAmMuot ? tien(mucAmMuot, m, 0.55f) : tien(mucAmMuot, m, 0.14f);
  }

  // Liếc vi mô.
  if (now > liecTiepLuc) henLiecTiep();

  // Chớp mắt.
  if (!dangChop && chopConLai == 0 && now > chopTiepLuc &&
      bieuCam != SLEEPING && bieuCam != OFF && bieuCam != BOOTING) {
    chopConLai = (soNgauNhien() % 7 == 0) ? 2 : 1;  // thi thoảng chớp đúp
    henChopTiep();
  }
  if (!dangChop && chopConLai > 0) {
    dangChop = true;
    chopBatDau = now;
  }

  float pheChop = 0;
  if (dangChop) {
    const float k = heSoChop(now - chopBatDau);
    if (k < 0) {
      dangChop = false;
      if (chopConLai) chopConLai--;
    } else {
      pheChop = k;
    }
  }

  // Hướng nhìn: trôi mềm tới đích. 0,18 mỗi khung ≈ 120 ms để tới nơi,
  // đủ nhanh để trông có chủ ý, đủ chậm để không giật.
  nhinX = tien(nhinX, nhinDichX, 0.18f);
  nhinY = tien(nhinY, nhinDichY, 0.18f);

  Hinh dich = hinhCua(bieuCam, t);
  dich.nhinX = constrain(dich.nhinX + nhinX + liecX, -1.0f, 1.0f);
  dich.nhinY = constrain(dich.nhinY + nhinY + liecY, -1.0f, 1.0f);

  // Tốc độ chuyển: nhanh cho trạng thái máy (phải phản hồi tức thì),
  // chậm hơn cho cảm xúc (chuyển cảm xúc mà giật thì trông máy móc).
  const float k = (bieuCam == SPEAKING || bieuCam == LISTENING) ? 0.42f : 0.22f;

  auto lo = [&](Mat& m, bool nhamRieng) {
    Hinh d = dich;
    if (nhamRieng) {
      // Nháy mắt là GIỮ mắt nhắm, không phải chớp. Phủ đen thì con mắt
      // biến mất khỏi màn và trông như một bên hỏng; vẽ nét gạch ngang
      // mới ra "đang nhắm một bên".
      d.dang = D_NHAM;
      d.miTren = 0.04f;
      d.miDuoi = 0.04f;
    } else if (pheChop > 0) {
      // Chớp thì ngược lại — nó thoáng qua (~220 ms) nên phủ đen bằng
      // mí là đúng, và mí đè lên mí đang có chứ không thay thế: đang
      // lim dim mà chớp thì chỉ cần đi nốt quãng còn lại.
      d.miTren = d.miTren + (0.52f - d.miTren) * pheChop;
      d.miDuoi = d.miDuoi + (0.50f - d.miDuoi) * pheChop;
      if (pheChop > 0.6f) d.rMong = d.rMong * (1.0f - (pheChop - 0.6f) * 0.5f);
    }
    m.dich = d;
    tienHinh(m.hienTai, m.dich, k);
    tinhBan(m);
  };

  lo(matT, nhayMat < 0);
  lo(matP, nhayMat > 0);
}

// ============================================================
// API
// ============================================================

bool begin(Arduino_TFT* matTrai, Arduino_TFT* matPhai) {
  // Mắt phải được phép là nullptr: bo hiện chưa còn chân CS cho nó
  // (xem `PIN_EYE_CS_R` trong config.h). Robot một mắt vẫn chạy, và
  // thà một mắt sống còn hơn hai mắt chết vì thiếu một con trỏ.
  if (!matTrai) {
    Serial.println("!! eyes::begin() nhan con tro mat TRAI rong");
    return false;
  }
  if (!matPhai) Serial.println("[eyes] chi co MOT mat — mat phai chua co chan CS");
  matT.gfx = matTrai;
  matT.guong = false;
  matP.gfx = matPhai;
  matP.guong = true;
  if (!matT.bus) {
    Serial.println("!! eyes::setBus() chua duoc goi — bat buoc, xem eyes.h");
    return false;
  }

  if (!dai.tao(W, CAO_DAI)) {
    Serial.printf("!! eyes: khong xin duoc %u byte RAM trong cho dai ve\n",
                  (unsigned)(W * CAO_DAI * 2));
    return false;
  }

  for (Mat* m : {&matT, &matP})
    if (m->gfx) m->gfx->fillScreen(0);

  matT.hienTai = matP.hienTai = HINH_MAC_DINH();
  matT.dangVe = matP.dangVe = HINH_MAC_DINH();
  matT.daVe = matP.daVe = HINH_MAC_DINH();
  matT.banBan = matP.banBan = MAT_NA;
  matT.khungMoi = matP.khungMoi = true;

  sanSang = true;
  phaBatDau = millis();
  henChopTiep();
  henLiecTiep();
  set(BOOTING);

  Serial.printf("[eyes] 2x GC9A01 240x240, dai %dx%d = %u byte RAM trong\n", W, CAO_DAI,
                (unsigned)(W * CAO_DAI * 2));
  return true;
}

void setBus(Arduino_DataBus* busTrai, Arduino_DataBus* busPhai) {
  matT.bus = busTrai;
  matP.bus = busPhai;
}

void loop(uint32_t budgetUs) {
  if (!sanSang || !batMan) return;
  const uint32_t t0 = micros();

  // Cập nhật hoạt ảnh tối đa ~60 lần/giây. Tính lại dày hơn thế chỉ tốn
  // CPU: dải vẽ không kịp theo, mà mắt người cũng không thấy khác.
  if (millis() - khungTruocLuc >= 16) {
    khungTruocLuc = millis();
    capNhat();
  }

  // Đẩy dải cho tới khi hết ngân sách. Xen kẽ TRÁI–PHẢI theo từng dải
  // chứ không vẽ xong hẳn mắt này rồi mới sang mắt kia: vẽ tuần tự thì
  // mắt phải chậm hơn mắt trái gần 30 ms, và lúc chớp thì thấy rõ hai
  // mắt không khép cùng lúc.
  // ⚠️ HỎI "CÒN ĐỦ CHỖ CHO MỘT DẢI NỮA KHÔNG", đừng hỏi "đã hết giờ chưa".
  //
  // Bản đầu viết `while (micros() - t0 < budgetUs)`. Đo trên bo thật
  // 15/08/2026: ngân sách 4.000 µs mà đỉnh một vòng lên **7.497 µs**,
  // gần gấp đôi. Vì đang ở 3,9 ms nó vẫn thấy "chưa hết giờ" rồi khởi
  // động thêm một dải 3,3 ms nữa.
  //
  // Sai kiểu này không lộ ra lúc build và cũng không lộ ra khi nhìn
  // mắt — chỉ lộ khi in số đo. Nó ăn vào đúng thứ mà cả bộ vẽ theo dải
  // được viết ra để bảo vệ: quãng CPU nhường lại cho I2S.
  //
  // `usMotDai` bắt đầu bằng 0 nên vòng đầu luôn vẽ ít nhất một dải —
  // không bao giờ đứng im vì ngân sách quá hẹp.
  //
  // Đo lại sau khi vá, cùng con bo, cùng dây: đỉnh 7.497 → **4.167 µs**
  // và số vòng/giây 164 → **273**. Trả lại 66% thời gian cho phần còn
  // lại của `loop()`, mà mắt nhìn không khác gì.
  //
  // ⚠️⚠️ VÀ BẢN VÁ ĐẦU TIÊN CỦA CHÍNH NÓ LẠI TỰ KHOÁ MÌNH. Đọc kỹ.
  //
  // Bản đó viết `while (micros() - t0 + usMotDai <= budgetUs)`, tức
  // "chỉ vẽ khi CHẮC CHẮN còn đủ chỗ". Nghe rất hợp lý — cho tới lúc
  // hạ SPI từ 40 xuống 20 MHz để trị nhiễu dây. Ở 20 MHz một dải tốn
  // ~4,6 ms, mà ngân sách là 4,0 ms: điều kiện KHÔNG BAO GIỜ đúng nữa,
  // không dải nào được vẽ, và mắt đứng hình VĨNH VIỄN.
  //
  // Triệu chứng đo được: 137.663 vòng/giây, đỉnh 60 µs — tức `loop()`
  // vào rồi thoát ngay. Nhìn màn thì chỉ thấy "mắt không hiện", không
  // có cách nào đoán ra nguyên nhân nằm ở một phép so sánh.
  //
  // Nên: LUÔN vẽ ít nhất MỘT dải mỗi lần gọi. Chậm còn hơn đứng. Ngân
  // sách chỉ được phép chặn dải THỨ HAI trở đi.
  static uint32_t usMotDai = 0;
  bool daVe1 = false;
  while (!daVe1 || micros() - t0 + usMotDai <= budgetUs) {
    const uint32_t truocDai = micros();
    bool lam = false;
    for (int b = 0; b < SO_DAI * 2; b++) {
      const int i = daiKe / 2;
      Mat& m = (daiKe & 1) ? matP : matT;
      daiKe = (uint8_t)((daiKe + 1) % (SO_DAI * 2));
      if (!m.gfx) { m.banBan = 0; continue; }
      if (m.banBan & (1u << i)) {
        // Dải đầu của khung → chụp hình lại. Mọi dải sau dùng đúng ảnh
        // chụp này, nên con ngươi không bị cắt đôi giữa hai dải.
        if (m.khungMoi) {
          m.dangVe = m.hienTai;
          m.tVe = (millis() - phaBatDau) / 1000.0f;
          m.khungMoi = false;
        }
        m.banBan &= (uint16_t)~(1u << i);
        veDai(m, i);
        dayDai(m, i);
        if (m.banBan == 0) {
          m.daVe = m.dangVe;   // đây mới là thứ đang nằm trên kính
          m.khungMoi = true;
        }
        lam = true;
        break;
      }
    }
    if (!lam) break;  // không còn gì bẩn — trả CPU lại ngay

    // Trung bình trượt chi phí một dải. Đo thay vì đặt cứng, vì nó đổi
    // theo tần số SPI và theo việc dải đó có mống mắt hay chỉ có nền.
    daVe1 = true;
    const uint32_t d = micros() - truocDai;
    usMotDai = usMotDai ? (usMotDai * 3 + d) / 4 : d;
  }
}

void set(Expr e, uint32_t ms) {
  if (e >= _COUNT) return;
  if (e != bieuCam) {
    bieuCam = e;
    phaBatDau = millis();
    matT.banBan = matP.banBan = MAT_NA;
    if (e != WINK) nhayMat = 0;
  }
  hetHanLuc = ms ? millis() + ms : 0;
}

void setByName(const char* name, uint32_t ms) {
  if (!name) return;
  for (uint8_t i = 0; i < _COUNT; i++) {
    if (!strcasecmp(name, TEN[i])) {
      if ((Expr)i == WINK) {
        wink(true);
        set(WINK, ms ? ms : 900);
      } else {
        set((Expr)i, ms);
      }
      return;
    }
  }
  // Tên lạ thì GIỮ NGUYÊN mặt đang có, không về neutral. Server thêm
  // một biểu cảm mới mà firmware chưa biết thì mặt đứng yên — dở,
  // nhưng đỡ hơn là cả cuộc nói chuyện mặt cứ giật về vô cảm.
  Serial.printf("[eyes] khong biet bieu cam '%s', giu nguyen\n", name);
}

void setBase(Expr e) {
  if (e < _COUNT) bieuCamNen = e;
}

void look(float x, float y) {
  nhinDichX = constrain(x, -1.0f, 1.0f);
  nhinDichY = constrain(y, -1.0f, 1.0f);
}

void blink(uint8_t lan) {
  if (lan == 0) return;
  chopConLai = lan;
  henChopTiep();
}

void wink(bool matTrai) {
  nhayMat = matTrai ? -1 : 1;
  matT.banBan = matP.banBan = MAT_NA;
}

void setLevel(int32_t m) { mucAm = m; }

void setStatus(bool w, bool s) {
  if (w == wifiOk && s == serverOk) return;
  wifiOk = w;
  serverOk = s;
  banHang(matT, CY + 100, H - 1);
}

void setBattery(int pct) {
  const int p = pct < 0 ? -1 : constrain(pct, 0, 100);
  if (p == pinPct) return;
  pinPct = p;
  banHang(matP, CY + 100, H - 1);
}

void power(bool on) {
  if (on == batMan) return;
  batMan = on;
  if (!sanSang) return;
  if (on) {
    matT.banBan = matP.banBan = MAT_NA;
  } else {
    for (Mat* m : {&matT, &matP})
    if (m->gfx) m->gfx->fillScreen(0);
  }
}

void invalidate() { matT.banBan = matP.banBan = MAT_NA; }

Expr current() { return bieuCam; }

const char* currentName() { return TEN[bieuCam]; }

}  // namespace eyes
