import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { Floor } from './Floor.js'
import { Grid } from './Grid.js'
import { Grass } from './Grass.js'
import { color, float, Fn, instance, normalWorld, positionLocal, texture, vec3, vec4 } from 'three/tsl'
import { WaterSurface } from './WaterSurface.js'
import { Areas } from './Areas/Areas.js'
import { WindLines } from './WindLines.js'
import { Leaves } from './Leaves.js'
import { Lightnings } from './Lightnings.js'
import { Snow } from './Snow.js'
import { Rainbow } from './Rainbow.js'
import { Whispers } from './Whispers.js'
import { VisualVehicle } from './VisualVehicle.js'
import { VisualTornado } from './VisualTornado.js'
import { Flowers } from './Flowers.js'
import { Bricks } from './Bricks.js'
import { Trees } from './Trees.js'
import { Bushes } from './Bushes.js'
import { MeshDefaultMaterial } from '../Materials/MeshDefaultMaterial.js'
import { Fireballs } from './Fireballs.js'
import { ExplosiveCrates } from './ExplosiveCrates.js'
import { RainLines } from './RainLines.js'
import { Confetti } from './Confetti.js'
import { Intro } from './Intro.js'
import { PoleLights } from './PoleLights.js'
import { Lanterns } from './Lanterns.js'
import { Fences } from './Fences.js'
import { Benches } from './Benches.js'
import { Scenery } from './Scenery.js'
import { FptuCampus } from './FptuCampus.js'
import { PlayIsland } from './PlayIsland.js'
import { CityIsland } from './CityIsland.js'
import { MonsterIsland } from './MonsterIsland.js'
import { Carrier } from './Carrier.js'
import { VehicleRocket } from './VehicleRocket.js'
import { Cockpit } from './Cockpit.js'
import { Garage } from './Garage.js'
import { Survival } from './Survival.js'

export class World
{
    constructor()
    {
        this.game = Game.getInstance()

        this.step(0)

        // this.setAxesHelper()
        // this.setCollisionGroupsTest()
        // this.setNormalTest()
        // this.setTestMesh()
        // this.setTestShadow()
    }

    step(step)
    {
        if(step === 0)
        {
            this.grid = new Grid()
            this.intro = new Intro()
        }
        else if(step === 1)
        {
            this.visualVehicle = new VisualVehicle(this.game.resources.vehicle.scene)
            this.floor = new Floor()
            this.waterSurface = new WaterSurface()
            this.grass = new Grass()
            this.windLines = new WindLines()
            this.confetti = new Confetti()
            this.leaves = new Leaves()
            this.rain = new RainLines()
            this.lightnings = new Lightnings()
            this.fireballs = new Fireballs()
            this.snow = new Snow()
            this.rainbow = new Rainbow()
            this.visualTornado = new VisualTornado()
            this.bushes = new Bushes()
            this.birchTrees = new Trees('Birch Tree', this.game.resources.birchTreesVisualModel.scene, this.game.resources.birchTreesReferencesModel.scene.children, '#ff4f2b', '#ff903f')
            this.oakTrees = new Trees('Oak Tree', this.game.resources.oakTreesVisualModel.scene, this.game.resources.oakTreesReferencesModel.scene.children, '#b4b536', '#d8cf3b')
            this.cherryTrees = new Trees('Cherry Tree', this.game.resources.cherryTreesVisualModel.scene, this.game.resources.cherryTreesReferencesModel.scene.children, '#ff6d6d', '#ff9990')
            this.flowers = new Flowers()
            this.bricks = new Bricks()
            this.fences = new Fences()
            this.benches = new Benches()
            this.explosiveCrates = new ExplosiveCrates()
            this.poleLights = new PoleLights()
            this.lanterns = new Lanterns()
            this.scenery = new Scenery()
            this.fptuCampus = new FptuCampus()

            // Đảo sân chơi phía Nam (sân bóng đá lái xe + ba khu chừa sẵn).
            // Đảo riêng, không đụng một khối nào của đảo chính — xem
            // `data/playisland.js` để biết vì sao không dựng ở quận Tây-Nam.
            this.playIsland = new PlayIsland()

            // Đảo thành phố phía Đông — khu đầu tiên dựng từ MODEL NGOÀI
            // (Downtown City MegaKit, CC0). Xem `data/cityisland.js`.
            this.cityIsland = new CityIsland()

            // Đảo quái vật phía Bắc — sân khấu chế độ Sinh tồn. Dựng SAU
            // `cityIsland` vì khu nhà đổ nát mượn lại chính model của phố.
            this.monsterIsland = new MonsterIsland()

            // Tàu sân bay neo giữa biển, cạnh cây cầu đi ra đảo quái. Dựng
            // BẰNG MÃ — model user tải về nặng 2,1 triệu đỉnh, xem `data/carrier.js`.
            this.carrier = new Carrier()

            /**
             * Nội thất buồng lái (chế độ máy quay người thứ nhất). Gắn vào
             * `parts.chassis` nên phải sau `visualVehicle`.
             *
             * ⚠️ Và phải TRƯỚC `vehicleRocket`: buồng lái ĐO hộp bao thân xe để
             * biết đặt chỗ ngồi ở đâu, mà khẩu pháo cũng là con của chassis —
             * dựng pháo trước thì đỉnh xe đo được vống từ 0,72 lên 1,805 và
             * người lái ngồi lơ lửng trên nóc. (Phép đo còn một lớp chặn nữa là
             * cờ `userData.vehicleAttachment`; hai lớp là cố ý.)
             */
            this.cockpit = new Cockpit()

            // Pháo tên lửa trên nóc xe. Dựng SAU `visualVehicle` vì nó gắn khẩu
            // pháo vào chính thân xe (`parts.chassis`).
            this.vehicleRocket = new VehicleRocket()

            // Nhà xe — sinh nút đổi xe trong Cài đặt từ `data/garage.js`.
            // Dựng SAU `cockpit` và `vehicleRocket` vì đổi xe phải gắn lại cả
            // nội thất lẫn khí tài trên nóc.
            this.garage = new Garage()

            /**
             * Chế độ Sinh tồn — đàn quái sinh quanh XE nên không phụ thuộc đảo
             * nào cả, nhưng vẫn dựng SAU mọi thứ: nó bắn tia xuống đất để đặt
             * quái, mà tia chỉ chạm được những gì đã có collider trong cảnh.
             */
            this.survival = new Survival()

            this.areas = new Areas()
        }
        else if(step === 2)
        {
            this.whispers = new Whispers()
        }
    }

    setPhysicalFloor()
    {
        this.game.objects.add(
            null,
            {
                type: 'fixed',
                friction: 0.25,
                restitution: 0,
                colliders: [
                    { shape: 'cuboid', parameters: [ 1000, 1, 1000 ], position: { x: 0, y: - 1.01, z: 0 }, category: 'floor' },
                ]
            }
        )
    }

    setTestKtx()
    {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicNodeMaterial(),
        )
        mesh.material.outputNode = vec4(
            texture(this.game.resources.paletteTexture).rgb,
            1
        )
        mesh.position.copy(this.game.player.position)
        mesh.position.y += 2
        this.game.scene.add(mesh)
    }

    setTestShadow()
    {
        // Geometry
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

        // Material
        const material = new THREE.MeshLambertNodeMaterial()
        material.castShadowNode = vec4(0, 0, 0, 1)

        // Mesh
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = 2
        mesh.receiveShadow = true
        mesh.castShadow = true
        this.game.scene.add(mesh)

        // // Receiver
        // const receiver = new THREE.Mesh(
        //     new THREE.PlaneGeometry(3, 3),
        //     new THREE.MeshLambertNodeMaterial()
        // )
        // receiver.rotation.x = - Math.PI * 0.5
        // receiver.position.y = 1
        // receiver.receiveShadow = true
        // receiver.castShadow = true
        // this.game.scene.add(receiver)
    }


    setTestMesh()
    {
        console.log(this.game.rendering.renderer.library)
        const testMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshBasicMaterial()
        )
        // console.log(testMesh.material.outputNode = vec4(1, 0, 0, 1))
        // testMesh.material.outputNode = Fn(() =>
        // {
        //     return vec4(1, 0, 0, 1)
        // })()
        // setTimeout(() =>
        // {

        //     testMesh.material.outputNode = Fn(() =>
        //     {
        //         return vec4(1, 1, 0, 1)
        //     })()
        //     testMesh.material.needsUpdate = true
        // }, 2000)
        // testMesh.receiveShadow = true
        testMesh.position.z = 3
        this.game.scene.add(testMesh)

        // const testMesh2 = new THREE.Mesh(
        //     new THREE.SphereGeometry(1, 32, 32),
        //     new MeshDefaultMaterial({
        //         colorNode: color(0xffffff),
        //         hasCoreShadows: true,
        //         hasDropShadows: true,
        //     })
        // )
        // testMesh2.receiveShadow = true
        // testMesh2.position.x = 3
        // this.game.scene.add(testMesh2)
    }

    setAxesHelper()
    {
        const axesHelper = new THREE.AxesHelper()
        axesHelper.position.y = 0.1
        this.game.scene.add(axesHelper)
    }

    setCollisionGroupsTest()
    {
        // // Left (object)
        // this.game.objects.add(
        //     {
        //         type: 'dynamic',
        //         position: { x: 4, y: 2, z: 0.1 },
        //         colliders: [ { shape: 'cuboid', parameters: [ 0.5, 0.5, 0.5 ], category: 'object' } ]
        //     }
        // )

        // Right (terrain)
        this.game.objects.add(
            null,
            {
                type: 'dynamic',
                position: { x: 4, y: 2, z: -1.1 },
                colliders: [ { shape: 'cuboid', parameters: [ 0.5, 0.5, 0.5 ], category: 'floor' } ]
            }
        )

        // // Top (bumper)
        // this.game.objects.add(
        //     {
        //         type: 'dynamic',
        //         position: { x: 4, y: 4, z: -0.5 },
        //         colliders: [ { shape: 'cuboid', parameters: [ 0.5, 0.5, 0.5 ], category: 'bumper' } ]
        //     }
        // )
    }

    // setNormalTest()
    // {
    //     const geometry = new THREE.IcosahedronGeometry(1, 2)

    //     const material = new THREE.MeshLambertNodeMaterial()

    //     material.normalNode = normalView
    //     // const newNormal = 
    //     // material.normalNode = vec3(0, 1, 0)

    //     // material.positionNode = Fn(() =>
    //     // {
    //     //     // materialNormal.assign(vec3(0, 1, 0))
    //     //     return positionGeometry
    //     // })()
    //     material.outputNode = vec4(transformedNormalWorld, 1)

    //     const mesh = new THREE.Mesh(geometry, material)
    //     mesh.position.y = 2

    //     this.game.scene.add(mesh)
    // }
}