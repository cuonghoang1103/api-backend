/**
 * Ngày 9 — Hiện tại tiếp diễn & Quá khứ đơn · Từ vựng Tình nguyện (Volunteering)
 * · Listening Part 2 (độc thoại bối cảnh xã hội: MCQ + Map Labelling) · Bài tập.
 *
 * Nội dung TỰ SOẠN cho khoá (không theo ảnh sách): lời giảng, câu ví dụ, kịch bản
 * nghe, bản đồ và câu bài tập đều viết mới. Bài ngữ pháp so sánh liên tục với
 * hiện tại đơn (Ngày 1) và có sơ đồ trục thời gian cho từng thì. Phát âm: ba
 * cách đọc đuôi -ed (/t/ /d/ /ɪd/). Bài nghe nối chủ đề tình nguyện: buổi giới
 * thiệu cho tình nguyện viên mới ở một nông trại cộng đồng (câu 11–20) + một
 * thông báo dọn bãi biển (6 câu).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const D9_GRAMMAR: Lesson = {
  id: 'd9-ngu-phap',
  kind: 'grammar',
  title: 'Hiện tại tiếp diễn & Quá khứ đơn (Present Continuous & Past Simple)',
  goal: 'Chia đúng và chọn đúng giữa hiện tại đơn, hiện tại tiếp diễn và quá khứ đơn (kể cả động từ bất quy tắc, đuôi -ed đọc đúng), rồi dùng chúng khi kể chuyện ở Speaking và tả xu hướng / số liệu quá khứ ở Writing.',
  minutes: 70,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này học gì',
      items: [
        '**Hiện tại tiếp diễn** = **am / is / are + V-ing**: việc ==đang xảy ra lúc nói==, việc **tạm thời** quanh giai đoạn này, và **xu hướng đang thay đổi** (More people **are working** from home).',
        '**Động từ trạng thái** (know, like, want, need, believe…) **không** chia tiếp diễn: ~~I am knowing~~ → **I know**.',
        '**Quá khứ đơn** = **V2 / V-ed** (khẳng định) · **did not + V nguyên mẫu** (phủ định) · **Did + S + V?** (câu hỏi): việc ==đã xong ở một thời điểm xác định trong quá khứ==.',
        '**was / were** là quá khứ của be. Học thuộc **bảng động từ bất quy tắc** theo nhóm (go → went, buy → bought, send → sent…).',
        'Đuôi **-ed** có **3 cách đọc**: /ɪd/ (wanted), /t/ (helped), /d/ (played) — đọc sai là giám khảo nghe nhầm thì.',
        'Mỗi mục có **sơ đồ trục thời gian**, **Công thức 1 dòng** và **bài dịch 💡** — làm hết là dùng được ngay trong Speaking Part 1–2 và Writing Task 1–2.',
      ],
    },
    {
      t: 'p',
      text: 'Ở Ngày 1 bạn đã học **hiện tại đơn** (present simple): dùng cho **thói quen** và **sự thật** (I **work** in a bank. Water **boils** at 100 degrees.). Hôm nay học thêm hai thì: một thì nói về việc **đang diễn ra**, một thì nói về việc **đã xảy ra xong rồi**. Tiếng Việt chỉ cần thêm "đang", "đã", "hôm qua" là đủ, động từ không đổi. Tiếng Anh thì **động từ phải đổi hình dạng** — quên đổi là sai ngữ pháp, dù người nghe vẫn đoán được ý. Đây là loại lỗi giám khảo IELTS bắt nhiều nhất ở người Việt.',
    },
    {
      t: 'sodo',
      kind: 'timeline',
      title: 'Ba thì của hôm nay trên một trục thời gian',
      caption: 'Hiện tại đơn: lặp lại suốt (thói quen, sự thật). Hiện tại tiếp diễn: một đoạn ngắn quanh **bây giờ**. Quá khứ đơn: một điểm **đã kết thúc** bên trái "bây giờ".',
      marks: [
        { from: -10, to: 10, kieu: 'lap', label: '**Hiện tại đơn** — I **volunteer** every Sunday.', mau: 1 },
        { from: -1, to: 1, kieu: 'doan', label: '**Hiện tại tiếp diễn** — I **am writing** an email now.', mau: 2 },
        { from: -5, kieu: 'diem', label: '**Quá khứ đơn** — I **volunteered** at a shelter last year.', mau: 3 },
      ],
    },

    { t: 'h', text: '1. Hiện tại tiếp diễn — cấu tạo và 3 dạng câu' },
    {
      t: 'p',
      text: '**Hiện tại tiếp diễn** (present continuous, còn gọi là present progressive) gồm **hai phần**: trợ động từ **be** chia ở hiện tại (**am / is / are**) + động từ thêm **-ing** (V-ing). Thiếu một trong hai phần là sai: ~~I working~~ (thiếu am), ~~I am work~~ (thiếu -ing).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + am / is / are + V-ing',
          vi: 'Khẳng định. I → am · he / she / it / danh từ số ít → is · you / we / they / danh từ số nhiều → are.',
          examples: [
            { en: 'I am answering a message from my team leader.', vi: 'Tôi đang trả lời tin nhắn của trưởng nhóm.' },
            { en: 'The volunteers are planting trees along the river.', vi: 'Các tình nguyện viên đang trồng cây dọc bờ sông.' },
          ],
        },
        {
          formula: 'S + am / is / are + not + V-ing',
          vi: 'Phủ định. Viết tắt: I\'m not · he isn\'t · they aren\'t.',
          examples: [
            { en: 'She is not working today; she is at home with her son.', vi: 'Hôm nay cô ấy không làm việc; cô ấy ở nhà với con trai.' },
            { en: "We aren't using the meeting room at the moment.", vi: 'Lúc này chúng tôi không dùng phòng họp.' },
          ],
        },
        {
          formula: 'Am / Is / Are + S + V-ing? · Wh- + am / is / are + S + V-ing?',
          vi: 'Câu hỏi: đảo am / is / are lên trước chủ ngữ. Trả lời ngắn: Yes, I am. / No, she isn\'t.',
          examples: [
            { en: 'Are you studying for the IELTS exam this month?', vi: 'Tháng này bạn có đang ôn thi IELTS không?' },
            { en: 'What are they doing in the garden?', vi: 'Họ đang làm gì trong vườn vậy?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Quy tắc thêm -ing (chính tả)',
      head: ['Động từ tận cùng bằng', 'Cách thêm -ing', 'Ví dụ'],
      rows: [
        ['Phần lớn động từ', 'thêm **-ing**', 'work → working · read → reading · play → playing'],
        ['**-e** câm (không đọc)', 'bỏ **e**, thêm -ing', 'make → making · write → writing · donate → donating'],
        ['**-ee**', 'giữ nguyên, thêm -ing', 'see → seeing · agree → agreeing'],
        ['**-ie**', 'đổi **ie → y**, thêm -ing', 'lie → lying · die → dying · tie → tying'],
        ['**một nguyên âm + một phụ âm**, âm tiết cuối được nhấn', '**gấp đôi** phụ âm cuối', 'run → running · sit → sitting · stop → stopping · begin → beginning'],
        ['**-l** sau một nguyên âm (Anh-Anh)', 'gấp đôi **l** (Anh) · giữ một l (Mỹ)', 'travel → travelling (Anh) / traveling (Mỹ)'],
        ['âm tiết cuối **không** được nhấn', 'không gấp đôi', 'visit → visiting · listen → listening · open → opening'],
        ['**-w, -x, -y**', 'không gấp đôi', 'snow → snowing · fix → fixing · stay → staying'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**Thiếu be**: ~~I working from home today.~~ → **I am working** from home today. Tiếng Việt nói "tôi đang làm" — chữ "đang" không có từ riêng trong tiếng Anh, nó nằm ở **am + -ing**.',
        '**Thiếu -ing**: ~~She is cook dinner.~~ → She is **cooking** dinner.',
        '**Nhầm be**: ~~They is helping.~~ / ~~The children is playing.~~ → They **are** helping. The children **are** playing (children là số nhiều).',
        'Chính tả: ~~writting~~, ~~makeing~~, ~~studing~~, ~~lieing~~ → **writing, making, studying, lying**. (study giữ y: study**ing**.)',
      ],
    },

    { t: 'h', text: '2. Hiện tại tiếp diễn dùng khi nào?' },
    {
      t: 'p',
      text: 'Có **bốn** cách dùng. Hai cách đầu ai cũng biết; cách thứ ba (xu hướng đang thay đổi) mới là cách **ăn điểm nhất trong IELTS Writing Task 2**, vì đề Task 2 hay mở đầu bằng một xu hướng của xã hội hiện nay.',
    },
    {
      t: 'table',
      head: ['Cách dùng', 'Giải thích', 'Ví dụ'],
      rows: [
        ['① Đang xảy ra **ngay lúc nói**', 'Việc bắt đầu trước lúc nói một chút và chưa xong.', '**Listen!** Someone **is knocking** at the door. — Nghe kìa! Có người đang gõ cửa.'],
        ['② **Tạm thời**, quanh giai đoạn hiện nay', 'Không nhất thiết đang làm đúng giây này, nhưng đang diễn ra **trong tuần này / tháng này / dạo này**, và sẽ kết thúc.', 'I **am staying** with my aunt **this month** because my flat is being repaired. — Tháng này tôi ở nhờ nhà dì.'],
        ['③ **Xu hướng đang thay đổi**', 'Một quá trình **đang tăng / giảm / thay đổi** trong xã hội. Hay đi với **more and more, increasingly, these days, nowadays**.', '**More and more** young people **are volunteering** in their free time. — Ngày càng nhiều bạn trẻ làm tình nguyện lúc rảnh.'],
        ['④ **Kế hoạch đã sắp xếp** cho tương lai gần (nâng cao)', 'Đã hẹn, đã đặt, đã sắp xếp xong. Luôn có **thời gian tương lai** trong câu.', 'I **am meeting** the volunteer coordinator **tomorrow morning**. — Sáng mai tôi gặp người điều phối tình nguyện viên (đã hẹn).'],
      ],
    },
    {
      t: 'sodo',
      kind: 'timeline',
      title: 'Bốn cách dùng hiện tại tiếp diễn',
      caption: 'Cả bốn đều có chung một ý: việc **chưa xong**, hoặc **đang trên đường** diễn ra. Cách ④ là một điểm phía **tương lai** đã được sắp xếp sẵn.',
      marks: [
        { from: -0.6, to: 0.6, kieu: 'doan', label: '① **is knocking** — ngay lúc này', mau: 1 },
        { from: -4, to: 4, kieu: 'doan', label: '② **am staying** with my aunt this month — tạm thời', mau: 2 },
        { from: -8, to: 3, kieu: 'doan', label: '③ more people **are volunteering** — xu hướng đang tăng', mau: 3 },
        { from: 3, kieu: 'diem', label: '④ **am meeting** her tomorrow — đã hẹn', mau: 1 },
      ],
    },
    {
      t: 'table',
      caption: 'Dấu hiệu nhận biết hiện tại tiếp diễn',
      head: ['Dấu hiệu', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['now · right now · at the moment', 'bây giờ, ngay lúc này', 'She is talking to a client **at the moment**.'],
        ['currently · at present', 'hiện thời (trang trọng — hợp Writing)', 'The charity is **currently** looking for drivers.'],
        ['these days · nowadays · this week / month / year', 'dạo này, tuần / tháng / năm này', 'I am reading a lot of English news **these days**.'],
        ['Look! · Listen! · Be quiet!', 'câu mệnh lệnh gọi chú ý', '**Look!** The children are feeding the goats.'],
        ['more and more · increasingly · is growing / rising', 'ngày càng (xu hướng)', 'Online shopping **is becoming increasingly** popular.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo: câu xu hướng cho Writing Task 2 (nâng cao)',
      items: [
        'Câu mở bài Task 2 hay tả một xu hướng: **"Nowadays, more and more people are + V-ing…"** → Nowadays, more and more employees **are working** remotely.',
        'Thay **more and more** bằng cụm trang trọng: **a growing number of** + danh từ số nhiều (đã học Ngày 5) + **are + V-ing**: A growing number of students **are taking** gap years.',
        'Động từ chỉ thay đổi rất hợp với thì này: **is rising, is falling, is growing, is becoming, is changing, is improving, is getting worse**.',
        'Cách ② dùng rất nhiều trong Speaking Part 1: "At the moment **I\'m studying** for the IELTS exam, so I\'m quite busy."',
      ],
    },
    {
      t: 'rule',
      formula: 'S + am / is / are (+ not) + V-ing · Am / Is / Are + S + V-ing?',
      vi: 'Đang xảy ra lúc nói · tạm thời quanh hiện tại · xu hướng đang thay đổi · kế hoạch đã hẹn (có mốc tương lai).',
    },
    {
      t: 'quiz',
      id: 'd9-htd-dich',
      title: 'Dịch nhanh — hiện tại tiếp diễn (5 câu)',
      kind: 'translate',
      grammar: 'S + am / is / are + V-ing. Phủ định: am / is / are + not + V-ing. Câu hỏi: Am / Is / Are + S + V-ing? Xu hướng: More and more + N số nhiều + are + V-ing.',
      items: [
        { q: 'Tôi đang nấu bữa tối.', hint: 'am cooking, dinner', answers: ['I am cooking dinner.', "I'm cooking dinner.", 'I am making dinner.', "I'm making dinner."] },
        { q: 'Tháng này chị tôi đang làm việc ở nhà.', hint: 'my sister (số ít → is), is working, from home / at home, this month', answers: ['My sister is working from home this month.', "My sister's working from home this month.", 'My sister is working at home this month.', 'This month my sister is working from home.', 'This month, my sister is working from home.', 'This month my sister is working at home.', 'This month, my sister is working at home.', 'My older sister is working from home this month.'] },
        { q: 'Bạn đang làm gì vậy?', hint: 'What, are you doing', answers: ['What are you doing?', 'What are you doing now?', 'What are you doing right now?'] },
        { q: 'Họ không dùng máy tính lúc này.', hint: "aren't using / are not using, the computer, at the moment", answers: ["They aren't using the computer at the moment.", 'They are not using the computer at the moment.', "They're not using the computer at the moment.", "They aren't using the computer now.", 'They are not using the computer now.', "They're not using the computer now.", "They aren't using the computer right now.", 'They are not using the computer right now.', "They're not using the computer right now."] },
        { q: 'Ngày càng nhiều người trẻ đang làm tình nguyện.', hint: 'More and more / A growing number of, young people, are volunteering', answers: ['More and more young people are volunteering.', 'A growing number of young people are volunteering.', 'An increasing number of young people are volunteering.', 'More and more young people are doing volunteer work.', 'More and more young people are doing voluntary work.', 'A growing number of young people are doing volunteer work.'] },
      ],
    },

    { t: 'h', text: '3. Động từ trạng thái — không chia tiếp diễn' },
    {
      t: 'p',
      text: '**Động từ trạng thái** (stative verbs) nói về **suy nghĩ, cảm xúc, sở hữu, giác quan** — những thứ "là như vậy" chứ không phải một **hành động** đang diễn ra. Chúng **không** dùng ở dạng -ing, kể cả khi trong câu có "now" hay "at the moment". Tiếng Việt nói "tôi **đang** cần tiền" rất tự nhiên, nhưng tiếng Anh là ~~I am needing money~~ → **I need money (now)**.',
    },
    {
      t: 'table',
      caption: 'Các nhóm động từ trạng thái hay gặp',
      head: ['Nhóm', 'Động từ', 'Ví dụ đúng'],
      rows: [
        ['Suy nghĩ, hiểu biết', 'know, understand, believe, remember, forget, mean, realise, suppose, agree', 'I **understand** the problem now. (~~am understanding~~)'],
        ['Thích / ghét / muốn', 'like, love, hate, prefer, want, need, wish', 'She **wants** to help at the shelter. (~~is wanting~~)'],
        ['Sở hữu', 'have (= có), own, belong to, possess', 'This bike **belongs** to the charity. (~~is belonging~~)'],
        ['Giác quan, vẻ ngoài', 'see, hear, smell, taste, seem, look (= trông có vẻ), sound', 'You **seem** tired today. · That **sounds** great!'],
        ['Khác', 'cost, weigh, contain, depend, matter, consist of', 'The ticket **costs** ten dollars. · It **depends** on the weather.'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ "hai nghĩa": nghĩa hành động thì được dùng -ing',
      head: ['Động từ', 'Nghĩa trạng thái (không -ing)', 'Nghĩa hành động (được -ing)'],
      rows: [
        ['**think**', 'nghĩ rằng (= ý kiến): I **think** volunteering is useful.', 'đang suy nghĩ, cân nhắc: I **am thinking** about joining a charity.'],
        ['**have**', 'có (sở hữu): She **has** two brothers.', 'ăn, uống, trải qua: We **are having** lunch. · They **are having** a great time.'],
        ['**see**', 'nhìn thấy, hiểu: I **see** what you mean.', 'hẹn gặp, đang hẹn hò: I **am seeing** the doctor at 3.'],
        ['**taste / smell**', 'có vị / có mùi: This soup **tastes** salty.', 'nếm / ngửi: The chef **is tasting** the soup.'],
        ['**look**', 'trông có vẻ: You **look** happy.', 'nhìn, tìm: I **am looking** for my keys.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '~~I am knowing the answer.~~ → **I know** the answer. · ~~I am liking this job.~~ → **I like** this job.',
        '**"I\'m loving it"** là câu quảng cáo, cố ý phá luật cho gây chú ý — đừng dùng trong bài thi.',
        '**I am thinking…** chỉ đúng khi nghĩa là **đang cân nhắc**: I\'m thinking **of / about** taking a gap year. Nêu quan điểm thì luôn là **I think (that)…**.',
        'Mẹo kiểm tra: thử thêm "đang **làm**" vào câu tiếng Việt. "Đang biết", "đang cần", "đang thích" nghe gượng → động từ trạng thái → không -ing.',
      ],
    },
    {
      t: 'rule',
      formula: 'know / like / want / need / believe / understand / belong / seem + V(s/es) — không bao giờ + -ing',
      vi: 'Động từ chỉ trạng thái (nghĩ, thích, có, giác quan) dùng hiện tại đơn kể cả khi nói "bây giờ". think / have / see có thêm nghĩa hành động thì mới được -ing.',
    },
    {
      t: 'quiz',
      id: 'd9-trang-thai-dich',
      title: 'Dịch nhanh — động từ trạng thái (4 câu)',
      kind: 'translate',
      grammar: 'Động từ trạng thái (need, know, believe, have = có) chia hiện tại đơn, không -ing. think (cân nhắc) / have (ăn) mang nghĩa hành động thì dùng am / is / are + V-ing.',
      items: [
        { q: 'Bây giờ tôi cần sự giúp đỡ của bạn.', hint: 'need (không -ing), your help, now', answers: ['I need your help now.', 'Now I need your help.', 'I need your help right now.', 'I need your help at the moment.'] },
        { q: 'Cô ấy biết tất cả các tình nguyện viên.', hint: 'knows (không -ing), all the volunteers', answers: ['She knows all the volunteers.', 'She knows all of the volunteers.', 'She knows every volunteer.'] },
        { q: 'Tôi đang cân nhắc tham gia một tổ chức từ thiện.', hint: 'am thinking about / of (cân nhắc → -ing), joining, a charity', answers: ['I am thinking about joining a charity.', "I'm thinking about joining a charity.", 'I am thinking of joining a charity.', "I'm thinking of joining a charity.", 'I am thinking about joining a charity organisation.', "I'm thinking about joining a charity organization."] },
        { q: 'Chúng tôi đang ăn trưa, tôi gọi lại sau nhé.', hint: "are having lunch (have = ăn → -ing), I'll call you back later", answers: ["We are having lunch, so I'll call you back later.", "We're having lunch, so I'll call you back later.", "We are having lunch. I'll call you back later.", "We're having lunch. I'll call you back later.", "We are having lunch, I'll call you back later.", "We're having lunch, I'll call you back later.", 'We are having lunch. I will call you back later.', "We're having lunch. I will call you back later.", "We are having lunch so I'll call you back later.", "We're having lunch so I'll call you back later."] },
      ],
    },

    { t: 'h', text: '4. Hiện tại đơn hay hiện tại tiếp diễn?' },
    {
      t: 'p',
      text: 'Hai thì này đều là "hiện tại", nên người mới rất hay lẫn. Câu hỏi để chọn: việc này là **thói quen / sự thật lâu dài** (→ hiện tại đơn) hay là **đang diễn ra / tạm thời / đang thay đổi** (→ hiện tại tiếp diễn)?',
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Hiện tại đơn vs Hiện tại tiếp diễn',
      cols: [
        {
          title: '**Hiện tại đơn** — S + V(s/es)',
          anh: 'spiral-calendar',
          items: [
            'Thói quen, lặp lại: **I volunteer every Saturday.**',
            'Sự thật lâu dài: **She works in a hospital.**',
            'Sự thật khoa học: **The sun rises in the east.**',
            'Lịch trình cố định: **The bus leaves at 7.**',
            'Dấu hiệu: **always, usually, often, every day, on Mondays**',
          ],
        },
        {
          title: '**Hiện tại tiếp diễn** — S + am/is/are + V-ing',
          anh: 'hourglass-not-done',
          items: [
            'Đang xảy ra lúc nói: **I am volunteering right now.**',
            'Tạm thời: **She is working from home this week.**',
            'Xu hướng: **The climate is getting warmer.**',
            'Kế hoạch đã hẹn: **We are leaving at 7 tomorrow.**',
            'Dấu hiệu: **now, at the moment, currently, this week, these days**',
          ],
        },
      ],
      caption: 'Lâu dài, lặp lại → hiện tại đơn. Ngắn hạn, đang diễn ra, đang đổi → hiện tại tiếp diễn.',
    },
    {
      t: 'table',
      caption: 'Cặp câu đặt cạnh nhau',
      head: ['Hiện tại đơn (lâu dài, thói quen)', 'Hiện tại tiếp diễn (bây giờ, tạm thời)'],
      rows: [
        ['I **work** in a bank. — Tôi làm ở ngân hàng (công việc lâu dài).', 'I **am working** from home this week. — Tuần này tôi làm ở nhà (tạm thời).'],
        ['He **usually takes** the bus to school.', 'He **is cycling** today because the buses are on strike.'],
        ['My mum **cooks** dinner every evening.', 'My dad **is cooking** dinner tonight because mum is ill.'],
        ['Volunteers **help** the farm every weekend.', 'Look! The volunteers **are feeding** the chickens.'],
        ['What **do** you **do**? — Bạn làm nghề gì?', 'What **are** you **doing**? — Bạn đang làm gì đấy?'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**What do you do?** hỏi **nghề nghiệp** (hiện tại đơn) ≠ **What are you doing?** hỏi việc **đang làm**. Giám khảo Part 1 hỏi "What do you do?" mà trả lời "I am studying English now" là trả lời lệch câu hỏi; câu đúng: "I\'m a student. I study accounting at…"',
        '**always / usually / often / every day** + **hiện tại đơn**: ~~I am usually getting up at six.~~ → **I usually get up at six.**',
        'Ngoại lệ (nâng cao): **always + hiện tại tiếp diễn** dùng để **than phiền** về thói quen gây khó chịu: My brother **is always borrowing** my phone without asking!',
        'Kể sở thích chung chung dùng hiện tại đơn: ~~I am liking reading.~~ / ~~I am reading books in my free time.~~ → **I read books in my free time.**',
      ],
    },
    {
      t: 'rule',
      formula: 'Thói quen / sự thật: S + V(s/es) · Bây giờ / tạm thời / xu hướng: S + am / is / are + V-ing',
      vi: 'What do you do? = làm nghề gì · What are you doing? = đang làm gì.',
    },
    {
      t: 'quiz',
      id: 'd9-so-sanh-dich',
      title: 'Dịch nhanh — hiện tại đơn hay tiếp diễn? (5 câu)',
      kind: 'translate',
      grammar: 'Thói quen / nghề nghiệp / sự thật → S + V(s/es). Đang xảy ra / tạm thời (this week, today, now) → S + am / is / are + V-ing.',
      items: [
        { q: 'Anh trai tôi làm việc ở một bệnh viện.', hint: 'My brother (số ít → works), in a hospital / at a hospital', answers: ['My brother works in a hospital.', 'My brother works at a hospital.', 'My older brother works in a hospital.', 'My older brother works at a hospital.', 'My elder brother works in a hospital.'] },
        { q: 'Tuần này anh ấy đang làm ca đêm.', hint: 'is working, night shifts / the night shift, this week', answers: ['He is working night shifts this week.', "He's working night shifts this week.", 'He is working the night shift this week.', "He's working the night shift this week.", 'This week he is working night shifts.', 'This week, he is working night shifts.', 'This week he is working the night shift.', 'This week, he is working the night shift.', 'He is working on the night shift this week.'] },
        { q: 'Tôi thường đi học bằng xe buýt, nhưng hôm nay tôi đang đi bộ.', hint: 'usually go / take the bus, but today, am walking', answers: ['I usually go to school by bus, but today I am walking.', "I usually go to school by bus, but today I'm walking.", 'I usually take the bus to school, but today I am walking.', "I usually take the bus to school, but today I'm walking.", 'I usually go to school by bus but today I am walking.', "I usually go to school by bus but today I'm walking.", 'I usually take the bus to school but today I am walking.', "I usually take the bus to school but today I'm walking."] },
        { q: 'Bạn làm nghề gì?', hint: 'What, do you do (nghề nghiệp → hiện tại đơn)', answers: ['What do you do?', 'What do you do for a living?', "What's your job?", 'What is your job?'] },
        { q: 'Nhìn kìa! Lũ trẻ đang cho dê ăn.', hint: 'Look!, the children (số nhiều → are), are feeding, the goats', answers: ['Look! The children are feeding the goats.', 'Look, the children are feeding the goats.', 'Look! The kids are feeding the goats.', 'Look, the kids are feeding the goats.'] },
      ],
    },

    { t: 'h', text: '5. Quá khứ đơn với động từ be: was / were' },
    {
      t: 'p',
      text: '**Quá khứ đơn** (past simple) nói về việc **đã xảy ra và đã kết thúc** ở một thời điểm trong quá khứ. Bắt đầu với động từ **be**: hiện tại có am / is / are, quá khứ chỉ còn **hai** dạng: **was** và **were**.',
    },
    {
      t: 'table',
      head: ['Chủ ngữ', 'Hiện tại', 'Quá khứ', 'Ví dụ'],
      rows: [
        ['I', 'am', '**was**', 'I **was** at the farm yesterday.'],
        ['he / she / it / danh từ số ít', 'is', '**was**', 'The weather **was** perfect last Sunday.'],
        ['you / we / they / danh từ số nhiều', 'are', '**were**', 'The volunteers **were** very friendly.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + was / were + N / adj / nơi chốn',
          vi: 'Khẳng định',
          examples: [
            { en: 'My first day as a volunteer was exhausting but fun.', vi: 'Ngày đầu làm tình nguyện viên của tôi mệt nhưng vui.' },
            { en: 'There were more than fifty people at the clean-up.', vi: 'Có hơn năm mươi người ở buổi dọn dẹp.' },
          ],
        },
        {
          formula: "S + was not (wasn't) / were not (weren't) + …",
          vi: 'Phủ định',
          examples: [
            { en: "The food bank wasn't open on Monday.", vi: 'Ngân hàng thực phẩm không mở cửa hôm thứ Hai.' },
            { en: "We weren't tired at all.", vi: 'Chúng tôi chẳng mệt chút nào.' },
          ],
        },
        {
          formula: 'Was / Were + S + …? · Wh- + was / were + S …?',
          vi: 'Câu hỏi. Trả lời ngắn: Yes, it was. / No, they weren\'t.',
          examples: [
            { en: 'Were you nervous before the interview?', vi: 'Trước buổi phỏng vấn bạn có lo không?' },
            { en: 'Where were you last night?', vi: 'Tối qua bạn ở đâu?' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**was + động từ nguyên mẫu** là sai: ~~I was go to the market.~~ → **I went** to the market. "was" chỉ đi với danh từ, tính từ, nơi chốn (hoặc V-ing / V3 — học sau).',
        '~~They was happy.~~ → They **were** happy. · ~~You was right.~~ → You **were** right (you luôn đi với were).',
        '**There was** + danh từ số ít / không đếm được · **There were** + danh từ số nhiều: There **was** a lot of rubbish. There **were** many bottles.',
        '**be born** luôn ở quá khứ khi kể ngày sinh: ~~I born in 2005.~~ / ~~I am born in 2005.~~ → **I was born in 2005.**',
      ],
    },
    {
      t: 'rule',
      formula: 'I / he / she / it + was · you / we / they + were · Was / Were + S …?',
      vi: 'was / were + danh từ, tính từ, nơi chốn — không đi với động từ nguyên mẫu (~~was go~~).',
    },
    {
      t: 'quiz',
      id: 'd9-was-were-dich',
      title: 'Dịch nhanh — was / were (4 câu)',
      kind: 'translate',
      grammar: 'I / he / she / it / danh từ số ít + was; you / we / they / danh từ số nhiều + were. Câu hỏi: Was / Were + S …? There was / There were.',
      items: [
        { q: 'Tôi sinh năm 2006.', hint: 'was born, in 2006', answers: ['I was born in 2006.'] },
        { q: 'Các tình nguyện viên rất thân thiện.', hint: 'The volunteers (số nhiều → were), very friendly', answers: ['The volunteers were very friendly.', 'The volunteers were really friendly.', 'The volunteers were so friendly.'] },
        { q: 'Hôm qua bạn có ở nhà không?', hint: 'Were you, at home, yesterday', answers: ['Were you at home yesterday?', 'Were you home yesterday?', 'Yesterday, were you at home?'] },
        { q: 'Có rất nhiều rác trên bãi biển.', hint: 'There was (rubbish không đếm được), a lot of rubbish, on the beach', answers: ['There was a lot of rubbish on the beach.', 'There was lots of rubbish on the beach.', 'There was a lot of trash on the beach.', 'There was a lot of litter on the beach.', 'There was so much rubbish on the beach.', 'There was a lot of garbage on the beach.'] },
      ],
    },

    { t: 'h', text: '6. Quá khứ đơn với động từ thường — có quy tắc' },
    {
      t: 'p',
      text: 'Với động từ thường, câu khẳng định dùng **dạng quá khứ** (V2). Động từ **có quy tắc** chỉ cần thêm **-ed**: help → help**ed**, visit → visit**ed**. Câu **phủ định** và **câu hỏi** dùng trợ động từ **did** — và khi đã có did thì động từ chính **trở về nguyên mẫu**.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + V-ed / V2',
          vi: 'Khẳng định — mọi ngôi giống nhau (không có -s ngôi thứ ba).',
          examples: [
            { en: 'We cleaned the whole beach in three hours.', vi: 'Chúng tôi dọn cả bãi biển trong ba tiếng.' },
            { en: 'She donated her old books to a village school last year.', vi: 'Năm ngoái cô ấy tặng sách cũ cho một trường làng.' },
          ],
        },
        {
          formula: "S + did not (didn't) + V (nguyên mẫu)",
          vi: 'Phủ định — did đã mang nghĩa quá khứ, động từ chính KHÔNG chia nữa.',
          examples: [
            { en: "I didn't watch the match last night.", vi: 'Tối qua tôi không xem trận đấu.' },
            { en: "The charity didn't raise enough money.", vi: 'Tổ chức từ thiện không quyên đủ tiền.' },
          ],
        },
        {
          formula: 'Did + S + V (nguyên mẫu)? · Wh- + did + S + V?',
          vi: 'Câu hỏi. Trả lời ngắn: Yes, I did. / No, I didn\'t.',
          examples: [
            { en: 'Did you enjoy the volunteering trip?', vi: 'Bạn có thích chuyến đi tình nguyện không?' },
            { en: 'How long did you stay in the village?', vi: 'Bạn ở lại làng bao lâu?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Quy tắc thêm -ed (chính tả)',
      head: ['Động từ tận cùng bằng', 'Cách thêm -ed', 'Ví dụ'],
      rows: [
        ['Phần lớn động từ', 'thêm **-ed**', 'work → worked · help → helped · clean → cleaned'],
        ['**-e**', 'chỉ thêm **-d**', 'live → lived · donate → donated · arrive → arrived'],
        ['**phụ âm + y**', 'đổi **y → i**, thêm -ed', 'study → studied · carry → carried · try → tried'],
        ['**nguyên âm + y**', 'giữ y, thêm -ed', 'play → played · stay → stayed · enjoy → enjoyed'],
        ['**một nguyên âm + một phụ âm**, âm tiết cuối được nhấn', '**gấp đôi** phụ âm cuối', 'stop → stopped · plan → planned · prefer → preferred'],
        ['âm tiết cuối **không** nhấn', 'không gấp đôi', 'visit → visited · open → opened · offer → offered'],
        ['**-l** sau một nguyên âm (Anh-Anh)', 'gấp đôi l (Anh) · một l (Mỹ)', 'travel → travelled (Anh) / traveled (Mỹ)'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**did + V2** là sai hai lần: ~~I didn\'t went.~~ ~~Did you saw it?~~ → I didn\'t **go**. Did you **see** it? Nhớ: **did đã "gánh" quá khứ**, động từ chính về nguyên mẫu.',
        'Quên quá khứ khi đã có mốc thời gian: ~~Yesterday I go to the farm.~~ → Yesterday I **went** to the farm. Tiếng Việt có "hôm qua" là đủ; tiếng Anh vẫn phải đổi động từ.',
        'Thêm -s ở quá khứ: ~~She helpeds~~ / ~~He wents~~ → quá khứ đơn **không có -s** cho ngôi thứ ba.',
        'Chính tả: ~~studyed~~, ~~stoped~~, ~~planed~~ (planed = bào gỗ!) → **studied, stopped, planned**.',
      ],
    },
    {
      t: 'rule',
      formula: "S + V-ed / V2 · S + didn't + V · Did + S + V? · Wh- + did + S + V?",
      vi: 'Có did thì động từ chính về nguyên mẫu (didn\'t go, Did you see…?).',
    },
    {
      t: 'quiz',
      id: 'd9-qkd-dich',
      title: 'Dịch nhanh — quá khứ đơn động từ có quy tắc (5 câu)',
      kind: 'translate',
      grammar: "Khẳng định: S + V-ed. Phủ định: S + didn't + V nguyên mẫu. Câu hỏi: Did + S + V nguyên mẫu? / Wh- + did + S + V?",
      items: [
        { q: 'Hôm qua chúng tôi đã dọn công viên.', hint: 'cleaned, the park, yesterday', answers: ['We cleaned the park yesterday.', 'Yesterday we cleaned the park.', 'Yesterday, we cleaned the park.', 'We cleaned up the park yesterday.', 'Yesterday we cleaned up the park.', 'Yesterday, we cleaned up the park.'] },
        { q: 'Cô ấy đã học tiếng Anh ở Úc năm 2022.', hint: 'studied (y → ied), English, in Australia, in 2022', answers: ['She studied English in Australia in 2022.', 'In 2022 she studied English in Australia.', 'In 2022, she studied English in Australia.'] },
        { q: 'Tôi không xem phim tối qua.', hint: "didn't watch (nguyên mẫu), the film / the movie, last night", answers: ["I didn't watch the film last night.", 'I did not watch the film last night.', "I didn't watch the movie last night.", 'I did not watch the movie last night.', "I didn't watch a film last night.", "I didn't watch a movie last night.", "Last night I didn't watch the film.", "Last night, I didn't watch the film."] },
        { q: 'Bạn có thích bữa tiệc không?', hint: 'Did you enjoy (nguyên mẫu), the party', answers: ['Did you enjoy the party?', 'Did you like the party?'] },
        { q: 'Họ đã ở lại trong làng bao lâu?', hint: 'How long, did they stay, in the village', answers: ['How long did they stay in the village?', 'How long did they stay at the village?'] },
      ],
    },

    { t: 'h', text: '7. Động từ bất quy tắc — học theo nhóm' },
    {
      t: 'p',
      text: 'Khoảng 150 động từ **không** thêm -ed mà có dạng quá khứ riêng — gọi là **động từ bất quy tắc** (irregular verbs). Tin tốt: những động từ hay dùng nhất gần như đều nằm trong bảng dưới, và chúng đi theo **nhóm biến đổi giống nhau**. Học theo nhóm nhớ nhanh hơn học theo thứ tự chữ cái rất nhiều. Bấm 🔊 đọc to cả cặp **V1 → V2** ba lần.',
    },
    {
      t: 'table',
      caption: 'Nhóm 1 — V2 giống hệt V1 (chỉ đổi nghĩa thời gian)',
      head: ['V1 → V2', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['cut → cut', 'cắt', 'I **cut** my finger yesterday.'],
        ['put → put', 'đặt, để', 'She **put** the boxes in the van.'],
        ['let → let', 'để cho', 'My parents **let** me travel alone last summer.'],
        ['cost → cost', 'tốn (tiền)', 'The trip **cost** two million dong.'],
        ['hit → hit', 'đánh, va', 'A storm **hit** the coast in October.'],
        ['set → set', 'đặt, thiết lập', 'We **set** a goal of 500 trees.'],
        ['read → read', 'đọc (V2 đọc là /red/, viết giống V1)', 'I **read** an article about charity work.'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 — đổi nguyên âm ở giữa',
      head: ['V1 → V2', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['begin → began', 'bắt đầu', 'The clean-up **began** at 7 a.m.'],
        ['drink → drank', 'uống', 'We **drank** a lot of water.'],
        ['swim → swam', 'bơi', 'The kids **swam** in the lake.'],
        ['sing → sang', 'hát', 'The children **sang** for the elderly residents.'],
        ['sit → sat', 'ngồi', 'I **sat** next to a retired teacher.'],
        ['come → came', 'đến', 'Fifty volunteers **came** on Saturday.'],
        ['become → became', 'trở thành', 'She **became** a team leader after a year.'],
        ['give → gave', 'cho, tặng', 'They **gave** us free lunch.'],
        ['get → got', 'nhận, có được', 'I **got** a certificate at the end.'],
        ['win → won', 'thắng, giành', 'Our project **won** a prize.'],
        ['run → ran', 'chạy; điều hành', 'My aunt **ran** a small café for ten years.'],
        ['find → found', 'tìm thấy', 'We **found** a lost dog in the park.'],
        ['grow → grew', 'lớn lên; trồng', 'I **grew** up in a small town.'],
        ['know → knew', 'biết', 'I **knew** nobody on the first day.'],
        ['write → wrote', 'viết', 'He **wrote** a thank-you letter.'],
        ['ride → rode', 'đi (xe), cưỡi', 'We **rode** our bikes to the village.'],
        ['drive → drove', 'lái xe', 'My dad **drove** us to the station.'],
        ['speak → spoke', 'nói', 'She **spoke** to the manager.'],
        ['choose → chose', 'chọn', 'I **chose** the environmental project.'],
        ['break → broke', 'làm vỡ, gãy', 'I **broke** my arm when I was ten.'],
        ['forget → forgot', 'quên', 'I **forgot** my gloves.'],
        ['wear → wore', 'mặc, đeo', 'Everyone **wore** a green T-shirt.'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 3 — đuôi -ought / -aught (đọc /ɔːt/)',
      head: ['V1 → V2', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['buy → bought', 'mua', 'We **bought** rice for the food bank.'],
        ['bring → brought', 'mang đến', 'People **brought** old clothes.'],
        ['think → thought', 'nghĩ', 'I **thought** it was a great idea.'],
        ['fight → fought', 'đánh nhau, đấu tranh', 'They **fought** for clean water.'],
        ['teach → taught', 'dạy', 'I **taught** English to primary pupils.'],
        ['catch → caught', 'bắt (được)', 'He **caught** the last bus.'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 4 — đổi đuôi thành -t (hoặc rút ngắn nguyên âm)',
      head: ['V1 → V2', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['send → sent', 'gửi', 'We **sent** the books by post.'],
        ['spend → spent', 'tiêu, dành (thời gian)', 'I **spent** two weeks in the mountains.'],
        ['build → built', 'xây', 'They **built** a new classroom.'],
        ['lend → lent', 'cho mượn', 'A neighbour **lent** us a ladder.'],
        ['feel → felt', 'cảm thấy', 'I **felt** really proud.'],
        ['keep → kept', 'giữ', 'She **kept** a diary of the trip.'],
        ['sleep → slept', 'ngủ', 'We **slept** in a tent.'],
        ['leave → left', 'rời đi; để lại', 'We **left** at sunrise.'],
        ['meet → met', 'gặp', 'I **met** my best friend there.'],
        ['lose → lost', 'mất, thua', 'The team **lost** the final.'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 5 — biến đổi riêng (phải thuộc lòng — đều là động từ dùng nhiều nhất)',
      head: ['V1 → V2', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['be → was / were', 'thì, là, ở', 'It **was** a long day.'],
        ['have → had', 'có; ăn', 'We **had** dinner with the villagers.'],
        ['do → did', 'làm', 'I **did** some volunteer work last year.'],
        ['go → went', 'đi', 'We **went** to a mountain village.'],
        ['make → made', 'làm ra', 'We **made** sandwiches for 200 people.'],
        ['say → said', 'nói (said đọc /sed/)', 'She **said** thank you to everyone.'],
        ['pay → paid', 'trả tiền', 'The company **paid** for the bus.'],
        ['see → saw', 'nhìn thấy', 'I **saw** a beautiful sunrise.'],
        ['take → took', 'cầm, lấy; mất (thời gian)', 'The journey **took** six hours.'],
        ['eat → ate', 'ăn', 'We **ate** with the local families.'],
        ['tell → told', 'kể, bảo', 'He **told** us about his childhood.'],
        ['sell → sold', 'bán', 'Students **sold** cakes to raise money.'],
        ['hear → heard', 'nghe thấy', 'I **heard** about the project on Facebook.'],
        ['stand → stood', 'đứng', 'We **stood** in the rain for an hour.'],
        ['understand → understood', 'hiểu', 'I finally **understood** their problems.'],
        ['fall → fell', 'ngã; giảm', 'The number of visitors **fell** in 2020.'],
        ['rise → rose', 'tăng, mọc lên', 'Prices **rose** sharply last year.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo học động từ bất quy tắc',
      items: [
        'Mỗi ngày học **một nhóm**, đọc to cả cặp (go – went) chứ không đọc từng từ rời. Sau một tuần, luyện ngược: nhìn V2 nói ra V1.',
        'Ghi **câu của chính bạn** cho 10 động từ hay dùng nhất khi kể chuyện: went, had, did, made, saw, took, met, felt, got, gave.',
        '**rise → rose** và **fall → fell** là hai động từ bất quy tắc **quan trọng nhất cho Writing Task 1** (biểu đồ năm đã qua). ~~rised~~, ~~falled~~ là lỗi rất hay gặp.',
        'Câu phủ định và câu hỏi **không cần** nhớ V2: I didn\'t **go** · Did you **buy**…? — chỉ câu khẳng định mới dùng V2.',
        'Bảng đầy đủ V1 – V2 – V3 (V3 dùng cho thì hoàn thành và câu bị động) sẽ học ở các ngày sau; hôm nay chỉ cần **V2**.',
      ],
    },
    {
      t: 'rule',
      formula: 'go → went · have → had · do → did · make → made · see → saw · take → took · buy → bought · rise → rose · fall → fell',
      vi: 'Động từ bất quy tắc chỉ đổi dạng ở câu KHẲNG ĐỊNH; câu phủ định / câu hỏi vẫn did + V nguyên mẫu.',
    },
    {
      t: 'quiz',
      id: 'd9-bqt-dich',
      title: 'Dịch nhanh — động từ bất quy tắc (5 câu)',
      kind: 'translate',
      grammar: 'Khẳng định dùng V2 bất quy tắc (went, bought, met, felt, took). Phủ định / câu hỏi: did + V nguyên mẫu.',
      items: [
        { q: 'Năm ngoái chúng tôi đã đến một ngôi làng trên núi.', hint: 'went (go → went), to a mountain village, last year', answers: ['We went to a mountain village last year.', 'Last year we went to a mountain village.', 'Last year, we went to a mountain village.', 'We visited a mountain village last year.', 'Last year we visited a mountain village.', 'Last year, we visited a mountain village.'] },
        { q: 'Tôi đã mua gạo cho ngân hàng thực phẩm.', hint: 'bought (buy → bought), rice, for the food bank', answers: ['I bought rice for the food bank.', 'I bought some rice for the food bank.'] },
        { q: 'Tôi đã gặp nhiều người thú vị ở đó.', hint: 'met (meet → met), many / a lot of interesting people, there', answers: ['I met many interesting people there.', 'I met a lot of interesting people there.', 'I met lots of interesting people there.', 'I met a lot of interesting people there too.'] },
        { q: 'Chuyến đi mất sáu tiếng.', hint: 'The journey / The trip, took (take → took), six hours', answers: ['The journey took six hours.', 'The trip took six hours.', 'The journey took 6 hours.', 'The trip took 6 hours.'] },
        { q: 'Bạn có mang găng tay không?', hint: 'Did you bring (nguyên mẫu), gloves / your gloves', answers: ['Did you bring gloves?', 'Did you bring your gloves?', 'Did you bring any gloves?', 'Did you bring some gloves?'] },
      ],
    },

    { t: 'h', text: '8. Quá khứ đơn dùng khi nào?' },
    {
      t: 'table',
      head: ['Cách dùng', 'Giải thích', 'Ví dụ'],
      rows: [
        ['① Việc **đã xong** ở một thời điểm **xác định**', 'Có (hoặc ngầm hiểu) mốc thời gian: yesterday, last week, in 2019, two years ago, when I was ten.', 'I **joined** a volunteer club **two years ago**.'],
        ['② **Chuỗi hành động** nối tiếp trong quá khứ', 'Kể chuyện: việc nào xảy ra trước thì nói trước. Hay đi với **first, then, after that, finally**.', 'We **arrived** at 7, **signed** in and **started** work at 7.30.'],
        ['③ Việc kéo dài **trong quá khứ** và **đã chấm dứt**', 'Đi với **for + khoảng thời gian** — nhưng giờ không còn nữa.', 'I **lived** in Hue **for ten years**. (Giờ tôi không sống ở Huế nữa.)'],
        ['④ **Thói quen trong quá khứ**', 'Ngày xưa hay làm, giờ không còn. Có thể thay bằng **used to + V** (nâng cao).', 'When I was a child, I **played** football every afternoon. = I **used to play**…'],
      ],
    },
    {
      t: 'sodo',
      kind: 'timeline',
      title: 'Quá khứ đơn: điểm, chuỗi điểm và đoạn đã khép lại',
      caption: 'Mọi dấu đều nằm **bên trái** "bây giờ" và **không chạm tới** hiện tại — việc đã kết thúc.',
      marks: [
        { from: -3, kieu: 'diem', label: '① **joined** a club two years ago', mau: 1 },
        { from: -8, kieu: 'diem', label: '② **arrived** at 7…', mau: 2 },
        { from: -7, kieu: 'diem', label: '…**signed** in…', mau: 2 },
        { from: -6, kieu: 'diem', label: '…**started** work at 7.30', mau: 2 },
        { from: -9, to: -4, kieu: 'doan', label: '③ **lived** in Hue for ten years (giờ không còn)', mau: 3 },
        { from: -10, to: -6, kieu: 'lap', label: '④ **played** football every afternoon as a child', mau: 1 },
      ],
    },
    {
      t: 'table',
      caption: 'Dấu hiệu nhận biết quá khứ đơn',
      head: ['Dấu hiệu', 'Ví dụ'],
      rows: [
        ['yesterday · the day before yesterday', 'I **met** her **yesterday**.'],
        ['last + night / week / month / year / summer', 'We **planted** trees **last weekend**.'],
        ['khoảng thời gian + **ago**', 'She **moved** to Da Nang **three years ago**.'],
        ['in + năm đã qua · in the past', 'The charity **started in 2015**.'],
        ['when I was + tuổi / a child / at school', '**When I was twelve**, I **learnt** to swim.'],
        ['at that time · then · once', '**At that time**, I **didn\'t speak** any English.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: "ago" và "used to"',
      items: [
        '**ago** đứng **sau** khoảng thời gian: **two years ago** (~~ago two years~~, ~~before two years~~).',
        '**used to + V nguyên mẫu** (nâng cao) = ngày xưa hay… (giờ thì không): I **used to be** shy, but volunteering changed me. Phủ định: **didn\'t use to**. Đừng nhầm với **be used to + V-ing** (quen với).',
        'Đã có mốc quá khứ xác định (yesterday, in 2019, ago) thì **không dùng** hiện tại hoàn thành (have + V3, học sau): ~~I have joined the club two years ago.~~ → I **joined** the club two years ago.',
      ],
    },
    {
      t: 'rule',
      formula: 'S + V2 + mốc quá khứ (yesterday / last… / … ago / in 2019 / when I was…)',
      vi: 'Việc đã xong ở thời điểm xác định · chuỗi hành động · việc kéo dài đã chấm dứt · thói quen ngày xưa (= used to + V).',
    },
    {
      t: 'quiz',
      id: 'd9-cach-dung-dich',
      title: 'Dịch nhanh — kể chuyện bằng quá khứ đơn (4 câu)',
      kind: 'translate',
      grammar: 'S + V2 / V-ed + mốc thời gian (ago, last…, when I was…). Chuỗi hành động: V2, V2 and V2. Thói quen ngày xưa: V2 hoặc used to + V.',
      items: [
        { q: 'Cô ấy chuyển đến Đà Nẵng ba năm trước.', hint: 'moved, to Da Nang, three years ago', answers: ['She moved to Da Nang three years ago.', 'She moved to Danang three years ago.', 'Three years ago, she moved to Da Nang.', 'Three years ago she moved to Da Nang.'] },
        { q: 'Chúng tôi đến lúc bảy giờ, đăng ký rồi bắt đầu làm việc.', hint: 'arrived, at seven / at 7, signed in, and (then) started work', answers: ['We arrived at seven, signed in and started work.', 'We arrived at 7, signed in and started work.', 'We arrived at seven, signed in, and started work.', 'We arrived at 7, signed in, and started work.', 'We arrived at seven, signed in and then started work.', 'We arrived at 7, signed in and then started work.', 'We arrived at seven, signed in and started working.', 'We arrived at seven, signed in, and then started work.', 'We arrived at seven o\'clock, signed in and started work.'] },
        { q: 'Tôi sống ở Huế mười năm (giờ không còn sống ở đó).', hint: 'lived, in Hue, for ten years', answers: ['I lived in Hue for ten years.', 'I lived in Hue for 10 years.'] },
        { q: 'Hồi nhỏ, tôi hay chơi bóng đá mỗi chiều.', hint: 'When I was a child, played / used to play, football, every afternoon', answers: ['When I was a child, I played football every afternoon.', 'When I was a child I played football every afternoon.', 'When I was a child, I used to play football every afternoon.', 'When I was a child I used to play football every afternoon.', 'When I was little, I played football every afternoon.', 'When I was little, I used to play football every afternoon.', 'When I was young, I played football every afternoon.', 'When I was young, I used to play football every afternoon.', 'As a child, I played football every afternoon.', 'As a child, I used to play football every afternoon.'] },
      ],
    },

    { t: 'h', text: '9. Phát âm: ba cách đọc đuôi -ed' },
    {
      t: 'p',
      text: 'Viết thì luôn là **-ed**, nhưng đọc thì có **ba cách**. Người Việt hay mắc hai lỗi ngược nhau: **bỏ hẳn đuôi** (helped đọc thành "help" → giám khảo tưởng bạn dùng sai thì) hoặc **đọc thừa một âm tiết** (worked đọc thành "wớc-kịt"). Quy tắc dựa vào **âm cuối** của động từ gốc (âm, không phải chữ):',
    },
    {
      t: 'table',
      caption: 'Quy tắc đọc -ed',
      head: ['Âm cuối của động từ gốc', 'Đọc -ed là', 'Ví dụ'],
      rows: [
        ['/t/ hoặc /d/', '**/ɪd/** — thêm một âm tiết "ịt"', 'want**ed** /ˈwɒntɪd/ · need**ed** /ˈniːdɪd/ · visit**ed** · donat**ed** · decid**ed**'],
        ['âm **vô thanh** (dây thanh không rung): /p/ /k/ /f/ /s/ /ʃ/ /tʃ/ /θ/', '**/t/** — không thêm âm tiết', 'help**ed** /helpt/ · work**ed** /wɜːkt/ · laugh**ed** /lɑːft/ · pass**ed** · wash**ed** /wɒʃt/ · watch**ed** /wɒtʃt/'],
        ['âm **hữu thanh** (dây thanh rung) và **mọi nguyên âm**', '**/d/** — không thêm âm tiết', 'play**ed** /pleɪd/ · clean**ed** /kliːnd/ · liv**ed** /lɪvd/ · volunteer**ed** /ˌvɒlənˈtɪəd/ · stay**ed**'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo phát âm -ed',
      items: [
        'Đặt tay lên cổ, đọc âm cuối của động từ gốc: cổ **không rung** (p, k, f, s, sh, ch) → đọc **/t/**; cổ **rung** → đọc **/d/**.',
        'Chỉ **t** và **d** mới sinh ra âm tiết mới /ɪd/. Vì vậy **worked** chỉ có **một** âm tiết /wɜːkt/, **helped** một âm tiết /helpt/ — đừng đọc "hen-pịt".',
        'Khi từ sau bắt đầu bằng nguyên âm, nối /t/ /d/ sang luôn: help**ed_a**n old man → "hel-ptơ-nold man"; clean**ed_u**p → "klin-dắp".',
        'Một vài tính từ tận cùng -ed đọc /ɪd/ dù không phải quá khứ: **naked** /ˈneɪkɪd/, **wicked**, **beloved** — gặp thì học riêng.',
      ],
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Ba nhóm đuôi -ed',
      cols: [
        { title: '**/ɪd/** — sau /t/ /d/', items: ['wanted', 'needed', 'visited', 'donated', 'collected', 'painted'] },
        { title: '**/t/** — sau âm vô thanh', items: ['helped', 'worked', 'watched', 'washed', 'cooked', 'laughed'] },
        { title: '**/d/** — sau âm hữu thanh, nguyên âm', items: ['played', 'cleaned', 'lived', 'volunteered', 'stayed', 'organised'] },
      ],
      caption: 'Chỉ cột đầu thêm một âm tiết. Hai cột sau: đuôi -ed chỉ là một phụ âm nhẹ dính vào cuối từ.',
    },
    {
      t: 'phatam',
      id: 'd9-phat-am',
      title: 'Luyện phát âm — ba cách đọc đuôi -ed',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng dòng đó. Xanh là đúng, vàng là gần đúng, đỏ là cần sửa. Ba dòng đầu mỗi dòng một nhóm; đừng nuốt mất /t/, /d/ cuối, và đừng thêm âm tiết thừa cho nhóm /t/ /d/.',
      items: [
        { text: 'wanted, needed, visited', ipa: 'wɒntɪd niːdɪd vɪzɪtɪd', vi: '/ɪd/ — thêm một âm tiết' },
        { text: 'helped, worked, watched', ipa: 'helpt wɜːkt wɒtʃt', vi: '/t/ — một âm tiết, không đọc "hen-pịt"' },
        { text: 'played, cleaned, lived', ipa: 'pleɪd kliːnd lɪvd', vi: '/d/ — rung nhẹ ở cuối' },
        { text: 'donated, collected, painted', ipa: 'dəʊneɪtɪd kəlektɪd peɪntɪd', vi: '/ɪd/' },
        { text: 'washed, cooked, laughed', ipa: 'wɒʃt kʊkt lɑːft', vi: '/t/' },
        { text: 'I volunteered at a shelter last summer.', ipa: 'aɪ vɒləntɪəd ət ə ʃeltə lɑːst sʌmə', vi: '/d/ trong volunteered' },
        { text: 'We cleaned the beach and collected plastic bottles.', ipa: 'wiː kliːnd ðə biːtʃ ənd kəlektɪd plæstɪk bɒtlz', vi: '/d/ · /ɪd/' },
        { text: 'She helped the old man and walked him home.', ipa: 'ʃiː helpt ðiː əʊld mæn ənd wɔːkt hɪm həʊm', vi: '/t/ · /t/ — nối helped_the' },
        { text: 'They needed more volunteers, so I signed up.', ipa: 'ðeɪ niːdɪd mɔː vɒləntɪəz səʊ aɪ saɪnd ʌp', vi: '/ɪd/ · /d/ — nối signed_up' },
      ],
    },

    { t: 'h', text: '10. Ứng dụng trong IELTS' },
    {
      t: 'p',
      text: '**a) Speaking Part 1 — câu hỏi về quá khứ.** Giám khảo hay chuyển từ hiện tại sang quá khứ trong cùng một chủ đề: "Do you like sports?" → "**Did** you play sports **when you were a child**?". Nghe thấy **did / when you were… / in the past** là phải đổi sang quá khứ đơn.',
    },
    {
      t: 'dialogue',
      title: 'Part 1 — đổi thì theo câu hỏi',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'What are you doing these days, work or study?' },
        { who: 'Candidate', role: 'candidate', text: "At the moment I'm studying business at university, and I'm also helping out at a local food bank on Saturdays.", vi: 'Hiện tôi đang học kinh doanh ở đại học, và thứ Bảy tôi còn phụ giúp ở một ngân hàng thực phẩm gần nhà.' },
        { who: 'Examiner', role: 'examiner', text: 'Did you do any volunteer work when you were at school?' },
        { who: 'Candidate', role: 'candidate', text: 'Yes, I did. When I was in grade ten, my class collected old books and sent them to a school in the mountains. I really enjoyed it because I felt useful for the first time.', vi: 'Có ạ. Hồi lớp mười, lớp tôi gom sách cũ và gửi lên một trường vùng núi. Tôi rất thích vì lần đầu tiên thấy mình có ích.' },
      ],
    },
    {
      t: 'p',
      text: '**b) Speaking Part 2 — kể một trải nghiệm.** Đề kiểu "Describe a time when you helped someone" gần như **toàn bộ là quá khứ đơn**, nối bằng từ chỉ trình tự. Khung kể chuyện 4 bước dưới đây dùng được cho rất nhiều đề Part 2.',
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Kể một trải nghiệm (Part 2) bằng quá khứ đơn',
      steps: [
        { label: '**Bối cảnh** — When / Where / Who', sub: 'It happened **last summer**, when I **was** in Hoi An with my cousin.' },
        { label: '**Chuyện gì xảy ra**', sub: '**First**, we **saw**… **Then** I **asked**… **After that** we **took**…' },
        { label: '**Kết quả**', sub: '**In the end** / **Finally**, she **got** home safely.' },
        { label: '**Cảm nhận** (có thể dùng hiện tại)', sub: 'I **felt** really proud, and **I still remember** it today.' },
      ],
      caption: 'Phần kể dùng quá khứ đơn; câu cuối nói cảm nhận **bây giờ** thì quay về hiện tại đơn.',
    },
    {
      t: 'p',
      text: '**c) Writing Task 1 — biểu đồ các năm đã qua.** Khi trục thời gian là các năm **đã qua** (2010, 2015, 2020), cả bài viết ở **quá khứ đơn**: The number of volunteers **rose** from 2,000 in 2010 to 5,000 in 2020. Donations **fell** slightly in 2015. Biểu đồ **không có mốc thời gian** thì dùng hiện tại đơn; các năm **tương lai** (dự báo) dùng will / is expected to — học ở các ngày sau.',
    },
    {
      t: 'p',
      text: '**d) Writing Task 2 — xu hướng hiện nay.** Mở bài và thân bài hay dùng hiện tại tiếp diễn cho xu hướng: Nowadays, a growing number of young people **are taking** part in community projects. Còn ví dụ cá nhân trong thân bài thì dùng quá khứ đơn: For example, when I **volunteered** at a shelter, I **learnt** to work in a team.',
    },
    {
      t: 'table',
      caption: 'Chọn thì theo phần thi',
      head: ['Phần thi', 'Thì chính', 'Câu mẫu'],
      rows: [
        ['Speaking Part 1 (hiện tại)', 'hiện tại đơn / tiếp diễn', "I usually… / At the moment I'm…"],
        ['Speaking Part 1 (Did you… / as a child)', 'quá khứ đơn', 'Yes, I did. When I was ten, I…'],
        ['Speaking Part 2 (Describe a time…)', 'quá khứ đơn + từ trình tự', 'First… Then… After that… In the end…'],
        ['Writing Task 1 (năm đã qua)', 'quá khứ đơn', 'The figure rose / fell / was…'],
        ['Writing Task 2 (xu hướng + ví dụ)', 'hiện tại tiếp diễn + quá khứ đơn', 'More people are… For example, when I…'],
      ],
    },
    {
      t: 'rule',
      formula: 'Did you…? / When you were… → S + V2 · Nowadays / more and more → S + are + V-ing · Năm đã qua (Task 1) → rose / fell / was',
      vi: 'Nghe thì của câu hỏi để trả lời đúng thì; biểu đồ quá khứ viết bằng quá khứ đơn.',
    },
    {
      t: 'quiz',
      id: 'd9-ielts-dich',
      title: 'Dịch nhanh — câu IELTS dùng đúng thì (4 câu)',
      kind: 'translate',
      grammar: 'Xu hướng: Nowadays, more and more / a growing number of + N số nhiều + are + V-ing. Biểu đồ năm đã qua: S + rose / fell + from … to … . Kể chuyện: S + V2.',
      items: [
        { q: 'Ngày nay, ngày càng nhiều sinh viên đang tham gia các dự án cộng đồng.', hint: 'Nowadays, more and more / a growing number of students, are taking part in, community projects', answers: ['Nowadays, more and more students are taking part in community projects.', 'Nowadays more and more students are taking part in community projects.', 'Nowadays, a growing number of students are taking part in community projects.', 'Nowadays a growing number of students are taking part in community projects.', 'Nowadays, an increasing number of students are taking part in community projects.', 'Nowadays, more and more students are participating in community projects.', 'Nowadays, more and more students are joining community projects.', 'These days, more and more students are taking part in community projects.'] },
        { q: 'Số lượng tình nguyện viên đã tăng từ 2.000 năm 2010 lên 5.000 năm 2020.', hint: 'The number of volunteers, rose (rise → rose) / increased, from 2,000 in 2010, to 5,000 in 2020', answers: ['The number of volunteers rose from 2,000 in 2010 to 5,000 in 2020.', 'The number of volunteers increased from 2,000 in 2010 to 5,000 in 2020.', 'The number of volunteers rose from 2000 in 2010 to 5000 in 2020.', 'The number of volunteers increased from 2000 in 2010 to 5000 in 2020.', 'The number of volunteers grew from 2,000 in 2010 to 5,000 in 2020.'] },
        { q: 'Số tiền quyên góp giảm nhẹ vào năm 2015.', hint: 'Donations, fell (fall → fell) / decreased, slightly, in 2015', answers: ['Donations fell slightly in 2015.', 'Donations decreased slightly in 2015.', 'Donations dropped slightly in 2015.', 'In 2015, donations fell slightly.', 'In 2015 donations fell slightly.', 'The amount of donations fell slightly in 2015.', 'The amount of money donated fell slightly in 2015.'] },
        { q: 'Ví dụ, khi tôi làm tình nguyện ở một trại cứu hộ, tôi đã học cách làm việc nhóm.', hint: 'For example, when I volunteered, at a shelter, I learnt / learned, to work in a team', answers: ['For example, when I volunteered at a shelter, I learnt to work in a team.', 'For example, when I volunteered at a shelter, I learned to work in a team.', 'For example, when I volunteered at a shelter, I learnt how to work in a team.', 'For example, when I volunteered at a shelter, I learned how to work in a team.', 'For example, when I volunteered at an animal shelter, I learnt to work in a team.', 'For example, when I volunteered at an animal shelter, I learned to work in a team.', 'For instance, when I volunteered at a shelter, I learnt to work in a team.', 'For instance, when I volunteered at a shelter, I learned to work in a team.', 'For example, when I volunteered at a shelter, I learnt teamwork.', 'For example, when I volunteered at a shelter, I learned teamwork.'] },
      ],
    },

    { t: 'h', text: '11. Lỗi về thì người Việt hay mắc nhất' },
    {
      t: 'table',
      head: ['Sai', 'Đúng', 'Vì sao'],
      rows: [
        ['~~I working now.~~', 'I **am working** now.', 'Tiếp diễn cần đủ **am/is/are + V-ing**.'],
        ['~~I am knowing her.~~ / ~~She is wanting…~~', 'I **know** her. / She **wants**…', 'Động từ trạng thái không -ing.'],
        ['~~I am usually walk to school.~~', 'I **usually walk** to school.', 'usually → hiện tại đơn; không ghép am với V nguyên mẫu.'],
        ['~~Yesterday I go to the farm.~~', 'Yesterday I **went** to the farm.', 'Có mốc quá khứ → V2.'],
        ['~~I didn\'t went.~~ / ~~Did you saw…?~~', "I **didn't go**. / Did you **see**…?", 'did + V nguyên mẫu.'],
        ['~~I was go to the market.~~', 'I **went** to the market.', 'was không đi với V nguyên mẫu.'],
        ['~~She helpeds us.~~', 'She **helped** us.', 'Quá khứ đơn không có -s.'],
        ['~~The number rised.~~ / ~~falled~~', 'The number **rose** / **fell**.', 'rise, fall là bất quy tắc.'],
        ['~~I have visited Hue in 2020.~~', 'I **visited** Hue in 2020.', 'Mốc quá khứ xác định → quá khứ đơn.'],
        ['~~I born in 2006.~~', 'I **was born** in 2006.', 'be born luôn có be.'],
        ['Nói "I help-" (nuốt -ed)', 'I **helped** /helpt/', 'Không đọc đuôi -ed thì người nghe hiểu là hiện tại.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo soát thì trước khi nộp bài / trong lúc nói',
      items: [
        'Viết xong, gạch chân **mọi động từ chính** và hỏi: câu này nói về **bây giờ**, **thói quen** hay **đã xong**? Rồi kiểm dạng động từ tương ứng.',
        'Khi nói, chọn **một thì chủ đạo** cho mỗi câu trả lời (Part 2 = quá khứ) và giữ nguyên, đừng nhảy qua lại.',
        'Lỡ nói sai thì tự sửa ngay: "Yesterday I go— **went** to…" — tự sửa **không bị trừ điểm**, còn cho thấy bạn kiểm soát ngữ pháp.',
      ],
    },
    {
      t: 'rule',
      formula: 'am / is / are + V-ing · V2 / V-ed · did + V · was / were + N / adj',
      vi: 'Bốn khuôn hay sai nhất: thiếu be, did + V2, was + V, quên đổi V2 khi đã có mốc quá khứ.',
    },
    {
      t: 'quiz',
      id: 'd9-loi-dich',
      title: 'Dịch nhanh — tránh lỗi hay gặp (4 câu)',
      kind: 'translate',
      grammar: 'Mốc quá khứ → V2. Phủ định quá khứ: didn\'t + V. Đang làm → am / is / are + V-ing. Động từ trạng thái → hiện tại đơn.',
      items: [
        { q: 'Hôm qua tôi không đi làm.', hint: "didn't go (nguyên mẫu), to work, yesterday", answers: ["I didn't go to work yesterday.", 'I did not go to work yesterday.', "Yesterday I didn't go to work.", "Yesterday, I didn't go to work.", 'Yesterday I did not go to work.', 'Yesterday, I did not go to work.'] },
        { q: 'Bạn có thấy con chó của tôi không?', hint: 'Did you see (nguyên mẫu), my dog', answers: ['Did you see my dog?', 'Have you seen my dog?'] },
        { q: 'Tôi hiểu vấn đề của bạn.', hint: 'understand (không -ing), your problem', answers: ['I understand your problem.', 'I understand your problems.'] },
        { q: 'Chị tôi đang học cho kỳ thi.', hint: 'My sister (is), is studying, for the exam / for her exam', answers: ['My sister is studying for the exam.', 'My sister is studying for her exam.', "My sister's studying for the exam.", "My sister's studying for her exam.", 'My sister is studying for an exam.', 'My sister is studying for her exams.'] },
      ],
    },
    {
      t: 'mcq',
      id: 'd9-nhanh-chon',
      title: 'Kiểm tra nhanh — chọn thì đúng (8 câu)',
      items: [
        { q: 'Shh! The baby ___ .', options: ['sleeps', 'is sleeping', 'slept'], correct: 1, why: '"Shh!" (suỵt) cho biết em bé **đang ngủ ngay lúc nói** → hiện tại tiếp diễn **is sleeping**. "sleeps" là thói quen; "slept" là quá khứ.' },
        { q: 'My father ___ in a factory. He has worked there for 20 years.', options: ['works', 'is working', 'worked'], correct: 0, why: 'Công việc **lâu dài**, vẫn đang làm (has worked there for 20 years) → hiện tại đơn **works**. "is working" chỉ hợp khi tạm thời; "worked" nghĩa là đã nghỉ.' },
        { q: 'I ___ the answer to question 5.', options: ["am not knowing", "didn't knew", "don't know"], correct: 2, why: '**know** là động từ trạng thái, không -ing → **don\'t know**. "didn\'t knew" sai vì did + V nguyên mẫu (didn\'t know).' },
        { q: 'We ___ 300 trees last Sunday.', options: ['plant', 'are planting', 'planted'], correct: 2, why: '**last Sunday** = mốc quá khứ xác định → quá khứ đơn **planted**.' },
        { q: '___ you go to the meeting yesterday?', options: ['Do', 'Did', 'Were'], correct: 1, why: 'Câu hỏi quá khứ với động từ thường **go** → **Did** + S + V. "Were you go" sai vì were không đi với V nguyên mẫu.' },
        { q: 'These days, more people ___ electric motorbikes.', options: ['are buying', 'bought', 'buys'], correct: 0, why: '**These days** + xu hướng đang thay đổi → **are buying**. "buys" sai cả thì lẫn sự hoà hợp (more people là số nhiều).' },
        { q: 'The number of visitors ___ sharply in 2020.', options: ['falled', 'is falling', 'fell'], correct: 2, why: 'Năm đã qua (2020) → quá khứ đơn. **fall → fell** (bất quy tắc); ~~falled~~ không tồn tại.' },
        { q: 'When I was a child, I ___ afraid of dogs.', options: ['was', 'am', 'were'], correct: 0, why: '**When I was a child** → quá khứ; chủ ngữ **I** → **was**. "were" chỉ đi với you / we / they.' },
      ],
    },
    {
      t: 'quiz',
      id: 'd9-nhanh',
      title: 'Kiểm tra nhanh — chia động từ trong ngoặc (9 câu)',
      kind: 'fill',
      items: [
        { q: 'Listen! Someone ___ (sing) in the next room.', answers: ['is singing'] },
        { q: 'She ___ (visit) her grandparents last weekend.', answers: ['visited'] },
        { q: 'I ___ (not / understand) this word. Can you explain it?', answers: ["don't understand", 'do not understand'] },
        { q: 'They ___ (stop) work at noon yesterday because of the heat.', answers: ['stopped'] },
        { q: 'He usually ___ (take) the train to work.', answers: ['takes'] },
        { q: 'This week he ___ (drive) to work because the trains are on strike.', answers: ['is driving', "'s driving"] },
        { q: 'We ___ (buy) twenty kilos of rice for the food bank.', answers: ['bought'] },
        { q: 'There ___ (be) many volunteers at the festival last year.', answers: ['were'] },
        { q: 'What did you ___ (do) last night?', answers: ['do'] },
      ],
    },
  ],
};

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const D9_VOCAB: Lesson = {
  id: 'd9-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng: Tình nguyện (Volunteering)',
  goal: 'Nắm 20 từ, 10 cụm động từ và 6 họ từ về tình nguyện và từ thiện, rồi dùng được trong Speaking Part 2 ("Describe a time you helped someone") và Writing Task 2 (có nên bắt buộc học sinh làm công việc cộng đồng?).',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này học gì',
      items: [
        '**20 từ** chủ đề tình nguyện: volunteer, charity, donation, fundraising, community, the elderly, food bank, rewarding… — mỗi từ có IPA Anh-Anh, ví dụ và dòng **"Hay đi với"**.',
        '**10 cụm động từ**: take part in, help out, give back, give away, hand out, clean up, look after, reach out to, drop off, pitch in.',
        '**6 họ từ**: volunteer → voluntary · donate → donation / donor · contribute → contribution · benefit → beneficial · organise → organisation · charity → charitable.',
        'Nối bài ngữ pháp: kể chuyện tình nguyện bằng **quá khứ đơn** (volunteered, raised, gave away…) và xu hướng bằng **hiện tại tiếp diễn**.',
        'Có **thẻ hình**, **sơ đồ tư duy** và câu mẫu ăn điểm cho Speaking Part 2 + Writing Task 2.',
      ],
    },
    {
      t: 'p',
      text: '**Tình nguyện** (volunteering — làm việc giúp người khác hoặc cộng đồng mà **không nhận lương**) là chủ đề rất hay gặp trong IELTS: Speaking Part 1 ("Have you ever done any volunteer work?"), Part 2 ("Describe a time when you helped someone"), Part 3 ("Why do some people not volunteer?") và Writing Task 2 ("Should community service be compulsory for high school students?"). Học theo vòng: nghe 🔊 → đọc to → che nghĩa tự nhớ → đặt **một câu quá khứ** về việc tốt bạn từng làm.',
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Bản đồ từ vựng chủ đề Volunteering',
      center: '**Volunteering**',
      branches: [
        { label: 'Làm gì', anh: 'broom', items: ['clean up a beach', 'plant trees', 'teach children', 'serve food at a food bank', 'look after animals'] },
        { label: 'Ở đâu', anh: 'house', items: ['an orphanage', 'an animal shelter', 'a nursing home', 'a food bank', 'a community centre'] },
        { label: 'Lợi ích cho người làm', anh: 'flexed-biceps', items: ['gain experience', 'develop new skills', 'make new friends', 'feel useful — a **rewarding** job'] },
        { label: 'Lợi ích cho cộng đồng', anh: 'houses', items: ['help people in need', 'raise awareness', 'a cleaner environment', '**make a difference**'] },
        { label: 'Tiền & đồ', anh: 'money-bag', items: ['donate money / blood', 'raise money (fundraising)', 'give away old clothes', 'a charity / a non-profit organisation'] },
      ],
      caption: 'Năm nhánh này cũng là năm hướng ý để trả lời Speaking Part 3 và lấy ý cho Writing Task 2.',
    },
    {
      t: 'hinh',
      title: 'Nhìn hình — nói cụm từ',
      items: [
        { anh: 'person-raising-hand', w: 'volunteer', ro: '/ˌvɒlənˈtɪə(r)/', vi: 'tình nguyện viên; xung phong' },
        { anh: 'drop-of-blood', w: 'donate blood', ro: '/dəʊˈneɪt blʌd/', vi: 'hiến máu' },
        { anh: 'canned-food', w: 'food bank', ro: '/ˈfuːd bæŋk/', vi: 'ngân hàng thực phẩm (phát đồ ăn miễn phí)' },
        { anh: 'broom', w: 'clean up', ro: '/ˌkliːn ˈʌp/', vi: 'dọn dẹp sạch sẽ' },
        { anh: 'litter-in-bin-sign', w: 'pick up litter', ro: '/ˌpɪk ʌp ˈlɪtə(r)/', vi: 'nhặt rác' },
        { anh: 'seedling', w: 'plant trees', ro: '/ˌplɑːnt ˈtriːz/', vi: 'trồng cây' },
        { anh: 'older-person', w: 'the elderly', ro: '/ði ˈeldəli/', vi: 'người cao tuổi' },
        { anh: 'dog', w: 'animal shelter', ro: '/ˈænɪml ˌʃeltə(r)/', vi: 'trại cứu hộ động vật' },
        { anh: 't-shirt', w: 'give away old clothes', ro: '/ɡɪv əˌweɪ əʊld ˈkləʊðz/', vi: 'cho đi quần áo cũ' },
        { anh: 'books', w: 'donate books', ro: '/dəʊˈneɪt ˈbʊks/', vi: 'quyên tặng sách' },
        { anh: 'money-bag', w: 'raise money', ro: '/ˌreɪz ˈmʌni/', vi: 'quyên góp tiền, gây quỹ' },
        { anh: 'wrapped-gift', w: 'hand out gifts', ro: '/ˌhænd aʊt ˈɡɪfts/', vi: 'phát quà' },
        { anh: 'teacher', w: 'teach children', ro: '/ˌtiːtʃ ˈtʃɪldrən/', vi: 'dạy trẻ em' },
      ],
    },

    { t: 'h', text: '1. 20 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'volunteer', pos: 'n, v', ipa: '/ˌvɒlənˈtɪə(r)/', vi: 'tình nguyện viên; làm tình nguyện, xung phong', ex: 'Last summer I volunteered at a hospital in my hometown.', exVi: 'Hè năm ngoái tôi làm tình nguyện ở một bệnh viện ở quê.', more: 'Nhấn âm **cuối**: vo-lun-**TEER**. **volunteer at / for** + nơi / tổ chức · **volunteer to + V** (xung phong làm gì) · **volunteer work** (công việc tình nguyện — không đếm được).', anh: 'person-raising-hand' },
        { w: 'voluntary', pos: 'adj', ipa: '/ˈvɒləntri/', vi: 'tự nguyện, không bắt buộc; không lương', ex: 'Joining the club is voluntary, so nobody has to do it.', exVi: 'Tham gia câu lạc bộ là tự nguyện nên không ai bị bắt buộc.', more: 'Trái nghĩa: **compulsory / mandatory** (bắt buộc) — cặp từ cực hay gặp trong Task 2. Cụm: **voluntary work**, **on a voluntary basis** (trên cơ sở tự nguyện).' },
        { w: 'charity', pos: 'n', ipa: '/ˈtʃærəti/', vi: 'tổ chức từ thiện; việc từ thiện', ex: 'My aunt works for a charity that builds schools in the mountains.', exVi: 'Dì tôi làm cho một tổ chức từ thiện xây trường ở vùng núi.', more: '**a charity** (một tổ chức — đếm được, số nhiều **charities**) · **give money to charity** (làm từ thiện — không mạo từ) · **a charity event / concert**.' },
        { w: 'donate', pos: 'v', ipa: '/dəʊˈneɪt/', vi: 'quyên góp, hiến tặng', ex: 'Thousands of people donated money after the flood.', exVi: 'Hàng nghìn người đã quyên góp tiền sau trận lũ.', more: '**donate sth to sb / sth**: donate books **to** a school (~~donate a school books~~). **donate blood** (hiến máu).' },
        { w: 'donation', pos: 'n', ipa: '/dəʊˈneɪʃn/', vi: 'khoản quyên góp, vật quyên tặng', ex: 'The food bank depends on donations from local shops.', exVi: 'Ngân hàng thực phẩm sống nhờ đồ quyên góp của các cửa hàng gần đó.', more: 'Đếm được: **a donation of 500,000 dong** · **make a donation** (quyên góp — không dùng ~~do a donation~~).', anh: 'wrapped-gift' },
        { w: 'fundraising', pos: 'n', ipa: '/ˈfʌndreɪzɪŋ/', vi: 'việc gây quỹ, quyên tiền', ex: 'Our class organised a fundraising event to buy books for a village school.', exVi: 'Lớp tôi tổ chức một sự kiện gây quỹ để mua sách cho một trường làng.', more: 'Không đếm được. **a fundraising event / campaign** · người gây quỹ: **fundraiser** (cũng có nghĩa là một sự kiện gây quỹ).', anh: 'money-bag' },
        { w: 'non-profit organisation', pos: 'n', ipa: '/ˌnɒn ˈprɒfɪt ˌɔːɡənaɪˈzeɪʃn/', vi: 'tổ chức phi lợi nhuận', ex: 'She left her bank job to work for a non-profit organisation.', exVi: 'Cô ấy bỏ việc ngân hàng để làm cho một tổ chức phi lợi nhuận.', more: 'Viết tắt quen thuộc: **NGO** (non-governmental organisation — tổ chức phi chính phủ). Mỹ viết **organization**.' },
        { w: 'community', pos: 'n', ipa: '/kəˈmjuːnəti/', vi: 'cộng đồng (người sống cùng nơi / cùng nhóm)', ex: 'The new library has brought the whole community together.', exVi: 'Thư viện mới đã gắn kết cả cộng đồng lại với nhau.', more: '**the local community** · **community service** (lao động công ích) · **a sense of community** (tình làng nghĩa xóm).', anh: 'houses' },
        { w: 'cause', pos: 'n', ipa: '/kɔːz/', vi: 'mục đích, sự nghiệp (mà ai đó ủng hộ)', ex: 'All the money from the concert will go to a good cause.', exVi: 'Toàn bộ tiền từ buổi hoà nhạc sẽ dành cho một mục đích tốt đẹp.', more: '**a good / worthy cause** · **support a cause**. Đừng nhầm với **cause** = nguyên nhân / gây ra (the cause of the fire).' },
        { w: 'raise', pos: 'v', ipa: '/reɪz/', vi: 'quyên góp (tiền); nâng cao (nhận thức)', ex: 'The students raised 20 million dong to raise awareness of plastic waste.', exVi: 'Các bạn học sinh quyên được 20 triệu đồng để nâng cao nhận thức về rác thải nhựa.', more: '**raise money / funds** (gây quỹ) · **raise awareness of** + vấn đề. Quá khứ **raised** /reɪzd/ (có quy tắc) — khác **rise → rose** (tự tăng lên).', anh: 'megaphone' },
        { w: 'the homeless', pos: 'n', ipa: '/ðə ˈhəʊmləs/', vi: 'những người vô gia cư', ex: 'Every Friday night we cook soup for the homeless.', exVi: 'Mỗi tối thứ Sáu chúng tôi nấu súp cho người vô gia cư.', more: '**the + tính từ = một nhóm người**, động từ **số nhiều**: The homeless **need** warm clothes. Nói một người: **a homeless person** (~~a homeless~~).' },
        { w: 'the elderly', pos: 'n', ipa: '/ði ˈeldəli/', vi: 'người cao tuổi', ex: 'Young volunteers visit the elderly in a nursing home near my school.', exVi: 'Các tình nguyện viên trẻ đến thăm người già ở một viện dưỡng lão gần trường tôi.', more: 'Giống **the homeless, the poor, the young** — động từ số nhiều. Lịch sự hơn **old people**. **a nursing home** = viện dưỡng lão.', anh: 'older-person' },
        { w: 'orphanage', pos: 'n', ipa: '/ˈɔːfənɪdʒ/', vi: 'trại trẻ mồ côi', ex: 'We spent a weekend teaching English at an orphanage in Lao Cai.', exVi: 'Chúng tôi dành một cuối tuần dạy tiếng Anh ở một trại trẻ mồ côi tại Lào Cai.', more: 'Gốc **orphan** /ˈɔːfn/ = trẻ mồ côi. Âm "ph" đọc /f/; đuôi **-age** đọc /ɪdʒ/.' },
        { w: 'shelter', pos: 'n', ipa: '/ˈʃeltə(r)/', vi: 'nơi trú ẩn; trại cứu hộ', ex: 'The animal shelter needs volunteers to walk the dogs.', exVi: 'Trại cứu hộ động vật cần tình nguyện viên dắt chó đi dạo.', more: '**an animal shelter** · **a homeless shelter** (nhà tạm cho người vô gia cư) · **take shelter from the rain** (trú mưa).' },
        { w: 'food bank', pos: 'n', ipa: '/ˈfuːd bæŋk/', vi: 'ngân hàng thực phẩm (nơi nhận và phát đồ ăn miễn phí)', ex: 'During the lockdown, many families got rice from a local food bank.', exVi: 'Trong thời gian giãn cách, nhiều gia đình nhận gạo từ một ngân hàng thực phẩm gần nhà.', more: 'Ở Việt Nam có "ATM gạo" — gần nghĩa nhất là **a rice ATM / a free rice machine**. Hay đi với: **donate to / volunteer at** a food bank.', anh: 'canned-food' },
        { w: 'blood donor', pos: 'n', ipa: '/ˈblʌd ˌdəʊnə(r)/', vi: 'người hiến máu', ex: 'My father has been a blood donor for over ten years.', exVi: 'Bố tôi là người hiến máu đã hơn mười năm.', more: '**donor** = người hiến / người tặng (**an organ donor** — người hiến tạng). Hành động: **give blood / donate blood**.', anh: 'drop-of-blood' },
        { w: 'clean-up', pos: 'n', ipa: '/ˈkliːn ʌp/', vi: 'cuộc / buổi dọn dẹp', ex: 'Over 200 students joined the beach clean-up on Sunday.', exVi: 'Hơn 200 học sinh tham gia buổi dọn bãi biển hôm Chủ nhật.', more: 'Danh từ viết có gạch nối (**a clean-up**), động từ viết rời (**clean up** the beach) — giống set up / setup ở Ngày 5.', anh: 'broom' },
        { w: 'rewarding', pos: 'adj', ipa: '/rɪˈwɔːdɪŋ/', vi: 'đáng làm, mang lại niềm vui / sự thoả mãn (dù không có tiền)', ex: 'Teaching poor children was hard work, but it was very rewarding.', exVi: 'Dạy trẻ em nghèo rất vất vả, nhưng vô cùng đáng làm.', more: 'Từ "ăn điểm" khi tả cảm xúc trong Part 2: **a rewarding experience**. Gốc **reward** (phần thưởng). Đừng nhầm với ~~rewarded~~ (được thưởng).' },
        { w: 'unpaid', pos: 'adj', ipa: '/ˌʌnˈpeɪd/', vi: 'không lương, không được trả tiền', ex: 'Most of the work at the festival is unpaid.', exVi: 'Phần lớn công việc ở lễ hội là không lương.', more: '**unpaid work / an unpaid internship** (thực tập không lương). Cùng nghĩa: **work for free**. Trái nghĩa: **paid**.' },
        { w: 'make a difference', pos: 'phr', ipa: '/ˌmeɪk ə ˈdɪfrəns/', vi: 'tạo ra sự thay đổi tích cực, có ích thật sự', ex: 'Even one hour a week can make a difference to a lonely old person.', exVi: 'Chỉ một giờ mỗi tuần cũng có thể tạo ra thay đổi cho một người già cô đơn.', more: '**make a (big / real) difference to / in** + người / việc. Dùng **make**, không dùng ~~do a difference~~.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**volunteer** (danh từ / động từ) ≠ **voluntary** (tính từ): ~~a volunteer work~~ → **volunteer work** / **voluntary work** (không đếm được, không "a"); ~~I voluntary at a school~~ → **I volunteer** at a school.',
        '**do** volunteer work (~~make volunteer~~) · **make** a donation · **make** a difference · **raise** money · **give** blood.',
        '**the elderly / the homeless / the poor** + động từ **số nhiều**, không thêm -s: ~~the elderlies~~, ~~the homelesses~~.',
        '**donate sth to sb**: ~~donate the school some books~~ → **donate some books to the school**.',
        '**charity** khi là hoạt động: **give to charity**, **do charity work** (không mạo từ); khi là một tổ chức: **a charity, two charities**.',
        '**raise** (gây quỹ — có tân ngữ, có quy tắc: raised) ≠ **rise** (tự tăng — không tân ngữ, bất quy tắc: rose). We **raised** money. · Donations **rose**.',
      ],
    },

    { t: 'h', text: '2. Cụm động từ (phrasal verbs)' },
    {
      t: 'p',
      text: 'Mười cụm động từ người bản xứ dùng hằng ngày khi nói về giúp đỡ và tình nguyện. Ở Ngày 1 bạn đã gặp **sign up (for)** — đăng ký: I **signed up for** a beach clean-up. Hôm nay học thêm những cụm sau, mỗi cụm có câu ví dụ ở **quá khứ đơn** để luyện luôn bài ngữ pháp.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'take part in', pos: 'phr v', ipa: '/teɪk ˈpɑːt ɪn/', vi: 'tham gia (một hoạt động, sự kiện)', ex: 'Over 300 students took part in the charity run.', exVi: 'Hơn 300 học sinh đã tham gia cuộc chạy từ thiện.', more: '= **participate in** (Ngày 3), trang trọng hơn. Quá khứ: **took part in** (take → took). ~~took part on~~ là sai giới từ.' },
        { w: 'help out', pos: 'phr v', ipa: '/ˌhelp ˈaʊt/', vi: 'phụ giúp (nhất là lúc ai đó đang bận / khó khăn)', ex: 'I helped out at my uncle\'s restaurant during the holidays.', exVi: 'Kỳ nghỉ tôi phụ giúp ở nhà hàng của chú.', more: '**help out at** + nơi · **help (sb) out with** + việc: Can you help me out with the boxes?' },
        { w: 'give back', pos: 'phr v', ipa: '/ˌɡɪv ˈbæk/', vi: 'đền đáp, đóng góp lại (cho cộng đồng đã giúp mình); trả lại', ex: 'After he became a doctor, he wanted to give back to his village.', exVi: 'Sau khi thành bác sĩ, anh ấy muốn đóng góp lại cho làng mình.', more: '**give back to the community** — cụm rất hay cho Task 2. Nghĩa thường: **give it back** (trả lại nó).' },
        { w: 'give away', pos: 'phr v', ipa: '/ˌɡɪv əˈweɪ/', vi: 'cho đi, tặng miễn phí', ex: 'We gave away all our old toys to a kindergarten.', exVi: 'Chúng tôi đã cho hết đồ chơi cũ cho một trường mẫu giáo.', more: 'Tách được: **give them away** (với đại từ bắt buộc tách). Danh từ: **a giveaway** (quà tặng miễn phí).' },
        { w: 'hand out', pos: 'phr v', ipa: '/ˌhænd ˈaʊt/', vi: 'phát (cho từng người)', ex: 'The volunteers handed out water to the runners.', exVi: 'Các tình nguyện viên phát nước cho người chạy.', more: '**hand out** leaflets / food / gifts · danh từ **a handout** (tài liệu phát tay).' },
        { w: 'clean up', pos: 'phr v', ipa: '/ˌkliːn ˈʌp/', vi: 'dọn sạch', ex: 'It took us four hours to clean up the river bank.', exVi: 'Chúng tôi mất bốn tiếng để dọn sạch bờ sông.', more: 'Tách được: **clean the beach up / clean it up**. Danh từ: **a clean-up**.' },
        { w: 'look after', pos: 'phr v', ipa: '/ˌlʊk ˈɑːftə(r)/', vi: 'chăm sóc, trông nom', ex: 'At the shelter, I looked after three young cats.', exVi: 'Ở trại cứu hộ, tôi chăm ba chú mèo con.', more: '**không tách**: look after **them** (~~look them after~~). = **take care of**.' },
        { w: 'reach out to', pos: 'phr v', ipa: '/ˌriːtʃ ˈaʊt tə/', vi: 'chủ động liên hệ, tìm đến (để giúp hoặc nhờ giúp)', ex: 'The charity reached out to local businesses for donations.', exVi: 'Tổ chức từ thiện đã chủ động liên hệ các doanh nghiệp địa phương để xin quyên góp.', more: 'Dùng nhiều trong công việc: Feel free to **reach out to** me if you have questions.' },
        { w: 'drop off', pos: 'phr v', ipa: '/ˌdrɒp ˈɒf/', vi: 'mang đến để lại (đồ); cho ai xuống xe', ex: 'You can drop off old clothes at the community centre.', exVi: 'Bạn có thể mang quần áo cũ đến để lại ở nhà văn hoá.', more: 'Quá khứ **dropped off** (gấp đôi p). Nghĩa khác: My mum **dropped me off** at school. (cho tôi xuống ở trường).' },
        { w: 'pitch in', pos: 'phr v', ipa: '/ˌpɪtʃ ˈɪn/', vi: 'cùng góp sức, xắn tay vào làm (thân mật)', ex: 'When the storm hit, the whole street pitched in to clear the fallen trees.', exVi: 'Khi bão đổ bộ, cả khu phố cùng xắn tay dọn cây đổ.', more: 'Thân mật, hợp với Speaking. Trong Writing dùng **contribute / work together**.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo dùng cụm động từ',
      items: [
        '**Tách được**: give away, hand out, clean up, drop off → give **them** away, clean **it** up, drop **it** off (đại từ bắt buộc nằm giữa).',
        '**Không tách**: take part in, look after, reach out to, help out at → look after **them**.',
        'Trong Writing Task 2 nên đổi cụm thân mật sang từ trang trọng: take part in → **participate in** · help out → **assist** · give back → **contribute to society** · pitch in → **work together**.',
      ],
    },

    { t: 'h', text: '3. Họ từ (word formation)' },
    {
      t: 'table',
      head: ['Gốc', 'Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'],
      rows: [
        ['volunteer — tình nguyện', 'volunteer (người) · volunteering (việc)', 'volunteer', 'voluntary · **involuntary** (không chủ ý)', 'voluntarily'],
        ['donate — quyên tặng', 'donation (khoản quyên góp) · donor (người hiến)', 'donate', '—', '—'],
        ['contribute — đóng góp', 'contribution · contributor', 'contribute (to)', 'contributory (ít dùng)', '—'],
        ['benefit — lợi ích', 'benefit · beneficiary (người hưởng lợi)', 'benefit (from)', 'beneficial (to)', 'beneficially'],
        ['organise — tổ chức', 'organisation · organiser', 'organise (Mỹ: organize)', 'organised (ngăn nắp) · **disorganised**', '—'],
        ['charity — từ thiện', 'charity · charities', '—', 'charitable (nhân ái; thuộc từ thiện)', 'charitably'],
      ],
    },
    {
      t: 'note',
      title: 'Dễ nhầm trong họ từ',
      items: [
        '**benefit from** (hưởng lợi từ) vs **be beneficial to** (có lợi cho): Students **benefit from** volunteering. Volunteering **is beneficial to** students.',
        '**contribute to** + danh từ / V-ing: Volunteers **contribute to** the community. Danh từ: **make a contribution to**.',
        '**organised** có hai nghĩa: a well-**organised** event (được tổ chức tốt) · She is very **organised** (ngăn nắp, có tổ chức).',
        'Người làm / người nhận: **donor** (người hiến) – **recipient** (người nhận); **volunteer** – **beneficiary** (người được giúp). Đuôi **-or / -er** = người làm.',
      ],
    },

    { t: 'h', text: '4. Dùng trong IELTS: câu mẫu ăn điểm' },
    {
      t: 'examples',
      items: [
        { en: 'Volunteering allows young people to gain experience and develop skills such as teamwork and communication.', vi: 'Làm tình nguyện giúp người trẻ có kinh nghiệm và phát triển các kỹ năng như làm việc nhóm và giao tiếp. (Task 2)' },
        { en: 'If community service became compulsory, it would no longer be truly voluntary.', vi: 'Nếu lao động công ích trở thành bắt buộc thì nó không còn thật sự là tự nguyện nữa. (Task 2 — mặt phản đối)' },
        { en: 'Charities play a vital role in supporting the homeless and the elderly.', vi: 'Các tổ chức từ thiện đóng vai trò thiết yếu trong việc hỗ trợ người vô gia cư và người cao tuổi. (Task 2)' },
        { en: 'Nowadays, a growing number of students are taking part in fundraising events.', vi: 'Ngày nay, ngày càng nhiều học sinh tham gia các sự kiện gây quỹ. (Task 2 — xu hướng, hiện tại tiếp diễn)' },
        { en: "I've never done much volunteer work, but I give blood twice a year.", vi: 'Tôi chưa làm tình nguyện nhiều, nhưng mỗi năm tôi hiến máu hai lần. (Speaking Part 1)' },
        { en: 'It was one of the most rewarding experiences of my life, because I felt I had made a real difference.', vi: 'Đó là một trong những trải nghiệm đáng giá nhất đời tôi, vì tôi thấy mình đã tạo ra thay đổi thật sự. (Speaking Part 2 — câu kết)' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Speaking Part 2 mẫu — Describe a time when you helped someone',
      lines: [
        { who: 'Examiner', role: 'examiner', text: "Now I'd like you to describe a time when you helped someone. You should say who you helped, when and where it happened, what you did, and explain how you felt about it." },
        { who: 'Candidate', role: 'candidate', text: "I'd like to talk about a weekend last December, when I volunteered at a food bank in my neighbourhood. A friend of mine posted that they needed extra help before the New Year, so I signed up straight away.", vi: 'Tôi muốn kể về một cuối tuần tháng Mười Hai năm ngoái, khi tôi làm tình nguyện ở một ngân hàng thực phẩm trong khu phố. Một người bạn đăng bài rằng họ cần thêm người trước Tết, nên tôi đăng ký ngay.' },
        { who: 'Candidate', role: 'candidate', text: 'On the first morning, we sorted donations: rice, cooking oil and instant noodles. Then we packed them into bags, and in the afternoon we handed them out to about eighty families. I also helped an elderly woman carry her bag to the bus stop, because it was too heavy for her.', vi: 'Sáng đầu tiên, chúng tôi phân loại đồ quyên góp: gạo, dầu ăn và mì gói. Rồi chúng tôi đóng vào túi, và buổi chiều phát cho khoảng tám mươi gia đình. Tôi còn giúp một bà cụ mang túi ra bến xe buýt vì túi quá nặng với bà.' },
        { who: 'Candidate', role: 'candidate', text: 'Honestly, I was exhausted by the evening, but it was incredibly rewarding. The woman thanked me again and again, and I realised that even a small amount of time can make a difference. Since then, I have tried to help out there once a month.', vi: 'Thật lòng thì tối đó tôi mệt rã rời, nhưng vô cùng đáng giá. Bà cụ cảm ơn tôi mãi, và tôi nhận ra chỉ một chút thời gian cũng có thể tạo ra thay đổi. Từ đó, tôi cố gắng mỗi tháng phụ giúp ở đó một lần.' },
      ],
    },
    {
      t: 'note',
      title: 'Vì sao bài Part 2 trên ổn ở mức band 6',
      items: [
        'Trả lời **đủ 4 gợi ý** của đề theo đúng thứ tự: ai (families, an elderly woman) → khi nào, ở đâu (last December, a food bank) → làm gì (sorted, packed, handed out) → cảm nhận (rewarding).',
        'Phần kể dùng **quá khứ đơn** nhất quán: volunteered, posted, signed up, sorted, packed, handed out, helped, was, thanked, realised. Từ trình tự: **On the first morning, Then, in the afternoon, by the evening**.',
        'Dùng đúng từ vựng chủ đề: **volunteer, food bank, donations, hand out, the elderly, rewarding, make a difference, help out**.',
        'Câu cuối chuyển về hiện tại một cách tự nhiên (**Since then, I have tried…**) để nói ảnh hưởng tới bây giờ — thì hiện tại hoàn thành sẽ học ở các ngày sau.',
      ],
    },
    {
      t: 'mcq',
      id: 'd9-tu-vung-chon',
      title: 'Chọn từ đúng — collocation chủ đề tình nguyện (8 câu)',
      items: [
        { q: 'Every year my school ___ money for children in the mountains.', options: ['rises', 'makes', 'raises'], correct: 2, why: '**raise money** = gây quỹ (raise có tân ngữ). **rise** không có tân ngữ (prices rise); "make money" là kiếm tiền cho mình, không phải quyên góp.' },
        { q: 'I would like to ___ some volunteer work this summer.', options: ['do', 'make', 'take'], correct: 0, why: 'Collocation cố định: **do volunteer work** (như do homework, do housework). ~~make volunteer work~~ là lỗi dịch từ "làm".' },
        { q: 'Community service should be ___, not compulsory.', options: ['volunteer', 'voluntarily', 'voluntary'], correct: 2, why: 'Sau **be** và đối lập với tính từ **compulsory** → cần **tính từ voluntary**. volunteer là danh từ / động từ; voluntarily là trạng từ.' },
        { q: '___ elderly need more support in winter.', options: ['An', 'The', '—'], correct: 1, why: '**the + tính từ** = cả nhóm người: **the elderly**, động từ số nhiều (need). Không có "an elderly" khi muốn nói cả nhóm.' },
        { q: 'She ___ all her old books to a village library.', options: ['donated', 'donated for', 'donated with'], correct: 0, why: '**donate sth to sb/sth**: donated her old books **to** a village library. Không cần thêm giới từ sau donate.' },
        { q: 'Even small actions can ___ a difference.', options: ['do', 'give', 'make'], correct: 2, why: 'Cụm cố định **make a difference**. ~~do a difference~~ không tồn tại.' },
        { q: 'Teaching at the orphanage was hard but very ___ .', options: ['rewarded', 'rewarding', 'reward'], correct: 1, why: 'Tả tính chất của công việc → tính từ đuôi -ing **rewarding** (mang lại niềm vui). **rewarded** = được thưởng (tả người).' },
        { q: 'More than 150 people ___ the beach clean-up last Sunday.', options: ['took part in', 'take part in', 'took part on'], correct: 0, why: '**last Sunday** → quá khứ đơn: **took part in** (take → took). Giới từ đi kèm là **in**, không phải on.' },
      ],
    },
    {
      t: 'quiz',
      id: 'd9-tu-vung-qkd',
      title: 'Kể chuyện tình nguyện — chia động từ ở quá khứ đơn (8 câu)',
      kind: 'fill',
      items: [
        { q: 'Last summer, I ___ (volunteer) at an animal shelter.', answers: ['volunteered'] },
        { q: 'Our class ___ (raise) five million dong for flood victims.', answers: ['raised'] },
        { q: 'We ___ (give) away more than 300 books.', answers: ['gave'] },
        { q: 'The volunteers ___ (hand) out hot soup to the homeless.', answers: ['handed'] },
        { q: 'I ___ (take) part in a charity run in March.', answers: ['took'] },
        { q: 'My mother ___ (donate) blood for the first time in 2019.', answers: ['donated'] },
        { q: 'At the shelter, I ___ (look) after two old dogs.', answers: ['looked'] },
        { q: 'It ___ (be) a really rewarding experience.', answers: ['was'] },
      ],
    },
    {
      t: 'quiz',
      id: 'd9-tu-vung-dich',
      title: 'Dịch sang tiếng Anh — từ vựng tình nguyện (5 câu)',
      kind: 'translate',
      grammar: 'Quá khứ đơn cho việc đã làm (volunteered, raised, gave away); hiện tại đơn cho sự thật; the + tính từ (the elderly, the homeless) + động từ số nhiều.',
      items: [
        { q: 'Năm ngoái tôi làm tình nguyện ở một ngân hàng thực phẩm.', hint: 'volunteered, at a food bank, last year', answers: ['I volunteered at a food bank last year.', 'Last year I volunteered at a food bank.', 'Last year, I volunteered at a food bank.', 'I did volunteer work at a food bank last year.', 'Last year, I did volunteer work at a food bank.'] },
        { q: 'Chúng tôi đã quyên được mười triệu đồng cho một tổ chức từ thiện.', hint: 'raised, ten million dong, for a charity', answers: ['We raised ten million dong for a charity.', 'We raised 10 million dong for a charity.', 'We raised ten million VND for a charity.', 'We raised 10 million VND for a charity.', 'We raised ten million dong for charity.', 'We raised 10 million dong for charity.'] },
        { q: 'Người cao tuổi cần nhiều sự quan tâm hơn.', hint: 'The elderly (số nhiều → need), more attention / more care', answers: ['The elderly need more attention.', 'The elderly need more care.', 'Elderly people need more attention.', 'Elderly people need more care.', 'The elderly need more support.'] },
        { q: 'Cô ấy đã cho đi toàn bộ quần áo cũ của mình.', hint: 'gave away, all her old clothes', answers: ['She gave away all her old clothes.', 'She gave all her old clothes away.', 'She gave away all of her old clothes.', 'She gave all of her old clothes away.'] },
        { q: 'Làm tình nguyện là một trải nghiệm rất đáng giá.', hint: 'Volunteering, is, a very rewarding experience', answers: ['Volunteering is a very rewarding experience.', 'Volunteering is a really rewarding experience.', 'Volunteer work is a very rewarding experience.', 'Voluntary work is a very rewarding experience.', 'Doing volunteer work is a very rewarding experience.'] },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */
/*
 * Kịch bản tự viết. Recording 1 = Part 2 đủ 10 câu (11–20): buổi giới thiệu cho
 * tình nguyện viên mới ở Greenfield Community Farm — 5 câu MCQ + 5 câu Map
 * Labelling (bản đồ vẽ bằng khối `figure` kind map, 8 ô A–H, 3 ô gây nhiễu).
 * Recording 2 = thông báo dọn bãi biển, 6 câu Note Completion.
 *
 * Bản đồ (cols 12, rows 9, phía trên = Bắc). Lối chính chạy dọc giữa (x 5.5–6.5)
 * từ cổng (dưới) lên nhà chính (trên); lối ngang Đông–Tây ở y 4.3–5.2.
 *   H café — bên PHẢI, ngay sau cổng · A nhà kho dụng cụ — bên TRÁI, ngay trước
 *   ngã tư · B phòng sơ cứu (từng là nhà kho) — đối diện A · D kho hạt giống —
 *   rẽ trái, toà đầu bên phải · C nhà kính — cuối lối phía Tây, bên phải · E vườn
 *   trẻ em — đi thẳng qua ngã tư, ngay bên phải · F tổ ong — xa hơn về phía Đông,
 *   sát ao · G chuồng gà — rẽ phải, qua phòng sơ cứu, cuối lối bên phải.
 */
const D9_SCRIPT_1: string[] = [
  "Good morning, everyone, and welcome to Greenfield Community Farm. My name's Helen Price, and I'm the volunteer coordinator here. Thank you all for signing up. Before we start work, I'm going to tell you a little about the farm, explain how your first few weeks will work, and then show you around using the map in your welcome pack.",
  'Let me begin with a bit of history. A lot of visitors assume that this land was once a dairy farm, probably because of the old barn by the gate. In fact, the farm only opened twelve years ago. Before that, for almost thirty years, this whole area was a rubbish tip, where the town dumped its waste. Local families campaigned to clean it up, and the council finally agreed to turn it into a farm that everyone could use. The only part that was already paved was the car park, which you all came through this morning.',
  "Now, about your first day. I know most of you are hoping to work with the animals. Everybody is! But for safety reasons, you need to complete two training sessions before you can feed or handle them. And the café, as you may know, is run by our paid staff, so you won't be needed there. So on your first day, you'll be out in the vegetable beds, planting onions and beans with our gardener, Sam.",
  "As for what to bring: we provide gloves, so please don't buy any. Lunch is also free, because the café gives every volunteer a hot meal. The one thing we can't lend you is footwear, so please make sure you bring your own waterproof boots. The fields get very muddy, even in summer.",
  "If you can't come to a session, please let us know in advance. Normally you would contact me, but I'm going to be away for most of next month, so for the next few weeks please send a text message directly to the farm manager, Tom Hale. Please don't ask another volunteer to pass on the message, because messages like that often get lost.",
  'People often ask me what the best part of volunteering here is. Many of you came to learn new skills, and you certainly will. Others want to meet people in the area, and that happens naturally. But when I ask our long-term volunteers, almost all of them say the same thing: what they value most is seeing children from the city enjoy the farm, for example watching a seven-year-old hold a chicken for the very first time.',
  "Right, now please look at the map in your pack. We're standing at the main gate, at the bottom of the map, and the farmhouse is at the top. On your left as you come in is the car park.",
  "The first building on your right, just inside the gate, is the café. It opens at ten, and that's where you'll sign in every morning.",
  "If you walk up the main path, you'll come to a crossroads, where it meets the path that runs from east to west. Just before the crossroads, on the left-hand side, is the tool shed, where you'll collect your equipment. The building opposite it, on the right, used to be the tool shed, but it's now our first-aid room.",
  "At the crossroads, turn left and follow the path to the west. You'll pass a small building on your right. That's the seed store. Keep going all the way to the end of the path, and the large building on your right there is the greenhouse.",
  "Now come back to the crossroads and carry straight on up the main path towards the farmhouse. Immediately on your right is the children's garden, where school groups plant their own flowers. Further east, beyond the children's garden and right next to the pond, are the beehives. Please don't go near them without a protective suit.",
  "Finally, the animals. Go back to the crossroads once more, and this time turn right, heading east. Walk past the first-aid room, and at the very end of the path, on your right, you'll find the chicken houses. That's where most of you will end up working once your training is finished. OK, any questions before we head to the vegetable beds?",
];

const D9_SCRIPT_2: string[] = [
  "Hi everyone, this is Mark Bell from Riverside Council, with some information about this year's beach clean-up. It takes place on Saturday the twenty-first of June.",
  "Please note that we won't be meeting in the car park like last year, because it's being repaired. Instead, we'll meet beside the old lighthouse, right next to the pier.",
  "We'll start at half past eight in the morning and finish at about midday, so it isn't a full day. The council will provide bags and litter pickers, but please bring a reusable water bottle. There's a tap where you can refill it, and we'd like to avoid plastic bottles completely this year.",
  'Anyone under sixteen is very welcome, but they must come with an adult. Last year, our volunteers collected 320 kilos of rubbish in just one morning. This year we are hoping to reach 500, so please bring your friends!',
];

const D9_LISTENING: Lesson = {
  id: 'd9-nghe',
  kind: 'listening',
  title: 'Listening Part 2 — độc thoại bối cảnh xã hội (MCQ + Map/Plan Labelling)',
  goal: 'Biết Part 2 gồm những gì, làm được hai dạng hay gặp nhất của nó — trắc nghiệm (Multiple Choice) và điền bản đồ (Map Labelling) — bằng chiến thuật nghe paraphrase và lần theo lời chỉ đường, qua một bài đủ 10 câu (11–20) và một bài Note Completion.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này học gì',
      items: [
        '**Part 2** = câu **11–20**, **một người nói** (độc thoại) về một chủ đề **đời sống xã hội**: giới thiệu một nơi, một sự kiện, một dịch vụ, hướng dẫn tình nguyện viên…',
        '**Multiple Choice**: đáp án đúng thường được **nói khác đi** (paraphrase); cả 3 phương án hay được **nhắc tới** — nghe từ báo hiệu **but, actually, in fact, used to**.',
        '**Map Labelling**: tìm điểm bắt đầu (**You are here** / lối vào) → **di ngón tay** theo lời chỉ đường → nghe từ vị trí (**opposite, on your right, at the end of, beyond**…) → ghi **chữ cái**.',
        'Bài luyện chính: **Greenfield Community Farm** (câu 11–20). Bài luyện 2: thông báo **dọn bãi biển** (6 câu điền).',
        'Nối Ngày 9: lời người nói dùng **quá khứ đơn** để kể lịch sử (was, opened, campaigned) và **used to** để gài bẫy.',
      ],
    },
    {
      t: 'p',
      text: 'Bài thi **IELTS Listening** có 4 phần (Part), 40 câu, nghe **một lần duy nhất**. Ngày 7 bạn đã học **Part 1** (hội thoại đời thường, điền phiếu). Hôm nay là **Part 2**: vẫn là chủ đề đời sống, nhưng chỉ có **một người nói liên tục** — không có người thứ hai hỏi lại hay xác nhận, nên bạn phải **bám theo dòng nói** mà không có "điểm nghỉ".',
    },
    {
      t: 'table',
      caption: 'Vị trí của Part 2 trong bài Listening',
      head: ['Phần', 'Số người nói', 'Bối cảnh', 'Độ khó'],
      rows: [
        ['Part 1 (câu 1–10)', '2 người', 'đời sống: đặt chỗ, đăng ký, hỏi thông tin', 'dễ nhất'],
        ['**Part 2 (câu 11–20)**', '**1 người**', '**đời sống xã hội**: giới thiệu nơi chốn, sự kiện, dịch vụ, chương trình tình nguyện', '**dễ – vừa**'],
        ['Part 3 (câu 21–30)', '2–4 người', 'học thuật: sinh viên bàn bài tập với nhau / với giảng viên', 'vừa – khó'],
        ['Part 4 (câu 31–40)', '1 người', 'học thuật: một bài giảng', 'khó nhất'],
      ],
    },

    { t: 'h', text: '1. Part 2 có những dạng câu hỏi nào?' },
    {
      t: 'table',
      head: ['Dạng câu hỏi', 'Trông như thế nào', 'Mẹo nhanh'],
      rows: [
        ['**Multiple Choice** (trắc nghiệm)', 'Câu hỏi + 3 phương án A/B/C, chọn một (đôi khi chọn 2 trong 5).', 'Đọc trước, gạch từ khoá trong **câu hỏi**, đoán cách nói khác của từng phương án.'],
        ['**Map / Plan Labelling** (điền bản đồ / sơ đồ)', 'Một bản đồ có các ô chữ cái A–H; mỗi câu là tên một địa điểm, bạn ghi chữ cái.', 'Tìm **điểm bắt đầu**, di ngón tay theo lời nói.'],
        ['**Matching** (nối)', 'Nối danh sách (người, ngày, khu vực) với các lựa chọn A–G.', 'Danh sách câu hỏi đi **theo thứ tự** lời nói, các lựa chọn thì không.'],
        ['**Note / Table Completion** (điền ghi chú, bảng)', 'Ghi chú có chỗ trống, giới hạn số từ.', 'Như Part 1: đoán loại từ, đúng chính tả, đúng số từ.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ về Part 2',
      items: [
        'Câu hỏi luôn đi **theo thứ tự** lời nói. Lỡ một câu thì bỏ qua ngay, chuyển sang câu sau.',
        'Trước khi nghe, đề cho khoảng **30 giây** đọc câu hỏi. Dùng hết 30 giây đó để gạch từ khoá — đây là lúc quyết định điểm.',
        'Người nói thường **báo trước** khi chuyển phần: "Let me begin with…", "Now, about…", "Right, now please look at the map…". Nghe được câu chuyển là biết sắp tới câu hỏi nào.',
      ],
    },

    { t: 'h', text: '2. Chiến thuật Multiple Choice' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Làm một câu trắc nghiệm Part 2',
      steps: [
        { label: '**Đọc câu hỏi** (không phải phương án) trước', sub: 'Gạch **từ khoá hỏi**: Before it became…, first day, must bring, contact, value most.' },
        { label: '**Đoán cách nói khác** của 3 phương án', sub: 'plant vegetables ≈ in the vegetable beds, planting… · bring ≈ make sure you bring…' },
        { label: '**Nghe ý**, đừng chờ từ giống hệt', sub: 'Từ trùng với phương án thường là **bẫy**; đáp án đúng hay được **paraphrase**.' },
        { label: '**Loại** phương án bị phủ nhận', sub: 'Nghe **but, actually, in fact, however, used to, normally… but**' },
        { label: '**Chốt** khi người nói đã sang ý mới', sub: 'Chưa chắc thì đánh dấu tạm, nghe hết đoạn rồi mới quyết.' },
      ],
      caption: 'Bẫy kinh điển: cả ba phương án đều được nhắc trong bài, nhưng chỉ một cái **đúng với câu hỏi**.',
    },
    {
      t: 'table',
      caption: 'Ba kiểu bẫy hay gặp ở MCQ',
      head: ['Kiểu bẫy', 'Người nói nói gì', 'Phương án sai bạn dễ chọn'],
      rows: [
        ['**Nhắc rồi phủ nhận**', '"A lot of people think it was a **dairy farm**… **In fact**, it was a rubbish tip."', 'a dairy farm — nghe thấy từ trùng là chọn ngay'],
        ['**Trước kia / bây giờ**', '"It **used to be** the tool shed, **but** it\'s **now** the first-aid room."', 'nơi cất dụng cụ — thông tin cũ'],
        ['**Bình thường / lần này**', '"**Normally** you would contact me, **but**… please text the farm manager."', 'người điều phối — quy định bình thường, không phải lần này'],
      ],
    },
    {
      t: 'rule',
      formula: 'Từ khoá câu hỏi → đoán paraphrase → nghe ý → loại phương án sau "but / actually / in fact / used to / normally"',
      vi: 'Nghe thấy đúng chữ trong phương án chưa chắc là đáp án; nghe hết câu có "but" rồi mới chọn.',
    },

    { t: 'h', text: '3. Chiến thuật Map / Plan Labelling' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Làm bài điền bản đồ',
      steps: [
        { label: '**Định hướng** bản đồ', sub: 'Tìm **You are here** / lối vào, hướng Bắc (thường ở trên), các nơi **đã có tên**.' },
        { label: '**Đọc tên các địa điểm** cần tìm', sub: 'Chúng đi theo thứ tự lời nói — nhẩm trước: café, tool shed, greenhouse…' },
        { label: '**Di ngón tay** theo lời chỉ đường', sub: 'Đặt ngón tay ở điểm bắt đầu, đi theo từng chữ: walk up, turn left, at the end…' },
        { label: '**Bắt từ chỉ vị trí**', sub: 'on your right / left · opposite · next to · between · at the end of · beyond · in the corner' },
        { label: '**Ghi chữ cái**, cẩn thận ô gây nhiễu', sub: 'Bản đồ luôn có **nhiều ô hơn** số câu: có ô người nói tả nhưng không hỏi.' },
      ],
      caption: '"Trái / phải" tính theo **hướng đang đi** trên bản đồ, không phải trái / phải của tờ giấy: đi về phía Tây thì **bên phải là phía Bắc**.',
    },
    {
      t: 'table',
      caption: 'Từ chỉ hướng và vị trí phải thuộc',
      head: ['Cụm từ', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['on your right / on the left-hand side', 'bên phải / phía bên trái (theo hướng đi)', 'The café is **on your right**.'],
        ['as you come in / as you enter', 'khi bạn bước vào', '**On your left as you come in** is the car park.'],
        ['opposite / across from', 'đối diện', 'The first-aid room is **opposite** the tool shed.'],
        ['next to / beside', 'ngay cạnh', 'The beehives are **next to** the pond.'],
        ['between A and B', 'ở giữa A và B', 'The toilets are **between** the shop and the café.'],
        ['behind / in front of', 'phía sau / phía trước', 'There is a bench **in front of** the farmhouse.'],
        ['at the end of / at the far end', 'ở cuối (lối đi) / ở tận cùng', '**At the end of** the path is the greenhouse.'],
        ['in the corner', 'ở góc', 'The office is **in the corner** of the yard.'],
        ['beyond / past', 'quá khỏi, vượt qua', 'Walk **past** the shop; the lake is just **beyond** it.'],
        ['to the north / south / east / west of', 'phía Bắc / Nam / Đông / Tây của', 'The car park is **to the south of** the farmhouse.'],
        ['go straight on / carry straight on', 'đi thẳng', '**Carry straight on** up the main path.'],
        ['turn left / right · take the first left', 'rẽ trái / phải · rẽ trái ở ngã đầu tiên', '**Take the first right** after the bridge.'],
        ['the crossroads / the junction', 'ngã tư / chỗ giao nhau', 'Turn left **at the crossroads**.'],
        ['immediately / just before / just after', 'ngay (sau) / ngay trước / ngay sau', 'It is **just before** the crossroads.'],
      ],
    },
    {
      t: 'mcq',
      id: 'd9-vi-tri',
      title: 'Khởi động — hiểu đúng từ chỉ vị trí (6 câu)',
      items: [
        { q: '"The shop is **opposite** the bank." Nghĩa là:', options: ['Cửa hàng ở ngay cạnh ngân hàng', 'Cửa hàng ở phía sau ngân hàng', 'Cửa hàng ở phía đối diện ngân hàng'], correct: 2, why: '**opposite** = đối diện (hai bên đường / hai bên lối đi). Ngay cạnh là **next to**; phía sau là **behind**.' },
        { q: 'Bạn đang đi về phía **Tây**. Người nói: "the greenhouse is **on your right**". Nhà kính ở phía nào của lối đi?', options: ['Phía Bắc', 'Phía Nam', 'Phía Đông'], correct: 0, why: 'Quay mặt về phía Tây thì tay phải chỉ về phía **Bắc**. Trái / phải luôn tính theo hướng đang đi.' },
        { q: '"Walk **past** the café, and the toilets are **just beyond** it." Nhà vệ sinh ở đâu?', options: ['Trước quán café', 'Ngay sau quán café, đi tiếp một chút', 'Bên trong quán café'], correct: 1, why: '**past** = đi qua; **beyond** = ở phía bên kia, xa hơn. Nên nhà vệ sinh nằm **ngay sau** quán café theo hướng đi.' },
        { q: '"The office is **at the far end of** the corridor." Văn phòng ở:', options: ['Đầu hành lang', 'Giữa hành lang', 'Tận cùng hành lang'], correct: 2, why: '**at the far end of** = ở tận cùng, đầu xa nhất (so với chỗ bạn đứng).' },
        { q: '"It **used to be** a classroom, **but now** it\'s the library." Trên bản đồ hôm nay, ô đó là:', options: ['library', 'classroom', 'cả hai'], correct: 0, why: '**used to be** = trước kia là (giờ không còn). Bản đồ thể hiện hiện tại → **library**. Đây là bẫy hay gặp nhất của Map Labelling.' },
        { q: '"**Carry straight on** at the junction." Nghĩa là:', options: ['Rẽ ở chỗ giao nhau', 'Đi thẳng qua chỗ giao nhau', 'Dừng lại ở chỗ giao nhau'], correct: 1, why: '**carry straight on / go straight on** = tiếp tục đi thẳng; **junction** = chỗ các đường giao nhau.' },
      ],
    },
    {
      t: 'rule',
      formula: 'Điểm bắt đầu → di ngón tay (walk up / turn left / carry straight on) → từ vị trí (on your right · opposite · at the end of · beyond) → chữ cái',
      vi: 'Trái / phải theo hướng đang đi; "used to be… but now…" thì lấy thông tin hiện tại.',
    },

    { t: 'h', text: '4. Bài luyện chính — Questions 11–20' },
    {
      t: 'canh',
      anh: ['tractor', 'chicken', 'seedling', 'person-raising-hand'],
      caption: 'Greenfield Community Farm: một nông trại cộng đồng. Người điều phối tình nguyện viên **Helen Price** giới thiệu nông trại cho nhóm tình nguyện viên mới trong buổi sáng đầu tiên, rồi chỉ đường trên bản đồ.',
    },
    {
      t: 'p',
      text: 'Đây là một bài **Part 2 đủ 10 câu** như đề thật. **Trước khi bấm nghe**, cuộn xuống đọc Questions 11–15 (gạch từ khoá) và xem kỹ bản đồ ở Questions 16–20 (tìm cổng, nhà chính, ngã tư). Nghe một lần, làm hết 10 câu, rồi mới mở lời thoại để soát.',
    },
    {
      t: 'listen',
      id: 'd9-nghe-bai-1',
      title: 'Welcome to Greenfield Community Farm',
      dan: { so: 'Day 9, Recording 1', boiCanh: 'a talk given by the volunteer coordinator to a group of new volunteers at a community farm.', cau: [11, 20] },
      note: 'Giọng Anh-Anh, một người nói, khoảng 4 phút. Câu 11–15 ở nửa đầu, câu 16–20 (bản đồ) ở nửa sau, bắt đầu từ câu "Right, now please look at the map…".',
      lines: D9_SCRIPT_1.map((text) => ({ who: 'Helen', voice: 'uk-nu' as const, text })),
    },

    { t: 'h', text: 'Questions 11–15 — Choose the correct letter, A, B or C' },
    {
      t: 'mcq',
      id: 'd9-nghe-chon',
      title: 'Questions 11–15 (Multiple Choice)',
      items: [
        {
          q: '11. Before it became a community farm, the land was',
          options: ['a dairy farm.', 'a rubbish tip.', 'a car park.'],
          correct: 1,
          why: 'Helen nói: "A lot of visitors **assume** that this land was once a **dairy farm**… **In fact**… for almost thirty years, this whole area was a **rubbish tip**." → **B**. A là điều khách **tưởng** (bị "In fact" phủ nhận). C sai vì bãi đỗ xe chỉ là **phần duy nhất đã lát sẵn**, không phải toàn bộ khu đất.',
        },
        {
          q: '12. On their first day, the new volunteers will',
          options: ['plant vegetables.', 'feed the animals.', 'work in the café.'],
          correct: 0,
          why: '"on your first day, you\'ll be out in the **vegetable beds, planting** onions and beans" → **A** (paraphrase: planting onions and beans = plant vegetables). B sai: phải học **hai buổi tập huấn** trước mới được cho ăn. C sai: café do **nhân viên được trả lương** phụ trách.',
        },
        {
          q: '13. Volunteers must bring their own',
          options: ['gloves.', 'lunch.', 'waterproof boots.'],
          correct: 2,
          why: '"The one thing we **can\'t lend** you is footwear, so please make sure you **bring your own waterproof boots**." → **C**. A sai: "we **provide** gloves". B sai: "Lunch is also **free**" — café nấu cho tình nguyện viên.',
        },
        {
          q: '14. For the next few weeks, volunteers who cannot come to a session should contact',
          options: ['the volunteer coordinator.', 'the farm manager.', 'another volunteer.'],
          correct: 1,
          why: '"**Normally** you would contact me, **but** I\'m going to be away… please send a text message directly to the **farm manager**, Tom Hale." → **B**. A là quy định **bình thường** (Helen là volunteer coordinator) nhưng tháng tới cô vắng. C bị cấm rõ: "Please **don\'t** ask another volunteer to pass on the message".',
        },
        {
          q: '15. According to Helen, what do long-term volunteers value most?',
          options: ['seeing children enjoy the farm', 'learning new skills', 'meeting local people'],
          correct: 0,
          why: '"almost all of them say the same thing: what they **value most** is **seeing children** from the city **enjoy the farm**" → **A**. B và C đều được nhắc ("Many of you came to learn new skills…", "Others want to meet people in the area…") nhưng là lý do **người mới đến**, không phải điều người làm lâu **quý nhất**. Đây là bẫy "cả ba đều được nhắc".',
        },
      ],
    },

    { t: 'h', text: 'Questions 16–20 — Label the map' },
    {
      t: 'p',
      text: 'Label the map below. Write the correct letter, **A–H**, next to Questions 16–20. — Ghi chữ cái đúng (A–H) cho mỗi địa điểm. Bản đồ có **8 ô** nhưng chỉ hỏi **5** địa điểm: ba ô còn lại là **ô gây nhiễu** mà Helen vẫn nhắc tới. Phía trên bản đồ là hướng **Bắc**; lối chính chạy dọc từ cổng (dưới) lên nhà chính (trên), lối ngang chạy **Đông – Tây**.',
    },
    {
      t: 'figure',
      fig: {
        kind: 'map',
        title: 'Greenfield Community Farm — ghi chữ cái A–H cho câu 16–20',
        note: 'Bản đồ tự vẽ cho bài luyện. Phía trên là hướng Bắc. Bắt đầu ở Gate (You are here).',
        map: {
          cols: 12,
          rows: 9,
          paths: [
            { x: 5.5, y: 1.6, w: 1, h: 6.5 },
            // Lối ngang tách hai đoạn để nhãn nằm ở nửa phía Tây, không đè lên ngã tư / lối chính.
            { x: 0.3, y: 4.3, w: 5.2, h: 0.9, label: 'east–west path' },
            { x: 6.5, y: 4.3, w: 5.2, h: 0.9 },
          ],
          boxes: [
            { x: 4.5, y: 0.2, w: 3, h: 1.4, label: 'Farmhouse' },
            { x: 9.3, y: 0.3, w: 2.4, h: 1.8, label: 'Pond' },
            { x: 0.3, y: 6.9, w: 3.6, h: 1.8, label: 'Car park' },
            { x: 5, y: 8.1, w: 2, h: 0.8, label: 'Gate' },
            { x: 0.3, y: 2.4, w: 2.4, h: 1.6, blank: 'C' },
            { x: 3, y: 2.4, w: 2.2, h: 1.6, blank: 'D' },
            { x: 6.9, y: 2.4, w: 2.2, h: 1.6, blank: 'E' },
            { x: 9.4, y: 2.4, w: 2.3, h: 1.6, blank: 'F' },
            { x: 2.6, y: 5.5, w: 2.4, h: 1.2, blank: 'A' },
            { x: 6.9, y: 5.5, w: 2.3, h: 1.2, blank: 'B' },
            { x: 9.6, y: 5.5, w: 2.1, h: 1.2, blank: 'G' },
            { x: 6.9, y: 7, w: 2.6, h: 1.2, blank: 'H' },
          ],
          pins: [{ x: 7.3, y: 8.6, label: 'You are here' }],
        },
      },
    },
    {
      t: 'quiz',
      id: 'd9-nghe-ban-do',
      title: 'Questions 16–20 — ghi MỘT chữ cái (A–H)',
      kind: 'fill',
      items: [
        { q: '16. Café ___', answers: ['H'] },
        { q: '17. Tool shed ___', answers: ['A'] },
        { q: '18. Greenhouse ___', answers: ['C'] },
        { q: "19. Children's garden ___", answers: ['E'] },
        { q: '20. Chicken houses ___', answers: ['G'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án 16–20 (di ngón tay theo lời Helen)',
      items: [
        '**16 — H.** "The **first building on your right, just inside the gate**, is the café." Từ cổng nhìn lên phía nhà chính, ô bên phải gần cổng nhất là H. (B cũng ở bên phải nhưng xa cổng hơn.)',
        '**17 — A.** "Just **before the crossroads, on the left-hand side**, is the tool shed." Bẫy: "The building **opposite** it, on the right, **used to be** the tool shed, **but** it\'s now our first-aid room" → B là **phòng sơ cứu**, không phải nhà kho.',
        '**18 — C.** "At the crossroads, **turn left**… You\'ll **pass** a small building **on your right**. That\'s the **seed store**." (= D) "Keep going **all the way to the end of the path**… the large building on your right there is the greenhouse." Đi về phía Tây thì **bên phải là phía Bắc** → ô phía Bắc ở cuối lối là **C**.',
        '**19 — E.** "come back to the crossroads and **carry straight on** up the main path… **Immediately on your right** is the children\'s garden." Ô sát lối chính, phía trên ngã tư, bên phải → **E**. Bẫy: F (sát ao) là **tổ ong** — "Further east, beyond the children\'s garden and right next to the pond, are the beehives".',
        '**20 — G.** "this time **turn right**, heading east. **Walk past the first-aid room** (= B), and **at the very end of the path, on your right**, you\'ll find the chicken houses." Đi về phía Đông thì bên phải là phía Nam → ô cuối lối phía Nam là **G**.',
        'Ba ô gây nhiễu: **B** (phòng sơ cứu — từng là nhà kho), **D** (kho hạt giống), **F** (tổ ong). Bài thật cũng luôn có ô thừa như vậy.',
      ],
    },
    {
      t: 'note',
      title: 'Giải thích thêm Questions 11–15 — vì sao người mới hay sai',
      items: [
        'Câu 11 và 17 dùng cùng một kiểu bẫy **quá khứ / hiện tại**: "was once a dairy farm… In fact…", "used to be the tool shed, but it\'s now…". Hãy gạch dưới **In fact, but, now** trong lời thoại khi soát.',
        'Câu 12 và 13 có **hai phương án bị loại bằng lý do** (an toàn, café có nhân viên; găng tay được phát, bữa trưa miễn phí). Thói quen tốt: khi nghe, gạch chéo phương án nào vừa bị loại.',
        'Câu 14: **Normally… but…** là tín hiệu "quy định thường lệ bị thay đổi" — đáp án luôn nằm **sau "but"**.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'coordinator', pos: 'n', ipa: '/kəʊˈɔːdɪneɪtə(r)/', vi: 'người điều phối', ex: 'The volunteer coordinator gave us a timetable.', exVi: 'Người điều phối tình nguyện viên phát cho chúng tôi thời gian biểu.', more: 'Động từ **coordinate** (điều phối). Cụm: **a project coordinator**.' },
        { w: 'rubbish tip', pos: 'n', ipa: '/ˈrʌbɪʃ tɪp/', vi: 'bãi rác (Anh-Anh); Mỹ: dump / landfill', ex: 'The new park was built on an old rubbish tip.', exVi: 'Công viên mới được xây trên một bãi rác cũ.', more: '**rubbish** (Anh) = **trash / garbage** (Mỹ) — không đếm được.', anh: 'wastebasket' },
        { w: 'council', pos: 'n', ipa: '/ˈkaʊnsl/', vi: 'hội đồng, chính quyền địa phương', ex: 'The council agreed to build a new playground.', exVi: 'Chính quyền địa phương đồng ý xây sân chơi mới.', more: '**the local council / city council**. Đừng nhầm với **counsel** (lời khuyên, cùng cách đọc).' },
        { w: 'campaign', pos: 'v, n', ipa: '/kæmˈpeɪn/', vi: 'vận động (cho một mục đích); chiến dịch', ex: 'Students campaigned to ban plastic bags at school.', exVi: 'Học sinh vận động cấm túi ni-lông ở trường.', more: '**campaign for / against** sth · **a campaign to + V**. Chữ "g" câm: /kæmˈpeɪn/.' },
        { w: 'muddy', pos: 'adj', ipa: '/ˈmʌdi/', vi: 'lầy lội, dính bùn', ex: 'After the rain, the path was too muddy to walk on.', exVi: 'Sau mưa, lối đi lầy lội quá không đi được.', more: 'Gốc **mud** (bùn — không đếm được).' },
        { w: 'in advance', pos: 'phr', ipa: '/ɪn ədˈvɑːns/', vi: 'trước (khi việc xảy ra)', ex: 'Please book your place in advance.', exVi: 'Vui lòng đặt chỗ trước.', more: 'Đứng cuối câu. Gần nghĩa: **beforehand**. ~~in advanced~~ là sai.' },
        { w: 'beehive', pos: 'n', ipa: '/ˈbiːhaɪv/', vi: 'tổ ong (do người nuôi)', ex: 'The farm keeps six beehives for honey.', exVi: 'Nông trại nuôi sáu tổ ong để lấy mật.', anh: 'honeybee' },
        { w: 'pier', pos: 'n', ipa: '/pɪə(r)/', vi: 'cầu tàu (nhô ra biển)', ex: 'We met beside the lighthouse, next to the pier.', exVi: 'Chúng tôi gặp nhau cạnh hải đăng, sát cầu tàu.', more: 'Đọc giống **peer** /pɪə/ — nguyên âm đôi /ɪə/ (Ngày 6).' },
      ],
    },

    { t: 'h', text: '5. Bài luyện 2 — Note Completion (thông báo dọn bãi biển)' },
    {
      t: 'canh',
      anh: ['beach-with-umbrella', 'broom', 'wastebasket'],
      caption: 'Ông **Mark Bell** của Hội đồng thành phố Riverside thông báo về buổi **dọn bãi biển** (beach clean-up) năm nay.',
    },
    {
      t: 'p',
      text: 'Phần 2 cũng hay có dạng **Note Completion**. Đọc ghi chú bên dưới trước, đoán **loại thông tin** (địa điểm? giờ? đồ vật? con số?). Điền **ONE WORD AND/OR A NUMBER** — một từ và/hoặc một số.',
    },
    {
      t: 'table',
      caption: 'Riverside Beach Clean-up — Notes',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Date', 'Saturday (1) ______ June'],
        ['Meeting point', 'beside the old (2) ______, next to the pier'],
        ['Start time', '(3) ______ a.m.'],
        ['Volunteers should bring', 'a reusable water (4) ______'],
        ['Children', 'under (5) ______ must come with an adult'],
        ['Last year', 'volunteers collected (6) ______ kilos of rubbish'],
      ],
    },
    {
      t: 'listen',
      id: 'd9-nghe-bai-2',
      title: 'Riverside Beach Clean-up',
      dan: { so: 'Day 9, Recording 2', boiCanh: 'an announcement about a beach clean-up organised by a local council.', cau: [1, 6] },
      note: 'Giọng Mỹ, khoảng 1 phút. Cẩn thận hai chỗ bẫy: nơi gặp năm ngoái ≠ năm nay, và con số năm ngoái ≠ con số năm nay.',
      lines: D9_SCRIPT_2.map((text) => ({ who: 'Mark', voice: 'us-nam' as const, text })),
    },
    {
      t: 'quiz',
      id: 'd9-nghe-dien',
      title: 'Bài luyện 2 — ONE WORD AND/OR A NUMBER (6 câu)',
      kind: 'fill',
      items: [
        { q: '(1) Date: Saturday ___ June', answers: ['21', '21st', 'twenty-first', 'the twenty-first', 'the 21st', 'twenty first'] },
        { q: '(2) Meeting point: beside the old ___, next to the pier', answers: ['lighthouse'] },
        { q: '(3) Start time: ___ a.m.', answers: ['8.30', '8:30', 'half past eight'] },
        { q: '(4) Volunteers should bring a reusable water ___', answers: ['bottle'] },
        { q: '(5) Children under ___ must come with an adult', answers: ['16', 'sixteen'] },
        { q: '(6) Last year volunteers collected ___ kilos of rubbish', answers: ['320'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án bài luyện 2',
      items: [
        '**(1) 21 / 21st** — "Saturday **the twenty-first** of June". Viết số (21) gọn và an toàn hơn viết chữ; nhớ số thứ tự: twenty-**first**, không phải ~~twenty-one~~.',
        '**(2) lighthouse** — bẫy: "we **won\'t** be meeting in the **car park** like last year… **Instead**, we\'ll meet beside the old **lighthouse**". Lấy thông tin **sau "Instead"**.',
        '**(3) 8.30** — "half past eight in the morning". Viết **8.30** (hoặc 8:30) là đúng giới hạn ONE WORD AND/OR A NUMBER; "midday" là giờ **kết thúc**, không phải giờ bắt đầu.',
        '**(4) bottle** — "please bring a reusable water **bottle**". Không viết ~~bottles~~: phía trước có **a**.',
        '**(5) 16** — "Anyone under **sixteen**… must come with an adult". Cẩn thận /sɪkˈstiːn/ (16, nhấn cuối) khác /ˈsɪksti/ (60, nhấn đầu).',
        '**(6) 320** — "Last year… collected **320** kilos". Bẫy: **500** là mục tiêu **năm nay** ("This year we are hoping to reach 500"). Đọc kỹ chữ **Last year** trong câu hỏi.',
      ],
    },

    { t: 'h', text: '6. Lỗi hay gặp ở Part 2 và cách sửa' },
    {
      t: 'note',
      title: 'Người Việt hay sai ở Part 2',
      items: [
        '**Chọn phương án có từ trùng** với lời nói (dairy farm, tool shed) mà không nghe tiếp câu **In fact / but now**. Cách sửa: chỉ chốt khi người nói đã chuyển sang ý mới.',
        '**Nhầm trái / phải** trên bản đồ vì quên đổi hướng. Cách sửa: luôn **xoay ngón tay theo hướng đang đi**; đi xuống phía Nam thì trái / phải ngược với tờ giấy.',
        '**Mất dấu** khi người nói chuyển sang bản đồ. Cách sửa: trong 30 giây đọc đề, tìm sẵn **điểm bắt đầu** (Gate / You are here) và nghe câu chuyển "**Now please look at the map**".',
        '**Bỏ cả phần sau** vì lỡ một câu. Câu hỏi đi theo thứ tự: lỡ câu 17 thì nghe ngay mốc của câu 18 (**turn left at the crossroads**), đừng cố nhớ lại câu cũ.',
      ],
    },
    {
      t: 'note',
      title: 'Mẹo luyện thêm tại nhà',
      items: [
        'Nghe lại Recording 1, lần này **vẽ bản đồ ra giấy** theo lời Helen mà không nhìn hình — vẽ đúng là bạn đã thật sự hiểu lời chỉ đường.',
        'Tự chỉ đường bằng tiếng Anh từ cổng trường đến lớp học của bạn, dùng ít nhất 5 cụm trong bảng **từ chỉ vị trí** — vừa luyện Listening vừa luyện Speaking.',
        'Mở lời thoại, tô màu mọi chỗ **paraphrase** giữa câu hỏi và bài nói (planting onions and beans ↔ plant vegetables; can\'t lend you footwear ↔ must bring their own boots).',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D9_HOMEWORK: Lesson = {
  id: 'd9-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 9',
  goal: 'Tự kiểm tra Ngày 9: 15 câu chia động từ, 8 câu chọn thì, 6 câu tìm câu đúng, 10 câu dịch dùng từ vựng tình nguyện, và một đoạn viết ngắn kể lại việc tốt bạn từng làm — có đáp án và gia sư chấm.',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay',
      items: [
        '**Bài I (15 câu):** chia động từ — nhìn **dấu hiệu** (now, Look!, every…, yesterday, ago, in 2018, these days) để chọn **hiện tại đơn / hiện tại tiếp diễn / quá khứ đơn**.',
        '**Bài II (8 câu):** chọn thì đúng · **Bài III (6 câu):** tìm câu đúng ngữ pháp trong ba câu.',
        '**Bài IV (10 câu):** dịch Việt → Anh với từ vựng **Tình nguyện**; bấm 💡 để xem từ và cấu trúc.',
        '**Bài V:** viết **120–150 từ** kể lại một lần bạn giúp đỡ ai đó — chuẩn bị cho Speaking Part 2.',
      ],
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Chọn thì trong 3 câu hỏi — dùng cho mọi câu bên dưới',
      steps: [
        { label: 'Việc **đã xong** trong quá khứ?', sub: 'yesterday · last… · … ago · in 2018 · when I was… → **quá khứ đơn** (V2 / V-ed · didn\'t + V · Did…?)' },
        { label: 'Việc **đang diễn ra / tạm thời / đang thay đổi**?', sub: 'now · Look! · at the moment · this week · these days · more and more → **am / is / are + V-ing**' },
        { label: 'Còn lại: **thói quen, sự thật**, hoặc động từ trạng thái', sub: 'every… · usually · always · know / like / want / need → **hiện tại đơn** (V / V-s)' },
        { label: '**Soát dạng**', sub: 'đủ be + -ing? · did + V nguyên mẫu? · V2 bất quy tắc đúng chưa? · ngôi thứ ba thêm -s?' },
      ],
    },
    {
      t: 'p',
      text: '**Bài I:** chia động từ trong ngoặc. Gợi ý nhỏ cho biết **dấu hiệu** cần để ý. Câu phủ định viết đầy đủ hoặc rút gọn đều được.',
    },
    {
      t: 'quiz',
      id: 'd9-bt-chia',
      title: 'I. Chia động từ: hiện tại đơn, hiện tại tiếp diễn hay quá khứ đơn? (15 câu)',
      kind: 'fill',
      items: [
        { q: 'Look! It ___ (rain). Take an umbrella.', hint: 'Look! → đang xảy ra', answers: ['is raining', "'s raining"] },
        { q: 'My grandmother ___ (live) in Nam Dinh. She has never moved.', hint: 'sự thật lâu dài, chủ ngữ số ít', answers: ['lives'] },
        { q: 'I ___ (stay) at my cousin\'s flat this week because mine is being painted.', hint: 'this week → tạm thời', answers: ['am staying', "'m staying"] },
        { q: 'We ___ (plant) 200 trees in the park two weeks ago.', hint: 'two weeks ago', answers: ['planted'] },
        { q: 'She ___ (not / come) to the meeting yesterday.', hint: 'yesterday + phủ định', answers: ["didn't come", 'did not come'] },
        { q: 'Did you ___ (enjoy) the concert last night?', hint: 'sau Did', answers: ['enjoy'] },
        { q: 'Nowadays, more and more people ___ (shop) online.', hint: 'Nowadays + xu hướng đang tăng', answers: ['are shopping', 'shop'] },
        { q: 'The volunteers usually ___ (start) work at 7 a.m.', hint: 'usually → thói quen', answers: ['start'] },
        { q: 'When I was ten, I ___ (break) my leg.', hint: 'When I was ten · bất quy tắc', answers: ['broke'] },
        { q: 'I ___ (not / know) her name. Can you tell me?', hint: 'know = động từ trạng thái', answers: ["don't know", 'do not know'] },
        { q: 'The number of visitors ___ (rise) from 3,000 in 2018 to 4,500 in 2022.', hint: 'năm đã qua · bất quy tắc', answers: ['rose'] },
        { q: 'Right now, my brother ___ (study) in his room, so please be quiet.', hint: 'Right now', answers: ['is studying', "'s studying"] },
        { q: 'Last weekend, our bus ___ (stop) at a small village for lunch.', hint: 'Last weekend · gấp đôi phụ âm', answers: ['stopped'] },
        { q: 'There ___ (be) no electricity in the village at that time.', hint: 'at that time · electricity không đếm được', answers: ['was'] },
        { q: 'He ___ (try) three times before he passed the driving test last year.', hint: 'last year · phụ âm + y', answers: ['tried'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án Bài I',
      items: [
        '(1) **is raining** — "Look!" gọi chú ý tới việc đang xảy ra. (2) **lives** — sự thật lâu dài (has never moved), ngôi thứ ba thêm -s.',
        '(3) **am staying** — "this week" + lý do tạm thời. (4) **planted** — "ago" → quá khứ đơn. (5) **didn\'t come** — có did thì come giữ nguyên mẫu (~~didn\'t came~~).',
        '(6) **enjoy** — câu hỏi đã có **Did**, động từ chính về nguyên mẫu. (7) **are shopping** — Nowadays + xu hướng đang tăng (viết **shop** — hiện tại đơn — không sai, nhưng **are shopping** nhấn được ý "đang thay đổi", hợp Task 2 hơn).',
        '(8) **start** — "usually" + chủ ngữ số nhiều (volunteers) → không -s. (9) **broke** — break → broke (bất quy tắc).',
        '(10) **don\'t know** — know là động từ trạng thái, không dùng ~~am not knowing~~. (11) **rose** — rise → rose; biểu đồ năm đã qua (Task 1).',
        '(12) **is studying** — "Right now". (13) **stopped** — stop: một nguyên âm + một phụ âm → gấp đôi p. (14) **was** — "no electricity" (không đếm được) → was. (15) **tried** — phụ âm + y → ied.',
      ],
    },
    {
      t: 'mcq',
      id: 'd9-bt-chon',
      title: 'II. Chọn thì đúng (8 câu)',
      items: [
        { q: 'I ___ to the radio every morning while I cook breakfast.', options: ['listen', 'am listening', 'listened'], correct: 0, why: '**every morning** = thói quen → hiện tại đơn **listen**. "am listening" chỉ đúng nếu đang nghe ngay lúc nói; "listened" là quá khứ.' },
        { q: 'Be quiet, please! The teacher ___ .', options: ['talks', 'is talking', 'talked'], correct: 1, why: '"Be quiet!" cho biết cô giáo **đang nói ngay lúc này** → **is talking**.' },
        { q: 'She ___ her keys yesterday, so she couldn\'t get into the house.', options: ['loses', 'is losing', 'lost'], correct: 2, why: '**yesterday** → quá khứ đơn; **lose → lost** (bất quy tắc). Vế sau "couldn\'t" cũng là quá khứ.' },
        { q: 'I ___ this song! Who sings it?', options: ['love', 'am loving', 'loved'], correct: 0, why: '**love** là động từ trạng thái → hiện tại đơn **love**, kể cả khi nói về lúc này. "loved" sai vì bạn đang nghe bài hát ngay bây giờ.' },
        { q: 'We ___ in a small flat at the moment, but we are looking for a house.', options: ['live', 'lived', 'are living'], correct: 2, why: '**at the moment** + sắp chuyển nhà → chỗ ở **tạm thời** → **are living**. "live" gợi ý ở lâu dài, mâu thuẫn với "looking for a house".' },
        { q: 'When ___ you start learning English?', options: ['did', 'do', 'were'], correct: 0, why: 'Việc bắt đầu học đã xảy ra trong quá khứ → **did** + start. "were you start" sai vì were không đi với V nguyên mẫu.' },
        { q: 'Electric motorbikes ___ more and more popular these days.', options: ['become', 'are becoming', 'became'], correct: 1, why: '**more and more… these days** = xu hướng đang thay đổi → **are becoming**.' },
        { q: 'In 2015, the charity ___ about 2,000 volunteers.', options: ['has', 'is having', 'had'], correct: 2, why: '**In 2015** = năm đã qua → **had** (have → had). "is having" sai vì have nghĩa "có" là động từ trạng thái.' },
      ],
    },
    {
      t: 'mcq',
      id: 'd9-bt-sua',
      title: 'III. Tìm câu ĐÚNG ngữ pháp (6 câu)',
      items: [
        { q: 'Chọn câu đúng:', options: ['Yesterday I went to the farm.', 'Yesterday I go to the farm.', 'Yesterday I was go to the farm.'], correct: 0, why: 'Có **Yesterday** → quá khứ đơn **went**. Câu 2 quên đổi thì; câu 3 sai vì "was" không đi với V nguyên mẫu.' },
        { q: 'Chọn câu đúng:', options: ["She didn't went to school.", "She didn't go to school.", 'She not went to school.'], correct: 1, why: '**didn\'t + V nguyên mẫu**. Câu 1 chia quá khứ hai lần; câu 3 thiếu trợ động từ did.' },
        { q: 'Chọn câu đúng:', options: ['I am knowing the answer.', 'I knowing the answer.', 'I know the answer.'], correct: 2, why: '**know** là động từ trạng thái → hiện tại đơn. Câu 2 còn thiếu cả "am".' },
        { q: 'Chọn câu đúng:', options: ['Did you see the news?', 'Did you saw the news?', 'Do you saw the news?'], correct: 0, why: '**Did + S + V nguyên mẫu?** → Did you **see**…? Câu 3 trộn "Do" (hiện tại) với "saw" (quá khứ).' },
        { q: 'Chọn câu đúng:', options: ['They working in the garden now.', 'They are work in the garden now.', 'They are working in the garden now.'], correct: 2, why: 'Hiện tại tiếp diễn cần **đủ hai phần: are + working**. Câu 1 thiếu "are"; câu 2 thiếu "-ing".' },
        { q: 'Chọn câu đúng:', options: ['The price rose in 2021.', 'The price rised in 2021.', 'The price is rose in 2021.'], correct: 0, why: '**rise → rose** (bất quy tắc), không ~~rised~~. Câu 3 sai vì thêm "is" vào trước động từ quá khứ.' },
      ],
    },
    {
      t: 'p',
      text: '**Bài IV:** dịch sang tiếng Anh. Bấm 💡 để xem từ vựng và cấu trúc. Chú ý **thì** của từng câu: có "đang / hiện tại / ngày càng" → hiện tại tiếp diễn; có mốc quá khứ → quá khứ đơn; thói quen → hiện tại đơn.',
    },
    {
      t: 'quiz',
      id: 'd9-bt-dich',
      title: 'IV. Dịch sang tiếng Anh — tình nguyện + ba thì (10 câu)',
      kind: 'translate',
      grammar: 'Hiện tại tiếp diễn: S + am / is / are + V-ing (at the moment, nowadays, more and more). Quá khứ đơn: S + V2 / V-ed; câu hỏi Did + S + V? Hiện tại đơn: thói quen (twice a year) và động từ trạng thái (know). the + adj = nhóm người.',
      items: [
        { q: 'Hiện tại tôi đang làm tình nguyện ở một trại cứu hộ động vật.', hint: 'At the moment / Currently, am volunteering, at an animal shelter', answers: ["At the moment I'm volunteering at an animal shelter.", "At the moment, I'm volunteering at an animal shelter.", 'At the moment I am volunteering at an animal shelter.', 'At the moment, I am volunteering at an animal shelter.', "I'm currently volunteering at an animal shelter.", 'I am currently volunteering at an animal shelter.', "I'm volunteering at an animal shelter at the moment.", 'I am volunteering at an animal shelter at the moment.', 'Currently, I am volunteering at an animal shelter.', "Currently, I'm volunteering at an animal shelter.", "I'm volunteering at an animal shelter now.", 'I am volunteering at an animal shelter now.'] },
        { q: 'Hai năm trước, lớp tôi đã quyên tiền cho các nạn nhân lũ lụt.', hint: 'Two years ago, my class, raised money, for flood victims', answers: ['Two years ago, my class raised money for flood victims.', 'Two years ago my class raised money for flood victims.', 'My class raised money for flood victims two years ago.', 'Two years ago, my class raised money for the flood victims.', 'Two years ago my class raised money for the flood victims.', 'My class raised money for the flood victims two years ago.', 'Two years ago, my class raised money for victims of the flood.', 'Two years ago, my class raised money for victims of the floods.'] },
        { q: 'Bạn có tham gia buổi dọn bãi biển hôm Chủ nhật không?', hint: 'Did you take part in (nguyên mẫu), the beach clean-up, on Sunday', answers: ['Did you take part in the beach clean-up on Sunday?', 'Did you take part in the beach clean-up last Sunday?', 'Did you join the beach clean-up on Sunday?', 'Did you join the beach clean-up last Sunday?', 'Did you participate in the beach clean-up on Sunday?', 'Did you take part in the beach cleanup on Sunday?', 'Did you join the beach cleanup on Sunday?'] },
        { q: 'Chúng tôi đã phát nước cho những người chạy.', hint: 'handed out (hand → handed), water, to the runners', answers: ['We handed out water to the runners.', 'We handed water out to the runners.', 'We handed out water to runners.', 'We handed out bottles of water to the runners.'] },
        { q: 'Mẹ tôi hiến máu hai lần một năm.', hint: 'My mother (số ít → donates / gives), blood, twice a year', answers: ['My mother donates blood twice a year.', 'My mum donates blood twice a year.', 'My mom donates blood twice a year.', 'My mother gives blood twice a year.', 'My mum gives blood twice a year.', 'My mom gives blood twice a year.'] },
        { q: 'Cô ấy không biết về tổ chức từ thiện này.', hint: "doesn't know (trạng thái → hiện tại đơn), about this charity", answers: ["She doesn't know about this charity.", 'She does not know about this charity.', "She doesn't know anything about this charity.", "She doesn't know about this charity organisation.", "She doesn't know about this charity organization."] },
        { q: 'Ngày càng nhiều công ty đang khuyến khích nhân viên làm tình nguyện.', hint: 'More and more companies, are encouraging, their employees / staff, to volunteer', answers: ['More and more companies are encouraging their employees to volunteer.', 'More and more companies are encouraging employees to volunteer.', 'More and more companies are encouraging their staff to volunteer.', 'A growing number of companies are encouraging their employees to volunteer.', 'A growing number of companies are encouraging employees to volunteer.', 'An increasing number of companies are encouraging their employees to volunteer.', 'More and more companies are encouraging their workers to volunteer.'] },
        { q: 'Hồi còn đi học, tôi đã chăm sóc một con mèo bị bỏ rơi.', hint: 'When I was at school, looked after / took care of, an abandoned cat', answers: ['When I was at school, I looked after an abandoned cat.', 'When I was at school I looked after an abandoned cat.', 'When I was at school, I took care of an abandoned cat.', 'When I was at school I took care of an abandoned cat.', 'When I was a student, I looked after an abandoned cat.', 'When I was a student, I took care of an abandoned cat.', 'When I was in school, I looked after an abandoned cat.', 'When I was in school, I took care of an abandoned cat.'] },
        { q: 'Công việc đó không lương nhưng rất đáng làm.', hint: 'The work / The job, was, unpaid, but, very rewarding', answers: ['The work was unpaid but very rewarding.', 'The work was unpaid, but very rewarding.', 'The work was unpaid but it was very rewarding.', 'The work was unpaid, but it was very rewarding.', 'The job was unpaid but very rewarding.', 'The job was unpaid, but very rewarding.', 'The job was unpaid but it was very rewarding.', 'The job was unpaid, but it was very rewarding.', 'That work was unpaid but very rewarding.', 'That job was unpaid but very rewarding.', 'That job was unpaid, but it was very rewarding.'] },
        { q: 'Tôi đã nhận ra rằng một hành động nhỏ có thể tạo nên sự khác biệt.', hint: 'realised / realized, that, a small action, can make a difference', answers: ['I realised that a small action can make a difference.', 'I realized that a small action can make a difference.', 'I realised that a small action could make a difference.', 'I realized that a small action could make a difference.', 'I realised a small action can make a difference.', 'I realized a small action can make a difference.', 'I realised a small action could make a difference.', 'I realized a small action could make a difference.'] },
      ],
    },
    {
      t: 'note',
      title: 'Soát lỗi Bài IV',
      items: [
        '(1) **am volunteering** — "hiện tại" đang làm trong giai đoạn này → hiện tại tiếp diễn. **volunteer at** + nơi.',
        '(2) **raised money for** — "Two years ago" → quá khứ đơn; dùng **raise**, không phải ~~rise~~ hay ~~collected money~~ (collect money vẫn hiểu được nhưng raise money là collocation chuẩn).',
        '(3) **Did you take part in…?** — có Did thì **take** nguyên mẫu (~~took~~). Giới từ **in**.',
        '(4) **handed out** — hand → handed (có quy tắc). (5) **donates / gives blood** — thói quen (twice a year) + chủ ngữ số ít → -s.',
        '(6) **doesn\'t know** — know là động từ trạng thái. (7) **are encouraging + O + to V** — xu hướng hiện nay; **encourage sb to do sth**.',
        '(8) **looked after / took care of** — hồi đi học → quá khứ đơn. **abandoned** = bị bỏ rơi.',
        '(9) **was unpaid but very rewarding** — kể lại trải nghiệm đã qua → was. (10) **realised** (Anh) / **realized** (Mỹ) + that + mệnh đề; **make a difference**.',
      ],
    },
    { t: 'h', text: 'Bài V — Viết ngắn: kể một lần bạn giúp đỡ ai đó' },
    {
      t: 'p',
      text: 'Đây là cách luyện Speaking Part 2 hiệu quả cho người mới: **viết ra trước**, sửa cho đúng thì, rồi mới tập nói. Dùng khung 4 bước ở bài ngữ pháp (**Bối cảnh → Chuyện gì xảy ra → Kết quả → Cảm nhận**) và ít nhất **5 từ vựng** của bài Tình nguyện.',
    },
    {
      t: 'essay',
      id: 'd9-bt-viet',
      task: 'Task 2',
      prompt: 'Describe a time when you helped someone or did some volunteer work. Write 120–150 words. You should say: who you helped; when and where it happened; what you did; and explain how you felt about it.',
      minWords: 120,
      tips: [
        'Phần kể dùng **quá khứ đơn** từ đầu đến cuối: I volunteered / helped / gave / felt… Kiểm từng động từ: có **mốc quá khứ** chưa đổi thì không? Có **did + V2** không?',
        'Mở đầu gọn: "I would like to talk about a time when I…" / "Last summer, I…".',
        'Nối chuỗi việc bằng **First, … Then, … After that, … In the end, …**.',
        'Câu cảm nhận: **It was a really rewarding experience** · **I felt proud / useful** · **I realised that even small actions can make a difference**.',
        'Từ vựng gợi ý: volunteer, donate, hand out, look after, the elderly, a food bank, a charity, raise money, give away, take part in.',
        'Viết xong đọc to bài của mình, chú ý đọc rõ đuôi **-ed**: helped /t/, volunteered /d/, donated /ɪd/.',
      ],
    },
  ],
};

export const NGAY_9: Lesson[] = [D9_GRAMMAR, D9_VOCAB, D9_LISTENING, D9_HOMEWORK];
