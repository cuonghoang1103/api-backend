import * as THREE from 'three/webgpu'
import { color, float, Fn, instancedArray, mix, normalWorld, positionGeometry, step, texture, uniform, uv, vec2, vec3, vec4 } from 'three/tsl'
import { Inputs } from '../../Inputs/Inputs.js'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import gsap from 'gsap'
import { MeshDefaultMaterial } from '../../Materials/MeshDefaultMaterial.js'

export class LandingArea extends Area
{
    constructor(model)
    {
        super(model)

        this.localTime = uniform(0)

        this.setLetters()
        this.setKiosk()
        this.setControls()
        this.setBonfire()
        this.setAchievement()
    }

    setLetters()
    {
        const references = this.references.items.get('letters')

        for(const reference of references)
        {
            const physical = reference.userData.object.physical
            physical.colliders[0].setActiveEvents(this.game.RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
            physical.colliders[0].setContactForceEventThreshold(5)
            physical.onCollision = (force, position) =>
            {
                this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
            }
        }

        // Tắt chữ "CUONG THAI" = chú thích đúng dòng dưới. Thế giới về nguyên bản.
        this.replaceLettersWithBrand(references)
    }

    /**
     * Dựng chữ "CUONG THAI" trên mặt đất, thay cho tên tác giả gốc.
     *
     * CÁCH LÀM — đã đổi hẳn sau bốn lần hỏng ở cách cũ.
     * Cách cũ tráo hình học vào chính các nút chữ cũ, nên phải khớp đúng thứ tự
     * hai bộ, phải co hộp va chạm, phải đổi hệ toạ độ của từng nút cha, và phải
     * sửa toạ độ texture. Sai một chỗ là chữ chồng nhau hoặc văng mất — và cả
     * bốn chỗ đó đều đã sai ít nhất một lần.
     *
     * Cách này giấu hết chữ cũ rồi tự dựng nhóm chữ mới, nên chỉ còn phụ thuộc
     * ĐÚNG HAI thứ lấy từ chữ cũ: tâm hàng chữ và vật liệu. Không cần biết nút
     * nào là chữ nào, không cần tên nút (References.js băm tên đi), không cần
     * hộp va chạm, không cần đổi hệ toạ độ.
     *
     * ĐÁNH ĐỔI: chữ mới KHÔNG đâm đổ được, chữ cũ thì đổ. Ưu tiên hiện cho đúng
     * đã; muốn cho đổ thì thêm thân vật lý sau dựa trên hộp bao từng chữ.
     */
    replaceLettersWithBrand(references)
    {
        if(!references || references.length === 0)
            return

        // ── Hai thứ cần lấy từ chữ cũ ──────────────────────────────────────
        // Tâm hàng = TRUNG BÌNH vị trí mọi chữ cũ, đọc từ thân vật lý (toạ độ
        // thế giới thật, không phụ thuộc ma trận). Dùng trung bình chứ không lấy
        // hai đầu: khỏi cần biết nút nào nằm đâu.
        const center = new THREE.Vector3()
        let counted = 0
        let material = null
        let referenceUv = null

        for(const reference of references)
        {
            const body = reference.userData.object?.physical?.body
            if(body)
            {
                const t = body.translation()
                center.x += t.x
                center.y += t.y
                center.z += t.z
                counted++
            }

            reference.traverse((child) =>
            {
                if(!child.isMesh)
                    return
                if(!material)
                    material = child.material
                if(!referenceUv && child.geometry?.attributes?.uv)
                    referenceUv = child.geometry.attributes.uv
            })
        }

        if(counted === 0 || !material)
            return

        center.multiplyScalar(1 / counted)

        this.game.resourcesLoader.getLoader('gltf').load(
            'title/letters.glb',
            (gltf) =>
            {
                try
                {
                    gltf.scene.updateMatrixWorld(true)

                    const sources = []
                    gltf.scene.traverse((child) =>
                    {
                        if(child.isMesh && child.geometry)
                            sources.push(child)
                    })
                    if(sources.length === 0)
                        return

                    // Tâm hàng chữ mới, để canh vào tâm hàng chữ cũ.
                    const newCenter = new THREE.Vector3()
                    const position = new THREE.Vector3()
                    for(const source of sources)
                    {
                        source.getWorldPosition(position)
                        newCenter.add(position)
                    }
                    newCenter.multiplyScalar(1 / sources.length)

                    const group = new THREE.Group()
                    group.name = 'cuongThaiTitle'

                    // Cặp hình ↔ thân vật lý, để đồng bộ mỗi khung hình bên dưới.
                    const bodies = []

                    // ── Kéo chữ thấp lên cho bằng hàng ─────────────────────
                    // Phông Pally cho chữ T thấp hơn hẳn: đo được 1,339 trong khi
                    // H và I cao 1,419, A cao 1,401. Nhìn bằng mắt là thấy T lùn.
                    // Lấy trung vị chiều cao làm chuẩn thay vì gán cứng "chữ T" —
                    // đổi chữ khác hay đổi phông thì chỗ này vẫn tự đúng.
                    // Chiều cao nằm ở trục Y: hình học xuất theo quy ước Y-up nên
                    // trục cao của Blender (Z) đã hoán sang Y.
                    const heights = sources.map((source) =>
                    {
                        source.geometry.computeBoundingBox()
                        const b = source.geometry.boundingBox
                        return b ? b.max.y - b.min.y : 0
                    })
                    const sortedHeights = heights.slice().filter(h => h > 0).sort((a, b) => a - b)
                    const medianHeight = sortedHeights.length > 0
                        ? sortedHeights[Math.floor(sortedHeights.length / 2)]
                        : 0

                    for(let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++)
                    {
                        const source = sources[sourceIndex]
                        const geometry = source.geometry

                        // Vật liệu 'palette' tra màu từ một tấm bảng màu, và chữ gốc
                        // có MỌI đỉnh trỏ vào đúng một ô nên ra màu phẳng. Hình học
                        // từ Blender trải toạ độ khắp 0..1 nên quét cả bảng và ra sọc
                        // cầu vồng — ép mọi đỉnh về đúng ô của chữ cũ.
                        if(referenceUv && geometry.attributes?.uv)
                        {
                            const u = referenceUv.getX(0)
                            const v = referenceUv.getY(0)
                            const uv = geometry.attributes.uv
                            for(let k = 0; k < uv.count; k++)
                                uv.setXY(k, u, v)
                            uv.needsUpdate = true
                        }

                        const mesh = new THREE.Mesh(geometry, material)
                        mesh.castShadow = true
                        mesh.receiveShadow = true
                        mesh.quaternion.copy(source.quaternion)
                        mesh.scale.copy(source.scale)

                        // Chữ nào lùn hơn hàng thì kéo lên cho bằng trung vị.
                        // Phóng ĐỀU ba chiều chứ không kéo dãn riêng chiều cao —
                        // kéo dãn một chiều làm nét chữ méo, nhìn ra ngay.
                        let letterScale = 1
                        const height = heights[sourceIndex]
                        if(height > 0 && medianHeight > 0 && height < medianHeight * 0.98)
                        {
                            letterScale = medianHeight / height
                            mesh.scale.multiplyScalar(letterScale)
                        }

                        // Vị trí = tâm hàng cũ + độ lệch của chữ trong hàng mới.
                        // Nhờ vậy khoảng cách giữa các chữ đúng y bố cục của phông,
                        // còn cả hàng nằm chính giữa chỗ hàng chữ cũ.
                        source.getWorldPosition(position)
                        mesh.position.copy(center).add(position.sub(newCenter))

                        // Gốc toạ độ nằm ở TÂM khối chữ, nên phóng to làm đáy tụt
                        // xuống dưới mặt đất đúng một nửa phần cao thêm. Nâng lại
                        // đúng chừng đó để chân chữ vẫn đứng bằng hàng.
                        if(letterScale !== 1)
                            mesh.position.y += (height * letterScale - height) / 2

                        // Hình LUÔN do mình giữ và tự treo vào cảnh.
                        // KHÔNG dùng game.objects.add: nó không gắn hình vào cảnh
                        // như tôi tưởng — chữ nào tạo thân vật lý xong là biến mất,
                        // chỉ những chữ tạo HỎNG mới hiện nhờ đường lui. Đúng cái
                        // đã thấy: mất I,A,H,T còn lại C,U,O,N,G.
                        group.add(mesh)

                        // ── Thân vật lý để xe đâm đổ được ──────────────────
                        // Hộp va chạm đo từ hộp bao của CHÍNH chữ này. Gốc toạ độ
                        // của hình học đã nằm ở tâm khối (đặt lúc dựng trong
                        // Blender) nên hộp bao đối xứng quanh gốc, lấy nửa-kích-thước
                        // thẳng được. Đây đúng chỗ đã làm hỏng lần trước: hồi đó tôi
                        // giữ hộp của chữ cũ nên các hộp chồng nhau và chữ văng.
                        try
                        {
                            geometry.computeBoundingBox()
                            const box = geometry.boundingBox
                            if(!box)
                                continue

                            const physical = this.game.physics.getPhysical({
                                type: 'dynamic',
                                position: mesh.position,
                                rotation: mesh.quaternion,
                                friction: 0.7,
                                // mass 0.2 lấy từ chữ gốc — nhẹ đủ để xe hất đổ mà
                                // không nảy như quả bóng.
                                mass: 0.2,
                                sleeping: true,
                                colliders: [ {
                                    shape: 'cuboid',
                                    // Nhân theo letterScale: hộp bao đo trên hình học
                                    // GỐC, còn chữ được kéo to thì hộp phải to theo,
                                    // nếu không xe húc vào khoảng không quanh chữ.
                                    parameters: [
                                        Math.max((box.max.x - box.min.x) / 2 * letterScale, 0.05),
                                        Math.max((box.max.y - box.min.y) / 2 * letterScale, 0.05),
                                        Math.max((box.max.z - box.min.z) / 2 * letterScale, 0.05),
                                    ],
                                    category: 'object',
                                } ],
                                contactThreshold: 5,
                                onCollision: (force, hitPosition) =>
                                {
                                    this.game.audio.groups.get('hitBrick').playRandomNext(force, hitPosition)
                                },
                            })

                            if(physical?.body)
                                bodies.push({ mesh, body: physical.body })
                        }
                        catch(physicsError)
                        {
                            // Chữ này không đổ được, nhưng vẫn hiện đúng chỗ.
                            console.warn('[CT] khong tao duoc than vat ly:', physicsError)
                        }
                    }

                    if(group.children.length > 0)
                        this.game.scene.add(group)

                    // Tự đồng bộ hình theo thân vật lý mỗi khung hình — giống cách
                    // Bricks.js làm. Chỉ đụng vào chữ đang thức để khỏi tốn công với
                    // chín chữ nằm yên suốt.
                    if(bodies.length > 0)
                    {
                        this.game.ticker.events.on('tick', () =>
                        {
                            for(const item of bodies)
                            {
                                if(item.body.isSleeping() || !item.body.isEnabled())
                                    continue

                                const t = item.body.translation()
                                const r = item.body.rotation()
                                item.mesh.position.set(t.x, t.y, t.z)
                                item.mesh.quaternion.set(r.x, r.y, r.z, r.w)
                            }
                        }, 10)
                    }

                    // Giấu chữ cũ SAU KHI dựng xong chữ mới — hỏng giữa chừng thì
                    // vẫn còn chữ cũ để nhìn, không ra một khoảng đất trống.
                    for(const reference of references)
                    {
                        reference.visible = false
                        reference.scale.setScalar(0)
                        reference.updateMatrixWorld(true)
                        reference.userData.object?.physical?.body?.setEnabled(false)
                    }

                }
                catch(error)
                {
                    // Nuốt lỗi có chủ đích: chữ sai còn hơn cả thế giới sập.
                    console.warn('[CT] khong dung duoc chu:', error)
                }
            },
            undefined,
            () => {}, // tải hỏng => giữ nguyên chữ cũ
        )
    }


    setKiosk()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('kioskInteractivePoint')[0].position,
            'Map',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.modals.open('map')
                // interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // this.game.map.items.get('map').events.on('close', () =>
        // {
        //     interactivePoint.show()
        // })
    }

    setControls()
    {
        // Interactive point
        const interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('controlsInteractivePoint')[0].position,
            'Controls',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.inputs.interactiveButtons.clearItems()
                this.game.menu.open('controls')
                interactivePoint.hide()
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )

        // Menu instance
        const menuInstance = this.game.menu.items.get('controls')

        menuInstance.events.on('close', () =>
        {
            interactivePoint.show()
        })

        menuInstance.events.on('open', () =>
        {
            if(this.game.inputs.mode === Inputs.MODE_GAMEPAD)
                menuInstance.tabs.goTo('gamepad')
            else if(this.game.inputs.mode === Inputs.MODE_MOUSEKEYBOARD)
                menuInstance.tabs.goTo('mouse-keyboard')
            else if(this.game.inputs.mode === Inputs.MODE_TOUCH)
                menuInstance.tabs.goTo('touch')
        })
    }

    setBonfire()
    {
        const position = this.references.items.get('bonfireHashes')[0].position

        // Particles
        let particles = null
        {
            const emissiveMaterial = this.game.materials.getFromName('emissiveOrangeRadialGradient')
    
            const count = 30
            const elevation = uniform(5)
            const positions = new Float32Array(count * 3)
            const scales = new Float32Array(count)
    
    
            for(let i = 0; i < count; i++)
            {
                const i3 = i * 3
    
                const angle = Math.PI * 2 * Math.random()
                const radius = Math.pow(Math.random(), 1.5) * 1
                positions[i3 + 0] = Math.cos(angle) * radius
                positions[i3 + 1] = Math.random()
                positions[i3 + 2] = Math.sin(angle) * radius
    
                scales[i] = 0.02 + Math.random() * 0.06
            }
            
            const positionAttribute = instancedArray(positions, 'vec3').toAttribute()
            const scaleAttribute = instancedArray(scales, 'float').toAttribute()
    
            const material = new THREE.SpriteNodeMaterial()
            material.outputNode = emissiveMaterial.outputNode
    
            const progress = float(0).toVar()
    
            material.positionNode = Fn(() =>
            {
                const newPosition = positionAttribute.toVar()
                progress.assign(newPosition.y.add(this.localTime.mul(newPosition.y)).fract())
    
                newPosition.y.assign(progress.mul(elevation))
                newPosition.xz.addAssign(this.game.wind.direction.mul(progress))
    
                const progressHide = step(0.8, progress).mul(100)
                newPosition.y.addAssign(progressHide)
                
                return newPosition
            })()
            material.scaleNode = Fn(() =>
            {
                const progressScale = progress.remapClamp(0.5, 1, 1, 0)
                return scaleAttribute.mul(progressScale)
            })()
    
            const geometry = new THREE.CircleGeometry(0.5, 8)
    
            particles = new THREE.Mesh(geometry, material)
            particles.visible = false
            particles.position.copy(position)
            particles.count = count
            this.game.scene.add(particles)
        }

        // Hashes
        {
            const alphaNode = Fn(() =>
            {
                const baseUv = uv(1)
                const distanceToCenter = baseUv.sub(0.5).length()
    
                const voronoi = texture(
                    this.game.noises.voronoi,
                    baseUv
                ).g
    
                voronoi.subAssign(distanceToCenter.remap(0, 0.5, 0.3, 0))
    
                return voronoi
            })()
    
            const material = new MeshDefaultMaterial({
                colorNode: color(0x6F6A87),
                alphaNode: alphaNode,
                hasWater: false,
                hasLightBounce: false
            })
    
            const mesh = this.references.items.get('bonfireHashes')[0]
            mesh.material = material
        }

        // Burn
        const burn = this.references.items.get('bonfireBurn')[0]
        burn.visible = false

        // Interactive point
        this.game.interactivePoints.create(
            this.references.items.get('bonfireInteractivePoint')[0].position,
            'Res(e)t',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.reset()

                gsap.delayedCall(2, () =>
                {
                    // Bonfire
                    particles.visible = true
                    burn.visible = true
                    this.game.ticker.wait(2, () =>
                    {
                        particles.geometry.boundingSphere.center.y = 2
                        particles.geometry.boundingSphere.radius = 2
                    })

                    // Sound
                    this.game.audio.groups.get('campfire').items[0].positions.push(position)
                })
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'landing')
        })
        this.events.on('boundingOut', () =>
        {
            this.game.achievements.setProgress('landingLeave', 1)
        })
    }

    update()
    {
        this.localTime.value += this.game.ticker.deltaScaled * 0.1
    }
}