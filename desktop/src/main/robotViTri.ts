/**
 * ============================================================
 * VỊ TRÍ CỬA SỔ ROBOT — kẹp trong màn hình, neo theo góc GẦN NHẤT
 * ============================================================
 *
 * Tách khỏi `robotNoi.ts` để kiểm được bằng số: mọi hàm ở đây là hàm thuần,
 * không đụng `BrowserWindow` lẫn `screen`. Cả bốn lỗi dưới đây đều đo được
 * trên app thật (10/09/2026, Playwright điều khiển bản đã dựng) trước khi vá.
 *
 * ─── 1. KÉO RA NGOÀI KHÔNG BỊ CHẶN ───
 * `keoToi(9000, 9000)` trên vùng làm việc 1728×1022 cho ra `x=1688, y=1027`:
 * con robot 150×190 chỉ còn **40px** thò vào màn hình, và mép dưới nằm 162px
 * bên dưới đáy. `keoToi(-5000,-5000)` cho `x=-110`.
 *
 * ⚠️ macOS còn tự chặn một phần (y kẹp ở mép menu bar, x không xuống dưới
 * -110). **Windows KHÔNG chặn gì cả** — `x` nhận đúng -5000 và con robot biến
 * mất hẳn. Nó không có khung, không có mục trong thanh tác vụ (`skipTaskbar`),
 * nên không còn đường nào lôi lại ngoài xoá tệp cấu hình. Đó là lý do việc kẹp
 * phải nằm ở MÃ CỦA MÌNH chứ không trông vào hệ điều hành.
 *
 * ─── 2. ĐỔI CỠ NEO CỨNG GÓC DƯỚI-PHẢI ───
 * Đo: đặt robot ở góc trên-trái `(10, 43)` rồi thu về nấc 52% ⇒ nó nhảy tới
 * `(82, 134)` — dịch 72px sang phải và 91px xuống dưới, RỜI KHỎI đúng cái góc
 * người dùng vừa đặt nó vào. Neo dưới-phải chỉ đúng khi robot Ở góc dưới-phải.
 *
 * ─── 3. MỞ KHUNG CHAT Ở GÓC TRÊN-TRÁI ⇒ VĂNG KHỎI MÀN HÌNH ───
 * Đo: `doiKichThuoc(true)` (380×520) khi robot ở `(10, 43)` cho ra
 * `(-220, -287)`. Khung chat nằm ngoài màn hình, gõ vào đâu cũng không thấy.
 *
 * ─── 4. VỊ TRÍ KHÔNG ĐƯỢC LƯU ───
 * Đo: kéo tới `(154, 61)`, thoát app, mở lại ⇒ `(1554, 841)`. Người dùng đặt
 * robot ở đâu cũng vô nghĩa sau lần khởi động sau. `moRobot()` luôn gọi
 * `viTriGocDuoi()` và `keoXong()` không ghi gì xuống.
 */

export interface Vung { x: number; y: number; width: number; height: number }

/**
 * Kẹp cửa sổ nằm TRỌN trong một vùng làm việc.
 *
 * Cửa sổ to hơn vùng (khung chat 380×520 trên màn hình nhỏ) thì ưu tiên mép
 * TRÊN-TRÁI: thà thò ra mép dưới-phải còn hơn đẩy thanh tiêu đề/nút đóng ra
 * ngoài — người dùng còn với tới được phần điều khiển.
 */
export function kep(o: Vung, vung: Vung): Vung {
  const xMax = vung.x + vung.width - o.width;
  const yMax = vung.y + vung.height - o.height;
  return {
    ...o,
    x: Math.round(Math.min(Math.max(o.x, vung.x), Math.max(xMax, vung.x))),
    y: Math.round(Math.min(Math.max(o.y, vung.y), Math.max(yMax, vung.y))),
  };
}

/**
 * Đổi cỡ mà GIỮ NGUYÊN góc gần nhất.
 *
 * Robot ở nửa phải màn hình ⇒ neo mép phải (phình sang trái). Ở nửa trái ⇒ neo
 * mép trái. Tương tự trên/dưới. Nhờ vậy con robot ở lại đúng góc người dùng
 * chọn thay vì trôi vào giữa, và khung chat luôn mở về phía CÒN CHỖ.
 *
 * So sánh theo TÂM cửa sổ chứ không theo mép: dùng mép thì một cửa sổ nằm vắt
 * ngang chính giữa sẽ nhảy neo qua lại giữa hai lần đổi cỡ liền nhau.
 */
export function doiCoGiuGoc(cu: Vung, kt: { width: number; height: number }, vung: Vung): Vung {
  const tamX = cu.x + cu.width / 2;
  const tamY = cu.y + cu.height / 2;
  const phai = tamX > vung.x + vung.width / 2;
  const duoi = tamY > vung.y + vung.height / 2;
  return kep({
    x: phai ? cu.x + cu.width - kt.width : cu.x,
    y: duoi ? cu.y + cu.height - kt.height : cu.y,
    ...kt,
  }, vung);
}

/**
 * Chọn vùng làm việc cho một vị trí đã lưu.
 *
 * ⚠️ Màn hình đã lưu có thể KHÔNG CÒN: người dùng rút màn ngoài, hoặc mở máy ở
 * chỗ khác. Vị trí cũ khi ấy trỏ vào khoảng không, và cửa sổ không khung nằm
 * ngoài mọi màn hình là cửa sổ không lấy lại được. Nên: tìm màn hình nào CHỨA
 * điểm đó; không có thì rơi về màn hình chính.
 */
export function vungChoDiem(
  diem: { x: number; y: number },
  cacVung: readonly Vung[],
  vungChinh: Vung,
): Vung {
  return cacVung.find((v) =>
    diem.x >= v.x && diem.x < v.x + v.width
    && diem.y >= v.y && diem.y < v.y + v.height) ?? vungChinh;
}

/**
 * HÚT VÀO MÉP gần hơn theo chiều NGANG.
 *
 * Kiểu "bong bóng chat" của Messenger/iOS, và nó được chọn có lý do: chiều
 * DỌC là thứ người dùng dùng để tránh che nội dung (kéo lên khỏi thanh tác vụ,
 * xuống dưới thanh menu), nên hút cả hai chiều là cướp mất quyết định ấy. Chỉ
 * hút ngang thì robot luôn dính mép, không bao giờ lửng lơ giữa màn hình che
 * mất thứ đang đọc, mà vẫn ở đúng độ cao người dùng đặt.
 *
 * So bằng TÂM cửa sổ, không bằng mép trái: so mép trái thì một cửa sổ rộng
 * (khung chat 380px) nằm chính giữa sẽ luôn bị coi là "gần mép trái".
 */
export function hutMep(o: Vung, vung: Vung, le = 0): Vung {
  const tamX = o.x + o.width / 2;
  const benTrai = tamX < vung.x + vung.width / 2;
  return kep({
    ...o,
    x: benTrai ? vung.x + le : vung.x + vung.width - o.width - le,
  }, vung);
}

/**
 * Thiết đặt này có nghĩa là HIỆN robot không.
 *
 * ⚠️ THIẾU KHOÁ = BẬT. Máy đã cài từ trước chưa có khoá này trong tệp cấu
 * hình; coi "thiếu" là tắt thì bản cập nhật sẽ làm robot biến mất với TẤT CẢ
 * người dùng cũ, và họ không biết đi bật lại ở đâu. Cùng quy ước với
 * `OdinDock` (`settings.robotEnabled !== false`) — hai nơi lệch nhau là hai
 * con robot nói hai chuyện khác nhau.
 */
export function nenHienRobot(c: { robotEnabled?: unknown }): boolean {
  return c.robotEnabled !== false;
}

/*
 * ════════════════════════════════════════════════════════════════════
 * BẢN 03/10/2026 — "THẢ Ở ĐÂU ĐỨNG YÊN Ở ĐÓ"
 * ════════════════════════════════════════════════════════════════════
 *
 * Người dùng: "kích thước chưa được 20%–100% chuẩn; di chuyển chưa mượt, chưa
 * cố định và đứng vững ở vị trí tôi muốn đặt; có nhiều chỗ tôi muốn kéo vào
 * đúng chỗ mà nó tự chạy qua chỗ khác — cả trên mac, windows, linux".
 *
 * Đọc mã cũ ra SÁU nguyên nhân thật, chồng lên nhau:
 *
 *  1. **HÚT MÉP MẶC ĐỊNH BẬT.** `keoXong()` luôn trượt robot sang mép trái/phải
 *     gần hơn (`robotBamMep !== false`). Thả giữa màn hình ⇒ nó chạy đi. Đổi
 *     cỡ bằng nút −/+ cũng gọi `hutMep` ⇒ chạy đi lần nữa.
 *  2. **CỬA SỔ ĐỔI CỠ LÀ ROBOT TRÔI.** Mỗi lần hiện bong bóng / mở khung chat,
 *     cửa sổ phình theo "góc gần nhất" của CẢ cửa sổ, rồi thu lại theo góc gần
 *     nhất của cửa sổ ĐÃ phình — tâm khác nhau ⇒ góc khác nhau ⇒ robot về một
 *     chỗ KHÁC chỗ cũ. Trong cửa sổ, robot lại luôn dính góc dưới-phải (flex
 *     `justify-content/align-items: flex-end`), nên hễ cửa sổ phình xuống dưới
 *     hay sang phải là robot nhảy theo. Mỗi bong bóng một lần trôi.
 *  3. **KẸP THEO MÀN HÌNH ĐANG CHỨA CỬA SỔ.** `keoToi` kẹp vào
 *     `getDisplayMatching(bounds)` — tức màn hình HIỆN TẠI — nên robot không bao
 *     giờ sang được màn thứ hai: tới mép là bị chặn lại.
 *  4. **VÙNG KÉO GỐC CỦA HỆ ĐIỀU HÀNH.** `.rb { -webkit-app-region: drag }` biến
 *     phần trong suốt quanh robot thành vùng kéo của OS: kéo ở đó thì không qua
 *     mã của mình ⇒ không kẹp, không LƯU — lần đổi cỡ kế tiếp tính từ vị trí cũ.
 *  5. **LƯU TOẠ ĐỘ CỬA SỔ, KHÔNG PHẢI CỦA ROBOT.** Thả lúc bong bóng đang hiện
 *     là lưu góc trái-trên của cửa sổ to; mở lại với cửa sổ nhỏ ⇒ lệch đúng bằng
 *     bong bóng. Và màn hình đổi độ phân giải là toạ độ tuyệt đối vô nghĩa.
 *  6. **CỠ 4 NẤC 100/82/66/52**, không phải 20–100%.
 *
 * Cách mới: main giữ MỘT điểm neo — góc trái-trên của HỘP ROBOT (robot + nút
 * mic) trên màn hình. Mọi cỡ cửa sổ khác (bong bóng, bảng chỉnh, khung chat)
 * được TÍNH TỪ neo, và renderer đặt robot vào đúng vị trí neo bên trong cửa sổ
 * (`BoCuc.hop`). Neo chỉ đổi khi NGƯỜI DÙNG kéo hoặc đổi cỡ. Nên robot không
 * bao giờ di chuyển vì một bong bóng.
 */

export interface Co { width: number; height: number }
export interface Diem { x: number; y: number }

/** Một màn hình, rút gọn từ `Electron.Display` để kiểm được bằng số. */
export interface ManHinh {
  id: number;
  bounds: Vung;
  workArea: Vung;
  scaleFactor?: number;
}

export { CO_TOI_THIEU, CO_TOI_DA, BUOC_CO, chuanPhanTram, phanTramTuThietDat } from '../shared/coRobot';
import { chuanPhanTram } from '../shared/coRobot';
/** Cỡ GỐC của hộp robot ở 100%. Khớp `robot.css` (`.rb-hop`). */
/* Cao 160 (không phải 190 như cửa sổ cũ): robot ~102px + mic 28px + chỗ cho
   biểu cảm trên đầu. 30px trống thừa của bản cũ là một khe hở giữa robot và
   bong bóng — trông như bong bóng không phải của nó. */
export const CO_GOC: Co = { width: 150, height: 160 };

/**
 * Cỡ hộp robot ở `pt` %. Làm tròn về số nguyên: cửa sổ nhận toạ độ DIP nguyên,
 * và một nửa điểm ảnh lệch là nét mờ ở màn hình 1x.
 */
export function coHop(pt: number, goc: Co = CO_GOC): Co {
  const h = chuanPhanTram(pt) / 100;
  return { width: Math.round(goc.width * h), height: Math.round(goc.height * h) };
}

/**
 * Vùng ROBOT ĐƯỢC ĐỨNG trên một màn hình.
 *
 * Toàn màn hình (`bounds`), không chỉ vùng làm việc: người dùng muốn đặt nó
 * "ở mọi nơi", kể cả đè lên thanh tác vụ — cửa sổ ở mức `screen-saver` nên nó
 * vẫn nổi trên đó. Riêng macOS chừa thanh menu ở trên: hệ điều hành tự đẩy cửa
 * sổ xuống dưới thanh menu, và hai bên đẩy qua đẩy lại chính là "tự chạy".
 */
export function vungDung(m: ManHinh, nenTang: string): Vung {
  if (nenTang !== 'darwin') return m.bounds;
  const tren = Math.max(m.bounds.y, m.workArea.y);
  return { x: m.bounds.x, y: tren, width: m.bounds.width, height: m.bounds.y + m.bounds.height - tren };
}

function chua(v: Vung, p: Diem): boolean {
  return p.x >= v.x && p.x < v.x + v.width && p.y >= v.y && p.y < v.y + v.height;
}

function khoangCach2(v: Vung, p: Diem): number {
  const dx = Math.max(v.x - p.x, 0, p.x - (v.x + v.width - 1));
  const dy = Math.max(v.y - p.y, 0, p.y - (v.y + v.height - 1));
  return dx * dx + dy * dy;
}

/** Màn hình chứa điểm, hoặc GẦN nhất nếu điểm nằm ở khe giữa hai màn. */
export function manHinhChoDiem(p: Diem, ds: readonly ManHinh[]): ManHinh | null {
  if (!ds.length) return null;
  const trong = ds.find((m) => chua(m.bounds, p));
  if (trong) return trong;
  return [...ds].sort((a, b) => khoangCach2(a.bounds, p) - khoangCach2(b.bounds, p))[0] ?? null;
}

/**
 * Vị trí neo khi đang kéo: con trỏ trừ độ lệch lúc nắm, kẹp vào màn hình đang
 * CHỨA CON TRỎ (không phải màn hình đang chứa cửa sổ — đó là lỗi 3 ở trên).
 */
export function neoKhiKeo(
  troChuot: Diem, lechNam: Diem, hop: Co, ds: readonly ManHinh[], nenTang: string,
): Diem {
  const muon = { x: Math.round(troChuot.x - lechNam.x), y: Math.round(troChuot.y - lechNam.y) };
  const m = manHinhChoDiem(troChuot, ds);
  if (!m) return muon;
  const r = kep({ ...muon, ...hop }, vungDung(m, nenTang));
  return { x: r.x, y: r.y };
}

/**
 * Đổi cỡ robot mà GIỮ chỗ người dùng đặt.
 *
 * Robot nằm ở một phần ba GIỮA màn hình (theo từng trục) ⇒ giữ TÂM; nằm ở phần
 * ba sát mép ⇒ giữ MÉP đó. Như vậy robot dính góc dưới-phải vẫn dính góc khi
 * thu nhỏ, còn robot đặt giữa màn hình co về đúng tâm của nó — không trôi.
 */
export function doiCoGiuNeo(neo: Diem, cu: Co, moi: Co, vung: Vung): Diem {
  const truc = (p: number, a: number, b: number, v0: number, vd: number): number => {
    const tam = p + a / 2;
    const tuongDoi = (tam - v0) / vd;
    if (tuongDoi < 1 / 3) return p;                 // sát mép đầu ⇒ giữ mép đầu
    if (tuongDoi > 2 / 3) return p + a - b;         // sát mép cuối ⇒ giữ mép cuối
    return Math.round(tam - b / 2);                 // giữa ⇒ giữ tâm
  };
  const r = kep({
    x: truc(neo.x, cu.width, moi.width, vung.x, vung.width),
    y: truc(neo.y, cu.height, moi.height, vung.y, vung.height),
    ...moi,
  }, vung);
  return { x: r.x, y: r.y };
}

/** Robot neo vào GÓC nào của cửa sổ, cách góc đó bao xa (px CSS). */
export interface HopTrongCuaSo {
  gocX: 'trai' | 'phai';
  gocY: 'tren' | 'duoi';
  dx: number;
  dy: number;
}

export interface BoCuc {
  cuaSo: Vung;
  hop: HopTrongCuaSo;
  /** Nội dung (bong bóng/bảng/khung chat) nằm TRÊN hay DƯỚI robot. */
  noiDung: 'tren' | 'duoi' | null;
  /** Cao THẬT dành cho nội dung (có thể bị co để vừa màn hình). */
  caoNoiDung: number;
  coHop: Co;
}

/** Khe giữa robot và nội dung. Khớp `robot.css`. */
export const KHE = 8;

/**
 * Dựng cửa sổ quanh robot ĐỨNG YÊN ở `neo`.
 *
 * Nội dung mở về phía CÒN CHỖ (trên nếu đủ, không thì phía rộng hơn), và nằm
 * lệch về phía robot đang ở (robot nửa phải ⇒ nội dung lan sang trái). Cửa sổ
 * chỉ bị kẹp NGANG, và khi bị kẹp thì `hop.dx` bù lại — robot vẫn ở đúng neo.
 *
 * `uuTien` giữ phía cũ khi còn vừa: kéo khung chat sang nửa kia màn hình rồi
 * thả, nó không được lật bố cục (lật là cả khung nhảy đi một đoạn).
 */
export function tinhBoCuc(
  neo: Diem,
  hop: Co,
  noiDung: Co | null,
  vung: Vung,
  uuTien?: { phai: boolean; tren: boolean },
): BoCuc {
  if (!noiDung) {
    return {
      cuaSo: { x: neo.x, y: neo.y, ...hop },
      hop: { gocX: uuTien?.phai === false ? 'trai' : 'phai', gocY: uuTien?.tren === false ? 'tren' : 'duoi', dx: 0, dy: 0 },
      noiDung: null,
      caoNoiDung: 0,
      coHop: hop,
    };
  }
  const W = Math.max(hop.width, Math.ceil(noiDung.width));
  const choTren = neo.y - vung.y - KHE;
  const choDuoi = vung.y + vung.height - (neo.y + hop.height) - KHE;
  const can = Math.ceil(noiDung.height);
  let tren: boolean;
  if (uuTien && (uuTien.tren ? choTren : choDuoi) >= can) tren = uuTien.tren;
  else tren = choTren >= can || choTren >= choDuoi;
  const cao = Math.max(0, Math.min(can, tren ? choTren : choDuoi));
  const H = hop.height + KHE + cao;

  const phaiTheoTam = neo.x + hop.width / 2 > vung.x + vung.width / 2;
  const phai = uuTien ? uuTien.phai : phaiTheoTam;
  let x = phai ? neo.x + hop.width - W : neo.x;
  x = Math.min(Math.max(x, vung.x), Math.max(vung.x, vung.x + vung.width - W));
  const y = tren ? neo.y - KHE - cao : neo.y;

  const ox = Math.min(Math.max(neo.x - x, 0), W - hop.width);
  const oy = neo.y - y;
  return {
    cuaSo: { x, y, width: W, height: H },
    hop: {
      gocX: phai ? 'phai' : 'trai',
      gocY: tren ? 'duoi' : 'tren',
      dx: phai ? W - ox - hop.width : ox,
      dy: tren ? H - oy - hop.height : oy,
    },
    noiDung: tren ? 'tren' : 'duoi',
    caoNoiDung: cao,
    coHop: hop,
  };
}

/**
 * Cùng một hộp robot, diễn tả theo góc `goc` của MỘT CỬA SỔ KHÁC.
 *
 * Dùng cho bước chuyển: renderer đặt robot theo góc của bố cục MỚI nhưng với
 * khoảng cách đúng cho cửa sổ HIỆN TẠI, rồi main mới đổi cỡ cửa sổ. Vì robot
 * neo vào góc không đổi, nó đứng yên qua cả hai khung hình — không giật.
 */
export function hopTheoCuaSo(neo: Diem, hop: Co, cuaSo: Vung, goc: Pick<HopTrongCuaSo, 'gocX' | 'gocY'>): HopTrongCuaSo {
  const ox = neo.x - cuaSo.x;
  const oy = neo.y - cuaSo.y;
  return {
    gocX: goc.gocX,
    gocY: goc.gocY,
    dx: goc.gocX === 'phai' ? cuaSo.width - ox - hop.width : ox,
    dy: goc.gocY === 'duoi' ? cuaSo.height - oy - hop.height : oy,
  };
}

/**
 * Vị trí ĐÃ LƯU: tuyệt đối + TƯƠNG ĐỐI theo màn hình.
 *
 * Tương đối (`tx`, `ty` ∈ [0,1]) là phần "khoảng trống còn lại" bên trái/trên
 * robot — 1 nghĩa là sát mép phải/dưới. Màn hình đổi độ phân giải thì robot ở
 * mép phải vẫn ở mép phải, thay vì nằm giữa hay ra ngoài.
 */
export interface ViTriLuu {
  /** `Display.id` lúc lưu. */
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  /** Cỡ vùng đứng lúc lưu — khác cỡ hiện tại ⇒ dùng toạ độ tương đối. */
  mw: number;
  mh: number;
}

export function taoViTriLuu(neo: Diem, hop: Co, m: ManHinh, nenTang: string): ViTriLuu {
  const v = vungDung(m, nenTang);
  const conX = Math.max(1, v.width - hop.width);
  const conY = Math.max(1, v.height - hop.height);
  const t = (n: number): number => Math.round(Math.max(0, Math.min(1, n)) * 10000) / 10000;
  return {
    id: m.id, x: neo.x, y: neo.y,
    tx: t((neo.x - v.x) / conX), ty: t((neo.y - v.y) / conY),
    mw: v.width, mh: v.height,
  };
}

/**
 * Khôi phục vị trí đã lưu trên bộ màn hình HIỆN TẠI.
 *
 *  • đúng màn hình đó, cùng cỡ        ⇒ đúng toạ độ cũ, không sai một điểm ảnh;
 *  • đúng màn hình đó, đổi độ phân giải ⇒ theo toạ độ tương đối;
 *  • màn hình đó KHÔNG còn             ⇒ tương đối trên màn hình gần điểm cũ
 *    nhất (thường là màn chính) — chỉ kéo về vùng nhìn thấy, không vứt về một
 *    góc cố định. Vị trí đã lưu KHÔNG bị ghi đè, nên cắm lại màn ngoài là
 *    robot về đúng chỗ cũ.
 */
export function khoiPhucViTri(luu: ViTriLuu, hop: Co, ds: readonly ManHinh[], nenTang: string): Diem | null {
  if (!ds.length) return null;
  const cung = ds.find((m) => m.id === luu.id);
  const m = cung ?? manHinhChoDiem({ x: luu.x, y: luu.y }, ds)!;
  const v = vungDung(m, nenTang);
  const cungCo = cung && v.width === luu.mw && v.height === luu.mh;
  const muon = cungCo
    ? { x: luu.x, y: luu.y }
    : {
      x: Math.round(v.x + luu.tx * Math.max(0, v.width - hop.width)),
      y: Math.round(v.y + luu.ty * Math.max(0, v.height - hop.height)),
    };
  const r = kep({ ...muon, ...hop }, v);
  return { x: r.x, y: r.y };
}

/** Đọc vị trí đã lưu — JSON mới (`robotViTri`), hoặc `robotX/robotY` cũ. */
export function docViTriLuu(s: { robotViTri?: unknown; robotX?: unknown; robotY?: unknown }): ViTriLuu | null {
  if (typeof s.robotViTri === 'string') {
    try {
      const o = JSON.parse(s.robotViTri) as Partial<ViTriLuu>;
      const so = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
      if (so(o.id) && so(o.x) && so(o.y) && so(o.tx) && so(o.ty) && so(o.mw) && so(o.mh)) {
        return o as ViTriLuu;
      }
    } catch { /* hỏng thì rơi xuống khoá cũ */ }
  }
  if (typeof s.robotX === 'number' && typeof s.robotY === 'number') {
    // Khoá cũ không biết màn hình nào ⇒ `id: -1`, xử lý riêng ở `viTriKhoiDong`.
    return { id: -1, x: s.robotX, y: s.robotY, tx: 1, ty: 1, mw: -1, mh: -1 };
  }
  return null;
}

/**
 * Khôi phục, có xử lý riêng khoá CŨ (`id: -1`): còn màn hình chứa điểm đó thì
 * dùng nguyên toạ độ (kẹp lại), không thì về góc dưới-phải của màn gần nhất.
 */
export function viTriKhoiDong(luu: ViTriLuu | null, hop: Co, ds: readonly ManHinh[], nenTang: string): Diem | null {
  if (!luu) return null;
  if (luu.id === -1) {
    const m = ds.find((d) => chua(d.bounds, { x: luu.x, y: luu.y }));
    if (!m) return null;
    const r = kep({ x: luu.x, y: luu.y, ...hop }, vungDung(m, nenTang));
    return { x: r.x, y: r.y };
  }
  return khoiPhucViTri(luu, hop, ds, nenTang);
}

/** Góc dưới-phải vùng làm việc của màn chính — chỗ mặc định. */
export function viTriMacDinh(hop: Co, m: ManHinh, le = 24): Diem {
  const w = m.workArea;
  return { x: Math.round(w.x + w.width - hop.width - le), y: Math.round(w.y + w.height - hop.height - le) };
}
