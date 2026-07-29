# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025)

Cập nhật 30/7/2026. Nhánh `feat/playground-3d`. **CHƯA deploy lên production.**

---

# ✅ LỖI ĐƠ ĐÃ TÌM RA VÀ ĐÃ SỬA (30/7/2026)

## Nguyên nhân thật

**Next.js chốt danh sách file trong `public/` NGAY LÚC SERVER KHỞI ĐỘNG.**
File chép vào `public/` sau khi server đã chạy thì trả **404** dù có thật trên
đĩa. Dựng lại xong khởi động lại server là hết.

Vì sao nó ra đúng triệu chứng "kẹt ở vòng tròn, không lỗi gì":

1. Dựng lại sân chơi ⇒ gói JS đổi tên (tên chứa **mã băm nội dung**:
   `assets/index-Hu7RCC_l.js`)
2. Chép đè vào `frontend/public/playground/`, nhưng server Next **đang chạy từ
   trước** ⇒ không biết tên mới ⇒ **404**
3. `index.html` vẫn phục vụ bình thường (tên file không đổi nên vẫn nằm trong
   danh sách) ⇒ trang mở ra, **màn hình tải hiện lên** — vì màn hình tải là
   HTML/CSS thuần nằm sẵn trong `index.html`
4. **Không có JS nào chạy** ⇒ không ai tắt màn hình tải, và cũng **không có lỗi
   nào** để mà thấy, vì có mã đâu mà lỗi
5. Mấy file `.ktx` preload trong `<head>` vẫn 200 (tên không đổi) ⇒ nhìn vào
   tab Network lại tưởng "tài nguyên tải ngon lành"

### Bằng chứng (phép thử đối chứng, không phải suy đoán)

| Phép thử | Kết quả |
|---|---|
| File **mới toanh** thêm vào `public/playground/` khi server đang chạy | **404** |
| File có sẵn từ lúc server khởi động (`palette.ktx`) | **200** |
| Cùng file đó, sau khi **khởi động lại** server | **200** |
| Đổi tên file cho không có gạch dưới/gạch ngang | vẫn **404** ⇒ không liên quan tên |
| `next build` lại nhưng KHÔNG khởi động lại server | vẫn **404** ⇒ mốc là **lúc server chạy**, không phải lúc build |

### ⚠️ Bẫy đi kèm khiến lỗi này sống dai

`pkill -f "next start"` **và** `pkill -f "standalone/server.js"` đều **KHÔNG**
giết được server — Node đổi tên tiến trình thành **`next-server`**. Nên mọi lần
"khởi động lại" trước đây thực chất là: server mới chết vì cổng bận
(`EADDRINUSE`), server **cũ** vẫn sống và tiếp tục trả 404. Lỗi trông như bất trị.

**Cách diệt đúng — diệt theo cổng, đừng diệt theo tên:**

```bash
lsof -ti:3000 | xargs -r kill -9
```

## 🟢 PRODUCTION KHÔNG DÍNH LỖI NÀY

`frontend/Dockerfile` làm `COPY . .` (đã có sẵn `public/playground/`) **rồi mới**
`next build`, và mỗi lần deploy là một container **mới tinh**. Danh sách file
luôn được chốt sau khi sân chơi đã nằm đúng chỗ.

⇒ Lỗi đơ suốt hai phiên vừa qua là **hiện tượng chỉ có khi test ở máy local**,
không phải lỗi của sân chơi.

## Quy trình test local ĐÚNG

```bash
# 1. dựng sân chơi
cd playground-3d && npm run build

# 2. chép sang Next
cd .. && rm -rf frontend/public/playground && mkdir -p frontend/public/playground
rsync -a playground-3d/dist/ frontend/public/playground/

# 3. GIẾT server cũ THEO CỔNG rồi mới chạy lại  ← BƯỚC HAY BỊ QUÊN
lsof -ti:3000 | xargs -r kill -9
cd frontend && npm run start
```

Kiểm nhanh xem có dính lại không:

```bash
B=$(curl -sL http://localhost:3000/playground/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1)
curl -s -o /dev/null -w "$B => %{http_code}\n" "http://localhost:3000/playground/$B"
```

**200 = lành. 404 = đang dính đúng lỗi này, khởi động lại server.**

`deploy.sh` nay đã có chốt chặn tự động cho đúng chuyện này (xem mục 3b).

## ⚠️ ĐỪNG LẶP LẠI SAI LẦM CỦA HAI PHIÊN TRƯỚC

Đã đoán sai **NĂM lần** về nguyên nhân lỗi đơ. Nguyên nhân chung:
**kết luận từ khung xem của Claude thay vì từ phép thử đối chứng.**

> **Khung xem (Browser pane) của Claude KHÔNG BAO GIỜ vẽ xong thế giới này** —
> kể cả với bản gốc chưa sửa gì của Bruno, kể cả trên `bruno-simon.com` thật.
> Nó dựng được canvas WebGPU, tải xong tài nguyên, vòng intro chạy, nhưng không
> bao giờ hoàn tất. **"Đơ ở vòng tròn" trong khung đó KHÔNG chứng minh gì cả.**

Chỉ số đo được và đáng tin trong khung xem:
- `performance.getEntriesByType('resource').length` — số tài nguyên tải xong
- `responseStatus >= 400` — đếm 404
- `document.querySelector('canvas').dataset.engine` — xác nhận WebGPU khởi tạo
- Đối chiếu mã băm file giữa các server

### Bảy nghi phạm ĐÃ LOẠI bằng phép thử (đừng thử lại)

1. **CSP thiếu `blob:` ở `connect-src`** — thêm rồi, vẫn lỗi
2. **`upgrade-insecure-requests`** — tắt rồi, vẫn lỗi (đã khôi phục)
3. **Service worker can thiệp** — `getRegistrations()` trả về 0
4. **Kiểu nội dung WASM sai + `nosniff`** — cả hai server đều `application/wasm`
5. **File truyền bị hỏng/nén sai** — cùng mã băm `d29f11a2…` ở đĩa, `:3000`, `:4173`
6. **Rút gọn mã (`minify`)** — 30/7 dựng bản CÓ rút gọn: 111 tài nguyên, 0 lỗi,
   `is-started`, console chỉ còn đúng 2 cảnh báo NaN y hệt bản dev ⇒ vô can.
   **Đã bật lại `minify`**, gói JS về 4,86MB (gzip 1.030 kB) thay vì 6,52MB
7. **Ba bản nhạc nền** — gỡ rồi vẫn không liên quan (chúng `preload:false`,
   không tải lúc khởi động)

### Số đo cũ đã bị BÁC BỎ

> "`:4173` tải **115** tài nguyên, `:3000` dừng ở **108** ⇒ Next làm đứt sớm 7 bước"

**Sai.** Chênh lệch đó phần lớn là khối **Google Analytics**: trên `:4173` (không
CSP) nó tải được và kéo thêm vài request, còn trên `:3000` thì CSP chặn. Sau khi
gỡ hẳn khối analytics, đo lại **cùng một bản dựng**:

| | tài nguyên | lỗi ≥400 |
|---|---|---|
| `:4173` server tĩnh | 110 | 0 |
| `:3000` Next standalone | 111 | 0 |

⇒ Next **không** làm đứt gì cả.

### Cảnh báo NaN — có thật nhưng KHÔNG phải thủ phạm

```
THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN … [object Object]
THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN … PlaneGeometry
```

Xuất hiện **y hệt nhau** ở cả ba môi trường — kể cả bản **dev mà user đã chơi
được**. Là lỗi có sẵn từ kho gốc, chưa truy nguồn. Đáng dọn lúc rảnh, nhưng đừng
lôi nó ra làm nghi phạm cho lỗi đơ nữa.

⚠️ Vẫn phải coi trọng NaN nói chung: chú thích trong `data/social.js` ghi rõ một
NaN chảy vào ma trận là đủ giết vòng lặp vẽ mà không báo gì.

---

# 1. Trạng thái mã

## Ba commit đã có trên nhánh `feat/playground-3d`

| Commit | Nội dung |
|---|---|
| `548f4a0` | Fork folio-2025 vào `playground-3d/` (1021 file, 54MB) |
| `692f362` | Nhúng vào `/playground` trên Next.js |
| `a7b21e8` | Ảnh thật 14 module (22 file, chụp từ production) |

## Phiên 30/7/2026 làm thêm những gì

### A. Gỡ nhạc nền của bản mẫu (user yêu cầu)

Gỡ **đúng nhạc nền**, **không đụng** một hiệu ứng âm thanh nào.

- Xoá `static/sounds/musics/{Sudo,Boy,Baguira}.mp3` + `license.md` — **18MB**,
  gói giảm từ ~55MB xuống **37MB**
- **File mới `sources/data/musics.js`** — danh sách nhạc, để rỗng, có hướng dẫn
  đầy đủ ở đầu file. Muốn gắn nhạc riêng thì **chỉ sửa file này**
- `Audio.setPlaylist()` đọc danh sách đó; thêm cờ `playlist.hasSongs`, chặn sớm
  trong `play()` và `next()` để 0 bài không sinh `NaN`/`undefined`
- `BowlingArea.setJukebox()` thoát sớm khi không có nhạc ⇒ jukebox hết nút
  "Change song" và hết nốt nhạc bay, chỉ còn là đồ đạc. Thêm nhạc vào là sống lại
- Bỏ mục "Musics" trong hộp *Behind the scene* và dòng ghi công Kounine trong
  `data/consoleLog.js`; cập nhật `ATTRIBUTION.md`
- **GIỮ NGUYÊN** tiếng đổi đĩa `sounds/jukebox/…` (nó là hiệu ứng, và cần lại
  ngay khi có nhạc)

### B. Bốn chỗ còn sót danh tính tác giả gốc

| Chỗ | Vấn đề | Đã làm |
|---|---|---|
| Hộp *Behind the scene* | Ngôi thứ nhất nhưng quảng bá khoá học Three.js Journey + kênh devlog + kho mã của Bruno, ký "— Bruno" | Viết lại, thêm mục "Original project" ghi công đàng hoàng, ký "— Cuong" |
| Hộp thoại **Discord** | "Contact me directly" trỏ vào Discord cá nhân của Bruno; đã thành mã chết | Gỡ hẳn, để chú thích cách dựng lại |
| `TimeMachineArea.js` | Nút "Time Machine" mở `2019.bruno-simon.com` | Đổi thành hằng `TIME_MACHINE_URL` → `cuongthai.com/games`. Để rỗng thì nút biến mất |
| **Google Analytics** | `G-JMSN30BQ5J` nằm CỨNG trong `<script src>` — mã đo của tác giả gốc. Mỗi khách vào sân chơi bắn dữ liệu về tài khoản người khác. Lại còn `gtag('config','')` rỗng, và CSP chặn ⇒ chỉ đẻ request hỏng | Gỡ hẳn khối |
| **Ảnh bảng Options** | `static/ui/previews/options.png/.webp` là ảnh render thế giới gốc có chữ 3D **"BRUNO SIMON"**, hiện ngay trong bảng Cài đặt (user phát hiện) | Thay bằng `easter.png/.webp` — ảnh cùng bộ, **không ai dùng**, không có danh tính. ⚠️ Muốn đẹp hơn: chụp màn hình khu landing có chữ CUONG THAI rồi đè lên `options.png` + `options.webp` |

### C. Bốn lỗi kỹ thuật

1. **Phông chữ — việc trước đó mới làm một nửa.** Đã gỡ Google Fonts nhưng CODE
   vẫn xin `"Amatic SC"`/`"Nunito"` ở **15 chỗ** (nhãn điểm tương tác, tên khu
   Dự án/Lab, bong bóng chữ, đồng hồ đường đua, phông nền UI). Đo được:
   `measureText` của Amatic SC = Nunito = một phông không tồn tại = **403px**
   ⇒ tất cả đang rơi về **phông mặc định của trình duyệt**, tức Windows/macOS/
   Android mỗi máy một kiểu chữ. Đã đổi hết sang **Pally** (tự phục vụ sẵn trong
   `static/fonts/`, cũng là phông dựng chữ 3D). Đo lại: `bodyFont` =
   `Pally-Regular`, Pally-Bold = 396px ≠ 403 ⇒ **thật sự đã ăn phông**.
   ⚠️ Canvas KHÔNG tự kích hoạt tải phông — đó là việc của ba ô ẩn
   `.fonts-loader` trong `index.html`; đã trỏ cả ba vào Pally.
2. **Ảnh 14 module LỘN NGƯỢC trên bảng (user phát hiện).** Đoạn nạp ảnh trong
   `ProjectsArea.js` và `LabArea.js` gán năm thuộc tính texture **vào nhầm đối
   tượng**:

   ```js
   loader.load(path, (loadedTexture) => {
       resource.texture = loadedTexture
       resource.flipY = false        // ✖ `resource` là cái HỘP dữ liệu,
       resource.colorSpace = …       //   KHÔNG phải texture ⇒ three.js
       resource.magFilter = …        //   không bao giờ thấy mấy dòng này
   })
   ```

   Mặt phẳng hiện ảnh lấy UV từ file Blender (`.glb`), mà **glTF quy ước V=0 ở
   ĐỈNH ảnh** — ngược với ảnh PNG thường. Nên texture bắt buộc phải
   `flipY = false`; không gán được thì nó giữ mặc định `true` của
   `TextureLoader` ⇒ **ảnh lộn ngược**. `colorSpace` cũng trượt luôn nên ảnh còn
   bị bợt màu.

   **Bằng chứng đối chứng nằm ngay trong cùng file**: đoạn nạp ảnh *mini* ở
   `LabArea.js:~860` gán đúng vào `loadedTexture` — và ảnh mini vẫn hiện thuận.

   Đã sửa: gán vào `loadedTexture` ở cả hai file. Ảnh gốc trong `static/` vẫn
   để **thuận chiều bình thường**, đừng lật file ảnh để "chữa" — sửa ở code mới
   đúng chỗ.

3. **`SocialArea.js` thiếu chữ `if`.** Bản gốc viết `else(link.modal)` ⇒ nhánh
   else là biểu thức rỗng, `modals.open()` chạy **vô điều kiện**, mỗi lần bấm
   link mạng xã hội đều gọi `modals.open(undefined)`. Không vỡ vì `Modals.open`
   thoát sớm, nhưng vẫn sai. Đã sửa thành `else if`.
4. **Chốt kiểm frontend trong `deploy.sh` là đồ giả.** Nó gọi `wget` bên trong
   container frontend — mà image đó **không cài wget lẫn curl** (Dockerfile ghi
   rõ là cố ý, healthcheck dùng module http của node). Lệnh luôn thất bại ⇒ vòng
   lặp quay đủ 6 lần, **tốn không ~25 giây mỗi lần deploy** và **không kiểm được
   gì**. Đã đổi sang `node -e`.

### D. `deploy.sh` — chốt chặn mới cho sân chơi (mục 3b)

Sân chơi là **file tĩnh**, không phải route API, nên vòng smoke-test route cũ
không đời nào thấy nó hỏng. Chốt mới kiểm hai thứ bằng `node -e`:

- `/playground/` có ra 200 không ⇒ thư mục có được copy vào image không
- **tên gói JS trong `index.html` có tải được không** ⇒ bắt đúng kiểu hỏng
  "index.html mới trỏ vào gói JS cũ" (tên có mã băm)

⚠️ Bộ kiểm phải **bám theo chuyển hướng**: Next đặt `trailingSlash=false` nên
`/playground/` trả **308** về `/playground`. Lúc viết đã dẫm đúng bẫy này, coi
308 là hỏng thì mọi deploy đều false-fail.

⚠️ Và đừng viết `[ "$x" = false ] && fail "…"` trong `deploy.sh` — script chạy
`set -euo pipefail`, dây `&&` có vế trái sai thì trả mã khác 0 ⇒ **deploy tự chết
đúng lúc mọi thứ đang khoẻ**. Phải dùng `if`.

## Chưa commit

- `frontend/next.config.js` — bộ header riêng cho `/playground` (**đáng giữ**, xem mục 3)
- Toàn bộ thay đổi phiên 30/7 ở trên
- `frontend/public/playground/` — bản dựng mới (đã bật lại `minify`)

## Chạy thử

```bash
cd playground-3d && npm run dev      # :5173 — bản này CHẠY ĐƯỢC
cd playground-3d && npm run build    # dựng ra ../dist
# rồi chép sang Next:
rm -rf frontend/public/playground && mkdir -p frontend/public/playground
rsync -a playground-3d/dist/ frontend/public/playground/
cd frontend && npm run build && npm run start
```

⚠️ **`pkill -f "next start"` KHÔNG giết được server Next** — tiến trình tên là
`next-server`. Dùng `pkill -9 -f "next-server"`. Đã mất một vòng chẩn đoán vì
`curl` trúng server cũ chạy từ một tiếng trước và tưởng cấu hình không ăn.

---

# 2. Những gì ĐÃ XONG và ĐÃ KIỂM

Tất cả đều chạy đúng trên `:5173` (user đã xác nhận từng phần):

| Phần | Chi tiết |
|---|---|
| Màn chào | "Welcome to CuongThai" + nút Play. Nút này còn mở khoá âm thanh — trình duyệt chặn tự phát tới khi người dùng chạm trang |
| Chữ 3D | **CUONG THAI** đủ 9 chữ, màu phẳng đúng, **đâm đổ được**, chữ T/U được kéo cao cho bằng hàng |
| 6 nhãn sự nghiệp | HONOURS STUDENT/FPT UNIVERSITY/3 SEMESTERS · COURSE AUTHOR/FULL TYPESCRIPT/+200 STUDENTS · FULL-STACK DEV/NODE.JS+TS · IELTS 6.5 · 2 nhãn NEXT GOAL |
| Tông tường → từ vựng | 1.221 từ tiếng Anh từ My Language, xáo Fisher-Yates rồi duyệt tuần tự nên **không lặp** cho tới khi đi hết; nhiễu ưu tiên cùng chủ đề; phím 1–4 |
| Khu Dự án | 6 module học tập, ảnh thật |
| Khu Lab | 8 module còn lại, ảnh thật |
| Danh tính | Bảng giới thiệu, liên hệ (GitHub/YouTube/Facebook), thẻ meta, tiêu đề tab, console — đều đã là của CuongThai |

---

# 3. Bộ header riêng cho `/playground` — ĐÁNG GIỮ

Trong `frontend/next.config.js`. Đúng bất kể lỗi đơ nằm ở đâu:

- Toàn site **giữ nguyên** CSP cũ, không bị nới lỏng gì
- `/playground` có CSP riêng, **chặt hơn** site ở hầu hết mặt: không domain bên
  thứ ba nào (site phải mở cho YouTube, Giphy, Sentry, R2), `form-action 'none'`,
  không `frame-src`
- Phần nới duy nhất: `blob:` — dữ liệu do chính trang tạo ra
- `Cross-Origin-Opener-Policy` và `Cross-Origin-Resource-Policy` **không còn áp**
  cho `/playground`

⚠️ **BẪY: Next.js cho quy tắc header CHUNG thắng quy tắc RIÊNG, bất kể thứ tự.**
Nên phải loại `/playground` khỏi quy tắc chung bằng biểu thức chính quy:
`source: '/:path((?!playground(?:/|$)).*)'`. Chỉ thêm entry mới là vô ích.

---

# 4. 🪤 BẪY ĐÃ DẪM — đừng lặp lại

| Bẫy | Hậu quả |
|---|---|
| Ghép chữ thẳng vào `areas.glb` | **Cả thế giới kẹt ở màn hình tải**, dừng ở tài nguyên 244/250, KHÔNG ném lỗi nào. Cách đúng: sửa lúc chạy — giấu chữ cũ rồi tự dựng nhóm chữ mới |
| `NodeIO` của gltf-transform không đăng ký extension | Ghi ra file **mất `KHR_materials_emissive_strength`**. Cảnh báo `Missing optional extension` CÓ in ra nhưng dễ bỏ qua. Phải `registerExtensions(ALL_EXTENSIONS)` |
| `prune()` gọi trần | Thổi bay **381 nút** (737→355) — điểm hồi sinh, điểm tương tác, mốc `ref*` đều là nút RỖNG cố ý. Phải giới hạn `propertyTypes: [MESH, ACCESSOR]` |
| `References.js` băm tên nút qua regex `^ref(?:erence)?([^0-9]+)([0-9]+)?$` | Tên lúc chạy KHÁC tên trong file ⇒ ghép hai bộ theo tên là **lệch**, chữ dồn về cùng chỗ. Phải ghép theo **VỊ TRÍ** |
| `game.objects.add()` không gắn hình vào cảnh như tưởng | Chữ nào tạo thân vật lý xong là **biến mất**; chỉ chữ tạo HỎNG mới hiện nhờ đường lui. Phải tự giữ hình và tự đồng bộ theo thân vật lý mỗi khung |
| Thay hình học mà không co hộp va chạm | Hộp cũ rộng ~1,4m, chữ mới cách nhau 0,977m ⇒ hộp chồng nhau, Rapier hất chữ văng đi |
| Vật liệu `palette` + UV từ Blender | UV trải khắp 0..1 nên quét cả bảng màu ⇒ chữ ra **sọc cầu vồng**. Phải ép mọi đỉnh về đúng ô của chữ cũ |
| Phông gốc **Neue Montreal Bold** | Phông THƯƠNG MẠI, không có trong kho, không nhúng trong .blend. Dùng `Pally-Bold.ttf` có sẵn ở `static/fonts/` |
| CSP chặn Google Fonts | `font-src 'self' data:` ⇒ Amatic SC + Nunito không bao giờ tải, chữ rơi về phông hệ thống. KHÔNG nới CSP vì phông — dùng Pally đã tự phục vụ |
| `Game/Title.js:88` ghi đè `document.title` | Sửa mỗi `index.html` là KHÔNG đủ, tab vẫn hiện tên cũ sau vài giây |
| redirect `/playground` → `/playground/` | Next.js mặc định BỎ gạch chéo cuối ⇒ **vòng lặp vô hạn** (curl đi 5 chặng vẫn 308). Dùng thẻ `<base href>` thay thế |
| `--virtual-time-budget` của Chrome headless | **Treo vô hạn** trên trang có hoạt hình/kết nối chạy liên tục — đồng hồ ảo chỉ tiến khi trang rảnh. Đứng 17 phút ở `/academy`. Phải bọc `perl -e 'alarm N; exec @ARGV'` rồi `pkill` |
| `pkill -f "next start"` | Không khớp — tiến trình tên `next-server`. Dùng `pkill -9 -f "next-server"` |
| `vite preview` chiếm cổng rồi trả `index.html` cho MỌI đường dẫn | Phép thử ra `HTTP 200` cho file `.glb` nhưng thực ra là HTML ⇒ suýt rút kết luận từ phép thử hỏng. Luôn kiểm `Content-Type` |
| `timeout` không có trên macOS | Dùng `perl -e 'alarm N; exec @ARGV'` |

---

# 5. Giấy phép — KHÔNG được xoá

Nguồn: https://github.com/brunosimon/folio-2025 của **Bruno Simon**, **MIT**.

- **GIỮ** `playground-3d/license.md`
- **GIỮ** mục `Credits` trong `playground-3d/sources/data/consoleLog.js`
- Chi tiết: `playground-3d/ATTRIBUTION.md`

MIT cho phép sửa/phân phối lại thoải mái, điều kiện duy nhất là giữ thông báo
bản quyền. Danh tính cá nhân của tác giả (tên, ảnh, sự nghiệp, dự án, cúp giải
thưởng) **không** thuộc phạm vi MIT nên **bắt buộc** phải đổi — đã làm xong.

Nhạc: 3 bản của **Kounine**, nay **CC0**. Bản `.wav` gốc đã bỏ (130MB), mã chỉ
nạp `.mp3`.

---

# 6. Việc user đã yêu cầu, CHƯA làm

## Nâng cấp so với bản gốc (user hỏi và đã được xác nhận là làm được)

1. ~~**Nhạc nền**~~ — **ĐÃ GỠ nhạc của bản mẫu (30/7)**. Chỗ cắm nhạc riêng đã
   chừa sẵn: chép `.mp3` vào `static/sounds/musics/` rồi thêm một dòng vào
   `sources/data/musics.js`. Chỉ nhắc: phải là nhạc user có quyền dùng
   (CC0/tự làm/mua), không lấy nhạc có bản quyền của người khác
2. **Bản đồ và phong cảnh** — file Blender nguồn ở
   `scratchpad/folio-2025/resources/folio-2025.blend` (16MB). **CỐ Ý GIỮ LẠI** thay
   vì xoá, chính nhờ nó mới sửa được chữ 3D. Sửa địa hình/cây cối/công trình rồi
   xuất lại `.glb`
3. Thêm khu mới, đổi bố cục đường đua, đổi bảng màu

## Deploy

**Chưa deploy gì lên production.** Đã kiểm sẵn và đều ĐẠT:

| Hạng mục | Kết quả |
|---|---|
| Backend `tsc` | sạch |
| Frontend build | sạch |
| `sim-check` (chặn deploy) | **đạt** |
| `exam-check` (chặn deploy) | **đạt** |
| Job AI trên VPS | không có job nào chạy |
| Container | 5/5 healthy |
| Đĩa VPS | 34/49GB (73%), còn 14GB |

⚠️ **`main` tụt lại HÀNG TRĂM commit.** Toàn bộ Academy, Courses, Exam,
Simulation, Roadmap, Code Lab đều nằm trên nhánh `feat/*`, chưa từng vào `main`.
Production lâu nay chạy từ `feat/*` vì `deploy.sh` rsync thẳng thư mục làm việc.
**ĐỪNG gộp vào `main`** — không cần thiết và chỉ thêm rủi ro.

**3 commit bộ đề Node.js** (`ccee065`, `f92b82f`, `7f03921`) đã xong từ đầu phiên,
KHÔNG liên quan lỗi sân chơi, có thể deploy riêng cho học viên dùng trước.

---

# 7. Bản đồ file

```
playground-3d/                       ← fork, nguồn Vite
  sources/
    index.html                       ← màn chào + panel từ vựng + thẻ <base>
    data/projects.js                 ← 6 module học tập
    data/lab.js                      ← 8 module còn lại
    data/social.js                   ← ⚠️ TỐI THIỂU 2 mục (chia cho length-1)
    data/consoleLog.js               ← GIỮ mục Credits
    Game/World/VocabQuiz.js          ← MỚI: câu hỏi từ vựng
    Game/World/Bricks.js             ← sửa: nuốt gạch + gọi quiz
    Game/World/Areas/LandingArea.js  ← sửa: dựng chữ CUONG THAI
    Game/Title.js                    ← sửa: tên trên tab
  static/
    title/letters.glb                ← 9 chữ CUONG THAI dựng bằng Pally-Bold
    vocab/vocab-en.json              ← 1.221 từ
    career/*.png                     ← 6 nhãn sự nghiệp (mặt nạ ĐỎ=chữ, XANH=nền)
    projects/images/*.png            ← 6 ảnh thật 960x540
    lab/images/*.png                 ← 8 ảnh + 8 mini (960x540 / 240x136)
  tools/
    make-letters.py                  ← dựng chữ 3D bằng Blender
    make-career.mjs                  ← sinh 6 ảnh nhãn (tự kiểm đếm điểm đỏ/xanh)
    merge-letters.mjs                ← ghép chữ vào glb (CÁCH CŨ, đã bỏ)
  .env.development / .env.production ← ⚠️ PHẢI có trong repo (base href)

frontend/
  next.config.js                     ← rewrite + cache + header riêng /playground
  public/playground/                 ← bản dựng, chép từ playground-3d/dist
```

## Quy trình đổi nội dung

| Đổi gì | Làm gì |
|---|---|
| Chữ 3D | sửa `TEXT` trong `tools/make-letters.py`, chạy Blender headless, chép `letters.glb` |
| Nhãn sự nghiệp | sửa mảng `LABELS` trong `tools/make-career.mjs`, `node tools/make-career.mjs` |
| Ảnh module | chụp lại (xem bẫy `--virtual-time-budget`), `sips -z 540 960` |
| Từ vựng | xuất lại từ DB local cổng **5432** `cuonghoangdev_db`, bảng `lang_vocab_words` |
| Ngưỡng tông tường | `Bricks.CONSUME_FORCE = 26` |
| Khối lượng/ngưỡng chữ | `mass: 0.2`, `contactThreshold: 5` trong `LandingArea.js` |
