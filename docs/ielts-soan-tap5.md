# Soạn IELTS Tập 5 (band 7.0 → 8.0) — hướng dẫn cho agent (24/11/2026)

Người học thật: sinh viên IT Việt Nam, đích IELTS Academic 7.5–8.0, đã xong Tập 1–4. Học ở `cuongthai.com/language/en/ielts/tap-5`
và app iOS CT Language. CHẤT LƯỢNG + ĐẦY ĐỦ + CHUYÊN SÂU trên hết. KHÔNG chép đề Cambridge / sách có bản quyền — mọi bài đọc,
kịch bản nghe, đề viết/nói, câu ví dụ đều TỰ SOẠN. Dữ kiện thật phải đúng (không chắc ⇒ làm mờ hoặc hư cấu có ghi rõ).
Tự làm tuần tự, KHÔNG tách agent con (tối đa 3 agent chạy cùng lúc). Không git add/commit. Không chạy tsc/next build toàn bộ.

## Đọc trước (bắt buộc)
1. `frontend/src/app/language/[code]/ielts/SOAN-BAI.md` — TOÀN BỘ (khối, văn phong, recap/rule/dịch 💡, các mục "Soạn Tập 2/3/4").
2. `docs/ielts-lo-trinh-0-8.md`: mục 0, 1 (band 8 làm được gì), mục 2 (mã G/V/R/L/W/S/X/E), **mục 3.5 (bảng 30 ngày Tập 5)**, mục 3.6 "Tập 5",
   **mục 4.1–4.2 (khuôn đề + dòng Đề 9–12 + quy tắc soạn đề: Đề 10–12 ≈ 180 wpm, tỉ lệ bẫy cao)**, mục 6.
3. `frontend/src/components/sach-hoc/types.ts` (Block, Lesson — đúng tên trường) và `…/ielts/thi-may/de/types.ts` (đề).
4. Mẫu đã soát: Tập 4 `…/ielts/tap-4/ngay/ngay13.ts` (ngày lẻ), `ngay14.ts` (ngày chẵn), `ngay6.ts` (kiểm tra chặng); đề
   `…/ielts/thi-may/de/{nghe,doc,viet,noi}-de8.ts`. Tập 5 phải NỐI lại và nâng lên band 8, KHÔNG lặp y nguyên.
5. KHÔNG trùng đề tài: grep tiêu đề + chủ đề chính mọi passage/kịch bản trong `tap-3/ngay/`, `tap-4/ngay/`, `tap-5/ngay/`,
   `thi-may/de/` trước khi chọn đề tài. Đã dùng (ví dụ): container, open-plan office, phát minh đồng thời, buôn băng, hệ mét,
   than bùn, tảo bẹ, lõi băng, xếp hàng, thang máy, cốc đặt cọc, giờ đường sắt, ô dù, giá 99, nghịch lý lựa chọn, tiền giấy, dơi,
   vân tay, rác không gian, Gutenberg, Vermeer, khảo cổ từ trên không, pin mặt trời, nudge…
   **Đề 9–12 (Tập 5) đã dùng:** cáo bạc Novosibirsk, toàn cầu hoá bạc/Manila, Popper–Kuhn, gửi chó, vườn thuê, dỡ đập, citizen science,
   sóng động đất/lòng Trái Đất, ngôn ngữ ký hiệu Nicaragua, AI công bằng, kho tự quản, ngày hội di sản, lịch sử truyền miệng, âm học phòng
   hoà nhạc, MONIAC, bản đồ trong não, phối cảnh, vé phà, bể bơi ngoài trời, khảo sát thử sinh vật đáy suối (thay app đặt phòng thư viện — trùng T4 N12), lịch sử dự báo thời tiết, chai nhựa →
   áo nỉ, trả cổ vật, scurvy/James Lind, Linear B, chuyên gia dự báo, thuê thuyền kênh, phòng tối tráng phim cộng đồng (thay thư viện dụng cụ — trùng T4 N28), biển chỉ đường bệnh viện, qanat,
   tình nguyện theo tuổi, gặp người thật ở dịch vụ công. **Thẻ Part 2 đã dùng ở đề:** a time you persuaded someone to look at a decision differently (đổi 24/11 — thẻ “changed your mind” trùng Tập 4 Ngày 30),
   a tradition you hope will continue, an achievement you did not think you were capable of, a conversation with a stranger you remember.
   Part 1 đã dùng ở đề: Photography, Celebrations, Colours, Weekends, Numbers, Clothes, Mirrors, Patience.

## Ngày học — `frontend/src/app/language/[code]/ielts/tap-5/ngay/ngayN.ts`
- `import type { Lesson } from '../data';` rồi `export const NGAY_N: Lesson[] = [ … ];` (chỉ `import type`).
- Khuôn: lẻ = grammar · reading · bài 3; chẵn = vocab · writing · bài 3; bài 3 = listening khi N mod 4 ∈ {0,1}, speaking khi ∈ {2,3};
  + homework (≥ 30 câu có đáp án); + review `t5dN-kiem-tra` ở N ∈ {6,12,18,24,30} (gom 6 ngày, ≥ 70 % từng phần, chỉ rõ ôn Ngày nào).
- MỌI id bắt đầu `t5dN-`, duy nhất. Đúng 1 khối `phatam`/ngày.
- **Ngày có đề (N8, N16, N24, N30):** bài Writing/Listening của ngày đó HƯỚNG DẪN làm đề ở Online Test (`/language/en/ielts/thi-may`,
  bộ Đề 9/10/11/12) — chiến thuật, phân giờ, checklist trước/sau — KHÔNG chép lại nội dung đề vào ngày.
- **Ngày mổ đề (N9, N10, N17, N22, N25):** đọc tệp đề thật (`thi-may/de/*-de9.ts`…) và phân tích từng câu dễ sai: vì sao đúng, bẫy
  paraphrase ở đâu (trích ngắn), lỗi người Việt hay mắc; bài tập luyện lại cùng KỸ NĂNG với câu MỚI (không lặp câu đề).
- Mức band 8: mẫu **band 7 và band 8 đặt cạnh nhau** + bảng 4 tiêu chí; passage mức Passage 3 khó (~900–1000 từ, lập luận trừu tượng,
  paraphrase mức 4); nghe tốc độ thật (~170–180 wpm), giọng trộn uk/us/au/ca/nz/ie (Scotland KHÔNG có giọng máy — không giả).
- Ghi thêm vào `docs/ielts-tap5-phu/` (tạo nếu chưa có): `tracuu-ngayN.ts` (`import type { Block } from '@/components/sach-hoc/types';
  export const TRA_N: Block[] = [ … ]` — mỗi điểm ngữ pháp/khung câu mới: `h` "(Ngày N · mục M) …" + patterns/table + rule) và
  `bai-on-ngayN.txt` (mỗi dòng `dang<TAB>id-bài` cho dạng câu thi bài dạy; dạng: note form sentence summary table flow diagram short
  summary-box mcq mcq2 tfng ynng heading match-info match-feature match-ending map). Không sửa index.ts/manifest/data/tracuu/cham.ts.
- Kiểm: `cd frontend && node --experimental-strip-types --no-warnings scripts/ielts-kiem-ngay.mts 5 <N> <N>` ⇒ ✓.

## Đề thi — `frontend/src/app/language/[code]/ielts/thi-may/de/{nghe,doc,viet,noi}-deK.ts` (K = 9…12)
- Theo dòng Đề K ở mục 4.2. 40 + 40 câu, `ev` là chuỗi con NGUYÊN VĂN, 1–40 liên tục, rải đều đáp án, đáp án duy nhất; Writing có bài
  mẫu band 8–8.5 kèm phần soi (cố ý giữ 1–2 lỗi nhỏ để người học tìm); Speaking đủ Part 1–3.
- Đăng ký trong `thi-may/de/index.ts` (MUC_LUC `boDe: 'Đề K'`, `capDo`, tên "… — Đề K (Tập 5 · Ngày N)"; TEP_DE; bộ `bo-0K`/`bo-1K`
  theo thứ tự số) + test trong `frontend/src/lib/ielts/thiMayCham.test.ts` (kiemDe 2 đề + test khuôn kiểu Đề 8). Agent khác có thể đang
  sửa cùng hai tệp này: dùng Edit theo từng chỗ nhỏ, đọc lại tệp nếu Edit báo tệp đã đổi, giữ thứ tự bộ đề tăng dần.
- Đề 9 dùng thẻ Part 2 "a time you persuaded someone to look at a decision differently" (thẻ "changed your mind" đã dùng ở Tập 4 Ngày 30) ⇒ ngày học N14 KHÔNG dùng lại hai thẻ đó (chọn đề hiếm khác).
- Kiểm: `cd frontend && npx tsx --test src/lib/ielts/thiMayCham.test.ts` ⇒ pass hết.

## Báo lại (tiếng Việt, ≤ 200 từ)
Nội dung chính, số câu, độ dài passage/kịch bản, giọng, đã nối Tập 4 ở đâu, chỗ chưa chắc.
