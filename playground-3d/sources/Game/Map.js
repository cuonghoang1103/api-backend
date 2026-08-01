import { clamp } from 'three/src/math/MathUtils.js'
import { Game } from './Game.js'

export class Map
{
    constructor()
    {
        this.game = Game.getInstance()

        this.initiated = false
        this.modal = this.game.modals.items.get('map')
        this.element = this.modal.element.querySelector('.js-map-container')

        this.setTrigger()
        this.setInputs()

        this.modal.events.on('open', () =>
        {
            if(!this.initiated)
                this.init()

            this.texture.update()
        })
    }

    init()
    {
        this.initiated = true
        
        this.setLocations()
        this.setPlayer()
        this.setTexture()

        this.game.ticker.events.on('tick', () =>
        {
            this.update()
        }, 14)
    }

    setLocations()
    {
        this.locations = {}
        this.locations.items = [
            { name: 'Achievements', respawnName: 'achievements', offset: { x: 0, y: -0.01 } },
            // Đảo sân chơi nằm ở z ≈ 110, NGOÀI phạm vi ảnh bản đồ (nửa cạnh
            // địa hình gốc chỉ 96) nên `worldToMap` kẹp về 1 — pin đậu sát viền
            // dưới. Nhích lên một chút cho đỡ dính mép, y hệt cách đã làm với FPTU.
            { name: 'Sân bóng', respawnName: 'arena', offset: { x: 0, y: -0.03 } },
            // Đảo thành phố ở x ≈ 154, cũng ngoài phạm vi ảnh bản đồ nên pin bị
            // kẹp sát viền phải — nhích vào cho đỡ dính mép
            { name: 'Thành phố', respawnName: 'city', offset: { x: -0.03, y: 0 } },
            // Đảo quái vật ở z ≈ −212, xa nhất về phía Bắc và cũng ngoài phạm vi
            // ảnh bản đồ — pin bị kẹp sát viền TRÊN, nhích xuống cho đỡ dính mép
            { name: 'Đảo quái vật', respawnName: 'monster', offset: { x: 0, y: 0.03 } },
            // Tàu sân bay neo giữa biển ở (46 · −140), cũng ngoài phạm vi ảnh
            // bản đồ nên pin bị kẹp mép trên — nhích xuống cho đỡ dính viền
            { name: 'Tàu sân bay', respawnName: 'carrier', offset: { x: 0.02, y: 0.05 } },
            { name: 'Altar', respawnName: 'altar', offset: { x: 0, y: -0.05 } },
            { name: 'Behind<br /> the scene', respawnName: 'behindTheScene', offset: { x: 0.01, y: 0 } },
            { name: 'Bowling', respawnName: 'bowling', offset: { x: -0.08, y: 0.03 } },
            { name: 'Career', respawnName: 'career', offset: { x: 0, y: -0.06 } },
            { name: 'Circuit', respawnName: 'circuit', offset: { x: -0.08, y: -0.05 } },
            { name: 'Cookie', respawnName: 'cookie', offset: { x: -0.02, y: -0.01 } },
            // Khu trường nằm trên đảo riêng NGOÀI phạm vi ảnh bản đồ (worldToMap
            // clamp về 0) — nhích offset để pin đậu ở mép Tây thay vì dính sát viền
            { name: 'FPT<br /> University', respawnName: 'fptu', offset: { x: 0.03, y: -0.02 } },
            { name: 'Lab', respawnName: 'lab', offset: { x: -0.03, y: 0 } },
            { name: 'Landing', respawnName: 'landing', offset: { x: 0.02, y: 0 } },
            { name: 'Projects', respawnName: 'projects', offset: { x: 0, y: -0.02 } },
            { name: 'Social', respawnName: 'social', offset: { x: -0.01, y: -0.04 } },
            { name: 'Time Machine', respawnName: 'timeMachine', offset: { x: 0, y: 0 } },
        ]

        for(const item of this.locations.items)
        {
            const respawn = this.game.respawns.getByName(item.respawnName)
            const mapPosition = this.worldToMap(respawn.position)

            // HTML
            const html = /* html */`
                <div class="pin"></div>
                <div class="name-container">
                    <div class="name">${item.name}</div>
                </div>
            `

            const element = document.createElement('div')
            element.classList.add('location')
            element.innerHTML = html
            element.style.left = `${(mapPosition.x + item.offset.x)* 100}%`
            element.style.top = `${(mapPosition.y + item.offset.y)* 100}%`
            element.style.zIndex = Math.round(mapPosition.y * 1000)
            
            this.element.append(element)

            element.addEventListener('click', () =>
            {
                this.game.player.respawn(item.respawnName, () =>
                {
                    this.game.view.focusPoint.isTracking = true
                })
                this.game.modals.close()
            })
        }
    }
    
    setPlayer()
    {
        this.player = {}
        this.player.element = this.element.querySelector('.js-player')
        this.player.roundedPosition = { x: 0, y: 0 }
    }
    
    setTexture()
    {
        this.texture = {}
        this.texture.element = this.element.querySelector('.js-texture')
        this.texture.previousUrl = null

        this.texture.element.addEventListener('load', () =>
        {
            this.texture.element.classList.add('is-visible')
        })
        
        this.texture.update = () =>
        {
            const url = this.game.dayCycles.intervalEvents.get('night').inInterval ? 'ui/map/map-night.webp' : 'ui/map/map-day.webp'

            if(url !== this.texture.previousUrl)
            {
                this.texture.element.classList.remove('is-visible')
                this.texture.previousUrl = url
                this.texture.element.src = url
            }
        }
    }

    setTrigger()
    {
        const element = this.game.domElement.querySelector('.js-map-trigger')
        
        element.addEventListener('click', (event) =>
        {
            this.game.modals.open('map')
        })
        element.addEventListener('keydown', (event) =>
        {
            event.preventDefault()
        })
    }

    setInputs()
    {
        // Inputs keyboard
        this.game.inputs.addActions([
            { name: 'map', categories: [ 'modal', 'menu', 'wandering' ], keys: [ 'Keyboard.m', 'Keyboard.KeyM' ] },
        ])
        this.game.inputs.events.on('map', (action) =>
        {
            if(action.active)
            {
                if(!this.modal.isOpen)
                    this.game.modals.open('map')
                else
                    this.game.modals.close()
            }
        })
    }

    worldToMap(coordinates)
    {
        let x = coordinates.x
        let y = typeof coordinates.z !== 'undefined' ? coordinates.z : coordinates.y

        x /= this.game.terrain.size
        y /= this.game.terrain.size

        x += 0.5
        y += 0.5

        x = clamp(x, 0, 1)
        y = clamp(y, 0, 1)

        return { x, y }
    }

    update()
    {
        if(!this.modal.isOpen)
            return

        const playerRoundedX = Math.round(this.game.player.position.x)
        const playerRoundedY = Math.round(this.game.player.position.z)

        if(playerRoundedX !== this.player.roundedPosition.x || playerRoundedY !== this.player.roundedPosition.y)
        {
            this.player.roundedPosition.x = playerRoundedX
            this.player.roundedPosition.y = playerRoundedY

            const playerCoordinates = this.worldToMap(this.player.roundedPosition)
            const x = Math.round(playerCoordinates.x * 1000) / 10
            const y = Math.round(playerCoordinates.y * 1000) / 10

            this.player.element.style.left = `${x}%`
            this.player.element.style.top = `${y}%`
            this.player.element.style.transform = `rotate(${-this.game.physicalVehicle.yRotation}rad)`
        }
    }
}