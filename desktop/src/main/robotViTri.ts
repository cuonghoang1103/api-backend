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
