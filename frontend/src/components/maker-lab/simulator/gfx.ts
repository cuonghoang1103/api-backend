/**
 * ============================================================
 * GFX — canvas đội lốt Arduino_GFX
 * ============================================================
 *
 * Lớp này KHÔNG phải để cho đẹp. Nó tồn tại để đoạn port `face.cpp` và
 * `eyes.cpp` đọc gần như NGUYÊN VĂN bản C: cùng tên hàm, cùng thứ tự
 * tham số, cùng quy ước màu RGB565.
 *
 * Vì sao đáng: hai bản (firmware và mô phỏng) sẽ trôi ra xa nhau theo
 * thời gian — đó là chuyện chắc chắn xảy ra với mọi thứ được viết hai
 * lần. Thứ duy nhất chống lại được là **đặt hai file cạnh nhau và soi
 * từng dòng**. Nếu bản TypeScript viết bằng API canvas thuần
 * (`ctx.beginPath`, `ctx.arc`, `ctx.fill`) thì không ai soi nổi, và
 * lệch sẽ tích lại trong im lặng.
 *
 * ⚠️ MỘT CHỖ KHÔNG THỂ CHÉP ĐÚNG: CHỮ.
 *
 * Adafruit_GFX vẽ chữ bằng phông bitmap 5×7 nằm trong ô 6×8. Ở đây
 * dùng phông monospace của trình duyệt, đặt theo cùng ô 6×8 nên VỊ TRÍ
 * và BỀ RỘNG khớp, còn NÉT CHỮ thì khác. Chữ trên màn ngực chỉ có đồng
 * hồ, phần trăm pin và dải "DANG NGHE" — khác nét không ảnh hưởng gì
 * tới việc căn bố cục, mà chép cả bảng phông bitmap vào đây thì tốn
 * 475 byte dữ liệu để đổi lấy đúng một thứ không ai nhìn.
 */

import { css565 } from './mau';

/** Ô một ký tự của Adafruit_GFX ở cỡ 1: rộng 6, cao 8. */
const O_RONG = 6;
const O_CAO = 8;

export class Gfx {
  private c: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;

  private tcFg = 0xffff;
  private tcBg: number | null = null;
  private tSize = 1;
  private cx = 0;
  private cy = 0;

  constructor(ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.c = ctx;
    this.width = w;
    this.height = h;
  }

  fillScreen(color: number): void {
    this.c.fillStyle = css565(color);
    this.c.fillRect(0, 0, this.width, this.height);
  }

  fillRect(x: number, y: number, w: number, h: number, color: number): void {
    this.c.fillStyle = css565(color);
    this.c.fillRect(x, y, w, h);
  }

  fillRoundRect(x: number, y: number, w: number, h: number, r: number, color: number): void {
    // Arduino_GFX kẹp bán kính ở nửa cạnh ngắn; canvas thì vẽ méo nếu
    // vượt, nên phải kẹp y hệt chứ không để nguyên.
    const rr = Math.min(r, Math.floor(Math.min(w, h) / 2));
    this.c.fillStyle = css565(color);
    this.c.beginPath();
    this.c.roundRect(x, y, w, h, rr);
    this.c.fill();
  }

  fillCircle(cx: number, cy: number, r: number, color: number): void {
    if (r <= 0) return;
    this.c.fillStyle = css565(color);
    this.c.beginPath();
    this.c.arc(cx, cy, r, 0, Math.PI * 2);
    this.c.fill();
  }

  /**
   * Vành khuyên. Phải là MỘT hình có lỗ, không phải "đĩa ngoài rồi đĩa
   * trong màu nền": vành được vẽ ĐÈ lên mống mắt, nên tô ruột bằng màu
   * nền sẽ khoét một lỗ đen vào giữa con mắt.
   *
   * Vòng trong đi NGƯỢC CHIỀU (`true` ở tham số cuối của `arc`) để quy
   * tắc nonzero coi nó là lỗ. Dùng `evenodd` cũng ra kết quả ấy, nhưng
   * nó phụ thuộc vào việc không có hình nào khác trong cùng path.
   */
  fillRing(cx: number, cy: number, rNgoai: number, rTrong: number, color: number): void {
    if (rNgoai <= 0) return;
    if (rTrong <= 0) return this.fillCircle(cx, cy, rNgoai, color);
    this.c.fillStyle = css565(color);
    this.c.beginPath();
    this.c.arc(cx, cy, rNgoai, 0, Math.PI * 2, false);
    this.c.arc(cx, cy, rTrong, 0, Math.PI * 2, true);
    this.c.fill();
  }

  fillTriangle(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: number,
  ): void {
    this.c.fillStyle = css565(color);
    this.c.beginPath();
    this.c.moveTo(x0, y0);
    this.c.lineTo(x1, y1);
    this.c.lineTo(x2, y2);
    this.c.closePath();
    this.c.fill();
  }

  /**
   * ⚠️ `drawLine` của Adafruit_GFX dày ĐÚNG 1 px và không khử răng cưa.
   * Canvas thì mặc định khử răng cưa và vẽ nét giữa toạ độ, nên một
   * nét ngang ở y=10 bị trải làm hai hàng mờ. Cộng 0,5 để nét rơi trọn
   * vào một hàng — đúng chỗ `brow()` xếp chín nét kề nhau, sai nửa
   * pixel là lông mày ra sọc vằn.
   */
  drawLine(x0: number, y0: number, x1: number, y1: number, color: number): void {
    this.c.strokeStyle = css565(color);
    this.c.lineWidth = 1;
    this.c.beginPath();
    this.c.moveTo(x0 + 0.5, y0 + 0.5);
    this.c.lineTo(x1 + 0.5, y1 + 0.5);
    this.c.stroke();
  }

  setTextColor(fg: number, bg?: number): void {
    this.tcFg = fg;
    this.tcBg = bg ?? null;
  }

  setTextSize(n: number): void {
    this.tSize = Math.max(1, Math.floor(n));
  }

  setCursor(x: number, y: number): void {
    this.cx = x;
    this.cy = y;
  }

  /** Vẽ từ con trỏ, gốc TRÊN-TRÁI — đúng quy ước Adafruit_GFX. */
  print(s: string): void {
    const w = O_RONG * this.tSize;
    const h = O_CAO * this.tSize;
    this.c.textBaseline = 'top';
    this.c.textAlign = 'left';
    this.c.font = `${h}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    for (const ch of s) {
      if (this.tcBg !== null) {
        this.c.fillStyle = css565(this.tcBg);
        this.c.fillRect(this.cx, this.cy, w, h);
      }
      this.c.fillStyle = css565(this.tcFg);
      this.c.fillText(ch, this.cx, this.cy);
      this.cx += w;
    }
  }
}
