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
    /**
     * CỬA CHO XE VÀO SÂN — khoét giữa tường Bắc, thẳng hàng với đường z = 126.
     *
     * ⚠️ BẮT BUỘC PHẢI CÓ. Bản đầu quây tường kín cả tám cạnh và quên mất lối
     * vào: đo được 0/360 hướng thông từ ngoài vào, tức người chơi chỉ đứng
     * ngoài nhìn. Tệ hơn, mục "tường sân kín" trong `check-play-island.mjs`
     * lại KHẲNG ĐỊNH cái sai đó là đạt — nên bộ kiểm nay có thêm mục "phải có
     * lối vào cho xe".
     *
     * Rộng 5 so với xe rộng 1,9: đủ thoáng để lao vào mà không phải căn. Bóng
     * (đường kính 2,9) lọt ra được, nhưng `update()` tự đưa nó về giữa sân.
     */
    gate: { width: 5 },
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

/** Ba khu chừa sẵn. `concert` ĐÃ DỰNG (2/8); hai khu kia còn là đất trống. */
export const PLOTS = {
    concert: { x: 34, z: 150, width: 38, depth: 34 },   // sân khấu nhạc hội — ĐÃ DỰNG
    village: { x: -30, z: 184, width: 36, depth: 26 },  // làng ngôn ngữ JA/EN/ZH
    harbour: { x: 34, z: 186, width: 40, depth: 28 },   // bến cảng + hải đăng
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SÂN KHẤU NHẠC HỘI — bố cục
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Nằm gọn trong `PLOTS.concert` (tâm 34 · 150, rộng 38 × sâu 34). Mọi toạ độ ở
 * đây là TUYỆT ĐỐI, không phải tương đối so với tâm — gõ tương đối rồi cộng
 * trong lúc dựng là đúng chỗ để lệch một dấu.
 *
 * Bố cục nhìn từ trên: sân khấu ở mép BẮC (z nhỏ, phía đầu cầu đi vào), sàn
 * nhảy chiếm giữa, khán đài ôm hai bên, năm bục đĩa than xếp cung tròn phía
 * trước sân khấu.
 *
 * ⚠️ Lối vào phải chừa ở mép NAM (z lớn): đường trục của đảo chạy dọc x = 0 và
 * ba đường ngang, khu này tiếp giáp đường ngang z = 150 ở cạnh Tây. Bịt kín
 * bốn phía là lái xe vào không được — đúng lỗi đã mắc hai lần (đường xuyên tổ
 * quái, đường xuyên sân bóng).
 */
export const CONCERT = {
    /** Tâm khu, lấy thẳng từ `PLOTS.concert`. */
    x: 34,
    z: 150,

    /** Sân khấu: bục nâng cao ở mép Bắc. */
    stage: { x: 34, z: 138, width: 22, depth: 9, height: 1.5 },

    /** Sàn nhảy: lưới ô vuông nhấp theo nhạc. */
    floor: { x: 34, z: 152, cols: 9, rows: 7, tile: 2.4, gap: 0.25 },

    /**
     * Năm bục đĩa than — lái xe lên là đổi sang bài tương ứng.
     * Xếp thành cung tròn ôm lấy sàn nhảy, bán kính 13 quanh tâm sân khấu.
     */
    decks: { x: 34, z: 152, radius: 13, count: 5, size: 2.6, height: 0.55 },

    /** Hai cột loa hai bên sân khấu. */
    speakers: { offsetX: 13, z: 139, width: 2.4, depth: 2.2, height: 6.5 },

    /** Giàn đèn: dàn ngang trên sân khấu, đèn quét theo nhạc. */
    rig: { z: 141, height: 9.5, span: 20, lights: 6 },

    /**
     * Khán đài — hai dãy ở phía NAM đường ngang, quay mặt lên sân khấu.
     *
     * ⚠️ **z = 161, KHÔNG phải 152.** Đường ngang `z = 150` có `halfWidth 4.5`
     * nên nó chiếm dải **145,5…154,5** và chạy từ x = −4 tới x = 56, tức xuyên
     * qua toàn bộ khu này. Bản đầu đặt khán đài ở z = 152 dài 18 (trải
     * 143…161) và nó nằm CHÌNH ÌNH GIỮA LÒNG ĐƯỜNG — `check-play-island` bắt
     * được 6 khối chặn hành lang xe.
     *
     * Đây là **lần thứ BA** dẫm đúng cái bẫy này (trước đó: đường ngang xuyên
     * lòng sân bóng, đường trục xuyên tổ quái). Dựng bất cứ thứ gì trên đảo:
     * đối chiếu với `PLAY_ROADS` TRƯỚC, đừng đợi bộ kiểm.
     */
    stands: { offsetX: 15.5, z: 161, rows: 3, length: 11 },

    /** Điểm hồi sinh: mép Nam, mũi xe quay VÀO sân khấu (−Z). */
    respawn: { x: 34, z: 165, rotation: Math.PI * 0.5 },
}

/** Bảng màu riêng của khu nhạc hội — tông đêm hội, tách hẳn tông thể thao. */
export const CONCERT_COLORS = {
    stage: '#2b2440',
    stageTrim: '#6d3fff',
    floorA: '#3a2f55',      // ô sàn nền
    floorB: '#453766',      // ô sàn xen kẽ
    deck: '#1f1a2e',
    deckRim: '#ffb03a',
    speaker: '#1b1726',
    speakerCone: '#3d3357',
    truss: '#4a4458',
    stand: '#c9cfd8',
    standSeat: '#3d3357',
    /** Năm màu đèn, mỗi bục đĩa một màu — cũng là màu ô sàn khi bài đó đang chạy. */
    beams: [ '#ff4fd8', '#4fd8ff', '#b6ff4f', '#ffb03a', '#8b5cff' ],
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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  LÀNG NGÔN NGỮ — khu thứ HAI trong ba ô đất chừa sẵn (`PLOTS.village`)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ba góc ngôn ngữ quây quanh một quảng trường: **Nhật** (torii + vườn đá khô),
 * **Trung** (cổng tam quan + đèn lồng), **Anh** (tháp đồng hồ). Tông xe vào một
 * khối chữ là bật câu hỏi từ vựng — dùng CHUNG `VocabQuiz` với tường gạch.
 *
 * ⚠️⚠️ ĐƯỜNG NGANG z = 184 CHẠY XUYÊN QUA Ô ĐẤT NÀY.
 *
 * `PLAY_ROADS.cross` khai `{ z: 184, fromX: -34, toX: 44, halfWidth: 4.5 }`,
 * tức lòng đường chiếm z ∈ [179,5 · 188,5] với MỌI x ≥ −34. Mà ô đất làng trải
 * x ∈ [−48 · −12]. Nói cách khác: **hơn nửa phía Đông của ô đất là lòng đường**,
 * và đó chính là lối xe đi vào.
 *
 * Đây đúng là cái bẫy đã sập BA lần trên đảo này (đường ngang xuyên lòng sân
 * bóng · đường trục xuyên tổ quái · khán đài nhạc hội nằm giữa đường). Nên bố
 * cục dưới đây chia làm ba dải, và KHÔNG dải nào chạm lòng đường:
 *
 *     z 171 … 178,5   dải BẮC   — góc Nhật (Tây) + góc Trung (Đông)
 *     z 179,5 … 188,5 LÒNG ĐƯỜNG — chỉ quảng trường ở khúc x < −35 mới lấn vào
 *     z 189,5 … 197   dải NAM   — góc Anh (tháp đồng hồ)
 *
 * Quảng trường đặt ở khúc x ∈ [−47 · −35], tức phía TÂY chỗ đường kết thúc
 * (x = −34), nên nó nối liền với đường mà không nằm trong lòng đường.
 *
 * ⚠️ Mọi toạ độ ở đây là TUYỆT ĐỐI, không phải tương đối so với tâm ô đất —
 * gõ tương đối rồi cộng trong lúc dựng là đúng chỗ để lệch một dấu.
 */
export const VILLAGE = {
    /** Tâm ô đất, lấy thẳng từ `PLOTS.village`. */
    x: -30,
    z: 184,

    /** Mép lòng đường, chép từ `PLAY_ROADS.cross[2]`. Dựng gì cũng phải né. */
    road: { z: 184, halfWidth: 4.5, fromX: -34 },

    /** Quảng trường lát đá ở đầu Tây của đường — trái tim của làng. */
    /**
     * ⚠️ Bản đầu để `x: -41, width: 12` ⇒ mép Tây ở x = −47, mà đo thật bằng
     * `shapeDistance()` thì x = −47 ở z = 184 đã là ĐẤT MÉP (> 0,93). Góc
     * Tây-Nam của đảo bị siêu-ellipse bậc 4 cắt vát rất mạnh — xem bản đồ đo
     * được trong mục 0l của bàn giao. Dịch sang Đông và thu hẹp còn 10.
     */
    plaza: { x: -40, z: 184, width: 10, depth: 10 },

    /** Góc NHẬT: torii đứng trên lối vào vườn đá khô. */
    japan: {
        x: -41, z: 175,
        torii: { x: -41, z: 178, width: 5.4, height: 4.6 },
        garden: { x: -41, z: 174, width: 9, depth: 6 },
        /** Năm tảng đá vườn khô, đặt tay cho ra bố cục lệch kiểu karesansui. */
        stones: [
            [ -44.2, 173.2, 1.1 ], [ -42.4, 175.4, 0.7 ], [ -40.6, 172.6, 0.9 ],
            [ -38.8, 174.8, 1.3 ], [ -37.6, 172.9, 0.6 ],
        ],
    },

    /** Góc TRUNG: cổng tam quan ba lối + hai hàng đèn lồng. */
    china: {
        x: -22, z: 175,
        gate: { x: -22, z: 178, width: 8.4, height: 5.2 },
        /** Đèn lồng xếp hai bên lối từ cổng đi vào. */
        lanterns: [
            [ -25.6, 176 ], [ -18.4, 176 ],
            [ -25.6, 173 ], [ -18.4, 173 ],
        ],
        pavilion: { x: -22, z: 173, width: 6, depth: 5, height: 3.4 },
    },

    /** Góc ANH: tháp đồng hồ, cao nhất làng nên nhìn từ xa là thấy. */
    england: {
        /**
         * ⚠️ Bản đầu đặt ở (−30 · 193). Đo thật: ở z = 194 thì đất chắc chỉ
         * bắt đầu từ x = −22, còn z = 196 thì KHÔNG còn chỗ nào chắc. Tháp
         * đứng được nhưng chân nó nằm ngay trên vạch mép. Dời sang (−26 · 192),
         * nơi đất chắc ở cả bốn phía.
         */
        x: -26, z: 192,
        /**
         * ⚠️ Bản đầu để `side: 3.6, height: 12` — tỉ lệ 1:3,3. Ảnh chụp ra một
         * khối vuông bè bè, mặt đồng hồ chiếm gần trọn bề ngang, đọc thành
         * "cái máy bán nước" chứ không phải tháp. Tháp đồng hồ thật mảnh hơn
         * nhiều: Big Ben cao gấp ~9 lần bề ngang. Ở đây lấy 1:5,4 — đủ mảnh để
         * ra dáng tháp mà vẫn đứng vững trong khung hình.
         */
        tower: { x: -26, z: 192, side: 2.6, height: 14 },
        /** Bốt điện thoại đỏ + băng ghế, cho ra chất phố Anh. */
        booth: { x: -21, z: 191.5 },
        bench: { x: -31, z: 190.5 },
    },

    /**
     * KHỐI CHỮ — tông vào là hỏi từ vựng.
     *
     * ⚠️ Không khối nào được rơi vào lòng đường (z 179,5…188,5 với x ≥ −34).
     * Danh sách này đã soát tay, và `check-village.mjs` soát lại bằng máy.
     */
    letters: [
        // dải Bắc, quanh góc Nhật
        [ -46, 177 ], [ -36, 177 ], [ -44, 171.5 ],
        // dải Bắc, quanh góc Trung
        [ -27, 177 ], [ -17, 177 ], [ -20, 171.5 ],
        // quảng trường (x < −35 nên ngoài lòng đường)
        // ⚠️ [−46,5 · 187] đã bị chốt mép nước loại — góc Tây-Nam là chỗ đảo
        //    vát mạnh nhất. Dời vào [−42 · 187].
        [ -46.5, 181 ], [ -42, 187 ], [ -37, 181 ], [ -37, 187 ],
        // dải Nam, quanh tháp đồng hồ — cả dải này hẹp, xem bản đồ ở mục 0l
        [ -32, 190 ], [ -22, 190 ], [ -19, 193 ],
    ],

    /** Điểm hồi sinh: trên lòng đường phía Đông, mũi xe quay VÀO làng (−X). */
    respawn: { x: -26, z: 184, rotation: Math.PI },
}

/** Bảng màu riêng của làng — tông gỗ/giấy, tách hẳn tông đêm hội. */
export const VILLAGE_COLORS = {
    plaza: '#cdbfa4',
    plazaTrim: '#a5977c',
    gravel: '#e2ddd0',        // vườn đá khô
    stone: '#8f8a7e',
    toriiRed: '#c8402f',
    toriiDark: '#8e2a1e',
    gateRed: '#b8332b',
    gateGold: '#d9a53c',
    gateJade: '#2f7d5c',
    lantern: '#e8563f',
    roof: '#3c4a5c',
    towerStone: '#b9ac93',
    towerTrim: '#7d6f57',
    clockFace: '#f2ead6',
    boothRed: '#b5241f',
    wood: '#8a6b45',
    letter: '#f0e6cf',
    letterTrim: '#6d5f45',
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BẾN CẢNG + HẢI ĐĂNG — khu thứ BA, ô đất cuối cùng (`PLOTS.harbour`)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bến lát đá chạy dọc bờ Nam, một cầu tàu gỗ trên cọc vươn ra mặt nước, hải
 * đăng đứng ở đầu cầu và QUÉT ĐÈN thật khi trời tối. Container xếp chồng trên
 * bến để húc, cần cẩu và nhà kho cho ra dáng cảng.
 *
 * ⚠️ ĐƯỜNG NGANG z = 184 KẾT THÚC Ở x = 44, tức ngay giữa ô đất này.
 * `PLAY_ROADS.cross` khai `{ z: 184, fromX: -34, toX: 44, halfWidth: 4.5 }`,
 * nên lòng đường chiếm z ∈ [179,5 · 188,5] với mọi x ≤ 44. Ô đất trải
 * x ∈ [14 · 54]. Phần x > 44 ở dải giữa là đất tự do — đó là chỗ xe rời đường
 * để vào cảng.
 *
 * ⚠️ MẶT NƯỚC Ở y = −0,3 (`Water.surfaceElevation`), mặt đất ở 0,04. Chênh
 * nhau đúng 0,34 — tức bờ ở đây rất thấp. Sàn cầu tàu vì thế phải NÂNG lên
 * 0,7 và có cọc chống xuống, không thì nó nằm ngang mặt nước trông như một
 * tấm ván trôi.
 *
 * ⚠️ Đây là khu DUY NHẤT cố ý dựng vật RA NGOÀI hình đảo. Chốt mép nước dùng ở
 * làng (`shapeDistance > 0.93`) phải TẮT cho cầu tàu và hải đăng — nhưng chỉ
 * cho chúng, mọi thứ khác vẫn phải đứng trên đất chắc.
 */
export const HARBOUR = {
    /** Tâm ô đất, lấy thẳng từ `PLOTS.harbour`. */
    x: 34,
    z: 186,

    /** Mép lòng đường, chép từ `PLAY_ROADS.cross[2]`. Đường KẾT THÚC ở x = 44. */
    road: { z: 184, halfWidth: 4.5, toX: 44 },

    /**
     * BẾN — dải lát dọc bờ Nam.
     *
     * ⚠️ z = 192 chứ không phải 193, và depth 6 chứ không phải 8: đo thật thì
     * ở z = 196 đất chắc chỉ còn từ x = 24 trở lên, nên bến sâu hơn là góc
     * Tây-Nam thò ra mép nước. Xem bản đồ đo được ở mục 0l của bàn giao.
     */
    quay: { x: 34, z: 192, width: 28, depth: 6 },

    /** CẦU TÀU — sàn gỗ trên cọc, vươn từ mép bến ra biển. */
    jetty: {
        x: 34,
        fromZ: 195,
        toZ: 205,
        width: 5,
        /** Cao hơn mặt nước (−0,3) một khoảng đủ để nhìn ra là sàn nâng. */
        deckY: 0.7,
        /** Cọc chống, cách nhau 2,5 dọc thân cầu. */
        pileSpacing: 2.5,
    },

    /** HẢI ĐĂNG — đứng ở đầu cầu tàu, ngoài hình đảo. */
    lighthouse: { x: 34, z: 205.5, radius: 2.2, height: 13 },

    /** Container xếp chồng trên bến — thứ để húc. */
    containers: [
        [ 23, 191, 0 ], [ 23, 193.4, 0 ], [ 26.4, 191, 0 ],
        [ 41, 191, 1 ], [ 41, 193.4, 1 ], [ 44.4, 193.4, 1 ],
    ],

    /** Cần cẩu bến — đứng ở mép Đông của bến. */
    crane: { x: 47, z: 192, height: 9, jib: 10 },

    /** Nhà kho ở dải Bắc (z < 179,5 nên ngoài lòng đường). */
    warehouse: { x: 24, z: 175, width: 12, depth: 8, height: 4.5 },

    /** Hai chiếc thuyền neo hai bên cầu tàu. */
    boats: [
        [ 28.5, 200, 1 ], [ 39.5, 202, -1 ],
    ],

    /** Cọc buộc dây dọc mép bến. */
    bollards: [ 22, 27, 32, 37, 42, 47 ],

    /** Điểm hồi sinh: đất tự do phía Đông chỗ đường kết thúc, mũi xe quay ra bến. */
    respawn: { x: 49, z: 184, rotation: Math.PI * 0.5 },
}

/** Bảng màu riêng của cảng — tông biển/gỉ sắt, tách hẳn tông làng. */
export const HARBOUR_COLORS = {
    quay: '#9aa3a8',
    quayTrim: '#6f7a80',
    deck: '#8a6b45',
    pile: '#5d4830',
    towerWhite: '#eae4d8',
    towerRed: '#c8402f',
    lampGlow: '#ffe9a8',
    containerA: '#c4553a',
    containerB: '#2f6f8f',
    containerTrim: '#3a3a3a',
    crane: '#d9a53c',
    craneDark: '#7d6335',
    warehouse: '#7f8a90',
    warehouseRoof: '#4a545a',
    boat: '#e0e6e8',
    boatHull: '#2f4f6f',
    bollard: '#4a4a4a',
}
