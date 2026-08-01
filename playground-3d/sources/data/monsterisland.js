/**
 * ĐẢO QUÁI VẬT — mảnh đất thứ NĂM, và là nơi diễn ra chế độ Sinh tồn.
 *
 * User chốt 1/8: *"chúng ta sẽ xây 1 đảo quái vật, nơi đó sẽ là nơi sinh ra
 * quái vật và người ngoài hành tinh… xây 1 hòn đảo cách xa khu của tôi ra…
 * nối với mảnh đất của tôi bằng 1 cái cầu siêu dài như cái cầu ở thành phố
 * city nhưng cầu này sẽ cũ nát hơn, cái đảo quái vật sẽ là đảo to và cũ nát"*.
 *
 * ─── VÌ SAO ĐẶT Ở PHÍA BẮC (z âm sâu) ───
 * Bốn đảo hiện có chiếm hết những hướng còn lại:
 *
 *   | Đảo        | x            | z            |
 *   |------------|--------------|--------------|
 *   | Chính (mẫu)| −96 … 96     | −96 … 96     |
 *   | FPTU       | −242 … −82   | −44 … 104    |
 *   | Sân chơi   | −56 … 68     | 100 … 200    |
 *   | Thành phố  | 146 … 318    | −56 … 96     |
 *
 * Vùng **z < −96** hoàn toàn trống ở mọi giá trị x — đảo duy nhất chạm tới đó
 * là đảo chính, và nó dừng ở −96. Nên đặt đảo quái ở z −400…−200 là không thể
 * đụng ai, mà vẫn chừa được **104 đơn vị mặt nước** giữa hai bờ cho cây cầu.
 *
 * ⚠️ Kiểm chồng lấn là việc PHẢI làm mỗi lần thêm đảo, và `tools/check-monster-island.mjs`
 * có mục canh đúng chuyện đó. Đảo mới đè lên đảo cũ thì hai heightfield chồng
 * nhau, xe rơi vào khe giữa chúng và kẹt cứng — không lỗi nào báo.
 */

/**
 * Tâm đảo và kích thước phần ĐẤT (chưa kể bờ thoải).
 *
 * **240 × 200 = 48.000** đơn vị vuông, gần GẤP ĐÔI đảo thành phố (172 × 152 =
 * 26.144) — đúng yêu cầu "đảo to". Cũng là chỗ cần rộng thật: chế độ Sinh tồn
 * cần đất cho nhiều đợt quái vây quanh xe, mà đường chạy vòng vo thì mới né
 * được; đảo chật thì chỉ còn cách chạy thẳng tới khi hết đất.
 */
export const MONSTER_ISLAND = { x: 0, z: -300, width: 240, depth: 200 }

/**
 * CẦU MỤC NÁT nối bờ Bắc đảo chính sang đảo quái vật.
 *
 * **Dài 116 đơn vị (~232 m)** — gấp 1,76 lần cầu dây văng thành phố (66) và là
 * cầu dài nhất thế giới này. Đó là chủ ý: quãng đường dài giữa biển đen, không
 * chỗ nấp, là thứ tạo cảm giác "đi vào vùng đất chết" trước khi tới nơi.
 *
 * ─── CŨ NÁT NHƯNG PHẢI QUA ĐƯỢC ───
 * ⚠️ Mọi thứ "gãy, thủng, mất mảng" ở đây CHỈ ĐƯỢC LÀM Ở PHẦN HÌNH. Thân va
 * chạm của mặt cầu là MỘT khối liền từ đầu tới cuối, không đứt đoạn. Lý do:
 * bài học đắt nhất của khu FPTU là dốc ghép từ nhiều hộp bao giờ cũng hở, và
 * mỗi khe là một bậc bánh xe không leo nổi. Cầu thủng thật thì đẹp đúng một
 * lần rồi người chơi kẹt vĩnh viễn ở giữa biển.
 *
 * `tools/check-monster-island.mjs` quét hành lang xe suốt chiều dài cầu.
 */
export const MONSTER_BRIDGE = {
    x: 0,
    fromZ: -84,         // trên đất đảo chính (bờ Bắc ở z ≈ −89 tại x = 0)
    toZ: -200,          // cắm vào bờ Nam đảo quái
    width: 10,
    towerHeight: 19,    // thấp hơn tháp cầu thành phố (22) — cầu này đã sập một phần
    towers: [ -120, -164 ],
}

/**
 * Đường mòn trên đảo: một trục dọc từ đầu cầu vào giữa, hai nhánh ngang.
 *
 * Nứt nẻ và lệch lạc về HÌNH, nhưng lòng đường vẫn liền — cùng lý do với cầu.
 * Bộ kiểm quét hành lang xe trên cả ba tuyến.
 */
export const MONSTER_ROADS = {
    spine: { x: 0, fromZ: -204, toZ: -390, halfWidth: 5.5 },
    cross: [
        { z: -246, fromX: -104, toX: 104, halfWidth: 5 },
        { z: -350, fromX: -92, toX: 92, halfWidth: 5 },
    ],
}

/**
 * Ô ĐẤT ĐÃ CHỪA — `setScenery()` không được rải đá, cây chết hay xác nhà vào
 * giữa những chỗ này.
 *
 * Cùng cách làm với `PLOTS` của đảo sân chơi: quên khai một ô là cảnh quan mọc
 * đè lên công trình, mà lỗi kiểu đó chỉ lộ khi nhìn tận mắt.
 */
/**
 * ⚠️ MỌI Ô ĐẤT PHẢI NẰM GỌN TRONG MỘT Ô DO ĐƯỜNG CHIA RA.
 *
 * Ba đường trên chia đảo thành sáu vùng. Bản đầu đặt tổ quái ở chính giữa
 * (0 · −300) cho "dễ tìm" và khu nhà đổ ở (−74 · −262) — kết quả là **đường
 * trục xuyên thẳng qua tổ quái** và **đường ngang xuyên qua khu nhà đổ**. Bộ
 * kiểm hành lang xe bắt được: 4 chỗ bị chắn trên trục, 8 chỗ trên đường ngang.
 *
 * Đây đúng là lỗi đã mắc ở đảo sân chơi (đường ngang z = 150 chạy xuyên lòng
 * sân bóng) — lần thứ hai, nên ghi lại cho rõ: **vẽ đường xong thì phải xếp ô
 * đất vào giữa các ô lưới, đừng đặt theo cảm giác "chỗ này đẹp"**.
 *
 * Lưới sau khi chia (trục x = 0, ngang z = −246 và z = −350):
 *   Bắc-Tây  x −120…−6, z −200…−246      Bắc-Đông x 6…120, z −200…−246
 *   Giữa-Tây x −120…−6, z −246…−350      Giữa-Đông x 6…120, z −246…−350
 *   Nam-Tây  x −120…−6, z −350…−400      Nam-Đông x 6…120, z −350…−400
 */
export const MONSTER_PLOTS = {
    /**
     * Tổ quái — nơi sinh quái trong chế độ Sinh tồn. Ô Giữa-Tây, cách đường
     * trục 23 và hai đường ngang 26 mỗi bên. Không còn ở chính giữa đảo nữa
     * nhưng vẫn nằm ngay cạnh ngã tư trung tâm nên rẽ vào là thấy.
     */
    hive: { x: -52, z: -298, width: 58, depth: 52 },
    /** Khu nhà đổ nát — ô Giữa-Đông, dựng từ chính city kit đã có trong dự án. */
    ruins: { x: 62, z: -292, width: 76, depth: 70 },
    /** Bãi thiên thạch — ô Bắc-Đông, ngay bên phải lối vào đảo. */
    craters: { x: 66, z: -222, width: 76, depth: 36 },
    /** Bãi phế liệu — ô Nam-Đông. */
    scrapyard: { x: 58, z: -374, width: 70, depth: 42 },
    /** Đầu cầu — chừa thoáng để không có gì chắn lối lên bờ. */
    bridgehead: { x: 0, z: -208, width: 34, depth: 26 },
}

/**
 * Điểm hồi sinh: đầu cầu phía đảo quái, mũi xe quay VÀO đảo (−Z).
 * ⚠️ Ở yaw 0 mũi xe hướng +X (đo thực nghiệm 31/7), nên quay về −Z là −π/2.
 * ⚠️ PHẢI khai trong `Respawns.js`, và file đó chạy TRƯỚC `world.step(1)` —
 * thêm từ chỗ khác thì mục biến mất khỏi bản đồ mà không báo lỗi.
 */
export const MONSTER_RESPAWN = { x: 0, z: -212, rotation: -Math.PI * 0.5 }

/**
 * Bảng màu — tông xám tro và nâu cháy, cố ý tách hẳn khỏi bốn đảo kia.
 *
 * Ba đảo đầu tông cỏ xanh + cát vàng, thành phố tông xám đô thị. Đảo này phải
 * nhìn từ xa là biết "chỗ đó có gì đó không ổn", nên đất xám xỉn, cây đen,
 * nước quanh đảo ngả xanh độc.
 */
export const MONSTER_COLORS = {
    ground: '#5c5750',      // đất tro
    groundDark: '#463f39',  // vệt cháy
    rock: '#6a6259',
    sand: '#8d7f6a',        // bãi bờ xám
    shallow: '#3f6b5e',     // nước nông ngả xanh độc
    bed: '#2f5147',
    deep: '#20343a',
    road: '#4b463f',        // đường mòn
    crack: '#332e29',       // vệt nứt
    deck: '#5a5148',        // mặt cầu
    steel: '#4e4a45',       // tháp cầu gỉ
    cable: '#7a736a',       // dây văng
    rust: '#8a5a3a',        // vệt gỉ
    /**
     * Hệ số nhuộm cho model mượn từ khu phố. Nhân vào texture gốc, KHÔNG thay
     * hẳn texture — xem `MonsterIsland.charModel()`. Để sáng hơn 0,5 một chút
     * ở kênh đỏ cho ra ám nâu khói thay vì xám chì.
     */
    ash: '#6b5f52',
    deadWood: '#3a332c',    // cây chết
    bone: '#b9b0a0',        // xương, đá vôi
    hive: '#6d3f5c',        // tổ quái — tím thẫm
    hiveGlow: '#d861a8',    // mạch phát sáng trên tổ
}
