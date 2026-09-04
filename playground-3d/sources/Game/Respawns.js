import * as THREE from 'three/webgpu'
import { Game } from './Game.js'
import { RESPAWN } from '../data/fptu.js'
import { CONCERT, PLAY_RESPAWN, VILLAGE } from '../data/playisland.js'
import { CITY_RESPAWN } from '../data/cityisland.js'
import { MONSTER_RESPAWN } from '../data/monsterisland.js'
import { CARRIER_RESPAWN, CARRIER } from '../data/carrier.js'

export class Respawns
{
    constructor(defaultName = 'landing')
    {
        this.game = Game.getInstance()
        this.defaultName = defaultName

        this.setItems()
    }

    setItems()
    {
        this.items = new Map()

        for(const child of this.game.resources.respawnsReferencesModel.scene.children)
        {
            child.rotation.reorder('YXZ')

            let name = child.name.replace(/^respawn(.+)$/i, '$1')

            name = name.charAt(0).toLowerCase() + name.slice(1)

            const item = {
                name: name,
                position: new THREE.Vector3(
                    child.position.x,
                    4,
                    child.position.z
                ),
                rotation: child.rotation.y
            }

            this.items.set(name, item)
        }

        /**
         * Điểm hồi sinh của khu Đại học FPT — thêm BẰNG MÃ vì khu đó cũng dựng
         * bằng mã, `respawnsReferences.glb` không có node nào cho nó.
         *
         * ⚠️ Phải nằm ở ĐÂY chứ không phải trong `FptuCampus`: `Map` khởi tạo ở
         * Game.js dòng 196, còn nội dung thế giới mãi dòng 199 (`world.step(1)`)
         * mới dựng. Thêm từ FptuCampus thì bản đồ đã đọc xong danh sách rồi và
         * mục "FPT University" biến mất khỏi bản đồ mà không báo lỗi gì.
         */
        this.items.set('fptu', {
            name: 'fptu',
            position: new THREE.Vector3(RESPAWN.x, 4, RESPAWN.z),
            rotation: RESPAWN.rotation
        })

        /** Đảo sân chơi — cùng lý do phải khai ở đây, xem ghi chú ngay trên. */
        this.items.set('arena', {
            name: 'arena',
            position: new THREE.Vector3(PLAY_RESPAWN.x, 4, PLAY_RESPAWN.z),
            rotation: PLAY_RESPAWN.rotation
        })

        /** Sân khấu nhạc hội trên đảo sân chơi — cùng lý do, xem ghi chú trên. */
        this.items.set('concert', {
            name: 'concert',
            position: new THREE.Vector3(CONCERT.respawn.x, 4, CONCERT.respawn.z),
            rotation: CONCERT.respawn.rotation
        })

        /** Làng ngôn ngữ trên đảo sân chơi — cùng lý do, xem ghi chú trên. */
        this.items.set('village', {
            name: 'village',
            position: new THREE.Vector3(VILLAGE.respawn.x, 4, VILLAGE.respawn.z),
            rotation: VILLAGE.respawn.rotation
        })

        /** Đảo thành phố phía Đông — cũng dựng bằng mã, cũng phải khai ở đây. */
        this.items.set('city', {
            name: 'city',
            position: new THREE.Vector3(CITY_RESPAWN.x, 4, CITY_RESPAWN.z),
            rotation: CITY_RESPAWN.rotation
        })

        /** Đảo quái vật phía Bắc — sân khấu chế độ Sinh tồn. Cùng lý do trên. */
        this.items.set('monster', {
            name: 'monster',
            position: new THREE.Vector3(MONSTER_RESPAWN.x, 4, MONSTER_RESPAWN.z),
            rotation: MONSTER_RESPAWN.rotation
        })

        /** Tàu sân bay neo giữa biển — hồi sinh ngay trên boong. */
        this.items.set('carrier', {
            name: 'carrier',
            position: new THREE.Vector3(CARRIER_RESPAWN.x, CARRIER.deckY + 2, CARRIER_RESPAWN.z),
            rotation: CARRIER_RESPAWN.rotation
        })
    }

    getByName(name)
    {
        return this.items.get(name)
    }

    getDefault()
    {
        return this.items.get(this.defaultName)
    }

    getClosest(position)
    {
        let closestItem = null
        let closestDistance = Infinity

        this.items.forEach((item) =>
        {
            const distance = Math.hypot(item.position.x - position.x, item.position.z - position.z)

            if(distance < closestDistance)
            {
                closestDistance = distance
                closestItem = item
            }
        })

        return closestItem
    }
}