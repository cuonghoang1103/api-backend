/**
 * IELTS Tập 5 — Ngày 2 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     ÔN TRỌN AWL 570 theo sublist bằng KIỂM TRA CHỦ ĐỘNG (5 bài kiểm × 10 câu + giới từ + cặp dễ nhầm + bảng tự chẩn)
 *                     — KHÔNG dạy lại từng từ: AWL đã dạy ở Tập 2 Ngày 2 · 4 · 10 · 14, Tập 3 Ngày 2 · 8 · 14 · 20, Tập 4 Ngày 2 · 8 · 14 · 20
 *                     và nằm trong Lộ trình từ vựng theo ngày của app. + Government vòng 2 (20 từ, nối Tập 3 Ngày 6)
 *                     + Art vòng 2 (18 từ, nối Tập 4 Ngày 10) + collocation tinh (nối Tập 4 Ngày 6 · 24)      [VB1–10 VC20 VC28 VD3]
 *   Bài 2 (writing)   Band 8 trông thế nào — hai bài mẫu band 7 và band 8 cùng đề, bảng 4 tiêu chí, tự chấm 12 câu hỏi,
 *                     viết lại                                                                          [W01 W19 VD8]
 *                     — nối Tập 3 Ngày 2 (band 6) · Tập 4 Ngày 2 (band 7, “Granted… but…”) · Tập 5 Ngày 1 (tỉ lệ câu sạch)
 *   Bài 3 (speaking)  Band 8 Speaking: ngắt vì nội dung, không vì ngôn ngữ — Part 1 · 2 · 3 band 7 và band 8 cạnh nhau      [S01]
 *                     — nối Tập 3 Ngày 11 (khi quên từ) · Tập 4 Ngày 2 (Part 1 band 7) · Ngày 9 (tone units nhập)
 *                     🔊 tone units ở câu dài
 *   Bài tập Ngày 2    52 câu có đáp án + 1 đoạn viết + 1 bài nói
 * Mọi id bắt đầu `t5d2-`. Dữ kiện thật: Porto Alegre áp dụng ngân sách có sự tham gia của dân từ 1989; con đường gốm sứ
 * ven sông Hồng (Hà Nội) hoàn thành dịp 2010. Các chi tiết khác trong bài mẫu là minh hoạ.
 */
import type { Lesson } from '../data';

export const NGAY_2: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d2-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Ôn trọn AWL 570 bằng kiểm tra chủ động theo sublist + Chính phủ & chi tiêu công vòng 2 + Nghệ thuật vòng 2 + collocation tinh",
    goal: "Biết chính xác sublist nào của AWL mình còn hổng (qua 5 bài kiểm dạng từ, 1 bài giới từ, 1 bài cặp dễ nhầm — 68 câu) và có kế hoạch vá trong 7 ngày; dùng đúng 20 từ bàn về quản trị – ngân sách công và 18 từ phê bình nghệ thuật ở mức band 8; thay được 20 cụm “dùng tạm” của band 7 bằng collocation chính xác.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        items: [
          "**AWL** (Academic Word List) = 570 họ từ học thuật, chia 10 sublist theo tần suất. Bạn ==đã học hết== ở Tập 2–4. Hôm nay **không dạy lại** — hôm nay **kiểm**.",
          "Band 8 LR đòi “chuyển nghĩa **chính xác**”. Với AWL, chính xác nằm ở ba chỗ: ==đúng dạng từ · đúng giới từ · không lẫn cặp gần giống==. Ba loại bài kiểm hôm nay đo đúng ba chỗ đó.",
          "Làm 5 bài kiểm (A–E), mỗi bài 10 câu, **không tra**. Ghi điểm vào bảng tự chẩn ở mục 8. Sublist nào dưới 8/10 → ôn lại đúng Ngày đã dạy.",
          "Từ mới thật sự của hôm nay chỉ có 38 từ: **Chính phủ vòng 2** (20) và **Nghệ thuật vòng 2** (18) — dùng ngay ở bài Viết và bài Nói.",
          "**Collocation tinh**: 20 cặp “band 7 dùng được → band 8 chính xác” (solve poverty → alleviate poverty).",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "Cách ôn 570 họ từ trong một buổi — kiểm trước, vá sau" },
      {
        t: "p",
        text: "Đọc lại 570 họ từ từ đầu là cách ôn kém hiệu quả nhất: bạn sẽ gật đầu với 500 từ đã thuộc và lướt qua 70 từ còn hổng. Cách đúng là ==tự kiểm tra trước==, để biết 70 từ đó nằm ở đâu. Bài kiểm bên dưới lấy mẫu mỗi sublist khoảng 5 họ từ ở dạng khó nhất (đổi loại từ, thêm tiền tố).",
      },
      {
        t: "table",
        head: ["Sublist", "Ví dụ", "Đã dạy ở", "Kiểm hôm nay"],
        rows: [
          ["1", "analyse · assume · derive · significant · vary", "Tập 2 Ngày 2 · 4", "Kiểm A"],
          ["2", "achieve · perceive · reside · restrict · strategy", "Tập 2 Ngày 10 · 14", "Kiểm A"],
          ["3", "compensate · emphasis · imply · justify · sufficient", "Tập 3 Ngày 2", "Kiểm B"],
          ["4", "apparent · commit · implement · investigate · predict", "Tập 3 Ngày 8", "Kiểm B"],
          ["5", "adjust · evolve · fundamental · precise · sustain", "Tập 3 Ngày 14", "Kiểm C"],
          ["6", "acknowledge · discriminate · diverse · exceed · flexible", "Tập 3 Ngày 20", "Kiểm C"],
          ["7", "adapt · convert · innovate · intervene · prohibit", "Tập 4 Ngày 2", "Kiểm D"],
          ["8", "ambiguous · contradict · exploit · fluctuate · inevitable", "Tập 4 Ngày 8", "Kiểm D"],
          ["9", "accommodate · coherent · diminish · erode · violate", "Tập 4 Ngày 14", "Kiểm E"],
          ["10", "assemble · convince · persist · reluctance · albeit", "Tập 4 Ngày 20", "Kiểm E"],
        ],
        caption: "AWL 570 — mỗi sublist 60 họ từ (sublist 10 có 30)",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba mức “biết” một từ — band 8 cần mức 3",
        cols: [
          { title: "Mức 1 — nhận ra", items: ["đọc / nghe thì hiểu", "đủ cho Reading, Listening", "phần lớn AWL của bạn đang ở đây"] },
          { title: "Mức 2 — đúng dạng", items: ["biết danh / động / tính / trạng", "implement → implementation", "Kiểm A–E đo mức này"] },
          { title: "Mức 3 — đúng kết hợp", items: ["đúng giới từ: emphasis **on**", "đúng collocation: **place** emphasis on", "mục 6 · 7 · 11 đo mức này"] },
        ],
      },
      { t: "rule", formula: "kiểm (không tra) → chấm theo sublist → dưới 8/10 thì ôn đúng Ngày đã dạy → kiểm lại sau 7 ngày", vi: "Ôn theo chỗ hổng, không ôn theo thứ tự." },

      /* ── 1 ── */
      { t: "h", text: "1. Kiểm A — Sublist 1–2 (10 câu)" },
      {
        t: "p",
        text: "Viết **dạng đúng** của từ in HOA. Có câu phải thêm tiền tố (un-, in-, re-…). Câu 1–5: sublist 1 · câu 6–10: sublist 2.",
      },
      {
        t: "quiz",
        id: "t5d2-awl-a",
        kind: "fill",
        title: "Kiểm A — viết dạng đúng (10 câu)",
        items: [
          { q: "The results differ ___ from those of earlier studies. (SIGNIFICANT)", answers: ["significantly"], hint: "differ + trạng từ. Họ từ: significant · significance · insignificant · signify." },
          { q: "The data are open to more than one ___ . (INTERPRET)", answers: ["interpretation"], hint: "Sau one → danh từ. interpret · interpretation · misinterpret." },
          { q: "Income is unevenly ___ across the regions. (DISTRIBUTE)", answers: ["distributed"], hint: "is + V3 (bị động). distribution · redistribute." },
          { q: "The new ___ on data protection comes into force in May. (LEGISLATE)", answers: ["legislation"], hint: "legislation (không đếm được) · legislative · legislator." },
          { q: "Rainfall in the region is highly ___ from year to year. (VARY)", answers: ["variable"], hint: "highly + tính từ. vary · variation · variable · invariably · various." },
          { q: "The survey measured public ___ of risk. (PERCEIVE)", answers: ["perception", "perceptions"], hint: "perceive · perception · perceptive. ⚠️ -ceive → -ception (receive → reception)." },
          { q: "The building is used for both ___ and commercial purposes. (RESIDE)", answers: ["residential"], hint: "reside · resident · residence · residential." },
          { q: "There are tight ___ on the use of pesticides. (RESTRICT)", answers: ["restrictions"], hint: "There are → số nhiều. restrictions **on**." },
          { q: "Finishing the project on time was a remarkable ___ . (ACHIEVE)", answers: ["achievement"], hint: "a remarkable + danh từ. achievable · achiever." },
          { q: "The two issues are closely related, so the second point is highly ___ to the first. (RELEVANCE)", answers: ["relevant"], hint: "relevant **to** · irrelevant · relevance." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Kiểm B — Sublist 3–4 (10 câu)" },
      {
        t: "quiz",
        id: "t5d2-awl-b",
        kind: "fill",
        title: "Kiểm B — viết dạng đúng (10 câu)",
        items: [
          { q: "The fund will ___ farmers for crops lost to flooding. (COMPENSATION)", answers: ["compensate"], hint: "will + V. compensate somebody **for** something." },
          { q: "The court ruled that there was ___ evidence to continue the case. (SUFFICIENT)", answers: ["insufficient"], hint: "Nghĩa phủ định → in-. sufficient · sufficiently · insufficient." },
          { q: "The report places great ___ on early intervention. (EMPHASISE)", answers: ["emphasis"], hint: "place emphasis **on**. Số nhiều: emphases. Tính từ: emphatic." },
          { q: "The theory has serious ___ for how reading is taught. (IMPLY)", answers: ["implications"], hint: "implications **for**. imply · implicit (sublist 8)." },
          { q: "His decision cannot be ___ on economic grounds alone. (JUSTIFY)", answers: ["justified"], hint: "be + V3. justification · justifiable · unjustified." },
          { q: "The policy has proved difficult to ___ in rural areas. (IMPLEMENTATION)", answers: ["implement"], hint: "to + V. implement a policy / plan / reform." },
          { q: "The flight was cancelled for no ___ reason. (APPARENTLY)", answers: ["apparent"], hint: "no + tính từ + reason. for no apparent reason = không rõ vì sao." },
          { q: "The committee's ___ of the complaint took six months. (INVESTIGATE)", answers: ["investigation"], hint: "investigation **of / into**. investigator · investigative." },
          { q: "It is hard to make accurate ___ about the weather beyond ten days. (PREDICT)", answers: ["predictions"], hint: "make predictions. predictable · unpredictable." },
          { q: "She has shown a real ___ to the project. (COMMIT)", answers: ["commitment"], hint: "commitment **to**. be committed to + V-ing." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Kiểm C — Sublist 5–6 (10 câu)" },
      {
        t: "quiz",
        id: "t5d2-awl-c",
        kind: "fill",
        title: "Kiểm C — viết dạng đúng (10 câu)",
        items: [
          { q: "After a period of ___ , most new students settle in well. (ADJUST)", answers: ["adjustment"], hint: "a period of + danh từ. adjust **to** · readjust." },
          { q: "The two approaches are ___ different. (FUNDAMENTAL)", answers: ["fundamentally"], hint: "trạng từ + tính từ. fundamentally different / flawed." },
          { q: "The ___ of the species took several million years. (EVOLVE)", answers: ["evolution"], hint: "evolve · evolution · evolutionary." },
          { q: "Fishing at the present level is simply not ___ . (SUSTAIN)", answers: ["sustainable"], hint: "sustainable · unsustainable · sustainability · sustained (kéo dài)." },
          { q: "We need more ___ measurements before drawing any conclusion. (PRECISION)", answers: ["precise"], hint: "precise · precisely · precision · imprecise." },
          { q: "Employers must not ___ against older applicants. (DISCRIMINATION)", answers: ["discriminate"], hint: "discriminate **against**." },
          { q: "The city has a culturally ___ population. (DIVERSITY)", answers: ["diverse"], hint: "diverse · diversity · diversify." },
          { q: "Working hours have become far more ___ since the pandemic. (FLEXIBILITY)", answers: ["flexible"], hint: "flexible · flexibility · inflexible." },
          { q: "The fees seem ___ for such a basic service. (EXCEED)", answers: ["excessive"], hint: "exceed · excess · excessive(ly). ⚠️ exceed viết -ceed (như proceed, succeed)." },
          { q: "The minister made no ___ of the report's criticisms. (ACKNOWLEDGE)", answers: ["acknowledgement", "acknowledgment"], hint: "Cả hai cách viết đều đúng." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Kiểm D — Sublist 7–8 (10 câu)" },
      {
        t: "quiz",
        id: "t5d2-awl-d",
        kind: "fill",
        title: "Kiểm D — viết dạng đúng (10 câu)",
        items: [
          { q: "The ___ of old warehouses into flats has transformed the docks. (CONVERT)", answers: ["conversion"], hint: "convert A **into** B · conversion · convertible." },
          { q: "Desert plants show remarkable ___ to dry conditions. (ADAPT)", answers: ["adaptation", "adaptations"], hint: "adaptation **to**. adaptable · adaptability." },
          { q: "Smoking is ___ in all public buildings. (PROHIBIT)", answers: ["prohibited"], hint: "be prohibited · prohibit somebody **from** doing · prohibition." },
          { q: "The firm is known for constant ___ . (INNOVATE)", answers: ["innovation"], hint: "innovation · innovative · innovator." },
          { q: "Some economists oppose any state ___ in the housing market. (INTERVENE)", answers: ["intervention"], hint: "intervention **in**. intervene." },
          { q: "The wording of the contract is ___ : it can be read in two ways. (AMBIGUITY)", answers: ["ambiguous"], hint: "ambiguous · ambiguity · unambiguous." },
          { q: "Share prices ___ wildly during the crisis. (FLUCTUATION)", answers: ["fluctuated"], hint: "Quá khứ đơn. fluctuate · fluctuation(s)." },
          { q: "Job losses were an ___ consequence of the merger. (INEVITABLY)", answers: ["inevitable"], hint: "an + tính từ. inevitability." },
          { q: "The ___ of natural resources has damaged the region's rivers. (EXPLOIT)", answers: ["exploitation"], hint: "exploit · exploitation · exploitative." },
          { q: "The two statements are ___ : they cannot both be true. (CONTRADICT)", answers: ["contradictory"], hint: "contradict · contradiction · contradictory." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Kiểm E — Sublist 9–10 (10 câu)" },
      {
        t: "quiz",
        id: "t5d2-awl-e",
        kind: "fill",
        title: "Kiểm E — viết dạng đúng (10 câu)",
        items: [
          { q: "The hall can ___ up to three hundred guests. (ACCOMMODATION)", answers: ["accommodate"], hint: "⚠️ chính tả: hai c, hai m. accommodation không đếm được (Anh – Anh)." },
          { q: "The essay has good ideas but lacks ___ . (COHERENT)", answers: ["coherence"], hint: "coherent · coherence · incoherent — chính là chữ C trong tiêu chí CC." },
          { q: "Each extra hour of revision brings ___ returns. (DIMINISH)", answers: ["diminishing"], hint: "diminishing returns = lợi ích giảm dần (cụm cố định)." },
          { q: "Soil ___ is a serious problem on steep slopes. (ERODE)", answers: ["erosion"], hint: "erode · erosion. Nghĩa bóng: erode trust." },
          { q: "The bridge is ___ closed for repairs. (TEMPORARY)", answers: ["temporarily"], hint: "temporary → temporarily (y → ily)." },
          { q: "The ruling was condemned as a ___ of human rights. (VIOLATE)", answers: ["violation"], hint: "a violation **of**. violate a law / right." },
          { q: "Staff were ___ to accept the new working hours. (RELUCTANCE)", answers: ["reluctant"], hint: "be reluctant **to** + V. reluctance · reluctantly." },
          { q: "She remained ___ that the plan would fail. (CONVINCE)", answers: ["convinced"], hint: "be convinced that… · convincing (thuyết phục) · unconvinced." },
          { q: "He went to the doctor with a ___ cough. (PERSIST)", answers: ["persistent"], hint: "persist · persistent · persistence. Cũng dùng: a persistent error — “lỗi dai dẳng” của Ngày 3." },
          { q: "Car ___ is now largely carried out by robots. (ASSEMBLE)", answers: ["assembly"], hint: "assemble · assembly (dây chuyền lắp ráp: assembly line)." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Giới từ đi sau từ AWL — 34 cụm phải thuộc" },
      {
        t: "table",
        head: ["Giới từ", "Cụm"],
        rows: [
          ["**to**", "an approach **to** · access **to** · contribute **to** · respond **to** · attribute A **to** B · equivalent **to** · prior **to** · adjacent **to** · conform **to** · confined **to**"],
          ["**from**", "derive **from** · benefit **from** · deviate **from** · exclude **from** · emerge **from**"],
          ["**on**", "focus **on** · rely **on** · impose A **on** B · emphasis **on** · comment **on**"],
          ["**in**", "participate **in** · invest **in** · inherent **in** · a decline **in**"],
          ["**of**", "consist **of** · aware **of** · capable **of**"],
          ["**with**", "coincide **with** · interact **with** · compatible **with**"],
          ["**for**", "compensate **for** · substitute A **for** B · criteria **for**"],
          ["**against**", "discriminate **against**"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi giới từ còn sót ở band 7.5",
        items: [
          "~~comprise of~~ → The board **comprises** twelve members (không of). Nhưng: **is comprised of / consists of / is composed of**.",
          "~~emphasise on~~ → **emphasise** something (không giới từ) — danh từ mới có on: **emphasis on**. Tương tự: **discuss** something / a **discussion of**; **lack** something / a **lack of**; **demand** something / **demand for**.",
          "~~contribute for~~ / ~~contribute to improve~~ → contribute **to improving** (to là giới từ → V-ing).",
          "~~substitute A by B~~ → substitute **B for A** (dùng B thay A) hoặc **replace A with B**. Hai động từ này ngược thứ tự nhau.",
        ],
      },
      {
        t: "mcq",
        id: "t5d2-awl-gioi-tu",
        title: "Giới từ sau từ AWL — chọn phương án đúng (10 câu)",
        items: [
          { q: "The rise in obesity has been attributed ___ changes in diet.", options: ["for", "to", "with", "by"], correct: 1, why: "attribute A to B." },
          { q: "Most of the island's income derives ___ tourism.", options: ["of", "by", "from", "on"], correct: 2, why: "derive from." },
          { q: "The committee ___ twelve members.", options: ["comprises of", "consists", "comprises", "composes of"], correct: 2, why: "comprise + tân ngữ, không of. consists phải có of." },
          { q: "The software is not compatible ___ older operating systems.", options: ["to", "with", "for", "on"], correct: 1, why: "compatible with." },
          { q: "The new tax was imposed ___ all imported cars.", options: ["on", "to", "for", "in"], correct: 0, why: "impose a tax on." },
          { q: "Risk is inherent ___ any new business.", options: ["of", "to", "in", "with"], correct: 2, why: "inherent in." },
          { q: "Prior ___ 1990, the area was farmland.", options: ["of", "than", "from", "to"], correct: 3, why: "prior to = before (trang trọng)." },
          { q: "Charities have contributed ___ the cost of living for many families.", options: ["to reducing", "to reduce", "for reducing", "reducing"], correct: 0, why: "contribute to + V-ing." },
          { q: "Nothing can compensate ___ the loss of a home.", options: ["to", "of", "for", "with"], correct: 2, why: "compensate for." },
          { q: "The speech ___ the need for reform.", options: ["emphasised on", "emphasised", "placed emphasis", "emphasis on"], correct: 1, why: "emphasise + tân ngữ. (place emphasis ON mới có on.)" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Cặp dễ nhầm trong AWL — 12 cặp" },
      {
        t: "table",
        head: ["Cặp", "Từ 1", "Từ 2"],
        rows: [
          ["principal / principle", "**principal** (adj) chính; (n) hiệu trưởng — the principal cause", "**principle** (n) nguyên tắc — in principle"],
          ["affect / effect", "**affect** (v) ảnh hưởng tới — affect health", "**effect** (n) tác động — have an effect on"],
          ["imply / infer", "**imply** người NÓI ngụ ý", "**infer** người NGHE suy ra"],
          ["complement / compliment", "**complement** bổ sung cho nhau", "**compliment** lời khen"],
          ["precede / proceed", "**precede** đi trước", "**proceed** tiếp tục, tiến hành"],
          ["access / assess", "**access** tiếp cận — access to data", "**assess** đánh giá — assess the damage"],
          ["discrete / discreet", "**discrete** tách rời — discrete stages", "**discreet** kín đáo (không thuộc AWL)"],
          ["considerable / considerate", "**considerable** đáng kể", "**considerate** chu đáo (không thuộc AWL)"],
          ["adapt / adopt", "**adapt** thích nghi, chỉnh cho hợp", "**adopt** áp dụng, nhận nuôi (không thuộc AWL)"],
          ["prospect / perspective", "**prospect** triển vọng — job prospects", "**perspective** góc nhìn — from a historical perspective"],
          ["assure / ensure", "**assure** somebody: cam đoan với ai", "**ensure** that…: bảo đảm việc gì (ôn Tập 4 Ngày 14)"],
          ["economic / economical", "**economic** thuộc về kinh tế", "**economical** tiết kiệm (ôn Tập 4 Ngày 14)"],
        ],
      },
      {
        t: "mcq",
        id: "t5d2-awl-de-nham",
        title: "Cặp dễ nhầm — chọn phương án đúng (8 câu)",
        items: [
          { q: "The ___ reason for the delay was bad weather.", options: ["principle", "principal"], correct: 1, why: "principal (adj) = chính." },
          { q: "The new law will ___ thousands of small businesses.", options: ["effect", "affect"], correct: 1, why: "Cần động từ: affect." },
          { q: "From her silence I ___ that she disagreed.", options: ["implied", "inferred"], correct: 1, why: "Người nghe / quan sát suy ra → infer." },
          { q: "Online courses ___ classroom teaching; they do not replace it.", options: ["compliment", "complement"], correct: 1, why: "bổ sung → complement." },
          { q: "A period of drought ___ the famine.", options: ["preceded", "proceeded"], correct: 0, why: "đi trước → precede." },
          { q: "The process can be divided into four ___ stages.", options: ["discreet", "discrete"], correct: 1, why: "tách rời → discrete." },
          { q: "Examiners ___ candidates on four criteria.", options: ["access", "assess"], correct: 1, why: "đánh giá → assess." },
          { q: "The textbook was ___ for younger learners.", options: ["adopted", "adapted"], correct: 1, why: "chỉnh sửa cho hợp → adapt. (adopt a textbook = chọn dùng cuốn đó.)" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bảng tự chẩn — đọc điểm và việc phải làm" },
      {
        t: "table",
        head: ["Bài kiểm", "Điểm của bạn", "Nếu dưới 8/10 → ôn"],
        rows: [
          ["Kiểm A (sublist 1–2)", "___ / 10", "Tập 2 Ngày 2 · 4 · 10 · 14"],
          ["Kiểm B (sublist 3–4)", "___ / 10", "Tập 3 Ngày 2 · 8"],
          ["Kiểm C (sublist 5–6)", "___ / 10", "Tập 3 Ngày 14 · 20"],
          ["Kiểm D (sublist 7–8)", "___ / 10", "Tập 4 Ngày 2 · 8"],
          ["Kiểm E (sublist 9–10)", "___ / 10", "Tập 4 Ngày 14 · 20"],
          ["Giới từ", "___ / 10", "bảng mục 6 — chép tay 34 cụm, mỗi cụm một câu của bạn"],
          ["Cặp dễ nhầm", "___ / 8", "bảng mục 7 + Tập 4 Ngày 14 mục 3"],
        ],
      },
      {
        t: "table",
        head: ["Tổng / 68", "Nghĩa là", "Kế hoạch 7 ngày"],
        rows: [
          ["62–68", "AWL ở mức chủ động — đúng đích Tập 5", "mỗi ngày 5 phút Flashcards các bộ “Từ của khoá — Tập 2 · 3 · 4”, chế độ Việt → Anh"],
          ["52–61", "nhận ra tốt, dạng từ còn hổng", "ôn 2 sublist điểm thấp nhất; mỗi từ sai viết 1 câu vào Sổ lỗi"],
          ["≤ 51", "AWL mới ở mức nhận ra", "mỗi ngày 1 sublist (10 ngày) song song Tập 5; làm lại bài này ở Ngày 12"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách học: vá chỗ hổng mà không mất thêm thời gian",
        items: [
          "Trong Flashcards, mở bộ của Tập có sublist bạn hổng, lọc theo **Ngày** (ví dụ Tập 4 · Ngày 14), bật chế độ **Việt → Anh** và che từ. Nhận ra không tính — phải ==tự viết ra== được.",
          "**Lộ trình từ vựng theo ngày** trong app CT Language cũng đi qua trọn AWL; nếu bạn đang học lộ trình đó, hôm nay coi như buổi kiểm tra giữa chặng.",
          "Ngày 24 của Tập 5 kiểm lại AWL lần cuối. Mục tiêu khi đó: ≥ 62/68.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Government & public spending vòng 2 — quản trị, bầu cử, ngân sách (20 từ)" },
      {
        t: "p",
        text: "Tập 3 Ngày 6 dạy từ để nói ==chính phủ làm gì== (policy, tax, subsidy, allocate, public spending). Đề band 8 hỏi sâu hơn: ==ai có quyền quyết, ai giám sát, và vì sao chính sách hay ngắn hạn==. Hai mươi từ dưới đây trả lời đúng ba câu hỏi đó. Bài Viết hôm nay dùng ít nhất tám từ trong số này.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Bản đồ từ vựng Chính phủ vòng 2",
        center: "Government",
        branches: [
          { label: "Quyền lực từ đâu", items: ["electorate", "mandate", "incumbent", "coalition", "referendum"] },
          { label: "Ra và bỏ luật", items: ["enact", "repeal", "devolve", "lobby"] },
          { label: "Tiền công", items: ["fiscal", "austerity", "ring-fence", "means-tested", "safety net"] },
          { label: "Giám sát · điểm yếu", items: ["governance", "oversight", "scrutiny", "red tape", "vested interest", "short-termism"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "governance", pos: "n", ipa: "/ˈɡʌvənəns/", vi: "cách quản trị, điều hành (một nước, một tổ chức)", ex: "Poor governance, rather than a lack of money, is often the real obstacle to development.", exVi: "Quản trị kém, chứ không phải thiếu tiền, thường mới là trở ngại thật của phát triển.", more: "good / corporate governance · ⚠️ khác **government** (bộ máy chính quyền)" },
          { w: "electorate", pos: "n", ipa: "/ɪˈlektərət/", vi: "toàn thể cử tri", ex: "The electorate has grown more sceptical of campaign promises.", exVi: "Cử tri ngày càng hoài nghi các lời hứa tranh cử.", more: "appeal to the electorate · họ từ: elect · election · electoral" },
          { w: "mandate", pos: "n", ipa: "/ˈmændeɪt/", vi: "sự uỷ quyền của cử tri (để làm một việc)", ex: "The government claims a clear mandate for reform.", exVi: "Chính phủ nói mình được cử tri trao quyền rõ ràng để cải cách.", more: "win / have / lack a mandate **for** · (v) mandate = bắt buộc bằng luật" },
          { w: "incumbent", pos: "n / adj", ipa: "/ɪnˈkʌmbənt/", vi: "người đương nhiệm; đương nhiệm", ex: "Incumbents tend to benefit from a strong economy.", exVi: "Người đương nhiệm thường hưởng lợi khi kinh tế mạnh.", more: "the incumbent president · it is incumbent **on** somebody to… (có bổn phận)" },
          { w: "coalition", pos: "n", ipa: "/ˌkəʊəˈlɪʃn/", vi: "liên minh (các đảng, các nhóm)", ex: "No party won a majority, so a coalition was formed.", exVi: "Không đảng nào giành đa số nên một liên minh được lập ra.", more: "form / join a coalition · a coalition government" },
          { w: "referendum", pos: "n", ipa: "/ˌrefəˈrendəm/", vi: "cuộc trưng cầu dân ý", ex: "The council held a referendum on the new stadium.", exVi: "Hội đồng tổ chức trưng cầu dân ý về sân vận động mới.", more: "hold a referendum **on** · số nhiều: referendums / referenda" },
          { w: "lobby", pos: "v / n", ipa: "/ˈlɒbi/", vi: "vận động hành lang; nhóm vận động", ex: "The industry lobbied hard against the sugar tax.", exVi: "Ngành này vận động mạnh để chống thuế đường.", more: "lobby **for / against** · a powerful lobby · lobbyist" },
          { w: "devolve", pos: "v", ipa: "/dɪˈvɒlv/", vi: "phân quyền, giao quyền xuống cấp dưới", ex: "Power over schools has been devolved to regional councils.", exVi: "Quyền quản lý trường học đã được giao về cho hội đồng vùng.", more: "devolve power **to** · devolution (n) · trái nghĩa: centralise" },
          { w: "enact", pos: "v", ipa: "/ɪˈnækt/", vi: "ban hành (luật)", ex: "The reform was enacted in the face of fierce opposition.", exVi: "Cải cách được ban hành bất chấp sự phản đối dữ dội.", more: "enact legislation / a law · mạnh và trang trọng hơn introduce a law (Tập 3 Ngày 6)" },
          { w: "repeal", pos: "v / n", ipa: "/rɪˈpiːl/", vi: "bãi bỏ (một đạo luật)", ex: "The incoming government promised to repeal the tax.", exVi: "Chính phủ mới hứa bãi bỏ sắc thuế đó.", more: "repeal a law / an act · gần nghĩa: abolish (bãi bỏ một chế độ, tập quán)" },
          { w: "fiscal", pos: "adj", ipa: "/ˈfɪskl/", vi: "thuộc về tài khoá (thu – chi ngân sách nhà nước)", ex: "Fiscal policy alone cannot solve a housing shortage.", exVi: "Riêng chính sách tài khoá không giải quyết được thiếu nhà ở.", more: "fiscal policy / year / discipline · ⚠️ khác **financial** (tài chính nói chung)" },
          { w: "austerity", pos: "n", ipa: "/ɒˈsterəti/", vi: "chính sách thắt lưng buộc bụng (cắt chi tiêu công)", ex: "A decade of austerity left libraries and youth clubs badly underfunded.", exVi: "Một thập kỷ thắt lưng buộc bụng khiến thư viện và câu lạc bộ thanh niên thiếu tiền trầm trọng.", more: "austerity measures · impose austerity" },
          { w: "ring-fence", pos: "v", ipa: "/ˈrɪŋ fens/", vi: "khoanh riêng một khoản tiền, chỉ dùng cho một mục đích", ex: "Revenue from the charge is ring-fenced for public transport.", exVi: "Tiền thu từ khoản phí được khoanh riêng cho giao thông công cộng.", more: "ring-fenced funding / budget · (Mỹ) earmark" },
          { w: "means-tested", pos: "adj", ipa: "/ˈmiːnz testɪd/", vi: "(trợ cấp) chỉ cấp sau khi xét thu nhập, tài sản", ex: "Means-tested benefits reach the poorest but are costly to administer.", exVi: "Trợ cấp xét theo thu nhập đến được người nghèo nhất nhưng tốn kém khi vận hành.", more: "trái nghĩa: universal benefits (cấp cho mọi người) · ↺ Ôn lại — đã học ở Tập 4 Ngày 28" },
          { w: "safety net", pos: "n", ipa: "/ˈseɪfti net/", vi: "lưới an sinh (hỗ trợ khi người dân gặp khó)", ex: "Unemployment insurance is a key part of the social safety net.", exVi: "Bảo hiểm thất nghiệp là phần cốt lõi của lưới an sinh xã hội.", more: "a social / financial safety net · fall through the safety net · ↺ Ôn lại — đã học ở Tập 4 Ngày 16" },
          { w: "oversight", pos: "n", ipa: "/ˈəʊvəsaɪt/", vi: "sự giám sát; (nghĩa 2) sơ suất", ex: "The agency operates with very little parliamentary oversight.", exVi: "Cơ quan này hoạt động gần như không có giám sát của quốc hội.", more: "independent oversight · ⚠️ “It was an oversight” = đó là một sơ suất" },
          { w: "scrutiny", pos: "n", ipa: "/ˈskruːtəni/", vi: "sự xem xét kỹ lưỡng, soi xét", ex: "The contract has come under close scrutiny from the press.", exVi: "Hợp đồng này đang bị báo chí soi rất kỹ.", more: "come under scrutiny · public scrutiny · scrutinise (v) · ↺ Ôn lại — đã học ở Tập 4 Ngày 27" },
          { w: "red tape", pos: "n", ipa: "/ˌred ˈteɪp/", vi: "thủ tục hành chính rườm rà", ex: "Small firms complain that red tape costs them a day a week.", exVi: "Doanh nghiệp nhỏ than rằng thủ tục rườm rà làm họ mất một ngày mỗi tuần.", more: "cut red tape · văn nói và báo chí; Writing trang trọng: excessive bureaucracy" },
          { w: "vested interest", pos: "n", ipa: "/ˌvestɪd ˈɪntrəst/", vi: "lợi ích riêng gắn với việc giữ nguyên hiện trạng; nhóm lợi ích", ex: "Reform was blocked by vested interests in the energy sector.", exVi: "Cải cách bị các nhóm lợi ích trong ngành năng lượng chặn lại.", more: "have a vested interest **in** + V-ing" },
          { w: "short-termism", pos: "n", ipa: "/ˌʃɔːt ˈtɜːmɪzəm/", vi: "lối tư duy chỉ nhìn ngắn hạn", ex: "Electoral cycles encourage short-termism in public investment.", exVi: "Chu kỳ bầu cử khuyến khích tư duy ngắn hạn trong đầu tư công.", more: "political short-termism · trái nghĩa: long-term planning" },
        ],
      },
      {
        t: "table",
        head: ["Muốn nói", "Collocation đúng", "⚠️ Lỗi hay gặp"],
        rows: [
          ["buộc ai chịu trách nhiệm", "**hold** politicians **to account**", "~~make politicians responsibility~~"],
          ["bị soi xét", "**come under** scrutiny", "~~be scrutiny~~"],
          ["cắt giảm thủ tục", "**cut** red tape", "~~reduce the red tapes~~ (không đếm được)"],
          ["giao quyền", "**devolve** power **to** local councils", "~~devolve power for~~"],
          ["khoanh ngân sách", "**ring-fence** funding **for** schools", "~~ring-fence to~~"],
          ["dùng tiền công", "spend **public money** / **taxpayers' money** on", "~~spend public moneys for~~"],
        ],
      },
      {
        t: "quiz",
        id: "t5d2-chinh-phu",
        kind: "fill",
        title: "Điền từ / cụm từ của mục 9 (8 câu)",
        items: [
          { q: "The winning party claimed a ___ for sweeping tax reform. (sự uỷ quyền của cử tri)", answers: ["mandate"], hint: "a mandate for." },
          { q: "After years of ___ , spending on local services had fallen by a quarter. (thắt lưng buộc bụng)", answers: ["austerity"], hint: "years of austerity." },
          { q: "Money raised by the tourist tax is ___ for beach cleaning. (khoanh riêng — một từ có gạch nối)", answers: ["ring-fenced"], hint: "be ring-fenced for." },
          { q: "The law was ___ only two years after it had been passed. (bị bãi bỏ)", answers: ["repealed"], hint: "repeal a law." },
          { q: "Independent ___ of the police has been strengthened. (sự giám sát)", answers: ["oversight"], hint: "independent oversight of." },
          { q: "Farmers' groups ___ against the proposed ban. (vận động hành lang — quá khứ)", answers: ["lobbied"], hint: "lobby against." },
          { q: "Elections every four years encourage political ___ . (tư duy ngắn hạn)", answers: ["short-termism"], hint: "political short-termism." },
          { q: "Ministers should be held to ___ for how the money was spent.", answers: ["account"], hint: "hold somebody to account." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Art vòng 2 — ngôn ngữ phê bình và tranh luận về nghệ thuật (18 từ)" },
      {
        t: "p",
        text: "Tập 4 Ngày 10 dạy từ để ==tả một tác phẩm== (masterpiece, depict, evoke, striking). Vòng 2 dạy từ để ==đánh giá và tranh luận==: tác phẩm thuộc loại nào, vì sao hay, ai quyết định cái gì đáng được trưng bày. Bài Nói hôm nay (Part 2 về một tác phẩm nơi công cộng, Part 3 về tiền công cho nghệ thuật) dùng trực tiếp nhóm từ này.",
      },
      {
        t: "vocab",
        items: [
          { w: "curator", pos: "n", ipa: "/kjʊəˈreɪtə/", vi: "giám tuyển (người chọn và sắp xếp hiện vật, tác phẩm)", ex: "The curator arranged the paintings by theme rather than by date.", exVi: "Giám tuyển sắp tranh theo chủ đề chứ không theo niên đại.", more: "curate (v) an exhibition · a carefully curated collection · ↺ Ôn lại — đã học ở Tập 3 Ngày 12 · Tập 4 Ngày 13" },
          { w: "commission", pos: "v / n", ipa: "/kəˈmɪʃn/", vi: "đặt hàng (một tác phẩm); tác phẩm được đặt hàng", ex: "The city commissioned a local sculptor to design the memorial.", exVi: "Thành phố đặt một nhà điêu khắc địa phương thiết kế đài tưởng niệm.", more: "commission somebody **to** do · a public commission — AWL sublist 2 · ↺ Ôn lại — đã học ở Tập 4 Ngày 24" },
          { w: "genre", pos: "n", ipa: "/ˈʒɒnrə/", vi: "thể loại", ex: "Street art has become a recognised genre in its own right.", exVi: "Nghệ thuật đường phố đã thành một thể loại được công nhận riêng.", more: "a literary / musical genre · ⚠️ phát âm bắt đầu bằng /ʒ/ · ↺ Ôn lại — đã học ở Tập 3 Ngày 28" },
          { w: "medium", pos: "n", ipa: "/ˈmiːdiəm/", vi: "chất liệu, phương tiện biểu đạt (sơn dầu, đồng, video…)", ex: "She works in several media, from bronze to digital video.", exVi: "Cô ấy làm việc với nhiều chất liệu, từ đồng tới video số.", more: "số nhiều: **media** · mixed media — AWL sublist 9 · ↺ Ôn lại — đã học ở Tập 4 Ngày 14" },
          { w: "motif", pos: "n", ipa: "/məʊˈtiːf/", vi: "mô-típ, hoạ tiết / ý tưởng lặp lại", ex: "Water is a recurring motif in his later work.", exVi: "Nước là mô-típ lặp lại trong các tác phẩm về sau của ông.", more: "a recurring / central motif · ⚠️ khác **motive** (động cơ)" },
          { w: "composition", pos: "n", ipa: "/ˌkɒmpəˈzɪʃn/", vi: "bố cục (của bức tranh, bức ảnh); bản nhạc", ex: "The composition draws the eye towards the figure in the doorway.", exVi: "Bố cục dẫn mắt người xem về phía nhân vật ở khung cửa.", more: "a balanced composition · compose (v)" },
          { w: "abstract", pos: "adj", ipa: "/ˈæbstrækt/", vi: "(nghệ thuật) trừu tượng — không tả vật thật", ex: "Many visitors find abstract art harder to engage with.", exVi: "Nhiều khách tham quan thấy khó cảm nghệ thuật trừu tượng hơn.", more: "abstract painting · AWL sublist 6 · trái nghĩa trong hội hoạ: figurative · ↺ Ôn lại — đã học ở Tập 3 Ngày 20" },
          { w: "figurative", pos: "adj", ipa: "/ˈfɪɡərətɪv/", vi: "(nghệ thuật) tả thực, có hình người / vật nhận ra được; (ngôn ngữ) nghĩa bóng", ex: "The mural is figurative: you can recognise every face in it.", exVi: "Bức tranh tường theo lối tả thực: nhận ra được từng khuôn mặt trong đó.", more: "figurative painting · figurative language (nghĩa bóng)" },
          { w: "avant-garde", pos: "adj / n", ipa: "/ˌævɒŋ ˈɡɑːd/", vi: "tiên phong, đi trước thời đại (về nghệ thuật)", ex: "What was avant-garde in the 1960s now hangs in national museums.", exVi: "Thứ từng là tiên phong ở thập niên 1960 nay treo trong bảo tàng quốc gia.", more: "the avant-garde · avant-garde theatre / music" },
          { w: "canon", pos: "n", ipa: "/ˈkænən/", vi: "hệ thống tác phẩm kinh điển được thừa nhận", ex: "Few women painters were admitted to the canon until recently.", exVi: "Mãi gần đây mới có vài nữ hoạ sĩ được đưa vào hàng kinh điển.", more: "the literary / Western canon · canonical (adj)" },
          { w: "derivative", pos: "adj", ipa: "/dɪˈrɪvətɪv/", vi: "(chê) vay mượn, thiếu sáng tạo riêng", ex: "Critics dismissed the album as derivative.", exVi: "Giới phê bình gạt album đó đi vì cho là vay mượn.", more: "trái nghĩa: original · họ AWL: derive (sublist 1)" },
          { w: "artistic merit", pos: "n phr", ipa: "/ɑːˌtɪstɪk ˈmerɪt/", vi: "giá trị nghệ thuật", ex: "Funding should depend on artistic merit, not on popularity.", exVi: "Tài trợ nên dựa vào giá trị nghệ thuật, không dựa vào độ nổi tiếng.", more: "of great / little artistic merit · judge something on its merits" },
          { w: "resonate", pos: "v", ipa: "/ˈrezəneɪt/", vi: "tạo đồng cảm, chạm tới (người xem)", ex: "The film resonated with audiences far beyond its home country.", exVi: "Bộ phim chạm tới khán giả ở rất xa ngoài quê hương của nó.", more: "resonate **with** · resonance (n)" },
          { w: "visceral", pos: "adj", ipa: "/ˈvɪsərəl/", vi: "(phản ứng) bản năng, từ ruột gan chứ không qua suy nghĩ", ex: "The installation provokes a visceral reaction before you have time to think.", exVi: "Tác phẩm sắp đặt gây phản ứng bản năng trước khi bạn kịp nghĩ.", more: "a visceral response / dislike" },
          { w: "understated", pos: "adj", ipa: "/ˌʌndəˈsteɪtɪd/", vi: "(khen) tinh tế, không phô trương", ex: "The memorial is understated: a single line of names cut into dark stone.", exVi: "Đài tưởng niệm rất tinh tế: chỉ một hàng tên khắc vào đá sẫm màu.", more: "understated elegance · trái nghĩa: showy, ostentatious" },
          { w: "pretentious", pos: "adj", ipa: "/prɪˈtenʃəs/", vi: "(chê) làm ra vẻ sâu sắc, khoa trương", ex: "Some people find conceptual art pretentious.", exVi: "Có người thấy nghệ thuật ý niệm làm ra vẻ sâu sắc.", more: "trái nghĩa: unpretentious · ⚠️ không dùng cho người khoe của (đó là showy)" },
          { w: "immersive", pos: "adj", ipa: "/ɪˈmɜːsɪv/", vi: "(trải nghiệm) bao trùm, khiến người xem như ở trong đó", ex: "Immersive digital exhibitions attract visitors who never go to galleries.", exVi: "Triển lãm số kiểu bao trùm thu hút cả những người không bao giờ tới phòng tranh.", more: "an immersive experience · immerse yourself **in**" },
          { w: "accessible", pos: "adj", ipa: "/əkˈsesəbl/", vi: "dễ tiếp cận, dễ hiểu với số đông", ex: "Public sculpture makes art accessible to people who would never buy a ticket.", exVi: "Tượng nơi công cộng đưa nghệ thuật tới những người không bao giờ mua vé.", more: "accessible **to** · AWL sublist 4 (access) · trái nghĩa: elitist (Tập 4 Ngày 10) · ↺ Ôn lại — đã học ở Tập 3 Ngày 20" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Sắc thái khi nhận xét một tác phẩm — khen, chê, trung tính",
        cols: [
          { title: "Khen", items: ["**understated** — tinh tế, kiệm lời", "**accessible** — ai cũng vào được", "**immersive** — cuốn người xem vào", "**resonates with** people — chạm tới"] },
          { title: "Chê", items: ["**derivative** — vay mượn", "**pretentious** — làm ra vẻ", "**elitist** — chỉ dành cho số ít", "**bland** — nhạt, an toàn quá"] },
          { title: "Trung tính (gọi tên)", items: ["**abstract / figurative**", "**avant-garde** — tiên phong", "**genre · medium · motif**", "**composition** — bố cục"] },
        ],
      },
      {
        t: "quiz",
        id: "t5d2-nghe-thuat",
        kind: "fill",
        title: "Điền từ của mục 10 (8 câu)",
        items: [
          { q: "The council ___ a mural for the wall of the new library. (đặt hàng — quá khứ)", answers: ["commissioned"], hint: "commission a mural." },
          { q: "The ___ chose forty works from the museum's store. (giám tuyển)", answers: ["curator"], hint: "curator." },
          { q: "Birds are a recurring ___ in her paintings. (mô-típ)", answers: ["motif"], hint: "a recurring motif — không phải motive." },
          { q: "He paints in oils, but his favourite ___ is charcoal. (chất liệu)", answers: ["medium"], hint: "medium; số nhiều media." },
          { q: "The song really ___ with younger listeners. (chạm tới — quá khứ)", answers: ["resonated"], hint: "resonate with." },
          { q: "It isn't a realistic picture of anything; it's completely ___ . (trừu tượng)", answers: ["abstract"], hint: "abstract ↔ figurative." },
          { q: "Critics called the design ___ : they said it copied a famous building in Sydney. (vay mượn)", answers: ["derivative"], hint: "derivative = thiếu cái riêng." },
          { q: "Free entry makes the gallery ___ to families on low incomes. (dễ tiếp cận)", answers: ["accessible"], hint: "accessible to." },
        ],
      },

      /* ── 11 ── */
      { t: "h", text: "11. Collocation tinh — 20 cặp “band 7 dùng được → band 8 chính xác”" },
      {
        t: "p",
        text: "Cột trái không sai ngữ pháp. Nó chỉ ==không chính xác==: động từ quá chung, hoặc danh từ không đi với động từ đó. Giám khảo band 8 tìm đúng những chỗ này (“collocation”, “precise meaning”). Tập 4 Ngày 6 và Ngày 24 đã dạy collocation theo loại; bảng này là lớp tinh chỉnh cuối.",
      },
      {
        t: "table",
        head: ["Band 7 dùng tạm", "Band 8 chính xác", "Ghi chú"],
        rows: [
          ["~~solve~~ poverty / unemployment", "**alleviate** poverty · **tackle / reduce** unemployment", "solve chỉ đi với problem, puzzle, equation"],
          ["~~solve~~ a conflict", "**resolve** a dispute / conflict", "resolve = dàn xếp xong"],
          ["make a decision (sau khi bàn lâu)", "**reach / arrive at** a decision", "make vẫn đúng; reach nhấn quá trình"],
          ["a ~~big~~ problem", "a **pressing / acute** problem", "pressing = cấp bách; acute = nghiêm trọng"],
          ["~~cause~~ a danger", "**pose** a threat / a risk", "pose đi với threat, risk, challenge, question"],
          ["~~make~~ worries", "**give rise to** concern · **raise** concerns", ""],
          ["very important", "**of paramount importance** · **pivotal**", "dùng 1 lần / bài"],
          ["a ~~big~~ difference", "a **marked** difference · a **stark** contrast", "stark = tương phản gắt"],
          ["~~get / learn~~ knowledge", "**acquire** knowledge · **gain** experience", "~~learn knowledge~~ là lỗi kinh điển"],
          ["~~do~~ research", "**conduct / carry out** research", "research không đếm được"],
          ["~~give~~ money to schools", "**allocate** funding **to** · **channel** resources **into**", ""],
          ["strong evidence", "**compelling** evidence · **anecdotal** evidence (bằng chứng kiểu kể lại)", "strong vẫn đúng"],
          ["~~increase~~ awareness", "**raise** awareness **of**", "⚠️ không phải ~~rise awareness~~"],
          ["~~make~~ the gap smaller / bigger", "**narrow / bridge / widen** the gap", ""],
          ["~~stop~~ spending", "**curb** spending · **rein in** costs", "curb = kìm lại"],
          ["have influence", "**exert** influence / pressure **on**", ""],
          ["find a balance", "**strike** a balance **between** A and B", ""],
          ["~~do~~ a promise", "**honour / break** a pledge · **fulfil** a commitment", ""],
          ["very dependent", "**heavily** dependent / subsidised / reliant", "trạng từ + tính từ"],
          ["a belief many people have", "a **widely held** belief · a **deeply rooted** tradition", ""],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh: collocation “gần đúng”",
        items: [
          "**raise** (ngoại động từ: raise taxes, raise awareness) ≠ **rise** (nội động từ: prices rise). ~~The government rose taxes~~ → raised.",
          "~~deeply dependent~~ → **heavily** dependent. ~~heavily rooted~~ → **deeply** rooted. Trạng từ không thay cho nhau được.",
          "~~strongly unlikely~~ → **highly** unlikely. ~~highly agree~~ → **strongly / wholeheartedly** agree.",
          "**alleviate** chỉ làm nhẹ đi, không làm hết: alleviate poverty / pain / congestion. Muốn nói hết hẳn: **eradicate** poverty.",
          "Đừng nhồi: một bài 280 từ có ==6–8 collocation chính xác== là đủ. Bài mẫu band 8 ở Bài 2 có 9.",
        ],
      },
      {
        t: "quiz",
        id: "t5d2-collocation",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh collocation (8 câu)",
        items: [
          { q: "Cash transfers have done more to ___ poverty than any training scheme. (làm giảm nhẹ)", answers: ["alleviate", "reduce"], hint: "alleviate poverty — không solve." },
          { q: "Rising sea levels ___ a serious threat to coastal cities.", answers: ["pose"], hint: "pose a threat." },
          { q: "The campaign aims to ___ awareness of mental health among students.", answers: ["raise"], hint: "raise awareness — không rise." },
          { q: "Schools must ___ a balance between discipline and freedom.", answers: ["strike"], hint: "strike a balance." },
          { q: "The region is ___ dependent on a single employer.", answers: ["heavily"], hint: "heavily dependent." },
          { q: "After three days of talks, the two sides finally ___ a decision. (quá khứ)", answers: ["reached"], hint: "reach a decision." },
          { q: "The survey was ___ out by an independent institute.", answers: ["carried"], hint: "carry out research / a survey." },
          { q: "There is a ___ contrast between the two halves of the city. (tương phản gắt)", answers: ["stark", "marked", "sharp"], hint: "a stark contrast." },
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "Short-termism is inherent in any system in which incumbents face the electorate every four years.", vi: "Tư duy ngắn hạn là cố hữu trong mọi hệ thống mà người đương nhiệm phải đối mặt cử tri bốn năm một lần. (Task 2 — Government)" },
          { en: "Unless arts funding is ring-fenced, it tends to be the first casualty of austerity.", vi: "Trừ khi tiền cho nghệ thuật được khoanh riêng, nó thường là thứ bị cắt đầu tiên khi thắt lưng buộc bụng. (Task 2 — Art + Government)" },
          { en: "Devolving decisions to local councils does not necessarily improve oversight; it may simply move the problem.", vi: "Giao quyết định về cho hội đồng địa phương không nhất thiết cải thiện giám sát; có khi chỉ dời vấn đề đi chỗ khác. (hedging của Ngày 1)" },
          { en: "I'd say public art works best when it's understated — when you only really notice it the third or fourth time you walk past.", vi: "Tôi cho rằng nghệ thuật công cộng hiệu quả nhất khi nó kiệm lời — khi phải đi ngang lần thứ ba thứ tư bạn mới thật sự để ý. (Part 3)" },
          { en: "A lot of contemporary work strikes people as pretentious, but I think that's partly because nobody's explained what the artist was trying to do.", vi: "Nhiều tác phẩm đương đại bị xem là làm ra vẻ, nhưng tôi nghĩ một phần vì không ai giải thích nghệ sĩ định làm gì. (Part 3)" },
          { en: "Whether a commission has artistic merit is a judgement that curators, not ministers, are best placed to make.", vi: "Một tác phẩm đặt hàng có giá trị nghệ thuật hay không là phán đoán mà giám tuyển, chứ không phải bộ trưởng, mới đủ tư cách đưa ra. (Task 2)" },
        ],
      },
      {
        t: "quiz",
        id: "t5d2-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "collocation chính xác + từ vòng 2: hold … to account · ring-fence · come under scrutiny · raise awareness · resonate with",
        items: [
          { q: "Cử tri nên buộc các chính trị gia chịu trách nhiệm về những lời hứa của họ.", answers: ["The electorate should hold politicians to account for their promises.", "Voters should hold politicians to account for their promises."], hint: "the electorate · hold … to account for · promises" },
          { q: "Ngân sách cho thư viện nên được khoanh riêng.", answers: ["Funding for libraries should be ring-fenced.", "The budget for libraries should be ring-fenced.", "Library funding should be ring-fenced."], hint: "funding for libraries · be ring-fenced" },
          { q: "Quyết định này đã bị công chúng soi xét kỹ.", answers: ["The decision has come under close public scrutiny.", "This decision has come under close public scrutiny.", "The decision has come under close scrutiny from the public."], hint: "come under · close public scrutiny" },
          { q: "Tác phẩm này chạm tới những người chưa bao giờ đến phòng tranh.", answers: ["The work resonates with people who have never been to a gallery.", "This work resonates with people who have never visited a gallery.", "The work resonates with people who have never been to an art gallery."], hint: "resonate with · have never been to · a gallery" },
          { q: "Nghệ thuật công cộng có thể nâng cao nhận thức về lịch sử địa phương.", answers: ["Public art can raise awareness of local history."], hint: "public art · raise awareness of · local history" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d2-viet",
    kind: "writing",
    title: "Viết Task 2: Band 8 trông thế nào — hai bài mẫu band 7 và band 8 cùng đề, bốn tiêu chí, tự chấm và viết lại",
    goal: "Chỉ ra được vì sao một bài Task 2 dừng ở band 7 chứ chưa phải band 8 theo từng tiêu chí (ý mới “nêu và chống đỡ” hay đã “đào sâu, có giới hạn”; liên kết còn lộ hay đã chìm; từ đúng hay từ chính xác; câu sạch thường xuyên hay đa số), tự chấm bài của mình bằng bảng 12 câu hỏi, và viết lại một bài cũ lên một bậc.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài band 7 **không có gì sai lớn**: đủ ý, có lập trường, có chia đoạn, ít lỗi. Nó dừng ở 7 vì bốn chữ: ==khái quát · máy móc · dùng tạm · còn lỗi==.",
          "Band 8 đổi bốn chữ đó thành: ==đào sâu · tự nhiên · chính xác · sạch==. Không dài hơn, không “khó” hơn.",
          "Hôm nay đọc **hai bài cùng một đề** đặt cạnh nhau, chấm cả hai theo 4 tiêu chí, rồi tự chấm bài của bạn bằng **12 câu hỏi có / không**.",
          "Kỹ thuật lõi của TR band 8: mỗi ý chính đi đủ **4 mắt xích** — nhận định → cơ chế → bằng chứng liên quan → giới hạn hoặc hệ quả.",
          "Từ vựng Chính phủ vòng 2 của Bài 1 xuất hiện ngay trong bài mẫu (ring-fenced, held to account, turnout…).",
          "Nối bài cũ: Tập 3 Ngày 2 (band 6), Tập 4 Ngày 2 (band 7, “Granted… but…”), Tập 5 Ngày 1 (tỉ lệ câu sạch, hedging đúng liều).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bốn tiêu chí — band 7 và band 8 khác nhau ở chữ nào" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Chữ đổi"],
        rows: [
          ["**TR** — trả lời đề", "đủ mọi phần; lập trường rõ suốt bài; ý chính được mở rộng và chống đỡ, nhưng **có chỗ khái quát quá** hoặc ý phụ thiếu tập trung", "trả lời **thấu đáo** mọi phần; ý **phát triển tốt**, liên quan, được mở rộng và chống đỡ", "khái quát → đào sâu"],
          ["**CC** — mạch lạc, liên kết", "tổ chức logic, tiến triển rõ; từ nối đa dạng, **có chỗ thừa / thiếu**", "xâu chuỗi ý **logic**; xử lý tốt **mọi mặt** của liên kết; chia đoạn đủ và hợp lý", "máy móc → tự nhiên"],
          ["**LR** — từ vựng", "đủ rộng để có chút linh hoạt và chính xác; dùng từ ít gặp, có ý thức về văn phong và collocation; **thỉnh thoảng sai**", "vốn rộng, dùng trôi chảy để truyền **nghĩa chính xác**; từ ít gặp dùng **khéo**; sai **rất hiếm**", "dùng tạm → chính xác"],
          ["**GRA** — ngữ pháp", "nhiều cấu trúc phức; câu không lỗi **thường xuyên**; còn một số lỗi", "phạm vi rộng; **đa số** câu không lỗi; sai lặt vặt rất hiếm", "còn lỗi → sạch"],
        ],
        caption: "Diễn đạt lại từ bảng mô tả band công khai của IELTS Writing Task 2",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: ba hiểu lầm về band 8",
        items: [
          "**“Band 8 phải dài.”** Sai. Bài mẫu band 8 hôm nay 298 từ; bài band 7 là 264. Hơn nhau 34 từ — chỗ khác là ==mỗi câu làm được nhiều việc hơn==.",
          "**“Band 8 phải dùng từ hiếm.”** Sai. Mô tả viết “dùng khéo”, không viết “dùng nhiều”. Một từ hiếm đặt sai chỗ kéo LR xuống 7.",
          "**“Band 8 không được sai lỗi nào.”** Sai. “Sai lặt vặt rất hiếm” vẫn là band 8. Nhưng lỗi thì và lỗi hoà hợp chủ – vị không được coi là lặt vặt.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đề hôm nay — đếm vế trước khi đọc bài mẫu" },
      {
        t: "p",
        text: "**ĐỀ:** Some people think that ordinary citizens, rather than elected politicians and officials, should decide how public money is spent in their local area. To what extent do you agree or disagree?",
      },
      {
        t: "table",
        head: ["Vế", "Chữ trong đề", "Bài phải làm gì"],
        rows: [
          ["1", "ordinary citizens … should decide", "bàn việc dân TRỰC TIẾP quyết — không phải “dân góp ý”"],
          ["2", "rather than elected politicians and officials", "phải so với phương án kia: đại diện dân cử + công chức"],
          ["3", "how public money is spent", "chuyện chi tiền — không lan sang mọi loại quyết định"],
          ["4", "in their local area", "cấp địa phương — ví dụ phải ở cấp phường, quận, thành phố"],
          ["5", "To what extent", "phải nói rõ mức độ: toàn bộ, một phần, hay không"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: “rather than” là vế hay bị bỏ quên",
        items: [
          "Bài chỉ khen “dân tham gia thì tốt” mà không đụng tới vế 2 sẽ bị coi là trả lời chưa đủ — TR tối đa 6–7.",
          "Vế 4 (local) quyết định ví dụ: bàn ngân sách quốc phòng là lạc phạm vi.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "p",
        text: "Đọc bài band 7 trước. Nó tốt — phần lớn người học sẽ hài lòng với nó. Vừa đọc vừa tự hỏi: ==ý nào được chứng minh, ý nào chỉ được nêu?== Bài có **2 lỗi ngữ pháp nhỏ**; tìm trước khi xem mục 4.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 264 từ",
        paras: [
          { label: "1", text: "In many countries, decisions about local spending are made by politicians and officials. Some people argue that ordinary citizens should make these decisions instead. I partly agree with this view, because citizens know their own area well, but I think that experts are still needed." },
          { label: "2", text: "On the one hand, there are several advantages of letting residents decide. Firstly, local people understand the problems of their neighbourhood better than anyone else. For example, they know which roads are dangerous and which parks need repairing. Secondly, when people can vote on the budget, they feel more responsible for their community and trust the government more. Moreover, this can reduce corruption, because everybody can see where the money go." },
          { label: "3", text: "On the other hand, there are also some disadvantages. Firstly, most citizens do not have enough knowledges about complicated topics such as drainage or public health, so they may choose projects which look attractive but are not really necessary. Secondly, not everybody has time to vote, so the result may only show the opinion of a small group of people. Furthermore, a budget needs long-term planning, and ordinary people usually think about the short term. Therefore, professionals should make the big decisions." },
          { label: "4", text: "In conclusion, I believe that citizens should have a voice in how local money is spent, but they should not replace politicians and experts completely. The best solution is that the two groups work together, so that local knowledge and professional skills can both be used. In this way, public money will be spent more wisely and people will be more satisfied with their local government." },
        ],
      },
      {
        t: "p",
        text: "Bây giờ đọc bài band 8. Cùng lập trường (đồng ý một phần), gần như cùng các ý. Để ý ba thứ: ==mỗi đoạn có mấy ý==, ==từ nối đầu câu còn lại bao nhiêu==, và ==câu cuối của mỗi thân bài làm việc gì==.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 298 từ",
        paras: [
          { label: "1", text: "Whether local budgets should be placed in the hands of residents rather than elected representatives is, at bottom, a question about what kind of knowledge good spending requires. I would argue that citizens should decide directly on a defined share of the budget, but that handing them the whole of it would be a mistake." },
          { label: "2", text: "The case for direct involvement rests on the fact that residents possess information no official can easily obtain. They know which crossing children avoid and which playground stands empty, and a budget that ignores such knowledge will tend to fund what is visible from the town hall rather than what is needed on the street. Where participatory budgeting has been tried, most famously in the Brazilian city of Porto Alegre from 1989, spending has typically shifted towards basic services in poorer districts. Just as importantly, people who have helped to choose a project are more inclined to accept the taxes that pay for it." },
          { label: "3", text: "This does not mean, however, that every decision is suited to a public vote. Much of what a council funds is invisible and unglamorous: sewer maintenance, pension liabilities, the inspection of bridges. Such items rarely win a show of hands, yet neglecting them is far costlier than neglecting a park. Nor is turnout a trivial problem. If only a small and unrepresentative minority takes part, as is often the case, a process intended to widen democracy may simply hand influence to those with the most free time." },
          { label: "4", text: "For these reasons, the sensible arrangement is a division of labour. Residents should control a ring-fenced portion of discretionary spending, where their local knowledge counts for most, while long-term and technical commitments remain with those who can be held to account at elections. Direct participation is valuable precisely because it is limited." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khác nhau ở đâu? — chấm hai bài theo bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**TR**", "6 ý trong 2 thân bài, mỗi ý 1–2 câu. “reduce corruption”, “trust the government more” chỉ được **nêu**. Ví dụ chung (roads, parks).", "2 ý mỗi thân bài, mỗi ý đi tới cùng. Ví dụ **cụ thể, đúng cấp địa phương** (crossing, playground, Porto Alegre). Thesis nói rõ **mức độ**: “a defined share”.", "bớt ý, đào sâu; trả lời đúng chữ “to what extent”"],
          ["**CC**", "On the one hand / Firstly / For example / Secondly / Moreover / On the other hand / Firstly / Secondly / Furthermore / Therefore / In conclusion / In this way — **12 từ nối đầu câu** trong 16 câu.", "**3** từ nối kiểu đó (however · Just as importantly · For these reasons). Còn lại nối bằng **This / Such items / Nor / They** và bằng trật tự ý.", "liên kết chìm vào câu"],
          ["**LR**", "advantages, disadvantages, problems, complicated topics, big decisions — đúng nhưng **chung**.", "unglamorous, a show of hands, turnout, discretionary spending, ring-fenced, held to account — **đúng từ của lĩnh vực**.", "từ chính xác thay từ chung"],
          ["**GRA**", "16 câu, **14 sạch**. Lỗi: ~~where the money go~~ · ~~knowledges~~. Cấu trúc: chủ yếu because / so / which.", "14 câu, **14 sạch**. Có mệnh đề danh ngữ làm chủ ngữ, quan hệ rút gọn, đảo ngữ sau Nor, câu hai chấm liệt kê.", "phạm vi rộng hơn, không lỗi"],
        ],
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 8",
        items: [
          "**Hedging** (Ngày 1 · mục 5): will tend to · typically · more inclined to · rarely · may simply — năm chỗ, mỗi nhận định một lần. Thesis và câu kết **không** hedge: I would argue · is valuable precisely because.",
          "**Danh hoá để nối**: The case for direct involvement · such knowledge · Such items · a division of labour.",
          "**Collocation chính xác** (Bài 1 · mục 11): possess information · win a show of hands · widen democracy · hand influence to · held to account · counts for most.",
          "**Câu ngắn sau câu dài**: “Nor is turnout a trivial problem.” (6 từ) và “Direct participation is valuable precisely because it is limited.” (9 từ). Câu ngắn đặt đúng chỗ là dấu hiệu kiểm soát.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. TR band 8: “đào sâu” nghĩa là đi đủ bốn mắt xích" },
      {
        t: "p",
        text: "Tập 4 Ngày 4 dạy mở rộng ý theo 3 tầng (ý → giải thích → ví dụ). Band 8 thêm tầng thứ tư: ==giới hạn hoặc hệ quả==. Chính tầng này chữa lỗi “khái quát quá” của band 7, vì nó buộc bạn nói ý của mình đúng tới đâu.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Bốn mắt xích của một ý band 8",
        steps: [
          { label: "① Nhận định", sub: "The case for direct involvement rests on… residents possess information no official can easily obtain." },
          { label: "② Cơ chế — vì sao", sub: "a budget that ignores such knowledge will tend to fund what is visible from the town hall…" },
          { label: "③ Bằng chứng LIÊN QUAN", sub: "Where participatory budgeting has been tried… spending has typically shifted towards basic services…" },
          { label: "④ Giới hạn / hệ quả", sub: "Just as importantly, people who have helped to choose a project are more inclined to accept the taxes…" },
        ],
      },
      {
        t: "table",
        head: ["", "Ví dụ khái quát (band 7)", "Ví dụ liên quan (band 8)"],
        rows: [
          ["Mức cụ thể", "they know which roads are dangerous", "They know which crossing children avoid and which playground stands empty"],
          ["Đúng phạm vi đề", "people trust the government more (cấp nào?)", "accept the taxes that pay for it (đúng chuyện tiền địa phương)"],
          ["Chứng minh được gì", "nhắc lại nhận định bằng lời khác", "cho thấy **hệ quả**: tiền chuyển về dịch vụ cơ bản ở khu nghèo"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với ví dụ có tên riêng và số liệu",
        items: [
          "Chỉ nêu tên riêng khi bạn **chắc**. Porto Alegre + 1989 là dữ kiện thật và nổi tiếng. Nếu không nhớ chắc năm: viết “since the late 1980s” hoặc bỏ năm.",
          "Không bịa số liệu kiểu ~~“a study by Oxford University in 2015 showed 73%”~~. Giám khảo không trừ điểm vì thiếu số; họ nghi ngờ khi số quá tròn trịa.",
          "Ví dụ không có tên riêng vẫn là band 8 nếu **cụ thể**: “a council that must choose between repairing a sewer and building a skate park”.",
        ],
      },
      { t: "rule", formula: "nhận định → vì sao (cơ chế) → bằng chứng đúng phạm vi đề → giới hạn / hệ quả", vi: "Mỗi thân bài 1–2 ý đi đủ bốn mắt xích tốt hơn 3–4 ý chỉ có mắt xích ①." },
      {
        t: "quiz",
        id: "t5d2-viet-mat-xich-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — câu mắt xích ② và ④ (4 câu)",
        grammar: "rests on the fact that… · will tend to… · This does not mean, however, that… · Nor is… a trivial problem",
        items: [
          { q: "Lập luận ủng hộ việc này dựa trên thực tế là người dân biết rõ khu vực của họ.", answers: ["The case for this rests on the fact that residents know their area well.", "The case for this rests on the fact that residents know their own area well.", "The argument for this rests on the fact that residents know their area well."], hint: "The case for · rests on the fact that · residents" },
          { q: "Tuy nhiên, điều này không có nghĩa là mọi quyết định đều phù hợp với một cuộc bỏ phiếu công khai.", answers: ["This does not mean, however, that every decision is suited to a public vote.", "However, this does not mean that every decision is suited to a public vote.", "This does not mean, however, that every decision is suitable for a public vote."], hint: "This does not mean, however, that · be suited to · a public vote" },
          { q: "Những hạng mục như vậy hiếm khi được chọn, nhưng bỏ bê chúng thì tốn kém hơn nhiều.", answers: ["Such items are rarely chosen, yet neglecting them is far costlier.", "Such items are rarely chosen, yet neglecting them is far more costly.", "Such items are rarely chosen, but neglecting them is far more costly."], hint: "Such items · rarely · yet · neglecting them · far costlier" },
          { q: "Tỉ lệ người đi bỏ phiếu cũng không phải là vấn đề nhỏ.", answers: ["Nor is turnout a trivial problem.", "Nor is turnout a minor problem.", "Turnout is not a trivial problem either."], hint: "Nor is · turnout · a trivial problem (đảo ngữ sau Nor)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. CC band 8: liên kết không gây chú ý" },
      {
        t: "p",
        text: "Mô tả band 8 viết: xử lý tốt ==mọi mặt== của liên kết. Mô tả band 9 còn viết: liên kết “không gây chú ý”. Tức là người đọc đi từ câu này sang câu kia mà không vấp phải biển chỉ đường. Tập 4 Ngày 12 dạy bỏ bớt từ nối; hôm nay học thay chúng bằng gì.",
      },
      {
        t: "table",
        head: ["Thay vì", "Dùng", "Trong bài band 8"],
        rows: [
          ["Firstly, …", "câu chủ đề nêu thẳng ý", "The case for direct involvement rests on…"],
          ["For example, …", "ví dụ đi liền, không cần báo trước", "They know which crossing children avoid…"],
          ["Moreover, … / Secondly, …", "**Just as importantly,** · **Nor** + đảo ngữ", "Nor is turnout a trivial problem."],
          ["On the other hand, …", "**This does not mean, however, that…**", "mở thân bài 2 bằng cách giới hạn thân bài 1"],
          ["lặp danh từ", "**such + N · this + N · they / them · those**", "such knowledge · Such items · those who can be held to account"],
          ["In conclusion, I believe…", "**For these reasons,** + lập trường nói lại bằng hình ảnh mới", "the sensible arrangement is a division of labour"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh: bỏ từ nối không có nghĩa là bỏ liên kết",
        items: [
          "Xoá hết Firstly / Moreover mà không thay bằng quy chiếu (this, such, they) → các câu rời nhau, CC tụt xuống 6.",
          "Quy tắc **cũ → mới**: mỗi câu bắt đầu bằng thứ đã nhắc (such knowledge, Such items), kết thúc bằng thông tin mới. Đó là thứ làm bài “trôi”.",
          "Giữ lại 2–3 từ nối ở chỗ **đổi hướng thật** (however, yet, For these reasons). Số 0 cũng gượng như số 12.",
        ],
      },
      { t: "rule", formula: "câu sau mở bằng cái đã nói (This / Such + N, They) + kết bằng cái mới   ·   từ nối đầu câu: 2–3 lần cả bài", vi: "Liên kết band 8 nằm trong câu, không đứng đầu câu." },

      /* ── 7 ── */
      { t: "h", text: "7. LR band 8: sắc thái và văn phong — từ đúng chưa đủ, phải là từ chính xác" },
      {
        t: "table",
        head: ["Ý", "Từ chung (band 7)", "Từ chính xác (band 8)", "Khác nhau"],
        rows: [
          ["nói rằng", "say · think", "**argue** (có lập luận) · **claim** (chưa chắc đúng) · **contend** (kiên quyết) · **concede** (thừa nhận ý đối phương)", "mỗi động từ mang thái độ của người viết"],
          ["điểm xấu", "disadvantage · problem", "**drawback** (điểm trừ của một lựa chọn) · **shortcoming** (chỗ kém của một hệ thống) · **flaw** (lỗi trong lập luận, thiết kế)", "chọn theo thứ bị chê"],
          ["lớn", "big · huge", "**considerable** (đáng kể) · **substantial** (lớn về lượng) · **sweeping** (thay đổi rộng khắp)", "sweeping chỉ đi với reform, change, powers"],
          ["quan trọng", "important", "**crucial** (thiếu là hỏng) · **pivotal** (điểm xoay) · **central to**", ""],
          ["không quan trọng", "not important · small", "**trivial** · **marginal** · **negligible** (nhỏ tới mức bỏ qua được)", "negligible dùng cho số lượng"],
          ["người dân", "people", "**residents** (của một khu) · **citizens** (của một nước) · **the electorate** (cử tri) · **taxpayers** (khi nói tiền)", "chọn theo vai của họ trong câu"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Văn phong: ba kiểu từ làm bài tụt khỏi band 8",
        items: [
          "**Từ nói lẫn vào bài viết**: a lot of, kids, get better, nowadays (đầu bài), stuff, bad → a great deal of, children, improve, in recent years, (nêu tên vật), harmful.",
          "**Từ thuộc lòng không khớp ngữ cảnh**: ~~a double-edged sword~~, ~~every coin has two sides~~, ~~in this day and age~~. Giám khảo nhận ra ngay; chúng không chứng minh được vốn từ.",
          "**Từ hiếm sai sắc thái**: ~~citizens are ignorant about drainage~~ (ignorant = dốt, nghĩa chê) → citizens **are unfamiliar with** / **lack the expertise to judge**.",
        ],
      },
      {
        t: "quiz",
        id: "t5d2-viet-sac-thai",
        kind: "fill",
        title: "Chọn từ chính xác — gõ MỘT từ trong ngoặc (6 câu)",
        items: [
          { q: "Opponents ___ that the scheme will save money, but have produced no figures. (claim / concede)", answers: ["claim"], hint: "claim = nói mà chưa chứng minh. concede = thừa nhận ý của phía kia." },
          { q: "I ___ that turnout is a weakness; it is not, however, a reason to abandon the idea. (concede / contend)", answers: ["concede"], hint: "Thừa nhận rồi bác → concede (động tác “Granted… but…” của Tập 4 Ngày 2)." },
          { q: "The main ___ of online voting is that it excludes people without internet access. (drawback / flaw)", answers: ["drawback"], hint: "Điểm trừ của một lựa chọn → drawback. flaw = lỗi trong thiết kế / lập luận." },
          { q: "The new government announced ___ reforms to local taxation. (sweeping / negligible)", answers: ["sweeping"], hint: "sweeping reforms = cải cách rộng khắp." },
          { q: "The difference in cost between the two options is ___ : less than one per cent. (negligible / pivotal)", answers: ["negligible"], hint: "Nhỏ tới mức bỏ qua được." },
          { q: "Most ___ are unfamiliar with how a council budget is drawn up. (residents / ignorants)", answers: ["residents"], hint: "ignorant là tính từ và mang nghĩa chê; không có danh từ ~~ignorants~~." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. GRA: tìm hai lỗi của bài band 7 và đếm câu sạch" },
      {
        t: "quiz",
        id: "t5d2-viet-tim-loi",
        kind: "fill",
        title: "Sửa hai lỗi trong bài band 7 + ba câu đếm (5 câu)",
        items: [
          { q: "Đoạn 2: “everybody can see where the money go.” → where the money ___", answers: ["goes"], hint: "money (không đếm được, số ít) → goes. Lỗi hoà hợp chủ – vị: Ngày 3 sẽ truy kỹ." },
          { q: "Đoạn 3: “do not have enough knowledges about” → enough ___ about / of", answers: ["knowledge"], hint: "knowledge không đếm được." },
          { q: "Bài band 7 có 16 câu, 2 câu có lỗi. Số câu sạch là ___ .", answers: ["14"], hint: "16 − 2 = 14 → 14/16 ≈ 88 %: “thường xuyên không lỗi”, nhưng hai lỗi đều là lỗi cơ bản." },
          { q: "Bài band 8 có bao nhiêu từ nối kiểu however / Just as importantly / For these reasons? (viết số)", answers: ["3", "three"], hint: "Just as importantly (đoạn 2) · however (đoạn 3, chen giữa câu) · For these reasons (đoạn 4). Bài band 7 có 12." },
          { q: "Trong bài band 8, câu “Nor is turnout a trivial problem.” dùng cấu trúc gì? (một từ tiếng Anh: i________)", answers: ["inversion"], hint: "Đảo ngữ sau Nor — Tập 4 Ngày 7. Dùng đúng một lần." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Tự chấm bài của bạn — 12 câu hỏi có / không" },
      {
        t: "p",
        text: "Tập 3 Ngày 2 và Tập 4 Ngày 2 đã cho bạn bảng tự chấm band 6 và band 7. Đây là bản band 8. Trả lời **có / không** cho từng câu, thật nghiêm. Mỗi tiêu chí 3 câu.",
      },
      {
        t: "table",
        head: ["#", "Tiêu chí", "Câu hỏi"],
        rows: [
          ["1", "TR", "Thesis có trả lời đúng **mọi vế** của đề, kể cả “to what extent / rather than”?"],
          ["2", "TR", "Mỗi thân bài có **tối đa hai ý**, mỗi ý đi đủ bốn mắt xích?"],
          ["3", "TR", "Mọi ví dụ đều **cụ thể và đúng phạm vi** đề (không ví dụ kiểu “for example, in my country…” chung chung)?"],
          ["4", "CC", "Từ nối đứng đầu câu **≤ 3** trong cả bài?"],
          ["5", "CC", "Mỗi câu (trừ câu đầu đoạn) có **một từ chỉ lại** câu trước (this, such, they, the former…)?"],
          ["6", "CC", "Câu cuối mỗi thân bài **chốt** được ý của đoạn chứ không mở ý mới?"],
          ["7", "LR", "Có **≥ 6 collocation chính xác** của lĩnh vực (không tính các cụm thuộc lòng)?"],
          ["8", "LR", "Không có từ nói (a lot of, kids, get), không có thành ngữ thuộc lòng?"],
          ["9", "LR", "Không lặp một danh từ chính quá **3 lần** (đã thay bằng từ gần nghĩa đúng sắc thái)?"],
          ["10", "GRA", "Tỉ lệ câu sạch **≥ 90 %** và không có lỗi thì, hoà hợp chủ – vị, danh từ không đếm được?"],
          ["11", "GRA", "Có **≥ 4 loại** câu phức khác nhau, mỗi cấu trúc hiếm dùng tối đa một lần?"],
          ["12", "GRA", "Mỗi nhận định **một hedge**, thesis và kết bài **không** hedge?"],
        ],
      },
      {
        t: "table",
        head: ["Số câu “có”", "Ước lượng", "Việc làm tiếp"],
        rows: [
          ["11–12", "khoảng band 8", "giữ; viết bài tiếp theo trong đúng 40 phút"],
          ["8–10", "khoảng band 7–7.5", "viết lại đúng những đoạn dính câu “không”"],
          ["≤ 7", "khoảng band 6.5–7", "ôn Tập 4 Ngày 2 · 4 · 12 trước khi viết lại"],
        ],
        caption: "Ước lượng của khoá để tự theo dõi — điểm thật do giám khảo (và AI chấm) quyết định",
      },
      {
        t: "note",
        title: "💡 Cách học: viết lại theo ba bản (nối Tập 3 Ngày 2 · Tập 4 Ngày 2)",
        items: [
          "**Bản 1** — bài gốc. Chạy 12 câu hỏi, ghi các số “không”.",
          "**Bản 2** — sửa **TR và CC** trước: bớt ý, thêm mắt xích ④, đổi từ nối đầu câu thành quy chiếu. Chưa đụng tới từ vựng.",
          "**Bản 3** — sửa **LR và GRA**: thay 5–6 từ chung bằng collocation chính xác, soát thì, đếm câu sạch.",
          "Ghi vào **Sổ lỗi** mỗi lỗi lặp lại từ bài trước. Lỗi nào xuất hiện ở hai bài liền nhau = lỗi dai dẳng → Ngày 3 xử lý.",
        ],
      },
      {
        t: "mcq",
        id: "t5d2-viet-nhan-dien",
        title: "Nhận diện — band 7 hay band 8? (6 câu)",
        items: [
          { q: "Câu nào là thesis trả lời đúng “To what extent…”?", options: ["I partly agree with this view.", "I would argue that citizens should decide directly on a defined share of the budget, but not on the whole of it.", "There are advantages and disadvantages.", "This essay will discuss both sides."], correct: 1, why: "Nói rõ mức độ (a defined share) và giới hạn (not the whole). “I partly agree” chưa nói phần nào." },
          { q: "Câu nào là mắt xích ④ (giới hạn / hệ quả)?", options: ["Local people understand their neighbourhood.", "For example, they know which roads are dangerous.", "Such items rarely win a show of hands, yet neglecting them is far costlier than neglecting a park.", "Secondly, not everybody has time to vote."], correct: 2, why: "Nêu hệ quả của việc để dân bỏ phiếu cho các hạng mục vô hình. A là nhận định, B là ví dụ chung, D là một ý mới." },
          { q: "Chọn cách mở thân bài 2 có liên kết chìm:", options: ["On the other hand, there are also some disadvantages.", "Secondly, there are problems.", "This does not mean, however, that every decision is suited to a public vote.", "However, on the other hand, moreover there are drawbacks."], correct: 2, why: "This chỉ lại cả thân bài 1 rồi giới hạn nó — vừa nối vừa đẩy lập luận." },
          { q: "Từ nào chính xác nhất? “Much of what a council funds is invisible and ___ : sewer maintenance, the inspection of bridges.”", options: ["bad", "unglamorous", "ugly", "unimportant"], correct: 1, why: "unglamorous = không hào nhoáng, không hấp dẫn cử tri — đúng ý. unimportant thì sai nghĩa: chúng rất quan trọng." },
          { q: "Câu nào mắc lỗi “khái quát quá” của band 7?", options: ["Turnout in such votes is often low.", "Ordinary people usually think about the short term.", "A small and unrepresentative minority may take part.", "Spending has typically shifted towards basic services."], correct: 1, why: "Quy cho cả “ordinary people” một tính cách mà không có lý do hay giới hạn. Ba câu kia đều có phạm vi (often, may, typically)." },
          { q: "Câu kết nào là band 8?", options: ["In conclusion, both sides have good points.", "In conclusion, I believe citizens should have a voice but not replace experts completely.", "Direct participation is valuable precisely because it is limited.", "To sum up, it depends on the situation."], correct: 2, why: "Chín từ, nói lại lập trường bằng một ý mới và sắc. B đúng nhưng chỉ lặp lại mở bài." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài và viết lại — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "note",
        title: "💡 Cách làm: viết trước, so sau",
        items: [
          "Bài 1: viết cùng đề với bài mẫu, **không nhìn lại** bài mẫu. Dàn ý 5 phút: thesis có mức độ → 2 thân bài, mỗi thân bài 2 ý × 4 mắt xích.",
          "Viết xong: chạy 12 câu hỏi của mục 9, ghi số “có” lên đầu bài rồi mới bấm chấm. So điểm AI với điểm tự chấm — lệch quá 0.5 band thì xem lại tiêu chí bạn chấm lệch.",
          "Bài 2: viết lại bài Task 2 của Đề 8 theo ba bản.",
        ],
      },
      {
        t: "essay",
        id: "t5d2-viet-bai",
        task: "Task 2",
        prompt: "Some people think that ordinary citizens, rather than elected politicians and officials, should decide how public money is spent in their local area. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Thesis nói rõ MỨC ĐỘ: toàn bộ ngân sách, một phần được khoanh riêng, hay không phần nào.",
          "Mỗi thân bài tối đa hai ý; mỗi ý: nhận định → cơ chế → ví dụ đúng cấp địa phương → giới hạn / hệ quả.",
          "Từ nối đầu câu ≤ 3. Nối bằng This / Such + danh từ, they, those who…",
          "Dùng ≥ 6 từ / collocation của Bài 1: mandate, held to account, ring-fenced, oversight, short-termism, scrutiny, turnout…",
          "Câu kết: nói lại lập trường bằng một ý mới, không lặp mở bài.",
        ],
      },
      {
        t: "essay",
        id: "t5d2-viet-lai",
        task: "Task 2",
        prompt: "REWRITE (Task 2). On the FIRST line, copy the question of the Task 2 essay you wrote for Test 8 (Online Test) or for Volume 4, Day 30. Then write your improved version (at least 250 words), aiming at band 8: at most two ideas per body paragraph, each developed through claim, mechanism, relevant evidence and limit or consequence; no more than three sentence-initial linking words; precise collocations; one hedge per claim and none in your thesis. — If you have no old essay, answer this question instead: “Some people believe that governments should fund only those arts that are popular with the general public. To what extent do you agree or disagree?”",
        minWords: 250,
        tips: [
          "Bản 2 sửa TR + CC trước; bản 3 mới sửa LR + GRA.",
          "Đếm: số câu ___ · số câu sạch ___ · số từ nối đầu câu ___ · số collocation chính xác ___ .",
          "Ghi lỗi lặp lại vào Sổ lỗi.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d2-noi",
    kind: "speaking",
    title: "Nói: Band 8 Speaking — ngắt vì nội dung, không vì ngôn ngữ (Part 1 · 2 · 3 band 7 và band 8 cạnh nhau) + tone units ở câu dài",
    goal: "Nghe ra và tự sửa được loại ngập ngừng giữ bài nói ở band 7 (dừng giữa cụm để tìm từ, “how to say”, lặp từ), thay bằng sáu kỹ thuật của band 8 (ngắt ở ranh giới ý, câu mua thời gian có nội dung, nói vòng tức thì, tự sửa một lần…); nói được một bài Part 2 hai phút và ba câu Part 3 mà mọi chỗ dừng đều rơi vào ranh giới tone unit; dùng khéo 6–8 từ Nghệ thuật vòng 2.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "Mô tả Fluency band 7: nói dài không gắng sức, nhưng ==đôi lúc ngập ngừng vì ngôn ngữ==. Band 8: ngập ngừng ==thường là vì nội dung==, hiếm khi vì tìm từ.",
          "Giám khảo không đếm số lần dừng. Họ nghe **dừng ở đâu** và **vì cái gì**. Dừng giữa hai ý để nghĩ = tự nhiên. Dừng giữa cụm từ để tìm chữ = lỗi fluency.",
          "Sáu kỹ thuật hôm nay biến chỗ dừng xấu thành chỗ dừng tốt — không cần thêm từ vựng nào.",
          "Mỗi Part có mẫu **band 7 và band 8 cho cùng một câu hỏi**. Chủ đề: nghệ thuật nơi công cộng — dùng từ của Bài 1 mục 10.",
          "🔊 **Tone unit** (cụm ngữ điệu, nhập ở Tập 4 Ngày 9): ở band 8, mọi chỗ ngắt phải rơi vào ranh giới tone unit.",
          "Thẻ Part 2 hôm nay: một tác phẩm nghệ thuật nơi công cộng. (Thẻ “a time you persuaded someone to look at a decision differently” để dành cho Đề 9.)",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bốn tiêu chí Speaking — band 7 và band 8 khác nhau ở chữ nào" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["**FC** — trôi chảy, mạch lạc", "nói dài không gắng sức; **đôi lúc ngập ngừng vì ngôn ngữ**, lặp, tự sửa; từ nối khá linh hoạt", "trôi chảy, chỉ **thỉnh thoảng** lặp / tự sửa; ngập ngừng **thường vì nội dung**; phát triển ý mạch lạc, đúng trọng tâm"],
          ["**LR** — từ vựng", "linh hoạt nhiều chủ đề; có từ ít gặp và thành ngữ, **có chỗ dùng chưa hợp**; paraphrase hiệu quả", "vốn rộng, dùng **sẵn và linh hoạt** để nói chính xác; từ ít gặp, thành ngữ dùng **khéo**, sai rất ít"],
          ["**GRA** — ngữ pháp", "nhiều cấu trúc phức; **thường** không lỗi; còn vài lỗi dai dẳng", "phạm vi rộng, linh hoạt; **đa số** câu không lỗi; sai vặt rất hiếm"],
          ["**P** — phát âm", "có mọi nét của band 6 và **một số** nét của band 8", "dùng nhiều đặc trưng phát âm, duy trì linh hoạt; dễ hiểu suốt bài; ==giọng mẹ đẻ ảnh hưởng rất ít=="],
        ],
        caption: "Diễn đạt lại từ bảng mô tả band công khai của IELTS Speaking",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Hai loại ngập ngừng — nghe ra sự khác nhau" },
      {
        t: "table",
        head: ["", "Ngập ngừng vì NGÔN NGỮ (band 7)", "Ngập ngừng vì NỘI DUNG (band 8)"],
        rows: [
          ["Dừng ở đâu", "**giữa** một cụm: the… the… um… ceramic… wall", "**giữa hai ý**, ở đầu câu trả lời hoặc trước khi đổi hướng"],
          ["Nghe như", "đang lục tìm một từ hoặc dựng lại ngữ pháp", "đang nhớ lại, cân nhắc, chọn ví dụ"],
          ["Lấp bằng", "um · er · how to say · you know · lặp từ", "một câu **có nghĩa**: That's a harder question than it sounds."],
          ["Sau chỗ dừng", "câu thường đơn giản đi hoặc bị bỏ dở", "câu đầy đủ, đúng trọng tâm"],
          ["Ví dụ", "It makes people's… spiritual… um… life better.", "When did I first notice it? … I think it was in my first year."],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một chỗ bí — hai cách xử lý",
        cols: [
          { title: "Band 7", items: ["There are some… some modern pictures which I don't know **how to call**, like shapes and lines.", "→ dừng giữa cụm · lặp some · lỗi “how to call”"] },
          { title: "Band 8", items: ["…and then you'll suddenly come across a section that's **completely abstract** — just shapes and lines, really.", "→ không biết từ thì tả luôn; không báo cho giám khảo biết mình bí"] },
        ],
      },
      { t: "rule", formula: "ngắt ở ranh giới ý ✓      ngắt giữa cụm từ ✗      lấp chỗ ngắt bằng câu có nghĩa, không bằng um / how to say", vi: "Fluency band 8 không phải nói nhanh — là dừng đúng chỗ." },

      /* ── 3 ── */
      { t: "h", text: "3. Sáu kỹ thuật để không còn ngắt vì ngôn ngữ" },
      {
        t: "table",
        head: ["#", "Kỹ thuật", "Câu dùng được ngay"],
        rows: [
          ["1", "**Ngắt ở ranh giới ý** — nói trọn cụm rồi mới dừng", "It's essentially a wall | a flood barrier really | that's been covered in ceramic."],
          ["2", "**Mua thời gian bằng câu có nghĩa**", "That's a harder question than it sounds. · I've never really thought about it, but off the top of my head…"],
          ["3", "**Nói vòng tức thì** khi quên từ (nối Tập 3 Ngày 11)", "the wall that stops the river flooding — the dyke, I think it's called"],
          ["4", "**Tự sửa một lần, gọn** — không xin lỗi", "It was built — well, finished — in 2010."],
          ["5", "**Bỏ câu đang hỏng, mở lại bằng khung an toàn**", "What I mean is… · Put it this way: … · Let me put that differently."],
          ["6", "**Kết câu dứt khoát** — hạ giọng, dừng", "…and I think that's about as accessible as art can get. ↘ (không thêm “yeah, that's all”)"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "That's + a / an + adj + question (than it sounds), because + S + V",
            vi: "Câu mua thời gian có nội dung: vừa cho bạn 3 giây, vừa mở ra một ý.",
            examples: [
              { en: "That's a harder question than it sounds, because I must have walked past it hundreds of times.", vi: "Câu này khó hơn tôi tưởng, vì chắc tôi đã đi ngang nó cả trăm lần." },
              { en: "That's an interesting one. I suppose it depends who's paying.", vi: "Câu hỏi thú vị đấy. Tôi nghĩ còn tuỳ ai trả tiền." },
            ],
          },
          {
            formula: "It's not that + S + V; it's (more) that + S + V",
            vi: "Bác một cách hiểu rồi đưa cách hiểu đúng — nghe rất tự nhiên, lại cho thêm thời gian nghĩ.",
            examples: [
              { en: "It's not that I'm not interested; it's more that galleries make me feel I have to whisper.", vi: "Không phải tôi không hứng thú; đúng hơn là phòng tranh làm tôi thấy phải nói thầm." },
            ],
          },
          {
            formula: "the + N + that / where + S + V  —  (the + từ đúng), I think it's called",
            vi: "Nói vòng: tả bằng mệnh đề quan hệ, rồi nếu nhớ ra thì thêm từ đúng.",
            examples: [
              { en: "the person who chooses what goes into an exhibition — the curator, I think it's called", vi: "người chọn thứ gì được đưa vào triển lãm — giám tuyển, tôi nghĩ gọi vậy" },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — sáu thói quen nghe ra ngay là band 7",
        items: [
          "~~How to say…~~ / ~~How can I say…~~ lặp nhiều lần → **How shall I put it?** / **What's the word…** — và mỗi bài nói chỉ một lần.",
          "~~I don't know how to call it.~~ → I don't know **what it's called** / **what you'd call it**.",
          "Lấp bằng **ừm, à, thì** của tiếng Việt. Tiếng Anh lấp bằng **well, I mean, you know** — ít thôi.",
          "Kết mọi câu bằng ~~yeah~~ / ~~that's all~~ / ~~and so on~~. Hạ giọng và dừng là đủ.",
          "Xin lỗi khi tự sửa: ~~sorry, I mean…~~ Người bản ngữ chỉ nói **— well, …** hoặc **— or rather, …** rồi đi tiếp.",
          "Nói nhanh để “nghe trôi chảy”. Nói nhanh làm tăng số lần vấp. Tốc độ vừa + ngắt đúng chỗ nghe trôi chảy hơn.",
        ],
      },
      {
        t: "quiz",
        id: "t5d2-noi-ky-thuat-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu xử lý chỗ bí (5 câu)",
        grammar: "That's a harder question than it sounds · I don't know what it's called · What I mean is… · It's not that…; it's more that… · How shall I put it?",
        items: [
          { q: "Câu hỏi này khó hơn tôi tưởng.", answers: ["That's a harder question than it sounds.", "That's a more difficult question than it sounds.", "That's a harder question than I thought."], hint: "That's a harder question than it sounds" },
          { q: "Tôi không biết nó gọi là gì.", answers: ["I don't know what it's called.", "I don't know what it is called.", "I'm not sure what it's called."], hint: "what it's called (không dùng how to call)" },
          { q: "Ý tôi là nó không cần phải ở trong bảo tàng.", answers: ["What I mean is, it doesn't have to be in a museum.", "What I mean is that it doesn't have to be in a museum.", "What I mean is it doesn't have to be in a museum.", "What I mean is, it doesn't need to be in a museum."], hint: "What I mean is · doesn't have to be · in a museum" },
          { q: "Không phải tôi không thích nghệ thuật; đúng hơn là tôi không có thời gian.", answers: ["It's not that I don't like art; it's more that I don't have time.", "It's not that I don't like art; it's more that I don't have the time.", "It's not that I don't like art, it's more that I don't have time.", "It's not that I dislike art; it's more that I don't have time."], hint: "It's not that…; it's more that…" },
          { q: "Nói thế nào nhỉ — nó hơi nhạt.", answers: ["How shall I put it? It's a bit bland.", "How shall I put it — it's a bit bland.", "How shall I put it? It's a little bland.", "How shall I put it, it's a bit bland."], hint: "How shall I put it? · a bit bland" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Part 1 — cùng hai câu hỏi, band 7 và band 8" },
      {
        t: "dialogue",
        title: "Part 1 · Art — band 7 rồi band 8",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you ever go to art galleries or museums?", vi: "Bạn có bao giờ đi phòng tranh hay bảo tàng không?" },
          { who: "Candidate (band 7)", role: "a", text: "Not very often, to be honest. I went to the fine arts museum about two years ago with my class, and it was quite interesting, but I don't really have… how can I say… the habit to go there. I think I prefer to see art on the internet because it's more convenient.", vi: "Thật lòng thì không thường xuyên. Khoảng hai năm trước tôi đi bảo tàng mỹ thuật với lớp, khá thú vị, nhưng tôi không thật sự có… nói thế nào nhỉ… thói quen đi tới đó. Tôi nghĩ tôi thích xem tranh trên mạng hơn vì tiện hơn." },
          { who: "Candidate (band 8)", role: "candidate", text: "Hardly ever, if I'm honest. Maybe once in a blue moon, when a friend drags me along. It's not that I'm not interested; it's more that galleries feel a bit like libraries, where you're afraid to breathe too loudly. I'm far more likely to stop and look at something painted on a wall on my way to class.", vi: "Thật lòng là hầu như không. Hoạ hoằn lắm, khi có bạn kéo đi. Không phải tôi không hứng thú; đúng hơn là phòng tranh hơi giống thư viện, nơi ta sợ thở mạnh. Tôi dễ dừng lại ngắm một thứ gì vẽ trên tường trên đường đi học hơn nhiều." },
          { who: "Examiner", role: "examiner", text: "Did you enjoy art lessons at school?", vi: "Hồi đi học bạn có thích giờ mỹ thuật không?" },
          { who: "Candidate (band 7)", role: "a", text: "Yes, I enjoyed them, although I wasn't good at drawing. Our teacher was very kind and she let us draw anything we want. It was relaxing compared with maths.", vi: "Có, tôi thích, dù tôi vẽ không giỏi. Cô giáo rất hiền và cho chúng tôi vẽ bất cứ gì mình muốn. So với toán thì thư giãn." },
          { who: "Candidate (band 8)", role: "candidate", text: "I did, actually, though I was hopeless at it. I think what I enjoyed was that it was the one lesson where there wasn't a right answer. Nobody could mark your drawing of a buffalo out of ten, or at least they shouldn't. Looking back, it was probably the only hour of the week when I wasn't being tested.", vi: "Thật ra là có, dù tôi vẽ dở tệ. Tôi nghĩ điều tôi thích là đó là tiết duy nhất không có đáp án đúng. Không ai chấm bức vẽ con trâu của bạn trên thang mười được, hay ít nhất là không nên. Nhìn lại, có lẽ đó là giờ duy nhất trong tuần tôi không bị kiểm tra." },
        ],
      },
      {
        t: "table",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Chỗ dừng", "giữa cụm: “don't really have… how can I say… the habit to go”", "không có chỗ dừng giữa cụm"],
          ["Lỗi nhỏ", "~~the habit to go~~ (→ the habit of going) · ~~anything we want~~ (→ wanted)", "không"],
          ["Từ ít gặp", "quite interesting · convenient · relaxing", "once in a blue moon · drags me along · hopeless at it · mark… out of ten"],
          ["Ý", "kể việc + một lý do chung", "một quan sát riêng (phòng tranh như thư viện; tiết học không có đáp án đúng)"],
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Part 2 — một tác phẩm nghệ thuật nơi công cộng: band 7 và band 8" },
      {
        t: "table",
        head: ["Thẻ đề (cue card)"],
        rows: [
          ["**Describe a piece of art in a public place (for example a statue, a mural or a sculpture) that you have noticed.** You should say: where it is · what it looks like · when you first noticed it · and explain what you think of it."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ từ khoá",
        center: "ceramic road · Red River",
        branches: [
          { label: "where", items: ["dyke wall", "best part of 4 km"] },
          { label: "looks like", items: ["tiny tiles", "dragons, lotus", "abstract bits", "kids' designs"] },
          { label: "first noticed", items: ["dad's motorbike", "1st year — traffic jam", "cut by hand"] },
          { label: "what I think", items: ["no masterpiece", "seen better days", "soft spot", "no ticket → accessible"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 1 phút 30 giây",
        lines: [
          { who: "Candidate", role: "a", text: "I want to talk about a… a ceramic wall in Hanoi. It is along the road near the Red River and it is very long, about four kilometres. People made it for the one thousand years anniversary of Hanoi in 2010. The wall is covered by small pieces of ceramic with many colours.", vi: "Tôi muốn nói về một… một bức tường gốm ở Hà Nội. Nó nằm dọc con đường gần sông Hồng và rất dài, khoảng bốn cây số. Người ta làm nó cho dịp kỷ niệm một nghìn năm Hà Nội năm 2010. Bức tường được phủ bằng những mảnh gốm nhỏ nhiều màu." },
          { who: "Candidate", role: "a", text: "There are many pictures on it, for example dragons, flowers, and also some… some modern pictures which I don't know how to call, like shapes and lines. I first noticed it when I was a child, because my father often drove me on that road, but I didn't pay attention. Later, when I was a university student, one day there was a traffic jam and I looked at it carefully.", vi: "Trên đó có nhiều hình, ví dụ rồng, hoa, và cả vài… vài hình hiện đại mà tôi không biết gọi là gì, kiểu hình khối và đường nét. Tôi để ý nó lần đầu khi còn nhỏ, vì bố tôi hay chở tôi trên đường đó, nhưng tôi không chú ý. Sau này, khi là sinh viên, có hôm tắc đường và tôi nhìn kỹ nó." },
          { who: "Candidate", role: "a", text: "I think it is very beautiful and meaningful, because it shows the culture and history of Vietnam. However, some parts are old now and the colour is not bright like before. I think the government should repair it. In general, I like it because everyone can see it for free, they don't need to go to the museum. So… yeah, I think it is a good example of public art.", vi: "Tôi nghĩ nó rất đẹp và ý nghĩa, vì nó thể hiện văn hoá và lịch sử Việt Nam. Tuy nhiên vài chỗ giờ đã cũ và màu không còn tươi như trước. Tôi nghĩ chính quyền nên sửa nó. Nói chung tôi thích nó vì ai cũng xem được miễn phí, không cần tới bảo tàng. Thế nên… vâng, tôi nghĩ nó là một ví dụ tốt về nghệ thuật công cộng." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 8 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about the ceramic mosaic that runs along the dyke road by the Red River in Hanoi. Locals just call it the ceramic road. It's essentially a wall, a flood barrier really, that's been covered from end to end in tiny pieces of coloured ceramic, and it goes on for the best part of four kilometres, so it's less a single artwork than a whole string of them.", vi: "Tôi muốn nói về bức tranh gốm ghép chạy dọc đường đê ven sông Hồng ở Hà Nội. Dân ở đây chỉ gọi là con đường gốm sứ. Về bản chất nó là một bức tường, thật ra là tường chắn lũ, được phủ kín từ đầu tới cuối bằng những mảnh gốm màu li ti, và nó kéo dài gần bốn cây số, nên nó giống cả một chuỗi tác phẩm hơn là một tác phẩm." },
          { who: "Candidate", role: "candidate", text: "As for what it shows, it's a real mixture. Some stretches are quite traditional: dragons, lotus flowers, patterns you'd recognise from old pottery. And then you'll suddenly come across a section that's completely abstract, or one that was obviously designed by children. That's actually what I like about it. It doesn't try to be consistent.", vi: "Còn nó vẽ gì thì đủ cả. Có đoạn khá truyền thống: rồng, hoa sen, hoa văn bạn sẽ nhận ra từ đồ gốm cổ. Rồi bạn bỗng gặp một đoạn hoàn toàn trừu tượng, hoặc một đoạn rõ ràng do trẻ con thiết kế. Thật ra đó là điều tôi thích ở nó. Nó không cố nhất quán." },
          { who: "Candidate", role: "candidate", text: "When did I first notice it? That's a harder question than it sounds, because I must have ridden past it hundreds of times on the back of my dad's motorbike without ever really looking. I think the first time I properly took it in was in my first year at university, when I got stuck in traffic right next to it for about twenty minutes. With nothing else to do, I started studying the section beside me, and realised each tile had been cut by hand.", vi: "Tôi để ý nó lần đầu khi nào? Câu này khó hơn tưởng, vì chắc tôi đã ngồi sau xe máy của bố đi ngang nó cả trăm lần mà chưa bao giờ thật sự nhìn. Tôi nghĩ lần đầu tôi thật sự ngắm nó là năm nhất đại học, khi tôi kẹt xe ngay cạnh nó khoảng hai mươi phút. Không có gì khác để làm, tôi bắt đầu xem kỹ đoạn bên cạnh và nhận ra từng viên gốm được cắt bằng tay." },
          { who: "Candidate", role: "candidate", text: "What do I make of it? Well, I wouldn't call it a masterpiece, and some parts have seen better days. The colours have faded and the odd tile's missing. But I've got a soft spot for it, precisely because it isn't in a gallery. Nobody has to buy a ticket, or feel they ought to understand it. It's just there, on the way to work, and I think that's about as accessible as art can get.", vi: "Tôi nghĩ gì về nó? Tôi sẽ không gọi nó là kiệt tác, và vài đoạn đã xuống cấp. Màu đã phai và thỉnh thoảng thiếu một viên. Nhưng tôi có cảm tình đặc biệt với nó, chính vì nó không nằm trong phòng tranh. Không ai phải mua vé, hay thấy mình buộc phải hiểu nó. Nó cứ ở đó, trên đường đi làm, và tôi nghĩ nghệ thuật dễ tiếp cận tới vậy là cùng." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Chỗ tạo khác biệt"],
        rows: [
          ["**FC**", "dừng giữa cụm 2 lần (a… a ceramic wall · some… some modern pictures); kết bằng “So… yeah”", "hai chỗ dừng đều là **câu hỏi tự đặt** (When did I first notice it? · What do I make of it?) — ngập ngừng vì nội dung", "kỹ thuật 1 · 2 · 6"],
          ["**LR**", "beautiful and meaningful · old · not bright — đúng nhưng chung; ~~how to call~~", "the best part of · a whole string of · took it in · have seen better days · a soft spot for · abstract · accessible", "thành ngữ Tập 4 Ngày 10 + từ Bài 1 mục 10, dùng đúng chỗ"],
          ["**GRA**", "câu đơn + because / when; lỗi: ~~covered by~~ · ~~one thousand years anniversary~~ · ~~not bright like before~~", "must have ridden · without ever looking · had been cut · less A than B · as … as art can get — không lỗi", "phạm vi + độ sạch"],
          ["**P**", "ngắt theo từng câu ngắn, giọng đều", "câu dài chia cụm rõ; nhấn từ đối lập (isn't in a GALLery)", "tone units — mục 7"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: câu hỏi tự đặt — công cụ fluency mạnh nhất của Part 2",
        items: [
          "Nhắc lại gạch đầu dòng của thẻ thành câu hỏi (**When did I first notice it?**) cho bạn 2 giây nghĩ, báo cho giám khảo biết bạn đang ở ý nào, và nghe hoàn toàn tự nhiên.",
          "Dùng tối đa **hai lần** trong một bài Part 2. Lần nào cũng theo sau bằng một câu có nội dung thật.",
          "Câu chuyện con đường gốm dùng lại được cho các thẻ: a place you often pass · something in your city you are proud of · a time you were stuck in traffic · something made by hand.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Part 3 — nghệ thuật, tiền công và ai là người chọn" },
      {
        t: "table",
        head: ["Câu hỏi", "Kiểu", "Khung band 8"],
        rows: [
          ["Should public money be spent on art in public places?", "nên / không", "đồng ý nhưng **không vì lý do quen thuộc** → lý do thật → điều kiện"],
          ["Who should decide which artworks are displayed in a city?", "ai / thế nào", "hai phương án → điểm yếu của mỗi bên → cách kết hợp"],
          ["Why do some people dislike modern art?", "vì sao", "It's not that…; it's more that… → ví dụ → một lời bênh"],
          ["Will people still visit galleries in fifty years?", "dự đoán", "hedge đúng liều (Ngày 1): probably… but in a different way"],
        ],
      },
      {
        t: "dialogue",
        title: "Cùng một câu hỏi — band 7 rồi band 8",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should public money be spent on art in public places?", vi: "Có nên chi tiền công cho nghệ thuật ở nơi công cộng không?" },
          { who: "Candidate (band 7)", role: "a", text: "I think yes, to some extent. Public art makes the city more beautiful and it can attract tourists, so it is good for the economy. Also it is good for people's… spiritual life. But on the other hand, the government has many other things to spend, like hospitals and schools, which are more important. So I think they should spend a small amount for art, not too much.", vi: "Tôi nghĩ là có, ở mức nào đó. Nghệ thuật công cộng làm thành phố đẹp hơn và có thể thu hút khách du lịch, nên tốt cho kinh tế. Nó cũng tốt cho… đời sống tinh thần của người dân. Nhưng mặt khác, chính phủ còn nhiều thứ khác phải chi, như bệnh viện và trường học, quan trọng hơn. Nên tôi nghĩ họ nên chi một khoản nhỏ cho nghệ thuật, đừng quá nhiều." },
          { who: "Candidate (band 8)", role: "candidate", text: "I think so, yes, though probably not for the reason people usually give. The standard argument is that it brings in tourists, and I'm not convinced that's true of most of it. Nobody flies to a city for a statue outside a bank. Where I think it does earn its keep is in the places people pass through every day: an underpass, a hospital corridor, that kind of thing.", vi: "Tôi nghĩ là nên, dù có lẽ không vì lý do người ta hay đưa ra. Lập luận quen thuộc là nó kéo khách du lịch tới, và tôi không tin điều đó đúng với phần lớn tác phẩm. Chẳng ai bay tới một thành phố vì bức tượng trước cửa ngân hàng. Chỗ tôi nghĩ nó thật sự đáng đồng tiền là những nơi người ta đi qua hằng ngày: một đường hầm đi bộ, một hành lang bệnh viện, đại loại thế." },
          { who: "Candidate (band 8)", role: "candidate", text: "If a mural makes an underpass feel safer, then it's doing a job, not just decorating. The tricky part is who gets to choose. If it's left entirely to officials, you tend to end up with something very safe and very bland, so I'd want local residents to have a real say. Which, admittedly, is easier said than done.", vi: "Nếu một bức tranh tường khiến đường hầm có cảm giác an toàn hơn, thì nó đang làm một việc có ích chứ không chỉ trang trí. Cái khó là ai được chọn. Nếu giao hết cho công chức, ta thường nhận về thứ gì đó rất an toàn và rất nhạt, nên tôi muốn người dân địa phương có tiếng nói thật sự. Điều mà, phải thừa nhận, nói thì dễ hơn làm." },
        ],
      },
      {
        t: "note",
        title: "📌 Câu band 8 làm được gì",
        items: [
          "**Bác lý do quen thuộc trước** (not for the reason people usually give) → cho thấy bạn đang nghĩ, không đọc thuộc. Đây là “phát triển ý đúng trọng tâm” trong mô tả band 8.",
          "**Ví dụ cụ thể tới mức thấy được**: a statue outside a bank · an underpass · a hospital corridor.",
          "**Hedging đúng liều** (Ngày 1): probably · I'm not convinced · you tend to end up with · admittedly.",
          "**Thành ngữ dùng khéo**: earn its keep · have a real say · easier said than done — mỗi cái một lần, đúng nghĩa.",
          "Chỗ band 7 dừng (“people's… spiritual life”) là dừng để tìm từ. ~~spiritual life~~ cũng là cách dịch thẳng “đời sống tinh thần”; tiếng Anh tự nhiên: **people's well-being** / **quality of life**.",
        ],
      },
      { t: "rule", formula: "Yes / No + though not for the usual reason → bác lý do quen → lý do thật + ví dụ thấy được → The tricky part is…", vi: "Khung Part 3 band 8: có lập trường, có điều bất ngờ, có giới hạn." },
      {
        t: "mcq",
        id: "t5d2-noi-chon",
        title: "Kiểm tra — band 8 Speaking (6 câu)",
        items: [
          { q: "Chỗ dừng nào là “ngập ngừng vì nội dung”?", options: ["It makes people's… um… spiritual… life better.", "When did I first notice it? … I think it was in my first year.", "The wall is covered by… by… small pieces.", "I don't know how to… how to call it."], correct: 1, why: "Dừng ở ranh giới hai ý, sau một câu hỏi tự đặt, để nhớ lại. Ba câu kia dừng giữa cụm để tìm từ." },
          { q: "Quên từ “curator”. Cách xử lý band 8:", options: ["Im lặng 4 giây để nhớ.", "Nói “how to say… how to say…”", "Nói: the person who chooses what goes into the exhibition.", "Nói từ đó bằng tiếng Việt."], correct: 2, why: "Nói vòng tức thì (kỹ thuật 3) — giám khảo coi đó là paraphrase hiệu quả, không phải lỗi." },
          { q: "Câu nào đúng?", options: ["I don't know how to call it.", "I don't know what it's called.", "I don't know how it calls.", "I don't know what is it called."], correct: 1, why: "what it's called — câu hỏi gián tiếp, không đảo." },
          { q: "Tự sửa kiểu nào tự nhiên nhất?", options: ["It was built in 2000… sorry, sorry, I mean 2010.", "It was built — well, finished — in 2010.", "It was built in… no… wait… let me say again.", "It was built in 2000 2010."], correct: 1, why: "Một lần, gọn, không xin lỗi (kỹ thuật 4)." },
          { q: "“Some parts have seen better days.” nghĩa là:", options: ["Vài đoạn đẹp nhất vào ban ngày.", "Vài đoạn đã xuống cấp.", "Vài đoạn mới được sửa.", "Vài đoạn rất nổi tiếng."], correct: 1, why: "have seen better days = đã cũ, xuống cấp (Tập 4 Ngày 10)." },
          { q: "Câu mở Part 3 nào cho thấy “phát triển ý đúng trọng tâm”?", options: ["I think yes, to some extent.", "It depends.", "I think so, yes, though probably not for the reason people usually give.", "There are advantages and disadvantages."], correct: 2, why: "Có lập trường ngay, và báo trước một ý không rập khuôn." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: tone units ở câu dài — mọi chỗ ngắt rơi vào ranh giới cụm" },
      {
        t: "p",
        text: "Tập 4 Ngày 9 đã nhập **tone unit** (cụm ngữ điệu): một nhóm 3–7 từ nói liền một hơi, có ==một từ được nhấn mạnh nhất== (tonic), giọng đi lên ↗ nếu còn nói tiếp và đi xuống ↘ nếu xong ý. Ở band 8, câu trả lời dài hơn nên bạn phải chia nhiều cụm hơn — và đây chính là chỗ nối với bài hôm nay: ==chỗ được phép dừng để nghĩ là ranh giới giữa hai tone unit==.",
      },
      {
        t: "table",
        head: ["Loại cụm", "Ngữ điệu", "Ví dụ ( | = ranh giới, CHỮ HOA = tonic)"],
        rows: [
          ["Cụm mở (chưa xong ý)", "↗ lên nhẹ hoặc lơ lửng", "To be HONest ↗ | I've never really THOUGHT about it ↘"],
          ["Cụm chen (thông tin phụ)", "thấp, nhanh, phẳng", "The MUral ↗ | which runs along the RIver | took three YEARS to finish ↘"],
          ["Cụm đối lập", "nhấn hai từ đối nhau", "It's not that I disLIKE it ↗ | it's that I don't underSTAND it ↘"],
          ["Cụm liệt kê", "↗ ↗ ↘", "SOME people LOVE it ↗ | OTHers can't STAND it ↗ | and MOST just walk PAST ↘"],
          ["Cụm cuối (xong ý)", "↘ rơi rõ", "…that's about as accessible as art can GET ↘"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi tone unit của người Việt ở band 7",
        items: [
          "**Mỗi từ một cụm**: I | think | it | is | very | beautiful — do thói quen đọc từng tiếng của tiếng Việt. Nói liền cả cụm, chỉ nhấn một từ.",
          "**Nhấn mọi từ như nhau** → người nghe không biết đâu là ý chính. Mỗi cụm chỉ một tonic, thường là từ mang nghĩa cuối cùng.",
          "**Lên giọng ở cuối mọi cụm**, kể cả cụm cuối → nghe như chưa nói xong, hoặc như đang hỏi. Cụm cuối phải rơi ↘.",
        ],
      },
      { t: "rule", formula: "một ý = một cụm 3–7 từ = một tonic   ·   chưa xong ↗   ·   chen: thấp, nhanh   ·   xong ↘   ·   muốn nghĩ thì dừng ở dấu |", vi: "Ngắt ở dấu | là tự nhiên; ngắt giữa cụm là ngập ngừng vì ngôn ngữ." },
      {
        t: "phatam",
        id: "t5d2-phat-am",
        title: "Luyện phát âm — tone units ở câu dài: liền trong cụm, ngắt ở dấu |",
        note: "Mỗi câu có 2–3 cụm (xem phần dịch). Nói liền trong cụm, nhấn đúng một từ; cụm chưa xong ↗, cụm chen thấp và nhanh, cụm cuối ↘.",
        items: [
          { text: "To be honest, I've never really thought about it.", ipa: "tə bi ɒnɪst aɪv nevə rɪəli θɔːt əbaʊt ɪt", vi: "Thật lòng thì tôi chưa bao giờ thật sự nghĩ về nó. (To be HONest ↗ | I've never really THOUGHT about it ↘)" },
          { text: "The mural, which runs along the river, took three years to finish.", ipa: "ðə mjʊərəl wɪtʃ rʌnz əlɒŋ ðə rɪvə tʊk θriː jɪəz tə fɪnɪʃ", vi: "Bức tranh tường, chạy dọc con sông, mất ba năm mới xong. (The MUral ↗ | which runs along the RIver — thấp, nhanh | took three YEARS to finish ↘)" },
          { text: "It's not that I dislike modern art, it's that I don't understand it.", ipa: "ɪts nɒt ðət aɪ dɪslaɪk mɒdn ɑːt ɪts ðət aɪ dəʊnt ʌndəstænd ɪt", vi: "Không phải tôi ghét nghệ thuật hiện đại, mà là tôi không hiểu nó. (It's not that I disLIKE modern art ↗ | it's that I don't underSTAND it ↘ — nhấn hai từ đối lập)" },
          { text: "What struck me most, looking back, was how quiet it was.", ipa: "wɒt strʌk mi məʊst lʊkɪŋ bæk wɒz haʊ kwaɪət ɪt wɒz", vi: "Điều làm tôi ấn tượng nhất, khi nhìn lại, là nó yên tĩnh thế nào. (What struck me MOST ↗ | looking BACK — thấp | was how QUIet it was ↘)" },
          { text: "If the council had asked us, we would have chosen something different.", ipa: "ɪf ðə kaʊnsl həd ɑːskt ʌs wi wʊd həv tʃəʊzn sʌmθɪŋ dɪfrənt", vi: "Nếu hội đồng đã hỏi chúng tôi, chúng tôi hẳn đã chọn thứ khác. (If the council had ASKED us ↗ | we would have chosen something DIFFerent ↘)" },
          { text: "Some people love it, others can't stand it, and most just walk past.", ipa: "sʌm piːpl lʌv ɪt ʌðəz kɑːnt stænd ɪt ənd məʊst dʒʌst wɔːk pɑːst", vi: "Có người rất thích, có người không chịu nổi, còn đa số chỉ đi ngang qua. (SOME people LOVE it ↗ | OTHers can't STAND it ↗ | and MOST just walk PAST ↘)" },
          { text: "As far as I know, it was paid for by local businesses.", ipa: "əz fɑːr əz aɪ nəʊ ɪt wɒz peɪd fɔː baɪ ləʊkl bɪznəsɪz", vi: "Theo tôi biết thì nó do các doanh nghiệp địa phương trả tiền. (As far as I KNOW ↗ | it was paid for by local BUSinesses ↘)" },
          { text: "That's a difficult one, because it depends who you ask.", ipa: "ðæts ə dɪfɪkəlt wʌn bɪkɒz ɪt dɪpendz huː ju ɑːsk", vi: "Câu đó khó đấy, vì còn tuỳ bạn hỏi ai. (That's a DIFFicult one ↘ | because it depends who you ASK ↘)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d2-noi-tone",
        title: "Tone units — chọn phương án đúng (5 câu)",
        items: [
          { q: "Chỗ ngắt nào tự nhiên?", options: ["It's essentially a | wall that's been covered in | ceramic.", "It's essentially a wall | that's been covered in ceramic.", "It's | essentially | a | wall.", "It's essentially a wall that's | been covered in ceramic."], correct: 1, why: "Ngắt ở ranh giới mệnh đề: cụm danh từ trọn vẹn | mệnh đề quan hệ." },
          { q: "“The mural, which runs along the river, took three years.” — cụm “which runs along the river” nên nói:", options: ["to và chậm hơn", "thấp và nhanh hơn", "lên giọng thật cao", "bỏ đi"], correct: 1, why: "Cụm chen (thông tin phụ) nói thấp, nhanh, phẳng." },
          { q: "“It's not that I disLIKE it, it's that I don't underSTAND it.” Vì sao nhấn dislike và understand?", options: ["vì là từ dài nhất", "vì là hai ý đối lập nhau", "vì đứng cuối câu", "vì là động từ"], correct: 1, why: "Tonic chuyển tới từ mang sự đối lập." },
          { q: "Cụm cuối của một câu trả lời nên:", options: ["↗ lên, để giám khảo biết còn nói tiếp", "↘ rơi rõ, để báo đã xong ý", "phẳng", "thêm “yeah”"], correct: 1, why: "Giọng rơi ở cụm cuối = kết câu dứt khoát (kỹ thuật 6)." },
          { q: "Cần 2 giây để nghĩ ví dụ. Nên dừng ở:", options: ["giữa mạo từ và danh từ", "giữa trợ động từ và động từ chính", "ranh giới giữa hai tone unit", "giữa một từ"], correct: 2, why: "Dừng ở ranh giới cụm nghe như suy nghĩ; dừng trong cụm nghe như tìm từ." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: ghi âm — nghe lại — đếm chỗ dừng",
        items: [
          "Ghi âm lần 1. Nghe lại và đánh dấu **mọi chỗ dừng trên nửa giây**. Phân loại: N (vì nội dung, ở ranh giới ý) hay L (vì ngôn ngữ, giữa cụm).",
          "Mục tiêu band 8: trong một bài Part 2 hai phút, ==L ≤ 2==. Với mỗi chỗ L, tìm kỹ thuật thay thế (1–6) rồi ghi âm lần 2.",
          "Part 2: 1 phút ghi chú chỉ từ khoá — 2 phút nói. Dùng tối đa hai câu hỏi tự đặt.",
          "Part 3: mỗi câu 40–60 giây. Câu đầu có lập trường; câu cuối hạ giọng và dừng.",
        ],
      },
      {
        t: "speak",
        id: "t5d2-noi-p1",
        part: "1",
        questions: [
          "Do you ever go to art galleries or museums?",
          "Did you enjoy art lessons at school?",
          "Is there any art on the walls of your home?",
          "Have you ever tried drawing or painting as an adult?",
          "Do you think it's important for children to learn about art?",
        ],
      },
      {
        t: "speak",
        id: "t5d2-noi-p2",
        part: "2",
        questions: [
          "Describe a piece of art in a public place (for example a statue, a mural or a sculpture) that you have noticed. You should say: where it is; what it looks like; when you first noticed it; and explain what you think of it.",
        ],
      },
      {
        t: "speak",
        id: "t5d2-noi-p3",
        part: "3",
        questions: [
          "Should public money be spent on art in public places?",
          "Who should decide which artworks are displayed in a city — experts, officials or residents?",
          "Why do some people dislike modern art?",
          "Do you think people will still visit art galleries in fifty years' time?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Số chỗ dừng loại L ở lần ghi âm 1: ___ → lần 2: ___ . Kỹ thuật bạn dùng nhiều nhất: ___ .",
          "Ba cụm của hôm nay bạn sẽ dùng lại: ___ · ___ · ___ (gợi ý: the best part of · have a soft spot for · earn its keep · easier said than done).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d2-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 2 — AWL 570 (dạng từ · giới từ · cặp dễ nhầm) · Chính phủ & Nghệ thuật vòng 2 · collocation tinh · band 8 Writing · ngập ngừng và tone units",
    goal: "Ôn trọn Ngày 2: viết đúng dạng từ của 10 họ AWL khác với bài kiểm trên lớp, chọn đúng giới từ và cặp dễ nhầm, dùng đúng từ Chính phủ và Nghệ thuật vòng 2, thay cụm dùng tạm bằng collocation chính xác, nhận ra động tác band 8 trong bài viết (bốn mắt xích, liên kết chìm, sắc thái), phân biệt hai loại ngập ngừng và đặt đúng ranh giới tone unit — 52 câu có đáp án, một thân bài và một bài nói AI chấm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "52 câu, khoảng 50 phút. Mục tiêu band 8: **≥ 46/52**.",
          "Phần I dùng 10 họ AWL **khác** với Kiểm A–E — nếu phần này cũng dưới 8/10, hãy theo kế hoạch 7 ngày ở Bài 1 mục 8.",
          "Phần IX (viết) và X (nói) không tính vào 52 câu. Làm cả hai: đó là lúc từ hôm nay chuyển từ “nhận ra” sang “dùng được”.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 2 trong một hình",
        center: "Band 8 = chính xác + tự nhiên",
        branches: [
          { label: "AWL 570", items: ["đúng dạng", "đúng giới từ", "không lẫn cặp", "dưới 8/10 → ôn đúng Ngày"] },
          { label: "Chính phủ vòng 2", items: ["mandate · electorate", "ring-fence · austerity", "oversight · scrutiny", "short-termism"] },
          { label: "Nghệ thuật vòng 2", items: ["commission · curator", "abstract / figurative", "understated ↔ pretentious", "accessible · resonate"] },
          { label: "Viết band 8", items: ["4 mắt xích", "liên kết chìm", "từ chính xác", "≥ 90 % câu sạch"] },
          { label: "Nói band 8", items: ["ngắt ở ranh giới ý", "câu mua thời gian có nghĩa", "nói vòng tức thì", "tone units"] },
        ],
      },

      { t: "h", text: "I. AWL 570 — viết dạng đúng (10 câu, mỗi sublist một câu) — ôn Bài 1 mục 1–5" },
      {
        t: "quiz",
        id: "t5d2-bt-awl",
        kind: "fill",
        title: "I. Viết dạng đúng của từ in HOA",
        items: [
          { q: "A careful ___ of the figures reveals a different picture. (ANALYSE)", answers: ["analysis"], hint: "Sublist 1. analyse · analysis (số nhiều analyses) · analytical · analyst." },
          { q: "The findings are ___ with those of earlier studies. (CONSIST)", answers: ["consistent"], hint: "Sublist 1. consistent **with** · inconsistent · consistency." },
          { q: "Critics have questioned the ___ of the test. (VALID)", answers: ["validity"], hint: "Sublist 3. valid · validity · invalid · validate." },
          { q: "The ___ of migrants into the labour market takes time. (INTEGRATE)", answers: ["integration"], hint: "Sublist 4. integrate **into** · integration." },
          { q: "The rapid ___ of the city has swallowed several villages. (EXPAND)", answers: ["expansion"], hint: "Sublist 5. expand · expansion · expansive." },
          { q: "The ___ of funding between regions is widely seen as unfair. (ALLOCATE)", answers: ["allocation"], hint: "Sublist 6. allocate funding **to** · allocation." },
          { q: "The ___ of malaria remains a distant goal. (ELIMINATE)", answers: ["elimination"], hint: "Sublist 7. eliminate · elimination." },
          { q: "The ___ of wealth in a few hands worries many economists. (ACCUMULATE)", answers: ["accumulation"], hint: "Sublist 8. accumulate · accumulation · cumulative." },
          { q: "Shops took on extra staff in ___ of the holiday rush. (ANTICIPATE)", answers: ["anticipation"], hint: "Sublist 9. in anticipation of." },
          { q: "The industry has ___ major changes over the past decade. (UNDERGO)", answers: ["undergone"], hint: "Sublist 10. undergo – underwent – undergone." },
        ],
      },

      { t: "h", text: "II. Giới từ và cặp dễ nhầm (8 câu) — ôn Bài 1 mục 6–7" },
      {
        t: "mcq",
        id: "t5d2-bt-gioi-tu",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "The findings do not conform ___ the usual pattern.", options: ["with the", "to", "on", "for"], correct: 1, why: "conform to." },
          { q: "The festival coincides ___ the start of the school holidays.", options: ["to", "on", "with", "for"], correct: 2, why: "coincide with." },
          { q: "Margarine was originally sold as a substitute ___ butter.", options: ["of", "to", "by", "for"], correct: 3, why: "a substitute for." },
          { q: "The exhibition ___ sixty works from four countries.", options: ["comprises of", "is consisted of", "comprises", "consists"], correct: 2, why: "comprise + tân ngữ. consist luôn chủ động + of." },
          { q: "The drug had no noticeable ___ on recovery times.", options: ["affect", "effect"], correct: 1, why: "have an effect on → danh từ effect." },
          { q: "In ___ , everyone has equal access to the courts; in practice, cost is a barrier.", options: ["principal", "principle"], correct: 1, why: "in principle = về nguyên tắc." },
          { q: "The minister ___ that taxes might rise, without saying so directly.", options: ["inferred", "implied"], correct: 1, why: "Người NÓI ngụ ý → imply." },
          { q: "Job ___ for graduates in the region have improved.", options: ["perspectives", "prospects"], correct: 1, why: "job prospects = triển vọng việc làm." },
        ],
      },

      { t: "h", text: "III. Chính phủ & chi tiêu công vòng 2 (6 câu) — ôn Bài 1 mục 9" },
      {
        t: "quiz",
        id: "t5d2-bt-chinh-phu",
        kind: "fill",
        title: "III. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "The mayor, who is the i_______ , is seeking a third term.", answers: ["incumbent"], hint: "người đương nhiệm." },
          { q: "The city held a r_______ on whether to build the stadium.", answers: ["referendum"], hint: "hold a referendum on." },
          { q: "Small firms say that red t_______ is holding them back.", answers: ["tape"], hint: "red tape — không đếm được." },
          { q: "Benefits that are m_______-tested go only to households below a certain income.", answers: ["means"], hint: "means-tested." },
          { q: "The contract came under intense public s_______ after the cost doubled.", answers: ["scrutiny"], hint: "come under scrutiny." },
          { q: "Power over transport has been d_______ to the regions.", answers: ["devolved"], hint: "devolve power to." },
        ],
      },

      { t: "h", text: "IV. Nghệ thuật vòng 2 (6 câu) — ôn Bài 1 mục 10" },
      {
        t: "mcq",
        id: "t5d2-bt-nghe-thuat",
        title: "IV. Chọn phương án đúng",
        items: [
          { q: "The painting shows no recognisable objects at all; it is purely ___ .", options: ["figurative", "abstract", "derivative", "accessible"], correct: 1, why: "abstract = không tả vật thật." },
          { q: "Bạn muốn KHEN một đài tưởng niệm giản dị, không phô trương:", options: ["pretentious", "bland", "understated", "derivative"], correct: 2, why: "understated là lời khen; bland (nhạt) và pretentious là lời chê." },
          { q: "The city ___ a young sculptor to create a fountain for the square.", options: ["curated", "commissioned", "resonated", "composed"], correct: 1, why: "commission somebody to do something." },
          { q: "A recurring ___ in his films is the empty railway station.", options: ["motive", "motif", "medium", "genre"], correct: 1, why: "motif = hình ảnh lặp lại. motive = động cơ." },
          { q: "The show uses projections on every wall and the floor; it is a fully ___ experience.", options: ["immersive", "understated", "figurative", "visceral"], correct: 0, why: "immersive = bao trùm người xem." },
          { q: "“Critics dismissed it as derivative.” Giới phê bình cho rằng tác phẩm:", options: ["quá khó hiểu", "thiếu cái riêng, vay mượn", "quá đắt", "quá dài"], correct: 1, why: "derivative = phỏng theo cái đã có." },
        ],
      },

      { t: "h", text: "V. Collocation tinh (6 câu) — ôn Bài 1 mục 11" },
      {
        t: "quiz",
        id: "t5d2-bt-collocation",
        kind: "fill",
        title: "V. Thay từ [trong ngoặc] bằng MỘT từ chính xác hơn",
        items: [
          { q: "The two countries finally [solved] their border dispute.", answers: ["resolved", "settled"], hint: "resolve / settle a dispute." },
          { q: "Volunteers have [got] a great deal of experience.", answers: ["gained", "acquired"], hint: "gain experience." },
          { q: "The government has promised to [stop] public spending.", answers: ["curb", "cut", "reduce"], hint: "curb spending = kìm lại." },
          { q: "Large companies [have] considerable influence on policy.", answers: ["exert", "exercise", "wield"], hint: "exert influence on." },
          { q: "It is [very] unlikely that the law will be repealed.", answers: ["highly", "extremely"], hint: "highly unlikely." },
          { q: "The idea that art is only for the rich is a widely [had] belief.", answers: ["held"], hint: "a widely held belief." },
        ],
      },

      { t: "h", text: "VI. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 9–12" },
      {
        t: "quiz",
        id: "t5d2-bt-dich",
        kind: "translate",
        title: "VI. Dịch — dùng từ trong gợi ý",
        grammar: "từ vòng 2 + collocation chính xác",
        items: [
          { q: "Chính phủ thiếu sự uỷ quyền của cử tri cho những cải cách như vậy.", answers: ["The government lacks a mandate for such reforms.", "The government has no mandate for such reforms.", "The government lacks the mandate for such reforms."], hint: "lack a mandate for · such reforms (lack không có of)" },
          { q: "Thuế mới đặt ra một mối đe doạ nghiêm trọng cho các doanh nghiệp nhỏ.", answers: ["The new tax poses a serious threat to small businesses."], hint: "pose a serious threat to" },
          { q: "Thành phố đã đặt một nghệ sĩ địa phương vẽ một bức tranh tường.", answers: ["The city commissioned a local artist to paint a mural.", "The city has commissioned a local artist to paint a mural."], hint: "commission … to paint · a mural" },
          { q: "Chúng ta phải tìm được sự cân bằng giữa giám sát và tự do.", answers: ["We must strike a balance between oversight and freedom.", "We have to strike a balance between oversight and freedom.", "We need to strike a balance between oversight and freedom."], hint: "strike a balance between · oversight · freedom" },
          { q: "Tư duy ngắn hạn là cố hữu trong chu kỳ bầu cử.", answers: ["Short-termism is inherent in the electoral cycle.", "Short-termism is inherent in electoral cycles."], hint: "short-termism · inherent in · the electoral cycle" },
        ],
      },

      { t: "h", text: "VII. Band 8 Writing (6 câu) — ôn Bài 2 mục 4–7" },
      {
        t: "mcq",
        id: "t5d2-bt-viet",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "Theo mô tả band, chỗ khác nhau chính giữa TR band 7 và band 8 là:", options: ["band 8 dài hơn 50 từ", "band 7 có chỗ khái quát quá; band 8 ý phát triển tốt, thấu đáo", "band 8 có nhiều ý hơn", "band 8 có số liệu"], correct: 1, why: "Chữ đổi: khái quát → đào sâu. Số ý thường ÍT hơn." },
          { q: "Câu nào là mắt xích ② (cơ chế — vì sao)?", options: ["Residents should have more say.", "A budget that ignores local knowledge will tend to fund what is visible from the town hall rather than what is needed.", "For example, parks.", "In conclusion, I agree."], correct: 1, why: "Giải thích vì sao thiếu hiểu biết địa phương dẫn tới chi sai." },
          { q: "Câu nào nối bằng quy chiếu thay cho từ nối đầu câu?", options: ["Moreover, it costs money.", "Secondly, there is turnout.", "Such items rarely win a show of hands.", "Furthermore, people are busy."], correct: 2, why: "Such items chỉ lại danh sách ở câu trước." },
          { q: "“Opponents ___ that the scheme is cheap, but offer no evidence.” Từ đúng sắc thái:", options: ["concede", "claim", "prove", "admit"], correct: 1, why: "claim = khẳng định chưa có chứng cứ." },
          { q: "Ví dụ nào hợp band 8 cho đề về ngân sách ĐỊA PHƯƠNG?", options: ["For example, in my country many people are poor.", "For example, a council choosing between repairing a sewer and building a skate park.", "For example, the national defence budget.", "For example, a study showed 73.4 %."], correct: 1, why: "Cụ thể và đúng cấp địa phương. C lạc phạm vi; D là số bịa." },
          { q: "Bài 14 câu, 13 câu sạch, 1 lỗi mạo từ. Theo thước đo của khoá:", options: ["chắc chắn band 6", "khoảng 93 % câu sạch — đạt mức GRA band 8", "không tính được", "band 9"], correct: 1, why: "13/14 ≈ 93 %; lỗi còn lại là lỗi nhỏ → “đa số câu không lỗi”." },
        ],
      },

      { t: "h", text: "VIII. Ngập ngừng và tone units (5 câu) — ôn Bài 3 mục 2 · 3 · 7" },
      {
        t: "mcq",
        id: "t5d2-bt-noi",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "Câu nào là câu “mua thời gian có nghĩa”?", options: ["Um… er… how to say…", "That's an interesting one — I suppose it depends who's paying.", "Sorry, can you repeat? Sorry.", "Yeah… so… yeah."], correct: 1, why: "Vừa cho thời gian nghĩ, vừa mở một ý." },
          { q: "Chỗ ngắt nào SAI?", options: ["As far as I know | it was paid for by local businesses.", "If the council had asked us | we would have chosen something different.", "It was paid for by | local businesses.", "To be honest | I've never really thought about it."], correct: 2, why: "Ngắt giữa giới từ by và cụm danh từ của nó — phá một cụm." },
          { q: "“I've got a soft spot for it.” nghĩa là:", options: ["Tôi thấy nó mềm.", "Tôi có cảm tình đặc biệt với nó.", "Tôi thấy nó yếu.", "Tôi đã chạm vào nó."], correct: 1, why: "have a soft spot for = quý, có cảm tình." },
          { q: "Band 7 nói “people's… spiritual life”. Cách nói tự nhiên hơn:", options: ["people's ghost life", "people's well-being", "people's spirit living", "people's mental"], correct: 1, why: "“đời sống tinh thần” = well-being / quality of life." },
          { q: "Trong một câu liệt kê ba ý, ngữ điệu đúng là:", options: ["↘ ↘ ↘", "↗ ↗ ↘", "↗ ↗ ↗", "↘ ↗ ↗"], correct: 1, why: "Lên ở hai mục đầu (còn nữa), rơi ở mục cuối (hết)." },
        ],
      },

      { t: "h", text: "IX. Viết một thân bài đủ bốn mắt xích (110–140 từ) — AI chấm" },
      {
        t: "p",
        text: "Đề: “Some people believe that governments should fund only those arts that are popular with the general public.” Viết **một** thân bài BÁC quan điểm này. Bắt buộc: (1) một ý duy nhất đi đủ bốn mắt xích — nhận định → cơ chế → ví dụ cụ thể → giới hạn / hệ quả; (2) tối đa **một** từ nối đầu câu; (3) ít nhất **bốn** từ / collocation của Bài 1 (ví dụ: artistic merit, commission, ring-fence, short-termism, accessible, pose a threat, a widely held belief); (4) mỗi nhận định một hedge.",
      },
      {
        t: "essay",
        id: "t5d2-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Some people believe that governments should fund only those arts that are popular with the general public. Write ONE body paragraph (110–140 words) that argues AGAINST this view. Develop a single idea through four links: claim → mechanism (why) → one specific, relevant example → a limit or consequence. Use no more than one sentence-initial linking word, at least four items from today's vocabulary, and one hedge per claim.",
        minWords: 110,
        tips: [
          "Nhận định: Popularity is a poor guide to what deserves public support.",
          "Cơ chế: what is popular can already pay for itself through ticket sales; subsidy matters where the market fails.",
          "Ví dụ: a regional orchestra, a small theatre, a commission for a public square…",
          "Giới hạn / hệ quả: This is not to say that audiences should be ignored…",
          "Nối bằng Such work / This / They — không dùng Firstly, Moreover.",
        ],
      },
      {
        t: "note",
        title: "📌 Một thân bài mẫu để so sau khi đã viết (band 8, ước tính) — 6 câu, 6 câu sạch",
        items: [
          "Popularity is a poor guide to what deserves public support. Art that already draws large audiences can usually pay for itself through ticket sales and sponsorship; subsidy matters most where the market fails. A regional orchestra or a small experimental theatre will rarely fill enough seats to cover its costs, yet it is often in such places that new work is first commissioned and tested. Judging these institutions by attendance alone would, in all likelihood, leave the public with a narrower choice within a generation. This is not to say that audiences should be ignored: funded organisations can reasonably be asked to make their work accessible through cheap tickets and school visits. The test, however, should be artistic merit and reach, not a show of hands.",
          "Soi: ① câu 1 · ② câu 2 · ③ câu 3 · ④ câu 4–5 · chốt câu 6. Một từ nối (however, chen giữa câu). Hedge: usually · will rarely · often · in all likelihood · can reasonably. Từ hôm nay: commissioned · accessible · artistic merit · a show of hands.",
        ],
      },

      { t: "h", text: "X. Nói 4 câu Part 3 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu 40–60 giây. Trước khi ghi âm, đọc lại khung ở Bài 3 mục 6. Sau khi ghi, nghe lại và đếm chỗ dừng loại L (giữa cụm). Mục tiêu: **L ≤ 1 mỗi câu**.",
      },
      {
        t: "speak",
        id: "t5d2-bt-noi-p3",
        part: "3",
        questions: [
          "Do you think local people should have a say in how their city spends its money?",
          "Why do governments often choose short-term projects over long-term ones?",
          "Is it better for artists to be funded by the state or by private companies?",
          "Some people say that art in public places is a waste of money. What's your view?",
        ],
      },
    ],
  },
];
