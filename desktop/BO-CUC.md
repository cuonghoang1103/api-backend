# Bố cục app desktop — luật bắt buộc cho MỌI trang

> Người dùng báo cùng một lỗi ba lần ở ba trang khác nhau: thu nhỏ cửa sổ thì
> thanh công cụ bị cắt, nút bấm biến mất. Mỗi lần lại phải sửa tay một trang.
> Tài liệu này + `npm run do:bo-cuc` tồn tại để không có lần thứ tư.

## Chạy trước khi thêm trang mới

```bash
npm run do:bo-cuc
```

Nó mở TỪNG trang thật ở bốn bề rộng cửa sổ (1440 · 1180 · 1000 · 860) rồi hỏi
đúng một câu: **có nút/ô nhập nào lọt ra ngoài khung không?** Đỏ là chưa xong.

Thêm trang mới thì thêm đường dẫn của nó vào mảng `DUONG` trong
`scripts/do-bo-cuc.mjs`.

## Bốn luật

### 1. Mọi flex item chứa nội dung trang phải có `min-width: 0`

Mặc định của flex item là `min-width: auto` — **không được co nhỏ hơn nội
dung**. Một hàng tab hay một thanh công cụ đủ dài sẽ đẩy cả cột phình rộng hơn
cửa sổ, và tổ tiên có `overflow: hidden` sẽ **cắt** chứ không cuộn.

```css
.ct-mot-cot { flex: 1; min-height: 0; min-width: 0; }   /* ✅ */
.ct-mot-cot { flex: 1; min-height: 0; }                 /* ❌ sẽ cắt mép phải */
```

⚠️ `overflow: hidden` ở tổ tiên **không phải bản vá** — nó chỉ đổi từ "đẻ thanh
cuộn ngang" sang "cắt im lặng". Cắt im lặng khó phát hiện hơn.

### 2. Mọi hàng nút phải `flex-wrap: wrap`

Thanh công cụ, hàng chip lọc, `.ct-page-head`. Không có nó thì ở cửa sổ hẹp
các nút bị nén rồi tràn.

Và **đừng** dùng `flex-basis: 100%` cho phần đệm giữa hai nhóm nút: nó ÉP xuống
dòng, tức là thêm một hàng chứ không tiết kiệm. Đo thật ở cột rộng 460px: có
luật đó → 3 hàng/106px, bỏ đi → 2 hàng/95px.

### 3. Đo bề rộng bằng `@container`, KHÔNG bằng `@media`

`@media` đo **cửa sổ**. Nhưng nội dung nằm trong cột giữa, và cột ấy còn bị
thanh bên app (240px) cộng thanh bên của trang (~250px) ăn mất. Cửa sổ 1400px
thì cột chỉ còn ~860px — ngưỡng `@media (max-width: 1000px)` **không bao giờ
chạm tới đúng lúc cần nó**.

```css
.ct-cot { container-type: inline-size; container-name: cot; }
@container cot (max-width: 620px) { .ct-nut { font-size: 0; } }
```

⚠️ Đặt `container-type` lên đúng phần tử chứa thứ cần co. Đo thật: đặt nó trên
`.ct-chedo` làm chính nó tụt từ 1051px xuống 352px; trên `.ct-agent` thì không.

### 4. Thứ dài vô hạn thì cho CUỘN, đừng cho tràn

Hàng tab, dải chip, bảng rộng: `overflow-x: auto`. Cuộn được thì không mất;
tràn ra rồi bị cắt mới là mất.

## Bộ đo này KHÔNG bắt được gì

Nói ra để không ai tin nhầm nó là bảo chứng toàn phần:

- **Trạng thái cần thao tác.** Trang mới mở của `/chat` chỉ có MỘT tab, mà lỗi
  cần bốn tab mới lộ — bản đầu của bộ đo báo XANH ngay cả khi đã gỡ bản vá.
  Trang nào có trạng thái "đông" hơn thì phải khai bước đưa nó tới đó trong
  bảng `CHUAN_BI`.
- **Trang Ghi chú.** Nó nhúng cây Notes của web; bản đo không có dữ liệu ghi
  chú nên thanh công cụ của trình soạn thảo chưa hề vẽ ra. Phần đó phải kiểm
  bằng tay, hoặc bằng bản web.
- **Màu, khoảng cách, chữ.** Bộ này chỉ trả lời một câu: ở cửa sổ hẹp còn nhìn
  thấy và bấm được mọi thứ không.
