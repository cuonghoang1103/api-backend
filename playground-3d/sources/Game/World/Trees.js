import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { Foliage } from './Foliage.js'
import { color, uniform } from 'three/tsl'

export class Trees
{
    constructor(name, visual, references, colorA, colorB)
    {
        this.game = Game.getInstance()

        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: `🌳 ${name}`,
                expanded: false,
            })
        }

        this.visual = visual
        this.references = references
        this.colorA = colorA
        this.colorB = colorB

        this.setModelParts()
        this.setBodies()
        this.setLeaves()
        this.setPhysical()
    }

    setModelParts()
    {
        this.modelParts = {}
        this.modelParts.leaves = []
        this.modelParts.body = null
        
        this.visual.traverse((_child) =>
        {
            if(_child.isMesh)
            {
                if(_child.name.startsWith('treeLeaves'))
                    this.modelParts.leaves.push(_child)
                else if(_child.name.startsWith('treeBody'))
                    this.modelParts.body = _child
            }
        })
    }

    setBodies()
    {
        this.game.materials.updateObject(this.modelParts.body)
        this.bodies = new THREE.InstancedMesh(this.modelParts.body.geometry, this.modelParts.body.material, this.references.length)
        this.bodies.instanceMatrix.setUsage(THREE.StaticDrawUsage)
        this.bodies.castShadow = true
        this.bodies.receiveShadow = true
        
        let i = 0
        for(const treeReference of this.references)
        {
            this.bodies.setMatrixAt(i, treeReference.matrix)
            i++
        }

        this.game.scene.add(this.bodies)
    }

    setLeaves()
    {
        const references = []

        /**
         * Mỗi cây góp ĐÚNG chừng này phiến lá vào hệ `Foliage` chung, xếp liền
         * khối theo thứ tự cây. Nhờ vậy cây thứ `t` chiếm dải chỉ số
         * `[t * leavesPerTree, (t+1) * leavesPerTree)` — hệ phá huỷ gỡ được
         * đúng tán của một cây mà không đụng cây bên cạnh.
         */
        this.leavesPerTree = this.modelParts.leaves.length

        for(const treeReference of this.references)
        {
            for(const leaves of this.modelParts.leaves)
            {
                const finalMatrix = leaves.matrix.clone().premultiply(treeReference.matrixWorld)
                const reference = new THREE.Object3D()
                reference.applyMatrix4(finalMatrix)

                references.push(reference)
            }
        }

        const leavesColorANode = uniform(color(this.colorA))
        const leavesColorBNode = uniform(color(this.colorB))
        this.leaves = new Foliage(references, leavesColorANode, leavesColorBNode, true)

        // Debug
        if(this.game.debug.active)
        {
            this.game.debug.addThreeColorBinding(this.debugPanel, leavesColorANode.value, 'leavesColorA')
            this.game.debug.addThreeColorBinding(this.debugPanel, leavesColorBNode.value, 'leavesColorB')
            this.debugPanel.addBinding(this.leaves.material.shadowOffset, 'value', { label: 'shadowOffset', min: 0, max: 2, step: 0.001 })
            this.debugPanel.addBinding(this.leaves.material.threshold, 'value', { label: 'threshold', min: 0, max: 1, step: 0.001 })
            this.debugPanel.addBinding(this.leaves.material.seeThroughEdgeMin, 'value', { label: 'seeThroughEdgeMin', min: 0, max: 1, step: 0.001 })
            this.debugPanel.addBinding(this.leaves.material.seeThroughEdgeMax, 'value', { label: 'seeThroughEdgeMax', min: 0, max: 1, step: 0.001 })
        }
    }

    setPhysical()
    {
        // Giữ lại object để còn tắt được thân cây đã bị bắn gãy — không giữ thì
        // cây biến mất mà gốc vô hình vẫn chặn xe.
        this.physicals = []

        for(const treeReference of this.references)
        {
            const object = this.game.objects.add(
                null,
                {
                    type: 'fixed',
                    position: treeReference.position.add(new THREE.Vector3(0, 2.5, 0)),
                    rotation: treeReference.quaternion,
                    friction: 0.7,
                    sleeping: true,
                    colliders: [ { shape: 'cylinder', parameters: [ 2.5, 0.15 ], category: 'object' } ],
                    onCollision: (force, position) =>
                    {
                        this.game.audio.groups.get('hitDefault').playRandomNext(force, position)
                    }
                }
            )

            this.physicals.push(object?.physical ?? null)
        }
    }

    /**
     * BẬT/TẮT MỘT CÂY — thân, tán lá và gốc va chạm cùng một lượt.
     *
     * Không xoá instance khỏi `InstancedMesh` (xoá thì phải dồn lại cả mảng và
     * mọi chỉ số phía sau đổi hết) mà CO TỈ LỆ VỀ 0. Ma trận vẫn giữ nguyên cột
     * tịnh tiến nên mọi đỉnh của cây co về đúng chỗ nó đứng: tam giác suy biến,
     * không vẽ ra pixel nào, và cũng không để lại vệt ở gốc toạ độ như khi
     * dùng ma trận toàn số 0.
     */
    setTreeEnabled(index, enabled)
    {
        const reference = this.references[index]
        if(!reference) return

        if(!this.zeroScale)
            this.zeroScale = new THREE.Vector3(0, 0, 0)

        const shrink = (source) => source.clone().scale(this.zeroScale)

        // Thân
        this.bodies.setMatrixAt(index, enabled ? reference.matrix : shrink(reference.matrix))
        this.bodies.instanceMatrix.needsUpdate = true

        // Tán lá — dải chỉ số liền khối của riêng cây này
        for(let i = 0; i < this.leavesPerTree; i++)
        {
            const leafIndex = index * this.leavesPerTree + i
            const source = this.leaves.transformMatrices[leafIndex]
            if(!source) continue

            const matrix = enabled ? source : shrink(source)
            matrix.toArray(this.leaves.instanceMatrix.array, leafIndex * 16)
        }
        this.leaves.instanceMatrix.needsUpdate = true

        // Gốc va chạm
        this.physicals[index]?.body?.setEnabled(enabled)
    }
}