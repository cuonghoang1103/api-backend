# thumb.py — "dịch vụ tạo ảnh thu nhỏ": gọi một thư viện C (giả lập bằng ctypes) — tới ảnh thứ 42 thì thư viện đọc con trỏ NULL.
import ctypes, time
for i in range(38, 45):
    print(f"processing anh-{i:04d}.jpg")
    time.sleep(0.2)
    if i == 42:
        ctypes.string_at(0)          # lỗi trong mã C: đọc địa chỉ 0 ⇒ SIGSEGV
    print(f"done anh-{i:04d}.jpg")
