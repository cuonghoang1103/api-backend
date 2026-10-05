# Đề giao agent: LUẬT CHƠI + BOT cho 4 trò đối kháng (05/10/2026)

Repo `/Users/admin/Downloads/api-backend`. Đọc trước: `docs/doi-khang-spec.md` và
`src/services/doiKhang/luat/kieu.ts` (hợp đồng `LuatTro<S, M>` — KHÔNG đổi hợp đồng; cần đổi thì
ghi đề xuất vào báo cáo).

Làm MỘT MÌNH, **không tách agent con**, **không commit/push/deploy**, chỉ tạo/sửa tệp trong
`src/services/doiKhang/luat/` + `scripts/dong-bo-luat-doi-khang.mjs`.

## Viết
- `coVua.ts` → `export const coVua: LuatTro<TrangThaiCoVua, NuocCoVua>` — tự viết, KHÔNG thư viện.
  Nước dạng `{ tu: 'e2', den: 'e4', phong?: 'q'|'r'|'b'|'n' }`. Đủ luật (nhập thành, en passant,
  phong cấp, chiếu hết, hết nước = hoà, 50 nước, lặp 3 lần, thiếu quân). Bot: alpha-beta + bảng vị
  trí quân, cấp 1 ≈ độ sâu 1 + ngẫu nhiên, cấp 2 sâu 2–3, cấp 3 sâu 3–4 + sắp nước (bắt quân trước)
  + giới hạn thời gian 1,2 s (lặp sâu dần).
- `coTuong.ts` → `coTuong` — bàn 9×10, nước `{ tu: [cot, hang], den: [cot, hang] }` (cột 0–8 từ
  trái phe Đỏ, hàng 0–9 từ phe Đỏ). Đỏ (ghế 0) đi trước. Đủ luật: mã cản chân, tượng cản mắt + không
  qua sông, sĩ/tướng trong cung, pháo ăn cách 1 quân, tốt qua sông đi ngang, tướng không đối mặt,
  không được tự để bị chiếu. Hết nước = thua. Lặp 3 lần = hoà (đơn giản hoá chiếu dai). `moTa` theo
  ký pháp Việt ("Pháo 2 bình 5", "Mã 8 tấn 7"). Bot alpha-beta như cờ vua.
- `tienLen.ts` → `tienLen` — Tiến lên miền Nam 2–4 người, 13 lá/người (2 người vẫn 13 lá).
  Lá: `'3S'…'2H'` (3<4<…<A<2; chất ♠<♣<♦<♥ — S,C,D,H). Nước `{ loai: 'danh', la: string[] } | { loai: 'bo' }`.
  Bộ hợp lệ: rác, đôi, ba, tứ quý, sảnh ≥3 (không chứa 2), đôi thông ≥3 đôi. Chặn: cùng loại cùng
  độ dài lớn hơn (so lá cao nhất, cùng hạng thì so chất). Chặt heo: 3 đôi thông chặt một heo;
  tứ quý chặt heo / đôi heo / 3 đôi thông; 4 đôi thông chặt heo, đôi heo, tứ quý, 3 đôi thông.
  Bỏ lượt = mất quyền trong vòng đó; hết vòng người đánh cuối được đi tự do. Ván đầu ai có 3♠ đi
  trước và nước đầu phải chứa 3♠. Về nhất = thắng; `thuHang` đủ thứ tự. (Tới trắng: không cần.)
  `nhinTu` giấu bài người khác (chỉ số lá). Bot: cấp 1 đánh bộ nhỏ nhất, cấp 2 giữ heo/bom + đánh
  rác lẻ trước, cấp 3 thêm đếm lá đối thủ, chặn người sắp hết bài.
  Trạng thái phải có trường `nguoiDiTruoc` để máy chủ đặt cho ván sau (người về nhất ván trước).
- `caro.ts` → `caro` — 15×15, nước `{ o: [x, y] }`, 5 liền trở lên thắng, đầy bàn hoà. Bot: chấm
  điểm mẫu (đường 2/3/4 mở/chặn) cho công + thủ, cấp 3 thêm dò 2 tầng.
- `index.ts` → `export const LUAT: Record<MaTro, LuatTro<any, any>>` + re-export kiểu.
- `luat.test.ts` (chạy bằng `npx tsx --test src/services/doiKhang/luat/*.test.ts`) — BẮT BUỘC:
  - Cờ vua **perft**: vị trí đầu perft(1..3)=20/400/8902, "Kiwipete"
    `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -` perft(1..2)=48/2039
    (có hàm nạp FEN để test, xuất `tuFen`). Chiếu hết học trò, hoà hết nước.
  - Cờ tướng: số nước đầu ván = 44; mã cản chân; pháo ăn; tướng đối mặt bị cấm.
  - Tiến lên: nhận đúng từng loại bộ, chặn đúng, chặt heo, bỏ lượt hết vòng, 3♠ đi trước, kết thúc.
  - Caro: 5 liền dọc/ngang/chéo thắng.
  - Mọi trò: `kiemTra` chịu rác (`null`, `{}`, chuỗi, số) không ném lỗi; tự đấu bot-vs-bot 20 ván
    mỗi trò kết thúc hợp lệ, mỗi nước bot qua `kiemTra`; đo thời gian nước bot cấp 3 < 1,5 s.
- `scripts/dong-bo-luat-doi-khang.mjs` — chép mọi `*.ts` (trừ `*.test.ts`, `_PROMPT*`) sang
  `frontend/src/lib/doiKhang/luat/`, thêm dòng đầu `// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs`.
  Chế độ `--kiem` thoát mã 1 nếu bản chép lệch. Chạy nó ở cuối.

Import nội bộ dùng đuôi `.js` (`import { x } from './kieu.js'`) — backend là ESM NodeNext; kiểm
frontend vẫn biên dịch được (`cd frontend && npx tsc --noEmit | grep doiKhang`).

## Kiểm trước khi báo
`npx tsc --noEmit` (gốc) sạch · test xanh · frontend tsc không lỗi ở `lib/doiKhang`.

## Báo lại (tiếng Việt, ngắn)
Hình dạng `S` (trạng thái) và `nhinTu` của từng trò — giao diện sẽ dựng theo đó, nên ghi CHÍNH XÁC
các trường; kết quả test (perft…); thời gian bot; chỗ chưa chắc.
