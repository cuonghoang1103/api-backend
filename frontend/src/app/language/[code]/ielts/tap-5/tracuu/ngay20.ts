/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 20 (soạn cùng tap-5/ngay/ngay20.ts, 24/11/2026).
 * Phiên ghép chặng 4 chép mảng này vào `tap-5/tracuu-chang4.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_20: Block[] = [
  { t: "h", text: "(Ngày 20 · Bài 2 mục 1–3) Problem / solution band 8 — cơ chế, tầng, ưu tiên, giới hạn" },
  {
    t: "table", head: ["Đề hỏi", "Thân bài 1", "Thân bài 2"],
    rows: [
      ["problems + solutions", "2 vấn đề, mỗi vấn đề một chuỗi hệ quả", "giải pháp cho CHÍNH hai vấn đề đó"],
      ["causes + measures", "2 nguyên nhân có cơ chế (thứ đã THAY ĐỔI nếu đề có growing / more and more)", "giải pháp đánh vào đúng nguyên nhân"],
      ["problems + who should solve", "2 vấn đề", "ai làm gì, vì sao chủ thể đó"],
    ],
  },
  {
    t: "table", head: ["Mắt xích", "Band 8 làm gì"],
    rows: [
      ["Nguyên nhân", "một câu cơ chế: A dẫn đến B vì…"],
      ["Tầng", "cá nhân · tổ chức · cấu trúc — giải pháp đặt đúng tầng của nguyên nhân"],
      ["Ưu tiên", "giải pháp mạnh nhất đứng đầu: the priority should be…"],
      ["Giới hạn", "would help at the margin, but… · would merely move the problem · cannot V, yet matters because…"],
    ],
  },
  { t: "rule", formula: "Nguyên nhân + cơ chế  →  giải pháp đúng tầng + vì sao hiệu quả  →  ưu tiên  →  một giới hạn", vi: "Ma trận 4 phút trước khi viết." },

  { t: "h", text: "(Ngày 20 · Bài 2 mục 7) Sáu khung câu cho phần giải pháp" },
  {
    t: "patterns",
    rows: [
      { formula: "The most effective response would target N, since S V.", vi: "Ưu tiên + lý do.", examples: [{ en: "The most effective response would target the lack of daylight, since that is what has changed most in children's lives.", vi: "Biện pháp hiệu quả nhất sẽ nhắm vào việc thiếu ánh sáng ban ngày, vì đó là điều thay đổi nhiều nhất trong đời sống trẻ." }] },
      { formula: "It follows that the priority should be N rather than M.", vi: "Suy giải pháp từ nguyên nhân.", examples: [{ en: "It follows that the priority should be prevention rather than treatment.", vi: "Suy ra ưu tiên nên là phòng ngừa chứ không phải chữa trị." }] },
      { formula: "It is essential that N be V3, since S V.", vi: "Thức giả định — một lần mỗi bài.", examples: [{ en: "It is essential that landlords be required to register, since unregistered flats cannot be inspected.", vi: "Điều cốt yếu là chủ nhà phải bị buộc đăng ký, vì nhà không đăng ký thì không kiểm tra được." }] },
      { formula: "N would help at the margin, but on its own it would merely V.", vi: "Giới hạn của giải pháp phụ.", examples: [{ en: "Higher fines would help at the margin, but on their own they would merely punish those with no alternative.", vi: "Phạt nặng hơn giúp được chút ít, nhưng tự nó chỉ trừng phạt người không có lựa chọn khác." }] },
      { formula: "N cannot V, yet it matters, because S V.", vi: "Giữ một giải pháp yếu, nói đúng vai của nó.", examples: [{ en: "Awareness campaigns cannot change behaviour by themselves, yet they matter, because policies without public support rarely survive.", vi: "Chiến dịch nhận thức tự chúng không đổi được hành vi, nhưng vẫn quan trọng, vì chính sách thiếu ủng hộ hiếm khi tồn tại." }] },
      { formula: "Responsibility should lie with N rather than M, because S V.", vi: "Ai làm — và vì sao.", examples: [{ en: "Responsibility should lie with schools rather than parents, because only schools reach every child.", vi: "Trách nhiệm nên thuộc về nhà trường hơn là phụ huynh, vì chỉ nhà trường tiếp cận được mọi đứa trẻ." }] },
    ],
  },
  { t: "rule", formula: "The most effective response would target N, since…  ·  It is essential that N be V3  ·  N would help at the margin, but…", vi: "Ba khung đủ cho một thân bài giải pháp: ưu tiên – đề xuất – giới hạn." },

  { t: "h", text: "(Ngày 20 · Bài 1 mục 5) Trọng âm dời trong họ từ" },
  {
    t: "table", head: ["Từ gốc", "Dạng dời", "Hậu tố"],
    rows: [
      ["PHOtograph · phoTOgrapher", "photoGRAphic", "-ic"],
      ["biOlogy", "bioLOgical", "-ical"],
      ["hyPOthesis", "hypoTHEtical", "-ical"],
      ["TERritory", "terriTOrial", "-ial"],
      ["PArent", "paRENtal", "-al"],
      ["eCOnomy", "ecoNOmic", "-ic"],
    ],
  },
  { t: "rule", formula: "-ic · -ical · -ial · -ity · -ion → trọng âm rơi vào âm tiết NGAY TRƯỚC hậu tố", vi: "Nguyên âm không nhấn yếu thành /ə/." },

  { t: "h", text: "(Ngày 20 · Bài 3 mục 5) Listening — câu báo hiệu “đáp án là cái đến sau”" },
  {
    t: "table", head: ["Câu báo", "Đáp án nằm ở"],
    rows: [
      ["People often assume… but in fact…", "sau in fact"],
      ["The manufacturers will tell you… In practice…", "sau In practice"],
      ["You'll hear people say X, but Y is…", "Y"],
      ["X alone is remarkable. But what genuinely astonished…", "sau But"],
      ["You might think… Quite the opposite.", "ý ngược với You might think"],
      ["X would be lovely… But no, …", "sau But no"],
    ],
  },
];
