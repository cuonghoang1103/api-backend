import * as THREE from 'three/webgpu'

/**
 * ⚠️ TWEAKPANE NHẬP ĐỘNG, không nhập tĩnh ở đầu file.
 *
 * Bảng gỡ lỗi chỉ mở khi địa chỉ có `#debug`. Nhưng ba gói của nó —
 * `tweakpane` + hai plugin — nhập tĩnh thì đi vào gói phát hành BẤT KỂ điều
 * đó: đo ngày 04/09/2026 bằng `rollup-plugin-visualizer` ra **789 KB chưa rút
 * gọn, 7,9% cả gói**, mà không một người chơi bình thường nào chạm tới.
 *
 * Nay chúng nằm trong một chunk riêng, chỉ tải khi thật sự mở `#debug`.
 *
 * ⚠️ Cái giá: `panel` không còn sẵn ngay sau `new Debug()`. Nên `Game.init()`
 * phải `await this.debug.load()` NGAY SAU đó, trước khi dựng bất cứ thứ gì
 * đọc `debug.panel`. `Debug` là thứ thứ hai được dựng trong `init()` nên
 * không có gì phía trước bị ảnh hưởng.
 */
export class Debug
{
    constructor()
    {
        this.active = location.hash.match(/debug/i)
    }

    /**
     * Nạp tweakpane và dựng bảng. Không có `#debug` thì trả về ngay, không tải
     * một byte nào.
     */
    async load()
    {
        if(!this.active)
            return

        const [ { Pane }, EssentialsPlugin, CamerakitPlugin ] = await Promise.all([
            import('tweakpane'),
            import('@tweakpane/plugin-essentials'),
            import('@tweakpane/plugin-camerakit'),
        ])

        this.panel = new Pane()
        this.panel.registerPlugin(EssentialsPlugin)
        this.panel.registerPlugin(CamerakitPlugin)

        addEventListener('keydown', (event) =>
        {
            if(event.code === 'KeyH')
                this.panel.hidden = !this.panel.hidden
        })
    }

    addManualBinding(panel, object, property, settings, update, manual = false)
    {
        const binding = {}
        binding.manual = manual
        binding.manualValue = object[property]
        binding.update = () =>
        {
            object[property] = binding.manual ? binding.manualValue : update()
        }

        if(this.active)
        {
            binding.instance = panel.addBinding(binding, 'manualValue', settings)
            binding.instance.on('change', () => { binding.manual = true })
            
            this.addButtons(
                panel,
                {
                    manual: () =>
                    {
                        binding.manual = true
                        binding.manualValue = object[property]
                        binding.instance.refresh()
                    },
                    auto: () =>
                    {
                        binding.manual = false
                        binding.update()
                        binding.manualValue = object[property]
                    }
                },
                ''
            )
        }

        return binding
    }

    addThreeColorBinding(panel, object, label)
    {
        return panel.addBinding({ color: object.getHex(THREE.SRGBColorSpace) }, 'color', { label: label, view: 'color' })
                    .on('change', tweak => { object.set(tweak.value) })
    }

    addButtons(panel, buttons, title = '')
    {
        const buttonKeys = Object.keys(buttons)

        panel
            .addBlade({
                view: 'buttongrid',
                size: [ buttonKeys.length, 1 ],
                cells: (x, y) => ({
                    title: [
                        buttonKeys,
                    ][y][x],
                }),
                label: title,
            })
            .on('click', (event) =>
            {
                buttons[event.cell.title](event.cell.title)
            })
    }
}