import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import { Events } from './Events.js'
import { uniform, color, float, Fn, vec4, positionWorld, vec3, mix, max, If, frontFacing } from 'three/tsl'


export class Lighting
{
    constructor()
    {
        this.game = Game.getInstance()
        this.events = new Events()

        this.useDayCycles = true
        this.phi = 0.63
        this.theta = 0.72
        this.phiAmplitude = 0.62
        this.thetaAmplitude = 1.25
        this.near = 1
        this.spherical = new THREE.Spherical(this.game.view.optimalArea.radius + this.near, this.phi, this.theta)
        this.direction = new THREE.Vector3().setFromSpherical(this.spherical).normalize()
        this.directionUniform = uniform(this.direction)
        this.colorUniform = uniform(color('#ffffff'))
        this.intensityUniform = uniform(1)
        this.count = 1
        this.mapSize = this.game.quality.level === 0 ? 2048 : 512
        this.shadowAmplitude = this.game.view.optimalArea.radius
        this.depth = this.game.view.optimalArea.radius * 2
        this.shadowBias = -0.001
        this.shadowNormalBias = 0.1
        this.shadowRadius = this.game.quality.level === 0 ? 3 : 2

        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '💡 Lighting',
                expanded: false,
            })
        }

        this.setNodes()
        this.setHeadlights()
        this.setLight()
        this.updateShadow()
        this.setHelpers()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 9)

        this.game.viewport.events.on('throttleChange', () =>
        {
            this.spherical.radius = this.game.view.optimalArea.radius
            this.shadowAmplitude = this.game.view.optimalArea.radius
            this.updateShadow()
        }, 3)

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'useDayCycles')
            this.debugPanel.addBinding(this, 'phi', { min: 0, max: Math.PI * 0.5 }).on('change', () => this.updateCoordinates())
            this.debugPanel.addBinding(this, 'theta', { min: - Math.PI, max: Math.PI }).on('change', () => this.updateCoordinates())
            this.debugPanel.addBinding(this, 'phiAmplitude', { min: 0, max: Math.PI}).on('change', () => this.updateCoordinates())
            this.debugPanel.addBinding(this, 'thetaAmplitude', { min: - Math.PI, max: Math.PI }).on('change', () => this.updateCoordinates())
            this.debugPanel.addBinding(this.spherical, 'radius', { min: 0, max: 100 }).on('change', () => this.updateCoordinates())
            this.debugPanel.addBlade({ view: 'separator' })
            this.debugPanel.addBinding(this, 'near', { min: 0.1, max: 50, step: 0.1 }).on('change', () => this.updateShadow())
            this.debugPanel.addBinding(this, 'depth', { min: 0.1, max: 100, step: 0.1 }).on('change', () => this.updateShadow())
            this.debugPanel.addBinding(this, 'shadowAmplitude', { min: 1, max: 50 }).on('change', () => this.updateShadow())
            this.debugPanel.addBinding(this, 'shadowBias', { min: -0.02, max: 0.02 }).on('change', () => this.updateShadow())
            this.debugPanel.addBinding(this, 'shadowNormalBias', { min: -0.3, max: 0.3 }).on('change', () => this.updateShadow())
            this.debugPanel.addBinding(this, 'shadowRadius', { min: 0, max: 10 }).on('change', () => this.updateShadow())

            const mapSizes = {}
            for(let i = 0; i < 12; i++)
            {
                const size = Math.pow(2, i + 1)
                mapSizes[size] = size
            }
        }
    }

    setNodes()
    {
        this.lightBounceEdgeLow = uniform(float(-1))
        this.lightBounceEdgeHigh = uniform(float(1))
        this.lightBounceDistance = uniform(float(1.5))
        this.lightBounceMultiplier = uniform(float(1))

        this.shadowColor = uniform(this.game.dayCycles.properties.shadowColor.value)
        this.bounceColor = uniform(color('#82487f'))
        this.coreShadowEdgeLow = uniform(float(-0.25))
        this.coreShadowEdgeHigh = uniform(float(1))

        // Debug
        if(this.game.debug.active)
        {
            this.game.debug.addThreeColorBinding(this.debugPanel, this.bounceColor.value, 'bounceColor')
            this.debugPanel.addBinding(this.lightBounceEdgeLow, 'value', { label: 'lightBounceEdgeLow', min: - 1, max: 1, step: 0.01 })
            this.debugPanel.addBinding(this.lightBounceEdgeHigh, 'value', { label: 'lightBounceEdgeHigh', min: - 1, max: 1, step: 0.01 })
            this.debugPanel.addBinding(this.lightBounceDistance, 'value', { label: 'lightBounceDistance', min: 0, max: 5, step: 0.01 })
            this.debugPanel.addBinding(this.lightBounceMultiplier, 'value', { label: 'lightBounceMultiplier', min: 0, max: 1, step: 0.01 })

            this.debugPanel.addBlade({ view: 'separator' })
            this.debugPanel.addBinding(this.coreShadowEdgeLow, 'value', { label: 'coreShadowEdgeLow', min: - 1, max: 1, step: 0.01 })
            this.debugPanel.addBinding(this.coreShadowEdgeHigh, 'value', { label: 'coreShadowEdgeHigh', min: - 1, max: 1, step: 0.01 })
        }
    }

    /**
     * ĐÈN PHA XE — nguồn sáng thứ hai của thế giới.
     *
     * ─── VÌ SAO PHẢI TỰ TÍNH THAY VÌ THÊM MỘT ĐÈN CỦA THREE.JS ───
     * Cả thế giới này chỉ có ĐÚNG MỘT đèn (`count = 1`, đèn hướng ở dưới) và
     * mọi vật đều tự tính sáng-tối bằng TSL trong `MeshDefaultMaterial`, không
     * đi qua hệ chiếu sáng của three.js. Thả một `SpotLight` vào đây là nó
     * không ăn vào đâu cả, lại còn kéo theo bản đồ bóng đổ thứ hai rất đắt.
     *
     * Nên đèn pha là một số hạng CỘNG THÊM vào vật liệu chung: vài phép tính
     * mỗi điểm ảnh, KHÔNG thêm lượt vẽ, KHÔNG thêm bản đồ bóng đổ.
     *
     * ─── CHỐT AN TOÀN ───
     * `intensity = 0` thì số hạng bằng 0 tuyệt đối ⇒ ảnh ra y hệt như trước khi
     * có tính năng này. Ban ngày và trên máy không bật đèn đều rơi vào nhánh đó.
     */
    setHeadlights()
    {
        this.headlights = {}

        // Vị trí và hướng của cặp đèn — `VisualVehicle` cập nhật mỗi khung hình
        this.headlights.position = uniform(new THREE.Vector3(0, 0.6, 0))
        this.headlights.direction = uniform(new THREE.Vector3(0, 0, 1))

        // 0 = tắt hẳn. Bật/tắt theo ngày đêm bằng cách chạy số này lên xuống
        this.headlights.intensity = uniform(float(0))

        /**
         * Chế độ do người chơi chọn (nút Headlights trong bảng Cài đặt).
         *  · auto = sáng khi trời tối, tắt khi trời sáng (mặc định)
         *  · on   = luôn sáng, kể cả giữa trưa
         *  · off  = không bao giờ sáng
         *
         * Để ở ĐÂY chứ không để trong `VisualVehicle` vì cái xe chỉ sinh ra ở
         * `World.step(1)`, mãi sau khi bảng Cài đặt được dựng — mà `Lighting`
         * thì sống suốt.
         */
        this.headlights.modes = [ 'auto', 'on', 'off' ]
        this.headlights.labels = { auto: 'Auto', on: 'On', off: 'Off' }
        this.headlights.mode = 'auto'

        const storedMode = localStorage.getItem('headlightsMode')
        if(storedMode && this.headlights.modes.includes(storedMode))
            this.headlights.mode = storedMode

        this.headlights.setMode = (mode) =>
        {
            if(!this.headlights.modes.includes(mode))
                return

            this.headlights.mode = mode
            localStorage.setItem('headlightsMode', mode)
            this.events.trigger('headlightsChange')
        }

        this.headlights.nextMode = () =>
        {
            const index = this.headlights.modes.indexOf(this.headlights.mode)
            this.headlights.setMode(this.headlights.modes[(index + 1) % this.headlights.modes.length])
        }

        // Đèn CÓ NÊN sáng lúc này không — `VisualVehicle` hỏi mỗi khung hình
        this.headlights.shouldBeOn = () =>
        {
            if(this.headlights.mode === 'on')
                return true

            if(this.headlights.mode === 'off')
                return false

            return this.game.dayCycles.isNight()
        }

        this.headlights.color = uniform(color('#ffeccc'))
        this.headlights.distance = uniform(float(26)) // chiếu xa bao nhiêu
        this.headlights.spread = uniform(float(0.55)) // độ mở của chùm sáng
        this.headlights.softness = uniform(float(0.42)) // mép chùm mềm hay gắt

        if(this.game.debug.active)
        {
            const panel = this.debugPanel.addFolder({ title: '🔦 Headlights', expanded: false })
            panel.addBinding(this.headlights.intensity, 'value', { label: 'intensity', min: 0, max: 4, step: 0.01 })
            panel.addBinding(this.headlights.distance, 'value', { label: 'distance', min: 1, max: 80, step: 0.5 })
            panel.addBinding(this.headlights.spread, 'value', { label: 'spread', min: 0.05, max: 1, step: 0.01 })
            panel.addBinding(this.headlights.softness, 'value', { label: 'softness', min: 0.01, max: 1, step: 0.01 })
            this.game.debug.addThreeColorBinding(panel, this.headlights.color.value, 'color')
        }

        /**
         * Số hạng ánh sáng cộng thêm cho một điểm trên bề mặt.
         *
         * @param {*} surfaceNormal pháp tuyến ĐÃ lật đúng chiều của bề mặt
         */
        this.headlights.getContribution = (surfaceNormal) =>
        {
            const toSurface = positionWorld.sub(this.headlights.position)

            /**
             * ⚠️ TUYỆT ĐỐI KHÔNG dùng `.normalize()` ở đây.
             *
             * Điểm đang vẽ trùng đúng vị trí đèn thì vector bằng 0, `normalize`
             * ra NaN, và một NaN chảy vào là đủ GIẾT CẢ VÒNG LẶP VẼ mà không in
             * một dòng lỗi nào (bẫy đã ghi trong `data/social.js` của bản gốc).
             * Nên chia tay bằng khoảng cách đã kẹp sàn.
             */
            const distance = toSurface.length().max(0.001)
            const direction = toSurface.div(distance)

            // Trong hay ngoài chùm sáng
            const alignment = direction.dot(this.headlights.direction)
            const cone = alignment.smoothstep(
                this.headlights.spread.oneMinus(),
                this.headlights.spread.oneMinus().add(this.headlights.softness).min(0.999)
            )

            // Xa thì tối dần, bình phương cho giống ánh sáng thật
            const falloff = distance.div(this.headlights.distance).oneMinus().max(0).pow(2)

            // Mặt quay lưng lại thì không nhận sáng
            const facing = surfaceNormal.dot(direction.negate()).max(0)

            return this.headlights.color.mul(
                cone.mul(falloff).mul(facing).mul(this.headlights.intensity)
            )
        }
    }

    setLight()
    {
        this.light = new THREE.DirectionalLight(0xffffff, 5)
        this.light.position.setFromSpherical(this.spherical)
        this.light.castShadow = true

        this.game.scene.add(this.light)
        this.game.scene.add(this.light.target)
    }

    setHelpers()
    {
        // Direction helper
        this.directionHelper = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.25, 1),
            new THREE.MeshBasicNodeMaterial({ wireframe: true })
        )
        this.directionHelper.userData.preventPreRender = true
        this.directionHelper.visible = false

        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 5),
        ]
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        line.userData.preventPreRender = true
        this.directionHelper.add(line)

        this.game.scene.add(this.directionHelper)

        // Shadow helper
        this.shadowHelper = new THREE.CameraHelper(this.light.shadow.camera)
        this.shadowHelper.visible = false
        this.shadowHelper.userData.preventPreRender = true
        this.game.scene.add(this.shadowHelper)

        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this.directionHelper, 'visible', { label: 'directionHelper' })
            this.debugPanel.addBinding(this.shadowHelper, 'visible', { label: 'shadowHelper' })
        }
    }

    updateShadow()
    {
        this.light.shadow.camera.top = this.shadowAmplitude
        this.light.shadow.camera.right = this.shadowAmplitude
        this.light.shadow.camera.bottom = - this.shadowAmplitude
        this.light.shadow.camera.left = - this.shadowAmplitude
        this.light.shadow.camera.near = this.near
        this.light.shadow.camera.far = this.near + this.depth
        this.light.shadow.bias = this.shadowBias
        this.light.shadow.normalBias = this.shadowNormalBias
        this.light.shadow.radius = this.shadowRadius

        this.light.shadow.camera.updateProjectionMatrix()
        this.light.shadow.mapSize.set(this.mapSize, this.mapSize)

        this.game.quality.events.on('change', () =>
        {
            this.mapSize = this.game.quality.level === 0 ? 2048 : 512
            this.light.shadow.mapSize.set(this.mapSize, this.mapSize)
        })
    }

    updateCoordinates()
    {
        this.direction.setFromSpherical(this.spherical).normalize()
    }

    update()
    {
        // Spherical coordinates
        if(this.useDayCycles)
        {
            const progressOffset = 9/16
            this.spherical.theta = this.theta + Math.sin(- (this.game.dayCycles.progress + progressOffset) * Math.PI * 2) * this.thetaAmplitude
            this.spherical.phi = this.phi + (Math.cos(- (this.game.dayCycles.progress + progressOffset) * Math.PI * 2) * 0.5) * this.phiAmplitude
        }
        else
        {
            this.spherical.theta = this.theta
            this.spherical.phi = this.phi
        }

        // Direction (for shaders)
        this.direction.setFromSpherical(this.spherical).normalize()
        
        // Actual lights transform
        const optimalRoundedPosition = this.game.view.optimalArea.position.clone()
        // optimalRoundedPosition.x = Math.round(optimalRoundedPosition.x)
        // optimalRoundedPosition.y = Math.round(optimalRoundedPosition.y)
        // optimalRoundedPosition.z = Math.round(optimalRoundedPosition.z)
        
        this.light.position.setFromSpherical(this.spherical).add(optimalRoundedPosition)
        this.light.target.position.copy(optimalRoundedPosition)

        // Helper
        this.directionHelper.position.copy(this.direction).multiplyScalar(5).add(this.game.view.focusPoint.position)
        this.directionHelper.lookAt(this.game.view.focusPoint.position)

        // Apply day cycles values
        this.colorUniform.value.copy(this.game.dayCycles.properties.lightColor.value)
        this.intensityUniform.value = this.game.dayCycles.properties.lightIntensity.value
    }
}