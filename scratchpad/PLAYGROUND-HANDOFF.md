# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025, MIT, Bruno Simon)

Viết lại **31/7/2026**, sau phiên làm khu Đại học FPT + pháo tên lửa.
Nhánh `feat/playground-3d`. **Đọc hết mục 1 và 2 trước khi sửa bất cứ thứ gì.**

---

# 0. TRẠNG THÁI

- **Đã deploy prod nhiều đợt trong phiên** — chạy tại `cuongthai.com/playground/`.
- **CHƯA push origin.** 12 commit từ `3a6361d` tới `cda5cdf` đang nằm ở local.
  Quy trình chuẩn: user test prod xong xác nhận → mới `git push`.
- ⚠️ **Có phiên Claude thứ hai làm chung cây repo** (đang sửa `content/academy/*`).
  ĐỪNG `git add -A` ở gốc. Chỉ add đúng thư mục của mình.

## Việc CÒN LẠI (user đã chốt làm, chưa động tới)

**Quận Tây-Nam đảo chính** — đất trống hoàn toàn ở `X −80…−25, Z +20…+80`.
User đã chọn **CẢ BỐN** khu:

1. **Sân khấu nhạc hội** — sàn nhảy nhấp theo nhạc thật (đọc biên độ từ Howler),
   lái xe lên 5 bục đĩa than để đổi bài, điểm tương tác dẫn về `/music`.
2. **Sân bóng đá lái xe** (kiểu Rocket League) — bóng Rapier động, 2 khung thành,
   đếm bàn thắng + thành tựu. Kèm dốc nhảy, vòng lật, bập bênh.
3. **Làng ngôn ngữ JA/EN/ZH** — torii + vườn đá, cổng tam quan + đèn lồng, tháp
   đồng hồ. Tông vào khối chữ = câu hỏi từ vựng, nối `VocabQuiz` (1221 từ sẵn có).
4. **Bến cảng + hải đăng** — cầu tàu, thuyền, đèn hải đăng QUÉT thật ban đêm,
   container xếp chồng để húc.

Khi dựng khu mới nhớ: **điểm hồi sinh phải khai trong `Respawns.js`** (chạy
TRƯỚC `world.step(1)`, thêm từ chỗ khác là mất mục trên bản đồ mà không báo lỗi),
và thêm một dòng vào `Map.js → setLocations()`.

---

# 0b. YÊU CẦU MỚI — user chốt 31/7, CHƯA LÀM (ưu tiên hơn quận Tây-Nam)

## A. Hệ PHÁ HUỶ + mục Cài đặt 3 nút: Bật · Tắt · Reset lại như ban đầu

Bắn tới đâu phá tới đó, càng chân thật càng tốt:
- **Nhà**: vỡ DẦN, đổ sập từng mảng (không biến mất một phát)
- **Cây cối**: gãy/biến mất
- **Nước**: bắn xuống hồ thì tung toé lên
- **Thiên nga**: trúng thì chết
- **Reset**: trả toàn khu về nguyên trạng ban đầu

## B. Vũ khí thứ hai: TÊN LỬA (đổi vũ khí trong Cài đặt)

Mạnh hơn rocket hiện tại. Đường bay: bắn xong **lượn một vòng tròn 2–3 giây trên
trời**, rồi **bổ nhào từ trên xuống**. Sức công phá + xung kích **gấp 5 lần**
rocket. Âm thanh, khói… phải giống tên lửa thật.

## KHẢO SÁT ĐÃ LÀM SẴN — đừng dò lại

| Cần gì | Đã tìm thấy |
|---|---|
| Sổ đăng ký mảnh phá huỷ | `FptuCampus.box()` là cửa duy nhất mọi khối đi qua ⇒ nhét đăng ký vào đó là bắt trọn tường/mái/cửa sổ, không phải kê khai tay. Nhớ **loại trừ `slab()`** (nó gọi `box()` để lát nền — nền không được phá) |
| Tắt va chạm của mảnh đã vỡ | `game.objects.add()` **trả về object**, lấy `object.physical.body` rồi `setEnabled(false)`. Hiện `box()` vứt giá trị trả về đi — phải giữ lại |
| Gỡ TỪNG cây | `Trees` có `this.references` (mảng Object3D) và `Foliage` cũng `this.references`, mỗi phần tử dùng `scale.x` làm cỡ ⇒ đặt `scale` về 0 + `needsUpdate` là cây biến mất. `campus.leafClusters` là `Foliage` chung của mọi tán lá mềm |
| Giết thiên nga | `FptuSwans` giữ `this.swans` (mảng, mỗi con có `group`). Lật `group` + cho chìm, và nhớ **cho `update()` bỏ qua con đã chết** |
| Vụ nổ sẵn có | `world.fireballs.create(toạ độ, bánKínhLửa, bánKínhNổ)` · `explosions.explode(toạ độ, bánKính, sứcMạnh)` · tiếng nổ đăng ký theo khuôn `ExplosiveCrates` |
| Mảnh vỡ bay | **ĐỪNG** tạo thân Rapier cho từng mảnh (nặng). Tự tính vận tốc + trọng lực + nảy như `VehicleRocket.spawnBlast()` đang làm với 12 mảnh văng |

## GỢI Ý KIẾN TRÚC

- `FptuDestruction.js` — giữ `pieces[]` gồm `{ mesh, object, home: {position, quaternion, scale} }`;
  `damage(center, radius, power)`; `reset()`. `FptuCampus` sở hữu mảng `this.destructibles`
  (khai TRƯỚC `setIsland()`), `FptuDestruction` đọc lại.
- **Nhà vỡ dần**: nhà vốn đã ghép từ nhiều khối (tường, mái, lan can, đố cửa) nên
  chỉ cần phá theo bán kính là tự ra hiệu ứng sập từng mảng.
- Vũ khí thành **tham số** của `VehicleRocket` (`weapon: 'rocket' | 'missile'`),
  đừng viết class thứ hai — chỉ khác đường bay và hệ số nổ.
- Tên lửa 3 pha: **bốc lên** (~0,6s) → **lượn vòng** trên cao 2–3s → **bổ nhào**.
  Bóng đổ dưới đất (đã có ở rocket) sẽ vẽ nguyên vòng tròn — chính là thứ giúp
  người chơi bám dấu khi đạn khuất khỏi khung hình.
- Nút Cài đặt: theo khuôn `.segmented` sẵn có (xem mục Time/Rocket trong
  `index.html` + `Options.js`). ⚠️ Nút cho thứ dựng trong world phải do **chính
  module tự nối** — xem bài học 2.7.

⚠️ **Sau khi thêm bất cứ thứ gì có va chạm: chạy lại hai bộ kiểm ở mục 1 VÀ lái
thử lại tuyến liên quan.** Phá huỷ đụng thẳng vào collider nên rủi ro sinh "vật
vô hình" là cao nhất từ trước tới nay.

---

# 1. BA BỘ KIỂM — CHẠY TRƯỚC KHI TIN BẤT CỨ THỨ GÌ

Cần dev server sống: `cd playground-3d && npm run dev` (xem mục 4).

```bash
node tools/check-fptu-layout.mjs        # công trình đè nhau, đường bị chắn, thò ra biển
node tools/check-ghost-colliders.mjs    # VA CHẠM MỒ CÔI + MẶT TRANH NHAU CHIỀU SÂU
```

`check-ghost-colliders.mjs` là bộ kiểm **quan trọng nhất** của khu này — nó bắt
đúng hai lỗi mà mắt không thấy và người dùng đâm phải suốt:

- **A. Va chạm mồ côi** = collider không có hình nào gần ⇒ "vật vô hình chặn xe"
- **B. Mặt tranh nhau chiều sâu** = hai tấm chồng nhau, mặt trên lệch < 0,008
  ⇒ vệt nhiễu nhấp nháy

⚠️ **Chính bộ kiểm đã tự báo sai HAI lần**, phải sửa nó trước khi tin:
1. Không đọc `InstancedMesh` → báo oan mọi gốc cây là mồ côi.
2. Đo mesh bằng GỐC TOẠ ĐỘ → báo oan 6 mồ côi ở cụm chướng ngại vật (nó là một
   mesh gộp, gốc nằm lệch hẳn khỏi hình). Nay đo bằng **hộp bao**.

**Hiện tại cả hai bộ kiểm đều 0 lỗi.**

## Bộ kiểm KHÔNG bắt được gì

Không bộ nào so **vật cản với LÒNG ĐƯỜNG**. Trong phiên này tôi đặt vật chắn lối
xe **BỐN lần liên tiếp**, lần nào cũng chỉ lái thật mới lộ:

| # | Vật | Chỗ |
|---|---|---|
| 1 | cột cờ | giữa tim trục lễ nghi |
| 2 | biển hiệu FPT/QS | giữa lối cổng Bắc |
| 3 | cột đèn | (−100,4 · 24), giữa lối cổng Nam |
| 4 | hai tường biển | đúng ĐẦU CẦU, chừa khe 2 đơn vị trong khi xe rộng 1,9 |

⚠️ **Quy tắc: thêm bất cứ vật nào có `physical: true` gần đường ⇒ PHẢI lái thử
lại tuyến đó.** Xem mục 3 để biết cách lái tự động.

---

# 2. BẢY BÀI HỌC ĐẮT NHẤT

## 2.1 MỘT hàm cao độ, đừng ghép hộp nghiêng

Mọi chỗ "xe kẹt" đều sinh ra từ cùng một kiểu làm: ghép nhiều hộp nghiêng thành
một cái dốc. Hộp ghép bao giờ cũng hở, và mỗi khe là một bậc bánh xe không leo nổi.

Dùng `FptuCampus.heightPatch(cx, cz, sizeX, sizeZ, cols, rows, fn, hex, colorFn)`
— một hàm `fn(x,z)` sinh ra CẢ hình LẪN va chạm nên không thể lệch.

- ⚠️ **Thứ tự tham số heightfield của Rapier: `[nrows, ncols]` với `nrows` là số
  ô theo trục Z, `ncols` theo trục X.** Mảng xếp `heights[iz + ix*(nrows+1)]`.
  Suy từ `Floor.setPhysical()` — chỗ duy nhất đã chạy đúng thật. Lưới ở đó VUÔNG
  nên đổi chỗ hai tham số không ai thấy; hồ thì dẹt (36×26) nên lộ ngay.
- Đường sinh nên là **smoothstep** `t*t*(3-2t)`: đạo hàm 0 ở cả hai đầu nên không
  có gờ ở chân lẫn đỉnh.
- Mép mảng trả về thấp hơn mặt nền ~5 phân để nền che, tránh z-fighting.

Nay cả đảo, cả bờ, hai lòng hồ, đồi thông và cù lao đều là `heightPatch`.

## 2.2 Tấm lát PHẢI có va chạm

`slab()` tạo luôn collider. Trước đó tấm lát chỉ là hình còn mặt cứng vẫn là mặt
đảo ở 0,04 ⇒ xe chìm 10–16 phân dưới mặt sân (user: "đi đang bị lún").

## 2.3 Đừng đắp hộp làm cây

Mọi tán lá mềm đi qua `campus.canopy(x, y, z, scale)` → gom vào `canopySpots` →
cuối hàm dựng tạo MỘT `Foliage` chung (hệ lá của bản mẫu: phiến xoay, chuyển sắc,
lay theo gió). **Thấy `COLORS.foliage` trong một `box()` là sai.**

## 2.4 Nội dung biển bảng vẽ bằng CANVAS

`FptuSigns.painted(w, h, draw)` → `CanvasTexture` + `MeshDefaultMaterial({
colorNode: textureNode(map) })`. Đắp hộp thì ra mấy ô màu vô nghĩa (user chê 2 lần).

⚠️ Hàm co chữ: **đừng `parseInt(font)`** — chuỗi "bold 129px sans-serif" cho NaN
nên vòng lặp không chạy và chữ tràn đè lên nhau. Bóc bằng `/(\d+)px/`.

## 2.5 Đồ của thế giới mẫu dựng LƯỜI

`Objects` chỉ tạo thân vật lý khi người chơi tới gần. Muốn dời đồ của bản mẫu:

- Gọi trong hàm dựng → KHÔNG ăn (thân chưa tồn tại). Phải `ticker.wait(2)`.
- Cụm `blocks`/`bumpers001` là **HAI vật rời**: `blocks` giữ HÌNH, `bumpers001`
  giữ VA CHẠM (một thân mang TÁM collider lệch ra quanh nó). Xét mỗi vị trí thân
  là dời được va chạm mà bỏ lại hình, và ngược lại.
- Xem `FptuCampus.relocateSampleObstacles()` — nó ghi lại đủ ba cách đã thất bại.

## 2.6 Vật liệu và ánh sáng

- Chỉ có **MỘT nguồn sáng** trong cả thế giới. Thả `PointLight` là vô nghĩa —
  ánh lửa phải là vật liệu tự phát sáng `emissiveOrangeRadialGradient`
  (lấy qua `game.materials.getFromName(...)`).
- **Cộng sáng trên nền đất cam đẩy màu về TRẮNG.** Dùng pha trộn thường.
- Khói/vệt sáng mềm: canvas radial gradient → `colorNode = tex.rgb`,
  `opacityNode = tex.a`, `transparent`, `depthWrite:false`.
- ⚠️ Vệt sáng phải treo **CAO HƠN mọi lớp lát** (lát cao nhất 0,20 → vệt ở 0,36).
- Màu theo đỉnh: `colorNode: attribute('color')`. **Pha LIÊN TỤC, đừng cắt ngưỡng**
  (cắt ngưỡng thì ranh giới chạy men theo cạnh tam giác, ra dải răng cưa). Nhiễu
  cho mép tự nhiên phải NHỎ HƠN dải chuyển màu.

## 2.7 Thứ tự khởi tạo

`Game.js`: `options` 110 · `weather` 117 · `world` 126 · **nội dung thế giới ở
`world.step(1)` dòng 199**. Chạm sớm ⇒ game đứng ở `resources`, **KHÔNG một dòng
lỗi**. Cách nhận biết: `Object.keys(window.game)` dừng ở `resources`.

⇒ **Nút trong bảng Cài đặt cho thứ dựng trong world phải do CHÍNH module tự nối**,
không nối từ `Options` (đã thử `ticker.wait(2)` và vẫn sớm). Xem
`VehicleRocket.setSettingsButtons()`.

---

# 3. TEST TỰ ĐỘNG

Playwright 1.61 + chromium **có sẵn trong `node_modules` của repo gốc**. Script ở
scratchpad ngoài repo phải nạp theo đường dẫn tuyệt đối:

```js
const { chromium } = await import('/Users/admin/Downloads/api-backend/node_modules/playwright/index.mjs')
```

## Vào game (khuôn đã chạy được)

```js
await page.waitForFunction(() => window.game?.world?.intro?.text?.mesh && window.game?.world?.intro?.soundButton?.mesh)
await page.getByRole('button', { name: /play/i }).first().click().catch(async () => {
    await page.evaluate(() => document.querySelector('.js-intro-play, .intro button, button')?.click())
})
await page.waitForTimeout(2500)
await page.evaluate(() => { if(window.game.world.intro?.text) window.game.reveal.updateStep(1) })
await page.waitForTimeout(3000)
await page.evaluate(() => window.game.player.respawn('fptu'))
await page.waitForTimeout(6000)
// CHỐT KIỂM: màn chào phải biến mất, không thì mọi ảnh chụp đều vô nghĩa
```

- Màn chào là lớp **HTML nằm trên canvas** — `reveal.updateStep(1)` KHÔNG gỡ nó.
- Gọi `updateStep(1)` khi `world.intro.text` đã bị dọn là **ném lỗi** trong `Reveal.js`.
- Ép ban ngày/đêm: `game.dayCycles.preference.set('day'|'night', 0)`.

## Lái tự động

`Player.updatePrePhysics()` kiểm `action.**active**` RỒI mới cộng `action.value`.
Bơm mỗi `value` thì xe đứng im và **mọi ca test đều báo "kẹt"**, kể cả trên đất trống.

```js
const a = window.game.inputs.actions.get('forward'); a.active = true; a.value = 1
```

⚠️ **Luôn để một CA ĐỐI CHỨNG ở chỗ chắc chắn lái được.** Ca đó fail thì dừng,
đừng tin số nào. Và thả xe tránh nhà + cột đèn (cột đèn ở x = −106 ± 5,6 dọc
đường lớn; và dọc hai đường vào ở lề ngoài).

---

# 4. QUY TRÌNH DỰNG & DEPLOY

```bash
cd playground-3d && npm run dev          # :5173 — KHÔNG đi qua Next
```

⚠️ `preview_start` báo một cổng nhưng **Vite nhảy cổng khác** khi bận —
đọc `preview_logs` lấy cổng THẬT. Phiên này Vite chạy ở **:5175**.

```bash
cd playground-3d && npm run build
cd .. && rm -rf frontend/public/playground && mkdir -p frontend/public/playground
rsync -a playground-3d/dist/ frontend/public/playground/

# Kiểm tên gói khớp
B=$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' frontend/public/playground/index.html | head -1)
ls "frontend/public/playground/$B"
# Cờ dev KHÔNG được lọt vào gói phát hành
grep -c "window.game" frontend/public/playground/assets/index-*.js   # phải 0
```

⚠️ **Commit PHẢI gồm CẢ HAI thư mục**:
`git add -A playground-3d frontend/public/playground`
Phiên này đã sót `frontend/public/playground` suốt 6 commit — prod vẫn đúng (deploy
rsync thẳng cây làm việc) nhưng repo giữ gói cũ, ai checkout sạch là ra bản cũ.
Đã vá ở `cda5cdf`.

Deploy: `bash deploy.sh` → **user test prod** → mới `git push`.

⚠️ `window.game` chỉ lộ khi `VITE_GAME_PUBLIC` (đặt trong `.env.development`).
**ĐỪNG đặt vào `.env`** — file đó áp cho cả bản dựng production.

---

# 5. BẢN ĐỒ FILE

```
playground-3d/sources/
  data/fptu.js                  ← MỌI SỐ LIỆU BỐ CỤC khu trường + LÝ DO
  data/musics.js                ← danh sách nhạc (nay 12 bài Beat 1–5, 7–13)
  Game/World/
    FptuCampus.js               ← nền đảo, đường, Alpha, nhà, hồ · heightPatch · canopy
    FptuProps.js                ← đồ đạc + `blocked()` (VÙNG CẤM ĐẶT ĐỒ)
    FptuPeople.js               ← người có khớp, biết đứng/ngồi/đi
    FptuLights.js               ← 103 đèn lồng mẫu + vệt sáng ban đêm
    FptuSigns.js                ← biển xếp hạng THE, biển đá cổng, bệ chữ (canvas)
    FptuPineHill.js             ← đồi thông + tượng Self Made Man
    FptuSwans.js · FptuQuiz.js  ← thiên nga · hộp thoại cổng + câu hỏi theo kỳ
    VehicleRocket.js            ← MỚI: pháo tên lửa trên nóc xe
  Game/Options.js               ← nút trong bảng Cài đặt
  index.html                    ← màn chào, bảng Cài đặt, hộp thoại cổng
  style/general.styl            ← `.segmented`, `.fptu-gate-mute`
playground-3d/tools/
  check-fptu-layout.mjs · check-ghost-colliders.mjs
frontend/public/playground/     ← GÓI ĐÃ DỰNG (nhớ commit!)
```

## Khu FPTU có gì (bản hiện tại)

Đảo riêng ngoài khơi Tây, nối bằng cầu (đã BỎ lan can theo yêu cầu user).
Mặt tiền: **hai cổng xe hai bên + bậc sảnh giữa** mang biển xếp hạng THE và biển
hiệu FPT/QS. Sau sảnh là cụm chữ **FPT UNIVERSITY** trên bệ ghi "CAMPUS HA NOI",
quay mặt về cổng, có một hàng cọ phía sau. Trong sân: Alpha giật cấp có sảnh
xuyên qua, hồ sen có cù lao, hồ thiên nga, đồi thông + tượng, 8 Dom, nhà ăn, bãi
xe, sân bóng đá/rổ/võ (đều có viền cây xanh).

⚠️ **Trục lễ nghi cũ đã BỎ**: bệ chữ nằm giữa nên xe đi bằng **hai đường từ hai
cổng** rồi vòng qua sân trước Alpha. `AXIS` nay chỉ còn đoạn tiếp cận sảnh
(−144 → −153).

## Pháo tên lửa

Cài đặt → **Rocket → On**. Ngắm bằng chuột (có vòng ngắm dưới đất), bấm **X** để
bắn (Enter là phím phụ — nó trùng `interact`).

Dùng lại bộ máy của bản mẫu: `world.fireballs.create()` +
`explosions.explode()` (sức nổ VẬT LÝ thật, hất lật cả xe) + tiếng nổ của thùng
thuốc nổ. Đắp thêm sóng xung kích, chớp sáng, khói cuộn, 12 mảnh văng.

⚠️ Đăng ký âm thanh phải theo ĐÚNG khuôn `ExplosiveCrates` (kể cả `positions`,
`distanceFade`, `onPlay`) — thiếu `onPlay` thì `play(toạ độ)` không kêu gì.

Vòng cung cao (hệ số 0,78, trần 24) nên đạn có lúc khuất khỏi khung hình — bù lại
có **bóng đổ** chạy dưới đất bám theo đạn.

---

# 6. GIẤY PHÉP — KHÔNG ĐƯỢC XOÁ

MIT, Copyright (c) 2025 Bruno Simon. GIỮ `playground-3d/license.md` và mục
`Credits` trong `sources/data/consoleLog.js`. Chi tiết ở `playground-3d/ATTRIBUTION.md`.
Phông gốc Neue Montreal Bold là phông THƯƠNG MẠI — dùng `Pally-*` trong `static/fonts/`.
Nhạc là beat gốc của user, không dính bản quyền ai.

⚠️ **`main` tụt lại hàng trăm commit** — production chạy từ nhánh `feat/*` vì
`deploy.sh` rsync thẳng thư mục làm việc. **ĐỪNG gộp vào `main`.**
