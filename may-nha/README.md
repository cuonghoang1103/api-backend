# Dịch vụ GPU ở máy nhà

Backend gọi bốn dịch vụ chạy trên máy nhà (RTX 3060 12GB), qua đường hầm
SSH ngược tới VPS. Chúng **không nằm trong kho này** — mã của chúng ở
`~/chatterbox`, `~/f5-train`, `~/voice-training`, `~/llm-server` trên máy
đó. Thư mục này chỉ giữ những bản vá mà mất đi thì khó dựng lại.

| Dịch vụ | Cổng nhà | Cổng VPS | VRAM | Backend gọi qua |
|---|---|---|---|---|
| `voice-training` — **Voice CuongMini** | 8090 | 18080 | 718 MB | `TTS_SERVICE_URL` |
| `llm-server` — Qwen3.5-9B | 8100 | 18100 | 5.894 MB | `LLM_LOCAL_BASE_URL` |
| `f5-tts` — giọng **tự train** | 8092 | 18092 | 378–2.070 MB | `F5_TTS_URL` |
| `tts-chatterbox` — giọng Anh | 8091 | — | 180–2.650 MB | qua Voice CuongMini |

⚠️ **`voice-training` KHÔNG phải dịch vụ phụ.** Tên nó gây hiểu lầm: nó là
**cửa duy nhất** của toàn bộ máy đọc — gom 18 giọng của chính nó, chuyển
tiếp 8 giọng F5 và 4 giọng Anh, thành một danh sách 30 giọng. Nó cũng chứa
xưởng thu giọng (`/xuong/*`). Tắt nó là cả web mất tiếng nói. Ngày
18/08/2026 tôi suýt khuyên tắt nó để lấy 718 MB — sai hoàn toàn.

## Bốn dịch vụ, một card 12GB

Cộng lại 11,3 GB trên card 12 GB. Train giọng còn cần thêm 9,8 GB nữa, nên
`train.sh` phải tắt Qwen mới chạy được.

Ngày 18/08/2026 chỗ này vỡ: F5 (dịch vụ **duy nhất** biết tự nhả khi rỗi,
`F5_NHAN_ROI_GIAY=600`) trả chỗ lại tử tế, rồi lúc cần nạp lại thì ba anh
kia đã chiếm hết. Nó xin **20 MiB** không có và chết `CUDA out of memory`.
Trớ trêu: thứ duy nhất trên card do người dùng **tự train** lại là thứ bị
đá ra để nhường chỗ cho ba model tải về.

## Bản vá: `va-chatterbox-nha-vram.py`

Chatterbox đã có sẵn cơ chế tự nhả nhưng **tắt mặc định**, và bật lên vẫn
chưa đủ — nó báo nhả thành công mà chỉ trả về 66 MiB trên 2.714.

Vì `_ha_do_chinh_xac()` gán `m.prepare_conditionals = boc`, mà `boc` là
closure bắt chính `m` ⇒ **vòng tham chiếu** `m → boc → m`. Đếm tham chiếu
không phá được vòng, và `empty_cache()` chỉ trả phần **đã chết** — nên nó
không trả được gì trong khi vẫn in ra một dòng thành công.

Áp lại (ví dụ sau khi dựng lại máy):

```bash
scp may-nha/va-chatterbox-nha-vram.py linux-nha:/tmp/
ssh linux-nha 'python3 /tmp/va-chatterbox-nha-vram.py'
ssh linux-nha 'sed -i "/^ExecStart=/i Environment=CHATTERBOX_IDLE_UNLOAD_SEC=600" \
  ~/.config/systemd/user/tts-chatterbox.service && \
  systemctl --user daemon-reload && systemctl --user restart tts-chatterbox'
```

Đo lại sau khi vá:

| | Trước | Sau |
|---|---|---|
| chatterbox lúc rỗi | 2.542 MiB | **180 MiB** |
| `/vram` `dangDung_MB` | 2.367 | **9** |
| **VRAM trống cả card** | **57 MiB** | **4.558 MiB** |
| Giọng `f5-cuong` | ❌ CUDA OOM | ✅ 3,0s đầu · 1,1s sau |

Cái giá: câu tiếng Anh **đầu tiên** sau 10 phút không dùng mất **12,2 giây**
(nạp lại), các câu sau 1,3 giây. Chỉ trả giá cho thứ mình không dùng.

Máy nhà cũng đã có kho git riêng ở `~/chatterbox` (3 commit) — nhưng đĩa đó
không có bản sao lưu, nên bản vá được giữ thêm ở đây.
