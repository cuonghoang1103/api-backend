/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CHẾ ĐỘ SINH TỒN — bảng số
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Mọi con số điều chỉnh được của chế độ nằm ở ĐÂY, không rải trong mã. Muốn
 * quái khoẻ hơn, sóng dày hơn, tiền nhiều hơn thì sửa file này là đủ.
 *
 * ─── ĐƠN VỊ ─────────────────────────────────────────────────────────────────
 * 1 đơn vị game ≈ 2 mét (xem `data/cityisland.js`, `MODEL_SCALE = 0.5`).
 * Chiếc xe mặc định dài chừng 2 đơn vị, cao 0,72. Tốc độ lái thường ngày rơi
 * vào 6–14 đơn vị/giây, phóng hết cỡ chừng 22.
 *
 * ─── VÌ SAO QUÁI DỰNG BẰNG MÃ, KHÔNG DÙNG MODEL ─────────────────────────────
 * Kho asset user tải về CÓ `fatalis.glb` (4.513 đỉnh + 14 clip hoạt ảnh) dùng
 * được ngay. Bản chơi được đầu tiên vẫn dựng bằng mã vì bốn lý do:
 *  - Nhân bản model có xương phải `SkeletonUtils.clone` + một `AnimationMixer`
 *    cho MỖI con; 25 con cùng lúc là 25 mixer chạy mỗi khung hình.
 *  - Cả thế giới này là phong cách đồ chơi mặt phẳng, một nguồn sáng. Thả một
 *    con rồng bake sẵn vào giữa mấy chiếc xe hoạt hình thì hỏng cả hai — đúng
 *    bài học đã rút ở `FptuPeople`.
 *  - Quái dựng bằng mã đổi màu / đổi cỡ / đổi số chi theo loại được, model thì
 *    có một dáng.
 *  - Không phải nén, không phải đặt thêm file vào `static/`, không phải ghi
 *    công, không tăng dung lượng tải.
 * `fatalis.glb` để dành cho **quái trùm** ở bản sau — chỉ một con, một mixer.
 */

/**
 * BA LOẠI QUÁI.
 *
 * `hp` tính theo phát tên lửa: rocket ăn 3 sát thương ở tâm, missile ăn 15.
 * `speed` so với xe: 3.4 là bò được theo xe đang đi chậm, 4.6 là đuổi kịp xe
 * đang lượn. KHÔNG con nào nhanh bằng xe chạy thẳng — chạy trốn phải luôn là
 * một lựa chọn thật.
 */
export const SURVIVAL_MONSTERS = {
    /** BỌ BÒ — nhỏ, nhanh, yếu, đông nhất. Bốn chân, thân dẹt, một mắt. */
    crawler: {
        name: 'Bọ bò',
        hp: 3,
        speed: 3.6,
        /** Sát thương mỗi giây khi bám được vào xe. */
        damage: 7,
        /** Bán kính thân — dùng cho va chạm và cho khoảng cách đứng cách nhau. */
        radius: 0.55,
        /** Cao độ mắt, để máu phun ra đúng chỗ chứ không phun dưới chân. */
        hitHeight: 0.45,
        scale: 0.62,
        money: 5,
        score: 10,
        colors: { body: '#4a6b3e', limb: '#38512f', belly: '#9ab86a', eye: '#eaff7a' },
    },

    /** KẺ RÌNH — cao lêu nghêu, hai chân dài, nhanh vừa, máu vừa. */
    stalker: {
        name: 'Kẻ rình',
        hp: 6,
        speed: 4.4,
        damage: 12,
        radius: 0.5,
        hitHeight: 1.15,
        scale: 1,
        money: 12,
        score: 25,
        colors: { body: '#5b3f6e', limb: '#432f53', belly: '#8f6fa6', eye: '#ff5ad4' },
    },

    /** QUÁI TO XÁC — chậm, dai, đau. Hiếm, và là thứ ép người chơi phải chạy. */
    brute: {
        name: 'Quái to xác',
        hp: 18,
        speed: 2.3,
        damage: 26,
        radius: 1.15,
        hitHeight: 1.5,
        scale: 1.5,
        money: 40,
        score: 80,
        colors: { body: '#7a3a2e', limb: '#5b2a21', belly: '#c07a4a', eye: '#ffb03a' },
    },
}

/**
 * SÓNG.
 *
 * Sóng n có `4 + n·2` con, càng về sau càng nhiều loại nặng. Bảng tỉ lệ đọc
 * theo mốc: sóng ≥ `from` thì dùng dòng đó (dòng cuối khớp trước thắng).
 */
export const SURVIVAL_WAVES = {
    /** Số quái của sóng n. */
    countFor: (wave) => Math.min(30, 4 + wave * 2),

    /** Tỉ lệ từng loại theo sóng. Cộng lại không cần bằng 1 — mã tự chuẩn hoá. */
    mix: [
        { from: 1, crawler: 1.0, stalker: 0.0, brute: 0.0 },
        { from: 2, crawler: 0.8, stalker: 0.2, brute: 0.0 },
        { from: 3, crawler: 0.6, stalker: 0.4, brute: 0.0 },
        { from: 4, crawler: 0.5, stalker: 0.4, brute: 0.1 },
        { from: 6, crawler: 0.4, stalker: 0.45, brute: 0.15 },
        { from: 9, crawler: 0.3, stalker: 0.48, brute: 0.22 },
    ],

    /** Nghỉ giữa hai sóng (giây) — đủ để nhặt tiền và thở. */
    breakDuration: 8,

    /** Sinh dần chứ không bung một lượt: mỗi lần sinh cách nhau chừng này giây. */
    spawnInterval: 0.9,

    /** Sống cùng lúc tối đa — chặn trên cho cả hiệu năng lẫn độ khó. */
    maxAlive: 26,
}

/** Số của người chơi. */
export const SURVIVAL_PLAYER = {
    maxHealth: 100,

    /** Bao lâu không ăn đòn thì bắt đầu tự hồi (giây). */
    regenDelay: 6,
    /** Hồi bao nhiêu máu mỗi giây. */
    regenRate: 5,

    /**
     * HÚC BẰNG XE.
     *
     * Dưới ngưỡng này thì chỉ đẩy quái ra, không gây sát thương — nếu không,
     * đứng yên rê xe cũng giết được cả sóng.
     */
    rammingSpeed: 7,
    /** Sát thương mỗi lần húc = (tốc độ − ngưỡng) × hệ số này. */
    rammingPower: 1.1,
    /** Cùng một con không ăn đòn húc lại trong chừng này giây. */
    rammingCooldown: 0.45,

    /** Bán kính hút tiền — lái qua gần là tự nhặt. */
    pickupRadius: 2.2,
}

/** Sinh quái ở đâu. */
export const SURVIVAL_SPAWN = {
    /** Vành sinh quanh xe: không sinh sát mặt, cũng không sinh ngoài tầm nhìn xa. */
    minDistance: 26,
    maxDistance: 46,

    /** Xa hơn thế thì con đó bị thu hồi và sinh lại gần xe (đỡ mất công đi bộ). */
    despawnDistance: 95,

    /** Số lần thử tìm chỗ đất khô cho một con trước khi bỏ qua lần sinh này. */
    attempts: 10,

    /**
     * Cao hơn mặt nước chừng này mới coi là đất khô.
     * Mặt biển ở `game.water.surfaceElevation`; sinh quái dưới nước thì chúng
     * lội giữa biển trông rất ngớ ngẩn.
     */
    dryMargin: 0.12,
}

/** Vật phẩm rơi ra. */
export const SURVIVAL_LOOT = {
    /** Đồng tiền sống bao lâu trước khi tự tan (giây). */
    life: 45,
    /** Quay và nhấp nhô cho dễ thấy trong đêm. */
    spinSpeed: 2.4,
    bobHeight: 0.18,
    bobSpeed: 3,
    color: '#ffd34a',
    /** Xác suất rơi thêm một hộp máu thay vì tiền. */
    healthChance: 0.14,
    healthColor: '#ff5a6a',
    /** Hộp máu hồi bao nhiêu. */
    healthAmount: 22,
}

/**
 * MÁU ĐEN — user chốt "bắn chết ra máu đen, kiểu Alien Shooter".
 * Dùng lại đúng bộ hạt của `VehicleRocket.spawnBlast()`, chỉ đổi màu và bỏ lửa.
 */
export const SURVIVAL_BLOOD = {
    color: '#140f14',
    mistColor: '#2a1d2a',
    /** Số giọt mỗi lần trúng đòn / lúc chết. */
    hitDrops: 5,
    deathDrops: 14,
    life: 1.1,
    /** Vũng máu để lại trên đất sau khi chết. */
    poolLife: 9,
}
