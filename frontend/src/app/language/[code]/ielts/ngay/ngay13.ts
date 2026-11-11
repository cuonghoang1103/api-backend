/**
 * Ngày 13 — tự soạn (không chụp sách, 12/11/2026):
 *   Basic Grammar: Động từ khuyết thiếu (can/could/may/might/must/should/have to…)
 *   Basic Vocabulary: Học trực tuyến & học truyền thống
 *   Listening Skills: Listening Part 4 (bài giảng học thuật — note/summary completion)
 *   Homework: dịch có 💡, trắc nghiệm, điền, viết ngắn.
 *
 * Mọi câu ví dụ, kịch bản nghe, câu bài tập đều VIẾT MỚI (xem ../SOAN-BAI.md).
 * Bài nghe Part 4 nói về lịch sử học từ xa — nối với bài từ vựng cùng ngày.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const D13_GRAMMAR: Lesson = {
  id: "d13-ngu-phap",
  kind: "grammar",
  title: "Động từ khuyết thiếu (Modal Verbs): can, could, may, might, must, should, have to…",
  goal: "Dùng đúng động từ khuyết thiếu để nói khả năng, xin phép, bắt buộc, lời khuyên và phỏng đoán; phân biệt mustn't với don't have to; dùng modal để viết câu Task 2 mềm và chính xác hơn.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Modal verbs** (động từ khuyết thiếu) = **can, could, may, might, must, should, will, would** (và các cụm **have to, ought to, need to, be able to**) — đứng trước **động từ nguyên mẫu** để thêm nghĩa: ==khả năng · xin phép · bắt buộc · lời khuyên · phỏng đoán==.",
        "**4 luật vàng**: modal + **V nguyên mẫu** (không to, không -s, không -ed) · phủ định thêm **not** · câu hỏi **đảo modal lên đầu** · **không** đặt hai modal liền nhau.",
        "Bẫy lớn nhất: ==mustn't== = **CẤM** ≠ ==don't have to== = **KHÔNG CẦN** (làm cũng được, không làm cũng được).",
        "Phỏng đoán theo độ chắc: **must** (gần như chắc chắn) > **may / might / could** (có thể) > **can't** (chắc chắn không).",
        "Trong IELTS: **should** để đưa giải pháp (Task 2), **can / may / could** để nói “có thể” cho mềm, **Could you repeat the question?** khi không nghe rõ (Speaking).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Modal verb là gì? Bốn luật vàng" },
    {
      t: "p",
      text: "**Modal verb** (động từ khuyết thiếu, còn gọi là động từ tình thái) là một nhóm động từ **đặc biệt**: chúng **không tự đứng một mình** làm động từ chính, mà đứng **trước một động từ khác** để cho biết thái độ của người nói. So sánh: **I swim.** (Tôi bơi — chỉ nói sự việc) → **I can swim.** (Tôi **biết** bơi — khả năng) → **I must swim today.** (Hôm nay tôi **phải** bơi — bắt buộc) → **I might swim later.** (Lát nữa tôi **có thể** đi bơi — chưa chắc).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Một modal — nhiều nghĩa: 6 nhóm chức năng",
      caption: "Cùng một từ có thể thuộc nhiều nhóm: could vừa là khả năng (quá khứ), vừa là xin phép lịch sự, vừa là phỏng đoán. Nhìn NGỮ CẢNH để biết nghĩa.",
      center: "**Modal verbs** — động từ khuyết thiếu",
      branches: [
        { label: "Khả năng", items: ["can / can't", "could (quá khứ)", "be able to"], anh: "person-swimming" },
        { label: "Xin phép & nhờ", items: ["Can I…?", "Could I…? / May I…?", "Could you…?"], anh: "person-raising-hand" },
        { label: "Bắt buộc & cấm", items: ["must", "have to", "mustn't (cấm)"], anh: "stop-sign" },
        { label: "Không cần", items: ["don't have to", "needn't"], anh: "person-in-bed" },
        { label: "Lời khuyên", items: ["should / shouldn't", "ought to", "had better"], anh: "light-bulb" },
        { label: "Phỏng đoán", items: ["must (chắc chắn)", "may / might / could", "can't (không thể nào)"], anh: "thinking-face" },
      ],
    },
    {
      t: "table",
      caption: "Các modal hay gặp nhất trong IELTS",
      head: ["Modal", "Nghĩa chính", "Ví dụ"],
      rows: [
        ["**can**", "có thể, biết (khả năng); được phép (thân mật)", "She **can** speak three languages."],
        ["**could**", "đã có thể (quá khứ); xin phép/nhờ lịch sự; có lẽ", "**Could** you open the window, please?"],
        ["**may**", "được phép (trang trọng); có lẽ (~50%)", "Students **may** use a dictionary. / It **may** rain later."],
        ["**might**", "có lẽ, có thể (kém chắc hơn may một chút)", "I **might** study abroad next year."],
        ["**must**", "phải (người nói thấy cần); chắc hẳn là", "You **must** be tired after the flight."],
        ["**have to**", "phải (do luật lệ, hoàn cảnh bên ngoài)", "I **have to** wear a uniform at work."],
        ["**should**", "nên (lời khuyên, giải pháp)", "The government **should** build more libraries."],
        ["**ought to**", "nên (= should, trang trọng hơn một chút)", "We **ought to** recycle more."],
        ["**will / would**", "sẽ / sẽ (giả định, lịch sự)", "I **would** like to work in a hospital."],
        ["**need to / needn't**", "cần / không cần", "You **needn't** bring food — lunch is provided."],
      ],
    },
    {
      t: "table",
      caption: "Bốn luật vàng — sai một luật là mất điểm Ngữ pháp (Grammatical Range & Accuracy)",
      head: ["Luật", "Đúng", "Sai"],
      rows: [
        ["1. Sau modal là **V nguyên mẫu không to**", "She can **swim**.", "~~She can to swim.~~ / ~~She can swims.~~"],
        ["2. Modal **không thêm -s** với he / she / it", "He **must** leave now.", "~~He musts leave now.~~"],
        ["3. Phủ định: modal + **not** (không mượn do/does)", "You **should not (shouldn't)** worry.", "~~You don't should worry.~~"],
        ["4. Câu hỏi: **đảo modal lên trước chủ ngữ**", "**Can** you help me?", "~~Do you can help me?~~"],
        ["5. (thêm) **Không** đặt hai modal liền nhau", "I **will be able to** come.", "~~I will can come.~~"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + modal + V",
          vi: "Khẳng định — modal giữ nguyên với mọi chủ ngữ.",
          examples: [
            { en: "My brother can fix computers.", vi: "Anh tôi biết sửa máy tính." },
            { en: "You should drink more water.", vi: "Bạn nên uống nhiều nước hơn." },
          ],
        },
        {
          formula: "S + modal + not + V",
          vi: "Phủ định — viết tắt: can't, couldn't, mustn't, shouldn't, won't (= will not). Riêng cannot viết LIỀN.",
          examples: [
            { en: "I can't find my keys.", vi: "Tôi không tìm thấy chìa khoá." },
            { en: "Children shouldn't use phones before bed.", vi: "Trẻ em không nên dùng điện thoại trước khi ngủ." },
          ],
        },
        {
          formula: "Modal + S + V…? · Wh- + modal + S + V?",
          vi: "Câu hỏi — đảo modal lên đầu, không dùng do / does.",
          examples: [
            { en: "Could you speak more slowly, please?", vi: "Bạn có thể nói chậm hơn được không?" },
            { en: "What should I do if I miss the bus?", vi: "Tôi nên làm gì nếu lỡ xe buýt?" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba “modal giả” chia như động từ thường",
      items: [
        "**have to**, **need to**, **be able to** có nghĩa giống modal nhưng **chia như động từ thường**: She **has to** go. · **Does** she **have to** go? · She **doesn't have to** go. · I **was able to** finish.",
        "Nhờ vậy chúng **đi sau một modal khác** được, còn modal thật thì không: **will have to** (sẽ phải), **will be able to** (sẽ có thể), **might need to** (có lẽ cần).",
        "**ought to** là modal thật nhưng **có to**: You **ought to** rest. Phủ định: **ought not to** (ít dùng — người ta hay nói shouldn't).",
        "**cannot** viết liền thành một từ (không viết ~~can not~~ trong câu thường). Dạng tắt: **can't** /kɑːnt/.",
      ],
    },
    {
      t: "rule",
      formula: "S + modal (can / could / may / might / must / should / will / would) + V · S + modal + not + V · Modal + S + V?",
      vi: "Modal không đổi theo chủ ngữ, theo sau là động từ nguyên mẫu không to; phủ định và câu hỏi không mượn do/does.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-luat",
      title: "Dịch sang tiếng Anh — 4 luật vàng của modal (4 câu)",
      kind: "translate",
      grammar: "S + modal + V nguyên mẫu (không to, không -s) · S + modal + not + V · Modal + S + V? Sau modal khác thì dùng be able to / have to.",
      items: [
        { q: "Em gái tôi có thể nói tiếng Nhật.", hint: "My sister, can, speak Japanese", answers: ["My sister can speak Japanese.", "My younger sister can speak Japanese.", "My little sister can speak Japanese."] },
        { q: "Bạn không nên thức khuya trước kỳ thi.", hint: "You, should not / shouldn't, stay up late, before the exam", answers: ["You shouldn't stay up late before the exam.", "You should not stay up late before the exam.", "You shouldn't stay up late before an exam.", "You should not stay up late before an exam.", "You shouldn't stay up late before the test.", "You should not stay up late before the test."] },
        { q: "Bạn có thể giúp tôi mang cái túi này không?", hint: "Can / Could, you help me, carry this bag", answers: ["Can you help me carry this bag?", "Could you help me carry this bag?", "Can you help me to carry this bag?", "Could you help me to carry this bag?", "Can you help me with this bag?", "Could you help me with this bag?"] },
        { q: "Năm sau tôi sẽ có thể lái xe.", hint: "will be able to (không dùng will can), drive, next year", answers: ["I will be able to drive next year.", "I'll be able to drive next year.", "Next year I will be able to drive.", "Next year, I will be able to drive.", "Next year I'll be able to drive.", "Next year, I'll be able to drive."] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Khả năng (ability): can · could · be able to" },
    {
      t: "p",
      text: "Nói về việc **biết làm / làm được** một việc. Mỗi thời dùng một dạng khác nhau — xem trục thời gian bên dưới. Đây là nhóm hay gặp nhất ở **Speaking Part 1** (Can you cook? Can you swim?) và **Part 2** khi kể chuyện quá khứ (I could… / I was able to…).",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Khả năng theo thời gian",
      caption: "Quá khứ: could (khả năng chung) / was able to (làm được một lần cụ thể). Hiện tại: can. Tương lai: will be able to — KHÔNG có “will can”.",
      marks: [
        { from: -9, to: -3, label: "**could** / couldn't — khả năng chung trong quá khứ", kieu: "doan", mau: 1 },
        { from: -5, label: "**was able to** — làm được MỘT lần cụ thể", kieu: "diem", mau: 1 },
        { from: -1, to: 1, label: "**can** / can't — bây giờ", kieu: "doan", mau: 2 },
        { from: 4, to: 9, label: "**will be able to** — tương lai", kieu: "doan", mau: 3 },
      ],
    },
    {
      t: "table",
      head: ["Thời", "Khẳng định", "Phủ định", "Câu hỏi"],
      rows: [
        ["Hiện tại", "I **can** cook.", "I **can't / cannot** cook.", "**Can** you cook?"],
        ["Quá khứ (khả năng chung)", "At five, I **could** read.", "I **couldn't** read.", "**Could** you read at five?"],
        ["Quá khứ (một lần làm được)", "I **was able to** pass the test.", "I **wasn't able to** pass.", "**Were** you **able to** pass?"],
        ["Tương lai", "I **will be able to** drive.", "I **won't be able to** drive.", "**Will** you **be able to** drive?"],
        ["Hiện tại hoàn thành (thêm)", "I **have been able to** save money.", "I **haven't been able to** sleep.", "**Have** you **been able to**…?"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: could hay was able to?",
      items: [
        "**could** = khả năng **chung, kéo dài** trong quá khứ: When I was ten, I **could** climb trees very fast. (Hồi mười tuổi tôi trèo cây rất nhanh.)",
        "Một lần **làm được** việc khó trong một tình huống cụ thể → **was / were able to** hoặc **managed to**: The road was flooded, but we **were able to** get home. (~~we could get home~~ nghe sai với người bản xứ.)",
        "Ở **phủ định** thì dùng cả hai đều được: We **couldn't / weren't able to** get home.",
        "Với giác quan (see, hear, smell, understand, remember) dùng **could** được cả cho một lần: I **could hear** music from next door.",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + can / can't + V (hiện tại) · S + could / couldn't + V (quá khứ)",
          vi: "Trả lời câu hỏi khả năng ở Speaking Part 1 — kèm một chi tiết.",
          examples: [
            { en: "Yes, I can cook quite well. I can make pho and a few simple soups.", vi: "Có, tôi nấu ăn khá được. Tôi biết nấu phở và vài món canh đơn giản." },
            { en: "When I was a child, I couldn't swim, so I was afraid of the sea.", vi: "Hồi nhỏ tôi không biết bơi nên tôi sợ biển." },
          ],
        },
        {
          formula: "S + was / were able to + V · S + will be able to + V",
          vi: "Làm được một lần cụ thể trong quá khứ · khả năng trong tương lai.",
          examples: [
            { en: "After three months of practice, I was able to run five kilometres.", vi: "Sau ba tháng luyện tập, tôi đã chạy được năm cây số." },
            { en: "With a degree in nursing, she will be able to work abroad.", vi: "Có bằng điều dưỡng, cô ấy sẽ có thể làm việc ở nước ngoài." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Hiện tại: S + can + V · Quá khứ: S + could / was able to + V · Tương lai: S + will be able to + V",
      vi: "Một lần làm được việc khó trong quá khứ → was able to / managed to, không phải could.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-kha-nang",
      title: "Dịch sang tiếng Anh — khả năng (5 câu)",
      kind: "translate",
      grammar: "can / can't + V (hiện tại) · could / couldn't + V (quá khứ, khả năng chung) · was / were able to + V (một lần làm được) · will be able to + V (tương lai).",
      items: [
        { q: "Bạn có biết chơi đàn ghi-ta không?", hint: "Can you, play the guitar", answers: ["Can you play the guitar?", "Can you play guitar?"] },
        { q: "Hồi năm tuổi tôi đã biết đọc.", hint: "When I was five, could, read", answers: ["When I was five, I could read.", "When I was five I could read.", "I could read when I was five.", "When I was five years old, I could read.", "When I was five years old I could read.", "I could read when I was five years old."] },
        { q: "Hôm qua trời mưa to nhưng chúng tôi vẫn về nhà được.", hint: "It rained heavily yesterday, but, were able to / managed to, get home", answers: ["It rained heavily yesterday, but we were able to get home.", "It rained heavily yesterday but we were able to get home.", "It rained heavily yesterday, but we managed to get home.", "It rained heavily yesterday but we managed to get home.", "Yesterday it rained heavily, but we were able to get home.", "Yesterday it rained heavily, but we managed to get home.", "It rained a lot yesterday, but we were able to get home.", "It rained a lot yesterday, but we managed to get home."] },
        { q: "Ông tôi không thể nghe rõ nếu bạn nói nhỏ.", hint: "My grandfather, can't / cannot, hear clearly, if you speak quietly", answers: ["My grandfather can't hear clearly if you speak quietly.", "My grandfather cannot hear clearly if you speak quietly.", "My grandfather can't hear clearly if you speak softly.", "My grandfather cannot hear clearly if you speak softly.", "My grandpa can't hear clearly if you speak quietly.", "My grandad can't hear clearly if you speak quietly."] },
        { q: "Sau khóa học này, bạn sẽ có thể viết một bài luận hoàn chỉnh.", hint: "After this course, will be able to, write a complete essay", answers: ["After this course, you will be able to write a complete essay.", "After this course you will be able to write a complete essay.", "After this course, you'll be able to write a complete essay.", "After this course you'll be able to write a complete essay.", "After this course, you will be able to write a full essay.", "After this course, you'll be able to write a full essay."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Xin phép, nhờ vả, đề nghị giúp" },
    {
      t: "p",
      text: "Nhóm này dùng hằng ngày và **ngay trong phòng thi Speaking**. Điểm cần nhớ: trong câu hỏi xin phép / nhờ, **could không mang nghĩa quá khứ** — nó chỉ **lịch sự hơn** can.",
    },
    {
      t: "table",
      head: ["Mục đích", "Câu", "Mức lịch sự", "Trả lời"],
      rows: [
        ["Xin phép mình làm gì", "**Can I** borrow your pen?", "thân mật (bạn bè)", "Sure. / Of course. / Go ahead."],
        ["Xin phép mình làm gì", "**Could I** ask a question?", "lịch sự (thầy cô, giám khảo)", "Yes, of course."],
        ["Xin phép mình làm gì", "**May I** come in?", "trang trọng nhất", "Yes, you may. / Please do."],
        ["Nhờ người khác làm", "**Can you / Could you** help me?", "could lịch sự hơn", "Sure, no problem. / I'm afraid I can't."],
        ["Nhờ người khác làm", "**Would you** close the door, please?", "lịch sự", "Of course."],
        ["Nhờ (rất lịch sự — thêm)", "**Would you mind** opening the window?", "rất lịch sự; sau mind là V-ing", "Not at all. (= không phiền, tôi làm ngay)"],
        ["Đề nghị giúp người khác", "**Shall I** carry that for you? / **Can I** help?", "thân thiện", "Yes, please. / No, thanks, I'm fine."],
        ["Cho phép / không cho phép", "You **can / may** leave early. · You **can't / may not** use your phone.", "may trang trọng (nội quy)", "—"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi xin phép",
      items: [
        "Trả lời ~~Yes, you could.~~ khi ai đó hỏi “Could I…?” → nói **Yes, of course. / Sure, go ahead.** (could chỉ dùng ở câu hỏi cho lịch sự.)",
        "“**Would you mind…?**” mà trả lời ~~Yes~~ là **từ chối** (Yes = tôi CÓ phiền). Đồng ý thì nói **No, not at all. / Of course not.**",
        "Sau **would you mind** là **V-ing**: ~~Would you mind to open…~~ → **Would you mind opening…**",
        "Đừng chỉ nói “**Repeat, please.**” với giám khảo — cụt và thiếu lịch sự. Dùng câu đầy đủ ở bảng dưới.",
      ],
    },
    {
      t: "table",
      caption: "Mẹo phòng thi: 5 câu dùng modal giúp bạn “thoát hiểm” ở Speaking (không bị trừ điểm)",
      head: ["Tình huống", "Câu nên nói"],
      rows: [
        ["Không nghe rõ câu hỏi", "**Could you repeat the question, please?** / Sorry, **could you say that again**?"],
        ["Không hiểu một từ (Part 3)", "**Could you explain what** “sustainable” **means**, please?"],
        ["Cần vài giây suy nghĩ", "That's an interesting question. **Let me think**… / **I'd say**…"],
        ["Part 2 — muốn bắt đầu", "**Shall I start now?** / **May I** begin?"],
        ["Không biết câu trả lời chắc chắn", "I'm not sure, but I **think** it **might be**… / It **could be** because…"],
      ],
    },
    {
      t: "rule",
      formula: "Can / Could / May + I + V? (xin phép) · Can / Could / Would + you + V? (nhờ) · Would you mind + V-ing? · Shall I + V? (đề nghị giúp)",
      vi: "could / would trong câu hỏi = lịch sự, không phải quá khứ. may = trang trọng nhất.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-xin-phep",
      title: "Dịch sang tiếng Anh — xin phép & nhờ vả (4 câu)",
      kind: "translate",
      grammar: "Could I + V? (xin phép lịch sự) · Could you + V, please? (nhờ) · Would you mind + V-ing? · Shall I + V? (đề nghị giúp).",
      items: [
        { q: "Bạn có thể nhắc lại câu hỏi được không ạ?", hint: "Could you, repeat the question, please", answers: ["Could you repeat the question, please?", "Could you repeat the question please?", "Could you please repeat the question?", "Can you repeat the question, please?", "Can you repeat the question please?", "Can you please repeat the question?"] },
        { q: "Em có thể dùng từ điển trong giờ kiểm tra không ạ?", hint: "May I / Could I, use a dictionary, during the test", answers: ["May I use a dictionary during the test?", "Could I use a dictionary during the test?", "Can I use a dictionary during the test?", "May I use a dictionary during the exam?", "Could I use a dictionary during the exam?", "Can I use a dictionary during the exam?"] },
        { q: "Bạn có phiền mở cửa sổ không?", hint: "Would you mind, opening (V-ing), the window", answers: ["Would you mind opening the window?", "Would you mind opening the window, please?", "Would you mind opening the window please?"] },
        { q: "Để tôi xách cái va li đó giúp bạn nhé?", hint: "Shall I, carry, that suitcase, for you", answers: ["Shall I carry that suitcase for you?", "Shall I carry the suitcase for you?", "Can I carry that suitcase for you?", "Should I carry that suitcase for you?"] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Bắt buộc, cấm đoán và “không cần”: must · have to · mustn't · don't have to" },
    {
      t: "p",
      text: "Đây là phần **người Việt sai nhiều nhất**, vì tiếng Việt “không phải” có thể là **cấm** hoặc **không cần**. Tiếng Anh tách hẳn thành hai từ khác nhau.",
    },
    {
      t: "table",
      head: ["Dạng", "Nghĩa", "Ví dụ", "Dịch"],
      rows: [
        ["**must** + V", "phải (người nói thấy cần; nội quy viết)", "I **must** call my mum tonight. / Passengers **must** wear seat belts.", "Tối nay tôi phải gọi cho mẹ. / Hành khách phải thắt dây an toàn."],
        ["**have to / has to** + V", "phải (do luật, công việc, hoàn cảnh bên ngoài)", "Nurses **have to** work at night. / She **has to** take two buses to school.", "Y tá phải làm đêm. / Cô ấy phải đi hai chuyến xe buýt đến trường."],
        ["**mustn't** + V", "**CẤM**, không được làm", "You **mustn't** use your phone in the exam room.", "Bạn không được dùng điện thoại trong phòng thi."],
        ["**don't / doesn't have to** + V", "**KHÔNG CẦN**, không bắt buộc (làm cũng được)", "You **don't have to** bring a pen — we provide them.", "Bạn không cần mang bút — chúng tôi có sẵn."],
        ["**needn't** + V / **don't need to** + V", "không cần (= don't have to)", "You **needn't** print the form.", "Bạn không cần in mẫu đơn."],
        ["**had to** + V", "đã phải (quá khứ của CẢ must và have to)", "I **had to** retake the exam last year.", "Năm ngoái tôi đã phải thi lại."],
        ["**will have to** + V", "sẽ phải", "You **will have to** show your passport.", "Bạn sẽ phải trình hộ chiếu."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "mustn't ≠ don't have to",
      caption: "Hỏi lại mình: “Nếu làm thì có sao không?” Có sao (bị phạt, nguy hiểm) → mustn't. Không sao, chỉ là không bắt buộc → don't have to.",
      cols: [
        {
          title: "**mustn't** = CẤM",
          anh: "no-mobile-phones",
          items: [
            "Làm là **sai**, có thể bị phạt",
            "You **mustn't** use your phone during the test.",
            "Students **mustn't** copy answers.",
            "Gần nghĩa: **can't**, **are not allowed to**",
          ],
        },
        {
          title: "**don't have to** = KHÔNG CẦN",
          anh: "person-in-bed",
          items: [
            "Làm **cũng được**, không làm **cũng được**",
            "I **don't have to** get up early on Sundays.",
            "You **don't have to** pay — it's free.",
            "Gần nghĩa: **needn't**, **don't need to**",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: must hay have to?",
      items: [
        "**must** = chính **người nói** thấy cần (I **must** study harder — tôi tự thấy phải cố hơn) hoặc **nội quy viết trang trọng** (All visitors **must** sign in).",
        "**have to** = **bên ngoài** bắt buộc: luật, lịch trình, công việc (I **have to** start work at 7 — công ty quy định). Trong **nói hằng ngày**, have to phổ biến hơn must.",
        "**must không có quá khứ**: ~~I musted~~ → **I had to** go to hospital last week.",
        "**have to chia theo chủ ngữ**: He **has to** · **Does** he **have to**…? · He **doesn't have to**… (~~He doesn't has to~~, ~~He haves to~~).",
        "Câu hỏi: **Do I have to**…? tự nhiên hơn ~~Must I…?~~ (nghe cổ và trang trọng).",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + must / have to / has to + V",
          vi: "Bắt buộc. Task 2: chỉ dùng must khi bạn thật sự muốn nói “bắt buộc” — dùng nhiều nghe như ra lệnh.",
          examples: [
            { en: "In many countries, children have to stay at school until they are sixteen.", vi: "Ở nhiều nước, trẻ em phải đi học đến năm mười sáu tuổi." },
          ],
        },
        {
          formula: "S + mustn't + V (cấm) · S + don't / doesn't have to + V (không cần)",
          vi: "Hai nghĩa khác hẳn nhau — chọn sai là đổi ý cả câu.",
          examples: [
            { en: "You mustn't swim here. The water is too deep.", vi: "Bạn không được bơi ở đây. Nước quá sâu." },
            { en: "Online students don't have to travel to the campus.", vi: "Sinh viên học trực tuyến không cần đi đến trường." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "must / have to + V = phải · mustn't + V = CẤM · don't have to / needn't + V = KHÔNG CẦN · had to + V = đã phải",
      vi: "Hỏi: “làm thì có sao không?” — có sao → mustn't; không sao → don't have to.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-bat-buoc",
      title: "Dịch sang tiếng Anh — bắt buộc, cấm, không cần (5 câu)",
      kind: "translate",
      grammar: "must / have to / has to + V · mustn't + V (cấm) · don't / doesn't have to + V (không cần) · had to + V (đã phải).",
      items: [
        { q: "Bạn không được hút thuốc trong bệnh viện.", hint: "You, mustn't / must not, smoke, in the hospital", answers: ["You mustn't smoke in the hospital.", "You must not smoke in the hospital.", "You mustn't smoke in hospital.", "You must not smoke in hospital.", "You can't smoke in the hospital.", "You cannot smoke in the hospital."] },
        { q: "Bạn không cần đặt bàn trước — nhà hàng còn nhiều chỗ.", hint: "You don't have to / needn't, book a table, the restaurant has a lot of space", answers: ["You don't have to book a table. The restaurant has a lot of space.", "You don't have to book a table — the restaurant has a lot of space.", "You don't have to book a table; the restaurant has a lot of space.", "You needn't book a table. The restaurant has a lot of space.", "You don't need to book a table. The restaurant has a lot of space.", "You don't have to book a table. The restaurant has plenty of space.", "You needn't book a table. The restaurant has plenty of space.", "You don't need to book a table. The restaurant has plenty of space."] },
        { q: "Mẹ tôi phải dậy lúc năm giờ để đi làm.", hint: "My mother (số ít → has to), get up, at five, to go to work", answers: ["My mother has to get up at five to go to work.", "My mum has to get up at five to go to work.", "My mom has to get up at five to go to work.", "My mother has to get up at 5 to go to work.", "My mother has to get up at five o'clock to go to work.", "My mother has to wake up at five to go to work."] },
        { q: "Tuần trước tôi đã phải làm thêm giờ ba ngày.", hint: "had to (quá khứ), work overtime, three days, last week", answers: ["I had to work overtime three days last week.", "Last week I had to work overtime three days.", "Last week, I had to work overtime three days.", "I had to work overtime for three days last week.", "Last week I had to work overtime for three days.", "Last week, I had to work overtime for three days."] },
        { q: "Cô ấy có phải mặc đồng phục đi làm không?", hint: "Does she have to, wear a uniform, at work / to work", answers: ["Does she have to wear a uniform at work?", "Does she have to wear a uniform to work?", "Does she have to wear uniform at work?", "Does she have to wear a uniform for work?"] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Lời khuyên & giải pháp: should · ought to · had better" },
    {
      t: "p",
      text: "**should** là modal quan trọng nhất của **Writing Task 2**: đề hỏi “What should be done?”, “What can governments do?” thì câu trả lời gần như luôn có should. Ở Speaking, dùng should để khuyên bạn bè hoặc nói điều mình nghĩ là đúng.",
    },
    {
      t: "table",
      head: ["Dạng", "Mức độ", "Ví dụ", "Dịch"],
      rows: [
        ["**should / shouldn't** + V", "lời khuyên, ý kiến (phổ biến nhất)", "Students **should** take regular breaks.", "Học sinh nên nghỉ giải lao đều đặn."],
        ["**ought to** + V", "= should, hơi trang trọng; hay dùng cho bổn phận", "Parents **ought to** read to their children.", "Cha mẹ nên đọc sách cho con nghe."],
        ["**had better ('d better)** + V", "**cảnh báo mạnh**: không làm thì gặp rắc rối", "You**'d better** leave now, or you'll miss the train.", "Bạn nên đi ngay, không thì lỡ tàu đấy."],
        ["**had better not** + V", "cảnh báo đừng làm", "You**'d better not** be late again.", "Tốt nhất là đừng đến muộn nữa."],
        ["I think / I don't think + S + should + V", "khuyên nhẹ nhàng", "I **don't think** you **should** buy it.", "Tôi nghĩ bạn không nên mua nó."],
        ["If I were you, I would + V (thêm)", "khuyên bằng cách đặt mình vào vị trí người khác", "**If I were you, I would** talk to the teacher.", "Nếu tôi là bạn, tôi sẽ nói chuyện với thầy."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với should / had better",
      items: [
        "~~should to~~ → **should + V**: The government **should invest** more. Ngược lại **ought** bắt buộc có **to**: ~~ought invest~~ → **ought to invest**.",
        "**had better** KHÔNG phải quá khứ — nó nói về **bây giờ / tương lai gần**. Sau nó là **V nguyên mẫu**: ~~had better to go~~ → **had better go**. Phủ định: **had better not go** (~~hadn't better~~).",
        "Đừng dùng **had better** trong Writing Task 2 hay với giám khảo: nghe như **đe doạ**. Viết bài thì dùng **should / ought to**.",
        "Tiếng Anh thích “**I don't think** you should…” hơn “I think you shouldn't…” (cả hai đúng, nhưng câu đầu tự nhiên hơn).",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Governments / Schools / Parents + should + V + so that / in order to + …",
          vi: "Câu GIẢI PHÁP cho Task 2 — ai nên làm gì, để làm gì.",
          examples: [
            { en: "Schools should teach students how to manage money so that they can avoid debt later.", vi: "Trường học nên dạy học sinh cách quản lý tiền để sau này các em tránh được nợ nần." },
            { en: "The government ought to provide free Wi-Fi in rural areas in order to support online learners.", vi: "Chính phủ nên cung cấp Wi-Fi miễn phí ở vùng nông thôn để hỗ trợ người học trực tuyến." },
          ],
        },
        {
          formula: "It is important that… → S + should + V (cách nói khác: It is essential / advisable for + O + to V)",
          vi: "Cách đổi giọng cho đỡ lặp should trong một bài viết.",
          examples: [
            { en: "It is essential for young people to learn basic first aid.", vi: "Người trẻ cần thiết phải học sơ cứu cơ bản." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + should / ought to + V (nên) · S + had better (not) + V (cảnh báo) · I don't think + S + should + V",
      vi: "Task 2: should / ought to để đưa giải pháp; had better chỉ dùng khi nói chuyện thân mật.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-khuyen",
      title: "Dịch sang tiếng Anh — lời khuyên & giải pháp (5 câu)",
      kind: "translate",
      grammar: "S + should / ought to + V · had better (not) + V · I don't think + S + should + V · … so that + S + can + V.",
      items: [
        { q: "Bạn nên ngủ đủ tám tiếng mỗi đêm.", hint: "You should, get / sleep, eight hours, every night", answers: ["You should get eight hours of sleep every night.", "You should sleep eight hours every night.", "You should sleep for eight hours every night.", "You should get eight hours' sleep every night.", "You should sleep eight hours a night.", "You should get eight hours of sleep a night."] },
        { q: "Chính phủ nên xây thêm thư viện ở vùng nông thôn.", hint: "The government, should / ought to, build more libraries, in rural areas", answers: ["The government should build more libraries in rural areas.", "The government ought to build more libraries in rural areas.", "Governments should build more libraries in rural areas.", "Governments ought to build more libraries in rural areas.", "The government should build more libraries in the countryside.", "The government ought to build more libraries in the countryside."] },
        { q: "Tốt nhất là bạn mang theo áo mưa, trời sắp mưa đấy.", hint: "You'd better / You had better, take / bring a raincoat; It's going to rain", answers: ["You'd better take a raincoat. It's going to rain.", "You had better take a raincoat. It's going to rain.", "You'd better take a raincoat because it's going to rain.", "You had better take a raincoat because it's going to rain.", "You'd better bring a raincoat. It's going to rain.", "You had better bring a raincoat. It's going to rain.", "You'd better take a raincoat, it's going to rain.", "You'd better bring a raincoat because it's going to rain."] },
        { q: "Tôi nghĩ bạn không nên bỏ học.", hint: "I don't think, you should, drop out of school / quit school", answers: ["I don't think you should drop out of school.", "I don't think you should quit school.", "I don't think you should leave school.", "I do not think you should drop out of school.", "I think you shouldn't drop out of school.", "I think you should not drop out of school."] },
        { q: "Trường học nên dạy kỹ năng sống để học sinh có thể tự lập.", hint: "Schools should teach life skills, so that, students can, be independent", answers: ["Schools should teach life skills so that students can be independent.", "Schools should teach life skills so that students can become independent.", "Schools should teach life skills so students can be independent.", "Schools ought to teach life skills so that students can be independent.", "Schools should teach life skills so that students can live independently.", "Schools should teach life skills so that their students can be independent."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Phỏng đoán (deduction): must · may · might · could · can't" },
    {
      t: "p",
      text: "Khi **không biết chắc** một việc, người Anh dùng modal để cho biết mình **chắc đến đâu**. Đây là nghĩa thứ hai, rất hay gặp, của **must** và **can't** — và là nơi đề **Listening** hay giăng bẫy: người nói dùng **might / may** cho thông tin **chưa chắc**, rồi sau đó mới nói thông tin chắc chắn.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Thang độ chắc chắn (từ thấp lên cao)",
      caption: "Phỏng đoán ở hiện tại: modal + V (be). Trái nghĩa của must (chắc chắn đúng) là can't (chắc chắn sai) — KHÔNG phải mustn't.",
      steps: [
        { label: "**can't** + V", sub: "≈ 0% — chắc chắn KHÔNG: He can't be at home; his car isn't here." },
        { label: "**might / could** + V", sub: "≈ 30–40% — có thể, chưa chắc: She might be in the library." },
        { label: "**may** + V", sub: "≈ 50% — có lẽ: The shop may be closed today." },
        { label: "**should** + V", sub: "≈ 70% — dự đoán hợp lý: The bus should arrive soon." },
        { label: "**must** + V", sub: "≈ 95% — gần như chắc chắn, có bằng chứng: You must be tired." },
        { label: "is / will (thì thường)", sub: "100% — biết chắc: The library is closed on Sundays." },
      ],
    },
    {
      t: "table",
      head: ["Modal", "Độ chắc", "Ví dụ (có bằng chứng)", "Dịch"],
      rows: [
        ["**must** + V", "gần như chắc chắn ĐÚNG", "The lights are off. They **must be** asleep.", "Đèn tắt rồi. Chắc hẳn họ ngủ rồi."],
        ["**may / might / could** + V", "có thể đúng, có thể sai", "Take an umbrella. It **might rain** this afternoon.", "Mang ô theo. Chiều nay có thể mưa."],
        ["**may not / might not** + V", "có thể KHÔNG", "He **may not know** the answer.", "Có thể anh ấy không biết câu trả lời."],
        ["**can't / couldn't** + V", "gần như chắc chắn SAI", "That **can't be** Lan. She's in Japan this week.", "Đó không thể là Lan được. Tuần này cô ấy ở Nhật."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi phỏng đoán",
      items: [
        "Trái nghĩa của **must** (chắc là đúng) là **can't** (không thể nào): ~~He mustn't be hungry; he just ate.~~ → **He can't be hungry; he just ate.** (mustn't chỉ có nghĩa CẤM.)",
        "**may not** (có thể không) ≠ **can't** (chắc chắn không): The test **may not** be difficult. (chưa biết) / The test **can't** be difficult — it's for children. (chắc chắn không khó).",
        "Trong câu phỏng đoán, **could** KHÔNG phải quá khứ: It **could** be true. = Có thể là thật (bây giờ).",
        "Nâng cao (band 6+): phỏng đoán **quá khứ** dùng **modal + have + V3**: She **must have missed** the bus. (Chắc cô ấy đã lỡ xe buýt.) · I **might have left** my wallet at home. · He **can't have seen** us. Dạng này bạn sẽ gặp lại khi học thì hoàn thành.",
      ],
    },
    {
      t: "note",
      title: "Mẹo Listening: may / might = thông tin CHƯA chốt",
      items: [
        "Người nói: “We **might** hold the meeting in Room 4… actually no, it'll be in the main hall.” → đáp án là **main hall**, không phải Room 4.",
        "Khi nghe **might, may, could, possibly, perhaps**, hãy **chờ tiếp**: thông tin chắc chắn (will, is, definitely, actually) thường theo ngay sau.",
        "Ngược lại, **must** trong lời giảng (Part 4) thường đánh dấu **ý quan trọng**: “Students **must** submit the report by Friday.”",
      ],
    },
    {
      t: "rule",
      formula: "must + V (chắc chắn đúng) · may / might / could + V (có thể) · can't + V (chắc chắn sai)",
      vi: "Phỏng đoán dựa vào bằng chứng. Không dùng mustn't để nói “chắc là không”.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-phong-doan",
      title: "Dịch sang tiếng Anh — phỏng đoán (5 câu)",
      kind: "translate",
      grammar: "must + be / V (chắc hẳn) · may / might / could + V (có thể) · can't + be / V (không thể nào) · may not / might not + V (có thể không).",
      items: [
        { q: "Bạn chắc hẳn là mệt lắm sau chuyến bay dài.", hint: "You must be, very tired, after the long flight", answers: ["You must be very tired after the long flight.", "You must be really tired after the long flight.", "You must be very tired after such a long flight.", "You must be so tired after the long flight.", "You must be very tired after a long flight.", "You must be really tired after a long flight."] },
        { q: "Chiều nay trời có thể mưa.", hint: "It, might / may / could, rain, this afternoon", answers: ["It might rain this afternoon.", "It may rain this afternoon.", "It could rain this afternoon.", "This afternoon it might rain.", "This afternoon, it might rain.", "This afternoon it may rain."] },
        { q: "Đó không thể là anh trai cô ấy được — anh ấy đang ở Úc.", hint: "That can't be, her brother; He is in Australia", answers: ["That can't be her brother. He is in Australia.", "That can't be her brother. He's in Australia.", "That can't be her brother — he's in Australia.", "That can't be her brother because he is in Australia.", "That can't be her brother because he's in Australia.", "That cannot be her brother. He is in Australia.", "That can't be her brother; he's in Australia.", "That can't be her brother, he's in Australia."] },
        { q: "Có thể cô ấy không biết về cuộc họp.", hint: "She, may not / might not, know about the meeting", answers: ["She may not know about the meeting.", "She might not know about the meeting.", "Maybe she doesn't know about the meeting.", "Perhaps she doesn't know about the meeting."] },
        { q: "Cửa hàng chắc hẳn đã đóng cửa — đèn tắt hết rồi.", hint: "The shop must be closed; The lights are all off", answers: ["The shop must be closed. The lights are all off.", "The shop must be closed — the lights are all off.", "The shop must be closed because the lights are all off.", "The shop must be closed. All the lights are off.", "The store must be closed. The lights are all off.", "The shop must be closed; the lights are all off.", "The shop must be closed, the lights are all off.", "The shop must be closed because all the lights are off."] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Modal trong IELTS Writing & Speaking — viết “mềm” mà chính xác" },
    {
      t: "p",
      text: "Giám khảo đánh giá cao câu **chính xác về mức độ**. Viết “**Online learning makes students lazy.**” là nói **tuyệt đối** — mọi học sinh, mọi lúc — rất dễ bị coi là khẳng định quá đà (overgeneralisation). Thêm một modal là câu trở nên **hợp lý và học thuật**: “Online learning **can** make **some** students lazy.” Cách “nói mềm” này gọi là **hedging**.",
    },
    {
      t: "table",
      head: ["Chức năng", "Modal", "Câu mẫu Writing Task 2", "Câu mẫu Speaking"],
      rows: [
        ["Đưa giải pháp", "should, ought to", "Universities **should** record their lectures.", "I think the city **should** build more parks."],
        ["Nói khả năng chung (hedging)", "can, may", "Studying alone **can** be lonely.", "Learning online **can** be quite boring."],
        ["Hậu quả có thể xảy ra", "may, might, could", "This **could** lead to higher unemployment.", "If it rains, we **might** stay at home."],
        ["Bắt buộc, quy định", "must, have to, need to", "Drivers **must** be at least eighteen.", "At my school, we **have to** wear a uniform."],
        ["Mong muốn, dự định", "would like to, might", "—", "I **would like to** study in Australia. / I **might** become a teacher."],
        ["Khả năng của cá nhân", "can, be able to", "—", "I **can** play the piano a little."],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Band 4: Online learning makes students lazy. → Band 6: Online learning can make some students less motivated.", vi: "Câu thứ hai giới hạn lại (can, some, less motivated) nên chính xác và học thuật hơn." },
        { en: "Band 4: The government must give money to poor students. → Band 6: The government should provide financial support for students from low-income families.", vi: "should hợp với lời đề xuất hơn must; thêm cụm danh từ học thuật (financial support, low-income families)." },
        { en: "Band 4: Video games are bad for children. → Band 6: Playing video games for long hours may harm children's eyesight.", vi: "Nói rõ ĐIỀU KIỆN (for long hours) và hậu quả CỤ THỂ (eyesight) với may." },
        { en: "Band 4: I want to be a doctor. → Band 6: I would like to become a doctor, but I might change my mind.", vi: "would like to lịch sự hơn want; might cho thấy bạn dùng được modal phỏng đoán." },
      ],
    },
    {
      t: "note",
      title: "Mẹo làm bài: đừng lạm dụng must và will",
      items: [
        "Một bài Task 2 có **3–5 modal** là đẹp: **should** (giải pháp) + **can / may / could** (khả năng, hậu quả) — đủ cho tiêu chí Ngữ pháp thấy bạn dùng được modal.",
        "**must** quá nhiều nghe như ra lệnh. **will** quá nhiều nghe như tiên tri: ~~This will destroy society.~~ → This **could** have serious effects on society.",
        "Kết hợp modal với **từ chỉ mức độ** cho thêm tinh tế: **some** students, **in some cases**, **to some extent**, **often**.",
      ],
    },
    {
      t: "rule",
      formula: "Task 2: S + should + V (giải pháp) · S + can / may + V (khả năng chung) · This could / may + lead to + N (hậu quả)",
      vi: "Thêm modal + từ chỉ mức độ (some, often) để câu không khẳng định tuyệt đối.",
    },
    {
      t: "quiz",
      id: "d13-np-dich-ielts",
      title: "Dịch sang tiếng Anh — câu Task 2 có modal (4 câu)",
      kind: "translate",
      grammar: "S + can / may + V (nói mềm) · This could / may lead to + N · S + should + V + to V / so that… ",
      items: [
        { q: "Học trực tuyến có thể khiến một số sinh viên cảm thấy cô đơn.", hint: "Online learning, can / may, make some students, feel lonely", answers: ["Online learning can make some students feel lonely.", "Online learning may make some students feel lonely.", "Online learning could make some students feel lonely.", "Studying online can make some students feel lonely.", "Learning online can make some students feel lonely.", "Online study can make some students feel lonely."] },
        { q: "Điều này có thể dẫn đến tỉ lệ thất nghiệp cao hơn.", hint: "This, could / may, lead to, higher unemployment", answers: ["This could lead to higher unemployment.", "This may lead to higher unemployment.", "This might lead to higher unemployment.", "This could lead to a higher unemployment rate.", "This may lead to a higher unemployment rate.", "This could lead to higher rates of unemployment."] },
        { q: "Các trường đại học nên ghi hình bài giảng để sinh viên có thể xem lại.", hint: "Universities should, record their lectures, so that students can, watch them again", answers: ["Universities should record their lectures so that students can watch them again.", "Universities should record lectures so that students can watch them again.", "Universities should record their lectures so students can watch them again.", "Universities should record their lectures so that students can review them.", "Universities ought to record their lectures so that students can watch them again.", "Universities should record their lectures so that students can rewatch them."] },
        { q: "Chơi điện tử nhiều giờ liền có thể gây hại cho thị lực của trẻ.", hint: "Playing video games, for long hours, may / can, harm, children's eyesight", answers: ["Playing video games for long hours may harm children's eyesight.", "Playing video games for long hours can harm children's eyesight.", "Playing video games for hours may harm children's eyesight.", "Playing video games for long hours could harm children's eyesight.", "Playing video games for many hours may harm children's eyesight.", "Playing video games for many hours can harm children's eyesight."] },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Lỗi modal người Việt hay mắc nhất" },
    {
      t: "table",
      head: ["Sai", "Đúng", "Vì sao"],
      rows: [
        ["~~She can speaks English.~~", "She can **speak** English.", "Sau modal là V nguyên mẫu, không -s."],
        ["~~You must to wear a helmet.~~", "You must **wear** a helmet.", "must không đi với to (chỉ have to / ought to có to)."],
        ["~~I will can help you tomorrow.~~", "I **will be able to** help you tomorrow.", "Hai modal không đứng liền nhau."],
        ["~~Do you can swim?~~", "**Can you** swim?", "Câu hỏi đảo modal, không mượn do."],
        ["~~I musted go home early yesterday.~~", "I **had to** go home early yesterday.", "must không có quá khứ → had to."],
        ["~~He don't have to work on Sundays.~~", "He **doesn't have to** work on Sundays.", "have to chia theo chủ ngữ như động từ thường."],
        ["~~You mustn't bring food; it's provided.~~ (ý: không cần)", "You **don't have to** bring food; it's provided.", "mustn't = cấm; không cần = don't have to."],
        ["~~He mustn't be at home; his car is gone.~~ (ý: chắc là không)", "He **can't be** at home; his car is gone.", "Phỏng đoán phủ định dùng can't."],
        ["~~You had better to study.~~", "You **had better study**.", "had better + V nguyên mẫu."],
        ["~~Yesterday I could finish the report on time.~~ (một lần)", "Yesterday I **was able to / managed to** finish the report on time.", "Một lần làm được việc cụ thể → was able to."],
      ],
    },
    {
      t: "quiz",
      id: "d13-np-dien",
      title: "Điền modal phù hợp (10 câu) — mỗi chỗ trống 1–3 từ",
      kind: "fill",
      items: [
        { q: "(1) I ___ ride a bike when I was six, but I couldn't swim until I was twelve. (biết — quá khứ)", answers: ["could"], hint: "khả năng chung trong quá khứ" },
        { q: "(2) You ___ talk during the exam. It is against the rules. (cấm)", answers: ["mustn't", "must not", "can't", "cannot"], hint: "against the rules → cấm" },
        { q: "(3) Tomorrow is a holiday, so we ___ go to school. (không cần)", answers: ["don't have to", "do not have to", "don't need to", "needn't"], hint: "holiday → không bắt buộc" },
        { q: "(4) ___ I borrow your charger, please? Mine is broken. (xin phép lịch sự)", answers: ["Could", "May", "Can"], hint: "xin phép — Could / May lịch sự hơn Can" },
        { q: "(5) The government ___ invest more in public transport to reduce traffic jams. (giải pháp)", answers: ["should", "ought to"], hint: "Task 2 — đề xuất giải pháp" },
        { q: "(6) She has been travelling for twenty hours. She ___ be exhausted. (chắc hẳn)", answers: ["must"], hint: "có bằng chứng → gần như chắc chắn" },
        { q: "(7) That ___ be the right answer. It doesn't make sense at all. (không thể nào)", answers: ["can't", "cannot", "couldn't"], hint: "chắc chắn sai → can't" },
        { q: "(8) I'm not sure about my plans. I ___ visit my aunt in Da Nang next week. (có thể)", answers: ["might", "may", "could"], hint: "chưa chắc → might / may" },
        { q: "(9) Last year my father was ill, so I ___ look after my little brother. (đã phải)", answers: ["had to"], hint: "quá khứ của must / have to" },
        { q: "(10) If you practise every day, you ___ speak more fluently in three months. (sẽ có thể)", answers: ["will be able to", "'ll be able to"], hint: "tương lai của can" },
      ],
    },
    {
      t: "mcq",
      id: "d13-np-kiem-tra",
      title: "Kiểm tra cuối bài — modal verbs (10 câu)",
      items: [
        { q: "Students ___ submit their essays before Friday. It is a university rule.", options: ["might", "could", "must"], correct: 2, why: "Quy định của trường → **must** (bắt buộc). might/could chỉ là “có thể”, không bắt buộc." },
        { q: "You ___ pay for the museum. Entry is free for students.", options: ["don't have to", "mustn't", "can't"], correct: 0, why: "Miễn phí → **không cần** trả tiền = **don't have to**. mustn't/can't = **cấm** trả, vô lý." },
        { q: "___ you tell me where the library is, please?", options: ["Could", "Must", "Should"], correct: 0, why: "Nhờ người khác lịch sự → **Could you…?** Must/Should không dùng để nhờ." },
        { q: "My laptop was broken, but I ___ finish my assignment on my sister's computer.", options: ["could", "can", "was able to"], correct: 2, why: "Một lần làm được việc khó trong tình huống cụ thể (quá khứ) → **was able to**. could dùng cho khả năng chung." },
        { q: "She ___ be at work. I saw her at the supermarket five minutes ago.", options: ["mustn't", "can't", "shouldn't"], correct: 1, why: "Chắc chắn **không thể** (có bằng chứng ngược lại) → **can't**. mustn't chỉ có nghĩa cấm." },
        { q: "I think governments ___ ban plastic bags in supermarkets.", options: ["should", "can", "may"], correct: 0, why: "Nêu ý kiến / giải pháp → **should**." },
        { q: "Which sentence is correct?", options: ["He can drives a car.", "He cans drive a car.", "He can drive a car."], correct: 2, why: "Modal không thêm -s và sau modal là **V nguyên mẫu**: can **drive**." },
        { q: "Which sentence is correct?", options: ["I will be able to visit you next month.", "I will can visit you next month.", "I will able to visit you next month."], correct: 0, why: "Không đặt hai modal liền nhau → **will be able to**. Câu 3 thiếu **be**." },
        { q: "“Would you mind closing the door?” — Bạn ĐỒNG Ý làm thì trả lời:", options: ["Yes, I would.", "Yes, I mind.", "No, not at all."], correct: 2, why: "mind = phiền. **No, not at all** = không phiền chút nào → đồng ý làm. Trả lời Yes là từ chối." },
        { q: "Task 2: câu nào “mềm” và học thuật nhất?", options: ["Social media destroys teenagers' lives.", "Social media can have a negative effect on some teenagers.", "Social media must be bad for teenagers."], correct: 1, why: "**can + some** giới hạn mức độ, tránh khẳng định tuyệt đối. Câu 1 quá đà; câu 3 dùng must phỏng đoán không có bằng chứng." },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "Thêm: Phát âm modal — dạng yếu và cặp can / can't" },
    {
      t: "p",
      text: "Trong câu nói tự nhiên, modal **khẳng định** thường đọc **yếu và nhanh** (nguyên âm thành /ə/), còn dạng **phủ định** đọc **mạnh và rõ**. Đây là lý do người học hay **nghe nhầm can và can't** — một lỗi có thể đổi hẳn đáp án Listening.",
    },
    {
      t: "table",
      head: ["Từ", "Dạng mạnh (đứng một mình, nhấn)", "Dạng yếu (trong câu)", "Ví dụ trong câu"],
      rows: [
        ["can", "/kæn/", "/kən/ — gần “cần” lướt nhẹ", "I **can** swim. /aɪ kən swɪm/ (nhấn vào **swim**)"],
        ["can't", "/kɑːnt/ (Anh) · /kænt/ (Mỹ)", "không có dạng yếu — luôn đọc rõ", "I **can't** swim. /aɪ kɑːnt swɪm/ (nhấn cả can't)"],
        ["could", "/kʊd/", "/kəd/", "**Could** you help? /kəd ju help/"],
        ["should", "/ʃʊd/", "/ʃəd/", "You **should** rest. /ju ʃəd rest/"],
        ["must", "/mʌst/", "/məst/ hoặc /məs/", "You **must** be tired. /ju məs bi taɪəd/"],
      ],
    },
    {
      t: "note",
      title: "Mẹo nghe can / can't",
      items: [
        "Giọng Anh: **can't** có nguyên âm **dài /ɑː/** (“caan’t”), **can** gần như chỉ còn /kən/. Nghe **độ dài** chứ đừng chờ âm /t/ — âm /t/ cuối thường bị nuốt.",
        "Nghe **trọng âm**: câu khẳng định nhấn vào **động từ chính** (I can **SWIM**); câu phủ định nhấn cả **CAN'T** (I **CAN'T** swim).",
        "Khi nói, bạn hãy đọc rõ **can't** và có thể nói **cannot** trong câu quan trọng để giám khảo không nghe nhầm.",
      ],
    },
    {
      t: "phatam",
      id: "d13-phat-am",
      title: "Luyện phát âm — can / can't và dạng yếu của modal",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ở câu khẳng định đọc modal NHẸ, nhấn vào động từ chính; ở câu phủ định đọc rõ can't /kɑːnt/ với nguyên âm dài.",
      items: [
        { text: "can, can't", ipa: "kæn kɑːnt", vi: "dạng mạnh: /æ/ ngắn · /ɑː/ dài" },
        { text: "I can swim.", ipa: "aɪ kən swɪm", vi: "can đọc yếu /kən/, nhấn SWIM" },
        { text: "I can't swim.", ipa: "aɪ kɑːnt swɪm", vi: "can't đọc mạnh, nguyên âm dài" },
        { text: "Could you help me?", ipa: "kəd ju help miː", vi: "could yếu /kəd/" },
        { text: "You should take a break.", ipa: "ju ʃəd teɪk ə breɪk", vi: "should yếu /ʃəd/" },
        { text: "You must be tired.", ipa: "ju məst bi taɪəd", vi: "must yếu /məst/" },
        { text: "We don't have to go to school tomorrow.", ipa: "wi dəʊnt hæf tə ɡəʊ tə skuːl təmɒrəʊ", vi: "have to đọc /hæf tə/ (âm v thành f)" },
        { text: "She has to work on Saturdays.", ipa: "ʃi hæs tə wɜːk ɒn sætədeɪz", vi: "has to đọc /hæs tə/" },
      ],
    },
  ],
};

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const D13_VOCAB: Lesson = {
  id: "d13-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Học trực tuyến & học truyền thống (Online vs Traditional Learning)",
  goal: "Dùng được 50 từ và cụm từ về học trực tuyến và học trên lớp, kèm collocation và họ từ, để nói về việc học ở Speaking và lập ý cho bài Task 2 so sánh hai hình thức học.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**50 từ** chia 4 nhóm: từ chung về học tập · học trực tuyến (online) · học truyền thống (on campus) · ưu điểm và nhược điểm.",
        "**12 thẻ hình** đồ dùng học tập (laptop, headphones, Wi-Fi…) — học bằng mắt cho nhanh nhớ.",
        "**Collocation** (cụm từ hay đi với nhau): ==attend a lecture==, ==submit an assignment==, ==meet a deadline==, ==work at your own pace==…",
        "**Họ từ**: access → accessible · interact → interaction → interactive · motivate → motivation → motivated…",
        "**Ngân hàng ý** 4 cột (ưu/nhược của từng hình thức) — dùng lại ngay cho bài luận thảo luận hai mặt ở **Ngày 14**.",
      ],
    },
    {
      t: "p",
      text: "Đề IELTS về giáo dục rất hay đặt **hai hình thức học** cạnh nhau: “Some people think online courses will replace traditional classrooms…”. Muốn viết và nói tốt dạng đề này, bạn cần từ để **gọi tên** từng hình thức, **mô tả** việc học, và **so sánh** ưu nhược. Bấm 🔊 để nghe, dùng nút **Che nghĩa / Che từ** để tự kiểm tra.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai hình thức học — nhìn một lần là nhớ",
      caption: "Hai cột dưới đây chính là hai “phe” trong đề Task 2. Mỗi dòng là một từ khoá sẽ học kỹ ở các mục sau.",
      cols: [
        {
          title: "**Online learning** — học trực tuyến",
          anh: "laptop",
          items: [
            "học qua **platform** / **virtual classroom**",
            "xem **recorded lectures**, học **self-paced**",
            "**flexibility**, không phải **commute**",
            "dễ gặp **distraction**, cần **self-discipline**",
          ],
        },
        {
          title: "**Traditional learning** — học trên lớp",
          anh: "school",
          items: [
            "học **face-to-face** trên **campus**",
            "nghe **lecture**, dự **tutorial / seminar**",
            "nhiều **interaction** với **peers** và **lecturer**",
            "**timetable** cố định, tốn **tuition fees** và thời gian đi lại",
          ],
        },
      ],
    },

    { t: "h", text: "1. Từ chung về học tập (12 từ)" },
    {
      t: "vocab",
      items: [
        { w: "curriculum", pos: "n", ipa: "/kəˈrɪkjələm/", vi: "chương trình học (toàn bộ các môn, nội dung được dạy)", ex: "Coding is now part of the primary school curriculum in many countries.", exVi: "Lập trình nay là một phần của chương trình tiểu học ở nhiều nước.", more: "Số nhiều: **curricula** hoặc **curriculums**. Hay đi với: **on the** curriculum · the **national** curriculum · **design / update** a curriculum." },
        { w: "course", pos: "n", ipa: "/kɔːs/", vi: "khoá học", ex: "She took a six-week online course in graphic design.", exVi: "Cô ấy học một khoá thiết kế đồ hoạ trực tuyến sáu tuần.", more: "**take / do / enrol on** a course · a course **in / on** + môn. ~~learn a course~~ → **take a course**." },
        { w: "lecture", pos: "n", ipa: "/ˈlektʃə(r)/", vi: "bài giảng (ở đại học, trước nhiều người)", ex: "The lecture was recorded, so I watched it again at home.", exVi: "Bài giảng được ghi hình nên tôi xem lại ở nhà.", more: "**attend / give / deliver** a lecture · a lecture **on** + chủ đề · **lecture hall / theatre** (giảng đường)." },
        { w: "lecturer", pos: "n", ipa: "/ˈlektʃərə(r)/", vi: "giảng viên đại học", ex: "Our lecturer answers questions on the course forum every evening.", exVi: "Giảng viên của chúng tôi trả lời câu hỏi trên diễn đàn khoá học mỗi tối.", more: "Anh-Anh: **lecturer**; Anh-Mỹ: **professor / instructor**. Ở trường phổ thông dùng **teacher**.", anh: "teacher" },
        { w: "tutorial", pos: "n", ipa: "/tjuːˈtɔːriəl/", vi: "buổi học nhóm nhỏ với giảng viên; bài hướng dẫn", ex: "In tutorials, we discuss the weekly reading in groups of six.", exVi: "Trong các buổi tutorial, chúng tôi thảo luận bài đọc của tuần theo nhóm sáu người.", more: "**tutor** = người hướng dẫn nhóm nhỏ / gia sư · a **video tutorial** = video hướng dẫn (cách dùng phần mềm…)." },
        { w: "seminar", pos: "n", ipa: "/ˈsemɪnɑː(r)/", vi: "buổi thảo luận chuyên đề (nhóm nhỏ, sinh viên trình bày và tranh luận)", ex: "Every student has to lead one seminar during the term.", exVi: "Mỗi sinh viên phải chủ trì một buổi seminar trong học kỳ.", more: "**attend / lead / run** a seminar. **webinar** = web + seminar (seminar trực tuyến)." },
        { w: "assignment", pos: "n", ipa: "/əˈsaɪnmənt/", vi: "bài tập được giao (phải nộp, thường được chấm điểm)", ex: "I submitted my history assignment two days early.", exVi: "Tôi nộp bài tập lịch sử sớm hai ngày.", more: "**do / complete / submit / hand in** an assignment. **Đếm được** (two assignments) — khác **homework** không đếm được." },
        { w: "deadline", pos: "n", ipa: "/ˈdedlaɪn/", vi: "hạn chót", ex: "The deadline for the essay is midnight on Friday.", exVi: "Hạn chót nộp bài luận là nửa đêm thứ Sáu.", more: "**meet** a deadline (kịp hạn) · **miss** a deadline (trễ hạn) · **extend** a deadline (gia hạn) · a **tight** deadline (hạn gấp).", anh: "hourglass-not-done" },
        { w: "assessment", pos: "n", ipa: "/əˈsesmənt/", vi: "sự đánh giá; bài kiểm tra đánh giá", ex: "Online courses often use short weekly quizzes for assessment.", exVi: "Các khoá trực tuyến thường dùng bài trắc nghiệm ngắn hằng tuần để đánh giá.", more: "**continuous** assessment (đánh giá liên tục) · động từ **assess** (đánh giá)." },
        { w: "qualification", pos: "n", ipa: "/ˌkwɒlɪfɪˈkeɪʃn/", vi: "bằng cấp, chứng chỉ (chứng nhận đã học xong / đủ năng lực)", ex: "You need a teaching qualification to work in a state school.", exVi: "Bạn cần chứng chỉ sư phạm để dạy ở trường công.", more: "**gain / obtain / have** a qualification · **academic / professional** qualifications. Động từ **qualify** (đủ điều kiện)." },
        { w: "degree", pos: "n", ipa: "/dɪˈɡriː/", vi: "bằng đại học", ex: "He earned a degree in economics entirely online.", exVi: "Anh ấy lấy bằng kinh tế hoàn toàn qua mạng.", more: "a **bachelor's / master's** degree · **do / get / earn** a degree **in** + ngành. Nghĩa khác: độ (30 degrees).", anh: "graduation-cap" },
        { w: "attendance", pos: "n", ipa: "/əˈtendəns/", vi: "sự có mặt, chuyên cần (đi học đầy đủ)", ex: "Attendance is checked at the start of every class.", exVi: "Việc điểm danh được kiểm tra đầu mỗi buổi học.", more: "Động từ **attend** + nơi/sự kiện: **attend classes** (~~attend to classes~~ — attend to = chăm lo, xử lý). **poor / regular** attendance." },
      ],
    },

    { t: "h", text: "2. Học trực tuyến (14 từ)" },
    {
      t: "vocab",
      items: [
        { w: "e-learning", pos: "n", ipa: "/ˈiː lɜːnɪŋ/", vi: "học điện tử (học qua máy tính, internet)", ex: "E-learning grew very quickly during the pandemic.", exVi: "Học điện tử phát triển rất nhanh trong đại dịch.", more: "Không đếm được (~~an e-learning~~). Gần nghĩa: **online learning**, **online education**." },
        { w: "distance learning", pos: "n", ipa: "/ˈdɪstəns ˌlɜːnɪŋ/", vi: "học từ xa (thầy và trò không ở cùng một nơi)", ex: "Distance learning allows people in remote villages to earn a degree.", exVi: "Học từ xa cho phép người ở làng xa xôi lấy được bằng đại học.", more: "Rộng hơn online learning: học từ xa đã có từ thời **gửi thư** (xem bài nghe hôm nay)." },
        { w: "forum", pos: "n", ipa: "/ˈfɔːrəm/", vi: "diễn đàn (nơi đăng câu hỏi, trao đổi trên mạng)", ex: "Students post their questions on the course forum.", exVi: "Sinh viên đăng câu hỏi lên diễn đàn của khoá học.", more: "an **online / discussion** forum · **post on** a forum · số nhiều **forums**. (**platform** = nền tảng — đã học Ngày 4.)" },
        { w: "virtual classroom", pos: "n", ipa: "/ˌvɜːtʃuəl ˈklɑːsruːm/", vi: "lớp học ảo (lớp học trên mạng)", ex: "In a virtual classroom, students raise their hand by clicking a button.", exVi: "Trong lớp học ảo, học sinh giơ tay bằng cách bấm một nút.", more: "**virtual** = ảo, trên máy tính (virtual tour, virtual meeting) — khác **real** / **physical** (thật, vật lý)." },
        { w: "webinar", pos: "n", ipa: "/ˈwebɪnɑː(r)/", vi: "hội thảo trực tuyến", ex: "Over 300 teachers joined the webinar on AI in education.", exVi: "Hơn 300 giáo viên tham gia hội thảo trực tuyến về AI trong giáo dục.", more: "**join / attend / host** a webinar · a webinar **on** + chủ đề." },
        { w: "recorded lecture", pos: "n", ipa: "/rɪˌkɔːdɪd ˈlektʃə(r)/", vi: "bài giảng ghi hình (xem lại được)", ex: "Recorded lectures let students pause and take notes at their own speed.", exVi: "Bài giảng ghi hình cho phép sinh viên dừng lại và ghi chép theo tốc độ của mình.", more: "Trái nghĩa: a **live** lecture (/laɪv/ — trực tiếp, đang diễn ra)." },
        { w: "self-paced", pos: "adj", ipa: "/ˌself ˈpeɪst/", vi: "tự định tốc độ học", ex: "It is a self-paced course, so you can finish it in two weeks or two months.", exVi: "Đây là khoá tự định tốc độ, nên bạn học xong trong hai tuần hay hai tháng đều được.", more: "Cụm cùng nghĩa rất hay dùng: **work / study / learn at your own pace**." },
        { w: "flexibility", pos: "n", ipa: "/ˌfleksəˈbɪləti/", vi: "sự linh hoạt", ex: "The flexibility of online study suits working parents.", exVi: "Sự linh hoạt của việc học trực tuyến phù hợp với các phụ huynh đang đi làm.", more: "**offer / provide / give** flexibility · **greater** flexibility. Tính từ **flexible** (linh hoạt)." },
        { w: "screen time", pos: "n", ipa: "/ˈskriːn taɪm/", vi: "thời gian dùng màn hình", ex: "Doctors advise limiting screen time for young children.", exVi: "Bác sĩ khuyên nên hạn chế thời gian dùng màn hình của trẻ nhỏ.", more: "**limit / reduce / increase** screen time · không đếm được." },
        { w: "digital literacy", pos: "n", ipa: "/ˌdɪdʒɪtl ˈlɪtərəsi/", vi: "khả năng sử dụng công nghệ số", ex: "Older learners may need training in digital literacy before an online course.", exVi: "Người học lớn tuổi có thể cần được đào tạo kỹ năng số trước một khoá học trực tuyến.", more: "**literacy** = khả năng đọc viết; **illiterate** = mù chữ. **digital skills** là cách nói đơn giản hơn." },
        { w: "self-discipline", pos: "n", ipa: "/ˌself ˈdɪsəplɪn/", vi: "tính tự giác, kỷ luật bản thân", ex: "Studying at home requires a lot of self-discipline.", exVi: "Học ở nhà đòi hỏi rất nhiều tính tự giác.", more: "**require / need / lack** self-discipline · tính từ **self-disciplined** (tự giác)." },
        { w: "procrastination", pos: "n", ipa: "/prəˌkræstɪˈneɪʃn/", vi: "sự trì hoãn", ex: "Procrastination is the biggest enemy of online learners.", exVi: "Sự trì hoãn là kẻ thù lớn nhất của người học trực tuyến.", more: "Động từ **procrastinate** = **put off** doing things (cứ lùi việc lại)." },
        { w: "technical problem", pos: "n", ipa: "/ˌteknɪkl ˈprɒbləm/", vi: "sự cố kỹ thuật", ex: "A technical problem stopped the online exam for twenty minutes.", exVi: "Một sự cố kỹ thuật làm bài thi trực tuyến dừng hai mươi phút.", more: "Cùng nghĩa: **technical issue / difficulty**, (thân mật) **glitch** /ɡlɪtʃ/. **poor internet connection** (mạng yếu)." },
        { w: "MOOC", pos: "n", ipa: "/muːk/", vi: "khoá học trực tuyến mở đại trà (Massive Open Online Course)", ex: "Thousands of people signed up for the free MOOC on climate change.", exVi: "Hàng nghìn người đăng ký khoá MOOC miễn phí về biến đổi khí hậu.", more: "**sign up for / enrol on / complete** a MOOC. Đọc như một từ: “mook”." },
      ],
    },

    { t: "h", text: "3. Học truyền thống trên lớp (14 từ)" },
    {
      t: "vocab",
      items: [
        { w: "face-to-face", pos: "adj, adv", ipa: "/ˌfeɪs tə ˈfeɪs/", vi: "trực tiếp, mặt đối mặt", ex: "Face-to-face classes make it easier to ask questions.", exVi: "Lớp học trực tiếp giúp việc đặt câu hỏi dễ hơn.", more: "Trước danh từ có gạch nối: **face-to-face** teaching. Làm trạng từ thì thường không gạch: meet **face to face**. Gần nghĩa: **in person**, **in-person** classes." },
        { w: "classroom", pos: "n", ipa: "/ˈklɑːsruːm/", vi: "phòng học, lớp học", ex: "Our classroom has a smart board and thirty desks.", exVi: "Phòng học của chúng tôi có một bảng thông minh và ba mươi bàn.", more: "**in** the classroom · **classroom-based** learning (học trên lớp) · **traditional** classroom." },
        { w: "campus", pos: "n", ipa: "/ˈkæmpəs/", vi: "khuôn viên trường (đại học)", ex: "Most first-year students live on campus.", exVi: "Phần lớn sinh viên năm nhất sống trong khuôn viên trường.", more: "**on** campus (~~in campus~~) · **off** campus (ngoài trường) · campus **life**.", anh: "school" },
        { w: "interaction", pos: "n", ipa: "/ˌɪntərˈækʃn/", vi: "sự tương tác, giao lưu qua lại", ex: "Interaction with classmates helps students practise speaking.", exVi: "Giao lưu với bạn cùng lớp giúp học sinh luyện nói.", more: "**interaction with / between** · **social / face-to-face** interaction · động từ **interact with**." },
        { w: "peer", pos: "n", ipa: "/pɪə(r)/", vi: "bạn đồng trang lứa, bạn học cùng cấp", ex: "Students often learn as much from their peers as from their teachers.", exVi: "Học sinh thường học được từ bạn bè nhiều ngang với từ thầy cô.", more: "**peer pressure** (áp lực từ bạn bè) · **peer feedback** (bạn học góp ý cho nhau)." },
        { w: "classmate", pos: "n", ipa: "/ˈklɑːsmeɪt/", vi: "bạn cùng lớp", ex: "I still keep in touch with my primary school classmates.", exVi: "Tôi vẫn giữ liên lạc với các bạn cùng lớp tiểu học.", more: "Cùng kiểu ghép: **roommate** (bạn cùng phòng), **teammate** (đồng đội), **flatmate** (bạn cùng căn hộ)." },
        { w: "hands-on", pos: "adj", ipa: "/ˌhændz ˈɒn/", vi: "thực hành trực tiếp, tự tay làm", ex: "Chemistry needs hands-on experience in a real laboratory.", exVi: "Môn hoá cần kinh nghiệm thực hành trong phòng thí nghiệm thật.", more: "**hands-on** experience / training / activities. Trái nghĩa: **theoretical** (lý thuyết)." },
        { w: "extracurricular activities", pos: "n", ipa: "/ˌekstrəkəˈrɪkjələr ækˈtɪvətiz/", vi: "hoạt động ngoại khoá", ex: "Extracurricular activities such as football and drama build teamwork.", exVi: "Hoạt động ngoại khoá như bóng đá và kịch giúp xây dựng tinh thần đồng đội.", more: "**extra** (ngoài) + **curricular** (thuộc chương trình học). **take part in** extracurricular activities." },
        { w: "timetable", pos: "n", ipa: "/ˈtaɪmteɪbl/", vi: "thời khoá biểu; lịch trình", ex: "Our timetable changes every semester.", exVi: "Thời khoá biểu của chúng tôi thay đổi mỗi học kỳ.", more: "a **fixed / busy** timetable · Mỹ thường nói **schedule**. Cũng là bảng giờ tàu xe (bus timetable).", anh: "spiral-calendar" },
        { w: "supervision", pos: "n", ipa: "/ˌsuːpəˈvɪʒn/", vi: "sự giám sát, trông nom", ex: "Young children need adult supervision when they use the internet.", exVi: "Trẻ nhỏ cần người lớn giám sát khi dùng internet.", more: "**under** the supervision of · động từ **supervise** · người: **supervisor**." },
        { w: "social skills", pos: "n", ipa: "/ˈsəʊʃl skɪlz/", vi: "kỹ năng xã hội (giao tiếp, hợp tác với người khác)", ex: "Group projects help children develop social skills.", exVi: "Dự án nhóm giúp trẻ phát triển kỹ năng xã hội.", more: "**develop / improve** social skills · cùng nhóm: **communication skills**, **teamwork skills**." },
        { w: "concentration", pos: "n", ipa: "/ˌkɒnsnˈtreɪʃn/", vi: "sự tập trung", ex: "A quiet classroom helps students' concentration.", exVi: "Lớp học yên tĩnh giúp học sinh tập trung.", more: "**lose / improve** concentration · động từ **concentrate on** (~~concentrate in~~) · gần nghĩa **focus**. (**routine** = nề nếp — đã học Ngày 10.)" },
        { w: "tuition fees", pos: "n", ipa: "/tjuˈɪʃn fiːz/", vi: "học phí", ex: "Tuition fees at private universities have risen sharply.", exVi: "Học phí ở các trường đại học tư đã tăng mạnh.", more: "**pay / cut / raise** tuition fees. Thường dùng số nhiều **fees**.", anh: "money-bag" },
        { w: "commute", pos: "n, v", ipa: "/kəˈmjuːt/", vi: "quãng đi lại hằng ngày (nhà ↔ trường/công ty); đi lại như vậy", ex: "My commute to campus takes an hour by bus.", exVi: "Quãng đường tôi đi đến trường mất một tiếng bằng xe buýt.", more: "**a long / short** commute · động từ: I **commute** to work by train. Người: **commuter**.", anh: "bus" },
      ],
    },

    { t: "h", text: "4. Ưu điểm và nhược điểm (10 từ)" },
    {
      t: "vocab",
      items: [
        { w: "convenient", pos: "adj", ipa: "/kənˈviːniənt/", vi: "thuận tiện", ex: "Online classes are convenient for students who live far from the city.", exVi: "Lớp trực tuyến thuận tiện cho sinh viên sống xa thành phố.", more: "convenient **for** + người · danh từ **convenience** · trái nghĩa **inconvenient**." },
        { w: "cost-effective", pos: "adj", ipa: "/ˌkɒst ɪˈfektɪv/", vi: "tiết kiệm chi phí (hiệu quả so với số tiền bỏ ra)", ex: "Recording one lecture for 500 students is very cost-effective.", exVi: "Ghi hình một bài giảng cho 500 sinh viên rất tiết kiệm chi phí.", more: "Trang trọng hơn **cheap**. Cách nói khác: **affordable** (giá vừa túi tiền)." },
        { w: "accessible", pos: "adj", ipa: "/əkˈsesəbl/", vi: "dễ tiếp cận, ai cũng dùng được", ex: "The internet has made higher education accessible to millions of people.", exVi: "Internet đã giúp hàng triệu người tiếp cận giáo dục đại học.", more: "accessible **to** + người · danh từ **access** (**have access to**) · **accessibility**." },
        { w: "isolated", pos: "adj", ipa: "/ˈaɪsəleɪtɪd/", vi: "cô lập, cô đơn, tách biệt", ex: "Some online learners feel isolated because they never meet their classmates.", exVi: "Một số người học trực tuyến thấy cô đơn vì không bao giờ gặp bạn cùng lớp.", more: "**feel** isolated · danh từ **isolation** (social isolation)." },
        { w: "distraction", pos: "n", ipa: "/dɪˈstrækʃn/", vi: "sự xao nhãng; thứ làm xao nhãng", ex: "At home, the TV and the fridge are constant distractions.", exVi: "Ở nhà, cái TV và tủ lạnh là những thứ gây xao nhãng liên tục.", more: "Đếm được khi chỉ “thứ gây xao nhãng”. Động từ **distract** (distract somebody **from** something) · tính từ **distracting**." },
        { w: "motivated", pos: "adj", ipa: "/ˈməʊtɪveɪtɪd/", vi: "có động lực", ex: "Students who set clear goals stay motivated for longer.", exVi: "Học sinh đặt mục tiêu rõ ràng giữ được động lực lâu hơn.", more: "**stay / feel / be highly** motivated · danh từ **motivation** (Ngày 3): **lack / lose** motivation · **motivated** (người) ≠ **motivating** (việc tạo động lực)." },
        { w: "immediate", pos: "adj", ipa: "/ɪˈmiːdiət/", vi: "ngay lập tức", ex: "In class, students get immediate feedback when they make a mistake.", exVi: "Trên lớp, học sinh nhận góp ý ngay lập tức khi mắc lỗi.", more: "Collocation ăn điểm: **immediate feedback** · trạng từ **immediately**." },
        { w: "rigid", pos: "adj", ipa: "/ˈrɪdʒɪd/", vi: "cứng nhắc, không linh hoạt", ex: "A rigid timetable is difficult for students with part-time jobs.", exVi: "Thời khoá biểu cứng nhắc gây khó cho sinh viên đi làm thêm.", more: "Trái nghĩa: **flexible**. a rigid **schedule / system / rule**." },
        { w: "well-equipped", pos: "adj", ipa: "/ˌwel ɪˈkwɪpt/", vi: "được trang bị tốt (máy móc, dụng cụ đầy đủ)", ex: "The university has well-equipped laboratories.", exVi: "Trường đại học có các phòng thí nghiệm được trang bị tốt.", more: "Động từ **equip** · danh từ **equipment** (không đếm được — ~~equipments~~)." },
        { w: "interactive", pos: "adj", ipa: "/ˌɪntərˈæktɪv/", vi: "có tính tương tác (người học làm, bấm, trả lời được)", ex: "Interactive quizzes keep online lessons interesting.", exVi: "Các câu đố tương tác giữ cho bài học trực tuyến thú vị.", more: "an interactive **whiteboard / lesson / map** · họ từ: **interact → interaction → interactive**." },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với từ vựng chủ đề này",
      items: [
        "~~learn a course~~ → **take / do a course** · ~~join a lecture~~ (nghe như nhập hội) → **attend a lecture** · ~~attend to class~~ → **attend class**.",
        "**on campus** (không ~~in campus~~) · **in the classroom** · **on the platform** · **online** không có giới từ: study **online** (~~study in online~~).",
        "**homework, equipment, feedback, e-learning, flexibility** là danh từ **không đếm được**: ~~homeworks~~, ~~equipments~~, ~~feedbacks~~.",
        "**motivated** (người CÓ động lực) ≠ **motivating** (việc TẠO động lực): I am **motivated** because the class is **motivating**.",
        "**lecture** (bài giảng) ≠ **lecturer** (giảng viên) ≠ **lesson** (tiết học, thường ở trường phổ thông).",
        "**routine** nhấn âm **sau** /ruːˈtiːn/; **campus** nhấn âm **đầu** /ˈkæmpəs/; **curriculum** nhấn âm thứ hai /kəˈrɪkjələm/.",
      ],
    },

    { t: "h", text: "5. Thẻ hình: đồ dùng học tập (12 từ)" },
    {
      t: "p",
      text: "Những từ cụ thể dưới đây bạn nhìn thấy mỗi ngày — học bằng hình là nhanh nhất. Chạm vào thẻ để nghe, bật **Che nghĩa** để tự kiểm tra. Đây là những từ hay xuất hiện ở **Speaking Part 1** (What do you need to study online?) và **Listening Part 1** (danh sách đồ cần mang).",
    },
    {
      t: "hinh",
      title: "Đồ dùng học tập — online và trên lớp",
      items: [
        { anh: "laptop", w: "laptop", ro: "/ˈlæptɒp/", vi: "máy tính xách tay" },
        { anh: "desktop-computer", w: "desktop computer", ro: "/ˌdesktɒp kəmˈpjuːtə/", vi: "máy tính để bàn" },
        { anh: "mobile-phone", w: "smartphone", ro: "/ˈsmɑːtfəʊn/", vi: "điện thoại thông minh" },
        { anh: "headphone", w: "headphones", ro: "/ˈhedfəʊnz/", vi: "tai nghe (chụp tai)" },
        { anh: "microphone", w: "microphone", ro: "/ˈmaɪkrəfəʊn/", vi: "micro (mic)" },
        { anh: "wireless", w: "Wi-Fi", ro: "/ˈwaɪ faɪ/", vi: "mạng không dây" },
        { anh: "printer", w: "printer", ro: "/ˈprɪntə/", vi: "máy in" },
        { anh: "open-book", w: "textbook", ro: "/ˈtekstbʊk/", vi: "sách giáo khoa, giáo trình" },
        { anh: "notebook", w: "notebook", ro: "/ˈnəʊtbʊk/", vi: "vở, sổ ghi chép" },
        { anh: "backpack", w: "schoolbag", ro: "/ˈskuːlbæɡ/", vi: "cặp sách, ba lô đi học" },
        { anh: "student", w: "student", ro: "/ˈstjuːdnt/", vi: "học sinh, sinh viên" },
        { anh: "graduation-cap", w: "graduation", ro: "/ˌɡrædʒuˈeɪʃn/", vi: "lễ tốt nghiệp; sự tốt nghiệp" },
      ],
    },

    { t: "h", text: "6. Collocation — cụm từ hay đi với nhau" },
    {
      t: "p",
      text: "Giám khảo chấm **Lexical Resource** (vốn từ) rất để ý **collocation**: từ nào “quen” đi với từ nào. Người Việt hay dịch từng chữ (~~make an assignment~~); học sẵn cả cụm thì tránh được.",
    },
    {
      t: "table",
      head: ["Động từ", "Đi với", "Ví dụ"],
      rows: [
        ["**attend**", "a lecture / a class / a seminar / school", "Only half of the students **attended the lecture** on Monday."],
        ["**take / do / enrol on**", "a course", "I **enrolled on a course** in web design."],
        ["**submit / hand in**", "an assignment / an essay", "Please **hand in your assignment** by Friday."],
        ["**meet / miss / extend**", "a deadline", "I worked all night to **meet the deadline**."],
        ["**get / receive / give**", "feedback", "Online students may wait days to **get feedback**."],
        ["**interact with**", "classmates / teachers", "Children need to **interact with** other children."],
        ["**work / study at**", "your own pace", "With recorded lectures, you can **study at your own pace**."],
        ["**have / gain access to**", "education / the internet / resources", "Many rural students still **have no access to** fast internet."],
        ["**gain / obtain / earn**", "a qualification / a degree", "She **gained a qualification** in nursing online."],
        ["**drop out of**", "school / university / a course", "He **dropped out of** university after one year."],
        ["**lose / lack**", "motivation", "It is easy to **lose motivation** when you study alone."],
        ["**limit / reduce**", "screen time", "Parents should **limit screen time** for young children."],
      ],
    },

    { t: "h", text: "7. Họ từ (word families)" },
    {
      t: "table",
      head: ["Danh từ", "Động từ", "Tính từ", "Trạng từ"],
      rows: [
        ["education · educator (nhà giáo dục)", "educate", "educational (mang tính giáo dục) · educated (có học)", "educationally"],
        ["access · accessibility", "access", "accessible · **in**accessible", "—"],
        ["interaction", "interact (with)", "interactive", "interactively"],
        ["motivation", "motivate", "motivated (có động lực) · motivating (tạo động lực)", "—"],
        ["distraction", "distract", "distracting (gây xao nhãng) · distracted (bị xao nhãng)", "—"],
        ["isolation", "isolate", "isolated", "—"],
        ["flexibility", "—", "flexible · **in**flexible", "flexibly"],
        ["convenience", "—", "convenient · **in**convenient", "conveniently"],
        ["supervision · supervisor", "supervise", "supervised · **un**supervised", "—"],
        ["assessment · assessor", "assess", "—", "—"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: đuôi -ed và -ing",
      items: [
        "**-ed** = cảm giác của **người** (bị tác động): I feel **motivated / distracted / isolated**.",
        "**-ing** = tính chất của **sự vật** (gây ra cảm giác): a **motivating** teacher, a **distracting** noise.",
        "Riêng **educated** (có học thức) và **educational** (mang tính giáo dục) không theo cặp này: an **educational** game (trò chơi giáo dục), an **educated** person (người có học).",
      ],
    },

    { t: "h", text: "8. Ngân hàng ý cho Task 2 — ưu và nhược điểm" },
    {
      t: "sodo",
      kind: "compare",
      title: "Ý tưởng cho đề “Online vs Traditional learning”",
      caption: "Mỗi ô là một ý có thể phát triển thành một đoạn thân bài. Ngày 14 bạn sẽ dùng chính bảng này để viết bài luận thảo luận hai mặt.",
      cols: [
        { title: "Online — ưu điểm", anh: "laptop", items: ["**flexibility**: học lúc nào cũng được", "**cost-effective**: không tốn tiền đi lại, ký túc xá", "**accessible**: người ở vùng xa vẫn học được", "**recorded lectures**: xem lại nhiều lần"] },
        { title: "Online — nhược điểm", anh: "mobile-phone", items: ["dễ **distraction** (mạng xã hội, TV)", "cảm thấy **isolated**, thiếu bạn bè", "cần **self-discipline**, dễ **procrastination**", "**technical problems**, nhiều **screen time**"] },
        { title: "Truyền thống — ưu điểm", anh: "school", items: ["**face-to-face interaction** với thầy và bạn", "**immediate feedback** khi mắc lỗi", "**hands-on** thực hành, phòng lab **well-equipped**", "**routine** và **supervision** giữ kỷ luật"] },
        { title: "Truyền thống — nhược điểm", anh: "bus", items: ["**commute** dài, mệt", "**rigid timetable**", "**tuition fees** và chi phí sinh hoạt cao", "lớp đông, ít được hỏi riêng"] },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Online courses offer greater flexibility, as learners can study at their own pace.", vi: "Khoá học trực tuyến linh hoạt hơn, vì người học có thể học theo tốc độ riêng. (Task 2 — ưu online)" },
        { en: "Distance learning has made higher education accessible to people in remote areas.", vi: "Học từ xa đã giúp người ở vùng xa tiếp cận giáo dục đại học. (Task 2 — ưu online)" },
        { en: "However, students who study alone at home may feel isolated and lose motivation.", vi: "Tuy nhiên, sinh viên tự học ở nhà có thể thấy cô đơn và mất động lực. (Task 2 — nhược online, có modal may)" },
        { en: "In a traditional classroom, learners receive immediate feedback from their lecturers.", vi: "Trong lớp học truyền thống, người học nhận góp ý ngay lập tức từ giảng viên. (Task 2 — ưu truyền thống)" },
        { en: "Subjects such as chemistry require hands-on experience in well-equipped laboratories.", vi: "Các môn như hoá học đòi hỏi thực hành trong phòng thí nghiệm được trang bị tốt. (Task 2 — ưu truyền thống)" },
        { en: "To be honest, I prefer face-to-face classes because I can ask questions straight away.", vi: "Thật lòng mà nói, tôi thích học trực tiếp hơn vì tôi có thể hỏi ngay. (Speaking Part 1)" },
        { en: "I took a short online course in photography last year, and I really enjoyed it because it was self-paced.", vi: "Năm ngoái tôi học một khoá nhiếp ảnh trực tuyến ngắn và rất thích vì được tự định tốc độ. (Speaking Part 1/2)" },
      ],
    },
    {
      t: "rule",
      formula: "Online learning + offers / provides + flexibility · S + can study at their own pace · S + may feel isolated / lose motivation · S + receive immediate feedback",
      vi: "Bốn khung câu dùng ngay cho bài so sánh hai hình thức học (kết hợp modal của bài ngữ pháp hôm nay).",
    },

    { t: "h", text: "9. Luyện tập" },
    {
      t: "mcq",
      id: "d13-tv-chon",
      title: "Chọn từ đúng (8 câu)",
      items: [
        { q: "I can't go out tonight. I have to ___ my assignment by 9 a.m. tomorrow.", options: ["make", "attend", "submit"], correct: 2, why: "**submit / hand in** an assignment = nộp bài. ~~make an assignment~~ là dịch từng chữ; attend dùng cho lecture/class." },
        { q: "Most first-year students live ___ campus.", options: ["in", "at", "on"], correct: 2, why: "Cụm cố định **on campus** (trong khuôn viên trường) / **off campus**." },
        { q: "With recorded lectures, students can work at their own ___.", options: ["pace", "speed up", "timetable"], correct: 0, why: "Cụm **at your own pace** = theo tốc độ của mình." },
        { q: "Students who study alone at home often feel ___.", options: ["isolating", "isolated", "isolation"], correct: 1, why: "Cảm giác của **người** → đuôi **-ed**: feel **isolated**. isolation là danh từ." },
        { q: "The lecture was very ___ — I wanted to study harder after it.", options: ["motivated", "motivation", "motivating"], correct: 2, why: "Tính chất của **bài giảng** (tạo động lực) → **-ing**: motivating." },
        { q: "Our university has ___ laboratories with modern equipment.", options: ["well-equipped", "self-paced", "rigid"], correct: 0, why: "**well-equipped** = được trang bị tốt. self-paced dùng cho khoá học; rigid = cứng nhắc." },
        { q: "Chemistry students need ___ experience, not only theory.", options: ["face-off", "hands-on", "hand-in"], correct: 1, why: "**hands-on experience** = kinh nghiệm thực hành trực tiếp." },
        { q: "Which word is UNCOUNTABLE?", options: ["equipment", "assignment", "lecture"], correct: 0, why: "**equipment** không đếm được (~~equipments~~). assignment và lecture đếm được." },
      ],
    },
    {
      t: "quiz",
      id: "d13-tv-dien",
      title: "Điền một từ để hoàn thành collocation (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) I missed the ___ because my laptop crashed the night before. (hạn chót)", answers: ["deadline"], hint: "miss a ___" },
        { q: "(2) Over 200 people ___ the lecture on artificial intelligence. (dự)", answers: ["attended"], hint: "động từ quá khứ — ___ a lecture" },
        { q: "(3) My ___ to university takes almost an hour by bus. (quãng đi lại)", answers: ["commute"], hint: "danh từ — đi lại hằng ngày" },
        { q: "(4) Online students sometimes wait several days to get ___ on their essays. (nhận xét)", answers: ["feedback"], hint: "danh từ không đếm được — get ___" },
        { q: "(5) Many people in rural areas still have no ___ to fast internet. (sự tiếp cận)", answers: ["access"], hint: "have no ___ to" },
        { q: "(6) He dropped ___ of university in his second year. (bỏ học)", answers: ["out"], hint: "drop ___ of" },
        { q: "(7) Studying at home requires a lot of self-___. (tự giác)", answers: ["discipline"], hint: "self-___" },
        { q: "(8) Parents should limit screen ___ for children under six.", answers: ["time"], hint: "screen ___" },
        { q: "(9) She ___ a degree in law entirely online. (lấy được)", answers: ["earned", "gained", "got", "obtained"], hint: "động từ quá khứ — ___ a degree" },
        { q: "(10) Tuition ___ at private universities are very high. (học phí)", answers: ["fees"], hint: "tuition ___ (số nhiều)" },
      ],
    },
    {
      t: "quiz",
      id: "d13-tv-ho-tu",
      title: "Họ từ — viết dạng đúng của từ trong ngoặc (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) The internet has made education more ___ to poor families. (ACCESS)", answers: ["accessible"], hint: "sau more cần tính từ" },
        { q: "(2) Good teachers know how to ___ their students. (MOTIVATION)", answers: ["motivate"], hint: "sau how to cần động từ" },
        { q: "(3) Social ___ can lead to stress and loneliness. (ISOLATED)", answers: ["isolation"], hint: "sau social cần danh từ" },
        { q: "(4) Mobile phones are very ___ during lessons. (DISTRACT)", answers: ["distracting"], hint: "tính chất của vật → -ing" },
        { q: "(5) Children learn best through ___ with other children. (INTERACT)", answers: ["interaction"], hint: "sau through cần danh từ" },
        { q: "(6) Online classes are ___ for people who work full-time. (CONVENIENCE)", answers: ["convenient"], hint: "sau are cần tính từ" },
      ],
    },
    {
      t: "quiz",
      id: "d13-tv-dich",
      title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
      kind: "translate",
      grammar: "Dùng collocation đã học: attend a lecture · study at your own pace · have access to · feel isolated · receive immediate feedback. Có thể kết hợp modal: can / may / should.",
      items: [
        { q: "Bài giảng ghi hình cho phép sinh viên học theo tốc độ của riêng mình.", hint: "Recorded lectures, allow students to, study / learn at their own pace", answers: ["Recorded lectures allow students to study at their own pace.", "Recorded lectures allow students to learn at their own pace.", "Recorded lectures let students study at their own pace.", "Recorded lectures let students learn at their own pace.", "Recorded lectures enable students to study at their own pace.", "Recorded lectures enable students to learn at their own pace."] },
        { q: "Nhiều học sinh ở vùng nông thôn không được tiếp cận internet tốc độ cao.", hint: "Many students in rural areas, do not have access to, fast / high-speed internet", answers: ["Many students in rural areas do not have access to fast internet.", "Many students in rural areas don't have access to fast internet.", "Many students in rural areas do not have access to high-speed internet.", "Many students in rural areas don't have access to high-speed internet.", "Many students in rural areas have no access to fast internet.", "Many students in rural areas have no access to high-speed internet.", "Many rural students do not have access to fast internet.", "Many rural students don't have access to high-speed internet."] },
        { q: "Người học trực tuyến có thể cảm thấy cô đơn và mất động lực.", hint: "Online learners, may / can, feel isolated, and lose motivation", answers: ["Online learners may feel isolated and lose motivation.", "Online learners can feel isolated and lose motivation.", "Online learners might feel isolated and lose motivation.", "Online learners may feel lonely and lose motivation.", "Online learners can feel lonely and lose motivation.", "Online learners might feel lonely and lose motivation.", "Online learners may feel isolated and lose their motivation.", "Online learners can feel isolated and lose their motivation."] },
        { q: "Trên lớp, học sinh nhận được góp ý ngay lập tức từ giáo viên.", hint: "In class, students, receive / get, immediate feedback, from their teachers", answers: ["In class, students receive immediate feedback from their teachers.", "In class students receive immediate feedback from their teachers.", "In class, students get immediate feedback from their teachers.", "In class students get immediate feedback from their teachers.", "In class, students receive immediate feedback from teachers.", "In class, students get immediate feedback from teachers.", "In the classroom, students receive immediate feedback from their teachers.", "In the classroom, students get immediate feedback from their teachers."] },
        { q: "Tôi đã phải dậy lúc sáu giờ để dự bài giảng đầu tiên.", hint: "had to, get up at six, to attend, the first lecture", answers: ["I had to get up at six to attend the first lecture.", "I had to get up at 6 to attend the first lecture.", "I had to get up at six o'clock to attend the first lecture.", "I had to wake up at six to attend the first lecture.", "I had to get up at 6 a.m. to attend the first lecture.", "I had to get up at six in order to attend the first lecture."] },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */
/*
 * Kịch bản tự viết. Practice 1: bài giảng ~5 phút về lịch sử học từ xa (note
 * completion, câu 31–40 đánh số như Part 4 thật). Practice 2: bài giảng ngắn về
 * đường cong quên lãng (summary completion 7 câu + 3 câu trắc nghiệm).
 * Mọi đáp án điền đều xuất hiện nguyên chữ trong lời giảng.
 */

const D13_LISTENING: Lesson = {
  id: "d13-nghe",
  kind: "listening",
  title: "Listening Part 4 — bài giảng học thuật (Note & Summary Completion)",
  goal: "Hiểu cấu trúc Listening Part 4, dùng từ tín hiệu (signposting) để bám theo bài giảng, và làm đúng dạng Note Completion / Summary Completion: đoán loại từ, nghe paraphrase, chép đúng một từ và đúng chính tả.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Part 4** = phần cuối, **khó nhất**: **một người** nói (thường là bài giảng đại học), **10 câu (31–40)**, chủ đề học thuật, **không có đoạn nghỉ giữa bài**.",
        "Dạng chính: **Note Completion** (điền vào ghi chú) và **Summary Completion** (điền vào đoạn tóm tắt) — thường **ONE WORD ONLY**.",
        "Bí quyết bám bài: nghe **từ tín hiệu** (signposting) như ==Firstly · Moving on to · However · In other words · To sum up==.",
        "Đáp án gần như luôn được **paraphrase** (nói bằng từ khác) và đi **theo thứ tự** ghi chú.",
        "Luyện: 2 bài giảng tự soạn — **lịch sử học từ xa** (10 câu) và **đường cong quên lãng** (10 câu).",
      ],
    },

    { t: "h", text: "1. Listening Part 4 trông như thế nào?" },
    {
      t: "table",
      head: ["Đặc điểm", "Part 4", "So với Part 1–3 (đã học)"],
      rows: [
        ["Số người nói", "**Một người** (độc thoại — monologue)", "Part 1 và 3 có 2–4 người; Part 2 cũng một người nhưng chủ đề đời thường"],
        ["Bối cảnh", "**Học thuật**: bài giảng, bài thuyết trình ở đại học", "Part 1–2 đời sống hằng ngày; Part 3 sinh viên thảo luận"],
        ["Câu hỏi", "**31–40** (10 câu)", "Mỗi Part 10 câu"],
        ["Dạng hay gặp", "**Note completion** (rất phổ biến), summary, sentence, flow-chart, đôi khi multiple choice", "Part 1 form/note; Part 2 map, MCQ; Part 3 MCQ, matching"],
        ["Giới hạn từ", "Thường **ONE WORD ONLY**", "Part 1 thường ONE WORD AND/OR A NUMBER"],
        ["Đoạn nghỉ", "**Không** có đoạn nghỉ giữa bài: đọc trước cả 10 câu", "Part 1–3 thường có một đoạn nghỉ ngắn"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao Part 4 khó mà vẫn “ăn điểm” được",
      items: [
        "Từ vựng **học thuật** hơn (correspondence, broadcasting, principle…) và câu **dài** hơn. Nhưng bù lại: chỉ **một giọng**, nói **chậm và rõ** như giảng bài, **có cấu trúc** (mở bài → các ý → kết).",
        "Đáp án thường là **danh từ** cụ thể, đứng ngay sau từ tín hiệu hoặc từ khoá trong ghi chú.",
        "Người giảng hay **nói đáp án sai trước rồi sửa** (“You might expect… but…”) — giống bẫy của Part 1.",
      ],
    },

    { t: "h", text: "2. Chiến thuật làm Note / Summary Completion" },
    {
      t: "sodo",
      kind: "flow",
      title: "7 bước — từ lúc mở đề đến lúc chép đáp án",
      caption: "Bước 1–3 làm TRONG thời gian đọc đề (khoảng 30–45 giây). Bước 4–6 làm trong lúc nghe. Bước 7 làm cuối bài.",
      steps: [
        { label: "1. Đọc tiêu đề", sub: "Biết chủ đề: “A Short History of Distance Learning” → đoán từ sẽ nghe" },
        { label: "2. Đọc giới hạn từ", sub: "ONE WORD ONLY → không bao giờ viết 2 từ" },
        { label: "3. Đoán loại từ", sub: "Sau a / the / of → danh từ; sau very → tính từ; sau đã có danh từ số nhiều?" },
        { label: "4. Bám tiêu đề phụ", sub: "Mỗi tiêu đề (Stage 1, Stage 2…) = một phần bài giảng; nghe từ tín hiệu để chuyển" },
        { label: "5. Nghe paraphrase", sub: "Ghi chú: “far from” ↔ người nói: “a long way from”" },
        { label: "6. Chép đúng từ nghe được", sub: "Đúng chính tả, đúng số ít / số nhiều" },
        { label: "7. Soát cuối bài", sub: "Đọc lại câu ghi chú với đáp án: đúng ngữ pháp? đúng nghĩa?" },
      ],
    },
    {
      t: "table",
      head: ["Bẫy", "Ví dụ", "Cách tránh"],
      rows: [
        ["Nghe được từ nhưng **sai loại từ**", "Ghi chú: “taught by ___” — nghe “posted” mà viết ~~posted~~", "Sau **by** (cách thức) cần **danh từ**: **post**."],
        ["**Số ít / số nhiều**", "“No previous ___ were needed” — viết ~~qualification~~", "Động từ **were** → danh từ **số nhiều**: qualifications."],
        ["**Đáp án bị sửa**", "“You might expect the reason to be difficulty, but…”", "Gặp **might / you might expect / but / actually** → chờ thông tin sau."],
        ["**Vượt giới hạn từ**", "ONE WORD ONLY mà viết ~~national television~~", "Từ đã in sẵn trong ghi chú (national) thì **không chép lại**."],
        ["**Sai chính tả**", "~~qualificasions~~, ~~televison~~", "Từ học thuật hay gặp phải tập viết đúng (bài chép chính tả ở mục 4)."],
      ],
    },

    { t: "h", text: "3. Từ tín hiệu (signposting) — “biển chỉ đường” của bài giảng" },
    {
      t: "p",
      text: "**Signposting** (chỉ đường) là những cụm người giảng dùng để báo **sắp chuyển ý**, **sắp đưa ví dụ**, **sắp nói ý ngược lại**. Nghe được chúng thì dù lỡ một câu, bạn vẫn biết mình đang ở **ô ghi chú nào**.",
    },
    {
      t: "table",
      head: ["Chức năng", "Cụm hay gặp", "Nghe thấy thì…"],
      rows: [
        ["Giới thiệu dàn bài", "Today I'm going to talk about… · I'll describe three main stages…", "Đếm số phần → khớp với các tiêu đề trong ghi chú"],
        ["Bắt đầu / thứ tự", "First of all · The first stage is… · To begin with", "Chuẩn bị nghe câu đầu tiên của phần đó"],
        ["Chuyển ý", "Moving on to… · The second stage came with… · Let's now turn to…", "Chuyển sang **tiêu đề phụ mới**"],
        ["Đưa ví dụ", "For example · For instance · such as · The best-known example is…", "Đáp án hay nằm trong ví dụ cụ thể"],
        ["Ý ngược lại", "However · But · On the other hand · Although", "Thông tin **quan trọng** (thường là đáp án) đứng ngay sau"],
        ["Giải thích lại", "In other words · That is · What I mean is…", "Người nói nhắc lại ý bằng từ dễ hơn — cơ hội nghe lần hai"],
        ["Nhấn mạnh", "The key point is… · A key principle was… · Two features stand out", "Gần như chắc chắn có câu hỏi"],
        ["Kết luận", "To sum up · In conclusion · One last finding… · Next week we'll…", "Câu hỏi cuối cùng (40) ở quanh đây"],
      ],
    },
    {
      t: "mcq",
      id: "d13-nghe-tin-hieu",
      title: "Từ tín hiệu báo điều gì? (5 câu)",
      items: [
        { q: "“However, this model had one clear weakness.”", options: ["Đưa ví dụ", "Kết thúc bài", "Chuyển sang ý ngược lại (nhược điểm)"], correct: 2, why: "**However** báo ý **trái ngược** với điều vừa nói (vừa khen → giờ nói nhược điểm)." },
        { q: "“In other words, routine matters as much as talent.”", options: ["Nói lại ý vừa rồi bằng cách khác", "Bắt đầu phần mới", "Nêu ý kiến người khác"], correct: 0, why: "**In other words** = nói cách khác — nhắc lại ý chính cho dễ hiểu." },
        { q: "“The best-known example is the Open University.”", options: ["Kết luận", "Đưa ví dụ cụ thể", "Phản bác"], correct: 1, why: "**The best-known example is…** = ví dụ tiêu biểu nhất — đáp án hay nằm trong ví dụ." },
        { q: "“Let's now turn to the third stage.”", options: ["Chuyển sang phần mới", "Nhắc lại phần cũ", "Đặt câu hỏi cho sinh viên"], correct: 0, why: "**turn to** = chuyển sang → chuyển **tiêu đề phụ** trong ghi chú." },
        { q: "“You might expect the main reason to be difficulty, but…”", options: ["Đây chắc chắn là đáp án", "Người nói không biết", "Bẫy: đáp án đúng nằm sau “but”"], correct: 2, why: "**You might expect… but** = nêu điều người nghe tưởng, rồi **sửa lại**. Đáp án là thứ đứng sau **but**." },
      ],
    },

    { t: "h", text: "4. Chép đúng chính tả từ học thuật" },
    {
      t: "p",
      text: "Part 4 sai chính tả là **mất điểm** dù nghe đúng. Bài dưới đây đánh vần 8 từ hay ra và hay bị viết sai. Nghe đánh vần, gõ lại cả từ (chữ thường cũng được).",
    },
    {
      t: "dictation",
      id: "d13-nghe-chinh-ta",
      title: "Nghe đánh vần — 8 từ học thuật hay viết sai",
      items: [
        { label: "môi trường", spell: "E, N, V, I, R, O, N, M, E, N, T", answer: "environment" },
        { label: "chính phủ", spell: "G, O, V, E, R, N, M, E, N, T", answer: "government" },
        { label: "chỗ ở", spell: "A, double C, O, double M, O, D, A, T, I, O, N", answer: "accommodation" },
        { label: "cần thiết", spell: "N, E, C, E, double S, A, R, Y", answer: "necessary" },
        { label: "nhiệt độ", spell: "T, E, M, P, E, R, A, T, U, R, E", answer: "temperature" },
        { label: "kiến thức", spell: "K, N, O, W, L, E, D, G, E", answer: "knowledge" },
        { label: "thiết bị", spell: "E, Q, U, I, P, M, E, N, T", answer: "equipment" },
        { label: "bằng cấp", spell: "Q, U, A, L, I, F, I, C, A, T, I, O, N, S", answer: "qualifications" },
      ],
    },
    {
      t: "note",
      title: "Mẹo nhớ chính tả (phần thêm)",
      items: [
        "**environ-ment**, **govern-ment**: đều có chữ **n** trước -ment (người Việt hay quên vì không đọc rõ).",
        "**accommodation**: **hai c, hai m** — “phòng đủ rộng cho hai cái giường (cc) và hai cái nệm (mm)”.",
        "**necessary**: **một c, hai s** — “một cái áo (Collar), hai ống tay (Sleeves)”.",
        "**temperature**: có **a** giữa **per** và **ture** — đọc chậm “tem-per-a-ture” khi viết.",
      ],
    },

    { t: "h", text: "5. Practice 1 — Questions 31–40 (Note Completion)" },
    {
      t: "canh",
      anh: ["envelope", "television", "laptop", "teacher"],
      caption: "Một giảng viên kể lại gần 200 năm của việc học từ xa: từ những lá thư gửi qua bưu điện, đến chương trình học trên TV, rồi tới các khoá học trực tuyến hôm nay. Nhìn hình đoán trước ba giai đoạn của bài giảng.",
    },
    {
      t: "p",
      text: "Đọc **tiêu đề** và **toàn bộ ghi chú** dưới đây trước (đúng như 30–45 giây đọc đề trong phòng thi). Đoán loại từ cho mỗi chỗ trống. Rồi bấm nghe — **chỉ nghe một lần** như thi thật, sau đó điền đáp án.",
    },
    {
      t: "table",
      caption: "A Short History of Distance Learning — Complete the notes. Write ONE WORD ONLY for each answer.",
      head: ["Phần", "Ghi chú"],
      rows: [
        ["Stage 1: Correspondence education (from the 1840s)", "• Shorthand (a fast way of writing) was taught by **(31) ______** · • Students could take university exams without attending classes in London · • Helped people who worked long hours or lived far from a **(32) ______**"],
        ["Stage 2: Radio and television", "• Open University (1969): printed materials + programmes on national **(33) ______** · • No previous **(34) ______** were needed to join · • Weakness: communication in only one **(35) ______**; students felt isolated"],
        ["Stage 3: Online learning", "• MOOCs: tens of thousands of students; most are **(36) ______** · • Only 5–10% of people who registered **(37) ______** their course · • Main reason given: a lack of **(38) ______** (not difficulty)"],
        ["What makes it work", "• Regular contact with a **(39) ______** · • Small groups of four or five classmates · • Studying at the same time each day shows that **(40) ______** matters"],
      ],
    },
    {
      t: "listen",
      id: "d13-nghe-bai-1",
      title: "A Short History of Distance Learning",
      dan: { so: "Day 13, Practice 1", boiCanh: "part of a lecture about the history of distance learning.", cau: [31, 40] },
      note: "Giọng Anh-Anh, khoảng 5 phút. Bài giảng có 3 giai đoạn + phần nghiên cứu — nghe từ tín hiệu để biết đang ở dòng ghi chú nào.",
      lines: [
        { who: "Lecturer", voice: "uk-nu", text: "Good morning, everyone. Today I'm going to talk about the history of distance learning — that is, any kind of education in which the teacher and the students are not in the same place. Many people assume it began with the internet, but in fact it's almost two hundred years old. I'll describe three main stages, and then I'll finish with some research on what actually makes it work.", vi: "Chào buổi sáng mọi người. Hôm nay tôi sẽ nói về lịch sử của học từ xa — tức là bất kỳ hình thức giáo dục nào mà thầy và trò không ở cùng một nơi. Nhiều người cho rằng nó bắt đầu cùng internet, nhưng thật ra nó đã gần hai trăm năm tuổi. Tôi sẽ mô tả ba giai đoạn chính, rồi kết thúc bằng một số nghiên cứu về điều thật sự làm nó hiệu quả." },
        { who: "Lecturer", voice: "uk-nu", text: "The first stage is usually called correspondence education, and it began in Britain in the 1840s. A teacher named Isaac Pitman wanted to spread his system of shorthand, which is a fast way of writing that uses simple symbols. So he taught it by post. Students copied short passages in shorthand and sent them to him, and he returned them with corrections. This was only possible because a cheap national postal service had just been introduced.", vi: "Giai đoạn đầu thường được gọi là giáo dục qua thư từ, bắt đầu ở Anh vào những năm 1840. Một giáo viên tên Isaac Pitman muốn phổ biến hệ thống tốc ký của mình — một cách viết nhanh bằng các ký hiệu đơn giản. Vì vậy ông dạy nó qua đường bưu điện. Học viên chép các đoạn ngắn bằng tốc ký rồi gửi cho ông, và ông gửi trả lại kèm chỗ sửa. Điều này chỉ khả thi vì một dịch vụ bưu chính quốc gia giá rẻ vừa ra đời." },
        { who: "Lecturer", voice: "uk-nu", text: "Over the next few decades, the idea spread to higher education. From 1858, the University of London allowed students to take its exams without ever attending classes in the city, and some of them lived on the other side of the world. For people who worked long hours, or who lived a long way from a college, this was an enormous opportunity.", vi: "Trong vài thập kỷ sau đó, ý tưởng này lan sang giáo dục đại học. Từ năm 1858, Đại học London cho phép sinh viên dự thi mà không cần đến lớp trong thành phố, và một số người sống ở tận bên kia thế giới. Với những người làm việc nhiều giờ, hoặc sống xa trường cao đẳng, đây là một cơ hội rất lớn." },
        { who: "Lecturer", voice: "uk-nu", text: "The second stage came with broadcasting. In the 1920s, a number of American universities began to give lectures on the radio. But the best-known example is the Open University, which was founded in Britain in 1969. It combined printed materials, sent to students' homes, with programmes shown on national television, often very early in the morning. A key principle was that no previous qualifications were needed to join, so it attracted many adults who had left school at fifteen or sixteen.", vi: "Giai đoạn thứ hai đến cùng phát thanh truyền hình. Vào những năm 1920, một số trường đại học Mỹ bắt đầu giảng bài trên radio. Nhưng ví dụ nổi tiếng nhất là Đại học Mở, được thành lập ở Anh năm 1969. Trường kết hợp tài liệu in gửi đến nhà sinh viên với các chương trình phát trên truyền hình quốc gia, thường rất sớm vào buổi sáng. Một nguyên tắc then chốt là không cần bằng cấp gì trước đó để nhập học, nên trường thu hút nhiều người lớn đã nghỉ học từ năm mười lăm, mười sáu tuổi." },
        { who: "Lecturer", voice: "uk-nu", text: "However, this model had one clear weakness. Communication went in only one direction. Students could watch and listen, but they couldn't ask questions, and many of them said they felt isolated.", vi: "Tuy nhiên, mô hình này có một nhược điểm rõ ràng. Giao tiếp chỉ đi theo một chiều. Sinh viên có thể xem và nghe nhưng không thể đặt câu hỏi, và nhiều người nói họ cảm thấy cô lập." },
        { who: "Lecturer", voice: "uk-nu", text: "Let's now turn to the third stage, which is, of course, online learning. In the 1990s, email allowed students and tutors to exchange messages within minutes rather than weeks, and later, video platforms made it possible to join live classes from home. The biggest development was the MOOC — the massive open online course — which may have tens of thousands of students at the same time. Most MOOCs are free, and they made courses from famous universities available to anyone with an internet connection.", vi: "Giờ ta chuyển sang giai đoạn thứ ba — dĩ nhiên là học trực tuyến. Vào những năm 1990, email cho phép sinh viên và người hướng dẫn trao đổi tin nhắn trong vài phút thay vì vài tuần, và sau đó các nền tảng video giúp tham gia lớp học trực tiếp từ nhà. Bước phát triển lớn nhất là MOOC — khoá học trực tuyến mở đại trà — có thể có hàng chục nghìn học viên cùng lúc. Phần lớn MOOC miễn phí, và chúng đưa khoá học của các trường danh tiếng đến với bất kỳ ai có kết nối internet." },
        { who: "Lecturer", voice: "uk-nu", text: "But MOOCs also revealed a serious problem. Several large studies found that only around five to ten per cent of the people who registered actually completed their course. You might expect the main reason to be difficulty, but that was not what learners said. The reason they gave most often was a lack of motivation once nobody was checking on their progress.", vi: "Nhưng MOOC cũng để lộ một vấn đề nghiêm trọng. Nhiều nghiên cứu lớn cho thấy chỉ khoảng năm đến mười phần trăm số người đăng ký thực sự học xong khoá. Bạn có thể nghĩ lý do chính là vì khó, nhưng người học không nói vậy. Lý do họ nêu nhiều nhất là thiếu động lực khi không còn ai theo dõi tiến độ của họ." },
        { who: "Lecturer", voice: "uk-nu", text: "So, what makes distance learning succeed? The research suggests that it depends less on technology and more on course design. Two features stand out. The first is regular contact with a tutor — even a short video call every two weeks makes a difference. The second is working in small groups, where students discuss tasks with four or five classmates. On courses with both features, far more students finished, and their exam results were very similar to those of students taught face to face.", vi: "Vậy điều gì giúp học từ xa thành công? Nghiên cứu cho thấy nó phụ thuộc ít vào công nghệ mà nhiều vào cách thiết kế khoá học. Có hai đặc điểm nổi bật. Thứ nhất là liên lạc đều đặn với người hướng dẫn — chỉ một cuộc gọi video ngắn hai tuần một lần cũng tạo khác biệt. Thứ hai là làm việc theo nhóm nhỏ, nơi sinh viên thảo luận bài với bốn năm bạn cùng lớp. Ở các khoá có cả hai đặc điểm, số sinh viên học xong cao hơn hẳn, và kết quả thi của họ rất giống với sinh viên học trực tiếp." },
        { who: "Lecturer", voice: "uk-nu", text: "One last finding surprised the researchers. Students who studied at the same time every day did noticeably better than those who studied whenever they felt like it. In other words, routine matters as much as talent. Next week, we'll look at blended learning, which combines online and classroom teaching.", vi: "Một phát hiện cuối cùng làm các nhà nghiên cứu bất ngờ. Sinh viên học vào cùng một giờ mỗi ngày làm bài tốt hơn rõ rệt so với những người học lúc nào thích thì học. Nói cách khác, nề nếp quan trọng ngang với tài năng. Tuần sau, chúng ta sẽ tìm hiểu học kết hợp — kết hợp dạy trực tuyến và dạy trên lớp." },
      ],
    },
    {
      t: "quiz",
      id: "d13-nghe-p1",
      title: "Questions 31–40 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(31) Shorthand (a fast way of writing) was taught by ___", answers: ["post"], hint: "sau by (cách thức) → danh từ" },
        { q: "(32) Helped people who worked long hours or lived far from a ___", answers: ["college"], hint: "sau a → danh từ số ít, một nơi" },
        { q: "(33) Open University (1969): printed materials + programmes on national ___", answers: ["television", "TV"], hint: "phương tiện phát sóng" },
        { q: "(34) No previous ___ were needed to join", answers: ["qualifications"], hint: "were → danh từ số nhiều" },
        { q: "(35) Weakness: communication in only one ___", answers: ["direction"], hint: "one ___ → danh từ số ít" },
        { q: "(36) MOOCs: tens of thousands of students; most are ___", answers: ["free"], hint: "sau are → tính từ" },
        { q: "(37) Only 5–10% of people who registered ___ their course", answers: ["completed"], hint: "chỗ trống là động từ (quá khứ)" },
        { q: "(38) Main reason given: a lack of ___ (not difficulty)", answers: ["motivation"], hint: "a lack of + danh từ" },
        { q: "(39) Regular contact with a ___", answers: ["tutor"], hint: "a + danh từ chỉ người" },
        { q: "(40) Studying at the same time each day shows that ___ matters", answers: ["routine"], hint: "danh từ không đếm được" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 31–35",
      items: [
        "**(31) post** — “So he taught it **by post**.” Bẫy: ngay sau là “**postal** service” — nhưng ghi chú hỏi **cách dạy** (taught by ___), và **by post** là cụm cố định (gửi qua bưu điện). Không viết ~~posted~~ (động từ).",
        "**(32) college** — “who lived **a long way from** a college” = ghi chú “lived **far from** a ___” (paraphrase: far from ↔ a long way from).",
        "**(33) television** (TV cũng được chấp nhận) — Bẫy: **radio** nghe trước, nhưng đó là của **các trường Mỹ những năm 1920**, không phải Open University. “programmes shown on national **television**”.",
        "**(34) qualifications** — “**no previous qualifications** were needed to join”. Phải có **-s**: động từ **were** cho biết danh từ số nhiều.",
        "**(35) direction** — “Communication went in **only one direction**.” Tín hiệu **However, this model had one clear weakness** báo ngay đáp án sắp tới.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 36–40",
      items: [
        "**(36) free** — “**Most MOOCs are free**” khớp nguyên văn “most are ___”. Sau **are** cần tính từ.",
        "**(37) completed** — “only around five to ten per cent of the people who registered **actually completed** their course”. Ghi chú cần **động từ quá khứ** (cùng thì với registered).",
        "**(38) motivation** — Bẫy kinh điển: “You might expect the main reason to be **difficulty**, **but** that was not what learners said.” Đáp án đứng sau **but**: “a lack of **motivation**”. Ghi chú còn ghi sẵn “(not difficulty)” để xác nhận.",
        "**(39) tutor** — “**regular contact with a tutor**”. Không phải ~~classmates~~ (đó là đặc điểm thứ hai — small groups — đã in sẵn trong ghi chú).",
        "**(40) routine** — “**In other words, routine matters** as much as talent.” Tín hiệu **In other words** nhắc lại ý bằng một từ — đúng chỗ đặt câu hỏi cuối.",
      ],
    },

    { t: "h", text: "6. Practice 2 — Summary Completion + Multiple Choice" },
    {
      t: "canh",
      anh: ["brain", "spiral-calendar", "mobile-phone"],
      caption: "Một bài giảng ngắn về trí nhớ: vì sao ta quên nhanh, và cách ôn cách quãng (spaced repetition) mà các ứng dụng học từ vựng đang dùng.",
    },
    {
      t: "p",
      text: "Đoạn tóm tắt dưới đây **viết lại** nội dung bài giảng bằng từ khác. Đọc trước cả đoạn, đoán loại từ cho mỗi chỗ trống. **Write ONE WORD ONLY.** Sau đó trả lời 3 câu trắc nghiệm.",
    },
    {
      t: "table",
      caption: "Summary — The Forgetting Curve",
      head: ["", "Complete the summary below. Write ONE WORD ONLY for each answer."],
      rows: [
        ["", "To test memory without the help of meaning, Ebbinghaus invented **(1) ______** syllables, and he was the only **(2) ______** in his experiments. He found that memory drops very sharply at first: much was lost within the first **(3) ______**. Later, the decline became much **(4) ______**. Every time he reviewed a list, the curve became **(5) ______**. Today, reviewing material several times with gaps in between is called spaced **(6) ______**, and this idea is used by many language-learning **(7) ______**."],
      ],
    },
    {
      t: "listen",
      id: "d13-nghe-bai-2",
      title: "The Forgetting Curve",
      dan: { so: "Day 13, Practice 2", boiCanh: "a short lecture about how quickly we forget what we learn.", cau: [1, 10] },
      note: "Giọng Anh-Mỹ, khoảng 2 phút 30 giây. Có thể nghe hai lần: lần một điền tóm tắt, lần hai làm trắc nghiệm.",
      lines: [
        { who: "Lecturer", voice: "us-nam", text: "Hi everyone. Today I want to look at something every student experiences, and that's forgetting. In the 1880s, a German psychologist called Hermann Ebbinghaus decided to measure how quickly we forget. He wanted to test memory without any help from meaning, so he invented hundreds of nonsense syllables — short groups of letters like 'wid' or 'zof' that aren't real words. He was also the only subject in his experiments: he tested nobody but himself.", vi: "Chào mọi người. Hôm nay tôi muốn bàn về một điều mọi sinh viên đều trải qua: sự quên. Vào những năm 1880, nhà tâm lý học người Đức Hermann Ebbinghaus quyết định đo xem chúng ta quên nhanh đến mức nào. Ông muốn kiểm tra trí nhớ mà không có sự trợ giúp của nghĩa, nên ông tạo ra hàng trăm âm tiết vô nghĩa — những nhóm chữ ngắn như “wid” hay “zof” không phải từ thật. Ông cũng là đối tượng duy nhất trong các thí nghiệm của mình: ông không kiểm tra ai ngoài chính mình." },
        { who: "Lecturer", voice: "us-nam", text: "Ebbinghaus learned lists of these syllables until he could repeat them perfectly, and then he tested himself again after different periods of time. The results gave us what we now call the forgetting curve. It shows that memory drops very sharply at first. Within the first hour, he had already lost a large part of each list, and after one day most of it had gone. After that, though, the decline became much slower.", vi: "Ebbinghaus học thuộc các danh sách âm tiết này cho đến khi lặp lại hoàn hảo, rồi tự kiểm tra lại sau những khoảng thời gian khác nhau. Kết quả cho ta thứ mà ngày nay gọi là đường cong quên lãng. Nó cho thấy trí nhớ giảm rất mạnh lúc đầu. Trong giờ đầu tiên, ông đã mất một phần lớn mỗi danh sách, và sau một ngày thì phần lớn đã biến mất. Tuy nhiên sau đó, sự suy giảm chậm hơn nhiều." },
        { who: "Lecturer", voice: "us-nam", text: "The good news is that he also found a way to fight back. Every time he reviewed a list, he forgot it more slowly afterwards — the curve became flatter with each review. Today, this method is called spaced repetition. Instead of studying something ten times in one evening, you review it a few times with gaps in between: say, after one day, then three days, then a week. Many language-learning apps are built on exactly this idea.", vi: "Tin tốt là ông cũng tìm ra cách chống lại. Mỗi lần ôn lại một danh sách, sau đó ông quên chậm hơn — đường cong thoải dần sau mỗi lần ôn. Ngày nay phương pháp này gọi là lặp lại ngắt quãng. Thay vì học một thứ mười lần trong một buổi tối, bạn ôn nó vài lần có khoảng cách ở giữa: chẳng hạn sau một ngày, rồi ba ngày, rồi một tuần. Nhiều ứng dụng học ngôn ngữ được xây dựng đúng trên ý tưởng này." },
        { who: "Lecturer", voice: "us-nam", text: "I should mention one limitation. Ebbinghaus studied only one person, and nonsense syllables are very different from the meaningful material students normally learn. However, later studies using real vocabulary and facts have found very similar curves, so his main conclusion still stands.", vi: "Tôi cần nhắc đến một hạn chế. Ebbinghaus chỉ nghiên cứu một người, và âm tiết vô nghĩa rất khác với tài liệu có nghĩa mà sinh viên thường học. Tuy vậy, các nghiên cứu sau này dùng từ vựng và kiến thức thật đã tìm ra những đường cong rất giống, nên kết luận chính của ông vẫn đứng vững." },
      ],
    },
    {
      t: "quiz",
      id: "d13-nghe-p2",
      title: "Summary (1–7) — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(1) Ebbinghaus invented ___ syllables", answers: ["nonsense"], hint: "tính chất của âm tiết — không có nghĩa" },
        { q: "(2) he was the only ___ in his experiments", answers: ["subject"], hint: "the only + danh từ chỉ người tham gia thí nghiệm" },
        { q: "(3) much was lost within the first ___", answers: ["hour"], hint: "khoảng thời gian" },
        { q: "(4) Later, the decline became much ___", answers: ["slower"], hint: "much + tính từ so sánh hơn" },
        { q: "(5) Every time he reviewed a list, the curve became ___", answers: ["flatter"], hint: "tính từ so sánh hơn — hình dạng đường cong" },
        { q: "(6) reviewing material several times with gaps in between is called spaced ___", answers: ["repetition"], hint: "danh từ" },
        { q: "(7) this idea is used by many language-learning ___", answers: ["apps"], hint: "danh từ số nhiều" },
      ],
    },
    {
      t: "mcq",
      id: "d13-nghe-p2-chon",
      title: "Questions 8–10 — chọn A, B hoặc C",
      items: [
        { q: "(8) Why did Ebbinghaus use nonsense syllables?", options: ["Meaning would not help him remember them.", "They were easier to pronounce.", "Real words were too long to learn."], correct: 0, why: "“He wanted to test memory **without any help from meaning**.” Bài không nói gì về phát âm hay độ dài từ." },
        { q: "(9) According to the lecturer, when did forgetting become much slower?", options: ["After the first hour", "After about one day", "After one week"], correct: 1, why: "“Within the first hour… lost a large part… **after one day** most of it had gone. **After that**, though, the decline became much slower.” Bẫy: “first hour” nghe trước nhưng lúc đó vẫn đang quên rất nhanh; “a week” là lịch ôn tập, không phải lúc quên chậm lại." },
        { q: "(10) What does the lecturer say about later studies?", options: ["They used only nonsense syllables.", "They showed that Ebbinghaus was wrong.", "They found similar results with real material."], correct: 2, why: "“later studies using **real vocabulary and facts** have found **very similar curves**, so his main conclusion **still stands**.” Tín hiệu **However** báo ý chính đứng sau." },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 2 — paraphrase giữa tóm tắt và bài giảng",
      items: [
        "**(1) nonsense** — “invented hundreds of **nonsense syllables**”. Tóm tắt viết “to test memory **without the help of meaning**” = “without any help from meaning”.",
        "**(2) subject** — “He was also the **only subject** in his experiments” (subject = người/đối tượng tham gia thí nghiệm — nghĩa khác của “môn học”).",
        "**(3) hour** — “**Within the first hour**, he had already lost a large part” ↔ “much was lost within the first ___”.",
        "**(4) slower** — “the decline became **much slower**”. Bẫy: viết ~~slow~~ là sai — sau **much** phải là **so sánh hơn**.",
        "**(5) flatter** — “the curve became **flatter** with each review” ↔ “Every time he reviewed a list”. Chính tả: **flat → flatter** (gấp đôi t).",
        "**(6) repetition** — “this method is called **spaced repetition**”. Bẫy chính tả: re-**pe**-ti-tion.",
        "**(7) apps** — “Many **language-learning apps** are built on exactly this idea”. Phải số nhiều (**many** … apps).",
      ],
    },
    {
      t: "note",
      title: "Mẹo tự luyện Part 4 sau bài này (phần thêm)",
      items: [
        "**Nghe lại có lời**: mở lời giảng, nghe lại và gạch chân mọi **từ tín hiệu** — bạn sẽ thấy đáp án gần như luôn đứng ngay sau chúng.",
        "**Shadowing** (nói đuổi): nghe một câu, dừng, nói lại y hệt ngữ điệu. Làm 5 phút mỗi ngày với một đoạn Part 4 giúp tai quen tốc độ bài giảng.",
        "**Sổ paraphrase**: ghi các cặp ghi chú ↔ lời nói đã gặp hôm nay (far from ↔ a long way from; taught by ↔ taught it by; most are free ↔ most MOOCs are free).",
        "Bài nghe dài dễ mất tập trung — luyện **nghe trọn một bài 5 phút không dừng**, đúng như Part 4 thật (không có đoạn nghỉ giữa).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D13_HOMEWORK: Lesson = {
  id: "d13-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 13",
  goal: "Ôn trọn Ngày 13: dịch câu dùng modal và từ vựng học tập, chọn modal đúng nghĩa, điền và sửa lỗi, rồi viết một đoạn ngắn về học trực tuyến.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (41 câu + 1 đoạn viết)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡 gợi ý): modal + từ vựng học tập.",
        "**II. Trắc nghiệm** (10 câu): chọn modal đúng nghĩa, collocation đúng.",
        "**III. Điền từ** (10 câu): modal và từ vựng.",
        "**IV. Sửa lỗi** (6 câu): viết lại cả câu cho đúng. **V. Từ tín hiệu** (5 câu).",
        "**VI. Viết ngắn**: một đoạn thân bài ~150 từ về ưu điểm của học trực tuyến, dùng ít nhất 4 modal.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 13 trước khi làm bài",
      caption: "Nhìn lại ba nhánh này 1 phút. Làm sai câu nào thì quay về đúng mục của bài đó.",
      center: "**Ngày 13**",
      branches: [
        { label: "Modal — chọn theo NGHĨA", items: ["khả năng: can / could / be able to", "cấm: mustn't · không cần: don't have to", "khuyên: should · đoán: must / might / can't"] },
        { label: "Từ vựng học tập", items: ["attend a lecture · submit an assignment", "study at your own pace · feel isolated", "-ed (người) ≠ -ing (vật)"], anh: "laptop" },
        { label: "Listening Part 4", items: ["đọc trước cả 10 câu", "nghe từ tín hiệu: However · In other words", "ONE WORD — đúng chính tả, số ít/nhiều"], anh: "headphone" },
      ],
    },
    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "d13-bt-dich",
      title: "I. Dịch sang tiếng Anh — modal + từ vựng (10 câu)",
      kind: "translate",
      grammar: "S + modal + V nguyên mẫu · have to / has to / had to · mustn't (cấm) ≠ don't have to (không cần) · will be able to · should cho lời khuyên · may / might / can't cho phỏng đoán.",
      items: [
        { q: "Bạn không được dùng điện thoại trong phòng thi.", hint: "You, mustn't / can't, use your phone, in the exam room", answers: ["You mustn't use your phone in the exam room.", "You must not use your phone in the exam room.", "You can't use your phone in the exam room.", "You cannot use your phone in the exam room.", "You mustn't use your phone in the examination room.", "You mustn't use your mobile phone in the exam room."] },
        { q: "Sinh viên học trực tuyến không cần đi đến trường.", hint: "Online students, don't have to / don't need to, travel to campus / the university", answers: ["Online students don't have to travel to campus.", "Online students do not have to travel to campus.", "Online students don't need to travel to campus.", "Online students don't have to travel to the university.", "Online students don't need to travel to the university.", "Online students don't have to go to campus.", "Online students don't have to go to the university.", "Online students needn't travel to campus."] },
        { q: "Hồi nhỏ tôi không biết bơi.", hint: "When I was a child / young, couldn't, swim", answers: ["When I was a child, I couldn't swim.", "When I was a child I couldn't swim.", "When I was young, I couldn't swim.", "When I was young I couldn't swim.", "I couldn't swim when I was a child.", "I couldn't swim when I was young.", "When I was a child, I could not swim.", "When I was little, I couldn't swim."] },
        { q: "Bạn có thể nói chậm hơn được không ạ?", hint: "Could you, speak more slowly, please", answers: ["Could you speak more slowly, please?", "Could you speak more slowly please?", "Could you please speak more slowly?", "Can you speak more slowly, please?", "Can you please speak more slowly?", "Could you speak a bit more slowly, please?"] },
        { q: "Chính phủ nên cung cấp máy tính miễn phí cho học sinh nghèo.", hint: "The government should, provide free computers, for poor students / to poor students", answers: ["The government should provide free computers for poor students.", "The government should provide free computers to poor students.", "The government should provide poor students with free computers.", "Governments should provide free computers for poor students.", "The government ought to provide free computers for poor students.", "The government should give free computers to poor students.", "The government should give poor students free computers."] },
        { q: "Cô ấy chắc hẳn rất có động lực — cô ấy học mỗi ngày.", hint: "She must be, very motivated; She studies every day", answers: ["She must be very motivated. She studies every day.", "She must be very motivated — she studies every day.", "She must be very motivated because she studies every day.", "She must be really motivated. She studies every day.", "She must be very motivated; she studies every day.", "She must be very motivated, she studies every day."] },
        { q: "Có thể ngày mai tôi sẽ tham gia một hội thảo trực tuyến.", hint: "I might / may, join / attend, a webinar, tomorrow", answers: ["I might join a webinar tomorrow.", "I may join a webinar tomorrow.", "I might attend a webinar tomorrow.", "I may attend a webinar tomorrow.", "Tomorrow I might join a webinar.", "Tomorrow, I might attend a webinar."] },
        { q: "Năm ngoái anh tôi đã phải bỏ học vì học phí cao.", hint: "had to, drop out of university, because of / because, high tuition fees", answers: ["Last year my brother had to drop out of university because of high tuition fees.", "Last year, my brother had to drop out of university because of high tuition fees.", "My brother had to drop out of university last year because of high tuition fees.", "Last year my brother had to drop out of university because the tuition fees were high.", "My brother had to drop out of university last year because the tuition fees were high.", "Last year my brother had to drop out of college because of high tuition fees.", "Last year, my brother had to drop out of university because the tuition fees were high."] },
        { q: "Sau khoá học này, bạn sẽ có thể tự học theo tốc độ của mình.", hint: "After this course, will be able to, study at your own pace", answers: ["After this course, you will be able to study at your own pace.", "After this course you will be able to study at your own pace.", "After this course, you'll be able to study at your own pace.", "After this course you'll be able to study at your own pace.", "After this course, you will be able to learn at your own pace.", "After this course, you'll be able to learn at your own pace."] },
        { q: "Đó không thể là giảng viên của chúng tôi — thầy ấy đang ở nước ngoài.", hint: "That can't be, our lecturer; He is abroad", answers: ["That can't be our lecturer. He is abroad.", "That can't be our lecturer. He's abroad.", "That can't be our lecturer — he's abroad.", "That can't be our lecturer because he is abroad.", "That can't be our lecturer because he's abroad.", "That cannot be our lecturer. He is abroad.", "That can't be our lecturer; he's abroad.", "That can't be our lecturer, he's abroad."] },
      ],
    },
    { t: "h", text: "II. Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "d13-bt-chon",
      title: "II. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "In the UK, drivers ___ drive on the left. It's the law.", options: ["might", "don't have to", "have to"], correct: 2, why: "Luật bắt buộc từ bên ngoài → **have to**." },
        { q: "You ___ bring your own laptop. The library has computers.", options: ["don't have to", "mustn't", "can't"], correct: 0, why: "Thư viện có máy → **không cần** mang = **don't have to**. mustn't/can't = cấm mang, sai nghĩa." },
        { q: "I ___ finish the essay last night because the Wi-Fi was down.", options: ["mustn't", "couldn't", "shouldn't"], correct: 1, why: "Không làm được trong quá khứ → **couldn't** (phủ định thì could và wasn't able to đều đúng)." },
        { q: "___ I leave the room for a moment? (nói với giám khảo)", options: ["Must", "May", "Should"], correct: 1, why: "Xin phép **trang trọng** → **May I…?**" },
        { q: "He has a fever and a cough. He ___ go to work today.", options: ["shouldn't", "mustn't to", "doesn't can"], correct: 0, why: "Lời khuyên → **shouldn't + V**. ~~mustn't to~~ và ~~doesn't can~~ sai cấu trúc." },
        { q: "She ___ be at home — her bike is outside.", options: ["can't", "mustn't", "must"], correct: 2, why: "Có bằng chứng (xe để ngoài) → gần như chắc chắn → **must be**." },
        { q: "Students on this course ___ to submit three assignments.", options: ["must", "should", "have"], correct: 2, why: "Sau chỗ trống có **to** → **have to**. must/should không đi với to." },
        { q: "Online classes are ___ for students who work during the day.", options: ["convenient", "convenience", "conveniently"], correct: 0, why: "Sau **are** cần **tính từ**: convenient." },
        { q: "I missed the lecture, but I watched the ___ version at home.", options: ["recording", "recorded", "record"], correct: 1, why: "**recorded** lecture/version = bản đã ghi hình (đuôi -ed = bị ghi lại)." },
        { q: "In Listening Part 4, the phrase “In other words…” usually means the speaker will…", options: ["repeat the idea in a simpler way", "move to a new topic", "give the opposite idea"], correct: 0, why: "**In other words** = nói cách khác → nhắc lại ý vừa nói, thường dễ hiểu hơn." },
      ],
    },
    { t: "h", text: "III. Điền từ (10 câu)" },
    {
      t: "quiz",
      id: "d13-bt-dien",
      title: "III. Điền một modal hoặc một từ vựng (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) Visitors ___ feed the animals. It makes them ill. (cấm)", answers: ["mustn't", "must not", "can't", "cannot"], hint: "cấm" },
        { q: "(2) ___ you help me with my homework, please? (nhờ lịch sự)", answers: ["Could", "Can", "Would"], hint: "nhờ lịch sự" },
        { q: "(3) My father ___ to wear a suit at work every day. (phải)", answers: ["has"], hint: "chủ ngữ số ít + ___ to" },
        { q: "(4) It's cloudy. It ___ rain later, so take an umbrella. (có thể)", answers: ["might", "may", "could"], hint: "chưa chắc" },
        { q: "(5) I'm sorry, I won't be ___ to come to your party on Saturday.", answers: ["able"], hint: "won't be ___ to" },
        { q: "(6) Students who live on ___ can walk to the library in five minutes.", answers: ["campus"], hint: "on ___ (khuôn viên trường)" },
        { q: "(7) Without a teacher checking, many students lose ___.", answers: ["motivation"], hint: "lose + danh từ (động lực)" },
        { q: "(8) Chemistry is difficult to learn online because it needs ___-on practice.", answers: ["hands"], hint: "___-on (thực hành)" },
        { q: "(9) Social media is a big ___ when you study at home.", answers: ["distraction"], hint: "a big + danh từ (thứ gây xao nhãng)" },
        { q: "(10) The government ___ build more schools in rural areas. (nên)", answers: ["should", "ought to"], hint: "lời khuyên, giải pháp" },
      ],
    },
    { t: "h", text: "IV. Sửa lỗi (6 câu)" },
    {
      t: "p",
      text: "Mỗi câu có **một lỗi**. Viết lại **cả câu** cho đúng (giữ dấu chấm cuối hay không đều được).",
    },
    {
      t: "quiz",
      id: "d13-bt-sua",
      title: "IV. Tìm và sửa lỗi — viết lại cả câu (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) She can speaks four languages.", answers: ["She can speak four languages."], hint: "sau modal: V nguyên mẫu" },
        { q: "(2) You must to show your ID card.", answers: ["You must show your ID card.", "You have to show your ID card."], hint: "must không đi với to" },
        { q: "(3) I will can call you tomorrow.", answers: ["I will be able to call you tomorrow.", "I'll be able to call you tomorrow.", "I can call you tomorrow."], hint: "không hai modal liền nhau" },
        { q: "(4) Do you can drive a car?", answers: ["Can you drive a car?", "Can you drive?"], hint: "câu hỏi: đảo modal" },
        { q: "(5) He don't have to wear a uniform.", answers: ["He doesn't have to wear a uniform.", "He does not have to wear a uniform."], hint: "have to chia như động từ thường" },
        { q: "(6) I musted stay at home last weekend.", answers: ["I had to stay at home last weekend.", "I had to stay home last weekend."], hint: "quá khứ của must" },
      ],
    },
    { t: "h", text: "V. Từ tín hiệu trong bài giảng (5 câu)" },
    {
      t: "quiz",
      id: "d13-bt-tin-hieu",
      title: "V. Điền một từ để hoàn thành cụm tín hiệu (5 câu)",
      kind: "fill",
      items: [
        { q: "(1) In other ___, the method saves both time and money. (nói cách khác)", answers: ["words"], hint: "In other ___" },
        { q: "(2) ___ on to the second point, let's look at costs. (chuyển sang)", answers: ["Moving"], hint: "___ on to" },
        { q: "(3) To ___ up, online learning has both benefits and drawbacks. (tóm lại)", answers: ["sum"], hint: "To ___ up" },
        { q: "(4) For ___, many apps use spaced repetition. (ví dụ)", answers: ["example", "instance"], hint: "For ___" },
        { q: "(5) First of ___, I'll explain what distance learning is. (trước hết)", answers: ["all"], hint: "First of ___" },
      ],
    },
    { t: "h", text: "VI. Viết ngắn" },
    {
      t: "essay",
      id: "d13-bt-viet",
      task: "Task 2",
      prompt: "Write ONE body paragraph (about 150 words) for this essay question: “Online learning is becoming more popular than traditional classroom learning. What are the advantages of online learning?” Use at least FOUR modal verbs (can, may, should, might, have to…) and at least FIVE words from today's vocabulary lesson.",
      minWords: 120,
      tips: [
        "Câu chủ đề: **One major advantage of online learning is its flexibility.**",
        "Giải thích bằng modal: Students **can** study at their own pace… · They **don't have to** commute… · Working adults **may** find it easier to…",
        "Ví dụ cụ thể: một sinh viên ở vùng xa / một người mẹ đi làm.",
        "Từ vựng gợi ý: flexibility, self-paced, recorded lectures, commute, accessible, cost-effective, tuition fees.",
        "Câu kết đoạn: **Therefore, online courses can make higher education accessible to many more people.**",
      ],
    },
  ],
};

export const NGAY_13: Lesson[] = [D13_GRAMMAR, D13_VOCAB, D13_LISTENING, D13_HOMEWORK];
