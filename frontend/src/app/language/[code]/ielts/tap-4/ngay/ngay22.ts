/**
 * IELTS Tập 4 — Ngày 22 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Children, parenting & gender roles — 42 từ + 12 collocation + 7 cặp dễ nhầm + 8 idiom (chỉ khi NÓI)   [VC30]
 *                     — nối Tập 2 Ngày 22 + Tập 3 Ngày 18 + Tập 4 Ngày 8 (Family, Personality), Tập 4 Ngày 16 (Social issues & equality)
 *   Bài 2 (writing)   Problem / solution band 7 — mỗi giải pháp phải được ĐÁNH GIÁ TÍNH KHẢ THI; mẫu band 6 vs band 7      [W06]
 *                     — nối Tập 2 Ngày 14 (xoay vòng cấu trúc), Tập 3 Ngày 18 (giải pháp gắn đúng nguyên nhân, chuỗi hệ quả),
 *                       Tập 4 Ngày 13 (rào đón), Ngày 21 (danh hoá, Phrasebank)
 *   Bài 3 (speaking)  Thuyết trình 3 phút + hỏi – đáp (Q&A): nói từ thẻ gợi ý, 6 kiểu câu hỏi khó, idiom đúng chỗ          [S16 E06 VD7]
 *                     — nối Tập 4 Ngày 20 (VIẾT kịch bản 3 phút), Tập 3 Ngày 18 (phỏng vấn), Tập 4 Ngày 18 (idiom & register)
 *                     🔊 chunking bài nói dài                                                                          [S15]
 *   Bài tập Ngày 22   38 câu có đáp án + 1 đoạn viết + 1 bài nói
 * Mọi id bắt đầu `t4d22-`.
 */
import type { Lesson } from '../data';

export const NGAY_22: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d22-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Children, parenting & gender roles — nuôi dạy con, sự phát triển của trẻ, chia sẻ việc nhà và vai trò giới",
    goal: "Dùng đúng 42 từ và 12 collocation về nuôi dạy con và vai trò giới để viết Task 2 và trả lời Part 3 ở band 7 (set clear boundaries, share the burden of childcare, narrow the gender pay gap…), phân biệt 7 cặp dễ nhầm (bring up / grow up, authoritative / authoritarian, childish / childlike…), và biết 8 thành ngữ chỉ dùng khi nói.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        items: [
          "Chủ đề **trẻ em – cha mẹ – vai trò giới** ra đề đều ở cả Task 2 (ai chịu trách nhiệm dạy trẻ? nghỉ thai sản cho bố? việc nhà chia thế nào?) và Part 3.",
          "Bốn nhóm từ: **cách nuôi dạy** (12) · **sự phát triển của trẻ** (10) · **gia đình và việc chăm sóc** (9) · **vai trò giới** (11).",
          "Band 7 LR chấm ==collocation==: không nói ~~teach children good characters~~ mà nói **instil a sense of responsibility in children**.",
          "Bảy cặp dễ nhầm — nhất là **bring up** (nuôi) ≠ **grow up** (lớn lên), **authoritative** (nghiêm mà ấm) ≠ **authoritarian** (độc đoán).",
          "Thành ngữ (like father, like son…) ==chỉ dùng khi NÓI==; trong bài luận thay bằng cách nói trung tính (nối Ngày 18).",
        ],
      },

      { t: "h", text: "1. Cách nuôi dạy — 12 từ" },
      { t: "p", text: "Các nhà tâm lý thường chia cách làm cha mẹ theo hai trục: mức **yêu cầu** và mức **ấm áp**. Thuộc bốn tính từ authoritative · authoritarian · permissive · neglectful là bạn có sẵn khung so sánh cho mọi câu hỏi Part 3 về dạy con." },
      {
        t: "vocab",
        items: [
          { w: "upbringing", pos: "n", ipa: "/ˈʌpbrɪŋɪŋ/", vi: "sự nuôi dạy (cách một người được nuôi lớn)", ex: "A strict upbringing does not always produce disciplined adults.", exVi: "Sự nuôi dạy nghiêm khắc không phải lúc nào cũng tạo ra người lớn kỷ luật.", more: "have a strict / sheltered / privileged **upbringing** · không đếm số nhiều" },
          { w: "nurture", pos: "v / n", ipa: "/ˈnɜːtʃə/", vi: "nuôi dưỡng, vun đắp", ex: "Good schools nurture curiosity rather than punish mistakes.", exVi: "Trường tốt vun đắp sự tò mò thay vì phạt lỗi sai.", more: "**nature versus nurture** (bẩm sinh hay do nuôi dạy) · nurture a talent" },
          { w: "discipline", pos: "n / v", ipa: "/ˈdɪsəplɪn/", vi: "kỷ luật; rèn vào khuôn phép", ex: "Children need consistent discipline, not occasional anger.", exVi: "Trẻ cần kỷ luật nhất quán, không phải những cơn giận thất thường.", more: "**maintain / impose** discipline · **self-discipline** · ≠ punish (phạt)" },
          { w: "authoritative", pos: "adj", ipa: "/ɔːˈθɒrətətɪv/", vi: "nghiêm nhưng ấm áp, có giải thích (kiểu được khuyên)", ex: "Authoritative parents set firm rules but explain the reasons for them.", exVi: "Cha mẹ nghiêm-mà-ấm đặt quy tắc chắc nhưng giải thích lý do.", more: "còn nghĩa “có thẩm quyền, đáng tin”: an **authoritative** source" },
          { w: "authoritarian", pos: "adj", ipa: "/ɔːˌθɒrɪˈteəriən/", vi: "độc đoán, bắt vâng lời tuyệt đối", ex: "An authoritarian style may produce obedience but little initiative.", exVi: "Kiểu độc đoán có thể tạo ra sự vâng lời nhưng ít tính chủ động.", more: "an **authoritarian** regime / parent — nghĩa xấu" },
          { w: "permissive", pos: "adj", ipa: "/pəˈmɪsɪv/", vi: "dễ dãi, ít đặt giới hạn", ex: "Permissive parenting is often blamed for poor behaviour at school.", exVi: "Cách nuôi dạy dễ dãi thường bị đổ lỗi cho hành vi kém ở trường.", more: "gần nghĩa: **lenient** (nhẹ tay) · trái: **strict**" },
          { w: "overprotective", pos: "adj", ipa: "/ˌəʊvəprəˈtektɪv/", vi: "bao bọc quá mức", ex: "Overprotective parents may prevent children from learning to judge risk.", exVi: "Cha mẹ bao bọc quá mức có thể khiến trẻ không học được cách lường rủi ro.", more: "n: **overprotection** · báo chí: helicopter parents" },
          { w: "role model", pos: "n", ipa: "/ˈrəʊl mɒdl/", vi: "tấm gương để noi theo", ex: "Older siblings often act as role models, for better or worse.", exVi: "Anh chị lớn thường là tấm gương, theo hướng tốt hay xấu.", more: "**act as / serve as** a role model **for** sb · a positive role model" },
          { w: "boundary", pos: "n", ipa: "/ˈbaʊndri/", vi: "giới hạn, ranh giới", ex: "Teenagers test boundaries precisely because they need them.", exVi: "Thiếu niên thử giới hạn chính vì chúng cần giới hạn.", more: "**set / establish clear boundaries** · overstep the boundaries" },
          { w: "instil", pos: "v", ipa: "/ɪnˈstɪl/", vi: "gieo, khắc sâu (giá trị, thói quen)", ex: "Parents try to instil a sense of responsibility in their children.", exVi: "Cha mẹ cố khắc sâu ý thức trách nhiệm ở con.", more: "instil sth **in** sb · instil discipline / confidence / values (Mỹ: instill)" },
          { w: "spoil", pos: "v", ipa: "/spɔɪl/", vi: "nuông chiều làm hư", ex: "Grandparents are sometimes accused of spoiling their grandchildren.", exVi: "Ông bà đôi khi bị trách là chiều hư cháu.", more: "a **spoilt** child (Anh) / spoiled (Mỹ) · trang trọng hơn: **indulge**" },
          { w: "neglect", pos: "v / n", ipa: "/nɪˈɡlekt/", vi: "bỏ bê, sao nhãng", ex: "Emotional neglect can be as harmful as physical neglect.", exVi: "Bỏ bê về tình cảm có thể hại như bỏ bê về thể chất.", more: "adj: **neglectful** parents · child neglect · suffer from neglect" },
        ],
      },

      { t: "h", text: "2. Sự phát triển của trẻ — 10 từ" },
      {
        t: "vocab",
        items: [
          { w: "formative years", pos: "n pl", ipa: "/ˈfɔːmətɪv jɪəz/", vi: "những năm hình thành nhân cách (đầu đời)", ex: "Habits acquired in the formative years are hard to change.", exVi: "Thói quen hình thành trong những năm đầu đời rất khó đổi.", more: "**during / in** sb's formative years · a formative experience / influence" },
          { w: "cognitive development", pos: "n", ipa: "/ˈkɒɡnətɪv dɪˈveləpmənt/", vi: "sự phát triển nhận thức", ex: "Play is essential for a child's cognitive development.", exVi: "Vui chơi thiết yếu cho sự phát triển nhận thức của trẻ.", more: "cùng khuôn: **emotional / social / physical** development" },
          { w: "milestone", pos: "n", ipa: "/ˈmaɪlstəʊn/", vi: "cột mốc phát triển", ex: "Walking and first words are milestones that parents watch for anxiously.", exVi: "Biết đi và nói những từ đầu tiên là các cột mốc cha mẹ hồi hộp chờ.", more: "**reach / pass** a milestone · a developmental milestone" },
          { w: "attention span", pos: "n", ipa: "/əˈtenʃn spæn/", vi: "khoảng thời gian tập trung được", ex: "Some teachers believe that pupils' attention spans are getting shorter.", exVi: "Một số giáo viên tin rằng khoảng tập trung của học sinh đang ngắn đi.", more: "a **short / limited** attention span" },
          { w: "peer pressure", pos: "n", ipa: "/ˈpɪə preʃə/", vi: "áp lực từ bạn bè đồng trang lứa", ex: "Peer pressure peaks in early adolescence.", exVi: "Áp lực bạn bè lên đỉnh điểm ở đầu tuổi thiếu niên.", more: "**give in to / resist** peer pressure · peers = bạn cùng lứa" },
          { w: "sibling rivalry", pos: "n", ipa: "/ˈsɪblɪŋ ˈraɪvlri/", vi: "sự ganh đua giữa anh chị em", ex: "Comparing children with each other only fuels sibling rivalry.", exVi: "So sánh các con với nhau chỉ làm tăng sự ganh đua anh chị em.", more: "sibling = anh / chị / em ruột · an only child = con một" },
          { w: "adolescence", pos: "n", ipa: "/ˌædəˈlesns/", vi: "tuổi thiếu niên, tuổi dậy thì", ex: "Sleep patterns shift during adolescence.", exVi: "Giấc ngủ thay đổi trong tuổi thiếu niên.", more: "người: an **adolescent** · rộng hơn teenager; trang trọng hơn" },
          { w: "resilience", pos: "n", ipa: "/rɪˈzɪliəns/", vi: "sức bật, khả năng đứng dậy sau khó khăn", ex: "Children build resilience by solving small problems on their own.", exVi: "Trẻ xây sức bật bằng cách tự giải quyết những vấn đề nhỏ.", more: "adj: **resilient** · build / develop resilience" },
          { w: "self-esteem", pos: "n", ipa: "/ˌself ɪˈstiːm/", vi: "lòng tự trọng, sự tự tin vào giá trị bản thân", ex: "Constant criticism damages a child's self-esteem.", exVi: "Chê bai liên tục làm tổn thương lòng tự trọng của trẻ.", more: "**low / high** self-esteem · **boost / undermine** sb's self-esteem" },
          { w: "well-rounded", pos: "adj", ipa: "/ˌwel ˈraʊndɪd/", vi: "phát triển toàn diện", ex: "Sport and music help to produce well-rounded individuals.", exVi: "Thể thao và âm nhạc giúp tạo ra những con người toàn diện.", more: "a well-rounded **education / individual**" },
        ],
      },

      { t: "h", text: "3. Gia đình và việc chăm sóc — 9 từ" },
      {
        t: "vocab",
        items: [
          { w: "childcare", pos: "n", ipa: "/ˈtʃaɪldkeə/", vi: "việc trông giữ trẻ; dịch vụ giữ trẻ", ex: "Affordable childcare allows both parents to remain in work.", exVi: "Dịch vụ giữ trẻ vừa túi tiền cho phép cả bố lẫn mẹ tiếp tục đi làm.", more: "**affordable / subsidised** childcare · childcare **costs / provision** · viết liền" },
          { w: "breadwinner", pos: "n", ipa: "/ˈbredwɪnə/", vi: "người kiếm thu nhập chính, trụ cột kinh tế", ex: "In a growing number of families the mother is the main breadwinner.", exVi: "Ngày càng nhiều gia đình có mẹ là trụ cột kinh tế.", more: "the **main / sole** breadwinner" },
          { w: "primary caregiver", pos: "n", ipa: "/ˈpraɪməri ˈkeəɡɪvə/", vi: "người chăm sóc chính", ex: "Fathers who are the primary caregiver are still relatively rare.", exVi: "Những ông bố là người chăm sóc chính vẫn tương đối hiếm.", more: "Anh cũng nói **carer** · caregiving (n)" },
          { w: "single-parent household", pos: "n", ipa: "/ˌsɪŋɡl ˈpeərənt ˈhaʊshəʊld/", vi: "hộ gia đình đơn thân", ex: "Single-parent households are more likely to face financial hardship.", exVi: "Hộ đơn thân dễ gặp khó khăn tài chính hơn.", more: "a **lone parent** · a **dual-income** household = hai người cùng đi làm" },
          { w: "extended family", pos: "n", ipa: "/ɪkˌstendɪd ˈfæməli/", vi: "đại gia đình (có ông bà, cô chú)", ex: "In many Asian countries the extended family shares the care of children.", exVi: "Ở nhiều nước châu Á, đại gia đình cùng chăm trẻ.", more: "trái: the **nuclear family** (chỉ bố mẹ và con)" },
          { w: "parental leave", pos: "n", ipa: "/pəˌrentl ˈliːv/", vi: "chế độ nghỉ chăm con (cho bố hoặc mẹ)", ex: "Shared parental leave lets couples divide the time off as they choose.", exVi: "Nghỉ chăm con dùng chung cho phép vợ chồng tự chia thời gian nghỉ.", more: "**maternity leave** (mẹ) · **paternity leave** (bố) · **take / be on** leave · paid / unpaid leave" },
          { w: "stay-at-home parent", pos: "n", ipa: "/ˌsteɪ ət ˈhəʊm peərənt/", vi: "bố / mẹ ở nhà chăm con, không đi làm", ex: "The number of stay-at-home fathers has risen, though from a low base.", exVi: "Số ông bố ở nhà chăm con đã tăng, dù từ mức thấp.", more: "trung tính hơn housewife / househusband" },
          { w: "work–life balance", pos: "n", ipa: "/ˌwɜːk laɪf ˈbæləns/", vi: "cân bằng công việc – cuộc sống", ex: "Flexible hours improve parents' work–life balance.", exVi: "Giờ làm linh hoạt cải thiện cân bằng công việc – cuộc sống của cha mẹ.", more: "**achieve / strike / maintain** a healthy work–life balance" },
          { w: "quality time", pos: "n", ipa: "/ˈkwɒləti taɪm/", vi: "thời gian thật sự dành cho nhau", ex: "Parents who work long hours struggle to spend quality time with their children.", exVi: "Cha mẹ làm việc nhiều giờ khó dành thời gian chất lượng cho con.", more: "**spend** quality time **with** sb — dùng được cả nói lẫn viết" },
        ],
      },

      { t: "h", text: "4. Vai trò giới — 11 từ" },
      { t: "p", text: "**gender** = giới (vai trò xã hội gán cho nam / nữ); **sex** = giới tính sinh học. Bài luận về việc nhà, nghề nghiệp, lương dùng **gender**. Phần này nối với nhóm Social issues & equality của Ngày 16." },
      {
        t: "vocab",
        items: [
          { w: "gender role", pos: "n", ipa: "/ˈdʒendə rəʊl/", vi: "vai trò giới", ex: "Traditional gender roles are changing faster in cities than in rural areas.", exVi: "Vai trò giới truyền thống đang đổi nhanh ở thành phố hơn ở nông thôn.", more: "**traditional / rigid** gender roles · **challenge / conform to** gender roles" },
          { w: "stereotype", pos: "n / v", ipa: "/ˈsteriətaɪp/", vi: "định kiến rập khuôn; rập khuôn hoá", ex: "Toys marketed ‘for boys’ or ‘for girls’ reinforce stereotypes.", exVi: "Đồ chơi quảng cáo “cho bé trai” hay “cho bé gái” củng cố định kiến.", more: "**reinforce / challenge / break down** stereotypes · adj: **stereotypical**" },
          { w: "gender pay gap", pos: "n", ipa: "/ˌdʒendə ˈpeɪ ɡæp/", vi: "khoảng cách lương theo giới", ex: "The gender pay gap widens after the birth of a first child.", exVi: "Khoảng cách lương theo giới giãn rộng sau khi sinh con đầu.", more: "**narrow / close** the gap · the gap **widens**" },
          { w: "glass ceiling", pos: "n", ipa: "/ˌɡlɑːs ˈsiːlɪŋ/", vi: "“trần kính” — rào cản vô hình chặn thăng tiến", ex: "Few women in the industry have broken through the glass ceiling.", exVi: "Ít phụ nữ trong ngành vượt qua được trần kính.", more: "**break (through) / hit** the glass ceiling — ẩn dụ đã thành thuật ngữ, viết được" },
          { w: "unpaid labour", pos: "n", ipa: "/ʌnˌpeɪd ˈleɪbə/", vi: "lao động không lương (việc nhà, chăm sóc)", ex: "Women still perform the bulk of unpaid labour in the home.", exVi: "Phụ nữ vẫn làm phần lớn lao động không lương trong nhà.", more: "unpaid **domestic / care** work · **domestic chores** = việc nhà" },
          { w: "division of labour", pos: "n", ipa: "/dɪˌvɪʒn əv ˈleɪbə/", vi: "sự phân chia công việc", ex: "An unequal division of labour at home limits women's careers.", exVi: "Phân chia việc nhà không đều hạn chế sự nghiệp của phụ nữ.", more: "an **equal / fair / unequal** division of labour" },
          { w: "equal opportunities", pos: "n pl", ipa: "/ˌiːkwəl ɒpəˈtjuːnətiz/", vi: "cơ hội bình đẳng", ex: "Equal opportunities in law do not guarantee equal outcomes in practice.", exVi: "Cơ hội bình đẳng trên luật không bảo đảm kết quả bình đẳng trên thực tế.", more: "**gender equality** (n) · an equal-opportunities employer" },
          { w: "discrimination", pos: "n", ipa: "/dɪˌskrɪmɪˈneɪʃn/", vi: "sự phân biệt đối xử", ex: "Discrimination against pregnant employees is illegal but still occurs.", exVi: "Phân biệt đối xử với nhân viên mang thai là phạm pháp nhưng vẫn xảy ra.", more: "discrimination **against** sb · **on the grounds of** gender · v: discriminate against" },
          { w: "bias", pos: "n", ipa: "/ˈbaɪəs/", vi: "thiên kiến", ex: "Unconscious bias can affect who is promoted.", exVi: "Thiên kiến vô thức có thể ảnh hưởng tới việc ai được thăng chức.", more: "bias **against / towards / in favour of** · adj: **biased** · unconscious bias" },
          { w: "underrepresented", pos: "adj", ipa: "/ˌʌndəreprɪˈzentɪd/", vi: "có đại diện ít hơn tỉ lệ đáng có", ex: "Women remain underrepresented in engineering and computing.", exVi: "Phụ nữ vẫn ít hiện diện trong ngành kỹ thuật và máy tính.", more: "underrepresented **in** a field · trái: overrepresented" },
          { w: "gender-neutral", pos: "adj", ipa: "/ˌdʒendə ˈnjuːtrəl/", vi: "trung tính về giới", ex: "Some schools have introduced gender-neutral uniforms.", exVi: "Một số trường đã áp dụng đồng phục trung tính về giới.", more: "gender-neutral **language**: firefighter (không fireman), chair (không chairman)" },
        ],
      },

      { t: "h", text: "5. Mười hai collocation dùng ngay trong Task 2 và Part 3" },
      {
        t: "table",
        head: ["Collocation", "Nghĩa", "Câu mẫu band 7"],
        rows: [
          ["**raise / bring up** a child", "nuôi dạy con", "Raising a child is increasingly expensive in large cities."],
          ["**set clear boundaries**", "đặt giới hạn rõ ràng", "Children feel safer when adults set clear boundaries."],
          ["**instil a sense of** responsibility **in**", "khắc sâu ý thức trách nhiệm", "Household chores instil a sense of responsibility in children."],
          ["**shape** a child's **character**", "định hình nhân cách", "The early years shape a child's character more than any later period."],
          ["**share the burden of** childcare", "chia sẻ gánh nặng chăm con", "Couples who share the burden of childcare report less stress."],
          ["**juggle** work **and** family commitments", "xoay xở giữa việc làm và gia đình", "Many mothers juggle full-time work and family commitments."],
          ["**take** parental **leave**", "nghỉ chăm con", "Few fathers take the parental leave to which they are entitled."],
          ["**challenge / reinforce** stereotypes", "thách thức / củng cố định kiến", "Children's books can either challenge or reinforce stereotypes."],
          ["**narrow** the gender pay **gap**", "thu hẹp khoảng cách lương", "Pay transparency has helped to narrow the gender pay gap."],
          ["**be deprived of** parental attention", "bị thiếu sự quan tâm của cha mẹ", "Children deprived of parental attention may seek it elsewhere."],
          ["**have a lasting effect on**", "để lại ảnh hưởng lâu dài", "Bullying can have a lasting effect on self-esteem."],
          ["**strike a balance between** A **and** B", "tìm điểm cân bằng", "Parents must strike a balance between protection and independence."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi collocation người Việt hay sai",
        items: [
          "~~teach children good characters~~ → **shape children's character** / **instil good values in children**. (character ở nghĩa “nhân cách” không đếm được.)",
          "~~take care children~~ → take care **of** children / **look after** children / **care for** children.",
          "~~give birth a child~~ → give birth **to** a child. ~~born a child~~ → **have** a child.",
          "~~the gap is reduced smaller~~ → the gap **has narrowed**. Gap đi với **narrow / close / widen**.",
          "~~parents should spend time for their children~~ → spend time **with** their children; spend money **on** them.",
        ],
      },

      { t: "h", text: "6. Bảy cặp dễ nhầm" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau", "Ví dụ"],
        rows: [
          ["**bring up / raise** ≠ **grow up**", "bring up, raise: người lớn nuôi (có tân ngữ) · grow up: đứa trẻ tự lớn (KHÔNG tân ngữ)", "My grandmother **brought me up**. · I **grew up** in Huế. ~~My parents grew me up.~~"],
          ["**raise** ≠ **rise**", "raise + tân ngữ · rise không tân ngữ", "raise children / raise awareness · costs **rise**"],
          ["**bring up** ≠ **educate**", "bring up: nuôi dạy ở nhà (đạo đức, thói quen) · educate: dạy học ở trường", "well **brought up** = ngoan, có giáo dục · well **educated** = học cao"],
          ["**authoritative** ≠ **authoritarian**", "nghiêm mà ấm, đáng tin · độc đoán", "an **authoritative** parent (khen) · an **authoritarian** regime / father (chê) · ~~an authoritarian source~~ → an authoritative source"],
          ["**childish** ≠ **childlike**", "trẻ con (chê người lớn) · hồn nhiên như trẻ (khen)", "childish behaviour · childlike curiosity"],
          ["**discipline** ≠ **punish**", "rèn vào khuôn phép (dài hạn) · phạt (một lần)", "Discipline need not involve punishment."],
          ["**maternal** ≠ **maternity**", "thuộc về người mẹ (tình cảm, họ hàng) · thuộc về việc sinh nở (chế độ)", "maternal instinct · my maternal grandmother · maternity leave"],
        ],
      },
      { t: "rule", formula: "bring up / raise + O (người lớn nuôi)  ·  S + grow up (trẻ tự lớn)  ·  be brought up by / in", vi: "“Tôi được ông bà nuôi” = I was brought up by my grandparents; “tôi lớn lên ở…” = I grew up in…" },

      { t: "h", text: "7. Tám thành ngữ — chỉ dùng khi NÓI (nối Ngày 18)" },
      { t: "p", text: "Bảng mô tả Speaking band 7 ghi “dùng **một số** từ ít gặp và thành ngữ”. Một hai thành ngữ đúng chỗ trong Part 2 / Part 3 là đủ; nhồi năm cái vào một câu trả lời thì thành khoe. Trong bài luận, dùng cột “Khi VIẾT”." },
      {
        t: "table",
        head: ["Thành ngữ (khi NÓI)", "Nghĩa", "Khi VIẾT thì dùng"],
        rows: [
          ["**like father, like son** / like mother, like daughter", "cha nào con nấy", "children tend to resemble their parents"],
          ["**a chip off the old block**", "giống hệt bố / mẹ (tính cách)", "closely resembles his father in character"],
          ["**follow in sb's footsteps**", "nối nghiệp, đi theo con đường của ai", "pursue the same career as (viết cũng được)"],
          ["**wrap sb in cotton wool**", "bao bọc quá mức", "be overprotective of"],
          ["**rule with an iron fist**", "cai quản bằng bàn tay sắt", "adopt an authoritarian approach"],
          ["**lay down the law**", "ra lệnh, áp đặt quy tắc", "impose strict rules"],
          ["**the black sheep of the family**", "đứa con khác người, bị coi là “cá biệt”", "the family member regarded as a failure"],
          ["**learn sth the hard way**", "vấp ngã rồi mới học được", "learn from painful experience"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "My dad's a programmer and so am I — like father, like son, I suppose.", vi: "Bố tôi là lập trình viên và tôi cũng thế — cha nào con nấy, chắc vậy." },
          { en: "I think if you wrap kids in cotton wool, they end up learning everything the hard way later on.", vi: "Tôi nghĩ nếu bao bọc trẻ quá mức thì sau này chúng sẽ phải vấp ngã mới học được mọi thứ." },
        ],
      },

      { t: "h", text: "8. Năm câu khung cho Task 2 và Part 3" },
      {
        t: "patterns",
        rows: [
          { formula: "Children who are + V3 / adj … tend to + V", vi: "Nêu xu hướng có rào đón (không nói “always”).", examples: [{ en: "Children who are given clear boundaries tend to cope better with frustration.", vi: "Trẻ được đặt giới hạn rõ ràng thường đối phó tốt hơn với sự bực bội." }] },
          { formula: "The responsibility for + V-ing … lies (primarily) with + N", vi: "Trả lời đề “ai chịu trách nhiệm”.", examples: [{ en: "The responsibility for teaching children right from wrong lies primarily with parents.", vi: "Trách nhiệm dạy trẻ phân biệt đúng sai trước hết thuộc về cha mẹ." }] },
          { formula: "Far from + V-ing, N + V", vi: "Bác một quan niệm sai.", examples: [{ en: "Far from harming children, a working mother can serve as a powerful role model.", vi: "Người mẹ đi làm không hề gây hại cho con mà còn có thể là một tấm gương mạnh mẽ." }] },
          { formula: "It is in the formative years that + S + V", vi: "Câu chẻ nhấn thời điểm (Ngày 7).", examples: [{ en: "It is in the formative years that attitudes to gender are largely fixed.", vi: "Chính trong những năm đầu đời mà thái độ về giới phần lớn được định hình." }] },
          { formula: "N + is no longer the preserve of + N", vi: "Nói một vai trò không còn dành riêng cho một giới.", examples: [{ en: "Childcare is no longer the preserve of women.", vi: "Chăm con không còn là việc riêng của phụ nữ." }] },
        ],
      },

      { t: "h", text: "9. Luyện tập (29 câu)" },
      {
        t: "note",
        title: "📌 Hộp từ cho bài A",
        items: ["upbringing · boundaries · resilience · breadwinner · stereotypes · formative · neglect · underrepresented · peer · leave"],
      },
      {
        t: "quiz",
        id: "t4d22-tv-hop-tu",
        kind: "fill",
        title: "A. Điền từ trong hộp (10 câu)",
        items: [
          { q: "1. Women are still ___ in senior management.", answers: ["underrepresented"], hint: "underrepresented IN + lĩnh vực." },
          { q: "2. Experiences in the ___ years have a lasting effect on personality.", answers: ["formative"], hint: "the formative years = những năm đầu đời." },
          { q: "3. He had a strict ___ and was rarely allowed out in the evenings.", answers: ["upbringing"], hint: "have a strict upbringing." },
          { q: "4. Many teenagers start smoking because of ___ pressure.", answers: ["peer"], hint: "peer pressure." },
          { q: "5. Only a third of fathers took the full paternity ___ available to them.", answers: ["leave"], hint: "take paternity / parental leave." },
          { q: "6. When her husband lost his job, she became the sole ___.", answers: ["breadwinner"], hint: "the sole / main breadwinner." },
          { q: "7. Advertisements that show only women cleaning reinforce ___.", answers: ["stereotypes"], hint: "reinforce stereotypes." },
          { q: "8. Children need adults to set clear ___.", answers: ["boundaries"], hint: "set clear boundaries." },
          { q: "9. Overcoming small failures helps children to build ___.", answers: ["resilience"], hint: "build / develop resilience." },
          { q: "10. Social workers found evidence of serious ___: the children had not been fed properly.", answers: ["neglect"], hint: "neglect (n) = sự bỏ bê." },
        ],
      },
      {
        t: "mcq",
        id: "t4d22-tv-chon",
        title: "B. Collocation và sắc thái — chọn phương án đúng (8 câu)",
        items: [
          { q: "1. I ___ in a small town near the coast.", options: ["was grown up", "brought up", "grew up", "raised"], correct: 2, why: "Trẻ tự lớn: grow up (không tân ngữ, không bị động). Bị động thì: I was brought up / was raised." },
          { q: "2. Parents who explain their rules and listen to their children are described as", options: ["authoritative", "authoritarian", "permissive", "neglectful"], correct: 0, why: "authoritative = nghiêm mà ấm, có giải thích. authoritarian = độc đoán." },
          { q: "3. Sharing household chores helps to ___ a sense of responsibility in children.", options: ["install", "insist", "instruct", "instil"], correct: 3, why: "instil sth in sb. install = lắp đặt (máy, phần mềm)." },
          { q: "4. Transparent salary data has helped to ___ the gender pay gap.", options: ["shorten", "narrow", "decline", "lower down"], correct: 1, why: "narrow / close the gap." },
          { q: "5. Even at forty he still has a ___ sense of wonder about nature. (ý KHEN)", options: ["childish", "childlike", "children", "childhood"], correct: 1, why: "childlike = hồn nhiên (khen). childish = trẻ con (chê)." },
          { q: "6. Câu nào hợp bài Task 2?", options: ["He's a chip off the old block.", "Like father, like son.", "Children tend to adopt the attitudes of their parents.", "Kids copy their folks."], correct: 2, why: "Thành ngữ và từ văn nói (kids, folks) để khi nói; bài luận dùng cách nói trung tính." },
          { q: "7. Many employees struggle to ___ work and family commitments.", options: ["juggle", "joggle", "jungle", "judge"], correct: 0, why: "juggle A and B = xoay xở nhiều việc cùng lúc." },
          { q: "8. Discrimination ___ pregnant employees is against the law.", options: ["to", "with", "for", "against"], correct: 3, why: "discrimination AGAINST sb." },
        ],
      },
      {
        t: "quiz",
        id: "t4d22-tv-dang-tu",
        kind: "fill",
        title: "C. Dạng từ — viết đúng dạng của từ trong ngoặc (6 câu)",
        items: [
          { q: "1. ___ (ADOLESCENCE) need more sleep than adults.", answers: ["Adolescents", "adolescents"], hint: "người: adolescent(s)." },
          { q: "2. The portrayal of fathers in advertising is often ___ (STEREOTYPE).", answers: ["stereotypical", "stereotyped"], hint: "tính từ: stereotypical / stereotyped." },
          { q: "3. Children are remarkably ___ (RESILIENCE) when they feel supported.", answers: ["resilient"], hint: "n resilience → adj resilient." },
          { q: "4. The court found that the parents had been ___ (NEGLECT).", answers: ["neglectful"], hint: "neglectful = có tính bỏ bê." },
          { q: "5. The report accused the firm of ___ (DISCRIMINATE) against older women.", answers: ["discriminating"], hint: "accuse sb of + V-ing; discriminate against." },
          { q: "6. ___ (PARENT) involvement is one of the strongest predictors of success at school.", answers: ["Parental", "parental"], hint: "parental involvement / leave / attention." },
        ],
      },
      {
        t: "quiz",
        id: "t4d22-tv-dich",
        kind: "translate",
        title: "D. Dịch sang tiếng Anh (5 câu)",
        grammar: "collocation của mục 5 + câu khung mục 8",
        items: [
          { q: "Tôi được ông bà nuôi lớn ở một ngôi làng nhỏ.", answers: ["I was brought up by my grandparents in a small village.", "I was raised by my grandparents in a small village."], hint: "be brought up by / be raised by" },
          { q: "Trách nhiệm dạy trẻ phân biệt đúng sai trước hết thuộc về cha mẹ.", answers: ["The responsibility for teaching children right from wrong lies primarily with parents.", "The responsibility for teaching children right from wrong lies primarily with their parents.", "The responsibility for teaching children right from wrong lies mainly with parents."], hint: "The responsibility for V-ing … lies primarily with · right from wrong" },
          { q: "Phụ nữ vẫn làm phần lớn công việc không lương trong nhà.", answers: ["Women still do most of the unpaid work in the home.", "Women still perform the bulk of unpaid labour in the home.", "Women still do the bulk of unpaid work in the home.", "Women still do most of the unpaid work at home.", "Women still do most of the unpaid labour in the home."], hint: "the bulk of / most of · unpaid work / labour · in the home" },
          { q: "Cha mẹ phải tìm điểm cân bằng giữa bảo vệ và sự tự lập.", answers: ["Parents must strike a balance between protection and independence.", "Parents have to strike a balance between protection and independence.", "Parents need to strike a balance between protection and independence."], hint: "strike a balance between A and B" },
          { q: "Chăm con không còn là việc riêng của phụ nữ.", answers: ["Childcare is no longer the preserve of women.", "Looking after children is no longer the preserve of women."], hint: "be no longer the preserve of" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d22-viet",
    kind: "writing",
    title: "Viết Task 2: Problem / solution band 7 — không chỉ nêu giải pháp mà ĐÁNH GIÁ nó có làm được không",
    goal: "Viết được một bài problem / solution 280–310 từ ở band 7: hai vấn đề được mở rộng thành chuỗi hệ quả có ví dụ cụ thể, hai giải pháp gắn đúng vấn đề và mỗi giải pháp được đánh giá tính khả thi theo bốn phép thử (chi phí · thực thi · sự chấp nhận · giới hạn), kết bài nói rõ giải pháp nào thực tế nhất.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Tập 2 Ngày 14: khung 4 đoạn và 3 cách thay should. Tập 3 Ngày 18: ==giải pháp gắn đúng nguyên nhân==, mở bài nhượng bộ, chuỗi hệ quả hai tầng. Hôm nay thêm tầng band 7: **đánh giá tính khả thi** (feasibility).",
          "Band 6 liệt kê 4 giải pháp bằng should. Band 7 nêu **2 giải pháp** và với mỗi cái trả lời: ai làm, tốn gì, có thực thi được không, còn bỏ sót ai.",
          "Khuôn đoạn giải pháp band 7: **giải pháp “hiển nhiên” → vì sao khó → giải pháp khả thi hơn → giới hạn của nó + biện pháp bù**.",
          "Từ khoá: feasible · viable · workable · cost-effective · enforceable · unrealistic · place a burden on · in the short term / in the long run.",
          "Kết bài không viết “the problem will be solved”; viết **no single measure…, but X appears to be the most practical**.",
        ],
      },

      { t: "h", text: "1. Band 6 và band 7 khác nhau ở đâu? (Problem / solution)" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**TR**", "trả lời đủ hai vế; ý liên quan nhưng giải pháp chỉ được NÊU (should… should…), có chỗ khái quát quá (all parents, completely)", "ý chính được ==mở rộng và chống đỡ==: vấn đề có ví dụ cụ thể, giải pháp được cân nhắc mặt làm được / không làm được; lập trường rõ: giải pháp nào hơn"],
          ["**CC**", "Firstly / Secondly / Moreover đều đặn; giải pháp không nối với vấn đề nào", "mỗi đoạn một việc; giải pháp chỉ ngược về vấn đề (this, such a measure, the cause); từ nối đa dạng, đúng liều"],
          ["**LR**", "problem, solve, solution lặp nhiều; bad results, a bad influence", "be deprived of, compensate for, cap the working week, enforce, subsidised — collocation đúng, có ý thức văn phong"],
          ["**GRA**", "câu đơn + câu ghép so / because; ít lỗi nhưng ít loại câu", "mệnh đề quan hệ, điều kiện, nhượng bộ, danh hoá làm chủ ngữ, would / might để rào đón; phần lớn câu không lỗi"],
        ],
      },

      { t: "h", text: "2. Đọc đề: đếm vế và nhận kiểu câu hỏi (nối Tập 2 Ngày 14, Tập 3 Ngày 18)" },
      { t: "p", text: "**Đề hôm nay.** In many countries, parents now work such long hours that they spend very little time with their children. **What problems does this cause? What measures could be taken to deal with them?**" },
      {
        t: "table",
        head: ["Câu hỏi phân tích", "Trả lời", "Hệ quả cho bài viết"],
        rows: [
          ["Đề có mấy vế?", "2: (1) problems · (2) measures", "hai thân bài cân nhau; thiếu một vế ⇒ TR không quá 5"],
          ["Đề hỏi NGUYÊN NHÂN không?", "Không. Nguyên nhân (làm việc nhiều giờ) đã cho sẵn", "đừng mất một đoạn giải thích vì sao người ta làm nhiều"],
          ["Vấn đề CHO AI?", "đề không giới hạn ⇒ cho trẻ là chính; có thể thêm cho cha mẹ hoặc xã hội", "chọn 2 vấn đề của TRẺ để đào sâu, đừng rải 4 đối tượng"],
          ["“measures” do ai làm?", "đề để mở: chính phủ, doanh nghiệp, nhà trường, cha mẹ", "band 7: chọn 2 tác nhân, nói rõ ai làm gì"],
          ["“deal with them” — them là gì?", "các vấn đề vừa nêu", "==giải pháp phải chữa đúng vấn đề đã nêu== ở thân bài 1"],
        ],
      },
      {
        t: "note",
        title: "📌 Bốn kiểu đề cùng họ — nhìn động từ hỏi",
        items: [
          "**What problems…? What solutions / measures…?** — hôm nay.",
          "**Why is this happening? What can be done?** — nguyên nhân + giải pháp: giải pháp phải gỡ đúng nguyên nhân (Tập 3 Ngày 18).",
          "**What are the causes? What are the effects?** — không có giải pháp; đừng tự thêm.",
          "**Is this a positive or negative development? What can governments do?** — vế 1 là ý kiến, vế 2 là giải pháp (đề hai câu hỏi — Tập 3 Ngày 22; lên band 7 ở Tập 4 Ngày 28).",
        ],
      },

      { t: "h", text: "3. Thân bài 1 — vấn đề mở rộng ba tầng, có một ví dụ nhìn thấy được" },
      { t: "p", text: "Ngày 4 đã dạy mở rộng ý ba tầng: **nhận định → vì sao / cơ chế → ví dụ hoặc hệ quả cụ thể**. Ở bài problem / solution, tầng ba nên là một ==cảnh nhỏ== người đọc hình dung được, không phải “children will have many problems”." },
      {
        t: "table",
        head: ["Tầng", "Band 6", "Band 7"],
        rows: [
          ["1 · Nhận định", "Children may feel lonely.", "The most immediate problem is emotional."],
          ["2 · Cơ chế", "Nobody asks about their day.", "Children who return each day to an empty home are deprived of the routine conversations through which parents notice that something is wrong."],
          ["3 · Cảnh cụ thể", "They spend many hours on their phones.", "A ten-year-old who is being bullied is unlikely to announce it; it tends to emerge over dinner, and only if somebody is there."],
        ],
      },
      { t: "rule", formula: "The most immediate problem is + adj/N. → N who + V … are deprived of + N. → A + [người cụ thể] + who …, for example, …", vi: "Một vấn đề = ba câu: tên vấn đề → cơ chế → một cảnh cụ thể." },

      { t: "h", text: "4. Trọng tâm hôm nay — bốn phép thử tính khả thi" },
      { t: "p", text: "**Feasibility** = mức độ một giải pháp có thể làm được trong thực tế. Giám khảo band 7 tìm dấu hiệu bạn đã NGHĨ về giải pháp chứ không chỉ gọi tên nó. Trước khi viết một giải pháp, hỏi bốn câu:" },
      {
        t: "sodo",
        kind: "flow",
        title: "Bốn phép thử — C · E · A · L",
        steps: [
          { label: "C — Cost: ai trả tiền?", sub: "costly · affordable · cost-effective · place a financial burden on" },
          { label: "E — Enforcement: có thực thi, kiểm tra được không?", sub: "enforceable · difficult to enforce · hard to monitor · open to abuse" },
          { label: "A — Acceptance: người liên quan có chịu không?", sub: "politically unpopular · meet with resistance from · employers have little reason to object" },
          { label: "L — Limits: ai / trường hợp nào bị bỏ sót?", sub: "would not help every… · only a partial solution · needs to be combined with" },
        ],
      },
      {
        t: "table",
        head: ["Giải pháp cho đề hôm nay", "C", "E", "A", "L", "Kết luận"],
        rows: [
          ["Luật giới hạn giờ làm mỗi tuần", "nhà nước tốn ít; người lương thấp mất tiền làm thêm", "khó kiểm tra ở bán lẻ, y tế, việc tự do", "doanh nghiệp phản đối", "người mất thu nhập đi làm việc thứ hai", "đúng nguyên nhân nhưng KHÓ ⇒ nêu rồi chỉ ra chỗ yếu"],
          ["Quyền xin giờ làm linh hoạt cho người có con nhỏ", "gần như không tốn", "dễ: quyền gắn với từng hợp đồng", "chủ ít lý do phản đối vì tổng giờ không giảm", "y tá ca đêm, công nhân dây chuyền không dùng được", "KHẢ THI nhất ⇒ giải pháp chính"],
          ["Câu lạc bộ sau giờ học được trợ giá", "tốn ngân sách vừa phải", "dễ: trường tổ chức", "phụ huynh hoan nghênh", "không tạo ra thời gian cha mẹ – con, chỉ bảo đảm có người trông", "biện pháp BÙ cho giới hạn của giải pháp chính"],
          ["“Cha mẹ nên dành nhiều thời gian hơn”", "—", "không ai kiểm tra", "—", "không chữa nguyên nhân: họ không CÓ thời gian", "lời khuyên, không phải giải pháp ⇒ bỏ"],
        ],
        caption: "Lập bảng này trong 2 phút ở bước dàn ý; chỉ đưa vào bài 2 dòng đầu + dòng bù.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "The obvious response would be for + N + to V. Admittedly, …; however, + [C / E / A]",
            vi: "Nêu giải pháp “hiển nhiên” rồi chỉ ra vì sao khó (nối Ngày 2: “nêu rồi bác”).",
            examples: [{ en: "The obvious response would be for governments to cap the working week. Admittedly, this would address the cause directly; however, it is difficult to enforce in sectors such as retail or healthcare.", vi: "Phản ứng hiển nhiên là chính phủ giới hạn tuần làm việc. Phải thừa nhận rằng cách này xử lý thẳng vào nguyên nhân; tuy nhiên, nó khó thực thi ở những ngành như bán lẻ hay y tế." }],
          },
          {
            formula: "A more feasible / realistic measure is to V. This costs + N + very little, and since …, + [A]",
            vi: "Đưa giải pháp khả thi hơn và nói VÌ SAO nó khả thi.",
            examples: [{ en: "A more feasible measure is to give employees with young children a legal right to request flexible hours. This costs the state very little, and since it rearranges working time rather than reducing it, employers have less reason to resist.", vi: "Một biện pháp khả thi hơn là trao cho người lao động có con nhỏ quyền hợp pháp được xin giờ làm linh hoạt. Việc này hầu như không tốn ngân sách, và vì nó sắp xếp lại chứ không cắt giờ làm nên chủ lao động ít lý do phản đối hơn." }],
          },
          {
            formula: "It would not help every + N — [ví dụ] — so it needs to be combined with + N, which at least + V",
            vi: "Thừa nhận giới hạn (L) và thêm biện pháp bù.",
            examples: [{ en: "It would not help every family — a nurse on night shifts cannot work from home — so it needs to be combined with subsidised after-school clubs, which at least ensure that children are supervised.", vi: "Nó không giúp được mọi gia đình — y tá trực đêm không thể làm ở nhà — nên cần kết hợp với câu lạc bộ sau giờ học được trợ giá, ít nhất bảo đảm trẻ có người trông." }],
          },
        ],
      },
      {
        t: "table",
        head: ["Muốn nói", "Từ / cụm band 7", "Ghi chú"],
        rows: [
          ["làm được", "feasible · viable · workable · practical · realistic", "a **feasible / viable** option; n: **feasibility**, **viability**"],
          ["không làm được", "unrealistic · impractical · unworkable · unenforceable", "It is **unrealistic to expect** parents **to**…"],
          ["rẻ mà hiệu quả", "cost-effective · relatively inexpensive to implement", "implement / introduce / adopt a measure"],
          ["gây gánh nặng", "place a (financial) burden on · come at a considerable cost to", "burden **on** small businesses"],
          ["có hiệu quả ngay / về lâu dài", "in the short term · in the long run · yield results", "a short-term fix ≠ a long-term solution"],
          ["chỉ chữa một phần", "only a partial solution · would go some way towards V-ing", "go some way towards **reducing**…"],
          ["trừ khi", "is unlikely to succeed unless · would work only if", "nối điều kiện (Ngày 19)"],
          ["giải quyết", "address · tackle · alleviate · mitigate (effects) · remedy", "~~solve the problem completely~~ → **alleviate** the problem"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi khi đánh giá giải pháp",
        items: [
          "**Tự bác hết giải pháp của mình**: chê xong không đưa cái thay thế ⇒ đoạn không còn giải pháp nào. Luôn kết đoạn bằng cái BẠN chọn.",
          "**Đánh giá bằng tính từ suông**: ~~This solution is very effective and feasible.~~ Phải nói VÌ SAO: costs little · easy to check · nobody loses.",
          "**Sai từ loại / giới từ**: ~~it is feasibility~~ → it is **feasible**; ~~a solution for~~ → a solution **to**; ~~spend budget for~~ → spend **on**; ~~enforce to companies~~ → enforce a rule **on** companies.",
        ],
      },
      { t: "rule", formula: "obvious measure → Admittedly…; however, [C/E/A] → A more feasible measure is to V + vì sao → It would not help every N, so… combined with N", vi: "Một đoạn giải pháp band 7 có bốn bước: nêu – chỉ chỗ khó – đưa cái khả thi hơn – nhận giới hạn và bù." },
      {
        t: "quiz",
        id: "t4d22-viet-kha-thi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — ngôn ngữ đánh giá giải pháp (5 câu)",
        grammar: "A more feasible measure is to V · difficult to enforce · place a burden on · unlikely to succeed unless · go some way towards V-ing",
        items: [
          { q: "Một lệnh cấm như vậy sẽ khó thực thi.", answers: ["Such a ban would be difficult to enforce.", "Such a ban would be hard to enforce."], hint: "such a ban · would be difficult to enforce" },
          { q: "Biện pháp này sẽ đặt gánh nặng tài chính lên các doanh nghiệp nhỏ.", answers: ["This measure would place a financial burden on small businesses.", "This measure would place a financial burden on small firms."], hint: "place a financial burden on" },
          { q: "Một lựa chọn khả thi hơn là trợ giá dịch vụ giữ trẻ.", answers: ["A more feasible option is to subsidise childcare.", "A more feasible option would be to subsidise childcare.", "A more viable option is to subsidise childcare.", "A more realistic option is to subsidise childcare."], hint: "a more feasible option is to · subsidise childcare" },
          { q: "Chính sách này khó có thể thành công trừ khi các ông chủ ủng hộ nó.", answers: ["This policy is unlikely to succeed unless employers support it.", "The policy is unlikely to succeed unless employers support it."], hint: "be unlikely to succeed unless · employers" },
          { q: "Giờ làm linh hoạt sẽ phần nào giúp giảm vấn đề.", answers: ["Flexible hours would go some way towards reducing the problem.", "Flexible working hours would go some way towards reducing the problem.", "Flexible hours would go some way towards alleviating the problem."], hint: "go some way towards + V-ing" },
        ],
      },

      { t: "h", text: "5. Dàn ý 5 phút" },
      {
        t: "sodo",
        kind: "flow",
        title: "Problem / solution band 7 — 4 đoạn, 280–310 từ",
        steps: [
          { label: "Mở bài (2 câu, ~45 từ)", sub: "paraphrase bối cảnh · câu 2: bài xét 2 vấn đề VÀ nói trước giải pháp nào thực tế hơn" },
          { label: "Thân bài 1 — 2 vấn đề (~95 từ)", sub: "vấn đề 1: tên → cơ chế → cảnh cụ thể · vấn đề 2: tên → chuỗi hệ quả (…, which in turn…)" },
          { label: "Thân bài 2 — giải pháp có đánh giá (~120 từ)", sub: "giải pháp hiển nhiên → chỗ khó (C / E / A) → giải pháp khả thi hơn + vì sao → giới hạn (L) + biện pháp bù" },
          { label: "Kết bài (2 câu, ~40 từ)", sub: "nhắc 2 vấn đề bằng từ khác · While no single measure…, X appears to be the most practical…" },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: thân bài 2 dài hơn thân bài 1 là bình thường",
        items: [
          "Ở band 7, phần giải pháp chứa lập luận (so hai phương án) nên dài hơn phần vấn đề. Đừng cố chia 50 – 50.",
          "Câu 2 của mở bài nói luôn hướng giải pháp (“…and argues that flexible working is a more realistic remedy than a legal limit on hours”) ⇒ lập trường ==rõ suốt bài== ngay từ đầu.",
        ],
      },

      { t: "h", text: "6. Hai bài mẫu cùng một đề — band 6 và band 7 (ước tính)" },
      {
        t: "passage",
        title: "Bài mẫu band 6 (ước tính) — 224 từ",
        paras: [
          { text: "Nowadays, many parents are very busy with their work and they do not have enough time for their children. This essay will discuss the problems of this situation and suggest some solutions." },
          { text: "There are two main problems. Firstly, children who do not see their parents often may feel lonely. They come home to an empty house and nobody asks about their day, so they spend many hours on their phones or with friends who are a bad influence. Secondly, their study can be affected. Parents are too tired to check homework or talk to teachers, so children may get lower marks. Moreover, when parents are always absent, children do not learn good behaviour from them." },
          { text: "There are several solutions to these problems. Firstly, the government should reduce working hours for all parents so that they can go home early. Secondly, companies should allow every parent to work from home. Thirdly, parents should spend more time with their children at weekends and should not use their phones at home. In addition, schools should organise more activities after class so that children are not alone. If all of these solutions are done, the problem will be solved completely." },
          { text: "In conclusion, long working hours cause loneliness and bad results at school for children. The government, companies, parents and schools should all take action to solve this problem." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 – 7.5 (ước tính) — 298 từ",
        paras: [
          { text: "In many economies, long working hours have become the norm, and one consequence is that parents and children spend remarkably little time together. This essay examines two problems that result and argues that flexible working is a more realistic remedy than a legal limit on hours." },
          { text: "The most immediate problem is emotional. Children who return each day to an empty home are deprived of the routine conversations through which parents notice that something is wrong. A ten-year-old who is being bullied, for example, is unlikely to announce it; it tends to emerge over dinner, and only if somebody is there. A second problem is that boundaries weaken. Exhausted parents often compensate for their absence by being lenient, with the result that screen time and bedtimes go unsupervised, which in turn affects concentration at school." },
          { text: "The obvious response would be for governments to cap the working week. Admittedly, this would address the cause directly; however, it is difficult to enforce in sectors such as retail or healthcare, and lower-paid parents, who depend on overtime, might simply take a second job. A more feasible measure is to give employees with young children a legal right to request flexible hours. This costs the state very little, and since it rearranges working time rather than reducing it, employers have less reason to resist. It would not help every family — a nurse on night shifts cannot work from home — so it needs to be combined with subsidised after-school clubs, which at least ensure that children are supervised until a parent returns." },
          { text: "In conclusion, parental absence harms children both emotionally and in terms of discipline. While no single measure will solve the problem, flexible working supported by affordable after-school care appears to be the most practical way of giving families time back." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6 — vì sao dừng ở 6", "Bài band 7 — làm gì khác"],
        rows: [
          ["**TR**", "4 giải pháp, mỗi cái một câu should, không cái nào được cân nhắc; khái quát quá: **all** parents, **every** parent, solved **completely**; “parents should spend more time” không chữa được nguyên nhân", "2 vấn đề, mỗi cái có cơ chế + cảnh cụ thể (đứa trẻ 10 tuổi bị bắt nạt); 1 giải pháp bị loại CÓ lý do, 1 giải pháp chính + 1 biện pháp bù; lập trường báo từ mở bài và giữ tới kết"],
          ["**CC**", "Firstly – Secondly – Moreover / Firstly – Secondly – Thirdly – In addition: đúng nhưng máy móc; giải pháp không chỉ về vấn đề nào", "this · such · it trỏ ngược; Admittedly…; however · since · so · which at least; mỗi đoạn một việc rõ"],
          ["**LR**", "problem × 5, solution × 4, bad × 2; do solutions (sai collocation)", "be deprived of · compensate for · cap the working week · enforce · subsidised · remedy — không lặp problem / solution"],
          ["**GRA**", "câu đơn + so / because; không lỗi nặng nhưng một kiểu câu", "mệnh đề quan hệ (through which…, who depend on…), would / might rào đón, danh hoá (parental absence), dấu ; và — đúng (Ngày 21)"],
        ],
      },
      {
        t: "note",
        title: "📌 Sửa bài band 6 thành band 7 — ba việc",
        items: [
          "**Bớt**: 4 giải pháp → 2. Bỏ “parents should spend more time” (lời khuyên) và gộp “work from home” vào “flexible hours”.",
          "**Thêm đánh giá**: sau “reduce working hours” viết một câu however + chỗ khó (enforce, overtime).",
          "**Hạ giọng**: all / every / completely → **many** / employees **with young children** / **go some way towards**.",
        ],
      },

      { t: "h", text: "7. Câu khung dùng lại — và luyện" },
      {
        t: "table",
        head: ["Vị trí", "Câu khung"],
        rows: [
          ["Mở bài, câu 2", "This essay examines two problems that result and argues that A is a more realistic remedy than B."],
          ["Vấn đề 1", "The most immediate problem is… · N who… are deprived of…"],
          ["Vấn đề 2", "A second problem is that… , with the result that… , which in turn…"],
          ["Giải pháp hiển nhiên", "The obvious response would be for N to V. Admittedly, …; however, …"],
          ["Giải pháp chính", "A more feasible measure is to V. This costs… very little, and since…, …"],
          ["Giới hạn + bù", "It would not help every N — … — so it needs to be combined with N."],
          ["Kết bài", "While no single measure will solve the problem, N appears to be the most practical way of V-ing."],
        ],
      },
      {
        t: "quiz",
        id: "t4d22-viet-khung-dien",
        kind: "fill",
        title: "Hoàn thành câu — điền MỘT từ (8 câu)",
        items: [
          { q: "Children who grow up without books are ___ of an early advantage.", answers: ["deprived"], hint: "be deprived OF." },
          { q: "The obvious response would be ___ schools to ban phones altogether.", answers: ["for"], hint: "would be FOR + N + to V." },
          { q: "___, a ban would remove the distraction; however, it would be hard to enforce.", answers: ["Admittedly", "Granted"], hint: "Admittedly, …; however, … — nhượng bộ rồi bác." },
          { q: "A more ___ measure is to restrict phone use to break times.", answers: ["feasible", "realistic", "practical", "workable", "viable"], hint: "a more feasible / realistic / practical measure." },
          { q: "Such a tax would place a heavy burden ___ low-income families.", answers: ["on"], hint: "place a burden ON." },
          { q: "Teenagers sleep less, which in ___ affects their concentration.", answers: ["turn"], hint: "which in turn + V — chuỗi hệ quả." },
          { q: "The scheme is unlikely to succeed ___ parents are willing to cooperate.", answers: ["unless"], hint: "unlikely to succeed unless = chỉ thành công nếu." },
          { q: "While no ___ measure will solve the problem, better childcare would help most.", answers: ["single"], hint: "no single measure = không một biện pháp đơn lẻ nào." },
        ],
      },
      {
        t: "mcq",
        id: "t4d22-viet-chon",
        title: "Chọn câu tốt nhất cho bài band 7 (6 câu)",
        items: [
          { q: "1. Câu giải pháp nào có ĐÁNH GIÁ tính khả thi?", options: ["The government should build more nurseries.", "Building more nurseries is a very good and effective solution.", "Subsidised nurseries would be costly at first, but because they allow more parents to work, part of that cost returns to the state in tax.", "If the government builds nurseries, the problem will disappear."], correct: 2, why: "C nêu chi phí (C) rồi lý do vẫn đáng làm. B chỉ khen bằng tính từ; D khái quát quá." },
          { q: "2. Đề: “Many children are overweight. What problems does this cause and what can be done?” Giải pháp nào là LỜI KHUYÊN chứ chưa phải giải pháp?", options: ["Schools could replace sugary drinks in canteens with water.", "Children should eat less and exercise more.", "Councils could make streets around schools car-free at the start and end of the day.", "Food advertising aimed at children could be restricted before 9 p.m."], correct: 1, why: "B chỉ nói điều trẻ nên làm, không nói AI làm gì để điều đó xảy ra, và không kiểm tra được." },
          { q: "3. Câu nào khái quát quá, cần hạ giọng?", options: ["Flexible hours would go some way towards easing the pressure on parents.", "Such a law would be difficult to enforce in small firms.", "This measure would help many, though not all, families.", "If parents stay at home, all children will become successful."], correct: 3, why: "all … will = khẳng định tuyệt đối. Sửa: children are more likely to do well." },
          { q: "4. Sau khi chê “a legal limit on working hours”, câu tiếp theo nên là", options: ["Therefore, there is no solution to this problem.", "A more realistic approach is to give parents the right to request flexible hours.", "In conclusion, parents are too busy.", "Firstly, children feel lonely."], correct: 1, why: "Chê xong phải đưa phương án thay thế; nếu không đoạn mất giải pháp." },
          { q: "5. Câu nào dùng ĐÚNG từ?", options: ["This option is not feasibility in poor countries.", "This is an unfeasible solution for the problem.", "This option is not feasible in countries with limited budgets.", "This option cannot feasible."], correct: 2, why: "be feasible (adj). a solution TO the problem. feasibility là danh từ." },
          { q: "6. Câu kết bài nào hợp band 7?", options: ["While neither measure is a complete answer, subsidised childcare appears to be the more practical of the two.", "In conclusion, if everyone does these things, the problem will be solved.", "To sum up, there are many problems and many solutions.", "In conclusion, I think government should do something."], correct: 0, why: "A nhận giới hạn, chọn rõ một giải pháp, có rào đón (appears to be)." },
        ],
      },

      { t: "h", text: "8. Lỗi mất điểm ở Problem / solution band 6,5 → 7" },
      {
        t: "note",
        title: "⚠️ Sáu lỗi — soát ở lượt 6 (đề) và lượt 5 (liên kết)",
        items: [
          "**Danh sách đi chợ**: 4–5 giải pháp, mỗi cái một câu. Band 7 = ít hơn, sâu hơn.",
          "**Giải pháp lệch vấn đề**: thân bài 1 nói trẻ cô đơn, thân bài 2 lại tăng lương cho giáo viên.",
          "**“Governments should raise awareness”** cho mọi đề — không nói bằng cách nào, ai trả tiền, đo thế nào.",
          "**Tự thêm đoạn nguyên nhân** khi đề chỉ hỏi problems + measures ⇒ thiếu chỗ cho đánh giá.",
          "**Kết bài hứa quá**: the problem will be solved / will disappear.",
          "**Lặp solve – solution – problem**: thay bằng address, tackle, alleviate, remedy, measure, response, approach; difficulty, issue, consequence.",
        ],
      },

      { t: "h", text: "9. Viết bài — AI chấm 4 tiêu chí" },
      { t: "p", text: "40 phút: 5 phút dàn ý (lập bảng C · E · A · L cho 3 giải pháp, chọn 2) · 30 phút viết · 5 phút soát theo bảng 6 lượt (Ngày 21). Viết đề chính trước; đề luyện thêm để hôm sau." },
      {
        t: "essay",
        id: "t4d22-viet-bai",
        task: "Task 2",
        prompt: "In many countries, parents now work such long hours that they spend very little time with their children. What problems does this cause? What measures could be taken to deal with them? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "KHÔNG chép bài mẫu: chọn 2 vấn đề và 2 giải pháp của riêng bạn (ví dụ: sức khoẻ của chính cha mẹ; vai trò ông bà; trường học mở cửa sớm).",
          "Mỗi vấn đề: tên → cơ chế → một cảnh cụ thể.",
          "Thân bài 2: giải pháp hiển nhiên → however + chỗ khó → A more feasible measure is to… + vì sao → giới hạn + biện pháp bù.",
          "Không viết all / every / completely / will be solved.",
          "Soát 6 lượt: chú ý solution TO, burden ON, deprived OF.",
        ],
      },
      {
        t: "essay",
        id: "t4d22-viet-luyen-them",
        task: "Task 2",
        prompt: "(Luyện thêm — đề nguyên nhân + giải pháp) In many households where both partners work full-time, women still do most of the housework and childcare. Why is this the case? What could be done to make the division of work at home more equal? Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đề hỏi WHY + WHAT COULD BE DONE ⇒ thân bài 1 là nguyên nhân (không phải vấn đề); giải pháp phải gỡ đúng nguyên nhân đã nêu (Tập 3 Ngày 18).",
          "Từ của Bài 1: unpaid labour, division of labour, gender roles, reinforce stereotypes, parental leave, primary caregiver.",
          "Đánh giá khả thi: luật không vào được trong nhà (E) ⇒ giải pháp thực tế hơn nằm ở chế độ nghỉ cho bố, giờ làm, giáo dục.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d22-noi",
    kind: "speaking",
    title: "Nói ứng dụng: Thuyết trình 3 phút + hỏi – đáp (Q&A) — nói từ thẻ gợi ý, xử lý 6 kiểu câu hỏi, idiom đúng chỗ",
    goal: "Đứng nói được một bài thuyết trình 3 phút từ thẻ gợi ý (không đọc kịch bản) với nhịp ngắt cụm rõ, rồi trả lời phần hỏi – đáp bằng sáu khung: xác nhận câu hỏi, câu giờ, nhận là không biết, phản bác lịch sự, tách câu hỏi nhiều vế và gác câu hỏi lạc đề — chính là các kỹ năng của Speaking Part 3 band 7.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "Ngày 20 bạn đã VIẾT kịch bản 3 phút theo khung **Hook → Roadmap → 3 ý → Recap → Close**. Hôm nay bạn ==NÓI== nó — và trả lời câu hỏi sau đó.",
          "Không đọc kịch bản. Dùng **thẻ gợi ý**: mỗi phần 3–5 từ khoá + con số. Đọc nguyên văn thì mất ngữ điệu và mất mắt nhìn khán giả.",
          "Tốc độ thuyết trình **130–140 từ/phút** — chậm hơn nói chuyện; 3 phút ≈ 380–420 từ.",
          "**Q&A** có sáu kiểu câu hỏi, mỗi kiểu một khung mở đầu: **Good question** không phải câu trả lời — nó chỉ mua 2 giây.",
          "Idiom thuyết trình (in a nutshell, the tip of the iceberg…) dùng **tối đa 3–4 cái** cho cả bài; đúng chỗ thì thành điểm LR, nhồi thì thành trò.",
          "🔊 **Chunking bài nói dài**: ngắt sau cụm dẫn đường, trước con số, và giữa ba ý liệt kê.",
        ],
      },

      { t: "h", text: "1. Từ kịch bản tới bục nói — thẻ gợi ý thay cho tờ giấy đọc" },
      {
        t: "table",
        head: ["", "Đọc kịch bản (band 6)", "Nói từ thẻ gợi ý (band 7)"],
        rows: [
          ["Mắt", "dán vào giấy", "nhìn người nghe; liếc thẻ khi chuyển ý"],
          ["Giọng", "đều đều, ngắt theo dòng chữ", "ngắt theo ý; nhấn từ khoá và con số"],
          ["Khi quên", "đứng hình vì lạc dòng", "nói ý đó bằng chữ khác — người nghe không biết bạn quên"],
          ["Câu", "câu viết dài, đọc hụt hơi", "câu ngắn ≤ 20 từ; có I'd, we'll, isn't"],
          ["IELTS", "giống trả lời học thuộc — giám khảo nhận ra ngay", "giống Part 2: nói 2 phút từ ghi chú 1 phút"],
        ],
      },
      { t: "p", text: "**Đề mẫu hôm nay.** You are a second-year computing student. Give a **three-minute presentation** to your seminar group on the question: **Should every primary school teach coding from the age of seven?** Then answer questions from the group. Dưới đây là thẻ gợi ý của người nói — toàn bộ chỉ có 45 chữ." },
      {
        t: "sodo",
        kind: "flow",
        title: "Thẻ gợi ý cho bài 3 phút",
        steps: [
          { label: "HOOK", sub: "Hands up — first code before 10? → imagine all thirty" },
          { label: "ROADMAP", sub: "one question · gain / cost / pushed out · my view" },
          { label: "1 · GAIN", sub: "not programmers · small steps · cope with failure · teacher: ‘not afraid of maths’" },
          { label: "2 · COST", sub: "tablets cheap, teachers aren't · tip of iceberg · training" },
          { label: "3 · PUSHED OUT", sub: "day not longer · art / music · strongest argument against" },
          { label: "RECAP + CLOSE", sub: "thinking not jobs · people not machines · yes, inside maths, 1 hr/wk, train first · questions" },
        ],
      },

      { t: "h", text: "2. Bài nói mẫu band 7 — nghe, rồi nói lại theo thẻ" },
      { t: "p", text: "Bấm nghe cả bài một lần (khoảng 2 phút 20 giây — bản mẫu gọn hơn 3 phút; bài của bạn nên dài 380–420 từ). Lần hai, che lời, chỉ nhìn thẻ gợi ý ở trên và tự nói từng phần. Bạn không cần nói đúng từng chữ — chỉ cần đủ ý và giữ các ==câu dẫn đường==." },
      {
        t: "dialogue",
        title: "Should every primary school teach coding from the age of seven? (≈ 300 từ)",
        lines: [
          { who: "Linh", role: "a", text: "Hands up if you wrote your first line of code before you were ten. Two of us. Now imagine a classroom where it's all thirty.", vi: "Ai viết dòng code đầu tiên trước mười tuổi thì giơ tay. Hai người. Giờ hãy hình dung một lớp học mà cả ba mươi em đều thế." },
          { who: "Linh", role: "a", text: "Good morning, everyone. I'm Linh, and in the next three minutes I'd like to answer one question: should every primary school teach coding from the age of seven? I'll look at three things: what children gain, what it costs, and what gets pushed out. Then I'll give you my view.", vi: "Chào buổi sáng mọi người. Tôi là Linh, và trong ba phút tới tôi muốn trả lời một câu hỏi: mọi trường tiểu học có nên dạy lập trình từ bảy tuổi không? Tôi sẽ xét ba điều: trẻ được gì, tốn gì, và cái gì bị đẩy ra. Rồi tôi nêu quan điểm của mình." },
          { who: "Linh", role: "a", text: "Let's start with what children gain. And I should say straight away that the gain isn't programmers. Most seven-year-olds won't become developers, and that's fine. What coding teaches is how to break a big problem into small steps, and how to cope when something doesn't work first time.", vi: "Hãy bắt đầu với điều trẻ được. Và tôi nói ngay rằng cái được không phải là lập trình viên. Đa số trẻ bảy tuổi sẽ không thành lập trình viên, và thế cũng không sao. Lập trình dạy cách chia một vấn đề lớn thành các bước nhỏ, và cách đối phó khi thứ gì đó không chạy ngay lần đầu." },
          { who: "Linh", role: "a", text: "In a school I visited last term, the teacher told me the biggest change wasn't in computing at all. It was that the children had stopped being afraid of getting maths wrong.", vi: "Ở một trường tôi tới thăm học kỳ trước, cô giáo bảo thay đổi lớn nhất hoàn toàn không nằm ở môn tin học. Mà là bọn trẻ đã thôi sợ làm sai toán." },
          { who: "Linh", role: "a", text: "That brings me to my second point: cost. And there is a catch. Tablets are cheap; teachers aren't. The price of the equipment is just the tip of the iceberg. The real cost is training thousands of primary teachers who've never written a program, and that's a steep learning curve for anyone.", vi: "Điều đó đưa tôi tới ý thứ hai: chi phí. Và có một cái vướng. Máy tính bảng thì rẻ; giáo viên thì không. Giá thiết bị chỉ là phần nổi của tảng băng. Chi phí thật là đào tạo hàng nghìn giáo viên tiểu học chưa từng viết một chương trình nào, và với ai thì đó cũng là quãng học rất dốc." },
          { who: "Linh", role: "a", text: "Finally, what gets pushed out. The school day doesn't get any longer, so an hour of coding is an hour less of something else, and that's usually art or music. For me, that's the strongest argument against.", vi: "Cuối cùng, cái gì bị đẩy ra. Ngày học không dài thêm, nên một giờ lập trình là bớt một giờ của môn khác, thường là mỹ thuật hoặc âm nhạc. Với tôi, đó là lý lẽ phản đối mạnh nhất." },
          { who: "Linh", role: "a", text: "So, to sum up: the gains are real, but they're about thinking, not about jobs. The cost is in people, not machines. And something has to give way.", vi: "Vậy, tóm lại: cái được là có thật, nhưng là về tư duy chứ không phải việc làm. Chi phí nằm ở con người chứ không ở máy. Và phải có thứ gì đó nhường chỗ." },
          { who: "Linh", role: "a", text: "In a nutshell, my answer is yes, but not as a separate subject. Build it into maths, an hour a week, and train the teachers first. Thank you. I'd be happy to take any questions.", vi: "Nói gọn, câu trả lời của tôi là có, nhưng không phải thành môn riêng. Đưa nó vào môn toán, mỗi tuần một giờ, và đào tạo giáo viên trước. Cảm ơn mọi người. Tôi sẵn sàng nhận câu hỏi." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Người nói band 6 thường…", "Bài mẫu band 7 làm gì"],
        rows: [
          ["**FC**", "Firstly… Secondly… Moreover… đọc như bài luận; ngập ngừng khi rời giấy", "câu dẫn đường của văn NÓI: Let's start with… · That brings me to… · So, to sum up; ý nối nhau bằng And / So"],
          ["**LR**", "important, good, bad, a lot of; không thành ngữ hoặc thành ngữ sai nguyên dạng", "there is a catch · the tip of the iceberg · a steep learning curve · in a nutshell — bốn cái, mỗi cái đúng một chỗ"],
          ["**GRA**", "câu đơn nối and; hoặc câu viết dài bị hụt", "câu chẻ: **What coding teaches is…**; phủ định tương phản: **it wasn't in computing at all. It was that…**; câu ngắn song song"],
          ["**P**", "đều giọng, nhấn mọi từ", "ngắt cụm; nhấn tương phản: TABlets are cheap; TEACHers aren't"],
        ],
      },
      { t: "rule", formula: "thẻ gợi ý (từ khoá + số) → câu dẫn đường thuộc lòng → phần còn lại nói bằng lời của mình", vi: "Chỉ thuộc lòng 6 câu dẫn đường; mọi thứ khác nói mới mỗi lần." },

      { t: "h", text: "3. Hỏi – đáp: sáu kiểu câu hỏi, sáu khung mở đầu" },
      { t: "p", text: "Phần Q&A làm nhiều người sợ hơn cả bài nói, vì không chuẩn bị trước được. Thật ra câu hỏi chỉ rơi vào sáu kiểu. Mỗi kiểu có một **nước đi đầu tiên** — nói xong nước đó bạn đã có 3–5 giây để nghĩ. Đây cũng là đúng những gì bảng mô tả band 7 gọi là “discourse markers linh hoạt” ở Part 3." },
      {
        t: "table",
        head: ["Kiểu câu hỏi", "Nước đi đầu tiên", "Rồi làm gì"],
        rows: [
          ["1 · Hỏi thẳng, bạn biết", "**That's a good question.** / **Yes — …**", "trả lời 2–3 câu, kết bằng **Does that answer your question?**"],
          ["2 · Không nghe rõ / không chắc hiểu", "**Sorry, could you say that again?** / **If I've understood you correctly, you're asking whether…**", "nhắc lại câu hỏi bằng lời mình, chờ gật đầu, rồi trả lời"],
          ["3 · Khó, cần nghĩ", "**That's an interesting point. Let me think about that for a second.**", "im 2 giây (được phép!), rồi **I suppose I'd say…**"],
          ["4 · Bạn không biết", "**I'm afraid I don't have that figure to hand.**", "**What I can say is…** (điều bạn biết) + **I can find out and get back to you.** Không bịa số"],
          ["5 · Phản bác bạn", "**I take your point.** / **That's a fair challenge.**", "**Where I'd disagree is…** / **I'd see it slightly differently, because…**"],
          ["6 · Nhiều vế, hoặc lạc đề", "**There are two questions there, so let me take them in turn.** / **That's slightly outside what I covered today, but briefly…**", "**On the first…, As for the second…** / **Perhaps we could talk about that afterwards.**"],
        ],
      },
      {
        t: "dialogue",
        title: "Q&A mẫu — bốn câu hỏi sau bài của Linh",
        lines: [
          { who: "Tom", role: "b", text: "You said build it into maths. Do you mean the maths teachers would teach it?", vi: "Bạn nói đưa nó vào môn toán. Ý bạn là giáo viên toán sẽ dạy à?" },
          { who: "Linh", role: "a", text: "Yes — though in primary school that's usually the class teacher anyway, so it's one person, not two departments. That's partly why I think it's realistic. Does that answer your question?", vi: "Vâng — dù ở tiểu học đó thường chính là giáo viên chủ nhiệm, nên là một người chứ không phải hai tổ bộ môn. Một phần vì thế tôi nghĩ nó thực tế. Như vậy đã trả lời câu hỏi của bạn chưa?" },
          { who: "Aisha", role: "c", text: "Isn't this just a fashion, though? Ten years ago everybody said children had to learn Mandarin.", vi: "Nhưng đây chẳng phải chỉ là mốt sao? Mười năm trước ai cũng bảo trẻ phải học tiếng Trung." },
          { who: "Linh", role: "a", text: "That's a fair challenge, and I take your point — there's definitely fashion in education. Where I'd disagree is that a particular language can go out of date, but breaking a problem into steps doesn't. That's the bit I'd keep.", vi: "Phản biện đó công bằng, và tôi hiểu ý bạn — trong giáo dục rõ ràng có mốt. Chỗ tôi không đồng ý là một ngôn ngữ cụ thể có thể lỗi thời, còn việc chia vấn đề thành các bước thì không. Đó là phần tôi muốn giữ." },
          { who: "Tom", role: "b", text: "How many countries already do this?", vi: "Hiện có bao nhiêu nước đã làm việc này?" },
          { who: "Linh", role: "a", text: "I'm afraid I don't have that figure to hand. What I can say is that England put computing into its primary curriculum in 2014. Beyond that I'd be guessing, so I'll look it up and email the group.", vi: "Tiếc là tôi không có sẵn con số đó. Điều tôi nói được là nước Anh đã đưa môn tin học vào chương trình tiểu học từ năm 2014. Ngoài ra thì tôi chỉ đoán thôi, nên tôi sẽ tra và gửi email cho cả nhóm." },
          { who: "Aisha", role: "c", text: "What about AI — won't it write all the code anyway? And how young is too young?", vi: "Thế còn AI — đằng nào nó chẳng viết hết code? Và bao nhiêu tuổi thì là quá nhỏ?" },
          { who: "Linh", role: "a", text: "There are two questions there, so let me take them in turn. On AI: if a machine writes the code, somebody still has to say clearly what the problem is, and that's exactly the skill I mean. As for age, that's slightly outside what I looked at, but I suspect that below seven it should just be play.", vi: "Ở đây có hai câu hỏi, nên tôi xin trả lời lần lượt. Về AI: nếu máy viết code thì vẫn phải có người nói rõ vấn đề là gì, và đó chính là kỹ năng tôi nói tới. Còn về tuổi, điều đó hơi ngoài phần tôi tìm hiểu, nhưng tôi ngờ rằng dưới bảy tuổi thì chỉ nên là chơi." },
        ],
      },
      { t: "p", text: "**Cùng một câu hỏi, hai câu trả lời.** Câu hỏi: “Isn't this just a fashion, though?” Đọc hai bản dưới đây rồi xem bảng — đây cũng là khác biệt giữa câu trả lời Part 3 band 6 và band 7." },
      {
        t: "table",
        head: ["", "Band 6 (ước tính)", "Band 7 (ước tính)"],
        rows: [
          ["Câu trả lời", "No, I don't think so. Coding is very important for the future. Many jobs need coding, so children must learn it. It is not a fashion.", "That's a fair challenge, and I take your point — there's definitely fashion in education. Where I'd disagree is that a particular language can go out of date, but breaking a problem into steps doesn't."],
          ["**FC**", "bác ngay bằng No; bốn câu rời, cùng một ý lặp lại", "ghi nhận → nhượng bộ → nêu chỗ khác; ý nối bằng and / but"],
          ["**LR**", "very important, many jobs, must — từ chung chung", "a fair challenge · take your point · go out of date — cụm tự nhiên, đúng văn nói"],
          ["**GRA**", "câu đơn, thì hiện tại đơn từ đầu tới cuối", "mệnh đề danh ngữ làm chủ ngữ (Where I'd disagree is that…), đối lập trong một câu"],
          ["**P**", "nhấn đều mọi từ; No nói to nghe gắt", "ngắt cụm sau take your point; nhấn tương phản LANGUAGE / STEPS"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi khi trả lời câu hỏi",
        items: [
          "**“Good question” cho MỌI câu** — sau lần thứ hai nghe như máy. Đổi: That's a fair challenge · I'm glad you asked that · Yes — …",
          "**Bịa số** khi không biết. Nói thật “I don't have that figure to hand” được tôn trọng hơn; trong IELTS Part 3 cũng vậy: “I'm not an expert, but I'd guess…”.",
          "**Phản ứng phòng thủ**: ~~No, you are wrong.~~ → **I take your point. Where I'd disagree is…** (nhận một phần rồi mới bác — nối Ngày 2).",
          "**Trả lời lại cả bài**: câu hỏi 10 giây, trả lời 2 phút. Giữ 20–30 giây một câu.",
        ],
      },
      { t: "rule", formula: "nước đi đầu (2 giây) → trả lời 2–3 câu → kiểm tra lại: Does that answer your question?", vi: "Nước đi đầu mua thời gian; câu kiểm tra cuối trả quyền nói lại cho người hỏi." },

      { t: "h", text: "4. Thành ngữ khi thuyết trình — tám cái, và chỗ đặt (nối Ngày 18)" },
      {
        t: "table",
        head: ["Thành ngữ", "Nghĩa", "Đặt ở đâu"],
        rows: [
          ["**get the ball rolling**", "bắt đầu", "mở bài hoặc mở Q&A: Who'd like to get the ball rolling?"],
          ["**there's a catch**", "có một cái vướng / điều kiện ngầm", "đầu ý nêu mặt hạn chế"],
          ["**the tip of the iceberg**", "phần nổi của tảng băng", "khi con số bạn vừa nêu chỉ là một phần nhỏ"],
          ["**a steep learning curve**", "phải học rất nhiều trong thời gian ngắn", "nói về đào tạo, công cụ mới"],
          ["**food for thought**", "điều đáng suy nghĩ", "sau một số liệu gây ngạc nhiên"],
          ["**be on the same page**", "hiểu giống nhau", "kiểm tra khán giả: Just so we're on the same page, …"],
          ["**the bottom line**", "điều cốt lõi sau cùng", "câu recap"],
          ["**in a nutshell**", "nói gọn lại", "câu kết / câu đề xuất"],
        ],
      },
      {
        t: "note",
        title: "📌 Ba quy tắc dùng thành ngữ",
        items: [
          "**Đúng nguyên dạng**: ~~the top of the iceberg~~, ~~a deep learning curve~~, ~~in a nut~~ — sai một chữ là thành lỗi LR.",
          "**Tối đa ba – bốn cái** cho 3 phút. Bài mẫu dùng bốn (there's a catch · the tip of the iceberg · a steep learning curve · in a nutshell) — đó đã là mức trần.",
          "**Không đem vào bài luận** Task 2: in a nutshell → in summary; there's a catch → there is, however, a drawback.",
        ],
      },

      { t: "h", text: "5. Phát âm: chunking bài nói dài" },
      { t: "p", text: "Tập 3 Ngày 11 dạy ngắt cụm (chunking) trong một câu; Tập 4 Ngày 9 dạy tone unit. Bài nói 3 phút cần thêm ba chỗ ngắt ==có chủ ý==: (1) **sau cụm dẫn đường** (That brings me to my second point | cost); (2) **trước một con số hay từ khoá** để nó rơi vào tai người nghe; (3) **giữa các ý liệt kê**, hai ý đầu lên giọng ↗, ý cuối xuống ↘. Trong mỗi cụm, nói LIỀN hơi và chỉ nhấn một từ." },
      {
        t: "phatam",
        id: "t4d22-phat-am",
        title: "Luyện phát âm — ngắt cụm ở dấu |, mỗi cụm nhấn một từ",
        note: "Chỗ ngắt và từ nhấn (CHỮ HOA) ghi trong phần dịch. Đọc chậm hơn nói chuyện: khoảng 135 từ/phút.",
        items: [
          { text: "In the next three minutes, I'd like to answer one question.", ipa: "ɪn ðə nekst θriː mɪnɪts aɪd laɪk tu ɑːnsə wʌn kwestʃən", vi: "Trong ba phút tới, tôi muốn trả lời một câu hỏi. (In the next THREE minutes ↗ | I'd like to answer ONE question ↘)" },
          { text: "I'll look at three things: what children gain, what it costs, and what gets pushed out.", ipa: "aɪl lʊk ət θriː θɪŋz wɒt tʃɪldrən ɡeɪn wɒt ɪt kɒsts ənd wɒt ɡets pʊʃt aʊt", vi: "Tôi sẽ xét ba điều: trẻ được gì, tốn gì, và cái gì bị đẩy ra. (… THREE things | what children GAIN ↗ | what it COSTS ↗ | and what gets pushed OUT ↘)" },
          { text: "Let's start with what children gain.", ipa: "lets stɑːt wɪð wɒt tʃɪldrən ɡeɪn", vi: "Hãy bắt đầu với điều trẻ được. (Let's START | with what children GAIN ↘)" },
          { text: "That brings me to my second point: cost.", ipa: "ðæt brɪŋz miː tə maɪ sekənd pɔɪnt kɒst", vi: "Điều đó đưa tôi tới ý thứ hai: chi phí. (That brings me to my SEcond point ↗ | — ngắt rõ — | COST ↘)" },
          { text: "Tablets are cheap; teachers aren't.", ipa: "tæbləts ə tʃiːp tiːtʃəz ɑːnt", vi: "Máy tính bảng thì rẻ; giáo viên thì không. (TABlets are cheap ↗ | TEACHers aren't ↘ — nhấn tương phản)" },
          { text: "The price of the equipment is just the tip of the iceberg.", ipa: "ðə praɪs əv ði ɪkwɪpmənt ɪz dʒʌst ðə tɪp əv ði aɪsbɜːɡ", vi: "Giá thiết bị chỉ là phần nổi của tảng băng. (The price of the eQUIPment ↗ | is just the TIP of the iceberg ↘)" },
          { text: "I take your point, but I'd see it slightly differently.", ipa: "aɪ teɪk jɔː pɔɪnt bət aɪd siː ɪt slaɪtli dɪfrəntli", vi: "Tôi hiểu ý bạn, nhưng tôi nhìn hơi khác. (I TAKE your point ↘↗ | but I'd see it slightly DIFFerently ↘)" },
          { text: "There are two questions there, so let me take them in turn.", ipa: "ðeər ə tuː kwestʃənz ðeə səʊ let miː teɪk ðəm ɪn tɜːn", vi: "Ở đây có hai câu hỏi, nên tôi xin trả lời lần lượt. (There are TWO questions there ↗ | so let me take them in TURN ↘)" },
        ],
      },

      { t: "h", text: "6. Luyện tập trước khi ghi âm (14 câu)" },
      {
        t: "quiz",
        id: "t4d22-noi-khung-dien",
        kind: "fill",
        title: "A. Hoàn thành khung — điền MỘT từ (8 câu)",
        items: [
          { q: "That ___ me to my second point: cost.", answers: ["brings"], hint: "That brings me to… — câu chuyển ý." },
          { q: "I'm afraid I don't have that figure to ___.", answers: ["hand"], hint: "have sth to hand = có sẵn trong tay." },
          { q: "I ___ your point, but I'd see it slightly differently.", answers: ["take"], hint: "I take your point = tôi hiểu / ghi nhận ý bạn." },
          { q: "There are two questions there, so let me take them in ___.", answers: ["turn"], hint: "in turn = lần lượt." },
          { q: "If I've understood you ___, you're asking whether it would cost more.", answers: ["correctly", "rightly"], hint: "If I've understood you correctly, … — nhắc lại câu hỏi." },
          { q: "The price of the equipment is just the ___ of the iceberg.", answers: ["tip"], hint: "the tip of the iceberg — không phải top." },
          { q: "In a ___, my answer is yes.", answers: ["nutshell"], hint: "in a nutshell = nói gọn lại." },
          { q: "Thank you. I'd be happy to ___ any questions.", answers: ["take", "answer"], hint: "take questions = nhận câu hỏi." },
        ],
      },
      {
        t: "mcq",
        id: "t4d22-noi-chon",
        title: "B. Chọn câu đáp hợp nhất (6 câu)",
        items: [
          { q: "1. Người nghe hỏi một con số bạn không biết. Bạn nói:", options: ["About 70 per cent, I think… or maybe 40.", "I don't know.", "That is not important.", "I'm afraid I don't have that figure to hand, but I can find out and get back to you."], correct: 3, why: "Nhận là không biết + đề nghị tra lại. Bịa số (A) mất uy tín; B cụt; C thô." },
          { q: "2. Người nghe phản bác: “That would never work here.” Bạn mở đầu:", options: ["No, you're wrong.", "That's a fair challenge. Where I'd disagree is…", "OK, maybe you're right, sorry.", "Good question!"], correct: 1, why: "Ghi nhận rồi nêu chỗ không đồng ý. A phòng thủ; C bỏ luôn lập trường; D lạc — đó không phải câu hỏi." },
          { q: "3. Bạn nghe không rõ câu hỏi. Bạn nói:", options: ["What?", "Repeat.", "Sorry, could you say that again?", "I don't understand you."], correct: 2, why: "Lịch sự, đủ câu. A và B cộc; D nghe như đổ lỗi cho người hỏi." },
          { q: "4. Trong bài mẫu, câu nào là ROADMAP?", options: ["Hands up if you wrote your first line of code before you were ten.", "I'll look at three things: what children gain, what it costs, and what gets pushed out.", "Tablets are cheap; teachers aren't.", "In a nutshell, my answer is yes."], correct: 1, why: "Roadmap báo trước ba ý. A là hook; C là ý 2; D là close." },
          { q: "5. Câu hỏi lạc đề và sắp hết giờ. Bạn nói:", options: ["That's slightly outside what I covered today — perhaps we could talk about it afterwards.", "That's a stupid question.", "I will not answer that.", "Next question."], correct: 0, why: "Gác lại lịch sự và hẹn nói sau." },
          { q: "6. Chỗ ngắt nào ĐÚNG?", options: ["That brings | me to my second | point cost.", "That | brings me to my | second point cost.", "That brings me to my second point | cost.", "That brings me | to my second point cost."], correct: 2, why: "Ngắt sau cả cụm dẫn đường, trước từ khoá cost — không cắt ngang cụm." },
        ],
      },

      { t: "h", text: "7. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "**Bước 1 (10 phút):** chọn MỘT đề dưới đây, viết thẻ gợi ý ≤ 50 chữ theo sáu ô ở mục 1. **Bước 2:** ghi âm bài nói 3 phút, chỉ nhìn thẻ. **Bước 3:** nghe lại, tự chấm: có đủ hook – roadmap – 3 ý – recap – close? có đọc không? ngắt cụm ở đâu? **Bước 4:** trả lời năm câu hỏi Q&A ở khối thứ hai, mỗi câu 20–30 giây, mở đầu bằng một khung của mục 3." },
      {
        t: "speak",
        id: "t4d22-noi-thuyet-trinh",
        part: "2",
        questions: [
          "Give a three-minute presentation: Should every primary school teach coding from the age of seven? Use your own three points and your own recommendation.",
          "Give a three-minute presentation: Should companies give fathers the same amount of paid parental leave as mothers? Give a clear recommendation.",
          "Give a three-minute presentation to your team: Should we replace our weekly one-hour meeting with a written update? Give a clear recommendation.",
        ],
      },
      {
        t: "speak",
        id: "t4d22-noi-hoi-dap",
        part: "3",
        questions: [
          "You mentioned cost. Could you say a bit more about who would actually pay for this?",
          "Isn't your proposal unrealistic for schools or companies in poorer areas?",
          "Do you have any figures on how many organisations have already tried this?",
          "What would you say to someone who thinks things are fine as they are? And how long would the change take?",
          "If you could change only one thing tomorrow, what would it be, and why?",
        ],
      },
      {
        t: "note",
        title: "💡 Nối với phòng thi IELTS",
        items: [
          "Bài nói từ thẻ gợi ý = **Part 2** kéo dài: ghi chú 1 phút → nói 2 phút. Sáu ô của thẻ dùng được cho mọi cue card.",
          "Sáu khung Q&A = **Part 3**: xin nhắc lại câu hỏi, câu giờ, nhận là không rành, phản bác lịch sự, trả lời câu hai vế.",
          "Trong công việc IT: demo sprint, bảo vệ đồ án, họp nhóm — cùng một bộ kỹ năng.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 22 ═══════════════════════════ */
  {
    id: "t4d22-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 22 — từ vựng nuôi dạy con & vai trò giới · đánh giá tính khả thi · hỏi – đáp sau thuyết trình · ngắt cụm",
    goal: "Tự kiểm lại cả ngày bằng 38 câu có đáp án, rồi viết một đoạn giải pháp band 7 có đánh giá tính khả thi và trả lời năm câu Part 3 về trẻ em – gia đình bằng từ của Bài 1.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "Phần I–III: từ vựng Bài 1 — collocation, cặp dễ nhầm, dạng từ. Sai phần này ⇒ đọc lại mục 5–6 của Bài 1.",
          "Phần IV–V: ngôn ngữ đánh giá giải pháp và bốn phép thử **C · E · A · L** của Bài 2.",
          "Phần VI–VII: sáu khung hỏi – đáp và ngắt cụm của Bài 3.",
          "Phần VIII: viết một đoạn thân bài giải pháp 120–150 từ — AI chấm.",
          "Phần IX: nói Part 3 về trẻ em, cha mẹ, vai trò giới — dùng ít nhất 5 từ của Bài 1.",
          "Mục tiêu: ≥ 30/38 câu đúng. Dưới 27 ⇒ làm lại phần sai nhiều nhất trước khi sang Ngày 23.",
        ],
      },

      { t: "h", text: "I. Từ vựng — điền MỘT từ (8 câu)" },
      {
        t: "quiz",
        id: "t4d22-bt-dien-tu",
        kind: "fill",
        title: "Điền MỘT từ hợp nghĩa và hợp collocation",
        items: [
          { q: "1. Both parents work full-time, so they rely on ___ childcare provided by the local council.", answers: ["subsidised", "subsidized", "affordable"], hint: "subsidised / affordable childcare." },
          { q: "2. Children who are praised only for being clever may end up with fragile self-___.", answers: ["esteem"], hint: "self-esteem: low / high / fragile self-esteem." },
          { q: "3. Women remain ___ in computer science degrees, making up fewer than one in five students.", answers: ["underrepresented", "under-represented"], hint: "underrepresented IN + lĩnh vực." },
          { q: "4. Many working parents struggle to ___ their jobs and family commitments.", answers: ["juggle", "balance"], hint: "juggle A and B." },
          { q: "5. Pay transparency rules are intended to ___ the gender pay gap.", answers: ["narrow", "close", "reduce"], hint: "narrow / close the gap." },
          { q: "6. Habits formed in a child's ___ years tend to last a lifetime.", answers: ["formative", "early"], hint: "the formative years." },
          { q: "7. In a growing number of families, the father is now the primary ___.", answers: ["caregiver", "carer"], hint: "primary caregiver / carer." },
          { q: "8. Simple chores such as setting the table help to ___ a sense of responsibility in young children.", answers: ["instil", "instill"], hint: "instil sth IN sb." },
        ],
      },

      { t: "h", text: "II. Collocation và cặp dễ nhầm — chọn phương án đúng (6 câu)" },
      {
        t: "mcq",
        id: "t4d22-bt-chon-tu",
        title: "Chọn phương án đúng",
        items: [
          { q: "1. She was ___ by her aunt after her parents moved abroad for work.", options: ["brought up", "grown up", "risen", "educated up"], correct: 0, why: "Bị động của bring up: be brought up by sb. grow up không có tân ngữ, không bị động; rise không có tân ngữ." },
          { q: "2. Even at seventy, my grandfather has a ___ enthusiasm for new gadgets. (ý KHEN)", options: ["childish", "children's", "childhood", "childlike"], correct: 3, why: "childlike = hồn nhiên như trẻ (khen). childish = trẻ con (chê người lớn)." },
          { q: "3. Children feel safer when adults ___ clear boundaries.", options: ["put up", "set", "draw out", "make up"], correct: 1, why: "set / establish clear boundaries. put up = dựng lên (lều, biển); make up = bịa / làm lành." },
          { q: "4. Trong bài luận Task 2, cách nào tốt nhất để nói “cha nào con nấy”?", options: ["Like father, like son.", "He is a chip off the old block.", "Children often adopt the values and habits of their parents.", "Kids are just like their folks."], correct: 2, why: "Thành ngữ và từ văn nói (kids, folks) để dành khi NÓI; bài luận dùng cách nói trung tính." },
          { q: "5. The tribunal ruled that the company had discriminated ___ her because she was pregnant.", options: ["against", "to", "with", "for"], correct: 0, why: "discriminate AGAINST sb; discrimination against sb on the grounds of…" },
          { q: "6. Shared parental leave allows couples to ___ the burden of childcare.", options: ["split up", "part", "spread out of", "share"], correct: 3, why: "share the burden of sth. split up = chia tay; part = chia lìa." },
        ],
      },

      { t: "h", text: "III. Dạng từ — viết đúng dạng của từ trong ngoặc (5 câu)" },
      {
        t: "quiz",
        id: "t4d22-bt-dang-tu",
        kind: "fill",
        title: "Dạng từ",
        items: [
          { q: "1. Parents' main concern is the ___ (AFFORD) of childcare, not its quality.", answers: ["affordability"], hint: "affordable (adj) → affordability (n)." },
          { q: "2. Critics argue that the scheme is not financially ___ (VIABILITY).", answers: ["viable"], hint: "be + adj: viable." },
          { q: "3. The ___ (FEASIBLE) of a four-day week has not yet been tested in the public sector.", answers: ["feasibility"], hint: "The + N + of: feasibility." },
          { q: "4. Many parents feel ___ (GUILT) about working such long hours.", answers: ["guilty"], hint: "feel + adj: guilty." },
          { q: "5. Such a law would be almost impossible to ___ (FORCE) in small family businesses.", answers: ["enforce"], hint: "difficult / impossible to enforce." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d22-bt-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ của Bài 1 và khung của Bài 2",
        grammar: "difficult to enforce · A more feasible measure is to V · be deprived of · the main breadwinner · While no single measure…, N appears to be…",
        items: [
          { q: "Một luật như vậy sẽ rất khó thực thi ở các doanh nghiệp gia đình nhỏ.", answers: ["Such a law would be very difficult to enforce in small family businesses.", "Such a law would be very hard to enforce in small family businesses.", "Such a law would be very difficult to enforce in small family firms."], hint: "such a law · would be difficult to enforce · small family businesses" },
          { q: "Một biện pháp khả thi hơn là trợ giá các câu lạc bộ sau giờ học.", answers: ["A more feasible measure is to subsidise after-school clubs.", "A more feasible measure would be to subsidise after-school clubs.", "A more feasible measure is to subsidize after-school clubs.", "A more realistic measure is to subsidise after-school clubs."], hint: "A more feasible measure is to V · subsidise after-school clubs" },
          { q: "Trẻ bị thiếu sự quan tâm của cha mẹ có thể tìm nó ở nơi khác.", answers: ["Children who are deprived of parental attention may seek it elsewhere.", "Children deprived of parental attention may seek it elsewhere.", "Children who are deprived of parental attention might seek it elsewhere.", "Children who are deprived of parental attention may look for it elsewhere."], hint: "be deprived of · parental attention · seek it elsewhere" },
          { q: "Ở nhiều gia đình, người mẹ giờ là trụ cột kinh tế chính.", answers: ["In many families, the mother is now the main breadwinner.", "In many families the mother is now the main breadwinner.", "In many families, the mother is now the primary breadwinner."], hint: "the main breadwinner" },
          { q: "Dù không một biện pháp đơn lẻ nào giải quyết được vấn đề, giờ làm linh hoạt có vẻ là cách thực tế nhất.", answers: ["While no single measure will solve the problem, flexible working appears to be the most practical approach.", "While no single measure will solve the problem, flexible working appears to be the most practical option.", "Although no single measure will solve the problem, flexible working appears to be the most practical approach.", "While no single measure can solve the problem, flexible working appears to be the most practical approach.", "While no single measure will solve the problem, flexible hours appear to be the most practical approach."], hint: "While no single measure will…, N appears to be the most practical approach" },
        ],
      },

      { t: "h", text: "V. Đánh giá tính khả thi — chọn phương án đúng (5 câu)" },
      {
        t: "mcq",
        id: "t4d22-bt-kha-thi",
        title: "Bốn phép thử C · E · A · L và đoạn giải pháp band 7",
        items: [
          { q: "1. “A ban on homework would be almost impossible to monitor, since teachers could simply call it ‘revision’.” Câu này dùng phép thử nào?", options: ["C — Cost", "A — Acceptance", "E — Enforcement", "L — Limits"], correct: 2, why: "impossible to monitor = không kiểm tra, không thực thi được ⇒ Enforcement." },
          { q: "2. “Flexible hours would do little for parents who work night shifts in hospitals.” Câu này dùng phép thử nào?", options: ["L — Limits (ai bị bỏ sót)", "C — Cost", "E — Enforcement", "A — Acceptance"], correct: 0, why: "Chỉ ra nhóm người giải pháp không với tới ⇒ Limits." },
          { q: "3. Đề: “Many young children now spend several hours a day on screens. What problems does this cause, and what can be done?” Câu giải pháp nào ở mức band 7?", options: ["Parents should stop their children using screens.", "The government should ban tablets for all children under ten.", "Screens are bad, so children should play outside more.", "Schools could send parents a short weekly screen-time guide; this costs almost nothing, although it relies on parents choosing to follow it."], correct: 3, why: "D nói AI làm, tốn gì (C) và giới hạn (L). A, C là lời khuyên; B khái quát quá (all) và khó thực thi." },
          { q: "4. Câu kết bài nào HỨA QUÁ, cần sửa?", options: ["While no single measure is sufficient, subsidised childcare appears to be the most realistic.", "If these measures are taken, children will never feel lonely again.", "Flexible working would go some way towards giving families time back.", "Neither measure is perfect, but the second is clearly easier to implement."], correct: 1, why: "never… again = khẳng định tuyệt đối. Band 7 rào đón: would go some way towards, appears to be." },
          { q: "5. Sau câu “The obvious response would be to ban mobile phones in schools.”, câu tiếp theo tốt nhất là:", options: ["Admittedly, this would remove a distraction; however, it would be hard to enforce once pupils leave the classroom.", "Phones are very bad for students.", "Therefore, the problem will be solved.", "Secondly, teachers should be paid more."], correct: 0, why: "Khuôn band 7: giải pháp hiển nhiên → Admittedly…; however + chỗ khó (E). C hứa quá; D lệch vấn đề." },
        ],
      },

      { t: "h", text: "VI. Hỏi – đáp và ngắt cụm — chọn phương án đúng (6 câu)" },
      {
        t: "mcq",
        id: "t4d22-bt-hoi-dap",
        title: "Khung Q&A (Bài 3, mục 3) và chunking (mục 5)",
        items: [
          { q: "1. Người nghe hỏi hai câu cùng lúc. Bạn mở đầu:", options: ["Next question, please.", "I don't know.", "That is two questions, it is difficult.", "There are two questions there, so let me take them in turn."], correct: 3, why: "Gọi tên hai vế rồi trả lời lần lượt: On the first… As for the second…" },
          { q: "2. Bạn chưa chắc đã hiểu câu hỏi. Câu nào lịch sự và hữu ích nhất?", options: ["What do you mean?", "If I've understood you correctly, you're asking whether it would cost more?", "Your question is not clear.", "Pardon? Pardon?"], correct: 1, why: "Nhắc lại câu hỏi bằng lời mình để người hỏi xác nhận. A, C nghe như trách người hỏi." },
          { q: "3. Câu hỏi khó, bạn cần vài giây để nghĩ. Bạn nói:", options: ["That's an interesting point. Let me think about that for a second.", "Ummm… ummm… ummm…", "I can't answer that.", "Good question, good question."], correct: 0, why: "Câu giờ có chủ ý, rồi im 2 giây là được phép. B, D lộ là bạn đang bí." },
          { q: "4. Cách nào KHÔNG nên dùng để kết thúc câu trả lời trong phần Q&A?", options: ["Does that answer your question?", "I hope that helps.", "So that's basically everything I know about the whole topic, and also another thing is…", "I can send you the figures after the session."], correct: 2, why: "Câu hỏi 10 giây không cần trả lời 2 phút. Giữ 20–30 giây rồi trả quyền nói lại cho người hỏi." },
          { q: "5. Chỗ ngắt nào ĐÚNG? “So to sum up the gains are real but they're about thinking not jobs”", options: ["So to | sum up the gains | are real but they're | about thinking not jobs.", "So, to sum up | the gains are real | but they're about thinking | not jobs.", "So to sum | up the | gains are real but | they're about thinking not jobs.", "So, to sum up the gains | are | real but they're about | thinking not jobs."], correct: 1, why: "Ngắt sau cụm dẫn đường (to sum up), giữa hai vế đối lập, và trước ý tương phản not jobs — không cắt ngang cụm." },
          { q: "6. Liệt kê ba ý “what children gain, what it costs, and what gets pushed out” — ngữ điệu đúng là:", options: ["↘ ↘ ↘ — cả ba ý đều xuống", "↗ ↗ ↗ — cả ba ý đều lên", "giọng đều, không lên xuống", "↗ ↗ ↘ — hai ý đầu lên, ý cuối xuống"], correct: 3, why: "Lên giọng báo “còn nữa”, xuống giọng ở ý cuối báo “hết danh sách” (Bài 3, mục 5)." },
        ],
      },

      { t: "h", text: "VII. Dựng câu — bấm các mảnh theo đúng thứ tự (3 câu)" },
      {
        t: "build",
        id: "t4d22-bt-ghep",
        title: "Ghép câu khung hỏi – đáp và giải pháp",
        items: [
          { vi: "Tôi hiểu ý bạn, nhưng tôi nhìn vấn đề hơi khác.", chips: ["I take", "your point,", "but", "I'd see it", "slightly differently.", "I make", "different"], answer: ["I take", "your point,", "but", "I'd see it", "slightly differently."] },
          { vi: "Tiếc là tôi không có sẵn con số đó, nhưng tôi có thể tra và báo lại cho bạn.", chips: ["I'm afraid", "I don't have", "that figure", "to hand,", "but I can", "find out", "and get back to you.", "in hand,", "return you."], answer: ["I'm afraid", "I don't have", "that figure", "to hand,", "but I can", "find out", "and get back to you."] },
          { vi: "Nó sẽ không giúp được mọi gia đình, nên cần kết hợp với dịch vụ giữ trẻ được trợ giá.", chips: ["It would not", "help every family,", "so it needs", "to be combined", "with", "subsidised childcare.", "combining", "all families,"], answer: ["It would not", "help every family,", "so it needs", "to be combined", "with", "subsidised childcare."] },
        ],
      },

      { t: "h", text: "VIII. Viết một đoạn giải pháp (120–150 từ) — AI chấm" },
      { t: "p", text: "Viết đúng khuôn bốn bước của Bài 2: **giải pháp hiển nhiên → Admittedly…; however + chỗ khó → A more feasible measure is to… + vì sao → giới hạn + biện pháp bù**. Dùng ít nhất 3 từ của Bài 1. Không viết should quá hai lần." },
      {
        t: "essay",
        id: "t4d22-bt-viet-doan",
        task: "Task 2",
        prompt: "Write ONE body paragraph (120–150 words) for the solutions part of this essay. Topic: In many countries, fathers rarely take the parental leave they are entitled to. What problems does this cause, and what measures could encourage more fathers to take leave? Present one obvious measure and explain why it is difficult, then a more feasible measure with its limits.",
        minWords: 120,
        tips: [
          "Giải pháp hiển nhiên có thể là: bắt buộc mọi ông bố nghỉ (E: khó kiểm tra; A: nhiều gia đình phản đối).",
          "Giải pháp khả thi hơn: phần nghỉ “dành riêng cho bố” — không dùng thì mất (use it or lose it), trả lương cao hơn.",
          "Giới hạn (L): người làm tự do, hợp đồng ngắn hạn không có quyền nghỉ ⇒ biện pháp bù.",
          "Soát: parental leave (không đếm được), take leave, be entitled TO, a burden ON.",
        ],
      },

      { t: "h", text: "IX. Nói Part 3 — trẻ em, cha mẹ và vai trò giới (ghi âm, AI chấm)" },
      { t: "p", text: "Mỗi câu 30–45 giây. Mở đầu bằng một khung câu giờ hoặc nhượng bộ của Bài 3 khi câu hỏi khó; dùng ít nhất 5 từ của Bài 1 (upbringing, set boundaries, role model, primary caregiver, gender roles, stereotypes…). Thành ngữ: tối đa một cái mỗi câu." },
      {
        t: "speak",
        id: "t4d22-bt-noi",
        part: "3",
        questions: [
          "Who do you think has the greater influence on a child's character: parents or friends? Why?",
          "Are parents today stricter or more permissive than parents in your grandparents' generation?",
          "Should fathers and mothers have exactly the same responsibilities for childcare?",
          "Do toys and advertising reinforce traditional gender roles? Give an example.",
          "Some people say that children today are overprotected. Do you agree?",
        ],
      },
      {
        t: "note",
        title: "📌 Tự soát trước khi nộp",
        items: [
          "Câu 1–2 Part 3: so sánh hai nhóm / hai thời kỳ — nêu xu hướng có rào đón (tend to, on the whole), có ví dụ cá nhân rồi nâng lên xã hội.",
          "Câu 3–5: ý kiến + lý do + nhượng bộ (I take the point that…, but…) — đúng kỹ năng Q&A của Bài 3.",
          "Đoạn viết: đếm lại — có đủ bốn bước? có câu nào hứa quá (will solve, never, all)?",
        ],
      },
    ],
  },
];
