import * as THREE from 'three/webgpu'
import gsap from 'gsap'
import { atan, color, float, positionLocal, uniform } from 'three/tsl'
import { Game } from '../Game.js'

/**
 * CỔNG CẦU VỒNG — hiện ra sau cơn mưa, lái xe chui qua được.
 *
 * ─── VÌ SAO LÀ CỔNG CHỨ KHÔNG PHẢI CẦU VỒNG TRÊN TRỜI ───
 * Đã thử cầu vồng thật (vòng cung lớn treo phía chân trời) và ĐO ra là không
 * xong: chiếu toạ độ đỉnh cung ra màn hình thấy nó luôn rơi ở y > 1 trong khi
 * mép trên khung hình là 1,0 — với MỌI bán kính 6→22 và MỌI khoảng cách 10→70,
 * càng đẩy xa càng vọt cao. Lý do: máy quay của thế giới này cao 22 đơn vị và
 * CHÚC XUỐNG nhìn mặt đất, khung hình gần như không có khoảng trời (nền trời chỉ
 * là dải chuyển màu vẽ ở nền màn hình, không phải bầu trời thật).
 *
 * Nên cầu vồng ở đây là một CỔNG đứng hẳn trong thế giới, cỡ vừa khung hình, và
 * lái xe chui qua được. Hợp với thế giới đồ chơi này hơn, và quan trọng nhất là
 * NHÌN THẤY ĐƯỢC.
 *
 * ─── VÌ SAO LÀ ỐNG CHỨ KHÔNG PHẢI DẢI PHẲNG ───
 * Cổng đứng yên một chỗ để người chơi còn lái tới. Mà đứng yên thì người chơi sẽ
 * vòng ra sau lưng nó — một dải phẳng nhìn nghiêng là biến mất. Nên mỗi màu là
 * một vòng ỐNG (torus), bảy vòng lồng nhau: nhìn từ hướng nào cũng ra cầu vồng.
 */

// Bảy màu, từ NGOÀI vào TRONG — đúng thứ tự cầu vồng thật (đỏ ngoài, tím trong)
const COLORS = [
    '#ff3b2f', // đỏ
    '#ff8b2f', // cam
    '#ffe14f', // vàng
    '#4fd93a', // lục
    '#2fb6ff', // lam
    '#3f5bff', // chàm
    '#a24fff', // tím
]

/**
 * Kích thước — chọn theo số ĐO chứ không ước.
 *
 * Đo bằng `Vector3.project`: cung bán kính 6 đặt cách 10 đơn vị cho đỉnh ở
 * y = 1,02 và hai chân ở x = ±0,68, tức vừa khít khung hình. Nên vòng ngoài
 * cùng để 6,6 và cổng đứng cách người chơi 14.
 *
 * Lòng cổng rộng ~9, cao ~4,5 — xe rộng chừng 2 và cao chừng 1,5 nên chui thoải
 * mái, không cần căn.
 */
const OUTER_RADIUS = 6.6
const RING_STEP = 0.34 // khoảng cách giữa hai vòng màu
const TUBE_RADIUS = 0.17
const DISTANCE = 14 // cổng mọc lên cách người chơi bao xa

// Ngưỡng kích hoạt, đọc từ `weather.rain.value`
const RAIN_ON = 0.35 // phải mưa to hơn mức này thì mới tính là "đã có mưa"
const RAIN_OFF = 0.12 // rồi tạnh xuống dưới mức này thì cổng mọc lên

const FADE_IN = 2.5
const HOLD = 40 // đứng đủ lâu để người chơi kịp lái tới
const FADE_OUT = 5

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
        // một tween `overwrite: true` mới — cổng mờ dần mãi mà không bao giờ tắt
        // hẳn, và `visible` không bao giờ về false.
        this.state = 'idle'

        this.setGroup()

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

    setGroup()
    {
        this.group = new THREE.Group()
        this.group.visible = false
        this.game.scene.add(this.group)

        for(let i = 0; i < COLORS.length; i++)
        {
            const radius = OUTER_RADIUS - i * RING_STEP

            // Nửa vòng ống (0 → π): chân trái, vòng qua đỉnh, xuống chân phải
            const geometry = new THREE.TorusGeometry(radius, TUBE_RADIUS, 8, 96, Math.PI)

            /**
             * Mờ dần ở hai CHÂN cổng để cầu vồng tan vào mặt đất thay vì cắm
             * xuống như ống nhựa. `atan(y, x)` trả 0…π đúng cho nửa trên.
             */
            const angle = atan(positionLocal.y, positionLocal.x)
            const endsFade = angle.smoothstep(0, 0.45).mul(float(Math.PI).sub(angle).smoothstep(0, 0.45))

            /**
             * ⚠️ Pha trộn THƯỜNG chứ không phải CỘNG SÁNG.
             *
             * Đã thử cộng sáng trước (cầu vồng là ánh sáng mà) — đo bằng ảnh
             * chụp: trên nền đất cam rực của thế giới này, cộng sáng đẩy mọi màu
             * bão hoà về TRẮNG, cầu vồng thành vệt bạc nhìn không ra gì.
             */
            const material = new THREE.MeshBasicNodeMaterial({
                transparent: true,
                depthWrite: false,
            })
            material.colorNode = color(COLORS[i])
            material.opacityNode = endsFade.mul(this.strength).mul(0.9)

            const mesh = new THREE.Mesh(geometry, material)
            // Là ÁNH SÁNG, không phải vật: không đổ bóng, không nhận bóng, không
            // có thân vật lý — xe chui thẳng qua chứ không đâm phải
            mesh.castShadow = false
            mesh.receiveShadow = false
            mesh.userData.preventPreRender = true
            this.group.add(mesh)
        }
    }

    show()
    {
        if(this.holdCall)
        {
            this.holdCall.kill()
            this.holdCall = null
        }

        /**
         * Chốt vị trí MỘT LẦN, ngay lúc mọc lên, rồi đứng yên.
         *
         * ⚠️ Không cho nó bám theo người chơi. Cầu vồng thật thì có bám thật,
         *    nhưng cái này là CỔNG để lái xuyên qua — bám theo thì đuổi cả đời
         *    không tới, hỏng mất điều hay nhất của nó.
         */
        const focus = this.game.view.focusPoint.position
        const camera = this.game.view.camera.position

        let ax = focus.x - camera.x
        let az = focus.z - camera.z
        const length = Math.hypot(ax, az)

        // ⚠️ Chốt chặn chia 0: máy quay dựng thẳng đỉnh đầu thì hướng ngang bằng
        //    0 ⇒ NaN chảy vào ma trận ⇒ mất cả vòng lặp vẽ mà không báo gì
        if(length < 0.001)
            return

        ax /= length
        az /= length

        // Mọc lên phía TRƯỚC mặt, và mặt phẳng cổng vuông góc hướng đi để lái
        // thẳng là chui qua
        this.group.position.set(focus.x + ax * DISTANCE, 0, focus.z + az * DISTANCE)
        this.group.rotation.y = Math.atan2(ax, az)

        this.state = 'showing'
        this.group.visible = true

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
                this.group.visible = false
            }
        })
    }

    update()
    {
        const weather = this.game.weather
        const rain = weather.rain.value

        /**
         * Máy trạng thái: phải TỪNG mưa to rồi mới tạnh thì cầu vồng mới có
         * nghĩa. Chỉ kiểm "trời đang tạnh" thì cổng mọc suốt ngày.
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

            /**
             * Điều kiện để cầu vồng có lý: phải có NẮNG (không phải ban đêm) và
             * không phải trời tuyết — tuyết thì hạt là băng, không tán sắc ra
             * cầu vồng được.
             */
            // ⚠️ `isNight()` chứ không phải cờ `intervalEvents` — cờ đó không
            //    biết người chơi đã ép giờ trong Cài đặt (xem `DayCycles.isNight`)
            const isNight = this.game.dayCycles.isNight()
            const isSnowy = weather.snow.value > 0.1

            if(!isNight && !isSnowy)
                this.show()
        }
    }
}
