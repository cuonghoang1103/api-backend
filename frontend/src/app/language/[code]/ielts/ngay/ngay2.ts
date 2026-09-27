/**
 * Ngày 2 — theo sách trang 20–35: Reading (làm quen bài thi + từ khoá),
 * Writing Task 2 (làm quen), Speaking (cấu trúc bài thi), Homework 5 bài tìm từ khoá.
 *
 * Mọi lời giảng, ví dụ, đoạn văn và câu bài tập ở đây là VIẾT MỚI — giữ đúng
 * kiến thức, thứ tự, dạng bài và số yêu cầu của sách (xem ../SOAN-BAI.md).
 */
import type { Lesson } from '../data';

/* ───────────────────────── Reading ───────────────────────── */

const D2_READING: Lesson = {
  id: "d2-doc",
  kind: "reading",
  title: "Làm quen IELTS Reading & từ khoá",
  goal: "Biết bài thi Reading gồm những gì, nhận ra 10 loại từ khoá và dùng chúng để tìm đáp án nhanh theo 2 bước.",
  minutes: 35,
  blocks: [
    { t: "h", text: "1. Cấu trúc bài thi IELTS Reading" },
    {
      t: "p",
      text: "Bài thi Reading kiểm tra xem bạn **tìm và hiểu thông tin** trong một bài viết tiếng Anh nhanh và đúng đến đâu. Bạn không cần hiểu từng chữ. Bạn cần biết **thông tin nằm ở đâu** và **câu hỏi thật sự hỏi gì**.",
    },
    {
      t: "table",
      head: ["Mục", "Con số", "Ý nghĩa với bạn"],
      rows: [
        ["Số bài đọc (passage)", "3 bài", "Mỗi bài dài khoảng 700–900 từ. Bài sau thường khó hơn bài trước."],
        ["Tổng số câu hỏi", "40 câu", "Mỗi câu đúng được 1 điểm. Sai **không bị trừ điểm**, nên đừng bỏ trống câu nào."],
        ["Thời gian", "60 phút", "Tính cả thời gian chép đáp án vào phiếu. **Không có** thêm giờ để chép như bài Nghe thi giấy."],
      ],
    },
    {
      t: "p",
      text: "Phần này sách chưa có: IELTS có hai loại bài Reading. **Academic** (Học thuật) dùng để du học: bài đọc lấy từ sách, báo khoa học. **General Training** (Tổng quát) dùng để định cư, đi làm: bài đọc là thông báo, quảng cáo, tài liệu công việc. Cấu trúc 3 phần, 40 câu, 60 phút là giống nhau.",
    },
    {
      t: "table",
      caption: "Số câu đúng → band Reading Academic (bảng tham khảo, có thể lệch 1 câu tuỳ đề)",
      head: ["Số câu đúng / 40", "Band"],
      rows: [
        ["39–40", "9.0"],
        ["37–38", "8.5"],
        ["35–36", "8.0"],
        ["33–34", "7.5"],
        ["30–32", "7.0"],
        ["27–29", "6.5"],
        ["23–26", "6.0"],
        ["19–22", "5.5"],
        ["15–18", "5.0"],
        ["13–14", "4.5"],
        ["10–12", "4.0"],
      ],
    },

    { t: "h", text: "2. 8 dạng câu hỏi phổ biến" },
    {
      t: "p",
      text: "Mỗi đề Reading trộn nhiều dạng câu hỏi. Biết trước tên từng dạng giúp bạn đọc đề không bị bỡ ngỡ. Các ngày sau của khoá sẽ luyện riêng từng dạng.",
    },
    {
      t: "table",
      head: ["Tên dạng (tiếng Anh)", "Nghĩa", "Bạn phải làm gì"],
      rows: [
        ["Multiple Choice", "Chọn đáp án đúng", "Chọn A, B, C hoặc D. Có khi phải chọn 2–3 đáp án trong một danh sách dài."],
        ["Matching Information", "Ghép thông tin", "Tìm xem một thông tin nằm ở **đoạn nào** (A, B, C…). Một đoạn có thể được dùng nhiều lần."],
        ["Identifying Information", "Nhận diện thông tin", "Tên chính thức của dạng **True / False / Not Given** (xem ô bên dưới)."],
        ["True / False / Not Given", "Đúng / Sai / Không có thông tin", "So câu cho sẵn với bài đọc: khớp → **True**, trái ngược → **False**, bài không nói tới → **Not Given**."],
        ["Short Answer Questions", "Trả lời câu hỏi ngắn", "Trả lời bằng từ lấy **nguyên văn** từ bài, đúng giới hạn số từ (ví dụ: NO MORE THAN TWO WORDS)."],
        ["Sentence Completion", "Hoàn thành câu", "Điền từ trong bài vào chỗ trống để câu đúng nghĩa và đúng ngữ pháp."],
        ["Summary Completion", "Hoàn thành đoạn tóm tắt", "Điền vào đoạn tóm tắt, bằng từ trong bài hoặc từ trong một hộp cho sẵn."],
        ["Diagram Labeling", "Gán nhãn sơ đồ", "Điền tên các bộ phận trên hình vẽ máy móc, quy trình, công trình."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: sách tách hai dạng thật ra là một",
      items: [
        "Sách liệt kê **Identifying Information** và **True / False / Not Given** như hai dạng khác nhau. Thực ra trong đề thi, “Identifying information” chính là **tên chính thức** của dạng True / False / Not Given.",
        "Dạng “anh em” của nó là **Identifying the writer’s views** — trả lời **Yes / No / Not Given** — hỏi về **ý kiến của tác giả** chứ không phải sự thật. Hai dạng làm giống nhau, chỉ khác bộ chữ trả lời. Viết True vào câu hỏi Yes/No là **mất điểm**.",
        "Ngoài 8 dạng trên, đề thật còn có **Matching Headings** (ghép tiêu đề cho đoạn), **Matching Features** (ghép người/vật với thông tin), **Matching Sentence Endings** (ghép nửa câu), **Note / Table / Flow-chart Completion** (điền ghi chú, bảng, sơ đồ quy trình). Khoá sẽ học dần.",
      ],
    },

    { t: "h", text: "3. Lưu ý khi làm bài" },
    {
      t: "note",
      title: "Mẹo làm bài Reading",
      items: [
        "**Đọc kỹ hướng dẫn trước khi đọc bài.** Đề ghi “NO MORE THAN TWO WORDS” mà bạn viết 3 từ là sai, dù ý đúng. Đề ghi “Yes/No/Not Given” mà bạn viết True/False cũng sai.",
        "**Chia thời gian:** trung bình **20 phút một bài**. Mẹo thêm: bài 1 dễ nhất nên cố làm trong ~17 phút, để dành thời gian cho bài 3 khó nhất (~23 phút). Một câu nghĩ quá 2 phút thì đoán một đáp án rồi đi tiếp.",
        "**Chú ý từ khoá và thông tin quan trọng**: tên riêng, con số, năm, từ mang ý chính. Đây là “mỏ neo” giúp bạn nhảy thẳng tới đúng chỗ trong bài thay vì đọc lại từ đầu.",
      ],
    },

    { t: "h", text: "4. Từ khoá (keyword) là gì?" },
    {
      t: "p",
      text: "**Keyword** (từ khoá) là những **từ hoặc cụm từ quan trọng nhất** trong câu hỏi hoặc trong bài đọc. Chúng cho bạn biết câu hỏi đang nói về cái gì và thông tin cần tìm nằm ở đâu. Hãy hình dung từ khoá như **địa chỉ nhà**: có địa chỉ, bạn đi thẳng tới nơi, không phải gõ cửa từng nhà.",
    },
    {
      t: "examples",
      items: [
        { en: "When did the city library first open to the public?", vi: "Từ khoá: **When** (hỏi thời gian) · **city library** (chủ đề) · **first open** (việc cần tìm). Các từ “did, the, to” không phải từ khoá." },
      ],
    },

    { t: "h", text: "5. 4 nhóm từ khoá, 10 loại nhỏ" },
    {
      t: "p",
      text: "Sách chia từ khoá thành **4 nhóm lớn**. Học theo nhóm giúp mắt bạn quen “bắt” đúng loại từ khi lướt bài. Ví dụ trong bảng là ví dụ mới, bạn hãy đọc to từng ví dụ.",
    },
    {
      t: "table",
      caption: "Nhóm 1 — Từ khoá chính (Main Keywords)",
      head: ["Loại", "Là gì", "Ví dụ"],
      rows: [
        ["1.1 Từ khoá chủ đề (Topic Keywords)", "Từ nói về **chủ đề chính** của đoạn văn hoặc câu hỏi.", "Chủ đề năng lượng: **solar power, fossil fuels, renewable energy** · Chủ đề giáo dục: **online learning, tuition fees, exam results**"],
        ["1.2 Từ khoá câu hỏi (Question Keywords)", "Từ cho biết câu hỏi **đòi loại thông tin gì**.", "**What** (cái gì) · **Which** (cái nào) · **Why** (vì sao → tìm lý do) · **How** (thế nào → tìm cách) · **When** (khi nào → tìm thời gian) · **According to** (theo ai → tìm đúng người/nguồn đó)"],
        ["1.3 Từ khoá định hướng (Directional Keywords)", "Từ chỉ **vị trí, phương hướng**, giúp định vị trên bản đồ, sơ đồ.", "**next to** (bên cạnh) · **above** (phía trên) · **below** (phía dưới) · **opposite** (đối diện) · **behind** (phía sau) · **between** (ở giữa)"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 2 — Từ khoá hỗ trợ (Supporting Keywords)",
      head: ["Loại", "Là gì", "Ví dụ"],
      rows: [
        ["2.1 Từ khoá thay thế (Synonyms)", "Từ **cùng nghĩa** với từ khoá chính nhưng viết khác. Đề IELTS rất hay đổi từ trong câu hỏi thành từ đồng nghĩa trong bài.", "**big → large** · **begin → start** · **buy → purchase** · **children → young people** · **increase → rise**"],
        ["2.2 Từ khoá ví dụ (Example Keywords)", "Từ báo hiệu **ví dụ** sắp xuất hiện.", "**for example** · **for instance** · **such as** · **namely** (cụ thể là) · **including** (bao gồm)"],
        ["2.3 Từ khoá số liệu (Numerical Keywords)", "Từ và số liên quan đến **số lượng, thống kê**.", "**percent / %** · **number** · **figure** (con số) · **rate** (tỉ lệ) · **amount** (lượng) · **half, a third, twice**"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 3 — Tên riêng và địa điểm (Proper Nouns and Locations)",
      head: ["Loại", "Là gì", "Ví dụ"],
      rows: [
        ["3.1 Tên riêng (Proper Nouns)", "Tên cụ thể của **người, nơi chốn, tổ chức, sự kiện**. Viết hoa chữ đầu nên **dễ thấy nhất** khi lướt bài.", "**Marie Curie** · **Tokyo** · **the World Health Organization** · **the Olympic Games**"],
        ["3.2 Địa điểm (Locations)", "Từ chung chỉ **nơi chốn, khu vực** (không viết hoa).", "**city** · **region** (vùng) · **country** · **zone** (khu) · **coast** (bờ biển) · **countryside** (nông thôn)"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 4 — Từ khoá thời gian (Time Keywords)",
      head: ["Loại", "Là gì", "Ví dụ"],
      rows: [
        ["4.1 Thời điểm cụ thể (Specific Time)", "Một **mốc** thời gian.", "**March** · **Friday** · **2015** · **last month** · **at 7 a.m.**"],
        ["4.2 Khoảng thời gian (Time Period)", "Một **quãng** thời gian kéo dài.", "**during the winter** · **in the 1990s** (những năm 1990) · **over the last ten years** · **for two decades** (trong hai thập kỷ)"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay nhầm",
      items: [
        "Gạch chân **quá nhiều từ**. Chỉ gạch 2–4 từ mang nghĩa nhất. Các từ nhỏ như **the, a, of, is, do** gần như không bao giờ là từ khoá.",
        "Chỉ đi tìm **đúng chữ** trong câu hỏi. Đề hay đổi sang từ đồng nghĩa: câu hỏi ghi **“the number of visitors rose”**, bài đọc lại viết **“more people came”**. Tìm theo **nghĩa**, không chỉ theo mặt chữ.",
        "Thấy **đúng chữ** trong bài là chọn ngay. Đây thường là **bẫy**: đề cố tình để một đáp án sai lặp lại y nguyên chữ trong bài.",
        "**1990s** là “những năm 1990” (cả thập kỷ 1990–1999), **không phải** năm 1990.",
      ],
    },

    { t: "h", text: "6. Cách dùng từ khoá trong IELTS Reading" },
    {
      t: "table",
      head: ["Cách", "Làm thế nào"],
      rows: [
        ["1. Tìm kiếm thông tin", "Gạch từ khoá chính trong câu hỏi, rồi **lướt** bài tìm đúng từ đó hoặc từ cùng nghĩa. Tên riêng, số, năm là dễ tìm nhất, hãy tìm chúng trước."],
        ["2. So sánh và đối chiếu", "Tìm được chỗ rồi thì đọc **kỹ 1–2 câu quanh đó**, so từng từ khoá của câu hỏi với bài. Đủ khớp mới chọn."],
        ["3. Chú ý từ khoá thay thế", "Thông tin trong bài thường được **viết lại bằng từ khác** (từ đồng nghĩa, cụm từ khác, hoặc cách nói trái nghĩa). Không thấy đúng chữ không có nghĩa là không có thông tin."],
      ],
    },

    { t: "h", text: "7. Ví dụ làm bài theo 2 bước" },
    {
      t: "p",
      text: "Bạn hãy **tự làm câu hỏi dưới đây trước**, rồi mới đọc lời giải từng bước.",
    },
    {
      t: "passage",
      title: "World coffee production",
      paras: [
        {
          text: "In 2022, Brazil remained the largest producer of coffee in the world, growing more than a third of all the coffee beans sold worldwide. Vietnam came second, mostly thanks to its huge farms of robusta coffee in the Central Highlands. Colombia and Indonesia also grew large amounts, but their output was far smaller than that of the top two countries.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-doc-vi-du",
      title: "Thử làm: câu hỏi ví dụ (1 câu)",
      items: [
        {
          q: "Which country produced the most coffee in 2022?",
          options: ["A. Vietnam", "B. Brazil", "C. Colombia", "D. Indonesia"],
          correct: 1,
          why: "“produced the most” = “the largest producer” (từ khoá thay thế). Câu có năm **2022** nói **Brazil** là nước sản xuất lớn nhất. Vietnam là bẫy: có trong bài nhưng chỉ đứng **thứ hai**.",
        },
      ],
    },
    {
      t: "p",
      text: "**Bước 1: Xác định các từ khoá**",
    },
    {
      t: "table",
      head: ["Ở đâu", "Loại từ khoá", "Từ khoá"],
      rows: [
        ["Câu hỏi", "Từ khoá chính", "**produced the most coffee**, **2022**"],
        ["Câu hỏi", "Tên riêng (4 đáp án)", "**Vietnam, Brazil, Colombia, Indonesia**"],
        ["Bài đọc", "Thời gian", "**In 2022**"],
        ["Bài đọc", "Số liệu", "**more than a third** (hơn một phần ba), **second** (thứ hai)"],
        ["Bài đọc", "Thay thế", "“produced the most” được viết lại thành **“the largest producer”**; “far smaller” (nhỏ hơn nhiều) là cách nói **ngược** với “the most”."],
      ],
    },
    {
      t: "p",
      text: "**Bước 2: So sánh và đối chiếu từ khoá**",
    },
    {
      t: "examples",
      items: [
        { en: "Question: which country produced the MOST coffee in 2022?", vi: "Câu hỏi cần **một** nước đứng **đầu** trong năm 2022. Từ khoá “most” và “2022” dẫn bạn tới câu đầu tiên của bài." },
        { en: "Brazil → “the largest producer … more than a third”", vi: "“largest producer” cùng nghĩa với “produced the most”, lại có số liệu “hơn một phần ba” đi kèm → khớp hoàn toàn." },
        { en: "Vietnam → “came second”", vi: "Có tên trong bài nhưng đứng thứ hai → **không phải** nhiều nhất." },
        { en: "Colombia, Indonesia → “far smaller”", vi: "“Nhỏ hơn nhiều” so với hai nước đầu → loại." },
      ],
    },
    {
      t: "note",
      title: "Kết luận",
      items: ["Chỉ **Brazil** vừa khớp năm 2022, vừa khớp nghĩa “nhiều nhất” (the largest producer). **Đáp án: B. Brazil.**"],
    },
    {
      t: "note",
      title: "Bổ sung thêm — mỗi loại từ khoá đã giúp gì trong ví dụ",
      items: [
        "**Từ khoá chính** (produced the most, 2022): cho biết trọng tâm cần tìm, dùng để định vị câu liên quan trong bài.",
        "**Tên riêng** (4 tên nước): viết hoa nên nhìn thấy ngay trong bài, giúp bạn khoanh vùng đúng phần thông tin của từng nước.",
        "**Thời gian** (In 2022): xác nhận thông tin trong bài nói **đúng năm** câu hỏi hỏi, không phải năm khác.",
        "**Số liệu** (more than a third, second): cho thấy rõ thứ hạng của từng nước để so sánh.",
        "**Từ thay thế** (the largest producer = produced the most; far smaller là ý ngược): giúp bạn hiểu bài dù bài **không dùng lại** chữ của câu hỏi.",
      ],
    },

    { t: "h", text: "8. Luyện nhận diện loại từ khoá" },
    {
      t: "p",
      text: "Phần này sách chưa có. Làm để chắc rằng bạn phân biệt được 10 loại từ khoá trước khi vào bài tập về nhà.",
    },
    {
      t: "mcq",
      id: "d2-doc-loai-tu-khoa",
      title: "Từ in đậm thuộc loại từ khoá nào? (8 câu)",
      items: [
        { q: "The museum is **opposite** the train station.", options: ["Định hướng", "Địa điểm", "Tên riêng"], correct: 0, why: "“opposite” (đối diện) chỉ **vị trí** → từ khoá định hướng." },
        { q: "About **40 percent** of students work part-time.", options: ["Thời điểm cụ thể", "Số liệu", "Ví dụ"], correct: 1, why: "Phần trăm là **số liệu**." },
        { q: "The bridge was built **in the 1960s**.", options: ["Thời điểm cụ thể", "Khoảng thời gian", "Số liệu"], correct: 1, why: "“in the 1960s” là cả một **thập kỷ** → khoảng thời gian." },
        { q: "Some fruits, **such as** mangoes, grow well here.", options: ["Ví dụ", "Thay thế", "Chủ đề"], correct: 0, why: "“such as” báo hiệu **ví dụ** sắp đến." },
        { q: "**Why** do many young people move to big cities?", options: ["Định hướng", "Chủ đề", "Câu hỏi"], correct: 2, why: "“Why” cho biết cần tìm **lý do** → từ khoá câu hỏi." },
        { q: "The report was written by **UNESCO**.", options: ["Tên riêng", "Địa điểm", "Ví dụ"], correct: 0, why: "Tên một **tổ chức** cụ thể, viết hoa → tên riêng." },
        { q: "Farmers in this **region** grow rice.", options: ["Tên riêng", "Địa điểm", "Định hướng"], correct: 1, why: "“region” (vùng) là từ chung chỉ nơi chốn → địa điểm." },
        { q: "Question: “Prices **went up**.” — Bài đọc: “Prices **increased**.”", options: ["Thay thế", "Số liệu", "Câu hỏi"], correct: 0, why: "“went up” và “increased” cùng nghĩa “tăng” → từ khoá **thay thế** (đồng nghĩa)." },
      ],
    },
  ],
};

/* ───────────────────────── Writing ───────────────────────── */

const D2_WRITING: Lesson = {
  id: "d2-viet",
  kind: "writing",
  title: "Làm quen IELTS Writing Task 2",
  goal: "Biết Task 2 yêu cầu gì, dựng được khung bài luận 4–5 đoạn, hiểu 4 tiêu chí chấm và tự tính được band.",
  minutes: 45,
  blocks: [
    { t: "h", text: "1. Writing Task 2 là gì?" },
    {
      t: "p",
      text: "Trong **Writing Task 2**, đề cho bạn một **câu hỏi hoặc một vấn đề** (ví dụ: “Có nên cấm điện thoại trong trường học?”). Bạn viết một **bài luận** (essay) để trả lời. Bài luận kiểm tra 3 khả năng: **đưa ra lập luận** (argument — lý lẽ bảo vệ ý kiến), **bàn về các quan điểm khác nhau**, và **dùng tiếng Anh rõ ràng, đúng**.",
    },
    {
      t: "table",
      head: ["Điểm cần biết", "Con số", "Giải thích thêm"],
      rows: [
        ["Số từ (Word count)", "**Ít nhất 250 từ**", "Viết dưới 250 từ bị **trừ điểm** ở tiêu chí Task Response. Nên nhắm 260–300 từ; viết quá dài chỉ tốn thời gian và dễ sai."],
        ["Thời gian (Time)", "**40 phút**", "Cả bài Writing có 60 phút cho 2 task, không ai bấm giờ riêng. 40 phút là thời gian **nên dành** cho Task 2, còn 20 phút cho Task 1."],
        ["Trọng số", "Task 2 **gấp đôi** Task 1", "Phần này sách chưa có: Task 2 chiếm khoảng 2/3 điểm Writing. Vì vậy nhiều người **làm Task 2 trước**."],
      ],
    },
    {
      t: "note",
      title: "Mẹo chia 40 phút",
      items: [
        "**5 phút** đọc đề, gạch từ khoá, lập dàn ý.",
        "**30 phút** viết: mở bài ~4 phút, mỗi đoạn thân bài ~11 phút, kết bài ~4 phút.",
        "**5 phút** đọc lại, sửa lỗi -s/-es, mạo từ a/an/the, chính tả.",
      ],
    },

    { t: "h", text: "2. Cấu trúc bài luận" },
    {
      t: "table",
      head: ["Phần", "Viết gì", "Độ dài gợi ý"],
      rows: [
        ["Mở bài (Introduction)", "**Paraphrase** đề (viết lại ý của đề bằng từ của bạn) + nêu **thesis** (luận điểm chính — câu trả lời thẳng cho câu hỏi của đề).", "2–3 câu, ~40–50 từ"],
        ["Thân bài 1 (Body 1)", "Nêu **ý chính thứ nhất** → đưa **bằng chứng hoặc ví dụ** → giải thích vì sao ý này **ủng hộ luận điểm** của bạn.", "4–6 câu, ~90–100 từ"],
        ["Thân bài 2 (Body 2)", "Nêu **ý chính thứ hai**, làm giống thân bài 1: ý chính → ví dụ → giải thích.", "4–6 câu, ~90–100 từ"],
        ["(Thân bài 3 — nếu cần)", "Có thể thêm đoạn khi lập luận phức tạp. Người mới học nên giữ **2 đoạn** để kịp giờ và viết sâu.", "Tuỳ chọn"],
        ["Kết bài (Conclusion)", "**Tóm tắt** các ý chính và **nhắc lại luận điểm** (bằng từ khác). **Không đưa thông tin mới** vào kết bài.", "1–2 câu, ~30–40 từ"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "Chép lại nguyên câu đề vào mở bài. Giám khảo **không tính** những từ chép từ đề vào số từ của bạn. Hãy đổi từ: ~~Many people think that children should learn a foreign language.~~ → **It is often argued that young learners ought to study a second language.**",
        "Không nêu rõ ý kiến. Đề hỏi “To what extent do you agree?” mà bài chỉ kể lợi và hại, không nói mình đồng ý hay không → bị trừ điểm Task Response.",
        "Thêm ý mới ở kết bài (“Ngoài ra, còn một lợi ích nữa là…”). Kết bài chỉ **tóm lại**, ý mới phải nằm ở thân bài.",
        "Viết thân bài chỉ một câu ý chính rồi sang đoạn khác. Mỗi ý cần **giải thích + ví dụ**, nếu không bài bị coi là “chưa phát triển ý”.",
      ],
    },

    { t: "h", text: "3. Dàn ý mẫu" },
    {
      t: "p",
      text: "Đề ví dụ: **“Some people think that primary school children should learn a foreign language. To what extent do you agree or disagree?”** (Có ý kiến cho rằng học sinh tiểu học nên học ngoại ngữ. Bạn đồng ý hay không đồng ý đến mức nào?)",
    },
    {
      t: "table",
      head: ["Phần", "Câu mẫu", "Nghĩa"],
      rows: [
        ["Mở bài — paraphrase", "It is often argued that young learners should start studying a second language at primary school.", "Người ta thường cho rằng trẻ nhỏ nên bắt đầu học ngôn ngữ thứ hai từ bậc tiểu học."],
        ["Mở bài — thesis", "I completely agree with this view for two main reasons.", "Tôi hoàn toàn đồng ý với quan điểm này vì hai lý do chính."],
        ["Thân bài 1 — ý chính", "Firstly, children learn new sounds and words more easily than adults.", "Thứ nhất, trẻ em học âm và từ mới dễ hơn người lớn."],
        ["Thân bài 1 — ví dụ", "For example, many Vietnamese children who start English at six can pronounce it almost like native speakers.", "Ví dụ, nhiều trẻ Việt Nam học tiếng Anh từ sáu tuổi có thể phát âm gần như người bản xứ."],
        ["Thân bài 2 — ý chính", "Secondly, an early start gives children more opportunities in the future.", "Thứ hai, bắt đầu sớm cho trẻ nhiều cơ hội hơn trong tương lai."],
        ["Thân bài 2 — ví dụ", "For instance, students who speak English well can win scholarships to study abroad.", "Chẳng hạn, học sinh giỏi tiếng Anh có thể giành học bổng du học."],
        ["Kết bài", "In conclusion, I believe learning a foreign language at primary school is highly beneficial because children learn faster and gain better chances later in life.", "Tóm lại, tôi tin học ngoại ngữ từ tiểu học rất có lợi vì trẻ học nhanh hơn và có nhiều cơ hội hơn sau này."],
      ],
    },

    { t: "h", text: "4. 4 tiêu chí chấm — mỗi tiêu chí 25%" },
    {
      t: "p",
      text: "Giám khảo chấm bài theo **4 tiêu chí** (criteria). Mỗi tiêu chí chiếm **25%** điểm và được chấm từ **0 đến 9**. Hiểu 4 tiêu chí là biết chính xác giám khảo nhìn vào đâu.",
    },
    {
      t: "table",
      head: ["Tiêu chí", "Hỏi gì (nói đơn giản)", "Làm điểm TĂNG", "Làm điểm GIẢM"],
      rows: [
        ["**A. Task Response (TR)** — Đáp ứng yêu cầu đề", "Bạn có **trả lời đúng và đủ** câu hỏi của đề không? Ý có được **phát triển** không?", "Trả lời **mọi phần** của đề · ý kiến rõ từ mở bài tới kết bài · mỗi ý có giải thích và ví dụ cụ thể", "Lạc đề · chỉ trả lời một nửa đề · ý kiến mập mờ · dưới 250 từ · ví dụ chung chung"],
        ["**B. Coherence and Cohesion (CC)** — Mạch lạc và liên kết", "Bài có **sắp xếp hợp lý** không? Câu, đoạn có **nối với nhau** trôi chảy không?", "Mỗi đoạn **một ý chính** · chia đoạn rõ · dùng từ nối đúng (Firstly, However, For example, As a result) · dùng **it, this, they** để khỏi lặp", "Không chia đoạn · ý nhảy lung tung · dùng từ nối **máy móc** ở đầu mọi câu · dùng sai nghĩa từ nối"],
        ["**C. Lexical Resource (LR)** — Vốn từ vựng", "Bạn dùng từ có **đa dạng và chính xác** không?", "Dùng từ **đúng ngữ cảnh** · có cụm từ tự nhiên (collocation — từ hay đi cùng nhau, vd: *make a decision*) · biết đổi từ đồng nghĩa · chính tả đúng", "Lặp một từ nhiều lần · dùng từ “to tát” sai nghĩa · sai chính tả · sai từ loại (~~a success person~~ → **a successful person**)"],
        ["**D. Grammatical Range and Accuracy (GRA)** — Ngữ pháp: đa dạng và chính xác", "Bạn dùng **được nhiều kiểu câu** không? Câu có **đúng ngữ pháp** không?", "Trộn câu đơn với câu ghép, câu phức (có although, because, which…) · nhiều câu **không lỗi** · dấu câu đúng", "Chỉ viết câu đơn ngắn · lỗi cơ bản lặp lại (quên -s, sai thì, thiếu động từ) · câu dài nhưng rối"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "Người mới học hay cố nhét **từ khó, câu dài** để “ăn điểm”. Kết quả thường là sai nhiều hơn → **tụt cả LR lẫn GRA**. Một câu đơn giản mà đúng tốt hơn một câu phức tạp mà sai.",
        "Lạc đề thì tiếng Anh hay đến đâu điểm **TR** vẫn thấp, kéo cả bài xuống. Luôn dành 5 phút đầu để hiểu đề.",
      ],
    },

    { t: "h", text: "5. Cách tính điểm" },
    {
      t: "p",
      text: "Điểm bài Task 2 là **trung bình cộng** của 4 tiêu chí. Ví dụ: TR được **7**, CC được **6**, LR được **7**, GRA được **6**.",
    },
    {
      t: "table",
      head: ["Tiêu chí", "Tỉ lệ", "Điểm ví dụ"],
      rows: [
        ["Task Response", "25%", "7"],
        ["Coherence and Cohesion", "25%", "6"],
        ["Lexical Resource", "25%", "7"],
        ["Grammatical Range and Accuracy", "25%", "6"],
        ["**Điểm Task 2** = (7 + 6 + 7 + 6) ÷ 4", "", "**6.5**"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: điểm làm tròn thế nào",
      items: [
        "Phần này sách chưa giảng. IELTS chỉ báo điểm theo bước **0.5** (5.0, 5.5, 6.0…). Trung bình ra số lẻ khác thì phải làm tròn.",
        "**Điểm tổng cả bài thi** (Overall — trung bình 4 kỹ năng Nghe, Đọc, Viết, Nói) làm tròn tới **0.5 gần nhất**, với luật chính thức: đuôi **.25 → lên .5**, đuôi **.75 → lên số nguyên kế tiếp**. Ví dụ 6.25 → **6.5**; 6.75 → **7.0**; 6.125 → **6.0**; 6.375 → **6.5**.",
        "Điểm **từng bài Writing** thì IELTS không công bố công thức chi tiết. Giám khảo cũ thường chia sẻ rằng trung bình 4 tiêu chí được **làm tròn xuống** 0.5 gần nhất (6.75 → 6.5), rồi điểm Writing = Task 2 tính **gấp đôi** Task 1. Hãy coi đây là cách **ước lượng**, không phải luật chính thức.",
      ],
    },
    {
      t: "quiz",
      id: "d2-viet-tinh-diem",
      title: "Tự tính điểm (6 câu) — ghi số dạng 6 hoặc 6.5",
      kind: "fill",
      items: [
        { q: "Task 2: TR 6 · CC 6 · LR 6 · GRA 6 → điểm Task 2 = ___", answers: ["6", "6.0"] },
        { q: "Task 2: TR 7 · CC 6 · LR 6 · GRA 5 → điểm Task 2 = ___", answers: ["6", "6.0"] },
        { q: "Task 2: TR 6 · CC 5 · LR 6 · GRA 5 → điểm Task 2 = ___", answers: ["5.5"] },
        { q: "Task 2: TR 8 · CC 7 · LR 7 · GRA 6 → điểm Task 2 = ___", answers: ["7", "7.0"] },
        { q: "Overall: Nghe 7 · Đọc 6.5 · Viết 6 · Nói 6 → trung bình 6.375 → làm tròn thành ___", answers: ["6.5"] },
        { q: "Overall: Nghe 6 · Đọc 6 · Viết 5.5 · Nói 5.5 → trung bình 5.75 → làm tròn thành ___", answers: ["6", "6.0"] },
      ],
    },
    {
      t: "mcq",
      id: "d2-viet-kiem-tra",
      title: "Kiểm tra nhanh về Task 2 (5 câu)",
      items: [
        { q: "Bài Task 2 cần tối thiểu bao nhiêu từ?", options: ["150 từ", "250 từ", "350 từ"], correct: 1, why: "Task 2 cần **ít nhất 250 từ**. 150 từ là yêu cầu của Task 1." },
        { q: "Câu nào nên nằm ở MỞ BÀI?", options: ["Luận điểm (thesis) trả lời thẳng câu hỏi của đề", "Một ví dụ chi tiết về gia đình bạn", "Một ý mới chưa nói ở đâu"], correct: 0, why: "Mở bài = paraphrase đề + **thesis**. Ví dụ để ở thân bài, ý mới không đưa vào kết bài." },
        { q: "Bài viết dùng “Firstly, Secondly, However” hợp lý và chia đoạn rõ ràng. Tiêu chí nào được lợi nhất?", options: ["Lexical Resource", "Coherence and Cohesion", "Task Response"], correct: 1, why: "Từ nối và cách chia đoạn thuộc **Coherence and Cohesion** (mạch lạc và liên kết)." },
        { q: "Bài lặp từ “good” 12 lần và sai chính tả nhiều. Tiêu chí nào bị ảnh hưởng nhất?", options: ["Lexical Resource", "Grammatical Range and Accuracy", "Coherence and Cohesion"], correct: 0, why: "Lặp từ và chính tả thuộc **Lexical Resource** (vốn từ)." },
        { q: "Ở kết bài, bạn nên…", options: ["thêm một lý do mới thật thuyết phục", "tóm tắt ý chính và nhắc lại luận điểm", "đặt một câu hỏi cho người đọc"], correct: 1, why: "Kết bài **tóm tắt + nhắc lại luận điểm**, không thêm thông tin mới." },
      ],
    },

    { t: "h", text: "6. Tự viết bài đầu tiên" },
    {
      t: "p",
      text: "Đừng lo viết chưa hay. Mục tiêu hôm nay là viết **đủ 4 phần** đúng khung ở trên. AI sẽ chấm theo 4 tiêu chí và chỉ ra chỗ cần sửa.",
    },
    {
      t: "essay",
      id: "d2-viet-bai-dau",
      task: "Task 2",
      prompt: "Some people believe that all students should wear school uniforms. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.",
      minWords: 250,
      tips: [
        "Chọn rõ một phía: đồng ý (agree) hoặc không đồng ý (disagree). Viết lựa chọn đó ngay trong câu thesis ở mở bài.",
        "Mở bài: viết lại đề bằng từ khác (vd: all students → every pupil; wear school uniforms → dress in the same clothes at school) + câu thesis.",
        "Ý gợi ý nếu đồng ý: uniforms reduce pressure about fashion and money · they create a sense of belonging (cảm giác thuộc về tập thể).",
        "Ý gợi ý nếu không đồng ý: students cannot express their personality · uniforms can be expensive for poor families.",
        "Mỗi thân bài: ý chính → giải thích → ví dụ (có thể lấy trường của chính bạn). Kết bài: In conclusion, … + nhắc lại ý kiến.",
        "Viết phần lớn ở thì hiện tại đơn (đã học Ngày 1) và kiểm tra lại đuôi -s với he / she / it.",
      ],
    },
  ],
};

/* ───────────────────────── Speaking ───────────────────────── */

const D2_SPEAKING: Lesson = {
  id: "d2-noi",
  kind: "speaking",
  title: "Cấu trúc bài thi IELTS Speaking",
  goal: "Nắm 3 phần của bài thi Nói (thời gian, giám khảo làm gì), nghe câu trả lời mẫu và tự ghi âm trả lời Part 1.",
  minutes: 35,
  blocks: [
    { t: "h", text: "1. Tổng quan bài thi Nói" },
    {
      t: "p",
      text: "Bài thi Speaking là một **cuộc phỏng vấn trực tiếp** giữa bạn và **một giám khảo** (examiner), dài khoảng **11–14 phút**, chia làm **3 phần** từ dễ đến khó. Buổi thi được **ghi âm** lại để chấm lại khi cần.",
    },
    {
      t: "table",
      head: ["Phần", "Thời gian", "Giám khảo làm gì", "Bạn làm gì"],
      rows: [
        ["**Part 1** — Introduction & Interview (Giới thiệu và phỏng vấn)", "4–5 phút", "Tự giới thiệu, hỏi tên, kiểm tra giấy tờ, rồi hỏi các câu **chung về bản thân**: quê quán, gia đình, học tập, công việc, sở thích.", "Trả lời ngắn gọn, tự nhiên, mỗi câu **2–3 câu** (khoảng 15–25 giây)."],
        ["**Part 2** — Long Turn (Lượt nói dài)", "3–4 phút", "Đưa bạn một **thẻ chủ đề** (cue card) có câu hỏi và các gợi ý, cùng giấy bút. Cho **1 phút chuẩn bị**, rồi để bạn nói; có thể hỏi thêm 1–2 câu ngắn sau đó.", "Ghi chú trong 1 phút, rồi nói liền **1–2 phút** (nên cố nói đủ 2 phút) theo các gợi ý trên thẻ."],
        ["**Part 3** — Discussion (Thảo luận)", "4–5 phút", "Hỏi các câu **sâu hơn, rộng hơn** liên quan tới chủ đề Part 2: ý kiến, so sánh, nguyên nhân, xu hướng xã hội.", "Nêu **ý kiến + lý do + ví dụ**, nói dài hơn Part 1 (khoảng 30–60 giây mỗi câu)."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: 4 tiêu chí chấm Speaking",
      items: [
        "Phần này sách chưa có. Giống Writing, Speaking chấm 4 tiêu chí, mỗi tiêu chí 25%:",
        "**Fluency and Coherence** (Trôi chảy và mạch lạc): nói liền mạch, ít ngập ngừng, ý nối với nhau.",
        "**Lexical Resource** (Vốn từ): dùng từ đúng và đa dạng theo chủ đề.",
        "**Grammatical Range and Accuracy** (Ngữ pháp): đúng và có nhiều kiểu câu.",
        "**Pronunciation** (Phát âm): nói **dễ hiểu**, đúng trọng âm, có ngữ điệu. Không cần giọng Anh hay giọng Mỹ.",
      ],
    },

    { t: "h", text: "2. Part 1 — Giới thiệu và phỏng vấn" },
    {
      t: "p",
      text: "Part 1 là phần “làm nóng”: câu hỏi về những thứ **quen thuộc** để bạn bớt run. Đây là phần **dễ lấy điểm nhất**, nhưng rất nhiều người trả lời cụt một chữ (“Yes.”, “Hanoi.”) nên mất điểm trôi chảy.",
    },
    {
      t: "examples",
      items: [
        { en: "Where is your hometown?", vi: "Quê bạn ở đâu?" },
        { en: "What do you usually do at the weekend?", vi: "Cuối tuần bạn thường làm gì?" },
        { en: "Do you work or are you a student?", vi: "Bạn đi làm hay đang đi học?" },
        { en: "What kind of music do you like?", vi: "Bạn thích thể loại nhạc nào?" },
      ],
    },
    {
      t: "note",
      title: "Mẹo trả lời Part 1",
      items: [
        "Công thức dễ nhớ: **Trả lời thẳng → Lý do / chi tiết → Ví dụ nhỏ**. Ba câu là đủ.",
        "Không học thuộc cả bài văn mẫu. Giám khảo nhận ra giọng đọc thuộc lòng và có thể chuyển sang câu hỏi khác.",
        "Không nghe rõ câu hỏi thì hỏi lại: **“Sorry, could you repeat the question, please?”** Việc này **không bị trừ điểm**.",
      ],
    },
    {
      t: "dialogue",
      title: "Part 1 mẫu (khoảng band 6) — phần này sách chưa có",
      lines: [
        { who: "Examiner", role: "examiner", text: "Good morning. My name is Sarah. Could you tell me your full name, please?", vi: "Chào buổi sáng. Tôi tên là Sarah. Bạn có thể cho tôi biết họ tên đầy đủ không?" },
        { who: "Candidate", role: "candidate", text: "Good morning. My full name is Tran Minh Anh, but you can call me Anh.", vi: "Chào buổi sáng. Họ tên đầy đủ của tôi là Trần Minh Anh, nhưng chị có thể gọi tôi là Anh." },
        { who: "Examiner", role: "examiner", text: "Thank you. Let's talk about your hometown. Where is your hometown?", vi: "Cảm ơn. Chúng ta nói về quê của bạn nhé. Quê bạn ở đâu?" },
        { who: "Candidate", role: "candidate", text: "I come from Hue, a city in the centre of Vietnam. It's quite small and peaceful, and it's famous for its old royal buildings along the Perfume River.", vi: "Tôi đến từ Huế, một thành phố ở miền Trung Việt Nam. Nó khá nhỏ và yên bình, và nổi tiếng với các công trình cung đình cổ dọc sông Hương." },
        { who: "Examiner", role: "examiner", text: "What do you like most about it?", vi: "Bạn thích điều gì nhất ở đó?" },
        { who: "Candidate", role: "candidate", text: "I think it's the food. Hue has a lot of delicious local dishes, like beef noodle soup. Whenever I go back home, I eat it almost every morning.", vi: "Tôi nghĩ là đồ ăn. Huế có rất nhiều món địa phương ngon, như bún bò. Mỗi lần về quê, gần như sáng nào tôi cũng ăn." },
        { who: "Examiner", role: "examiner", text: "What do you like to do in your free time?", vi: "Lúc rảnh bạn thích làm gì?" },
        { who: "Candidate", role: "candidate", text: "Well, I usually play badminton with my friends after class. It helps me relax, and it's a good way to stay fit because I sit at a desk most of the day.", vi: "À, tôi thường chơi cầu lông với bạn sau giờ học. Nó giúp tôi thư giãn, và là cách tốt để giữ dáng vì tôi ngồi bàn gần như cả ngày." },
      ],
    },
    {
      t: "note",
      title: "Vì sao câu trả lời trên ổn?",
      items: [
        "Mỗi câu trả lời **thẳng vào câu hỏi** trước (“I come from Hue”, “I think it's the food”), rồi mới thêm chi tiết.",
        "Có **lý do** (because, it helps me…) và **ví dụ** (beef noodle soup) → tăng điểm trôi chảy.",
        "Dùng từ nối tự nhiên của văn nói: **Well, I think, Whenever** — không cần từ khó.",
      ],
    },

    { t: "h", text: "3. Part 2 — Lượt nói dài" },
    {
      t: "p",
      text: "Bạn nhận một **cue card** (thẻ chủ đề). Có **1 phút** để ghi chú ra giấy, rồi nói **1–2 phút** không bị ngắt. Hết giờ giám khảo sẽ dừng bạn lại, nên nói đủ các gợi ý quan trọng trước.",
    },
    {
      t: "note",
      title: "Cue card",
      items: [
        "**Describe a book you have read recently.** (Hãy tả một cuốn sách bạn đọc gần đây.)",
        "You should say: (Bạn nên nói:)",
        "– what the book was and who wrote it (đó là sách gì, ai viết)",
        "– when and why you decided to read it (bạn đọc khi nào, vì sao chọn đọc)",
        "– what part of it you enjoyed most (bạn thích phần nào nhất)",
        "and explain whether you would recommend it to other people. (và giải thích bạn có giới thiệu nó cho người khác không.)",
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng 1 phút chuẩn bị",
      items: [
        "Chỉ ghi **từ khoá**, không viết câu. Mỗi gợi ý trên thẻ ghi 2–3 từ.",
        "Dùng **thì quá khứ** khi kể lại việc đã xảy ra (read, bought, decided), dùng hiện tại khi nói ý kiến bây giờ (I think, I would recommend).",
        "Nói theo **thứ tự các gợi ý** trên thẻ, đó cũng chính là dàn ý của bạn.",
      ],
    },
    {
      t: "dialogue",
      title: "Part 2 mẫu (khoảng band 6) — phần này sách chưa có",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now I'd like you to talk about a book you have read recently. You have one minute to prepare.", vi: "Bây giờ tôi muốn bạn nói về một cuốn sách bạn đọc gần đây. Bạn có một phút để chuẩn bị." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about The Alchemist, a short novel by the Brazilian writer Paulo Coelho. In Vietnamese it's called Nhà giả kim.", vi: "Tôi muốn nói về Nhà giả kim, một tiểu thuyết ngắn của nhà văn người Brazil Paulo Coelho." },
        { who: "Candidate", role: "candidate", text: "I read it last summer, during my holiday. To be honest, I chose it because my older sister kept talking about it, and it was not very long, so I thought I could finish it quickly.", vi: "Tôi đọc nó hè năm ngoái, trong kỳ nghỉ. Thật lòng mà nói, tôi chọn nó vì chị gái tôi cứ nhắc mãi, và sách không dài lắm nên tôi nghĩ mình đọc xong nhanh được." },
        { who: "Candidate", role: "candidate", text: "The story is about a young shepherd who travels from Spain to Egypt to find a treasure. On the way, he meets many interesting people and learns a lot about life.", vi: "Câu chuyện kể về một cậu bé chăn cừu đi từ Tây Ban Nha tới Ai Cập để tìm kho báu. Trên đường đi, cậu gặp nhiều người thú vị và học được nhiều điều về cuộc sống." },
        { who: "Candidate", role: "candidate", text: "The part I enjoyed most was the ending, because it was a real surprise. It made me think that the things we are looking for are sometimes very close to us.", vi: "Phần tôi thích nhất là cái kết, vì nó thật sự bất ngờ. Nó làm tôi nghĩ rằng những thứ ta đang tìm kiếm đôi khi ở rất gần mình." },
        { who: "Candidate", role: "candidate", text: "So yes, I would definitely recommend it, especially to students. It's easy to read, and it encourages you to follow your dreams even when things get difficult.", vi: "Vì vậy, có, tôi chắc chắn sẽ giới thiệu nó, nhất là cho học sinh sinh viên. Sách dễ đọc và khuyến khích bạn theo đuổi ước mơ ngay cả khi gặp khó khăn." },
      ],
    },

    { t: "h", text: "4. Part 3 — Thảo luận" },
    {
      t: "p",
      text: "Part 3 mở rộng chủ đề của Part 2 ra **xã hội nói chung**. Giám khảo muốn nghe bạn **nêu ý kiến, giải thích, so sánh** — tức là nói về những điều trừu tượng hơn chuyện của riêng bạn.",
    },
    {
      t: "examples",
      items: [
        { en: "Do young people in your country read as much as older people?", vi: "Người trẻ ở nước bạn có đọc sách nhiều như người lớn tuổi không?" },
        { en: "How has technology changed the way people read?", vi: "Công nghệ đã thay đổi cách mọi người đọc như thế nào?" },
        { en: "Should schools make students read more books? Why?", vi: "Trường học có nên bắt học sinh đọc nhiều sách hơn không? Vì sao?" },
      ],
    },
    {
      t: "note",
      title: "Mẹo trả lời Part 3",
      items: [
        "Khung trả lời: **Ý kiến → Lý do → Ví dụ → (so sánh hoặc mặt trái)**.",
        "Dùng cụm mở đầu để có thêm vài giây suy nghĩ: **“That’s an interesting question.”**, **“I’d say that…”**, **“It depends on…”**.",
        "Nói về **người nói chung** (young people, many families…), không chỉ kể chuyện bản thân như Part 1.",
      ],
    },
    {
      t: "mcq",
      id: "d2-noi-kiem-tra",
      title: "Kiểm tra nhanh về cấu trúc bài Nói (5 câu)",
      items: [
        { q: "Cả bài thi Speaking dài khoảng bao lâu?", options: ["5–7 phút", "11–14 phút", "30 phút"], correct: 1, why: "Bài thi Nói dài **11–14 phút**, gồm 3 phần." },
        { q: "Ở Part 2, bạn có bao lâu để chuẩn bị?", options: ["Không có thời gian chuẩn bị", "1 phút", "5 phút"], correct: 1, why: "Bạn có **1 phút** chuẩn bị và được phát giấy bút để ghi chú." },
        { q: "Phần nào hỏi về quê quán, sở thích, học tập?", options: ["Part 1", "Part 2", "Part 3"], correct: 0, why: "**Part 1** hỏi các chủ đề quen thuộc về bản thân." },
        { q: "“How has the internet changed the way people shop?” thường là câu hỏi của phần nào?", options: ["Part 1", "Part 2", "Part 3"], correct: 2, why: "Câu hỏi về **thay đổi trong xã hội**, cần ý kiến và lý do → **Part 3**." },
        { q: "Trong Part 2, bạn nên nói trong bao lâu?", options: ["1–2 phút", "15 giây", "5 phút"], correct: 0, why: "Nói **1–2 phút**, cố gắng dùng đủ 2 phút." },
      ],
    },

    { t: "h", text: "5. Luyện nói" },
    {
      t: "p",
      text: "Bấm nghe câu hỏi, ghi âm câu trả lời (15–25 giây mỗi câu), nghe lại rồi để AI chấm. Nhớ công thức: **trả lời thẳng → lý do → ví dụ**.",
    },
    {
      t: "speak",
      id: "d2-noi-part1",
      part: "1",
      questions: [
        "Can you tell me about your hometown?",
        "What do you like to do in your free time?",
        "Do you work or are you a student?",
        "What do you usually do at the weekend?",
        "Do you like reading books? Why or why not?",
      ],
    },
    {
      t: "speak",
      id: "d2-noi-part2",
      part: "2",
      questions: [
        "Describe a book you have read recently. You should say: what the book was and who wrote it; when and why you decided to read it; what part of it you enjoyed most; and explain whether you would recommend it to other people.",
      ],
    },
    {
      t: "speak",
      id: "d2-noi-part3",
      part: "3",
      questions: [
        "Do you think reading is still popular among young people today?",
        "How has technology changed the way people read?",
        "Should parents encourage their children to read more? Why?",
      ],
    },
  ],
};

/* ───────────────────────── Homework ───────────────────────── */

const D2_HOMEWORK: Lesson = {
  id: "d2-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 2 — Tìm từ khoá",
  goal: "Luyện 5 bài tìm từ khoá: đọc câu hỏi, đọc đoạn văn, xác định đúng loại từ khoá rồi dùng chúng để ra đáp án.",
  minutes: 30,
  blocks: [
    {
      t: "p",
      text: "Mỗi bài gồm **một câu hỏi**, **một đoạn văn tiếng Anh** và các **yêu cầu**. Hãy làm theo đúng 2 bước đã học: **(1) tìm từ khoá**, **(2) so sánh, đối chiếu với đoạn văn**. Cố làm trước khi xem bản dịch ở cuối mỗi bài.",
    },

    /* Bài 1 — nguyên nhân (từ khoá chính + hỗ trợ) */
    { t: "h", text: "Bài tập 1" },
    {
      t: "p",
      text: "**Câu hỏi:** What was the main cause of the Asian financial crisis in 1997? *(Nguyên nhân chính của cuộc khủng hoảng tài chính châu Á năm 1997 là gì?)*",
    },
    {
      t: "passage",
      title: "The Asian financial crisis",
      paras: [
        {
          text: "The Asian financial crisis of 1997 started in Thailand. It was mainly caused by the sudden fall in value of the Thai currency, the baht, after the government could no longer keep its price fixed to the US dollar. Many local companies had borrowed large sums in dollars, so their debts suddenly became much bigger. As foreign investors rushed to take their money out, the crisis quickly spread to other countries in the region, such as Indonesia and South Korea.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-bt1",
      title: "Yêu cầu bài 1 (3 câu)",
      items: [
        {
          q: "1. Từ khoá chính trong câu hỏi là gì?",
          options: ["main cause · Asian financial crisis · 1997", "What · was · the", "Thailand · baht · dollar"],
          correct: 0,
          why: "Câu hỏi hỏi **nguyên nhân chính** (main cause) của **sự kiện nào** (Asian financial crisis) vào **năm nào** (1997). “What, was, the” là từ nhỏ. “Thailand, baht” nằm trong đoạn văn chứ không nằm trong câu hỏi.",
        },
        {
          q: "2. Từ khoá hỗ trợ nào trong đoạn văn dẫn thẳng tới đáp án?",
          options: ["“such as Indonesia and South Korea”", "“mainly caused by”", "“foreign investors”"], correct: 1,
          why: "“**mainly caused by**” là cách viết lại (từ thay thế) của “**main cause**” trong câu hỏi. Ngay sau cụm này là đáp án. “such as…” chỉ là ví dụ về các nước bị lan sang.",
        },
        {
          q: "3. Dùng từ khoá để trả lời: nguyên nhân chính là gì?",
          options: [
            "Foreign investors took their money out of the region.",
            "The sudden fall in value of the Thai baht.",
            "The crisis spread to Indonesia and South Korea.",
          ],
          correct: 1,
          why: "Đoạn văn: “It was **mainly caused by** the sudden fall in value of the Thai currency, the baht”. Việc nhà đầu tư rút tiền và khủng hoảng lan rộng là **hậu quả xảy ra sau**, không phải nguyên nhân chính.",
        },
      ],
    },
    {
      t: "note",
      title: "Bản dịch",
      items: [
        "Cuộc khủng hoảng tài chính châu Á năm 1997 bắt đầu ở Thái Lan. Nguyên nhân chính là đồng tiền Thái Lan, đồng baht, mất giá đột ngột sau khi chính phủ không thể giữ tỷ giá cố định với đô la Mỹ được nữa. Nhiều công ty trong nước đã vay những khoản lớn bằng đô la, nên nợ của họ bỗng tăng lên rất nhiều. Khi các nhà đầu tư nước ngoài vội rút tiền ra, cuộc khủng hoảng nhanh chóng lan sang các nước khác trong khu vực, như Indonesia và Hàn Quốc.",
      ],
    },

    /* Bài 2 — chủ đề + tên riêng */
    { t: "h", text: "Bài tập 2" },
    {
      t: "p",
      text: "**Câu hỏi:** Which animal is most threatened by forest loss on the island of Borneo? *(Loài vật nào bị đe doạ nhiều nhất bởi nạn mất rừng trên đảo Borneo?)*",
    },
    {
      t: "passage",
      title: "Wildlife in Borneo",
      paras: [
        {
          text: "The rainforests of Borneo are home to many rare animals, but the orangutan is the one in the greatest danger as the forests disappear. Large areas of trees have been cut down to make room for palm oil plantations, and the orangutan, which spends most of its life in the trees, has lost much of its home. The pygmy elephant and the sun bear are also affected, but their situation is less serious.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-bt2",
      title: "Yêu cầu bài 2 (2 câu)",
      items: [
        {
          q: "1. Từ khoá chủ đề và tên riêng trong câu hỏi là gì?",
          options: [
            "Chủ đề: animal, forest loss · Tên riêng: Borneo",
            "Chủ đề: palm oil · Tên riêng: orangutan",
            "Chủ đề: island · Tên riêng: Which",
          ],
          correct: 0,
          why: "Chủ đề của câu hỏi là **động vật** bị ảnh hưởng bởi **mất rừng** (forest loss). **Borneo** viết hoa, là tên riêng của hòn đảo. “palm oil, orangutan” nằm trong đoạn văn, không nằm trong câu hỏi.",
        },
        {
          q: "2. Từ khoá quan trọng nào trong đoạn văn cho ra đáp án, và đáp án là gì?",
          options: [
            "“less serious” → the sun bear",
            "“in the greatest danger as the forests disappear” → the orangutan",
            "“home to many rare animals” → the pygmy elephant",
          ],
          correct: 1,
          why: "“**most threatened**” (bị đe doạ nhiều nhất) được viết lại thành “**in the greatest danger**”, và “**forest loss**” thành “**the forests disappear**”. Cả hai đều chỉ **orangutan** (đười ươi). Voi lùn và gấu chó “**less serious**” (ít nghiêm trọng hơn).",
        },
      ],
    },
    {
      t: "note",
      title: "Bản dịch",
      items: [
        "Rừng mưa nhiệt đới ở Borneo là nhà của nhiều loài động vật quý hiếm, nhưng đười ươi là loài gặp nguy hiểm lớn nhất khi rừng biến mất. Những vùng cây rộng lớn đã bị chặt để lấy chỗ trồng cọ dầu, và đười ươi — loài sống phần lớn đời mình trên cây — đã mất đi phần lớn nơi ở. Voi lùn và gấu chó cũng bị ảnh hưởng, nhưng tình trạng của chúng ít nghiêm trọng hơn.",
      ],
    },

    /* Bài 3 — thời gian */
    { t: "h", text: "Bài tập 3" },
    {
      t: "p",
      text: "**Câu hỏi:** In which year did the first public steam railway open? *(Tuyến đường sắt hơi nước công cộng đầu tiên mở cửa vào năm nào?)*",
    },
    {
      t: "passage",
      title: "The first railways",
      paras: [
        {
          text: "Railways changed the way people travelled during the 19th century. The world's first public railway to use steam engines, the Stockton and Darlington Railway in the north of England, opened in September 1825. Five years later, in 1830, a longer line between Liverpool and Manchester began carrying passengers, and within a few decades railways had spread across Europe and North America.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-bt3",
      title: "Yêu cầu bài 3 (2 câu)",
      items: [
        {
          q: "1. Từ khoá thời gian trong câu hỏi là gì?",
          options: ["In which year", "first public", "steam railway"],
          correct: 0,
          why: "“**In which year**” cho biết đáp án là **một năm cụ thể** (thời điểm cụ thể). “first public steam railway” là từ khoá chủ đề, dùng để biết phải lấy năm của **tuyến nào**.",
        },
        {
          q: "2. Từ khoá thời gian nào trong đoạn văn là đáp án?",
          options: ["during the 19th century", "September 1825", "in 1830"],
          correct: 1,
          why: "Câu có “**first public railway to use steam engines**” (khớp “first public steam railway”) ghi mốc **September 1825** → năm **1825**. “19th century” là khoảng thời gian quá rộng. **1830** là bẫy: đó là năm tuyến **thứ hai**, dài hơn, mở cửa.",
        },
      ],
    },
    {
      t: "note",
      title: "Bản dịch",
      items: [
        "Đường sắt đã thay đổi cách con người đi lại trong thế kỷ 19. Tuyến đường sắt công cộng đầu tiên trên thế giới dùng đầu máy hơi nước, tuyến Stockton và Darlington ở miền bắc nước Anh, mở cửa vào tháng 9 năm 1825. Năm năm sau, vào năm 1830, một tuyến dài hơn giữa Liverpool và Manchester bắt đầu chở khách, và chỉ trong vài thập kỷ đường sắt đã lan khắp châu Âu và Bắc Mỹ.",
      ],
    },

    /* Bài 4 — số liệu */
    { t: "h", text: "Bài tập 4" },
    {
      t: "p",
      text: "**Câu hỏi:** What percentage of all the water on Earth is fresh water? *(Nước ngọt chiếm bao nhiêu phần trăm tổng lượng nước trên Trái Đất?)*",
    },
    {
      t: "passage",
      title: "Water on our planet",
      paras: [
        {
          text: "Although water covers most of our planet, only about 3% of it is fresh water. The other 97% is salt water, found mainly in the oceans. Even more surprisingly, most of this fresh water is not easy to use, because around two thirds of it is frozen in glaciers and ice caps.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-bt4",
      title: "Yêu cầu bài 4 (2 câu)",
      items: [
        {
          q: "1. Từ khoá số liệu trong câu hỏi là gì?",
          options: ["What percentage", "all the water", "on Earth"],
          correct: 0,
          why: "“**What percentage**” (bao nhiêu phần trăm) cho biết đáp án là **một con số phần trăm**. Vì vậy khi lướt bài, mắt bạn chỉ cần tìm ký hiệu **%** hoặc chữ **percent**.",
        },
        {
          q: "2. Từ khoá tương ứng trong đoạn văn cho ra đáp án là gì?",
          options: ["“97% is salt water”", "“about 3% of it is fresh water”", "“two thirds of it is frozen”"],
          correct: 1,
          why: "Con số đi cùng “**fresh water**” là **3%**. 97% là của **nước mặn** (salt water) — bẫy số liệu. “two thirds” là tỉ lệ nước ngọt **bị đóng băng**, không phải tỉ lệ nước ngọt trên tổng lượng nước.",
        },
      ],
    },
    {
      t: "note",
      title: "Bản dịch",
      items: [
        "Dù nước bao phủ phần lớn hành tinh của chúng ta, chỉ khoảng 3% trong số đó là nước ngọt. 97% còn lại là nước mặn, chủ yếu nằm trong các đại dương. Đáng ngạc nhiên hơn, phần lớn lượng nước ngọt này không dễ sử dụng, vì khoảng hai phần ba bị đóng băng trong các sông băng và chỏm băng.",
      ],
    },

    /* Bài 5 — hành động / phương pháp */
    { t: "h", text: "Bài tập 5" },
    {
      t: "p",
      text: "**Câu hỏi:** What method do scientists use to find out the age of ancient wooden objects? *(Các nhà khoa học dùng phương pháp nào để xác định tuổi của những đồ vật bằng gỗ cổ xưa?)*",
    },
    {
      t: "passage",
      title: "How old is it?",
      paras: [
        {
          text: "When archaeologists discover an old wooden boat or tool, they often want to know exactly how old it is. To do this, scientists usually rely on a technique called radiocarbon dating. It works by measuring how much of a special type of carbon is left in anything that was once alive, such as wood, bone or cloth. This method can give reliable dates for objects up to around 50,000 years old.",
        },
      ],
    },
    {
      t: "mcq",
      id: "d2-bt5",
      title: "Yêu cầu bài 5 (2 câu)",
      items: [
        {
          q: "1. Từ khoá hành động hoặc phương pháp trong câu hỏi là gì?",
          options: ["What method · use · find out the age", "ancient · wooden · objects", "scientists · do"],
          correct: 0,
          why: "Câu hỏi hỏi **phương pháp** (method) mà các nhà khoa học **dùng** (use) để **xác định tuổi** (find out the age). “ancient wooden objects” là từ khoá chủ đề, cho biết đang nói về vật gì.",
        },
        {
          q: "2. Từ khoá tương ứng trong đoạn văn cho ra đáp án là gì?",
          options: [
            "“rely on a technique called radiocarbon dating”",
            "“an old wooden boat or tool”",
            "“up to around 50,000 years old”",
          ],
          correct: 0,
          why: "“**use**” được viết lại thành “**rely on**” (dựa vào), “**method**” thành “**technique**” (kỹ thuật). Ngay sau đó là tên phương pháp: **radiocarbon dating** (định tuổi bằng carbon phóng xạ). 50,000 năm chỉ là giới hạn của phương pháp.",
        },
      ],
    },
    {
      t: "note",
      title: "Bản dịch",
      items: [
        "Khi các nhà khảo cổ phát hiện một chiếc thuyền hay một dụng cụ bằng gỗ cũ, họ thường muốn biết chính xác nó bao nhiêu tuổi. Để làm việc này, các nhà khoa học thường dựa vào một kỹ thuật gọi là định tuổi bằng carbon phóng xạ. Kỹ thuật này hoạt động bằng cách đo xem còn lại bao nhiêu một loại carbon đặc biệt trong bất cứ thứ gì từng sống, như gỗ, xương hay vải. Phương pháp này có thể cho niên đại đáng tin cậy với những đồ vật có tuổi tới khoảng 50.000 năm.",
      ],
    },

    /* Phần thêm: viết đáp án ngắn như dạng Short Answer */
    { t: "h", text: "Thêm: viết đáp án như đề thi thật" },
    {
      t: "p",
      text: "Phần này sách chưa có. Trong đề thật, dạng **Short Answer Questions** bắt bạn **tự viết** đáp án bằng từ lấy từ bài, thường giới hạn **NO MORE THAN TWO WORDS AND/OR A NUMBER** (tối đa hai từ và/hoặc một con số). Hãy viết lại đáp án của 5 bài trên theo giới hạn đó.",
    },
    {
      t: "quiz",
      id: "d2-bt-tra-loi-ngan",
      title: "Viết đáp án — tối đa HAI TỪ và/hoặc MỘT SỐ (5 câu)",
      kind: "fill",
      items: [
        { q: "Bài 1: The 1997 crisis was mainly caused by the sudden fall in value of the Thai ___ .", answers: ["baht", "currency", "Thai baht"] },
        { q: "Bài 2: Which animal is most threatened by forest loss on Borneo? → the ___", answers: ["orangutan", "orangutans", "the orangutan"] },
        { q: "Bài 3: In which year did the first public steam railway open? → ___", answers: ["1825", "September 1825", "in 1825"] },
        { q: "Bài 4: What percentage of all the water on Earth is fresh water? → about ___", answers: ["3%", "3 %", "3 percent", "3 per cent", "three percent", "three per cent", "about 3%"] },
        { q: "Bài 5: What method do scientists use to find the age of ancient wooden objects? → ___", answers: ["radiocarbon dating", "carbon dating"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi viết đáp án",
      items: [
        "Viết đúng **chính tả** từ trong bài. Sai một chữ cái là mất điểm cả câu.",
        "Vượt giới hạn số từ là **sai**, dù ý đúng: ~~the sudden fall of the baht~~ (quá 2 từ) → **baht**.",
        "Số có thể viết bằng chữ số (**3%**) cho nhanh và ít sai chính tả hơn viết bằng chữ.",
      ],
    },
  ],
};

export const NGAY_2: Lesson[] = [D2_READING, D2_WRITING, D2_SPEAKING, D2_HOMEWORK];
