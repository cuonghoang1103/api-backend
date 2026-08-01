/**
 * TÀU SÂN BAY — neo giữa biển, cạnh cây cầu dài đi ra đảo quái vật.
 *
 * User chốt 1/8: *"Bạn có thể làm tàu sân bay ở ngoài biển càng tốt"*, và sau
 * khi đo thì chốt tiếp *"làm tàu sân bay bằng mã"*.
 *
 * ─── VÌ SAO DỰNG BẰNG MÃ CHỨ KHÔNG DÙNG MODEL ───
 * User đã tải về `Phương tiện/super_portaviones.glb` (155 MB). Đo thật:
 * **2.126.216 đỉnh** — gấp 2,6 lần TOÀN BỘ thế giới game (~804.000). Nén hết
 * cỡ (`--compress draco --texture-size 512 --simplify --ratio 0.04 --error
 * 0.08`) cũng chỉ xuống **954.719**, vẫn hơn cả thế giới. Cùng bệnh xe Tiger:
 * model bake từ high-poly, UV cắt vụn nên gần như mọi đỉnh là biên, `simplify`
 * không có gì để gộp.
 *
 * Dựng bằng mã tốn chừng vài nghìn đỉnh, hợp tông low-poly của cả thế giới, và
 * không thêm một byte tải về.
 *
 * ─── VÌ SAO NEO Ở ĐÂY ───
 * Vùng biển giữa đảo chính (bờ Bắc ≈ z −89) và đảo quái (bờ Nam z −200) là
 * khoảng nước trống duy nhất mà người chơi CHẮC CHẮN đi qua — cầu dài 116 chạy
 * ngay giữa nó. Neo tàu sát cạnh cầu thì nó vừa là mốc nhìn suốt quãng đường
 * dài, vừa thành một chặng dừng chân rẽ vào được.
 *
 * ⚠️ Xe lái được trên mặt biển: `Floor.setBedRock()` giữ một tấm 12 × 12 bám
 * theo xe ở độ sâu −1,5 khi xe ra ngoài địa hình gốc. Nên kể cả không dùng cầu
 * dẫn thì vẫn bơi tới chân tàu được — chỉ là không leo lên boong nổi.
 */

/**
 * Thân tàu. Dài theo trục Z (song song cây cầu), rộng theo X.
 *
 * 92 × 24 đơn vị ≈ 184 × 48 m — nhỏ hơn tàu sân bay thật (330 × 78 m) nhưng
 * phải thế: cả đảo chính mới rộng 192, một chiếc tàu đúng tỉ lệ sẽ nuốt mất
 * khung hình. Đây là cỡ vừa đủ để đứng trên boong vẫn thấy hai đầu.
 */
export const CARRIER = {
    x: 46,
    z: -140,
    length: 92,        // theo Z
    width: 24,         // theo X
    deckY: 3.6,        // cao độ mặt boong
    hullDepth: 5.2,    // thân chìm xuống dưới boong
}

/**
 * CẦU DẪN từ cây cầu chính lên boong.
 *
 * ⚠️ MỘT KHỐI NGHIÊNG DUY NHẤT, không ghép nhiều đoạn. Bài học đắt nhất của
 * khu FPTU: dốc ghép từ nhiều hộp bao giờ cũng hở, và mỗi khe là một bậc bánh
 * xe không leo nổi.
 *
 * Cầu chính ở y = −0,16; boong ở 3,6 ⇒ chênh 3,76 trên quãng 29 ⇒ dốc **7,4°**.
 * Xe leo thoải mái (dốc nhảy ở sân tập đảo sân chơi còn đứng hơn nhiều).
 */
export const CARRIER_RAMP = {
    z: -140,
    fromX: 5,          // mép cây cầu chính (rộng 10, tâm x = 0)
    /**
     * ⚠️ 28,4 chính là mép ngoài của mảng boong nhô ra mạn trái (angled deck):
     * `x − width/2 − 2,6 − 3` = 46 − 12 − 2,6 − 3. Để 34 như bản đầu thì cầu
     * dẫn mới cao 3,02 lúc chạm mép boong (ở 3,6) ⇒ **bậc 0,58**, bánh xe khựng.
     * Bộ kiểm bắt được ngay lần chạy đầu.
     */
    toX: 28.4,
    width: 9,
}

/**
 * CĂN MODEL TÀU vào chỗ phần va chạm đang chiếm.
 *
 * Model đã lọc dài **334** đơn vị theo Z, rộng 83, cao 74 (`bbox-carrier.mjs`).
 * Tàu trong game dài 92 ⇒ tỉ lệ **0,275**; ở tỉ lệ đó bề ngang ra 22,8, khớp
 * gần đúng bề ngang 24 của khối va chạm, nên boong hình và boong cứng chồng
 * khít nhau.
 *
 * ⚠️ `offsetY` là số chỉnh BẰNG MẮT: gốc toạ độ của model không nằm ở mặt
 * boong, và không có cách nào biết trước nó ở đâu ngoài việc đặt thử rồi bắn
 * tia so sánh. Cứ vặn cho tới khi mặt boong model trùng `deckY`.
 */
export const CARRIER_MODEL = {
    scale: 0.275,
    rotationY: 0,
    offsetX: 0,
    /**
     * ⚠️ −6,2 là số ĐO ĐƯỢC, không phải ước lượng.
     *
     * Bắn tia xuống chỉ vào model: mặt boong của nó nằm ở y = **8,90**, trong
     * khi boong va chạm ở 3,6 ⇒ để nguyên là xe chạy LƠ LỬNG dưới boong nhìn
     * thấy 5,3 đơn vị. Hạ model 5,3 nữa (−0,9 − 5,3) thì hai mặt trùng khít;
     * đáy tàu xuống −5,1, tức chìm dưới mực nước (−0,3) — đúng như tàu thật.
     *
     * Đo lại bằng `scratchpad/diag-deck-height.mjs` nếu đổi model hoặc tỉ lệ.
     */
    offsetY: -6.2,
    offsetZ: 0,
}

/**
 * CẦU DẪN THỨ HAI — từ bờ Bắc đảo chính lên MŨI tàu.
 *
 * User lái ra bờ, thấy con tàu ngay trước mặt mà không lên được, và bảo:
 * *"ở chỗ này phải có nút lên tàu chứ"*. Đúng — cầu dẫn duy nhất lúc đó nằm ở
 * z = −140, tức mãi giữa thân tàu, phải đi vòng qua cây cầu dài mới tới.
 *
 * Mũi tàu ở z ≈ −95; bờ đảo chính tại x = 46 ở z ≈ −84,3 (đảo tròn bán kính
 * 96). Cầu dẫn từ z = −80 (chắc chắn trên đất) tới z = −97 (cắm vào boong):
 * dài 17, chênh 3,56 ⇒ dốc **11,8°**. Xe leo thoải mái.
 */
export const CARRIER_BOW_RAMP = {
    x: 46,
    fromZ: -80,        // trên đất đảo chính
    /**
     * ⚠️ −94 chính là MÉP BOONG (`z + length/2` = −140 + 46). Bản đầu để −97
     * cho "cắm sâu vào tàu", nhưng thế thì cầu dẫn mới đạt 2,97 lúc chạm mép
     * boong ở 3,6 ⇒ **bậc 0,63**. Đo bằng cách bắn tia dọc tuyến (mỗi 2 đơn
     * vị) là thấy ngay chỗ nhảy bậc.
     */
    toZ: -94,
    width: 9,
}

/**
 * Đảo chỉ huy — khối tháp bên mạn PHẢI (x lớn), đúng như tàu sân bay thật.
 * Đặt lệch về đuôi để chừa đường băng thông suốt phía mũi.
 */
export const CARRIER_ISLAND = {
    offsetX: 8.2,      // lệch khỏi tim tàu, về mạn phải
    offsetZ: -14,      // lệch về phía đuôi (z âm hơn tâm)
    width: 6.5,
    length: 13,
    height: 12,
}

/** Vị trí máy bay đậu trên boong: [lệch X, lệch Z, góc quay, có gập cánh không]. */
export const CARRIER_PLANES = [
    // ⚠️ Hai chiếc XOÈ CÁNH phải lùi sát mạn: nửa sải cánh 3,4 cộng góc xoay
    // làm chúng thò tới x = 43,4, chạm rìa hành lang xe trên đường băng (bộ
    // kiểm bắt 6 chỗ). Chiếc gập cánh thì hẹp hơn nhiều nên để gần được.
    [ -8.4, 30, 0.12, false ],
    [ -8.4, 18, 0.05, false ],
    [ 6.0, 8, -0.9, true ],
    [ 6.2, -2, -1.05, true ],
    [ 6.4, -12, -0.95, true ],
    [ -7.0, -26, 2.9, true ],
    // ⚠️ Ra RÌA, đừng để gần tim tàu: bản đầu đặt ở dx = 0,5 và nó chắn ngang
    // đường băng — bộ kiểm quét hành lang xe bắt được 10 chỗ bị cản.
    [ -7.4, -36, 3.05, true ],
]

/** Điểm hồi sinh: giữa boong, mũi xe hướng ra mũi tàu (+Z). */
export const CARRIER_RESPAWN = { x: 46, z: -156, rotation: -Math.PI * 0.5 }

/** Bảng màu — xám hải quân, tách khỏi tông tro của đảo quái. */
export const CARRIER_COLORS = {
    hull: '#3f4854',        // thân tàu
    hullDark: '#2c333c',    // mớn nước
    deck: '#4a5058',        // mặt boong
    deckLine: '#e6e9ee',    // vạch kẻ đường băng
    deckWarn: '#d9b23c',    // vạch cảnh báo vàng
    tower: '#586373',       // đảo chỉ huy
    towerDark: '#39424f',
    glass: '#7fa8c4',       // kính buồng chỉ huy
    steel: '#8d97a5',
    plane: '#5a6675',       // máy bay
    planeDark: '#39424f',
    canopy: '#9fd4e8',
    rust: '#7a5a3e',
    light: '#ff7a3c',       // đèn boong
}
