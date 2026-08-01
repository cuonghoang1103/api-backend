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

    /**
     * QUÁI TRÙM — cứ 5 sóng một con, sinh THÊM ngoài quân số của sóng.
     *
     * Dùng lại đúng dáng "quái to xác" phóng to (xem `makeBrute`), khác ở số:
     * dai gấp bảy, đau gấp đôi, và **không nấp khỏi nó được** (xem
     * `SURVIVAL_STEALTH.bossAlwaysSees`). Nó là cái đồng hồ báo thức của chế độ:
     * cứ tưởng đã quen tay thì nó tới.
     */
    boss: {
        name: 'Quái trùm',
        hp: 130,
        speed: 2.6,
        damage: 40,

        /**
         * ⚠️ BA SỐ NÀY LÀ TỈ LỆ, KHÔNG PHẢI ĐƠN VỊ THẬT — mọi chỗ dùng chúng
         * đều nhân với `scale`. Gõ thẳng số thật vào là con trùm phồng lên gấp
         * `scale` lần: đặt `radius: 2` ra bán kính 5,4 và `hitHeight: 2,6` ra
         * 7,0 trên một con chỉ cao 3,4.
         */
        radius: 0.5,       // → 1,35 đơn vị
        hitHeight: 1.45,   // → 3,9 — ngang ngực, chỗ máu phun ra
        scale: 2.7,

        /**
         * Chiều cao THẬT sau khi nhân `scale`, dùng để co model.
         *
         * ⚠️ 6,2 chứ không phải 3,4 — và con số đó đến từ phép đo, không phải
         * cảm tính. Model này có tỉ lệ rộng/cao **0,35** ngay ở bản gốc (rộng
         * 1,20 · cao 3,47): nó vốn là một sinh vật gầy và dài. Co về ngang tầm
         * hai con quái to xác thì nhìn từ máy quay trên cao nó ra đúng "một cái
         * que đen" — chụp ảnh mới thấy, số đo thì vẫn báo đúng 3,45.
         *
         * Cao gấp đôi thì chính cái gầy ấy lại thành ưu điểm: nó vượt hẳn lên
         * trên tầm mắt, đổ bóng dài, và đọc ra ngay là "thứ không nên lại gần".
         */
        modelHeight: 6.2,

        money: 260,
        score: 600,
        isBoss: true,
        colors: { body: '#3d1f4a', limb: '#2a1435', belly: '#7a3a8f', eye: '#54ffc8' },
    },
}

/**
 * NẤP — user chốt: *"nấp = lái xe núp sau nhà, tắt đèn"*.
 *
 * Quái không phải lúc nào cũng biết bạn ở đâu. Tầm phát hiện = tầm gốc, NHÂN
 * lên khi đèn pha đang bật, CỘNG thêm theo tốc độ xe (tiếng động cơ). Ngoài tầm
 * đó chúng chỉ biết chỗ **cuối cùng** từng thấy: kéo tới đó, lục lọi quanh quẩn,
 * rồi tản ra. Tắt đèn (Cài đặt → Headlights → Off) và dừng lại sau một toà nhà
 * là thật sự thoát được — đó là toàn bộ ý nghĩa của chữ "sinh tồn" ở đây.
 */
export const SURVIVAL_STEALTH = {
    /** Tầm thấy khi đèn tắt và xe đứng im. */
    baseRange: 17,
    /** Đèn pha đang bật thì nhân tầm lên chừng này. */
    headlightsFactor: 1.9,
    /** Mỗi đơn vị tốc độ cộng thêm bấy nhiêu tầm — động cơ gầm là tự khai báo. */
    speedRange: 1.15,
    /** Sát đến mức này thì nấp kiểu gì cũng vô ích. */
    alwaysSeeRange: 7,

    /** Mất dấu rồi còn nhớ chỗ cũ bao lâu (giây) trước khi bỏ cuộc và tản ra. */
    memory: 9,
    /** Lảng vảng chậm hơn lúc đuổi. */
    wanderSpeedFactor: 0.55,
    /** Bán kính lục lọi quanh chỗ thấy lần cuối. */
    wanderRadius: 9,

    /** Quái trùm KHÔNG bị đánh lừa — nấp khỏi nó là không được. */
    bossAlwaysSees: true,
}

/**
 * CỬA HÀNG — tiêu tiền giữa hai sóng.
 *
 * Không có nó thì tiền chỉ là một con số đẹp trên HUD. Có nó thì vòng lặp mới
 * khép: giết → tiền → mạnh hơn → dám ra xa hơn → giết được nhiều hơn.
 *
 * Chỉ mở trong nhịp NGHỈ, cố ý: dừng giữa lúc bị vây để mở bảng nâng cấp thì
 * còn gì là sinh tồn. `price` là giá lần đầu, mỗi lần mua nhân với `step`.
 */
export const SURVIVAL_SHOP = [
    {
        key: 'armor',
        name: 'Giáp',
        description: '+25 máu tối đa, và vá đầy luôn',
        price: 60,
        step: 1.6,
        max: 6,
    },
    {
        key: 'regen',
        name: 'Hồi máu',
        description: '+3 máu mỗi giây khi không bị đánh',
        price: 55,
        step: 1.7,
        max: 5,
    },
    {
        key: 'ram',
        name: 'Cản húc',
        description: '+45% sát thương khi húc',
        price: 70,
        step: 1.6,
        max: 5,
    },
    {
        key: 'barrel',
        name: 'Nòng súng',
        description: '+60% sát thương súng máy (phím F)',
        price: 75,
        step: 1.65,
        max: 5,
    },
    {
        key: 'cooler',
        name: 'Tản nhiệt',
        description: 'Nòng lâu nóng hơn, bắn được dài hơi',
        price: 60,
        step: 1.6,
        max: 4,
    },
    {
        key: 'blast',
        name: 'Đầu đạn',
        description: '+50% sát thương nổ của pháo trên nóc',
        price: 95,
        step: 1.7,
        max: 5,
    },
    {
        key: 'patch',
        name: 'Vá máu',
        description: 'Đầy máu ngay lập tức',
        price: 35,
        step: 1.25,
        max: 99,
    },
]

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

    /** Cứ ngần này sóng thì có một con trùm, sinh THÊM ngoài quân số. */
    bossEvery: 5,
}

/**
 * SÚNG MÁY trên nóc xe — vũ khí CƠ BẢN của chế độ, giữ phím **F** để bắn.
 *
 * Pháo tên lửa (phím X) vẫn còn nguyên và vẫn mạnh hơn nhiều, nhưng nó bắn từng
 * phát một, đạn bay vòng mấy giây mới tới. Bị cả một đàn vây thì thứ cần là một
 * dòng đạn liên tục — đó là toàn bộ cảm giác "Alien Shooter" mà thiếu nó chế độ
 * này chỉ là lái xe húc quái.
 *
 * ─── VÌ SAO BẮN TỨC THỜI, KHÔNG DỰNG ĐẠN BAY ────────────────────────────────
 * Mười viên mỗi giây × mấy phút = hàng nghìn vật thể phải sinh, bay, kiểm va
 * chạm rồi thu hồi. Ở nhịp bắn này mắt không đọc được đường đạn nữa — chỉ đọc
 * VỆT SÁNG và cái chết ở đầu kia. Nên đạn tính bằng hình học (tìm con quái gần
 * trục nòng nhất trong tầm), còn vệt sáng thì dựng một thanh mảnh sống 0,05
 * giây. Rẻ hơn hàng trăm lần mà nhìn y hệt.
 */
export const SURVIVAL_GUN = {
    /** Phát mỗi giây. */
    fireRate: 9,
    /** Sát thương mỗi viên — ba viên hạ một con bọ bò (máu 3). */
    damage: 1,
    /** Bắn xa bao nhiêu. */
    range: 34,
    /**
     * Bán kính "trúng": viên đạn tính là trúng nếu con quái nằm trong hình trụ
     * này quanh trục nòng. Rộng tay một chút vì ở góc máy quay trên cao, ngắm
     * bằng chuột không thể chính xác từng phân.
     */
    hitRadius: 1.5,

    /** Mỗi phát cộng bấy nhiêu nhiệt (1 = kịch kim). */
    heatPerShot: 0.045,
    /** Nguội bao nhiêu mỗi giây. */
    coolRate: 0.35,
    /** Quá nhiệt rồi phải nguội xuống dưới mức này mới bắn lại được. */
    resumeAt: 0.35,

    /** Vệt đạn sống bao lâu (giây) và dày bao nhiêu. */
    tracerLife: 0.09,
    tracerWidth: 0.17,

    /**
     * Vệt đạn VẼ DÀI TỐI ĐA bấy nhiêu, dù đạn bay xa 34.
     *
     * ⚠️ Con số này tồn tại vì một lỗi chỉ phép đo mới bắt được: vẽ nguyên
     * chiều dài 34 thì TÂM vệt nằm cách xe 17 đơn vị về phía trước, mà máy quay
     * có FOV **25°** — chiếu lên màn hình ra `ndc.y = 1,04`, tức **ngoài mép
     * trên khung hình**. Bắn thì trúng, số liệu thì đúng, mà nhìn vào màn hình
     * không thấy một tia nào. Ba lần chụp ảnh liền không đọc ra nổi cho tới khi
     * chiếu toạ độ lên NDC.
     *
     * Vệt chỉ cần đủ dài để đọc ra "có tia phóng đi", không cần chạy hết tầm.
     */
    tracerMaxLength: 11,
    tracerColor: '#ffe27a',
    muzzleColor: '#fff3c4',

    /**
     * Nòng LỆCH SANG PHẢI bao nhiêu, và cao bao nhiêu so với tâm xe.
     *
     * ⚠️ Số này tồn tại vì chế độ cabin: nòng đặt ngay giữa trục nhìn thì chớp
     * nòng nằm cách mắt chưa tới một mét, nở ra choán gần nửa khung hình và che
     * sạch đường đi. Chụp ảnh mới thấy — số đo thì vẫn báo đúng hết.
     */
    muzzleSide: 0.62,
    muzzleHeight: 1.24,
    /** Khi đi bộ: súng trong tay, sát thân và thấp hơn nóc xe. */
    walkerMuzzleSide: 0.3,
    walkerMuzzleHeight: 1.15,
    /** Chớp nòng: bán kính và khoảng cách tính từ nòng. */
    flashScale: 0.16,
    flashDistance: 1.7,
}

/**
 * ĐI BỘ — user chốt từ đầu: **"xe trước, đi bộ sau"**. Đây là phần "sau".
 *
 * Bấm **E** khi xe đang đứng để bước xuống, bấm **E** lần nữa khi đứng cạnh xe
 * để leo lên lại. Đi bộ thì nhanh nhẹn hơn trong ngõ hẹp và nấp giỏi hơn (thân
 * người nhỏ, không có đèn pha, không có tiếng động cơ) — nhưng mất luôn lớp vỏ
 * thép: quái chạm vào là ăn đòn thẳng, và không húc được ai.
 *
 * ─── VÌ SAO KHÔNG DÙNG `KinematicCharacterController` CỦA RAPIER ────────────
 * Nó giải quyết trượt tường, bậc thang, dốc — những thứ mà thế giới này gần như
 * không có: mặt đất là MỘT hàm cao độ liên tục (xem
 * `feedback_one_height_function_not_stitched_boxes`), nhà cửa thì là hộp bao.
 * Bắn tia xuống để bám đất, cộng một phép kiểm độ dốc phía trước, là đủ — và
 * không phải kéo thêm một hệ vật lý thứ hai vào vòng lặp.
 */
export const SURVIVAL_WALKER = {
    /** Tốc độ đi và chạy (đơn vị/giây). Xe chạy 6–14, nên đi bộ chậm hơn hẳn. */
    walkSpeed: 3.4,
    runSpeed: 6.2,

    /** Cao bao nhiêu — người trong thế giới này cao chừng 1,8 (xem `FptuPeople`). */
    height: 1.8,
    /** Bán kính thân, dùng cho khoảng cách quái chạm tới. */
    radius: 0.42,

    /**
     * Dốc quá mức này thì không leo được (chênh cao độ trên mỗi đơn vị đi tới).
     * Không có nó thì người đi bộ trèo thẳng lên vách núi và tường nhà.
     */
    maxSlope: 1.15,

    /** Đứng gần xe trong bán kính này mới leo lên được. */
    enterRadius: 3.2,
    /** Bước xuống cách xe bao xa, để không kẹt trong thân xe. */
    exitOffset: 2.1,
    /** Xe phải chậm hơn mức này mới cho xuống — nhảy khỏi xe đang phóng thì thôi. */
    exitMaxSpeed: 3,

    /**
     * NẤP GIỎI HƠN: tầm phát hiện nhân với hệ số này khi đi bộ. Không đèn pha,
     * không tiếng động cơ, thân người nhỏ — đó là phần thưởng cho việc bỏ vỏ thép.
     */
    stealthFactor: 0.62,

    /** Quái đánh người đi bộ đau hơn (không còn thép che). */
    damageFactor: 1.6,

    colors: {
        skin: '#e0b183',
        hair: '#241a14',
        jacket: '#2f4a3d',
        pants: '#2f3a4a',
        boots: '#22272f',
        vest: '#4a4a55',
        gun: '#3a3f45',
    },
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
