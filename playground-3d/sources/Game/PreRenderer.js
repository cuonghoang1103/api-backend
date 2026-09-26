import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import CubeRenderTarget from 'three/src/renderers/common/CubeRenderTarget.js'

/**
 * Vẽ trước MỌI vật thể (kể cả thứ đang ẩn) vào một cube camera 32px để
 * three.js dựng sẵn shader — không thì shader được dựng lúc vật thể lần đầu
 * lọt vào khung hình, và người chơi thấy giật đúng lúc đó.
 *
 * ⚠️ CHIA LÔ, KHÔNG VẼ MỘT PHÁT (26/09/2026). Bản cũ gọi `cubeCamera.update()`
 * MỘT lần cho cả thế giới: ~580 pipeline dựng liền trong một tác vụ JS, đo
 * được một khung kẹt **2,4 giây** trên M1 Max — máy yếu, iPad, iPhone đơ lâu
 * gấp nhiều lần và người chơi tưởng "treo cả máy". Việc phải làm vẫn y nguyên
 * (cùng vật thể, cùng camera, cùng bóng đổ ⇒ cùng bộ đệm shader); chỉ khác là
 * mỗi lô chỉ bật MỘT NHÓM vật thể, chạy tối đa `budgetMs` rồi nhường trình
 * duyệt một khung hình.
 *
 * Vòng render chính TẠM DỪNG trong lúc này: nó mà chạy thì sẽ vẽ ra thế giới
 * đang bị ẩn bớt để chia lô. Màn hình chờ đứng yên ở khung cuối — trình duyệt
 * vẫn phản hồi, chỉ có cảnh 3D là chưa nhúc nhích.
 */
export class PreRenderer
{
    static async render({ batchSize = 16, budgetMs = 24 } = {})
    {
        const game = Game.getInstance()
        const renderer = game.rendering.renderer

        // Setup
        const renderTarget = new CubeRenderTarget(32)
        const cubeCamera = new THREE.CubeCamera(1, 100000, renderTarget)

        /**
         * Chụp trạng thái hiện có. Giữ nguyên luật của bản cũ: vật thể ẩn mà
         * có `userData.preventPreRender` thì để ẩn (và cả cây con của nó).
         */
        const saved = []
        const drawables = []
        const walk = (object) =>
        {
            if(object.visible === false && typeof object.userData.preventPreRender !== 'undefined')
                return

            saved.push([ object, object.visible ])

            if(object.isMesh || object.isPoints || object.isLine || object.isSprite)
                drawables.push(object)

            for(const child of object.children)
                walk(child)
        }
        walk(game.scene)

        game.scene.add(cubeCamera)
        game.rendering.pauseLoop()

        try
        {
            // Mọi nút cha/đèn bật, mọi thứ vẽ được tắt — rồi bật dần theo lô
            for(const [ object ] of saved)
                object.visible = true
            for(const object of drawables)
                object.visible = false

            let sliceStart = performance.now()
            for(let i = 0; i < drawables.length; i += batchSize)
            {
                const batch = drawables.slice(i, i + batchSize)

                for(const object of batch)
                    object.visible = true

                cubeCamera.update(renderer, game.scene)

                for(const object of batch)
                    object.visible = false

                // Hết ngân sách của khung này → nhường trình duyệt vẽ/nhận input
                if(performance.now() - sliceStart > budgetMs)
                {
                    await new Promise((resolve) => requestAnimationFrame(resolve))
                    sliceStart = performance.now()
                }
            }
        }
        finally
        {
            // Trả lại đúng trạng thái cũ, kể cả khi có lỗi giữa chừng
            for(const [ object, visible ] of saved)
                object.visible = visible

            game.scene.remove(cubeCamera)
            renderTarget.dispose()
            game.rendering.resumeLoop()
        }
    }
}
