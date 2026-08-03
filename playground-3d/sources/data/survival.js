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
 *
 * ⛔ `fatalis.glb` từng được để dành cho quái trùm. **KHÔNG DÙNG NỮA**: nó lành
 * về kỹ thuật (đã sàng, cao 2,53 → 2,57 suốt clip) nhưng là con rồng Fatalis
 * của Monster Hunter — tài sản trí tuệ của Capcom. Trang này chạy công khai ở
 * cuongthai.com nên asset moi từ game thương mại là chuyện bản quyền, không
 * phải chuyện kỹ thuật.
 */

/**
 * BA LOẠI QUÁI.
 *
 * `hp` tính theo phát tên lửa: rocket ăn 3 sát thương ở tâm, missile ăn 15.
 * `speed` so với xe: 3.4 là bò được theo xe đang đi chậm, 4.6 là đuổi kịp xe
 * đang lượn. KHÔNG con nào nhanh bằng xe chạy thẳng — chạy trốn phải luôn là
 * một lựa chọn thật.
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ ĐỪNG GÕ TAY CHIỀU CAO MODEL NỮA — MÃ TỰ ĐO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Chỗ này từng có bảng `modelSourceHeight` đo tay cho từng model, kèm cả một
 * "quy luật" tôi rút ra sau bốn phép đo. Bảng đó SAI, và cái sai đã sống ba
 * phiên:
 *
 *   `alien_soldier_wip.glb` được ghi 1,332. Lưới bọc xương của nó lúc chạy thật
 *   cao **283**, và vọt lên **427** giữa chu kỳ đi. Con crawler vì thế phình ra
 *   che TRỌN khung nhìn — người chơi tả là "bóng đen to bay chập chờn". Không
 *   bộ kiểm nào bắt được, vì mọi bộ kiểm đều đo lại đúng cái hộp bao đã sai.
 *
 * Gốc của sai lầm: hộp bao hình học là TƯ THẾ NGHỈ. Thứ GPU vẽ ra là tư thế sau
 * khi xương kéo từng đỉnh. Với model bind pose hỏng, hai thứ đó lệch nhau 200
 * lần mà không có lỗi nào được ném ra.
 *
 * Nay `SurvivalMonsters.measureSkinned()` tự đo bằng `applyBoneTransform()` —
 * API duy nhất áp đúng ma trận xương mà GPU sẽ áp — lấy mẫu 6 tư thế rải khắp
 * clip. Ở đây chỉ còn khai `modelHeight`: con quái CAO BAO NHIÊU TRONG GAME.
 *
 * Sàng model mới bằng `tools/screen-monster-models.mjs` TRƯỚC KHI nén và ghi
 * công. Model lành thì (cao bọc xương)/(cao khai trong accessor) ≈ 1 và không
 * đổi quá 10% suốt clip. Đã sàng: `alien_creature_take_3` ✅ · `fatalis` ✅
 * (nhưng là IP của Capcom, KHÔNG dùng) · `alien_soldier_wip` ❌ ·
 * `creature_monster_3d_by_oscar_creativo` ❌ · `tribal_mutant_bug_2_rig` không
 * có hoạt ảnh nào.
 */
export const SURVIVAL_MONSTERS = {
    /**
     * LÍNH NGOÀI HÀNH TINH — loại đông nhất, con non của cùng giống loài với
     * brute và trùm. Dùng CHUNG model với chúng, chỉ nhỏ hơn và nhanh hơn.
     *
     * Trước nó có model riêng (`alien_soldier_wip.glb`) và đó chính là con quái
     * đã che màn hình người chơi — bind pose hỏng sẵn trong file, xem ghi chú ở
     * đầu tệp này. Model đó đã bỏ hẳn khỏi dự án.
     *
     * `model` trỏ tới tên resource khai trong `Game.js`; `modelHeight` là chiều
     * cao THẬT trong game, mã tự co model về đúng cỡ đó. Không nạp được model
     * thì tự lùi về dáng dựng bằng mã — chơi vẫn được.
     */
    crawler: {
        name: 'Lính ngoài hành tinh',
        model: 'bossModel',
        modelHeight: 1.85,
        /**
         * Nhanh hơn hẳn hai đàn anh — cùng một hình hài, nhưng con nhỏ chạy
         * lắt nhắt thì mắt đọc ra ngay là loài khác, không phải "bản thu nhỏ".
         */
        modelTimeScale: 1.9,
        hp: 3,
        speed: 3.6,
        /** Sát thương mỗi giây khi bám được vào xe. */
        damage: 7,
        /** Bán kính thân — dùng cho va chạm và cho khoảng cách đứng cách nhau. */
        radius: 0.55,
        /** Cao độ mắt, để máu phun ra đúng chỗ chứ không phun dưới chân. */
        hitHeight: 0.75,
        scale: 1,
        money: 5,
        score: 10,
        colors: { body: '#4a6b3e', limb: '#38512f', belly: '#9ab86a', eye: '#eaff7a' },
    },

    /**
     * KẺ RÌNH — cao lêu nghêu, hai chân dài. **DỰNG BẰNG MÃ, KHÔNG DÙNG MODEL.**
     *
     * ⛔ `free_skeleton_man_axe.glb` ĐÃ THỬ VÀ PHẢI BỎ. Model đó có **TƯ THẾ
     * BIND BỊ VỠ**: đo qua 20 mốc của clip thì cỡ lớn nhất là **186,47 tại giây
     * 0**, trong khi ba loại kia chỉ 1,9–7,4. Các mảnh (rìu, sọ) văng xa nhau ở
     * tư thế bind và chỉ được clip kéo về — nên nó **chập chờn khổng lồ** đúng
     * như user mô tả: *"con dơi bay bay khổng lồ che mất bằng cái cánh"*.
     *
     * Và mọi phép đo dựa trên bind đều vô nghĩa với nó: co theo bind thì lúc
     * clip chạy con quái teo lại, co theo clip thì lúc bind nó che kín màn hình.
     *
     * Dáng dựng bằng mã (`makeStalker`) đọc rõ và tuyệt đối ổn định.
     */
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
        model: 'bossModel',
        modelHeight: 3.6,
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
        /**
         * Model NẶNG NHẤT trong kho (103.412 đỉnh, 126 khớp) — chỉ dám dùng vì
         * mỗi ván nhiều nhất một con sống cùng lúc. Loại "quái to xác" đã nhận
         * lại model cũ (`bossModel`, 28.5k đỉnh).
         */
        /**
         * ⚠️ DÙNG `bossModel` (alien_creature, 28.5k đỉnh), KHÔNG dùng model
         * 103.412 đỉnh — nhưng KHÔNG phải vì model kia hỏng.
         *
         * Lý do thật: `bossModel` đã được chụp ảnh và xác nhận dựng đúng, đẹp,
         * ở cả vai "quái to xác" lẫn vai trùm khi phóng to 2,7 lần. Model
         * 103.412 đỉnh thì chưa bao giờ xác nhận được — và nó tốn thêm 2,7 MB
         * tải về. Không đổi một thứ đã chứng minh lấy một thứ chưa chứng minh.
         *
         * ⚠️ ĐÍNH CHÍNH cho ai đọc lịch sử commit: có một lúc tôi kết luận model
         * kia "vỡ thành sọ và kiếm rời rạc". **SAI.** Cái sọ và thanh kiếm trong
         * ảnh là PROPS CÓ SẴN của cảnh — chúng vẫn nằm nguyên đó sau khi đã đổi
         * model. Đây là bài học về việc đọc ảnh: thấy một thứ lạ cạnh vật mình
         * vừa thêm thì phải đổi biến rồi chụp lại, đừng vội quy tội.
         */
        model: 'bossModel',
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
    {
        key: 'heli',
        name: 'Trực thăng',
        description: 'Gọi trực thăng tới — bay lên là quái hết với tới',
        /**
         * ⚠️ Món DUY NHẤT không phải nâng cấp mà là HÀNH ĐỘNG: giá và số lần
         * gọi do `SurvivalHeli` giữ, không do `upgrades`. `Survival.priceOf()`
         * và `buy()` đều có nhánh riêng cho `key === 'heli'` — thiếu một trong
         * hai là giá hiện sai hoặc mua rồi mà chẳng có gì tới.
         */
        action: 'heli',
        price: 220,
        step: 1.5,
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
    /**
     * Số quái của sóng n.
     *
     * ⚠️ Đã nâng từ `4 + wave·2` (trần 30) lên `6 + wave·3` (trần 44) sau khi
     * user thử thật và chê **"quái vật còn ít"**. Sóng 1 nay 9 con thay vì 6,
     * sóng 5 là 21 thay vì 14.
     */
    countFor: (wave) => Math.min(44, 6 + wave * 3),

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
    spawnInterval: 0.55,

    /**
     * Sống cùng lúc tối đa — chặn trên cho cả hiệu năng lẫn độ khó.
     *
     * ⚠️ 30 chứ không hơn, và con số này giờ ĐẮT hơn trước nhiều: mỗi con là
     * một model có xương với một `AnimationMixer` riêng cập nhật 82–126 khớp
     * mỗi khung hình. Trước đây quái dựng bằng khối nên 26 con gần như miễn
     * phí; nay nâng trần là phải đo lại số đỉnh và số lệnh vẽ.
     */
    maxAlive: 30,

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
    fireRate: 7,
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

    /**
     * ĐẠN VẠCH — chuỗi chấm sáng, KHÔNG phải một thanh dài.
     *
     * ⚠️ Bản đầu vẽ một khối hộp dài 11 đơn vị và user gọi thẳng tên nó ra:
     * *"cứ bắn là một thanh ngang màu vàng rất xấu"*. Ở máy quay nhìn từ trên
     * xuống, hình hộp dài nằm ngang chỉ là một cái gạch.
     */
    tracerLife: 0.09,
    /** Mấy chấm mỗi phát, và chấm đầu to bao nhiêu. */
    tracerDots: 4,
    tracerDotSize: 0.13,

    /**
     * DẤU TRÚNG ĐÍCH — user báo *"viên đạn bay trúng không thấy khói bốc lên
     * hay biểu tượng cho trúng mục tiêu cả"*. Không có phản hồi này thì người
     * chơi không biết mình bắn trúng hay trượt, và cả khẩu súng mất ý nghĩa.
     */
    impactSparks: 5,
    impactSize: 0.11,
    impactLife: 0.18,
    impactColor: '#ffd166',

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

/**
 * TRỰC THĂNG — mảnh cuối của kế hoạch user chốt từ đầu ("có vũ khí và trực thăng").
 *
 * Mua **"Gọi trực thăng"** ở cửa hàng; nó bay từ ngoài bản đồ tới, hạ xuống
 * cạnh người chơi. Bấm **E** để lên. Trên trời thì quái không với tới được và
 * bắn xuống thì cả đàn phơi ra — nên nó phải ĐẮT và có **nhiên liệu đếm ngược**,
 * không thì mua một lần là thắng vĩnh viễn.
 *
 * ─── VÌ SAO KHÔNG DÙNG VẬT LÝ THẬT ──────────────────────────────────────────
 * Mô phỏng khí động học của cánh quạt là một dự án riêng, và cái người chơi
 * muốn ở đây không phải "lái trực thăng cho đúng" mà là "bay lên khỏi tầm với
 * của lũ quái rồi nã xuống". Nên nó bay **kinematic**: đi theo hướng máy quay
 * đúng như người đi bộ, cộng một trục lên-xuống, cộng phép bám địa hình để
 * không đâm vào sườn núi. Nghiêng thân theo hướng bay là đủ để mắt tin.
 */
export const SURVIVAL_HELI = {
    /** Giá gọi. Đắt bằng cả một cấp giáp cộng một cấp nòng súng. */
    price: 220,
    /** Mỗi lần gọi lại đắt thêm. */
    priceStep: 1.5,

    /** Bay nhanh cỡ nào (đơn vị/giây) — nhanh hơn xe một chút. */
    speed: 16,
    /** Lên/xuống nhanh cỡ nào. */
    liftSpeed: 7,

    /**
     * Bay cao bao nhiêu so với mặt đất, và giới hạn hai đầu.
     *
     * ⚠️ TRẦN BAY 8,5 KHÔNG PHẢI CON SỐ TUỲ HỨNG — nó đến từ phép đo. Máy quay
     * bám nhân vật đứng ở cao **27,7** với FOV **25°** và luôn ngắm xuống MẶT
     * ĐẤT (`focusPoint` chỉ nhận x/z, y luôn 0). Chiếu vị trí trực thăng lên
     * NDC ở từng độ cao:
     *
     *     cao  3 → y 0,34 ✓      cao 12 → y 1,20 ✗ NGOÀI KHUNG
     *     cao  5 → y 0,52 ✓      cao 16 → y 1,64 ✗
     *     cao  7 → y 0,70 ✓      cao 22 → y 2,42 ✗
     *     cao  9 → y 0,89 ✓      cao 34 → y 4,50 ✗
     *
     * Bản đầu đặt trần 34 và người chơi **không nhìn thấy chính chiếc trực
     * thăng mình đang lái** — HUD báo "Bay 70s" mà khung hình trống trơn. Cùng
     * một cái bẫy đã làm vệt đạn tàng hình: FOV 25° hẹp hơn trực giác rất nhiều.
     *
     * Vẫn cao hơn con trùm (6,2) nên "bay lên là thoát" vẫn đúng.
     */
    hoverHeight: 6,
    minHeight: 2.5,
    maxHeight: 8.5,

    /** Bay được bao nhiêu giây trước khi hết dầu. */
    fuel: 70,
    /** Hết dầu thì hạ xuống với tốc độ này rồi biến mất. */
    landSpeed: 5,

    /** Bay tới từ xa chừng này, và mất bao lâu. */
    arriveDistance: 60,
    arriveDuration: 4,

    /** Đứng trong bán kính này mới leo lên được. */
    enterRadius: 5,

    /** Nghiêng thân tối đa khi bay tới/nghiêng — chỉ để nhìn, không đụng đường bay. */
    tiltMax: 0.34,

    /** Cánh quạt quay bao nhanh (radian/giây). */
    rotorSpeed: 26,

    /** Súng trên trực thăng mạnh hơn hẳn — đó là phần thưởng cho 220$. */
    gunDamageFactor: 2.2,
    /** Và nòng nguội nhanh hơn. */
    gunHeatFactor: 0.55,

    colors: {
        body: '#2f3a4a',
        cabin: '#1d2733',
        glass: '#7ac7ff',
        rotor: '#22272f',
        skid: '#3d3f45',
        stripe: '#ffb03a',
        light: '#ff5a6a',
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
