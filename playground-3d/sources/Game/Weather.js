import gsap from 'gsap'
import { Game } from './Game.js'
import { Events } from './Events.js'
import { lerp, remapClamp } from './utilities/maths.js'

export class Weather
{
    constructor()
    {
        this.game = Game.getInstance()
        this.events = new Events()

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '🌦️ Weather',
                expanded: false,
            })
        }

        this.properties = []
        this.setOverride()
        this.setPreference()

        // Temperature
        this.addProperty(
            'temperature',
            -15,
            40,
            () =>
            {
                const yearValue = this.game.yearCycles.properties.temperature.value
                const dayValue = this.game.dayCycles.properties.temperature.value

                const frequency = 0.4
                const amplitude = 7.5
                const variation = this.noise(this.game.dayCycles.absoluteProgress * frequency) * amplitude

                return yearValue + dayValue + variation
            }
        )

        // Humidity
        this.addProperty(
            'humidity',
            0,
            1,
            () =>
            {
                const yearValue = this.game.yearCycles.properties.humidity.value

                const frequency = 0.36
                const amplitude = 0.2
                const variation = this.noise(this.game.dayCycles.absoluteProgress * frequency) * amplitude

                return yearValue + variation
            }
        )

        // Electric field
        this.addProperty(
            'electricField',
            -1,
            1,
            () =>
            {
                const dayValue = this.game.dayCycles.properties.electricField.value
                
                const frequency = 0.53
                const amplitude = 1
                const variation = this.noise(this.game.dayCycles.absoluteProgress * frequency) * amplitude

                return dayValue * variation
            }
        )

        // Clouds
        this.addProperty(
            'clouds',
            -1,
            1,
            () =>
            {
                const frequency = 0.44
                const amplitude = 1
                const variation = this.noise(this.game.dayCycles.absoluteProgress * frequency) * amplitude
                return variation
            }
        )

        // Wind
        this.addProperty(
            'wind',
            0,
            1,
            () =>
            {
                const frequency = 1
                const variation = this.noise(this.game.dayCycles.absoluteProgress * frequency) * 0.5 + 0.5
                return variation
            }
        )

        // Rain
        this.addProperty(
            'rain',
            0,
            1,
            () =>
            {
                return remapClamp(this.humidity.value, 0.65, 1, 0, 1) * remapClamp(this.clouds.value, 0, 1, 0, 1)
            }
        )

        // Snow
        this.addProperty(
            'snow',
            -1,
            1,
            () =>
            {
                const rainRatio = remapClamp(this.rain.value, 0.05, 0.3, 0, 1)
                const freezeRatio = remapClamp(this.temperature.value, 0, -5, 0, 1)
                const meltRatio = remapClamp(this.temperature.value, 0, 10, 0, -1)

                return rainRatio * freezeRatio + meltRatio
            }
        )
        
        /**
         * Khôi phục lựa chọn thời tiết của lần chơi trước — vào ngay, không
         * chuyển dần, để người chơi mở lại trang là thấy đúng cái mình đã chọn.
         *
         * ⚠️ PHẢI đặt ở ĐÂY, sau tất cả `addProperty(...)`. Gọi ngay trong
         *    `setPreference()` thì `this.properties` còn RỖNG, `override.start`
         *    duyệt qua một mảng trống ⇒ không đại lượng nào nhận giá trị ép, cờ
         *    `strength` vẫn lên 1 nên nhìn mã tưởng chạy mà thực tế thời tiết
         *    không đổi gì.
         */
        if(this.preference.current !== 'auto')
            this.preference.apply(0)

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 8)
    }

    noise(x)
    {
        return Math.sin(x) * Math.sin(x * 1.678) * Math.sin(x * 2.345)
    }

    addProperty(name, min, max, get)
    {
        const property = {}
        property.name = name
        property.manual = false
        property.min = min
        property.max = max

        property.value = get()
        property.overrideValue = null

        // Debug
        property.binding = this.game.debug.addManualBinding(
            this.debugPanel,
            property,
            'value',
            { label: name, min: property.min, max: property.max, step: 0.001 },
            () =>
            {
                let value = get()
                
                if(this.override.strength > 0 && property.overrideValue !== null)
                {
                    value = lerp(value, property.overrideValue, this.override.strength)

                    // if(name === 'humidity')
                    // {
                    //     console.log(value)
                    // }
                }
                
                return value
            }
        )

        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(property, 'value', { readonly: true })
            this.debugPanel.addBinding(
                property,
                'value',
                {
                    label: `${property.min} -> ${property.max}`,
                    readonly: true,
                    view: 'graph',
                    min: property.min,
                    max: property.max,
                }
            )
            this.debugPanel.addBlade({ view: 'separator' })
        }

        this[name] = property
        this.properties.push(property)
    }

    setOverride()
    {
        this.override = {}
        this.override.strength = 0
        
        this.override.start = (values = {}, duration = 5) =>
        {
            for(const property of this.properties)
            {
                if(typeof values[property.name] !== 'undefined')
                    property.overrideValue = values[property.name]
                else
                    property.overrideValue = null
            }

            if(duration === 0)
                this.override.strength = 1
            else
                gsap.to(this.override, { strength: 1, duration, overwrite: true })
        }

        this.override.end = (duration = 5) =>
        {
            /**
             * ⚠️ "Kết thúc ghi đè" KHÔNG phải lúc nào cũng là "trả về thời tiết
             *    tự nhiên". Nếu người chơi đã CHỌN một kiểu thời tiết trong bảng
             *    Cài đặt thì phải quay về lựa chọn đó.
             *
             *    Cần chốt này vì khu Đua (`CircuitArea`) và cơn Lốc (`Tornado`)
             *    cũng ép thời tiết rồi gọi `override.end()` khi xong. Thiếu chỗ
             *    này thì: bật Tuyết → chạy một vòng đua → ra khỏi đường đua là
             *    mất tuyết, mà nút trong Cài đặt vẫn hiện "Snow". Đúng kiểu lỗi
             *    "chạy được nhưng không khớp".
             */
            if(this.preference && this.preference.current !== 'auto')
            {
                this.preference.apply(duration)
                return
            }

            if(duration === 0)
                this.override.strength = 0
            else
                gsap.to(this.override, { strength: 0, duration, overwrite: true })
        }
    }

    /**
     * Lựa chọn thời tiết của người chơi (nút Weather trong bảng Cài đặt).
     *
     * Mặc định `auto` = thời tiết tự nhiên của bản mẫu, chạy theo chu kỳ ngày và
     * chu kỳ năm — KHÔNG đụng gì. Ba kiểu còn lại ép bằng `override`.
     */
    setPreference()
    {
        /**
         * ⚠️ PHẢI ép cả NHÓM thuộc tính, không được ép mỗi cái tên gọi.
         *
         * `rain` và `snow` là giá trị DẪN XUẤT: `rain` sinh từ độ ẩm × mây, còn
         * `snow` sinh từ `rain` × nhiệt độ. Và những thứ đọc thời tiết cũng đọc
         * thẳng các biến gốc chứ không chỉ đọc `rain`/`snow`:
         *   · `Snow.js` đọc `temperature` để biết tuyết đọng hay tan
         *   · `WaterSurface.js` đọc `temperature` để đóng băng mặt nước
         *   · `Lightnings.js` đọc `clouds × electricField × humidity` để đánh sét
         *   · `Audio.js` đọc `rain`/`snow`/`wind` để lên xuống tiếng mưa, gió
         * Ép mỗi `snow = 1` sẽ ra cảnh nửa vời: tuyết rơi mà hồ không đóng băng.
         *
         * Đây cũng đúng cách bản mẫu tự làm — xem `Tornado.js` ép một lúc
         * `humidity/electricField/clouds/wind`.
         */
        const presets = {
            // Mưa rào có sấm. Nhiệt độ dương để mưa không hoá tuyết, và `snow`
            // âm để lớp tuyết còn đọng từ trước tan đi.
            rain: { humidity: 1, clouds: 1, rain: 1, snow: -1, temperature: 12, wind: 0.55, electricField: 0.6 },

            // Tuyết rơi. `rain` vẫn phải > 0 vì cùng một hệ hạt vẽ cả mưa lẫn
            // tuyết (`RainLines.js`) — `snow` chỉ đổi hạt dài thành bông ngắn.
            snow: { humidity: 1, clouds: 0.8, rain: 0.7, snow: 1, temperature: -8, wind: 0.35, electricField: 0 },

            // Trời quang. `clouds` xuống -1 (thang -1..1) cho sạch mây.
            clear: { humidity: 0, clouds: -1, rain: 0, snow: -1, temperature: 18, wind: 0.15, electricField: 0 },
        }

        this.preference = {}
        this.preference.presets = presets
        this.preference.names = [ 'auto', 'rain', 'snow', 'clear' ]
        this.preference.labels = { auto: 'Auto', rain: 'Rain', snow: 'Snow', clear: 'Clear' }
        this.preference.current = 'auto'

        const stored = localStorage.getItem('weatherPreference')
        if(stored && this.preference.names.includes(stored))
            this.preference.current = stored

        this.preference.apply = (duration = 4) =>
        {
            const preset = presets[this.preference.current]

            if(preset)
                this.override.start(preset, duration)
            else if(duration === 0)
                this.override.strength = 0
            else
                gsap.to(this.override, { strength: 0, duration, overwrite: true })
        }

        this.preference.set = (name, duration = 4) =>
        {
            if(!this.preference.names.includes(name))
                return

            this.preference.current = name
            localStorage.setItem('weatherPreference', name)

            this.preference.apply(duration)
            this.events.trigger('preferenceChange')
        }

        this.preference.next = (duration = 4) =>
        {
            const index = this.preference.names.indexOf(this.preference.current)
            this.preference.set(this.preference.names[(index + 1) % this.preference.names.length], duration)
        }

        // Thời tiết có đang bị ÉP không — dùng để không trao thành tựu
        // "Witness a rainy weather" / "snowy weather" cho thời tiết bấm nút mà ra
        this.preference.isForced = () => this.preference.current !== 'auto'
    }

    update()
    {
        for(const property of this.properties)
            property.binding.update()
    }
}