/**
 * IELTS Tập 5 — Ngày 26 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, số liệu, bài mẫu, thẻ nói, câu bài tập VIẾT MỚI)
 * Khuôn N mod 4 = 2 ⇒ vocab · writing · SPEAKING · homework (docs/ielts-lo-trinh-0-8.md mục 3.5 hàng 26 + mục 3.6 “N26 VC31 vòng 2”).
 *   Bài 1 (vocab)     Energy vòng 2 (16) + Language vòng 2 (16) + Books vòng 2 (16) — 48 mục `vocab` MỚI (đã đối chiếu mọi khối vocab
 *                     Tập 3–5: không trùng; từ vòng 1 của Tập 3 Ngày 24 · 28 chỉ ôn ở bài kiểm đầu) + 6 cặp dễ nhầm + kho ý cho 6 đề
 *                     Task 2 / Part 3                                                       [VC25 VC26 VC31 · mục 3.6 “N26 VC31 vòng 2”]
 *                     — nối Tập 3 Ngày 24 (Energy vòng 1) · Ngày 28 (Language + Books vòng 1) · Tập 5 Ngày 6 (sắc thái) · 22 (đề lạ).
 *   Bài 2 (writing)   SPRINT Task 1: 7 dạng × 20 phút [W08–W14] — line có năm dự báo · bar nhóm tuổi · hai pie · table khác đơn vị ·
 *                     mixed (line + pie) · process (sản xuất sách nói, có vòng sửa) · map hai mốc (xưởng in cũ bên kênh). Mỗi dạng:
 *                     hình tự dựng + “3 phút đầu” + overview band 8; dạng line có bài mẫu band 7 và band 8 đặt cạnh nhau + bảng 4 tiêu
 *                     chí; 7 ô viết AI chấm. Số liệu, địa danh (Country X, Calder Wharf, Regional Language R) đều HƯ CẤU.
 *                     — nối Tập 3 Ngày 8 · 12 · 16 · 20 · 24 · 28 · Tập 4 Ngày 6 · 12 · 18 · 24 · Tập 5 Ngày 6 · 12 · 18 · Đề 9–11.
 *   Bài 3 (speaking)  SPRINT Part 2: 12 đề hay gặp, 1 phút chuẩn bị [S05 S08] — bốn ô ghi chú, bảng 12 thẻ theo 6 loại, kho 4 chuyện phủ
 *                     12 thẻ, bài mẫu band 7 và band 8 cạnh nhau (a journey you remember well), 3 vòng × 4 thẻ + Part 3; 🔊 nhấn câu mở /
 *                     câu chốt + từ khó của 12 thẻ (photograph / photographer, comfortable, restaurant).
 *                     — nối Tập 3 Ngày 22 · 26 · Tập 4 Ngày 30 (kho 5 chuyện) · Tập 5 Ngày 7 · 14 · 17.
 *   Bài tập Ngày 26   40 câu có đáp án + 1 bài Task 1 + 2 thẻ nói lại.
 * Đã grep `Describe` trong tap-3…tap-5 + thi-may/de (208 dòng): 12 thẻ (famous person · neighbour · park or garden · country not yet
 * visited · website or app · photograph · journey · meal · late · very busy · film · song or music) KHÔNG trùng thẻ nào của Tập 3–5 và
 * Đề 1–12. Mọi id bắt đầu `t5d26-`.
 */
import type { Lesson } from '../data';

export const NGAY_26: Lesson[] = [
  /* ════════════════ BÀI 1 — TỪ VỰNG ════════════════ */
  {
    id: "t5d26-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Energy · Language · Books vòng 2 — 48 từ nói về CƠ CHẾ và TRANH LUẬN, không chỉ gọi tên sự vật",
    goal: "Có 48 từ và cụm mức band 8 để viết Task 2 và nói Part 3 về ba chủ đề hay gặp — năng lượng (energy mix, baseload, stranded assets, fuel poverty), ngôn ngữ (language shift, heritage language, linguistic imperialism, connotation) và sách (deep reading, self-publishing, royalties, escapism) — không nhầm sáu cặp dễ lẫn (literal / literary / literate, translator / interpreter…), và có sẵn ý hai phía cho sáu đề quen thuộc.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Vòng 1 (Tập 3 Ngày 24 và Ngày 28) cho bạn từ để ==gọi tên==: fossil fuel, solar panel, dialect, bilingual, genre, e-book. Vòng 2 cho từ để ==giải thích cơ chế và tranh luận==: vì sao điện gió chưa thay được than (baseload), vì sao một ngôn ngữ chết dần (language shift), vì sao màn hình đổi cách đọc (deep reading).",
          "Ba nhóm, mỗi nhóm 16 từ: **Energy** (cấu trúc nguồn điện · chính sách · công bằng) · **Language** (sinh – tử của ngôn ngữ · quyền lực · sắc thái) · **Books** (ngành xuất bản · thói quen đọc · từ để kể về một cuốn sách).",
          "Sáu cặp dễ nhầm ở mục 4 — có hai cặp (literal / literary / literate, translator / interpreter) mà người band 7.5 vẫn sai trong Speaking.",
          "Mục 5: kho ý hai phía cho sáu đề Task 2 / Part 3. Bài 2 (sprint Task 1) dùng ngay từ năng lượng và từ về sách; Bài 3 (sprint Part 2) dùng từ để kể về sách, phim, nhạc.",
        ],
      },

      { t: "h", text: "Vòng 1 đã học gì — kiểm nhanh trước khi lên vòng 2" },
      { t: "p", text: "Sáu câu dưới dùng từ của Tập 3 Ngày 24 (Energy) và Ngày 28 (Language, Books). Đúng ít nhất 5 thì học tiếp; sai từ 2 câu thì mở lại hai ngày đó 15 phút trước." },
      {
        t: "quiz", id: "t5d26-on-dau-bai", kind: "fill", title: "Ôn vòng 1 (6 câu) — điền MỘT từ hoặc cụm",
        items: [
          { q: "1. Coal, oil and natural gas are all ___ fuels.", answers: ["fossil"], hint: "fossil fuels — Tập 3 Ngày 24." },
          { q: "2. Wind and solar power are ___ sources: they will not run out.", answers: ["renewable"], hint: "renewable — tái tạo." },
          { q: "3. Electricity from new wind farms has to be connected to the national ___.", answers: ["grid"], hint: "the national grid — lưới điện." },
          { q: "4. English has become a lingua ___ for international business.", answers: ["franca"], hint: "lingua franca — ngôn ngữ chung (Tập 3 Ngày 28)." },
          { q: "5. Children of migrants often speak their mother ___ only at home.", answers: ["tongue"], hint: "mother tongue." },
          { q: "6. A good reader learns to read between the ___.", answers: ["lines"], hint: "read between the lines — đọc ra ý ẩn." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Energy vòng 2 — 16 từ cho câu hỏi “chuyển đổi năng lượng có công bằng và khả thi không?”" },
      {
        t: "sodo", kind: "mindmap", title: "Energy vòng 2 — ba việc của từ vựng",
        center: "**Energy** trong Task 2 / Part 3",
        branches: [
          { label: "Cấu trúc nguồn điện", items: ["energy mix", "baseload", "peak demand", "grid-scale storage", "offshore wind"] },
          { label: "Chính sách & kinh tế", items: ["carbon pricing", "stranded assets", "energy independence", "fracking", "nuclear waste"] },
          { label: "Hộ gia đình & công bằng", items: ["retrofit", "smart meter", "fuel poverty", "microgeneration", "energy-intensive", "power-hungry"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "energy mix", pos: "n", ipa: "/ˈenədʒi mɪks/", vi: "cơ cấu nguồn năng lượng (tỉ trọng các nguồn trong tổng)", ex: "Coal's share of the country's energy mix has fallen below ten per cent.", exVi: "Tỉ trọng than trong cơ cấu năng lượng của nước này đã xuống dưới mười phần trăm.", more: "a diverse / balanced energy mix · the share of X in the energy mix · Task 1 overview: the energy mix shifted from coal towards renewables" },
          { w: "baseload", pos: "n / adj", ipa: "/ˈbeɪsləʊd/", vi: "mức điện nền tối thiểu lúc nào cũng cần; nguồn chạy liên tục để đáp ứng mức đó", ex: "Nuclear plants are usually run to provide baseload power.", exVi: "Nhà máy hạt nhân thường được vận hành để cung cấp điện nền.", more: "baseload power / demand · lập luận: wind and solar cannot yet provide reliable baseload on their own" },
          { w: "peak demand", pos: "n", ipa: "/ˌpiːk dɪˈmɑːnd/", vi: "mức tiêu thụ cao điểm", ex: "Peak demand comes on winter evenings, when people get home and switch everything on.", exVi: "Cao điểm tiêu thụ rơi vào các tối mùa đông, khi người ta về nhà và bật mọi thứ lên.", more: "meet / reduce / shift peak demand · off-peak (thấp điểm, giá rẻ) · at peak times" },
          { w: "grid-scale storage", pos: "n", ipa: "/ˌɡrɪd skeɪl ˈstɔːrɪdʒ/", vi: "kho lưu điện quy mô lưới điện (pin cỡ lớn, thuỷ điện tích năng)", ex: "Grid-scale storage lets solar power generated at noon be used after dark.", exVi: "Kho lưu điện quy mô lưới cho phép dùng điện mặt trời sinh ra lúc trưa vào sau khi trời tối.", more: "battery storage · pumped storage · lời giải cho nhược điểm intermittent (vòng 1)" },
          { w: "offshore wind", pos: "n", ipa: "/ˌɒfʃɔː ˈwɪnd/", vi: "điện gió ngoài khơi", ex: "Offshore wind benefits from stronger, steadier winds and fewer objections from residents.", exVi: "Điện gió ngoài khơi có gió mạnh và đều hơn, lại ít bị cư dân phản đối hơn.", more: "an offshore wind farm · onshore wind (trên đất liền) · offshore drilling" },
          { w: "retrofit", pos: "v / n", ipa: "/ˈretrəʊfɪt/", vi: "lắp thêm thiết bị mới cho công trình cũ; cải tạo", ex: "Retrofitting old houses with insulation could halve their heating bills.", exVi: "Cải tạo nhà cũ bằng lớp cách nhiệt có thể giảm một nửa hoá đơn sưởi.", more: "retrofit sth with sth · a retrofit programme · Task 2: retrofitting existing buildings vs building new ones" },
          { w: "smart meter", pos: "n", ipa: "/ˌsmɑːt ˈmiːtə/", vi: "công tơ điện thông minh (hiện mức dùng theo thời gian thực, tự gửi số liệu)", ex: "A smart meter shows households exactly what it costs to boil a kettle.", exVi: "Công tơ thông minh cho hộ gia đình thấy chính xác đun một ấm nước tốn bao nhiêu.", more: "install a smart meter · in real time · lập luận: making use visible changes behaviour" },
          { w: "fuel poverty", pos: "n", ipa: "/ˈfjuːəl ˌpɒvəti/", vi: "cảnh nghèo năng lượng (không đủ tiền sưởi ấm, trả hoá đơn điện – khí)", ex: "Rising prices have pushed thousands of pensioners into fuel poverty.", exVi: "Giá tăng đã đẩy hàng nghìn người hưu trí vào cảnh nghèo năng lượng.", more: "live in / be pushed into fuel poverty · cũng gặp: energy poverty · lập luận công bằng của chuyển đổi năng lượng" },
          { w: "carbon pricing", pos: "n", ipa: "/ˌkɑːbən ˈpraɪsɪŋ/", vi: "định giá carbon (bên phát thải trả tiền cho mỗi tấn CO₂)", ex: "Carbon pricing makes polluting fuels more expensive without banning them outright.", exVi: "Định giá carbon làm nhiên liệu gây ô nhiễm đắt hơn mà không cần cấm hẳn.", more: "carbon pricing gồm carbon tax và emissions trading (vòng 1) · a market-based solution" },
          { w: "stranded assets", pos: "n", ipa: "/ˌstrændɪd ˈæsets/", vi: "tài sản mắc kẹt (nhà máy, mỏ mất giá trị trước hạn vì chính sách / công nghệ đổi)", ex: "Coal mines opened today may become stranded assets within twenty years.", exVi: "Mỏ than mở hôm nay có thể thành tài sản mắc kẹt trong vòng hai mươi năm.", more: "risk becoming stranded assets · lập luận kinh tế chống đầu tư mới vào nhiên liệu hoá thạch" },
          { w: "energy independence", pos: "n", ipa: "/ˌenədʒi ˌɪndɪˈpendəns/", vi: "tự chủ năng lượng (không phụ thuộc nhập khẩu)", ex: "For many governments, energy independence has become a matter of national security.", exVi: "Với nhiều chính phủ, tự chủ năng lượng đã thành vấn đề an ninh quốc gia.", more: "achieve energy independence · gần nghĩa: energy security (vòng 1) — security rộng hơn: cả nguồn cung ổn định, giá ổn định" },
          { w: "energy-intensive", pos: "adj", ipa: "/ˌenədʒi ɪnˈtensɪv/", vi: "tốn nhiều năng lượng", ex: "Steel and cement are among the most energy-intensive industries.", exVi: "Thép và xi măng thuộc các ngành tốn năng lượng nhất.", more: "energy-intensive industries / processes · cùng khuôn: labour-intensive, capital-intensive · đối: energy-efficient (mục 4)" },
          { w: "microgeneration", pos: "n", ipa: "/ˌmaɪkrəʊˌdʒenəˈreɪʃn/", vi: "phát điện quy mô nhỏ tại chỗ (pin mặt trời trên mái, tua-bin nhỏ)", ex: "Microgeneration lets households sell surplus electricity back to the grid.", exVi: "Phát điện tại chỗ cho phép hộ gia đình bán điện dư lại cho lưới.", more: "rooftop solar · surplus electricity · sell back to the grid" },
          { w: "fracking", pos: "n", ipa: "/ˈfrækɪŋ/", vi: "khai thác khí bằng phương pháp nứt vỡ thuỷ lực", ex: "Fracking has been banned in several countries over fears of earth tremors and water pollution.", exVi: "Khai thác khí nứt vỡ thuỷ lực đã bị cấm ở nhiều nước vì lo ngại rung chấn và ô nhiễm nước.", more: "= hydraulic fracturing · shale gas · lập luận: cheaper gas vs local environmental risk" },
          { w: "nuclear waste", pos: "n", ipa: "/ˌnjuːkliə ˈweɪst/", vi: "chất thải hạt nhân", ex: "The need to store nuclear waste for thousands of years remains the strongest argument against the industry.", exVi: "Việc phải cất giữ chất thải hạt nhân hàng nghìn năm vẫn là lập luận mạnh nhất chống lại ngành này.", more: "dispose of / store nuclear waste · radioactive · lập luận: low-carbon but long-lived waste" },
          { w: "power-hungry", pos: "adj", ipa: "/ˈpaʊə ˌhʌŋɡri/", vi: "ngốn điện", ex: "Data centres are among the most power-hungry buildings in the world.", exVi: "Trung tâm dữ liệu thuộc loại công trình ngốn điện nhất thế giới.", more: "power-hungry devices / appliances · nghĩa khác: khát quyền lực (a power-hungry politician)" },
        ],
      },
      {
        t: "quiz", id: "t5d26-nang-luong", kind: "fill", title: "Energy — điền MỘT từ hoặc cụm (5 câu)",
        items: [
          { q: "1. Without grid-scale ___, solar power cannot be used after sunset.", answers: ["storage"], hint: "grid-scale storage." },
          { q: "2. Many elderly people living alone are at risk of fuel ___ in winter.", answers: ["poverty"], hint: "fuel poverty." },
          { q: "3. Investors fear that new coal plants will become stranded ___.", answers: ["assets"], hint: "stranded assets." },
          { q: "4. Older homes can be ___ with insulation and heat-saving windows.", answers: ["retrofitted"], hint: "retrofit sth with sth — bị động: retrofitted." },
          { q: "5. Aluminium smelting is an extremely energy-___ process.", answers: ["intensive"], hint: "energy-intensive." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Language vòng 2 — 16 từ cho “ngôn ngữ sống, chết và mang quyền lực”" },
      {
        t: "sodo", kind: "mindmap", title: "Language vòng 2 — ba việc của từ vựng",
        center: "**Language** trong Task 2 / Part 3",
        branches: [
          { label: "Sống – chết của ngôn ngữ", items: ["language shift", "revitalise", "heritage language", "language attrition", "immersion"] },
          { label: "Quyền lực & toàn cầu hoá", items: ["linguistic imperialism", "linguistic diversity", "cultural homogenisation", "monolingual", "loanword", "mutually intelligible"] },
          { label: "Sắc thái & cách nói", items: ["vernacular", "jargon", "connotation", "untranslatable", "articulate"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "language shift", pos: "n", ipa: "/ˈlæŋɡwɪdʒ ʃɪft/", vi: "sự chuyển ngữ của cả một cộng đồng (bỏ dần tiếng gốc sang ngôn ngữ chiếm ưu thế)", ex: "Language shift often takes three generations: the grandparents speak only the old language, the grandchildren only the new one.", exVi: "Chuyển ngữ thường diễn ra trong ba thế hệ: ông bà chỉ nói tiếng cũ, cháu chỉ nói tiếng mới.", more: "undergo language shift · nguyên nhân: school, jobs, migration · giai đoạn trước die out (vòng 1)" },
          { w: "revitalise", pos: "v", ipa: "/riːˈvaɪtəlaɪz/", vi: "hồi sinh, làm sống lại", ex: "Immersion schools have helped to revitalise several minority languages.", exVi: "Các trường dạy hoàn toàn bằng tiếng bản địa đã giúp hồi sinh nhiều ngôn ngữ thiểu số.", more: "language revitalisation · revitalise a town centre / the economy" },
          { w: "heritage language", pos: "n", ipa: "/ˈherɪtɪdʒ ˌlæŋɡwɪdʒ/", vi: "ngôn ngữ gốc của gia đình (khác ngôn ngữ của xã hội đang sống)", ex: "Many children of migrants understand their heritage language but cannot write it.", exVi: "Nhiều con em người di cư hiểu tiếng gốc của gia đình nhưng không viết được.", more: "heritage language classes · a heritage speaker · Part 3: Should parents insist that children keep it?" },
          { w: "language attrition", pos: "n", ipa: "/ˈlæŋɡwɪdʒ əˌtrɪʃn/", vi: "sự mai một dần khả năng một ngôn ngữ (ở một người)", ex: "After twenty years abroad, she noticed signs of attrition in her mother tongue.", exVi: "Sau hai mươi năm ở nước ngoài, bà nhận ra tiếng mẹ đẻ của mình đã mai một.", more: "first-language attrition · ≠ language shift (cả cộng đồng) · attrition = hao mòn dần" },
          { w: "immersion", pos: "n", ipa: "/ɪˈmɜːʃn/", vi: "học “ngâm mình” — dạy và sống hoàn toàn bằng ngôn ngữ đích", ex: "Total immersion is the fastest way to learn, but it can be exhausting.", exVi: "Ngâm mình hoàn toàn là cách học nhanh nhất, nhưng có thể rất mệt.", more: "an immersion school / programme · be immersed in" },
          { w: "linguistic imperialism", pos: "n", ipa: "/lɪŋˌɡwɪstɪk ɪmˈpɪəriəlɪzəm/", vi: "chủ nghĩa đế quốc ngôn ngữ (một ngôn ngữ lấn át các ngôn ngữ khác nhờ quyền lực)", ex: "Critics see the global spread of English as a form of linguistic imperialism.", exVi: "Người phê phán coi sự lan rộng toàn cầu của tiếng Anh là một dạng đế quốc ngôn ngữ.", more: "phản biện: many people choose English for opportunity, not only because it is imposed" },
          { w: "linguistic diversity", pos: "n", ipa: "/lɪŋˌɡwɪstɪk daɪˈvɜːsəti/", vi: "sự đa dạng ngôn ngữ", ex: "Linguistic diversity is greatest in regions where communities lived in isolation for centuries.", exVi: "Đa dạng ngôn ngữ cao nhất ở những vùng mà các cộng đồng sống biệt lập hàng thế kỷ.", more: "preserve / threaten linguistic diversity · cultural diversity (vòng 1)" },
          { w: "cultural homogenisation", pos: "n", ipa: "/ˈkʌltʃərəl həˌmɒdʒənaɪˈzeɪʃn/", vi: "sự đồng nhất hoá văn hoá", ex: "Some fear that global streaming services are leading to cultural homogenisation.", exVi: "Một số người lo các dịch vụ xem trực tuyến toàn cầu đang dẫn tới đồng nhất hoá văn hoá.", more: "homogenise (v) · homogeneous (adj) · phản biện: local cultures adapt global forms" },
          { w: "monolingual", pos: "adj", ipa: "/ˌmɒnəˈlɪŋɡwəl/", vi: "đơn ngữ (chỉ dùng một ngôn ngữ)", ex: "Monolingual speakers are probably a minority of the world's population.", exVi: "Người chỉ nói một ngôn ngữ có lẽ là thiểu số trong dân số thế giới.", more: "đối: bilingual / multilingual (vòng 1) · a monolingual dictionary (từ điển Anh – Anh)" },
          { w: "loanword", pos: "n", ipa: "/ˈləʊnwɜːd/", vi: "từ vay mượn", ex: "Vietnamese has loanwords from Chinese, French and, increasingly, English.", exVi: "Tiếng Việt có từ vay mượn từ tiếng Hán, tiếng Pháp và ngày càng nhiều từ tiếng Anh.", more: "borrow a word from · ví dụ: cà phê ← café · ga ← gare · Part 1 Language" },
          { w: "mutually intelligible", pos: "adj", ipa: "/ˌmjuːtʃuəli ɪnˈtelɪdʒəbl/", vi: "(hai ngôn ngữ) hiểu được lẫn nhau", ex: "The two dialects are mutually intelligible, though their spelling differs.", exVi: "Hai phương ngữ hiểu được lẫn nhau, dù cách viết khác nhau.", more: "intelligible · unintelligible · một tiêu chí phân biệt dialect và language (mục 4)" },
          { w: "vernacular", pos: "n / adj", ipa: "/vəˈnækjələ/", vi: "tiếng nói thường ngày của dân chúng (khác ngôn ngữ chính thức / học thuật)", ex: "The poet chose to write in the vernacular rather than in the formal language of the court.", exVi: "Nhà thơ chọn viết bằng tiếng nói của dân thay vì ngôn ngữ trang trọng của triều đình.", more: "in the vernacular · vernacular architecture (kiến trúc dân gian)" },
          { w: "jargon", pos: "n", ipa: "/ˈdʒɑːɡən/", vi: "biệt ngữ chuyên ngành (khó hiểu với người ngoài)", ex: "The report was so full of technical jargon that few readers understood it.", exVi: "Bản báo cáo đầy biệt ngữ kỹ thuật đến mức ít người đọc hiểu.", more: "legal / medical jargon · free of jargon · Part 1 Work: explain your job without jargon" },
          { w: "connotation", pos: "n", ipa: "/ˌkɒnəˈteɪʃn/", vi: "nghĩa hàm ẩn, sắc thái gợi ra", ex: "‘Cheap’ has negative connotations that ‘inexpensive’ does not.", exVi: "“Cheap” mang sắc thái tiêu cực mà “inexpensive” không có.", more: "positive / negative connotations · denotation (nghĩa gốc) · nối Tập 5 Ngày 6 (sắc thái)" },
          { w: "untranslatable", pos: "adj", ipa: "/ˌʌntrænzˈleɪtəbl/", vi: "không dịch được (bằng một từ tương đương)", ex: "Words described as untranslatable can usually be explained in a phrase.", exVi: "Những từ được gọi là không dịch được thường vẫn giải thích được bằng một cụm từ.", more: "lose something in translation · Part 3: Are some ideas impossible to translate?" },
          { w: "articulate", pos: "adj", ipa: "/ɑːˈtɪkjələt/", vi: "diễn đạt lưu loát, mạch lạc", ex: "She is an articulate speaker who can make complex ideas sound simple.", exVi: "Cô ấy nói năng mạch lạc, làm ý phức tạp nghe thành đơn giản.", more: "động từ articulate /ɑːˈtɪkjuleɪt/ (phát biểu rõ) · đối: inarticulate · Part 2 khen người" },
        ],
      },
      {
        t: "quiz", id: "t5d26-ngon-ngu", kind: "fill", title: "Language — điền MỘT từ hoặc cụm (5 câu)",
        items: [
          { q: "1. When parents stop speaking the old language at home, language ___ speeds up.", answers: ["shift"], hint: "language shift." },
          { q: "2. Saturday classes help children keep their ___ language.", answers: ["heritage"], hint: "heritage language." },
          { q: "3. ‘Slim’ and ‘skinny’ have very different ___.", answers: ["connotations"], hint: "connotations — số nhiều sau different." },
          { q: "4. Danish and Norwegian are largely mutually ___.", answers: ["intelligible"], hint: "mutually intelligible." },
          { q: "5. Doctors should explain diagnoses without medical ___.", answers: ["jargon"], hint: "jargon — không đếm được." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Books vòng 2 — 16 từ cho ngành xuất bản, thói quen đọc và cách KỂ về một cuốn sách" },
      { t: "p", text: "Phần này dạy trọn mục 3.6 “**N26 VC31 vòng 2**”. Vòng 1 (Tập 3 Ngày 28) có fiction, genre, page-turner, avid reader, read up on. Vòng 2 chia làm ba: từ của ==ngành== (để viết Task 2 về sách giấy, sách điện tử, tác giả), từ của ==thói quen đọc== (Task 2 / Part 3 về trẻ em, màn hình), và từ để ==kể== (Part 2 Describe a book / a film)." },
      {
        t: "sodo", kind: "mindmap", title: "Books vòng 2 — ba việc của từ vựng",
        center: "**Books** trong Task 2 / Part 2 / Part 3",
        branches: [
          { label: "Ngành xuất bản", items: ["manuscript", "self-publishing", "royalties", "out of print", "abridged", "readership"] },
          { label: "Thói quen đọc", items: ["deep reading", "reading for pleasure", "e-reader", "escapism"] },
          { label: "Kể về một cuốn sách", items: ["literary", "memoir", "anthology", "gripping", "cliffhanger", "dog-eared"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "manuscript", pos: "n", ipa: "/ˈmænjuskrɪpt/", vi: "bản thảo", ex: "The publisher rejected the manuscript three times before finally accepting it.", exVi: "Nhà xuất bản từ chối bản thảo ba lần rồi mới nhận.", more: "submit a manuscript · nghĩa lịch sử: bản chép tay (medieval manuscripts)" },
          { w: "self-publishing", pos: "n", ipa: "/ˌself ˈpʌblɪʃɪŋ/", vi: "tự xuất bản", ex: "Self-publishing allows authors to reach readers without a publisher's approval.", exVi: "Tự xuất bản cho phép tác giả tới với độc giả mà không cần nhà xuất bản duyệt.", more: "a self-published author · traditional publishing · lập luận: freedom vs no editorial quality control" },
          { w: "royalties", pos: "n (số nhiều)", ipa: "/ˈrɔɪəltiz/", vi: "tiền bản quyền (trả cho tác giả theo số bản bán)", ex: "Most authors earn only a small percentage of the cover price in royalties.", exVi: "Đa số tác giả chỉ nhận một phần trăm nhỏ của giá bìa dưới dạng tiền bản quyền.", more: "earn / receive royalties · Task 2 về sách lậu và sách điện tử" },
          { w: "out of print", pos: "phr", ipa: "/ˌaʊt əv ˈprɪnt/", vi: "hết in, không còn được xuất bản", ex: "The novel was out of print for decades before a small press rediscovered it.", exVi: "Cuốn tiểu thuyết hết in hàng chục năm trước khi một nhà xuất bản nhỏ tìm lại nó.", more: "go out of print · back in print · lập luận: an e-book need never go out of print" },
          { w: "abridged", pos: "adj", ipa: "/əˈbrɪdʒd/", vi: "(bản) rút gọn", ex: "The abridged edition cuts the novel to half its length.", exVi: "Bản rút gọn cắt cuốn tiểu thuyết còn một nửa.", more: "an abridged version · unabridged (bản đầy đủ) · ≠ adapted (mục 4)" },
          { w: "readership", pos: "n", ipa: "/ˈriːdəʃɪp/", vi: "lượng độc giả, nhóm độc giả", ex: "The magazine has a loyal but shrinking readership.", exVi: "Tạp chí có lượng độc giả trung thành nhưng đang co lại.", more: "a wide / young / growing readership · cùng khuôn: viewership, membership" },
          { w: "deep reading", pos: "n", ipa: "/ˌdiːp ˈriːdɪŋ/", vi: "đọc sâu (chậm, tập trung, suy ngẫm)", ex: "Some researchers worry that skimming on screens is crowding out deep reading.", exVi: "Một số nhà nghiên cứu lo việc đọc lướt trên màn hình đang lấn át việc đọc sâu.", more: "đối: skimming, scrolling · Task 2: Are screens changing the way we read?" },
          { w: "reading for pleasure", pos: "n", ipa: "/ˌriːdɪŋ fə ˈpleʒə/", vi: "đọc vì thích (không vì học, không vì việc)", ex: "Reading for pleasure in childhood is linked to a wider vocabulary in later life.", exVi: "Đọc vì thích khi còn nhỏ gắn với vốn từ rộng hơn về sau.", more: "read for pleasure · for its own sake · Part 1 Reading" },
          { w: "e-reader", pos: "n", ipa: "/ˈiː ˌriːdə/", vi: "máy đọc sách điện tử", ex: "An e-reader can hold thousands of books yet weighs less than a paperback.", exVi: "Một máy đọc sách chứa được hàng nghìn cuốn mà nhẹ hơn một cuốn bìa mềm.", more: "e-book (vòng 1) là SÁCH, e-reader là THIẾT BỊ · an e-ink screen" },
          { w: "escapism", pos: "n", ipa: "/ɪˈskeɪpɪzəm/", vi: "sự thoát ly thực tại (qua giải trí)", ex: "For many readers, fantasy offers a welcome form of escapism.", exVi: "Với nhiều độc giả, truyện giả tưởng là một cách thoát ly thực tại dễ chịu.", more: "escapist fiction · Part 3: Is escapism harmful or healthy?" },
          { w: "literary", pos: "adj", ipa: "/ˈlɪtərəri/", vi: "thuộc văn chương (nghiêm túc, chú trọng nghệ thuật viết)", ex: "Literary fiction tends to sell fewer copies than crime or romance.", exVi: "Tiểu thuyết văn chương thường bán ít hơn truyện trinh thám hay lãng mạn.", more: "a literary prize / critic / magazine · ≠ literal ≠ literate (mục 4)" },
          { w: "memoir", pos: "n", ipa: "/ˈmemwɑː/", vi: "hồi ký", ex: "Her memoir describes growing up on a fishing island in the 1970s.", exVi: "Hồi ký của bà kể chuyện lớn lên trên một hòn đảo đánh cá những năm 1970.", more: "write / publish a memoir · ≠ biography (vòng 1 — người khác viết) · autobiography (tự truyện cả đời)" },
          { w: "anthology", pos: "n", ipa: "/ænˈθɒlədʒi/", vi: "tuyển tập", ex: "The anthology brings together short stories by twenty young writers.", exVi: "Tuyển tập gom truyện ngắn của hai mươi cây bút trẻ.", more: "an anthology of poems / short stories · compile an anthology" },
          { w: "gripping", pos: "adj", ipa: "/ˈɡrɪpɪŋ/", vi: "cuốn hút, hồi hộp", ex: "The last hundred pages are so gripping that I read them in one sitting.", exVi: "Trăm trang cuối hấp dẫn đến mức tôi đọc một mạch.", more: "a gripping story / thriller · in one sitting · thay page-turner (vòng 1) để không lặp" },
          { w: "cliffhanger", pos: "n", ipa: "/ˈklɪfhæŋə/", vi: "đoạn kết bỏ lửng gây tò mò", ex: "Every chapter ends on a cliffhanger, so it is almost impossible to stop.", exVi: "Chương nào cũng kết bỏ lửng nên gần như không dừng được.", more: "end on a cliffhanger · dùng cả cho phim bộ" },
          { w: "dog-eared", pos: "adj", ipa: "/ˈdɒɡ ɪəd/", vi: "(sách) quăn mép vì đọc nhiều", ex: "I still have the dog-eared copy I read at fifteen.", exVi: "Tôi vẫn giữ cuốn sách quăn mép mà tôi đọc năm mười lăm tuổi.", more: "a dog-eared paperback · chi tiết cảm quan đắt giá cho Part 2 Describe a book" },
        ],
      },
      {
        t: "quiz", id: "t5d26-sach", kind: "fill", title: "Books — điền MỘT từ hoặc cụm (5 câu)",
        items: [
          { q: "1. Her first novel has been out of ___ for years.", answers: ["print"], hint: "out of print." },
          { q: "2. Thanks to ___, the author kept seventy per cent of the price instead of ten.", answers: ["self-publishing"], hint: "self-publishing." },
          { q: "3. Children who read for ___ tend to do better at school.", answers: ["pleasure"], hint: "read for pleasure." },
          { q: "4. The series is pure ___: dragons, castles and no bills to pay.", answers: ["escapism"], hint: "escapism." },
          { q: "5. The first season ended on a ___, so everyone watched the second.", answers: ["cliffhanger"], hint: "end on a cliffhanger." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Sáu cặp dễ nhầm" },
      {
        t: "table",
        head: ["Cặp", "Nghĩa", "Ví dụ đúng"],
        rows: [
          ["**literal / literary / literate**", "nghĩa đen · thuộc văn chương · biết đọc biết viết", "the literal meaning · a literary prize · a highly literate population"],
          ["**translator / interpreter**", "dịch VIẾT · dịch NÓI", "She translates novels; at the conference she worked as an interpreter."],
          ["**accent / dialect / language**", "cách PHÁT ÂM · biến thể có từ và ngữ pháp riêng · hệ thống riêng (thường không hiểu lẫn nhau)", "a strong northern accent · a dialect with its own words · two separate languages"],
          ["**abridged / adapted**", "cắt ngắn, giữ nguyên lời · chuyển thể (đổi hình thức: thành phim, thành sách thiếu nhi)", "an abridged audiobook · adapted for the screen"],
          ["**energy-efficient / energy-intensive**", "tiết kiệm năng lượng · tốn nhiều năng lượng", "energy-efficient appliances · energy-intensive industries"],
          ["**renewable / sustainable**", "không cạn (nói về NGUỒN) · duy trì lâu dài mà không gây hại (nói về CÁCH LÀM)", "Wood is renewable, but cutting forests faster than they grow is not sustainable."],
        ],
      },
      {
        t: "mcq", id: "t5d26-cap-de-nham", title: "Chọn từ đúng (6 câu)",
        items: [
          { q: "1. The phrase should not be taken in its ___ sense.", options: ["literal", "literary", "literate"], correct: 0, why: "literal sense = nghĩa đen." },
          { q: "2. At the press conference, the minister spoke through an ___.", options: ["translator", "interpreter"], correct: 1, why: "dịch nói trực tiếp ⇒ interpreter." },
          { q: "3. He speaks perfect English with a slight Scottish ___.", options: ["dialect", "accent"], correct: 1, why: "cách phát âm ⇒ accent." },
          { q: "4. The novel was ___ into a six-part television series.", options: ["abridged", "adapted"], correct: 1, why: "đổi hình thức sang phim ⇒ adapted." },
          { q: "5. Fishing at this rate is not ___: the stocks will collapse.", options: ["renewable", "sustainable"], correct: 1, why: "nói về CÁCH LÀM có duy trì được không ⇒ sustainable." },
          { q: "6. The country has one of the most ___ populations in the world: almost everyone can read.", options: ["literary", "literate"], correct: 1, why: "biết đọc biết viết ⇒ literate." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Kho ý hai phía cho sáu đề Task 2 / Part 3" },
      {
        t: "table",
        head: ["Đề (tự soạn)", "Một phía", "Phía kia", "Từ dùng"],
        rows: [
          ["Governments should pay households to install solar panels.", "microgeneration cuts bills, reduces peak demand on the grid, builds public support", "subsidies go mainly to home-owners who can already afford it; money better spent on offshore wind or on retrofitting the homes of the poor", "microgeneration · peak demand · fuel poverty · retrofit"],
          ["Nuclear power is the best answer to climate change.", "low-carbon, reliable baseload, small land use", "slow and expensive to build, nuclear waste, a single accident can turn public opinion", "baseload · nuclear waste · energy mix · stranded assets"],
          ["The spread of English is a threat to other languages.", "language shift, cultural homogenisation, children see their heritage language as useless", "people choose English for opportunity; bilingual speakers keep both; local languages borrow loanwords and adapt", "language shift · linguistic imperialism · heritage language · loanword"],
          ["Minority languages should be compulsory in local schools.", "only schools can stop language shift; immersion has revitalised languages", "pupils from other backgrounds are disadvantaged; compulsion can make a language feel like a burden", "immersion · revitalise · linguistic diversity"],
          ["Printed books will disappear within a generation.", "e-readers are cheaper, lighter, never go out of print; libraries are going digital", "print supports deep reading; people value the physical object; sales of paperbacks have held up better than predicted", "e-reader · deep reading · out of print · readership"],
          ["Schools should set aside time every day for reading for pleasure.", "reading for pleasure builds vocabulary and empathy; for many children, school is the only quiet place to read", "time is taken from core subjects; compulsory “pleasure” is a contradiction", "reading for pleasure · escapism · literary"],
        ],
        caption: "Mỗi đề: chọn một phía chính, mượn MỘT ý của phía kia để nhượng bộ (Ngày 25 Bài 1 mục 6). Không bịa số liệu.",
      },

      /* ── 6 ── */
      { t: "h", text: "6. Dùng ngay — dịch Việt → Anh (5 câu Task 2 / Part 3)" },
      {
        t: "quiz", id: "t5d26-tu-vung-dich", kind: "translate", grammar: "từ vòng 2 + một mệnh đề phụ",
        title: "Dịch sang tiếng Anh (5 câu)",
        items: [
          { q: "Nếu không có kho lưu điện quy mô lưới, điện gió không thể đáp ứng mức điện nền.", answers: ["Without grid-scale storage, wind power cannot provide baseload.", "Without grid-scale storage, wind power cannot meet baseload demand.", "Without grid-scale storage, wind power cannot provide baseload power.", "Without grid-scale storage, wind cannot provide baseload power."], hint: "grid-scale storage · baseload" },
          { q: "Giá năng lượng tăng đã đẩy nhiều gia đình vào cảnh nghèo năng lượng.", answers: ["Rising energy prices have pushed many families into fuel poverty.", "Rising energy prices have pushed many households into fuel poverty.", "Higher energy prices have pushed many families into fuel poverty.", "Rising energy costs have pushed many families into fuel poverty."], hint: "push sb into fuel poverty" },
          { q: "Khi trường học chỉ dạy bằng tiếng Anh, sự chuyển ngữ diễn ra nhanh hơn.", answers: ["When schools teach only in English, language shift happens faster.", "When schools teach only in English, language shift happens more quickly.", "When schools teach only in English, language shift takes place faster.", "When schools teach only in English, language shift speeds up."], hint: "language shift" },
          { q: "Nhiều từ được cho là không dịch được thật ra có thể giải thích bằng một cụm từ.", answers: ["Many words said to be untranslatable can actually be explained in a phrase.", "Many words that are said to be untranslatable can in fact be explained in a phrase.", "Many words described as untranslatable can actually be explained in a phrase.", "Many supposedly untranslatable words can actually be explained in a phrase."], hint: "untranslatable" },
          { q: "Đọc lướt trên màn hình có thể đang lấn át việc đọc sâu.", answers: ["Skimming on screens may be crowding out deep reading.", "Skimming on screen may be crowding out deep reading.", "Skimming on screens may be replacing deep reading.", "Skimming on screens could be crowding out deep reading."], hint: "crowd out · deep reading" },
        ],
      },
    ],
  },
  /* ════════════════ BÀI 2 — VIẾT: SPRINT TASK 1, 7 DẠNG × 20 PHÚT ════════════════ */
  {
    id: "t5d26-viet",
    kind: "writing",
    title: "Viết: Sprint Task 1 — 7 dạng × 20 phút (line có dự báo · bar · hai pie · table khác đơn vị · mixed · process · map), mỗi dạng một overview band 8",
    goal: "Viết được một bài Task 1 band 8 trong đúng 20 phút cho CẢ BẢY dạng — đọc hình trong 3 phút và trả lời bốn câu hỏi trước khi viết, có overview nêu đúng xu hướng / so sánh chính của từng dạng (không con số), chia thân bài theo đúng trục của dạng đó, chọn số liệu tiêu biểu, và còn 3 phút soát theo bản 4 lượt của Ngày 25.",
    minutes: 160,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đây là **sprint**: bảy đề, mỗi đề đúng 20 phút, theo đúng nhịp phòng thi. Không học dạng mới — mọi dạng đã dạy trọn ở Tập 3–5. Hôm nay luyện ==tốc độ ra quyết định==: overview nói gì, thân bài chia theo trục nào.",
          "Đẩy **Task Achievement** (overview rõ, chọn số đúng) và **Coherence & Cohesion** (nhóm thân bài hợp dạng). Band 7: “a clear overview… key features covered”. Band 8: “==clearly presents and highlights key features==” — tức là overview phải nói ĐIỀU QUAN TRỌNG NHẤT, không chỉ liệt kê xu hướng.",
          "Bảy dạng: line có năm dự báo · bar nhóm tuổi hai năm · hai pie · table nhiều đơn vị · mixed (line + pie) · process có vòng sửa · map hai mốc. Dạng line có bài mẫu ==band 7 và band 8 đặt cạnh nhau==.",
          "Cách làm khuyên dùng: hôm nay làm 3 dạng (line, table, process), mai 2, ngày kia 2. Mỗi dạng: 3 phút đọc → viết → 3 phút soát → mới mở overview mẫu để so.",
          "Số liệu và địa danh trong bảy hình đều là ==tự đặt cho bài luyện== (Country X, Calder Wharf, Regional Language R).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Nhịp 20 phút — và bốn câu hỏi trong 3 phút đầu" },
      {
        t: "sodo", kind: "flow", title: "20 phút Task 1",
        steps: [
          { label: "0–3′ đọc hình", sub: "trả lời 4 câu hỏi bên dưới, khoanh 6–8 con số" },
          { label: "3–5′ mở bài + overview", sub: "viết overview TRƯỚC thân bài" },
          { label: "5–17′ hai thân bài", sub: "mỗi khổ một trục; mỗi câu một ý + số" },
          { label: "17–20′ soát 4 lượt", sub: "thì · so sánh · giới từ của số · số khớp hình" },
        ],
      },
      {
        t: "table", caption: "Bốn câu hỏi trước khi viết (áp cho mọi dạng)",
        head: ["Câu hỏi", "Trả lời ra cái gì", "Đi vào đâu"],
        rows: [
          ["① Hình nói về CÁI GÌ, ĐƠN VỊ gì, KHI NÀO (có năm dự báo không)?", "câu mở bài + thì của bài", "mở bài (paraphrase, không chép đề)"],
          ["② Điều QUAN TRỌNG NHẤT là gì — nếu chỉ được nói một câu?", "ý số 1 của overview", "overview câu 1"],
          ["③ Điều quan trọng THỨ HAI (một so sánh, một ngoại lệ, một tổng)?", "ý số 2 của overview", "overview câu 2"],
          ["④ Chia thân bài theo trục nào (thời gian · nhóm · hình · khu vực · giai đoạn)?", "hai khổ thân bài", "thân 1 / thân 2"],
        ],
      },
      { t: "rule", formula: "3′ bốn câu hỏi  →  overview viết TRƯỚC  →  2 thân bài theo một trục  →  3′ soát", vi: "Overview là câu được chấm nặng nhất của Task 1. Viết nó khi đầu còn tỉnh, đừng để cuối." },

      /* ── 2 ── */
      { t: "h", text: "2. Bảy dạng trong một bảng — overview nói gì, thân bài chia theo gì" },
      {
        t: "table",
        head: ["Dạng", "Overview band 8 phải nói", "Chia thân bài theo", "Ngôn ngữ chìa khoá", "Bẫy band 7", "Ôn"],
        rows: [
          ["**Line** (có dự báo)", "xu hướng lớn nhất + điểm giao / thứ hạng thay đổi + tổng (nếu đáng nói)", "nhóm đường cùng xu hướng, hoặc quá khứ / dự báo", "peaked at · overtook · is projected to · dwindle", "kể từng năm; quên năm dự báo; will chắc nịch", "T3 N8 · T4 N6"],
          ["**Bar** (nhóm × năm)", "quy luật theo nhóm + thay đổi theo thời gian", "theo năm hoặc theo nhóm (chọn trục có quy luật rõ hơn)", "the higher the age, the lower… · widened · by contrast", "đọc lần lượt năm cột; không có so sánh", "T3 N12 · T4 N12"],
          ["**Pie** (hai năm)", "phần lớn nhất có giữ không + phần nào đổi nhiều nhất", "phần tăng / phần giảm", "accounted for · a third · doubled its share", "tả từng miếng; quên tổng = 100 %", "T3 N16 · T4 N18"],
          ["**Table** (nhiều đơn vị)", "cột nào chênh nhất + hàng nào đứng đầu ở mọi cột", "theo cột (đơn vị) — KHÔNG so ngang cột khác đơn vị", "by far · roughly twice · in every category", "chép cả bảng; so kWh với £", "T3 N20 · T4 N24"],
          ["**Mixed**", "mỗi hình một ý + mối nối hai hình (nếu có)", "mỗi khổ một hình", "meanwhile · as for · the latter", "hai overview rời; tả hình 2 bằng thì của hình 1", "T3 N24 · T5 N6"],
          ["**Process**", "số bước + đầu vào → sản phẩm + điểm đặc biệt (vòng lặp, hai giai đoạn)", "theo giai đoạn / nơi chốn", "before being V3 · once · which is then", "câu không động từ; then… then…", "T3 N28 · T5 N12"],
          ["**Map** (hai mốc)", "thay đổi tổng thể (công năng) + cái giữ nguyên", "khu vực (bắc / nam) hoặc giữ – đổi – mới", "was converted into · made way for · remained", "đi từng ô; sai phương hướng", "T3 N28 · T5 N18"],
        ],
      },

      /* ── 3: LINE ── */
      { t: "h", text: "3. Sprint 1 — Line graph có năm dự báo (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "line",
          title: "Electricity generated by source in Country X, 2000–2035 (2030 and 2035 projected)",
          note: "Số liệu tự đặt cho bài luyện (Country X là nước hư cấu).",
          unit: "terawatt-hours (TWh)",
          categories: ["2000", "2005", "2010", "2015", "2020", "2025", "2030*", "2035*"],
          series: [
            { name: "Coal", values: [120, 125, 110, 85, 50, 30, 15, 5] },
            { name: "Gas", values: [40, 55, 70, 80, 85, 75, 60, 45] },
            { name: "Wind and solar", values: [2, 5, 12, 30, 55, 85, 120, 150] },
          ],
        },
      },
      { t: "p", text: "**Đề:** The graph shows the amount of electricity generated from three sources in Country X between 2000 and 2025, with projections for 2030 and 2035. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words." },
      {
        t: "table", caption: "3 phút đầu — bốn câu trả lời",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["① cái gì, đơn vị, khi nào", "điện theo nguồn, TWh, 2000–2025 + dự báo 2030, 2035 ⇒ quá khứ cho 2000–2025, is projected / expected cho 2030–2035"],
          ["② điều quan trọng nhất", "cơ cấu đảo ngược: than từ nguồn số 1 về gần 0; gió + mặt trời từ gần 0 lên số 1"],
          ["③ điều quan trọng thứ hai", "TỔNG gần như không đổi (~160 → 200) — chỉ có cơ cấu đổi; khí đi lên rồi xuống (đỉnh 2020)"],
          ["④ chia thân bài", "khổ 1: than + khí (hai nguồn hoá thạch, đều có đỉnh rồi giảm) · khổ 2: gió + mặt trời (tăng liên tục, hai mốc vượt)"],
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 7 (ước tính) — 178 từ",
        paras: [
          { text: "The line graph shows the amount of electricity which was generated from coal, gas and wind and solar in Country X from 2000 to 2035." },
          { text: "Overall, coal decreased and wind and solar increased, while gas went up and then went down." },
          { text: "In 2000, coal produced 120 TWh, which was much more than gas (40 TWh) and wind and solar (2 TWh). Coal increased slightly to 125 TWh in 2005, but after that it decreased dramatically to 30 TWh in 2025 and it will decrease to only 5 TWh in 2035. Gas increased from 40 TWh to 85 TWh in 2020. After that it decreased to 75 TWh in 2025 and it will decrease to 45 TWh in 2035." },
          { text: "Wind and solar increased very slowly at first and reached 12 TWh in 2010. Then it increased quickly and reached 85 TWh in 2025, which was higher than coal and gas. In 2035 it will be 150 TWh, which is the highest number in the graph." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 196 từ",
        paras: [
          { text: "The graph compares how much electricity Country X generated from coal, gas, and wind and solar power between 2000 and 2025, together with projections for 2030 and 2035." },
          { text: "Overall, the country's energy mix has been transformed: coal, initially the dominant source, has been in steep decline and is expected almost to disappear, whereas wind and solar have risen from a negligible base to become the largest source, a lead they are forecast to extend. Total generation, meanwhile, has remained relatively stable at around 190–200 TWh since 2010." },
          { text: "Coal generation peaked at 125 TWh in 2005 before falling steadily to just 30 TWh by 2025, and it is projected to dwindle to a mere 5 TWh by 2035. Gas followed a different path, more than doubling from 40 TWh to a peak of 85 TWh in 2020; it has since begun to fall and is predicted to drop to 45 TWh, close to its level at the start of the period." },
          { text: "Wind and solar, by contrast, produced only 2 TWh in 2000 and grew modestly over the first decade. Growth then accelerated sharply: renewables overtook coal around 2020 and gas by 2025, when they supplied 85 TWh. By 2035 they are expected to generate 150 TWh, three-quarters of the projected total." },
        ],
      },
      {
        t: "table", caption: "Band 7 ↔ band 8 — cùng một hình, khác ở đâu",
        head: ["Tiêu chí", "Band 7", "Band 8", "Động tác để học"],
        rows: [
          ["**TA**", "overview chỉ liệt kê ba xu hướng; không nói tổng, không nói thứ hạng đổi; năm dự báo viết bằng will như sự thật", "overview nói ĐIỀU LỚN NHẤT (cơ cấu đảo ngược) + điều thứ hai (tổng ổn định); hai mốc vượt; dự báo có rào đón", "câu ② và ③ của 3 phút đầu chính là hai câu overview"],
          ["**CC**", "đi lần lượt từng đường; khổ 2 mở bằng Then", "khổ 1 = hai nguồn hoá thạch (cùng kiểu đỉnh rồi giảm); khổ 2 = tái tạo; nối bằng by contrast, meanwhile", "chia thân bài theo NHÓM xu hướng, không theo thứ tự chú thích"],
          ["**LR**", "increase / decrease lặp 9 lần; “the highest number in the graph”", "peaked · dwindle to a mere · more than doubling · accelerated sharply · overtook · a negligible base · three-quarters of the projected total", "mỗi động từ xu hướng dùng tối đa hai lần"],
          ["**GRA**", "câu đơn + which; “wind and solar… it” (sai tham chiếu số nhiều); will cho dự báo", "hiện tại hoàn thành cho xu hướng kéo tới nay (has been in steep decline); bị động dự báo (is projected to); mệnh đề phân từ (more than doubling…)", "2000–2025: quá khứ đơn / hiện tại hoàn thành · 2030–2035: is expected / projected / forecast to"],
        ],
      },
      { t: "rule", formula: "overview = điều lớn nhất (đảo ngược / vượt / đỉnh) + điều thứ hai (tổng / ngoại lệ)   ·   dự báo: is projected / expected / forecast to + V", vi: "Line có dự báo: hai thì trong một bài — quá khứ (hoặc hiện tại hoàn thành) cho số đã có, bị động dự báo cho năm có dấu *." },
      {
        t: "essay", id: "t5d26-viet-1-line", task: "Task 1", minWords: 150,
        prompt: "The graph shows the amount of electricity generated from coal, gas, and wind and solar power in Country X between 2000 and 2025, with projections for 2030 and 2035 (see the line graph above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes. Write your own version WITHOUT copying the band 8 sample: change the grouping of the body paragraphs or the order of ideas.",
        tips: [
          "Overview hai câu, không con số.",
          "Mỗi động từ xu hướng tối đa hai lần.",
          "Năm có dấu * ⇒ is projected / expected / forecast to.",
          "3 phút cuối: thì · so sánh · giới từ của số (to / by / at / of) · số khớp hình.",
        ],
      },

      /* ── 4: BAR ── */
      { t: "h", text: "4. Sprint 2 — Bar chart nhóm tuổi × hai năm (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "bar",
          title: "Adults able to hold a conversation in at least one foreign language, by age group, 2004 and 2024 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          unit: "%",
          categories: ["16–24", "25–39", "40–54", "55–69", "70+"],
          series: [
            { name: "2004", values: [38, 31, 24, 17, 9] },
            { name: "2024", values: [61, 44, 29, 20, 14] },
          ],
        },
      },
      {
        t: "table", caption: "3 phút đầu",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["①", "% người lớn nói chuyện được bằng ít nhất một ngoại ngữ, 5 nhóm tuổi, 2004 và 2024 ⇒ quá khứ đơn"],
          ["②", "cả hai năm: càng lớn tuổi tỉ lệ càng thấp — quy luật đều, không ngoại lệ"],
          ["③", "mọi nhóm đều tăng, nhưng phần tăng dồn vào người trẻ (+23 điểm ở 16–24, chỉ +3 đến +5 ở nhóm trên 40) ⇒ khoảng cách trẻ – già nới rộng (29 → 47 điểm)"],
          ["④", "khổ 1: năm 2004 (quy luật theo tuổi) · khổ 2: thay đổi tới 2024 (ai tăng nhiều, ai tăng ít)"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính) — 2 câu, để so SAU khi đã viết",
        items: [
          "Overall, the ability to converse in a foreign language declined steadily with age in both years. Although every age group improved over the period, the gains were concentrated among younger adults, so the gap between the youngest and the oldest groups widened considerably.",
          "Soi: quy luật (declined steadily with age) + thay đổi (every group improved… concentrated among younger adults) + hệ quả (gap widened). Không con số. “converse” thay “hold a conversation” — paraphrase đề.",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-2-bar", task: "Task 1", minWords: 150,
        prompt: "The chart shows the percentage of adults in one country who were able to hold a conversation in at least one foreign language, by age group, in 2004 and 2024 (see the bar chart above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes.",
        tips: [
          "Dùng một câu “the + so sánh hơn…, the + so sánh hơn…” cho quy luật theo tuổi.",
          "Phần tăng tính bằng ĐIỂM phần trăm (percentage points), không phải %: 38 → 61 là tăng 23 điểm.",
          "Khổ 2 nên có một câu về khoảng cách trẻ – già (widened from… to…).",
        ],
      },

      /* ── 5: PIE ── */
      { t: "h", text: "5. Sprint 3 — Hai pie chart theo năm (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Books bought in one country, by format, 2010 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Paperback (new)", value: 52 },
            { label: "Hardback (new)", value: 24 },
            { label: "Second-hand", value: 12 },
            { label: "E-book", value: 9 },
            { label: "Audiobook", value: 3 },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Books bought in one country, by format, 2025 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Paperback (new)", value: 41 },
            { label: "E-book", value: 17 },
            { label: "Hardback (new)", value: 15 },
            { label: "Second-hand", value: 14 },
            { label: "Audiobook", value: 13 },
          ],
        },
      },
      {
        t: "table", caption: "3 phút đầu",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["①", "tỉ lệ sách mua theo định dạng, 2010 và 2025 ⇒ quá khứ đơn"],
          ["②", "sách in vẫn chiếm phần lớn (bìa mềm vẫn đứng đầu), nhưng phần của sách in mới giảm từ 76 % xuống 56 %"],
          ["③", "định dạng số (e-book + sách nói) tăng từ 12 % lên 30 %; sách nói tăng mạnh nhất (gấp hơn bốn lần); bìa cứng giảm mạnh nhất"],
          ["④", "khổ 1: các phần GIẢM (bìa mềm, bìa cứng) · khổ 2: các phần TĂNG (e-book, sách nói, sách cũ tăng nhẹ)"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính)",
        items: [
          "Overall, new printed books remained the most popular format throughout, with paperbacks the single largest category in both years. However, their combined share fell markedly, while digital formats, and audiobooks in particular, gained considerable ground.",
          "Soi: điều giữ nguyên (paperback đứng đầu) + điều đổi (sách in mất phần, số lên). in particular chỉ ra phần đổi mạnh nhất mà không cần số.",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-3-pie", task: "Task 1", minWords: 150,
        prompt: "The two pie charts show the proportion of books bought in different formats in one country in 2010 and 2025 (see the two pie charts above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes.",
        tips: [
          "Gộp có lý do: new print (paperback + hardback) 76 % → 56 %; digital (e-book + audiobook) 12 % → 30 %.",
          "Sách nói 3 % → 13 %: “more than quadrupled its share”.",
          "Đừng viết “the percentage of second-hand increased” — second-hand là tính từ: the share of second-hand books.",
        ],
      },

      /* ── 6: TABLE ── */
      { t: "h", text: "6. Sprint 4 — Table nhiều đơn vị (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "table",
          title: "Average annual energy use and cost in four types of home in one country, 2025",
          note: "Số liệu tự đặt cho bài luyện. Ba cột đầu tính bằng kWh, cột cuối bằng bảng Anh (£).",
          categories: ["Heating (kWh)", "Hot water (kWh)", "Appliances & lighting (kWh)", "Average annual bill (£)"],
          series: [
            { name: "Flat built after 2010", values: [2900, 1600, 1800, 1150] },
            { name: "Flat built before 1950", values: [7400, 1900, 1700, 1980] },
            { name: "Terraced house", values: [9800, 2300, 2400, 2650] },
            { name: "Detached house", values: [14600, 2700, 3100, 3700] },
          ],
        },
      },
      {
        t: "table", caption: "3 phút đầu",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["①", "năng lượng (kWh) và hoá đơn (£) trung bình/năm, 4 loại nhà, 2025 ⇒ quá khứ đơn hoặc hiện tại đơn (năm đơn lẻ — chọn một, giữ suốt bài)"],
          ["②", "sưởi là khoản lớn nhất ở mọi loại nhà và chênh nhiều nhất (2.900 → 14.600, gấp 5); hai khoản kia khá sát nhau"],
          ["③", "nhà riêng (detached) đứng đầu mọi cột; tuổi nhà quan trọng ngang loại nhà: căn hộ cũ cần sưởi gấp khoảng 2,5 lần căn hộ mới"],
          ["④", "khổ 1: sưởi (cột chênh nhất) · khổ 2: nước nóng + thiết bị, rồi hoá đơn (đơn vị £ — không so ngang với kWh)"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính) — và bẫy đơn vị",
        items: [
          "Overall, heating accounted for by far the largest share of energy use in every type of home and varied far more than any other category, so it largely determined the size of the bill. Detached houses used the most energy and cost the most to run, while the age of a building appears to have mattered almost as much as its type.",
          "⚠️ Bẫy: ~~the bill of a detached house (£3,700) was higher than its hot water use (2,700 kWh)~~ — hai đơn vị khác nhau không so được. So TRONG một cột, hoặc nói quan hệ (the bills followed the same pattern as heating).",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-4-table", task: "Task 1", minWords: 150,
        prompt: "The table shows the average annual energy use for heating, hot water, and appliances and lighting, together with the average annual energy bill, for four types of home in one country in 2025 (see the table above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes.",
        tips: [
          "Chọn 6–8 con số, đừng chép cả 16.",
          "Phép so sánh bội: roughly five times as much as · about two and a half times.",
          "Không so cột kWh với cột £.",
        ],
      },

      /* ── 7: MIXED ── */
      { t: "h", text: "7. Sprint 5 — Mixed: line + pie (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "line",
          title: "Pupils in schools teaching mainly through Regional Language R, 1990–2025 (thousands)",
          note: "Số liệu tự đặt cho bài luyện (Regional Language R là ngôn ngữ hư cấu).",
          unit: "thousand pupils",
          categories: ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2025"],
          series: [{ name: "Pupils", values: [4, 6, 9, 15, 22, 30, 36, 41] }],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Main reason parents gave for choosing such a school, 2025 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "For the child to learn the family's heritage language", value: 34 },
            { label: "Good exam results", value: 22 },
            { label: "Advantages of bilingualism for future jobs", value: 19 },
            { label: "Smaller classes", value: 18 },
            { label: "Other", value: 7 },
          ],
        },
      },
      {
        t: "table", caption: "3 phút đầu",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["①", "hình 1: số học sinh (nghìn), 1990–2025 · hình 2: lý do chính của phụ huynh (%), 2025"],
          ["②", "hình 1: tăng gấp khoảng mười lần, đều đặn, nhanh hơn sau 2000"],
          ["③", "hình 2: lý do di sản đứng đầu (một phần ba), nhưng ba lý do THỰC DỤNG cộng lại chiếm gần 60 %"],
          ["④", "khổ 1: hình 1 · khổ 2: hình 2 — một câu nối: the reasons behind this growth"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính)",
        items: [
          "Overall, enrolment in schools teaching through Regional Language R rose roughly tenfold over the period, with growth accelerating after 2000. Although the wish to pass on a heritage language was the most common single reason for choosing such a school, practical considerations such as results, class size and career prospects together outweighed it.",
          "Soi: mỗi hình một ý; câu 2 dùng Although để NỐI hai hình bằng một nhận xét — chỗ mixed band 8 hơn band 7.",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-5-mixed", task: "Task 1", minWords: 150,
        prompt: "The line graph shows the number of pupils in schools teaching mainly through Regional Language R between 1990 and 2025. The pie chart shows the main reason parents gave for choosing such a school in 2025 (see the two charts above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes.",
        tips: [
          "Mở bài hai vế: hình 1 cho thấy…, hình 2 cho thấy…",
          "Hình 1: quá khứ đơn / hiện tại hoàn thành; hình 2 (một năm): quá khứ đơn.",
          "Một câu nối hai hình ở overview hoặc đầu khổ 2.",
        ],
      },

      /* ── 8: PROCESS ── */
      { t: "h", text: "8. Sprint 6 — Process có vòng sửa (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How an audiobook is produced",
          note: "Sơ đồ tự dựng cho bài luyện, giản lược. “Khoảng 6 giờ phòng thu cho 1 giờ thành phẩm” là số minh hoạ.",
          steps: [
            { label: "Rights agreed, narrator chosen", note: "publisher and author approve the voice" },
            { label: "Script preparation", note: "narrator reads the book; marks names and difficult pronunciations" },
            { label: "Recording", note: "in a sound booth · about 6 studio hours per finished hour" },
            { label: "Editing", note: "long pauses, breaths and mistakes removed" },
            { label: "Proof-listening", note: "audio checked against the text · errors found → re-recorded (back to Recording)" },
            { label: "Mastering", note: "volume levelled to the required standard" },
            { label: "Distribution", note: "files uploaded to online stores and library services" },
          ],
        },
      },
      {
        t: "table", caption: "3 phút đầu",
        head: ["Câu hỏi", "Trả lời"],
        rows: [
          ["①", "quy trình làm sách nói ⇒ hiện tại đơn, bị động"],
          ["②", "bảy bước, từ thoả thuận bản quyền tới phát hành; phần lõi là sản xuất âm thanh (thu – biên tập – nghe soát)"],
          ["③", "có MỘT vòng lặp: lỗi tìm thấy khi nghe soát được thu lại trước khi sang bước hoàn thiện (mastering)"],
          ["④", "khổ 1: chuẩn bị + thu (bước 1–3) · khổ 2: hậu kỳ + phát hành (bước 4–7, có vòng lặp)"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính)",
        items: [
          "Overall, producing an audiobook involves seven stages, beginning with an agreement over rights and ending with distribution, and most of the work lies in recording and refining the audio. The process is not entirely linear, since any errors identified at the checking stage are sent back to be recorded again.",
          "Soi: số bước + điểm đầu – điểm cuối + phần lõi + điều ĐẶC BIỆT (vòng lặp). “not entirely linear” = cách band 8 gọi tên vòng lặp.",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-6-process", task: "Task 1", minWords: 150,
        prompt: "The diagram shows the stages in the production of an audiobook (see the process diagram above). Summarise the information by selecting and reporting the main features. Write at least 150 words. — 20 minutes.",
        tips: [
          "Bị động hiện tại đơn suốt bài; rút gọn bằng after / before being V3.",
          "Gọi tên vòng lặp bằng một câu riêng: If any errors are found, the relevant sections are re-recorded before…",
          "Con số duy nhất (6 giờ / 1 giờ) phải có mặt.",
        ],
      },

      /* ── 9: MAP ── */
      { t: "h", text: "9. Sprint 7 — Map hai mốc (20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Calder Wharf, 1990",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 0.3, w: 14, h: 1.2, label: "Canal" },
              { x: 0, y: 8.8, w: 14, h: 0.9, label: "Mill Lane" },
            ],
            boxes: [
              { x: 0.5, y: 2, w: 7, h: 4, label: "Printing works" },
              { x: 8, y: 2, w: 5.5, h: 2.6, label: "Paper warehouse" },
              { x: 8, y: 5, w: 5.5, h: 3.4, label: "Lorry park" },
              { x: 0.5, y: 6.5, w: 4, h: 1.9, label: "Offices" },
              { x: 4.9, y: 6.5, w: 2.6, h: 1.9, label: "Staff car park" },
            ],
            pins: [{ x: 7.7, y: 1.7, label: "Loading quay" }],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Calder Wharf, today",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 0.3, w: 14, h: 1.2, label: "Canal" },
              { x: 0, y: 1.55, w: 14, h: 0.35, label: "Towpath (new)" },
              { x: 0, y: 8.8, w: 14, h: 0.9, label: "Mill Lane" },
            ],
            boxes: [
              { x: 0.5, y: 2.2, w: 3.4, h: 3.8, label: "Bookshop and café (former print hall)" },
              { x: 4.1, y: 2.2, w: 3.4, h: 3.8, label: "Flats" },
              { x: 8, y: 2.2, w: 5.5, h: 2.4, label: "Language school (former warehouse)" },
              { x: 8, y: 5, w: 3.2, h: 3.4, label: "Public square" },
              { x: 11.4, y: 5, w: 2.1, h: 3.4, label: "Cycle parking" },
              { x: 0.5, y: 6.5, w: 4, h: 1.9, label: "Garden" },
              { x: 4.9, y: 6.5, w: 2.6, h: 1.9, label: "Residents' car park" },
            ],
            pins: [{ x: 7.7, y: 0.9, label: "Footbridge (new)" }],
          },
        },
      },
      {
        t: "table", caption: "3 phút đầu — phân loại trước khi viết",
        head: ["Loại", "Ở Calder Wharf", "Khuôn hợp"],
        rows: [
          ["**Giữ nguyên**", "kênh · Mill Lane · vị trí bãi xe (nay cho cư dân)", "remained · is still in place · continues to serve"],
          ["**Giữ vỏ, đổi công năng**", "xưởng in → hiệu sách + café và căn hộ · kho giấy → trường ngoại ngữ", "was converted into · now houses · has been divided into"],
          ["**Phá đi / thay thế**", "khối văn phòng → vườn · bãi xe tải → quảng trường + chỗ để xe đạp", "made way for · was replaced by · was cleared to create"],
          ["**Mới hoàn toàn**", "cầu đi bộ qua kênh (thay bến bốc hàng) · lối đi ven kênh", "a new footbridge now spans the canal · was added along the canal"],
        ],
      },
      {
        t: "note", title: "📌 Overview band 8 (ước tính)",
        items: [
          "Overall, Calder Wharf has been transformed from an industrial site into a mixed residential, educational and leisure area. While the two main buildings have survived, both have been put to new uses, and the spaces once given over to lorries and offices are now open to the public; access from the canal side has also been improved.",
          "Soi: thay đổi tổng thể (industrial → mixed) + cái giữ nguyên (hai toà chính) + kiểu thay đổi (đổi công năng, mở ra cho công chúng). Bản đồ có năm hiện tại ⇒ hiện tại hoàn thành cho thay đổi.",
        ],
      },
      {
        t: "essay", id: "t5d26-viet-7-map", task: "Task 1", minWords: 150,
        prompt: "The maps show Calder Wharf, an area beside a canal, in 1990 and today (see the two maps above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes.",
        tips: [
          "Chia thân bài theo khu vực: phía tây (xưởng in, văn phòng, bãi xe) · phía đông (kho, bãi xe tải) + bờ kênh.",
          "Hiện tại hoàn thành bị động: has been converted into · have been replaced by.",
          "Phương hướng: in the western half · on the eastern side · along the canal · to the south of.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Sau sprint — tự chấm bảy bài trong một bảng" },
      {
        t: "table",
        head: ["Kiểm", "Đạt band 8 khi", "Bài nào chưa đạt?"],
        rows: [
          ["Thời gian", "xong cả bài + soát trong 20 phút", "…"],
          ["Overview", "hai câu, không số, nói ĐIỀU LỚN NHẤT + điều thứ hai", "…"],
          ["Trục thân bài", "đúng trục của dạng (bảng mục 2)", "…"],
          ["Số liệu", "6–8 số tiêu biểu, đúng giới từ (rise BY / TO, stand AT, a share OF)", "…"],
          ["Lỗi", "tối đa 1–2 câu có lỗi nhỏ (soát 4 lượt của Ngày 25)", "…"],
        ],
        caption: "Dạng nào trượt từ 2 dòng: làm lại dạng đó lần hai vào Ngày 28 (cạnh bài Two-part), đổi trục thân bài.",
      },
      { t: "rule", formula: "line / bar: quy luật + thay đổi · pie: cái giữ + cái đổi · table: cột chênh nhất + hàng đứng đầu · mixed: mỗi hình một ý + câu nối · process: số bước + vòng đặc biệt · map: công năng tổng thể + cái giữ nguyên", vi: "Bảy công thức overview — thuộc lòng để không mất 3 phút đầu." },
      {
        t: "mcq", id: "t5d26-viet-kiem", title: "Kiểm tra cuối bài (6 câu)",
        items: [
          { q: "1. Overview nào tốt nhất cho Sprint 1 (line)?", options: ["Overall, coal went down, gas went up and down, and wind and solar went up.", "Overall, the energy mix was transformed, with renewables replacing coal as the main source, while total generation stayed broadly stable.", "Overall, wind and solar reached 150 TWh in 2035, the highest figure."], correct: 1, why: "Nói điều lớn nhất (đảo ngược cơ cấu) + điều thứ hai (tổng ổn định), không số. Phương án 1 chỉ liệt kê; phương án 3 có số và chỉ một chi tiết." },
          { q: "2. Câu nào đúng cho năm dự báo 2035?", options: ["Coal will fall to 5 TWh in 2035.", "Coal is projected to fall to 5 TWh by 2035.", "Coal fell to 5 TWh in 2035."], correct: 1, why: "Dự báo ⇒ is projected to; by 2035. will chắc nịch là lỗi TA band 7." },
          { q: "3. Ở Sprint 4 (table), câu nào SAI về logic?", options: ["Heating use in detached houses was roughly five times that of new flats.", "The bill for a detached house (£3,700) was higher than its hot-water use (2,700 kWh).", "Detached houses had the highest figures in every column."], correct: 1, why: "So £ với kWh — hai đơn vị khác nhau." },
          { q: "4. Câu nào gọi đúng vòng lặp ở Sprint 6 (process)?", options: ["Then it goes back.", "The process is not entirely linear, since errors found at the checking stage are re-recorded.", "Step 5 goes to step 3."], correct: 1, why: "Gọi tên vòng lặp bằng một câu đủ, không dùng số bước của sơ đồ." },
          { q: "5. Ở Sprint 7 (map), câu nào đúng?", options: ["The warehouse converted into a language school.", "The warehouse has been converted into a language school.", "The warehouse was converting to a language school."], correct: 1, why: "Toà nhà bị chuyển đổi ⇒ bị động; có “today” ⇒ hiện tại hoàn thành." },
          { q: "6. 38 % → 61 %: câu nào chính xác nhất?", options: ["The figure rose by 23 %.", "The figure rose by 23 percentage points.", "The figure rose 23 times."], correct: 1, why: "Chênh lệch giữa hai tỉ lệ = percentage points. “by 23 %” nghĩa là tăng 23 % CỦA 38 (thành khoảng 47 %)." },
        ],
      },
    ],
  },
  /* ════════════════ BÀI 3 — NÓI: SPRINT PART 2, 12 ĐỀ HAY GẶP ════════════════ */
  {
    id: "t5d26-noi",
    kind: "speaking",
    title: "Nói: Sprint Part 2 — 12 đề hay gặp, 1 phút chuẩn bị (bốn ô ghi chú · kho 4 chuyện phủ 12 thẻ · bài mẫu band 7 và band 8 · 3 vòng × 4 thẻ + Part 3)",
    goal: "Với bất kỳ thẻ nào trong 12 đề hay gặp (người · nơi chốn · đồ vật · sự kiện · tình huống “a time when” · phim / nhạc), dùng đúng 1 phút để chọn một chuyện thật từ kho và ghi bốn ô chữ khoá, rồi nói trọn 2 phút ở band 8 — mở thẳng vào chuyện, có một chi tiết giác quan và một câu thoại, đổi thì theo việc, kết bằng một câu “nhìn lại” xuống giọng — và nối sang Part 3 không gãy.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Sprint**, không học khung mới: khung Part 2 band 8 đã có ở Tập 5 Ngày 7 (giọng kể), Ngày 14 (đề hiếm, chặng “nhìn lại”), Ngày 17 (ống kính, ngữ điệu kể chuyện). Hôm nay luyện ==tốc độ== — 1 phút chuẩn bị, 12 thẻ liền.",
          "Đẩy **Fluency & Coherence** (không ngừng quá 3 giây, nói đủ 2 phút) và **Lexical Resource** (chi tiết cụ thể thay tính từ chung). Ở band 8, thứ phân biệt không phải từ khó mà là ==câu chuyện thật, cụ thể==.",
          "12 thẻ chia sáu loại, mỗi loại hai thẻ. Bạn KHÔNG cần 12 chuyện: mục 4 cho một ==kho 4 chuyện phủ cả 12 thẻ== (nối kho 5 chuyện của Tập 4 Ngày 30).",
          "Mục 3: cùng một thẻ (a journey you remember well), bản band 7 và bản band 8 đặt cạnh nhau, chấm theo bốn tiêu chí.",
          "🔊 Nhấn câu mở và câu chốt; từ khó của 12 thẻ (photograph / photographer, comfortable, restaurant). Sau đó: 3 vòng × 4 thẻ có ghi âm + 5 câu Part 3.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Một phút chuẩn bị làm gì — bốn ô ghi chú" },
      {
        t: "sodo", kind: "flow", title: "60 giây trước khi nói",
        steps: [
          { label: "0–10″ chọn chuyện", sub: "lấy từ kho 4 chuyện — KHÔNG nghĩ chuyện mới" },
          { label: "10–35″ ô 1–2", sub: "ai / ở đâu / khi nào · cảnh chính (một khoảnh khắc)" },
          { label: "35–50″ ô 3", sub: "một chi tiết giác quan + một câu thoại" },
          { label: "50–60″ ô 4", sub: "câu “nhìn lại” = ý explain why của thẻ" },
        ],
      },
      {
        t: "table", caption: "Ví dụ — ghi chú thật cho thẻ “a photograph that means a lot to you” (14 chữ, tiếng Anh)",
        head: ["Ô", "Ghi", "Khi nói thành"],
        rows: [
          ["① ai · đâu · khi nào", "grandad + me · Huế station · 2009", "It's a photo a stranger took of my grandfather and me at Huế station, back in 2009."],
          ["② cảnh chính", "train window · his old cap", "We're leaning out of the train window, and he's wearing this faded green cap he'd had since the seventies."],
          ["③ giác quan + thoại", "squinting · “Smile, it's free”", "We're both squinting into the sun, and I remember him saying, “Smile, it's free.”"],
          ["④ nhìn lại", "only photo of trip · he can't travel now", "It's the only picture from that trip, and since he can't travel any more, it's become a kind of record of who he was then."],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — ghi chú bằng tiếng Anh, không quá 15 chữ",
        items: [
          "Ghi tiếng Việt rồi dịch trong đầu khi nói = hai việc cùng lúc ⇒ ngập ngừng. Ghi luôn chữ tiếng Anh bạn sẽ nói.",
          "Không viết câu. Mỗi ô 3–5 chữ. Thẻ có 4 dòng gợi ý nhưng ghi chú của bạn đi theo ==câu chuyện==, không theo 4 dòng: nói đủ 4 ý là đủ.",
          "Ô 4 viết TRƯỚC nếu bí: biết mình kết ở đâu thì không bị cạn ý ở phút 1:40.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. 12 đề hay gặp theo sáu loại" },
      { t: "p", text: "Mười hai thẻ dưới là ==chủ đề hay gặp== nhưng chưa có thẻ nào trùng với Tập 3–5 và Đề 1–12 của khoá. Cột “câu mở” cho thấy cách vào thẳng chuyện ở band 8 — không mở bằng “I'm going to talk about…”." },
      {
        t: "table",
        head: ["#", "Thẻ (rút gọn)", "Loại", "Câu mở band 8 (gợi ý)", "Bẫy band 7"],
        rows: [
          ["1", "a famous person you would like to meet", "người", "The person I'd most like to sit down with is…, and not for the reason you might expect.", "kể tiểu sử như Wikipedia; không có ý “nói chuyện gì”"],
          ["2", "a neighbour who has been helpful to you", "người", "For most of my childhood, the person who fixed things in our street wasn't a plumber, it was…", "tính từ chung: kind, helpful, friendly"],
          ["3", "a park or garden you enjoy spending time in", "nơi chốn", "There's a small park about ten minutes from my flat that most people walk straight past.", "tả kích thước, cây, ghế… mà không có một cảnh"],
          ["4", "a country you would like to visit but have not been to yet", "nơi chốn", "The country at the top of my list, for slightly odd reasons, is…", "liệt kê điểm du lịch nổi tiếng"],
          ["5", "a website or app that you find useful", "đồ vật", "The app I'd genuinely struggle without isn't a social one at all; it's…", "đọc tính năng như quảng cáo"],
          ["6", "a photograph that means a lot to you", "đồ vật", "It's a slightly blurry photo, and it's never been framed, but…", "tả ảnh mà không có ai chụp, vì sao"],
          ["7", "a journey you remember well", "sự kiện", "The journey that comes to mind straight away is…", "kể giờ đi, giờ đến, giá vé"],
          ["8", "a meal that you remember well", "sự kiện", "The meal I remember best wasn't in a restaurant at all.", "liệt kê món ăn"],
          ["9", "a time when you were late for something important", "tình huống", "I'm normally the one who arrives too early, which made this particular morning worse.", "kể lý do muộn rồi hết ý"],
          ["10", "a time when you were very busy", "tình huống", "The busiest stretch I can remember was the last fortnight of my second year.", "liệt kê việc phải làm; không có cách xoay xở"],
          ["11", "a film you watched that made you think", "phim / nhạc", "It was a documentary I only watched because nothing else was on.", "kể lại cả cốt truyện"],
          ["12", "a song or piece of music that is special to you", "phim / nhạc", "It's not a song I'd ever put on at a party, but…", "nói “it's very beautiful, very meaningful”"],
        ],
        caption: "Toàn văn thẻ (đủ bốn dòng gợi ý) có trong ba khối ghi âm ở mục 6.",
      },

      /* ── 3 ── */
      { t: "h", text: "3. Cùng một thẻ — band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "**Thẻ:** Describe a journey you remember well. You should say: where you went; how you travelled; who you were with; and explain why you remember this journey. Hai bài dưới do khoá viết MỚI để so sánh; câu chuyện là hư cấu." },
      {
        t: "dialogue", title: "Bài nói band 7 (ước tính) — khoảng 1 phút 40 giây, 196 từ",
        lines: [
          { who: "Thí sinh A", role: "a", text: "I'd like to talk about a journey I made when I was fourteen. I went from Hanoi to Da Nang by train with my grandfather. It was in the summer holiday and the journey was very long, about sixteen hours.", vi: "Mở bằng câu khuôn “I'd like to talk about”; đủ ba ý where / how / who trong hai câu đầu — đúng nhưng đọc như điền phiếu." },
          { who: "Thí sinh A", role: "a", text: "We travelled in a sleeper carriage with four beds. The train was quite old and very noisy, but it was also very interesting because I could see a lot of beautiful scenery from the window, for example mountains, rice fields and the sea. My grandfather told me many stories about his life. He worked for the railway when he was young, so he knew a lot about trains.", vi: "Tính từ chung (beautiful, interesting) và liệt kê (mountains, rice fields and the sea). Chi tiết ĐẮT nhất — ông từng làm ở chính tuyến đường đó — bị nói lướt trong một câu." },
          { who: "Thí sinh A", role: "a", text: "I remember this journey because it was the first time I travelled such a long distance without my parents. Also, I learned a lot about my grandfather. Now he is quite old and he cannot travel far any more, so this journey is a very special memory for me. In conclusion, it was a really memorable journey and I will never forget it.", vi: "Ý why có hai lý do nhưng không có cảnh nào minh hoạ. “In conclusion” là ngôn ngữ của bài viết, không phải của người kể chuyện." },
        ],
      },
      {
        t: "dialogue", title: "Bài nói band 8 (ước tính) — khoảng 2 phút, 262 từ",
        lines: [
          { who: "Thí sinh B", role: "b", text: "The journey that comes to mind straight away is one I made when I was fourteen, on the overnight train from Hanoi down to Da Nang, with my grandfather. It takes about sixteen hours, which sounds endless, but it didn't feel that way at all.", vi: "Vào thẳng chuyện; where / how / who gói trong một câu dài tự nhiên; một lời bình chen (which sounds endless)." },
          { who: "Thí sinh B", role: "b", text: "What made it special was that my grandfather had worked on that very line as a young man. He'd been a sort of junior mechanic in the seventies, so for him it wasn't really a journey, it was more like a guided tour of his own past. Every time we stopped, he'd lean out and tell me what used to be there, a water tower, a station café that had long since gone.", vi: "Câu chẻ What made it special was…; quá khứ hoàn thành lùi về quá khứ xa; would cho việc lặp lại; chi tiết cụ thể (a water tower, a station café)." },
          { who: "Thí sinh B", role: "b", text: "The part I remember most vividly came early the next morning. He woke me before it was light and said, “Don't miss this.” We were climbing round the Hai Van Pass, and as the sun came up, the sea appeared on one side, almost directly below us, with a thin layer of cloud still lying over the water. Nobody else in the carriage was awake. We just stood by the window, not saying anything.", vi: "MỘT cảnh có thời điểm, một câu thoại, một chi tiết thị giác; câu ngắn ở cuối đoạn (Nobody else… was awake) để chậm lại." },
          { who: "Thí sinh B", role: "b", text: "Looking back, I think I remember it because it was the first time I saw him not just as my grandfather but as someone who'd had a whole life before I came along. He's eighty-four now and doesn't travel any more, so I'm glad I was paying attention.", vi: "Ý why = một nhận thức thật, không phải “very special memory”; câu chốt ngắn, xuống giọng." },
        ],
      },
      {
        t: "table", caption: "Hai bản khác nhau ở đâu — bốn tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8", "Động tác để học"],
        rows: [
          ["**FC**", "đi đúng thứ tự thẻ; mở bằng I'd like to talk about, kết bằng In conclusion", "vào thẳng chuyện; mạch theo CẢNH (bối cảnh → điều đặc biệt → một khoảnh khắc → nhìn lại)", "bỏ câu mở khuôn; kết bằng Looking back…"],
          ["**LR**", "beautiful scenery, very interesting, many stories, very special", "on that very line · a guided tour of his own past · long since gone · a thin layer of cloud still lying over the water", "mỗi tính từ chung đổi thành MỘT chi tiết nhìn thấy được"],
          ["**GRA**", "quá khứ đơn suốt bài; because / so / also", "had worked · he'd lean out (would) · What made it special was… · not just as… but as… · was paying attention", "mỗi bài: một câu had V3, một câu would, một câu chẻ"],
          ["**P**", "đều giọng, xuống ở mọi dấu phẩy", "chậm lại ở cảnh bình minh; hạ giọng ở lời chen; câu chốt xuống hẳn", "ngữ điệu kể chuyện của Ngày 17"],
        ],
      },
      { t: "rule", formula: "vào thẳng chuyện → điều làm nó đặc biệt (had V3 / would) → MỘT khoảnh khắc (giác quan + câu thoại) → Looking back, …", vi: "Khung bốn chặng này dùng được cho cả 12 thẻ — loại thẻ chỉ đổi “khoảnh khắc” là gì." },

      /* ── 4 ── */
      { t: "h", text: "4. Kho 4 chuyện phủ 12 thẻ — một chuyện, ba thẻ" },
      { t: "p", text: "Tập 4 Ngày 30 dạy kho 5 chuyện. Ở sprint này bạn chỉ cần bốn. Mỗi chuyện là MỘT ký ức thật, đủ chi tiết; đổi thẻ thì đổi ==tiêu điểm==, không đổi chuyện. Các chuyện dưới là ví dụ — thay bằng chuyện của bạn." },
      {
        t: "table",
        head: ["Chuyện trong kho", "Thẻ dùng được", "Tiêu điểm đổi thế nào"],
        rows: [
          ["**A · Chuyến tàu đêm với ông**", "7 journey · 8 meal · 6 photograph", "7: cả chuyến · 8: nắm xôi mua qua cửa sổ tàu lúc 5 giờ sáng · 6: tấm ảnh hai ông cháu ở cửa sổ toa"],
          ["**B · Hai tuần cuối năm hai (đồ án + thi)**", "10 very busy · 9 late · 5 app", "10: cả hai tuần · 9: buổi bảo vệ bị muộn 10 phút vì xe buýt hỏng · 5: ứng dụng thẻ nhớ / lịch đã cứu mình"],
          ["**C · Bác hàng xóm sửa xe đầu ngõ**", "2 neighbour · 3 park · 12 song", "2: bác · 3: công viên nơi bác tập thể dục mỗi sáng và rủ mình đi cùng · 12: bài hát cũ bác hay mở khi sửa xe"],
          ["**D · Một phim tài liệu về một nhà khoa học**", "11 film · 1 famous person · 4 country", "11: bộ phim · 1: chính nhà khoa học ấy · 4: đất nước nơi phim quay"],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận khi tái chế chuyện",
        items: [
          "Giám khảo không biết bạn tái chế — nhưng nhận ra ngay nếu bạn kể lại cả chuyện cũ rồi mới “ghé” vào thẻ ở 20 giây cuối. Tiêu điểm của thẻ phải xuất hiện trong ==30 giây đầu==.",
          "Thẻ hỏi THÌ nào thì giữ thì đó: “a country you would like to visit” là thẻ giả định (would, I'd love to), không phải chuyện đã xảy ra.",
          "Kho dùng được cho cả Part 3: chuyện D (phim tài liệu) cho bạn ví dụ thật khi giám khảo hỏi về khoa học, truyền thông, người nổi tiếng.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. 🔊 Phát âm — nhấn câu mở, câu chốt và từ khó của 12 thẻ" },
      { t: "p", text: "Câu mở và câu chốt là hai câu giám khảo nhớ nhất. Nhấn đúng TỪ MANG TIN (thường là danh từ / tính từ mới), đừng nhấn đều. Bốn từ của 12 thẻ mà người Việt hay đọc sai: **photograph** /ˈfəʊtəɡrɑːf/ ↔ **photographer** /fəˈtɒɡrəfə/ (trọng âm nhảy), **comfortable** /ˈkʌmftəbl/ (3 âm tiết, không phải “com-for-ta-ble”), **restaurant** /ˈrestrɒnt/, **neighbour** /ˈneɪbə/." },
      {
        t: "phatam", id: "t5d26-phat-am", title: "Luyện phát âm — câu mở, câu chốt, từ khó (8 câu)",
        note: "Trọng âm ghi bằng CHỮ HOA trong phần dịch; IPA không ghi dấu nhấn. Câu 2: hai từ cùng gốc, trọng âm khác chỗ. Câu 7 và 8 là câu chốt — chậm, xuống giọng ở từ cuối.",
        items: [
          { text: "The person I'd most like to sit down with is a scientist.", ipa: "ðə pɜːsn aɪd məʊst laɪk tə sɪt daʊn wɪð ɪz ə saɪəntɪst", vi: "Người tôi muốn ngồi trò chuyện nhất là một nhà khoa học. (MOST · SCIentist)" },
          { text: "It's a photograph, not a photographer's portfolio.", ipa: "ɪts ə fəʊtəɡrɑːf nɒt ə fətɒɡrəfəz pɔːtfəʊliəʊ", vi: "Đó là một bức ảnh, không phải bộ sưu tập của nhiếp ảnh gia. (PHOtograph · phoTOgrapher)" },
          { text: "Our neighbour fixed every bike in the street.", ipa: "aʊə neɪbə fɪkst evri baɪk ɪn ðə striːt", vi: "Bác hàng xóm sửa mọi chiếc xe đạp trong phố. (NEIGHbour · EVery BIKE)" },
          { text: "It wasn't a comfortable restaurant, but the food was wonderful.", ipa: "ɪt wɒznt ə kʌmftəbl restrɒnt bət ðə fuːd wəz wʌndəfl", vi: "Đó không phải nhà hàng thoải mái gì, nhưng đồ ăn thì tuyệt. (COMFtable · RESTront · WONderful)" },
          { text: "I'd only just got there when the doors closed.", ipa: "aɪd əʊnli dʒʌst ɡɒt ðeə wen ðə dɔːz kləʊzd", vi: "Tôi vừa tới nơi thì cửa đóng lại. (ONly JUST · CLOSED)" },
          { text: "It was a documentary I only watched because nothing else was on.", ipa: "ɪt wəz ə dɒkjumentri aɪ əʊnli wɒtʃt bɪkɒz nʌθɪŋ els wəz ɒn", vi: "Đó là một phim tài liệu tôi chỉ xem vì không có gì khác để xem. (docuMENTary · NOTHing ELSE)" },
          { text: "Looking back, I'm glad I was paying attention.", ipa: "lʊkɪŋ bæk aɪm ɡlæd aɪ wəz peɪɪŋ ətenʃn", vi: "Nhìn lại, tôi mừng là khi ấy mình đã để tâm. (LOOKing BACK · aTTENtion ↘)" },
          { text: "And that's why I've never forgotten it.", ipa: "ənd ðæts waɪ aɪv nevə fəɡɒtn ɪt", vi: "Và đó là lý do tôi chưa bao giờ quên. (NEVer forGOTten ↘ — chậm, xuống)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sprint — 3 vòng × 4 thẻ, mỗi thẻ 1 phút chuẩn bị + 2 phút nói (AI chấm)" },
      {
        t: "table", caption: "Luật của sprint",
        head: ["Luật", "Vì sao"],
        rows: [
          ["Bấm đồng hồ 60 giây chuẩn bị thật; hết giờ là nói, kể cả khi chưa ghi xong", "đúng điều kiện phòng thi; tập ra quyết định nhanh"],
          ["Nói tới khi đồng hồ 2 phút kêu, không dừng sớm", "dừng ở 1:20 là mất điểm FC dù nội dung tốt"],
          ["Không ngừng quá 3 giây; bí thì dùng một câu bắc cầu (What I remember most is… · The odd thing is…)", "ngừng vì tìm ý (band 7) ≠ ngừng vì nội dung (band 8 — Ngày 2)"],
          ["Sau mỗi vòng: nghe lại MỘT bản ghi, đánh dấu bảng tự chấm mục 7", "nghe cả bốn thì quá lâu; một bản là đủ thấy lỗi lặp"],
        ],
      },
      {
        t: "speak", id: "t5d26-noi-vong-1", part: "2",
        questions: [
          "Describe a famous person you would like to meet. You should say: who this person is; how you know about them; what you would talk about with them; and explain why you would like to meet them.",
          "Describe a park or garden that you enjoy spending time in. You should say: where it is; what it looks like; what you do there; and explain why you enjoy spending time there.",
          "Describe a website or app that you find useful. You should say: what it is; how you found out about it; what you use it for; and explain why you find it useful.",
          "Describe a journey you remember well. You should say: where you went; how you travelled; who you were with; and explain why you remember this journey.",
        ],
      },
      {
        t: "speak", id: "t5d26-noi-vong-2", part: "2",
        questions: [
          "Describe a neighbour who has been helpful to you. You should say: who this neighbour is; how long you have known them; how they helped you; and explain how you feel about this person.",
          "Describe a country you would like to visit but have not been to yet. You should say: which country it is; how you learned about it; what you would like to do there; and explain why you want to go there.",
          "Describe a photograph that means a lot to you. You should say: who took it; when and where it was taken; what it shows; and explain why it is important to you.",
          "Describe a meal that you remember well. You should say: where you had it; who you were with; what you ate; and explain why you remember it.",
        ],
      },
      {
        t: "speak", id: "t5d26-noi-vong-3", part: "2",
        questions: [
          "Describe a time when you were late for something important. You should say: what you were late for; why you were late; what happened as a result; and explain how you felt about it.",
          "Describe a time when you were very busy. You should say: when it was; what you had to do; how you managed your time; and explain how you felt during this period.",
          "Describe a film you watched that made you think. You should say: what the film was; when and where you watched it; what it was about; and explain why it made you think.",
          "Describe a song or piece of music that is special to you. You should say: what it is; when you first heard it; how often you listen to it; and explain why it is special to you.",
        ],
      },
      { t: "p", text: "**Part 3 nối tiếp** — năm câu đi theo năm thẻ đã nói (hành trình, người nổi tiếng, ảnh, phim, sự bận rộn). Mỗi câu trả lời: mở bằng paraphrase câu hỏi (Ngày 22), một ví dụ từ kho chuyện, một nhượng bộ (Ngày 6)." },
      {
        t: "speak", id: "t5d26-noi-p3", part: "3",
        questions: [
          "Why do some journeys stay in our memory for years while others are forgotten at once?",
          "Do you think young people today admire the right kind of famous people?",
          "Now that everyone takes hundreds of photos, have photographs lost some of their value?",
          "Can a film change the way people think about a serious issue, or does it only reinforce what they already believe?",
          "Is being busy all the time a sign of success, or a problem that society should address?",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Tự chấm sau mỗi vòng" },
      {
        t: "table",
        head: ["Kiểm", "Đạt band 8 khi", "Vòng 1", "Vòng 2", "Vòng 3"],
        rows: [
          ["Độ dài", "nói đủ 2 phút, không dừng sớm", "…", "…", "…"],
          ["Mở bài", "vào thẳng chuyện, không “I'm going to talk about”", "…", "…", "…"],
          ["Khoảnh khắc", "có MỘT cảnh cụ thể với một chi tiết giác quan hoặc một câu thoại", "…", "…", "…"],
          ["Thì", "ít nhất một had V3 / would / câu chẻ, dùng có lý do", "…", "…", "…"],
          ["Câu chốt", "“nhìn lại” thật, xuống giọng; không “In conclusion”", "…", "…", "…"],
          ["Ngập ngừng", "không lần nào quá 3 giây", "…", "…", "…"],
        ],
        caption: "Thẻ nào trượt từ 2 dòng: làm lại ở Bài tập phần IX. Ngày 27 sprint Part 3 (12 đề) dùng lại kho 4 chuyện này.",
      },
      {
        t: "mcq", id: "t5d26-noi-kiem", title: "Kiểm tra cuối bài (4 câu)",
        items: [
          { q: "1. Trong 1 phút chuẩn bị, việc NÊN làm đầu tiên là:", options: ["viết bốn câu hoàn chỉnh theo bốn dòng gợi ý", "chọn một chuyện thật từ kho trong khoảng 10 giây", "liệt kê thật nhiều từ vựng khó"], correct: 1, why: "Chọn chuyện trước; ghi chú theo chuyện, mỗi ô 3–5 chữ tiếng Anh." },
          { q: "2. Câu mở nào hợp band 8 cho thẻ “a meal you remember well”?", options: ["I'm going to talk about a meal I remember well.", "The meal I remember best wasn't in a restaurant at all.", "Food is very important in Vietnamese culture."], correct: 1, why: "Vào thẳng chuyện và gợi tò mò. Phương án 1 là khuôn band 6–7; phương án 3 lạc sang Part 3." },
          { q: "3. Với thẻ “a country you would like to visit but have not been to yet”, thì chính của bài là:", options: ["quá khứ đơn", "would / I'd love to + hiện tại cho điều đã biết", "hiện tại hoàn thành tiếp diễn"], correct: 1, why: "Thẻ giả định ⇒ would; phần “how you learned about it” mới dùng quá khứ." },
          { q: "4. Tái chế một chuyện cho thẻ khác: tiêu điểm của thẻ mới nên xuất hiện:", options: ["trong 30 giây đầu", "ở 20 giây cuối", "chỉ khi giám khảo hỏi lại"], correct: 0, why: "Kể lại cả chuyện cũ rồi mới ghé vào thẻ ở cuối là lạc đề — giám khảo chấm FC và LR thấp." },
        ],
      },
    ],
  },
  /* ════════════════ BÀI TẬP NGÀY 26 ════════════════ */
  {
    id: "t5d26-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 26 — Energy · Language · Books vòng 2 · cặp dễ nhầm · overview và số liệu Task 1 · ghi chú Part 2 · một bài Task 1 mới · nói lại hai thẻ",
    goal: "Ôn trọn Ngày 26 trong 70 phút: dùng đúng 48 từ vòng 2 trong câu Task 2 / Part 3, không nhầm sáu cặp, chọn được overview band 8 và dùng đúng giới từ của số liệu cho bảy dạng Task 1, ghi chú Part 2 trong 15 chữ, viết trọn một bài Task 1 mới trong 20 phút và nói lại hai thẻ Part 2.",
    minutes: 70,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn **Bài 1** (48 từ vòng 2, sáu cặp dễ nhầm, dịch).",
          "Phần VI–VII ôn **Bài 2**: chọn overview, giới từ và cách nói số liệu của bảy dạng. Phần IX: một bài Task 1 MỚI (bar, bốn nước, hai năm) — 20 phút, AI chấm.",
          "Phần VIII và X ôn **Bài 3**: ghi chú 1 phút và nói lại hai thẻ.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 26 trong một hình", center: "Sprint: nói nhanh, viết nhanh, vẫn chính xác",
        branches: [
          { label: "Từ vòng 2", items: ["energy mix · baseload", "language shift · heritage language", "deep reading · royalties"] },
          { label: "Task 1 × 7", items: ["3′ bốn câu hỏi", "overview viết trước", "một trục thân bài", "3′ soát"] },
          { label: "Part 2 × 12", items: ["kho 4 chuyện", "4 ô ghi chú", "một khoảnh khắc", "Looking back ↘"] },
        ],
      },

      { t: "h", text: "I. Energy — điền MỘT từ (6 câu) — ôn Bài 1 mục 1" },
      {
        t: "quiz", id: "t5d26-bt-nang-luong", kind: "fill", title: "I. Energy vòng 2",
        items: [
          { q: "1. Gas now makes up only a small part of the country's energy ___.", answers: ["mix"], hint: "energy mix." },
          { q: "2. Nuclear stations are well suited to supplying ___ power around the clock.", answers: ["baseload"], hint: "baseload — điện nền." },
          { q: "3. Electricity is cheapest at night, outside periods of ___ demand.", answers: ["peak"], hint: "peak demand." },
          { q: "4. A smart ___ lets you see your electricity use minute by minute.", answers: ["meter"], hint: "smart meter." },
          { q: "5. Data centres are notoriously power-___.", answers: ["hungry"], hint: "power-hungry." },
          { q: "6. Many voters see energy ___ as more important than cheap prices.", answers: ["independence"], hint: "energy independence." },
        ],
      },

      { t: "h", text: "II. Language — điền MỘT từ (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz", id: "t5d26-bt-ngon-ngu", kind: "fill", title: "II. Language vòng 2",
        items: [
          { q: "1. Weekend schools are trying to r___ the island's dying language.", answers: ["revitalise", "revitalize"], hint: "revitalise — hồi sinh." },
          { q: "2. ‘Wi-fi’ is a recent l___ in many languages.", answers: ["loanword"], hint: "loanword — từ vay mượn." },
          { q: "3. After decades abroad, he suffered some language a___ in his mother tongue.", answers: ["attrition"], hint: "language attrition." },
          { q: "4. Some see global English as a form of linguistic i___.", answers: ["imperialism"], hint: "linguistic imperialism." },
          { q: "5. The poems are written in the v___, not in the classical language.", answers: ["vernacular"], hint: "the vernacular." },
          { q: "6. She is an a___ speaker who never needs notes.", answers: ["articulate"], hint: "articulate (adj)." },
        ],
      },

      { t: "h", text: "III. Books — điền MỘT từ (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "quiz", id: "t5d26-bt-sach", kind: "fill", title: "III. Books vòng 2",
        items: [
          { q: "1. The author earns about a dollar in r___ for every copy sold.", answers: ["royalties"], hint: "royalties." },
          { q: "2. The a___ version of the audiobook lasts four hours instead of eleven.", answers: ["abridged"], hint: "abridged — rút gọn." },
          { q: "3. Her m___ describes her years as a nurse during the war.", answers: ["memoir"], hint: "memoir — hồi ký." },
          { q: "4. The newspaper's r___ has fallen by half in ten years.", answers: ["readership"], hint: "readership." },
          { q: "5. This a___ collects the best short stories of the decade.", answers: ["anthology"], hint: "anthology — tuyển tập." },
          { q: "6. The plot is so g___ that I finished the book in two days.", answers: ["gripping"], hint: "gripping — cuốn hút." },
        ],
      },

      { t: "h", text: "IV. Cặp dễ nhầm — chọn phương án đúng (5 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq", id: "t5d26-bt-cap", title: "IV. Sáu cặp",
        items: [
          { q: "1. The award is one of the most important ___ prizes in the country.", options: ["literal", "literary", "literate"], correct: 1, why: "literary prize — giải văn chương." },
          { q: "2. The book has been ___ into eighteen languages.", options: ["interpreted", "translated"], correct: 1, why: "dịch viết ⇒ translated." },
          { q: "3. People from the north and south speak the same language but with different ___.", options: ["accents", "dialects", "languages"], correct: 0, why: "Cùng ngôn ngữ, khác phát âm ⇒ accents. (Nếu khác cả từ và ngữ pháp ⇒ dialects.)" },
          { q: "4. LED bulbs are far more energy-___ than old ones.", options: ["intensive", "efficient"], correct: 1, why: "tiết kiệm năng lượng ⇒ energy-efficient." },
          { q: "5. Solar power is ___, but mining the metals for panels must also be made ___.", options: ["sustainable · renewable", "renewable · sustainable"], correct: 1, why: "renewable nói về NGUỒN; sustainable nói về CÁCH LÀM." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (4 câu) — ôn Bài 1" },
      {
        t: "quiz", id: "t5d26-bt-dich", kind: "translate", grammar: "từ vòng 2 + một mệnh đề phụ",
        title: "V. Dịch sang tiếng Anh",
        items: [
          { q: "Định giá carbon khiến nhiên liệu gây ô nhiễm đắt hơn mà không cần cấm chúng.", answers: ["Carbon pricing makes polluting fuels more expensive without banning them.", "Carbon pricing makes polluting fuels more expensive without having to ban them.", "Carbon pricing makes polluting fuels more expensive without the need to ban them.", "Carbon pricing makes polluting fuels more expensive without banning them outright."], hint: "carbon pricing · without + V-ing" },
          { q: "Nhiều đứa trẻ hiểu tiếng gốc của gia đình nhưng không thể viết nó.", answers: ["Many children understand their heritage language but cannot write it.", "Many children understand their family's heritage language but cannot write it.", "Many children can understand their heritage language but cannot write it.", "Many children understand their heritage language but are unable to write it."], hint: "heritage language" },
          { q: "Một cuốn sách điện tử không bao giờ bị hết in.", answers: ["An e-book never goes out of print.", "An e-book need never go out of print.", "An e-book can never go out of print.", "E-books never go out of print."], hint: "go out of print" },
          { q: "Đọc vì thích khi còn nhỏ giúp mở rộng vốn từ về sau.", answers: ["Reading for pleasure in childhood helps to widen vocabulary later on.", "Reading for pleasure as a child helps to build a wider vocabulary later in life.", "Reading for pleasure in childhood helps to expand vocabulary later in life.", "Reading for pleasure in childhood helps widen your vocabulary later on.", "Reading for pleasure as a child helps expand your vocabulary later on."], hint: "reading for pleasure · later on / later in life" },
        ],
      },

      { t: "h", text: "VI. Overview Task 1 — chọn câu tốt nhất (5 câu) — ôn Bài 2 mục 2" },
      {
        t: "mcq", id: "t5d26-bt-overview", title: "VI. Overview band 8",
        items: [
          { q: "1. Bar chart: tỉ lệ người dùng thư điện tử theo năm nhóm tuổi, 2010 và 2020 — mọi nhóm tăng, nhóm già tăng nhanh nhất. Overview tốt nhất:", options: ["Overall, the 65+ group rose from 20 % to 58 %.", "Overall, email use increased in every age group, with the steepest growth among older people, which narrowed the generation gap.", "Overall, there were five age groups and two years."], correct: 1, why: "Quy luật + thay đổi + hệ quả, không số. Phương án 1 có số; phương án 3 chỉ mô tả hình." },
          { q: "2. Process sáu bước, bước 4 có thể quay lại bước 2. Câu nào nên có trong overview?", options: ["Step 4 goes back to step 2.", "The process involves six stages and is not entirely linear, since some material is returned for further treatment.", "Then it is returned."], correct: 1, why: "Gọi tên vòng lặp bằng câu đủ, không dùng số bước của sơ đồ." },
          { q: "3. Map: khu cảng cá → khu dân cư; hải đăng giữ nguyên. Overview tốt nhất:", options: ["Overall, the area has changed from a fishing port into a residential district, although the lighthouse has been retained.", "Overall, there are many changes.", "Overall, the fish market was on the left."], correct: 0, why: "Công năng tổng thể + cái giữ nguyên." },
          { q: "4. Table: 5 nước × 3 cột (dân số — triệu người, GDP — tỉ USD, tuổi thọ — năm). Câu nào SAI về logic?", options: ["Country A had the largest population and the highest GDP.", "Life expectancy in Country B (82 years) was higher than its population (60 million).", "Life expectancy varied far less than GDP."], correct: 1, why: "So năm với triệu người — hai đơn vị khác nhau." },
          { q: "5. Line graph có năm 2030 là dự báo. Câu đúng:", options: ["Sales will reach 400 units in 2030.", "Sales are forecast to reach 400 units by 2030.", "Sales reached 400 units in 2030."], correct: 1, why: "Dự báo ⇒ is / are forecast to; by 2030." },
        ],
      },

      { t: "h", text: "VII. Số liệu Task 1 — điền MỘT từ (5 câu) — ôn Bài 2 mục 3–7" },
      {
        t: "quiz", id: "t5d26-bt-so-lieu", kind: "fill", title: "VII. Giới từ và cách nói số",
        items: [
          { q: "1. Coal generation peaked ___ 125 TWh in 2005.", answers: ["at"], hint: "peak AT + số." },
          { q: "2. The share of audiobooks rose ___ 3 % to 13 %.", answers: ["from"], hint: "rise FROM… TO…" },
          { q: "3. Between 2004 and 2024, the figure for 16–24-year-olds rose by 23 percentage ___.", answers: ["points"], hint: "percentage points — chênh lệch giữa hai tỉ lệ." },
          { q: "4. Heating accounted ___ by far the largest share of energy use.", answers: ["for"], hint: "account FOR." },
          { q: "5. The lorry park made ___ for a public square.", answers: ["way"], hint: "make way for — bị thay thế bởi (map)." },
        ],
      },

      { t: "h", text: "VIII. Ghi chú Part 2 — chọn phương án đúng (3 câu) — ôn Bài 3 mục 1, 4" },
      {
        t: "mcq", id: "t5d26-bt-ghi-chu", title: "VIII. Một phút chuẩn bị",
        items: [
          { q: "1. Ghi chú nào tốt nhất cho thẻ “a song that is special to you”?", options: ["“I am going to talk about a song which is very special to me because…”", "“mum's kitchen radio · rainy Sundays · she sang wrong words · moved abroad”", "“music · important · beautiful · meaningful”"], correct: 1, why: "Bốn ô chữ khoá tiếng Anh, cụ thể, có chi tiết giác quan và ý “nhìn lại”. Phương án 1 là câu, mất thời gian; phương án 3 toàn tính từ chung." },
          { q: "2. Chuyện kho “hai tuần cuối năm hai” dùng cho thẻ “a time when you were late”. Tiêu điểm nên là:", options: ["toàn bộ hai tuần ôn thi", "buổi sáng bạn bị muộn và chuyện xảy ra sau đó", "danh sách môn học"], correct: 1, why: "Đổi tiêu điểm sang đúng khoảnh khắc thẻ hỏi, trong 30 giây đầu." },
          { q: "3. Khi chỉ còn 15 giây chuẩn bị mà chưa nghĩ ra ý “why”, nên:", options: ["ghi ô 4 (câu nhìn lại) ngay", "ghi thêm từ vựng khó", "bỏ trống, nói tới đâu hay tới đó"], correct: 0, why: "Biết mình kết ở đâu thì không cạn ý ở phút cuối." },
        ],
      },

      { t: "h", text: "IX. Một bài Task 1 MỚI — 20 phút, AI chấm — ôn Bài 2" },
      {
        t: "figure",
        fig: {
          kind: "bar",
          title: "Share of electricity generated from renewable sources in four countries, 2010 and 2025 (%)",
          note: "Số liệu tự đặt cho bài luyện (bốn nước hư cấu).",
          unit: "%",
          categories: ["Country A", "Country B", "Country C", "Country D"],
          series: [
            { name: "2010", values: [12, 35, 8, 22] },
            { name: "2025", values: [48, 52, 15, 61] },
          ],
        },
      },
      {
        t: "essay", id: "t5d26-bt-viet", task: "Task 1", minWords: 150,
        prompt: "The chart shows the percentage of electricity generated from renewable sources in four countries in 2010 and 2025 (see the bar chart above). Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — 20 minutes: 3 minutes for the four questions, 14 minutes writing, 3 minutes checking.",
        tips: [
          "Câu ② của 3 phút đầu: mọi nước tăng; thứ hạng ĐỔI (D vượt B để đứng đầu).",
          "Câu ③: mức tăng rất khác nhau — A gấp bốn, C gần như đứng yên.",
          "Chênh lệch giữa hai tỉ lệ: percentage points.",
          "Soát theo bản chart của Ngày 25 Bài 1 mục 7.",
        ],
      },
      {
        t: "note", title: "📌 Overview mẫu để so SAU khi đã viết (band 8, ước tính)",
        items: [
          "Overall, all four countries generated a larger proportion of their electricity from renewables in 2025 than in 2010, but the pace of change varied enormously: Country D moved from second place to first, while Country C remained far behind the others.",
        ],
      },

      { t: "h", text: "X. Nói lại hai thẻ — 1 phút chuẩn bị, 2 phút nói (AI chấm) — ôn Bài 3 mục 3–6" },
      { t: "p", text: "Hai thẻ dưới thường khó nhất trong 12 thẻ (một thẻ đồ vật cần chuyện, một thẻ tình huống dễ hết ý). Nếu thẻ khác trong sprint của bạn trượt từ 2 dòng ở bảng tự chấm, nói lại thẻ đó thay thế." },
      {
        t: "speak", id: "t5d26-bt-noi-p2", part: "2",
        questions: [
          "Describe a photograph that means a lot to you. You should say: who took it; when and where it was taken; what it shows; and explain why it is important to you.",
          "Describe a time when you were very busy. You should say: when it was; what you had to do; how you managed your time; and explain how you felt during this period.",
        ],
      },
    ],
  },
];
