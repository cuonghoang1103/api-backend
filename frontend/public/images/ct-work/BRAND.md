# CT Work — bộ nhận diện (10/10/2026)

Mọi tệp trong thư mục này do script sinh ra. **Không sửa tay.**

- Hình: `frontend/src/components/work/brand/ctWorkBrand.ts`
- Chữ "CT Work" dạng đường viền: `wordmark.ts`, sinh bởi `frontend/scripts/ct-work-brand/wordmark.mjs`
- Dựng lại toàn bộ (chạy từ gốc repo): `npx tsx frontend/scripts/ct-work-brand/build.mts`

## Mark "Flow Check"

Ba phần tử trắng trên một ô squircle có gradient. Đi từ mờ tới đặc, chúng ghép thành một dấu tích:

| Phần tử | Độ đặc | Nghĩa |
|---|---|---|
| Chấm | 55% | Thẻ **To do** đang chờ |
| Nét ngắn | 78% | **In progress** |
| Nét dài | 100% | **Done** |

Ý của mark: việc chảy qua bảng rồi về đích.

### Vì sao chọn phương án này

Có 4 phương án; bảng so sánh nằm trong ảnh của đợt brand.

| Phương án | Kết luận | Lý do |
|---|---|---|
| A · Board Check — 3 cột kanban kèm dấu tích nhỏ (nâng từ bản UX-D) | Loại | Ở 16 px, ba cột và dấu tích dính thành một vệt; dấu tích quá nhỏ để đọc ra |
| B · CT Monogram — chữ C ôm chữ T | Loại | Vẫn là "chữ trong ô" — đúng thứ người dùng chê ở ô "CT" cũ. Ở 16 px chỉ còn một chữ C |
| C · Kanban Tick — đỉnh 3 cột vẽ thành dấu tích | Loại | Ý hay, nhưng ở 16–32 px đọc thành chữ "M" hoặc biểu đồ cột |
| **D · Flow Check** | **Chọn** | Xem bốn lý do dưới |

Bốn lý do chọn D:

1. Dấu tích là hình rõ nhất ở 16 px.
2. Chấm và độ mờ tăng dần kể được câu chuyện kanban (To do → In progress → Done) mà không cần vẽ cột.
3. Có chiều sâu kiểu icon iOS: gradient, ánh sáng trên, bóng dưới, glyph đổ bóng.
4. Có bản một màu sạch: khoét rỗng hoặc chỉ glyph.

## Màu

| Tên | Hex | Dùng |
|---|---|---|
| Violet | `#8a63ff` | Góc trên-trái của gradient |
| Indigo | `#4f5bd5` | Giữa gradient. Bằng `--w-accent` (sáng) của CT Work. Màu nền đặc khi cần một màu |
| Azure | `#2299e0` | Góc dưới-phải của gradient |
| Ink | `#16182d` | Chữ "CT Work" trên nền sáng; màu bản một màu |
| Paper | `#f4f5ff` | Chữ "CT Work" trên nền tối |
| Shade | `#15124d` | Bóng (không dùng đen thuần — đen làm gradient bẩn) |

- Gradient đi chéo 135°, từ trên-trái xuống dưới-phải.
- Glyph luôn trắng trên ô màu.

## Chữ

- **CT**: Inter ExtraBold 800.
- **Work**: Inter SemiBold 600.
- Khoảng chữ −0.012em. Chữ đã chuyển thành đường viền, nên không phụ thuộc phông của máy.
- Viết đúng: **CT Work**. Có dấu cách, C và T viết hoa, "Work" viết hoa chữ W.
- Tên đầy đủ: "CT Work by CuongThai". Phần "by CuongThai" dùng chữ thường, màu phụ, không nằm trong logo.

## Khoảng an toàn và kích thước tối thiểu

**Khoảng trống quanh mark:** tối thiểu ¼ cạnh mark. Ví dụ: mark 32 px cần 8 px trống mỗi phía.

**Logo ngang:**

- Chữ hoa cao bằng 40% mark.
- Mark cách chữ ¼ cạnh mark.
- Đừng tự ghép lại; dùng `ct-work-logo*.svg`.

**Kích thước tối thiểu:**

| Loại | Tối thiểu |
|---|---|
| Mark màu | 16 px. Từ 24 px trở xuống tự dùng glyph cỡ nhỏ: bỏ chấm, nét dày hơn |
| Mark có chấm | 26 px |
| Logo ngang | Cao 20 px. Nhỏ hơn thì chỉ dùng mark |

## Tệp

| Tệp | Dùng cho |
|---|---|
| `ct-work-mark.svg` / `-dark.svg` | Mark màu, nền sáng / nền tối (bản tối có viền sáng rõ hơn) |
| `ct-work-mark-mono.svg` / `-mono-white.svg` | Một màu: ô đặc, glyph khoét rỗng. Dùng để in, khắc, hoặc khi chỉ được dùng một màu |
| `ct-work-glyph.svg` | Chỉ dấu tích, một màu, không ô |
| `ct-work-logo.svg` / `-dark.svg` | Mark + "CT Work", nền sáng / nền tối |
| `ct-work-logo-mono*.svg` | Logo một màu |
| `icon.svg` | Favicon SVG (glyph cỡ nhỏ) |
| `favicon.ico` | Favicon 16 / 32 / 48 |
| `favicon-32.png` | Favicon PNG 32 px |
| `apple-touch-icon.png` | 180 px, vuông tràn viền, nền đặc — iOS tự bo góc. Đừng bo sẵn |
| `icon-192.png`, `icon-512.png` | PWA (`purpose: any`): squircle trên nền trong suốt |
| `icon-maskable-512.png` | PWA maskable: tràn viền, glyph trong vùng an toàn 80% |
| `work.webmanifest` | Manifest của `/work` (scope `/work`) |
| `ct-work-app-icon-{1024,512,192,180}.png` | Icon app kiểu iOS/macOS (squircle + bóng, nền trong suốt). Cho slide, trang giới thiệu, cửa hàng |
| `ct-work-email-96.png` | Header email (hiện ở 28 px): vuông tràn viền, nền đặc, bo bằng CSS 6 px |
| `ct-work-logo-email.png` | Logo ngang 2×, nền trắng đặc. Cho email/tài liệu không đọc được SVG |
| `ct-work-mark-112.png` | Ảnh OG (Satori không vẽ được filter SVG) |
| `ct-work.svg`, `ct-work-{32,96,180,512}.png` | Tên cũ (UX-D), giữ lại vì thư đã gửi và app bản cũ còn trỏ tới. Nay mang hình mới |

### Tệp nào không đọc được SVG, tệp nào dùng ở đâu

- **Email:** chỉ dùng PNG. Gmail và Outlook không hiện SVG.
- **Giao diện React:** dùng component `CtWorkMark` (`components/work/brand/CtWorkMark.tsx`), không dùng `<img>`. Component vẽ SVG nội tuyến, nên:
  - chạy đúng trong app desktop (`app://` làm vỡ đường dẫn tương đối — xem `anhTuyetDoi`);
  - có logo động.

### Đổi favicon

Phải đổi URL: dùng tên tệp mới hoặc tăng `?v=` trong `app/work/layout.tsx`. Trình duyệt giữ favicon theo URL rất lâu, nên chỉ đổi nội dung tệp thì tab vẫn hiện icon cũ.

## Logo động (`CtWorkMark`)

| `animate` | Dùng ở | Hiệu ứng |
|---|---|---|
| `loop` | Màn tải `/work` | Chấm bật lên → nét ngắn → nét dài; ô nảy nhẹ khi xong; mờ dần; lặp mỗi 2,6 s |
| `intro` | Trạng thái trống (màn chào), trang mời | Vẽ một lần, khoảng 0,8 s |
| `hover` | Ô logo ở sidebar | Vẽ lại khi rê chuột vào chính nó hoặc phần tử cha có class `ctw-mark-host` |

- Chỉ dùng CSS: `transform`, `opacity`, `stroke-dashoffset`. Không dùng thư viện.
- Khi người dùng bật `prefers-reduced-motion`, mọi hiệu ứng tắt và logo hiện tĩnh, đầy đủ. Trạng thái gốc luôn là hình hoàn chỉnh.

## Dùng đúng / sai

**Đúng:**

- Đặt mark màu trên nền trắng, xám nhạt, hoặc nền tối của `theme-dark`.
- Giữ nguyên tỉ lệ.
- Chừa khoảng an toàn.
- Dùng bản một màu khi chỉ in được một màu.

**Sai:**

- Kéo méo, xoay, hoặc đổi màu gradient.
- Đặt mark màu lên ảnh hay nền rực cùng tông tím/xanh. Trường hợp này dùng bản một màu trắng.
- Thêm viền, bóng ngoài, hoặc bo thêm góc. Riêng `apple-touch-icon` thì iOS tự bo.
- Đổi thứ tự hoặc độ mờ của ba phần tử glyph.
- Đặt chữ "CT" vào trong ô. Ô chữ "CT" là bản cũ, đã thay.
- Gõ lại chữ "CT Work" bằng phông khác để ghép thành logo.
