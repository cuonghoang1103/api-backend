import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import * as THREE from 'three/webgpu'
import { Game } from './Game.js'

export class ResourcesLoader
{
    constructor()
    {
        this.game = Game.getInstance()
        this.loaders = new Map()
        this.cache = new Map()
    }

    getLoader(_type)
    {
        if(this.loaders.has(_type))
            return this.loaders.get(_type)

        let loader = null
        
        if(_type === 'texture')
        {
            loader = new THREE.TextureLoader()
        }
        else if(_type === 'textureKtx')
        {
            loader = new KTX2Loader()
            loader.setTranscoderPath('./basis/')
            loader.detectSupport(this.game.rendering.renderer)
        }
        else if(_type === 'draco')
        {
            loader = new DRACOLoader()
            loader.setDecoderPath('./draco/')
            loader.preload()
        }
        else if(_type === 'gltf')
        {
            const dracoLoader = this.getLoader('draco')

            const ktx2Loader = this.getLoader('textureKtx')
            
            loader = new GLTFLoader()
            loader.setDRACOLoader(dracoLoader)
            loader.setKTX2Loader(ktx2Loader)
        }

        this.loaders.set(_type, loader)

        return loader
    }

    load(_files, _progressCallback = null)
    {
        return new Promise((resolve, reject) =>
        {
            let toLoad = _files.length
            const loadedResources = {}

            // Progress
            const progress = () =>
            {
                toLoad--

                if(typeof _progressCallback === 'function')
                    _progressCallback(toLoad, _files.length)
                
                if(toLoad === 0)
                    resolve(loadedResources)
            }

            // Save
            const save = (_file, _resource) =>
            {
                // Apply modifier
                if(typeof _file[3] !== 'undefined')
                    _file[3](_resource)
                    
                // Save in resources object
                loadedResources[_file[0]] = _resource

                // Save in cache
                this.cache.set(_file[1], _resource)
            }

            // Error
            const error = (_file) =>
            {
                console.log(`Resources > Couldn't load file ${_file[1]}`)
                reject(_file[1])
            }

            // Each file
            for(const _file of _files)
            {
                // In cache
                if(this.cache.has(_file[1]))
                {
                    // Save cached file directly in resources object
                    loadedResources[_file[0]] = this.cache.get(_file[1])

                    progress()
                }

                // Not in cache
                else
                {
                    const loader = this.getLoader(_file[2])
                    loader.load(
                        _file[1],
                        resource => {
                            save(_file, resource)
                            progress()
                        },
                        undefined,
                        error
                    )
                }
            }
        })
    }

    /**
     * NẠP KHI CẦN — một tệp, gọi bao nhiêu lần cũng chỉ tải MỘT lượt.
     *
     * `load()` ở trên có cache theo đường dẫn, nhưng cache đó chỉ ghi lúc tệp
     * đã về. Hai lời gọi chồng nhau trong lúc tệp còn đang bay đều thấy cache
     * rỗng ⇒ hai lượt tải song song cho cùng một tệp. Với thứ được kích hoạt
     * theo khoảng cách (`Carrier`, mỗi khung hình một lần) thì đó không phải
     * trường hợp hiếm — đó là điều CHẮC CHẮN xảy ra.
     *
     * Nên ở đây nhớ theo PROMISE chứ không theo kết quả: lời gọi thứ hai nhận
     * đúng lời hứa của lời gọi thứ nhất.
     *
     * ⚠️ KHÔNG BAO GIỜ `reject`. `load()` gốc reject khi tệp hỏng, mà mấy thứ
     * dùng hàm này đều là model TRANG TRÍ có sẵn đường lùi (`Carrier` dựng
     * bằng mã, `SurvivalMonsters` dựng bằng khối). Ném ra ngoài chỉ tạo một
     * unhandled rejection rồi vẫn phải bắt ở mọi chỗ gọi. Hỏng thì trả `null`,
     * và chỗ gọi tự hiểu là "cứ dùng bản dự phòng".
     *
     * ⚠️ Hỏng thì KHÔNG nhớ lời hứa hỏng đó lại — xoá đi để lần sau còn thử
     * lại được. Mạng rớt một nhịp không nên khoá vĩnh viễn cái model.
     *
     * @returns {Promise<any|null>} tài nguyên, hoặc `null` nếu không nạp được
     */
    loadLazy(name, path, type, modifier)
    {
        this.lazyPromises ??= new Map()

        if(this.lazyPromises.has(path))
            return this.lazyPromises.get(path)

        const promise = this
            .load([ [ name, path, type, modifier ] ])
            .then(resources => resources[name] ?? null)
            .catch(() =>
            {
                console.warn(`Resources > nạp khi cần thất bại: ${path} — dùng bản dự phòng`)
                this.lazyPromises.delete(path)
                return null
            })

        this.lazyPromises.set(path, promise)

        return promise
    }
}