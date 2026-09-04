import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import { VisualVehicle } from './World/VisualVehicle.js'

export class KonamiCode
{
    constructor(once = false)
    {
        this.game = Game.getInstance()

        let index = 0
        this.activationCount = 0
        const sequence = [
            [ 'ArrowUp', 'KeyW' ],
            [ 'ArrowUp', 'KeyW' ],
            [ 'ArrowDown', 'KeyS' ],
            [ 'ArrowDown', 'KeyS' ],
            [ 'ArrowLeft', 'KeyA' ],
            [ 'ArrowRight', 'KeyD' ],
            [ 'ArrowLeft', 'KeyA' ],
            [ 'ArrowRight', 'KeyD' ],
            [ 'KeyB' ],
            [ 'KeyQ', 'KeyA' ],
        ]

        const callback = (event) =>
        {
            const sequenceItem = sequence[index]

            if(sequenceItem.indexOf(event.code) !== -1)
            {
                index++

                if(index === sequence.length)
                {
                    this.activate()

                    if(once)
                        document.removeEventListener('keydown', callback)

                    index = 0
                }
            }
            else
            {
                index = 0
            }
        }
        document.addEventListener('keydown', callback)
    }

    async activate()
    {
        /**
         * ⚠️ Hậu tố `-compressed` PHẢI thêm ở đây, y như `Garage.js` đang làm.
         *
         * Trước 04/09/2026 chỗ này gõ cứng `'vehicle/default.glb'` — nó là nơi
         * DUY NHẤT trong mã bỏ qua công tắc `VITE_COMPRESSED` một cách vô ý
         * (mấy chỗ .png ở `LabArea`/`ProjectsArea` là ngoại lệ CÓ CHỦ Ý, đã ghi
         * rõ tại chỗ). Hệ quả: bản production vẫn tải file thô 0,23 MB thay vì
         * bản nén 0,03 MB, và quan trọng hơn — nó buộc hai file thô phải nằm
         * lại trong ảnh deploy chỉ để phục vụ một quả trứng phục sinh.
         *
         * Lỗi kiểu này KHÔNG hiện ra lúc dựng và cũng không hiện lúc chơi bình
         * thường: chỉ ai gõ đúng mã Konami mới chạm tới, nên nó câm cho tới lúc
         * có người gặp.
         */
        const suffix = import.meta.env.VITE_COMPRESSED ? '-compressed' : ''
        const files = [
            'vehicle/oldSchool',
            'vehicle/default'
        ]

        const resources = await this.game.resourcesLoader.load([
            [ 'vehicle', `${files[this.activationCount % 2]}${suffix}.glb?cb=${this.activationCount}`, 'gltf' ],
        ])
            
        this.game.world.visualVehicle.destroy()
        this.game.world.visualVehicle = new VisualVehicle(resources.vehicle.scene)

        if(this.game.world.confetti)
        {
            this.game.world.confetti.pop(this.game.player.position.clone())
            this.game.world.confetti.pop(this.game.player.position.clone().add(new THREE.Vector3(1, -1, 1.5)))
            this.game.world.confetti.pop(this.game.player.position.clone().add(new THREE.Vector3(1, -1, -1.5)))
        }

        this.activationCount++

        // Achievement
        this.game.achievements.setProgress('konami', 1)
    }
}