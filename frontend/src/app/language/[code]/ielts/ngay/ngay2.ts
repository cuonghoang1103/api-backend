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
  goal: "Biết bài thi Reading gồm những gì (3 bài, 40 câu, 14 dạng câu hỏi), nhận ra 10 loại từ khoá, phân biệt skim/scan và dùng từ khoá để tìm đáp án theo 2 bước.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      items: [
        "Reading: **60 phút · 3 bài đọc · 40 câu**, không có thời gian chép đáp án riêng.",
        "**14 dạng câu hỏi** — bảng ở mục 2 ghi rõ dạng nào học ở **Ngày / Tập** nào (Tập 1 học 6 dạng nền).",
        "**Từ khoá** chia 4 nhóm (chính · hỗ trợ · tên riêng & địa điểm · thời gian) = 10 loại nhỏ.",
        "Làm bài theo **2 bước**: ==(1) gạch từ khoá câu hỏi → (2) tìm & đối chiếu trong bài==, chú ý từ đồng nghĩa.",
        "Hai cách đọc: **skim** (lướt lấy ý chính) và **scan** (dò tìm một chi tiết). Cuối bài có **16 từ vựng về bài thi** để vào thẻ nhớ.",
      ],
    },
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

    { t: "h", text: "2. 14 dạng câu hỏi IELTS Reading — và học ở đâu trong khoá" },
    {
      t: "p",
      text: "Mỗi đề Reading trộn nhiều dạng câu hỏi (một bài đọc thường có 2–3 dạng). Sách liệt kê **8 dạng hay gặp**; bảng dưới **bổ sung đủ cả 14 dạng** của IELTS Reading Academic, và cột cuối cho biết dạng đó được dạy kỹ ở **Ngày / Tập** nào của lộ trình 5 tập (T1 = Tập 1 — khoá bạn đang học; Tập 2–5 đang soạn). Hôm nay bạn **chưa cần làm** các dạng này — chỉ cần biết tên để không bỡ ngỡ khi gặp. Thứ cần làm được ngay hôm nay là **kỹ năng nền**: tìm từ khoá (mục 4–7).",
    },
    {
      t: "table",
      caption: "14 dạng câu hỏi Reading · ★ = sách có liệt kê · T1 N4 = Tập 1, Ngày 4",
      head: ["Dạng (tiếng Anh)", "Bạn phải làm gì", "Học kỹ ở"],
      rows: [
        ["1. **Multiple choice** ★ — chọn đáp án", "Chọn A/B/C/D. Biến thể: chọn **2–3 đáp án** trong một danh sách dài (mỗi đáp án đúng 1 điểm).", "T2 N10 (một đáp án) · T3 N13 (nhiều đáp án) · ôn T3 N11, T4 N7"],
        ["2. **True / False / Not Given** ★ (tên chính thức: **Identifying information**)", "So câu cho sẵn với **sự thật** trong bài: khớp → **True**, trái ngược → **False**, bài không nói tới → **Not Given**.", "**T1 N12** · ôn T2 N6, T3 N3, T4 N5, T5 N3"],
        ["3. **Yes / No / Not Given** (Identifying the writer's views)", "Giống dạng 2 nhưng so với **ý kiến của tác giả**, trả lời Yes / No / Not Given.", "T2 N20 · ôn T3 N23, T4 N5, T5 N9"],
        ["4. **Matching information** ★ — đoạn nào chứa thông tin", "Tìm xem một chi tiết nằm ở **đoạn nào** (A, B, C…). Một đoạn có thể dùng nhiều lần, có đoạn không dùng.", "T2 N16 · ôn T3 N19, T4 N19, T5 N15"],
        ["5. **Matching headings** — ghép tiêu đề cho đoạn", "Chọn tiêu đề (i, ii, iii…) nói đúng **ý chính cả đoạn**. Số tiêu đề luôn nhiều hơn số đoạn.", "T2 N12 · ôn T3 N5, T4 N3, T5 N5"],
        ["6. **Matching features** — ghép người / vật với thông tin", "Nối mỗi câu với **một người, nhà khoa học, năm, địa điểm…** trong danh sách (A, B, C…).", "**T1 N10** · ôn T3 N21, T4 N23, T5 N15"],
        ["7. **Matching sentence endings** — ghép nửa câu", "Ghép nửa đầu câu với nửa cuối đúng **nghĩa và ngữ pháp**, theo đúng ý bài.", "T2 N18 · ôn T4 N15"],
        ["8. **Sentence completion** ★ — hoàn thành câu", "Điền từ **lấy từ bài** vào chỗ trống, đúng giới hạn số từ và đúng ngữ pháp.", "**T1 N4** · ôn T2 N14, T3 N9, T5 N7"],
        ["9. **Summary completion** ★ — hoàn thành đoạn tóm tắt", "Hai kiểu: chọn từ trong **hộp cho sẵn** (A, B, C…) hoặc lấy **từ trong bài**.", "**T1 N14** (hộp từ) · T2 N2 (từ trong bài) · ôn T3 N9, N25"],
        ["10. **Note completion** — hoàn thành ghi chú", "Điền vào bản ghi chú gạch đầu dòng tóm lại một phần bài.", "T2 N4 · ôn T4 N11"],
        ["11. **Table completion** — hoàn thành bảng", "Điền vào các ô của một bảng sắp xếp thông tin trong bài.", "**T1 N8** · ôn T3 N15"],
        ["12. **Flow-chart completion** — hoàn thành sơ đồ quy trình", "Điền vào các bước nối bằng mũi tên của một quá trình.", "**T1 N6** · ôn T3 N17, T4 N17"],
        ["13. **Diagram label completion** ★ — gán nhãn sơ đồ", "Điền tên các bộ phận trên hình vẽ máy móc, công trình, cơ thể…", "T2 N22 · ôn T3 N17, T4 N17"],
        ["14. **Short-answer questions** ★ — trả lời ngắn", "Trả lời câu hỏi bằng từ lấy **nguyên văn** từ bài, đúng giới hạn (vd. NO MORE THAN TWO WORDS).", "T2 N8 · ôn T3 N7, N15, T5 N7"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: sách tách hai dạng thật ra là một",
      items: [
        "Sách liệt kê **Identifying Information** và **True / False / Not Given** như hai dạng khác nhau. Thực ra trong đề thi, “Identifying information” chính là **tên chính thức** của dạng True / False / Not Given (dạng 2 ở bảng trên).",
        "Dạng “anh em” của nó là **Identifying the writer’s views** — trả lời **Yes / No / Not Given** (dạng 3) — hỏi về **ý kiến của tác giả** chứ không phải sự thật. Hai dạng làm giống nhau, chỉ khác bộ chữ trả lời. Viết True vào câu hỏi Yes/No là **mất điểm**.",
        "Vì sao nơi khác nói “11 dạng” hay “16 dạng”? Trang chính thức của IELTS gộp 4 dạng điền (summary / note / table / flow-chart) làm một nhóm, nên 14 − 3 = 11; khoá này tách riêng vì **cách làm từng dạng khác nhau**. Tính thêm biến thể (Multiple choice nhiều đáp án, Summary có hộp từ) thì thành 16. Cùng một bộ dạng, chỉ khác cách đếm.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Tập 1 học 6 dạng Reading — mỗi ngày kỹ năng một dạng",
      caption: "Ba dạng **điền từ** (completion) dễ nhất nên học trước; **Matching features** và **True / False / Not Given** khó hơn nên để sau khi đã quen tìm từ khoá và từ đồng nghĩa. Ngày 14 quay lại dạng điền, lần này chọn từ trong hộp.",
      steps: [
        { label: "Ngày 4", sub: "Sentence completion" },
        { label: "Ngày 6", sub: "Flow-chart completion" },
        { label: "Ngày 8", sub: "Table completion" },
        { label: "Ngày 10", sub: "Matching features" },
        { label: "Ngày 12", sub: "True / False / Not Given" },
        { label: "Ngày 14", sub: "Summary completion (hộp từ)" },
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
      t: "sodo",
      kind: "mindmap",
      title: "4 nhóm từ khoá = 10 loại nhỏ",
      caption: "**Tên riêng** (3.1), **số liệu** (2.3) và **năm, ngày tháng** (nhóm 4) dễ “bắt” nhất khi lướt vì viết hoa hoặc là chữ số — hãy tìm chúng **trước**.",
      center: "**Keyword** (từ khoá)",
      branches: [
        { label: "1. Từ khoá chính", anh: "key", items: ["1.1 **Chủ đề** — solar power", "1.2 **Câu hỏi** — Why, When, According to", "1.3 **Định hướng** — next to, opposite"] },
        { label: "2. Từ khoá hỗ trợ", anh: "link", items: ["2.1 **Thay thế** (đồng nghĩa) — big → large", "2.2 **Ví dụ** — such as, for instance", "2.3 **Số liệu** — percent, half, rate"] },
        { label: "3. Tên riêng & địa điểm", anh: "round-pushpin", items: ["3.1 **Tên riêng** — Marie Curie, Tokyo", "3.2 **Địa điểm** — region, coast"] },
        { label: "4. Thời gian", anh: "spiral-calendar", items: ["4.1 **Thời điểm** — 2015, last month", "4.2 **Khoảng** — in the 1990s, for two decades"] },
      ],
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
    {
      t: "p",
      text: "Phần này sách chưa giảng kỹ: khi dùng từ khoá, mắt bạn đọc theo **hai kiểu** rất khác nhau. Người mới học hay đọc chậm từng chữ từ đầu đến cuối — đó là lý do không kịp giờ. Hãy tập đổi “số” đọc theo việc cần làm.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Skim và scan — hai kiểu đọc nhanh",
      caption: "Một câu hỏi thường cần **cả hai**: scan để tới đúng chỗ, rồi đọc kỹ 1–2 câu ở đó để đối chiếu. Không bao giờ đọc kỹ cả bài trước khi xem câu hỏi.",
      cols: [
        { title: "**Skim** /skɪm/ — đọc lướt lấy ý", anh: "eyes", items: ["Mục đích: biết **bài / đoạn nói về gì**", "Đọc tiêu đề, câu đầu mỗi đoạn, bỏ qua chi tiết", "~2–3 phút cho cả bài", "Dùng cho: Matching headings, câu hỏi ý chính"] },
        { title: "**Scan** /skæn/ — dò tìm chi tiết", anh: "magnifying-glass-tilted-left", items: ["Mục đích: tìm **một chi tiết** cụ thể", "Mắt chạy nhanh, chỉ dừng ở **từ khoá**: tên riêng, số, năm", "Vài giây đến 1 phút cho mỗi câu hỏi", "Dùng cho: điền từ, Short answer, Matching features"] },
      ],
    },
    { t: "rule", formula: "Từ khoá câu hỏi → quét bài → đọc kỹ 1–2 câu quanh đó → đối chiếu", vi: "Tên riêng, số, năm dễ tìm nhất — **tìm chúng trước**. Bài hay dùng **từ đồng nghĩa** thay cho chữ trong câu hỏi." },
    {
      t: "sodo",
      kind: "flow",
      title: "2 bước tìm đáp án bằng từ khoá — áp cho mọi dạng câu hỏi",
      caption: "Bước 1 làm trên **câu hỏi**, bước 2 làm trên **bài đọc**. Mục 7 ngay dưới làm thử đủ 2 bước với một câu hỏi thật.",
      steps: [
        { label: "Bước 1a · Gạch **2–4 từ khoá** trong câu hỏi", sub: "Bỏ the, a, is, do… · ưu tiên tên riêng, số, năm" },
        { label: "Bước 1b · Đoán **loại đáp án**", sub: "When → thời gian · What percentage → số % · Which country → tên nước" },
        { label: "Bước 2a · **Scan** bài tìm từ khoá hoặc từ đồng nghĩa", sub: "produced the most ≈ the largest producer" },
        { label: "Bước 2b · Đọc kỹ 1–2 câu quanh đó, **đối chiếu** rồi chọn", sub: "Đủ khớp mới chọn · cảnh giác đáp án lặp y nguyên chữ trong bài" },
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
        { q: "The museum is **opposite** the train station.", options: ["Địa điểm", "Tên riêng", "Định hướng"], correct: 2, why: "“opposite” (đối diện) chỉ **vị trí** → từ khoá định hướng." },
        { q: "About **40 percent** of students work part-time.", options: ["Thời điểm cụ thể", "Số liệu", "Ví dụ"], correct: 1, why: "Phần trăm là **số liệu**." },
        { q: "The bridge was built **in the 1960s**.", options: ["Số liệu", "Thời điểm cụ thể", "Khoảng thời gian"], correct: 2, why: "“in the 1960s” là cả một **thập kỷ** → khoảng thời gian." },
        { q: "Some fruits, **such as** mangoes, grow well here.", options: ["Ví dụ", "Thay thế", "Chủ đề"], correct: 0, why: "“such as” báo hiệu **ví dụ** sắp đến." },
        { q: "**Why** do many young people move to big cities?", options: ["Câu hỏi", "Định hướng", "Chủ đề"], correct: 0, why: "“Why” cho biết cần tìm **lý do** → từ khoá câu hỏi." },
        { q: "The report was written by **UNESCO**.", options: ["Địa điểm", "Tên riêng", "Ví dụ"], correct: 1, why: "Tên một **tổ chức** cụ thể, viết hoa → tên riêng." },
        { q: "Farmers in this **region** grow rice.", options: ["Tên riêng", "Định hướng", "Địa điểm"], correct: 2, why: "“region” (vùng) là từ chung chỉ nơi chốn → địa điểm." },
        { q: "Question: “Prices **went up**.” — Bài đọc: “Prices **increased**.”", options: ["Thay thế", "Số liệu", "Câu hỏi"], correct: 0, why: "“went up” và “increased” cùng nghĩa “tăng” → từ khoá **thay thế** (đồng nghĩa)." },
      ],
    },

    { t: "h", text: "9. Từ vựng về bài thi IELTS (16 từ)" },
    {
      t: "p",
      text: "Phần này sách chưa có. Đây là những từ **đề thi và lời giảng dùng liên tục** trong cả khoá — hiểu chúng thì đọc hướng dẫn đề không bị khựng. Các từ này cũng được đưa vào **thẻ nhớ** và **tra từ** của khoá. Bấm 🔊 nghe, đọc to theo, rồi bấm **Che nghĩa** để tự kiểm tra.",
    },
    {
      t: "vocab",
      items: [
        { w: "passage", pos: "n", ipa: "/ˈpæsɪdʒ/", vi: "bài đọc, đoạn văn", ex: "Each Reading test has three long passages.", exVi: "Mỗi bài thi Reading có ba bài đọc dài.", more: "**Reading Passage 1 / 2 / 3** · **a short passage** (một đoạn ngắn) · nghĩa khác: hành lang, lối đi", anh: "open-book" },
        { w: "heading", pos: "n", ipa: "/ˈhedɪŋ/", vi: "tiêu đề (của một đoạn / một mục)", ex: "Choose the correct heading for each paragraph.", exVi: "Chọn tiêu đề đúng cho mỗi đoạn.", more: "Dạng **Matching headings** · khác **headline** (tít báo) · gốc: **head** (đầu)" },
        { w: "keyword", pos: "n", ipa: "/ˈkiːwɜːd/", vi: "từ khoá", ex: "Underline the keywords in the question before you read.", exVi: "Gạch chân từ khoá trong câu hỏi trước khi đọc bài.", more: "Viết liền **keyword** hoặc rời **key word** đều đúng · **underline / identify / find** keywords", anh: "key" },
        { w: "synonym", pos: "n", ipa: "/ˈsɪnənɪm/", vi: "từ đồng nghĩa", ex: "“Large” is a synonym for “big”.", exVi: "“Large” là từ đồng nghĩa của “big”.", more: "a synonym **for / of** sth · tính từ **synonymous** /sɪˈnɒnɪməs/ · trái nghĩa: **antonym** (từ trái nghĩa)" },
        { w: "paraphrase", pos: "v, n", ipa: "/ˈpærəfreɪz/", vi: "diễn đạt lại bằng từ khác; câu diễn đạt lại", ex: "The passage often paraphrases the words in the question.", exVi: "Bài đọc thường diễn đạt lại các từ trong câu hỏi.", more: "Trọng âm âm đầu **PA**-ra-phrase · **paraphrase the question** (mở bài Writing) · khác **copy** (chép nguyên)" },
        { w: "skim", pos: "v", ipa: "/skɪm/", vi: "đọc lướt (lấy ý chính)", ex: "Skim the passage first to see what it is about.", exVi: "Đọc lướt bài trước để biết nó nói về gì.", more: "**skim (through) a text** · quá khứ gấp đôi m: **skimmed** · V-ing: **skimming**", anh: "eyes" },
        { w: "scan", pos: "v", ipa: "/skæn/", vi: "đọc dò tìm (một chi tiết)", ex: "Scan the text for names and numbers.", exVi: "Dò bài để tìm tên riêng và con số.", more: "**scan a text for** sth · quá khứ: **scanned** · nghĩa khác: quét (mã QR, tài liệu)", anh: "magnifying-glass-tilted-left" },
        { w: "instructions", pos: "n", ipa: "/ɪnˈstrʌkʃnz/", vi: "lời hướng dẫn (của đề)", ex: "Read the instructions carefully: some questions allow only one word.", exVi: "Đọc kỹ hướng dẫn: có câu chỉ cho phép một từ.", more: "Thường **số nhiều** · **follow the instructions** (làm theo hướng dẫn) · động từ: **instruct**", anh: "clipboard" },
        { w: "band", pos: "n", ipa: "/bænd/", vi: "mức điểm IELTS (thang 0–9)", ex: "She needs band 6.5 to study in Australia.", exVi: "Cô ấy cần band 6.5 để du học Úc.", more: "**band score** · **overall band** (điểm tổng) · **get / achieve / reach band 7**" },
        { w: "criterion", pos: "n", ipa: "/kraɪˈtɪəriən/", vi: "tiêu chí (chấm điểm)", ex: "Lexical Resource is one criterion in Writing.", exVi: "Vốn từ là một tiêu chí trong bài Viết.", more: "Số nhiều bất quy tắc: **criteria** /kraɪˈtɪəriə/ (~~criterias~~) · **four criteria** · **assessment criteria**" },
        { w: "essay", pos: "n", ipa: "/ˈeseɪ/", vi: "bài luận", ex: "In Task 2 you write an essay of at least 250 words.", exVi: "Ở Task 2 bạn viết một bài luận ít nhất 250 từ.", more: "**write / plan an essay** · **opinion essay** (bài nêu ý kiến) · **discussion essay** (bài thảo luận hai mặt)", anh: "writing-hand" },
        { w: "thesis", pos: "n", ipa: "/ˈθiːsɪs/", vi: "luận điểm chính (câu nêu quan điểm ở mở bài)", ex: "Your thesis should answer the question directly.", exVi: "Luận điểm của bạn nên trả lời thẳng câu hỏi của đề.", more: "**thesis statement** · số nhiều: **theses** /ˈθiːsiːz/ · nghĩa khác: luận văn (master’s thesis)" },
        { w: "examiner", pos: "n", ipa: "/ɪɡˈzæmɪnə(r)/", vi: "giám khảo", ex: "The examiner records the whole Speaking test.", exVi: "Giám khảo ghi âm toàn bộ bài thi Nói.", more: "Họ từ: **examine** (v) · **exam / examination** (n) · **examinee** = thí sinh (ít dùng hơn candidate)" },
        { w: "candidate", pos: "n", ipa: "/ˈkændɪdət/", vi: "thí sinh; ứng viên", ex: "Each candidate has one minute to prepare for Part 2.", exVi: "Mỗi thí sinh có một phút chuẩn bị cho Part 2.", more: "Cũng đọc /ˈkændɪdeɪt/ · nghĩa khác: **ứng viên** (job candidate, ứng viên tranh cử)", anh: "student" },
        { w: "cue card", pos: "n", ipa: "/ˈkjuː kɑːd/", vi: "thẻ chủ đề (Speaking Part 2)", ex: "The cue card lists three or four points to talk about.", exVi: "Thẻ chủ đề liệt kê ba hoặc bốn ý để nói.", more: "Còn gọi **task card** · **cue** /kjuː/ = gợi ý, tín hiệu (đọc giống chữ Q)" },
        { w: "fluency", pos: "n", ipa: "/ˈfluːənsi/", vi: "sự trôi chảy", ex: "Long pauses can lower your fluency score.", exVi: "Ngập ngừng lâu có thể làm giảm điểm trôi chảy.", more: "Tiêu chí **Fluency and Coherence** (Speaking) · tính từ **fluent** · **speak English fluently**" },
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
    {
      t: "recap",
      items: [
        "Task 2 = bài luận **ít nhất 250 từ** trong **40 phút**, chiếm **2/3 điểm Writing**.",
        "Khung **4–5 đoạn**: Mở bài (paraphrase + thesis) → 2 thân bài (ý chính → giải thích → ví dụ) → Kết bài.",
        "**4 tiêu chí**, mỗi cái 25%: Task Response · Coherence & Cohesion · Lexical Resource · Grammar.",
        "Điểm = **trung bình 4 tiêu chí**, báo theo bước 0.5.",
      ],
    },
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
        ["Thân bài 1 (Body 1)", "Nêu **ý chính thứ nhất** → **giải thích** (vì sao ý này đúng, nó **ủng hộ luận điểm** thế nào) → đưa **bằng chứng hoặc ví dụ** cụ thể.", "4–6 câu, ~90–100 từ"],
        ["Thân bài 2 (Body 2)", "Nêu **ý chính thứ hai**, làm giống thân bài 1: ý chính → giải thích → ví dụ.", "4–6 câu, ~90–100 từ"],
        ["(Thân bài 3 — nếu cần)", "Có thể thêm đoạn khi lập luận phức tạp. Người mới học nên giữ **2 đoạn** để kịp giờ và viết sâu.", "Tuỳ chọn"],
        ["Kết bài (Conclusion)", "**Tóm tắt** các ý chính và **nhắc lại luận điểm** (bằng từ khác). **Không đưa thông tin mới** vào kết bài.", "1–2 câu, ~30–40 từ"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung bài luận Task 2 — 4 đoạn, ~270 từ",
      caption: "Mỗi ô là **một đoạn văn** (xuống dòng giữa các đoạn). Thân bài là phần dài nhất và quyết định điểm Task Response.",
      steps: [
        { label: "**Mở bài** · ~45 từ", sub: "Paraphrase đề + **thesis** (trả lời thẳng câu hỏi)" },
        { label: "**Thân bài 1** · ~95 từ", sub: "Firstly, ý chính → giải thích → For example, …" },
        { label: "**Thân bài 2** · ~95 từ", sub: "Secondly, ý chính → giải thích → For instance, …" },
        { label: "**Kết bài** · ~35 từ", sub: "In conclusion, tóm 2 ý + nhắc lại thesis · **không** ý mới" },
      ],
    },
    { t: "rule", formula: "Mở bài (paraphrase + thesis) → Thân bài 1 → Thân bài 2 → Kết bài", vi: "Mỗi thân bài: **ý chính → giải thích → ví dụ**. Kết bài **không** thêm ý mới." },
    {
      t: "note",
      title: "Ghi nhớ: giải thích trước hay ví dụ trước?",
      items: [
        "Cả hai thứ tự **ý chính → giải thích → ví dụ** và **ý chính → ví dụ → giải thích** đều được giám khảo chấp nhận — điều quan trọng là đoạn có **đủ cả ba**.",
        "Khoá này dùng thống nhất **ý chính → giải thích → ví dụ** (như Ngày 1 và dàn ý mẫu ngay dưới): người mới viết dễ giữ mạch hơn, và ví dụ cụ thể ở cuối làm đoạn văn “chốt” chắc hơn.",
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
        ["Thân bài 1 — giải thích", "This is because their brains are still flexible, so they can copy the sounds they hear without much effort.", "Đó là vì não của trẻ còn linh hoạt, nên trẻ có thể bắt chước những âm nghe được mà không mất nhiều công sức."],
        ["Thân bài 1 — ví dụ", "For example, many Vietnamese children who start English at six can pronounce it almost like native speakers.", "Ví dụ, nhiều trẻ Việt Nam học tiếng Anh từ sáu tuổi có thể phát âm gần như người bản xứ."],
        ["Thân bài 2 — ý chính", "Secondly, an early start gives children more opportunities in the future.", "Thứ hai, bắt đầu sớm cho trẻ nhiều cơ hội hơn trong tương lai."],
        ["Thân bài 2 — giải thích", "Most universities and international companies require a good level of English, and children who start early usually reach that level sooner.", "Hầu hết trường đại học và công ty quốc tế đòi hỏi trình độ tiếng Anh tốt, và trẻ bắt đầu sớm thường đạt trình độ đó sớm hơn."],
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
        ["**C. Lexical Resource (LR)** — Vốn từ vựng", "Bạn dùng từ có **đa dạng và chính xác** không?", "Dùng từ **đúng ngữ cảnh** · có cụm từ tự nhiên (collocation — từ hay đi cùng nhau, vd: **make a decision**) · biết đổi từ đồng nghĩa · chính tả đúng", "Lặp một từ nhiều lần · dùng từ “to tát” sai nghĩa · sai chính tả · sai từ loại (~~a success person~~ → **a successful person**)"],
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
        { q: "Câu nào nên nằm ở MỞ BÀI?", options: ["Một ví dụ chi tiết về gia đình bạn", "Một ý mới chưa nói ở đâu", "Luận điểm (thesis) trả lời thẳng câu hỏi của đề"], correct: 2, why: "Mở bài = paraphrase đề + **thesis**. Ví dụ để ở thân bài, ý mới không đưa vào kết bài." },
        { q: "Bài viết dùng “Firstly, Secondly, However” hợp lý và chia đoạn rõ ràng. Tiêu chí nào được lợi nhất?", options: ["Coherence and Cohesion", "Lexical Resource", "Task Response"], correct: 0, why: "Từ nối và cách chia đoạn thuộc **Coherence and Cohesion** (mạch lạc và liên kết)." },
        { q: "Bài lặp từ “good” 12 lần và sai chính tả nhiều. Tiêu chí nào bị ảnh hưởng nhất?", options: ["Grammatical Range and Accuracy", "Coherence and Cohesion", "Lexical Resource"], correct: 2, why: "Lặp từ và chính tả thuộc **Lexical Resource** (vốn từ)." },
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
  goal: "Nắm 3 phần của bài thi Nói (thời gian, giám khảo làm gì), nghe câu trả lời mẫu cả 3 Part và tự ghi âm trả lời Part 1.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      items: [
        "Speaking **11–14 phút**, nói trực tiếp với giám khảo, **3 phần**.",
        "**Part 1** (4–5 phút): câu hỏi quen thuộc · **Part 2** (1 phút chuẩn bị + nói 1–2 phút theo cue card) · **Part 3** (4–5 phút): thảo luận sâu hơn.",
        "Chấm **4 tiêu chí**: trôi chảy · từ vựng · ngữ pháp · phát âm.",
        "Không bao giờ trả lời cụt một chữ — luôn **trả lời + lý do + ví dụ**.",
      ],
    },
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
      t: "sodo",
      kind: "compare",
      title: "3 Part đặt cạnh nhau — độ khó tăng dần",
      caption: "Càng về sau câu trả lời càng **dài** và càng **trừu tượng**: Part 1 nói về **bạn**, Part 2 **kể một chuyện**, Part 3 bàn về **xã hội nói chung**.",
      cols: [
        { title: "**Part 1** · 4–5 phút", anh: "speech-balloon", items: ["Câu hỏi **quen thuộc**: quê, học, việc, sở thích", "Khoảng 10–12 câu, 2–3 chủ đề", "Mỗi câu trả lời **2–3 câu** (15–25 giây)", "Thì hay dùng: **hiện tại đơn**"] },
        { title: "**Part 2** · 3–4 phút", anh: "spiral-notepad", items: ["Một **cue card** + giấy bút", "**1 phút** chuẩn bị (ghi từ khoá)", "Nói liền **1–2 phút**, không bị ngắt", "Thì hay dùng: **quá khứ** khi kể chuyện"] },
        { title: "**Part 3** · 4–5 phút", anh: "thinking-face", items: ["Câu hỏi **sâu, rộng** nối từ chủ đề Part 2", "Ý kiến, so sánh, nguyên nhân, xu hướng", "Mỗi câu trả lời **30–60 giây**", "Nói về **người nói chung**, không chỉ bản thân"] },
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
      t: "sodo",
      kind: "flow",
      title: "Công thức một câu trả lời Part 1 — 3 nhịp",
      caption: "Ví dụ câu hỏi: **Do you like music?** Ba câu ngắn, khoảng 20 giây — đủ để giám khảo chấm trôi chảy mà không bị coi là học thuộc.",
      steps: [
        { label: "1. **Trả lời thẳng**", sub: "Yes, I really **like** music." },
        { label: "2. **Lý do / chi tiết**", sub: "It **helps** me relax after a long day at school." },
        { label: "3. **Ví dụ nhỏ**", sub: "For example, I usually **listen** to pop songs on the bus." },
      ],
    },
    {
      t: "canh",
      anh: ["woman-teacher", "woman-student", "studio-microphone"],
      caption: "Phòng thi Speaking: chỉ có **giám khảo Sarah** và **thí sinh Minh Anh**, một bàn, một máy ghi âm. Sarah mở đầu bằng chào hỏi, hỏi tên, rồi chuyển sang các câu Part 1 về quê và sở thích.",
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
      t: "canh",
      anh: ["spiral-notepad", "stopwatch", "books"],
      caption: "Sarah đưa cue card “**Describe a book you have read recently**” cùng giấy bút. Minh Anh có **1 phút** ghi từ khoá, rồi nói liền khoảng **2 phút** theo thứ tự các gợi ý trên thẻ.",
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
      t: "canh",
      anh: ["woman-teacher", "thinking-face", "mobile-phone"],
      caption: "Sang Part 3, Sarah hỏi rộng hơn về **thói quen đọc của người trẻ** và **công nghệ**. Minh Anh không kể chuyện riêng nữa mà nêu ý kiến về xã hội nói chung.",
    },
    {
      t: "dialogue",
      title: "Part 3 mẫu (khoảng band 6) — phần này sách chưa có",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do young people in your country read as much as older people?", vi: "Người trẻ ở nước bạn có đọc sách nhiều như người lớn tuổi không?" },
        { who: "Candidate", role: "candidate", text: "I'd say they read just as much, but in a different way. Older people usually read newspapers and printed books, while young people read a lot on their phones, for example news articles and comics.", vi: "Tôi cho là họ đọc nhiều không kém, nhưng theo cách khác. Người lớn tuổi thường đọc báo và sách in, còn người trẻ đọc nhiều trên điện thoại, ví dụ bài báo và truyện tranh." },
        { who: "Examiner", role: "examiner", text: "Should schools make students read more books? Why?", vi: "Trường học có nên bắt học sinh đọc nhiều sách hơn không? Vì sao?" },
        { who: "Candidate", role: "candidate", text: "That's an interesting question. I think schools should encourage reading, but not force it. If students can choose books they enjoy, they read more. For instance, my school has a small library corner in every classroom, and many of my friends started reading because of it.", vi: "Câu hỏi thú vị đấy. Tôi nghĩ trường nên khuyến khích đọc, nhưng không ép. Nếu học sinh được chọn sách mình thích, các em sẽ đọc nhiều hơn. Chẳng hạn, trường tôi có một góc thư viện nhỏ trong mỗi lớp, và nhiều bạn của tôi bắt đầu đọc sách nhờ nó." },
      ],
    },
    {
      t: "note",
      title: "Vì sao câu trả lời Part 3 trên ổn?",
      items: [
        "Mở bằng cụm “câu giờ” tự nhiên: **I'd say…**, **That's an interesting question. I think…**",
        "Có **so sánh** (older people… while young people…) và **ví dụ** cụ thể (a library corner in every classroom) — đúng khung **ý kiến → lý do → ví dụ**.",
        "Nói về **người nói chung** (young people, students), chỉ dùng chuyện bản thân làm ví dụ minh hoạ.",
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
        { q: "Trong Part 2, bạn nên nói trong bao lâu?", options: ["15 giây", "5 phút", "1–2 phút"], correct: 2, why: "Nói **1–2 phút**, cố gắng dùng đủ 2 phút." },
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
    { t: "h", text: "Thêm: Luyện phát âm — câu trả lời Part 1, giữ âm cuối" },
    {
      t: "phatam",
      id: "d2-phat-am",
      title: "Luyện phát âm — đọc câu trả lời Part 1",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng dòng đó. Xanh là đúng, vàng là gần đúng, đỏ là cần sửa. Giữ rõ âm CUỐI mỗi từ (name, live, student, books) — lỗi người Việt hay mắc nhất ở Part 1.",
      items: [
        { text: "My name is Lan.", ipa: "maɪ neɪm ɪz læn", vi: "/m/ cuối trong name" },
        { text: "I live in a big city.", ipa: "aɪ lɪv ɪn ə bɪɡ sɪti", vi: "/v/ cuối trong live, /ɡ/ trong big" },
        { text: "I'm a student.", ipa: "aɪm ə stjuːdənt", vi: "/t/ cuối trong student" },
        { text: "I like reading books.", ipa: "aɪ laɪk riːdɪŋ bʊks", vi: "/k/ trong like, /ks/ trong books" },
        { text: "I usually get up at six.", ipa: "aɪ juːʒuəli ɡet ʌp ət sɪks", vi: "/ks/ trong six" },
        { text: "At the weekend, I often play sports with my friends.", ipa: "ət ðə wiːkend aɪ ɒfn pleɪ spɔːts wɪð maɪ frendz", vi: "/ts/ trong sports, /dz/ trong friends" },
      ],
    },
  ],
};

/* ───────────────────────── Homework ───────────────────────── */

const D2_HOMEWORK: Lesson = {
  id: "d2-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 2 — Tìm từ khoá",
  goal: "Luyện 5 bài tìm từ khoá như sách, rồi củng cố: 5 câu trả lời ngắn, 10 câu nhận diện loại từ khoá, 6 câu đoán trước từ thay thế và 5 câu dịch dùng từ vựng bài thi — tổng 37 câu.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập gồm 5 bài như sách",
      items: [
        "Mỗi bài: đọc câu hỏi → **gạch từ khoá** → đọc đoạn văn → **tìm từ khoá tương ứng** → chọn đáp án.",
        "Cuối mỗi bài có **bản dịch** — làm xong mới mở.",
        "Phần thêm: **5 câu trả lời ngắn** (tối đa HAI TỪ và/hoặc MỘT SỐ) · **10 câu** “từ khoá loại nào” · **6 câu** đoán trước từ thay thế · **5 câu dịch** dùng từ vựng bài thi (mục 9 bài Reading).",
      ],
    },
    {
      t: "p",
      text: "Mỗi bài gồm **một câu hỏi**, **một đoạn văn tiếng Anh** và các **yêu cầu**. Hãy làm theo đúng 2 bước đã học: **(1) tìm từ khoá**, **(2) so sánh, đối chiếu với đoạn văn**. Cố làm trước khi xem bản dịch ở cuối mỗi bài.",
    },

    /* Bài 1 — nguyên nhân (từ khoá chính + hỗ trợ) */
    { t: "h", text: "Bài tập 1" },
    {
      t: "p",
      text: "**Câu hỏi:** What was the main cause of the Asian financial crisis in 1997? **(Nguyên nhân chính của cuộc khủng hoảng tài chính châu Á năm 1997 là gì?)**",
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
          options: ["What · was · the", "Thailand · baht · dollar", "main cause · Asian financial crisis · 1997"],
          correct: 2,
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
            "The sudden fall in value of the Thai baht.",
            "Foreign investors took their money out of the region.",
            "The crisis spread to Indonesia and South Korea.",
          ],
          correct: 0,
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
      text: "**Câu hỏi:** Which animal is most threatened by forest loss on the island of Borneo? **(Loài vật nào bị đe doạ nhiều nhất bởi nạn mất rừng trên đảo Borneo?)**",
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
            "Chủ đề: palm oil · Tên riêng: orangutan",
            "Chủ đề: island · Tên riêng: Which",
            "Chủ đề: animal, forest loss · Tên riêng: Borneo",
          ],
          correct: 2,
          why: "Chủ đề của câu hỏi là **động vật** bị ảnh hưởng bởi **mất rừng** (forest loss). **Borneo** viết hoa, là tên riêng của hòn đảo. “palm oil, orangutan” nằm trong đoạn văn, không nằm trong câu hỏi.",
        },
        {
          q: "2. Từ khoá quan trọng nào trong đoạn văn cho ra đáp án, và đáp án là gì?",
          options: [
            "“in the greatest danger as the forests disappear” → the orangutan",
            "“less serious” → the sun bear",
            "“home to many rare animals” → the pygmy elephant",
          ],
          correct: 0,
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
      text: "**Câu hỏi:** In which year did the first public steam railway open? **(Tuyến đường sắt hơi nước công cộng đầu tiên mở cửa vào năm nào?)**",
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
      text: "**Câu hỏi:** What percentage of all the water on Earth is fresh water? **(Nước ngọt chiếm bao nhiêu phần trăm tổng lượng nước trên Trái Đất?)**",
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
          options: ["all the water", "What percentage", "on Earth"],
          correct: 1,
          why: "“**What percentage**” (bao nhiêu phần trăm) cho biết đáp án là **một con số phần trăm**. Vì vậy khi lướt bài, mắt bạn chỉ cần tìm ký hiệu **%** hoặc chữ **percent**.",
        },
        {
          q: "2. Từ khoá tương ứng trong đoạn văn cho ra đáp án là gì?",
          options: ["“97% is salt water”", "“two thirds of it is frozen”", "“about 3% of it is fresh water”"],
          correct: 2,
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
      text: "**Câu hỏi:** What method do scientists use to find out the age of ancient wooden objects? **(Các nhà khoa học dùng phương pháp nào để xác định tuổi của những đồ vật bằng gỗ cổ xưa?)**",
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
            "“an old wooden boat or tool”",
            "“rely on a technique called radiocarbon dating”",
            "“up to around 50,000 years old”",
          ],
          correct: 1,
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
        { q: "Bài 1: The 1997 crisis was mainly caused by the sudden fall in value of the Thai ___ .", answers: ["baht", "currency"] },
        { q: "Bài 2: Which animal is most threatened by forest loss on Borneo? → the ___", answers: ["orangutan", "orangutans"] },
        { q: "Bài 3: In which year did the first public steam railway open? → ___", answers: ["1825", "September 1825", "in 1825"] },
        { q: "Bài 4: What percentage of all the water on Earth is fresh water? → about ___", answers: ["3%", "3 %", "3 percent", "3 per cent", "three percent", "three per cent"] },
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
        "Chữ đã in sẵn trước chỗ trống (the, about, Thai…) thì **không viết lại**: “about ___” → viết **3%**, không viết ~~about 3%~~.",
      ],
    },

    /* Phần thêm: nhận diện loại từ khoá (10 câu) + dịch (5 câu) — để đủ khuôn ≥ 30 câu */
    { t: "h", text: "Thêm: Từ khoá này thuộc loại nào? (10 câu)" },
    {
      t: "p",
      text: "Phần này sách chưa có. Mỗi câu in đậm **một** từ khoá — hãy gọi đúng tên loại của nó trong 10 loại đã học (mục 5 bài Reading). Nhận ra loại từ khoá là biết ngay mắt phải “bắt” thứ gì khi scan bài.",
    },
    {
      t: "mcq",
      id: "d2-bt-loai-tu-khoa",
      title: "Từ in đậm thuộc loại từ khoá nào? (10 câu)",
      items: [
        { q: "The new hospital is **between** the park and the river.", options: ["Địa điểm", "Định hướng", "Tên riêng"], correct: 1, why: "“between” (ở giữa) chỉ **vị trí tương đối** → từ khoá **định hướng**." },
        { q: "**Over the last ten years**, the number of cyclists has doubled.", options: ["Khoảng thời gian", "Thời điểm cụ thể", "Số liệu"], correct: 0, why: "Một **quãng** kéo dài mười năm → **khoảng thời gian**. Chữ “ten” nằm trong cụm thời gian, không phải số liệu thống kê." },
        { q: "Many cities, **for instance** Singapore, have strict rules on litter.", options: ["Thay thế", "Tên riêng", "Ví dụ"], correct: 2, why: "“for instance” = “for example” → báo hiệu **ví dụ** sắp đến." },
        { q: "Most **renewable energy** in the country comes from the wind.", options: ["Chủ đề", "Địa điểm", "Câu hỏi"], correct: 0, why: "“renewable energy” (năng lượng tái tạo) là **chủ đề** chính của câu." },
        { q: "The study was carried out by **Oxford University**.", options: ["Địa điểm", "Ví dụ", "Tên riêng"], correct: 2, why: "Tên một **tổ chức cụ thể**, viết hoa → **tên riêng**. “Địa điểm” chỉ dùng cho từ chung như city, region." },
        { q: "**How** do bees tell other bees where the flowers are?", options: ["Định hướng", "Câu hỏi", "Chủ đề"], correct: 1, why: "“How” cho biết cần tìm **cách thức** → từ khoá **câu hỏi**." },
        { q: "The museum opened on **12 May 2019**.", options: ["Số liệu", "Khoảng thời gian", "Thời điểm cụ thể"], correct: 2, why: "Một **ngày cụ thể** → **thời điểm cụ thể**, không phải khoảng thời gian." },
        { q: "Almost **a quarter** of the forest was destroyed by fire.", options: ["Số liệu", "Thời điểm cụ thể", "Thay thế"], correct: 0, why: "“a quarter” (một phần tư) là **tỉ lệ** → **số liệu**." },
        { q: "Most tea in Vietnam is grown in **mountainous areas**.", options: ["Tên riêng", "Địa điểm", "Định hướng"], correct: 1, why: "“mountainous areas” (vùng núi) là từ chung chỉ nơi chốn, không viết hoa → **địa điểm**." },
        { q: "Question: “Young people **prefer** short videos.” — Bài đọc: “Teenagers **favour** short clips.”", options: ["Chủ đề", "Thay thế", "Ví dụ"], correct: 1, why: "“prefer” và “favour” cùng nghĩa “thích hơn” (cả young people → teenagers, videos → clips) → từ khoá **thay thế**." },
      ],
    },

    { t: "h", text: "Thêm: Đoán trước từ thay thế (6 câu)" },
    {
      t: "p",
      text: "Phần này sách chưa có. Trước khi dò bài, hãy chia từ khoá của câu hỏi thành **hai nhóm**. Nhóm ==giữ nguyên==: **tên riêng, con số, năm, ngày tháng, thuật ngữ chuyên ngành** — bài đọc gần như luôn viết **y hệt**, nên quét bằng mắt rất nhanh. Nhóm ==sẽ bị đổi==: động từ, tính từ, danh từ thường (cause, increase, popular, children…) — bài đọc thường viết bằng **từ khác cùng nghĩa**. Với nhóm này, hãy **tự nghĩ trước 2–3 từ** bài có thể dùng, rồi mới quét.",
    },
    {
      t: "table",
      caption: "Ví dụ: một câu hỏi, hai nhóm từ khoá",
      head: ["Câu hỏi", "Giữ nguyên (quét y hệt)", "Sẽ bị đổi → đoán trước"],
      rows: [
        ["Why did **Japan** start building **fast trains** in **1959**?", "Japan · 1959", "fast trains → high-speed rail · bullet trains · express"],
        ["How many **students** at **Lincoln College** **failed** the test?", "Lincoln College", "students → learners · pupils; failed → did not pass · were unsuccessful"],
        ["**Most** people in **Norway** **prefer** electric cars.", "Norway", "most → the majority · over half; prefer → favour · would rather choose"],
      ],
    },
    {
      t: "mcq",
      id: "d2-bt-doan-thay-the",
      title: "Bài đọc nhiều khả năng viết từ in đậm thành gì? (6 câu)",
      items: [
        { q: "Câu hỏi: “Why are **young people** leaving the countryside?”", options: ["young peoples", "the younger generation", "the elderly"], correct: 1, why: "**young people** (người trẻ) = **the younger generation** (thế hệ trẻ). “the elderly” là người già — trái nghĩa. “peoples” sai ngữ pháp." },
        { q: "Câu hỏi: “The museum **became more popular** after 2010.” — năm **2010** thuộc nhóm nào?", options: ["Giữ nguyên — quét đúng “2010”", "Sẽ bị đổi — bài viết “two thousand and ten”", "Bỏ qua — năm không quan trọng"], correct: 0, why: "**Năm, con số, tên riêng** gần như luôn giữ nguyên. Đây là mỏ neo nhanh nhất để tìm đúng đoạn. Từ cần đoán là **became more popular** (→ attracted more visitors…)." },
        { q: "Câu hỏi: “The new law **reduced** traffic accidents.”", options: ["increased", "led to a fall in", "recorded"], correct: 1, why: "**reduced** (làm giảm) = **led to a fall in** (dẫn tới sự giảm). “increased” trái nghĩa; “recorded” (ghi lại) là ý khác." },
        { q: "Câu hỏi: “Doctors **advise** people to **eat less sugar**.”", options: ["recommend cutting down on sugar", "advice people sugar", "sell sugar to people"], correct: 0, why: "**advise** = **recommend**; **eat less** = **cut down on** (ăn bớt). Phương án 2 sai ngữ pháp và mất nghĩa “less”." },
        { q: "Câu hỏi: “The bridge was built **ten years ago**.”", options: ["a century ago", "a decade ago", "ten centuries ago"], correct: 1, why: "**ten years** = **a decade** (một thập kỷ). **a century** = 100 năm. Số liệu hay bị viết thành chữ như vậy — học thêm ở Tập 2 Ngày 8." },
        { q: "Câu hỏi: “**About half** of the workers **walk** to the factory.”", options: ["Exactly 50 workers go by bus.", "Roughly 50% of the staff go there on foot.", "Half of the factories are near the workers."], correct: 1, why: "**about half** = **roughly 50%**; **workers** = **staff**; **walk** = **go on foot**. Phương án 1 đổi “đi bộ” thành “xe buýt”; phương án 3 đảo chủ ngữ." },
      ],
    },
    {
      t: "note",
      title: "Mẹo: chỉ học từ ở chỗ “có điểm”",
      items: [
        "Làm xong bài, **đừng tra mọi từ lạ** trong đoạn văn. Chỉ ghi lại các cặp **từ trong câu hỏi ↔ từ trong câu chứa đáp án** (vd main cause ↔ mainly caused by). Đó là những cặp đề thi hay dùng lại.",
        "Ghi theo dạng hai cột trong vở: **Câu hỏi | Bài đọc**. Tập 2 Ngày 8 sẽ biến vở này thành **sổ paraphrase** dùng sau mỗi bài đọc.",
      ],
    },

    { t: "h", text: "Thêm: Dịch sang tiếng Anh — từ vựng bài thi (5 câu)" },
    {
      t: "quiz",
      id: "d2-bt-dich",
      title: "Dịch sang tiếng Anh — dùng từ gợi ý (5 câu)",
      kind: "translate",
      grammar: "Thì hiện tại đơn (Ngày 1): chủ ngữ he / she / it / danh từ số ít (the examiner, the passage) → động từ thêm -s/-es. Từ vựng ở mục 9 bài Reading.",
      items: [
        { q: "Tôi gạch chân từ khoá trong mỗi câu hỏi.", hint: "underline, keyword, each question", answers: ["I underline the keywords in each question.", "I underline keywords in each question.", "I underline the keywords in every question.", "I underline keywords in every question.", "I underline the key words in each question.", "I underline key words in each question.", "I underline the keyword in each question.", "I underline the keywords in each of the questions.", "I underline the keywords of each question."] },
        { q: "Bài đọc thường dùng từ đồng nghĩa.", hint: "the passage, often, synonym", answers: ["The passage often uses synonyms.", "The passages often use synonyms.", "Reading passages often use synonyms.", "The reading passage often uses synonyms.", "The passage usually uses synonyms.", "Passages often use synonyms.", "The passage often uses a synonym."] },
        { q: "Tôi đọc lướt bài đọc trong hai phút.", hint: "skim, the passage, in two minutes", answers: ["I skim the passage in two minutes.", "I skim the passage for two minutes.", "I skim through the passage in two minutes.", "I skim the text in two minutes.", "I skim the reading passage in two minutes.", "I skim the passage within two minutes.", "I skim through the passage for two minutes."] },
        { q: "Giám khảo chấm bài luận theo bốn tiêu chí.", hint: "the examiner, mark, essay, four criteria", answers: ["The examiner marks the essay on four criteria.", "The examiner marks the essay using four criteria.", "The examiner marks the essay based on four criteria.", "The examiner marks the essay according to four criteria.", "The examiner grades the essay on four criteria.", "The examiner grades the essay using four criteria.", "The examiner scores the essay on four criteria.", "The examiner assesses the essay on four criteria.", "The examiner assesses the essay using four criteria.", "Examiners mark essays on four criteria.", "The examiner marks the essay against four criteria.", "The examiner marks the essay by four criteria.", "The examiner marks the essay with four criteria.", "The examiner marks essays on four criteria.", "The examiner marks the essay according to the four criteria.", "The examiner marks the essay on the four criteria."] },
        { q: "Cô ấy cần band 6.5 để du học.", hint: "need, band, study abroad", answers: ["She needs band 6.5 to study abroad.", "She needs a band 6.5 to study abroad.", "She needs band 6.5 in order to study abroad.", "She needs an overall band of 6.5 to study abroad.", "She needs a band score of 6.5 to study abroad.", "She needs IELTS band 6.5 to study abroad.", "She needs band 6.5 to study overseas.", "She needs a band of 6.5 to study abroad."] },
      ],
    },
  ],
};

export const NGAY_2: Lesson[] = [D2_READING, D2_WRITING, D2_SPEAKING, D2_HOMEWORK];
