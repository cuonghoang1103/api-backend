/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 14 (soạn cùng tap-5/ngay/ngay14.ts, 24/11/2026).
 * Phiên ghép chặng 3 chép mảng này vào `tap-5/tracuu-chang3.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 * Ngày 14 không dạy dạng câu Reading / Listening nào ⇒ `bai-on-ngay14.txt` để trống.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_14: Block[] = [
  { t: "h", text: "(Ngày 14 · Bài 2 mục 2–3) Task 2 trộn dạng — đếm nhiệm vụ rồi mới chọn khung" },
  {
    t: "table", head: ["Kiểu đề", "Nhiệm vụ thật", "Khung"],
    rows: [
      ["Nguyên nhân + đánh giá (Why…? Should this concern us?)", "① vì sao ② lập trường", "TB1 nguyên nhân · TB2 đánh giá có cân nhắc"],
      ["Opinion có câu hỏi phụ", "① lập trường ② đề xuất thêm", "TB1 lập trường + lý do · TB2 phần còn thiếu + đề xuất"],
      ["Discussion ngầm (A or B?)", "① xét A ② xét B ③ chọn", "hai thân bài có đánh giá; thesis chọn phía"],
      ["Adv / Disadv ngầm (Is this a welcome development?)", "① lợi ② hại ③ cân", "phía nhẹ → phía nặng"],
      ["Ba câu hỏi", "① nguyên nhân ② hệ quả ③ giải pháp", "TB1 nguyên nhân + hệ quả · TB2 giải pháp"],
      ["Chữ tuyệt đối (the best / the only)", "① nó giúp đến đâu ② có phải tốt nhất / duy nhất", "TB1 thừa nhận · TB2 so với cách khác"],
      ["Mệnh đề có tiền đề (Since / Because…)", "① tiền đề đúng không ② kết luận có theo sau không", "TB1 xét tiền đề · TB2 xét kết luận"],
    ],
  },
  { t: "rule", formula: "số nhiệm vụ = số dấu ? + số động từ lệnh + số chữ “gài”   →   mỗi nhiệm vụ lớn = một thân bài   →   thesis trả lời TỪNG nhiệm vụ", vi: "Công thức nhận dạng mọi đề Task 2, quen hay lạ." },

  { t: "h", text: "(Ngày 14 · Bài 2 mục 7) Thesis hai vế cho đề trộn" },
  {
    t: "patterns",
    rows: [
      { formula: "I would argue that + (trả lời ①), and that + (trả lời ②)", vi: "Hai mệnh đề that song song.", examples: [{ en: "I would argue that this gap owes less to laziness than to the way sport is now sold, and that it is a cause for concern only in so far as watching has come to replace playing.", vi: "Tôi cho rằng khoảng cách này do cách thể thao được bán hơn là do lười, và nó chỉ đáng lo trong chừng mực xem thay thế chơi." }] },
      { formula: "Although S V, I disagree that + (chữ tuyệt đối)", vi: "Đề có the best / the only.", examples: [{ en: "Although compulsory sport would benefit many pupils, I disagree that it is the best way to improve public health.", vi: "Dù thể thao bắt buộc có lợi cho nhiều học sinh, tôi không đồng ý đó là cách tốt nhất để cải thiện sức khoẻ cộng đồng." }] },
      { formula: "While it is true that S V, it does not follow that S V", vi: "Đề có tiền đề.", examples: [{ en: "While it is true that the past cannot be changed, it does not follow that studying it is pointless.", vi: "Dù đúng là không đổi được quá khứ, điều đó không có nghĩa học về nó là vô ích." }] },
      { formula: "S V only in so far as / only to the extent that + S V", vi: "Lập trường có điều kiện.", examples: [{ en: "Such spending is justified only to the extent that the facilities remain in public use afterwards.", vi: "Khoản chi như vậy chỉ chính đáng trong chừng mực công trình vẫn được công chúng dùng về sau." }] },
    ],
  },
  { t: "rule", formula: "I would argue that + (①), and that + (② — only in so far as …)", vi: "Đọc xong mở bài, người chấm biết câu trả lời cho từng câu hỏi của đề." },

  { t: "h", text: "(Ngày 14 · Bài 3 mục 3) Part 2 đề hiếm — bốn chặng và câu “nhìn lại”" },
  {
    t: "table", head: ["Chặng", "Thời lượng", "Ngôn ngữ"],
    rows: [
      ["① Cảnh", "20–25 giây", "I'd just… · I was sitting… (quá khứ tiếp diễn + hoàn thành)"],
      ["② Chỗ rẽ (chữ hẹp của thẻ)", "30–35 giây", "Then, at about… · It turned out that… · sure enough"],
      ["③ Phản ứng bên trong", "20–25 giây", "My stomach dropped. · I was convinced that… · To begin with, I was furious."],
      ["④ Nhìn lại", "30–40 giây", "Looking back, … · What I hadn't done was… · So these days I…"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "What I hadn't done / realised was (that) S V", vi: "Phần lỗi của mình khi nhìn lại.", examples: [{ en: "What I hadn't done was read past the first line.", vi: "Điều tôi đã không làm là đọc quá dòng đầu tiên." }] },
      { formula: "Had I + V3, I would (probably) have + V3", vi: "Điều kiện loại 3 đảo ngữ — một lần, ở chặng ④.", examples: [{ en: "Had I checked the address, I would probably have noticed.", vi: "Nếu tôi đã kiểm địa chỉ thì có lẽ tôi đã nhận ra." }] },
    ],
  },
  { t: "rule", formula: "chuyện quen + chữ hẹp của thẻ làm “chỗ rẽ” + 30 giây nhìn lại  =  câu trả lời cho thẻ hiếm", vi: "Không cần chuyện mới; cần đặt đúng thứ thẻ hỏi vào giữa chuyện." },

  { t: "h", text: "(Ngày 14 · Bài 3 mục 7) Nhấn tương phản khi sửa thông tin" },
  { t: "rule", formula: "Not X. Y.   ·   It wasn't X. It was Y.   →   nhấn X và Y; mọi từ khác nói nhẹ, nhanh", vi: "It wasn't onLINE. It was at their OFfice. — The first message DID say online." },
];
