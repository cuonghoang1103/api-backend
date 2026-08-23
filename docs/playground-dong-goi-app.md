# Sân chơi 3D: đóng gói thành app, hay ở lại trình duyệt?

Viết 23/08/2026, sau khi user hỏi *"đóng gói để nâng cấp và làm thêm ở app chứ
không phải ở trình duyệt được không, và nên đi đường nào"*.

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

## 7. Việc phải làm, theo thứ tự

| # | Việc | Ghi chú |
|---|---|---|
| 1 | `cd desktop && npm run do:webgpu` trên máy nhà | 5 phút, quyết định phần còn lại |
| 2 | Điền credit hoặc thay `boss.glb` | **chặn phát hành**, xem 6.6 |
| 3 | Dựng thử `VITE_BASE_HREF=./`, mở bằng Electron ở máy | chứng minh nó chạy ngoài Next |
| 4 | Protocol `app://playground/` + tải rời vào `userData` | phần việc chính |
| 5 | Khai `extraResources`, dựng thử ba nền tảng | `electron-builder.yml` |
| 6 | Thêm mục "Sân chơi" vào app + nút tải lần đầu | giao diện |
| 7 | Smoke test: chạy bản ĐÃ ĐÓNG GÓI, không phải bản dev | `CT_RENDERER=bundle`, như `smoke.mjs` |

Bước 7 không bỏ được. Bài học đắt nhất của repo này viết ở CLAUDE.md:
***build xanh không có nghĩa là ảnh chạy được.***
