import { Game } from '../Game.js'
import { VisualVehicle } from './VisualVehicle.js'
import { VEHICLES, DEFAULT_VEHICLE } from '../../data/garage.js'

/**
 * NHÀ XE — đổi phương tiện từ bảng Cài đặt.
 *
 * Nút được SINH RA từ `data/garage.js`, không gõ tay trong `index.html`: thêm
 * xe mới chỉ cần khai một dòng trong file dữ liệu. Đây là yêu cầu user đặt
 * ngày 1/8 ("để sau mình còn làm thêm xe cộ, vũ khí").
 *
 * ⚠️ PHẢI DỰNG TRONG `world.step(1)`, SAU `visualVehicle`, và tự nối nút lấy.
 * `Options` khởi tạo ở `Game.js` dòng ~110, còn nội dung thế giới mãi dòng ~199
 * mới dựng — nối từ `Options` thì lúc đó chưa có `world.visualVehicle` để đổi.
 * Bài học này đã trả giá ở `VehicleRocket.setSettingsButtons()`.
 */
export class Garage
{
    constructor()
    {
        this.game = Game.getInstance()
        this.currentId = DEFAULT_VEHICLE
        this.switching = false

        this.setButtons()
    }

    setButtons()
    {
        this.container = this.game.domElement.querySelector('.js-vehicle-modes')
        if(!this.container) return

        // Giữ lại tooltip, xoá mọi nút cũ rồi dựng lại theo danh sách
        for(const child of [ ...this.container.children ])
            if(!child.classList.contains('tooltip')) child.remove()

        this.buttons = []
        for(const vehicle of VEHICLES)
        {
            const button = document.createElement('button')
            button.className = 'button is-small'
            button.dataset.mode = vehicle.id
            button.textContent = vehicle.label
            if(vehicle.description) button.title = vehicle.description
            button.addEventListener('click', () => this.select(vehicle.id))

            this.container.append(button)
            this.buttons.push(button)
        }

        this.refreshButtons()
    }

    refreshButtons()
    {
        for(const button of this.buttons)
            button.classList.toggle('is-active', button.dataset.mode === this.currentId)
    }

    async select(id)
    {
        if(id === this.currentId || this.switching) return

        const vehicle = VEHICLES.find(item => item.id === id)
        if(!vehicle) return

        this.switching = true
        this.currentId = id
        this.refreshButtons()

        try
        {
            /**
             * Nạp model rồi TRÁO — đúng cách `KonamiCode.activate()` vẫn làm.
             *
             * `?cb=` là bắt buộc: `ResourcesLoader` cache theo URL, thiếu nó thì
             * lần đổi thứ hai về cùng một xe sẽ lấy bản cũ trong cache.
             *
             * Hậu tố `-compressed` thêm ở đây chứ không nhét vào `garage.js` —
             * file dữ liệu chỉ nên khai TÊN xe, không phải biết chuyện nén.
             */
            const suffix = import.meta.env.VITE_COMPRESSED ? '-compressed' : ''
            const resources = await this.game.resourcesLoader.load([
                [ 'vehicle', `${vehicle.path}${suffix}.glb?cb=${Date.now()}`, 'gltf' ],
            ])

            this.game.world.visualVehicle.destroy()
            this.game.world.visualVehicle = new VisualVehicle(resources.vehicle.scene)

            /**
             * ⚠️ Pháo trên nóc gắn vào `parts.chassis` của chiếc xe CŨ — chiếc
             * vừa bị `destroy()`. Không dựng lại thì khẩu pháo biến mất mà
             * không báo lỗi gì, và bấm X không ra đạn.
             */
            this.game.world.vehicleRocket?.reattach?.()

            const sound = this.game.audio.groups.get('click')
            if(sound) sound.play(true)
        }
        catch(error)
        {
            console.warn('[Garage] không đổi được xe:', error)
        }

        this.switching = false
    }
}
