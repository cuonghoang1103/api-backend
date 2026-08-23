# Sân chơi 3D: đóng gói thành app, hay ở lại trình duyệt?

Viết 23/08/2026, sau khi user hỏi *"đóng gói để nâng cấp và làm thêm ở app chứ
không phải ở trình duyệt được không, và nên đi đường nào"*, rồi chốt *"làm bản
app đi, đóng gói phần Sinh tồn vào app"*.

**Mục 1–6 là phần quyết định. Mục 7 là thứ đã dựng xong và đã chạy thật. Mục 8
trả lời câu "sau này làm server online, đánh nhau trong thế giới của nhau được
không".**

---

## Trả lời ngắn

**Đóng gói được**, và rẻ hơn tưởng — vì hạ tầng đã có sẵn hết: `desktop/` là
một app Electron thật, có electron-builder ba nền tảng, có tự cập nhật qua
GitHub Releases, có ký số + công chứng macOS. Không phải dựng từ đầu thứ gì.

**Nhưng đừng CHUYỂN, hãy THÊM.** Bản web ở lại làm cửa trước; bản app là đầu ra
thứ hai của **cùng một mã nguồn** `playground-3d/`. Đây không phải thoả hiệp cho
đủ đôi đường — bỏ bản web là bỏ đúng cái việc mà sân chơi đang làm tốt nhất, xem
mục "Vì sao không bỏ bản web".

---

## 1. Số đo thật (23/08/2026)

Sân chơi đã dựng, `frontend/public/playground/`:

| | |
|---|---|
| Tổng | **89,9 MB** thô · **75,3 MB** sau nén gzip |
| `sounds/` | 49 MB (130 tệp mp3) — **hơn nửa gói** |
| `ui/` | 9,4 MB |
| `assets/` | 7,0 MB — gói JS **5,26 MB**, Rapier wasm 1,70 MB |
| còn lại | `projects` 3,8 · `areas` 3,8 · `draco` 3,6 · `carrier` 2,9 · `monsters` 2,7 · `city` 2,5 MB |
| Mã nguồn | 159 tệp JS, **50.603 dòng** (`playground-3d/sources/`) |

Bản cài đang phát hành (v0.5.64, đo bằng `Content-Length` trên GitHub Releases):

| Bản | Hôm nay | Nếu nhét thẳng sân chơi vào |
|---|---|---|
| `CuongThai-0.5.64-arm64.dmg` | **160,0 MB** | ~235 MB (**+47%**) |
| `CuongThai-Setup-0.5.64.exe` | **132,1 MB** | ~207 MB (**+57%**) |
| `CuongThai-0.5.64.AppImage` | **169,5 MB** | ~245 MB (**+44%**) |

Con số này là lý do mục 4 chọn **tải rời** thay vì nhét thẳng: người dùng vào
app để ghi chú và chat, không phải ai cũng chơi game, mà bản cập nhật thì ai
cũng tải.

---

## 2. Vì sao Electron, và vì sao không có lựa chọn nào khác

Sân chơi là `three/webgpu` + **TSL** + Rapier (WebAssembly). 50k dòng viết
thẳng vào API của trình duyệt.

- **Viết lại bằng Unity/Godot** = vứt 50k dòng. Không bàn.
- **Tauri / wrapper dùng webview hệ điều hành** = giao số phận cho WKWebView
  (macOS) và WebView2 (Windows). Gói cài nhẹ hơn nhiều, nhưng đường WebGPU thì
  mỗi máy một kiểu, và đó đúng là thứ ta đóng gói để tránh.
- **Electron** mang theo Chromium của chính nó ⇒ **mọi máy chạy đúng một
  renderer mà mình chọn**, và mình bật được cờ GPU. Đúng thứ một game cần.

---

## 3. Điều DUY NHẤT chưa chắc: WebGPU trong Electron

Và nó chưa chắc theo nghĩa **chưa đo được**, không phải theo nghĩa đo rồi thấy xấu.

Đo trong container của phiên này:

| Chạy trên | `navigator.gpu` |
|---|---|
| Electron 33.4.11 (Chromium 130) — bản app đang dùng | `undefined` |
| Electron 43.4.1 (Chromium 150) — bản mới nhất | `undefined` |
| ⚠️ Chromium **141** cài sẵn trong **cùng cái máy đó** | `undefined` |

Cả ba đều thử thêm `--enable-unsafe-webgpu` và `--enable-features=Vulkan`:
không đổi. Nhưng dòng thứ ba làm hỏng mọi kết luận — Chrome 141 **chắc chắn**
có WebGPU trên Linux. Máy này không có GPU, nên nó bảo *cái gì cũng* không có
WebGPU. **Con số đo được nói về cái máy, không nói gì về Electron.**

Suýt ghi vào đây là "Electron không hỗ trợ WebGPU". Cùng loại bẫy với
`Upstream stream ended…` ở mục Cổng LLM: lỗi TẢI bị đọc thành tính chất.

**Phải đo trên máy nhà** — đã dựng sẵn bộ đo:

```bash
cd desktop && npm run do:webgpu     # chạy Electron THẬT, ba cấu hình cờ
```

Nó in `navigator.gpu`, `requestAdapter()`, tên card, `webgl2`, và
`app.getGPUFeatureStatus().webgpu`. Nếu báo không có, nó nhắc mở `chrome://gpu`
trên chính máy đó trước khi tin.

**Và dù kết quả thế nào thì cũng KHÔNG chặn việc đóng gói.** Sân chơi đã có sẵn
đường lùi:

- `Rendering.js:43` — `forceWebGL: false`, three tự chọn backend.
- `Options.js:289` — backend là WebGL thì hiện `WebGL` màu đỏ + tooltip
  *"not compatible with WebGPU resulting in performance loss"*.
- `Game.js:258` — `PreRenderer` chỉ chạy khi `isWebGPUBackend`.

Tức là mất WebGPU = **chậm hơn**, không phải **chết**. Đây cũng chính là thứ
đang xảy ra hôm nay với khách dùng trình duyệt cũ.

---

## 4. Ba đường đi, và đường nên chọn

### Đường 1 — mở `/playground` bằng trình duyệt sẵn có trong app
`ALLOWED_NAVIGATION_ORIGINS` (`desktop/src/main/config.ts`) đã cho phép
`https://cuongthai.com`, nên **hôm nay đã mở được rồi**, 0 dòng mã.

Nhưng nó vẫn tải 35 MB qua mạng, vẫn không chơi offline, vẫn không bật được cờ
GPU. Nó chỉ chứng minh app hiển thị được sân chơi. Dùng để thử trong 5 phút,
không phải đích đến.

### Đường 2 — ⭐ Nhét vào app CuongThai, tài nguyên **tải rời lần đầu**
1. Dựng sân chơi với `VITE_BASE_HREF=./` (`sources/index.html:21` đã là
   `%VITE_BASE_HREF%`, nên chỉ là đổi biến môi trường, không sửa mã).
2. Gói JS + `index.html` (~7 MB) đi kèm bản cài qua `extraResources` —
   `electron-builder.yml` hiện chỉ gói `dist/**`, phải khai thêm.
3. **~83 MB media (`sounds/`, `ui/`, `glb`, `ktx`) tải một lần** vào
   `app.getPath('userData')` khi người dùng bấm chơi lần đầu, rồi phục vụ qua
   protocol handler như `registerAppProtocol()` đang làm.
4. Bản cài chỉ phình ~7 MB. Chơi lần thứ hai trở đi: **offline, 0 giây tải**.

Được thêm mà bản web không có: lưu game bằng file thật thay vì `localStorage`,
toàn màn hình + khoá con trỏ không vướng tab, không bị trình duyệt bóp rAF khi
mất tiêu điểm, và bật được cờ GPU cho từng nền tảng.

### Đường 3 — app game riêng, repo riêng, kênh phát hành riêng
Chỉ đáng làm khi đã quyết **bán** hoặc đưa lên itch.io/Steam. Lúc đó phải trả:
ký số riêng, kênh cập nhật riêng, và `phat-hanh.mjs` phải gánh hai luồng phiên
bản — mà chốt "một lượt dựng một lúc" của nó sinh ra chính vì hai phiên giẫm
nhau (xem CLAUDE.md, mục Phát hành app desktop).

**Chọn đường 2.** Nó dùng lại toàn bộ hạ tầng đã trả tiền, giữ bản cài gọn, và
không khoá đường sang đường 3 sau này.

---

## 5. Vì sao KHÔNG bỏ bản web

`/playground` không chỉ là game. Nó là **cửa trước của cuongthai.com**:

- `RiveLanding.tsx:257` — `PlaygroundGate` là nút CTA chính của trang chủ.
- Trong thế giới có `ProjectsArea`, `CareerArea`, `SocialArea`,
  `AchievementsArea`, `LabArea`, `BehindTheSceneArea` — đó là **hồ sơ năng lực**
  dựng thành đường lái xe.

Một cái link gửi cho nhà tuyển dụng, mở phát chạy ngay, chính là toàn bộ lý do
nó tồn tại. Không ai cài một bản 160 MB để xem CV. Bỏ bản web là đổi thứ mạnh
nhất của nó lấy thứ nó chưa cần.

Cách chia việc rõ ràng:

| | Bản web | Bản app |
|---|---|---|
| Việc | cửa trước, hồ sơ, gửi link | chơi thật: Sinh tồn, sóng quái, cửa hàng |
| Ai | khách vãng lai | người quay lại |
| Nặng | phải gọn, tải nhanh | thoải mái, đã cài rồi |

---

## 6. Bẫy đã biết trước, đọc trước khi gõ dòng đầu tiên

1. **`asar` KHÔNG nén.** Nhét 83 MB media vào asar không tiết kiệm được byte
   nào, chỉ thêm một lớp đọc. Dùng `extraResources` / thư mục `userData`.
2. **CSP của app phải mở đúng hai thứ sân chơi cần**, và next.config.js đã ghi
   sẵn lý do (`frontend/next.config.js:166`): `'unsafe-eval'` cho Rapier biên
   dịch WebAssembly, và `blob:` ở `connect-src` vì `.glb` nhúng texture, three
   bóc ra thành `blob:` URL. Thiếu một trong hai: kẹt ở màn hình tải, **không
   báo lỗi gì**.
3. **Đừng dùng `file://`.** `config.ts` đã ghi lý do: origin `null`, không có
   storage thật. Đi qua protocol `app://` như renderer hiện tại.
4. **Cờ GPU phải đặt trước `app.whenReady()`.** Đặt sau là im lặng vô tác dụng.
5. **Bản dev không được lọt vào gói.** `VITE_GAME_PUBLIC=1` phơi `window.game`
   ra console — `.env.development` đã cảnh báo, và đã dẫm 30/7.
6. ⚠️ **Giấy phép — việc phải làm TRƯỚC khi phát hành bất kỳ bản cài nào.**
   `ATTRIBUTION.txt` tự đánh dấu `⚠⚠ CREDIT INCOMPLETE` cho
   `static/monsters/boss.glb` (`alien_creature_take_3.glb`): **không có tác
   giả, không có nguồn, không có giấy phép** nào được ghi lại — mà nó đang được
   dùng cho **cả ba** loại quái của chế độ Sinh tồn. Phục vụ trên web đã là rủi
   ro; **phát hành thành file cài đặt thì không rút lại được**, và càng không
   thể nếu có thu tiền. Phải điền credit hoặc thay model. (`fatalis.glb` đã bị
   loại đúng vì lý do này.)

---

## 7. ĐÃ DỰNG XONG (23/08/2026), và đã chạy thật

Đường 2 ở mục 4 nay là mã thật, không còn là đề xuất.

| Tệp | Việc |
|---|---|
| `desktop/scripts/dong-goi-san-choi.mjs` | Chia bản dựng: **11,9 MB / 44 tệp** đi kèm bản cài · **78,0 MB / 891 tệp** tải rời. Đổi `<base href>` sang `./`, sinh manifest có sha256 từng tệp + `version` của cả bộ. `npm run dong-goi:san-choi` |
| `desktop/src/main/sanChoi.ts` | Hai thư mục, bộ tải 6 luồng (bỏ qua tệp đã có ⇒ đứt mạng chạy lại là tiếp tục; ghi `.part` rồi đổi tên; đối chiếu sha256), phục vụ `app://playground`, cửa sổ chơi riêng |
| `desktop/src/main/security.ts` | **CSP tách theo origin** — sân chơi có `'unsafe-eval'` + `blob:`, renderer chính giữ nguyên luật chặt |
| `desktop/src/main/index.ts` | Cờ WebGPU đặt **trước** `app.whenReady()` (+ Vulkan trên Linux) |
| `desktop/src/main/ipc/sanChoi.ts`, `shared/ipc.ts`, `preload/index.ts` | 4 kênh + 1 sự kiện tiến độ. `tai()` trả về NGAY, tiến độ đi bằng sự kiện |
| `desktop/src/renderer/features/sanchoi/SanChoiPage.tsx` | Màn hình `/playground`: trạng thái · nút tải có thanh tiến độ · **Chơi Sinh tồn** · Đi dạo tự do · Xoá tài nguyên |
| `desktop/electron-builder.yml` | `extraResources` (KHÔNG phải `files`: asar không nén) |
| `desktop/scripts/smoke-san-choi.mjs` | 17 phép kiểm, `npm run smoke:san-choi` |
| `playground-3d/sources/Game/Game.js` | `#sinh-ton` vào thẳng chế độ Sinh tồn — app mở đúng địa chỉ này |
| `playground-3d/vite.config.js` | **Vá lỗi `envDir`** — xem dưới |

### Lỗi vá kèm: `npm run build` của sân chơi ra bản HỎNG trên máy sạch

`envDir: '../'` trỏ ra **gốc repo**, không phải `playground-3d/` (Vite giải nó
theo thư mục chạy, không theo `root`). Đo bằng `loadEnv('production', <dir>)`:
chỉ `playground-3d/` có `.env.production`.

Hậu quả im lặng: `%VITE_BASE_HREF%` không được thay ⇒ `<base>` **rỗng** ⇒ mọi
tài nguyên tìm ở gốc site và 404 sạch ⇒ đúng cái "kẹt mãi ở màn hình tải, không
lỗi nào" trong CLAUDE.md. Không ai thấy vì `import 'dotenv/config'` nạp
`playground-3d/.env` (bị .gitignore) vào `process.env`, mà `process.env` thắng
mọi `.env.<mode>`. Máy có `.env` thì dựng đúng; **máy sạch — máy CI, máy mới
clone — dựng ra bản hỏng mà build vẫn XANH.**

Nay `envDir` là đường dẫn tuyệt đối suy từ vị trí file cấu hình.

### Bằng chứng chạy thật

`npm run smoke:san-choi` — **17/17 đạt**, gồm:

- `app://playground/index.html` trả 200, `<base href="./">` đúng
- manifest 891 tệp / 78,0 MB
- `..%2f` ra ngoài gốc bị chặn **403** (dạng mã hoá, vì `..` trần bị chuẩn hoá
  trước khi tới handler — bộ kiểm phải thử đúng cái chốt)
- CSP: sân chơi chạy được `eval`, renderer chính **chặn** script từ `blob:`
- **Tải thật 891/891 tệp** qua đúng đường `renderer → IPC → net.fetch → đĩa →
  sha256`, rồi tệp thế giới phục vụ được qua `app://playground`

Bộ kiểm này đã **tự bắt được chính nó hai lần** trước khi tin được — đúng bài
[[feedback_verify_the_checker_before_the_content]]:

1. Đọc CSP bằng `net.fetch` ở main → rỗng, 4 phép kiểm đỏ oan. `net.fetch` ở
   main KHÔNG đi qua `session.webRequest` nên không bao giờ thấy header. Đổi
   sang đo **hiệu lực** (`eval`, script từ `blob:`).
2. Đo "app không có `'unsafe-eval'`" bằng `eval` → đỏ oan tiếp: chạy
   `dist/main/index.cjs` từ `node_modules` thì `isPackaged` luôn **false** ⇒ app
   dùng nhánh CSP **dev**, mà nhánh đó CÓ `'unsafe-eval'`. `CT_RENDERER=bundle`
   chỉ đổi nguồn renderer, không đổi `isPackaged`.

### Ba điều bộ kiểm KHÔNG chứng minh được

| Điều | Đo bằng gì |
|---|---|
| Game có **vẽ ra** không | Máy có GPU. Container này không có |
| Bản đóng gói thật bỏ `'unsafe-eval'` | Cài bản `.dmg`/`.exe` rồi đo |
| WebGPU hay lùi về WebGL2 | `cd desktop && npm run do:webgpu` trên máy nhà |

---

## 8. Làm tiếp tới đâu: server online, đánh nhau trong thế giới của nhau

**Làm được**, và ống dẫn đã có sẵn một nửa — nhưng nửa còn lại mới là phần khó,
nên đừng đọc "có sẵn WebSocket" thành "gần xong".

### Đã có

`sources/Game/Server.js` (132 dòng, đi theo bản gốc folio-2025):

- WebSocket + **msgpack** (nhị phân, gọn hơn JSON nhiều — đúng thứ cần cho
  đồng bộ 15–20 gói/giây)
- `uuid` mỗi máy, giữ trong `localStorage`
- Tự nối lại mỗi 2 giây, có sẵn lớp CSS `is-server-online/offline` và thông báo
- Bật/tắt bằng **đúng một biến**: `VITE_SERVER_URL`. Production đang để trống
  nên toàn bộ phần mạng đang tắt.

Đang dùng cho hai thứ, và cả hai đều **không phải thời gian thực**:
`Whispers` (lời nhắn người chơi để lại trong thế giới) và bảng giờ đường đua.

### Chưa có

**Đồng bộ vị trí người chơi.** Không một dòng nào vẽ xe của người khác. Đây là
phần phải viết mới.

### Ba bước, theo thứ tự

1. **Máy chủ WS** (Node) giữ phòng + phát lại trạng thái. Không cần vật lý.
2. **Client gửi–nhận trạng thái xe**: gửi `{pos, quat, vel}` của mình ~15–20
   lần/giây; nhận của người khác rồi dựng một `VisualVehicle` cho mỗi người và
   **nội suy** giữa hai gói (thiếu nội suy thì xe người khác giật từng nấc —
   đây là lỗi ai cũng mắc lần đầu).
3. **Bắn nhau** — và đây mới là quyết định thật:

| Mô hình | Cái giá | Hợp khi |
|---|---|---|
| **Client tự quyết** (mình tự tính bắn trúng ai rồi báo lên) | Gian lận được | Chơi với bạn bè ⇒ **chọn cái này** |
| **Máy chủ quyết** | Phải chạy Rapier trên Node và viết lại vật lý xe cho chạy được hai nơi | Có tiền thưởng / bảng xếp hạng công khai |

`@dimforge/rapier3d` chạy được ở Node nên đường thứ hai KHÔNG bị chặn về kỹ
thuật — nó chỉ đắt gấp nhiều lần. Đường giữa: client tự quyết + máy chủ kiểm
vài điều rẻ tiền (tốc độ tối đa, tầm bắn, nhịp bắn).

### Ba điều biết trước kẻo trả giá

1. ⚠️ **Giao thức mạng phải có SỐ PHIÊN BẢN ngay từ gói đầu tiên.** Client cũ
   nối vào máy chủ mới là nguồn lỗi câm kinh điển: không ai báo lỗi, chỉ là xe
   người khác đứng im hoặc bay lên trời. Máy chủ phải từ chối thẳng phiên bản
   nó không hiểu, kèm câu nói rõ "cập nhật app đi".
2. ⚠️ **Đừng nhét máy chủ game chung chỗ với Postgres.** VPS 6 GB đã chật, và
   kho này đã một lần chết vì hết đĩa (18/08). Máy chủ game là tiến trình sống
   lâu, ăn CPU **đều đặn** chứ không theo đợt như API. Đo trước khi ghép.
3. ⚠️ **`coturn/` đã có sẵn nhưng KHÔNG dùng lại được ở đây.** Nó phục vụ
   WebRTC cho gọi thoại. Đồng bộ trạng thái game qua WebSocket đơn giản hơn
   nhiều và đủ dùng; WebRTC data channel chỉ đáng cân nhắc nếu sau này cần
   nối thẳng máy-tới-máy.

### App giúp được gì cho phần online

| | |
|---|---|
| Phiên bản client **cố định** | Máy chủ biết chắc mình đang nói chuyện với ai |
| `electron-updater` đẩy bản mới **đồng loạt** | Đúng lúc giao thức đổi — thứ quyết định ở điểm 1 trên |
| Không tải lại 78 MB | Người chơi vào lại phòng trong vài giây |

Nói cách khác: phần online là lý do **mạnh nhất** để có bản app, mạnh hơn cả
chuyện hiệu năng.

---

## 9. ⛔ Trước khi phát hành bản cài ĐẦU TIÊN

Nhắc lại mục 6.6 vì nó là thứ duy nhất **chặn**: `static/monsters/boss.glb`
không có tác giả, nguồn hay giấy phép nào được ghi lại, mà nó đang dùng cho cả
ba loại quái Sinh tồn — tức là chính phần đang đóng gói vào app.

Phục vụ trên web đã là rủi ro. **Phát hành thành file cài đặt thì không rút lại
được**, vì bản cài nằm trên máy người dùng. Điền credit hoặc thay model trước
khi bấm `npm run phat-hanh`.
