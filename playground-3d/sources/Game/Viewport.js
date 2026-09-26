import { Events } from './Events.js'
import { Game } from './Game.js'

export class Viewport
{
    constructor(domElement)
    {
        this.domElement = domElement

        this.events = new Events()

        /**
         * Độ nét tối đa. Màn điện thoại/iPad có DPR 2–3, vẽ đủ 2x là gấp 4
         * lần số điểm ảnh so với 1x cho một màn hình vài inch — 1,5x trông gần
         * như y hệt mà nhẹ hơn ~44%. Máy tính giữ 2x như cũ.
         * `Quality` có thể hạ tiếp khi máy không kham nổi (xem `startAuto`).
         */
        this.pixelRatioMax = Game.getInstance()?.quality?.isMobile ? 1.5 : 2
        
        this.measure()
        this.setResize()
    }

    measure()
    {
        const bounding = this.domElement.getBoundingClientRect()

        this.width = bounding.width
        this.height = bounding.height
        this.ratio = this.width / this.height

        this.pixelRatioPure = window.devicePixelRatio
        this.pixelRatio = Math.min(this.pixelRatioPure, this.pixelRatioMax)
    }

    setResize()
    {
        const throttleDuration = 400
        let throttleTimeout = null
        addEventListener('resize', () =>
        {
            this.measure()
            this.events.trigger('change')

            if(throttleTimeout)
            {
                clearTimeout(throttleTimeout)
            }

            throttleTimeout = setTimeout(() =>
            {
                throttleTimeout = null
                this.events.trigger('throttleChange')
            }, throttleDuration)
        })
    }
}