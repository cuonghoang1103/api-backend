/**
 * Ngày 3 — Đại từ · Từ vựng Giáo dục & Xã hội · Nghe chép chính tả 1 · Bài tập.
 * Theo sách trang 38–52. Lời giảng, câu ví dụ, kịch bản nghe và câu bài tập
 * đều VIẾT MỚI (xem ../SOAN-BAI.md); giữ đủ điểm kiến thức, từ và số câu.
 */
import type { Lesson } from '../data';

const D3_GRAMMAR: Lesson = {
  id: 'd3-ngu-phap',
  kind: 'grammar',
  title: 'Đại từ (Pronouns)',
  goal: 'Nắm 7 loại đại từ, chọn đúng I/me/my/mine, dùng who/which/that để nối câu và dùng đại từ để bài Writing Task 2 bớt lặp từ.',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này học gì, cần nhớ gì',
      items: [
        '**Đại từ** = từ đứng **thay cho danh từ** đã nhắc, để câu không bị lặp. Có **7 loại**: nhân xưng, sở hữu, phản thân, chỉ định, nghi vấn, quan hệ (và nhân xưng chia 2 dạng chủ ngữ / tân ngữ).',
        'Chọn dạng theo **chỗ đứng**: trước động từ → ==I, he, she, we, they==; sau động từ / giới từ → ==me, him, her, us, them==.',
        'Có danh từ theo sau → **my, your, their…**; đứng một mình → **mine, yours, theirs…**. Tự mình / một mình → **myself, by themselves…**',
        '**who** cho người, **which** cho vật, **that** cho cả hai; **whose** = của ai. **It is + adj + to V** khi chủ ngữ thật là một cụm dài.',
        'Mỗi mục có **Công thức 1 dòng** và **bài dịch Việt → Anh** ngắn (bấm 💡 để xem từ + cấu trúc). Làm hết trước khi sang bài từ vựng.',
      ],
    },
    { t: 'h', text: '1. Đại từ là gì? Bảng 7 loại đại từ' },
    {
      t: 'p',
      text: "**Đại từ** (pronoun) là từ đứng **thay cho một danh từ** đã nhắc tới, để khỏi phải lặp lại danh từ đó. Thay vì nói \"Lan thích sách. Lan đọc sách mỗi tối\", ta nói \"Lan thích sách. ==Cô ấy== đọc ==chúng== mỗi tối\". Trong bài thi, dùng đại từ đúng giúp câu văn **gọn và mạch lạc** — giám khảo chấm điều này ở tiêu chí **Coherence and Cohesion** (sự mạch lạc và liên kết).",
    },
    {
      t: 'table',
      caption: '7 loại đại từ cần nắm',
      head: ['Loại đại từ', 'Các từ', 'Dùng để', 'Ví dụ'],
      rows: [
        ['**Đại từ nhân xưng — chủ ngữ** (Subject Pronouns)', 'I (tôi), you (bạn), he (anh ấy), she (cô ấy), it (nó), we (chúng tôi), they (họ)', 'Làm **chủ ngữ**, đứng trước động từ', '**They** study online every evening. — Họ học trực tuyến mỗi tối.'],
        ['**Đại từ nhân xưng — tân ngữ** (Object Pronouns)', 'me, you, him, her, it, us, them', 'Làm **tân ngữ**: đứng sau động từ hoặc sau giới từ', 'The teacher praised **us** for our project. — Cô giáo khen chúng tôi vì dự án.'],
        ['**Đại từ sở hữu** (Possessive Pronouns)', 'mine (của tôi), yours (của bạn), his (của anh ấy), hers (của cô ấy), ours (của chúng tôi), theirs (của họ) — its (của nó) rất hiếm dùng', 'Thay cho cả cụm **"của ai + danh từ"**, đứng MỘT MÌNH', 'That red bike is **hers**. — Chiếc xe đạp đỏ kia là của cô ấy.'],
        ['**Đại từ phản thân** (Reflexive Pronouns)', 'myself, yourself, himself, herself, itself, ourselves, yourselves, themselves', 'Hành động **quay lại chính người làm**; hoặc nhấn mạnh "tự mình"', 'He taught **himself** to play the guitar. — Anh ấy tự học chơi guitar.'],
        ['**Đại từ chỉ định** (Demonstrative Pronouns)', 'this (cái này), that (cái đó), these (những cái này), those (những cái kia)', 'Chỉ vật ở **gần / xa**, số ít / số nhiều', '**These** are my old notebooks. — Đây là những cuốn vở cũ của tôi.'],
        ['**Đại từ nghi vấn** (Interrogative Pronouns)', 'who (ai), whom (ai — làm tân ngữ), whose (của ai), which (cái nào), what (cái gì)', 'Mở đầu **câu hỏi**', '**Which** do you prefer, maths or physics? — Bạn thích môn nào hơn, toán hay lý?'],
        ['**Đại từ quan hệ** (Relative Pronouns)', 'who, whom, whose, which, that', '**Nối hai câu**, bổ nghĩa cho danh từ đứng trước', 'The girl **who** sits next to me speaks three languages. — Cô bạn ngồi cạnh tôi nói được ba thứ tiếng.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ',
      items: [
        'Cùng một chữ có thể thuộc nhiều loại: **who** vừa là đại từ nghi vấn (**Who is he?**) vừa là đại từ quan hệ (**the man who helped me**). Nhìn **vị trí trong câu** để biết nó đang làm gì.',
        '**you** giống nhau ở cả chủ ngữ lẫn tân ngữ, số ít lẫn số nhiều. **it** cũng vậy (chủ ngữ và tân ngữ đều là it).',
      ],
    },
    {
      t: 'rule',
      formula: 'N (nhắc lần 1)  →  đại từ (he / it / they / this / who…) (nhắc lần 2)',
      vi: 'Danh từ đã nói một lần rồi thì lần sau thay bằng đại từ cho gọn — đại từ phải khớp người/vật và số ít/số nhiều.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-loai-dich',
      title: 'Dịch nhanh — nhận ra từng loại đại từ (4 câu)',
      kind: 'translate',
      grammar: 'Danh từ nhắc lần 2 → đại từ. Người số ít: he/she; vật: it; số nhiều: they/them. Hỏi "ai" → Who; "của tôi" đứng một mình → mine.',
      items: [
        { q: 'Lan thích sách. Cô ấy đọc chúng mỗi tối.', hint: 'Lan likes books, she, read, them, every evening', answers: ['Lan likes books. She reads them every evening.', 'Lan likes books. She reads them every night.', 'Lan loves books. She reads them every evening.', 'Lan loves books. She reads them every night.'] },
        { q: 'Đây là bạn tôi. Anh ấy học ở Hà Nội.', hint: 'this, my friend, he, study', answers: ['This is my friend. He studies in Hanoi.', 'This is my friend. He studies in Ha Noi.', 'This is my friend. He is studying in Hanoi.', "This is my friend. He's studying in Hanoi."] },
        { q: 'Ai đang gọi bạn vậy?', hint: 'who, call, you', answers: ['Who is calling you?', "Who's calling you?"] },
        { q: 'Cái túi này là của tôi.', hint: 'this bag, mine', answers: ['This bag is mine.'] },
      ],
    },

    { t: 'h', text: '2. Chủ ngữ hay tân ngữ: I hay me?' },
    {
      t: 'p',
      text: 'Tiếng Việt chỉ có một chữ "tôi" cho mọi vị trí. Tiếng Anh thì đổi hình dạng theo **chỗ đứng**: đứng trước động từ (người làm) → dạng **chủ ngữ**; đứng sau động từ hoặc sau giới từ (người chịu tác động) → dạng **tân ngữ**.',
    },
    {
      t: 'table',
      head: ['Chủ ngữ', 'Tân ngữ', 'Ví dụ ghép cả hai'],
      rows: [
        ['I', 'me', '**I** called her, and she called **me** back. — Tôi gọi cô ấy, và cô ấy gọi lại cho tôi.'],
        ['you', 'you', '**You** know the answer. I trust **you**. — Bạn biết đáp án. Tôi tin bạn.'],
        ['he', 'him', '**He** is new, so please help **him**. — Cậu ấy mới đến, hãy giúp cậu ấy.'],
        ['she', 'her', '**She** won the prize, and we congratulated **her**. — Cô ấy đoạt giải, và chúng tôi chúc mừng cô ấy.'],
        ['it', 'it', '**It** is a useful app. I use **it** daily. — Đó là ứng dụng hữu ích. Tôi dùng nó hằng ngày.'],
        ['we', 'us', '**We** asked the teacher to test **us** again. — Chúng tôi xin thầy kiểm tra lại chúng tôi.'],
        ['they', 'them', '**They** need books, so the school gives **them** some. — Họ cần sách, nên trường tặng họ vài cuốn.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S (đại từ chủ ngữ) + V',
          vi: 'Đại từ đứng đầu câu, làm chủ ngữ',
          examples: [
            { en: 'She teaches chemistry.', vi: 'Cô ấy dạy hoá.' },
            { en: 'We usually revise together.', vi: 'Chúng tôi thường ôn bài cùng nhau.' },
          ],
        },
        {
          formula: 'S + V + O (đại từ tân ngữ)',
          vi: 'Đại từ đứng sau động từ, làm tân ngữ',
          examples: [
            { en: 'My parents support me.', vi: 'Bố mẹ ủng hộ tôi.' },
            { en: 'The coach trains them every morning.', vi: 'Huấn luyện viên tập cho họ mỗi sáng.' },
          ],
        },
        {
          formula: 'giới từ + đại từ tân ngữ',
          vi: 'Sau for, with, to, about, between… luôn dùng dạng tân ngữ',
          examples: [
            { en: 'This gift is for her.', vi: 'Món quà này dành cho cô ấy.' },
            { en: 'Can you study with us tonight?', vi: 'Tối nay bạn học cùng bọn mình được không?' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng tân ngữ làm chủ ngữ: ~~Me and my sister go to school by bus.~~ → **My sister and I go to school by bus.** Khi kể cả mình và người khác, tiếng Anh lịch sự đặt **người khác trước, "I" sau**.',
        'Dùng chủ ngữ sau giới từ: ~~This is a secret between you and I.~~ → **between you and me**. ~~The book is for she.~~ → **for her**.',
        'Quên đổi đại từ theo số nhiều: ~~Children need sleep because it helps it grow.~~ → **Children** need sleep because it helps **them** grow. Danh từ số nhiều → **they / them**.',
        'Lặp chủ ngữ: ~~My teacher she is very kind.~~ → **My teacher is very kind.** Đã có danh từ làm chủ ngữ thì không thêm đại từ ngay sau nó.',
        'Nhầm **he / she** khi nói nhanh (tiếng Việt nói "bạn ấy" cho cả nam lẫn nữ): ~~My mother… he works…~~ → **My mother… she works…** Giám khảo Speaking bắt lỗi này rất nhanh.',
      ],
    },
    {
      t: 'rule',
      formula: 'S (I / he / she / we / they) + V + O (me / him / her / us / them)',
      vi: 'Trước động từ → dạng chủ ngữ. Sau động từ hoặc sau giới từ (for, with, to, between…) → dạng tân ngữ.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-chu-tan-dich',
      title: 'Dịch — chủ ngữ hay tân ngữ? (5 câu)',
      kind: 'translate',
      grammar: 'S (I/he/she/we/they) + V + O (me/him/her/us/them). Sau giới từ luôn dùng tân ngữ. Kể cả mình: người khác trước, "I" sau.',
      items: [
        { q: 'Chị tôi và tôi đi học bằng xe buýt.', hint: 'my sister and I, go to school, by bus', answers: ['My sister and I go to school by bus.', 'My older sister and I go to school by bus.', 'My sister and I travel to school by bus.'] },
        { q: 'Thầy giáo giúp chúng tôi mỗi ngày.', hint: 'the teacher, help, us, every day', answers: ['The teacher helps us every day.', 'Our teacher helps us every day.', 'My teacher helps us every day.', 'The teacher helps us every single day.'] },
        { q: 'Món quà này dành cho cô ấy.', hint: 'this gift, for, her', answers: ['This gift is for her.', 'This present is for her.'] },
        { q: 'Họ gọi cho tôi tối qua.', hint: 'they, call, me, last night', answers: ['They called me last night.', 'They phoned me last night.', 'They rang me last night.'] },
        { q: 'Đây là bí mật giữa bạn và tôi.', hint: 'secret, between you and me', answers: ['This is a secret between you and me.', 'It is a secret between you and me.', "It's a secret between you and me."] },
      ],
    },

    { t: 'h', text: '3. my hay mine? Tính từ sở hữu và đại từ sở hữu' },
    {
      t: 'p',
      text: 'Phần này sách chưa tách riêng, nhưng đây là chỗ người mới học nhầm nhiều nhất. **Tính từ sở hữu** (my, your, his…) luôn **đi kèm một danh từ** phía sau. **Đại từ sở hữu** (mine, yours, his…) **đứng một mình**, vì nó đã "nuốt" luôn danh từ.',
    },
    {
      t: 'table',
      caption: 'Bảng so sánh đủ 7 ngôi: I / me / my / mine / myself — học thuộc theo HÀNG NGANG',
      head: ['Ngôi (nghĩa)', 'Chủ ngữ (trước V)', 'Tân ngữ (sau V / giới từ)', 'Tính từ sở hữu + N', 'Đại từ sở hữu (đứng một mình)', 'Phản thân'],
      rows: [
        ['Ngôi 1 số ít — **tôi**', '**I**', 'me', 'my book', 'mine', 'myself'],
        ['Ngôi 2 số ít — **bạn**', '**you**', 'you', 'your book', 'yours', 'yourself'],
        ['Ngôi 3 số ít — **anh ấy**', '**he**', 'him', 'his book', 'his', 'himself'],
        ['Ngôi 3 số ít — **cô ấy**', '**she**', 'her', 'her book', 'hers', 'herself'],
        ['Ngôi 3 số ít — **nó** (vật, con vật)', '**it**', 'it', 'its cover', '(gần như không dùng)', 'itself'],
        ['Ngôi 1 số nhiều — **chúng tôi / chúng ta**', '**we**', 'us', 'our books', 'ours', 'ourselves'],
        ['Ngôi 2 số nhiều — **các bạn**', '**you**', 'you', 'your books', 'yours', 'yourselves'],
        ['Ngôi 3 số nhiều — **họ, chúng nó**', '**they**', 'them', 'their books', 'theirs', 'themselves'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'I did my homework myself. Nobody helped me — the idea was all mine.', vi: 'Tôi tự làm bài tập của mình. Không ai giúp tôi — ý tưởng hoàn toàn là của tôi. (một câu dùng đủ 5 dạng của "I")' },
        { en: 'They told us their plan, but we preferred ours, so we did it by ourselves.', vi: 'Họ kể cho chúng tôi kế hoạch của họ, nhưng chúng tôi thích kế hoạch của mình hơn, nên chúng tôi tự làm.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng trên',
      items: [
        '**Chữ -s cuối** = đứng một mình: your → **yours**, her → **hers**, our → **ours**, their → **theirs**. Riêng **my → mine** và **his → his** (không đổi).',
        '**Phản thân**: ngôi 1 và 2 ghép với tính từ sở hữu (**my**self, **your**self, **our**selves); ngôi 3 ghép với tân ngữ (**him**self, **her**self, **it**self, **them**selves). Vì vậy không có ~~hisself~~, ~~theirselves~~.',
        '**-self** cho số ít, **-selves** cho số nhiều: yourself (một bạn) ≠ yourselves (nhiều bạn).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'This is my laptop. That one is yours.', vi: 'Đây là laptop của tôi. Cái kia là của bạn.' },
        { en: 'Her essay was longer than mine.', vi: 'Bài luận của cô ấy dài hơn bài của tôi.' },
        { en: 'Our school is small, but theirs is huge.', vi: 'Trường chúng tôi nhỏ, còn trường của họ thì rất lớn.' },
        { en: 'Lan is a friend of mine.', vi: 'Lan là một người bạn của tôi.' },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '~~This is mine book.~~ → **This is my book.** / **This book is mine.** Có danh từ phía sau thì dùng **my**, không có thì dùng **mine**.',
        'Đại từ sở hữu **không có dấu nháy**: ~~your\'s~~, ~~her\'s~~, ~~our\'s~~ → **yours, hers, ours**.',
        '**its** (của nó) ≠ **it\'s** (= it is / it has): *The school changed **its** rules.* nhưng ***It\'s** a good school.* Đây là lỗi chính tả hay gặp nhất trong bài viết IELTS.',
        '**their** (của họ) ≠ **there** (ở đó) ≠ **they\'re** (= they are). Ba chữ đọc gần giống nhau nên dễ viết nhầm.',
        'Sách xếp **its** vào bảng đại từ sở hữu. Trên thực tế **its** gần như chỉ dùng làm tính từ sở hữu (**its size**), rất hiếm khi đứng một mình — đừng viết ~~The idea is its.~~',
        'Người Việt hay sai: dịch từng chữ "của" thành **of**: ~~the book of me~~, ~~the car of my father~~ → **my book**, **my father\'s car**. Với người, sở hữu dùng **\'s** hoặc tính từ sở hữu.',
      ],
    },
    {
      t: 'rule',
      formula: 'my / your / his / her / its / our / their + N    ·    mine / yours / his / hers / ours / theirs (đứng một mình)',
      vi: 'Có danh từ ngay sau → tính từ sở hữu. Không có danh từ (đã hiểu là cái gì) → đại từ sở hữu.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-so-huu-dich',
      title: 'Dịch — my hay mine? (5 câu)',
      kind: 'translate',
      grammar: 'Tính từ sở hữu + N (my phone, their school) · Đại từ sở hữu đứng một mình (mine, yours, ours) · a friend of mine = một người bạn của tôi.',
      items: [
        { q: 'Đây là điện thoại của tôi, còn cái kia là của bạn.', hint: 'my phone, that one, yours', answers: ['This is my phone, and that one is yours.', 'This is my phone and that one is yours.', 'This is my phone, and that is yours.', 'This is my phone and that is yours.', 'This is my phone, but that one is yours.', 'This is my phone, while that one is yours.'] },
        { q: 'Bài luận của cô ấy dài hơn bài của tôi.', hint: 'her essay, longer than, mine', answers: ['Her essay is longer than mine.', 'Her essay was longer than mine.'] },
        { q: 'Trường của họ lớn hơn trường của chúng tôi.', hint: 'their school, bigger than, ours', answers: ['Their school is bigger than ours.', 'Their school is larger than ours.'] },
        { q: 'Công ty thay đổi quy định của nó mỗi năm.', hint: 'the company, change, its rules', answers: ['The company changes its rules every year.', 'The company changes its rules each year.', 'The company changes its regulations every year.'] },
        { q: 'Minh là một người bạn của tôi.', hint: 'a friend of mine', answers: ['Minh is a friend of mine.'] },
      ],
    },

    { t: 'h', text: '4. Đại từ phản thân: myself, themselves…' },
    {
      t: 'p',
      text: 'Đại từ phản thân kết thúc bằng **-self** (số ít) hoặc **-selves** (số nhiều). Nó có 3 cách dùng:',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + V + myself / themselves…',
          vi: 'Người làm và người chịu tác động là MỘT (chủ ngữ = tân ngữ)',
          examples: [
            { en: 'I cut myself while opening the box.', vi: 'Tôi tự làm đứt tay khi mở hộp.' },
            { en: 'Enjoy yourselves at the party!', vi: 'Các bạn đi tiệc vui vẻ nhé!' },
          ],
        },
        {
          formula: 'S + myself… + V  hoặc  S + V + O + myself…',
          vi: 'Nhấn mạnh: chính người đó, không phải ai khác',
          examples: [
            { en: 'The headmaster himself came to the meeting.', vi: 'Chính thầy hiệu trưởng đã đến buổi họp.' },
            { en: 'She designed the poster herself.', vi: 'Cô ấy tự thiết kế tấm áp phích.' },
          ],
        },
        {
          formula: 'by + myself / themselves…',
          vi: 'Một mình, không có ai giúp',
          examples: [
            { en: 'My brother lives by himself.', vi: 'Anh tôi sống một mình.' },
            { en: 'The students solved the problem by themselves.', vi: 'Học sinh tự giải bài toán mà không cần ai giúp.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Viết sai dạng: ~~hisself~~, ~~theirselves~~, ~~ourself~~ (khi nói "chúng tôi") → **himself, themselves, ourselves**.',
        'Dùng phản thân khi người làm và người chịu tác động KHÁC nhau: ~~My mother helped myself.~~ → **My mother helped me.**',
        'Nhiều động từ tiếng Việt có "tự/bản thân" nhưng tiếng Anh **không cần** đại từ phản thân: ~~I feel myself tired.~~ → **I feel tired.** ~~We relaxed ourselves.~~ → **We relaxed.** Các từ hay gặp: feel, relax, concentrate, meet, wake up.',
        '**themselves** ≠ **each other**: **They blamed themselves** = mỗi người tự trách mình; **They blamed each other** = họ trách lẫn nhau.',
      ],
    },
    {
      t: 'rule',
      formula: 'S + V + myself / yourself / himself / ourselves / themselves…    ·    by + oneself = một mình',
      vi: 'Chủ ngữ và tân ngữ là CÙNG một người → phản thân. Nhấn mạnh "tự mình" → đặt ngay sau S hoặc cuối câu.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-phan-than-dich',
      title: 'Dịch — đại từ phản thân (5 câu)',
      kind: 'translate',
      grammar: 'S + V + myself/himself/themselves… (tự làm cho chính mình) · by + himself/themselves = một mình, không ai giúp · She did it herself = chính cô ấy làm.',
      items: [
        { q: 'Tôi tự làm đứt tay khi đang nấu ăn.', hint: 'cut, myself, while cooking', answers: ['I cut myself while cooking.', 'I cut myself while I was cooking.', 'I cut myself when cooking.', 'I cut myself when I was cooking.'] },
        { q: 'Em trai tôi sống một mình.', hint: 'my younger brother, live, by himself', answers: ['My younger brother lives by himself.', 'My brother lives by himself.', 'My little brother lives by himself.', 'My younger brother lives alone.', 'My brother lives alone.'] },
        { q: 'Học sinh phải tự hoàn thành bài tập mà không cần ai giúp.', hint: 'students, must, complete, their assignments, by themselves', answers: ['Students must complete their assignments by themselves.', 'Students have to complete their assignments by themselves.', 'Students must complete the assignments by themselves.', 'Students must complete their assignments by themselves without any help.', 'Students must complete their assignments themselves.', 'Students have to complete their assignments themselves.'] },
        { q: 'Chính cô ấy đã thiết kế tấm áp phích.', hint: 'design, the poster, herself', answers: ['She designed the poster herself.', 'She herself designed the poster.'] },
        { q: 'Các bạn đi tiệc vui vẻ nhé!', hint: 'enjoy, yourselves, the party', answers: ['Enjoy yourselves at the party!', 'Enjoy yourselves at the party.'] },
      ],
    },

    { t: 'h', text: '5. Đại từ chỉ định: this, that, these, those' },
    {
      t: 'table',
      head: ['', 'Số ít', 'Số nhiều'],
      rows: [
        ['**Gần** người nói (ở đây, bây giờ)', 'this — cái này', 'these — những cái này'],
        ['**Xa** người nói (ở kia, lúc trước)', 'that — cái đó', 'those — những cái kia'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'This is my first IELTS class.', vi: 'Đây là lớp IELTS đầu tiên của tôi.' },
        { en: 'Is that your umbrella by the door?', vi: 'Cái ô cạnh cửa kia có phải của bạn không?' },
        { en: 'These are the best exercises for beginners.', vi: 'Đây là những bài tập tốt nhất cho người mới bắt đầu.' },
        { en: 'Those were difficult years for my family.', vi: 'Đó là những năm khó khăn của gia đình tôi.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo dùng trong bài viết (phần sách chưa có)',
      items: [
        'Trong bài luận, **this / these** dùng để chỉ lại điều **vừa nói ở câu trước**: *Many graduates cannot find jobs. **This** worries their parents.*',
        '**this + danh từ** rõ nghĩa hơn **this** đứng một mình: *…**This problem** worries their parents.* Giám khảo đánh giá cao vì người đọc biết ngay "this" là gì.',
        '**those who** = những người mà: ***Those who** read every day usually write better.* Rất hay dùng trong Task 2.',
        '**that of / those of** thay cho danh từ đã nhắc, rất hữu ích ở Task 1: *The population of Hanoi is larger than **that of** Da Nang.* (that = the population).',
        'Khớp số: ~~this problems~~ → **these problems**; ~~those idea~~ → **that idea**.',
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai với this / these',
      items: [
        'Động từ phải khớp: ~~These is my books.~~ → **These are my books.** ~~This are~~ → **This is**.',
        'Tiếng Việt nói "Đây là…" cho cả số ít lẫn số nhiều, nên hay viết ~~This is my shoes.~~ → **These are my shoes.**',
        'Nghe **this** /ðɪs/ và **these** /ðiːz/ rất giống nhau với tai người Việt: **these** kéo dài âm "i" và kết thúc bằng /z/.',
      ],
    },
    {
      t: 'rule',
      formula: 'this / that + N số ít + is    ·    these / those + N số nhiều + are',
      vi: 'Gần → this/these, xa → that/those. Trong bài viết, This/These (+ N) chỉ lại ý vừa nói ở câu trước.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-chi-dinh-dich',
      title: 'Dịch — this, that, these, those (4 câu)',
      kind: 'translate',
      grammar: 'this/that + N số ít · these/those + N số nhiều · This = "điều này" (chỉ lại ý câu trước) · that of = thay cho danh từ số ít đã nhắc.',
      items: [
        { q: 'Đây là lớp IELTS đầu tiên của tôi.', hint: 'this, my first, class', answers: ['This is my first IELTS class.', 'This is my first IELTS lesson.', 'This is my first IELTS course.'] },
        { q: 'Những cuốn sách kia là của thư viện.', hint: 'those books, belong to, the library', answers: ['Those books belong to the library.', "Those books are the library's.", 'Those books are from the library.'] },
        { q: 'Nhiều sinh viên không tìm được việc. Điều này làm cha mẹ họ lo lắng.', hint: 'cannot find jobs, this, worry, their parents', answers: ['Many students cannot find jobs. This worries their parents.', "Many students can't find jobs. This worries their parents.", 'Many students cannot find a job. This worries their parents.', "Many students can't find a job. This worries their parents.", 'Many students cannot find jobs. This makes their parents worried.', "Many students can't find jobs. This makes their parents worried.", 'Many graduates cannot find jobs. This worries their parents.'] },
        { q: 'Dân số Hà Nội lớn hơn dân số Đà Nẵng.', hint: 'the population of, larger than, that of', answers: ['The population of Hanoi is larger than that of Da Nang.', 'The population of Hanoi is bigger than that of Da Nang.', 'The population of Ha Noi is larger than that of Da Nang.', 'The population of Hanoi is larger than that of Danang.', 'The population of Hanoi is bigger than that of Danang.'] },
      ],
    },

    { t: 'h', text: '6. Đại từ nghi vấn: who, whom, whose, which, what' },
    {
      t: 'table',
      head: ['Từ', 'Hỏi về', 'Ví dụ'],
      rows: [
        ['**who**', 'người (làm chủ ngữ hoặc tân ngữ trong văn nói)', '**Who** wrote this report? — Ai đã viết báo cáo này?'],
        ['**whom**', 'người, làm tân ngữ — trang trọng, hay đi sau giới từ', 'To **whom** should I send my application? — Tôi nên gửi đơn cho ai?'],
        ['**whose**', 'của ai', '**Whose** phone is ringing? — Điện thoại của ai đang reo vậy?'],
        ['**which**', 'cái nào — chọn trong một nhóm có sẵn', '**Which** of these courses is free? — Khoá nào trong số này miễn phí?'],
        ['**what**', 'cái gì — hỏi chung, không giới hạn lựa chọn', '**What** did you learn today? — Hôm nay bạn học được gì?'],
      ],
    },
    {
      t: 'note',
      title: 'Dễ nhầm',
      items: [
        '**whose** (của ai) ≠ **who\'s** (= who is / who has): ***Whose** bag is this?* nhưng ***Who\'s** your teacher?*',
        '**which** hay **what**? Có sẵn vài lựa chọn → **which** (**Which colour, red or blue?**). Hỏi mở → **what** (**What colour is your car?**).',
        'Trong **câu hỏi gián tiếp** (câu hỏi nằm trong một câu khác), trật tự trở lại như câu thường: ~~I don\'t know what is the answer.~~ → **I don\'t know what the answer is.** Dạng này hay dùng ở mở bài Task 2.',
        'Khi **Who / What làm chủ ngữ** (hỏi "ai đã làm"), KHÔNG thêm do/did: ~~Who did write this report?~~ → **Who wrote this report?** Còn khi hỏi tân ngữ thì cần trợ động từ: **Who did you meet?**',
      ],
    },
    {
      t: 'rule',
      formula: 'Who / What + V…?  (hỏi chủ ngữ)    ·    Wh- + do / does / did + S + V?  (hỏi tân ngữ)',
      vi: 'who = ai, whom = ai (tân ngữ, trang trọng), whose + N = của ai, which = cái nào (có sẵn lựa chọn), what = cái gì.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-nghi-van-dich',
      title: 'Dịch — đặt câu hỏi với who, whose, which, what (5 câu)',
      kind: 'translate',
      grammar: 'Who/What làm chủ ngữ + V (không do/did) · Wh- + do/does/did + S + V? · Whose + N + is…? · Câu hỏi gián tiếp: I don\'t know + what + S + V.',
      items: [
        { q: 'Ai đã viết báo cáo này?', hint: 'who, write (wrote), this report', answers: ['Who wrote this report?', 'Who has written this report?', 'Who wrote the report?'] },
        { q: 'Cái cặp này là của ai?', hint: 'whose, bag', answers: ['Whose bag is this?', 'Whose is this bag?'] },
        { q: 'Bạn thích môn nào hơn, toán hay lý?', hint: 'which, prefer, maths, physics', answers: ['Which do you prefer, maths or physics?', 'Which subject do you prefer, maths or physics?', 'Which do you prefer, math or physics?', 'Which subject do you prefer, math or physics?'] },
        { q: 'Hôm nay bạn đã học được gì?', hint: 'what, learn, today', answers: ['What did you learn today?', 'What have you learnt today?', 'What have you learned today?'] },
        { q: 'Tôi không biết đáp án là gì.', hint: "I don't know, what, the answer", answers: ["I don't know what the answer is.", 'I do not know what the answer is.'] },
      ],
    },

    { t: 'h', text: '7. Đại từ quan hệ: nối hai câu bằng who, which, that' },
    {
      t: 'p',
      text: 'Đại từ quan hệ giúp **gộp hai câu ngắn thành một câu dài**, nói rõ danh từ đứng trước là ai, là cái gì. Câu dài và đúng ngữ pháp giúp tăng điểm tiêu chí **Grammatical Range and Accuracy** (độ đa dạng và chính xác của ngữ pháp).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'người + who / that + V',
          vi: 'who (hoặc that) thay cho NGƯỜI',
          examples: [
            { en: 'Students who sleep well remember more.', vi: 'Học sinh ngủ đủ giấc nhớ bài tốt hơn.' },
            { en: 'I met a teacher that works in Japan.', vi: 'Tôi gặp một giáo viên làm việc ở Nhật.' },
          ],
        },
        {
          formula: 'vật + which / that + V',
          vi: 'which (hoặc that) thay cho VẬT, sự việc',
          examples: [
            { en: 'This is the app which helped me learn vocabulary.', vi: 'Đây là ứng dụng đã giúp tôi học từ vựng.' },
            { en: 'The course that I chose starts next week.', vi: 'Khoá học tôi chọn bắt đầu tuần sau.' },
          ],
        },
        {
          formula: 'danh từ + whose + danh từ',
          vi: 'whose = của người/vật đó',
          examples: [
            { en: 'Children whose parents read to them often love books.', vi: 'Những đứa trẻ được bố mẹ đọc sách cho nghe thường mê sách.' },
          ],
        },
        {
          formula: 'người + whom + S + V',
          vi: 'whom = người làm tân ngữ (trang trọng)',
          examples: [
            { en: 'The woman whom we interviewed is a famous scientist.', vi: 'Người phụ nữ chúng tôi phỏng vấn là một nhà khoa học nổi tiếng.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng **which** cho người: ~~the teacher which taught me~~ → **the teacher who taught me**.',
        'Giữ lại đại từ cũ sau khi đã nối: ~~This is the book which I bought it yesterday.~~ → **This is the book which I bought yesterday.** (which đã thay cho "it").',
        'Không dùng **that** sau dấu phẩy: ~~Hanoi, that is the capital, …~~ → **Hanoi, which is the capital, …**',
        'Động từ sau who/which/that chia theo **danh từ đứng trước**: *a student who **studies*** nhưng *students who **study***.',
      ],
    },
    {
      t: 'rule',
      formula: 'người + who / that + V    ·    vật + which / that + V    ·    N + whose + N',
      vi: 'Nối hai câu ngắn thành một: đại từ quan hệ đứng ngay sau danh từ nó bổ nghĩa, và thay luôn cho đại từ cũ (không giữ lại "it/them").',
    },
    {
      t: 'quiz',
      id: 'd3-dt-quan-he-dich',
      title: 'Dịch — nối câu bằng who, which, whose (5 câu)',
      kind: 'translate',
      grammar: 'người + who/that + V · vật + which/that + V · N + whose + N · There are many people who + V… (câu mẫu Task 2).',
      items: [
        { q: 'Cô gái ngồi cạnh tôi nói được ba thứ tiếng.', hint: 'the girl, who, sit next to me, three languages', answers: ['The girl who sits next to me speaks three languages.', 'The girl that sits next to me speaks three languages.', 'The girl who sits next to me can speak three languages.', 'The girl that sits next to me can speak three languages.'] },
        { q: 'Đây là ứng dụng đã giúp tôi học từ vựng.', hint: 'the app, which, help, learn vocabulary', answers: ['This is the app which helped me learn vocabulary.', 'This is the app that helped me learn vocabulary.', 'This is the app which helped me to learn vocabulary.', 'This is the app that helped me to learn vocabulary.', 'This is the app which has helped me learn vocabulary.', 'This is the app that has helped me learn vocabulary.'] },
        { q: 'Có nhiều người quan tâm đến môi trường.', hint: 'there are, many people, who, be concerned about, the environment', answers: ['There are many people who are concerned about the environment.', 'There are many people that are concerned about the environment.', 'There are many people who care about the environment.', 'There are a lot of people who are concerned about the environment.'] },
        { q: 'Những đứa trẻ được bố mẹ đọc sách cho nghe thường yêu sách.', hint: 'children, whose, parents, read to them, often', answers: ['Children whose parents read to them often love books.', 'Children whose parents read to them usually love books.', 'Children whose parents read to them often like books.'] },
        { q: 'Sinh viên làm thêm thường có ít thời gian học hơn.', hint: 'students, who, work part-time, less time to study', answers: ['Students who work part-time often have less time to study.', 'Students who work part-time usually have less time to study.', 'Students that work part-time often have less time to study.', 'Students who work part time often have less time to study.', 'Students who work part-time often have less time for studying.'] },
      ],
    },

    { t: 'h', text: '8. "It" làm chủ ngữ giả và "one" chỉ người nói chung' },
    {
      t: 'p',
      text: 'Phần này sách chưa giảng nhưng **có trong bài tập về nhà**, nên bạn cần biết trước. Tiếng Anh bắt buộc câu có chủ ngữ. Khi chủ ngữ thật là một cụm dài (to + động từ…), ta đặt **It** ở đầu câu làm **chủ ngữ giả**, còn cụm dài đẩy ra sau.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'It + is + adj + to V',
          vi: '(Việc) làm gì đó thì như thế nào',
          examples: [
            { en: 'It is important to sleep before an exam.', vi: 'Ngủ đủ trước kỳ thi là điều quan trọng.' },
            { en: 'It is difficult to learn a language without practice.', vi: 'Học ngôn ngữ mà không luyện tập thì rất khó.' },
          ],
        },
        {
          formula: 'one + V (trang trọng)',
          vi: '"one" = người ta, bất kỳ ai — thay cho "you" trong văn viết',
          examples: [
            { en: 'One should always check the facts before sharing news.', vi: 'Người ta luôn nên kiểm tra sự thật trước khi chia sẻ tin tức.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '~~Is important to study hard.~~ → **It is important to study hard.** Không được bỏ "It" — lỗi này cực phổ biến vì tiếng Việt nói "Quan trọng là…".',
        'Sau "It is important" không dùng **one** hay **he/she** làm chủ ngữ giả: ~~One is important to…~~ → **It is important to…**',
        'Bài luận học thuật nên hạn chế **you**. Thay bằng **people, students, one, we** hoặc câu bị động.',
      ],
    },
    {
      t: 'rule',
      formula: 'It + is + adj (important / difficult / necessary…) + to V',
      vi: 'Chủ ngữ thật là cụm "to V" dài → đẩy ra sau, đặt It làm chủ ngữ giả ở đầu. "one + V" = người ta nói chung (văn viết trang trọng).',
    },
    {
      t: 'quiz',
      id: 'd3-dt-it-one-dich',
      title: 'Dịch — It làm chủ ngữ giả và "one" (4 câu)',
      kind: 'translate',
      grammar: 'It is + adj + to V (không được bỏ "It") · One should + V = người ta nên…',
      items: [
        { q: 'Ngủ đủ giấc trước kỳ thi là điều quan trọng.', hint: 'it, important, get enough sleep, before an exam', answers: ['It is important to get enough sleep before an exam.', "It's important to get enough sleep before an exam.", 'It is important to get enough sleep before the exam.', "It's important to get enough sleep before the exam.", 'It is important to sleep well before an exam.', "It's important to sleep well before an exam.", 'It is important to sleep enough before an exam.'] },
        { q: 'Học ngoại ngữ mà không luyện tập thì rất khó.', hint: 'it, difficult, learn a foreign language, without practice', answers: ['It is difficult to learn a foreign language without practice.', "It's difficult to learn a foreign language without practice.", 'It is very difficult to learn a foreign language without practice.', "It's very difficult to learn a foreign language without practice.", 'It is hard to learn a foreign language without practice.', "It's hard to learn a foreign language without practice.", 'It is difficult to learn a language without practice.'] },
        { q: 'Người ta nên kiểm tra thông tin trước khi chia sẻ.', hint: 'one, should, check, before sharing it', answers: ['One should check information before sharing it.', 'One should check the information before sharing it.', 'One should check information before sharing.', 'One should check the information before sharing.', 'One should always check information before sharing it.'] },
        { q: 'Học tiếng Anh mỗi ngày là cần thiết.', hint: 'it, necessary, every day', answers: ['It is necessary to learn English every day.', "It's necessary to learn English every day.", 'It is necessary to study English every day.', "It's necessary to study English every day."] },
      ],
    },

    { t: 'h', text: '9. Ứng dụng đại từ vào IELTS Writing Task 2' },
    {
      t: 'p',
      text: 'Lỗi lớn nhất của bài viết band thấp là **lặp lại một danh từ** hết câu này đến câu khác. Bảng dưới cho thấy cùng một ý, viết lại bằng đại từ thì gọn và "Tây" hơn hẳn. Hàng **đại từ nghi vấn** sách không có ví dụ — ở đây bổ sung thêm.',
    },
    {
      t: 'table',
      head: ['Loại đại từ', 'Trước (lặp từ)', 'Sau (dùng đại từ)'],
      rows: [
        ['Nhân xưng', 'Reading is useful because ~~reading~~ improves vocabulary. — Đọc sách có ích vì việc đọc giúp tăng vốn từ.', 'Reading is useful because **it** improves vocabulary.'],
        ['Nhân xưng (tân ngữ)', 'Teenagers need guidance, so schools should give ~~teenagers~~ career advice. — Thanh thiếu niên cần định hướng, nên trường học nên tư vấn nghề cho thanh thiếu niên.', 'Teenagers need guidance, so schools should give **them** career advice.'],
        ['Tính từ sở hữu', 'Parents should talk to children about ~~children\'s~~ goals. — Cha mẹ nên nói chuyện với con về mục tiêu của con.', 'Parents should talk to children about **their** goals.'],
        ['Sở hữu', 'My parents\' generation learnt by memorising facts, but ~~my generation~~ learns through projects. — Thế hệ bố mẹ tôi học bằng cách thuộc lòng, còn thế hệ của tôi học qua dự án.', 'My parents\' generation learnt by memorising facts, but **mine** learns through projects.'],
        ['Quan hệ', 'Some students work part-time. ~~These students~~ often have less time to study. — Một số sinh viên làm thêm. Những sinh viên này thường có ít thời gian học hơn.', 'Students **who** work part-time often have less time to study.'],
        ['Phản thân', 'Adults should learn to manage ~~their own money without help~~. — Người trưởng thành nên học cách tự quản lý tiền bạc.', 'Adults should learn to manage their money **by themselves**.'],
        ['Chỉ định', 'Many schools now use tablets in class. ~~The use of tablets in class~~ makes lessons more interactive. — Nhiều trường dùng máy tính bảng trong lớp. Việc đó làm bài học sinh động hơn.', 'Many schools now use tablets in class. **This** makes lessons more interactive.'],
        ['Nghi vấn (bổ sung)', 'People disagree about something. ~~The thing is~~ the best way to reduce youth unemployment. — Mọi người bất đồng về một điều. Điều đó là cách tốt nhất để giảm thất nghiệp ở người trẻ.', 'People disagree about **what** the best way to reduce youth unemployment is.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo làm bài',
      items: [
        'Mỗi đại từ phải chỉ **rõ ràng một** danh từ. Câu *Teachers and students should respect each other, but **they** must set rules* không rõ "they" là ai → viết **teachers** must set rules.',
        '**This + danh từ** (this trend, this problem, this approach) an toàn hơn **This** trơ trọi — người đọc không phải đoán.',
        'Khớp số ít/số nhiều: **education → it**, **students → they/them/their**. ~~Education… They~~ là lỗi mất điểm ngữ pháp.',
        'Sau "a student / every person" có thể dùng **they/their** (they số ít) — hiện đại và được chấp nhận, gọn hơn "he or she".',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận với ví dụ đại từ sở hữu trong sách',
      items: [
        'Sách minh hoạ hàng "Đại từ sở hữu" bằng một câu mở đầu bằng **Theirs is critical…** để thay cho "every person\'s responsibility". Câu này **chưa tự nhiên**: người đọc dễ hiểu "theirs" là "của những người KHÁC".',
        'Muốn tránh lặp "responsibility", viết **This responsibility is critical…** hoặc **Their responsibility is critical…** thì rõ hơn. Đại từ sở hữu (mine, theirs) hợp nhất khi **so sánh hai bên**, như ví dụ "mine" ở bảng trên.',
      ],
    },
    {
      t: 'rule',
      formula: 'N (câu trước)  →  it / they / them / their / this / who (câu sau)',
      vi: 'Viết Task 2: danh từ nhắc lần hai thì thay bằng đại từ — nhưng đại từ phải chỉ rõ MỘT danh từ và khớp số ít / số nhiều.',
    },
    {
      t: 'quiz',
      id: 'd3-dt-writing-dich',
      title: 'Dịch — viết câu Task 2 không lặp từ (4 câu)',
      kind: 'translate',
      grammar: 'education → it · teenagers/children → they, them, their · cả ý câu trước → This · người + who + V.',
      items: [
        { q: 'Giáo dục quan trọng vì nó giúp mỗi người phát triển các kỹ năng thiết yếu.', hint: 'education, important, it, individuals, develop, essential skills', answers: ['Education is important because it helps individuals develop essential skills.', 'Education is important because it helps individuals to develop essential skills.', 'Education is important because it helps people develop essential skills.', 'Education is important because it helps people to develop essential skills.'] },
        { q: 'Thanh thiếu niên cần định hướng, nên trường học nên tư vấn nghề nghiệp cho họ.', hint: 'teenagers, need guidance, so, give, them, career advice', answers: ['Teenagers need guidance, so schools should give them career advice.', 'Teenagers need guidance so schools should give them career advice.', 'Teenagers need guidance, so schools should provide them with career advice.', 'Teenagers need guidance so schools should provide them with career advice.'] },
        { q: 'Nhiều trường dùng máy tính bảng trong lớp. Điều này làm bài học sinh động hơn.', hint: 'tablets, in class, this, make, more interactive', answers: ['Many schools use tablets in class. This makes lessons more interactive.', 'Many schools now use tablets in class. This makes lessons more interactive.', 'Many schools use tablets in class. This makes the lessons more interactive.', 'Many schools use tablets in class. This makes lessons more lively.'] },
        { q: 'Cha mẹ nên nói chuyện với con cái về mục tiêu của chúng.', hint: 'parents, talk to, children, their goals', answers: ['Parents should talk to children about their goals.', 'Parents should talk to their children about their goals.', 'Parents should talk with their children about their goals.', 'Parents should talk with children about their goals.'] },
      ],
    },
    {
      t: 'quiz',
      id: 'd3-nhanh',
      title: 'Kiểm tra nhanh — điền đại từ đúng',
      kind: 'fill',
      items: [
        { q: 'My brother and ___ share a bedroom. (tôi)', answers: ['I'] },
        { q: 'Could you explain this lesson to ___ again? (chúng tôi)', answers: ['us'] },
        { q: 'This is my pen. Where is ___ ? (của bạn)', answers: ['yours'] },
        { q: 'Nobody helped the children. They painted the wall by ___ .', answers: ['themselves'] },
        { q: '___ laptop is on the desk? (của ai)', answers: ['whose'] },
        { q: 'The teacher ___ helped me most was Ms Hoa.', answers: ['who', 'that'] },
        { q: '___ is important to revise every day.', answers: ['it'] },
      ],
    },
    { t: "h", text: "Thêm: Phát âm /ð/ trong đại từ (this, that, they, them, their)" },
    {
      t: "note",
      title: "Âm /ð/ — tiếng Việt không có, nên phải tập riêng",
      items: [
        "Đặt **đầu lưỡi giữa hai hàm răng**, thổi hơi ra và để **cổ họng rung** (sờ tay lên cổ sẽ thấy rung).",
        "Đừng đọc thành **\"d\"** (~~dis~~, ~~dey~~) hay **\"z\"** (~~zis~~). Gặp rất nhiều trong đại từ: this, that, these, those, they, them, their.",
        "Cùng cách đặt lưỡi nhưng **không rung** là /θ/: think, three, thank.",
      ],
    },
    {
      t: "phatam",
      id: "d3-phat-am",
      title: "Luyện phát âm — âm /ð/ trong đại từ",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng dòng đó. Xanh là đúng, vàng là gần đúng, đỏ là cần sửa. Nhìn gương: phải thấy đầu lưỡi giữa hai hàm răng.",
      items: [
        { text: "this, that, these, those", ipa: "ðɪs ðæt ðiːz ðəʊz", vi: "/ð/ đầu từ" },
        { text: "they, them, their", ipa: "ðeɪ ðem ðeə", vi: "/ð/ đầu từ" },
        { text: "They love their teacher.", ipa: "ðeɪ lʌv ðeə tiːtʃə", vi: "they · their" },
        { text: "This book is mine, that one is yours.", ipa: "ðɪs bʊk ɪz maɪn ðæt wʌn ɪz jɔːz", vi: "this · that" },
        { text: "These are my friends. I study with them.", ipa: "ðiːz ə maɪ frendz aɪ stʌdi wɪð ðem", vi: "these · with · them" },
        { text: "She did it herself.", ipa: "ʃi dɪd ɪt hɜːself", vi: "đại từ phản thân" },
      ],
    },
  ],
};

const D3_VOCAB: Lesson = {
  id: 'd3-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng chủ đề Giáo dục & Xã hội',
  goal: 'Nắm 20 từ, 10 cụm động từ và 5 họ từ về giáo dục — chủ đề ra thường xuyên nhất ở Writing Task 2 và Speaking.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      items: [
        'Đủ như sách: **20 từ** chủ đề Giáo dục & Xã hội · **10 cụm động từ** về việc học · **5 họ từ** (educate, achieve, develop, influence, access).',
        'Học từ **cùng giới từ đi kèm**: access ==to== · participate ==in== · prepare ==for== · focus ==on== · encourage sb ==to V==.',
        '**knowledge, learning** là danh từ **không đếm được** — không thêm -s, không dùng "a".',
        'Dòng ➕ dưới mỗi từ là **cụm hay dùng trong IELTS** và họ từ — chép vào sổ cùng câu ví dụ.',
        'Cụm động từ tách được (hand in, pick up, carry out): với đại từ **bắt buộc tách** — **hand it in**.',
      ],
    },
    {
      t: 'p',
      text: 'Giáo dục (Education) là chủ đề **gặp nhiều nhất** trong IELTS. Bấm 🔊 để nghe. Mỗi từ: nghe → đọc to theo → che nghĩa tự nhớ lại → đặt một câu về việc học của chính bạn.',
    },
    { t: 'h', text: '1. 20 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'achievement', pos: 'n', ipa: '/əˈtʃiːvmənt/', vi: 'thành tích, thành tựu', ex: 'Passing the entrance exam was a huge achievement for her.', exVi: 'Đỗ kỳ thi đầu vào là một thành tích lớn của cô ấy.', more: 'Hay đi với: **academic** achievement · a **great / huge** achievement · họ từ: achieve (v) → achievable (adj, có thể đạt được)' },
        { w: 'access', pos: 'n', ipa: '/ˈækses/', vi: 'sự tiếp cận, quyền sử dụng', ex: 'Students in remote villages have limited access to the internet.', exVi: 'Học sinh ở làng xa có ít cơ hội tiếp cận internet.', more: '**have / gain access to** sth (danh từ + to) · động từ thì không "to": **access the internet** · adj: **accessible**' },
        { w: 'program', pos: 'n', ipa: '/ˈprəʊɡræm/', vi: 'chương trình (Anh-Anh viết programme)', ex: 'The university runs an exchange program with Korea.', exVi: 'Trường đại học có một chương trình trao đổi với Hàn Quốc.', more: '**run / offer / complete** a program(me) · an **exchange / training** programme · Anh-Anh: programme' },
        { w: 'opportunity', pos: 'n', ipa: '/ˌɒpəˈtjuːnəti/', vi: 'cơ hội', ex: 'Studying abroad gives young people the opportunity to become independent.', exVi: 'Du học cho người trẻ cơ hội trở nên tự lập.', more: '**have / get / give sb the opportunity to** V · **job / career** opportunities · **equal** opportunities (cơ hội bình đẳng)' },
        { w: 'support', pos: 'n, v', ipa: '/səˈpɔːt/', vi: 'sự hỗ trợ; hỗ trợ, ủng hộ', ex: 'My older sister supported me when I failed my first test.', exVi: 'Chị tôi đã động viên tôi khi tôi trượt bài kiểm tra đầu tiên.', more: 'động từ: **support sb** (không thêm for) · danh từ: **provide support for** sb · **financial / emotional** support' },
        { w: 'learning', pos: 'n', ipa: '/ˈlɜːnɪŋ/', vi: 'việc học, sự học tập', ex: 'Online learning suits people who work full-time.', exVi: 'Học trực tuyến hợp với người đi làm toàn thời gian.', more: '**online / lifelong** learning (học trực tuyến / học suốt đời) · không đếm được: ~~learnings~~' },
        { w: 'knowledgeable', pos: 'adj', ipa: '/ˈnɒlɪdʒəbl/', vi: 'hiểu biết, có kiến thức', ex: 'Our tour guide was very knowledgeable about local history.', exVi: 'Hướng dẫn viên của chúng tôi rất am hiểu lịch sử địa phương.', more: 'knowledgeable **about** sth · họ từ: knowledge (n) — đọc /ˈnɒl-/, chữ k câm' },
        { w: 'development', pos: 'n', ipa: '/dɪˈveləpmənt/', vi: 'sự phát triển', ex: 'Playing outside is good for a child\'s development.', exVi: 'Chơi ngoài trời tốt cho sự phát triển của trẻ.', more: '**child / personal / economic** development · **developed** countries (nước phát triển) ≠ **developing** countries' },
        { w: 'resource', pos: 'n', ipa: '/rɪˈzɔːs/', vi: 'tài nguyên, nguồn lực, tài liệu', ex: 'The website offers free resources for English teachers.', exVi: 'Trang web cung cấp tài liệu miễn phí cho giáo viên tiếng Anh.', more: '**learning / natural** resources · hay dùng **số nhiều** · **lack (of) resources** (thiếu nguồn lực)' },
        { w: 'improve', pos: 'v', ipa: '/ɪmˈpruːv/', vi: 'cải thiện, tiến bộ', ex: 'Watching films with subtitles improved my listening a lot.', exVi: 'Xem phim có phụ đề giúp khả năng nghe của tôi tiến bộ nhiều.', more: 'improve **skills / performance / quality** · danh từ: **improvement in** sth' },
        { w: 'challenge', pos: 'n', ipa: '/ˈtʃælɪndʒ/', vi: 'thách thức, thử thách', ex: 'Living away from home is a real challenge for first-year students.', exVi: 'Sống xa nhà là một thử thách thật sự với sinh viên năm nhất.', more: '**face / overcome / meet** a challenge · adj: **challenging** (đầy thử thách)' },
        { w: 'motivation', pos: 'n', ipa: '/ˌməʊtɪˈveɪʃn/', vi: 'động lực', ex: 'Clear goals give learners more motivation.', exVi: 'Mục tiêu rõ ràng cho người học nhiều động lực hơn.', more: '**lack of** motivation · motivation **to** V · động từ: motivate · adj: motivated (có động lực)' },
        { w: 'success', pos: 'n', ipa: '/səkˈses/', vi: 'sự thành công', ex: 'His success in the competition surprised everyone.', exVi: 'Thành công của cậu ấy trong cuộc thi làm mọi người bất ngờ.', more: '**achieve** success · **the key to** success · succeed **in** V-ing · adj: successful' },
        { w: 'participate', pos: 'v', ipa: '/pɑːˈtɪsɪpeɪt/', vi: 'tham gia (participate in)', ex: 'Over two hundred students participated in the charity run.', exVi: 'Hơn hai trăm sinh viên đã tham gia cuộc chạy từ thiện.', more: 'participate **in** sth = **take part in** · danh từ: participation · participate **actively** (tích cực)' },
        { w: 'skill', pos: 'n', ipa: '/skɪl/', vi: 'kỹ năng (hay dùng số nhiều: skills)', ex: 'Teamwork is a skill that employers value highly.', exVi: 'Làm việc nhóm là kỹ năng nhà tuyển dụng đánh giá rất cao.', more: '**communication / practical / teamwork** skills · **develop / improve** skills' },
        { w: 'focus', pos: 'n, v', ipa: '/ˈfəʊkəs/', vi: 'sự tập trung; tập trung (focus on)', ex: 'I keep my phone in another room so I don\'t lose focus.', exVi: 'Tôi để điện thoại ở phòng khác để không bị mất tập trung.', more: 'focus **on** sth · **lose / keep** focus · ~~focus in~~' },
        { w: 'prepare', pos: 'v', ipa: '/prɪˈpeə(r)/', vi: 'chuẩn bị (prepare for)', ex: 'We prepared for the debate by reading news articles.', exVi: 'Chúng tôi chuẩn bị cho buổi tranh biện bằng cách đọc báo.', more: 'prepare **for** an exam · prepare sb **for** sth · adj: **well-prepared** · n: preparation' },
        { w: 'evaluate', pos: 'v', ipa: '/ɪˈvæljueɪt/', vi: 'đánh giá', ex: 'The school evaluates each teacher at the end of the year.', exVi: 'Nhà trường đánh giá từng giáo viên vào cuối năm.', more: 'evaluate **progress / performance / results** · danh từ: evaluation' },
        { w: 'knowledge', pos: 'n', ipa: '/ˈnɒlɪdʒ/', vi: 'kiến thức, sự hiểu biết', ex: 'Her knowledge of computers helped the whole team.', exVi: 'Kiến thức máy tính của cô ấy đã giúp cả nhóm.', more: '**gain / broaden / share** knowledge · knowledge **of / about** sth · không đếm được' },
        { w: 'encourage', pos: 'v', ipa: '/ɪnˈkʌrɪdʒ/', vi: 'khuyến khích, động viên', ex: 'Good teachers encourage students to ask questions.', exVi: 'Giáo viên giỏi khuyến khích học sinh đặt câu hỏi.', more: 'encourage sb **to** V (~~encourage sb V-ing~~) · n: encouragement · adj: encouraging' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai (phần sách chưa có)',
      items: [
        '**knowledge** là danh từ **không đếm được**: ~~knowledges~~, ~~a knowledge~~ → **knowledge**, **a lot of knowledge**. **learning** và **access** cũng thường không đếm được.',
        'Nhớ giới từ đi kèm: **access to** sth · **participate in** sth · **prepare for** sth · **focus on** sth · **encourage** sb **to** V · **support** sb (động từ, không thêm "for").',
        '~~have access the internet~~ → **have access to the internet** (danh từ cần "to") — nhưng **access the internet** (động từ, không "to").',
        '**success** (danh từ) ≠ **successful** (tính từ) ≠ **succeed** (động từ): *She **succeeded**. She was **successful**. Her **success** was deserved.*',
        '**program** là cách viết Mỹ; Anh viết **programme** (nhưng **computer program** thì Anh cũng viết program). Trong IELTS viết kiểu nào cũng được, miễn **thống nhất cả bài**.',
      ],
    },
    { t: 'h', text: '2. Cụm động từ (phrasal verbs)' },
    {
      t: 'p',
      text: 'Nhắc lại: cụm động từ = động từ + một hoặc hai giới từ nhỏ, và nghĩa của cả cụm thường khác nghĩa từng chữ. 10 cụm dưới đây xoay quanh việc học — dùng khi nói (Speaking) thì rất tự nhiên.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'catch up', pos: 'phr v', ipa: '/kætʃ ʌp/', vi: 'đuổi kịp, bắt kịp (phần bị bỏ lỡ)', ex: 'After the holiday, I stayed late to catch up on my homework.', exVi: 'Sau kỳ nghỉ, tôi thức khuya để làm bù bài tập.', more: 'catch up **on** sth (bù phần bị lỡ) · catch up **with** sb (đuổi kịp ai)' },
        { w: 'drop out', pos: 'phr v', ipa: '/drɒp aʊt/', vi: 'bỏ học giữa chừng', ex: 'Some students drop out because they cannot pay the fees.', exVi: 'Một số sinh viên bỏ học vì không đóng nổi học phí.', more: 'drop out **of** school / university · danh từ: **a dropout** (người bỏ học)' },
        { w: 'look into', pos: 'phr v', ipa: '/lʊk ˈɪntuː/', vi: 'xem xét, tìm hiểu kỹ', ex: 'The committee will look into the cause of the exam leak.', exVi: 'Ban hội đồng sẽ điều tra nguyên nhân lộ đề.', more: '= investigate · look into **a problem / complaint / the cause** · không tách: look into it' },
        { w: 'pick up', pos: 'phr v', ipa: '/pɪk ʌp/', vi: 'học được (một cách tự nhiên), tiếp thu', ex: 'Kids pick up new words very quickly from cartoons.', exVi: 'Trẻ con học từ mới từ phim hoạt hình rất nhanh.', more: 'pick up **a language / a skill / a habit** · tách được: **pick it up**' },
        { w: 'go over', pos: 'phr v', ipa: '/ɡəʊ ˈəʊvə(r)/', vi: 'xem lại, rà soát kỹ', ex: 'Let\'s go over the main points before the test.', exVi: 'Mình xem lại các ý chính trước bài kiểm tra nhé.', more: 'go over **notes / answers / mistakes** · không tách với đại từ: go over it' },
        { w: 'keep up with', pos: 'phr v', ipa: '/kiːp ʌp wɪð/', vi: 'theo kịp, bắt nhịp với', ex: 'It is hard to keep up with a class that moves so fast.', exVi: 'Rất khó theo kịp một lớp học đi nhanh như vậy.', more: 'keep up with **the class / the news / the latest trends**' },
        { w: 'brush up on', pos: 'phr v', ipa: '/brʌʃ ʌp ɒn/', vi: 'ôn lại (kỹ năng đã học nhưng bị mai một)', ex: 'I need to brush up on my maths before the placement test.', exVi: 'Tôi cần ôn lại toán trước bài kiểm tra xếp lớp.', more: 'brush up on **grammar / your English / skills** · dùng cho thứ đã học nhưng bị quên' },
        { w: 'get ahead', pos: 'phr v', ipa: '/ɡet əˈhed/', vi: 'tiến lên, vượt lên trước, thành công', ex: 'Learning a second language can help you get ahead at work.', exVi: 'Học thêm một ngoại ngữ có thể giúp bạn tiến xa trong công việc.', more: 'get ahead **in** your career / studies · không có tân ngữ trực tiếp' },
        { w: 'hand in', pos: 'phr v', ipa: '/hænd ɪn/', vi: 'nộp (bài)', ex: 'Please hand in your reports before Friday.', exVi: 'Vui lòng nộp báo cáo trước thứ Sáu.', more: '= submit (trang trọng hơn) · hand in **homework / an essay** · với đại từ: **hand it in**' },
        { w: 'carry out', pos: 'phr v', ipa: '/ˈkæri aʊt/', vi: 'tiến hành, thực hiện', ex: 'The students carried out an experiment on plant growth.', exVi: 'Học sinh đã tiến hành một thí nghiệm về sự phát triển của cây.', more: 'carry out **research / a survey / an experiment / a plan** · bị động: was carried out' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ cụm động từ (phần sách chưa có)',
      items: [
        '**catch up** (bù lại cái đã bị bỏ lỡ, ví dụ sau khi ốm) khác **keep up with** (giữ nhịp, không để bị tụt lại). Catch up = đang ở phía sau, chạy theo; keep up = đang ngang hàng, cố giữ.',
        '**go over** (xem lại chi tiết một tài liệu) khác **brush up on** (ôn lại một kỹ năng đã bị quên). **Go over your essay** / **brush up on your French**.',
        'Một số cụm **tách ra được**: **hand in the essay** = **hand the essay in**; với đại từ thì **bắt buộc** tách: *hand **it** in* (~~hand in it~~). Tương tự: **pick it up**, **carry it out**.',
        '**look into** thì **không tách**: *look into **it*** (~~look it into~~).',
        '**drop out of** + nơi học: *drop out **of** university*.',
      ],
    },
    { t: 'h', text: '3. Họ từ (word formation)' },
    {
      t: 'p',
      text: 'Một gốc từ đổi đuôi thành danh từ, động từ, tính từ, trạng từ. Bảng dưới giữ đủ 5 gốc của sách và **điền thêm** những dạng sách bỏ trống.',
    },
    {
      t: 'table',
      head: ['Gốc', 'Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'],
      rows: [
        ['educate — giáo dục', 'education (người dạy: educator)', 'educate', 'educational (mang tính giáo dục) · educated (có học thức)', 'educationally'],
        ['achieve — đạt được', 'achievement', 'achieve', 'achievable (có thể đạt được) · achieved (đã đạt)', '—'],
        ['develop — phát triển', 'development', 'develop', 'developed (đã phát triển) · developing (đang phát triển)', 'developmentally'],
        ['influence — ảnh hưởng', 'influence', 'influence', 'influential', 'influentially'],
        ['access — tiếp cận, truy cập', 'access', 'access', 'accessible (dễ tiếp cận)', 'accessibly'],
      ],
    },
    {
      t: 'note',
      title: 'Dễ nhầm trong họ từ',
      items: [
        'Sách để trống trạng từ của **educate**; thực tế có **educationally** (**educationally useful games**).',
        'Sách chỉ ghi **achieved** làm tính từ. Tính từ hay dùng hơn là **achievable**: *Set **achievable** goals.* (đặt mục tiêu có thể đạt được).',
        '**educational** (có tính giáo dục: **an educational video**) ≠ **educated** (người có học: **an educated woman**).',
        '**developed countries** = nước phát triển; **developing countries** = nước đang phát triển. Hai cụm này ra rất nhiều ở Task 2.',
        '**influence** là danh từ và động từ, sau động từ **không có "on"**: ~~influence on children~~ (động từ) → **influence children**; nhưng danh từ thì **have an influence on** children.',
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ trọng âm trong họ từ (phần sách chưa có)',
      items: [
        'Đuôi **-tion / -ial / -ical** kéo trọng âm về **ngay trước đuôi**: ˈeducate /ˈedʒukeɪt/ → eduˈcation /ˌedʒuˈkeɪʃn/ · ˈinfluence /ˈɪnfluəns/ → influˈential /ˌɪnfluˈenʃl/.',
        '**develop** /dɪˈveləp/ → **development** /dɪˈveləpmənt/: đuôi **-ment** không đổi trọng âm. Tương tự **achieve** /əˈtʃiːv/ → **achievement** /əˈtʃiːvmənt/.',
        '**access** /ˈækses/ → **accessible** /əkˈsesəbl/: trọng âm chuyển sang âm thứ hai khi thêm **-ible**.',
      ],
    },
    { t: 'h', text: '4. Dùng trong IELTS: câu mẫu ăn điểm' },
    {
      t: 'examples',
      items: [
        { en: 'Equal access to education is the key to a fairer society.', vi: 'Tiếp cận giáo dục bình đẳng là chìa khoá cho một xã hội công bằng hơn.' },
        { en: 'Students who participate in group projects develop valuable teamwork skills.', vi: 'Học sinh tham gia dự án nhóm phát triển được kỹ năng làm việc nhóm quý giá.' },
        { en: 'Governments should provide more support for children from poor families.', vi: 'Chính phủ nên hỗ trợ nhiều hơn cho trẻ em từ các gia đình nghèo.' },
        { en: 'Without motivation, even talented learners may drop out.', vi: 'Không có động lực, ngay cả người học có năng khiếu cũng có thể bỏ học.' },
        { en: 'Teachers should evaluate progress regularly, not only through final exams.', vi: 'Giáo viên nên đánh giá sự tiến bộ thường xuyên, không chỉ qua kỳ thi cuối.' },
        { en: 'In my free time, I try to brush up on my English by watching the news.', vi: 'Lúc rảnh, tôi cố ôn lại tiếng Anh bằng cách xem tin tức. (Speaking)' },
      ],
    },
  ],
};

/* Kịch bản nghe tự viết (sách dùng Audio 3 có bản quyền). 8 đoạn, 22 chỗ trống. */
const D3_SCRIPT: string[] = [
  'Next time you eat an apple or a spoonful of honey, you should thank a bee. There are more than twenty thousand known species of bees, and they live on every continent except Antarctica. Most people picture the honeybee, but the majority of species actually live alone rather than in large colonies.',
  'A single honeybee colony can contain tens of thousands of workers, and all of them are female. Each worker has a clear job, from cleaning the hive to guarding the entrance. When a bee finds a good patch of flowers, it returns home and performs a special dance that tells the others which direction to fly.',
  'Bees are important because they carry pollen from one flower to another. This process, called pollination, allows plants to produce fruit and seeds. Around three quarters of the crops that humans grow for food benefit from animal pollinators, and bees do most of this work.',
  'Without bees, our supermarket shelves would look very different. Foods such as almonds, strawberries and coffee would become rare and much more expensive. In some regions, farmers already rent hives and move them from farm to farm, simply to make sure their harvest is successful.',
  'Unfortunately, bees are facing serious threats. Many wild meadows have been replaced by roads, houses and huge fields of a single crop, so bees lose their habitat. Some chemicals that farmers spray to kill pests can also harm bees, affecting their memory and their ability to find their way home.',
  'Disease is another problem. A tiny parasite called the varroa mite attacks honeybee colonies and spreads viruses between them. On top of this, a changing climate means that some flowers now open earlier in the year, before the bees that depend on them are active.',
  'The good news is that ordinary people can help. You can plant a variety of wildflowers in your garden or even in a window box. Try to avoid using pesticides, and leave a small corner of your garden a little bit wild.',
  'Scientists believe that small actions, repeated by millions of people, can make a real difference. After all, protecting bees is not only about saving insects. It is about protecting our own future.',
];

const D3_LISTENING: Lesson = {
  id: 'd3-nghe',
  kind: 'listening',
  title: 'Nghe chép chính tả 1 (Dictation)',
  goal: 'Hiểu nghe chép chính tả là gì, vì sao nó giúp tăng điểm Listening, và tự làm được một bài nghe điền 22 từ.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Dictation** (nghe chép chính tả) = nghe rồi **viết lại từng chữ** — luyện tai bắt được cả từ nhỏ, đuôi -s, -ed.',
        '**5 lợi ích** như sách: nghe chi tiết · vững từ vựng + ngữ pháp · quen tốc độ bản xứ · thêm vốn câu mẫu · luyện thẳng dạng điền từ của đề thi.',
        'Làm theo **5 bước**: nghe cả bài → nghe từng câu và điền → soát ngữ pháp → mở lời thoại chấm → đọc nhại theo (shadowing).',
        'Bài luyện: **22 chỗ trống**, mỗi chỗ ==một từ==. Sai chính tả hoặc thiếu **-s** = sai.',
      ],
    },
    { t: 'h', text: '1. Nghe chép chính tả (Dictation) là gì?' },
    {
      t: 'p',
      text: '**Dictation** (nghe chép chính tả) là cách luyện nghe bằng cách **nghe rồi viết lại** toàn bộ hoặc một phần bài nghe, từng chữ một. Nghe để "hiểu đại khái" thì dễ bỏ qua những từ nhỏ; nghe để **chép lại** thì buộc tai bạn bắt được mọi âm. Ngoài kỹ năng nghe, dictation còn rèn cả từ vựng, ngữ pháp, chính tả và cách ghi chép.',
    },
    { t: 'h', text: '2. Năm lý do nên luyện dictation' },
    {
      t: 'table',
      head: ['Lý do', 'Giải thích'],
      rows: [
        ['1. **Nghe được chi tiết**', 'Phải chép đúng từng chữ nên bạn phải để ý từng từ, từng âm, từng cụm. Đề IELTS có nhiều câu điền từ — sai một chữ cái cũng mất điểm, nên độ chính xác này rất cần.'],
        ['2. **Vững từ vựng và ngữ pháp**', 'Khi viết lại câu vừa nghe, bạn thấy từ mới nằm trong ngữ cảnh thật, thấy ngữ pháp được dùng thế nào, và nhớ luôn cách viết đúng của từ — ít lỗi chính tả, ít lỗi ngữ pháp hơn khi đi thi.'],
        ['3. **Quen tốc độ nói tự nhiên**', 'Người bản xứ nói nhanh và nối âm. Nghe chép nhiều lần giúp tai bạn quen tốc độ đó, phản xạ nhanh hơn trong phòng thi.'],
        ['4. **Mở rộng vốn từ và cấu trúc câu**', 'Mỗi bài nghe là một kho câu mẫu. Chép lại nhiều bài, bạn "nhặt" được cách diễn đạt để dùng lại khi nói và viết.'],
        ['5. **Chuẩn bị đúng dạng bài thi**', 'Các dạng điền từ (form, note, sentence, summary completion) chính là một kiểu dictation rút gọn. Luyện dictation là luyện trực tiếp cho những câu hỏi này.'],
      ],
    },
    { t: 'h', text: '3. Cách luyện một bài dictation (phần sách chưa có)' },
    {
      t: 'note',
      title: 'Cách học — 5 bước',
      items: [
        '**Bước 1 — Nghe cả bài một lần**, không viết, chỉ để nắm chủ đề và ý chính. Biết chủ đề thì đoán từ dễ hơn.',
        '**Bước 2 — Nghe từng câu và điền.** Gặp chỗ khó thì nghe lại câu đó (tối đa 3 lần), vẫn không nghe ra thì đoán theo nghĩa và ngữ pháp rồi đi tiếp.',
        '**Bước 3 — Soát lại ngữ pháp:** trước chỗ trống có "a/an" → danh từ số ít; có "the … of" → danh từ; sau "are/were" → có thể là tính từ hoặc V-ing. Danh từ số nhiều có **-s** không?',
        '**Bước 4 — Mở lời thoại (transcript) để chấm.** Ghi lỗi vào sổ theo 3 nhóm: **không biết từ** · **biết từ nhưng không nghe ra** · **nghe ra nhưng viết sai chính tả**.',
        '**Bước 5 — Nghe lại lần cuối và đọc nhại theo (shadowing)** — đọc to ngay sau giọng đọc, bắt chước cả ngữ điệu. Bước này sửa luôn cả phát âm của bạn.',
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai khi nghe chép',
      items: [
        '**Mất âm cuối**: tiếng Việt không bật âm cuối nên hay bỏ **-s, -ed, -t, -k**: ~~seed~~ thay vì **seeds**, ~~threat~~ thay vì **threats**. Trong IELTS, thiếu **-s** là sai cả câu.',
        '**Bỏ sót từ nhỏ**: a, the, of, to, and được đọc rất nhẹ (gọi là **weak forms** — dạng đọc yếu). Nghe câu như một chuỗi ý nghĩa, đừng chỉ bắt từ to.',
        '**Viết sai chính tả từ đã biết**: nghe ra **environment** nhưng viết ~~enviroment~~. Trong phòng thi, sai chính tả = sai.',
      ],
    },
    { t: 'h', text: '4. Luyện tập: nghe và điền 22 chỗ trống' },
    {
      t: 'p',
      text: 'Chủ đề bài nghe: **loài ong và vai trò của chúng với con người** — đề tài sinh thái (ecology) hay gặp ở Listening Section 4 và Reading. Bấm **Nghe** một lần để nắm ý, rồi điền **một từ** vào mỗi chỗ trống. Chưa chắc thì mở lời thoại để nghe lại từng câu — nhưng hãy cố điền hết trước khi xem.',
    },
    {
      t: 'listen',
      id: 'd3-nghe-bai',
      title: 'Bees and why we need them',
      dan: { so: 'Day 3, Recording 1', boiCanh: 'a short talk about bees and why they are so important to people.', cau: [1, 22] },
      note: 'Giọng Anh-Anh, khoảng 2 phút. Nghe cả bài trước, làm bài điền bên dưới, rồi mới mở lời thoại để soát.',
      lines: D3_SCRIPT.map((text) => ({ text, voice: 'uk-nu' as const })),
    },
    {
      t: 'quiz',
      id: 'd3-nghe-dien',
      title: 'Nghe và điền MỘT từ vào mỗi chỗ trống (22 câu)',
      kind: 'fill',
      items: [
        { q: 'Next time you eat an apple or a spoonful of honey, you should thank a (1) ___ .', answers: ['bee'] },
        { q: 'They live on every (2) ___ except Antarctica.', answers: ['continent'] },
        { q: 'The majority of species actually live (3) ___ rather than in large colonies.', answers: ['alone'] },
        { q: 'A single honeybee colony can contain tens of thousands of workers, and all of them are (4) ___ .', answers: ['female'] },
        { q: 'Each worker has a clear job, from cleaning the hive to guarding the (5) ___ .', answers: ['entrance'] },
        { q: 'It returns home and performs a special (6) ___ that tells the others which direction to fly.', answers: ['dance'] },
        { q: 'This process, called (7) ___ , allows plants to produce fruit…', answers: ['pollination'] },
        { q: '…allows plants to produce fruit and (8) ___ .', answers: ['seeds'] },
        { q: '…and bees do most of this (9) ___ .', answers: ['work'] },
        { q: 'Foods such as almonds, strawberries and coffee would become rare and much more (10) ___ .', answers: ['expensive'] },
        { q: '…simply to make sure their (11) ___ is successful.', answers: ['harvest'] },
        { q: 'Unfortunately, bees are facing serious (12) ___ .', answers: ['threats'] },
        { q: 'Many wild meadows have been replaced by roads, houses and huge fields of a single crop, so bees lose their (13) ___ .', answers: ['habitat'] },
        { q: '…affecting their memory and their ability to find their way (14) ___ .', answers: ['home'] },
        { q: 'A tiny parasite called the varroa mite attacks honeybee colonies and spreads (15) ___ between them.', answers: ['viruses'] },
        { q: 'On top of this, a changing (16) ___ means that some flowers now open earlier in the year…', answers: ['climate'] },
        { q: '…before the bees that depend on them are (17) ___ .', answers: ['active'] },
        { q: 'You can plant a variety of (18) ___ in your garden or even in a window box.', answers: ['wildflowers', 'wild flowers', 'wild-flowers'] },
        { q: 'Try to avoid using (19) ___ …', answers: ['pesticides'] },
        { q: '…and leave a small corner of your garden a little bit (20) ___ .', answers: ['wild'] },
        { q: 'Scientists believe that small actions, repeated by millions of people, can make a real (21) ___ .', answers: ['difference'] },
        { q: 'It is about protecting our own (22) ___ .', answers: ['future'] },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo soát đáp án',
      items: [
        'Câu (8) **seeds**, (12) **threats**, (15) **viruses**, (19) **pesticides** đều là **số nhiều** — nếu bạn viết thiếu -s, hãy nghe lại âm cuối /z/ hoặc /s/.',
        'Câu (7) **pollination** và (13) **habitat** là từ học thuật hay gặp trong bài sinh thái — chép vào sổ từ vựng.',
        'Câu (3) **alone** đứng sau động từ **live**: "live alone" = sống một mình (nhớ lại **by themselves** ở bài ngữ pháp — cùng nghĩa).',
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch',
      items: [
        '(1) Lần tới khi ăn một quả táo hay một thìa mật ong, bạn nên cảm ơn một chú ong. Có hơn hai mươi nghìn loài ong đã được biết đến, và chúng sống trên mọi châu lục trừ Nam Cực. Hầu hết mọi người nghĩ ngay đến ong mật, nhưng thật ra phần lớn các loài ong sống đơn độc chứ không sống thành đàn lớn.',
        '(2) Một đàn ong mật có thể có hàng chục nghìn ong thợ, và tất cả đều là ong cái. Mỗi ong thợ có một việc rõ ràng, từ dọn tổ đến canh cửa tổ. Khi một con ong tìm thấy một vạt hoa tốt, nó bay về tổ và thực hiện một điệu nhảy đặc biệt để báo cho những con khác biết phải bay theo hướng nào.',
        '(3) Ong quan trọng vì chúng mang phấn hoa từ bông hoa này sang bông hoa khác. Quá trình này, gọi là thụ phấn, giúp cây ra quả và hạt. Khoảng ba phần tư số cây trồng con người trồng để làm thức ăn được hưởng lợi từ động vật thụ phấn, và ong làm phần lớn công việc này.',
        '(4) Không có ong, các kệ hàng trong siêu thị sẽ trông rất khác. Những thực phẩm như hạnh nhân, dâu tây và cà phê sẽ trở nên hiếm và đắt hơn nhiều. Ở một số vùng, nông dân đã phải thuê tổ ong và chở chúng từ trang trại này sang trang trại khác, chỉ để bảo đảm mùa màng bội thu.',
        '(5) Đáng tiếc là loài ong đang đối mặt với những mối đe doạ nghiêm trọng. Nhiều đồng cỏ hoang đã bị thay bằng đường sá, nhà cửa và những cánh đồng khổng lồ chỉ trồng một loại cây, nên ong mất môi trường sống. Một số hoá chất nông dân phun để diệt sâu bệnh cũng có thể gây hại cho ong, làm ảnh hưởng trí nhớ và khả năng tìm đường về tổ của chúng.',
        '(6) Bệnh tật là một vấn đề khác. Một loài ký sinh nhỏ xíu tên là ve varroa tấn công các đàn ong mật và lây lan virus giữa các đàn. Thêm vào đó, khí hậu thay đổi khiến một số loài hoa nay nở sớm hơn trong năm, trước khi những con ong phụ thuộc vào chúng bắt đầu hoạt động.',
        '(7) Tin tốt là người bình thường cũng có thể giúp. Bạn có thể trồng nhiều loại hoa dại trong vườn, hoặc thậm chí trong một chậu hoa ở cửa sổ. Hãy cố tránh dùng thuốc trừ sâu, và để một góc nhỏ trong vườn mọc tự nhiên một chút.',
        '(8) Các nhà khoa học tin rằng những hành động nhỏ, được hàng triệu người lặp lại, có thể tạo nên khác biệt thật sự. Suy cho cùng, bảo vệ loài ong không chỉ là cứu côn trùng. Đó là bảo vệ tương lai của chính chúng ta.',
      ],
    },
  ],
};

const D3_HOMEWORK: Lesson = {
  id: 'd3-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 3',
  goal: 'Tự kiểm tra lại toàn bộ Ngày 3: 22 câu dịch dùng từ vựng giáo dục, 10 câu cụm động từ, 10 câu chọn đại từ — có đáp án và gia sư chấm.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      items: [
        'Ba phần như sách: **I. 22 câu dịch** (20 từ vựng + 2 cụm động từ) · **II. 10 câu chọn cụm động từ** · **III. 10 câu chọn đại từ**.',
        'Câu dịch: bấm 💡 để xem **từ cần dùng** và **cấu trúc**; nhớ giới từ đi kèm (access to, participate in, prepare for).',
        'Phần III: nhìn **chỗ đứng** (trước V → chủ ngữ, sau V → tân ngữ) và **số ít / số nhiều** trước khi chọn.',
      ],
    },
    {
      t: 'quiz',
      id: 'd3-dich',
      title: 'I. Dịch sang tiếng Anh — dùng từ gợi ý (22 câu)',
      kind: 'translate',
      grammar: 'Câu đơn S + V + O. Hiện tại đơn cho sự thật, thói quen (he supports, it requires); quá khứ đơn cho việc đã xong (completed); should / need to / want to + V nguyên mẫu; will + V cho việc sắp làm. Nhớ giới từ đi kèm: access to, participate in, prepare for, proud of, encourage sb to V.',
      items: [
        { q: 'Bố mẹ tôi tự hào về thành tích của tôi.', hint: 'achievement', answers: ['My parents are proud of my achievement.', 'My parents are proud of my achievements.', 'My parents were proud of my achievement.', 'My parents were proud of my achievements.'] },
        { q: 'Mọi trẻ em nên được tiếp cận giáo dục.', hint: 'access', answers: ['Every child should have access to education.', 'All children should have access to education.', 'Every child should be able to access education.', 'All children should be able to access education.'] },
        { q: 'Chị tôi đã hoàn thành một chương trình đào tạo giáo viên.', hint: 'program', answers: ['My sister completed a teacher training program.', 'My sister completed a teacher training programme.', 'My sister has completed a teacher training program.', 'My sister has completed a teacher training programme.', 'My sister finished a teacher training program.', 'My sister finished a teacher training programme.', 'My older sister completed a teacher training program.'] },
        { q: 'Học bổng này là một cơ hội lớn cho tôi.', hint: 'opportunity', answers: ['This scholarship is a great opportunity for me.', 'This scholarship is a big opportunity for me.', 'This scholarship is a huge opportunity for me.'] },
        { q: 'Giáo viên luôn hỗ trợ học sinh yếu.', hint: 'support', answers: ['The teacher always supports weak students.', 'Teachers always support weak students.', 'The teacher always supports weaker students.', 'Teachers always support weaker students.', 'Teachers always support struggling students.', 'The teacher always supports struggling students.'] },
        { q: 'Cô ấy thích học ngôn ngữ mới.', hint: 'learning', answers: ['She enjoys learning new languages.', 'She likes learning new languages.', 'She loves learning new languages.'] },
        { q: 'Ông tôi rất hiểu biết về lịch sử.', hint: 'knowledgeable', answers: ['My grandfather is very knowledgeable about history.', 'My grandpa is very knowledgeable about history.', 'My grandad is very knowledgeable about history.', 'My granddad is very knowledgeable about history.'] },
        { q: 'Chính phủ đầu tư vào sự phát triển của vùng nông thôn.', hint: 'development', answers: ['The government invests in the development of rural areas.', 'The government invested in the development of rural areas.', 'The government invests in the development of the countryside.', 'The government invests in rural development.'] },
        { q: 'Thư viện có nhiều tài liệu miễn phí cho sinh viên.', hint: 'resource', answers: ['The library has many free resources for students.', 'The library has a lot of free resources for students.', 'The library has lots of free resources for students.'] },
        { q: 'Tôi muốn cải thiện kỹ năng nói của mình.', hint: 'improve', answers: ['I want to improve my speaking skills.', 'I want to improve my speaking skill.', 'I want to improve my speaking.', 'I would like to improve my speaking skills.'] },
        { q: 'Học một ngôn ngữ mới là một thử thách lớn.', hint: 'challenge', answers: ['Learning a new language is a big challenge.', 'Learning a new language is a great challenge.', 'Learning a new language is a huge challenge.'] },
        { q: 'Điểm cao không phải là động lực duy nhất của tôi.', hint: 'motivation', answers: ['High marks are not my only motivation.', "High marks aren't my only motivation.", 'Good grades are not my only motivation.', "Good grades aren't my only motivation.", 'High scores are not my only motivation.', 'High grades are not my only motivation.', 'Good marks are not my only motivation.'] },
        { q: 'Thành công cần thời gian và sự kiên nhẫn.', hint: 'success', answers: ['Success needs time and patience.', 'Success requires time and patience.', 'Success takes time and patience.'] },
        { q: 'Tất cả học sinh nên tham gia hoạt động ngoại khoá.', hint: 'participate', answers: ['All students should participate in extracurricular activities.', 'Every student should participate in extracurricular activities.', 'All students should participate in extra-curricular activities.', 'All students should participate in after-school activities.'] },
        { q: 'Công việc này đòi hỏi kỹ năng giao tiếp tốt.', hint: 'skill', answers: ['This job requires good communication skills.', 'This job needs good communication skills.', 'This job requires good communicative skills.'] },
        { q: 'Nhạc to làm tôi mất tập trung.', hint: 'focus', answers: ['Loud music makes me lose focus.', 'Loud music makes me lose my focus.'] },
        { q: 'Chúng tôi đang chuẩn bị cho buổi thuyết trình.', hint: 'prepare', answers: ['We are preparing for the presentation.', "We're preparing for the presentation.", 'We are preparing for our presentation.', "We're preparing for our presentation."] },
        { q: 'Giáo viên đánh giá bài luận của chúng tôi mỗi tuần.', hint: 'evaluate', answers: ['The teacher evaluates our essays every week.', 'Our teacher evaluates our essays every week.', 'The teacher evaluates our essay every week.', 'Teachers evaluate our essays every week.'] },
        { q: 'Đi du lịch mở rộng kiến thức của chúng ta.', hint: 'knowledge', answers: ['Travelling broadens our knowledge.', 'Traveling broadens our knowledge.', 'Travel broadens our knowledge.', 'Travelling expands our knowledge.', 'Traveling expands our knowledge.', 'Travelling widens our knowledge.', 'Travel expands our knowledge.'] },
        { q: 'Thầy tôi khuyến khích tôi đọc sách mỗi ngày.', hint: 'encourage', answers: ['My teacher encourages me to read books every day.', 'My teacher encourages me to read every day.', 'My teacher encouraged me to read books every day.', 'My teacher encouraged me to read every day.'] },
        { q: 'Tôi cần ôn lại ngữ pháp trước kỳ thi IELTS.', hint: 'brush up on', answers: ['I need to brush up on my grammar before the IELTS exam.', 'I need to brush up on grammar before the IELTS exam.', 'I need to brush up on my grammar before the IELTS test.', 'I need to brush up on grammar before the IELTS test.'] },
        { q: 'Nhớ nộp bài luận trước thứ Sáu nhé.', hint: 'hand in', answers: ['Remember to hand in your essay before Friday.', 'Remember to hand in your essay by Friday.', 'Remember to hand your essay in before Friday.', 'Remember to hand your essay in by Friday.', "Don't forget to hand in your essay before Friday.", "Don't forget to hand in your essay by Friday."] },
      ],
    },
    {
      t: 'mcq',
      id: 'd3-cum-dong-tu',
      title: 'II. Chọn cụm động từ đúng (10 câu)',
      items: [
        { q: 'I was ill for a whole week, so now I have a lot of lessons to ___ on.', options: ['catch up', 'drop out', 'look into'], correct: 0, why: 'Bị ốm nghỉ học thì phải **bù lại / đuổi kịp** bài (catch up on).' },
        { q: 'Because his family needed money, he had to ___ of school at fifteen.', options: ['go over', 'pick up', 'drop out'], correct: 2, why: 'Nghỉ học giữa chừng vì hoàn cảnh = **drop out (of school)**.' },
        { q: 'The principal promised to ___ the students\' complaints about the canteen.', options: ['catch up', 'look into', 'keep up with'], correct: 1, why: 'Hứa sẽ **xem xét, tìm hiểu** các khiếu nại = look into.' },
        { q: 'All essays must be ___ before 5 p.m. on Friday.', options: ['handed in', 'brushed up on', 'carried out'], correct: 0, why: 'Bài luận phải được **nộp** = handed in (dạng bị động).' },
        { q: 'The class moves so fast that I can hardly ___ the other students.', options: ['get ahead', 'keep up with', 'drop out'], correct: 1, why: 'Lớp đi quá nhanh nên khó **theo kịp** các bạn = keep up with.' },
        { q: 'My Spanish is rusty. I should ___ it before my trip to Madrid.', options: ['brush up on', 'pick up', 'carry out'], correct: 0, why: 'Tiếng đã học nhưng bị "gỉ" (rusty) thì cần **ôn lại** = brush up on.' },
        { q: 'Young children ___ new languages much faster than adults do.', options: ['go over', 'catch up', 'pick up'], correct: 2, why: 'Trẻ nhỏ **học được một cách tự nhiên** = pick up.' },
        { q: 'Employees who keep learning new skills often ___ in their careers.', options: ['hand in', 'get ahead', 'keep up with'], correct: 1, why: '**Tiến xa, vượt lên** trong sự nghiệp = get ahead. (keep up with cần tân ngữ phía sau.)' },
        { q: 'The students ___ a survey to find out how much sleep teenagers get.', options: ['looked into', 'picked up', 'carried out'], correct: 2, why: '**Tiến hành** một cuộc khảo sát = carry out a survey (cụm cố định, dùng cả cho experiment, research).' },
        { q: "Let's ___ your answers together before you submit the test.", options: ['hand in', 'go over', 'drop out'], correct: 1, why: '**Xem lại, rà soát** đáp án trước khi nộp = go over.' },
      ],
    },
    {
      t: 'mcq',
      id: 'd3-dai-tu',
      title: 'III. Chọn đại từ phù hợp (10 câu)',
      items: [
        { q: '___ is necessary for young people to learn how to manage money.', options: ['He', 'She', 'It'], correct: 2, why: '**It** làm chủ ngữ giả: **It is necessary to…** — chủ ngữ thật là cụm "to learn…" ở sau.' },
        { q: 'Many teenagers say that ___ feel stressed before exams.', options: ['they', 'them'], correct: 0, why: 'Chỗ trống đứng trước động từ **feel** → cần đại từ **chủ ngữ** they.' },
        { q: 'Teachers play a vital role in society, so we should respect ___ .', options: ['they', 'them', 'their'], correct: 1, why: 'Đứng sau động từ **respect** → đại từ **tân ngữ** them.' },
        { q: 'When living abroad, ___ must learn to adapt to a new culture.', options: ['one', 'it'], correct: 0, why: '**one** = người ta nói chung, làm chủ ngữ thật của **must learn**. "it" không thể "học".' },
        { q: 'The city opened three new libraries last year. ___ libraries are always full at weekends.', options: ['These', 'Those', 'This'], correct: 0, why: 'Chỉ lại điều **vừa nhắc** ở câu trước, danh từ số nhiều → **These** libraries. (This đi với số ít.)' },
        { q: 'Every university has ___ own admission rules.', options: ["it's", 'its', 'their'], correct: 1, why: '"của nó" + danh từ → tính từ sở hữu **its**. **it\'s** = it is. "Every university" là số ít nên không dùng their.' },
        { q: 'Online learning has grown rapidly since 2020. ___ has changed the way students study.', options: ['This', 'These', 'Those'], correct: 0, why: '**This** chỉ lại cả ý của câu trước (việc học trực tuyến phát triển nhanh) — số ít.' },
        { q: 'Lan and Minh passed the exam easily because ___ had studied every evening.', options: ['he', 'she', 'they'], correct: 2, why: 'Hai người (Lan **and** Minh) → số nhiều → **they**.' },
        { q: 'The number of students in 2020 was higher than ___ in 2010.', options: ['that', 'those', 'it'], correct: 0, why: '**that** thay cho "the number" (số ít) để khỏi lặp lại — mẫu **that of / that in** rất hay dùng ở Writing Task 1.' },
        { q: 'Parents who read to ___ children every night help them build a love of books.', options: ['their', 'they', 'them'], correct: 0, why: '"con **của họ**" + danh từ children → tính từ sở hữu **their**.' },
      ],
    },
  ],
};

export const NGAY_3: Lesson[] = [D3_GRAMMAR, D3_VOCAB, D3_LISTENING, D3_HOMEWORK];
