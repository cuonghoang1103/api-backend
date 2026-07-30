import { Game } from './Game.js'

export class Options
{
    constructor()
    {
        this.game = Game.getInstance()
        this.element = this.game.menu.items.get('options').contentElement

        this.setSound()
        this.setMusic()
        this.setWeather()
        this.setQuality()
        this.setRespawn()
        this.setReset()
        this.setRenderer()
        this.setServer()
    }

    /**
     * Tiếng bấm nút — cùng một tiếng mà Menu và Modals dùng, để nút mới nghe
     * y hệt nút cũ của bản mẫu.
     *
     * ⚠️ `audio.groups` chỉ có sau `audio.init()` (nút Play ở màn chào mở khoá
     *    âm thanh), nên phải kiểm tra tồn tại — bấm trước lúc đó thì im lặng
     *    chứ không được ném lỗi.
     */
    playClick(isOpen = true)
    {
        const sound = this.game.audio.groups.get('click')
        if(sound)
            sound.play(isOpen)
    }

    setSound()
    {
        const element = this.element.querySelector('.js-audio-toggle')

        element.addEventListener('click', () =>
        {
            // Tiếng bấm phát TRƯỚC khi tắt tiếng, nếu không thì bấm tắt sẽ
            // không nghe thấy gì
            this.playClick(this.game.audio.mute.active)
            this.game.audio.mute.toggle()
        })
    }

    /**
     * Thời tiết: bấm đổi vòng Auto → Rain → Snow → Clear.
     *
     * Cùng kiểu nút với Quality (bấm là đổi, chữ trên nút cho biết đang ở đâu),
     * để bảng Cài đặt chỉ có một loại nút chứ không pha tạp.
     *
     * ⚠️ PHẢI hoãn một nhịp tick. `Game.js` dựng `Options` ở dòng 110 nhưng mãi
     *    dòng 117 mới dựng `Weather` — chạm vào `game.weather` ngay trong hàm
     *    dựng là ném lỗi và **chết cả game từ dòng 110 trở đi**: đo được, đối
     *    tượng `game` dừng lại ở đúng `resources`, không có `weather`, `world`
     *    hay `reveal` nào cả, mà màn hình thì chỉ đứng im không báo gì.
     */
    setWeather()
    {
        this.game.ticker.wait(1, () =>
        {
            const element = this.element.querySelector('.js-weather-toggle')
            const text = element.querySelector('span')
            const preference = this.game.weather.preference

            const update = () =>
            {
                text.textContent = preference.labels[preference.current]

                // Tô khác đi khi thời tiết đang bị ép, để nhìn là biết mình
                // đang không xem thời tiết tự nhiên nữa
                element.classList.toggle('is-success', preference.isForced())
            }

            update()
            this.game.weather.events.on('preferenceChange', update)

            element.addEventListener('click', () =>
            {
                this.playClick()
                preference.next()
            })
        })
    }

    /**
     * Nhạc nền: bật/tắt · âm lượng · đổi bài.
     *
     * ⚠️ Bảng Cài đặt được dựng ở `Game.js` TRƯỚC khi `audio.init()` chạy, nên
     *    lúc này `audio.playlist` thường CHƯA tồn tại. Vì vậy phải chờ sự kiện
     *    `playlistReady`. Gắn thẳng vào `audio.playlist` ở đây là lỗi rỗng.
     */
    setMusic()
    {
        const rowElements = [ ...this.element.querySelectorAll('.js-music-row') ]
        const toggleElement = this.element.querySelector('.js-music-toggle')
        const toggleText = toggleElement.querySelector('span')
        const volumeElement = this.element.querySelector('.js-music-volume')
        const volumeValueElement = this.element.querySelector('.js-music-volume-value')
        const nameElement = this.element.querySelector('.js-music-name')
        const previousElement = this.element.querySelector('.js-music-previous')
        const nextElement = this.element.querySelector('.js-music-next')

        // Chưa có nhạc thì giấu hẳn ba dòng đi, đừng để nút chết trong bảng
        const hide = () =>
        {
            for(const rowElement of rowElements)
                rowElement.classList.add('is-hidden')
        }

        hide()

        const bind = () =>
        {
            const playlist = this.game.audio.playlist

            if(!playlist || !playlist.hasSongs)
                return

            for(const rowElement of rowElements)
                rowElement.classList.remove('is-hidden')

            // Giao diện đi theo trạng thái thật của trình phát, không tự nhớ
            // riêng một bản sao — nhạc còn đổi bài do hết bài và do jukebox ở
            // khu Bowling nữa
            const update = () =>
            {
                toggleText.textContent = playlist.enabled ? 'On' : 'Off'
                toggleElement.classList.toggle('is-danger', !playlist.enabled)

                const percentage = Math.round(playlist.slider * 100)
                volumeElement.value = percentage
                volumeValueElement.textContent = `${percentage}%`

                nameElement.textContent = playlist.songs[playlist.index].name
            }

            update()
            this.game.audio.events.on('playlistChange', update)

            toggleElement.addEventListener('click', () =>
            {
                this.playClick(!playlist.enabled)
                playlist.toggle()
            })

            previousElement.addEventListener('click', () =>
            {
                this.playClick(false)
                playlist.previous()
            })

            nextElement.addEventListener('click', () =>
            {
                this.playClick()
                playlist.next()
            })

            // `input` chứ không phải `change`: nghe được ngay lúc đang kéo
            volumeElement.addEventListener('input', () =>
            {
                playlist.setVolume(parseInt(volumeElement.value) / 100)
            })
        }

        if(this.game.audio.initiated)
            bind()
        else
            this.game.audio.events.on('playlistReady', bind)
    }

    setQuality()
    {
        const element = this.element.querySelector('.js-quality-toggle')
        const text = element.querySelector('span')
        text.textContent = this.game.quality.level === 0 ? 'High' : 'Low'

        element.addEventListener('click', () =>
        {
            this.game.quality.changeLevel(this.game.quality.level === 0 ? 1 : 0)
        })

        this.game.quality.events.on('change', () =>
        {
            text.textContent = this.game.quality.level === 0 ? 'High' : 'Low'
        })
    }

    setRespawn()
    {
        const element = this.element.querySelector('.js-respawn')

        element.addEventListener('click', () =>
        {
            this.game.player.respawn()
            this.game.menu.close()
        })
    }

    setReset()
    {
        const element = this.element.querySelector('.js-reset')

        element.addEventListener('click', () =>
        {
            this.game.reset()
            this.game.menu.close()
        })
    }

    setRenderer()
    {        
        if(this.game.rendering.renderer.backend.isWebGLBackend)
        {
            const element = this.element.querySelector('.js-renderer')
            element.classList.remove('is-success')
            element.classList.add('is-danger')

            const text = element.querySelector('span')
            text.textContent = 'WebGL'

            const tooltip = element.querySelector('.js-tooltip')
            tooltip.innerHTML = /* html */`Your browser is <strong>not compatible</strong> with WebGPU resulting in performance loss`
        }
    }

    setServer()
    {
        const element = this.element.querySelector('.js-server')
        const text = element.querySelector('span')
        const tooltip = element.querySelector('.js-tooltip')
        
        const update = (connected) =>
        {
            if(connected)
            {
                element.classList.add('is-success')
                element.classList.remove('is-danger')
                
                text.textContent = 'Online'

                tooltip.innerHTML = /* html */`Enjoy the <strong>multiplayer</strong> features`
            }
            else
            {
                element.classList.remove('is-success')
                element.classList.add('is-danger')
                text.textContent = 'Offline'

                tooltip.innerHTML = /* html */`Should be back soon`
            }
        }

        update(this.game.server.connected)

        this.game.server.events.on('connected', () =>
        {
            update(true)
        })
        this.game.server.events.on('disconnected', () =>
        {
            update(false)
        })
    }
}