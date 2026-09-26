---
name: giao-dien-web
description: Làm/sửa giao diện web đẹp, responsive, chế độ tối, accessibility — và tự kiểm bằng trình duyệt + ảnh chụp.
---

# KỸ NĂNG: GIAO DIỆN WEB — đẹp, nhất quán, dùng được, và ĐÃ NHÌN tận mắt

Mục tiêu: trang hiển thị đúng ở điện thoại lẫn máy tính, sáng lẫn tối, có dữ liệu lẫn không có dữ liệu, dùng được bằng
bàn phím — và bạn đã MỞ NÓ LÊN NHÌN sau khi sửa, không phải đọc mã rồi đoán.

## 0. Luật vàng (đọc trước mọi thứ)

1. **Không kết luận "đẹp rồi / đã sửa" khi chưa nhìn.** `tsc` xanh, build xanh chỉ nói mã biên dịch được. Bố cục, màu,
   chữ tràn, nút bị che chỉ thấy bằng mắt. Chưa chụp được ⇒ nói thẳng "tôi chưa nhìn thấy kết quả", đưa bước để người dùng xem.
2. **Làm theo hệ thống thiết kế có sẵn của dự án.** Đọc trước: `tailwind.config.*` / khối `@theme` (Tailwind v4), `globals.css`,
   biến CSS ở `:root`, thư mục `components/ui` (shadcn), vài trang đang đẹp nhất. Dùng lại màu, cỡ chữ, bo góc, khoảng cách,
   component đã có. Không thêm thư viện UI thứ hai, không mã màu hex lẻ tẻ khi dự án đã có token.
3. **Mobile-first.** Viết cho màn hẹp trước, mở rộng bằng `sm: md: lg:` / `@media (min-width: ...)`. Kiểm tối thiểu 3 bề rộng:
   **375px** (điện thoại), **768px** (máy tính bảng), **1280px** (máy tính).
4. **Sửa nhỏ, nhìn lại, sửa tiếp.** Mỗi vòng: sửa → tải lại → chụp → so với mong muốn. Đừng dồn 10 thay đổi rồi mới nhìn.

## 1. Vòng tự kiểm bằng trình duyệt (làm MỖI lần sửa giao diện)

**Bước 1 — bật dev server bằng lệnh NỀN** (nó không tự dừng; `run_command` sẽ treo):
- `chay_lenh_nen` với `npm run dev` (Next/Vite), `php artisan serve`, `dotnet watch run`, `python manage.py runserver`…
- Đợi vài giây rồi `doc_dau_ra_nen` — tìm dòng kiểu `Local: http://localhost:5173` / `ready on http://localhost:3000`.
  Thấy `EADDRINUSE`/"port is already in use" ⇒ đã có server chạy sẵn ở cổng đó: dùng luôn nó (hỏi nếu không chắc là của dự án này)
  hoặc cổng khác. Đã có server của người dùng đang chạy thì đừng bật thêm cái thứ hai.

**Bước 2 — mở và nhìn** (khi phiên có quyền trình duyệt):
- `web_mo` với `http://localhost:<cổng>/<trang>` — người dùng thấy trang cùng lúc với bạn.
- `web_console` — ĐỌC TRƯỚC khi đánh giá hình: lỗi JS, hydration mismatch, 404 tài nguyên, cảnh báo `key`. Trang trắng mà console
  có lỗi ⇒ sửa lỗi đó trước, bố cục tính sau.
- `web_anh` — chụp để nhìn bố cục/màu/khoảng cách. `web_doc` — rẻ hơn khi chỉ cần kiểm chữ/nội dung có hiện không.
- `web_bam`/`web_go` để thử menu, dropdown, modal, form (người dùng duyệt từng lần; KHÔNG gõ mật khẩu thật).
- `web_anh` báo cổng không nhận ảnh ⇒ đừng đoán bố cục; dùng `web_doc` + `web_console` và nói rõ phần nào chưa nhìn được.

**Bước 3 — chụp nhiều bề rộng và chế độ tối.** Khung trình duyệt của app có bề rộng cố định theo bố cục cửa sổ, nên để có đúng
375/768/1280px hãy chụp bằng Playwright CLI rồi xem ảnh bằng `read_file` (nó đọc được `.png`):
```bash
npx -y playwright install chromium        # một lần mỗi máy; tải trình duyệt (~150MB) — báo người dùng trước
npx -y playwright screenshot --viewport-size=375,812  --full-page --wait-for-timeout=1500 http://localhost:3000/ /tmp/ui-375.png
npx -y playwright screenshot --viewport-size=768,1024 --full-page --wait-for-timeout=1500 http://localhost:3000/ /tmp/ui-768.png
npx -y playwright screenshot --viewport-size=1280,800 --full-page --wait-for-timeout=1500 http://localhost:3000/ /tmp/ui-1280.png
npx -y playwright screenshot --viewport-size=375,812 --color-scheme=dark --wait-for-timeout=1500 http://localhost:3000/ /tmp/ui-375-dark.png
```
Windows: thay `/tmp/...` bằng `$env:TEMP\ui-375.png`. Lưu ảnh NGOÀI thư mục dự án để không lọt vào commit.
Trang cần đăng nhập ⇒ CLI này không có phiên: dùng `web_mo`/`web_anh` (khung app có phiên người dùng), hoặc nhờ người dùng
chỉ trang công khai tương đương. Dự án không cài được Playwright ⇒ dùng `web_anh` ở khung app và nói rõ đã kiểm ở bề rộng nào.

**Bước 4 — xong việc:** `dung_lenh_nen` server mình đã bật (trừ khi người dùng muốn giữ), chạy `tsc`/lint/build của dự án.
Next.js: `npm run build` là nguồn sự thật cuối (nhiều dự án tắt lint lúc build — chạy `npm run lint` riêng).

Nhìn ảnh với danh sách này: chữ có tràn/đè/bị cắt không · có thanh cuộn ngang không (dấu hiệu tràn chiều rộng) · khoảng cách đều
và thẳng hàng không · nút bấm đủ lớn trên mobile (~44px) · ảnh méo/vỡ không · chế độ tối có chữ đen trên nền đen không ·
trạng thái rỗng/lỗi trông có chủ đích không.

## 2. Bố cục và responsive

- Dùng flex/grid, không `position: absolute` để dàn trang. Lưới thẻ tự co giãn:
  ```css
  .luoi { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); }
  ```
  Tailwind: `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Khung nội dung: `max-width` (~1200px) + `margin-inline: auto` + đệm hai bên (`px-4 sm:px-6`). Đoạn văn dài ≤ ~70 ký tự/dòng (`max-w-prose`).
- Không đặt chiều rộng cố định bằng px cho khối lớn; dùng `max-width`, `%`, `min()`, `clamp()`. Chữ tiêu đề co giãn:
  `font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem)`.
- Bảng rộng trên mobile: bọc `overflow-x: auto` cho riêng bảng, hoặc đổi thành thẻ xếp dọc ở màn hẹp.
- Ảnh: `max-width: 100%; height: auto;` và luôn có `width`/`height` (hoặc `aspect-ratio`) để không nhảy bố cục.

## 3. Hệ thống thiết kế: token, màu, chữ, khoảng cách

```css
:root {
  --bg: #ffffff; --surface: #f6f7f9; --text: #111827; --text-muted: #4b5563;
  --border: #e5e7eb; --primary: #2563eb; --primary-fg: #ffffff; --danger: #dc2626;
  --radius: 10px; --space: 4px;                 /* mọi khoảng cách là bội số: 4, 8, 12, 16, 24, 32, 48 */
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0b0f17; --surface: #121826; --text: #e5e7eb; --text-muted: #9ca3af; --border: #1f2937; }
}
:root[data-theme="dark"] { --bg: #0b0f17; --surface: #121826; --text: #e5e7eb; --text-muted: #9ca3af; --border: #1f2937; }
body { background: var(--bg); color: var(--text); }
```
- Một màu nhấn chính, dùng dè sẻn cho hành động quan trọng. Màu nghĩa (đỏ lỗi, xanh thành công) nhất quán cả trang.
- Chế độ tối: đổi token, không viết lại từng component. Bề mặt tối cần có `background` thật (không chỉ khai biến rồi quên gán).
  Tailwind: kiểm dự án dùng `darkMode: 'class'`/`'media'` (v3) hay `@custom-variant dark` (v4) trước khi viết `dark:`. Kiểm cả
  hai chế độ bằng ảnh chụp.
- Chữ: tối đa 2 họ phông; thang cỡ rõ (12/14/16/20/24/32); thân bài ≥ 16px trên mobile (ô input < 16px làm iOS tự phóng to);
  `line-height` 1.5 cho đoạn văn. Phông Google cho tiếng Việt phải có subset `vietnamese`, không dấu sẽ rơi sang phông khác.
- Phân cấp bằng cỡ/đậm/màu/khoảng trắng — không phải bằng thêm viền và khung khắp nơi.

## 4. Trạng thái: tải, rỗng, lỗi, thành công

Mọi khối lấy dữ liệu cần đủ 4 trạng thái:
```tsx
if (isLoading) return <DanhSachSkeleton />;                          // khung xám cùng kích thước, tránh nhảy bố cục
if (error) return <ThongBaoLoi message="Không tải được đơn hàng." onRetry={refetch} />;
if (!data?.length) return <TrangRong title="Chưa có đơn hàng" action={<Link href="/shop">Mua sắm ngay</Link>} />;
return <DanhSach items={data} />;
```
Nút gửi: disable + hiện "Đang lưu…" khi đang chờ (chặn bấm hai lần); xong thì báo (toast/thông báo tại chỗ). Lỗi nói cho người dùng
biết làm gì tiếp, không in stack trace. Kiểm trạng thái rỗng/lỗi bằng cách THỬ thật (tắt backend, tài khoản mới không có dữ liệu).

## 5. Form

- Mỗi ô có `<label htmlFor>` thật (placeholder không thay nhãn). Đúng `type` (`email`, `tel`, `number`, `password`) và
  `autocomplete` (`email`, `current-password`, `new-password`) ⇒ bàn phím mobile đúng và trình quản lý mật khẩu hoạt động.
- Validate khi rời ô hoặc khi gửi, không la lỗi khi người dùng mới gõ ký tự đầu. Lỗi hiện ngay dưới ô:
  ```tsx
  <label htmlFor="email">Email</label>
  <input id="email" type="email" autoComplete="email" aria-invalid={!!err} aria-describedby={err ? 'email-err' : undefined} />
  {err && <p id="email-err" role="alert" className="text-sm text-red-600">{err}</p>}
  ```
- Validate lại ở server — validate client chỉ để tiện. Dùng thư viện dự án đang dùng (react-hook-form + zod, Formik…).
- Gõ tiếng Việt (IME Telex/VNI): xử lý Enter-để-gửi phải bỏ qua khi đang soạn chữ (`if (e.nativeEvent.isComposing) return;`),
  không thì gửi mất nửa chữ.

## 6. Accessibility (không phải tuỳ chọn)

- Phần tử bấm được là `<button>` hoặc `<a href>`, không `<div onClick>`. Nút chỉ có icon ⇒ `aria-label="Đóng"`.
- Ảnh có `alt` mô tả; ảnh trang trí `alt=""`.
- Tương phản chữ thường ≥ **4.5:1**, chữ lớn (≥ 24px hoặc ≥ 18.7px đậm) ≥ 3:1. Xám nhạt trên trắng hay trượt — kiểm bằng công cụ
  đo tương phản, cả ở chế độ tối.
- Điều khiển được bằng bàn phím: Tab đi đúng thứ tự, Enter/Space kích hoạt, Esc đóng modal/menu, focus bị giữ trong modal và trả về
  nút mở khi đóng. Không `outline: none` mà không thay bằng `:focus-visible` rõ ràng.
- `aria-*` chỉ khi HTML gốc không diễn đạt được. Component phức tạp (dialog, dropdown, tabs, combobox) ⇒ dùng Radix/shadcn/Headless UI
  thay vì tự viết — chúng đã đúng bàn phím và aria.
- Thông tin không chỉ truyền bằng màu (lỗi: màu đỏ + chữ/icon). Tôn trọng `prefers-reduced-motion` cho animation lớn.

## 7. Hiệu năng giao diện

- Ảnh: định dạng hiện đại (WebP/AVIF), đúng kích thước hiển thị, `loading="lazy"` cho ảnh dưới màn hình đầu; ảnh chính (LCP)
  thì không lazy. Next.js: `next/image` với `width`/`height` hoặc `fill` + khung có kích thước; `sizes` khi responsive.
- Tránh layout shift: đặt chỗ trước cho ảnh, quảng cáo, skeleton cùng kích thước nội dung thật; phông dùng `font-display: swap`.
- Danh sách rất dài ⇒ phân trang hoặc ảo hoá. Thư viện nặng (biểu đồ, trình soạn thảo, 3D) ⇒ tải động (`next/dynamic`, `import()`).
- Next.js App Router: giữ component là Server Component khi được; chỉ thêm `'use client'` cho phần có state/sự kiện.

## 8. Tailwind / CSS Modules / shadcn

- Tailwind chỉ sinh class nó ĐỌC ĐƯỢC NGUYÊN VĂN trong mã: `bg-${mau}-500` KHÔNG hoạt động. Dùng bảng tra
  `{ do: 'bg-red-500', xanh: 'bg-green-500' }[mau]`. Class mới không ăn ⇒ kiểm đường dẫn `content` (v3) / `@source` (v4).
- Gộp class có điều kiện bằng `cn()` (clsx + tailwind-merge) nếu dự án có — tránh hai class xung đột cùng thuộc tính.
- CSS Modules: tên class dùng camelCase để gọi `styles.tenClass`; đừng trộn global và module cho cùng một phần tử.
- shadcn: thêm component bằng `npx shadcn@latest add <ten>` (kiểm `components.json` có sẵn); sửa trong `components/ui` là sửa cho cả app.
- Quy tắc CSS kiểu `.khoi > *` hay `* { ... }` rộng tay ⇒ đè lên mọi con, kể cả component thư viện. Nhắm hẹp.

## 9. Bẫy đã gặp thật — kiểm trước khi kết luận "xong"

- **`overflow: hidden` ở khối cha cắt mất dropdown/tooltip/menu.** Sửa: render lớp nổi qua portal (`createPortal`, Radix/shadcn đã làm sẵn)
  hoặc bỏ `overflow: hidden` ở tổ tiên. Kiểm bằng cách MỞ menu rồi chụp.
- **Flex item thiếu `min-width: 0`** (`min-w-0`) ⇒ chữ dài/URL/khối code đẩy tràn cả hàng, sinh cuộn ngang trên mobile. Thêm `min-w-0`
  cho phần tử co giãn và `overflow-wrap: anywhere`/`truncate` cho chữ. Grid tương tự: `minmax(0, 1fr)`.
- **`100vh` trên mobile** cao hơn vùng nhìn thấy (thanh địa chỉ) ⇒ nút đáy bị che. Dùng `100dvh` (`h-dvh`), có `100vh` làm dự phòng.
- **z-index không ăn**: phần tử cha có `transform`, `filter`, `opacity < 1`, `position` + `z-index` tạo stacking context mới — z-index con
  chỉ so trong context đó. Sửa bằng portal hoặc chỉnh z-index ở tầng cha, đừng leo thang `z-[99999]`.
- **Hydration mismatch (Next.js/SSR)**: render khác nhau giữa server và client — `new Date()`, `Math.random()`, `window`/`localStorage`
  trong lúc render, định dạng ngày theo múi giờ máy, HTML lồng sai (`<div>` trong `<p>`), extension trình duyệt chèn thuộc tính. Đọc
  `web_console`. Sửa: đưa phần phụ thuộc trình duyệt vào `useEffect`, hoặc `dynamic(..., { ssr: false })`. `suppressHydrationWarning` chỉ
  dành cho một nút chữ thời gian, không phải thuốc chữa chung.
- **Thanh cuộn ngang bí ẩn**: một phần tử `width: 100vw` (không trừ thanh cuộn), ảnh không `max-width`, hoặc `right: 100%` ở chỗ sai. Tìm nó
  bằng ảnh chụp 375px, rồi thu hẹp dần.
- **Cột `position: sticky` không dính**: tổ tiên có `overflow` khác `visible`, hoặc cột không có `max-height` + `overflow-y: auto` riêng.
- **Class `dark:` bật sai chỗ**: một lớp `.dark` gắn ở `<html>` kích hoạt mọi `dark:` trong app — kiểm dự án dùng tên class chủ đề nào trước khi thêm.
- **Đổi file trong `public/` mà dev/prod server cũ vẫn trả 404** — một số server chốt danh sách file lúc khởi động. Khởi động lại server trước khi kết luận.
- **Video/ảnh ngang bị khung dọc cố định** ⇒ viền đen lớn. Khung theo tỉ lệ thật của media (`aspect-ratio`), khung dọc chỉ cho media dọc.

## 10. Việc KHÔNG tự làm khi chưa được đồng ý

Đổi toàn bộ phong cách/màu thương hiệu, thay hoặc thêm thư viện UI/framework CSS, xoá trang/component, sửa component dùng chung
(`components/ui`, layout gốc) theo cách đổi giao diện của trang khác, bấm vào nút có tác dụng thật (xoá, thanh toán, gửi) trong trình duyệt
đang đăng nhập phiên thật, tải cài Playwright/trình duyệt lớn mà chưa báo.

## 11. Báo cáo cuối

Đã đổi gì (file), đã NHÌN ở đâu: bề rộng nào, sáng/tối, trạng thái nào (có dữ liệu/rỗng/lỗi), console có lỗi không — kèm đường dẫn ảnh
chụp nếu có. Nói rõ phần CHƯA kiểm được (trang cần đăng nhập, trình duyệt Safari/iOS thật, dữ liệu dài bất thường) và server nền nào vẫn đang chạy.
