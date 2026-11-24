/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 29 (soạn cùng `tap-5/ngay/ngay29.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang5.ts` (chặng Ngày 25–30) và đánh số liên tục cả chặng.
 * Dạng câu thi → bài ôn: xem `bai-on-ngay29.txt` (16 dạng Reading → t5d29-doc; 12 dạng Listening → t5d29-nghe).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_29: Block[] = [
  { t: "h", text: "(Ngày 29 · Bài 1 mục 4) Câu hỏi gián tiếp ở phòng thi" },
  {
    t: "patterns",
    rows: [
      { formula: "Could you tell me / Do you know + Wh- + S + V ?", vi: "Không đảo, không do / does / did.", examples: [{ en: "Could you tell me where the Speaking test takes place?", vi: "Anh / chị cho tôi biết bài thi Nói diễn ra ở đâu?" }] },
      { formula: "I was wondering + if / whether + S + could + V", vi: "Câu Yes / No gián tiếp, lịch sự.", examples: [{ en: "I was wondering if I could have another pair of headphones.", vi: "Tôi muốn hỏi liệu tôi có thể đổi tai nghe khác không." }] },
      { formula: "Sorry, would you mind repeating the question?  ·  When you say X, do you mean…?", vi: "Part 1: giám khảo chỉ nhắc lại · Part 3: có thể diễn đạt lại.", examples: [{ en: "When you say “technology”, do you mean the internet in general?", vi: "Khi anh nói “công nghệ”, ý là internet nói chung?" }] },
    ],
  },
  { t: "rule", formula: "Could you tell me / Do you know + Wh- + S + V ?   ·   I was wondering + if / whether + S + could…", vi: "Câu hỏi nằm trong câu khác ⇒ trật tự câu kể." },

  { t: "h", text: "(Ngày 29 · Bài 1 mục 5) Câu mua giờ có rào đón (Speaking Part 3)" },
  {
    t: "table",
    head: ["Tình huống", "Khung câu"],
    rows: [
      ["Chưa từng nghĩ tới", "That's not something I've given much thought to, but I suppose + S + V"],
      ["Câu hỏi về nhóm lớn", "It's hard to generalise, but I'd imagine + S + would + V"],
      ["Cần một ví dụ / cái tên", "Off the top of my head, I'd probably say + N"],
      ["Không biết dữ kiện", "I'm honestly not sure — but if I had to guess, I'd say…"],
    ],
  },
  { t: "rule", formula: "câu mua giờ (3–4 giây) + but + ý chính trong MỘT câu + lý do + ví dụ", vi: "Mua giờ mà không có ý chính ngay sau đó thì chỉ là ngừng dài hơn." },

  { t: "h", text: "(Ngày 29 · Bài 1 mục 8) Câu “kéo về đề” khi viết lạc một nửa" },
  {
    t: "patterns",
    rows: [
      { formula: "What this means for + [trọng tâm đề] + is that + S + V", vi: "Câu chẻ giả đưa trọng tâm đề lên đầu.", examples: [{ en: "What this means for schools is that exam results cannot be the only measure.", vi: "Điều này có nghĩa với nhà trường là điểm thi không thể là thước đo duy nhất." }] },
      { formula: "This matters because + S + V, which is precisely why + [lập trường]", vi: "Nối ví dụ về lập trường.", examples: [{ en: "This matters because the poor are the most affected, which is precisely why a law is needed.", vi: "Điều này quan trọng vì người nghèo bị ảnh hưởng nhiều nhất, và chính vì thế cần có luật." }] },
      { formula: "It is for this reason that + S + V", vi: "Câu chẻ it is… that chốt đoạn.", examples: [{ en: "It is for this reason that I believe the government should intervene.", vi: "Chính vì lý do này mà tôi tin chính phủ nên can thiệp." }] },
    ],
  },
  { t: "rule", formula: "What this means for + [trọng tâm đề] + is that…   ·   It is for this reason that…", vi: "Một câu cuối đoạn nói rõ đoạn đó trả lời câu hỏi thế nào — tối đa một lần mỗi bài." },

  { t: "h", text: "(Ngày 29 · Bài 1 mục 3 · 11–13) Ngày thi và sau ngày thi — những con số cần nhớ" },
  {
    t: "table",
    head: ["Mục", "Nhớ"],
    rows: [
      ["Thứ tự", "Listening → Reading → Writing liền mạch, không nghỉ · Speaking riêng (cùng ngày hoặc trong vài ngày — xem thư xác nhận)"],
      ["Listening", "~30 phút · thi giấy +10 phút chép · thi máy ~2 phút soát"],
      ["Reading · Writing · Speaking", "60 · 60 · 11–14 phút"],
      ["Band tổng", "trung bình 4 kỹ năng, làm tròn tới .5 gần nhất (.25 → lên .5 · .75 → lên số nguyên)"],
      ["Phúc khảo (EOR)", "trong 6 tuần · chọn kỹ năng · điểm có thể tăng / giữ / giảm · phí, hoàn phí: kiểm tra trên trang của IDP / British Council"],
      ["One Skill Retake", "trong 60 ngày · một kỹ năng · một lần / bài thi gốc · phiếu mới, phiếu cũ vẫn còn · hỏi nơi nhận có chấp nhận không"],
    ],
  },
  { t: "rule", formula: "D-14 kiểm giấy tờ · D-3 dừng học mới · D-1 ngủ trước 23 giờ · lỡ 1 câu ⇒ chỉ mất 1 câu · không bao giờ để trống", vi: "Quy định thi có thể thay đổi — thư xác nhận và trang chính thức là nguồn đúng." },

  { t: "h", text: "(Ngày 29 · Bài 3 mục 6) Chép đáp án Listening" },
  { t: "rule", formula: "đáp án đúng = đúng nghĩa + đúng chính tả + đúng số nhiều + đúng giới hạn từ", vi: "Chữ số hay chữ đều được · IN HOA được · từ có gạch nối thường tính là một từ · ký hiệu đã in sẵn (£, %) không chép lại." },
];
