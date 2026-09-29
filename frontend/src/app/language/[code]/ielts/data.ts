/**
 * Khoá IELTS nền tảng — 15 ngày, mỗi ngày 3 bài.
 *
 * Lộ trình (thứ tự chủ đề) đi theo cuốn sách người dùng đang học: "IELTS 4 kỹ
 * năng cho người bắt đầu từ con số âm – Tập 1". NỘI DUNG thì KHÔNG chép từ
 * sách: mọi lời giảng, ví dụ và bài tập ở đây là viết mới. Sách có bản quyền
 * và trang này công khai — chép nguyên văn lên web là phát hành lại sách của
 * người khác. Ai bổ sung ngày mới: đọc ảnh sách để biết CHỦ ĐỀ, rồi tự viết.
 *
 * Dữ liệu tĩnh, không qua DB: đây là nội dung soạn tay, đổi theo deploy là đủ.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { TRA_CONG_THUC, TRA_TU_VUNG } from './tracuu';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

// Các tệp ngay/ngayN.ts lấy kiểu từ đây — giữ đường import cũ cho chúng.
export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu tại đây ───────────────────────── */

const INTRO: Lesson = {
  id: 'bat-dau',
  kind: 'intro',
  title: 'Bắt đầu tại đây',
  goal: 'Hiểu IELTS là gì, khoá này dạy gì và học mỗi ngày thế nào cho khỏi nản.',
  minutes: 5,
  blocks: [
    { t: 'h', text: 'IELTS là gì?' },
    {
      t: 'p',
      text: '**IELTS** (International English Language Testing System) là bài thi tiếng Anh dùng để du học, định cư và xin việc. Điểm tính theo **band từ 0 đến 9**, bước 0.5. Nhiều trường đại học ở Việt Nam chấp nhận IELTS 5.5–6.5 thay cho môn tiếng Anh; du học thường cần 6.0–7.0.',
    },
    {
      t: 'table',
      head: ['Kỹ năng', 'Thời gian', 'Bạn phải làm gì'],
      rows: [
        ['Listening (Nghe)', '~30 phút', '4 phần, 40 câu. Nghe một lần duy nhất, điền tên, số, chọn đáp án.'],
        ['Reading (Đọc)', '60 phút', '3 bài đọc dài, 40 câu. Tìm thông tin nhanh, không cần hiểu từng chữ.'],
        ['Writing (Viết)', '60 phút', 'Task 1: tả biểu đồ (150 từ). Task 2: viết bài luận nêu ý kiến (250 từ).'],
        ['Speaking (Nói)', '11–14 phút', 'Nói chuyện trực tiếp với giám khảo, 3 phần, từ dễ đến khó.'],
      ],
    },
    { t: 'h', text: 'Mỗi ngày gồm những phần nào?' },
    {
      t: 'p',
      text: 'Khoá đi theo đúng giáo trình **IELTS 4 kỹ năng cho người bắt đầu từ con số âm – Tập 1**: 15 ngày, mỗi ngày 3 bài xen kẽ giữa phần **nền tảng** và phần **kỹ năng**, cuối ngày có **Homework**. Trang web giảng lại bằng lời mới, chi tiết hơn, có âm thanh, đáp án và gia sư AI.',
    },
    {
      t: 'table',
      head: ['Phần', 'Bạn học gì', 'Trong mỗi bài có'],
      rows: [
        ['Basic Grammar (Ngữ pháp cơ bản)', 'Quy tắc dùng động từ, danh từ, tính từ, cấu trúc câu', 'Giải thích + công thức + ví dụ, lỗi hay sai, cách dùng trong bài thi, bài tập'],
        ['Basic Vocabulary (Từ vựng cơ bản)', 'Từ theo chủ đề hay ra thi: mạng xã hội, giáo dục, công việc…', 'Nghĩa, phiên âm, ví dụ song ngữ, cụm động từ, họ từ'],
        ['Listening Skills (Nghe)', 'Nghe chủ động, ghi chép, làm quen nhiều giọng', 'Bài nghe chép, dạng câu hỏi Listening Part 1–4'],
        ['Reading Skills (Đọc)', 'Đọc lướt, đọc tìm ý, hiểu cấu trúc bài đọc', 'Chiến lược từng dạng câu hỏi + bài luyện theo độ khó'],
        ['Writing Skills (Viết)', 'Viết bài hoàn chỉnh: mở bài, thân bài, kết bài', 'Phân tích đề, dàn ý, bài mẫu, AI chấm theo 4 tiêu chí'],
        ['Speaking Skills (Nói)', 'Nói tự tin, diễn đạt rõ ý', 'Mẹo nói, câu hỏi hay gặp theo từng phần thi, luyện ghi âm'],
      ],
    },
    { t: 'h', text: 'Khoá này dạy thế nào?' },
    {
      t: 'p',
      text: 'Khoá có **15 ngày**. Mỗi ngày gồm 3 bài: một bài **nền** (ngữ pháp hoặc từ vựng) và hai bài **kỹ năng** (nghe, đọc, viết hoặc nói). Cuối ngày có bài tập để tự kiểm tra. Mỗi ngày mất khoảng 60–90 phút.',
    },
    {
      t: 'note',
      title: 'Cách học không nản',
      items: [
        'Học **đúng thứ tự**. Ngày sau dùng lại kiến thức ngày trước.',
        'Mỗi từ mới: bấm 🔊 nghe, **đọc to theo 3 lần**, rồi tự đặt một câu của riêng bạn.',
        'Không hiểu chỗ nào thì **hỏi gia sư** ở khung bên cạnh. Bôi đen một đoạn trong bài rồi hỏi, gia sư sẽ giảng đúng chỗ đó.',
        'Làm bài tập **trước** khi xem đáp án. Sai là bình thường, sai rồi sửa mới nhớ lâu.',
        'Bỏ lỡ một ngày cũng không sao. Quay lại học tiếp, đừng học bù hai ngày một lúc.',
      ],
    },
    {
      t: 'p',
      text: 'Không ai sinh ra đã giỏi tiếng Anh. Bắt đầu từ con số 0 thì bài nào, từ nào bạn học được cũng là tiến thêm một bước. **Bạn đã bắt đầu, và đó là phần khó nhất.**',
    },
  ],
};

/* ───────────────────────────── Ngày 1 ───────────────────────────── */

const D1_GRAMMAR: Lesson = {
  id: 'd1-ngu-phap',
  kind: 'grammar',
  title: 'Câu đơn & thì hiện tại đơn',
  goal: 'Viết được câu đơn đúng cấu trúc và dùng thì hiện tại đơn ở cả 3 dạng: khẳng định, phủ định, câu hỏi.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Câu đơn** = một chủ ngữ (S) + một động từ (V), nói trọn một ý. Có **4 mẫu gốc**: S + V · S + V + O · S + V + C · S + V + A.',
        '**Hiện tại đơn** dùng cho ==thói quen, sự thật, lịch trình, ý kiến==.',
        'Chủ ngữ **he / she / it** (hoặc danh từ số ít): động từ thêm **-s/-es**, phủ định & câu hỏi dùng **does / doesn\'t**.',
        'Sau **do / does / don\'t / doesn\'t**: động từ ==luôn về nguyên mẫu==. ~~She doesn\'t likes~~ → She doesn\'t like.',
        'Bài luận Writing Task 2 viết **chủ yếu bằng hiện tại đơn** — 6 kiểu câu mẫu ở mục 3.',
      ],
    },
    { t: 'h', text: '1. Câu đơn là gì?' },
    {
      t: 'p',
      text: '**Câu đơn** (simple sentence) là câu chỉ có **một mệnh đề**: một chủ ngữ đi với một động từ chính, và câu nói trọn một ý. Mọi câu dài trong bài thi đều ghép từ những câu đơn như thế này, nên đây là viên gạch đầu tiên.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + V',
          vi: 'Chủ ngữ + Động từ',
          examples: [
            { en: 'Birds sing.', vi: 'Chim hót.' },
            { en: 'Prices rise.', vi: 'Giá cả tăng.' },
          ],
        },
        {
          formula: 'S + V + O',
          vi: 'Chủ ngữ + Động từ + Tân ngữ (người/vật chịu tác động)',
          examples: [
            { en: 'My sister studies law.', vi: 'Chị tôi học luật.' },
            { en: 'We need more time.', vi: 'Chúng tôi cần thêm thời gian.' },
          ],
        },
        {
          formula: 'S + V + C',
          vi: 'Chủ ngữ + Động từ + Bổ ngữ (nói chủ ngữ là gì, thế nào)',
          examples: [
            { en: 'This course is free.', vi: 'Khoá học này miễn phí.' },
            { en: 'The room looks empty.', vi: 'Căn phòng trông trống trải.' },
          ],
        },
        {
          formula: 'S + V + A',
          vi: 'Chủ ngữ + Động từ + Trạng ngữ (ở đâu, khi nào, thế nào)',
          examples: [
            { en: 'My parents live in Da Nang.', vi: 'Bố mẹ tôi sống ở Đà Nẵng.' },
            { en: 'The bus often arrives late.', vi: 'Xe buýt hay đến muộn.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Quên động từ khi có tính từ: ~~She very busy.~~ → **She is very busy.** Tiếng Việt nói "cô ấy rất bận" không cần "là", tiếng Anh thì bắt buộc có động từ.',
        'Quên chủ ngữ: ~~Is raining.~~ → **It is raining.** Câu tiếng Anh luôn cần chủ ngữ, kể cả khi chỉ là "it".',
        'Nhét "là" vào trước động từ thường: ~~I am like music.~~ → **I like music.** Đã có động từ (like, work, go…) thì **không thêm am/is/are**.',
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhận ra mẫu câu',
      items: [
        'Hỏi động từ **"…cái gì / ai?"** mà có câu trả lời → phần đó là **O** (tân ngữ): She reads **a book**.',
        'Động từ là **be / look / seem / feel / become** và phần sau **nói về chính chủ ngữ** → đó là **C** (bổ ngữ): She seems **happy**.',
        'Phần sau trả lời **ở đâu / khi nào / thế nào** → đó là **A** (trạng ngữ): He works **hard**.',
      ],
    },
    {
      t: 'table',
      caption: 'Phần này sách chưa có — động từ "to be" (am / is / are) ở hiện tại',
      head: ['Chủ ngữ', 'Khẳng định', 'Phủ định', 'Câu hỏi'],
      rows: [
        ['I', 'I **am** tired. (I\'m)', 'I **am not** tired. (I\'m not)', '**Am** I late?'],
        ['he / she / it · danh từ số ít', 'The app **is** free. (it\'s)', 'It **is not** free. (isn\'t)', '**Is** it free?'],
        ['you / we / they · danh từ số nhiều', 'We **are** ready. (we\'re)', 'We **are not** ready. (aren\'t)', '**Are** you ready?'],
      ],
    },
    { t: 'rule', formula: 'S + V (+ O / C / A)', vi: 'Câu nào cũng phải có **chủ ngữ + động từ**. Sau tính từ/danh từ mà chưa có động từ → thêm **am / is / are**.' },
    {
      t: 'quiz',
      id: 'd1-cau-don-dich',
      title: 'Luyện nhanh mục 1 — viết câu đơn (5 câu)',
      kind: 'translate',
      grammar: 'Câu đơn: S + V · S + V + O · S + V + C (be/seem/look + tính từ) · S + V + A. Nhớ thêm am/is/are trước tính từ.',
      items: [
        { q: 'Em bé ngủ. (câu S + V)', hint: 'baby, sleep', answers: ['The baby sleeps.', 'Babies sleep.', 'A baby sleeps.'] },
        { q: 'Tôi dùng Facebook. (S + V + O)', hint: 'use', answers: ['I use Facebook.'] },
        { q: 'Ứng dụng này miễn phí. (S + V + C)', hint: 'app, free', answers: ['This app is free.', 'The app is free.'] },
        { q: 'Bài đăng của cô ấy trông thú vị. (S + V + C)', hint: 'post, look, interesting', answers: ['Her post looks interesting.'] },
        { q: 'Họ sống ở Hà Nội. (S + V + A)', hint: 'live', answers: ['They live in Hanoi.', 'They live in Ha Noi.'] },
      ],
    },

    { t: 'h', text: '2. Thì hiện tại đơn — 3 dạng câu' },
    {
      t: 'table',
      head: ['Dạng câu', 'Cấu trúc', 'Ví dụ'],
      rows: [
        ['Khẳng định', 'S + V(s/es)', 'She **checks** her email every morning. — Cô ấy kiểm tra email mỗi sáng.'],
        ['Phủ định', "S + don't / doesn't + V", "He **doesn't use** Facebook. — Anh ấy không dùng Facebook."],
        ['Câu hỏi Yes/No', 'Do / Does + S + V ?', '**Do** you **watch** videos on YouTube? — Bạn có xem video trên YouTube không?'],
        ['Câu hỏi Wh-', 'Wh- + do / does + S + V ?', 'Where **does** your brother **work**? — Anh bạn làm ở đâu?'],
      ],
    },
    {
      t: 'p',
      text: 'Chủ ngữ là **he / she / it** hoặc một danh từ số ít (my mother, the app...) thì động từ khẳng định thêm **-s/-es**, phủ định và câu hỏi dùng **does**. Các chủ ngữ còn lại (I, you, we, they, danh từ số nhiều) dùng động từ nguyên mẫu và **do**.',
    },
    {
      t: 'note',
      title: 'Ghi nhớ nhanh',
      items: [
        '==I / you / we / they== (và danh từ số nhiều) + **động từ nguyên mẫu** · phủ định & câu hỏi dùng **do / don\'t**',
        '==he / she / it== (và danh từ số ít) + **động từ thêm -s/-es** · phủ định & câu hỏi dùng **does / doesn\'t**',
        'Sau **do / does / don\'t / doesn\'t** → động từ ==luôn về nguyên mẫu== (không thêm -s nữa).',
      ],
    },
    {
      t: 'table',
      caption: 'Quy tắc thêm -s / -es',
      head: ['Động từ kết thúc bằng', 'Cách thêm', 'Ví dụ'],
      rows: [
        ['Phần lớn động từ', '+ s', 'work → works, read → reads'],
        ['-o, -s, -x, -ch, -sh, -z', '+ es', 'go → goes, watch → watches, fix → fixes'],
        ['phụ âm + y', 'bỏ y, + ies', 'study → studies, try → tries'],
        ['nguyên âm + y', '+ s', 'play → plays, enjoy → enjoys'],
        ['have (bất quy tắc)', '→ has', 'She has two phones.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        "Sau **does / doesn't** thì động từ **quay về nguyên mẫu**: ~~He doesn't likes coffee.~~ → **He doesn't like coffee.** ~~Does she works here?~~ → **Does she work here?**",
        '**Động từ chỉ trạng thái** (know, believe, like, love, hate, want, need, understand, own) gần như luôn ở thì đơn, không thêm -ing: ~~I am knowing the answer.~~ → **I know the answer.**',
      ],
    },
    {
      t: 'table',
      caption: 'Đọc đuôi -s thế nào',
      head: ['Âm cuối của động từ', 'Đọc là', 'Ví dụ'],
      rows: [
        ['/p/ /t/ /k/ /f/ /θ/', '/s/', 'works, helps, gets'],
        ['/s/ /z/ /ʃ/ /tʃ/ /dʒ/', '/ɪz/ (thêm một âm tiết)', 'watches, uses, changes'],
        ['Các âm còn lại', '/z/', 'plays, reads, lives'],
      ],
    },
    {
      t: 'table',
      caption: 'Trả lời ngắn câu hỏi Yes/No (phần này sách chưa có) — lặp lại do/does, KHÔNG lặp động từ chính',
      head: ['Câu hỏi', 'Có', 'Không'],
      rows: [
        ['**Do** you use TikTok?', 'Yes, I **do**.', 'No, I **don\'t**.'],
        ['**Does** she post videos?', 'Yes, she **does**.', 'No, she **doesn\'t**.'],
        ['**Do** they follow you?', 'Yes, they **do**.', 'No, they **don\'t**.'],
      ],
    },
    {
      t: 'table',
      caption: 'Dấu hiệu nhận biết thì hiện tại đơn (phần này sách chưa có)',
      head: ['Nhóm', 'Từ hay gặp', 'Vị trí'],
      rows: [
        ['Trạng từ tần suất', '**always** (luôn luôn) · **usually** (thường) · **often** (hay) · **sometimes** (thỉnh thoảng) · **rarely** (hiếm khi) · **never** (không bao giờ)', 'Đứng **trước động từ thường**, **sau be**: She **often** posts. / She is **often** online.'],
        ['Cụm chỉ tần suất', '**every** day / week / morning · **once / twice / three times** a week · **on** Mondays', 'Thường ở **cuối câu**: I check email **every morning**.'],
      ],
    },
    { t: 'rule', formula: "S + V(s/es) · S + don't/doesn't + V · Do/Does + S + V?", vi: '**He / she / it** → thêm **-s** hoặc dùng **does**. Còn lại → nguyên mẫu hoặc **do**. Có does thì động từ trơn.' },
    {
      t: 'quiz',
      id: 'd1-hien-tai-don-dich',
      title: 'Luyện nhanh mục 2 — viết câu hiện tại đơn (6 câu)',
      kind: 'translate',
      grammar: "Khẳng định: S + V(s/es). Phủ định: S + don't/doesn't + V. Câu hỏi: Do/Does + S + V? · Wh- + do/does + S + V?",
      items: [
        { q: 'Cô ấy kiểm tra email mỗi sáng.', hint: 'check, every morning', answers: ['She checks her email every morning.', 'She checks email every morning.', 'She checks her emails every morning.'] },
        { q: 'Anh trai tôi không dùng Instagram.', hint: "doesn't, use", answers: ["My brother doesn't use Instagram.", 'My brother does not use Instagram.'] },
        { q: 'Bạn có xem video trên YouTube không?', hint: 'watch, video', answers: ['Do you watch videos on YouTube?'] },
        { q: 'Mẹ bạn làm việc ở đâu?', hint: 'where, work', answers: ['Where does your mother work?', 'Where does your mom work?'] },
        { q: 'Tôi thường lướt bảng tin trên xe buýt.', hint: 'usually, scroll through, feed', answers: ['I usually scroll through my feed on the bus.', 'I usually scroll through the feed on the bus.'] },
        { q: 'Cô ấy hiếm khi đăng ảnh.', hint: 'rarely, post, photo', answers: ['She rarely posts photos.', 'She rarely posts pictures.'] },
      ],
    },

    { t: 'h', text: '3. Dùng trong IELTS Writing Task 2' },
    {
      t: 'p',
      text: 'Bài luận Task 2 viết **phần lớn ở thì hiện tại đơn**, vì bạn đang bàn về những điều đúng chung, không phải kể chuyện đã qua. Học thuộc 6 kiểu câu dưới đây là đã viết được khung của một bài luận.',
    },
    {
      t: 'note',
      title: 'Mẹo làm bài',
      items: [
        'Mở bài và kết bài gần như luôn ở ==thì hiện tại đơn==: nêu vấn đề, nêu ý kiến, tóm lại.',
        'Mỗi đoạn thân bài theo nhịp **Mở ý chính → Giải thích → Ví dụ**: ba loại câu ở giữa bảng dưới đây.',
        'Giám khảo chấm cả **độ chính xác ngữ pháp**: một lỗi quên -s ở he/she/it lặp lại cả bài có thể kéo điểm xuống rõ rệt.',
      ],
    },
    {
      t: 'table',
      head: ['Mục đích', 'Câu mẫu'],
      rows: [
        ['Nêu sự thật chung', 'Smartphones **connect** people instantly. — Điện thoại thông minh kết nối con người tức thì.'],
        ['Nêu ý kiến', 'I **believe** that online courses **save** students a lot of time. — Tôi tin rằng khoá học trực tuyến giúp sinh viên tiết kiệm nhiều thời gian.'],
        ['Tả thói quen', 'Many teenagers **spend** hours on social media every day. — Nhiều thiếu niên dành hàng giờ cho mạng xã hội mỗi ngày.'],
        ['Mở ý chính', 'Firstly, social media **helps** small businesses reach customers. — Thứ nhất, mạng xã hội giúp doanh nghiệp nhỏ tiếp cận khách hàng.'],
        ['Đưa ví dụ', 'For example, many cafés **advertise** their menus on Instagram. — Ví dụ, nhiều quán cà phê quảng cáo thực đơn trên Instagram.'],
        ['Kết luận', 'In conclusion, social media **brings** more benefits than drawbacks. — Tóm lại, mạng xã hội mang lại nhiều lợi ích hơn tác hại.'],
      ],
    },
    { t: 'rule', formula: 'Firstly, + S + V. · For example, + S + V. · In conclusion, + S + V.', vi: 'Ba câu "khung" của một đoạn thân bài và kết bài Task 2 — đều ở **hiện tại đơn**.' },
    {
      t: 'quiz',
      id: 'd1-task2-dich',
      title: 'Luyện nhanh mục 3 — viết câu kiểu Writing Task 2 (4 câu)',
      kind: 'translate',
      grammar: 'Hiện tại đơn cho sự thật chung / ý kiến. Mở đầu bằng: I believe that… · Firstly, … · For example, … · In conclusion, …',
      items: [
        { q: 'Tôi tin rằng mạng xã hội giúp mọi người giữ liên lạc.', hint: 'believe, help, stay in touch', answers: ['I believe that social media helps people stay in touch.', 'I believe social media helps people stay in touch.', 'I believe that social media helps people to stay in touch.'] },
        { q: 'Thứ nhất, nhiều doanh nghiệp nhỏ quảng cáo trên Facebook.', hint: 'firstly, business, advertise', answers: ['Firstly, many small businesses advertise on Facebook.', 'First, many small businesses advertise on Facebook.'] },
        { q: 'Ví dụ, học sinh xem video để học tiếng Anh.', hint: 'for example, watch, learn', answers: ['For example, students watch videos to learn English.', 'For instance, students watch videos to learn English.'] },
        { q: 'Tóm lại, mạng xã hội mang lại nhiều lợi ích.', hint: 'in conclusion, bring, benefit', answers: ['In conclusion, social media brings many benefits.', 'In conclusion, social media brings a lot of benefits.'] },
      ],
    },
    {
      t: 'quiz',
      id: 'd1-nhanh',
      title: 'Kiểm tra nhanh — chia động từ trong ngoặc',
      kind: 'fill',
      items: [
        { q: 'My father ___ (read) the news on his phone.', answers: ['reads'] },
        { q: 'They ___ (not / like) long videos.', answers: ["don't like", 'do not like'] },
        { q: '___ she use TikTok? (do / does)', answers: ['does'] },
        { q: 'The app ___ (have) a dark mode.', answers: ['has'] },
        { q: 'He ___ (watch) football every weekend.', answers: ['watches'] },
      ],
    },
  ],
};

const D1_VOCAB: Lesson = {
  id: 'd1-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng chủ đề Mạng xã hội',
  goal: 'Nắm 27 từ, 11 cụm động từ và 7 họ từ về mạng xã hội, chủ đề hay gặp ở cả Speaking lẫn Writing.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      items: [
        '**27 từ** về mạng xã hội (sách có 19 từ — trang này đủ 19 từ đó + 8 từ hay gặp khi thi).',
        '**11 cụm động từ** (log in, sign up, scroll through…) — dùng nhiều nhất ở Speaking.',
        '**Họ từ**: một gốc → danh từ / động từ / tính từ / trạng từ (connect → connection → connected).',
        'Học xong bấm **Che nghĩa** rồi **Che từ tiếng Anh** ở đầu mỗi danh sách để tự kiểm tra.',
      ],
    },
    {
      t: 'p',
      text: 'Bấm 🔊 để nghe. Mỗi từ: nghe → đọc to theo → che nghĩa tự nhớ lại → đặt một câu của riêng bạn.',
    },
    { t: 'h', text: '1. 27 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'account', pos: 'n', ipa: '/əˈkaʊnt/', vi: 'tài khoản', ex: 'I opened a second account for my work posts.', exVi: 'Tôi mở tài khoản thứ hai cho các bài đăng công việc.', more: 'Hay đi với: **create / open** an account · **log into** your account · a **fake** account (tài khoản ảo)' },
        { w: 'profile', pos: 'n', ipa: '/ˈprəʊfaɪl/', vi: 'trang cá nhân, hồ sơ', ex: 'Update your profile photo before you apply for jobs.', exVi: 'Hãy đổi ảnh đại diện trước khi đi xin việc.' },
        { w: 'post', pos: 'v, n', ipa: '/pəʊst/', vi: 'đăng; bài đăng', ex: 'She posts a short video every Sunday.', exVi: 'Chủ nhật nào cô ấy cũng đăng một video ngắn.', more: 'Họ từ: post (v, n) · poster (người đăng; áp phích). ~~post on Facebook a photo~~ → **post a photo on Facebook**' },
        { w: 'comment', pos: 'n, v', ipa: '/ˈkɒment/', vi: 'bình luận', ex: 'His comment got more likes than the post itself.', exVi: 'Bình luận của anh ấy được nhiều lượt thích hơn cả bài đăng.', more: 'Đi với giới từ: **comment on** something · **leave / write** a comment' },
        { w: 'share', pos: 'v', ipa: '/ʃeə(r)/', vi: 'chia sẻ', ex: "Please don't share this photo without asking me.", exVi: 'Đừng chia sẻ ảnh này khi chưa hỏi tôi nhé.', more: '**share** something **with** someone: share a link with friends' },
        { w: 'like', pos: 'v, n', ipa: '/laɪk/', vi: 'thích; lượt thích', ex: 'Over two hundred people liked the announcement.', exVi: 'Hơn hai trăm người đã thích thông báo đó.' },
        { w: 'follower', pos: 'n', ipa: '/ˈfɒləʊə(r)/', vi: 'người theo dõi', ex: 'The chef has fifty thousand followers on TikTok.', exVi: 'Đầu bếp đó có năm mươi nghìn người theo dõi trên TikTok.', more: 'Họ từ: **follow** (v) → **follower** (n). Ngược nghĩa: the **following** = những người mình theo dõi' },
        { w: 'tag', pos: 'v', ipa: '/tæɡ/', vi: 'gắn thẻ (tên ai đó)', ex: 'My friend tagged me in a photo from our trip.', exVi: 'Bạn tôi gắn thẻ tôi vào một bức ảnh chuyến đi.' },
        { w: 'upload', pos: 'v', ipa: '/ˌʌpˈləʊd/', vi: 'tải lên', ex: 'It takes a few minutes to upload a long video.', exVi: 'Tải một video dài lên mất vài phút.', more: 'Trái nghĩa: **download** (tải xuống). upload a video **to** YouTube' },
        { w: 'feed', pos: 'n', ipa: '/fiːd/', vi: 'bảng tin', ex: 'My feed is full of football news this week.', exVi: 'Tuần này bảng tin của tôi toàn tin bóng đá.' },
        { w: 'platform', pos: 'n', ipa: '/ˈplætfɔːm/', vi: 'nền tảng', ex: 'Which platform do young people use most?', exVi: 'Giới trẻ dùng nền tảng nào nhiều nhất?', more: 'Ở IELTS hay viết: **social media platforms** (các nền tảng mạng xã hội)' },
        { w: 'content', pos: 'n', ipa: '/ˈkɒntent/', vi: 'nội dung', ex: 'Useful content keeps viewers watching.', exVi: 'Nội dung hữu ích giữ chân người xem.', more: 'Không đếm được khi nói chung: ~~contents videos~~ → **video content**. content creator = người làm nội dung' },
        { w: 'viral', pos: 'adj', ipa: '/ˈvaɪrəl/', vi: 'lan truyền rất nhanh', ex: 'A clip of the singing cat went viral overnight.', exVi: 'Đoạn clip chú mèo hát lan truyền chỉ sau một đêm.', more: 'Hay đi với **go**: **go viral** (lan truyền). Quá khứ: The clip **went** viral.' },
        { w: 'notification', pos: 'n', ipa: '/ˌnəʊtɪfɪˈkeɪʃn/', vi: 'thông báo', ex: 'I mute notifications while I study.', exVi: 'Tôi tắt tiếng thông báo khi học.' },
        { w: 'influencer', pos: 'n', ipa: '/ˈɪnfluənsə(r)/', vi: 'người có sức ảnh hưởng', ex: 'Brands pay influencers to review their products.', exVi: 'Các thương hiệu trả tiền cho người có ảnh hưởng để đánh giá sản phẩm.', more: 'Họ từ: **influence** (n, v) → **influential** (adj). have an influence **on** someone' },
        { w: 'hashtag', pos: 'n', ipa: '/ˈhæʃtæɡ/', vi: 'thẻ bắt đầu bằng dấu #', ex: 'Add a hashtag so more people can find your post.', exVi: 'Thêm hashtag để nhiều người tìm thấy bài của bạn hơn.' },
        { w: 'privacy', pos: 'n', ipa: '/ˈprɪvəsi/', vi: 'quyền riêng tư', ex: 'Check your privacy settings every few months.', exVi: 'Vài tháng hãy kiểm tra cài đặt quyền riêng tư một lần.', more: 'Tính từ: **private** /ˈpraɪvət/ (riêng tư). Hay gặp: privacy **settings**, **protect** your privacy' },
        { w: 'audience', pos: 'n', ipa: '/ˈɔːdiəns/', vi: 'khán giả, người xem', ex: 'Know your audience before you write a caption.', exVi: 'Hiểu người xem của mình trước khi viết chú thích.' },
        { w: 'engage', pos: 'v', ipa: '/ɪnˈɡeɪdʒ/', vi: 'thu hút, tương tác', ex: 'Questions in a caption help engage readers.', exVi: 'Câu hỏi trong chú thích giúp thu hút người đọc tương tác.', more: 'Họ từ: engage (v) → **engagement** (n, mức độ tương tác) → **engaging** (adj, lôi cuốn). engage **with** the audience' },
        { w: 'add', pos: 'v', ipa: '/æd/', vi: 'thêm (bạn, ảnh…)', ex: 'You can add friends by scanning their QR code.', exVi: 'Bạn có thể thêm bạn bằng cách quét mã QR của họ.' },
        { w: 'create', pos: 'v', ipa: '/kriˈeɪt/', vi: 'tạo ra', ex: 'He creates a short tutorial every weekend.', exVi: 'Cuối tuần nào anh ấy cũng tạo một video hướng dẫn ngắn.' },
        { w: 'delete', pos: 'v', ipa: '/dɪˈliːt/', vi: 'xoá', ex: 'I deleted the photo because it was blurry.', exVi: 'Tôi đã xoá bức ảnh vì nó bị mờ.' },
        { w: 'friend', pos: 'n, v', ipa: '/frend/', vi: 'bạn bè; kết bạn', ex: 'She has over a thousand friends on Facebook.', exVi: 'Cô ấy có hơn một nghìn bạn bè trên Facebook.' },
        { w: 'update', pos: 'v, n', ipa: '/ˌʌpˈdeɪt/ (v) · /ˈʌpdeɪt/ (n)', vi: 'cập nhật; bản cập nhật', ex: 'Update the app to get the new features.', exVi: 'Cập nhật ứng dụng để có các tính năng mới.' },
        { w: 'view', pos: 'v, n', ipa: '/vjuː/', vi: 'xem; lượt xem', ex: 'Her cooking video has one million views.', exVi: 'Video nấu ăn của cô ấy có một triệu lượt xem.' },
        { w: 'mention', pos: 'v', ipa: '/ˈmenʃn/', vi: 'nhắc đến, gắn tên (@)', ex: 'Mention the shop in your post so they can see it.', exVi: 'Nhắc tên cửa hàng trong bài để họ thấy được.' },
        { w: 'online', pos: 'adj, adv', ipa: '/ˌɒnˈlaɪn/', vi: 'trực tuyến', ex: 'Many students spend too much time online.', exVi: 'Nhiều sinh viên dành quá nhiều thời gian trên mạng.' },
      ],
    },
    { t: 'h', text: '2. Cụm động từ (phrasal verbs)' },
    {
      t: 'p',
      text: 'Cụm động từ = động từ + một giới từ nhỏ (in, out, up, on, off...), và nghĩa của cả cụm thường khác nghĩa của từng chữ. Người bản xứ dùng chúng liên tục khi nói, nên chúng rất có ích ở phần **Speaking**.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'log in', pos: 'phr v', ipa: '/lɒɡ ɪn/', vi: 'đăng nhập', ex: 'I log in with my phone number.', exVi: 'Tôi đăng nhập bằng số điện thoại.' },
        { w: 'log out', pos: 'phr v', ipa: '/lɒɡ aʊt/', vi: 'đăng xuất', ex: 'Always log out on a library computer.', exVi: 'Luôn đăng xuất khi dùng máy tính ở thư viện.' },
        { w: 'sign up', pos: 'phr v', ipa: '/saɪn ʌp/', vi: 'đăng ký (tạo tài khoản)', ex: 'It only takes a minute to sign up.', exVi: 'Đăng ký chỉ mất một phút.' },
        { w: 'set up', pos: 'phr v', ipa: '/set ʌp/', vi: 'cài đặt, thiết lập', ex: 'My brother set up a page for his bakery.', exVi: 'Anh tôi lập một trang cho tiệm bánh của mình.' },
        { w: 'scroll through', pos: 'phr v', ipa: '/skrəʊl θruː/', vi: 'lướt (màn hình)', ex: 'I scroll through my feed on the bus.', exVi: 'Tôi lướt bảng tin trên xe buýt.' },
        { w: 'turn on', pos: 'phr v', ipa: '/tɜːn ɒn/', vi: 'bật', ex: 'Turn on captions if the audio is unclear.', exVi: 'Bật phụ đề nếu âm thanh không rõ.' },
        { w: 'turn off', pos: 'phr v', ipa: '/tɜːn ɒf/', vi: 'tắt', ex: 'She turns off her phone at dinner.', exVi: 'Cô ấy tắt điện thoại trong bữa tối.' },
        { w: 'check in', pos: 'phr v', ipa: '/tʃek ɪn/', vi: 'check-in, đánh dấu vị trí; làm thủ tục đến', ex: 'We checked in at the new café and tagged our friends.', exVi: 'Chúng tôi check-in ở quán cà phê mới và gắn thẻ bạn bè.' },
        { w: 'post up', pos: 'phr v', ipa: '/pəʊst ʌp/', vi: 'đăng lên', ex: 'I will post up the photos from the party tonight.', exVi: 'Tối nay tôi sẽ đăng ảnh buổi tiệc lên.' },
        { w: 'follow up', pos: 'phr v', ipa: '/ˈfɒləʊ ʌp/', vi: 'theo dõi tiếp, hỏi lại sau', ex: 'The shop followed up on my complaint the next day.', exVi: 'Cửa hàng đã liên hệ lại về khiếu nại của tôi vào hôm sau.' },
        { w: 'keep up with', pos: 'phr v', ipa: '/kiːp ʌp wɪð/', vi: 'theo kịp, cập nhật', ex: 'I follow news pages to keep up with world events.', exVi: 'Tôi theo dõi các trang tin để cập nhật sự kiện thế giới.' },
      ],
    },
    { t: 'h', text: '3. Họ từ (word formation)' },
    {
      t: 'p',
      text: 'Một gốc từ đổi đuôi thành danh từ, động từ, tính từ, trạng từ. Biết cả họ từ thì một từ học được thành bốn, và bạn tránh được lỗi dùng sai từ loại, loại lỗi bị trừ điểm nhiều ở tiêu chí từ vựng.',
    },
    {
      t: 'table',
      head: ['Gốc', 'Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'],
      rows: [
        ['kết nối', 'connection', 'connect', 'connected', '—'],
        ['ảnh hưởng', 'influence', 'influence', 'influential', 'influentially'],
        ['tạo ra', 'creation', 'create', 'creative', 'creatively'],
        ['tương tác', 'interaction', 'interact', 'interactive', 'interactively'],
        ['thông tin', 'information', 'inform', 'informative', 'informatively'],
        ['quảng cáo', 'advertisement', 'advertise', 'advertising (vd: an advertising campaign)', '—'],
        ['giao tiếp', 'communication', 'communicate', 'communicative', 'communicatively'],
      ],
    },
    { t: 'h', text: '4. Cụm từ ăn điểm khi nói và viết' },
    {
      t: 'examples',
      items: [
        { en: 'I spend about two hours a day on social media.', vi: 'Tôi dành khoảng hai tiếng mỗi ngày cho mạng xã hội.' },
        { en: 'It helps me stay in touch with old friends.', vi: 'Nó giúp tôi giữ liên lạc với bạn cũ.' },
        { en: 'Charities use social media to raise awareness of local problems.', vi: 'Các tổ chức từ thiện dùng mạng xã hội để nâng cao nhận thức về vấn đề ở địa phương.' },
        { en: 'Fake news can spread quickly online.', vi: 'Tin giả có thể lan nhanh trên mạng.' },
      ],
    },
  ],
};

const D1_LISTENING: Lesson = {
  id: 'd1-nghe',
  kind: 'listening',
  title: 'Nghe: bảng chữ cái & đánh vần',
  goal: 'Nghe và chép đúng tên riêng, email, mã bưu điện được đánh vần, dạng hay gặp ở Listening Section 1.',
  minutes: 20,
  blocks: [
    {
      t: 'recap',
      items: [
        '26 chữ cái xếp theo **7 nhóm âm** — học theo nhóm nhớ nhanh hơn A→Z.',
        'Cặp dễ nhầm nhất: **E /iː/ – I /aɪ/**, **G /dʒiː/ – J /dʒeɪ/**, **A /eɪ/ – R /ɑː/**.',
        '"**double L**" = LL · "**dot**" = . · "**at**" = @ · "**hyphen**" = - · "**underscore**" = _',
        'Chép tên riêng: **đúng từng chữ, viết hoa chữ đầu** — sai một chữ là mất cả câu.',
      ],
    },
    {
      t: 'p',
      text: 'Ở **Listening Section 1** (một cuộc gọi đặt phòng, đăng ký lớp học...), người nói thường **đánh vần** tên, đường phố, email. Chép sai một chữ cái là mất trọn điểm câu đó, nên đây là điểm dễ lấy nhất nếu luyện kỹ.',
    },
    { t: 'h', text: '1. 26 chữ cái — xếp theo âm để dễ nhớ' },
    {
      t: 'p',
      text: 'Các chữ cái trong cùng một hàng có chung nguyên âm. Bấm vào từng chữ để nghe. Học theo nhóm thì nhớ nhanh hơn học từ A đến Z.',
    },
    {
      t: 'alphabet',
      groups: [
        { sound: '/eɪ/', letters: [{ l: 'A', ipa: '/eɪ/' }, { l: 'H', ipa: '/eɪtʃ/' }, { l: 'J', ipa: '/dʒeɪ/' }, { l: 'K', ipa: '/keɪ/' }] },
        { sound: '/iː/', letters: [{ l: 'B', ipa: '/biː/' }, { l: 'C', ipa: '/siː/' }, { l: 'D', ipa: '/diː/' }, { l: 'E', ipa: '/iː/' }, { l: 'G', ipa: '/dʒiː/' }, { l: 'P', ipa: '/piː/' }, { l: 'T', ipa: '/tiː/' }, { l: 'V', ipa: '/viː/' }] },
        { sound: '/e/', letters: [{ l: 'F', ipa: '/ef/' }, { l: 'L', ipa: '/el/' }, { l: 'M', ipa: '/em/' }, { l: 'N', ipa: '/en/' }, { l: 'S', ipa: '/es/' }, { l: 'X', ipa: '/eks/' }, { l: 'Z', ipa: '/zed/ (Anh) · /ziː/ (Mỹ)' }] },
        { sound: '/aɪ/', letters: [{ l: 'I', ipa: '/aɪ/' }, { l: 'Y', ipa: '/waɪ/' }] },
        { sound: '/əʊ/', letters: [{ l: 'O', ipa: '/əʊ/' }] },
        { sound: '/uː/', letters: [{ l: 'Q', ipa: '/kjuː/' }, { l: 'U', ipa: '/juː/' }, { l: 'W', ipa: '/ˈdʌbl juː/' }] },
        { sound: '/ɑː/', letters: [{ l: 'R', ipa: '/ɑː(r)/' }] },
      ],
    },
    {
      t: 'note',
      title: 'Những cặp người Việt hay nhầm',
      items: [
        '**G** /dʒiː/ và **J** /dʒeɪ/: G vần "i", J vần "ây".',
        '**E** /iː/ và **I** /aɪ/: E đọc như "i" tiếng Việt, I đọc như "ai". Đây là cặp dễ nhầm nhất.',
        '**A** /eɪ/ và **R** /ɑː/: A là "ây", R là "a" kéo dài.',
        '**B** và **V**, **M** và **N**: nghe âm đầu thật kỹ.',
        '"**double L**" nghĩa là hai chữ L liền nhau (LL). "**dot**" là dấu chấm, "**at**" là @, "**hyphen**" là gạch nối, "**underscore**" là gạch dưới.',
      ],
    },
    { t: 'h', text: '2. Luyện nghe chép' },
    {
      t: 'p',
      text: 'Bấm **Nghe** rồi gõ lại đúng những gì được đánh vần. Chưa chắc thì nghe lại, trong phòng thi bạn chỉ được nghe một lần nên hãy tập nghe càng ít lần càng tốt.',
    },
    {
      t: 'note',
      title: 'Danh xưng đi trước tên — nghe được là đoán được người đó',
      items: [
        '**Mr** /ˈmɪstə(r)/: ông, anh (đàn ông, không cần biết đã có vợ chưa).',
        '**Mrs** /ˈmɪsɪz/: bà (phụ nữ đã kết hôn). **Miss** /mɪs/: cô (chưa kết hôn). **Ms** /mɪz/: dùng cho phụ nữ khi không rõ hoặc không muốn nói tình trạng hôn nhân.',
        '**Dr** /ˈdɒktə(r)/: tiến sĩ hoặc bác sĩ.',
        'Trong đề nghe, danh xưng thường đã in sẵn trên phiếu, bạn chỉ phải chép **họ** được đánh vần. Chép **đúng chính tả và viết hoa chữ đầu**.',
      ],
    },
    {
      t: 'dictation',
      id: 'd1-danh-van',
      items: [
        { label: 'Mr ______', spell: 'W, A, L, S, H', answer: 'Walsh' },
        { label: 'Mrs ______', spell: 'P, H, I, double L, I, P, S', answer: 'Phillips' },
        { label: 'Mr ______', spell: 'K, O, V, A, C, S', answer: 'Kovacs' },
        { label: 'Miss ______', spell: 'H, A, Y, E, S', answer: 'Hayes' },
        { label: 'Mr ______', spell: 'G, R, double E, N, W, double O, D', answer: 'Greenwood' },
        { label: 'Mr ______', spell: 'J, A, C, O, B, S', answer: 'Jacobs' },
        { label: '______ (first name)', spell: 'J, E, R, E, M, Y', answer: 'Jeremy' },
        { label: 'Miss ______', spell: 'Q, U, I, N, N', answer: 'Quinn' },
        { label: 'Mr ______', spell: 'V, A, U, G, H, A, N', answer: 'Vaughan' },
        { label: '______ (first name)', spell: 'G, E, M, M, A', answer: 'Gemma' },
        { label: '______ (first name)', spell: 'R, A, J, E, E, V', answer: 'Rajeev' },
        { label: 'Dr ______', spell: 'E, V, A, N, S', answer: 'Evans' },
        { label: 'Miss ______', spell: 'Y, E, U, N, G', answer: 'Yeung' },
        { label: 'Mr ______', spell: 'H, U, G, H, E, S', answer: 'Hughes' },
        { label: 'Miss ______', spell: 'Z, I, E, G, L, E, R', answer: 'Ziegler' },
        { label: 'Mr ______', spell: 'B, R, A, double D, O, C, K', answer: 'Braddock' },
        { label: '______ (first name)', spell: 'I, M, O, G, E, N', answer: 'Imogen' },
        { label: 'Mr ______', spell: 'N, G, U, Y, E, N', answer: 'Nguyen' },
        { label: 'Miss ______', spell: 'A, R, M, S, T, R, O, N, G', answer: 'Armstrong' },
        { label: 'Mr ______', spell: 'X, A, V, I, E, R', answer: 'Xavier' },
      ],
    },
    { t: 'h', text: '3. Nâng cao: địa chỉ, mã bưu điện, email' },
    {
      t: 'p',
      text: 'Phần này sách chưa có nhưng rất hay ra ở Section 1. Bạn làm thêm để quen với số, "dot", "at", và mã bưu điện kiểu Anh.',
    },
    {
      t: 'dictation',
      id: 'd1-danh-van-2',
      title: 'Nghe chép nâng cao: địa chỉ, mã bưu điện, email',
      items: [
        { label: 'Tên đường', spell: 'M, A, R, L, O, W. Marlow Street', answer: 'Marlow Street' },
        { label: 'Mã bưu điện (postcode)', spell: 'C, B, 2, 8, Q, X', answer: 'CB2 8QX' },
        { label: 'Email', spell: 'T, dot, N, G, U, Y, E, N, at, mail, dot, com', answer: 't.nguyen@mail.com' },
        { label: 'Tên khách sạn', spell: 'H, A, Z, E, L, Y. The Hazely Hotel', answer: 'Hazely' },
      ],
    },
  ],
};

const D1_HOMEWORK: Lesson = {
  id: 'd1-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 1',
  goal: 'Tự kiểm tra lại toàn bộ Ngày 1: 22 câu dịch, 10 câu cụm động từ, 10 câu chia động từ — có đáp án và gia sư chấm.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập gồm 3 phần như sách',
      items: [
        '**I. 22 câu dịch** Việt → Anh theo mẫu **S + V + O** — bấm 💡 Gợi ý để xem từ và cấu trúc.',
        '**II. 10 câu** chọn cụm động từ đúng.',
        '**III. 10 câu** chia động từ ở hiện tại đơn — nhớ **-s/-es** với he/she/it.',
      ],
    },
    {
      t: 'quiz',
      id: 'd1-dich',
      title: 'I. Dịch sang tiếng Anh — dùng cấu trúc S + V + O (22 câu)',
      kind: 'translate',
      grammar: 'S + V + O, thì hiện tại đơn. Chủ ngữ he / she / it hoặc danh từ số ít → động từ thêm -s/-es (she opens, he watches). Câu nói về việc đã xảy ra thì dùng quá khứ (opened) cũng đúng.',
      items: [
        { q: "Cô ấy mở một tài khoản mới.", hint: "account", answers: ["She opens a new account.", "She opened a new account."] },
        { q: "Anh ấy thêm một bức ảnh vào album.", hint: "add", answers: ["He adds a photo to the album.", "He adds a picture to the album.", "He added a photo to the album."] },
        { q: "Tôi viết một bình luận dưới video.", hint: "comment", answers: ["I write a comment under the video.", "I write a comment below the video."] },
        { q: "Họ chia sẻ nội dung hữu ích.", hint: "content", answers: ["They share useful content."] },
        { q: "Anh ấy tạo một kênh YouTube.", hint: "create", answers: ["He creates a YouTube channel.", "He created a YouTube channel."] },
        { q: "Cô ấy xoá những bài đăng cũ.", hint: "delete", answers: ["She deletes old posts.", "She deletes her old posts.", "She deleted old posts."] },
        { q: "Câu hỏi hay thu hút người xem.", hint: "engage", answers: ["Good questions engage viewers.", "Good questions engage the audience.", "Interesting questions engage viewers."] },
        { q: "Cửa hàng có mười nghìn người theo dõi.", hint: "follower", answers: ["The shop has ten thousand followers.", "The store has ten thousand followers.", "The shop has 10,000 followers."] },
        { q: "Tôi kết bạn với một người bạn cũ.", hint: "friend", answers: ["I add an old friend.", "I friend an old friend.", "I added an old friend."] },
        { q: "Mọi người thích bức ảnh của cô ấy.", hint: "like", answers: ["Everyone likes her photo.", "People like her photo.", "Everybody likes her photo."] },
        { q: "Anh ấy đăng một bài mỗi sáng.", hint: "post", answers: ["He posts every morning.", "He posts an article every morning.", "He posts a status every morning.", "He writes a post every morning."] },
        { q: "Tôi cập nhật trang cá nhân.", hint: "profile", answers: ["I update my profile."] },
        { q: "Họ chia sẻ đường link.", hint: "share", answers: ["They share the link.", "They share a link."] },
        { q: "Cô ấy gắn thẻ em gái trong ảnh.", hint: "tag", answers: ["She tags her sister in the photo.", "She tags her younger sister in the photo."] },
        { q: "Công ty cập nhật chính sách.", hint: "update", answers: ["The company updates its policy.", "The company updates its policies.", "The company updated its policy."] },
        { q: "Học sinh tải lên bài tập.", hint: "upload", answers: ["The student uploads the homework.", "Students upload their homework.", "The student uploads the assignment.", "Students upload homework."] },
        { q: "Tôi xem tin tức mỗi tối.", hint: "view", answers: ["I view the news every evening.", "I watch the news every evening.", "I read the news every evening."] },
        { q: "Đoạn clip lan truyền rất nhanh.", hint: "viral", answers: ["The clip went viral very quickly.", "The clip goes viral very quickly.", "The clip went viral quickly."] },
        { q: "Anh ấy nhắc đến tên tôi.", hint: "mention", answers: ["He mentions my name.", "He mentioned my name."] },
        { q: "Họ dùng một nền tảng mới.", hint: "platform", answers: ["They use a new platform."] },
        { q: "Nhà hàng quảng cáo món ăn mới.", hint: "advertise", answers: ["The restaurant advertises its new dish.", "The restaurant advertises a new dish.", "The restaurant advertises its new dishes.", "The restaurant advertises new dishes."] },
        { q: "Giáo viên truyền đạt ý tưởng rõ ràng.", hint: "communicate", answers: ["The teacher communicates ideas clearly.", "The teacher communicates the idea clearly.", "Teachers communicate ideas clearly."] },
      ],
    },
    {
      t: 'mcq',
      id: 'd1-cum-dong-tu',
      title: 'II. Chọn cụm động từ đúng (10 câu)',
      items: [
        { q: 'I forgot my password, so I can\'t ___ .', options: ['log in', 'turn off', 'scroll through'], correct: 0, why: 'Không có mật khẩu thì không **đăng nhập** được.' },
        { q: 'You are on a shared computer. Remember to ___ when you finish.', options: ['sign up', 'log out', 'set up'], correct: 1, why: 'Máy dùng chung thì dùng xong phải **đăng xuất**.' },
        { q: 'New users must ___ with an email address first.', options: ['log out', 'turn on', 'sign up'], correct: 2, why: 'Người dùng mới phải **đăng ký** trước.' },
        { q: 'My phone keeps buzzing. I need to ___ notifications.', options: ['turn off', 'follow up', 'log in'], correct: 0, why: 'Điện thoại rung liên tục thì **tắt** thông báo.' },
        { q: 'She ___ her feed while waiting for the bus.', options: ['sets up', 'scrolls through', 'signs up'], correct: 1, why: '**Lướt** bảng tin lúc chờ xe.' },
        { q: 'It took an hour to ___ the new laptop.', options: ['set up', 'log out', 'check in'], correct: 0, why: 'Máy mới phải **cài đặt**.' },
        { q: 'When we arrived at the hotel, we ___ at the front desk.', options: ['posted up', 'checked in', 'turned on'], correct: 1, why: 'Đến khách sạn thì **làm thủ tục nhận phòng** (check in).' },
        { q: 'The customer service team will ___ on your question tomorrow.', options: ['follow up', 'log out', 'scroll through'], correct: 0, why: '**Liên hệ lại, theo dõi tiếp** câu hỏi của bạn.' },
        { q: 'After the trip, she ___ all her photos on Instagram.', options: ['signed up', 'posted up', 'turned off'], correct: 1, why: 'Sau chuyến đi cô ấy **đăng** ảnh lên.' },
        { q: 'The room is dark. Can you ___ the light?', options: ['turn on', 'sign up', 'check in'], correct: 0, why: 'Phòng tối thì **bật** đèn.' },
      ],
    },
    {
      t: 'quiz',
      id: 'd1-chia-dong-tu',
      title: 'III. Chia động từ trong ngoặc ở thì hiện tại đơn (10 câu)',
      kind: 'fill',
      items: [
        { q: 'My cousin ___ (live) in Hue.', answers: ['lives'] },
        { q: 'We ___ (not / have) class on Sundays.', answers: ["don't have", 'do not have'] },
        { q: 'The shop ___ (close) at 9 p.m.', answers: ['closes'] },
        { q: 'He ___ (study) English at night.', answers: ['studies'] },
        { q: 'My grandparents ___ (not / use) smartphones.', answers: ["don't use", 'do not use'] },
        { q: 'She ___ (fix) computers for a living.', answers: ['fixes'] },
        { q: 'Water ___ (boil) at 100 degrees Celsius.', answers: ['boils'] },
        { q: 'The baby ___ (cry) when he is hungry.', answers: ['cries'] },
        { q: 'My friend ___ (not / like) spicy food.', answers: ["doesn't like", 'does not like'] },
        { q: 'Our teacher always ___ (give) us homework.', answers: ['gives'] },
      ],
    },
  ],
};

/* ─────────────────────── Ngày 2 → 15: khung lộ trình ─────────────────────── */

type Stub = [Lesson['kind'], string];
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `d${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 25,
});

const LATER: Stub[][] = [
  [['reading', 'Làm quen IELTS Reading'], ['writing', 'Làm quen IELTS Writing Task 2'], ['speaking', 'Cấu trúc bài thi Speaking']],
  [['grammar', 'Đại từ'], ['vocab', 'Từ vựng: Giáo dục & xã hội'], ['listening', 'Nghe chép chính tả 1']],
  [['reading', 'Dạng Sentence Completion 1'], ['writing', 'Làm quen IELTS Writing Task 1'], ['speaking', 'Trả lời câu hỏi Yes/No']],
  [['grammar', 'Danh từ đếm được & không đếm được'], ['vocab', 'Từ vựng: Làm việc từ xa'], ['listening', 'Nghe chép chính tả 2']],
  [['reading', 'Dạng Flow-chart Completion 1'], ['writing', 'Bài luận nêu ý kiến 1'], ['speaking', 'Câu hỏi Wh-']],
  [['grammar', 'Tính từ & trạng từ'], ['vocab', 'Từ vựng: Làm việc từ xa (tiếp)'], ['listening', 'Listening Part 1']],
  [['reading', 'Dạng Table Completion'], ['writing', 'Bài luận nêu ý kiến 2'], ['speaking', 'Câu hỏi về sở thích']],
  [['grammar', 'Hiện tại tiếp diễn & quá khứ đơn'], ['vocab', 'Từ vựng: Tình nguyện'], ['listening', 'Listening Part 2']],
  [['reading', 'Dạng Matching Features'], ['writing', 'Bài luận nêu ý kiến 3'], ['speaking', 'Câu hỏi về thói quen']],
  [['grammar', 'Kết hợp danh từ – động từ – tính từ'], ['vocab', 'Từ vựng: Biểu đồ theo thời gian 1'], ['listening', 'Listening Part 3']],
  [['reading', 'Dạng True / False / Not Given'], ['writing', 'Biểu đồ theo thời gian 2'], ['speaking', 'Câu hỏi nêu quan điểm']],
  [['grammar', 'Động từ khuyết thiếu'], ['vocab', 'Từ vựng: Học trực tuyến & học truyền thống'], ['listening', 'Listening Part 4']],
  [['reading', 'Dạng Summary Completion (chọn từ trong hộp)'], ['writing', 'Bài luận thảo luận hai mặt'], ['speaking', 'Kể lại trải nghiệm đã qua']],
  [['grammar', 'Câu bị động'], ['vocab', 'Từ vựng: Bản đồ & quy trình'], ['listening', 'Dạng Form Completion']],
];

export const DAYS: Day[] = [
  { n: 1, lessons: [D1_GRAMMAR, D1_VOCAB, D1_LISTENING, D1_HOMEWORK] },
  ...LATER.map((ls, i) => ({ n: i + 2, lessons: MANIFEST[i + 2]?.lessons ?? ls.map((s, j) => stub(i + 2, j + 1, s)) })),
];

export { INTRO };

/** Khoá IELTS — mọi thứ bộ khung dùng chung (components/sach-hoc) cần biết. */
export const IELTS = defineCourse({
  stage: 'sach1',
  storageKey: 'ielts-v2',
  title: 'IELTS 4 kỹ năng · Tập 1',
  backHref: '/language/en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  // Hai mục tra cứu cả khoá (công thức · từ vựng) — hiện dưới "Mở đầu" ở mục lục.
  extras: [TRA_CONG_THUC, TRA_TU_VUNG],
  days: DAYS,
  // Ngày 1 viết thẳng ở trên; Ngày 2+ chỉ có mục lục (ngay/manifest.ts), nội dung tải khi mở.
  manifest: MANIFEST,
  loadDay: loadNgay,
  kindLabel: {},
  kindEn: {
    intro: 'Start Here', grammar: 'Basic Grammar', vocab: 'Basic Vocabulary', listening: 'Listening Skills',
    reading: 'Reading Skills', writing: 'Writing Skills', speaking: 'Speaking Skills', homework: 'Homework',
  },
  kindHue: {},
  voice: 'uk-nu',
  tutor: { name: 'Gia sư IELTS', mon: 'ielts' },
  planContext: 'Trang kế hoạch học IELTS 15 buổi theo sách IELTS 4 kỹ năng cho người bắt đầu từ con số âm – Tập 1.',
});
