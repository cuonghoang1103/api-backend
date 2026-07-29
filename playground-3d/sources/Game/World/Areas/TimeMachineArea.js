import * as THREE from 'three/webgpu'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import { Fn, texture, uv, vec2, vec3, vec4 } from 'three/tsl'
import gsap from 'gsap'

/**
 * Cỗ máy thời gian.
 *
 * ⚠️ Bản gốc để nút này mở `https://2019.bruno-simon.com` — portfolio năm 2019
 *    của TÁC GIẢ GỐC. Giữ nguyên thì khách bấm vào sẽ rời sang trang cá nhân của
 *    người khác, nên đã đổi thành một trang của chính CuongThai.
 *
 * ➕ Muốn trỏ đi chỗ khác: sửa `TIME_MACHINE_URL` bên dưới. Để chuỗi rỗng thì
 *    nút biến mất hoàn toàn, cỗ máy chỉ còn là mô hình trang trí (cái TV vẫn
 *    đổi kênh khi tông xe vào — đó là phần riêng, không liên quan).
 */
const TIME_MACHINE_URL = 'https://cuongthai.com/games'

export class TimeMachineArea extends Area
{
    constructor(model)
    {
        super(model)

        this.setInteractivePoint()
        this.setTV()
        this.setAchievement()
    }

    setInteractivePoint()
    {
        if(!TIME_MACHINE_URL)
            return

        this.interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('interactivePoint')[0].position,
            'Time Machine',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                window.open(TIME_MACHINE_URL, '_blank')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setTV()
    {
        let canCollide = true
        let collideIndex = 0

        const screenTextures = [
            this.game.resources.timeMachineScreenFolioTexture,
            this.game.resources.timeMachineScreenMGSTexture,
        ]

        const alertSound = this.game.audio.register({
            path: 'sounds/tv/alert.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
            preload: true
        })
    

        const tv = this.references.items.get('tv')[0]
        tv.userData.object.physical.onCollision = (force, position) =>
        {
            if(canCollide)
            {
                canCollide = false
                collideIndex++
                material.outputNode = screenOutputNode()
                material.needsUpdate = true

                const clickSound = this.game.audio.groups.get('click')
                if(clickSound)
                    clickSound.play(true)

                if(collideIndex === 1)
                    alertSound.play()

                gsap.delayedCall(1, () =>
                {
                    canCollide = true
                })
            }
        }

        const screenMesh = this.references.items.get('screen')[0]

        const material = new THREE.MeshBasicNodeMaterial()
        const screenOutputNode = Fn(() =>
        {
            const baseUv = vec2(uv().x, uv().y)
            
            const textureColor = texture(screenTextures[collideIndex % screenTextures.length], baseUv)

            const stripes = texture(
                this.game.noises.perlin,
                vec2(
                    baseUv.y.add(this.game.ticker.elapsedScaledUniform.mul(0.1)),
                    0
                )
            ).r.smoothstep(0, 1)

            return vec4(textureColor.rgb.mul(stripes.mul(collideIndex % screenTextures.length === 0 ? 1 : 3).add(1)), 1)
        })
        material.outputNode = screenOutputNode()

        screenMesh.material = material
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'timeMachine')
        })
    }
}