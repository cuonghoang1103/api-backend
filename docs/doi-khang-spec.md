# Đối kháng — cờ vua · cờ tướng · tiến lên · caro (05/10/2026)

Người dùng: "trò đánh cờ vua, cờ tướng, đánh bài… với bot, hoặc mời user đang online / gửi lời mời
để chơi realtime thật giữa 2 người. Giao diện đẹp + hiện tỷ số."

## Phạm vi đợt 1

| Mã | Trò | Người | Bot | Ghi chú |
|---|---|---|---|---|
| `co-vua` | Cờ vua | 2 | 3 cấp | luật đủ: nhập thành, bắt tốt qua đường, phong cấp, hoà 50 nước / lặp 3 lần / thiếu quân |
| `co-tuong` | Cờ tướng | 2 | 3 cấp | luật đủ: tướng không đối mặt, chiếu, bí, hết nước = thua; cấm chiếu dai/đuổi dai (đơn giản hoá: lặp 3 lần = hoà) |
| `tien-len` | Tiến lên miền Nam | 2–4 | 3 cấp | 13 lá, 3♠ đi trước ván đầu, sảnh, đôi thông, tứ quý chặt heo; người về nhất đi trước ván sau |
| `caro` | Caro 15×15 | 2 | 3 cấp | 5 liền thắng (chặn hai đầu vẫn tính — luật phổ thông VN) |

Chế độ: **chơi với bot** (chạy ở máy người chơi, không tốn máy chủ) · **mời bạn đang online** ·
**gửi link mời** (mã phòng) · **ghép ngẫu nhiên**. Có đồng hồ, đầu hàng, xin hoà, tái đấu, chat
nhanh + thả cảm xúc, **tỷ số trong phòng** (thắng–thua liên tiếp giữa hai người) và **xếp hạng Elo**.

## 1. Luật chơi — `src/services/doiKhang/luat/` (NGUỒN DUY NHẤT)

Thuần TypeScript, không phụ thuộc DOM / Node / Prisma, không thư viện ngoài, trạng thái là JSON
thuần (gửi qua socket, lưu DB được). Máy chủ dùng để KIỂM nước đi (máy chủ là trọng tài); giao
diện dùng cùng mã để gợi ý nước hợp lệ + chạy bot. Bản cho frontend chép bằng
`node scripts/dong-bo-luat-doi-khang.mjs` vào `frontend/src/lib/doiKhang/luat/` — **không sửa tay
bản chép**; phép kiểm `luat.dongBo.test.ts` chặn lệch.

Hợp đồng: xem `src/services/doiKhang/luat/kieu.ts` (`LuatTro<S, M>`).

## 2. Giao thức realtime — `src/socket/doiKhang.socket.ts`

Mọi sự kiện tiền tố `dk:`. Client → máy chủ (có ack `{ ok, loi?, ... }`):

| Sự kiện | Dữ liệu | Ý nghĩa |
|---|---|---|
| `dk:tao` | `{ tro, thoiGian: { phut, congGiay }, rieng?: boolean, soGhe? }` | tạo phòng → `{ ok, phong: PhongDTO }` |
| `dk:vao` | `{ maPhong }` | vào phòng (ghế trống thì ngồi, không thì xem) |
| `dk:roi` | `{ maPhong }` | rời phòng (đang đánh = xử thua sau 60 giây nếu không quay lại) |
| `dk:moi` | `{ maPhong, userId }` | mời → người kia nhận `dk:loi-moi` |
| `dk:tra-loi-moi` | `{ maPhong, dongY }` | |
| `dk:ghep` / `dk:huy-ghep` | `{ tro }` | xếp hàng ghép ngẫu nhiên |
| `dk:them-bot` | `{ maPhong, ghe, capDo }` | (chủ phòng, chỉ tiến lên) cho bot ngồi ghế trống — bot chạy ở MÁY CHỦ |
| `dk:san-sang` | `{ maPhong }` | bắt đầu khi đủ ghế + mọi người sẵn sàng |
| `dk:nuoc` | `{ maPhong, nuoc, soNuoc }` | đi một nước (`soNuoc` = số nước đã biết, chống gửi trùng) |
| `dk:dau-hang` · `dk:xin-hoa` · `dk:tra-loi-hoa` · `dk:tai-dau` | `{ maPhong, ... }` | |
| `dk:chat` · `dk:cam-xuc` | `{ maPhong, text \| emoji }` | |

Máy chủ → client: `dk:phong` (PhongDTO đầy đủ, RIÊNG cho từng ghế — bài trên tay chỉ ghế đó
thấy), `dk:nuoc` (nước vừa đi + đồng hồ), `dk:ket-thuc`, `dk:loi-moi`, `dk:chat`, `dk:cam-xuc`,
`dk:ghep-xong`.

```ts
interface PhongDTO {
  maPhong: string; tro: MaTro; trangThai: 'cho' | 'dang-danh' | 'xong';
  ghe: { userId: number | null; ten: string; avatar: string | null; bot?: 1|2|3; online: boolean; sanSang: boolean }[];
  nguoiXem: number;
  thoiGian: { phut: number; congGiay: number };
  dongHo: number[];          // ms còn lại mỗi ghế, mốc `dongHoLuc` (giờ máy chủ)
  dongHoLuc: number;
  tiSo: number[];            // số ván thắng của mỗi ghế trong phòng này
  van: { nhin: unknown; soNuoc: number; nuocCuoi: unknown | null; luot: number } | null; // nhin = luat.nhinTu(state, gheCuaToi)
  ketQua: KetQua | null;
  gheCuaToi: number | null;
}
```

## 3. Lưu & xếp hạng (Prisma)

- `DoiKhangVan`: id, tro, nguoiChoi (userId[]), ketQua JSON, soNuoc, lichSu JSON (nước đi), batDau, ketThuc.
- `DoiKhangHang`: (userId, tro) duy nhất, elo (1200), thang, thua, hoa, chuoi.
- Ván có bot: lưu lịch sử, **không** tính Elo.
- REST `GET /api/v1/doi-khang/xep-hang?tro=` · `GET /api/v1/doi-khang/cua-toi` · `GET /api/v1/doi-khang/ban-online`.

## 4. Giao diện — `frontend/src/components/doiKhang/` + trang `/games/doi-khang`

Sảnh: 4 thẻ trò (ảnh minh hoạ), nút Chơi với máy / Mời bạn / Ghép nhanh / Vào bằng mã, bạn bè
đang online (bấm Mời), bảng xếp hạng Elo. Bàn chơi: bàn cờ khối nổi 3D tự nhiên (gỗ / đá, bóng đổ
mềm, không vuông thô), quân trượt mượt, ô vừa đi + nước hợp lệ sáng, đồng hồ hai bên, tỷ số lớn
ở giữa, chat nhanh + cảm xúc bay, âm thanh (`games/shared/amThanh`), hiệu ứng thắng
(`games/shared/hieuUng`). Lời mời đến hiện thành thẻ nổi ở góc màn hình ở MỌI trang.
