# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025, MIT, Bruno Simon)

Viết lại **31/7/2026**, sau phiên làm khu Đại học FPT + pháo tên lửa.
Nhánh `feat/playground-3d`. **Đọc hết mục 1 và 2 trước khi sửa bất cứ thứ gì.**

---

# 0. TRẠNG THÁI

## Deploy — kiểm trước khi tin

**1/8 tối**: mọi thứ tới đó đã lên prod và ĐÃ PUSH (`de547bf`, gói
`index-DiwDiDLl.js`) — chế độ lái người thứ nhất, đảo quái vật, tàu sân bay.

**2/8**: **CHẾ ĐỘ SINH TỒN** (mục 0i) — quái + sóng + máu đen + tiền, cộng
**cửa hàng nâng cấp** (7 món), **cơ chế NẤP**, **quái trùm dùng MODEL THẬT**,
**súng máy phím F**, **xuống xe đi bộ phím E**, **trực thăng**, và
**SÂN KHẤU NHẠC HỘI** trên đảo sân chơi. Gói `index-c6xb0N8V.js`
đã dựng và rsync sang `frontend/public/playground`. **CHƯA deploy, CHƯA push.**

Đầu phiên sau, so gói prod với local; lệch thì chạy `bash deploy.sh` nền:

```bash
curl -sL https://cuongthai.com/playground | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1
grep -o 'assets/index-[A-Za-z0-9_-]*\.js' frontend/public/playground/index.html | head -1
```

⚠️ **Mẹo tra gói nào thuộc commit nào** (rất hữu ích khi deploy chồng nhau):
`git show '<sha>:frontend/public/playground/index.html' | grep -o 'assets/index-[^"]*\.js'`
— phải QUOTE cả chuỗi, không thì zsh nuốt mất `:f` và git báo "ambiguous argument".

---

- Prod: `cuongthai.com/playground/`, `city/city.glb` phục vụ được (2,55 MB).
- Mục **0b** (phá huỷ + tên lửa) và **0c** (máy quay + âm thanh) xong 31/7.
- Mục **0d** (đảo sân chơi + sân bóng đá lái xe) xong 1/8 — đã live, đã push.
- Mục **0e** (đảo thành phố + nhà xe) xong 1/8 — **đã live**, commit `95b3582`.
- ⚠️ **`deploy.sh` mất HƠN 10 PHÚT** khi gói đổi nhiều — chạy nền
  (`run_in_background`), đừng để timeout cắt giữa chừng. Lần bị cắt ngày 1/8:
  prod vẫn sống nguyên nhưng còn chạy gói CŨ; chạy lại là xong, không hỏng gì.
- ⚠️ **Phiên Claude thứ hai PUSH CHUNG NHÁNH.** Ngày 1/8 họ push
  `feat/playground-3d` và commit playground đi kèm luôn, dù mình chưa gọi
  `git push`. Kiểm bằng `git reflog show origin/feat/playground-3d` trước khi
  kết luận "chưa push".
- ⚠️ **Có phiên Claude thứ hai làm chung cây repo** (đang sửa `content/academy/*`).
  ĐỪNG `git add -A` ở gốc. Chỉ add đúng thư mục của mình. (Đã kiểm: mấy file
  `content/academy/*.mjs` là dữ liệu seed CHẠY TAY, không có gì tự chạy chúng,
  nên chúng nằm trong cây làm việc lúc `deploy.sh` rsync cũng vô hại.)

## 🔜 VIỆC TIẾP THEO — user chốt 1/8, theo thứ tự này

### 0. Hai bài học vừa trả giá ở thành phố (1/8) — áp cho MỌI khu sau

**Z-FIGHTING**: mảnh model ngoài thường có mặt trên nằm đúng ở gốc toạ độ của
nó. Đặt ở `GROUND_TOP` là trùng khít mặt nền — đo được **chênh 0,3 mm**, và
triệu chứng user thấy là "nhà bị nhiễu giật giật" cộng với việc **đường và vạch
kẻ biến mất khỏi ảnh**. Luôn nhấc lên: nền → đường (+0,05) → vạch kẻ (+0,10).

**DRAW CALL**: clone thẳng từng mảnh kit ⇒ 3035 mesh riêng lẻ chỉ riêng thành
phố, tổng cả thế giới vọt 3734 → 6759, và user báo "game rất lag". Dùng
`InstancedMesh`: `place()` chỉ GOM ma trận, `buildInstances()` chạy sau cùng.
Kết quả 3035 → 77 mesh + 59 instanced, tổng về 3860.
⚠️ Ma trận mỗi bản sao = `matrixInstance × matrixCụcBộCủaMeshCon` — bỏ vế sau
thì mọi chi tiết dồn về gốc mảnh.

⚠️ `check-ghost-colliders.mjs` CÓ mục "mặt tranh nhau chiều sâu" — sinh ra đúng
để bắt z-fighting — nhưng nó **chỉ soi khu FPTU** nên không thấy gì ở thành phố.
**Nên mở rộng nó sang cả bốn đảo.**

### 1. ✅ Chế độ lái NGƯỜI THỨ NHẤT — XONG 1/8, xem mục **0f**

### 2. ✅ Chế độ SINH TỒN — XONG 2/8, xem mục **0i**

Đã có: quái + sóng + máu đen + tiền · **cửa hàng nâng cấp** · **cơ chế NẤP**
(tắt đèn, đứng yên, ra xa) · **quái trùm mỗi 5 sóng**.

**Kế hoạch Sinh tồn user chốt 1/8 nay ĐỦ CẢ**: đêm dài hơn ngày · quái nhiều
loại chỉ ra ban đêm · máu đen + rơi tiền · vũ khí · nấp · **trực thăng** · đi bộ.

Còn treo: nâng cấp giữ qua nhiều ván · **tiếng quái thật** (kho bản mẫu không có
tiếng quái nào, đang mượn tạm — user đang tìm file, sẽ để ở
`~/Downloads/Play Ground/Âm thanh/`) · credit Sketchfab cho model trùm.

### 3. Ba khu còn lại trên đảo sân chơi

Đất đã chừa sẵn trong `PLOTS` (xem mục 0d):

1. **Sân khấu nhạc hội** (`PLOTS.concert`, tâm 34 · 150) — sàn nhảy nhấp theo
   nhạc thật (đọc biên độ từ Howler), lái xe lên 5 bục đĩa than để đổi bài,
   điểm tương tác dẫn về `/music`.
2. **Làng ngôn ngữ JA/EN/ZH** (`PLOTS.village`, tâm −30 · 184) — torii + vườn
   đá, cổng tam quan + đèn lồng, tháp đồng hồ. Tông vào khối chữ = câu hỏi từ
   vựng, nối `VocabQuiz` (1221 từ sẵn có).
3. **Bến cảng + hải đăng** (`PLOTS.harbour`, tâm 34 · 186) — cầu tàu, thuyền,
   đèn hải đăng QUÉT thật ban đêm, container xếp chồng để húc.

Khi dựng khu mới nhớ: **điểm hồi sinh phải khai trong `Respawns.js`** (chạy
TRƯỚC `world.step(1)`, thêm từ chỗ khác là mất mục trên bản đồ mà không báo lỗi),
thêm một dòng vào `Map.js → setLocations()`, và **thêm ô đất vào `PLOTS`** để
`PlayIsland.setScenery()` không trồng cây vào giữa khu.

## ⛔ "Quận Tây-Nam đảo chính" — Ý TƯỞNG NÀY ĐÃ CHẾT, ĐỪNG HỒI SINH

Bàn giao cũ ghi *"đất trống hoàn toàn X −80…−25, Z +20…+80"*. **SAI.** Đo lại
ngày 1/8 bằng ba cách độc lập, đều khớp:

| Cách đo | Kết quả |
|---|---|
| Bắn tia lưới 1 đơn vị | Hình chữ nhật trống lớn nhất ở đó chỉ **17 × 12** |
| Quét collider | **Đường đua Circuit chạy xuyên qua** — checkpoint 006 (−60,8 · 16), 007 (−56 · 70,5) và bốn tấm mặt đường lớn |
| Ảnh `static/ui/map/map-day.png` + cao độ | Một **cái hồ** chiếm x −69…−36, z 25…52, lòng sâu −1,46 (đáy nước −1,5 nên vật rơi vào là bị `Objects.update()` reset) |

Quét **toàn bộ đảo chính**: chỗ trống lớn nhất trên cả đảo là **24 × 14**
(x −92…−70, z 28…40). Sân bóng lái xe cần tối thiểu ~40 × 28 ⇒ **đảo chính đã
kín**. Muốn thêm khu mới thì dựng đảo mới, đừng đi tìm đất trên đảo cũ.

Mẹo đo lại nhanh: bắn tia xuống theo lưới, loại ô nào nằm trong tấm đường đua
hoặc gần một trong ~590 collider đứng, rồi tìm hình chữ nhật toàn-trống lớn nhất
bằng thuật toán histogram.

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

---

# 0d. ĐẢO SÂN CHƠI + SÂN BÓNG ĐÁ LÁI XE — làm 1/8 (`44c4c0a`)

Đảo riêng thứ HAI, ngoài khơi phía **Nam**, nối bằng cầu từ (x = 0, z = 76).
Mã: `data/playisland.js` · `PlayIsland.js` · `FootballArena.js` (đều MỚI), cộng
bốn chỗ móc vào `World.js` · `Respawns.js` · `Map.js` · `Audio.js`.

**`PlayIsland` CỐ Ý ĐỘC LẬP với `FptuCampus`** dù bộ hàm dựng (`box`, `slab`,
`heightPatch`, `canopy`) gần như y hệt. Gộp chung nghĩa là mỗi lần sửa đảo mới
đều có thể làm hỏng khu FPTU đang chạy trên production. Với dự án này, cách ly
đáng giá hơn tránh trùng mã.

## Số đo chốt

| Thứ | Toạ độ |
|---|---|
| Đảo (phần đất) | x −56…68 · z 100…200 (tâm 6 · 150, 124 × 100) |
| Cầu | x = 0, z 76 → 106, rộng 9, không lan can |
| Đường trục | x = 0, z 104 → 190 |
| Đường ngang | z = 126 (x −50…4) · z = 150 (x −4…56) · z = 184 (x −34…44) |
| Sân bóng | tâm −30 · 150, lòng sân 34 × 26, tường cao 2,6 |
| Sân tập | tâm −29 · 118, dàn theo X: vòng lật −50…−40 · dốc −38,5…−19,5 · bập bênh −20…−8 |
| Điểm hồi sinh `arena` | (0 · 110), yaw −π/2 (quay vào đảo) |

## ⛔ LỖI ĐÃ LÀM ĐỨNG KHUNG HÌNH — nửa-cạnh collider ÂM

User báo: *"lái xe di chuyển nó mới bị, chứ đứng yên 1 chỗ không sao"*.

**Một dòng duy nhất**: `spineLength = spine.toZ - spine.fromZ`. Đảo này nằm ở
z ÂM và đường trục chạy từ −204 **xuống** −390, nên hiệu ra **−186**. Số âm đó
đi thẳng vào `halfExtents` của Rapier: `(5,5 · 0,02 · −93)`.

Chuỗi hỏng: cuboid nửa-cạnh âm ⇒ mọi va chạm với nó trả **NaN** ⇒ vị trí xe NaN
⇒ âm lượng NaN ⇒ `setValueAtTime` **NÉM LỖI** giữa chuỗi tick ⇒ mọi handler sau
đó, kể cả `Rendering.render` (nhịp **998**), không bao giờ chạy ⇒ **đứng khung
hình mà xe vẫn di chuyển được** (vật lý ở nhịp 2–5, trước chỗ ném lỗi).

⚠️ **Vì sao gần như không thể tìm ra bằng mắt:**
- **HÌNH vẫn hiện bình thường** — mesh scale âm chỉ lật mặt, vẫn vẽ đủ.
- Chỉ hỏng khi xe **CHẠM** vào collider đó ⇒ đứng yên thì không sao.
- **Không tất định** — có lần lái qua vẫn êm.
- Đảo sân chơi có **cùng dòng mã**, không lỗi, chỉ vì z ở đó TĂNG dần.

⚠️ **Cách tìm ra** (ghi lại vì mất rất nhiều lượt đo sai trước đó):
1. Headless **KHÔNG đo được hiệu năng** — nó bóp rAF khi trang không tương tác,
   landing cũng ra 0,5 fps y như chỗ hỏng. Phải `headless: false`.
2. Đo lúc **ĐỨNG YÊN** thì không thấy gì (đảo quái còn nhanh nhất: 110 fps,
   draw 141). Phải **lái thật bằng phím** — trong cửa sổ thật thì lái được.
3. Dấu hiệu quyết định: **draw call tụt còn 5** trong khi xe vẫn đi được 86 đơn
   vị ⇒ chuỗi tick đứt giữa chừng, không phải máy yếu.
4. Một khi NaN xuất hiện thì **dính luôn**; mọi phép đo sau đó trên cùng trang
   đều vô nghĩa. Mỗi kịch bản phải một trang sạch.
5. Chốt hạ: duyệt `forEachCollider` đọc `halfExtents()` — ra ngay số âm.

Nay có ba lớp chặn: `Math.abs()` ở chỗ tính, cảnh báo `console.warn` + `Math.abs`
trong `box()`, và **mục "nửa-cạnh âm/NaN" trong `check-monster-island.mjs`**.

## NĂM chỗ đã sụp bẫy

1. **Chiều dài sân bị chặn bởi BỀ NGANG ĐẤT, không phải ý thích.** Tổng bề ngang
   sân = `innerWidth + 2 × (goal.depth + tường)` = innerWidth + 12, mà chỗ dùng
   được chỉ từ x −52 (chừa bờ) tới −8 (chừa lòng đường) tức 44. Để innerWidth 42
   ⇒ khung thành Đông ĐÈ LÊN ĐƯỜNG TRỤC. Muốn sân dài hơn phải nới đảo hoặc dời
   trục, không phải chỉ sửa mỗi con số đó.
2. **Đường ngang z = 150 xuyên thẳng qua lòng sân bóng.** Bản đầu cho nó chạy từ
   x = −50; bắn tia đo được bậc 3,43 ngay giữa "đường" — chính là tường sân. Nay
   nó chỉ chạy về phía Đông, lối vào sân đi bằng đường z = 126.
3. **Bập bênh đặt `z + 16` với `ARENA_STUNTS.z = 119` ra đúng z = 135**, tức
   biên Bắc sân bóng: hai tấm nghiêng cao 1,32 nằm chềnh ềnh trong lòng sân.
   Nay mọi thứ ở sân tập dàn theo TRỤC X trên cùng một dải z.
4. **Hình trụ của `cylinderGeometry` DÀI THEO TRỤC Y.** Truyền chiều dài vào
   `depth` rồi xoay X 90° thì trục lăn bập bênh hoá thành CỘT CAO 8 ĐƠN VỊ đâm
   lên trời (bắn tia đo được nóc ở 4,59). Chiều dài phải vào tham số `height`.
5. **Bảng điểm không có chỗ đặt xuống đất.** Khoảng giữa mép đường z = 126
   (tới 130,5) và bậc khán đài ngoài cùng (từ 130,7) chỉ hở 0,2. Nay treo lên
   tường Bắc, cột đỡ đứng trên ĐỈNH TƯỜNG, cả bảng lẫn cột đều không va chạm.

## API dễ gọi nhầm

- `notifications.show(html, type, duration, callback, id)` — **không có** `add({…})`.
- `View.MODE_FREE` là **SỐ (2)**, không phải chuỗi `'free'`. `setMode('free')`
  không khớp nhánh nào trong `View.update()` và máy quay đứng chết ở khung cũ.
- `RAPIER.ShapeType.HeightField` là **7**, KHÔNG phải 8 (enum bỏ trống số 8, đẩy
  `HalfSpace` xuống 17). Đoán số này là nền đảo bị tính thành "vật cứng nằm giữa
  đường" — heightfield không có `halfExtents` nên nóc rơi vào nhánh mặc định 0,5.

---

# 0e. ĐẢO THÀNH PHỐ + NHÀ XE — làm 1/8 (`3414092`, `95b3582`) — ĐÃ LIVE PROD

Mảnh đất **thứ tư**, và là khu ĐẦU TIÊN dựng từ MODEL NGOÀI.
Mã: `data/cityisland.js` · `data/garage.js` · `CityIsland.js` · `Garage.js`.

## Số đo chốt

| Thứ | Toạ độ |
|---|---|
| Đảo | x 146…318 · z −56…96 (tâm 232 · 20, **172 × 152 — rộng nhất**) |
| Cầu dây văng | x 84 → 150 tại z = 20 (dài 66 ≈ 132 m). Tháp cao 22 ở x 104 và 130 |
| Đường dọc | x 173,5 · 212,5 · 251,5 · 290,5 |
| Đường ngang | z −38,5 · 0,5 · 39,5 · 78,5 |
| Quảng trường | ô (1,1), tâm 232 · 20, 30 × 30, **để TRỐNG** |
| Tháp cao tầng | 4 ô chéo (0,0) (2,0) (0,2) (2,2) — tâm (193·−19) (271·−19) (193·59) (271·59) |
| Điểm hồi sinh `city` | (154 · 20), yaw π |

`MODEL_SCALE = 0.5` — kit dựng theo MÉT, game 1 đơn vị ≈ 2 m. Kit theo lưới
**2 m ngang × 3 m mỗi tầng**, gờ mái 1 m, `Decal_DoubleYellow_Straight` dài
đúng 6 m = bằng một mảnh `Street_4Lane` nên rải cùng bước là khớp.

## BỐN chỗ đã sụp bẫy

1. **`GLTFLoader` XOÁ HẲN dấu chấm trong tên node.** `Building_Medium_2.001`
   vào scene thành `Building_Medium_2001` ⇒ **11 trong 32 toà nhà lặng lẽ không
   mọc lên, KHÔNG một lỗi nào**. Nay tra qua `CityIsland.piece()` chịu cả hai
   dạng, và bộ kiểm có mục đếm số nhà thực mọc.
2. **File kit là 153 SCENE RỜI**, `GLTFLoader` chỉ nạp scene mặc định ⇒ để
   nguyên thì cả file chỉ ra đúng MỘT toà nhà. Đã gộp về một scene lúc chuẩn bị.
3. **Tháp mọc xuyên qua nhà.** Bản đầu đặt tháp ở góc chéo quảng trường mà vẫn
   để `setBlocks()` rải nhà ở đó ⇒ 3 trong 4 tháp đè nhà. **Bộ kiểm hành lang
   xe KHÔNG bắt được** vì cả hai đều nằm giữa ô, cách xa đường — phải viết riêng
   phép đo chồng lấn mới lộ. Nay bốn ô tháp khai trong `CITY_GRID.towerCells`.
4. **Pháo trên nóc mất khi đổi xe.** `cannon`/`launcher` là con của
   `parts.chassis` chiếc CŨ, mà `Garage.select()` gọi `visualVehicle.destroy()`
   ⇒ nóc trống trơn, bấm X không ra đạn, không lỗi nào. Thêm
   `VehicleRocket.reattach()`.

## Nhà xe (mục "Vehicle" trong Cài đặt)

Nút **SINH RA TỪ `data/garage.js`**, không gõ tay trong `index.html` — thêm xe
mới = đặt `.glb` vào `static/vehicle/` + khai một dòng. Ba xe hiện có:
`default` · `defaultAntenna` · `oldSchool` (đều đã nằm sẵn trong dự án từ trước).

⚠️ `Garage` phải dựng TRONG `world.step(1)` và **tự nối nút lấy** — `Options`
khởi tạo sớm hơn nội dung thế giới. Cùng bài học với `VehicleRocket`.

⚠️ `VisualVehicle` tìm bộ phận theo TÊN NODE (`chassis`, `wheelContainer`,
`blinkerLeft`, `stopLights`…). Xe ngoài không đặt tên theo quy ước đó sẽ dựng
lên nhưng thiếu bánh quay, thiếu đèn — không lỗi, chỉ là xe đứng đờ.

## Model ngoài — quy trình đã chạy thật

```bash
npx gltf-transform optimize IN OUT --compress draco --texture-compress webp \
    --texture-size 1024 --simplify true --simplify-error 0.005
```
Rồi gộp scene bằng script `@gltf-transform/core` (gom `listChildren()` của mọi
scene vào `scenes[0]`, `dispose()` các scene kia).

| | Xe Tiger (Sketchfab, CC BY) | City kit (Quaternius, CC0) |
|---|---|---|
| Gốc | 65 MB | 91,7 MB (153 mảnh) |
| Sau nén | 1,9 MB | **2,4 MB** |
| Đỉnh | **469.000** | **156.869** |
| So cả thế giới (804k đỉnh) | +58% | +19,5% |

⚠️ **Xe Tiger: `simplify` KHÔNG giảm nổi dưới 469k** dù ép `--ratio 0.1` — model
bake từ high-poly, UV cắt vụn nên gần như mọi đỉnh là biên. File nằm ở
`/Users/admin/Downloads/Play Ground/`, **chưa đưa vào dự án**; chốt là chỉ dùng
trong chế độ Sinh tồn, tải theo yêu cầu.

⚠️ Đường dẫn model có KHOẢNG TRẮNG ("Play Ground") làm vỡ lệnh CLI — chép sang
thư mục sạch trước.

`materials.updateObject()` nhận `MeshStandardMaterial` của glTF và **GIỮ NGUYÊN
texture**, chỉ đổi sang hệ TSL ⇒ model ngoài tự ăn đúng ánh sáng, sương mù,
bóng đổ. Không phải viết gì thêm.

**Ghi công**: `static/ATTRIBUTION.txt` mục "Third-party 3D assets" + khối
Credits trong `sources/data/consoleLog.js`. CC BY của Tiger là **BẮT BUỘC**.

---

# 0f. CHẾ ĐỘ LÁI NGƯỜI THỨ NHẤT — làm 1/8, CHƯA DEPLOY

Cài đặt → **Camera → Cockpit**, hoặc phím **C**. Thêm mục **Cockpit look**
ngay dưới: **Locked** (mặc định) · **Free**.
Mã: `World/Cockpit.js` (MỚI) + `View.js` (`MODE_COCKPIT = 3`) + bốn chỗ móc vào
`World.js` · `Garage.js` · `VehicleRocket.js` · `sources/index.html`.

## Phát hiện quyết định: MẤY CHIẾC XE NÀY ĐẶC RUỘT

Đo bằng cách bắn tia từ 121 điểm trong thân `default.glb` ra chín hướng: **mọi
điểm nằm dưới nóc đều lọt trong khối hình**, không có khoang lái nào cả. Model
chỉ có `bodyPainted` · `common` · `headlights` · `stopLights` · `blinker*` ·
`cells*` · `energy` — không ghế, không vô lăng, không táp lô.

⇒ Nên chỗ ngồi là kiểu **kart / buggy mui trần**: mắt ở TRÊN thành xe, còn vô
lăng — táp lô — hai đồng hồ — khung kính đều **dựng bằng mã**, neo vào đỉnh thân.
Đặt mắt thấp hơn cho "giống ngồi trong xe" là hỏng: vỏ xe chỉ vẽ mặt ngoài
(`FrontSide`) nên nhìn từ trong ra là xuyên thẳng qua chính chiếc xe.

## Mọi số đo là TỈ LỆ theo hộp bao thân xe, không gõ cứng

`Cockpit.measureBody()` đo hộp bao rồi đặt mọi thứ theo tỉ lệ, nên thêm xe thứ
tư vào `data/garage.js` là buồng lái tự vừa. Đã kiểm cả ba xe: `oldSchool` thân
3,26 × 1,49 × 1,90 (khác hẳn `default` 2,99 × 1,32 × 1,89) và chỗ ngồi tự dời
từ (−0,20 · 1,22) sang (−0,47 · 1,57).

## SÁU chỗ đã sụp bẫy

1. **Hộp bao thân xe nuốt luôn đồ gắn thêm.** `chassis` không chỉ chứa thân:
   `VisualVehicle` clone 4 bánh vào đó, `VehicleRocket` treo khẩu pháo VÀ bệ
   phóng, và chính buồng lái cũng nằm trong. Đo hết một lượt thì **đỉnh xe vống
   từ 0,72 lên 1,805** và người lái ngồi lơ lửng trên nóc — KHÔNG một lỗi nào.
   Chặn bằng hai lớp cố ý thừa: cờ `userData.vehicleAttachment` trên gốc mỗi
   nhánh gắn thêm, VÀ dựng `Cockpit` **trước** `VehicleRocket` (cả trong
   `World.js` lẫn trong `Garage.select()`).
2. **`Box3.setFromObject()` vô dụng trong `world.step(1)`** — `matrixWorld` còn
   là ma trận đơn vị. Phải nhân chuỗi `matrix` CỤC BỘ đi ngược lên chassis.
   (Cùng bẫy với `FptuDestruction`, mục 0b.)
3. **Dựng "lòng xe" để chống nhìn xuyên vỏ là THỪA và PHẢN TÁC DỤNG.** Vỏ xe
   `FrontSide` vốn đã tự trong suốt khi nhìn từ trong. Mấy tấm `DoubleSide` đắp
   thêm chỉ cách mắt 0,26 nên **bịt kín màn hình** — ảnh chụp ra một khối đen.
4. **Cỡ vô lăng phải tính theo GÓC NHÌN, không theo cỡ xe.** Bán kính 0,29 ở
   cách mắt 0,43 nghe rất hợp lý theo tỉ lệ xe, nhưng nó choán **68°** trong khi
   cả khung hình dọc chỉ 62°. Cùng lý do với trụ A (đẩy ra 0,42 lần bề ngang
   thân mới về được rìa khung) và thanh nóc (cách mắt 0,27 thì thanh dày 0,045
   vẫn thành dải đen 9°).
5. **Đồng hồ quay lưng về phía người lái.** Gắn nhầm mặt táp lô, và
   `rotation.y = +π/2` là nhìn về +X tức RA TRƯỚC — phải **−π/2**. Không lỗi
   nào; đồng hồ vẫn dựng lên, chỉ người đi đường mới đọc được.
6. **`colorNode: textureNode(map)` làm bẩn console.** `MeshDefaultMaterial` kết
   thúc bằng `vec4(outputColor, alphaNode)`; texture node là vec4 nên thành NĂM
   thành phần → "Length of parameters exceeds maximum length of function vec4()".
   Phải `.rgb`. ⚠️ `FptuSigns.painted()` **đang có đúng lỗi này** — chưa lộ vì
   biển hiệu ở đảo xa, chưa bao giờ biên dịch shader trong lúc đo.

## BỐN điều user bác khi thử thật (1/8) — sửa rồi

- *"thấp thấp ngang ngang này rất khó nhìn đường"* → nâng `EYE.alongY`
  **1,15 → 1,38** (mắt cao hơn nóc 0,50) và thêm `View.cockpit.basePitch =
  −0,21` rad (**−12°**) cho máy quay chúc xuống. Mặt đường trải ra giữa khung
  thay vì thành một dải mỏng.
  ⚠️ Nâng mắt xong PHẢI neo nội thất theo **thân xe** (`this.deck`) chứ không
  theo `eye`, không thì táp lô với vô lăng bị nhấc lên lơ lửng theo.
- *"có nút khoá camera lúc lái đi chứ nó cứ lệch cam khi chạm trúng chuột"* →
  `View.cockpit.lookLocked`, **mặc định BẬT**. Khoá thì luôn nhìn theo mũi xe;
  **GIỮ chuột** mới ngoái, thả ra đầu tự về (hằng số thời gian 0,25s).
  Chế độ `Free` giữ nguyên hành vi cũ (ngoái theo vị trí con trỏ).
- *"xoá cái vô lăng và cái khung đen đen kia cho gọn"* → `PARTS` ở đầu
  `Cockpit.js` tắt **vô lăng** và **khung kính** (trụ A + thanh nóc + kính).
  Cả hai là khối tối nằm chắn giữa và trên đỉnh khung hình — dựng thì giống xe
  thật hơn nhưng ngồi lái thì ăn mất phần lớn tầm nhìn. Nay chỉ còn táp lô với
  hai đồng hồ, ghế và cần số (6 mảnh).
  **Mã dựng GIỮ NGUYÊN, không xoá** — bật lại chỉ tốn một chữ `true`. User đã
  đổi ý về máy quay cabin ba lần trong một buổi, đừng vứt mã đi.
  ⚠️ `attach()` phải xoá sạch tham chiếu cũ (`dashboard`, `glass`, `steeringRim`,
  `needles`) trước khi dựng lại, không thì sau khi đổi xe `update()` còn quay
  kim của chiếc xe VỪA BỊ `destroy()` — mesh mồ côi, không lỗi nào.
  ⚠️ `check-cockpit.mjs` BỎ QUA mục vô lăng khi nó tắt, thay vì báo lỗi.
- *"xoá luôn đồng hồ và tay cầm đi kia cho gọn"* → tắt nốt **táp lô**, **hai
  đồng hồ** và **cần số**. `PARTS` giờ chỉ còn `seat: true` — cabin đúng 2 mảnh,
  và ghế thì nằm SAU lưng nên không lọt vào tầm nhìn thẳng.

  **Bài học chung của cả bốn lượt**: mọi thứ dựng thêm trong cabin đều nằm RẤT
  GẦN mắt, nên dù nhỏ đến đâu nó cũng nở to trong khung và ăn mất tầm nhìn.
  "Giống xe thật" và "lái được" ở đây ngược nhau — và user chọn lái được.

  ⚠️ Bộ kiểm ĐỪNG canh bằng ngưỡng cứng "ít nhất N mảnh": con số ấy tụt theo ý
  user chứ không theo lỗi. Nay `Cockpit` phơi ra `this.parts = PARTS` và bộ kiểm
  đối chiếu **bật thì phải dựng, tắt thì phải không dựng**, còn mục "đổi xe" so
  với chính số mảnh trước đó.

## Đáng nhớ về máy quay

- **Đọc vị trí từ `physicalVehicle`, KHÔNG phải `chassis`.** Thứ tự nhịp:
  Player.pre(1) → PhysicsVehicle.pre(2) → Physics(3) → PhysicsVehicle.post(5) →
  Player.post(6) → **View(7)** → VisualVehicle(8). Lúc `View.update()` chạy thì
  `chassis` vẫn giữ vị trí khung TRƯỚC ⇒ bám vào nó là trễ một khung.
- **FOV chỉ đổi trên `this.camera`, đừng động vào `defaultCamera`** —
  `optimalArea.update()` mượn `defaultCamera` để tính vùng nhìn, mà vùng đó định
  bề rộng tấm bóng đổ, `Fog.near/far` và halfExtent mặt nước.
- **Xe hướng +X, máy quay three nhìn −Z** ⇒ `baseYaw = −π/2`. (Quay Y góc θ đưa
  (0,0,−1) thành (−sinθ, 0, −cosθ); θ = −π/2 cho đúng (1,0,0).)
- **Tắt `cheapDOF` khi vào cabin.** Nó không mờ theo chiều sâu mà theo vị trí
  DỌC TRÊN MÀN HÌNH (`uv().y − 0,5`) — một tilt-shift giả cho máy quay treo cao;
  trong cabin nó bôi mờ dải trời và cả táp lô. Đẩy `start` ra ngoài dải là tắt.
  (`cheapDOFPass.strength` mà bản mẫu tween trong `cinematic` **KHÔNG TỒN TẠI**
  trên node — dòng gsap đó xưa nay chạy không.)
- Chốt tự lành NaN cho `smoothedYaw/Pitch/Fov`, cùng lý do với `zoom.smoothedRatio`.
- `VehicleRocket` ở cabin **ngắm vào giữa khung hình** (ndc 0,0) thay vì theo con
  trỏ — không thì rê chuột là mục tiêu chạy hai lần (đầu ngoái + tia đổi).

## Bẫy khi VIẾT BỘ KIỂM cho phần này

- **`player.steering` gán từ ngoài sống chưa hết một khung**:
  `Player.updatePrePhysics()` đặt `this.steering = 0` ở dòng đầu mỗi khung. Bộ
  kiểm bản đầu gán rồi `await` và **báo oan "vô lăng không quay"**. Cách đúng:
  gán rồi gọi thẳng `cockpit.update()` mấy chục lần (JS một luồng, không nhịp
  nào chen vào được). An toàn vì hàm đó không đụng Rapier.
- **Chromium headless bóp `requestAnimationFrame` khi trang không có tương tác**
  ⇒ chờ 1,5 giây có khi chỉ chạy vài khung. Phép kiểm "đầu tự quay về nhìn
  thẳng" đo kiểu đó ra 0,781 và báo oan. Gọi thẳng `view.updateCockpitLook()`
  cho tất định.
- **Chụp ảnh phải chờ `reveal` chạy xong** (`reveal.distance.value > 1000`),
  không thì `MeshDefaultMaterial.revealDiscardNodeBuilder` `discard()` sạch cả
  thế giới lẫn nội thất và ảnh chỉ ra lưới intro. Và **đừng tự gọi
  `reveal.updateStep(1)`** — nút `.js-welcome-play` đã gọi rồi, gọi lần hai thì
  `world.intro` đã null và `hideLabel()` ném lỗi.

---

# 0g. ĐẢO QUÁI VẬT — mảnh đất thứ NĂM, làm 1/8. NỀN XONG, CHƯA CÓ QUÁI

Sân khấu cho chế độ Sinh tồn. `data/monsterisland.js` + `World/MonsterIsland.js`.

| Thứ | Toạ độ |
|---|---|
| Đảo | x −120…120 · z −400…−200 (tâm 0 · −300, **240 × 200 — to nhất, gần gấp đôi thành phố**) |
| Cầu | x = 0, z −84 → −200, **dài 116 ≈ 232 m — dài nhất thế giới này** |
| Đường trục | x = 0, z −204 → −390 · Đường ngang z = −246 và z = −350 |
| Tổ quái | ô Giữa-Tây, tâm −52 · −298 |
| Khu nhà đổ | ô Giữa-Đông, tâm 62 · −292 (mượn lại `city.glb`, nhuộm tro) |
| Bãi hố thiên thạch | ô Bắc-Đông · Bãi phế liệu ô Nam-Đông |
| Điểm hồi sinh `monster` | (0 · −212), yaw −π/2 |

**Vì sao đặt ở phía Bắc**: vùng z < −96 là chỗ DUY NHẤT còn trống ở mọi giá
trị x (đảo chính z ≤ 96 · FPTU z −44…104 · sân chơi z 100…200 · thành phố
z −56…96), mà vẫn chừa được 104 đơn vị mặt nước cho cây cầu.

## NĂM chỗ đã sụp bẫy

1. **Đường xuyên qua công trình — LẦN THỨ HAI.** Đặt tổ quái ở chính giữa đảo
   (0 · −300) cho "dễ tìm" ⇒ đường trục x = 0 chạy **xuyên thẳng qua tổ**; khu
   nhà đổ ở (−74 · −262) ⇒ đường ngang xuyên qua nó. Bộ kiểm hành lang xe bắt
   được 4 + 8 chỗ bị chắn. Y hệt lỗi "đường ngang z = 150 xuyên lòng sân bóng"
   ở đảo sân chơi. ⇒ **Vẽ đường xong thì XẾP ô đất vào giữa các ô lưới**, đừng
   đặt theo cảm giác "chỗ này đẹp".
2. **`camera.far` chỉ 200 và `Fog.far` chỉ ~90.** Chụp ảnh từ xa hơn thế là ra
   một mảng gradient trời trơn, KHÔNG lỗi nào — mất ba lượt chụp mới nhận ra.
   Hệ quả cho THIẾT KẾ: đảo 240 × 200 thì người chơi không bao giờ thấy toàn
   cảnh, nên mỗi khu phải tự đủ hấp dẫn trong bán kính 90.
3. **Fog bám theo CHIẾC XE, không theo máy quay.** Muốn chụp chỗ nào thì phải
   dời xe tới đó trước. Và **đừng dùng `player.respawn()` trong script** — nó
   chỉ dời xe bên trong callback của `overlay.show()`, mà overlay là hoạt ảnh
   gsap không chạy tới nơi trong headless (chờ 3 giây xe vẫn nằm nguyên chỗ cũ).
   Gọi thẳng `physicalVehicle.moveTo()`.
4. **Mảnh thiên thạch giữa hố CÓ va chạm** nhưng ban đầu không kiểm `blocked()`
   ⇒ hố nào đè lòng đường là có một hòn đá chặn xe giữa đường.
5. **Cành cây thò vào lòng đường.** Kiểm `blocked()` cho gốc cây là chưa đủ —
   cành toả ra tới 2,7 đơn vị. Bộ kiểm bắt 9 cái.

## Đáng nhớ

- **Cũ nát chỉ ở phần HÌNH.** Mặt cầu chia 14 đoạn xô lệch, lan can gãy khúc,
  dây văng đứt, một tháp nghiêng — nhưng thân va chạm của mặt cầu là MỘT khối
  liền từ đầu tới cuối. Cầu thủng thật thì đẹp đúng một lần rồi người chơi kẹt
  vĩnh viễn giữa biển.
- **Lưới địa hình 1,7 chứ không 1,1** như ba đảo kia. Đảo này to gần gấp đôi,
  cùng mật độ là 111k tam giác chỉ riêng mặt đất.
- **`place()` + `buildInstances()` cho mọi thứ lặp lại.** Trước khi gộp: 253
  mesh đơn; sau: **62**. Vệt nứt (98 cái), dây văng, cọc và lan can cầu đều đi
  qua đó.
- **`charModel()` nhuộm tro model mượn từ khu phố.** `materials.updateObject()`
  giữ nguyên texture nên nhà "đổ nát" hiện ra TRẮNG TINH như vừa xây. Nhân
  texture với màu tro thay vì bỏ texture — giữ được nét cửa sổ.
- **`onRoad()` tách khỏi `blocked()`**: "có chặn lối xe không" khác với "có
  được rải cảnh quan ở đây không". Gai của tổ quái nằm trong ô đất của chính
  tổ quái là ĐÚNG — dùng `blocked()` cho nó thì bộ kiểm báo oan 25 cái gai.

## Kho asset user tải về — ĐÃ ĐO, đừng đo lại

`/Users/admin/Downloads/Play Ground/` (1,3 GB). Đo bằng
`scratchpad/survey-assets.mjs`. Ngưỡng: quái spawn hàng loạt ≤ 8k đỉnh · nhân
vật/phương tiện 1 bản ≤ 40k · công trình tĩnh ≤ 60k (cả thế giới ~804k đỉnh).

| ✅ Dùng ngay | đỉnh | anim |
|---|---|---|
| `Quái Vật/fatalis.glb` | 4.513 | **14 clip** + rig |
| `Quái Vật/alien_soldier_wip.glb` | 2.788 | 1 + rig |
| `Quái Vật/free_skeleton_man_axe.glb` | 7.973 | 1 + rig |

🟡 1–vài bản: `battlefield_4_huang_hannah` 17,5k (không rig) ·
`flins_rigged_free` 34k (có rig, KHÔNG anim) · `alien_creature_take_3` 28,5k ·
súng 17–35k · `battlefield_pack` 19,4k.

❌ **Không cứu được** (thử `--simplify-error 0.01` rồi `--ratio 0.04 --error 0.08`):
- `super_portaviones` (tàu sân bay) **2.126.216 → 954.719 đỉnh**, vẫn hơn cả
  thế giới. Muốn có tàu sân bay thì **dựng bằng mã**, như đã dựng tổ quái/cầu.
- `ruined_city_free` 711k → 588k (giảm 17%). Dùng `city.glb` sẵn có thay thế —
  đã làm cho khu nhà đổ và ra hình tốt.
- `c-130j` 492k · `tank` 458k · `rigged_female_fashion` 268k ·
  `update_dirt_road_through_forest` 424k.

⚠️ Cùng bệnh xe Tiger: model bake từ high-poly, UV cắt vụn nên gần như mọi đỉnh
là biên, `simplify` không gộp được. **Đo trước khi hứa.**

⚠️ `Con người/alina_ip_realistic_asian_woman_animated.glb` (89 MB) KHÔNG ĐỌC
ĐƯỢC bằng `@gltf-transform` — chưa rõ extension gì.

---

# 0h. TÀU SÂN BAY — dựng BẰNG MÃ, neo giữa biển. Làm 1/8, CHƯA DEPLOY

`data/carrier.js` + `World/Carrier.js`. Neo ở (46 · −140), thân **92 × 24**
(≈184 × 48 m), boong ở y = 3,6. Nối vào cây cầu chính bằng **cầu dẫn** dốc 9°
từ x = 5 lên x = 28,4. Điểm hồi sinh `carrier`, mục bản đồ "Tàu sân bay".

Có: thân mũi vát, boong bay kẻ vạch tim/biên/số hiệu/vòng đỗ trực thăng, đảo
chỉ huy ba tầng có buồng kính + hai ống khói + **radar quay**, bảy máy bay (loại
gập cánh dựng đứng), hai thang máy boong, cần cẩu, 48 đèn mép boong.

⚠️ **Vì sao không dùng model user tải về**: `super_portaviones.glb` **2.126.216
đỉnh** — gấp 2,6 lần TOÀN BỘ thế giới (804k). Nén hết cỡ (`--ratio 0.04
--error 0.08`) vẫn **954.719**. Cùng bệnh xe Tiger. Dựng bằng mã tốn vài nghìn
đỉnh, 172 mesh + 3 instanced.

## BỐN lỗi bộ kiểm bắt ngay lần chạy đầu

1. **Cầu dẫn hụt 0,58 so với mép boong.** Cầu dẫn kết thúc ở x = 34 nhưng mảng
   boong nhô ra mạn trái đã bắt đầu từ x = 28,4 (ở y = 3,6), nên tại chỗ gặp
   nhau cầu mới cao 3,02. Sửa: `toX` = 28,4 cho khớp đúng mép boong.
2. **Máy bay chắn ngang đường băng** — chiếc đặt ở dx = 0,5 (gần tim tàu).
3. **Hai chiếc XOÈ CÁNH chạm rìa hành lang xe**: nửa sải 3,4 cộng góc xoay làm
   chúng thò tới x = 43,4. Lùi ra dx = −8,4. (Chiếc gập cánh hẹp hơn nhiều nên
   để gần được — đó là lý do tàu thật gập cánh khi đậu.)
4. ⚠️ **BỘ KIỂM TỰ BÁO OAN 31 chỗ trên cầu dẫn.** Hộp quét thẳng đứng, mà cầu
   dẫn thì nghiêng: ở mép hộp (cách tâm 0,95) mặt cầu đã cao hơn chỗ bắn tia
   ~0,15, nên hộp **cắt vào chính cái dốc nó đang đứng**. Phải nâng hộp (tham
   số `lift`) trên mọi tuyến dốc. Lại một lần nữa: **kiểm bộ kiểm trước khi tin nó.**

Và: quét hành lang phải men theo **đúng vạch tim đường băng** (x − 1,5, chỗ
`setDeckMarkings()` kẻ vạch), không phải tim tàu — lệch 0,5 là đo một hành lang
không ai đi.

---

# 0i. CHẾ ĐỘ SINH TỒN — bản chơi được đầu tiên, làm 2/8. CHƯA DEPLOY

Cài đặt → **Survival** (Off · On). Bật xong: trời tối, quái ngoài hành tinh sinh
quanh xe theo SÓNG và đi tìm người chơi. Húc bằng xe hoặc bắn bằng pháo trên
nóc. Quái chết ra máu đen, rơi tiền / hộp máu. Hết máu là thua, tự dựng lại từ
sóng 1.

**File**: `data/survival.js` (mọi con số) · `World/SurvivalMonsters.js` (đàn
quái) · `World/Survival.js` (luật chơi + HUD) · `style/survival.styl` ·
khối HUD trong `sources/index.html` · một dòng trong `World.js` và một dòng
trong `VehicleRocket.detonate()`. Bộ kiểm `tools/check-survival.mjs`.

## Ba nhịp một vòng

`preparing` (nghỉ 8s, **TRỜI SÁNG**) → `hunting` (**TRỜI TỐI**, sinh dần cho đủ
số, giết sạch mới qua sóng sau) → `defeated` (5s rồi về sóng 1). Cặp sáng-ngắn /
tối-dài chính là "đêm dài hơn ngày" user muốn, mà lại phục vụ luật chơi: lúc
sáng là lúc nhặt tiền và thở.

## Bảy quyết định đáng nhớ

1. **Quái dựng BẰNG MÃ, không dùng model.** Kho asset CÓ `fatalis.glb` (4.513
   đỉnh + 14 clip anim) dùng được ngay, nhưng nhân bản model có xương là một
   `AnimationMixer` cho MỖI con — 25 con là 25 mixer mỗi khung hình. Cộng thêm
   đúng bài học của `FptuPeople`: ở cỡ nhìn này thứ làm mắt tin là **cử động
   đúng khớp**, không phải số tam giác. `fatalis.glb` để dành cho **quái trùm**
   (một con, một mixer).
2. **Sinh quanh XE, không quanh một cái tổ.** Bật ở đâu chơi được ở đó. Bắt
   người ta lái ba mươi giây tới đảo quái mới được chơi thì lần thứ hai không ai
   bật nữa. Đảo quái vật vẫn là chỗ có không khí nhất, nhưng là *lựa chọn*.
3. **Mắt quái + đồng tiền dùng `MeshBasicNodeMaterial` + `toneMapped = false`.**
   Đêm ở đây tối thật; vật liệu thường thì mắt tắt ngóm và đồng tiền chìm nghỉm.
   Đây là hai thứ duy nhất còn đọc được trong đêm.
4. **Húc gây sát thương theo TỐC ĐỘ VƯỢT NGƯỠNG** (`rammingSpeed = 7`), không
   phải cứ chạm là chết — nếu không thì đứng yên rê xe cũng dọn sạch cả sóng.
5. **Bắn tia bám đất chia 12 LÁT.** Mỗi con chỉ bắn lại ~5 lần/giây và lệch pha
   theo chỉ số, thay vì 26 con × 90 khung/giây.
6. **Chạy trốn là hoãn, không phải thắng.** Con nào bị thu hồi vì xa quá 95 thì
   `onMonsterEscaped()` trả suất đó về hàng chờ. Không có nó thì lái vòng vòng
   là xoá sạch sóng mà không cần giết con nào.
7. **`Survival.setTime()` trả lại `localStorage` sau khi đổi giờ.**
   `dayCycles.preference.set()` ghi thẳng vào `localStorage`; gọi thẳng nó thì
   người chơi bật Sinh tồn rồi đóng tab, lần sau vào thấy trời tối vĩnh viễn mà
   không hiểu vì sao. Chế độ này chỉ MƯỢN bầu trời.

## Bốn bẫy đã sụp

1. **Quái LỘI XUỐNG BIỂN.** Kiểm chỗ khô lúc SINH là chưa đủ — nó sinh trên bãi
   rồi cứ nhắm thẳng hướng xe mà đi, gặp mép nước là lội ra. Nay mỗi lần bắn tia
   bám đất, nếu chỗ đang đứng đã ướt thì kéo về **điểm khô cuối cùng** (`dryX`,
   `dryZ`) và bẻ ngang hướng 90° — nó tự men theo bờ. Bẻ ngang chứ đừng quay đầu
   hẳn: quay đầu thì nó chạy ra xa rồi lại vòng vào đúng chỗ cũ.
2. **Nhịp nhún của bước chân và phép nội suy cao độ nền tranh nhau `position.y`**
   ⇒ nội suy ăn mất nửa cái nhún, dáng đi đờ ra. Giữ cao độ nền riêng trong
   `smoothY`, `animate()` mới cộng nhịp nhún lên trên.
3. **Cả đàn CHỒNG KHÍT lên nhau thành một con** — tất cả cùng chạy về một điểm.
   `separationFor()` chỉ so với **4 con lấy cách quãng trong danh sách**, không
   so từng cặp (325 phép đo mỗi khung hình mà mắt không thấy khác gì).
4. **HUD ghi `textContent` mỗi khung hình** = ép trình duyệt tính lại bố cục 90
   lần/giây cho thứ mắt không theo kịp. `updateHud()` chỉ chạm DOM khi số ĐỔI.
   Loại rò rỉ này không bao giờ hiện ra trong hồ sơ WebGL vì nó nằm ở phía CSS.

## ⚠️ BỘ KIỂM TỰ BÁO OAN HAI LẦN trước khi tin được (lần thứ năm rồi)

Cả hai đều ở **phép đo thời gian**, không ở luật chơi:

1. Đo `ticker.elapsed` rồi gọi nó là "số nhịp". `Ticker` **KHÔNG có trường đếm
   khung hình**. Bộ kiểm tự tuyên bố "MÔI TRƯỜNG HỎNG" trong khi game chạy ngon.
2. Đếm nhịp thật ra ~5 nhịp/giây, trông y hệt "headless bóp rAF". **KHÔNG PHẢI**
   — cảnh này quá nặng, headless chỉ dựng được chừng đó. Khung nhìn 1280×720 →
   **480×320** là bộ kiểm nhanh gấp mấy lần.

Điều thật sự quan trọng: **`Ticker.delta` bị chặn ở `maxDelta = 1/30`, còn
`ticker.elapsed` là thời gian THẬT.** Chờ "3 giây" theo đồng hồ treo tường chỉ
cho logic chạy được nửa giây của nó ⇒ mọi phép đo về chuyển động báo oan. Bộ
kiểm nay cộng dồn chính `ticker.delta` và chờ theo con số đó (`run(giây game)`).

## Ba thứ thêm cùng ngày 2/8

### SÚNG MÁY — `World/SurvivalGun.js`, giữ phím **F**

Vũ khí CƠ BẢN của chế độ. 9 phát/giây, sát thương 1, tầm 34, nòng nóng dần và
kịch kim thì kẹt (23 phát liên tục; có "Tản nhiệt" 3 cấp thì 53). Thanh **Nòng**
trên HUD, kẹt thì thanh đỏ và nhấp nháy. Pháo tên lửa (X) vẫn nguyên — nó mạnh
hơn nhiều nhưng bắn từng phát, đạn bay vòng mấy giây mới tới; bị cả đàn vây thì
thứ cần là một dòng đạn liên tục.

**Đạn tính bằng HÌNH HỌC, không dựng vật thể đạn.** Ở nhịp này mắt không đọc
đường đạn nữa, chỉ đọc vệt sáng và cái chết ở đầu kia. Mỗi phát chiếu từng con
quái lên trục nòng (`along = to · dir`), loại `along < 0` (nếu không thì bắn về
trước cũng giết con sau lưng — bộ kiểm canh đúng chuyện này), rồi lấy con GẦN
NHẤT trên đường đạn.

⚠️ **Nòng phải LỆCH SANG PHẢI** (`muzzleSide: 0.62`). Đặt giữa trục nhìn thì
trong cabin chớp nòng nằm cách mắt chưa tới một mét và **nở ra choán gần nửa
khung hình** — lại đúng bài học của `Cockpit.js`. Chỉ ảnh mới nói ra.

### ⚠️⚠️ VỆT ĐẠN "KHÔNG HIỆN" — ba lần chụp mới truy ra, và mã KHÔNG hề sai

Chuỗi chẩn đoán này đáng chép lại nguyên vẹn:

1. Chụp ở cabin: không thấy gì. Đoán là vệt nằm thấp → nâng nòng ngang tầm mắt.
2. Vẫn không thấy. Đoán là quá mảnh → tăng bề dày gấp đôi. Vẫn không thấy.
3. **Thôi đoán, chiếu toạ độ lên NDC**: `tracerNdc.y = 1,04` ⇒ **ngoài mép trên
   khung hình**. Vệt dài 34 đơn vị nên TÂM của nó nằm cách xe 17 về phía trước,
   mà máy quay FOV chỉ **25°**. Thêm `tracerMaxLength: 11` — vệt chỉ cần đủ dài
   để đọc ra "có tia phóng đi", không cần chạy hết tầm.
4. NDC vào khung (0,42) nhưng ảnh vẫn trống. Lần này vì **khung thông báo che
   đúng chỗ đó** — xoá `.notification` trước khi chụp.
5. Vẫn trống. So với một con quái đang hiện rõ: quái ở NDC `(0 · 0,42 · 0,9973)`
   cách 53,6; vệt ở `(0,04 · 0,38 · 0,9969)` cách 48,7 — **cùng vùng màn hình,
   cùng độ sâu**. Không bị cắt, không sai vật liệu. ⇒ Vệt chỉ **sống 0,09 giây
   game**, mà headless render ~5 fps và `page.screenshot` chờ vài khung, nên đến
   lúc bấm máy thì nó tắt từ lâu. Bắn liên tục bằng `setInterval` trong trang là
   thấy ngay.

**Bài học**: khi ảnh và số liệu mâu thuẫn, đừng sửa mã theo phỏng đoán — **chiếu
toạ độ lên NDC và so với một vật thể mình BIẾT là đang hiện**. Hai lần "sửa" ở
bước 1–2 là sửa đúng chỗ không hỏng.

### XUỐNG XE ĐI BỘ — `World/SurvivalWalker.js`, phím **E**

Phần "sau" của lời hứa *"xe trước, đi bộ sau"*. Bấm **E** khi xe đang đứng
(dưới 3 đơn vị/giây) để bước xuống; **W A S D** đi, **Shift** chạy, **F** vẫn
bắn, **E** lên lại khi đứng trong 3,2 đơn vị, **R** là lối thoát khẩn về thẳng
chỗ xe. Đi bộ ăn đòn nặng hơn **60%** (không còn vỏ thép) và không húc được ai,
bù lại **nấp giỏi hơn hẳn**: tầm phát hiện chỉ còn 62% vì không đèn pha, không
tiếng động cơ, thân người nhỏ (đo được 17 → **10,5**).

**Ba chỗ móc vào bản mẫu, không sửa một dòng nào của nó:**

1. **`inputs.filters`** — đúng cơ chế bản mẫu dùng để chuyển giữa lái xe và đua
   (xem `CircuitArea`). Xuống xe thì `filters` chỉ còn `'walking'` nên mọi phím
   lái bị nuốt và chiếc xe đứng im dù người chơi bấm W. **Thiếu bước này thì xe
   bỏ chạy một mình trong lúc chủ đang đi bộ** — bộ kiểm canh đúng chuyện đó.
2. **`view.focusPoint.trackedPosition`** — `Player` ghi vị trí xe vào đó ở nhịp
   6, `View` đọc ở nhịp 7. Ghi đè ở **nhịp 6.5** là máy quay bám người mà không
   phải sửa `View`. Sớm hơn thì `Player` ghi đè lại, muộn hơn thì trễ một khung.
3. **`Survival.target`** — đàn quái vốn nhận mục tiêu qua tham số, nên chuyển
   sang đuổi người chỉ là trỏ vào véc-tơ khác. Một dòng.

⚠️ **`walker.reset()` PHẢI gọi trong `disable()`**: tắt chế độ Sinh tồn trong
lúc đang đi bộ mà không trả `filters` về `'wandering'` thì người chơi **kẹt
vĩnh viễn** — xe không nhúc nhích và không có phím nào cứu được.

⚠️ **Kiểm độ dốc trước khi bước** (`maxSlope: 1.15`). Không có nó thì người đi
bộ trèo thẳng lên vách núi và tường nhà: bắn tia xuống lúc nào cũng tìm được
mặt đất ở đó, dù nó cao hơn đầu.

⚠️ **Đi theo hướng MÁY QUAY, không theo hướng thân.** Bấm W là đi "lên phía trên
màn hình" — đi theo hướng thân thì mỗi lần quay người là cả bộ phím đảo nghĩa.

Cố ý KHÔNG dùng `KinematicCharacterController` của Rapier: nó giải quyết trượt
tường / bậc thang / dốc, những thứ thế giới này gần như không có (mặt đất là MỘT
hàm cao độ liên tục, nhà là hộp bao). Bắn tia xuống + một phép kiểm dốc là đủ,
và không phải kéo thêm một hệ vật lý thứ hai vào vòng lặp.

### TRỰC THĂNG — `World/SurvivalHeli.js`, mua trong cửa hàng 220$

Mảnh cuối của kế hoạch user chốt hôm 1/8 ("có vũ khí và trực thăng"). Mua
**"Trực thăng"** ở cửa hàng → nó bay từ cách 60 đơn vị tới, hạ xuống cạnh người
chơi → bấm **E** để lên → **W A S D** bay, **Space** lên, **Shift** xuống,
**F** bắn, **E** hạ cánh. Nhiên liệu **70 giây**, hết thì tự hạ và bay đi. Mỗi
lần gọi lại đắt thêm 50%.

Bốn trạng thái: `idle` → `arriving` → `landed` → `flying`.

**Vì sao nó đáng 220$**: trên trời thì **không con nào với tới** và súng mạnh
**2,2 lần**, nòng nguội nhanh hơn. Đổi lại là đồng hồ dầu đang chạy.

⚠️ **Phép "tới nơi" của đàn quái đo bằng `hypot(x, z)` — CHỈ mặt phẳng ngang.**
Thiếu nhánh chặn trong `onMonsterReach` thì bay cao mấy vẫn bị cắn, vì với
chúng người chơi vẫn "ở ngay đây". Bộ kiểm canh đúng chuyện đó (thả một con
ngay dưới bụng rồi ép nó tới nơi, máu phải không đổi).

⚠️ **Phím E làm BA việc theo thứ tự ưu tiên**: trực thăng đậu gần → lên trực
thăng · đang đi bộ → lên xe · đang ngồi xe → xuống. Trực thăng phải đứng TRƯỚC:
nó hay đậu ngay cạnh xe, mà gọi về tốn 220$.

⚠️ **`heli.reset()` phải gọi TRƯỚC `walker.reset()`** trong `disable()` —
`walker` không biết mình đang bay, gọi sau là `filters` kẹt ở `'heli'`.

⚠️ Món "Trực thăng" là món DUY NHẤT trong `SURVIVAL_SHOP` không phải nâng cấp
mà là **hành động** (`action: 'heli'`). `priceOf()`, `canBuy()`, `buy()` và
`renderShop()` đều có nhánh riêng — thiếu một chỗ là giá hiện sai hoặc mua rồi
mà chẳng có gì tới.

### ⚠️⚠️ TRẦN BAY 8,5 — lại đúng cái bẫy FOV 25° đã làm vệt đạn tàng hình

Bản đầu đặt trần **34**, và người chơi **không nhìn thấy chính chiếc trực thăng
mình đang lái**: HUD báo "Bay 70s" mà khung hình trống trơn. Lần này KHÔNG đoán
— chiếu thẳng lên NDC ở từng độ cao:

| cao | ndc.y | | cao | ndc.y |
|---|---|---|---|---|
| 3 | 0,34 ✓ | | 12 | 1,20 ✗ |
| 5 | 0,52 ✓ | | 16 | 1,64 ✗ |
| 7 | 0,70 ✓ | | 22 | 2,42 ✗ |
| 9 | 0,89 ✓ | | 34 | 4,50 ✗ |

Máy quay bám nhân vật đứng ở cao **27,7**, FOV **25°**, và luôn ngắm xuống MẶT
ĐẤT (`focusPoint` chỉ nhận x/z, y luôn 0). Nên mọi thứ bay cao đều trôi lên mép
trên khung. Trần 8,5 vẫn cao hơn con trùm (6,2) nên "bay lên là thoát" vẫn đúng.

**Đây là lần thứ HAI cùng một nguyên nhân** (lần đầu: vệt đạn). Bất cứ thứ gì
đặt cao hơn mặt đất vài đơn vị đều phải chiếu NDC kiểm tra trước.

### CỬA HÀNG — chỉ mở trong nhịp NGHỈ

`SURVIVAL_SHOP` khai năm món (giáp · hồi máu · cản húc · đầu đạn · vá máu), mã
tự sinh nút — **đừng gõ `<button>` vào `index.html`**. Phím 1–5 đi qua đúng hệ
`inputs.actions` như `fireRocket`. Giá nhân `step` mỗi lần mua, nên tới cấp ba
là phải CHỌN giữa giáp và đầu đạn chứ không mua được cả hai.

⚠️ Nâng cấp "Đầu đạn" nhân vào `Survival.damageAround()`, **không** vào
`VehicleRocket`: khẩu pháo dùng chung với chế độ thường, không được mạnh lên chỉ
vì người chơi đã mua gì đó trong một ván Sinh tồn.

⚠️ **Bẫy thứ tự khởi tạo**: getter `maxHealth` đọc `this.upgrades` qua `level()`,
nên `this.upgrades = {}` PHẢI đứng trước `this.health = this.maxHealth` trong hàm
dựng. Gán sau là `undefined['armor']` ném lỗi ngay trong hàm dựng — và một lỗi ở
đó thì `World.step(1)` chết đứng từ đấy trở đi mà màn hình không báo gì.

### NẤP — `Survival.sightRange()` + `SurvivalMonsters.updateSight()`

Tầm phát hiện = 17 gốc, **×1,9 nếu đèn pha đang bật**, **+1,15 mỗi đơn vị tốc
độ**. Ngoài tầm thì quái chỉ biết chỗ THẤY LẦN CUỐI: kéo tới đó rồi lục lọi
quanh quẩn. Mắt **nheo lại còn 45%** khi mất dấu và dòng trạng thái đổi thành
"Đang nấp" — một cơ chế không đọc được thì coi như không tồn tại.

⚠️ Đọc `lighting.headlights.shouldBeOn()` chứ ĐỪNG đọc `mode`: ở `auto` đèn tự
bật khi trời tối, mà chế độ này gần như lúc nào cũng tối — đọc `mode` thì "auto"
bị tính là tắt và nấp trở nên quá dễ.

### ⛔ BẾ TẮC LẶNG LẼ mà chính số đo của bộ kiểm mới để lộ

Quái sinh trên vành **26–46** đơn vị, mà tầm phát hiện chỉ **17** khi tắt đèn ⇒
**phần lớn số con sinh ra đã ở ngoài tầm**, chưa từng thấy xe lần nào, nên chúng
lấy chỗ đang đứng làm mốc và lảng vảng tại chỗ **vĩnh viễn**. Sóng không bao giờ
hết, người chơi ngồi đợi, **không một dòng lỗi nào**.

Sửa: `spawn()` truyền chỗ xe vào làm "chỗ thấy lần cuối" — chúng kéo về phía đó,
vào tầm là bám thật; người chơi đã bỏ đi và tắt đèn thì chúng mò quanh chỗ cũ.
Nay có mục **3b** trong bộ kiểm canh đúng chuyện này, ở kịch bản xấu nhất (đèn
TẮT): đo được 4/4 con sinh ngoài tầm vẫn tiến 39,0 → 35,0 sau 2,5 giây game.

**Bài học chung**: bộ kiểm 0 lỗi mà SỐ ĐO của nó trông lạ thì phải đọc kỹ con
số, đừng chỉ nhìn dòng "✅". Mục 3 báo khoảng cách chỉ giảm 34,6 → 31,9 (lần
trước 26,8 → 16,1) — vẫn "pass", nhưng chính chỗ chênh đó là cái bế tắc.

### QUÁI TRÙM — mỗi `SURVIVAL_WAVES.bossEvery = 5` sóng, DÙNG MODEL THẬT

`static/monsters/boss.glb` — model có xương (78 khớp, 5 lưới) + 1 clip, nạp qua
`resources.bossModel`, dựng trong `SurvivalMonsters.makeBossModel()`. Máu 130,
**không nấp khỏi nó được** (`bossAlwaysSees`), thanh máu riêng, chết rơi sáu
đồng rải quanh xác. Không nạp được model thì tự lùi về dáng "quái to xác" dựng
bằng mã — chơi vẫn được, chỉ kém hoành tráng.

**Chỉ TRÙM mới dùng model, đàn quái thường vẫn dựng bằng mã.** Model có xương
phải `SkeletonUtils.clone` (clone thường dùng CHUNG bộ xương — mọi bản sao cử
động y hệt và dính cứng vào nhau) và mỗi con là một `AnimationMixer` cập nhật 78
khớp mỗi khung hình. Một con thì rẻ, hai mươi lăm con thì không.

⚠️ **PHẢI CHIA cho `spec.scale` khi co model**: `add()` còn nhân cả nhóm gốc lên
`spec.scale` lần nữa. Co thẳng về `modelHeight` là con trùm ra cao 9,2 thay vì
3,4 — thò đầu qua mái nhà, không một lỗi nào. Bộ kiểm nay đo chiều cao THẬT
trong cảnh và so với `modelHeight`.

⚠️ `frustumCulled = false` cho mọi lưới của model: bộ cắt theo hộp bao tính trên
tư thế NGHỈ, con quái vung tay ra ngoài hộp đó là biến mất từng mảng giữa lúc
đánh nhau.

⚠️ **KHÔNG `--simplify` khi nén model có xương** — giản lược lưới phá trọng số
skin và con quái méo mó khi cử động. 28.550 đỉnh cho MỘT con là chấp nhận được.

### ⚠️ MODEL "ĐÚNG SỐ ĐO" VẪN CÓ THỂ XẤU — chỉ ẢNH mới nói ra

Đặt `modelHeight: 3.4` (ngang tầm hai con quái to xác) thì **bộ kiểm báo 0 lỗi,
chiều cao đo được 3,45 — đúng y yêu cầu** — nhưng ảnh chụp cho ra **một cái que
đen** cạnh chiếc xe. Lý do đo được sau đó: model này có tỉ lệ **rộng/cao = 0,35
ngay ở bản gốc** (rộng 1,20 · cao 3,47), tức nó vốn là sinh vật gầy và dài.

Sửa bằng cách cho nó cao **6,2** — gấp đôi. Chính cái gầy ấy thành ưu điểm: nó
vượt hẳn lên trên tầm mắt, đổ bóng dài, đọc ra ngay là "thứ không nên lại gần".

**Bài học**: số đo trả lời được "có đúng kích thước không", KHÔNG trả lời được
"nhìn có ra gì không". Với bất cứ model ngoài nào, **phải chụp ảnh mới biết** —
và chụp ở cả camera bám xe (ban ngày, sau khi thông báo đã tắt) chứ không chỉ
trong cabin.

⚠️ **ĐỪNG ĐOÁN hướng nhìn của cabin để đặt vật thể vào khung.** Hai lần chụp
liền đặt quái ở "+X" theo suy luận từ `baseYaw = −π/2` và cả hai lần khung hình
trống trơn, trong khi số liệu chứng minh quái vẫn ở đó. Đọc thẳng
`view.camera.getWorldDirection(v3)` rồi đặt dọc theo hướng đó (đo được hướng
thật là `0,97 · 0,23`).

⚠️ Sinh khi `toSpawn <= 2` chứ không phải đầu sóng: vào sóng mà thấy nó lù lù
trước mặt thì chỉ có chạy, để nó tới lúc đang bận đánh nhau mới là bất ngờ.
⚠️ Thanh máu đặt `top: 132px`, DƯỚI vùng thông báo — đúng lúc trùm xuất hiện
cũng là lúc thông báo "Sóng N — QUÁI TRÙM" đang hiện, đặt ngang nhau là chồng khít.

## Số đo bản đầu (đo 2/8, 0 lỗi)

Quái đuổi thật (khoảng cách trung bình 27,9 → 21,7 sau 3 giây game, xe đứng
yên) · cặp gần nhau nhất 2,50 (không chồng) · giết được bằng cả húc lẫn nổ vùng
· 57 giọt máu + 3 vũng cho 3 con · nhặt tiền chạy · HUD và thanh máu đúng · thua
dọn sạch · tắt chế độ trả cảnh về nguyên trạng (0 quái, 0 mesh mồ côi, giờ về
`auto`).

---

# 0j. SÂN KHẤU NHẠC HỘI — khu thứ nhất trong ba ô đất chừa sẵn, làm 2/8

`data/playisland.js` (`CONCERT` + `CONCERT_COLORS`) + `World/PlayConcert.js`.
Nằm gọn trong `PLOTS.concert` (tâm 34 · 150, rộng 38 × sâu 34). Điểm hồi sinh
`concert` (34 · 165), mục bản đồ "Nhạc hội". Bộ kiểm `check-concert.mjs`.

Có: sân khấu 22 × 9 **lái xe lên được** (có dốc ở mặt trước) · phông nền 5 vệt
sáng · **sàn nhảy 9 × 7 = 63 ô nhấp theo NHẠC THẬT** · hai cột loa 4 màng ·
giàn đèn 6 chùm quét · khán đài 3 bậc hai bên · **5 bục đĩa than đổi bài**.

## Sàn nhảy nghe nhạc THẬT, không nhấp theo đồng hồ

`AnalyserNode` (fft 256) cắm vào `Howler.masterGain`; ô sàn nâng theo **dải
trầm** (bin 1–8 ≈ 40–350 Hz, tức kick/bass), đèn sáng theo **dải cao** (bin
30–70). Lên NHANH xuống CHẬM — đó là thứ biến một con số thành "cú đập".

⚠️ **`Howler.ctx` chỉ tồn tại SAU khi bấm Play ở màn chào** (trình duyệt chặn
âm thanh tự phát). `ensureAnalyser()` phải thử lại **mỗi khung hình** cho tới
khi được; cắm một lần trong hàm dựng là sàn đứng im vĩnh viễn, không lỗi nào.

⚠️ `masterGain → analyser` là **NHÁNH SONG SONG**. Đừng nối `analyser →
destination`, nối là âm thanh đi hai đường và nghe to gấp đôi.

⚠️ Không có nhạc (tắt tiếng / chưa bấm Play) thì rơi về nhịp giả theo đồng hồ —
sàn đứng chết trông như khu bỏ hoang.

## Bục đĩa than — `playlist.goTo(index)`

⚠️ Hàm ĐÚNG là `goTo(index)`. `playlist.play()` không nhận tham số (phát lại bài
hiện tại), `next()`/`previous()` thì nhảy tương đối — bục số 3 gọi `next()` ra
bài nào tuỳ lúc đó đang ở đâu.

⚠️ Nhớ bục VỪA CHẠM (`lastDeck`): không có nó thì đứng yên trên bục là gọi đổi
bài mỗi khung hình, nhạc kêu tạch tạch rồi im. Rời khỏi mọi bục mới xoá nhớ.

⚠️ Bục và ô sàn **KHÔNG có va chạm**. Cho chúng va chạm là xe leo lên mắc kẹt,
và khi ô sàn nhấp lên thì xe bị hất tung — vui đúng một lần rồi thành phiền.

## ⛔ LẦN THỨ BA dẫm đúng bẫy "công trình nằm trong lòng đường"

Khán đài đặt ở `z = 152` dài 18 (trải **143…161**) trong khi đường ngang
`z = 150` có `halfWidth 4.5` — tức chiếm dải **145,5…154,5** và chạy từ x = −4
tới x = 56, xuyên qua toàn bộ khu. `check-play-island` bắt được **6 khối chặn
hành lang xe**. Nay khán đài ở `z = 161` dài 11 (155,5…166,5).

**Và bộ kiểm MỚI của khu này báo 0 lỗi trong lúc đó** — vì nó chỉ canh sân khấu
với sàn nhảy, không canh khán đài. Bài học kép:
1. Dựng bất cứ thứ gì trên đảo thì **đối chiếu `PLAY_ROADS` TRƯỚC**, đừng đợi
   bộ kiểm. Đây là lần thứ ba (trước: đường xuyên lòng sân bóng, đường trục
   xuyên tổ quái).
2. **Một bộ kiểm chỉ canh những gì mình nhớ ra lúc viết.** Luôn chạy CẢ bộ kiểm
   cũ của khu vực — `check-play-island` mới là thứ cứu vụ này.

⚠️ **`player.respawn()` KHÔNG dùng được trong script chụp ảnh** — nó chỉ dời xe
bên trong callback của `overlay.show()`, ảnh chụp ra vẫn ở chỗ cũ. Dùng máy quay
tự do: `view.setMode(2)` + `view.freeMode.setTarget(x, y, z)` + `setPosition()`.

⚠️ **`map.locations` chưa tồn tại cho tới khi mở bản đồ lần đầu** (`Map.init()`
chạy lười). Bộ kiểm đọc thẳng `map.locations.items` báo oan "chưa thêm mục" —
gọi `map.init()` trước.

---

# 1. MƯỜI BỘ KIỂM — CHẠY TRƯỚC KHI TIN BẤT CỨ THỨ GÌ

Cần dev server sống: `cd playground-3d && npm run dev` (xem mục 4).

```bash
node tools/check-fptu-layout.mjs                                  # công trình đè nhau, đường bị chắn, thò ra biển
URL=http://localhost:5174/ node tools/check-ghost-colliders.mjs    # VA CHẠM MỒ CÔI + MẶT TRANH NHAU CHIỀU SÂU
PLAY_URL=http://localhost:5174 node tools/check-play-island.mjs    # đảo sân chơi: 9 mục, có QUÉT HÀNH LANG XE
PLAY_URL=http://localhost:5174 node tools/check-arena-rules.mjs    # luật chơi sân bóng: 9 mục
PLAY_URL=http://localhost:5174 node tools/check-city-island.mjs    # đảo thành phố: nhà chắn đường, bậc cầu, SỐ NHÀ THỰC MỌC
PLAY_URL=http://localhost:5174 node tools/check-cockpit.mjs        # buồng lái: 11 mục, xem mục 0f
PLAY_URL=http://localhost:5174 node tools/check-monster-island.mjs # đảo quái: 8 mục, có QUÉT HÀNH LANG XE
PLAY_URL=http://localhost:5174 node tools/check-carrier.mjs        # tàu sân bay: 7 mục, quét cầu dẫn + đường băng
PLAY_URL=http://localhost:5174 node tools/check-survival.mjs       # chế độ Sinh tồn: 23 mục, xem mục 0i
PLAY_URL=http://localhost:5174 node tools/check-concert.mjs        # sân khấu nhạc hội: 7 mục, xem mục 0j
```

⏱️ `check-survival.mjs` chạy **3–4 phút** và đó là bình thường: nó chờ theo
ĐỒNG HỒ CỦA GAME, mà headless dựng cảnh này chỉ được ~0,05× thời gian thực.
Đừng chạy nó song song với bộ kiểm khác — 2/8 chạy chung tám bộ một lượt thì
`check-cockpit` hết giờ ngay ở nút Play, chạy lại một mình là 0 lỗi.

⚠️ **Vite NHẢY CỔNG** khi 5173 bận (rất hay gặp: phiên Claude khác cũng mở dev
server trong đúng thư mục này — 1/8 nó chiếm 5173, mình phải chạy ở 5174). Đọc
cổng THẬT ở `preview_logs` rồi truyền vào, không thì bộ kiểm chỉ báo
`ERR_CONNECTION_REFUSED`. `check-ghost-colliders.mjs` dùng biến `URL=`, năm bộ
còn lại dùng `PLAY_URL=` (`check-city-island.mjs` mới được sửa cho nhận biến,
trước đó gõ cứng 5173). `check-fptu-layout.mjs` vẫn gõ cứng 5173.

⚠️ **`preview_start` báo một cổng nhưng Vite chạy ở cổng khác**, và Browser pane
KHÔNG tới được cổng lạ đó. Cách vào được: `preview_start({url: 'http://localhost:<cổng thật>'})`.
Nhưng **Browser pane không chạy vòng lặp game** (đo 1/8: `ticker.elapsed` đứng
im dù đã `tabs_select`) ⇒ chụp ảnh bằng Playwright headless, đừng bằng pane.

**Cả tám hiện 0 lỗi.**

`check-play-island.mjs` có mục **quét hành lang xe**: đẩy một khối hộp bằng đúng
kích cỡ xe (rộng 1,9 · cao 1,4) dọc từng tuyến đường bằng
`world.intersectionsWithShape`. Nó bắt được cả vật đứng NGOÀI lòng đường mà thân
thò vào — thứ mà phép kiểm "tâm collider nằm trong lòng đường" bỏ sót, và cũng
đúng kiểu lỗi đã bốn lần chặn lối xe ở khu FPTU. **Đây là thứ thay cho lái thử**
(xem mục 3 để biết vì sao không lái được).

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

## Vào game (khuôn ĐÃ CẬP NHẬT 1/8 — khuôn cũ đã lỗi thời)

```js
await page.goto(`${BASE}/#skip`, { waitUntil: 'load' })
await page.waitForFunction(() => window.game?.world?.playIsland?.arena)   // hoặc mốc khác
await page.evaluate(() => document.querySelector('.js-welcome-play')?.click())
await page.waitForTimeout(2500)
// giờ `reveal.step` = 1 và `inputs.filters` có 'wandering'
```

- ⚠️ **`#skip` KHÔNG bỏ qua màn chào**, nó chỉ bỏ bước click-vào-xe của `Reveal`.
  **Phải bấm `.js-welcome-play`.** Chưa bấm thì `inputs.filters` chưa có
  `'wandering'`, mọi phím lái bị nuốt.
- `world.intro` nay chỉ có `{ game, center, circle, label, update }` — **không còn
  `text`, `soundButton`, `destroy`**. Mọi khuôn cũ chờ `intro.text.mesh` sẽ treo
  vĩnh viễn, và `reveal.updateStep(2)` ném `Cannot read properties of undefined`.
- Ép ban ngày/đêm: `game.dayCycles.preference.set('day'|'night', 0)`.

## ⛔ LÁI TỰ ĐỘNG KHÔNG CHẠY ĐƯỢC TRONG HEADLESS — đừng mất buổi nữa

Đo ngày 1/8: xe **không nhúc nhích ở BẤT KỲ ĐÂU** trong headless chromium — kể
cả điểm landing (0 · 0) của bản mẫu và giữa sân trường FPTU, tức những chỗ chắc
chắn lái được trong game thật. Ca đối chứng đi đúng **0,0 đơn vị**.

Nguyên nhân, truy tận gốc:

1. `PhysicsVehicle.updatePostPhysics()` tính `this.speed` từ **TOÀN BỘ** vector
   dịch chuyển giữa hai khung hình, **kể cả thành phần Y**, rồi
   `goingForward = direction · forward > 0.5`.
2. Xe ở headless **nhún giảm xóc không bao giờ tắt** — đo được `linvel.y` đứng ở
   −1,15 sau nhiều giây. Nên `direction` gần như thẳng đứng ⇒ `forwardRatio ≈ 0`
   ⇒ `goingForward = false`.
3. Trong `updatePrePhysics()`, nhánh "đang lùi mà đạp ga" khớp
   (`speed > 0.5 && accelerating > 0 && !goingForward`) ⇒ **`engineForce = 0` và
   phanh gấp, vĩnh viễn**. Đo được `engineForce` = 0 ở cả bốn bánh dù
   `player.accelerating` = 1 và cả bốn bánh đều `wheelIsInContact` = true.

⇒ **Dùng phép quét hành lang xe trong `check-play-island.mjs` thay cho lái thử.**
Nó tất định, nhanh, và bắt được đúng loại lỗi mà lái thử dùng để bắt.

Hai ghi chú phụ, đều **bác bỏ bàn giao cũ**:
- Bàn giao cũ ghi *"vòng lặp game ở đó chạy ~1 nhịp/giây"* — **SAI**. Đo được
  **630% tốc độ thực** (5 giây thực = 31,5 giây game): không render nên rAF chạy
  tự do. Chính tốc độ đó làm giảm xóc dao động mãi không tắt.
- Gọi thẳng `physicalVehicle.moveTo()` **không** gây lỗi Rapier như lo ngại,
  nhưng cũng vô ích vì xe vẫn không chạy.

Nếu vẫn muốn lái thật: phải chạy trong trình duyệt CÓ WebGPU và tab đang HIỆN.
Khung xem (Browser pane) đóng băng khi bị ẩn, và mất WebGPU context sau vài lần
tải lại (mọi ảnh chụp sau đó đen kịt hoặc đứng ở khung cũ) — cũng không dùng được.

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
  data/playisland.js            ← MỌI SỐ LIỆU BỐ CỤC đảo sân chơi + LÝ DO
  data/musics.js                ← danh sách nhạc (nay 12 bài Beat 1–5, 7–13)
  Game/World/
    FptuCampus.js               ← nền đảo, đường, Alpha, nhà, hồ · heightPatch · canopy
    FptuProps.js                ← đồ đạc + `blocked()` (VÙNG CẤM ĐẶT ĐỒ)
    FptuPeople.js               ← người có khớp, biết đứng/ngồi/đi
    FptuLights.js               ← 103 đèn lồng mẫu + vệt sáng ban đêm
    FptuSigns.js                ← biển xếp hạng THE, biển đá cổng, bệ chữ (canvas)
    FptuPineHill.js             ← đồi thông + tượng Self Made Man
    FptuSwans.js · FptuQuiz.js  ← thiên nga · hộp thoại cổng + câu hỏi theo kỳ
    VehicleRocket.js            ← pháo tên lửa trên nóc xe
    PlayIsland.js               ← MỚI: đảo sân chơi (nền, cầu, đường, cảnh quan)
    FootballArena.js            ← MỚI: sân bóng đá lái xe + sân tập kỹ năng
  Game/Options.js               ← nút trong bảng Cài đặt
  index.html                    ← màn chào, bảng Cài đặt, hộp thoại cổng
  style/general.styl            ← `.segmented`, `.fptu-gate-mute`
    Cockpit.js                  ← MỚI: nội thất buồng lái (người thứ nhất)
    Garage.js                   ← nhà xe, sinh nút đổi xe từ `data/garage.js`
    CityIsland.js               ← đảo thành phố dựng từ city kit
playground-3d/tools/
  check-fptu-layout.mjs · check-ghost-colliders.mjs
  check-play-island.mjs · check-arena-rules.mjs
  check-city-island.mjs · check-cockpit.mjs · check-monster-island.mjs
  check-carrier.mjs
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
