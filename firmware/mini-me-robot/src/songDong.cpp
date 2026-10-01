#include "songDong.h"

#include <esp_random.h>

#include "face.h"

namespace songDong {

/** Rảnh bao lâu thì ngủ. Đêm ngủ sớm: nửa đêm không ai nói chuyện với
 *  robot cả, còn mắt sáng trưng giữa phòng tối thì chỉ thêm phiền. */
static constexpr uint32_t NGU_NGAY_MS = 5UL * 60 * 1000;
static constexpr uint32_t NGU_DEM_MS = 60UL * 1000;
/** Có người xong phải yên chừng này mới bắt đầu đảo mắt — vừa nói chuyện
 *  xong mà nhìn đi chỗ khác ngay thì trông như chán người ta. */
static constexpr uint32_t YEN_TRUOC_LIEC_MS = 8000;
/** Giật mình: to gấp bấy nhiêu lần đáy, NGAY SAU một khối êm. */
static constexpr int32_t GIAT_MINH_LAN = 15;
static constexpr uint32_t GIAT_MINH_NGHI_MS = 45000;

static uint32_t coNguoiLuc = 0;
static bool ngu = false;
static int gio = -1;

static uint32_t liecLuc = 0;     // lúc liếc kế tiếp
static uint32_t veGiuaLuc = 0;   // đang liếc: lúc quay về giữa; 0 = không liếc
static uint32_t giatMinhLuc = 0;
static int32_t mucTruoc = 0;

static uint32_t ngauNhien(uint32_t n) { return esp_random() % n; }

static bool laDem() { return gio >= 23 || (gio >= 0 && gio < 6); }

static void henLiec(uint32_t now) { liecLuc = now + 8000 + ngauNhien(12000); }

void datGio(int g) { gio = g; }

bool dangNgu() { return ngu; }

void coNguoi() {
  const uint32_t now = millis();
  coNguoiLuc = now;
  henLiec(now);
  if (veGiuaLuc) {
    veGiuaLuc = 0;
    face::look(0, 0);
  }
  if (ngu) {
    ngu = false;
    // Dậy: giật mình thoáng qua. Nền thì GIỮ nếu robot vừa vào việc (chạm
    // dải mở lượt nghe ⇒ nền đã là NGHE); rảnh thì mở mắt bình thường.
    const face::Emotion b = face::base();
    if (b != face::LISTENING && b != face::THINKING && b != face::SPEAKING) face::set(face::NEUTRAL);
    face::set(face::SURPRISED, 700);
    face::datNgu(false);
    Serial.println("[song] day roi");
  }
}

void tick(bool ranh, int32_t mucMic, int32_t nen) {
  const uint32_t now = millis();
  if (!coNguoiLuc) {
    coNguoiLuc = now;
    henLiec(now);
  }
  const int32_t truoc = mucTruoc;
  mucTruoc = mucMic;

  if (!ranh) {
    // Đang nghe/nghĩ/nói: không liếc. KHÔNG tính là có người, KHÔNG đánh
    // thức — lượt VAD rác ở quán cũng làm `ranh` tắt, vài lượt mỗi phút,
    // và nếu chúng đếm lại giờ rảnh thì ở quán robot không bao giờ ngủ.
    // Chỉ `coNguoi()` (chạm, lượt server nhận, robot cất tiếng) mới đếm.
    if (veGiuaLuc) {
      veGiuaLuc = 0;
      face::look(0, 0);
    }
    return;
  }
  if (ngu) return;

  // ── Ngủ ──
  if (now - coNguoiLuc >= (laDem() ? NGU_DEM_MS : NGU_NGAY_MS)) {
    ngu = true;
    veGiuaLuc = 0;
    face::look(0, 0);
    face::setByName("sleeping");
    face::datNgu(true);
    Serial.printf("[song] ngu (ranh %lus%s)\n", (unsigned long)((now - coNguoiLuc) / 1000),
                  laDem() ? ", ban dem" : "");
    return;
  }

  // ── Giật mình: tiếng to ĐỘT NGỘT (khối trước còn êm) ──
  // Đòi khối trước êm để tách tiếng sập cửa/rơi đồ khỏi tiếng nói: giọng
  // người to dần qua vài khối, còn tiếng va đập vọt lên trong một khối.
  if (nen > 0 && mucMic > nen * GIAT_MINH_LAN && truoc > 0 && truoc < nen * 3 &&
      now - giatMinhLuc > GIAT_MINH_NGHI_MS) {
    giatMinhLuc = now;
    face::set(face::SURPRISED, 900);
    Serial.printf("[song] giat minh (muc %ld, nen %ld)\n", (long)mucMic, (long)nen);
  }

  // ── Đảo mắt nhìn quanh ──
  if (veGiuaLuc && (int32_t)(now - veGiuaLuc) >= 0) {
    veGiuaLuc = 0;
    face::look(0, 0);
    henLiec(now);
  } else if (!veGiuaLuc && now - coNguoiLuc >= YEN_TRUOC_LIEC_MS &&
             (int32_t)(now - liecLuc) >= 0) {
    // Ngang rộng hơn dọc: người ta nhìn quanh phòng chứ ít khi nhìn trần.
    const float x = ((int)ngauNhien(141) - 70) / 100.0f;
    const float y = ((int)ngauNhien(71) - 40) / 100.0f;
    face::look(x, y);
    veGiuaLuc = now + 1200 + ngauNhien(1500);
  }
}

}  // namespace songDong
