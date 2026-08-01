/**
 * ĐẢO THÀNH PHỐ — mảnh đất thứ TƯ, ngoài khơi phía ĐÔNG, xa nhất trong bốn đảo.
 *
 * ─── VÌ SAO ĐẶT Ở ĐÂY ───
 * Ba mảnh đất kia đã chiếm: đảo chính (x −96…96), đảo ĐH FPT (x −242…−82),
 * đảo sân chơi (x −56…68 · z 100…200). Đảo này bắt đầu từ x = 145 nên **tách
 * biệt hoàn toàn theo trục X** — không thể chồng mảnh nào, khỏi phải căn theo z.
 *
 * User muốn nó "cách xa chút" nên cầu dài 60 đơn vị (~120 m), gấp đôi cầu sang
 * đảo sân chơi. Đủ xa để ra biển thật sự, mà vẫn lái sang được trong ~15 giây.
 *
 * Bờ Đông đảo chính đo được ở x ≈ 67…87 tuỳ z. Tại **z = 20** bờ ở x = 87 và
 * quanh đó THOÁNG (không vật cản trong bán kính 3) — đó là chỗ đặt đầu cầu.
 *
 * ─── TỈ LỆ ───
 * Downtown City MegaKit dựng theo MÉT thật. Thế giới này 1 đơn vị ≈ 2 m (xe dài
 * 2 đơn vị ≈ 4 m), nên mọi mảnh phải nhân `MODEL_SCALE` = 0,5.
 *
 * Kích thước mảnh ĐO TỪ FILE (không phỏng đoán):
 *   Street_2Lane            6 × 12 m   → lòng đường 6 m + vỉa hè 3 m mỗi bên
 *   Street_4Lane            6 × 18 m   → lòng đường 12 m + vỉa hè 3 m mỗi bên
 *   Street_4WayIntersection 24,67 m vuông
 *   Street_TIntersection    24,67 × 21,33 m
 *   Sidewalk_Straight_3m    3 m vuông
 *   Building_Large_2        20,64 × 28 × 16,64 m  (cao 28 m ≈ 9 tầng)
 *   Building_Medium_2.001   15,06 × 25,01 × 13,06 m
 *   Building_Small_1        12,46 × 17,03 × 14,54 m
 */

/** Mọi mảnh của kit nhân hệ số này để về hệ toạ độ của game. */
export const MODEL_SCALE = 0.5

/** Tâm đảo và kích thước phần ĐẤT (chưa kể bờ thoải). Đảo rộng nhất trong bốn. */
export const CITY_ISLAND = { x: 232, z: 20, width: 172, depth: 152 }

/**
 * CẦU DÂY VĂNG nối bờ Đông đảo chính sang đảo thành phố.
 *
 * Dài 62 đơn vị (~124 m) — cầu dài nhất thế giới này. Hai tháp chữ A cao 22
 * đơn vị với dây văng toả ra hai bên, đúng kiểu cầu dây văng thật.
 *
 * ⚠️ Mặt cầu phải PHẲNG và LIỀN, không cong lên: dốc ghép từ nhiều đoạn là
 * nguồn gốc mọi chỗ kẹt xe ở khu FPTU. Nếu sau này muốn cầu vồng lên thì phải
 * sinh bằng MỘT hàm cao độ, không ghép hộp nghiêng.
 */
export const CITY_BRIDGE = {
    z: 20,
    fromX: 84,          // trên đất đảo chính
    toX: 150,           // cắm vào trong đảo thành phố
    width: 11,          // rộng hơn cầu kia (9) vì đây là cầu chính
    towerHeight: 22,
    towers: [ 104, 130 ],   // vị trí hai tháp theo trục X
}

/**
 * LƯỚI PHỐ — ô vuông kiểu Manhattan, chừa MỘT ô giữa làm quảng trường.
 *
 * `blockSize` là cạnh một ô nhà, `roadWidth` là bề rộng lòng đường + vỉa hè
 * (đã quy về đơn vị game: mảnh 4 làn ngang 18 m → 9 đơn vị).
 *
 * 4 đường dọc × 4 đường ngang ⇒ 3 × 3 = 9 ô, ô giữa (1,1) là quảng trường.
 * Tổng bề ngang lưới = 3 × blockSize + 4 × roadWidth = 3×30 + 4×9 = 126, vừa
 * trong phần đất dùng được (đảo 172 × 152, chừa lề bờ mỗi bên ~20).
 */
export const CITY_GRID = {
    x: 232,
    z: 20,
    cols: 3,
    rows: 3,
    blockSize: 30,
    roadWidth: 9,
    squareCell: { col: 1, row: 1 },   // ô làm quảng trường
    /**
     * Bốn ô chéo dành cho THÁP CAO TẦNG ghép từ mảnh modular.
     *
     * ⚠️ `setBlocks()` phải BỎ QUA những ô này. Bản đầu đặt tháp ở góc chéo
     * quảng trường mà vẫn để `setBlocks()` rải nhà ở đó ⇒ 3 trong 4 tháp mọc
     * xuyên qua nhà. Bộ kiểm hành lang xe không bắt được vì cả hai đều nằm
     * trong lòng ô, cách xa đường.
     */
    towerCells: [ { col: 0, row: 0 }, { col: 2, row: 0 }, { col: 0, row: 2 }, { col: 2, row: 2 } ],
}

/**
 * Điểm hồi sinh: đầu cầu phía thành phố, mũi xe quay VÀO đảo (−X).
 * ⚠️ Ở yaw 0 mũi xe hướng +X (đo thực nghiệm 31/7), nên quay về −X là π.
 */
export const CITY_RESPAWN = { x: 154, z: 20, rotation: Math.PI }

/** Bảng màu nền đảo — tông xám đô thị, tách khỏi tông cỏ của ba đảo kia. */
export const CITY_COLORS = {
    asphalt: '#4a4e55',
    concrete: '#9aa0a8',
    kerb: '#c8ccd2',
    line: '#e8ecf0',
    steel: '#5d6570',      // tháp cầu
    cable: '#c9ced6',      // dây văng
    deck: '#6e747c',       // mặt cầu
    plaza: '#b9a68c',      // lát quảng trường
    grass: '#6f9e3f',
    sand: '#d8b47e',
}
