import * as THREE from 'three/webgpu'
import gsap from 'gsap'
import { atan, float, positionLocal, uniform, vec3 } from 'three/tsl'
import { Game } from '../Game.js'

/**
 * Cầu vồng hiện ra sau cơn mưa.
 *
 * ─── VÌ SAO LÀ CUNG THẤP VÀ RỘNG, KHÔNG PHẢI VÒM CAO ───
 * Máy quay của thế giới này nhìn TỪ TRÊN XUỐNG: đo được lúc chơi thật —
 * máy quay cao 22 đơn vị, ngửa xuống, vùng nhìn bán kính chỉ ~29, và **khung
 * hình không hề có bầu trời** (nền trời chỉ là dải chuyển màu vẽ ở nền màn
 * hình, `Fog.js` đặt `scene.backgroundNode`). Treo cầu vồng trên trời là
 * người chơi KHÔNG BAO GIỜ thấy.
 *
 * Nên cầu vồng ở đây dựng đúng như cầu vồng thật nhìn từ gần chân trời: một
 * vòng tròn bán kính lớn nhưng **tâm nằm SÂU DƯỚI mặt đất**, nên chỉ chỏm trên
 * nhô lên — ra một dải cong thấp, rộng, vắt ngang khung hình. Vừa đúng vật lý
 * (tâm cầu vồng thật là điểm đối mặt trời, luôn nằm dưới đường chân trời khi
 * mặt trời còn trên cao), vừa là hình dáng DUY NHẤT nhìn thấy được ở góc máy
 * này.
 *
 * ─── VỊ TRÍ ───
 * Cầu vồng thật không đứng yên một chỗ: nó luôn nằm ở phía ĐỐI DIỆN mặt trời so
 * với người nhìn, nên đi tới đâu nó theo tới đó. Ở đây cũng vậy — bám theo tâm
 * nhìn và xoay theo hướng nắng. Nhờ thế lái xe kiểu gì cũng thấy, không cần may
 * mắn đi đúng chỗ.
 */

/**
 * Hình dáng — CÁC SỐ NÀY ĐO RA CHỨ KHÔNG PHẢI ƯỚC.
 *
 * Chiếu toạ độ đỉnh cung ra màn hình (`Vector3.project`) mới thấy: cung bán
 * kính 30 đặt cách 42 đơn vị thì đỉnh rơi ở **y = 2,9** trong khi mép trên màn
 * hình chỉ là 1,0, hai chân ở **x = ±2,1** — tức to gấp ~3 lần khung hình, nên
 * chụp màn hình chỉ thấy… không có gì. Khung nhìn ở khoảng cách tâm nhìn chỉ
 * cao chừng 17 đơn vị, nên cầu vồng muốn LỌT KHUNG thì phải cỡ này.
 *
 * nửa bề rộng = √(RADIUS² − CENTER_Y²) ≈ 15,9 · chiều cao = RADIUS + CENTER_Y = 14
 */
const RADIUS = 13
const CENTER_Y = -0.5
const DISTANCE = 10 // đứng cách tâm nhìn bao xa, về phía trước mặt máy quay
/**
 * Bề dày dải màu — dày hơn cầu vồng thật RẤT NHIỀU, và đó là chủ ý.
 *
 * Cầu vồng thật rộng chừng 5% bán kính. Nhưng cả vòng cung ở đây bị bẹp xuống
 * còn 0,3 theo chiều đứng (xem FLATTEN), mà bẹp thì bẹp luôn cả bề dày dải: để
 * 1,6 thì ở đỉnh cung dải chỉ còn dày 0,48 đơn vị — chụp màn hình ra đúng một
 * sợi chỉ mờ, nhìn không ra cầu vồng. Để 5 thì ở đỉnh còn ~1,5, đủ đọc ra bảy màu.
 */
const BAND = 5

/**
 * Bẹp cung theo chiều đứng.
 *
 * Đo được: cung tròn đều thì ĐỈNH luôn rơi ở toạ độ màn hình y > 1 (mép trên là
 * 1) với MỌI bán kính và MỌI khoảng cách đã thử — càng đẩy xa càng vọt cao, vì
 * máy quay chúc xuống nên vật càng xa càng trôi lên đỉnh khung. Nói cách khác
 * khung hình gần như KHÔNG có khoảng trời.
 *
 * Bẹp xuống 0,3 là cách duy nhất để cả vòng cung nằm trong khung — và cũng
 * chính là hình mà mắt nhìn TỪ TRÊN XUỐNG sẽ thấy ở một vòng cung dựng đứng, nên
 * không hề phản vật lý.
 */
const FLATTEN = 0.3

// Ngưỡng kích hoạt, đọc từ `weather.rain.value`
const RAIN_ON = 0.35 // phải mưa to hơn mức này thì mới tính là "đã có mưa"
const RAIN_OFF = 0.12 // rồi tạnh xuống dưới mức này thì cầu vồng hiện ra

const FADE_IN = 3
const HOLD = 22
const FADE_OUT = 6

export class Rainbow
{
    constructor()
    {
        this.game = Game.getInstance()

        this.strength = uniform(0)
        this.wasRaining = false
        this.holdCall = null

        // 'idle' | 'showing' | 'hiding'. ⚠️ PHẢI có cờ này: nếu chỉ kiểm
        // `strength > 0` rồi gọi `hide()` thì mỗi khung hình lại khởi động lại
        // một tween `overwrite: true` mới — cầu vồng mờ dần mãi mà không bao giờ
        // tắt hẳn, và `mesh.visible` không bao giờ về false.
        this.state = 'idle'

        this.setMesh()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 10)

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '🌈 Rainbow',
                expanded: false,
            })
            this.debugPanel.addBinding(this.strength, 'value', { label: 'strength', min: 0, max: 1, step: 0.01 })
            this.debugPanel.addButton({ title: 'show' }).on('click', () => this.show())
            this.debugPanel.addButton({ title: 'hide' }).on('click', () => this.hide())
        }
    }

    setMesh()
    {
        const inner = RADIUS - BAND * 0.5
        const outer = RADIUS + BAND * 0.5

        // Vành phẳng nửa trên (0 → π). Dùng RingGeometry chứ KHÔNG dùng Torus:
        // torus là cái ống, nhìn nghiêng sẽ thấy dải màu cuộn vòng quanh ống và
        // nửa sau lộn ngược thứ tự màu. Cầu vồng phải là dải PHẲNG.
        const geometry = new THREE.RingGeometry(inner, outer, 160, 1, 0, Math.PI)

        // Vị trí trong dải: 0 ở mép trong (tím), 1 ở mép ngoài (đỏ) — đúng thứ
        // tự của cầu vồng thật.
        const t = positionLocal.xy.length().sub(inner).div(outer - inner).clamp(0, 1)

        let spectrum = vec3(0.45, 0.15, 0.85) // tím
        spectrum = spectrum.mix(vec3(0.16, 0.40, 0.96), t.smoothstep(0.04, 0.24)) // lam
        spectrum = spectrum.mix(vec3(0.16, 0.85, 0.88), t.smoothstep(0.24, 0.41)) // xanh lơ
        spectrum = spectrum.mix(vec3(0.36, 0.90, 0.26), t.smoothstep(0.41, 0.57)) // lục
        spectrum = spectrum.mix(vec3(0.98, 0.90, 0.22), t.smoothstep(0.57, 0.72)) // vàng
        spectrum = spectrum.mix(vec3(1.00, 0.56, 0.13), t.smoothstep(0.72, 0.86)) // cam
        spectrum = spectrum.mix(vec3(1.00, 0.26, 0.18), t.smoothstep(0.86, 1.00)) // đỏ

        // Mờ dần ở hai mép dải, để không có đường viền cứng
        const acrossFade = t.smoothstep(0, 0.2).mul(t.oneMinus().smoothstep(0, 0.2))

        // Mờ dần ở hai chân cung, để cầu vồng tan vào không khí thay vì bị cắt
        // cụt. `atan(y, x)` trả 0…π đúng cho nửa trên.
        const angle = atan(positionLocal.y, positionLocal.x)
        const endsFade = angle.smoothstep(0, 0.6).mul(float(Math.PI).sub(angle).smoothstep(0, 0.6))

        /**
         * ⚠️ Pha trộn THƯỜNG chứ không phải CỘNG SÁNG.
         *
         * Đã thử cộng sáng trước (cầu vồng là ánh sáng mà) — đo bằng ảnh chụp:
         * trên nền đất cam rực của thế giới này, cộng sáng đẩy mọi màu bão hoà
         * về TRẮNG, cầu vồng thành một vệt bạc mờ nhìn không ra gì. Pha trộn
         * thường giữ được đủ bảy màu.
         */
        const material = new THREE.MeshBasicNodeMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
        })
        material.colorNode = spectrum
        material.opacityNode = acrossFade.mul(endsFade).mul(this.strength).mul(0.8)

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.scale.set(1, FLATTEN, 1)
        this.mesh.visible = false
        this.mesh.frustumCulled = false
        // Không dựng trước và không đổ/nhận bóng: đây là ÁNH SÁNG, không phải vật
        this.mesh.userData.preventPreRender = true
        this.mesh.castShadow = false
        this.mesh.receiveShadow = false
        this.game.scene.add(this.mesh)
    }

    show()
    {
        if(this.holdCall)
        {
            this.holdCall.kill()
            this.holdCall = null
        }

        this.state = 'showing'
        this.mesh.visible = true

        gsap.to(this.strength, { value: 1, duration: FADE_IN, ease: 'power1.out', overwrite: true })

        this.holdCall = gsap.delayedCall(FADE_IN + HOLD, () =>
        {
            this.holdCall = null
            this.hide()
        })
    }

    hide()
    {
        if(this.state === 'idle' || this.state === 'hiding')
            return

        if(this.holdCall)
        {
            this.holdCall.kill()
            this.holdCall = null
        }

        this.state = 'hiding'

        gsap.to(this.strength, {
            value: 0,
            duration: FADE_OUT,
            ease: 'power1.in',
            overwrite: true,
            onComplete: () =>
            {
                this.state = 'idle'
                this.mesh.visible = false
            }
        })
    }

    update()
    {
        const weather = this.game.weather
        const rain = weather.rain.value

        /**
         * Máy trạng thái: phải TỪNG mưa to rồi mới tạnh thì cầu vồng mới có
         * nghĩa. Chỉ kiểm "trời đang tạnh" thì cầu vồng hiện suốt ngày.
         */
        if(rain > RAIN_ON)
        {
            this.wasRaining = true

            // Đang mưa to thì không có cầu vồng — nếu đang hiện thì thu lại
            this.hide()
        }
        else if(this.wasRaining && rain < RAIN_OFF)
        {
            this.wasRaining = false

            // Điều kiện để cầu vồng có lý: phải có NẮNG (không phải ban đêm) và
            // không phải trời tuyết — tuyết thì hạt là băng, không tán sắc ra
            // cầu vồng được.
            const isNight = this.game.dayCycles.intervalEvents.get('night')?.inInterval
            const isSnowy = weather.snow.value > 0.1

            if(!isNight && !isSnowy)
                this.show()
        }

        if(!this.mesh.visible)
            return

        /**
         * Đứng phía TRƯỚC người chơi, tính theo hướng máy quay đang nhìn, và
         * mặt phẳng cung quay về phía máy quay.
         *
         * ⚠️ Không xoay theo hướng NẮNG như cầu vồng thật. Đã thử: máy quay ở
         *    đây nhìn từ trên xuống, cung dựng đứng theo trục nắng thì gần như
         *    nhìn cạnh-on — mỏng dính hoặc mất hẳn. Cầu vồng thật ra cũng LUÔN
         *    quay mặt về người nhìn (tâm của nó là điểm đối mặt trời tính từ
         *    mắt người), nên bám máy quay mới là đúng tinh thần, không phải
         *    chống lại vật lý.
         */
        const focus = this.game.view.focusPoint.position
        const camera = this.game.view.camera.position

        let ax = focus.x - camera.x
        let az = focus.z - camera.z
        const length = Math.hypot(ax, az)

        // ⚠️ Chốt chặn chia 0: máy quay dựng thẳng đỉnh đầu thì hướng ngang
        //    bằng 0 ⇒ NaN chảy vào ma trận ⇒ mất cả vòng lặp vẽ mà không báo gì
        if(length < 0.001)
            return

        ax /= length
        az /= length

        this.mesh.position.set(focus.x + ax * DISTANCE, CENTER_Y, focus.z + az * DISTANCE)
        this.mesh.rotation.y = Math.atan2(-ax, -az)
    }
}
