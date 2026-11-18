/**
 * IELTS Tập 4 — Ngày 4 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Psychology, happiness & behaviour — 50 từ theo 5 nhóm + collocation Task 2 / Part 3 + từ dễ nhầm   [VC27]
 *                     🔊 từ khó của chủ đề: p câm (psych-), anxious / anxiety, trọng âm dời (bảng 3.4 không ghi âm riêng cho Ngày 4)
 *   Bài 2 (writing)   Opinion band 7 — ý mở rộng 3 tầng, ví dụ cụ thể, không khái quát; phản đề “Granted… but…”;
 *                     bài mẫu band 6 vs band 7                                                              [W03 W15]
 *                     — nối Tập 2 Ngày 2 (P-E-E), Tập 3 Ngày 6 (đếm vế đề, thesis có mức độ, phản đề một câu), Tập 4 Ngày 2
 *   Bài 3 (listening) Part 2 — Multiple choice câu hỏi dài, phương án paraphrase + chọn TWO; 10 câu           [L04 L11]
 *                     — nối Tập 2 Ngày 13 (MCQ, chọn TWO), Tập 3 Ngày 4 (ba kiểu phương án sai) · Ngày 18
 *   Bài tập Ngày 4    40 câu có đáp án
 * Mọi id bắt đầu `t4d4-`.
 */
import type { Lesson } from '../data';

export const NGAY_4: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d4-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Psychology, happiness & behaviour — tâm lý, hạnh phúc và hành vi",
    goal: "Dùng chính xác 50 từ và hơn 40 collocation về tâm trí, cảm xúc, động lực và tính cách để bàn các đề Task 2 / Part 3 về hạnh phúc, sức khoẻ tinh thần, thói quen và giáo dục con người — đẩy LR band 7 “từ ít gặp, có ý thức về collocation và văn phong”.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Chủ đề **tâm lý – hạnh phúc – hành vi** xuất hiện ở cả bốn kỹ năng: Passage 3 (bài nghiên cứu tâm lý), Part 4 (bài giảng), Task 2 (“money and happiness”, “mental health at school”), Part 3 (“Why do people…?”).",
          "**50 từ** chia 5 nhóm: ① tâm trí & nhận thức · ② cảm xúc & hạnh phúc · ③ hành vi & động lực · ④ tính cách & sự hình thành con người · ⑤ động từ học thuật để nói về **tác động** (trigger, foster, undermine…).",
          "Band 7 không chấm “biết nhiều từ khó” mà chấm ==dùng đúng collocation và đúng sắc thái==: **boost** self-esteem (tự nhiên hơn increase), **suffer from** anxiety, **derive** satisfaction **from**, a **sense of** fulfilment.",
          "Tám cặp từ người Việt hay lẫn: stressed / stressful · depressed / depressing · sympathy / empathy · conscious / conscience · sensible / sensitive · mental / spiritual · lonely / alone · affect / effect.",
          "🔊 Phát âm từ khó của chủ đề: **p câm** trong psych- (/saɪ/), **anxious** /ˈæŋkʃəs/ ↔ **anxiety** /æŋˈzaɪəti/, trọng âm dời trong họ từ.",
          "Từ hôm nay dùng ngay ở bài 2 (đề Opinion về hạnh phúc) và bài nghe.",
        ],
      },

      { t: "h", text: "1. Tâm trí và nhận thức (mind & cognition) — 10 từ" },
      {
        t: "p",
        text: "Nhóm này để nói **con người nghĩ và nhìn nhận thế giới thế nào**. Trong Task 2, chúng thay cho các chữ mòn “think”, “idea”, “way of thinking”.",
      },
      {
        t: "vocab",
        items: [
          { w: "cognitive", pos: "adj", ipa: "/ˈkɒɡnətɪv/", vi: "thuộc về nhận thức (tư duy, ghi nhớ, học)", ex: "Regular exercise slows cognitive decline in old age.", exVi: "Tập thể dục đều đặn làm chậm sự suy giảm nhận thức ở tuổi già.", more: "cognitive **ability / development / decline / skills** · n: cognition /kɒɡˈnɪʃn/" },
          { w: "perception", pos: "n", ipa: "/pəˈsepʃn/", vi: "cách nhìn nhận, cảm nhận", ex: "Advertising shapes our perception of what a successful life looks like.", exVi: "Quảng cáo định hình cách ta nhìn nhận một cuộc sống thành công trông ra sao.", more: "public perception **of** N · v: perceive N **as** N/adj (be perceived as a threat) · adj: perceptive (tinh ý)" },
          { w: "consciousness", pos: "n", ipa: "/ˈkɒnʃəsnəs/", vi: "ý thức; sự tỉnh táo", ex: "The campaign raised public consciousness of mental illness.", exVi: "Chiến dịch đã nâng cao ý thức cộng đồng về bệnh tâm thần.", more: "lose / regain consciousness · adj: conscious **of** N · self-conscious (ngượng, tự ti về vẻ ngoài)" },
          { w: "subconscious", pos: "adj", ipa: "/ˌsʌbˈkɒnʃəs/", vi: "(thuộc) tiềm thức", ex: "Many of our everyday choices are made at a subconscious level.", exVi: "Nhiều lựa chọn hằng ngày của ta được đưa ra ở tầng tiềm thức.", more: "at a subconscious **level** · adv: subconsciously · n: the subconscious" },
          { w: "mindset", pos: "n", ipa: "/ˈmaɪndset/", vi: "lối tư duy, cách nghĩ đã thành nếp", ex: "Children who are praised for effort tend to develop a growth mindset.", exVi: "Trẻ được khen vì nỗ lực thường hình thành tư duy phát triển.", more: "a growth / fixed / positive mindset · **adopt / change** a mindset" },
          { w: "bias", pos: "n", ipa: "/ˈbaɪəs/", vi: "thiên kiến, sự thiên lệch", ex: "Confirmation bias leads people to notice only the evidence that supports their views.", exVi: "Thiên kiến xác nhận khiến người ta chỉ để ý bằng chứng ủng hộ quan điểm của mình.", more: "cognitive / unconscious bias · bias **against / towards / in favour of** · adj: biased" },
          { w: "intuition", pos: "n", ipa: "/ˌɪntjuˈɪʃn/", vi: "trực giác", ex: "Experienced doctors often rely on intuition as well as test results.", exVi: "Bác sĩ có kinh nghiệm thường dựa vào trực giác bên cạnh kết quả xét nghiệm.", more: "trust / follow your intuition · adj: intuitive · counter-intuitive (trái với điều ta tưởng)" },
          { w: "rational", pos: "adj", ipa: "/ˈræʃnəl/", vi: "có lý trí, hợp lý", ex: "Consumers do not always make rational decisions about money.", exVi: "Người tiêu dùng không phải lúc nào cũng quyết định về tiền bạc một cách lý trí.", more: "a rational decision / explanation · trái nghĩa: **irrational** (an irrational fear) · v: rationalise (viện lý do)" },
          { w: "attention span", pos: "n", ipa: "/əˈtenʃn spæn/", vi: "khoảng thời gian tập trung được", ex: "Critics claim that social media is shortening young people's attention spans.", exVi: "Giới phê bình cho rằng mạng xã hội đang rút ngắn khoảng tập trung của giới trẻ.", more: "a short / limited attention span · **shorten / hold** sb's attention" },
          { w: "assumption", pos: "n", ipa: "/əˈsʌmpʃn/", vi: "giả định, điều mặc nhiên cho là đúng", ex: "The policy rests on the assumption that people respond to financial rewards.", exVi: "Chính sách này dựa trên giả định rằng con người phản ứng với phần thưởng tài chính.", more: "**make / challenge / question** an assumption · be based on the assumption **that** · v: assume" },
        ],
      },

      { t: "h", text: "2. Cảm xúc và hạnh phúc (emotions & well-being) — 13 từ" },
      {
        t: "p",
        text: "Tiếng Việt có một chữ “hạnh phúc”; tiếng Anh học thuật chia nhỏ hơn nhiều. Viết “happy / happiness” năm lần trong một bài là lý do LR dừng ở 6. Bảng dưới là thang sắc thái — đọc trước rồi học từng từ.",
      },
      {
        t: "table",
        caption: "“Hạnh phúc” — năm chữ, năm sắc thái",
        head: ["Từ", "Sắc thái", "Dùng khi"],
        rows: [
          ["**happiness**", "Chung nhất; cảm xúc vui", "Nhắc lại đề; văn nói"],
          ["**well-being**", "Khoẻ mạnh + dễ chịu cả thể chất lẫn tinh thần; từ của nghiên cứu và chính sách", "Task 2, bài đọc: mental / emotional well-being"],
          ["**contentment**", "Mãn nguyện, bằng lòng với cái đang có — lặng, bền", "Đối lập với chạy theo vật chất"],
          ["**fulfilment**", "Viên mãn vì làm được điều có ý nghĩa", "Công việc, mục tiêu sống: a sense of fulfilment"],
          ["**life satisfaction**", "Mức hài lòng tổng thể — thứ các khảo sát đo", "Khi nói về số liệu, so sánh giữa các nước"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "well-being", pos: "n", ipa: "/ˌwel ˈbiːɪŋ/", vi: "trạng thái khoẻ mạnh, dễ chịu (thể chất và tinh thần)", ex: "Access to green space has a measurable effect on mental well-being.", exVi: "Việc tiếp cận không gian xanh có tác động đo được lên sức khoẻ tinh thần.", more: "mental / emotional / physical well-being · a **sense of** well-being · **improve / promote** well-being · không đếm được" },
          { w: "contentment", pos: "n", ipa: "/kənˈtentmənt/", vi: "sự mãn nguyện, bằng lòng", ex: "Lasting contentment rarely comes from possessions.", exVi: "Sự mãn nguyện lâu dài hiếm khi đến từ của cải.", more: "adj: **content** /kənˈtent/ **with** N (trọng âm sau; khác danh từ ‘content’ /ˈkɒntent/ = nội dung)" },
          { w: "fulfilment", pos: "n", ipa: "/fʊlˈfɪlmənt/", vi: "sự viên mãn; cảm giác đạt được điều có ý nghĩa", ex: "Many people find greater fulfilment in voluntary work than in their paid jobs.", exVi: "Nhiều người tìm thấy sự viên mãn trong việc tình nguyện nhiều hơn trong việc được trả lương.", more: "a **sense of** fulfilment · **find / seek** fulfilment · adj: fulfilling (a fulfilling career) · v: fulfil your potential · Mỹ: fulfillment" },
          { w: "resilience", pos: "n", ipa: "/rɪˈzɪliəns/", vi: "sức bật tinh thần, khả năng đứng dậy sau khó khăn", ex: "Team sports can help children build emotional resilience.", exVi: "Thể thao đồng đội có thể giúp trẻ xây dựng sức bật cảm xúc.", more: "**build / develop / show** resilience · adj: resilient · resilience **in the face of** hardship · Ngày 2 đã gặp nghĩa môi trường: resilience to floods" },
          { w: "self-esteem", pos: "n", ipa: "/ˌself ɪˈstiːm/", vi: "lòng tự trọng, cách một người đánh giá giá trị bản thân", ex: "Constant comparison with others online can damage teenagers' self-esteem.", exVi: "Việc liên tục so sánh với người khác trên mạng có thể làm tổn hại lòng tự trọng của thiếu niên.", more: "low / high self-esteem · **boost / raise / damage / undermine** self-esteem (boost / raise tự nhiên hơn increase)" },
          { w: "anxiety", pos: "n", ipa: "/æŋˈzaɪəti/", vi: "sự lo âu; chứng lo âu", ex: "Exam pressure is a major source of anxiety among secondary-school students.", exVi: "Áp lực thi cử là nguồn lo âu lớn ở học sinh trung học.", more: "**suffer from / experience / reduce** anxiety · adj: anxious **about** N · anxiety **over / about** N" },
          { w: "depression", pos: "n", ipa: "/dɪˈpreʃn/", vi: "bệnh trầm cảm", ex: "Long-term unemployment is closely linked to depression.", exVi: "Thất nghiệp kéo dài có liên hệ chặt với trầm cảm.", more: "suffer from depression · adj: **depressed** (người) ≠ **depressing** (việc gây buồn) · be prone to depression" },
          { w: "optimistic", pos: "adj", ipa: "/ˌɒptɪˈmɪstɪk/", vi: "lạc quan", ex: "People who are optimistic about the future tend to recover from illness faster.", exVi: "Người lạc quan về tương lai thường hồi phục sau bệnh nhanh hơn.", more: "optimistic **about** N · n: optimism · trái nghĩa: pessimistic · cautiously optimistic" },
          { w: "gratitude", pos: "n", ipa: "/ˈɡrætɪtjuːd/", vi: "lòng biết ơn", ex: "Keeping a gratitude diary has been shown to improve mood.", exVi: "Viết nhật ký biết ơn đã được chứng minh là cải thiện tâm trạng.", more: "**express / show** gratitude **to** sb **for** sth · adj: grateful **for** N" },
          { w: "life satisfaction", pos: "n", ipa: "/laɪf ˌsætɪsˈfækʃn/", vi: "mức hài lòng với cuộc sống", ex: "Surveys suggest that life satisfaction rises with income only up to a point.", exVi: "Các khảo sát gợi ý rằng mức hài lòng với cuộc sống chỉ tăng theo thu nhập tới một mức nào đó.", more: "job satisfaction · **derive** satisfaction **from** N · a high level of satisfaction" },
          { w: "burnout", pos: "n", ipa: "/ˈbɜːnaʊt/", vi: "sự kiệt sức vì làm việc quá tải kéo dài", ex: "Burnout is increasingly common among junior doctors.", exVi: "Kiệt sức ngày càng phổ biến ở bác sĩ trẻ.", more: "**suffer / experience / prevent** burnout · adj: burnt out (I'm completely burnt out) · âm /ɜː/ — Ngày 3" },
          { w: "loneliness", pos: "n", ipa: "/ˈləʊnlinəs/", vi: "sự cô đơn", ex: "Loneliness among elderly people living alone has become a public-health concern.", exVi: "Sự cô đơn ở người già sống một mình đã thành mối lo của y tế cộng đồng.", more: "adj: **lonely** (buồn vì cô đơn) ≠ **alone** (một mình, không hàm ý buồn) · social isolation" },
          { w: "mental health", pos: "n", ipa: "/ˌmentl ˈhelθ/", vi: "sức khoẻ tinh thần / tâm thần", ex: "Schools are under pressure to do more to protect pupils' mental health.", exVi: "Trường học đang chịu sức ép phải làm nhiều hơn để bảo vệ sức khoẻ tinh thần của học sinh.", more: "mental health **problems / issues / services** · mental illness · không nói ~~spirit health~~ / ~~spiritual health~~ (spiritual = tâm linh)" },
        ],
      },

      { t: "h", text: "3. Hành vi và động lực (behaviour & motivation) — 13 từ" },
      {
        t: "p",
        text: "Nhóm này trả lời câu hỏi Part 3 quen thuộc nhất: **“Why do people…?”** — vì sao người ta mua sắm bốc đồng, trì hoãn, chạy theo đám đông, nghiện điện thoại.",
      },
      {
        t: "vocab",
        items: [
          { w: "motivation", pos: "n", ipa: "/ˌməʊtɪˈveɪʃn/", vi: "động lực", ex: "Intrinsic motivation — doing something because it is rewarding in itself — tends to last longer than the promise of a bonus.", exVi: "Động lực nội tại — làm việc gì vì bản thân nó đã đáng làm — thường bền hơn lời hứa về tiền thưởng.", more: "**intrinsic** /ɪnˈtrɪnzɪk/ (nội tại) ↔ **extrinsic** (từ bên ngoài) motivation · **lack / lose** motivation · v: motivate sb **to** V" },
          { w: "incentive", pos: "n", ipa: "/ɪnˈsentɪv/", vi: "điều khuyến khích, động cơ (thường do người khác đặt ra)", ex: "Tax breaks give companies an incentive to invest in staff training.", exVi: "Ưu đãi thuế tạo động cơ để công ty đầu tư đào tạo nhân viên.", more: "a financial incentive · an incentive **to** V / **for** sb · **offer / provide / create** an incentive" },
          { w: "impulse", pos: "n", ipa: "/ˈɪmpʌls/", vi: "cơn bốc đồng, thôi thúc bất chợt", ex: "Supermarkets place sweets near the tills to encourage impulse buying.", exVi: "Siêu thị đặt kẹo gần quầy tính tiền để khuyến khích mua bốc đồng.", more: "**on impulse** (I bought it on impulse) · impulse buying · **resist / control** an impulse · adj: impulsive" },
          { w: "self-discipline", pos: "n", ipa: "/ˌself ˈdɪsəplɪn/", vi: "kỷ luật bản thân", ex: "Studying online demands a good deal of self-discipline.", exVi: "Học trực tuyến đòi hỏi khá nhiều kỷ luật bản thân.", more: "**require / lack / develop** self-discipline · adj: self-disciplined · gần nghĩa: self-control, willpower" },
          { w: "procrastinate", pos: "v", ipa: "/prəˈkræstɪneɪt/", vi: "trì hoãn, lần lữa việc cần làm", ex: "Students often procrastinate because a task seems too large to begin.", exVi: "Sinh viên thường trì hoãn vì nhiệm vụ có vẻ quá lớn để bắt đầu.", more: "n: procrastination · văn thường: put things off · trọng âm ở -cras-" },
          { w: "conform", pos: "v", ipa: "/kənˈfɔːm/", vi: "làm theo, tuân theo (số đông, chuẩn mực)", ex: "Teenagers feel strong pressure to conform to the expectations of their friends.", exVi: "Thiếu niên chịu sức ép lớn phải làm theo kỳ vọng của bạn bè.", more: "conform **to** N (norms / expectations / rules) · n: conformity · n/adj: (non-)conformist" },
          { w: "peer pressure", pos: "n", ipa: "/ˈpɪə preʃə/", vi: "áp lực từ bạn bè đồng trang lứa", ex: "Many young people start smoking as a result of peer pressure.", exVi: "Nhiều người trẻ bắt đầu hút thuốc do áp lực bạn bè.", more: "**give in to / resist / be under** peer pressure · peer = người cùng lứa, cùng vị thế (peer group)" },
          { w: "gratification", pos: "n", ipa: "/ˌɡrætɪfɪˈkeɪʃn/", vi: "sự thoả mãn (một ham muốn)", ex: "Smartphones offer instant gratification, which makes long-term goals harder to pursue.", exVi: "Điện thoại thông minh đem lại sự thoả mãn tức thì, khiến mục tiêu dài hạn khó theo đuổi hơn.", more: "**instant** gratification ↔ **delayed** gratification (hoãn sự thoả mãn) · v: gratify · khác gratitude (biết ơn)" },
          { w: "addictive", pos: "adj", ipa: "/əˈdɪktɪv/", vi: "gây nghiện", ex: "Some mobile games are deliberately designed to be addictive.", exVi: "Một số trò chơi di động được cố ý thiết kế để gây nghiện.", more: "highly addictive · n: addiction **to** N · be **addicted to** N / V-ing · n (người): addict" },
          { w: "compulsive", pos: "adj", ipa: "/kəmˈpʌlsɪv/", vi: "(hành vi) không cưỡng lại được, như bị thôi thúc", ex: "Compulsive checking of social media has been linked to poor sleep.", exVi: "Việc kiểm tra mạng xã hội không dứt ra được có liên quan tới giấc ngủ kém.", more: "compulsive **behaviour / shopping / gambling** · a compulsive liar · n: compulsion · khác **compulsory** (bắt buộc theo quy định)" },
          { w: "stimulus", pos: "n", ipa: "/ˈstɪmjələs/", vi: "tác nhân kích thích (số nhiều: stimuli)", ex: "Babies respond to visual stimuli within days of birth.", exVi: "Trẻ sơ sinh phản ứng với các kích thích thị giác chỉ vài ngày sau khi sinh.", more: "số nhiều **stimuli** /ˈstɪmjəlaɪ/ · respond **to** a stimulus · v: stimulate · n: stimulation" },
          { w: "trigger", pos: "v", ipa: "/ˈtrɪɡə/", vi: "gây ra, kích hoạt (một phản ứng, thường đột ngột)", ex: "Financial worries can trigger anxiety and sleeplessness.", exVi: "Lo lắng tài chính có thể gây ra lo âu và mất ngủ.", more: "trigger **a response / a reaction / memories / anxiety** · n: a trigger **for** N" },
          { w: "reinforce", pos: "v", ipa: "/ˌriːɪnˈfɔːs/", vi: "củng cố, làm mạnh thêm (hành vi, niềm tin)", ex: "Praising children immediately reinforces the behaviour you want to see.", exVi: "Khen trẻ ngay lập tức sẽ củng cố hành vi bạn muốn thấy.", more: "reinforce **a behaviour / a habit / a stereotype / the idea that** · n: positive reinforcement · ôn Ngày 1 (reinforce a belief) — nay dùng cho hành vi" },
        ],
      },

      { t: "h", text: "4. Tính cách và sự hình thành con người (personality & development) — 8 từ" },
      {
        t: "p",
        text: "Câu hỏi kinh điển của tâm lý học — và của Part 3: con người là sản phẩm của **gen** hay của **môi trường** (==nature versus nurture==)? Tám từ dưới đủ để bạn lập luận cả hai phía.",
      },
      {
        t: "vocab",
        items: [
          { w: "trait", pos: "n", ipa: "/treɪt/", vi: "nét (tính cách, đặc điểm)", ex: "Curiosity is a personality trait that employers increasingly value.", exVi: "Tò mò là một nét tính cách mà nhà tuyển dụng ngày càng coi trọng.", more: "a personality / character trait · inherited / genetic traits · **share** a trait" },
          { w: "temperament", pos: "n", ipa: "/ˈtemprəmənt/", vi: "tính khí, khí chất (phần bẩm sinh của tính cách)", ex: "Even as babies, the twins had very different temperaments.", exVi: "Ngay từ lúc sơ sinh, cặp song sinh đã có tính khí rất khác nhau.", more: "a calm / nervous / artistic temperament · adj: temperamental (thất thường) · đọc 3 âm tiết" },
          { w: "innate", pos: "adj", ipa: "/ɪˈneɪt/", vi: "bẩm sinh", ex: "It is still debated whether musical talent is innate or acquired.", exVi: "Người ta vẫn tranh luận tài năng âm nhạc là bẩm sinh hay do rèn luyện.", more: "an innate ability / sense / tendency · trái nghĩa: acquired, learned · gần nghĩa: inborn, inherent" },
          { w: "upbringing", pos: "n", ipa: "/ˈʌpbrɪŋɪŋ/", vi: "sự nuôi dạy (cách một người được nuôi lớn)", ex: "Her confidence owes a great deal to her upbringing.", exVi: "Sự tự tin của cô ấy phần lớn nhờ cách cô được nuôi dạy.", more: "a strict / privileged / rural upbringing · v: bring up (be brought up **by** / **in**) · thường số ít" },
          { w: "nurture", pos: "v", ipa: "/ˈnɜːtʃə/", vi: "nuôi dưỡng, vun đắp", ex: "Good teachers nurture curiosity rather than simply rewarding correct answers.", exVi: "Giáo viên giỏi vun đắp sự tò mò chứ không chỉ thưởng cho câu trả lời đúng.", more: "nurture **talent / a relationship / an interest** · n: **nature versus nurture** (bẩm sinh hay nuôi dưỡng)" },
          { w: "empathy", pos: "n", ipa: "/ˈempəθi/", vi: "sự đồng cảm (đặt mình vào vị trí người khác)", ex: "Reading fiction is said to increase empathy for people unlike ourselves.", exVi: "Người ta nói đọc tiểu thuyết làm tăng sự đồng cảm với những người không giống ta.", more: "empathy **for / with** sb · **show / lack** empathy · v: empathise with · ≠ **sympathy** (thương cảm, thấy tội)" },
          { w: "introvert", pos: "n", ipa: "/ˈɪntrəvɜːt/", vi: "người hướng nội", ex: "Open-plan offices can be exhausting for introverts.", exVi: "Văn phòng không vách ngăn có thể làm người hướng nội kiệt sức.", more: "adj: introverted · trái nghĩa: **extrovert** /ˈekstrəvɜːt/ · không nhầm với shy (nhút nhát)" },
          { w: "adolescence", pos: "n", ipa: "/ˌædəˈlesns/", vi: "tuổi vị thành niên", ex: "Friendships formed during adolescence often shape a person's values for life.", exVi: "Tình bạn hình thành ở tuổi vị thành niên thường định hình giá trị của một người suốt đời.", more: "**during / in** adolescence · n/adj: adolescent · các chặng: infancy → childhood → adolescence → adulthood" },
        ],
      },

      { t: "h", text: "5. Động từ học thuật nói về TÁC ĐỘNG — 6 từ" },
      {
        t: "p",
        text: "Band 6 nói mọi tác động bằng **affect / make / cause**. Band 7 chọn động từ theo **chiều** (tốt / xấu) và **cách** (từ từ / đột ngột). Sáu động từ này dùng được cho gần như mọi đề Task 2.",
      },
      {
        t: "vocab",
        items: [
          { w: "cope", pos: "v", ipa: "/kəʊp/", vi: "đối phó, xoay xở được", ex: "Young carers often struggle to cope with the demands of school.", exVi: "Những người trẻ phải chăm người thân thường chật vật đối phó với yêu cầu ở trường.", more: "cope **with** N (stress / pressure / change) · a coping strategy / mechanism · không tân ngữ trực tiếp: ~~cope the stress~~" },
          { w: "suppress", pos: "v", ipa: "/səˈpres/", vi: "kìm nén, dập xuống", ex: "Boys are sometimes taught to suppress their emotions.", exVi: "Con trai đôi khi được dạy phải kìm nén cảm xúc.", more: "suppress **emotions / anger / a smile / the urge to** V · n: suppression · khác oppress (áp bức)" },
          { w: "undermine", pos: "v", ipa: "/ˌʌndəˈmaɪn/", vi: "làm suy yếu dần, làm xói mòn", ex: "Constant criticism undermines a child's confidence.", exVi: "Chỉ trích liên tục làm xói mòn sự tự tin của trẻ.", more: "undermine **confidence / trust / authority / efforts to** V · tác động xấu, từ từ" },
          { w: "foster", pos: "v", ipa: "/ˈfɒstə/", vi: "nuôi dưỡng, thúc đẩy (điều tốt)", ex: "Group projects foster a sense of belonging among new students.", exVi: "Dự án nhóm nuôi dưỡng cảm giác thuộc về ở sinh viên mới.", more: "foster **a sense of N / creativity / independence / good relations** · tác động tốt, từ từ · gần nghĩa: cultivate, promote" },
          { w: "attribute", pos: "v", ipa: "/əˈtrɪbjuːt/", vi: "quy (kết quả) cho (nguyên nhân)", ex: "Researchers attribute the rise in anxiety to academic pressure rather than to technology.", exVi: "Các nhà nghiên cứu quy sự gia tăng lo âu cho áp lực học tập hơn là cho công nghệ.", more: "attribute A **to** B · bị động: is (often / widely) attributed to · danh từ **attribute** /ˈætrɪbjuːt/ (trọng âm đầu) = phẩm chất" },
          { w: "derive", pos: "v", ipa: "/dɪˈraɪv/", vi: "thu được, có được (từ một nguồn)", ex: "Most people derive more pleasure from experiences than from possessions.", exVi: "Đa số người có được nhiều niềm vui từ trải nghiệm hơn là từ của cải.", more: "derive **pleasure / satisfaction / benefit** **from** N · be derived from (bắt nguồn từ)" },
        ],
      },

      { t: "h", text: "6. Collocation cho Task 2 và Part 3 — học cả cụm" },
      {
        t: "table",
        caption: "Động từ + danh từ — cột ‘Đừng viết’ là lỗi thật của bài band 6",
        head: ["Ý muốn nói", "Collocation band 7", "Đừng viết"],
        rows: [
          ["Tăng lòng tự trọng", "**boost / raise** self-esteem (increase cũng gặp nhưng nhạt hơn)", "~~upgrade self-esteem~~ · ~~make self-esteem higher~~"],
          ["Bị lo âu / trầm cảm", "**suffer from** anxiety / depression", "~~have anxiety disease~~ · ~~get depression~~"],
          ["Có được niềm vui từ…", "**derive** pleasure / satisfaction **from**", "~~get happiness from~~"],
          ["Cảm giác viên mãn / thuộc về", "**a sense of** fulfilment / belonging / purpose", "~~a feeling of fulfil~~"],
          ["Chịu áp lực", "**be under** pressure · **put** pressure **on** sb", "~~have a pressure~~ · ~~make pressure~~"],
          ["Đối phó với căng thẳng", "**cope with / manage / relieve** stress", "~~solve stress~~ · ~~reduce stressful~~"],
          ["Hình thành / bỏ thói quen", "**form / develop** a habit · **break / kick** a habit", "~~make a habit~~ · ~~stop a habit~~"],
          ["Chiều theo cám dỗ", "**give in to** temptation / peer pressure · **resist** the urge to", "~~be lost by temptation~~"],
          ["Định hình tính cách", "**shape** sb's character / personality / attitudes", "~~make the character~~"],
          ["Theo đuổi hạnh phúc", "**pursue** happiness · the **pursuit of** happiness", "~~chase the happy~~"],
          ["Ảnh hưởng xấu tới…", "**take a toll on** sb's health · have a **detrimental effect on**", "~~affect badly to~~"],
          ["Nâng cao nhận thức", "**raise awareness of** mental health issues", "~~increase the knowledge about~~"],
        ],
      },
      {
        t: "table",
        caption: "Tính từ + danh từ và trạng từ + tính từ",
        head: ["Cụm", "Nghĩa", "Câu mẫu"],
        rows: [
          ["**material** possessions / wealth", "của cải vật chất", "Material possessions bring only short-lived pleasure."],
          ["**emotional** support / intelligence", "chỗ dựa / trí tuệ cảm xúc", "Close friends provide emotional support in difficult times."],
          ["a **deep-rooted** / **deep-seated** habit, fear", "ăn sâu, khó đổi", "Deep-rooted habits are hard to break."],
          ["**short-lived** / **lasting** happiness", "ngắn ngủi / lâu bền", "The pleasure of a new purchase is notoriously short-lived."],
          ["**highly** motivated / addictive", "rất (có động lực / gây nghiện)", "Highly motivated students need little supervision."],
          ["**emotionally** drained / stable", "kiệt quệ / ổn định về cảm xúc", "Nurses often feel emotionally drained after a night shift."],
          ["**socially** isolated", "bị cô lập về xã hội", "Older men living alone are at risk of becoming socially isolated."],
          ["a **work–life** balance", "cân bằng công việc – cuộc sống", "A healthy work–life balance is central to well-being."],
        ],
      },
      {
        t: "note",
        title: "📌 Register — chữ nào cho bài viết, chữ nào cho bài nói",
        items: [
          "**Viết (Task 2)**: well-being · derive satisfaction from · have a detrimental effect on · be prone to · foster · undermine.",
          "**Nói (Part 3)**: feel down · stressed out · be on edge (bồn chồn) · it gets me down · cheer sb up · I'm a bit of an introvert. Dùng trong bài viết ⇒ lệch văn phong.",
          "**Đừng chẩn đoán bừa**: “depression” là **bệnh**. Buồn bình thường ⇒ feel low / feel down / be upset. Viết “students get depression before exams” vừa sai collocation vừa quá lời.",
          "**crazy / mad / insane** để nói người có vấn đề tâm thần là thô và không chấp nhận được trong văn học thuật ⇒ people with mental health problems.",
        ],
      },

      { t: "h", text: "7. Tám cặp từ người Việt hay lẫn" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng"],
        rows: [
          ["**stressed** / **stressful**", "người **cảm thấy** / việc **gây ra**", "I feel **stressed**. · It is a **stressful** job. (~~I feel stressful~~)"],
          ["**depressed** / **depressing**", "người bị / việc gây buồn", "He became **depressed**. · The news was **depressing**."],
          ["**sympathy** / **empathy**", "thương cảm (thấy tội) / đồng cảm (hiểu từ bên trong)", "I have **sympathy for** the victims. · A good nurse shows **empathy**."],
          ["**conscious** / **conscience**", "adj: có ý thức, tỉnh / n: lương tâm", "She is **conscious of** the risk. · He has a guilty **conscience**."],
          ["**sensible** / **sensitive**", "hợp lý, biết điều / nhạy cảm", "a **sensible** decision · **sensitive to** criticism"],
          ["**mental** / **spiritual**", "tinh thần, tâm thần / tâm linh, tôn giáo", "**mental** health (không ~~spiritual health~~ khi nói tâm lý)"],
          ["**lonely** / **alone**", "buồn vì cô đơn / một mình (trung tính)", "She lives **alone** but never feels **lonely**."],
          ["**affect** / **effect**", "động từ / danh từ", "Stress **affects** sleep. · Stress has an **effect on** sleep. (~~affect to~~)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Sáu lỗi dùng từ làm LR dừng ở 6",
        items: [
          "~~feel stressful / feel boring / feel depressing~~ → feel **stressed / bored / depressed** (-ed cho người cảm thấy).",
          "~~a pressure~~ / ~~pressures from study~~ → **pressure** không đếm được khi nói chung: be under **a lot of pressure**; academic **pressure**.",
          "~~confident in himself~~ dùng như danh từ: ~~He has no confident.~~ → He has no **confidence** / He is not **confident**.",
          "~~psychology problems~~ → **psychological** problems (tính từ) · psychology = môn tâm lý học · psychologist = nhà tâm lý.",
          "~~behaviors of people is~~ → **behaviour** thường không đếm được: human **behaviour is**… (số nhiều behaviours chỉ dùng trong văn chuyên ngành).",
          "~~happy with their life~~ lặp năm lần → luân phiên: content with · satisfied with · fulfilled · a high level of well-being.",
        ],
      },

      { t: "h", text: "8. Họ từ — đổi loại từ để paraphrase" },
      {
        t: "table",
        head: ["Danh từ", "Động từ", "Tính từ", "Trạng từ"],
        rows: [
          ["psychology · psychologist", "—", "psychological", "psychologically"],
          ["motivation · motive", "motivate", "motivated · motivating · motivational", "—"],
          ["perception", "perceive", "perceptive · perceptible", "perceptibly"],
          ["anxiety", "—", "anxious", "anxiously"],
          ["resilience", "—", "resilient", "resiliently"],
          ["fulfilment", "fulfil", "fulfilling · fulfilled", "—"],
          ["addiction · addict", "(be) addicted to", "addictive · addicted", "addictively"],
          ["conformity", "conform", "conformist", "—"],
          ["optimism · optimist", "—", "optimistic", "optimistically"],
          ["impulse", "—", "impulsive", "impulsively"],
          ["empathy", "empathise", "empathetic", "empathetically"],
          ["behaviour", "behave", "behavioural", "behaviourally"],
        ],
      },

      { t: "h", text: "9. Phát âm từ khó của chủ đề" },
      {
        t: "p",
        text: "Ba bẫy phát âm của nhóm từ này: ① chữ **p câm** trong **psych-** — đọc /saɪk/, không có /p/; ② **anxious** /ˈæŋkʃəs/ nhưng **anxiety** /æŋˈzaɪəti/ — chữ x đổi từ /kʃ/ sang /z/ và trọng âm dời; ③ họ từ **dời trọng âm**: psyCHOlogy → psychoLOgical; MOtivate → motiVAtion.",
      },
      {
        t: "table",
        caption: "Trọng âm dời trong họ từ (âm tiết in HOA mang trọng âm)",
        head: ["Từ gốc", "Từ phái sinh", "Ghi nhớ"],
        rows: [
          ["psyCHOlogy /saɪˈkɒlədʒi/", "psychoLOgical /ˌsaɪkəˈlɒdʒɪkl/", "-ical ⇒ trọng âm ngay trước -ical"],
          ["ANxious /ˈæŋkʃəs/", "anXIety /æŋˈzaɪəti/", "-ity / -ety ⇒ trọng âm ngay trước"],
          ["MOtivate /ˈməʊtɪveɪt/", "motiVAtion /ˌməʊtɪˈveɪʃn/", "-tion ⇒ trọng âm ngay trước -tion"],
          ["CONscious /ˈkɒnʃəs/", "CONsciousness /ˈkɒnʃəsnəs/", "-ness không đổi trọng âm"],
          ["OPtimism /ˈɒptɪmɪzəm/", "optiMIStic /ˌɒptɪˈmɪstɪk/", "-ic ⇒ trọng âm ngay trước -ic"],
          ["atTRIbute (v) /əˈtrɪbjuːt/", "ATtribute (n) /ˈætrɪbjuːt/", "động từ nhấn sau, danh từ nhấn đầu"],
        ],
      },
      {
        t: "phatam",
        id: "t4d4-phat-am",
        title: "Luyện phát âm — psych-, anxious / anxiety và trọng âm họ từ",
        note: "Bốn dòng đầu là họ từ: đọc chậm, nghe trọng âm dời. Các dòng sau là câu dùng từ của bài. Máy chấm từng âm — xem bạn có thêm /p/ vào psychology, hay đọc anxiety thành /ˈæŋkʃ…/ không.",
        items: [
          { text: "psychology, psychologist, psychological", ipa: "saɪkɒlədʒi saɪkɒlədʒɪst saɪkəlɒdʒɪkl", vi: "tâm lý học · nhà tâm lý · thuộc tâm lý" },
          { text: "anxious, anxiety", ipa: "æŋkʃəs æŋzaɪəti", vi: "lo âu (adj) · sự lo âu" },
          { text: "conscious, conscience, consciousness", ipa: "kɒnʃəs kɒnʃəns kɒnʃəsnəs", vi: "có ý thức · lương tâm · ý thức" },
          { text: "motivate, motivation, optimistic", ipa: "məʊtɪveɪt məʊtɪveɪʃn ɒptɪmɪstɪk", vi: "tạo động lực · động lực · lạc quan" },
          { text: "Psychologists study human behaviour.", ipa: "saɪkɒlədʒɪsts stʌdi hjuːmən bɪheɪvjə", vi: "Các nhà tâm lý nghiên cứu hành vi con người." },
          { text: "Anxiety can undermine a child's confidence.", ipa: "æŋzaɪəti kən ʌndəmaɪn ə tʃaɪldz kɒnfɪdəns", vi: "Lo âu có thể làm xói mòn sự tự tin của một đứa trẻ." },
          { text: "Empathy is not an innate trait.", ipa: "empəθi ɪz nɒt ən ɪneɪt treɪt", vi: "Đồng cảm không phải một nét bẩm sinh." },
          { text: "She derives real fulfilment from her work.", ipa: "ʃi dɪraɪvz rɪəl fʊlfɪlmənt frəm hə wɜːk", vi: "Cô ấy có được sự viên mãn thật sự từ công việc." },
          { text: "Peer pressure reinforces impulsive behaviour.", ipa: "pɪə preʃə riːɪnfɔːsɪz ɪmpʌlsɪv bɪheɪvjə", vi: "Áp lực bạn bè củng cố hành vi bốc đồng." },
          { text: "Our subconscious biases shape our perceptions.", ipa: "aʊə sʌbkɒnʃəs baɪəsɪz ʃeɪp aʊə pəsepʃnz", vi: "Những thiên kiến tiềm thức định hình cách ta nhìn nhận." },
        ],
      },

      { t: "h", text: "10. Luyện tập" },
      {
        t: "quiz",
        id: "t4d4-tv-dien",
        kind: "fill",
        title: "Điền MỘT từ đã học — chữ cái đầu cho sẵn (12 câu)",
        items: [
          { q: "1. Volunteering gives many retired people a sense of f___ that they no longer get from work.", answers: ["fulfilment", "fulfillment"] },
          { q: "2. Children who grow up in poverty often show remarkable r___ in the face of hardship.", answers: ["resilience"] },
          { q: "3. Teenagers may start drinking simply because they give in to peer p___.", answers: ["pressure"] },
          { q: "4. Most consumers believe they are r___, yet they are easily influenced by packaging.", answers: ["rational"] },
          { q: "5. Being praised only for results can u___ a child's willingness to try difficult tasks.", answers: ["undermine"] },
          { q: "6. The report a___ the rise in loneliness to the decline of local community groups.", answers: ["attributes", "attributed"] },
          { q: "7. Is leadership an i___ quality, or can it be taught?", answers: ["innate"] },
          { q: "8. People who can delay g___ tend to save more for retirement.", answers: ["gratification"] },
          { q: "9. A strict u___ does not necessarily produce disciplined adults.", answers: ["upbringing"] },
          { q: "10. Long hours and little control over one's work are the main causes of b___ among teachers.", answers: ["burnout"] },
          { q: "11. Bright colours and loud music are powerful s___ for very young children. (số nhiều)", answers: ["stimuli"] },
          { q: "12. The scheme offers employers a financial i___ to hire older workers.", answers: ["incentive"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d4-tv-collocation",
        title: "Chọn collocation / từ đúng (10 câu)",
        items: [
          { q: "1. Regular praise from teachers can ___ a shy pupil's self-esteem.", options: ["upgrade", "boost", "grow", "enlarge"], correct: 1, why: "Collocation: boost / raise self-esteem. upgrade dùng cho máy móc, dịch vụ (upgrade software); grow / enlarge không đi với self-esteem." },
          { q: "2. One in four adults will ___ anxiety or depression at some point in their lives.", options: ["suffer from", "catch", "have got with", "be suffered"], correct: 0, why: "suffer from + bệnh / chứng (anxiety, depression). catch chỉ dùng cho bệnh lây; be suffered sai dạng." },
          { q: "3. I always feel ___ before a presentation, even when I'm well prepared.", options: ["stressful", "stress", "stressed", "stressing"], correct: 2, why: "Người cảm thấy ⇒ -ed: feel stressed. stressful mô tả việc gây căng thẳng (a stressful week)." },
          { q: "4. Most people ___ more lasting satisfaction from relationships than from material possessions.", options: ["earn", "attribute", "foster", "derive"], correct: 3, why: "derive satisfaction / pleasure FROM. attribute A to B = quy A cho B; foster = nuôi dưỡng điều gì ở người khác." },
          { q: "5. A good counsellor needs ___ — the ability to see a problem through the client's eyes.", options: ["sympathy", "empathy", "apathy", "conscience"], correct: 1, why: "empathy = đồng cảm, đặt mình vào vị trí người khác. sympathy = thương cảm; apathy = thờ ơ; conscience = lương tâm." },
          { q: "6. Working night shifts for years can take a heavy ___ on a person's mental health.", options: ["toll", "price", "cost", "damage"], correct: 0, why: "Thành ngữ cố định: take a (heavy) toll on = gây tổn hại dần dần." },
          { q: "7. Schools should do more to ___ awareness of mental health issues among teenagers.", options: ["rise", "lift", "raise", "grow"], correct: 2, why: "raise awareness of. rise là nội động từ (không có tân ngữ)." },
          { q: "8. Attendance at the first lecture is ___; students who miss it cannot join the course.", options: ["compulsive", "impulsive", "addictive", "compulsory"], correct: 3, why: "compulsory = bắt buộc theo quy định. compulsive = (hành vi) không cưỡng được — hai từ rất hay lẫn." },
          { q: "9. Advertising works largely at a ___ level: we are rarely aware of its influence.", options: ["conscience", "subconscious", "self-conscious", "sensible"], correct: 1, why: "at a subconscious level = ở tầng tiềm thức. self-conscious = ngượng ngùng, tự ti; conscience = lương tâm (danh từ)." },
          { q: "10. Smoking is a ___ habit that most people find extremely hard to break.", options: ["deep-rooted", "short-lived", "high", "strong-minded"], correct: 0, why: "a deep-rooted habit = thói quen ăn sâu; đi với break a habit. short-lived = ngắn ngủi (ngược nghĩa)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d4-tv-ho-tu",
        kind: "fill",
        title: "Viết dạng đúng của từ trong ngoặc (8 câu)",
        items: [
          { q: "1. Unemployment has serious ___ (PSYCHOLOGY) consequences as well as financial ones.", answers: ["psychological"] },
          { q: "2. Students who are highly ___ (MOTIVATE) need very little supervision.", answers: ["motivated"] },
          { q: "3. There is a widespread ___ (PERCEIVE) that young people are lazier than previous generations.", answers: ["perception"] },
          { q: "4. Many parents are ___ (ANXIETY) about the amount of time their children spend online.", answers: ["anxious"] },
          { q: "5. Teaching is exhausting, but most teachers describe it as deeply ___ (FULFIL).", answers: ["fulfilling"] },
          { q: "6. Video games are often criticised for being highly ___ (ADDICT).", answers: ["addictive"] },
          { q: "7. Social ___ (CONFORM) is stronger in small communities, where everyone knows everyone else.", answers: ["conformity"] },
          { q: "8. He bought the car ___ (IMPULSE) and regretted it within a week.", answers: ["impulsively"] },
        ],
      },
      {
        t: "quiz",
        id: "t4d4-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng collocation gợi ý (5 câu)",
        grammar: "suffer from · derive … from · take a toll on · foster a sense of · give in to",
        items: [
          { q: "Ngày càng nhiều sinh viên bị lo âu vì áp lực học tập.", answers: ["More and more students suffer from anxiety because of academic pressure.", "An increasing number of students suffer from anxiety because of academic pressure.", "A growing number of students suffer from anxiety because of academic pressure.", "A growing number of students are suffering from anxiety because of academic pressure.", "An increasing number of students are suffering from anxiety due to academic pressure.", "More and more students are suffering from anxiety because of academic pressure.", "A growing number of students suffer from anxiety due to academic pressure."], hint: "suffer from anxiety · academic pressure (không a)" },
          { q: "Nhiều người có được sự hài lòng từ việc giúp đỡ người khác.", answers: ["Many people derive satisfaction from helping others.", "Many people derive satisfaction from helping other people.", "A lot of people derive satisfaction from helping others."], hint: "derive satisfaction from + V-ing" },
          { q: "Làm việc nhiều giờ có thể gây tổn hại cho sức khoẻ tinh thần.", answers: ["Working long hours can take a toll on mental health.", "Working long hours can take a toll on your mental health.", "Working long hours can take a toll on people's mental health.", "Long working hours can take a toll on mental health.", "Working long hours can take a heavy toll on mental health."], hint: "working long hours · take a toll on · mental health" },
          { q: "Thể thao đồng đội nuôi dưỡng cảm giác thuộc về ở trẻ em.", answers: ["Team sports foster a sense of belonging in children.", "Team sports foster a sense of belonging among children.", "Team sports foster children's sense of belonging."], hint: "foster a sense of belonging" },
          { q: "Thanh thiếu niên thường chiều theo áp lực bạn bè vì họ muốn được chấp nhận.", answers: ["Teenagers often give in to peer pressure because they want to be accepted.", "Adolescents often give in to peer pressure because they want to be accepted.", "Teenagers often give in to peer pressure as they want to be accepted.", "Young people often give in to peer pressure because they want to be accepted."], hint: "give in to peer pressure · be accepted" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học 50 từ này cho nhớ",
        items: [
          "Mọi từ trong các khối trên tự vào **Flashcards** (bộ từ của khoá) và mục **Tra từ vựng**. Ôn theo lịch nhắc lại, mục tiêu: nhớ sau 7 ngày.",
          "Học **theo cụm**, không học từ rời: chép “boost self-esteem”, “derive satisfaction from”, “give in to peer pressure” — không chép “boost”, “derive”, “give in”.",
          "Mỗi nhóm chọn **3 từ** và đặt một câu về **chính bạn** (I tend to procrastinate when…). Câu về mình nhớ lâu gấp nhiều lần câu trong sách.",
          "Tối nay viết bài 2 — ép mình dùng **ít nhất 6 từ** của bài này, đúng collocation.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d4-viet",
    kind: "writing",
    title: "Viết: Opinion essay band 7 — ý mở rộng ba tầng, ví dụ cụ thể, không khái quát",
    goal: "Viết một bài Opinion (To what extent do you agree?) mà mỗi thân bài chỉ có MỘT ý nhưng được đẩy qua ba tầng — nhận định → cơ chế → ví dụ cụ thể — không còn câu khái quát kiểu “money cannot buy happiness”, có một phản đề “Granted…, but…”, và lập trường rõ từ câu đầu tới câu cuối — đúng mô tả TR band 7.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 3 Ngày 6 đã dạy Opinion band 6: **đếm vế đề**, thesis **có mức độ**, **một phản đề** một câu. Ngày 2 tuần này cho bạn thấy band 7 trông thế nào ở cả bốn tiêu chí. Hôm nay đào sâu đúng một chỗ: ==TR band 7 — “ý chính được mở rộng và chống đỡ”==.",
          "Bệnh của bài band 6: mỗi đoạn **3–4 ý**, mỗi ý **một câu**, nối bằng Firstly / Moreover / In addition. Giám khảo gọi là **“liệt kê”** — có ý nhưng không ý nào được **phát triển**.",
          "Thuốc: **một đoạn – một ý – ba tầng**. Tầng 1 **nhận định** (cái gì) → Tầng 2 **cơ chế** (vì sao / bằng cách nào) → Tầng 3 **ví dụ cụ thể** (trông thế nào trong đời thật) → câu **nối về đề**.",
          "**Ví dụ cụ thể** không phải là bịa số liệu. Đó là một **trường hợp điển hình** đủ chi tiết để người đọc hình dung được: hai đồng nghiệp cùng lương, một phụ huynh không chắc trả nổi tiền nhà.",
          "**Không khái quát**: “Rich people are not happy.” → “Wealth **does not necessarily** bring contentment.” Band 7 vẫn được phép “đôi chỗ còn khái quát” — nhưng band 6 thì khái quát **ở mọi ý**.",
          "Phản đề kiểu band 7: **Granted, …, but…** — nêu rồi **bác ngay trong cùng một câu** (nối W19 ở Ngày 2).",
        ],
      },

      { t: "h", text: "1. TR band 6 và band 7 — khác nhau đúng một chữ: “phát triển”" },
      {
        t: "table",
        caption: "Mô tả công khai của tiêu chí Task Response — nói bằng lời dễ hiểu",
        head: ["", "Band 6", "Band 7"],
        rows: [
          ["Trả lời đề", "Đủ mọi phần, nhưng **phần sâu phần nông**", "Đủ mọi phần, **phần nào cũng được bàn**"],
          ["Lập trường", "Có, nhưng **kết luận có thể mờ hoặc lặp**", "**Rõ suốt bài** — mở bài, từng câu chủ đề, kết bài cùng một mức"],
          ["Ý chính", "Liên quan, nhưng **có ý chưa phát triển đủ / chưa rõ**", "Được **mở rộng và chống đỡ**; đôi chỗ còn khái quát hoặc thiếu trọng tâm"],
          ["Dấu hiệu nhìn là thấy", "Firstly… Secondly… Moreover… — 3 ý / đoạn", "Một câu chủ đề → 4–5 câu **đào cùng một ý**"],
        ],
      },
      {
        t: "note",
        title: "💡 Phép thử 10 giây: bài của bạn đang “liệt kê” hay “phát triển”?",
        items: [
          "Đếm số **ý khác nhau** trong một thân bài. **Ba ý trở lên** ⇒ đang liệt kê.",
          "Che câu thứ hai của đoạn. Câu thứ ba **vẫn hiểu được** mà không cần câu hai ⇒ các câu **không dựa vào nhau** ⇒ đang liệt kê.",
          "Tìm chữ **because / which means / as a result / for instance** trong đoạn. Không có ⇒ chưa có tầng 2, tầng 3.",
        ],
      },

      { t: "h", text: "2. Đọc đề: đếm vế và tìm chữ bám (ôn Tập 3 Ngày 6, nâng mức)" },
      {
        t: "note",
        title: "📌 Đề bài — Writing Task 2",
        items: [
          "**Some people believe that happiness depends mainly on a person's attitude to life, and that external circumstances such as income have very little effect.**",
          "**To what extent do you agree or disagree?**",
          "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Mổ đề thành các vế",
        caption: "Hai vế nối bằng and. Đồng ý tuyệt đối ⇒ phải bảo vệ CẢ HAI. Chữ bám nằm ở mainly và very little.",
        steps: [
          { label: "Vế ① — happiness depends MAINLY on attitude", sub: "mainly = phần lớn, không phải hoàn toàn ⇒ dễ đồng ý" },
          { label: "Vế ② — circumstances (e.g. income) have VERY LITTLE effect", sub: "very little = gần như không ⇒ khẳng định mạnh, khó bảo vệ" },
          { label: "Câu hỏi: To what extent…?", sub: "⇒ phải nói rõ MỨC ĐỘ đồng ý" },
          { label: "Lập trường tự nhiên nhất", sub: "Đồng ý ① có điều kiện · không đồng ý ②" },
        ],
      },
      {
        t: "table",
        caption: "Ba lập trường viết được — và cái giá của từng lập trường",
        head: ["Lập trường", "Thesis mẫu", "Phải chứng minh"],
        rows: [
          ["**Đồng ý phần lớn**", "I largely agree: once basic needs are met, outlook matters far more than income.", "Phải giải thích vì sao tiền **ít** tác dụng — và xử lý trường hợp người nghèo trong một phản đề"],
          ["**Đồng ý một phần** (bài mẫu hôm nay)", "Attitude plays a major role, but the claim that circumstances hardly matter holds only for the comfortable.", "Thân bài 1: khi nào thái độ quyết định. Thân bài 2: khi nào hoàn cảnh quyết định"],
          ["**Không đồng ý**", "I disagree: circumstances set the limits within which attitude can operate.", "Phải thừa nhận vai trò của thái độ trong một phản đề, rồi bác"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba cách đọc sai đề này",
        items: [
          "**Lạc sang đề “Does money buy happiness?”** — đề hỏi **attitude so với circumstances**, tiền chỉ là **một ví dụ** (such as income). Cả bài chỉ nói về tiền ⇒ mất phần “attitude”.",
          "**Bỏ qua chữ mức độ**: viết như thể đề nói “happiness depends **only** on attitude” rồi bác — bạn đang bác một điều đề không nói.",
          "**“Both are important”** làm kết luận — đó không phải lập trường mà là né câu hỏi “to what extent”. Band 7 phải nói **cái nào hơn, trong điều kiện nào**.",
        ],
      },
      {
        t: "mcq",
        id: "t4d4-viet-dem-ve",
        title: "Đếm vế và tìm chữ bám (4 đề tự soạn)",
        items: [
          { q: "1. “Children today are less happy than children in the past because they spend too much time indoors.” — Đề có mấy vế phải xử lý?", options: ["Một: trẻ em dành quá nhiều thời gian trong nhà", "Hai: (a) trẻ nay kém hạnh phúc hơn xưa; (b) nguyên nhân là ở trong nhà quá nhiều", "Ba: trẻ em, quá khứ, trong nhà", "Không có vế nào — chỉ cần nêu ý kiến về trẻ em"], correct: 1, why: "Khẳng định + lý do (because) = hai vế. Bạn có thể đồng ý (a) nhưng không đồng ý (b) — hoặc nghi ngờ cả (a)." },
          { q: "2. “The only way to reduce stress at work is to shorten the working week.” — Chữ bám để đồng ý MỘT PHẦN là:", options: ["reduce", "at work", "The only way", "working week"], correct: 2, why: "‘The only way’ là chữ tuyệt đối: bạn có thể đồng ý rằng rút ngắn tuần làm việc có ích, nhưng không phải cách DUY NHẤT." },
          { q: "3. “Schools should teach pupils how to manage their emotions, as this is more important for their future than academic subjects.” — Vế nào khó bảo vệ nhất?", options: ["Trường nên dạy quản lý cảm xúc", "Học sinh có cảm xúc", "Môn học thuật có trong trường", "Việc này QUAN TRỌNG HƠN môn học thuật"], correct: 3, why: "So sánh ‘more important than’ là vế mạnh. Dễ đồng ý rằng nên dạy; khó chứng minh nó quan trọng HƠN toán hay ngôn ngữ ⇒ chỗ để đồng ý một phần." },
          { q: "4. Với đề hôm nay, câu thesis nào trả lời đúng “To what extent”?", options: ["I believe attitude matters greatly once basic needs are met, but that circumstances remain decisive for those who lack them.", "This essay will discuss both views and give my opinion.", "Both attitude and circumstances are important for happiness.", "Happiness is a topic that many people care about nowadays."], correct: 0, why: "A nêu mức độ + điều kiện cho cả hai vế. B là câu báo dàn ý (và nhầm sang dạng Discussion); C né câu hỏi; D không phải thesis." },
        ],
      },

      { t: "h", text: "3. Ý mở rộng ba tầng — một đoạn, một ý" },
      {
        t: "p",
        text: "Tập 2 Ngày 2 dạy khung **P-E-E** (Point – Explain – Example). Ở band 7, khung vẫn vậy nhưng **mỗi tầng phải làm đúng việc của nó**, và đoạn kết thúc bằng một câu **nối về đề**. Cách nhớ: sau mỗi câu, tự hỏi một câu hỏi — câu trả lời chính là tầng kế tiếp.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Ba tầng + câu nối (5–6 câu, 90–110 từ)",
        caption: "Tầng 2 là tầng band 6 hay bỏ: nhảy thẳng từ nhận định sang ‘For example’.",
        steps: [
          { label: "Tầng 1 · NHẬN ĐỊNH (câu chủ đề)", sub: "Nói rõ đoạn này bàn vế nào và bạn đứng ở đâu" },
          { label: "Tầng 2 · CƠ CHẾ (1–2 câu) — trả lời: VÌ SAO? BẰNG CÁCH NÀO?", sub: "This is because… · The reason is that… · …, which means that…" },
          { label: "Tầng 3 · VÍ DỤ CỤ THỂ (1–2 câu) — trả lời: TRÔNG THẾ NÀO TRONG ĐỜI THẬT?", sub: "…, for instance, … · Consider… · A typical case is…" },
          { label: "Câu NỐI VỀ ĐỀ", sub: "In such cases, … · This suggests that… — dùng lại chữ của đề" },
        ],
      },
      {
        t: "table",
        caption: "Cùng một ý — viết kiểu band 6 và kiểu ba tầng",
        head: ["Tầng", "Band 6 (liệt kê)", "Band 7 (ba tầng)"],
        rows: [
          ["1 · Nhận định", "Firstly, attitude is very important for happiness.", "There is good reason to think that attitude shapes well-being **among people who are financially secure**."],
          ["2 · Cơ chế", "— (không có)", "This is because humans **adapt quickly** to improvements in their living standards: a pay rise brings pleasure for a few months, after which it simply becomes normal."],
          ["3 · Ví dụ", "For example, many people in poor countries are still happy.", "**Two colleagues on the same salary**, for instance, may react quite differently to missing out on a promotion — one dwells on it for months, while the other treats it as a reason to learn new skills."],
          ["Nối về đề", "Therefore, attitude is the key of a happy life.", "In such cases it is **mindset, not money**, that explains the difference."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Tầng 1: There is good reason to think that + S + V · The main reason why + S + V + is that …",
            vi: "Câu chủ đề có nhận định và phạm vi (ai, khi nào).",
            examples: [
              { en: "There is good reason to think that outlook matters more than income among people who are financially secure.", vi: "Có cơ sở để cho rằng cách nhìn quan trọng hơn thu nhập ở những người đã ổn định tài chính." },
            ],
          },
          {
            formula: "Tầng 2: This is because + S + V · The explanation lies in + N · …, which means that + S + V",
            vi: "Nêu cơ chế — cái gì dẫn tới cái gì.",
            examples: [
              { en: "This is because people quickly get used to a higher standard of living, which means that each improvement soon stops being noticed.", vi: "Đó là vì con người nhanh chóng quen với mức sống cao hơn, nghĩa là mỗi cải thiện sớm không còn được để ý." },
            ],
          },
          {
            formula: "Tầng 3: N, for instance, + V · Consider + N + who … · A parent who …, for example, …",
            vi: "Một trường hợp điển hình, đủ chi tiết để hình dung. Đặt for instance / for example ở GIỮA câu, sau chủ ngữ — tự nhiên hơn đầu câu.",
            examples: [
              { en: "Someone working two insecure jobs, for example, has little time for sleep, exercise or friends.", vi: "Một người làm hai công việc bấp bênh chẳng hạn, có rất ít thời gian để ngủ, tập thể dục hay gặp bạn bè." },
            ],
          },
          {
            formula: "Nối về đề: In such cases, it is A, not B, that + V · This suggests that + S + V",
            vi: "Câu cuối đoạn kéo ý về đúng chữ của đề (attitude / circumstances).",
            examples: [
              { en: "For people in this position, a modest rise in income is likely to improve well-being far more than a change of outlook.", vi: "Với những người ở hoàn cảnh này, một mức tăng thu nhập khiêm tốn nhiều khả năng cải thiện đời sống tinh thần hơn hẳn một thay đổi về cách nhìn." },
            ],
          },
        ],
      },
      {
        t: "rule",
        formula: "Nhận định (ai / khi nào) → This is because + cơ chế → N, for instance, + trường hợp cụ thể → In such cases, + nối về đề",
        vi: "Một thân bài = một ý đi qua ba tầng. Sau mỗi câu tự hỏi: Vì sao? → Trông thế nào trong đời thật? → Vậy thì sao với đề?",
      },

      { t: "h", text: "4. Ví dụ cụ thể mà không bịa — và cách gỡ câu khái quát" },
      {
        t: "p",
        text: "“Cụ thể” không có nghĩa là có con số. Giám khảo **không kiểm tra** số liệu, và một con số bịa (“a study in 2019 showed that 78%…”) nghe giả hơn là thuyết phục. Cụ thể nghĩa là: **một kiểu người + một tình huống + một hệ quả** nhìn thấy được.",
      },
      {
        t: "table",
        caption: "Bốn kiểu ví dụ dùng được trong phòng thi",
        head: ["Kiểu", "Khuôn", "Ví dụ"],
        rows: [
          ["**Trường hợp điển hình**", "A / Someone / A parent who…", "A parent who cannot be sure of paying next month's rent lives with constant anxiety."],
          ["**So sánh hai người cùng điều kiện**", "Two … on the same …, for instance, …", "Two colleagues on the same salary may react quite differently to the same setback."],
          ["**Quan sát ở nơi bạn sống**", "In my city / country, …", "In my city, many graduates earn more than their parents ever did, yet complain of burnout."],
          ["**Xu hướng ai cũng biết**", "It is well known that… / As is often observed, …", "People who move to a larger house, as is often observed, soon stop noticing the extra space."],
        ],
      },
      {
        t: "table",
        caption: "Gỡ câu khái quát — từ tuyệt đối sang có mức độ",
        head: ["Khái quát (band 6)", "Vì sao yếu", "Band 7"],
        rows: [
          ["Money cannot buy happiness.", "Câu khẩu hiệu, ai cũng viết; tuyệt đối", "Beyond a certain point, additional income **adds little** to well-being."],
          ["Rich people are not happy.", "Sai với rất nhiều người giàu", "Wealth **does not necessarily** bring contentment."],
          ["Many people in poor countries are still happy.", "Không kiểm chứng được; nghe trịch thượng", "**Some** individuals remain cheerful in real hardship, **but they are exceptions**."],
          ["Everyone wants to be rich.", "everyone = tuyệt đối", "**Most** people would welcome a higher income."],
          ["If people think positively, they will be happy.", "will = chắc chắn", "A positive outlook **tends to** make setbacks easier to bear."],
          ["Poor people always worry.", "always", "People on very low incomes **are far more likely to** experience chronic stress."],
        ],
      },
      {
        t: "note",
        title: "📌 Bộ chữ “giảm tuyệt đối” — dùng đúng liều",
        items: [
          "**Số lượng**: all → **most / many / a significant number of** · no one → **few / hardly anyone**.",
          "**Tần suất**: always → **often / usually / tend to** · never → **rarely / seldom**.",
          "**Độ chắc**: will → **is likely to / may / can** · is → **appears to be / tends to be**.",
          "**Phạm vi**: thêm điều kiện — **among…**, **for those who…**, **once…**, **beyond a certain point**, **in many cases**.",
          "Liều: **một** chữ giảm cho mỗi nhận định. “It may possibly perhaps tend to…” là rào quá tay — nghe như không dám nói gì. (Hedging học kỹ ở Ngày 13.)",
        ],
      },

      { t: "h", text: "5. Phản đề band 7: Granted…, but… — nêu rồi bác trong một hơi" },
      {
        t: "p",
        text: "Tập 3 Ngày 6 dạy một câu phản đề (Admittedly, …, however, …); Ngày 2 tuần này dạy đoạn “nêu rồi bác” hai câu (**Granted, … However, …**). Hôm nay thêm cấu trúc gọn nhất — nêu ý ngược và **bác ngay trong cùng câu** — nên phản đề không kịp làm lung lay lập trường. Đặt nó ở **cuối thân bài 2** hoặc ngay sau tầng 3.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Granted, + S + V, but + S + V",
            vi: "Granted = “công nhận là…”. Vế sau but là ý của bạn và phải MẠNH hơn vế trước.",
            examples: [
              { en: "Granted, there are individuals who remain cheerful in real hardship, but they are remarkable precisely because they are exceptions.", vi: "Công nhận là có những người vẫn vui vẻ giữa khó khăn thật sự, nhưng họ đáng chú ý chính vì họ là ngoại lệ." },
            ],
          },
          {
            formula: "While it is true that + S + V, + S + V  ·  Although + S + V, this does not mean that + S + V",
            vi: "Nêu phản đề trong mệnh đề phụ — ngữ pháp tự hạ nó xuống hàng thứ yếu.",
            examples: [
              { en: "While it is true that a pay rise brings pleasure, the effect rarely lasts more than a few months.", vi: "Tuy đúng là tăng lương đem lại niềm vui, tác dụng đó hiếm khi kéo dài quá vài tháng." },
              { en: "Although attitude can soften hardship, this does not mean that it can replace a secure income.", vi: "Dù thái độ có thể làm dịu khó khăn, điều đó không có nghĩa nó thay được một thu nhập ổn định." },
            ],
          },
          {
            formula: "It does not follow that + S + V  ·  This is not to say that + S + V",
            vi: "Chặn trước một suy diễn quá đà từ ý vừa nêu — mở đầu thân bài 2 rất tốt.",
            examples: [
              { en: "However, it does not follow that circumstances have very little effect.", vi: "Tuy nhiên, không thể từ đó suy ra rằng hoàn cảnh có rất ít tác động." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với phản đề",
        items: [
          "**Nêu mà không bác**: “Granted, some poor people are happy.” rồi sang câu khác ⇒ bạn vừa cho đối phương một điểm. Luôn có **but + lý do**.",
          "**Bác bằng cách lặp lại ý mình**: “…, but I still think circumstances matter.” ⇒ không thuyết phục. Bác phải có **lý lẽ mới** (they are exceptions; the effect is temporary; it applies only to…).",
          "**Hai ba phản đề**: bài 280 từ chỉ chứa nổi **một**. Nhiều hơn ⇒ bài thành Discussion và lập trường mờ đi.",
          "~~Granted that some people…~~ đầu câu rồi thiếu mệnh đề chính ⇒ câu cụt. Dùng **Granted, + mệnh đề, but + mệnh đề**.",
        ],
      },
      {
        t: "rule",
        formula: "Granted, + S + V (ý ngược), but + S + V (lý lẽ mới của bạn)",
        vi: "Đúng một phản đề mỗi bài, nêu và bác trong cùng câu; vế bác phải đưa lý do mới, không lặp thesis.",
      },
      {
        t: "quiz",
        id: "t4d4-viet-granted-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — ba tầng và phản đề (4 câu)",
        grammar: "This is because + S + V · N, for instance, + V · Granted, + S + V, but + S + V · It does not follow that + S + V",
        items: [
          { q: "Đó là vì con người nhanh chóng quen với mức sống cao hơn.", answers: ["This is because people quickly get used to a higher standard of living.", "This is because people quickly adapt to a higher standard of living.", "This is because humans quickly adapt to a higher standard of living.", "This is because people get used to a higher standard of living quickly.", "This is because people quickly become used to a higher standard of living.", "This is because humans quickly get used to a higher standard of living."], hint: "This is because · get used to / adapt to · a higher standard of living" },
          { q: "Công nhận là tiền giảm bớt căng thẳng, nhưng nó không thể tạo ra các mối quan hệ thân thiết.", answers: ["Granted, money reduces stress, but it cannot create close relationships.", "Granted, money relieves stress, but it cannot create close relationships.", "Granted, money reduces stress, but it cannot build close relationships.", "Granted, money can reduce stress, but it cannot create close relationships.", "Granted, money reduces stress, but it can't create close relationships."], hint: "Granted, … , but … · close relationships" },
          { q: "Tuy nhiên, không thể từ đó suy ra rằng thu nhập không quan trọng.", answers: ["However, it does not follow that income is unimportant.", "However, it does not follow that income does not matter.", "However, it does not follow that income is not important.", "However, it doesn't follow that income is unimportant.", "It does not follow, however, that income is unimportant."], hint: "it does not follow that" },
          { q: "Một người làm hai công việc chẳng hạn, có rất ít thời gian cho gia đình.", answers: ["Someone working two jobs, for instance, has very little time for their family.", "Someone working two jobs, for example, has very little time for their family.", "A person working two jobs, for instance, has very little time for their family.", "Someone who works two jobs, for instance, has very little time for their family.", "Someone working two jobs, for instance, has very little time for family.", "A person who works two jobs, for example, has very little time for their family.", "Someone working two jobs, for example, has very little time for family."], hint: "Someone working two jobs, for instance, has…" },
        ],
      },

      { t: "h", text: "6. Dàn ý bài mẫu — lập trường “đồng ý một phần”" },
      {
        t: "table",
        head: ["Đoạn", "Việc của đoạn", "Nội dung"],
        rows: [
          ["Mở bài (2 câu)", "Paraphrase đề + thesis có mức độ và điều kiện", "Đồng ý ① khi nhu cầu cơ bản đã đủ; ② chỉ đúng với người đã dư dả"],
          ["Thân bài 1 — vế ①", "Ba tầng: khi nào thái độ quyết định", "Nhận định (người đã ổn định) → cơ chế (con người quen nhanh với mức sống mới) → ví dụ (hai đồng nghiệp cùng lương) → nối"],
          ["Thân bài 2 — vế ②", "Ba tầng + phản đề: khi nào hoàn cảnh quyết định", "It does not follow… → cơ chế (lo âu thường trực) → ví dụ (người làm hai việc) → Granted…, but… → nối"],
          ["Kết bài (2 câu)", "Chốt đúng mức độ, không ý mới", "Thái độ chính với người đủ đầy; hoàn cảnh quyết định với người thiếu ⇒ chỉ đúng một phần"],
        ],
      },

      { t: "h", text: "7. Bài mẫu band 6 và band 7 đặt cạnh nhau" },
      {
        t: "p",
        text: "Đọc **bài band 6 trước**. Bài này **khá**: đủ bốn đoạn, có lập trường, có ví dụ, ngữ pháp ít lỗi nặng. Hãy tự gạch chân: mỗi thân bài có **mấy ý**? ý nào có **tầng 2**? câu nào **khái quát**? Rồi mới đọc bài band 7 và bảng so sánh.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 6 (ước tính) — 285 từ",
        intro: "Lỗi và điểm yếu được giữ nguyên có chủ ý. Đừng học thuộc bài này.",
        paras: [
          { label: "1", text: "Nowadays, happiness is an important topic and people have different opinions about where it comes from. Some people think that happiness depends mostly on attitude and that money or other conditions are not important. In my opinion, I partly agree with this idea." },
          { label: "2", text: "On the one hand, attitude is very important for happiness. Firstly, people who think positively can enjoy their life even when they do not have much. For example, many people in poor countries are still happy because they are satisfied with what they have. Secondly, rich people are not always happy. There are many famous people who have a lot of money but they still feel depressed and stressful, and some of them even need to see a doctor. This shows that money cannot buy happiness. Moreover, a positive person can make more friends, and friends are very important in our life. Therefore, having a good attitude is the key of a happy life." },
          { label: "3", text: "On the other hand, external conditions also affect happiness. If people do not have enough money, they will worry about food, house and health, so they cannot be happy. Moreover, a good job and good relationships make people feel better about themselves. In addition, living in a safe place with clean environment is also important for everyone. For instance, people who live in polluted cities often get sick and this makes them unhappy. So I think circumstances have some effects to happiness and we cannot say that they are not important." },
          { label: "4", text: "In conclusion, both attitude and circumstances are important for happiness. People should try to think positively in every situation, and governments should also improve living conditions so that everyone can have a happy life in the future." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 – 7.5 (ước tính) — 344 từ",
        intro: "Lập trường: đồng ý một phần. Tìm trong mỗi thân bài: tầng 1 · tầng 2 · tầng 3 · câu nối về đề; và câu Granted…, but….",
        paras: [
          { label: "1", text: "It is often claimed that how happy we are is determined chiefly by our outlook on life, while material conditions such as income make almost no difference. I agree that attitude plays a major role once a person's basic needs are met, but I believe the claim that circumstances hardly matter is true only of those who are already reasonably comfortable." },
          { label: "2", text: "There is good reason to think that attitude shapes well-being among people who are financially secure. This is because humans adapt quickly to improvements in their living standards: a pay rise or a larger flat brings pleasure for a few months, after which it simply becomes normal and is no longer noticed. What continues to matter is how a person interprets everyday events. Two colleagues on the same salary, for instance, may react quite differently to missing out on a promotion; one treats it as proof of failure and dwells on it for months, while the other sees it as a reason to develop new skills. In such cases it is mindset, not money, that explains the difference in their contentment." },
          { label: "3", text: "However, it does not follow that circumstances have very little effect. Below a certain level of income, the opposite tends to be true. A parent who cannot be sure of paying next month's rent lives with constant anxiety, and no amount of positive thinking removes its cause. Someone working two insecure jobs, for example, has little time for sleep, exercise or friends, which are the very things from which most people derive satisfaction. Granted, there are individuals who remain cheerful in real hardship, but they are remarkable precisely because they are exceptions, and it would be unreasonable to expect the same resilience of everyone. For people in this position, a modest rise in income is likely to improve well-being far more than a change of outlook." },
          { label: "4", text: "In conclusion, attitude is probably the main influence on happiness for those whose essential needs are already secure, but for people struggling to meet those needs, circumstances remain decisive. The statement is therefore only partly correct." },
        ],
      },
      {
        t: "table",
        caption: "Vì sao 6, vì sao 7 — so theo bốn tiêu chí",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**TR** · số ý mỗi đoạn", "Thân bài 1: **ba ý** (nghĩ tích cực · người giàu không vui · có nhiều bạn). Thân bài 2: **ba ý** (tiền · việc và quan hệ · môi trường)", "Mỗi thân bài **một ý**, 5–6 câu cùng đào ý đó"],
          ["**TR** · tầng 2 (cơ chế)", "Không có. “people who think positively can enjoy their life” — **vì sao?** không nói", "“**This is because** humans adapt quickly…: a pay rise… becomes normal” · “lives with constant anxiety, and no amount of positive thinking **removes its cause**”"],
          ["**TR** · ví dụ", "“many people in poor countries are still happy” · “many famous people” — khái quát, không kiểm chứng được", "“Two colleagues on the same salary…” · “A parent who cannot be sure of paying next month's rent” · “Someone working two insecure jobs” — hình dung được"],
          ["**TR** · khái quát", "“money cannot buy happiness” · “important for everyone” · “in every situation”", "“**tends to** be true” · “**most** people” · “**is likely to**” · “**probably** the main influence”"],
          ["**TR** · lập trường", "“I partly agree” → kết bài “both… are important” — **không nói mức độ**, không nói điều kiện; lời khuyên cho chính phủ lạc đề", "Mở bài nêu **điều kiện** (once basic needs are met) → câu chủ đề 2 nhắc lại chữ của đề (very little effect) → kết: “**only partly correct**”"],
          ["**CC**", "On the one hand · Firstly · For example · Secondly · Moreover · Therefore · On the other hand · Moreover · In addition · For instance · So — **11 từ nối**, máy móc; khung On the one hand / On the other hand là của bài Discussion", "**ít từ nối** (This is because · for instance · However · for example · Granted); còn lại nối bằng **tham chiếu**: such cases · the opposite · its cause · the very things · this position · those needs"],
          ["**LR**", "happy / happiness × 12 · important × 7 · good × 3; sai: ~~feel stressful~~, ~~the key of~~, ~~effects to~~", "outlook · well-being · contentment · mindset · resilience · derive satisfaction · dwells on · decisive — đúng collocation, luân phiên thay happiness"],
          ["**GRA**", "Câu đơn + if loại 1 + because; lỗi: ~~food, house~~ (housing), ~~clean environment~~ (a clean…), ~~In my opinion, I partly agree~~ (thừa)", "Mệnh đề quan hệ (those **whose**… · things **from which**…), cleft (**it is** mindset, not money, **that**…), danh ngữ dài, dấu hai chấm và chấm phẩy đúng; hầu như không lỗi"],
          ["Phản đề", "Không có (thân bài 2 chỉ là “mặt kia”)", "“**Granted,** there are individuals…, **but** they are… exceptions” — nêu và bác trong một câu"],
        ],
      },
      {
        t: "note",
        title: "💡 Tám thứ mượn được từ bài band 7",
        items: [
          "**It is often claimed that…, while…** — mở bài paraphrase cả hai vế trong một câu.",
          "**I agree that… once…, but I believe the claim that… is true only of…** — thesis hai vế, mỗi vế một điều kiện.",
          "**There is good reason to think that…** — câu chủ đề có nhận định mà không cần “Firstly”.",
          "**This is because…: …** — dấu hai chấm dẫn vào phần giải thích cụ thể.",
          "**Two… on the same…, for instance, may…; one…, while the other…** — ví dụ so sánh hai người.",
          "**However, it does not follow that…** — mở thân bài 2 bằng cách chặn một suy diễn.",
          "**Granted, …, but… precisely because…** — phản đề một câu.",
          "**The statement is therefore only partly correct.** — câu kết chốt mức độ, ngắn, dứt.",
        ],
      },
      {
        t: "quiz",
        id: "t4d4-viet-dien-mau",
        title: "Gập bài mẫu band 7 lại — điền MỘT từ còn thiếu (10 chỗ trống)",
        kind: "fill",
        items: [
          { q: "1. It is often ___ that how happy we are is determined chiefly by our outlook on life.", answers: ["claimed"] },
          { q: "2. I agree that attitude plays a major ___ once a person's basic needs are met.", answers: ["role"] },
          { q: "3. This is because humans ___ quickly to improvements in their living standards.", answers: ["adapt"] },
          { q: "4. Two colleagues on the same salary, for ___, may react quite differently.", answers: ["instance", "example"] },
          { q: "5. One treats it as proof of failure and ___ on it for months.", answers: ["dwells"] },
          { q: "6. In such cases it is mindset, ___ money, that explains the difference.", answers: ["not"] },
          { q: "7. However, it does not ___ that circumstances have very little effect.", answers: ["follow"] },
          { q: "8. …the very things from which most people ___ satisfaction.", answers: ["derive"] },
          { q: "9. ___, there are individuals who remain cheerful in real hardship, but they are exceptions.", answers: ["Granted"] },
          { q: "10. The statement is therefore only ___ correct.", answers: ["partly", "partially"] },
        ],
      },

      { t: "h", text: "8. Nhận diện: tầng nào, khái quát ở đâu?" },
      {
        t: "mcq",
        id: "t4d4-viet-nhan-dien",
        title: "Ba tầng · khái quát · phản đề (8 câu)",
        items: [
          { q: "1. “This is because a child who is constantly compared with others begins to measure his own worth by results alone.” — Câu này là tầng nào?", options: ["Tầng 1 — nhận định", "Tầng 2 — cơ chế", "Tầng 3 — ví dụ cụ thể", "Câu nối về đề"], correct: 1, why: "This is because + cái gì dẫn tới cái gì = cơ chế. Chưa có trường hợp cụ thể nào." },
          { q: "2. “A teenager who sees classmates posting holiday photos every weekend, for example, may start to feel that her own life is dull.” — Câu này là tầng nào?", options: ["Tầng 1 — nhận định", "Tầng 2 — cơ chế", "Tầng 3 — ví dụ cụ thể", "Phản đề"], correct: 2, why: "Một kiểu người + một tình huống + một hệ quả nhìn thấy được, có ‘for example’ ⇒ tầng 3." },
          { q: "3. Câu nào KHÔNG khái quát quá đà?", options: ["Social media makes all teenagers unhappy.", "Nobody can be happy without money.", "Young people always follow their friends.", "Heavy use of social media tends to lower teenagers' self-esteem."], correct: 3, why: "‘Heavy use’ giới hạn phạm vi + ‘tends to’ giảm độ chắc. Ba câu còn lại dùng all / nobody / always." },
          { q: "4. Sau câu chủ đề “Regular exercise improves mental well-being.”, câu nào là tầng 2 tốt nhất?", options: ["Physical activity releases tension and, by improving sleep, leaves people better able to cope with daily pressures.", "For example, my brother goes jogging every morning.", "Moreover, exercise is cheap and convenient.", "In conclusion, everyone should exercise."], correct: 0, why: "A giải thích BẰNG CÁCH NÀO vận động cải thiện tinh thần (giải toả căng thẳng → ngủ tốt hơn → đối phó tốt hơn). B nhảy thẳng sang ví dụ; C là ý mới (liệt kê); D là kết luận." },
          { q: "5. Phản đề nào được BÁC đúng cách?", options: ["Granted, some people enjoy working alone.", "Granted, some people enjoy working alone, but I still think teamwork is better.", "Granted, some people enjoy working alone, but most complex projects require skills that no single person has.", "Some people enjoy working alone. Moreover, teamwork is good."], correct: 2, why: "C bác bằng một lý lẽ mới. A không bác; B chỉ lặp lại ý mình; D không phải phản đề." },
          { q: "6. Đoạn nào đang “liệt kê”?", options: ["Một câu chủ đề, hai câu giải thích cơ chế, một ví dụ, một câu nối về đề.", "Firstly + ý A (1 câu). Secondly + ý B (1 câu). Moreover + ý C (1 câu). Therefore + kết.", "Một nhận định, một ví dụ dài hai câu, một phản đề có bác.", "Một câu chặn suy diễn, cơ chế, ví dụ, Granted… but…, câu nối."], correct: 1, why: "Ba ý, mỗi ý một câu, nối bằng từ đánh số — đúng kiểu liệt kê của band 6." },
          { q: "7. Kết bài nào giữ đúng lập trường “đồng ý một phần”?", options: ["In conclusion, both factors are important and people should be positive.", "In conclusion, money is the most important thing in life.", "To sum up, there are many opinions about happiness.", "In conclusion, attitude matters most for those who are already secure, whereas for the poor it is circumstances that count; the claim is thus only partly true."], correct: 3, why: "D nêu cái nào hơn, trong điều kiện nào, và chốt mức độ. A né câu hỏi + thêm lời khuyên; B đổi lập trường; C không kết luận gì." },
          { q: "8. Chỗ nào đặt “for instance” tự nhiên nhất?", options: ["A shift worker, for instance, may see her children only at weekends.", "For instance a shift worker may see, her children only at weekends.", "A shift worker may for instance, see her children only at weekends.", "A shift worker may see her children only, for instance at weekends."], correct: 0, why: "Sau chủ ngữ, giữa hai dấu phẩy. B thiếu dấu phẩy sau For instance và thừa dấu phẩy sau see; C, D sai vị trí dấu phẩy và đổi nghĩa." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Bảy lỗi giữ bài ở 6.5",
        items: [
          "**Thân bài 3 ý**: cắt còn một, dùng số từ tiết kiệm được cho tầng 2 và tầng 3.",
          "**Nhảy cóc tầng 2**: nhận định → For example. Luôn chèn một câu **This is because…** / **…, which means that…**",
          "**Ví dụ “my friend”**: “My friend Nam is rich but unhappy.” — một cá nhân không chứng minh được gì. Đổi thành **kiểu người**: “A high earner who works seventy hours a week…”",
          "**Bịa số liệu**: “According to a survey by Oxford University in 2020, 85%…” — giám khảo biết là bịa; bỏ.",
          "**Khung On the one hand / On the other hand** cho bài Opinion: người đọc tưởng bạn đang viết Discussion và không thấy lập trường.",
          "**Kết bài thêm lời khuyên** (“Governments should…”) khi đề không hỏi giải pháp ⇒ lạc đề nhẹ, mất chỗ để chốt mức độ.",
          "**Lặp happy / happiness**: luân phiên well-being · contentment · life satisfaction · fulfilment (bài 1 mục 2).",
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "40 phút cho Task 2 — phân giờ band 7",
        caption: "Dàn ý ba tầng viết bằng TỪ KHOÁ, không viết câu. Chưa có tầng 2 trong dàn ý thì chưa được bắt đầu viết.",
        steps: [
          { label: "0–3′ · Đọc đề", sub: "Đếm vế · khoanh chữ bám · chọn lập trường" },
          { label: "3–8′ · Dàn ý", sub: "Mỗi thân bài: nhận định → vì sao → trường hợp nào → phản đề đặt ở đâu" },
          { label: "8–13′ · Mở bài + câu chủ đề hai thân bài", sub: "Ba câu này mang lập trường" },
          { label: "13–33′ · Hai thân bài", sub: "≈ 10 phút / đoạn, 90–110 từ" },
          { label: "33–36′ · Kết bài", sub: "Hai câu, chốt mức độ" },
          { label: "36–40′ · Soát", sub: "Thì · mạo từ · chủ–vị · chữ tuyệt đối còn sót" },
        ],
      },

      { t: "h", text: "9. Đến lượt bạn — viết và để AI chấm" },
      {
        t: "p",
        text: "Đề **khác** bài mẫu nhưng cùng dạng và cùng vùng từ vựng với bài 1. Trước khi viết, ghi dàn ý ba tầng cho **từng** thân bài ra giấy. Viết **270–320 từ** trong 40 phút. AI chấm theo bốn tiêu chí và chỉ lỗi — nhớ ghi lỗi vào sổ.",
      },
      {
        t: "essay",
        id: "t4d4-viet-bai",
        task: "Task 2",
        prompt: "Some people think that schools should teach children how to manage their emotions and look after their mental well-being, because this is more important for their future than academic subjects. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đề có **hai vế**: ① trường nên dạy quản lý cảm xúc và chăm sóc sức khoẻ tinh thần; ② lý do: việc này **more important than** academic subjects. Chữ bám là **more important than** — bạn có thể đồng ý ① mà không đồng ý ②.",
          "Thesis nêu **mức độ + điều kiện**: I agree that…, but I do not believe that… / I largely agree, provided that…",
          "Mỗi thân bài **một ý, ba tầng**: nhận định → **This is because…** → **A pupil who…, for instance, …** → câu nối dùng lại chữ của đề.",
          "Đúng **một** phản đề, bác trong cùng câu: **Granted, …, but…** / **While it is true that…, …**",
          "Gỡ khái quát: không all / always / every; dùng **tend to · most · is likely to · in many cases**.",
          "Dùng ít nhất 6 từ bài 1: **anxiety · resilience · self-esteem · cope with · peer pressure · foster · undermine · well-being · a sense of…**",
          "Kết bài hai câu, chốt mức độ; **không** thêm lời khuyên cho chính phủ.",
        ],
      },
      {
        t: "note",
        title: "Sau khi AI chấm — tự soát ba câu hỏi của band 7",
        items: [
          "Mỗi thân bài của mình có **mấy ý**? (đáp án cần là: một)",
          "Tô ba màu cho ba tầng. Đoạn nào **thiếu màu của tầng 2** ⇒ viết lại đoạn đó, chỉ đoạn đó.",
          "Khoanh mọi chữ **all · every · always · never · will**. Chữ nào không bảo vệ được ⇒ đổi.",
          "Ghi vào sổ lỗi: lỗi **TR** (thiếu tầng nào) tách riêng với lỗi **ngôn ngữ** — hai loại lỗi sửa bằng hai cách khác nhau.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t4d4-nghe",
    kind: "listening",
    title: "Nghe Part 2: Multiple choice câu hỏi dài — phương án paraphrase",
    goal: "Làm đúng 8–10/10 câu trắc nghiệm Part 2 khi cả ba phương án đều được nhắc tới trong băng, đáp án đúng luôn được nói bằng chữ khác, và băng chạy 160–170 từ/phút — nhờ đọc trước có phương pháp, đoán paraphrase, và nhận ra bốn kiểu bẫy. Hướng tới Listening ≥ 30/40.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Part 2** = một người nói về chủ đề đời sống (giới thiệu một nơi, một sự kiện, một dịch vụ). Ở band 6 bạn đã làm MCQ ngắn + bản đồ (Tập 3 Ngày 4). Hôm nay: ==MCQ câu hỏi dài, ba phương án dài, tất cả đều được nhắc tới==.",
          "Luật của MCQ band 7: phương án **đúng** gần như **không bao giờ** dùng lại chữ trong băng; phương án **sai** thì **hay dùng lại nguyên chữ**. Nghe thấy đúng chữ trong đề ⇒ nghi ngờ trước.",
          "Bốn kiểu bẫy: ① **đã bỏ / ngày xưa** (we used to…) · ② **người ta tưởng** (people assume…) · ③ **đúng với một phần** (only four rooms…) · ④ **bị phủ định / đính chính** (You won't need…).",
          "Kỹ năng lõi: **đọc trước 30–40 giây** — tóm mỗi phương án còn 2–3 chữ và **đoán trước băng sẽ nói nó bằng chữ gì**.",
          "Ôn dạng **Choose TWO** (Tập 2 Ngày 13, Tập 3 Ngày 18): 5 phương án, 2 đúng, mỗi đáp án một điểm, thứ tự tự do.",
          "Bài chính: 10 câu (11–16 một đáp án + 17–20 chọn TWO), ~800 từ, giọng Anh, nghe **một lần**.",
        ],
      },

      { t: "h", text: "1. MCQ Part 2 ở band 7 khó hơn ở đâu?" },
      {
        t: "table",
        head: ["", "Band 5–6 (Tập 2–3)", "Band 7 (hôm nay)"],
        rows: [
          ["Câu hỏi (stem)", "5–8 từ: The park first opened in…", "10–18 từ, hỏi **lý do / thái độ / điểm chung**: What does the speaker say about ALL the bedrooms?"],
          ["Phương án", "1–3 từ, thường là danh từ / con số", "5–10 từ, là **cả một ý** — phải nghe hiểu, không dò chữ được"],
          ["Lời băng", "Đáp án đúng đổi 1 từ đồng nghĩa", "Đáp án đúng **đổi cả cấu trúc**; phương án sai được nhắc **bằng nguyên chữ**"],
          ["Tốc độ", "≈ 150 từ/phút", "≈ 160–170 từ/phút, ít ngừng"],
          ["Khoảng cách giữa các câu", "20–25 giây", "25–40 giây — dài hơn, dễ **mất dấu** đang ở câu nào"],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao MCQ là dạng tốn điểm nhất của Part 2",
        items: [
          "Bạn phải **đọc** nhiều nhất (≈ 150–200 từ câu hỏi cho 6 câu) trong khi vẫn phải **nghe**.",
          "Băng nhắc **cả ba** phương án cho mỗi câu — không có phương án nào “không nghe thấy”.",
          "Sai một câu dễ kéo theo câu sau: mải nghĩ câu 12, băng đã sang câu 13.",
          "Tin tốt: bẫy chỉ có **bốn kiểu**, lặp đi lặp lại. Học thuộc bốn kiểu này là lấy lại được 2–3 điểm.",
        ],
      },

      { t: "h", text: "2. Giải phẫu một câu MCQ — bốn kiểu bẫy" },
      {
        t: "p",
        text: "Ví dụ (tự soạn). Câu hỏi: **What happens to guests' phones during the weekend?** — **A** kept in a locked container in the bedroom · **B** stored securely in the office · **C** carried by guests but switched off. Lời băng: “When we began, we **asked guests to hand devices in at reception and locked them in the office safe**. That turned out to make people more anxious. So **these days** each guest gets **a small wooden box with a key**, and it **stays in your own room**.”",
      },
      {
        t: "table",
        caption: "Bốn kiểu bẫy — và tín hiệu báo trước",
        head: ["Kiểu bẫy", "Băng nói thế nào", "Tín hiệu cần bắt"],
        rows: [
          ["① **Đã bỏ / ngày xưa**", "We **used to** provide a packed lunch, but… · **When we began**, we locked them in the office…", "used to · originally · at first · when we began · until last year → đáp án nằm ở **these days / now / instead**"],
          ["② **Người ta tưởng**", "**People often assume** we're against technology… We're not.", "people assume / expect / think · you might think · it was advertised as → đáp án nằm sau **in fact / actually / but**"],
          ["③ **Đúng với một phần**", "**Only four rooms** have a lake view… What **every** room does have is…", "only some / a few / most ↔ câu hỏi có **all / every / main / most**"],
          ["④ **Phủ định / đính chính**", "You **won't need** a map… Waterproofs **can be borrowed**, so **don't** bring…", "won't need · no need to · don't bother · there's no… → phương án đó **bị loại**"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở MCQ dài",
        items: [
          "**Chọn ngay khi nghe thấy chữ trùng**: “office… locked” khớp phương án B — nhưng đó là chuyện **ngày xưa**. Nguyên tắc: nghe thấy chữ của một phương án ⇒ **chưa chọn**, chờ câu kế tiếp.",
          "**Bỏ sót chữ nhỏ trong câu hỏi**: all · main · first · most · now. “What does she say about **all** the bedrooms?” ≠ “about the bedrooms”.",
          "**Đọc câu hỏi trong lúc băng đang nói câu trước** ⇒ mất cả hai. Đọc trước trong khoảng lặng; khi băng chạy thì mắt chỉ ở **một** câu.",
          "**Kẹt lại một câu**: không chắc ⇒ khoanh phương án nghiêng về nhất, đánh dấu ?, **nhảy ngay** sang câu sau. Băng không chờ.",
          "**Không nhận ra băng đã chuyển câu**: người nói luôn báo — Now, … · Moving on to… · As for… · Finally, … Bắt các cụm này như bắt biển báo.",
        ],
      },

      { t: "h", text: "3. Quy trình 5 bước — trước và trong khi nghe" },
      {
        t: "sodo",
        kind: "flow",
        title: "MCQ Part 2 — 5 bước",
        caption: "Bước 2–3 làm trong 30–40 giây đọc trước. Không kịp cả 6 câu thì làm kỹ 3 câu đầu, 3 câu sau chỉ gạch từ khoá ở câu hỏi.",
        steps: [
          { label: "1 · Gạch từ khoá ở CÂU HỎI", sub: "Chủ đề của câu + chữ nhỏ: why · all · main · first · now" },
          { label: "2 · Tóm mỗi phương án còn 2–3 chữ", sub: "A box in room · B office · C carry, off" },
          { label: "3 · Đoán paraphrase", sub: "‘prepare it themselves’ → băng có thể nói make yourself something" },
          { label: "4 · Nghe tín hiệu chuyển câu", sub: "Now, your phones. · Accommodation. · Finally, what to pack." },
          { label: "5 · Chờ hết ý rồi mới chọn", sub: "Nghe thấy used to / people assume / only ⇒ đáp án ở phía SAU" },
        ],
      },
      {
        t: "table",
        caption: "Đoán paraphrase — phương án viết một kiểu, băng nói một kiểu",
        head: ["Phương án trong đề", "Băng có thể nói", "Kiểu đổi"],
        rows: [
          ["start relaxing earlier in their stay", "get the rest you've paid for a little sooner", "đổi cả cụm"],
          ["a locked container in the guest's bedroom", "a small wooden box with a key… stays in your own room", "khái quát ↔ cụ thể"],
          ["ring the lodge's main phone number", "give them the lodge landline", "đồng nghĩa"],
          ["equipped for writing", "a proper desk, with paper and pens provided", "khái quát ↔ liệt kê"],
          ["prepare it themselves", "you're welcome to make yourself something", "đổi chủ ngữ"],
          ["the improvement in their sleep", "sleeping properly, often for the first time in months", "danh từ ↔ động từ"],
          ["must be reserved in advance", "you'll need to put your name down when you arrive", "đổi cấu trúc"],
          ["free of charge", "at no extra cost · we don't charge for · it's included", "đồng nghĩa"],
        ],
      },
      {
        t: "rule",
        formula: "nghe thấy ĐÚNG CHỮ của phương án ⇒ nghi ngờ · nghe thấy Ý của phương án bằng chữ khác ⇒ chọn",
        vi: "Đáp án đúng được paraphrase; phương án sai hay được nhắc nguyên văn rồi bị bỏ (used to), bị đính chính (in fact), hoặc chỉ đúng một phần (only some).",
      },

      { t: "h", text: "4. Khởi động — Practice 1 (3 câu, giọng Mỹ)" },
      {
        t: "p",
        text: "Một thông báo ngắn ở trường đại học, khoảng 1 phút. Đọc ba câu hỏi trong **20 giây**, tóm mỗi phương án bằng một chữ, rồi nghe **một lần**.",
      },
      {
        t: "listen",
        id: "t4d4-nghe-ngan",
        title: "Practice 1 — Wellbeing Week: an update",
        dan: { so: "Day 4, Practice 1", boiCanh: "a student officer giving an update about a university Wellbeing Week.", cau: [1, 3] },
        note: "Khoảng 1 phút, giọng Mỹ (nữ). Ba câu trắc nghiệm, mỗi câu ba phương án đều được nhắc tới.",
        lines: [
          { who: "Student officer", voice: "us-nu", text: "Hi everyone, just a quick update on Wellbeing Week, which starts on Monday. First, the opening talk. It was advertised as taking place in the main lecture hall, and then there was a rumour going round that it had been moved online. Neither of those is right. Because so many of you have signed up, we've moved it into the sports centre, which seats twice as many people.", vi: "Chào mọi người, cập nhật nhanh về Tuần lễ Sức khoẻ tinh thần, bắt đầu vào thứ Hai. Trước hết là buổi nói chuyện khai mạc. Nó đã được quảng cáo là diễn ra ở giảng đường chính, rồi lại có tin đồn là đã chuyển sang trực tuyến. Cả hai đều không đúng. Vì quá nhiều bạn đăng ký, chúng tôi đã chuyển nó vào trung tâm thể thao, nơi có gấp đôi số ghế." },
          { who: "Student officer", voice: "us-nu", text: "Second, the drop-in sessions with a counsellor. Last year these ran every afternoon and, frankly, hardly anyone came — mostly, we think, because that's when people had classes. So this year they'll be in the evenings, from six until eight, Monday to Thursday. There's nothing on Friday, but that's only because the building closes early.", vi: "Thứ hai là các buổi gặp chuyên viên tư vấn không cần hẹn trước. Năm ngoái các buổi này diễn ra mỗi buổi chiều và, nói thật, hầu như không ai tới — chủ yếu, theo chúng tôi, là vì đó là lúc mọi người có lớp. Nên năm nay chúng sẽ diễn ra buổi tối, từ sáu đến tám giờ, thứ Hai đến thứ Năm. Thứ Sáu không có, nhưng chỉ vì toà nhà đóng cửa sớm." },
          { who: "Student officer", voice: "us-nu", text: "And lastly, the free breakfast on Wednesday. Several of you have asked whether you need a ticket. You don't, and nobody will be checking student cards either. All we ask is that you bring your own mug, because we're trying to cut down on paper cups. See you there!", vi: "Và cuối cùng là bữa sáng miễn phí hôm thứ Tư. Vài bạn hỏi có cần vé không. Không cần, và cũng không ai kiểm tra thẻ sinh viên. Chúng tôi chỉ đề nghị các bạn mang theo cốc của mình, vì chúng tôi đang cố giảm cốc giấy. Hẹn gặp ở đó!" },
        ],
      },
      {
        t: "mcq",
        id: "t4d4-nghe-ngan-chon",
        title: "Practice 1 — Questions 1–3. Choose the correct letter, A, B or C",
        items: [
          { q: "(1) Where will the opening talk now be held?", options: ["A in the main lecture hall", "B online", "C in the sports centre"], correct: 2, why: "“It **was advertised as**… the main lecture hall, and then there was **a rumour**… online. **Neither of those is right**… we've moved it into **the sports centre**.” A = bẫy ② (quảng cáo ban đầu); B = bẫy ② (tin đồn); cả hai bị đính chính bằng Neither." },
          { q: "(2) Why has the time of the counselling sessions been changed?", options: ["A The previous time clashed with students' lessons.", "B Too many students wanted to attend.", "C Counsellors are not available on Fridays."], correct: 0, why: "“hardly anyone came — mostly… **because that's when people had classes**” = clashed with lessons (paraphrase đổi cấu trúc). B ngược hẳn (hardly anyone came); C: không có buổi thứ Sáu là vì **toà nhà đóng sớm**, không phải vì chuyên viên." },
          { q: "(3) What must students do to get the free breakfast?", options: ["A show a student card", "B bring their own cup", "C collect a ticket in advance"], correct: 1, why: "“**All we ask is that you bring your own mug**” — mug = cup (đồng nghĩa). C: “You don't [need a ticket]”; A: “nobody will be checking student cards” — bẫy ④ phủ định." },
        ],
      },
      {
        t: "note",
        title: "Rút ra từ Practice 1",
        items: [
          "Cả ba câu, phương án sai đều được nhắc **nguyên chữ** (lecture hall, online, ticket, student cards, Friday). Phương án đúng thì **đổi chữ** (classes → lessons, mug → cup).",
          "Tín hiệu đính chính: **Neither of those is right** · **You don't** · **but that's only because**. Nghe thấy là biết phương án vừa nhắc **bị loại**.",
          "Cấu trúc **All we ask is that…** / **What we do… is…** gần như luôn dẫn tới đáp án — người nói dùng nó để nhấn điều quan trọng.",
        ],
      },

      { t: "h", text: "5. Bài chính — Part 2, Questions 11–20" },
      {
        t: "p",
        text: "Bạn sẽ nghe một điều phối viên nói với những người đã đặt chỗ một kỳ nghỉ cuối tuần “tắt máy” (không dùng điện thoại) ở vùng quê. **Questions 11–16**: Choose the correct letter, **A, B or C**. **Questions 17–20**: Choose **TWO** letters, **A–E**, cho mỗi câu hỏi. Bạn có **40 giây** đọc câu 11–16 (bảng dưới), rồi nghe **một lần, không dừng**. Giữa bài băng **không** nghỉ để bạn đọc câu 17–20 — hãy liếc hai câu đó trước khi bấm nghe.",
      },
      {
        t: "table",
        caption: "Questions 11–16 (đọc trước) — Choose the correct letter, A, B or C",
        head: ["Câu", "Câu hỏi", "A", "B", "C"],
        rows: [
          ["11", "Why were the Switch-Off Weekends first introduced?", "to encourage guests to take up outdoor hobbies", "to help guests start relaxing earlier in their stay", "to persuade guests to give up technology"],
          ["12", "What happens to guests' phones during the weekend?", "They are kept in a locked container in the guest's bedroom.", "Staff store them securely in the office.", "Guests carry them but keep them switched off."],
          ["13", "If relatives need to contact a guest urgently, they should", "send a message that the guest will read once a day.", "call Helen's own mobile phone.", "ring the lodge's main telephone number."],
          ["14", "What does Helen say about all the bedrooms?", "They look out over the lake.", "They are equipped for writing.", "They are furnished to a luxury standard."],
          ["15", "What is the arrangement for lunch?", "Guests collect a packed meal each morning.", "It is served in the dining room at a fixed time.", "Guests prepare it themselves in the kitchen."],
          ["16", "According to feedback, what do guests value most about the weekends?", "the range of organised activities", "the chance to get to know other people", "the improvement in their sleep"],
        ],
      },
      {
        t: "table",
        caption: "Questions 17–20 (liếc trước) — Choose TWO letters, A–E",
        head: ["Câu", "Câu hỏi", "A", "B", "C", "D", "E"],
        rows: [
          ["17–18", "Which TWO activities must be booked in advance?", "the guided hill walk", "bread-making", "swimming in the lake", "pottery", "evening storytelling"],
          ["19–20", "Which TWO items does Helen advise guests to bring?", "a torch", "a paper map", "an alarm clock", "a wristwatch", "waterproof clothing"],
        ],
      },
      {
        t: "listen",
        id: "t4d4-nghe-bai",
        title: "Switch-Off Weekends at Stillwater Lodge — a briefing for guests",
        dan: { so: "Day 4, Recording 1", boiCanh: "a coordinator giving information to people who have booked a weekend without phones at a country lodge.", cau: [11, 20] },
        note: "Khoảng 4 phút 50 giây (~800 từ), tốc độ tự nhiên ≈ 165 từ/phút, giọng Anh (nữ). Một người nói, không nghỉ giữa bài. Nghe MỘT lần rồi mới xem lời thoại.",
        lines: [
          { who: "Helen", voice: "uk-nu", text: "Good evening, everyone, and thanks for joining this online briefing. I'm Helen Marsh, and I coordinate the Switch-Off Weekends here at Stillwater Lodge. As you've all booked a place for next month, I'd like to run through what to expect, so that there are no surprises when you arrive.", vi: "Chào buổi tối mọi người, và cảm ơn đã tham gia buổi phổ biến trực tuyến này. Tôi là Helen Marsh, điều phối các kỳ Cuối tuần Tắt máy ở Stillwater Lodge. Vì tất cả các bạn đã đặt chỗ cho tháng sau, tôi muốn điểm qua những gì sẽ diễn ra để không ai bất ngờ khi tới nơi." },
          { who: "Helen", voice: "uk-nu", text: "Let me start with why we set these weekends up in the first place. People often assume we're against technology, or that we're hoping to turn our guests into keen walkers and birdwatchers. We're not, and we don't mind what you do. The idea actually came from our own staff, who'd noticed that guests on ordinary holidays spent the first two days checking their work emails and only began to unwind as they were packing to leave. So the aim is simply to help you get the rest you've paid for a little sooner.", vi: "Để tôi bắt đầu với lý do ban đầu chúng tôi lập ra các kỳ cuối tuần này. Người ta hay cho rằng chúng tôi chống công nghệ, hoặc mong biến khách thành người mê đi bộ và ngắm chim. Không phải, và chúng tôi không bận tâm bạn làm gì. Ý tưởng thật ra đến từ chính nhân viên của chúng tôi, những người đã nhận thấy khách đi nghỉ bình thường dành hai ngày đầu kiểm tra email công việc và chỉ bắt đầu thư giãn khi đang xếp đồ ra về. Nên mục tiêu đơn giản là giúp bạn có được sự nghỉ ngơi mà bạn đã trả tiền, sớm hơn một chút." },
          { who: "Helen", voice: "uk-nu", text: "Now, your phones. When we began, three years ago, we asked guests to hand their devices in at reception, and we locked them in the office safe. That turned out to make people more anxious, not less. So these days each guest is given a small wooden box with a key, and it stays in your own room. You keep the key. Nobody's going to check whether you open it — we've found that simply knowing you could is usually enough to stop you.", vi: "Giờ tới điện thoại của các bạn. Khi mới bắt đầu, ba năm trước, chúng tôi đề nghị khách nộp thiết bị ở quầy lễ tân, và khoá chúng trong két văn phòng. Hoá ra điều đó làm người ta lo hơn chứ không bớt. Nên giờ mỗi khách được phát một hộp gỗ nhỏ có chìa, và nó ở ngay trong phòng bạn. Bạn giữ chìa. Sẽ không ai kiểm tra bạn có mở hay không — chúng tôi thấy rằng chỉ cần biết mình có thể mở thường đã đủ để bạn không mở." },
          { who: "Helen", voice: "uk-nu", text: "What if your family needs to reach you in a hurry? Please don't hand out your mobile number and promise to look at your messages once a day — that rather defeats the purpose. And I do carry a mobile myself, but I'm often out on the hills with no signal, so don't rely on that. Give them the lodge landline instead; it's printed on your booking confirmation. Reception is staffed around the clock, and if a call comes in, someone will come and find you, wherever you are on the site.", vi: "Nếu gia đình cần liên lạc gấp thì sao? Xin đừng đưa số di động rồi hứa mỗi ngày xem tin nhắn một lần — thế thì hỏng cả mục đích. Và tôi có mang di động, nhưng tôi hay ở ngoài đồi không có sóng, nên đừng trông vào đó. Thay vào đó hãy đưa họ số máy bàn của nhà nghỉ; nó được in trên xác nhận đặt chỗ. Lễ tân có người trực suốt ngày đêm, và nếu có cuộc gọi tới, sẽ có người đi tìm bạn, dù bạn ở đâu trong khuôn viên." },
          { who: "Helen", voice: "uk-nu", text: "Accommodation. All the rooms are in the main house, and I'd describe them as comfortable rather than luxurious. Some guests are disappointed to find there's no television, and others ask about a lake view — I'm afraid only four rooms have one, and those were allocated in order of booking. What every room does have is a proper desk, with paper and pens provided, because a surprising number of our guests tell us that writing by hand was the thing they enjoyed most.", vi: "Chỗ ở. Tất cả phòng đều ở nhà chính, và tôi sẽ mô tả chúng là thoải mái hơn là sang trọng. Vài khách thất vọng vì không có tivi, và người khác hỏi về phòng nhìn ra hồ — tôi e là chỉ bốn phòng có, và các phòng đó đã được xếp theo thứ tự đặt chỗ. Thứ mà phòng nào cũng có là một chiếc bàn viết tử tế, có sẵn giấy bút, vì số khách bảo chúng tôi rằng viết tay là điều họ thích nhất nhiều đến bất ngờ." },
          { who: "Helen", voice: "uk-nu", text: "Meals next. Breakfast and dinner are served in the dining room at fixed times, and both are included in the price. Lunch is different. We used to hand out a packed lunch after breakfast, but so much of it was wasted that we stopped. Instead, the kitchen is left open from twelve till two, and you're welcome to make yourself something from whatever's there — soup, bread, salad and so on. It turns out to be surprisingly sociable.", vi: "Tiếp theo là bữa ăn. Bữa sáng và bữa tối được phục vụ ở phòng ăn vào giờ cố định, và cả hai đã gồm trong giá. Bữa trưa thì khác. Trước đây chúng tôi phát cơm hộp sau bữa sáng, nhưng bị bỏ thừa nhiều quá nên đã thôi. Thay vào đó, bếp được mở từ mười hai đến hai giờ, và bạn cứ tự làm món gì đó từ những gì có sẵn — xúp, bánh mì, salad, vân vân. Hoá ra việc đó lại gắn kết mọi người đến bất ngờ." },
          { who: "Helen", voice: "uk-nu", text: "One thing people worry about is boredom. There is a timetable of optional sessions — I'll come to those in a moment — but honestly, the feedback we get most often isn't about the activities at all. Year after year, what guests say they valued was sleeping properly, often for the first time in months. A few mention the conversations they had with other guests, but that comes a long way behind.", vi: "Một điều người ta lo là buồn chán. Có một lịch các buổi hoạt động tự chọn — tôi sẽ nói tới ngay — nhưng thật lòng, phản hồi chúng tôi nhận nhiều nhất lại không hề về các hoạt động. Năm này qua năm khác, điều khách nói họ trân trọng là được ngủ tử tế, thường là lần đầu sau nhiều tháng. Một số ít nhắc tới những cuộc trò chuyện với khách khác, nhưng điều đó xếp sau rất xa." },
          { who: "Helen", voice: "uk-nu", text: "So, the sessions. Most are drop-in: the guided hill walk leaves from the front door at ten each morning, and you just turn up in suitable shoes. The same goes for storytelling by the fire in the evening. Two sessions, though, have limited numbers, so you'll need to put your name down when you arrive on Friday. The first is pottery — the studio only has eight wheels. The second is the early-morning swim in the lake, where, for safety reasons, our lifeguard won't take more than six people at a time. Bread-making used to be on that list too, but we've moved it into the big kitchen, so there's now room for anyone who wants to join in.", vi: "Vậy, các buổi hoạt động. Phần lớn là cứ tới là tham gia: buổi đi bộ lên đồi có hướng dẫn xuất phát từ cửa trước lúc mười giờ mỗi sáng, và bạn chỉ cần có mặt với đôi giày phù hợp. Buổi kể chuyện bên lò sưởi buổi tối cũng vậy. Tuy nhiên có hai buổi giới hạn số người, nên bạn cần ghi tên khi tới nơi hôm thứ Sáu. Buổi thứ nhất là làm gốm — xưởng chỉ có tám bàn xoay. Buổi thứ hai là bơi hồ lúc sáng sớm, nơi mà vì lý do an toàn, nhân viên cứu hộ sẽ không nhận quá sáu người một lượt. Làm bánh mì trước cũng nằm trong danh sách đó, nhưng chúng tôi đã chuyển nó vào bếp lớn, nên giờ có chỗ cho bất kỳ ai muốn tham gia." },
          { who: "Helen", voice: "uk-nu", text: "Finally, what to pack. You won't need a map — the paths are clearly signposted, and we'll give you one anyway. Waterproofs and boots can be borrowed from the drying room, so don't fill your suitcase with those. What people do forget is that without a phone they've no idea what the time is, so a watch is strongly recommended, otherwise you'll miss dinner. And the lodge is a long way from any street lighting, so do bring a torch for getting back from the studio after dark. You might think you'd need an alarm clock as well, but we ring a bell at half past seven, and, believe me, nobody sleeps through it.", vi: "Cuối cùng, mang theo gì. Bạn sẽ không cần bản đồ — các lối đi có biển chỉ rõ, và đằng nào chúng tôi cũng phát cho bạn một cái. Đồ đi mưa và giày có thể mượn ở phòng sấy, nên đừng nhét chúng đầy vali. Điều người ta hay quên là không có điện thoại thì họ chẳng biết mấy giờ, nên rất nên mang đồng hồ đeo tay, không thì bạn sẽ lỡ bữa tối. Và nhà nghỉ ở rất xa đèn đường, nên hãy mang đèn pin để đi từ xưởng về sau khi trời tối. Bạn có thể nghĩ mình cần cả đồng hồ báo thức, nhưng chúng tôi rung chuông lúc bảy rưỡi, và tin tôi đi, không ai ngủ qua nổi tiếng chuông đó." },
          { who: "Helen", voice: "uk-nu", text: "That's everything from me. I'll stay online for a few minutes in case anyone has questions.", vi: "Phần của tôi chỉ có vậy. Tôi sẽ ở lại trực tuyến vài phút phòng khi ai có câu hỏi." },
        ],
      },
      {
        t: "mcq",
        id: "t4d4-nghe-chon",
        title: "Questions 11–16 — Choose the correct letter, A, B or C",
        items: [
          { q: "(11) Why were the Switch-Off Weekends first introduced?", options: ["A to encourage guests to take up outdoor hobbies", "B to help guests start relaxing earlier in their stay", "C to persuade guests to give up technology"], correct: 1, why: "“the aim is simply to help you **get the rest you've paid for a little sooner**” = start relaxing earlier (đổi cả cụm; unwind = relax). A và C là bẫy ② **người ta tưởng**: “**People often assume** we're against technology, or… keen walkers and birdwatchers. **We're not**…”" },
          { q: "(12) What happens to guests' phones during the weekend?", options: ["A They are kept in a locked container in the guest's bedroom.", "B Staff store them securely in the office.", "C Guests carry them but keep them switched off."], correct: 0, why: "“**these days** each guest is given **a small wooden box with a key**, and it **stays in your own room**” = a locked container in the bedroom (cụ thể → khái quát). B là bẫy ① **ngày xưa**: “**When we began**… locked them in the office safe.” C không được nói — điện thoại nằm trong hộp, không mang theo." },
          { q: "(13) If relatives need to contact a guest urgently, they should", options: ["A send a message that the guest will read once a day.", "B call Helen's own mobile phone.", "C ring the lodge's main telephone number."], correct: 2, why: "“Give them **the lodge landline** instead” = the lodge's main telephone number. A bị bẫy ④: “**Please don't**… promise to look at your messages once a day”. B: “I do carry a mobile…, but… **don't rely on that**.”" },
          { q: "(14) What does Helen say about all the bedrooms?", options: ["A They look out over the lake.", "B They are equipped for writing.", "C They are furnished to a luxury standard."], correct: 1, why: "“What **every room** does have is **a proper desk, with paper and pens provided**” = equipped for writing (liệt kê → khái quát). A là bẫy ③ **một phần**: “**only four rooms** have one”. C bị phủ định: “comfortable **rather than** luxurious”. Chữ **all** trong câu hỏi là chìa khoá." },
          { q: "(15) What is the arrangement for lunch?", options: ["A Guests collect a packed meal each morning.", "B It is served in the dining room at a fixed time.", "C Guests prepare it themselves in the kitchen."], correct: 2, why: "“the kitchen is left open…, and **you're welcome to make yourself something**” = prepare it themselves. A là bẫy ①: “We **used to** hand out a packed lunch… **we stopped**.” B đúng với **bữa sáng và bữa tối**, không phải bữa trưa: “Lunch is **different**.”" },
          { q: "(16) According to feedback, what do guests value most about the weekends?", options: ["A the range of organised activities", "B the chance to get to know other people", "C the improvement in their sleep"], correct: 2, why: "“what guests say they valued was **sleeping properly, often for the first time in months**” = the improvement in their sleep. A: “the feedback… **isn't about the activities at all**”. B: “A few mention the conversations…, but that comes **a long way behind**” — có được nhắc nhưng không phải **most**." },
        ],
      },
      {
        t: "quiz",
        id: "t4d4-nghe-hai-1",
        kind: "fill",
        title: "Questions 17–18 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(17–18) Which TWO activities must be booked in advance? ___", answers: ["C D", "CD", "C and D", "C & D", "C/D", "C + D", "C-D", "C, D", "D C", "DC", "D and C", "D & C", "D/C", "D + C", "D-C", "D, C"] }],
      },
      {
        t: "quiz",
        id: "t4d4-nghe-hai-2",
        kind: "fill",
        title: "Questions 19–20 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(19–20) Which TWO items does Helen advise guests to bring? ___", answers: ["A D", "AD", "A and D", "A & D", "A/D", "A + D", "A-D", "A, D", "D A", "DA", "D and A", "D & A", "D/A", "D + A", "D-A", "D, A"] }],
      },
      {
        t: "note",
        title: "Giải thích 17–18 (đáp án C, D) — hai buổi phải ghi tên trước",
        items: [
          "“**Two sessions, though, have limited numbers, so you'll need to put your name down** when you arrive” = must be booked in advance (đổi cấu trúc). Câu này báo trước: hai đáp án sắp tới.",
          "**D pottery** — “The first is **pottery** — the studio only has eight wheels.”",
          "**C swimming in the lake** — “The second is **the early-morning swim in the lake**… won't take more than six people.”",
          "**A hill walk** ✗ và **E storytelling** ✗ — “Most are **drop-in**… you **just turn up**… **The same goes for** storytelling.”",
          "**B bread-making** ✗ — bẫy ① ngày xưa: “Bread-making **used to be** on that list too, **but** we've moved it… there's now room for anyone.”",
        ],
      },
      {
        t: "note",
        title: "Giải thích 19–20 (đáp án A, D) — hai thứ nên mang",
        items: [
          "**D a wristwatch** — “**a watch is strongly recommended**, otherwise you'll miss dinner.” strongly recommended = advises.",
          "**A a torch** — “**do bring a torch** for getting back from the studio after dark.” Chữ **do** nhấn mạnh lời khuyên.",
          "**B a paper map** ✗ — bẫy ④: “You **won't need** a map… we'll give you one anyway.”",
          "**E waterproof clothing** ✗ — bẫy ④: “Waterproofs… **can be borrowed**…, so **don't** fill your suitcase with those.”",
          "**C an alarm clock** ✗ — bẫy ② người ta tưởng: “**You might think** you'd need an alarm clock…, **but** we ring a bell at half past seven.”",
          "Thứ tự trong băng (map → waterproofs → watch → torch → alarm clock) **khác** thứ tự A–E trong đề — với Choose TWO, mắt phải quét cả năm phương án.",
        ],
      },
      {
        t: "table",
        caption: "Bảng paraphrase của bài — đề viết gì, băng nói gì",
        head: ["Câu", "Trong đề", "Trong băng"],
        rows: [
          ["11", "start relaxing earlier in their stay", "get the rest you've paid for a little sooner · began to unwind"],
          ["12", "a locked container in the guest's bedroom", "a small wooden box with a key… stays in your own room"],
          ["13", "the lodge's main telephone number", "the lodge landline"],
          ["14", "equipped for writing", "a proper desk, with paper and pens provided"],
          ["15", "prepare it themselves in the kitchen", "the kitchen is left open… make yourself something"],
          ["16", "the improvement in their sleep", "sleeping properly, often for the first time in months"],
          ["17–18", "must be booked in advance", "have limited numbers… put your name down when you arrive"],
          ["19–20", "advises guests to bring", "is strongly recommended · do bring"],
        ],
      },

      { t: "h", text: "6. Sau khi chấm — tìm kiểu bẫy mình hay dính" },
      {
        t: "table",
        caption: "Mỗi câu sai của bạn thuộc kiểu bẫy nào?",
        head: ["Bạn đã chọn", "Kiểu bẫy", "Lần sau"],
        rows: [
          ["11 A hoặc C · 19–20 C", "② Người ta tưởng", "Nghe People assume / You might think ⇒ chờ We're not / but…"],
          ["12 B · 15 A · 17–18 B", "① Đã bỏ / ngày xưa", "Nghe When we began / used to ⇒ chờ these days / Instead / we've moved"],
          ["14 A · 16 B", "③ Đúng một phần", "Đọc lại câu hỏi: có all / most không?"],
          ["13 A hoặc B · 14 C · 19–20 B hoặc E", "④ Phủ định / đính chính", "Nghe don't / won't need / rather than ⇒ gạch phương án đó"],
        ],
      },
      {
        t: "note",
        title: "💡 Luyện thêm 10 phút với chính bài này",
        items: [
          "Mở lời thoại, **gạch chân mọi tín hiệu**: People often assume · When we began · these days · instead · used to · only · What every room does have is · You won't need · You might think. Đó là “từ vựng của bẫy”.",
          "Nghe lại **không nhìn chữ**, mỗi lần nghe thấy một tín hiệu thì giơ một ngón tay. Mục tiêu: bắt được ít nhất 8.",
          "Chép **5 dòng** của bảng paraphrase vào sổ. Trước khi nghe đề kế tiếp, đọc lại sổ 1 phút.",
          "Đúng **9–10/10**: bạn đang ở mức Part 2 của band 7.5. Đúng **7–8**: ổn, xem lại kiểu bẫy mình dính. **≤ 6**: nghe lại Practice 1, rồi làm lại bài chính sau hai ngày.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 4 ═══════════════════════════ */
  {
    id: "t4d4-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 4",
    goal: "Tự kiểm cả ngày: dùng đúng từ và collocation về tâm lý – hạnh phúc – hành vi, nhận ra ba tầng của một ý và câu khái quát, nghe MCQ Part 2 có bẫy — 40 câu có đáp án.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (40 câu)",
        items: [
          "**I** Điền từ (9) · **II** Trắc nghiệm từ vựng (8) · **III** Dạng từ (5) · **IV** Dịch (5) — bài 1.",
          "**V** Ba tầng · khái quát · phản đề (5) · **VI** Chữ giảm tuyệt đối (4) — bài 2.",
          "**VII** Nghe: một đoạn Part 2 ngắn, 4 câu trắc nghiệm — bài 3.",
          "Đạt: **≥ 30/40**. Phần I–IV sai từ 6 câu ⇒ ôn lại thẻ từ; phần V–VI sai từ 3 câu ⇒ đọc lại bài 2 mục 3–5.",
          "Từ nào sai ⇒ chép **cả cụm** vào sổ (boost self-esteem, không chỉ boost).",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 4 trước khi làm bài",
        center: "Psychology · happiness · behaviour",
        branches: [
          { label: "Tâm trí", items: ["cognitive · perception", "bias · assumption", "mindset · rational"] },
          { label: "Hạnh phúc", items: ["well-being · contentment", "fulfilment · resilience", "anxiety · burnout"] },
          { label: "Hành vi", items: ["incentive · impulse", "peer pressure · conform", "instant gratification"] },
          { label: "Tác động", items: ["foster ↔ undermine", "trigger · reinforce", "attribute A to B · derive … from"] },
          { label: "Viết band 7", items: ["nhận định → cơ chế → ví dụ", "Granted, …, but…", "tend to · most · is likely to"] },
        ],
      },

      { t: "h", text: "I. Điền từ (9 câu)" },
      {
        t: "p",
        text: "Chọn từ trong hộp, mỗi từ dùng một lần: **anxiety · assumption · contentment · empathy · impulse · mindset · peer · temperament · trigger**",
      },
      {
        t: "quiz",
        id: "t4d4-bt-dien",
        kind: "fill",
        title: "I. Điền từ trong hộp",
        items: [
          { q: "1. The whole plan rests on the ___ that people will give up their cars if buses are free.", answers: ["assumption"] },
          { q: "2. A sudden loud noise can ___ panic in people who have lived through a war.", answers: ["trigger"] },
          { q: "3. Reading novels allows us to feel ___ for characters whose lives are nothing like our own.", answers: ["empathy"] },
          { q: "4. Even as a small child she had a calm ___ and rarely cried.", answers: ["temperament"] },
          { q: "5. Supermarkets rely on shoppers buying sweets on ___ while they queue.", answers: ["impulse"] },
          { q: "6. Many teenagers take up smoking because of ___ pressure.", answers: ["peer"] },
          { q: "7. Employees with a growth ___ see criticism as a chance to improve.", answers: ["mindset"] },
          { q: "8. Lasting ___ has more to do with relationships than with possessions.", answers: ["contentment"] },
          { q: "9. Exam-related ___ is now one of the commonest reasons for students to see a counsellor.", answers: ["anxiety"] },
        ],
      },

      { t: "h", text: "II. Chọn đáp án đúng (8 câu)" },
      {
        t: "mcq",
        id: "t4d4-bt-chon",
        title: "II. Từ vựng và collocation",
        items: [
          { q: "1. Caring for a sick relative for years can take a heavy ___ on a person's own health.", options: ["cost", "toll", "weight", "loss"], correct: 1, why: "take a (heavy) toll on — cụm cố định." },
          { q: "2. Researchers ___ the improvement in pupils' behaviour to the new mentoring scheme.", options: ["derive", "foster", "attribute", "reinforce"], correct: 2, why: "attribute A to B = quy A cho B. derive … from; foster / reinforce + tân ngữ, không có to." },
          { q: "3. The job is well paid, but I find it extremely ___.", options: ["stressful", "stressed", "stress", "stressing"], correct: 0, why: "Công việc gây căng thẳng ⇒ stressful. stressed dùng cho người." },
          { q: "4. Children who can delay ___ at the age of five tend to do better at school later.", options: ["gratitude", "satisfaction", "grateful", "gratification"], correct: 3, why: "delay gratification = hoãn sự thoả mãn. gratitude = lòng biết ơn — hai từ gần giống nhau về mặt chữ." },
          { q: "5. He is very ___ to criticism, so choose your words carefully.", options: ["sensible", "sensitive", "sensational", "senseless"], correct: 1, why: "sensitive to = nhạy cảm với. sensible = hợp lý, biết điều." },
          { q: "6. Constant comparison with classmates can ___ a child's confidence.", options: ["undermine", "underline", "undergo", "undertake"], correct: 0, why: "undermine confidence = làm xói mòn sự tự tin. underline = gạch chân / nhấn mạnh; undergo = trải qua; undertake = đảm nhận." },
          { q: "7. Whether intelligence is ___ or the product of education has been debated for a century.", options: ["compulsory", "rational", "innate", "impulsive"], correct: 2, why: "innate = bẩm sinh, đối lập với ‘the product of education’." },
          { q: "8. After moving abroad she lived ___ for two years, yet she says she never once felt ___.", options: ["lonely / alone", "alone / alone", "lonely / lonely", "alone / lonely"], correct: 3, why: "live alone = sống một mình (trung tính); feel lonely = thấy cô đơn." },
        ],
      },

      { t: "h", text: "III. Dạng từ (5 câu)" },
      {
        t: "quiz",
        id: "t4d4-bt-ho-tu",
        kind: "fill",
        title: "III. Viết dạng đúng của từ trong ngoặc",
        items: [
          { q: "1. Growing up in a ___ (RESILIENCE) community helped her to deal with setbacks later in life.", answers: ["resilient"] },
          { q: "2. Many voters have an inaccurate ___ (PERCEIVE) of how much crime there really is.", answers: ["perception"] },
          { q: "3. He remained ___ (OPTIMISM) about finding work, even after six months of rejections.", answers: ["optimistic"] },
          { q: "4. Sugar is sometimes described as mildly ___ (ADDICT).", answers: ["addictive"] },
          { q: "5. The ___ (PSYCHOLOGY) who led the study warned against drawing firm conclusions.", answers: ["psychologist"] },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d4-bt-dich",
        kind: "translate",
        title: "IV. Dịch sang tiếng Anh — dùng từ gợi ý",
        grammar: "boost self-esteem · cope with · a sense of fulfilment · be prone to · instant gratification",
        items: [
          { q: "Lời khen của giáo viên có thể nâng lòng tự trọng của học sinh.", answers: ["Praise from teachers can boost students' self-esteem.", "Teachers' praise can boost students' self-esteem.", "Praise from teachers can boost pupils' self-esteem.", "A teacher's praise can boost a student's self-esteem.", "Praise from teachers can raise students' self-esteem.", "Teachers' praise can boost pupils' self-esteem."], hint: "praise · boost · self-esteem" },
          { q: "Nhiều người lớn không biết cách đối phó với căng thẳng.", answers: ["Many adults do not know how to cope with stress.", "Many adults don't know how to cope with stress.", "A lot of adults do not know how to cope with stress.", "Many adults do not know how to deal with stress."], hint: "how to cope with stress" },
          { q: "Công việc tình nguyện đem lại cho cô ấy cảm giác viên mãn.", answers: ["Voluntary work gives her a sense of fulfilment.", "Volunteering gives her a sense of fulfilment.", "Volunteer work gives her a sense of fulfilment.", "Voluntary work gives her a sense of fulfillment.", "Volunteering gives her a sense of fulfillment."], hint: "voluntary work · a sense of fulfilment" },
          { q: "Người ngủ kém dễ bị lo âu hơn.", answers: ["People who sleep badly are more prone to anxiety.", "People who sleep poorly are more prone to anxiety.", "Poor sleepers are more prone to anxiety.", "People who do not sleep well are more prone to anxiety.", "People who don't sleep well are more prone to anxiety."], hint: "sleep badly · be more prone to anxiety" },
          { q: "Mạng xã hội đem lại sự thoả mãn tức thì, nhưng hiếm khi đem lại hạnh phúc lâu bền.", answers: ["Social media offers instant gratification, but it rarely brings lasting happiness.", "Social media offers instant gratification but rarely brings lasting happiness.", "Social media provides instant gratification, but it rarely brings lasting happiness.", "Social media offers instant gratification, but rarely brings lasting happiness.", "Social media gives instant gratification, but it rarely brings lasting happiness.", "Social media provides instant gratification but rarely brings lasting happiness."], hint: "instant gratification · rarely · lasting happiness" },
        ],
      },

      { t: "h", text: "V. Viết: ba tầng, khái quát, phản đề (5 câu)" },
      {
        t: "p",
        text: "Đọc đoạn thân bài sau (các câu đã đánh số), rồi trả lời câu 1–3. Câu 4–5 hỏi riêng.",
      },
      {
        t: "passage",
        title: "Một thân bài mẫu — đề: “Working from home makes employees happier.”",
        intro: "Đoạn tự soạn. Mỗi câu làm một việc khác nhau.",
        paras: [
          { label: "①", text: "Working from home tends to improve well-being chiefly by returning time to employees." },
          { label: "②", text: "This is because the daily commute, which in large cities can easily take two hours, is time that is neither paid nor restful, and removing it leaves people with more energy for the rest of the day." },
          { label: "③", text: "A parent who no longer has to leave the house at half past six, for instance, can have breakfast with her children and still start work on time." },
          { label: "④", text: "Granted, some home workers miss the company of colleagues, but this can usually be addressed by spending one or two days a week in the office." },
          { label: "⑤", text: "For most employees, therefore, the arrangement is likely to raise rather than lower their satisfaction with life." },
        ],
      },
      {
        t: "mcq",
        id: "t4d4-bt-viet",
        title: "V. Chọn đáp án đúng",
        items: [
          { q: "1. Câu nào là tầng 2 (cơ chế)?", options: ["Câu ①", "Câu ②", "Câu ③", "Câu ⑤"], correct: 1, why: "Câu ② mở bằng This is because và giải thích VÌ SAO có thêm thời gian thì khoẻ hơn (đi lại không được trả công, không được nghỉ ⇒ bỏ đi thì còn sức)." },
          { q: "2. Câu ③ làm việc gì?", options: ["Nêu nhận định", "Bác phản đề", "Đưa ví dụ cụ thể — một kiểu người trong một tình huống", "Kết luận cả bài"], correct: 2, why: "A parent who…, for instance, … = trường hợp điển hình, hình dung được ⇒ tầng 3." },
          { q: "3. Trong câu ④, phần nào BÁC phản đề?", options: ["Granted", "some home workers miss the company of colleagues", "some home workers", "but this can usually be addressed by spending one or two days a week in the office"], correct: 3, why: "Vế sau but đưa một lý lẽ mới (có thể giải quyết bằng làm ở văn phòng 1–2 ngày). Vế trước but là phản đề được nêu." },
          { q: "4. Câu nào khái quát quá đà?", options: ["Everybody is happier when they work from home.", "Working from home tends to suit people with long commutes.", "Many employees report higher satisfaction after switching to remote work.", "Remote work is likely to benefit parents of young children in particular."], correct: 0, why: "Everybody = tuyệt đối, một ngoại lệ là đủ bác. Ba câu còn lại có tends to / many / is likely to + phạm vi." },
          { q: "5. Câu nào nên là câu chủ đề của một thân bài band 7?", options: ["Firstly, there are many advantages.", "There is good reason to think that flexible hours reduce stress among working parents.", "For example, my sister works at home.", "Moreover, it is also good for the environment and the economy and the family."], correct: 1, why: "B có nhận định + phạm vi (among working parents), mở đường cho tầng 2. A trống rỗng; C là ví dụ; D gộp ba ý — dấu hiệu sắp liệt kê." },
        ],
      },

      { t: "h", text: "VI. Chữ giảm tuyệt đối (4 câu)" },
      {
        t: "p",
        text: "Điền cụm trong hộp để câu không còn khái quát quá đà (mỗi cụm một lần): **tend to** · **Most** · **is likely to** · **not necessarily**",
      },
      {
        t: "quiz",
        id: "t4d4-bt-giam",
        kind: "fill",
        title: "VI. Điền cụm trong hộp",
        items: [
          { q: "1. A higher salary does ___ lead to greater job satisfaction.", answers: ["not necessarily"] },
          { q: "2. ___ people would accept a slightly lower income in exchange for shorter hours.", answers: ["Most"] },
          { q: "3. Children who are read to every night ___ develop a wider vocabulary.", answers: ["tend to"] },
          { q: "4. A ban on phones in classrooms ___ improve concentration, at least in the short term.", answers: ["is likely to"] },
        ],
      },

      { t: "h", text: "VII. Nghe — Part 2 ngắn (4 câu)" },
      {
        t: "p",
        text: "Đọc bốn câu hỏi trong **25 giây**, tóm mỗi phương án bằng 2–3 chữ, rồi nghe **một lần**. Người nói là trưởng một dàn hợp xướng cộng đồng, giọng Anh (nam).",
      },
      {
        t: "listen",
        id: "t4d4-bt-nghe",
        title: "Northgate Community Choir — a taster evening",
        dan: { so: "Day 4, Homework recording", boiCanh: "the leader of a community choir talking to people who are thinking of joining.", cau: [1, 4] },
        note: "Khoảng 1 phút 30 giây, giọng Anh (nam). Cả ba phương án của mỗi câu đều được nhắc tới.",
        lines: [
          { who: "Choir leader", voice: "uk-nam", text: "Thanks for coming along to this taster evening for the Northgate Community Choir. A lot of people tell me they'd love to join but can't read music. You don't need to. We did try handing out printed scores a few years ago, and half the group stopped coming. Some choirs send recordings home for people to practise with; we don't, because we'd rather you simply turned up. Everything is learned by ear — I sing a line, you sing it back.", vi: "Cảm ơn các bạn đã tới buổi hát thử của Dàn hợp xướng Cộng đồng Northgate. Rất nhiều người bảo tôi họ muốn tham gia nhưng không đọc được nốt nhạc. Không cần đâu. Vài năm trước chúng tôi có thử phát bản nhạc in, và nửa nhóm thôi không tới nữa. Một số dàn hợp xướng gửi bản thu về nhà cho mọi người tập; chúng tôi thì không, vì chúng tôi muốn các bạn cứ đến là được. Mọi thứ đều học bằng tai — tôi hát một câu, các bạn hát lại." },
          { who: "Choir leader", voice: "uk-nam", text: "We meet on Wednesdays. It used to be seven o'clock, but people coming straight from work were always rushing, so we now start at half past seven and finish at nine.", vi: "Chúng tôi họp vào thứ Tư. Trước đây là bảy giờ, nhưng những người đi thẳng từ chỗ làm lúc nào cũng vội, nên giờ chúng tôi bắt đầu lúc bảy rưỡi và kết thúc lúc chín giờ." },
          { who: "Choir leader", voice: "uk-nam", text: "As for cost, there's no joining fee and no audition. I'm not paid, and the songs we sing are all out of copyright, so there's no music to buy. We do ask for three pounds a week, which goes entirely on hiring this hall — and if that's difficult, have a quiet word with me and we'll forget about it.", vi: "Về chi phí, không có phí gia nhập và không thi tuyển. Tôi không nhận lương, và các bài chúng tôi hát đều đã hết bản quyền nên không phải mua nhạc. Chúng tôi có đề nghị góp ba bảng mỗi tuần, toàn bộ dùng để thuê hội trường này — và nếu khó khăn, cứ nói riêng với tôi rồi ta bỏ qua khoản đó." },
          { who: "Choir leader", voice: "uk-nam", text: "Finally, concerts. We give two a year, in summer and winter. Nobody has to perform — about a third of our members never do — and you don't need to have been with us for any particular length of time. What we do insist on is that if you sign up for a concert, you come to the last four rehearsals before it.", vi: "Cuối cùng là các buổi diễn. Chúng tôi diễn hai lần một năm, mùa hè và mùa đông. Không ai buộc phải biểu diễn — khoảng một phần ba thành viên không bao giờ diễn — và bạn không cần phải tham gia đủ một khoảng thời gian nào cả. Điều chúng tôi nhất định yêu cầu là nếu bạn đăng ký diễn, bạn phải tới bốn buổi tập cuối trước buổi diễn." },
        ],
      },
      {
        t: "mcq",
        id: "t4d4-bt-nghe-chon",
        title: "VII. Choose the correct letter, A, B or C",
        items: [
          { q: "(1) How do members learn new songs?", options: ["A by reading printed music", "B by practising with recordings at home", "C by listening and repeating"], correct: 2, why: "“Everything is **learned by ear** — I sing a line, you sing it back” = listening and repeating. A là bẫy ① (đã thử rồi bỏ: “We **did try**… half the group stopped coming”); B là việc **dàn khác** làm: “Some choirs… **we don't**”." },
          { q: "(2) Rehearsals now begin at", options: ["A 7.00.", "B 7.30.", "C 9.00."], correct: 1, why: "“we **now** start at **half past seven**”. 7.00 là giờ **cũ** (It used to be — bẫy ①); 9.00 là giờ **kết thúc**." },
          { q: "(3) What is the weekly payment used for?", options: ["A renting the place where the choir meets", "B paying the choir leader", "C buying the music"], correct: 0, why: "“three pounds a week, which **goes entirely on hiring this hall**” = renting the place where the choir meets. B: “**I'm not paid**”; C: “**no music to buy**” — bẫy ④ phủ định." },
          { q: "(4) Which rule applies to members who take part in a concert?", options: ["A They must have belonged to the choir for a minimum period.", "B They must attend the final rehearsals.", "C They must sing in both concerts each year."], correct: 1, why: "“**What we do insist on** is that… you come to **the last four rehearsals** before it” = attend the final rehearsals. A: “you **don't need** to have been with us for any particular length of time”; C: “**Nobody has to** perform”." },
        ],
      },
    ],
  },
];
