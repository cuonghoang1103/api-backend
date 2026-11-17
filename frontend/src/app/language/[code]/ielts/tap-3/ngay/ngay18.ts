/**
 * IELTS Tập 3 — Ngày 18 (tự soạn 18/11/2026; mọi câu ví dụ, bài mẫu, kịch bản nghe, bài đọc, câu bài tập VIẾT MỚI):
 *   Bài 1 · Vocab     — Social media vòng 2 (16) · Personality (18) · Relationships (12) · 10 collocation · gom 150 cụm động từ
 *                        theo 10 nhóm + 20 cụm vào thẻ nhớ [VC01 VC32 VD2]
 *   Bài 2 · Writing   — Problem / solution band 6: giải pháp gắn đúng nguyên nhân, mở bài nhượng bộ, chuỗi hệ quả hai tầng;
 *                        bài mẫu band 5 vs band 6 cùng đề [W06]
 *   Bài 3 · Speaking  — Phỏng vấn xin việc: nghe phỏng vấn mẫu (6 câu), khung Present–Past–Future, STAR, điểm yếu, câu hỏi gián tiếp
 *                        lịch sự [S16 E05 L18] `canh` 🔊 ngữ điệu lịch sự
 *   Bài tập           — 36 câu + 3 câu nói.
 *   Kiểm tra chặng    — Ngày 13–18 (8 phần). Phần N14 đã đối chiếu với ngay14.ts thật (soát 18/11): AWL sublist 5,
 *                        quyền lợi lao động, collocation Task 2, outweigh / positive–negative, Part 2 nơi công cộng + Part 3
 *                        ưu – nhược, /ɪə/ /eə/ /ʊə/. Bài đọc Ngày 13 nay là “Lights on the Rocks” (hải đăng) — bài kiểm tra
 *                        không hỏi lại nội dung passage đó.
 * Nối: Tập 1 Ngày 1 (social media vòng 1) · Tập 2 Ngày 22 (10 cụm tính cách) · Tập 3 Ngày 7 (ngân hàng tính cách) ·
 *      Tập 2 Ngày 14 (problem / solution lần đầu) · Tập 2 Ngày 17 (họp công việc) · Tập 2 Ngày 19 (câu hỏi gián tiếp) ·
 *      Tập 3 Ngày 13 · 15 · 17 (bị động, điều kiện loại 2, “, which” và rút gọn).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T3D18_VOCAB: Lesson = {
  id: "t3d18-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Social media vòng 2 · Personality & relationships · gom 150 cụm động từ",
  goal: "Dùng đúng 76 từ và cụm về mạng xã hội (algorithm, misinformation, echo chamber…), tính cách (conscientious, resilient, self-centred…) và quan hệ (compromise, mutual respect, drift apart…), và ôn trọn 150 cụm động từ đã rải ở Tập 1–2 theo 10 nhóm việc — vốn từ cho Task 2 dạng problem / solution, Part 2 tả người và phỏng vấn xin việc hôm nay.",
  minutes: 90,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Social media vòng 2** (Tập 1 Ngày 1 là vòng 1: post, share, follow…). Lần này là lớp từ để **bàn luận**: algorithm, misinformation, echo chamber, cyberbullying, digital footprint — 16 từ.",
        "**Personality & relationships** (nối 10 cụm dễ ở Tập 2 Ngày 22): 18 tính từ tính cách + 12 từ về quan hệ + 10 collocation. Dùng cho **Part 2 tả người**, **Task 2 về gia đình – xã hội** và **phỏng vấn** (bài 3 hôm nay).",
        "**Gom 150 cụm động từ** (phrasal verbs) đã gặp rải rác ở Tập 1–2, xếp lại theo **10 nhóm việc**; 20 cụm đáng giá nhất được đưa vào thẻ nhớ.",
        "Quy tắc dùng: cụm động từ làm bài **Nói** tự nhiên (LR band 6: “idiomatic language”); trong **Task 2** ưu tiên động từ một chữ (bring about → cause) trừ vài cụm trung tính như lead to, result in, deal with.",
        "Đẩy band: **LR band 6** — “đủ rộng để bàn luận chủ đề, dám dùng từ ít gặp”. Mỗi tính cách phải đi kèm **một chuyện chứng minh** — nói “She is kind” chưa đủ.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Social media vòng 2 — từ để bàn luận (16 từ)" },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Mạng xã hội: bốn góc để bàn trong Task 2 và Part 3",
      center: "social media",
      branches: [
        { label: "Cách nó vận hành", items: ["algorithm", "platform", "notification", "engagement"] },
        { label: "Người làm nội dung", items: ["influencer", "content creator", "go viral"] },
        { label: "Mặt trái", items: ["misinformation", "echo chamber", "cyberbullying", "addictive"] },
        { label: "Quyền riêng tư", items: ["digital footprint", "privacy settings", "anonymous", "screen time"] },
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "platform", pos: "n", ipa: "/ˈplætfɔːm/", vi: "nền tảng (mạng xã hội, dịch vụ trực tuyến)", ex: "Most teenagers use at least three social media platforms.", exVi: "Đa số thanh thiếu niên dùng ít nhất ba nền tảng mạng xã hội.", more: "**on a platform** (giới từ on) · **a video-sharing / messaging platform**." },
        { w: "algorithm", pos: "n", ipa: "/ˈælɡərɪðəm/", vi: "thuật toán", ex: "The algorithm decides which posts appear first.", exVi: "Thuật toán quyết định bài nào hiện lên đầu.", more: "Nhấn âm 1. **a recommendation algorithm** (thuật toán đề xuất)." },
        { w: "notification", pos: "n", ipa: "/ˌnəʊtɪfɪˈkeɪʃn/", vi: "thông báo (trên điện thoại)", ex: "I turned off all notifications so that I could concentrate.", exVi: "Tôi tắt hết thông báo để tập trung.", more: "Động từ: **notify sb of sth**. **turn off / mute notifications**." },
        { w: "engagement", pos: "n", ipa: "/ɪnˈɡeɪdʒmənt/", vi: "mức độ tương tác; sự tham gia", ex: "Angry posts tend to get more engagement than calm ones.", exVi: "Bài đăng giận dữ thường được tương tác nhiều hơn bài điềm tĩnh.", more: "Động từ: **engage with** content / an audience. Nghĩa khác: lễ đính hôn." },
        { w: "feed", pos: "n", ipa: "/fiːd/", vi: "bảng tin (dòng bài đăng hiện ra khi mở ứng dụng)", ex: "My feed is full of videos I never asked to see.", exVi: "Bảng tin của tôi đầy những video tôi chưa hề yêu cầu xem.", more: "**scroll through your feed** · **a news feed**. Giao tiếp qua lại: **interact with** / **interaction** (AWL sublist 3, Ngày 2)." },
        { w: "influencer", pos: "n", ipa: "/ˈɪnfluənsə/", vi: "người có ảnh hưởng trên mạng", ex: "Many young people buy products recommended by influencers.", exVi: "Nhiều người trẻ mua sản phẩm do người có ảnh hưởng giới thiệu.", more: "Họ từ: influence (n, v) · influential (adj). **have an influence on** — giới từ on." },
        { w: "content creator", pos: "n", ipa: "/ˈkɒntent kriˌeɪtə/", vi: "người sáng tạo nội dung", ex: "She gave up her office job to become a full-time content creator.", exVi: "Cô ấy bỏ việc văn phòng để làm sáng tạo nội dung toàn thời gian.", more: "**content** (nội dung) không đếm được, nhấn âm 1; khác tính từ con**tent** (hài lòng), nhấn âm 2." },
        { w: "go viral", pos: "v phr", ipa: "/ɡəʊ ˈvaɪrəl/", vi: "lan truyền chóng mặt trên mạng", ex: "The video went viral and was viewed ten million times in a week.", exVi: "Đoạn video lan truyền chóng mặt, được xem mười triệu lượt trong một tuần.", more: "go – went – gone. **a viral video / post**." },
        { w: "misinformation", pos: "n", ipa: "/ˌmɪsɪnfəˈmeɪʃn/", vi: "thông tin sai lệch", ex: "Misinformation about health spreads quickly online.", exVi: "Thông tin sai về sức khoẻ lan nhanh trên mạng.", more: "Không đếm được: ~~a misinformation~~. **spread misinformation** · gần nghĩa: **fake news**, false information." },
        { w: "echo chamber", pos: "n", ipa: "/ˈekəʊ tʃeɪmbə/", vi: "“buồng vang” — môi trường chỉ nghe ý kiến giống mình", ex: "Social media can create echo chambers in which people only hear views they already agree with.", exVi: "Mạng xã hội có thể tạo ra các “buồng vang” nơi người ta chỉ nghe quan điểm mình vốn đồng ý.", more: "Từ ít gặp, rất hợp Task 2. Câu ví dụ dùng **in which** (Ngày 17)." },
        { w: "cyberbullying", pos: "n", ipa: "/ˈsaɪbəbʊliɪŋ/", vi: "bắt nạt trên mạng", ex: "Schools should teach students how to deal with cyberbullying.", exVi: "Trường học nên dạy học sinh cách đối phó với bắt nạt trên mạng.", more: "**be a victim of cyberbullying** · bully (v, n) · **cyber-** = thuộc về mạng: cybercrime, cybersecurity." },
        { w: "addictive", pos: "adj", ipa: "/əˈdɪktɪv/", vi: "gây nghiện", ex: "Short videos are designed to be highly addictive.", exVi: "Video ngắn được thiết kế để gây nghiện cao.", more: "Vật thì **addictive**; người thì **addicted to**: He is addicted **to** his phone. Danh từ: addiction (to)." },
        { w: "screen time", pos: "n", ipa: "/ˈskriːn taɪm/", vi: "thời gian dùng màn hình", ex: "Parents are advised to limit their children's screen time.", exVi: "Cha mẹ được khuyên hạn chế thời gian dùng màn hình của con.", more: "**limit / reduce / cut down on screen time** · **excessive screen time** (quá nhiều)." },
        { w: "digital footprint", pos: "n", ipa: "/ˌdɪdʒɪtl ˈfʊtprɪnt/", vi: "dấu vết số (những gì bạn để lại trên mạng)", ex: "Employers often check a candidate's digital footprint before an interview.", exVi: "Nhà tuyển dụng thường kiểm tra dấu vết số của ứng viên trước phỏng vấn.", more: "**leave a digital footprint** — nối bài phỏng vấn hôm nay." },
        { w: "privacy", pos: "n", ipa: "/ˈprɪvəsi/", vi: "sự riêng tư", ex: "Few users ever change their privacy settings.", exVi: "Ít người dùng từng đổi cài đặt riêng tư.", more: "BrE đọc /ˈprɪvəsi/, AmE /ˈpraɪvəsi/. **privacy settings** · **invade sb's privacy** · tính từ: private." },
        { w: "anonymous", pos: "adj", ipa: "/əˈnɒnɪməs/", vi: "ẩn danh", ex: "People are often ruder online because they can remain anonymous.", exVi: "Người ta thường thô lỗ hơn trên mạng vì có thể ẩn danh.", more: "**remain / stay anonymous** · trạng từ: anonymously · danh từ: anonymity /ˌænəˈnɪməti/." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Tính cách — 18 tính từ band 6 (nối Tập 2 Ngày 22, Tập 3 Ngày 7)" },
    {
      t: "p",
      text: "Tập 2 Ngày 22 bạn đã có nhóm dễ: easy-going, outgoing, stubborn, bad-tempered… Ngày 7 của tập này có “ngân hàng tính cách” cho đề tả người. Hôm nay nâng lên lớp từ mà người chấm coi là **less common**: thay **nice / good / friendly** bằng từ nói **chính xác tốt ở điểm nào**.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Xếp 18 tính từ theo sắc thái",
      caption: "Cột giữa: tốt hay xấu tuỳ ngữ cảnh — ambitious trong phỏng vấn là khen, trong chuyện bạn bè có thể là chê.",
      cols: [
        { title: "Khen", items: ["reliable", "considerate", "conscientious", "open-minded", "modest", "resilient", "trustworthy", "sensible", "sociable"] },
        { title: "Tuỳ ngữ cảnh", items: ["ambitious", "assertive", "sensitive", "introverted", "extroverted"] },
        { title: "Chê", items: ["self-centred", "arrogant", "narrow-minded", "impulsive"] },
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "reliable", pos: "adj", ipa: "/rɪˈlaɪəbl/", vi: "đáng tin cậy (nói là làm)", ex: "Linh is the most reliable person in our team; she has never missed a deadline.", exVi: "Linh là người đáng tin nhất nhóm; cô ấy chưa bao giờ trễ hạn.", more: "Họ từ: rely on (v) · reliability (n) · ↔ unreliable. Dùng cho cả người lẫn vật (a reliable source)." },
        { w: "considerate", pos: "adj", ipa: "/kənˈsɪdərət/", vi: "chu đáo, biết nghĩ cho người khác", ex: "It was considerate of him to turn the music down.", exVi: "Anh ấy thật chu đáo khi vặn nhỏ nhạc.", more: "⚠️ Khác **considerable** (đáng kể). **be considerate of / towards** others ↔ inconsiderate." },
        { w: "sociable", pos: "adj", ipa: "/ˈsəʊʃəbl/", vi: "hoà đồng, thích giao du", ex: "My flatmate is very sociable and knows everyone in the building.", exVi: "Bạn cùng phòng tôi rất hoà đồng, quen hết mọi người trong toà nhà.", more: "⚠️ **sociable** (tính người) ≠ **social** (thuộc về xã hội: social problems)." },
        { w: "introverted", pos: "adj", ipa: "/ˈɪntrəvɜːtɪd/", vi: "hướng nội", ex: "Introverted people often prefer working alone.", exVi: "Người hướng nội thường thích làm việc một mình.", more: "Danh từ: **an introvert**. Không phải “nhút nhát” (shy) — chỉ là nạp năng lượng khi ở một mình." },
        { w: "extroverted", pos: "adj", ipa: "/ˈekstrəvɜːtɪd/", vi: "hướng ngoại", ex: "Sales jobs usually suit extroverted people.", exVi: "Việc bán hàng thường hợp với người hướng ngoại.", more: "Danh từ: **an extrovert**. Gần nghĩa: outgoing (Tập 2 Ngày 22)." },
        { w: "ambitious", pos: "adj", ipa: "/æmˈbɪʃəs/", vi: "có tham vọng, nhiều hoài bão", ex: "She is ambitious and hopes to run her own company by thirty.", exVi: "Cô ấy nhiều hoài bão và mong điều hành công ty riêng trước ba mươi tuổi.", more: "Danh từ: **ambition** · **achieve / fulfil an ambition**. Cũng dùng cho kế hoạch: an ambitious plan." },
        { w: "conscientious", pos: "adj", ipa: "/ˌkɒnʃiˈenʃəs/", vi: "tận tâm, làm việc kỹ lưỡng", ex: "He is a conscientious student who checks every answer twice.", exVi: "Cậu ấy là sinh viên tận tâm, kiểm tra mỗi đáp án hai lần.", more: "Từ “đắt” cho phỏng vấn. Liên quan: conscience /ˈkɒnʃəns/ (lương tâm). ⚠️ khác conscious (có ý thức, tỉnh táo)." },
        { w: "open-minded", pos: "adj", ipa: "/ˌəʊpən ˈmaɪndɪd/", vi: "cởi mở, sẵn sàng nghe ý khác", ex: "Travelling has made me more open-minded about other cultures.", exVi: "Đi du lịch khiến tôi cởi mở hơn với các nền văn hoá khác.", more: "**be open-minded about / towards** ↔ narrow-minded." },
        { w: "narrow-minded", pos: "adj", ipa: "/ˌnærəʊ ˈmaɪndɪd/", vi: "hẹp hòi, bảo thủ", ex: "It is narrow-minded to judge people by their clothes.", exVi: "Đánh giá người khác qua quần áo là hẹp hòi.", more: "Cấu trúc **It is + adj + to V** (ôn kỹ ở Ngày 23)." },
        { w: "self-centred", pos: "adj", ipa: "/ˌself ˈsentəd/", vi: "chỉ nghĩ tới mình", ex: "Critics say social media makes teenagers more self-centred.", exVi: "Người phê bình nói mạng xã hội khiến thanh thiếu niên chỉ nghĩ tới mình hơn.", more: "AmE: self-centered. Gần nghĩa: selfish. Tiền tố **self-**: self-confident, self-disciplined, self-employed." },
        { w: "sensible", pos: "adj", ipa: "/ˈsensəbl/", vi: "biết điều, có suy xét (quyết định hợp lý)", ex: "It was sensible of you to save some money before quitting.", exVi: "Bạn thật biết suy xét khi để dành tiền trước khi nghỉ việc.", more: "⚠️ Cặp dễ nhầm số 1: **sensible** = hợp lý, chín chắn · **sensitive** = nhạy cảm. “Nhạy cảm” KHÔNG phải sensible." },
        { w: "sensitive", pos: "adj", ipa: "/ˈsensətɪv/", vi: "nhạy cảm; tinh tế với cảm xúc người khác", ex: "He is very sensitive to criticism, so choose your words carefully.", exVi: "Anh ấy rất nhạy cảm với lời chê, nên hãy lựa lời.", more: "**sensitive to** sth · **a sensitive issue** (vấn đề nhạy cảm) ↔ insensitive." },
        { w: "modest", pos: "adj", ipa: "/ˈmɒdɪst/", vi: "khiêm tốn", ex: "Despite winning three awards, she remains modest about her success.", exVi: "Dù đoạt ba giải, cô ấy vẫn khiêm tốn về thành công của mình.", more: "**be modest about** · danh từ: modesty. Nghĩa 2 (Task 1): **a modest increase** = tăng nhẹ." },
        { w: "arrogant", pos: "adj", ipa: "/ˈærəɡənt/", vi: "kiêu ngạo", ex: "Confidence is attractive, but nobody likes an arrogant colleague.", exVi: "Tự tin thì cuốn hút, nhưng không ai thích đồng nghiệp kiêu ngạo.", more: "Danh từ: arrogance. Ranh giới hay hỏi ở Part 3: **confident** (tốt) ↔ **arrogant** (xấu)." },
        { w: "resilient", pos: "adj", ipa: "/rɪˈzɪliənt/", vi: "kiên cường, mau vực dậy sau khó khăn", ex: "Children who face small challenges early become more resilient.", exVi: "Trẻ sớm đối mặt với thử thách nhỏ sẽ kiên cường hơn.", more: "Danh từ: **resilience** — từ rất hợp đề về giáo dục, sức khoẻ tinh thần." },
        { w: "impulsive", pos: "adj", ipa: "/ɪmˈpʌlsɪv/", vi: "bốc đồng, làm theo hứng", ex: "I regret that impulsive decision to post the photo.", exVi: "Tôi hối hận về quyết định bốc đồng đăng tấm ảnh đó.", more: "Danh từ: impulse · **on impulse** (theo hứng) · **impulse buying** (mua bốc đồng)." },
        { w: "trustworthy", pos: "adj", ipa: "/ˈtrʌstwɜːði/", vi: "đáng tin (về đạo đức, giữ bí mật)", ex: "A good friend is someone trustworthy who keeps your secrets.", exVi: "Bạn tốt là người đáng tin, giữ bí mật cho bạn.", more: "reliable = làm việc đúng hẹn; trustworthy = trung thực, không phản bội. Họ từ: trust (n, v)." },
        { w: "assertive", pos: "adj", ipa: "/əˈsɜːtɪv/", vi: "quyết đoán, dám nói ý mình (một cách lịch sự)", ex: "You need to be more assertive in meetings if you want your ideas heard.", exVi: "Bạn cần quyết đoán hơn trong cuộc họp nếu muốn ý mình được nghe.", more: "Khác **aggressive** (hung hăng). Động từ: assert · danh từ: assertiveness." },
      ],
    },
    {
      t: "table",
      caption: "Bốn cặp dễ nhầm — người Việt sai nhiều nhất",
      head: ["Cặp", "Khác nhau", "Ví dụ"],
      rows: [
        ["**sensible** / **sensitive**", "hợp lý, chín chắn / nhạy cảm", "a **sensible** decision · **sensitive** skin"],
        ["**sociable** / **social**", "hoà đồng (người) / thuộc xã hội", "a **sociable** child · **social** media"],
        ["**considerate** / **considerable**", "chu đáo / đáng kể", "a **considerate** neighbour · a **considerable** amount"],
        ["**confident** / **confidential**", "tự tin / bí mật", "a **confident** speaker · **confidential** information"],
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng: tính cách → chuyện chứng minh (nối Tập 3 Ngày 7)",
      items: [
        "Công thức 2 câu: **tính từ + because / in the sense that** → **một việc cụ thể người đó đã làm**. “My manager is really **considerate**. Last month, when my mother was in hospital, she **let me work from home** without my even asking.”",
        "Trong phỏng vấn (bài 3): đừng liệt kê “I am hard-working, reliable and friendly”. Chọn **một** tính từ + **một** chuyện có kết quả.",
        "Muốn nói nhẹ đi: **quite / fairly / a bit** + tính từ chê (“He can be **a bit** impulsive”) — nghe tự nhiên và lịch sự hơn “He is impulsive”.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Quan hệ: gắn bó – mâu thuẫn – hoà giải (12 từ)" },
    {
      t: "vocab",
      items: [
        { w: "acquaintance", pos: "n", ipa: "/əˈkweɪntəns/", vi: "người quen (chưa thân)", ex: "I have hundreds of online acquaintances but only a few close friends.", exVi: "Tôi có hàng trăm người quen trên mạng nhưng chỉ vài người bạn thân.", more: "Thang thân thiết: stranger → **acquaintance** → colleague / classmate → friend → **close friend**." },
        { w: "companionship", pos: "n", ipa: "/kəmˈpænjənʃɪp/", vi: "sự bầu bạn", ex: "Many elderly people keep a pet for companionship.", exVi: "Nhiều người cao tuổi nuôi thú cưng để có bầu bạn.", more: "Không đếm được. Họ từ: **companion** (bạn đồng hành)." },
        { w: "mutual", pos: "adj", ipa: "/ˈmjuːtʃuəl/", vi: "lẫn nhau, từ cả hai phía", ex: "A good marriage is built on mutual respect.", exVi: "Hôn nhân tốt được xây trên sự tôn trọng lẫn nhau.", more: "**mutual respect / trust / understanding** · **a mutual friend** (bạn chung). AWL sublist 9." },
        { w: "trust", pos: "n, v", ipa: "/trʌst/", vi: "lòng tin; tin tưởng", ex: "Once trust is broken, it takes years to rebuild.", exVi: "Một khi lòng tin đã vỡ, phải mất nhiều năm để xây lại.", more: "**build / gain / lose / rebuild trust** · **trust sb with sth**." },
        { w: "loyalty", pos: "n", ipa: "/ˈlɔɪəlti/", vi: "lòng trung thành", ex: "He showed great loyalty to the company that trained him.", exVi: "Anh ấy rất trung thành với công ty đã đào tạo mình.", more: "Tính từ: **loyal to** sb/sth ↔ disloyal." },
        { w: "empathy", pos: "n", ipa: "/ˈempəθi/", vi: "sự đồng cảm (đặt mình vào vị trí người khác)", ex: "Reading novels is said to develop empathy in children.", exVi: "Người ta nói đọc tiểu thuyết phát triển sự đồng cảm ở trẻ.", more: "**show / have empathy for** sb · động từ: empathise with · khác **sympathy** (thương cảm)." },
        { w: "tension", pos: "n", ipa: "/ˈtenʃn/", vi: "sự căng thẳng (giữa người với người)", ex: "Money is the most common source of tension between flatmates.", exVi: "Tiền bạc là nguồn gây căng thẳng phổ biến nhất giữa những người ở chung nhà.", more: "**cause / ease tension** · **tension between** A and B. Mạnh hơn nữa là **conflict** (AWL sublist 5, Ngày 14): come into conflict with · resolve a conflict." },
        { w: "argument", pos: "n", ipa: "/ˈɑːɡjumənt/", vi: "cuộc cãi vã; lập luận", ex: "They had an argument about money and didn't speak for a week.", exVi: "Họ cãi nhau về tiền và không nói chuyện suốt một tuần.", more: "⚠️ Chính tả: argu**e** → argu**ment** (bỏ e). **have an argument with sb about sth**." },
        { w: "misunderstanding", pos: "n", ipa: "/ˌmɪsʌndəˈstændɪŋ/", vi: "sự hiểu lầm", ex: "Text messages easily lead to misunderstandings because there is no tone of voice.", exVi: "Tin nhắn dễ dẫn tới hiểu lầm vì không có giọng nói.", more: "**clear up a misunderstanding** (làm rõ hiểu lầm). Tiền tố **mis-** = sai: misinformation, mislead, misuse." },
        { w: "compromise", pos: "n, v", ipa: "/ˈkɒmprəmaɪz/", vi: "sự thoả hiệp; nhượng bộ nhau", ex: "After a long discussion, we reached a compromise.", exVi: "Sau một hồi bàn bạc, chúng tôi đạt được thoả hiệp.", more: "**reach / make a compromise** · **compromise on** sth. Đuôi -mise đọc /maɪz/." },
        { w: "isolated", pos: "adj", ipa: "/ˈaɪsəleɪtɪd/", vi: "bị cô lập, lẻ loi", ex: "People who work from home can feel isolated.", exVi: "Người làm việc ở nhà có thể thấy lẻ loi.", more: "Danh từ: **isolation** · **social isolation** (cô lập xã hội). AWL sublist 7." },
        { w: "reconcile", pos: "v", ipa: "/ˈrekənsaɪl/", vi: "hoà giải, làm lành (trang trọng)", ex: "It took a year for the two brothers to be reconciled.", exVi: "Phải mất một năm hai anh em mới làm lành.", more: "**be reconciled with** sb · danh từ: **reconciliation**. Khi nói dùng **make up (with)**. Áp lực bạn bè: **peer pressure** (Ngày 2) — dùng lại trong bài Viết hôm nay." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Mười collocation dùng ngay trong Task 2 và Part 3" },
    {
      t: "p",
      text: "Ba cụm bạn đã có từ **Ngày 14** và sẽ dùng lại suốt bài hôm nay: **have a negative impact on** (có tác động xấu tới) · **raise awareness of** (nâng cao nhận thức về) · **strike a balance between A and B** (tìm điểm cân bằng giữa). Mười cụm dưới đây là cụm **mới** cho chủ đề mạng xã hội – quan hệ.",
    },
    {
      t: "vocab",
      items: [
        { w: "take a toll on", pos: "v phr", ipa: "/teɪk ə ˈtəʊl ɒn/", vi: "gây tổn hại dần dần cho", ex: "Late-night scrolling takes a toll on teenagers' sleep and mood.", exVi: "Lướt mạng khuya gây hại dần cho giấc ngủ và tâm trạng của thanh thiếu niên.", more: "take – took – taken. Mạnh hơn **have a negative impact on** (Ngày 14). Thường đi với health, relationships, the environment." },
        { w: "face-to-face interaction", pos: "n phr", ipa: "/ˌfeɪs tə ˈfeɪs ˌɪntərˈækʃn/", vi: "giao tiếp trực tiếp, mặt đối mặt", ex: "Online chatting cannot fully replace face-to-face interaction.", exVi: "Trò chuyện trên mạng không thể thay hẳn giao tiếp trực tiếp.", more: "Cũng dùng làm trạng từ: meet **face to face** (không gạch nối)." },
        { w: "build and maintain relationships", pos: "v phr", ipa: "/bɪld ən meɪnˈteɪn rɪˈleɪʃnʃɪps/", vi: "xây dựng và duy trì các mối quan hệ", ex: "Social media helps people maintain relationships with friends abroad.", exVi: "Mạng xã hội giúp người ta duy trì quan hệ với bạn bè ở nước ngoài.", more: "**a relationship with** sb · **between** A and B. maintain: AWL sublist 2." },
        { w: "a sense of belonging", pos: "n phr", ipa: "/ə sens əv bɪˈlɒŋɪŋ/", vi: "cảm giác thuộc về (một nhóm)", ex: "Joining a club gives new students a sense of belonging.", exVi: "Tham gia câu lạc bộ cho sinh viên mới cảm giác thuộc về.", more: "Khuôn **a sense of** + N: a sense of community / responsibility / achievement." },
        { w: "social isolation", pos: "n phr", ipa: "/ˌsəʊʃl ˌaɪsəˈleɪʃn/", vi: "sự cô lập xã hội", ex: "Living alone in old age can lead to social isolation.", exVi: "Sống một mình khi về già có thể dẫn tới cô lập xã hội.", more: "**suffer from / reduce social isolation** · gần nghĩa: loneliness." },
        { w: "spread false information", pos: "v phr", ipa: "/spred fɔːls ˌɪnfəˈmeɪʃn/", vi: "lan truyền thông tin sai", ex: "Users who spread false information should have their accounts suspended.", exVi: "Người dùng lan truyền thông tin sai nên bị khoá tài khoản.", more: "spread – spread – spread. **information** không đếm được, không thêm -s." },
        { w: "feel left out", pos: "v phr", ipa: "/fiːl left ˈaʊt/", vi: "thấy bị ra rìa, bị bỏ lại", ex: "Teenagers who are not in the group chat often feel left out.", exVi: "Thanh thiếu niên không ở trong nhóm chat thường thấy bị ra rìa.", more: "**be afraid of being left out** — xuất hiện trong bài mẫu band 6 ở bài Viết hôm nay. Gần nghĩa: feel excluded." },
        { w: "set a good example", pos: "v phr", ipa: "/set ə ɡʊd ɪɡˈzɑːmpl/", vi: "làm gương tốt", ex: "Parents should set a good example by putting their own phones away at dinner.", exVi: "Cha mẹ nên làm gương bằng cách cất điện thoại của chính mình trong bữa tối.", more: "**set an example for / to** sb · ↔ set a bad example." },
        { w: "resolve a conflict", pos: "v phr", ipa: "/rɪˈzɒlv ə ˈkɒnflɪkt/", vi: "giải quyết mâu thuẫn", ex: "Good managers resolve conflicts before they damage the team.", exVi: "Quản lý giỏi giải quyết mâu thuẫn trước khi chúng làm hại nhóm.", more: "resolve: AWL sublist 4. Cũng: resolve a problem / a dispute. Danh từ: resolution." },
        { w: "lose touch with", pos: "v phr", ipa: "/luːz ˈtʌtʃ wɪð/", vi: "mất liên lạc với", ex: "I lost touch with most of my school friends after moving to Hanoi.", exVi: "Tôi mất liên lạc với đa số bạn học sau khi chuyển ra Hà Nội.", more: "lose – lost – lost. ↔ **keep / stay in touch with** (Tập 2 Ngày 22) · **get back in touch with** (liên lạc lại)." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Gom 150 cụm động từ — 10 nhóm × 15 cụm" },
    {
      t: "p",
      text: "Cụm động từ (phrasal verb) = **động từ + một hoặc hai tiểu từ** (up, off, out, on, with…), nghĩa thường **khác hẳn** động từ gốc. Tập 1–2 đã dạy rải chúng trong từng bài; giờ gom lại để bạn thấy mình đã có bao nhiêu. Đừng học thuộc 150 dòng một lượt: mỗi ngày đọc **một nhóm**, che cột nghĩa, tự đặt **3 câu về chính mình**.",
    },
    {
      t: "table",
      caption: "Ba kiểu cụm động từ — biết kiểu để đặt tân ngữ đúng chỗ",
      head: ["Kiểu", "Tân ngữ đứng đâu", "Ví dụ"],
      rows: [
        ["**Không có tân ngữ**", "—", "The plane **took off**. · Prices **went up**. · We **fell out**."],
        ["**Tách được** (đa số cụm có tân ngữ)", "Danh từ: giữa hoặc sau. **Đại từ (it / them / him): BẮT BUỘC ở giữa**", "turn **the TV** off = turn off **the TV** · turn **it** off (~~turn off it~~)"],
        ["**Không tách được** (động từ + giới từ; cụm 3 chữ)", "Luôn đứng **sau** cả cụm", "look after **the baby** · look after **her** · put up with **the noise**"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 1 — Học tập & nghiên cứu (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["look up", "tra (từ, thông tin)", "I looked the word up online."],
        ["find out", "tìm ra, biết được", "We found out why the test failed."],
        ["figure out", "nghĩ ra, hiểu ra", "I can't figure out this formula."],
        ["hand in", "nộp (bài)", "Hand in your essay by Friday."],
        ["catch up (with)", "theo kịp", "I need to catch up with the class."],
        ["keep up with", "bắt kịp, không tụt lại", "It's hard to keep up with the reading."],
        ["fall behind", "tụt lại phía sau", "She fell behind after her illness."],
        ["drop out (of)", "bỏ học giữa chừng", "He dropped out of university."],
        ["go over", "xem lại, ôn lại", "Let's go over the answers."],
        ["go through", "đọc kỹ / trải qua", "We went through the report together."],
        ["note down", "ghi lại", "Note down the key dates."],
        ["look into", "xem xét, điều tra", "The team is looking into the cause."],
        ["carry out", "tiến hành (nghiên cứu, khảo sát)", "They carried out a survey."],
        ["sign up (for)", "đăng ký", "I signed up for an evening course."],
        ["brush up on", "ôn lại cho thạo", "I must brush up on my grammar."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 2 — Công việc (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["apply for", "nộp đơn xin", "She applied for three jobs."],
        ["take on", "nhận (việc, người)", "The firm took on ten graduates."],
        ["lay off", "cho nghỉ việc (do cắt giảm)", "The factory laid off 200 workers."],
        ["take over", "tiếp quản", "A new manager took over in May."],
        ["set up", "thành lập", "He set up his own business."],
        ["run out of", "hết, cạn", "We've run out of time."],
        ["deal with", "xử lý, giải quyết", "I deal with customer complaints."],
        ["cope with", "đương đầu, chịu được", "She copes well with pressure."],
        ["call off", "huỷ", "The meeting was called off."],
        ["put off", "hoãn", "Don't put off difficult tasks."],
        ["get ahead", "tiến thân", "You need English to get ahead."],
        ["hand over", "bàn giao", "He handed over the project to me."],
        ["step down", "từ chức", "The director stepped down last year."],
        ["burn out", "kiệt sức vì làm quá", "Many nurses burn out within five years."],
        ["fill in (for)", "làm thay tạm", "Can you fill in for me on Monday?"],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 3 — Quan hệ & gia đình (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["get on (well) with", "hoà hợp với", "I get on well with my flatmates."],
        ["fall out with", "cãi nhau, giận nhau", "She fell out with her sister."],
        ["make up (with)", "làm lành", "They argued but soon made up."],
        ["break up (with)", "chia tay", "He broke up with his girlfriend."],
        ["bring up", "nuôi dạy", "I was brought up by my grandparents."],
        ["grow up", "lớn lên", "I grew up in a small town."],
        ["look after", "chăm sóc", "She looks after her elderly father."],
        ["take after", "giống (bố mẹ)", "I take after my mother."],
        ["look up to", "kính trọng, ngưỡng mộ", "I look up to my first teacher."],
        ["look down on", "coi thường", "Never look down on manual workers."],
        ["rely on", "dựa vào", "You can rely on him."],
        ["let down", "làm thất vọng", "I promised, so I can't let her down."],
        ["stand by", "ở bên, ủng hộ lúc khó", "My friends stood by me."],
        ["drift apart", "dần xa nhau", "We drifted apart after school."],
        ["settle down", "ổn định cuộc sống", "He wants to settle down and have children."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 4 — Giao tiếp & mạng xã hội (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["log in", "đăng nhập", "Log in with your student number."],
        ["log out", "đăng xuất", "Always log out on shared computers."],
        ["scroll through", "lướt (bảng tin)", "I scroll through my feed in bed."],
        ["click on", "bấm vào", "Don't click on unknown links."],
        ["come across", "tình cờ thấy / gặp", "I came across an old photo online."],
        ["get across", "truyền đạt được (ý)", "He couldn't get his point across."],
        ["point out", "chỉ ra", "She pointed out two mistakes."],
        ["speak up", "nói to lên; lên tiếng", "Speak up — I can't hear you."],
        ["speak out (against)", "công khai phản đối", "She spoke out against bullying."],
        ["cut off", "cắt (liên lạc, kết nối)", "We were cut off in the middle of the call."],
        ["hang up", "cúp máy", "He hung up before I could reply."],
        ["call back", "gọi lại", "I'll call you back in ten minutes."],
        ["switch off", "tắt; ngừng chú ý", "I switch off my phone at night."],
        ["open up (to)", "mở lòng, tâm sự", "He rarely opens up to anyone."],
        ["turn to", "tìm đến (ai) để nhờ", "Teenagers turn to friends for advice."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 5 — Sinh hoạt hằng ngày (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["get up", "ra khỏi giường", "I get up at six."],
        ["wake up", "thức giấc", "I woke up twice last night."],
        ["put on", "mặc vào; bật", "Put your coat on."],
        ["hang out (with)", "đi chơi, tụ tập", "I hang out with friends at weekends."],
        ["tidy up", "dọn gọn", "Tidy up your room."],
        ["wash up", "rửa bát", "I'll wash up after dinner."],
        ["turn on", "bật", "Turn on the light."],
        ["turn off", "tắt", "Turn the tap off."],
        ["turn up", "vặn to; xuất hiện", "Only five people turned up."],
        ["turn down", "vặn nhỏ; từ chối", "She turned down the job offer."],
        ["pick up", "đón; nhặt; học lỏm", "I picked up some Korean from films."],
        ["drop off", "thả xuống (xe)", "Dad drops me off at school."],
        ["run into", "tình cờ gặp", "I ran into an old classmate."],
        ["eat out", "ăn ngoài", "We eat out once a week."],
        ["stay in", "ở nhà (không ra ngoài)", "I stayed in and watched a film."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 6 — Tiền bạc & mua sắm (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["save up (for)", "để dành tiền", "I'm saving up for a laptop."],
        ["pay back", "trả lại (tiền vay)", "I'll pay you back on Friday."],
        ["pay off", "trả hết nợ; có kết quả tốt", "The hard work paid off."],
        ["cut down on", "giảm bớt (lượng dùng)", "Cut down on sugar."],
        ["cut back on", "cắt giảm (chi tiêu)", "Firms cut back on training."],
        ["give up", "từ bỏ", "He gave up smoking."],
        ["shop around", "so giá nhiều nơi", "Shop around before you buy."],
        ["sell out", "bán hết", "The tickets sold out in an hour."],
        ["splash out (on)", "vung tiền", "We splashed out on a holiday."],
        ["run up", "chồng chất (nợ, hoá đơn)", "He ran up huge debts."],
        ["get by", "xoay xở đủ sống", "Students get by on very little."],
        ["put aside", "để riêng ra", "Put aside 10% of your salary."],
        ["take out", "vay / mua (bảo hiểm)", "She took out a student loan."],
        ["rip off", "chặt chém", "Tourists often get ripped off."],
        ["queue up", "xếp hàng", "People queued up for hours."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 7 — Du lịch & di chuyển (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["set off", "khởi hành", "We set off at dawn."],
        ["check in", "làm thủ tục nhận phòng / lên máy bay", "Check in two hours early."],
        ["check out", "trả phòng", "We checked out at noon."],
        ["take off", "cất cánh; cởi ra", "The plane took off late."],
        ["get on", "lên (xe buýt, tàu, máy bay)", "Get on the number 9 bus."],
        ["get off", "xuống (xe buýt, tàu)", "Get off at the next stop."],
        ["get away", "đi nghỉ, thoát đi", "I need to get away for a few days."],
        ["see off", "tiễn", "My parents saw me off at the airport."],
        ["hold up", "làm chậm trễ", "We were held up by traffic."],
        ["break down", "hỏng (xe, máy); suy sụp", "The bus broke down on the way."],
        ["slow down", "chậm lại", "Slow down near schools."],
        ["speed up", "tăng tốc", "The new road will speed up journeys."],
        ["look around", "đi xem quanh", "We looked around the old town."],
        ["head for", "đi về hướng", "We headed for the beach."],
        ["stop over", "dừng chân quá cảnh", "We stopped over in Singapore."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 8 — Sức khoẻ & cảm xúc (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["work out", "tập thể dục; tính ra", "I work out three times a week."],
        ["warm up", "khởi động", "Warm up before you run."],
        ["cool down", "thả lỏng sau tập; nguội đi", "Stretch to cool down."],
        ["pass out", "ngất", "He passed out in the heat."],
        ["come down with", "mắc (bệnh nhẹ)", "I came down with flu."],
        ["get over", "vượt qua, khỏi", "It took weeks to get over the cold."],
        ["cheer up", "vui lên; làm ai vui", "A walk always cheers me up."],
        ["calm down", "bình tĩnh lại", "Calm down and breathe."],
        ["wear out", "làm kiệt sức; mòn", "The children wore me out."],
        ["cut out", "bỏ hẳn (món ăn)", "I've cut out fizzy drinks."],
        ["look forward to", "mong chờ (+ V-ing)", "I look forward to hearing from you."],
        ["bottle up", "kìm nén (cảm xúc)", "Don't bottle up your feelings."],
        ["wind down", "thư giãn dần", "I read to wind down before bed."],
        ["take up", "bắt đầu (môn thể thao, thói quen)", "She took up yoga last year."],
        ["put up with", "chịu đựng", "I can't put up with the noise."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 9 — Vấn đề, nguyên nhân, thay đổi (dùng được trong Task 2) (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["bring about", "gây ra (thay đổi)", "The internet brought about huge changes."],
        ["lead to", "dẫn tới", "Stress can lead to illness."],
        ["result in", "gây ra kết quả là", "The delay resulted in extra costs."],
        ["stem from", "bắt nguồn từ", "The problem stems from poor planning."],
        ["come up with", "nghĩ ra (ý, giải pháp)", "We came up with a cheaper plan."],
        ["sort out", "giải quyết ổn thoả", "The issue was sorted out quickly."],
        ["carry on", "tiếp tục", "If this trend carries on, rents will double."],
        ["go up", "tăng", "Prices went up by 5%."],
        ["go down", "giảm", "Crime has gone down."],
        ["die out", "tuyệt chủng, mai một", "Many local traditions are dying out."],
        ["wipe out", "xoá sổ", "The disease wiped out the crop."],
        ["use up", "dùng cạn", "We are using up natural resources."],
        ["phase out", "loại bỏ dần", "Plastic bags are being phased out."],
        ["crack down on", "mạnh tay trấn áp", "Police cracked down on speeding."],
        ["do away with", "bãi bỏ", "Some schools did away with uniforms."],
      ],
    },
    {
      t: "table",
      caption: "Nhóm 10 — Suy nghĩ, quyết định, quan điểm (hợp Part 3 và phỏng vấn) (15)",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["think over", "nghĩ kỹ", "I need time to think it over."],
        ["weigh up", "cân nhắc", "Weigh up the pros and cons."],
        ["back up", "ủng hộ; chứng minh bằng", "Back up your opinion with examples."],
        ["stand for", "viết tắt cho; đại diện cho", "What does AI stand for?"],
        ["stand up for", "bênh vực", "Stand up for your rights."],
        ["go for", "chọn", "I'd go for the cheaper option."],
        ["go along with", "thuận theo", "I went along with the plan."],
        ["turn out", "hoá ra", "It turned out to be a mistake."],
        ["end up", "rốt cuộc thì (+ V-ing)", "We ended up staying at home."],
        ["rule out", "loại trừ", "We can't rule out a price rise."],
        ["opt for", "chọn (trang trọng hơn go for)", "Most students opt for online classes."],
        ["count on", "trông cậy vào", "You can count on me."],
        ["stick to", "bám theo, giữ đúng", "Stick to the plan."],
        ["give in", "nhượng bộ", "The parents finally gave in."],
        ["live up to", "xứng với (kỳ vọng)", "The film didn't live up to my expectations."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Bốn lỗi hay sai với cụm động từ",
      items: [
        "**Đại từ đặt sai chỗ:** ~~I looked up it.~~ → I looked **it** up. ~~Turn off them.~~ → Turn **them** off. (cụm tách được + it / them → luôn ở giữa)",
        "**Tách cụm không tách được:** ~~look the baby after~~ → look after the baby. ~~put the noise up with~~ → put up with the noise.",
        "**Sau giới từ là V-ing:** look forward **to meeting** you (to ở đây là giới từ — không phải ~~to meet~~). Một số cụm khác cũng đi với V-ing: end up **paying** · give up **smoking** · put off **doing**. (Không phải cụm nào cũng thế: turn out **to be**, set out **to do**.)",
        "**Dùng cụm quá thân mật trong Task 2:** ~~kids hang out~~ → young people **spend time together**; ~~rip off~~ → **overcharge**. Dùng được trong văn viết: lead to, result in, stem from, bring about, carry out, deal with, cope with, phase out, rely on, set up.",
      ],
    },
    {
      t: "table",
      caption: "Cụm động từ ↔ động từ trang trọng (đổi khi viết Task 2)",
      head: ["Khi nói", "Khi viết", "Khi nói", "Khi viết"],
      rows: [
        ["find out", "discover", "go up / go down", "increase / decrease"],
        ["put off", "postpone", "set up", "establish"],
        ["come up with", "propose / devise", "cut down on", "reduce"],
        ["look into", "investigate", "do away with", "abolish"],
        ["put up with", "tolerate", "bring up (children)", "raise"],
        ["give up", "abandon / quit", "sort out", "resolve"],
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Hai mươi cụm đáng thuộc nhất — có trong thẻ nhớ" },
    {
      t: "vocab",
      items: [
        { w: "fall out with", pos: "phr v", ipa: "/fɔːl ˈaʊt wɪð/", vi: "cãi nhau, giận nhau với", ex: "I fell out with my best friend over a silly comment online.", exVi: "Tôi giận nhau với bạn thân vì một bình luận ngớ ngẩn trên mạng.", more: "fall – fell – fallen. **fall out with sb over / about sth**. Không tách." },
        { w: "make up (with)", pos: "phr v", ipa: "/meɪk ˈʌp/", vi: "làm lành (với)", ex: "We didn't speak for a month, but we made up at New Year.", exVi: "Bọn tôi không nói chuyện một tháng, nhưng làm lành dịp năm mới.", more: "Nghĩa khác: **make up a story** (bịa) · **make up 30% of** (chiếm — Task 1)." },
        { w: "drift apart", pos: "phr v", ipa: "/drɪft əˈpɑːt/", vi: "dần xa cách", ex: "After graduation, most classmates gradually drift apart.", exVi: "Sau tốt nghiệp, đa số bạn học dần xa nhau.", more: "Không có tân ngữ. Hay đi với **gradually / slowly**." },
        { w: "let down", pos: "phr v", ipa: "/let ˈdaʊn/", vi: "làm thất vọng", ex: "I felt I had let my parents down when I failed the exam.", exVi: "Tôi thấy mình làm bố mẹ thất vọng khi thi trượt.", more: "Tách được: let **sb** down. let – let – let." },
        { w: "stand by", pos: "phr v", ipa: "/stænd ˈbaɪ/", vi: "ở bên, ủng hộ (lúc khó khăn)", ex: "True friends stand by you when things go wrong.", exVi: "Bạn thật sự ở bên bạn khi mọi chuyện tồi tệ.", more: "stand – stood – stood. Không tách." },
        { w: "look down on", pos: "phr v", ipa: "/lʊk ˈdaʊn ɒn/", vi: "coi thường", ex: "Some people look down on those who did not go to university.", exVi: "Một số người coi thường những ai không học đại học.", more: "↔ **look up to** (kính trọng). Cụm 3 chữ → không tách." },
        { w: "open up (to)", pos: "phr v", ipa: "/ˌəʊpən ˈʌp/", vi: "mở lòng, tâm sự (với)", ex: "Teenagers find it easier to open up to friends than to parents.", exVi: "Thanh thiếu niên thấy dễ mở lòng với bạn bè hơn với cha mẹ.", more: "**open up about** one's feelings." },
        { w: "turn to", pos: "phr v", ipa: "/ˈtɜːn tuː/", vi: "tìm đến (ai / cái gì) để được giúp", ex: "Lonely people sometimes turn to social media for comfort.", exVi: "Người cô đơn đôi khi tìm đến mạng xã hội để được an ủi.", more: "**turn to sb for** advice / help / support." },
        { w: "come across", pos: "phr v", ipa: "/kʌm əˈkrɒs/", vi: "tình cờ thấy; tạo ấn tượng là", ex: "In interviews, she comes across as confident but not arrogant.", exVi: "Trong phỏng vấn, cô ấy tạo ấn tượng tự tin nhưng không kiêu.", more: "**come across as** + adj — rất hợp tả người. Nghĩa 1: I came across an article about…" },
        { w: "get across", pos: "phr v", ipa: "/ɡet əˈkrɒs/", vi: "truyền đạt được", ex: "A good teacher can get difficult ideas across simply.", exVi: "Giáo viên giỏi truyền đạt được ý khó một cách đơn giản.", more: "get **a message / a point / an idea** across (to sb). Tách được." },
        { w: "speak out (against)", pos: "phr v", ipa: "/spiːk ˈaʊt/", vi: "công khai lên tiếng (phản đối)", ex: "More celebrities are speaking out against online abuse.", exVi: "Ngày càng nhiều người nổi tiếng lên tiếng phản đối lăng mạ trên mạng.", more: "Khác **speak up** (nói to hơn / dám nêu ý trong nhóm)." },
        { w: "put up with", pos: "phr v", ipa: "/pʊt ˈʌp wɪð/", vi: "chịu đựng", ex: "Nobody should have to put up with bullying at work.", exVi: "Không ai đáng phải chịu đựng sự bắt nạt ở chỗ làm.", more: "Trang trọng: tolerate. put – put – put." },
        { w: "bottle up", pos: "phr v", ipa: "/ˌbɒtl ˈʌp/", vi: "kìm nén (cảm xúc)", ex: "Bottling up anger usually makes the problem worse.", exVi: "Kìm nén cơn giận thường làm vấn đề tệ hơn.", more: "bottle **it** up. Hình ảnh: nhét cảm xúc vào chai rồi đóng nút." },
        { w: "bring about", pos: "phr v", ipa: "/brɪŋ əˈbaʊt/", vi: "đem lại, gây ra (thay đổi)", ex: "Smartphones have brought about a major change in the way families communicate.", exVi: "Điện thoại thông minh đã đem lại thay đổi lớn trong cách gia đình giao tiếp.", more: "bring – brought – brought. Tân ngữ thường là **a change / an improvement**. Dùng được trong Task 2." },
        { w: "stem from", pos: "phr v", ipa: "/ˈstem frɒm/", vi: "bắt nguồn từ", ex: "Many arguments between couples stem from a lack of communication.", exVi: "Nhiều cuộc cãi vã giữa các cặp đôi bắt nguồn từ thiếu giao tiếp.", more: "Câu nguyên nhân cho bài problem / solution (bài 2). Không dùng ở thì tiếp diễn." },
        { w: "come up with", pos: "phr v", ipa: "/kʌm ˈʌp wɪð/", vi: "nghĩ ra (ý tưởng, giải pháp)", ex: "Our team came up with a simple solution to the problem.", exVi: "Nhóm tôi nghĩ ra một giải pháp đơn giản cho vấn đề.", more: "come – came – come. **come up with an idea / a plan / an excuse**. Câu vàng cho phỏng vấn." },
        { w: "crack down on", pos: "phr v", ipa: "/kræk ˈdaʊn ɒn/", vi: "mạnh tay xử lý", ex: "Platforms should crack down on fake accounts.", exVi: "Các nền tảng nên mạnh tay xử lý tài khoản giả.", more: "Danh từ: **a crackdown on**. Trang trọng hơn: take strict measures against." },
        { w: "phase out", pos: "phr v", ipa: "/feɪz ˈaʊt/", vi: "loại bỏ dần theo giai đoạn", ex: "The city plans to phase out petrol buses by 2030.", exVi: "Thành phố dự định loại bỏ dần xe buýt chạy xăng trước năm 2030.", more: "↔ **phase in** (đưa vào dần). Dùng được trong văn viết. phase: AWL sublist 4." },
        { w: "rule out", pos: "phr v", ipa: "/ruːl ˈaʊt/", vi: "loại trừ (khả năng)", ex: "The minister did not rule out a ban on phones in schools.", exVi: "Bộ trưởng không loại trừ khả năng cấm điện thoại ở trường.", more: "**rule out the possibility of / that…**" },
        { w: "live up to", pos: "phr v", ipa: "/lɪv ˈʌp tuː/", vi: "xứng với, đạt được như (kỳ vọng)", ex: "Young people feel pressure to live up to the perfect images they see online.", exVi: "Người trẻ thấy áp lực phải được như những hình ảnh hoàn hảo họ thấy trên mạng.", more: "**live up to expectations / one's reputation**." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Họ từ — đổi loại từ để paraphrase" },
    {
      t: "table",
      caption: "12 họ từ của bài",
      head: ["Danh từ", "Động từ", "Tính từ", "Ghi nhớ"],
      rows: [
        ["addiction", "—", "addictive (vật) · addicted (người)", "addicted **to**"],
        ["interaction", "interact", "interactive", "interact **with**"],
        ["isolation", "isolate", "isolated", "feel isolated **from**"],
        ["reliability", "rely", "reliable", "rely **on**"],
        ["ambition", "—", "ambitious", "an ambition **to V**"],
        ["resilience", "—", "resilient", "show resilience"],
        ["arrogance", "—", "arrogant", "—"],
        ["anonymity", "—", "anonymous", "trạng từ: anonymously"],
        ["consideration", "consider", "considerate · considerable", "hai tính từ, hai nghĩa"],
        ["trust", "trust", "trustworthy", "trust sb **with** sth"],
        ["loyalty", "—", "loyal", "loyal **to**"],
        ["compromise", "compromise", "—", "compromise **on**"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Sáu câu khung cho Task 2 và Part 3" },
    {
      t: "patterns",
      rows: [
        {
          formula: "N (vấn đề) + stems from + N / the fact that + S + V",
          vi: "Nêu nguyên nhân (thân bài 1 của problem / solution).",
          examples: [{ en: "This problem stems from the fact that apps are designed to be addictive.", vi: "Vấn đề này bắt nguồn từ việc các ứng dụng được thiết kế để gây nghiện." }],
        },
        {
          formula: "S + has / have a negative impact on + N , which + V(s/es) …",
          vi: "Nêu tác động + hệ quả tầng hai (dùng “, which” của Ngày 17).",
          examples: [{ en: "Excessive screen time has a negative impact on sleep, which affects students' results.", vi: "Dùng màn hình quá nhiều tác động xấu tới giấc ngủ, điều này ảnh hưởng tới kết quả học của học sinh." }],
        },
        {
          formula: "People + V-ing … are more likely to + V",
          vi: "Gọi tên nhóm người bằng V-ing rút gọn + nói xu hướng.",
          examples: [{ en: "People spending more than four hours a day online are more likely to feel isolated.", vi: "Người dành hơn bốn tiếng mỗi ngày trên mạng dễ thấy lẻ loi hơn." }],
        },
        {
          formula: "S + comes across as + adj , but in fact + S + V",
          vi: "Tả người: ấn tượng bề ngoài ↔ con người thật (Part 2).",
          examples: [{ en: "My uncle comes across as strict, but in fact he is very considerate.", vi: "Chú tôi tạo cảm giác nghiêm khắc, nhưng thật ra rất chu đáo." }],
        },
        {
          formula: "I'd describe myself as + adj , in the sense that + S + V",
          vi: "Tự tả mình trong phỏng vấn — tính từ + bằng chứng.",
          examples: [{ en: "I'd describe myself as conscientious, in the sense that I always double-check my work.", vi: "Tôi tự nhận mình là người tận tâm, theo nghĩa là tôi luôn kiểm lại việc mình làm." }],
        },
        {
          formula: "It is important to strike a balance between + N + and + N",
          vi: "Câu kết bài / kết câu trả lời Part 3.",
          examples: [{ en: "It is important to strike a balance between online and face-to-face interaction.", vi: "Điều quan trọng là tìm điểm cân bằng giữa giao tiếp trên mạng và trực tiếp." }],
        },
      ],
    },
    {
      t: "rule",
      formula: "tính từ tính cách + in the sense that / because + S + V (việc cụ thể đã làm)",
      vi: "Không bao giờ để tính từ tính cách đứng một mình: luôn kèm một việc làm chứng.",
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện tập" },
    {
      t: "mcq",
      id: "t3d18-tv-chon",
      title: "Chọn từ đúng (10 câu)",
      items: [
        { q: "It was very ______ of you to bring an umbrella — the forecast said rain.", options: ["sensitive", "sensible", "sensational", "senseless"], correct: 1, why: "Quyết định hợp lý, biết suy xét → **sensible**. sensitive = nhạy cảm." },
        { q: "False health claims are a dangerous form of ______.", options: ["misinformation", "notification", "engagement", "anonymity"], correct: 0, why: "Thông tin sai lệch → **misinformation** (không đếm được)." },
        { q: "My neighbour is so ______: she always asks whether her music is too loud.", options: ["considerable", "self-centred", "considerate", "arrogant"], correct: 2, why: "Biết nghĩ cho người khác → **considerate**. considerable = đáng kể." },
        { q: "Many teenagers are ______ to short videos and cannot stop scrolling.", options: ["addictive", "addiction", "addict", "addicted"], correct: 3, why: "Người → **addicted to**. Vật mới là addictive." },
        { q: "The two sides finally reached a ______ after three hours of talks.", options: ["conflict", "compromise", "companionship", "loyalty"], correct: 1, why: "**reach a compromise** = đạt thoả hiệp." },
        { q: "Online, users only see opinions like their own. This is known as an echo ______.", options: ["room", "box", "chamber", "space"], correct: 2, why: "Cụm cố định **echo chamber**." },
        { q: "He never talks about his awards; he is extremely ______.", options: ["modest", "ambitious", "impulsive", "assertive"], correct: 0, why: "Không khoe thành tích → **modest** (khiêm tốn)." },
        { q: "Children who learn to deal with failure become more ______.", options: ["isolated", "anonymous", "narrow-minded", "resilient"], correct: 3, why: "Mau vực dậy sau thất bại → **resilient**." },
        { q: "The campaign aims to ______ awareness of cyberbullying.", options: ["rise", "raise", "grow", "lift"], correct: 1, why: "**raise awareness** — raise là ngoại động từ; rise không có tân ngữ." },
        { q: "A good friend is someone who ______ you when everyone else leaves.", options: ["lets down", "looks down on", "stands by", "falls out with"], correct: 2, why: "**stand by sb** = ở bên, ủng hộ lúc khó khăn. Ba cụm kia nghĩa tiêu cực." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-tv-cum-dong-tu",
      title: "Điền cụm động từ đúng dạng (10 câu)",
      kind: "fill",
      items: [
        { q: "I ______ ______ ______ my best friend last year, and we still don't speak. (cãi nhau, giận nhau)", answers: ["fell out with"], hint: "fall – fell" },
        { q: "After university we slowly ______ ______. (dần xa nhau)", answers: ["drifted apart"], hint: "quá khứ đơn" },
        { q: "The problem ______ ______ a lack of trust between managers and staff. (bắt nguồn từ)", answers: ["stems from"], hint: "hiện tại đơn, chủ ngữ số ít" },
        { q: "Our team ______ ______ ______ a new way to reduce waste. (nghĩ ra — quá khứ)", answers: ["came up with"], hint: "come – came" },
        { q: "I can't ______ ______ ______ his rude comments any longer. (chịu đựng)", answers: ["put up with"], hint: "sau can't → nguyên mẫu" },
        { q: "What does this word mean? — I don't know. Let me look ______ ______. (tra nó)", answers: ["it up"], hint: "đại từ đứng GIỮA" },
        { q: "I'm really looking forward to ______ (start) the new job.", answers: ["starting"], hint: "to ở đây là giới từ → V-ing" },
        { q: "Old petrol cars will be ______ ______ over the next ten years. (loại bỏ dần — bị động)", answers: ["phased out"], hint: "be + V3" },
        { q: "She ______ ______ as shy, but she is actually very funny. (tạo ấn tượng là)", answers: ["comes across"], hint: "hiện tại đơn, ngôi ba" },
        { q: "Don't ______ ______ your feelings — talk to someone. (kìm nén)", answers: ["bottle up"], hint: "câu mệnh lệnh" },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-tv-dang-tu",
      title: "Viết dạng đúng của từ trong ngoặc (8 câu)",
      kind: "fill",
      items: [
        { q: "Phone ______ (ADDICT) is becoming common among primary school children.", answers: ["addiction"], hint: "sau danh từ Phone → danh từ ghép" },
        { q: "Old people living alone often suffer from social ______ (ISOLATE).", answers: ["isolation"], hint: "social + danh từ" },
        { q: "Employers value ______ (RELY) more than talent.", answers: ["reliability"], hint: "tân ngữ của value → danh từ" },
        { q: "Face-to-face ______ (INTERACT) teaches children to read body language.", answers: ["interaction"], hint: "danh từ" },
        { q: "The comments were posted ______ (ANONYMOUS).", answers: ["anonymously"], hint: "bổ nghĩa cho động từ → trạng từ" },
        { q: "Her ______ (AMBITIOUS) is to become a surgeon.", answers: ["ambition"], hint: "sau Her → danh từ" },
        { q: "Sport helps young people develop ______ (RESILIENT).", answers: ["resilience"], hint: "danh từ" },
        { q: "He is a ______ (TRUST) colleague who never shares private information.", answers: ["trustworthy"], hint: "trước danh từ → tính từ" },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-tv-dich",
      title: "Dịch sang tiếng Anh — dùng cụm của mục 4, 6, 8 và ba cụm ôn từ Ngày 14 (5 câu)",
      kind: "translate",
      grammar: "have a negative impact on · stem from · come across as · strike a balance between · raise awareness of",
      items: [
        { q: "Dùng màn hình quá nhiều có tác động xấu tới giấc ngủ của trẻ em.", answers: ["Excessive screen time has a negative impact on children's sleep.", "Too much screen time has a negative impact on children's sleep.", "Excessive screen time has a negative impact on the sleep of children."], hint: "Excessive screen time · has a negative impact on" },
        { q: "Nhiều hiểu lầm bắt nguồn từ việc thiếu giao tiếp trực tiếp.", answers: ["Many misunderstandings stem from a lack of face-to-face interaction.", "Many misunderstandings stem from a lack of face-to-face communication.", "Many misunderstandings stem from the lack of face-to-face interaction.", "Many misunderstandings stem from the lack of face-to-face communication."], hint: "stem from · a lack of · face-to-face interaction" },
        { q: "Quản lý mới của tôi tạo ấn tượng kiêu ngạo, nhưng thật ra cô ấy rất chu đáo.", answers: ["My new manager comes across as arrogant, but in fact she is very considerate.", "My new manager comes across as arrogant, but she is actually very considerate.", "My new manager comes across as arrogant, but actually she is very considerate.", "My new manager comes across as arrogant, but in fact she is really considerate."], hint: "comes across as arrogant · but in fact · considerate" },
        { q: "Trường học nên nâng cao nhận thức về bắt nạt trên mạng.", answers: ["Schools should raise awareness of cyberbullying.", "Schools should raise awareness about cyberbullying.", "Schools should raise awareness of online bullying."], hint: "raise awareness of · cyberbullying" },
        { q: "Người trẻ cần tìm điểm cân bằng giữa đời sống trên mạng và các mối quan hệ thật.", answers: ["Young people need to strike a balance between online life and real relationships.", "Young people need to strike a balance between their online life and real relationships.", "Young people need to strike a balance between their online lives and real relationships.", "Young people need to strike a balance between online life and real-life relationships.", "Young people need to strike a balance between their online life and their real relationships."], hint: "strike a balance between … and …" },
      ],
    },
  ],
};
/* ─────────────────────────── Bài 2 · Viết ─────────────────────────── */

const T3D18_WRITING: Lesson = {
  id: "t3d18-viet",
  kind: "writing",
  title: "Viết: Problem / solution band 6 — giải pháp gắn đúng nguyên nhân",
  goal: "Viết trọn một bài Task 2 dạng nguyên nhân / vấn đề – giải pháp ≥ 250 từ ở mức band 6: mở bài nhượng bộ, mỗi nguyên nhân có chuỗi hệ quả hai tầng, mỗi giải pháp nói rõ AI làm – LÀM GÌ – VÌ SAO có tác dụng và khớp đúng với nguyên nhân đã nêu.",
  minutes: 100,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 14 bạn đã viết được bài problem / solution theo khung 4 đoạn với **should** và **One solution would be to…**. Hôm nay nâng lên **band 6**: bài không chỉ “có giải pháp” mà giải pháp phải **trả lời đúng nguyên nhân** bạn vừa viết.",
        "Ba kỹ thuật mới: ① **mở bài nhượng bộ** (While X has…, it has also…), ② **chuỗi hệ quả hai tầng** (This leads to…, which in turn…), ③ **giải pháp ba phần**: ai làm → làm gì → vì sao hiệu quả.",
        "Dùng lại ngữ pháp của chặng: **“, which”** và **V-ing rút gọn** (Ngày 17), **điều kiện loại 2** cho giải pháp giả định (Ngày 15), **bị động** (Ngày 13); từ vựng bài 1 hôm nay (stem from, peer pressure, addictive, set a good example).",
        "Có **hai bài mẫu cùng một đề** — band 5 và band 6 — đặt cạnh nhau, kèm bảng chỉ chỗ khác theo TR · CC · LR · GRA.",
        "Đẩy band: **TR band 6** (“trả lời đủ mọi phần của đề, ý chính rõ và liên quan”) và **CC band 6** (“có tiến triển rõ”): giải pháp lạc khỏi nguyên nhân là lý do số một giữ bài ở band 5.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Band 5 và band 6 khác nhau ở đâu? (Problem / solution)" },
    {
      t: "table",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**TR** — trả lời đề", "Có nguyên nhân, có giải pháp nhưng **liệt kê** 4–5 ý, mỗi ý một câu; giải pháp chung chung (“the government should do something”) và **không dính** tới nguyên nhân đã nêu", "**2 nguyên nhân + 2 giải pháp**, mỗi cái được giải thích; giải pháp ① xử lý nguyên nhân ①, giải pháp ② xử lý nguyên nhân ②"],
        ["**CC** — mạch lạc", "Firstly / Moreover / Furthermore / In addition đầu mọi câu; ý không nối với nhau", "Có **chuỗi**: nguyên nhân → hệ quả → hệ quả tiếp; dùng this / these / such để nối, từ nối đầu câu ít hơn"],
        ["**LR** — từ vựng", "bad, good, many, problem lặp lại; ít collocation", "Từ đúng chủ đề (addictive design, peer pressure, face-to-face interaction); có lỗi nhỏ nhưng không cản hiểu"],
        ["**GRA** — ngữ pháp", "Câu đơn + so / because; comma splice; lỗi số nhiều, mạo từ", "Trộn câu đơn với câu phức: mệnh đề quan hệ, **“, which”**, điều kiện loại 2, bị động; lỗi hiếm khi làm sai nghĩa"],
      ],
    },
    {
      t: "note",
      title: "Một câu để nhớ",
      items: [
        "Giám khảo đọc thân bài 2 và tự hỏi: “**Giải pháp này chữa cái gì?**” Nếu câu trả lời không nằm ở thân bài 1 → bài chưa “address all parts of the task” một cách liên quan → TR dừng ở 5.",
        "Vì thế hôm nay ta lập dàn ý theo **cặp**: mỗi nguyên nhân đi cùng giải pháp của nó ngay từ lúc nghĩ ý.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Đọc đề: bốn kiểu câu hỏi và đếm vế (nối Tập 2 Ngày 14)" },
    {
      t: "table",
      caption: "Đọc CÂU HỎI CUỐI để biết phải viết gì",
      head: ["Câu hỏi cuối đề", "Thân bài 1", "Thân bài 2"],
      rows: [
        ["What **problems** does this cause? What **solutions** can you suggest?", "2 vấn đề (hậu quả)", "2 giải pháp — mỗi cái cho một **vấn đề**"],
        ["What are the **causes**? What **measures** could be taken?", "2 nguyên nhân", "2 giải pháp — mỗi cái cho một **nguyên nhân**"],
        ["Why is this happening? What are the **effects** on…?", "2 nguyên nhân", "2 hậu quả (không viết giải pháp!)"],
        ["What are the causes **and effects**, and how can it be **solved**?", "nguyên nhân + hậu quả (gộp)", "giải pháp"],
      ],
    },
    {
      t: "p",
      text: "Ngoài câu hỏi cuối, **câu mô tả tình huống** của đề cũng có vế. Đề hôm nay: “Many young people today spend several hours a day on social media, and some experts believe this is damaging **their mental health** and **their relationships with others**.” → vấn đề có **hai mặt** (sức khoẻ tinh thần + quan hệ). Bài band 6 phải chạm **cả hai** ít nhất một lần.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Đọc đề problem / solution trong 60 giây",
      steps: [
        { label: "① Gạch chân chủ đề + đối tượng", sub: "social media · young people" },
        { label: "② Đếm vế của vấn đề", sub: "mental health + relationships" },
        { label: "③ Đọc câu hỏi cuối", sub: "causes? problems? effects? solutions?" },
        { label: "④ Ghi khung 2 + 2", sub: "nguyên nhân 1 → giải pháp 1 · nguyên nhân 2 → giải pháp 2" },
      ],
    },
    {
      t: "mcq",
      id: "t3d18-viet-doc-de",
      title: "Đọc đề (5 đề tự soạn): thân bài phải viết gì?",
      items: [
        { q: "“In many countries, the number of people who are overweight is rising. What are the reasons for this? What can be done to solve the problem?”", options: ["TB1: hậu quả · TB2: giải pháp", "TB1: nguyên nhân · TB2: giải pháp", "TB1: nguyên nhân · TB2: hậu quả", "TB1: ưu điểm · TB2: nhược điểm"], correct: 1, why: "“reasons” = nguyên nhân; “What can be done” = giải pháp." },
        { q: "“More and more families now eat ready-made meals instead of cooking. Why is this the case? What effects does it have on family life and health?”", options: ["TB1: nguyên nhân · TB2: giải pháp", "TB1: vấn đề · TB2: giải pháp", "TB1: nguyên nhân · TB2: hậu quả", "TB1: đồng ý · TB2: phản đối"], correct: 2, why: "Why = nguyên nhân; effects = hậu quả. Đề **không hỏi giải pháp** — viết giải pháp là lạc đề. Hậu quả có hai vế: family life + health." },
        { q: "“Traffic congestion is getting worse in most big cities. What problems does this cause, and what measures could governments take?”", options: ["TB1: vấn đề (hậu quả) · TB2: giải pháp của chính phủ", "TB1: nguyên nhân · TB2: giải pháp của cá nhân", "TB1: nguyên nhân · TB2: hậu quả", "TB1: vấn đề · TB2: nguyên nhân"], correct: 0, why: "problems = hậu quả do kẹt xe gây ra; measures **governments** could take — đề chỉ định người làm, đừng viết “individuals should…”." },
        { q: "Đề nào có vấn đề gồm HAI vế phải chạm cả hai?", options: ["“Many languages are dying out. Why? What can be done?”", "“Young people are leaving rural areas. What problems does this cause?”", "“Fewer people read books today. What are the causes?”", "“Online shopping is harming small shops and creating more packaging waste. What can be done?”"], correct: 3, why: "“harming small shops **and** creating more packaging waste” — hai vế nối bằng and → giải pháp phải nói tới cả hai." },
        { q: "Đề hỏi “What are the causes? What measures could be taken?” Dàn ý nào đạt mức band 6?", options: ["3 nguyên nhân + 1 giải pháp chung", "1 nguyên nhân + 4 giải pháp", "2 nguyên nhân, mỗi nguyên nhân có 1 giải pháp tương ứng", "2 nguyên nhân + 2 lợi ích"], correct: 2, why: "Cân đối và **khớp cặp**: nguyên nhân ① ↔ giải pháp ①, nguyên nhân ② ↔ giải pháp ②." },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Giải pháp gắn đúng nguyên nhân" },
    {
      t: "p",
      text: "Đây là lõi của bài hôm nay. Hãy thử: nguyên nhân là “ứng dụng được thiết kế để gây nghiện”, giải pháp là “thanh niên nên chơi thể thao nhiều hơn”. Chơi thể thao tốt thật — nhưng nó **không đụng gì** tới thiết kế gây nghiện. Người đọc thấy hai đoạn thân bài như hai bài khác nhau.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng hai nguyên nhân — giải pháp lệch và giải pháp khớp",
      cols: [
        {
          title: "Nguyên nhân",
          items: ["① Ứng dụng thiết kế gây nghiện (cuộn vô tận, thông báo đêm)", "② Áp lực bạn bè: mọi sinh hoạt lớp nằm trong nhóm chat"],
        },
        {
          title: "❌ Giải pháp LỆCH (band 5)",
          items: ["Cấm mạng xã hội với người dưới 18 — quá cực đoan, không khả thi", "Giao thêm bài tập về nhà — không liên quan tới ① lẫn ②", "Chơi thể thao — tốt nhưng không chữa nguyên nhân nào"],
        },
        {
          title: "✅ Giải pháp KHỚP (band 6)",
          items: ["→ ① Luật buộc công ty **tắt cuộn vô tận / thông báo đêm** cho người dưới 18", "→ ② Trường lập **câu lạc bộ không điện thoại** → có nơi thuộc về mà không cần màn hình"],
        },
      ],
    },
    {
      t: "table",
      caption: "Giải pháp ba phần: AI làm → LÀM GÌ → VÌ SAO có tác dụng",
      head: ["Phần", "Câu hỏi tự kiểm", "Ví dụ"],
      rows: [
        ["**Ai**", "Chủ thể cụ thể? (governments · schools · parents · companies · individuals)", "**Governments** could…"],
        ["**Làm gì**", "Hành động cụ thể, làm được? (không phải “do something”, “solve this”)", "…**require companies to switch off endless scrolling** for users under eighteen."],
        ["**Vì sao**", "Nó xử lý nguyên nhân bằng cách nào? → câu điều kiện / This would…", "**If apps simply stopped after thirty minutes, most teenagers would find it easier** to put their phones down."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Ba kiểu giải pháp làm mất điểm TR",
      items: [
        "**Giải pháp chung chung:** “The government should **solve** this problem.” / “People should **be aware**.” → không nói làm gì.",
        "**Giải pháp cực đoan:** ban, close, punish all… → khó bảo vệ. Đổi sang **limit, restrict, require, encourage**.",
        "**Giải pháp lạc:** đúng chủ đề nhưng không chữa nguyên nhân đã nêu. Thử nghiệm một dòng: “**This would help because** (nguyên nhân ①) **would…**” — không viết tiếp được thì giải pháp đang lạc.",
      ],
    },
    {
      t: "rule",
      formula: "To address + nguyên nhân ① , AI + could / should + V (làm gì) . If + S + V2 , S + would + V (vì sao có tác dụng)",
      vi: "Mỗi giải pháp mở bằng việc GỌI LẠI nguyên nhân nó xử lý, rồi nói ai làm gì và vì sao hiệu quả.",
    },
    {
      t: "mcq",
      id: "t3d18-viet-khop",
      title: "Giải pháp nào KHỚP với nguyên nhân? (4 câu)",
      items: [
        { q: "Nguyên nhân: People throw away food because they buy more than they need at supermarkets.", options: ["Governments should build more recycling plants.", "Schools should teach children to cook.", "Supermarkets could stop “buy one, get one free” offers on fresh food.", "People should eat more vegetables."], correct: 2, why: "Nguyên nhân là **mua thừa** → giải pháp phải làm người ta mua ít lại: bỏ khuyến mãi mua 1 tặng 1 với đồ tươi." },
        { q: "Nguyên nhân: Young people leave villages because there are no well-paid jobs there.", options: ["Governments could offer tax breaks to companies that open offices in rural areas.", "Cities should build more parks.", "Villagers should use social media less.", "Universities should lower their fees."], correct: 0, why: "Thiếu việc lương tốt ở nông thôn → kéo doanh nghiệp về bằng ưu đãi thuế." },
        { q: "Nguyên nhân: Children do less exercise because parents think the streets are unsafe.", options: ["Children should watch less television.", "Councils could create car-free streets and supervised play areas near homes.", "Schools should sell healthier lunches.", "Doctors should give more advice."], correct: 1, why: "Nguyên nhân là **cảm giác không an toàn** → tạo không gian chơi an toàn, có giám sát." },
        { q: "Nguyên nhân: Many employees are stressed because they answer work emails late at night.", options: ["Employees should take up yoga.", "Governments should raise the minimum wage.", "Workers should change jobs.", "Companies could introduce a rule that no emails are sent after 7 p.m."], correct: 3, why: "Nguyên nhân là **email ngoài giờ** → quy định không gửi email sau 7 giờ tối. Yoga chỉ chữa triệu chứng." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Mở bài nhượng bộ: công nhận mặt tốt rồi mới nêu vấn đề" },
    {
      t: "p",
      text: "Mở bài band 5 thường là “Nowadays, X is a big problem. This essay will discuss the causes and solutions.” Mở bài band 6 làm hai việc trong **một câu phức**: **nhượng bộ** (X cũng có mặt tốt / là điều khó tránh) rồi **paraphrase vấn đề của đề**. Câu thứ hai nói bài sẽ làm gì. Nhượng bộ cho thấy bạn nhìn vấn đề **công bằng** — và tự nhiên có ngay một câu phức đúng.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "While + S + V (mặt tốt) , S + V (vấn đề) , which + V(s/es) …",
          vi: "Khung chính: While = “mặc dù / trong khi”.",
          examples: [
            { en: "While social media has made it easier than ever for young people to stay in touch, many of them now spend several hours a day online, which is harming both their mental health and their relationships.", vi: "Mặc dù mạng xã hội giúp người trẻ giữ liên lạc dễ hơn bao giờ hết, nhiều người trong số họ nay dành vài giờ mỗi ngày trên mạng, điều này đang gây hại cho cả sức khoẻ tinh thần lẫn các mối quan hệ." },
          ],
        },
        {
          formula: "Although + S + V , S + V (vấn đề)",
          vi: "Although dùng y như While trong nghĩa này.",
          examples: [
            { en: "Although cars have given people great freedom, the growing number of vehicles is causing serious congestion in most cities.", vi: "Dù ô tô đem lại cho con người sự tự do lớn, số xe ngày càng tăng đang gây tắc nghẽn nghiêm trọng ở đa số thành phố." },
          ],
        },
        {
          formula: "Despite + N / V-ing , S + V (vấn đề)",
          vi: "Despite + cụm danh từ (không + mệnh đề).",
          examples: [
            { en: "Despite the obvious benefits of living alone, a growing number of single people report feeling lonely.", vi: "Bất chấp những lợi ích rõ ràng của việc sống một mình, ngày càng nhiều người độc thân nói rằng họ thấy cô đơn." },
          ],
        },
        {
          formula: "This essay will examine + (two main causes of this problem) + and suggest + (a measure to deal with each of them)",
          vi: "Câu 2 của mở bài — báo đúng những gì đề hỏi, báo luôn cấu trúc “khớp cặp”.",
          examples: [
            { en: "This essay will examine two main causes of this problem and suggest a measure to deal with each of them.", vi: "Bài luận này sẽ xem xét hai nguyên nhân chính của vấn đề và đề xuất một biện pháp cho từng nguyên nhân." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai ở mở bài nhượng bộ",
      items: [
        "**Although … but:** ~~Although social media is useful, **but** it causes problems.~~ → bỏ **but**. Tiếng Việt “mặc dù… nhưng” — tiếng Anh chỉ dùng một trong hai.",
        "**Despite + mệnh đề:** ~~Despite social media is useful~~ → Despite **the usefulness of** social media / **Although** social media is useful.",
        "**Nhượng bộ quá dài**, lấn át vấn đề: phần While chỉ nên 10–15 từ; trọng tâm câu là vế sau.",
        "**Chép nguyên đề:** phải đổi từ — several hours a day → a large part of their day; damaging → harming; relationships with others → the way they relate to other people.",
      ],
    },
    {
      t: "rule",
      formula: "While + S + V (mặt tốt) , S + V (vấn đề của đề, paraphrase) . This essay will examine … and suggest …",
      vi: "Mở bài 2 câu: câu 1 nhượng bộ + nêu vấn đề; câu 2 báo bài sẽ viết gì (đúng các phần đề hỏi).",
    },
    {
      t: "quiz",
      id: "t3d18-viet-mo-bai-dich",
      title: "Dịch sang tiếng Anh — mở bài nhượng bộ (4 câu)",
      kind: "translate",
      grammar: "While / Although + S + V , S + V · Despite + N",
      items: [
        { q: "Mặc dù ô tô giúp việc đi lại dễ hơn, chúng đang gây ô nhiễm không khí nghiêm trọng ở các thành phố lớn.", answers: ["While cars have made travel easier, they are causing serious air pollution in big cities.", "Although cars have made travel easier, they are causing serious air pollution in big cities.", "While cars make travel easier, they are causing serious air pollution in big cities.", "Although cars make travel easier, they are causing serious air pollution in big cities.", "While cars have made travelling easier, they are causing serious air pollution in big cities.", "Although cars have made travelling easier, they are causing serious air pollution in large cities.", "While cars have made travel easier, they are causing serious air pollution in large cities."], hint: "While / Although · have made travel easier · are causing" },
        { q: "Dù đồ ăn nhanh rẻ và tiện, nó đang làm tăng số người thừa cân.", answers: ["Although fast food is cheap and convenient, it is increasing the number of overweight people.", "While fast food is cheap and convenient, it is increasing the number of overweight people.", "Although fast food is cheap and convenient, it is increasing the number of people who are overweight.", "While fast food is cheap and convenient, it is increasing the number of people who are overweight."], hint: "cheap and convenient · is increasing the number of overweight people" },
        { q: "Bất chấp lợi ích của việc làm việc ở nhà, nhiều nhân viên cảm thấy lẻ loi.", answers: ["Despite the benefits of working from home, many employees feel isolated.", "Despite the advantages of working from home, many employees feel isolated.", "Despite the benefits of working from home, many workers feel isolated.", "Despite the benefits of working at home, many employees feel isolated."], hint: "Despite the benefits of + V-ing · feel isolated" },
        { q: "Bài luận này sẽ xem xét hai nguyên nhân chính của vấn đề và đề xuất một biện pháp cho từng nguyên nhân.", answers: ["This essay will examine two main causes of this problem and suggest a measure to deal with each of them.", "This essay will examine two main causes of the problem and suggest a measure to deal with each of them.", "This essay will examine two main causes of this problem and suggest a measure for each of them.", "This essay will examine two main causes of the problem and suggest a measure for each of them.", "This essay will examine two main causes of this problem and suggest a measure to deal with each."], hint: "will examine two main causes · suggest a measure to deal with each of them" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Chuỗi hệ quả hai tầng: nguyên nhân → hệ quả → hệ quả tiếp" },
    {
      t: "p",
      text: "Band 5 nêu nguyên nhân rồi **dừng**: “The apps are very interesting. Young people cannot stop.” Band 6 **đi thêm một – hai bước**: thiết kế gây nghiện → cuộn hai tiếng → ít ngủ và ít gặp người thật. Mỗi bước là một mắt xích; nối chúng bằng ngôn ngữ nguyên nhân – kết quả đã học ở Tập 2 Ngày 14 cộng với “, which” của Ngày 17.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một chuỗi hệ quả mẫu",
      caption: "Mỗi mũi tên là một cụm nối khác nhau — đừng dùng “so” ba lần.",
      steps: [
        { label: "Nguyên nhân", sub: "Apps use algorithms that show an endless stream of content" },
        { label: "As a result,", sub: "teenagers… end up scrolling for two hours" },
        { label: ", which reduces…", sub: "the time left for sleep and face-to-face interaction" },
        { label: "(, which in turn…)", sub: "affects their mood and their friendships" },
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ nối chuỗi — chọn mỗi loại một cái trong một đoạn",
      head: ["Vị trí", "Cụm", "Ví dụ"],
      rows: [
        ["Đầu câu mới", "As a result, · Consequently, · This means that", "**As a result,** teenagers often end up scrolling for two hours."],
        ["Giữa câu (mệnh đề)", ", which leads to / results in / means that", "…for two hours**, which reduces** the time left for sleep."],
        ["Tầng hai", ", which in turn + V(s/es) · This, in turn,", "…compare themselves with others**, which in turn lowers** their self-confidence."],
        ["Động từ nguyên nhân", "lead sb to V · cause sb to V · make it + adj + to V", "This **leads them to check** their phones constantly."],
        ["Danh từ hoá", "The result is + N / that… · One consequence is that…", "**One consequence is that** families rarely talk at dinner."],
        ["Rút gọn V-ing", ", leading to / , resulting in / , causing", "They sleep less**, resulting in** poor concentration at school."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận với chuỗi hệ quả",
      items: [
        "**Dừng ở tầng hai.** Chuỗi 4–5 tầng (“…so they fail exams, so they cannot find jobs, so the economy collapses”) thành **phóng đại** — giám khảo coi là lập luận yếu.",
        "**lead to + N / V-ing**, không phải + V: ~~leads to lose sleep~~ → leads to **a loss of sleep** / leads **them to lose** sleep.",
        "**cause + O + to V**: ~~cause teenagers feel lonely~~ → cause teenagers **to feel** lonely. Nhưng **make + O + V** (không to): make teenagers **feel** lonely.",
        "Chủ ngữ **This** phải rõ nó chỉ cái gì — nếu mơ hồ, viết **This habit / This pressure / This design**.",
      ],
    },
    {
      t: "rule",
      formula: "Nguyên nhân . As a result, + S + V , which (in turn) + V(s/es) + hệ quả cuối",
      vi: "Mỗi nguyên nhân kéo dài đúng hai tầng hệ quả, và hệ quả cuối phải chạm vào vấn đề mà ĐỀ nêu (ở đây: sức khoẻ tinh thần / các mối quan hệ).",
    },
    {
      t: "quiz",
      id: "t3d18-viet-chuoi-dien",
      title: "Điền MỘT từ vào chuỗi hệ quả (6 chỗ trống)",
      kind: "fill",
      items: [
        { q: "Many parents work long hours. As a ______, children spend their evenings alone with a screen.", answers: ["result", "consequence"], hint: "As a … ," },
        { q: "…alone with a screen, ______ means that they have nobody to talk to about their day.", answers: ["which"], hint: "thay cả ý phía trước" },
        { q: "This leads them ______ look for attention online.", answers: ["to"], hint: "lead sb … V" },
        { q: "They post more and more photos, which in ______ makes them depend on other people's “likes”.", answers: ["turn"], hint: "which in … = đến lượt nó" },
        { q: "Heavy phone use causes teenagers ______ sleep less.", answers: ["to"], hint: "cause + O + … V" },
        { q: "Students go to bed late, ______ (result) in poor concentration the next day.", answers: ["resulting"], hint: ", V-ing rút gọn" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Ngôn ngữ giải pháp band 6 — không chỉ should" },
    {
      t: "p",
      text: "Tập 2 Ngày 14 đã cho bạn ba cách thay **should**: **One solution would be to + V**, **It is necessary / important to + V**, bị động **X should be + V3**. Band 6 thêm bốn khuôn dưới đây. Điểm chung: chúng **giữ khoảng cách** (could, would) — giải pháp là đề xuất, chưa xảy ra — và **nói luôn kết quả**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "To address / tackle + N (nguyên nhân) , S + could + V",
          vi: "Gọi lại nguyên nhân rồi nêu giải pháp — khuôn “khớp cặp”.",
          examples: [{ en: "To address addictive design, governments could require companies to switch off endless scrolling for users under eighteen.", vi: "Để xử lý thiết kế gây nghiện, chính phủ có thể yêu cầu các công ty tắt tính năng cuộn vô tận với người dùng dưới mười tám tuổi." }],
        },
        {
          formula: "If + S + V2 , S + would + V   (điều kiện loại 2 — Ngày 15)",
          vi: "Giải thích VÌ SAO giải pháp có tác dụng: giả định nó được áp dụng.",
          examples: [{ en: "If apps simply stopped after thirty minutes, most teenagers would find it far easier to put their phones down.", vi: "Nếu ứng dụng tự dừng sau ba mươi phút, đa số thanh thiếu niên sẽ thấy dễ đặt điện thoại xuống hơn nhiều." }],
        },
        {
          formula: "By + V-ing … , S + can / could + V",
          vi: "“Bằng cách…, ai đó có thể…”.",
          examples: [{ en: "By keeping phones away from the dinner table, parents can show that conversation matters more than a screen.", vi: "Bằng cách không để điện thoại trên bàn ăn, cha mẹ có thể cho thấy trò chuyện quan trọng hơn màn hình." }],
        },
        {
          formula: "S + could + V … , giving / allowing / encouraging + O + (to V)",
          vi: "Giải pháp + kết quả bằng V-ing rút gọn (Ngày 17).",
          examples: [{ en: "Schools could set up phone-free clubs, giving students a sense of belonging that does not depend on a screen.", vi: "Trường học có thể lập các câu lạc bộ không điện thoại, cho học sinh cảm giác thuộc về mà không phụ thuộc vào màn hình." }],
        },
        {
          formula: "N (vấn đề ②) , on the other hand, is better tackled by + N (chủ thể khác)",
          vi: "Chuyển sang giải pháp thứ hai, đổi chủ thể — bị động (Ngày 13).",
          examples: [{ en: "Peer pressure, on the other hand, is better tackled by schools and parents.", vi: "Áp lực bạn bè, mặt khác, nên được xử lý bởi nhà trường và phụ huynh thì tốt hơn." }],
        },
      ],
    },
    {
      t: "table",
      caption: "Động từ giải pháp: đổi “ban / stop” thành động từ có mức độ",
      head: ["Chủ thể", "Động từ nên dùng", "Ví dụ"],
      rows: [
        ["governments", "require sb to V · introduce a law / tax · restrict · invest in · subsidise", "**require** companies **to** label edited photos"],
        ["companies / platforms", "limit · redesign · crack down on · switch off by default", "**crack down on** fake accounts"],
        ["schools", "set up · teach · raise awareness of · offer", "**raise awareness of** online safety"],
        ["parents", "set a good example · limit · agree rules with · spend time with", "**agree** screen-time **rules with** their children"],
        ["individuals", "cut down on · take up · switch off · strike a balance", "**cut down on** screen time before bed"],
      ],
    },
    {
      t: "rule",
      formula: "To address + N , S + could + V . If + S + V2 , S + would + V",
      vi: "Giải pháp = gọi lại nguyên nhân + ai làm gì (could) + câu điều kiện loại 2 nói kết quả.",
    },
    {
      t: "quiz",
      id: "t3d18-viet-giai-phap-dich",
      title: "Dịch sang tiếng Anh — câu giải pháp (4 câu)",
      kind: "translate",
      grammar: "To address… , S + could + V · If + V2, would + V · By + V-ing",
      items: [
        { q: "Để xử lý vấn đề này, chính phủ có thể yêu cầu các công ty giới hạn quảng cáo nhắm tới trẻ em.", answers: ["To address this problem, governments could require companies to limit advertising aimed at children.", "To tackle this problem, governments could require companies to limit advertising aimed at children.", "To address this problem, the government could require companies to limit advertising aimed at children.", "To tackle this problem, the government could require companies to limit advertising aimed at children.", "To address this problem, governments could require companies to limit advertisements aimed at children.", "To address this problem, governments could require companies to limit advertising targeting children.", "To address this problem, governments could require companies to limit advertising targeted at children."], hint: "To address this problem · could require companies to limit · advertising aimed at children" },
        { q: "Nếu vé xe buýt rẻ hơn, nhiều người sẽ để xe ở nhà hơn.", answers: ["If bus tickets were cheaper, more people would leave their cars at home.", "If bus fares were cheaper, more people would leave their cars at home.", "If bus fares were lower, more people would leave their cars at home.", "If bus tickets were cheaper, more people would leave their car at home."], hint: "If … were cheaper · would leave their cars at home" },
        { q: "Bằng cách dạy nấu ăn ở trường, chúng ta có thể giúp trẻ em ăn uống lành mạnh hơn.", answers: ["By teaching cooking at school, we can help children eat more healthily.", "By teaching cooking at school, we can help children to eat more healthily.", "By teaching cooking in schools, we can help children eat more healthily.", "By teaching cooking at school, we could help children eat more healthily.", "By teaching cooking in schools, we can help children to eat more healthily.", "By teaching cooking at school, we can help children eat healthier."], hint: "By teaching cooking at school · help children eat more healthily" },
        { q: "Các trường có thể lập câu lạc bộ thể thao, cho học sinh cảm giác thuộc về.", answers: ["Schools could set up sports clubs, giving students a sense of belonging.", "Schools could set up sport clubs, giving students a sense of belonging.", "Schools can set up sports clubs, giving students a sense of belonging.", "Schools could set up sports clubs, giving pupils a sense of belonging."], hint: "could set up · , giving students a sense of belonging" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Dàn ý 5 phút — lập theo CẶP" },
    {
      t: "p",
      text: "**Đề mẫu:** Many young people today spend several hours a day on social media, and some experts believe this is damaging their mental health and their relationships with others. What are the causes of this problem? What measures could be taken to reduce it?",
    },
    {
      t: "table",
      caption: "Dàn ý — ghi bằng từ khoá tiếng Anh, 5 phút",
      head: ["Đoạn", "Nội dung", "Cặp"],
      rows: [
        ["Mở bài (2 câu)", "While SM → stay in touch, many spend hours → harming mental health + relationships. Essay: 2 causes + a measure for each.", "—"],
        ["Thân bài 1 — causes", "**C1** addictive design: algorithms, endless content → 10 min becomes 2 hrs → less sleep, less face-to-face. **C2** peer pressure: group chats → afraid of being left out → check constantly, compare → lower self-confidence.", "C1 · C2"],
        ["Thân bài 2 — measures", "**S1** (for C1) governments: require companies to switch off endless scrolling + night notifications for under-18s → If apps stopped…, would be easier. **S2** (for C2) schools: phone-free clubs → sense of belonging; parents: set example at dinner.", "S1 ↔ C1 · S2 ↔ C2"],
        ["Kết bài (2 câu)", "Tóm: stems mainly from design + pressure. Stricter rules + offline activities → go a long way.", "—"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Hai bài mẫu cùng một đề — band 5 và band 6 (ước tính)" },
    {
      t: "p",
      text: "Đọc bài band 5 trước và **tự tìm ba chỗ yếu** trước khi xem bảng. Các lỗi ngữ pháp trong bài band 5 là **cố ý** — đừng học theo.",
    },
    {
      t: "passage",
      title: "Bài mẫu band 5 (ước tính) — 263 từ",
      paras: [
        { text: "Nowadays, social media is very popular with young people. Many of them use it for many hours every day, and it is bad for their mental health and their relationship with other people. This essay will discuss the causes and the solutions of this problem." },
        { text: "Firstly, there are many causes of this problem. Young people have smartphone and internet everywhere, so they can use social media any time they want. Moreover, all their friends use it, so they must use it too. Furthermore, the apps are very interesting and have many funny videos. Because of this, young people can not stop to use it. They feel sad when they see that other people life is better than them. They also do not talk with their family, they only look at the phone at dinner." },
        { text: "Secondly, there are some solutions for this problem. The government should ban social media for all people under 18 years old. Moreover, young people should do more sport and outdoor activities, it is good for their health and they can make new friends. In addition, schools should give more homework, so students do not have time for social media. Parents also should talk with their children more. If we do all these things, the problem will be solved." },
        { text: "In conclusion, there are many causes and solutions of this problem. I think young people should use social media less, and the government, schools and parents should help them. Then young people will have better health and better relationship in the future, and they will be more happy in their life." },
      ],
    },
    {
      t: "passage",
      title: "Bài mẫu band 6 – 6.5 (ước tính) — 316 từ",
      paras: [
        { text: "While social media has made it easier than ever for young people to stay in touch, many of them now spend several hours a day online, which is harming both their mental health and their relationships. This essay will examine two main causes of this problem and suggest a measure to deal with each of them." },
        { text: "The first cause is the way in which the platforms themselves are designed. Apps such as short-video services use algorithms that show users an endless stream of content chosen to keep them watching. As a result, teenagers who intend to spend ten minutes online often end up scrolling for two hours, which reduces the time left for sleep and for face-to-face interaction. A second cause is peer pressure. Because most social life at school is now organised through group chats, young people who log off are afraid of being left out. This leads them to check their phones constantly and to compare themselves with the perfect images posted by others, which in turn lowers their self-confidence." },
        { text: "Since these causes are different, they need different solutions. To address addictive design, governments could require companies to switch off endless scrolling and night-time notifications for users under eighteen. If apps simply stopped after thirty minutes, most teenagers would find it far easier to put their phones down. Peer pressure, on the other hand, is better tackled by schools and parents. Schools could set up phone-free clubs and sports teams, giving students a sense of belonging that does not depend on a screen, while parents should set a good example by keeping their own phones away from the dinner table." },
        { text: "In conclusion, heavy social media use among young people stems mainly from addictive app design and from pressure from friends. Stricter rules for technology companies, combined with more offline activities organised by schools and families, would go a long way towards reducing the problem." },
      ],
    },
    {
      t: "table",
      caption: "Cùng đề — khác nhau ở đâu? (theo 4 tiêu chí)",
      head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
      rows: [
        ["**TR**", "3 nguyên nhân trộn lẫn 2 hậu quả, mỗi ý một câu, không giải thích. 4 giải pháp: **cấm** (cực đoan), **thể thao** và **thêm bài tập** không chữa nguyên nhân nào đã nêu. “The problem will be solved” — khẳng định quá tay.", "2 nguyên nhân, mỗi cái có **chuỗi hai tầng** chạm cả hai vế đề (sleep / self-confidence = mental health; face-to-face interaction = relationships). 2 giải pháp **khớp cặp**, có ai – làm gì – vì sao."],
        ["**CC**", "Firstly · Moreover · Furthermore · Because of this · Secondly · Moreover · In addition — từ nối đầu câu **máy móc**; các ý đứng rời.", "The first cause… A second cause… **Since these causes are different**… (câu bản lề) · To address… · …, on the other hand,… ; nối bằng This / these / which."],
        ["**LR**", "very popular · bad · many (×5) · interesting · sad · good · problem (×5).", "the way in which platforms are designed · an endless stream of content · peer pressure · afraid of being left out · a sense of belonging · stems from · go a long way towards."],
        ["**GRA**", "Câu đơn + so. Lỗi: ~~have smartphone~~ · ~~can not stop to use~~ · ~~other people life~~ · ~~better than them~~ · comma splice (×2) · ~~relationship~~ (số ít) · ~~more happy~~.", "While…, …, which… · mệnh đề quan hệ (teenagers **who intend**…) · V3 / V-ing rút gọn (content **chosen**… · images **posted**… · **giving** students…) · điều kiện loại 2 · bị động (is better tackled by)."],
      ],
    },
    {
      t: "note",
      title: "Câu khung rút ra từ bài band 6 — chép vào sổ",
      items: [
        "**The first cause is the way in which** + S + V. · **A second cause is** + N.",
        "**As a result,** S + often **end up** + V-ing**, which reduces**…",
        "**This leads them to** + V … **, which in turn** + V(s/es)…",
        "**Since these causes are different, they need different solutions.** (câu bản lề mở thân bài 2)",
        "**To address** + N, **governments could require** + O + **to** V. **If** + S + V2, S + **would** + V.",
        "N, **on the other hand, is better tackled by** + N.",
        "**In conclusion,** N **stems mainly from** A **and** B. X**, combined with** Y**, would go a long way towards** + V-ing.",
      ],
    },
    {
      t: "quiz",
      id: "t3d18-viet-dien-mau",
      title: "Gập bài mẫu band 6 lại — điền từ còn thiếu (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "______ social media has made it easier than ever for young people to stay in touch, many of them now spend several hours a day online…", answers: ["While", "Although"], hint: "nhượng bộ" },
        { q: "The first cause is the way ______ ______ the platforms themselves are designed. (2 từ)", answers: ["in which"], hint: "giới từ + which" },
        { q: "As a ______, teenagers who intend to spend ten minutes online often end up scrolling for two hours.", answers: ["result"], hint: "As a … ," },
        { q: "…end up scrolling for two hours, ______ reduces the time left for sleep.", answers: ["which"], hint: "thay cả ý phía trước" },
        { q: "This ______ them to check their phones constantly.", answers: ["leads"], hint: "… sb to V" },
        { q: "…compare themselves with the perfect images posted by others, which in ______ lowers their self-confidence.", answers: ["turn"], hint: "tầng hai" },
        { q: "To ______ addictive design, governments could require companies to switch off endless scrolling.", answers: ["address", "tackle"], hint: "động từ = xử lý" },
        { q: "If apps simply ______ (stop) after thirty minutes, most teenagers would find it far easier to put their phones down.", answers: ["stopped"], hint: "điều kiện loại 2" },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Sửa bài band 5 thành band 6 — ba chỗ" },
    {
      t: "table",
      head: ["Chỗ sửa", "Band 5", "Sửa thành", "Đã làm gì"],
      rows: [
        ["Nguyên nhân", "Moreover, all their friends use it, so they must use it too.", "A second cause is peer pressure. Because most social life at school is now organised through group chats, young people who log off are afraid of being left out.", "đặt **tên** cho nguyên nhân (peer pressure) + giải thích cơ chế"],
        ["Giải pháp", "The government should ban social media for all people under 18 years old.", "Governments could require companies to switch off endless scrolling and night-time notifications for users under eighteen.", "bỏ ban → **require + to V**; hành động cụ thể, khả thi, nhắm đúng “addictive design”"],
        ["Kết quả", "If we do all these things, the problem will be solved.", "…would go a long way towards reducing the problem.", "bỏ khẳng định tuyệt đối → **would + mức độ**"],
      ],
    },
    {
      t: "mcq",
      id: "t3d18-viet-nhan-dien",
      title: "Nhận diện: câu nào đạt mức band 6? (6 câu)",
      items: [
        { q: "Câu nêu nguyên nhân tốt nhất:", options: ["There are many causes of this problem.", "The main cause is that fast food is cheap, which makes it the easiest choice for families on low incomes.", "Fast food is very cheap and very delicious.", "Firstly, people like fast food. Moreover, it is cheap."], correct: 1, why: "Một nguyên nhân + giải thích cơ chế bằng “, which makes it…”. A rỗng; C chỉ mô tả; D liệt kê." },
        { q: "Câu giải pháp tốt nhất:", options: ["Governments could tax sugary drinks and use the money to make fruit cheaper in schools.", "The government should solve this problem.", "People should be more aware of their health.", "Fast food should be banned in all countries."], correct: 0, why: "Ai (governments) – làm gì (đánh thuế, trợ giá trái cây) – cụ thể, khả thi. B, C chung chung; D cực đoan." },
        { q: "Câu mở bài tốt nhất cho đề về kẹt xe:", options: ["Nowadays, traffic jam is a big problem in the world.", "This essay will discuss the problems and solutions.", "Although cars have given people more freedom, the growing number of vehicles is causing serious congestion in most cities.", "Traffic congestion is getting worse in most big cities."], correct: 2, why: "Nhượng bộ + paraphrase vấn đề trong một câu phức. D chép nguyên đề; A sáo; B chỉ có câu báo cấu trúc." },
        { q: "Chuỗi hệ quả nào hợp lý (dừng đúng tầng)?", options: ["Students use phones, so they fail exams, so they have no jobs, so the country becomes poor.", "Students use phones. It is bad.", "Students use phones late at night, so the economy suffers.", "Students use their phones late at night. As a result, they sleep less, which makes it harder to concentrate in class."], correct: 3, why: "Hai tầng, mỗi tầng hợp lý. A phóng đại 4 tầng; C nhảy cóc; B không có chuỗi." },
        { q: "Câu nào ĐÚNG ngữ pháp?", options: ["This causes young people feel lonely.", "This leads to young people feel lonely.", "This causes young people to feel lonely.", "This makes young people to feel lonely."], correct: 2, why: "**cause + O + to V**. make + O + V (không to); lead to + N / V-ing." },
        { q: "Câu kết bài tốt nhất:", options: ["In conclusion, there are many causes and solutions.", "In conclusion, this problem stems mainly from low prices and aggressive advertising, and a tax on unhealthy food combined with better school meals would help to reduce it.", "In conclusion, if we do these things, the problem will disappear.", "In conclusion, I think it is a serious problem and we should solve it together."], correct: 1, why: "Tóm đúng 2 nguyên nhân + 2 giải pháp, dùng would help (có mức độ). A, D rỗng; C khẳng định tuyệt đối." },
      ],
    },

    /* ── 10 ── */
    { t: "h", text: "10. Lỗi mất điểm ở Problem / solution band 5 → 6" },
    {
      t: "note",
      title: "⚠️ Bảy lỗi hay sai — soát trước khi nộp",
      items: [
        "**Trả lời sai câu hỏi:** đề hỏi causes + effects mà viết solutions (hoặc ngược lại).",
        "**Giải pháp không khớp** nguyên nhân / vấn đề đã nêu ở thân bài 1.",
        "**Liệt kê** 4–5 ý không phát triển. Hai ý phát triển kỹ luôn hơn năm ý trơ.",
        "**Quên một vế** của vấn đề trong đề (chỉ nói mental health, bỏ relationships).",
        "**Khẳng định tuyệt đối:** will be solved, will disappear, all young people, the only cause → would help to reduce, many, one of the main causes.",
        "**Từ nối đầu câu dày đặc** (Firstly, Moreover, Furthermore, In addition trong một đoạn). Mỗi đoạn tối đa hai.",
        "**Ngữ pháp nguyên nhân – kết quả:** lead to + V nguyên mẫu · cause sb + V · Although… but · Despite + mệnh đề.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Bảng tự soát 2 phút cho dạng này",
      steps: [
        { label: "Câu hỏi cuối đề hỏi gì?", sub: "Mỗi phần có một đoạn thân bài riêng chưa?" },
        { label: "Nối bút chì: S1 → C1, S2 → C2", sub: "Giải pháp nào không nối được → sửa" },
        { label: "Mỗi nguyên nhân có 2 tầng hệ quả?", sub: "As a result… , which…" },
        { label: "Mỗi giải pháp có đủ ai – làm gì – vì sao?", sub: "could + V · If + V2, would + V" },
        { label: "Gạch will be solved / all / ban", sub: "→ would help · many · restrict" },
      ],
    },

    /* ── 11 ── */
    { t: "h", text: "11. Viết bài — AI chấm 4 tiêu chí" },
    {
      t: "p",
      text: "Đề mới thuộc kiểu **problems + solutions** (khác bài mẫu là causes + measures) — nên “khớp cặp” lần này là **giải pháp ↔ vấn đề**. Dành **5 phút lập dàn ý theo cặp**, 30 phút viết, 5 phút soát theo bảng ở mục 10. Tổng 40 phút.",
    },
    {
      t: "essay",
      id: "t3d18-viet-bai",
      task: "Task 2",
      prompt: "In many cities, an increasing number of people live alone, and many of them say that they often feel lonely. What problems does this cause for individuals and for society? What can be done to solve these problems? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Câu hỏi 1 có **hai vế**: problems **for individuals** + **for society**. Thân bài 1 nên có một vấn đề cho mỗi vế (ví dụ: sức khoẻ tinh thần của cá nhân · gánh nặng cho hệ thống y tế / cộng đồng lỏng lẻo).",
        "Thân bài 2: **mỗi vấn đề một giải pháp** — mở bằng “To address…” để gọi lại đúng vấn đề.",
        "Mở bài nhượng bộ: While living alone offers independence and privacy, …",
        "Mỗi vấn đề kéo **hai tầng** hệ quả (As a result… , which…). Dừng ở tầng hai.",
        "Mỗi giải pháp: **ai** (councils · employers · housing companies · individuals) – **làm gì** – **vì sao** (If + V2, would + V).",
        "Dùng ít nhất 4 từ của bài 1: social isolation · companionship · a sense of belonging · face-to-face interaction · turn to · stem from.",
        "Tránh: ban, will be solved, everyone, Firstly / Moreover / Furthermore liền nhau.",
      ],
    },
    {
      t: "note",
      title: "Sau khi AI chấm",
      items: [
        "Xem điểm **TR** trước: AI có nhận xét “giải pháp chưa liên quan trực tiếp” không? Nếu có → viết lại **riêng thân bài 2**.",
        "Chép 3 lỗi ngữ pháp / từ vựng AI chỉ ra vào **Sổ lỗi**, viết lại đúng mỗi câu một lần (cách làm ở Ngày 2).",
        "Giữ bài này — Ngày 30 bạn sẽ **viết lại hai bài cũ** theo sổ lỗi; đây là một ứng viên tốt.",
      ],
    },
  ],
};
/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T3D18_SPEAKING: Lesson = {
  id: "t3d18-noi",
  kind: "speaking",
  title: "Nói: Phỏng vấn xin việc — câu hỏi kiểu Part 1 / Part 3 + nghe một buổi phỏng vấn mẫu",
  goal: "Trả lời được tám câu hỏi phỏng vấn xin việc hay gặp nhất bằng tiếng Anh ở mức band 6: tự giới thiệu theo khung Hiện tại – Quá khứ – Tương lai, nêu điểm mạnh / điểm yếu kèm chuyện chứng minh theo khung STAR, hỏi lại nhà tuyển dụng bằng câu hỏi gián tiếp lịch sự và đúng ngữ điệu — đồng thời luyện chính kỹ năng Part 1 và Part 3 của IELTS.",
  minutes: 85,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Đây là bài **tiếng Anh ứng dụng** của chặng (Tập 2 Ngày 17 là họp công việc). Phỏng vấn xin việc dùng **đúng** kỹ năng IELTS Speaking: câu về bản thân = **Part 1**, câu “kể một lần bạn…” = **Part 2 thu nhỏ**, câu về quan điểm = **Part 3**.",
        "**Nghe một buổi phỏng vấn mẫu** (~3 phút, giọng Anh + Úc) rồi trả lời 6 câu — nghe hiểu đời sống / công việc.",
        "Ba khung trả lời: ① **Present – Past – Future** cho “Tell me about yourself”; ② **tính cách + chuyện STAR** cho điểm mạnh / “Tell me about a time when…”; ③ **điểm yếu thật + việc đang làm để sửa**.",
        "**Ngôn ngữ lịch sự**: I'd say… · I was wondering whether… · Would it be possible to…? — và **ngữ điệu lịch sự** (🔊 phát âm hôm nay).",
        "Đẩy band: **FC** (trả lời dài, có tổ chức), **LR** (từ tính cách của bài 1: conscientious, reliable, come up with), **GRA** (hiện tại hoàn thành tiếp diễn, quá khứ đơn kể chuyện, câu hỏi gián tiếp), **P** (ngữ điệu).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Phỏng vấn xin việc và IELTS Speaking — cùng một bộ kỹ năng" },
    {
      t: "table",
      head: ["Câu hỏi phỏng vấn", "Giống phần nào của IELTS", "Kỹ năng dùng chung"],
      rows: [
        ["Could you tell me a little about yourself?", "Part 1 (Work / Study)", "trả lời 3–4 câu, có trật tự thời gian"],
        ["What attracted you to this position?", "Part 1 “Why did you choose…?” (khung Why)", "2 lý do + chi tiết"],
        ["What is your greatest strength / weakness?", "Part 2 tả người (ngân hàng tính cách — Ngày 7)", "tính cách → chuyện chứng minh"],
        ["Tell me about a time when you…", "Part 2 “a time when” (đầu – sự cố – kết quả)", "kể quá khứ gọn 45–60 giây"],
        ["How do you handle pressure / conflict?", "Part 3 (quan điểm + ví dụ)", "ý kiến → lý do → ví dụ"],
        ["Where do you see yourself in five years?", "Part 3 dự đoán tương lai", "I'd like to… · I hope to have + V3 (họ hàng của tương lai hoàn thành — Ngày 5)"],
        ["What would you do if…?", "Part 3 giả định (Ngày 15)", "If + V2, I would…"],
        ["Do you have any questions for us?", "(IELTS không có)", "câu hỏi gián tiếp lịch sự (Tập 2 Ngày 19)"],
      ],
    },
    {
      t: "note",
      title: "Khác IELTS ở ba điểm — nhớ khi đi phỏng vấn thật",
      items: [
        "**Mục đích:** IELTS đo tiếng Anh; phỏng vấn đo **bạn có hợp việc không**. Mỗi câu trả lời phải kết ở “…nên tôi hợp với vị trí này”.",
        "**Độ trang trọng:** lịch sự hơn Part 1 — tránh yeah, gonna, kind of; dùng I'd say, I believe, Certainly.",
        "**Trung thực:** IELTS cho phép bịa chuyện để có nội dung; phỏng vấn thì **không** — chỉ kể việc thật, vì người ta sẽ hỏi sâu.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Nghe một buổi phỏng vấn mẫu (Questions 1–6)" },
    {
      t: "canh",
      anh: ["office-building", "woman-office-worker", "handshake", "briefcase"],
      caption: "**Minh**, sinh viên năm cuối ngành Kỹ thuật phần mềm, phỏng vấn vị trí **Junior Data Analyst** (chuyên viên phân tích dữ liệu tập sự) tại một công ty giao vận. Người phỏng vấn là **Ms Carter**, trưởng nhóm dữ liệu.",
    },
    {
      t: "p",
      text: "Đọc 6 câu hỏi trước (30 giây), nghe **một lần**, rồi trả lời. Sau đó mở lời thoại và đọc bảng phân tích — đây là mẫu cho chính câu trả lời của bạn ở mục 9.",
    },
    {
      t: "listen",
      id: "t3d18-noi-nghe-phong-van",
      title: "A job interview: Junior Data Analyst",
      dan: { so: "Day 18, Recording 1", boiCanh: "a job interview between a manager, Ms Carter, and a final-year student, Minh.", cau: [1, 6] },
      note: "Khoảng 3 phút, hai giọng: Ms Carter (Anh, nữ) · Minh (Úc, nam).",
      lines: [
        { who: "Ms Carter", voice: "uk-nu", text: "Good morning, Minh. Thanks for coming in. Did you find us all right?", vi: "Chào Minh. Cảm ơn em đã tới. Em tìm đường tới đây ổn chứ?" },
        { who: "Minh", voice: "au-nam", text: "Good morning. Yes, thank you. The directions in your email were very clear.", vi: "Chào chị ạ. Vâng, cảm ơn chị. Chỉ dẫn trong email của chị rất rõ." },
        { who: "Ms Carter", voice: "uk-nu", text: "Good. So, to start with, could you tell me a little about yourself?", vi: "Tốt. Vậy để bắt đầu, em giới thiệu đôi chút về mình được không?" },
        { who: "Minh", voice: "au-nam", text: "Of course. I'm in my final year of a software engineering degree, and I'll graduate in June. For the past year I've been working part-time as a tester for a small company that builds booking apps, and that's where I found I really enjoy working with data. That's why I'm now looking for a junior analyst role, and yours caught my eye.", vi: "Vâng ạ. Em đang học năm cuối ngành kỹ thuật phần mềm và sẽ tốt nghiệp vào tháng Sáu. Một năm qua em làm bán thời gian ở vị trí kiểm thử cho một công ty nhỏ chuyên làm ứng dụng đặt chỗ, và ở đó em nhận ra mình rất thích làm việc với dữ liệu. Vì thế giờ em tìm một vị trí phân tích tập sự, và vị trí bên chị thu hút em." },
        { who: "Ms Carter", voice: "uk-nu", text: "What attracted you to this position in particular?", vi: "Cụ thể điều gì ở vị trí này thu hút em?" },
        { who: "Minh", voice: "au-nam", text: "Two things, really. First, your company handles deliveries across six countries, which means the data is on a scale I haven't worked with before, and I'd like that challenge. Second, the advert mentions a training programme for new staff, and I'm keen to keep learning.", vi: "Thật ra có hai điều ạ. Thứ nhất, công ty mình xử lý giao hàng ở sáu nước, nghĩa là dữ liệu ở quy mô em chưa từng làm, và em muốn thử thách đó. Thứ hai, tin tuyển dụng có nhắc chương trình đào tạo cho nhân viên mới, và em rất muốn tiếp tục học." },
        { who: "Ms Carter", voice: "uk-nu", text: "What would you say is your greatest strength?", vi: "Theo em điểm mạnh lớn nhất của mình là gì?" },
        { who: "Minh", voice: "au-nam", text: "I'd say I'm conscientious. For instance, in my testing job I noticed that our weekly reports took nearly three hours to prepare by hand. Nobody had asked me to, but I wrote a short script to produce them automatically, and it cut the time to about twenty minutes. My manager now uses it for two other projects.", vi: "Em nghĩ là em tận tâm ạ. Chẳng hạn, ở chỗ làm kiểm thử em để ý báo cáo tuần mất gần ba tiếng để làm tay. Không ai yêu cầu, nhưng em viết một đoạn mã ngắn để tạo báo cáo tự động, và nó rút thời gian xuống còn khoảng hai mươi phút. Giờ quản lý của em dùng nó cho hai dự án khác." },
        { who: "Ms Carter", voice: "uk-nu", text: "Impressive. And a weakness?", vi: "Ấn tượng đấy. Còn điểm yếu?" },
        { who: "Minh", voice: "au-nam", text: "I used to find it hard to speak up in meetings, especially in English. To work on that, I joined the university debating club last year, and I now present our test results to the team every Friday. I'm still not the loudest person in the room, but I'm much more confident than I was.", vi: "Trước đây em thấy khó lên tiếng trong cuộc họp, nhất là bằng tiếng Anh. Để cải thiện, năm ngoái em tham gia câu lạc bộ tranh biện của trường, và giờ thứ Sáu nào em cũng trình bày kết quả kiểm thử cho nhóm. Em vẫn chưa phải người nói to nhất phòng, nhưng tự tin hơn trước nhiều." },
        { who: "Ms Carter", voice: "uk-nu", text: "Can you tell me about a time when you disagreed with a colleague?", vi: "Em kể về một lần bất đồng với đồng nghiệp được không?" },
        { who: "Minh", voice: "au-nam", text: "Yes. A developer and I disagreed about whether a bug was serious enough to delay a release. Rather than argue, I suggested we show it to two real users. Both of them got stuck, so he agreed to fix it first, and the release went out only a day late.", vi: "Vâng. Em và một lập trình viên bất đồng về việc một lỗi có đủ nghiêm trọng để hoãn phát hành không. Thay vì tranh cãi, em đề nghị cho hai người dùng thật thử. Cả hai đều bị kẹt, nên anh ấy đồng ý sửa trước, và bản phát hành chỉ trễ một ngày." },
        { who: "Ms Carter", voice: "uk-nu", text: "Thank you. Do you have any questions for me?", vi: "Cảm ơn em. Em có câu hỏi nào cho chị không?" },
        { who: "Minh", voice: "au-nam", text: "Yes, I was wondering whether you could tell me a bit more about the training programme. And would it be possible to know when I might hear back from you?", vi: "Có ạ, em không biết chị có thể nói thêm đôi chút về chương trình đào tạo không. Và em có thể biết khi nào sẽ nhận được phản hồi không ạ?" },
        { who: "Ms Carter", voice: "uk-nu", text: "Certainly. The programme lasts three months, with a mentor for each new analyst. As for the result, we'll be in touch by the end of next week.", vi: "Được chứ. Chương trình kéo dài ba tháng, mỗi chuyên viên mới có một người hướng dẫn. Còn kết quả thì bọn chị sẽ liên lạc trước cuối tuần sau." },
      ],
    },
    {
      t: "mcq",
      id: "t3d18-noi-nghe-cau",
      title: "Questions 1–6 — Choose A, B or C",
      items: [
        { q: "(1) At the moment, Minh is", options: ["A working full-time as a data analyst.", "B looking for his first job after graduating last June.", "C finishing his degree and working part-time."], correct: 2, why: "“I'm in my **final year**… I'll graduate in June. For the past year I've been **working part-time** as a tester.” B sai: June là tương lai (I'll graduate)." },
        { q: "(2) Minh is interested in the job mainly because of", options: ["A the size of the data and the training offered.", "B the salary and the location.", "C the chance to work in six countries."], correct: 0, why: "“the data is **on a scale** I haven't worked with before… the advert mentions **a training programme**.” C là bẫy: công ty giao hàng ở sáu nước, không phải Minh được đi." },
        { q: "(3) To show his main strength, Minh describes how he", options: ["A trained two new colleagues.", "B made a regular task much faster.", "C finished a project three hours early."], correct: 1, why: "“I wrote a short script to produce them automatically, and it **cut the time** to about twenty minutes.” three hours là thời gian làm tay ban đầu; two là số dự án khác dùng script." },
        { q: "(4) The weakness Minh mentions is that he", options: ["A was not confident about speaking in meetings.", "B finds it difficult to work in a team.", "C cannot write reports in English."], correct: 0, why: "“I **used to find it hard to speak up in meetings**, especially in English.” Chú ý used to: điểm yếu đã được cải thiện." },
        { q: "(5) The disagreement with the developer was settled by", options: ["A asking their manager to decide.", "B delaying the release by a week.", "C testing the problem with real users."], correct: 2, why: "“I suggested we **show it to two real users**. Both of them got stuck, so he agreed…” Bản phát hành chỉ trễ **một ngày**, không phải một tuần." },
        { q: "(6) Minh will hear the result of the interview", options: ["A in three months.", "B by the end of next week.", "C on Friday."], correct: 1, why: "“we'll be in touch **by the end of next week**.” three months là độ dài chương trình đào tạo; Friday là ngày Minh thuyết trình hằng tuần." },
      ],
    },
    {
      t: "table",
      caption: "Mổ xẻ câu trả lời của Minh — vì sao chúng tốt",
      head: ["Câu hỏi", "Minh làm gì", "Ngôn ngữ đáng học"],
      rows: [
        ["Tell me about yourself", "**Hiện tại** (năm cuối) → **Quá khứ gần** (một năm làm tester) → **Tương lai** (tìm vị trí analyst)", "I'm in my final year of… · For the past year **I've been working**… · That's why I'm now looking for…"],
        ["What attracted you…?", "Báo trước **hai lý do**, mỗi lý do gắn với **thông tin về công ty**", "Two things, really. First,… **, which means**… Second,… I'm keen to…"],
        ["Greatest strength", "**Một** tính từ + chuyện có **con số** (3 giờ → 20 phút) + kết quả lan rộng", "I'd say I'm conscientious. For instance,… Nobody had asked me to, but… it cut the time to…"],
        ["Weakness", "Điểm yếu **thật** nhưng không chí mạng + **việc đã làm để sửa** + kết quả hiện tại", "I used to find it hard to… To work on that, I… I'm still not…, but I'm much more… than I was."],
        ["A time when you disagreed", "STAR trong 4 câu: tình huống → việc mình làm → kết quả", "Rather than argue, I suggested (that) we… so he agreed to…"],
        ["Any questions?", "Hai câu hỏi **gián tiếp**, lịch sự", "I was wondering whether you could… · Would it be possible to know when…?"],
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. “Tell me about yourself” — khung Hiện tại → Quá khứ → Tương lai" },
    {
      t: "p",
      text: "Câu này **không** hỏi quê quán, gia đình, sở thích như Part 1. Người hỏi muốn nghe trong **45–60 giây**: bạn đang ở đâu trên đường nghề nghiệp, đã làm gì liên quan, và vì sao bạn ngồi ở đây. Ba bước, ba thì động từ.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Present → Past → Future",
      steps: [
        { label: "① Hiện tại", sub: "I'm in my final year of… / I'm currently working as… (hiện tại đơn / tiếp diễn)" },
        { label: "② Quá khứ liên quan", sub: "For the past year I've been V-ing… / Last summer I did an internship at…, where I…" },
        { label: "③ Tương lai — vì sao ở đây", sub: "That's why I'm looking for… / I'd now like to…" },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I'm in my final year of + ngành + at + trường , and I'll graduate in + tháng",
          vi: "Bước ① cho sinh viên.",
          examples: [{ en: "I'm in my final year of a software engineering degree at FPT University, and I'll graduate in June.", vi: "Em đang học năm cuối ngành kỹ thuật phần mềm ở Đại học FPT và sẽ tốt nghiệp tháng Sáu." }],
        },
        {
          formula: "For the past + khoảng thời gian + I've been + V-ing … , where / which + …",
          vi: "Bước ② — hiện tại hoàn thành tiếp diễn (Ngày 1) + mệnh đề quan hệ (Ngày 17).",
          examples: [{ en: "For the past six months I've been doing an internship at a bank, where I helped to test the mobile app.", vi: "Sáu tháng qua em thực tập ở một ngân hàng, nơi em tham gia kiểm thử ứng dụng di động." }],
        },
        {
          formula: "That's why I'm now looking for + vị trí , and + lý do chọn công ty",
          vi: "Bước ③ — nối quá khứ với vị trí đang xin.",
          examples: [{ en: "That's why I'm now looking for a role in software testing, and your company's focus on quality really appeals to me.", vi: "Vì thế giờ em tìm một vị trí kiểm thử phần mềm, và việc công ty chú trọng chất lượng thật sự hấp dẫn em." }],
        },
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai ở câu tự giới thiệu",
      items: [
        "**Kể tiểu sử:** “My name is…, I was born in…, my family has four people, my hobby is…” → nhà tuyển dụng đã có CV; đây không phải Part 1.",
        "**Sai thì:** ~~I work there since last year~~ → I**'ve been working** there since last year. ~~I am graduate~~ → I **graduated** / I **will graduate**.",
        "**Tiếng Việt bê sang:** ~~I am a student of year 4~~ → I'm a **fourth-year / final-year** student. ~~I study IT major~~ → I'm studying IT / I'm doing a degree in IT.",
        "**Quá dài:** quá 60 giây người nghe mất tập trung. Ba bước, mỗi bước 1–2 câu.",
      ],
    },
    {
      t: "rule",
      formula: "I'm … (hiện tại) . For the past … I've been V-ing … (quá khứ gần) . That's why I'm now looking for … (tương lai)",
      vi: "Tự giới thiệu 45–60 giây: đang là ai → đã làm gì liên quan → vì sao xin vị trí này.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Điểm mạnh và “Tell me about a time when…” — tính cách + chuyện STAR" },
    {
      t: "p",
      text: "Bài 1 hôm nay nói: tính từ tính cách **không bao giờ đứng một mình**. Trong phỏng vấn, “chuyện chứng minh” có tên là **STAR**: **S**ituation (bối cảnh) → **T**ask (việc phải làm) → **A**ction (mình đã làm gì) → **R**esult (kết quả, tốt nhất có **con số**). Đây cũng chính là khung “a time when” của Part 2 — chỉ ngắn hơn.",
    },
    {
      t: "table",
      caption: "STAR trên câu trả lời của Minh",
      head: ["Bước", "Câu của Minh", "Thì / cấu trúc"],
      rows: [
        ["**S**ituation", "In my testing job I noticed that our weekly reports took nearly three hours to prepare by hand.", "quá khứ đơn"],
        ["**T**ask", "Nobody had asked me to, but…", "quá khứ hoàn thành (Ngày 1)"],
        ["**A**ction", "…I wrote a short script to produce them automatically,", "quá khứ đơn + to V chỉ mục đích"],
        ["**R**esult", "…and it cut the time to about twenty minutes. My manager now uses it for two other projects.", "quá khứ đơn → hiện tại đơn (kết quả còn tới nay)"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I'd say I'm + adj . For instance, when I + V2 … , I + V2 … , and as a result + S + V2",
          vi: "Điểm mạnh: một tính từ + một chuyện.",
          examples: [{ en: "I'd say I'm reliable. For instance, when our group leader fell ill a week before the deadline, I took over the report, and as a result we still handed it in on time.", vi: "Em nghĩ mình đáng tin cậy. Chẳng hạn, khi trưởng nhóm ốm một tuần trước hạn, em nhận phần báo cáo, và nhờ thế nhóm vẫn nộp đúng hạn." }],
        },
        {
          formula: "Rather than + V , I + V2 … , so + S + V2",
          vi: "Kể cách xử lý mâu thuẫn: không làm điều dễ đoán mà làm điều tốt hơn.",
          examples: [{ en: "Rather than complain to the teacher, I asked my teammate what was stopping him, so we were able to share the work differently.", vi: "Thay vì mách thầy, em hỏi bạn cùng nhóm điều gì đang cản trở bạn ấy, nhờ đó bọn em chia lại việc." }],
        },
        {
          formula: "I used to + V … . To work on that, I + V2 / I've been + V-ing … . I'm still not … , but I'm much more + adj + than I was",
          vi: "Điểm yếu: trước đây → việc đang làm để sửa → hiện giờ.",
          examples: [{ en: "I used to leave things until the last minute. To work on that, I've been planning each week on Sunday evening. I'm still not perfect, but I'm much more organised than I was.", vi: "Trước đây em hay để việc tới phút chót. Để cải thiện, em lên kế hoạch cho từng tuần vào tối Chủ nhật. Em vẫn chưa hoàn hảo, nhưng ngăn nắp hơn trước nhiều." }],
        },
      ],
    },
    {
      t: "table",
      caption: "Ngân hàng điểm mạnh — chọn MỘT và chuẩn bị sẵn một chuyện thật",
      head: ["Tính từ (bài 1)", "Chuyện gợi ý của sinh viên IT"],
      rows: [
        ["conscientious", "tự viết test / kiểm lại code của nhóm trước khi nộp đồ án"],
        ["reliable", "nhận phần việc của bạn ốm, vẫn kịp hạn"],
        ["resilient", "trượt một môn / bị từ chối thực tập → học lại, lần sau đạt"],
        ["a quick learner", "tự học một framework trong hai tuần để kịp dự án"],
        ["a team player", "giúp bạn yếu hơn hiểu Git → cả nhóm làm nhanh hơn"],
        ["open-minded", "ban đầu phản đối ý của bạn, thử rồi thấy tốt hơn ý mình"],
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai khi nói điểm mạnh / điểm yếu",
      items: [
        "**Liệt kê không bằng chứng:** “I'm hard-working, friendly, creative and responsible.” → một tính từ + một chuyện.",
        "**Điểm yếu giả:** “My weakness is that I work too hard / I'm a perfectionist.” → ai cũng nói, nghe thiếu thật. Chọn điểm yếu **thật nhưng sửa được** (nói trước đám đông, quản lý thời gian, ngại hỏi).",
        "**Điểm yếu chí mạng với vị trí:** xin làm kiểm thử mà nói “I'm not careful with details” → đừng.",
        "**Kể chuyện “we” suốt:** người phỏng vấn muốn biết **bạn** làm gì: I suggested, I wrote, I asked.",
      ],
    },
    {
      t: "rule",
      formula: "I'd say I'm + adj . For instance, + S (tình huống) → I + V2 (việc mình làm) → kết quả có con số",
      vi: "Điểm mạnh = một tính từ + một chuyện STAR 3–4 câu. Điểm yếu = I used to… → To work on that, I… → …than I was.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Bốn câu hỏi kiểu Part 3 — và khung trả lời" },
    {
      t: "table",
      head: ["Câu hỏi", "Khung", "Câu mẫu band 6"],
      rows: [
        ["Why should we hire you?", "Tóm 2 điểm khớp với tin tuyển dụng", "**I believe I'd be a good fit because** I have hands-on testing experience and I learn quickly, **which is what the role seems to need**."],
        ["Where do you see yourself in five years?", "I'd like to + V … / I hope to have + V3 (họ hàng của tương lai hoàn thành — Ngày 5)", "**In five years' time, I'd like to be** leading a small team, and **I hope to have gained** experience in at least two different projects."],
        ["How do you deal with pressure?", "Ý kiến → cách làm → ví dụ ngắn", "**I tend to** break a big task into smaller steps. **During exam weeks, for example,** I make a daily list, **which stops me from** feeling overwhelmed."],
        ["What would you do if you disagreed with your manager?", "Điều kiện loại 2 (Ngày 15)", "**If I disagreed** with a decision, **I'd explain** my concerns privately first. **If the decision stayed the same, I would** still support it."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: ba động từ “mềm” làm câu trả lời nghe chín chắn",
      items: [
        "**I tend to** + V (tôi thường có xu hướng…) — thay cho I always.",
        "**I'd say / I believe** — thay cho I think lặp đi lặp lại.",
        "**I'd be happy to** + V (tôi sẵn lòng…) — khi được hỏi có chịu làm ca / học thêm / chuyển nơi làm không.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Lịch sự: hỏi lại, xin nhắc lại, và câu hỏi cho nhà tuyển dụng" },
    {
      t: "p",
      text: "Tập 2 Ngày 19 bạn đã học **câu hỏi gián tiếp**: sau cụm mở đầu, trật tự là **chủ ngữ + động từ** như câu kể, không đảo. Phỏng vấn là nơi dùng nó nhiều nhất — hỏi thẳng “When will you call me?” nghe như ra lệnh.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I was wondering whether / if + S + could + V …",
          vi: "Cách mở lịch sự nhất (dùng quá khứ tiếp diễn để “lùi” cho mềm).",
          examples: [{ en: "I was wondering whether you could tell me a bit more about the team.", vi: "Em không biết chị có thể nói thêm đôi chút về nhóm không ạ." }],
        },
        {
          formula: "Could you tell me + Wh- + S + V … ?",
          vi: "Hỏi thông tin: KHÔNG đảo sau Wh-.",
          examples: [{ en: "Could you tell me what a typical day looks like?", vi: "Chị cho em biết một ngày làm việc điển hình thế nào được không ạ?" }],
        },
        {
          formula: "Would it be possible to + V … ?",
          vi: "Xin phép / đề nghị.",
          examples: [{ en: "Would it be possible to start in July, after my final exams?", vi: "Em có thể bắt đầu vào tháng Bảy, sau kỳ thi cuối, được không ạ?" }],
        },
        {
          formula: "Sorry, could you say that again, please? / Do you mean + … ?",
          vi: "Không nghe rõ / muốn xác nhận câu hỏi — hoàn toàn bình thường, cả trong IELTS.",
          examples: [{ en: "Sorry, do you mean my experience at university or at work?", vi: "Xin lỗi, ý chị là kinh nghiệm của em ở trường hay ở chỗ làm ạ?" }],
        },
      ],
    },
    {
      t: "table",
      caption: "Thẳng quá → lịch sự",
      head: ["Đừng nói", "Hãy nói"],
      rows: [
        ["What?", "Sorry, could you say that again, please?"],
        ["I want to know the salary.", "Could you tell me what the salary range is?"],
        ["When will you call me?", "Would it be possible to know when I might hear back from you?"],
        ["I can't work on Saturdays.", "I'm afraid I wouldn't be able to work on Saturdays."],
        ["No, I don't know that.", "I haven't used it yet, but I'd be keen to learn."],
        ["That's all.", "I think that covers everything. Thank you for your time."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai với câu hỏi gián tiếp",
      items: [
        "**Vẫn đảo:** ~~Could you tell me what **is the salary**?~~ → what **the salary is**. ~~I was wondering when **will I** start.~~ → when **I will / would** start.",
        "**Thừa do / does:** ~~Could you tell me how many people **does the team have**?~~ → how many people **the team has**.",
        "**Yes / No thì dùng whether / if:** ~~I was wondering could you…~~ → I was wondering **whether** you could…",
      ],
    },
    {
      t: "rule",
      formula: "I was wondering whether + S + could + V … · Could you tell me + Wh- + S + V … ?",
      vi: "Hỏi lịch sự = cụm mở đầu + trật tự câu KỂ (chủ ngữ trước động từ, không do / does / did).",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Band 5 và band 6: cùng một câu hỏi" },
    {
      t: "dialogue",
      title: "Câu trả lời band 5 (ước tính) — 41 từ",
      lines: [
        { who: "Interviewer", role: "examiner", text: "What would you say is your greatest strength?", vi: "Theo bạn điểm mạnh lớn nhất của mình là gì?" },
        { who: "Candidate", role: "candidate", text: "My strength is hard-working. I am very hard-working and responsible person. I always finish my work. Also I am friendly, I can work with team. My teacher say I am good student. So I think I can do this job well.", vi: "Điểm mạnh của tôi là chăm chỉ. Tôi là người rất chăm chỉ và có trách nhiệm. Tôi luôn làm xong việc. Tôi cũng thân thiện, tôi làm việc nhóm được. Giáo viên nói tôi là sinh viên giỏi. Nên tôi nghĩ tôi làm tốt việc này." },
      ],
    },
    {
      t: "dialogue",
      title: "Câu trả lời band 6 (ước tính) — 69 từ",
      lines: [
        { who: "Interviewer", role: "examiner", text: "What would you say is your greatest strength?", vi: "Theo bạn điểm mạnh lớn nhất của mình là gì?" },
        { who: "Candidate", role: "candidate", text: "I'd say I'm reliable. To give you an example, last semester our group leader fell ill a week before the deadline of our final project. I offered to take over the report, which meant working late for several nights, and in the end we handed it in on time and got eight out of ten. So when I say I'll do something, people know they can count on me.", vi: "Em nghĩ mình là người đáng tin cậy. Lấy ví dụ, kỳ trước trưởng nhóm em bị ốm một tuần trước hạn nộp đồ án cuối kỳ. Em nhận làm phần báo cáo, nghĩa là phải thức khuya vài đêm, và cuối cùng nhóm nộp đúng hạn, được tám trên mười điểm. Nên khi em nói sẽ làm việc gì, mọi người biết có thể trông cậy vào em." },
      ],
    },
    {
      t: "table",
      caption: "Khác nhau ở đâu? (4 tiêu chí Speaking)",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC**", "Sáu câu ngắn rời, liệt kê 4 tính từ; không có diễn biến", "Một ý xuyên suốt: tính từ → chuyện có đầu – giữa – cuối → câu chốt; mốc nối: To give you an example · in the end · So"],
        ["**LR**", "hard-working (×2), responsible, friendly, good — từ chung", "reliable · fell ill · take over · handed it in · count on me — cụm động từ của bài 1"],
        ["**GRA**", "~~My strength is hard-working~~ · thiếu mạo từ (~~responsible person~~) · ~~My teacher say~~ · ~~work with team~~", "quá khứ đơn kể chuyện · **, which meant** + V-ing · when I say I'll…, people know (that) they can…; trộn đơn + phức"],
        ["**P**", "Ngang đều, mọi từ nhấn như nhau", "Nhấn từ mang thông tin (**reliable**, **a week before**, **on time**, **eight out of ten**); ngắt trước “, which meant”"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Phát âm: ngữ điệu lịch sự" },
    {
      t: "p",
      text: "Cùng một câu “Could you say that again?” — nói **giọng phẳng, đi xuống nhanh** thì nghe như khó chịu; nói **bắt đầu cao hơn và lên nhẹ ở cuối** thì nghe lịch sự. Người Việt hay nói tiếng Anh với dải cao độ hẹp (đều đều), nên dễ bị nghe thành lạnh lùng dù từ ngữ đã rất lịch sự. Ba quy tắc dưới đây đủ dùng cho phỏng vấn và cho Speaking (tiêu chí P: “dùng được một số đặc điểm ngữ điệu”).",
    },
    {
      t: "table",
      head: ["Loại câu", "Ngữ điệu", "Ví dụ (↗ lên · ↘ xuống)"],
      rows: [
        ["Lời đề nghị / hỏi Yes–No lịch sự", "Bắt đầu **cao**, **lên nhẹ** ở từ cuối", "Could you tell me a bit ↗more? · Would it be ↗possible?"],
        ["Câu hỏi gián tiếp dài", "Cao ở cụm mở, **xuống rồi lên nhẹ** ở cuối (xuống–lên)", "I was ↘wondering whether you could tell me about the ↗team."],
        ["Xin nhắc lại", "**Lên** rõ — nếu xuống sẽ thành mệnh lệnh", "Sorry, could you say that a↗gain, please?"],
        ["Cảm ơn / chào kết", "**Xuống** ấm, không cụt", "Thank you for your ↘time. · It was nice to ↘meet you."],
        ["Tin không vui (từ chối nhẹ)", "I'm a↘fraid… nói **chậm lại**, xuống nhẹ", "I'm a↘fraid I wouldn't be able to start before ↘July."],
      ],
    },
    {
      t: "phatam",
      id: "t3d18-phat-am-lich-su",
      title: "Luyện phát âm: ngữ điệu lịch sự trong phỏng vấn",
      note: "Máy chấm từng âm; ngữ điệu bạn phải TỰ nghe lại bản ghi. Dòng 1–5: lên nhẹ ở cuối. Dòng 6–8: xuống ấm. Thử đọc mỗi câu một lần giọng phẳng, một lần có ngữ điệu — nghe khác nhau thế nào.",
      items: [
        { text: "Could you say that again, please?", ipa: "kʊd juː seɪ ðæt əɡen pliːz", vi: "Chị nói lại giúp em được không ạ?" },
        { text: "Could you tell me a bit more about the team?", ipa: "kʊd juː tel miː ə bɪt mɔː əbaʊt ðə tiːm", vi: "Chị nói thêm đôi chút về nhóm được không ạ?" },
        { text: "I was wondering whether you could explain the training programme.", ipa: "aɪ wəz wʌndərɪŋ weðə juː kʊd ɪkspleɪn ðə treɪnɪŋ prəʊɡræm", vi: "Em không biết chị có thể giải thích về chương trình đào tạo không ạ." },
        { text: "Would it be possible to start in July?", ipa: "wʊd ɪt biː pɒsəbl tə stɑːt ɪn dʒulaɪ", vi: "Em có thể bắt đầu vào tháng Bảy được không ạ?" },
        { text: "Do you mean my experience at university?", ipa: "duː juː miːn maɪ ɪkspɪəriəns ət juːnɪvɜːsəti", vi: "Ý chị là kinh nghiệm của em ở đại học ạ?" },
        { text: "I'm afraid I wouldn't be able to work on Saturdays.", ipa: "aɪm əfreɪd aɪ wʊdnt biː eɪbl tə wɜːk ɒn sætədeɪz", vi: "Em e là em không làm thứ Bảy được ạ." },
        { text: "I'd be happy to learn it.", ipa: "aɪd biː hæpi tə lɜːn ɪt", vi: "Em sẵn lòng học cái đó ạ." },
        { text: "Thank you very much for your time.", ipa: "θæŋk juː veri mʌtʃ fə jɔː taɪm", vi: "Cảm ơn chị rất nhiều vì đã dành thời gian." },
      ],
    },
    {
      t: "note",
      title: "Mẹo luyện ngữ điệu",
      items: [
        "Nghe lại bài phỏng vấn mẫu, chỉ chú ý **hai câu hỏi cuối của Minh** — nhại theo đúng cao độ (shadowing).",
        "Ghi âm câu “Could you say that again, please?” ba lần với ba ngữ điệu; hỏi một người bạn câu nào nghe dễ chịu nhất.",
        "Trong IELTS: xin nhắc lại câu hỏi **đúng ngữ điệu** không hề bị trừ điểm — im lặng 5 giây mới bị.",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện tập trước khi ghi âm" },
    {
      t: "quiz",
      id: "t3d18-noi-dien-khung",
      title: "Điền MỘT từ vào câu trả lời phỏng vấn (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "For the past year I've ______ working part-time as a tester.", answers: ["been"], hint: "hiện tại hoàn thành tiếp diễn" },
        { q: "That's ______ I'm now looking for a junior analyst role.", answers: ["why"], hint: "That's … = đó là lý do" },
        { q: "I'd ______ I'm conscientious.", answers: ["say"], hint: "mềm hơn I think" },
        { q: "______ than argue, I suggested we show it to two real users.", answers: ["Rather"], hint: "… than + V = thay vì" },
        { q: "I ______ to find it hard to speak up in meetings.", answers: ["used"], hint: "trước đây (giờ đã khác)" },
        { q: "To work ______ that, I joined the university debating club.", answers: ["on"], hint: "work … sth = cải thiện" },
        { q: "I was ______ whether you could tell me more about the training programme.", answers: ["wondering"], hint: "mở câu hỏi gián tiếp" },
        { q: "Would it be ______ to know when I might hear back from you?", answers: ["possible"], hint: "Would it be … to V?" },
      ],
    },
    {
      t: "mcq",
      id: "t3d18-noi-chon",
      title: "Chọn câu trả lời / cách nói đúng (6 câu)",
      items: [
        { q: "Câu mở đầu tốt nhất cho “Tell me about yourself”:", options: ["My name is Lan, I was born in 2004 and my family has five people.", "I'm a final-year IT student, and for the past six months I've been doing an internship in web testing.", "I like listening to music and travelling.", "I am student of year four of IT major."], correct: 1, why: "Hiện tại (final-year) + quá khứ gần liên quan tới việc (I've been doing an internship). A, C là kiểu Part 1; D sai ngữ pháp." },
        { q: "Câu hỏi gián tiếp nào ĐÚNG?", options: ["Could you tell me how many people are there in the team?", "Could you tell me how many people does the team have?", "Could you tell me how many people there are in the team?", "Could you tell me how many people is in the team?"], correct: 2, why: "Sau Could you tell me → trật tự câu kể: **there are**. A đảo; B thừa does; D sai chia động từ." },
        { q: "Người phỏng vấn hỏi về điểm yếu. Câu nào tốt nhất?", options: ["I don't have any weaknesses.", "My weakness is that I work too hard.", "I'm often late and I forget deadlines.", "I used to be nervous about presenting, so I've been practising in a speaking club, and I'm much more confident now."], correct: 3, why: "Điểm yếu thật + việc đang làm + kết quả. A, B thiếu thật; C chí mạng và không có cách sửa." },
        { q: "Bạn không nghe rõ câu hỏi. Nói gì?", options: ["Sorry, could you say that again, please?", "What?", "Repeat.", "I don't understand you."], correct: 0, why: "Lịch sự, đủ câu, ngữ điệu lên ở again. Ba câu kia cụt hoặc nghe như trách người hỏi." },
        { q: "Câu nào dùng đúng khung STAR?", options: ["I am a good team player and everyone likes me.", "Teamwork is very important in every company.", "When two teammates stopped talking to each other, I arranged a short meeting, and after that we finished the project two days early.", "I always work in a team at university."], correct: 2, why: "Có tình huống (When…), việc mình làm (I arranged…), kết quả có con số (two days early)." },
        { q: "“Where do you see yourself in five years?” — câu nào đúng ngữ pháp và hợp nhất?", options: ["In five years, I will be your boss.", "In five years' time, I'd like to be leading a small team.", "After five years, I am a manager.", "Five years later, I was a team leader."], correct: 1, why: "**I'd like to be + V-ing** — tham vọng nhưng khiêm tốn; đúng thì. A ngạo mạn; C, D sai thì." },
      ],
    },

    /* ── 10 ── */
    { t: "h", text: "10. Luyện nói — ghi âm, AI chấm" },
    {
      t: "p",
      text: "Chọn **một vị trí thật** bạn muốn xin (thực tập sinh lập trình, kiểm thử, hỗ trợ kỹ thuật…) và trả lời như đang phỏng vấn. **Bộ 1** (kiểu Part 1): mỗi câu 30–45 giây. **Bộ 2**: một câu chuyện STAR 1–1,5 phút — ghi chú 1 phút trước khi nói, như Part 2. **Bộ 3** (kiểu Part 3): mỗi câu 30–45 giây. Kết thúc bằng hai câu hỏi lịch sự cho nhà tuyển dụng.",
    },
    {
      t: "speak",
      id: "t3d18-noi-pv-1",
      part: "1",
      questions: [
        "Could you tell me a little about yourself?",
        "What attracted you to this position?",
        "What would you say is your greatest strength?",
        "What do you find most difficult about studying or working in English?",
      ],
    },
    {
      t: "speak",
      id: "t3d18-noi-pv-2",
      part: "2",
      questions: [
        "Tell me about a time when you solved a problem in a team. You should say: what the situation was, what you had to do, what you actually did, and explain what the result was and what you learned from it.",
      ],
    },
    {
      t: "speak",
      id: "t3d18-noi-pv-3",
      part: "3",
      questions: [
        "How do you usually deal with pressure or tight deadlines?",
        "What would you do if you disagreed with your manager's decision?",
        "Where do you see yourself in five years' time?",
        "Do you have any questions for us? (Ask two polite questions.)",
      ],
    },
    {
      t: "note",
      title: "Tự chấm trước khi xem điểm AI",
      items: [
        "Câu tự giới thiệu có đủ **ba bước** và ≤ 60 giây không?",
        "Điểm mạnh: **một** tính từ + chuyện có **kết quả**? Bạn nói “I” hay “we”?",
        "Câu chuyện STAR: có dùng **quá khứ đơn** nhất quán không (không lẫn hiện tại)?",
        "Hai câu hỏi cuối: trật tự **chủ ngữ + động từ** đúng chưa? Ngữ điệu có **lên nhẹ** không?",
        "Chép câu trả lời hay nhất vào **sổ Speaking** (Ngày 2) — mai tự đóng vai người phỏng vấn hỏi lại.",
      ],
    },
  ],
};
/* ─────────────────────────── Bài tập Ngày 18 ─────────────────────────── */

const T3D18_HOMEWORK: Lesson = {
  id: "t3d18-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 18",
  goal: "Củng cố từ vựng mạng xã hội – tính cách – quan hệ, cụm động từ, khung bài problem / solution (giải pháp khớp nguyên nhân, chuỗi hệ quả) và ngôn ngữ phỏng vấn lịch sự — 36 câu có đáp án + 3 câu nói.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Trước khi làm",
      items: [
        "Làm **không mở lại bài**; mục tiêu **≥ 29/36**.",
        "Phần I–IV: từ vựng (bài 1). Phần V: bài viết problem / solution (bài 2). Phần VI: phỏng vấn (bài 3).",
        "Xong bài tập này là bạn sẵn sàng cho **bài kiểm tra chặng Ngày 13–18** ngay bên dưới.",
      ],
    },
    { t: "h", text: "Phần I — Nghĩa từ (8 câu)" },
    {
      t: "mcq",
      id: "t3d18-bt-nghia",
      title: "I. Chọn từ hợp nghĩa",
      items: [
        { q: "Someone who always does what they promise is ______.", options: ["impulsive", "reliable", "arrogant", "anonymous"], correct: 1, why: "Nói là làm → **reliable**." },
        { q: "A person who thinks they are better than everyone else is ______.", options: ["modest", "considerate", "arrogant", "resilient"], correct: 2, why: "Tự cho mình hơn người → **arrogant**. modest là ngược lại." },
        { q: "The set of rules a platform uses to choose what you see is its ______.", options: ["algorithm", "engagement", "footprint", "notification"], correct: 0, why: "Bộ quy tắc chọn nội dung → **algorithm**." },
        { q: "Being bullied through messages and posts is called ______.", options: ["peer pressure", "misinformation", "screen time", "cyberbullying"], correct: 3, why: "Bắt nạt qua mạng → **cyberbullying**." },
        { q: "An agreement in which both sides give up something is a ______.", options: ["conflict", "compromise", "loyalty", "bond"], correct: 1, why: "Hai bên cùng nhượng → **compromise**." },
        { q: "Someone you know slightly but who is not a close friend is an ______.", options: ["influencer", "introvert", "acquaintance", "extrovert"], correct: 2, why: "Người quen sơ → **acquaintance**." },
        { q: "She double-checks everything and never leaves a job half done. She is ______.", options: ["conscientious", "self-centred", "sensitive", "narrow-minded"], correct: 0, why: "Kỹ lưỡng, tận tâm → **conscientious**." },
        { q: "He bought a motorbike without thinking about the cost. That was ______.", options: ["sensible", "trustworthy", "assertive", "impulsive"], correct: 3, why: "Làm theo hứng, không suy nghĩ → **impulsive**. sensible là ngược lại." },
      ],
    },
    { t: "h", text: "Phần II — Cụm động từ (8 câu)" },
    {
      t: "quiz",
      id: "t3d18-bt-cum",
      title: "II. Điền MỘT tiểu từ (up / out / down / off / on / over / across / apart)",
      kind: "fill",
      items: [
        { q: "I'm sorry I let you ______ — I should have called.", answers: ["down"], hint: "let sb … = làm thất vọng" },
        { q: "We used to be close, but we drifted ______ after she moved abroad.", answers: ["apart"], hint: "dần xa nhau" },
        { q: "The government plans to phase ______ coal power stations.", answers: ["out"], hint: "loại bỏ dần" },
        { q: "Who came ______ with the idea of a phone-free day?", answers: ["up"], hint: "come … with = nghĩ ra" },
        { q: "The match was called ______ because of the storm.", answers: ["off"], hint: "huỷ" },
        { q: "It took me months to get ______ the disappointment.", answers: ["over"], hint: "vượt qua" },
        { q: "He comes ______ as rude, but he is just shy.", answers: ["across"], hint: "tạo ấn tượng" },
        { q: "You can count ______ me — I'll be there at seven.", answers: ["on"], hint: "trông cậy vào" },
      ],
    },
    { t: "h", text: "Phần III — Dạng từ (6 câu)" },
    {
      t: "quiz",
      id: "t3d18-bt-dang-tu",
      title: "III. Viết dạng đúng của từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "Short videos are highly ______ (ADDICT).", answers: ["addictive"], hint: "vật → tính từ nào?" },
        { q: "Many old people live in ______ (ISOLATE).", answers: ["isolation"], hint: "sau in → danh từ" },
        { q: "Thank you for being so ______ (CONSIDER) when I was ill.", answers: ["considerate"], hint: "chu đáo — không phải “đáng kể”" },
        { q: "There was a ______ (UNDERSTAND) about the time of the meeting.", answers: ["misunderstanding"], hint: "tiền tố mis-" },
        { q: "______ (LOYAL) to one company for life is less common today.", answers: ["Loyalty"], hint: "chủ ngữ → danh từ" },
        { q: "Children need regular ______ (INTERACT) with other children.", answers: ["interaction"], hint: "danh từ" },
      ],
    },
    { t: "h", text: "Phần IV — Dịch câu Task 2 / Part 3 (6 câu)" },
    {
      t: "quiz",
      id: "t3d18-bt-dich",
      title: "IV. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "While…, … · stem from · , which in turn · To address… could · If + V2, would · I'd say I'm…",
      items: [
        { q: "Mặc dù mạng xã hội giúp chúng ta giữ liên lạc, nó có thể gây nghiện.", answers: ["While social media helps us stay in touch, it can be addictive.", "Although social media helps us stay in touch, it can be addictive.", "While social media helps us to stay in touch, it can be addictive.", "Although social media helps us to stay in touch, it can be addictive.", "While social media helps us keep in touch, it can be addictive.", "Although social media helps us keep in touch, it can be addictive."], hint: "While / Although · helps us stay in touch · addictive" },
        { q: "Vấn đề này bắt nguồn chủ yếu từ áp lực bạn bè.", answers: ["This problem stems mainly from peer pressure.", "This problem mainly stems from peer pressure.", "The problem stems mainly from peer pressure."], hint: "stems mainly from · peer pressure" },
        { q: "Thanh thiếu niên ngủ ít hơn, điều này đến lượt nó ảnh hưởng tới kết quả học tập của họ.", answers: ["Teenagers sleep less, which in turn affects their results at school.", "Teenagers sleep less, which in turn affects their school results.", "Teenagers sleep less, which in turn affects their academic results.", "Teenagers sleep less, which in turn affects their academic performance.", "Teenagers sleep less, which in turn affects their performance at school."], hint: "sleep less · , which in turn affects" },
        { q: "Để xử lý vấn đề này, các trường có thể lập các câu lạc bộ không điện thoại.", answers: ["To address this problem, schools could set up phone-free clubs.", "To tackle this problem, schools could set up phone-free clubs.", "To address this issue, schools could set up phone-free clubs.", "To address this problem, schools can set up phone-free clubs."], hint: "To address this problem · could set up · phone-free clubs" },
        { q: "Nếu cha mẹ làm gương tốt, con cái sẽ dùng điện thoại ít hơn. (giả định — loại 2)", answers: ["If parents set a good example, children would use their phones less.", "If parents set a good example, their children would use their phones less.", "If parents set a good example, children would use phones less.", "If parents set a good example, their children would use phones less."], hint: "set – set – set · would use their phones less" },
        { q: "Em nghĩ mình là người đáng tin cậy và cởi mở.", answers: ["I'd say I'm reliable and open-minded.", "I would say I am reliable and open-minded.", "I'd say I am reliable and open-minded.", "I would say I'm reliable and open-minded."], hint: "I'd say I'm · reliable · open-minded" },
      ],
    },
    { t: "h", text: "Phần V — Bài viết problem / solution (4 câu)" },
    {
      t: "mcq",
      id: "t3d18-bt-viet",
      title: "V. Đọc đề, giải pháp khớp, chuỗi hệ quả",
      items: [
        { q: "“Many people today do not get enough sleep. What are the causes of this? What effects does it have?” — Thân bài 2 viết gì?", options: ["Giải pháp", "Hậu quả", "Nguyên nhân", "Ý kiến của bạn"], correct: 1, why: "Câu hỏi thứ hai là **effects** → hậu quả. Đề không hỏi giải pháp." },
        { q: "Nguyên nhân: “Students cheat because exams decide their whole future.” Giải pháp khớp nhất:", options: ["Schools should install more cameras.", "Parents should buy fewer phones.", "Schools could spread marks across projects and smaller tests, so no single exam matters so much.", "Students should sleep earlier."], correct: 2, why: "Nguyên nhân là **một kỳ thi quyết định tất cả** → chia điểm ra nhiều bài để giảm sức nặng. Camera chỉ chữa triệu chứng." },
        { q: "Chọn câu ĐÚNG ngữ pháp:", options: ["Although phones are useful, but they distract students.", "Despite phones are useful, they distract students.", "Despite of the usefulness of phones, they distract students.", "Although phones are useful, they distract students."], correct: 3, why: "Although + mệnh đề, không kèm but. Despite + danh từ (không of, không mệnh đề)." },
        { q: "Chọn chuỗi hệ quả viết đúng:", options: ["Rents are rising, which forces young people to live with their parents for longer.", "Rents are rising, it forces young people to live with their parents for longer.", "Rents are rising, which force young people live with their parents for longer.", "Rents are rising, that forces young people to live with their parents for longer."], correct: 0, why: "**, which + V số ít** (forces) + force sb **to V**. B comma splice; C sai chia + thiếu to; D that sau dấu phẩy." },
      ],
    },
    { t: "h", text: "Phần VI — Phỏng vấn lịch sự (4 câu)" },
    {
      t: "quiz",
      id: "t3d18-bt-phong-van",
      title: "VI. Viết lại thành câu hỏi gián tiếp / câu lịch sự — bắt đầu bằng từ cho sẵn",
      kind: "translate",
      grammar: "Could you tell me + Wh- + S + V · I was wondering whether + S + could + V",
      items: [
        { q: "What is the salary? → Could you tell me …", answers: ["Could you tell me what the salary is?"], hint: "what + S + V" },
        { q: "When does the job start? → Could you tell me …", answers: ["Could you tell me when the job starts?", "Could you tell me when the job will start?"], hint: "bỏ does, thêm -s" },
        { q: "Can I work from home? → I was wondering whether …", answers: ["I was wondering whether I could work from home.", "I was wondering whether I can work from home."], hint: "whether + I could" },
        { q: "How many people are there in the team? → Could you tell me …", answers: ["Could you tell me how many people there are in the team?", "Could you tell me how many people are in the team?"], hint: "there are (không đảo)" },
      ],
    },
    { t: "h", text: "Nói thêm — 3 câu (ghi âm, AI chấm)" },
    {
      t: "p",
      text: "Câu 1 kiểu phỏng vấn (45–60 giây, khung Hiện tại – Quá khứ – Tương lai hoặc STAR). Câu 2–3 kiểu Part 3 (30–45 giây, nêu **một nguyên nhân + chuỗi hệ quả** hoặc **một giải pháp + vì sao hiệu quả**).",
    },
    {
      t: "speak",
      id: "t3d18-bt-noi",
      part: "3",
      questions: [
        "Tell me about a weakness you have and what you are doing to improve it.",
        "Why do some young people find it difficult to make real friends nowadays?",
        "What could schools do to reduce the time students spend on social media?",
      ],
    },
  ],
};

/* ─────────────────────────── Kiểm tra chặng (Ngày 13–18) ─────────────────────────── */

const T3D18_REVIEW: Lesson = {
  id: "t3d18-kiem-tra",
  kind: "review",
  title: "Kiểm tra chặng (Ngày 13–18)",
  goal: "Tự đo đã nắm chắc Ngày 13–18 của Tập 3 chưa — bị động mọi thì và với modal, điều kiện loại 2 – 3 và câu ước, mệnh đề quan hệ không xác định và rút gọn; từ vựng AWL sublist 5 – quyền lợi lao động, kinh doanh – kinh tế, mạng xã hội – tính cách; nghe Part 4 Note completion và Part 3 Flow-chart + chọn TWO; đọc chọn TWO, Table, Flow-chart, Short answer; viết pie chart hai năm và bài ưu – nhược; nói Part 2 nơi chốn, Part 3 giả định, phỏng vấn — biết chính xác phải ôn lại Ngày nào.",
  minutes: 175,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra chặng 3 của Tập 3",
      items: [
        "Gom kiến thức **sáu ngày** (Ngày 13–18): 8 phần — ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm.",
        "**Đạt** khi **mỗi phần ≥ 70 %** (ngưỡng ghi ở từng tiêu đề). Phần nào chưa đạt → ôn đúng **Ngày được chỉ** rồi làm lại riêng phần đó; không cần làm lại cả bài.",
        "Làm **một mạch, không mở lại bài cũ**. Phần Nghe: mỗi bản ghi nghe **một lần**. Phần Đọc: bấm giờ **22 phút**. Phần Viết: Task 1 **20 phút**, Task 2 **40 phút**.",
        "Tổng thời gian khoảng **3 giờ** — có thể chia hai buổi: Phần 1–5 (làm trên máy, ~95 phút) và Phần 6–8 (viết, nói, ~80 phút).",
        "Sau bài này là **Ngày 19–24** (tường thuật, nhượng bộ – nguyên nhân, mệnh đề danh ngữ, bảng số liệu, biểu đồ kết hợp). Đề 4 trên Online Test (thi giữa tập) nên làm **trước** bài này nếu bạn chưa làm sau Ngày 15.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng Ngày 13–18 đã học gì",
      center: "Ngày 13–18",
      branches: [
        { label: "Ngữ pháp", items: ["N13 bị động mọi thì + modal", "N15 điều kiện 2 – 3 · wish", "N17 quan hệ không xác định · rút gọn"] },
        { label: "Từ vựng", items: ["N14 AWL 5 · quyền lợi lao động", "N16 kinh doanh · kinh tế", "N18 mạng xã hội · tính cách · cụm động từ"] },
        { label: "Đọc", items: ["N13 chọn TWO / THREE", "N15 Table · Short answer", "N17 Flow-chart · Diagram"] },
        { label: "Viết", items: ["N14 ưu – nhược · positive / negative", "N16 pie chart hai năm", "N18 problem / solution"] },
        { label: "Nghe", items: ["N13 Part 4 Note", "N16 đề nhỏ Part 1 + 2", "N17 Part 3 Flow-chart · TWO"] },
        { label: "Nói", items: ["N14 Part 2 nơi chốn · Part 3 ưu – nhược", "N15 Part 3 giả định", "N18 phỏng vấn"] },
      ],
    },
    {
      t: "table",
      caption: "Tám phần — số câu, ngưỡng đạt, ngày ôn",
      head: ["Phần", "Số câu", "Đạt khi", "Trượt thì ôn"],
      rows: [
        ["1. Ngữ pháp", "15 + 9", "≥ 17/24", "Ngày 13, 15, 17"],
        ["2. Từ vựng", "12 + 6", "≥ 13/18", "Ngày 14, 16, 18"],
        ["3. Dịch", "6", "≥ 5/6", "bài dịch 💡 Ngày 13, 15, 17"],
        ["4. Nghe", "6 + 7", "≥ 9/13", "Ngày 13, 17 (và 16)"],
        ["5. Đọc", "13", "≥ 9/13", "Ngày 13, 15, 17"],
        ["6. Viết", "6 + 2 bài", "≥ 5/6 · AI ≥ band 5.5", "Ngày 14, 16, 18"],
        ["7. Nói", "1 thẻ + 3 + 2 câu", "AI ≥ band 5.5", "Ngày 14, 15, 18"],
        ["8. Phát âm", "8", "≥ 6/8", "mục phát âm Ngày 13–18"],
      ],
    },

    /* ── Phần 1 ── */
    { t: "h", text: "Phần 1 — Ngữ pháp (15 + 9 câu · đạt ≥ 17/24 · trượt thì ôn Ngày 13, 15, 17)" },
    {
      t: "mcq",
      id: "t3d18-kt-ngu-phap-chon",
      title: "1a. Chọn đáp án đúng (15 câu)",
      items: [
        { q: "The new metro line ______ to the public next March.", options: ["will open by", "will be opened", "will opened", "is opening by"], correct: 1, why: "Bị động tương lai: **will be + V3** (Ngày 13 mục 2)." },
        { q: "Be quiet, please. The exam papers ______ at the moment.", options: ["are marking", "have marked", "are being marked", "are been marked"], correct: 2, why: "Bị động hiện tại tiếp diễn: **am / is / are being + V3**." },
        { q: "By the time we arrived, all the tickets ______.", options: ["had been sold", "had sold", "were selling", "have been sold"], correct: 0, why: "Việc xong trước một mốc quá khứ, bị động: **had been + V3**." },
        { q: "More money should ______ on public transport.", options: ["spend", "be spending", "spent", "be spent"], correct: 3, why: "Bị động với modal: **modal + be + V3** (Ngày 13 mục 3)." },
        { q: "The accident could ______ if the road had been repaired.", options: ["be avoided", "have been avoided", "have avoided", "avoid"], correct: 1, why: "Việc trong quá khứ lẽ ra đã tránh được (nhưng không), bị động: **could have been + V3** (Ngày 13 mục 3)." },
        { q: "She ______ a scholarship by the university last year.", options: ["offered", "has offered", "was offered", "was offering"], correct: 2, why: "Động từ hai tân ngữ ở bị động: người nhận làm chủ ngữ — **She was offered a scholarship** (Ngày 13 mục 5)." },
        { q: "Chọn câu ĐÚNG.", options: ["The accident happened at midnight.", "The accident was happened at midnight.", "The accident has been happened at midnight.", "The accident was happen at midnight."], correct: 0, why: "**happen** là nội động từ — không có bị động (Ngày 13 mục 7)." },
        { q: "If I ______ more free time, I would learn Japanese.", options: ["have", "would have", "had had", "had"], correct: 3, why: "Điều kiện loại 2 (trái hiện tại): **If + V2, would + V** (Ngày 15 mục 2)." },
        { q: "If we had left earlier, we ______ the train.", options: ["wouldn't miss", "wouldn't have missed", "didn't miss", "hadn't missed"], correct: 1, why: "Điều kiện loại 3 (trái quá khứ): **If + had V3, would have + V3** (Ngày 15 mục 3)." },
        { q: "I wish I ______ speak English more fluently.", options: ["can", "will", "could", "would"], correct: 2, why: "Ước trái hiện tại: **wish + V2** → can lùi thành **could** (Ngày 15 mục 4)." },
        { q: "I failed the test. I wish I ______ harder.", options: ["had studied", "studied", "would study", "have studied"], correct: 0, why: "Ước trái **quá khứ**: **wish + had V3**." },
        { q: "I'd rather you ______ in here, if you don't mind.", options: ["don't smoke", "not smoke", "won't smoke", "didn't smoke"], correct: 3, why: "**would rather + S + V2** — muốn người KHÁC làm / không làm gì (Ngày 15 mục 5)." },
        { q: "My hometown, ______ is famous for its tea, has changed a lot.", options: ["that", "which", "where", "who"], correct: 1, why: "Không xác định (có phẩy), cần chủ ngữ cho is → **which**; không dùng that sau dấu phẩy (Ngày 17 mục 2)." },
        { q: "The firm employs 200 people, most of ______ are engineers.", options: ["them", "which", "whom", "who"], correct: 2, why: "Lượng từ + **of whom** cho người (Ngày 17 mục 4)." },
        { q: "The number of people ______ online has doubled.", options: ["shopping", "shopped", "shop", "are shopping"], correct: 0, why: "Rút gọn chủ động: people **who shop** → people **shopping** (Ngày 17 mục 6)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-ngu-phap-dien",
      title: "1b. Viết dạng đúng của động từ trong ngoặc / điền MỘT từ (9 câu)",
      kind: "fill",
      items: [
        { q: "The report ______ (write) by a team of experts last year.", answers: ["was written"], hint: "bị động quá khứ đơn" },
        { q: "Smoking ______ (should / ban) in all public places.", answers: ["should be banned"], hint: "modal + be + V3" },
        { q: "The road ______ (repair) at the moment, so we have to use another route.", answers: ["is being repaired"], hint: "bị động tiếp diễn" },
        { q: "If I ______ (be) you, I would apply for the job.", answers: ["were", "was"], hint: "loại 2 — chuẩn là were" },
        { q: "If she ______ (not miss) the bus, she would have arrived on time.", answers: ["had not missed", "hadn't missed"], hint: "loại 3" },
        { q: "I wish it ______ (not rain) so much in my city.", answers: ["did not rain", "didn't rain"], hint: "ước trái hiện tại" },
        { q: "The goods ______ (produce) in this factory are exported to Japan.", answers: ["produced"], hint: "rút gọn bị động" },
        { q: "Sales rose sharply, ______ (reach) a peak of 5 million in 2020.", answers: ["reaching"], hint: ", V-ing" },
        { q: "Tourism creates thousands of jobs, ______ helps the local economy. (MỘT từ)", answers: ["which"], hint: "thay cả ý phía trước" },
      ],
    },

    /* ── Phần 2 ── */
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 14, 16, 18)" },
    {
      t: "mcq",
      id: "t3d18-kt-tu-vung-chon",
      title: "2a. Chọn từ đúng (12 câu)",
      items: [
        { q: "The lowest hourly pay that employers are allowed by law to offer is the ______.", options: ["pension", "minimum wage", "bonus", "turnover"], correct: 1, why: "Lương tối thiểu theo luật → **minimum wage** (Ngày 14)." },
        { q: "After forty years of work, he now lives on a state ______.", options: ["internship", "tuition", "pension", "revenue"], correct: 2, why: "Lương hưu → **pension** (Ngày 14)." },
        { q: "People who lose their jobs can claim unemployment ______ for six months.", options: ["benefit", "leave", "profit", "tariff"], correct: 0, why: "**unemployment benefit** = trợ cấp thất nghiệp (Ngày 14)." },
        { q: "Flexible hours ______ parents to combine work and childcare.", options: ["decline", "pursue", "monitor", "enable"], correct: 3, why: "**enable sb to V** = giúp ai có thể… (AWL sublist 5, Ngày 14)." },
        { q: "We need a ______ solution, not one that only works for a year or two.", options: ["marginal", "sustainable", "symbolic", "liberal"], correct: 1, why: "Bền vững, duy trì được lâu → **sustainable** (AWL 5)." },
        { q: "After graduating, she decided to ______ a career in medicine.", options: ["alter", "reject", "pursue", "generate"], correct: 2, why: "**pursue a career** = theo đuổi sự nghiệp (AWL 5 + collocation, Ngày 14)." },
        { q: "A period when the economy shrinks and many people lose their jobs is a ______.", options: ["recession", "boom", "merger", "tariff"], correct: 0, why: "Suy thoái → **recession** (Ngày 16). boom là ngược lại." },
        { q: "When prices rise year after year, economists talk about ______.", options: ["productivity", "prosperity", "outsourcing", "inflation"], correct: 3, why: "Lạm phát → **inflation** (Ngày 16)." },
        { q: "Many firms ______ customer service to companies in cheaper countries.", options: ["import", "outsource", "invest", "exploit"], correct: 1, why: "Thuê ngoài → **outsource** (Ngày 16)." },
        { q: "The money a company has left after paying all its costs is its ______.", options: ["turnover", "market share", "profit", "workforce"], correct: 2, why: "Lợi nhuận → **profit**. turnover = doanh thu (chưa trừ chi phí) (Ngày 16)." },
        { q: "False stories that spread online are a form of ______.", options: ["misinformation", "engagement", "companionship", "empathy"], correct: 0, why: "Thông tin sai → **misinformation** (Ngày 18)." },
        { q: "The team ______ a clever way to cut costs.", options: ["came down with", "put up with", "fell out with", "came up with"], correct: 3, why: "**come up with** = nghĩ ra (Ngày 18)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-tu-vung-dang",
      title: "2b. Viết dạng đúng của từ trong ngoặc (6 câu)",
      kind: "fill",
      items: [
        { q: "The rapid ______ (EXPAND) of the city has put pressure on housing.", answers: ["expansion"], hint: "sau the rapid → danh từ (AWL 5)" },
        { q: "Economic ______ (STABLE) attracts foreign investment.", answers: ["stability"], hint: "danh từ (AWL 5)" },
        { q: "Small shops cannot match the prices of their larger ______ (COMPETE).", answers: ["competitors"], hint: "danh từ chỉ người / công ty, số nhiều" },
        { q: "New machines have increased the ______ (PRODUCT) of the factory.", answers: ["productivity"], hint: "năng suất" },
        { q: "Working from home can lead to social ______ (ISOLATE).", answers: ["isolation"], hint: "danh từ" },
        { q: "She is the most ______ (RELY) member of the team.", answers: ["reliable"], hint: "tính từ" },
      ],
    },

    /* ── Phần 3 ── */
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
    {
      t: "quiz",
      id: "t3d18-kt-dich",
      title: "3. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "bị động · modal + be + V3 · điều kiện loại 2 / 3 · mệnh đề không xác định · , which",
      items: [
        { q: "Cây cầu này được xây vào năm 1990.", answers: ["This bridge was built in 1990."], hint: "was built" },
        { q: "Cần chi nhiều tiền hơn cho giáo dục. (bắt đầu bằng More money)", answers: ["More money should be spent on education.", "More money needs to be spent on education.", "More money must be spent on education."], hint: "should be spent on" },
        { q: "Nếu tôi có nhiều tiền hơn, tôi sẽ mở công ty riêng.", answers: ["If I had more money, I would set up my own company.", "If I had more money, I would set up my own business.", "If I had more money, I would start my own company.", "If I had more money, I would start my own business.", "If I had more money, I would open my own company.", "If I had more money, I would open my own business."], hint: "If I had · I would set up my own company" },
        { q: "Nếu (hồi đó) tôi học chăm hơn thì tôi đã đỗ kỳ thi rồi. (trái quá khứ)", answers: ["If I had studied harder, I would have passed the exam.", "If I had studied harder, I would have passed the test.", "If I had worked harder, I would have passed the exam."], hint: "If I had studied · would have passed" },
        { q: "Anh trai tôi, người làm việc ở Nhật, sẽ về nhà vào tháng tới.", answers: ["My brother, who works in Japan, will come home next month.", "My brother, who works in Japan, will come back home next month.", "My brother, who works in Japan, is coming home next month.", "My brother, who works in Japan, will return home next month.", "My older brother, who works in Japan, will come home next month.", "My elder brother, who works in Japan, will come home next month.", "My brother, who is working in Japan, will come home next month."], hint: "who works in Japan · will come home" },
        { q: "Thất nghiệp đang tăng, điều này dẫn tới nhiều vấn đề xã hội.", answers: ["Unemployment is rising, which leads to many social problems.", "Unemployment is increasing, which leads to many social problems.", "Unemployment is rising, which causes many social problems.", "Unemployment is rising, which results in many social problems.", "Unemployment is increasing, which causes many social problems.", "Unemployment is rising, which is leading to many social problems."], hint: "is rising · , which leads to" },
      ],
    },

    /* ── Phần 4 ── */
    { t: "h", text: "Phần 4 — Nghe (6 + 7 câu · đạt ≥ 9/13 · trượt thì ôn Ngày 13, 17)" },
    {
      t: "p",
      text: "**Recording 1 — Part 4 (ôn Ngày 13).** Bạn nghe đoạn đầu một bài giảng về **đảo nhiệt đô thị** (urban heat island — hiện tượng thành phố nóng hơn vùng quanh nó). Đọc trang ghi chú 30 giây, nghe **một lần**. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "The urban heat island — lecture notes",
      head: ["Mục", "Ghi chú"],
      rows: [
        ["Definition", "city centres are warmer than the surrounding countryside — at night by up to **1 ______** degrees"],
        ["Cause 1", "dark surfaces such as roads and **2 ______** take in heat during the day"],
        ["Cause 2", "shortage of **3 ______**, which normally cool the air"],
        ["Cause 3", "heat given off by **4 ______** and air conditioning"],
        ["Effect", "greater demand for **5 ______** in summer; health risk for elderly people"],
        ["Solution", "painting roofs **6 ______**; planting along streets"],
      ],
    },
    {
      t: "listen",
      id: "t3d18-kt-nghe-bai-giang",
      title: "The urban heat island",
      dan: { so: "Day 18, Checkpoint Recording 1 (Listening Part 4)", boiCanh: "part of a lecture about temperatures in cities.", cau: [1, 6] },
      note: "Khoảng 2 phút, một giọng: giảng viên (Anh, nam). Nghe MỘT lần.",
      lines: [
        { voice: "uk-nam", text: "Good afternoon. Today I want to look at a problem that affects almost everyone living in a large town: the urban heat island. The term simply means that the centre of a city is warmer than the countryside around it. During the day the difference is usually small, perhaps one or two degrees, but at night, when the countryside cools quickly, a big city can be up to seven degrees warmer.", vi: "Chào các bạn. Hôm nay tôi muốn xem xét một vấn đề ảnh hưởng tới gần như mọi người sống ở thị trấn lớn: đảo nhiệt đô thị. Thuật ngữ này chỉ đơn giản nghĩa là trung tâm thành phố ấm hơn vùng nông thôn quanh nó. Ban ngày chênh lệch thường nhỏ, có lẽ một hai độ, nhưng ban đêm, khi nông thôn nguội nhanh, một thành phố lớn có thể ấm hơn tới bảy độ." },
        { voice: "uk-nam", text: "So what causes it? There are three main factors. The first is the materials that cities are built from. Dark surfaces, in particular roads and roofs, take in the sun's heat all day and then release it slowly after sunset. The second factor is what cities lack, and that is trees. In the countryside, water evaporating from leaves cools the air, a little like sweat cooling your skin. Where trees have been replaced by concrete, that natural cooling is lost.", vi: "Vậy điều gì gây ra nó? Có ba yếu tố chính. Thứ nhất là vật liệu xây nên thành phố. Các bề mặt sẫm màu, đặc biệt là đường và mái nhà, hấp thụ nhiệt mặt trời cả ngày rồi nhả ra từ từ sau khi mặt trời lặn. Yếu tố thứ hai là thứ thành phố thiếu, đó là cây. Ở nông thôn, nước bốc hơi từ lá làm mát không khí, hơi giống mồ hôi làm mát da. Nơi cây bị thay bằng bê tông, sự làm mát tự nhiên đó mất đi." },
        { voice: "uk-nam", text: "The third factor is the heat that we produce ourselves. A great deal is given off by engines, and, rather unfairly, by air conditioning, which cools the inside of a building by pushing hot air out into the street.", vi: "Yếu tố thứ ba là nhiệt do chính chúng ta tạo ra. Rất nhiều nhiệt toả ra từ động cơ, và, hơi trớ trêu, từ điều hoà, thứ làm mát bên trong toà nhà bằng cách đẩy khí nóng ra đường." },
        { voice: "uk-nam", text: "The effects are serious. As temperatures rise, so does the demand for electricity, which reaches its highest point on summer afternoons, and hot nights are a real danger to elderly people. Fortunately, some solutions are cheap. One city found that simply painting roofs white, not green as was first proposed, lowered the temperature inside by several degrees. Planting along streets takes longer but lasts for generations.", vi: "Hậu quả thì nghiêm trọng. Khi nhiệt độ tăng, nhu cầu điện cũng tăng, đạt đỉnh vào các buổi chiều mùa hè, và những đêm nóng là mối nguy thật sự với người cao tuổi. May là một số giải pháp khá rẻ. Một thành phố nhận thấy chỉ cần sơn mái nhà màu trắng, chứ không phải xanh lá như đề xuất ban đầu, đã hạ nhiệt độ bên trong vài độ. Trồng cây dọc phố mất thời gian hơn nhưng bền qua nhiều thế hệ." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-nghe-bai-giang-cau",
      title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) at night by up to ______ degrees", answers: ["7", "seven"], hint: "có hai con số — cái nào là ban đêm?" },
        { q: "(2) roads and ______", answers: ["roofs"], hint: "dark surfaces, in particular…" },
        { q: "(3) shortage of ______", answers: ["trees"], hint: "what cities lack" },
        { q: "(4) heat given off by ______", answers: ["engines"], hint: "the third factor" },
        { q: "(5) greater demand for ______", answers: ["electricity"], hint: "so does the demand for…" },
        { q: "(6) painting roofs ______", answers: ["white"], hint: "một màu bị bác" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Recording 1",
      items: [
        "(1) **7** — “at night… up to **seven** degrees warmer”. Bẫy: “one or two degrees” là ban **ngày**.",
        "(2) **roofs** — “in particular roads and **roofs**”. (3) **trees** — “what cities lack, and that is **trees**”; shortage of = lack. Bẫy: leaves, concrete.",
        "(4) **engines** — “A great deal **is given off by engines**” (bị động — Ngày 13). (5) **electricity** — “so does the demand for **electricity**”.",
        "(6) **white** — “painting roofs **white, not green** as was first proposed”. Bẫy đổi ý.",
        "Để ý các mệnh đề “, which” trong bài giảng: “air conditioning**, which cools**…” · “electricity**, which reaches** its highest point…” — nghe chỗ ngắt trước which (Ngày 17).",
      ],
    },
    {
      t: "p",
      text: "**Recording 2 — Part 3 (ôn Ngày 17).** Hai sinh viên **Hana** và **Leo** bàn về cuộc khảo sát việc làm thêm của sinh viên. **Questions 7–8:** chọn **TWO** (mỗi chữ cái 1 điểm). **Questions 9–12:** hoàn thành sơ đồ bằng chữ cái **A–F**. **Question 13:** chọn A, B hoặc C. Đọc đề 40 giây, nghe **một lần**.",
    },
    {
      t: "table",
      caption: "Questions 7–8 — Which TWO topics will the survey cover?",
      head: ["Chữ", "Phương án"],
      rows: [
        ["**A**", "the number of hours students work each week"],
        ["**B**", "the type of job they do"],
        ["**C**", "how they spend their wages"],
        ["**D**", "the effect of work on their grades"],
        ["**E**", "their reasons for working"],
      ],
    },
    {
      t: "table",
      caption: "Questions 9–12 — hộp lựa chọn",
      head: ["A", "B", "C", "D", "E", "F"],
      rows: [["email", "group", "library", "questionnaire", "social media", "tutor"]],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Running the survey",
      steps: [
        { label: "Write a first draft of the **9 ______**" },
        { label: "Try it out on a small **10 ______** of classmates" },
        { label: "Get approval from their **11 ______**" },
        { label: "Send the link to all first-year students by **12 ______**" },
        { label: "Analyse the answers in a spreadsheet" },
      ],
    },
    {
      t: "listen",
      id: "t3d18-kt-nghe-khao-sat",
      title: "A survey on students' part-time work",
      dan: { so: "Day 18, Checkpoint Recording 2 (Listening Part 3)", boiCanh: "two students, Hana and Leo, planning a survey about part-time work.", cau: [7, 13] },
      note: "Khoảng 2 phút, hai giọng: Hana (Canada, nữ) · Leo (New Zealand, nam). Nghe MỘT lần.",
      lines: [
        { who: "Hana", voice: "ca-nu", text: "OK, Leo, the survey. We can't ask about everything, so what goes in? I think the number of hours people work each week is essential.", vi: "Nào Leo, cuộc khảo sát. Mình không hỏi hết mọi thứ được, vậy cho gì vào? Mình nghĩ số giờ mọi người làm mỗi tuần là thiết yếu." },
        { who: "Leo", voice: "nz-nam", text: "Agreed, that's the core of it. What about the kind of job they do, you know, cafes, shops, tutoring?", vi: "Đồng ý, đó là phần lõi. Còn loại công việc họ làm thì sao, kiểu quán cà phê, cửa hàng, gia sư?" },
        { who: "Hana", voice: "ca-nu", text: "I'd like to, but we'd end up with twenty categories and nothing to compare. Let's drop it.", vi: "Mình cũng muốn, nhưng rốt cuộc sẽ có hai mươi loại mà chẳng so sánh được gì. Bỏ đi." },
        { who: "Leo", voice: "nz-nam", text: "Fair enough. I thought we could ask how they spend the money they earn, but actually that feels a bit too personal.", vi: "Cũng được. Mình tưởng có thể hỏi họ tiêu tiền kiếm được thế nào, nhưng thật ra cái đó hơi riêng tư quá." },
        { who: "Hana", voice: "ca-nu", text: "Yes, people won't answer honestly. What we really need is whether working affects their grades. That's the whole point of the project.", vi: "Ừ, mọi người sẽ không trả lời thật. Cái mình thật sự cần là việc đi làm có ảnh hưởng điểm số không. Đó là toàn bộ mục đích của đề tài." },
        { who: "Leo", voice: "nz-nam", text: "Definitely, that has to be in. And their reasons for working?", vi: "Chắc chắn rồi, cái đó phải có. Còn lý do họ đi làm?" },
        { who: "Hana", voice: "ca-nu", text: "Last year's group already covered that, so there's no need to repeat it.", vi: "Nhóm năm ngoái đã làm phần đó rồi, nên không cần lặp lại." },
        { who: "Leo", voice: "nz-nam", text: "Right. So, the steps. First of all, I'll write a first draft of the questionnaire this weekend.", vi: "Được. Vậy các bước nhé. Trước hết, cuối tuần này mình sẽ viết bản nháp đầu của bảng hỏi." },
        { who: "Hana", voice: "ca-nu", text: "Good. Once that's done, we should try it out on a small group, five or six people from our class, to see whether any questions are confusing.", vi: "Tốt. Xong bước đó, mình nên thử trên một nhóm nhỏ, năm sáu bạn trong lớp, xem có câu nào khó hiểu không." },
        { who: "Leo", voice: "nz-nam", text: "And then we send it out?", vi: "Rồi mình gửi đi à?" },
        { who: "Hana", voice: "ca-nu", text: "Not yet. Before we send anything, it has to be approved by our tutor. She checks that the questions are ethical.", vi: "Chưa. Trước khi gửi bất cứ thứ gì, nó phải được giảng viên hướng dẫn duyệt. Cô kiểm tra xem các câu hỏi có đúng đạo đức nghiên cứu không." },
        { who: "Leo", voice: "nz-nam", text: "OK. After that, how do we reach all the first-years? We could hand out paper copies in the library.", vi: "Ừ. Sau đó làm sao tới được toàn bộ sinh viên năm nhất? Mình có thể phát bản giấy ở thư viện." },
        { who: "Hana", voice: "ca-nu", text: "That would take days. And social media is no good either, because not everyone uses the same platform. Every student has a university email address, so let's send the link that way.", vi: "Thế thì mất mấy ngày. Mạng xã hội cũng không ổn, vì không phải ai cũng dùng cùng một nền tảng. Sinh viên nào cũng có địa chỉ email của trường, nên gửi đường dẫn theo cách đó đi." },
        { who: "Leo", voice: "nz-nam", text: "Email it is. Then the answers go into a spreadsheet. When do we present? I've got next Tuesday in my diary.", vi: "Vậy là email. Rồi câu trả lời đưa vào bảng tính. Bao giờ mình thuyết trình? Trong sổ mình ghi thứ Ba tuần sau." },
        { who: "Hana", voice: "ca-nu", text: "That was the original date, but Dr Shah has moved it. We've now got a fortnight, not until the end of term, sadly.", vi: "Đó là ngày ban đầu, nhưng cô Shah đã dời rồi. Giờ mình có hai tuần, tiếc là không phải tới cuối kỳ." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-nghe-khao-sat-hai",
      title: "Questions 7–8 — gõ HAI chữ cái (tính 2 điểm)",
      kind: "fill",
      items: [
        { q: "Which TWO topics will the survey cover?", answers: ["A D", "AD", "D A", "DA", "A and D", "D and A", "A, D", "D, A", "A & D", "D & A", "A/D", "D/A"], hint: "Ba chủ đề bị bỏ, mỗi cái một lý do." },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-nghe-khao-sat-flow",
      title: "Questions 9–12 — ghi MỘT chữ cái (A–F)",
      kind: "fill",
      items: [
        { q: "(9) Write a first draft of the ______", answers: ["D"], hint: "First of all…" },
        { q: "(10) Try it out on a small ______ of classmates", answers: ["B"], hint: "Once that's done…" },
        { q: "(11) Get approval from their ______", answers: ["F"], hint: "Before we send anything…" },
        { q: "(12) Send the link by ______", answers: ["A"], hint: "hai cách bị bác trước" },
      ],
    },
    {
      t: "mcq",
      id: "t3d18-kt-nghe-khao-sat-chon",
      title: "Question 13 — A, B or C",
      items: [
        { q: "(13) When will the students give their presentation?", options: ["A next Tuesday", "B in two weeks", "C at the end of term"], correct: 1, why: "“That was the original date, **but** Dr Shah has moved it. We've now got **a fortnight** (= two weeks), **not** until the end of term.” A là ngày cũ; C bị phủ định." },
      ],
    },
    {
      t: "note",
      title: "Giải thích Recording 2",
      items: [
        "**7–8: A, D.** A: “essential” → “Agreed, that's the core of it.” D: “whether working **affects their grades**” → “Definitely, that has to be in.” · B ❌ “I'd like to, **but**… Let's **drop it**.” · C ❌ “I thought…, **but actually** that feels too personal.” · E ❌ “Last year's group **already covered** that.”",
        "**9 D** questionnaire · **10 B** group (“a small group, five or six people from our class”) · **11 F** tutor (“it has to **be approved by** our tutor” — bị động; sơ đồ: get approval from) · **12 A** email (“let's send the link that way”).",
        "Hai lựa chọn thừa: **C library** (“That would take days”) và **E social media** (“is no good either”).",
        "Cộng điểm phần Nghe: Recording 1 (6) + câu 7–8 (2) + câu 9–12 (4) + câu 13 (1) = **13**.",
      ],
    },

    /* ── Phần 5 ── */
    { t: "h", text: "Phần 5 — Đọc (13 câu · đạt ≥ 9/13 · 22 phút · trượt thì ôn Ngày 13, 15, 17)" },
    {
      t: "p",
      text: "Bấm giờ **22 phút**. Bài đọc ~390 từ có **bốn dạng** của chặng: Table completion (Ngày 15) · chọn TWO (Ngày 13) · Flow-chart (Ngày 17) · Short answer (Ngày 15). Tên thị trấn trong bài là **tên tự đặt** cho bài luyện.",
    },
    {
      t: "passage",
      title: "A Second Life for Car Batteries",
      intro: "Khoảng 390 từ · bài tự soạn.",
      paras: [
        { label: "A", text: "When the battery of an electric car can hold only about 80 per cent of the energy it stored when new, most drivers notice that they cannot travel as far, and the battery is replaced. Yet a battery in this condition is far from useless. Millions of them will leave the roads over the next decade, and what happens to them matters, because they contain metals that are expensive to mine and dangerous to throw away. Broadly, there are two options: giving the battery a “second life” in a less demanding job, or recycling it." },
        { label: "B", text: "Second-life projects are already operating. In the port town of Norvik, 150 used car batteries store solar power on the roof of a sports stadium; if the electricity supply fails, they can keep the floodlights on for the rest of a match. On the island of Castelo, batteries taken from old buses supply a village school after dark, which has cut the school's use of diesel by 60 per cent. And in Marlow Bay, a supermarket chain uses retired batteries to charge its delivery vans at night, when electricity is cheapest. A battery used in this gentle way can typically keep working for another ten years." },
        { label: "C", text: "Reuse is not simple, however. Every battery has had a different life, so each one must be tested individually before it can be trusted, which is slow and costly. In addition, batteries made by different manufacturers differ in shape and are controlled by different software, which makes it hard to combine them in a single system. For these reasons, some engineers argue that reuse only delays the real task." },
        { label: "D", text: "That task is recycling. A battery arriving at a recycling plant is first discharged completely in order to prevent fires. It is then taken apart, a job still done by hand, although robots are being tested. The cells inside are shredded, producing a dark powder known as “black mass”. This powder is dissolved in acid, which allows the metals it contains, including lithium, nickel and cobalt, the most valuable of the three, to be separated from one another. Finally, the recovered metals are sold to manufacturers, who use them in new batteries." },
        { label: "E", text: "Neither route is perfect, but together they mean that the same materials may serve first a car, then a building, and finally another car." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–4.** Complete the table. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "table",
      caption: "Second-life battery projects",
      head: ["Place", "Where the batteries are used", "What they do", "Benefit"],
      rows: [
        ["Norvik", "sports stadium", "store solar power", "can power the **1 ______** during a power cut"],
        ["Castelo", "village **2 ______**", "supply power after dark", "60% less diesel used"],
        ["Marlow Bay", "supermarket chain", "charge delivery **3 ______** overnight", "uses low-cost **4 ______**"],
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-doc-bang",
      title: "Questions 1–4 — Table (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(1) can power the ______ during a power cut", answers: ["floodlights"], hint: "đoạn B — Norvik" },
        { q: "(2) village ______", answers: ["school"], hint: "đoạn B — Castelo" },
        { q: "(3) charge delivery ______ overnight", answers: ["vans"], hint: "đoạn B — Marlow Bay" },
        { q: "(4) uses low-cost ______", answers: ["electricity"], hint: "đoạn B — “when … is cheapest”" },
      ],
    },
    {
      t: "p",
      text: "**Questions 5–6.** Choose **TWO** letters, A–E. Which **TWO** difficulties of reusing batteries are mentioned in the passage?",
    },
    {
      t: "table",
      head: ["Chữ", "Phương án"],
      rows: [
        ["**A**", "Checking each battery takes time and money."],
        ["**B**", "Used batteries catch fire more easily than new ones."],
        ["**C**", "Batteries from different companies do not fit together easily."],
        ["**D**", "Old batteries lose all their energy within a year."],
        ["**E**", "The law does not allow old batteries to be transported."],
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-doc-hai",
      title: "Questions 5–6 — gõ HAI chữ cái (tính 2 điểm)",
      kind: "fill",
      items: [
        { q: "Which TWO difficulties of reusing batteries are mentioned?", answers: ["A C", "AC", "C A", "CA", "A and C", "C and A", "A, C", "C, A", "A & C", "C & A", "A/C", "C/A"], hint: "đoạn C" },
      ],
    },
    {
      t: "p",
      text: "**Questions 7–10.** Complete the flow-chart. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Recycling a car battery",
      steps: [
        { label: "Battery emptied of all its energy to avoid **7 ______**" },
        { label: "Battery dismantled by hand" },
        { label: "Cells shredded into a powder called “black **8 ______**”" },
        { label: "Powder dissolved in **9 ______**; metals separated" },
        { label: "Metals sold to **10 ______** of new batteries" },
      ],
    },
    {
      t: "quiz",
      id: "t3d18-kt-doc-flow",
      title: "Questions 7–10 — Flow-chart (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(7) to avoid ______", answers: ["fires"], hint: "đoạn D — in order to prevent…" },
        { q: "(8) “black ______”", answers: ["mass"], hint: "đoạn D — known as…" },
        { q: "(9) dissolved in ______", answers: ["acid"], hint: "đoạn D" },
        { q: "(10) sold to ______", answers: ["manufacturers"], hint: "đoạn D — câu cuối" },
      ],
    },
    {
      t: "p",
      text: "**Questions 11–13.** Answer the questions. Write **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.",
    },
    {
      t: "quiz",
      id: "t3d18-kt-doc-ngan",
      title: "Questions 11–13 — Short answer",
      kind: "fill",
      items: [
        { q: "(11) For how much longer can a second-life battery usually be used?", answers: ["ten years", "10 years", "another 10 years"], hint: "đoạn B, câu cuối" },
        { q: "(12) Which of the three metals named is worth the most?", answers: ["cobalt"], hint: "đoạn D — cụm đồng vị “the most valuable of the three”" },
        { q: "(13) What are being tested as a way of taking batteries apart without workers?", answers: ["robots"], hint: "đoạn D — although…" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Phần 5",
      items: [
        "**1 floodlights** — “keep the floodlights on for the rest of a match” (if the electricity supply fails = during a power cut). **2 school** · **3 vans** · **4 electricity** — “at night, when electricity is **cheapest**” = low-cost.",
        "**5–6: A, C.** A: “each one must be **tested individually**…, which is **slow and costly**”. C: “**differ in shape** and are controlled by **different software**, which makes it hard to **combine** them”. · B ❌ fires chỉ được nhắc ở khâu tái chế (đoạn D), không so cũ – mới. · D ❌ trái bài: dùng thêm được mười năm. · E ❌ không nhắc.",
        "**7 fires** — “discharged completely **in order to prevent fires**” (emptied of all its energy = discharged completely; avoid = prevent). **8 mass** — “known as ‘black mass’”. **9 acid**. **10 manufacturers** — “sold to manufacturers, **who** use them in new batteries” (mệnh đề không xác định).",
        "**11 ten years** — “for **another ten years**”. **12 cobalt** — “lithium, nickel and **cobalt, the most valuable of the three**” (đồng vị — Ngày 17 mục 8). **13 robots** — “although **robots are being tested**” (bị động tiếp diễn — Ngày 13).",
        "Sai Questions 1–4 ⇒ ôn **Ngày 15**. Sai 5–6 ⇒ **Ngày 13**. Sai 7–10 ⇒ **Ngày 17**. Sai 11–13 ⇒ **Ngày 15** (Short answer) và Ngày 7.",
      ],
    },

    /* ── Phần 6 ── */
    { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 14, 16, 18)" },
    {
      t: "mcq",
      id: "t3d18-kt-viet-chon",
      title: "6a. Kiến thức viết band 6 (6 câu · đạt ≥ 5/6)",
      items: [
        { q: "Đề: “Do the advantages of this trend outweigh the disadvantages?” Bài band 6 bắt buộc phải có gì?", options: ["Chỉ liệt kê ưu điểm", "Nói rõ BÊN NÀO nặng hơn ngay ở mở bài và giữ lập trường đó tới kết bài", "Hai thân bài dài bằng nhau, không nêu ý kiến", "Một đoạn giải pháp"], correct: 1, why: "outweigh = hỏi bên nào **nặng hơn** → phải có lập trường rõ xuyên bài (Ngày 14)." },
        { q: "Đề: “Is this a positive or negative development?” Thesis nào đạt?", options: ["This essay will discuss both sides.", "There are advantages and disadvantages.", "Overall, I believe this is a largely positive development, although it brings some risks for older workers.", "This is a development."], correct: 2, why: "Trả lời thẳng **positive / negative** + mức độ (largely) + nhượng bộ ngắn (Ngày 14)." },
        { q: "Hai pie chart: tỉ trọng nhà ở tăng từ 22% lên 30%. Câu nào chính xác?", options: ["Housing rose by 8 percentage points, from 22% to 30%.", "Housing increased by 8%.", "People bought 8% more houses.", "Housing was increased 30%."], correct: 0, why: "22 → 30 là tăng **8 điểm phần trăm**; “by 8%” là sai số liệu (Ngày 16 mục 2)." },
        { q: "Overview của bài hai pie theo năm nên nêu gì?", options: ["Mọi con số của cả hai năm", "Ý kiến của bạn về việc chi tiêu", "Lý do vì sao số liệu thay đổi", "Hạng mục lớn nhất mỗi năm và thay đổi nổi bật nhất (đổi thứ hạng)"], correct: 3, why: "Overview = 2 điểm nổi bật, không số chi tiết, không giải thích nguyên nhân (Ngày 4, Ngày 16)." },
        { q: "Nguyên nhân: “People drive because buses are slow and unreliable.” Giải pháp khớp:", options: ["Raise the price of cars.", "Create bus-only lanes so that buses are faster than cars at rush hour.", "Build more car parks.", "Teach children to cycle."], correct: 1, why: "Nguyên nhân là xe buýt **chậm, không đúng giờ** → làn riêng cho xe buýt (Ngày 18 mục 3)." },
        { q: "Mở bài nhượng bộ nào ĐÚNG ngữ pháp?", options: ["Although working from home saves time, but it can make employees feel isolated.", "Despite working from home saves time, it can make employees feel isolated.", "While working from home saves time, it can make employees feel isolated.", "While working from home saves time, however it can make employees feel isolated."], correct: 2, why: "While + mệnh đề, mệnh đề — không thêm but / however; Despite + danh từ (Ngày 18 mục 4)." },
      ],
    },
    {
      t: "p",
      text: "**6b. Task 1 (20 phút, ≥ 150 từ).** Hai biểu đồ tròn dưới đây cho thấy chi tiêu của hộ gia đình ở một nước năm 2000 và năm 2020 (số liệu tự đặt). Nhớ: chủ ngữ là **tỉ trọng** (the share / proportion of…), overview có **hạng mục lớn nhất mỗi năm + đổi thứ hạng**, dùng **percentage points**, quá khứ đơn + quá khứ hoàn thành với by 2020.",
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Household spending by category, 2000 (%)",
        note: "Số liệu tự đặt cho bài luyện.",
        slices: [
          { label: "Food", value: 32 },
          { label: "Housing", value: 22 },
          { label: "Transport", value: 15 },
          { label: "Leisure", value: 10 },
          { label: "Clothing", value: 9 },
          { label: "Other", value: 12 },
        ],
      },
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Household spending by category, 2020 (%)",
        note: "Số liệu tự đặt cho bài luyện.",
        slices: [
          { label: "Food", value: 24 },
          { label: "Housing", value: 30 },
          { label: "Transport", value: 14 },
          { label: "Leisure", value: 14 },
          { label: "Clothing", value: 5 },
          { label: "Other", value: 13 },
        ],
      },
    },
    {
      t: "essay",
      id: "t3d18-kt-viet-task1",
      task: "Task 1",
      prompt: "The two pie charts show how households in one country divided their spending between six categories in 2000 and 2020. (2000 — Food 32%, Housing 22%, Transport 15%, Leisure 10%, Clothing 9%, Other 12%. 2020 — Food 24%, Housing 30%, Transport 14%, Leisure 14%, Clothing 5%, Other 13%.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Overview: housing **overtook** food **to become** the largest category; clothing's share fell the most in relative terms (almost halved).",
        "Thân bài 1: hai hạng mục đổi mạnh (Food ↓ 8 points, Housing ↑ 8 points). Thân bài 2: Leisure ↑, Clothing ↓, Transport và Other gần như không đổi.",
        "Chủ ngữ là tỉ trọng: **The share of spending on** food fell **from** 32% **to** 24%.",
        "Dùng một câu “, which” hoặc V-ing: Housing rose to 30%, **making it** the largest category.",
        "Không giải thích nguyên nhân, không nêu ý kiến.",
      ],
    },
    {
      t: "p",
      text: "**6c. Task 2 (40 phút, ≥ 250 từ).** Dạng ưu – nhược có **outweigh** (Ngày 14). Dùng cả kỹ thuật của Ngày 18: mở bài nhượng bộ, chuỗi hệ quả hai tầng. Nói rõ **bên nào nặng hơn** ngay ở mở bài.",
    },
    {
      t: "essay",
      id: "t3d18-kt-viet-task2",
      task: "Task 2",
      prompt: "In many countries, more and more companies allow their employees to work from home for most of the week. Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Mở bài: While working from home…, I believe the advantages **clearly / slightly outweigh** the disadvantages.",
        "Thân bài 1 = bên **nhẹ hơn** (nhượng bộ); thân bài 2 = bên **nặng hơn** (dài và mạnh hơn).",
        "Mỗi ý kéo hai tầng: …, which means…, which in turn…",
        "Từ vựng chặng: flexible hours · commute · productivity · social isolation · face-to-face interaction · work–life balance · cost of living.",
        "Một câu điều kiện loại 2 hoặc 3; một câu bị động với modal; một mệnh đề quan hệ rút gọn (employees **working** from home).",
        "Kết bài nhắc lại đúng lập trường ở mở bài.",
      ],
    },

    /* ── Phần 7 ── */
    { t: "h", text: "Phần 7 — Nói (1 thẻ Part 2 + 3 câu Part 3 + 2 câu phỏng vấn · AI ≥ band 5.5 · trượt thì ôn Ngày 14, 15, 18)" },
    {
      t: "p",
      text: "**Part 2** (Ngày 14 — nơi chốn công cộng): 1 phút ghi chú, nói 1,5–2 phút. **Part 3**: câu 1 ưu – nhược (Ngày 14), câu 2–3 giả định (Ngày 15) — mỗi câu 30–45 giây, câu giả định phải có **would / might / could**. **Phỏng vấn** (Ngày 18): mỗi câu 45–60 giây.",
    },
    {
      t: "speak",
      id: "t3d18-kt-noi-p2",
      part: "2",
      questions: [
        "Describe a public place in your town or city that you think should be improved. You should say: where it is, what it is used for, what is wrong with it at the moment, and explain how you would improve it and why.",
      ],
    },
    {
      t: "speak",
      id: "t3d18-kt-noi-p3",
      part: "3",
      questions: [
        "What are the advantages and disadvantages of building large shopping centres in city centres?",
        "What would happen if cars were banned from the centre of your city?",
        "If you had been in charge of planning your city thirty years ago, what would you have done differently?",
      ],
    },
    {
      t: "speak",
      id: "t3d18-kt-noi-pv",
      part: "1",
      questions: [
        "Could you tell me a little about yourself and what you are doing at the moment?",
        "What would you say is your greatest strength? Give an example.",
      ],
    },
    {
      t: "note",
      title: "Tự chấm phần Nói",
      items: [
        "Part 2: có đủ **4 ý của thẻ** không? Phần “how you would improve it” có dùng **would** (giả định) không?",
        "Part 3 câu 1: có **cả ưu lẫn nhược** + bên nào nặng hơn? Câu 2: **If… were banned, … would…** (loại 2). Câu 3: **would have + V3** (loại 3) — nhớ đọc nối **would've**.",
        "Phỏng vấn: ba bước Hiện tại – Quá khứ – Tương lai; điểm mạnh = **một** tính từ + chuyện có kết quả.",
        "AI chấm **dưới 5.5** ở phần nào ⇒ ôn: Part 2 → Ngày 14 · Part 3 giả định → Ngày 15 · phỏng vấn → Ngày 18.",
      ],
    },

    /* ── Phần 8 ── */
    { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 13–18)" },
    {
      t: "mcq",
      id: "t3d18-kt-phat-am",
      title: "8. Âm nào? Nhấn ở đâu? Ngắt ở đâu? (8 câu)",
      items: [
        { q: "Từ nào có âm /ʒ/ (như trong “television”)?", options: ["nation", "decision", "pressure", "station"], correct: 1, why: "**-sion sau nguyên âm** đọc /ʒn/: decision /dɪˈsɪʒn/. nation, station: /ʃn/; pressure: /ʃ/ (Ngày 13)." },
        { q: "Đuôi -tion trong “education, pollution, solution” đọc là", options: ["/tɪən/", "/ʒn/", "/ʃn/", "/tʃn/"], correct: 2, why: "**-tion → /ʃn/**, trọng âm rơi vào âm tiết ngay trước nó (Ngày 13, Ngày 7)." },
        { q: "Từ nào có nguyên âm đôi /eə/?", options: ["where", "here", "beer", "idea"], correct: 0, why: "where /weə/. here, beer, idea đều có **/ɪə/** (Ngày 14)." },
        { q: "“I would have gone” khi nói nhanh, “would have” nghe như", options: ["/wʊd hæv/", "/wʊl əv/", "/wʊd hɪv/", "/ˈwʊdəv/"], correct: 3, why: "have yếu đi thành /əv/ và nối vào would: **would've /ˈwʊdəv/** (Ngày 15)." },
        { q: "Trong câu “Sales **increased** by 10%”, từ increased nhấn âm tiết nào?", options: ["âm 1: IN-creased", "âm 2: in-CREASED", "cả hai như nhau", "không âm nào"], correct: 1, why: "Động từ → nhấn **âm 2**: inCREASE. Danh từ an INcrease mới nhấn âm 1 (Ngày 16)." },
        { q: "Trong câu “The company broke the sales **record**”, từ record nhấn âm tiết nào?", options: ["âm 1: RE-cord", "âm 2: re-CORD", "cả hai như nhau", "tuỳ người nói"], correct: 0, why: "Ở đây là **danh từ** → nhấn âm 1: /ˈrekɔːd/. Động từ to reCORD nhấn âm 2 (Ngày 16)." },
        { q: "Câu nào phải NGẮT HƠI ở hai bên mệnh đề quan hệ?", options: ["People who live in cities often suffer from stress.", "The students living on campus pay less.", "My brother, who lives in London, is a doctor.", "The book that I bought was expensive."], correct: 2, why: "Mệnh đề **không xác định** (có dấu phẩy) → ngắt trước và sau, hạ giọng ở giữa. Ba câu kia là xác định / rút gọn → nói liền (Ngày 17)." },
        { q: "“Could you say that again, please?” — để nghe lịch sự, giọng ở cuối câu nên", options: ["đi xuống thật nhanh", "ngang, đều đều", "ngắt đột ngột", "lên nhẹ"], correct: 3, why: "Lời đề nghị lịch sự: bắt đầu cao, **lên nhẹ ở cuối**. Xuống nhanh nghe như ra lệnh (Ngày 18)." },
      ],
    },
    {
      t: "note",
      title: "Sau 8 câu trên — đọc lại sáu khối có máy chấm",
      items: [
        "Ngày 13: /ʃ/ – /ʒ/ trong -tion / -sion · Ngày 14: /ɪə/ – /eə/ – /ʊə/ · Ngày 15: would've / could've / should've.",
        "Ngày 16: trọng âm danh từ – động từ · Ngày 17: ngắt hơi trước mệnh đề không xác định · Ngày 18: ngữ điệu lịch sự.",
        "Khối nào máy chấm dưới **70 điểm** ở quá nửa số dòng ⇒ luyện lại khối đó 5 phút mỗi ngày trong ba ngày tới.",
      ],
    },

    /* ── Kết ── */
    { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
    {
      t: "table",
      head: ["Kết quả", "Việc cần làm"],
      rows: [
        ["Đạt cả 8 phần", "Sang **Ngày 19**. Chép 5 lỗi đáng nhớ nhất của bài này vào Sổ lỗi."],
        ["Trượt 1–2 phần", "Ôn đúng Ngày được chỉ (1–2 buổi), làm lại **riêng** phần đó, rồi sang Ngày 19."],
        ["Trượt phần Ngữ pháp + Dịch", "Ôn lại bài dịch 💡 của Ngày 13, 15, 17 — che đáp án, viết tay từng câu."],
        ["Trượt phần Nghe hoặc Đọc", "Làm lại bài chính của Ngày 13 / 15 / 17 có **bấm giờ**; đọc bảng “paraphrase – bẫy” sau mỗi bài."],
        ["Trượt từ 3 phần trở lên", "Chưa vội sang chặng mới: dành 3 ngày ôn Ngày 13–18 theo thứ tự, rồi làm lại cả bài kiểm tra."],
        ["Chưa làm Đề 4", "Làm **Đề 4** ở Online Test (thi giữa tập, đủ 4 kỹ năng) trước khi sang Ngày 19."],
      ],
    },
    {
      t: "note",
      title: "Mẹo ôn trước khi sang chặng mới",
      items: [
        "Ba “câu vàng” của chặng — viết lại mỗi câu theo chủ đề của bạn: ① **More money should be spent on**… ② **If** + V2…, … **would**… ③ …**, which means that**…",
        "Mở Flashcards bộ “Từ của khoá — Tập 3”, lọc Ngày 14, 16, 18, ôn 15 phút.",
        "Nghe lại bài Part 3 Ngày 17 và bài phỏng vấn Ngày 18 khi đi đường — lần này **nhại theo** (shadowing).",
      ],
    },
  ],
};

export const NGAY_18: Lesson[] = [T3D18_VOCAB, T3D18_WRITING, T3D18_SPEAKING, T3D18_HOMEWORK, T3D18_REVIEW];
