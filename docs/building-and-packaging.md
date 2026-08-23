# Build & đóng gói — CuongThai Desktop

> Cập nhật 16/08/2026. Mọi con số dưới đây là **đo thật**, không ước lượng.

> Đóng gói **sân chơi 3D `/playground`** vào app là một bài riêng — số đo, ba
> đường đi và bẫy giấy phép nằm ở
> [`playground-dong-goi-app.md`](./playground-dong-goi-app.md).

---

## Lệnh

```bash
cd desktop
npm install

npm run dev          # Vite + Electron, HMR
npm run typecheck    # tsc cho cả renderer và main
npm run build        # build renderer + main vào dist/

npm run smoke        # kiểm bản BUNDLE (21 phép kiểm)
npm run smoke:dev    # kiểm đường DEV (9 phép kiểm)
npx vitest run       # unit test (75 phép kiểm)

npm run pack         # thư mục chưa nén, thử nhanh
npm run dist:mac     # .dmg cho arm64 và x64
npm run dist:win     # .exe (NSIS)
npm run dist:linux   # .AppImage và .deb
```

**Phải chạy CẢ HAI bộ smoke.** Bundle và dev đi hai đường khác nhau về nguồn
renderer, cách nạp script, và CSP áp lên loại script nào. Ngày 16/08/2026 một
lỗi CSP làm app hiện màn đen hoàn toàn ở chế độ dev trong khi `npm run smoke`
vẫn báo 21/21 đạt — vì lúc đó chưa có bài kiểm nào chạy qua đường dev.

---

## Kết quả đo (16/08/2026, macOS arm64)

| Sản phẩm | Kích thước |
|---|---|
| `CuongThai-0.1.0-arm64.dmg` | **96 MB** |
| `CuongThai-0.1.0-x64.dmg` | **100 MB** |
| `latest-mac.yml` (feed cập nhật) | 501 B |

Bản đóng gói đã được **chạy thật** và kiểm chứng:

| Kiểm | Kết quả |
|---|---|
| Renderer nạp từ | `app://cuongthai/index.html` |
| `app.getVersion()` | `0.1.0` (không phải phiên bản Electron) |
| Gốc API | `https://api.cuongthai.com` |
| React dựng giao diện | 1616 ký tự trong `#root` |
| `require()` trong renderer | **không tồn tại** — cách ly giữ nguyên ở bản cài |

---

## Vì sao arm64 và x64 tách riêng, không dùng `universal`

Bản `universal` nhét cả hai kiến trúc vào một file: ~250 MB, trong khi mỗi máy
chỉ dùng đúng một nửa. Trang `/download` tự nhận diện và đưa đúng bản, nên người
dùng không phải biết mình dùng Intel hay Apple Silicon.

Cách nhận diện: `navigator.platform` trả `"MacIntel"` trên **cả hai** (Apple giữ
nguyên chuỗi đó để không phá các trang cũ). Cách đáng tin là hỏi WebGL tên GPU —
Apple Silicon báo `"Apple M…"`, Intel báo `"Intel"`/`"AMD"`. Xem
`frontend/src/app/download/page.tsx`.

---

## Biểu tượng

`desktop/build/icon.png` (1024×1024) sinh từ **favicon của website**
(`frontend/public/favicon.png`) để app và web dùng chung nhận diện. electron-builder
tự sinh `.icns` và `.ico` từ file này. Cách dựng lại: `desktop/build/README.md`.

⚠️ Không dùng `frontend/public/favicon.svg` — chính `layout.tsx` ghi chú rằng đó
là placeholder gradient chữ "C" do công cụ sinh mã tạo ra và đã bị loại bỏ.

---

## ⚠️ Chưa ký số — điều người dùng sẽ gặp

Quyết định của chủ dự án (16/08/2026): chưa mua chứng chỉ. Hệ quả:

| Nền tảng | Người dùng thấy gì | Cách qua |
|---|---|---|
| macOS | "app bị hỏng, hãy chuyển vào Thùng rác" | chuột phải → Mở → Mở, hoặc `xattr -dr com.apple.quarantine /Applications/CuongThai.app` |
| Windows | SmartScreen chặn màn xanh | Thêm thông tin → Vẫn chạy |
| Linux | không ảnh hưởng | — |

**App không hỏng.** Đó là thông báo mặc định cho phần mềm chưa đăng ký. Trang
`/download` nói trước điều này — giấu đi thì người dùng tin là có virus rồi xoá.

### Cắm chứng chỉ vào sau này

**macOS** (Apple Developer, 99 $/năm):

```bash
export CSC_LINK=/duong/dan/chung-chi.p12
export CSC_KEY_PASSWORD='...'
export APPLE_ID='...'
export APPLE_APP_SPECIFIC_PASSWORD='...'   # KHÔNG phải mật khẩu Apple ID
export APPLE_TEAM_ID='...'
npm run dist:mac
```

Rồi sửa `electron-builder.yml`: bỏ `identity: null`, đặt `hardenedRuntime: true`,
thêm `notarize: true`. **Hardened runtime bật lúc chưa ký sẽ làm app không chạy
được ngay trên máy build** — chỉ bật cùng lúc với ký.

**Windows** (EV cert, ~300–400 $/năm):

```bash
export CSC_LINK=/duong/dan/chung-chi.pfx
export CSC_KEY_PASSWORD='...'
npm run dist:win
```

⛔ **Không bao giờ commit chứng chỉ.** `desktop/.gitignore` đã chặn `*.p12`,
`*.pfx`, `*.cer`. Một file lọt vào lịch sử git là phải **thu hồi chứng chỉ**,
không phải xoá commit là xong.

---

## Cập nhật tự động

`electron-updater` → **GitHub Releases**. Không cần máy chủ riêng.

⚠️ **Repo phát hành chưa tồn tại.** Trước lần phát hành đầu:

```bash
gh repo create cuonghoang1103/cuongthai-desktop --public
```

Repo **phải PUBLIC**: electron-updater tải bản mới không kèm token, nên repo
private sẽ khiến bản đã cài không bao giờ tự cập nhật được.

### Phát hành một phiên bản

```bash
cd desktop
npm version patch                 # hoặc minor / major
export GH_TOKEN='...'             # token có quyền ghi vào repo phát hành
npm run dist:mac -- --publish always
npm run dist:win -- --publish always
npm run dist:linux -- --publish always
```

Sau đó cập nhật `VERSION` trong `frontend/src/app/download/page.tsx` cho khớp,
rồi `bash deploy.sh` để trang tải trỏ đúng file.

### Hành vi cập nhật, và vì sao chọn như vậy

- `autoDownload = false` — chỉ tải khi người dùng bấm "Kiểm tra". Tải nền vài
  trăm MB trên mạng di động mà không hỏi là chuyện không nên làm.
- `autoInstallOnAppQuit = true` — bản mới áp lúc thoát, thời điểm duy nhất không
  cắt ngang việc của ai.
- Lỗi cập nhật **không** làm app chết. Không nối được GitHub là chuyện thường
  (mạng công ty chặn, đang offline) và nó không cản trở gì.

---

## Lưu ý về deploy

`deploy.sh` rsync **cây làm việc**, không phải commit. Đã loại trừ:

```
--exclude='desktop/release/'
--exclude='desktop/out/'
```

`node_modules/` và `dist/` không có dấu `/` đầu nên rsync khớp ở **mọi độ sâu** —
`desktop/node_modules` và `desktop/dist` được loại sẵn.

Thiếu hai dòng trên thì mỗi lần deploy đẩy ~200 MB installer lên VPS, ăn băng
thông và ăn đĩa — đúng cái đã một lần làm đầy đĩa và giết Postgres.

---

## Còn thiếu

| Việc | Trạng thái |
|---|---|
| Build Windows/Linux | **chưa chạy thử** — máy build là macOS. Cần máy Windows hoặc CI. |
| Repo phát hành | chưa tạo |
| Ký số | chưa mua chứng chỉ (có chủ đích) |
| CI tự động build 3 nền tảng | chưa dựng — cần GitHub Actions với `runs-on` cho cả ba |
