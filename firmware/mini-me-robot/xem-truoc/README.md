# Xem trước hai con mắt — không cần phần cứng

```bash
./chay.sh          # → anh/00-tat-ca.png
```

Cần `clang++` (Xcode CLT) và `python3` có Pillow (`pip3 install pillow`).

## Vì sao có thư mục này

Vẽ mắt là thứ **chỉ nhìn mới biết đúng hay sai**. Đọc mã thì mọi dòng đều
hợp lý; lên bo mới thấy mống lệch, mí ngược, hay biểu cảm không đổi. Mà
mỗi vòng thử trên bo là tháo dây, nạp lại, cắm lại — vài phút cho một
lần sửa một con số.

Bộ này chạy **đúng `../src/eyes.cpp`** trên máy tính rồi xuất PNG, một
vòng mất 3 giây. Nó thay `TFT_eSPI` bằng một lớp giả ghi vào mảng bộ nhớ
(`TFT_eSPI.h` ở đây), còn toàn bộ phần tính hình học là mã thật.

⚠️ **Đừng bao giờ chép lại mã vẽ vào đây.** Bộ xem trước vẽ bằng mã khác
với mã chạy trên bo thì nó chỉ chứng minh bản chép là đúng — xem
[[feedback_verify_the_checker_before_the_content]].

## Nó đã bắt được gì

| Lỗi | Vì sao đọc mã không thấy |
|---|---|
| `banBan = 0xFFFF` nhưng chỉ có 10 dải → 6 bit cao không xoá được → `dangVe` chỉ chụp một lần → **cả 28 biểu cảm vẽ lại ảnh đầu tiên** | Hai dòng liên quan đều đúng nếu xét riêng. Trên màn thì mắt vẫn đẹp, vẫn chớp — chỉ là không đổi biểu cảm |
| Dạng mắt (trái tim/ngôi sao/xoáy ốc) chỉ đổi khi mí khép >55%, mà đúng những biểu cảm ấy lại mở mắt to nhất → **không bao giờ hiện** | Điều kiện trông rất hợp lý: "giấu cú đổi sau một cái chớp" |
| Dấu độ nghiêng mí bị đảo → giận thành mép ngoài chúi xuống | Mặt vẫn có biểu cảm, chỉ là SAI biểu cảm |
| Mí giận khép 0,36 + nghiêng 0,95 → mắt vỡ thành mảnh vụn ở góc | Hai con số riêng lẻ đều trong khoảng hợp lệ |
