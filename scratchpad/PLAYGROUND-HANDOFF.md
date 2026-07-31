# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025, MIT, Bruno Simon)

Viết lại **31/7/2026**, sau phiên làm khu Đại học FPT + pháo tên lửa.
Nhánh `feat/playground-3d`. **Đọc hết mục 1 và 2 trước khi sửa bất cứ thứ gì.**

---

# 0. TRẠNG THÁI

- **Đã deploy prod** — chạy tại `cuongthai.com/playground/`.
- Mục **0b đã LÀM XONG** ngày 31/7 (commit `ed5ba98`) — xem mục 0c bên dưới.
- ⚠️ **Có phiên Claude thứ hai làm chung cây repo** (đang sửa `content/academy/*`).
  ĐỪNG `git add -A` ở gốc. Chỉ add đúng thư mục của mình. (Đã kiểm: mấy file
  `content/academy/*.mjs` là dữ liệu seed CHẠY TAY, không có gì tự chạy chúng,
  nên chúng nằm trong cây làm việc lúc `deploy.sh` rsync cũng vô hại.)

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

# 0b. HỆ PHÁ HUỶ + VŨ KHÍ TÊN LỬA — ĐÃ LÀM XONG 31/7 (`ed5ba98`)

Bật ở Cài đặt: **Destruction** (Off · On · Reset) và **Weapon** (Rocket · Missile).
Mã: `FptuDestruction.js` (mới) + sửa `FptuCampus`, `Trees`, `Foliage`, `FptuSwans`,
`FptuPeople`, `VehicleRocket`, `sources/index.html`.

## Cách nó ráp vào

| Việc | Chỗ làm |
|---|---|
| Sổ đăng ký 1544 mảnh | `FptuCampus.box()` — cửa duy nhất mọi khối đi qua |
| Vét nốt mesh KHÔNG qua `box()` | `FptuDestruction.collectPieces()` quét `campus.group` **và** `campus.pineHill.group` (đồi thông treo group riêng dưới `scene`). Bắt được biển vẽ canvas + thông |
| Loại trừ mặt xe chạy | quy tắc "nóc dưới 0,5" trong `box()`, cộng cờ `userData.fptuGround` cho tấm lát và cho mọi mảng `heightPatch` |
| Tắt va chạm mảnh vỡ | `box()` nay GIỮ giá trị `objects.add()` trả về |
| Gỡ từng cây | `Trees.setTreeEnabled(index, bool)` — thân + tán + gốc va chạm cùng lúc |
| Gỡ từng cụm lá | `Foliage.setInstanceEnabled(index, bool)` + `foliage.spots[]` |
| Giết thiên nga / người | `FptuSwans.killAround()` · `FptuPeople.killAround()`, đều có `revive()` |

## BỐN CHỖ ĐÃ SỤP BẪY — đừng đi lại

1. **ĐỪNG đo khối bằng `Box3.setFromObject()` trong `world.step(1)`.** Lúc đó
   `matrixWorld` của mấy nghìn mesh còn là ma trận đơn vị ⇒ mọi hộp bao trả về
   1×1×1 ở GỐC TOẠ ĐỘ. Triệu chứng cực im: mọi khối "ở xa mọi vụ nổ", không lỗi.
   Đo bằng hộp bao CỤC BỘ của hình học nhân `scale` (`register()`).
2. **Đo khoảng cách tới MẶT hộp, không tới tâm hộp.** Tường Alpha dài 7×8×4;
   đo tới tâm thì đầu tường nằm giữa đám lửa vẫn tính là "ở xa".
3. **Đuôi đường cong xác suất KHÔNG ĐƯỢC chạm 0.** Bản đầu `closeness^1,5×1,6`
   ở mép chỉ ~3%/phát ⇒ bắn 4 phát vào Alpha thì hai phát cuối không suy suyển
   gì, đọc ra hệt "toà nhà bất tử". Nay có SÀN 0,35.
4. **Bán kính phá phải bằng `shockRadius`.** Để 6 thì chỉ 6 mảng lọt vào tầm.

## Tên lửa — ba điều đáng nhớ

- **Khí tài đổi theo vũ khí**: `setCannon()` và `setLauncher()` dựng cả hai lên
  thân xe, `apply()` chỉ đổi cái nào `visible`. Getter `this.mount` trả về bộ
  đang dùng, đoạn mã ngắm chỉ viết một lần.
- **Máy quay bám đạn** đăng ký ở **thứ tự 6**, không phải 11: `Player` ghi
  `focusPoint.trackedPosition` ở thứ tự 6 và `View` đọc ở thứ tự 7. Để ở 11 thì
  mỗi nhịp `Player` lại giành máy quay về xe.
- **Bù chiếu** `F = P.xz − offset.xz × (P.y / offset.y)` để quả đạn không nằm
  ngoài khung. ⚠️ Rig máy quay treo THẤP (14–30) và chúc 55°, nên thứ gì bay cao
  cũng gần ống kính: bù đủ thì đạn CHE KÍN màn hình, bù 0,38 thì đạn bay ra ngoài
  mép trên. Chốt: chặn bù ở 0,85 và điều tiết cỡ bằng TRẦN BAY
  (`0,34 × chiều cao máy quay`, sàn 9). Đây là số chỉnh bằng MẮT — cứ vặn.

⚠️ Hệ này chỉ **TẮT** va chạm, không đẻ thêm vật `physical` nào ⇒ không có rủi ro
"vật vô hình chặn xe" theo chiều thêm mới. Hai bộ kiểm vẫn 0 lỗi sau khi làm.

---

# 0c. MÁY QUAY + ÂM THANH — làm 31/7 (`570b3e1`)

## Máy quay rộng hơn

- Thu phóng xa nới `View.spherical.radius.edges.max` **30 → 48**.
  ⚠️ Con số này KHÔNG chỉ là mức thu phóng: `optimalArea.update()` dựng vùng
  nhìn từ chính nó, và vùng đó định `Ligthing.shadowAmplitude` (bề rộng tấm
  bóng đổ), `Fog.near/far`, và halfExtent của `WaterSurface`. Nới thì bóng đổ
  rỗ hơn — đó là cái giá, user đã chấp nhận. Muốn vặn thì vặn đúng chỗ này.
- **Máy quay tự do đã MỞ KHOÁ**: phím **V**, hoặc Cài đặt → Camera → Free.
  `CameraControls` của bản mẫu, vốn khoá sau `debug.active`. Nút Cài đặt do
  chính `View.setFreeCameraButtons()` nối — `Options` dựng ở `Game.js:110`,
  sớm hơn `View`, nối từ đó là chưa có gì để nối.

## Máy quay MƯỢT VÀ ỔN ĐỊNH — bốn lỗi đã sửa (31/7 chiều)

User báo "camera cứ lúc được lúc không, di chuyển bị lệch loạn". Bốn nguyên
nhân RIÊNG BIỆT, đều nằm trong `View.js` trừ cái cuối:

1. **`zoom.ratio` KHÔNG được kẹp sau số hạng tốc độ.** `baseRatio` có kẹp
   [0;1] nhưng tổng `baseRatio + speedAmplitude × zoomSpeedRatio` thì không.
   Chạy nhanh ⇒ ratio âm ⇒ `lerp` ngoại suy ra ngoài dải. Với dải gốc 15–30
   lệch vài phần trăm không ai thấy; nới trần lên 48 là thành cú giật lớn — đo
   được bán kính vọt tới **104,8** khi trần là 48. → thêm `clamp(ratio, 0, 1)`.

2. **Nội suy TUYẾN TÍNH kéo giãn CẢ DẢI.** Nâng `max` 30 → 48 làm mức mặc định
   lúc lái (ratio 0,3) nhảy từ ~25 lên ~38 — cảnh rộng gấp rưỡi, quả tên lửa
   thành một chấm. → đổi sang **mũ 3** (`radius.zoomCurve`): mặc định về lại
   26,3 (bản cũ 25,5) mà kéo hết cỡ vẫn 48.

3. **`speedAmplitude = −0,4` tính cho dải cũ.** Với dải + đường cong mới nó cho
   ra cảnh giãn 82% mỗi lần tăng tốc. → **−0,1**, giãn ~21% như bản gốc.

4. ⚠️ **NaN VĨNH VIỄN — thủ phạm của "lúc được lúc không".**
   `focusPointSpeed = quãng đường / ticker.delta`. `delta` xuống 0 ở khung hình
   đầu sau khi tab được đánh thức, mà điểm nhìn cũng chưa nhúc nhích ⇒ `0/0 =
   NaN`. NaN chạy vào `zoom.ratio`, rồi `smoothedRatio = lerp(NaN, …)` **giữ
   NaN mãi mãi** (bộ lọc hồi tiếp), kéo theo bán kính và vị trí máy quay. Máy
   quay chết hẳn tới khi tải lại trang. → sàn cho `delta` + chốt tự lành
   `if(!Number.isFinite(smoothedRatio)) smoothedRatio = baseRatio`.
   **Đây là lỗi CÓ SẴN của bản mẫu**, chỉ chưa ai gặp vì hiếm khi delta = 0.

## Bám tên lửa: BÙ ĐỘ TRỄ, đừng chống nó

Đã đi sai HAI lần trước khi ra cách đúng — ghi cả ba để khỏi quay vòng:

1. **Ngắm vào vị trí HIỆN TẠI của quả đạn.** Hỏng: đạn lượn ~27 đơn vị/giây mà
   nửa chiều cao khung chỉ ~6; hai tầng làm mượt trễ ~0,3s ⇒ trễ 8 đơn vị ⇒ đạn
   ra ngoài khung. Càng làm mượt càng trễ, càng bớt mượt càng giật.
2. **Neo tĩnh vào mục tiêu.** Hết giật thật, nhưng user bác đúng: "cam nó theo
   tên lửa chứ không đứng ở 1 khung hình như này".
3. ✅ **BÙ độ trễ**: ngắm vào `positionAt(missile.time + CAMERA_LEAD)` với
   `CAMERA_LEAD = 0,3s` — đúng bằng tổng độ trễ. Lúc khung hình đuổi kịp thì
   quả đạn vừa vặn ở đó. Bám sát mà vẫn mượt vì KHÔNG đụng gì vào phần làm
   mượt, chỉ dịch pha. Quá `duration` thì `positionAt` tự bão hoà ở điểm chạm
   đất nên lúc bổ nhào lượng nhìn trước tự về 0.

Kèm ba điều bắt buộc:
- **Bám NGAY từ nhịp đầu** (bỏ hoãn 0,36s cũ — hoãn đó vốn để né cú quăng lúc
  rời bệ, nay ngắm trước nên không còn cú quăng ấy).
- **Bộ lọc đích khởi động từ chỗ máy quay ĐANG NHÌN**, đừng gán thẳng đích:
  gán thẳng thì nhịp đầu nhảy 6,2 đơn vị.
- **Ép trần thu phóng 0,24** (`view.zoom.override`) suốt hành trình: kéo gần
  hết cỡ thì ống kính chỉ cao 8,5 mà đạn bay cao 8 — ngang tầm nhau, "đưa đạn
  vào giữa khung" thành "dán đạn lên ống kính".

Đo sau khi sửa: **0/231 mẫu ra ngoài khung**, bước nhảy lớn nhất **0,72**, máy
quay đi 69–162 đơn vị (tức bám thật, không đứng yên). Khuôn đo:
`scratchpad/diag-chase.mjs`.

## ⚠️ ÂM THANH: `isNight()`, KHÔNG BAO GIỜ đọc cờ interval

`intervalEvents.get('night').inInterval` kiểm theo tiến trình TỰ NHIÊN của đồng
hồ, TRƯỚC khi `override.progress` được áp. Ép Time → Night thì cảnh tối mà cờ
vẫn báo "ban ngày". Bẫy này đã ghi sẵn ở `DayCycles.isNight()` và đã né ở
`Ligthing`/`Rainbow`/`FptuLights`/`VisualVehicle` — **chỉ `Audio.js` bị bỏ sót**
tới 1/8/2026, nên ép ban đêm là chim vẫn hót, cú im, dế nằm ở âm lượng 0.

Nay cả năm chỗ đều hỏi `dayCycles.isNight()`:
- chim chỉ ban ngày · cú chỉ ban đêm
- **dế**: âm lượng bám `isNight()` MỖI NHỊP (`onPlaying`) thay vì chỉ nghe sự
  kiện chu kỳ tự nhiên. Hằng số thời gian **5 giây** ⇒ ~95% sau 15 giây, bằng
  tween gsap gốc. ⚠️ Để 15 là NHẦM hằng số thời gian với tổng thời gian — đo ra
  dế vẫn kêu 0,64 giữa ban ngày.
- **gà gáy / sói hú**: dò LẰN RANH của `isNight()` thay vì nghe sự kiện
  `night`/`deepNight` (sự kiện đó không phát khi ép giờ). Sói hoãn 8–25s.

Khuôn đo: `scratchpad/diag-scene-audio.mjs` và `diag-crickets.mjs`.

## ⚠️ Rapier: đừng gọi vào wasm khi nó còn đang giữ tham chiếu

`FptuDestruction.reset()` gọi `body.setEnabled(true)` có thể ném "recursive use
of an object … unsafe aliasing in rust". Ném GIỮA CHỪNG là tệ nhất: nửa số khối
sống lại, nửa kẹt ở trạng thái vỡ mà hình đã dựng lại — tức "vật vô hình chặn
xe". Nay gom vào mảng rồi bật ở nhịp sau qua `ticker.wait(1)`, có `try/catch`.

⚠️ Cùng lý do: **bộ kiểm ĐỪNG tự bơm `ticker.events.trigger('tick')`** hay gọi
`physicalVehicle.moveTo()` từ `page.evaluate` — vòng lặp rAF thật vẫn chạy song
song, bơm chồng lên là Rapier ném đúng lỗi trên. Đổi cài đặt rồi để game tự
chạy vài nhịp thật. (`audio.update()` không đụng Rapier nên bơm riêng nó thì an
toàn.)

## Tiếng sóng gào suốt trong trường — ĐÃ SỬA

Âm lượng sóng (`Audio.js`, nhóm `waves`) tính theo khoảng cách tới mép **ĐỊA
HÌNH GỐC**: `terrain.size / 2 − |x|`. Địa hình gốc rộng 192 ⇒ nửa cạnh 96, mà
đảo trường ở `x −242…−82` nằm HẲN NGOÀI ⇒ công thức trả số ÂM khắp khu trường,
bị `remapClamp` kẹp về 1, sóng gào kịch trần 0,7 **suốt thời gian ở trong
trường**. Đo trước khi sửa: 0,700 ở cả GIỮA SÂN TRƯỜNG.

Sửa bằng `FptuCampus.distanceToShore(x, z)` — dùng lại y hệt hình siêu-ellipse
của `islandHeight()` để mép nước NGHE được trùng mép nước NHÌN được — rồi lấy
giá trị lớn hơn giữa hai đảo.

⚠️ **Bài học rộng hơn**: mọi thứ trong bản mẫu tính theo `terrain.size` đều SAI
ở khu trường, vì khu trường nằm ngoài địa hình gốc. Thêm gì mà đụng
`terrain.size` thì phải hỏi "ở đảo trường thì sao?".

Đã rà cả 21 nhóm âm thanh, chỉ sóng hỏng:
- gió/mưa/dế/chuông → theo thời tiết và ngày-đêm, đúng
- chim/cú/gà/sói → `getRandomDirection()` bám theo máy quay, đúng ở mọi nơi
- lò lửa/lửa trại → có toạ độ, tự tắt theo khoảng cách, đúng

Khuôn đo (đặt `player.position` + `focusPoint.position` rồi gọi
`game.audio.update()` vài nhịp, đọc `item.volume`) nằm ở
`scratchpad/diag-audio2.mjs` của phiên — chép lại khi cần đo âm thanh.

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
