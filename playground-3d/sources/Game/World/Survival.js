import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import { Game } from '../Game.js'
import { Events } from '../Events.js'
import { SurvivalMonsters } from './SurvivalMonsters.js'
import { SurvivalGun } from './SurvivalGun.js'
import { SURVIVAL_LOOT, SURVIVAL_PLAYER, SURVIVAL_SHOP, SURVIVAL_STEALTH, SURVIVAL_WAVES } from '../../data/survival.js'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CHẾ ĐỘ SINH TỒN — luật chơi
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bật ở Cài đặt → **Survival** (Off · On). Bật xong: trời tối lại, quái ngoài
 * hành tinh sinh ra quanh xe theo từng SÓNG và đi tìm người chơi. Húc chết
 * bằng xe hoặc bắn bằng pháo trên nóc. Quái chết ra máu đen và rơi tiền.
 * Hết máu là thua, hồi sinh về sóng 1.
 *
 * ─── XE TRƯỚC, ĐI BỘ SAU (user chốt 1/8) ────────────────────────────────────
 * Bản này người chơi LUÔN ở trên xe. "Nấp" nghĩa là lái ra xa, vòng lại, dùng
 * địa hình. Chức năng xuống xe đi bộ là một bộ điều khiển nhân vật viết mới
 * hoàn toàn — để bản sau, đừng cố nhét vào đây.
 *
 * ─── VÌ SAO CHƠI ĐƯỢC Ở MỌI NƠI, KHÔNG RIÊNG ĐẢO QUÁI ───────────────────────
 * Quái sinh ra trên vành quanh XE chứ không quanh một cái tổ cố định, nên bật
 * chế độ ở đâu là chơi được ở đó — trong phố, trên đảo trường, trên boong tàu
 * sân bay. Đảo quái vật vẫn là chỗ có không khí nhất (đất tro, tổ quái, nhà
 * đổ) nhưng KHÔNG bắt buộc phải tới đó mới chơi được, vì bắt người ta lái ba
 * mươi giây mới được chơi thì lần thứ hai không ai bật nữa.
 *
 * ─── BA NHỊP MỘT VÒNG ───────────────────────────────────────────────────────
 *  1. `preparing` — nghỉ giữa hai sóng, TRỜI SÁNG. Nhặt tiền, thở, chạy về chỗ
 *     thoáng. Đây chính là "ngày ngắn" trong cặp ngày-ngắn / đêm-dài user muốn.
 *  2. `hunting`   — sóng đang chạy, TRỜI TỐI. Quái sinh dần cho tới đủ số của
 *     sóng, và chỉ khi giết sạch mới sang sóng sau.
 *  3. `defeated`  — máu về 0. Đứng lại vài giây rồi bắt đầu lại từ sóng 1.
 */
export class Survival
{
    constructor()
    {
        this.game = Game.getInstance()
        this.events = new Events()

        this.enabled = false

        /**
         * Số cấp đã mua của từng món trong cửa hàng, khoá theo `key`.
         * Reset mỗi ván (`enable()` và `restart()`) — nâng cấp thuộc về VÁN,
         * không thuộc về người chơi, nên mỗi lần chơi lại là làm lại từ đầu.
         *
         * ⚠️ PHẢI khai TRƯỚC dòng `this.health = this.maxHealth` ngay dưới:
         * getter `maxHealth` đọc `this.upgrades` qua `level()`, gán sau là
         * `undefined['armor']` — ném lỗi ngay trong hàm dựng, và một lỗi ở đây
         * thì `World.step(1)` chết đứng từ đó trở đi mà màn hình không báo gì.
         */
        this.upgrades = {}

        /** `preparing` · `hunting` · `defeated` */
        this.phase = 'preparing'
        this.wave = 0
        this.health = this.maxHealth
        this.score = 0
        this.money = 0
        this.kills = 0
        this.best = parseInt(localStorage.getItem('survivalBestWave') ?? '0') || 0

        /** Còn phải sinh bao nhiêu con nữa cho sóng này. */
        this.toSpawn = 0
        this.spawnTimer = 0
        this.phaseTimer = 0
        /** Bao lâu rồi chưa ăn đòn — dùng cho hồi máu. */
        this.safeFor = 0

        this.loot = []
        this.lootMaterials = new Map()
        this.lootGeometry = new THREE.BoxGeometry(1, 1, 1)

        this.monsters = new SurvivalMonsters(this)
        this.gun = new SurvivalGun(this)

        this.setPreference()
        this.setSounds()
        this.setHud()
        this.setShop()
        this.setSettingsButtons()

        /**
         * Nhịp 12 — SAU pháo tên lửa (11) nên đòn nổ của khung này đã kịp trừ
         * máu quái trước khi đàn quái đi tiếp, và sau vật lý nên vị trí xe đọc
         * được là vị trí thật của khung này.
         */
        this.game.ticker.events.on('tick', () => this.update(), 12)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  BẬT / TẮT
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Off · On.
     *
     * ⚠️ CỐ Ý KHÔNG nhớ qua `localStorage` như Rocket hay Weather: bật Sinh tồn
     * là đổi cả bầu trời lẫn luật chơi, mở lại trang mà tự dưng trời tối và có
     * quái vây thì người chơi không hiểu chuyện gì. Một cú bấm để bật lại là đủ.
     */
    setPreference()
    {
        this.preference = {}
        this.preference.names = [ 'off', 'on' ]
        this.preference.labels = { off: 'Off', on: 'On' }
        this.preference.current = 'off'

        this.preference.set = (name) =>
        {
            if(!this.preference.names.includes(name)) return
            if(this.preference.current === name) return

            this.preference.current = name

            if(name === 'on') this.enable()
            else this.disable()

            this.events.trigger('preferenceChange')
        }
    }

    enable()
    {
        this.enabled = true

        // Nhớ lựa chọn giờ của người chơi để trả lại nguyên vẹn khi tắt chế độ
        this.previousTime = this.game.dayCycles.preference.current

        // Nâng cấp thuộc về VÁN — chơi lại là làm lại từ đầu. Đặt trước khi gán
        // máu, vì `maxHealth` cộng theo số cấp giáp
        this.upgrades = {}

        this.wave = 0
        this.health = this.maxHealth
        this.score = 0
        this.money = 0
        this.kills = 0
        this.safeFor = 0

        this.hudElement?.classList.add('is-visible')
        this.startPreparing(4)

        this.game.notifications?.show(
            /* html */`<div class="top"><p class="title">Chế độ Sinh tồn</p></div><div class="bottom"><p class="description">Trời sắp tối. Giữ <strong>F</strong> bắn súng máy · <strong>X</strong> bắn tên lửa nếu đã bật Rocket · húc thẳng cũng chết.</p></div>`,
            'is-achievement',
            6,
        )
    }

    disable()
    {
        this.enabled = false

        this.monsters.clear()
        this.gun.clear()
        this.clearLoot()
        this.hudElement?.classList.remove('is-visible')
        this.shopElement?.classList.remove('is-visible')
        this.bossElement?.classList.remove('is-visible')
        this.boss = null
        this.lastShopOpen = null
        this.lastBossAlive = null
        this.setDefeatedOverlay(false)

        // Trả lại đúng lựa chọn giờ trước khi vào chế độ
        if(this.previousTime)
            this.setTime(this.previousTime, 3)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SÓNG
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Đổi giờ trong ngày mà KHÔNG cướp lựa chọn Time của người chơi.
     *
     * ⚠️ `dayCycles.preference.set()` ghi thẳng vào `localStorage`. Gọi thẳng nó
     * thì người chơi bật Sinh tồn, chơi một lúc, đóng tab — và lần sau vào sân
     * chơi thấy trời tối vĩnh viễn mà không hiểu vì sao, vì lựa chọn Time của
     * họ đã bị chế độ này ghi đè mất. Chế độ Sinh tồn chỉ MƯỢN bầu trời, nên
     * mượn xong phải trả lại đúng giá trị đã lưu.
     */
    setTime(name, duration)
    {
        const stored = localStorage.getItem('dayCyclePreference')

        this.game.dayCycles.preference.set(name, duration)

        if(stored === null) localStorage.removeItem('dayCyclePreference')
        else localStorage.setItem('dayCyclePreference', stored)
    }

    /** Nghỉ — trời hửng sáng, quái ngừng sinh. */
    startPreparing(duration = SURVIVAL_WAVES.breakDuration)
    {
        this.phase = 'preparing'
        this.phaseTimer = duration
        this.setTime('day', 3)
    }

    /** Vào sóng — trời tối lại, quái bắt đầu sinh dần. */
    startWave()
    {
        this.wave++
        this.phase = 'hunting'
        this.toSpawn = SURVIVAL_WAVES.countFor(this.wave)
        this.spawnTimer = 0

        // Cứ 5 sóng một con trùm, sinh THÊM ngoài quân số
        this.bossPending = this.wave % SURVIVAL_WAVES.bossEvery === 0
        this.boss = null

        this.setTime('night', 2.5)
        this.sounds.howl?.play()

        this.game.notifications?.show(
            this.bossPending
                ? /* html */`<div class="top"><p class="title">Sóng ${this.wave} — QUÁI TRÙM</p></div><div class="bottom"><p class="description">${this.toSpawn} con, và một thứ không nấp nổi</p></div>`
                : /* html */`<div class="top"><p class="title">Sóng ${this.wave}</p></div><div class="bottom"><p class="description">${this.toSpawn} con đang tới</p></div>`,
            'is-achievement',
            this.bossPending ? 5 : 3,
        )

        this.events.trigger('waveChange')
    }

    /**
     * Bảng tỉ lệ loại quái của sóng hiện tại — dòng CUỐI CÙNG khớp thì thắng,
     * nên thêm một mốc khó hơn chỉ việc nối vào cuối `SURVIVAL_WAVES.mix`.
     */
    pickType()
    {
        let mix = SURVIVAL_WAVES.mix[0]
        for(const row of SURVIVAL_WAVES.mix)
            if(this.wave >= row.from) mix = row

        const total = mix.crawler + mix.stalker + mix.brute
        let roll = Math.random() * total

        if((roll -= mix.crawler) < 0) return 'crawler'
        if((roll -= mix.stalker) < 0) return 'stalker'
        return 'brute'
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PHẦN THƯỞNG
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Một con bị thu hồi vì người chơi lái ra quá xa — trả suất của nó về hàng
     * chờ để sóng vẫn phải trả đủ. Chạy trốn là hoãn, không phải thắng.
     */
    onMonsterEscaped()
    {
        if(this.phase === 'hunting') this.toSpawn++
    }

    /** `SurvivalMonsters.kill()` gọi ngược vào đây. */
    onMonsterKilled(monster)
    {
        this.kills++
        this.score += monster.spec.score

        this.sounds.death?.play(monster.root.position)

        const at = monster.root.position

        // ── Quái trùm: rơi cả một đống chứ không một đồng ────────────────────
        if(monster.spec.isBoss)
        {
            this.game.notifications?.show(
                /* html */`<div class="top"><p class="title">Hạ được quái trùm</p></div><div class="bottom"><p class="description">+${monster.spec.money}$ · +${monster.spec.score} điểm</p></div>`,
                'is-achievement',
                4,
            )

            // Rải thành sáu đồng quanh xác — một đồng to thì nhặt một phát là
            // xong, rải ra thì có mấy giây đi lượm, và đó là phần thưởng thật
            for(let i = 0; i < 6; i++)
            {
                const angle = (i / 6) * Math.PI * 2
                this.dropLoot(
                    at.x + Math.cos(angle) * 2.4,
                    monster.groundY,
                    at.z + Math.sin(angle) * 2.4,
                    i === 5 ? 'health' : 'money',
                    i === 5 ? SURVIVAL_LOOT.healthAmount * 2 : Math.round(monster.spec.money / 5),
                )
            }
            return
        }

        if(Math.random() < SURVIVAL_LOOT.healthChance)
            this.dropLoot(at.x, monster.groundY, at.z, 'health', SURVIVAL_LOOT.healthAmount)
        else
            this.dropLoot(at.x, monster.groundY, at.z, 'money', monster.spec.money)
    }

    lootMaterial(hex)
    {
        let m = this.lootMaterials.get(hex)
        if(!m)
        {
            /**
             * `MeshBasicNodeMaterial` chứ không phải vật liệu thường: vật phẩm
             * phải đọc được TRONG ĐÊM, mà đêm ở đây tối thật. Không ăn ánh sáng
             * thì nó tự phát ra đúng màu đó dù đứng trong bóng nhà.
             */
            m = new THREE.MeshBasicNodeMaterial()
            m.colorNode = color(hex)
            m.toneMapped = false
            this.lootMaterials.set(hex, m)
        }
        return m
    }

    dropLoot(x, groundY, z, kind, amount)
    {
        const hex = kind === 'health' ? SURVIVAL_LOOT.healthColor : SURVIVAL_LOOT.color

        const mesh = new THREE.Mesh(this.lootGeometry, this.lootMaterial(hex))
        mesh.scale.set(0.34, 0.34, 0.12)
        mesh.position.set(x, groundY + 0.6, z)
        mesh.castShadow = false
        this.game.scene.add(mesh)

        this.loot.push({ mesh, kind, amount, groundY, age: 0, phase: Math.random() * Math.PI * 2 })
    }

    clearLoot()
    {
        for(const item of this.loot)
            this.game.scene.remove(item.mesh)
        this.loot.length = 0
    }

    updateLoot(delta, target)
    {
        for(let i = this.loot.length - 1; i >= 0; i--)
        {
            const item = this.loot[i]
            item.age += delta

            if(item.age >= SURVIVAL_LOOT.life)
            {
                this.game.scene.remove(item.mesh)
                this.loot.splice(i, 1)
                continue
            }

            item.mesh.rotation.y += SURVIVAL_LOOT.spinSpeed * delta
            item.mesh.position.y = item.groundY + 0.6
                + Math.sin(this.game.ticker.elapsed * SURVIVAL_LOOT.bobSpeed + item.phase) * SURVIVAL_LOOT.bobHeight

            // Năm giây cuối thì nhấp nháy báo sắp tan
            if(item.age > SURVIVAL_LOOT.life - 5)
                item.mesh.visible = Math.sin(item.age * 14) > -0.3

            const distance = Math.hypot(item.mesh.position.x - target.x, item.mesh.position.z - target.z)
            if(distance > SURVIVAL_PLAYER.pickupRadius) continue

            // ── Nhặt được ────────────────────────────────────────────────────
            if(item.kind === 'health')
                this.health = Math.min(this.maxHealth, this.health + item.amount)
            else
                this.money += item.amount

            this.sounds.pickup?.play(item.mesh.position)
            this.game.scene.remove(item.mesh)
            this.loot.splice(i, 1)
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ĂN ĐÒN & THUA
    // ═══════════════════════════════════════════════════════════════════════

    hurt(amount)
    {
        if(this.phase === 'defeated') return

        this.health -= amount
        this.safeFor = 0
        this.hudElement?.classList.add('is-hurt')

        // Bỏ lớp nhấp nháy sau một nhịp — CSS lo phần còn lại
        clearTimeout(this.hurtTimeout)
        this.hurtTimeout = setTimeout(() => this.hudElement?.classList.remove('is-hurt'), 320)

        if(this.health <= 0)
            this.defeat()
    }

    defeat()
    {
        this.health = 0
        this.phase = 'defeated'
        this.phaseTimer = 5

        if(this.wave > this.best)
        {
            this.best = this.wave
            localStorage.setItem('survivalBestWave', String(this.best))
        }

        this.monsters.clear()
        this.setDefeatedOverlay(true)
        this.sounds.death?.play(this.game.physicalVehicle.position)
    }

    /** Sau màn thua: dọn sạch, hồi máu, quay lại sóng 1. */
    restart()
    {
        this.setDefeatedOverlay(false)
        this.clearLoot()

        // Nâng cấp thuộc về VÁN — chơi lại là làm lại từ đầu. Đặt trước khi gán
        // máu, vì `maxHealth` cộng theo số cấp giáp
        this.upgrades = {}

        this.wave = 0
        this.health = this.maxHealth
        this.score = 0
        this.money = 0
        this.kills = 0
        this.safeFor = 0

        this.startPreparing(5)
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MỖI KHUNG HÌNH
    // ═══════════════════════════════════════════════════════════════════════

    update()
    {
        if(!this.enabled) return

        const delta = Math.min(this.game.ticker.delta, 0.1)
        const vehicle = this.game.physicalVehicle
        const target = vehicle.position

        // ── Màn thua: đứng đếm ngược rồi bắt đầu lại ─────────────────────────
        if(this.phase === 'defeated')
        {
            this.phaseTimer -= delta
            this.monsters.update(delta, target, () => {})
            if(this.phaseTimer <= 0) this.restart()
            this.updateHud()
            return
        }

        // ── Nghỉ giữa hai sóng ───────────────────────────────────────────────
        if(this.phase === 'preparing')
        {
            this.phaseTimer -= delta
            if(this.phaseTimer <= 0) this.startWave()
        }
        // ── Đang săn: sinh dần cho đủ số, giết sạch thì sang sóng sau ─────────
        else
        {
            /**
             * Con trùm sinh SAU khi đàn thường đã ra gần hết, không sinh ngay
             * đầu sóng: vào sóng mà thấy nó lù lù trước mặt thì chỉ có chạy,
             * còn để nó tới lúc đang bận đánh nhau mới đúng là một cú bất ngờ.
             */
            if(this.bossPending && this.toSpawn <= 2)
            {
                const boss = this.monsters.spawn('boss', target.x, target.z)
                if(boss)
                {
                    this.bossPending = false
                    this.boss = boss
                    this.sounds.howl?.play()
                }
            }

            if(this.toSpawn > 0)
            {
                this.spawnTimer -= delta

                if(this.spawnTimer <= 0 && this.monsters.aliveCount < SURVIVAL_WAVES.maxAlive)
                {
                    this.spawnTimer = SURVIVAL_WAVES.spawnInterval
                    if(this.monsters.spawn(this.pickType(), target.x, target.z))
                        this.toSpawn--
                }
            }
            else if(this.monsters.aliveCount === 0 && !this.bossPending)
            {
                if(this.wave > this.best)
                {
                    this.best = this.wave
                    localStorage.setItem('survivalBestWave', String(this.best))
                }
                this.startPreparing()
            }
        }

        // ── Đàn quái ─────────────────────────────────────────────────────────
        this.monsters.update(
            delta,
            target,
            (monster) => this.onMonsterReach(monster, vehicle),
            this.sightRange(vehicle),
        )

        // ── Súng máy ─────────────────────────────────────────────────────────
        this.gun.update(delta)

        // ── Húc bằng xe ──────────────────────────────────────────────────────
        this.updateRamming(delta, vehicle)

        // ── Vật phẩm ─────────────────────────────────────────────────────────
        this.updateLoot(delta, target)

        // ── Tự hồi máu khi đã lâu không ăn đòn ───────────────────────────────
        this.safeFor += delta
        if(this.safeFor > SURVIVAL_PLAYER.regenDelay && this.health < this.maxHealth)
        {
            const rate = SURVIVAL_PLAYER.regenRate + this.level('regen') * 3
            this.health = Math.min(this.maxHealth, this.health + rate * delta)
        }

        this.updateHud()
    }

    /**
     * TẦM PHÁT HIỆN hiện tại — con số quyết định "nấp" có thật hay không.
     *
     * User chốt: *"nấp = lái xe núp sau nhà, tắt đèn"*. Nên hai thứ tự khai báo
     * vị trí của người chơi phải là hai thứ vào công thức này:
     *  - **Đèn pha** đang bật → nhân tầm lên gần gấp đôi.
     *  - **Tốc độ** → mỗi đơn vị tốc độ cộng thêm tầm (động cơ gầm).
     *
     * Đọc `lighting.headlights.shouldBeOn()` chứ KHÔNG đọc `mode`: ở chế độ
     * `auto` đèn tự bật khi trời tối, mà chế độ Sinh tồn thì gần như lúc nào
     * cũng tối — đọc `mode` thì "auto" bị tính là tắt và nấp trở nên quá dễ.
     */
    sightRange(vehicle)
    {
        let range = SURVIVAL_STEALTH.baseRange

        if(this.game.lighting?.headlights?.shouldBeOn())
            range *= SURVIVAL_STEALTH.headlightsFactor

        range += vehicle.xzSpeed * SURVIVAL_STEALTH.speedRange

        return range
    }

    /** Một con bám được vào xe và gặm. */
    onMonsterReach(monster, vehicle)
    {
        // Đang phóng nhanh thì nó không bám được — `updateRamming` lo con này
        if(vehicle.xzSpeed > SURVIVAL_PLAYER.rammingSpeed) return

        this.hurt(monster.spec.damage * 0.6)
        this.sounds.bite?.play(monster.root.position)
    }

    /**
     * HÚC — vũ khí đầu tiên và luôn có sẵn.
     *
     * Sát thương theo TỐC ĐỘ VƯỢT NGƯỠNG chứ không phải cứ chạm là chết: dưới
     * ngưỡng thì đứng yên rê xe cũng dọn sạch cả sóng, mà thế thì không còn là
     * sinh tồn nữa. Trên ngưỡng, càng nhanh càng đau — đúng trực giác.
     */
    updateRamming(delta, vehicle)
    {
        const speed = vehicle.xzSpeed
        if(speed <= SURVIVAL_PLAYER.rammingSpeed) return

        const power = (speed - SURVIVAL_PLAYER.rammingSpeed)
            * SURVIVAL_PLAYER.rammingPower
            * (1 + this.level('ram') * 0.45)

        for(const monster of this.monsters.monsters)
        {
            if(monster.dead || monster.ramCooldown > 0) continue

            const dx = monster.root.position.x - vehicle.position.x
            const dz = monster.root.position.z - vehicle.position.z

            // Hộp bao xe chừng 2 × 1; cộng bán kính con quái là ra tầm với
            const reach = 1.5 + monster.spec.radius * monster.scale
            if(Math.hypot(dx, dz) > reach) continue

            monster.ramCooldown = SURVIVAL_PLAYER.rammingCooldown
            this.monsters.hit(monster, power, vehicle.position.x, vehicle.position.z)
            this.sounds.impact?.play(monster.root.position)
        }
    }

    /**
     * SÁT THƯƠNG VÙNG từ pháo tên lửa — `VehicleRocket.detonate()` gọi vào đây.
     * Tự kiểm tra bật/tắt để chỗ gọi cứ gọi thẳng, giống hệt cách hệ phá huỷ làm.
     */
    damageAround(center, radius, power = 1)
    {
        if(!this.enabled) return 0

        // Nâng cấp "Đầu đạn" ăn vào ĐÂY, không vào `VehicleRocket`: bản thân
        // khẩu pháo là thứ dùng chung với chế độ thường, không được mạnh lên
        // chỉ vì người chơi đã mua gì đó trong một ván Sinh tồn
        return this.monsters.damageAround(center, radius, power * (1 + this.level('blast') * 0.5))
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  CỬA HÀNG
    // ═══════════════════════════════════════════════════════════════════════

    /** Số cấp đã mua của một món. */
    level(key)
    {
        return this.upgrades[key] ?? 0
    }

    /**
     * Giá HIỆN TẠI của một món — tăng theo cấp đã mua (`price × step^cấp`).
     * Nhờ vậy hai món rẻ đầu ván không biến việc mua thành chuyện hiển nhiên:
     * tới cấp ba thì phải chọn giữa giáp và đầu đạn chứ không mua được cả hai.
     */
    priceOf(item)
    {
        return Math.round(item.price * Math.pow(item.step, this.level(item.key)))
    }

    canBuy(item)
    {
        return this.level(item.key) < item.max && this.money >= this.priceOf(item)
    }

    buy(item)
    {
        // Chỉ mua được trong nhịp nghỉ — dừng giữa lúc bị vây để mở bảng nâng
        // cấp thì còn gì là sinh tồn
        if(this.phase !== 'preparing') return false
        if(!this.canBuy(item)) return false

        this.money -= this.priceOf(item)
        this.upgrades[item.key] = this.level(item.key) + 1

        // Hai món có tác dụng NGAY, ba món còn lại được đọc lúc dùng
        if(item.key === 'armor' || item.key === 'patch')
            this.health = this.maxHealth

        this.sounds.pickup?.play(this.game.physicalVehicle.position)
        this.renderShop()
        return true
    }

    /** Máu tối đa sau khi cộng giáp. */
    get maxHealth()
    {
        return SURVIVAL_PLAYER.maxHealth + this.level('armor') * 25
    }

    /**
     * Dựng các món từ `SURVIVAL_SHOP` và nối phím 1–5.
     *
     * ⚠️ Phím đi qua ĐÚNG hệ `inputs.actions` như mọi phím khác của game. Tự
     * nghe `keydown` là hỏng: màn chào chặn phím ở pha bắt, và gõ số trong lúc
     * bảng Cài đặt đang mở mà vẫn mua hàng thì rất phiền.
     */
    setShop()
    {
        this.shopElement = document.querySelector('.js-survival-shop')
        if(!this.shopElement) return

        this.shopItemsElement = this.shopElement.querySelector('.js-survival-shop-items')
        this.shopMoneyElement = this.shopElement.querySelector('.js-survival-shop-money')

        this.shopButtons = SURVIVAL_SHOP.map((item, index) =>
        {
            const button = document.createElement('button')
            button.className = 'survival-shop-item'
            button.type = 'button'
            button.innerHTML = /* html */`
                <span class="survival-shop-key">${index + 1}</span>
                <span class="survival-shop-name">${item.name}</span>
                <span class="survival-shop-desc">${item.description}</span>
                <span class="survival-shop-price"></span>
                <span class="survival-shop-level"></span>
            `
            button.addEventListener('click', () => this.buy(item))
            this.shopItemsElement.appendChild(button)

            return {
                item,
                element: button,
                priceElement: button.querySelector('.survival-shop-price'),
                levelElement: button.querySelector('.survival-shop-level'),
            }
        })

        this.game.inputs.addActions(
            SURVIVAL_SHOP.map((item, index) => ({
                name: `survivalBuy${index + 1}`,
                categories: [ 'wandering' ],
                keys: [ `Keyboard.Digit${index + 1}`, `Keyboard.Numpad${index + 1}` ],
            })),
        )

        SURVIVAL_SHOP.forEach((item, index) =>
        {
            this.game.inputs.events.on(`survivalBuy${index + 1}`, (action) =>
            {
                if(action.active && this.enabled) this.buy(item)
            })
        })

        this.renderShop()
    }

    /**
     * ⚠️ Chỉ gọi khi có thứ ĐỔI (mua xong, nhặt tiền, đổi nhịp) — đây là năm
     * lần ghi `textContent` cộng năm lần `classList.toggle`, chạy mỗi khung
     * hình là đúng loại rò rỉ đã nói ở `updateHud()`.
     */
    renderShop()
    {
        if(!this.shopButtons) return

        this.shopMoneyElement.textContent = this.money

        for(const { item, element, priceElement, levelElement } of this.shopButtons)
        {
            const level = this.level(item.key)
            const maxed = level >= item.max

            priceElement.textContent = maxed ? 'Hết cấp' : `${this.priceOf(item)}$`
            levelElement.textContent = item.max > 90
                ? (level > 0 ? `đã mua ${level}` : '')
                : `cấp ${level}/${item.max}`

            element.classList.toggle('is-locked', maxed || !this.canBuy(item))
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ÂM THANH
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Kho tiếng của bản mẫu không có tiếng quái nào, nên mượn: tiếng sói tru
     * làm hồi kèn vào sóng, tiếng chuông "Death Hit" làm tiếng quái gục, tiếng
     * va mềm làm tiếng cắn, tiếng máy tính tiền làm tiếng nhặt.
     */
    setSounds()
    {
        this.sounds = {}

        const register = (path, volume, fade) => this.game.audio.register({
            path,
            autoplay: false,
            loop: false,
            volume,
            antiSpam: 0.12,
            positions: new THREE.Vector3(),
            distanceFade: fade,
            onPlay: (item, coordinates) =>
            {
                if(coordinates) item.positions[0].copy(coordinates)
                item.volume = 1
            },
        })

        this.sounds.death = register('sounds/bell/Death Hit.mp3', 0.4, 40)
        this.sounds.bite = register('sounds/hits/defaults/Impact Soft 03.mp3', 0.5, 25)
        this.sounds.impact = register('sounds/hits/metal/Metal Clip Hit.mp3', 0.45, 30)
        this.sounds.pickup = register('sounds/ding/Cash Register 03.mp3', 0.35, 30)

        // Tiếng tru KHÔNG bám toạ độ — nó là hồi kèn báo sóng, phải nghe rõ dù
        // đang đứng ở đâu
        this.sounds.howl = this.game.audio.register({
            path: 'sounds/wolf/TimberWolvesGroupHowlingSomeWhimpering_S2h0E_04.mp3',
            autoplay: false,
            loop: false,
            volume: 0.5,
            antiSpam: 1,
        })
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  GIAO DIỆN
    // ═══════════════════════════════════════════════════════════════════════

    setHud()
    {
        this.hudElement = document.querySelector('.js-survival-hud')
        if(!this.hudElement) return

        this.hudParts = {
            healthBar: this.hudElement.querySelector('.js-survival-health-bar'),
            healthValue: this.hudElement.querySelector('.js-survival-health-value'),
            wave: this.hudElement.querySelector('.js-survival-wave'),
            state: this.hudElement.querySelector('.js-survival-state'),
            left: this.hudElement.querySelector('.js-survival-left'),
            heatBar: this.hudElement.querySelector('.js-survival-heat-bar'),
            money: this.hudElement.querySelector('.js-survival-money'),
            score: this.hudElement.querySelector('.js-survival-score'),
        }

        this.defeatedElement = document.querySelector('.js-survival-defeated')
        this.defeatedWaveElement = document.querySelector('.js-survival-defeated-wave')

        this.bossElement = document.querySelector('.js-survival-boss')
        this.bossBarElement = document.querySelector('.js-survival-boss-bar')
    }

    setDefeatedOverlay(visible)
    {
        if(!this.defeatedElement) return

        if(visible && this.defeatedWaveElement)
            this.defeatedWaveElement.textContent = `Sóng ${this.wave} · ${this.kills} con · ${this.money}$`

        this.defeatedElement.classList.toggle('is-visible', visible)
    }

    /**
     * ⚠️ Chỉ CHẠM VÀO DOM KHI SỐ ĐỔI. Ghi `textContent` mỗi khung hình cho sáu
     * ô là ép trình duyệt tính lại bố cục 90 lần/giây cho một thứ mắt không
     * theo kịp — đúng loại rò rỉ hiệu năng không bao giờ hiện ra trong hồ sơ
     * WebGL vì nó nằm ở phía CSS.
     */
    updateHud()
    {
        if(!this.hudParts) return

        const health = Math.max(0, Math.round(this.health))
        if(health !== this.lastHealth)
        {
            this.lastHealth = health
            this.hudParts.healthValue.textContent = health
            this.hudParts.healthBar.style.transform = `scaleX(${health / this.maxHealth})`
            this.hudElement.classList.toggle('is-critical', health <= 30)
        }

        if(this.wave !== this.lastWave)
        {
            this.lastWave = this.wave
            this.hudParts.wave.textContent = this.wave
        }

        const left = this.phase === 'hunting'
            ? this.toSpawn + this.monsters.aliveCount
            : 0
        if(left !== this.lastLeft)
        {
            this.lastLeft = left
            this.hudParts.left.textContent = left
        }

        /**
         * Dòng trạng thái phải nói được MỘT điều mà người chơi không tự thấy:
         * đang có con nào bám được dấu mình không. Tắt đèn nấp sau nhà mà không
         * có phản hồi thì chỉ còn ngồi đoán — và một cơ chế không đọc được thì
         * coi như không tồn tại.
         */
        const hunted = this.phase === 'hunting'
            && this.monsters.monsters.some(m => !m.dead && m.sees)

        const state = this.phase === 'defeated'
            ? 'Gục'
            : (this.phase === 'preparing'
                ? `Nghỉ ${Math.ceil(Math.max(0, this.phaseTimer))}s`
                : (hunted ? 'Bị săn' : 'Đang nấp'))
        if(state !== this.lastState)
        {
            this.lastState = state
            this.hudParts.state.textContent = state
        }

        if(this.money !== this.lastMoney)
        {
            this.lastMoney = this.money
            this.hudParts.money.textContent = this.money
        }

        if(this.score !== this.lastScore)
        {
            this.lastScore = this.score
            this.hudParts.score.textContent = this.score
        }

        /**
         * ── Nhiệt của nòng súng ──────────────────────────────────────────────
         * Làm tròn về 2 chữ số rồi mới so: nhiệt đổi liên tục theo `delta` nên
         * so bằng `!==` là ghi DOM mỗi khung hình, đúng thứ `updateHud` sinh ra
         * để tránh.
         */
        const heat = Math.round(this.gun.heat * 100) / 100
        if(heat !== this.lastHeat)
        {
            this.lastHeat = heat
            this.hudParts.heatBar.style.transform = `scaleX(${heat})`
        }

        if(this.gun.jammed !== this.lastJammed)
        {
            this.lastJammed = this.gun.jammed
            this.hudElement.classList.toggle('is-jammed', this.gun.jammed)
        }

        // ── Cửa hàng: chỉ mở trong nhịp nghỉ ─────────────────────────────────
        const shopOpen = this.phase === 'preparing'
        if(shopOpen !== this.lastShopOpen)
        {
            this.lastShopOpen = shopOpen
            this.shopElement?.classList.toggle('is-visible', shopOpen)
            if(shopOpen) this.renderShop()
        }

        // Tiền đổi thì giá cả và món nào mua được cũng đổi theo
        if(shopOpen && this.money !== this.lastShopMoney)
        {
            this.lastShopMoney = this.money
            this.renderShop()
        }

        // ── Thanh máu quái trùm ──────────────────────────────────────────────
        const bossAlive = !!(this.boss && !this.boss.dead)
        if(bossAlive !== this.lastBossAlive)
        {
            this.lastBossAlive = bossAlive
            this.bossElement?.classList.toggle('is-visible', bossAlive)
        }

        if(bossAlive)
        {
            const ratio = Math.max(0, this.boss.hp / this.boss.maxHp)
            if(Math.abs(ratio - (this.lastBossRatio ?? -1)) > 0.005)
            {
                this.lastBossRatio = ratio
                this.bossBarElement.style.transform = `scaleX(${ratio})`
            }
        }
    }

    /**
     * Hai nút Off/On trong bảng Cài đặt.
     *
     * ⚠️ Tự nối ở ĐÂY chứ không ở `Options.js`: `Options` dựng ở dòng 110 của
     * `Game.js`, còn `World.step(1)` — chỗ dựng lớp này — chạy muộn hơn nhiều.
     * Đúng khuôn `VehicleRocket.setSettingsButtons()` và `Garage`.
     */
    setSettingsButtons()
    {
        const container = document.querySelector('.js-survival-modes')
        if(!container) return

        const buttons = [ ...container.querySelectorAll('button[data-mode]') ]

        const update = () =>
        {
            for(const button of buttons)
                button.classList.toggle('is-active', button.dataset.mode === this.preference.current)
        }

        update()
        this.events.on('preferenceChange', update)

        for(const button of buttons)
            button.addEventListener('click', () =>
            {
                this.game.audio.groups.get('click')?.play(true)
                this.preference.set(button.dataset.mode)
            })
    }
}
