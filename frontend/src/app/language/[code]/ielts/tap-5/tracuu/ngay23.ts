/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 23 (soạn cùng tap-5/ngay/ngay23.ts, 24/11/2026).
 * Phiên ghép chặng 4 chép mảng này vào `tap-5/tracuu-chang4.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_23: Block[] = [
  { t: "h", text: "(Ngày 23 · mục 1) Bảng tự soát 6 lượt — lần 3 (band 8)" },
  {
    t: "table",
    head: ["Lượt", "Thêm ở lần 3"],
    rows: [
      ["1 · Động từ", "động từ tường thuật đúng thì · động từ sau từ định lượng · thì trong câu giả định"],
      ["2 · Danh từ", "danh từ trừu tượng nói chung không the · ≤ 2 cụm “the… of…” / câu"],
      ["3 · Ranh giới câu", ", which chỉ cả mệnh đề · không phẩy giữa chủ ngữ dài và động từ"],
      ["4 · Song song + từ loại", "than that of / those of · only sát từ bị giới hạn · not only / both… and song song"],
      ["5 · Liên kết", "this + danh từ tóm · it / they chỉ đúng một thứ · their cho người chung chung · một câu một chỗ rào"],
      ["6 · Chính tả + đề", "18 từ hay sai · Anh – Anh / Anh – Mỹ thống nhất · câu cuối trả lời đúng đề"],
    ],
  },
  { t: "rule", formula: "Động từ → Danh từ → Ranh giới câu → Song song + từ loại → Liên kết → Chính tả + đề", vi: "Mỗi lượt một loại lỗi; lần 3 thêm lỗi tinh của band 7.5." },

  { t: "h", text: "(Ngày 23 · mục 2) Động từ tường thuật và động từ sau từ định lượng" },
  {
    t: "patterns",
    rows: [
      { formula: "A study / The 2019 survey + V-ed", vi: "Nghiên cứu cụ thể, đã xong ⇒ quá khứ.", examples: [{ en: "A large survey in 2019 found that most commuters would cycle if the roads felt safer.", vi: "Một khảo sát lớn năm 2019 cho thấy đa số người đi làm sẽ đạp xe nếu đường an toàn hơn." }] },
      { formula: "Research / Studies + has / have V3", vi: "Khối nghiên cứu tích luỹ ⇒ hiện tại hoàn thành.", examples: [{ en: "Research has repeatedly shown that sleep affects how well we learn.", vi: "Nghiên cứu nhiều lần cho thấy giấc ngủ ảnh hưởng đến việc học." }] },
      { formula: "Each of / Every one of / Neither of / The number of + N số nhiều + V số ít", vi: "Chủ ngữ thật là each / one / neither / number.", examples: [{ en: "Each of the proposals has its merits.", vi: "Mỗi đề xuất đều có cái hay." }] },
      { formula: "The majority of / Half of + N số nhiều → V số nhiều · + N không đếm được → V số ít", vi: "Động từ theo danh từ sau of.", examples: [{ en: "Half of the students work part-time, but half of the land is unused.", vi: "Một nửa sinh viên làm bán thời gian, nhưng một nửa đất bỏ không." }] },
    ],
  },
  { t: "rule", formula: "nghiên cứu cụ thể → V-ed · khối nghiên cứu → has V3 · lập luận → V hiện tại · each / one / neither / the number of → V số ít", vi: "Khoanh riêng động từ tường thuật và từ định lượng ở lượt 1." },

  { t: "h", text: "(Ngày 23 · mục 3) Danh từ trừu tượng · danh hoá quá đà · which chỉ cả mệnh đề" },
  {
    t: "patterns",
    rows: [
      { formula: "N trừu tượng nói chung (không the) · the + N + of… (đã thu hẹp)", vi: "Technology / society / education nói chung không mạo từ.", examples: [{ en: "Technology has changed society, but the technology used in hospitals changes slowly.", vi: "Công nghệ đã thay đổi xã hội, nhưng công nghệ dùng trong bệnh viện đổi chậm." }] },
      { formula: "S V O, which + V (which = cả mệnh đề trước)", vi: "Bắt buộc phẩy trước which.", examples: [{ en: "Fares rose by 20%, which reduced demand.", vi: "Giá vé tăng 20%, điều này làm giảm nhu cầu." }] },
      { formula: "S V O — a change / a decision / a trend that + V", vi: "Thay which mơ hồ bằng danh từ tóm.", examples: [{ en: "Car use fell in the centre — a change that surprised planners.", vi: "Lượng ô tô ở trung tâm giảm — một thay đổi khiến các nhà quy hoạch bất ngờ." }] },
    ],
  },
  { t: "rule", formula: "N trừu tượng chung → không the · ≤ 2 cụm “the… of…” / câu · , which = cả mệnh đề · which mơ hồ → a change that…", vi: "Ba lỗi tinh của lượt 2 và 3." },

  { t: "h", text: "(Ngày 23 · mục 4) So sánh đủ vế · vị trí của only · song song kép" },
  {
    t: "patterns",
    rows: [
      { formula: "N1 of A + V + comparative + than that of B / those of B", vi: "that thay danh từ số ít, those thay số nhiều.", examples: [{ en: "The salaries of nurses have risen more slowly than those of doctors.", vi: "Lương y tá tăng chậm hơn lương bác sĩ." }] },
      { formula: "S + V + only + từ bị giới hạn", vi: "Trong bài viết, only đứng sát chữ nó giới hạn.", examples: [{ en: "The grant covers only tuition fees, not living costs.", vi: "Trợ cấp chỉ chi học phí, không chi sinh hoạt phí." }] },
      { formula: "S not only V1 but also V2 · Not only do / does / did S V…, but S also V…", vi: "Hai vế cùng dạng; đảo ngữ khi Not only đứng đầu.", examples: [{ en: "Not only does the scheme cut costs, but it also shortens waiting times.", vi: "Chương trình không chỉ giảm chi phí mà còn rút ngắn thời gian chờ." }] },
    ],
  },
  { t: "rule", formula: "than that of / those of · only + từ bị giới hạn · not only V1 but also V2 · both adj and adj", vi: "Lượt 4: kiểm hai bên mọi than, only, not only, both, either." },

  { t: "h", text: "(Ngày 23 · mục 5) Tham chiếu rõ và liều vừa đủ" },
  {
    t: "table",
    head: ["Quá liều / mơ hồ", "Vừa đủ"],
    rows: [
      ["This has advantages.", "This shift has clear advantages."],
      ["…but they are rarely consulted. (they = ai?)", "…but parents are rarely consulted."],
      ["A student should choose his subjects.", "Students should choose their subjects."],
      ["It could perhaps possibly be argued that…", "It could be argued that…"],
      ["Moreover… Furthermore… In addition…", "một từ nối + this + danh từ tóm"],
    ],
  },
  { t: "rule", formula: "this + N tóm · lặp danh từ khi đại từ có thể chỉ hai thứ · their cho người chung chung · một câu một chỗ rào", vi: "Lượt 5 lần 3." },

  { t: "h", text: "(Ngày 23 · mục 7) Soát 4 phút trong phòng thi — “3 + 2”" },
  { t: "rule", formula: "Lượt 1 (60 s) → Lượt 3 (60 s) → Lượt của tôi #1 (45 s) → #2 (45 s) → Lượt 6 đọc ngược (30 s)", vi: "Hai lượt riêng lấy từ sổ lỗi Đề 9 · Đề 10 · kiểm tra chặng 3; đổi lại sau mỗi đề." },

  { t: "h", text: "(Ngày 23 · Bài 2) Tám bẫy cuối của Reading band 8" },
  {
    t: "table",
    head: ["Bẫy", "Cách gỡ"],
    rows: [
      ["① Suy quá đà", "không có chữ nói lý do ⇒ NOT GIVEN"],
      ["② Đảo nhân quả / đảo chiều so sánh", "vẽ mũi tên A → B"],
      ["③ So sánh bài không làm", "bài phải nói cả hai vế"],
      ["④ Lệch thời gian", "gạch chân used to / initially / until / now"],
      ["⑤ Ý người khác ≠ ý tác giả", "YNNG: tìm I think / seems to me / I am less sure"],
      ["⑥ Phủ định ẩn", "far from · hardly · fail to · few = KHÔNG"],
      ["⑦ Giả định / điều kiện", "Had X happened ⇒ X không xảy ra"],
      ["⑧ Từ trùng mồi", "chữ trùng là dấu hiệu sai nhiều hơn dấu hiệu đúng"],
    ],
  },

  { t: "h", text: "(Ngày 23 · Bài 3) Năm nước đi khi câu hỏi Part 3 có cài bẫy" },
  {
    t: "patterns",
    rows: [
      { formula: "① I'm not sure I'd accept the premise entirely — … That said, …", vi: "Tiền đề ngầm (Why has X made…?).", examples: [{ en: "I'm not sure social media has made everyone lonelier. That said, it can make loneliness worse for some people.", vi: "Tôi không chắc mạng xã hội làm ai cũng cô đơn hơn. Dù vậy, nó có thể làm nỗi cô đơn tệ hơn với một số người." }] },
      { formula: "② I don't think it has to be one or the other.", vi: "Hai lựa chọn giả (A or B?).", examples: [{ en: "I don't think it has to be one or the other — parents set the example, schools give the practice.", vi: "Tôi không nghĩ phải chọn một trong hai — cha mẹ làm gương, trường cho thực hành." }] },
      { formula: "③ It depends which N we're talking about.", vi: "Khái quát quá rộng.", examples: [{ en: "It depends which young people we're talking about.", vi: "Còn tuỳ ta nói nhóm người trẻ nào." }] },
      { formula: "④ Fair to whom, though? / In principle…, but in practice…", vi: "Câu hỏi giá trị.", examples: [{ en: "Fair to whom, though? In market terms, yes; in terms of contribution, clearly not.", vi: "Công bằng với ai đã? Xét theo thị trường thì có; xét theo đóng góp thì rõ là không." }] },
      { formula: "⑤ That's a fair exception, but it doesn't follow that…", vi: "Ca cực đoan (But what about…?).", examples: [{ en: "That's a fair exception, but it doesn't follow that the charge is wrong.", vi: "Đó là ngoại lệ hợp lý, nhưng không vì thế mà khoản phí là sai." }] },
    ],
  },
  { t: "rule", formula: "nghe chữ bẫy → MỘT câu gỡ → trả lời 3–4 câu → chốt · tối đa hai câu gỡ / phần Part 3", vi: "Phản biện câu hỏi là mở đầu, không phải câu trả lời." },
];
