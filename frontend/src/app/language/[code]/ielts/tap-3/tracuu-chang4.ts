/**
 * Mục TRA CÔNG THỨC của IELTS Tập 3 — chặng 4 (Ngày 19–24). Soạn cùng `ngay/ngay19..24.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T3.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG4: Block[] = [
  /* ── Ngày 19 ── */
  { t: "h", text: "4.1 (Ngày 19 · mục 1) Câu tường thuật — câu kể: lùi một thì" },
  {
    t: "table",
    head: ["Lời trực tiếp", "Lời tường thuật"],
    rows: [
      ["work · am working", "worked · was working"],
      ["have worked · worked", "had worked"],
      ["will · can · may · must", "would · could · might · had to"],
      ["now · today · tomorrow · yesterday · here", "then · that day · the next day · the day before · there"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "S + said (that) + S + V lùi thì  ·  S + told + O + (that) + S + V lùi thì", vi: "Động từ dẫn ở quá khứ ⇒ lùi thì, đổi đại từ, đổi thời gian", examples: [{ en: "She said (that) she was looking for a new job.", vi: "Cô ấy nói cô ấy đang tìm việc mới." }] },
      { formula: "S + say / argue (that) + S + V giữ nguyên thì", vi: "Động từ dẫn ở hiện tại (Task 2, Part 3) ⇒ không lùi", examples: [{ en: "Many experts say that exercise improves memory.", vi: "Nhiều chuyên gia nói tập thể dục cải thiện trí nhớ." }] },
    ],
  },
  { t: "rule", formula: "S + said (that) + S + V lùi một thì  ·  S + say / argue (that) + S + V giữ nguyên thì", vi: "Quá khứ ⇒ lùi; hiện tại / sự thật còn đúng ⇒ không lùi." },

  { t: "h", text: "4.2 (Ngày 19 · mục 2) Tường thuật câu hỏi" },
  {
    t: "patterns",
    rows: [
      { formula: "S + asked (+ O) + if / whether + S + V lùi thì", vi: "Câu hỏi Yes / No", examples: [{ en: "The examiner asked me if I lived near there.", vi: "Giám khảo hỏi tôi có sống gần đó không." }] },
      { formula: "S + asked (+ O) + Wh- + S + V lùi thì", vi: "Câu hỏi Wh- — không đảo ngữ, không do / does / did", examples: [{ en: "They asked me why I had chosen that course.", vi: "Họ hỏi vì sao tôi đã chọn khoá đó." }] },
    ],
  },
  { t: "rule", formula: "S + asked + (O) + if / whether / Wh- + S + V lùi thì", vi: "Trật tự câu kể + lùi thì; kết bằng dấu chấm." },

  { t: "h", text: "4.3 (Ngày 19 · mục 3–4) Tường thuật mệnh lệnh, lời khuyên, đề nghị · say / tell" },
  {
    t: "patterns",
    rows: [
      { formula: "S + told / asked / advised / warned / reminded + O + (not) + to V", vi: "bảo / nhờ / khuyên / cảnh báo / nhắc ai (đừng) làm gì", examples: [{ en: "Police warned drivers not to drive in the storm.", vi: "Cảnh sát cảnh báo tài xế đừng lái xe trong bão." }] },
      { formula: "S + suggested / recommended + V-ing  ·  + that + S + (should) + V", vi: "gợi ý / đề xuất — không có O + to V", examples: [{ en: "She suggested taking the train.", vi: "Cô ấy gợi ý đi tàu." }] },
      { formula: "S + promised / refused / agreed / offered + to V  ·  admitted / denied + V-ing  ·  apologised for + V-ing", vi: "hứa / từ chối / đồng ý / đề nghị · thừa nhận / chối · xin lỗi vì", examples: [{ en: "He denied copying the essay.", vi: "Cậu ấy chối việc chép bài luận." }] },
      { formula: "say + (that)…  ·  say to + người  ·  tell + người + (that)… / to V", vi: "say không có người ngay sau; tell bắt buộc có người", examples: [{ en: "She told me (that) she was late.", vi: "Cô ấy bảo tôi là cô ấy trễ." }] },
    ],
  },
  { t: "rule", formula: "told / advised / warned + O + (not) to V  ·  suggested + V-ing / that S (should) V", vi: "Chọn động từ dẫn theo ý rồi theo đúng khuôn của nó." },

  { t: "h", text: "4.4 (Ngày 19 · mục 5) Động từ tường thuật học thuật" },
  {
    t: "table",
    head: ["Nhóm", "Động từ"],
    rows: [
      ["Trung lập", "state · note · observe · point out · explain"],
      ["Khẳng định mạnh", "argue · claim (chưa chắc đúng) · maintain · insist"],
      ["Dè dặt", "suggest · indicate · imply · estimate"],
      ["Thừa nhận", "acknowledge · admit · accept · concede"],
      ["Phản bác", "deny · doubt / question (+ whether) · challenge"],
      ["Đề xuất – cảnh báo", "propose · recommend · warn · predict"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "S + argue / claim / suggest / point out + that + S + V", vi: "Khuôn chính — thì hiện tại, không lùi", examples: [{ en: "Opponents of the plan argue that it will damage small businesses.", vi: "Người phản đối kế hoạch lập luận rằng nó sẽ gây hại cho doanh nghiệp nhỏ." }] },
      { formula: "It is (often) argued / claimed / said + that + S + V", vi: "Không cần nêu ai nói — hợp câu mở bài Task 2", examples: [{ en: "It is often claimed that money cannot buy happiness.", vi: "Người ta thường cho rằng tiền không mua được hạnh phúc." }] },
      { formula: "According to + N, + S + V", vi: "Theo… — không thêm say; không dùng According to me", examples: [{ en: "According to a recent survey, most commuters would prefer to work from home.", vi: "Theo một khảo sát gần đây, đa số người đi làm muốn làm tại nhà hơn." }] },
    ],
  },
  { t: "rule", formula: "Supporters argue that… · Critics claim that… · Studies suggest that… · Even critics acknowledge that…", vi: "Đổi say / think thành động từ đúng sắc thái." },

  { t: "h", text: "4.5 (Ngày 19 · mục 6–7) Modal suy đoán hiện tại và quá khứ" },
  {
    t: "table",
    head: ["Mức chắc", "Hiện tại", "Quá khứ"],
    rows: [
      ["chắc hẳn (≈ 95%)", "must + V / be V-ing", "must have + V3"],
      ["có lẽ (≈ 50%)", "may / might / could + V", "may / might / could have + V3"],
      ["không thể nào", "can't + V", "can't / couldn't have + V3"],
      ["lẽ ra nên (phê bình, tiếc)", "—", "should (not) have + V3"],
    ],
  },
  { t: "rule", formula: "S + must / might / can't + V  ·  S + must / might / can't + have + V3  ·  S + should have + V3", vi: "Phủ định của must (suy đoán) là can't, không phải mustn't." },

  { t: "h", text: "4.6 (Ngày 19 · Nói mục 2–5) Part 3 “Some people say…” — khung T–V–M–V" },
  {
    t: "patterns",
    rows: [
      { formula: "A lot of people say / reckon (that)…  ·  People … tend to think (that)…  ·  You often hear that…", vi: "T — thuật lại ý người ta bằng lời mình", examples: [{ en: "A lot of people reckon that kids spend too much time on their phones.", vi: "Nhiều người nghĩ trẻ con dùng điện thoại quá nhiều." }] },
      { formula: "I suppose that's because…  ·  They might be + V-ing  ·  They must have + V3", vi: "V — đoán vì sao họ nghĩ vậy", examples: [{ en: "They might be comparing us with how they grew up.", vi: "Có lẽ họ đang so chúng tôi với cách họ lớn lên." }] },
      { formula: "I can see why they'd say that, but personally I'd say (that)…", vi: "M — ý mình, có mức độ", examples: [{ en: "I can see why they'd say that, but personally I think it's only true for small things.", vi: "Tôi hiểu vì sao họ nói vậy, nhưng cá nhân tôi nghĩ nó chỉ đúng với chuyện nhỏ." }] },
    ],
  },
  { t: "rule", formula: "A lot of people say that… → I suppose that's because… → Personally, I'd say… → For instance, …", vi: "Thuật lại — Vì sao — ý Mình — Ví dụ (35–45 giây)." },

  /* ── Ngày 20 ── */
  { t: "h", text: "4.7 (Ngày 20 · Viết mục 2) Đọc bảng hai chiều" },
  { t: "rule", formula: "Total trước → lượt ngang (hướng đi từng hàng) → lượt dọc (thứ hạng từng cột) → khoanh 8–12 số", vi: "Chọn số đầu – cuối của hàng đổi mạnh và chỗ đổi thứ hạng; số ở giữa thay bằng trạng từ (steadily, gradually)." },

  { t: "h", text: "4.8 (Ngày 20 · Viết mục 3) Hàng / cột Total" },
  {
    t: "patterns",
    rows: [
      { formula: "In total, / Altogether, + S + V  ·  The total number of + N + rose / fell from A to B", vi: "Nêu con số tổng — mở thân bài", examples: [{ en: "In total, 550,000 journeys were made each day in 2005, rising to 610,000 by 2025.", vi: "Tổng cộng có 550.000 chuyến đi mỗi ngày năm 2005, tăng lên 610.000 vào năm 2025." }] },
      { formula: "S + accounted for / made up / represented + phần + of the total", vi: "Tỉ trọng của một hạng mục", examples: [{ en: "Car journeys accounted for well over half of the total in 2005.", vi: "Số chuyến ô tô chiếm hơn hẳn một nửa tổng số năm 2005." }] },
      { formula: "A out of B + N", vi: "A trong số B — nêu tỉ trọng không cần phần trăm", examples: [{ en: "By 2025, 240,000 out of 610,000 journeys were made by car.", vi: "Tới 2025, 240.000 trong số 610.000 chuyến là bằng ô tô." }] },
      { formula: "The overall rise / fall was largely due to + N", vi: "Thành phần kéo tổng lên / xuống", examples: [{ en: "The overall rise was largely due to the growth in rail and bicycle journeys.", vi: "Mức tăng chung phần lớn do các chuyến tàu và xe đạp tăng." }] },
    ],
  },
  { t: "rule", formula: "In total, A … rising to B  ·  S + accounted for + phần + of the total  ·  A out of B + N", vi: "Total = bức tranh chung + mẫu số; không phải một hạng mục để so ngang hàng. 310,000 = 310 thousand (không s)." },

  { t: "h", text: "4.9 (Ngày 20 · Viết mục 4) Bội số và mức chênh trong bảng" },
  {
    t: "table",
    head: ["Ý", "Khung câu"],
    rows: [
      ["gấp hơn đôi / gần gấp ba", "S + more than doubled / almost tripled, from A to B"],
      ["gấp bốn", "a (more than) fourfold increase · over four times as high as"],
      ["gấp N lần (so hai hạng mục)", "There were N times as many + N + as + N"],
      ["vượt", "S + exceeded + O (A compared with B) — không than"],
      ["mức chênh / điểm đến", "fell **by** 70,000 · fell **to** 240,000"],
      ["gần như không đổi", "changed very little, rising by just 10,000"],
    ],
  },

  { t: "h", text: "4.10 (Ngày 20 · Viết mục 5) Bảng có cột khác đơn vị" },
  {
    t: "patterns",
    rows: [
      { formula: "S + had the highest / longest / lowest + N, at + số + đơn vị", vi: "Hạng nhất của MỘT cột", examples: [{ en: "Brenton had the longest average journey time, at 47 minutes.", vi: "Brenton có thời gian đi lại trung bình dài nhất, 47 phút." }] },
      { formula: "N + ranged from A (in X) to B (in Y)", vi: "Khoảng dao động của một cột", examples: [{ en: "Monthly costs ranged from $40 in Dunmore to $160 in Calder.", vi: "Chi phí hằng tháng dao động từ 40 đô ở Dunmore tới 160 đô ở Calder." }] },
      { formula: "X and Y + V + A and B + respectively", vi: "Hai chủ thể — hai số CÙNG đơn vị", examples: [{ en: "In Dunmore and Ashford, 71% and 62% of commuters respectively used public transport.", vi: "Ở Dunmore và Ashford, lần lượt 71% và 62% người đi làm dùng giao thông công cộng." }] },
      { formula: "S + V (cột 1), yet / although / while + S + V (cột 2)", vi: "Nối hai cột bằng quan hệ, mỗi vế giữ đơn vị riêng", examples: [{ en: "Calder's commuters travelled the furthest, yet their journeys were shorter than those in Brenton.", vi: "Người đi làm ở Calder đi xa nhất, vậy mà chuyến đi của họ ngắn hơn ở Brenton." }] },
    ],
  },
  { t: "rule", formula: "Mỗi cột: highest + lowest (+ đơn vị)  ·  Nối hai cột: S + V, yet / while + S + V  ·  KHÔNG so số của hai đơn vị", vi: "So dọc trong cột; bảng một năm thì không dùng increased / decreased." },

  { t: "h", text: "4.11 (Ngày 20 · Nghe mục 4) Sentence completion khi nghe + tín hiệu sửa thông tin" },
  {
    t: "table",
    head: ["Nghe thấy", "Nghĩa là"],
    rows: [
      ["I was going to… / I thought we'd…", "định vậy nhưng sẽ đổi"],
      ["It used to (be)…", "trước đây vậy, giờ khác"],
      ["It was supposed to be…, but…", "lẽ ra vậy, nhưng đã đổi"],
      ["I assumed / presumed… but…", "tưởng vậy mà không phải"],
      ["Not A — B", "phủ định A, chốt B"],
    ],
  },
  { t: "rule", formula: "Giới hạn từ → loại từ → từ mốc → nghe tới câu chốt", vi: "Đáp án là thông tin CUỐI CÙNG được khẳng định; điền đúng từ nghe được, không đổi dạng." },

  { t: "h", text: "4.12 (Ngày 20 · Nghe mục 2 · 6) Giọng New Zealand và âm yếu" },
  {
    t: "table",
    head: ["Hiện tượng", "Nghe như", "Thật ra là"],
    rows: [
      ["NZ: e ngắn /e/ → gần /ɪ/", "tin · sivven · rid · lift", "ten · seven · red · left"],
      ["NZ: a ngắn /æ/ → gần /e/", "ket · beg", "cat · bag"],
      ["NZ: i ngắn /ɪ/ → gần /ə/", "fush · sux", "fish · six"],
      ["Âm yếu: to · of · have · can", "/tə/ · /əv/ · /əv/ · /kən/", "going to · a fee of · must have · we can"],
      ["Âm yếu: and · for · at · was · them", "/ən/ · /fə/ · /ət/ · /wəz/ · /ðəm/", "cuối câu / nhấn mạnh thì giữ dạng mạnh"],
    ],
  },

  /* ── Ngày 21 ── */
  { t: "h", text: "4.13 (Ngày 21 · mục 2–3) Nhượng bộ: although / even though / while + mệnh đề · despite / in spite of + danh từ" },
  {
    t: "patterns",
    rows: [
      { formula: "Although / Even though / While + S + V, S + V", vi: "Mặc dù A, (vẫn) B — không thêm but", examples: [{ en: "Although electric cars are becoming cheaper, most families still cannot afford one.", vi: "Mặc dù xe điện đang rẻ dần, phần lớn gia đình vẫn chưa mua nổi." }] },
      { formula: "Despite / In spite of + N / V-ing, S + V", vi: "despite KHÔNG có of; sau nó không có S + V", examples: [{ en: "Despite working long hours, nurses are paid relatively little.", vi: "Dù làm việc nhiều giờ, y tá được trả lương khá thấp." }] },
      { formula: "Despite / In spite of + the fact that + S + V, S + V", vi: "Giữ nguyên mệnh đề — trang trọng", examples: [{ en: "Despite the fact that smoking is banned in public places, many people still smoke outside offices.", vi: "Mặc dù hút thuốc bị cấm ở nơi công cộng, nhiều người vẫn hút ngoài văn phòng." }] },
    ],
  },
  { t: "rule", formula: "Although + S + V  ⇄  Despite + N / V-ing", vi: "Một câu chỉ có although HOẶC but. Ý muốn nhấn đặt ở mệnh đề chính." },

  { t: "h", text: "4.14 (Ngày 21 · mục 4–5) Đối lập và trạng từ nối hai câu" },
  {
    t: "table",
    head: ["Cụm", "Dùng khi", "Ví dụ"],
    rows: [
      ["…, whereas / while + S + V", "so hai đối tượng trong MỘT câu (Task 1)", "Spending on housing rose to 35%, whereas the figure for food fell to 18%."],
      ["In contrast, / By contrast,", "so hai đối tượng ở HAI câu", "Car ownership doubled. In contrast, the number of bicycles remained stable."],
      ["On the other hand,", "mặt còn lại của cùng một vấn đề", "On the other hand, it puts pressure on local wildlife."],
      ["On the contrary,", "bác bỏ ý vừa nêu (sau câu phủ định)", "The scheme was not a failure. On the contrary, it saved millions."],
      ["However, / Nevertheless, / Even so,", "nhượng bộ giữa hai câu — sau dấu chấm hoặc chấm phẩy", "The plan was expensive; however, it was approved."],
      ["…, yet + S + V", "liên từ như but, trang trọng hơn", "The plan was expensive, yet it was approved."],
    ],
  },
  { t: "rule", formula: "S1 + V, whereas + S2 + V  ·  S + V. However, / Nevertheless, + S + V", vi: "Hai đối tượng khác nhau ⇒ whereas / In contrast. Trạng từ nối không đứng sau dấu phẩy." },

  { t: "h", text: "4.15 (Ngày 21 · mục 6–7) Nguyên nhân và kết quả" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V + because / since / as + S + V", vi: "vì + mệnh đề", examples: [{ en: "Since most people now shop online, many high-street stores have closed.", vi: "Vì giờ phần lớn mọi người mua hàng trên mạng, nhiều cửa hàng trên phố đã đóng cửa." }] },
      { formula: "S + V + because of / due to / owing to / as a result of + N", vi: "vì / do + danh từ", examples: [{ en: "Owing to a shortage of teachers, class sizes have grown.", vi: "Do thiếu giáo viên, sĩ số lớp đã tăng." }] },
      { formula: "S + be + (largely / partly / mainly) + due to + N", vi: "… (phần lớn / một phần) là do…", examples: [{ en: "The rise in obesity is partly due to a lack of exercise.", vi: "Sự gia tăng béo phì một phần là do thiếu vận động." }] },
      { formula: "S + V. As a result, / Therefore, / Consequently, + S + V", vi: "kết quả ở câu thứ hai", examples: [{ en: "Forests are being cleared for farmland. As a result, many animals have lost their homes.", vi: "Rừng đang bị phá để lấy đất canh tác. Kết quả là nhiều loài vật mất nơi ở." }] },
      { formula: "S + V, which means (that) + S + V  ·  S + V, V-ing + O", vi: "kết quả trong cùng một câu", examples: [{ en: "Factories moved abroad, leading to a sharp rise in unemployment.", vi: "Các nhà máy chuyển ra nước ngoài, dẫn tới thất nghiệp tăng mạnh." }] },
    ],
  },
  { t: "rule", formula: "because + S + V  ·  because of / due to / owing to + N  ·  As a result, + S + V", vi: "Không because… so… · Không because of + mệnh đề." },

  { t: "h", text: "4.16 (Ngày 21 · mục 8) Động từ và danh từ nhân quả — chiều mũi tên" },
  {
    t: "table",
    head: ["Chiều", "Động từ", "Ví dụ"],
    rows: [
      ["Nguyên nhân → kết quả", "cause · lead to · result in · bring about · contribute to · give rise to", "Heavy rain led to flooding."],
      ["Kết quả ← nguyên nhân", "result from · stem from · arise from · be caused by · be due to", "The flooding resulted from heavy rain."],
      ["Danh từ + giới từ", "the cause of · the reason for · an effect / impact on · a consequence of · a factor in", "Tourism has a negative impact on wildlife."],
    ],
  },
  { t: "rule", formula: "Nguyên nhân + lead to / result in + kết quả  ·  Kết quả + result from / stem from + nguyên nhân", vi: "IN → kết quả; FROM → nguyên nhân. lead to + N / V-ing." },

  { t: "h", text: "4.17 (Ngày 21 · mục 10) Câu khung cho bài thi" },
  {
    t: "patterns",
    rows: [
      { formula: "While I accept that + S + V, I believe that + S + V", vi: "Mở bài Task 2 / Part 3 — lập trường có nhượng bộ", examples: [{ en: "While I accept that zoos educate children, I do not think that this justifies keeping large animals in cages.", vi: "Tuy tôi công nhận sở thú giáo dục trẻ em, tôi không cho rằng điều đó biện minh cho việc nhốt thú lớn trong chuồng." }] },
      { formula: "The figure for A + V, whereas that for B + V  ·  Despite + N, S + V + overall", vi: "Task 1 — so hai nhóm; nêu ngoại lệ của xu hướng", examples: [{ en: "In spite of a brief fall in 2015, car sales doubled over the period.", vi: "Mặc dù giảm nhẹ năm 2015, doanh số ô tô tăng gấp đôi trong cả giai đoạn." }] },
    ],
  },

  /* ── Ngày 22 ── */
  { t: "h", text: "4.18 (Ngày 22 · Viết mục 3–4) Two-part question — đếm vế và bố cục" },
  {
    t: "table",
    head: ["Bước", "Làm gì"],
    rows: [
      ["Đếm vế", "số vế = số câu hỏi + số đối tượng thêm sau AND (people **and** the environment ⇒ 3 vế)"],
      ["Mở bài", "paraphrase đề + trả lời ngắn CẢ HAI câu hỏi"],
      ["Thân bài 1", "câu hỏi 1 — 2 ý, mỗi ý có giải thích + ví dụ"],
      ["Thân bài 2", "câu hỏi 2 — chia đôi cho hai đối tượng, có câu chuyển"],
      ["Kết bài", "trả lời lại hai câu hỏi bằng từ khác; không ý mới, không giải pháp nếu đề không hỏi"],
    ],
  },
  { t: "rule", formula: "Số vế = số câu hỏi + số đối tượng thêm sau AND", vi: "Đếm trước, nghĩ ý sau. Mỗi vế ≥ 1 ý có giải thích." },

  { t: "h", text: "4.19 (Ngày 22 · Viết mục 5–6) Kho ý tưởng — ba công cụ sinh ý + trang mẫu chủ đề Animals & nature" },
  {
    t: "table",
    head: ["Công cụ", "Câu tự hỏi"],
    rows: [
      ["Bánh xe tầng", "Chạm tới ai: cá nhân → gia đình → doanh nghiệp → môi trường → xã hội?"],
      ["Nhóm người", "Trẻ em · người đi làm · người già · nông dân · người thành phố · chính phủ — mỗi nhóm khác nhau thế nào?"],
      ["Chuỗi hệ quả", "Rồi sao nữa? (hỏi 2–3 lần)"],
      ["Từ 2–3 bài báo", "đọc tít + đoạn đầu → ghi 1 sự việc + 1 hệ quả bằng từ khoá → xếp ô → viết 1 câu của mình"],
    ],
  },
  {
    t: "table",
    head: ["Animals & nature", "Ý (từ khoá)", "Collocation"],
    rows: [
      ["Nguyên nhân", "habitat loss · over-exploitation · pollution & pesticides · invasive species", "clear forests for farmland · poaching · overfishing · the illegal wildlife trade"],
      ["Hệ quả với người", "food & income · flood protection · tourism jobs", "play a vital role in · depend on · ecotourism"],
      ["Hệ quả với môi trường", "food chain breaks", "upset the balance of nature · loss of biodiversity"],
      ["Giải pháp (khi đề hỏi)", "protect · enforce · educate", "nature reserves · impose a ban on · raise awareness of"],
      ["Sở thú — ủng hộ / phản đối", "breeding programmes, education ↔ suffering in captivity, entertainment", "on the verge of extinction · in the wild · in captivity · natural habitat"],
    ],
  },

  { t: "h", text: "4.20 (Ngày 22 · Viết mục 10) Sáu câu khung Two-part question" },
  {
    t: "patterns",
    rows: [
      { formula: "This essay will argue that + S + V, and that + S + V.", vi: "Câu luận điểm trả lời hai câu hỏi", examples: [{ en: "This essay will argue that human activity is the main cause, and that the consequences are serious both for people and for the natural environment.", vi: "Bài này sẽ lập luận rằng hoạt động của con người là nguyên nhân chính, và rằng hệ quả nghiêm trọng với cả con người lẫn môi trường tự nhiên." }] },
      { formula: "The principal reason why + S + V + is + N / that + S + V.", vi: "Câu chủ đề thân bài 1", examples: [{ en: "The principal reason why so many species are disappearing is the loss of their natural habitat.", vi: "Lý do chính khiến nhiều loài đang biến mất là mất môi trường sống tự nhiên." }] },
      { formula: "A second cause / factor is + N.  Although + S + V, S + V.", vi: "Nguyên nhân thứ hai + giải thích bằng nhượng bộ", examples: [{ en: "A second cause is over-exploitation. Although hunting rare animals is illegal in most countries, poaching and overfishing continue.", vi: "Nguyên nhân thứ hai là khai thác quá mức. Dù săn động vật quý hiếm là bất hợp pháp ở hầu hết các nước, săn trộm và đánh bắt quá mức vẫn tiếp diễn." }] },
      { formula: "This trend affects + A + directly.  …  The effects on + B + are equally serious.", vi: "Chia thân bài 2 cho hai đối tượng", examples: [{ en: "This trend affects people directly. … The effects on the environment are equally serious.", vi: "Xu hướng này ảnh hưởng trực tiếp tới con người. … Ảnh hưởng tới môi trường cũng nghiêm trọng không kém." }] },
      { formula: "When + S + V, S + V and S + V.  /  If + S + V, S + may + V.", vi: "Chuỗi hệ quả trong một câu", examples: [{ en: "When fish stocks collapse owing to overfishing, fishermen lose their jobs and local prices rise.", vi: "Khi trữ lượng cá sụp đổ do đánh bắt quá mức, ngư dân mất việc và giá cả địa phương tăng." }] },
      { formula: "In conclusion, + S + V + mainly because + S + V.  This + V + A as well as B.", vi: "Kết bài trả lời lại hai câu hỏi", examples: [{ en: "In conclusion, species are vanishing mainly because humans destroy habitats and hunt or fish too much.", vi: "Tóm lại, các loài đang biến mất chủ yếu vì con người phá huỷ nơi sống và săn bắt, đánh cá quá nhiều." }] },
    ],
  },

  { t: "h", text: "4.21 (Ngày 22 · Nói mục 2) Bốn thì kể chuyện" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V-ed / V2", vi: "Quá khứ đơn — việc chính nối nhau", examples: [{ en: "We arrived at seven, put on gloves and started collecting rubbish.", vi: "Chúng tôi đến lúc bảy giờ, đeo găng và bắt đầu nhặt rác." }] },
      { formula: "S + was / were + V-ing + when + S + V-ed", vi: "Quá khứ tiếp diễn — cảnh nền", examples: [{ en: "While I was walking along the beach, I noticed something moving in a net.", vi: "Khi tôi đang đi dọc bãi biển, tôi để ý thấy thứ gì đó cựa quậy trong một tấm lưới." }] },
      { formula: "S + had + V3", vi: "Quá khứ hoàn thành — chuyện trước đó", examples: [{ en: "By the time we finished, we had filled more than fifty bags.", vi: "Tới lúc xong, chúng tôi đã chất đầy hơn năm mươi bao." }] },
      { formula: "S + was / were going to + V, but + S + V-ed", vi: "Dự định lúc đó — bị đổi", examples: [{ en: "I was going to leave at noon, but I ended up staying until five.", vi: "Tôi định về lúc trưa, nhưng rốt cuộc ở lại tới năm giờ." }] },
    ],
  },
  { t: "rule", formula: "S + V-ed (việc chính) · S + was / were + V-ing (nền) · S + had + V3 (trước đó) · S + was going to + V (dự định)", vi: "Chủ yếu quá khứ đơn + ít nhất một câu của mỗi thì còn lại." },

  { t: "h", text: "4.22 (Ngày 22 · Nói mục 5–6) “Describe a time when…” — 5 chặng và cụm đổi ý" },
  {
    t: "table",
    head: ["Chặng", "Cụm mở chặng"],
    rows: [
      ["1. Bối cảnh", "This happened about … ago, when I was… · We were …-ing"],
      ["2. Sự cố", "All of a sudden… · Everything was fine until… · While I was …-ing, I noticed…"],
      ["3. Hành động + 1 câu thoại", "My first reaction was to… · Someone shouted, “…” · I was going to…, but…"],
      ["4. Kết quả", "In the end… · Luckily… · It turned out that…"],
      ["5. Bài học", "Looking back… · It taught me that… · Since then, I've…"],
      ["Đổi chuyện (15 giây đầu)", "Actually, now that I think about it, a better example would be…"],
      ["Tự sửa", "…, or rather, … · Sorry, I mean…"],
      ["Hết ý sớm", "Another thing I remember is that… · If I had the chance, I would…"],
    ],
  },
  { t: "rule", formula: "Bối cảnh (was V-ing) → All of a sudden + V-ed → hành động + 1 câu thoại → In the end… → Looking back, it taught me that…", vi: "Năm chặng, mỗi chặng một cảm xúc." },

  /* ── Ngày 23 ── */
  { t: "h", text: "4.23 (Ngày 23 · mục 2) That-clause: sau động từ, tính từ, danh từ" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V + (that) + S + V", vi: "Sau think, believe, argue, show, indicate, doubt… (viết thì giữ that)", examples: [{ en: "The figures show that energy use has doubled since 1990.", vi: "Số liệu cho thấy mức dùng năng lượng đã tăng gấp đôi từ năm 1990." }] },
      { formula: "S + be + adj + (that) + S + V", vi: "sure, certain, aware, convinced, worried, surprised", examples: [{ en: "I am convinced that children learn best by doing.", vi: "Tôi tin chắc trẻ học tốt nhất khi được thực hành." }] },
      { formula: "the fact / idea / belief / evidence + that + S + V", vi: "Sau danh từ trừu tượng dùng that, không dùng which", examples: [{ en: "The fact that rents are rising worries many students.", vi: "Việc tiền thuê nhà đang tăng làm nhiều sinh viên lo." }] },
    ],
  },
  { t: "rule", formula: "S + V / be + adj + (that) + S + V  ·  the fact / idea / evidence + that + S + V", vi: "That-clause luôn đủ chủ ngữ + động từ; despite + the fact that + S + V." },

  { t: "h", text: "4.24 (Ngày 23 · mục 3) Wh-clause và if / whether-clause" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V + Wh- + S + V", vi: "Câu hỏi Wh- nằm trong câu khác: trật tự câu kể, không do / does / did", examples: [{ en: "The chart shows where the money is spent.", vi: "Biểu đồ cho thấy tiền được tiêu vào đâu." }] },
      { formula: "S + V + whether / if + S + V (+ or not)", vi: "Câu hỏi Yes / No nằm trong câu khác", examples: [{ en: "It depends on whether you live in a city or in the countryside.", vi: "Tuỳ bạn sống ở thành phố hay nông thôn." }] },
      { formula: "Wh- / whether + to V", vi: "Rút gọn khi cùng chủ ngữ: what to do, how to V, whether to V", examples: [{ en: "Many graduates do not know how to write a good CV.", vi: "Nhiều sinh viên mới ra trường không biết viết CV tốt." }] },
    ],
  },
  {
    t: "table",
    caption: "whether hay if?",
    head: ["Vị trí", "whether", "if"],
    rows: [
      ["Sau động từ", "✅", "✅"],
      ["Sau giới từ (depends on…)", "✅", "❌"],
      ["Đầu câu (chủ ngữ)", "✅", "❌"],
      ["Trước to V · liền với or not", "✅", "❌"],
    ],
  },
  { t: "rule", formula: "S + V + Wh- / whether / if + S + V  (không đảo, không do / does / did)", vi: "Sau giới từ, đầu câu, trước to V ⇒ whether." },

  { t: "h", text: "4.25 (Ngày 23 · mục 4) Mệnh đề danh ngữ làm chủ ngữ" },
  {
    t: "patterns",
    rows: [
      { formula: "What + S + V + is / was + N / that + S + V / (to) V", vi: "“Điều mà… là…” — nhấn ý; động từ chính số ít", examples: [{ en: "What worries me is that nobody reads the terms.", vi: "Điều làm tôi lo là không ai đọc các điều khoản." }, { en: "What the government should do is invest in public transport.", vi: "Việc chính phủ nên làm là đầu tư vào giao thông công cộng." }] },
      { formula: "Whether + S + V + is / depends on + N / Wh- + S + V", vi: "“Việc… hay không thì…”", examples: [{ en: "Whether this is a good thing depends on how the money is spent.", vi: "Tốt hay không tuỳ tiền được tiêu thế nào." }] },
    ],
  },
  { t: "rule", formula: "What + S + V + is + N / that + S + V  ·  Whether + S + V + depends on + N / Wh-", vi: "Mệnh đề làm chủ ngữ ⇒ động từ chính số ít." },

  { t: "h", text: "4.26 (Ngày 23 · mục 5–6) It is + adj + that / to V" },
  {
    t: "patterns",
    rows: [
      { formula: "It is + adj / V3 + that + S + V", vi: "clear · obvious · true · likely · surprising · worrying · said · believed · estimated", examples: [{ en: "It is estimated that a third of all food is thrown away.", vi: "Người ta ước tính một phần ba thức ăn bị vứt bỏ." }] },
      { formula: "It is + adj + (for + sb) + to V", vi: "easy · difficult · hard · possible · expensive · important", examples: [{ en: "It is important for children to spend time outdoors.", vi: "Trẻ em dành thời gian ngoài trời là quan trọng." }] },
      { formula: "S + find / make + it + adj + to V", vi: "It giả ở vị trí tân ngữ", examples: [{ en: "The internet has made it easier to work from home.", vi: "Internet đã làm cho việc làm ở nhà dễ hơn." }] },
    ],
  },
  {
    t: "table",
    caption: "Tính từ nào đi với khung nào?",
    head: ["Tính từ", "+ that + S + V", "+ (for sb) to V"],
    rows: [
      ["clear · obvious · true · likely", "✅", "❌"],
      ["easy · difficult · hard · expensive", "❌", "✅"],
      ["possible · important · necessary · essential", "✅", "✅"],
    ],
  },
  { t: "rule", formula: "It is + adj / V3 + that + S + V  ·  It is + adj + (for + sb) + to V  ·  S + find / make + it + adj + to V", vi: "Chủ ngữ giả It bắt buộc; “I am difficult to…” là sai — It is difficult for me to…" },

  { t: "h", text: "4.27 (Ngày 23 · mục 7) Ôn too · enough · so · such" },
  { t: "rule", formula: "too + adj + (for sb) + to V  ·  adj + enough + to V  ·  so + adj + that + S + V  ·  such + (a) + adj + N + that + S + V", vi: "too…to không lặp tân ngữ; so + tính từ, such + cụm danh từ." },

  { t: "h", text: "4.28 (Ngày 23 · Nói mục 2–5) Part 3 câu hỏi đánh giá — khung Đ – T – N – C" },
  {
    t: "table",
    caption: "Thang phán quyết",
    head: ["Mức", "Câu mở"],
    rows: [
      ["++", "Definitely. I think it's a really positive thing."],
      ["+", "On the whole, yes — though not for everyone."],
      ["±", "It's a bit of a mixed blessing, to be honest."],
      ["−", "I'm not sure it is, actually. · I think it does more harm than good."],
      ["−−", "Honestly, I find it quite worrying."],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "What I like about it is that + S + V", vi: "Mở mặt tốt", examples: [{ en: "What I like about it is that people get their time back.", vi: "Điều tôi thích là mọi người lấy lại được thời gian." }] },
      { formula: "The downside is that / What worries me is that + S + V", vi: "Mở mặt chưa tốt (sau At the same time / Having said that)", examples: [{ en: "Having said that, the downside is that it isn't cheap.", vi: "Dù vậy, mặt trái là nó không rẻ." }] },
      { formula: "So overall it's a good thing, as long as + S + V  ·  It comes down to + how / whether + S + V", vi: "Chốt bằng điều kiện", examples: [{ en: "In the end, it comes down to how people use it.", vi: "Rốt cuộc, mấu chốt là người ta dùng nó thế nào." }] },
    ],
  },
  { t: "rule", formula: "Đánh giá có mức độ → What I like is that… + ví dụ → At the same time, … → So… as long as…", vi: "Mặt mình tin hơn nói trước và dài hơn; chốt = phán quyết + điều kiện." },

  /* ── Ngày 24 ── */
  { t: "h", text: "4.29 (Ngày 24 · mục 4) Bốn cụm lõi chủ đề Energy & resources" },
  {
    t: "patterns",
    rows: [
      { formula: "Although + S + V, S + V + in the long run", vi: "Nhượng bộ rồi nêu lợi ích lâu dài", examples: [{ en: "Although wind farms are costly to build, they reduce our reliance on fossil fuels in the long run.", vi: "Dù trang trại điện gió xây tốn kém, về lâu dài chúng giảm phụ thuộc vào nhiên liệu hoá thạch." }] },
      { formula: "Unless + S + V, S + will + V", vi: "Cảnh báo", examples: [{ en: "Unless we conserve water now, many cities will run out of it within a generation.", vi: "Trừ khi ta tiết kiệm nước ngay, nhiều thành phố sẽ cạn nước trong một thế hệ." }] },
    ],
  },
  { t: "rule", formula: "reduce our reliance on + N  ·  switch to + N  ·  meet the demand for + N  ·  run out of + N", vi: "Thuộc cả giới từ." },

  { t: "h", text: "4.30 (Ngày 24 · mục 5) Collocation tả số liệu Task 1" },
  {
    t: "table",
    head: ["Việc cần nói", "Cụm đúng", "Tránh"],
    rows: [
      ["chiếm bao nhiêu", "account for · make up · the largest share of", "occupy · take"],
      ["ở mức / đạt đỉnh", "stood at + số · peaked at / reached a peak of + số", "reach to"],
      ["tăng giảm + mức độ", "rise steadily · fall sharply · a sharp increase in · a slight dip in", "increase strongly"],
      ["không đổi", "remained stable / unchanged at + số", "—"],
      ["gấp mấy lần", "doubled · halved · a threefold increase in · increased fifteenfold", "—"],
      ["đổi ngôi · đối chiếu", "A overtook B · By contrast, … · the figure for + N · respectively", "—"],
      ["dự báo", "is projected / expected to + V + by + năm", "—"],
    ],
  },
  { t: "rule", formula: "an increase in + cái gì  ·  an increase of + con số  ·  rose from A to B  ·  stood at / peaked at + số", vi: "Giới từ số liệu." },

  { t: "h", text: "4.31 (Ngày 24 · Viết mục 3–5) Task 1 hai hình khác loại (mixed charts)" },
  {
    t: "patterns",
    rows: [
      { formula: "The [hình 1] + compares / shows + N / Wh-clause, while the [hình 2] + shows / gives + N / Wh-clause.", vi: "Mở bài: mỗi hình một mệnh đề, không số", examples: [{ en: "The bar chart compares the amount of electricity generated from five sources in 2000 and 2020, while the line graph shows how much households paid for electricity over the same period.", vi: "Biểu đồ cột so sánh lượng điện từ năm nguồn năm 2000 và 2020, còn biểu đồ đường cho thấy hộ gia đình trả bao nhiêu tiền điện trong cùng giai đoạn." }] },
      { formula: "Overall, + [ý hình 1]. At the same time / It is also clear that + [ý hình 2].", vi: "Overview: mỗi hình một ý, không số", examples: [{ en: "Overall, the country moved away from coal towards gas and renewables. At the same time, the price of electricity almost doubled.", vi: "Nhìn chung, đất nước chuyển từ than sang khí và năng lượng tái tạo. Đồng thời, giá điện tăng gần gấp đôi." }] },
      { formula: "Turning to the [hình 2], / As for the [hình 2], + S + V", vi: "Câu chuyển mở khổ thứ hai", examples: [{ en: "Turning to the line graph, households paid 10 cents per kilowatt-hour in 2000.", vi: "Chuyển sang biểu đồ đường, các hộ trả 10 xu mỗi kilowatt-giờ vào năm 2000." }] },
    ],
  },
  {
    t: "table",
    caption: "Mỗi hình một thì",
    head: ["Hình có gì", "Thì"],
    rows: [
      ["Không có năm", "hiện tại đơn: Heating accounts for 42%."],
      ["Năm đã qua", "quá khứ đơn: Coal was the largest source in 2000."],
      ["Hai mốc quá khứ", "had + V3 + by: This figure had halved by 2020."],
      ["Năm dự báo", "is projected to + V: …is projected to fall to 120 litres by 2040."],
    ],
  },
  { t: "rule", formula: "Mở bài (while) → Overview (mỗi hình 1 ý) → Khổ hình 1 → Turning to… khổ hình 2", vi: "Mỗi khổ một hình, mỗi hình một thì; không because, không ý kiến, không kết luận." },

  { t: "h", text: "4.32 (Ngày 24 · Nghe mục 2–3 · 7) Part 4 — Summary và Table completion" },
  {
    t: "table",
    head: ["Dạng", "Đọc trước", "Khi nghe"],
    rows: [
      ["Summary", "giới hạn từ → loại từ từng chỗ trống (ngữ pháp câu) → từ neo trước chỗ trống", "đáp án nguyên văn, quanh nó là paraphrase; ý sai nêu trước but"],
      ["Table", "tiêu đề cột (loại thông tin) → tiêu đề hàng (mốc chuyển) → hướng số câu", "Its advantage is… / The drawback is… báo cột; Next, / Finally, báo hàng mới"],
    ],
  },
  { t: "rule", formula: "Liệt kê ↗ ↗ ↘  ·  Đối lập ↘↗ but ↘  ·  Finally ↘ | (ngắt) = sang phần mới  ·  từ được nhấn = thông tin mới", vi: "Bốn biển báo bằng giọng của người giảng." },
];
