import { Events } from './Events.js'
import { Game } from './Game.js'

export class Quality
{
    constructor()
    {
        this.game = Game.getInstance()

        this.events = new Events()

        /**
         * ⚠️ iPadOS 13+ tự nhận là máy Mac ("Macintosh" trong User-Agent), nên
         * regex cũ cho iPad chạy CHẤT LƯỢNG CAO NHẤT (bóng 2048, DOF, bloom 5
         * tầng) ở độ nét 2x — nặng hơn cả máy tính. Mac thật không có cảm ứng
         * đa điểm, nên `maxTouchPoints > 1` + "Macintosh" = iPad.
         */
        const userAgent = navigator.userAgent
        const isIPadOS = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1
        this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) || isIPadOS
        this.isTouch = this.isMobile || (navigator.maxTouchPoints > 1 && matchMedia('(pointer: coarse)').matches)
        this.level = this.isMobile ? 1 : 0 // 0 = highest quality

        this.auto = { manual: false, running: false }

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.game.debug.panel.addFolder({
                title: '⚙️ Quality',
                expanded: false,
            })

            this.game.debug.addButtons(
                debugPanel,
                {
                    low: () =>
                    {
                        this.changeLevel(1)
                    },
                    high: () =>
                    {
                        this.changeLevel(0)
                    },
                },
                'change'
            )
        }
    }

    changeLevel(level = 0, auto = false)
    {
        // Người chơi tự chọn trong menu → tự hạ chất lượng không được cãi lại
        if(!auto)
            this.auto.manual = true

        // Same
        if(level === this.level)
            return
            
        this.level = level
        this.events.trigger('change', [ this.level ])
    }

    /**
     * TỰ HẠ CHẤT LƯỢNG khi máy không kham nổi (26/09/2026).
     *
     * Máy đủ khoẻ thì KHÔNG ĐỤNG GÌ — đồ hoạ giữ nguyên như thiết kế (M1 Max đo
     * ~80 FPS, ngưỡng dưới đây còn xa). Chỉ khi FPS trung vị dưới
     * `minFps` HAI cửa sổ đo liền nhau mới hạ MỘT bậc, theo thứ tự ít thấy
     * nhất trước:
     *   1. độ nét (pixel ratio) −0,25 mỗi bậc, không dưới 1
     *   2. chất lượng High → Low (bóng 512, bỏ DOF, bloom 2 tầng)
     * Chỉ hạ, không tự nâng lại — tránh nhấp nháy lên xuống. Dùng trung vị
     * thời gian khung (đo bằng `performance.now()`, vì `ticker.delta` bị kẹp ở
     * 1/30 nên không bao giờ thấy được FPS < 30) để một cú giật lẻ không kích
     * hoạt. Tab ẩn thì bỏ cửa sổ đó.
     */
    startAuto({ minFps = 30, windowMs = 3000 } = {})
    {
        if(this.auto.running)
            return
        this.auto.running = true

        const viewport = this.game.viewport
        let frames = []
        let last = performance.now()
        let windowStart = last
        let badWindows = 0
        let hidden = false

        const onVisibility = () => { if(document.hidden) hidden = true }
        document.addEventListener('visibilitychange', onVisibility)

        const stepDown = () =>
        {
            if(viewport.pixelRatio > 1)
            {
                viewport.pixelRatioMax = Math.max(1, viewport.pixelRatio - 0.25)
                viewport.measure()
                viewport.events.trigger('change')
                return true
            }

            if(this.level === 0)
            {
                this.changeLevel(1, true)
                return true
            }

            return false
        }

        const stop = () =>
        {
            this.game.ticker.events.off('tick', tick)
            document.removeEventListener('visibilitychange', onVisibility)
            this.auto.running = false
        }

        const tick = () =>
        {
            const now = performance.now()
            frames.push(now - last)
            last = now

            if(now - windowStart < windowMs)
                return

            const skip = hidden || document.hidden || frames.length < 5
            const sorted = frames.sort((a, b) => a - b)
            const median = sorted[sorted.length >> 1]
            frames = []
            windowStart = now
            hidden = false

            if(this.auto.manual)
                return stop()

            if(skip)
                return

            if(1000 / median < minFps)
                badWindows++
            else
                badWindows = 0

            if(badWindows >= 2)
            {
                badWindows = 0
                if(!stepDown())
                    stop()
            }
        }

        this.game.ticker.events.on('tick', tick)
    }
}