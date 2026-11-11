/**
 * Ngày 12 — Reading: True / False / Not Given · Writing: Task 1 biểu đồ theo thời
 * gian 2 (viết trọn bài line / bar: mở bài paraphrase, overview, 2 thân bài) ·
 * Speaking: câu hỏi nêu quan điểm (Part 1 & Part 3) · Homework.
 *
 * Tự soạn (xem ../SOAN-BAI.md và bản giao việc 12/11/2026). Bài đọc về lịch sử xe
 * đạp chỉ dùng những mốc phổ biến, chắc chắn (xe đạp đẩy chân đầu thế kỷ 19, xe bánh
 * trước khổng lồ, “safety bicycle” thập niên 1880, lốp hơi, Amsterdam 1965, Paris
 * 2007, khủng hoảng dầu đầu thập niên 1970) và viết chung chung ở chỗ không chắc —
 * câu hỏi chỉ kiểm thông tin TRONG BÀI. Mọi số liệu biểu đồ là số tự đặt; bài mẫu
 * Task 1 đã đối chiếu từng con số với `figure`.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D12_READING: Lesson = {
  id: "d12-doc",
  kind: "reading",
  title: "Đọc: True / False / Not Given",
  goal: "Phân biệt chắc chắn TRUE (bài nói giống), FALSE (bài nói ngược) và NOT GIVEN (bài không nói) bằng sơ đồ quyết định 2 câu hỏi, nhận ra bẫy từ chỉ mức độ (all, most, only, always), so sánh và nguyên nhân.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Dạng **True / False / Not Given** (TFNG): đọc một câu nhận định, so với **thông tin trong bài**.",
        "==TRUE== = bài nói **cùng ý** · ==FALSE== = bài nói **ngược ý** · ==NOT GIVEN== = bài **không nói** đủ để biết.",
        "Sơ đồ quyết định **2 câu hỏi**: (1) Bài có nói về **đúng ý này** không? Không → NOT GIVEN. (2) Có → **giống hay ngược**? Giống → TRUE, ngược → FALSE.",
        "Bẫy lớn nhất: **từ chỉ mức độ** (all / most / some · always / often · only · the first · more than) và **kiến thức ngoài bài** — chỉ dùng thông tin TRONG bài.",
        "Câu hỏi TFNG **đi theo thứ tự** bài đọc (khác Matching Features Ngày 10). Luyện 10 câu + 24 từ vựng về xe đạp và giao thông.",
      ],
    },
    { t: "h", text: "1. TRUE, FALSE hay NOT GIVEN?" },
    {
      t: "p",
      text: "Đề cho một loạt **câu nhận định** (statements). Với mỗi câu, bạn trả lời **TRUE** nếu câu đó **khớp** với thông tin trong bài, **FALSE** nếu câu đó **trái ngược** với thông tin trong bài, và **NOT GIVEN** nếu **bài không có thông tin** để khẳng định hay phủ định. Câu hỏi đi **theo thứ tự** bài đọc: đáp án câu 3 nằm sau đáp án câu 2.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba đáp án — bài đọc: “The café opens at 7 a.m. and serves only vegetarian food.”",
      cols: [
        { title: "TRUE — giống", anh: "check-mark-button", items: ["The café does not serve meat.", "only vegetarian food = không có thịt", "Nói **cùng một ý**, bằng lời khác"] },
        { title: "FALSE — ngược", anh: "cross-mark", items: ["The café opens in the afternoon.", "7 a.m. ≠ buổi chiều", "Bài nói **điều trái lại**"] },
        { title: "NOT GIVEN — không nói", anh: "red-question-mark", items: ["The café is popular with students.", "Bài không nhắc khách là ai", "**Không thể biết** từ bài"] },
      ],
      caption: "FALSE cần một câu trong bài NÓI NGƯỢC lại. Nếu bạn phải đoán, phải suy diễn hoặc dùng hiểu biết riêng → thường là NOT GIVEN.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Sơ đồ quyết định TRUE / FALSE / NOT GIVEN",
      steps: [
        { label: "Gạch từ khoá câu hỏi", sub: "tên riêng, số, năm + **từ mức độ** (all, most, only, always, more than, the first)" },
        { label: "Tìm vị trí trong bài", sub: "câu hỏi đi **theo thứ tự**; dò tên / số / từ đồng nghĩa" },
        { label: "Hỏi 1: Bài có nói về ĐÚNG ý này?", sub: "**Không** (chỉ nói chủ đề gần giống, hoặc thiếu một phần) → **NOT GIVEN**" },
        { label: "Hỏi 2: Có → giống hay ngược?", sub: "**Giống** → **TRUE** · **Ngược** → **FALSE**" },
        { label: "Soát bẫy mức độ", sub: "most ≠ all · often ≠ always · cheaper ≠ more expensive · một lý do ≠ lý do chính" },
      ],
      caption: "Luôn hỏi câu 1 TRƯỚC câu 2. Người mới hay nhảy thẳng sang “giống hay khác” và chọn FALSE cho những câu thật ra là NOT GIVEN.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Gạch từ khoá", "Gạch **chủ thể** (ai / cái gì), **hành động**, và mọi **từ chỉ mức độ, số lượng, thời gian, so sánh**.", "Đề hay đổi **một từ nhỏ** để biến TRUE thành FALSE: most → **all**, often → **always**, cheaper → **more expensive**."],
        ["2. Tìm vị trí", "Dò **tên riêng, số, năm** (không bị đổi) hoặc **từ đồng nghĩa** của từ khoá.", "Vì đi theo thứ tự, câu 4 nằm **sau** câu 3. Không thấy câu 4 thì xem câu 5 có nằm ngay sau câu 3 không — câu 4 ở giữa."],
        ["3. Hỏi: bài có nói đúng ý này?", "Đọc kỹ **1–2 câu** ở vị trí đó. Bài có đề cập **đúng điều** câu hỏi khẳng định không?", "Bài nói về **chủ đề gần giống** nhưng không nói **đúng điều đó** (ví dụ: nói có biểu tình, không nói **ai tổ chức**) → **NOT GIVEN**."],
        ["4. Hỏi: giống hay ngược?", "So **từng phần** của câu hỏi với câu trong bài.", "Mọi phần đều khớp → **TRUE**. Một phần **trái ngược rõ ràng** → **FALSE**."],
        ["5. Soát lại", "Đọc lại từ chỉ mức độ, phủ định (not, never, no longer), và quan hệ nguyên nhân.", "Đừng đổi đáp án vì “nghe có vẻ đúng ngoài đời”. Chỉ có **bài đọc** là căn cứ."],
      ],
    },
    {
      t: "table",
      caption: "Bẫy thường gặp — câu hỏi đổi một từ nhỏ",
      head: ["Bài đọc nói", "Câu hỏi nói", "Đáp án", "Vì sao"],
      rows: [
        ["**Most** students passed.", "**All** students passed.", "FALSE", "most (hầu hết) ≠ all (tất cả): có người trượt."],
        ["She **often** works late.", "She **always** works late.", "FALSE", "often ≠ always."],
        ["E-bikes cost **considerably more**.", "E-bikes are **cheaper**.", "FALSE", "Ngược nghĩa so sánh."],
        ["There were **protests**.", "The protests were organised **by parents**.", "NOT GIVEN", "Bài nói có biểu tình, **không nói ai tổ chức**."],
        ["Sales **rose** in 2020.", "Sales rose **because of** the new advert.", "NOT GIVEN", "Bài không nói **nguyên nhân**."],
        ["It was **one of the first** cars.", "It was **the first** car.", "NOT GIVEN", "“một trong những chiếc đầu tiên” không khẳng định cũng không phủ định “chiếc đầu tiên”."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng TFNG",
      items: [
        "Dùng **kiến thức ngoài bài**: câu hỏi “Water boils at 100°C” — bạn biết là đúng, nhưng nếu **bài không nói** thì đáp án vẫn là **NOT GIVEN**.",
        "Nhầm **FALSE** với **NOT GIVEN**: “bài không nhắc đến” KHÔNG có nghĩa là “sai”. FALSE phải có câu trong bài **nói ngược lại**.",
        "Thấy **nhiều từ trùng** với bài là chọn TRUE. Đề cố ý dùng từ trùng rồi đổi **một chữ** (most → all, before → after).",
        "Viết đáp án **Yes / No** khi đề hỏi True / False (và ngược lại). Đề **thông tin** dùng True / False / Not Given; đề hỏi **quan điểm người viết** dùng **Yes / No / Not Given** (học ở ngày sau). Viết sai loại chữ là **mất điểm** dù hiểu đúng.",
        "Viết tắt T / F / NG trên phiếu thi giấy thường vẫn được chấp nhận, nhưng **an toàn nhất** là viết đầy đủ TRUE / FALSE / NOT GIVEN.",
      ],
    },
    {
      t: "rule",
      formula: "Bài có nói ĐÚNG ý này? — Không → NOT GIVEN · Có → giống → TRUE · ngược → FALSE",
      vi: "Chỉ dùng thông tin trong bài. Soát từ mức độ: all / most / some · always / often · only · more / less · the first.",
    },
    { t: "h", text: "2. Làm thử với đoạn ngắn" },
    {
      t: "examples",
      items: [
        { en: "The new reading room at Lakeside Library opened in March. It has 60 seats, and it is free for library members. Most visitors are university students.", vi: "Phòng đọc mới ở Thư viện Lakeside mở cửa vào tháng Ba. Phòng có 60 chỗ ngồi và miễn phí cho thành viên thư viện. Phần lớn khách là sinh viên đại học." },
      ],
    },
    {
      t: "mcq",
      id: "d12-doc-thu",
      title: "Làm thử — TRUE / FALSE / NOT GIVEN (3 câu)",
      items: [
        { q: "(a) The reading room has fewer than 50 seats.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Bài nói **60 seats** → “fewer than 50” **trái ngược** với số trong bài → **FALSE**." },
        { q: "(b) The new reading room is more popular than the old one.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Hỏi 1: bài có nói gì về **phòng cũ** không? **Không** → không so sánh được → **NOT GIVEN**." },
        { q: "(c) University students make up the majority of visitors.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "**Most visitors** are university students = students **make up the majority** (chiếm đa số) → cùng ý → **TRUE**." },
      ],
    },

    { t: "h", text: "3. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc soạn riêng cho khoá học, **7 đoạn A–G** (khoảng 700 từ) về lịch sử xe đạp trong thành phố — dài và khó hơn bài Ngày 10. Bài có nhiều **số, năm, so sánh và từ chỉ mức độ** — đúng “đất diễn” của dạng TFNG. Đọc lướt cả bài một lượt (2–3 phút) để nắm ý từng đoạn, rồi làm câu 1–10 theo sơ đồ quyết định.",
    },
    {
      t: "passage",
      title: "The Bicycle and the City",
      intro: "Bài đọc 7 đoạn (A–G). Questions 1–10 ở ngay bên dưới.",
      paras: [
        {
          label: "A",
          text: "When the first bicycles appeared in the early nineteenth century, few people saw them as a serious form of transport. These early machines had no pedals at all: riders sat on a wooden frame and pushed themselves along with their feet. Because the wheels were made of wood and had no rubber, riding over the rough roads of the time was also extremely uncomfortable. Later in the century, designers attached pedals directly to a huge front wheel. This made the machines faster, but it also made them dangerous, since a rider who hit a stone could easily be thrown over the handlebars. For several decades, cycling remained a hobby for young men with money and courage.",
        },
        {
          label: "B",
          text: "Everything changed in the 1880s with the arrival of the so-called 'safety bicycle'. It had two wheels of similar size and a chain that connected the pedals to the back wheel, which is essentially the design that most people still ride today. Soon afterwards, air-filled rubber tyres made riding far more comfortable. As factories began to produce bicycles in large numbers, prices fell, and cycling quickly became popular with office workers, factory workers and, importantly, women, for whom the bicycle offered a new kind of independence.",
        },
        {
          label: "C",
          text: "In the first half of the twentieth century, bicycles filled the streets of many European cities. After the Second World War, however, cars became cheaper and more common, and cities were increasingly redesigned around motor traffic. Wide roads replaced narrow streets, car parks replaced squares, and cycling began to look old-fashioned and unsafe. For many young families, owning a car became a sign of success, and some bicycle shops closed as their customers moved on. In many places, the number of journeys made by bicycle fell steadily for several decades.",
        },
        {
          label: "D",
          text: "Some countries later chose a different path. In the Netherlands, a sharp rise in road deaths in the early 1970s, many of them children, led to large public protests. At around the same time, an international oil crisis made fuel suddenly expensive. Together, these events persuaded Dutch politicians to invest in separate cycle paths and to slow down traffic in residential streets. Planners also began to treat the bicycle as a serious form of transport rather than a toy, and at many busy junctions cyclists were given their own traffic lights. Today, cycling is an ordinary part of daily life there for people of all ages, from schoolchildren to grandparents.",
        },
        {
          label: "E",
          text: "Shared bicycles are another idea with a surprisingly long history. In 1965, a group of young activists in Amsterdam painted bicycles white and left them on the streets for anyone to use free of charge. The plan did not last long, and within a short time most of the bicycles had disappeared. Modern schemes solve this problem with technology. When Paris launched its large bike-sharing system in 2007, users unlocked each bicycle at a docking station and paid a small fee, although the first half hour of each trip was free. Today many systems around the world are operated through mobile phone apps.",
        },
        {
          label: "F",
          text: "The latest change is electric power. An electric bicycle, or e-bike, has a small motor that helps the rider when pedalling, which makes hills and long distances much easier. The battery can usually be charged from an ordinary socket at home. For this reason, e-bikes appeal to older people and to commuters who do not want to arrive at work hot and tired. In some countries, e-bikes now account for a large share of all new bicycles sold, although they cost considerably more than ordinary models. Because e-bikes are faster, some cities have also introduced speed limits for them on cycle paths.",
        },
        {
          label: "G",
          text: "Supporters of cycling point to clear benefits: bicycles take up little space, produce no exhaust fumes and give riders regular exercise. Critics reply that cycling is not practical for everyone, especially in very hot or wet climates or for people who need to carry heavy loads. They also point out that building cycle paths in old cities with narrow streets can be very expensive. Most transport experts agree, however, that the bicycle works best not as a replacement for buses and trains but as one part of a wider transport system.",
        },
      ],
    },
    { t: "h", text: "Questions 1–10" },
    {
      t: "p",
      text: "Do the following statements agree with the information given in the reading passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this. — **Câu nhận định có khớp với thông tin trong bài không?**",
    },
    {
      t: "mcq",
      id: "d12-doc-cau",
      title: "Questions 1–10 — TRUE / FALSE / NOT GIVEN",
      items: [
        {
          q: "(1) The earliest bicycles were moved by the riders pushing their feet against the ground.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 0,
          why: "Đoạn **A**: “These early machines **had no pedals at all**: riders… **pushed themselves along with their feet**.” Không có bàn đạp, đẩy bằng chân → cùng ý → **TRUE**.",
        },
        {
          q: "(2) Bicycles with a very large front wheel were safer than earlier models.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 1,
          why: "Đoạn **A**: bánh trước khổng lồ “made the machines faster, but it **also made them dangerous**”. Câu hỏi nói **safer** (an toàn hơn) → **ngược** → **FALSE**.",
        },
        {
          q: "(3) The safety bicycle was designed by a factory owner.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 2,
          why: "Đoạn **B** tả **thiết kế** (hai bánh bằng nhau, xích) và nói **factories** sản xuất hàng loạt, nhưng **không nói ai thiết kế**. Hỏi 1: bài có nói đúng ý này? Không → **NOT GIVEN**. Bẫy: chữ “factories” có trong đoạn.",
        },
        {
          q: "(4) Falling prices helped a wider range of people to take up cycling.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 0,
          why: "Đoạn **B**: “As factories began to produce bicycles in large numbers, **prices fell**, and cycling quickly became popular with **office workers, factory workers and… women**.” — trước đó chỉ là thú vui của **young men with money** (đoạn A). Nhiều nhóm người hơn = **a wider range of people** → **TRUE**.",
        },
        {
          q: "(5) Cycling became more popular in European cities after the Second World War.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 1,
          why: "Đoạn **C**: After the Second World War… cycling began to look **old-fashioned and unsafe**… the number of journeys made by bicycle **fell steadily**. Câu hỏi nói **more popular** → **ngược** → **FALSE**.",
        },
        {
          q: "(6) The Dutch protests of the 1970s were organised mainly by parents.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 2,
          why: "Đoạn **D**: road deaths, “many of them **children**, led to large public **protests**”. Bài nói **có** biểu tình và nạn nhân là trẻ em, nhưng **không nói ai tổ chức**. Đoán “chắc là bố mẹ” là **suy diễn** → **NOT GIVEN**.",
        },
        {
          q: "(7) People did not have to pay to use the white bicycles in Amsterdam.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 0,
          why: "Đoạn **E**: “left them on the streets for anyone to use **free of charge**.” free of charge (miễn phí) = **did not have to pay** → **TRUE**.",
        },
        {
          q: "(8) E-bikes are cheaper than ordinary bicycles.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 1,
          why: "Đoạn **F**: “they **cost considerably more** than ordinary models.” cost more = **đắt hơn** → câu hỏi “cheaper” **ngược** → **FALSE**.",
        },
        {
          q: "(9) Cycling is more popular in cold countries than in hot ones.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 2,
          why: "Đoạn **G**: critics nói cycling **not practical** in very hot or wet climates — đó là **ý kiến của người phản đối**, không phải **số liệu về mức độ phổ biến** ở nước nóng hay lạnh. Bài **không so sánh** → **NOT GIVEN**. Bẫy: rất dễ chọn TRUE vì “nghe hợp lý”.",
        },
        {
          q: "(10) Most transport experts believe bicycles should replace buses and trains.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          correct: 1,
          why: "Đoạn **G**: “the bicycle works best **not as a replacement for buses and trains** but as one part of a wider transport system.” → **ngược** → **FALSE**. Có cả “Most transport experts” trùng từ — đúng kiểu bẫy “nhiều từ trùng nhưng ý ngược”.",
        },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại 10 câu: TRUE 3 · FALSE 4 · NOT GIVEN 3",
      items: [
        "Ba câu **NOT GIVEN** (3, 6, 9) đều có **từ trùng** trong bài (factories, protests, hot climates) — nhưng bài **không nói đúng điều** câu hỏi khẳng định. Đây là lý do phải hỏi câu 1 của sơ đồ **trước**.",
        "Bốn câu **FALSE** (2, 5, 8, 10) đều bị đổi **một ý then chốt**: dangerous → safer · fell → more popular · cost more → cheaper · not as a replacement → should replace.",
        "Đáp án đi **đúng thứ tự** bài: câu 1–2 ở đoạn A, 3–4 ở B, 5 ở C, 6 ở D, 7 ở E, 8 ở F, 9–10 ở G.",
      ],
    },

    { t: "h", text: "4. Từ vựng của bài đọc (24 từ)" },
    {
      t: "vocab",
      items: [
        { w: "bicycle", pos: "n", ipa: "/ˈbaɪsɪkl/", vi: "xe đạp", ex: "I ride my bicycle to the market every morning.", exVi: "Sáng nào tôi cũng đạp xe ra chợ.", more: "Văn nói: **bike**. **ride** a bicycle (không ~~drive~~) · **by** bicycle / **on** a bicycle.", anh: "bicycle" },
        { w: "transport", pos: "n", ipa: "/ˈtrænspɔːt/", vi: "giao thông, phương tiện đi lại", ex: "Public transport in my city is cheap but slow.", exVi: "Giao thông công cộng ở thành phố tôi rẻ nhưng chậm.", more: "Không đếm được: **public transport** · **a form / means of transport**. Mỹ hay dùng **transportation**." },
        { w: "pedal", pos: "n, v", ipa: "/ˈpedl/", vi: "bàn đạp; đạp (xe)", ex: "Push the pedals harder when you go uphill.", exVi: "Đạp mạnh hơn khi lên dốc." , more: "V-ing: **pedalling** (Anh) / **pedaling** (Mỹ)." },
        { w: "frame", pos: "n", ipa: "/freɪm/", vi: "khung (xe, kính, tranh)", ex: "This bike has a light metal frame.", exVi: "Chiếc xe này có khung kim loại nhẹ." },
        { w: "wheel", pos: "n", ipa: "/wiːl/", vi: "bánh xe", ex: "The front wheel of my bike is bent.", exVi: "Bánh trước xe tôi bị cong.", more: "**steering wheel** = vô-lăng. **front / back** wheel.", anh: "wheel" },
        { w: "handlebars", pos: "n", ipa: "/ˈhændlbɑːz/", vi: "ghi-đông, tay lái xe đạp / xe máy", ex: "Keep both hands on the handlebars.", exVi: "Giữ cả hai tay trên ghi-đông.", more: "Thường **số nhiều**." },
        { w: "courage", pos: "n", ipa: "/ˈkʌrɪdʒ/", vi: "sự can đảm", ex: "It takes courage to speak English in front of the class.", exVi: "Cần can đảm để nói tiếng Anh trước lớp.", more: "Tính từ **courageous**. Động từ **encourage** (khuyến khích)." },
        { w: "arrival", pos: "n", ipa: "/əˈraɪvl/", vi: "sự xuất hiện, sự đến", ex: "The arrival of smartphones changed how we read news.", exVi: "Sự xuất hiện của điện thoại thông minh đã thay đổi cách chúng ta đọc tin." },
        { w: "chain", pos: "n", ipa: "/tʃeɪn/", vi: "xích, dây xích; chuỗi (cửa hàng)", ex: "The chain came off my bike on the way home.", exVi: "Xích xe tôi bị tuột trên đường về.", more: "Nghĩa 2: **a chain of** shops / hotels = chuỗi cửa hàng / khách sạn.", anh: "chains" },
        { w: "tyre", pos: "n", ipa: "/ˈtaɪə(r)/", vi: "lốp xe", ex: "I need to pump up my back tyre.", exVi: "Tôi cần bơm lốp sau.", more: "Mỹ viết **tire**. **a flat tyre** = lốp xẹp." },
        { w: "independence", pos: "n", ipa: "/ˌɪndɪˈpendəns/", vi: "sự độc lập, tự chủ", ex: "A part-time job gives students some financial independence.", exVi: "Việc làm thêm cho sinh viên chút độc lập về tài chính.", more: "Tính từ **independent (of)**. Trái nghĩa: **dependence**." },
        { w: "redesign", pos: "v", ipa: "/ˌriːdɪˈzaɪn/", vi: "thiết kế lại", ex: "The city plans to redesign the old market.", exVi: "Thành phố định thiết kế lại khu chợ cũ.", more: "Tiền tố **re-** = làm lại: rebuild, rewrite, reuse." },
        { w: "old-fashioned", pos: "adj", ipa: "/ˌəʊld ˈfæʃnd/", vi: "lỗi thời, cổ lỗ", ex: "Some teenagers think writing letters is old-fashioned.", exVi: "Một số thiếu niên nghĩ viết thư tay là lỗi thời.", more: "Đồng nghĩa: **out of date, outdated**. Trái nghĩa: **modern, up to date**." },
        { w: "protest", pos: "n, v", ipa: "/ˈprəʊtest/ (n) · /prəˈtest/ (v)", vi: "cuộc biểu tình, sự phản đối; phản đối", ex: "Students held a protest against the higher fees.", exVi: "Sinh viên tổ chức biểu tình phản đối mức học phí cao hơn.", more: "Danh từ nhấn **đầu**, động từ nhấn **sau** (như increase). **protest against** sth.", anh: "placard" },
        { w: "crisis", pos: "n", ipa: "/ˈkraɪsɪs/", vi: "cuộc khủng hoảng", ex: "The oil crisis made petrol very expensive.", exVi: "Khủng hoảng dầu mỏ khiến xăng rất đắt.", more: "Số nhiều bất quy tắc: **crises** /ˈkraɪsiːz/. **an economic / energy crisis**." },
        { w: "fuel", pos: "n", ipa: "/ˈfjuːəl/", vi: "nhiên liệu (xăng, dầu…)", ex: "Electric cars do not use any fuel.", exVi: "Xe điện không dùng nhiên liệu.", more: "Không đếm được khi nói chung. **fuel prices** · **fossil fuels** (nhiên liệu hoá thạch).", anh: "fuel-pump" },
        { w: "persuade", pos: "v", ipa: "/pəˈsweɪd/", vi: "thuyết phục", ex: "My friend persuaded me to join the English club.", exVi: "Bạn tôi đã thuyết phục tôi tham gia câu lạc bộ tiếng Anh.", more: "**persuade sb to + V**. Danh từ **persuasion**, tính từ **persuasive**." },
        { w: "invest", pos: "v", ipa: "/ɪnˈvest/", vi: "đầu tư", ex: "The government should invest in public transport.", exVi: "Chính phủ nên đầu tư vào giao thông công cộng.", more: "**invest in** + N (không ~~invest to~~). Danh từ **investment**." },
        { w: "residential", pos: "adj", ipa: "/ˌrezɪˈdenʃl/", vi: "(thuộc) khu dân cư", ex: "Trucks are not allowed in residential streets at night.", exVi: "Xe tải không được vào phố dân cư ban đêm.", more: "Danh từ **resident** (cư dân), **residence** (nơi cư trú)." },
        { w: "free of charge", pos: "phr", ipa: "/friː əv tʃɑːdʒ/", vi: "miễn phí", ex: "Children under six can visit the museum free of charge.", exVi: "Trẻ dưới sáu tuổi được vào bảo tàng miễn phí.", more: "Đồng nghĩa: **for free · at no cost**. ~~for free of charge~~ là thừa." },
        { w: "launch", pos: "v, n", ipa: "/lɔːntʃ/", vi: "ra mắt, khởi động (dự án, sản phẩm)", ex: "The company launched a new app last month.", exVi: "Công ty ra mắt ứng dụng mới tháng trước.", more: "**launch** a product / campaign / scheme. Danh từ: **the launch of**." },
        { w: "commuter", pos: "n", ipa: "/kəˈmjuːtə(r)/", vi: "người đi làm hằng ngày (quãng đường xa)", ex: "Thousands of commuters take this train every morning.", exVi: "Hàng nghìn người đi làm đi chuyến tàu này mỗi sáng.", more: "Động từ **commute** (đi làm hằng ngày) · danh từ **commute**: a long commute." },
        { w: "account for", pos: "phr v", ipa: "/əˈkaʊnt fə(r)/", vi: "chiếm (tỉ lệ); giải thích cho", ex: "Women account for 60% of the students in my class.", exVi: "Nữ chiếm 60% sinh viên lớp tôi.", more: "Cực hay dùng trong Task 1: **X accounts for 30% of the total**." },
        { w: "exhaust fumes", pos: "n", ipa: "/ɪɡˈzɔːst fjuːmz/", vi: "khói xả (xe cộ)", ex: "Exhaust fumes make the air in big cities dirty.", exVi: "Khói xả làm không khí ở thành phố lớn bẩn.", more: "Luôn **số nhiều** (fumes). Liên hệ Ngày 10: động từ **exhaust** (làm kiệt sức) cùng gốc." },
      ],
    },
    {
      t: "hinh",
      title: "Phương tiện trong bài và quanh bài — chạm để nghe",
      items: [
        { anh: "bicycle", w: "bicycle", ro: "/ˈbaɪsɪkl/", vi: "xe đạp" },
        { anh: "automobile", w: "car", ro: "/kɑː/", vi: "ô tô" },
        { anh: "bus", w: "bus", ro: "/bʌs/", vi: "xe buýt" },
        { anh: "train", w: "train", ro: "/treɪn/", vi: "tàu hoả" },
        { anh: "motor-scooter", w: "scooter", ro: "/ˈskuːtə/", vi: "xe tay ga" },
        { anh: "kick-scooter", w: "kick scooter", ro: "/kɪk ˈskuːtə/", vi: "xe trượt scooter (đẩy chân)" },
        { anh: "fuel-pump", w: "petrol station", ro: "/ˈpetrəl ˈsteɪʃn/", vi: "cây xăng (Mỹ: gas station)" },
        { anh: "vertical-traffic-light", w: "traffic lights", ro: "/ˈtræfɪk laɪts/", vi: "đèn giao thông" },
      ],
    },
    {
      t: "rule",
      formula: "ride a bicycle · by bicycle · invest in + N · persuade sb to + V · X accounts for + % · free of charge",
      vi: "Sáu khung đi kèm từ vựng hôm nay — dùng được ngay cho Task 2 về giao thông và Task 1 tả tỉ lệ.",
    },
    {
      t: "quiz",
      id: "d12-doc-tu-dich",
      title: "Dịch sang tiếng Anh — từ vựng giao thông (5 câu)",
      kind: "translate",
      grammar: "ride a bike / cycle to + nơi · invest in + N · persuade sb to + V · X accounts for + % of + N · free of charge.",
      items: [
        { q: "Tôi đạp xe đi làm ba ngày một tuần.", hint: "I cycle / ride my bike, to work, three days a week", answers: ["I cycle to work three days a week.", "I ride my bike to work three days a week.", "I ride my bicycle to work three days a week.", "I go to work by bike three days a week.", "I go to work by bicycle three days a week.", "I cycle to work three times a week."] },
        { q: "Thành phố nên đầu tư vào làn đường dành cho xe đạp.", hint: "The city should, invest in, cycle lanes / bike lanes / cycle paths", answers: ["The city should invest in cycle lanes.", "The city should invest in bike lanes.", "The city should invest in cycle paths.", "The city should invest in bicycle lanes.", "The city should invest more in cycle lanes.", "Cities should invest in cycle lanes.", "The city should invest in bike paths."] },
        { q: "Bạn tôi thuyết phục tôi mua một chiếc xe đạp điện.", hint: "My friend, persuaded me to, buy, an e-bike / an electric bike", answers: ["My friend persuaded me to buy an e-bike.", "My friend persuaded me to buy an electric bike.", "My friend persuaded me to buy an electric bicycle.", "My friend convinced me to buy an e-bike.", "My friend convinced me to buy an electric bike."] },
        { q: "Ô tô chiếm 40% số chuyến đi.", hint: "Cars, account for, 40% of, journeys / trips", answers: ["Cars account for 40% of journeys.", "Cars account for 40% of all journeys.", "Cars account for 40% of trips.", "Cars account for 40% of all trips.", "Cars account for 40 percent of journeys.", "Cars accounted for 40% of journeys.", "Cars account for 40% of the journeys."] },
        { q: "Trẻ em được đi xe buýt miễn phí.", hint: "Children can, travel / ride on buses, free of charge", answers: ["Children can travel on buses free of charge.", "Children can ride buses free of charge.", "Children can take the bus free of charge.", "Children travel on buses free of charge.", "Children can use buses free of charge.", "Children can travel by bus free of charge.", "Children can ride the bus free of charge."] },
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

const D12_WRITING: Lesson = {
  id: "d12-viet",
  kind: "writing",
  title: "Viết: Task 1 — Biểu đồ theo thời gian 2 (viết trọn bài line / bar)",
  goal: "Viết trọn một bài Task 1 khoảng 170–190 từ cho biểu đồ đường hoặc biểu đồ cột theo năm: mở bài paraphrase, overview 2 đặc điểm không số, hai thân bài chia nhóm hợp lý với số liệu chính xác và so sánh — trong 20 phút.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Khung **4 đoạn** (Ngày 4): ==Introduction (paraphrase) → Overview (2 điểm nổi bật, KHÔNG số) → Body 1 → Body 2 (có số + so sánh)==.",
        "Mở bài: đổi **3 thứ**: shows → illustrates / compares · the number of → how many · from… to… → over a … -year period.",
        "Overview: **xu hướng chung** của từng nhóm + **điểm nổi bật nhất** (lớn nhất, vượt nhau, đạt đỉnh).",
        "Chia thân bài: gom các đường **giống xu hướng** (cùng tăng / cùng giảm) hoặc chia theo **giai đoạn**.",
        "Dùng bộ từ xu hướng **Ngày 11** (rose steadily, peaked at, a sharp fall in…) + **quá khứ đơn** cho số liệu đã qua.",
        "Một bài mẫu line graph **đối chiếu từng con số**, một bài điền khuyết bar chart, rồi bạn tự viết một bài cho AI chấm.",
      ],
    },
    { t: "h", text: "1. Quy trình 20 phút" },
    {
      t: "sodo",
      kind: "flow",
      title: "Viết Task 1 biểu đồ theo thời gian",
      steps: [
        { label: "3′ — Đọc đề & hình", sub: "Cái gì · ở đâu · khi nào · đơn vị · quá khứ hay tương lai?" },
        { label: "1′ — Mở bài", sub: "Paraphrase câu đề (1 câu)" },
        { label: "3′ — Overview", sub: "Overall, + 2 đặc điểm lớn nhất, không số" },
        { label: "10′ — 2 thân bài", sub: "Mỗi đoạn một nhóm số liệu, số + so sánh" },
        { label: "3′ — Soát số & ngữ pháp", sub: "Từng con số khớp hình? Quá khứ đơn? by / to?" },
      ],
      caption: "Task 1 KHÔNG có kết bài kiểu “In conclusion, I think…” — overview đã làm nhiệm vụ tổng kết.",
    },
    {
      t: "table",
      caption: "Bước 1 — năm câu hỏi khi nhìn hình (3 phút)",
      head: ["Câu hỏi", "Vì sao cần"],
      rows: [
        ["Hình tả **cái gì** (đơn vị gì: %, nghìn, triệu, giờ)?", "Sai đơn vị là sai cả bài: “62%” khác “62 households”."],
        ["**Ở đâu**, **khi nào** (từ năm nào đến năm nào)?", "Đưa vào mở bài; chọn **thì**: quá khứ (2004–2024) → **quá khứ đơn**; có năm tương lai (2030) → **is expected to / will**."],
        ["Mỗi đường / nhóm cột **đi thế nào** (tăng, giảm, dao động, ổn định)?", "Đây là nguyên liệu cho **overview**."],
        ["Có điểm **đặc biệt** không (cao nhất, thấp nhất, vượt nhau, đỉnh)?", "Điểm đặc biệt nên có mặt trong overview hoặc câu đầu thân bài."],
        ["Gom nhóm thế nào cho **2 thân bài**?", "Đường **giống xu hướng** đi chung một đoạn; hoặc chia theo **giai đoạn** (trước / sau một năm mốc)."],
      ],
    },

    { t: "h", text: "2. Mở bài: paraphrase câu đề" },
    {
      t: "table",
      head: ["Trong đề", "Đổi thành", "Ghi chú"],
      rows: [
        ["The line graph **shows**", "The line graph **illustrates / compares / gives information about**", "**compares** chỉ dùng khi có ≥ 2 nhóm."],
        ["**the percentage of** households", "**the proportion of** households / **what percentage of** households", "percentage ↔ proportion ↔ share"],
        ["**the number of** visitors", "**how many** visitors", "Đổi cụm danh từ → mệnh đề “how many + N + V”."],
        ["**from 2004 to 2024**", "**between 2004 and 2024** / **over a twenty-year period from 2004**", "Tự tính số năm cho đúng: 2024 − 2004 = 20."],
        ["**in one country**", "**in a particular country** / **in a certain country**", "Tên riêng (Japan, Hanoi) thì giữ nguyên."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "The line graph / bar chart + illustrates / compares + the proportion of / how many + N + (that) + V + … + between X and Y.",
          vi: "Câu mở bài: một câu, viết lại toàn bộ đề, KHÔNG thêm nhận xét.",
          examples: [
            { en: "The line graph illustrates the proportion of households in one country that owned three types of computer device between 2004 and 2024.", vi: "Biểu đồ đường cho thấy tỉ lệ hộ gia đình ở một quốc gia sở hữu ba loại thiết bị máy tính từ 2004 đến 2024." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "The + line graph / bar chart + illustrates / compares + how many / the proportion of + N + V + between X and Y.",
      vi: "Mở bài Task 1 = viết lại đề bằng từ khác: shows → illustrates, the number of → how many, from…to → between…and.",
    },

    { t: "h", text: "3. Bài mẫu biểu đồ đường — phân tích từng bước" },
    {
      t: "p",
      text: "**Đề:** The line graph below shows the percentage of households in one country that owned a desktop computer, a laptop and a tablet from 2004 to 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Percentage of households owning three types of device in one country, 2004–2024",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "%",
        categories: ["2004", "2008", "2012", "2016", "2020", "2024"],
        series: [
          { name: "Desktop computer", values: [62, 60, 51, 40, 31, 24] },
          { name: "Laptop", values: [18, 34, 49, 58, 66, 71] },
          { name: "Tablet", values: [0, 0, 15, 37, 45, 42] },
        ],
      },
    },
    {
      t: "table",
      caption: "Bước 1 — đọc hình (ghi nháp)",
      head: ["Đường", "Xu hướng", "Điểm đặc biệt"],
      rows: [
        ["Desktop", "**giảm** suốt giai đoạn: chậm lúc đầu (62 → 60), rồi mạnh (→ 24)", "Cao nhất năm 2004; bị laptop **vượt** giữa 2012 và 2016"],
        ["Laptop", "**tăng** đều suốt giai đoạn (18 → 71)", "Cao nhất ở cuối giai đoạn → phổ biến nhất"],
        ["Tablet", "**chưa có** đến 2008, rồi **tăng nhanh**, **đạt đỉnh** 45 (2020), **giảm nhẹ** 42", "Vẫn cao hơn desktop năm 2024 (42 > 24)"],
        ["**Gom nhóm**", "Body 1 = desktop + laptop (hai đường **ngược nhau**, cắt nhau) · Body 2 = tablet (mẫu hình riêng)", ""],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The line graph illustrates the proportion of households in one country that owned a desktop computer, a laptop or a tablet over a twenty-year period from 2004 to 2024.", vi: "[Mở bài] Biểu đồ đường thể hiện tỉ lệ hộ gia đình ở một quốc gia sở hữu máy tính để bàn, máy tính xách tay hoặc máy tính bảng trong giai đoạn hai mươi năm từ 2004 đến 2024." },
        { en: "[Overview] Overall, laptop ownership rose steadily and laptops became the most common device, whereas desktop computers became less and less popular. Tablets did not appear until after 2008, but they spread rapidly afterwards.", vi: "[Tổng quan] Nhìn chung, tỉ lệ sở hữu laptop tăng đều và laptop trở thành thiết bị phổ biến nhất, trong khi máy tính để bàn ngày càng ít được ưa chuộng. Máy tính bảng chỉ xuất hiện sau năm 2008, nhưng sau đó lan rộng nhanh chóng." },
        { en: "[Body 1] In 2004, 62% of households owned a desktop computer, more than three times the figure for laptops (18%). Over the following years, desktop ownership declined gradually at first, to 60% in 2008, and then much more sharply, reaching just 24% in 2024. Laptop ownership, by contrast, climbed significantly throughout the period. It almost equalled desktop ownership in 2012 (49% compared with 51%), and by 2016 it had overtaken it, finishing at 71%.", vi: "[Thân bài 1] Năm 2004, 62% hộ gia đình có máy tính để bàn, gấp hơn ba lần con số của laptop (18%). Trong những năm sau đó, tỉ lệ sở hữu máy để bàn giảm từ từ lúc đầu, xuống 60% năm 2008, rồi giảm mạnh hơn nhiều, chỉ còn 24% năm 2024. Ngược lại, tỉ lệ sở hữu laptop tăng đáng kể suốt giai đoạn. Nó gần bằng máy để bàn năm 2012 (49% so với 51%), và đến năm 2016 thì đã vượt qua, kết thúc ở mức 71%." },
        { en: "[Body 2] No households owned a tablet in 2004 or 2008. However, after tablets were introduced, ownership grew rapidly from 15% in 2012 to 37% in 2016 and peaked at 45% in 2020. In the final four years, the figure dipped slightly to 42%, which was still well above the share for desktop computers.", vi: "[Thân bài 2] Không hộ nào có máy tính bảng vào năm 2004 hay 2008. Tuy nhiên, sau khi máy tính bảng ra đời, tỉ lệ sở hữu tăng nhanh từ 15% năm 2012 lên 37% năm 2016 và đạt đỉnh 45% năm 2020. Trong bốn năm cuối, con số giảm nhẹ xuống 42%, vẫn cao hơn hẳn tỉ lệ của máy để bàn." },
      ],
    },
    {
      t: "table",
      caption: "Soát số — mọi con số trong bài mẫu đều khớp hình",
      head: ["Câu trong bài mẫu", "Hình", "Khớp?"],
      rows: [
        ["62% desktop, 18% laptop in 2004 · “more than three times”", "62 và 18 · 62 ÷ 18 ≈ 3,4", "✓"],
        ["to 60% in 2008 · just 24% in 2024", "Desktop 2008 = 60 · 2024 = 24", "✓"],
        ["49% compared with 51% in 2012", "Laptop 2012 = 49 · Desktop 2012 = 51", "✓"],
        ["by 2016 it had overtaken it · finishing at 71%", "2016: laptop 58 > desktop 40 · laptop 2024 = 71", "✓"],
        ["No households owned a tablet in 2004 or 2008", "Tablet 2004 = 0 · 2008 = 0", "✓"],
        ["15% (2012) → 37% (2016) → peaked at 45% (2020) → 42%", "Tablet: 15 · 37 · 45 · 42", "✓"],
        ["42% … well above desktop", "2024: tablet 42 > desktop 24", "✓"],
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu (185 từ, đã đếm thật) đạt khoảng band 6.5",
      head: ["Tiêu chí", "Bài mẫu làm được gì"],
      rows: [
        ["**Task Achievement**", "Overview rõ ràng (**Overall,** + 3 xu hướng chính, **không số**); mọi đường đều có số liệu chính; có **so sánh** (more than three times, compared with, well above)."],
        ["**Coherence & Cohesion**", "Body 1 gom **hai đường ngược nhau**, Body 2 là **đường có mẫu hình riêng**; từ nối thời gian (**Over the following years, at first, then, by 2016, In the final four years**) và đối lập (**whereas, by contrast, However**)."],
        ["**Lexical Resource**", "Xoay vòng từ xu hướng Ngày 11: **rose steadily, declined gradually, climbed significantly, grew rapidly, peaked at, dipped slightly, overtaken**; đổi chủ ngữ: **laptop ownership / the figure / the share**."],
        ["**Grammatical Range**", "Quá khứ đơn chuẩn; **quá khứ hoàn thành** (by 2016 it **had overtaken**); mệnh đề quan hệ (**which was still well above**); cụm V-ing (**reaching just 24%**, **finishing at 71%**)."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi viết Task 1 theo thời gian",
      items: [
        "Overview **có số**: ~~Overall, laptops rose from 18% to 71%.~~ → số để dành cho thân bài; overview chỉ nói **xu hướng**.",
        "Thiếu overview, hoặc đặt overview ở **cuối** bài với “In conclusion, I think…”. Overview đặt **ngay sau mở bài** là an toàn nhất, và **không có ý kiến**.",
        "Tả **từng năm một** như đọc bảng (In 2004… In 2008… In 2012…). Hãy **gộp giai đoạn** có cùng xu hướng: “declined gradually at first, then much more sharply”.",
        "Sai thì: ~~Laptop ownership rises~~ (số liệu quá khứ) → **rose**. Sai giới từ: ~~rose by 71%~~ (thật ra là **to** 71%).",
        "Nhầm **percentage** (danh từ, tỉ lệ) với **percent** (đi sau số): ~~62 percentage~~ → **62 percent / 62%**; **the percentage of** households.",
        "Đưa **nguyên nhân** không có trong hình: ~~because laptops are cheaper~~. Task 1 chỉ **tả**, không giải thích.",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Overall, + N1 + rose / fell + adv, whereas / while + N2 + V-ed.",
          vi: "Overview: hai xu hướng trái ngược trong một câu.",
          examples: [
            { en: "Overall, laptop ownership rose steadily, whereas desktop computers became less popular.", vi: "Nhìn chung, tỉ lệ sở hữu laptop tăng đều, trong khi máy để bàn kém phổ biến dần." },
          ],
        },
        {
          formula: "In + năm, + số + of + N + V-ed…, more than / almost + twice / three times + the figure for + N2.",
          vi: "Câu đầu thân bài: điểm xuất phát + so sánh hai nhóm.",
          examples: [
            { en: "In 2004, 62% of households owned a desktop, more than three times the figure for laptops.", vi: "Năm 2004, 62% hộ có máy để bàn, gấp hơn ba lần con số của laptop." },
          ],
        },
        {
          formula: "S + V-ed + adv + from X in + năm + to Y in + năm + and + peaked at / finished at + Z.",
          vi: "Một câu “kể” cả chặng đường của một đường.",
          examples: [
            { en: "Ownership grew rapidly from 15% in 2012 to 37% in 2016 and peaked at 45% in 2020.", vi: "Tỉ lệ sở hữu tăng nhanh từ 15% năm 2012 lên 37% năm 2016 và đạt đỉnh 45% năm 2020." },
          ],
        },
        {
          formula: "…, reaching / finishing at + số  ·  …, which was + still / well + above / below + N",
          vi: "Nối thêm thông tin vào cuối câu bằng V-ing hoặc which — nâng điểm ngữ pháp.",
          examples: [
            { en: "Desktop ownership fell sharply, reaching just 24% in 2024.", vi: "Tỉ lệ sở hữu máy để bàn giảm mạnh, chỉ còn 24% năm 2024." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Intro (paraphrase) → Overall, N1 + V-ed…, whereas N2 + V-ed… → Body 1: In + năm, số… → V-ed + adv + from X to Y… → Body 2: …peaked at…, …dipped slightly to…",
      vi: "Task 1 theo thời gian: 4 đoạn, quá khứ đơn, số ở thân bài, so sánh ở mọi câu có thể.",
    },
    {
      t: "quiz",
      id: "d12-viet-dich",
      title: "Dịch sang tiếng Anh — câu Task 1 (5 câu)",
      kind: "translate",
      grammar: "The line graph illustrates the proportion of + N + that + V-ed · Overall, A + rose…, whereas B + V-ed · In + năm, X% of + N + V-ed · S + peaked at + số + in + năm · by + năm, S + had overtaken + O.",
      items: [
        { q: "Biểu đồ đường thể hiện tỉ lệ hộ gia đình sở hữu ô tô từ năm 2000 đến 2020.", hint: "The line graph illustrates, the proportion of households, that owned a car, between 2000 and 2020", answers: ["The line graph illustrates the proportion of households that owned a car between 2000 and 2020.", "The line graph illustrates the proportion of households that owned a car from 2000 to 2020.", "The line graph illustrates the percentage of households that owned a car between 2000 and 2020.", "The line graph shows the proportion of households that owned a car between 2000 and 2020.", "The line graph illustrates the proportion of households owning a car between 2000 and 2020.", "The line graph illustrates the percentage of households owning a car between 2000 and 2020.", "The line graph illustrates the proportion of households which owned a car between 2000 and 2020."] },
        { q: "Nhìn chung, việc sử dụng laptop tăng đều, trong khi máy tính để bàn kém phổ biến dần.", hint: "Overall, laptop use, rose steadily, whereas, desktop computers, became less popular", answers: ["Overall, laptop use rose steadily, whereas desktop computers became less popular.", "Overall, laptop use rose steadily, while desktop computers became less popular.", "Overall, laptop use increased steadily, whereas desktop computers became less popular.", "Overall, laptop use rose steadily whereas desktop computers became less popular.", "Overall, laptop use grew steadily, whereas desktop computers became less popular.", "Overall, the use of laptops rose steadily, whereas desktop computers became less popular.", "Overall, laptop use rose steadily, whereas desktop computers became less and less popular."] },
        { q: "Năm 2004, 62% hộ gia đình có máy tính để bàn.", hint: "In 2004, 62% of households, owned / had, a desktop computer", answers: ["In 2004, 62% of households owned a desktop computer.", "In 2004, 62% of households had a desktop computer.", "In 2004, 62 percent of households owned a desktop computer.", "In 2004 62% of households owned a desktop computer.", "In 2004, 62% of households owned a desktop.", "In 2004, 62% of households had a desktop."] },
        { q: "Tỉ lệ sở hữu máy tính bảng đạt đỉnh 45% vào năm 2020.", hint: "Tablet ownership, peaked at, 45%, in 2020", answers: ["Tablet ownership peaked at 45% in 2020.", "Tablet ownership reached a peak of 45% in 2020.", "In 2020, tablet ownership peaked at 45%.", "Tablet ownership peaked at 45 percent in 2020.", "The proportion of households owning a tablet peaked at 45% in 2020."] },
        { q: "Đến năm 2016, laptop đã vượt máy tính để bàn.", hint: "By 2016, laptops, had overtaken (quá khứ hoàn thành), desktop computers", answers: ["By 2016, laptops had overtaken desktop computers.", "By 2016 laptops had overtaken desktop computers.", "By 2016, laptops had overtaken desktops.", "By 2016, laptop ownership had overtaken desktop ownership.", "By 2016, laptops had surpassed desktop computers."] },
      ],
    },

    { t: "h", text: "4. Biểu đồ cột theo năm: điền vào bài mẫu" },
    {
      t: "p",
      text: "Biểu đồ **cột có trục năm** tả bằng **đúng bộ từ** của biểu đồ đường: mỗi nhóm cột cùng màu chính là một “đường” vô hình. Đọc hình, rồi điền 7 chỗ trống trong bài mẫu (mỗi chỗ **một từ**).",
    },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Average hours per week young people (16–24) in one city spent on three leisure activities, 2000–2020",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "hours / week",
        categories: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Watching TV", values: [18, 17, 14, 10, 7] },
          { name: "Using social media", values: [0, 2, 8, 15, 19] },
          { name: "Playing sport", values: [6, 6, 5, 6, 6] },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The bar chart compares the average number of hours per week that young people aged 16 to 24 in one city spent on three leisure activities between 2000 and 2020.", vi: "[Mở bài] Biểu đồ cột so sánh số giờ trung bình mỗi tuần mà người trẻ 16–24 tuổi ở một thành phố dành cho ba hoạt động giải trí từ 2000 đến 2020." },
        { en: "[Overview] Overall, time spent on social media (1) ___ dramatically, while TV viewing fell steadily. By contrast, the time spent playing sport remained almost (2) ___.", vi: "[Tổng quan] Nhìn chung, thời gian dùng mạng xã hội (1) ___ mạnh, trong khi thời gian xem TV giảm đều. Ngược lại, thời gian chơi thể thao gần như (2) ___." },
        { en: "[Body 1] In 2000, young people watched TV for 18 hours a week, but this figure (3) ___ gradually to 14 hours in 2010 and then more sharply to just 7 hours in 2020. Social media, on the other hand, was not used at all in 2000. It then rose (4) ___ 8 hours in 2010 and (5) ___ TV viewing between 2010 and 2015, finishing at 19 hours a week.", vi: "[Thân bài 1] Năm 2000, người trẻ xem TV 18 giờ mỗi tuần, nhưng con số này (3) ___ từ từ còn 14 giờ năm 2010 rồi mạnh hơn, chỉ còn 7 giờ năm 2020. Mặt khác, mạng xã hội hoàn toàn chưa được dùng năm 2000. Sau đó nó tăng (4) ___ 8 giờ năm 2010 và (5) ___ việc xem TV trong khoảng 2010–2015, kết thúc ở mức 19 giờ mỗi tuần." },
        { en: "[Body 2] Time spent playing sport changed very little. It stood (6) ___ 6 hours a week in 2000, (7) ___ slightly to 5 hours in 2010 and returned to 6 hours in the final two years shown.", vi: "[Thân bài 2] Thời gian chơi thể thao thay đổi rất ít. Nó ở mức (6) ___ 6 giờ mỗi tuần năm 2000, (7) ___ nhẹ xuống 5 giờ năm 2010 rồi trở lại 6 giờ ở hai mốc cuối." },
      ],
    },
    {
      t: "quiz",
      id: "d12-viet-dien",
      title: "Điền bài mẫu biểu đồ cột (7 chỗ trống, mỗi chỗ một từ)",
      kind: "fill",
      items: [
        { q: "(1) Overall, time spent on social media ___ dramatically…", answers: ["rose", "increased", "grew", "climbed", "soared"] },
        { q: "(2) …the time spent playing sport remained almost ___.", answers: ["unchanged", "stable", "constant", "steady", "flat"] },
        { q: "(3) …but this figure ___ gradually to 14 hours in 2010…", answers: ["fell", "decreased", "declined", "dropped"] },
        { q: "(4) It then rose ___ 8 hours in 2010… (giới từ)", answers: ["to"] },
        { q: "(5) …and ___ TV viewing between 2010 and 2015… (vượt qua, quá khứ)", answers: ["overtook", "surpassed", "exceeded"] },
        { q: "(6) It stood ___ 6 hours a week in 2000… (giới từ)", answers: ["at"] },
        { q: "(7) …___ slightly to 5 hours in 2010… (giảm nhẹ, quá khứ)", answers: ["dipped", "fell", "dropped", "decreased", "declined"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích — và vì sao chia đoạn như vậy",
      items: [
        "(1) Mạng xã hội 0 → 19: tăng **rất mạnh** — rose / increased / soared… (2) Thể thao 6 · 6 · 5 · 6 · 6 → **gần như không đổi**: almost **unchanged / stable**.",
        "(3) TV 18 → 14 (2010): giảm **từ từ** → fell / decreased. (4) **rose to** 8 = lên tới mức 8. (5) 2010: TV 14 > MXH 8; 2015: MXH 15 > TV 10 → MXH **vượt** TV **giữa 2010 và 2015** → **overtook**.",
        "(6) **stood at** + số = ở mức. (7) 6 → 5: giảm **nhỏ** → **dipped** (hoặc fell) slightly.",
        "Chia đoạn: **Body 1** gom TV và mạng xã hội vì hai nhóm **đi ngược nhau và cắt nhau** — đó là câu chuyện chính. **Body 2** là thể thao, nhóm **ổn định**. Cách gom này giúp bài có “mạch”, thay vì tả lần lượt từng màu cột.",
      ],
    },

    { t: "h", text: "5. Tự viết một bài trọn vẹn" },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Percentage of journeys to work in one city made by car, bus and bicycle, 2000–2024",
        note: "Số liệu tự đặt cho bài luyện. Các phương tiện khác (đi bộ, tàu…) không thể hiện trên hình.",
        unit: "%",
        categories: ["2000", "2006", "2012", "2018", "2024"],
        series: [
          { name: "Car", values: [55, 60, 58, 50, 41] },
          { name: "Bus", values: [30, 27, 24, 25, 27] },
          { name: "Bicycle", values: [10, 8, 12, 19, 26] },
        ],
      },
    },
    {
      t: "essay",
      id: "d12-viet-bai",
      task: "Task 1",
      prompt: "The line graph above shows the percentage of journeys to work in one city that were made by car, bus and bicycle between 2000 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — Car: 2000 55%, 2006 60%, 2012 58%, 2018 50%, 2024 41% · Bus: 30%, 27%, 24%, 25%, 27% · Bicycle: 10%, 8%, 12%, 19%, 26%.)",
      minWords: 150,
      tips: [
        "Mở bài: shows → **illustrates**; the percentage of journeys to work → **the proportion of commuting trips**; between 2000 and 2024 → **over a 24-year period**.",
        "Overview gợi ý: ô tô **vẫn là phương tiện phổ biến nhất** nhưng **giảm** sau khi đạt đỉnh; xe đạp **tăng mạnh**, gần đuổi kịp xe buýt (rồi vượt?) — kiểm tra năm 2024: bicycle 26 vs bus 27.",
        "Gom nhóm: Body 1 = **car** (đỉnh 60% năm 2006 rồi giảm còn 41%); Body 2 = **bus và bicycle** (bus dao động nhẹ quanh 24–30%, bicycle dip xuống 8% rồi tăng lên 26%).",
        "Dùng **quá khứ đơn**, giới từ **to / by / at** đúng như Ngày 11, và ít nhất **3 phép so sánh** (higher than, almost the same as, more than three times…).",
        "Soát số: mọi con số bạn viết phải khớp hình. Nhắm **170–190 từ**.",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D12_SPEAKING: Lesson = {
  id: "d12-noi",
  kind: "speaking",
  title: "Nói: Câu hỏi nêu quan điểm (Part 1 & Part 3 · Opinion questions)",
  goal: "Trả lời câu hỏi “Do you think…? / Is it important…? / Why do you think…? / Should…?” theo khung Quan điểm – Lý do – Ví dụ, chọn mức độ chắc chắn phù hợp, kéo dài hợp lý cho Part 1 (2–3 câu) và Part 3 (4–6 câu), và phát âm đúng âm /θ/ trong think.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Câu hỏi quan điểm: **Do you think…? · Is it important to…? · What do you think about…? · Why do you think…? · Should…? · Will… in the future?**",
        "Khung **O–R–E**: ==Opinion (I think…) → Reason (because…) → Example (For example…)== — Part 3 thêm **giải thích / mặt kia / kết**.",
        "Ba mức độ chắc chắn: **mạnh** (I'm convinced that…) · **vừa** (I think / I believe…) · **dè dặt** (I'd say… / It depends on…).",
        "**Part 1** = 2–3 câu, nói về **bản thân**; **Part 3** = 4–6 câu, nói về **xã hội, mọi người nói chung**.",
        "Lỗi phải bỏ: ~~According to me~~, ~~In my opinion, I think~~, ~~I think it's not…~~ → I don't think it is…",
        "Phát âm: **/θ/** trong **think, three, both, health** — không đọc thành “sink”, “tink”.",
      ],
    },
    {
      t: "canh",
      anh: ["woman-teacher", "thinking-face", "man-student"],
      caption: "Giám khảo hỏi: “**Do you think** people should cycle more?” Bạn có 2–3 giây để **chọn phía**, rồi nói **vì sao** và cho **một ví dụ**. Không có câu trả lời sai — chỉ có câu trả lời **không có lý do**.",
    },

    { t: "h", text: "1. Câu hỏi quan điểm trông như thế nào?" },
    {
      t: "table",
      head: ["Dạng câu hỏi", "Hay gặp ở", "Câu mở đầu trả lời"],
      rows: [
        ["**Do you think** + S + V?", "Part 1 & 3", "Yes, I think so, because… / No, I don't think so. In fact,…"],
        ["**Is it important** to + V?", "Part 1 & 3", "Yes, it's really important, especially for…"],
        ["**What do you think about** + N / V-ing?", "Part 1", "I think it's a great idea, because… / I'm not a big fan of…"],
        ["**Which do you prefer**, A or B?", "Part 1", "I'd say I prefer A, mainly because…"],
        ["**Why do you think** + S + V?", "Part 3", "I think there are a couple of reasons. The main one is…"],
        ["**Should** the government / parents + V?", "Part 3", "I believe they should, at least to some extent, because…"],
        ["**Do you think** + S + **will** + V **in the future**?", "Part 3", "It's hard to say, but I think… will probably…"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Part 1 và Part 3 — cùng là quan điểm, khác độ sâu",
      cols: [
        {
          title: "Part 1 (4–5 phút)",
          anh: "speaking-head",
          items: [
            "Chủ đề **quen thuộc, cá nhân**",
            "Nói về **I / my / my family**",
            "**2–3 câu** (~20 giây)",
            "Do you think **you** use your phone too much?",
          ],
        },
        {
          title: "Part 3 (4–5 phút)",
          anh: "busts-in-silhouette",
          items: [
            "Chủ đề **xã hội, trừu tượng**",
            "Nói về **people / young people / society**",
            "**4–6 câu** (~40–60 giây)",
            "Do you think **people** use phones too much **these days**?",
          ],
        },
      ],
      caption: "Lỗi hay gặp ở Part 3: trả lời ngắn như Part 1, hoặc chỉ kể chuyện bản thân. Part 3 cần ý KHÁI QUÁT + ví dụ (có thể là ví dụ của bản thân).",
    },

    { t: "h", text: "2. Khung trả lời O–R–E (+ Part 3)" },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung trả lời câu hỏi quan điểm",
      steps: [
        { label: "**O** — Opinion", sub: "Yes, I think… / Personally, I'd say…" },
        { label: "**R** — Reason", sub: "because… / The main reason is that…" },
        { label: "**E** — Example", sub: "For example,… / Take my cousin, she…" },
        { label: "(Part 3) Mặt kia", sub: "That said, … / Of course, some people…" },
        { label: "(Part 3) Chốt", sub: "So overall, I think… / That's why…" },
      ],
      caption: "Part 1: O–R–E (2–3 câu). Part 3: đủ 5 bước (4–6 câu). Không cần học thuộc câu chữ — chỉ cần thuộc KHUNG.",
    },
    {
      t: "table",
      caption: "Cụm cho từng bước",
      head: ["Bước", "Cụm dùng được", "Lưu ý"],
      rows: [
        ["**Opinion** (mạnh)", "I'm absolutely convinced that… · I strongly believe that… · Definitely.", "Dùng khi bạn **thật sự chắc**."],
        ["**Opinion** (vừa)", "I think… · I believe… · In my opinion, … · Personally, I feel that…", "An toàn nhất. **Chỉ chọn một**: ~~In my opinion, I think~~."],
        ["**Opinion** (dè dặt)", "I'd say… · I guess… · I suppose… · It depends on… · To some extent, …", "Hợp câu hỏi khó / không có câu trả lời rõ."],
        ["**Reason**", "because… · since… · The main reason is that… · This is mainly because…", "Sau **because** là **mệnh đề** (S + V); sau **because of** là **danh từ**."],
        ["**Example**", "For example, … · For instance, … · Take my brother — he… · In my case, …", "Ví dụ **cụ thể** (tên, số, nơi chốn) nghe thật hơn."],
        ["**Mặt kia**", "That said, … · Having said that, … · Of course, some people might argue that…", "Cho thấy bạn nghĩ **hai chiều** — điểm cộng ở Part 3."],
        ["**Chốt**", "So overall, … · That's why I think… · So, all in all, …", "Một câu ngắn quay lại quan điểm."],
        ["**Câu câu giờ**", "That's an interesting question. · I've never really thought about it, but…", "Dùng **một lần**, rồi trả lời ngay. Đừng im lặng."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi nêu quan điểm",
      items: [
        "~~According to me,…~~ → **In my opinion, / In my view, / Personally,** — according to dùng cho **người / nguồn khác** (according to my teacher).",
        "~~In my opinion, I think…~~ (lặp ý) → chọn **một**. Cũng tránh ~~I think that in my opinion~~.",
        "~~I think it's not a good idea.~~ → **I don't think it's a good idea.** Tiếng Anh tự nhiên phủ định ở **think**, không ở vế sau.",
        "Trả lời cụt ~~Yes.~~ / ~~I don't know.~~ — giám khảo chấm **khả năng nói**, không chấm ý đúng sai. Không biết thì vẫn nói: “I've never really thought about it, but **I'd guess**…”",
        "~~For example like…~~ (thừa) → **For example,** hoặc **like** — một trong hai.",
        "~~I agree with this.~~ khi giám khảo **chưa nêu** ý kiến nào — chỉ dùng agree / disagree khi câu hỏi có một ý kiến sẵn (Some people say… Do you agree?).",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Yes, I think so / No, I don't think so, + because + S + V. + For example, + S + V.",
          vi: "Part 1 — trả lời Do you think…? trong 2–3 câu.",
          examples: [
            { en: "Yes, I think so, because sleep helps me remember what I study. For example, when I sleep less than six hours, I forget new words very quickly.", vi: "Có, tôi nghĩ vậy, vì giấc ngủ giúp tôi nhớ những gì đã học. Ví dụ, khi ngủ ít hơn sáu tiếng, tôi quên từ mới rất nhanh." },
          ],
        },
        {
          formula: "I don't think + S + V (khẳng định), because + S + V.",
          vi: "Phủ định ở THINK, vế sau giữ khẳng định.",
          examples: [
            { en: "I don't think phones should be banned at school, because students can use them to look things up.", vi: "Tôi không nghĩ nên cấm điện thoại ở trường, vì học sinh có thể dùng để tra cứu." },
          ],
        },
        {
          formula: "I'd say + S + V, mainly because + S + V. That said, + S + V. So overall, + S + V.",
          vi: "Part 3 — có quan điểm, lý do, mặt kia, và chốt.",
          examples: [
            { en: "I'd say cycling is a great option for short trips, mainly because it's cheap and healthy. That said, it isn't practical when it's very hot or raining heavily. So overall, it works best alongside buses.", vi: "Tôi cho rằng đạp xe là lựa chọn tuyệt vời cho quãng ngắn, chủ yếu vì rẻ và tốt cho sức khoẻ. Dù vậy, nó không tiện khi trời quá nóng hoặc mưa to. Nên nhìn chung, nó hiệu quả nhất khi đi kèm xe buýt." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "O: I think / I'd say + S + V → R: because + S + V → E: For example, + S + V → (Part 3) That said, + S + V → So overall, + S + V",
      vi: "Part 1 dừng sau E (2–3 câu). Part 3 đi đủ năm bước (4–6 câu).",
    },
    {
      t: "quiz",
      id: "d12-noi-dich",
      title: "Dịch sang tiếng Anh — câu nêu quan điểm (5 câu)",
      kind: "translate",
      grammar: "I think / I believe + S + V · I don't think + S + V (khẳng định) · because + S + V · For example, + S + V · That said, + S + V · It depends on + N.",
      items: [
        { q: "Tôi không nghĩ trẻ em nên dùng điện thoại thông minh.", hint: "I don't think (phủ định ở think), children should use, smartphones", answers: ["I don't think children should use smartphones.", "I do not think children should use smartphones.", "I don't think that children should use smartphones.", "I don't think kids should use smartphones.", "I don't think young children should use smartphones."] },
        { q: "Tôi tin rằng đọc sách quan trọng vì nó cải thiện vốn từ.", hint: "I believe that, reading is important, because, it improves vocabulary", answers: ["I believe that reading is important because it improves vocabulary.", "I believe reading is important because it improves vocabulary.", "I believe that reading is important because it improves your vocabulary.", "I believe that reading is important because it improves our vocabulary.", "I believe that reading books is important because it improves vocabulary.", "I believe reading is important because it improves your vocabulary.", "I believe that reading is important as it improves vocabulary."] },
        { q: "Còn tuỳ vào thời tiết.", hint: "It depends on, the weather", answers: ["It depends on the weather.", "That depends on the weather."] },
        { q: "Dù vậy, không phải ai cũng có thể đạp xe đi làm.", hint: "That said / Having said that, not everyone can, cycle to work", answers: ["That said, not everyone can cycle to work.", "Having said that, not everyone can cycle to work.", "That said, not everybody can cycle to work.", "However, not everyone can cycle to work.", "That said, not everyone can ride a bike to work.", "Having said that, not everybody can cycle to work."] },
        { q: "Đó là một câu hỏi thú vị. Tôi chưa bao giờ thật sự nghĩ về nó.", hint: "That's an interesting question. I've never really thought about it.", answers: ["That's an interesting question. I've never really thought about it.", "That is an interesting question. I have never really thought about it.", "That's an interesting question. I have never really thought about it.", "That's an interesting question. I never really thought about it.", "That's an interesting question, I've never really thought about it."] },
      ],
    },

    { t: "h", text: "3. Tìm ý nhanh cho Part 3" },
    {
      t: "p",
      text: "Khó nhất ở Part 3 không phải ngữ pháp mà là **không nghĩ ra ý**. Mẹo: hầu như câu hỏi nào cũng trả lời được bằng **6 “ngăn kéo” ý** dưới đây. Nghe câu hỏi xong, lướt nhanh 6 ngăn và chọn **1–2 ngăn** hợp nhất.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "6 ngăn kéo ý cho Part 3",
      center: "Vì sao? / Có nên không?",
      branches: [
        { label: "Tiền bạc", anh: "money-bag", items: ["cheap / expensive", "save money · cost a lot"] },
        { label: "Thời gian", anh: "hourglass-not-done", items: ["save time · time-consuming", "busy lifestyle"] },
        { label: "Sức khoẻ", anh: "flexed-biceps", items: ["keep fit · stress", "physical & mental health"] },
        { label: "Môi trường", anh: "deciduous-tree", items: ["pollution · exhaust fumes", "traffic jams · waste"] },
        { label: "Học tập & công việc", anh: "graduation-cap", items: ["skills · career", "productivity · knowledge"] },
        { label: "Gia đình & quan hệ", anh: "people-hugging", items: ["spend time together", "lonely · communicate"] },
      ],
      caption: "Ví dụ “Why do some people prefer cars to buses?” → Thời gian (faster, no waiting) + Tiền bạc? (không — xe buýt rẻ hơn) → chọn Thời gian + sự Thoải mái.",
    },

    { t: "h", text: "4. Câu trả lời mẫu" },
    {
      t: "dialogue",
      title: "Part 1 — câu hỏi quan điểm (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think it's important to get enough sleep?" },
        { who: "Candidate", role: "candidate", text: "Yes, definitely. I think sleep is when the brain stores what we've learnt. For example, during my last exam period I slept only five hours a night, and I kept forgetting simple words.", vi: "Có, chắc chắn rồi. Tôi nghĩ giấc ngủ là lúc não lưu lại những gì ta đã học. Ví dụ, mùa thi vừa rồi tôi chỉ ngủ năm tiếng mỗi đêm, và cứ quên cả những từ đơn giản." },
        { who: "Examiner", role: "examiner", text: "Is it better to study alone or with friends?" },
        { who: "Candidate", role: "candidate", text: "I'd say it depends on the subject. For maths, I prefer studying alone because I need silence to concentrate. But for speaking English, practising with friends is much more useful and more fun.", vi: "Tôi cho là còn tuỳ môn. Với toán, tôi thích học một mình vì cần yên tĩnh để tập trung. Nhưng để luyện nói tiếng Anh thì tập với bạn bè hữu ích và vui hơn nhiều." },
        { who: "Examiner", role: "examiner", text: "Do you think you use your phone too much?" },
        { who: "Candidate", role: "candidate", text: "Honestly, yes, I think so. My phone says I spend about five hours a day on it, mostly on social media. I'm trying to cut it down by leaving it in another room when I study.", vi: "Thật lòng thì có, tôi nghĩ vậy. Điện thoại báo tôi dùng khoảng năm tiếng mỗi ngày, chủ yếu cho mạng xã hội. Tôi đang cố giảm bằng cách để nó ở phòng khác khi học." },
        { who: "Examiner", role: "examiner", text: "What do you think about cycling to school or work?" },
        { who: "Candidate", role: "candidate", text: "I think it's a great idea for short distances, because it's free and it keeps you fit. I don't think it's practical for long trips in Hanoi, though, because the summer is so hot.", vi: "Tôi nghĩ đó là ý hay cho quãng ngắn, vì nó miễn phí và giúp khoẻ người. Tuy vậy tôi không nghĩ nó tiện cho quãng xa ở Hà Nội, vì mùa hè nóng quá." },
      ],
    },
    {
      t: "dialogue",
      title: "Part 3 — thảo luận mở rộng (band 6–6.5)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do you think some people prefer cars to public transport?" },
        { who: "Candidate", role: "candidate", text: "I think the main reason is convenience. With a car, you can leave whenever you want and go straight to your destination, without waiting at a bus stop or changing buses. For example, my uncle lives just ten kilometres from his office, but by bus the journey takes almost an hour, so he drives. That said, cars are much more expensive to run, so I'd say it's mainly people with higher incomes who make that choice.", vi: "Tôi nghĩ lý do chính là sự tiện lợi. Có ô tô, bạn đi lúc nào tuỳ thích và đến thẳng nơi cần đến, không phải chờ ở bến hay đổi xe. Ví dụ, chú tôi sống cách văn phòng chỉ mười cây số, nhưng đi xe buýt mất gần một tiếng nên chú lái xe. Dù vậy, chi phí nuôi ô tô cao hơn nhiều, nên tôi cho rằng chủ yếu là những người thu nhập cao hơn mới chọn như vậy." },
        { who: "Examiner", role: "examiner", text: "Should governments spend more money on cycle paths?" },
        { who: "Candidate", role: "candidate", text: "I believe they should, at least in big cities. Safe cycle paths would encourage more people to leave their motorbikes at home, which would reduce both traffic jams and exhaust fumes. Some European cities have shown that people do start cycling once they feel safe. Having said that, cycle paths alone aren't enough in a hot country — they'd need trees for shade and places to park bikes. So overall, it's a good investment, but only as part of a bigger plan.", vi: "Tôi tin là nên, ít nhất ở các thành phố lớn. Làn xe đạp an toàn sẽ khuyến khích nhiều người để xe máy ở nhà, giảm cả tắc đường lẫn khói xả. Một số thành phố châu Âu đã cho thấy người dân thật sự bắt đầu đạp xe khi họ thấy an toàn. Dù vậy, chỉ có làn xe đạp thôi thì chưa đủ ở một nước nóng — còn cần cây xanh che bóng và chỗ để xe. Nên nhìn chung, đó là khoản đầu tư tốt, nhưng chỉ khi nằm trong một kế hoạch lớn hơn." },
        { who: "Examiner", role: "examiner", text: "Do you think people will use computers less in the future?" },
        { who: "Candidate", role: "candidate", text: "It's hard to say, but I don't think so. We'll probably use desktop computers less, since phones and tablets can already do most everyday tasks. But for work and study, I think we'll actually rely on computers even more, especially with artificial intelligence becoming part of almost every job.", vi: "Khó nói lắm, nhưng tôi không nghĩ vậy. Có lẽ ta sẽ ít dùng máy tính để bàn hơn, vì điện thoại và máy tính bảng đã làm được phần lớn việc hằng ngày. Nhưng với công việc và học tập, tôi nghĩ ta thậm chí sẽ phụ thuộc vào máy tính nhiều hơn, nhất là khi trí tuệ nhân tạo trở thành một phần của gần như mọi công việc." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao các câu trả lời trên ăn điểm",
      items: [
        "**Part 1** ngắn (2–3 câu) nhưng câu nào cũng có **lý do + chi tiết thật** (five hours a night, five hours a day, Hanoi summer).",
        "**Part 3** đi đủ khung: quan điểm → lý do → **ví dụ cụ thể** (chú tôi, mười cây số, gần một tiếng) → **mặt kia** (That said / Having said that) → **chốt** (So overall).",
        "**Mức độ chắc chắn** thay đổi theo câu hỏi: definitely (chắc) · I'd say it depends (dè dặt) · It's hard to say, but… (câu về tương lai).",
        "Câu về **tương lai** dùng **will probably / I don't think… will** — và **phủ định ở think**: “I don't think so”, không phải ~~I think not~~.",
        "Từ vựng hôm nay xuất hiện tự nhiên: **exhaust fumes, cycle paths, investment, rely on, convenience**.",
      ],
    },
    {
      t: "mcq",
      id: "d12-noi-chon",
      title: "Chọn câu trả lời tốt hơn (5 câu)",
      items: [
        { q: "“Do you think students should wear uniforms?” — câu nào **tự nhiên và đúng** hơn?", options: ["I think uniforms are a good idea, because they save families money.", "According to me, uniforms are good.", "In my opinion, I think uniforms are good."], correct: 0, why: "Câu 1 có quan điểm + **lý do**. Câu 2 dùng sai ~~According to me~~; câu 3 lặp ý ~~In my opinion, I think~~." },
        { q: "Cách phủ định tự nhiên nhất:", options: ["I think it's not useful.", "I think it isn't not useful.", "I don't think it's useful."], correct: 2, why: "Tiếng Anh tự nhiên phủ định ở **think**: **I don't think** + mệnh đề khẳng định." },
        { q: "Part 3: “Why do young people move to big cities?” — câu trả lời nào hợp **Part 3** nhất?", options: ["Because I want to.", "I think the main reason is jobs. Big cities have far more companies, so graduates have more choice. For example, most of my classmates from Nghe An now work in Hanoi. That said, living costs there are much higher.", "Jobs."], correct: 1, why: "Part 3 cần **ý khái quát + lý do + ví dụ + mặt kia** (4–6 câu). Câu 1 nói về **bản thân** và cụt; câu 3 chỉ một từ." },
        { q: "Không biết trả lời thế nào, bạn nên nói:", options: ["That's an interesting question. I've never really thought about it, but I'd guess…", "I don't know.", "(im lặng 10 giây)"], correct: 0, why: "Câu “câu giờ” lịch sự rồi **vẫn trả lời**. Im lặng hay “I don't know” làm mất điểm **Fluency** (độ trôi chảy)." },
        { q: "Chọn câu đúng ngữ pháp:", options: ["The main reason is because it's cheap.", "The main reason is that it's cheap.", "The main reason is because of it's cheap."], correct: 1, why: "**The reason is that** + S + V là chuẩn. “The reason is because” bị coi là lặp ý trong văn trang trọng; **because of** + **danh từ**, không + mệnh đề." },
      ],
    },

    { t: "h", text: "5. Phát âm: âm /θ/ trong think" },
    {
      t: "p",
      text: "Bạn sẽ nói **I think** hàng chục lần trong bài thi. Người Việt hay đọc **think** thành ~~“sink”~~ (/s/ — nghĩa là **chìm**!) hoặc ~~“tink”~~ (/t/). Âm **/θ/**: đặt **đầu lưỡi giữa hai hàm răng** (thò ra một chút), rồi **thổi hơi** qua khe đó — **không rung** cổ họng. Đây là “anh em” không rung của âm /ð/ (Ngày 3: this, they).",
    },
    {
      t: "table",
      head: ["Cặp dễ nhầm", "/θ/", "Âm hay đọc nhầm", "Vì sao quan trọng"],
      rows: [
        ["think — sink", "/θɪŋk/ nghĩ", "/sɪŋk/ chìm; bồn rửa", "“I sink so” → giám khảo phải đoán ý."],
        ["three — tree", "/θriː/ số ba", "/triː/ cái cây", "Đọc sai số = sai thông tin ở Part 1."],
        ["thank — tank", "/θæŋk/ cảm ơn", "/tæŋk/ bể chứa, xe tăng", ""],
        ["both — boat", "/bəʊθ/ cả hai", "/bəʊt/ con thuyền", "/θ/ ở **cuối từ** hay bị nuốt mất."],
        ["health — help", "/helθ/ sức khoẻ", "(nuốt /θ/)", "Chủ đề Speaking cực hay gặp."],
      ],
    },
    {
      t: "phatam",
      id: "d12-phat-am",
      title: "Luyện phát âm — âm /θ/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Đầu lưỡi giữa hai hàm răng, thổi hơi, không rung. Đừng đọc thành /s/ (sink) hay /t/ (tink). Với /θ/ cuối từ (both, health, month), giữ lưỡi ở răng tới hết hơi.",
      items: [
        { text: "think, thing, thank", ipa: "θɪŋk θɪŋ θæŋk", vi: "/θ/ đầu từ" },
        { text: "three, through, throw", ipa: "θriː θruː θrəʊ", vi: "/θr/ — lưỡi từ răng lùi về /r/" },
        { text: "both, health, month", ipa: "bəʊθ helθ mʌnθ", vi: "/θ/ cuối từ — đừng nuốt" },
        { text: "think, sink, three, tree", ipa: "θɪŋk sɪŋk θriː triː", vi: "phân biệt /θ/ – /s/ – /t/" },
        { text: "I think it's worth it.", ipa: "aɪ θɪŋk ɪts wɜːθ ɪt", vi: "think · worth" },
        { text: "I think both methods are useful.", ipa: "aɪ θɪŋk bəʊθ meθədz ə juːsfl", vi: "ba âm /θ/" },
        { text: "Healthy habits are worth the effort.", ipa: "helθi hæbɪts ə wɜːθ ði efət", vi: "/θ/ trong healthy, worth · /ð/ trong the" },
        { text: "I thought about it for three months.", ipa: "aɪ θɔːt əbaʊt ɪt fə θriː mʌnθs", vi: "thought · three · months" },
      ],
    },

    { t: "h", text: "6. Luyện nói" },
    {
      t: "p",
      text: "Hai lượt luyện. **Part 1**: trả lời 2–3 câu theo **O–R–E**. **Part 3**: trả lời 4–6 câu, có **ví dụ** và **mặt kia** (That said…). Nhớ đọc đúng **/θ/** mỗi lần nói **I think**.",
    },
    {
      t: "speak",
      id: "d12-noi-p1",
      part: "1",
      questions: [
        "Do you think it's important to get enough sleep?",
        "Is it better to study alone or with friends?",
        "Do you think you use your phone too much?",
        "What do you think about cycling to school or work?",
        "Do you think it's important to have a daily routine?",
      ],
    },
    {
      t: "speak",
      id: "d12-noi-p3",
      part: "3",
      questions: [
        "Why do you think some people prefer cars to public transport?",
        "Should governments spend more money on cycle paths?",
        "How has technology changed the way young people spend their free time?",
        "Do you think people will use computers less in the future?",
      ],
    },
  ],
};

/* ─────────────────────────── Homework ─────────────────────────── */

const D12_HOMEWORK: Lesson = {
  id: "d12-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 12",
  goal: "Tự kiểm tra Ngày 12: 6 câu True / False / Not Given, 8 câu dịch có gợi ý, 8 câu điền cho bài Task 1, 6 câu trắc nghiệm quan điểm & Task 1, 4 câu ghép — 32 câu có đáp án.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I — TFNG** (6 câu) trên một đoạn ngắn — dùng sơ đồ quyết định 2 câu hỏi.",
        "**Phần II — Dịch** (8 câu): câu Task 1 và câu nêu quan điểm.",
        "**Phần III — Điền** (8 câu): giới từ by / to / at / in, quá khứ đơn, từ overview.",
        "**Phần IV — Trắc nghiệm** (6 câu) · **Phần V — Ghép câu** (4 câu).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 12 trong một hình",
      center: "**Ngày 12**",
      branches: [
        { label: "Đọc: TFNG", items: ["Bài có nói đúng ý? Không → NG", "Có → giống T · ngược F", "Soát all / most / only / always", "Không dùng kiến thức ngoài bài"] },
        { label: "Viết: Task 1 theo thời gian", items: ["Intro paraphrase · Overview không số", "Gom nhóm: giống xu hướng chung đoạn", "Quá khứ đơn · by / to / at", "Soát từng con số"] },
        { label: "Nói: quan điểm", items: ["O → R → E (Part 1)", "+ That said… + So overall (Part 3)", "I don't think + khẳng định", "/θ/ trong think"] },
      ],
    },

    { t: "h", text: "Phần I — True / False / Not Given (6 câu)" },
    {
      t: "passage",
      title: "The Riverside Night Market",
      paras: [
        { label: "A", text: "The Riverside Night Market opened in 2015 with only 40 stalls. Today it has more than 200, and around 5,000 people visit it every Saturday. Most stalls sell food, but there are also clothes and handmade jewellery." },
        { label: "B", text: "The market is run by the city council, which charges each stall owner a small weekly fee. Local residents were worried about noise at first, so the council agreed that all music must stop at 11 p.m. Since then, complaints have fallen sharply. Some shop owners in the area say the market takes customers away from them, while others believe it brings more visitors into the neighbourhood." },
      ],
    },
    {
      t: "mcq",
      id: "d12-bt-tfng",
      title: "Phần I — TRUE / FALSE / NOT GIVEN (6 câu)",
      items: [
        { q: "(1) The market had fewer than 50 stalls when it opened.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“opened in 2015 with **only 40 stalls**” → 40 < 50 → **TRUE**." },
        { q: "(2) The market is open every night of the week.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói có khoảng 5.000 người đến **mỗi thứ Bảy**; **không nói** chợ mở những ngày nào → **NOT GIVEN**. Đừng suy “Night Market” = mở mọi đêm." },
        { q: "(3) Stall owners do not have to pay to use the market.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“charges each stall owner **a small weekly fee**” → phải trả phí → **FALSE**." },
        { q: "(4) Food is the most common product at the market.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“**Most stalls sell food**” = phần lớn quầy bán đồ ăn → đồ ăn phổ biến nhất → **TRUE**." },
        { q: "(5) Local residents have never been concerned about the market.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“Local residents **were worried about noise at first**” → đã từng lo → câu hỏi “never concerned” **ngược** → **FALSE**." },
        { q: "(6) The council plans to make the market bigger.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói chợ đã lớn lên (40 → 200 quầy) nhưng **không nói kế hoạch tương lai** của hội đồng thành phố → **NOT GIVEN**." },
      ],
    },

    { t: "h", text: "Phần II — Dịch Việt → Anh (8 câu)" },
    {
      t: "quiz",
      id: "d12-bt-dich",
      title: "Phần II — Dịch sang tiếng Anh (8 câu)",
      kind: "translate",
      grammar: "The bar chart compares + how many + N + V-ed · Overall, A + V-ed, whereas B + V-ed · S + rose / fell + from X to Y · S + peaked at · by + năm, S + had + V3 · I think / I don't think + S + V · because + S + V · That said, + S + V.",
      items: [
        { q: "Biểu đồ cột so sánh số du khách đến ba thành phố từ năm 2010 đến 2020.", hint: "The bar chart compares, how many tourists / the number of tourists, visited three cities, between 2010 and 2020", answers: ["The bar chart compares how many tourists visited three cities between 2010 and 2020.", "The bar chart compares the number of tourists who visited three cities between 2010 and 2020.", "The bar chart compares the number of tourists visiting three cities between 2010 and 2020.", "The bar chart compares how many tourists visited three cities from 2010 to 2020.", "The bar chart compares the number of tourists to three cities between 2010 and 2020.", "The bar chart compares the number of visitors to three cities between 2010 and 2020."] },
        { q: "Nhìn chung, số người đi xe buýt giảm, trong khi số người đạp xe tăng.", hint: "Overall, the number of bus users, fell, whereas / while, the number of cyclists, rose", answers: ["Overall, the number of bus users fell, whereas the number of cyclists rose.", "Overall, the number of bus users fell, while the number of cyclists rose.", "Overall, the number of bus users decreased, whereas the number of cyclists increased.", "Overall, the number of bus users decreased, while the number of cyclists increased.", "Overall, the number of people taking the bus fell, whereas the number of cyclists rose.", "Overall, the number of bus passengers fell, whereas the number of cyclists rose.", "Overall, the number of bus users fell while the number of cyclists rose."] },
        { q: "Tỉ lệ thất nghiệp giảm từ 8% xuống 5%.", hint: "The unemployment rate, fell, from 8% to 5%", answers: ["The unemployment rate fell from 8% to 5%.", "The unemployment rate decreased from 8% to 5%.", "The unemployment rate dropped from 8% to 5%.", "The rate of unemployment fell from 8% to 5%.", "The unemployment rate declined from 8% to 5%.", "The unemployment rate fell from 8 percent to 5 percent."] },
        { q: "Doanh số đạt đỉnh vào năm 2018 rồi giảm nhẹ.", hint: "Sales, peaked in 2018, and then, fell / dipped slightly", answers: ["Sales peaked in 2018 and then fell slightly.", "Sales peaked in 2018 and then dipped slightly.", "Sales peaked in 2018 and then decreased slightly.", "Sales peaked in 2018 and then dropped slightly.", "Sales peaked in 2018 and fell slightly after that.", "Sales peaked in 2018, then fell slightly.", "Sales peaked in 2018 and then declined slightly."] },
        { q: "Đến năm 2020, xe đạp đã vượt xe buýt.", hint: "By 2020, bicycles, had overtaken, buses", answers: ["By 2020, bicycles had overtaken buses.", "By 2020 bicycles had overtaken buses.", "By 2020, bikes had overtaken buses.", "By 2020, cycling had overtaken buses.", "By 2020, bicycles had surpassed buses."] },
        { q: "Tôi không nghĩ học trực tuyến tốt hơn học trên lớp.", hint: "I don't think, online learning is better than, learning in class / classroom learning", answers: ["I don't think online learning is better than learning in class.", "I don't think online learning is better than classroom learning.", "I do not think online learning is better than learning in class.", "I don't think online learning is better than studying in class.", "I don't think online study is better than learning in class.", "I don't think that online learning is better than classroom learning.", "I don't think online learning is better than face-to-face learning."] },
        { q: "Tôi nghĩ lý do chính là giá cả.", hint: "I think, the main reason is, price / the price / cost", answers: ["I think the main reason is price.", "I think the main reason is the price.", "I think the main reason is cost.", "I think the main reason is the cost.", "I think the main reason is money.", "I think price is the main reason.", "I think the price is the main reason."] },
        { q: "Dù vậy, xe buýt vẫn rẻ hơn ô tô nhiều.", hint: "That said, buses are still, much cheaper than, cars", answers: ["That said, buses are still much cheaper than cars.", "Having said that, buses are still much cheaper than cars.", "That said, buses are still a lot cheaper than cars.", "However, buses are still much cheaper than cars.", "That said, the bus is still much cheaper than the car.", "That said, buses are still far cheaper than cars."] },
      ],
    },

    { t: "h", text: "Phần III — Điền một từ cho bài Task 1 (8 câu)" },
    {
      t: "quiz",
      id: "d12-bt-dien",
      title: "Phần III — Điền MỘT từ (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) The line graph ___ (thay cho shows) the number of cars sold in one country between 2010 and 2020.", answers: ["illustrates", "compares", "depicts", "presents"] },
        { q: "(2) ___, car sales rose, while motorbike sales fell. (từ mở overview)", answers: ["Overall", "overall"] },
        { q: "(3) In 2010, 2 million cars were sold, but this figure ___ (tăng, quá khứ) to 3.5 million in 2020.", answers: ["rose", "increased", "grew", "climbed"] },
        { q: "(4) Motorbike sales fell ___ 1 million over the period. (giảm đi bao nhiêu)", answers: ["by"] },
        { q: "(5) The figure peaked ___ 4 million in 2017.", answers: ["at"] },
        { q: "(6) There was a slight fall ___ bicycle sales in 2019.", answers: ["in"] },
        { q: "(7) ___ 2015, electric cars had overtaken diesel cars. (Đến năm…)", answers: ["By", "by"] },
        { q: "(8) In 2020, electric cars accounted ___ 15% of all new cars.", answers: ["for"] },
      ],
    },

    { t: "h", text: "Phần IV — Trắc nghiệm (6 câu)" },
    {
      t: "mcq",
      id: "d12-bt-chon",
      title: "Phần IV — Chọn đáp án đúng (6 câu)",
      items: [
        { q: "(1) Overview của Task 1 nên…", options: ["nêu 2 đặc điểm nổi bật nhất, không có số chi tiết", "có nhiều con số chi tiết", "nêu ý kiến của bạn về số liệu"], correct: 0, why: "Overview = **xu hướng chính / điểm nổi bật**, **không** số chi tiết, **không** ý kiến." },
        { q: "(2) Số liệu năm 2004–2024, câu nào đúng thì?", options: ["Laptop ownership rises steadily.", "Laptop ownership has risen steadily in 2004.", "Laptop ownership rose steadily."], correct: 2, why: "Số liệu đã qua (2004–2024) → **quá khứ đơn**: **rose**." },
        { q: "(3) Câu nào đúng?", options: ["62 percentage of households owned a desktop.", "62% of households owned a desktop.", "62 percentages of households owned a desktop."], correct: 1, why: "**percent / %** đi sau số. **percentage** là danh từ: **the percentage of** households." },
        { q: "(4) “Do you think cities should ban cars from the centre?” — câu mở đầu nào tốt nhất?", options: ["I'd say yes, at least during the day, mainly because the streets are too crowded.", "According to me, yes.", "I agree with this."], correct: 0, why: "Câu 1: quan điểm (có mức độ) + **lý do**. Câu 2 sai cụm; câu 3 dùng agree khi câu hỏi **không nêu ý kiến nào** để đồng ý." },
        { q: "(5) Câu nào phủ định tự nhiên nhất?", options: ["I think young people don't read enough.", "I don't think young people read enough.", "Both are equally natural."], correct: 1, why: "Cả hai đều đúng ngữ pháp, nhưng người bản xứ thường **phủ định ở think**: **I don't think** + mệnh đề khẳng định. Đây là cách tự nhiên hơn khi nêu quan điểm." },
        { q: "(6) Từ nối nào giới thiệu **mặt kia** trong Part 3?", options: ["For example,", "Because", "That said,"], correct: 2, why: "**That said, / Having said that,** = dù vậy — giới thiệu ý **ngược lại / hạn chế**. For example đưa ví dụ; because đưa lý do." },
      ],
    },

    { t: "h", text: "Phần V — Ghép câu (4 câu)" },
    {
      t: "build",
      id: "d12-bt-ghep",
      title: "Phần V — Ghép câu (4 câu)",
      items: [
        {
          vi: "Nhìn chung, việc dùng laptop tăng đều, trong khi máy để bàn kém phổ biến dần.",
          chips: ["Overall, ", "laptop use ", "rose steadily, ", "rised steadily, ", "whereas ", "desktops ", "became less popular."],
          answer: ["Overall, ", "laptop use ", "rose steadily, ", "whereas ", "desktops ", "became less popular."],
        },
        {
          vi: "Tỉ lệ sở hữu máy tính bảng đạt đỉnh 45% vào năm 2020.",
          chips: ["Tablet ownership ", "peaked ", "at ", "on ", "45% ", "in 2020."],
          answer: ["Tablet ownership ", "peaked ", "at ", "45% ", "in 2020."],
        },
        {
          vi: "Tôi không nghĩ điện thoại nên bị cấm ở trường.",
          chips: ["I ", "don't think ", "think ", "phones ", "should be banned ", "shouldn't be banned ", "at school."],
          answer: ["I ", "don't think ", "phones ", "should be banned ", "at school."],
        },
        {
          vi: "Dù vậy, không phải ai cũng đủ tiền mua ô tô.",
          chips: ["That said, ", "According to me, ", "not everyone ", "can afford ", "a car."],
          answer: ["That said, ", "not everyone ", "can afford ", "a car."],
        },
      ],
    },
  ],
};

/* ─────────────────────────── Kiểm tra chặng 2 (Ngày 7–12) ─────────────────────────── */
/**
 * Bài kiểm tra chặng 2 — gom Ngày 7–12 thành 8 phần (xem ../SOAN-BAI.md mục "Trọn gói
 * mỗi Ngày mới", ý 4). Mọi câu hỏi, kịch bản nghe, bài đọc, biểu đồ đều VIẾT MỚI — cùng kiến
 * thức với bài học nhưng khác ngữ liệu, để người học không nhớ đáp án. id bài tập bắt đầu
 * bằng `d12-kt-` (tiến độ & điểm lưu theo id — đừng đổi). Viết thẳng trong tệp ngày vì script
 * mục lục chạy node strip-types, không nạp được import tương đối không đuôi .ts.
 */
const KIEM_TRA_2: Lesson = {
  id: "d12-kiem-tra",
  kind: "review",
  title: "Bài kiểm tra chặng 2 (Ngày 7–12)",
  goal: "Tự đo xem đã nắm chắc ngữ pháp, từ vựng và 4 kỹ năng của Ngày 7–12 chưa (tính từ – trạng từ – so sánh, hiện tại đơn / tiếp diễn & quá khứ đơn, used to, cụm danh từ, collocation, Listening Part 1–3 kể cả bản đồ, Reading Table / Matching Features / TFNG, thân bài – kết bài Opinion, Task 1 biểu đồ đường & cột, Speaking Part 1), biết chính xác phần nào cần ôn trước khi sang Ngày 13.",
  minutes: 120,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra này đo gì",
      items: [
        "**8 phần**, khoảng **120 phút** (chia hai buổi được: phần 1–5 ~75′ · phần 6–8 ~45′): Ngữ pháp · Từ vựng · Dịch · Nghe · Đọc · Viết · Nói · Phát âm — toàn bộ là kiến thức **Ngày 7–12**, không có gì mới.",
        "**Đạt** = từ **70 %** trở lên ở **từng phần**. Đầu mỗi phần ghi sẵn ngưỡng đạt và **Ngày cần ôn** nếu trượt.",
        "Mọi câu đều **mới** so với bài học (cùng kiến thức, khác ngữ liệu) — nhớ đáp án cũ không giúp được, phải thật sự hiểu.",
        "Nghe: 4 bài (Part 1 · Part 2 trắc nghiệm · Part 3 · Part 2 **bản đồ**), mỗi bài nghe **tối đa 2 lần**. Đọc: một bài ~550 từ với 3 dạng câu hỏi đã học. Viết: thân bài + kết bài Opinion, một bài Task 1 biểu đồ đường và một bài mẫu **biểu đồ cột** để điền.",
        "Xong phần nào **ghi điểm ra giấy** phần đó. Cuối bài có bảng chỉ đường: trượt phần nào thì mở lại đúng bài nào.",
      ],
    },
    {
      t: "p",
      text: "Đây là **bài kiểm tra chặng 2** (checkpoint test). Chặng 1 kiểm nền móng (câu đơn, đại từ, danh từ); chặng này kiểm **phần mở rộng**: câu có tính từ – trạng từ – so sánh, hai thì mới (hiện tại tiếp diễn, quá khứ đơn), cách ghép từ cho tự nhiên (collocation), ba Part đầu của Listening, ba dạng Reading mới, và lần đầu bạn viết **trọn** thân bài – kết bài Task 2 lẫn **trọn** bài Task 1.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng 2 (Ngày 7–12) — những gì sẽ bị kiểm",
      center: "Ngày 7–12",
      branches: [
        { label: "Ngữ pháp", items: ["N7 tính từ · trạng từ (vị trí) · -ed/-ing · so sánh", "N9 hiện tại đơn vs tiếp diễn · quá khứ đơn", "N10 used to / be used to", "N11 trật tự từ · cụm danh từ · collocation"], anh: "memo" },
        { label: "Từ vựng", items: ["N7 Remote work 2 + cụm động từ", "N9 Volunteering + cụm động từ", "N11 từ tả xu hướng (rise, peak, fluctuate…)"], anh: "books" },
        { label: "Nghe", items: ["N7 Part 1 · điền phiếu", "N9 Part 2 · trắc nghiệm + bản đồ (Map Labelling)", "N11 Part 3 · hội thoại học thuật"], anh: "headphone" },
        { label: "Đọc", items: ["N8 Table Completion", "N10 Matching Features", "N12 True / False / Not Given"], anh: "notebook" },
        { label: "Viết", items: ["N8 thân bài · N10 kết bài Opinion", "N12 Task 1 biểu đồ đường + biểu đồ cột theo năm"], anh: "pencil" },
        { label: "Nói · Phát âm", items: ["N8 sở thích · N10 thói quen · N12 quan điểm", "/ŋ/ · -ed · /ʒ/ · trọng âm · /θ/"], anh: "microphone" },
      ],
      caption: "Mỗi nhánh là một phần của bài kiểm tra. Nhánh nào trượt thì ôn đúng Ngày ghi trên nhánh đó.",
    },
    {
      t: "note",
      title: "Cách làm bài",
      items: [
        "**Gập sách, gập vở**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm. Mục đích là biết bạn **thật sự nhớ** được bao nhiêu.",
        "Thời gian gợi ý (cộng **120′**): Ngữ pháp 15′ · Từ vựng 10′ · Dịch 8′ · Nghe 20′ · Đọc 20′ · Viết 35′ · Nói 7′ · Phát âm 5′. Có thể chia **hai buổi**: buổi 1 làm phần 1–5 (~75′), buổi 2 làm phần 6–8 (~45′).",
        "Ở phần **Dịch**, cố **không bấm 💡 Gợi ý**. Bấm thì vẫn được, nhưng tự trừ câu đó khi tính điểm.",
        "Phần **Nghe**: đọc câu hỏi trước, mỗi bài nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi trả lời xong cả bài đó.",
        "Phần **Đọc**: làm trong **20 phút** như thi thật (bài ~550 từ, 14 câu). Hết giờ thì dừng, chưa trả lời thì tính sai.",
        "Làm xong một phần thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu với bảng dưới đây.",
      ],
    },
    {
      t: "table",
      caption: "Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần",
      head: ["Phần", "Số câu", "Đạt khi", "Chưa đạt thì ôn lại"],
      rows: [
        ["1. Ngữ pháp", "16 + 12", "≥ 20/28 câu đúng (cộng hai khối)", "Ngày 7 · Tính từ & trạng từ (mục 2–7) — Ngày 9 · Hiện tại đơn / tiếp diễn & quá khứ đơn (mục 1–8) — Ngày 10 · Nói mục 3 (used to) — Ngày 11 · Trật tự từ, cụm danh từ, collocation (mục 2–7)"],
        ["2. Từ vựng", "12 + 6", "≥ 9/12 và ≥ 5/6", "Ngày 7 · Remote Work 2 — Ngày 9 · Volunteering — Ngày 11 · Biểu đồ theo thời gian 1 (mục 1–2); cụm động từ ở mục 2 của Ngày 7 và Ngày 9"],
        ["3. Dịch Việt → Anh", "6", "≥ 5 câu đúng", "Các bài dịch 💡 trong bài ngữ pháp Ngày 7, 9, 11 và phần Dịch của Bài tập Ngày 8, 10, 12"],
        ["4. Nghe", "5 + 3 + 4 + 5", "≥ 12/17 câu đúng (cộng bốn bài)", "Ngày 7 · Listening Part 1 (mục 2–4) — Ngày 9 · Part 2 (mục 2 trắc nghiệm, mục 3 bản đồ) — Ngày 11 · Part 3 (mục 2–3)"],
        ["5. Đọc", "4 + 5 + 5", "≥ 10/14 câu đúng (cộng ba khối)", "Ngày 8 · Table Completion (mục 1) — Ngày 10 · Matching Features (mục 1–2) — Ngày 12 · TFNG (mục 1)"],
        ["6. Viết", "2 bài + 8 chỗ trống", "AI chấm ≥ band 4.0; thân bài có ĐỦ câu chủ đề – giải thích – ví dụ; Task 1 có overview không số và số liệu đúng hình; bài mẫu biểu đồ cột ≥ 6/8 chỗ đúng", "Ngày 8 · Viết (mục 2–5) — Ngày 10 · Viết (mục 2–3) — Ngày 12 · Viết (mục 1–4) — Ngày 11 · Từ vựng (mục 1–3)"],
        ["7. Nói", "6 câu hỏi", "AI chấm ≥ band 4.0, mỗi câu trả lời 2–3 câu theo khung", "Ngày 8 · Nói (mục 3–4) — Ngày 10 · Nói (mục 2, 5) — Ngày 12 · Nói (mục 2)"],
        ["8. Phát âm", "8 dòng", "≥ 70 điểm ở ít nhất 6/8 dòng", "Ngày 8 mục 7 (/ŋ/) — Ngày 9 mục 9 (-ed) — Ngày 10 mục 7 (/ʒ/, used to) — Ngày 11 (trọng âm) — Ngày 12 mục 5 (/θ/) — Ngày 7 (số -teen / -ty)"],
      ],
    },

    /** ───────────── 1. Ngữ pháp ───────────── **/
    { t: "h", text: "Phần 1 — Ngữ pháp (16 + 12 câu · đạt ≥ 20/28 · trượt thì ôn Ngày 7, 9, 10, 11)" },
    {
      t: "p",
      text: "Chọn đáp án đúng. **Khối 1a** (16 câu): **tính từ hay trạng từ** (-ly, động từ nối + tính từ), **-ed / -ing**, **thứ tự tính từ**, **so sánh hơn / nhất**, **hiện tại tiếp diễn** (và động từ trạng thái), **quá khứ đơn** (was/were, có quy tắc, bất quy tắc, câu hỏi), **make / do**, **trật tự từ** S – V – O – cách thức – nơi chốn – thời gian. **Khối 1b** (12 câu): **vị trí trạng từ**, **hiện tại đơn hay tiếp diễn**, **used to / be used to**, **cụm danh từ** và **collocation** ngoài make/do (tính từ + danh từ, trạng từ + tính từ / động từ, danh từ + giới từ). Điểm phần 1 = cộng hai khối.",
    },
    {
      t: "mcq",
      id: "d12-kt-ngu-phap",
      title: "Phần 1a — Ngữ pháp (16 câu)",
      items: [
        { q: "The new intern works very ___ and never misses a deadline.", options: ["carefully", "careful", "carefulness"], correct: 0, why: "Bổ nghĩa cho **động từ** works → cần **trạng từ**: careful + **-ly** = carefully. (Ngày 7, mục 4)" },
        { q: "This report is ___ than the last one; it only has two pages.", options: ["short", "shorter", "the shortest"], correct: 1, why: "Có **than** → so sánh **hơn**: tính từ ngắn + **-er** = shorter. the shortest là so sánh nhất (không đi với than). (Ngày 7, mục 7)" },
        { q: "I felt really ___ after the three-hour video conference.", options: ["boring", "bore", "bored"], correct: 2, why: "Nói về **cảm giác của người** → tính từ **-ed**: bored (chán). boring = gây chán (tả sự vật: a boring meeting). (Ngày 7, mục 3)" },
        { q: "She bought a ___ bag for work.", options: ["black small leather", "small black leather", "leather small black"], correct: 1, why: "Thứ tự tính từ: **kích cỡ → màu → chất liệu**: small (cỡ) → black (màu) → leather (chất liệu). (Ngày 7, mục 2)" },
        { q: "The soup smells ___. Did you add too much salt?", options: ["strange", "strangely", "stranger"], correct: 0, why: "**smell** ở đây là **động từ nối** (tả trạng thái của món súp) → đi với **tính từ**: smells strange. ~~smells strangely~~ là lỗi hay gặp. (Ngày 7, mục 6)" },
        { q: "Of all the coworking spaces in the city, this one is ___.", options: ["quieter", "the most quietest", "the quietest"], correct: 2, why: "\"Of all…\" → so sánh **nhất**: quiet là tính từ **ngắn** (2 âm tiết, đuôi -et) → the quiet**est**. ~~the most quietest~~ sai vì dùng cả most lẫn -est; quieter là so sánh hơn. (Ngày 7, mục 7)" },
        { q: "My brother is ___ at maths than I am.", options: ["gooder", "more good", "better"], correct: 2, why: "**good** là tính từ **bất quy tắc**: good → **better** → the best. ~~gooder~~ / ~~more good~~ không tồn tại. (Ngày 7, mục 7)" },
        { q: "Be quiet, please. The children ___ in the next room.", options: ["sleep", "are sleeping", "sleeps"], correct: 1, why: "Hành động **đang diễn ra ngay lúc nói** (Be quiet → đừng đánh thức) → **hiện tại tiếp diễn**: are + sleep**ing**. (Ngày 9, mục 1–2)" },
        { q: "I ___ this coffee. It's too sweet.", options: ["am not liking", "don't like", "not like"], correct: 1, why: "**like** là **động từ trạng thái** (cảm xúc) → **không chia tiếp diễn**, dùng hiện tại đơn phủ định: don't like. (Ngày 9, mục 3)" },
        { q: "Last year our team ___ more than two thousand books for the village library.", options: ["collect", "collects", "collected"], correct: 2, why: "**Last year** = mốc thời gian đã kết thúc → **quá khứ đơn**: collect + **-ed**. (Ngày 9, mục 6, 8)" },
        { q: "We ___ at the shelter yesterday, but the coordinator ___ there.", options: ["were / wasn't", "was / weren't", "were / weren't"], correct: 0, why: "**We** → **were**; **the coordinator** (một người, số ít) → **wasn't**. (Ngày 9, mục 5)" },
        { q: "Mai ___ a food bank in 2022 and still helps there every weekend.", options: ["sets up", "set up", "was setting up"], correct: 1, why: "**in 2022** → quá khứ đơn; **set** là động từ **bất quy tắc** có 3 dạng giống nhau (set – set – set) → set up. (Ngày 9, mục 7)" },
        { q: "Where ___ you ___ last summer?", options: ["did / go", "did / went", "do / went"], correct: 0, why: "Câu hỏi quá khứ: Wh- + **did** + S + **V nguyên mẫu**. Đã có did thì động từ **không** chia quá khứ nữa: ~~did you went~~. (Ngày 9, mục 6)" },
        { q: "Look! Someone ___ flyers outside the station.", options: ["is handing out", "hands out", "handed out"], correct: 0, why: "**Look!** = đang xảy ra trước mắt → hiện tại tiếp diễn: is handing out (hand out = phát). (Ngày 9, mục 2; cụm động từ Ngày 9)" },
        { q: "Before the meeting, please ___ a decision about the schedule.", options: ["do", "make", "give"], correct: 1, why: "Collocation: **make a decision** (ra quyết định). ~~do a decision~~ sai; give a decision chỉ dùng cho toà án. (Ngày 11, mục 4)" },
        { q: "Choose the sentence with the correct word order.", options: ["She checks her emails carefully at home every morning.", "She checks carefully her emails at home every morning.", "She every morning checks her emails at home carefully."], correct: 0, why: "Trật tự **S – V – O – cách thức – nơi chốn – thời gian**: She (S) checks (V) her emails (O) carefully (cách thức) at home (nơi) every morning (thời gian). Không chen trạng từ giữa V và O. (Ngày 11, mục 2)" },
      ],
    },

    {
      t: "mcq",
      id: "d12-kt-ngu-phap-2",
      title: "Phần 1b — Ngữ pháp mở rộng (12 câu)",
      items: [
        { q: "She ___ late for online meetings, so we never wait for her.", options: ["is always", "always is", "always"], correct: 0, why: "Trạng từ **tần suất** đứng **sau be**: is **always** late. ~~always is~~ sai vị trí (always chỉ đứng **trước động từ thường**); \"She always late\" thiếu động từ be. (ôn Ngày 7, mục 5)" },
        { q: "Choose the correct sentence.", options: ["I very like working with my team.", "I like very much working with my team.", "I really like working with my team."], correct: 2, why: "**very** không đứng trước động từ → ~~I very like~~. **very much** là trạng từ, không chen giữa động từ và tân ngữ → ~~like very much working~~. Đúng: **I really like** working… (hoặc I like working with my team very much). (ôn Ngày 7, mục 5)" },
        { q: "Examiner: \"What do you do?\" — Which answer fits the question?", options: ["I'm a nurse. I work at a children's hospital.", "I'm doing an English test right now.", "I am working at a children's hospital every day."], correct: 0, why: "**What do you do?** hỏi **nghề nghiệp** → trả lời bằng **hiện tại đơn** (I work…). B trả lời câu \"What are you doing?\" (đang làm gì). C sai vì **every day** (thói quen) đi với hiện tại đơn, không đi với tiếp diễn. (ôn Ngày 9, mục 4)" },
        { q: "My sister usually ___ to work, but this week she ___ from home because her office is closed.", options: ["is driving / works", "drives / works", "drives / is working"], correct: 2, why: "**usually** = thói quen → hiện tại **đơn**: drives. **this week** = tạm thời → hiện tại **tiếp diễn**: is working. Đây đúng là cặp \"lâu dài ↔ tạm thời\" của bảng so sánh. (ôn Ngày 9, mục 4)" },
        { q: "I ___ like vegetables when I was a child, but now I love them.", options: ["didn't used to", "wasn't used to", "didn't use to"], correct: 2, why: "\"Trước đây không…, nay thì có\" → **used to**; phủ định: sau **didn't** bỏ -d → **didn't use to** + V. ~~didn't used to~~ là lỗi chính tả hay gặp; **wasn't used to** = \"chưa quen với\" (và phải + V-ing), sai nghĩa. (ôn Ngày 10 — bài Nói, mục 3)" },
        { q: "I've lived alone for five years, so I ___ for myself.", options: ["am used to cooking", "am used to cook", "used to cooking"], correct: 0, why: "\"Đã **quen** với việc tự nấu\" → **be used to + V-ing** (to là giới từ). ~~am used to cook~~ sai dạng động từ; ~~used to cooking~~ thiếu be và sai nghĩa (used to = \"trước đây thường\"). (ôn Ngày 10 — bài Nói, mục 3)" },
        { q: "The office is a ___ walk from the station.", options: ["ten-minutes", "ten-minute", "ten minute's"], correct: 1, why: "**Số + danh từ + gạch nối** đứng trước danh từ làm tính từ → danh từ **không thêm -s**: a **ten-minute** walk (như a five-year plan). Khi đứng một mình mới có -s: The walk takes **ten minutes**. (ôn Ngày 11, mục 3)" },
        { q: "The number of remote workers in our city ___ rising every year.", options: ["are", "is", "have"], correct: 1, why: "Danh từ chính của cụm là **number** (số ít) → **the number of + N số nhiều** đi với động từ **số ít**: The number… **is** rising. Khác **a number of** workers (= nhiều người) **are**… (ôn Ngày 11, mục 3)" },
        { q: "There was very ___ traffic on the way to the airport, so we nearly missed our flight.", options: ["strong", "big", "heavy"], correct: 2, why: "Collocation **tính từ + danh từ**: **heavy traffic** (đông xe), cũng như heavy rain. ~~strong traffic~~ / ~~big traffic~~ là dịch từng chữ. (ôn Ngày 11, mục 5)" },
        { q: "Petrol prices are very ___ this year, so more people are cycling.", options: ["high", "expensive", "dear"], correct: 0, why: "**price / cost / fee / rate** đi với **high / low**. **expensive / cheap / dear** dùng cho **món đồ** (petrol is expensive), không dùng cho chữ price: ~~expensive prices~~. (ôn Ngày 11, mục 5)" },
        { q: "This revision method is ___ effective: almost every student in the trial improved.", options: ["deeply", "highly", "fully"], correct: 1, why: "Collocation **trạng từ + tính từ**: **highly effective** (rất hiệu quả). deeply đi với worried / concerned; fully đi với aware. (ôn Ngày 11, mục 6)" },
        { q: "Many doctors worry about the impact of smartphones ___ children's sleep.", options: ["to", "on", "for"], correct: 1, why: "**an impact / an effect ON** + N. ~~impact to~~ là lỗi người Việt hay mắc (dịch \"tác động **đến**\"). for đi với **reason for / demand for**. (ôn Ngày 11, mục 7)" },
      ],
    },

    /** ───────────── 2. Từ vựng ───────────── **/
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 9/12 và ≥ 5/6 · trượt thì ôn từ vựng Ngày 7, 9, 11)" },
    {
      t: "p",
      text: "**2a**: điền **một từ** (hoặc cụm từ ghép như **clean-up**) vào chỗ trống; nghĩa tiếng Việt nằm trong ngoặc. Từ lấy từ ba chủ đề: **Remote Work 2** (Ngày 7), **Volunteering** (Ngày 9), **xu hướng biểu đồ** (Ngày 11). Viết đúng chính tả và đúng **dạng** (quá khứ, số nhiều…). **2b**: chọn cụm động từ đúng.",
    },
    {
      t: "quiz",
      id: "d12-kt-tu-vung",
      title: "Phần 2a — Từ vựng chủ đề (12 câu)",
      kind: "fill",
      items: [
        { q: "Traffic in the ___ hour is terrible, so I leave home at six. (giờ cao điểm)", answers: ["rush"], hint: "Ngày 7 · Remote Work 2" },
        { q: "Our company has a ___ model: three days in the office, two days at home. (kết hợp văn phòng + từ xa)", answers: ["hybrid"], hint: "Ngày 7 · Remote Work 2" },
        { q: "After months of twelve-hour days, she suffered from ___. (kiệt sức vì công việc)", answers: ["burnout", "burn-out"], hint: "Ngày 7 · Remote Work 2" },
        { q: "Working alone all day can lead to a feeling of ___. (sự cô lập)", answers: ["isolation"], hint: "Ngày 7 · Remote Work 2" },
        { q: "She works for a ___ organisation that helps the homeless. (phi lợi nhuận)", answers: ["non-profit", "nonprofit", "non profit"], hint: "Ngày 9 · Volunteering" },
        { q: "Hundreds of people took part in the river ___ last Sunday. (buổi dọn dẹp)", answers: ["clean-up", "cleanup", "clean up"], hint: "Ngày 9 · Volunteering" },
        { q: "Volunteering is ___: you get nothing in money but a lot in happiness. (bổ ích, đáng công)", answers: ["rewarding"], hint: "Ngày 9 · Volunteering" },
        { q: "Every winter the charity gives warm meals to the ___. (những người vô gia cư — the + tính từ)", answers: ["homeless"], hint: "Ngày 9 · Volunteering" },
        { q: "Sales ___ between 2010 and 2015, going up and down every year. (dao động — quá khứ)", answers: ["fluctuated"], hint: "Ngày 11 · xu hướng" },
        { q: "The number of visitors ___ at 2 million in 2019 and then fell. (đạt đỉnh — quá khứ)", answers: ["peaked"], hint: "Ngày 11 · xu hướng" },
        { q: "After the sharp fall, the figure ___ steadily to its previous level. (hồi phục — quá khứ)", answers: ["recovered"], hint: "Ngày 11 · xu hướng" },
        { q: "Bicycle use ___ car use in 2020 and has been higher ever since. (vượt qua — quá khứ)", answers: ["overtook", "surpassed", "exceeded"], hint: "Ngày 11 · xu hướng" },
      ],
    },
    {
      t: "mcq",
      id: "d12-kt-cum-dong-tu",
      title: "Phần 2b — Cụm động từ (6 câu)",
      items: [
        { q: "The meeting is running late, so let's ___ now and continue tomorrow.", options: ["wrap up", "back up", "fall behind"], correct: 0, why: "**wrap up** = kết thúc, gói lại (cuộc họp, công việc) — Ngày 7. back up = sao lưu; fall behind = tụt lại phía sau." },
        { q: "I'm trying to ___ coffee — only one cup a day now.", options: ["switch off", "cut down on", "call back"], correct: 1, why: "**cut down on** = cắt giảm (thứ gì đó) — Ngày 7. switch off = tắt / ngắt khỏi công việc; call back = gọi lại." },
        { q: "Always ___ your files before you update the software.", options: ["hand over", "run late", "back up"], correct: 2, why: "**back up** = sao lưu dữ liệu — Ngày 7. hand over = bàn giao; run late = bị muộn." },
        { q: "Our neighbours ___ old clothes to the shelter every winter.", options: ["give away", "look after", "get through"], correct: 0, why: "**give away** = cho đi, tặng (không lấy tiền) — Ngày 9. look after = chăm sóc; get through = vượt qua, làm xong." },
        { q: "Volunteers ___ hot meals to people queuing outside the church.", options: ["fall behind", "hand out", "sign off"], correct: 1, why: "**hand out** = phát (cho nhiều người) — Ngày 9. sign off = kết thúc ca làm / ký duyệt." },
        { q: "If everyone ___, we can finish painting the school by lunchtime.", options: ["pitches in", "wraps up", "drops off"], correct: 0, why: "**pitch in** = xúm vào giúp — Ngày 9. Chủ ngữ **everyone** số ít → pitch**es**. drop off = thả, gửi (đồ) đến." },
      ],
    },

    /** ───────────── 3. Dịch ───────────── **/
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5 · trượt thì ôn bài dịch 💡 Ngày 7, 9, 11)" },
    {
      t: "p",
      text: "Dịch mỗi câu sang tiếng Anh, viết **cả câu**, có dấu chấm ở cuối. Mỗi câu gộp **một điểm ngữ pháp** của chặng với **một từ vựng** đã học. Máy chấp nhận nhiều cách viết đúng; nếu bạn chắc câu mình đúng mà máy báo sai, so với đáp án mẫu — có thể bạn dùng một từ khác nghĩa.",
    },
    {
      t: "quiz",
      id: "d12-kt-dich",
      title: "Phần 3 — Dịch Việt → Anh (6 câu)",
      kind: "translate",
      grammar: "adj + -er than / the + adj + -est · adv -ly (more fluently) · S + am/is/are + V-ing · S + V-ed / V2 + mốc quá khứ · rise / increase sharply · make a decision",
      items: [
        {
          q: "Cô ấy nói tiếng Anh trôi chảy hơn tôi.",
          hint: "speaks English, more fluently than, I do / me",
          answers: [
            "She speaks English more fluently than I do.",
            "She speaks English more fluently than me.",
            "She speaks English more fluently than I.",
            "She can speak English more fluently than I can.",
            "She can speak English more fluently than me.",
          ],
        },
        {
          q: "Hôm qua chúng tôi đã quyên góp quần áo cũ cho một trại trẻ mồ côi.",
          hint: "donated, old clothes, to an orphanage, yesterday",
          answers: [
            "Yesterday we donated old clothes to an orphanage.",
            "Yesterday, we donated old clothes to an orphanage.",
            "We donated old clothes to an orphanage yesterday.",
            "We donated some old clothes to an orphanage yesterday.",
            "Yesterday we donated some old clothes to an orphanage.",
            "We gave old clothes to an orphanage yesterday.",
          ],
        },
        {
          q: "Bây giờ anh ấy đang làm việc ở nhà vì giờ cao điểm thật kinh khủng.",
          hint: "is working, from home / at home, now, because, the rush hour, is terrible",
          answers: [
            "He is working from home now because the rush hour is terrible.",
            "He's working from home now because the rush hour is terrible.",
            "He is working at home now because the rush hour is terrible.",
            "He's working at home now because the rush hour is terrible.",
            "Now he is working from home because the rush hour is terrible.",
            "He is working from home now because rush hour is terrible.",
            "He's working from home now because rush hour is terrible.",
            "He is working from home now because the rush hour is awful.",
          ],
        },
        {
          q: "Số lượng tình nguyện viên tăng mạnh vào năm 2020.",
          hint: "the number of volunteers, rose / increased, sharply, in 2020",
          answers: [
            "The number of volunteers rose sharply in 2020.",
            "The number of volunteers increased sharply in 2020.",
            "The number of volunteers grew sharply in 2020.",
            "The number of volunteers rose dramatically in 2020.",
            "The number of volunteers increased dramatically in 2020.",
            "The number of volunteers rose significantly in 2020.",
            "The number of volunteers increased significantly in 2020.",
            "In 2020, the number of volunteers rose sharply.",
            "In 2020 the number of volunteers rose sharply.",
            "In 2020, the number of volunteers increased sharply.",
          ],
        },
        {
          q: "Đây là quán cà phê yên tĩnh nhất trong thành phố.",
          hint: "this is, the quietest, café / coffee shop, in the city",
          answers: [
            "This is the quietest café in the city.",
            "This is the quietest cafe in the city.",
            "This is the quietest coffee shop in the city.",
            "This is the quietest café in town.",
            "This is the quietest cafe in town.",
            "This is the quietest coffee shop in town.",
          ],
        },
        {
          q: "Chúng tôi đã đưa ra một quyết định quan trọng vào tuần trước.",
          hint: "made, an important decision, last week",
          answers: [
            "We made an important decision last week.",
            "Last week we made an important decision.",
            "Last week, we made an important decision.",
            "We made a very important decision last week.",
            "We took an important decision last week.",
          ],
        },
      ],
    },

    /** ───────────── 4. Nghe ───────────── **/
    { t: "h", text: "Phần 4 — Nghe (17 câu · đạt ≥ 12 · trượt thì ôn Ngày 7, 9, 11)" },
    {
      t: "p",
      text: "Bốn bài nghe ngắn, đúng ba Part đã học: **Part 1** điền phiếu (Ngày 7) · **Part 2** độc thoại, trắc nghiệm (Ngày 9) · **Part 3** hội thoại học thuật, trắc nghiệm + nối người với ý kiến (Ngày 11) · và một bài **Part 2 dạng bản đồ** (Map Labelling, Ngày 9 mục 3) ở cuối. Với mỗi bài: đọc câu hỏi **trước**, gạch từ khoá, đoán loại từ, rồi mới bấm nghe. Cẩn thận bẫy **sửa lời** và **thông tin gây nhiễu** — luôn lấy thông tin **cuối cùng**.",
    },
    { t: "h", text: "Recording 1 — Part 1 · Questions 1–5" },
    {
      t: "canh",
      anh: ["telephone-receiver", "man-office-worker", "woman-student", "recycling-symbol"],
      caption: "Hana gọi điện tới **Oakwood Volunteer Centre** để đăng ký một buổi dọn rác cuối tuần. Nhân viên trực (Mark) điền phiếu trong lúc nói chuyện.",
    },
    {
      t: "table",
      caption: "Oakwood Volunteer Centre — Volunteer registration · Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Event", "**(1) ______** clean-up — Saturday"],
        ["Meeting time", "**(2) ______** p.m."],
        ["Meeting point", "outside the **(3) ______**"],
        ["Name", "Hana **(4) ______**"],
        ["Mobile number", "**(5) ______**"],
        ["Bring", "old clothes and water"],
      ],
    },
    {
      t: "listen",
      id: "d12-kt-nghe-1",
      title: "Signing up for a clean-up event",
      dan: { so: "Checkpoint Test 2, Recording 1", boiCanh: "a telephone conversation between a volunteer centre and a woman who wants to join a clean-up event.", cau: [1, 5] },
      note: "Giọng Anh-Anh (nhân viên, nam) và Anh-Mỹ (Hana, nữ), khoảng 1 phút rưỡi. Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi điền xong 5 chỗ trống.",
      lines: [
        { who: "Mark", voice: "uk-nam", text: "Oakwood Volunteer Centre, Mark speaking. How can I help?", vi: "Trung tâm Tình nguyện Oakwood, Mark nghe. Tôi giúp gì được ạ?" },
        { who: "Hana", voice: "us-nu", text: "Hi. I saw a post about a clean-up event this Saturday, and I'd like to join.", vi: "Chào anh. Tôi thấy bài đăng về buổi dọn rác thứ Bảy này, và tôi muốn tham gia." },
        { who: "Mark", voice: "uk-nam", text: "Great. We've actually got two events on Saturday: a park clean-up in the morning and a canal clean-up in the afternoon. Which one are you interested in?", vi: "Tuyệt. Thứ Bảy chúng tôi có hai hoạt động: dọn công viên buổi sáng và dọn kênh buổi chiều. Bạn quan tâm cái nào?" },
        { who: "Hana", voice: "us-nu", text: "The canal one, please. I live right next to it, and it's full of plastic.", vi: "Dọn kênh ạ. Tôi sống ngay cạnh con kênh, và nó đầy rác nhựa." },
        { who: "Mark", voice: "uk-nam", text: "Perfect. The canal clean-up starts at half past one, but we ask volunteers to arrive at a quarter past one, so we can hand out gloves and bags.", vi: "Tốt. Buổi dọn kênh bắt đầu lúc một rưỡi, nhưng chúng tôi nhờ tình nguyện viên tới lúc một giờ mười lăm để phát găng tay và túi." },
        { who: "Hana", voice: "us-nu", text: "A quarter past one. And where do we meet?", vi: "Một giờ mười lăm. Thế gặp nhau ở đâu ạ?" },
        { who: "Mark", voice: "uk-nam", text: "Normally we meet in the car park by the bridge, but there's a market there this weekend, so we'll meet outside the library instead. It's on Mill Road, just across from the canal.", vi: "Bình thường chúng tôi gặp ở bãi đỗ xe cạnh cầu, nhưng cuối tuần này có chợ ở đó, nên sẽ gặp ở trước thư viện. Nó nằm trên đường Mill, ngay đối diện con kênh." },
        { who: "Hana", voice: "us-nu", text: "Outside the library, got it.", vi: "Trước thư viện, tôi hiểu rồi." },
        { who: "Mark", voice: "uk-nam", text: "Can I take your name?", vi: "Cho tôi xin tên bạn?" },
        { who: "Hana", voice: "us-nu", text: "Hana Brecht. That's Hana, H, A, N, A, and Brecht is B, R, E, C, H, T.", vi: "Hana Brecht. Hana là H, A, N, A, còn Brecht là B, R, E, C, H, T." },
        { who: "Mark", voice: "uk-nam", text: "B, R, E, C, H, T. And a mobile number, in case we have to cancel because of the weather?", vi: "B, R, E, C, H, T. Và số di động, phòng khi phải huỷ vì thời tiết?" },
        { who: "Hana", voice: "us-nu", text: "Sure. It's oh seven seven one, five three two, double eight four.", vi: "Vâng. Là không bảy bảy một, năm ba hai, hai số tám, bốn." },
        { who: "Mark", voice: "uk-nam", text: "Oh seven seven one, five three two, eight eight four. Lovely. One more thing: we provide gloves and bags, but please wear old clothes and bring your own water.", vi: "Không bảy bảy một, năm ba hai, tám tám bốn. Tốt rồi. Một điều nữa: chúng tôi có găng tay và túi, nhưng bạn hãy mặc quần áo cũ và mang nước uống." },
        { who: "Hana", voice: "us-nu", text: "Will do. Thanks, Mark. See you on Saturday.", vi: "Vâng. Cảm ơn Mark. Hẹn gặp thứ Bảy." },
        { who: "Mark", voice: "uk-nam", text: "See you then. Bye.", vi: "Hẹn gặp bạn. Chào nhé." },
      ],
    },
    {
      t: "quiz",
      id: "d12-kt-nghe-1-dien",
      title: "Questions 1–5 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Event: ___ clean-up — Saturday", answers: ["canal"] },
        { q: "(2) Meeting time: ___ p.m.", answers: ["1.15", "1:15", "quarter past one", "a quarter past one", "1.15 pm", "1:15 pm"] },
        { q: "(3) Meeting point: outside the ___", answers: ["library"] },
        { q: "(4) Name: Hana ___", answers: ["Brecht"] },
        { q: "(5) Mobile number: ___", answers: ["0771 532 884", "0771532884", "0771 532884", "0771-532-884"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–5",
      items: [
        "**(1) canal** — Mark nêu **hai** sự kiện (park / canal); Hana chọn \"The **canal** one\". park là mồi nhử.",
        "**(2) 1.15** — bẫy **hai mốc giờ**: bắt đầu **half past one** (1.30) nhưng tình nguyện viên phải **arrive at a quarter past one** (1.15). Phiếu hỏi **meeting time** = giờ có mặt → 1.15.",
        "**(3) library** — bẫy **sửa lời**: \"Normally… the car park… **but**… we'll meet outside the **library** instead\". Sau **but / instead** là thông tin thật.",
        "**(4) Brecht** — nghe đánh vần **B-R-E-C-H-T**. Hay nhầm: **E** /iː/ với **I** /aɪ/; **C** /siː/ với **S** /es/.",
        "**(5) 0771 532 884** — **double eight** = hai số 8 liền nhau; **oh** = 0. Mark đọc lại từng số nên có cơ hội kiểm tra lần hai.",
      ],
    },
    { t: "h", text: "Recording 2 — Part 2 · Questions 6–8" },
    {
      t: "canh",
      anh: ["woman-office-worker", "laptop", "headphone", "office-building"],
      caption: "Priya, quản lý không gian làm việc chung **The Hub**, chào khách tới thăm trong ngày mở cửa và giải thích phí thành viên, nội quy.",
    },
    {
      t: "p",
      text: "**Questions 6–8.** Choose the correct letter, **A, B or C**. — Đọc 3 câu hỏi trước, gạch từ khoá (**open · fee · phone call**). Người nói sẽ nhắc cả ba lựa chọn — chỉ một cái đúng với **điều cô ấy khẳng định**.",
    },
    {
      t: "listen",
      id: "d12-kt-nghe-2",
      title: "Welcome talk at a coworking space",
      dan: { so: "Checkpoint Test 2, Recording 2", boiCanh: "a manager welcoming visitors to a coworking space on its open day.", cau: [6, 8] },
      note: "Giọng Anh-Anh (nữ), khoảng 1 phút rưỡi, một người nói. Nghe tối đa 2 lần.",
      lines: [
        { who: "Priya", voice: "uk-nu", text: "Good morning, everyone, and welcome to The Hub. My name's Priya and I'm the manager here. Before you look around, let me tell you a little about the space.", vi: "Chào buổi sáng mọi người, chào mừng đến The Hub. Tôi là Priya, quản lý ở đây. Trước khi các bạn tham quan, tôi xin giới thiệu đôi chút về không gian này." },
        { who: "Priya", voice: "uk-nu", text: "People sometimes think we've been here for years, because the building is old, but in fact we opened our doors just over a year ago — last spring, to be exact. Before that, the ground floor was empty for almost two years.", vi: "Nhiều người tưởng chúng tôi đã ở đây lâu năm vì toà nhà cũ, nhưng thật ra chúng tôi mới mở cửa hơn một năm — chính xác là mùa xuân năm ngoái. Trước đó, tầng trệt bỏ trống gần hai năm." },
        { who: "Priya", voice: "uk-nu", text: "So, what do you get as a member? Your monthly fee covers a desk, fast internet, and unlimited tea and coffee from the kitchen on the first floor.", vi: "Vậy thành viên được gì? Phí hàng tháng bao gồm một bàn làm việc, internet nhanh, và trà cà phê không giới hạn từ bếp ở tầng một." },
        { who: "Priya", voice: "uk-nu", text: "There's a lot of confusion about the meeting rooms, so let me be clear: the four meeting rooms are not included. You can book them online, and there's a small extra charge by the hour. Printing is also extra — you pay per page at the machine near reception.", vi: "Nhiều người hay nhầm về phòng họp, nên tôi nói rõ: bốn phòng họp không nằm trong phí. Bạn đặt trực tuyến và trả thêm một khoản nhỏ theo giờ. In ấn cũng tính thêm — trả theo trang ở máy gần quầy lễ tân." },
        { who: "Priya", voice: "uk-nu", text: "Now, a few house rules. The quiet room at the back is for silent work only — no calls, no conversations, not even a quick one.", vi: "Giờ là vài nội quy. Phòng yên tĩnh phía sau chỉ dành cho làm việc im lặng — không gọi điện, không nói chuyện, dù chỉ một câu." },
        { who: "Priya", voice: "uk-nu", text: "If you need to make a phone call, please don't do it at your desk either, because the open space echoes. Instead, use one of the three phone booths next to the entrance. They're free, and you don't need to book.", vi: "Nếu cần gọi điện, cũng xin đừng gọi ở bàn, vì không gian mở rất vang. Thay vào đó, hãy dùng một trong ba buồng điện thoại cạnh lối vào. Miễn phí và không cần đặt trước." },
        { who: "Priya", voice: "uk-nu", text: "Finally, we have a members' lunch every Thursday, where you can meet other freelancers and remote workers. It's the best way to find out who is working on what. Right, let's start the tour on the first floor.", vi: "Cuối cùng, thứ Năm hằng tuần có bữa trưa thành viên, nơi bạn gặp các freelancer và người làm việc từ xa khác. Đó là cách tốt nhất để biết ai đang làm gì. Nào, ta bắt đầu tham quan từ tầng một." },
      ],
    },
    {
      t: "mcq",
      id: "d12-kt-nghe-2-chon",
      title: "Questions 6–8 — Multiple choice",
      items: [
        { q: "(6) When did The Hub open?", options: ["A two years ago", "B about a year ago", "C three months ago"], correct: 1, why: "\"we opened our doors **just over a year ago** — last spring\" → B. Bẫy: \"for years\" (người ta tưởng) và \"almost **two years**\" (tầng trệt bỏ trống) đều **không phải** thời điểm mở cửa." },
        { q: "(7) What is included in the monthly fee?", options: ["A printing", "B meeting rooms", "C unlimited tea and coffee"], correct: 2, why: "\"Your monthly fee **covers** a desk, fast internet, and **unlimited tea and coffee**\" → C. Meeting rooms **not included**; printing **also extra**. Cả ba lựa chọn đều được nhắc — phải nghe **động từ** đi kèm (covers / not included / extra)." },
        { q: "(8) Where should members make phone calls?", options: ["A at their desk", "B in the quiet room", "C in a phone booth"], correct: 2, why: "\"**Instead**, use one of the three **phone booths** next to the entrance\" → C. Quiet room: **no calls**; at your desk: **don't**. Từ **Instead** báo hiệu câu trả lời thật." },
      ],
    },
    { t: "h", text: "Recording 3 — Part 3 · Questions 9–12" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "man-teacher", "bicycle"],
      caption: "Hai sinh viên **Anna** và **Leo** gặp giảng viên **Dr Chen** để bàn về khảo sát **sinh viên đi tới trường bằng gì** và cách trình bày kết quả. Để ý từ tả xu hướng (doubled, down from…) và ai **đề xuất** điều gì.",
    },
    {
      t: "p",
      text: "**Questions 9–10.** Choose the correct letter, A, B or C. **Questions 11–12.** What does each person suggest for the presentation? Choose **A, B or C** — một chữ cái có thể dùng nhiều lần. Ghi tắt **A / L / C** (Anna / Leo / Dr Chen) bên cạnh mỗi đề xuất khi nghe.",
    },
    {
      t: "listen",
      id: "d12-kt-nghe-3",
      title: "A survey on how students travel to campus",
      dan: { so: "Checkpoint Test 2, Recording 3", boiCanh: "a conversation between two students, Anna and Leo, and their tutor, Dr Chen, about a survey on student transport.", cau: [9, 12] },
      note: "Ba giọng: Anna (Mỹ, nữ), Leo (Anh, nam), Dr Chen (Mỹ, nam). Khoảng 2 phút. Nghe tối đa 2 lần.",
      lines: [
        { who: "Dr Chen", voice: "us-nam", text: "So, Anna, Leo — how's the transport survey going?", vi: "Nào, Anna, Leo — khảo sát giao thông đến đâu rồi?" },
        { who: "Anna", voice: "us-nu", text: "Good, thanks. We asked students how they travel to campus, and we compared this year's answers with the survey from five years ago.", vi: "Tốt ạ. Bọn em hỏi sinh viên đi tới trường bằng gì, rồi so câu trả lời năm nay với khảo sát năm năm trước." },
        { who: "Leo", voice: "uk-nam", text: "We got plenty of replies — over three hundred — so that wasn't a problem. The real problem was question four. When we read the answers, we realised people had understood it in two different ways. Some thought we were asking about the whole journey, and others only about the last part.", vi: "Bọn em nhận được nhiều phản hồi — hơn ba trăm — nên đó không phải vấn đề. Vấn đề thật là câu hỏi số bốn. Khi đọc câu trả lời, bọn em nhận ra mọi người hiểu nó theo hai cách. Một số nghĩ bọn em hỏi về cả hành trình, số khác chỉ về chặng cuối." },
        { who: "Dr Chen", voice: "us-nam", text: "That happens a lot. Mention it as a limitation. What did you find?", vi: "Chuyện đó hay gặp. Nêu nó như một hạn chế. Các em phát hiện gì?" },
        { who: "Leo", voice: "uk-nam", text: "The most interesting change is cycling. Five years ago, eleven per cent of students cycled to campus. This year it's twenty-one per cent, so it has almost doubled.", vi: "Thay đổi thú vị nhất là xe đạp. Năm năm trước, mười một phần trăm sinh viên đạp xe tới trường. Năm nay là hai mươi mốt phần trăm, gần như gấp đôi." },
        { who: "Anna", voice: "us-nu", text: "And the bus went the other way — down from forty per cent to thirty-two.", vi: "Còn xe buýt thì ngược lại — giảm từ bốn mươi phần trăm xuống ba mươi hai." },
        { who: "Dr Chen", voice: "us-nam", text: "Rose sharply, fell steadily — good. Use those words in the presentation. Now, you have ten minutes. How are you going to present all this?", vi: "Tăng mạnh, giảm đều — tốt. Dùng những từ đó trong bài thuyết trình. Giờ, các em có mười phút. Định trình bày thế nào?" },
        { who: "Anna", voice: "us-nu", text: "I've made a bar chart for the main results, and I thought we could interview five or six students and use their quotes — it would make the numbers feel more real.", vi: "Em đã làm một biểu đồ cột cho kết quả chính, và em nghĩ bọn em có thể phỏng vấn năm sáu sinh viên rồi trích lời họ — như vậy các con số sẽ thật hơn." },
        { who: "Leo", voice: "uk-nam", text: "I was going to suggest adding a second chart, just for bus users, because that's where the biggest drop is.", vi: "Em định đề xuất thêm một biểu đồ thứ hai, riêng cho người đi xe buýt, vì đó là chỗ giảm nhiều nhất." },
        { who: "Dr Chen", voice: "us-nam", text: "One chart is enough for ten minutes, Leo. Actually, my main advice is about the slides. How many have you got?", vi: "Một biểu đồ là đủ cho mười phút, Leo. Thật ra lời khuyên chính của thầy là về slide. Các em có bao nhiêu slide?" },
        { who: "Leo", voice: "uk-nam", text: "Fourteen.", vi: "Mười bốn ạ." },
        { who: "Dr Chen", voice: "us-nam", text: "That's far too many. Cut them to seven at the most — one idea per slide.", vi: "Nhiều quá. Cắt xuống tối đa bảy — mỗi slide một ý." },
        { who: "Anna", voice: "us-nu", text: "OK. So, fewer slides, one chart, and a few quotes.", vi: "Vâng. Vậy là ít slide hơn, một biểu đồ, và vài câu trích." },
        { who: "Dr Chen", voice: "us-nam", text: "Exactly. Send me the new version by Friday.", vi: "Chính xác. Gửi thầy bản mới trước thứ Sáu." },
      ],
    },
    {
      t: "mcq",
      id: "d12-kt-nghe-3-chon",
      title: "Questions 9–12 — Multiple choice & matching",
      items: [
        { q: "(9) What problem did the students have with their survey?", options: ["A Not enough students replied.", "B One question was understood in different ways.", "C The results were the same as five years ago."], correct: 1, why: "Leo: \"The real problem was question four… people had **understood it in two different ways**\" → B. Bẫy A: \"over three hundred… **wasn't a problem**\"." },
        { q: "(10) According to Leo, the percentage of students who cycle to campus has", options: ["A fallen slightly.", "B almost doubled.", "C stayed the same."], correct: 1, why: "\"eleven per cent… This year it's twenty-one per cent, so it has **almost doubled**\" → B (11 → 21). Xe **buýt** mới là thứ giảm (40 → 32)." },
        { q: "(11) What does Anna suggest for the presentation?", options: ["A add another chart", "B use fewer slides", "C interview some students"], correct: 2, why: "Anna: \"we could **interview five or six students** and use their quotes\" → C. Biểu đồ cột cô ấy **đã làm**, không phải đề xuất thêm." },
        { q: "(12) What does Dr Chen suggest for the presentation?", options: ["A add another chart", "B use fewer slides", "C interview some students"], correct: 1, why: "Dr Chen: \"my main advice is about the slides… **Cut them to seven** at the most\" → B (fewer slides). **Leo** là người đề xuất thêm biểu đồ (A) — và bị thầy gạt đi." },
      ],
    },
    { t: "h", text: "Recording 4 — Part 2 (Map Labelling) · Questions 13–17" },
    {
      t: "canh",
      anh: ["seedling", "man-office-worker", "deciduous-tree", "world-map"],
      caption: "Ngày trồng cây ở **Westbrook Park**. Người điều phối tình nguyện viên (**Sam**) đứng ở cổng chính và chỉ đường trên bản đồ: chỗ lấy dụng cụ, chỗ nhận cây giống, chỗ ăn trưa, khu trồng cây.",
    },
    {
      t: "p",
      text: "**Questions 13–17.** Label the map below. Write the correct letter, **A–H**, next to Questions 13–17. — Bản đồ có **8 ô** nhưng chỉ hỏi **5** địa điểm: ba ô còn lại là **ô gây nhiễu** mà Sam vẫn nhắc tới. Phía trên là hướng **Bắc**; cổng chính ở phía **Tây** (bên trái), lối chính chạy từ Tây sang Đông, lối dọc chạy Bắc – Nam qua ngã tư. Trước khi nghe: đặt ngón tay ở **You are here**, nhớ rằng đi về phía Đông thì **bên trái là phía Bắc**.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Westbrook Park — ghi chữ cái A–H cho câu 13–17",
        note: "Bản đồ tự vẽ cho bài kiểm tra. Phía trên là hướng Bắc. Bắt đầu ở Gate (You are here).",
        map: {
          cols: 12,
          rows: 9,
          paths: [
            // Lối chính Tây – Đông tách hai đoạn quanh ngã tư để nhãn không đè lên lối dọc.
            { x: 1.2, y: 4.2, w: 6.3, h: 0.8, label: "main path" },
            { x: 8.3, y: 4.2, w: 3.5, h: 0.8 },
            { x: 7.5, y: 1.3, w: 0.8, h: 6.5 },
          ],
          boxes: [
            { x: 0.2, y: 3.9, w: 1, h: 1.4, label: "Gate" },
            { x: 0.2, y: 6.6, w: 2.6, h: 2.2, label: "Car park" },
            { x: 9.2, y: 0.3, w: 2.6, h: 2.3, label: "Lake" },
            { x: 1.5, y: 2.3, w: 2.6, h: 1.6, blank: "A" },
            { x: 4.5, y: 2.3, w: 2.7, h: 1.6, blank: "B" },
            { x: 1.5, y: 5.3, w: 2.4, h: 1.2, blank: "C" },
            { x: 5.3, y: 5.3, w: 1.9, h: 1.4, blank: "D" },
            { x: 8.6, y: 2.9, w: 3.2, h: 1.1, blank: "E" },
            { x: 8.6, y: 5.3, w: 3.2, h: 1.4, blank: "F" },
            { x: 6.8, y: 0.2, w: 2.2, h: 1.1, blank: "G" },
            { x: 6.8, y: 7.8, w: 2.2, h: 1, blank: "H" },
          ],
          pins: [{ x: 1.4, y: 4.6, label: "You are here" }],
        },
      },
    },
    {
      t: "listen",
      id: "d12-kt-nghe-4",
      title: "Tree-planting day at Westbrook Park",
      dan: { so: "Checkpoint Test 2, Recording 4", boiCanh: "a volunteer organiser giving directions to a group of volunteers at the start of a tree-planting day.", cau: [13, 17] },
      note: "Giọng Anh-Anh (nam), một người nói, khoảng 2 phút. Nghe tối đa 2 lần. Đặt ngón tay ở You are here và di theo lời Sam.",
      lines: [
        { who: "Sam", voice: "uk-nam", text: "Good morning, everyone, and thank you for coming to Westbrook Park's tree-planting day. I'm Sam, and I'm organising the volunteers today. Before we start, please look at the map, so that you know where everything is.", vi: "Chào buổi sáng mọi người, cảm ơn các bạn đã đến ngày trồng cây của công viên Westbrook. Tôi là Sam, hôm nay tôi điều phối tình nguyện viên. Trước khi bắt đầu, mời các bạn xem bản đồ để biết mọi thứ ở đâu." },
        { who: "Sam", voice: "uk-nam", text: "We're standing at the main gate, on the west side of the park. The main path runs straight ahead of you, from west to east, all the way across the park. Immediately on your left as you come in is the café. It opens at ten, and hot drinks are free for volunteers today.", vi: "Chúng ta đang đứng ở cổng chính, phía tây công viên. Lối chính chạy thẳng trước mặt, từ tây sang đông, xuyên qua cả công viên. Ngay bên trái khi bạn bước vào là quán cà phê. Quán mở lúc mười giờ, hôm nay đồ uống nóng miễn phí cho tình nguyện viên." },
        { who: "Sam", voice: "uk-nam", text: "Opposite the café, on the other side of the path, is the bike shed, so if you cycled here, you can leave your bike there.", vi: "Đối diện quán cà phê, bên kia lối đi, là nhà để xe đạp — ai đạp xe đến thì để xe ở đó." },
        { who: "Sam", voice: "uk-nam", text: "Now, walk along the main path towards the crossroads. Just before you reach it, on your right, is the tool store. That's where you collect your spade, your gloves and a bucket.", vi: "Giờ đi dọc lối chính về phía ngã tư. Ngay trước khi tới ngã tư, bên phải là kho dụng cụ. Đó là chỗ các bạn nhận xẻng, găng tay và một cái xô." },
        { who: "Sam", voice: "uk-nam", text: "Please don't go into the building opposite it, on the left. It used to be the tool store, but it's now the first-aid room, and the nurse needs to keep it clear.", vi: "Xin đừng vào toà nhà đối diện nó, bên trái. Nó từng là kho dụng cụ, nhưng giờ là phòng sơ cứu, và y tá cần giữ chỗ đó thông thoáng." },
        { who: "Sam", voice: "uk-nam", text: "At the crossroads, turn left and walk north. The path ends at the tree nursery — that's where all our young trees are grown, and you'll pick up your trees there.", vi: "Tới ngã tư, rẽ trái và đi về phía bắc. Lối đi kết thúc ở vườn ươm — nơi trồng tất cả cây non của chúng tôi, các bạn sẽ nhận cây ở đó." },
        { who: "Sam", voice: "uk-nam", text: "Then come back to the crossroads and carry straight on, heading east, towards the lake. On your left, between the path and the lake, is the bird hide. Please keep your voices down near it.", vi: "Sau đó quay lại ngã tư và đi thẳng về phía đông, hướng ra hồ. Bên trái, giữa lối đi và cái hồ, là chòi ngắm chim. Ở gần đó xin nói nhỏ." },
        { who: "Sam", voice: "uk-nam", text: "On your right, just past the crossroads, is the picnic area, where we'll all have lunch together at half past twelve.", vi: "Bên phải, ngay sau ngã tư, là khu dã ngoại, nơi tất cả chúng ta sẽ ăn trưa cùng nhau lúc mười hai rưỡi." },
        { who: "Sam", voice: "uk-nam", text: "And finally, the planting area itself. From the crossroads, turn right, so you're heading south, and walk to the very end of the path. The planting area is right there, at the end. That's where we'll spend most of the day. Right, let's go and collect the tools.", vi: "Cuối cùng là khu trồng cây. Từ ngã tư, rẽ phải — tức là đi về phía nam — và đi tới tận cuối lối. Khu trồng cây nằm ngay đó, ở cuối lối. Chúng ta sẽ ở đó gần như cả ngày. Nào, đi lấy dụng cụ thôi." },
      ],
    },
    {
      t: "quiz",
      id: "d12-kt-nghe-4-ban-do",
      title: "Questions 13–17 — ghi MỘT chữ cái (A–H)",
      kind: "fill",
      items: [
        { q: "(13) Café ___", answers: ["A"] },
        { q: "(14) Tool store ___", answers: ["D"] },
        { q: "(15) Tree nursery ___", answers: ["G"] },
        { q: "(16) Picnic area ___", answers: ["F"] },
        { q: "(17) Planting area ___", answers: ["H"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 13–17 (di ngón tay theo lời Sam)",
      items: [
        "**(13) A** — \"**Immediately on your left as you come in** is the café.\" Từ cổng đi về phía **Đông** thì bên trái là phía **Bắc** → ô phía Bắc sát cổng nhất là **A**. **C** (đối diện, phía Nam) là **nhà để xe đạp** — ô gây nhiễu.",
        "**(14) D** — \"**Just before** you reach [the crossroads], **on your right**, is the tool store.\" Vẫn đi về phía Đông → bên phải là phía **Nam** → ô phía Nam ngay trước ngã tư là **D**. Bẫy **used to**: \"the building **opposite** it… **used to be** the tool store, **but** it's **now** the first-aid room\" → **B** là phòng sơ cứu (bản đồ tả **hiện tại**).",
        "**(15) G** — \"At the crossroads, **turn left** and walk **north**. The path **ends at** the tree nursery.\" Cuối lối dọc phía Bắc → **G**.",
        "**(16) F** — \"come back to the crossroads and **carry straight on**, heading **east**… **On your right, just past the crossroads**, is the picnic area.\" Đi về phía Đông, bên phải = phía Nam, **sau** ngã tư → **F**. **E** (bên trái, giữa lối và hồ) là **chòi ngắm chim** — ô gây nhiễu.",
        "**(17) H** — \"**turn right**, so you're heading **south**, and walk to **the very end** of the path\" → ô ở cuối lối dọc phía Nam là **H**.",
        "Ba ô gây nhiễu: **B** (phòng sơ cứu — từng là kho dụng cụ), **C** (nhà để xe đạp), **E** (chòi ngắm chim). Đúng như Ngày 9 mục 3: bản đồ luôn có **nhiều ô hơn số câu**, và **trái / phải** tính theo **hướng đang đi**.",
      ],
    },

    /** ───────────── 5. Đọc ───────────── **/
    { t: "h", text: "Phần 5 — Đọc (14 câu · đạt ≥ 10 · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "p",
      text: "Đặt đồng hồ **20 phút**. Đọc **câu hỏi trước**, gạch từ khoá, rồi đọc bài để tìm vị trí. Bài có 6 đoạn A–F, ~550 từ. Ba dạng: **Table Completion** (Ngày 8) · **Matching Features** (Ngày 10) · **True / False / Not Given** (Ngày 12). Đáp án điền bảng lấy **nguyên văn** trong bài.",
    },
    {
      t: "passage",
      title: "Growing food in the city: community gardens",
      intro: "Bài đọc viết riêng cho bài kiểm tra này — 6 đoạn A–F, khoảng 550 từ. Tên người, vườn và số liệu đều tự đặt.",
      paras: [
        {
          label: "A",
          text: "In many cities, small pieces of unused land — the corner of a car park, the roof of a building, a strip of ground beside a railway line — are being turned into community gardens. A community garden is a piece of land that local residents look after together. Members grow vegetables and flowers, and they usually share the tools, the water and the work. Over the last twenty years the number of these gardens has grown quickly, and councils want to know what they offer.",
        },
        {
          label: "B",
          text: "A recent report compared three gardens in different countries. The Elm Street Garden in Manchester, England, started in 2011 on land where a row of houses had been demolished. Its members say the main benefit is cheap, fresh food, but the garden has suffered from vandalism: twice in one summer, young people broke the fence and damaged the vegetable beds. Sunrise Plots in Toronto, Canada, opened in 2015 on a former car park next to a primary school. The school uses it for science lessons, and its biggest problem is a lack of water in July and August. The third garden, in Singapore, is on the roof of a shopping centre. It began in 2018, and because space is so limited, the vegetables are grown in boxes rather than in the ground. Here the main difficulty is heat: in the afternoon the roof can reach forty degrees.",
        },
        {
          label: "C",
          text: "Researchers are interested in what gardening does to the people who do it. Dr Laura Benitez, a public health expert, followed 120 new members of community gardens for a year. By the end of the study they were eating almost twice as many vegetables as before, and most of them reported lower levels of stress. \"They did not join to become healthier,\" she explains. \"They joined to meet people, and the health benefits came by accident.\"",
        },
        {
          label: "D",
          text: "Professor Sam Okoro, a sociologist, agrees that the social side is important. In his interviews, gardeners often said that the garden was the only place where they talked to neighbours of a different age or background. However, Okoro also warns that a garden can be taken over by a small group of long-term members who make all the decisions, so that newcomers feel unwelcome. In his view, every garden needs clear rules about how members are chosen.",
        },
        {
          label: "E",
          text: "The biggest threat to community gardens is not people but money. Dr Yuki Mori, an economist, points out that land in city centres is extremely valuable, and councils are often under pressure to sell it or build houses on it. In her research, the gardens that survived for more than ten years were nearly always those with a long lease — a legal agreement allowing them to stay for at least fifteen years. Without this, she says, members are unwilling to invest their time and money.",
        },
        {
          label: "F",
          text: "Daniel Price, a city planner, believes the solution is to build gardens into new developments from the start. He suggests that every new housing estate should include a shared garden, in the same way that it includes roads and parking. Some critics argue that this wastes land which could be used for homes, but Price disagrees: in his experience, a garden makes a neighbourhood more attractive, and people are happy to pay more to live near one.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–4.** Complete the table below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer. — **Hoàn thành bảng. Chọn KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT CON SỐ trong bài.**",
    },
    {
      t: "table",
      caption: "Three community gardens — Ba vườn cộng đồng",
      head: ["Garden", "City", "Started", "Where", "Main problem"],
      rows: [
        ["Elm Street Garden", "Manchester", "**(1) ______**", "land where houses used to stand", "**(2) ______**"],
        ["Sunrise Plots", "Toronto", "2015", "a former **(3) ______**", "not enough water in summer"],
        ["(rooftop garden)", "Singapore", "2018", "the roof of a **(4) ______**", "heat"],
      ],
    },
    {
      t: "quiz",
      id: "d12-kt-doc-bang",
      title: "Phần 5a — Table Completion (4 câu) — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Elm Street Garden — Started: ___", answers: ["2011"] },
        { q: "(2) Elm Street Garden — Main problem: ___", answers: ["vandalism"] },
        { q: "(3) Sunrise Plots — Where: a former ___", answers: ["car park", "carpark"] },
        { q: "(4) Rooftop garden — Where: the roof of a ___", answers: ["shopping centre", "shopping center"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 5–9.** Look at the following statements and the list of people below. Match each statement with the correct person, **A–D**. **NB** You may use any letter more than once. — **Nối mỗi câu với đúng người A–D. Một chữ cái có thể dùng nhiều lần.**",
    },
    {
      t: "table",
      caption: "List of People — Danh sách người",
      head: ["", "Person"],
      rows: [
        ["**A**", "Dr Laura Benitez"],
        ["**B**", "Professor Sam Okoro"],
        ["**C**", "Dr Yuki Mori"],
        ["**D**", "Daniel Price"],
      ],
    },
    {
      t: "mcq",
      id: "d12-kt-doc-noi",
      title: "Phần 5b — Matching Features (5 câu, A–D)",
      items: [
        { q: "(5) found that people's diet changed after they joined a garden", options: ["A Benitez", "B Okoro", "C Mori", "D Price"], correct: 0, why: "Đoạn **C**: Benitez theo dõi 120 thành viên mới — \"they were **eating almost twice as many vegetables** as before\". eating… vegetables = **diet** (chế độ ăn)." },
        { q: "(6) says that long-established members can make new people feel excluded", options: ["A Benitez", "B Okoro", "C Mori", "D Price"], correct: 1, why: "Đoạn **D**: \"Okoro also **warns** that a garden can be taken over by a small group of **long-term members**… so that **newcomers feel unwelcome**\". long-term = long-established; unwelcome = excluded." },
        { q: "(7) argues that gardens last longer when they have a legal right to stay", options: ["A Benitez", "B Okoro", "C Mori", "D Price"], correct: 2, why: "Đoạn **E**: Mori — \"the gardens that **survived for more than ten years** were nearly always those with a **long lease** — a legal agreement allowing them to stay\". survived longer = last longer; lease = legal right to stay." },
        { q: "(8) thinks gardens should be planned together with new homes", options: ["A Benitez", "B Okoro", "C Mori", "D Price"], correct: 3, why: "Đoạn **F**: Price — \"every **new housing estate should include** a shared garden… **from the start**\". housing estate = new homes; from the start = planned together." },
        { q: "(9) believes that people join gardens mainly for social reasons", options: ["A Benitez", "B Okoro", "C Mori", "D Price"], correct: 0, why: "Đoạn **C**, lời trích của **Benitez**: \"They did not join to become healthier… They joined **to meet people**\" → A, dùng lần thứ hai (đúng tinh thần **NB**). Bẫy: Okoro cũng nói về mặt xã hội (đoạn D) nhưng ông nói về **lợi ích** khi đã ở trong vườn, không nói về **lý do gia nhập**." },
      ],
    },
    {
      t: "p",
      text: "**Questions 10–14.** Do the following statements agree with the information given in the passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
    },
    {
      t: "mcq",
      id: "d12-kt-doc-tfng",
      title: "Phần 5c — True / False / Not Given (5 câu)",
      items: [
        { q: "(10) Members of a community garden normally share equipment.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn **A**: \"they **usually share the tools**, the water and the work\". tools = equipment; usually = normally → **TRUE**." },
        { q: "(11) The Elm Street Garden was damaged more than once in a single summer.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn **B**: \"**twice in one summer**, young people broke the fence and damaged the vegetable beds\". twice = more than once; one summer = a single summer → **TRUE**." },
        { q: "(12) Sunrise Plots is the largest of the three gardens.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói Sunrise Plots **ở đâu, mở năm nào, vấn đề gì** — nhưng **không so sánh diện tích** ba vườn. Hỏi 1 của sơ đồ: bài có nói ý này không? Không → **NOT GIVEN**. Bẫy: \"space is so limited\" là về vườn **Singapore**, không phải phép so sánh." },
        { q: "(13) The vegetables in the Singapore garden are planted directly in the soil.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **B**: \"the vegetables are grown **in boxes rather than in the ground**\". in the ground = in the soil; bài nói **ngược lại** → **FALSE**." },
        { q: "(14) According to Dr Mori, members invest more time in a garden when it has no lease.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **E**: \"**Without** this (lease), members are **unwilling** to invest their time and money\" — không có hợp đồng thì **không muốn** đầu tư. Câu hỏi nói **more** → ngược → **FALSE**." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại phần Đọc — thứ tự và bẫy",
      items: [
        "**Bảng** (1–4) chỉ nằm trong **đoạn B**; đọc tiêu đề cột (Started / Where / Main problem) để biết đang tìm **năm**, **nơi** hay **vấn đề**. (2) vandalism là **danh từ** — không viết ~~vandalised~~.",
        "**Matching** (5–9): mỗi người một đoạn (C–F), nhưng câu 9 quay lại **người A** (Benitez, đoạn C) — luôn tin **NB** (chữ cái dùng nhiều lần). Phân biệt **ý của người đó** với **ý của người phản đối** (đoạn F: critics ≠ Price).",
        "**TFNG** (10–14): đáp án đi **theo thứ tự** bài (A → B → B → B → E). Hai câu FALSE đều đổi **một ý then chốt** (in boxes → in the soil · unwilling → invest more); câu NOT GIVEN có từ trùng (Sunrise Plots) nhưng bài **không so sánh**.",
      ],
    },

    /** ───────────── 6. Viết ───────────── **/
    { t: "h", text: "Phần 6 — Viết (2 bài + 8 chỗ trống · đạt khi AI chấm ≥ band 4.0, đủ cấu trúc và bài 6c ≥ 6/8 · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "p",
      text: "**Bài 6a** (10 phút): đề Opinion đã có sẵn **mở bài** — bạn viết **một đoạn thân bài** (90–110 từ: câu chủ đề bám thesis → 1–2 câu giải thích → ví dụ cụ thể, Ngày 8) **và kết bài** (2 câu: nhắc lại quan điểm + tóm tắt 2 lý do bằng lời khác, Ngày 10). **Bài 6b** (20 phút): viết **trọn** bài Task 1 cho biểu đồ đường bên dưới (Ngày 12). **Bài 6c** (5 phút): điền 8 chỗ trống trong bài mẫu một **biểu đồ cột theo năm** (Ngày 12 mục 4). Viết xong bấm AI chấm, đọc kỹ nhận xét về **cấu trúc đoạn** và **số liệu**.",
    },
    {
      t: "essay",
      id: "d12-kt-viet-than-ket",
      task: "Task 2",
      prompt: "Some people believe that employees should be allowed to work from home whenever they want. To what extent do you agree or disagree? — MỞ BÀI CHO SẴN (không viết lại): \"It is often argued that staff should have the freedom to work from home as often as they wish. I largely agree with this view, because remote work saves employees a great deal of time and gives them more control over their day.\" — BẠN VIẾT: (1) MỘT đoạn thân bài 90–110 từ cho lý do thứ nhất (tiết kiệm thời gian) HOẶC lý do thứ hai (tự chủ), đủ câu chủ đề – giải thích – ví dụ; (2) KẾT BÀI 2 câu. Tổng 120–150 từ.",
      minWords: 100,
      tips: [
        "Câu chủ đề bám thesis: **Firstly / The main reason is that + S + V** (vd. remote work removes the daily commute). Không viết lại cả thesis.",
        "Giải thích bằng **This means that… / As a result, …**; ví dụ bằng **For example, / For instance,** + tình huống cụ thể (một người, một con số, một thành phố).",
        "Kết bài: **In conclusion, I firmly believe that + quan điểm (lời khác)** + **một câu gói 2 lý do** (saves time · more autonomy) — **không thêm ý mới**, không chép câu thesis.",
        "Dùng từ vựng Ngày 7: **rush hour · commute · autonomy · flexible · burnout · hybrid**; trạng từ đúng chỗ (**significantly reduces**, **work more productively**).",
        "Soát lại: chủ ngữ số nhiều (employees, workers) → động từ **không -s**; dùng **hiện tại đơn** cho ý kiến chung.",
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Percentage of employees who worked mainly from home in three countries, 2014–2024",
        note: "Số liệu tự đặt cho bài kiểm tra.",
        unit: "%",
        categories: ["2014", "2016", "2018", "2020", "2022", "2024"],
        series: [
          { name: "Finland", values: [8, 10, 12, 30, 26, 24] },
          { name: "Spain", values: [4, 5, 6, 18, 12, 10] },
          { name: "Japan", values: [3, 3, 4, 14, 9, 7] },
        ],
      },
    },
    {
      t: "essay",
      id: "d12-kt-viet-task1",
      task: "Task 1",
      prompt: "The line graph above shows the percentage of employees in three countries who worked mainly from home between 2014 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — Finland: 2014 8%, 2016 10%, 2018 12%, 2020 30%, 2022 26%, 2024 24% · Spain: 4%, 5%, 6%, 18%, 12%, 10% · Japan: 3%, 3%, 4%, 14%, 9%, 7%.)",
      minWords: 150,
      tips: [
        "Mở bài: shows → **illustrates**; the percentage of employees who worked mainly from home → **the proportion of workers based mainly at home**; between 2014 and 2024 → **over a ten-year period**.",
        "Overview (không số): cả ba nước **tăng chậm** rồi **vọt lên** năm 2020 và **giảm dần** sau đó; **Finland luôn cao nhất**, Japan thấp nhất.",
        "Gom nhóm: Body 1 = **2014–2020** (tăng nhẹ rồi tăng mạnh, đỉnh 2020: 30 · 18 · 14); Body 2 = **2020–2024** (giảm: 30 → 24 · 18 → 10 · 14 → 7) + so sánh cuối kỳ.",
        "Động từ quá khứ + trạng từ (Ngày 11): **rose slightly · soared / jumped · peaked at · fell steadily · dipped**; giới từ **from … to … · by … · at …**; ít nhất 3 phép so sánh (**more than three times, roughly double, the lowest**).",
        "Soát số: mọi con số phải khớp hình. Nhắm 170–190 từ.",
      ],
    },
    { t: "h", text: "Bài 6c — Biểu đồ cột theo năm: điền bài mẫu (8 chỗ trống · đạt ≥ 6)" },
    {
      t: "p",
      text: "**5 phút.** Như Ngày 12 mục 4: biểu đồ **cột có trục năm** tả bằng **đúng bộ từ** của biểu đồ đường — mỗi màu cột là một \"đường\" vô hình. Đọc hình, rồi điền **một từ** vào mỗi chỗ trống của bài mẫu (động từ chia **quá khứ**, giới từ **to / by / at**, so sánh nhất).",
    },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Number of volunteers working for three types of organisation in one country, 2004–2024",
        note: "Số liệu tự đặt cho bài kiểm tra. Đơn vị: nghìn người.",
        unit: "thousand volunteers",
        categories: ["2004", "2009", "2014", "2019", "2024"],
        series: [
          { name: "Food banks", values: [12, 15, 19, 30, 28] },
          { name: "Environmental groups", values: [4, 6, 10, 18, 26] },
          { name: "Animal shelters", values: [9, 9, 8, 9, 9] },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The bar chart compares the number of people who volunteered for three types of organisation in one country between 2004 and 2024.", vi: "[Mở bài] Biểu đồ cột so sánh số người làm tình nguyện cho ba loại tổ chức ở một nước từ 2004 đến 2024." },
        { en: "[Overview] Overall, the number of volunteers at food banks and environmental groups (1) ___ considerably, while the figure for animal shelters remained relatively (2) ___.", vi: "[Tổng quan] Nhìn chung, số tình nguyện viên ở ngân hàng thực phẩm và nhóm môi trường (1) ___ đáng kể, trong khi con số của trại cứu hộ động vật tương đối (2) ___." },
        { en: "[Body 1] In 2004, food banks had 12,000 volunteers. This figure rose gradually (3) ___ 19,000 in 2014, then jumped and (4) ___ at 30,000 in 2019, before falling slightly to 28,000 in 2024.", vi: "[Thân bài 1] Năm 2004, ngân hàng thực phẩm có 12.000 tình nguyện viên. Con số này tăng dần (3) ___ 19.000 năm 2014, rồi vọt lên và (4) ___ ở mức 30.000 năm 2019, trước khi giảm nhẹ còn 28.000 năm 2024." },
        { en: "[Body 2] Environmental groups had the (5) ___ number of volunteers in 2004, at just 4,000. However, the figure grew at every point: it (6) ___ animal shelters between 2009 and 2014 and increased (7) ___ 16,000 over the last ten years, finishing at 26,000. Animal shelters, by contrast, saw very little change: their figure (8) ___ at around 9,000 throughout the period, with only a small dip to 8,000 in 2014.", vi: "[Thân bài 2] Nhóm môi trường có số tình nguyện viên (5) ___ năm 2004, chỉ 4.000. Tuy nhiên con số tăng ở mọi mốc: nó (6) ___ trại cứu hộ động vật trong khoảng 2009–2014 và tăng (7) ___ 16.000 trong mười năm cuối, kết thúc ở 26.000. Ngược lại, trại cứu hộ động vật gần như không đổi: con số (8) ___ quanh mức 9.000 suốt giai đoạn, chỉ nhích xuống 8.000 năm 2014." },
      ],
    },
    {
      t: "quiz",
      id: "d12-kt-viet-cot",
      title: "Bài 6c — Điền bài mẫu biểu đồ cột (8 chỗ trống, mỗi chỗ một từ)",
      kind: "fill",
      items: [
        { q: "(1) Overall, the number of volunteers at food banks and environmental groups ___ considerably… (tăng, quá khứ)", answers: ["rose", "increased", "grew", "climbed"] },
        { q: "(2) …the figure for animal shelters remained relatively ___.", answers: ["stable", "constant", "steady", "unchanged", "flat"] },
        { q: "(3) This figure rose gradually ___ 19,000 in 2014… (giới từ)", answers: ["to"] },
        { q: "(4) …then jumped and ___ at 30,000 in 2019… (đạt đỉnh, quá khứ)", answers: ["peaked"] },
        { q: "(5) Environmental groups had the ___ number of volunteers in 2004… (so sánh nhất)", answers: ["lowest", "smallest"] },
        { q: "(6) …it ___ animal shelters between 2009 and 2014… (vượt qua, quá khứ)", answers: ["overtook", "surpassed", "exceeded", "passed"] },
        { q: "(7) …and increased ___ 16,000 over the last ten years… (giới từ)", answers: ["by"] },
        { q: "(8) …their figure ___ at around 9,000 throughout the period… (giữ ở mức, quá khứ)", answers: ["stayed", "remained", "stood"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích bài 6c — đọc số trên hình",
      items: [
        "**(1) rose** — food banks 12 → 28, environmental groups 4 → 26: cả hai **tăng** (quá khứ: rose / increased / grew). **(2) stable** — animal shelters 9 · 9 · 8 · 9 · 9 → gần như **không đổi**.",
        "**(3) to** — **rise to + số** = lên **tới mức** 19.000. **(7) by** — 10 (2014) → 26 (2024): tăng **thêm** 16.000 → **increase by + lượng thay đổi**. Nhầm to ↔ by là lỗi mất điểm hay gặp nhất (Ngày 11, Từ vựng mục 2).",
        "**(4) peaked** — 30.000 năm 2019 là **điểm cao nhất** của food banks, sau đó giảm → **peaked at**. **(5) lowest** — năm 2004: 4 < 9 < 12 → **the lowest** (so sánh nhất, Ngày 7 mục 7).",
        "**(6) overtook** — 2009: môi trường 6 < động vật 9; 2014: môi trường 10 > động vật 8 → **vượt** trong khoảng 2009–2014. **(8) stayed / remained / stood at** — giữ ở mức khoảng 9.000.",
        "Chia đoạn: **Body 1** = food banks (cột cao nhất, có đỉnh); **Body 2** = hai nhóm còn lại vì chúng **cắt nhau** — gom theo câu chuyện của số liệu, không tả lần lượt từng màu cột (Ngày 12 mục 4).",
      ],
    },

    /** ───────────── 7. Nói ───────────── **/
    { t: "h", text: "Phần 7 — Nói (6 câu · đạt khi AI chấm ≥ band 4.0 · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "p",
      text: "Sáu câu hỏi Part 1 trộn ba kiểu: **sở thích** (Ngày 8: be into, be keen on, play / do / go), **thói quen** (Ngày 10: trạng từ tần suất, once a week, used to), **quan điểm** (Ngày 12: O–R–E). Mỗi câu 2–3 câu trả lời, không học thuộc. Để ý phát âm **/ŋ/** (-ing), **/ʒ/** (usually) và **/θ/** (I think).",
    },
    {
      t: "speak",
      id: "d12-kt-noi",
      part: "1",
      questions: [
        "What do you like doing at the weekend?",
        "Is there a hobby you would like to try in the future?",
        "How often do you cook at home?",
        "Did you have any different habits when you were a child?",
        "Do you think people should work from home more often?",
        "Is it important for young people to do volunteer work?",
      ],
    },

    /** ───────────── 8. Phát âm ───────────── **/
    { t: "h", text: "Phần 8 — Phát âm (8 dòng · đạt ≥ 70 điểm ở 6/8 dòng · trượt thì ôn mục phát âm Ngày 7–12)" },
    {
      t: "phatam",
      id: "d12-kt-phat-am",
      title: "Phần 8 — Phát âm (8 dòng)",
      note: "Bấm “Nghe mẫu” một lần, rồi “Đọc & chấm”. Ghi điểm từng dòng — đạt khi ít nhất 6/8 dòng từ 70 điểm. Mỗi dòng nhắm một âm của chặng: -teen / -ty (N7) · /ŋ/ (N8) · -ed (N9) · /ʒ/ và used to (N10) · trọng âm từ tả xu hướng (N11) · /θ/ (N12).",
      items: [
        { text: "thirteen, thirty, fourteen, forty", ipa: "θɜːtiːn θɜːti fɔːtiːn fɔːti", vi: "N7 · -TEEN nhấn sau, -ty nhấn trước" },
        { text: "singing, swimming, something", ipa: "sɪŋɪŋ swɪmɪŋ sʌmθɪŋ", vi: "N8 · /ŋ/ cuối, không có /ɡ/, không đọc “inh”" },
        { text: "We visited the shelter and helped the staff.", ipa: "wi vɪzɪtɪd ðə ʃeltə ənd helpt ðə stɑːf", vi: "N9 · visited /ɪd/ · helped /t/" },
        { text: "I usually measure my progress every month.", ipa: "aɪ juːʒuəli meʒə maɪ prəʊɡres evri mʌnθ", vi: "N10 · /ʒ/ trong usually, measure · /θ/ cuối month" },
        { text: "Sales fluctuated significantly before they stabilised.", ipa: "seɪlz flʌktʃueɪtɪd sɪɡnɪfɪkəntli bɪfɔː ðeɪ steɪbəlaɪzd", vi: "N11 · FLUC-tu-ated · sig-NI-fi-cant-ly · STA-bi-lised" },
        { text: "I think both of these methods are worth trying.", ipa: "aɪ θɪŋk bəʊθ əv ðiːz meθədz ə wɜːθ traɪɪŋ", vi: "N12 · /θ/ trong think, both, methods, worth · /ð/ trong these" },
        { text: "The figures rose steadily and then levelled off.", ipa: "ðə fɪɡəz rəʊz stedɪli ənd ðen levld ɒf", vi: "N11 · rose /z/ · levelled /d/ · nối levelled_off" },
        { text: "I used to cycle to work, but now I work from home.", ipa: "aɪ juːst tə saɪkl tə wɜːk bʌt naʊ aɪ wɜːk frəm həʊm", vi: "N10 · used to = /juːst tə/ · /ɜː/ trong work" },
      ],
    },

    /** ───────────── 9. Tổng kết ───────────── **/
    {
      t: "recap",
      title: "Xong bài kiểm tra — bước tiếp theo",
      items: [
        "**Đạt cả 8 phần** (mỗi phần ≥ 70 %) → sang **Ngày 13** (động từ khuyết thiếu). Bạn đã đi được hai phần ba Tập 1!",
        "Chưa đạt **Ngữ pháp** hoặc **Dịch** → ôn lại **Ngày 7** (tính từ – trạng từ, so sánh: mục 2–7, nhất là **vị trí trạng từ** mục 5), **Ngày 9** (các thì: mục 1–8, nhất là **hiện tại đơn hay tiếp diễn** mục 4 và bảng động từ bất quy tắc mục 7), **Ngày 10** (bài Nói mục 3: **used to / be used to**) và **Ngày 11** (trật tự từ mục 2, **cụm danh từ** mục 3, **collocation** mục 4–7); làm lại các bài dịch 💡 trong đó.",
        "Chưa đạt **Từ vựng** → mở lại bài từ vựng **Ngày 7, 9, 11**, dùng nút \"Che nghĩa / Che từ\" đến khi thuộc; cụm động từ ở **mục 2** của Ngày 7 và Ngày 9; động từ xu hướng nhớ cả **dạng quá khứ** (rose, fell, grew, overtook).",
        "Chưa đạt **Nghe** → làm lại **Ngày 7** (Part 1, mục 2–4), **Ngày 9** (Part 2, mục 2–4 — sai câu 13–17 thì làm lại **chiến thuật bản đồ mục 3** và câu 16–20 của mục 4) và **Ngày 11** (Part 3, mục 2–3). Chưa đạt **Đọc** → làm lại **Ngày 8** (Table), **Ngày 10** (Matching Features — ba bẫy mục 2) và **Ngày 12** (TFNG — sơ đồ 2 câu hỏi mục 1).",
        "Chưa đạt **Viết** → ôn **Ngày 8** (thân bài: mục 2–5), **Ngày 10** (kết bài: mục 2–3), **Ngày 12** (Task 1 trọn bài: mục 1–3; biểu đồ cột: mục 4) và **Ngày 11** (bài Từ vựng: động từ / danh từ xu hướng, giới từ to · by · at). Chưa đạt **Nói / Phát âm** → ôn khung trả lời **Ngày 8, 10, 12** và mục phát âm tương ứng. Ôn xong thì **làm lại đúng phần đó** của bài kiểm tra này.",
      ],
    },
  ],
};

export const NGAY_12: Lesson[] = [D12_READING, D12_WRITING, D12_SPEAKING, D12_HOMEWORK, KIEM_TRA_2];
