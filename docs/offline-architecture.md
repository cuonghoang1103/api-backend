# Kiến trúc ngoại tuyến — CuongThai Desktop

> Trạng thái: **Phase 3 xong**. Máy móc đã dựng và có test (26/26).
> **Chưa nối máy chủ** — `transport` là `null` cho tới Phase 4.

---

## Quy tắc tối cao

> **Không bản ghi nào được chuyển sang `synced` trước khi máy chủ xác nhận.**

Mọi thứ còn lại chỉ là chi tiết. Cái này sai thì người dùng tin là đã lưu trong
khi dữ liệu chưa bao giờ rời khỏi máy họ.

---

## Hai bảng, hai mức quan trọng khác hẳn nhau

| Bảng | Chứa gì | Mất thì sao |
|---|---|---|
| `cache` | bản sao dữ liệu **của máy chủ** | không sao, tải lại được |
| `queue` | thao tác **của người dùng** chưa gửi được | **mất dữ liệu thật**, không lấy lại được |

Vì thế mọi thao tác dọn dẹp tự động chỉ đụng `cache`. Nút xoá nào quét cả hai
bảng đều phải hỏi lại, kèm **số lượng mục sắp mất**.

---

## Tách dữ liệu theo người dùng

Mọi bản ghi mang `userId`, mọi truy vấn đi qua chỉ mục ghép bắt đầu bằng
`userId`. `AppState.userId` có kiểu `number | null` — không phải `number` với
mặc định `0` — để kiểu dữ liệu **buộc** mọi chỗ dùng phải xử lý trường hợp chưa
đăng nhập, thay vì âm thầm ghi vào "người dùng số 0".

Không dùng mỗi tài khoản một database: đổi tài khoản sẽ phải mở/đóng database
bất đồng bộ, và có khoảng thời gian truy vấn chạy trên database cũ.

---

## Tầng cache

Stale-while-revalidate: trả ngay bản đã lưu (kể cả cũ) để giao diện có nội dung,
đồng thời gọi mạng nền để làm mới.

Mỗi kết quả kèm `isStale` và `cachedAt` — màn hình phải hiển thị được "cập nhật
2 giờ trước". **Giấu chuyện dữ liệu đã cũ là điều không được làm.**

| Tình huống | Hành vi |
|---|---|
| Có cache, còn hạn | trả cache, không gọi mạng |
| Có cache, đã cũ, **có mạng** | trả cache ngay + làm mới nền |
| Có cache, đã cũ, **mất mạng** | trả cache, đánh dấu cũ, **không** ném lỗi |
| Không cache, mất mạng | ném `OfflineUnavailableError` — thật sự không có gì để hiện |
| Làm mới nền thất bại | ghi log, **giữ nguyên** bản cũ |

Hết hạn mức lưu trữ: dọn 50 mục cũ nhất rồi ghi lại một lần. Vẫn hỏng thì bỏ
qua việc ghi cache — cache là thứ tăng tốc, không phải thứ bắt buộc.

Dọn định kỳ **chỉ theo tuổi** (30 ngày), không theo dung lượng: IndexedDB không
cho biết kích thước từng bản ghi nên mọi ước lượng đều là đoán.

---

## Hàng đợi đồng bộ

Bốn cơ chế, mỗi cái chống một kiểu hỏng:

### 1. Idempotency key — chống nhân đôi

Sinh **một lần** lúc xếp hàng, giữ nguyên qua **mọi** lần thử lại.

Máy chủ ghi xong nhưng phản hồi lạc đường là chuyện thường. Client thấy timeout
và thử lại; nếu không có khoá này thì máy chủ ghi lần hai — tin nhắn nhân đôi.
Sinh khoá mới ở mỗi lần thử lại thì vô dụng y như không có.

### 2. Gộp trùng lúc xếp hàng — chống phình hàng đợi

Sửa một bản nháp 40 lần khi offline phải ra **1** việc mang nội dung mới nhất.

Ba luật gộp, mỗi luật chống một lỗi cụ thể:

| Tình huống | Kết quả | Vì sao |
|---|---|---|
| `update` × N | 1 việc, nội dung mới nhất | — |
| `create` rồi `update` | vẫn là `create` | máy chủ chưa biết thực thể; gửi `update` sẽ 404 |
| `create` rồi `delete` (chưa gửi) | huỷ **cả hai** | thực thể chưa từng tồn tại trên máy chủ |
| việc đang `syncing` | **không gộp** | yêu cầu đã bay lên mạng; sửa payload nghĩa là máy chủ nhận A còn ta ghi sổ là gửi B |

### 3. Backoff luỹ thừa — chống đập máy chủ

2s → 8s → 32s → 2min → 8min → chốt 30 phút. Tối đa 8 lần.

Mất mạng 2 tiếng mà thử lại mỗi giây là 7200 lần gọi vô ích.

Hết lượt thử: bản ghi **vẫn giữ nguyên** ở trạng thái `failed`, chỉ ngừng tự
động thử. Người dùng bấm "Thử lại" thì chạy tiếp. **Không bao giờ xoá** — đó là
thứ họ đã gõ ra.

### 4. Tách 4xx khỏi 5xx — chống thử lại vô vọng

| Kết quả transport | Trạng thái | Thử lại? |
|---|---|---|
| `confirmed` | `synced` | — |
| `retry` (mạng, 5xx, 429) | `failed` | có, backoff |
| `rejected` (4xx) | `rejected` | **không** — dữ liệu sai, thử 1000 lần vẫn sai |
| `conflict` (409) | `conflict` | **không** — cần người dùng chọn bản nào thắng |

Transport **ném lỗi** (ngoài dự kiến) được coi là tạm thời: thà thử lại thừa
còn hơn vứt dữ liệu người dùng.

### Chạy tuần tự, không song song

Thao tác trên cùng một thực thể có thứ tự (tạo trước, sửa sau). Gửi song song
thì `update` có thể tới trước `create`. Hàng đợi luôn nhỏ nên tuần tự không
phải nút thắt.

### Ngoại tuyến thì không thử

Gọi mạng lúc offline chỉ tăng `retryCount` vô ích và đẩy backoff lên cao, khiến
lúc **có** mạng trở lại app lại ngồi đợi.

---

## Trạng thái hiển thị

Tám trạng thái, mỗi cái là một sự thật khác nhau:

| Trạng thái | Nghĩa | Màu |
|---|---|---|
| `chua-dang-nhap` | chưa có phiên | xám |
| `chua-noi-may-chu` | **chưa có transport** (hiện tại) | xám |
| `ngoai-tuyen` | mất mạng, không có việc chờ | vàng |
| `cho-mang` | có việc chờ gửi | vàng |
| `dang-dong-bo` | đang gửi | xám |
| `that-bai` | gửi hỏng, còn thử lại | đỏ |
| `can-xu-ly` | bị từ chối hoặc xung đột | đỏ |
| `da-dong-bo` | máy chủ đã xác nhận hết | xanh |

`chua-noi-may-chu` tồn tại riêng vì nó **không phải** `da-dong-bo`. Hiện tại
app đang ở trạng thái này, và thanh trạng thái nói đúng như vậy.

---

## Test (26/26 đạt)

Mỗi test tương ứng một kiểu mất dữ liệu có thật:

- gộp 40 lần sửa → 1 việc, giữ nội dung mới nhất
- idempotency key **không đổi** khi gộp
- `create`+`update` → `create`; `create`+`delete` → huỷ cả hai
- **không** gộp vào việc đang `syncing`
- hai tài khoản không gộp vào nhau
- chỉ `synced` **sau khi** máy chủ xác nhận
- transport ném lỗi → giữ nguyên payload
- ngoại tuyến → **không** gọi transport, `retryCount` không tăng
- `rejected` → không thử lại nữa
- backoff giãn dần, lần chờ sau dài hơn lần trước
- hết lượt thử → **vẫn giữ** dữ liệu
- xung đột → giữ bản của người dùng, không tự ghi đè
- chỉ đồng bộ việc của đúng người đang đăng nhập
- `retryFailed` không đụng `rejected`/`conflict`
- cache: tách theo người dùng, đánh dấu cũ, dọn theo tuổi
- swr: 5 nhánh online/offline/stale
- hết dung lượng → dọn rồi ghi lại, không ném lỗi lên tính năng

```bash
cd desktop && npx vitest run
```

---

## Còn thiếu (Phase 4)

- **Transport thật.** Hiện `null`. Phase 4 nối vào `api.cuongthai.com` với
  `Authorization: Bearer` và header `Idempotency-Key`.
- **`userId` thật.** Hiện `null`, lấy từ phiên đăng nhập ở Phase 4.
- **Ánh xạ id tạm → id thật** sau khi `create` được xác nhận.
- **Giao diện hợp nhất xung đột.** Hiện chỉ ghi nhận và báo "cần xử lý".

⚠️ Backend **chưa có** API đồng bộ hai chiều (revision, conflict, idempotency).
Cho tới khi có, chỉ những thao tác backend hỗ trợ an toàn mới được xếp hàng;
còn lại giữ dạng nháp cục bộ. Xem bảng khả năng offline theo tính năng trong
[electron-implementation-plan.md](electron-implementation-plan.md).
