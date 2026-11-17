/**
 * IELTS Tập 3 — Ngày 6 (tự soạn 18/11/2026; mọi câu ví dụ, bài mẫu, đề, kịch bản nghe, bài đọc VIẾT MỚI):
 *   Bài 1 · Vocab    — Government, politics & public spending: 54 từ / cụm + họ từ + lỗi hay sai [VC20]
 *   Bài 2 · Writing  — Opinion essay band 6: đếm vế đề, thesis có mức độ, phản đề 1 câu; bài mẫu band 5 vs band 6 [W03]
 *   Bài 3 · Speaking — Part 3 “Why do you think…?”: 2 lý do + ví dụ; bảng góc nhìn, bảng trục chia nhóm [S06] 🔊 /ɔː/ /ɒ/ /əʊ/
 *   Bài tập          — 36 câu.
 *   Kiểm tra chặng   — t3d6-kiem-tra (Ngày 1–6), 8 phần.
 * Nối: Tập 2 Ngày 2 (Opinion band 5, P-E-E, đếm vế đề mức nhập) · Tập 2 Ngày 13 (Part 3 nhập môn O–R–E) ·
 *      Tập 2 Ngày 17 (đồng ý theo mức) · Tập 3 Ngày 2 (band descriptors 6, sổ lỗi) · Tập 3 Ngày 5 (dự báo, số liệu).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T3D6_TU_VUNG: Lesson = {
  id: "t3d6-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Government, politics & public spending",
  goal: "Dùng đúng khoảng 54 từ và cụm về nhà nước, chính sách và chi tiêu công (allocate a budget to, taxpayers' money, impose a tax on, a top priority…) kèm họ từ và giới từ đi cùng — để viết được đề Task 2 kiểu “Governments should spend money on…” và trả lời Part 3 về luật, thuế ở mức LR band 6.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Chủ đề **Government & public spending** là chủ đề **nền** của Task 2: rất nhiều đề bắt đầu bằng “Some people think **governments should**…” dù nội dung là giao thông, y tế hay giáo dục.",
        "**42 từ đơn** chia ba nhóm: bộ máy nhà nước – chính trị (16) · ngân sách – chi tiêu công (16) · trách nhiệm – đánh giá chính sách (10); cộng **12 cụm** (collocation) dùng ngay trong bài viết.",
        "Bốn cặp dễ nhầm của người Việt: ==policy / politics / political / politician== · **economic / economical** · **fund / funding / funds** · **tax on** (không phải tax for).",
        "Giới từ đi kèm là thứ bị trừ điểm nhiều nhất: spend **on** · invest **in** · a ban **on** · responsible **for** · allocate … **to** · at the expense **of**.",
        "Đẩy band: **Lexical Resource band 6** — “đủ rộng, dám dùng từ ít gặp dù còn sai”. Mười hai cụm của mục 4 là loại từ giám khảo gọi là **less common lexical items**.",
      ],
    },

    { t: "h", text: "1. Bộ máy nhà nước và chính trị (16 từ)" },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ai làm gì trong một nhà nước?",
      center: "the state",
      branches: [
        { label: "Làm luật", items: ["parliament", "pass legislation", "regulation"] },
        { label: "Điều hành", items: ["the government", "minister", "policy"] },
        { label: "Địa phương", items: ["local authorities", "the council"] },
        { label: "Người dân", items: ["citizen", "vote in an election", "taxpayer"] },
      ],
      caption: "Trong bài thi, bạn hiếm khi cần tên chức vụ cụ thể. Bạn cần nói được: ai ra quyết định, ai trả tiền, ai chịu ảnh hưởng.",
    },
    {
      t: "vocab",
      items: [
        { w: "government", pos: "n", ipa: "/ˈɡʌvənmənt/", vi: "chính phủ", ex: "The government has promised to build more hospitals.", exVi: "Chính phủ đã hứa xây thêm bệnh viện.", more: "Đề thi hay viết **governments** (các chính phủ nói chung, Ø mạo từ) hoặc **the government** (chính phủ của một nước). Chữ **n** giữa từ gần như câm. Họ từ: govern (v) · governor (n) · governance (n)." },
        { w: "state", pos: "n", ipa: "/steɪt/", vi: "nhà nước; bang", ex: "Education should be paid for by the state.", exVi: "Giáo dục nên do nhà nước chi trả.", more: "**state-funded / state-run** schools (trường do nhà nước cấp tiền / điều hành) · **the welfare state** (nhà nước phúc lợi)." },
        { w: "authority", pos: "n", ipa: "/ɔːˈθɒrəti/", vi: "chính quyền, cơ quan chức năng; quyền lực", ex: "Local authorities are responsible for collecting rubbish.", exVi: "Chính quyền địa phương chịu trách nhiệm thu gom rác.", more: "Nghĩa “chính quyền” thường ở số nhiều: **the authorities** · **local authorities**. AWL sublist 1." },
        { w: "parliament", pos: "n", ipa: "/ˈpɑːləmənt/", vi: "quốc hội, nghị viện", ex: "The new law was passed by parliament last month.", exVi: "Luật mới được quốc hội thông qua tháng trước.", more: "Chữ **i** câm: /ˈpɑːləmənt/. **a member of parliament (MP)** = nghị sĩ." },
        { w: "minister", pos: "n", ipa: "/ˈmɪnɪstə/", vi: "bộ trưởng", ex: "The health minister announced a rise in funding.", exVi: "Bộ trưởng y tế công bố tăng kinh phí.", more: "**the prime minister** (thủ tướng) · **ministry** (bộ): the Ministry of Education." },
        { w: "politician", pos: "n", ipa: "/ˌpɒləˈtɪʃn/", vi: "chính trị gia", ex: "Many voters no longer trust politicians.", exVi: "Nhiều cử tri không còn tin các chính trị gia.", more: "Người = politic**ian**; lĩnh vực = politic**s**; tính từ = politic**al**." },
        { w: "policy", pos: "n", ipa: "/ˈpɒləsi/", vi: "chính sách", ex: "The government introduced a new housing policy.", exVi: "Chính phủ đưa ra một chính sách nhà ở mới.", more: "**introduce / adopt / implement a policy** · policy **on** immigration · **policymaker** (người hoạch định chính sách). AWL sublist 1. Đừng nhầm với **politics** (chính trị)." },
        { w: "legislation", pos: "n (U)", ipa: "/ˌledʒɪsˈleɪʃn/", vi: "luật pháp, văn bản luật (nói chung)", ex: "Stricter legislation is needed to protect consumers.", exVi: "Cần luật chặt hơn để bảo vệ người tiêu dùng.", more: "**Không đếm được**: ~~a legislation~~ → **a piece of legislation** / **a law**. **pass / introduce legislation**. AWL sublist 1 (legislate)." },
        { w: "regulation", pos: "n", ipa: "/ˌreɡjuˈleɪʃn/", vi: "quy định; sự quản lý bằng quy định", ex: "Safety regulations in factories are often ignored.", exVi: "Quy định an toàn trong nhà máy thường bị bỏ qua.", more: "**regulate** (v) · **strict / tight regulations** · **comply with regulations** (tuân thủ). AWL sublist 2." },
        { w: "democracy", pos: "n", ipa: "/dɪˈmɒkrəsi/", vi: "nền dân chủ", ex: "In a democracy, citizens choose their leaders.", exVi: "Trong nền dân chủ, công dân chọn người lãnh đạo.", more: "Trọng âm dời: de**MO**cracy · demo**CRA**tic /ˌdeməˈkrætɪk/ (adj)." },
        { w: "election", pos: "n", ipa: "/ɪˈlekʃn/", vi: "cuộc bầu cử", ex: "The party won the election by promising lower taxes.", exVi: "Đảng đó thắng cử nhờ hứa giảm thuế.", more: "**hold / win / lose an election** · **elect** (v) · **the electorate** (toàn thể cử tri)." },
        { w: "vote", pos: "v, n", ipa: "/vəʊt/", vi: "bỏ phiếu; lá phiếu", ex: "Young people are less likely to vote than older people.", exVi: "Người trẻ ít đi bầu hơn người lớn tuổi.", more: "**vote for / against** · **voter** (cử tri) · **the right to vote**." },
        { w: "citizen", pos: "n", ipa: "/ˈsɪtɪzn/", vi: "công dân", ex: "Every citizen has the right to free health care.", exVi: "Mọi công dân đều có quyền được chăm sóc y tế miễn phí.", more: "**citizenship** (quyền công dân) · **senior citizens** (người cao tuổi — cách nói lịch sự)." },
        { w: "council", pos: "n", ipa: "/ˈkaʊnsl/", vi: "hội đồng (thành phố, quận) — chính quyền địa phương", ex: "The city council plans to close two libraries.", exVi: "Hội đồng thành phố dự định đóng hai thư viện.", more: "**the local / city council** · **council housing** (nhà ở xã hội, Anh). Khác **counsel** (lời khuyên, luật sư)." },
        { w: "reform", pos: "n, v", ipa: "/rɪˈfɔːm/", vi: "cải cách", ex: "The education system is in need of reform.", exVi: "Hệ thống giáo dục cần cải cách.", more: "**tax / education / health-care reform** · **introduce reforms**." },
        { w: "campaign", pos: "n, v", ipa: "/kæmˈpeɪn/", vi: "chiến dịch (vận động, tuyên truyền); vận động", ex: "The government launched a campaign against smoking.", exVi: "Chính phủ phát động một chiến dịch chống hút thuốc.", more: "**launch / run a campaign** · an **election** campaign · a **public awareness** campaign. Chữ **g** câm." },
      ],
    },
    {
      t: "table",
      caption: "Bốn từ một gốc — người Việt nhầm nhiều nhất",
      head: ["Từ", "Loại từ", "Nghĩa", "Ví dụ"],
      rows: [
        ["**policy**", "danh từ đếm được", "chính sách (một kế hoạch hành động)", "a new transport **policy**"],
        ["**politics**", "danh từ không đếm được (có -s)", "chính trị (lĩnh vực)", "She is interested in **politics**."],
        ["**political**", "tính từ", "thuộc về chính trị", "a **political** decision · political parties"],
        ["**politician**", "danh từ chỉ người", "chính trị gia", "Voters distrust **politicians**."],
      ],
    },

    { t: "h", text: "2. Ngân sách và chi tiêu công (16 từ)" },
    {
      t: "sodo",
      kind: "flow",
      title: "Dòng tiền công: từ người nộp thuế tới dịch vụ",
      caption: "Mọi đề “governments should spend more on X” đều nằm trên sơ đồ này: tiền có hạn ⇒ chi cho X thì phải bớt ở Y. Đó chính là chỗ để viết phản đề.",
      steps: [
        { label: "**taxpayers** pay **tax**", sub: "income tax · sales tax" },
        { label: "government collects **revenue**", sub: "tổng thu" },
        { label: "sets a **budget**", sub: "decides **priorities**" },
        { label: "**allocates funding** to sectors", sub: "health · education · defence · infrastructure" },
        { label: "**public services**", sub: "hospitals · schools · roads · pensions" },
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "budget", pos: "n", ipa: "/ˈbʌdʒɪt/", vi: "ngân sách", ex: "A large share of the national budget goes to defence.", exVi: "Một phần lớn ngân sách quốc gia dành cho quốc phòng.", more: "**the health / education budget** · **a tight / limited budget** · **budget cuts** (cắt giảm ngân sách) · **on a budget** (tiết kiệm)." },
        { w: "tax", pos: "n, v", ipa: "/tæks/", vi: "thuế; đánh thuế", ex: "The government raised the tax on sugary drinks.", exVi: "Chính phủ tăng thuế đối với đồ uống có đường.", more: "**a tax on** sth (không phải ~~tax for~~) · **income tax** · **pay tax** · **raise / cut / lower taxes** · **taxation** (n, việc đánh thuế)." },
        { w: "taxpayer", pos: "n", ipa: "/ˈtækspeɪə/", vi: "người nộp thuế", ex: "Taxpayers want to know how their money is spent.", exVi: "Người nộp thuế muốn biết tiền của họ được tiêu thế nào.", more: "**taxpayers' money** = tiền thuế của dân (cụm ăn điểm trong Task 2)." },
        { w: "revenue", pos: "n", ipa: "/ˈrevənjuː/", vi: "nguồn thu (của nhà nước, công ty)", ex: "Tourism is a major source of revenue for the country.", exVi: "Du lịch là nguồn thu lớn của đất nước.", more: "**tax revenue** · **generate / raise revenue**. AWL sublist 5." },
        { w: "expenditure", pos: "n", ipa: "/ɪkˈspendɪtʃə/", vi: "khoản chi, chi tiêu (trang trọng)", ex: "Public expenditure on health has doubled since 2000.", exVi: "Chi tiêu công cho y tế đã tăng gấp đôi từ năm 2000.", more: "expenditure **on** sth. Đồng nghĩa: **spending** (thông dụng hơn). Rất hay gặp trong đề Task 1." },
        { w: "funding", pos: "n (U)", ipa: "/ˈfʌndɪŋ/", vi: "kinh phí, tiền tài trợ", ex: "Many schools suffer from a lack of funding.", exVi: "Nhiều trường thiếu kinh phí.", more: "**Không đếm được**: ~~fundings~~. **government / public funding** · **receive / provide funding for**. Xem bảng fund / funding / funds bên dưới. AWL sublist 3 (fund)." },
        { w: "subsidy", pos: "n", ipa: "/ˈsʌbsədi/", vi: "tiền trợ cấp, trợ giá (nhà nước bù một phần chi phí)", ex: "Farmers receive subsidies to keep food prices low.", exVi: "Nông dân nhận trợ giá để giữ giá thực phẩm thấp.", more: "**subsidise** /ˈsʌbsɪdaɪz/ (v): The state **subsidises** public transport. AWL sublist 6." },
        { w: "allocate", pos: "v", ipa: "/ˈæləkeɪt/", vi: "phân bổ (tiền, nguồn lực)", ex: "More money should be allocated to mental health services.", exVi: "Nên phân bổ thêm tiền cho dịch vụ sức khoẻ tâm thần.", more: "allocate sth **to** sb/sth · **allocation** (n) · **allocate resources / funds / a budget**. AWL sublist 6." },
        { w: "invest", pos: "v", ipa: "/ɪnˈvest/", vi: "đầu tư", ex: "Governments should invest in renewable energy.", exVi: "Các chính phủ nên đầu tư vào năng lượng tái tạo.", more: "invest **in** (không phải ~~invest on / for~~) · **investment** (n): investment **in** education. AWL sublist 2." },
        { w: "welfare", pos: "n (U)", ipa: "/ˈwelfeə/", vi: "phúc lợi; trợ cấp xã hội", ex: "Spending on welfare rises when unemployment is high.", exVi: "Chi cho phúc lợi tăng khi thất nghiệp cao.", more: "**the welfare state** · **welfare benefits** (các khoản trợ cấp) · **animal welfare** (quyền lợi động vật). AWL sublist 5." },
        { w: "pension", pos: "n", ipa: "/ˈpenʃn/", vi: "lương hưu", ex: "An ageing population means higher spending on pensions.", exVi: "Dân số già đồng nghĩa với chi cho lương hưu cao hơn.", more: "**a state pension** · **pensioner** (người hưởng lương hưu) · **retire on a pension**." },
        { w: "infrastructure", pos: "n (U)", ipa: "/ˈɪnfrəstrʌktʃə/", vi: "cơ sở hạ tầng (đường, cầu, điện, nước)", ex: "Poor infrastructure discourages foreign investment.", exVi: "Hạ tầng kém làm nản đầu tư nước ngoài.", more: "**transport / digital infrastructure** · **invest in infrastructure**. Không đếm được. AWL sublist 8." },
        { w: "deficit", pos: "n", ipa: "/ˈdefɪsɪt/", vi: "thâm hụt (chi nhiều hơn thu)", ex: "The government cut spending to reduce the budget deficit.", exVi: "Chính phủ cắt chi tiêu để giảm thâm hụt ngân sách.", more: "**a budget deficit** ↔ **a surplus** /ˈsɜːpləs/ (thặng dư)." },
        { w: "debt", pos: "n", ipa: "/det/", vi: "nợ", ex: "National debt has risen sharply over the past decade.", exVi: "Nợ quốc gia đã tăng mạnh trong thập kỷ qua.", more: "Chữ **b** câm: /det/. **be in debt** · **pay off a debt** · **student debt**." },
        { w: "priority", pos: "n", ipa: "/praɪˈɒrəti/", vi: "ưu tiên", ex: "Health care should be the government's top priority.", exVi: "Y tế nên là ưu tiên hàng đầu của chính phủ.", more: "**a top / high / low priority** · **give priority to** · **prioritise** (v). AWL sublist 4 (họ từ prior)." },
        { w: "public spending", pos: "n (U)", ipa: "/ˌpʌblɪk ˈspendɪŋ/", vi: "chi tiêu công", ex: "Public spending on education varies widely between countries.", exVi: "Chi tiêu công cho giáo dục khác nhau nhiều giữa các nước.", more: "spending **on** · **cut / increase public spending** · **government spending** (đồng nghĩa)." },
      ],
    },
    {
      t: "table",
      caption: "fund · funding · funds — ba từ, ba cách dùng",
      head: ["Từ", "Loại", "Cách dùng", "Ví dụ"],
      rows: [
        ["**fund**", "động từ", "cấp tiền cho", "The project is **funded by** the state."],
        ["**fund**", "danh từ đếm được", "một quỹ", "a pension **fund** · a disaster relief **fund**"],
        ["**funding**", "danh từ **không** đếm được", "kinh phí nói chung", "The school needs more **funding**."],
        ["**funds**", "danh từ số nhiều", "tiền, nguồn tiền sẵn có", "**public funds** · raise **funds** for charity"],
      ],
    },

    { t: "h", text: "3. Trách nhiệm và đánh giá chính sách (10 từ)" },
    {
      t: "vocab",
      items: [
        { w: "accountable", pos: "adj", ipa: "/əˈkaʊntəbl/", vi: "phải chịu trách nhiệm giải trình", ex: "Politicians should be held accountable for their decisions.", exVi: "Chính trị gia cần phải chịu trách nhiệm về quyết định của mình.", more: "**hold sb accountable for** · be accountable **to** the public · **accountability** (n)." },
        { w: "transparent", pos: "adj", ipa: "/trænsˈpærənt/", vi: "minh bạch", ex: "The budget process should be transparent.", exVi: "Quy trình ngân sách cần minh bạch.", more: "**transparency** (n): a lack of transparency." },
        { w: "corruption", pos: "n (U)", ipa: "/kəˈrʌpʃn/", vi: "tham nhũng", ex: "Corruption wastes money that should go to public services.", exVi: "Tham nhũng làm lãng phí tiền lẽ ra dành cho dịch vụ công.", more: "**corrupt** (adj): corrupt officials · **tackle / fight corruption**." },
        { w: "bureaucracy", pos: "n", ipa: "/bjʊəˈrɒkrəsi/", vi: "bộ máy quan liêu; thủ tục hành chính rườm rà", ex: "Small businesses complain about too much bureaucracy.", exVi: "Doanh nghiệp nhỏ than phiền thủ tục hành chính quá rườm rà.", more: "**bureaucratic** /ˌbjʊərəˈkrætɪk/ (adj) · **red tape** (cách nói thân mật)." },
        { w: "intervention", pos: "n", ipa: "/ˌɪntəˈvenʃn/", vi: "sự can thiệp", ex: "Some problems cannot be solved without government intervention.", exVi: "Một số vấn đề không giải quyết được nếu thiếu sự can thiệp của chính phủ.", more: "**intervene** /ˌɪntəˈviːn/ (v): intervene **in** the market. AWL sublist 7." },
        { w: "implement", pos: "v", ipa: "/ˈɪmplɪment/", vi: "thực hiện, triển khai (chính sách, kế hoạch)", ex: "The policy is easy to announce but hard to implement.", exVi: "Chính sách này dễ công bố nhưng khó triển khai.", more: "**implement a policy / plan / measure** · **implementation** (n). AWL sublist 4." },
        { w: "impose", pos: "v", ipa: "/ɪmˈpəʊz/", vi: "áp đặt, ban hành (thuế, lệnh cấm, hình phạt)", ex: "The city imposed a charge on drivers entering the centre.", exVi: "Thành phố áp phí lên tài xế đi vào trung tâm.", more: "impose sth **on** sb/sth: **impose a tax / a ban / a fine / restrictions on**. AWL sublist 4." },
        { w: "privatise", pos: "v", ipa: "/ˈpraɪvətaɪz/", vi: "tư nhân hoá", ex: "The railways were privatised in the 1990s.", exVi: "Ngành đường sắt được tư nhân hoá vào thập niên 1990.", more: "Mỹ: privati**z**e. **privatisation** (n) ↔ **nationalise** (quốc hữu hoá)." },
        { w: "public sector", pos: "n", ipa: "/ˌpʌblɪk ˈsektə/", vi: "khu vực công (nhà nước)", ex: "Wages in the public sector have not kept up with prices.", exVi: "Lương khu vực công không theo kịp giá cả.", more: "↔ **the private sector** (khu vực tư nhân). Luôn có **the**: work in **the** public sector. AWL sublist 1 (sector)." },
        { w: "inequality", pos: "n", ipa: "/ˌɪnɪˈkwɒləti/", vi: "sự bất bình đẳng", ex: "Free education is one way to reduce inequality.", exVi: "Giáo dục miễn phí là một cách giảm bất bình đẳng.", more: "**income / social inequality** · **the gap between rich and poor** (cách nói dễ hơn)." },
      ],
    },

    { t: "h", text: "4. Mười hai cụm dùng ngay trong Task 2 và Part 3" },
    {
      t: "vocab",
      items: [
        { w: "taxpayers' money", pos: "cụm n", ipa: "/ˈtækspeɪəz ˌmʌni/", vi: "tiền thuế của dân", ex: "Critics say the stadium is a waste of taxpayers' money.", exVi: "Người chỉ trích nói sân vận động là sự lãng phí tiền thuế của dân.", more: "**a waste / a good use of taxpayers' money**." },
        { w: "public funds", pos: "cụm n", ipa: "/ˌpʌblɪk ˈfʌndz/", vi: "công quỹ, tiền công", ex: "Public funds are limited, so choices have to be made.", exVi: "Công quỹ có hạn, nên phải lựa chọn.", more: "= **public money**. Câu này mở được mọi đoạn phản đề về chi tiêu." },
        { w: "raise / cut taxes", pos: "cụm v", ipa: "/reɪz/ /kʌt/ /ˈtæksɪz/", vi: "tăng / giảm thuế", ex: "No government likes to raise taxes before an election.", exVi: "Không chính phủ nào thích tăng thuế trước bầu cử.", more: "**raise** (ngoại động từ) — không dùng ~~rise taxes~~. Taxes **rise** (tự tăng)." },
        { w: "allocate a budget to", pos: "cụm v", ipa: "/ˈæləkeɪt ə ˈbʌdʒɪt tə/", vi: "dành một khoản ngân sách cho", ex: "A larger budget should be allocated to public transport.", exVi: "Nên dành một ngân sách lớn hơn cho giao thông công cộng.", more: "Dạng bị động rất hợp văn học thuật: **More funding should be allocated to…**" },
        { w: "at the expense of", pos: "cụm giới từ", ipa: "/ət ði ɪkˈspens əv/", vi: "với cái giá là, làm thiệt cho", ex: "New roads should not be built at the expense of public transport.", exVi: "Không nên xây đường mới mà làm thiệt cho giao thông công cộng.", more: "Cụm then chốt của đề “A **rather than** B”: chi cho A **at the expense of** B." },
        { w: "a top priority", pos: "cụm n", ipa: "/ə ˌtɒp praɪˈɒrəti/", vi: "ưu tiên hàng đầu", ex: "Reducing air pollution should be a top priority.", exVi: "Giảm ô nhiễm không khí nên là ưu tiên hàng đầu.", more: "**make sth a priority** · **give priority to sth over sth**." },
        { w: "tackle a problem", pos: "cụm v", ipa: "/ˈtækl ə ˈprɒbləm/", vi: "giải quyết (xử lý thẳng) một vấn đề", ex: "Higher fines alone will not tackle the problem of littering.", exVi: "Chỉ tăng tiền phạt sẽ không giải quyết được nạn xả rác.", more: "tackle **không có giới từ**: ~~tackle with~~. Đồng nghĩa: **address / deal with**." },
        { w: "take measures", pos: "cụm v", ipa: "/teɪk ˈmeʒəz/", vi: "thực hiện các biện pháp", ex: "The authorities must take measures to reduce congestion.", exVi: "Nhà chức trách phải có biện pháp giảm ùn tắc.", more: "= **take steps / take action**. **introduce measures** · **effective / strict measures**." },
        { w: "introduce a law", pos: "cụm v", ipa: "/ˌɪntrəˈdjuːs ə ˈlɔː/", vi: "ban hành một đạo luật", ex: "Several countries have introduced laws against plastic bags.", exVi: "Vài nước đã ban hành luật chống túi nhựa.", more: "**pass a law** (thông qua) · **enforce a law** (thực thi) · **break / obey the law**." },
        { w: "cut back on", pos: "cụm động từ", ipa: "/ˌkʌt ˈbæk ɒn/", vi: "cắt giảm (chi tiêu cho)", ex: "The council has cut back on street cleaning.", exVi: "Hội đồng địa phương đã cắt giảm việc quét dọn đường phố.", more: "Danh từ: **cutbacks / cuts**: spending cuts." },
        { w: "be responsible for", pos: "cụm adj", ipa: "/bi rɪˈspɒnsəbl fə/", vi: "chịu trách nhiệm về", ex: "Who should be responsible for looking after the elderly?", exVi: "Ai nên chịu trách nhiệm chăm sóc người cao tuổi?", more: "responsible **for** + N / V-ing (không phải ~~responsible to do~~). Danh từ: **it is the responsibility of governments to…**" },
        { w: "in the long term", pos: "cụm trạng từ", ipa: "/ɪn ðə ˌlɒŋ ˈtɜːm/", vi: "về lâu dài", ex: "In the long term, prevention is cheaper than treatment.", exVi: "Về lâu dài, phòng bệnh rẻ hơn chữa bệnh.", more: "↔ **in the short term**. Tính từ: a **long-term** solution (có gạch nối)." },
      ],
    },

    { t: "h", text: "5. Họ từ và giới từ đi kèm" },
    {
      t: "table",
      caption: "Tám họ từ của chủ đề",
      head: ["Động từ", "Danh từ", "Tính từ", "Chú ý"],
      rows: [
        ["govern", "government · governance", "governmental", "non-governmental organisation (NGO)"],
        ["legislate", "legislation · legislator", "legislative", "legislation không đếm được"],
        ["regulate", "regulation · regulator", "regulatory", "deregulate = nới lỏng quy định"],
        ["fund", "fund · funding · funds", "state-funded · underfunded", "underfunded = thiếu kinh phí"],
        ["subsidise", "subsidy", "subsidised", "subsidised housing"],
        ["allocate", "allocation", "—", "allocate … to"],
        ["invest", "investment · investor", "—", "invest in"],
        ["tax", "tax · taxation · taxpayer", "taxable · tax-free", "a tax on"],
      ],
    },
    {
      t: "table",
      caption: "Giới từ đi kèm — chỗ mất điểm GRA / LR",
      head: ["Đúng", "Sai hay gặp", "Ví dụ"],
      rows: [
        ["spend money **on**", "~~spend money for / in~~", "Governments spend billions **on** defence."],
        ["invest **in**", "~~invest on / for / to~~", "invest **in** public transport"],
        ["a tax / a ban **on**", "~~a tax for · a ban to~~", "a ban **on** smoking in public places"],
        ["allocate … **to**", "(allocate … for cũng gặp, nhưng **to** + nơi nhận là cách chuẩn nhất)", "allocate more funding **to** schools"],
        ["responsible **for**", "~~responsible to / of~~", "responsible **for** public health"],
        ["impose … **on**", "~~impose to~~", "impose a fine **on** drivers"],
        ["an increase **in** spending **on**", "~~increase of spending for~~", "an increase **in** spending **on** health"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với nhóm từ này",
      items: [
        "**economic** (thuộc kinh tế) ≠ **economical** (tiết kiệm, đỡ tốn): economic growth · an economical car. Viết ~~economical growth~~ là sai nghĩa.",
        "**The government is / are**: tiếng Anh-Anh chấp nhận cả hai; trong bài thi chọn **is** và giữ nhất quán. **Governments** (số nhiều) thì luôn **are / should**.",
        "Thiếu mạo từ: ~~Government should…~~ → **The government** should… / **Governments** should… (Tập 3 Ngày 3).",
        "**raise** (cần tân ngữ) ≠ **rise** (không tân ngữ): The government **raised** taxes. · Taxes **rose**.",
        "**spend** bị động: Money **is spent on** roads — không phải ~~Money spends~~.",
        "**politic** không phải danh từ “chính trị”. Chính trị = **politics**; chính sách = **policy**.",
        "Đừng viết ~~the nation's leaders must do something~~ cho mọi đề. Nói rõ **ai** (the government · local authorities · employers · individuals) và **làm gì** (subsidise · ban · invest in).",
      ],
    },

    { t: "h", text: "6. Sáu câu khung cho Task 2 và Part 3" },
    {
      t: "patterns",
      rows: [
        {
          formula: "Governments should allocate more funding to + N, rather than + V-ing / N",
          vi: "Nêu ưu tiên chi tiêu — khung cho đề “A rather than B”.",
          examples: [{ en: "Governments should allocate more funding to public transport, rather than building new roads.", vi: "Các chính phủ nên phân bổ thêm kinh phí cho giao thông công cộng, thay vì xây đường mới." }],
        },
        {
          formula: "It is the responsibility of + N + to + V",
          vi: "Ai chịu trách nhiệm — trang trọng hơn “N should”.",
          examples: [{ en: "It is the responsibility of the state to provide basic health care for every citizen.", vi: "Nhà nước có trách nhiệm cung cấp chăm sóc y tế cơ bản cho mọi công dân." }],
        },
        {
          formula: "Since public funds are limited, spending on + N + means less money for + N",
          vi: "Câu “tiền có hạn” — mở phản đề hoặc giải thích lý do ưu tiên.",
          examples: [{ en: "Since public funds are limited, spending on space research means less money for hospitals.", vi: "Vì công quỹ có hạn, chi cho nghiên cứu vũ trụ nghĩa là ít tiền hơn cho bệnh viện." }],
        },
        {
          formula: "N + is a good / poor use of taxpayers' money because + S + V",
          vi: "Đánh giá một khoản chi.",
          examples: [{ en: "Free museum entry is a good use of taxpayers' money because it gives every child access to culture.", vi: "Miễn phí vé bảo tàng là cách dùng tiền thuế hợp lý vì nó cho mọi đứa trẻ tiếp cận văn hoá." }],
        },
        {
          formula: "One effective measure would be to impose a tax / ban on + N",
          vi: "Đề xuất biện pháp — would làm câu mềm, không khẳng định quá.",
          examples: [{ en: "One effective measure would be to impose a higher tax on cars entering the city centre.", vi: "Một biện pháp hiệu quả là áp thuế cao hơn với ô tô vào trung tâm thành phố." }],
        },
        {
          formula: "In the long term, investment in + N + will pay for itself",
          vi: "Lập luận dài hạn — “tự hoàn vốn”.",
          examples: [{ en: "In the long term, investment in preventive health care will pay for itself.", vi: "Về lâu dài, đầu tư vào y tế dự phòng sẽ tự hoàn vốn." }],
        },
      ],
    },
    {
      t: "rule",
      formula: "Governments should allocate more funding to + N · impose a tax on + N · N + is a good use of taxpayers' money",
      vi: "Ba khung lõi của chủ đề: phân bổ – áp thuế/cấm – đánh giá khoản chi. Nhớ giới từ to / on / of.",
    },

    { t: "h", text: "7. Phát âm: ba nguyên âm /ɔː/ · /ɒ/ · /əʊ/ trong từ của chủ đề" },
    {
      t: "table",
      caption: "Cùng chữ o / au / aw nhưng ba âm khác nhau — khối luyện có máy chấm nằm ở bài Nói hôm nay",
      head: ["Âm", "Miệng", "Từ của bài"],
      rows: [
        ["/ɔː/ dài", "tròn môi, giữ lâu", "l**aw** · ref**or**m · **au**thority (âm đầu) · supp**or**t · m**ore**"],
        ["/ɒ/ ngắn", "mở miệng, gọn", "p**o**licy · dem**o**cracy · pri**o**rity · auth**o**rity (âm nhấn) · pr**o**blem · c**o**st"],
        ["/əʊ/ đôi", "trượt từ /ə/ sang /ʊ/", "v**o**te · l**o**cal · imp**o**se · s**o**cial · contr**o**l · g**o**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: người Việt hay đọc cả ba thành “o” / “ô”",
      items: [
        "**vote** /vəʊt/ không phải “vốt”; **local** /ˈləʊkl/ không phải “lô-cồ”. Âm /əʊ/ phải **trượt**.",
        "**law** /lɔː/ và **low** /ləʊ/ là hai từ khác nghĩa (luật – thấp). Đọc nhầm làm giám khảo hiểu sai.",
        "**policy** /ˈpɒləsi/ — âm đầu ngắn /ɒ/, không phải “pô-li-xi”. **police** /pəˈliːs/ lại là từ khác.",
        "Sang bài Nói (mục 8) để luyện ba âm này với máy chấm từng âm.",
      ],
    },

    { t: "h", text: "8. Luyện tập" },
    {
      t: "mcq",
      id: "t3d6-tv-chon",
      title: "Chọn từ đúng (10 câu)",
      items: [
        { q: "1. The government has announced a new housing ___ to help first-time buyers.", options: ["A politics", "B policy", "C politician", "D political"], correct: 1, why: "Cần danh từ đếm được “chính sách” → policy. politics = lĩnh vực chính trị." },
        { q: "2. Many people think the new stadium is a waste of ___ money.", options: ["A taxpayers'", "B taxation", "C taxing", "D taxable"], correct: 0, why: "Cụm cố định: **taxpayers' money**." },
        { q: "3. The council should ___ more funding to road repairs.", options: ["A impose", "B subsidy", "C allocate", "D spend"], correct: 2, why: "**allocate … to**. spend đi với **on**; impose là áp đặt; subsidy là danh từ." },
        { q: "4. Stricter ___ needed to control online advertising.", options: ["A legislations are", "B a legislation is", "C legislation are", "D legislation is"], correct: 3, why: "legislation **không đếm được** → không -s, không a, động từ số ít." },
        { q: "5. The country's ___ growth slowed last year.", options: ["A economical", "B economic", "C economy", "D economics"], correct: 1, why: "economic = thuộc kinh tế. economical = tiết kiệm." },
        { q: "6. The government plans to ___ a tax on plastic packaging.", options: ["A impose", "B invest", "C vote", "D reform"], correct: 0, why: "**impose a tax on**." },
        { q: "7. Governments should invest more ___ renewable energy.", options: ["A on", "B for", "C in", "D to"], correct: 2, why: "**invest in**." },
        { q: "8. When a government spends more than it collects, it has a budget ___.", options: ["A revenue", "B subsidy", "C pension", "D deficit"], correct: 3, why: "deficit = thâm hụt. revenue = nguồn thu." },
        { q: "9. Politicians should be held ___ for how public money is used.", options: ["A transparent", "B accountable", "C responsible to", "D bureaucratic"], correct: 1, why: "**hold sb accountable for**. responsible đi với **for**, không phải to." },
        { q: "10. New motorways should not be built ___ public transport.", options: ["A at the expense of", "B in the long term", "C a top priority", "D responsible for"], correct: 0, why: "**at the expense of** = làm thiệt cho." },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-tv-dang-tu",
      title: "Viết dạng đúng của từ trong ngoặc (8 câu)",
      kind: "fill",
      items: [
        { q: "1. The project received £2 million in government ___ (FUND).", answers: ["funding", "funds"] },
        { q: "2. Rural schools are often badly ___ (FUND) compared with city schools. — thiếu kinh phí", answers: ["underfunded", "funded"] },
        { q: "3. Public transport is heavily ___ (SUBSIDY) in many European cities.", answers: ["subsidised", "subsidized"] },
        { q: "4. The ___ (ALLOCATE) of resources between regions is unfair.", answers: ["allocation"] },
        { q: "5. Greater ___ (TRANSPARENT) would increase public trust.", answers: ["transparency"] },
        { q: "6. She wants to become a ___ (POLITICS) and stand for parliament.", answers: ["politician"] },
        { q: "7. Heavy ___ (INVEST) in infrastructure created thousands of jobs.", answers: ["investment"] },
        { q: "8. The ___ (IMPLEMENT) of the new law was delayed for two years.", answers: ["implementation"] },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-tv-dich",
      title: "Dịch sang tiếng Anh — dùng cụm của mục 4 và 6 (5 câu)",
      kind: "translate",
      grammar: "allocate … to · impose a tax on · a top priority · taxpayers' money · It is the responsibility of … to + V",
      items: [
        {
          q: "Chính phủ nên phân bổ thêm kinh phí cho giáo dục.",
          hint: "The government / Governments, should allocate, more funding / money, to education",
          answers: ["The government should allocate more funding to education.", "Governments should allocate more funding to education.", "The government should allocate more money to education.", "Governments should allocate more money to education.", "The government should allocate more funds to education.", "Governments should allocate more funds to education.", "More funding should be allocated to education.", "More money should be allocated to education.", "The government should allocate more funding for education."],
        },
        {
          q: "Y tế nên là ưu tiên hàng đầu của chính phủ.",
          hint: "Health care, should be, the government's top priority / a top priority for the government",
          answers: ["Health care should be the government's top priority.", "Healthcare should be the government's top priority.", "Health care should be a top priority for the government.", "Healthcare should be a top priority for the government.", "Health care should be the top priority of the government.", "Healthcare should be the top priority of the government.", "Health should be the government's top priority.", "Health care should be the top priority for the government."],
        },
        {
          q: "Thành phố đã áp một loại thuế lên túi nhựa.",
          hint: "The city, imposed / has imposed, a tax on, plastic bags",
          answers: ["The city imposed a tax on plastic bags.", "The city has imposed a tax on plastic bags.", "The city introduced a tax on plastic bags.", "The city has introduced a tax on plastic bags."],
        },
        {
          q: "Nhiều người cho rằng dự án này là sự lãng phí tiền thuế của dân.",
          hint: "Many people think / believe, this project, is a waste of, taxpayers' money",
          answers: ["Many people think this project is a waste of taxpayers' money.", "Many people think that this project is a waste of taxpayers' money.", "Many people believe this project is a waste of taxpayers' money.", "Many people believe that this project is a waste of taxpayers' money.", "Many people think the project is a waste of taxpayers' money.", "Many people believe the project is a waste of taxpayers' money.", "Many people argue that this project is a waste of taxpayers' money.", "A lot of people think this project is a waste of taxpayers' money."],
        },
        {
          q: "Nhà nước có trách nhiệm chăm sóc người cao tuổi.",
          hint: "It is the responsibility of the state to look after / care for the elderly — hoặc The state is responsible for + V-ing",
          answers: ["It is the responsibility of the state to look after the elderly.", "It is the responsibility of the state to care for the elderly.", "It is the responsibility of the state to take care of the elderly.", "The state is responsible for looking after the elderly.", "The state is responsible for caring for the elderly.", "The state is responsible for taking care of the elderly.", "It is the state's responsibility to look after the elderly.", "It is the state's responsibility to care for the elderly.", "It is the state's responsibility to take care of the elderly.", "It is the responsibility of the state to look after elderly people.", "It is the responsibility of the state to look after older people.", "The state is responsible for looking after elderly people.", "The state is responsible for looking after older people."],
        },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Viết ─────────────────────────── */

const T3D6_VIET: Lesson = {
  id: "t3d6-viet",
  kind: "writing",
  title: "Viết: Opinion essay band 6 — thesis có mức độ, phản đề một câu",
  goal: "Đọc đề Opinion bằng cách đếm vế và tìm chữ tuyệt đối, viết thesis nói rõ đồng ý tới mức nào, đặt đúng một câu phản đề (Admittedly…, however…) và viết trọn bài 270–310 từ trả lời đủ mọi vế — bốn việc tách band 6 khỏi band 5 ở tiêu chí Task Response.",
  minutes: 100,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 2 bạn đã viết **Opinion essay trọn bài band 5**: khung 4 đoạn, thân bài **P-E-E** (Point – Explain – Example), và làm quen việc **đếm vế đề**. Hôm nay nâng lên **band 6**.",
        "Band 5 → 6 ở Task Response: từ “có ý kiến nhưng **lúc rõ lúc không**, sót phần đề” lên “==trả lời đủ MỌI phần đề, ý kiến rõ xuyên suốt==”.",
        "Ba kỹ thuật mới: (1) **đếm vế + tìm chữ tuyệt đối / so sánh** (the best, the most effective, A better than B) ⇒ cùng một đề có **hai lập trường ngược nhau** đều viết được; (2) **thesis có mức độ** (completely · largely · partly); (3) **phản đề một câu** — nêu ý ngược rồi bác ngay, không biến bài thành Discussion.",
        "Hai **bài mẫu cùng một đề** — band 5 và band 6 — đặt cạnh nhau, có bảng chỉ khác nhau theo **TR · CC · LR · GRA**.",
        "Từ vựng dùng trong bài lấy từ bài 1 hôm nay (public funds, allocate, at the expense of, taxpayers' money).",
      ],
    },

    { t: "h", text: "1. Band 5 và band 6 khác nhau ở đâu? (Opinion essay)" },
    {
      t: "table",
      caption: "Đọc từ band descriptors công khai — diễn đạt lại cho dạng Opinion (nối Tập 3 Ngày 2)",
      head: ["Tiêu chí", "Band 5", "Band 6", "Việc phải làm hôm nay"],
      rows: [
        ["**TR** — trả lời đề", "Chỉ trả lời **một phần** đề; ý kiến có nhưng chỗ rõ chỗ không; kết luận lặp hoặc lạc", "Trả lời **mọi phần** (có phần kỹ hơn phần khác); lập trường **rõ và giữ nguyên** từ mở tới kết", "Đếm vế đề · thesis có mức độ · kết bài nhắc lại đúng mức độ đó"],
        ["**CC** — mạch lạc", "Có sắp xếp nhưng ý chưa tiến triển rõ; từ nối **dùng quá nhiều / máy móc** (Firstly, Moreover, Furthermore); ít thay thế (this, they) nên lặp từ; chia đoạn có khi chưa hợp lý", "Ý tiến triển rõ từ đầu tới cuối; từ nối hiệu quả dù đôi chỗ còn máy móc; có chia đoạn, dù chưa phải lúc nào cũng hợp lý (mỗi đoạn một ý trung tâm rõ ràng là mức band 7 — nên nhắm tới)", "Câu chủ đề nói rõ đoạn này bàn **vế nào**; dùng this / such / these thay từ nối"],
        ["**LR** — từ vựng", "Đủ dùng nhưng lặp (problem, good, important); sai collocation gây khó hiểu", "Đủ rộng; **dám dùng từ ít gặp** dù còn sai nhẹ", "Cụm chủ đề của bài 1 + paraphrase từ khoá của đề"],
        ["**GRA** — ngữ pháp", "Câu đơn là chính; thử câu phức thì hay sai", "**Trộn** câu đơn và câu phức; lỗi có nhưng không cản hiểu", "Mỗi đoạn ≥ 2 câu phức (although, which, if, because) + một câu nhượng bộ"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: band 6 không phải là viết dài hơn hay “sang” hơn",
      items: [
        "Bài band 5 và band 6 dưới đây chênh nhau chỉ khoảng **40 từ**. Thứ khác nhau là bài band 6 **trả lời đúng câu đề hỏi**.",
        "Người chấm đọc đề trước, gạch các vế, rồi **tìm từng vế trong bài bạn**. Thiếu một vế ⇒ TR khó quá 5, dù câu văn đẹp.",
        "Vì vậy 3 phút đầu tiên (đọc đề + chọn lập trường) quyết định band nhiều hơn 30 phút viết.",
      ],
    },

    { t: "h", text: "2. Đọc đề: đếm vế và tìm chữ tuyệt đối (nối Tập 2 Ngày 2)" },
    {
      t: "p",
      text: "Một đề Opinion hiếm khi chỉ có một nhận định trần. Nó thường là **khẳng định + lý do**, **khẳng định + hệ quả**, hoặc **khẳng định + so sánh**. Mỗi mảnh là một **vế**. Bạn có thể đồng ý với vế này mà không đồng ý với vế kia — và đó là cách dễ nhất để có một **lập trường có mức độ**.",
    },
    {
      t: "table",
      caption: "Ba kiểu đề nhiều vế",
      head: ["Kiểu", "Đề mẫu (tự soạn)", "Các vế"],
      rows: [
        ["Khẳng định + **lý do** (because)", "University education should be free **because** it benefits the whole of society.", "① nên miễn phí · ② lý do: lợi cho cả xã hội — phải bàn cả lý do có đúng không"],
        ["Khẳng định + **hệ quả** (and this will / so)", "Governments should ban cars from city centres, **and this will** solve the problem of air pollution.", "① nên cấm · ② cấm thì **giải quyết được** ô nhiễm — “solve” là chữ rất mạnh"],
        ["Khẳng định + **so sánh** (rather than / better than)", "Public money should be spent on railways **rather than** roads.", "① chi cho đường sắt · ② **không** chi cho đường bộ — phải nói về cả hai"],
      ],
    },
    {
      t: "table",
      caption: "Chữ tuyệt đối và chữ so sánh — chỗ bám để “đồng ý một phần”",
      head: ["Chữ trong đề", "Nghĩa đề đang khẳng định", "Cách bám"],
      rows: [
        ["**the best / the most effective / the only** way", "không cách nào tốt bằng", "Đồng ý là cách **tốt**, nhưng không phải **tốt nhất / duy nhất** — nêu một cách khác hiệu quả hơn hoặc cần đi kèm"],
        ["**all / every / always / never**", "không có ngoại lệ", "Đúng với **đa số**, nêu một ngoại lệ có lý"],
        ["**A is better than B / A rather than B**", "chọn A, bỏ B", "Cần **tiêu chí so sánh chung** (chi phí? tốc độ? ai được lợi?) rồi mới kết luận"],
        ["**should be banned / must / completely**", "biện pháp cực đoan", "Đồng ý cần **hạn chế**, không đồng ý **cấm hẳn**"],
        ["**the main cause / mainly because**", "nguyên nhân số một", "Là **một** nguyên nhân, nhưng có nguyên nhân lớn hơn"],
      ],
    },
    {
      t: "p",
      text: "**Đề của bài hôm nay** (tự soạn, chủ đề chi tiêu công – giao thông):",
    },
    {
      t: "note",
      title: "📌 Đề bài — Writing Task 2",
      items: [
        "Some people believe that **the most effective way** for a government to reduce traffic congestion in cities is to make public transport **free of charge**, and that this would be **a better use of public money than** building new roads.",
        "**To what extent do you agree or disagree?**",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Mổ đề thành các vế",
      caption: "Hai vế, hai chữ bám. Một bài chỉ viết “free public transport is good” mới trả lời được nửa vế ①.",
      steps: [
        { label: "Chủ đề", sub: "giảm ùn tắc giao thông ở thành phố" },
        { label: "Vế ①: free public transport = **the most effective way**", sub: "chữ tuyệt đối: the most effective" },
        { label: "Vế ②: **a better use of public money than** new roads", sub: "chữ so sánh: better … than" },
        { label: "Câu hỏi", sub: "To what extent… ⇒ phải nói MỨC ĐỘ đồng ý" },
      ],
    },
    {
      t: "mcq",
      id: "t3d6-viet-dem-ve",
      title: "Đếm vế và tìm chữ bám (5 đề tự soạn)",
      items: [
        { q: "1. “The best way to improve public health is to increase the price of unhealthy food.” — Chữ nào là chỗ bám để đồng ý một phần?", options: ["A public health", "B The best way", "C increase the price", "D unhealthy food"], correct: 1, why: "**The best way** là chữ tuyệt đối: bạn có thể nói tăng giá **có ích** nhưng không phải cách **tốt nhất** (giáo dục, nhãn mác…)." },
        { q: "2. “Children should start learning a foreign language at primary school rather than secondary school, because young children learn languages more easily.” — Đề có mấy vế phải bàn?", options: ["A Một: nên học ngoại ngữ", "B Một: trẻ nhỏ học dễ hơn", "C Ba: tiểu học, trung học, đại học", "D Hai: nên bắt đầu ở tiểu học (thay vì trung học) + lý do trẻ nhỏ học dễ hơn"], correct: 3, why: "Khẳng định (primary rather than secondary) + **lý do** (because…). Phải bàn cả việc lý do đó có đúng / có đủ không." },
        { q: "3. “All young people should do a year of unpaid work for their community.” — Lập trường nào bám đúng chữ tuyệt đối?", options: ["A Việc tình nguyện có ích, nhưng không nên bắt buộc với TẤT CẢ", "B Việc tình nguyện rất tốt cho xã hội", "C Thanh niên ngày nay lười hơn trước", "D Cộng đồng cần nhiều tiền hơn"], correct: 0, why: "Chữ bám là **All** (và should = bắt buộc). A đồng ý với ý chung nhưng phản đối phần tuyệt đối. B chỉ nói chung chung, không trả lời “all”." },
        { q: "4. “Governments should spend money on railways rather than roads.” — Bài viết band 6 bắt buộc phải có gì?", options: ["A Lịch sử ngành đường sắt", "B Chỉ các lợi ích của đường sắt", "C Bàn về CẢ đường sắt lẫn đường bộ theo một tiêu chí so sánh", "D Một đoạn về hàng không"], correct: 2, why: "**rather than** = chọn A bỏ B ⇒ phải nói về cả hai. Chỉ khen đường sắt là sót nửa đề." },
        { q: "5. “Banning cars from city centres will solve the problem of air pollution.” — Chữ nào mạnh nhất, dễ phản biện nhất?", options: ["A cars", "B city centres", "C air pollution", "D will solve"], correct: 3, why: "**will solve** = giải quyết dứt điểm. Bạn có thể nói cấm xe sẽ **giảm** (reduce) chứ không **giải quyết hẳn** (nhà máy, sưởi ấm cũng gây ô nhiễm)." },
      ],
    },

    { t: "h", text: "3. Cùng một đề, hai lập trường ngược nhau" },
    {
      t: "p",
      text: "Không có lập trường “đúng”. Giám khảo chấm **độ rõ** và **độ nhất quán**. Bảng dưới cho thấy đề hôm nay viết được theo hai hướng ngược nhau; cả hai đều trả lời đủ hai vế vì đều bám vào **the most effective** và **better than**.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Đề giao thông miễn phí — hai lập trường",
      cols: [
        {
          title: "Lập trường A — đồng ý PHẦN LỚN (largely agree)",
          items: [
            "**Thesis**: miễn phí là cách dùng tiền **tốt hơn** xây đường (đồng ý vế ②), nhưng **chưa phải cách hiệu quả nhất** nếu đứng một mình (giới hạn vế ①)",
            "**Thân 1** (vế ②): đường mới hút thêm xe; tiền đó cho xe buýt, metro chở được nhiều người hơn",
            "**Thân 2** (vế ①): người ta lái xe vì **tiện**, không chỉ vì giá ⇒ miễn phí phải đi kèm tần suất, mạng lưới",
            "**Phản đề 1 câu**: đường mới giải toả được điểm nghẽn trước mắt — nhưng chỉ tạm thời",
          ],
        },
        {
          title: "Lập trường B — phản đối PHẦN LỚN (largely disagree)",
          items: [
            "**Thesis**: miễn phí **không** phải cách hiệu quả nhất (bác vế ①) và **chưa chắc** là cách dùng tiền tốt hơn (nghi ngờ vế ②)",
            "**Thân 1** (vế ①): thu phí vào trung tâm, làm việc từ xa hiệu quả hơn; miễn phí chủ yếu hút người **đi bộ, đi xe đạp** chứ không hút tài xế",
            "**Thân 2** (vế ②): mất tiền vé ⇒ thiếu tiền bảo trì ⇒ dịch vụ xuống cấp; vài tuyến đường vành đai là cần thiết cho xe tải",
            "**Phản đề 1 câu**: miễn phí giúp người thu nhập thấp — nhưng có thể trợ giá riêng cho họ",
          ],
        },
      ],
      caption: "Chọn hướng nào bạn có VÍ DỤ. Bài mẫu band 6 bên dưới viết theo lập trường A.",
    },

    { t: "h", text: "4. Thesis có mức độ" },
    {
      t: "p",
      text: "**Thesis** (câu luận điểm) là câu cuối của mở bài, trả lời thẳng câu hỏi của đề. Đề hỏi **To what extent** (tới mức nào) ⇒ thesis phải có **từ chỉ mức độ**. Thesis band 5 thường là “I agree with this opinion.” — không sai, nhưng không nói đồng ý với **vế nào** và **tới đâu**.",
    },
    {
      t: "table",
      caption: "Thang mức độ — chọn một bậc và giữ tới kết bài",
      head: ["Mức", "Cụm mở thesis", "Khi nào dùng"],
      rows: [
        ["100 % đồng ý", "I **completely / fully / strongly** agree that…", "Đồng ý mọi vế, kể cả chữ tuyệt đối. Vẫn nên có một câu phản đề"],
        ["~75 %", "I **largely / mostly** agree that…, **although**…", "Đồng ý ý chính, giới hạn một vế hoặc một chữ tuyệt đối"],
        ["~50 %", "I **partly** agree: **while** A, B", "Đồng ý vế này, phản đối vế kia"],
        ["~25 %", "I **largely disagree**; **although** A, B", "Phản đối ý chính, công nhận một điểm"],
        ["0 %", "I **completely / strongly** disagree that…", "Phản đối mọi vế"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I largely agree that + vế đồng ý, although I do not believe (that) + vế giới hạn",
          vi: "Thesis ~75 % — tách rõ phần đồng ý và phần giới hạn trong MỘT câu.",
          examples: [{ en: "I largely agree that free public transport is a better investment than new roads, although I do not believe it is the single most effective measure.", vi: "Tôi phần lớn đồng ý rằng giao thông công cộng miễn phí là khoản đầu tư tốt hơn đường mới, dù tôi không cho rằng đó là biện pháp hiệu quả nhất." }],
        },
        {
          formula: "While I accept that + điểm công nhận, I would argue that + ý chính của mình",
          vi: "Thesis ~50 % hoặc ~25 % — công nhận rồi nêu ý mình.",
          examples: [{ en: "While I accept that free buses would attract some drivers, I would argue that congestion charges are a far more effective solution.", vi: "Dù tôi công nhận xe buýt miễn phí sẽ hút được một số tài xế, tôi cho rằng thu phí ùn tắc là giải pháp hiệu quả hơn nhiều." }],
        },
        {
          formula: "I agree that + vế 1, but only if + điều kiện",
          vi: "Thesis có điều kiện — một cách khác để giới hạn chữ tuyệt đối.",
          examples: [{ en: "I agree that fares should be abolished, but only if services are made more frequent at the same time.", vi: "Tôi đồng ý nên bỏ tiền vé, nhưng chỉ khi dịch vụ đồng thời được tăng tần suất." }],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — 5 lỗi thesis làm tụt TR",
      items: [
        "Thesis **không có mức độ**: ~~I agree with this opinion.~~ — đề hỏi “to what extent” mà không trả lời “extent”.",
        "Thesis **hai mặt nhưng không chọn**: ~~This idea has both advantages and disadvantages.~~ — đây là câu của dạng Discussion / Advantages, không phải Opinion.",
        "Thesis **báo trước dàn ý** thay vì nêu ý kiến: ~~This essay will discuss this issue.~~ — không có lập trường.",
        "Mở bài nói largely agree, kết bài lại viết ~~I totally agree~~ ⇒ lập trường **không nhất quán**.",
        "Thesis nói partly agree nhưng **cả hai thân bài đều ủng hộ** ⇒ người chấm không thấy phần “disagree” đâu.",
      ],
    },
    {
      t: "rule",
      formula: "I largely agree that + vế đồng ý, although + vế giới hạn · While I accept that + A, I would argue that + B",
      vi: "Thesis band 6 = từ mức độ (completely / largely / partly) + nói rõ đồng ý VẾ NÀO, giới hạn VẾ NÀO.",
    },

    { t: "h", text: "5. Phản đề một câu (counter-argument)" },
    {
      t: "p",
      text: "**Phản đề** là ý của người **không đồng ý với bạn**. Nêu nó ra rồi **bác lại ngay** cho thấy bạn đã cân nhắc — đây là thứ đẩy TR từ “có ý kiến” lên “ý kiến đã được chống đỡ”. Ở band 6 chỉ cần **một câu ghép**: nửa đầu **nhượng bộ**, nửa sau **bác**. (Phản biện dài cả đoạn “nêu rồi bác” để dành Tập 4.)",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Admittedly, + S + V (ý ngược). However / Nevertheless, + S + V (bác lại)",
          vi: "Admittedly = “phải công nhận là”. Hai câu ngắn — an toàn nhất.",
          examples: [{ en: "Admittedly, new roads can relieve the worst bottlenecks in the short term. However, experience shows that they soon fill with additional cars.", vi: "Phải công nhận đường mới giải toả được các điểm nghẽn tệ nhất trước mắt. Tuy nhiên, thực tế cho thấy chúng sớm đầy thêm xe." }],
        },
        {
          formula: "Although / While + S + V (ý ngược), + S + V (bác lại)",
          vi: "Một câu phức — ăn luôn điểm GRA.",
          examples: [{ en: "Although free travel would cost the state a great deal, this money would otherwise be spent on roads that make the problem worse.", vi: "Dù đi lại miễn phí sẽ tốn của nhà nước rất nhiều, khoản tiền đó nếu không cũng bị chi cho những con đường làm vấn đề tệ hơn." }],
        },
        {
          formula: "It is true that + S + V, but + S + V",
          vi: "Dễ nhất; dùng khi chưa chắc Admittedly.",
          examples: [{ en: "It is true that some drivers will never give up their cars, but even a small shift would shorten queues at peak times.", vi: "Đúng là một số tài xế sẽ không bao giờ bỏ xe, nhưng chỉ một dịch chuyển nhỏ cũng rút ngắn hàng xe giờ cao điểm." }],
        },
        {
          formula: "Some people might argue that + S + V; in my view, however, + S + V",
          vi: "Nêu rõ đây là ý người khác.",
          examples: [{ en: "Some people might argue that roads are essential for the economy; in my view, however, goods can be moved more cheaply by rail.", vi: "Vài người có thể cho rằng đường bộ là thiết yếu cho kinh tế; tuy nhiên theo tôi, hàng hoá có thể chở bằng đường sắt rẻ hơn." }],
        },
      ],
    },
    {
      t: "table",
      caption: "Đặt phản đề ở đâu?",
      head: ["Vị trí", "Hợp khi", "Lưu ý"],
      rows: [
        ["**Cuối thân bài 1** (sau ví dụ)", "Phản đề nhằm vào ý của thân bài 1", "Câu bác lại = câu chốt đoạn"],
        ["**Đầu thân bài 2**", "Muốn dùng phản đề làm cầu nối sang ý thứ hai", "Câu bác lại = câu chủ đề của thân bài 2"],
        ["**Đầu kết bài** (Although…, I believe…)", "Bài ngắn, chưa kịp đặt ở thân bài", "Không thêm ý mới — chỉ nhắc ý đã bàn"],
        ["✗ Một đoạn riêng dài bằng thân bài", "—", "Biến bài thành **Discussion**; lập trường mờ đi"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: phản đề mà không bác = tự bắn vào chân",
      items: [
        "~~However, new roads are also important for the economy.~~ rồi sang ý khác ⇒ người chấm thấy bạn **vừa đổi ý**. Luôn có nửa sau: **but / however + lý do ý đó yếu hơn**.",
        "Ba cách bác: (a) chỉ đúng **ngắn hạn** · (b) chỉ đúng với **số ít** · (c) có **cách khác** đạt cùng lợi ích mà rẻ hơn.",
        "Sau **Although** không có **but**: ~~Although it is expensive, but it is effective.~~ (Tập 2 Ngày 17).",
      ],
    },
    {
      t: "rule",
      formula: "Admittedly, + ý ngược. However, + lý do ý đó yếu hơn · Although + ý ngược, + ý của mình",
      vi: "Phản đề band 6 = MỘT câu nhượng bộ + MỘT câu bác, đặt cuối thân bài 1 hoặc đầu thân bài 2.",
    },
    {
      t: "quiz",
      id: "t3d6-viet-thesis-dich",
      title: "Dịch sang tiếng Anh — thesis có mức độ và phản đề (4 câu)",
      kind: "translate",
      grammar: "I largely agree that…, although… · While I accept that…, I would argue that… · Admittedly, … However, … · Although…, …",
      items: [
        {
          q: "Tôi phần lớn đồng ý với quan điểm này, dù tôi không cho rằng đó là giải pháp duy nhất.",
          hint: "I largely agree with this view, although I do not believe (that) it is the only solution",
          answers: ["I largely agree with this view, although I do not believe it is the only solution.", "I largely agree with this view, although I do not believe that it is the only solution.", "I largely agree with this view, although I do not think it is the only solution.", "I largely agree with this view, although I don't believe it is the only solution.", "I largely agree with this view, although I don't think it is the only solution.", "I largely agree with this opinion, although I do not believe it is the only solution.", "I largely agree with this opinion, although I do not think it is the only solution.", "I largely agree with this view, though I do not believe it is the only solution.", "I mostly agree with this view, although I do not believe it is the only solution.", "I largely agree with this idea, although I do not believe it is the only solution.", "I largely agree with this view although I do not believe it is the only solution."],
        },
        {
          q: "Dù tôi công nhận rằng thuế cao không được ưa chuộng, tôi cho rằng chúng là cần thiết.",
          hint: "While I accept that high taxes are unpopular, I would argue that they are necessary",
          answers: ["While I accept that high taxes are unpopular, I would argue that they are necessary.", "While I accept that high taxes are not popular, I would argue that they are necessary.", "Although I accept that high taxes are unpopular, I would argue that they are necessary.", "Although I accept that high taxes are not popular, I would argue that they are necessary.", "While I accept that high taxes are unpopular, I believe that they are necessary.", "While I accept that high taxes are unpopular, I would argue they are necessary.", "While I accept that high taxes are unpopular, I believe they are necessary."],
        },
        {
          q: "Phải công nhận, xây đường tạo ra việc làm. Tuy nhiên, những việc làm này chỉ là tạm thời.",
          hint: "Admittedly, building roads creates jobs. However, these jobs are only temporary",
          answers: ["Admittedly, building roads creates jobs. However, these jobs are only temporary.", "Admittedly, road building creates jobs. However, these jobs are only temporary.", "Admittedly, building roads creates jobs. However, these jobs are temporary.", "Admittedly, building roads creates jobs. Nevertheless, these jobs are only temporary.", "Admittedly, building roads creates employment. However, these jobs are only temporary.", "Admittedly, building roads creates jobs. However, such jobs are only temporary.", "Admittedly, road construction creates jobs. However, these jobs are only temporary."],
        },
        {
          q: "Dù chính sách này tốn kém, nó sẽ tự hoàn vốn về lâu dài.",
          hint: "Although this policy is expensive / costly, it will pay for itself in the long term",
          answers: ["Although this policy is expensive, it will pay for itself in the long term.", "Although this policy is costly, it will pay for itself in the long term.", "Although the policy is expensive, it will pay for itself in the long term.", "Although the policy is costly, it will pay for itself in the long term.", "Although this policy is expensive, it will pay for itself in the long run.", "Although this policy is costly, it will pay for itself in the long run.", "While this policy is expensive, it will pay for itself in the long term.", "While this policy is costly, it will pay for itself in the long term.", "Though this policy is expensive, it will pay for itself in the long term."],
        },
      ],
    },

    { t: "h", text: "6. Dàn ý 5 phút cho lập trường A" },
    {
      t: "table",
      caption: "Dàn ý — mỗi dòng ghi rõ trả lời VẾ nào",
      head: ["Đoạn", "Việc", "Ghi chú dàn ý (viết tắt, tiếng Anh)"],
      rows: [
        ["Mở bài (2 câu)", "paraphrase đề + thesis có mức độ", "congestion → how to spend limited funds · largely agree: better than roads, but not most effective alone"],
        ["Thân bài 1 — **vế ②**", "vì sao tốt hơn xây đường", "new roads → more cars within few yrs · same money → buses carry far more people/hour · eg ring road in my city: jams back after 3 yrs · CONCESSION: roads ease bottlenecks short-term → however temporary"],
        ["Thân bài 2 — **vế ①**", "vì sao chưa phải “hiệu quả nhất”", "people drive for convenience, not only cost · free but slow/crowded bus won't attract drivers · needs frequency + bus lanes · so free fares = part of package"],
        ["Kết bài (2 câu)", "nhắc lại đúng mức độ + tóm lý do", "wiser investment than roads; works best combined with better services"],
      ],
    },

    { t: "h", text: "7. Hai bài mẫu cùng một đề — band 5 và band 6 (ước tính)" },
    {
      t: "p",
      text: "Đọc **bài band 5 trước**. Nó không tệ: đủ 4 đoạn, đủ 250 từ, có ý kiến. Hãy tự tìm vì sao nó chỉ được 5, rồi mới đọc bài band 6 và bảng so sánh.",
    },
    {
      t: "passage",
      title: "Bài mẫu band 5 (ước tính) — 274 từ",
      intro: "Lỗi được giữ nguyên có chủ ý. Đừng học thuộc bài này.",
      paras: [
        { label: "1", text: "Nowadays, traffic jam is a big problem in many cities in the world. Some people think that government should make public transport free and should not build new roads. I agree with this opinion." },
        { label: "2", text: "Firstly, free public transport can reduce traffic jam. If bus and train are free, many people will use them and they will not use their cars. For example, in my city many students go to school by bus because the ticket is cheap. Moreover, people can save a lot of money when they do not pay for ticket. They can use this money to buy other things for their family. Furthermore, it is good for environment because less cars on the road mean less pollution, and pollution is a big problem in big cities now." },
        { label: "3", text: "Secondly, building new roads is very expensive. Government must spend a lot of money to build roads and it take many years to finish. Moreover, when there are more roads, people will buy more cars and the traffic jam will come back again. So building new roads is not a good idea. However, some people think that roads are very important for economy because trucks need roads to carry goods. In addition, free public transport is also good for poor people because they do not have money to buy car." },
        { label: "4", text: "In conclusion, traffic jam is a big problem and government should make public transport free. I think this is the best way to solve this problem and it has many advantages for people and for environment. Government should do it as soon as possible so that people can have a better life in the future." },
      ],
    },
    {
      t: "passage",
      title: "Bài mẫu band 6 – 6.5 (ước tính) — 312 từ",
      intro: "Viết theo lập trường A (largely agree). Tìm: thesis có mức độ · câu chủ đề nói rõ vế · câu phản đề · kết bài giữ đúng mức độ.",
      paras: [
        { label: "1", text: "Traffic congestion is a daily problem in most large cities, and governments have to decide how to spend limited public funds on solving it. I largely agree that making public transport free would be a better investment than building new roads, although I do not believe it is the single most effective measure." },
        { label: "2", text: "The main reason why free transport is a wiser use of taxpayers' money is that new roads rarely reduce congestion for long. When a road is widened, driving becomes easier, so more people choose to travel by car and the extra space is soon filled. In my city, for example, a ring road that opened a few years ago was already crowded at peak times within three years. If the same budget were allocated to buses and trains, it could move far more passengers every hour. Admittedly, new roads can relieve the worst bottlenecks in the short term. However, this benefit is temporary, while the cost to the state is permanent." },
        { label: "3", text: "Nevertheless, I think it is an exaggeration to call free fares the most effective solution. Most drivers do not choose their cars because bus tickets are expensive, but because driving is faster and more convenient. A free bus that comes every forty minutes and is stuck in the same traffic will not persuade them to change. Free travel therefore needs to be combined with more frequent services and separate bus lanes. Without these improvements, the policy would mainly attract people who already walk or cycle, and the number of cars on the road would hardly fall." },
        { label: "4", text: "In conclusion, I believe that abolishing fares is a better way to spend public money than building roads, which tend to make the problem worse in the long term. However, it will only reduce congestion significantly if it is part of a wider plan to make public transport quicker and more reliable." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao 5, vì sao 6 — so theo bốn tiêu chí",
      head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
      rows: [
        ["**TR** · vế ① “the most effective”", "Không bàn. Kết bài tự nhận “the best way” mà không chứng minh", "Cả **thân bài 2** bàn đúng chữ này: “an exaggeration to call free fares the most effective solution”"],
        ["**TR** · vế ② “better than roads”", "Có nói đường đắt, nhưng **không so sánh** hai cách tiêu cùng một khoản tiền", "Thân bài 1 so trực tiếp: “If the same budget were allocated to buses and trains…”"],
        ["**TR** · lập trường", "“I agree” — không mức độ. Thân bài 3 nêu ý ngược (“roads are important for economy”) rồi **bỏ lửng**", "“I **largely** agree…, **although**…” ở mở bài; kết bài giữ đúng: “a better way…, **however, it will only**…”"],
        ["**TR** · ý lạc đề", "Tiết kiệm tiền mua đồ, môi trường, người nghèo — **không trả lời** câu hỏi về ùn tắc", "Mọi câu đều nối về congestion hoặc public money"],
        ["**CC** · từ nối", "Firstly · Moreover · Furthermore · Secondly · Moreover · In addition — máy móc, mỗi đoạn 3–4 ý rời", "Mỗi đoạn **một ý**; nối bằng **this benefit, these improvements, therefore, Nevertheless**"],
        ["**CC** · câu chủ đề", "“Firstly, free public transport can reduce traffic jam.” — không báo đoạn bàn vế nào", "“The main reason why free transport is a wiser use of taxpayers' money is that…” — đọc là biết bàn vế ②"],
        ["**LR**", "traffic jam × 4 · big problem × 3 · good × 3; sai: ~~less cars~~, ~~traffic jam is~~ (cần a / jams)", "congestion · bottlenecks · peak times · taxpayers' money · allocated to · abolishing fares · persuade — có paraphrase (free of charge → free fares → abolishing fares)"],
        ["**GRA**", "Câu đơn và if loại 1 là chính; lỗi mạo từ (~~government should~~, ~~for environment~~, ~~buy car~~), chia động từ (~~it take~~)", "Trộn: mệnh đề quan hệ (a ring road **that**…, roads, **which** tend…), điều kiện loại 2 (If the same budget **were**…, it **could**…), not… but…, bị động. Hầu như không lỗi"],
        ["Phản đề", "Có nêu, **không bác** ⇒ lập trường lung lay", "“Admittedly, … However, this benefit is temporary…” — nêu và bác trong hai câu"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: bảy thứ bạn mượn được từ bài band 6",
      items: [
        "Mở bài câu 1: **nêu bối cảnh bằng chính vấn đề của đề** (governments have to decide how to spend limited public funds) — không cần “Nowadays… in the world”.",
        "Thesis: **I largely agree that A, although I do not believe B.**",
        "Câu chủ đề thân 1: **The main reason why A is that…**",
        "So sánh hai cách tiêu tiền: **If the same budget were allocated to X, it could…** (điều kiện loại 2 — học kỹ ở Ngày 15; hôm nay dùng như một khung).",
        "Phản đề: **Admittedly, … However, this benefit is temporary, while the cost is permanent.**",
        "Câu chủ đề thân 2: **Nevertheless, I think it is an exaggeration to call X the most effective solution.**",
        "Kết bài: **In conclusion, I believe that A. However, it will only … if …** — nhắc lại cả phần đồng ý lẫn phần giới hạn.",
      ],
    },
    {
      t: "quiz",
      id: "t3d6-viet-dien-mau",
      title: "Gập bài mẫu band 6 lại — điền từ còn thiếu (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "1. I ___ agree that making public transport free would be a better investment… (phần lớn)", answers: ["largely", "mostly"] },
        { q: "2. …, ___ I do not believe it is the single most effective measure.", answers: ["although", "though"] },
        { q: "3. The main reason ___ free transport is a wiser use of taxpayers' money is that…", answers: ["why"] },
        { q: "4. If the same budget were ___ to buses and trains, it could move far more passengers. (phân bổ)", answers: ["allocated"] },
        { q: "5. ___, new roads can relieve the worst bottlenecks in the short term. (phải công nhận)", answers: ["Admittedly", "admittedly"] },
        { q: "6. However, this benefit is temporary, ___ the cost to the state is permanent.", answers: ["while", "whereas"] },
        { q: "7. Nevertheless, I think it is an ___ to call free fares the most effective solution. (sự nói quá)", answers: ["exaggeration"] },
        { q: "8. It will only reduce congestion significantly ___ it is part of a wider plan.", answers: ["if"] },
      ],
    },

    { t: "h", text: "8. Sửa bài band 5 thành band 6 — ba chỗ" },
    {
      t: "table",
      caption: "Trước → sau (cùng ý, khác cách viết)",
      head: ["Chỗ", "Band 5", "Sửa thành band 6", "Đã sửa gì"],
      rows: [
        ["Thesis", "I agree with this opinion.", "I largely agree that free transport is a better use of public money than new roads, although it is not the most effective measure on its own.", "thêm mức độ + nói rõ từng vế"],
        ["Phản đề bỏ lửng", "However, some people think that roads are very important for economy because trucks need roads to carry goods.", "Admittedly, roads are important for the economy because lorries need them to carry goods. However, most congestion is caused by private cars, not by lorries.", "thêm nửa bác lại + sửa mạo từ"],
        ["Ý lạc đề", "Moreover, people can save a lot of money… They can use this money to buy other things for their family.", "(xoá) — thay bằng: This would encourage drivers to leave their cars at home, which would reduce the number of vehicles at peak times.", "mọi câu phải nối về congestion"],
      ],
    },
    {
      t: "mcq",
      id: "t3d6-viet-nhan-dien",
      title: "Nhận diện: câu nào đạt mức band 6? (6 câu)",
      items: [
        { q: "1. Thesis nào trả lời đúng “To what extent…?”", options: ["A This essay will discuss both sides of this issue.", "B I agree.", "C I partly agree: while taxes on unhealthy food can change habits, they are not the best way to improve public health.", "D There are many advantages and disadvantages of this idea."], correct: 2, why: "C có **mức độ** (partly) và nói rõ đồng ý phần nào, phản đối chữ tuyệt đối nào (the best way)." },
        { q: "2. Câu nào là phản đề ĐÃ được bác?", options: ["A However, cars are also very convenient.", "B Admittedly, cars are convenient; however, this convenience disappears when everyone is stuck in traffic.", "C Some people think cars are convenient.", "D Cars are convenient and public transport is cheap."], correct: 1, why: "B có đủ hai nửa: nhượng bộ + bác. A, C nêu ý ngược rồi bỏ lửng." },
        { q: "3. Mở bài viết “I largely agree”. Câu kết nào NHẤT QUÁN?", options: ["A In conclusion, I totally agree with this statement.", "B In conclusion, both views have their own merits.", "C In conclusion, it is difficult to say which view is right.", "D In conclusion, I believe the policy is mostly right, although it needs to be combined with other measures."], correct: 3, why: "largely agree ↔ mostly right, although… A đổi thành totally; B, C bỏ lập trường." },
        { q: "4. Câu chủ đề nào cho biết đoạn bàn vế “the most effective way”?", options: ["A Firstly, free transport has many benefits.", "B Secondly, there are some other ideas.", "C However, I doubt that free travel alone is the most effective way to cut congestion.", "D Moreover, the environment is also important."], correct: 2, why: "C nhắc lại đúng chữ của vế ① và nêu thái độ (I doubt). A, B, D không báo vế nào." },
        { q: "5. Câu nào dùng từ nối KHÔNG máy móc?", options: ["A Moreover, it is cheap. Furthermore, it is fast. In addition, it is clean.", "B This benefit, however, is only temporary.", "C Firstly, secondly, thirdly, there are three reasons.", "D Besides, and also, it is good."], correct: 1, why: "B nối bằng **this benefit** (chỉ ngược lại ý trước) + however đặt giữa câu. A, C, D là chuỗi từ nối xếp hàng." },
        { q: "6. Đề: “The only way to reduce crime is to put more police on the streets.” Lập trường nào bám chữ tuyệt đối?", options: ["A More police officers would help, but education and jobs are equally important, so it is not the only way.", "B Crime is a serious problem in many countries.", "C Police officers have a difficult job.", "D I agree because the police are important."], correct: 0, why: "Chữ bám là **The only way**. A công nhận rồi phản đối đúng chữ đó." },
      ],
    },

    { t: "h", text: "9. Lỗi mất điểm ở Opinion band 5 → 6" },
    {
      t: "note",
      title: "Cẩn thận — 7 lỗi hay gặp",
      items: [
        "**Sót vế**: chỉ viết về nửa đầu của đề. Cách chữa: gạch chân từng vế, ghi số ①②, mỗi vế phải có **ít nhất 3 câu** trong bài.",
        "**Viết thành Discussion**: thân 1 “some people think…”, thân 2 “other people think…”, kết mới nêu ý kiến. Đề Opinion cần ý kiến **từ mở bài**.",
        "**Ngồi trên hàng rào**: “both are important”. Partly agree vẫn phải nói rõ **phần nào hơn**.",
        "**Ví dụ bịa số liệu**: ~~According to a 2019 Oxford study, 73%…~~ — không cần; ví dụ từ thành phố của bạn là đủ và thật hơn.",
        "**Kết bài thêm ý mới** hoặc kêu gọi chung chung (~~Government should do it as soon as possible~~).",
        "**Chuỗi từ nối** Firstly / Moreover / Furthermore ở đầu mọi câu — descriptor band 5 gọi tên đúng lỗi này (overuse).",
        "**Dưới 250 từ** ⇒ bị trừ TR. Bài band 6 an toàn ở **270–300 từ**.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "40 phút cho Task 2 — phân giờ band 6",
      caption: "Ba phút đầu quyết định TR. Bốn phút cuối cứu GRA và LR.",
      steps: [
        { label: "3′ — mổ đề", sub: "gạch vế ①②, khoanh chữ tuyệt đối, chọn mức độ" },
        { label: "4′ — dàn ý", sub: "mỗi thân bài ghi rõ vế + 1 ví dụ + chỗ đặt phản đề" },
        { label: "29′ — viết", sub: "mở 2 câu · thân 2 × 6 câu · kết 2 câu" },
        { label: "4′ — soát", sub: "thesis ↔ kết bài cùng mức độ? mạo từ, chia động từ, số ít/nhiều" },
      ],
    },

    { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí" },
    {
      t: "p",
      text: "**Đề mới** (tự soạn, kiểu khẳng định + lý do). Trước khi viết, làm trên giấy: (1) gạch hai vế; (2) khoanh chữ tuyệt đối; (3) viết **hai thesis ngược nhau**, chọn một; (4) viết sẵn câu phản đề.",
    },
    {
      t: "essay",
      id: "t3d6-viet-bai",
      task: "Task 2",
      prompt: "Some people believe that the best way for a government to improve public health is to impose high taxes on unhealthy food, because higher prices are the only thing that really changes what people eat. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Đề có **hai vế**: ① đánh thuế cao = **the best way** để cải thiện sức khoẻ cộng đồng; ② lý do: giá cao là **the only thing** thay đổi thói quen ăn. Bàn **cả hai**.",
        "Thesis có **mức độ**: I largely / partly agree that…, although… — và **kết bài giữ đúng mức đó**.",
        "Mỗi câu chủ đề nói rõ đoạn bàn **vế nào**. Mỗi thân bài **một ý** phát triển theo P-E-E (Tập 2 Ngày 2).",
        "Đúng **một** phản đề, có bác: Admittedly, … However, … (cuối thân bài 1 hoặc đầu thân bài 2).",
        "Dùng từ bài 1: **impose a tax on · tax revenue · allocate … to · public health campaigns · subsidise (healthy food) · in the long term · taxpayers' money**.",
        "270–300 từ; soát mạo từ (**the government / governments**), **fewer** + danh từ đếm được, chia động từ ngôi ba.",
      ],
    },
    {
      t: "note",
      title: "Sau khi AI chấm — ghi sổ lỗi (Tập 3 Ngày 2)",
      items: [
        "TR < 6: kiểm lại bạn đã bàn vế ② (**the only thing**) chưa — đây là vế người viết hay quên nhất.",
        "CC < 6: đếm số Firstly / Moreover / Furthermore; thay một nửa bằng **this / such / these + danh từ**.",
        "Viết lại **đoạn yếu nhất** (không cần cả bài) và nộp lại. Ghi vào **Sổ lỗi theo mã** (Ngày 2 · Viết mục 6): câu sai · mã lỗi (A/S/T/P/W/L/C/I) · câu sửa · quy tắc tự viết.",
        "Hôm sau: **tái tạo bài mẫu band 6** của mục 7 từ dàn ý ở mục 6, không nhìn bài (kỹ thuật Tập 2 Ngày 6 · Ngày 10).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T3D6_NOI: Lesson = {
  id: "t3d6-noi",
  kind: "speaking",
  title: "Nói: Part 3 “Why do you think…?” — hai lý do + ví dụ",
  goal: "Trả lời câu hỏi Part 3 dạng “Why do you think…?” trong 30–45 giây theo khung báo trước hai lý do → lý do 1 + ví dụ → lý do 2 + ví dụ → chốt, tìm được lý do nhanh bằng bảng góc nhìn và bảng trục chia nhóm, và đọc rõ ba nguyên âm /ɔː/ /ɒ/ /əʊ/ — mức Speaking band 6.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 13 bạn đã có khung Part 3 nhập môn: **Ý kiến → Lý do → Ví dụ (→ Nhượng bộ)**. Hôm nay đào sâu **một loại câu hỏi**: ==Why do you think…?== — loại gặp nhiều nhất trong Part 3.",
        "Band 5 trả lời “why” bằng **một lý do, một câu**. Band 6: **“sẵn lòng nói dài”** — hai lý do, mỗi lý do có **giải thích hoặc ví dụ**, và một câu chốt.",
        "Hết ý? Dùng ==bảng góc nhìn== (Tập 2 Ngày 13 đã có bản nhập môn; hôm nay đủ 6 góc: kinh tế · xã hội · tâm lý · công nghệ · giáo dục · thực tế) để **tìm** lý do, và ==bảng trục chia nhóm== (tuổi · thu nhập · vùng) để **tách** câu trả lời theo nhóm người.",
        "Ngôn ngữ nguyên nhân ngoài **because**: That's mainly because… · One reason is that… · It has a lot to do with… · This is partly down to… · which means…",
        "So hai câu trả lời **band 5 và band 6** cho cùng một câu hỏi, theo FC · LR · GRA · P.",
        "🔊 Phát âm: **/ɔː/ – /ɒ/ – /əʊ/** (law · lot · low) — khối luyện có máy chấm.",
      ],
    },

    { t: "h", text: "1. Câu hỏi “Why” trong Part 3 trông thế nào?" },
    {
      t: "p",
      text: "Part 3 kéo dài **4–5 phút**, giám khảo hỏi các câu **trừu tượng về xã hội** nối với chủ đề Part 2. Câu “why” yêu cầu bạn **giải thích nguyên nhân của một hiện tượng** — không phải kể chuyện của mình. Nó xuất hiện dưới nhiều vỏ khác nhau:",
    },
    {
      t: "table",
      caption: "Sáu cách giám khảo hỏi “vì sao”",
      head: ["Câu hỏi", "Nghĩa", "Mở đầu hợp"],
      rows: [
        ["**Why do you think** people…?", "Theo bạn vì sao…", "I think there are a couple of reasons."],
        ["**Why is it that** …?", "Vì sao lại…", "Well, I'd say it's mainly because…"],
        ["**What are the reasons for** …?", "Nguyên nhân của… là gì", "There are probably two main reasons."],
        ["**What makes** people + V?", "Điều gì khiến…", "I think what really makes them… is…"],
        ["**How come** …? (thân mật)", "Sao mà…", "That's a good question. I suppose…"],
        ["**Why do some people… while others…?**", "Vì sao người này… người kia…", "I think it depends on… (→ mục 5)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: “Why do you think…?” không hỏi về BẠN",
      items: [
        "Giám khảo hỏi: “Why do you think **people** avoid paying taxes?” — chủ ngữ của câu trả lời là **people / many people / most taxpayers**, không phải **I**.",
        "Trả lời ~~Because I don't like tax~~ là trả lời câu hỏi Part 1. Ví dụ cá nhân được dùng, nhưng chỉ để **minh hoạ** một nhận định chung.",
        "**do you think** chỉ là cách hỏi lịch sự — đừng trả lời “Yes, I think”.",
      ],
    },

    { t: "h", text: "2. Khung trả lời: báo trước → lý do 1 + ví dụ → lý do 2 + ví dụ → chốt" },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung 2 lý do (30–45 giây, 5–7 câu)",
      caption: "Báo trước “hai lý do” mua cho bạn 3 giây nghĩ và cho giám khảo thấy bài nói có tổ chức (FC).",
      steps: [
        { label: "① Báo trước", sub: "I think there are two main reasons." },
        { label: "② Lý do 1", sub: "The first / main one is that…" },
        { label: "③ Giải thích / ví dụ 1", sub: "For example, … / What I mean is…" },
        { label: "④ Lý do 2", sub: "Another reason is that… / On top of that, …" },
        { label: "⑤ Ví dụ 2", sub: "In my city, for instance, …" },
        { label: "⑥ Chốt", sub: "So I'd say it's a mix of… / So basically…" },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I think there are a couple of / two main reasons (for this).",
          vi: "① Báo trước. a couple of = hai, vài — tự nhiên hơn two khi nói.",
          examples: [{ en: "I think there are a couple of reasons why people don't trust politicians.", vi: "Tôi nghĩ có vài lý do khiến người ta không tin chính trị gia." }],
        },
        {
          formula: "The main one is (probably) that + S + V",
          vi: "② Lý do 1 — probably làm câu mềm, đúng kiểu Part 3.",
          examples: [{ en: "The main one is probably that people can't see where their money goes.", vi: "Lý do chính có lẽ là người ta không thấy tiền của mình đi đâu." }],
        },
        {
          formula: "For example, if + S + V, S + V / Take + N, for instance.",
          vi: "③ Ví dụ bằng một tình huống giả định (if) hoặc một trường hợp cụ thể (Take…).",
          examples: [
            { en: "For example, if you pay a lot of tax but the roads are still full of holes, you feel the money is being wasted.", vi: "Ví dụ, nếu bạn đóng nhiều thuế mà đường vẫn đầy ổ gà, bạn thấy tiền bị lãng phí." },
            { en: "Take my hometown, for instance. The new bridge took ten years to build.", vi: "Lấy quê tôi làm ví dụ. Cây cầu mới xây mất mười năm." },
          ],
        },
        {
          formula: "Another reason is that + S + V · On top of that, + S + V",
          vi: "④ Lý do 2.",
          examples: [{ en: "Another reason is that tax feels unfair to some people.", vi: "Một lý do nữa là thuế có vẻ bất công với một số người." }],
        },
        {
          formula: "So I'd say it's less about + N + and more about + N",
          vi: "⑥ Chốt bằng một nhận định gọn — không lặp lại nguyên văn hai lý do.",
          examples: [{ en: "So I'd say it's less about the money itself and more about trust.", vi: "Nên tôi cho rằng vấn đề không hẳn là tiền mà là lòng tin." }],
        },
      ],
    },
    {
      t: "rule",
      formula: "There are a couple of reasons. The main one is that… For example, … Another reason is that… So I'd say…",
      vi: "Khung “Why” band 6: báo trước → 2 lý do, mỗi lý do có ví dụ → một câu chốt. 30–45 giây.",
    },

    { t: "h", text: "3. Ngôn ngữ nguyên nhân — đừng chỉ có because" },
    {
      t: "table",
      caption: "Mười cách nói nguyên nhân khi nói",
      head: ["Cụm", "Theo sau là", "Ví dụ"],
      rows: [
        ["**because / since / as**", "mệnh đề (S + V)", "People drive **because** buses are unreliable."],
        ["**because of / due to**", "danh từ / V-ing", "Fewer people vote **because of** a lack of trust."],
        ["**That's mainly because**", "mệnh đề", "**That's mainly because** rents have gone up so much."],
        ["**One reason is that**", "mệnh đề", "**One reason is that** young people move to cities for work."],
        ["**It has a lot to do with**", "danh từ / V-ing", "**It has a lot to do with** social media."],
        ["**This is partly down to**", "danh từ", "**This is partly down to** the cost of living."],
        ["**thanks to** (kết quả tốt)", "danh từ", "**Thanks to** online banking, paying bills is easier."],
        ["**…, which means (that)**", "mệnh đề — nói hệ quả", "Salaries are low, **which means** people can't save."],
        ["**…, so / that's why**", "mệnh đề — nói hệ quả", "They feel ignored, **and that's why** they don't vote."],
        ["**The thing is, …**", "mệnh đề — mở lời giải thích", "**The thing is,** nobody explains how the budget is spent."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi nói nguyên nhân",
      items: [
        "**because of + mệnh đề**: ~~because of they are busy~~ → **because** they are busy / **because of** their busy lives.",
        "**The reason is because…**: thừa. → **The reason is that**…",
        "**due to + mệnh đề**: ~~due to the price is high~~ → **due to** the high price.",
        "Mở đầu mọi câu trả lời bằng **Because…**: nghe cụt. Mở bằng **I think it's mainly because…** hoặc khung báo trước.",
        "Lặp **because** 4–5 lần trong một câu trả lời — giám khảo nghe là lỗi LR. Luân phiên ít nhất **ba** cụm khác nhau.",
        "Dùng **so** và **because** trong cùng một câu: ~~Because it is expensive, so people don't buy it.~~ (Tập 2 Ngày 17).",
      ],
    },

    { t: "h", text: "4. Bí lý do? Bảng góc nhìn" },
    {
      t: "p",
      text: "Người học thường không thiếu tiếng Anh mà **thiếu ý**. Một hiện tượng xã hội nào cũng có thể giải thích từ vài **góc nhìn** cố định. Tập 2 Ngày 13 đã cho bạn bảng góc nhìn mức nhập (tiền bạc · quan hệ · cảm xúc…); hôm nay là bản đủ sáu góc cho Part 3. Thuộc bảng này, bạn chỉ việc quét qua các góc và **chọn hai** góc mình có ví dụ.",
    },
    {
      t: "table",
      caption: "Bảng góc nhìn — 6 góc để tìm lý do",
      head: ["Góc nhìn", "Câu tự hỏi", "Từ mở", "Ví dụ: Why do fewer young people vote?"],
      rows: [
        ["**Kinh tế** (economic)", "Có liên quan tới tiền, giá, việc làm?", "Financially, … / From an economic point of view", "They're busy working two jobs, so politics is not a priority."],
        ["**Xã hội** (social)", "Gia đình, bạn bè, cộng đồng ảnh hưởng thế nào?", "Socially, … / There's a lot of pressure to…", "None of their friends vote, so it doesn't feel normal."],
        ["**Tâm lý** (psychological)", "Người ta cảm thấy gì: sợ, chán, tin, tự hào?", "People tend to feel that…", "They feel that one vote won't change anything."],
        ["**Công nghệ** (technological)", "Mạng, điện thoại, AI đã đổi điều gì?", "Thanks to / Because of technology, …", "They get news from short videos, which rarely explain policies."],
        ["**Giáo dục** (educational)", "Người ta có được dạy / được biết không?", "Schools don't really teach…", "Nobody explains at school how the system works."],
        ["**Thực tế – tiện lợi** (practical)", "Có khó, xa, mất thời gian không?", "On a practical level, …", "You have to go back to your hometown to vote, which costs time."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Thêm một cặp góc nhìn: cá nhân ↔ xã hội",
      cols: [
        { title: "Mức cá nhân (individual)", items: ["Lợi / hại cho **từng người**: thời gian, tiền, sức khoẻ, cảm xúc", "Mở: **For individuals,** … / **On a personal level,** …", "vd: For individuals, paying less tax means more money to spend."] },
        { title: "Mức xã hội (society)", items: ["Lợi / hại cho **cả cộng đồng**: kinh tế, bất bình đẳng, môi trường", "Mở: **For society as a whole,** … / **On a wider scale,** …", "vd: For society as a whole, lower taxes mean worse public services."] },
      ],
      caption: "Một lý do ở mức cá nhân + một lý do ở mức xã hội = câu trả lời hai lý do không trùng nhau.",
    },
    {
      t: "note",
      title: "Mẹo: 3 giây để chọn góc",
      items: [
        "Trong lúc nói câu báo trước (“I think there are a couple of reasons…”), quét nhanh: **tiền? cảm xúc? tiện lợi?** — ba góc này gần như luôn dùng được.",
        "Chọn hai góc **khác loại** (vd kinh tế + tâm lý) để hai lý do không lặp ý.",
        "Không cần nói tên góc nhìn ra miệng. Bảng này là để **nghĩ**, không phải để đọc.",
      ],
    },

    { t: "h", text: "5. “It depends” có tổ chức: bảng trục chia nhóm" },
    {
      t: "p",
      text: "Nhiều câu “why” không có một lý do chung cho mọi người. Khi đó câu trả lời band 6 **tách theo nhóm**: “với người trẻ thì…, còn với người lớn tuổi thì…”. Tập 2 Ngày 1 đã cho bạn “It depends” mức nhập; hôm nay là bảng trục đầy đủ.",
    },
    {
      t: "table",
      caption: "Bảng trục chia nhóm — chọn MỘT trục cho mỗi câu trả lời",
      head: ["Trục", "Hai đầu", "Khung câu"],
      rows: [
        ["**Tuổi** (age)", "young people ↔ older people / the older generation", "**For younger people**, it's mostly about…, **whereas older people** tend to…"],
        ["**Thu nhập** (income)", "people on low incomes ↔ better-off / wealthy families", "**People on low incomes** simply can't afford…, **while those who are better off**…"],
        ["**Vùng** (area)", "people in big cities ↔ people in rural areas / the countryside", "**In big cities**…, **but in rural areas** the situation is quite different."],
        ["**Nghề / hoàn cảnh**", "students ↔ working adults · parents ↔ single people", "**For students**…, **but once you start working**…"],
        ["**Thời** (ôn Tập 2 Ngày 21)", "in the past ↔ nowadays", "**In the past**…, **whereas nowadays**…"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I think it depends on + N (age / income / where they live). For + nhóm A, … , whereas / while + nhóm B + …",
          vi: "Khung tách nhóm. whereas / while nối hai nhóm trong một câu phức (GRA).",
          examples: [
            { en: "I think it depends on age. For younger people, it's mostly about cost, whereas older people tend to care more about comfort.", vi: "Tôi nghĩ tuỳ vào tuổi. Với người trẻ, chủ yếu là chi phí, còn người lớn tuổi thường quan tâm sự thoải mái hơn." },
            { en: "It varies from place to place. In big cities people rely on public transport, while in rural areas a motorbike is essential.", vi: "Mỗi nơi một khác. Ở thành phố lớn người ta dựa vào giao thông công cộng, còn ở nông thôn xe máy là thiết yếu." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "It depends on + trục. For + nhóm A, …, whereas + nhóm B + …",
      vi: "Khi không có lý do chung: chọn một trục (tuổi / thu nhập / vùng) và nói một lý do cho mỗi đầu.",
    },
    {
      t: "note",
      title: "Cẩn thận với “It depends”",
      items: [
        "Nói ~~It depends.~~ rồi dừng = né câu hỏi. Luôn nói **depends on what** và nói tiếp cả hai trường hợp.",
        "**depend on** (không phải ~~depend of / depend to~~); **It depends on whether**… + mệnh đề.",
        "Chỉ **một trục** mỗi câu trả lời. Trộn tuổi + thu nhập + vùng trong 40 giây thì rối.",
      ],
    },

    { t: "h", text: "6. Band 5 và band 6: cùng một câu hỏi" },
    {
      t: "p",
      text: "Câu hỏi: **“Why do you think some people don't like paying taxes?”** Nghe / đọc câu trả lời band 5 trước, tự tìm ba thứ còn thiếu, rồi đọc band 6.",
    },
    {
      t: "dialogue",
      title: "Câu trả lời band 5 (ước tính) — 31 từ, khoảng 15 giây",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do you think some people don't like paying taxes?", vi: "Theo bạn vì sao một số người không thích đóng thuế?" },
        { who: "Candidate", role: "candidate", text: "Because they don't want to lose money. Tax is very high in my country. And, er, they think government don't use money well. So they don't like to pay tax. Yes.", vi: "Vì họ không muốn mất tiền. Thuế ở nước tôi rất cao. Và, ờ, họ nghĩ chính phủ không dùng tiền tốt. Nên họ không thích đóng thuế. Vâng." },
      ],
    },
    {
      t: "dialogue",
      title: "Câu trả lời band 6 – 6.5 (ước tính) — 97 từ, khoảng 40 giây",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do you think some people don't like paying taxes?", vi: "Theo bạn vì sao một số người không thích đóng thuế?" },
        { who: "Candidate", role: "candidate", text: "I think there are a couple of reasons. The main one is probably that people can't see where their money goes. For example, if you pay a big part of your salary in tax but the roads in your area are still full of holes, you naturally feel the money is being wasted. Another reason is that tax feels unfair to some people. In my city, for instance, small shop owners often complain that big companies find ways to pay less than they do. So I'd say it's less about the money itself and more about trust.", vi: "Tôi nghĩ có vài lý do. Lý do chính có lẽ là người ta không thấy tiền của mình đi đâu. Ví dụ, nếu bạn đóng một phần lớn lương cho thuế mà đường trong khu vẫn đầy ổ gà, tự nhiên bạn thấy tiền đang bị lãng phí. Một lý do nữa là thuế có vẻ bất công với một số người. Ở thành phố tôi chẳng hạn, các chủ tiệm nhỏ hay than rằng công ty lớn tìm được cách đóng ít hơn họ. Nên tôi cho rằng vấn đề không hẳn là tiền mà là lòng tin." },
      ],
    },
    {
      t: "table",
      caption: "Khác nhau ở đâu — bốn tiêu chí Speaking",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC** — trôi chảy, mạch lạc", "15 giây, 5 câu rời; mở bằng “Because…”; kết bằng “Yes.”; không có ví dụ", "40 giây; **báo trước** → lý do 1 + ví dụ → lý do 2 + ví dụ → **chốt**; từ dẫn: The main one · For example · Another reason · for instance · So I'd say"],
        ["**LR** — từ vựng", "lose money · very high · use money well — từ cơ bản, lặp money × 2 · tax × 2", "where their money goes · being wasted · feels unfair · find ways to · it's less about… more about… — có cụm tự nhiên, paraphrase (don't like paying → feel it's wasted / unfair)"],
        ["**GRA** — ngữ pháp", "Toàn câu đơn; lỗi: ~~government don't~~ (thiếu the, sai chia)", "Câu phức: **that** + mệnh đề, **if… but…**, **where** + mệnh đề, bị động tiếp diễn (**is being wasted**), so sánh (less than they do)"],
        ["**P** — phát âm", "Ngắt sau mỗi câu, ngữ điệu phẳng, “er”", "Nhấn từ mang nghĩa (**see**, **wasted**, **unfair**, **trust**); nối âm (full‿of, less‿about)"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nâng câu band 5 lên band 6 bằng ba câu hỏi tự hỏi",
      items: [
        "**“Vì sao lại thế?”** sau mỗi lý do → thêm một câu giải thích. (They think the government wastes money → **because they can't see where it goes**.)",
        "**“Ví dụ?”** → thêm một tình huống cụ thể, tốt nhất ở nơi bạn sống.",
        "**“Vậy tóm lại?”** → thêm một câu chốt bắt đầu bằng **So…**",
      ],
    },

    { t: "h", text: "7. Thêm một mẫu: tách theo nhóm" },
    {
      t: "dialogue",
      title: "Câu trả lời band 6 dùng trục TUỔI",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do some people take a great interest in politics while others don't care at all?", vi: "Vì sao một số người rất quan tâm chính trị trong khi người khác không hề quan tâm?" },
        { who: "Candidate", role: "candidate", text: "I think it depends a lot on age. For older people, politics affects things they worry about every day, like pensions and hospital waiting times, so they follow the news quite closely. Younger people, on the other hand, are often busy studying or starting their careers, and they tend to feel that one vote won't change much. That said, when an issue affects them directly, for instance tuition fees, they suddenly become very interested. So it's really about whether people can see the link between politics and their own lives.", vi: "Tôi nghĩ phụ thuộc nhiều vào tuổi. Với người lớn tuổi, chính trị ảnh hưởng tới những thứ họ lo hằng ngày như lương hưu và thời gian chờ ở bệnh viện, nên họ theo dõi tin tức khá sát. Còn người trẻ thì thường bận học hoặc mới bắt đầu sự nghiệp, và họ hay cảm thấy một lá phiếu chẳng thay đổi được mấy. Tuy vậy, khi một vấn đề ảnh hưởng trực tiếp tới họ, ví dụ học phí, họ bỗng rất quan tâm. Nên thật ra vấn đề là người ta có thấy mối liên hệ giữa chính trị và đời sống của mình không." },
      ],
    },
    {
      t: "note",
      title: "Phân tích mẫu trên",
      items: [
        "Trục: **age** — “For older people…” ↔ “Younger people, on the other hand…”.",
        "Mỗi nhóm có **lý do + chi tiết**: pensions, hospital waiting times ↔ busy studying, one vote won't change much.",
        "**That said, …** = câu nhượng bộ ngắn (ngoại lệ) — chính là “phản đề một câu” của bài Viết hôm nay, ở dạng nói.",
        "Chốt bằng **So it's really about whether…** — gom hai nhóm về một nguyên nhân chung.",
        "Từ của bài 1: **pensions · politics · vote · tuition fees**.",
      ],
    },

    { t: "h", text: "8. Phát âm: /ɔː/ – /ɒ/ – /əʊ/" },
    {
      t: "table",
      caption: "Ba nguyên âm — khẩu hình và chữ viết thường gặp",
      head: ["Âm", "Khẩu hình", "Chữ viết hay gặp", "Từ"],
      rows: [
        ["**/ɔː/** — dài", "môi tròn, đẩy ra trước, lưỡi lùi; **giữ dài**", "or · aw · au · al · our · ore", "l**aw** · m**ore** · supp**or**t · t**al**k · f**our** · c**au**se"],
        ["**/ɒ/** — ngắn (giọng Anh)", "miệng mở rộng hơn, môi hơi tròn; **ngắn, gọn**", "o · (w)a", "l**o**t · c**o**st · p**o**licy · j**o**b · w**a**nt · wh**a**t"],
        ["**/əʊ/** — nguyên âm đôi", "bắt đầu thả lỏng /ə/, **trượt** sang /ʊ/, môi khép dần", "o · o_e · oa · ow · ough", "g**o** · v**o**te · r**oa**d · l**ow** · th**ough** · l**o**cal"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "Đọc /əʊ/ thành “ô” phẳng: **vote** → “vốt”, **road** → “rốt”, **don't** → “đôn”. Phải **trượt hai âm**.",
        "Không phân biệt dài – ngắn: **short** /ʃɔːt/ (ngắn) ↔ **shot** /ʃɒt/ (cú bắn); **port** ↔ **pot**; **caught** ↔ **cot**.",
        "Cặp ba kinh điển: **law** /lɔː/ – **lot** /lɒt/ – **low** /ləʊ/ · **caught** – **cot** – **coat** · **bought** – **bot**tle – **boat**.",
        "Giọng Mỹ đọc /ɒ/ thành /ɑː/ (lot → “laat”) và /əʊ/ thành /oʊ/. Khi nghe giọng Mỹ, đừng ngạc nhiên; khi nói, giữ **một** kiểu nhất quán.",
        "Chữ **o** không báo trước âm: g**o**vernment là /ʌ/, c**o**ntrol âm đầu là /ə/. Tra IPA của từ mới (bài 1 đã ghi sẵn).",
      ],
    },
    {
      t: "phatam",
      id: "t3d6-phat-am-o",
      title: "Luyện phát âm: /ɔː/ – /ɒ/ – /əʊ/",
      note: "Ba dòng đầu là cặp ba tối thiểu: đọc chậm, nghe rõ ba âm khác nhau. Các dòng sau là câu dùng từ của chủ đề hôm nay. Máy chấm từng âm — xem /əʊ/ của bạn có bị chấm thành /ɔː/ không.",
      items: [
        { text: "law, lot, low", ipa: "lɔː lɒt ləʊ", vi: "luật · nhiều · thấp" },
        { text: "caught, cot, coat", ipa: "kɔːt kɒt kəʊt", vi: "đã bắt · cũi · áo khoác" },
        { text: "short, shot, show", ipa: "ʃɔːt ʃɒt ʃəʊ", vi: "ngắn · cú bắn · cho xem" },
        { text: "Most voters want lower costs.", ipa: "məʊst vəʊtəz wɒnt ləʊə kɒsts", vi: "Đa số cử tri muốn chi phí thấp hơn." },
        { text: "A lot of people don't know the law.", ipa: "ə lɒt əv piːpl dəʊnt nəʊ ðə lɔː", vi: "Rất nhiều người không biết luật." },
        { text: "Policy reform is not a short process.", ipa: "pɒləsi rɪfɔːm ɪz nɒt ə ʃɔːt prəʊses", vi: "Cải cách chính sách không phải quá trình ngắn." },
        { text: "The local authority supports four hospitals.", ipa: "ðə ləʊkl ɔːθɒrəti səpɔːts fɔː hɒspɪtlz", vi: "Chính quyền địa phương hỗ trợ bốn bệnh viện." },
        { text: "I suppose more money should go on roads.", ipa: "aɪ səpəʊz mɔː mʌni ʃʊd ɡəʊ ɒn rəʊdz", vi: "Tôi cho rằng nên chi thêm tiền cho đường sá." },
        { text: "The government imposed a tax on imported cars.", ipa: "ðə ɡʌvənmənt ɪmpəʊzd ə tæks ɒn ɪmpɔːtɪd kɑːz", vi: "Chính phủ áp thuế lên ô tô nhập khẩu." },
        { text: "Nobody wrote the report before the autumn.", ipa: "nəʊbədi rəʊt ðə rɪpɔːt bɪfɔː ði ɔːtəm", vi: "Không ai viết bản báo cáo trước mùa thu." },
      ],
    },

    { t: "h", text: "9. Luyện tập trước khi ghi âm" },
    {
      t: "quiz",
      id: "t3d6-noi-dien-khung",
      title: "Điền từ vào câu trả lời mẫu (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "1. I think there are a ___ of reasons for this. (vài)", answers: ["couple", "number"] },
        { q: "2. The ___ one is probably that housing is too expensive. (chính)", answers: ["main", "first", "biggest"] },
        { q: "3. That's mainly ___ salaries haven't risen as fast as prices.", answers: ["because"] },
        { q: "4. Fewer people use buses because ___ the long waiting times.", answers: ["of"] },
        { q: "5. ___ reason is that people don't trust the system. (một… nữa)", answers: ["Another", "another"] },
        { q: "6. I think it depends ___ age.", answers: ["on"] },
        { q: "7. For younger people it's about cost, ___ older people care more about comfort. (trong khi)", answers: ["whereas", "while"] },
        { q: "8. So I'd say it's less about money and ___ about trust.", answers: ["more"] },
      ],
    },
    {
      t: "mcq",
      id: "t3d6-noi-chon",
      title: "Chọn câu trả lời / cách nói đúng (6 câu)",
      items: [
        { q: "1. Giám khảo: “Why do you think people move to big cities?” — Câu mở nào hợp band 6 nhất?", options: ["A Because I like big cities.", "B Yes, I think so.", "C I think there are a couple of reasons. The main one is probably work.", "D Big cities are very big."], correct: 2, why: "C báo trước + nêu lý do chung về **people**. A nói về **I**; B trả lời sai loại câu hỏi." },
        { q: "2. Câu nào ĐÚNG ngữ pháp?", options: ["A People don't vote because of they are busy.", "B People don't vote because of a lack of trust.", "C The reason is because they are busy.", "D Due to they are busy, people don't vote."], correct: 1, why: "because of + **danh từ**. A, D: because of / due to + mệnh đề là sai; C thừa because (→ The reason is **that**)." },
        { q: "3. Hỏi: “Why do some people prefer private schools?” — Trục chia nhóm nào hợp nhất?", options: ["A Thu nhập: better-off families ↔ families on low incomes", "B Thời tiết: mùa hè ↔ mùa đông", "C Màu sắc yêu thích", "D Giới tính của giáo viên"], correct: 0, why: "Trường tư gắn với **khả năng chi trả** → trục thu nhập." },
        { q: "4. Sau khi nêu lý do 1, câu nào là VÍ DỤ tốt?", options: ["A And that's it.", "B I don't know more.", "C It is very important.", "D In my city, for instance, a metro ticket now costs twice as much as five years ago."], correct: 3, why: "Ví dụ = tình huống **cụ thể** (nơi chốn, con số, thời gian)." },
        { q: "5. Góc nhìn nào đang được dùng: “People tend to feel that one vote won't change anything.”", options: ["A Kinh tế", "B Tâm lý", "C Công nghệ", "D Thực tế – tiện lợi"], correct: 1, why: "“feel that…” — cảm nhận, niềm tin → góc **tâm lý**." },
        { q: "6. Từ nào có âm /əʊ/?", options: ["A law", "B cost", "C policy", "D vote"], correct: 3, why: "vote /vəʊt/. law /lɔː/ · cost /kɒst/ · policy /ˈpɒləsi/." },
      ],
    },

    { t: "h", text: "10. Luyện nói Part 3 (ghi âm, AI chấm)" },
    {
      t: "p",
      text: "Mỗi câu nói **30–45 giây** theo khung mục 2. Trước khi bấm ghi, quyết định trong đầu: **hai góc nhìn nào** (mục 4) hoặc **trục nào** (mục 5). Nói xong nghe lại: có **câu báo trước**? mỗi lý do có **ví dụ**? có **câu chốt**? dùng ít nhất **ba** cụm nguyên nhân khác nhau?",
    },
    {
      t: "speak",
      id: "t3d6-noi-why-1",
      part: "3",
      questions: [
        "Why do you think some people don't trust politicians?",
        "Why do you think governments spend so much money on roads and bridges?",
        "What are the reasons why many young people are not interested in politics?",
        "Why is it that some laws are very difficult to enforce?",
      ],
    },
    {
      t: "speak",
      id: "t3d6-noi-why-2",
      part: "3",
      questions: [
        "Why do some people prefer private hospitals while others use public ones?",
        "What makes people willing to pay higher taxes in some countries?",
        "Why do you think public transport is better in some cities than in others?",
        "Why do some people think the government should pay for university education?",
      ],
    },
    {
      t: "note",
      title: "Sổ Speaking (Tập 3 Ngày 2) — việc sau khi ghi âm",
      items: [
        "Chép **một** câu trả lời của bạn (nguyên văn, cả lỗi) vào cột **Tôi đã nói** của Sổ Speaking (Ngày 2 · Nói mục 7), rồi điền **Bản sửa** và **Đã sửa gì**. Gạch chân: câu báo trước · hai lý do · hai ví dụ · câu chốt. Thiếu mảnh nào thì viết thêm.",
        "Thay ít nhất hai chữ **because** bằng cụm ở mục 3.",
        "Cột **Câu hỏi vặn cho ngày mai**: ngày mai tự đóng vai giám khảo, hỏi lại đúng câu đó và trả lời **không nhìn sổ**.",
        "Các dạng Part 3 sau: **Do you agree that…?** (Ngày 10) · ưu – nhược (Ngày 14) · **What would happen if…?** (Ngày 15).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T3D6_BAI_TAP: Lesson = {
  id: "t3d6-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 6",
  goal: "Củng cố từ vựng nhà nước – chi tiêu công, thesis có mức độ, phản đề một câu và khung trả lời “Why” của Part 3 — 36 câu có đáp án + 3 câu nói ghi âm.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**36 câu** chia 6 phần: nghĩa từ (8) · giới từ và cụm (8) · dạng từ (6) · dịch câu Task 2 (6) · đọc đề và thesis (4) · ngôn ngữ nguyên nhân (4).",
        "Cuối bài: **3 câu Part 3** ghi âm (AI chấm).",
        "Sai phần I–III → ôn bài Từ vựng (mục 1–5) · phần IV–V → bài Viết (mục 2–5) · phần VI → bài Nói (mục 2–3 và 5).",
        "Mục tiêu **≥ 29/36**. Xong thì làm **Kiểm tra chặng Ngày 1–6**.",
      ],
    },

    { t: "h", text: "Phần I — Nghĩa từ (8 câu)" },
    {
      t: "mcq",
      id: "t3d6-bt-nghia",
      title: "I. Chọn từ hợp nghĩa",
      items: [
        { q: "1. Money that a government collects, mainly from taxes, is called ___.", options: ["A revenue", "B deficit", "C subsidy", "D pension"], correct: 0, why: "revenue = nguồn thu." },
        { q: "2. Money paid by the state to keep the price of something low is a ___.", options: ["A debt", "B budget", "C subsidy", "D campaign"], correct: 2, why: "subsidy = trợ giá." },
        { q: "3. Roads, bridges, power lines and water pipes are all part of a country's ___.", options: ["A bureaucracy", "B infrastructure", "C legislation", "D welfare"], correct: 1, why: "infrastructure = cơ sở hạ tầng." },
        { q: "4. A system with too many rules and forms is often criticised for its ___.", options: ["A democracy", "B priority", "C revenue", "D bureaucracy"], correct: 3, why: "bureaucracy = bộ máy quan liêu, thủ tục rườm rà." },
        { q: "5. If decisions are made openly so that everyone can see how money is spent, the process is ___.", options: ["A transparent", "B corrupt", "C privatised", "D underfunded"], correct: 0, why: "transparent = minh bạch." },
        { q: "6. To put a plan or policy into action is to ___ it.", options: ["A impose", "B allocate", "C vote", "D implement"], correct: 3, why: "implement = triển khai." },
        { q: "7. Regular money paid to people who have retired is a ___.", options: ["A tax", "B pension", "C grant", "D fine"], correct: 1, why: "pension = lương hưu." },
        { q: "8. The local ___ is responsible for parks, libraries and rubbish collection.", options: ["A parliament", "B minister", "C council", "D election"], correct: 2, why: "council = hội đồng địa phương." },
      ],
    },

    { t: "h", text: "Phần II — Giới từ và cụm (8 câu)" },
    {
      t: "quiz",
      id: "t3d6-bt-gioi-tu",
      title: "II. Điền MỘT từ",
      kind: "fill",
      items: [
        { q: "9. Governments spend billions ___ defence every year.", answers: ["on"] },
        { q: "10. The state should invest more ___ public transport.", answers: ["in"] },
        { q: "11. Several cities have imposed a ban ___ diesel cars.", answers: ["on"] },
        { q: "12. Local authorities are responsible ___ collecting rubbish.", answers: ["for"] },
        { q: "13. More funding should be allocated ___ rural schools.", answers: ["to"] },
        { q: "14. Sports stadiums should not be built at the ___ of hospitals.", answers: ["expense"] },
        { q: "15. Many people see the new airport as a waste of ___ money. (của người nộp thuế)", answers: ["taxpayers'", "public"] },
        { q: "16. Reducing poverty should be a ___ priority for any government. (hàng đầu)", answers: ["top", "high", "key", "major"] },
      ],
    },

    { t: "h", text: "Phần III — Dạng từ (6 câu)" },
    {
      t: "quiz",
      id: "t3d6-bt-dang-tu",
      title: "III. Viết dạng đúng của từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "17. There has been heavy ___ (INVEST) in renewable energy.", answers: ["investment"] },
        { q: "18. The new ___ (REGULATE) on food labelling come into force next year.", answers: ["regulations"] },
        { q: "19. ___ (POLITICS) often make promises that they cannot keep.", answers: ["Politicians", "politicians"] },
        { q: "20. Voters are demanding greater ___ (ACCOUNTABLE) from their leaders.", answers: ["accountability"] },
        { q: "21. State-___ (FUND) schools do not charge fees.", answers: ["funded"] },
        { q: "22. The ___ (PRIVATISE) of the water company led to higher bills.", answers: ["privatisation", "privatization"] },
      ],
    },

    { t: "h", text: "Phần IV — Dịch câu Task 2 (6 câu)" },
    {
      t: "quiz",
      id: "t3d6-bt-dich",
      title: "IV. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "spend … on · impose a tax on · I largely agree that…, although… · Admittedly, … However, … · Although…, … · at the expense of",
      items: [
        {
          q: "23. Các chính phủ nên chi nhiều tiền hơn cho y tế.",
          hint: "Governments, should spend more money on, health care",
          answers: ["Governments should spend more money on health care.", "Governments should spend more money on healthcare.", "Governments should spend more on health care.", "Governments should spend more on healthcare.", "Governments should spend more money on health.", "The government should spend more money on health care.", "The government should spend more money on healthcare."],
        },
        {
          q: "24. Tôi phần lớn đồng ý rằng thuế cao là cần thiết, dù chúng không được ưa chuộng.",
          hint: "I largely agree that high taxes are necessary, although they are unpopular",
          answers: ["I largely agree that high taxes are necessary, although they are unpopular.", "I largely agree that high taxes are necessary, although they are not popular.", "I largely agree that high taxes are necessary although they are unpopular.", "I largely agree that high taxes are necessary, though they are unpopular.", "I mostly agree that high taxes are necessary, although they are unpopular.", "I largely agree that high taxes are necessary, even though they are unpopular."],
        },
        {
          q: "25. Phải công nhận, chính sách này tốn kém. Tuy nhiên, nó sẽ tiết kiệm tiền về lâu dài.",
          hint: "Admittedly, this policy is expensive / costly. However, it will save money in the long term",
          answers: ["Admittedly, this policy is expensive. However, it will save money in the long term.", "Admittedly, this policy is costly. However, it will save money in the long term.", "Admittedly, the policy is expensive. However, it will save money in the long term.", "Admittedly, this policy is expensive. However, it will save money in the long run.", "Admittedly, this policy is costly. However, it will save money in the long run.", "Admittedly, this policy is expensive. Nevertheless, it will save money in the long term."],
        },
        {
          q: "26. Chính phủ nên áp thuế lên đồ uống có đường.",
          hint: "The government / Governments, should impose a tax on, sugary drinks",
          answers: ["The government should impose a tax on sugary drinks.", "Governments should impose a tax on sugary drinks.", "The government should impose taxes on sugary drinks.", "Governments should impose taxes on sugary drinks.", "The government should introduce a tax on sugary drinks.", "Governments should introduce a tax on sugary drinks."],
        },
        {
          q: "27. Không nên xây đường mới mà làm thiệt cho giao thông công cộng.",
          hint: "New roads should not be built, at the expense of, public transport",
          answers: ["New roads should not be built at the expense of public transport.", "New roads shouldn't be built at the expense of public transport.", "We should not build new roads at the expense of public transport.", "Governments should not build new roads at the expense of public transport.", "The government should not build new roads at the expense of public transport."],
        },
        {
          q: "28. Dù đường mới giảm ùn tắc trước mắt, chúng sớm đầy thêm xe.",
          hint: "Although new roads reduce congestion in the short term, they soon fill (up) with more cars",
          answers: ["Although new roads reduce congestion in the short term, they soon fill with more cars.", "Although new roads reduce congestion in the short term, they soon fill up with more cars.", "Although new roads reduce congestion in the short term, they are soon filled with more cars.", "Although new roads reduce congestion in the short term, they soon fill with additional cars.", "While new roads reduce congestion in the short term, they soon fill with more cars.", "While new roads reduce congestion in the short term, they soon fill up with more cars.", "Although new roads reduce traffic congestion in the short term, they soon fill with more cars.", "Although new roads reduce congestion in the short term, they soon fill up with extra cars."],
        },
      ],
    },

    { t: "h", text: "Phần V — Đọc đề và thesis (4 câu)" },
    {
      t: "mcq",
      id: "t3d6-bt-de",
      title: "V. Đếm vế, chữ tuyệt đối, thesis",
      items: [
        { q: "29. “Governments should make university free for all students, because education is the only way to reduce inequality.” — Hai vế phải bàn là:", options: ["A đại học + trung học", "B miễn phí cho MỌI sinh viên + giáo dục là cách DUY NHẤT giảm bất bình đẳng", "C sinh viên + giáo viên", "D chính phủ + tư nhân"], correct: 1, why: "Khẳng định (free for **all**) + lý do (**the only way**). Cả hai có chữ tuyệt đối." },
        { q: "30. Với đề câu 29, thesis nào có mức độ và bám chữ tuyệt đối?", options: ["A I agree with this idea.", "B Education is very important nowadays.", "C This essay will discuss free university.", "D I partly agree: free university would reduce inequality, but it should not be free for all students, and it is not the only solution."], correct: 3, why: "D có **partly**, nêu phần đồng ý, và giới hạn cả **all** lẫn **the only**." },
        { q: "31. Phản đề nào ĐÃ được bác?", options: ["A Admittedly, free university is expensive; however, graduates repay the cost through higher taxes later.", "B However, free university is expensive.", "C Some people say it is expensive.", "D It is expensive and it is popular."], correct: 0, why: "A: nhượng bộ + bác. B, C nêu rồi bỏ lửng." },
        { q: "32. Mở bài viết “I completely disagree”. Thân bài nào làm bài MẤT nhất quán?", options: ["A Hai thân bài đều nêu lý do phản đối", "B Thân bài 1 phản đối, thân bài 2 phản đối + một câu phản đề có bác", "C Thân bài 1 nêu ba lợi ích của ý kiến trong đề, thân bài 2 nêu một điểm hại", "D Thân bài 1 phản đối vế ①, thân bài 2 phản đối vế ②"], correct: 2, why: "completely disagree mà dành cả một thân bài khen ý kiến đó ⇒ lập trường thật là “partly”, không khớp thesis." },
      ],
    },

    { t: "h", text: "Phần VI — Ngôn ngữ nguyên nhân khi nói (4 câu)" },
    {
      t: "quiz",
      id: "t3d6-bt-nguyen-nhan",
      title: "VI. Điền MỘT từ",
      kind: "fill",
      items: [
        { q: "33. The reason is ___ people can't see where their money goes. (không dùng because)", answers: ["that"] },
        { q: "34. It has a lot to ___ with the cost of living.", answers: ["do"] },
        { q: "35. Rents are very high, ___ means young people can't save.", answers: ["which"] },
        { q: "36. I think it ___ on where people live. In big cities…, whereas in rural areas…", answers: ["depends"] },
      ],
    },

    { t: "h", text: "Nói thêm — 3 câu Part 3 (ghi âm, AI chấm)" },
    {
      t: "speak",
      id: "t3d6-bt-noi",
      part: "3",
      questions: [
        "Why do you think some people avoid using public services such as public hospitals?",
        "Why do some governments spend a lot of money on international sports events?",
        "What are the reasons why people in the countryside and people in cities often want different things from the government?",
      ],
    },
  ],
};

/* ─────────────────────────── Kiểm tra chặng (Ngày 1–6) ─────────────────────────── */

const T3D6_KIEM_TRA: Lesson = {
  id: "t3d6-kiem-tra",
  kind: "review",
  title: "Kiểm tra chặng (Ngày 1–6)",
  goal: "Tự đo đã nắm chắc Ngày 1–6 của Tập 3 chưa — hệ 12 thì, hiện tại hoàn thành tiếp diễn, quá khứ hoàn thành, mạo từ vòng 2, tương lai tiếp diễn – hoàn thành và dự báo; AWL sublist 3, từ vựng tội phạm – pháp luật, nhà nước – chi tiêu công; Listening Part 1 giọng trộn, số liệu phức, Part 2 bản đồ giọng Canada; Reading Matching headings · True / False / Not Given · paraphrase; Writing Task 1 overview 2 điểm và Opinion band 6; Speaking Part 1 theo khung câu hỏi và Part 3 “Why” — và biết chính xác Ngày nào cần ôn lại.",
  minutes: 170,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra này đo gì",
      items: [
        "**8 phần**, khoảng **170 phút** (nên chia hai buổi: phần 1–5 ~85′ · phần 6–8 ~85′): Ngữ pháp · Từ vựng · Dịch · Nghe · Đọc · Viết · Nói · Phát âm — toàn bộ là kiến thức **Ngày 1–6 của Tập 3**.",
        "**Đạt** = từ **70 %** trở lên ở **từng phần**. Bảng điểm ngay dưới ghi ngưỡng và **Ngày cần ôn** nếu trượt.",
        "Mọi câu hỏi, bài nghe, bài đọc, đề viết đều **viết mới** — cùng kiến thức, khác ngữ liệu. Nhớ đáp án cũ không giúp được.",
        "Mức giữa chặng đầu của Tập 3: Viết và Nói đạt khi AI chấm **≥ band 5.5** (đích cuối tập là 6.0).",
        "Sau bài này: ghi câu sai vào **Sổ lỗi theo mã** (Ngày 2 · Viết mục 6), ôn đúng Ngày ghi trong bảng, rồi mới sang Ngày 7.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng 1 (Ngày 1–6) — những gì sẽ bị kiểm",
      center: "Ngày 1–6",
      branches: [
        { label: "Ngữ pháp", anh: "memo", items: ["N1 hệ 12 thì · have been V-ing · had V3", "N3 mạo từ vòng 2 · the + tính từ", "N5 will be V-ing · will have V3 · dự báo"] },
        { label: "Từ vựng", anh: "books", items: ["N2 AWL sublist 3 · Education vòng 2", "N4 Crime, law & punishment", "N6 Government & public spending"] },
        { label: "Nghe", anh: "headphone", items: ["N1 Part 1 giọng trộn", "N4 Part 2 MCQ + bản đồ · giọng Canada", "N5 số liệu phức · -teen / -ty"] },
        { label: "Đọc", anh: "notebook", items: ["N1 skim bố cục · paraphrase 4 mức", "N3 True / False / Not Given", "N5 Matching headings"] },
        { label: "Viết", anh: "pencil", items: ["N2 band 6 trông thế nào · sổ lỗi", "N4 Task 1 overview 2 điểm · nhóm số liệu", "N6 Opinion: thesis mức độ · phản đề"] },
        { label: "Nói · Phát âm", anh: "microphone", items: ["N2 tiêu chí band 6 · N3 Part 1 12 khung · N6 Part 3 Why", "44 âm · /æ e ʌ/ · linking /r/ · /θ ð dʒ/ · -teen/-ty · /ɔː ɒ əʊ/"] },
      ],
      caption: "Mỗi nhánh là một phần của bài kiểm tra. Nhánh nào trượt thì ôn đúng Ngày ghi trên nhánh đó.",
    },
    {
      t: "note",
      title: "Cách làm bài",
      items: [
        "**Gập sách**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.",
        "Thời gian gợi ý (**170′**): Ngữ pháp 18′ · Từ vựng 10′ · Dịch 8′ · Nghe 20′ · Đọc 22′ · Viết 72′ (6a 6′ · Task 1 20′ · Task 2 40′ · soát 6′) · Nói 12′ · Phát âm 8′.",
        "Phần **Dịch**: cố không bấm 💡 Gợi ý — bấm thì tự trừ câu đó.",
        "Phần **Nghe**: đọc câu hỏi và hình trước; mỗi bài nghe **một lần** như thi thật (lần hai chỉ để chữa); chưa mở lời thoại cho tới khi chấm xong.",
        "Phần **Đọc**: **22 phút** cho 13 câu; làm Matching headings trước. Hết giờ thì dừng.",
        "Xong mỗi phần **ghi điểm ra giấy**. Cuối bài đối chiếu với bảng dưới.",
      ],
    },
    {
      t: "table",
      caption: "Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần",
      head: ["Phần", "Số câu", "Đạt khi", "Chưa đạt thì ôn lại"],
      rows: [
        ["1. Ngữ pháp", "15 + 9", "≥ 17/24", "Ngày 1 · Ngữ pháp (mục 2–6) — Ngày 3 · Ngữ pháp (mục 2–6) — Ngày 5 · Ngữ pháp (mục 2–6)"],
        ["2. Từ vựng", "12 + 6", "≥ 13/18", "Ngày 2 · Từ vựng (AWL sublist 3) — Ngày 4 · Từ vựng (mục 1–5) — Ngày 6 · Từ vựng (mục 1–5)"],
        ["3. Dịch Việt → Anh", "6", "≥ 5/6", "Các bài dịch 💡 trong bài ngữ pháp Ngày 1, 3, 5 · bài dịch từ vựng Ngày 6"],
        ["4. Nghe", "6 + 7", "≥ 9/13", "Ngày 1 · Nghe (mục 3–5) — Ngày 5 · Nghe (mục 1–6) — Ngày 4 · Nghe (bản đồ, MCQ, giọng Canada)"],
        ["5. Đọc", "4 + 6 + 3", "≥ 9/13", "Ngày 5 · Đọc (mục 2–4) — Ngày 3 · Đọc (mục 1–4) — Ngày 1 · Đọc (mục 4)"],
        ["6. Viết", "6 câu + 2 bài", "6a ≥ 5/6; Task 1 AI ≥ band 5.5, overview nêu 2 điểm không số và bao cả phần dự báo; Task 2 ≥ 250 từ, AI ≥ band 5.5, thesis có mức độ và bàn đủ hai vế", "Ngày 4 · Viết (mục 2–3) — Ngày 5 · Ngữ pháp (mục 6) — Ngày 6 · Viết (mục 2–5) — Ngày 2 · Viết (mục 1, 4–5: tiêu chí + bảng tự chấm 12 câu)"],
        ["7. Nói", "4 câu Part 1 + 3 câu Part 3", "AI chấm ≥ band 5.5; Part 1 mỗi câu 2–4 câu; Part 3 mỗi câu có 2 lý do + ví dụ", "Ngày 3 · Nói (mục 1–6) — Ngày 6 · Nói (mục 2–5) — Ngày 2 · Nói (so mẫu band 5 – 6)"],
        ["8. Phát âm", "8 câu + đọc lại 3 khối", "≥ 6/8; ba khối phát âm đọc lại đạt ≥ 70 điểm ở đa số dòng", "Ngày 1 (4 cặp phụ âm) · Ngày 2 (/æ e ʌ/) · Ngày 3 (linking /r/) · Ngày 4 (/θ ð dʒ/) · Ngày 5 (-teen / -ty) · Ngày 6 (/ɔː ɒ əʊ/)"],
      ],
    },

    /* ───────────── 1. Ngữ pháp ───────────── */
    { t: "h", text: "Phần 1 — Ngữ pháp (15 + 9 câu · đạt ≥ 17/24 · trượt thì ôn Ngày 1, 3, 5)" },
    {
      t: "mcq",
      id: "t3d6-kt-ngu-phap-chon",
      title: "1a. Chọn đáp án đúng (15 câu)",
      items: [
        { q: "1. You look exhausted. — Yes, I ___ all night for tomorrow's exam.", options: ["A have been revising", "B had revised", "C am revising", "D revise"], correct: 0, why: "Hành động kéo dài tới gần đây, để lại dấu vết hiện tại (mệt) → hiện tại hoàn thành tiếp diễn. (Ngày 1)" },
        { q: "2. By the time the police arrived, the thieves ___.", options: ["A have already escaped", "B already escape", "C had already escaped", "D were already escaping"], correct: 2, why: "Việc xảy ra **trước** một mốc quá khứ → quá khứ hoàn thành. (Ngày 1)" },
        { q: "3. She ___ three reports so far this week.", options: ["A has been writing", "B has written", "C had written", "D wrote"], correct: 1, why: "Có **số lượng** (three reports) + so far → hiện tại hoàn thành đơn, không tiếp diễn. (Ngày 1)" },
        { q: "4. I ___ him for ten years, so I trust him completely.", options: ["A have been knowing", "B am knowing", "C know", "D have known"], correct: 3, why: "know là động từ trạng thái → không dùng tiếp diễn; for ten years → have known. (Ngày 1)" },
        { q: "5. When I got to the station, I realised I ___ my ticket at home.", options: ["A had left", "B have left", "C leave", "D was leaving"], correct: 0, why: "Bỏ quên vé xảy ra trước lúc “realised” → had left. (Ngày 1)" },
        { q: "6. ___ are often lonely in big cities, so more community centres are needed.", options: ["A Elderly", "B The elderly", "C An elderly", "D The elderlies"], correct: 1, why: "**the + tính từ** = cả một nhóm người, động từ số nhiều. (Ngày 3)" },
        { q: "7. ___ has changed the way people communicate.", options: ["A A mobile phone", "B Mobile phone", "C The mobile phone", "D The mobile phones"], correct: 2, why: "Nói chung về một phát minh: **The + danh từ số ít** (hoặc Mobile phones + have). B thiếu mạo từ; A = một cái bất kỳ. (Ngày 3)" },
        { q: "8. The government should give ___ about healthy eating.", options: ["A an advice", "B advices", "C the advices", "D more advice"], correct: 3, why: "advice không đếm được: không a/an, không -s. (Ngày 3)" },
        { q: "9. ___ education of young children is the responsibility of parents.", options: ["A The", "B An", "C Ø (không mạo từ)", "D A"], correct: 0, why: "Danh từ có cụm **of…** chỉ rõ phía sau → **the** education of young children. (Ngày 3)" },
        { q: "10. Most people agree that ___ plays an important role in ___.", options: ["A the technology / the society", "B technology / society", "C a technology / a society", "D technology / the society"], correct: 1, why: "Danh từ trừu tượng nói chung: Ø. ~~the society~~ là lỗi band 6 điển hình. (Ngày 3)" },
        { q: "11. This time next year, I ___ at a university in Australia.", options: ["A will have studied", "B study", "C will be studying", "D will studying"], correct: 2, why: "Tại mốc tương lai, việc đang diễn ra → will be + V-ing. (Ngày 5)" },
        { q: "12. By 2040, the number of electric cars ___ 20 million.", options: ["A will be reaching", "B reaches", "C reached", "D will have reached"], correct: 3, why: "**By + mốc tương lai**, việc đã xong → will have + V3. (Ngày 5)" },
        { q: "13. The figure rose to 40% in 2020 and is ___ to climb to 55% by 2035.", options: ["A projected", "B projecting", "C project", "D projection"], correct: 0, why: "Bị động dự báo: is projected to + V. (Ngày 5)" },
        { q: "14. Sales fell to 3 million, ___ a projected recovery to 5 million.", options: ["A following", "B followed by", "C follow", "D follows"], correct: 1, why: "…, **followed by a projected** + danh từ. (Ngày 5)" },
        { q: "15. By the time the new hospital ___, the old one will have closed.", options: ["A will open", "B will be opening", "C opens", "D opened"], correct: 2, why: "by the time + hiện tại đơn. (Ngày 5)" },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-kt-ngu-phap-dien",
      title: "1b. Chia động từ / điền mạo từ (9 câu)",
      kind: "fill",
      items: [
        { q: "16. It ___ (rain) since six o'clock this morning, and the streets are flooded.", answers: ["has been raining", "'s been raining"] },
        { q: "17. The film ___ (already / start) when we found our seats. — viết cả trạng từ", answers: ["had already started", "had started already"] },
        { q: "18. How long ___ (you / learn) English? — hỏi độ dài tới bây giờ", answers: ["have you been learning", "have you learned", "have you learnt"] },
        { q: "19. ___ rich should pay more tax than the poor. (a / an / the / x)", answers: ["The", "the"] },
        { q: "20. Unemployment is ___ serious problem in many countries. (a / an / the / x)", answers: ["a"] },
        { q: "21. Many people believe that ___ money cannot buy happiness. (a / an / the / x)", answers: ["x", "X", "Ø", "-"] },
        { q: "22. By next June, my sister ___ (finish) her degree.", answers: ["will have finished"] },
        { q: "23. At ten o'clock tomorrow, the minister ___ (give) a speech to parliament.", answers: ["will be giving"] },
        { q: "24. Coal use fell to 30% in 2020, before ___ (be) expected to drop to 14% by 2040.", answers: ["being"] },
      ],
    },

    /* ───────────── 2. Từ vựng ───────────── */
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 2, 4, 6)" },
    {
      t: "mcq",
      id: "t3d6-kt-tu-vung-chon",
      title: "2a. Chọn từ đúng (12 câu)",
      items: [
        { q: "1. The study did not have ___ evidence to support its conclusion. (đủ)", options: ["A sufficient", "B initial", "C physical", "D negative"], correct: 0, why: "sufficient = đủ (AWL sublist 3). (Ngày 2)" },
        { q: "2. A large ___ of the budget is spent on teachers' salaries. (tỉ lệ)", options: ["A sequence", "B proportion", "C layer", "D reaction"], correct: 1, why: "a large proportion of = một tỉ lệ lớn. (Ngày 2)" },
        { q: "3. The results clearly ___ that smaller classes improve learning. (chứng minh)", options: ["A exclude", "B remove", "C demonstrate", "D register"], correct: 2, why: "demonstrate that = chứng minh rằng. (Ngày 2)" },
        { q: "4. The school places great ___ on practical skills. (sự nhấn mạnh)", options: ["A outcome", "B consent", "C volume", "D emphasis"], correct: 3, why: "place emphasis on = nhấn mạnh vào. (Ngày 2)" },
        { q: "5. Stealing goods from a shop while pretending to be a customer is called ___.", options: ["A shoplifting", "B fraud", "C vandalism", "D assault"], correct: 0, why: "shoplifting = trộm đồ trong cửa hàng. (Ngày 4)" },
        { q: "6. Long prison sentences are supposed to act as a ___ to other criminals.", options: ["A witness", "B deterrent", "C jury", "D suspect"], correct: 1, why: "deterrent = thứ răn đe. (Ngày 4)" },
        { q: "7. Instead of going to prison, he was ordered to do 100 hours of ___.", options: ["A capital punishment", "B imprisonment", "C community service", "D surveillance"], correct: 2, why: "community service = lao động công ích. (Ngày 4)" },
        { q: "8. Education programmes in prison aim at the ___ of offenders. (cải tạo)", options: ["A evidence", "B penalty", "C trial", "D rehabilitation"], correct: 3, why: "rehabilitation = cải tạo, phục hồi. (Ngày 4)" },
        { q: "9. More money should be ___ to mental health services. (phân bổ)", options: ["A allocated", "B imposed", "C voted", "D reformed"], correct: 0, why: "allocate … to. (Ngày 6)" },
        { q: "10. The government ___ a tax on sugary drinks last year.", options: ["A invested", "B imposed", "C subsidised", "D privatised"], correct: 1, why: "impose a tax on. (Ngày 6)" },
        { q: "11. Critics called the new stadium a waste of ___ money.", options: ["A revenue", "B welfare", "C taxpayers'", "D deficit"], correct: 2, why: "taxpayers' money. (Ngày 6)" },
        { q: "12. Train tickets are cheap because the service is heavily ___ by the state.", options: ["A accountable", "B transparent", "C bureaucratic", "D subsidised"], correct: 3, why: "subsidised = được trợ giá. (Ngày 6)" },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-kt-tu-vung-dang",
      title: "2b. Viết dạng đúng của từ trong ngoặc (6 câu)",
      kind: "fill",
      items: [
        { q: "13. There has been a ___ (CONSIDER) rise in tuition fees. — đáng kể", answers: ["considerable"] },
        { q: "14. The ___ (ALTERNATE) to prison is community service. — phương án thay thế", answers: ["alternative"] },
        { q: "15. Most ___ (OFFENCE) are released within a year. — người phạm tội", answers: ["offenders"] },
        { q: "16. The court found him ___ (GUILT) of fraud.", answers: ["guilty"] },
        { q: "17. Heavy ___ (INVEST) in infrastructure created thousands of jobs.", answers: ["investment"] },
        { q: "18. New ___ (LEGISLATE) is needed to protect online shoppers.", answers: ["legislation"] },
      ],
    },

    /* ───────────── 3. Dịch ───────────── */
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
    {
      t: "quiz",
      id: "t3d6-kt-dich",
      title: "3. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "have / has been + V-ing · had + V3 · the + tính từ · will have + V3 by · is projected to + V · allocate … to",
      items: [
        {
          q: "1. Tôi đã học tiếng Anh được sáu năm rồi (và vẫn đang học).",
          hint: "I have been learning / studying English, for six years",
          answers: ["I have been learning English for six years.", "I have been studying English for six years.", "I've been learning English for six years.", "I've been studying English for six years."],
        },
        {
          q: "2. Khi tôi đến nơi, cuộc họp đã kết thúc rồi.",
          hint: "When I arrived, the meeting, had (already) finished / ended",
          answers: ["When I arrived, the meeting had already finished.", "When I arrived, the meeting had finished.", "When I arrived, the meeting had already ended.", "When I arrived, the meeting had ended.", "The meeting had already finished when I arrived.", "The meeting had finished when I arrived.", "The meeting had already ended when I arrived.", "When I got there, the meeting had already finished.", "When I got there, the meeting had finished.", "By the time I arrived, the meeting had already finished.", "By the time I arrived, the meeting had finished."],
        },
        {
          q: "3. Người thất nghiệp cần nhiều hỗ trợ hơn từ nhà nước.",
          hint: "The unemployed, need, more support / help, from the state",
          answers: ["The unemployed need more support from the state.", "The unemployed need more help from the state.", "The unemployed need more support from the government.", "The unemployed need more help from the government.", "Unemployed people need more support from the state.", "Unemployed people need more help from the state.", "Unemployed people need more support from the government."],
        },
        {
          q: "4. Tới năm 2050, dân số thế giới sẽ đạt mốc 10 tỉ người rồi.",
          hint: "By 2050, the world's population, will have reached, 10 billion",
          answers: ["By 2050, the world's population will have reached 10 billion.", "By 2050 the world's population will have reached 10 billion.", "By 2050, the world population will have reached 10 billion.", "By 2050, the population of the world will have reached 10 billion.", "The world's population will have reached 10 billion by 2050.", "The world population will have reached 10 billion by 2050.", "By 2050, the world's population will have reached 10 billion people.", "By 2050, the global population will have reached 10 billion.", "By 2050, the world's population will have reached ten billion."],
        },
        {
          q: "5. Tỉ lệ tội phạm được dự phóng sẽ giảm xuống 5% vào năm 2030.",
          hint: "The crime rate, is projected to fall, to 5%, by 2030",
          answers: ["The crime rate is projected to fall to 5% by 2030.", "The crime rate is expected to fall to 5% by 2030.", "The crime rate is predicted to fall to 5% by 2030.", "The crime rate is forecast to fall to 5% by 2030.", "The crime rate is projected to drop to 5% by 2030.", "The crime rate is projected to decrease to 5% by 2030.", "The crime rate is projected to decline to 5% by 2030.", "The crime rate is expected to drop to 5% by 2030.", "The crime rate is projected to fall to 5 per cent by 2030.", "The crime rate is projected to fall to 5 percent by 2030."],
        },
        {
          q: "6. Nên phân bổ thêm kinh phí cho các trường học ở nông thôn.",
          hint: "More funding / money, should be allocated to, rural schools / schools in rural areas",
          answers: ["More funding should be allocated to rural schools.", "More money should be allocated to rural schools.", "More funding should be allocated to schools in rural areas.", "More money should be allocated to schools in rural areas.", "More funds should be allocated to rural schools.", "The government should allocate more funding to rural schools.", "Governments should allocate more funding to rural schools.", "The government should allocate more money to rural schools.", "More funding should be allocated to schools in the countryside."],
        },
      ],
    },

    /* ───────────── 4. Nghe ───────────── */
    { t: "h", text: "Phần 4 — Nghe (6 + 7 câu · đạt ≥ 9/13 · trượt thì ôn Ngày 1, 4, 5)" },
    {
      t: "p",
      text: "**Bài 4a — Questions 1–6.** Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer. Một cuộc gọi kiểu Part 1, giọng **Úc** (nhân viên) và giọng **Anh** (khách). Có số bị sửa và cặp -teen / -ty.",
    },
    {
      t: "table",
      caption: "Northfield Adult College — enrolment form",
      head: ["Mục", "Chi tiết"],
      rows: [
        ["Course", "Introduction to Criminal Law (evening)"],
        ["Surname", "**1** ___"],
        ["Number of weeks", "**2** ___"],
        ["Course fee", "£ **3** ___"],
        ["Discount for full-time students", "**4** ___ %"],
        ["Classroom", "Room **5** ___ (second floor)"],
        ["First class", "**6** ___ September"],
      ],
    },
    {
      t: "listen",
      id: "t3d6-kt-nghe-dang-ky",
      title: "Enrolling on an evening course",
      dan: { so: "Checkpoint Test 1, Recording 1", boiCanh: "a telephone conversation between a college receptionist and a man who wants to enrol on an evening course.", cau: [1, 6] },
      note: "Khoảng 1 phút 20 giây. Nhân viên: giọng Úc (nữ) · khách: giọng Anh (nam). Nghe một lần.",
      lines: [
        { who: "Receptionist", voice: "au-nu", text: "Northfield Adult College, good evening.", vi: "Trường Northfield xin nghe." },
        { who: "Caller", voice: "uk-nam", text: "Hello. I'd like to enrol on the evening course in criminal law, please.", vi: "Chào chị. Tôi muốn đăng ký khoá buổi tối về luật hình sự." },
        { who: "Receptionist", voice: "au-nu", text: "No problem. Could I take your surname?", vi: "Được ạ. Cho tôi xin họ của anh?" },
        { who: "Caller", voice: "uk-nam", text: "It's Whitlock. That's W-H-I-T-L-O-C-K.", vi: "Whitlock. W-H-I-T-L-O-C-K." },
        { who: "Receptionist", voice: "au-nu", text: "Thanks. Now, the course used to run for sixteen weeks, but this year it's been cut to fourteen. One four.", vi: "Cảm ơn. Khoá học trước đây kéo dài 16 tuần, nhưng năm nay rút còn 14. Một bốn." },
        { who: "Caller", voice: "uk-nam", text: "Fourteen, fine. And how much is it?", vi: "Mười bốn, được. Học phí bao nhiêu?" },
        { who: "Receptionist", voice: "au-nu", text: "The full fee is two hundred and thirty-five pounds.", vi: "Học phí đầy đủ là 235 bảng." },
        { who: "Caller", voice: "uk-nam", text: "Two hundred and twenty-five?", vi: "Hai trăm hai mươi lăm?" },
        { who: "Receptionist", voice: "au-nu", text: "Thirty-five. Two three five. Are you a full-time student, by any chance?", vi: "Ba mươi lăm. Hai ba năm. Anh có phải sinh viên toàn thời gian không?" },
        { who: "Caller", voice: "uk-nam", text: "I am, actually.", vi: "Có ạ." },
        { who: "Receptionist", voice: "au-nu", text: "Then you get a discount. It was ten per cent last year, and it's gone up to seventeen point five per cent.", vi: "Vậy anh được giảm giá. Năm ngoái là 10%, nay tăng lên 17,5%." },
        { who: "Caller", voice: "uk-nam", text: "That's a nice surprise. Where are the classes held?", vi: "Bất ngờ thú vị đấy. Lớp học ở đâu?" },
        { who: "Receptionist", voice: "au-nu", text: "On the second floor of the main building, in room two one nine. It's next to the library.", vi: "Tầng hai toà nhà chính, phòng 219. Cạnh thư viện." },
        { who: "Caller", voice: "uk-nam", text: "Two one nine. And when does it start? The website said the thirteenth of September.", vi: "Hai một chín. Bao giờ bắt đầu? Trang web ghi ngày 13 tháng Chín." },
        { who: "Receptionist", voice: "au-nu", text: "That's the enrolment deadline, I'm afraid. The first class is a week later, on the twentieth.", vi: "Tiếc là đó là hạn đăng ký. Buổi học đầu tiên muộn hơn một tuần, ngày 20." },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-kt-nghe-dang-ky-cau",
      title: "Questions 1–6",
      kind: "fill",
      items: [
        { q: "1. Surname: ___", answers: ["Whitlock", "WHITLOCK"] },
        { q: "2. Number of weeks: ___", answers: ["14", "fourteen"] },
        { q: "3. Course fee: £ ___", answers: ["235"] },
        { q: "4. Discount: ___ %", answers: ["17.5"] },
        { q: "5. Room ___", answers: ["219"] },
        { q: "6. First class: ___ September", answers: ["20", "20th", "twentieth"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 4a",
      items: [
        "**1 Whitlock** — đánh vần từng chữ. **2 — 14**: “used to run for **sixteen**… cut to **fourteen. One four**” (used to = trước đây; cụm đánh vần xác nhận). **3 — 235**: khách nghe nhầm 225, nhân viên sửa “**Thirty-five. Two three five**”.",
        "**4 — 17.5**: “**was** ten per cent last year… gone up to **seventeen point five**” — seventeen, không phải seventy. **5 — 219**. **6 — 20**: ngày 13 là **hạn đăng ký**; “first class… a week later, on the **twentieth**”.",
        "Sai ≥ 3 câu ở bài này ⇒ ôn **Ngày 5 · Nghe** (mục 1–6) và **Ngày 1 · Nghe** mục 3 (các kiểu bẫy Part 1).",
      ],
    },
    {
      t: "p",
      text: "**Bài 4b — Questions 7–13.** Một nhân viên giọng **Canada** giới thiệu Trung tâm Cộng đồng Riverside cho khách mới. **Questions 7–10:** Label the map. Write the correct letter, **A–E**. **Questions 11–13:** Choose the correct letter, **A, B or C**. Xem bản đồ 30 giây trước khi nghe. Bạn đi vào từ **cổng phía nam** (dưới cùng).",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Riverside Community Centre — ghi chữ cái A–E cho câu 7–10",
        note: "Bản đồ tự vẽ cho bài kiểm tra. Phía trên là hướng Bắc. Lối đi chính chạy thẳng từ cổng (nam) tới Main hall (bắc).",
        map: {
          cols: 12,
          rows: 9,
          paths: [{ x: 5.6, y: 1.8, w: 0.8, h: 6.6, label: "main path" }],
          boxes: [
            { x: 4.3, y: 0.2, w: 3.4, h: 1.5, label: "Main hall" },
            { x: 7.0, y: 6.4, w: 3.6, h: 1.6, label: "Car park" },
            { x: 1.4, y: 6.4, w: 3.6, h: 1.6, blank: "A" },
            { x: 1.4, y: 4.2, w: 3.6, h: 1.6, blank: "B" },
            { x: 1.4, y: 2.0, w: 3.6, h: 1.6, blank: "C" },
            { x: 7.0, y: 4.2, w: 3.6, h: 1.6, blank: "D" },
            { x: 7.0, y: 2.0, w: 3.6, h: 1.6, blank: "E" },
          ],
          pins: [{ x: 6.0, y: 8.7, label: "Entrance (south)" }],
        },
      },
    },
    {
      t: "table",
      head: ["Câu", "Địa điểm", "Chữ cái"],
      rows: [
        ["7", "Reception", "___"],
        ["8", "Bicycle shelter", "___"],
        ["9", "Art studio", "___"],
        ["10", "Café", "___"],
      ],
    },
    {
      t: "listen",
      id: "t3d6-kt-nghe-ban-do",
      title: "Welcome to Riverside Community Centre",
      dan: { so: "Checkpoint Test 1, Recording 2", boiCanh: "a member of staff welcoming new visitors to a community centre.", cau: [7, 13] },
      note: "Khoảng 2 phút 15 giây, một người nói, giọng Canada (nam). Nghe một lần.",
      lines: [
        { who: "Staff", voice: "ca-nam", text: "Hi, everybody, and welcome to Riverside Community Centre. Let me show you around on the map first. We're standing at the entrance, on the south side, and the main path runs straight ahead of us, north, to the main hall at the far end.", vi: "Chào mọi người, chào mừng tới Trung tâm Cộng đồng Riverside. Tôi chỉ trên bản đồ trước nhé. Chúng ta đang đứng ở cổng, phía nam, và lối đi chính chạy thẳng về phía bắc, tới hội trường chính ở cuối." },
        { who: "Staff", voice: "ca-nam", text: "As you come in, the car park is immediately on your right. Directly opposite it, on your left, there's a low building with a green roof. That used to be reception, but since last summer it's been the bicycle shelter.", vi: "Khi đi vào, bãi đỗ xe ngay bên phải. Đối diện nó, bên trái, có một toà thấp mái xanh. Chỗ đó từng là quầy lễ tân, nhưng từ hè năm ngoái nó là nhà để xe đạp." },
        { who: "Staff", voice: "ca-nam", text: "Reception has moved. If you keep walking up the path, it's the next building on the right, just beyond the car park. You'll need to sign in there on your first visit.", vi: "Lễ tân đã chuyển chỗ. Đi tiếp theo lối đi, đó là toà kế tiếp bên phải, ngay sau bãi đỗ xe. Lần đầu tới bạn cần đăng ký ở đó." },
        { who: "Staff", voice: "ca-nam", text: "Across the path from reception, on the left, is the art studio. A lot of people expect it to be beside the main hall, but that's actually the café, which is the last building on the left before you reach the hall. The building facing the café, on the right, is going to be a gym, but it isn't open yet.", vi: "Bên kia lối đi so với lễ tân, phía trái, là xưởng vẽ. Nhiều người tưởng nó nằm cạnh hội trường chính, nhưng chỗ đó thật ra là quán cà phê — toà cuối cùng bên trái trước khi tới hội trường. Toà đối diện quán cà phê, bên phải, sẽ là phòng gym nhưng chưa mở." },
        { who: "Staff", voice: "ca-nam", text: "Now, a few practical things. The centre is open from nine in the morning, seven days a week. On weekdays we close at nine thirty at night; on weekends it's earlier, at six.", vi: "Giờ là vài điều thực tế. Trung tâm mở từ 9 giờ sáng, bảy ngày một tuần. Ngày thường đóng lúc 9 rưỡi tối; cuối tuần sớm hơn, lúc 6 giờ." },
        { who: "Staff", voice: "ca-nam", text: "Membership costs forty dollars a year. That covers the building and the library, but not the classes. Those are paid for separately, and the money goes directly to the teachers.", vi: "Phí thành viên là 40 đô một năm. Khoản đó gồm việc dùng toà nhà và thư viện, nhưng không gồm các lớp học. Lớp học trả riêng, và tiền đi thẳng tới giáo viên." },
        { who: "Staff", voice: "ca-nam", text: "Finally, you might wonder who pays for all this. About half of our budget comes from the city council. The membership fees are only around a fifth, and the rest is raised through events like the summer fair. OK, let's start the tour.", vi: "Cuối cùng, có thể bạn thắc mắc ai chi trả cho tất cả những thứ này. Khoảng một nửa ngân sách đến từ hội đồng thành phố. Phí thành viên chỉ khoảng một phần năm, phần còn lại gây quỹ qua các sự kiện như hội chợ hè. Nào, bắt đầu tham quan." },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-kt-nghe-ban-do-cau",
      title: "Questions 7–10 — ghi chữ cái A–E",
      kind: "fill",
      items: [
        { q: "7. Reception ___", answers: ["D", "d"] },
        { q: "8. Bicycle shelter ___", answers: ["A", "a"] },
        { q: "9. Art studio ___", answers: ["B", "b"] },
        { q: "10. Café ___", answers: ["C", "c"] },
      ],
    },
    {
      t: "mcq",
      id: "t3d6-kt-nghe-ban-do-chon",
      title: "Questions 11–13 — A, B or C",
      items: [
        { q: "11. On Saturdays and Sundays, the centre closes at", options: ["A 6 p.m.", "B 9 p.m.", "C 9.30 p.m."], correct: 0, why: "“on weekends it's earlier, **at six**”. 9.30 là ngày thường; 9 là giờ **mở** (sáng)." },
        { q: "12. The annual membership fee does NOT include", options: ["A use of the building.", "B the library.", "C classes."], correct: 2, why: "“covers the building and the library, **but not the classes**”." },
        { q: "13. The largest part of the centre's budget comes from", options: ["A membership fees.", "B the city council.", "C events such as the summer fair."], correct: 1, why: "“About **half**… from the city council”; phí thành viên chỉ **a fifth** (20%); sự kiện = phần còn lại (~30%)." },
      ],
    },
    {
      t: "note",
      title: "Giải thích 4b (bản đồ)",
      items: [
        "**8 — A.** “Directly opposite [the car park], on your left… **used to be reception**, but… it's been the **bicycle shelter**” — bẫy thông tin cũ (used to).",
        "**7 — D.** “Reception has moved… **the next building on the right, just beyond the car park**”.",
        "**9 — B.** “**Across the path from reception**, on the left, is the art studio.” Bẫy: “people expect it to be beside the main hall”.",
        "**10 — C.** “the café… **the last building on the left** before you reach the hall”. E = gym chưa mở (phương án thừa).",
        "Sai ≥ 2 câu bản đồ ⇒ ôn **Ngày 4 · Nghe** (ngôn ngữ vị trí, giọng Canada). Sai câu 13 ⇒ ôn **Ngày 5 · Nghe** mục 2 (phân số ↔ %).",
      ],
    },

    /* ───────────── 5. Đọc ───────────── */
    { t: "h", text: "Phần 5 — Đọc (4 + 6 + 3 câu · đạt ≥ 9/13 · 22 phút · trượt thì ôn Ngày 1, 3, 5)" },
    {
      t: "p",
      text: "**Questions 1–4.** The passage has four paragraphs, **A–D**. Choose the correct heading for each paragraph from the list below. Write the correct number, **i–vii**.",
    },
    {
      t: "table",
      caption: "List of Headings",
      head: ["Số", "Heading"],
      rows: [
        ["i", "The rising cost of building prisons"],
        ["ii", "A punishment that often fails to prevent further crime"],
        ["iii", "Why judges prefer long sentences"],
        ["iv", "What offenders lose while they are inside"],
        ["v", "An alternative that is cheaper and more effective"],
        ["vi", "Public doubts that slow down reform"],
        ["vii", "How community service began"],
      ],
    },
    {
      t: "passage",
      title: "Do Short Prison Sentences Work?",
      intro: "Bài đọc tự soạn (~380 từ). Làm Questions 1–4 trước.",
      paras: [
        { label: "A", text: "In many countries, people convicted of minor offences such as shoplifting or vandalism are sent to prison for a few weeks or months. The logic seems obvious: a short, sharp punishment should teach the offender a lesson. The evidence, however, points in the opposite direction. Studies that have followed released prisoners over several years repeatedly find that those who served less than twelve months are more likely to commit another crime than similar offenders who were given a different penalty. Far from acting as a deterrent, a brief period behind bars appears to make reoffending more probable." },
        { label: "B", text: "Researchers explain this result by pointing to everything a person can lose in a short time. A sentence of three months is long enough for an offender to be dismissed from a job, to fall behind with the rent and to be evicted, and for family relationships to break down. It is not long enough, on the other hand, for the prison to offer any serious education or treatment for addiction, since such programmes usually last at least six months. The prisoner therefore walks out with the original problems unsolved and several new ones added." },
        { label: "C", text: "Community sentences are designed to avoid this damage. Instead of being locked up, the offender remains at home, keeps his or her job, and completes a fixed number of hours of unpaid work, often combined with compulsory treatment for drug or alcohol problems. Because no cell or guard is needed, supervising a person in the community costs the state a small fraction of the price of a prison place. More importantly, in the studies mentioned above, offenders given community sentences committed noticeably fewer new crimes than those who had been imprisoned for a short period." },
        { label: "D", text: "If the case is so strong, why have governments been slow to act? The main obstacle is not money but opinion. Surveys suggest that a large part of the public regards unpaid work as a soft option, and newspapers are quick to criticise judges whose sentences appear lenient. Politicians who depend on votes are understandably unwilling to be described as weak on crime. Some reformers believe that attitudes will shift only when community sentences become more visible — for example, when local residents can see offenders repairing parks and cleaning streets in their own neighbourhood." },
      ],
    },
    {
      t: "quiz",
      id: "t3d6-kt-doc-tieu-de",
      title: "Questions 1–4 — ghi số La Mã (i–vii)",
      kind: "fill",
      items: [
        { q: "1. Paragraph A ___", answers: ["ii"] },
        { q: "2. Paragraph B ___", answers: ["iv"] },
        { q: "3. Paragraph C ___", answers: ["v"] },
        { q: "4. Paragraph D ___", answers: ["vi"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 5–10.** Do the following statements agree with the information given in the passage? Write **TRUE**, **FALSE** or **NOT GIVEN**.",
    },
    {
      t: "mcq",
      id: "t3d6-kt-doc-tfng",
      title: "Questions 5–10 — True / False / Not Given",
      items: [
        { q: "5. People who serve under a year in prison reoffend less often than comparable offenders who receive other punishments.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "FALSE. Đoạn A: “those who served less than twelve months are **more likely** to commit another crime”. Câu hỏi đảo chiều so sánh (more → less)." },
        { q: "6. Three months in prison can be enough for a person to lose his or her home.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "TRUE. Đoạn B: “long enough… to fall behind with the rent and **to be evicted**”. evicted = lose one's home (đồng nghĩa)." },
        { q: "7. Prison education programmes are generally shorter than three months.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "FALSE. Đoạn B: “such programmes usually last **at least six months**”." },
        { q: "8. Most offenders on community sentences have drug or alcohol problems.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "NOT GIVEN. Đoạn C chỉ nói lao động công ích “**often combined with** compulsory treatment” — không nói **đa số** người thi hành án có vấn đề nghiện." },
        { q: "9. Keeping someone in prison is far more expensive than supervising that person in the community.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "TRUE. Đoạn C: supervising “costs the state **a small fraction of the price of a prison place**”. Đảo chiều so sánh + con số ↔ lời." },
        { q: "10. Judges themselves are opposed to community sentences.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "NOT GIVEN. Đoạn D nói báo chí **chỉ trích** thẩm phán có vẻ nhẹ tay; không nói thẩm phán nghĩ gì. Bẫy trùng chữ judges." },
      ],
    },
    {
      t: "p",
      text: "**Questions 11–13.** Mỗi cặp dưới đây là một câu trong bài và cách đề nói lại nó. Chọn **mức paraphrase** (Ngày 1 mục 4).",
    },
    {
      t: "mcq",
      id: "t3d6-kt-doc-paraphrase",
      title: "Questions 11–13 — Mức paraphrase",
      items: [
        { q: "11. Bài: “to fall behind with the rent and to be evicted” → Đề: “to lose his or her home”", options: ["A ① đồng nghĩa", "B ② đổi loại từ", "C ③ đổi cấu trúc", "D không phải paraphrase"], correct: 0, why: "be evicted ↔ lose one's home: thay cụm cùng nghĩa → mức ①." },
        { q: "12. Bài: “attitudes will shift” → Đề: “a shift in attitudes”", options: ["A ① đồng nghĩa", "B ② đổi loại từ", "C ④ ý ẩn", "D không phải paraphrase"], correct: 1, why: "shift (động từ) → a shift (danh từ): đổi loại từ → mức ②." },
        { q: "13. Bài: “supervising a person in the community costs a small fraction of the price of a prison place” → Đề: “keeping someone in prison is far more expensive than supervising that person in the community”", options: ["A ① đồng nghĩa", "B ② đổi loại từ", "C ③ đổi cấu trúc (đảo chiều so sánh)", "D ④ ý ẩn"], correct: 2, why: "Đảo chủ ngữ và chiều so sánh (A rẻ hơn B → B đắt hơn A) → mức ③ — chính là phép **P5 Đảo chiều so sánh** của Ngày 3 (kèm P6 con số ↔ lời: a small fraction ↔ far more)." },
      ],
    },
    {
      t: "note",
      title: "Giải thích Questions 1–4",
      items: [
        "**A — ii.** Ý chính sau **however**: án tù ngắn làm tái phạm **nhiều hơn** (“Far from acting as a deterrent…”). fails to prevent further crime = make reoffending more probable.",
        "**B — iv.** “everything a person can **lose** in a short time”: việc làm, nhà, gia đình. while they are inside = trong tù.",
        "**C — v.** Án cộng đồng: “a small fraction of the price” (cheaper) + “noticeably fewer new crimes” (more effective). Bẫy **vii**: đoạn tả án cộng đồng **là gì**, không kể nó **bắt đầu** thế nào.",
        "**D — vi.** “The main obstacle is **not money but opinion**” — dư luận coi là nhẹ tay ⇒ chính phủ chậm cải cách. Bẫy **iii**: có chữ judges nhưng đoạn không nói thẩm phán thích án dài. Bẫy **i**: “not money”.",
        "Sai ≥ 2 câu headings ⇒ ôn **Ngày 5 · Đọc** (mục 2–4). Sai ≥ 3 câu TFNG ⇒ ôn **Ngày 3 · Đọc**. Sai câu 11–13 ⇒ ôn **Ngày 1 · Đọc** mục 4.",
      ],
    },

    /* ───────────── 6. Viết ───────────── */
    { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 2, 4, 6)" },
    {
      t: "mcq",
      id: "t3d6-kt-viet-chon",
      title: "6a. Kiến thức viết band 6 (6 câu · đạt ≥ 5/6)",
      items: [
        { q: "1. Theo band descriptors, điều gì tách Task Response band 6 khỏi band 5?", options: ["A Bài dài hơn 350 từ", "B Trả lời đủ MỌI phần của đề, lập trường rõ xuyên suốt", "C Không có lỗi ngữ pháp nào", "D Dùng thật nhiều từ nối"], correct: 1, why: "Band 5: chỉ trả lời một phần; band 6: đủ mọi phần dù có phần kỹ hơn. (Ngày 2 · Ngày 6)" },
        { q: "2. Overview Task 1 band 6 cần gì?", options: ["A Hai điểm nổi bật nhất, không kèm số liệu chi tiết", "B Mọi con số của hình", "C Ý kiến của người viết về nguyên nhân", "D Chép lại đề bài"], correct: 0, why: "Overview = 2 điểm nổi bật (chiều chung, ai nhất, đổi ngôi…), không số. (Ngày 4)" },
        { q: "3. Biểu đồ có năm 2030 và 2040 (dự báo). Câu nào đúng?", options: ["A In 2040 the figure rose to 60%.", "B In 2040 the figure has risen to 60%.", "C In 2040 the figure is rising to 60%.", "D The figure is projected to rise to 60% by 2040."], correct: 3, why: "Năm tương lai → ngôn ngữ dự báo. (Ngày 5)" },
        { q: "4. Đề: “The best way to reduce crime is to give longer prison sentences.” Thesis nào có mức độ và bám chữ tuyệt đối?", options: ["A I agree with this view.", "B This essay will discuss crime.", "C I partly agree: longer sentences may deter some criminals, but they are not the best way to reduce crime.", "D Crime is a serious problem nowadays."], correct: 2, why: "partly + phản đối đúng chữ **the best way**. (Ngày 6)" },
        { q: "5. Câu nào là phản đề ĐÃ được bác?", options: ["A However, prison is also necessary.", "B Admittedly, prison keeps dangerous people off the streets; however, most prisoners are released within a few years.", "C Some people support prison.", "D Prison is expensive and it is necessary."], correct: 1, why: "Nhượng bộ + bác. (Ngày 6)" },
        { q: "6. Sau khi AI chấm bài, việc nào ĐÚNG với cách dùng sổ lỗi (Ngày 2)?", options: ["A Chép lại cả bài cho đẹp", "B Chỉ ghi điểm số", "C Xoá bài, viết đề khác", "D Ghi câu sai – mã lỗi – câu sửa – quy tắc tự viết vào Sổ lỗi theo mã, rồi viết lại phần yếu"], correct: 3, why: "Sổ lỗi theo mã (Ngày 2 · Viết mục 6): mỗi lỗi một dòng có mã (A, S, T, P, W, L, C, I) + bản sửa + quy tắc tự viết; rồi viết lại có chủ đích (Ngày 2 · mục 7). (Ngày 2)" },
      ],
    },
    {
      t: "p",
      text: "**6b — Task 1 (20 phút, ≥ 150 từ).** Biểu đồ dưới có **hai năm dự báo**. Overview phải nêu **2 điểm** (Ngày 4) và bao **cả phần dự báo** (Ngày 5).",
    },
    {
      t: "chart",
      kind: "line",
      title: "Government spending on three areas in one country, as a percentage of the national budget, 2000–2040 (2030 and 2040 are projections)",
      unit: "%",
      labels: ["2000", "2010", "2020", "2030*", "2040*"],
      series: [
        { name: "Health care", values: [12, 15, 19, 23, 27] },
        { name: "Education", values: [16, 16, 15, 15, 14] },
        { name: "Defence", values: [14, 11, 8, 7, 6] },
      ],
    },
    {
      t: "essay",
      id: "t3d6-kt-viet-task1",
      task: "Task 1",
      prompt: "The line graph shows the percentage of the national budget that the government of one country spent on health care, education and defence between 2000 and 2020, with projections for 2030 and 2040. (Health care: 12 – 15 – 19 – 23* – 27*; Education: 16 – 16 – 15 – 15* – 14*; Defence: 14 – 11 – 8 – 7* – 6*; * = projection.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Overview **2 điểm, không số**: (1) health care tăng mạnh và được dự báo tiếp tục tăng, trong khi defence giảm; (2) education gần như không đổi / health care vượt education để thành khoản lớn nhất.",
        "2000–2020: quá khứ đơn. 2030–2040: **is projected / expected / forecast to**, **followed by a projected rise to**, **before being expected to**, **will have + V3 by 2040**.",
        "Nhóm số liệu: thân 1 = health care (tăng) · thân 2 = education + defence (đi ngang / giảm).",
        "Từ Ngày 6: **public expenditure on · the health budget · allocate … to**.",
      ],
    },
    {
      t: "p",
      text: "**6c — Task 2 (40 phút, ≥ 250 từ).** Đề Opinion có **hai vế** và **chữ tuyệt đối**. Trước khi viết: gạch vế, khoanh chữ bám, chọn mức độ.",
    },
    {
      t: "essay",
      id: "t3d6-kt-viet-task2",
      task: "Task 2",
      prompt: "Some people think that the only effective way to reduce crime is for governments to spend more money on the police, and that money spent on education and youth programmes is wasted. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Hai vế: ① chi thêm cho cảnh sát = **the only effective way**; ② tiền cho giáo dục, chương trình thanh niên là **wasted**. Bàn **cả hai**.",
        "Thesis có **mức độ** (largely / partly agree / disagree) và kết bài **giữ đúng mức đó**.",
        "Đúng **một** phản đề có bác: Admittedly, … However, …",
        "Từ Ngày 4 + Ngày 6: **deterrent · reoffend · rehabilitation · crime rate · allocate funding to · taxpayers' money · in the long term**.",
        "Soát mạo từ (Ngày 3): **the police** (luôn có the, động từ số nhiều) · **crime** (Ø, nói chung) · **the government / governments**.",
      ],
    },

    /* ───────────── 7. Nói ───────────── */
    { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + 3 câu Part 3 · AI ≥ band 5.5 · trượt thì ôn Ngày 2, 3, 6)" },
    {
      t: "p",
      text: "**Part 1**: mỗi câu 2–4 câu, nhận ra **khung câu hỏi** (Ngày 3) để mở đầu đúng. **Part 3**: mỗi câu 30–45 giây theo khung **báo trước → lý do 1 + ví dụ → lý do 2 + ví dụ → chốt** (Ngày 6).",
    },
    {
      t: "speak",
      id: "t3d6-kt-noi-p1",
      part: "1",
      questions: [
        "What kind of weather do you like most?",
        "How often do you go shopping for clothes?",
        "Has the way people shop in your country changed in recent years?",
        "Do you prefer shopping online or in shops?",
      ],
    },
    {
      t: "speak",
      id: "t3d6-kt-noi-p3",
      part: "3",
      questions: [
        "Why do you think some young people commit crimes?",
        "Why do some people think governments should spend more on education than on prisons?",
        "Why is it that people in different age groups often want different things from the government?",
      ],
    },
    {
      t: "note",
      title: "Tự kiểm sau khi ghi âm (đối chiếu tiêu chí band 6 — Ngày 2)",
      items: [
        "**FC**: Part 3 có câu báo trước và câu chốt không? Có ngắt quá 3 giây giữa câu không?",
        "**LR**: mỗi câu Part 3 có ít nhất **một cụm chủ đề** (crime rate, deterrent, public spending, taxpayers' money…)? Có luân phiên cụm nguyên nhân thay vì chỉ because?",
        "**GRA**: có ít nhất một câu phức mỗi câu trả lời (because / which / whereas / if)?",
        "**P**: nghe lại — **far‿away**, **more‿often**, **more‿and more** có nối /r/ không (Ngày 3)? vote, law, lot có ba nguyên âm khác nhau không (Ngày 6)?",
      ],
    },

    /* ───────────── 8. Phát âm ───────────── */
    { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại ba khối có máy chấm)" },
    {
      t: "mcq",
      id: "t3d6-kt-phat-am",
      title: "8. Âm nào? (8 câu)",
      items: [
        { q: "1. Từ nào có âm /ʃ/ (không phải /s/)?", options: ["A see", "B sure", "C city", "D science"], correct: 1, why: "sure /ʃɔː/. see, city, science bắt đầu bằng /s/. (Ngày 1)" },
        { q: "2. Cặp nào khác nhau ở /r/ – /l/?", options: ["A ship – sheep", "B van – fan", "C right – light", "D cheap – jeep"], correct: 2, why: "right /raɪt/ – light /laɪt/. (Ngày 1)" },
        { q: "3. Từ nào có nguyên âm /ʌ/?", options: ["A cat", "B bed", "C cart", "D cup"], correct: 3, why: "cup /kʌp/ · cat /æ/ · bed /e/ · cart /ɑː/. (Ngày 2)" },
        { q: "4. Trong giọng Anh, chỗ nào có nối /r/ (linking r)?", options: ["A far‿away", "B far from", "C car park", "D four people"], correct: 0, why: "Chữ r cuối từ chỉ đọc khi từ sau bắt đầu bằng **nguyên âm**: far‿away. (Ngày 3)" },
        { q: "5. Từ nào bắt đầu bằng /ð/ (hữu thanh)?", options: ["A theft", "B these", "C think", "D three"], correct: 1, why: "these /ðiːz/. theft, think, three bắt đầu bằng /θ/. (Ngày 4)" },
        { q: "6. Nghe “SIXty” (nhấn âm đầu, không /n/ cuối). Con số là:", options: ["A 16", "B 6", "C 60", "D 66"], correct: 2, why: "-ty nhấn đầu, kết thúc /i/ ngắn. (Ngày 5)" },
        { q: "7. Từ nào có âm /əʊ/?", options: ["A law", "B cost", "C reform", "D vote"], correct: 3, why: "vote /vəʊt/. law, reform /ɔː/ · cost /ɒ/. (Ngày 6)" },
        { q: "8. Cặp nào khác nhau ở /ɔː/ – /ɒ/?", options: ["A short – shot", "B coat – cot", "C low – law", "D boat – bought"], correct: 0, why: "short /ʃɔːt/ – shot /ʃɒt/. Các cặp còn lại có /əʊ/. (Ngày 6)" },
      ],
    },
    {
      t: "note",
      title: "📌 Đọc lại ba khối phát âm có máy chấm",
      items: [
        "Mỗi ngày của Tập 3 có **một khối phát âm** chấm bằng máy. Bài kiểm tra không lặp lại khối mới; hãy mở lại và đọc **một lượt** ba khối sau, ghi điểm:",
        "**Ngày 1 · Nghe mục 6** — bốn cặp phụ âm /s/–/ʃ/, /tʃ/–/dʒ/, /v/–/w/–/f/, /r/–/l/.",
        "**Ngày 5 · Nghe mục 6** — thirteen / thirty … nineteen / ninety.",
        "**Ngày 6 · Nói mục 8** — /ɔː/ – /ɒ/ – /əʊ/.",
        "Đạt = đa số dòng **≥ 70 điểm**. Dòng nào dưới 70 thì luyện riêng dòng đó 3 lần rồi đo lại. Còn thời gian thì đọc thêm khối của Ngày 2 (/æ/ /e/ /ʌ/), Ngày 3 (linking /r/), Ngày 4 (/θ/ /ð/ /dʒ/).",
      ],
    },

    /* ───────────── Kết ───────────── */
    { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
    {
      t: "table",
      caption: "Ghi điểm của bạn",
      head: ["Phần", "Điểm của bạn", "Ngưỡng đạt", "Đạt?"],
      rows: [
        ["1. Ngữ pháp", "___ / 24", "17", ""],
        ["2. Từ vựng", "___ / 18", "13", ""],
        ["3. Dịch", "___ / 6", "5", ""],
        ["4. Nghe", "___ / 13", "9", ""],
        ["5. Đọc", "___ / 13", "9", ""],
        ["6. Viết", "6a ___ / 6 · Task 1 band ___ · Task 2 band ___", "5 · 5.5 · 5.5", ""],
        ["7. Nói", "band ___", "5.5", ""],
        ["8. Phát âm", "___ / 8 · ba khối đọc lại", "6 · đa số dòng ≥ 70", ""],
      ],
    },
    {
      t: "note",
      title: "Đọc kết quả",
      items: [
        "**Đạt cả 8 phần** → sang **Ngày 7**. Bạn đang đúng nhịp để tới band 5.5 ở Đề 4 (Ngày 15).",
        "**Trượt 1–2 phần** → ôn đúng Ngày ghi ở bảng đầu bài (chỉ mục được nêu, không học lại cả ngày), làm lại **riêng phần đó** sau 2 ngày, rồi vẫn sang Ngày 7.",
        "**Trượt ≥ 3 phần** → dừng 2–3 ngày: làm lại Bài tập của các Ngày liên quan, đọc lại sổ lỗi, rồi làm lại cả bài kiểm tra.",
        "Trượt **Nghe + Đọc** cùng lúc thường do **paraphrase** → ưu tiên Ngày 1 · Đọc mục 4 và Ngày 3 · Đọc mục 2.",
        "Trượt **Viết** vì TR → Ngày 6 · Viết mục 2 (đếm vế); vì overview → Ngày 4 · Viết mục 2.",
      ],
    },
  ],
};

export const NGAY_6: Lesson[] = [T3D6_TU_VUNG, T3D6_VIET, T3D6_NOI, T3D6_BAI_TAP, T3D6_KIEM_TRA];
