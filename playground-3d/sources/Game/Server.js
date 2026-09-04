import { v4 as uuidv4 } from 'uuid'
import { Events } from './Events.js'
import { Game } from './Game.js'

export class Server
{
    constructor()
    {
        this.game = Game.getInstance()

        // Unique session ID
        this.uuid = localStorage.getItem('uuid')
        if(!this.uuid)
        {
            this.uuid = uuidv4()
            localStorage.setItem('uuid', this.uuid)
        }

        this.connected = false
        this.initData = null
        this.events = new Events()
        document.documentElement.classList.add('is-server-offline')
    }

    /**
     * ⚠️ `msgpack-lite` NHẬP ĐỘNG, không nhập tĩnh ở đầu file.
     *
     * Máy chủ nhiều người chơi NGỦ HOÀN TOÀN trên production: cả hàm này chặn
     * sau `VITE_SERVER_URL`, mà biến đó không được đặt ở bất kỳ tệp `.env` nào.
     * Nhập tĩnh thì `msgpack-lite` (56 KB) cùng phần `Buffer` polyfill của nó
     * vẫn đi vào gói phát hành cho mọi khách, để phục vụ một đường mã không bao
     * giờ chạy.
     *
     * ⚠️ Phải nạp XONG rồi mới `connect()`. `onReceive()` gọi `decode()` ngay
     * trong bộ bắt sự kiện `message` của WebSocket — đồng bộ, không chờ được.
     * Mở socket trước khi có bộ giải mã là mời một `TypeError` vào đúng gói tin
     * đầu tiên.
     *
     * `send()` thì an toàn sẵn: nó thoát sớm khi `!this.connected`, mà cờ đó
     * chỉ bật sau khi socket mở — tức sau khi đã nạp.
     *
     * ⚠️ `start()` nay là `async`. Chỗ gọi (`Reveal.js`) bắn-rồi-quên, không
     * `await`, nên không có gì phải đổi ở đó — nhưng đừng biến nó thành thứ
     * người khác phải chờ mà không biết.
     */
    async start()
    {
        if(!import.meta.env.VITE_SERVER_URL)
            return

        if(!await this.loadCodec())
            return

        // First connect attempt
        this.connect()

        // Try connect
        setInterval(() =>
        {
            if(!this.connected)
                this.connect()
        }, 2000)
    }

    /**
     * Nạp bộ mã hoá gói tin. Trả `false` nếu không nạp được — khi đó chế độ
     * nhiều người chơi tắt hẳn và sân chơi vẫn chạy bình thường offline, đúng
     * như khi không khai `VITE_SERVER_URL`.
     */
    async loadCodec()
    {
        if(this.msgpack)
            return true

        try
        {
            const module = await import('msgpack-lite')
            // Gói này là CommonJS; qua interop của Vite thì nội dung nằm ở
            // `.default`. Giữ cả hai nhánh cho chắc.
            this.msgpack = module.default ?? module

            return true
        }
        catch(error)
        {
            console.error('[Server] không nạp được `msgpack-lite` — tắt chế độ nhiều người chơi', error)

            return false
        }
    }

    connect()
    {
        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL)
        this.socket.binaryType = 'arraybuffer'

        this.socket.addEventListener('open', () =>
        {
            this.connected = true
            document.documentElement.classList.remove('is-server-offline')
            document.documentElement.classList.add('is-server-online')
            this.events.trigger('connected')

            // On message
            this.socket.addEventListener('message', (message) =>
            {
                this.onReceive(message)
            })

            // Notification (only if been running for a while)
            if(this.game.ticker.elapsed > 10)
            {
                const html = /* html */`
                    <div class="top">
                        <div class="title">Server connected</div>
                    </div>
                `

                this.game.notifications.show(
                    html,
                    'server-connected',
                    8,
                    null,
                    'server-connected'
                )
            }

            // On close
            this.socket.addEventListener('close', () =>
            {
                document.documentElement.classList.add('is-server-offline')
                document.documentElement.classList.remove('is-server-online')
                this.connected = false

                // Notification
                const html = /* html */`
                    <div class="top">
                        <div class="title">Server disconnected</div>
                    </div>
                `

                this.game.notifications.show(
                    html,
                    'server-disconnected',
                    8,
                    null,
                    'server-disconnected'
                )
                
                this.events.trigger('disconnected')
            })
        })
    }

    onReceive(message)
    {
        const data = this.decode(message.data)
    
    
        if(this.initData === null)
            this.initData = data

        this.events.trigger('message', [ data ])
    }

    send(message)
    {
        if(!this.connected)
            return false

        this.socket.send(this.encode({ uuid: this.uuid, ...message }))
    }

    decode(data)
    {
        return this.msgpack.decode(new Uint8Array(data))
    }

    encode(data)
    {
        return this.msgpack.encode(data)
    }
}