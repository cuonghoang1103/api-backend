/**
 * IELTS Tập 5 — Ngày 8 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, đoạn mẫu, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🖥️ NGÀY LÀM ĐỀ 9 (band 7.0–7.5): Writing + Listening làm ở Online Test (`/language/en/ielts/thi-may`, bộ Đề 9); bài 2 và bài 3
 * của ngày CHỈ hướng dẫn chiến thuật – phân giờ – checklist trước / sau, KHÔNG chép lại đề, không lộ chủ đề hay đáp án.
 *   Bài 1 (vocab)     Tội phạm vòng 2 (18) · Kinh doanh vòng 2 (18) · Già hoá vòng 2 (16) [VC19 VC23 VC29]
 *                     — nối Tập 3 Ngày 4 (Crime vòng 1) · Tập 3 Ngày 16 (Business vòng 1) · Tập 4 Ngày 16 (Ageing vòng 1);
 *                     không lặp từ của ba ngày đó.
 *   Bài 2 (writing)   Writing Đề 9 — Task 1 (map hai mốc) + Task 2 (problem / solution) trong 60 phút: phân giờ, ôn nhanh hai dạng
 *                     bằng đề KHÁC (bản đồ khu xưởng dệt Ashby hư cấu; đề lừa đảo người cao tuổi), mẫu band 7 và band 8 đặt cạnh
 *                     nhau, checklist trước / sau, cách đọc bảng chấm — nối Tập 3 Ngày 28 (map) · Tập 4 Ngày 22 (problem /
 *                     solution band 7) · Tập 5 Ngày 2 · 3 · 4 · 7.
 *   Bài 3 (listening) Listening Đề 9 — 4 Part, 40 câu, tốc độ thật, 6 giọng: bản đồ dạng câu từng Part, việc làm trong giờ đọc
 *                     trước, 2 phút kiểm cuối, khởi động tai (2 đoạn tự soạn: Canada + Ireland · New Zealand), phân loại lỗi sau
 *                     đề [L16] · 🔊 nói theo câu tốc độ thật — nối Tập 5 Ngày 1 · 4 · 5; chuẩn bị Ngày 9 (mổ đề).
 *   Bài tập Ngày 8    46 câu có đáp án
 * Dữ kiện thật trong đoạn nghe khởi động 2 (lichenometry): Roland Beschel, thập niên 1950; địa y bản đồ (map lichen) lớn chậm,
 * thường dưới 1 mm đường kính mỗi năm; hiệu chuẩn bằng bia mộ có ghi năm. Mọi tên cơ sở, giá tiền là hư cấu.
 * Mọi id bắt đầu `t5d8-`.
 */
import type { Lesson } from '../data';

export const NGAY_8: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d8-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Tội phạm, Kinh doanh, Già hoá — vòng 2 (52 từ band 8)",
    goal: "Dùng chủ động 52 từ và cụm của ba chủ đề Task 2 / Part 3 hay gặp nhất ở mức band 8 (recidivism, custodial sentence, restorative justice · economies of scale, overheads, the gig economy · ageism, the sandwich generation, replacement level…) — đúng collocation, đúng giới từ, và biết đổi một câu band 6 thành câu band 8 bằng chính những từ này.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Lexical Resource (Writing Task 2 + Speaking Part 3) từ 7 lên 8**: band 8 “dùng thành thạo từ ít gặp để diễn đạt nghĩa **chính xác**” — không phải từ khó cho oai, mà là từ gọi đúng tên sự việc.",
          "**Vòng 2** của ba chủ đề: Tội phạm (vòng 1: Tập 3 Ngày 4), Kinh doanh (Tập 3 Ngày 16), Già hoá (Tập 4 Ngày 16). Vòng 1 dạy từ để **nói được**; vòng 2 dạy từ để **nói chính xác**: thay “go to prison again” bằng reoffend → **recidivism**.",
          "52 từ, chia ba nhóm 18 · 18 · 16 (44 từ mới + 8 từ ôn có chủ đích, đánh dấu ↺ trong thẻ từ); mỗi nhóm có bảng “vòng 1 → vòng 2” và một bài luyện.",
          "Hôm nay là **ngày làm Đề 9**: học bài này trước (khoảng 90 phút), nghỉ, rồi sang bài 2 và bài 3 để làm đề.",
          "Mọi từ tự vào **Flashcards** (bộ “Từ của khoá — Tập 5”).",
        ],
      },

      { t: "h", text: "1. Vòng 2 nghĩa là gì — từ “nói được” sang “nói chính xác”" },
      {
        t: "table", head: ["Ý cần nói", "Band 6–7 (vòng 1)", "Band 8 (vòng 2)"],
        rows: [
          ["Người ra tù lại phạm tội", "Many criminals commit crimes again after prison.", "**Recidivism** remains high among those given short **custodial sentences**."],
          ["Công ty lớn sản xuất rẻ hơn", "Big companies can make products more cheaply.", "Large firms benefit from **economies of scale**, which small rivals cannot match."],
          ["Người trung niên vừa nuôi con vừa chăm cha mẹ", "Many adults have to look after both children and old parents.", "The **sandwich generation** is squeezed between childcare and the care of ageing parents."],
          ["Phân biệt đối xử vì tuổi", "Old people are treated unfairly at work.", "**Ageism** in recruitment pushes experienced workers out of the labour market."],
        ],
      },
      {
        t: "note", title: "💡 Cách học 52 từ trong 90 phút",
        items: [
          "Mỗi nhóm: đọc to câu ví dụ **một lần**, che cột nghĩa (nút “Che nghĩa”), tự nhớ lại, rồi làm bài luyện ngay.",
          "Dòng mở rộng dưới mỗi từ ghi **collocation** và **giới từ** — band 8 sai ở đây chứ không sai nghĩa.",
          "Chọn **5 từ mỗi nhóm** hợp với ý kiến của riêng bạn và viết mỗi từ một câu về Việt Nam. Từ gắn với ý của mình thì mới bật ra trong phòng thi.",
        ],
      },

      { t: "h", text: "2. Crime vòng 2 — 18 từ: loại tội, người phạm tội, toà án, hình phạt" },
      { t: "p", text: "Tập 3 Ngày 4 đã có crime, offender, fraud, court, sentence, deterrent, rehabilitation, reoffend. Đề Task 2 ở band 8 hỏi sâu hơn: **tù có ích không**, **tội phạm kinh tế có bị xử nhẹ quá không**, **công lý là trừng phạt hay sửa chữa**. Mười tám từ dưới đây trả lời đúng ba câu hỏi đó." },
      {
        t: "vocab", items: [
          { w: "white-collar crime", pos: "n", ipa: "/ˌwaɪt ˈkɒlə kraɪm/", vi: "tội phạm “cổ cồn trắng” (tội phạm kinh tế của giới văn phòng, quản lý)", ex: "White-collar crime rarely makes the headlines, yet it costs the economy far more than burglary.", exVi: "Tội phạm cổ cồn trắng hiếm khi lên trang nhất, nhưng gây thiệt hại cho nền kinh tế nhiều hơn hẳn trộm cắp.", more: "Không đếm được. Đối lập: **street crime** · **violent crime**. Người: a white-collar criminal." },
          { w: "embezzlement", pos: "n", ipa: "/ɪmˈbezlmənt/", vi: "tội biển thủ, tham ô (lấy tiền mình được giao quản lý)", ex: "The accountant was convicted of embezzlement after diverting funds for six years.", exVi: "Người kế toán bị kết tội biển thủ sau sáu năm rút tiền quỹ.", more: "Động từ: **embezzle** money / funds **from** a company. Khác **fraud** (lừa người khác để lấy tiền)." },
          { w: "money laundering", pos: "n", ipa: "/ˈmʌni ˌlɔːndərɪŋ/", vi: "rửa tiền", ex: "Stricter banking rules have made money laundering more difficult.", exVi: "Quy định ngân hàng chặt hơn đã khiến việc rửa tiền khó hơn.", more: "Động từ: **launder** money **through** a business. Không đếm được." },
          { w: "organised crime", pos: "n", ipa: "/ˌɔːɡənaɪzd ˈkraɪm/", vi: "tội phạm có tổ chức", ex: "Drug trafficking is largely controlled by organised crime.", exVi: "Buôn ma tuý phần lớn do tội phạm có tổ chức kiểm soát.", more: "an organised crime **group / network**. Không có mạo từ khi nói chung. Mỹ viết organized." },
          { w: "petty crime", pos: "n", ipa: "/ˌpeti ˈkraɪm/", vi: "tội vặt (trộm vặt, phá hoại nhỏ)", ex: "Community service is a more sensible response to petty crime than a prison term.", exVi: "Lao động công ích là cách xử lý tội vặt hợp lý hơn án tù.", more: "a petty **thief / offence**. Đối lập: **serious crime**. Đừng viết ~~small crime~~." },
          { w: "perpetrator", pos: "n", ipa: "/ˈpɜːpətreɪtə/", vi: "thủ phạm, người gây ra (tội ác, hành vi xấu)", ex: "In most cases of fraud, the perpetrator is someone the victim trusts.", exVi: "Trong đa số vụ lừa đảo, thủ phạm là người nạn nhân tin tưởng.", more: "the perpetrator(s) **of** a crime / an attack. Động từ: **perpetrate** (trang trọng). Trọng âm ở âm tiết đầu." },
          { w: "repeat offender", pos: "n", ipa: "/rɪˌpiːt əˈfendə/", vi: "người tái phạm nhiều lần", ex: "A small number of repeat offenders account for a large share of all burglaries.", exVi: "Một số ít kẻ tái phạm chiếm phần lớn tổng số vụ trộm.", more: "Đối lập: a **first-time offender**. Cùng nghĩa trang trọng: a **persistent offender**." },
          { w: "recidivism", pos: "n", ipa: "/rɪˈsɪdɪvɪzəm/", vi: "sự tái phạm (hiện tượng, tỉ lệ)", ex: "Prisons that offer vocational training report markedly lower rates of recidivism.", exVi: "Các nhà tù có dạy nghề ghi nhận tỉ lệ tái phạm thấp hơn rõ rệt.", more: "**recidivism rates** · reduce / cut recidivism. Danh từ của **reoffend** (Tập 3). Không đếm được; trọng âm ở **-cid-**." },
          { w: "custodial sentence", pos: "n", ipa: "/kʌˌstəʊdiəl ˈsentəns/", vi: "án tù giam (phải vào tù thật)", ex: "For non-violent offences, a short custodial sentence often does more harm than good.", exVi: "Với tội không bạo lực, một án tù ngắn thường hại nhiều hơn lợi.", more: "Đối lập: a **non-custodial sentence** (phạt tiền, lao động công ích, án treo). hand down / impose / serve a sentence." },
          { w: "parole", pos: "n", ipa: "/pəˈrəʊl/", vi: "sự tha tù trước hạn có điều kiện", ex: "He was released on parole after serving half of his sentence.", exVi: "Anh ta được tha trước hạn có điều kiện sau khi thụ một nửa án.", more: "be released **on** parole · be granted / denied parole · a parole board. Khác **probation** (án thử thách thay cho tù — Tập 3)." },
          { w: "restorative justice", pos: "n", ipa: "/rɪˌstɔːrətɪv ˈdʒʌstɪs/", vi: "tư pháp phục hồi (người phạm tội gặp nạn nhân, sửa chữa thiệt hại)", ex: "Restorative justice asks offenders to face the people they have harmed.", exVi: "Tư pháp phục hồi yêu cầu người phạm tội đối mặt với những người họ đã làm hại.", more: "a restorative justice **scheme / programme**. Đặt cạnh **retribution** để làm khung cho bài Discussion." },
          { w: "mitigating circumstances", pos: "n (số nhiều)", ipa: "/ˌmɪtɪɡeɪtɪŋ ˈsɜːkəmstənsɪz/", vi: "tình tiết giảm nhẹ", ex: "The judge took the defendant’s age into account as a mitigating circumstance.", exVi: "Thẩm phán tính đến tuổi của bị cáo như một tình tiết giảm nhẹ.", more: "Đối lập: **aggravating** circumstances (tăng nặng). Động từ: **mitigate** the effects / the risk (dùng rộng trong Task 2)." },
          { w: "miscarriage of justice", pos: "n", ipa: "/ˌmɪskærɪdʒ əv ˈdʒʌstɪs/", vi: "án oan, sự xử sai của toà", ex: "The risk of a miscarriage of justice is the strongest argument against the death penalty.", exVi: "Nguy cơ án oan là lập luận mạnh nhất chống án tử hình.", more: "Số nhiều: **miscarriages** of justice. a **wrongful conviction** = một bản án oan cụ thể." },
          { w: "acquit", pos: "v", ipa: "/əˈkwɪt/", vi: "tuyên trắng án", ex: "She was acquitted of all charges for lack of evidence.", exVi: "Bà được tuyên trắng án mọi cáo buộc vì thiếu chứng cứ.", more: "be acquitted **of** sth. Danh từ: **acquittal**. Trái nghĩa: **convict** sb **of** (Tập 3). Nhân đôi t: acquitted." },
          { w: "prosecute", pos: "v", ipa: "/ˈprɒsɪkjuːt/", vi: "truy tố", ex: "Companies that dump waste illegally are seldom prosecuted.", exVi: "Các công ty đổ thải trái phép hiếm khi bị truy tố.", more: "prosecute sb **for** sth. Danh từ: **prosecution** (việc truy tố; bên công tố). ⚠️ khác **persecute** (ngược đãi)." },
          { w: "incarceration", pos: "n", ipa: "/ɪnˌkɑːsəˈreɪʃn/", vi: "sự giam giữ, việc bỏ tù (trang trọng)", ex: "The cost of incarceration per prisoner exceeds that of a university place.", exVi: "Chi phí giam giữ tính trên mỗi tù nhân vượt chi phí một suất học đại học.", more: "**mass incarceration** · rates of incarceration. Động từ: incarcerate. Trang trọng hơn imprisonment (Tập 3)." },
          { w: "retribution", pos: "n", ipa: "/ˌretrɪˈbjuːʃn/", vi: "sự trừng phạt đích đáng, báo ứng (hình phạt vì kẻ phạm tội đáng bị thế)", ex: "A system built on retribution alone does little to prevent future crime.", exVi: "Một hệ thống chỉ dựa trên trừng phạt hầu như không ngăn được tội phạm về sau.", more: "Tính từ: **retributive** justice. Bộ ba mục đích của hình phạt: retribution · **deterrence** · **rehabilitation**." },
          { w: "the rule of law", pos: "n", ipa: "/ðə ˌruːl əv ˈlɔː/", vi: "pháp quyền (mọi người, kể cả chính quyền, đều dưới luật)", ex: "Foreign investors are reluctant to enter countries where the rule of law is weak.", exVi: "Nhà đầu tư nước ngoài ngại vào những nước mà pháp quyền yếu.", more: "uphold / respect / undermine the rule of law. Luôn có **the**; không phải ~~the rule of laws~~." },
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Ba mục đích của hình phạt — khung cho mọi đề Crime",
        cols: [
          { title: "Retribution — trừng phạt", items: ["kẻ phạm tội **đáng** bị phạt", "custodial sentence · incarceration", "phản biện: không giảm recidivism"] },
          { title: "Deterrence — răn đe", items: ["làm người khác **sợ** mà không phạm", "harsh penalties · prosecute", "phản biện: petty crime ít khi tính toán hậu quả"] },
          { title: "Rehabilitation — cải tạo", items: ["giúp người đó **không tái phạm**", "restorative justice · parole · training", "phản biện: khó thuyết phục nạn nhân"] },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai với nhóm từ Crime",
        items: [
          "~~commit a white-collar crime~~ khi nói chung → commit **white-collar crime** (không đếm được); commit **an offence** (đếm được).",
          "~~He was acquitted from the charge.~~ → acquitted **of** the charge. ~~prosecuted because of fraud~~ → prosecuted **for** fraud. ~~convicted for~~ → convicted **of**.",
          "**sentence** là án, không phải câu phán: a five-year sentence · be sentenced **to** five years **in** prison.",
          "Đừng dùng **criminal** làm danh từ cho mọi người phạm tội trong bài viết band 8; **offender** trung tính hơn, **perpetrator** khi nói về một hành vi cụ thể.",
        ],
      },
      {
        t: "quiz", id: "t5d8-crime", title: "Điền từ / cụm của mục 2 (8 câu)", kind: "fill",
        items: [
          { q: "High rates of ___ suggest that prison is failing to change behaviour. (tái phạm — danh từ)", answers: ["recidivism"], hint: "re-…-ism" },
          { q: "He was released on ___ after serving four years of a seven-year sentence.", answers: ["parole"], hint: "tha trước hạn có điều kiện" },
          { q: "The jury ___ her of all charges. (tuyên trắng án — quá khứ)", answers: ["acquitted"], hint: "acquit + -ed (nhân đôi t)" },
          { q: "Tax evasion and embezzlement are typical examples of ___ crime.", answers: ["white-collar"], hint: "cổ cồn trắng" },
          { q: "A fine is a non-___ sentence. (không phải tù giam)", answers: ["custodial"], hint: "non-…" },
          { q: "The conviction was later overturned and recognised as a ___ of justice.", answers: ["miscarriage"], hint: "án oan: a … of justice" },
          { q: "Few firms are ever ___ for polluting rivers. (truy tố — V3)", answers: ["prosecuted"], hint: "prosecute for" },
          { q: "In ___ justice schemes, offenders meet their victims face to face.", answers: ["restorative"], hint: "tư pháp phục hồi" },
        ],
      },

      { t: "h", text: "3. Business vòng 2 — 18 từ: khởi nghiệp, chi phí, thị trường, trách nhiệm" },
      { t: "p", text: "Tập 3 Ngày 16 đã có entrepreneur, profit, turnover, market share, merger, outsource, recession, tariff, free trade. Vòng 2 thêm từ để giải thích **vì sao** một doanh nghiệp sống hay chết (overheads, cash flow, economies of scale) và để bàn **doanh nghiệp nợ xã hội điều gì** (stakeholder, corporate social responsibility) — hai hướng đề Task 2 hay ra." },
      {
        t: "vocab", items: [
          { w: "start-up", pos: "n", ipa: "/ˈstɑːt ʌp/", vi: "công ty khởi nghiệp", ex: "Most start-ups fail within five years, usually because they run out of cash.", exVi: "Đa số công ty khởi nghiệp thất bại trong năm năm, thường vì cạn tiền.", more: "a tech start-up · **found / launch** a start-up · start-up **costs**. Có gạch nối khi là danh từ. · ↺ Ôn lại — đã học ở Tập 4 Ngày 20" },
          { w: "venture capital", pos: "n", ipa: "/ˌventʃə ˈkæpɪtl/", vi: "vốn đầu tư mạo hiểm", ex: "Without venture capital, the firm could never have hired its first engineers.", exVi: "Không có vốn mạo hiểm, công ty đã không thể tuyển những kỹ sư đầu tiên.", more: "**raise / attract** venture capital · a venture capitalist. Không đếm được." },
          { w: "scale up", pos: "phr v", ipa: "/ˌskeɪl ˈʌp/", vi: "mở rộng quy mô", ex: "The bakery struggled to scale up without lowering quality.", exVi: "Tiệm bánh chật vật mở rộng quy mô mà không hạ chất lượng.", more: "scale up **production / operations**. Trái nghĩa: scale back / down. Tính từ: scalable." },
          { w: "overheads", pos: "n (số nhiều)", ipa: "/ˈəʊvəhedz/", vi: "chi phí cố định, chi phí vận hành (thuê nhà, điện, lương văn phòng)", ex: "Online retailers have far lower overheads than high-street shops.", exVi: "Nhà bán lẻ trực tuyến có chi phí vận hành thấp hơn nhiều so với cửa hàng mặt phố.", more: "**cut / reduce / cover** overheads · high / low overheads. Anh dùng số nhiều; Mỹ: overhead." },
          { w: "cash flow", pos: "n", ipa: "/ˈkæʃ fləʊ/", vi: "dòng tiền", ex: "A profitable company can still collapse if its cash flow dries up.", exVi: "Một công ty có lãi vẫn có thể sụp nếu dòng tiền cạn.", more: "cash-flow **problems** · positive / negative cash flow. Phân biệt với **profit**: lãi trên sổ ≠ tiền trong két." },
          { w: "profit margin", pos: "n", ipa: "/ˈprɒfɪt ˌmɑːdʒɪn/", vi: "biên lợi nhuận", ex: "Supermarkets operate on very thin profit margins.", exVi: "Siêu thị hoạt động với biên lợi nhuận rất mỏng.", more: "**thin / narrow / healthy** margins · squeeze / erode margins. Giới từ: operate **on** a margin of 3%." },
          { w: "economies of scale", pos: "n (số nhiều)", ipa: "/ɪˌkɒnəmiz əv ˈskeɪl/", vi: "lợi thế kinh tế nhờ quy mô (làm càng nhiều, giá mỗi đơn vị càng rẻ)", ex: "Economies of scale allow multinationals to undercut local producers.", exVi: "Lợi thế quy mô cho phép các tập đoàn đa quốc gia bán rẻ hơn nhà sản xuất địa phương.", more: "**achieve / benefit from** economies of scale. Luôn số nhiều: economies. · ↺ Ôn lại — đã học ở Tập 4 Ngày 26" },
          { w: "monopoly", pos: "n", ipa: "/məˈnɒpəli/", vi: "thế độc quyền; công ty độc quyền", ex: "A handful of platforms now enjoy a virtual monopoly on online advertising.", exVi: "Một nhúm nền tảng nay gần như độc quyền quảng cáo trực tuyến.", more: "have / hold a monopoly **on / over** sth · break up a monopoly. Động từ: monopolise." },
          { w: "stakeholder", pos: "n", ipa: "/ˈsteɪkhəʊldə/", vi: "bên liên quan (nhân viên, khách hàng, cộng đồng… có quyền lợi gắn với tổ chức)", ex: "A firm answers not only to its shareholders but to all its stakeholders.", exVi: "Một công ty chịu trách nhiệm không chỉ với cổ đông mà với mọi bên liên quan.", more: "⚠️ khác **shareholder** (cổ đông — Tập 3). key stakeholders · consult stakeholders." },
          { w: "corporate social responsibility", pos: "n", ipa: "/ˌkɔːpərət ˌsəʊʃl rɪˌspɒnsəˈbɪləti/", vi: "trách nhiệm xã hội của doanh nghiệp (CSR)", ex: "Critics dismiss much corporate social responsibility as little more than marketing.", exVi: "Giới phê bình coi phần lớn trách nhiệm xã hội của doanh nghiệp chẳng hơn gì tiếp thị.", more: "Viết đủ lần đầu, sau đó dùng **CSR**. a CSR programme / report." },
          { w: "diversify", pos: "v", ipa: "/daɪˈvɜːsɪfaɪ/", vi: "đa dạng hoá (sản phẩm, nguồn thu, nền kinh tế)", ex: "Countries that rely on a single export need to diversify their economies.", exVi: "Những nước dựa vào một mặt hàng xuất khẩu cần đa dạng hoá nền kinh tế.", more: "diversify **into** new markets. Danh từ: **diversification**. Dùng được cho cả nước lẫn công ty." },
          { w: "niche market", pos: "n", ipa: "/ˌniːʃ ˈmɑːkɪt/", vi: "thị trường ngách", ex: "Small producers survive by serving niche markets that large firms ignore.", exVi: "Nhà sản xuất nhỏ sống được nhờ phục vụ thị trường ngách mà hãng lớn bỏ qua.", more: "find / fill / carve out a **niche**. Anh đọc /niːʃ/, Mỹ cũng đọc /nɪtʃ/." },
          { w: "disruptive", pos: "adj", ipa: "/dɪsˈrʌptɪv/", vi: "(công nghệ, mô hình) phá vỡ cách làm cũ của cả ngành; gây xáo trộn", ex: "Ride-hailing apps proved highly disruptive to the traditional taxi trade.", exVi: "Ứng dụng gọi xe đã phá vỡ mạnh nghề taxi truyền thống.", more: "disruptive **technology / innovation**. Động từ: disrupt an industry. Nghĩa thường: disruptive behaviour (quậy phá). · ↺ Ôn lại — đã học ở Tập 4 Ngày 20" },
          { w: "consumer confidence", pos: "n", ipa: "/kənˌsjuːmə ˈkɒnfɪdəns/", vi: "niềm tin của người tiêu dùng (sẵn lòng chi tiêu)", ex: "Rising unemployment quickly undermines consumer confidence.", exVi: "Thất nghiệp tăng nhanh chóng làm xói mòn niềm tin tiêu dùng.", more: "**boost / restore / dent** consumer confidence. Cùng họ: consumer **spending / demand**." },
          { w: "protectionism", pos: "n", ipa: "/prəˈtekʃənɪzəm/", vi: "chủ nghĩa bảo hộ (mậu dịch)", ex: "Protectionism may save jobs in the short term but raises prices for everyone.", exVi: "Bảo hộ mậu dịch có thể giữ việc làm trong ngắn hạn nhưng làm giá tăng với mọi người.", more: "Tính từ: **protectionist** policies / measures. Đối lập: free trade (Tập 3). Công cụ: tariffs, quotas, subsidies." },
          { w: "offshoring", pos: "n", ipa: "/ˈɒfʃɔːrɪŋ/", vi: "việc chuyển hoạt động sản xuất / dịch vụ ra nước ngoài", ex: "Offshoring has moved millions of manufacturing jobs to lower-wage economies.", exVi: "Việc chuyển sản xuất ra nước ngoài đã đưa hàng triệu việc làm chế tạo sang các nền kinh tế lương thấp hơn.", more: "Động từ: **offshore** jobs / production. Khác **outsource** (thuê ngoài, có thể trong nước — Tập 3). Chiều ngược: **reshoring**." },
          { w: "the gig economy", pos: "n", ipa: "/ðə ˈɡɪɡ ɪˌkɒnəmi/", vi: "nền kinh tế việc làm tự do theo “cuốc”, theo đơn (tài xế công nghệ, giao hàng, freelancer)", ex: "Workers in the gig economy enjoy flexibility but have little job security.", exVi: "Người lao động trong nền kinh tế việc làm tự do được linh hoạt nhưng ít bảo đảm việc làm.", more: "gig **workers** · work in the gig economy. Đi cùng: zero-hours contract, sick pay, job security (Tập 3 Ngày 14). · ↺ Ôn lại — đã học ở Tập 4 Ngày 20" },
          { w: "the bottom line", pos: "n", ipa: "/ðə ˌbɒtəm ˈlaɪn/", vi: "lợi nhuận ròng (dòng cuối của báo cáo); điều cốt lõi", ex: "Investing in staff training eventually improves the bottom line.", exVi: "Đầu tư đào tạo nhân viên rốt cuộc cải thiện lợi nhuận ròng.", more: "**affect / hurt / boost** the bottom line. Nghĩa bóng khi nói: The bottom line is that… (điều cốt lõi là…)." },
        ],
      },
      {
        t: "table", caption: "Collocation tinh — động từ đi với danh từ của mục 3", head: ["Động từ", "Danh từ", "Câu mẫu Task 2"],
        rows: [
          ["raise / attract", "venture capital", "Start-ups outside the capital find it harder to **attract venture capital**."],
          ["cover / cut", "overheads", "Many small shops can barely **cover their overheads**."],
          ["squeeze / erode", "profit margins", "Rising rents have **squeezed profit margins**."],
          ["achieve / benefit from", "economies of scale", "Co-operatives let small farmers **benefit from economies of scale**."],
          ["hold / break up", "a monopoly", "Regulators may need to **break up monopolies**."],
          ["dent / restore", "consumer confidence", "The scandal **dented consumer confidence** in the brand."],
        ],
      },
      {
        t: "note", title: "⚠️ Cặp dễ nhầm trong nhóm Business",
        items: [
          "**stakeholder** (bên liên quan) ≠ **shareholder** (cổ đông). Mọi cổ đông là stakeholder, không ngược lại.",
          "**offshoring** (ra nước ngoài) ≠ **outsourcing** (thuê bên khác làm). Có thể vừa cả hai, có thể chỉ một.",
          "**profit** (lãi) ≠ **cash flow** (tiền vào – ra) ≠ **turnover** (doanh thu). Viết “the company’s turnover is high so it is rich” là sai logic.",
          "**economies** of scale (số nhiều) ≠ **the economy**. ~~economy of scales~~ là lỗi rất hay gặp.",
          "**disruptive** trong kinh doanh là trung tính hoặc khen; đừng dịch máy móc thành “gây rối”.",
        ],
      },
      {
        t: "mcq", id: "t5d8-business", title: "Business vòng 2 — chọn phương án đúng (8 câu)",
        items: [
          { q: "A company can be profitable on paper and still go bankrupt because of poor ___ .", options: ["cash flow", "turnover", "bottom line"], correct: 0, why: "Có lãi trên sổ nhưng không có tiền mặt để trả nợ đến hạn = vấn đề dòng tiền." },
          { q: "By producing ten million units a year, the firm achieves ___ that rivals cannot match.", options: ["economy of scales", "economies of scale", "scale economics"], correct: 1, why: "Cụm cố định, economies số nhiều." },
          { q: "A factory should consult local residents, who are ___ even though they own no shares.", options: ["shareholders", "stakeholders", "entrepreneurs"], correct: 1, why: "Có quyền lợi liên quan nhưng không sở hữu cổ phần ⇒ stakeholders." },
          { q: "Moving the call centre to another country is an example of ___ .", options: ["offshoring", "protectionism", "diversifying"], correct: 0, why: "Chuyển hoạt động ra nước ngoài = offshoring." },
          { q: "Rent, electricity and insurance are all ___ .", options: ["profit margins", "overheads", "venture capital"], correct: 1, why: "Chi phí cố định để vận hành = overheads." },
          { q: "The government imposed tariffs on imported steel — a clearly ___ measure.", options: ["disruptive", "niche", "protectionist"], correct: 2, why: "Thuế quan để che chắn sản xuất trong nước = protectionist." },
          { q: "One search engine has a near ___ on the market.", options: ["monopoly", "monopolise", "monopolistic"], correct: 0, why: "a (near) monopoly on — cần danh từ." },
          { q: "Delivery riders are typical workers in ___ .", options: ["a gig economy", "the gig economy", "gig economies"], correct: 1, why: "Cụm cố định với the." },
        ],
      },

      { t: "h", text: "4. Ageing vòng 2 — 16 từ: thái độ, gia đình, chăm sóc, dân số" },
      { t: "p", text: "Tập 4 Ngày 16 đã có ageing population, life expectancy, birth rate, dependency ratio, pension, retirement age, labour shortage, carer. Vòng 2 đi vào ba chỗ đề hay hỏi: **xã hội nhìn người già thế nào** (ageism), **ai chăm** (sandwich generation, residential care) và **con số đứng sau** (fertility rate, replacement level)." },
      {
        t: "vocab", items: [
          { w: "ageism", pos: "n", ipa: "/ˈeɪdʒɪzəm/", vi: "sự phân biệt đối xử vì tuổi tác", ex: "Ageism in recruitment wastes decades of accumulated experience.", exVi: "Phân biệt tuổi tác trong tuyển dụng làm lãng phí kinh nghiệm tích luỹ hàng chục năm.", more: "Tính từ: **ageist** attitudes / remarks. Mỹ viết agism. Cùng khuôn: sexism, racism." },
          { w: "age-friendly", pos: "adj", ipa: "/ˈeɪdʒ ˌfrendli/", vi: "thân thiện với người cao tuổi (thành phố, nơi làm việc)", ex: "Benches, ramps and longer crossing times are cheap ways to make a city age-friendly.", exVi: "Ghế nghỉ, đường dốc và thời gian sang đường dài hơn là những cách rẻ để làm thành phố thân thiện với người cao tuổi.", more: "an age-friendly **city / workplace / community**. Khuôn N-friendly: child-friendly, eco-friendly." },
          { w: "intergenerational", pos: "adj", ipa: "/ˌɪntəˌdʒenəˈreɪʃənl/", vi: "giữa các thế hệ, liên thế hệ", ex: "Rising house prices have become a source of intergenerational tension.", exVi: "Giá nhà tăng đã thành nguồn căng thẳng giữa các thế hệ.", more: "intergenerational **fairness / conflict / solidarity / living**. Bảy âm tiết, trọng âm chính ở **-ra-**. · ↺ Ôn lại — đã học ở Tập 4 Ngày 28" },
          { w: "the sandwich generation", pos: "n", ipa: "/ðə ˈsænwɪdʒ ˌdʒenəˌreɪʃn/", vi: "“thế hệ bánh mì kẹp”: người trung niên vừa nuôi con vừa chăm cha mẹ già", ex: "Members of the sandwich generation often cut their working hours to care for a parent.", exVi: "Người thuộc thế hệ bánh mì kẹp thường giảm giờ làm để chăm cha mẹ.", more: "Dùng được cả khi viết (báo chí, học thuật đều dùng). Luôn có **the**. · ↺ Ôn lại — đã học ở Tập 4 Ngày 8" },
          { w: "filial piety", pos: "n", ipa: "/ˌfɪliəl ˈpaɪəti/", vi: "lòng hiếu thảo, đạo hiếu", ex: "In societies shaped by filial piety, placing a parent in a care home can carry a stigma.", exVi: "Ở những xã hội thấm đạo hiếu, đưa cha mẹ vào viện dưỡng lão có thể bị coi là điều đáng chê.", more: "Từ đắt cho thí sinh Việt Nam ở Part 3: a sense of **filial duty / obligation**. Không đếm được." },
          { w: "palliative care", pos: "n", ipa: "/ˈpæliətɪv keə/", vi: "chăm sóc giảm nhẹ (cho người bệnh nặng không chữa khỏi)", ex: "Good palliative care allows people to spend their final months at home.", exVi: "Chăm sóc giảm nhẹ tốt cho phép người bệnh sống những tháng cuối ở nhà.", more: "Cùng nhóm: **end-of-life care** · a hospice. Trọng âm ở âm tiết đầu: PAL-li-a-tive. · ↺ Ôn lại — đã học ở Tập 4 Ngày 8" },
          { w: "dementia", pos: "n", ipa: "/dɪˈmenʃə/", vi: "chứng sa sút trí tuệ", ex: "The number of people living with dementia is expected to rise sharply as populations age.", exVi: "Số người sống với chứng sa sút trí tuệ dự kiến tăng mạnh khi dân số già đi.", more: "people **living with** dementia (cách nói tôn trọng) · the onset of dementia. Không mạo từ. · ↺ Ôn lại — đã học ở Tập 4 Ngày 8" },
          { w: "frailty", pos: "n", ipa: "/ˈfreɪlti/", vi: "sự yếu ớt, suy yếu thể chất (của tuổi già)", ex: "Regular exercise delays the onset of frailty by several years.", exVi: "Tập thể dục đều làm chậm sự suy yếu thể chất được vài năm.", more: "Tính từ: **frail** (a frail 90-year-old). Nghĩa rộng: human frailty (sự yếu đuối của con người)." },
          { w: "assisted living", pos: "n", ipa: "/əˌsɪstɪd ˈlɪvɪŋ/", vi: "mô hình ở có hỗ trợ (căn hộ riêng, có nhân viên giúp khi cần)", ex: "Assisted living offers a middle way between total independence and a care home.", exVi: "Mô hình ở có hỗ trợ là lối giữa giữa tự lập hoàn toàn và viện dưỡng lão.", more: "an assisted-living **facility / complex**. Cùng nhóm: sheltered housing (Anh)." },
          { w: "residential care", pos: "n", ipa: "/ˌrezɪˌdenʃl ˈkeə/", vi: "chăm sóc nội trú (ở hẳn trong viện dưỡng lão)", ex: "The cost of residential care can exhaust a family’s savings within a few years.", exVi: "Chi phí chăm sóc nội trú có thể làm cạn tiền tiết kiệm của một gia đình trong vài năm.", more: "go into / be placed in residential care · a **care home** / nursing home. Đối lập: **home care** / care in the community." },
          { w: "state pension", pos: "n", ipa: "/ˌsteɪt ˈpenʃn/", vi: "lương hưu nhà nước", ex: "Raising the age at which people can claim the state pension is politically risky.", exVi: "Nâng tuổi được nhận lương hưu nhà nước là việc rủi ro về chính trị.", more: "**claim / draw / live on** a state pension. Đối lập: a private / workplace pension. Người hưởng: pensioner." },
          { w: "fertility rate", pos: "n", ipa: "/fəˈtɪləti reɪt/", vi: "tỉ suất sinh (số con trung bình của một phụ nữ)", ex: "The fertility rate has fallen below two children per woman in most developed economies.", exVi: "Tỉ suất sinh đã tụt dưới hai con mỗi phụ nữ ở đa số nền kinh tế phát triển.", more: "⚠️ khác **birth rate** (số trẻ sinh trên 1.000 dân — Tập 4). a **falling / low** fertility rate." },
          { w: "replacement level", pos: "n", ipa: "/rɪˈpleɪsmənt ˌlevl/", vi: "mức sinh thay thế (khoảng 2,1 con mỗi phụ nữ để dân số không giảm)", ex: "Once fertility drops below replacement level, the population eventually begins to shrink.", exVi: "Khi mức sinh tụt dưới mức thay thế, dân số rốt cuộc bắt đầu giảm.", more: "**below / at / above** replacement level. Con số quen dùng: about 2.1." },
          { w: "shrinking workforce", pos: "n", ipa: "/ˌʃrɪŋkɪŋ ˈwɜːkfɔːs/", vi: "lực lượng lao động thu hẹp", ex: "A shrinking workforce must support a growing number of retirees.", exVi: "Một lực lượng lao động thu hẹp phải gánh số người nghỉ hưu ngày càng đông.", more: "shrink – shrank – shrunk. Cùng khuôn: a shrinking **population / tax base**." },
          { w: "healthy life expectancy", pos: "n", ipa: "/ˌhelθi ˈlaɪf ɪkˌspektənsi/", vi: "tuổi thọ khoẻ mạnh (số năm sống không bệnh tật nặng)", ex: "Life expectancy has risen faster than healthy life expectancy, so people spend longer in poor health.", exVi: "Tuổi thọ tăng nhanh hơn tuổi thọ khoẻ mạnh, nên người ta sống lâu hơn trong tình trạng sức khoẻ kém.", more: "Lập luận band 8: vấn đề không phải sống **lâu** mà là sống lâu **trong bệnh tật**." },
          { w: "the silver economy", pos: "n", ipa: "/ðə ˌsɪlvə ɪˈkɒnəmi/", vi: "“kinh tế bạc”: thị trường hàng hoá, dịch vụ cho người cao tuổi", ex: "The silver economy is creating demand for everything from home adaptations to travel.", exVi: "Kinh tế bạc đang tạo cầu cho mọi thứ, từ cải tạo nhà tới du lịch.", more: "Góc nhìn **tích cực** về già hoá — dùng để cân bằng bài viết sau khi nêu gánh nặng." },
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Chuỗi lập luận già hoá — mỗi mắt xích một từ của hôm nay",
        steps: [
          { label: "fertility rate ↓", sub: "dưới replacement level (≈ 2,1)" },
          { label: "shrinking workforce", sub: "ít người đóng thuế hơn" },
          { label: "state pension + care ↑", sub: "dementia · frailty · residential care" },
          { label: "the sandwich generation", sub: "gánh ở giữa; filial piety vs. công việc" },
          { label: "Lối ra", sub: "age-friendly workplaces · chống ageism · healthy life expectancy ↑ · the silver economy" },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai với nhóm từ Ageing",
        items: [
          "~~the olds~~ / ~~old people~~ trong bài viết → **older people** · **the elderly** · **older adults**. “the old” đọc lên thiếu tôn trọng.",
          "**fertility rate** ≠ **birth rate**; **life expectancy** ≠ **healthy life expectancy**. Dùng đúng cặp là dấu hiệu band 8.",
          "~~suffer dementia~~ → **have / live with / develop** dementia. ~~send parents to nursing house~~ → place a parent **in a care home**.",
          "**retire** là nội động từ: ~~He was retired at 60~~ → He **retired** at 60. (be retired = đang là người đã nghỉ hưu.)",
        ],
      },
      {
        t: "quiz", id: "t5d8-ageing", title: "Điền từ / cụm của mục 4 (8 câu)", kind: "fill",
        items: [
          { q: "Refusing to interview anyone over fifty is a clear case of ___ .", answers: ["ageism"], hint: "phân biệt vì tuổi" },
          { q: "Adults caring for both children and elderly parents are known as the ___ generation.", answers: ["sandwich"], hint: "bánh mì kẹp" },
          { q: "A fertility rate of about 2.1 is called ___ level.", answers: ["replacement"], hint: "mức sinh thay thế" },
          { q: "In many Asian cultures, ___ piety obliges children to look after their parents.", answers: ["filial"], hint: "hiếu thảo" },
          { q: "___ care focuses on comfort rather than cure. (chăm sóc giảm nhẹ)", answers: ["Palliative", "palliative"], hint: "p-…-tive care" },
          { q: "Housing several age groups together is a form of ___ living.", answers: ["intergenerational"], hint: "liên thế hệ" },
          { q: "A ___ workforce means fewer taxpayers for every pensioner. (thu hẹp)", answers: ["shrinking"], hint: "shrink + -ing" },
          { q: "Businesses selling to older customers are part of the ___ economy.", answers: ["silver"], hint: "kinh tế bạc" },
        ],
      },

      { t: "h", text: "5. Dùng ngay — câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples", items: [
          { en: "Since short custodial sentences do little to reduce recidivism, non-violent offenders might be better dealt with through restorative justice.", vi: "Vì án tù ngắn hầu như không giảm tái phạm, người phạm tội không bạo lực có lẽ nên được xử lý bằng tư pháp phục hồi. (Task 2 — Crime)" },
          { en: "White-collar crime is prosecuted far less often than street crime, which undermines public faith in the rule of law.", vi: "Tội phạm cổ cồn trắng bị truy tố ít hơn hẳn tội phạm đường phố, điều này làm xói mòn niềm tin của công chúng vào pháp quyền. (Task 2 — Crime)" },
          { en: "Small retailers cannot match the economies of scale of the chains, so their best hope lies in a niche market.", vi: "Nhà bán lẻ nhỏ không thể sánh lợi thế quy mô của các chuỗi, nên hy vọng tốt nhất của họ nằm ở một thị trường ngách. (Task 2 — Business)" },
          { en: "I’d say the gig economy suits students like me — the flexibility’s great — but I wouldn’t want to rely on it with a family to support.", vi: "Tôi cho rằng kinh tế việc làm tự do hợp với sinh viên như tôi — linh hoạt thì tuyệt — nhưng tôi không muốn phải dựa vào nó khi có gia đình phải nuôi. (Part 3 — Business)" },
          { en: "With fertility below replacement level, a shrinking workforce will have to fund the state pension of a far larger retired population.", vi: "Với mức sinh dưới mức thay thế, một lực lượng lao động thu hẹp sẽ phải chi trả lương hưu nhà nước cho số người nghỉ hưu đông hơn nhiều. (Task 2 — Ageing)" },
          { en: "In Vietnam there’s still a strong sense of filial piety, so most people my parents’ age would feel guilty about residential care.", vi: "Ở Việt Nam đạo hiếu vẫn còn mạnh, nên đa số người tuổi bố mẹ tôi sẽ thấy áy náy về chuyện gửi viện dưỡng lão. (Part 3 — Ageing)" },
        ],
      },
      {
        t: "note", title: "💡 Văn phong: từ nào cho Viết, từ nào khi Nói",
        items: [
          "**Viết + Nói đều hợp:** recidivism, custodial sentence, overheads, economies of scale, ageism, fertility rate, the sandwich generation.",
          "**Chủ yếu khi Viết:** incarceration, retribution, mitigating circumstances, protectionism. Khi nói, dùng prison, punishment cho tự nhiên rồi **một** lần dùng từ trang trọng.",
          "**Chủ yếu khi Nói:** The bottom line is…, a start-up, scale up. Trong Task 2 viết profitability, new firms, expand.",
          "Mỗi bài Task 2 dùng **4–6 từ chủ đề** đúng chỗ là đủ cho band 8. Nhồi 15 từ thì giám khảo thấy danh sách, không thấy lập luận.",
        ],
      },
      {
        t: "quiz", id: "t5d8-tv-dich", title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (6 câu)", kind: "translate",
        grammar: "Dùng đúng collocation và giới từ của từ hôm nay",
        items: [
          { q: "Ông ta được tuyên trắng án tội biển thủ.", answers: ["He was acquitted of embezzlement."], hint: "be acquitted of · embezzlement" },
          { q: "Án tù ngắn không làm giảm tái phạm.", answers: ["Short custodial sentences do not reduce recidivism.", "Short custodial sentences do not cut recidivism.", "Short prison sentences do not reduce recidivism.", "Short custodial sentences don't reduce recidivism."], hint: "short custodial sentences · reduce · recidivism" },
          { q: "Các cửa hàng nhỏ khó trang trải chi phí vận hành.", answers: ["Small shops struggle to cover their overheads.", "Small shops find it hard to cover their overheads.", "Small shops find it difficult to cover their overheads.", "Small shops struggle to cover overheads."], hint: "struggle to · cover · overheads" },
          { q: "Các công ty lớn hưởng lợi thế kinh tế nhờ quy mô.", answers: ["Large companies benefit from economies of scale.", "Large firms benefit from economies of scale.", "Big companies benefit from economies of scale."], hint: "benefit from · economies of scale" },
          { q: "Tỉ suất sinh đã giảm xuống dưới mức thay thế.", answers: ["The fertility rate has fallen below replacement level.", "The fertility rate has dropped below replacement level.", "The fertility rate has fallen below the replacement level."], hint: "the fertility rate · fall below · replacement level" },
          { q: "Phân biệt tuổi tác đẩy người lao động lớn tuổi ra khỏi thị trường lao động.", answers: ["Ageism pushes older workers out of the labour market.", "Ageism forces older workers out of the labour market.", "Ageism pushes older workers out of the labor market.", "Ageism drives older workers out of the labour market."], hint: "ageism · push … out of · the labour market" },
        ],
      },
      {
        t: "note", title: "📌 Trước khi sang bài 2",
        items: [
          "Nghỉ ít nhất **15 phút**. Đề 9 cần đầu óc tỉnh; đừng làm đề ngay sau 90 phút học từ.",
          "Từ hôm nay **không nhất thiết** xuất hiện trong Đề 9. Nếu đề hợp thì dùng 3–4 từ; không hợp thì thôi — đừng bẻ đề để khoe từ.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d8-viet",
    kind: "writing",
    title: "Viết: Writing Đề 9 — Task 1 + Task 2 trong 60 phút (hướng dẫn làm đề)",
    goal: "Làm trọn phần Writing của Đề 9 ở Online Test đúng 60 phút, một mạch: giữ đúng khung giờ 20 + 40, áp khung map hai mốc và khung problem / solution band 8, soát theo sổ lỗi của riêng mình trước khi nộp — rồi đọc bảng chấm, soi bài mẫu và viết lại đoạn yếu nhất.",
    minutes: 110,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Hôm nay bạn **làm đề thật**, không học dạng mới: phần **Writing của Đề 9** (mức band 7.0–7.5) ở **Online Test** — `/language/en/ielts/thi-may`, bộ **Đề 9**.",
          "Bài này gồm ba chặng: **trước đề** (35 phút: phân giờ, ôn nhanh hai dạng bằng đề khác, checklist) → **làm đề** (60 phút) → **sau đề** (15 phút: đọc bảng chấm, soi bài mẫu, ghi sổ lỗi).",
          "Đề 9 có **Task 1 là bản đồ hai mốc** và **Task 2 là problem / solution**. Nội dung đề không nằm trong bài này — bạn chỉ thấy nó khi bấm “Bắt đầu”.",
          "Đẩy cả 4 tiêu chí, nhưng thứ đề đo chính là **quản lý thời gian** và **tỉ lệ câu sạch** dưới áp lực (đích band 8: 0–1 lỗi mỗi bài).",
          "Nối lại: Tập 3 Ngày 28 (map), Tập 4 Ngày 22 (problem / solution band 7), Tập 5 Ngày 2 (band 7 so với 8), Ngày 3 (sổ lỗi), Ngày 4 (lập luận sâu), Ngày 7 (bị động + rút gọn).",
        ],
      },

      { t: "h", text: "1. Đề 9 Writing trong một bảng" },
      {
        t: "table", head: ["", "Task 1", "Task 2"],
        rows: [
          ["Dạng", "**Map** — hai bản đồ cùng một khu, một mốc quá khứ và hiện nay", "**Problem / solution** — hai câu hỏi: vấn đề gì? biện pháp gì?"],
          ["Thời gian", "20 phút", "40 phút"],
          ["Số từ tối thiểu", "150 (đích 170–190)", "250 (đích 280–320)"],
          ["Tỉ trọng điểm", "1/3", "**2/3**"],
          ["Thước đo band 8", "Overview nói được **khu này đổi vai trò gì**; thân bài chia theo khu, không liệt kê", "Giải pháp **trúng nguyên nhân**, có đánh giá tính khả thi và **xếp hạng**"],
          ["Lỗi kéo xuống band 6.5", "Không có overview · giải thích nguyên nhân · dùng left / right thay phương hướng", "Liệt kê 4 giải pháp một dòng · “the government should raise awareness” · bịa số liệu"],
        ],
      },
      {
        t: "note", title: "📌 Luật chơi của ngày làm đề",
        items: [
          "**Một mạch 60 phút**, không dừng đồng hồ, không tra từ, không mở bài học. Kết quả chỉ có nghĩa khi điều kiện giống phòng thi.",
          "Phần **Reading** và **Speaking** của Đề 9 cũng làm ở Online Test — hôm nay nếu còn sức, hoặc sáng mai trước Ngày 9. **Listening** là bài 3 của hôm nay.",
          "Đừng làm cả bốn kỹ năng liền nhau nếu chưa từng thử: Writing 60 phút + nghỉ 20 phút + Listening 32 phút là vừa cho một buổi.",
        ],
      },

      { t: "h", text: "2. Sáu mươi phút — chia thế nào và giữ thế nào" },
      {
        t: "sodo", kind: "flow", title: "Khung giờ Writing (ôn Tập 4 Ngày 28) — nhìn đồng hồ ở 4 mốc",
        steps: [
          { label: "0′–3′ · Task 1: đọc bản đồ", sub: "khoanh cái GIỮ / ĐỔI công năng / MỚI / MẤT; nghĩ 1 câu về vai trò cả khu" },
          { label: "3′–17′ · viết Task 1", sub: "mở bài 1 câu · overview 2 câu · 2 thân bài theo khu" },
          { label: "17′–20′ · soát Task 1", sub: "thì · mạo từ · giới từ của động từ thay đổi — rồi CHUYỂN, dù chưa ưng" },
          { label: "20′–25′ · Task 2: dàn ý", sub: "đếm vế · 2 vấn đề · 2 giải pháp khớp gốc · câu xếp hạng" },
          { label: "25′–55′ · viết Task 2", sub: "4 đoạn · mỗi thân bài ≈ 100–110 từ" },
          { label: "55′–60′ · soát Task 2", sub: "3 lượt theo sổ lỗi cá nhân (Ngày 3)" },
        ],
      },
      {
        t: "table", caption: "Làm Task nào trước?", head: ["Thứ tự", "Lợi", "Rủi ro", "Hợp với ai"],
        rows: [
          ["Task 1 → Task 2 (mặc định)", "Khởi động bằng bài ngắn, có số liệu sẵn; vào Task 2 khi tay đã nóng", "Sa đà Task 1 tới phút 25–28 ⇒ Task 2 thiếu kết bài", "Người **giữ được mốc 20 phút**"],
          ["Task 2 → Task 1", "Bài 2/3 điểm được làm lúc tỉnh nhất", "Task 2 dễ kéo tới 45 phút ⇒ Task 1 không có overview", "Người hay **hụt giờ ở Task 2**"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba lỗi phân giờ làm mất nhiều điểm hơn mọi lỗi ngữ pháp",
        items: [
          "**Task 2 thiếu kết bài.** Một bài không kết luận bị chặn ở Task Response band 6 dù thân bài hay tới đâu. Nếu phút 53 chưa viết kết: dừng thân bài, viết hai câu kết ngay.",
          "**Task 1 dài 230 từ.** Không ai cộng điểm cho độ dài; 40 từ thừa là 4 phút lấy từ Task 2.",
          "**Bỏ dàn ý để “tiết kiệm” 5 phút.** Bài không dàn ý thường phải xoá một đoạn giữa chừng — mất 8 phút.",
        ],
      },
      { t: "rule", formula: "Task 1: 3′ đọc + 14′ viết + 3′ soát  ·  Task 2: 5′ dàn ý + 30′ viết + 5′ soát", vi: "Bốn mốc phải nhìn đồng hồ: phút 3 · 20 · 25 · 55. Tới mốc là chuyển." },

      { t: "h", text: "3. Ôn nhanh ① — map hai mốc ở band 8 (bằng một bản đồ KHÁC đề)" },
      { t: "p", text: "Hai bản đồ dưới đây là một khu xưởng dệt **hư cấu** — không phải bản đồ của Đề 9. Dùng nó để nạp lại quy trình: **phân loại thay đổi → một câu về vai trò → chia theo khu**." },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Ashby Mill site, 1990",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 0, w: 14, h: 1.2, label: "River Ash" },
              { x: 0, y: 8.6, w: 14, h: 0.9, label: "Mill Lane" },
            ],
            boxes: [
              { x: 0.5, y: 2.6, w: 3.2, h: 4, label: "Workers' cottages" },
              { x: 4.5, y: 2.6, w: 5.2, h: 3.6, label: "Textile mill" },
              { x: 4.5, y: 6.8, w: 5.2, h: 1.4, label: "Loading yard" },
              { x: 10.4, y: 2.6, w: 3.1, h: 2.2, label: "Coal yard" },
              { x: 10.4, y: 5.4, w: 3.1, h: 2.8, label: "Waste ground" },
            ],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Ashby Mill site, today",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 0, w: 14, h: 1.2, label: "River Ash" },
              { x: 0, y: 1.4, w: 14, h: 0.6, label: "Riverside footpath" },
              { x: 0, y: 8.6, w: 14, h: 0.9, label: "Mill Lane" },
            ],
            boxes: [
              { x: 0.5, y: 2.6, w: 3.2, h: 4, label: "Workers' cottages" },
              { x: 4.5, y: 2.6, w: 5.2, h: 3.6, label: "Apartments (mill building)" },
              { x: 4.5, y: 6.8, w: 2.4, h: 1.4, label: "Playground" },
              { x: 7.3, y: 6.8, w: 2.4, h: 1.4, label: "Shops" },
              { x: 10.4, y: 2.6, w: 3.1, h: 2.2, label: "Riverside café" },
              { x: 10.4, y: 5.4, w: 3.1, h: 2.8, label: "Car park" },
            ],
          },
        },
      },
      {
        t: "table", caption: "3 phút đọc bản đồ — phân loại trước khi viết", head: ["Loại", "Trên bản đồ Ashby", "Động từ hợp"],
        rows: [
          ["**Giữ nguyên**", "Workers’ cottages · Mill Lane · dòng sông", "remain unchanged · have been retained"],
          ["**Giữ vỏ, đổi công năng**", "Textile mill → apartments", "be converted into · be turned into"],
          ["**Bỏ cũ, xây mới**", "Loading yard → playground + shops · coal yard → café", "be replaced by · make way for"],
          ["**Đất trống được dùng**", "Waste ground → car park", "be developed into · now serve as"],
          ["**Mới hẳn**", "Riverside footpath", "be laid · be added · be built along"],
          ["**Câu vai trò**", "Công nghiệp → nhà ở + giải trí; bờ sông mở cho công chúng", "be transformed from… into…"],
        ],
      },
      {
        t: "passage", title: "Overview + thân bài 1 — band 7 (ước tính), 97 từ",
        paras: [
          { text: "Overall, there have been many changes to the site. The mill is now apartments and there are some new facilities such as a café, a car park, shops and a playground." },
          { text: "In 1990, there was a textile mill in the centre of the site. Now it has become apartments. To the south of the mill there was a loading yard, but now there are a playground and shops. In the east, the coal yard was replaced by a café and the waste ground changed into a car park. A new path was built next to the river." },
        ],
      },
      {
        t: "passage", title: "Overview + thân bài 1 — band 8 (ước tính), 135 từ",
        paras: [
          { text: "Overall, the site has been transformed from a place of industry into a residential and leisure area. While the mill building itself and the workers’ cottages have been retained, every piece of land that once served the factory has been given a new use, and the riverbank has been opened up to walkers." },
          { text: "The mill, which dominated the centre of the site in 1990, has been converted into apartments rather than demolished. The loading yard that lay immediately to its south has made way for a playground and a row of shops. To the east, the coal yard has been replaced by a riverside café, with the waste ground beside it now serving as a car park. Along the northern edge, a footpath has been laid beside the River Ash, where none existed in 1990." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bản band 7", "Bản band 8", "Bài học cho Đề 9"],
        rows: [
          ["Task Achievement", "Overview = “many changes” + danh sách công trình", "Overview nêu **đổi vai trò** (industry → residential and leisure), **cái còn lại**, và ý về bờ sông", "Trước khi viết, trả lời: khu này **từng là gì, nay là gì**?"],
          ["Coherence & Cohesion", "In 1990… Now… but now… — lặp khuôn then / now", "Đi theo không gian: centre → south → east → northern edge; “its south”, “beside it” nối các câu", "Chia theo **khu**; dùng đại từ và vị trí để nối"],
          ["Lexical Resource", "become · changed into · was built · next to", "transformed · retained · converted · made way for · dominated · laid", "Mỗi kiểu thay đổi một động từ riêng (bảng trên)"],
          ["Grammar", "Trộn thì: **was replaced / was built** cho mốc “today” (sai thì); câu đơn", "Hiện tại hoàn thành bị động nhất quán; mệnh đề quan hệ, **that lay**, **with… now serving**, **where none existed**", "Mốc “today” ⇒ has / have been + V3 (Ngày 7 mục 8)"],
        ],
      },
      {
        t: "table", caption: "Giới từ cố định của ngôn ngữ bản đồ — sai một chữ là một lỗi GRA", head: ["Cụm", "Giới từ", "Ví dụ"],
        rows: [
          ["be converted / turned / transformed", "**into**", "converted into apartments"],
          ["be replaced", "**by** (cái mới) · **with** (khi có người thay)", "replaced by a café"],
          ["make way / give way", "**for** / **to**", "made way for a playground"],
          ["to the north / south", "**of**", "to the south of the mill"],
          ["in the north-east · on the waterfront · at the eastern end", "**in** (vùng) · **on** (mép, bờ) · **at** (điểm)", "in the east of the site"],
          ["on the site", "**of**", "on the site of the former coal yard"],
        ],
      },
      {
        t: "quiz", id: "t5d8-viet-map-dien", title: "Ngôn ngữ bản đồ — điền MỘT từ (8 câu)", kind: "fill",
        items: [
          { q: "The mill has been converted ___ apartments.", answers: ["into"], hint: "convert + ?" },
          { q: "The loading yard has made way ___ a playground and shops.", answers: ["for"], hint: "make way + ?" },
          { q: "The coal yard has been replaced ___ a café.", answers: ["by"], hint: "replaced + ? + cái mới" },
          { q: "The car park lies ___ the east of the site.", answers: ["in"], hint: "vùng bên trong khu ⇒ in" },
          { q: "The shops stand to the south ___ the apartments.", answers: ["of"], hint: "to the south + ?" },
          { q: "The cottages have ___ unchanged. (vẫn còn nguyên — V3)", answers: ["remained"], hint: "remain – remained" },
          { q: "A footpath has been ___ along the river. (lay – ? – ?)", answers: ["laid"], hint: "V3 của lay" },
          { q: "The café stands on the ___ of the former coal yard. (trên nền / vị trí của)", answers: ["site"], hint: "on the ___ of" },
        ],
      },
      { t: "rule", formula: "Overview = vai trò cũ → vai trò mới + cái còn lại  ·  thân bài theo KHU  ·  mốc “today” ⇒ has / have been + V3", vi: "Khung map hai mốc band 8. Không nêu nguyên nhân, không thêm năm tháng ngoài bản đồ." },

      { t: "h", text: "4. Ôn nhanh ② — problem / solution ở band 8 (bằng một đề KHÁC)" },
      { t: "p", text: "**Đề luyện (tự soạn, không phải Đề 9):** In many countries, the number of older people who lose money to telephone and online fraud is rising. What problems does this cause? What measures could be taken to tackle it? — Đề này dùng được từ của bài 1 (perpetrator, dementia, prosecute). Dưới đây chỉ xét **đoạn giải pháp**, vì đó là nơi band 7 và band 8 tách nhau." },
      {
        t: "sodo", kind: "flow", title: "Một giải pháp band 8 có bốn phần (ôn Tập 4 Ngày 22)",
        steps: [
          { label: "AI làm", sub: "banks · employers · local councils — không chỉ “the government”" },
          { label: "LÀM GÌ, cụ thể", sub: "một cơ chế tả được trong một câu" },
          { label: "VÌ SAO có tác dụng", sub: "nối vào nguyên nhân: since they depend on…" },
          { label: "GIỚI HẠN / cái giá", sub: "would inconvenience… but… — rồi xếp hạng" },
        ],
      },
      {
        t: "passage", title: "Đoạn giải pháp — band 7 (ước tính), 85 từ",
        paras: [
          { text: "There are several solutions to this problem. Firstly, the government should raise awareness about fraud among old people. For example, they can make TV programmes and advertisements to teach the elderly how to recognise scams. Secondly, banks should have stricter rules. If banks check transactions more carefully, criminals will find it more difficult to steal money. Finally, families should take care of their old parents and help them to use technology. If all of these measures are taken, I believe the problem will be solved." },
        ],
      },
      {
        t: "passage", title: "Đoạn giải pháp — band 8 (ước tính), 142 từ",
        paras: [
          { text: "The most effective safeguard lies with the banks rather than with the victims. If a large transfer to an account the customer has never used before were held for twenty-four hours, and a relative named in advance were notified, most scams would collapse, since they depend on persuading the victim to act before anyone else can intervene. Such a delay would inconvenience a few legitimate payments, but that seems a small price. Public information campaigns, by contrast, are easier to organise but less reliable: fraudsters change their scripts faster than any leaflet can be rewritten, and those most at risk — people living alone, or in the early stages of dementia — are precisely the ones least likely to remember a warning. Of the two measures, then, it is the first that deserves priority, with education serving as a supplement rather than a substitute." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bản band 7", "Bản band 8", "Bài học cho Đề 9"],
        rows: [
          ["Task Response", "Ba giải pháp, mỗi cái một câu; “the problem will be solved” (khái quát quá mức)", "Hai giải pháp; cái đầu có cơ chế + lý do + cái giá; cái sau được **đánh giá là yếu hơn** và nói rõ vì sao", "Hai giải pháp sâu > bốn giải pháp nông; luôn có **câu xếp hạng**"],
          ["Coherence & Cohesion", "Firstly · Secondly · Finally", "rather than · Such a delay · by contrast · then · with… serving as", "Nối bằng **quan hệ giữa các ý**, không bằng số thứ tự"],
          ["Lexical Resource", "raise awareness · stricter rules · take care of", "safeguard · legitimate payments · fraudsters change their scripts · a supplement rather than a substitute", "Từ gọi đúng tên cơ chế"],
          ["Grammar", "should + V lặp ba lần; điều kiện loại 1", "Điều kiện loại 2 bị động (were held… were notified… would collapse) · câu chẻ (it is the first that…) · so sánh · 0 lỗi", "Giải pháp là **giả định** ⇒ would / could, không phải will"],
        ],
      },
      {
        t: "patterns", rows: [
          { formula: "If + S + were + V3, S + would + V  — giải pháp như một giả định", vi: "Thay cho “The government should…”. Cho phép nêu luôn kết quả.", examples: [
            { en: "If evening buses were subsidised, far more commuters would leave their cars at home.", vi: "Nếu xe buýt buổi tối được trợ giá, nhiều người đi làm hơn hẳn sẽ để ô tô ở nhà." },
          ] },
          { formula: "Such + N + would + V, but + S + V  — nêu cái giá rồi cân", vi: "Một câu đánh giá tính khả thi (chi phí · thực thi · sự chấp nhận).", examples: [
            { en: "Such a scheme would be costly to run, but the cost is modest beside that of doing nothing.", vi: "Một chương trình như vậy sẽ tốn kém, nhưng chi phí ấy nhỏ so với cái giá của việc không làm gì." },
          ] },
          { formula: "Of the two measures, it is + the former / the latter + that + V", vi: "Câu xếp hạng — đặt cuối thân bài 2 hoặc trong kết bài.", examples: [
            { en: "Of the two measures, it is the latter that is likely to produce results within a few years.", vi: "Trong hai biện pháp, chính biện pháp sau mới có khả năng cho kết quả trong vài năm." },
          ] },
        ],
      },
      {
        t: "mcq", id: "t5d8-viet-ps-chon", title: "Problem / solution — chọn phương án tốt nhất (6 câu)",
        items: [
          { q: "Đề: “…because most people now shop online. What problems does this cause? What can be done?” — Thân bài 1 nên viết gì?", options: ["Vì sao người ta mua sắm trực tuyến", "Các vấn đề mà xu hướng này gây ra", "Ưu và nhược điểm của mua sắm trực tuyến"], correct: 1, why: "Nguyên nhân đã cho sẵn sau “because”; đề hỏi problems + measures. Viết về nguyên nhân hay ưu–nhược là lạc vế." },
          { q: "Câu nào là GIẢI PHÁP band 8?", options: ["The government should encourage people to be more careful.", "People need to raise their awareness of this issue.", "Councils could cut business rates for shops that stay open in the evening, giving them an edge that online sellers cannot copy."], correct: 2, why: "C có ai làm (councils), làm gì (cut rates for…), vì sao có tác dụng (an edge…). A và B là lời khuyên." },
          { q: "Câu nào đánh giá tính khả thi?", options: ["This solution is very good and effective.", "Admittedly, this would reduce council income in the short term, though empty shops pay no rates at all.", "Therefore, everyone should support this solution."], correct: 1, why: "B nêu cái giá (giảm thu) rồi cân lại bằng một lý lẽ." },
          { q: "Chọn câu dùng thì / thức đúng cho một giải pháp.", options: ["If the scheme is introduced, the problem will be solved completely.", "If such a scheme were introduced, the pressure on town centres would ease considerably.", "If such a scheme was introduce, the pressure would be ease."], correct: 1, why: "Giả định ⇒ loại 2; “would ease considerably” thận trọng hơn “will be solved completely”." },
          { q: "Kết bài nào hợp band 8?", options: ["In conclusion, there are many problems and many solutions, and we should all work together.", "In conclusion, this is a serious problem. I hope it will be solved in the future.", "In short, the decline of local shops costs towns both jobs and a meeting place; of the remedies discussed, tax relief is the quicker, while better public transport would do more in the long run."], correct: 2, why: "C tóm vấn đề chính và XẾP HẠNG hai giải pháp (nhanh / bền)." },
          { q: "Bạn đang ở phút 52, thân bài 2 mới có một giải pháp. Làm gì?", options: ["Viết tiếp giải pháp thứ hai cho đầy đủ, kết bài tính sau", "Viết một câu cho giải pháp hai, rồi viết kết bài hai câu", "Xoá giải pháp một để viết lại cho hay hơn"], correct: 1, why: "Bài thiếu kết luận mất điểm Task Response nhiều hơn bài có giải pháp thứ hai ngắn." },
        ],
      },
      { t: "rule", formula: "Giải pháp = AI + LÀM GÌ + since / because (vì sao có tác dụng) + but (giới hạn)  →  Of the two measures, it is… that…", vi: "Hai giải pháp, mỗi cái bốn phần, rồi một câu xếp hạng. Giả định ⇒ would / could." },

      { t: "h", text: "5. Checklist trước khi bấm “Bắt đầu”" },
      {
        t: "table", head: ["Việc", "Vì sao", "✔"],
        rows: [
          ["Đã nghỉ ≥ 15 phút sau bài Từ vựng; uống nước; tắt thông báo điện thoại", "60 phút không ngắt", "☐"],
          ["Một tờ giấy nháp + bút (dàn ý viết tay nhanh hơn gõ)", "Phòng thi máy cũng phát giấy nháp", "☐"],
          ["Đồng hồ nhìn thấy được; ghi sẵn 4 mốc: 3′ · 20′ · 25′ · 55′", "Mục 2", "☐"],
          ["Mở **Sổ lỗi**, chép ra giấy **3 quy tắc cá nhân** (Ngày 3 mục 7)", "Lượt soát cuối chỉ tìm đúng 3 lỗi này", "☐"],
          ["Quyết định thứ tự: Task 1 → 2 hay 2 → 1", "Không đổi ý giữa chừng", "☐"],
          ["Tự hứa: không tra từ, không xem lại bài học, không dừng đồng hồ", "Điều kiện thi thật", "☐"],
        ],
      },
      {
        t: "table", caption: "Giấy nháp — kẻ sẵn hai khung này trước khi bắt đầu", head: ["Task 1 (3 phút)", "Task 2 (5 phút)"],
        rows: [
          ["Giữ: … · Đổi công năng: … · Thay mới: … · Mới hẳn: …", "Vế 1 (problems): P1 … → hệ quả … · P2 … → hệ quả …"],
          ["Câu vai trò: từ … thành …", "Vế 2 (measures): S1 ai / làm gì / vì sao / giới hạn · S2 …"],
          ["Thân 1 = khu …  ·  Thân 2 = khu …", "Xếp hạng: … nhanh hơn, … bền hơn  ·  1 ví dụ cụ thể cho mỗi thân bài"],
        ],
      },

      { t: "h", text: "6. Soát bài trong đề — 3 phút và 5 phút" },
      {
        t: "table", head: ["Lượt", "Task 1 (3 phút) — tìm gì", "Task 2 (5 phút) — tìm gì"],
        rows: [
          ["1", "Có **overview** chưa? Có câu nào giải thích nguyên nhân không? (xoá)", "Đã trả lời **đủ hai câu hỏi** chưa? Có kết bài chưa?"],
          ["2", "**Thì**: mốc “today” ⇒ has / have been + V3; mốc năm cũ ⇒ was / were", "**Động từ**: chủ – vị khi danh từ chính ở xa; mẫu động từ (prevent sb from doing…)"],
          ["3", "**Giới từ + mạo từ**: converted into · to the north of · **the** north-east · **a** new hotel", "**3 quy tắc cá nhân** đã chép ra giấy — mỗi lần đọc chỉ tìm một lỗi"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo soát khi còn rất ít thời gian",
        items: [
          "Còn 2 phút: chỉ đọc **động từ** của từng câu (thì + hoà hợp). Bỏ qua phần còn lại.",
          "Còn 1 phút: kiểm **số từ** (Online Test đếm sẵn) và đoạn kết.",
          "Không viết lại cả câu trong lúc soát; chỉ sửa từ. Viết lại câu ở phút 59 thường sinh lỗi mới.",
        ],
      },

      { t: "h", text: "7. Làm đề — 60 phút" },
      { t: "p", text: "Mở **Online Test** (`/language/en/ielts/thi-may`) → bộ **Đề 9** → **Academic Writing — Đề 9**. Bấm bắt đầu, làm một mạch **60 phút**, nộp cả hai bài để AI chấm 4 tiêu chí. Xong rồi quay lại đây làm mục 8. ⏱️ Đừng đọc mục 8 trước khi làm đề." },
      {
        t: "quiz", id: "t5d8-viet-truoc-de", title: "Kiểm nhanh trước khi vào đề — điền số hoặc từ (6 câu)", kind: "fill",
        items: [
          { q: "Task 2 chiếm ___ phần ba số điểm Writing. (viết số)", answers: ["2", "two"], hint: "1/3 và ?/3" },
          { q: "Tới phút thứ ___ phải chuyển sang Task 2 (nếu làm Task 1 trước).", answers: ["20"], hint: "mốc thứ hai" },
          { q: "Dàn ý Task 2 dài ___ phút. (viết số)", answers: ["5"], hint: "20′ → 25′" },
          { q: "Mốc là “today”: The old school ___ been turned into flats. (trợ động từ)", answers: ["has"], hint: "has / have been + V3" },
          { q: "Câu vai trò của overview: The area has been ___ from an industrial site into a leisure district.", answers: ["transformed", "converted", "changed"], hint: "be … from A into B" },
          { q: "Câu xếp hạng: Of the two measures, it is the second ___ would work faster.", answers: ["that", "which"], hint: "câu chẻ: it is… ___ …" },
        ],
      },

      { t: "h", text: "8. Sau khi nộp — 15 phút quan trọng hơn 60 phút vừa rồi" },
      {
        t: "sodo", kind: "flow", title: "Sau đề — làm đúng thứ tự này",
        steps: [
          { label: "① Tự chấm trước", sub: "ghi band bạn ĐOÁN cho từng tiêu chí, trước khi xem AI" },
          { label: "② Đọc bảng chấm AI", sub: "so với số bạn đoán: lệch ≥ 1 band ở tiêu chí nào?" },
          { label: "③ Soi bài mẫu band 8–8.5", sub: "mỗi bài mẫu CỐ Ý có 2 lỗi nhỏ — tìm trước khi mở “Soi lỗi”" },
          { label: "④ Ghi Sổ lỗi", sub: "mỗi lỗi một dòng: câu sai · sửa · nhóm · quy tắc của tôi" },
          { label: "⑤ Viết lại đoạn yếu nhất", sub: "ô viết bên dưới — hôm nay hoặc sáng mai" },
        ],
      },
      {
        t: "table", caption: "Tự chấm — đánh dấu trước khi xem điểm AI", head: ["Câu hỏi", "Task 1", "Task 2"],
        rows: [
          ["Xong trong khung giờ (20′ / 40′)?", "☐ có ☐ lố … phút", "☐ có ☐ lố … phút"],
          ["Đủ số từ mà không quá dài?", "☐ 150–200", "☐ 250–330"],
          ["Ý chính có ngay ở chỗ giám khảo tìm?", "☐ overview nêu đổi vai trò", "☐ mở bài báo trước hai tầng vấn đề + hướng giải pháp"],
          ["Tổ chức?", "☐ theo khu, không theo danh sách", "☐ mỗi giải pháp đủ 4 phần + câu xếp hạng"],
          ["Số lỗi tôi tự tìm được khi đọc lại?", "… lỗi", "… lỗi"],
          ["Dùng được gì của Ngày 7?", "☐ N, now + N, ☐ that once + V-ed ☐ , V-ing", "—"],
        ],
      },
      {
        t: "table", caption: "Đọc band AI chấm thế nào (band ước tính — xem xu hướng, đừng xem từng 0,5)", head: ["Kết quả", "Nghĩa là", "Việc tiếp theo"],
        rows: [
          ["TA / TR thấp hơn 3 tiêu chí kia", "Thiếu overview / thiếu vế / giải pháp nông", "Ôn mục 3–4 của bài này; viết lại **dàn ý** chứ chưa cần viết lại bài"],
          ["GRA thấp nhất", "Lỗi dai dẳng còn nhiều", "Đếm lỗi theo ba nhóm của Ngày 3; cập nhật “quy tắc của tôi”"],
          ["LR thấp nhất", "Lặp từ hoặc collocation sai", "So động từ thay đổi / từ chủ đề của bạn với bài mẫu"],
          ["Mọi tiêu chí ≥ 7, chưa tới 8", "Đúng mức đề nhắm tới", "Tìm **một** chỗ trong mỗi bài có thể sâu hơn — viết lại chỗ đó"],
          ["Không kịp giờ", "Vấn đề là quy trình, không phải tiếng Anh", "Lần sau (Đề 10, Ngày 16) đổi thứ tự Task hoặc cắt Task 1 còn 170 từ"],
        ],
      },
      {
        t: "essay", id: "t5d8-viet-viet-lai", task: "Task 2", minWords: 90,
        prompt: "AFTER you have finished Writing Test 9 in the Online Test: choose the weakest body paragraph of your Task 2 answer and rewrite it here (90–140 words). Keep your original ideas, but make sure each measure says WHO would do WHAT, WHY it would work and what its LIMIT is, and end with one sentence ranking your measures. Paste the Task 2 question from Test 9 as the first line so that the examiner can see what you are answering.",
        tips: [
          "Chỉ viết lại sau khi đã đọc bảng chấm và bài mẫu — nhưng KHÔNG chép câu của bài mẫu.",
          "Dùng một câu điều kiện loại 2 bị động (If… were + V3, … would…) và một câu xếp hạng (Of the two measures, it is… that…).",
          "Soát đúng 3 quy tắc cá nhân trước khi nộp. Đích: 0 lỗi trong đoạn này.",
        ],
      },
      {
        t: "note", title: "📌 Mang gì sang Ngày 9 và Ngày 10",
        items: [
          "**Ngày 9** mổ Reading + Listening Đề 9; **Ngày 10** mổ Writing + Speaking Đề 9 (tự chấm, 4 lỗi cố ý trong bài mẫu). Mục 8 này là bước đầu: chấm sơ bộ và phân loại lỗi ngay hôm nay, để Ngày 10 chỉ còn mổ sâu.",
          "Giữ tờ giấy nháp và bảng tự chấm: tới **Đề 10 (Ngày 16)** bạn sẽ so hai lần.",
          "Nếu Task 1 map làm bạn mất hơn 22 phút: đánh dấu để học kỹ **Ngày 18** (map band 8 có mốc tương lai).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d8-nghe",
    kind: "listening",
    title: "Nghe: Listening Đề 9 — 40 câu, tốc độ thật, sáu giọng (hướng dẫn làm đề)",
    goal: "Làm trọn phần Listening của Đề 9 ở Online Test như thi thật (4 Part, 40 câu, nghe một lần, 2 phút kiểm cuối) với mục tiêu 32+/40: dùng hết giờ đọc trước cho từng dạng câu, không để một câu lỡ kéo theo câu sau, kiểm đủ sáu mục trong 2 phút cuối, rồi phân loại từng câu sai để mang sang Ngày 9.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy band nào",
        items: [
          "Làm **Listening Đề 9** (mức band 7.0–7.5) ở **Online Test** — `/language/en/ielts/thi-may`, bộ **Đề 9**. Mục tiêu: **32+/40** (≈ band 7.5).",
          "Ba chặng: **trước đề** (25 phút: bản đồ đề, việc làm trong giờ đọc trước, khởi động tai) → **làm đề** (30 phút + 2 phút kiểm) → **sau đề** (20 phút: chấm, phân loại lỗi).",
          "Đề có **sáu giọng** (Canada, Anh, Úc, Mỹ, Ireland, New Zealand) và nói ở **tốc độ thật** (~165–170 từ/phút). Bạn đã luyện đủ cả sáu giọng ở Tập 3–4 và Ngày 1 · 4 · 5.",
          "🔊 Trước khi nghe: 5 phút **nói theo** (shadowing) tám câu tốc độ thật để tai và miệng vào nhịp.",
          "Đừng xem lời thoại sau khi làm: **Ngày 9** mổ đề này từng câu — hôm nay chỉ phân loại lỗi.",
        ],
      },

      { t: "h", text: "1. Đề 9 Listening trong một bảng" },
      {
        t: "table", head: ["Part", "Kiểu bài", "Giọng", "Dạng câu", "Đọc trước"],
        rows: [
          ["1 (câu 1–10)", "Hội thoại giao dịch qua điện thoại, 2 người", "Canada + Anh", "Form completion (1–6) · Note completion (7–10)", "30 giây"],
          ["2 (câu 11–20)", "Một người nói với nhóm thành viên mới", "Úc", "MCQ A / B / C (11–15) · Matching với hộp A–G (16–20)", "30 giây"],
          ["3 (câu 21–30)", "Hai sinh viên + giảng viên bàn một bản báo cáo", "Ireland + Anh + Mỹ", "MCQ (21–24) · Chọn HAI đáp án (25–26) · Flow-chart (27–30)", "40 giây"],
          ["4 (câu 31–40)", "Bài giảng đại học, một người", "New Zealand", "Note completion (31–36) · Sentence completion (37–40)", "45 giây"],
        ],
      },
      {
        t: "note", title: "📌 Ba điều khác các đề Tập 4",
        items: [
          "**Nhanh hơn một nấc** và ít chỗ ngừng “lấy hơi” giữa hai đáp án. Ở Part 4, hai đáp án có khi cách nhau chỉ một câu.",
          "**Mỗi Part một giọng khác**; Part 3 có ba giọng nói xen nhau. 10 giây đầu của mỗi Part hãy dùng để “bắt giọng”, chưa có đáp án ở đó.",
          "**Bẫy sửa lời nhiều hơn**: người nói nêu một phương án, rồi tự sửa hoặc bị người kia bác. Đáp án thường là cái nói **sau**.",
        ],
      },

      { t: "h", text: "2. Giờ đọc trước — 30 đến 45 giây làm gì cho từng dạng" },
      { t: "p", text: "Band 7 dùng giờ đọc trước để **đọc**. Band 8 dùng nó để **đoán**: loại từ, phạm vi đáp án, và chỗ nào có thể có bẫy. Dưới đây là việc cụ thể cho bảy dạng có trong Đề 9." },
      {
        t: "table", head: ["Dạng", "Trong giờ đọc trước", "Khi nghe"],
        rows: [
          ["Form (P1)", "Mỗi ô: **chữ hay số?** tên riêng (sẽ đánh vần) · ngày · giá · số điện thoại. Xem giới hạn từ.", "Chờ chỗ đánh vần và chỗ **sửa lời** (“sorry, that’s…”). Số: fifteen / fifty."],
          ["Note (P1 · P4)", "Đọc **tiêu đề nhỏ** để biết bài chia mấy mục; đoán loại từ từng chỗ trống.", "Tiêu đề nhỏ = tín hiệu chuyển mục. Lạc thì bám tiêu đề kế."],
          ["MCQ một đáp án (P2 · P3)", "Gạch **từ khoá của câu hỏi** (không phải của phương án); đọc lướt 3 phương án, tìm chỗ chúng **khác nhau**.", "Cả ba phương án đều sẽ được nhắc. Đáp án là cái được **khẳng định**, thường bằng từ khác hẳn."],
          ["Matching với hộp (P2)", "Đọc **hộp A–G trước**, tóm mỗi lựa chọn bằng 1–2 từ; rồi mới đọc 5 mục.", "5 mục đi **theo thứ tự**; hộp thì không. Có 2 lựa chọn thừa."],
          ["Chọn HAI (P3)", "Gạch chân chữ **TWO**. Tóm 5 phương án A–E.", "Hai đáp án có thể đến sát nhau hoặc cách xa; thứ tự A–E không theo băng."],
          ["Flow-chart (P3)", "Đọc **các bước đã cho** để nắm trình tự; đoán loại từ.", "Người nói có thể kể một bước bị **bỏ** hoặc **đổi** — chỉ điền bước thật sự đã làm."],
          ["Sentence (P4)", "Từ ngay trước / sau chỗ trống ⇒ loại từ, số ít / nhiều (Tập 4 Ngày 8).", "Câu trên giấy là paraphrase; nghe **ý**, điền **từ nguyên văn**."],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay phí giờ đọc trước theo ba kiểu",
        items: [
          "**Dịch từng câu hỏi sang tiếng Việt.** Không kịp. Chỉ gạch 1–2 từ khoá mỗi câu.",
          "**Đọc kỹ câu 1–3 rồi hết giờ.** Phải lướt được **cả nhóm**; câu cuối nhóm quan trọng ngang câu đầu.",
          "**Dùng giờ đọc trước của Part sau để sửa Part trước.** Chỉ được liếc lại ô **để trống** (đoán nhanh); thời gian còn lại là của Part mới.",
        ],
      },
      { t: "rule", formula: "Giờ đọc trước = giới hạn từ → loại đáp án → từ khoá câu hỏi → (matching) đọc hộp trước", vi: "Mỗi ô trống bạn phải biết trước nó là số, tên, danh từ hay tính từ." },

      { t: "h", text: "3. Bẫy mức band 7.5 — và cách đỡ" },
      {
        t: "table", head: ["Bẫy", "Nghe như", "Cách đỡ"],
        rows: [
          ["Sửa lời", "“We used to… but this year we’ve…” · “Actually, no —” · “I’d pencilled in X, but…”", "Viết đáp án bằng bút chì trong đầu; chờ hết lượt lời mới chốt"],
          ["Bác đề xuất", "A: “What about X?” — B: “X is booked.” — A: “Y, then.”", "Đáp án là cái cả hai **đồng ý**, không phải cái được nhắc đầu tiên"],
          ["Phủ định ẩn", "“hardly any” · “I wouldn’t say…” · “far from” · “no longer”", "Nghe được từ khoá chưa đủ — nghe cả **dấu** của câu"],
          ["Hai con số", "“It’s twenty-eight normally, twenty-two for members.”", "Đọc lại câu hỏi: hỏi giá nào, cho ai?"],
          ["Từ khoá lặp y nguyên", "Phương án B dùng đúng từ trong băng nhưng nói về việc khác", "Từ lặp nguyên văn thường là **nhiễu**; đáp án được paraphrase"],
          ["Đáp án đến sớm", "Đáp án câu 31 nằm ngay câu thứ hai của bài giảng", "Bút ở câu đầu tiên của nhóm **trước khi** băng chạy"],
        ],
      },
      {
        t: "note", title: "💡 Lỡ một câu thì làm gì — luật 5 giây",
        items: [
          "Nghe thấy từ khoá của **câu kế tiếp** ⇒ câu trước đã qua. Bỏ ngay, không cố nhớ lại.",
          "Ghi nhanh **bất cứ thứ gì** nghe được vào ô đó (một âm tiết, một phỏng đoán) rồi nhảy tiếp. Ô trống chắc chắn 0 điểm; phỏng đoán thì không.",
          "Tuyệt đối không nghĩ về câu đã lỡ trong lúc băng còn chạy. Một câu lỡ kéo theo hai câu kế là kiểu mất điểm phổ biến nhất ở band 7.",
        ],
      },

      { t: "h", text: "4. Hai phút kiểm cuối — sáu mục, theo thứ tự" },
      { t: "p", text: "Bản thi máy không có 10 phút chép đáp án như thi giấy; chỉ có **2 phút** sau Part 4. Đừng nghe lại trong đầu; chạy đúng sáu mục này (Tập 2 Ngày 19 đã giới thiệu, hôm nay làm ở tốc độ thi)." },
      {
        t: "table", head: ["#", "Kiểm", "Ví dụ lỗi", "Giây"],
        rows: [
          ["1", "**Ô trống** — điền hết, kể cả đoán", "bỏ trống câu 27", "15"],
          ["2", "**Giới hạn từ** từng nhóm", "ONE WORD mà viết “the fence”", "20"],
          ["3", "**Số ít / số nhiều** — đọc lại câu với đáp án", "“three type”", "30"],
          ["4", "**Chính tả** tên riêng, từ dài, phụ âm đôi", "accomodation · vaccum", "30"],
          ["5", "**Số**: đơn vị, ngày tháng, 15 / 50", "viết £ hai lần · 13 thay vì 30", "15"],
          ["6", "**Chữ cái** MCQ / matching — đúng câu, không lệch dòng", "trả lời câu 17 vào ô 18", "10"],
        ],
      },
      { t: "rule", formula: "2 phút = ô trống → giới hạn từ → số ít / nhiều → chính tả → số → chữ cái", vi: "Luôn theo thứ tự này: mục trên cùng mất điểm chắc chắn nhất và sửa nhanh nhất." },

      { t: "h", text: "5. 🔊 Khởi động tai — nói theo tám câu tốc độ thật" },
      { t: "p", text: "Vận động viên không chạy 100 mét khi cơ còn nguội. Năm phút **nói theo** (shadowing) làm tai bạn quen lại với âm yếu, nối âm và nuốt âm trước khi băng đề chạy. Bấm nghe mẫu, rồi nói **cùng lúc** với mẫu lần hai; đừng đọc từng chữ rời." },
      {
        t: "phatam", id: "t5d8-phat-am", title: "Nói theo — tám câu tốc độ thật (âm yếu + nối âm)",
        note: "Mỗi câu hai lượt: lượt 1 nghe và nhẩm, lượt 2 nói cùng tốc độ. Chỗ khó thường là trợ động từ bị nén (I’d have /aɪd əv/, should have been /ʃəd əv bɪn/) và cặp số -teen / -ty.",
        items: [
          { text: "I'd have thought you'd want to book ahead.", ipa: "aɪd əv θɔːt juːd wɒnt tə bʊk əhed", vi: "Tôi cứ nghĩ là anh sẽ muốn đặt trước. — I’d have nén thành /aɪd əv/." },
          { text: "It's not so much the cost as the timing.", ipa: "ɪts nɒt səʊ mʌtʃ ðə kɒst əz ðə taɪmɪŋ", vi: "Vấn đề không hẳn là chi phí mà là thời điểm. — as đọc yếu /əz/." },
          { text: "We used to open at eight, but hardly anyone came.", ipa: "wi juːst tu əʊpən ət eɪt bət hɑːdli eniwʌn keɪm", vi: "Trước đây chúng tôi mở lúc tám giờ, nhưng hầu như không ai đến. — bẫy sửa lời + phủ định ẩn." },
          { text: "What we want is the oldest one, not the average.", ipa: "wɒt wi wɒnt ɪz ði əʊldɪst wʌn nɒt ði ævərɪdʒ", vi: "Cái ta cần là cá thể già nhất, không phải mức trung bình. — nhấn tương phản." },
          { text: "Could you spell that for me, please?", ipa: "kʊd ju spel ðæt fə mi pliːz", vi: "Anh đánh vần giúp tôi được không? — could you /kʊdʒu/ khi nói nhanh." },
          { text: "That's fifteen, not fifty, one five.", ipa: "ðæts fɪftiːn nɒt fɪfti wʌn faɪv", vi: "Là mười lăm, không phải năm mươi — một, năm. — nhấn -TEEN." },
          { text: "It should have been sent out last week.", ipa: "ɪt ʃəd əv bɪn sent aʊt lɑːst wiːk", vi: "Lẽ ra nó phải được gửi đi từ tuần trước. — /ʃəd əv bɪn/ (Tập 4 Ngày 8)." },
          { text: "So before you can turn a diameter into a date, you need a local curve.", ipa: "səʊ bɪfɔː ju kən tɜːn ə daɪæmɪtər ɪntu ə deɪt ju niːd ə ləʊkl kɜːv", vi: "Vậy nên trước khi đổi được một đường kính thành một niên đại, bạn cần một đường cong tăng trưởng tại chỗ. — câu dài, một hơi." },
        ],
      },

      { t: "h", text: "6. Khởi động ① — kiểu Part 1, giọng Canada + Ireland (câu 1–6)" },
      { t: "p", text: "Đọc phiếu trong **20 giây**, đoán loại đáp án từng ô, rồi nghe **một lần**. Đoạn này tự soạn, không thuộc Đề 9. — **Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.**" },
      {
        t: "note", title: "NORTHBANK REHEARSAL STUDIOS — Booking Form (Questions 1–6)",
        items: [
          "Name: Cormac **1** ______",
          "Type of group: a **2** ______ quartet",
          "Room booked: Room **3** ______",
          "Regular session: **4** ______ evenings, 7–9 pm",
          "Price per session (members): £ **5** ______",
          "Group must bring: their own music **6** ______",
        ],
      },
      {
        t: "listen", id: "t5d8-nghe-khoi-dong-1", title: "Warm-up 1 — Booking a rehearsal room",
        note: "Kịch bản tự soạn · khoảng 275 từ · ~170 từ/phút · giọng Canada (nhân viên) và Ireland (người gọi).",
        dan: { so: "Day 8, Warm-up 1", boiCanh: "a man telephoning a rehearsal studio to book a room for his music group.", cau: [1, 6] },
        lines: [
          { who: "Renée", voice: "ca-nu", text: "Northbank Rehearsal Studios, Renée speaking." },
          { who: "Cormac", voice: "ie-nam", text: "Hi there. I'm looking to book a room for a regular weekly rehearsal, if you've anything going." },
          { who: "Renée", voice: "ca-nu", text: "Sure, we've a few slots left. Can I take your name first?" },
          { who: "Cormac", voice: "ie-nam", text: "It's Cormac Devlin. That's D-E-V-L-I-N." },
          { who: "Renée", voice: "ca-nu", text: "Got it. And what sort of group is it? I'm guessing a band — most people who call on a Monday are." },
          { who: "Cormac", voice: "ie-nam", text: "Ah no, the jazz trio's my brother's lot, they're with you already. We're a string quartet. So no drums, you'll be glad to hear." },
          { who: "Renée", voice: "ca-nu", text: "The neighbours will be. OK, for four of you I'd normally suggest Room 2. It's the cheapest, and it's on the ground floor." },
          { who: "Cormac", voice: "ie-nam", text: "Is there a piano in it? We sometimes have a pianist join us." },
          { who: "Renée", voice: "ca-nu", text: "Not in 2, no. The only small room with a piano is Room 5, upstairs. It's an upright, and it was tuned last month." },
          { who: "Cormac", voice: "ie-nam", text: "We'll go for 5, then. Now, the day. I was hoping for Tuesdays." },
          { who: "Renée", voice: "ca-nu", text: "Tuesdays are full right through to the summer, I'm afraid. I could do Wednesday or Thursday, seven till nine." },
          { who: "Cormac", voice: "ie-nam", text: "I teach on Wednesdays, so it'd have to be the Thursday." },
          { who: "Renée", voice: "ca-nu", text: "Thursday it is. Now, the price. It's twenty-eight pounds a session, but if one of you takes out a membership, that comes down to twenty-two. Membership's fifteen for the year, so it pays for itself in three weeks." },
          { who: "Cormac", voice: "ie-nam", text: "Go on, then, put me down as a member." },
          { who: "Renée", voice: "ca-nu", text: "Done. One last thing. We provide chairs, and there's a kettle in the corridor. What we don't supply any more is music stands — they kept disappearing — so you'll need to bring those yourselves." },
          { who: "Cormac", voice: "ie-nam", text: "No bother. We've plenty." },
        ],
      },
      {
        t: "quiz", id: "t5d8-nghe-khoi-dong-1-dien", title: "Warm-up 1 — Questions 1–6 (ONE WORD AND/OR A NUMBER)", kind: "fill",
        items: [
          { q: "1. Name: Cormac ______", answers: ["Devlin", "DEVLIN"], hint: "được đánh vần" },
          { q: "2. Type of group: a ______ quartet", answers: ["string"], hint: "không phải nhóm của người anh" },
          { q: "3. Room booked: Room ______", answers: ["5", "five"], hint: "phòng có đàn piano" },
          { q: "4. Regular session: ______ evenings", answers: ["Thursday", "thursday", "Thursdays"], hint: "ba ngày được nhắc" },
          { q: "5. Price per session (members): £ ______", answers: ["22", "twenty-two", "twenty two"], hint: "giá cho thành viên" },
          { q: "6. Group must bring: their own music ______", answers: ["stands"], hint: "thứ studio KHÔNG còn cung cấp" },
        ],
      },
      {
        t: "note", title: "Giải thích Warm-up 1 — bẫy nằm ở đâu",
        items: [
          "**1 Devlin** — được đánh vần D-E-V-L-I-N ở tốc độ nói thường; viết hoa chữ đầu. Nghe đánh vần bằng giọng Ireland: tên chữ cái E và I dễ lẫn nếu bạn chỉ quen giọng Anh.",
          "**2 string** — bẫy bác phỏng đoán: nhân viên đoán “a band”, người gọi nhắc “the jazz trio” (nhóm của anh trai) rồi mới nói “We’re a string quartet”.",
          "**3 5** — bẫy bác đề xuất: Room 2 được gợi ý trước (rẻ nhất, tầng trệt) nhưng không có piano ⇒ “We’ll go for 5”.",
          "**4 Thursday** — ba ngày: Tuesday (muốn nhưng kín), Wednesday (bận dạy), Thursday (chốt).",
          "**5 22** — hai con số: 28 là giá thường, 22 là giá thành viên; 15 là phí thành viên cả năm. Câu hỏi ghi rõ “members”.",
          "**6 stands** — đáp án đến sau hai thứ studio **có** cung cấp (chairs, kettle). Số nhiều: music stands.",
        ],
      },

      { t: "h", text: "7. Khởi động ② — kiểu Part 4, giọng New Zealand (câu 7–10)" },
      { t: "p", text: "Đọc ghi chú trong **15 giây** rồi nghe **một lần**. Đoạn này tự soạn, không thuộc Đề 9; dữ kiện khoa học trong đoạn là thật. — **Complete the notes below. Write ONE WORD ONLY for each answer.**" },
      {
        t: "note", title: "DATING ROCK SURFACES WITH LICHENS — lecture notes (Questions 7–10)",
        items: [
          "• technique dates from the 1950s; its originator was a **7** ______ by training",
          "• the “map lichen” widens by less than one **8** ______ a year",
          "• on each boulder, researchers record the **9** ______ lichen (in practice, five of them)",
          "• local growth rates are worked out from **10** ______ , which carry a date",
        ],
      },
      {
        t: "listen", id: "t5d8-nghe-khoi-dong-2", title: "Warm-up 2 — Lichens as a clock",
        note: "Kịch bản tự soạn · khoảng 320 từ · ~170 từ/phút · giọng New Zealand.",
        dan: { so: "Day 8, Warm-up 2", boiCanh: "part of a lecture preparing geography students for a field trip.", cau: [7, 10] },
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "Now, before we go out to the moraine on Thursday, I want to explain how we'll be estimating the age of the rock surfaces, because we won't be using anything as sophisticated as radiocarbon. We'll be using lichens. The technique's called lichenometry, and it goes back to the nineteen fifties, when Roland Beschel — who wasn't a geologist, as people tend to assume, but a botanist — realised that the lichens growing on Alpine rocks could serve as a kind of clock." },
          { who: "Lecturer", voice: "nz-nu", text: "The principle's simple. When a glacier retreats, it leaves bare rock behind. Sooner or later lichens colonise that rock, and they then grow outwards in a rough circle, extremely slowly. The species we use most, the yellow-green map lichen, typically adds less than a millimetre to its width each year, so a patch the size of your palm may have been sitting there for well over a century." },
          { who: "Lecturer", voice: "nz-nu", text: "Now, you might think the sensible thing would be to measure every lichen on a boulder and take the average. We don't. The average tells you very little, because new lichens keep arriving for decades. What we want is the individual that settled first, and so it's the largest one we record — in practice the five largest, to guard against a freak." },
          { who: "Lecturer", voice: "nz-nu", text: "The obvious weakness is that growth isn't the same everywhere. It depends on rainfall, on the type of rock, on how long the snow lies. So before you can turn a diameter into a date, you need a local growth curve, and for that you need surfaces whose age isn't in doubt. Old bridges and walls have been used, but far and away the most convenient are gravestones, since they come with the year carved on them. So on Wednesday afternoon — and I realise this sounds odd for a geography field trip — we'll be spending two hours in the village churchyard with rulers." },
        ],
      },
      {
        t: "quiz", id: "t5d8-nghe-khoi-dong-2-dien", title: "Warm-up 2 — Questions 7–10 (ONE WORD ONLY)", kind: "fill",
        items: [
          { q: "7. its originator was a ______ by training", answers: ["botanist"], hint: "nghề; cẩn thận nghề bị gạt đi" },
          { q: "8. widens by less than one ______ a year", answers: ["millimetre", "millimeter"], hint: "đơn vị đo" },
          { q: "9. researchers record the ______ lichen", answers: ["largest"], hint: "tính từ so sánh nhất" },
          { q: "10. growth rates are worked out from ______ , which carry a date", answers: ["gravestones"], hint: "danh từ số nhiều" },
        ],
      },
      {
        t: "note", title: "Giải thích Warm-up 2 — bẫy nằm ở đâu",
        items: [
          "**7 botanist** — gạt rồi mới nêu: “who wasn’t a geologist, as people tend to assume, but a botanist”. Viết geologist là rơi đúng bẫy.",
          "**8 millimetre** — paraphrase: “adds less than a millimetre to its width each year” ↔ widens by less than one… a year. “century” và “palm” là nhiễu cùng đoạn.",
          "**9 largest** — bác phương án hợp lý: “take the average. We don’t.” ⇒ “it’s the largest one we record”. Chú ý phải điền tính từ, không điền “five”.",
          "**10 gravestones** — liệt kê rồi chọn: “Old bridges and walls have been used, but far and away the most convenient are gravestones”. “carry a date” ↔ “come with the year carved on them”.",
          "Cả bốn câu đều có **một phương án bị gạt đi ngay trước đáp án** — đúng kiểu bẫy của Part 4 trong Đề 9. Đúng 9–10/10 ở hai đoạn khởi động: bạn đã sẵn sàng.",
        ],
      },

      { t: "h", text: "8. Checklist trước khi bấm nghe — rồi làm đề" },
      {
        t: "table", head: ["Việc", "Vì sao", "✔"],
        rows: [
          ["Tai nghe (không dùng loa laptop); âm lượng thử bằng đoạn khởi động", "Giọng vùng + tốc độ thật cần nghe rõ phụ âm cuối", "☐"],
          ["Phòng yên, 35 phút không ai gọi; điện thoại úp xuống", "Băng chỉ phát **một lần**", "☐"],
          ["Một tờ giấy nháp cho Part 2 (tóm hộp A–G) và Part 3", "Gõ phím chậm hơn viết tay khi đang nghe", "☐"],
          ["Tự hứa: không dừng, không tua, không bật lời thoại", "Điểm chỉ có nghĩa khi đúng điều kiện thi", "☐"],
          ["Nhớ luật 5 giây: lỡ câu ⇒ ghi phỏng đoán ⇒ nhảy tiếp", "Mục 3", "☐"],
          ["Nhớ sáu mục của 2 phút cuối", "Mục 4", "☐"],
        ],
      },
      { t: "p", text: "Mở **Online Test** (`/language/en/ielts/thi-may`) → bộ **Đề 9** → **Listening — Đề 9**. Làm một mạch **4 Part**, dùng hết **2 phút kiểm** rồi mới nộp. Ghi lại số câu đúng từng Part và quay lại đây làm mục 9. 🎧 Đừng mở lời thoại hay phần giải thích của đề hôm nay — để dành cho Ngày 9." },

      { t: "h", text: "9. Sau khi nộp — chấm, rồi phân loại lỗi" },
      {
        t: "table", caption: "Điểm thô → band Listening (ước tính, theo bảng quy đổi của Online Test)", head: ["Đúng / 40", "Band", "So với đích của Đề 9"],
        rows: [
          ["35–36", "8.0", "Vượt đích — đích của Đề 11"],
          ["32–34", "7.5", "**Đạt đích**"],
          ["30–31", "7.0", "Sát đích — xem 2–3 câu sai là loại lỗi gì"],
          ["26–29", "6.5", "Chưa đạt — Ngày 9 mổ kỹ; cân nhắc ôn Tập 4 Ngày 25 · 29"],
          ["≤ 25", "≤ 6.0", "Làm lại Đề 8 trước khi sang Đề 10"],
        ],
      },
      { t: "p", text: "Con số tổng chưa nói gì. Điều cần biết là **vì sao** mỗi câu sai — và hôm nay bạn phân loại **khi trí nhớ còn nóng**, chưa cần lời thoại. Mỗi câu sai thuộc một trong năm loại:" },
      {
        t: "table", head: ["Loại", "Dấu hiệu", "Thuốc"],
        rows: [
          ["**A. Không nghe ra âm**", "Nghe thành một chuỗi không tách được từ; thường ở giọng lạ hoặc chỗ nói nhanh", "Nghe chép chính tả 10 phút / ngày; shadowing (mục 5)"],
          ["**B. Nghe ra, viết sai**", "Biết từ đó nhưng sai chính tả, sai số ít / nhiều, thừa từ", "Sáu mục của 2 phút cuối; danh sách từ hay sai chính tả của riêng bạn"],
          ["**C. Dính bẫy**", "Chọn phương án được nhắc trước / từ lặp nguyên văn; bỏ sót chỗ sửa lời", "Bảng mục 3; chờ hết lượt lời mới chốt"],
          ["**D. Lạc chỗ**", "Đang ở câu 23 thì băng đã sang câu 25; mất 2–3 câu liền", "Luật 5 giây; bám từ khoá câu kế"],
          ["**E. Đọc đề không kịp**", "Băng chạy rồi mà chưa hiểu câu hỏi / chưa đọc hộp", "Việc trong giờ đọc trước (mục 2)"],
        ],
      },
      {
        t: "mcq", id: "t5d8-nghe-phan-loai", title: "Tập phân loại — mỗi tình huống thuộc loại lỗi nào? (6 câu)",
        items: [
          { q: "Bạn viết “accomodation” — nghe đúng từ nhưng thiếu một chữ m.", options: ["A. Không nghe ra âm", "B. Nghe ra, viết sai", "C. Dính bẫy"], correct: 1, why: "Nghe đúng, chính tả sai ⇒ loại B. Thuốc: mục 4 của 2 phút kiểm." },
          { q: "Người nói: “We used to charge ten pounds, but it went up to twelve in January.” Bạn điền 10.", options: ["C. Dính bẫy", "D. Lạc chỗ", "E. Đọc đề không kịp"], correct: 0, why: "Bẫy sửa lời (used to… but…) ⇒ loại C." },
          { q: "Ở Part 3 bạn còn nghĩ về câu 22 thì nghe thấy từ khoá của câu 24; câu 23 bỏ trống.", options: ["A. Không nghe ra âm", "C. Dính bẫy", "D. Lạc chỗ"], correct: 2, why: "Mất câu vì bám câu cũ ⇒ loại D. Thuốc: luật 5 giây." },
          { q: "Ở phần matching của Part 2, băng nói tới mục thứ hai mà bạn vẫn chưa đọc xong hộp A–G.", options: ["B. Nghe ra, viết sai", "D. Lạc chỗ", "E. Đọc đề không kịp"], correct: 2, why: "Chưa nắm hộp lựa chọn trước khi băng chạy ⇒ loại E. Thuốc: đọc hộp TRƯỚC, tóm mỗi lựa chọn 1–2 từ." },
          { q: "Giọng New Zealand nói “seven” nghe như “sivin”; bạn không nhận ra đó là một con số.", options: ["A. Không nghe ra âm", "B. Nghe ra, viết sai", "C. Dính bẫy"], correct: 0, why: "Không giải mã được âm của giọng vùng ⇒ loại A. Thuốc: nghe thêm giọng đó (Tập 5 Ngày 1 · 4)." },
          { q: "Đề ghi ONE WORD ONLY; bạn điền “the samples”.", options: ["B. Nghe ra, viết sai", "C. Dính bẫy", "E. Đọc đề không kịp"], correct: 0, why: "Nghe đúng nhưng vượt giới hạn từ ⇒ loại B (lỗi ghi đáp án). Mục 2 của 2 phút kiểm bắt được lỗi này." },
        ],
      },
      {
        t: "table", caption: "Bảng của bạn — điền ngay sau khi làm Đề 9 (chép vào Sổ lỗi)", head: ["Part", "Đúng / 10", "Câu sai", "Loại (A–E)"],
        rows: [
          ["1", "…", "…", "…"],
          ["2", "…", "…", "…"],
          ["3", "…", "…", "…"],
          ["4", "…", "…", "…"],
          ["Tổng", "… / 40", "", "Loại nhiều nhất: …"],
        ],
      },
      {
        t: "note", title: "📌 Chuẩn bị cho Ngày 9 (mổ Đề 9)",
        items: [
          "Mang theo **bảng trên**. Ngày 9 đi qua những câu dễ sai nhất của Đề 9 kèm lời thoại và bẫy; bạn sẽ đối chiếu loại lỗi mình tự đoán với loại thật.",
          "Nếu loại **A** nhiều nhất: tối nay nghe lại **một** Part sai nhiều nhất, vẫn chưa mở lời thoại, và xem lần hai bắt thêm được mấy câu.",
          "Nếu loại **C / D** nhiều nhất: vấn đề là chiến thuật, không phải tai — đọc lại mục 2 và 3 trước Ngày 9.",
          "Còn sức thì làm **Reading Đề 9** (60 phút) hôm nay; **Speaking Đề 9** để sáng mai, trước Ngày 10.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d8-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 8 — Tội phạm · Kinh doanh · Già hoá vòng 2 · ngôn ngữ bản đồ · problem / solution · nghe có bẫy sửa lời",
    goal: "Củng cố sau ngày làm Đề 9: dùng đúng 52 từ vòng 2 kèm giới từ và họ từ, viết câu bản đồ đúng thì và đúng giới từ, nhận ra giải pháp band 8, và nghe một đoạn ngắn có bốn chỗ sửa lời.",
    minutes: 50,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay (46 câu)",
        items: [
          "Hôm nay bạn đã làm đề 90 phút, nên bài tập **nhẹ hơn thường lệ** và có thể làm vào sáng mai.",
          "**I–V (32 câu)** — từ vựng ba chủ đề: điền, chọn, họ từ, dịch.",
          "**VI (6 câu)** — câu bản đồ: thì + giới từ. **VII (4 câu)** — problem / solution.",
          "**VIII (4 câu)** — nghe một đoạn 1 phút có bẫy sửa lời.",
          "Việc quan trọng nhất của hôm nay vẫn là **Sổ lỗi sau Đề 9** — nếu chưa ghi, ghi trước rồi mới làm bài tập.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 8 trong một hình",
        center: "Ngày 8 · Đề 9",
        branches: [
          { label: "Crime vòng 2", items: ["recidivism · parole", "custodial sentence", "restorative justice"] },
          { label: "Business vòng 2", items: ["overheads · cash flow", "economies of scale", "stakeholder ≠ shareholder"] },
          { label: "Ageing vòng 2", items: ["ageism", "sandwich generation", "replacement level"] },
          { label: "Writing Đề 9", items: ["20′ + 40′", "map: đổi vai trò", "giải pháp 4 phần + xếp hạng"] },
          { label: "Listening Đề 9", items: ["đoán trước loại đáp án", "luật 5 giây", "2 phút: 6 mục"] },
        ],
      },

      { t: "h", text: "I. Crime vòng 2 — điền từ (7 câu) — ôn bài Từ vựng mục 2" },
      {
        t: "note", title: "Hộp từ (mỗi từ dùng một lần; chia dạng nếu cần)",
        items: ["perpetrator · petty · incarceration · retribution · embezzle · mitigating · organised · launder"],
      },
      {
        t: "quiz", id: "t5d8-bt-crime", title: "I. Điền từ trong hộp (thừa một từ)", kind: "fill",
        items: [
          { q: "Shoplifting and graffiti are usually classed as ___ crime.", answers: ["petty"], hint: "tội vặt" },
          { q: "The treasurer had ___ more than a million pounds from the charity. (V3)", answers: ["embezzled"], hint: "biển thủ" },
          { q: "Victims of online fraud rarely find out who the ___ was.", answers: ["perpetrator"], hint: "thủ phạm" },
          { q: "The court accepted that his illness was a ___ circumstance.", answers: ["mitigating"], hint: "tình tiết giảm nhẹ" },
          { q: "The restaurant was a front for ___ crime.", answers: ["organised", "organized"], hint: "có tổ chức" },
          { q: "Mass ___ has not made the country noticeably safer.", answers: ["incarceration"], hint: "việc bỏ tù (trang trọng)" },
          { q: "Some people see prison purely as ___ ; others see it as a chance to reform.", answers: ["retribution"], hint: "sự trừng phạt đích đáng" },
        ],
      },

      { t: "h", text: "II. Business vòng 2 — điền MỘT từ (7 câu) — ôn mục 3" },
      {
        t: "quiz", id: "t5d8-bt-business", title: "II. Điền MỘT từ (chữ cái đầu cho sẵn)", kind: "fill",
        items: [
          { q: "The café closed because it could not cover its o___ .", answers: ["overheads"], hint: "chi phí vận hành" },
          { q: "The founders raised two million dollars in venture c___ .", answers: ["capital"], hint: "vốn mạo hiểm" },
          { q: "Rising costs have squeezed the firm’s profit m___ .", answers: ["margins", "margin"], hint: "biên lợi nhuận" },
          { q: "An economy that depends on tourism alone needs to d___ .", answers: ["diversify"], hint: "đa dạng hoá" },
          { q: "Handmade bicycles are a n___ market.", answers: ["niche"], hint: "thị trường ngách" },
          { q: "The scandal badly dented consumer c___ .", answers: ["confidence"], hint: "niềm tin tiêu dùng" },
          { q: "Training costs money now but helps the b___ line in the long run.", answers: ["bottom"], hint: "lợi nhuận ròng" },
        ],
      },

      { t: "h", text: "III. Ageing vòng 2 — chọn phương án đúng (7 câu) — ôn mục 4" },
      {
        t: "mcq", id: "t5d8-bt-ageing", title: "III. Chọn phương án đúng",
        items: [
          { q: "The average number of children a woman has in her lifetime is the ___ .", options: ["birth rate", "fertility rate", "dependency ratio"], correct: 1, why: "fertility rate = số con trung bình mỗi phụ nữ; birth rate = số trẻ sinh trên 1.000 dân." },
          { q: "She lives in ___ : her own flat, with staff on call.", options: ["assisted living", "residential care", "palliative care"], correct: 0, why: "Căn hộ riêng + có người hỗ trợ khi cần = assisted living." },
          { q: "More and more people are living ___ dementia.", options: ["by", "with", "in"], correct: 1, why: "live with dementia — cụm cố định, tôn trọng người bệnh." },
          { q: "People are living longer, but ___ has risen more slowly, so the extra years are often years of illness.", options: ["healthy life expectancy", "retirement age", "replacement level"], correct: 0, why: "Sống lâu hơn nhưng số năm khoẻ mạnh tăng chậm hơn." },
          { q: "Lower kerbs and more public seating make a town more ___ .", options: ["ageist", "age-friendly", "frail"], correct: 1, why: "age-friendly = thân thiện với người cao tuổi; ageist = phân biệt tuổi tác." },
          { q: "Most workers will rely on the ___ pension when they retire.", options: ["state", "country", "public's"], correct: 0, why: "the state pension — collocation cố định." },
          { q: "Which sentence is correct?", options: ["My grandfather was retired at sixty.", "My grandfather retired at sixty.", "My grandfather was retiring at sixty years."], correct: 1, why: "retire là nội động từ: He retired at sixty." },
        ],
      },

      { t: "h", text: "IV. Họ từ và cặp dễ nhầm (6 câu) — ôn mục 2–4" },
      {
        t: "quiz", id: "t5d8-bt-ho-tu", title: "IV. Viết dạng đúng của từ trong ngoặc / chọn từ đúng", kind: "fill",
        items: [
          { q: "The ___ (prosecute) failed to prove that he had been at the scene.", answers: ["prosecution"], hint: "danh từ: bên công tố" },
          { q: "Her ___ (acquit) came as a surprise to the press.", answers: ["acquittal"], hint: "danh từ của acquit" },
          { q: "Economic ___ (diversify) takes decades, not years.", answers: ["diversification"], hint: "danh từ -ation" },
          { q: "The government adopted ___ (protect) measures to shield its steel industry.", answers: ["protectionist"], hint: "tính từ của protectionism" },
          { q: "The comment that she was “too old to learn” was plainly ___ (age).", answers: ["ageist"], hint: "tính từ của ageism" },
          { q: "Local residents are (shareholders / stakeholders) in the new factory even though they own none of it.", answers: ["stakeholders"], hint: "có quyền lợi liên quan, không sở hữu cổ phần" },
        ],
      },

      { t: "h", text: "V. Dịch sang tiếng Anh (5 câu)" },
      {
        t: "quiz", id: "t5d8-bt-dich", title: "V. Dịch — dùng từ trong gợi ý", kind: "translate",
        grammar: "Đúng collocation + giới từ của từ vòng 2",
        items: [
          { q: "Anh ta được tha trước hạn có điều kiện sau ba năm.", answers: ["He was released on parole after three years.", "He was granted parole after three years."], hint: "be released on parole" },
          { q: "Tội phạm cổ cồn trắng hiếm khi bị truy tố.", answers: ["White-collar crime is rarely prosecuted.", "White-collar crime is seldom prosecuted.", "White-collar criminals are rarely prosecuted.", "White-collar criminals are seldom prosecuted."], hint: "white-collar crime · rarely · be prosecuted" },
          { q: "Nhà bán lẻ trực tuyến có chi phí vận hành thấp hơn.", answers: ["Online retailers have lower overheads.", "Online shops have lower overheads.", "Online sellers have lower overheads."], hint: "online retailers · lower overheads" },
          { q: "Một lực lượng lao động thu hẹp phải gánh nhiều người nghỉ hưu hơn.", answers: ["A shrinking workforce has to support more retirees.", "A shrinking workforce must support more retirees.", "A shrinking workforce has to support more pensioners.", "A shrinking workforce must support more pensioners.", "A shrinking workforce has to support more retired people."], hint: "a shrinking workforce · support · retirees" },
          { q: "Thế hệ bánh mì kẹp chăm cả con cái lẫn cha mẹ già.", answers: ["The sandwich generation cares for both children and ageing parents.", "The sandwich generation looks after both children and ageing parents.", "The sandwich generation cares for both children and elderly parents.", "The sandwich generation looks after both children and elderly parents.", "The sandwich generation cares for both their children and their ageing parents."], hint: "the sandwich generation · care for · both … and" },
        ],
      },

      { t: "h", text: "VI. Câu bản đồ — thì và giới từ (6 câu) — ôn bài Viết mục 3" },
      { t: "p", text: "Hai bản đồ tưởng tượng của một ngôi làng: **2005** và **today**. Điền **một từ** (câu 1–4) hoặc **dạng đúng của động từ** (câu 5–6)." },
      {
        t: "quiz", id: "t5d8-bt-map", title: "VI. Điền từ / dạng đúng", kind: "fill",
        items: [
          { q: "The old post office has been turned ___ a café.", answers: ["into"], hint: "turn + ?" },
          { q: "The orchard has given way ___ a housing estate.", answers: ["to"], hint: "give way + ? (khác make way for)" },
          { q: "A health centre now stands ___ the site of the former garage.", answers: ["on"], hint: "? the site of" },
          { q: "The pond lies ___ the north of the church, outside the village. (ở phía bắc của)", answers: ["to"], hint: "ngoài phạm vi vật mốc ⇒ to the north of" },
          { q: "In 2005, the land east of the river ___ (occupy) by farm buildings.", answers: ["was occupied"], hint: "mốc năm đã qua ⇒ quá khứ đơn bị động" },
          { q: "Since then, most of these buildings ___ (demolish).", answers: ["have been demolished"], hint: "since then ⇒ hiện tại hoàn thành bị động" },
        ],
      },

      { t: "h", text: "VII. Problem / solution — chọn câu tốt nhất (4 câu) — ôn bài Viết mục 4" },
      { t: "p", text: "**Đề luyện (tự soạn):** Many small, independent shops in town centres are closing. What problems does this cause, and what could be done about it?" },
      {
        t: "mcq", id: "t5d8-bt-ps", title: "VII. Chọn câu tốt nhất",
        items: [
          { q: "Câu nêu VẤN ĐỀ kèm chuỗi hệ quả.", options: ["This is a very serious problem for everyone in society.", "When shops close, people lose their jobs.", "Each closure removes not only a handful of jobs but a reason to visit the centre, so the remaining traders lose customers in turn."], correct: 2, why: "C có chuỗi: đóng cửa → mất lý do ghé trung tâm → cửa hàng còn lại mất khách." },
          { q: "Câu nêu GIẢI PHÁP đủ ai – làm gì – vì sao.", options: ["Councils could cut the rent on empty units for new businesses in their first year, when overheads are hardest to cover.", "People should support small shops more.", "The government should solve this problem as soon as possible."], correct: 0, why: "A: councils (ai) · cut rent on empty units for new businesses (làm gì) · when overheads are hardest to cover (vì sao trúng)." },
          { q: "Câu nêu GIỚI HẠN của giải pháp.", options: ["This solution is perfect.", "Lower rents alone will not help a shop that sells what people now prefer to buy online.", "However, there are also some disadvantages."], correct: 1, why: "B nói rõ giải pháp không với tới trường hợp nào." },
          { q: "Câu XẾP HẠNG.", options: ["Both solutions are good.", "Of the two measures, it is cheaper rent that would act faster, whereas a livelier town centre would matter more in the long run.", "In conclusion, I agree with these solutions."], correct: 1, why: "B dùng câu chẻ + whereas để phân biệt nhanh / bền." },
        ],
      },

      { t: "h", text: "VIII. Nghe — một đoạn có bốn chỗ sửa lời (4 câu) — ôn bài Nghe mục 3" },
      { t: "p", text: "Đọc bốn dòng trong 15 giây rồi nghe **một lần**. **Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.** — Parcel depot: on Saturdays it closes at **1** ______ pm · bring photo ID and the **2** ______ number · parcels are kept for **3** ______ days · the depot is behind the **4** ______ ." },
      {
        t: "listen", id: "t5d8-bt-nghe", title: "Collecting a parcel from the depot",
        note: "Kịch bản tự soạn · khoảng 180 từ · giọng Úc và Mỹ.",
        dan: { so: "Day 8, Homework recording", boiCanh: "a man telephoning a parcel depot about a delivery he missed.", cau: [1, 4] },
        lines: [
          { who: "Clerk", voice: "au-nu", text: "Eastgate parcel depot, how can I help?" },
          { who: "Caller", voice: "us-nam", text: "Hi, I got a card through my door saying you tried to deliver a package. Can I come pick it up on Saturday?" },
          { who: "Clerk", voice: "au-nu", text: "You can, but bear in mind Saturday's a short day. During the week we're here till six, but on Saturdays we shut at one. Used to be two, but they cut the hours last year." },
          { who: "Caller", voice: "us-nam", text: "One o'clock, OK. And what do I need to bring? Just the card?" },
          { who: "Clerk", voice: "au-nu", text: "The card's handy, but we don't actually need it. What we do need is photo ID, and the reference number. Not the tracking number from the seller, that's a different thing. The reference is the eight digits printed on the card." },
          { who: "Caller", voice: "us-nam", text: "Got it. How long do you hold it for? A week?" },
          { who: "Clerk", voice: "au-nu", text: "It was seven days, but it's ten now, counting from the first delivery attempt. After that it goes back to the sender." },
          { who: "Caller", voice: "us-nam", text: "And you're on Canal Street, right? Next to the supermarket?" },
          { who: "Clerk", voice: "au-nu", text: "We moved in the spring. We're on Foundry Road now, directly behind the stadium. You can't miss the yellow doors." },
        ],
      },
      {
        t: "quiz", id: "t5d8-bt-nghe-dien", title: "VIII. Questions 1–4", kind: "fill",
        items: [
          { q: "1. On Saturdays the depot closes at ______ pm.", answers: ["1", "one"], hint: "ba giờ đóng cửa được nhắc" },
          { q: "2. Bring photo ID and the ______ number.", answers: ["reference"], hint: "không phải số của người bán" },
          { q: "3. Parcels are kept for ______ days.", answers: ["10", "ten"], hint: "It was… but it’s… now" },
          { q: "4. The depot is behind the ______ .", answers: ["stadium"], hint: "địa điểm mới" },
        ],
      },
      {
        t: "note", title: "Giải thích phần nghe",
        items: [
          "**1 — 1 / one:** “till six” là ngày thường; “Used to be two” là giờ cũ; “on Saturdays we shut at one”.",
          "**2 — reference:** “Not the tracking number from the seller… The reference is the eight digits”. tracking là nhiễu cùng loại từ.",
          "**3 — 10 / ten:** người gọi đoán “A week?”; nhân viên: “It was seven days, but it’s ten now”.",
          "**4 — stadium:** người gọi nêu địa chỉ cũ (Canal Street, next to the supermarket); nhân viên sửa: “directly behind the stadium”.",
          "Cả bốn câu là bẫy **sửa lời** — loại C trong bảng phân loại. Sai từ 2 câu trở lên: đọc lại bài Nghe mục 3 trước Ngày 9.",
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "**I–V sai ≥ 8 câu:** mở Flashcards bộ “Từ của khoá — Tập 5”, lọc Ngày 8; ôn lại sau 2 ngày và 7 ngày.",
          "**VI sai ≥ 2 câu:** chép bảng giới từ ở bài Viết mục 3 và đọc lại Ngày 7 mục 8.",
          "**VII sai ≥ 2 câu:** đọc lại hai đoạn giải pháp band 7 / band 8 ở bài Viết mục 4, gạch bốn phần của giải pháp.",
          "Chưa làm **Reading** và **Speaking** của Đề 9? Làm trước Ngày 9 · 10.",
        ],
      },
    ],
  },
];
