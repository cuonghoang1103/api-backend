# Đề giao agent: NÂNG CẤP GAME lên chất lượng chuyên nghiệp (05/10/2026)

Người dùng (chủ web cuongthai.com + app desktop): "giao diện xấu quá, game hiện tại như AI và đơn
giản quá, chưa có nhiều màn, âm thanh cute vui nhộn, đồ hoạ đẹp… nâng cấp và làm chuyên nghiệp chỉn
chu hơn từ giao diện, âm thanh, hiệu ứng, đồ hoạ… 3D đẹp chuẩn tự nhiên, đừng vuông góc xấu".

Repo: `/Users/admin/Downloads/api-backend`, game ở `frontend/src/components/games/`. Làm MỘT MÌNH,
**KHÔNG tự tách agent con**, **KHÔNG commit/push/deploy**, **CHỈ sửa tệp game được giao** (+ tệp
`.module.css` của chính game đó, + ảnh bìa nếu được giao). KHÔNG sửa `shared/*`, `registry.ts`,
`GameShell`, trang `/games`, hay mã máy chủ — cần gì ở đó thì GHI vào báo cáo.

## Đọc trước
1. `shared/GameShell.tsx` — khung đã lo: màn bắt đầu (ảnh bìa), đếm ngược 3-2-1, tạm dừng, toàn màn
   hình, nút tắt tiếng, màn kết quả 1–3 sao. Game KHÔNG làm lại mấy thứ này.
2. `registry.ts` — hợp đồng `GameProps { onScore(score, durationSec) GỌI ĐÚNG MỘT LẦN khi hết lượt, locale }`.
3. `shared/amThanh.ts` — `sfx('bam'|'chon'|'lat'|'dung'|'sai'|'combo'{muc}|'gop'|'nhat'|'sao'|'nhay'|'truot'|'no'|'lenCap'|...)`.
4. `shared/hieuUng.ts` — `phaoGiay(el, {x,y,it})`, `diemBay(el, x, y, '+10', màu)`, `rung(el)`.
5. Trần điểm máy chủ: `src/services/games/game.service.ts` → `SCORE_CAPS` (KHÔNG sửa; điểm mới phải
   nằm dưới trần — nếu cách tính điểm đổi mà cần trần mới thì ghi rõ con số đề xuất trong báo cáo).
6. Game hiện tại của bạn (đọc kỹ, giữ những gì đã tốt).

## Yêu cầu chất lượng (mỗi game)
- **Nhiều màn / cấp độ**: tối thiểu 10 cấp tăng dần (hoặc vô tận có lên cấp), có **băng "Cấp N"**
  khi lên cấp (hoạt hình + `sfx('lenCap')`), độ khó tăng hợp lý — câu đầu dễ để không nản.
- **Âm thanh** ở mọi tương tác: bấm, đúng, sai, combo (cao dần theo chuỗi), lên cấp. Không dồn quá dày.
- **Phản hồi thị giác**: `diemBay` khi ăn điểm, `phaoGiay(...{it:true})` bụi sao khi đúng/ăn,
  `rung` khi sai, chỉ báo combo/chuỗi, thanh thời gian/tiến độ mượt.
- **Đồ hoạ đẹp, chuyên nghiệp**: bo góc mềm, gradient + đổ bóng nhiều lớp tạo chiều sâu (cảm giác
  3D tự nhiên: viền sáng trên, bóng dưới, nhấn xuống khi bấm), chuyển động mượt (transition/
  cubic-bezier, không giật), bảng màu hài hoà theo chủ đề game. KHÔNG khối vuông thô, KHÔNG
  phông/khung mặc định trình duyệt. Tôn trọng `prefers-reduced-motion`.
- **Co giãn theo khung**: đo kích thước khung chứa (ResizeObserver), KHÔNG cố định px lớn — game phải
  to đẹp khi bấm ⤢ toàn màn hình và vẫn vừa khung nhỏ (~640×460).
- **Điều khiển**: chuột + bàn phím (+ chạm) như hiện có, có gợi ý phím.
- **HUD** rõ: điểm, cấp, chuỗi/combo, thời gian/mạng — đẹp, không che bàn chơi.
- Chữ giao diện tiếng Việt (giữ nhánh `locale === 'en'` nếu game đang có).
- React đúng chuẩn: KHÔNG side effect trong hàm updater của setState (StrictMode chạy hai lần);
  sự kiện dồn dập (pointer, phím) đọc state qua ref; dọn timer/RAF khi unmount; `onScore` đúng một lần.
- Hiệu năng: 60fps trên máy thường, không `filter: blur` lớn chạy liên tục, canvas thì giới hạn dpr ≤ 2.

## Kiểm trước khi báo xong
```bash
cd frontend && npx tsc --noEmit 2>&1 | grep "components/games" ; echo xong   # không dòng lỗi nào của tệp bạn
```
Tự soát: lượt chơi đầu tới khi hết, lên cấp, combo, sai, kết thúc gọi onScore 1 lần, toàn màn hình.

## Báo lại
Từng game: đã thêm gì (cấp độ, âm thanh, hiệu ứng, đồ hoạ), cách tính điểm (điểm tối đa thực tế ước
lượng so với SCORE_CAPS), chỗ nào chưa chắc. Ngắn gọn, tiếng Việt.
