# Cổng key con LLM

Chia key rambo (gói max5) thành nhiều **key con có hạn mức riêng** cho OpenCode
trên các máy khác, hoặc cho tính năng AI của web phụ. **cuongthai.com không đi
qua đây**: backend vẫn gọi rambo thẳng bằng key chính, không trần.

```
OpenCode ─ key con ─► nginx /llm/v1 ─► New API ─ khoá nội bộ ─► canh ─ key chính ─► rambo
cuongthai.com (backend) ─────────────────────── key chính ────────────────────► rambo
```

- **New API** (`calciumion/new-api`, ghim bản): phát key con, trừ hạn mức theo
  giá Anthropic (Opus tốn gấp 2,5 Sonnet 5), ghi log từng lượt, có giao diện.
- **canh** (`canh/canh.mjs`, không phụ thuộc thư viện nào) làm hai việc:
  1. **Ưu tiên web.** Mỗi phút hỏi rambo xem key chính đã dùng bao nhiêu phần
     trăm cửa sổ 5 giờ. Từ **70%** trở lên thì đóng mọi key con (trả 429 kèm lý
     do), tới khi cửa sổ reset mới mở lại. 30% cuối mỗi cửa sổ là của riêng web.
     Nếu không đo được hạn mức quá 15 phút thì cũng đóng.
  2. **Nạp lại hạn mức key con** mỗi lần cửa sổ rambo reset. Hạn mức nằm ở
     `canh/han-muc.json`, mặc định **10 USD quy đổi cho mỗi key, mỗi cửa sổ**.

Quyết định của người dùng (13/09/2026): admin rambo cho phép dựng proxy và key
con để *tự dùng*, miễn **không phân phối / bán lại**. Không chia key con cho người khác.

## Triển khai

```bash
git add services/cong-llm && git commit -m "…"
bash services/cong-llm/trien-khai.sh
```

Script chỉ chở bản **đã commit** lên `/opt/cong-llm/app`, sinh
`/opt/cong-llm/.env` ở lần chạy đầu, dựng hai container rồi chạy `khoi-tao.mjs`.
Chạy lại bao nhiêu lần cũng được. Script **không** đụng backend/frontend, **không** push.

Khối `location ^~ /llm/v1/` trong `nginx/nginx.conf` thì đi đường chuẩn: chỉ
có hiệu lực sau lần `deploy-nha.sh` kế tiếp (bước 6c).

## Chống phá và tự chữa

- **nginx `/llm/v1`**: mỗi IP tối đa 10 request/giây (dồn được 20) và
  **20 kết nối cùng lúc**. Vượt thì trả 429. Thử 40 request dồn một lúc thì
  20 được qua, 20 bị chặn.
- **Dò key**: key con dài 48 ký tự ngẫu nhiên, sai key thì New API trả 401 ngay.
- **Lộ key**: thiệt hại có trần — tối đa hạn mức key đó mỗi cửa sổ, và không
  bao giờ vượt quá 70% cửa sổ (phần còn lại là của web).
- **Tự chữa** (`tu-chua.sh`, cron mỗi phút): container "unhealthy" thì
  restart. Docker tự làm việc này chỉ khi tiến trình CHẾT, còn treo thì không.
  Tối đa 3 lần mỗi giờ, quá thì dừng và ghi ⛔ vào `/opt/cong-llm/tu-chua.log`.
  Container bị dừng tay thì không đụng tới.
- **Chưa có**: chống DDoS lưu lượng lớn. Tên miền trỏ thẳng IP VPS, không qua Cloudflare.

## Lấy key con, xem log, đổi hạn mức

Giao diện quản trị **không** mở ra Internet. Vào bằng SSH tunnel:

```bash
ssh -L 3300:127.0.0.1:3300 root@160.187.1.208
```

Rồi mở `http://localhost:3300`. Tài khoản `quantri`, mật khẩu nằm ở
`/opt/cong-llm/.env` (`CONG_LLM_ADMIN_PASS`). Tạo, xoá, khoá key con, xem số
đã dùng: tất cả ở mục Token.

Hoặc in thẳng các key con ra màn hình:
`docker exec cuonghoangdev_canh_llm node /app/khoi-tao.mjs --in-khoa`

- **Đổi hạn mức**: sửa `canh/han-muc.json` (`mac_dinh_usd`, hoặc `theo_ten`
  cho từng key) rồi triển khai lại. Có hiệu lực từ cửa sổ kế tiếp.
- **Key không bị nạp lại**: đặt key đó "không giới hạn" trong giao diện, canh sẽ bỏ qua nó.
- **Đổi ngưỡng nhường web**: đặt `CONG_LLM_NGUONG_NHUONG` và `CONG_LLM_NGUONG_MO_LAI`
  trong `/opt/cong-llm/.env`, rồi triển khai lại.
- **Xem canh đang nghĩ gì**:
  `docker exec cuonghoangdev_canh_llm wget -qO- localhost:8080/suc-khoe`

## OpenCode trên máy khác

Chép `opencode.mau.json` vào `~/.config/opencode/opencode.json`, hoặc gộp khối
`provider` vào file đang có. Rồi đặt key con vào biến môi trường:

```bash
export CUONG_LLM_KEY=sk-...
```

Trong OpenCode, gõ `/models` là thấy đủ 6 model của rambo. Ngữ cảnh khai
**180k**: rambo từ chối mọi lượt quá 190k token (xem bên dưới). Khai sát
dưới mức đó thì OpenCode tự nén hội thoại trước khi đụng trần.

### Kiểm hạn mức key

```bash
curl -s https://api.cuongthai.com/llm/han-muc -H "Authorization: Bearer $CUONG_LLM_KEY"
```

Lệnh này cho biết key con còn bao nhiêu trong cửa sổ hiện tại, cổng đang mở
hay đóng, và bao lâu nữa thì reset:

```json
{
  "key": "opencode-1",
  "ketLuan": "Dùng được.",
  "cuaSoNay": { "hanMucUsd": 10, "daDungUsd": 2.25, "conLaiUsd": 7.75, "daDung": "23%", "hetHanMuc": false },
  "cong": {
    "dangMo": true, "lyDo": "", "keyChinhDaDung": "41%", "dongKhiKeyChinhToi": "70%",
    "cuaSoResetSau": "2 giờ 13 phút", "resetLuc": "09:23 13-09"
  }
}
```

Dòng `ketLuan` là câu trả lời ngắn. Có ba khả năng:

| `ketLuan` | Nghĩa là | Làm gì |
|---|---|---|
| `Dùng được.` | Key còn hạn mức, cổng đang mở | Dùng tiếp |
| `Key đã hết hạn mức cửa sổ này…` | Key đã tiêu hết phần của cửa sổ này | Chờ tới `resetLuc`, hạn mức tự nạp lại |
| `Cổng đang đóng: key chính đã dùng …%` | Web đã dùng quá 70% key chính, phần còn lại để dành cho web. **Mọi** key con đều bị khoá, kể cả key còn hạn mức | Chờ tới `resetLuc` |

⚠️ **Key hết hạn mức thì OpenCode báo `401 Invalid token`**, trông giống hệt
key sai. Nếu đang dùng bình thường mà giữa chừng gặp 401, chạy lệnh trên
trước khi đi tìm lỗi cấu hình. Lỗi do cổng đóng thì khác: 429 kèm câu
`Cổng key con đang tạm đóng…`.

Vài điều về các con số (đo trên New API rc.37, 13/09/2026):
- `USD` là số **quy đổi** theo giá Anthropic để chia phần giữa các key,
  không phải tiền thật. Một lượt Opus 200k token vào / 50k ra tốn 2,25 USD.
- Lượt cuối được chạy trọn rồi mới trừ theo số token thật, nên có thể vượt
  hạn mức một chút. Khi đó `conLaiUsd` là 0 và phần vượt nằm ở `vuotUsd`.
- Đừng dùng `/llm/v1/dashboard/billing/*` để xem hạn mức. Hai đường đó
  cộng dồn từ lúc tạo key, không tính theo cửa sổ.

Đường này đi thẳng tới canh (không qua New API, xem khối `location =
/llm/han-muc` trong `nginx/nginx.conf`). Nó chỉ hoạt động sau khi đã chạy cả
`trien-khai.sh` (cập nhật canh) lẫn `deploy-nha.sh` (cập nhật nginx).

## Giới hạn NGẦM của rambo — đo thật 13/09/2026

Đo bằng mã đặt ở đầu và cuối văn bản, gọi thẳng rambo:

| Giới hạn | Rambo làm gì | canh xử lý |
|---|---|---|
| Mỗi **khối** nội dung ~12.000 ký tự (~3.200 token) | **cắt ngầm**. Tin nhắn hay kết quả tool 40k / 200k / 1,2 triệu ký tự đều chỉ còn ~3.200 token | chia khối > 8.000 ký tự thành nhiều khối (`sua-yeu-cau.mjs`) |
| Chỉ giữ **~58 tin nhắn** cuối | **bỏ ngầm** tin cũ, kể cả yêu cầu gốc | quá 56 tin thì gộp các lượt cũ thành một khối lịch sử |
| **190k token** mỗi lượt | trả 400 `Request context is too large for the 190K input limit` | không xử lý — OpenCode khai 180k |
| `max_tokens` | bỏ qua; luôn bật thinking | — |

Sau khi canh nắn yêu cầu, qua key con thật:
- khối 40k: đúng ✓
- kết quả tool 40k: đúng ✓
- 80 cặp tin nhắn: thấy đủ 80
- một tin nhắn ~170k token: thấy cả mã đầu lẫn mã cuối, trong 35 giây

Rambo tính hạn mức là `usedTokens = token ra + token vào × 0,25`, trần 2.000.000
mỗi cửa sổ 5 giờ. Cửa sổ bắt đầu từ lượt gọi đầu tiên.

Backend cuongthai.com gọi rambo thẳng, không qua canh, nên nó tự nắn yêu cầu
bằng bản TypeScript của cùng cách này: `src/services/llm/nanRambo.ts`.

Mức 10 USD/cửa sổ là **ước lượng**. Nên chỉnh lại sau vài ngày, dựa vào log của New API.
