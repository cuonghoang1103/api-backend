# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025)

Cập nhật **31/7/2026**. Nhánh `feat/playground-3d`.

> **TRẠNG THÁI đợt nhạc/thời tiết/cầu vồng/đèn pha: ĐÃ DEPLOY PROD + ĐÃ PUSH**
> (`f8b0d9c` trên `origin feat/playground-3d`, KHÔNG đụng `main`).
>
> **Đợt LÀM DÀY KHU DỰ ÁN + KHU LAB (mục 2b bên dưới): đã test local, chờ deploy.**
>
> **Mốc phục hồi:** thẻ git `backup/playground-pre-expand-20260730` (chỉ ở local).
> Hoàn nguyên:
> `git checkout backup/playground-pre-expand-20260730 -- playground-3d frontend/public/playground`

---

# 1. Đợt 31/7 đã làm gì

| Commit | Nội dung |
|---|---|
| `57db3ad` | Nhạc nền 5 beat riêng của user + mục Music trong Cài đặt (bật/tắt · âm lượng · đổi bài) |
| `0fc4dde` | Nhạc chỉ vào sau khi bấm "Click to Start" 1,5s; mặc định 23% |
| `111859b` | Nút Weather đổi vòng Auto/Rain/Snow/Clear |
| `a2b3b33` | Cổng cầu vồng lái xuyên qua được, mọc lên sau mưa |
| `d894ab2` | Đèn pha rọi sáng thật mặt đường ban đêm |
| `ff0d4d8` | Nút Headlights (Auto/On/Off) và nút Time (Auto/Day/Night) |

Bảng Cài đặt hiện có, theo thứ tự: Audio · **Music · Volume · Track · Time ·
Headlights · Weather** · Quality · I'm stuck · Reset · Renderer · Server.
Tất cả nút mới đều dùng đúng họ nút của bản mẫu (`.button`, viền
`alpha(#ffffff,.8)`, bo 8px), có tiếng click, và nhớ qua `localStorage`.

## Nhạc

5 file ở `static/sounds/musics/CuongThai{1..5}.mp3` (~22MB), khai trong
`sources/data/musics.js`. Thêm bài = chỉ sửa file đó. Nhạc của chính user, không
dính bản quyền ai. **Âm lượng thật = thanh trượt × 0,15** (trần thấp có chủ
đích: kéo hết cỡ vẫn chỉ bằng nửa tiếng chim). Mặc định 23% ⇒ 0,0345.

Bản sao dự phòng nhạc + file `.blend` gốc: `~/Downloads/playground-source-assets/`.

---

# 2b. ĐÃ LÀM 31/7 (đợt sau): làm dày khu Dự án + khu Lab

User chọn **làm dày khu cũ trước**, chưa dựng khu mới. Kết quả:

| | Trước | Sau |
|---|---|---|
| Khu Dự án | 6 module × 1 ảnh | **8 module × 1–3 ảnh** (thêm Courses, Experience Log) |
| Khu Lab | 8 module | **10 module** (thêm Forum, GitHub Repo Hub) |
| Tổng ảnh | 6 + 16 | **20 + 20** |

**Đã kiểm bằng cách CHẠY THẬT** (Vite :5174, không qua Next): duyệt trọn 8 dự án
× mọi ảnh ⇒ đúng 20/20 texture nạp, và trọn 10 mục Lab ⇒ quay vòng về đầu, không
treo, không lỗi mới.

## Chụp ảnh trưng bày — quy trình

**Playwright 1.61 + chromium có sẵn ngay trong `node_modules` của repo** (không
phải cài). Script mẫu ở `scratchpad/shoot.mjs` (đường dẫn scratchpad theo phiên,
chép lại nếu mất): viewport 1600×900 @2x → `sips -z 540 960` → PNG 960×540 (16:9,
~100–280KB mỗi tấm, ngang ảnh cũ). Lab cần thêm bản mini `sips -z 136 240`.

- Trình duyệt Playwright **sạch, KHÔNG đăng nhập** ⇒ chỉ chụp được nội dung công
  khai. Đó là CHỦ Ý: `/notes`, `/messages`, `/chat`, `/finance` là dữ liệu riêng
  tư của user — **đừng đưa lên sân chơi**. `/hub`, `/creator` chỉ ra màn hình
  đăng nhập nên cũng vô dụng.
- **`/feed` cố tình BỎ**: trang công khai thật, nhưng ảnh sẽ đóng băng tên + bài
  viết của người dùng khác vào một file tĩnh vĩnh viễn. User đã chốt không đưa.
- Nhớ ẩn bong bóng chat AI trước khi chụp (duyệt phần tử `position:fixed` ở góc
  dưới rồi `display:none`) và đợi ~2,8s cho animation framer-motion xong —
  `/repos` từng chụp trúng lúc còn đang mờ dần.
- Duyệt nhanh cả lô ảnh bằng một tấm lưới HTML rồi chụp lại (xem `sheet.mjs`),
  đỡ phải mở từng tấm.

## Bẫy MỚI phát hiện trong đợt này

| Bẫy | Sự thật |
|---|---|
| **TỐI ĐA 5 ảnh mỗi dự án** | Dãy chấm phân trang là mesh CÓ SẴN trong `areas.glb`: `refPagination → inner → 5 plane`, kèm đúng 5 `refIntersectPagination`. Ảnh thứ 6 vẫn lật được nhưng không có chấm và `intersectPagination[i]` thành undefined. ĐO từ file .glb, đọc JSON chunk bằng `buf.readUInt32LE(12)` |
| Sợ thêm ảnh làm nặng màn hình tải | **KHÔNG.** Ảnh khu Dự án/Lab nạp LƯỜI bằng `resourcesLoader.getLoader('texture')` riêng + `loadSibling`, không nằm trong preload khởi động. `imageMini` của Lab nạp cả loạt nhưng mỗi tấm chỉ ~10–30KB |
| **Console của khung xem ghi ĐÔI mọi message và GIỮ lịch sử qua reload** | Một `console.error` hiện thành 2 dòng ⇒ "2 lỗi" thường chỉ là MỘT. Muốn biết lỗi cũ hay mới thì phải chèn mốc `console.error('===MOC===')` rồi đếm tương đối — đừng tin số dòng tuyệt đối |
| `preview_start` báo cổng X nhưng Vite chạy ở cổng khác | 5173 bận ⇒ Vite tự nhảy 5174, trong khi preview cấp 50695 ⇒ mọi thao tác trình duyệt vào 50695 đều fail. **Đọc `preview_logs` lấy cổng THẬT rồi `navigate` tay** |
| Lỗi `computeBoundingSphere(): radius is NaN` lúc khởi động lần đầu | Xuất hiện đúng một lần khi Vite đang *re-optimizing dependencies* (trang bị cắt ngang rồi tự reload). Đã thử tái hiện 3 lần tải lại với CẢ bản cũ lẫn bản mới: không lặp lại. Không phải do dữ liệu |

## Test khu Dự án / khu Lab mà KHÔNG cần lái xe

```js
game.reveal.updateStep(1)              // đẩy intro (khung xem không tự bấm được)
game.player.respawn('projects')        // tên: projects · lab · career · circuit …
game.world.areas.projects.open()       // mở khu tại chỗ
game.world.areas.projects.nextProject()  // đổi dự án  (Lab dùng .next())
game.world.areas.projects.nextImage()    // lật ảnh
game.world.areas.projects.images.resources.size   // đếm texture ĐÃ nạp thật
```

`images.resources.size` chính là chốt kiểm đáng tin: nó phải bằng tổng số ảnh
khai báo sau khi duyệt hết (20 ở bản hiện tại).

Bộ kiểm "mọi tên ảnh có file thật" ở `scratchpad/check-images.mjs`, chạy kèm
`--selftest` để nó tự chứng minh bắt được file thiếu trước khi tin kết quả.

---

# 2. VIỆC TIẾP THEO: mở rộng bản đồ

Vẫn CHƯA làm. Dưới đây là toàn bộ khảo sát đã có, **đừng đo lại**.

## Bản đồ hiện tại (đo từ `static/areas/areas.glb`)

13 khu, toạ độ tâm:

| Khu | x, z | Khu | x, z |
|---|---|---|---|
| achievements | 70,6 · 9,9 | landing | 49,3 · 38,5 |
| altar | 75,3 · −27,9 | projects | 35,8 · 13,4 |
| behindTheScene | 52,5 · −12 | social | 28,9 · −21,8 |
| bowling | 2,3 · 68,9 | timeMachine | −54,5 · −67,4 |
| career | 25,8 · −0,9 | toilet | 66,9 · 66,7 |
| circuit | −17,7 · 7,1 | cookie | 12,3 · 35,3 |
| lab | 13,1 · 17,7 | | |

- Địa hình `terrain.glb`: **192×192** (−96…96), **lái được toàn bộ**
- Vùng đường nhựa/dốc (`playgroundPhysical.glb`) chỉ ở X −14,5…35 · Z −37,3…27,2
- **⇒ Góc Tây-Nam TRỐNG HOÀN TOÀN: X −80…−25, Z +20…+80.** Đủ chỗ cho 1–2 khu
  mới mà không phải dịch bất cứ thứ gì đang có.

## Thêm khu mới — hai đường

`Areas.js` duyệt các node CẤP CAO của `areas.glb` và khớp tên theo TIỀN TỐ với
một danh sách cứng. Một "khu" = một node cấp cao + các node mốc bên trong
(`zoneBounding`, `zoneFrustum`, `interactivePoint`…, xem `Area.js`).

- **A1 — dựng bằng mã (KHUYẾN NGHỊ, rủi ro thấp).** Tự tạo hình + thân vật lý +
  vùng bằng `game.zones.create('cylinder', position, radius)` + điểm tương tác
  bằng `game.interactivePoints.create(...)`. Không đụng `.glb`. Đúng cách chữ 3D
  CUONG THAI đã được dựng.
- **A2 — sửa `.blend` rồi xuất lại `areas.glb` (RỦI RO CAO).** Đây đúng chỗ đã
  dẫm bẫy: ghép chữ thẳng vào `areas.glb` từng làm **cả thế giới kẹt ở màn hình
  tải, dừng ở tài nguyên 244/250, KHÔNG ném lỗi nào**. Nếu làm: Blender 5.1.2 có
  sẵn trong máy, `.blend` gốc 16MB ở `~/Downloads/playground-source-assets/blender/`.

Khu mới còn cần: một điểm hồi sinh (`respawnsReferences.glb`, xem `Respawns.js`)
và một dòng trong `Map.js → setLocations()` để hiện trên bản đồ.

## Làm dày khu đã có — rẻ nhất

Khu Dự án và khu Lab **phân trang theo độ dài dữ liệu** (`projectsData.length` /
`labData.length`), **KHÔNG bị bó vào số bảng trong model**. Thêm module thứ 7,
8, 9… chỉ là thêm mục vào `data/projects.js` + ảnh 960×540 vào `static/`.

## Cổng dẫn vào các phần khác của site

`game.interactivePoints.create(<Vector3 bất kỳ>, 'nhãn', align, state, onInteract, …)`
— khuôn mẫu ở `TimeMachineArea.js` (đang trỏ về `cuongthai.com/games`). Không
cần sửa model. Hộp xác nhận "rời trang" đã có sẵn từ nút thoát trong `index.html`.

---

# 3. 🪤 BẪY ĐÃ DẪM — đừng lặp lại

## Về công cụ và môi trường

| Bẫy | Hậu quả |
|---|---|
| **Khung xem của Claude VẼ ĐƯỢC cảnh 3D** | Ghi chú cũ nói "không bao giờ vẽ xong" là SAI, đã bác bỏ 31/7. Chụp màn hình duyệt hình ảnh được. Cái nó KHÔNG làm được là tự đẩy intro qua — gọi `game.reveal.updateStep(1)` từ console |
| `window.game` chỉ có khi `VITE_GAME_PUBLIC` | Đã đặt trong `playground-3d/.env.development` (chỉ chế độ dev). **ĐỪNG đặt vào `.env`** — file đó áp cho CẢ bản dựng production và `window.game` sẽ lọt vào gói phát hành (đã dẫm). `vite.config.js` gọi `import 'dotenv/config'` nạp `.env` vào process.env, mà process.env THẮNG mọi file `.env.<mode>`, kể cả khi giá trị rỗng |
| Next.js chốt danh sách file `public/` lúc SERVER KHỞI ĐỘNG | Dựng lại sân chơi ⇒ gói JS đổi mã băm ⇒ server đang chạy trả **404** ⇒ không mã nào chạy ⇒ màn hình tải quay mãi, **không lỗi nào để thấy**. Test bằng `npm run dev` ở `playground-3d` (:5173) là tránh hẳn |
| `pkill -f "next start"` không giết được | Node đổi tên tiến trình thành `next-server`. Diệt theo CỔNG: `lsof -ti:3000 \| xargs -r kill -9` |
| `JSON.stringify` biến NaN/Infinity thành `null` | Phép đo ra toàn `null` mà tưởng mã hỏng. In `String(giá trị)` ra kiểm |
| Đọc `camera.x` thay vì `camera.position.x` | Ra `undefined` ⇒ NaN ⇒ khối biến mất khỏi cảnh, tưởng lỗi vẽ. Mất 4 lượt mới tìm ra |
| `timeout` không có trên macOS | Dùng `perl -e 'select(undef,undef,undef,N)'` để chờ |

## Về thế giới 3D này

| Bẫy | Hậu quả |
|---|---|
| **Máy quay nhìn từ trên xuống, khung hình gần như KHÔNG CÓ TRỜI** | Đo bằng `Vector3.project`: đỉnh một vòng cung tròn LUÔN rơi ở y > 1 (mép trên là 1,0) với MỌI bán kính 6→22 và MỌI khoảng cách 10→70 — càng xa càng vọt cao. Mọi thứ "treo trên trời" đều vô hình. Máy quay cao 22, vùng nhìn bán kính ~29, FOV 25, far 200, sương mù 43→85 |
| Cộng sáng (`AdditiveBlending`) trên nền đất cam | Đẩy mọi màu bão hoà về TRẮNG. Dùng pha trộn thường mới giữ được màu |
| Bẹp một khối theo chiều đứng thì bẹp luôn BỀ DÀY của nó | Dải cầu vồng 1,6 bẹp 0,3 còn 0,48 đơn vị = một sợi chỉ mờ |
| **`.normalize()` trong TSL khi vector có thể bằng 0** | Ra NaN, và một NaN chảy vào ma trận là đủ GIẾT CẢ VÒNG LẶP VẼ không một dòng lỗi. Chia tay bằng `length().max(0.001)` |
| Hướng tiến của xe là trục **+X**, không phải −Z | `PhysicsVehicle` ghi rõ `this.forward.set(1,0,0).applyQuaternion(...)`, và đó đã là vector thế giới cập nhật sẵn |
| Chỉ có ĐÚNG MỘT đèn trong cả thế giới (`Lighting.count = 1`) | Mọi vật tự tính sáng-tối bằng TSL. Thả thêm `SpotLight` là không ăn vào đâu. Đèn pha phải là số hạng cộng thêm trong `MeshDefaultMaterial` |
| `Floor.js` CHÍNH LÀ địa hình | Nó lấy hình học từ `terrainModel`. `MeshGridMaterial` chỉ là lưới gỡ lỗi, `Terrain.js` import mà không dùng |

## Về thứ tự khởi tạo — nhóm nguy hiểm nhất

**Cả ba lỗi dưới đây đều làm chết game mà KHÔNG in một dòng lỗi nào**, màn hình
chỉ đứng im. Cách nhận biết: đọc `Object.keys(window.game)` — nếu danh sách dừng
ở `resources` thì hàm dựng đã ném lỗi ở khoảng dòng 110 của `Game.js`.

Thứ tự trong `Game.js`: `dayCycles` 85 · `audio` 88 · **`options` 110** ·
`weather` 117 · `lighting` 120 · `materials` 123 · `world` 126.

| Bẫy | Cách vá đã dùng |
|---|---|
| `Options` chạm `game.weather` / `game.lighting` ngay trong hàm dựng | Hoãn bằng `this.game.ticker.wait(1, () => …)` |
| `Options` chạm `audio.playlist` (chỉ sinh sau `audio.init()`, tức sau nút Play) | Nghe sự kiện `playlistReady` do `Audio` bắn |
| `Weather` khôi phục lựa chọn cũ khi `this.properties` còn RỖNG | `override.start` duyệt mảng trống, cờ `strength` vẫn lên 1 nên **nhìn mã tưởng chạy mà thời tiết không đổi gì**. Phải gọi SAU mọi `addProperty` |

## Về hệ thời tiết và chu kỳ ngày

| Bẫy | Hậu quả |
|---|---|
| **Mốc ngày/đêm kiểm bằng tiến trình TỰ NHIÊN, trước khi `override.progress` được áp** | Ép trời tối thì CẢNH tối đi nhưng cờ `intervalEvents.get('night').inInterval` vẫn báo ban ngày. **Luôn hỏi `DayCycles.isNight()`**, đừng đọc cờ đó |
| `override.end()` của cả Weather lẫn DayCycles | Đã sửa để quay về LỰA CHỌN của người chơi, vì `CircuitArea` và `Tornado` cũng ép rồi gọi `end()` khi xong |
| Ép thời tiết phải ép cả NHÓM | `rain` sinh từ ẩm×mây, `snow` từ rain×nhiệt độ, và `Snow.js`/`WaterSurface.js` đọc THẲNG `temperature`. Ép mỗi `snow=1` ra cảnh tuyết rơi mà hồ không đóng băng |
| `Howl.volume(v)` bị BỎ QUA khi bài chưa nạp | `preload:false` nên chỉ bài đang phát mới nạp. Phải đặt lại âm lượng ngay trước mỗi `play()` |
| Game nghe `keydown` trên `window` pha nổi, không lọc gì | Màn chào tự focus nút Play ⇒ bấm Enter/W/↑/↓/D ở màn chào là game chạy ngầm. Đã chặn ở pha bắt bằng `stopImmediatePropagation` — nhưng chặn thế thì nút Play mất luôn hành vi Enter mặc định, phải tự xử lý Enter/Space |

---

# 4. Quy trình

## Test local (đúng cách)

```bash
cd playground-3d && npm run dev      # :5173 — KHÔNG đi qua Next, tránh hẳn bẫy 404
```

Vào game: bấm **Play** (đóng màn chào) → bấm **Enter/W** hoặc bấm vào vòng tròn
"Click to Start". Từ console thì `game.reveal.updateStep(1)`.

## Dựng và chép sang Next

```bash
cd playground-3d && npm run build
cd .. && rm -rf frontend/public/playground && mkdir -p frontend/public/playground
rsync -a playground-3d/dist/ frontend/public/playground/
```

Kiểm sau khi chép — tên gói JS trong `index.html` phải khớp file có thật:

```bash
B=$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' frontend/public/playground/index.html | head -1)
ls "frontend/public/playground/$B" && echo OK
```

Và kiểm cờ dev không lọt vào gói phát hành:

```bash
grep -c "window.game" frontend/public/playground/assets/index-*.js   # phải là 0
```

Build **tái lập được** (`cb='?cb=1'`, không dấu thời gian): cùng nguồn ra cùng mã
băm. Dùng để đối chiếu bản đã commit có khớp nguồn không.

## Deploy

`deploy.sh` có chốt riêng cho `/playground` (kiểm 200 + mã băm gói JS khớp
`index.html`). Xem quy trình chuẩn trong `CLAUDE.md`: commit local → `bash deploy.sh`
→ **user test prod** → mới `git push`.

---

# 5. Bản đồ file

```
playground-3d/
  sources/
    index.html                       ← màn chào (có chốt nuốt phím) + bảng Options + modal
    data/musics.js                   ← DANH SÁCH NHẠC — thêm bài chỉ sửa đây
    data/projects.js · data/lab.js   ← module học tập, PHÂN TRANG theo độ dài
    data/social.js                   ← ⚠️ TỐI THIỂU 2 mục (chia cho length-1)
    data/consoleLog.js               ← GIỮ mục Credits (giấy phép MIT)
    Game/Options.js                  ← toàn bộ nút trong bảng Cài đặt
    Game/Audio.js                    ← playlist + tiếng nền theo thời tiết
    Game/Weather.js                  ← 7 đại lượng + override + preference
    Game/Cycles/DayCycles.js         ← chu kỳ ngày + isNight() + preference
    Game/Ligthing.js                 ← đèn hướng + ĐÈN PHA (uniform + hàm TSL)
    Game/Materials/MeshDefaultMaterial.js ← vật liệu chung, chỗ cộng ánh đèn pha
    Game/World/Rainbow.js            ← MỚI: cổng cầu vồng
    Game/World/VisualVehicle.js      ← xe + đèn pha (bộ phận `headlights`)
    Game/World/Areas/*.js            ← 13 khu
  static/
    areas/areas.glb                  ← 13 khu + các node mốc
    sounds/musics/CuongThai{1..5}.mp3
  .env                               ← GITIGNORE, chỉ ở máy local
  .env.development / .env.production ← ⚠️ PHẢI có trong repo (base href)

frontend/
  next.config.js                     ← rewrite + header riêng /playground
  public/playground/                 ← bản dựng đã commit
```

## Đổi nội dung nhanh

| Đổi gì | Làm gì |
|---|---|
| Thêm/bớt nhạc | sửa `data/musics.js` |
| Thêm module Dự án/Lab | thêm mục vào `data/projects.js` hoặc `data/lab.js` + ảnh 960×540 |
| Chữ 3D | sửa `TEXT` trong `tools/make-letters.py`, chạy Blender headless |
| Nhãn sự nghiệp | sửa `LABELS` trong `tools/make-career.mjs` |
| Từ vựng | xuất lại từ DB local :5432 `cuonghoangdev_db`, bảng `lang_vocab_words` |
| Độ mạnh/tầm đèn pha | `Lighting.setHeadlights()` — `distance`, `spread`, `softness` |
| Kích thước cổng cầu vồng | `World/Rainbow.js` — `OUTER_RADIUS`, `DISTANCE` |

---

# 6. Giấy phép — KHÔNG được xoá

Nguồn: https://github.com/brunosimon/folio-2025 của **Bruno Simon**, **MIT**.

- **GIỮ** `playground-3d/license.md`
- **GIỮ** mục `Credits` trong `sources/data/consoleLog.js`
- Chi tiết: `playground-3d/ATTRIBUTION.md`

Danh tính cá nhân của tác giả gốc không thuộc phạm vi MIT nên bắt buộc phải đổi
— đã làm xong từ đợt trước. Nhạc hiện tại là beat gốc của user, không dính bản
quyền ai; đã ghi rõ trong hộp *Behind the scene*.

⚠️ Phông gốc **Neue Montreal Bold** là phông THƯƠNG MẠI, không có trong kho. Dùng
`Pally-*` sẵn trong `static/fonts/`.

⚠️ **`main` tụt lại HÀNG TRĂM commit** — production chạy từ nhánh `feat/*` vì
`deploy.sh` rsync thẳng thư mục làm việc. **ĐỪNG gộp vào `main`.**
