/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 12 (soạn cùng `tap-5/ngay/ngay12.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang2.ts` (chặng Ngày 7–12) và đánh số mục liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_12: Block[] = [
  { t: "h", text: "(Ngày 12 · mục 1) Số nhiều gốc Latin và Hy Lạp" },
  {
    t: "table", head: ["Đuôi số ít → số nhiều", "Ví dụ", "Đọc đuôi số nhiều"],
    rows: [
      ["-a → -ae", "larva → larvae · alga → algae", "/iː/"],
      ["-us → -i", "fungus → fungi · stimulus → stimuli · nucleus → nuclei", "/aɪ/"],
      ["-um → -a", "stratum → strata · bacterium → bacteria · datum → data", "/ə/"],
      ["-is → -es", "hypothesis → hypotheses · analysis → analyses · crisis → crises", "/iːz/"],
      ["-on → -a", "phenomenon → phenomena · criterion → criteria", "/ə/"],
      ["Không đổi", "species · series · offspring", "động từ cho biết số"],
    ],
  },
  { t: "rule", formula: "-a → -ae  ·  -us → -i  ·  -um → -a  ·  -is → -es  ·  -on → -a  ·  species / series / offspring: không đổi", vi: "Không thêm -s vào dạng đã là số nhiều (criterias, phenomenas); không dùng dạng số nhiều như số ít (a criteria)." },

  { t: "h", text: "(Ngày 12 · mục 2) Giảng viên định nghĩa thuật ngữ" },
  {
    t: "table", head: ["Khuôn", "Ví dụ"],
    rows: [
      ["mô tả + , what we call / known as + THUẬT NGỮ", "the rock breaks down where it stands, what geologists call weathering"],
      ["THUẬT NGỮ + — that is, / in other words, + mô tả", "they're nocturnal — that is, active at night"],
      ["THUẬT NGỮ, or + từ thường", "the larvae, or grubs, live underground"],
      ["a kind of + N + called + THUẬT NGỮ", "a kind of fine mud called silt"],
      ["Đối lập hai thuật ngữ", "not magma but lava · weathering rather than erosion"],
    ],
  },

  { t: "h", text: "(Ngày 12 · mục 3) Task 1 — quy trình hai giai đoạn" },
  {
    t: "table", head: ["Việc", "Cụm", "Ví dụ"],
    rows: [
      ["Mở bài", "in two stages: A, followed by B", "…is made in two stages: the formation of the curd, followed by its pressing and maturing."],
      ["Overview so hai giai đoạn", "The first… , whereas the second… · is largely a matter of", "The first stage is completed within hours, whereas the second lasts up to eighteen months."],
      ["Bản lề", "The second stage begins with + the V-ing of + this N", "The second stage begins with the salting of this curd."],
      ["Sản phẩm trung gian / phụ", "known as · the resulting N · to be used as", "…a soft solid known as curd. · …drained off to be used as animal feed."],
      ["Thời lượng, mục đích", "during which · for between X and Y · so that", "…pressed overnight so that any remaining whey is squeezed out."],
    ],
  },
  { t: "rule", formula: "Mở bài: in two stages: A, followed by B  →  Overview: N steps + The first…, whereas the second…  →  Thân 1 = stage 1  →  The second stage begins with… this N  →  Thân 2 = stage 2", vi: "Ranh giới khổ trùng ranh giới giai đoạn. Bước tự xảy ra (sets, firms up, heats up) để chủ động." },

  { t: "h", text: "(Ngày 12 · mục 4) Task 1 — “describe how something works”" },
  {
    t: "patterns", rows: [
      { formula: "N + works on the principle that + S + V   ·   N + is used to + V", vi: "Overview = công dụng + nguyên lý.", examples: [{ en: "It works on the principle that heated air is lighter than the cooler air around it.", vi: "Nó hoạt động theo nguyên lý không khí nóng nhẹ hơn không khí mát xung quanh." }] },
      { formula: "N + is + mounted above / attached to / located at + N   ·   Beneath + N + hangs + N", vi: "Thân 1 — cấu tạo: vị trí + chức năng, theo một trật tự không gian.", examples: [{ en: "Beneath the envelope hangs a wicker basket.", vi: "Dưới túi khí treo một chiếc giỏ mây." }] },
      { formula: "When / As + S + V(s/es), S + V(s/es)", vi: "Thân 2 — vận hành: nhân quả ở hiện tại đơn.", examples: [{ en: "As the air inside becomes less dense, the envelope stands upright.", vi: "Khi không khí bên trong loãng đi, túi khí dựng đứng lên." }] },
      { formula: "V-ing + O + makes + N + V   ·   V-ing + O + causes / allows / enables + N + to V", vi: "Hành động điều khiển làm chủ ngữ.", examples: [{ en: "Pulling the cord causes the balloon to sink.", vi: "Kéo dây làm khí cầu hạ xuống." }] },
      { formula: "S + V, allowing / causing + N + to V   ·   by means of + N   ·   by + V-ing", vi: "Hệ quả ở cuối câu; phương tiện điều khiển.", examples: [{ en: "The vent is opened fully, allowing the envelope to deflate.", vi: "Van được mở hết, cho phép túi khí xẹp xuống." }] },
    ],
  },
  { t: "rule", formula: "Overview: It is used to + V / works on the principle that + S + V  →  Thân 1: N + is mounted above / attached to + N  →  Thân 2: V-ing + O + causes + N + to V · , allowing + N + to V", vi: "make + N + V trần; cause / allow / enable + N + to V. Không bịa thông số ngoài hình." },

  { t: "h", text: "(Ngày 12 · mục 5) Listening — Summary completion và bẫy Part 3" },
  {
    t: "table", head: ["Việc", "Làm gì"],
    rows: [
      ["45 giây đọc trước", "Đọc cả đoạn như một câu chuyện → loại từ + số ít / nhiều cho từng chỗ trống → khoanh cọc (tên, năm, từ nối)"],
      ["Khi nghe Summary", "Viết từ đứng SAU thông tin bị bác; đoạn không có câu hỏi là đoạn được nghỉ"],
      ["Bẫy Part 3", "① It's not that A… My worry is B · ② đề xuất → bác → đề xuất khác · ③ câu mỉa thay lời từ chối · ④ tự nêu rồi tự gạt · ⑤ người thứ ba chốt"],
      ["Tín hiệu chốt", "Agreed. · Fair enough. · Sensible. · Point taken. · We'll do that."],
    ],
  },
  { t: "rule", formula: "Đọc cả đoạn → loại từ + số ít / nhiều → khoanh cọc → nghe: viết từ đứng SAU thông tin bị bác", vi: "Chỗ trống của Summary nằm trong câu đủ: đáp án phải khớp cả nghĩa lẫn ngữ pháp." },
];
