/**
 * Phần TÍNH của núm xoay, tách khỏi phần vẽ.
 *
 * Để riêng vì đây là chỗ dễ sai mà nhìn không ra: kéo chuột 40 điểm ảnh phải
 * ra đúng bao nhiêu dB, bước nhảy làm tròn thế nào, kẹp ở đâu. Sai một chỗ thì
 * núm "hơi khó chỉnh" — một triệu chứng không ai báo lỗi bao giờ, người ta chỉ
 * thôi không dùng nữa. Ở dạng hàm thuần thì kiểm được từng con số.
 */

/** Kéo hết chiều này là quét trọn dải. 180px là quãng cổ tay quen của DAW. */
export const CAO_QUET = 180;

/** Giữ Shift thì mỗi điểm ảnh nhỏ đi 5 lần — chỉnh nốt cuối cùng. */
export const HE_MIN = 5;

/** Góc quét của vòng cung, độ. 270° là chuẩn của mọi núm phần cứng: chừa 90° ở
 *  đáy để mắt biết đâu là điểm đầu và điểm cuối. */
export const GOC_QUET = 270;

export interface DaiNum {
  min: number;
  max: number;
  buoc: number;
}

/** Làm tròn về bội của `buoc` rồi kẹp vào dải. */
export function chuan(gia: number, d: DaiNum): number {
  const lam = Math.round(gia / d.buoc) * d.buoc;
  const kep = Math.min(d.max, Math.max(d.min, lam));
  /* Làm tròn lại 6 chữ số: `0.1 * 3` ra `0.30000000000000004`, và con số đó
     hiện nguyên xi lên giao diện nếu không cắt. */
  return Math.round(kep * 1e6) / 1e6;
}

/**
 * Giá trị mới sau khi kéo `dy` điểm ảnh (dương = xuống).
 *
 * Kéo LÊN làm tăng — ngược chiều `dy` của trình duyệt, và đúng chiều mà mọi
 * núm vật lý quay.
 */
export function keo(batDau: number, dy: number, d: DaiNum, min: boolean): number {
  const dai = d.max - d.min;
  const buoc = (-dy / CAO_QUET) * dai / (min ? HE_MIN : 1);
  return chuan(batDau + buoc, d);
}

/** 0…1 — vị trí của `gia` trong dải. Dùng để vẽ cung và để đặt aria. */
export function ti(gia: number, d: DaiNum): number {
  const dai = d.max - d.min;
  if (dai <= 0) return 0;
  return Math.min(1, Math.max(0, (gia - d.min) / dai));
}

/**
 * Điểm trên vòng cung ứng với tỉ lệ `t`, trong hệ toạ độ SVG 100×100.
 *
 * ⚠️ Gốc là **+135°**, không phải −135°. Trong SVG trục y hướng XUỐNG, nên góc
 * tăng là quay THEO chiều kim đồng hồ trên màn hình, và hướng dưới-trái ứng
 * với +135° chứ không phải −135°. Bản đầu viết −135 và núm mọc ngược lên trên:
 * điểm nhỏ nhất nằm ở trên-trái, điểm giữa dải nằm ở đáy.
 *
 *   t=0    135° → dưới-trái      t=0,5  270° → đỉnh      t=1  405°=45° → dưới-phải
 */
export function diem(t: number, bk: number): { x: number; y: number } {
  const goc = ((135 + t * GOC_QUET) * Math.PI) / 180;
  return { x: 50 + bk * Math.cos(goc), y: 50 + bk * Math.sin(goc) };
}

/**
 * Đường `d` của cung SVG từ tỉ lệ 0 tới `t`.
 *
 * `largeArcFlag` bật khi cung vượt 180°, tức `t > 0.5` với dải 270°. Quên cờ
 * này thì cung nào quá nửa vòng cũng bị vẽ thành phần BÙ của nó — núm chỉ 80%
 * mà trông như 20%.
 */
export function cung(tuTi: number, denTi: number, bk: number): string {
  const a = diem(tuTi, bk);
  const b = diem(denTi, bk);
  const lon = (denTi - tuTi) * GOC_QUET > 180 ? 1 : 0;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${bk} ${bk} 0 ${lon} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}
