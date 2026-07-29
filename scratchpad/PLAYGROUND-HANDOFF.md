# Bàn giao — Sân chơi 3D `/playground` (fork folio-2025)

Cập nhật 30/7/2026. Nhánh `feat/playground-3d`. **CHƯA deploy lên production.**

---

# ⚑ ĐỌC MỤC NÀY TRƯỚC

## Lỗi duy nhất còn lại

**Thế giới kẹt mãi ở màn hình vòng tròn, không vào được.** Không ném lỗi nào
đáng kể, không 404 nào.

| Môi trường | Loại | Kết quả |
|---|---|---|
| `localhost:5173` | Vite **dev** | **CHẠY ĐƯỢC** (user đã chơi, lái xe, tông tường) |
| `localhost:3000/playground` | bản **build** + Next.js | **ĐƠ** (user xác nhận) |
| `localhost:4173/playground/` | bản **build** + server tĩnh, KHÔNG header | **CHƯA AI THỬ TRÊN TRÌNH DUYỆT THẬT** |

### VIỆC ĐẦU TIÊN PHẢI LÀM

Nhờ user mở **cả hai** địa chỉ rồi báo kết quả:

```bash
# Next.js
cd frontend && npm run start        # rồi mở http://localhost:3000/playground

# server tĩnh, không Next.js, không header nào
rm -rf /tmp/pgserve && mkdir -p /tmp/pgserve
cp -R playground-3d/dist /tmp/pgserve/playground
cd /tmp/pgserve && python3 -m http.server 4173
# rồi mở http://localhost:4173/playground/
```

| Kết quả | Kết luận | Việc tiếp |
|---|---|---|
| Cả hai chạy | Thủ phạm là **rút gọn mã khi build** — đã tắt `minify` ở `playground-3d/vite.config.js` | Tinh chỉnh lại minify cho gói nhẹ hơn thay vì tắt hẳn (gói JS đang 6,2MB thay vì 4,9MB) |
| `:4173` chạy, `:3000` đơ | Thủ phạm là **Next.js** | Dò tiếp: `nosniff`, `Cache-Control`, hoặc thử bỏ HẲN mọi header cho `/playground` |
| Cả hai đơ | Không phải hai thứ trên | Hướng mới: so bản dev vs build ở tầng mã, hoặc chạy `vite build --mode development` |

## ⚠️ ĐỪNG LẶP LẠI SAI LẦM CỦA PHIÊN NÀY

Phiên này đoán sai **NĂM lần** về nguyên nhân lỗi đơ. Nguyên nhân chung:
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

### Năm nghi phạm ĐÃ LOẠI bằng phép thử (đừng thử lại)

1. **CSP thiếu `blob:` ở `connect-src`** — thêm rồi, vẫn lỗi
2. **`upgrade-insecure-requests`** — tắt rồi, vẫn lỗi (đã khôi phục)
3. **Service worker can thiệp** — `getRegistrations()` trả về 0
4. **Kiểu nội dung WASM sai + `nosniff`** — cả hai server đều `application/wasm`
5. **File truyền bị hỏng/nén sai** — cùng mã băm `d29f11a2…` ở đĩa, `:3000`, `:4173`

### Số đo đã có

- `:4173` (tĩnh) tải **115** tài nguyên, `:3000` (Next) dừng ở **108** → Next làm đứt sớm 7 bước
- Bản **dev** tải 250 (nhiều hơn vì không gộp file, không so trực tiếp được)
- `fetch(blob:)` **OK** trên `:4173`, **bị chặn** trên `:3000` — nhưng CSP đã cho phép `blob:`
- `img(blob)` lỗi ở **cả hai** → đó là vì blob thử chỉ 8 byte, KHÔNG phải triệu chứng

---

# 1. Trạng thái mã

## Ba commit đã có trên nhánh `feat/playground-3d`

| Commit | Nội dung |
|---|---|
| `548f4a0` | Fork folio-2025 vào `playground-3d/` (1021 file, 54MB) |
| `692f362` | Nhúng vào `/playground` trên Next.js |
| `a7b21e8` | Ảnh thật 14 module (22 file, chụp từ production) |

## Chưa commit

- `frontend/next.config.js` — bộ header riêng cho `/playground` (**đáng giữ**, xem mục 3)
- `playground-3d/vite.config.js` — `minify: false` (**thử nghiệm**, chưa kiểm chứng)
- `frontend/public/playground/` — bản dựng mới không rút gọn

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

1. **Nhạc nền** — thay bằng nhạc user chọn. Chỉ nhắc: phải là nhạc user có quyền
   dùng (CC0/tự làm/mua), không lấy nhạc có bản quyền của người khác
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
