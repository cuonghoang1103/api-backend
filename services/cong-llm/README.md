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
950k token (Haiku 4.5 chỉ có 200k).

## Những điều đã đo, và chưa đo

Đã thử trọn đường OpenCode 1.18 → nginx → New API → canh → rambo giả ở máy local:
- stream chạy đúng
- hạn mức trừ đúng theo giá model
- tới ngưỡng thì cổng đóng, và OpenCode hiện đúng câu lý do sau ~70 giây (thử lại 5 lần)
- key đã cạn được bật lại khi cửa sổ mới bắt đầu
- nginx vẫn nạp được config khi New API vắng mặt (lúc đó riêng `/llm` trả 502)

Chưa đo trên rambo thật:
- rambo có nhận ngữ cảnh **trên 200k** không
- `usedTokens` của rambo đếm token vào hay chỉ token ra (trang của họ đọc
  `usedTokens ?? outputTokens`)

Mức 10 USD/cửa sổ là **ước lượng**. Nên chỉnh lại sau vài ngày, dựa vào log của New API.
