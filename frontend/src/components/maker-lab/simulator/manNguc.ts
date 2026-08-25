/**
 * ============================================================
 * MÀN NGỰC 480×320 — port nguyên văn `firmware/src/face.cpp`
 * ============================================================
 *
 * Đây là bản chép của `face.cpp`, cố ý giữ nguyên tên hàm, tên hằng và
 * thứ tự vẽ để đặt hai file cạnh nhau soi được từng dòng. Sửa khuôn mặt
 * ở đây rồi chép ngược sang C là việc chép số, không phải dịch ý.
 *
 * ── HAI CHỖ CỐ Ý KHÁC BẢN C, VÀ LÝ DO ──
 *
 * 1. **Xoá cả khung mỗi lần vẽ**, thay vì xoá ba dải.
 *
 *    Bản C chỉ xoá hai dải mắt + dải miệng vì `fillScreen()` trên màn
 *    SPI mất ~90 ms, đủ bỏ đói đệm I2S và làm tiếng vấp. Canvas không
 *    có ràng buộc đó — xoá cả khung tốn micro giây.
 *
 *    Quan trọng hơn: bản C đã phải vá HAI LẦN vì vùng xoá không phủ hết
 *    thứ nó vẽ ra (vạch dọc giữa hai mắt, dấu "?" của thinking, dòng
 *    "dang nghe" đọng lại vĩnh viễn). Xoá cả khung cho ra đúng thứ bản
 *    C ĐỊNH hiện, không kèm mấy vết bẩn đó. Nếu muốn tái hiện chính lỗi
 *    ấy thì phải chép cả cách xoá — nhưng mô phỏng này để thiết kế
 *    khuôn mặt, không để gỡ lỗi tối ưu SPI.
 *
 * 2. **`drawStateLabel` vẽ mỗi khung** thay vì chỉ khi đổi. Hệ quả
 *    trực tiếp của (1); trên C nó là mẹo tiết kiệm 11 ms SPI.
 */

import { Gfx } from './gfx';
import {
  C_ANGRY, C_BG, C_CAM, C_DOT_BAD, C_DOT_OK, C_EYE, C_EYE_DIM,
  C_LOVE, C_PUPIL, C_SHINE, C_VANG,
} from './mau';

export enum Emotion {
  NEUTRAL, HAPPY, SAD, ANGRY, SURPRISED, SLEEPY, LOVE,
  THINKING, CONFUSED, WINK,
  // Trạng thái máy, không phải cảm xúc — nhưng hiện lên cùng chỗ.
  LISTENING, SPEAKING,
}

/** Bảng tên server gửi xuống, đúng `setByName()` bên C. */
const TEN_CAM_XUC: Record<string, Emotion> = {
  neutral: Emotion.NEUTRAL, happy: Emotion.HAPPY, sad: Emotion.SAD,
  angry: Emotion.ANGRY, surprised: Emotion.SURPRISED, sleepy: Emotion.SLEEPY,
  love: Emotion.LOVE, thinking: Emotion.THINKING, confused: Emotion.CONFUSED,
  wink: Emotion.WINK,
};

export class ManNguc {
  /**
   * Công khai, có chủ đích: màn ngực là bề mặt DÙNG CHUNG — khuôn mặt
   * chỉ là một trong nhiều thứ vẽ lên đó (oẳn tù tì, thời tiết, sóng
   * âm…). Chỗ điều phối cần mượn được đúng bộ vẽ này thay vì mỗi màn
   * hình tự dựng một cái, kẻo hai bộ vẽ cùng ghi vào một canvas.
   */
  readonly g: Gfx;

  // ─── Bố cục ──────────────────────────────────────────────
  // Bản C đọc lại từ `tft->width()/height()` trong `begin()` và tính
  // theo tỉ lệ, nên mấy con số khởi tạo dưới đây chỉ là giá trị tạm.
  private W = 480;
  private H = 320;
  private EYE_W = 132;
  private EYE_H = 116;
  private EYE_Y = 118;
  private EYE_LX = 138;
  private EYE_RX = 342;
  private MOUTH_Y = 244;

  // ─── Trạng thái ──────────────────────────────────────────
  private emo = Emotion.NEUTRAL;
  private baseEmo = Emotion.NEUTRAL;
  private emoUntil = 0;

  private lookX = 0;
  private lookY = 0;
  private lookTargetX = 0;
  private lookTargetY = 0;

  private blinking = false;
  private nextBlinkAt = 0;
  private blinkUntil = 0;

  private wifiOk = false;
  private serverOk = false;
  private clockTxt = '';
  private batPct = -1;

  constructor(ctx: CanvasRenderingContext2D, w = 480, h = 320) {
    this.g = new Gfx(ctx, w, h);
    this.W = w;
    this.H = h;
    // Đúng `face::begin()`: bố cục theo TỈ LỆ màn, không phải số cứng.
    this.EYE_LX = Math.trunc((w * 29) / 100);
    this.EYE_RX = Math.trunc((w * 71) / 100);
    this.EYE_Y = Math.trunc((h * 37) / 100);
    this.MOUTH_Y = Math.trunc((h * 76) / 100);
    this.nextBlinkAt = performance.now() + 2500;
    this.g.fillScreen(C_BG);
  }

  // ─── Hình cơ bản ─────────────────────────────────────────

  /**
   * Cung dày, xếp các cột dọc theo một parabol.
   *
   * Thư viện có `drawArc` nhưng cung của nó là cung TRÒN. Cung parabol
   * dẹt ở giữa và cong nhanh ở hai đầu, giống nét vẽ tay hơn nhiều —
   * đó là khác biệt giữa "miệng cười" và "một đoạn đường tròn".
   */
  private arcThick(
    cx: number, cy: number, w: number, h: number, thick: number, up: boolean, color: number,
  ): void {
    const half = Math.trunc(w / 2);
    for (let dx = -half; dx <= half; dx++) {
      const t = dx / half; // -1..1
      // ⚠️ `Math.trunc`, không phải `Math.round`: bản C ép kiểu `(int)`
      // nên cắt về 0. Làm tròn cho ra cung lệch nửa pixel ở mỗi cột.
      const dy = Math.trunc(h * (t * t) - h);
      const y = up ? cy - dy - h : cy + dy + h;
      this.g.fillRect(cx + dx, y - Math.trunc(thick / 2), 1, thick, color);
    }
  }

  /** Mắt mở: chữ nhật bo tròn rất tròn — vừa "robot" vừa mềm. */
  private eyeOpen(cx: number, w: number, h: number, color: number, px: number, py: number): void {
    const x = cx - Math.trunc(w / 2);
    const y = this.EYE_Y - Math.trunc(h / 2);
    this.g.fillRoundRect(x, y, w, h, Math.trunc(w / 3), color);

    // Con ngươi. Không để chạm mép — chạm mép trông như mắt lồi.
    const pr = Math.trunc(w / 5);
    const maxOff = Math.trunc(w / 2) - pr - 12;
    const pxx = cx + Math.trunc(px * maxOff);
    const pyy = this.EYE_Y + Math.trunc(py * (Math.trunc(h / 2) - pr - 10));
    this.g.fillCircle(pxx, pyy, pr, C_PUPIL);

    // Đốm sáng lệch trên-trái: thứ khiến con mắt trông "ướt" và có hồn.
    // Bỏ nó đi thì mắt thành hai cái lỗ.
    this.g.fillCircle(pxx - Math.trunc(pr / 3), pyy - Math.trunc(pr / 3), Math.trunc(pr / 3), C_SHINE);
  }

  /** Mắt nhắm / nheo: một nét cong mảnh. */
  private eyeClosed(cx: number, w: number, color: number, smile: boolean): void {
    this.arcThick(cx, this.EYE_Y, w, smile ? 16 : 2, 12, smile, color);
  }

  /** Mắt hình trái tim, cho biểu cảm love. */
  private eyeHeart(cx: number, size: number, color: number): void {
    const r = Math.trunc(size / 3);
    const h = Math.trunc(r / 2);
    this.g.fillCircle(cx - h - 2, this.EYE_Y - h, r, color);
    this.g.fillCircle(cx + h + 2, this.EYE_Y - h, r, color);
    this.g.fillTriangle(
      cx - r - h - 2, this.EYE_Y - h + 2,
      cx + r + h + 2, this.EYE_Y - h + 2,
      cx, this.EYE_Y + Math.trunc(size / 2), color,
    );
  }

  /** Lông mày — thứ chở gần hết cảm xúc trên một khuôn mặt. */
  private brow(cx: number, tiltPx: number, color: number): void {
    const w = this.EYE_W - 20;
    const y = this.EYE_Y - Math.trunc(this.EYE_H / 2) - 26;
    const x0 = cx - Math.trunc(w / 2);
    const x1 = cx + Math.trunc(w / 2);
    // Dày bằng chín nét kề nhau: `drawLine` chỉ dày 1 px.
    for (let k = -4; k <= 4; k++) this.g.drawLine(x0, y - tiltPx + k, x1, y + tiltPx + k, color);
  }

  // ─── Góc trên: đồng hồ, pin, chấm trạng thái ─────────────

  private drawClock(): void {
    if (!this.clockTxt) return;
    this.g.setTextColor(C_EYE_DIM, C_BG);
    this.g.setTextSize(2);
    this.g.setCursor(8, 6);
    this.g.print(this.clockTxt);
  }

  /**
   * Pin cạnh đồng hồ. Màu mang thông tin chứ không trang trí — liếc một
   * cái là biết còn nhiều hay sắp chết, khỏi đọc số.
   *
   * `batPct < 0` thì GIẤU HẲN, không hiện "0%": bộ chia áp chưa hàn nên
   * số đọc về là số rác, mà một con số sai còn tệ hơn không có số vì
   * người ta sẽ tin nó.
   */
  private drawBattery(): void {
    if (this.batPct < 0) return;
    const col = this.batPct > 50 ? C_DOT_OK : this.batPct > 20 ? C_CAM : C_DOT_BAD;
    this.g.setTextColor(col, C_BG);
    this.g.setTextSize(2);
    this.g.setCursor(78, 6);
    this.g.print(`${this.batPct}%`);
  }

  /**
   * Dải chữ trạng thái ở đáy màn: NGHE → NGHĨ → NÓI.
   *
   * Màu chở thông tin: vàng = đến lượt bạn nói, cam = nó đang nghĩ (chờ
   * đi), xanh = nó đang nói. Rảnh thì để trống.
   */
  private drawStateLabel(e: Emotion): void {
    let s: string;
    let col: number;
    switch (e) {
      case Emotion.LISTENING: s = 'DANG NGHE'; col = C_VANG; break;
      case Emotion.THINKING:  s = 'DANG NGHI'; col = C_CAM; break;
      case Emotion.SPEAKING:  s = 'DANG NOI';  col = C_DOT_OK; break;
      default: return;
    }
    this.g.setTextColor(col, C_BG);
    this.g.setTextSize(2);
    this.g.setCursor(14, this.H - 26);
    this.g.print(s);
  }

  // ─── Vẽ cả mặt ───────────────────────────────────────────

  private drawFace(): void {
    const { W, EYE_LX, EYE_RX, EYE_W, EYE_H, MOUTH_Y } = this;
    this.g.fillScreen(C_BG); // xem chú thích đầu file, mục (1)

    const blink = this.blinking;
    let col = C_EYE;
    let ew = EYE_W;
    let eh = EYE_H;
    let px = this.lookX;
    let py = this.lookY;

    switch (this.emo) {
      case Emotion.HAPPY:
        if (!blink) {
          this.eyeClosed(EYE_LX, EYE_W, col, true);
          this.eyeClosed(EYE_RX, EYE_W, col, true);
        } else {
          this.eyeClosed(EYE_LX, EYE_W, col, false);
          this.eyeClosed(EYE_RX, EYE_W, col, false);
        }
        this.arcThick(W / 2, MOUTH_Y, 150, 26, 12, true, col); // miệng cười
        break;

      case Emotion.SAD:
        eh = EYE_H - 26;
        py = 0.45;
        if (blink) {
          this.eyeClosed(EYE_LX, EYE_W, col, false);
          this.eyeClosed(EYE_RX, EYE_W, col, false);
        } else {
          this.eyeOpen(EYE_LX, ew, eh, col, px, py);
          this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        }
        this.brow(EYE_LX, 14, col); // trong cao ngoài thấp
        this.brow(EYE_RX, -14, col);
        this.arcThick(W / 2, MOUTH_Y + 14, 130, 22, 10, false, col); // miệng méo xuống
        break;

      case Emotion.ANGRY:
        col = C_ANGRY;
        eh = EYE_H - 34;
        if (blink) {
          this.eyeClosed(EYE_LX, EYE_W, col, false);
          this.eyeClosed(EYE_RX, EYE_W, col, false);
        } else {
          this.eyeOpen(EYE_LX, ew, eh, col, px, py);
          this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        }
        this.brow(EYE_LX, -20, col); // chụm vào giữa
        this.brow(EYE_RX, 20, col);
        this.arcThick(W / 2, MOUTH_Y + 10, 120, 18, 10, false, col);
        break;

      case Emotion.SURPRISED:
        ew = EYE_W + 16;
        eh = EYE_H + 24;
        this.eyeOpen(EYE_LX, ew, eh, col, px, py);
        this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        this.g.fillCircle(W / 2, MOUTH_Y + 6, 26, col); // miệng chữ O
        this.g.fillCircle(W / 2, MOUTH_Y + 6, 18, C_BG);
        break;

      case Emotion.SLEEPY:
        col = C_EYE_DIM;
        this.eyeClosed(EYE_LX, EYE_W, col, false);
        this.eyeClosed(EYE_RX, EYE_W, col, false);
        this.arcThick(W / 2, MOUTH_Y, 70, 10, 8, false, col);
        // Chữ Z bay lên — dấu hiệu ai cũng đọc được ngay
        this.g.setTextColor(col, C_BG);
        this.g.setTextSize(2); this.g.setCursor(392, 74); this.g.print('z');
        this.g.setTextSize(3); this.g.setCursor(412, 46); this.g.print('z');
        this.g.setTextSize(4); this.g.setCursor(438, 10); this.g.print('Z');
        break;

      case Emotion.LOVE:
        this.eyeHeart(EYE_LX, EYE_H, C_LOVE);
        this.eyeHeart(EYE_RX, EYE_H, C_LOVE);
        this.arcThick(W / 2, MOUTH_Y, 140, 24, 12, true, C_LOVE);
        break;

      case Emotion.THINKING:
        eh = EYE_H - 18;
        px = 0.8; py = -0.5; // liếc lên trên bên phải
        this.eyeOpen(EYE_LX, ew, eh, col, px, py);
        this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        this.brow(EYE_RX, -12, col);
        this.arcThick(W / 2 - 20, MOUTH_Y, 60, 6, 9, false, col); // miệng lệch
        break;

      case Emotion.CONFUSED:
        this.eyeOpen(EYE_LX, ew, eh - 20, col, -0.4, 0.1);
        this.eyeOpen(EYE_RX, ew + 10, eh + 10, col, 0.5, -0.2); // hai mắt lệch cỡ
        this.brow(EYE_LX, 16, col);
        // Miệng lượn sóng — không nét nào nói "khó hiểu" rõ bằng
        for (let i = -60; i <= 60; i += 2) {
          const y = MOUTH_Y + Math.trunc(9 * Math.sin(i / 14.0));
          this.g.fillRect(W / 2 + i, y, 2, 9, col);
        }
        break;

      case Emotion.WINK:
        this.eyeClosed(EYE_LX, EYE_W, col, true); // nháy mắt trái
        this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        this.arcThick(W / 2, MOUTH_Y, 140, 24, 12, true, col);
        break;

      case Emotion.LISTENING:
        // Mắt mở to, con ngươi đứng yên giữa: "đang chú ý nghe".
        this.eyeOpen(EYE_LX, ew, eh, col, 0, 0);
        this.eyeOpen(EYE_RX, ew, eh, col, 0, 0);
        this.arcThick(W / 2, MOUTH_Y, 60, 4, 8, true, col);
        break;

      case Emotion.SPEAKING:
        this.eyeOpen(EYE_LX, ew, eh - 14, col, px, py);
        this.eyeOpen(EYE_RX, ew, eh - 14, col, px, py);
        this.g.fillRoundRect(W / 2 - 46, MOUTH_Y - 16, 92, 34, 16, col); // miệng mở
        break;

      case Emotion.NEUTRAL:
      default:
        if (blink) {
          this.eyeClosed(EYE_LX, EYE_W, col, false);
          this.eyeClosed(EYE_RX, EYE_W, col, false);
        } else {
          this.eyeOpen(EYE_LX, ew, eh, col, px, py);
          this.eyeOpen(EYE_RX, ew, eh, col, px, py);
        }
        this.arcThick(W / 2, MOUTH_Y, 96, 12, 9, true, col);
        break;
    }

    // Chấm trạng thái ở góc: nhỏ, không cướp sự chú ý khỏi khuôn mặt,
    // nhưng vẫn cho biết ngay robot có mạng và có server hay không.
    this.g.fillCircle(W - 22, 16, 6, this.wifiOk ? C_DOT_OK : C_DOT_BAD);
    this.g.fillCircle(W - 42, 16, 6, this.serverOk ? C_DOT_OK : C_DOT_BAD);
    this.drawClock();
    this.drawBattery();
    this.drawStateLabel(this.emo);
  }

  // ─── API ─────────────────────────────────────────────────

  /** Đổi biểu cảm. `ms = 0` nghĩa là giữ mãi tới lệnh sau. */
  set(e: Emotion, ms = 0): void {
    if (ms === 0) this.baseEmo = e;
    this.emo = e;
    this.emoUntil = ms ? performance.now() + ms : 0;
  }

  /**
   * Đặt theo tên server gửi xuống. Trả về `false` nếu màn ngực không
   * biết tên đó — bảng của HAI MẮT rộng hơn (28 tên: scanning,
   * charging, dizzy, excited…), nên tên lạ vẫn phải đưa xuống mắt.
   */
  setByName(name: string, ms = 0): boolean {
    const e = TEN_CAM_XUC[name];
    if (e === undefined) return false;
    this.set(e, ms);
    return true;
  }

  /** Hướng nhìn của con ngươi, -1..1 mỗi trục. */
  look(x: number, y: number): void {
    this.lookTargetX = Math.max(-1, Math.min(1, x));
    this.lookTargetY = Math.max(-1, Math.min(1, y));
  }

  setStatus(w: boolean, s: boolean): void {
    this.wifiOk = w;
    this.serverOk = s;
  }

  setClock(hhmm: string): void {
    this.clockTxt = (hhmm || '').slice(0, 5);
  }

  setBattery(pct: number): void {
    this.batPct = pct;
  }

  current(): Emotion {
    return this.emo;
  }

  /** Gọi mỗi khung: lo chớp mắt, đảo mắt, hết hạn biểu cảm, rồi vẽ. */
  loop(now = performance.now()): void {
    // Hết hạn biểu cảm tạm → về nền
    if (this.emoUntil && now > this.emoUntil) {
      this.emoUntil = 0;
      this.emo = this.baseEmo;
    }

    // Chớp mắt. Khoảng cách NGẪU NHIÊN 3-6 giây — chớp đều tăm tắp
    // trông như máy đếm nhịp chứ không như sinh vật.
    if (!this.blinking && now > this.nextBlinkAt) {
      this.blinking = true;
      this.blinkUntil = now + 110;
    } else if (this.blinking && now > this.blinkUntil) {
      this.blinking = false;
      this.nextBlinkAt = now + 3000 + Math.random() * 3000;
    }

    // Con ngươi trôi nhẹ về đích. Nhảy cóc trông giật; trôi dần trông sống.
    if (
      Math.abs(this.lookX - this.lookTargetX) > 0.02 ||
      Math.abs(this.lookY - this.lookTargetY) > 0.02
    ) {
      this.lookX += (this.lookTargetX - this.lookX) * 0.25;
      this.lookY += (this.lookTargetY - this.lookY) * 0.25;
    }

    this.drawFace();
  }
}
