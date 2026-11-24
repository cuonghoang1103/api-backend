/**
 * IELTS Tập 5 — Ngày 24 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, đề luyện, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🖥️ NGÀY LÀM ĐỀ 11 (band 8.0): Writing + Listening làm ở Online Test (`/language/en/ielts/thi-may`, bộ Đề 11); bài 2 và bài 3 của
 * ngày CHỈ hướng dẫn chiến thuật – phân giờ – checklist trước / sau, KHÔNG chép đề, không lộ đề tài hay đáp án (chỉ nêu DẠNG câu và
 * giọng như Ngày 16 đã làm với Đề 10). ✅ NGÀY KIỂM TRA CHẶNG 4 (Ngày 19–24). Khuôn N mod 4 = 0 ⇒ vocab · writing · listening ·
 * homework · review.
 *   Bài 1 (vocab)     Ôn AWL + 30 chủ đề (Match): KHÔNG lặp Ngày 2 (570 họ theo sublist) và Ngày 16 (33 chủ đề × 8 từ khoá) —
 *                     hôm nay đan chéo hai trục: 24 cụm AWL “đa năng” MỚI (đã đối chiếu mọi khối vocab Tập 2–5: không trùng mục),
 *                     bảng Match 30 chủ đề × 1 câu khung AWL, máy đổi dạng trong họ từ, 6 cặp AWL dễ nhầm chưa dạy (imply / infer,
 *                     adverse / averse, elicit / illicit, precede / proceed, eminent / imminent, affect / effect làm động từ),
 *                     🔊 schwa trong cụm học thuật dài.                                                       [VB1–10 VC01–33]
 *   Bài 2 (writing)   Writing Đề 11 — hướng dẫn: Task 1 QUY TRÌNH hai giai đoạn + Task 2 DISCUSSION. Ôn bằng đề KHÁC: bã cà phê →
 *                     củi ép (hai hình, hư cấu) — band 7 và band 8 đặt cạnh nhau; đổi giờ mùa hè (discuss both views) — mở bài +
 *                     thân bài band 7 / band 8. Phân giờ 60 phút band 8 + soát “3 + 2” của Ngày 23.
 *                     — nối Tập 5 Ngày 7 (bị động + rút gọn) · 10 (Discussion band 8) · 12 (process hai giai đoạn) · 13 · 15 · 23
 *   Bài 3 (listening) Listening Đề 11 — hướng dẫn: tốc độ ~180 từ/phút + NHIỄU NỀN dựng bằng tình huống (hỏi lại, đánh vần lại),
 *                     bảy giọng; năm tín hiệu “sửa lại” — đáp án là bản CUỐI được xác nhận; khởi động ba đoạn tự soạn (form qua
 *                     nhiễu — Úc + Ireland · map — Anh · note completion — New Zealand).
 *                     — nối Tập 5 Ngày 1 · 4 · 15 · 16 (bẫy số đổi) · 19 · 20 · 21 (tin tức, giọng vùng)
 *   Bài tập Ngày 24   32 câu có đáp án + 1 đoạn viết
 *   Kiểm tra chặng 4  `t5d24-kiem-tra` — 8 phần gom Ngày 19–24, mọi câu MỚI (bài đọc ~360 từ về “mùa hoa sớm” với nhà nghiên cứu
 *                     HƯ CẤU; hai bài nghe; Task 1 bar chart tự đặt; Task 2 problem / solution). Không có khối phatam (đã có ở Bài 1).
 * Đã grep tap-3…5/ngay + thi-may/de: coffee grounds, clock change / daylight saving, courier, open-air museum, crossword = 0 kết quả.
 * Dữ kiện có thật (theo trí nhớ, làm tròn): ô chữ đầu tiên của Arthur Wynne trên báo New York World ngày 21/12/1913, hình thoi, ông gọi
 * là “word-cross”; tên đổi thành crossword sau một lỗi sắp chữ; báo Times ở London đăng ô chữ từ 1930. Nhân vật, địa điểm, số liệu
 * trong đề luyện, bài nghe và bài kiểm tra là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_24: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d24-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Ôn AWL + 30 chủ đề (Match) — AWL làm khung, chủ đề làm thịt: 24 cụm AWL đa năng, bảng 30 câu khung, đổi dạng trong họ từ",
    goal: "Mang một họ từ AWL đi qua nhiều chủ đề: dùng đúng 24 cụm AWL đa năng mới, bật ra một câu khung học thuật cho bất kỳ chủ đề nào trong 30 chủ đề IELTS, đổi dạng trong họ từ để paraphrase không lặp, và không nhầm sáu cặp AWL dễ sai — kịp mang vào Đề 11 chiều nay.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR 7 → 8** cho Đề 11. Band 8 LR: ==dùng vốn từ rộng, trôi chảy, linh hoạt để truyền đạt nghĩa chính xác== — chữ quan trọng là **linh hoạt**: cùng một từ dùng được ở nhiều đề.",
          "Ngày 2 ôn AWL theo **sublist** (570 họ). Ngày 16 ôn **33 chủ đề** (8 từ khoá mỗi chủ đề). Hôm nay **đan chéo**: một cụm AWL đi qua ba chủ đề; một chủ đề có một câu khung AWL.",
          "**24 cụm AWL đa năng** — chia bốn việc: nguyên nhân – hệ quả · chính sách – nguồn lực · thay đổi – xu hướng · đánh giá.",
          "**Bảng Match 30 chủ đề** — mỗi chủ đề một câu khung dùng được ngay cho Task 2 hoặc Part 3.",
          "**Đổi dạng trong họ từ** để paraphrase đề mà không lặp, và **6 cặp AWL dễ nhầm** chưa dạy ở Tập 4–5.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — ôn Tập 5 Ngày 2 · 16 · 20 · 22 (6 câu)" },
      {
        t: "quiz",
        id: "t5d24-on-dau-bai",
        kind: "fill",
        title: "Điền MỘT từ (chữ đầu cho sẵn) hoặc viết dạng đúng của từ trong ngoặc (6 câu)",
        items: [
          { q: "1. The new law has had a significant ___ (IMPLY) for small businesses. — dạng danh từ số nhiều", answers: ["implications"], hint: "imply → implication(s) — AWL sublist 3 (Ngày 2)." },
          { q: "2. Funding was ___ (ALLOCATE) to the regions on the basis of population.", answers: ["allocated"], hint: "bị động be + V3 (Ngày 2)." },
          { q: "3. Whether you get the operation depends on where you live — a postcode l___.", answers: ["lottery"], hint: "Ngày 16 · chủ đề Health." },
          { q: "4. The results could not be r___ by other laboratories. (lặp lại được)", answers: ["replicated", "reproduced"], hint: "replication crisis — Ngày 20 · Science vòng 2." },
          { q: "5. Patients must give informed c___ before taking part in a trial.", answers: ["consent"], hint: "Ngày 22 · Đạo đức." },
          { q: "6. Many people on zero-hours contracts live in p___ circumstances. (bấp bênh)", answers: ["precarious"], hint: "Ngày 22 · Social issues vòng 2." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn kiểu gì cho khác Ngày 2 và Ngày 16 — lưới hai trục" },
      {
        t: "table",
        head: ["Ngày", "Trục ôn", "Câu hỏi bạn tự đặt"],
        rows: [
          ["Ngày 2", "AWL theo sublist · họ từ · giới từ đi kèm", "“Từ này có những dạng nào?”"],
          ["Ngày 16", "33 chủ đề · 8 từ khoá · bắc cầu chủ đề", "“Đề này thuộc chủ đề nào, kho từ nào?”"],
          ["**Hôm nay**", "cụm AWL × chủ đề — một cụm đi ba đề", "“Cụm này dùng được ở những đề nào? Đề này cần cụm AWL nào làm khung?”"],
        ],
        caption: "Từ chủ đề cho bạn NỘI DUNG; AWL cho bạn KHUNG để nói về nội dung ấy một cách học thuật",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Một cụm AWL — ba chủ đề",
        center: "**an equitable distribution of**",
        branches: [
          { label: "Health", items: ["an equitable distribution of doctors between cities and rural areas"] },
          { label: "Education", items: ["an equitable distribution of funding between rich and poor schools"] },
          { label: "Environment", items: ["an equitable distribution of the cost of cutting emissions"] },
        ],
        caption: "Mỗi cụm trong mục 2 đều luyện như thế này: một cụm, ba câu, ba chủ đề.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. 24 cụm AWL đa năng — ① nguyên nhân – hệ quả · ② chính sách – nguồn lực" },
      {
        t: "vocab",
        items: [
          { w: "a higher incidence of", pos: "n phr", ipa: "/ə ˈhaɪər ˈɪnsɪdəns əv/", vi: "tỉ lệ xảy ra / mắc cao hơn (bệnh, tội phạm, tai nạn)", ex: "Night-shift workers show a higher incidence of sleep disorders.", exVi: "Người làm ca đêm có tỉ lệ rối loạn giấc ngủ cao hơn.", more: "Health · Work · Crime: a higher incidence of burglary in… · KHÔNG nhầm với incident (vụ việc)." },
          { w: "persist into adulthood", pos: "v phr", ipa: "/pəˈsɪst ˈɪntə ˈædʌlthʊd/", vi: "kéo dài sang tuổi trưởng thành", ex: "Eating habits formed in childhood often persist into adulthood.", exVi: "Thói quen ăn uống hình thành từ nhỏ thường kéo dài sang tuổi trưởng thành.", more: "Children · Health · Education · persistent (adj) · persistence (n)" },
          { w: "derive satisfaction from", pos: "v phr", ipa: "/dɪˈraɪv ˌsætɪsˈfækʃn frəm/", vi: "có được sự hài lòng từ", ex: "Many volunteers derive more satisfaction from their unpaid work than from their jobs.", exVi: "Nhiều tình nguyện viên có được sự hài lòng từ công việc không lương hơn là từ việc làm chính.", more: "Work · Psychology · derive benefit / pleasure / income from" },
          { w: "inhibit innovation", pos: "v phr", ipa: "/ɪnˈhɪbɪt ˌɪnəˈveɪʃn/", vi: "kìm hãm sự đổi mới", ex: "Excessive regulation can inhibit innovation in small firms.", exVi: "Quy định quá mức có thể kìm hãm đổi mới ở doanh nghiệp nhỏ.", more: "Business · Technology · Science · inhibit growth / learning" },
          { w: "mutually reinforcing", pos: "adj phr", ipa: "/ˈmjuːtʃuəli ˌriːɪnˈfɔːsɪŋ/", vi: "củng cố lẫn nhau", ex: "Poverty and poor health are often mutually reinforcing.", exVi: "Nghèo đói và sức khoẻ kém thường củng cố lẫn nhau.", more: "Social issues · Health · Education — câu nhân quả HAI chiều, rất hợp Task 2 band 8." },
          { w: "ultimately", pos: "adv", ipa: "/ˈʌltɪmətli/", vi: "rốt cuộc, xét cho cùng", ex: "Ultimately, the success of any recycling scheme depends on public cooperation.", exVi: "Xét cho cùng, thành công của bất kỳ chương trình tái chế nào phụ thuộc vào sự hợp tác của người dân.", more: "đầu câu chốt / kết bài · ultimate (adj) · đừng nhầm với lastly (liệt kê)" },
          { w: "an equitable distribution of", pos: "n phr", ipa: "/ən ˈekwɪtəbl ˌdɪstrɪˈbjuːʃn əv/", vi: "sự phân bổ công bằng (theo nhu cầu, không chỉ chia đều)", ex: "An equitable distribution of doctors would send more of them to rural areas.", exVi: "Phân bổ bác sĩ công bằng thì sẽ đưa nhiều bác sĩ hơn về nông thôn.", more: "equitable ≠ equal: equal = chia đều như nhau; equitable = chia theo nhu cầu để kết quả công bằng." },
          { w: "prioritise A over B", pos: "v phr", ipa: "/praɪˈɒrətaɪz/", vi: "ưu tiên A hơn B", ex: "The city has prioritised road building over public transport for decades.", exVi: "Nhiều thập kỷ nay thành phố ưu tiên xây đường hơn giao thông công cộng.", more: "Government · Transport · Environment · priority (n) · Anh – Mỹ: prioritize" },
          { w: "impose restrictions on", pos: "v phr", ipa: "/ɪmˈpəʊz rɪˈstrɪkʃnz ɒn/", vi: "áp đặt hạn chế lên", ex: "Several countries have imposed restrictions on advertising to children.", exVi: "Nhiều nước đã áp đặt hạn chế lên quảng cáo nhắm vào trẻ em.", more: "Media · Health · Tourism · lift / ease restrictions (dỡ / nới)" },
          { w: "facilitate the transition to", pos: "v phr", ipa: "/fəˈsɪlɪteɪt ðə trænˈzɪʃn tə/", vi: "tạo điều kiện cho việc chuyển sang", ex: "Grants could facilitate the transition to electric buses.", exVi: "Các khoản trợ cấp có thể tạo điều kiện chuyển sang xe buýt điện.", more: "Energy · Work (the transition to retirement) · Education (from school to university)" },
          { w: "adequate provision for", pos: "n phr", ipa: "/ˈædɪkwət prəˈvɪʒn fə/", vi: "sự cung cấp / chuẩn bị đầy đủ cho", ex: "The new estate makes no adequate provision for schools or clinics.", exVi: "Khu dân cư mới không có sự chuẩn bị đầy đủ cho trường học hay phòng khám.", more: "Housing · Ageing (provision for old age) · make provision for = dự liệu cho" },
          { w: "eligibility criteria", pos: "n phr", ipa: "/ˌelɪdʒəˈbɪləti kraɪˈtɪəriə/", vi: "tiêu chí đủ điều kiện", ex: "The eligibility criteria for the grant exclude part-time students.", exVi: "Tiêu chí đủ điều kiện nhận trợ cấp loại sinh viên học bán thời gian.", more: "criteria số NHIỀU (một: criterion) ⇒ The criteria **are**… · meet the criteria" },
        ],
      },
      { t: "h", text: "3. 24 cụm AWL đa năng — ③ thay đổi – xu hướng · ④ đánh giá" },
      {
        t: "vocab",
        items: [
          { w: "a shift in public attitudes", pos: "n phr", ipa: "/ə ʃɪft ɪn ˈpʌblɪk ˈætɪtjuːdz/", vi: "sự chuyển dịch trong thái độ của công chúng", ex: "The ban on smoking indoors reflected a shift in public attitudes.", exVi: "Lệnh cấm hút thuốc trong nhà phản ánh sự chuyển dịch thái độ của công chúng.", more: "Social issues · Environment · Family · a shift away from / towards" },
          { w: "reverse a decline", pos: "v phr", ipa: "/rɪˈvɜːs ə dɪˈklaɪn/", vi: "đảo ngược sự suy giảm", ex: "Free entry helped to reverse a decline in museum visits.", exVi: "Vào cửa miễn phí đã giúp đảo ngược sự suy giảm lượt khách bảo tàng.", more: "Culture · Language (reverse the decline of a minority language) · Books · reverse a trend" },
          { w: "undergo rigorous testing", pos: "v phr", ipa: "/ˌʌndəˈɡəʊ ˈrɪɡərəs ˈtestɪŋ/", vi: "trải qua kiểm định nghiêm ngặt", ex: "New medicines must undergo rigorous testing before they are approved.", exVi: "Thuốc mới phải trải qua kiểm định nghiêm ngặt trước khi được phê duyệt.", more: "Science · Health · Technology (AI systems) · undergo surgery / changes" },
          { w: "a predominantly rural region", pos: "n phr", ipa: "/ə prɪˈdɒmɪnəntli ˈrʊərəl ˈriːdʒən/", vi: "vùng chủ yếu là nông thôn", ex: "In a predominantly rural region, a single bus route may serve twenty villages.", exVi: "Ở một vùng chủ yếu là nông thôn, một tuyến xe buýt có thể phục vụ hai mươi ngôi làng.", more: "Task 1 · Transport · Housing · predominantly + adj: predominantly female / young" },
          { w: "retain skilled staff", pos: "v phr", ipa: "/rɪˈteɪn skɪld stɑːf/", vi: "giữ chân nhân lực có tay nghề", ex: "Rural hospitals struggle to retain skilled staff.", exVi: "Bệnh viện nông thôn chật vật giữ chân nhân lực có tay nghề.", more: "Work · Health · Education (retain teachers) · retention (n): staff retention" },
          { w: "virtually non-existent", pos: "adj phr", ipa: "/ˈvɜːtʃuəli ˌnɒnɪɡˈzɪstənt/", vi: "gần như không tồn tại", ex: "Twenty years ago, cycle lanes in the city were virtually non-existent.", exVi: "Hai mươi năm trước, làn xe đạp trong thành phố gần như không có.", more: "Task 1 (giá trị gần 0) · Transport · virtually = almost (trang trọng)" },
          { w: "considerable scope for", pos: "n phr", ipa: "/kənˈsɪdərəbl skəʊp fə/", vi: "dư địa đáng kể cho", ex: "There is considerable scope for improving energy efficiency in older homes.", exVi: "Còn dư địa đáng kể để cải thiện hiệu quả năng lượng ở nhà cũ.", more: "Energy · Business · Education · little / limited scope for" },
          { w: "incompatible with", pos: "adj phr", ipa: "/ˌɪnkəmˈpætəbl wɪð/", vi: "không tương thích, mâu thuẫn với", ex: "Long working hours are often incompatible with family life.", exVi: "Giờ làm dài thường mâu thuẫn với đời sống gia đình.", more: "Work · Family · Ethics (incompatible with human dignity) · trái nghĩa compatible" },
          { w: "lack a coherent strategy", pos: "v phr", ipa: "/læk ə kəʊˈhɪərənt ˈstrætədʒi/", vi: "thiếu một chiến lược nhất quán", ex: "Critics say the government lacks a coherent strategy for housing.", exVi: "Giới phê bình cho rằng chính phủ thiếu một chiến lược nhất quán về nhà ở.", more: "Government · Energy · Tourism · lack KHÔNG đi với of khi là động từ: ~~lack of a strategy~~ → lack a strategy" },
          { w: "a uniform approach", pos: "n phr", ipa: "/ə ˈjuːnɪfɔːm əˈprəʊtʃ/", vi: "cách làm đồng loạt (một kiểu cho tất cả)", ex: "A uniform approach ignores the differences between city and village schools.", exVi: "Cách làm đồng loạt bỏ qua khác biệt giữa trường thành phố và trường làng.", more: "gần nghĩa: one-size-fits-all · Education · Government · Health" },
          { w: "suspend judgement", pos: "v phr", ipa: "/səˈspend ˈdʒʌdʒmənt/", vi: "tạm gác phán xét (chờ thêm bằng chứng)", ex: "Until independent data are available, it is wise to suspend judgement.", exVi: "Cho tới khi có dữ liệu độc lập, nên tạm gác phán xét.", more: "Science · Media · Part 3: I'd suspend judgement until… · Anh – Mỹ: judgment" },
          { w: "modify their behaviour", pos: "v phr", ipa: "/ˈmɒdɪfaɪ ðeə bɪˈheɪvjə/", vi: "điều chỉnh hành vi", ex: "Drivers modify their behaviour when they know they are being watched.", exVi: "Tài xế điều chỉnh hành vi khi biết mình đang bị theo dõi.", more: "Psychology · Health · Crime · modification (n) — đổi their theo chủ ngữ (my / his…)" },
        ],
      },
      { t: "rule", formula: "cụm AWL (khung) + từ chủ đề (thịt) = một câu Task 2 dùng lại được ở ba đề", vi: "Học cụm, không học từ rời: incidence → a higher incidence of + N." },

      /* ── 4 ── */
      { t: "h", text: "4. Match — 30 chủ đề, mỗi chủ đề một câu khung AWL" },
      {
        t: "p",
        text: "Đọc theo hàng: chủ đề → câu khung → cụm AWL làm khung. Lần hai che cột giữa, nhìn chủ đề và cụm AWL, tự nói lại câu khung. Lần ba (chiều nay, trước Đề 11): che hai cột cuối, nhìn chủ đề, nói một câu bất kỳ có AWL — dưới 10 giây.",
      },
      {
        t: "table",
        head: ["Chủ đề", "Câu khung band 8", "Khung AWL"],
        rows: [
          ["Education", "Assessment that rewards memorisation can undermine the very skills it claims to measure.", "assessment · undermine"],
          ["Work", "Remote work may enhance productivity while eroding the informal learning that happens in offices.", "enhance · erode"],
          ["Technology", "New tools rarely replace old skills outright; they redistribute them.", "redistribute"],
          ["Environment", "The cost of cutting emissions needs an equitable distribution between rich and poor nations.", "equitable distribution"],
          ["Health", "Prevention is cheaper than treatment, yet it attracts a fraction of the funding.", "fraction · fund"],
          ["Crime", "Harsher sentences have little effect if offenders do not expect to be caught.", "sentence · effect"],
          ["Government", "Policies that lack a coherent strategy tend to be reversed by the next administration.", "coherent · reverse"],
          ["Media", "Restrictions on advertising to children are justified by the scale of the health risk.", "restriction · justify"],
          ["Transport", "Cities that prioritise buses over cars rarely regret the decision.", "prioritise"],
          ["Housing", "New estates often lack adequate provision for schools and clinics.", "adequate provision"],
          ["Family", "Long working hours are increasingly incompatible with shared parenting.", "incompatible"],
          ["Children", "Habits formed in childhood tend to persist into adulthood.", "persist"],
          ["Ageing", "Pension systems were designed for a demographic structure that no longer exists.", "design · structure"],
          ["Globalisation", "Integration into global markets has benefited consumers far more evenly than workers.", "integration"],
          ["Tourism", "A uniform approach to tourism ignores the capacity of small communities.", "uniform · capacity"],
          ["Arts & culture", "Free entry may reverse a decline in visits, but it does not by itself widen the audience.", "reverse · decline"],
          ["Sport", "Elite success seldom translates into higher participation among ordinary people.", "participation"],
          ["Science", "Findings that have not undergone independent replication should be treated with caution.", "undergo · replication"],
          ["Animals", "Conservation is most effective when local communities derive a tangible benefit from it.", "derive · benefit"],
          ["Food", "Cheap calories and poor health are, to a large extent, mutually reinforcing.", "mutually reinforcing"],
          ["Energy", "Subsidies can facilitate the transition to renewables, provided they are temporary.", "facilitate · transition"],
          ["Language", "A minority language survives only if speakers perceive a practical benefit in using it.", "perceive · survive"],
          ["Books & reading", "Reading for pleasure correlates strongly with later attainment, regardless of income.", "correlate · attainment"],
          ["Business & advertising", "Excessive regulation can inhibit innovation, but so can its absence.", "inhibit · regulation"],
          ["Money & consumerism", "Beyond a certain income, people derive little additional satisfaction from spending.", "derive satisfaction"],
          ["Space", "The benefits of space research are real but indirect, which makes them hard to quantify.", "indirect · quantify"],
          ["AI & ethics", "Automated decisions should undergo the same scrutiny as decisions made by people.", "automate · scrutiny"],
          ["Social issues", "There is considerable scope for reducing inequality through the tax system.", "considerable scope"],
          ["History & heritage", "How a society commemorates its past reveals its current priorities.", "commemorate · priority"],
          ["Psychology & happiness", "People modify their behaviour far more readily in response to social norms than to information.", "modify · norm"],
        ],
        caption: "30 chủ đề — 30 câu khung. Mỗi câu dùng được ở ít nhất hai đề khác nhau.",
      },
      {
        t: "mcq",
        id: "t5d24-match",
        title: "Match nhanh — chọn cụm AWL hợp nhất cho câu (6 câu)",
        items: [
          { q: "1. (Health) Rural areas suffer from a ___ heart disease, partly because hospitals are far away.", options: ["higher incident of", "higher incidence of", "high incidental"], correct: 1, why: "a higher incidence of = tỉ lệ xảy ra cao hơn. incident = một vụ việc." },
          { q: "2. (Education) Funding should be distributed ___, with more going to schools in poorer areas.", options: ["equally", "equitably", "uniformly"], correct: 1, why: "Nhiều hơn cho nơi nghèo = chia theo nhu cầu ⇒ equitably. equally / uniformly = chia như nhau — ngược ý câu." },
          { q: "3. (Work) Small clinics find it hard to ___ once larger hospitals offer higher pay.", options: ["retain skilled staff", "derive skilled staff", "persist skilled staff"], correct: 0, why: "retain staff = giữ chân nhân viên." },
          { q: "4. (Science) Until other teams repeat the study, we should ___.", options: ["suspend judgement", "inhibit judgement", "impose judgement"], correct: 0, why: "suspend judgement = tạm gác phán xét chờ bằng chứng." },
          { q: "5. (Energy) Low-interest loans could ___ heat pumps for older households.", options: ["facilitate the transition to", "reverse a decline in", "be incompatible with"], correct: 0, why: "Giúp chuyển sang dùng heat pump ⇒ facilitate the transition to." },
          { q: "6. (Social issues) Low income and poor housing are ___: each makes the other harder to escape.", options: ["virtually non-existent", "mutually reinforcing", "predominantly rural"], correct: 1, why: "each makes the other… = nhân quả hai chiều ⇒ mutually reinforcing." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Máy đổi dạng — paraphrase đề bằng chính họ từ AWL" },
      {
        t: "p",
        text: "Câu đầu của mở bài Task 2 phải nói lại đề **không lặp** đề. Cách nhanh và an toàn nhất ở band 8: ==giữ họ từ, đổi từ loại, đổi cấu trúc câu theo==. Đổi từ đồng nghĩa dễ trượt nghĩa; đổi dạng trong họ từ thì nghĩa giữ nguyên.",
      },
      {
        t: "table",
        head: ["Họ từ", "Động từ → danh từ", "Câu đề → câu của bạn"],
        rows: [
          ["regulate · regulation · regulatory", "regulate → regulation", "Governments should **regulate** social media. → Stricter **regulation** of social media is needed."],
          ["distribute · distribution", "distribute → distribution", "Wealth is **distributed** unequally. → The **distribution** of wealth is uneven."],
          ["participate · participation · participant", "participate → participation", "Fewer people **participate** in sport. → **Participation** in sport has fallen."],
          ["rely · reliance · reliable", "rely on → reliance on", "We **rely** too much on cars. → Our **reliance** on cars is excessive."],
          ["access · accessible · accessibility", "access (v) → accessible (adj)", "Everyone should be able to **access** higher education. → Higher education should be **accessible** to all."],
          ["assess · assessment", "assess → assessment", "Students are **assessed** by exams. → **Assessment** is based on exams."],
          ["benefit · beneficial · beneficiary", "benefit (v) → beneficial (adj)", "Tourism **benefits** local people. → Tourism is **beneficial** to local people."],
          ["vary · variation · variable · various", "vary → variation", "Prices **vary** from region to region. → There is considerable **variation** in prices between regions."],
        ],
        caption: "Đổi từ loại kéo theo đổi cấu trúc — kiểm lại giới từ đi kèm (reliance ON, access TO, beneficial TO)",
      },
      {
        t: "quiz",
        id: "t5d24-doi-dang",
        kind: "fill",
        title: "Đổi dạng — điền MỘT từ cùng họ với từ in hoa (8 câu)",
        items: [
          { q: "1. Fewer young people VOTE. → Voter ___ among young people has declined. (sự tham gia)", answers: ["participation", "turnout"], hint: "participate → participation; voter turnout cũng đúng." },
          { q: "2. Cities RELY heavily on tourism. → Cities' heavy ___ on tourism is risky.", answers: ["reliance", "dependence"], hint: "rely on → reliance on." },
          { q: "3. Wages VARY widely across industries. → There is wide ___ in wages across industries.", answers: ["variation"], hint: "vary → variation." },
          { q: "4. Most people can ACCESS the internet. → The internet is ___ to most people.", answers: ["accessible", "available"], hint: "access → accessible TO." },
          { q: "5. The policy BENEFITS families. → Families are the main ___ of the policy. (người hưởng lợi)", answers: ["beneficiaries"], hint: "benefit → beneficiary → beneficiaries." },
          { q: "6. The state should REGULATE advertising. → Advertising should be subject to stricter ___.", answers: ["regulation", "regulations", "controls"], hint: "regulate → regulation." },
          { q: "7. Exams ASSESS memory, not understanding. → Exam-based ___ measures memory rather than understanding.", answers: ["assessment"], hint: "assess → assessment." },
          { q: "8. Income is DISTRIBUTED unevenly. → The ___ of income is uneven.", answers: ["distribution"], hint: "distribute → distribution." },
        ],
      },
      { t: "rule", formula: "đề: S + V(họ X) + O → câu của bạn: N(họ X) + of + O + V khác", vi: "Paraphrase bằng họ từ: nghĩa giữ, cấu trúc đổi, không lặp đề." },

      /* ── 6 ── */
      { t: "h", text: "6. Sáu cặp AWL dễ nhầm — chưa dạy ở Tập 4–5" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau", "Ví dụ"],
        rows: [
          ["**imply / infer**", "imply: người NÓI / văn bản ngụ ý · infer: người NGHE / đọc suy ra", "The report **implies** that costs will rise. · From the data, we can **infer** that costs will rise."],
          ["**adverse / averse**", "adverse: bất lợi (đi với effect, conditions) · averse: không thích, ngại (người — risk-averse, Ngày 20)", "**adverse** weather · She is **averse to** risk."],
          ["**elicit / illicit**", "elicit (v): gợi ra, khơi ra (câu trả lời, phản ứng) · illicit (adj): bất hợp pháp", "The survey **elicited** few replies. · **illicit** drugs"],
          ["**precede / proceed**", "precede: đứng / xảy ra TRƯỚC · proceed: tiếp tục, tiến hành", "The crisis **preceded** the election. · The project will **proceed** as planned."],
          ["**eminent / imminent**", "eminent: lỗi lạc, nổi tiếng · imminent: sắp xảy ra", "an **eminent** scientist · an **imminent** collapse"],
          ["**affect / effect** (động từ)", "affect (v): ảnh hưởng · effect (v, trang trọng): tạo ra, thực hiện (effect change)", "Noise **affects** sleep. · The new leader **effected** real change."],
        ],
        caption: "Ba cặp đầu hay gặp nhất trong Reading và Task 2",
      },
      {
        t: "mcq",
        id: "t5d24-cap-nham",
        title: "Chọn từ đúng (6 câu)",
        items: [
          { q: "1. The writer ___ that the policy was introduced too quickly, but never says so directly.", options: ["implies", "infers"], correct: 0, why: "Người viết ngụ ý ⇒ implies." },
          { q: "2. Many investors are ___ to putting money into untested technology.", options: ["adverse", "averse"], correct: 1, why: "be averse to = ngại, không thích (người)." },
          { q: "3. The questions were designed to ___ honest answers.", options: ["elicit", "illicit"], correct: 0, why: "elicit (v) = khơi ra." },
          { q: "4. Talks will ___ once both sides have signed the agreement.", options: ["precede", "proceed"], correct: 1, why: "proceed = tiếp tục / tiến hành." },
          { q: "5. Engineers warned that the bridge's collapse was ___.", options: ["eminent", "imminent"], correct: 1, why: "imminent = sắp xảy ra." },
          { q: "6. Heatwaves can have ___ effects on crop yields.", options: ["adverse", "averse"], correct: 0, why: "adverse effects = tác động bất lợi." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. 🔊 Phát âm: schwa trong cụm học thuật dài" },
      {
        t: "p",
        text: "Cụm AWL dài (an equitable distribution of…) là chỗ người Việt nói **đều từng âm tiết** — nghe nặng và chậm. Người bản ngữ nhấn MỘT âm tiết mỗi từ nội dung, còn lại phần lớn rút về ==schwa /ə/==: con-SID-ər-ə-bl, dis-trɪ-BJUː-ʃn. Nói đúng schwa thì cụm dài nghe gọn — và bạn cũng nghe kịp tốc độ 180 từ/phút của Đề 11.",
      },
      {
        t: "table",
        head: ["Từ", "Âm tiết nhấn", "Schwa ở đâu"],
        rows: [
          ["considerable", "con**SID**erable", "/kənˈsɪdərəbl/ — ba schwa"],
          ["equitable", "**EQ**uitable", "/ˈekwɪtəbl/"],
          ["provision", "pro**VI**sion", "/prəˈvɪʒn/"],
          ["adequate", "**AD**equate", "/ˈædɪkwət/ — đuôi -ate của tính từ đọc /ət/, không /eɪt/"],
          ["facilitate", "fa**CIL**itate", "/fəˈsɪlɪteɪt/ — đuôi -ate của động từ đọc /eɪt/"],
          ["of · for · to · a · the", "không nhấn", "/əv/ · /fə/ · /tə/ · /ə/ · /ðə/"],
        ],
        caption: "adequate (adj) /ət/ ≠ facilitate (v) /eɪt/ — cùng đuôi viết, khác âm",
      },
      {
        t: "phatam",
        id: "t5d24-phat-am",
        title: "Luyện phát âm — tám cụm AWL dài, nhấn một âm, còn lại schwa",
        note: "Đọc mỗi câu hai lần: lần một gõ nhịp bằng tay vào các âm tiết nhấn (in hoa trong bảng trên), lần hai nói ở tốc độ thường. Máy chấm từng âm — kiểm xem of / for / to có bị đọc mạnh /ɒv/ /fɔː/ /tuː/ không.",
        items: [
          { text: "There is considerable scope for improvement.", ipa: "ðeər ɪz kənsɪdərəbl skəʊp fər ɪmpruːvmənt", vi: "Còn dư địa đáng kể để cải thiện." },
          { text: "an equitable distribution of resources", ipa: "ən ekwɪtəbl dɪstrɪbjuːʃn əv rɪzɔːsɪz", vi: "sự phân bổ nguồn lực công bằng" },
          { text: "adequate provision for the elderly", ipa: "ædɪkwət prəvɪʒn fə ði eldəli", vi: "sự chuẩn bị đầy đủ cho người cao tuổi" },
          { text: "to facilitate the transition to renewables", ipa: "tə fəsɪlɪteɪt ðə trænzɪʃn tə rɪnjuːəblz", vi: "để tạo điều kiện chuyển sang năng lượng tái tạo" },
          { text: "a higher incidence of disease", ipa: "ə haɪər ɪnsɪdəns əv dɪziːz", vi: "tỉ lệ mắc bệnh cao hơn" },
          { text: "Habits persist into adulthood.", ipa: "hæbɪts pəsɪst ɪntə ædʌlthʊd", vi: "Thói quen kéo dài sang tuổi trưởng thành." },
          { text: "They are mutually reinforcing.", ipa: "ðeɪ ə mjuːtʃuəli riːɪnfɔːsɪŋ", vi: "Chúng củng cố lẫn nhau." },
          { text: "Ultimately, it depends on public cooperation.", ipa: "ʌltɪmətli ɪt dɪpendz ɒn pʌblɪk kəʊɒpəreɪʃn", vi: "Xét cho cùng, nó phụ thuộc vào sự hợp tác của người dân." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dùng ngay — dịch Việt → Anh (5 câu Task 2 / Part 3)" },
      {
        t: "quiz",
        id: "t5d24-tu-vung-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — mỗi câu một cụm AWL của hôm nay",
        grammar: "cụm AWL mục 2–3 + từ chủ đề",
        items: [
          { q: "Các thành phố nên ưu tiên người đi bộ hơn ô tô.", answers: ["Cities should prioritise pedestrians over cars.", "Cities should prioritize pedestrians over cars.", "Cities should give priority to pedestrians over cars.", "Cities ought to prioritise pedestrians over cars."], hint: "prioritise A over B" },
          { q: "Nghèo đói và thất học thường củng cố lẫn nhau.", answers: ["Poverty and lack of education are often mutually reinforcing.", "Poverty and illiteracy are often mutually reinforcing.", "Poverty and a lack of education are often mutually reinforcing.", "Poverty and poor education are often mutually reinforcing."], hint: "mutually reinforcing" },
          { q: "Khu nhà ở mới không có sự chuẩn bị đầy đủ cho giao thông công cộng.", answers: ["The new housing estate lacks adequate provision for public transport.", "The new housing estate makes no adequate provision for public transport.", "The new estate lacks adequate provision for public transport.", "The new housing development lacks adequate provision for public transport.", "There is no adequate provision for public transport in the new housing estate."], hint: "adequate provision for" },
          { q: "Các trường nông thôn chật vật giữ chân giáo viên giỏi.", answers: ["Rural schools struggle to retain good teachers.", "Rural schools struggle to retain skilled teachers.", "Rural schools find it hard to retain good teachers.", "Schools in rural areas struggle to retain good teachers.", "Rural schools struggle to retain talented teachers."], hint: "retain + N" },
          { q: "Xét cho cùng, không luật nào hiệu quả nếu người dân không ủng hộ nó.", answers: ["Ultimately, no law is effective if the public does not support it.", "Ultimately, no law works if people do not support it.", "Ultimately, no law can be effective if the public does not support it.", "Ultimately, no law is effective unless the public supports it.", "Ultimately, no law is effective without public support."], hint: "Ultimately, …" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d24-viet",
    kind: "writing",
    title: "Viết: Writing Đề 11 trong 60 phút (hướng dẫn làm đề) — quy trình hai giai đoạn + Discussion band 8",
    goal: "Vào Writing Đề 11 với một kế hoạch đã luyện: viết overview cho quy trình hai giai đoạn có “mắt xích” nối hai hình, dựng thesis Discussion có lập trường tinh ngay ở mở bài, chia 60 phút theo bảng band 8, soát 4 phút “3 + 2” — và sau đề biết đọc bảng chấm, soi bài mẫu, ghi sổ lỗi cho Ngày 25.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · làm gì hôm nay",
        items: [
          "**Đề 11 (band 8.0)** làm trong Online Test: `/language/en/ielts/thi-may` → bộ **Đề 11** → Academic Writing. Bài này KHÔNG chép đề; chỉ nêu dạng và luyện bằng đề KHÁC.",
          "**Task 1 = quy trình (process) HAI GIAI ĐOẠN, hai hình.** Bẫy chính: hai hình đánh số lại từ 1 — bạn phải tự tìm **mắt xích** nối giai đoạn 1 với giai đoạn 2 (Tập 5 Ngày 12).",
          "**Task 2 = Discussion** — discuss both views and give your own opinion. Band 8 = **lập trường tinh** ngay ở mở bài và trình bày quan điểm kia **công bằng** (Tập 5 Ngày 10).",
          "Thứ tự: đọc mục B1–B5 (35 phút) → làm Đề 11 (60 phút, không dừng) → mục B6 sau đề (15 phút).",
          "Mang theo hai **“lượt của tôi”** từ Ngày 23 cho 4 phút soát cuối.",
        ],
      },

      /* ── B1 ── */
      { t: "h", text: "B1. Writing Đề 11 trong một bảng" },
      {
        t: "table",
        head: ["", "Task 1", "Task 2"],
        rows: [
          ["Dạng", "Process diagram — **hai giai đoạn**, mỗi giai đoạn một hình", "**Discussion**: hai quan điểm + ý kiến của bạn"],
          ["Thời gian gợi ý", "18–20 phút · ≥ 150 từ", "36–38 phút · ≥ 250 từ"],
          ["Điểm dễ mất", "overview không nói số bước / điểm đầu – điểm cuối; không nối hai giai đoạn; “Then… Then… After that…”", "thesis chỉ nói “I will discuss both views”; thân bài 1 viết quan điểm kia một cách hời hợt; kết bài đổi lập trường"],
          ["Ngữ pháp nên có", "bị động + rút gọn (Having been…, after which…, before being…) — Tập 5 Ngày 7", "nhượng bộ thật, một câu chẻ HOẶC một đảo ngữ (Ngày 13), register trung tính (Ngày 15), một câu giả định (Ngày 19)"],
          ["Ôn ở", "Tập 3 Ngày 28 · Tập 4 (process) · Tập 5 Ngày 7 · 12", "Tập 3 Ngày 10 · Tập 4 Ngày 10 · Tập 5 Ngày 10 · 13"],
        ],
        caption: "Đề 11 = band 8.0 — bài mẫu của đề viết ở mức 8.0–8.5",
      },

      /* ── B2 ── */
      { t: "h", text: "B2. Ôn nhanh ① — quy trình hai giai đoạn (bằng đề KHÁC)" },
      { t: "p", text: "Đề luyện: **The diagrams below show how used coffee grounds are made into fuel logs.** Hai hình, quy trình tự dựng cho bài luyện (số liệu minh hoạ, không phải của nhà máy nào). Đọc hai hình 2 phút, tìm mắt xích trước khi đọc bài mẫu." },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 1 — collection and preparation",
          note: "Quy trình tự dựng cho bài luyện; số liệu (60%, 10%) là minh hoạ.",
          steps: [
            { label: "Collection", note: "used grounds collected from cafés in sealed bins, twice a week" },
            { label: "Transport", note: "taken by van to the processing plant" },
            { label: "Screening", note: "paper cups, lids and other waste removed" },
            { label: "Drying", note: "dried in a rotating drum: moisture reduced from about 60% to 10%" },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 2 — manufacture and sale",
          note: "Quy trình tự dựng cho bài luyện.",
          steps: [
            { label: "Mixing", note: "dried grounds mixed with a small amount of plant-based binder" },
            { label: "Pressing", note: "compressed into log shapes under high pressure" },
            { label: "Cooling", note: "logs left to cool for 24 hours" },
            { label: "Packaging", note: "packed in boxes of six" },
            { label: "Distribution", note: "sold through garden centres and supermarkets as fuel for wood-burning stoves" },
          ],
        },
      },
      {
        t: "table",
        head: ["Việc trong 3 phút lập dàn", "Trả lời cho đề luyện"],
        rows: [
          ["Đếm bước, đếm giai đoạn", "9 bước, 2 giai đoạn (4 + 5)"],
          ["Điểm đầu → điểm cuối", "bã cà phê đã dùng ở quán → củi đóng hộp bán lẻ"],
          ["**Mắt xích** nối hai hình", "bã cà phê **đã sấy khô** — sản phẩm cuối của giai đoạn 1 = nguyên liệu đầu của giai đoạn 2"],
          ["Tự nhiên hay nhân tạo · tuyến tính hay vòng", "nhân tạo, tuyến tính (không quay vòng)"],
          ["Chia thân bài", "thân bài 1 = giai đoạn 1 · thân bài 2 = giai đoạn 2 (mở bằng mắt xích)"],
        ],
        caption: "Năm câu hỏi trước khi viết — dùng y nguyên cho Đề 11",
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 163 từ",
        paras: [
          { text: "The diagrams show the process of making fuel logs from used coffee grounds, which has two stages." },
          { text: "Overall, there are two stages in this process, and it has many steps from the cafés to the shops." },
          { text: "First, the used coffee grounds are collected from cafés in sealed bins two times a week. Then they are taken to a factory by van. Then the paper cups, lids and other rubbish are removed from the grounds. After that, the grounds is dried in a big drum and the moisture goes down from 60% to 10%, which is a big decrease." },
          { text: "In the second stage, the dry grounds are mixed with a binder which is made from plants. Then they are pressed into logs with high pressure. After that, the logs are cooled for 24 hours. Next, the logs are put in boxes of six. Finally, they are sent to garden centres and supermarkets, where people can buy them to use in their stoves at home." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 192 từ",
        paras: [
          { text: "The diagrams illustrate how used coffee grounds are turned into fuel logs, first by being collected and prepared and then by being manufactured into logs at a processing plant." },
          { text: "Overall, the process consists of nine steps divided into two stages. It begins with the collection of waste grounds from cafés and ends with packaged logs being sold to retailers, with the drying of the grounds marking the point at which the raw material is ready for manufacture." },
          { text: "In the first stage, used grounds are collected from cafés in sealed bins twice a week and taken by van to a processing plant. On arrival, foreign objects such as paper cups and lids are screened out, after which the grounds are dried in a rotating drum, reducing their moisture content from around 60% to just 10%." },
          { text: "The second stage begins once the grounds are dry. They are first mixed with a small quantity of plant-based binder and then compressed into log shapes under high pressure. Having been left to cool for 24 hours, the logs are packed in boxes of six and finally distributed to garden centres and supermarkets for use in wood-burning stoves." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["TA", "overview “two stages… many steps” — không số bước, không điểm đầu – cuối, không mắt xích", "9 bước · 2 giai đoạn · đầu → cuối · **drying… marking the point at which…** = mắt xích"],
          ["CC", "Then · Then · After that · Then · After that · Next — sáu lần chuỗi một màu", "On arrival · after which · once · first… and then · Having been… · finally — nối bằng cấu trúc, không chỉ bằng từ nối"],
          ["LR", "factory · goes down · two times · put in boxes", "processing plant · screened out · moisture content · compressed · distributed · retailers"],
          ["GRA", "~~the grounds is~~ · ~~with high pressure~~ (→ under)", "bị động + rút gọn: after which…, reducing…, Having been left… · không lỗi"],
        ],
        caption: "Chỗ khác nhau lớn nhất là overview — một câu đáng giá nửa band TA",
      },
      { t: "rule", formula: "Overall, the process consists of N steps in two stages. It begins with… and ends with…, with [mắt xích] marking the point at which…", vi: "Overview quy trình hai giai đoạn band 8 — số bước, điểm đầu – cuối, mắt xích." },

      /* ── B3 ── */
      { t: "h", text: "B3. Ôn nhanh ② — Discussion band 8 (bằng đề KHÁC)" },
      { t: "p", text: "Đề luyện: **Some people believe that countries should stop changing their clocks twice a year. Others argue that the seasonal change brings important benefits. Discuss both views and give your own opinion.**" },
      {
        t: "passage",
        title: "Band 7 (ước tính) — mở bài + thân bài 1",
        paras: [
          { text: "Nowadays, many countries change their clocks in spring and autumn. Some people think this should be stopped, while others believe it is useful. This essay will discuss both views and give my opinion." },
          { text: "On the one hand, there are some reasons why changing the clocks is beneficial. Firstly, it gives people more daylight in the evening in summer. For example, people can do sports after work. Secondly, it can save energy because people use less electricity for lighting. Therefore, many people think it is a good idea." },
        ],
      },
      {
        t: "passage",
        title: "Band 8 (ước tính) — trọn bài, 285 từ",
        paras: [
          { text: "In many countries the clocks are moved forward in spring and back in autumn, a practice dating from a time when saving fuel was a national priority. While its defenders point to lighter summer evenings, I believe the twice-yearly change now costs more than it saves and should be abandoned, provided that each country chooses its permanent time with care." },
          { text: "Supporters of the change argue, with some justification, that it fits the clock to the way people actually live. Moving an hour of daylight from the early morning, when most people are asleep, to the evening gives commuters a lighter journey home and more time outdoors, which is plausibly good for both health and local businesses. The original case was economic as well: less artificial lighting meant lower fuel consumption, an argument that carried real weight when coal was scarce. That argument, however, has weakened considerably, since lighting now accounts for only a small share of household energy use." },
          { text: "What persuades me, though, is not the merits of either time but the cost of switching between them. Several studies have reported a short-lived rise in road accidents and sleep problems in the days after the spring change, and the disruption falls hardest on those with the least flexible routines, such as shift workers and young children. Were the clocks simply left alone, these costs would disappear, while the benefit of lighter evenings could largely be kept by choosing a permanent summer time." },
          { text: "In conclusion, the seasonal change once served a clear purpose and still has real attractions. Nevertheless, since its main economic justification has faded and the switch itself causes measurable harm, I am convinced that countries should settle on a single time throughout the year." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["TR", "mở bài không có lập trường; thân bài 1 kể lợi ích nhưng không đánh giá", "thesis có lập trường **và điều kiện** (provided that…); quan điểm kia trình bày công bằng rồi chỉ ra chỗ đã yếu đi"],
          ["CC", "On the one hand · Firstly · Secondly · Therefore — khung đếm ý", "with some justification · as well · That argument, however, · What persuades me, though, — nối bằng ý"],
          ["LR", "useful · good idea · save energy", "a national priority · carried real weight · weakened considerably · least flexible routines · measurable harm"],
          ["GRA", "câu đơn, đúng", "câu chẻ What persuades me… is not… but… · đảo ngữ Were the clocks left alone, … would… (Ngày 19) — mỗi loại MỘT câu"],
        ],
        caption: "Band 8 Discussion: quan điểm kia được nói HAY — rồi mới bị cân lại",
      },
      { t: "rule", formula: "While its defenders point to…, I believe… should…, provided that… → thân bài 1: quan điểm kia, công bằng, rồi chỗ yếu → thân bài 2: lý do của tôi → kết: nhắc lại có mức", vi: "Khung Discussion band 8 — lập trường tinh có ngay ở câu thứ hai của bài." },

      /* ── B4 ── */
      { t: "h", text: "B4. Phân giờ 60 phút — bản band 8" },
      {
        t: "table",
        head: ["Phút", "Việc", "Ghi chú"],
        rows: [
          ["0–2", "đọc CẢ HAI đề", "Task 2 khó hơn dự kiến? Ghi nhanh 2–3 ý vào nháp trước, để đầu tự nghĩ trong lúc làm Task 1"],
          ["2–5", "Task 1: năm câu hỏi lập dàn (B2)", "viết overview ra nháp TRƯỚC"],
          ["5–19", "Task 1: viết", "đích 170–190 từ; dài hơn không cộng điểm"],
          ["19–20", "Task 1: soát lượt 1 + lượt 3", "chỉ động từ bị động và dấu câu"],
          ["20–26", "Task 2: lập dàn", "thesis có điều kiện · ý mạnh nhất của phía kia · lý do của tôi + ví dụ"],
          ["26–52", "Task 2: viết", "đích 280–310 từ"],
          ["52–56", "Task 2: soát “3 + 2” của Ngày 23", "lượt 1 → lượt 3 → hai lượt của tôi"],
          ["56–60", "lượt 6 cho CẢ HAI bài", "đọc ngược tìm chính tả · câu cuối Task 2 có trả lời đủ đề?"],
        ],
        caption: "Task 2 nặng gấp đôi Task 1 — nếu Task 1 quá 22 phút, cắt bớt chi tiết chứ không cắt soát Task 2",
      },
      {
        t: "note",
        title: "💡 Làm Task 2 trước được không?",
        items: [
          "Được — bài thi trên máy cho đi lại giữa hai Task. Làm Task 2 trước nếu sổ lỗi của bạn cho thấy **Task 2 thường bị thiếu giờ** ở Đề 9 hoặc Đề 10.",
          "Nếu làm Task 2 trước: đặt mốc cứng **phút 40** chuyển sang Task 1. Quá mốc là Task 1 dưới 150 từ — mất điểm nặng hơn cái bạn được ở Task 2.",
          "Không đổi thói quen ngay trong Đề 11 nếu chưa từng luyện kiểu đó. Đề thật không phải chỗ thử nghiệm.",
        ],
      },

      /* ── B5 ── */
      { t: "h", text: "B5. Checklist TRƯỚC khi bấm “Bắt đầu”" },
      {
        t: "note",
        title: "📌 Năm việc — 3 phút",
        items: [
          "Viết ra nháp hai **lượt của tôi** (Ngày 23 mục 7) và hai **khung câu**: overview quy trình (B2) · thesis Discussion (B3).",
          "Tắt thông báo, đặt điện thoại ngoài tầm nhìn — 60 phút liền, không dừng.",
          "Nhắc mình: **không** “This essay will discuss…”; **không** “Then… Then…”.",
          "Đồng hồ: Task 1 xong trước phút 20. Ghi “20 · 52 · 56” lên góc nháp.",
          "Sau khi nộp: KHÔNG mở bài mẫu ngay — nghỉ 10 phút rồi làm B6.",
        ],
      },

      /* ── B6 ── */
      { t: "h", text: "B6. SAU đề — 15 phút đọc bảng chấm" },
      {
        t: "table",
        head: ["Bước", "Làm gì", "Ghi vào sổ lỗi"],
        rows: [
          ["1 · 3 phút", "đọc điểm 4 tiêu chí của AI cho từng Task; tiêu chí nào thấp nhất?", "“Đề 11 · T1 · TA 7” …"],
          ["2 · 4 phút", "**soi bài mẫu của đề TRƯỚC khi đọc phần phân tích**: mỗi bài mẫu Đề 11 cố ý giữ hai lỗi nhỏ — bạn tìm được mấy?", "lỗi nào bạn KHÔNG thấy = lỗi bạn cũng sẽ để lọt"],
          ["3 · 4 phút", "đặt overview của bạn cạnh overview bài mẫu: thiếu số bước? thiếu mắt xích?", "một dòng: “overview thiếu …”"],
          ["4 · 4 phút", "đặt thesis của bạn cạnh thesis mẫu: có lập trường? có điều kiện / mức?", "lỗi lặp lại với Đề 9 · 10 ⇒ thành “lượt của tôi” mới"],
        ],
        caption: "Ngày 25 ôn lỗi từ Đề 11 — bảng này là đầu vào của nó",
      },

      /* ── B7 ── */
      { t: "h", text: "B7. Kiểm tra nhanh trước đề (6 câu)" },
      {
        t: "mcq",
        id: "t5d24-viet-kiem-tra",
        title: "Quy trình hai giai đoạn và Discussion",
        items: [
          { q: "1. Overview nào hợp band 8 nhất cho một quy trình hai giai đoạn?", options: ["A  Overall, there are many steps in the process.", "B  Overall, the process involves ten steps in two stages, beginning with harvesting and ending with bottling, with the dried leaves linking the two.", "C  Overall, the first stage is longer than the second stage."], correct: 1, why: "Số bước + số giai đoạn + đầu → cuối + mắt xích." },
          { q: "2. Hình 2 đánh số lại từ 1. Thân bài 2 nên mở bằng:", options: ["A  “Step 1 of the second diagram is…”", "B  “Once the leaves have dried, they are…” — nhắc lại sản phẩm cuối giai đoạn 1", "C  “Then, in the second picture,…”"], correct: 1, why: "Nối hai giai đoạn bằng mắt xích, không bằng số bước của hình." },
          { q: "3. Câu nào gọn và đúng nhất?", options: ["A  The logs are cooled. After that the logs are packed.", "B  Having been cooled, the logs are packed.", "C  Having cooled the logs, they are packed."], correct: 1, why: "Rút gọn bị động: Having been + V3. C là chủ ngữ treo (Ngày 9)." },
          { q: "4. Thesis Discussion nào band 8?", options: ["A  This essay will discuss both views and give my opinion.", "B  Both views have advantages and disadvantages.", "C  While defenders of the policy point to its low cost, I believe it should be replaced, provided that a cheaper alternative is available."], correct: 2, why: "Có quan điểm kia, có lập trường, có điều kiện." },
          { q: "5. Thân bài trình bày quan điểm bạn KHÔNG theo, band 8 nên:", options: ["A  viết thật ngắn để không ai nghĩ bạn đồng ý", "B  trình bày công bằng, có lý do thật, rồi chỉ ra chỗ nó yếu đi", "C  chỉ liệt kê ba ý không phát triển"], correct: 1, why: "TR band 8: mọi phần của đề được trả lời đầy đủ — kể cả quan điểm bạn không theo." },
          { q: "6. Còn 4 phút, Task 2 đã xong. Việc đúng nhất:", options: ["A  viết thêm một đoạn ví dụ", "B  soát “3 + 2”: lượt 1, lượt 3, hai lượt của tôi", "C  đọc lại Task 1 để sửa ý"], correct: 1, why: "Ngày 23 mục 7: bốn phút cuối chỉ để sửa lỗi, không sửa ý." },
        ],
      },

      /* ── B8 ── */
      { t: "h", text: "B8. (Tuỳ chọn, ngày khác) Viết trọn hai đề luyện — AI chấm" },
      { t: "p", text: "Không làm hôm nay nếu đã làm Đề 11 — một ngày hai bài Writing đủ thời gian là quá sức và không phản ánh đúng sức. Để dành cho Ngày 26 (sprint Task 1) hoặc ngày nghỉ." },
      {
        t: "essay",
        id: "t5d24-viet-luyen-t1",
        task: "Task 1",
        minWords: 150,
        prompt: "The diagrams below show how used coffee grounds are made into fuel logs. Stage 1 — collection and preparation: (1) used grounds collected from cafés in sealed bins, twice a week; (2) taken by van to the processing plant; (3) paper cups, lids and other waste removed; (4) dried in a rotating drum, moisture reduced from about 60% to 10%. Stage 2 — manufacture and sale: (5) mixed with a small amount of plant-based binder; (6) compressed into log shapes under high pressure; (7) left to cool for 24 hours; (8) packed in boxes of six; (9) sold through garden centres and supermarkets as fuel for wood-burning stoves. Summarise the information by selecting and reporting the main features. Write at least 150 words. (Viết bằng lời của bạn — không chép bài mẫu.)",
        tips: [
          "Overview: số bước · hai giai đoạn · đầu → cuối · mắt xích.",
          "Ít nhất hai câu rút gọn bị động (after which… / Having been…).",
          "Không quá một lần then.",
        ],
      },
      {
        t: "essay",
        id: "t5d24-viet-luyen-t2",
        task: "Task 2",
        minWords: 250,
        prompt: "Some people think that public libraries should become community centres offering a wide range of activities, while others believe they should focus on providing books and quiet study space. Discuss both views and give your own opinion. Write at least 250 words.",
        tips: [
          "Thesis có lập trường + điều kiện ngay trong mở bài.",
          "Quan điểm kia: một thân bài, công bằng, có lý do thật.",
          "Một câu chẻ HOẶC một đảo ngữ; một nhượng bộ thật.",
          "Soát “3 + 2” trước khi nộp.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d24-nghe",
    kind: "listening",
    title: "Nghe: Listening Đề 11 (hướng dẫn làm đề) — tốc độ thật ~180 từ/phút, nhiễu nền, bảy giọng, và năm tín hiệu “sửa lại”",
    goal: "Vào Listening Đề 11 với tai đã khởi động ở đúng ba điều kiện của đề — nhiễu nền buộc người nói hỏi lại / đánh vần lại, tốc độ ~180 từ/phút, bảy giọng — nhận ra năm tín hiệu sửa lại để chỉ ghi bản CUỐI được xác nhận, và sau đề tự mổ được trong 20 phút cho Ngày 25.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · làm gì hôm nay",
        items: [
          "**Đề 11 (band 8.0)** làm trong Online Test: bộ **Đề 11** → Listening, 30 phút + 2 phút soát. Bài này không chép đề; chỉ nêu dạng, giọng, và khởi động bằng ba đoạn tự soạn.",
          "Cái mới của Đề 11 so với Đề 10: ==nhiễu nền được dựng bằng tình huống== — người nói ở chỗ ồn, phải hỏi lại, đánh vần lại, sửa lại. Đáp án là **bản cuối được xác nhận**, không phải bản nghe rõ nhất.",
          "**Năm tín hiệu sửa lại** (mục 2) — nghe ra là biết bản trước đó bị huỷ.",
          "Khởi động: form qua nhiễu (Úc + Ireland) · map (Anh) · note completion (New Zealand) — 15 câu, ~12 phút.",
          "Sau đề: tự mổ 20 phút theo bảng mục 7 — Ngày 25 mổ Listening Đề 11 dùng đúng bảng này.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Listening Đề 11 trong một bảng" },
      {
        t: "table",
        head: ["Part", "Dạng câu", "Người nói · giọng", "Chú ý"],
        rows: [
          ["1 (1–10)", "Form + Table", "hai người · Úc + Ireland", "khách gọi từ chỗ ồn ⇒ hỏi lại, đánh vần lại; số và chữ bị sửa"],
          ["2 (11–20)", "Multiple choice + Map", "một người · Anh", "nói ở nơi có tiếng nền; map: tìm mốc cố định trước"],
          ["3 (21–30)", "Multiple choice · Choose TWO · Flow-chart", "ba người · New Zealand · Canada · Mỹ", "phương án bị bác vì một lý do thực tế; người đổi ý giữa chừng"],
          ["4 (31–40)", "Note completion (10 câu)", "một người · Anh", "bài giảng dài, có tiếng ồn bên ngoài làm người nói ngừng rồi nói lại"],
        ],
        caption: "Đề 11: ~180 từ/phút, bảy giọng, nhiễu nền dựng bằng lời thoại (không có tệp âm thanh nhiễu riêng)",
      },
      {
        t: "note",
        title: "📌 So với Đề 10 (Ngày 16)",
        items: [
          "Cùng: bẫy số bị đổi, phủ định kép, phương án bị bác ở Part 3 (Ngày 16 mục 3–4).",
          "Mới: **lượt hỏi lại** cắt ngang câu trả lời. Người band 7 ghi bản đầu rồi không sửa; người band 8 giữ ô trống đến khi có lời xác nhận (yes · that's right · exactly · got it).",
          "Mới: **Part 4 có lúc người nói dừng giữa câu** (tiếng ồn) rồi nói lại khác đi một chút — bản nói lại mới là bản đúng ngữ pháp với chỗ trống.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Nghe qua nhiễu — năm tín hiệu “sửa lại”" },
      {
        t: "table",
        head: ["Tín hiệu", "Nghe như", "Nghĩa là"],
        rows: [
          ["① Hỏi lại", "Sorry, say that again? · You're breaking up · Was that B or D?", "câu ngay sau là bản **nhắc lại** — có thể khác bản đầu"],
          ["② Tự sửa", "No, hang on — · Sorry, I mean… · Scratch that —", "bản TRƯỚC bị huỷ"],
          ["③ Thay thế", "Make that… · Actually, let's say… · Better put…", "bản SAU thay bản trước"],
          ["④ Đánh vần lại", "That's double N · not M, N for November · one-four, not four-zero", "đáp án = bản đánh vần cuối"],
          ["⑤ Xác nhận", "Yes, that's it · Exactly · Got it · Perfect", "đến đây mới được ghi chắc"],
        ],
        caption: "Quy tắc: ghi nháp bản đầu → gạch khi nghe ② / ③ → chỉ chép vào ô khi nghe ⑤ (hoặc khi người nói chuyển hẳn sang ý khác)",
      },
      {
        t: "examples",
        items: [
          { en: "“It's flat forty — sorry, you're breaking up — fourteen, one-four.” → **14**", vi: "Bản đầu (40) bị huỷ bởi tín hiệu ① + ④." },
          { en: "“Let's book Thursday… oh, hang on, they're closed Thursdays. Make that Friday.” → **Friday**", vi: "Tín hiệu ② rồi ③." },
          { en: "“Was that M for Mike? — No, N, N for November.” → chữ **N**", vi: "Tín hiệu ④: đánh vần lại bằng bảng chữ cái phiên âm." },
        ],
      },
      { t: "rule", formula: "bản đầu → (② tự sửa / ③ thay thế / ④ đánh vần lại) → bản cuối → ⑤ xác nhận = đáp án", vi: "Trong đề có nhiễu, đáp án gần như luôn là bản CUỐI." },

      /* ── 3 ── */
      { t: "h", text: "3. Bảy giọng — nhắc nhanh, không học lại" },
      {
        t: "table",
        head: ["Giọng", "Nghe ra bằng", "Ôn ở"],
        rows: [
          ["Ireland", "t mềm giữa từ · “grand” = ổn · I've + danh từ (I've a room free) · giờ kiểu “half two” = 2:30", "Tập 4 Ngày 21 · Tập 5 Ngày 20 · 21"],
          ["Úc", "/eɪ/ nghe gần /aɪ/ (day ≈ die) · câu kể lên giọng cuối", "Tập 3 · Tập 5 Ngày 1"],
          ["New Zealand", "/e/ nghe gần /i/ (ten ≈ tin) · /ɪ/ rút về /ə/ (fish ≈ fush)", "Tập 3 · Tập 5 Ngày 5 · 20"],
          ["Canada", "about / out nâng âm đầu · /t/ giữa từ thành /d/ nhẹ như Mỹ", "Tập 3 · Tập 5 Ngày 13"],
          ["Mỹ", "t giữa hai nguyên âm thành /ɾ/ (water ≈ wader) · r sau nguyên âm luôn đọc", "Tập 5 Ngày 1"],
          ["Anh", "r sau nguyên âm không đọc · t có thể nuốt thành tắc thanh hầu (bottle ≈ bo'le)", "Tập 5 Ngày 1"],
        ],
        caption: "Đề 11 dùng giọng Anh ở hai Part — giọng “dễ” nhất lại đi với hai dạng khó nhất (map, note 10 câu)",
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động ① — form qua nhiễu (Questions 1–5)" },
      { t: "p", text: "**Questions 1–5.** Complete the form. Write **ONE WORD AND/OR A NUMBER** for each answer. Nghe **một lần**." },
      {
        t: "table",
        head: ["Kestrel Couriers — collection request", ""],
        rows: [
          ["Collection from", "Unit (1) …… , Harbour Lane Market"],
          ["Customer surname", "(2) ……"],
          ["Item", "a framed (3) …… (about 1 metre wide)"],
          ["Delivery day", "(4) ……"],
          ["Price", "£ (5) …… (no insurance)"],
        ],
        caption: "Form — tên công ty, địa điểm, người là hư cấu",
      },
      {
        t: "listen",
        id: "t5d24-nghe-form",
        title: "A collection request from a busy market",
        dan: { so: "Day 24, Warm-up 1", boiCanh: "a man phoning a courier company from a street market.", cau: [1, 5] },
        lines: [
          { who: "Orla", voice: "ie-nu", text: "Kestrel Couriers, Orla speaking, how can I help?" },
          { who: "Dean", voice: "au-nam", text: "Hi, yeah, I need something picked up from the market on Harbour Lane — sorry, it's a bit loud here, there's a band setting up right next to my stall." },
          { who: "Orla", voice: "ie-nu", text: "You're grand, I can hear you. Which unit are you in?" },
          { who: "Dean", voice: "au-nam", text: "Forty — no, sorry, that came out wrong. Fourteen. One-four. Forty's the coffee van across the way." },
          { who: "Orla", voice: "ie-nu", text: "Unit fourteen, Harbour Lane Market. And the name for the booking?" },
          { who: "Dean", voice: "au-nam", text: "Brannigan. B-R-A-N… sorry, the drummer's just started… B-R-A-double N-I-G-A-N." },
          { who: "Orla", voice: "ie-nu", text: "Was that M for Mike after the A?" },
          { who: "Dean", voice: "au-nam", text: "No, N for November. Two of them. Brannigan." },
          { who: "Orla", voice: "ie-nu", text: "Got it. And what are we collecting?" },
          { who: "Dean", voice: "au-nam", text: "It's a mirror, a big one — actually, hang on, no. The mirror's going next week. Today it's a framed print, about a metre across. Glass front, so it'll want a bit of care." },
          { who: "Orla", voice: "ie-nu", text: "A framed print, no bother. When does it need to arrive?" },
          { who: "Dean", voice: "au-nam", text: "The gallery wanted Thursday… oh, wait, they've just texted — they're shut on Thursdays now. Make that Friday, any time before four." },
          { who: "Orla", voice: "ie-nu", text: "Friday it is. Now, the standard price for that size is twenty-eight pounds, but you're a market trader, so you get our traders' rate, which brings it to twenty-four. Insurance would be three on top of that." },
          { who: "Dean", voice: "au-nam", text: "Say that again? Twenty-four plus three?" },
          { who: "Orla", voice: "ie-nu", text: "That's right, if you want the cover." },
          { who: "Dean", voice: "au-nam", text: "Nah, I'll leave the insurance. I'll wrap it properly myself. Twenty-four's fine." },
          { who: "Orla", voice: "ie-nu", text: "Perfect. The driver'll be with you by half two." },
        ],
      },
      {
        t: "quiz",
        id: "t5d24-nghe-form-cau",
        kind: "fill",
        title: "Questions 1–5 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Unit ___ , Harbour Lane Market", answers: ["14", "fourteen"], hint: "“Forty — no, sorry… Fourteen. One-four.” Tín hiệu ② + ④. Forty là xe cà phê đối diện." },
          { q: "2. Customer surname: ___", answers: ["Brannigan"], hint: "B-R-A-double N-I-G-A-N; “No, N for November. Two of them.” Tín hiệu ① + ④." },
          { q: "3. Item: a framed ___", answers: ["print"], hint: "“It's a mirror… actually, hang on, no. The mirror's going next week. Today it's a framed print.” Tín hiệu ②." },
          { q: "4. Delivery day: ___", answers: ["Friday"], hint: "“The gallery wanted Thursday… they're shut on Thursdays now. Make that Friday.” Tín hiệu ③." },
          { q: "5. Price: £ ___ (no insurance)", answers: ["24", "twenty-four"], hint: "28 = giá chuẩn; traders' rate = 24; bảo hiểm +3 nhưng anh ấy KHÔNG mua (“I'll leave the insurance”). Bẫy số bị đổi — Ngày 16 mục 3." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Khởi động ② — map (Questions 6–9)" },
      { t: "p", text: "**Questions 6–9.** Label the map. Write the correct letter, **A–F**. Trước khi nghe 30 giây: tìm **Entrance**, **Main path**, **Mill Lane**, **Café**, **Duck pond** — người nói sẽ chỉ đường từ những mốc này." },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Thornby Open-Air Museum",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 12, rows: 9,
            paths: [
              { x: 5.5, y: 0, w: 1, h: 9, label: "Main path" },
              { x: 0, y: 4.1, w: 12, h: 0.8, label: "Mill Lane" },
            ],
            boxes: [
              { x: 0.5, y: 1.2, w: 2.2, h: 1.9, label: "Duck pond" },
              { x: 3, y: 1.2, w: 2.1, h: 1.9, blank: "E" },
              { x: 7, y: 1.2, w: 2, h: 1.9, blank: "C" },
              { x: 9.5, y: 1.2, w: 2, h: 1.9, blank: "D" },
              { x: 0.5, y: 6, w: 2, h: 1.6, blank: "B" },
              { x: 3, y: 6, w: 2.1, h: 1.6, blank: "A" },
              { x: 7, y: 6, w: 2, h: 1.6, label: "Café" },
              { x: 9.5, y: 6, w: 2, h: 1.6, blank: "F" },
            ],
            pins: [{ x: 6, y: 8.7, label: "Entrance" }],
          },
        },
      },
      {
        t: "listen",
        id: "t5d24-nghe-map",
        title: "A welcome talk at an open-air museum",
        dan: { so: "Day 24, Warm-up 2", boiCanh: "a guide giving visitors directions at the start of a tour.", cau: [6, 9] },
        lines: [
          { who: "Guide", voice: "uk-nam", text: "Right, if everyone can hear me over the school group behind us — lovely. You're standing at the entrance, at the southern edge of the site. The main path runs straight ahead of you, north, all the way to the far fence, and about halfway up it's crossed by Mill Lane, which runs east to west." },
          { who: "Guide", voice: "uk-nam", text: "Now, a lot of visitors head for the bakery first, because of the smell. The building just past the entrance on your left, with the red door, used to be the bakery, but it's now our gift shop. The bakery moved last spring, and you'll find it on the other side of the path, beyond the café — it's the building furthest to the east, before you reach Mill Lane." },
          { who: "Guide", voice: "uk-nam", text: "If you go up to Mill Lane and carry on north, the schoolhouse is on your left. Don't confuse it with the cottage by the pond — the schoolhouse is the building next to the pond, yes, but on the path side, so it's the one you reach first." },
          { who: "Guide", voice: "uk-nam", text: "Directly opposite the schoolhouse, across the main path, is the blacksmith's forge — the building nearest the path on that side. You'll hear it before you see it; they light the fire at eleven." },
          { who: "Guide", voice: "uk-nam", text: "And the windmill — well, it's not a full windmill any more, just the base and the machinery, but it's worth the walk. Follow Mill Lane east, then turn up the track at the very end. It's the furthest building in the north-east corner. The toilets, by the way, are the small block in the far south-west, past the gift shop." },
        ],
      },
      {
        t: "quiz",
        id: "t5d24-nghe-map-cau",
        kind: "fill",
        title: "Questions 6–9 — gõ chữ cái A–F",
        items: [
          { q: "6. Bakery", answers: ["F"], hint: "A (cửa đỏ) là tiệm bánh CŨ, nay là gift shop — bẫy thời gian. “beyond the café… furthest to the east, before you reach Mill Lane” ⇒ F." },
          { q: "7. Schoolhouse", answers: ["E"], hint: "“next to the pond… but on the path side” ⇒ E (không phải Duck pond)." },
          { q: "8. Blacksmith's forge", answers: ["C"], hint: "“Directly opposite the schoolhouse, across the main path… nearest the path” ⇒ C." },
          { q: "9. Windmill", answers: ["D"], hint: "“the furthest building in the north-east corner” ⇒ D. B = toilets (far south-west)." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Khởi động ③ — note completion, giọng New Zealand (Questions 10–15)" },
      { t: "p", text: "**Questions 10–15.** Complete the notes. Write **ONE WORD AND/OR A NUMBER** for each answer. Bài giảng ngắn có một chỗ bị ngắt vì tiếng ồn — nghe bản nói lại." },
      {
        t: "table",
        head: ["The first crosswords", ""],
        rows: [
          ["First puzzle", "published in a New York newspaper in December (10) ……"],
          ["Shape", "a (11) …… , not a square"],
          ["Original name", "word-(12) ……"],
          ["Name change", "caused by a (13) …… error"],
          ["1920s craze", "some libraries limited time spent using (14) ……"],
          ["Early criticism", "said to waste time that should be spent on (15) ……"],
        ],
        caption: "Notes",
      },
      {
        t: "listen",
        id: "t5d24-nghe-note",
        title: "A short history of the crossword",
        dan: { so: "Day 24, Warm-up 3", boiCanh: "part of a lecture on the history of popular puzzles.", cau: [10, 15] },
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "Today we're looking at a puzzle so familiar that it's hard to believe it's barely a century old. The first crossword is usually dated to December nineteen-thirteen, when a journalist called Arthur Wynne published one in the Sunday supplement of a New York paper. It didn't look much like the puzzles you know. There were no black squares; the grid was a diamond, with a hollow centre, and the clues were simply numbered pairs." },
          { who: "Lecturer", voice: "nz-nu", text: "Wynne didn't call it a crossword, either. He called it a word-cross, which describes it rather well. The two halves were swapped a few weeks later, and the usual story is that this happened by accident — sorry, can you hear me at the back? There's a lawnmower outside. Right — the usual story is that a typesetter reversed the words, a printing error, and the new name simply stuck." },
          { who: "Lecturer", voice: "nz-nu", text: "By the nineteen-twenties the puzzle had become a craze. Publishers brought out whole books of crosswords, and pencils were sold attached to them. Not everyone was pleased. Some libraries, apparently, had to put limits on how long a reader could spend with the dictionaries, because solvers were queuing for them." },
          { who: "Lecturer", voice: "nz-nu", text: "And there were the predictable complaints in the press. You might expect the main charge to be that crosswords damaged people's eyesight, and that was said occasionally. But the commoner accusation was that they wasted hours that ought to have gone into work. Some critics went further and called the puzzles a threat to family life — though I'd treat that one with a pinch of salt." },
        ],
      },
      {
        t: "quiz",
        id: "t5d24-nghe-note-cau",
        kind: "fill",
        title: "Questions 10–15 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "10. published in a New York newspaper in December ___", answers: ["1913"], hint: "“December nineteen-thirteen”." },
          { q: "11. Shape: a ___ , not a square", answers: ["diamond"], hint: "“the grid was a diamond, with a hollow centre”." },
          { q: "12. Original name: word-___", answers: ["cross"], hint: "“He called it a word-cross”." },
          { q: "13. Name change caused by a ___ error", answers: ["printing", "typesetting"], hint: "Câu bị ngắt (lawnmower) rồi nói lại: “a typesetter reversed the words, a printing error”." },
          { q: "14. some libraries limited time spent using ___", answers: ["dictionaries"], hint: "“limits on how long a reader could spend with the dictionaries”." },
          { q: "15. said to waste time that should be spent on ___", answers: ["work"], hint: "eyesight là bẫy (You might expect… said occasionally); family life là ý của “some critics went further”. Lời buộc tội PHỔ BIẾN hơn: “wasted hours that ought to have gone into work”." },
        ],
      },
      {
        t: "table",
        head: ["Câu", "Bẫy", "Tín hiệu"],
        rows: [
          ["1 · 3 · 4", "bản đầu bị huỷ", "② tự sửa · ③ thay thế"],
          ["2", "chữ cái dễ nhầm M / N", "① hỏi lại · ④ đánh vần lại"],
          ["5", "ba con số (28 · 24 · +3)", "phủ định: “I'll leave the insurance” — Ngày 16 mục 3"],
          ["6", "công trình đổi chức năng (used to be… now)", "bẫy thời gian — Ngày 23 Bài 2 bẫy ④"],
          ["13", "câu bị ngắt vì tiếng ồn", "nghe bản nói lại sau “Right —”"],
          ["15", "ba lời buộc tội, chỉ một là “commoner”", "You might expect… · went further… · I'd treat that with a pinch of salt"],
        ],
        caption: "Chấm 15 câu khởi động — mục tiêu ≥ 13/15 trước khi vào đề",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Hai phút kiểm cuối và 20 phút tự mổ sau đề" },
      {
        t: "note",
        title: "📌 Hai phút kiểm cuối — bản dành cho Đề 11",
        items: [
          "**Giới hạn từ:** ô nào vượt ONE WORD AND/OR A NUMBER? Một chữ thừa = sai cả câu.",
          "**Chính tả tên riêng:** khớp đúng bản đánh vần CUỐI (double letters!).",
          "**Số:** viết số, không viết chữ, nếu không chắc chính tả (14 thay cho fourteen). Tiền: không ghi ký hiệu tiền nếu đề đã in sẵn £.",
          "**Số ít / số nhiều:** người nói nói dictionaries thì ô ghi dictionaries — kiểm ngữ pháp câu ghi chú.",
          "**Ô trống:** không bỏ trống câu nào — đoán theo từ loại cần điền.",
        ],
      },
      {
        t: "table",
        head: ["Bước sau đề", "Làm gì", "Mang sang Ngày 25"],
        rows: [
          ["1 · 3 phút", "xem điểm từng Part; Part nào mất nhiều nhất?", "“Part … mất … câu”"],
          ["2 · 10 phút", "mở lời thoại; với MỖI câu sai, tìm chuỗi `ev` (bằng chứng) và tín hiệu đứng trước nó", "câu · bẫy (số đổi / sửa lại / phủ định / phương án bị bác) · tín hiệu bạn bỏ lỡ"],
          ["3 · 4 phút", "nghe lại ĐÚNG đoạn của câu sai, không xem lời; lần này có nghe ra không?", "nghe ra = lỗi tập trung · vẫn không ra = lỗi âm / giọng"],
          ["4 · 3 phút", "đếm loại lỗi; so với sổ lỗi Đề 9 · Đề 10", "loại lỗi lặp ba đề = trọng tâm Ngày 25"],
        ],
        caption: "Ngày 25: “Mổ Listening Đề 11 + 2 phút kiểm” bắt đầu từ bảng này",
      },
      {
        t: "mcq",
        id: "t5d24-nghe-kiem-tra",
        title: "Trước khi vào đề — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Người nói: “The code is H-4-7… sorry, you're breaking up… H-4-1, one, not seven.” Ghi:", options: ["A  H47", "B  H41", "C  H471"], correct: 1, why: "Tín hiệu ① rồi ④: bản cuối, có xác nhận “one, not seven”." },
          { q: "2. “We'll meet at the north gate — actually, let's say the car park, it's easier.” Địa điểm là:", options: ["A  north gate", "B  car park", "C  không rõ"], correct: 1, why: "Tín hiệu ③ “let's say” thay bản trước." },
          { q: "3. Part 4 người nói dừng vì tiếng ồn rồi nói lại câu khác đi một chút. Bạn nên:", options: ["A  ghi theo bản đầu vì nghe rõ hơn", "B  ghi theo bản nói lại, kiểm từ loại khớp chỗ trống", "C  bỏ trống"], correct: 1, why: "Bản nói lại là bản người nói muốn bạn nghe; kiểm ngữ pháp với ghi chú." },
          { q: "4. Ô ghi “£ ……”. Bạn nghe “twenty-four pounds”. Ghi:", options: ["A  £24", "B  24", "C  twenty-four pounds"], correct: 1, why: "£ đã in sẵn; C vượt giới hạn từ." },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "you're breaking up", pos: "phr", ipa: "/jɔː ˈbreɪkɪŋ ʌp/", vi: "(điện thoại) tiếng bạn bị ngắt quãng", ex: "Sorry, you're breaking up — can you say the number again?", exVi: "Xin lỗi, tiếng bạn bị ngắt — bạn nói lại số được không?", more: "tín hiệu ① của Part 1 · the line is bad · I lost you there" },
          { w: "scratch that", pos: "phr", ipa: "/skrætʃ ðæt/", vi: "bỏ cái vừa nói đi (tự sửa)", ex: "Tuesday at ten — scratch that, Tuesday at eleven.", exVi: "Thứ Ba lúc mười giờ — bỏ đi, thứ Ba lúc mười một giờ.", more: "tín hiệu ② · thân mật; trang trọng hơn: I beg your pardon, I meant…" },
          { w: "no bother", pos: "phr", ipa: "/nəʊ ˈbɒðə/", vi: "không vấn đề gì (Ireland, Scotland, Bắc Anh)", ex: "A framed print? No bother, we'll send a van.", exVi: "Một bức tranh in có khung à? Không vấn đề gì, chúng tôi sẽ gửi xe tải.", more: "gần nghĩa: no problem · you're grand (Ireland) = ổn mà" },
          { w: "make that", pos: "phr", ipa: "/meɪk ðæt/", vi: "đổi thành (thay con số / lựa chọn vừa nói)", ex: "Two tickets, please — no, make that three.", exVi: "Cho hai vé — à không, ba vé.", more: "tín hiệu ③ · gần nghĩa: let's say… · actually, …" },
          { w: "craze", pos: "n", ipa: "/kreɪz/", vi: "cơn sốt, trào lưu ngắn hạn", ex: "The puzzle became a national craze within a year.", exVi: "Trò đố trở thành cơn sốt cả nước chỉ trong một năm.", more: "the latest craze · a craze for N · khác trend (xu hướng dài hơn)" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 24 ═══════════════════════════ */
  {
    id: "t5d24-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 24 — cụm AWL, Match chủ đề, câu quy trình, thesis Discussion, nghe qua nhiễu (34 câu + 1 đoạn viết)",
    goal: "Tự kiểm lại Ngày 24 bằng câu MỚI: dùng đúng cụm AWL theo chủ đề, viết câu quy trình bằng bị động + rút gọn, chọn thesis Discussion có lập trường tinh, ghi đúng bản cuối trong một cuộc gọi có nhiễu — và viết một mở bài + overview cho quy trình hai giai đoạn mới.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Làm bài tập thế nào",
        items: [
          "Làm **sau** Đề 11 hoặc vào sáng hôm sau — không làm trước đề (đầu cần nghỉ).",
          "Phần I–VII tự chấm. Câu sai ghi vào sổ lỗi: cụm AWL sai → chép lại cả câu ví dụ của Bài 1; câu nghe sai → ghi tín hiệu bạn bỏ lỡ (①–⑤).",
          "Phần VIII (AI chấm) chỉ viết **mở bài + overview** — đúng hai câu quyết định TA của Task 1.",
          "Xong bài tập mới làm **Kiểm tra chặng 4** (bài cuối của ngày, có thể để sang hôm sau).",
        ],
      },

      { t: "h", text: "I. Cụm AWL — điền MỘT từ (chữ đầu cho sẵn) (8 câu) — ôn Bài 1 mục 2–3" },
      {
        t: "quiz",
        id: "t5d24-bt-awl",
        kind: "fill",
        title: "Cụm AWL đa năng",
        items: [
          { q: "1. Children who grow up near busy roads show a higher i___ of asthma.", answers: ["incidence"], hint: "a higher incidence of + bệnh." },
          { q: "2. The council has p___ cycle lanes over new car parks.", answers: ["prioritised", "prioritized"], hint: "prioritise A over B." },
          { q: "3. Several countries have i___ restrictions on single-use plastics.", answers: ["imposed"], hint: "impose restrictions on." },
          { q: "4. Without a coherent s___, the reforms are likely to be reversed.", answers: ["strategy"], hint: "lack a coherent strategy." },
          { q: "5. There is considerable s___ for cutting waste in hospitals.", answers: ["scope"], hint: "considerable scope for." },
          { q: "6. Many small farms struggle to r___ young workers.", answers: ["retain"], hint: "retain staff / workers." },
          { q: "7. Until the data are published, it is wise to s___ judgement.", answers: ["suspend"], hint: "suspend judgement." },
          { q: "8. Free training could f___ the transition to cleaner industries.", answers: ["facilitate"], hint: "facilitate the transition to." },
        ],
      },

      { t: "h", text: "II. Match chủ đề — chọn câu khung hợp chủ đề (6 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq",
        id: "t5d24-bt-match",
        title: "Chủ đề ↔ câu khung AWL",
        items: [
          { q: "1. Đề Task 2 về **thức ăn nhanh và béo phì**. Câu khung hợp nhất:", options: ["A  Cheap calories and poor health are, to a large extent, mutually reinforcing.", "B  Elite success seldom translates into higher participation.", "C  How a society commemorates its past reveals its priorities."], correct: 0, why: "Food / Health ⇒ nhân quả hai chiều." },
          { q: "2. Đề về **tổ chức Olympic có làm người dân chơi thể thao nhiều hơn không**:", options: ["A  Subsidies can facilitate the transition to renewables.", "B  Elite success seldom translates into higher participation among ordinary people.", "C  New estates often lack adequate provision for clinics."], correct: 1, why: "Sport ⇒ participation." },
          { q: "3. Đề về **bỏ thi cử, thay bằng đánh giá liên tục**:", options: ["A  Assessment that rewards memorisation can undermine the very skills it claims to measure.", "B  Restrictions on advertising are justified by the health risk.", "C  The benefits of space research are hard to quantify."], correct: 0, why: "Education ⇒ assessment · undermine." },
          { q: "4. Đề về **AI quyết định cho vay tiền**:", options: ["A  Free entry may reverse a decline in visits.", "B  Automated decisions should undergo the same scrutiny as decisions made by people.", "C  Habits formed in childhood persist into adulthood."], correct: 1, why: "AI & ethics ⇒ automated decisions · scrutiny." },
          { q: "5. Đề về **du lịch đại trà ở làng nhỏ**:", options: ["A  A uniform approach to tourism ignores the capacity of small communities.", "B  Pension systems were designed for a different demographic structure.", "C  Reading for pleasure correlates with attainment."], correct: 0, why: "Tourism ⇒ uniform approach · capacity." },
          { q: "6. Đề về **mua sắm có làm người ta hạnh phúc hơn**:", options: ["A  Beyond a certain income, people derive little additional satisfaction from spending.", "B  Harsher sentences have little effect.", "C  Integration into global markets has benefited consumers."], correct: 0, why: "Money & consumerism ⇒ derive satisfaction from." },
        ],
      },

      { t: "h", text: "III. Cặp AWL dễ nhầm (4 câu) — ôn Bài 1 mục 6" },
      {
        t: "mcq",
        id: "t5d24-bt-cap-nham",
        title: "Chọn từ đúng",
        items: [
          { q: "1. From the rising prices, we can ___ that demand has outstripped supply.", options: ["imply", "infer"], correct: 1, why: "Người đọc / người nghe suy ra ⇒ infer." },
          { q: "2. The trade in ___ wildlife products is worth billions.", options: ["elicit", "illicit"], correct: 1, why: "illicit = bất hợp pháp." },
          { q: "3. A long period of drought ___ the famine.", options: ["preceded", "proceeded"], correct: 0, why: "xảy ra trước ⇒ preceded." },
          { q: "4. Few politicians have ___ lasting change in the housing market.", options: ["affected", "effected"], correct: 1, why: "effect change = tạo ra thay đổi (động từ, trang trọng)." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (4 câu) — ôn Bài 1" },
      {
        t: "quiz",
        id: "t5d24-bt-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — mỗi câu một cụm AWL",
        grammar: "cụm AWL của Ngày 24",
        items: [
          { q: "Tỉ lệ tai nạn ở vùng nông thôn cao hơn.", answers: ["There is a higher incidence of accidents in rural areas.", "Rural areas have a higher incidence of accidents.", "The incidence of accidents is higher in rural areas.", "There is a higher incidence of accidents in the countryside."], hint: "a higher incidence of" },
          { q: "Nhiều người không có được sự hài lòng từ công việc của họ.", answers: ["Many people do not derive satisfaction from their work.", "Many people derive little satisfaction from their work.", "Many people don't derive satisfaction from their jobs.", "Many people do not derive any satisfaction from their work.", "Many people derive no satisfaction from their jobs."], hint: "derive satisfaction from" },
          { q: "Cách làm đồng loạt hiếm khi hiệu quả ở những vùng khác nhau như vậy.", answers: ["A uniform approach rarely works in such different regions.", "A uniform approach is rarely effective in such different regions.", "A uniform approach seldom works in regions that are so different.", "A uniform approach rarely works in regions as different as these.", "A one-size-fits-all approach rarely works in such different regions."], hint: "a uniform approach" },
          { q: "Hai vấn đề này củng cố lẫn nhau.", answers: ["These two problems are mutually reinforcing.", "The two problems are mutually reinforcing.", "These two issues are mutually reinforcing.", "The two issues reinforce each other."], hint: "mutually reinforcing" },
        ],
      },

      { t: "h", text: "V. Câu quy trình — viết dạng đúng của động từ trong ngoặc (5 câu) — ôn Bài 2 mục B2" },
      {
        t: "quiz",
        id: "t5d24-bt-quy-trinh",
        kind: "fill",
        title: "Bị động + rút gọn",
        items: [
          { q: "1. ___ (wash) in cold water, the leaves are spread out to dry. (Having been…)", answers: ["Having been washed"], hint: "Rút gọn bị động: Having been + V3." },
          { q: "2. The fruit is sorted by size, after which it ___ (pack) into crates.", answers: ["is packed"], hint: "after which + mệnh đề bị động." },
          { q: "3. Once the mixture ___ (cool), it is poured into moulds.", answers: ["has cooled", "has been cooled", "is cooled"], hint: "Once + hiện tại hoàn thành / hiện tại đơn." },
          { q: "4. The bottles are rinsed before ___ (fill) with juice.", answers: ["being filled"], hint: "before + being + V3." },
          { q: "5. The grain is heated, ___ (reduce) its moisture to about 12%. (V-ing chỉ kết quả)", answers: ["reducing"], hint: "V-ing chỉ hệ quả: …, reducing…" },
        ],
      },

      { t: "h", text: "VI. Thesis Discussion — chọn câu band 8 (3 câu) — ôn Bài 2 mục B3" },
      {
        t: "mcq",
        id: "t5d24-bt-thesis",
        title: "Discuss both views and give your opinion",
        items: [
          { q: "1. Đề: “Some think zoos should close; others think they protect endangered species.” Thesis band 8:", options: ["A  This essay will look at both sides.", "B  While zoos have helped to save a handful of species, I believe most should close, provided that their conservation work is moved to protected habitats.", "C  Zoos are good and bad."], correct: 1, why: "Có quan điểm kia, lập trường, điều kiện." },
          { q: "2. Thân bài nói quan điểm bạn KHÔNG theo, câu mở hợp nhất:", options: ["A  Supporters of zoos argue, with some justification, that captive breeding has rescued species such as…", "B  Some stupid people think zoos are good.", "C  Firstly, zoos are good."], correct: 0, why: "Công bằng, có lý do thật — “with some justification”." },
          { q: "3. Kết bài band 8:", options: ["A  In conclusion, both views have merits and it is up to individuals.", "B  In conclusion, although zoos once played a valuable role, I remain convinced that most of their work could now be done better in the wild.", "C  In conclusion, zoos should be banned immediately everywhere."], correct: 1, why: "Nhắc lại lập trường có mức + thừa nhận phía kia. A bỏ lập trường; C cực đoan, khác thesis." },
        ],
      },

      { t: "h", text: "VII. Nghe — một cuộc gọi từ ga tàu (4 câu) — ôn Bài 3 mục 2" },
      {
        t: "listen",
        id: "t5d24-bt-nghe",
        title: "Booking a room by phone",
        dan: { so: "Day 24, Homework", boiCanh: "a man calling a community centre from a railway station.", cau: [1, 4] },
        lines: [
          { who: "Gemma", voice: "uk-nu", text: "Ashcombe Community Centre, Gemma speaking." },
          { who: "Marcus", voice: "ca-nam", text: "Hi, I'd like to book a room for a reading group — sorry, there's an announcement, give me a second… OK. It's for Saturday the seventeenth." },
          { who: "Gemma", voice: "uk-nu", text: "The seventeenth's a Sunday, I'm afraid." },
          { who: "Marcus", voice: "ca-nam", text: "Oh — then it's the sixteenth. Saturday the sixteenth, in the afternoon." },
          { who: "Gemma", voice: "uk-nu", text: "And how many people?" },
          { who: "Marcus", voice: "ca-nam", text: "Thirty, roughly. Actually, make that thirty-five — the other group's joining us." },
          { who: "Gemma", voice: "uk-nu", text: "Then the Garden Room won't do, it only seats thirty. I'll put you in the Orchard Room — that takes forty." },
          { who: "Marcus", voice: "ca-nam", text: "Great. And the key — do I bring it back to the caretaker?" },
          { who: "Gemma", voice: "uk-nu", text: "We used to do that, but the caretaker's only in on weekdays now. Leave it with the café downstairs; they're open until six." },
        ],
      },
      {
        t: "quiz",
        id: "t5d24-bt-nghe-cau",
        kind: "fill",
        title: "Questions 1–4 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Date: Saturday the ___ (số)", answers: ["16", "16th", "sixteenth"], hint: "17 là Chủ nhật ⇒ “then it's the sixteenth” (tín hiệu ②)." },
          { q: "2. Number of people: ___", answers: ["35", "thirty-five"], hint: "“make that thirty-five” (tín hiệu ③)." },
          { q: "3. Room: the ___ Room", answers: ["Orchard"], hint: "Garden Room chỉ 30 chỗ ⇒ Orchard (40)." },
          { q: "4. Return the key to the ___", answers: ["café", "cafe"], hint: "“We used to do that [caretaker]… Leave it with the café” — bẫy thời gian." },
        ],
      },

      { t: "h", text: "VIII. Viết — mở bài + overview cho một quy trình hai giai đoạn mới (60–90 từ) — AI chấm" },
      {
        t: "essay",
        id: "t5d24-bt-viet",
        task: "Task 1",
        minWords: 60,
        prompt: "Write ONLY the introduction and the overview (60–90 words) for this task: “The diagrams below show how used cooking oil from restaurants is turned into fuel for buses.” Stage 1 — collection: (1) used oil poured into sealed drums at restaurants; (2) drums collected weekly by tanker; (3) oil filtered to remove food particles; (4) water removed by heating. Stage 2 — at the refinery: (5) cleaned oil mixed with alcohol and a catalyst; (6) mixture separated into fuel and glycerine; (7) fuel washed and tested; (8) fuel stored in tanks; (9) delivered to city bus depots. (Quy trình tự dựng cho bài luyện.)",
        tips: [
          "Mở bài: paraphrase đề — đổi dạng trong họ từ (Bài 1 mục 5).",
          "Overview: số bước · hai giai đoạn · đầu → cuối · mắt xích (dầu đã lọc và tách nước).",
          "Không số liệu chi tiết trong overview.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG 4 (NGÀY 19–24) ═══════════════════════════ */
  {
    id: "t5d24-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 19–24)",
    goal: "Đo lại cả chặng 4 của Tập 5 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, đặt cạnh kết quả Đề 11, và biết chính xác phải ôn lại Ngày nào trước khi sang chặng cuối (Ngày 25–30, có Đề 12 “Final”).",
    minutes: 180,
    blocks: [
      {
        t: "recap", title: "Cách làm bài kiểm tra này",
        items: [
          "**8 phần**, khoảng 3 giờ. KHÔNG làm cùng ngày với Đề 11 nếu đã mệt — làm sáng hôm sau, trước Ngày 25. Có thể chia hai buổi: Phần 1–5 (95 phút) và Phần 6–8 (85 phút).",
          "Không tra từ, không mở lại bài. Nghe **một lần**. Đọc **đúng giờ** (16 phút).",
          "Ngưỡng đạt: ==≥ 70 % từng phần== — không lấy phần này bù phần kia. Viết / Nói: AI ước tính ≥ band 7.5.",
          "Mọi câu ở đây là câu MỚI; không câu nào lặp lại bài tập của Ngày 19–24. Các nhà nghiên cứu trong bài đọc là hư cấu.",
          "Đặt kết quả cạnh **Đề 11**: phần trượt ở đây + kỹ năng thấp nhất ở Đề 11 = hai việc đầu tiên của Ngày 25.",
        ],
      },

      /* ── Phần 1 ── */
      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 19, 21, 23)" },
      {
        t: "mcq", id: "t5d24-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "1. If the council had approved the tram line in 2015, it ___ in service now.", options: ["would be", "would have been", "will be"], correct: 0, why: "Quá khứ khác đi → HIỆN TẠI khác đi (now): would + V. — Ngày 19 mục 2." },
          { q: "2. ___ for the volunteers, the museum would have closed years ago.", options: ["Had it not been", "Unless it had been", "Without it had been"], correct: 0, why: "Đảo ngữ của điều kiện quá khứ: Had it not been for… — Ngày 19 mục 3." },
          { q: "3. The inspectors insisted that the report ___ published in full.", options: ["be", "is", "was being"], correct: 0, why: "Thức giả định sau insist that: be cho mọi chủ ngữ. — Ngày 19 mục 4." },
          { q: "4. Câu nào đúng dấu câu?", options: ["The fare is low, however few people use the service.", "The fare is low; however, few people use the service.", "The fare is low however, few people use the service."], correct: 1, why: "; however, — Ngày 19 mục 5." },
          { q: "5. (Part 3) “Do people read less these days?” — “What's changed isn't how much people read; ___ how they read.”", options: ["it's", "that's what", "is it"], correct: 0, why: "Câu chẻ sửa tiền đề khi nói: What + V + isn't X, it's Y. — Ngày 21 mục 2." },
          { q: "6. (Part 3) “Only when people can see a clear benefit ___ their habits.”", options: ["do they change", "they change", "they do change"], correct: 0, why: "Only when + mệnh đề ⇒ đảo ở VẾ CHÍNH: do they change. — Ngày 21 mục 3." },
          { q: "7. (Part 3) “___ that happen, I think the government would have to step in.”", options: ["Should", "If", "Were"], correct: 0, why: "Đảo ngữ điều kiện nói được: Should + S + V…, S + would… — Ngày 21 mục 3. (If cần “If that happens”; Were cần “Were that to happen”.)" },
          { q: "8. “Will the plan work?” — “I'd like to think ___.”", options: ["so", "it", "that it"], correct: 0, why: "Thay thế (substitution) — keo G44: I'd like to think so / I hope so / I'm afraid not. — Ngày 21 mục 5." },
          { q: "9. Each of the options ___ serious drawbacks.", options: ["has", "have", "are having"], correct: 0, why: "each of + N số nhiều ⇒ V số ít. — Ngày 23 mục 2." },
          { q: "10. Living costs in Oslo are higher than ___ in Lisbon.", options: ["those", "that", "it"], correct: 0, why: "costs (số nhiều) ⇒ those. — Ngày 23 mục 4." },
          { q: "11. A survey carried out in 2016 ___ that most residents supported the ban.", options: ["found", "has found", "finds"], correct: 0, why: "Nghiên cứu cụ thể có năm ⇒ quá khứ. — Ngày 23 mục 2." },
          { q: "12. Many towns now charge for plastic bags. ___ has cut waste considerably.", options: ["This", "This charge", "It's"], correct: 1, why: "this + danh từ tóm (không This trơ). — Ngày 23 mục 5." },
        ],
      },
      {
        t: "quiz", id: "t5d24-kt-ngu-phap-dien", kind: "fill", title: "1b. Viết dạng đúng / điền MỘT từ (6 câu)",
        items: [
          { q: "1. If I ___ (know) about the strike, I would have taken the train.", answers: ["had known"], hint: "Ngày 19" },
          { q: "2. It is essential that every applicant ___ (submit) the form by Friday.", answers: ["submit", "should submit"], hint: "Ngày 19" },
          { q: "3. Only later ___ I realise how much I had learned. (MỘT từ)", answers: ["did"], hint: "Ngày 21" },
          { q: "4. “Isn't the city too expensive?” — “It is, but ___ is the noise that I can't stand.” (MỘT từ)", answers: ["it"], hint: "Ngày 21 — câu chẻ it is… that" },
          { q: "5. The number of applicants ___ (rise) every year since 2018.", answers: ["has risen"], hint: "Ngày 23" },
          { q: "6. Every student should be free to choose ___ own topic. (MỘT từ)", answers: ["their"], hint: "Ngày 23" },
        ],
      },

      /* ── Phần 2 ── */
      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 20, 22, 24)" },
      {
        t: "mcq", id: "t5d24-kt-tu-vung-chon", title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "1. A trial with only twelve participants has a very small ___.", options: ["sample size", "margin of error", "payload"], correct: 0, why: "sample size = cỡ mẫu. — Ngày 20" },
          { q: "2. Results that other laboratories cannot repeat are not ___.", options: ["reproducible", "anecdotal", "sentient"], correct: 0, why: "reproducible = lặp lại được. — Ngày 20" },
          { q: "3. Wolves sit at the top of the food chain: they are ___.", options: ["apex predators", "livestock", "bycatch"], correct: 0, why: "apex predator. — Ngày 20" },
          { q: "4. Parents who protect children from every possible risk are said to ___.", options: ["wrap them in cotton wool", "cull them", "domesticate them"], correct: 0, why: "wrap sb in cotton wool = bao bọc quá mức. — Ngày 20" },
          { q: "5. A system whose internal decisions nobody can explain is often called a ___.", options: ["black box", "probe", "spin-off"], correct: 0, why: "black box. — Ngày 22" },
          { q: "6. An employee who reports wrongdoing inside her own company is a ___.", options: ["whistle-blower", "bystander", "correspondent"], correct: 0, why: "whistle-blower. — Ngày 22 (bystander = người đứng xem, Ngày 21)." },
          { q: "7. Changes to an embryo's DNA that would pass to future generations are called ___ changes.", options: ["germline", "autonomous", "paternalistic"], correct: 0, why: "germline editing = chỉnh sửa dòng mầm, truyền cho đời sau. — Ngày 22" },
          { q: "8. Funding should be distributed ___, with more going where need is greatest.", options: ["equitably", "uniformly", "virtually"], correct: 0, why: "equitable ≠ equal. — Ngày 24" },
          { q: "9. Excessive paperwork can ___ innovation in small firms.", options: ["inhibit", "elicit", "persist"], correct: 0, why: "inhibit innovation. — Ngày 24" },
          { q: "10. The writer ___ that the plan will fail, though she never says so directly.", options: ["implies", "infers", "proceeds"], correct: 0, why: "Người viết ngụ ý ⇒ implies. — Ngày 24" },
        ],
      },
      {
        t: "quiz", id: "t5d24-kt-tu-vung-dien", kind: "fill", title: "2b. Điền MỘT từ (chữ đầu cho sẵn) (6 câu)",
        items: [
          { q: "1. Without a control group, a c___ factor may explain the result.", answers: ["confounding"], hint: "Ngày 20" },
          { q: "2. Many zoos now provide e___ — toys and puzzles — to keep animals active.", answers: ["enrichment"], hint: "Ngày 20" },
          { q: "3. Drones that choose their own targets are a___ weapons.", answers: ["autonomous"], hint: "Ngày 22" },
          { q: "4. Some economists support a universal b___ income.", answers: ["basic"], hint: "Ngày 22" },
          { q: "5. Habits formed in childhood often p___ into adulthood.", answers: ["persist"], hint: "Ngày 24" },
          { q: "6. The eligibility c___ for the scheme are very strict.", answers: ["criteria"], hint: "Ngày 24 — số nhiều" },
        ],
      },

      /* ── Phần 3 ── */
      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz", id: "t5d24-kt-dich", kind: "translate", title: "3. Dịch sang tiếng Anh",
        items: [
          { q: "Nếu thành phố đã xây đường sắt từ hai mươi năm trước, thì giờ đây đường sá đã không tắc như vậy. (điều kiện hỗn hợp)", answers: ["If the city had built a railway twenty years ago, the roads would not be so congested now.", "If the city had built the railway twenty years ago, the roads would not be so congested now.", "If the city had built a railway twenty years ago, the roads wouldn't be so congested now.", "If the city had built a railway twenty years ago, traffic would not be so bad now.", "Had the city built a railway twenty years ago, the roads would not be so congested now."], hint: "If S had V3, S would (not) V now — Ngày 19" },
          { q: "Chỉ khi người dân thấy được lợi ích thì họ mới thay đổi thói quen. (Only when)", answers: ["Only when people see the benefits do they change their habits.", "Only when people can see the benefits do they change their habits.", "Only when people see the benefit do they change their habits.", "Only when people see a benefit do they change their habits.", "Only when people can see a benefit do they change their habits.", "Only when people see the benefits will they change their habits."], hint: "Only when + S + V + do + S + V — Ngày 21 mục 3" },
          { q: "Kết quả này chưa được các nhóm độc lập lặp lại.", answers: ["These results have not been replicated by independent teams.", "This result has not been replicated by independent teams.", "These findings have not been replicated by independent groups.", "These results have not yet been replicated by independent teams.", "The results have not been reproduced by independent teams."], hint: "replicate (bị động) — Ngày 20" },
          { q: "Không phải chi phí mà là sự thiếu minh bạch khiến người dân lo ngại.", answers: ["It is not the cost but the lack of transparency that worries people.", "It isn't the cost but the lack of transparency that worries people.", "It is not the cost but the lack of transparency that concerns people.", "It is not the cost but the lack of transparency that worries the public.", "What worries people is not the cost but the lack of transparency.", "What worries people isn't the cost, it's the lack of transparency.", "What worries people is not the cost, it is the lack of transparency."], hint: "It is not X but Y that… / What worries people isn't X, it's Y — Ngày 21 mục 2 · transparency — Ngày 22" },
          { q: "Lương của y tá thấp hơn lương của giáo viên.", answers: ["Nurses' salaries are lower than those of teachers.", "The salaries of nurses are lower than those of teachers.", "Nurses' salaries are lower than teachers' salaries.", "Nurses' pay is lower than that of teachers.", "Nurses' salaries are lower than teachers'."], hint: "than those of — Ngày 23" },
          { q: "Chính phủ thiếu một chiến lược nhất quán về nhà ở.", answers: ["The government lacks a coherent strategy for housing.", "The government lacks a coherent housing strategy.", "The government lacks a coherent strategy on housing.", "The government has no coherent strategy for housing."], hint: "lack a coherent strategy (không of) — Ngày 24" },
        ],
      },

      /* ── Phần 4 ── */
      { t: "h", text: "Phần 4 — Nghe (5 + 5 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 19, 21, 24)" },
      { t: "p", text: "Hai đoạn, mỗi đoạn nghe **một lần**. Đọc câu hỏi 30 giây trước mỗi đoạn." },
      {
        t: "listen", id: "t5d24-kt-nghe-khao-sat", title: "Planning a survey on subtitles",
        dan: { so: "Day 24, Review 1", boiCanh: "a tutor and two students, Leah and Sam, discussing a survey they are planning.", cau: [1, 5] },
        lines: [
          { who: "Tutor", voice: "ie-nam", text: "So, your survey on how students use subtitles. Where have you got to?" },
          { who: "Leah", voice: "ca-nu", text: "We've drafted the questions. We were going to send it to all the first-years, but Sam thinks that's too narrow." },
          { who: "Sam", voice: "us-nam", text: "Not too narrow, exactly — too similar. First-years are nearly all the same age. If we want to know whether age makes a difference, we need the evening students as well." },
          { who: "Tutor", voice: "ie-nam", text: "Fair point. And how were you going to get it out to people?" },
          { who: "Leah", voice: "ca-nu", text: "Online, through the student app. Paper would get a better response rate, I know, but we've no budget for printing." },
          { who: "Tutor", voice: "ie-nam", text: "You have, actually. The department will print up to two hundred copies for any project. Just ask at the office." },
          { who: "Sam", voice: "us-nam", text: "Oh — then paper for the evening students and online for everyone else. The evening students hardly ever open the app anyway." },
          { who: "Tutor", voice: "ie-nam", text: "Good. Now, your first question asks whether people prefer subtitles. You'll get a yes from everybody who's ever switched them on once, which won't tell you much." },
          { who: "Leah", voice: "ca-nu", text: "We wondered about that. Should we ask how often instead?" },
          { who: "Tutor", voice: "ie-nam", text: "How often, and in what situations. Someone who uses them only for films in another language is a very different case from someone who has them on for everything." },
          { who: "Sam", voice: "us-nam", text: "Can I push back slightly? If we add situations, the survey gets longer, and long surveys don't get finished." },
          { who: "Tutor", voice: "ie-nam", text: "That's a fair worry, but it doesn't follow that you should cut that question. Cut something else. What's question nine for?" },
          { who: "Leah", voice: "ca-nu", text: "Favourite streaming service. Honestly, that was just curiosity." },
          { who: "Tutor", voice: "ie-nam", text: "Then that's the one to go." },
        ],
      },
      {
        t: "mcq", id: "t5d24-kt-nghe-khao-sat-cau", title: "Questions 1–5 — Choose the correct letter, A, B or C",
        items: [
          { q: "1. Why does Sam want to include evening students?", options: ["A  to make the sample larger", "B  to include people of different ages", "C  because they are easier to contact"], correct: 1, why: "“First-years are nearly all the same age… whether age makes a difference”. “Not too narrow, exactly — too similar” — Sam tự sửa từ (tín hiệu ②, Ngày 24)." },
          { q: "2. How will the survey reach evening students?", options: ["A  on paper", "B  through the student app", "C  by email"], correct: 0, why: "“then paper for the evening students and online for everyone else”." },
          { q: "3. What had stopped the students from using paper?", options: ["A  a poor response rate", "B  the time needed to collect forms", "C  the cost of printing"], correct: 2, why: "“we've no budget for printing” — rồi bị sửa: khoa in miễn phí. A là ưu điểm của giấy (bẫy chữ trùng)." },
          { q: "4. What does the tutor say about the first question?", options: ["A  It is too long.", "B  It will produce answers that are not useful.", "C  It should be the last question."], correct: 1, why: "“You'll get a yes from everybody… which won't tell you much.”" },
          { q: "5. Which question will be removed?", options: ["A  the one about streaming services", "B  the one about situations", "C  the one about age"], correct: 0, why: "Sam muốn bỏ câu “situations”; tutor: “it doesn't follow that you should cut that question. Cut something else” ⇒ câu 9 (streaming). Mẫu phản biện của Ngày 23 xuất hiện trong bài nghe." },
        ],
      },
      { t: "p", text: "**Questions 6–10.** Complete the notes. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "listen", id: "t5d24-kt-nghe-tin", title: "A regional news report",
        dan: { so: "Day 24, Review 2", boiCanh: "a news presenter and a reporter talking about a local festival.", cau: [6, 10] },
        lines: [
          { who: "Presenter", voice: "au-nu", text: "Organisers of the Port Halden Kite Festival have moved this year's event inland for the first time in its thirty-year history. Our reporter Mikaere Tane is there now. Mikaere?" },
          { who: "Reporter", voice: "nz-nam", text: "Thanks, Joanne. The festival normally takes place on the beach, but with gusts forecast of up to eighty kilometres an hour — the organisers were working on sixty yesterday, but the forecast was revised this morning — it's been moved to the showground, about twelve kilometres inland." },
          { who: "Reporter", voice: "nz-nam", text: "Around fifteen thousand people came last year. Organisers are expecting fewer this time, perhaps ten thousand, because of the change of venue. And the event everyone comes for, a giant kite in the shape of a whale, won't fly at all — not because of the wind, they tell me, but simply because there isn't room for it here. Free shuttle buses are running from the town centre every twenty minutes. Back to you, Joanne." },
        ],
      },
      {
        t: "quiz", id: "t5d24-kt-nghe-tin-cau", kind: "fill", title: "Questions 6–10 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "6. The festival has been held for ___ years.", answers: ["30", "thirty"], hint: "“in its thirty-year history”." },
          { q: "7. Gusts are forecast of up to ___ km per hour.", answers: ["80", "eighty"], hint: "60 = dự báo cũ; “revised this morning” ⇒ 80. Bẫy số đổi." },
          { q: "8. New venue: the ___", answers: ["showground"], hint: "“moved to the showground”." },
          { q: "9. Expected visitors this year: about ___", answers: ["10000", "10,000", "ten thousand"], hint: "15.000 = năm ngoái." },
          { q: "10. The giant kite will not fly because the new site is too ___.", answers: ["small"], hint: "“not because of the wind… but because there isn't room for it here” ⇒ chỗ mới quá nhỏ. Câu suy luận — phủ định ẩn + paraphrase (Ngày 23)." },
        ],
      },

      /* ── Phần 5 ── */
      { t: "h", text: "Phần 5 — Đọc (4 + 5 + 3 câu · đạt ≥ 9/12 · 16 phút · trượt thì ôn Ngày 19, 21, 23)" },
      {
        t: "passage", title: "Reading the Calendar of Spring", intro: "Bài tự soạn cho bài kiểm tra. Ba nhà nghiên cứu được nêu tên là hư cấu; hiện tượng “mùa xuân đến sớm” và cách dùng nhật ký tự nhiên của người nghiệp dư là có thật.",
        paras: [
          { label: "A", text: "For centuries, amateur naturalists noted the day on which the first swallow appeared or the first hawthorn came into flower. Long dismissed as charming but unscientific, these diaries are now among the most valuable records we have of how the living world responds to a warming climate, because they stretch back far further than any professional monitoring scheme." },
          { label: "B", text: "Varga, who compared two centuries of diary entries from a single English county with temperature records, found that most plants flowered several days earlier for every degree of spring warming. She argued that the diaries were trustworthy precisely because their authors had no theory to prove: a clergyman noting the first primrose in 1790 could not have known what his entry would one day be used to show." },
          { label: "C", text: "Lind was less convinced. Diarists, he pointed out, were not instruments. They moved house, aged, lost interest, and were replaced. In one family's records, the apparent advance of spring coincided almost exactly with the diary passing to a granddaughter who walked further each morning than her grandfather had, and so found the first flowers sooner. Lind did not deny that spring was arriving earlier; his complaint was that its speed had been exaggerated." },
          { label: "D", text: "Okoye approached the question from a different angle. What matters, she argued, is not whether spring is early but whether everything in it moves together. Insects that respond to temperature have shifted faster than birds that time their breeding by day length, so that in some woods caterpillars now peak before the chicks that depend on them have hatched. In her view, mismatch, not earliness, is the real problem." },
          { label: "E", text: "Lind's caution is useful, but it is Okoye's point that seems to me the most important. Earliness is a symptom; mismatch is where the damage is done. Here the diaries reach their limit, because they record what people notice — blossom, birdsong, the first butterfly — rather than what an ecosystem depends on. Had the diarists counted caterpillars as faithfully as they recorded primroses, we would know far more about mismatch than we do. Amateur records are best used alongside systematic monitoring, not as a substitute for it." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Match each statement with the correct researcher: **A** Varga · **B** Lind · **C** Okoye. Một chữ cái có thể dùng nhiều lần." },
      {
        t: "quiz", id: "t5d24-kt-doc-nguoi", kind: "fill", title: "Questions 1–4 — gõ chữ cái A–C",
        items: [
          { q: "1. suggested that a change of observer could make spring seem to come earlier", answers: ["B"], hint: "Đoạn C: “the diary passing to a granddaughter who walked further”." },
          { q: "2. claimed that the observers' lack of a hypothesis made their records more reliable", answers: ["A"], hint: "Đoạn B: “trustworthy precisely because their authors had no theory to prove”." },
          { q: "3. pointed out that different species respond to different signals", answers: ["C"], hint: "Đoạn D: temperature vs day length." },
          { q: "4. accepted the overall trend but questioned how fast it was", answers: ["B"], hint: "Đoạn C: “did not deny… his complaint was that its speed had been exaggerated”." },
        ],
      },
      { t: "p", text: "**Questions 5–9** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d24-kt-doc-ynng", title: "Questions 5–9 — YES / NO / NOT GIVEN",
        items: [
          { q: "5. Amateur nature diaries were once considered unscientific.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “Long dismissed as charming but unscientific”." },
          { q: "6. Lind's work shows that spring has not in fact become earlier.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: “Lind did not deny that spring was arriving earlier” ⇒ NO. Bẫy ⑥ phủ định ẩn." },
          { q: "7. Okoye's research was carried out in the same county as Varga's.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không nói Okoye nghiên cứu ở đâu ⇒ NOT GIVEN. Bẫy ③." },
          { q: "8. Mismatch between species is a more serious matter than the early arrival of spring.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn E: “Earliness is a symptom; mismatch is where the damage is done.” (ý của Okoye được tác giả TÁN THÀNH — “seems to me the most important”)." },
          { q: "9. The diarists recorded caterpillar numbers as carefully as flowering dates.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Bẫy ⑦: “Had the diarists counted caterpillars as faithfully… we would know far more” ⇒ họ đã KHÔNG đếm. — Ngày 19 · 23." },
        ],
      },
      {
        t: "mcq", id: "t5d24-kt-doc-mcq", title: "Questions 10–12 — Choose the correct letter",
        items: [
          { q: "10. Why does the writer mention the granddaughter?", options: ["A  to show that women made better naturalists", "B  to illustrate how a change of observer can distort a record", "C  to explain why the family stopped keeping the diary"], correct: 1, why: "Dạng mục đích: đây là ví dụ cho “Diarists… were not instruments”." },
          { q: "11. What does the writer imply about nature diaries in paragraph E?", options: ["A  They favour events that people notice easily.", "B  They are more accurate than professional records.", "C  They contain too much information about insects."], correct: 0, why: "“they record what people notice… rather than what an ecosystem depends on”." },
          { q: "12. What does the writer recommend?", options: ["A  replacing amateur records with professional ones", "B  combining amateur records with systematic monitoring", "C  asking amateurs to count insects instead of flowers"], correct: 1, why: "“best used alongside systematic monitoring, not as a substitute”. C suy quá đà từ câu giả định (bẫy ①)." },
        ],
      },

      /* ── Phần 6 ── */
      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 19, 20, 22, 24)" },
      {
        t: "mcq", id: "t5d24-kt-viet-chon", title: "6a. Kiến thức viết band 8 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. Nguyên nhân: “Parents drive children to school because they fear traffic.” Giải pháp khớp đúng TẦNG nguyên nhân:", options: ["A  a campaign telling children that walking is healthy", "B  safer walking routes and lower speed limits near schools", "C  more school buses for rural areas"], correct: 1, why: "Nguyên nhân là nỗi sợ giao thông ⇒ giải pháp làm đường an toàn hơn. A nhắm sai tầng (trẻ đã biết đi bộ là tốt). — Ngày 20" },
          { q: "2. Câu nào xếp ưu tiên giải pháp đúng kiểu band 8?", options: ["A  Firstly, … Secondly, … Thirdly, …", "B  The most immediate step would be…, while in the longer term…", "C  There are many solutions to this problem."], correct: 1, why: "Xếp theo thời gian / tác động — Ngày 20." },
          { q: "3. “Since cameras were installed in the town centre, crime has fallen by 20%.” Câu phản biện học thuật hợp nhất:", options: ["A  This is wrong because cameras do not work.", "B  The fall may reflect other changes; without figures from comparable towns without cameras, it cannot be attributed to them.", "C  20% is not very much."], correct: 1, why: "Tương quan ≠ nhân quả + thiếu nhóm so sánh — Ngày 22." },
          { q: "4. Động từ tường thuật nào cho thấy người viết NGHI NGỜ nhận định?", options: ["A  The report demonstrates that…", "B  The report claims that…", "C  The report shows that…"], correct: 1, why: "claims = giữ khoảng cách; demonstrate / show = chấp nhận. — Ngày 22" },
          { q: "5. It is vital that every school ___ a safe route plan.", options: ["A  to have", "B  have", "C  had"], correct: 1, why: "Thức giả định: have cho mọi chủ ngữ (has cũng gặp trong Anh–Anh thân mật — Ngày 21; bài viết band 8 dùng have hoặc should have). to have sai khuôn It is vital that + mệnh đề; had là lùi thì. — Ngày 19" },
          { q: "6. Overview quy trình hai giai đoạn band 8 cần:", options: ["A  mọi số liệu trong hình", "B  số bước, hai giai đoạn, điểm đầu – điểm cuối, mắt xích", "C  ý kiến về quy trình"], correct: 1, why: "Ngày 24 Bài 2 mục B2." },
        ],
      },
      { t: "p", text: "**6b. Task 1 (20 phút, ≥ 150 từ).** Biểu đồ dưới đây (số liệu tự đặt cho bài kiểm tra, quốc gia hư cấu) cho thấy tỉ lệ người trưởng thành dùng năm nguồn tin làm nguồn CHÍNH, năm 2005 và 2025." },
      {
        t: "chart", kind: "bar", title: "Main source of news for adults, 2005 and 2025 (%)", unit: "%",
        labels: ["Television", "Print newspapers", "News websites & apps", "Social media", "Radio"],
        series: [
          { name: "2005", values: [52, 24, 9, 1, 14] },
          { name: "2025", values: [31, 4, 27, 30, 8] },
        ],
      },
      {
        t: "essay", id: "t5d24-kt-viet-task1", task: "Task 1", minWords: 150,
        prompt: "The chart shows the percentage of adults in one country who used five different sources as their main source of news in 2005 and 2025 (figures invented for this test). 2005 — Television 52%, Print newspapers 24%, News websites & apps 9%, Social media 1%, Radio 14%. 2025 — Television 31%, Print newspapers 4%, News websites & apps 27%, Social media 30%, Radio 8%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: chuyển từ nguồn truyền thống sang nguồn số; TV vẫn dẫn đầu nhưng gần như ngang social media.",
          "Nhóm: ba nguồn giảm (TV, báo in, radio) · hai nguồn tăng (web / app, social media).",
          "Một câu so sánh có than that of / those of; một câu bội số — social media 1% → 30% là tăng gấp ba mươi lần (thirtyfold).",
          "Soát “3 + 2” của Ngày 23 trước khi nộp.",
        ],
      },
      {
        t: "essay", id: "t5d24-kt-viet-task2", task: "Task 2", minWords: 250,
        prompt: "In many countries, fewer young people are choosing to train as teachers. Why is this happening? What measures could be taken to solve this problem? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        tips: [
          "Ma trận nguyên nhân ↔ giải pháp của Ngày 20: mỗi giải pháp khớp đúng tầng một nguyên nhân; xếp ưu tiên; nêu cái giá / hệ quả ngoài ý muốn.",
          "Một câu giả định ngầm (Without…, …would…) và tối đa một câu thức giả định (It is essential that… be…) — Ngày 19.",
          "Một đoạn phản bác ngắn một giải pháp phổ biến nhưng yếu (Ngày 22).",
          "Ít nhất bốn cụm AWL của Ngày 24 (retain skilled staff, prioritise… over…, considerable scope for…).",
        ],
      },

      /* ── Phần 7 ── */
      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 4 câu Part 3 · AI ≥ band 7.5 ước tính · trượt thì ôn Ngày 19, 21, 22, 23)" },
      {
        t: "speak", id: "t5d24-kt-noi-p1", part: "1",
        questions: [
          "Are you good at finding your way in a new place?",
          "Do you prefer paper maps or maps on your phone?",
          "Have you ever got completely lost?",
          "Do you think people will still learn to read maps in the future?",
        ],
      },
      {
        t: "speak", id: "t5d24-kt-noi-p2", part: "2",
        questions: [
          "Describe a time when someone asked you a question you could not answer. You should say: who asked you; what the question was; why you could not answer it; and explain what you did afterwards.",
          "Would you answer it differently now?",
        ],
      },
      {
        t: "speak", id: "t5d24-kt-noi-p3", part: "3",
        questions: [
          "Why do people find it so hard to admit that they don't know something?",
          "Should schools reward students more for asking good questions or for giving correct answers?",
          "Are experts trusted less than they used to be?",
          "So you're saying we shouldn't trust experts at all?",
        ],
      },
      {
        t: "note", title: "Tự chấm phần Nói — nghe lại bản ghi và trả lời có / không",
        items: [
          "**Part 1:** giọng trò chuyện, câu trả lời 2–3 câu, có một chi tiết thật? Có một cụm thay thế gọn (I'd like to think so / I doubt it) — keo G44 của Ngày 21?",
          "**Part 2:** đủ bốn ý? Có một câu giả định về quá khứ (If I had known…, I would have…) — Ngày 19?",
          "**Part 3:** câu 1 (tiền đề ngầm) và câu 2 (hai lựa chọn) — tôi có MỘT câu gỡ rồi trả lời đủ (Ngày 23)? Câu 4 — tôi sửa cách diễn giải của giám khảo, không nói Yes (Ngày 18 · 23)?",
          "**Cấu trúc hiếm:** mỗi câu Part 3 có 1–2 ★ đúng việc (What… isn't X, it's Y / Only when… do… / Should that happen…) — không hơn, và không ★ ở câu mở đầu chỉ để khoe (Ngày 21)?",
          "**Paraphrase mở câu:** không câu nào lặp nguyên văn câu hỏi của giám khảo (Ngày 22)?",
        ],
      },

      /* ── Phần 8 ── */
      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 19–24)" },
      {
        t: "mcq", id: "t5d24-kt-phat-am", title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. “She would have come” nói tự nhiên:", options: ["/ʃiː wʊdəv kʌm/", "/ʃiː wʊd hæv kʌm/", "/ʃiː wʊdɒv kʌm/"], correct: 0, why: "have → /əv/ — Ngày 19 mục 6." },
          { q: "2. Trọng âm của “scientific”:", options: ["SCI-en-tif-ic", "sci-EN-tif-ic", "sci-en-TIF-ic"], correct: 2, why: "Đuôi -ic ⇒ nhấn âm tiết ngay trước. Trọng âm dời trong họ từ: SCIence → scienTIFic — Ngày 20." },
          { q: "3. Đọc tin: “The minister has said that…” — has đọc:", options: ["/hæz/ mạnh", "/əz/ hoặc /həz/ yếu", "bỏ hẳn"], correct: 1, why: "Trợ động từ trong câu kể đọc yếu — Ngày 21 mục 3." },
          { q: "4. Trọng âm của “authenticity” (từ authentic của Ngày 22):", options: ["au-THEN-ti-ci-ty", "au-then-TI-ci-ty", "AU-then-ti-ci-ty"], correct: 1, why: "Đuôi -ity ⇒ nhấn âm tiết ngay trước: -TI-. Trọng âm dời: auTHENtic → authenTIcity. — Ngày 20 · 22 mục 6." },
          { q: "5. “the idea of” giọng Anh nói liền:", options: ["/ði aɪdɪər əv/", "/ðə aɪdɪə ɒv/", "/ði aɪdɪə ʔ ɒv/"], correct: 0, why: "r chen + the /ði/ trước nguyên âm + of yếu. — Ngày 23 mục 6." },
          { q: "6. “I agree” nối:", options: ["/aɪ jəɡriː/", "/aɪ wəɡriː/", "/aɪ rəɡriː/"], correct: 0, why: "j chen sau /aɪ/. — Ngày 23 mục 6." },
          { q: "7. Đuôi -ate trong “adequate” (tính từ) đọc:", options: ["/eɪt/", "/ət/", "/ɑːt/"], correct: 1, why: "Tính từ -ate ⇒ /ət/; động từ (facilitate) ⇒ /eɪt/. — Ngày 24 mục 7." },
          { q: "8. “considerable scope for improvement” — for đọc:", options: ["/fɔː/", "/fər/ nối sang improvement", "/fʊə/"], correct: 1, why: "for yếu /fə/, nối r sang nguyên âm sau. — Ngày 24 mục 7." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Trượt thì ôn", "Điểm của bạn"],
        rows: [
          ["1. Ngữ pháp", "≥ 13/18", "Ngày 19 (câu 1–4, 1b.1–2) · Ngày 21 (câu 5–8, 1b.3–4) · Ngày 23 (câu 9–12, 1b.5–6)", "…… /18"],
          ["2. Từ vựng", "≥ 12/16", "Ngày 20 (câu 1–4, 2b.1–2) · Ngày 22 (câu 5–7, 2b.3–4) · Ngày 24 (câu 8–10, 2b.5–6)", "…… /16"],
          ["3. Dịch", "≥ 5/6", "Câu 1 → Ngày 19 · 2 → Ngày 21 · 3 → Ngày 20 · 4 → Ngày 21 · 22 · 5 → Ngày 23 · 6 → Ngày 24", "…… /6"],
          ["4. Nghe", "≥ 7/10", "Câu 1–5 (ba người, tự sửa, phản biện) → Ngày 19 · 24 · Câu 6–10 (bản tin, số đổi, suy luận) → Ngày 21 · 24", "…… /10"],
          ["5. Đọc", "≥ 9/12", "Câu 1–4 (matching features) → Ngày 21 (đọc một lượt) · Câu 5–9 (YNNG, bẫy ③ ⑥ ⑦) → Ngày 23 · Câu 10–12 → Ngày 23", "…… /12"],
          ["6. Viết", "6a ≥ 5/6 · AI ≥ 7.5", "Task 2 problem / solution → Ngày 20 · phản bác → Ngày 22 · câu 5 → Ngày 19 · câu 6 + Task 1 → Ngày 24 (và Tập 5 Ngày 6 cho bar chart hai mốc)", "…… /6 · T1 …… · T2 ……"],
          ["7. Nói", "AI ≥ 7.5", "Part 1 → Ngày 21 · Part 2 → Ngày 19 · Part 3 → Ngày 21 · 22 · 23", "P1 …… · P2 …… · P3 ……"],
          ["8. Phát âm", "≥ 6/8", "Câu 1 → Ngày 19 · 2 → Ngày 20 · 3 → Ngày 21 · 4 → Ngày 22 · 5–6 → Ngày 23 · 7–8 → Ngày 24", "…… /8"],
        ],
      },
      {
        t: "note", title: "📌 Sang chặng cuối (Ngày 25–30)",
        items: [
          "**Đạt cả 8 phần:** sang Ngày 25 (ôn lỗi từ Đề 11 · mổ Reading và Listening Đề 11). Mang theo bảng sau đề của Ngày 24 Bài 2 mục B6 và Bài 3 mục 7.",
          "**Trượt 1–2 phần:** ôn đúng Ngày ghi trong bảng (chỉ mục liên quan), làm lại riêng phần đó sau 48 giờ. Vẫn học tiếp Ngày 25 song song — Ngày 25 chính là ngày sửa lỗi.",
          "**Trượt từ 3 phần:** dừng 2 ngày để ôn. Chặng cuối kết thúc bằng **Đề 12 “Final”** (Ngày 30, band 8.0); vào đề khi nền chặng 4 còn hổng thì kết quả không phản ánh đúng sức.",
          "So kết quả bài này với Đề 11: kỹ năng nào thấp ở CẢ HAI ⇒ đó là trọng tâm của sprint Ngày 26–28. Ghi mọi câu sai vào **Sổ lỗi** ba cột (sai gì → vì sao → câu đúng); lỗi lặp lại từ chặng 3 được đưa lên đầu “lượt của tôi” (Ngày 23 mục 7).",
        ],
      },
    ],
  },
];
