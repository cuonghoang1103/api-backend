import { Game } from '../Game.js'
import { InstancedGroup } from '../InstancedGroup.js'
import { VocabQuiz } from './VocabQuiz.js'

export class Bricks
{
    // Lực va chạm tối thiểu để "nuốt" một viên gạch. Dưới ngưỡng này thì gạch
    // chỉ văng ra như cũ — cố ý, để lăn nhẹ qua tường không sổ ra một tràng câu
    // hỏi. Ngưỡng nằm trên `contactThreshold: 15` sẵn có của thân vật lý.
    static CONSUME_FORCE = 26

    constructor()
    {
        this.game = Game.getInstance()

        // Hỏng tệp từ vựng cũng không sao: VocabQuiz tự để ready=false và mọi
        // lời gọi ask() thành vô hại. Gạch vẫn vỡ như thường.
        this.vocabQuiz = new VocabQuiz()

        // Base and references
        const [ base, references ] = InstancedGroup.getBaseAndReferencesFromInstances(this.game.resources.bricksModel.scene.children)

        base.castShadow = true
        base.receiveShadow = true
        base.frustumCulled = false

        // Update materials 
        this.game.materials.updateObject(base)
        
        // Objects
        this.objects = []
        for(const reference of references)
        {
            // `object` được gán sau khi add() trả về, nhưng onCollision chỉ chạy
            // lúc va chạm nên lúc đó biến đã có giá trị.
            const object = this.game.objects.add(
                {
                    model: reference,
                    updateMaterials: false,
                    castShadow: false,
                    receiveShadow: false,
                    parent: null,
                },
                {
                    type: 'dynamic',
                    position: reference.position,
                    rotation: reference.quaternion,
                    friction: 0.7,
                    mass: 0.1,
                    sleeping: true,
                    colliders: [ { shape: 'cuboid', parameters: [ 0.75 * 0.75, 0.5 * 0.75, 1 * 0.75 ], category: 'object' } ],
                    waterGravityMultiplier: - 1,
                    contactThreshold: 15,
                    onCollision: (force, position) =>
                    {
                        this.game.audio.groups.get('hitBrick').playRandomNext(force, position)
                        this.consume(object, force)
                    }
                },
            )

            this.objects.push(object)
        }

        // Instanced group
        this.instancedGroup = new InstancedGroup(references, base)

        // Tick update
        this.setTick()
    }

    /**
     * "Nuốt" một viên gạch rồi bật câu hỏi từ vựng.
     *
     * Cách làm cho gạch biến mất: thu tỉ lệ về 0 rồi cập nhật ma trận. Lưới ở
     * đây là InstancedMesh dùng chung, không tắt riêng một thể hiện được —
     * InstancedGroup dựng ma trận từ `reference.matrixWorld` (xem
     * InstancedGroup.js:106), nên tỉ lệ 0 là cách gọn nhất để nó tàng hình.
     * Thân vật lý thì tắt hẳn, nếu không xe vẫn đâm phải một bức tường vô hình.
     */
    consume(object, force)
    {
        if(object.consumed || force < Bricks.CONSUME_FORCE)
            return

        object.consumed = true

        const object3D = object.visual?.object3D
        if(object3D)
        {
            object3D.scale.setScalar(0)
            object3D.updateMatrixWorld(true)
            object3D.needsUpdate = true
            this.instancedGroup.needsUpdate = true
        }

        object.physical?.body?.setEnabled(false)

        this.vocabQuiz.ask()
    }

    setTick()
    {
        this.game.ticker.events.on('tick', () =>
        {
            for(const object of this.objects)
            {
                if(!object.physical.body.isSleeping() && object.physical.body.isEnabled())
                    object.visual.object3D.needsUpdate = true
            }
        }, 10)
    }
}