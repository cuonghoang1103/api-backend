/**
 * Mục TRA CÔNG THỨC của IELTS Tập 3 — chặng 2 (Ngày 7–12). Soạn cùng `ngay/ngay7..12.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T3.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG2: Block[] = [
  // ───────── Ngày 7 ─────────
  { t: "h", text: "(Ngày 7 · mục 2) Động từ đổi nghĩa: + V-ing ≠ + to V" },
  {
    t: "table",
    head: ["Động từ", "+ V-ing", "+ to V"],
    rows: [
      ["remember / forget", "nhớ / quên việc ĐÃ xảy ra: remember **meeting** him", "nhớ / quên PHẢI làm: remember **to lock** the door"],
      ["regret", "tiếc vì đã làm: regret **choosing**", "lấy làm tiếc phải báo: regret **to inform** you"],
      ["stop", "ngừng hẳn: stopped **using** coal", "dừng lại để: stopped **to buy** water"],
      ["try", "thử xem sao: try **reading**", "cố gắng: try **to reduce**"],
      ["go on", "tiếp tục: went on **rising**", "làm tiếp việc khác: went on **to become** a surgeon"],
      ["mean", "kéo theo: means **commuting**", "định: meant **to call**"],
      ["need (vật)", "cần được làm: needs **repairing**", "= needs **to be repaired**"],
    ],
  },
  { t: "rule", formula: "remember / forget / regret / stop / try / go on + V-ing (đã, đang) ≠ + to V (sẽ, cần, để)", vi: "V-ing nhìn lại việc có thật; to V nhìn tới việc phải làm hoặc mục đích." },

  { t: "h", text: "(Ngày 7 · mục 3) Động từ + tân ngữ + to V · make / let · prevent … from" },
  {
    t: "patterns",
    rows: [
      { formula: "S + allow / enable / encourage / persuade / force / require / cause / lead / advise / expect + O + to V", vi: "A cho phép / khuyến khích / buộc / khiến B làm gì", examples: [{ en: "Online courses enable students to study at their own pace.", vi: "Khoá học trực tuyến cho phép sinh viên học theo nhịp riêng." }] },
      { formula: "make / let / have + O + V · help + O + (to) V", vi: "bắt / cho / nhờ ai làm — không to; bị động: be made to V", examples: [{ en: "Strict deadlines make employees work late.", vi: "Hạn chót gắt khiến nhân viên làm muộn." }] },
      { formula: "prevent / stop / discourage / ban + O + from + V-ing", vi: "ngăn / cấm ai làm gì", examples: [{ en: "High prices prevent many families from buying a home.", vi: "Giá cao khiến nhiều gia đình không mua được nhà." }] },
      { formula: "suggest / recommend + V-ing · suggest (that) + S + (should) + V", vi: "đề nghị — KHÔNG suggest + O + to V", examples: [{ en: "I would suggest that the council build more cycle lanes.", vi: "Tôi đề nghị hội đồng thành phố xây thêm làn xe đạp." }] },
    ],
  },
  { t: "rule", formula: "S + enable / encourage / require / lead + O + to V · make / let + O + V · prevent + O + from + V-ing", vi: "Ba khuôn “A tác động lên B” cho Task 2 và Part 3." },

  { t: "h", text: "(Ngày 7 · mục 4) Dạng bị động và hoàn thành của to V / V-ing" },
  {
    t: "table",
    head: ["Dạng", "Công thức", "Ví dụ"],
    rows: [
      ["to V bị động", "to be + V3", "Students expect **to be treated** fairly."],
      ["V-ing bị động", "being + V3", "Most people dislike **being criticised**."],
      ["to V hoàn thành", "to have + V3", "The number seems **to have doubled**."],
      ["Người ta nói rằng…", "S + is said / believed / expected + to V / to have V3", "The temple **is believed to have been built** in the eleventh century."],
    ],
  },
  { t: "rule", formula: "V + to be V3 / being V3 · seem + to have V3 · S + is said / expected + to V", vi: "Chọn to V hay V-ing theo động từ đứng trước, rồi thêm be + V3 (bị động) hoặc have + V3 (đã xảy ra)." },

  { t: "h", text: "(Ngày 7 · mục 5) Giới từ + V-ing — kể cả “to” là giới từ" },
  {
    t: "table",
    head: ["+ V-ing", "+ to V"],
    rows: [
      ["look forward **to** · be used **to** · be committed **to** · contribute **to** · object **to** · in addition **to** · when it comes **to**", "the ability / chance / opportunity / right / decision / tendency / need **to V**"],
      ["succeed **in** · insist **on** · capable **of** · responsible **for** · difficulty **(in)** · the risk **of**", "be likely / willing / able / reluctant **to V**"],
      ["It is (not) worth · There is no point (in) · spend time · have trouble + **V-ing**", "used **to V** (ngày trước thường) ≠ be used to **V-ing** (quen với)"],
    ],
  },
  { t: "rule", formula: "giới từ (in / on / of / for / to…) + V-ing · danh từ khả năng / cơ hội + to V", vi: "Thử thay bằng danh từ: thay được ⇒ to là giới từ ⇒ V-ing." },

  { t: "h", text: "(Ngày 7 · mục 6) Tính từ -ed / -ing · phân từ trước danh từ" },
  {
    t: "table",
    head: ["-ed: người CẢM THẤY (+ giới từ)", "-ing: thứ GÂY RA", "Trước danh từ"],
    rows: [
      ["interested **in** · bored **with** · worried **about** · surprised **at / by**", "interesting · boring · worrying · surprising", "**rising** prices · a **growing** number (đang)"],
      ["satisfied **with** · impressed **by** · inspired **by** · overwhelmed **by**", "satisfying · impressive · inspiring · overwhelming", "**increased** demand · **limited** resources (đã / bị)"],
      ["stressed **about** · exhausted **by**", "stressful · exhausting", "an **ageing** population · **developed** countries"],
    ],
  },
  { t: "rule", formula: "S (người) + be + adj-ed + giới từ + N · S (việc / vật) + be + adj-ing · V-ing / V3 + N", vi: "-ed: cảm thấy; -ing: gây ra. Trước danh từ: V-ing = đang, V3 = đã / bị." },

  { t: "h", text: "(Ngày 7 · Nói mục 3–4) Part 2 “người có ảnh hưởng”: tính cách → chuyện → tác động" },
  {
    t: "patterns",
    rows: [
      { formula: "What I admire most about + O + is + N / the way S + V", vi: "mở phần tính cách", examples: [{ en: "What I admire most about him is how resilient he is.", vi: "Điều tôi ngưỡng mộ nhất ở anh là sự kiên cường." }] },
      { formula: "S + taught / encouraged / inspired + me + to V · S + made me realise (that)…", vi: "người đó tác động lên tôi", examples: [{ en: "He taught me to break a big problem down into smaller steps.", vi: "Anh dạy tôi chia vấn đề lớn thành các bước nhỏ." }] },
      { formula: "I used to + V, but thanks to + O, I've become + adj-er", vi: "trước → sau (bắt buộc với đề influence)", examples: [{ en: "I used to give up easily, but thanks to him, I've become much more patient.", vi: "Trước kia tôi dễ bỏ cuộc, nhưng nhờ anh tôi đã kiên nhẫn hơn nhiều." }] },
      { formula: "If it hadn't been for + O, I would never have + V3", vi: "nếu không nhờ… (cụm thuộc lòng; học kỹ Ngày 15)", examples: [{ en: "If it hadn't been for my aunt, I would never have studied abroad.", vi: "Nếu không nhờ dì, tôi đã chẳng bao giờ đi du học." }] },
    ],
  },
  { t: "rule", formula: "Tính cách (từ band 6) → For instance, + chuyện quá khứ → That (really) + tác động lên tôi", vi: "Mỗi tính cách: gọi tên — chứng minh — nói nó có nghĩa gì với bạn." },

  { t: "h", text: "(Ngày 7 · Nói mục 8) Trọng âm theo hậu tố -tion / -ic / -ity" },
  {
    t: "table",
    head: ["Hậu tố", "Nhấn âm tiết ngay trước hậu tố"],
    rows: [
      ["-tion / -sion", "edu**CA**tion · determi**NA**tion · inspi**RA**tion · de**CI**sion"],
      ["-ic", "ener**GET**ic · opti**MIS**tic · enthusi**AS**tic · aca**DEM**ic"],
      ["-ity", "perso**NAL**ity · gene**ROS**ity · crea**TIV**ity · responsi**BIL**ity"],
    ],
  },
  { t: "rule", formula: "… + -tion / -sion / -ic / -ity ⇒ nhấn âm tiết đứng ngay trước hậu tố", vi: "Trọng âm thường dời chỗ so với từ gốc: PERson → persoNALity." },

  // ───────── Ngày 8 ─────────
  { t: "h", text: "(Ngày 8 · Viết mục 2) Hai đường cắt nhau" },
  {
    t: "patterns",
    rows: [
      { formula: "S + overtook / surpassed + O + in / between … and …", vi: "A vượt B (bị động: was overtaken by)", examples: [{ en: "Online news overtook print newspapers between 2010 and 2015.", vi: "Tin trực tuyến vượt báo in trong khoảng 2010–2015." }] },
      { formula: "The gap narrowed / widened (to + số) · the two figures converged / diverged", vi: "khoảng cách thu hẹp / nới rộng", examples: [{ en: "After 2015, the gap widened, reaching 52 percentage points by 2025.", vi: "Sau 2015 khoảng cách nới rộng, đạt 52 điểm phần trăm vào 2025." }] },
      { formula: "By + năm, S + had + V3", vi: "tới năm đó thì đã…", examples: [{ en: "By 2025, the positions had been completely reversed.", vi: "Tới năm 2025, vị trí đã đảo ngược hoàn toàn." }] },
    ],
  },
  { t: "rule", formula: "Lúc đầu A > B → A fell while B rose → B overtook A in around [năm] → By [năm cuối], the gap had widened to…", vi: "Bốn bước: thứ tự ban đầu — hướng đi — điểm cắt — khoảng cách cuối." },

  { t: "h", text: "(Ngày 8 · Viết mục 3) Tả trọn một đường trong một câu" },
  {
    t: "patterns",
    rows: [
      { formula: "S + started at A, rose to B in [năm], after which it + V2 + to C", vi: "after which = sau đó thì", examples: [{ en: "Owner-occupied homes started at 120,000, rose to 126,000 in 2005, after which they fell steadily to 98,000 in 2025.", vi: "Nhà chủ ở bắt đầu ở 120.000, tăng lên 126.000 năm 2005, sau đó giảm đều xuống 98.000 năm 2025." }] },
      { formula: "S + V2 + from A to B, before + V-ing + (to / at) C", vi: "before + V-ing — cùng chủ ngữ", examples: [{ en: "The figure dipped to 30% in 2010 before recovering to 42% by the end of the period.", vi: "Con số tụt xuống 30% năm 2010 rồi hồi phục lên 42% vào cuối kỳ." }] },
      { formula: "Having + V3 + at B in [năm], S + then + V2 · …, followed by + a (sharp) fall to C", vi: "sau khi đạt đỉnh / tiếp theo là", examples: [{ en: "Having peaked at 126,000 in 2005, the number of owner-occupied homes then declined.", vi: "Sau khi đạt đỉnh 126.000 năm 2005, số nhà chủ ở giảm xuống." }] },
    ],
  },
  { t: "rule", formula: "S + started at A, peaked at B in [năm], after which it fell to C, before ending the period at D", vi: "Một đường = điểm đầu + điểm đổi hướng + điểm cuối." },

  { t: "h", text: "(Ngày 8 · Viết mục 4) Biểu đồ có đường TỔNG — câu overview" },
  {
    t: "patterns",
    rows: [
      { formula: "Overall, the total + V2 …, with the most dramatic rise being seen in + N", vi: "tổng trước, rồi thành phần gây ra", examples: [{ en: "Overall, the total number of households grew throughout the period, with the most dramatic rise being seen in private renting.", vi: "Nhìn chung, tổng số hộ tăng suốt giai đoạn, trong đó tăng mạnh nhất là nhóm thuê nhà tư nhân." }] },
      { formula: "The overall figure + V2 + by + số, driven mainly by + N", vi: "tổng thay đổi chủ yếu do…", examples: [{ en: "The overall figure rose by 34,000, driven mainly by the growth in rented homes.", vi: "Con số tổng tăng 34.000, chủ yếu do số nhà thuê tăng." }] },
    ],
  },
  { t: "rule", formula: "Overall, the total + rose / fell …, with the most dramatic rise / fall being seen in + N", vi: "Không coi Total là một hạng mục ngang hàng; không viết “Total was the highest”." },

  { t: "h", text: "(Ngày 8 · Viết mục 5) Năm dự báo — đổi thì" },
  {
    t: "table",
    head: ["Cách", "Công thức", "Ví dụ"],
    rows: [
      ["Bị động + to V", "is / are projected · expected · predicted · forecast to + V", "Private renting **is forecast to rise** to 124,000 by 2035."],
      ["likely / set", "is likely / set to + V", "Home ownership **is likely to drop** further."],
      ["Danh từ dự báo", "Projections suggest (that) + S + will + V · a projected rise to…", "…followed by **a projected rise** to 254,000."],
      ["Tương lai hoàn thành", "By + năm, S + will have + V3", "By 2035, the number of rented homes **will have more than tripled** since 2000."],
      ["Đổi thì giữa câu", "S + V2 … and is projected to + V", "The total rose to 244,000 in 2025 **and is projected to reach** 254,000 by 2035."],
    ],
  },
  { t: "rule", formula: "S + V2 (đã qua) + and is projected / expected / forecast to + V + by [năm tương lai]", vi: "Quá khứ đơn cho số thật, “is … to V” cho số dự báo. Thân bài chia quá khứ / dự báo." },

  { t: "h", text: "(Ngày 8 · Nghe mục 3) Matching Part 3 — trình tự mỗi mục" },
  {
    t: "table",
    head: ["Bước trong băng", "Tín hiệu"],
    rows: [
      ["Tên mục (mốc — nói nguyên văn)", "Harlow Court first? · And The Granary? · What about…?"],
      ["Ưu điểm / giả định (bẫy)", "the location couldn't be better · I assumed it would be dark…"],
      ["Chuyển sang nhận định thật", "The trouble is… · But… · …, though · actually"],
      ["Câu chốt (đáp án)", "That's our main criticism. · Agreed. · So, … · … it is, then. · Fine by me."],
    ],
  },
  { t: "rule", formula: "Tên mục (mốc) → ưu điểm / giả định (bẫy) → but / the trouble is → nhận định cuối (đáp án) → câu chốt", vi: "Phương án trong hộp đã paraphrase, xáo trộn và thừa 1–2 cái; đáp án là nhận định cuối cùng." },

  // ───────── Ngày 9 ─────────
  { t: 'h', text: '(Ngày 9 · mục 2) Động từ + giới từ phụ thuộc — 24 cụm học thuật' },
  {
    t: 'table',
    head: ['Giới từ', 'Cụm'],
    rows: [
      ['on', 'concentrate on · insist on · spend (money / time) on'],
      ['in', 'result in · succeed in · invest in · participate in · specialise in'],
      ['to', 'lead to · refer to · adapt to · object to · respond to · attribute sth to'],
      ['for', 'account for · blame sb for'],
      ['from', 'result from · differ from · prevent sb / sth from'],
      ['with', 'cope with · comply with · provide sb with sth · associate sth with'],
      ['of', 'consist of'],
      ['KHÔNG giới từ', 'discuss · mention · emphasise · lack · contact · marry · enter · reach · approach · affect · influence + N'],
    ],
  },
  { t: 'rule', formula: 'Nguyên nhân + result in / lead to + kết quả · Kết quả + result from + nguyên nhân · N + account for + số liệu', vi: 'Ba khung nguyên nhân – kết quả – tỉ lệ cho Task 1 và Task 2.' },

  { t: 'h', text: '(Ngày 9 · mục 3) Tính từ + giới từ phụ thuộc — 20 cụm' },
  {
    t: 'table',
    head: ['Giới từ', 'Cụm'],
    rows: [
      ['of', 'capable of · typical of · short of · conscious of'],
      ['on', 'dependent on · based on'],
      ['in', 'involved in · rich in'],
      ['to', 'accustomed to · related to · harmful to · sensitive to · opposed to'],
      ['for', 'suitable for · eligible for · essential for'],
      ['with', 'satisfied with · familiar with'],
      ['about / from', 'concerned about · absent from'],
    ],
  },
  { t: 'rule', formula: 'S + am / is / are + adj + giới từ + N / V-ing', vi: 'capable of doing (≠ able to do) · accustomed to doing · harmful to · different from.' },

  { t: 'h', text: '(Ngày 9 · mục 4) Danh từ + giới từ phụ thuộc — 16 cụm' },
  {
    t: 'table',
    head: ['Giới từ', 'Cụm'],
    rows: [
      ['of', 'a lack of · a shortage of · the cause of · evidence of'],
      ['for', 'a need for · responsibility for · a cure for (· a reason for)'],
      ['to', 'a threat to · damage to · an alternative to · an attitude to / towards · a reaction to (· a solution to)'],
      ['with / between', 'a relationship with sb · a relationship between A and B'],
      ['in / on / into', 'difficulty in + V-ing · a ban on · research into / on'],
      ['Động từ không giới từ → danh từ có', 'affect → an effect on · lack → a lack of · discuss → a discussion about / of · solve → a solution to'],
    ],
  },
  { t: 'rule', formula: 'a lack / shortage / cause of + N · a need / cure / reason for + N · a threat / solution / alternative to + N · a ban / effect on + N', vi: 'Bốn giới từ of · for · to · on gánh gần hết cụm danh từ học thuật.' },

  { t: 'h', text: '(Ngày 9 · mục 5) Một từ — hai giới từ — hai nghĩa' },
  {
    t: 'table',
    head: ['Từ', 'Giới từ 1', 'Giới từ 2'],
    rows: [
      ['result', 'result in + kết quả', 'result from + nguyên nhân'],
      ['agree', 'agree with + người / ý kiến', 'agree to + đề nghị · agree on + điều cùng thống nhất'],
      ['apply', 'apply for + thứ muốn xin', 'apply to + nơi nhận / đối tượng áp dụng'],
      ['responsible', 'responsible for + việc', 'responsible to + cấp trên'],
      ['concerned', 'concerned about = lo ngại', 'concerned with = bàn về'],
      ['differ', 'differ from + đối tượng', 'differ in + phương diện'],
      ['good', 'good at + kỹ năng', 'good for + có lợi cho'],
    ],
  },
  { t: 'rule', formula: 'result in ≠ result from · agree with ≠ agree to · apply for ≠ apply to · concerned about ≠ concerned with', vi: 'Thấy động từ quen — nhìn tiếp giới từ rồi mới hiểu nghĩa.' },

  { t: 'h', text: '(Ngày 9 · mục 6) Sau giới từ: N · V-ing · what / how / whether + S + V' },
  {
    t: 'patterns',
    rows: [
      { formula: 'V / adj / N + giới từ + V-ing', vi: 'Sau mọi giới từ, động từ thêm -ing.', examples: [{ en: 'Few countries have succeeded in reducing plastic waste.', vi: 'Ít nước thành công trong việc giảm rác nhựa.' }] },
      { formula: 'look forward to / object to / be used to / be opposed to / in addition to + V-ing', vi: 'to là GIỚI TỪ ⇒ V-ing (thử thay bằng danh từ: object to the plan ✔).', examples: [{ en: 'I look forward to hearing from you.', vi: 'Tôi mong nhận được tin từ bạn.' }] },
      { formula: 'V + giới từ + what / how / whether + S + V', vi: 'Sau giới từ không dùng that / if.', examples: [{ en: 'Success depends on how hard you work.', vi: 'Thành công phụ thuộc vào việc bạn làm việc chăm đến mức nào.' }] },
      { formula: 'N + that + S + V + giới từ · N + giới từ + which + S + V', vi: 'Mệnh đề quan hệ: đừng làm rơi giới từ (cuối câu khi nói, trước which khi viết).', examples: [{ en: 'This is an issue that I am very interested in.', vi: 'Đây là vấn đề tôi rất quan tâm.' }] },
    ],
  },
  { t: 'rule', formula: 'giới từ + N / V-ing / what – how – whether + S + V', vi: 'Sau giới từ không bao giờ là động từ nguyên mẫu, cũng không là that / if.' },

  { t: 'h', text: '(Ngày 9 · mục 7) Đoán nghĩa từ ngữ cảnh — 4 bước, 7 manh mối' },
  {
    t: 'table',
    head: ['Manh mối', 'Dấu hiệu'],
    rows: [
      ['① Định nghĩa', 'is / means / refers to · gạch ngang · ngoặc · , or …'],
      ['② Nói lại', 'dấu chấm phẩy · in other words · that is'],
      ['③ Đối lập', 'but · however · unlike · whereas · rather than'],
      ['④ Ví dụ', 'such as · for example · including'],
      ['⑤ Cấu tạo từ', 'un- / mis- / over- / re- · -less / -able / -ify'],
      ['⑥ Nhân – quả', 'because · so … that · therefore · as a result'],
      ['⑦ Ngữ pháp / giới từ đi kèm', 'rich in / deficient in + chất · a threat to + đối tượng bị hại'],
    ],
  },
  { t: 'rule', formula: 'Cần không? → Loại từ → Manh mối (7 loại) → Thay thử', vi: 'Mỗi từ lạ không quá 20 giây; biết tích cực / tiêu cực thường đã đủ.' },

  { t: 'h', text: '(Ngày 9 · Đọc mục 2–3) Sentence completion band 6 + Summary có hộp từ' },
  {
    t: 'table',
    head: ['Quanh chỗ trống', 'Chỗ trống cần'],
    rows: [
      ['is rich in ___', 'danh từ (chất, tài nguyên)'],
      ['led to ___ / results in ___', 'danh từ / V-ing chỉ KẾT QUẢ'],
      ['resulted from ___ / caused by ___', 'danh từ chỉ NGUYÊN NHÂN'],
      ['a threat to ___ / harmful to ___', 'danh từ chỉ đối tượng bị hại'],
      ['prevents them from ___', 'V-ing'],
    ],
  },
  { t: 'rule', formula: 'Sentence completion: giới hạn từ → loại từ (nhìn giới từ) → dò từ khoá khó đổi → tìm câu CÙNG Ý → chép nguyên chữ → đọc lại', vi: 'Khung câu đổi (đổi loại từ, bị động, nhân – quả, phủ định + trái nghĩa), ý không đổi.' },
  { t: 'rule', formula: 'Summary hộp từ: đọc summary → loại từ từng chỗ → chia hộp + khoanh cặp trái nghĩa → đọc đoạn bài → chọn theo Ý → đọc lại', vi: 'Ngữ pháp loại trước, ý nghĩa chọn sau; cẩn thận however / less / only when.' },

  { t: 'h', text: '(Ngày 9 · Nghe mục 1, 3, 5) Bẫy đổi ý không có “actually” · hai đáp án gần nhau' },
  {
    t: 'table',
    head: ['Kiểu', 'Tín hiệu'],
    rows: [
      ['① Dự định bị bỏ', 'was going to · had planned to · the plan was to · originally'],
      ['② Tưởng vậy mà không phải', "I'd assumed · I thought · it turns out"],
      ['③ Cân nhắc rồi chốt', 'I was tempted to · in the end · eventually · we ended up'],
      ['④ Người kia sửa', 'Did she? I wrote down… · No, that was for…'],
      ['⑤ Đồng ý rồi rút lại', 'on second thoughts · come to think of it · although…'],
      ['⑥ Trước đây… bây giờ', 'used to · on the old timetable · no longer · now'],
    ],
  },
  { t: 'rule', formula: 'Thông tin ở thì QUÁ KHỨ / dự định = thường là bẫy · thông tin sau but / so / in the end / instead / now = đáp án', vi: 'Đáp án là điều còn đúng ở cuối đoạn hội thoại.' },
  { t: 'rule', formula: 'Khoanh từ phân biệt (minimum · now · final · main · tên người) → ghi tạm CẢ HAI thông tin → chọn cái khớp từ phân biệt', vi: 'Hai đáp án gần nhau: câu hỏi quyết định, không phải thứ tự nghe.' },
  { t: 'rule', formula: 'to /tə/ · for /fə/ · of /əv/ · from /frəm/ · at /ət/ giữa câu · cuối câu đọc mạnh', vi: 'Âm yếu trong cụm giới từ: nhấn từ chính, lướt giới từ bằng /ə/.' },

  // ───────── Ngày 10 ─────────
  { t: 'h', text: '(Ngày 10 · Từ vựng mục 4) Collocation khoa học – nghiên cứu – vũ trụ' },
  {
    t: 'table',
    head: ['Động từ', 'Đi với'],
    rows: [
      ['conduct / carry out / do', 'research (into / on) · an experiment · a study · a survey'],
      ['form → test → support / reject', 'a hypothesis'],
      ['collect / analyse', 'data'],
      ['draw / reach', 'a conclusion'],
      ['make', 'a breakthrough · a discovery · progress'],
      ['allocate … to', 'funding · money · resources'],
      ['launch · put … into orbit', 'a satellite · a mission · a spacecraft'],
      ['Không đếm được', 'research · evidence · funding · progress · equipment · expertise · debris'],
    ],
  },
  { t: 'rule', formula: 'conduct research into + N · carry out an experiment · test a hypothesis · draw a conclusion · make a breakthrough · allocate funding to + N', vi: 'Học danh từ khoa học kèm ĐỘNG TỪ của nó: research đi với conduct / do, không đi với make.' },

  { t: 'h', text: '(Ngày 10 · Viết mục 2–3) Discussion band 6 — ba biến thể đề và câu luận điểm' },
  {
    t: 'table',
    head: ['Biến thể', 'Câu lệnh', 'Luận điểm'],
    rows: [
      ['A. Chỉ thảo luận', 'Discuss both views.', 'This essay will examine the arguments on both sides.'],
      ['B. Nghiêng một bên', 'Discuss both views and give your own opinion.', 'Although A, I believe that B.'],
      ['C. Cân bằng', 'Discuss both views and give your own opinion.', 'In my view, B deserves priority, but A is still worth + V-ing. · A is justified in…, whereas B is more appropriate in…'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'While / Although + S + V (quan điểm A), I believe that + S + V (quan điểm B)', vi: 'Luận điểm nghiêng một bên.', examples: [{ en: 'Although space research has some benefits, I believe that public money should be spent on problems on Earth.', vi: 'Dù nghiên cứu vũ trụ có một số lợi ích, tôi tin rằng tiền công nên được chi cho các vấn đề trên Trái Đất.' }] },
      { formula: 'In my view, + B + deserves priority, but + A + is still worth + V-ing', vi: 'Luận điểm cân bằng theo thứ tự ưu tiên.', examples: [{ en: 'In my view, problems on Earth deserve priority, but a limited space budget is still worth keeping.', vi: 'Theo tôi, các vấn đề trên Trái Đất đáng được ưu tiên, nhưng một ngân sách vũ trụ hạn chế vẫn đáng giữ.' }] },
    ],
  },
  { t: 'rule', formula: 'Thesis (mở bài) → câu đánh giá cuối mỗi thân bài → kết bài nói lại · ba chỗ CÙNG một lập trường', vi: 'Ý kiến rõ xuyên bài = nói ba lần, bằng ba cách, không đổi hướng.' },

  { t: 'h', text: '(Ngày 10 · Viết mục 4 · 9) Hai thân bài cân đối — khung 4 câu và câu khung dùng lại' },
  {
    t: 'table',
    head: ['Vị trí', 'Khung câu'],
    rows: [
      ['Mở bài — hai quan điểm', 'While some people regard X as A, others argue that B.'],
      ['Thân 1 — câu chủ đề', 'Supporters of X point out that… · It is often argued that…'],
      ['Thân 1 — câu đánh giá', 'For these reasons, X cannot simply be described as…'],
      ['Thân 2 — câu chủ đề', 'On the other hand, those who oppose X believe that…'],
      ['Thân 2 — hệ quả', 'If + S + V-ed / were + V3, the results would be…'],
      ['Thân 2 — câu đánh giá', 'This argument is particularly strong in…, where… · However, this view overlooks…'],
      ['Kết bài', 'In conclusion, although A has…, I believe that B should come first. S + should therefore…'],
    ],
  },
  { t: 'rule', formula: 'Supporters of X point out that + S + V → ví dụ → In addition / If… would… → For these reasons, + đánh giá', vi: 'Mỗi thân bài 4 câu, 80–95 từ: thuật quan điểm – chứng minh – mở rộng – đánh giá.' },

  { t: 'h', text: '(Ngày 10 · Viết mục 5) Cohesion band 6 — từ quy chiếu thay từ nối' },
  {
    t: 'table',
    head: ['Công cụ', 'Ví dụ'],
    rows: [
      ['this / these / such + danh từ tóm tắt', 'this view · this argument · this approach · such spending · these needs · this trend'],
      ['Đại từ', 'it · they · this · those who'],
      ['Thay thế', 'the former / the latter · do so · one(s)'],
      ['Chuỗi đồng nghĩa', 'space exploration → space programmes → such research → these missions'],
    ],
  },
  { t: 'rule', formula: 'this / these / such + N tóm tắt · it / they · the former / the latter · do so — rồi mới tới từ nối (1–2 lần mỗi đoạn)', vi: 'Câu sau bám câu trước bằng quy chiếu, không bằng Firstly – Moreover – Besides.' },

  { t: 'h', text: '(Ngày 10 · Nói mục 2–3) Part 3 “Do you agree…?” — thang 5 mức và khung đồng ý một phần' },
  {
    t: 'table',
    head: ['Mức', 'Cụm mở đầu'],
    rows: [
      ['① Hoàn toàn đồng ý', "Absolutely. · I couldn't agree more."],
      ['② Phần lớn đồng ý', "On the whole, yes. · By and large, I'd agree. · I tend to agree."],
      ['③ Đồng ý một phần', "I agree up to a point. · To some extent, yes. · That's partly true. · Yes and no."],
      ['④ Phần lớn không', "I'm not so sure about that. · I'm not entirely convinced."],
      ['⑤ Hoàn toàn không', "I'm afraid I disagree. · I don't think that's true at all."],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'Having said that, / That said, / At the same time, + S + V', vi: 'Chuyển sang phần không đồng ý — đứng đầu câu mới.', examples: [{ en: "Having said that, I don't think it should be a priority in every country.", vi: 'Nói vậy chứ, tôi không cho rằng nó nên là ưu tiên ở mọi nước.' }] },
      { formula: "It's true that + S + V, but + S + V · Although + S + V, S + V (không but)", vi: 'Thừa nhận rồi phản đối trong một câu.', examples: [{ en: "It's true that satellites are useful, but sending people to Mars is a different matter.", vi: 'Đúng là vệ tinh hữu ích, nhưng đưa người lên sao Hoả là chuyện khác.' }] },
      { formula: "So overall, / So I'd say + S + V, but only if / as long as + S + V", vi: 'Chốt bằng một điều kiện.', examples: [{ en: "So I'd say it's fine as long as basic needs are covered first.", vi: 'Nên tôi cho là ổn, miễn là nhu cầu cơ bản được lo trước.' }] },
    ],
  },
  { t: 'rule', formula: 'Mức độ → I think + phần đồng ý, because… → Having said that, + phần không đồng ý → So overall, … but only if / as long as…', vi: 'Đồng ý một phần = nói rõ đồng ý PHẦN NÀO, không đồng ý PHẦN NÀO, rồi chốt bằng một điều kiện.' },

  { t: 'h', text: '(Ngày 10 · Nói mục 4 · 7) Bốn cách phát triển một ý + ngữ điệu nhượng bộ' },
  {
    t: 'table',
    head: ['Cách', 'Câu nối'],
    rows: [
      ['① Lý do → hệ quả', "…, which means (that)… · As a result, … · That's why…"],
      ['② Ví dụ cụ thể', 'For instance, … · Take…, for example. · In my country, …'],
      ['③ So sánh / đối lập', '…, whereas… · Compared with… · Unlike…'],
      ['④ Viễn cảnh ngược lại', "If + S + don't / doesn't + V, S + will / may + V · Otherwise, … · Without + N, S + would…"],
    ],
  },
  { t: 'rule', formula: "If + S + don't / doesn't + V, S + will / may / won't + V", vi: 'Chứng minh một việc quan trọng bằng cách tả điều xảy ra nếu KHÔNG có nó.' },
  { t: 'rule', formula: 'Phần nhượng bộ ↘↗ (xuống–lên) + ngắt · ý chính ↘ (xuống hẳn)', vi: 'Ngữ điệu nhượng bộ: giọng chưa xuống hẳn = còn chữ but.' },

  // ───────── Ngày 11 ─────────
  { t: "h", text: "(Ngày 11 · Ngữ pháp mục 2) Mức độ khác biệt — by far, considerably, slightly" },
  {
    t: "patterns",
    rows: [
      { formula: "S + be + much / far / considerably / slightly + adj-er / more + adj + than + N", vi: "hơn nhiều / hơn một chút", examples: [{ en: "Spending on housing was considerably higher than spending on food.", vi: "Chi cho nhà ở cao hơn đáng kể so với chi cho thực phẩm." }] },
      { formula: "S + be + by far + the + adj-est / most + adj + N", vi: "lớn nhất, bỏ xa các cái còn lại", examples: [{ en: "Cars were by far the most popular means of transport, at 64%.", vi: "Ô tô là phương tiện phổ biến nhất, bỏ xa các loại khác, ở mức 64%." }] },
      { formula: "S + be + almost / nearly as + adj + as · not nearly as + adj + as", vi: "gần bằng · kém xa", examples: [{ en: "Rail travel was not nearly as popular as road travel.", vi: "Đi tàu kém phổ biến hơn nhiều so với đi đường bộ." }] },
    ],
  },
  { t: "rule", formula: "much / far / considerably / slightly + adj-er than · by far + the + adj-est", vi: "Trước so sánh hơn: từ mức độ (không dùng very). Trước so sánh nhất: by far." },

  { t: "h", text: "(Ngày 11 · Ngữ pháp mục 3) Bội số — twice as…as, double, fourfold" },
  {
    t: "table",
    head: ["Cách", "Công thức", "Ví dụ"],
    rows: [
      ["as…as", "twice / three times + as + adj / many / much (N) + as", "The City Museum had twice as many visitors as the Castle Museum."],
      ["so sánh hơn", "three times / four times + adj-er / more + N + than (không dùng với twice)", "It attracted four times more visitors than in 2010."],
      ["danh từ", "double / twice / three times + the figure (for N) · double that for N", "The figure was double that for the Castle Museum."],
      ["động từ", "double · triple · quadruple · halve", "Visits quadrupled between 2010 and 2020."],
      ["-fold", "rise twofold / threefold / fourfold · a fourfold increase in + N", "There was a fourfold increase in visits."],
    ],
  },
  { t: "rule", formula: "twice / three times + as + adj / many / much (N) + as · N + doubled / tripled · a fourfold increase in + N", vi: "Số sau ÷ số trước = bội số. Không viết twice higher than." },

  { t: "h", text: "(Ngày 11 · Ngữ pháp mục 4) Phân số — a fifth of that amount, half as many" },
  {
    t: "patterns",
    rows: [
      { formula: "S + be + half / a third / a quarter / a fifth + of + that amount / that figure / the figure for + N", vi: "bằng một phần của con số vừa nêu", examples: [{ en: "Spending on clothing was a fifth of that amount.", vi: "Chi cho quần áo bằng một phần năm số tiền đó." }] },
      { formula: "S + V + half / a third + as + many / much + N + as + N", vi: "chỉ bằng một nửa / một phần ba", examples: [{ en: "In 2020 the Maritime Museum had half as many visitors as in 2010.", vi: "Năm 2020 Bảo tàng Hàng hải có lượng khách chỉ bằng một nửa năm 2010." }] },
      { formula: "Two-thirds + of + N + V · One in five + N (số nhiều) + V (số ít)", vi: "hai phần ba số… · cứ năm… thì một", examples: [{ en: "One in five adults visits a museum every year.", vi: "Cứ năm người lớn thì một người đi bảo tàng mỗi năm." }] },
    ],
  },
  { t: "rule", formula: "S + be + half / a third / a fifth + of + that amount / that figure · half as many + N + as", vi: "amount cho thứ không đếm được; number / figure cho thứ đếm được. Độ chênh giữa hai số % = percentage points." },

  { t: "h", text: "(Ngày 11 · Ngữ pháp mục 5) So sánh kép — the more…, the more…" },
  {
    t: "patterns",
    rows: [
      { formula: "The + adj-er / more + adj + S + V, the + adj-er / more + adj + S + V", vi: "càng… càng…", examples: [{ en: "The higher the level of education, the higher the average salary.", vi: "Trình độ học vấn càng cao thì lương trung bình càng cao." }, { en: "The older the age group, the fewer people used social media.", vi: "Nhóm tuổi càng cao thì càng ít người dùng mạng xã hội." }] },
      { formula: "S + be + increasingly + adj · a growing number of + N + V (số nhiều)", vi: "ngày càng… (bản học thuật của more and more)", examples: [{ en: "A growing number of students are choosing to study abroad.", vi: "Ngày càng nhiều sinh viên chọn du học." }] },
    ],
  },
  { t: "rule", formula: "The + adj-er / more… + S + V, the + adj-er / more… + S + V", vi: "Mỗi vế một chữ the; từ so sánh đứng ngay sau the; vế đầu không có will." },

  { t: "h", text: "(Ngày 11 · Ngữ pháp mục 6) Không so lệch vế — that of / those of · whereas · respectively" },
  {
    t: "patterns",
    rows: [
      { formula: "N (số ít) + of / for / in + A + be + adj-er + than + that + of / for / in + B", vi: "that thay danh từ số ít / không đếm được", examples: [{ en: "The population of India is larger than that of Brazil.", vi: "Dân số Ấn Độ lớn hơn dân số Brazil." }] },
      { formula: "N (số nhiều) + in + A + be + adj-er + than + those + in + B", vi: "those thay danh từ số nhiều", examples: [{ en: "Sales in the north were lower than those in the south.", vi: "Doanh số ở miền bắc thấp hơn ở miền nam." }] },
      { formula: "S + V, whereas / while + S + V · số + of + A + V2, compared with + số + of + B · A and B + V2 + X and Y respectively", vi: "từ nối so sánh", examples: [{ en: "Only 12% of men cycled, compared with 20% of women.", vi: "Chỉ 12% nam đạp xe, so với 20% nữ." }] },
    ],
  },
  { t: "rule", formula: "N + of / for A + be + adj-er + than + that / those + of / for B", vi: "So con số với con số, không so con số với một nước hay một nhóm người." },

  { t: "h", text: "(Ngày 11 · Đọc mục 2) Trắc nghiệm đọc — sáu kiểu phương án sai" },
  {
    t: "table",
    head: ["Kiểu sai", "Dấu hiệu"],
    rows: [
      ["① Đúng chữ, sai ý", "Chép chữ của bài nhưng gắn nhầm chủ thể / nơi / lúc"],
      ["② Đúng một nửa", "Nửa đầu khớp bài, nửa sau thêm hoặc đổi"],
      ["③ Không nhắc", "Nghe hợp lý nhưng bài không nói"],
      ["④ Ngược nghĩa", "Đảo nguyên nhân ↔ kết quả, tăng ↔ giảm, có ↔ không"],
      ["⑤ Đúng nhưng lạc câu hỏi", "Có thật trong bài, nhưng trả lời câu hỏi khác"],
      ["⑥ Nói quá", "Thêm all, always, never, only, the main"],
    ],
  },
  { t: "rule", formula: "Thân câu hỏi → vùng 2–4 câu → tự trả lời → loại ba (ghi ①–⑥) → chỉ ra câu chứng minh", vi: "Loại ba phương án sai, cái còn lại là đáp án." },

  { t: "h", text: "(Ngày 11 · Nói mục 2) Chunks theo sáu chức năng" },
  {
    t: "table",
    head: ["Chức năng", "Chunks"],
    rows: [
      ["Mở câu trả lời", "I'd say… · I guess / I suppose… · To be honest, … · Personally, I… · As far as I know, …"],
      ["Nhấn ý chính", "The thing is, … · What I mean is, … · The main reason is (that)… · What I like most about it is…"],
      ["Thêm ý · đổi hướng", "And on top of that, … · Plus, … · But then again, … · Mind you, … · Having said that, …"],
      ["Ví dụ", "…, for instance. · Take…, for example. · …, say, … · …and things like that."],
      ["Mua thời gian", "That's a tricky question. · Let me think. · How can I put it? · I've never really thought about it, but…"],
      ["Kết dứt khoát", "So yeah, that's why… · So all in all, … · But overall, … · …, if that makes sense."],
    ],
  },
  { t: "rule", formula: "Mở (I'd say / To be honest) + ý chính + The thing is / for instance + mở rộng + So yeah, that's why…", vi: "Mỗi câu trả lời 1–2 chunks; chunk đọc liền một hơi, ngắt sau chunk." },

  { t: "h", text: "(Ngày 11 · Nói mục 3 và 5) Rút gọn, câu hỏi đuôi · quên từ, không biết thì nói gì" },
  {
    t: "patterns",
    rows: [
      { formula: "Rút gọn (Not really. / Depends. / Hard to say.) + câu đủ ngay sau", vi: "mở bằng câu rút gọn, rồi trả lời đủ", examples: [{ en: "Not really. I cook maybe twice a week, usually at weekends.", vi: "Không hẳn. Tôi nấu chừng hai lần một tuần, thường là cuối tuần." }] },
      { formula: "S + V (khẳng định), + trợ động từ + n't + đại từ? · S + V (phủ định), + trợ động từ + đại từ?", vi: "câu hỏi đuôi", examples: [{ en: "Ordering food has become so easy, hasn't it?", vi: "Đặt đồ ăn đã thành quá dễ, phải không?" }] },
      { formula: "It's the thing you use to + V · It's a kind of + N + that… · It's when + S + V", vi: "quên từ → tả bằng công dụng / mệnh đề", examples: [{ en: "I can't remember the word, but it's the thing you use to flip food in a pan.", vi: "Tôi không nhớ từ đó, nhưng nó là thứ dùng để lật đồ ăn trong chảo." }] },
      { formula: "I've never actually + V3, but I imagine + S + V · I'm no expert, but from what I've seen, …", vi: "không có trải nghiệm / không rành → nói thật rồi đoán", examples: [{ en: "I've never actually worked in a restaurant, but I'd guess it's really stressful.", vi: "Tôi chưa từng làm ở nhà hàng, nhưng tôi đoán là rất căng thẳng." }] },
    ],
  },
  { t: "rule", formula: "Quên từ → It's the thing you use to + V · Không biết → I've never actually…, but I imagine…", vi: "Không biết từ thì tả; không có trải nghiệm thì nói thật rồi đoán; không im quá 3 giây." },

  // ───────── Ngày 12 ─────────
  { t: "h", text: "(Ngày 12 · Từ vựng mục 1) Nói về mốc thời gian trong quá khứ" },
  {
    t: "table",
    head: ["Khung", "Ví dụ"],
    rows: [
      ["in the + số thứ tự + century · in the early / mid / late + thế kỷ", "in the fifteenth century · in the late eighteenth century"],
      ["in the 1800s · in the 1920s", "in the 1800s (thế kỷ 19) · in the 1920s (thập niên 1920)"],
      ["số + BC · AD + số", "300 BC · AD 79"],
      ["S + date(s) back to / date(s) from + mốc (hiện tại đơn)", "The temple dates back to the eleventh century."],
      ["the Stone / Bronze / Iron Age", "tools from the Bronze Age"],
    ],
  },
  { t: "rule", formula: "S + date(s) back to + mốc · preserve / restore + N · shed light on + N · be of historical significance · fall into disrepair", vi: "date back to: chủ động, hiện tại đơn — không viết is dated back to." },

  { t: "h", text: "(Ngày 12 · Viết mục 3) Bar chart không có thời gian — khung so sánh tĩnh" },
  {
    t: "patterns",
    rows: [
      { formula: "X was (by far) the most / least popular + N + among / with + nhóm, at + số", vi: "hạng mục đứng đầu / cuối của một nhóm", examples: [{ en: "Theme parks were by far the most popular attraction among 16–24-year-olds, at 58%.", vi: "Công viên giải trí được ưa thích nhất, bỏ xa các loại khác, ở nhóm 16–24 tuổi, với 58%." }] },
      { formula: "số + of + nhóm A + V2, compared with + số + of + nhóm B", vi: "đặt hai nhóm cạnh nhau", examples: [{ en: "Over half of 45–64-year-olds visited a historic building, compared with just 22% of the youngest group.", vi: "Hơn nửa số người 45–64 tuổi đã thăm một công trình lịch sử, so với chỉ 22% ở nhóm trẻ nhất." }] },
      { formula: "The figure for A was ten times as high as that for B · The + so sánh hơn + the age group, the + so sánh hơn + S + V", vi: "bội số · quy luật theo nhóm có thứ tự", examples: [{ en: "The older the age group, the lower the proportion who went to theme parks.", vi: "Nhóm tuổi càng cao thì tỉ lệ đi công viên giải trí càng thấp." }] },
      { formula: "A ranked first among + nhóm, followed by B · The reverse was true of + N", vi: "xếp hạng · chuyển sang khối ngược quy luật", examples: [{ en: "Historic buildings ranked first among the over-65s, followed by museums.", vi: "Công trình lịch sử đứng đầu ở nhóm trên 65 tuổi, tiếp theo là bảo tàng." }] },
    ],
  },
  {
    t: "table",
    head: ["Gọi nhóm tuổi", "Ví dụ"],
    rows: [
      ["those aged + khoảng tuổi", "those aged 25 to 44 · those aged 65 and over"],
      ["số-to-số-year-olds", "16-to-24-year-olds"],
      ["the over- / under- + số + s", "the over-65s · the under-25s"],
      ["the + nhóm + age group · the youngest / oldest group", "the 45–64 age group · the two older groups"],
    ],
  },
  { t: "rule", formula: "số + of + nhóm A + V2 + N, compared with + số + of + nhóm B · X was by far the most popular among + nhóm", vi: "Không có trục thời gian → chỉ so sánh; không increase / decrease from…to…. Một thì suốt bài." },

  { t: "h", text: "(Ngày 12 · Viết mục 4) Cột thiếu số liệu · counterpart" },
  {
    t: "patterns",
    rows: [
      { formula: "No data were available for + nhóm · Figures for + nhóm + were not recorded", vi: "cột trống ≠ 0 — nêu một lần, không đoán", examples: [{ en: "No data were available for men aged 75 and over.", vi: "Không có số liệu cho nam từ 75 tuổi trở lên." }] },
      { formula: "… in every age group for which figures are available", vi: "câu khái quát (overview) vẫn đúng khi thiếu một cột", examples: [{ en: "Women were more likely than men to visit in every age group for which figures are available.", vi: "Nữ có khả năng đi tham quan cao hơn nam ở mọi nhóm tuổi có số liệu." }] },
      { formula: "số + of + nhóm A + V2, compared with + số + of + their + male / female / rural + counterparts", vi: "counterparts = nhóm cùng vai ở phía bên kia", examples: [{ en: "44% of women aged 16–34 made a visit, compared with 38% of their male counterparts.", vi: "44% nữ 16–34 tuổi có đi tham quan, so với 38% nam cùng nhóm tuổi." }] },
    ],
  },
  { t: "rule", formula: "số + of + nhóm A + V2, compared with + số + of + their + adj + counterparts · No data were available for + nhóm", vi: "Chỉ viết 0 khi biểu đồ ghi số 0 thật (vd. vé miễn phí)." },

  { t: "h", text: "(Ngày 12 · Viết mục 5) Đề có hai biểu đồ cột" },
  {
    t: "table",
    head: ["Chỗ", "Câu khung"],
    rows: [
      ["Mở bài", "The first bar chart compares + N, while the second shows + N."],
      ["Overview (mỗi biểu đồ một ý)", "Overall, + ý biểu đồ 1. As for + chủ đề biểu đồ 2, + ý biểu đồ 2."],
      ["Sang biểu đồ 2", "Turning to the second chart, … · As regards + N, …"],
      ["Gắn số cuối câu", "…, with 63% of women and 55% of men aged 55–74 visiting."],
      ["Thêm một nhóm nữa", "…, and a further 27% had no time."],
    ],
  },
  { t: "rule", formula: "Mở bài (chart 1…, while chart 2…) → Overview 2 ý → Body 1 = biểu đồ 1 → Turning to the second chart, + Body 2", vi: "Mỗi thân bài một biểu đồ; không tự suy ra nguyên nhân giữa hai biểu đồ." },

  { t: "h", text: "(Ngày 12 · Nghe mục 3) Map labelling vòng 3 — ngôn ngữ vị trí và bẫy" },
  {
    t: "table",
    head: ["Cụm", "Nghĩa"],
    rows: [
      ["on your left as you come in · straight ahead of you", "bên trái khi bước vào · ngay trước mặt"],
      ["the first building on your right, before you reach… · just past…", "toà đầu tiên bên phải, trước khi tới… · ngay sau khi qua…"],
      ["facing… · directly across / opposite…", "đối diện ngay"],
      ["at the northern / far end of… · at the top / bottom of (the lane)", "ở đầu phía bắc / tận cuối · đầu trên / đầu dưới con đường"],
      ["turn right instead of left · come back to… and carry on towards…", "rẽ phải thay vì trái · quay lại… rồi đi tiếp về phía…"],
      ["It used to stand… · older maps show it… · everyone expects… but that's actually…", "BẪY: vị trí cũ / toà nhà trông giống — chờ now, actually, you'll find it"],
    ],
  },
  { t: "rule", formula: "Điểm xuất phát + hướng nhìn → đi theo bằng bút → used to / older maps / expect = chờ → now / actually / you'll find it = ghi", vi: "Đi về Đông: trái = Bắc. Đi về Nam: trái = Đông. Đi về Tây: trái = Nam." },
];
