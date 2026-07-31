/**
 * ĐẢO SÂN CHƠI — mảnh đất riêng ngoài khơi phía NAM đảo chính, nối bằng cầu.
 *
 * ─── VÌ SAO LẠI LÀ MỘT ĐẢO RIÊNG ───
 * Kế hoạch cũ ghi trong bàn giao là "quận Tây-Nam đảo chính, đất trống hoàn
 * toàn X −80…−25, Z +20…+80". ĐO NGÀY 1/8 THÌ SAI: chỗ đó có ĐƯỜNG ĐUA của
 * `CircuitArea` chạy xuyên qua (checkpoint 006 ở −60,8 · 16 và 007 ở −56 · 70,5,
 * cùng bốn tấm mặt đường lớn) và một CÁI HỒ chiếm x −69…−36, z 25…52 (lòng chảo
 * sâu −1,46, mà đáy nước là −1,5 nên vật rơi vào đó bị `Objects.update()` reset).
 *
 * Ba phép đo độc lập đều khớp: bắn tia xuống lưới 1 đơn vị, quét collider, và
 * ảnh bản đồ `ui/map/map-day.png`. Hình chữ nhật trống phẳng lớn nhất trong
 * quận đó chỉ **17 × 12**; quét cả đảo chính thì lớn nhất cũng chỉ **24 × 14**
 * (x −92…−70, z 28…40). Sân bóng lái xe cần tối thiểu ~40 × 28 mới đủ chỗ đánh
 * lái ⇒ đảo chính đã KÍN, không riêng gì quận Tây-Nam.
 *
 * Nên làm lại đúng cách đã chạy thật với khu FPTU: đảo riêng ngoài khơi. Đảo
 * cũ không mất một khối nào, đường đua nguyên vẹn.
 *
 * ─── VÌ SAO ĐẶT Ở ĐÂY ───
 * Đảo FPTU chiếm x −242…−82 (bờ thoải kéo tới x ≈ −71,6). Đảo này bắt đầu từ
 * x = −56 (bờ tới ≈ −64) nên TÁCH BIỆT THEO TRỤC X — hai đảo không thể chồng
 * nhau bất kể toạ độ z, khỏi phải căn theo z.
 *
 * Bờ Nam đảo chính đo được ở z ≈ 76…84. Tại x = 0 bờ ở z = 80 và quanh đó
 * THOÁNG (không vật cản trong bán kính 3) — đó là chỗ đặt đầu cầu.
 *
 * ─── ĐƠN VỊ ───
 * Giống `fptu.js`: xe dài ~2 đơn vị (~4 m thật) ⇒ 1 đơn vị ≈ 2 m.
 */

/** Tâm đảo và kích thước phần ĐẤT (chưa kể bờ thoải). */
export const PLAY_ISLAND = { x: 6, z: 150, width: 124, depth: 100 }

/**
 * Cầu nối bờ Nam đảo chính sang đảo sân chơi.
 * `fromZ` nằm TRÊN đất đảo chính và `toZ` nằm TRONG đảo mới — hai đầu đều cắm
 * vào đất chắc, đúng kiểu cầu FPTU (nó cũng cập vào trong đảo trường).
 */
export const PLAY_BRIDGE = { x: 0, fromZ: 76, toZ: 106, width: 9 }

/**
 * TRỤC ĐƯỜNG CHÍNH — từ đầu cầu chạy thẳng xuống Nam, và hai đường ngang rẽ
 * sang các khu. Để trống hoàn toàn: không đặt vật `physical` nào trong lòng.
 */
export const PLAY_ROADS = {
    spine: { x: 0, fromZ: 104, toZ: 190, halfWidth: 4.5 },
    cross: [
        // ⚠️ Đường ngang z = 150 CHỈ chạy về phía ĐÔNG trục. Bản đầu cho nó chạy
        // từ x = −50, tức xuyên thẳng qua lòng sân bóng — bắn tia đo được bậc
        // 3,43 ngay giữa đường, chính là tường sân. Lối vào sân bóng đi bằng
        // đường z = 126 chạy men phía Bắc khán đài.
        { z: 126, fromX: -50, toX: 4, halfWidth: 4.5 },   // vào sân bóng + sân tập
        { z: 150, fromX: -4, toX: 56, halfWidth: 4.5 },   // sang sân khấu nhạc hội
        { z: 184, fromX: -34, toX: 44, halfWidth: 4.5 },  // làng ngôn ngữ ↔ bến cảng
    ],
}

/**
 * SÂN BÓNG ĐÁ LÁI XE (kiểu Rocket League) — khu Tây của đảo.
 *
 * Sân trong 34 × 26 tính theo (X × Z): dài 17 lần thân xe, tỉ lệ 1,31 — sát tỉ
 * lệ 1,25 của sân Rocket League thật mà vẫn đủ rộng để quay đầu.
 *
 * ⚠️ CHIỀU DÀI SÂN BỊ CHẶN BỞI BỀ NGANG ĐẤT, không phải bởi ý thích. Chỗ dùng
 * được chỉ từ x = −52 (chừa bờ) đến x = −8 (chừa 3,5 cho lòng đường trục) tức
 * 44 đơn vị, mà tổng bề ngang sân là `innerWidth + 2 × (goal.depth + tường)` =
 * innerWidth + 12. Bản đầu để 42 ⇒ tổng 54 ⇒ khung thành phía Đông ĐÈ LÊN
 * ĐƯỜNG TRỤC (bắn tia đo được bậc 3,43 giữa lòng đường). Muốn sân dài hơn thì
 * phải nới đảo hoặc dời trục đường, KHÔNG phải chỉ sửa mỗi số này.
 */
export const ARENA = {
    x: -30,
    z: 150,
    innerWidth: 34,     // theo trục X (chiều dài sân, hướng tấn công)
    innerDepth: 26,     // theo trục Z (chiều ngang sân)
    wallHeight: 2.6,    // đủ cao để bóng nảy không bay ra ngay
    wallThickness: 0.9,
    // Vát bốn góc — bo góc kiểu sân Rocket League, để bóng lăn men theo tường
    // chứ không kẹt cứng ở góc vuông. 4,5 trên cạnh ngắn 30 là vừa: vát 6 thì
    // hai góc ăn mất 40% cạnh, tường Tây/Đông không còn đủ chỗ hai bên khung.
    cornerCut: 4.5,
    goal: {
        width: 11,      // bề rộng miệng khung (theo trục Z)
        height: 3.2,
        depth: 5,       // độ sâu lưới, thụt ra SAU tường
    },
    ball: {
        radius: 1.45,
        restitution: 0.82,
        mass: 1.1,
        linearDamping: 0.22,
        angularDamping: 0.4,
    },
}

/**
 * Sân tập kỹ năng: dốc nhảy, vòng lật, bập bênh — dàn theo TRỤC X trên cùng
 * một dải z, chiếm x −50…−8.
 *
 * Đặt phía BẮC sân bóng (giữa đầu cầu và sân) — phía Nam đã là ô đất của làng
 * ngôn ngữ (`PLOTS.village` trải z 171…197), đặt ở đó là hai khu đè nhau.
 *
 * ⚠️ z = 118 chứ không phải 112: ở z = 112 thì chân đỡ vòng lật (x = −50) rơi
 * ra NGOÀI mép đất — siêu-ellipse bậc 4 bo góc nên càng ra xa tâm theo z thì
 * bề ngang đất càng hẹp. Kiểm bằng `shapeDistance()` phải < 1.
 */
export const ARENA_STUNTS = { x: -29, z: 118 }

/** Ba khu còn lại — mới CHỪA ĐẤT, chưa dựng. Ghi sẵn để khu sau khỏi đè nhau. */
export const PLOTS = {
    concert: { x: 34, z: 150, width: 38, depth: 34 },   // sân khấu nhạc hội
    village: { x: -30, z: 184, width: 36, depth: 26 },  // làng ngôn ngữ JA/EN/ZH
    harbour: { x: 34, z: 186, width: 40, depth: 28 },   // bến cảng + hải đăng
}

/**
 * Điểm hồi sinh: đầu cầu phía đảo sân chơi, mũi xe quay VÀO đảo (+Z).
 * ⚠️ Ở yaw 0 mũi xe hướng +X (đo thực nghiệm 31/7, ghi trong `fptu.js`), nên
 * muốn quay về +Z thì rotation = −π/2.
 */
export const PLAY_RESPAWN = { x: 0, z: 110, rotation: -Math.PI * 0.5 }

/** Bảng màu riêng của đảo sân chơi — tông thể thao, tách hẳn tông FPT. */
export const PLAY_COLORS = {
    road: '#8b8f96',
    kerb: '#d8dce2',
    pitch: '#2f7d4f',       // mặt cỏ sân bóng
    pitchDark: '#2a6f47',   // sọc cỏ xen kẽ
    line: '#eef4f7',        // vạch kẻ
    wall: '#f0f2f5',
    wallTrim: '#1f2a37',
    goalBlue: '#2f8fd6',
    goalOrange: '#f0842c',
    stand: '#c9cfd8',       // khán đài
    standSeat: '#3d4757',
    grass: '#6f9e3f',
    sand: '#d8b47e',
    stunt: '#e0a33c',       // dốc nhảy, bập bênh
    stuntDark: '#a8742a',
}
