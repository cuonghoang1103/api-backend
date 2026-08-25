/**
 * ============================================================
 * OẲN TÙ TÌ — màn ngực 480×320
 * ============================================================
 *
 * ⚠️ VÌ SAO MÀN NGỰC KHÔNG VẼ MẶT NỮA.
 *
 * `face.cpp` vẽ một khuôn mặt đầy đủ — hai mắt, cái miệng — lên màn
 * ngực. Nó là di sản từ hồi robot CHỈ CÓ MỘT MÀN. Giờ có ba, và hai
 * màn tròn đã là mắt, nên màn to nhất đang làm lại việc mà hai màn nhỏ
 * làm rồi: ba con mắt trên một con robot.
 *
 * Phân vai đúng:
 *
 *     hai màn tròn  →  CẢM XÚC   (28 biểu cảm, `eyes.cpp`)
 *     màn ngực      →  HÀNH ĐỘNG (thứ robot đang LÀM)
 *
 * Và oẳn tù tì là ví dụ rõ nhất: **robot chưa có tay, nhưng màn ngực
 * đóng vai bàn tay được.** Một tấm màn thay được cả cơ cấu servo đang
 * hoãn — mà lại chơi được ngay, không phải chờ linh kiện.
 *
 * ⚠️ VẼ BẰNG HÌNH KHỐI, KHÔNG DÙNG ẢNH BITMAP.
 *
 * Cùng lý do `face.h` đã ghi: ba bàn tay × 480×320 × 16 bit là ~900 KB
 * ảnh, mà flash còn trống 5,6 MB và còn phải chừa cho OTA. Hình khối
 * tốn vài KB, đổi được cỡ và màu theo tham số, và co giãn theo kích
 * thước màn.
 *
 * ⚠️ MỌI LỆNH VẼ Ở ĐÂY ĐỀU CÓ SẴN TRONG Arduino_GFX.
 * `fillRoundRect` · `fillCircle` · `fillTriangle` · `fillRect` · `print`.
 * Không dùng gì mà firmware không làm được — nếu không thì bản mô phỏng
 * đẹp hơn bản thật, và đó là kiểu vô dụng tệ nhất.
 */

import { Gfx } from './gfx';
import { rgb565 } from './mau';

export type Tay = 'bua' | 'bao' | 'keo';
export const BA_TAY: Tay[] = ['bua', 'bao', 'keo'];
export const TEN_TAY: Record<Tay, string> = { bua: 'BUA', bao: 'BAO', keo: 'KEO' };

export type Pha = 'cho' | 'dem' | 'ket';
export type KetQua = 'thang' | 'thua' | 'hoa';

const C_NEN = rgb565(0, 0, 0);
const C_ODIN = rgb565(0, 229, 255);   // lơ — màu của robot
const C_NGUOI = rgb565(255, 176, 60); // hổ phách — màu của người chơi
const C_CHU = rgb565(215, 225, 235);
const C_MO = rgb565(90, 105, 120);
const C_HOA = rgb565(150, 160, 175);

/**
 * Thanh bo tròn hai đầu, nối hai điểm bất kỳ.
 *
 * Cần vì `fillRoundRect` chỉ vẽ được hình thẳng trục, mà ngón tay thì
 * xoè theo góc. Dựng bằng HAI tam giác + HAI hình tròn = bốn lệnh, thay
 * vì rải hàng chục hình tròn dọc đường thẳng — trên ESP32 mỗi hình tròn
 * là một chùm đường ngang, nên cách rải tốn gấp mấy chục lần.
 */
function thanh(g: Gfx, x0: number, y0: number, x1: number, y1: number, r: number, c: number): void {
  const dx = x1 - x0, dy = y1 - y0;
  const d = Math.hypot(dx, dy);
  if (d < 0.5) return g.fillCircle(x0, y0, r, c);
  const nx = (-dy / d) * r, ny = (dx / d) * r;
  g.fillTriangle(x0 + nx, y0 + ny, x1 + nx, y1 + ny, x1 - nx, y1 - ny, c);
  g.fillTriangle(x0 + nx, y0 + ny, x1 - nx, y1 - ny, x0 - nx, y0 - ny, c);
  g.fillCircle(x0, y0, r, c);
  g.fillCircle(x1, y1, r, c);
}

/** Ngón tay theo góc, tính từ phương thẳng đứng hướng LÊN. */
function ngon(g: Gfx, cx: number, cy: number, deg: number, dai: number, r: number, c: number): void {
  const rad = (deg * Math.PI) / 180;
  thanh(g, cx, cy, cx + Math.sin(rad) * dai, cy - Math.cos(rad) * dai, r, c);
}

/**
 * Một bàn tay. `s` là hệ số cỡ (1 = bàn tay cao ~150 px).
 *
 * `lat = true` lật gương theo trục dọc — dùng cho bàn tay bên phải, để
 * hai bàn tay đối diện nhau như hai người ngồi đối diện chứ không như
 * hai người cùng nhìn một hướng.
 */
export function veTay(
  g: Gfx, tay: Tay, cx: number, cy: number, s: number, c: number, lat = false,
): void {
  const k = (v: number) => Math.round(v * s);
  const L = lat ? -1 : 1;

  /**
   * ⚠️ MỌI toạ độ x của bàn tay PHẢI đi qua hàm này.
   *
   * Bản đầu chỉ lật GÓC ngón (`L * goc`) mà quên lật VỊ TRÍ GỐC ngón.
   * Hậu quả trên bàn "bao" của Odin: ngón ngoài cùng bên trái nhận góc
   * chỉ sang phải, ngón ngoài cùng bên phải nhận góc chỉ sang trái —
   * bốn ngón bắt chéo rồi chồng lên nhau thành một cục, không còn ra
   * bàn tay. Bàn không lật thì vẫn đúng, nên lỗi chỉ hiện ở MỘT trong
   * hai bên và rất dễ tưởng là "bên kia vẽ hơi lạ".
   */
  const X = (dx: number) => cx + L * dx;

  // Nắm đấm — phần chung của cả ba, vì cả ba đều bắt đầu từ nắm tay.
  // Nó đối xứng qua tâm nên không cần lật.
  const nw = k(104), nh = k(88);
  g.fillRoundRect(cx - nw / 2, cy - nh / 2, nw, nh, k(26), c);

  switch (tay) {
    case 'bua': {
      // Bốn khớp ngón nhô lên mép trên: thứ duy nhất phân biệt "nắm
      // đấm" với "một cục bo tròn".
      for (let i = 0; i < 4; i++) {
        g.fillCircle(X(-nw / 2 + k(16) + i * k(24)), cy - nh / 2 + k(4), k(12), c);
      }
      // Ngón cái gập ngang phía dưới.
      thanh(g, X(-k(46)), cy + k(6), X(k(6)), cy + k(24), k(13), c);
      break;
    }

    case 'bao': {
      // Bốn ngón xoè, mỗi ngón một góc riêng — xoè đều tăm tắp trông
      // như cái lược, xoè hơi khác nhau mới ra bàn tay.
      const goc = [-30, -11, 8, 26];
      const dai = [k(78), k(88), k(84), k(70)];
      for (let i = 0; i < 4; i++) {
        ngon(g, X(-nw / 2 + k(18) + i * k(23)), cy - nh / 2 + k(10), L * goc[i], dai[i], k(11), c);
      }
      // ⚠️ Ngón cái CHẾCH XUỐNG, không nằm ngang.
      //
      // Bản đầu để -78° và dài 58: gần như song song mặt đất, nên nó
      // đọc thành CÁI QUE CẮM NGANG bàn tay chứ không thành ngón cái —
      // và vì nó thò hẳn ra ngoài khung, hai bàn tay cạnh nhau trông
      // như bị nối vào nhau. Ngón cái thật chếch xuống khỏi lòng bàn
      // tay và ngắn hơn bốn ngón kia rõ rệt.
      ngon(g, X(-(nw / 2 - k(14))), cy + k(14), L * -122, k(42), k(12), c);
      break;
    }

    case 'keo': {
      // Hai ngón tạo chữ V. Góc mở 52° — hẹp hơn thì đọc thành "hai
      // ngón chỉ lên", rộng hơn thì thành dấu hoà bình chứ không phải
      // cái kéo.
      ngon(g, X(-k(16)), cy - nh / 2 + k(12), L * -26, k(96), k(13), c);
      ngon(g, X(k(14)), cy - nh / 2 + k(12), L * 26, k(96), k(13), c);
      // Hai ngón còn lại gập, và ngón cái giữ chúng.
      g.fillCircle(X(k(34)), cy - k(6), k(13), c);
      thanh(g, X(-k(44)), cy + k(8), X(k(4)), cy + k(24), k(12), c);
      break;
    }
  }
}

/** Ai thắng: `tay` của người chơi so với `tayOdin`. */
export function xuLy(nguoi: Tay, odin: Tay): KetQua {
  if (nguoi === odin) return 'hoa';
  const thang: Record<Tay, Tay> = { bua: 'keo', keo: 'bao', bao: 'bua' };
  return thang[nguoi] === odin ? 'thang' : 'thua';
}

export interface TrangThaiTro {
  pha: Pha;
  demConLai: number;   // 3 → 2 → 1 → 0
  tayNguoi: Tay | null;
  tayOdin: Tay | null;
  ketQua: KetQua | null;
  diemNguoi: number;
  diemOdin: number;
  /** Giây kể từ lúc vào pha hiện tại — dùng cho hoạt ảnh nảy. */
  t: number;
}

const NHAN_DEM = ['', 'TI!', 'TU', 'OAN'];

/**
 * Vẽ cả màn hình trò chơi.
 *
 * Xoá cả khung mỗi lần: khác `drawFace()`, ở đây gần như MỌI thứ đổi
 * giữa hai khung (hai bàn tay nảy, số đếm, chữ kết quả), nên chia dải
 * chẳng tiết kiệm được gì mà lại bỏ sót — đúng cái bẫy `drawFace()` đã
 * phải vá hai lần.
 */
export function veTro(g: Gfx, st: TrangThaiTro): void {
  const W = g.width, H = g.height;
  g.fillScreen(C_NEN);

  // ── Bảng điểm ──
  g.setTextSize(2);
  g.setTextColor(C_NGUOI, C_NEN);
  g.setCursor(14, 10);
  g.print(`BAN ${st.diemNguoi}`);
  g.setTextColor(C_MO, C_NEN);
  g.setCursor(W / 2 - 12, 10);
  g.print('-');
  g.setTextColor(C_ODIN, C_NEN);
  g.setCursor(W - 100, 10);
  g.print(`${st.diemOdin} ODIN`);
  g.fillRect(0, 36, W, 2, rgb565(24, 30, 38));

  // 0,53 chứ không 0,48, và cỡ 0,92 chứ không 1,0: ở mức cũ hai ngón
  // của bàn KÉO chạm vào vạch bảng điểm — bàn tay cao nhất trong ba
  // bàn quyết định chỗ đặt, không phải bàn trung bình.
  const yTay = Math.round(H * 0.53);
  const CO = 0.92;
  const xNguoi = Math.round(W * 0.26);
  const xOdin = Math.round(W * 0.74);

  if (st.pha === 'cho') {
    g.setTextSize(3);
    g.setTextColor(C_CHU, C_NEN);
    g.setCursor(W / 2 - 12 * 6, Math.round(H * 0.38));
    g.print('OAN TU TI');
    g.setTextSize(2);
    g.setTextColor(C_MO, C_NEN);
    g.setCursor(W / 2 - 12 * 9, Math.round(H * 0.58));
    g.print('noi: bua, bao, hay keo');
    return;
  }

  // Trong lúc đếm, CẢ HAI bàn tay đều là nắm đấm và nảy lên xuống —
  // đúng như người thật lắc tay theo nhịp đếm. Lệch pha nửa nhịp cho
  // hai bên, vì hai người không bao giờ lắc trùng khít.
  const dem = st.pha === 'dem';
  const nay = (pha: number) => (dem ? Math.round(Math.sin(st.t * 9 + pha) * 14) : 0);

  const tN = dem ? 'bua' : (st.tayNguoi ?? 'bua');
  const tO = dem ? 'bua' : (st.tayOdin ?? 'bua');
  veTay(g, tN, xNguoi, yTay + nay(0), CO, C_NGUOI, false);
  veTay(g, tO, xOdin, yTay + nay(Math.PI), CO, C_ODIN, true);

  if (dem) {
    g.setTextSize(4);
    g.setTextColor(C_CHU, C_NEN);
    const nhan = NHAN_DEM[Math.max(0, Math.min(3, st.demConLai))];
    g.setCursor(W / 2 - (nhan.length * 24) / 2, Math.round(H * 0.40));
    g.print(nhan);
    return;
  }

  // ── Kết quả ──
  //
  // ⚠️ Màu theo AI THẮNG, không theo tốt/xấu.
  //
  // Bản đầu tô xanh lá cho "thắng" và đỏ cho "thua" — nhưng chữ thì
  // viết theo góc nhìn NGƯỜI CHƠI ("ODIN THANG") còn màu lại viết theo
  // góc nhìn ROBOT. Kết quả: bạn thua, màn hiện "ODIN THANG" bằng màu
  // xanh lá của chiến thắng. Hai nửa cùng một dòng chữ nói hai chuyện
  // ngược nhau.
  //
  // Dùng lại đúng hai màu mà bảng điểm phía trên đã dạy — hổ phách là
  // bạn, lơ là Odin — thì không còn chỗ nào để hiểu nhầm, và người xem
  // đọc được kết quả trước cả khi kịp đọc chữ.
  const mau = st.ketQua === 'thang' ? C_NGUOI : st.ketQua === 'thua' ? C_ODIN : C_HOA;
  const chu = st.ketQua === 'thang' ? 'BAN THANG' : st.ketQua === 'thua' ? 'ODIN THANG' : 'HOA';
  g.setTextSize(3);
  g.setTextColor(mau, C_NEN);
  g.setCursor(W / 2 - (chu.length * 18) / 2, H - 52);
  g.print(chu);
}

// ============================================================
// Máy trạng thái
// ============================================================

/** Nhịp đếm, ms mỗi bước. Người thật đếm "oẳn — tù — tì" quanh mức này. */
const NHIP = 620;

/** Giữ kết quả trên màn bao lâu trước khi về màn chờ. */
const GIU_KET_QUA = 3200;

export class TroOanTuTi {
  private st: TrangThaiTro = {
    pha: 'cho', demConLai: 0, tayNguoi: null, tayOdin: null,
    ketQua: null, diemNguoi: 0, diemOdin: 0, t: 0,
  };
  private moc = 0;      // millis lúc vào pha hiện tại
  private buocLuc = 0;  // millis cho bước đếm kế tiếp

  /** Gọi khi có kết quả — để chỗ ngoài đổi biểu cảm mắt cho khớp. */
  onKetQua: ((k: KetQua, nguoi: Tay, odin: Tay) => void) | null = null;

  trangThai(): Readonly<TrangThaiTro> {
    return this.st;
  }

  /**
   * Bắt đầu một ván. `tayNguoi` có thể là `null` — khi người chơi nói
   * lựa chọn TRONG lúc đang đếm, đúng như chơi ngoài đời.
   */
  batDau(tayNguoi: Tay | null = null, now = performance.now()): void {
    this.st.pha = 'dem';
    this.st.demConLai = 3;
    this.st.tayNguoi = tayNguoi;
    this.st.tayOdin = null;
    this.st.ketQua = null;
    this.moc = now;
    this.buocLuc = now + NHIP;
  }

  /** Người chơi chốt tay. Bỏ qua nếu ván đã lật bài. */
  chon(tay: Tay): void {
    if (this.st.pha === 'ket') return;
    this.st.tayNguoi = tay;
    if (this.st.pha === 'cho') this.batDau(tay);
  }

  private lat(now: number): void {
    // ⚠️ Odin bốc NGẪU NHIÊN, cố ý.
    //
    // Rất dễ sa vào việc cho nó "thông minh" — đoán thói quen người
    // chơi, hoặc chọn sau khi đã biết tay đối phương. Cả hai đều hỏng
    // trò: cái đầu làm nó thắng mãi (chán), cái sau là gian lận, và
    // người chơi nhận ra ngay sau vài ván dù không chứng minh được.
    //
    // Ngẫu nhiên thuần cho tỉ lệ 1/3 — đủ để cả hai bên đều có lúc
    // thắng, và đó mới là thứ khiến người ta chơi ván nữa.
    const odin = BA_TAY[Math.floor(Math.random() * BA_TAY.length)];
    const nguoi = this.st.tayNguoi ?? BA_TAY[Math.floor(Math.random() * BA_TAY.length)];
    const k = xuLy(nguoi, odin);
    this.st.tayNguoi = nguoi;
    this.st.tayOdin = odin;
    this.st.ketQua = k;
    if (k === 'thang') this.st.diemNguoi++;
    else if (k === 'thua') this.st.diemOdin++;
    this.st.pha = 'ket';
    this.moc = now;
    this.onKetQua?.(k, nguoi, odin);
  }

  /** Gọi mỗi khung. Tự chạy đồng hồ đếm và tự vẽ. */
  loop(g: Gfx, now = performance.now()): void {
    this.st.t = (now - this.moc) / 1000;

    if (this.st.pha === 'dem' && now >= this.buocLuc) {
      this.st.demConLai--;
      this.buocLuc = now + NHIP;
      if (this.st.demConLai <= 0) this.lat(now);
    } else if (this.st.pha === 'ket' && now - this.moc > GIU_KET_QUA) {
      this.st.pha = 'cho';
      this.st.tayNguoi = null;
      this.st.tayOdin = null;
      this.st.ketQua = null;
      this.moc = now;
    }

    veTro(g, this.st);
  }
}
