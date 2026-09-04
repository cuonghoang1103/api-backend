import { Events } from './Events.js'
import { Game } from './Game.js'

/** Khoá `localStorage` giữ mức đồ hoạ người chơi tự chọn. */
const STORAGE_KEY = 'qualityLevel'

export class Quality
{
    constructor()
    {
        this.game = Game.getInstance()

        this.events = new Events()

        // 0 = cao nhất, 1 = thấp. Lựa chọn của người chơi THẮNG mọi phép đoán:
        // họ vừa thấy game chạy trên chính máy mình, còn ta thì không.
        const stored = Quality.readStored()
        this.level = stored !== null ? stored : Quality.detectLevel()

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

    /**
     * Đọc mức đã lưu. Trả `null` khi chưa từng chọn — KHÁC với 0, nên phải so
     * `!== null` chứ không dùng `??` hay `||`: mức 0 (cao) là giá trị hợp lệ mà
     * `||` sẽ nuốt mất.
     *
     * Bọc `try` vì `localStorage` NÉM lỗi chứ không trả `null` khi trình duyệt
     * chặn cookie bên thứ ba hoặc ở chế độ riêng tư của Safari. Ném ở đây là
     * ném giữa `new Quality()` trong `Game.js`, tức chết cả sân chơi ở màn hình
     * tải — đúng kiểu lỗi câm mà mục 0 của bàn giao đã kể.
     */
    static readStored()
    {
        try
        {
            const raw = localStorage.getItem(STORAGE_KEY)

            if(raw !== '0' && raw !== '1')
                return null

            return parseInt(raw)
        }
        catch(_error)
        {
            return null
        }
    }

    /**
     * Đoán mức cho người vào LẦN ĐẦU.
     *
     * Bản cũ chỉ có một dòng `/Mobi|Android|iPhone|iPad|iPod/` và nó thủng hai
     * chỗ, cả hai đều rơi về mức CAO — tức phía đắt tiền:
     *
     *   · **iPad từ iPadOS 13 khai mình là `Macintosh`.** Apple đổi user-agent
     *     của Safari trên iPad để web trả về bản dành cho máy tính. Chuỗi
     *     `iPad` KHÔNG còn trong user-agent, nên regex trên trượt sạch mọi iPad
     *     đời mới. Nhận ra bằng `maxTouchPoints` — máy Mac thật trả 0.
     *   · **Laptop GPU tích hợp** trông y hệt máy để bàn có card rời.
     *     `hardwareConcurrency` và `deviceMemory` là hai tín hiệu rẻ tiền nhất
     *     phân biệt được, và cả hai đều có sẵn không cần xin quyền.
     *
     * ⚠️ `deviceMemory` Safari KHÔNG có (trả `undefined`), nên phải kiểm tồn
     * tại trước khi so — `undefined <= 4` là `false`, im lặng bỏ qua phép đo.
     *
     * Đoán sai vẫn không sao: người chơi đổi được trong Cài đặt, và từ nay lựa
     * chọn đó được NHỚ.
     */
    static detectLevel()
    {
        const ua = navigator.userAgent

        const isMobileUa = /Mobi|Android|iPhone|iPod/i.test(ua)

        // iPad đời mới: user-agent nói `Macintosh`, nhưng Mac thật không có
        // màn cảm ứng đa điểm.
        const isIpad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1

        // `hardwareConcurrency` vắng mặt ở vài trình duyệt cũ → coi như đủ mạnh
        // thay vì đoán bừa xuống thấp.
        const cores = navigator.hardwareConcurrency
        const fewCores = typeof cores === 'number' && cores > 0 && cores <= 4

        const memory = navigator.deviceMemory
        const lowMemory = typeof memory === 'number' && memory <= 4

        return (isMobileUa || isIpad || fewCores || lowMemory) ? 1 : 0
    }

    changeLevel(level = 0)
    {
        // Same
        if(level === this.level)
            return

        this.level = level

        // Ghi NGAY, không đợi lúc thoát: sân chơi không có nhịp "đóng game" nào
        // chắc chắn chạy — người ta đóng tab, và `beforeunload` trên di động
        // thường không bắn.
        try
        {
            localStorage.setItem(STORAGE_KEY, String(level))
        }
        catch(_error)
        {
            // Không lưu được thì thôi, phiên này vẫn đổi mức bình thường.
        }

        this.events.trigger('change', [ this.level ])
    }
}
