/**
 * IELTS Tập 2 — Ngày 20 (chặng 4) — tự soạn 12/11/2026, không chép sách / đề thật.
 *   Bài 1 (vocab)   — Sport, leisure & entertainment [VC16] + play/go/do, win/beat, họ từ, cụm động từ · 🔊 (thêm) /ɔː/ – /ɒ/
 *   Bài 2 (reading) — Yes / No / Not Given: quan điểm tác giả, NO ≠ NOT GIVEN [R15] — 2 bài đọc (thể thao trẻ em · e-sports)
 *   Bài 3 (writing) — Task 1 process diagram trọn bài band 5: bị động + trình tự [W13 W17]
 *   Bài tập         — 42 câu.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T2D20_VOCAB: Lesson = {
  id: "t2d20-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Thể thao, giải trí (Sport, leisure & entertainment)",
  goal: "Dùng đúng 20 từ + 10 cụm động từ / collocation chủ đề thể thao – giải trí và 10 cụm âm nhạc – biểu diễn, chọn đúng play / go / do và win / beat, đổi đúng 5 họ từ — để nói Part 1–3 và viết Task 2 về thể thao, giải trí (LR band 5).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**20 từ chủ đề**: athlete, spectator, tournament, opponent, fitness, leisure, venue, facilities, amateur, sedentary, e-sports…",
        "**play / go / do + môn thể thao**: **play** football · **go** swimming · **do** yoga — người Việt sai chỗ này rất nhiều.",
        "**win** một trận / giải ≠ **beat** một người / một đội: We **won** the match. We **beat** Thailand.",
        "**5 họ từ** (compete → competition → competitive → competitor…) và **10 cụm** (take up, work out, keep fit…).",
        "**Thêm 10 cụm âm nhạc – biểu diễn** (mục 6b): genre of music, live music, a concert venue, give a performance, a sell-out show… — cho Part 1 Music và Part 2 “một buổi diễn”.",
        "Chủ đề thể thao – giải trí ra ở **Part 1** (Do you like sport?), **Part 2** (Describe an activity — Ngày 19), **Task 2** (đầu tư cho thể thao, lương vận động viên, e-sports). Đẩy **LR** (Lexical Resource) lên 5.0: đủ từ để nói **cụ thể**, không lặp “sport is good”.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Nhìn hình — các môn thể thao và hoạt động giải trí" },
    {
      t: "hinh",
      title: "Chạm để nghe · bật Che nghĩa để tự kiểm tra",
      items: [
        { anh: "soccer-ball", w: "football", ro: "/ˈfʊtbɔːl/", vi: "bóng đá" },
        { anh: "badminton", w: "badminton", ro: "/ˈbædmɪntən/", vi: "cầu lông" },
        { anh: "volleyball", w: "volleyball", ro: "/ˈvɒlibɔːl/", vi: "bóng chuyền" },
        { anh: "tennis", w: "tennis", ro: "/ˈtenɪs/", vi: "quần vợt" },
        { anh: "person-swimming", w: "swimming", ro: "/ˈswɪmɪŋ/", vi: "bơi lội" },
        { anh: "person-biking", w: "cycling", ro: "/ˈsaɪklɪŋ/", vi: "đạp xe" },
        { anh: "person-running", w: "jogging", ro: "/ˈdʒɒɡɪŋ/", vi: "chạy bộ nhẹ" },
        { anh: "woman-in-lotus-position", w: "yoga", ro: "/ˈjəʊɡə/", vi: "yoga" },
        { anh: "martial-arts-uniform", w: "karate", ro: "/kəˈrɑːti/", vi: "karate (võ)" },
        { anh: "person-lifting-weights", w: "weightlifting", ro: "/ˈweɪtlɪftɪŋ/", vi: "cử tạ" },
        { anh: "chess-pawn", w: "chess", ro: "/tʃes/", vi: "cờ vua" },
        { anh: "video-game", w: "video games", ro: "/ˈvɪdiəʊ ɡeɪmz/", vi: "trò chơi điện tử" },
        { anh: "stadium", w: "stadium", ro: "/ˈsteɪdiəm/", vi: "sân vận động" },
        { anh: "trophy", w: "trophy", ro: "/ˈtrəʊfi/", vi: "cúp (giải thưởng)" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. play · go · do — ba động từ đi với môn thể thao" },
    {
      t: "sodo",
      kind: "compare",
      title: "Chọn động từ theo LOẠI môn",
      caption: "Mẹo nhanh: có bóng, có vợt hoặc là trò chơi → play; tên môn có đuôi -ing → go; còn lại (tập một mình, võ, thể dục) → do.",
      cols: [
        { title: "**play** + môn có bóng / vợt / trò chơi", anh: "soccer-ball", items: ["play football / tennis / badminton", "play chess / cards", "play video games", "play the guitar (nhạc cụ có **the**)"] },
        { title: "**go** + V-ing (hoạt động di chuyển)", anh: "person-swimming", items: ["go swimming / jogging / cycling", "go hiking / fishing / camping", "go skiing / surfing", "~~go to swim~~ → **go swimming**"] },
        { title: "**do** + tập luyện, võ, thể dục", anh: "woman-in-lotus-position", items: ["do yoga / karate / judo", "do exercise / aerobics", "do gymnastics / athletics", "do sport (Anh-Anh)"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi người Việt rất hay nói",
      items: [
        "~~play yoga~~, ~~play jogging~~, ~~play swimming~~ — tiếng Việt nói “chơi” cho mọi thứ, tiếng Anh thì không. → **do** yoga, **go** jogging, **go** swimming.",
        "~~go to swimming~~ / ~~go to jogging~~ → **go swimming** (không có to). Nhưng **go to the gym**, **go to the pool** (đi tới một NƠI) thì có to.",
        "**win ≠ beat**: ~~We won Thailand 2–0.~~ → We **beat** Thailand 2–0. / We **won** the match 2–0. **win** + trận / giải / huy chương; **beat** + đối thủ.",
      ],
    },
    {
      t: "rule",
      formula: "play + N (bóng, vợt, trò chơi) · go + V-ing (di chuyển) · do + N (tập luyện, võ) · win + match / prize / medal · beat + opponent",
      vi: "Chọn động từ theo loại môn; win đi với trận/giải, beat đi với đối thủ.",
    },
    {
      t: "quiz",
      id: "t2d20-play-go-do",
      title: "Điền play / go / do / win / beat (đúng dạng) — 8 câu",
      kind: "fill",
      items: [
        { q: "My grandmother ___ yoga every morning in the park. (hiện tại)", answers: ["does"], hint: "yoga → do; she → -es" },
        { q: "Let's ___ cycling around the lake this weekend.", answers: ["go"], hint: "cycling (-ing) → go" },
        { q: "Do you ___ any sports at school?", answers: ["play", "do"], hint: "any sports nói chung: play hoặc do (Anh-Anh)" },
        { q: "He ___ chess with his father every Sunday. (hiện tại)", answers: ["plays"], hint: "chess → play" },
        { q: "Last summer we ___ hiking in Sa Pa.", answers: ["went"], hint: "hiking → go; quá khứ" },
        { q: "Vietnam ___ Indonesia 3–1 in the semi-final. (quá khứ)", answers: ["beat"], hint: "+ đối thủ → beat (quá khứ beat)" },
        { q: "Our school ___ the volleyball tournament last year.", answers: ["won"], hint: "+ giải đấu → win (quá khứ won)" },
        { q: "My brother has ___ karate for five years.", answers: ["done"], hint: "karate → do; has + V3" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. 20 từ chủ đề thể thao – giải trí" },
    {
      t: "vocab",
      items: [
        { w: "athlete", pos: "n", ipa: "/ˈæθliːt/", vi: "vận động viên", ex: "Professional athletes train for six or seven hours a day.", exVi: "Vận động viên chuyên nghiệp tập sáu, bảy tiếng mỗi ngày.", more: "Đọc 2 âm tiết **ATH-lete** (~~a-th-lơ-lít~~). Tính từ **athletic** /æθˈletɪk/ (khoẻ, dáng thể thao).", anh: "person-running" },
        { w: "spectator", pos: "n", ipa: "/spekˈteɪtə(r)/", vi: "khán giả (xem thể thao tại sân)", ex: "About 40,000 spectators watched the final at My Dinh Stadium.", exVi: "Khoảng 40.000 khán giả xem trận chung kết ở sân Mỹ Đình.", more: "**spectator** = xem thể thao tại chỗ; **audience** = khán giả buổi biểu diễn / chương trình; **viewer** = người xem TV." },
        { w: "competition", pos: "n", ipa: "/ˌkɒmpəˈtɪʃn/", vi: "cuộc thi; sự cạnh tranh", ex: "Some parents think competition is good for children.", exVi: "Một số phụ huynh nghĩ cạnh tranh là tốt cho trẻ.", more: "**enter / win a competition** · **fierce competition** (cạnh tranh gay gắt)." },
        { w: "tournament", pos: "n", ipa: "/ˈtʊənəmənt/", vi: "giải đấu (nhiều đội, nhiều vòng)", ex: "Our school hosts a badminton tournament every spring.", exVi: "Trường tôi tổ chức một giải cầu lông mỗi mùa xuân.", more: "Cũng đọc /ˈtɔːnəmənt/. **host / take part in a tournament**." },
        { w: "championship", pos: "n", ipa: "/ˈtʃæmpiənʃɪp/", vi: "giải vô địch; chức vô địch", ex: "She won the national swimming championship at sixteen.", exVi: "Cô ấy giành chức vô địch bơi quốc gia năm mười sáu tuổi.", more: "**champion** = nhà vô địch.", anh: "1st-place-medal" },
        { w: "opponent", pos: "n", ipa: "/əˈpəʊnənt/", vi: "đối thủ", ex: "He shook hands with his opponent after the match.", exVi: "Anh ấy bắt tay đối thủ sau trận đấu.", more: "**beat / face an opponent** · **a strong / tough opponent**." },
        { w: "coach", pos: "n / v", ipa: "/kəʊtʃ/", vi: "huấn luyện viên; huấn luyện", ex: "Our coach makes us run five kilometres before every training session.", exVi: "Huấn luyện viên bắt chúng tôi chạy năm cây số trước mỗi buổi tập.", more: "Anh-Anh **coach** còn là xe khách đường dài. **training session** = buổi tập." },
        { w: "fitness", pos: "n", ipa: "/ˈfɪtnəs/", vi: "thể lực, sự khoẻ khoắn", ex: "Swimming improves your fitness without hurting your knees.", exVi: "Bơi cải thiện thể lực mà không hại đầu gối.", more: "**physical fitness** · **fitness centre** · tính từ **fit** (khoẻ): **keep fit**." },
        { w: "physical activity", pos: "n", ipa: "/ˌfɪzɪkl ækˈtɪvəti/", vi: "hoạt động thể chất", ex: "Adults should do at least 150 minutes of physical activity a week.", exVi: "Người lớn nên có ít nhất 150 phút hoạt động thể chất mỗi tuần.", more: "**regular physical activity** — cụm rất hay dùng trong Task 2 về sức khoẻ." },
        { w: "leisure", pos: "n", ipa: "/ˈleʒə(r)/", vi: "thời gian rảnh, sự nghỉ ngơi giải trí", ex: "People in cities have less leisure time than they used to.", exVi: "Người ở thành phố có ít thời gian rảnh hơn trước.", more: "Mỹ đọc /ˈliːʒər/. **leisure time / leisure activities / leisure centre**." },
        { w: "pastime", pos: "n", ipa: "/ˈpɑːstaɪm/", vi: "trò tiêu khiển, thú vui", ex: "Fishing is a popular pastime among retired men in my village.", exVi: "Câu cá là thú vui phổ biến của các ông đã nghỉ hưu ở làng tôi.", more: "Viết **một s** (pas-time). Đồng nghĩa trong bài nói: **hobby**." },
        { w: "entertainment", pos: "n", ipa: "/ˌentəˈteɪnmənt/", vi: "sự giải trí; ngành giải trí", ex: "For many teenagers, social media is the main form of entertainment.", exVi: "Với nhiều thanh thiếu niên, mạng xã hội là hình thức giải trí chính.", more: "Không đếm được: ~~an entertainment~~ → **a form of entertainment**. **the entertainment industry**." },
        { w: "audience", pos: "n", ipa: "/ˈɔːdiəns/", vi: "khán giả (buổi diễn, chương trình)", ex: "The audience stood up and clapped at the end of the concert.", exVi: "Khán giả đứng dậy vỗ tay khi buổi hoà nhạc kết thúc.", more: "Danh từ tập hợp: **a large / small audience** (~~many audiences~~ khi nói một buổi)." },
        { w: "performance", pos: "n", ipa: "/pəˈfɔːməns/", vi: "màn trình diễn; thành tích, phong độ", ex: "The team's performance improved after the new coach arrived.", exVi: "Phong độ của đội tốt lên sau khi huấn luyện viên mới đến.", more: "**a live performance** (biểu diễn trực tiếp) · **performance** của vận động viên = thành tích." },
        { w: "venue", pos: "n", ipa: "/ˈvenjuː/", vi: "địa điểm tổ chức (trận đấu, sự kiện)", ex: "The venue for the final has not been announced yet.", exVi: "Địa điểm tổ chức trận chung kết chưa được công bố." },
        { w: "facilities", pos: "n (pl)", ipa: "/fəˈsɪlətiz/", vi: "cơ sở vật chất, tiện nghi", ex: "Many rural schools lack basic sports facilities.", exVi: "Nhiều trường nông thôn thiếu cơ sở vật chất thể thao cơ bản.", more: "Hay dùng số nhiều: **sports / leisure / public facilities**. Task 2: **invest in facilities**." },
        { w: "amateur", pos: "adj / n", ipa: "/ˈæmətə(r)/", vi: "nghiệp dư; người chơi nghiệp dư", ex: "He plays for an amateur football team at weekends.", exVi: "Cuối tuần anh ấy đá cho một đội bóng nghiệp dư.", more: "Trái nghĩa **professional**." },
        { w: "professional", pos: "adj / n", ipa: "/prəˈfeʃənl/", vi: "chuyên nghiệp; người chuyên nghiệp", ex: "Professional footballers in Europe can earn millions a year.", exVi: "Cầu thủ chuyên nghiệp ở châu Âu có thể kiếm hàng triệu mỗi năm.", more: "**turn professional** = chuyển sang chuyên nghiệp. Trọng âm âm tiết 2: pro-**FES**-sion-al." },
        { w: "sedentary", pos: "adj", ipa: "/ˈsedntri/", vi: "ít vận động (ngồi nhiều)", ex: "Office workers often have a sedentary lifestyle.", exVi: "Nhân viên văn phòng thường có lối sống ít vận động.", more: "**a sedentary lifestyle / job** — cụm “ăn điểm” cho Task 2 sức khoẻ, công nghệ." },
        { w: "e-sports", pos: "n", ipa: "/ˈiː spɔːts/", vi: "thể thao điện tử", ex: "E-sports were included as medal events at the 2022 Asian Games.", exVi: "Thể thao điện tử được đưa vào làm nội dung tranh huy chương tại Á vận hội 2022.", more: "Cũng viết **esports**. Động từ số nhiều hoặc số ít đều gặp; trong bài viết dùng thống nhất.", anh: "video-game" },
      ],
    },
    {
      t: "quiz",
      id: "t2d20-tv-dich",
      title: "Dịch sang tiếng Anh — từ chủ đề (5 câu)",
      kind: "translate",
      grammar: "Dùng đúng từ in trong 💡; để ý play / go / do, win / beat.",
      items: [
        { q: "Nhiều trường học thiếu cơ sở vật chất thể thao.", hint: "Many schools, lack, sports facilities", answers: ["Many schools lack sports facilities.", "Many schools don't have enough sports facilities.", "Many schools do not have enough sports facilities.", "A lot of schools lack sports facilities."] },
        { q: "Hơn 30.000 khán giả đã xem trận chung kết.", hint: "More than 30,000 spectators, watched, the final", answers: ["More than 30,000 spectators watched the final.", "Over 30,000 spectators watched the final.", "More than 30,000 spectators watched the final match.", "Over 30,000 spectators watched the final match.", "More than 30000 spectators watched the final."] },
        { q: "Nhân viên văn phòng thường có lối sống ít vận động.", hint: "Office workers, often have, a sedentary lifestyle", answers: ["Office workers often have a sedentary lifestyle.", "Office workers often lead a sedentary lifestyle.", "Office workers usually have a sedentary lifestyle.", "Office workers usually lead a sedentary lifestyle."] },
        { q: "Đội chúng tôi đã đánh bại một đối thủ rất mạnh.", hint: "Our team, beat, a very strong opponent", answers: ["Our team beat a very strong opponent.", "Our team defeated a very strong opponent.", "We beat a very strong opponent."] },
        { q: "Câu cá là một thú vui phổ biến ở làng tôi.", hint: "Fishing, is a popular pastime, in my village", answers: ["Fishing is a popular pastime in my village.", "Fishing is a common pastime in my village."] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. 10 cụm động từ và collocation hay dùng" },
    {
      t: "vocab",
      items: [
        { w: "take up", pos: "phr v", ipa: "/teɪk ʌp/", vi: "bắt đầu chơi / tập (một môn, một thú vui)", ex: "I took up tennis when I moved to Da Nang.", exVi: "Tôi bắt đầu chơi tennis khi chuyển đến Đà Nẵng.", more: "**take up** + N / V-ing: take up swimming. Quá khứ **took up**." },
        { w: "give up", pos: "phr v", ipa: "/ɡɪv ʌp/", vi: "bỏ (không chơi / tập nữa)", ex: "She gave up ballet because it took too much time.", exVi: "Cô ấy bỏ múa ba lê vì nó tốn quá nhiều thời gian.", more: "**give up** + V-ing / N. Đối lập với take up." },
        { w: "work out", pos: "phr v", ipa: "/wɜːk aʊt/", vi: "tập thể dục (thường ở phòng gym)", ex: "My brother works out at the gym three times a week.", exVi: "Anh tôi tập ở phòng gym ba lần một tuần.", more: "Danh từ **a workout** (một buổi tập). work out còn nghĩa “tìm ra (cách)”." },
        { w: "warm up", pos: "phr v", ipa: "/wɔːm ʌp/", vi: "khởi động", ex: "Always warm up for ten minutes before you run.", exVi: "Luôn khởi động mười phút trước khi chạy.", more: "Danh từ **a warm-up** (có gạch nối)." },
        { w: "keep fit", pos: "phrase", ipa: "/kiːp fɪt/", vi: "giữ cơ thể khoẻ mạnh", ex: "Cycling to work is a cheap way to keep fit.", exVi: "Đạp xe đi làm là cách rẻ để giữ sức khoẻ.", more: "= **stay in shape** /steɪ ɪn ʃeɪp/. ~~keep fitness~~ là sai." },
        { w: "join in", pos: "phr v", ipa: "/dʒɔɪn ɪn/", vi: "tham gia cùng (hoạt động đang diễn ra)", ex: "The children were playing football, so I joined in.", exVi: "Bọn trẻ đang đá bóng nên tôi nhập cuộc.", more: "**join in** (đứng một mình, hoặc + the game / the fun) / **join** + câu lạc bộ, đội (join a club)." },
        { w: "sign up for", pos: "phr v", ipa: "/saɪn ʌp fə(r)/", vi: "đăng ký (khoá học, lớp, giải)", ex: "I've signed up for a swimming course this summer.", exVi: "Tôi đã đăng ký một khoá bơi mùa hè này.", more: "Đồng nghĩa trang trọng: **register for / enrol on** a course." },
        { w: "cheer on", pos: "phr v", ipa: "/tʃɪər ɒn/", vi: "cổ vũ (ai đó)", ex: "Thousands of fans cheered the team on in the rain.", exVi: "Hàng nghìn cổ động viên cổ vũ đội dưới mưa.", more: "**cheer sb on** — tân ngữ đứng giữa." },
        { w: "break a record", pos: "phrase", ipa: "/breɪk ə ˈrekɔːd/", vi: "phá kỷ lục", ex: "She broke the national record for the 100 metres.", exVi: "Cô ấy phá kỷ lục quốc gia nội dung 100 mét.", more: "**set / hold / break a record**. Danh từ **RE**cord nhấn âm đầu; động từ re**CORD** nhấn âm sau (Tập 2 Ngày 11)." },
        { w: "a sense of achievement", pos: "phrase", ipa: "/ə sens əv əˈtʃiːvmənt/", vi: "cảm giác thành tựu", ex: "Finishing my first marathon gave me a real sense of achievement.", exVi: "Chạy xong cuộc marathon đầu tiên cho tôi một cảm giác thành tựu thật sự.", more: "Cụm ăn điểm cho dòng “explain how you felt” ở Part 2." },
      ],
    },
    {
      t: "quiz",
      id: "t2d20-cum-dien",
      title: "Điền cụm đúng (đúng dạng động từ) — 6 câu",
      kind: "fill",
      items: [
        { q: "I ___ jogging last year, and now I run every morning. (bắt đầu)", answers: ["took up"], hint: "take up — quá khứ" },
        { q: "He ___ football after he broke his leg. (bỏ)", answers: ["gave up"], hint: "give up — quá khứ" },
        { q: "You should ___ before you play, or you might get injured. (khởi động)", answers: ["warm up"], hint: "warm up" },
        { q: "Walking to school is an easy way to keep ___.", answers: ["fit"], hint: "keep ___ (giữ khoẻ)" },
        { q: "Have you ___ for the cooking class yet? (đăng ký)", answers: ["signed up"], hint: "sign up for — HTHT" },
        { q: "Winning the competition gave her a great sense of ___.", answers: ["achievement"], hint: "a sense of ___" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Năm họ từ cần đổi được" },
    {
      t: "table",
      caption: "Đề đọc / nghe hay đổi loại từ để paraphrase — biết cả họ thì nhận ra ngay",
      head: ["Động từ", "Danh từ (việc)", "Danh từ (người)", "Tính từ"],
      rows: [
        ["compete /kəmˈpiːt/", "competition", "competitor", "competitive (mang tính cạnh tranh; ham thắng)"],
        ["entertain /ˌentəˈteɪn/", "entertainment", "entertainer", "entertaining (thú vị, mua vui)"],
        ["participate /pɑːˈtɪsɪpeɪt/", "participation", "participant", "participatory (ít dùng)"],
        ["perform /pəˈfɔːm/", "performance", "performer", "—"],
        ["relax /rɪˈlæks/", "relaxation", "—", "relaxing (vật: làm thư giãn) · relaxed (người: thấy thư giãn)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: -ing hay -ed?",
      items: [
        "**relaxing** mô tả **thứ gây ra** cảm giác: Yoga is **relaxing**. — **relaxed** mô tả **người cảm thấy**: I feel **relaxed** after yoga. (Giống bored/boring, interested/interesting — Tập 1.)",
        "**participate in** + N (có in): ~~participate the race~~ → participate **in** the race = **take part in** the race.",
        "**competitive** có hai nghĩa: “cạnh tranh gay gắt” (a competitive market) và “ham thắng” (He's very competitive).",
      ],
    },
    {
      t: "mcq",
      id: "t2d20-ho-tu",
      title: "Chọn dạng từ đúng (6 câu)",
      items: [
        { q: "More than 2,000 ___ took part in the city marathon.", options: ["participants", "participation", "participate", "participatory"], correct: 0, why: "Sau **2,000** cần danh từ đếm được chỉ **người** → **participants**." },
        { q: "The show was so ___ that nobody looked at their phones.", options: ["entertain", "entertaining", "entertained", "entertainer"], correct: 1, why: "Mô tả **chương trình** (vật gây cảm giác) → tính từ -ing: **entertaining**." },
        { q: "Children's sport should not be too ___.", options: ["compete", "competition", "competitive", "competitor"], correct: 2, why: "Sau **too** cần **tính từ** → **competitive**." },
        { q: "I always feel very ___ after a long swim.", options: ["relaxing", "relax", "relaxation", "relaxed"], correct: 3, why: "Mô tả **người cảm thấy** → **relaxed**." },
        { q: "Her ___ in the final was the best of her career.", options: ["perform", "performer", "performance", "performing"], correct: 2, why: "Sau **Her** (tính từ sở hữu) cần danh từ chỉ **việc** → **performance**." },
        { q: "Public parks offer free ___ for people who cannot afford a gym.", options: ["relax", "relaxation", "relaxed", "relaxing"], correct: 1, why: "Sau động từ **offer** cần danh từ → **relaxation**." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bốn câu mẫu “ăn điểm” — dùng lại cho Speaking Part 3 và Task 2" },
    {
      t: "examples",
      items: [
        { en: "Regular physical activity not only keeps people fit but also reduces stress.", vi: "Hoạt động thể chất đều đặn không chỉ giữ cho người ta khoẻ mà còn giảm căng thẳng. (not only… but also)" },
        { en: "Governments should invest more in public sports facilities so that people on low incomes can exercise for free.", vi: "Chính phủ nên đầu tư nhiều hơn vào cơ sở vật chất thể thao công cộng để người thu nhập thấp có thể tập miễn phí. (so that)" },
        { en: "Top professional athletes often earn far more than doctors or teachers, which many people consider unfair.", vi: "Các vận động viên chuyên nghiệp hàng đầu thường kiếm nhiều hơn hẳn bác sĩ hay giáo viên, điều mà nhiều người cho là bất công. (far more than · which = điều này)" },
        { en: "Watching sport on television is a passive form of entertainment and cannot replace actually playing it.", vi: "Xem thể thao trên tivi là một hình thức giải trí thụ động và không thể thay thế việc thật sự chơi nó." },
      ],
    },
    {
      t: "rule",
      formula: "S + not only + V + but also + V. · S + should invest in + N + so that + S + can + V. · …, which many people consider + adj.",
      vi: "Ba khung câu phức ăn điểm cho chủ đề thể thao: liệt kê hai lợi ích, đưa giải pháp có mục đích, bình luận cả mệnh đề trước.",
    },

    /* ── 6b ── */
    { t: "h", text: "6b. Thêm: âm nhạc – biểu diễn (10 cụm cho Part 1 Music và Part 2 “một buổi diễn”)" },
    {
      t: "p",
      text: "Giải trí không chỉ là thể thao. Part 1 rất hay hỏi **Music** (Do you like music? Have you ever been to a concert?), Part 2 có đề **“Describe a performance / an event you enjoyed”** (Ngày 15), Task 2 có đề **chính phủ có nên chi tiền cho nghệ thuật**. Mười cụm dưới đây đủ để bạn nói cụ thể thay vì lặp “music is good”.",
    },
    {
      t: "vocab",
      items: [
        { w: "genre of music", pos: "n phrase", ipa: "/ˈʒɒnrə əv ˈmjuːzɪk/", vi: "thể loại nhạc", ex: "Pop is my favourite genre of music, but I also enjoy jazz.", exVi: "Pop là thể loại nhạc tôi thích nhất, nhưng tôi cũng thích jazz.", more: "Số nhiều **genres**. Đọc /ˈʒɒnrə/ — âm đầu /ʒ/ như trong **usually**. Nói gọn: **a kind / type of music**." },
        { w: "live music", pos: "n phrase", ipa: "/laɪv ˈmjuːzɪk/", vi: "nhạc biểu diễn trực tiếp", ex: "This café has live music every Friday night.", exVi: "Quán cà phê này có nhạc sống mỗi tối thứ Sáu.", more: "**live** (adj) đọc /laɪv/ — khác động từ **live** /lɪv/ (sống). Cũng: a **live** performance, watch a match **live**." },
        { w: "a concert venue", pos: "n phrase", ipa: "/ə ˈkɒnsət ˈvenjuː/", vi: "địa điểm tổ chức hoà nhạc", ex: "The new concert venue can hold about 5,000 people.", exVi: "Địa điểm hoà nhạc mới chứa được khoảng 5.000 người.", more: "**venue** dùng cho mọi sự kiện: a wedding venue, a sports venue (mục 3)." },
        { w: "give a performance", pos: "phrase", ipa: "/ɡɪv ə pəˈfɔːməns/", vi: "biểu diễn (một tiết mục, một buổi)", ex: "The students gave a wonderful performance at the end-of-year party.", exVi: "Các bạn học sinh có một màn biểu diễn tuyệt vời ở buổi tiệc cuối năm.", more: "~~make a performance~~. Cũng nói **put on a show**." },
        { w: "stage a play", pos: "phrase", ipa: "/steɪdʒ ə pleɪ/", vi: "dàn dựng / công diễn một vở kịch", ex: "Our drama club staged a play about life in Hanoi in the 1990s.", exVi: "Câu lạc bộ kịch của chúng tôi dàn dựng một vở kịch về đời sống Hà Nội những năm 1990.", more: "**on stage** = trên sân khấu · **stage fright** = sợ sân khấu." },
        { w: "a sell-out show", pos: "n phrase", ipa: "/ə ˈsel aʊt ʃəʊ/", vi: "buổi diễn bán hết vé", ex: "Her concert in Ho Chi Minh City was a sell-out show.", exVi: "Buổi hoà nhạc của cô ấy ở TP.HCM bán sạch vé.", more: "Động từ: The tickets **sold out** in ten minutes. Tính từ: a **sold-out** concert." },
        { w: "folk songs", pos: "n phrase", ipa: "/fəʊk sɒŋz/", vi: "dân ca", ex: "My grandmother still sings folk songs from her village.", exVi: "Bà tôi vẫn hát những bài dân ca của làng bà.", more: "**traditional music** · **folk music**. Giải thích nhạc Việt: **quan họ, a type of folk song from the north of Vietnam**." },
        { w: "appeal to audiences", pos: "phrase", ipa: "/əˈpiːl tu ˈɔːdiənsɪz/", vi: "thu hút khán giả", ex: "K-pop appeals to young audiences all over Asia.", exVi: "K-pop thu hút khán giả trẻ khắp châu Á.", more: "**appeal to** + người (có to). Danh từ: **wide appeal**. **audience** = khán giả xem diễn; **spectator** = khán giả xem thể thao." },
        { w: "catchy", pos: "adj", ipa: "/ˈkætʃi/", vi: "(giai điệu) dễ nhớ, bắt tai", ex: "The song has a catchy chorus that everyone can sing along to.", exVi: "Bài hát có đoạn điệp khúc bắt tai mà ai cũng hát theo được.", more: "Cụm: **a catchy tune / song** · **sing along (to)** = hát theo." },
        { w: "the atmosphere was electric", pos: "phrase", ipa: "/ði ˈætməsfɪə wəz ɪˈlektrɪk/", vi: "bầu không khí cực kỳ sôi động", ex: "When the band came on stage, the atmosphere was electric.", exVi: "Khi ban nhạc bước lên sân khấu, bầu không khí bùng nổ.", more: "Câu “ăn điểm” cho dòng **explain how you felt** ở Part 2 buổi diễn. Cũng: **a lively / relaxed atmosphere**." },
      ],
    },
    {
      t: "quiz",
      id: "t2d20-am-nhac-dien",
      title: "Âm nhạc – biểu diễn: điền một từ (5 câu)",
      kind: "fill",
      items: [
        { q: "Rock is not really my favourite ___ of music. (thể loại)", answers: ["genre"], hint: "genre of music" },
        { q: "I prefer ___ music to recorded music because you can feel the energy. (trực tiếp)", answers: ["live"], hint: "live /laɪv/ music" },
        { q: "The tickets for the concert sold ___ in less than an hour.", answers: ["out"], hint: "sell out — hết vé" },
        { q: "Traditional music doesn't always appeal ___ teenagers.", answers: ["to"], hint: "appeal to + người" },
        { q: "Our class ___ a short play about environmental problems last year. (dàn dựng, quá khứ)", answers: ["staged", "put on"], hint: "stage a play — quá khứ" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Thêm: phát âm /ɔː/ (sport) và /ɒ/ (spot)" },
    {
      t: "p",
      text: "Rất nhiều từ thể thao chứa nguyên âm dài **/ɔː/**: sp**or**t, b**a**ll, c**our**t, sc**ore**, f**our**, **au**dience, perf**or**mance. Người Việt hay đọc ngắn thành **/ɒ/** (như “o” tiếng Việt) → **sport** nghe thành **spot** (vết bẩn), **court** thành **cot** (giường cũi). Cách sửa: **tròn môi hơn, kéo dài gấp đôi** và không đọc âm /r/ (giọng Anh).",
    },
    {
      t: "phatam",
      id: "t2d20-phat-am",
      title: "Luyện phát âm — /ɔː/ dài và /ɒ/ ngắn",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ba dòng đầu là cặp tối thiểu (khác một âm) — đọc rõ sự khác nhau về ĐỘ DÀI. Các dòng sau đọc trong câu.",
      items: [
        { text: "sport, spot", ipa: "spɔːt spɒt", vi: "/ɔː/ dài · /ɒ/ ngắn" },
        { text: "court, cot", ipa: "kɔːt kɒt", vi: "sân · giường cũi" },
        { text: "caught, cot", ipa: "kɔːt kɒt", vi: "caught đọc y như court (giọng Anh)" },
        { text: "score, four, more", ipa: "skɔː fɔː mɔː", vi: "không đọc /r/ cuối (giọng Anh)" },
        { text: "The audience saw a great performance.", ipa: "ði ɔːdiəns sɔː ə ɡreɪt pəfɔːməns", vi: "audience · saw · performance" },
        { text: "We bought tickets for the football final.", ipa: "wi bɔːt tɪkɪts fə ðə fʊtbɔːl faɪnl", vi: "bought · football" },
        { text: "She scored four points on the court.", ipa: "ʃi skɔːd fɔː pɔɪnts ɒn ðə kɔːt", vi: "scored · four · court · on /ɒ/" },
        { text: "I often talk about sport with my daughter.", ipa: "aɪ ɒfn tɔːk əbaʊt spɔːt wɪð maɪ dɔːtə", vi: "often /ɒ/ · talk, sport, daughter /ɔː/" },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Đọc ─────────────────────────── */

const T2D20_READING: Lesson = {
  id: "t2d20-doc",
  kind: "reading",
  title: "Yes / No / Not Given — quan điểm của tác giả",
  goal: "Làm đúng dạng Yes / No / Not Given: tìm câu nêu QUAN ĐIỂM của tác giả, tách ý kiến của tác giả khỏi ý kiến người khác, phân biệt chặt NO (tác giả nói ngược) với NOT GIVEN (tác giả không nói) — Reading band 5: ≥ 4/6 câu YNNG ở Passage 1–2.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Yes / No / Not Given** hỏi về **quan điểm, nhận định của TÁC GIẢ** (views / claims of the writer) — khác **True / False / Not Given** (Tập 2 Ngày 6) hỏi về **thông tin, sự thật**.",
        "**YES** = tác giả nghĩ như câu đề · **NO** = tác giả nghĩ **ngược lại** (có câu trong bài mâu thuẫn rõ) · **NOT GIVEN** = **không thể biết** tác giả nghĩ gì về điều đó.",
        "Bẫy số 1: bài nêu **ý kiến người khác** (Some people believe… / Critics claim…) — đó KHÔNG phải ý của tác giả. Phải đọc tiếp xem tác giả đồng ý hay phản bác.",
        "Năm bẫy: ý người khác · từ chỉ mức độ (all / most / some) · so sánh mà bài không so sánh · trùng từ khoá khác nghĩa · nên / sẽ (khuyên, dự đoán) khác với “đã / đang”.",
        "Dạng này hay ở **Passage 2–3** (bài nghị luận). Mục tiêu band 5: làm chắc **4/6**, không đổi NO ↔ NOT GIVEN tuỳ hứng.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. YNNG khác TFNG ở đâu?" },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng ba ô trả lời — khác thứ được hỏi",
      caption: "Lời dẫn đề cho biết dạng nào: “Do the following statements agree with the INFORMATION…” → TFNG; “…agree with the VIEWS / CLAIMS of the writer…” → YNNG.",
      cols: [
        {
          title: "**True / False / Not Given**",
          anh: "newspaper",
          items: [
            "Hỏi **thông tin, sự thật** trong bài.",
            "Bài thường là văn **mô tả, giải thích** (khoa học, lịch sử).",
            "Câu đề: “Rabbits arrived in 1859.”",
            "Đáp án: **TRUE / FALSE / NOT GIVEN**.",
          ],
        },
        {
          title: "**Yes / No / Not Given**",
          anh: "speaking-head",
          items: [
            "Hỏi **ý kiến, nhận định** của tác giả.",
            "Bài là văn **nghị luận**: có I believe, should, unfortunately…",
            "Câu đề: “Children's sport should be less competitive.”",
            "Đáp án: **YES / NO / NOT GIVEN** (viết đúng chữ — viết TRUE vào đề YNNG là sai).",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Ba đáp án — định nghĩa chặt (thuộc lòng)",
      head: ["Đáp án", "Nghĩa là", "Trong bài phải có"],
      rows: [
        ["**YES**", "Câu đề **khớp** quan điểm / nhận định của tác giả.", "Một câu của tác giả nói **cùng ý** (thường bằng từ khác — paraphrase)."],
        ["**NO**", "Câu đề **mâu thuẫn** với quan điểm của tác giả.", "Một câu của tác giả nói **ngược lại** — đặt hai câu cạnh nhau thấy “không thể cùng đúng”."],
        ["**NOT GIVEN**", "**Không thể biết** tác giả nghĩ gì về điều này.", "Bài **không nói** — hoặc chỉ nói về **chủ đề** đó mà không cho biết ý của tác giả về **điều câu đề khẳng định**."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: phép thử NO hay NOT GIVEN",
      items: [
        "Hỏi: “Nếu câu đề **đúng**, thì có câu nào **của tác giả** bị thành **sai** không?” — Có → **NO**. Không có câu nào bị ảnh hưởng → **NOT GIVEN**.",
        "Đừng dùng **hiểu biết của bạn** hay **điều hợp lý**: tác giả có thể chưa từng nói điều mà bạn thấy hiển nhiên. Không viết ra = NOT GIVEN.",
        "Câu đề và bài văn **trùng nhiều từ** không có nghĩa là YES — đọc kỹ **động từ, từ phủ định, từ mức độ**.",
        "**Chép đúng chữ của đề.** Đề YNNG ghi **YES / NO / NOT GIVEN**; đề TFNG ghi **TRUE / FALSE / NOT GIVEN**. Ghi lệch bộ (TRUE vào đề YNNG, NO vào đề TFNG) là **mất điểm dù hiểu đúng**. Bản thi giấy: viết **đủ chữ**, đừng viết tắt Y / N / NG hay dấu ✓ ✗.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Dấu hiệu nhận ra QUAN ĐIỂM của tác giả" },
    {
      t: "table",
      caption: "Những từ này báo “đây là ý tác giả” — gạch chân khi đọc",
      head: ["Loại dấu hiệu", "Ví dụ"],
      rows: [
        ["Ngôi thứ nhất", "**I believe / In my view / I would argue / I see no reason why** …"],
        ["Tính từ, trạng từ thái độ", "**unfortunately, sadly, surprisingly, rightly, wrongly, clearly**; it is **a mistake / unfair / essential** to …"],
        ["Động từ khuyên / đánh giá", "schools **should** …; it **would be better** if …; parents **need to** …"],
        ["Mức độ chắc chắn", "**certainly** (rất chắc) · **probably / likely** (khá chắc) · **may / might** (chưa chắc)"],
        ["Ý của NGƯỜI KHÁC (không phải tác giả)", "**Some people / Critics / Supporters argue / claim / believe** that … · **It is often said that** …"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Critics claim that e-sports are not real sport. I disagree.", vi: "→ Tác giả nghĩ e-sports **là** thể thao thật. Câu đề “E-sports are not real sport.” = **NO** (không phải YES dù trùng từ — vì đó là ý của “critics”)." },
        { en: "Critics claim that e-sports are not real sport. This view is understandable.", vi: "→ “understandable” = có thể hiểu được, KHÔNG có nghĩa là đồng ý. Câu đề “E-sports are not real sport.” = **NOT GIVEN**." },
        { en: "Critics claim that e-sports are not real sport, and they are right.", vi: "→ Tác giả đồng ý. Câu đề “E-sports are not real sport.” = **YES**." },
      ],
    },
    {
      t: "rule",
      formula: "Ý người khác (Some people / Critics + claim / argue …) → đọc tiếp câu sau → tác giả đồng ý (YES) · phản bác (NO) · không bày tỏ (NOT GIVEN)",
      vi: "Bẫy số 1 của YNNG: đừng lấy ý người khác làm ý tác giả.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Năm bẫy cơ bản của Yes / No / Not Given" },
    {
      t: "table",
      caption: "Mỗi bẫy kèm ví dụ — câu trong bài ↔ câu đề ↔ đáp án",
      head: ["Bẫy", "Bài viết", "Câu đề", "Đáp án"],
      rows: [
        ["1. Ý người khác", "Many parents believe competition builds character, but I think this is wrong for young children.", "Competition builds character in young children.", "**NO**"],
        ["2. Từ mức độ", "Some teenagers enjoy league tables, but others find them stressful.", "**All** teenagers enjoy league tables.", "**NO** (bài nói rõ có người **không** thích → all là sai). Nếu bài chỉ viết “Some teenagers enjoy…” rồi dừng thì khó kết luận — hãy tìm câu nói về **phần còn lại**."],
        ["3. So sánh bài không làm", "Swimming is a good way to keep fit.", "Swimming is **better than** running for fitness.", "**NOT GIVEN** (bài không so với running)"],
        ["4. Trùng từ, khác nghĩa", "Gamers train for long hours, but **this is not the same as** physical effort.", "Gamers make a great physical effort.", "**NO**"],
        ["5. Nên / sẽ ≠ đã / đang", "Schools **should** offer more sports clubs.", "Schools **offer** many sports clubs.", "**NOT GIVEN** (tác giả khuyên, không nói hiện tại có bao nhiêu)"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Quy trình 5 bước cho mỗi câu YNNG",
      caption: "Câu hỏi YNNG đi THEO THỨ TỰ bài đọc — câu 3 nằm sau câu 2. Một câu không tìm thấy thì thường là NOT GIVEN; đừng ngồi quá 90 giây.",
      steps: [
        { label: "1 · Gạch từ khoá câu đề", sub: "Tên riêng, số, danh từ chính — dễ dò; cộng các từ “nguy hiểm”: all / only / should / more than / not." },
        { label: "2 · Dò vị trí trong bài", sub: "Tìm từ khoá hoặc từ đồng nghĩa; đọc kỹ 2–3 câu quanh đó." },
        { label: "3 · Đây là ý AI?", sub: "Tác giả hay người khác? Có câu tiếp theo cho biết tác giả đồng ý / phản bác không?" },
        { label: "4 · So từng phần", sub: "Chủ ngữ · động từ · mức độ · so sánh · thời gian — khớp hết → YES; một phần ngược → NO; một phần không có → NOT GIVEN." },
        { label: "5 · Phép thử NO / NG", sub: "Câu đề đúng thì có câu nào của tác giả bị sai không? Có → NO. Không → NOT GIVEN." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Practice 1 — Questions 1–6 (bài ngắn, có lời giải từng câu)" },
    {
      t: "passage",
      title: "Should children's sport be about winning?",
      intro: "Bài nghị luận ngắn (khoảng 260 từ). Đọc trong 6 phút, gạch chân mọi câu có ý của tác giả.",
      paras: [
        { label: "A", text: "Every weekend, thousands of parents stand at the side of football pitches shouting instructions at their children. Many of them believe that competition teaches young people to work hard and to cope with failure. I understand this view, but I think it is mistaken when it comes to children under the age of ten." },
        { label: "B", text: "Young children do not play sport to win; they play because it is fun. Studies by sports scientists show that the most common reason children give for quitting a sport is that it has stopped being enjoyable. When adults focus on results, the least skilled players spend most of the game on the bench, and these are exactly the children who need exercise most." },
        { label: "C", text: "This does not mean that competition is always harmful. Teenagers, in my experience, often enjoy the challenge of a league table, and a well-organised competition can motivate them to train harder. The problem is not competition itself but the age at which serious competition begins." },
        { label: "D", text: "Some countries have already changed their rules, and in several of them, results are not officially recorded for children's games until the age of twelve or thirteen. Critics claim that this will produce weaker national teams, but I see no evidence for this. Several of those countries continue to win international medals." },
        { label: "E", text: "Parents also have a part to play. Instead of asking 'Did you win?' after every match, they should ask 'Did you enjoy it?' The answer to the second question, far more than the first, will decide whether their child is still playing sport at the age of twenty." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–6.** Do the following statements agree with the views of the writer? Choose **YES** if the statement agrees with the views of the writer, **NO** if the statement contradicts the views of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
    },
    {
      t: "mcq",
      id: "t2d20-doc-p1",
      title: "Questions 1–6",
      items: [
        { q: "(1) Competition helps children under ten learn to deal with failure.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: “**Many of them believe** that competition teaches young people… to cope with failure. **I understand this view, but I think it is mistaken** when it comes to children **under the age of ten**.” Tác giả **phản bác** ý của phụ huynh đúng cho nhóm dưới 10 tuổi → **NO**. Bẫy 1 (ý người khác)." },
        { q: "(2) Children are more likely to quit a sport if their parents watch every game.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn B nói lý do bỏ môn phổ biến nhất là “**stopped being enjoyable**”. Bài **không nói** gì về việc bố mẹ xem mọi trận → **NOT GIVEN**. Đừng suy luận “phụ huynh la hét ở đoạn A → trẻ bỏ”." },
        { q: "(3) Competition can have a positive effect on teenagers.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn C: “Teenagers, **in my experience**, often enjoy the challenge of a league table, and a well-organised competition **can motivate them to train harder**.” → ý tác giả, cùng nghĩa → **YES**." },
        { q: "(4) Countries that do not record children's results spend more money on youth sport.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn D nói một số nước **không ghi kết quả chính thức** tới 12–13 tuổi; **không** nói gì về **tiền đầu tư** cho thể thao trẻ → **NOT GIVEN**. Bẫy 4: trùng từ (countries, results) mà ý mới không có trong bài." },
        { q: "(5) Recording results only for older children will make national teams weaker.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn D: “**Critics claim** that this will produce weaker national teams, **but I see no evidence for this**.” Tác giả bác bỏ → **NO**. (Lại là bẫy “ý người khác”.)" },
        { q: "(6) Parents should pay more attention to whether their children enjoy sport than to the results.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn E: “Instead of asking ‘Did you win?’… they **should** ask ‘Did you enjoy it?’ The answer to the second question, **far more than the first**, will decide…” → **YES**." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại Practice 1 — ba câu NO / NOT GIVEN dễ nhầm",
      items: [
        "Câu 1 và câu 5 đều là **NO** vì bài có câu **ý người khác + tác giả bác bỏ** (but I think it is mistaken / but I see no evidence). Nếu tác giả chỉ ghi “Critics claim…” rồi im lặng → sẽ là **NOT GIVEN**.",
        "Câu 2 và câu 4 là **NOT GIVEN** dù câu đề “nghe hợp lý”: bài không có thông tin nối **bố mẹ xem trận ↔ trẻ bỏ môn**, hay **không ghi kết quả ↔ tiền đầu tư**.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Practice 2 — Questions 7–14 (bài dài, dạng Passage 2)" },
    {
      t: "canh",
      anh: ["video-game", "stadium", "trophy", "person-running"],
      caption: "Một bài bình luận trên báo: thể thao điện tử đã có huy chương ở các đại hội thể thao châu lục — nhưng game thủ có phải là vận động viên?",
    },
    {
      t: "passage",
      title: "Are e-sports really sport?",
      intro: "Bài nghị luận khoảng 570 từ. Thời gian gợi ý: 15 phút cho bài và 8 câu hỏi.",
      paras: [
        { label: "A", text: "When e-sports appeared as medal events at the 2022 Asian Games, many sports fans were shocked. Competitive video gaming is no longer a hobby for a few teenagers in their bedrooms. Major tournaments are now watched online by millions of people, and the prize money at the biggest events is larger than at many traditional sporting competitions. In Vietnam, too, e-sports have been included in the Southeast Asian Games, and some young players have become national celebrities. Yet the question remains: is playing video games, however well, really a sport?" },
        { label: "B", text: "Supporters of e-sports argue that professional gamers are athletes in every important sense. Top players need extremely fast reactions, and they often practise for eight to ten hours a day. They also have to work as a team and plan complex strategies under great pressure. Their training is organised by coaches, and some teams even employ nutritionists and psychologists, just like football clubs. I accept that the best players are highly skilled, and anyone who believes that gaming requires no talent has probably never watched a professional match." },
        { label: "C", text: "However, skill alone does not make an activity a sport. In my view, the word 'sport' implies physical effort: running, jumping, throwing, lifting. A professional gamer may be tired after a long match, but he or she has hardly moved from a chair. Some people point out that chess is officially recognised as a sport in many countries. That may be true, but few people would describe a chess champion as an athlete, and I see no reason why a gamer should be described in that way either. It is sometimes pointed out that shooting and sailing involve little running, yet both are Olympic sports. This is a fair point, but in both cases the competitor still has to control a real object in the real world, not a character on a screen." },
        { label: "D", text: "There is also the question of health. A sport that keeps young people sitting in front of a screen for most of the day is a strange thing to celebrate. Doctors have already warned about eye strain, back pain and poor sleep among young gamers. Teenagers who dream of becoming professional gamers should know that only a tiny number of players ever reach the top, and that careers are usually short: many players retire in their mid-twenties because their reactions start to slow down. Young people who give up their studies to follow this dream are taking a serious risk." },
        { label: "E", text: "None of this means that e-sports are worthless. On the contrary, I believe they can teach valuable lessons about teamwork and communication, and some schools have successfully used gaming clubs to involve students who show no interest in traditional sport and give shy students a place where they feel they belong. For a small number of young people, an interest in gaming has also become a route into well-paid careers in software design and technology. It would therefore be a mistake to ban video games from schools." },
        { label: "F", text: "So where does this leave us? E-sports deserve their own competitions, their own fans and their own prizes, and they should be respected as a serious form of competition. What they should not do is replace physical activity in young people's lives. Whether they are called 'sport' or not matters far less than making sure that every teenager who plays them also spends time running, swimming or simply walking outside." },
      ],
    },
    {
      t: "p",
      text: "**Questions 7–14.** Do the following statements agree with the views of the writer? Choose **YES**, **NO** or **NOT GIVEN**.",
    },
    {
      t: "mcq",
      id: "t2d20-doc-p2",
      title: "Questions 7–14",
      items: [
        { q: "(7) E-sports tournaments attract more viewers than football matches.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn A chỉ nói “watched online by **millions**” và so **prize money** (tiền thưởng) với các giải truyền thống. Không có so sánh **số người xem** với bóng đá → **NOT GIVEN**. Bẫy 3 (so sánh bài không làm)." },
        { q: "(8) Professional gamers need a high level of skill.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “**I accept that** the best players are **highly skilled**” — ý tác giả (I accept) → **YES**. Lưu ý: câu trước (fast reactions, eight to ten hours…) là ý của **supporters**, nhưng câu “I accept…” xác nhận tác giả đồng ý về kỹ năng." },
        { q: "(9) People who say gaming needs no talent usually know a lot about professional e-sports.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “anyone who believes that gaming requires no talent **has probably never watched a professional match**” → tác giả nghĩ họ **không** biết gì về e-sports chuyên nghiệp → **NO**." },
        { q: "(10) Professional gamers should be described as athletes.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: “**I see no reason why a gamer should be described** in that way [as an athlete] either.” → **NO**. Bẫy: đoạn B — “Supporters… argue that professional gamers are athletes” là ý **người ủng hộ**." },
        { q: "(11) Chess players train for as many hours as professional gamers.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nhắc cờ vua được công nhận là thể thao ở nhiều nước và ít ai gọi kỳ thủ là athlete; bài **không** so sánh **số giờ tập** của kỳ thủ với game thủ → **NOT GIVEN** (bẫy 3: so sánh bài không làm). Đừng tự suy ra từ “eight to ten hours a day” ở đoạn B." },
        { q: "(12) Young people who leave their studies to become professional gamers are making a risky decision.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “Young people who **give up their studies** to follow this dream **are taking a serious risk**.” → paraphrase: leave their studies = give up their studies; risky decision = serious risk → **YES**." },
        { q: "(13) Most professional gamers earn very little money.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn D nói ít người lên tới đỉnh và sự nghiệp ngắn — **không** nói gì về **thu nhập** của phần lớn game thủ → **NOT GIVEN**." },
        { q: "(14) Schools ought to stop students from playing video games.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn E: “It would therefore be **a mistake to ban** video games from schools.” → **NO** (ought to = should)." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại Practice 2 — đếm đáp án và rút kinh nghiệm",
      items: [
        "Đáp án: YES 8, 12 · NO 9, 10, 14 · NOT GIVEN 7, 11, 13. Đề thật cũng thường **trộn đều** ba loại — nếu bạn chọn 6/8 câu cùng một đáp án, hãy kiểm tra lại.",
        "Câu **11** là kiểu câu khiến band 5 mất điểm nhất: bài có nhắc tới **chess** và có con số giờ tập của **game thủ**, nhưng **không** nói gì về **số giờ tập của kỳ thủ**. Chỉ trả lời điều bài **viết ra**.",
        "Câu đề luôn **paraphrase**: ought to = should; leave their studies = give up their studies; risky decision = serious risk. Luyện nhận paraphrase là phần lớn của kỹ năng đọc (Tập 2 Ngày 8).",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "reaction", pos: "n", ipa: "/riˈækʃn/", vi: "phản xạ; phản ứng", ex: "Top gamers need extremely fast reactions.", exVi: "Game thủ hàng đầu cần phản xạ cực nhanh.", more: "Số nhiều **reactions** = phản xạ (cơ thể). **react to** + N." },
        { w: "strategy", pos: "n", ipa: "/ˈstrætədʒi/", vi: "chiến thuật, chiến lược", ex: "The team planned a new strategy for the final.", exVi: "Đội đã lên một chiến thuật mới cho trận chung kết.", more: "Tính từ **strategic** /strəˈtiːdʒɪk/ (trọng âm chuyển)." },
        { w: "recognise", pos: "v", ipa: "/ˈrekəɡnaɪz/", vi: "công nhận; nhận ra", ex: "Chess is officially recognised as a sport in many countries.", exVi: "Cờ vua được chính thức công nhận là một môn thể thao ở nhiều nước.", more: "Mỹ viết **recognize**. Danh từ **recognition**." },
        { w: "retire", pos: "v", ipa: "/rɪˈtaɪə(r)/", vi: "giải nghệ; nghỉ hưu", ex: "Many players retire in their mid-twenties.", exVi: "Nhiều tuyển thủ giải nghệ ở độ tuổi giữa hai mươi.", more: "Danh từ **retirement**. **in their mid-twenties** = khoảng 24–26 tuổi." },
        { w: "ban", pos: "v / n", ipa: "/bæn/", vi: "cấm; lệnh cấm", ex: "Some people want to ban video games from schools.", exVi: "Một số người muốn cấm trò chơi điện tử trong trường học.", more: "**ban sth from** + nơi · **a ban on** sth. Quá khứ **banned** (gấp đôi n)." },
        { w: "involve", pos: "v", ipa: "/ɪnˈvɒlv/", vi: "lôi cuốn tham gia; bao gồm", ex: "Gaming clubs can involve students who do not like sport.", exVi: "Câu lạc bộ game có thể lôi kéo những học sinh không thích thể thao tham gia.", more: "**be involved in** + N (tham gia vào)." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Viết ─────────────────────────── */

const T2D20_WRITING: Lesson = {
  id: "t2d20-viet",
  kind: "writing",
  title: "Task 1 process diagram — bị động + trình tự (trọn bài band 5)",
  goal: "Viết trọn một bài Task 1 sơ đồ quy trình ≥ 150 từ trong 20 phút: đếm bước, viết tổng quan (số bước, bắt đầu – kết thúc), mô tả mọi bước bằng bị động hiện tại đơn với từ nối trình tự đa dạng, gộp bước bằng mệnh đề quan hệ / after being V3 (TA · CC · LR · GRA band 5).",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Process diagram** (sơ đồ quy trình): mô tả các **bước** làm ra một sản phẩm (nhân tạo) hoặc một **vòng đời / chu trình** (tự nhiên). Tập 1 Ngày 15 đã nhận dạng; hôm nay viết **trọn bài ≥ 150 từ**.",
        "Khung 4 đoạn: **Mở bài** (paraphrase đề) → **Tổng quan** (có bao nhiêu bước, bắt đầu bằng gì, kết thúc bằng gì) → **Thân 1** (nửa đầu) → **Thân 2** (nửa sau).",
        "Ngữ pháp chính: **bị động hiện tại đơn** (is / are + V3) cho quy trình nhân tạo; **chủ động** cho chu trình tự nhiên (eggs **hatch**).",
        "Mạch lạc (CC): từ nối trình tự **không lặp** — First · Next · After that · Once … have been V3 · Following this · Finally.",
        "Band 5 cần: có tổng quan, không sót bước, câu bị động phần lớn đúng, **≥ 150 từ**. Band 6: thêm câu gộp bước (which / where / after being V3) và chi tiết (thời gian, nhiệt độ).",
        "Nâng cấp (mục 2b): từ trình tự **3 tầng** (The process commences with… · after which… · concludes with…), câu nêu **mục đích** của bước (so that / to ensure that / by means of), **by** + người ≠ **with** + dụng cụ — và **không bịa bước**.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Đọc sơ đồ trong 2 phút — bốn câu hỏi" },
    {
      t: "sodo",
      kind: "flow",
      title: "Bốn câu tự hỏi trước khi viết",
      steps: [
        { label: "1 · Nhân tạo hay tự nhiên?", sub: "Có máy, nhà máy, đóng gói → nhân tạo → **bị động**. Trứng, con non, mưa, cây → tự nhiên → **chủ động** là chính." },
        { label: "2 · Có bao nhiêu bước?", sub: "Đếm và ghi số. Tổng quan cần câu “There are **nine** stages in the process”." },
        { label: "3 · Bắt đầu bằng gì, kết thúc bằng gì?", sub: "“…which **begins with** picking the olives and **ends with** bottled oil being sent to shops.”" },
        { label: "4 · Chia đôi ở đâu?", sub: "Tìm chỗ “đổi pha” (từ vườn vào nhà máy, từ trộn sang tách dầu) → thân 1 / thân 2." },
      ],
    },
    {
      t: "table",
      caption: "Nhãn trong hình thường là DANH TỪ — đổi thành ĐỘNG TỪ bị động (vừa đúng ngữ pháp, vừa không chép đề)",
      head: ["Nhãn trong hình", "Câu trong bài"],
      rows: [
        ["Harvesting", "The olives **are harvested** …"],
        ["Washing", "The fruit **is washed** …"],
        ["Crushing", "The olives **are crushed** into a paste."],
        ["Separation", "The oil **is separated** from the water."],
        ["Storage", "The oil **is stored** in large tanks."],
        ["Bottling / Distribution", "It **is bottled** and **distributed** to shops."],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Bị động + trình tự — và ba cách gộp bước" },
    {
      t: "table",
      caption: "Từ nối trình tự — mỗi câu dùng một từ khác nhau",
      head: ["Vị trí", "Từ nối", "Ví dụ"],
      rows: [
        ["Bước đầu", "First / Firstly / To begin with / At the first stage", "**First**, the olives are harvested …"],
        ["Bước giữa", "Next / Then / After that / Following this / Subsequently", "**Following this**, the paste is mixed …"],
        ["Nối hai bước", "Once / After + S + have / has been + V3", "**Once** the oil **has been separated**, it is stored …"],
        ["Bước cuối", "Finally / Lastly / At the final stage", "**Finally**, it is bottled and sent to shops."],
        ["Chi tiết thêm", "for + thời gian · at + nhiệt độ · by + phương tiện · in + nơi chứa", "mixed **for** 30–40 minutes · stored **in** tanks"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + is / are + V3 (+ by machine / by hand) (+ for / at / in …).",
          vi: "Câu bị động cơ bản cho mỗi bước; thêm chi tiết bằng cụm giới từ.",
          examples: [
            { en: "The olives are harvested by hand or by machine.", vi: "Ô liu được thu hoạch bằng tay hoặc bằng máy." },
            { en: "The paste is mixed slowly for 30 to 40 minutes.", vi: "Hỗn hợp nhão được trộn chậm trong 30 đến 40 phút." },
          ],
        },
        {
          formula: "After being V3, S + is / are + V3. · Once S + has / have been V3, S + is / are + V3.",
          vi: "Gộp HAI bước vào một câu — cách nhanh nhất để có câu phức trong bài quy trình.",
          examples: [
            { en: "After being washed, the olives are crushed into a paste.", vi: "Sau khi được rửa, ô liu được nghiền thành hỗn hợp nhão." },
            { en: "Once the oil has been separated, it is stored in tanks.", vi: "Khi dầu đã được tách ra, nó được chứa trong bồn." },
          ],
        },
        {
          formula: "S + is / are + V3 to + N (nơi), where + S + is / are + V3. · …, which + V …",
          vi: "Mệnh đề quan hệ (Tập 2 Ngày 15) để nối nơi chốn hoặc giải thích thêm.",
          examples: [
            { en: "The fruit is taken to a mill, where it is washed in cold water.", vi: "Quả được đưa tới xưởng ép, nơi nó được rửa bằng nước lạnh." },
            { en: "The oil is separated in a centrifuge, which spins very fast.", vi: "Dầu được tách trong máy ly tâm, thứ quay rất nhanh." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "First, S + is / are + V3 … · After being V3, S + is / are + V3 … · Once S + has / have been V3, … · S + is / are + V3 to N, where … · Finally, …",
      vi: "Bộ câu quy trình band 5–6: bị động hiện tại đơn + từ nối trình tự + một hai câu gộp bước.",
    },
    {
      t: "quiz",
      id: "t2d20-viet-dich",
      title: "Dịch sang tiếng Anh — câu quy trình (5 câu)",
      kind: "translate",
      grammar: "S + is/are + V3 · After being V3, … · Once S + has/have been V3, … · …, where S + is/are + V3.",
      items: [
        { q: "Đầu tiên, lá chè được hái bằng tay.", hint: "First, tea leaves, are picked, by hand", answers: ["First, tea leaves are picked by hand.", "First, the tea leaves are picked by hand.", "Firstly, tea leaves are picked by hand.", "Firstly, the tea leaves are picked by hand.", "First, tea leaves are harvested by hand.", "First, the tea leaves are harvested by hand."] },
        { q: "Sau khi được rửa sạch, trái cây được cắt thành miếng nhỏ.", hint: "After being washed, the fruit, is cut into, small pieces", answers: ["After being washed, the fruit is cut into small pieces.", "After being cleaned, the fruit is cut into small pieces.", "After it has been washed, the fruit is cut into small pieces.", "After it is washed, the fruit is cut into small pieces."] },
        { q: "Khi đã được sấy khô, hạt được đóng gói vào túi.", hint: "Once, the beans / seeds, have been dried, they are packed into bags", answers: ["Once the beans have been dried, they are packed into bags.", "Once the seeds have been dried, they are packed into bags.", "Once they have been dried, the beans are packed into bags.", "Once they have been dried, the seeds are packed into bags.", "Once the beans have been dried, they are packed in bags.", "Once the seeds have been dried, they are packed in bags."] },
        { q: "Sữa được đưa tới một nhà máy, nơi nó được đun nóng.", hint: "The milk, is taken / transported to a factory, where it is heated", answers: ["The milk is taken to a factory, where it is heated.", "The milk is transported to a factory, where it is heated.", "The milk is taken to a factory where it is heated.", "The milk is transported to a factory where it is heated.", "The milk is sent to a factory, where it is heated."] },
        { q: "Cuối cùng, sản phẩm được giao tới các siêu thị.", hint: "Finally, the product(s), is / are delivered, to supermarkets", answers: ["Finally, the product is delivered to supermarkets.", "Finally, the products are delivered to supermarkets.", "Finally, the product is distributed to supermarkets.", "Finally, the products are distributed to supermarkets.", "Lastly, the product is delivered to supermarkets.", "Lastly, the products are delivered to supermarkets."] },
      ],
    },

    /* ── 2b ── */
    { t: "h", text: "2b. Nâng cấp: từ trình tự 3 tầng · mục đích của bước · by hay with" },
    {
      t: "table",
      caption: "Từ trình tự chia 3 tầng — mỗi tầng chọn 2–3 cái, xoay vòng để không lặp then / next",
      head: ["Tầng", "Cụm dùng được", "Ví dụ (quy trình ô liu)"],
      rows: [
        ["**Mở quy trình**", "The process **begins / commences with** + N / V-ing · **First of all**, … · **At the first stage**, …", "The process **commences with** the harvesting of the olives."],
        ["**Giữa quy trình**", "**Subsequently**, … · **After that**, … · **At the next stage**, … · **Once** S + has / have been V3, … · …, **after which** S + is / are + V3", "The olives are crushed into a paste, **after which** it is mixed for 30–40 minutes."],
        ["**Kết quy trình**", "**Finally**, … · **In the final stage**, … · The process **concludes / ends with** + N / V-ing", "The process **concludes with** the oil being bottled and delivered to shops."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi dùng từ trình tự",
      items: [
        "**begin / commence / conclude / end WITH** + danh từ hoặc V-ing: ~~The process begins harvest the olives.~~ → The process begins **with harvesting** the olives / **with the harvesting of** the olives.",
        "**after which** đứng sau dấu phẩy, nối hai bước trong MỘT câu: …is crushed, **after which** it is mixed… — ~~After which, it is mixed.~~ (không mở câu mới bằng after which).",
        "**Subsequently** = sau đó (trang trọng) — dùng 1 lần mỗi bài là đủ; dùng mọi câu thì cũng là lặp.",
      ],
    },
    {
      t: "table",
      caption: "Thêm MỤC ĐÍCH cho một bước — câu dài hơn, ý rõ hơn (TA + GRA)",
      head: ["Khung", "Ví dụ"],
      rows: [
        ["… **to / in order to** + V", "The olives are washed in cold water **in order to** remove dirt."],
        ["… **so that** + S + can + V", "The paste is mixed slowly **so that** small drops of oil can join together."],
        ["… **to ensure that** + S + V", "The oil is filtered **to ensure that** no small particles remain."],
        ["… **by means of** + công cụ / máy", "The oil is separated from the water **by means of** a centrifuge."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: thêm từ chính xác được — thêm BƯỚC thì không",
      items: [
        "Được dùng động từ / danh từ **chính xác hơn nhãn** khi hình đã vẽ rõ việc đó: hình có máy bơm nước lên bồn → **The water is pumped into a tank.** · hơi nước gặp lạnh thành nước → **The steam condenses into water.** · xe chở tới cửa hàng → **The products are distributed to shops.** Đây là điểm cộng Lexical Resource.",
        "Mục đích chỉ thêm khi **lẽ thường ai cũng hiểu** (rửa → để sạch bụi; lọc → để bỏ cặn). Không chắc thì bỏ.",
        "**KHÔNG bịa bước** hình không có (vd thêm “the oil is tested by experts” khi hình không vẽ) — giám khảo coi là thông tin sai → trừ Task Achievement.",
      ],
    },
    {
      t: "table",
      caption: "Bị động: by + NGƯỜI / cách làm ≠ with + DỤNG CỤ cầm tay",
      head: ["Dùng", "Ví dụ"],
      rows: [
        ["**by** + người / tác nhân", "The tea leaves are picked **by** local workers."],
        ["**by** + cách làm (không mạo từ)", "picked **by hand** · cut **by machine** · sent **by truck**"],
        ["**with** + dụng cụ / chất (thường có a / the)", "The fruit is cut **with a knife**. · The bottles are cleaned **with hot water**."],
      ],
    },
    {
      t: "rule",
      formula: "The process commences with + N / V-ing · …, after which S + is / are + V3 · S + is / are + V3 + so that S + can + V · by + người / by hand · with + a knife",
      vi: "Mở – giữa – kết bằng ba tầng từ trình tự; mỗi thân bài có ít nhất một câu nêu mục đích; by cho người làm, with cho dụng cụ.",
    },
    {
      t: "quiz",
      id: "t2d20-viet-muc-dich",
      title: "Dịch — từ trình tự, mục đích, by / with (4 câu)",
      kind: "translate",
      grammar: "The process begins with + N · …, after which … · in order to / so that … can · by + người · with + dụng cụ",
      items: [
        { q: "Quy trình bắt đầu bằng việc thu hoạch cà phê.", hint: "The process begins / commences with, harvesting the coffee / the harvesting of the coffee", answers: ["The process begins with harvesting the coffee.", "The process begins with the harvesting of the coffee.", "The process commences with harvesting the coffee.", "The process commences with the harvesting of the coffee.", "The process starts with harvesting the coffee.", "The process starts with the harvesting of the coffee."] },
        { q: "Hạt được sấy khô để chúng có thể được bảo quản lâu hơn.", hint: "The beans are dried, so that they can be stored, longer / for longer", answers: ["The beans are dried so that they can be stored for longer.", "The beans are dried so that they can be stored longer.", "The beans are dried so they can be stored for longer.", "The seeds are dried so that they can be stored for longer.", "The beans are dried in order to be stored for longer.", "The beans are dried so that they can be kept for longer."] },
        { q: "Quả được cắt bằng dao.", hint: "The fruit, is cut, with a knife", answers: ["The fruit is cut with a knife.", "The fruit is cut with knives.", "The fruits are cut with a knife."] },
        { q: "Sữa được đun nóng, sau đó nó được làm lạnh nhanh.", hint: "The milk is heated, after which, it is cooled quickly", answers: ["The milk is heated, after which it is cooled quickly.", "The milk is heated, after which it is quickly cooled.", "The milk is heated, after which it is cooled rapidly.", "The milk is heated, after which it is rapidly cooled."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bài mẫu — How olive oil is produced" },
    {
      t: "p",
      text: "**Đề:** The diagram below shows how olive oil is produced. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
    },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How olive oil is produced",
        note: "Quy trình tự đặt cho bài luyện (giản lược từ quy trình thật).",
        steps: [
          { label: "Olives harvested", note: "October–December · by hand or machine" },
          { label: "Leaves removed, olives washed", note: "at the mill · cold water" },
          { label: "Crushed into a paste", note: "together with the stones" },
          { label: "Paste mixed slowly", note: "30–40 minutes · oil drops join together" },
          { label: "Oil separated", note: "centrifuge · from paste and water" },
          { label: "Stored in tanks", note: "4–6 weeks" },
          { label: "Filtered", note: "small particles removed" },
          { label: "Bottled and labelled", note: "" },
          { label: "Delivered to shops", note: "" },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "The diagram illustrates how olive oil is made, from the harvesting of the fruit to the delivery of the finished product to shops.", vi: "[Mở bài — paraphrase: shows → illustrates; is produced → is made] Sơ đồ minh hoạ cách làm dầu ô liu, từ khâu thu hoạch quả đến khi thành phẩm được giao tới cửa hàng." },
        { en: "Overall, there are nine stages in the process, which begins with picking the olives and ends with the bottled oil being sent to shops.", vi: "[Tổng quan — số bước + đầu + cuối] Nhìn chung, quy trình có chín giai đoạn, bắt đầu bằng việc hái ô liu và kết thúc bằng việc dầu đóng chai được gửi tới cửa hàng." },
        { en: "First, the olives are harvested between October and December, either by hand or by machine. They are then taken to a mill, where any leaves are removed and the fruit is washed in cold water. Next, the olives are crushed, together with their stones, into a thick paste. After that, this paste is mixed slowly for around 30 to 40 minutes so that small drops of oil can join together.", vi: "[Thân 1 — bước 1–4] Đầu tiên, ô liu được thu hoạch từ tháng Mười đến tháng Mười hai, bằng tay hoặc bằng máy. Sau đó chúng được đưa tới xưởng ép, nơi lá được bỏ đi và quả được rửa bằng nước lạnh. Tiếp theo, ô liu được nghiền cả hạt thành một hỗn hợp nhão đặc. Sau đó, hỗn hợp này được trộn chậm khoảng 30 đến 40 phút để những giọt dầu nhỏ kết lại với nhau." },
        { en: "At the following stage, the oil is separated from the paste and the water in a machine called a centrifuge. Once it has been separated, the oil is stored in large tanks for four to six weeks and then filtered to remove any small particles. Finally, it is put into bottles, labelled and delivered to shops.", vi: "[Thân 2 — bước 5–9] Ở giai đoạn tiếp theo, dầu được tách khỏi hỗn hợp nhão và nước trong một cỗ máy gọi là máy ly tâm. Khi đã được tách ra, dầu được chứa trong các bồn lớn từ bốn đến sáu tuần rồi được lọc để loại bỏ các hạt nhỏ. Cuối cùng, dầu được cho vào chai, dán nhãn và giao tới các cửa hàng." },
      ],
    },
    {
      t: "table",
      caption: "Bài mẫu: 173 từ (đếm cả bốn đoạn) — vì sao là bài mẫu tốt (vượt mức band 5 cần đạt)",
      head: ["Tiêu chí Task 1", "Bài mẫu làm gì"],
      rows: [
        ["**Task Achievement** (hoàn thành yêu cầu)", "Có **tổng quan** rõ (9 bước, đầu – cuối); **đủ 9 bước**, không bỏ bước nào; giữ chi tiết trong hình (October–December, 30–40 minutes, oil drops join together, 4–6 weeks); không thêm ý kiến cá nhân."],
        ["**Coherence & Cohesion** (mạch lạc)", "4 đoạn đúng vai; chia thân bài ở chỗ “đổi pha” (trộn xong → tách dầu); từ nối **đa dạng**: First · then · Next · After that · At the following stage · Once … has been separated · then · Finally; **this paste / it** để tránh lặp danh từ."],
        ["**Lexical Resource** (từ vựng)", "Động từ quy trình đúng nghĩa: harvested, removed, crushed, mixed, separated, stored, filtered, labelled, delivered; cụm **together with their stones**, **a thick paste**, **small particles**; paraphrase đề **illustrates / is made**."],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Bị động hiện tại đơn đúng xuyên bài; câu phức: **where** (mệnh đề quan hệ), **Once it has been separated** (bị động hoàn thành), **so that … can**, **which begins with … and ends with**."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: sáu lỗi làm bài quy trình rơi xuống band 4",
      items: [
        "**Chủ động sai**: ~~The olives harvest in October.~~ → The olives **are harvested**… (ô liu không tự thu hoạch).",
        "**Thiếu tổng quan** → Task Achievement tối đa band 5. Luôn có câu Overall… với số bước + đầu + cuối.",
        "**Chép nguyên nhãn**: ~~Leaves removed, olives washed.~~ (câu thiếu động từ) → Any leaves **are removed** and the olives **are washed**.",
        "**Lặp Then / Next ở mọi câu**, hoặc **đánh số 1, 2, 3** như gạch đầu dòng → mất điểm CC. Viết thành đoạn văn.",
        "**Thêm ý kiến**: ~~This is a very healthy oil.~~ — Task 1 không có ý kiến cá nhân.",
        "**Đếm từ thiếu**: bài < 150 từ thường thiếu bước / thiếu chi tiết nên điểm TA thấp. Mở bài + tổng quan ≈ 50 từ, mỗi thân bài ≈ 60–70 từ là đủ.",
      ],
    },
    {
      t: "table",
      caption: "So sánh: cùng một bước, ba mức band",
      head: ["Band", "Câu"],
      rows: [
        ["~4", "~~Then they crush olive. It become paste.~~ (chủ động sai, thiếu mạo từ, sai chia động từ)"],
        ["5", "Next, the olives are crushed into a paste."],
        ["6", "After being washed, the olives are crushed, together with their stones, into a thick paste."],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Chu trình tự nhiên — chủ động là chính" },
    {
      t: "p",
      text: "Với **vòng đời** (life cycle) của con vật hay cây, sự vật **tự** biến đổi → dùng **chủ động hiện tại đơn**: eggs **hatch** (nở), larvae **grow** (lớn), adults **emerge** (chui ra), the cycle **begins again** (bắt đầu lại). Tổng quan của chu trình: “There are **X** main stages in the life cycle, **from** … **to** …, **and the cycle then repeats itself**.”",
    },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "The life cycle of a mosquito",
        note: "Chu trình tự đặt cho bài luyện (giản lược).",
        steps: [
          { label: "Female lays eggs on water", note: "100–200 eggs" },
          { label: "Eggs hatch into larvae", note: "after 2–3 days" },
          { label: "Larvae feed and grow in water", note: "about 7 days" },
          { label: "Larvae become pupae", note: "2–3 days · do not eat" },
          { label: "Adults emerge and fly away", note: "" },
          { label: "Female feeds on blood, lays eggs", note: "cycle repeats" },
        ],
      },
    },
    {
      t: "table",
      caption: "Động từ chu trình tự nhiên (chủ động)",
      head: ["Động từ", "Nghĩa", "Câu"],
      rows: [
        ["**lay** (eggs)", "đẻ (trứng) — quá khứ laid", "The female **lays** 100 to 200 eggs on the surface of the water."],
        ["**hatch** (into)", "nở (ra)", "After two to three days, the eggs **hatch into** larvae."],
        ["**feed (on)**", "ăn, kiếm ăn", "The larvae **feed** and **grow** in the water for about a week."],
        ["**develop / turn into**", "phát triển thành", "They then **turn into** pupae, which do not eat."],
        ["**emerge**", "chui ra, xuất hiện", "Finally, adult mosquitoes **emerge** and fly away."],
        ["**repeat / begin again**", "lặp lại", "The female feeds on blood, lays eggs, and the cycle **begins again**."],
      ],
    },
    {
      t: "mcq",
      id: "t2d20-viet-chon",
      title: "Chọn câu đúng cho bài quy trình (6 câu)",
      items: [
        { q: "Nhân tạo — bước đóng chai:", options: ["The oil bottles.", "The oil is bottled.", "The oil is bottling.", "The oil was bottle."], correct: 1, why: "Dầu **được** đóng chai → bị động hiện tại đơn: **is bottled**." },
        { q: "Tự nhiên — trứng nở:", options: ["The eggs are hatched into larvae.", "The eggs hatched into larvae.", "The eggs hatch into larvae.", "The eggs hatching into larvae."], correct: 2, why: "Chu trình tự nhiên → **chủ động**, hiện tại đơn (quy luật lặp lại): **hatch**." },
        { q: "Câu tổng quan tốt nhất:", options: ["Overall, there are six stages in the life cycle, from egg to adult, and the cycle then repeats itself.", "Overall, mosquitoes are dangerous insects.", "Overall, the eggs hatch after two to three days.", "Overall, I think this process is interesting."], correct: 0, why: "Tổng quan = **số bước + đầu – cuối + đặc điểm chung (lặp lại)**. Hai câu khác là ý kiến; câu còn lại là chi tiết." },
        { q: "Gộp hai bước:", options: ["After washed, the olives are crushed.", "After be washed, the olives are crushed.", "After washing, the olives crush.", "After being washed, the olives are crushed."], correct: 3, why: "After + **being + V3** (bị động sau giới từ). ~~After washed~~ thiếu being." },
        { q: "Nối hai bước bằng Once:", options: ["Once the oil has been separated, it is stored in tanks.", "Once the oil has separated it, it is stored in tanks.", "Once the oil is separating, it stores in tanks.", "Once separated the oil, it stored in tanks."], correct: 0, why: "**Once + S + has been + V3**, mệnh đề chính bị động **is stored**." },
        { q: "Câu mở bài nào KHÔNG chép nguyên đề “The diagram below shows how olive oil is produced”?", options: ["The diagram below shows how olive oil is produced.", "The diagram illustrates the process of making olive oil.", "The diagram below shows how olive oil is produced in this process.", "This diagram below shows how olive oil is produced."], correct: 1, why: "Paraphrase: shows → **illustrates**; how … is produced → **the process of making**. Chép nguyên câu đề thì những từ chép **không được tính** vào 150 từ." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Viết bài — How rice is processed" },
    {
      t: "figure",
      fig: {
        kind: "process",
        title: "How rice is processed for sale",
        note: "Quy trình tự đặt cho bài luyện.",
        steps: [
          { label: "Rice harvested", note: "combine harvester" },
          { label: "Dried in the sun", note: "2–3 days" },
          { label: "Husks removed", note: "milling machine → brown rice" },
          { label: "Polished", note: "bran removed → white rice" },
          { label: "Sorted by size", note: "broken grains taken out" },
          { label: "Packed into bags", note: "5 kg and 25 kg" },
          { label: "Transported to shops", note: "by truck" },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d20-viet-bai",
      task: "Task 1",
      prompt: "The diagram shows how rice is processed before it is sold in shops. Summarise the information by selecting and reporting the main features. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Mở bài: paraphrase **shows → illustrates / is processed → is prepared**.",
        "Tổng quan: **There are seven stages, which begin with … and end with …**",
        "Thân 1: bước 1–3 (từ ruộng tới khi bỏ vỏ trấu); Thân 2: bước 4–7 (trong nhà máy tới cửa hàng).",
        "Ít nhất 2 câu gộp bước: **After being dried, …** · **…, which turns it into brown rice.**",
        "Giữ chi tiết: by a combine harvester · for two to three days · 5 kg and 25 kg bags · by truck.",
        "Từ hữu ích: husk (vỏ trấu), bran (lớp cám), grain (hạt), polish (đánh bóng, xát trắng), mill (nhà máy xay).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D20_HOMEWORK: Lesson = {
  id: "t2d20-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 20",
  goal: "Ôn trọn Ngày 20: từ vựng thể thao – giải trí (play/go/do, win/beat, họ từ), câu bị động quy trình, một bài Yes / No / Not Given ngắn, và câu quy trình nâng cấp (từ trình tự, mục đích, by / with).",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (42 câu)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡): từ chủ đề + câu quy trình.",
        "**II. Trắc nghiệm** (10 câu): play / go / do · win / beat · collocation · từ nối quy trình.",
        "**III. Điền dạng từ** (8 câu).",
        "**IV. Yes / No / Not Given** (6 câu) với một đoạn nghị luận ngắn.",
        "**V. Quy trình nâng cấp** (8 câu): thay then bằng từ trình tự · thêm mục đích cho bước · by / with.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 20",
      center: "**Ngày 20**",
      branches: [
        { label: "Từ vựng", items: ["play / go / do", "win (match) ≠ beat (opponent)", "relaxing ≠ relaxed"], anh: "soccer-ball" },
        { label: "Reading YNNG", items: ["ý TÁC GIẢ, không phải critics", "NO = nói ngược · NG = không nói", "all / some · should ≠ do"], anh: "open-book" },
        { label: "Task 1 process", items: ["Overall: số bước + đầu – cuối", "is / are + V3", "After being V3 · Once … has been V3"], anh: "gear" },
      ],
    },

    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "t2d20-bt-dich",
      title: "I. Dịch sang tiếng Anh (10 câu)",
      kind: "translate",
      grammar: "play / go / do + môn · win + trận / beat + đối thủ · take up / give up / work out · S + is/are + V3 · After being V3, …",
      items: [
        { q: "Tôi bắt đầu tập yoga năm ngoái.", hint: "took up / started doing, yoga, last year", answers: ["I took up yoga last year.", "I started doing yoga last year.", "I began doing yoga last year.", "I started to do yoga last year.", "Last year I took up yoga.", "Last year, I took up yoga."] },
        { q: "Cuối tuần chúng tôi thường đi bơi.", hint: "We usually go swimming, at the weekend / at weekends", answers: ["We usually go swimming at the weekend.", "We usually go swimming at weekends.", "We usually go swimming on weekends.", "We usually go swimming on the weekend.", "At the weekend we usually go swimming.", "At weekends we usually go swimming."] },
        { q: "Việt Nam đã đánh bại Thái Lan trong trận chung kết.", hint: "Vietnam, beat / defeated, Thailand, in the final", answers: ["Vietnam beat Thailand in the final.", "Vietnam defeated Thailand in the final.", "Viet Nam beat Thailand in the final.", "Viet Nam defeated Thailand in the final."] },
        { q: "Đội của cô ấy đã giành chức vô địch quốc gia.", hint: "Her team, won, the national championship", answers: ["Her team won the national championship.", "Her team has won the national championship."] },
        { q: "Anh trai tôi tập gym bốn lần một tuần.", hint: "My brother, works out at the gym, four times a week", answers: ["My brother works out at the gym four times a week.", "My brother works out four times a week.", "My brother goes to the gym four times a week.", "My older brother works out at the gym four times a week.", "My elder brother works out at the gym four times a week."] },
        { q: "Khán giả đã vỗ tay suốt năm phút.", hint: "The audience, clapped, for five minutes", answers: ["The audience clapped for five minutes.", "The audience applauded for five minutes."] },
        { q: "Nhiều người trẻ có lối sống ít vận động.", hint: "Many young people, have / lead, a sedentary lifestyle", answers: ["Many young people have a sedentary lifestyle.", "Many young people lead a sedentary lifestyle.", "Many young people have sedentary lifestyles.", "Many young people lead sedentary lifestyles.", "A lot of young people have a sedentary lifestyle.", "A lot of young people lead a sedentary lifestyle."] },
        { q: "Hạt cà phê được rang ở nhiệt độ cao.", hint: "The coffee beans, are roasted, at a high temperature", answers: ["The coffee beans are roasted at a high temperature.", "Coffee beans are roasted at a high temperature.", "The coffee beans are roasted at high temperatures.", "Coffee beans are roasted at high temperatures."] },
        { q: "Sau khi được phân loại, chai được nghiền vụn.", hint: "After being sorted, the bottles, are crushed", answers: ["After being sorted, the bottles are crushed.", "After they have been sorted, the bottles are crushed.", "After they are sorted, the bottles are crushed.", "Once they have been sorted, the bottles are crushed."] },
        { q: "Quy trình có tám giai đoạn.", hint: "There are eight stages, in the process", answers: ["There are eight stages in the process.", "The process has eight stages.", "The process consists of eight stages.", "There are 8 stages in the process."] },
      ],
    },

    { t: "h", text: "II. Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "t2d20-bt-chon",
      title: "II. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "My parents ___ jogging around the lake every evening.", options: ["go", "play", "do", "make"], correct: 0, why: "jogging (-ing, di chuyển) → **go** jogging." },
        { q: "She ___ judo at a club near her school.", options: ["plays", "does", "goes", "makes"], correct: 1, why: "Võ → **do** judo; she → does." },
        { q: "Our team ___ the final 3–0.", options: ["beat", "won", "defeated", "scored"], correct: 1, why: "+ **the final** (trận) → **won**. beat / defeated cần đối thủ (beat Thailand)." },
        { q: "Regular exercise helps you ___.", options: ["keep fitness", "keep fit", "make fit", "do fit"], correct: 1, why: "Cụm cố định **keep fit**. ~~keep fitness~~ sai." },
        { q: "More than 50,000 ___ filled the stadium.", options: ["audiences", "viewers", "spectators", "watchers"], correct: 2, why: "Khán giả **tại sân** thể thao → **spectators**. viewers = xem qua TV; audience dùng cho buổi diễn (và là danh từ tập hợp)." },
        { q: "I ___ for a swimming course at the leisure centre yesterday.", options: ["signed up", "took up", "warmed up", "gave up"], correct: 0, why: "**sign up for** + khoá học = đăng ký." },
        { q: "The film was so ___ that we watched it twice.", options: ["entertain", "entertained", "entertainment", "entertaining"], correct: 3, why: "Mô tả bộ phim (gây cảm giác) → **entertaining**." },
        { q: "___ the leaves have been dried, they are packed.", options: ["First", "Finally", "Following", "Once"], correct: 3, why: "**Once** + mệnh đề hoàn thành → nối hai bước. First / Finally là trạng từ, không nối mệnh đề; Following this mới dùng được." },
        { q: "Life cycle — câu đúng:", options: ["The pupae are emerged as adults.", "Adults are emerged from the pupae.", "Adults emerge from the pupae.", "Adults emerging from the pupae."], correct: 2, why: "**emerge** là nội động từ (không có tân ngữ) → **không có bị động**; chu trình tự nhiên dùng chủ động." },
        { q: "YNNG — Bài viết: “Some people say e-sports are not real sport. I agree with them.” Câu đề: “The writer believes e-sports are not real sport.”", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Tác giả **đồng ý** với ý của “some people” (I agree with them) → **YES**." },
      ],
    },

    { t: "h", text: "III. Điền dạng đúng của từ trong ngoặc (8 câu)" },
    {
      t: "quiz",
      id: "t2d20-bt-dang-tu",
      title: "III. Điền dạng từ (8 câu)",
      kind: "fill",
      items: [
        { q: "Every ___ in the race received a medal. (PARTICIPATE)", answers: ["participant"], hint: "Every + danh từ số ít chỉ người" },
        { q: "Football is a very ___ sport in Europe. (COMPETE)", answers: ["competitive"], hint: "a very + tính từ" },
        { q: "The band gave an amazing ___ last night. (PERFORM)", answers: ["performance"], hint: "an amazing + danh từ" },
        { q: "Reading in the garden is my favourite form of ___. (RELAX)", answers: ["relaxation"], hint: "form of + danh từ" },
        { q: "The ___ told jokes and did magic tricks at the party. (ENTERTAIN)", answers: ["entertainer"], hint: "The + danh từ chỉ người" },
        { q: "She has been ___ in sport since she was a child. (INVOLVE)", answers: ["involved"], hint: "be ___ in" },
        { q: "He decided to ___ after twenty years as a footballer. (RETIREMENT)", answers: ["retire"], hint: "decided to + động từ" },
        { q: "Chess is officially ___ as a sport in many countries. (RECOGNITION)", answers: ["recognised", "recognized"], hint: "is + V3 (bị động)" },
      ],
    },

    { t: "h", text: "IV. Yes / No / Not Given (6 câu)" },
    {
      t: "passage",
      title: "Free sports facilities for everyone",
      paras: [
        { label: "A", text: "Many local councils argue that they cannot afford to keep public swimming pools and sports centres open. I find this argument weak. The money spent on free facilities is small compared with the cost of treating illnesses caused by inactivity, such as heart disease and diabetes." },
        { label: "B", text: "It is true that some people would never use a sports centre even if it were free. However, my own town offers free gym sessions for teenagers on Saturday mornings, and the sessions are always full. Young people clearly respond when the price is removed." },
        { label: "C", text: "Of course, free facilities alone will not solve the problem. Schools also need to give children enough time for physical education, and in my opinion two hours a week is the minimum. Without good habits formed early, even the best facilities will stand empty." },
      ],
    },
    {
      t: "mcq",
      id: "t2d20-bt-ynng",
      title: "IV. Do the statements agree with the views of the writer? (6 câu)",
      items: [
        { q: "(1) Councils are right to say they cannot pay for public sports facilities.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: councils argue they cannot afford… “**I find this argument weak**.” → tác giả không đồng ý → **NO**." },
        { q: "(2) Free facilities cost less than treating diseases caused by inactivity.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “The money spent on free facilities is **small compared with** the cost of treating illnesses…” → **YES**." },
        { q: "(3) Heart disease is the most common illness caused by inactivity.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ liệt kê heart disease và diabetes làm ví dụ — **không** nói bệnh nào phổ biến nhất → **NOT GIVEN**." },
        { q: "(4) Teenagers in the writer's town are not interested in free gym sessions.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “the sessions are **always full**. Young people clearly respond…” → ngược với câu đề → **NO**." },
        { q: "(5) Schools should provide at least two hours of physical education a week.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn C: “**in my opinion two hours a week is the minimum**” → minimum = at least → **YES**." },
        { q: "(6) Most schools in the writer's country give children less than one hour of physical education a week.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Tác giả nêu mức **nên có**, không nói hiện nay các trường dạy **bao nhiêu** → **NOT GIVEN** (bẫy 5: should ≠ thực tế)." },
      ],
    },

    { t: "h", text: "V. Quy trình nâng cấp — trình tự · mục đích · by / with (8 câu)" },
    {
      t: "p",
      text: "Đoạn nháp dưới đây lặp **Then** bốn lần: ~~First, used paper is collected. Then it is sorted. Then it is mixed with water. Then it is pressed into sheets. Then it is dried.~~ Điền một từ để mỗi câu dùng một cách nối khác.",
    },
    {
      t: "quiz",
      id: "t2d20-bt-trinh-tu",
      title: "V-a. Thay “then” bằng từ trình tự đa dạng (4 câu)",
      kind: "fill",
      items: [
        { q: "The process ___ with the collection of used paper. (bắt đầu — động từ, hiện tại đơn)", answers: ["commences", "begins", "starts"], hint: "begin / commence + with + N" },
        { q: "The paper is sorted by hand, after ___ it is mixed with water. (sau đó — trong cùng một câu)", answers: ["which"], hint: "…, after which S + is / are + V3" },
        { q: "___ the mixture has been cleaned, it is pressed into sheets. (Khi / Một khi)", answers: ["Once", "After", "When"], hint: "Once + S + has been V3, …" },
        { q: "The process ___ with the sheets being dried and rolled. (kết thúc — động từ, hiện tại đơn)", answers: ["concludes", "ends", "finishes"], hint: "conclude / end + with + N / V-ing" },
      ],
    },
    {
      t: "quiz",
      id: "t2d20-bt-muc-dich",
      title: "V-b. Thêm mục đích cho bước (3 câu dịch)",
      kind: "translate",
      grammar: "S + is / are + V3 + in order to / to + V · so that + S + can + V · to ensure that + S + V",
      items: [
        { q: "Lá chè được phơi để giảm độ ẩm.", hint: "The tea leaves are dried / spread out, (in order) to reduce the moisture", answers: ["The tea leaves are dried to reduce the moisture.", "The tea leaves are dried in order to reduce the moisture.", "The tea leaves are dried to reduce their moisture.", "The tea leaves are dried in order to reduce their moisture.", "Tea leaves are dried to reduce the moisture.", "Tea leaves are dried in order to reduce moisture.", "The tea leaves are dried to reduce moisture."] },
        { q: "Chai được rửa bằng nước nóng để đảm bảo rằng chúng sạch.", hint: "The bottles are washed with hot water, to ensure that they are clean", answers: ["The bottles are washed with hot water to ensure that they are clean.", "The bottles are washed with hot water to ensure they are clean.", "The bottles are cleaned with hot water to ensure that they are clean.", "The bottles are washed in hot water to ensure that they are clean.", "The bottles are washed in hot water to ensure they are clean."] },
        { q: "Gạo được phân loại theo kích cỡ để hạt vỡ có thể được loại ra.", hint: "The rice is sorted by size, so that broken grains can be removed", answers: ["The rice is sorted by size so that broken grains can be removed.", "The rice is sorted by size so that the broken grains can be removed.", "The rice is sorted by size so that broken grains can be taken out.", "The rice is sorted by size so that the broken grains can be taken out.", "The rice is sorted by size so broken grains can be removed.", "Rice is sorted by size so that broken grains can be removed."] },
      ],
    },
    {
      t: "mcq",
      id: "t2d20-bt-by-with",
      title: "V-c. by hay with? (1 câu)",
      items: [
        { q: "The fish are cleaned ___ local women and then cut ___ sharp knives.", options: ["with … by", "by … with", "by … by", "with … with"], correct: 1, why: "**by** + người làm (local women) · **with** + dụng cụ cầm tay (sharp knives). Nhớ: by hand / by machine là cách làm, không có mạo từ." },
      ],
    },
  ],
};

export const NGAY_20: Lesson[] = [T2D20_VOCAB, T2D20_READING, T2D20_WRITING, T2D20_HOMEWORK];
