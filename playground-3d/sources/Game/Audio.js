import * as THREE from 'three/webgpu'
import { Howl, Howler } from 'howler'
import { Game } from './Game.js'
import { remap, remapClamp, clamp } from './utilities/maths.js'
import gsap from 'gsap'
import { Events } from './Events.js'
import musicsData from '../data/musics.js'

export class Audio
{
    constructor()
    {
        this.game = Game.getInstance()

        this.initiated = false
        this.groups = new Map()
        this.events = new Events()

        this.setMute()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    init()
    {
        this.initiated = true

        this.setPlaylist()
        this.setAmbiants()
        this.setOneOffs()

        // Play all autoplays that didn't start because not initated
        this.groups.forEach((group, name) =>
        {
            for(const item of group.items)
            {
                if(item.autoplay && !item.playing)
                    item.play()
            }
        })
    }

    register(options = {})
    {
        // Group
        const groupName = options.group ?? 'all'
        let group = this.groups.get(groupName)

        if(!group)
        {
            group = {}
            group.items = []
            group.lastPlayedId = -1
            group.playRandomNext = (...parameters) =>
            {
                const delta = 1 + Math.floor(Math.random() * (group.items.length - 2))
                const id = (group.lastPlayedId + delta) % group.items.length

                const item = group.items[id]
                item.play(...parameters)
            }
            group.play = (...parameters) =>
            {
                const id = (group.lastPlayedId + 1) % group.items.length

                const item = group.items[id]
                item.play(...parameters)
            }
            this.groups.set(groupName, group)
        }

        const item = {}
        item.howl = new Howl({
            src: [ options.path ],
            pool: 2,
            autoplay: (this.initiated && options.autoplay) ?? false,
            loop: options.loop ?? false,
            volume: options.volume ?? 0.5,
            preload: options.preload ?? true,
            onloaderror: () =>
            {
                console.error(`Audio > Load error > ${options.path}`, options)
            },
            onend: () =>
            {
                item.playing = false
            }
        })
        item.positions = options.positions ?? null
        if(item.positions !== null && !(item.positions instanceof Array))
            item.positions = [ item.positions ]
        item.distanceFade = options.distanceFade ?? null
        item.rate = options.rate ?? 1
        item.volume = options.volume ?? 0.5
        item.antiSpam = options.antiSpam ?? 0.1
        item.lastPlay = -Infinity
        item.onPlaying = options.onPlaying ?? null
        item.onPlay = options.onPlay ?? null
        item.loaded = options.preload ?? true
        item.autoplay = options.autoplay ?? false
        item.playing = (this.initiated && options.autoplay) ?? false
        item.id = group.items.length

        item.play = (...parameters) =>
        {
            if(!this.initiated)
            {
                return
            }

            // Load
            if(!item.loaded)
            {
                item.loaded = true
                item.howl.load()
            }

            // Anti spam
            if(item.antiSpam)
            {
                if(this.game.ticker.elapsed - item.lastPlay < item.antiSpam)
                    return
            }

            // Play binding
            if(typeof item.onPlay === 'function')
                item.onPlay(item, ...parameters)
                
            // Play
            item.howl.play()

            // Save last play for anti spam
            item.lastPlay = this.game.ticker.elapsed
            item.playing = true

            // Save for group
            group.lastPlayedId = item.id
        }

        group.items.push(item)

        return item
    }

    setPlaylist()
    {
        this.playlist = {}

        // Danh sách nhạc nền nằm ở `sources/data/musics.js` — thêm/bớt bài chỉ
        // sửa đúng file đó. Hiệu ứng âm thanh KHÔNG liên quan tới đây: chúng ở
        // `setAmbiants()` và `setOneOffs()` bên dưới.
        this.playlist.songs = musicsData
        this.playlist.hasSongs = this.playlist.songs.length > 0

        // Chạy TUẦN TỰ từ bài đầu tới bài cuối rồi quay lại bài đầu.
        // ⚠️ Bản mẫu bốc bài theo đồng hồ (`Date.now()/1000/60/3 % length`) nên
        //    mỗi lần mở trang lại rơi vào giữa danh sách. Đã bỏ hẳn cách đó.
        this.playlist.index = 0
        this.playlist.current = null
        this.playlist.switching = false
        this.playlist.pendingCall = null

        /**
         * ÂM LƯỢNG
         *
         * `slider` là con số người dùng kéo (0..1) và cũng là con số hiện trên
         * bảng Cài đặt. Âm lượng thật = `slider × MAX_VOLUME`, tuyến tính, nên
         * số phần trăm hiện ra ĐÚNG là phần trăm — không bịa.
         *
         * `MAX_VOLUME = 0.15` là TRẦN, cố ý đặt thấp: đây là NHẠC NỀN, không phải
         * nhạc chính. Đối chiếu tiếng nền của bản mẫu — chim 0.3 · dế 0.65 · gió
         * 0.7 · lửa 0.8 · mưa 1.0 — thì kéo hết cỡ nhạc vẫn chỉ bằng MỘT NỬA
         * tiếng chim. Nhạc không bao giờ át được tiếng game, dù kéo tới đâu.
         *
         * Mặc định `slider = 0.23` ⇒ âm lượng thật **0,0345**.
         */
        this.playlist.MAX_VOLUME = 0.15
        this.playlist.defaultSlider = 0.23
        this.playlist.slider = this.playlist.defaultSlider
        this.playlist.enabled = true

        // Lựa chọn cũ của người dùng (nếu có)
        const storedVolume = parseFloat(localStorage.getItem('musicVolume'))
        if(!Number.isNaN(storedVolume))
            this.playlist.slider = clamp(storedVolume, 0, 1)

        if(localStorage.getItem('musicToggle') === '0')
            this.playlist.enabled = false

        this.playlist.getVolume = () => this.playlist.slider * this.playlist.MAX_VOLUME

        for(const song of this.playlist.songs)
        {
            song.loaded = false
            song.sound = new Howl({
                src: [ song.path ],
                pool: 0,
                autoplay: false,
                loop: false,
                preload: false,
                volume: this.playlist.getVolume(),
                onload: () =>
                {
                    song.loaded = true
                },
                onend: () =>
                {
                    this.playlist.next()
                }
            })
        }

        /**
         * Nhảy tới một bài bất kỳ.
         *
         * Chỉ số đổi NGAY để bảng Cài đặt cập nhật tên bài tức thì, còn nhạc mới
         * vào sau `delay` giây — đúng nhịp tiếng đổi đĩa của bản mẫu (jukebox ở
         * khu Bowling cũng đi qua đây, nên hai chỗ cùng một cảm giác).
         */
        this.playlist.goTo = (index, delay = 3) =>
        {
            if(!this.playlist.hasSongs)
                return

            const count = this.playlist.songs.length
            this.playlist.index = ((index % count) + count) % count // luôn dương

            this.events.trigger('playlistChange')

            // Tắt nhạc thì chỉ đổi bài trên giấy tờ, không phát gì
            if(!this.playlist.enabled)
                return

            if(this.playlist.switching)
                return

            this.playlist.switching = true

            // Disc change sound
            this.game.audio.groups.get('discChange').play()

            // Old one
            if(this.playlist.current)
                this.playlist.current.sound.stop()

            this.playlist.pendingCall = gsap.delayedCall(delay, () =>
            {
                this.playlist.pendingCall = null

                // New one
                this.playlist.current = this.playlist.songs[this.playlist.index]

                if(!this.playlist.current.loaded)
                    this.playlist.current.sound.load()

                this.playlist.current.sound.volume(this.playlist.getVolume())
                this.playlist.current.sound.play()

                // Notification
                const html = /* html */`
                    <div class="top">
                        <div class="title">Now playing<br /><span class="song-name">${this.playlist.current.name}</span></div>
                        <div class="music-note-icon"></div>
                    </div>
                `

                this.game.notifications.show(
                    html,
                    'song',
                    5,
                    // () => {
                    // }
                )

                this.playlist.switching = false
            })
        }

        this.playlist.next = () =>
        {
            this.playlist.goTo(this.playlist.index + 1)
        }

        this.playlist.previous = () =>
        {
            this.playlist.goTo(this.playlist.index - 1)
        }

        this.playlist.play = () =>
        {
            if(!this.playlist.hasSongs || !this.playlist.enabled)
                return

            this.playlist.current = this.playlist.songs[this.playlist.index]

            if(!this.playlist.current.loaded)
                this.playlist.current.sound.load()

            this.playlist.current.sound.volume(this.playlist.getVolume())
            this.playlist.current.sound.play()
        }

        this.playlist.stop = () =>
        {
            // Huỷ cả lần đổi bài đang chờ, nếu không nhạc sẽ tự bật lại sau vài
            // giây dù người dùng vừa tắt
            if(this.playlist.pendingCall)
            {
                this.playlist.pendingCall.kill()
                this.playlist.pendingCall = null
            }
            this.playlist.switching = false

            if(this.playlist.current)
                this.playlist.current.sound.stop()
        }

        this.playlist.setVolume = (slider) =>
        {
            this.playlist.slider = clamp(slider, 0, 1)
            localStorage.setItem('musicVolume', this.playlist.slider)

            /**
             * ⚠️ `Howl.volume(v)` bị BỎ QUA khi bài chưa nạp (`preload: false`
             *    nên chỉ bài đang phát mới nạp). Đo được: chỉnh lên 60%, hai bài
             *    đã nạp nhận 0.36 còn ba bài chưa nạp giữ nguyên 0.0625 ⇒ chỉnh
             *    to xong, sang bài sau lại bé như cũ.
             *
             *    Nên âm lượng còn được đặt LẠI ngay trước mỗi lần `play()` —
             *    đó mới là chỗ chắc chắn ăn. Vòng lặp dưới đây chỉ để bài ĐANG
             *    PHÁT đổi âm lượng tức thì lúc người dùng đang kéo thanh trượt.
             */
            const volume = this.playlist.getVolume()
            for(const song of this.playlist.songs)
                song.sound.volume(volume)

            this.events.trigger('playlistChange')
        }

        this.playlist.setEnabled = (enabled) =>
        {
            if(enabled === this.playlist.enabled)
                return

            this.playlist.enabled = enabled
            localStorage.setItem('musicToggle', enabled ? '1' : '0')

            if(enabled)
                this.playlist.play()
            else
                this.playlist.stop()

            this.events.trigger('playlistChange')
        }

        this.playlist.toggle = () =>
        {
            this.playlist.setEnabled(!this.playlist.enabled)
        }

        /**
         * Bắt đầu nhạc khi THẾ GIỚI mở ra — do `Reveal` gọi ở bước 1, tức ngay
         * sau khi người chơi bấm vào vòng tròn "Click to Start".
         *
         * ⚠️ TUYỆT ĐỐI KHÔNG phát nhạc ngay trong `setPlaylist()`. `audio.init()`
         *    chạy ở đúng khoảnh khắc bấm, lúc đó nhãn intro còn đang mờ đi và
         *    máy quay còn đang lùi ra — nhạc nổ lên ngay là quá sớm, nghe như
         *    nhạc phát từ màn chào. Đó chính là lỗi user báo ngày 30/7.
         *
         * `delay` giây im lặng để tiếng "whoosh" mở màn và tiếng chim/gió vào
         * trước, rồi nhạc mới len vào dưới.
         */
        this.playlist.startWorld = (delay = 2) =>
        {
            if(!this.playlist.hasSongs)
                return

            /**
             * Tắt loa ở màn "Click to Start" ⇒ TẮT HẲN nhạc nền.
             *
             * Nút loa đó gọi `audio.mute.toggle()` (xem `World/Intro.js`), tức
             * tắt tiếng TOÀN CỤC. Nếu chỉ dựa vào cái tắt tiếng toàn cục thì mở
             * loa lại là nhạc bật lên theo — không phải ý người dùng. Nên ở đây
             * hạ hẳn cờ `enabled` và ghi nhớ, đúng nghĩa "tắt nhạc nền full":
             * mọi tiếng GỐC (chim, dế, sấm, gió…) vẫn y nguyên hành vi của bản
             * mẫu, chỉ riêng nhạc là không bao giờ tự vào.
             *
             * Bật lại bất cứ lúc nào bằng nút Music trong bảng Cài đặt.
             */
            if(this.mute.active)
            {
                this.playlist.enabled = false
                localStorage.setItem('musicToggle', '0')
                this.events.trigger('playlistChange')
                return
            }

            if(!this.playlist.enabled)
                return

            gsap.delayedCall(delay, () =>
            {
                this.playlist.play()
            })
        }

        // Bảng Cài đặt được dựng TRƯỚC `audio.init()` nên lúc đó chưa có
        // `playlist`. Báo cho nó biết đã có để nó gắn nút vào.
        this.events.trigger('playlistReady')
    }

    setAmbiants()
    {
        const getRandomDirection = (distance = 30) =>
        {
            return new THREE.Vector3(
                this.game.view.focusPoint.position.x + ((Math.random() < 0.5) ? distance : - distance),
                this.game.view.focusPoint.position.y,
                this.game.view.focusPoint.position.z + ((Math.random() < 0.5) ? distance : - distance)
            )
        }
        
        // Birds tweets
        {
            const tweetsPaths = [
                'sounds/birdTweets/24074 small bird tweet calling-full-1.mp3',
                'sounds/birdTweets/24074 small bird tweet calling-full-2.mp3',
                'sounds/birdTweets/20711 finch bird isolated tweet-full.mp3',
                'sounds/birdTweets/30673 Yellowhammer bird tweet 3-full.mp3',
                'sounds/birdTweets/31062 Ortolan bird tweet-full.mp3',
                'sounds/birdTweets/31451 Ortolan bunting bird isolated tweet-full.mp3',
            ]

            const tweets = []
            for(const path of tweetsPaths)
                tweets.push(
                    this.register({
                        group: 'birdTweet',
                        path: path,
                        autoplay: false,
                        loop: false,
                        volume: 0.3,
                        positions: new THREE.Vector3(),
                        onPlay: (item) =>
                        {
                            item.volume = 0.2 + Math.random() * 0.3
                            item.rate = 1 + Math.random() * 0.7
                            item.positions[0].copy(getRandomDirection())
                        }
                    })
                )


            const tryPlay = () =>
            {
                // Chance to trigger
                if(!this.game.dayCycles.intervalEvents.get('night').inInterval && Math.random() < 0.5)
                {
                    const sound = tweets[Math.floor(Math.random() * tweets.length)]
                    sound.play()
                }

                // Wait before trying again
                gsap.delayedCall(0.5 + Math.random() * 5, tryPlay)
            }
            tryPlay()
        }
        
        // Owl
        {
            const sound = this.register({
                group: 'owl',
                path: 'sounds/owl/OwlHootingReverberantSeveral_Rik8a_03.mp3',
                autoplay: false,
                loop: false,
                volume: 0.3,
                positions: new THREE.Vector3(),
                onPlay: (item) =>
                {
                    item.volume = 0.2 + Math.random() * 0.25
                    item.rate = 1 + Math.random() * 0.3
                    item.positions[0].copy(getRandomDirection())
                }
            })

            const tryPlay = () =>
            {
                // Chance to trigger
                if(this.game.dayCycles.intervalEvents.get('night').inInterval && Math.random() < 0.5)
                {
                    sound.play()
                }

                // Wait before trying again
                gsap.delayedCall(30 + Math.random() * 60, tryPlay)
            }
            gsap.delayedCall(30 + Math.random() * 60, tryPlay)
        }

        // Rooster
        {
            const sound = this.register({
                group: 'rooster',
                path: 'sounds/rooster/rooster-crowing.mp3',
                autoplay: false,
                loop: false,
                volume: 0.1,
                positions: new THREE.Vector3(),
                onPlay: (item) =>
                {   
                    item.volume = 0.1 + Math.random() * 0.2
                    item.positions[0].copy(getRandomDirection())
                }
            })

            this.game.dayCycles.events.on('night', (inInterval) =>
            {
                if(!inInterval)
                    sound.play()
            })
        }

        // Wolf
        {
            const sound = this.register({
                group: 'wolf',
                path: 'sounds/wolf/TimberWolvesGroupHowlingSomeWhimpering_S2h0E_04.mp3',
                autoplay: false,
                loop: false,
                volume: 0.1,
                positions: new THREE.Vector3(),
                onPlay: (item) =>
                {   
                    item.volume = 0.1 + Math.random() * 0.2
                    item.positions[0].copy(getRandomDirection())
                }
            })

            this.game.dayCycles.events.on('deepNight', (inInterval) =>
            {
                if(inInterval)
                    sound.play()
            })
        }

        // Crickets
        {
            const sound = this.register({
                group: 'crickets',
                    path: 'sounds/crickets/Crickets.mp3',
                autoplay: true,
                loop: true,
                volume: this.game.dayCycles.intervalEvents.get('night').inInterval ? 0.65 : 0
            })

            this.game.dayCycles.events.on('night', (inInterval) =>
            {
                gsap.to(sound, { volume: inInterval ? 0.65 : 0, duration: 15, overwrite: true })
            })
        }

        // Jingle bells
        this.register({
            group: 'jingleBells',
            path: 'sounds/jingleBells/Mountain Audio - Christmas Bells.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            onPlaying: (item) =>
            {
                const sine = Math.sin(this.game.ticker.elapsedScaled * 0.1) * 0.5 + 0.5
                const targetVolume = Math.max(0, this.game.weather.snow.value) * 0.35 * sine

                const easing = targetVolume > item.volume ? 0.005 : 0.05
                item.volume += (targetVolume - item.volume) * this.game.ticker.deltaScaled * easing
            }
        })

        // Rain
        this.register({
            group: 'rain',
            path: 'sounds/rain/soundjay_rain-on-leaves_main-01.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            onPlaying: (item) =>
            {
                const snowAttenuation = remapClamp(this.game.weather.snow.value, 0, 0.6, 1, 0)
                const rainVolume = remapClamp(this.game.weather.rain.value, 0.1, 0.6, 0, 1)
                item.volume = rainVolume * snowAttenuation
            }
        })

        // Wind
        this.register({
            group: 'wind',
            path: 'sounds/wind/13582-wind-in-forest-loop.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            onPlaying: (item) =>
            {
                item.volume = Math.pow(remapClamp(this.game.weather.wind.value, 0.3, 1, 0, 1), 3) * 0.7
            }
        })

        // Waves
        this.register({
            group: 'waves',
            path: 'sounds/waves/lake-waves.mp3',
            autoplay: true,
            loop: true,
            volume: 0,
            onPlaying: (item) =>
            {
                const distanceToSide = Math.min(
                    this.game.terrain.size / 2 - Math.abs(this.game.player.position.x),
                    this.game.terrain.size / 2 - Math.abs(this.game.player.position.z)
                )
                item.volume = Math.pow(remapClamp(distanceToSide, 0, 40, 1, 0.1), 2) * 0.7
            }
        })

        // Oven fire (Project Area + Cookie Area)
        {
            const positions = []
            if(this.game.world.areas?.cookie)
                positions.push(this.game.world.areas.cookie.references.items.get('spawner')[0].position)
            if(this.game.world.areas?.projects)
                positions.push(this.game.world.areas.projects.references.items.get('oven')[0].position)

            if(positions.length)
            {
                this.game.audio.register({
                    group: 'ovenFire',
                    path: 'sounds/fire/Mountain Audio - Fire Burning in a Wood Stove 1.mp3',
                    autoplay: true,
                    loop: true,
                    volume: 0.8,
                    positions: positions,
                    distanceFade: 13,
                })
            }
        }

        // Campfire (Lab Area + Bonfire Area)
        {
            const positions = []
            if(this.game.world.areas?.lab)
                positions.push(this.game.world.areas.lab.references.items.get('fire')[0].position)

            if(positions.length)
            {
                this.game.audio.register({
                    group: 'campfire',
                    path: 'sounds/fire/Fire Burning.mp3',
                    autoplay: true,
                    loop: true,
                    volume: 1,
                    positions: positions,
                    distanceFade: 13,
                })
            }
        }
    }

    setOneOffs()
    {
        this.register({
            group: 'discChange',
            path: 'sounds/jukebox/DVDPlayerChangeDisc_BW.49824.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
        })
        
        this.register({
            group: 'slide',
            path: 'sounds/mecanism/slide.mp3',
            autoplay: false,
            volume: 0.18
        })

        this.register({
            group: 'click',
            path: 'sounds/mecanism/click.mp3',
            autoplay: false,
            volume: 0.25,
            onPlay: (item, isOpen = true) =>
            {
                item.rate = isOpen ? 1 : 0.6
            }
        })

        this.register({
            group: 'assemble',
            path: 'sounds/mecanism/assemble.mp3',
            autoplay: false,
            volume: 0.3
        })

        // Hits default
        {
            const paths = [
                [ 'sounds/hits/defaults/Stone_Hit_Crash_106-2.mp3', 0.35 ],
                [ 'sounds/hits/defaults/Stone_Hit_Crash_071-1.mp3', 0.35 ],
                [ 'sounds/hits/defaults/Stone_Hit_Crash_106-1.mp3', 0.35 ],
                [ 'sounds/hits/defaults/Impact Soft 01.mp3', 0.8 ],
                [ 'sounds/hits/defaults/Impact Soft 02.mp3', 0.8 ],
                [ 'sounds/hits/defaults/Impact Soft 03.mp3', 0.8 ],
                [ 'sounds/hits/defaults/Impact Soft 04.mp3', 0.8 ],
            ]

            for(const [path, baseVolume] of paths)
            {
                this.register({
                    group: 'hitDefault',
                    path: path,
                    autoplay: false,
                    volume: baseVolume,
                    antiSpam: 0.1,
                    positions: new THREE.Vector3(),
                    distanceFade: 20,
                    onPlay: (item, force, position) =>
                    {
                        item.positions[0].copy(position)
                        const forceVolume = remapClamp(force, 0, 200, 0, 1)
                        item.volume = baseVolume * forceVolume
                        item.rate = 0.9 + Math.random() * 0.2
                    }
                })
            }
        }

        // Hits bricks
        {
            const paths = [
                [ 'sounds/hits/bricks/24445 brick light hitting-full-2.mp3', 0.6 ],
                [ 'sounds/hits/bricks/41559 Stone brick fall hit 01-full-1.mp3', 0.6 ],
                [ 'sounds/hits/bricks/41563 Stone brick fall hit 05-full-1.mp3', 0.6 ],
                [ 'sounds/hits/bricks/BrickSetDown_BW.5803-1.mp3', 0.6 ],
            ]

            for(const [path, baseVolume] of paths)
            {
                this.register({
                    group: 'hitBrick',
                    path: path,
                    autoplay: false,
                    volume: baseVolume,
                    antiSpam: 0.1,
                    positions: new THREE.Vector3(),
                    distanceFade: 20,
                    onPlay: (item, force, position) =>
                    {
                        item.positions[0].copy(position)
                        item.volume = baseVolume * Math.pow(remapClamp(force, 5, 20, 0, 1), 2)
                        item.rate = 0.9 + Math.random() * 0.2
                    }
                })
            }
        }

        // Hits metal
        {
            const paths = [
                [ 'sounds/hits/metal/EQUIPTact_Fire Gear_SDFIRE0411.mp3', 0.6 ],
                [ 'sounds/hits/metal/Metal Clip Hit.mp3', 0.6 ],
                [ 'sounds/hits/metal/Metalic 3.mp3', 0.6 ],
            ]

            for(const [path, baseVolume] of paths)
            {
                this.register({
                    group: 'hitMetal',
                    path: path,
                    autoplay: false,
                    volume: baseVolume,
                    antiSpam: 0.1,
                    positions: new THREE.Vector3(),
                    distanceFade: 20,
                    onPlay: (item, force, position) =>
                    {
                        item.positions[0].copy(position)
                        item.volume = baseVolume * Math.pow(remapClamp(force, 5, 20, 0, 1), 2)
                        item.rate = 0.9 + Math.random() * 0.2
                    }
                })
            }
        }
    }

    setMute()
    {
        this.mute = {}

        this.mute.active = false

        this.mute.toggle = () =>
        {
            if(this.mute.active)
                this.mute.deactivate()
            else
                this.mute.activate()
        }

        this.mute.activate = () =>
        {
            if(this.mute.active)
                return
            
            Howler.mute(true)
            this.mute.active = true
            localStorage.setItem('soundToggle', '1')
            document.documentElement.classList.add('is-audio-muted')
            this.events.trigger('muteChange', [ true ])
        }

        this.mute.deactivate = () =>
        {
            if(!this.mute.active)
                return
            
            Howler.mute(false)
            this.mute.active = false
            localStorage.setItem('soundToggle', '0')
            document.documentElement.classList.remove('is-audio-muted')
            this.events.trigger('muteChange', [ false ])
        }

        // From local storage
        const soundToggleLocal = localStorage.getItem('soundToggle')
        if(soundToggleLocal !== null && soundToggleLocal === '1')
            this.mute.activate()

        // Inputs keyboard
        this.game.inputs.addActions([
            { name: 'mute', categories: [ 'intro', 'modal', 'menu', 'racing', 'cinematic', 'wandering' ], keys: [ 'Keyboard.l' ] },
        ])
        this.game.inputs.events.on('mute', (action) =>
        {
            if(action.active)
                this.mute.toggle()
        })

        // Tab focus / blur
        window.addEventListener('blur', () =>
        {
            Howler.mute(true)

            if(this.playlist?.current)
                this.playlist.current.sound.pause()
        })

        window.addEventListener('focus', () =>
        {
            if(!this.mute.active)
            {
                Howler.mute(false)

                // ⚠️ `enabled` phải kiểm ở đây: tắt nhạc rồi chuyển tab đi, quay
                //    lại là nhạc tự bật lên nếu thiếu điều kiện này
                if(this.playlist?.current && this.playlist.enabled)
                    this.playlist.current.sound.play()
            }
        })

    }

    update()
    {
        this.globalRate = this.game.time.scale / this.game.time.defaultScale
        this.groups.forEach((group) =>
        {
            for(const item of group.items)
            {
                // Apply tick binding
                if(typeof item.onPlaying === 'function')
                {
                    item.onPlaying(item)
                }

                // Positional and distance fade
                let distanceFadeMultiplier = 1
                if(item.positions && item.howl.playing())
                {
                    let closestDistance = Infinity
                    let closestPosition = null

                    for(const position of item.positions)
                    {
                        const distance = position.distanceTo(this.game.view.focusPoint.position)

                        if(distance < closestDistance)
                        {
                            closestDistance = distance
                            closestPosition = position
                        }
                    }

                    const cameraRelativePosition = closestPosition.clone()
                    cameraRelativePosition.applyMatrix4(this.game.view.camera.matrixWorldInverse)
                    cameraRelativePosition.normalize()
                    cameraRelativePosition.z *= 0.1

                    if(item.distanceFade)
                    {
                        distanceFadeMultiplier = remapClamp(closestDistance, 0, item.distanceFade, 1, 0)
                    }

                    if(distanceFadeMultiplier > 0)
                        item.howl.pos(cameraRelativePosition.x, cameraRelativePosition.y, cameraRelativePosition.z)
                }

                // Rate (apply global too)
                item.howl.rate(clamp(item.rate * this.globalRate, 0.5, 4))

                // Volume
                const volume = item.volume * distanceFadeMultiplier
                item.howl.volume(item.volume * distanceFadeMultiplier)

                item.howl.mute(volume < 0.01)
            }
        })
    }
}
