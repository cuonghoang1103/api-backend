/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 18 (soạn cùng `tap-5/ngay/ngay18.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang3.ts` (TRA_CONG_THUC_CHANG3) và đánh số "K." liên tục cả chặng.
 * Ngày 18 không dạy dạng câu Reading / Listening nào ⇒ `bai-on-ngay18.txt` để trống.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_18: Block[] = [
  { t: "h", text: "(Ngày 18 · Bài 1 mục 1 · 7) Idiom vòng cuối — bốn luật" },
  { t: "rule", formula: "idiom band 8  =  nguyên dạng  +  đúng việc (lập luận / kể / thương lượng)  +  1 cụm mỗi câu trả lời  +  một chữ làm mềm (a bit of a… · something of a…)", vi: "Task 2: chỉ vài cụm trung tính (a wake-up call · a vicious circle · common ground), tối đa một lần mỗi bài." },

  { t: "h", text: "(Ngày 18 · Bài 1 mục 6) Nói giảm kiểu Anh (understatement)" },
  {
    t: "table",
    head: ["Khuôn", "Ví dụ", "Nghĩa thật"],
    rows: [
      ["less than + adj tốt", "The timing is less than ideal.", "có vấn đề"],
      ["not exactly + adj tốt", "It's not exactly cheap.", "đắt"],
      ["on the + adj + side", "The room is on the small side.", "hơi nhỏ"],
      ["leave something to be desired", "The service left something to be desired.", "chưa đạt"],
      ["room for improvement", "There's room for improvement in the conclusion.", "phải làm tốt hơn"],
      ["a bit of a stretch", "Calling it a revolution is a bit of a stretch.", "gượng ép, khó tin"],
    ],
  },
  { t: "rule", formula: "less than + adj tốt   ·   not exactly + adj tốt   ·   on the + adj + side", vi: "Nói giảm dành cho NHẬN XÉT; con số, hạn chót, lỗi an toàn thì nói thẳng." },

  { t: "h", text: "(Ngày 18 · Bài 2 mục 3) Task 1 map — tám khuôn tương lai và thang chắc chắn" },
  {
    t: "patterns",
    rows: [
      { formula: "S + is / are + to be + V3   ·   S + is due to be + V3", vi: "Kế hoạch đã quyết, có lịch — khuôn nền.", examples: [{ en: "The warehouse is to be demolished; the bridge is due to be completed by 2030.", vi: "Nhà kho sẽ bị phá; cây cầu dự kiến hoàn thành trước 2030." }] },
      { formula: "S + is earmarked for + N   ·   There are plans to + V   ·   the proposed + N", vi: "Nêu ý định / mục đích của khu đất.", examples: [{ en: "The waste ground is earmarked for a cycle hub.", vi: "Khu đất trống được dành cho một bãi xe đạp." }] },
      { formula: "S + is expected / likely to + V", vi: "DỰ BÁO — chỉ khi đề viết expected / possible / projected.", examples: [{ en: "The work is expected to be finished by 2032.", vi: "Công việc dự kiến xong trước 2032." }] },
      { formula: "By + năm, + S + will have been + V3", vi: "Nhìn lại từ mốc cuối — dùng một lần, ở thay đổi lớn nhất.", examples: [{ en: "By 2032, the forecourt will have become a public square.", vi: "Tới 2032, sân trước ga sẽ đã thành quảng trường." }] },
    ],
  },
  { t: "rule", formula: "At present, S + V(s/es) …   →   Under the plan / By + năm, S + is to be + V3 …", vi: "Mỗi bản đồ một thì; mỗi lần đổi bản đồ một cụm thời gian. Không will ở mọi câu, không be going to." },

  { t: "h", text: "(Ngày 18 · Bài 2 mục 7 · 8) Gói thay đổi có tương lai · sơ đồ mặt bằng" },
  {
    t: "table",
    head: ["Khuôn", "Ví dụ"],
    rows: [
      ["is to be cleared to make way for + N", "The goods yard is to be cleared to make way for apartments."],
      ["is to be replaced by N on half its footprint, freeing… for…", "…replaced by a multi-storey building on half its footprint, freeing the remaining land for a bus interchange."],
      ["will survive, converted into + N", "The signal box will survive, converted into a café."],
      ["S, at present taken up by N, will have become N by…", "The forecourt, at present taken up by a taxi rank, will have become a public square by 2032."],
      ["floor plan: be divided into · be knocked through to form · be fitted out as · open onto", "The hall is to be divided into two studios; the café will open onto a terrace."],
    ],
  },
  { t: "rule", formula: "overview map band 8  =  [hướng thay đổi về CHỨC NĂNG]  +  [cái được giữ]", vi: "Chia thân bài theo KHU, không theo từng công trình. Không nêu lý do, không đoán lợi ích." },

  { t: "h", text: "(Ngày 18 · Bài 3 mục 2) Thương lượng vòng hai — bốn nước đi khi đề xuất đầu bị từ chối" },
  {
    t: "patterns",
    rows: [
      { formula: "Can I ask what's behind + N?   ·   Help me understand + wh- + S + V", vi: "① Hỏi lý do thật (lợi ích sau lập trường).", examples: [{ en: "Can I ask what's behind the date?", vi: "Tôi hỏi được không, đằng sau cái ngày ấy là gì?" }] },
      { formula: "I could + V + if + you could + V", vi: "② Đổi một thứ lấy một thứ.", examples: [{ en: "I could move on the price if you could commit to two years.", vi: "Tôi có thể xê dịch về giá nếu anh cam kết hai năm." }] },
      { formula: "N + is off the table, because + sự kiện.   ·   That's the one thing I can't move on.", vi: "③ Giới hạn đỏ — không rào, kèm sự kiện.", examples: [{ en: "A full refund is off the table, because the licence has already been used.", vi: "Hoàn tiền toàn bộ thì không được, vì giấy phép đã dùng rồi." }] },
      { formula: "Can I come back to you (on that) + by + mốc?", vi: "④ Tạm dừng có hẹn.", examples: [{ en: "Can I come back to you on the price by Friday noon?", vi: "Tôi trả lời anh về giá trước trưa thứ Sáu được không?" }] },
    ],
  },
  { t: "rule", formula: "bị từ chối  →  ① hỏi lý do thật  →  ② could… if you could…  →  ③ X is off the table, because…  →  ④ Can I come back to you by…?", vi: "Không lặp lại đề xuất cũ. Không nhượng mà không lấy lại gì." },

  { t: "h", text: "(Ngày 18 · Bài 3 mục 4 · 5 · 7) Hedging giao tiếp đúng liều · ba người · khi bị diễn giải sai" },
  {
    t: "table",
    head: ["Việc", "Khung câu"],
    rows: [
      ["Rào lời đề nghị", "I was wondering if we could… · I don't suppose you could…?"],
      ["Rào lời sửa", "I may be missing something, but… · Correct me if I'm wrong, but…"],
      ["KHÔNG rào", "con số · hạn chót · giới hạn đỏ: I need it by Thursday at five."],
      ["Chen lời · giữ lượt", "Sorry to cut in — … · Could I just finish this point?"],
      ["Đồng minh · tóm lại", "Building on what Lan said, … · Can I check I've understood both positions?"],
      ["Giám khảo diễn giải sai", "Not quite — I'd put it differently. · That's a stronger claim than I'd want to make."],
    ],
  },
  { t: "rule", formula: "RÀO: lời đề nghị · tin xấu · lời sửa · góp ý        KHÔNG RÀO: con số · hạn chót · giới hạn đỏ", vi: "Một câu, một công cụ rào. Ngữ điệu: ↗ ở đề xuất thăm dò, ↘ chắc ở giới hạn đỏ." },
];
