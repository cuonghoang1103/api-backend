/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 1 (soạn cùng `tap-5/ngay/ngay1.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang1.ts` (TRA_CONG_THUC_CHANG1) và đánh số "K." liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_1: Block[] = [
  { t: 'h', text: '(Ngày 1 · mục 0) Lộ trình Tập 5 — 4 đề và ngày mổ đề' },
  { t: 'table', head: ['Đề', 'Làm ở', 'Mức', 'Mổ đề ở'], rows: [['Đề 9', 'Ngày 8', 'band 7.0–7.5', 'Ngày 9 · 10'], ['Đề 10', 'Ngày 16', 'band 7.5', 'Ngày 17 · 22'], ['Đề 11', 'Ngày 24', 'band 8.0', 'Ngày 25'], ['Đề 12 “Final”', 'Ngày 30', 'band 8.0', 'tự mổ theo mẫu Ngày 25']] },
  { t: 'rule', formula: 'học 6–7 ngày → làm đề đúng giờ → mổ đề → Sổ lỗi → viết lại / nói lại', vi: 'Một vòng của Tập 5, lặp 4 lần. Mục tiêu Nghe · Đọc: 32 → 33 → 35 → 35 / 40.' },

  { t: 'h', text: '(Ngày 1 · mục 1) GRA band 8 — tỉ lệ câu sạch' },
  { t: 'table', head: ['', 'Band 7', 'Band 8'], rows: [['Phạm vi', 'nhiều cấu trúc phức', 'phạm vi rộng, linh hoạt'], ['Độ chính xác', 'câu không lỗi thường xuyên', 'đa số câu không lỗi'], ['Lỗi còn lại', 'một số lỗi', 'rất thỉnh thoảng, lặt vặt']] },
  { t: 'rule', formula: 'tỉ lệ câu sạch = số câu không lỗi ÷ tổng số câu  (đích: 11–12 / 13 câu của một bài Task 2)', vi: 'Thước đo tự theo dõi của khoá. Thứ tự ưu tiên: đúng → rõ → đa dạng.' },

  { t: 'h', text: '(Ngày 1 · mục 2) Bản đồ thì của một bài viết' },
  { t: 'table', head: ['Loại câu', 'Thì', 'Ví dụ'], rows: [['Sự thật chung, lập luận', 'hiện tại đơn', 'Public transport reduces congestion only if it is reliable.'], ['Xu hướng kéo tới bây giờ', 'hiện tại hoàn thành', 'Online shopping has become the norm in many cities.'], ['Ví dụ có mốc', 'quá khứ đơn', 'When Sweden introduced the tax in 1991, emissions fell.'], ['Trước một mốc quá khứ', 'quá khứ hoàn thành', 'By 2010, the figure had already halved.'], ['Hệ quả giả định', 'would / could + V', 'A total ban would simply push the trade underground.'], ['Dự báo Task 1', 'be projected / expected to + V', 'Sales are projected to reach 5 million by 2040.'], ['Dẫn nghiên cứu', 'found (quá khứ) + điều rút ra (hiện tại)', 'A 2019 survey found that most commuters prefer flexible hours.']] },
  { t: 'rule', formula: 'sự thật = V(s/es)  ·  xu hướng tới nay = have/has + V3  ·  ví dụ có mốc = V2  ·  trước mốc đó = had + V3  ·  giả định = would + V', vi: 'Mỗi lần đổi thì trong một đoạn phải có lý do.' },

  { t: 'h', text: '(Ngày 1 · mục 3) Bốn bẫy thì ở band 7.5' },
  { t: 'patterns', rows: [
    { formula: 'When / Once / Until / As soon as + S + V(s/es) hoặc has + V3, S + will + V', vi: 'Mệnh đề thời gian nói về tương lai: hiện tại, không will.', examples: [{ en: 'Once the bridge has been completed, journey times will fall by half.', vi: 'Một khi cây cầu xây xong, thời gian đi lại sẽ giảm một nửa.' }] },
    { formula: 'By + mốc tương lai, S + will have + V3', vi: 'Tính tới lúc đó đã xong.', examples: [{ en: 'By 2040, wind power will have overtaken gas.', vi: 'Đến 2040, điện gió sẽ đã vượt khí đốt.' }] },
    { formula: 'By the time + S + V2, S + had + V3', vi: 'Việc xong trước một mốc quá khứ.', examples: [{ en: 'By the time help arrived, the fire had destroyed the roof.', vi: 'Lúc cứu hộ tới, lửa đã thiêu rụi mái nhà.' }] },
    { formula: 'S + believe / know / own / consist of / contain / depend on (không V-ing)', vi: 'Động từ trạng thái không dùng tiếp diễn.', examples: [{ en: 'The board consists of twelve members.', vi: 'Hội đồng gồm mười hai thành viên.' }] },
  ] },
  { t: 'rule', formula: 'when / once / until + S + V(s/es)  ·  By + mốc tương lai → will have + V3  ·  By the time + V2 → had + V3', vi: 'Sau từ nối thời gian không có will; By luôn đi với thì hoàn thành. This is the first time + hiện tại hoàn thành.' },

  { t: 'h', text: '(Ngày 1 · mục 5) Hedging band 8 — đúng liều' },
  { t: 'patterns', rows: [
    { formula: 'There is + some / little / growing / no clear + evidence + (to suggest) that + S + V', vi: 'Rào đón bằng lượng bằng chứng.', examples: [{ en: 'There is little evidence to suggest that harsher sentences deter crime.', vi: 'Có rất ít bằng chứng cho thấy án nặng hơn ngăn được tội phạm.' }] },
    { formula: 'This is not to say that + S + V   ·   It would be an oversimplification to + V', vi: 'Giới hạn chính nhận định của mình.', examples: [{ en: 'It would be an oversimplification to blame rising rents on tourism alone.', vi: 'Đổ lỗi tiền thuê nhà tăng chỉ cho du lịch là đơn giản hoá quá mức.' }] },
    { formula: 'S + is by no means + adj / N   ·   S + do not necessarily + V   ·   S + tend not to + V', vi: 'Phủ định có mức độ.', examples: [{ en: 'A university degree is by no means a guarantee of employment.', vi: 'Bằng đại học hoàn toàn không phải là bảo đảm có việc làm.' }] },
  ] },
  { t: 'table', head: ['Bậc', 'Công cụ'], rows: [['Chắc', 'is / does · clearly · The figures show that…'], ['Khá chắc', 'tend to · generally · is likely to · The evidence suggests that…'], ['Có thể', 'may · appear to · arguably · There is some evidence that…'], ['Ít khả năng', 'is unlikely to · not necessarily · by no means · There is little evidence that…']] },
  { t: 'rule', formula: 'nhận định về thế giới: 1 hedge đúng bậc  ·  ý kiến của mình (thesis, kết bài): không hedge  ·  sự thật hiển nhiên: không hedge', vi: 'Không rào chồng (may possibly perhaps). evidence không đếm được; by no means luôn có s.' },

  { t: 'h', text: '(Ngày 1 · mục 6) Danh hoá có chọn lọc + giới từ sau danh từ' },
  { t: 'table', head: ['Giới từ', 'Danh từ'], rows: [['in', 'a rise · an increase · a fall · a decline · a reduction · investment · a change'], ['for', 'demand · the need · support · responsibility · a reason'], ['on', 'reliance · dependence · emphasis · an impact · an effect · a ban · a restriction'], ['to', 'access · an alternative · a solution · a threat · damage · a contribution'], ['of', 'a lack · a shortage · awareness · the likelihood · the introduction'], ['between', 'a link · a gap · a distinction · the relationship']] },
  { t: 'rule', formula: 'This / Such + N danh hoá + V …  (nối câu trước)    ·    thấy N of N of N → trả về S + V + O', vi: 'Danh hoá để nối và gọi tên; động từ để nói ai làm gì. an increase IN + thứ tăng / OF + con số.' },

  { t: 'h', text: '(Ngày 1 · Đọc mục 2–3) Reading band 8 — đọc một lần có ghi lề; paraphrase mức 4' },
  { t: 'table', head: ['Mức', 'Cách đổi', 'Ví dụ'], rows: [['1', 'đồng nghĩa', 'lower → fell'], ['2', 'đổi loại từ', 'surprised → expressed surprise'], ['3', 'đổi cấu trúc', 'No feedback had been given. → Participants were told nothing about their performance.'], ['4', 'ý ẩn', 'made in good faith → had not been trying to exaggerate']] },
  { t: 'rule', formula: '15 – 18 – 22 phút + 5 phút soát   ·   1 phút lướt câu hỏi → đọc trọn 1 lượt + ghi lề 3–5 chữ / đoạn → trả lời theo ghi chú → 1 phút soát', vi: 'Mỗi đoạn chỉ đọc kỹ tối đa hai lần. Bẫy band 8: đổi nhóm · hai kết quả hai mức chắc chắn · có thông tin nhưng không có phép so sánh (NOT GIVEN).' },

  { t: 'h', text: '(Ngày 1 · Nghe mục 2) Flap /t/ và glottal stop — nhận biết' },
  { t: 'table', head: ['Hiện tượng', 'Khi nào', 'Ví dụ'], rows: [['Flap [ɾ] ≈ /d/', '/t/ giữa hai nguyên âm, âm tiết sau không nhấn (Mỹ, Canada, Úc, NZ)', 'water · city · thirty · get it'], ['/nt/ → /n/', 'giữa hai nguyên âm (Mỹ, Canada)', 'twenty ≈ twenny · internet'], ['Glottal [ʔ]', '/t/ trước phụ âm, cuối câu, trước /n/; giữa hai nguyên âm ở nhiều giọng Anh', 'not now · button · water ≈ wa’er'], ['thirty / thirteen', 'flap làm /t/ không còn đáng tin', 'nghe trọng âm + /n/ cuối; chờ lời xác nhận (three-zero)']] },
  { t: 'rule', formula: 'nguyên âm + t + nguyên âm (không nhấn) → [ɾ] ≈ /d/   ·   t + phụ âm / cuối câu / -tton → [ʔ]', vi: 'Nghe thấy “d” ở chỗ chính tả phải là t — đừng viết d. Khi nói: đọc /t/ rõ, nhất quán. Bẫy Part 1 band 8: đổi góc nhìn (left khi ngồi = right nhìn từ trước).' },
];
