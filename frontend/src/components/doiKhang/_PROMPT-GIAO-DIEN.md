# Đề giao agent: GIAO DIỆN ĐỐI KHÁNG — cờ vua · cờ tướng · tiến lên · caro (05/10/2026)

Người dùng (chủ web cuongthai.com + app desktop): "trò đánh cờ vua, cờ tướng, đánh bài… với bot hoặc
mời user online / gửi lời mời để chơi realtime thật giữa 2 người. Giao diện đẹp + hiện tỷ số." Họ
từng chê game cũ "xấu, như AI": đòi đồ hoạ chuyên nghiệp, 3D tự nhiên, "đừng vuông góc xấu".

Repo `/Users/admin/Downloads/api-backend`. Làm MỘT MÌNH, **không tách agent con**, **không
commit/push/deploy**. Chỉ tạo/sửa trong: `frontend/src/components/doiKhang/**`,
`frontend/src/app/games/doi-khang/**`, `frontend/src/lib/doiKhang/client.ts`,
`frontend/src/lib/doiKhang/bot.worker.ts`. KHÔNG sửa `frontend/src/lib/doiKhang/luat/*` (bản chép tự
sinh), `lib/socket.ts`, layout gốc, mã máy chủ — cần gì ghi vào báo cáo.

## Đọc trước
1. `docs/doi-khang-spec.md` — phạm vi, giao thức socket `dk:*`, `PhongDTO`. Máy chủ đang được viết
   song song theo ĐÚNG đặc tả này; bám đặc tả, đừng đoán khác.
2. `frontend/src/lib/doiKhang/luat/` — luật + bot (đã xong, 26 test xanh). Hợp đồng ở `kieu.ts`.
   Hình dạng trạng thái (đọc mã để chắc):
   - Cờ vua `TrangThaiCoVua`: `ban[64]` (chỉ số hang*8+cot, hàng 0 = "1", cột 0 = "a"; quân chữ FEN,
     hoa = Trắng), `luotMau 'w'|'b'`, `nuocCuoi {tu,den}|null`; `nhinTu` thêm `chieu`. Nước
     `{tu:'e2',den:'e4',phong?}`. Ghế 0 = Trắng.
   - Cờ tướng `TrangThaiCoTuong`: `ban[90]` (hang*9+cot), K/A/B/N/R/C/P, hoa = Đỏ, `luotGhe`,
     `nuocCuoi {tu:[c,h],den:[c,h]}`; `nhinTu` thêm `chieu`. Ghế 0 = Đỏ (ở dưới).
   - Tiến lên: `nhinTu` → `NhinTienLen` (`baiCuaToi`, `soLa[]`, `luot`, `banTren {ghe,la,loai}`,
     `boLuot[]`, `daVe[]`, `laBatBuoc`, `nuocCuoi`, `baiLo` khi xong). Lá 'TS' = 10♠; chất S<C<D<H.
     Nước `{loai:'danh',la:[...]}` | `{loai:'bo'}`.
   - Caro: `ban[225]` (y*15+x; 0 trống, 1 X ghế 0, 2 O ghế 1), `nuocCuoi`, `thang {ghe,duong}`.
3. `frontend/src/lib/socket.ts` — `connectSocket()` (app desktop đã cắm socket riêng vào qua
   `datNguonSocket`, nên dùng `connectSocket` là chạy được cả web lẫn app).
4. `frontend/src/components/games/shared/amThanh.ts` (`sfx`) + `hieuUng.ts` (`phaoGiay`, `diemBay`,
   `rung`) — dùng lại cho âm thanh/hiệu ứng.
5. Xem cách trang `/games` hiện có dựng (GamesPortalClient, GameShell) để giữ cùng phong cách tối,
   tím–hồng, chip kính, khối nổi.

## Làm
- `lib/doiKhang/client.ts`: hàm bọc socket theo đặc tả (`taoPhong`, `vaoPhong`, `moi`, `ghep`,
  `diNuoc`, `dauHang`, `xinHoa`, `taiDau`, `chat`, `camXuc`, `nghe(...)` trả hàm huỷ), ack có hết
  giờ 6 s; + REST `layXepHang(tro)`, `layCuaToi()`, `layBanOnline()` (dùng axios `api` sẵn có của web,
  đường `/api/v1/doi-khang/...`).
- `lib/doiKhang/bot.worker.ts` + hook `useBot`: chạy `LUAT[tro].nuocBot` trong Web Worker
  (`new Worker(new URL('./bot.worker.ts', import.meta.url))`) để bàn không khựng; bot "nghĩ" tối
  thiểu 400–900 ms cho tự nhiên.
- **Chế độ chơi với máy chạy HOÀN TOÀN ở máy người chơi** (không cần máy chủ): trạng thái giữ ở client,
  đi bằng `LUAT`. Tiến lên với máy: 1 người + 1–3 bot.
- **Sảnh** `app/games/doi-khang/page.tsx` (+ `DoiKhangClient.tsx`): 4 thẻ trò lớn có minh hoạ vẽ
  bằng SVG/CSS (bàn cờ nghiêng 3D, quân bài xoè…), mỗi thẻ: Chơi với máy (chọn cấp 1–3), Ghép nhanh,
  Tạo phòng & mời. Ô "Vào bằng mã". Cột phải: bạn bè đang online (nút Mời), bảng xếp hạng Elo theo
  trò (tab), lịch sử ván của tôi. Đường `/games/doi-khang?phong=MÃ` vào thẳng phòng (link mời).
- **Bàn chơi** (component riêng mỗi trò, co giãn theo khung bằng ResizeObserver, đẹp cả khi toàn màn hình):
  - Cờ vua: bàn gỗ hai tông, viền dày có vát + bóng đổ mềm, toạ độ a–h/1–8; quân vẽ SVG đẹp (không
    dùng ký tự Unicode thô), quân trượt mượt khi đi (FLIP/transform), kéo-thả + bấm-bấm, chấm nước
    hợp lệ, ô vừa đi sáng, vua bị chiếu ánh đỏ, chọn quân phong cấp. Lật bàn theo bên.
  - Cờ tướng: bàn giấy/gỗ, sông "Sở hà – Hán giới", cung chéo, quân tròn khối nổi có chữ Hán
    (帥仕相傌俥炮兵 / 將士象馬車砲卒) đỏ–đen, chấm nước hợp lệ; quân Đen ở trên với người cầm Đỏ.
  - Tiến lên: bài trên tay xoè hình quạt, bấm nhấc lá (nâng lên + bóng), nút Đánh / Bỏ lượt / Sắp
    xếp / Gợi ý; mặt bài vẽ SVG đẹp (chất ♠♣♦♥, J/Q/K có hình đơn giản trang nhã); đối thủ ngồi quanh
    bàn nỉ xanh với lưng bài + số lá; bài vừa đánh bay vào giữa bàn; "Chặt!" có hiệu ứng lớn.
  - Caro: bàn giấy kẻ ô, X/O nét bút vẽ dần (stroke animation), nước cuối nhấp nháy nhẹ, đường thắng
    vẽ nối.
- **Khung phòng chung** cho mọi trò: thẻ hai người chơi (avatar, tên, Elo, **đồng hồ** đếm lùi chạy
  mượt theo `dongHo` + `dongHoLuc`, sáng khi tới lượt), **TỶ SỐ to ở giữa** (ví dụ 2 – 1, lấy `tiSo`),
  nút Đầu hàng / Xin hoà / Tái đấu, lịch sử nước (`moTa`), chat nhanh (câu mẫu + gõ), thả cảm xúc
  bay lên, màn kết quả (thắng: pháo giấy + `sfx('thang')`; thua: `sfx('thua')`), Elo +/−.
  Mất kết nối: băng "Đang nối lại…", đối thủ rời: "Chờ đối thủ quay lại (60 s)".
- **Thẻ lời mời** `LoiMoiDoiKhang.tsx`: nghe `dk:loi-moi` (dữ liệu `{ maPhong, tro, tu: {id, ten, avatar} }`),
  hiện thẻ nổi góc phải dưới (avatar, "X mời bạn chơi Cờ tướng", Nhận / Từ chối, tự tắt sau 30 s,
  âm báo). Nhận → điều hướng `/games/doi-khang?phong=MÃ`. (Tôi sẽ tự gắn nó vào layout web + app.)
- Âm thanh: đi quân (gỗ gõ — tự tổng hợp nhẹ hoặc `sfx('lat')`), ăn quân, chiếu (`sfx('sai')` nhẹ),
  đánh bài (`sfx('lat')`), tới lượt mình (`sfx('dem')`). Tôn trọng tắt tiếng của `amThanh`.
- Chữ tiếng Việt; tôn trọng `prefers-reduced-motion`; không `filter: blur` lớn chạy liên tục.
- React đúng chuẩn: không side effect trong updater; dọn listener/timer/worker khi unmount; sự kiện
  socket đọc state qua ref.

## Kiểm trước khi báo
`cd frontend && npx tsc --noEmit 2>&1 | grep -E "doiKhang|doi-khang"` không dòng nào. Tự chơi thử chế
độ máy cả 4 trò bằng trình duyệt nếu dựng được (Next dev RIÊNG: `API_INTERNAL_URL=http://localhost:3001
NEXT_DIST_DIR=.next-dk npx next dev -p 3014`, xong thì tắt theo cổng `lsof -ti:3014 | xargs kill -9`,
xoá `.next-dk`, và **`git checkout -- frontend/tsconfig.json`** vì Next tự sửa nó). Chụp ảnh từng bàn.

## Báo lại (tiếng Việt, ngắn)
Tệp đã tạo, ảnh chụp ở đâu, cái gì đã chạy thật / chưa, chỗ cần máy chủ hoặc layout bổ sung.
