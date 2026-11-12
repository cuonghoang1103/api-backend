/**
 * Tra cứu công thức & khung câu — IELTS Tập 2, CHẶNG 3 (Ngày 13–18). Soạn 12/11/2026.
 *
 * Mảng khối `Block[]` (cùng kiểu phần tử với `TRA_CONG_THUC_T2.blocks` trong ./tracuu.ts), chép nguyên văn từ bài
 * của từng ngày; mỗi mục mở bằng một `h` ghi "(Ngày N · mục M)" để mở lại đúng chỗ.
 * CHƯA nối vào trang tra cứu: muốn hiện thì thêm `...TRA_CONG_THUC_CHANG3` vào cuối `blocks` của
 * `TRA_CONG_THUC_T2` (./tracuu.ts) — tệp đó do người điều phối giữ, nhánh soạn ngày không sửa.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG3: Block[] = [
  /* ───────── Ngày 13 — Câu điều kiện loại 0 & 1 · Part 3 nói ───────── */
// Tra cứu Ngày 13 (Tập 2) — ghép vào mảng Block[] của tracuu-chang3.ts
{
  "t": "h",
  "text": "Câu điều kiện là gì? Hai mệnh đề và một dấu phẩy (Ngày 13 · Ngữ pháp mục 1)"
},
{
  "t": "table",
  "caption": "Hai cách xếp — cùng một nghĩa",
  "head": [
    "Vị trí của if",
    "Ví dụ",
    "Dấu phẩy"
  ],
  "rows": [
    [
      "If đứng **đầu** câu",
      "**If** you heat ice**,** it melts.",
      "**Có** phẩy sau mệnh đề if"
    ],
    [
      "If đứng **giữa** câu",
      "Ice melts **if** you heat it.",
      "**Không** phẩy"
    ],
    [
      "Câu hỏi",
      "What **will** you do **if** you fail the test?",
      "Không phẩy; mệnh đề chính là câu hỏi"
    ]
  ]
},
{
  "t": "rule",
  "formula": "If + mệnh đề điều kiện, mệnh đề kết quả · Mệnh đề kết quả + if + mệnh đề điều kiện",
  "vi": "if đứng đầu câu → có phẩy; if đứng giữa → không phẩy. Không thêm so / because để dịch chữ “thì”."
},
{
  "t": "h",
  "text": "Câu điều kiện loại 0: sự thật, quy luật, thói quen (Ngày 13 · Ngữ pháp mục 2)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "If + S + V(s/es), S + V(s/es)",
      "vi": "Loại 0 — hai vế đều hiện tại đơn; if ≈ when.",
      "examples": [
        {
          "en": "If you heat water to 100°C, it boils.",
          "vi": "Nếu đun nước tới 100 độ C, nước sôi."
        },
        {
          "en": "If I have a lot of homework, I study in the library.",
          "vi": "Hễ có nhiều bài tập là tôi học ở thư viện."
        }
      ]
    },
    {
      "formula": "If + S + don't / doesn't + V, S + V(s/es)",
      "vi": "Phủ định ở vế điều kiện — vẫn hiện tại đơn.",
      "examples": [
        {
          "en": "If plants don't get enough light, they turn yellow.",
          "vi": "Nếu cây không đủ ánh sáng, lá chuyển vàng."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "If + S + V(s/es), S + V(s/es)",
  "vi": "Loại 0: điều luôn đúng mỗi khi điều kiện xảy ra — thay if bằng when mà nghĩa không đổi thì đó là loại 0."
},
{
  "t": "h",
  "text": "Câu điều kiện loại 1: khả năng có thật ở tương lai (Ngày 13 · Ngữ pháp mục 3)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "If + S + V(s/es), S + will + V",
      "vi": "Loại 1 — khẳng định. will có thể viết tắt 'll.",
      "examples": [
        {
          "en": "If it rains tomorrow, we will stay at home.",
          "vi": "Nếu mai trời mưa, chúng tôi sẽ ở nhà."
        },
        {
          "en": "If you practise every day, your speaking will improve quickly.",
          "vi": "Nếu bạn luyện mỗi ngày, kỹ năng nói sẽ tiến bộ nhanh."
        }
      ]
    },
    {
      "formula": "If + S + don't / doesn't + V, S + won't + V",
      "vi": "Phủ định — vế if mượn don't / doesn't; vế kết quả dùng won't (= will not).",
      "examples": [
        {
          "en": "If she doesn't leave now, she won't catch the train.",
          "vi": "Nếu cô ấy không đi ngay, cô ấy sẽ không kịp tàu."
        }
      ]
    },
    {
      "formula": "What will + S + V + if + S + V(s/es)?",
      "vi": "Câu hỏi — đảo will ở mệnh đề chính; vế if giữ nguyên hiện tại đơn.",
      "examples": [
        {
          "en": "What will you do if you don't get the scholarship?",
          "vi": "Bạn sẽ làm gì nếu không được học bổng?"
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "If + S + V(s/es), S + will / won't + V",
  "vi": "Loại 1: việc có thể xảy ra ở tương lai — vế if hiện tại đơn, vế kết quả will + V. Không bao giờ will sau if."
},
{
  "t": "h",
  "text": "Loại 1 mở rộng: can / may / might / should / must và câu mệnh lệnh (Ngày 13 · Ngữ pháp mục 4)"
},
{
  "t": "table",
  "head": [
    "Vế kết quả",
    "Nghĩa",
    "Ví dụ",
    "Dịch"
  ],
  "rows": [
    [
      "**will** + V",
      "chắc chắn (theo người nói)",
      "If you leave now, you **will** be on time.",
      "Nếu đi ngay, bạn sẽ kịp giờ."
    ],
    [
      "**may / might** + V",
      "có thể (kém chắc hơn will)",
      "If it gets colder, we **might** cancel the trip.",
      "Nếu trời lạnh hơn, có lẽ chúng tôi sẽ huỷ chuyến đi."
    ],
    [
      "**can** + V",
      "được phép / có khả năng",
      "If you finish early, you **can** go home.",
      "Nếu xong sớm, bạn có thể về."
    ],
    [
      "**should** + V",
      "lời khuyên",
      "If you feel stressed, you **should** talk to someone.",
      "Nếu thấy căng thẳng, bạn nên nói chuyện với ai đó."
    ],
    [
      "**must** + V",
      "bắt buộc",
      "If you want to pass, you **must** practise every day.",
      "Muốn đậu thì bạn phải luyện mỗi ngày."
    ],
    [
      "**Câu mệnh lệnh** (V nguyên mẫu)",
      "dặn, hướng dẫn",
      "If you have any questions, **email** me.",
      "Có câu hỏi gì thì gửi email cho tôi."
    ],
    [
      "**be going to** + V (thêm)",
      "kế hoạch / dự đoán có dấu hiệu",
      "If prices keep rising, we**'re going to** move.",
      "Nếu giá cứ tăng, chúng tôi sẽ chuyển nhà."
    ]
  ]
},
{
  "t": "rule",
  "formula": "If + S + V(s/es), S + can / may / might / should / must + V · If + S + V(s/es), V (mệnh lệnh)!",
  "vi": "Thay will bằng modal để đổi sắc thái (có thể, nên, phải) hoặc dùng mệnh lệnh để dặn — vế if vẫn hiện tại đơn."
},
{
  "t": "h",
  "text": "unless = if … not (“trừ khi”, “nếu không”) (Ngày 13 · Ngữ pháp mục 5)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "Unless + S + V(s/es), S + will / can't / won't + V",
      "vi": "unless + mệnh đề KHẲNG ĐỊNH; vế kết quả theo loại 0 hoặc loại 1.",
      "examples": [
        {
          "en": "Unless you show your passport, you can't board the plane.",
          "vi": "Trừ khi trình hộ chiếu, bạn không thể lên máy bay."
        },
        {
          "en": "The problem will get worse unless governments act now.",
          "vi": "Vấn đề sẽ tệ hơn trừ khi chính phủ hành động ngay."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "Unless + S + V(s/es) = If + S + don't / doesn't + V",
  "vi": "unless đã mang nghĩa phủ định — vế sau unless luôn khẳng định, không có will."
},
{
  "t": "h",
  "text": "when / as soon as / until / before / after + hiện tại đơn (nói về tương lai) (Ngày 13 · Ngữ pháp mục 6)"
},
{
  "t": "table",
  "head": [
    "Liên từ",
    "Nghĩa",
    "Ví dụ",
    "Dịch"
  ],
  "rows": [
    [
      "**when**",
      "khi",
      "I'll call you **when** I **get** home.",
      "Tôi sẽ gọi bạn khi về đến nhà."
    ],
    [
      "**as soon as**",
      "ngay khi",
      "**As soon as** the results **come** out, I'll tell you.",
      "Ngay khi có kết quả, tôi sẽ báo bạn."
    ],
    [
      "**until**",
      "cho đến khi",
      "We'll wait here **until** the rain **stops**.",
      "Chúng ta sẽ đợi ở đây cho đến khi tạnh mưa."
    ],
    [
      "**before**",
      "trước khi",
      "Turn off the lights **before** you **leave**.",
      "Tắt đèn trước khi ra về."
    ],
    [
      "**after**",
      "sau khi",
      "**After** I **finish** this course, I'll take the IELTS test.",
      "Học xong khoá này, tôi sẽ thi IELTS."
    ]
  ]
},
{
  "t": "rule",
  "formula": "S + will + V + when / as soon as / until / before / after + S + V(s/es)",
  "vi": "Mệnh đề thời gian nói về tương lai: chia hiện tại đơn, giống vế if — will chỉ ở vế chính."
},
{
  "t": "h",
  "text": "Áp vào bài thi: Task 2, Speaking Part 3, Listening (Ngày 13 · Ngữ pháp mục 7)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "If + S + V(s/es) + giải pháp, S + will / can + V + kết quả tốt",
      "vi": "Khung câu hệ quả cho thân bài Task 2 (sau câu nêu giải pháp).",
      "examples": [
        {
          "en": "If schools teach basic cooking, students will make healthier choices as adults.",
          "vi": "Nếu trường dạy nấu ăn cơ bản, học sinh sẽ lựa chọn lành mạnh hơn khi lớn."
        }
      ]
    },
    {
      "formula": "Unless + S + V(s/es), S + will + V + kết quả xấu",
      "vi": "Khung câu cảnh báo — hợp với câu cuối đoạn hoặc kết bài.",
      "examples": [
        {
          "en": "Unless young people learn to manage money, many of them will get into debt.",
          "vi": "Trừ khi người trẻ học cách quản lý tiền, nhiều người sẽ rơi vào nợ nần."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "Task 2: If + giải pháp (hiện tại đơn), kết quả (will / can + V) · Unless + điều kiện, kết quả xấu (will + V)",
  "vi": "Hai khung câu phức an toàn cho bài problem / solution — dùng 1–2 lần mỗi đoạn."
},
{
  "t": "h",
  "text": "Năm loại câu hỏi Part 3 — nhận ra để mở đầu đúng (Ngày 13 · Nói mục 2)"
},
{
  "t": "table",
  "head": [
    "Loại",
    "Câu hỏi thường gặp",
    "Câu mở đầu gợi ý"
  ],
  "rows": [
    [
      "**Ý kiến / đánh giá**",
      "Do you think…? · Is it a good thing that…? · Should…?",
      "Yes, I'd say so, because… · To some extent, yes. · Not really. I think…"
    ],
    [
      "**Lý do**",
      "Why do…? · What are the reasons…?",
      "I think the main reason is that… · There are probably two reasons…"
    ],
    [
      "**Dự đoán**",
      "Will… in the future? · How will… change? · What will happen if…?",
      "I imagine that… · If…, … will probably… · It's hard to say, but…"
    ],
    [
      "**Giải pháp**",
      "What can be done to…? · How can… encourage…? · What should the government do…?",
      "One thing that could help is… · If…, … will… · I think schools should…"
    ],
    [
      "**So sánh**",
      "Is A better than B? · How is A different from B? · Are people today… than in the past?",
      "I'd say A is…er than B, mainly because… (so sánh quá khứ – hiện tại: Tập 2 Ngày 21)"
    ]
  ]
},
{
  "t": "h",
  "text": "Khung trả lời 4 bước: Ý kiến → Lý do → Ví dụ → Nhượng bộ (Ngày 13 · Nói mục 3)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "Ý kiến + The main reason is that + S + V + For example, … + Having said that, …",
      "vi": "Khung 4 bước — đủ dài cho Part 3 band 5–6 mà vẫn dễ nhớ.",
      "examples": [
        {
          "en": "I don't really think so. The main reason is that public transport here is still quite slow. For example, my bus to university takes an hour. Having said that, the new metro line might change that.",
          "vi": "Tôi không nghĩ vậy. Lý do chính là giao thông công cộng ở đây vẫn khá chậm. Ví dụ, chuyến xe buýt đến trường của tôi mất một tiếng. Dù vậy, tuyến metro mới có thể làm thay đổi điều đó."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "Ý kiến → The main reason is that… → For example, … → Having said that, … / So overall, …",
  "vi": "3–5 câu, khoảng 30–45 giây; bước 4 cho thấy bạn nhìn được cả hai mặt."
},
{
  "t": "h",
  "text": "Nói về “con người, xã hội”, không chỉ về “tôi” (Ngày 13 · Nói mục 4)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "Generally speaking / In general, + many / most + N + V",
      "vi": "Mở đầu một nhận định chung.",
      "examples": [
        {
          "en": "Generally speaking, most students prefer studying in groups.",
          "vi": "Nói chung, phần lớn sinh viên thích học nhóm."
        }
      ]
    },
    {
      "formula": "S + tend to + V",
      "vi": "“có xu hướng…” — nói chung mà không tuyệt đối hoá (không phải ai cũng vậy).",
      "examples": [
        {
          "en": "Older people tend to save more money than young people.",
          "vi": "Người lớn tuổi có xu hướng tiết kiệm nhiều hơn người trẻ."
        }
      ]
    },
    {
      "formula": "People who + V…, + V · In my country / In big cities, …",
      "vi": "Thu hẹp nhóm người hoặc nơi chốn cho ý kiến chính xác hơn.",
      "examples": [
        {
          "en": "In big cities, people who live far from work often spend two hours a day in traffic.",
          "vi": "Ở thành phố lớn, người sống xa chỗ làm thường mất hai tiếng mỗi ngày trên đường."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "Generally speaking, many / most + N + V · S + tend to + V · People who + V… · In my country, …",
  "vi": "Part 3: chủ ngữ là people / nhóm người / xã hội; “I” chỉ xuất hiện ở ý kiến (I think…) và ví dụ."
},
{
  "t": "h",
  "text": "Dự đoán và nói hệ quả bằng câu điều kiện (Ngày 13 · Nói mục 5)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "If + S + V(s/es), S + will probably / might + V",
      "vi": "Dự đoán hệ quả — trả lời “What will happen if…?”.",
      "examples": [
        {
          "en": "If more people work from home, city centres will probably become quieter.",
          "vi": "Nếu nhiều người làm việc ở nhà hơn, trung tâm thành phố có lẽ sẽ yên tĩnh hơn."
        }
      ]
    },
    {
      "formula": "Unless + S + V(s/es), S + will + V",
      "vi": "Cảnh báo — hợp với câu hỏi giải pháp: chỉ ra điều sẽ xảy ra nếu không làm gì.",
      "examples": [
        {
          "en": "Unless parents limit screen time, children will find it harder to concentrate at school.",
          "vi": "Trừ khi cha mẹ giới hạn thời gian dùng màn hình, trẻ sẽ khó tập trung ở trường hơn."
        }
      ]
    },
    {
      "formula": "One thing that could help is + N / V-ing. If…, … will…",
      "vi": "Giải pháp + hệ quả: nêu cách làm rồi nói kết quả bằng câu điều kiện.",
      "examples": [
        {
          "en": "One thing that could help is cheaper bus tickets. If buses are cheaper, fewer people will drive into the city.",
          "vi": "Một điều có thể giúp là vé xe buýt rẻ hơn. Nếu xe buýt rẻ hơn, ít người lái xe vào thành phố hơn."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "If + S + V(s/es), S + will probably / might + V · Unless + S + V(s/es), S + will + V",
  "vi": "Câu hỏi dự đoán / giải pháp ở Part 3: một câu điều kiện đúng = một điểm cộng cho GRA."
},
{
  "t": "h",
  "text": "Khi không nghe rõ, không hiểu từ, hoặc cần vài giây (Ngày 13 · Nói mục 6)"
},
{
  "t": "table",
  "head": [
    "Tình huống",
    "Câu nên nói",
    "Không nên"
  ],
  "rows": [
    [
      "Không nghe rõ",
      "Sorry, **could you repeat the question**, please? · Sorry, **I didn't quite catch that**.",
      "~~What?~~ · ~~Again?~~ · ~~Repeat.~~"
    ],
    [
      "Không hiểu một từ",
      "Sorry, **what do you mean by** “consumerism”? · **Could you explain what** “sustainable” **means**?",
      "Đoán bừa rồi trả lời lạc đề"
    ],
    [
      "Muốn chắc mình hiểu đúng",
      "**Do you mean** … ? · **So you're asking whether** …?",
      "Hỏi lại toàn bộ câu"
    ],
    [
      "Cần vài giây suy nghĩ",
      "**That's an interesting question.** I've never really thought about it, but **I suppose** … · **Let me think** … Well, …",
      "Im lặng > 3 giây · “Ummmm…” kéo dài · ~~I don't know.~~ rồi dừng"
    ],
    [
      "Không có ý tưởng",
      "**I'm not really sure, but I imagine** that … · I don't know much about this, but **my guess is that** …",
      "~~I have no idea.~~ (rồi dừng)"
    ]
  ]
},
{
  "t": "rule",
  "formula": "Sorry, could you repeat the question? · What do you mean by …? · That's an interesting question. I suppose …",
  "vi": "Hỏi lại một lần là bình thường; câu kéo giờ phải nối ngay vào câu trả lời."
},
  /* ───────── Ngày 14 — AWL + du lịch · Sentence completion · Problem / solution ───────── */
{
  "t": "h",
  "text": "Từ vựng du lịch — hai khung Task 2: tác động & giải pháp (Ngày 14 · Từ vựng mục 5)"
},
{
  "t": "rule",
  "formula": "N (tourism / overtourism) + puts pressure on / has a positive impact on + N · S + should + regulate / restrict + the number of + N",
  "vi": "Hai khung Task 2 dùng ngay từ vựng hôm nay: nói tác động (impact / pressure) và nói giải pháp (regulate / restrict)."
},
{
  "t": "h",
  "text": "Sentence completion — quy trình 6 bước & giới hạn từ (Ngày 14 · Đọc mục 2–3)"
},
{
  "t": "table",
  "head": [
    "Lời dẫn",
    "Được viết",
    "Ví dụ hợp lệ",
    "Ví dụ SAI"
  ],
  "rows": [
    [
      "**ONE WORD ONLY**",
      "đúng 1 từ",
      "railway",
      "~~the railway~~"
    ],
    [
      "**NO MORE THAN TWO WORDS**",
      "1 hoặc 2 từ",
      "charter flights",
      "~~cheap charter flights~~"
    ],
    [
      "**ONE WORD AND/OR A NUMBER**",
      "1 từ, hoặc 1 số, hoặc 1 từ + 1 số",
      "1841 · 500 people",
      "~~around 500 people~~"
    ],
    [
      "**NO MORE THAN TWO WORDS AND/OR A NUMBER**",
      "tối đa 2 từ + 1 số",
      "25 million",
      "~~about 25 million tourists~~"
    ]
  ]
},
{
  "t": "rule",
  "formula": "Đọc giới hạn từ → đoán loại từ → dò bằng tên / số / từ đồng nghĩa → chép NGUYÊN chữ trong bài → đọc lại cả câu (ngữ pháp + số ít / nhiều)",
  "vi": "Đáp án luôn là chữ CÓ trong bài; câu hỏi đi theo thứ tự bài đọc."
},
{
  "t": "h",
  "text": "Problem / Solution · Cause / Effect — 4 kiểu đề & khung 4 đoạn (Ngày 14 · Viết mục 1–2)"
},
{
  "t": "table",
  "caption": "Bốn kiểu đề Problem / Solution · Cause / Effect",
  "head": [
    "Kiểu",
    "Câu hỏi trong đề thường là",
    "Thân 1",
    "Thân 2"
  ],
  "rows": [
    [
      "**A. Vấn đề + giải pháp**",
      "What **problems** does this cause? What **solutions** can you suggest?",
      "2 vấn đề",
      "2 giải pháp (khớp từng vấn đề)"
    ],
    [
      "**B. Nguyên nhân + giải pháp**",
      "**Why** is this happening? / What are the **causes**? What **can be done**?",
      "2 nguyên nhân",
      "2 giải pháp (đánh vào nguyên nhân)"
    ],
    [
      "**C. Nguyên nhân + kết quả**",
      "What are the **reasons** for this? What **effects** does it have?",
      "2 nguyên nhân",
      "2 kết quả (cho cá nhân / xã hội)"
    ],
    [
      "**D. Cho sẵn vấn đề — hỏi biện pháp**",
      "X is a serious problem. What **measures** could be taken to **tackle** it?",
      "biện pháp 1 + giải thích",
      "biện pháp 2 + giải thích"
    ]
  ]
},
{
  "t": "table",
  "caption": "Câu mở và câu chủ đề mẫu cho từng kiểu",
  "head": [
    "Chỗ",
    "Kiểu A / D (vấn đề – giải pháp)",
    "Kiểu B / C (nguyên nhân – …)"
  ],
  "rows": [
    [
      "Mở bài, câu 2",
      "This essay will discuss the main problems this causes and suggest some possible solutions.",
      "This essay will examine the main reasons for this trend and its effects / possible solutions."
    ],
    [
      "Thân 1, câu chủ đề",
      "The main problem is that + S + V. / There are two main problems.",
      "There are two main reasons for this. / The first cause is + N."
    ],
    [
      "Thân 2, câu chủ đề",
      "There are several ways to solve these problems.",
      "This trend has serious effects on… / Several measures could be taken."
    ],
    [
      "Kết bài",
      "In conclusion, X causes … ; however, these problems can be reduced if …",
      "In conclusion, X is mainly caused by … and it leads to …"
    ]
  ]
},
{
  "t": "rule",
  "formula": "Intro (paraphrase + this essay will…) → Body 1 (vấn đề / nguyên nhân ×2) → Body 2 (giải pháp / kết quả ×2) → Conclusion (tóm, không ý mới)",
  "vi": "Hai câu hỏi của đề = hai đoạn thân bài. Thiếu một câu hỏi là Task Response tụt xuống band 4–5."
},
{
  "t": "h",
  "text": "Ngôn ngữ nguyên nhân – kết quả: because / because of · cause · lead to · result in · As a result (Ngày 14 · Viết mục 4)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "S + V + because + S + V · because of + N",
      "vi": "Nối nguyên nhân trong cùng câu. because + MỆNH ĐỀ (có S + V); because of + DANH TỪ / cụm danh từ.",
      "examples": [
        {
          "en": "Rents are rising because many flats are rented to tourists.",
          "vi": "Giá thuê nhà tăng vì nhiều căn hộ được cho du khách thuê."
        },
        {
          "en": "Many flights were cancelled because of the storm.",
          "vi": "Nhiều chuyến bay bị huỷ vì cơn bão."
        }
      ]
    },
    {
      "formula": "N (nguyên nhân) + cause / lead to / result in + N (kết quả)",
      "vi": "Động từ nối nguyên nhân → kết quả. lead to và result in luôn có giới từ; sau đó là danh từ hoặc V-ing.",
      "examples": [
        {
          "en": "Mass tourism can lead to higher prices for local people.",
          "vi": "Du lịch đại chúng có thể dẫn đến giá cả cao hơn cho người dân địa phương."
        },
        {
          "en": "Long working hours often result in stress and poor sleep.",
          "vi": "Làm việc nhiều giờ thường gây ra căng thẳng và ngủ kém."
        }
      ]
    },
    {
      "formula": "S + V. As a result, / This means that + S + V.",
      "vi": "Nối kết quả sang CÂU MỚI — rất hợp để viết lớp Explanation trong thân bài.",
      "examples": [
        {
          "en": "Many owners prefer to rent their flats to tourists. As a result, there are fewer homes for local families.",
          "vi": "Nhiều chủ nhà thích cho khách du lịch thuê căn hộ hơn. Kết quả là có ít nhà hơn cho các gia đình địa phương."
        },
        {
          "en": "Employees can be contacted at any time. This means that they rarely switch off from work.",
          "vi": "Nhân viên có thể bị liên lạc bất cứ lúc nào. Điều đó có nghĩa là họ hiếm khi tách khỏi công việc."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "because + S + V · because of + N · N + causes / leads to / results in + N · …. As a result, S + V.",
  "vi": "because cần mệnh đề, because of cần danh từ; lead to / result in luôn có giới từ, cause thì không."
},
{
  "t": "h",
  "text": "Ngôn ngữ giải pháp: should · One solution would be to · If + hiện tại, will (Ngày 14 · Viết mục 5)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "Governments / Schools / Companies + should + V",
      "vi": "Ai nên làm gì — câu giải pháp cơ bản nhất (modal should, Tập 1 Ngày 13). Luôn nói RÕ AI làm.",
      "examples": [
        {
          "en": "Local governments should limit the number of flats that can be rented to visitors.",
          "vi": "Chính quyền địa phương nên giới hạn số căn hộ được cho khách thuê."
        }
      ]
    },
    {
      "formula": "One solution would be to + V · Another (possible) solution is to + V",
      "vi": "Mở một giải pháp mới, giọng đề xuất mềm hơn should.",
      "examples": [
        {
          "en": "Another solution would be to encourage tourists to visit at different times of the year.",
          "vi": "Một giải pháp khác là khuyến khích du khách đến vào các thời điểm khác trong năm."
        }
      ]
    },
    {
      "formula": "If + S + V (hiện tại), S + will + V · This will / would help (to) + V",
      "vi": "Nói kết quả của giải pháp — câu điều kiện loại 1 (Ngày 13). Mệnh đề If KHÔNG dùng will.",
      "examples": [
        {
          "en": "If there are clear rules, more homes will be available for residents.",
          "vi": "Nếu có quy định rõ ràng, sẽ có nhiều nhà hơn cho cư dân."
        },
        {
          "en": "This would help to spread the income from tourism more fairly.",
          "vi": "Việc này sẽ giúp chia thu nhập từ du lịch công bằng hơn."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "S (ai) + should + V · One solution would be to + V · If + S + V(s/es), S + will + V",
  "vi": "Giải pháp = AI làm GÌ → giải quyết vấn đề NÀO → kết quả (will)."
},
  /* ───────── Ngày 15 — Mệnh đề quan hệ xác định · Part 2 sự kiện ───────── */
{
  "t": "h",
  "text": "Mệnh đề quan hệ: ghép hai câu thành một (Ngày 15 · Ngữ pháp mục 1)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "N + who / which / that + V …",
      "vi": "Đại từ quan hệ làm CHỦ NGỮ của mệnh đề — theo sau là động từ.",
      "examples": [
        {
          "en": "People who exercise regularly sleep better.",
          "vi": "Những người tập thể dục đều đặn ngủ ngon hơn."
        },
        {
          "en": "It is a festival which attracts thousands of visitors.",
          "vi": "Đó là một lễ hội thu hút hàng nghìn du khách."
        }
      ]
    },
    {
      "formula": "N + (who / which / that) + S + V …",
      "vi": "Đại từ quan hệ làm TÂN NGỮ — theo sau là một chủ ngữ mới (xem mục 3).",
      "examples": [
        {
          "en": "The film (that) we watched last night was boring.",
          "vi": "Bộ phim (mà) chúng tôi xem tối qua thật chán."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "N + who / which / that + V … · N + (who / which / that) + S + V …",
  "vi": "Mệnh đề quan hệ đứng NGAY SAU danh từ nó bổ nghĩa; đại từ quan hệ THAY cho danh từ lặp lại."
},
{
  "t": "h",
  "text": "who · which · that — chọn theo danh từ đứng trước (Ngày 15 · Ngữ pháp mục 2)"
},
{
  "t": "table",
  "caption": "Khi nào NÊN dùng that (mức nhận biết — gặp trong đọc / nghe rất nhiều)",
  "head": [
    "Sau…",
    "Ví dụ",
    "Vì sao"
  ],
  "rows": [
    [
      "so sánh nhất (**the best, the biggest…**)",
      "It was **the best** film **that** I have ever seen.",
      "that tự nhiên hơn which ở đây"
    ],
    [
      "**the only / the first / the last**",
      "She was **the only** student **that** passed.",
      "giới hạn “duy nhất / đầu tiên”"
    ],
    [
      "**all, everything, something, nothing, anything**",
      "**Everything that** he said was true.",
      "~~everything what~~ là lỗi rất hay gặp"
    ],
    [
      "người + vật cùng lúc",
      "the people and the places **that** I remember",
      "who hay which đều không hợp cả hai"
    ]
  ]
},
{
  "t": "rule",
  "formula": "người + who / that · vật + which / that · the best / the only / everything + that",
  "vi": "that thay được who và which trong mệnh đề xác định; không dùng that sau dấu phẩy hay giới từ; không dùng what sau danh từ."
},
{
  "t": "h",
  "text": "Đại từ quan hệ làm chủ ngữ / tân ngữ — lược bỏ (Ngày 15 · Ngữ pháp mục 3)"
},
{
  "t": "table",
  "head": [
    "Ngay sau đại từ quan hệ là…",
    "Vai của đại từ",
    "Bỏ được không?",
    "Ví dụ"
  ],
  "rows": [
    [
      "một **động từ** (lives, was, teaches…)",
      "**chủ ngữ** của mệnh đề",
      "**KHÔNG**",
      "the man **who lives** here → ~~the man lives here~~ (thành câu khác hẳn)"
    ],
    [
      "một **chủ ngữ mới + động từ** (I bought, she met…)",
      "**tân ngữ** của mệnh đề",
      "**CÓ** — bỏ hay giữ đều đúng",
      "the book **(that) I bought** · the people **(who) we met**"
    ]
  ]
},
{
  "t": "rule",
  "formula": "N + who / which / that + V (chủ ngữ — giữ) · N + (who / which / that) + S + V (tân ngữ — lược bỏ được)",
  "vi": "Sau đại từ là động từ → không bỏ. Sau đại từ là chủ ngữ mới → bỏ được. Không bao giờ thêm he / she / it thừa."
},
{
  "t": "h",
  "text": "whose — sở hữu (Ngày 15 · Ngữ pháp mục 4)"
},
{
  "t": "table",
  "head": [
    "Hai câu",
    "Ghép bằng whose",
    "Dịch"
  ],
  "rows": [
    [
      "I have a friend. **Her** father is a pilot.",
      "I have a friend **whose father** is a pilot.",
      "Tôi có một người bạn có bố là phi công."
    ],
    [
      "That's the girl. I borrowed **her** bike.",
      "That's the girl **whose bike** I borrowed.",
      "Đó là cô gái mà tôi đã mượn xe đạp của cô ấy."
    ],
    [
      "It is a city. **Its** streets are full of trees.",
      "It is a city **whose streets** are full of trees.",
      "Đó là thành phố có đường phố rợp cây xanh."
    ],
    [
      "Students need support. **Their** parents work abroad.",
      "Students **whose parents** work abroad need support.",
      "Học sinh có bố mẹ làm việc ở nước ngoài cần được hỗ trợ."
    ]
  ]
},
{
  "t": "rule",
  "formula": "N + whose + N + V … (whose thay his / her / its / their)",
  "vi": "whose luôn đi kèm một danh từ ngay sau; dùng cho người và vật; không viết who's."
},
{
  "t": "h",
  "text": "where (và when) — nơi chốn, thời gian (Ngày 15 · Ngữ pháp mục 5)"
},
{
  "t": "table",
  "caption": "where hay which? — nhìn ngay sau chỗ trống",
  "head": [
    "Câu",
    "Sau chỗ trống là",
    "Chọn",
    "Vì sao"
  ],
  "rows": [
    [
      "Hoi An is a town ___ **attracts** many tourists.",
      "động từ (attracts)",
      "**which / that**",
      "town làm chủ ngữ của attracts"
    ],
    [
      "Hoi An is a town ___ **I spent** my holiday.",
      "chủ ngữ + động từ (I spent)",
      "**where**",
      "= I spent my holiday **in** the town"
    ],
    [
      "This is the hotel ___ **we booked**.",
      "chủ ngữ + động từ, nhưng book **nhận tân ngữ** (book the hotel)",
      "**which / that / (bỏ)**",
      "we booked **the hotel** — không có giới từ in / at"
    ],
    [
      "This is the hotel ___ **we stayed**.",
      "chủ ngữ + động từ không nhận tân ngữ (stay)",
      "**where**",
      "we stayed **at** the hotel"
    ]
  ]
},
{
  "t": "rule",
  "formula": "N (nơi chốn) + where + S + V · = N + (that) + S + V + giới từ · N + when + S + V (thêm)",
  "vi": "Sau where là câu đầy đủ chủ ngữ + động từ. Sau chỗ trống là động từ → which / that."
},
{
  "t": "h",
  "text": "Chia động từ & dấu phẩy — xác định / không xác định (Ngày 15 · Ngữ pháp mục 6)"
},
{
  "t": "table",
  "caption": "Tìm danh từ chính trước khi chia động từ",
  "head": [
    "Câu",
    "Danh từ chính",
    "Đúng / sai"
  ],
  "rows": [
    [
      "A student who **lives** far away **needs** a bus pass.",
      "a student (số ít)",
      "✔ lives · needs"
    ],
    [
      "Students who **live** far away **need** a bus pass.",
      "students (số nhiều)",
      "✔ live · need"
    ],
    [
      "The people who work in this office ~~is~~ **are** very friendly.",
      "the people (số nhiều)",
      "office chỉ nằm trong mệnh đề → không quyết định động từ chính"
    ],
    [
      "One of the girls who ~~sings~~ **sing** in the choir is my sister.",
      "who = the girls (số nhiều) → sing; câu chính: **One… is**",
      "hai động từ, hai chủ ngữ khác nhau"
    ]
  ]
},
{
  "t": "rule",
  "formula": "N (số ít) + who + V(s/es) … + V(s/es) chính · N (số nhiều) + who + V … + V chính — xác định: không dấu phẩy",
  "vi": "Động từ trong mệnh đề theo danh từ đứng trước đại từ; động từ chính theo danh từ chính của câu."
},
{
  "t": "h",
  "text": "Khung Part 2 kể sự kiện (Ngày 15 · Nói mục 3)"
},
{
  "t": "table",
  "caption": "Từ nối thời gian cho câu chuyện quá khứ",
  "head": [
    "Chức năng",
    "Từ / cụm",
    "Ví dụ"
  ],
  "rows": [
    [
      "Bắt đầu",
      "**First (of all)** · **At the beginning** · **In the morning**",
      "**First of all**, there was a short ceremony at the bride's house."
    ],
    [
      "Tiếp theo",
      "**Then** · **After that** · **Later on** · **Next**",
      "**After that**, everyone moved to the hotel."
    ],
    [
      "Cùng lúc",
      "**While** + S + was / were + V-ing · **At the same time**",
      "**While** we **were eating**, a band started to play."
    ],
    [
      "Ngay khi",
      "**As soon as** + S + V-ed",
      "**As soon as** the bride arrived, everyone stood up."
    ],
    [
      "Kết thúc",
      "**Finally** · **In the end** · **By the end of the night**",
      "**In the end**, we danced until midnight."
    ]
  ]
},
{
  "t": "rule",
  "formula": "I'd like to talk about + N + that I went to … · It took place in … · First … Then … After that … · It was memorable because + S + V",
  "vi": "Khung 4 phần của đề sự kiện — mở, bối cảnh, diễn biến, cảm xúc; cả bài dùng quá khứ đơn."
},
{
  "t": "h",
  "text": "Thêm chi tiết bằng mệnh đề quan hệ khi kể chuyện (Ngày 15 · Nói mục 4)"
},
{
  "t": "patterns",
  "rows": [
    {
      "formula": "the person / people + who + V …",
      "vi": "Thêm chi tiết về người trong câu chuyện.",
      "examples": [
        {
          "en": "There were some relatives who came all the way from Saigon.",
          "vi": "Có vài người họ hàng đi từ tận Sài Gòn ra."
        }
      ]
    },
    {
      "formula": "the place + where + S + V …",
      "vi": "Thêm chi tiết về nơi diễn ra sự kiện.",
      "examples": [
        {
          "en": "The party was held at a small restaurant where my parents had their first date.",
          "vi": "Bữa tiệc tổ chức ở một nhà hàng nhỏ, nơi bố mẹ tôi hẹn hò lần đầu."
        }
      ]
    },
    {
      "formula": "the part / the moment + (that) + I remember most + was …",
      "vi": "Dẫn vào chi tiết đáng nhớ nhất — câu “đinh” của phần diễn biến.",
      "examples": [
        {
          "en": "The moment that I remember most was when the fireworks started.",
          "vi": "Khoảnh khắc tôi nhớ nhất là lúc pháo hoa bắt đầu bắn."
        }
      ]
    },
    {
      "formula": "the day / the year + (when) + S + V …",
      "vi": "Thêm thời điểm (when — mở rộng của bài Ngữ pháp mục 5).",
      "examples": [
        {
          "en": "It was the day when I finally understood why Tet matters so much to my grandparents.",
          "vi": "Đó là ngày tôi cuối cùng cũng hiểu vì sao Tết quan trọng với ông bà đến thế."
        }
      ]
    }
  ]
},
{
  "t": "rule",
  "formula": "the people who + V · the place where + S + V · the moment (that) + S + V · the day (when) + S + V",
  "vi": "Mỗi bài Part 2 sự kiện: 3–4 mệnh đề quan hệ — không dấu phẩy, không thêm he / it thừa."
},
{
  "t": "h",
  "text": "Âm yếu /ə/: dạng mạnh ↔ dạng yếu (Ngày 15 · Nói mục 7)"
},
{
  "t": "table",
  "caption": "Dạng mạnh ↔ dạng yếu của các từ hay gặp",
  "head": [
    "Từ",
    "Dạng mạnh",
    "Dạng yếu",
    "Ví dụ (dạng yếu)"
  ],
  "rows": [
    [
      "**a**",
      "/eɪ/",
      "/ə/",
      "**a** cup of tea → /ə kʌp əv tiː/"
    ],
    [
      "**to**",
      "/tuː/",
      "/tə/ (trước phụ âm) · /tu/ (trước nguyên âm)",
      "I want **to** go → /tə ɡəʊ/ · **to** eat → /tu iːt/"
    ],
    [
      "**for**",
      "/fɔː/",
      "/fə/",
      "a present **for** you → /fə juː/"
    ],
    [
      "**of**",
      "/ɒv/",
      "/əv/",
      "one **of** my friends → /wʌn əv/"
    ],
    [
      "**and**",
      "/ænd/",
      "/ən/ hoặc /ənd/",
      "fish **and** chips → /fɪʃ ən tʃɪps/"
    ],
    [
      "**can**",
      "/kæn/",
      "/kən/",
      "I **can** swim → /aɪ kən swɪm/"
    ],
    [
      "**was**",
      "/wɒz/",
      "/wəz/",
      "It **was** great → /ɪt wəz ɡreɪt/"
    ]
  ]
},
  /* ───────── Ngày 16 — Collocation tiền bạc · Matching information · Task 1 bảng ───────── */
{ t: 'h', text: 'Collocation — 5 kiểu kết hợp từ (Ngày 16 · Từ vựng mục 4)' },
    {
      t: 'table',
      caption: '5 kiểu collocation hay gặp nhất — ví dụ chủ đề tiền bạc',
      head: ['Kiểu', 'Ví dụ đúng'],
      rows: [
        ['**V + N**', '**make** a purchase · **set** a budget · **take out** a loan · **save / waste** money · **pay** a bill'],
        ['**adj + N**', '**high / low** prices · **heavy** debt · a **tight** budget · a **full** refund · **disposable** income'],
        ['**adv + adj**', '**reasonably** priced · **ridiculously** expensive · **financially** independent'],
        ['**N + N**', '**price** tag · **credit** card · **shopping** habits · **consumer** spending'],
        ['**từ + giới từ**', 'spend money **on** · pay **for** · a discount **on** · save **for** · be short **of** money'],
      ],
    },
    {
      t: 'rule',
      formula: 'V + N (make a purchase) · adj + N (a tight budget) · adv + adj (reasonably priced) · N + N (price tag) · từ + giới từ (spend money on)',
      vi: 'Học từ theo CỤM nó hay đi cùng; câu đúng ngữ pháp mà ghép sai cụm vẫn mất điểm Lexical Resource.',
    },
    { t: 'h', text: 'Cụm động từ & collocation về tiền (Ngày 16 · Từ vựng mục 3, 5)' },
    {
      t: 'rule',
      formula: 'take out / pay off / pay back a loan · be in / get into debt · save up for + N · splash out on + N · run out of + N · cut back on + N / V-ing',
      vi: 'Giới từ là một phần của cụm — thiếu giới từ là sai (~~run out money~~, ~~splash out a hotel~~).',
    },
    {
      t: 'table',
      head: ['~~Dịch từng chữ~~', 'Collocation đúng'],
      rows: [
        ['~~borrow a loan~~', '**take out** a loan'],
        ['~~buy a discount~~', '**get** a discount (on sth)'],
        ['~~spend money to buy clothes~~', 'spend money **on** clothes'],
        ['~~make debt~~', '**get into** debt'],
        ['~~a cheap salary~~ · ~~expensive prices~~', 'a **low** salary · **high** prices'],
        ['~~do shopping~~', '**go shopping** (cho vui) · **do the shopping** (đồ thiết yếu)'],
      ],
    },
    { t: 'h', text: 'Họ từ tiền bạc — economic ≠ economical (Ngày 16 · Từ vựng mục 6)' },
    {
      t: 'rule',
      formula: 'consume (v) → consumer (người) · consumption (sự tiêu thụ) · consumerism (chủ nghĩa) · economic (kinh tế) ≠ economical (tiết kiệm)',
      vi: 'Sau mạo từ / tính từ / giới từ cần DANH TỪ: the consumption of, financial support, consumer spending.',
    },
    { t: 'h', text: 'Câu mẫu Task 2 về tiền: nguyên nhân – giải pháp – nhượng bộ (Ngày 16 · Từ vựng mục 7)' },
    {
      t: 'rule',
      formula: 'S + get into debt because… · Setting a budget is one of the most effective ways to + V · … are convenient, but they also make it easier to + V',
      vi: 'Ba khung câu Task 2 về tiền: nguyên nhân – giải pháp – nhượng bộ.',
    },
    { t: 'h', text: 'Matching information — câu hỏi = loại thông tin + nội dung (Ngày 16 · Đọc mục 3)' },
    {
      t: 'rule',
      formula: 'Câu hỏi = LOẠI thông tin (an example of / a reason for / a reference to…) + NỘI DUNG (từ khoá) → dò dấu hiệu của loại + paraphrase của nội dung',
      vi: 'Đúng nội dung mà sai loại (đoạn có nhắc chủ đề nhưng không có VÍ DỤ) thì vẫn chưa phải đáp án. NB: một chữ cái có thể dùng nhiều lần.',
    },
    { t: 'h', text: 'Task 1 table — chọn số & bố cục (Ngày 16 · Viết mục 2, 4)' },
    {
      t: 'rule',
      formula: 'Chọn: cao nhất · thấp nhất · quy luật chung · chênh lệch lớn nhất · ngoại lệ → mỗi câu thân bài = 1 phép so sánh + số liệu làm bằng chứng',
      vi: 'Bảng 16 ô → nhắc khoảng 10–12 số, nhưng luôn trong câu SO SÁNH; ô “nhạt” gom thành khoảng (between 11% and 14%).',
    },
    {
      t: 'rule',
      formula: 'Intro (paraphrase đề) → Overview (không số) → Body 1 (nhóm lớn / nổi bật) → Body 2 (nhóm còn lại)',
      vi: 'Hai đoạn thân bài, mỗi đoạn gom 2 cột (hoặc một nhóm hàng) và so sánh bên trong nhóm.',
    },
    { t: 'h', text: 'Task 1 table — overview không số (Ngày 16 · Viết mục 3)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Overall, it is clear that + S + V…, while + S + V…',
          vi: 'Overview hai vế: quy luật chung + điểm đối lập.',
          examples: [
            { en: 'Overall, it is clear that housing and food were the largest expenses in all four countries, while leisure accounted for the smallest share.', vi: 'Nhìn chung, rõ ràng nhà ở và thực phẩm là hai khoản chi lớn nhất ở cả bốn nước, trong khi giải trí chiếm phần nhỏ nhất.' },
          ],
        },
        {
          formula: 'The most striking feature is that + S + V…',
          vi: 'Câu thứ hai của overview: nêu ngoại lệ / điểm nổi bật nhất.',
          examples: [
            { en: 'The most striking feature is that Vietnamese households spent far more on food than on anything else.', vi: 'Điểm nổi bật nhất là các hộ gia đình Việt Nam chi cho thực phẩm nhiều hơn hẳn mọi khoản khác.' },
          ],
        },
      ],
    },
    {
      t: 'rule',
      formula: 'Overall, it is clear that + quy luật chung (không số), while + điểm đối lập. The most striking feature is that + ngoại lệ.',
      vi: 'Overview = 1–2 câu, không con số, nói về cả bảng.',
    },
    { t: 'h', text: 'Task 1 table — ngôn ngữ số liệu & so sánh (Ngày 16 · Viết mục 5)' },
    {
      t: 'table',
      head: ['Chức năng', 'Khung câu', 'Ví dụ'],
      rows: [
        ['Chiếm bao nhiêu', 'N **accounted for / took up / made up** X%', 'Food **accounted for** 38% of spending in Vietnam.'],
        ['Chi cho cái gì', 'S **spent** X% **on** N', 'Canadians **spent** 16% **on** transport.'],
        ['So với', 'X% …, **compared with** Y% in …', 'Housing took up 30% in the UK, **compared with** 18% in Vietnam.'],
        ['Gấp mấy lần', '**twice / three times as much as** · **more than double** + N', 'Food in Vietnam was **more than double** the UK figure.'],
        ['Lần lượt', 'A and B …, at X% and Y% **respectively**', 'Housing and food took up 25% and 24% **respectively** in Japan.'],
        ['Khoảng giá trị', 'N **ranged from** X% **to** Y% · **between** X% and Y%', 'Leisure **ranged from** 13% in the UK **to** 5% in Vietnam.'],
        ['Đối lập', '**By contrast,** … · …, **whereas** …', '**By contrast,** Vietnam spent only 18% on housing.'],
      ],
    },
    {
      t: 'rule',
      formula: 'N accounted for X% · S spent X% on N · …, compared with Y% · twice as much as / more than double · A and B: X% and Y% respectively · ranged from X% to Y%',
      vi: 'Bảng một năm: không rise/fall; mỗi số liệu nên đi kèm một phép so sánh.',
    },
  /* ───────── Ngày 17 — Từ nối · ngôn ngữ họp · trọng âm câu ───────── */
{"t":"h","text":"Từ nối là gì? Hai tầng: trong câu và giữa các câu (Ngày 17 · Ngữ pháp mục 1)"},
  {"t":"table","caption":"Ba nhóm từ nối và tên gọi đúng","head":["Nhóm","Thành viên hay gặp","Vị trí","Ví dụ"],"rows":[["**Liên từ kết hợp** (coordinating conjunction)","and, but, or, so","giữa hai mệnh đề ngang hàng","The bus was late, **so** I took a taxi."],["**Liên từ phụ thuộc** (subordinating conjunction)","because, although, though, while, whereas, when, if","đầu mệnh đề phụ; mệnh đề phụ đứng trước hoặc sau mệnh đề chính","**Although** the bus was late, I arrived on time."],["**Trạng từ / cụm trạng ngữ liên kết** (linking adverbial)","However, Therefore, Moreover, In addition, For example, As a result, On the other hand","đầu câu mới (đôi khi giữa câu, giữa hai dấu phẩy)","The bus was late. **Therefore,** I took a taxi."]]},
  {"t":"rule","formula":"Liên từ: S + V, but / so / and + S + V (một câu) · Trạng từ liên kết: S + V. However, + S + V (hai câu)","vi":"Liên từ nối trong câu; trạng từ liên kết mở đầu câu mới, có dấu phẩy theo sau."},
  {"t":"h","text":"and · but · or · so — nối hai ý ngang hàng (Ngày 17 · Ngữ pháp mục 2)"},
  {"t":"patterns","rows":[{"formula":"S + V, and + S + V","vi":"Thêm một ý cùng hướng.","examples":[{"en":"The library is quiet, and it has fast Wi-Fi.","vi":"Thư viện yên tĩnh, và có Wi-Fi nhanh."}]},{"formula":"S + V, but + S + V","vi":"Ý sau trái với điều người nghe chờ đợi từ ý trước.","examples":[{"en":"Online meetings save time, but they can feel less personal.","vi":"Họp trực tuyến tiết kiệm thời gian, nhưng có thể kém gần gũi."}]},{"formula":"S + V, or + S + V","vi":"Hai khả năng, chọn một.","examples":[{"en":"We can meet on Monday, or we can wait until Friday.","vi":"Chúng ta có thể họp thứ Hai, hoặc đợi đến thứ Sáu."}]},{"formula":"S + V, so + S + V","vi":"Ý sau là KẾT QUẢ của ý trước (\"nên, vì thế\").","examples":[{"en":"The printer was broken, so we sent the report by email.","vi":"Máy in hỏng nên chúng tôi gửi báo cáo qua email."}]}]},
  {"t":"rule","formula":"S + V, and / but / or / so + S + V","vi":"and = thêm · but = trái ý · or = lựa chọn · so = kết quả. Một chỗ nối chỉ cần một từ nối."},
  {"t":"h","text":"because · although · while / whereas — mệnh đề phụ (và because of, so that) (Ngày 17 · Ngữ pháp mục 3)"},
  {"t":"patterns","rows":[{"formula":"S + V because + S + V · Because + S + V, S + V","vi":"Nêu NGUYÊN NHÂN (vì). because trả lời câu hỏi \"Why?\".","examples":[{"en":"Many people work from home because it saves travel time.","vi":"Nhiều người làm việc ở nhà vì tiết kiệm thời gian đi lại."},{"en":"Because the room was too small, we moved the meeting to the hall.","vi":"Vì phòng quá nhỏ, chúng tôi chuyển cuộc họp ra hội trường."}]},{"formula":"Although / Though + S + V, S + V","vi":"NHƯỢNG BỘ: dù… (vẫn). Ý chính nằm ở mệnh đề KHÔNG có although.","examples":[{"en":"Although the course was expensive, it was worth every penny.","vi":"Dù khoá học đắt, nó đáng từng đồng."}]},{"formula":"S + V, while / whereas + S + V","vi":"ĐỐI LẬP hai sự việc / hai nhóm (trong khi…). whereas trang trọng hơn — rất hợp Task 1 so sánh số liệu.","examples":[{"en":"Young staff prefer messaging apps, whereas older staff prefer email.","vi":"Nhân viên trẻ thích ứng dụng nhắn tin, trong khi nhân viên lớn tuổi thích email."}]}]},
  {"t":"table","caption":"Ba cặp hay nhầm — nhìn thứ đứng SAU từ nối","head":["Cặp","Theo sau là","Đúng","Sai"],"rows":[["**because** / **because of**","because + **mệnh đề** (S + V) · because of + **danh từ / V-ing**","We stayed in **because of the rain**. / We stayed in **because it rained**.","~~We stayed in because the rain.~~ · ~~because of it rained~~"],["**so** / **so that**","so = **vì thế** (kết quả) · so that = **để mà** (mục đích) + S + can / could / will","She saved money, **so** she was able to travel. (kết quả: đã đi được) · She saved money **so that** she could travel. (mục đích: để có thể đi)","~~She saved money so that she was rich.~~ (giàu là kết quả, không phải mục đích)"],["**although** / **but**","although mở mệnh đề phụ · but nối hai mệnh đề ngang hàng — **không dùng cùng nhau**","**Although** it was late, she kept working.","~~Although it was late, but she kept working.~~"]]},
  {"t":"rule","formula":"Because / Although + S + V, S + V · S + V because / although + S + V · because of + N · so that + S + can / could + V","vi":"Mệnh đề phụ đứng trước → có dấu phẩy. Không ghép although với but, because với so."},
  {"t":"h","text":"Trạng từ liên kết đầu câu và dấu câu: However, … · ; however, … (Ngày 17 · Ngữ pháp mục 4)"},
  {"t":"table","caption":"Năm cách đặt However / Therefore — ba cách đúng, hai cách sai","head":["Cách viết","Đúng / sai","Ví dụ"],"rows":[["Câu. **However,** câu.","✅ chuẩn nhất — dùng cách này","Public transport is cheap. **However,** it is often crowded."],["Câu**; however,** câu.","✅ đúng (trang trọng; ít dùng hơn)","Public transport is cheap**; however,** it is often crowded."],["Câu**, however** câu.","❌ dán hai câu bằng dấu phẩy (comma splice)","~~Public transport is cheap, however it is often crowded.~~"],["**However** câu (thiếu dấu phẩy)","⚠️ thiếu dấu phẩy — dễ bị coi là lỗi dấu câu","~~However it is often crowded.~~ → **However,** it is often crowded."],["S**, however,** V (giữa câu — thêm)","✅ đúng, trang trọng","Public transport, **however,** is often crowded."]]},
  {"t":"rule","formula":"S + V. However, / Therefore, / In addition, + S + V · S + V; however, + S + V","vi":"Trạng từ liên kết đứng đầu câu mới + dấu phẩy. Không bao giờ dán hai câu bằng dấu phẩy."},
  {"t":"h","text":"Chọn từ nối theo CHỨC NĂNG — bảng 7 nhóm (Ngày 17 · Ngữ pháp mục 5)"},
  {"t":"table","caption":"Bảng tra theo chức năng","head":["Chức năng","Trong câu (liên từ và từ nối khác)","Đầu câu / đầu đoạn","Ví dụ"],"rows":[["Thêm ý","and, also (đứng trước động từ thường)","In addition, · Moreover, · Furthermore,","Cycling is cheap. **In addition,** it keeps you fit."],["Đối lập","but · although · while / whereas","However, · In contrast, · On the other hand,","Buses are cheap. **However,** they are slow."],["Nguyên nhân","because + S + V · because of + N","(dùng câu) The main reason is that…","Sales fell **because of** high prices."],["Kết quả","so","Therefore, · As a result,","Rents rose. **As a result,** many students moved out."],["Ví dụ","such as + danh từ","For example, · For instance,","Many apps, **such as** Duolingo, are free. / **For example,** Duolingo is free."],["Trình tự","then","Firstly, · Secondly, · Finally,","**Firstly,** cars pollute the air."],["Kết luận / tổng quan","—","In conclusion, (Task 2) · Overall, (Task 1)","**In conclusion,** both views have merit."]]},
  {"t":"rule","formula":"Thêm: In addition, · Đối lập: However, · Kết quả: Therefore, / As a result, · Ví dụ: For example, · such as + N · Kết luận: In conclusion,","vi":"Gọi tên chức năng trước, rồi mới chọn từ nối."},
  {"t":"h","text":"Lạm dụng từ nối — lỗi đặc trưng của band 5 (Ngày 17 · Ngữ pháp mục 6)"},
  {"t":"table","caption":"8 lỗi lạm dụng / dùng sai hay gặp ở band 4.5–5","head":["Lỗi","Sai","Sửa"],"rows":[["Câu nào cũng mở bằng từ nối","~~Firstly… Moreover… Furthermore… In addition…~~","Khoảng **1 từ nối đầu câu / 2–3 câu**; còn lại dùng and / because / this + N"],["Moreover cho ý không cùng hướng","~~Cars are fast. Moreover, they are expensive.~~","Cars are fast. **However,** they are expensive."],["On the other hand khi không có hai mặt","~~Cars pollute the air. On the other hand, they cause traffic jams.~~ (hai ý cùng xấu)","Cars pollute the air. **In addition,** they cause traffic jams."],["Sai cụm cố định","~~In the other hand~~ · ~~On the other side~~","**On the other hand,**"],["besides / beside","~~Beside, it is cheap.~~ (beside = bên cạnh)","**Besides,** it is cheap. (= ngoài ra — thân mật; bài viết dùng **In addition,**)"],["Firstly of all · Lastly but not least","~~Firstly of all~~ · ~~Lastly but not least~~ (sai cụm) · Last but not least (đúng nhưng sáo rỗng)","**Firstly,** / **First of all,** · **Finally,**"],["Chồng hai từ cùng chức năng","~~In conclusion, to sum up,~~ · ~~But however~~","Chỉ một: **In conclusion,** / **However,**"],["Mở bài sáo rỗng","~~Nowadays, this is a controversial issue.~~","Nói thẳng chủ đề: **Many cities are now banning cars from their centres.**"]]},
  {"t":"rule","formula":"≈ 1 trạng từ liên kết đầu câu / 2–3 câu · đúng chức năng · không chồng hai từ cùng chức năng","vi":"Ít mà đúng > nhiều mà máy móc. Band 5 bị trừ không chỉ vì thiếu mà còn vì lạm dụng hoặc dùng sai."},
  {"t":"h","text":"Gắn kết không chỉ bằng từ nối: this / these + danh từ, lặp từ khoá có chủ ý (Ngày 17 · Ngữ pháp mục 7)"},
  {"t":"table","head":["Cách","Làm thế nào","Ví dụ"],"rows":[["**this / these + danh từ**","Tóm cả ý câu trước vào một danh từ ở đầu câu sau","Many cities have built bike-sharing schemes. **These schemes** are cheap and popular."],["**this + danh từ tóm ý**","Dùng danh từ \"gói\" cả sự việc: this change, this problem, this trend, this decision","Rents doubled in five years. **This increase** forced many families to move."],["**Đại từ** it / they / them","Thay danh từ vừa nhắc (chỉ khi KHÔNG thể hiểu nhầm)","The council opened a new library. **It** is open until 10 p.m."],["**Lặp từ khoá có chủ ý**","Lặp lại từ khoá của đề ở đầu đoạn / câu chủ đề để người đọc không lạc","**Public transport** is cheap… **Public transport** also reduces traffic."]]},
  {"t":"rule","formula":"Câu 1. This / These + N (change, problem, trend, decision…) + V…","vi":"Nối câu bằng danh từ tóm ý — vừa mạch lạc vừa đỡ phải dùng từ nối."},
  {"t":"h","text":"Áp vào bài thi: một đoạn thân bài Task 2 và từ nối khi nói (Ngày 17 · Ngữ pháp mục 8)"},
  {"t":"table","caption":"Mổ xẻ đoạn văn — 6 câu, 3 trạng từ liên kết đầu câu (Firstly · For example · However)","head":["Từ nối / cách nối","Tầng","Chức năng"],"rows":[["Firstly,","đầu câu","trình tự — ý thứ nhất"],["For example,","đầu câu","ví dụ cụ thể (công ty của anh họ)"],["and","trong câu","thêm ý"],["This process","this + danh từ","tóm cả câu trước, không cần từ nối"],["However,","đầu câu","đối lập — điều kiện để làm nhóm hiệu quả"],["because","trong câu","nguyên nhân"],["therefore (giữa câu)","giữa câu","kết quả — đặt giữa câu để đổi nhịp, tránh thêm một từ nối đầu câu"]]},
  {"t":"table","caption":"Khi NÓI (Speaking) — từ nối khác khi VIẾT","head":["Chức năng","Viết (Task 2)","Nói (Part 1, 3)"],"rows":[["Thêm ý","In addition, / Moreover,","Also, … · And another thing is…"],["Đối lập","However, / In contrast,","But… · Then again, … · Having said that, …"],["Kết quả","Therefore, / As a result,","So… · That's why…"],["Ví dụ","For example, / For instance,","For example, … · Like, … (thân mật) · Take my sister, for example…"],["Kết luận","In conclusion,","So, overall, I'd say… · So basically…"]]},
  {"t":"h","text":"Ngôn ngữ họp theo chức năng (Ngày 17 · Nghe mục 2)"},
  {"t":"table","head":["Chức năng","Câu hay dùng","Nghĩa"],"rows":[["Mở họp","Shall we get started? · Let's begin. · The first item on the agenda is…","Ta bắt đầu nhé? · Mục đầu tiên là…"],["Nêu ý kiến","I think we should… · In my view, … · Personally, I'd prefer…","Tôi nghĩ ta nên… · Theo tôi…"],["Đề xuất","I'd suggest + V-ing / that… · What about + V-ing? · We could + V · Why don't we + V?","Tôi đề nghị… · Hay là…?"],["Đồng ý","Exactly. · Fair point. · I agree with Tom there. · That makes sense. · Fine by me.","Chính xác · Có lý · Tôi đồng ý…"],["Phản đối lịch sự","I see your point, but… · I'm not sure about that. · I'm not sure that's the best idea. · That might be difficult because…","Tôi hiểu ý anh, nhưng… · Tôi không chắc…"],["Ngắt lời","Sorry to interrupt, but… · Can I just say something?","Xin lỗi cắt ngang…"],["Hỏi lại cho rõ","Sorry, do you mean…? · What exactly do you mean by…?","Ý anh là…?"],["Giao / nhận việc","Could you…? · Can you take care of…? — I'll do it. · Happy to. · Leave it with me.","Anh làm… được không? — Để tôi."],["Tóm tắt & kết","So, to sum up, … · Let's leave it there. · Shall we meet again on…?","Tóm lại… · Dừng ở đây nhé."]]},
  {"t":"rule","formula":"Đề xuất: I'd suggest + V-ing · Phản đối: I see your point, but + S + V · Nhận việc: I'll + V","vi":"Ba câu khung quan trọng nhất — vừa để nghe ra trong đề, vừa để nói trong họp thật."},
  {"t":"h","text":"Trọng âm câu: từ nội dung và từ chức năng (Ngày 17 · Nói mục 1)"},
  {"t":"table","caption":"Dạng yếu của từ chức năng hay gặp (ôn Ngày 15 — âm yếu /ə/)","head":["Từ","Dạng yếu (trong câu)","Ví dụ"],"rows":[["a · the","/ə/ · /ðə/ (trước nguyên âm: /ði/)","a **cup** of **tea** · the **plan** · the **event** /ði/"],["to · for · of","/tə/ · /fə/ · /əv/","I **want** to **go** · **thanks** for **coming** · a **lot** of **work**"],["and · but · or","/ən/ · /bət/ · /ə/","**fish** and **chips** · **cheap** but **slow**"],["can · do · are · was","/kən/ · /də/ · /ə/ · /wəz/","I can **swim** /kən/ · **Where** do you **work**? /də/"],["you · your · them","/jə/ · /jə/ · /ðəm/","**See** you **later** /jə/ · **Tell** them /ðəm/"]]},
  {"t":"rule","formula":"Nhấn: N · V chính · adj · adv · not / can't · Wh- · Đọc nhẹ: a / the · to / for / of · can / do / are · I / you · and / but","vi":"Từ mang nghĩa → nhấn; từ làm khung → nhẹ (thường /ə/) nhưng KHÔNG bỏ."},
  {"t":"h","text":"Nhịp tiếng Anh: đi theo trọng âm, không theo từng chữ (Ngày 17 · Nói mục 2)"},
  {"t":"table","caption":"Ba câu, cùng 3 nhịp gõ — câu dài hơn chỉ phải nói các từ nhẹ nhanh hơn","head":["Câu","Số nhịp (trọng âm)","Số âm tiết"],"rows":[["**Cats** **eat** **fish**.","3","3"],["The **cats** will **eat** the **fish**.","3","6"],["The **cats** have been **eating** the **fish**.","3","8"]]},
  {"t":"rule","formula":"Trọng âm cách nhau gần đều · âm tiết nhẹ nén lại giữa hai trọng âm","vi":"Đừng nói đều từng chữ như tiếng Việt — gõ nhịp ở từ nội dung."},
  {"t":"h","text":"Khi nào từ chức năng đọc MẠNH? (thêm) (Ngày 17 · Nói mục 3)"},
  {"t":"table","head":["Chỗ","Ví dụ","Đọc"],"rows":[["**Cuối câu**","What are you **looking at**? · Where are you **from**?","at /æt/ · from /frɒm/ (không /ət/, /frəm/)"],["**Câu trả lời ngắn**","Can you swim? — Yes, I **can**.","can /kæn/ (khác \"I can swim\" /kən/)"],["**Nhấn để đối lập**","It's not **for** you, it's **from** you.","for /fɔː/ · from /frɒm/"]]},
  {"t":"rule","formula":"Từ chức năng: yếu trong câu · MẠNH ở cuối câu, trong câu trả lời ngắn, khi nhấn đối lập","vi":"Yes, I can /kæn/ — nhưng I can swim /kən/."},
  {"t":"h","text":"Nhấn để đổi nghĩa (nhập môn) (Ngày 17 · Nói mục 4)"},
  {"t":"table","caption":"Một câu, năm nghĩa ngầm","head":["Câu (từ in đậm = nhấn)","Nghĩa ngầm"],"rows":[["**I** didn't say he took the money.","Người khác nói, không phải tôi."],["I **didn't** say he took the money.","Tôi khẳng định là tôi KHÔNG nói vậy."],["I didn't **say** he took the money.","Tôi không nói ra — có thể tôi chỉ ám chỉ."],["I didn't say **he** took the money.","Tôi không nói là ANH ẤY — có thể người khác lấy."],["I didn't say he took the **money**.","Anh ấy lấy thứ khác, không phải tiền."]]},
  {"t":"rule","formula":"Sửa / so sánh → nhấn MẠNH từ mang thông tin mới: I said Tuesday, not Thursday","vi":"Trong họp và ở Listening, từ được nhấn mạnh thường chính là đáp án đã được sửa."},
  {"t":"h","text":"Nêu ý kiến trong họp: 3 bước + phản hồi lịch sự (Ngày 17 · Nói mục 5)"},
  {"t":"table","caption":"Phản hồi ý kiến người khác — từ đồng ý hẳn đến phản đối lịch sự","head":["Mức độ","Câu nói","Nhấn ở đâu"],"rows":[["Đồng ý hẳn","**Exactly.** · I **completely** agree. · That's a **great** idea.","exactly · completely · great"],["Đồng ý một phần","**Fair** point, but… · I **partly** agree. · That's **true**, but…","fair · partly · true — rồi \"but\" nhẹ"],["Phản đối lịch sự","I **see** your **point**, but… · I'm **not** sure about **that**. · That might be **difficult**, because…","see · point · not · difficult"],["Đề xuất thay thế","**What** about…? · **Why** don't we…? · We could **try**…","what · why · động từ chính sau could (could đọc nhẹ /kəd/)"]]},
  {"t":"rule","formula":"I think we should + V, because + S + V. For example / We could + V · I see your point, but + S + V","vi":"Ý kiến → lý do → đề xuất; phản đối bắt đầu bằng thừa nhận ý người kia."},
  /* ───────── Ngày 18 — Truyền thông · Matching sentence endings · Two-part question ───────── */
{ t: 'h', text: 'Collocation truyền thông — học cả cụm (Ngày 18 · Từ vựng mục 4)' },
  {
    t: 'rule',
    formula: 'go viral · make the headlines · keep up with + N · spread misinformation · check the facts · run a campaign · target + N (không giới từ) · tune in to + N · scroll through + N',
    vi: 'Học và ghi vở cả CỤM; khi viết/nói, lấy nguyên cụm ra dùng thay vì ghép từng chữ.',
  },
  { t: 'h', text: 'Họ từ truyền thông & trọng âm (Ngày 18 · Từ vựng mục 5)' },
  {
    t: 'table',
    caption: 'Chữ in hoa = âm tiết mang trọng âm (Anh-Anh).',
    head: ['Động từ', 'Danh từ', 'Tính từ'],
    rows: [
      ['**AD**vertise', 'ad**VER**tisement (đếm được) · **AD**vertising (không đếm được) · **AD**vertiser', '—'],
      ['in**FORM**', 'infor**MA**tion (không đếm được)', 'in**FOR**mative · in**FORMED**'],
      ['**IN**fluence', '**IN**fluence · **IN**fluencer', 'influ**EN**tial'],
      ['per**SUADE**', 'per**SUA**sion', 'per**SUA**sive'],
      ['**PUB**lish', 'publi**CA**tion · **PUB**lisher', '—'],
    ],
  },
  { t: 'h', text: 'Matching sentence endings — 5 bước (Ngày 18 · Đọc mục 2)' },
  {
    t: 'table',
    head: ['Đầu câu kết thúc bằng…', 'Đuôi phải là…'],
    rows: [
      ['**by / without / after / before** (giới từ)', '**V-ing** hoặc danh từ'],
      ['**to** (mục đích / sau want, help, need…)', '**V nguyên mẫu**'],
      ['**because / when / although / that**', 'một **mệnh đề** đủ S + V'],
      ['**because of / due to**', '**danh từ / cụm danh từ**'],
      ['chủ ngữ số nhiều chưa có động từ', '**động từ** chia số nhiều'],
    ],
  },
  {
    t: 'rule',
    formula: 'Đầu câu (từ khoá) → vị trí trong bài (theo thứ tự) → tự đoán đuôi → loại đuôi sai ngữ pháp → chọn đuôi đúng NGHĨA bài',
    vi: 'Một đuôi đúng phải qua CẢ hai cửa: khớp ngữ pháp với đầu câu và nói đúng điều bài viết khẳng định.',
  },
  { t: 'h', text: 'Two-part question — nhận diện & bố cục 4 đoạn (Ngày 18 · Viết mục 1–3)' },
  {
    t: 'table',
    head: ['Cặp câu hỏi', 'Thân bài 1', 'Thân bài 2'],
    rows: [
      ['**Why…?** + **Is this positive or negative?**', '2 lý do', 'ý kiến rõ (chọn phía) + 2 lý do'],
      ['**What are the causes?** + **What can be done?**', '2 nguyên nhân', '2 giải pháp gắn đúng nguyên nhân'],
      ['**Why…?** + **How…?**', 'lý do', 'cách thức'],
      ['**What…?** + **Do you think…?**', 'liệt kê / mô tả', 'ý kiến Yes / No + lý do'],
      ['**What problems…?** + **How can they be solved?**', '2 vấn đề', '2 giải pháp'],
    ],
  },
  {
    t: 'rule',
    formula: 'Mở bài: paraphrase + answer Q1 + answer Q2 → Body 1 = Q1 → Body 2 = Q2 → Kết bài: In conclusion, + answer Q1 + answer Q2',
    vi: 'Một đoạn — một câu hỏi. Đọc riêng câu đầu mỗi đoạn thân bài phải thấy ngay nó trả lời câu hỏi nào.',
  },
  { t: 'h', text: 'Two-part question — khung câu mở bài, thân bài, kết bài (Ngày 18 · Viết mục 4, 6)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'S + V (paraphrase tình huống) . This is (mainly) because + S + V, and I believe (that) + it is a positive / negative development.',
        vi: 'Mở bài cho cặp Why + Positive / negative.',
        examples: [
          { en: 'More and more people now read the news on their phones. This is mainly because it is fast and free, and I believe it is a largely positive development.', vi: 'Ngày càng nhiều người đọc tin trên điện thoại. Điều này chủ yếu vì nhanh và miễn phí, và tôi tin đó là xu hướng phần lớn tích cực.' },
        ],
      },
      {
        formula: 'There are two main reasons why + S + V. · Firstly, … · Secondly, …',
        vi: 'Câu chủ đề Thân 1 (câu hỏi Why).',
        examples: [
          { en: 'There are two main reasons why companies choose influencers.', vi: 'Có hai lý do chính khiến các công ty chọn người có ảnh hưởng.' },
        ],
      },
      {
        formula: 'However, I believe (that) this trend is more positive / negative than negative / positive. · The main problem / benefit is that + S + V.',
        vi: 'Câu chủ đề Thân 2 (câu hỏi positive / negative) — nói rõ phía ngay câu đầu.',
        examples: [
          { en: 'However, I believe this trend is more negative than positive. The main problem is that the advertising is often hidden.', vi: 'Tuy nhiên, tôi cho rằng xu hướng này tiêu cực nhiều hơn tích cực. Vấn đề chính là quảng cáo thường bị giấu đi.' },
        ],
      },
      {
        formula: 'In conclusion, + S + V (câu trả lời 1, lời khác) . Nevertheless / Overall, I believe + câu trả lời 2.',
        vi: 'Kết bài: tóm lại cả hai câu trả lời, không thêm ý mới.',
        examples: [
          { en: 'In conclusion, companies use influencers because they are cheaper and closer to young customers. Nevertheless, I believe this development is mostly negative.', vi: 'Tóm lại, các công ty dùng người có ảnh hưởng vì rẻ hơn và gần khách hàng trẻ hơn. Tuy vậy, tôi cho rằng xu hướng này chủ yếu tiêu cực.' },
        ],
      },
    ],
  },
  {
    t: 'rule',
    formula: 'Body 1: There are two main reasons why + S + V. · Body 2: However, I believe this trend is more + adj + than + adj. · Kết: In conclusion, … Nevertheless, I believe …',
    vi: 'Câu đầu mỗi thân bài lặp lại TỪ ĐỂ HỎI của đề (why / positive or negative) — giám khảo thấy ngay bạn trả lời đủ.',
  },
];
