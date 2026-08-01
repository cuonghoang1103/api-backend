import * as THREE from 'three/webgpu'
import { color, float, texture as textureNode } from 'three/tsl'
import { Game } from '../Game.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'

/**
 * BUỒNG LÁI — nội thất cho chế độ máy quay NGƯỜI THỨ NHẤT.
 *
 * Bật ở Cài đặt → Camera → **Cockpit**, hoặc bấm phím **C**. Máy quay nhảy vào
 * đúng chỗ ngồi của người lái; ngoái đầu bằng chuột. Xem `View.setCockpit()`
 * cho phần máy quay — file này CHỈ dựng những thứ nhìn thấy được từ ghế lái:
 * táp lô, vô lăng quay theo tay lái, hai đồng hồ, lưng ghế, và lòng xe.
 *
 * ─── VÌ SAO PHẢI DỰNG NỘI THẤT BẰNG MÃ ───
 * Đã đo cả ba model trong `static/vehicle/`: chúng CHỈ CÓ VỎ NGOÀI. Danh sách
 * mesh của `default.glb` là `bodyPainted` · `common` · `headlights` ·
 * `stopLights` · `blinker*` · `cells*` · `energy` — không một cái ghế, không
 * một cái vô lăng. Ngồi vào trong mà không dựng gì thì người chơi nhìn thấy
 * một khoang RỖNG và xuyên thẳng qua vỏ xe (mặt trong bị cull).
 *
 * ─── MỌI SỐ ĐO ĐỀU LÀ TỈ LỆ, KHÔNG PHẢI SỐ CỨNG ───
 * Ba chiếc xe hiện có khác cỡ nhau, và `data/garage.js` được làm ra để thêm xe
 * mới bằng MỘT DÒNG. Nếu gõ cứng "vô lăng ở x = 0,1" thì chiếc xe thứ tư nào
 * to hơn sẽ có vô lăng nằm lọt trong khối máy. Nên buồng lái ĐO hộp bao thật
 * của thân xe rồi đặt mọi thứ theo tỉ lệ của hộp đó.
 *
 * ⚠️ ĐO BẰNG `geometry.boundingBox` + CHUỖI `matrix` CỤC BỘ, tuyệt đối KHÔNG
 * dùng `Box3.setFromObject()`. Buồng lái dựng trong `world.step(1)`, lúc đó
 * `matrixWorld` của mọi mesh còn là ma trận đơn vị nên `setFromObject` trả về
 * một cái hộp 1×1×1 ở gốc toạ độ — im lặng, không lỗi nào. Đây đúng là cái bẫy
 * đã mất một buổi ở `FptuDestruction` (xem bàn giao mục 0b).
 *
 * ⚠️ PHẢI LOẠI BÁNH XE VÀ MỌI THỨ GẮN THÊM KHỎI PHÉP ĐO.
 * `chassis` không chỉ chứa thân xe: `VisualVehicle.setWheels()` clone
 * `wheelContainer` vào đó (4 bánh), `VehicleRocket` treo khẩu pháo VÀ bệ phóng
 * lên nóc, và chính buồng lái này cũng nằm trong đó. Đo hết một lượt thì hộp
 * bao vống lên — đo thật ngày 1/8: đỉnh nhảy từ 0,72 lên **1,805** vì khẩu
 * pháo, và người lái bị đặt ngồi lơ lửng trên nóc xe. KHÔNG một lỗi nào báo.
 *
 * Chặn bằng HAI lớp, cố ý thừa một lớp:
 *  1. Nhánh nào mang `userData.vehicleAttachment` (hoặc tên bắt đầu bằng
 *     "wheel") thì bỏ qua. Ai gắn thêm phụ kiện lên xe sau này chỉ cần đặt cờ
 *     đó lên gốc nhánh của mình.
 *  2. `World.js` dựng `Cockpit` TRƯỚC `VehicleRocket`, và `Garage.select()`
 *     cũng gọi `cockpit.reattach()` trước — nên ngay cả khi ai đó quên cờ,
 *     phép đo vẫn diễn ra lúc chassis còn sạch.
 * `tools/check-cockpit.mjs` có mục canh đúng chuyện này.
 *
 * ⚠️ `chassis` trong file .glb có sẵn `position.y` (0,907 ở `default.glb`)
 * nhưng `VisualVehicle.update()` GHI ĐÈ bằng vị trí vật lý mỗi khung hình. Nên
 * mọi số ở đây là toạ độ CỤC BỘ so với chassis, và đo bằng cách đi ngược chuỗi
 * cha tới chassis — không được lấy toạ độ trong file ra dùng thẳng.
 */

/**
 * Tỉ lệ đặt mắt người lái trong hộp bao thân xe.
 *
 * ─── VÌ SAO `alongY` LỚN HƠN 1 ───
 * Vì mấy chiếc xe này ĐẶC RUỘT. Đo bằng cách bắn tia từ 121 điểm trong thân
 * `default.glb` ra chín hướng: mọi điểm nằm dưới nóc đều nằm LỌT TRONG khối
 * hình, không có khoang lái nào cả. Chỉ từ khoảng 1,0 lần chiều cao thân trở
 * lên (y ≈ 0,73 hệ cục bộ) mới ra ngoài khối và nhìn được về phía trước.
 *
 * Nên chỗ ngồi ở đây là kiểu **xe kart / buggy mui trần**: mắt ngay trên thành
 * xe, thấy mui xe trải ra phía trước, còn vô lăng — táp lô — khung kính thì
 * dựng nổi ngay dưới tầm mắt. Đó là góc nhìn trung thực nhất có thể lấy được
 * từ một model không có nội thất, và cũng là góc quen thuộc của game đua.
 *
 * ⚠️ ĐỪNG hạ `alongY` xuống dưới ~1,0 với ý "cho giống ngồi trong xe hơn".
 * Đã thử ở 0,85: máy quay chui vào giữa khối thân, và vì vỏ xe chỉ vẽ MẶT
 * NGOÀI (`FrontSide`) nên hình ra là nhìn xuyên qua xe — không lỗi, chỉ là
 * trông sai. `tools/check-cockpit.mjs` có mục canh đúng chuyện này.
 */
const EYE = {
    // 0 = đuôi, 1 = mũi. 0,40 rơi vào chỗ thân xe cao nhất, tức khoang lái.
    alongX: 0.40,
    /**
     * Theo chiều cao thân, 0 = gầm, 1 = đỉnh. Xem chú thích dài ở trên.
     *
     * ⚠️ 1,38 chứ không phải 1,15. User thử bản 1,15 ngày 1/8 và bác: *"thấp
     * thấp ngang ngang này rất khó nhìn đường"*. Ngồi ngang mép thùng xe thì
     * đường chỉ hiện ra thành một dải mỏng ở giữa khung, còn nửa dưới toàn là
     * mui xe. Nâng lên 1,38 (cao hơn nóc khoảng 0,42) và cho máy quay CHÚC
     * XUỐNG một góc — xem `View.cockpit.basePitch` — thì mặt đường trải ra
     * giữa khung, đúng thứ người lái cần nhìn.
     */
    alongY: 1.38,
    // Lệch sang trái theo bề ngang thân. Việt Nam đi bên phải đường, tay lái
    // thuận nằm bên TRÁI xe. Với `forward = +X` và `up = +Y` thì trái là −Z.
    // Để nhỏ (−0,12 chứ không −0,16) vì lệch càng nhiều thì trụ A bên trái càng
    // sát mắt và càng che khung hình — xem chú thích ở `setWindshield()`.
    alongZ: -0.12,
}

/**
 * Bộ phận nào của buồng lái được dựng.
 *
 * ⚠️ USER ĐÃ TẮT GẦN HẾT, qua ba lượt thử trong cùng buổi 1/8:
 *   · *"xoá cái vô lăng và cái khung đen đen kia cho gọn"* → vô lăng, khung kính
 *   · *"xoá luôn đồng hồ và tay cầm đi kia cho gọn"*       → táp lô, đồng hồ, cần số
 *
 * Bài học chung: mọi thứ dựng thêm trong cabin đều nằm RẤT GẦN mắt, nên dù nhỏ
 * đến đâu nó cũng nở to trong khung hình và ăn mất tầm nhìn. Cái "giống xe thật"
 * và cái "lái được" ở đây ngược nhau. Chỉ còn ghế — thứ duy nhất nằm SAU lưng,
 * ngoài tầm nhìn thẳng, chỉ hiện khi ngoái lại.
 *
 * ⚠️ MÃ DỰNG GIỮ NGUYÊN HẾT, KHÔNG XOÁ. User đổi ý ba lần trong một buổi; bật
 * lại bất cứ món nào chỉ tốn một chữ `true` ở đây, còn xoá đi thì viết lại từ
 * đầu (riêng mặt số đồng hồ vẽ canvas đã tốn kha khá). `tools/check-cockpit.mjs`
 * đọc chính bảng này nên nó tự bỏ qua những mục đang tắt.
 */
const PARTS = {
    seat: true,
    dashboard: false,
    gauges: false,
    gearStick: false,
    steeringWheel: false,
    windshield: false,
}

export class Cockpit
{
    constructor()
    {
        this.game = Game.getInstance()

        // Phơi ra cho `tools/check-cockpit.mjs` biết mục nào đang bật mà bỏ qua
        // đúng chỗ, thay vì báo lỗi oan cho những thứ user cố ý tắt
        this.parts = PARTS

        this.visible = false
        this.bounds = null
        this.eye = new THREE.Vector3()
        this.steeringAngle = 0
        this.needles = { speed: null, rev: null }
        this.smoothed = { speed: 0, rev: 0 }

        this.setMaterials()
        this.attach()

        this.tickCallback = () => this.update()
        // Thứ tự 9: SAU `VisualVehicle` (8) đặt lại vị trí chassis, nên vô lăng
        // và kim đồng hồ luôn khớp đúng khung hình đang vẽ.
        this.game.ticker.events.on('tick', this.tickCallback, 9)
    }

    destroy()
    {
        this.game.ticker.events.off('tick', this.tickCallback)
        this.group?.removeFromParent()
    }

    setMaterials()
    {
        this.materials = {
            // Nhựa nội thất — tối hẳn để tách khỏi cảnh ngoài sáng trưng
            trim: new MeshDefaultMaterial({ colorNode: color('#23242b') }),
            // Kính chắn gió: chỉ là một lớp bóng mờ, không được cản tầm nhìn
            glass: new MeshDefaultMaterial({
                colorNode: color('#9fd4e8'),
                alphaNode: float(0.1),
                transparent: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                alphaTest: 0,
                hasCoreShadows: false,
                hasDropShadows: false,
            }),
            // Da ghế
            seat: new MeshDefaultMaterial({ colorNode: color('#3d2b28') }),
            // Kim loại nan vô lăng, cần số
            metal: new MeshDefaultMaterial({ colorNode: color('#8a8d96') }),
            // Kim đồng hồ
            needle: new MeshDefaultMaterial({ colorNode: color('#ff5a3c') }),
        }
    }

    /**
     * Dựng lại buồng lái trên chiếc xe ĐANG dùng.
     *
     * `Garage.select()` gọi `visualVehicle.destroy()` rồi dựng chiếc mới, nên
     * mọi thứ treo dưới `parts.chassis` cũ biến mất cùng nó. Đây là đúng bài
     * học đã trả giá với khẩu pháo trên nóc (`VehicleRocket.reattach()`): đổi
     * xe xong thì nội thất trống trơn mà KHÔNG có lỗi nào.
     */
    attach()
    {
        const chassis = this.game.world?.visualVehicle?.parts?.chassis
        if(!chassis) return false

        this.group?.removeFromParent()

        this.bounds = this.measureBody(chassis)
        if(!this.bounds) return false

        const b = this.bounds
        this.eye.set(
            b.min.x + EYE.alongX * b.size.x,
            b.min.y + EYE.alongY * b.size.y,
            b.center.z + EYE.alongZ * b.size.z,
        )

        /**
         * MẶT ĐẶT NỘI THẤT — neo theo THÂN XE, KHÔNG theo tầm mắt.
         *
         * Ban đầu mọi thứ đặt lệch so với `eye`, và đó là sai lầm: hễ chỉnh độ
         * cao chỗ ngồi là cả táp lô, vô lăng, khung kính bị nhấc lên theo, lơ
         * lửng giữa không khí. Nội thất thuộc về CHIẾC XE, nên nó phải bám vào
         * đỉnh thân — nâng hạ tầm mắt bao nhiêu cũng không xê dịch.
         */
        this.deck = {
            y: b.max.y + 0.03 * b.size.y,
            dashX: b.min.x + 0.72 * b.size.x,
            wheelX: b.min.x + 0.65 * b.size.x,
            seatX: b.min.x + 0.30 * b.size.x,
        }

        this.group = new THREE.Group()
        this.group.visible = this.visible
        // Cờ để phép đo hộp bao (của chính lần `reattach()` sau, và của bất cứ
        // module nào khác cũng treo đồ lên xe) biết đây không phải thân xe
        this.group.userData.vehicleAttachment = true
        chassis.add(this.group)

        // Xoá sạch tham chiếu cũ trước khi dựng lại. Không làm thì sau khi đổi
        // xe, `update()` vẫn quay kim của chiếc xe VỪA BỊ `destroy()` — mesh mồ
        // côi ngoài scene, nên chẳng thấy gì mà cũng chẳng có lỗi nào.
        this.dashboard = null
        this.gauges = null
        this.glass = null
        this.steeringWheel = null
        this.steeringRim = null
        this.needles = { speed: null, rev: null }

        if(PARTS.dashboard) this.setDashboard()
        if(PARTS.windshield) this.setWindshield()
        if(PARTS.steeringWheel) this.setSteeringWheel()
        if(PARTS.gauges && this.dashboard) this.setGauges()
        if(PARTS.seat) this.setSeat()
        if(PARTS.gearStick) this.setGearStick()

        return true
    }

    /** Dựng lại sau khi đổi xe. Tên đặt trùng `VehicleRocket.reattach()`. */
    reattach()
    {
        this.attach()
    }

    /**
     * Hộp bao thân xe trong hệ toạ độ CỤC BỘ của chassis, đã loại bánh xe.
     *
     * Đi ngược chuỗi cha để nhân các `matrix` cục bộ — cách này KHÔNG phụ thuộc
     * `matrixWorld`, nên đúng ngay cả khi gọi trước khung hình đầu tiên.
     */
    measureBody(chassis)
    {
        const box = new THREE.Box3()
        const piece = new THREE.Box3()
        const matrix = new THREE.Matrix4()
        const chain = []

        chassis.traverse((child) =>
        {
            if(!child.isMesh || !child.geometry) return

            /**
             * Bỏ qua mọi thứ KHÔNG phải thân xe: bốn bánh (`VisualVehicle`
             * clone `wheelContainer` vào chassis), khẩu pháo và bệ phóng
             * (`VehicleRocket`), và chính buồng lái này ở những lần
             * `reattach()` sau — không loại thì mỗi lần đổi xe hộp bao lại
             * phình thêm bằng đúng cái mình vừa dựng.
             */
            let node = child
            let skip = false
            while(node && node !== chassis)
            {
                if(node.userData?.vehicleAttachment || /^wheel/i.test(node.name)) { skip = true; break }
                node = node.parent
            }
            if(skip) return

            if(this.group && this.isDescendantOf(child, this.group)) return

            if(!child.geometry.boundingBox) child.geometry.computeBoundingBox()
            if(!child.geometry.boundingBox) return

            chain.length = 0
            node = child
            while(node && node !== chassis) { chain.push(node); node = node.parent }
            if(node !== chassis) return

            matrix.identity()
            for(let i = chain.length - 1; i >= 0; i--)
            {
                chain[i].updateMatrix()
                matrix.multiply(chain[i].matrix)
            }

            piece.copy(child.geometry.boundingBox).applyMatrix4(matrix)
            box.union(piece)
        })

        if(box.isEmpty()) return null

        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        return { min: box.min.clone(), max: box.max.clone(), size, center }
    }

    isDescendantOf(child, ancestor)
    {
        let node = child
        while(node)
        {
            if(node === ancestor) return true
            node = node.parent
        }
        return false
    }

    /**
     * Táp lô: khối nghiêng trước mặt, mang hai đồng hồ.
     *
     * ⚠️ Mọi thứ ở đây phải NỔI TRÊN mặt thân xe, không thì bị chôn trong khối
     * và người chơi chẳng thấy gì. Với `default.glb`, mặt thân tại chỗ đặt táp
     * lô cao 0,55 (hệ cục bộ) nên táp lô để ở 0,63 là vừa nhô ra.
     */
    setDashboard()
    {
        const b = this.bounds
        const width = b.size.z * 0.62
        const depth = b.size.x * 0.085
        const height = b.size.y * 0.13

        this.dashboard = new THREE.Mesh(
            new THREE.BoxGeometry(depth, height, width),
            this.materials.trim,
        )
        this.dashboard.position.set(
            this.deck.dashX,
            this.deck.y + b.size.y * 0.03,
            b.center.z,
        )
        // Ngả mặt về phía người lái để hai đồng hồ hướng lên đúng tầm mắt
        this.dashboard.rotation.z = -0.24
        this.add(this.dashboard)
    }

    /**
     * Khung kính chắn gió: hai trụ A + thanh nóc + tấm kính mờ.
     *
     * Đây là thứ tạo cảm giác "ngồi trong xe". Model không có khoang lái, nên
     * nếu chỉ có vô lăng với táp lô thì người chơi thấy mình lơ lửng trên nóc;
     * có cái khung viền quanh mép trên khung hình là lập tức thành buồng lái.
     *
     * Kính để `transparent` với alpha rất thấp — đủ để bắt sáng thành một lớp
     * bóng mờ, không đủ để cản tầm nhìn. `depthWrite: false` để nó không cắt
     * mất thứ gì vẽ sau nó.
     */
    setWindshield()
    {
        if(!this.dashboard) return   // chân khung kính neo vào mép táp lô

        const b = this.bounds
        /**
         * Mép trên khung kính phải nằm TRONG tầm nhìn, không thì công dựng ra
         * mà chẳng ai thấy. Với FOV dọc 62° thì nửa khung là 31°; đặt thanh nóc
         * ở góc ngẩng ~16° so với đường ngắm là nó nằm gọn ở phần trên khung
         * hình — vừa đủ viền lấy cảnh, không cắn vào tầm nhìn đường.
         */
        const baseX = this.dashboard.position.x
        const baseY = this.dashboard.position.y + b.size.y * 0.05
        /**
         * ⚠️ Thanh nóc ĐỪNG để sát đầu người lái. Cỡ nó trong khung hình chỉ
         * phụ thuộc khoảng cách: để cách mắt 0,27 thì một thanh dày 0,045 vẫn
         * choán 9° — thành một dải đen dày cộp vắt ngang đỉnh màn hình. Đẩy ra
         * 0,6 là nó về còn hơn 4°, vừa đủ viền lấy cảnh.
         */
        const topX = this.deck.wheelX - b.size.x * 0.05
        const topY = this.eye.y + b.size.y * 0.09
        /**
         * ⚠️ HAI TRỤ A PHẢI ĐẨY RA TỚI MÉP KHUNG HÌNH.
         *
         * Mắt lệch sang trái nên trụ TRÁI bao giờ cũng gần hơn trụ phải, và cái
         * gần thì nở to trong khung. Bản đầu để nửa bề rộng 0,31 lần thân: trụ
         * trái chỉ cách mắt 0,28 theo phương ngang, choán 32° — một thanh đen
         * chắn nguyên góc trái màn hình. Đẩy ra 0,42 lần thân là nó về đúng rìa
         * tầm nhìn (~48°, mà nửa khung ngang là 47°), tức chỉ liếc mới thấy.
         */
        const halfWidth = b.size.z * 0.42
        const pillarThickness = Math.min(b.size.z * 0.024, b.size.y * 0.042)

        const length = Math.hypot(topX - baseX, topY - baseY)
        const tilt = Math.atan2(topX - baseX, topY - baseY)

        // Hai trụ A
        for(const side of [ -1, 1 ])
        {
            const pillar = new THREE.Mesh(
                new THREE.BoxGeometry(pillarThickness, length, pillarThickness),
                this.materials.trim,
            )
            pillar.position.set((baseX + topX) * 0.5, (baseY + topY) * 0.5, b.center.z + side * halfWidth)
            pillar.rotation.z = tilt
            this.add(pillar)
        }

        // Thanh nóc nối hai trụ
        const header = new THREE.Mesh(
            new THREE.BoxGeometry(pillarThickness * 1.3, pillarThickness, halfWidth * 2 + pillarThickness),
            this.materials.trim,
        )
        header.position.set(topX, topY, b.center.z)
        this.add(header)

        // Tấm kính. Giữ tham chiếu để `tools/check-cockpit.mjs` phân biệt được
        // nó với hai mặt số khi soi "tấm phẳng nào quay về phía người lái".
        this.glass = new THREE.Mesh(
            new THREE.PlaneGeometry(halfWidth * 2, length),
            this.materials.glass,
        )
        this.glass.position.set((baseX + topX) * 0.5, (baseY + topY) * 0.5, b.center.z)
        this.glass.rotation.y = Math.PI * 0.5
        this.glass.rotation.z = tilt - Math.PI * 0.5
        this.add(this.glass)
    }

    /**
     * Vô lăng — vành + ba nan + moay-ơ, quay theo `player.steering`.
     *
     * ⚠️ TRỤC VÔ LĂNG DỰNG BẰNG `setFromUnitVectors`, đừng ghép ba góc Euler.
     * `TorusGeometry` nằm trong mặt phẳng XY với trục là Z cục bộ. Cần trục ấy
     * chỉ chếch lên-ra-trước; ghép `rotation.y` rồi `rotation.z` thì góc thứ hai
     * quay quanh trục ĐÃ BỊ góc đầu xoay, ra một hướng khác hẳn ý muốn. Quay
     * thẳng Z sang đúng véc-tơ trục là hết đường sai — và nhờ đó `mesh.rotation.z`
     * ở `update()` chính là góc đánh lái, không cần đổi hệ.
     */
    setSteeringWheel()
    {
        const b = this.bounds
        const radius = Math.min(b.size.z * 0.13, b.size.y * 0.19)
        const tilt = 0.46 // rad, ngả về phía người lái

        /**
         * ⚠️ CỠ VÔ LĂNG PHẢI TÍNH THEO GÓC NHÌN, KHÔNG PHẢI THEO CỠ XE.
         *
         * Bản đầu để bán kính 0,29 ở cách mắt 0,43 — nghe thì hợp lý theo tỉ lệ
         * xe, nhưng nó choán **68°** trong khi cả khung hình dọc chỉ có 62°:
         * cái vành đen bịt kín màn hình, không còn thấy đường đâu nữa. Nay đẩy
         * ra xa 0,72 và hạ xuống, vành chỉ còn ~37° và nằm gọn nửa dưới khung —
         * đúng chỗ vô lăng nằm trong mọi trò đua.
         */
        this.steeringWheel = new THREE.Group()
        this.steeringWheel.position.set(
            this.deck.wheelX,
            this.deck.y + b.size.y * 0.05,
            this.eye.z,
        )
        this.steeringWheel.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(Math.cos(tilt), Math.sin(tilt), 0).normalize(),
        )
        this.add(this.steeringWheel)

        this.steeringRim = new THREE.Group()
        this.steeringWheel.add(this.steeringRim)

        const rim = new THREE.Mesh(
            new THREE.TorusGeometry(radius, radius * 0.10, 8, 24),
            this.materials.trim,
        )
        this.steeringRim.add(rim)

        // Ba nan, lệch nhau 120°
        for(let i = 0; i < 3; i++)
        {
            const angle = Math.PI * 0.5 + (i * Math.PI * 2) / 3
            const spoke = new THREE.Mesh(
                new THREE.BoxGeometry(radius * 0.9, radius * 0.11, radius * 0.07),
                this.materials.metal,
            )
            spoke.position.set(Math.cos(angle) * radius * 0.45, Math.sin(angle) * radius * 0.45, 0)
            spoke.rotation.z = angle
            this.steeringRim.add(spoke)
        }

        const hub = new THREE.Mesh(
            new THREE.CylinderGeometry(radius * 0.26, radius * 0.26, radius * 0.16, 12),
            this.materials.metal,
        )
        hub.rotation.x = Math.PI * 0.5
        this.steeringRim.add(hub)

        // Trục lái nối vô lăng xuống táp lô
        const column = new THREE.Mesh(
            new THREE.CylinderGeometry(radius * 0.12, radius * 0.12, radius * 1.5, 8),
            this.materials.trim,
        )
        column.position.set(0, 0, -radius * 0.85)
        column.rotation.x = Math.PI * 0.5
        this.steeringWheel.add(column)
    }

    /**
     * Hai đồng hồ trên táp lô: tốc độ và vòng tua.
     *
     * Mặt số vẽ MỘT LẦN bằng canvas rồi thôi; chỉ có KIM là mesh xoay. Vẽ lại
     * canvas mỗi khung hình để in con số tốc độ thì tốn hơn hẳn mà người lái
     * cũng chỉ liếc qua — kim quay đã đủ đọc. (Cùng lý do với biển bảng ở khu
     * FPTU: nội dung tĩnh thì canvas, phần động thì hình học.)
     */
    setGauges()
    {
        const b = this.bounds
        const size = Math.min(b.size.z * 0.105, b.size.y * 0.15)
        const spread = size * 0.58

        /**
         * ⚠️ HAI CHỖ RẤT DỄ ĐẶT NGƯỢC, và đặt ngược thì KHÔNG có lỗi nào —
         * đồng hồ vẫn dựng lên, chỉ là người lái không bao giờ nhìn thấy:
         *
         *  1. **Mặt nào của táp lô.** Người lái ngồi ở phía −X so với táp lô,
         *     nên đồng hồ phải gắn ở mặt SAU (x âm trong hệ táp lô). Gắn mặt
         *     trước là chúng quay ra ngoài, chỉ người đi đường mới đọc được.
         *  2. **Mặt phẳng quay hướng nào.** `PlaneGeometry` nhìn theo +Z; muốn
         *     nó nhìn về −X (tức về phía người lái) thì `rotation.y = −π/2`,
         *     KHÔNG phải +π/2 — quay +π/2 là nhìn về +X, tức ra đằng trước.
         *
         * Và đặt quanh `eye.z` chứ không phải tâm xe: cụm đồng hồ nằm trong
         * lòng vô lăng, mà vô lăng thì ở trước mặt người lái.
         */
        this.gauges = new THREE.Group()
        this.gauges.position.set(this.dashboard.position.x, this.dashboard.position.y, this.eye.z)
        this.gauges.rotation.copy(this.dashboard.rotation)
        this.add(this.gauges)

        const faces = [
            { key: 'speed', offset: -spread, label: 'km/h', major: 6 },
            { key: 'rev', offset: spread, label: 'x1000', major: 8 },
        ]

        for(const face of faces)
        {
            const dial = new THREE.Mesh(
                new THREE.PlaneGeometry(size, size),
                this.paintedDial(face.label, face.major),
            )
            dial.rotation.y = -Math.PI * 0.5
            dial.position.set(-b.size.x * 0.045, 0, face.offset)
            this.gauges.add(dial)

            const needle = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.045, size * 0.36, size * 0.02),
                this.materials.needle,
            )
            // Gốc kim ở tâm mặt số: dời hình học lên nửa chiều dài trước khi xoay
            needle.geometry.translate(0, size * 0.16, 0)
            needle.rotation.y = -Math.PI * 0.5
            needle.position.set(-b.size.x * 0.052, 0, face.offset)
            this.gauges.add(needle)

            this.needles[face.key] = needle
        }
    }

    /** Mặt số: vành, vạch chia, chữ. Vẽ một lần. */
    paintedDial(label, majorCount)
    {
        const S = 256
        const canvas = document.createElement('canvas')
        canvas.width = S
        canvas.height = S

        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#15161b'
        ctx.fillRect(0, 0, S, S)

        const cx = S * 0.5
        const cy = S * 0.5
        const radius = S * 0.40

        // Vành ngoài
        ctx.strokeStyle = '#5c6070'
        ctx.lineWidth = S * 0.035
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.stroke()

        // Cung làm việc: từ −225° tới +45° (quay theo chiều kim đồng hồ)
        const START = Math.PI * 0.75
        const SWEEP = Math.PI * 1.5

        for(let i = 0; i <= majorCount * 2; i++)
        {
            const t = i / (majorCount * 2)
            const angle = START + SWEEP * t
            const isMajor = i % 2 === 0
            const inner = radius * (isMajor ? 0.74 : 0.83)

            ctx.strokeStyle = t > 0.82 ? '#ff5a3c' : '#c9ccd6'
            ctx.lineWidth = isMajor ? S * 0.022 : S * 0.012
            ctx.beginPath()
            ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner)
            ctx.lineTo(cx + Math.cos(angle) * radius * 0.94, cy + Math.sin(angle) * radius * 0.94)
            ctx.stroke()

            if(isMajor)
            {
                const value = Math.round((i / 2) * (majorCount === 6 ? 20 : 1))
                ctx.fillStyle = '#c9ccd6'
                ctx.font = `bold ${Math.round(S * 0.085)}px sans-serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(
                    String(value),
                    cx + Math.cos(angle) * radius * 0.58,
                    cy + Math.sin(angle) * radius * 0.58,
                )
            }
        }

        ctx.fillStyle = '#7e8394'
        ctx.font = `${Math.round(S * 0.075)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, cx, cy + radius * 0.48)

        const map = new THREE.CanvasTexture(canvas)
        map.colorSpace = THREE.SRGBColorSpace
        map.anisotropy = 4
        map.needsUpdate = true

        /**
         * ⚠️ `.rgb`, ĐỪNG truyền thẳng `textureNode(map)`.
         *
         * `MeshDefaultMaterial` kết thúc bằng `vec4(outputColor, alphaNode)`.
         * `colorNode` mặc định là `color(...)` — một vec3 — nên vế đó ra đúng
         * bốn thành phần. Đưa vào một texture node (vec4) thì thành NĂM, và
         * three kêu "Length of parameters exceeds maximum length of function
         * vec4()" rồi lặng lẽ cắt bớt: alpha lấy từ texture thay vì từ
         * `alphaNode`. Với mặt số đục thì ảnh ra vẫn đúng, nhưng đó là may chứ
         * không phải thiết kế — và console thì bẩn.
         */
        return new MeshDefaultMaterial({ colorNode: textureNode(map).rgb })
    }

    /** Lưng ghế — thứ người chơi thấy khi ngoái ra sau. */
    setSeat()
    {
        const b = this.bounds

        const back = new THREE.Mesh(
            new THREE.BoxGeometry(b.size.x * 0.05, b.size.y * 0.30, b.size.z * 0.24),
            this.materials.seat,
        )
        back.position.set(
            this.deck.seatX,
            this.deck.y + b.size.y * 0.12,
            this.eye.z,
        )
        back.rotation.z = 0.13
        this.add(back)

        // Tựa đầu — mảnh nhỏ nhưng là thứ khẳng định "đang ngồi trên một cái ghế"
        const headrest = new THREE.Mesh(
            new THREE.BoxGeometry(b.size.x * 0.045, b.size.y * 0.09, b.size.z * 0.15),
            this.materials.seat,
        )
        headrest.position.set(
            this.deck.seatX - b.size.x * 0.012,
            this.deck.y + b.size.y * 0.31,
            this.eye.z,
        )
        this.add(headrest)
    }

    /** Cần số bên phải ghế lái. */
    setGearStick()
    {
        const b = this.bounds
        const height = b.size.y * 0.15

        const stick = new THREE.Mesh(
            new THREE.CylinderGeometry(b.size.z * 0.012, b.size.z * 0.018, height, 6),
            this.materials.metal,
        )
        stick.position.set(
            this.deck.wheelX - b.size.x * 0.04,
            this.deck.y + b.size.y * 0.02,
            this.eye.z + b.size.z * 0.26,
        )
        stick.rotation.z = -0.16
        this.add(stick)

        const knob = new THREE.Mesh(
            new THREE.SphereGeometry(b.size.z * 0.022, 10, 8),
            this.materials.trim,
        )
        knob.position.set(
            stick.position.x + height * 0.08,
            stick.position.y + height * 0.5,
            stick.position.z,
        )
        this.add(knob)
    }

    add(mesh)
    {
        mesh.castShadow = false
        mesh.receiveShadow = false
        this.group.add(mesh)
    }

    setVisible(visible)
    {
        this.visible = visible
        if(this.group) this.group.visible = visible
    }

    update()
    {
        if(!this.visible || !this.group) return

        const delta = this.game.ticker.delta
        const player = this.game.player
        const physical = this.game.physicalVehicle

        // Vô lăng — góc bám theo tay lái, không nhảy giật
        const target = -(player?.steering ?? 0) * Math.PI * 0.62
        this.steeringAngle += (target - this.steeringAngle) * Math.min(1, delta * 12)
        if(this.steeringRim) this.steeringRim.rotation.z = this.steeringAngle

        // Kim tốc độ: 0 → 120 km/h trên cung 270°
        const speed = physical?.xzSpeed ?? 0
        this.smoothed.speed += (speed - this.smoothed.speed) * Math.min(1, delta * 6)
        if(this.needles.speed)
            this.needles.speed.rotation.z = this.dialAngle(this.smoothed.speed / 42)

        // Kim vòng tua: ga cộng thêm phần tăng tốc
        const rev = Math.min(1, Math.abs(player?.accelerating ?? 0) * 0.62 + (player?.boosting ?? 0) * 0.3 + Math.min(0.45, speed / 90))
        this.smoothed.rev += (rev - this.smoothed.rev) * Math.min(1, delta * 9)
        if(this.needles.rev)
            this.needles.rev.rotation.z = this.dialAngle(this.smoothed.rev)
    }

    /**
     * Đổi tỉ lệ 0…1 thành góc kim.
     *
     * Mặt số vẽ cung từ 135° tới 405° theo hệ toạ độ canvas (Y hướng XUỐNG);
     * kim là mesh trong hệ 3D (Y hướng LÊN) nên chiều quay ngược lại. Kim đứng
     * ở 0 khi chỉ về phía dưới-trái, tức lệch −135° so với trục dựng đứng.
     */
    dialAngle(ratio)
    {
        const clamped = Math.max(0, Math.min(1, ratio))
        return Math.PI * 0.75 - clamped * Math.PI * 1.5
    }
}
