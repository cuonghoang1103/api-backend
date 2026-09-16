/**
 * KCL401 — Korean for Media and Logistics / Tiếng Hàn truyền thông và Logistics.
 * Ngành Ngôn ngữ Hàn, FPTU, Kỳ 5. Trích dẫn giáo trình "미디어 한국어 (Media
 * Korean)" + "물류 한국어 (Logistics Korean)" — KHÔNG upload PDF gốc.
 * 8 chương: 4 truyền thông (언론/미디어, 뉴스, 광고/SNS, 보도자료/PR)
 *         + 4 logistics (물류/공급망, 운송/창고/배송, 수출입/통관, ôn tập).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; Hangeul UTF-8.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('kcl401-1-1-eollon-media', '1.1 — Press & broadcast vocabulary (언론, 미디어)|||1.1 — Từ vựng báo chí & truyền thông (언론, 미디어)',
  '언론/미디어: nhà báo, biên tập viên, phát sóng, tin độc quyền, cơ quan báo chí, nguồn tin.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 1 · Lesson 1.1</span>
<h2>언론 &amp; 미디어 — Press &amp; media vocabulary</h2>
<p class="lead">This chapter opens the media half of the course: the people, places and actions of a Korean newsroom — <strong>언론 (press)</strong> and <strong>미디어 (media)</strong>.</p>
<h3>Core vocabulary</h3>
<pre><code>언론      eollon        (danh từ) báo chí, ngôn luận / the press
미디어    midieo        (danh từ) truyền thông / media
기자      gija          (danh từ) nhà báo, phóng viên / journalist
편집자    pyeonjipja    (danh từ) biên tập viên / editor
취재하다  chwijaehada   (động từ) tác nghiệp, lấy tin / to cover (a story)
방송      bangsong      (danh từ) phát sóng, đài phát thanh-truyền hình / broadcast
신문      sinmun        (danh từ) báo giấy / newspaper
뉴스      nyuseu        (danh từ) tin tức / news
헤드라인  hedeurain     (danh từ) tiêu đề / headline
특종      teukjong      (danh từ) tin độc quyền, tin nóng / scoop
언론사    eollonsa      (danh từ) cơ quan báo chí / press outlet
취재원    chwijaewon    (danh từ) nguồn tin / news source
</code></pre>
<h3>Dialogue — a reporter requests an interview</h3>
<pre><code>기자: 안녕하세요, 저는 서울신문 기자입니다.
     (Annyeonghaseyo, jeoneun Seoul-sinmun gijaimnida.)
     Xin chào, tôi là phóng viên báo Seoul.

기자: 이 사건에 대해 잠깐 인터뷰해도 될까요?
     (I sageone daehae jamkkan inteobyuhaedo doelkkayo?)
     Tôi phỏng vấn nhanh về vụ việc này được không ạ?

담당자: 네, 편집자님께 먼저 확인하겠습니다.
       (Ne, pyeonjipjanimkke meonjeo hwaginhagetsseumnida.)
       Vâng, tôi sẽ xác nhận với biên tập viên trước.
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>저는 OO신문 기자입니다.</strong> (Jeoneun OO-sinmun gijaimnida.) — I'm a journalist from OO newspaper.</li>
<li><strong>이 사건에 대해 취재하고 있습니다.</strong> (I sageone daehae chwijaehago itsseumnida.) — I'm covering this story.</li>
<li><strong>오늘 저녁 뉴스에 방송될 예정입니다.</strong> (Oneul jeonyeok nyuseue bangsongdoel yejeongimnida.) — It's scheduled to air on tonight's news.</li>
</ul>
<div class="callout"><span class="badge">Note</span> <strong>언론</strong> is the abstract institution ("the press"), while <strong>미디어</strong> covers all channels — TV, print, online, SNS. A Korean news article usually names both the <strong>기자</strong> (byline) and the <strong>언론사</strong> (outlet) at the top.</div>`,
    `<span class="eyebrow">KCL401 · Chương 1 · Bài 1.1</span>
<h2>언론 &amp; 미디어 — Từ vựng báo chí &amp; truyền thông</h2>
<p class="lead">Chương này mở đầu nửa truyền thông của môn: con người, nơi chốn và hành động trong một toà soạn Hàn Quốc — <strong>언론 (báo chí)</strong> và <strong>미디어 (truyền thông)</strong>.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>언론      eollon        (d.từ) báo chí, ngôn luận
미디어    midieo        (d.từ) truyền thông
기자      gija          (d.từ) nhà báo, phóng viên
편집자    pyeonjipja    (d.từ) biên tập viên
취재하다  chwijaehada   (đ.từ) tác nghiệp, lấy tin
방송      bangsong      (d.từ) phát sóng, đài phát thanh-truyền hình
신문      sinmun        (d.từ) báo giấy
뉴스      nyuseu        (d.từ) tin tức
헤드라인  hedeurain     (d.từ) tiêu đề
특종      teukjong      (d.từ) tin độc quyền, tin nóng
언론사    eollonsa      (d.từ) cơ quan báo chí
취재원    chwijaewon    (d.từ) nguồn tin
</code></pre>
<h3>Hội thoại — phóng viên xin phỏng vấn</h3>
<pre><code>기자: 안녕하세요, 저는 서울신문 기자입니다.
     (Annyeonghaseyo, jeoneun Seoul-sinmun gijaimnida.)
     Xin chào, tôi là phóng viên báo Seoul.

기자: 이 사건에 대해 잠깐 인터뷰해도 될까요?
     (I sageone daehae jamkkan inteobyuhaedo doelkkayo?)
     Tôi phỏng vấn nhanh về vụ việc này được không ạ?

담당자: 네, 편집자님께 먼저 확인하겠습니다.
       (Ne, pyeonjipjanimkke meonjeo hwaginhagetsseumnida.)
       Vâng, tôi sẽ xác nhận với biên tập viên trước.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>저는 OO신문 기자입니다.</strong> (Jeoneun OO-sinmun gijaimnida.) — Tôi là phóng viên báo OO.</li>
<li><strong>이 사건에 대해 취재하고 있습니다.</strong> (I sageone daehae chwijaehago itsseumnida.) — Tôi đang tác nghiệp về vụ việc này.</li>
<li><strong>오늘 저녁 뉴스에 방송될 예정입니다.</strong> (Oneul jeonyeok nyuseue bangsongdoel yejeongimnida.) — Dự kiến sẽ được phát sóng trong bản tin tối nay.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> <strong>언론</strong> là định chế trừu tượng ("báo chí"), còn <strong>미디어</strong> bao trùm mọi kênh — TV, báo in, online, SNS. Một bài báo Hàn thường ghi cả <strong>기자</strong> (tên phóng viên) lẫn <strong>언론사</strong> (tên cơ quan) ở đầu bài.</div>`,
  ]]);

const c1q = quiz('kcl401-quiz-1', 'Quiz 1 — Press & media|||Quiz 1 — Báo chí & truyền thông', [
  { id: 'q1', question: '"기자" nghĩa là gì?', options: ['Biên tập viên', 'Nhà báo, phóng viên', 'Người dẫn chương trình', 'Nhà xuất bản'], correctIndex: 1, explanation: '기자 (gija) = nhà báo/phóng viên — người trực tiếp tác nghiệp, lấy tin.' },
  { id: 'q2', question: '"특종" nghĩa là gì?', options: ['Tin thường ngày', 'Tin độc quyền, tin nóng', 'Bài xã luận', 'Thông cáo báo chí'], correctIndex: 1, explanation: '특종 (teukjong) = scoop — tin độc quyền mà một cơ quan báo chí đưa trước.' },
  { id: 'q3', question: 'Từ nào nghĩa là "cơ quan báo chí"?', options: ['언론사', '신문', '뉴스', '방송'], correctIndex: 0, explanation: '언론사 (eollonsa) = press outlet, cơ quan báo chí — nơi 기자 làm việc.' },
]);

const c2 = doc('kcl401-2-1-nyuseu-doc-hieu', '2.1 — News reading & bulletins (뉴스)|||2.1 — Đọc-hiểu tin tức & bản tin (뉴스)',
  '뉴스: tin nóng, đưa tin độc quyền, xã luận, dư luận, thống kê trong bản tin tiếng Hàn.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 2 · Lesson 2.1</span>
<h2>뉴스 — Reading &amp; understanding Korean news</h2>
<p class="lead">A Korean news bulletin follows a fixed rhythm: <strong>headline → lead sentence → body → quote → closing</strong>. Learn the vocabulary that carries that structure.</p>
<h3>Core vocabulary</h3>
<pre><code>속보        sokbo         tin nóng, breaking news
단독 보도   dandok bodo   đưa tin độc quyền
사설        saseol        bài xã luận / editorial
기사        gisa          bài báo / article
인터뷰      inteobyu      phỏng vấn / interview
여론        yeoron        dư luận / public opinion
사건        sageon        sự kiện, vụ việc / incident
통계        tonggye       thống kê / statistics
발표하다    balpyohada    công bố / to announce
보도하다    bodohada      đưa tin, báo cáo / to report
정정 보도   jeongjeong bodo  đính chính / correction
오보        obo           tin sai, tin nhầm / false report
</code></pre>
<h3>Reading — a short bulletin</h3>
<pre><code>[속보] 정부, 새 물류 정책 발표
정부는 오늘 오전 새로운 물류 정책을 발표했다. 관계자는
"이번 정책으로 유통 비용이 줄어들 것"이라고 말했다.
전문가들은 이 정책에 대한 여론이 긍정적이라고 보도했다.

Dịch: [Tin nóng] Chính phủ công bố chính sách logistics mới
Sáng nay chính phủ đã công bố chính sách logistics mới. Người
phụ trách nói: "Chính sách này sẽ giúp giảm chi phí lưu thông."
Các chuyên gia đưa tin dư luận đang phản ứng tích cực.
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>이 소식은 오늘 아침 속보로 전해졌다.</strong> (I sosigeun oneul achim sokboro jeonhaejyeotda.) — This news broke as a bulletin this morning.</li>
<li><strong>기자는 사건에 대해 자세히 보도했다.</strong> (Gijaneun sageone daehae jasehi bodohaetda.) — The reporter covered the incident in detail.</li>
<li><strong>회사는 실적 통계를 발표했다.</strong> (Hoesaneun siljeok tonggyereul balpyohaetda.) — The company announced performance statistics.</li>
</ul>
<div class="callout"><span class="badge">Reading tip</span> Scan the headline (often bracketed, e.g. <strong>[속보]</strong>) first, then the first sentence — Korean news almost always front-loads the who/what there, same as an English lede.</div>`,
    `<span class="eyebrow">KCL401 · Chương 2 · Bài 2.1</span>
<h2>뉴스 — Đọc-hiểu tin tức tiếng Hàn</h2>
<p class="lead">Một bản tin tiếng Hàn theo nhịp cố định: <strong>tiêu đề → câu mở đầu → nội dung → trích dẫn → kết</strong>. Học từ vựng mang cấu trúc đó.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>속보        sokbo         tin nóng, breaking news
단독 보도   dandok bodo   đưa tin độc quyền
사설        saseol        bài xã luận
기사        gisa          bài báo
인터뷰      inteobyu      phỏng vấn
여론        yeoron        dư luận
사건        sageon        sự kiện, vụ việc
통계        tonggye       thống kê
발표하다    balpyohada    công bố
보도하다    bodohada      đưa tin, báo cáo
정정 보도   jeongjeong bodo  đính chính
오보        obo           tin sai, tin nhầm
</code></pre>
<h3>Đọc hiểu — bản tin ngắn</h3>
<pre><code>[속보] 정부, 새 물류 정책 발표
정부는 오늘 오전 새로운 물류 정책을 발표했다. 관계자는
"이번 정책으로 유통 비용이 줄어들 것"이라고 말했다.
전문가들은 이 정책에 대한 여론이 긍정적이라고 보도했다.

Dịch: [Tin nóng] Chính phủ công bố chính sách logistics mới
Sáng nay chính phủ đã công bố chính sách logistics mới. Người
phụ trách nói: "Chính sách này sẽ giúp giảm chi phí lưu thông."
Các chuyên gia đưa tin dư luận đang phản ứng tích cực.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>이 소식은 오늘 아침 속보로 전해졌다.</strong> (I sosigeun oneul achim sokboro jeonhaejyeotda.) — Tin này được đưa như một tin nóng sáng nay.</li>
<li><strong>기자는 사건에 대해 자세히 보도했다.</strong> (Gijaneun sageone daehae jasehi bodohaetda.) — Phóng viên đã đưa tin chi tiết về vụ việc.</li>
<li><strong>회사는 실적 통계를 발표했다.</strong> (Hoesaneun siljeok tonggyereul balpyohaetda.) — Công ty đã công bố số liệu thống kê kết quả kinh doanh.</li>
</ul>
<div class="callout"><span class="badge">Mẹo đọc</span> Đọc tiêu đề trước (thường trong ngoặc vuông, vd <strong>[속보]</strong>), rồi câu đầu tiên — tin tiếng Hàn hầu như luôn đặt ai/làm gì ngay câu đầu, giống "lede" trong tin tiếng Anh.</div>`,
  ]]);

const c2q = quiz('kcl401-quiz-2', 'Quiz 2 — News reading|||Quiz 2 — Đọc hiểu tin tức', [
  { id: 'q1', question: '"속보" nghĩa là gì?', options: ['Tin nóng, breaking news', 'Bài xã luận', 'Thông cáo báo chí', 'Hợp đồng quảng cáo'], correctIndex: 0, explanation: '속보 (sokbo) = tin đưa gấp ngay khi sự việc vừa xảy ra.' },
  { id: 'q2', question: '"여론" nghĩa là gì?', options: ['Doanh thu quảng cáo', 'Dư luận, công luận', 'Vận đơn', 'Chuỗi cung ứng'], correctIndex: 1, explanation: '여론 (yeoron) = public opinion, dư luận xã hội.' },
  { id: 'q3', question: 'Động từ nào nghĩa "đưa tin, báo cáo"?', options: ['보도하다', '발주하다', '홍보하다', '통관하다'], correctIndex: 0, explanation: '보도하다 (bodohada) = to report — dùng cho báo chí đưa tin.' },
]);

const c3 = doc('kcl401-3-1-gwanggo-sns', '3.1 — Advertising, SNS & digital content (광고, SNS)|||3.1 — Quảng cáo, mạng xã hội & nội dung số (광고, SNS)',
  '광고/SNS: quảng cáo, mạng xã hội, nội dung, người ảnh hưởng, hashtag, lượt xem, viral.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 3 · Lesson 3.1</span>
<h2>광고 &amp; SNS — Advertising and social media</h2>
<p class="lead">Media work today is not only newsrooms — brands run their own channels. This lesson covers the vocabulary of <strong>광고 (advertising)</strong> and <strong>SNS (social networking service)</strong>.</p>
<h3>Core vocabulary</h3>
<pre><code>광고        gwanggo         quảng cáo / advertisement
소셜 미디어  syosyeol midieo  mạng xã hội / social media
콘텐츠      kontencheu      nội dung / content
인플루언서  inpeulluueonseo  người có tầm ảnh hưởng / influencer
마케팅      maketing        tiếp thị / marketing
브랜드      beuraendeu      thương hiệu / brand
팔로워      pallowo         người theo dõi / follower
해시태그    haesitaegeu     hashtag
조회수      johoesu         lượt xem / view count
홍보하다    hongbohada      quảng bá / to promote
바이럴      baireol         lan truyền, viral
댓글        daetgeul        bình luận / comment
</code></pre>
<h3>Dialogue — planning a campaign</h3>
<pre><code>마케터: 이번 광고는 인플루언서와 협업할 예정입니다.
       (Ibeon gwanggoneun inpeulluueonseowa hyeobeophal yejeongimnida.)
       Chiến dịch quảng cáo lần này sẽ hợp tác với influencer.

팀장: 좋아요. 해시태그도 같이 홍보해 주세요.
     (Joayo. Haesitaegeudo gachi hongbohae juseyo.)
     Tốt lắm. Hãy quảng bá cùng hashtag luôn nhé.

마케터: 네, 콘텐츠 조회수를 매주 확인하겠습니다.
       (Ne, kontencheu johoesureul maeju hwaginhagetsseumnida.)
       Vâng, tôi sẽ theo dõi lượt xem nội dung mỗi tuần.
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>이 브랜드는 SNS 마케팅에 집중하고 있다.</strong> (I beuraendeuneun SNS maketinge jipjunghago itda.) — This brand is focusing on SNS marketing.</li>
<li><strong>그 영상은 조회수가 백만 회를 넘었다.</strong> (Geu yeongsangeun johoesuga baengman hoereul neomeotda.) — That video's view count passed one million.</li>
<li><strong>콘텐츠가 바이럴이 되어 팔로워가 늘었다.</strong> (Kontencheuga baireori doeeo pallowoga neureotda.) — The content went viral and followers grew.</li>
</ul>
<div class="callout"><span class="badge">Note</span> <strong>홍보하다</strong> (to promote) is broader than 광고하다 (to advertise) — it covers earned media (PR) too, not only paid ads. It reappears in Chapter 4 with 보도자료.</div>`,
    `<span class="eyebrow">KCL401 · Chương 3 · Bài 3.1</span>
<h2>광고 &amp; SNS — Quảng cáo &amp; mạng xã hội</h2>
<p class="lead">Công việc truyền thông ngày nay không chỉ ở toà soạn — thương hiệu cũng chạy kênh riêng. Bài này học từ vựng của <strong>광고 (quảng cáo)</strong> và <strong>SNS (mạng xã hội)</strong>.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>광고        gwanggo         quảng cáo
소셜 미디어  syosyeol midieo  mạng xã hội
콘텐츠      kontencheu      nội dung
인플루언서  inpeulluueonseo  người có tầm ảnh hưởng
마케팅      maketing        tiếp thị
브랜드      beuraendeu      thương hiệu
팔로워      pallowo         người theo dõi
해시태그    haesitaegeu     hashtag
조회수      johoesu         lượt xem
홍보하다    hongbohada      quảng bá
바이럴      baireol         lan truyền, viral
댓글        daetgeul        bình luận
</code></pre>
<h3>Hội thoại — lên kế hoạch chiến dịch</h3>
<pre><code>마케터: 이번 광고는 인플루언서와 협업할 예정입니다.
       (Ibeon gwanggoneun inpeulluueonseowa hyeobeophal yejeongimnida.)
       Chiến dịch quảng cáo lần này sẽ hợp tác với influencer.

팀장: 좋아요. 해시태그도 같이 홍보해 주세요.
     (Joayo. Haesitaegeudo gachi hongbohae juseyo.)
     Tốt lắm. Hãy quảng bá cùng hashtag luôn nhé.

마케터: 네, 콘텐츠 조회수를 매주 확인하겠습니다.
       (Ne, kontencheu johoesureul maeju hwaginhagetsseumnida.)
       Vâng, tôi sẽ theo dõi lượt xem nội dung mỗi tuần.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>이 브랜드는 SNS 마케팅에 집중하고 있다.</strong> (I beuraendeuneun SNS maketinge jipjunghago itda.) — Thương hiệu này đang tập trung vào tiếp thị SNS.</li>
<li><strong>그 영상은 조회수가 백만 회를 넘었다.</strong> (Geu yeongsangeun johoesuga baengman hoereul neomeotda.) — Video đó có lượt xem vượt một triệu.</li>
<li><strong>콘텐츠가 바이럴이 되어 팔로워가 늘었다.</strong> (Kontencheuga baireori doeeo pallowoga neureotda.) — Nội dung lan truyền (viral) nên lượng người theo dõi tăng.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> <strong>홍보하다</strong> (quảng bá) rộng hơn 광고하다 (chạy quảng cáo trả phí) — nó bao gồm cả truyền thông "earned" (PR), không chỉ quảng cáo trả tiền. Gặp lại từ này ở Chương 4 với 보도자료.</div>`,
  ]]);

const c3q = quiz('kcl401-quiz-3', 'Quiz 3 — Ads & SNS|||Quiz 3 — Quảng cáo & SNS', [
  { id: 'q1', question: '"인플루언서" nghĩa là gì?', options: ['Nhà báo', 'Người có tầm ảnh hưởng trên mạng xã hội', 'Biên tập viên', 'Nhân viên kho'], correctIndex: 1, explanation: '인플루언서 (inpeulluueonseo) = influencer.' },
  { id: 'q2', question: '"해시태그" là gì?', options: ['Hashtag dùng trên SNS', 'Vận đơn đường biển', 'Giấy chứng nhận xuất xứ', 'Bảng lương'], correctIndex: 0, explanation: '해시태그 (haesitaegeu) = hashtag, dùng để gắn thẻ nội dung trên mạng xã hội.' },
  { id: 'q3', question: '"조회수" nghĩa là gì?', options: ['Lượt xem', 'Lượt đặt hàng', 'Lượt nhập kho', 'Lượt thông quan'], correctIndex: 0, explanation: '조회수 (johoesu) = view count, số lượt xem nội dung.' },
]);

const c4 = doc('kcl401-4-1-bodojaryo-pr', '4.1 — Interviews, press releases & PR (보도자료)|||4.1 — Phỏng vấn, thông cáo báo chí & PR (보도자료)',
  '보도자료/PR: thông cáo báo chí, họp báo, đội PR, quản lý khủng hoảng, ứng phó truyền thông.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 4 · Lesson 4.1</span>
<h2>보도자료 — Press releases &amp; PR</h2>
<p class="lead">This lesson closes the media half: how a company or organization speaks TO the press, via a <strong>보도자료 (press release)</strong> and a <strong>기자회견 (press conference)</strong>.</p>
<h3>Core vocabulary</h3>
<pre><code>보도자료    bodojaryo         thông cáo báo chí / press release
홍보팀      hongbotim         đội PR, quan hệ công chúng / PR team
기자회견    gijahoegyeon      họp báo / press conference
질문하다    jilmunhada        đặt câu hỏi / to ask a question
답변하다    dapbyeonhada      trả lời / to answer
위기관리    wigigwalli        quản lý khủng hoảng / crisis management
이미지      imiji             hình ảnh, danh tiếng / image
협찬        hyeopchan         tài trợ / sponsorship
언론 대응   eollon daeeung    ứng phó truyền thông / media response
공식 입장   gongsik ipjang    lập trường chính thức / official statement
</code></pre>
<h3>Reading — a press release opening</h3>
<pre><code>[보도자료] OO물류, 신규 물류센터 개장

OO물류(대표 김OO)는 오늘 새로운 물류센터 개장을 발표하며
보도자료를 배포했다. 홍보팀 관계자는 기자회견에서
"이번 물류센터로 배송 속도가 크게 개선될 것"이라고 답변했다.

Dịch: [Thông cáo báo chí] OO Logistics khai trương trung tâm mới
OO Logistics (CEO Kim OO) hôm nay đã phát hành thông cáo báo chí
công bố khai trương trung tâm logistics mới. Đại diện đội PR trả
lời tại họp báo: "Trung tâm này sẽ cải thiện đáng kể tốc độ giao hàng."
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>회사는 보도자료를 통해 신제품을 발표했다.</strong> (Hoesaneun bodojaryoreul tonghae sinjepumeul balpyohaetda.) — The company announced a new product through a press release.</li>
<li><strong>홍보팀은 위기관리 매뉴얼을 준비했다.</strong> (Hongbotimeun wigigwalli maenyueoreul junbihaetda.) — The PR team prepared a crisis-management manual.</li>
<li><strong>기자의 질문에 공식 입장을 답변했다.</strong> (Gijaui jilmune gongsik ipjangeul dapbyeonhaetda.) — They answered the reporter's question with an official statement.</li>
</ul>
<div class="callout"><span class="badge">Note</span> A 보도자료 answers who/what/when/where/why in its first paragraph — the same structure you learned for news reading in 2.1, just written from the company's side.</div>`,
    `<span class="eyebrow">KCL401 · Chương 4 · Bài 4.1</span>
<h2>보도자료 — Thông cáo báo chí &amp; PR</h2>
<p class="lead">Bài này khép lại nửa truyền thông: cách một công ty/tổ chức nói VỚI báo chí, qua <strong>보도자료 (thông cáo báo chí)</strong> và <strong>기자회견 (họp báo)</strong>.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>보도자료    bodojaryo         thông cáo báo chí
홍보팀      hongbotim         đội PR, quan hệ công chúng
기자회견    gijahoegyeon      họp báo
질문하다    jilmunhada        đặt câu hỏi
답변하다    dapbyeonhada      trả lời
위기관리    wigigwalli        quản lý khủng hoảng
이미지      imiji             hình ảnh, danh tiếng
협찬        hyeopchan         tài trợ
언론 대응   eollon daeeung    ứng phó truyền thông
공식 입장   gongsik ipjang    lập trường chính thức
</code></pre>
<h3>Đọc hiểu — mở đầu một thông cáo báo chí</h3>
<pre><code>[보도자료] OO물류, 신규 물류센터 개장

OO물류(대표 김OO)는 오늘 새로운 물류센터 개장을 발표하며
보도자료를 배포했다. 홍보팀 관계자는 기자회견에서
"이번 물류센터로 배송 속도가 크게 개선될 것"이라고 답변했다.

Dịch: [Thông cáo báo chí] OO Logistics khai trương trung tâm mới
OO Logistics (CEO Kim OO) hôm nay đã phát hành thông cáo báo chí
công bố khai trương trung tâm logistics mới. Đại diện đội PR trả
lời tại họp báo: "Trung tâm này sẽ cải thiện đáng kể tốc độ giao hàng."
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>회사는 보도자료를 통해 신제품을 발표했다.</strong> (Hoesaneun bodojaryoreul tonghae sinjepumeul balpyohaetda.) — Công ty đã công bố sản phẩm mới qua thông cáo báo chí.</li>
<li><strong>홍보팀은 위기관리 매뉴얼을 준비했다.</strong> (Hongbotimeun wigigwalli maenyueoreul junbihaetda.) — Đội PR đã chuẩn bị sổ tay quản lý khủng hoảng.</li>
<li><strong>기자의 질문에 공식 입장을 답변했다.</strong> (Gijaui jilmune gongsik ipjangeul dapbyeonhaetda.) — Họ trả lời câu hỏi của phóng viên bằng lập trường chính thức.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Một 보도자료 trả lời ai/làm gì/khi nào/ở đâu/tại sao ngay đoạn đầu — đúng cấu trúc bạn đã học ở bài đọc tin 2.1, chỉ khác là viết từ phía công ty.</div>`,
  ]]);

const c4q = quiz('kcl401-quiz-4', 'Quiz 4 — Press releases & PR|||Quiz 4 — Thông cáo báo chí & PR', [
  { id: 'q1', question: '"보도자료" nghĩa là gì?', options: ['Thông cáo báo chí', 'Phiếu đóng gói', 'Hóa đơn', 'Vận đơn'], correctIndex: 0, explanation: '보도자료 (bodojaryo) = press release, tài liệu công ty gửi cho báo chí.' },
  { id: 'q2', question: '"기자회견" là gì?', options: ['Họp báo', 'Hội chợ thương mại', 'Lễ khai trương kho', 'Buổi tập huấn nhân viên'], correctIndex: 0, explanation: '기자회견 (gijahoegyeon) = press conference, họp báo.' },
  { id: 'q3', question: '"위기관리" nghĩa là gì?', options: ['Quản lý khủng hoảng', 'Quản lý tồn kho', 'Quản lý vận chuyển', 'Quản lý thuế quan'], correctIndex: 0, explanation: '위기관리 (wigigwalli) = crisis management, quản lý khủng hoảng truyền thông.' },
]);

const c5 = doc('kcl401-5-1-mullyu-gonggeupmang', '5.1 — Logistics vocabulary & supply chain (물류, 공급망)|||5.1 — Từ vựng logistics & chuỗi cung ứng (물류, 공급망)',
  '물류/공급망: logistics, chuỗi cung ứng, tồn kho, kho bãi, đặt hàng, nhập-xuất kho, nhà cung cấp.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 5 · Lesson 5.1</span>
<h2>물류 &amp; 공급망 — Logistics vocabulary &amp; supply chain</h2>
<p class="lead">The second half of the course turns to <strong>물류 (logistics)</strong>. This lesson builds the base vocabulary of a <strong>공급망 (supply chain)</strong>: warehouses, orders, stock.</p>
<h3>Core vocabulary</h3>
<pre><code>물류        mullyu            logistics
공급망      gonggeupmang      chuỗi cung ứng / supply chain
재고        jaego             hàng tồn kho / inventory
창고        changgo           kho bãi / warehouse
발주        balju             đặt hàng (mua) / purchase order
입고        ipgo              nhập kho / stock-in
출고        chulgo            xuất kho / stock-out
유통        yutong            lưu thông, phân phối / distribution
물류센터    mullyu senteo     trung tâm logistics / logistics center
공급업체    gonggeupeopche    nhà cung cấp / supplier
수요        suyo              nhu cầu / demand
물류비      mullyubi          chi phí logistics / logistics cost
</code></pre>
<h3>Dialogue — checking stock before an order</h3>
<pre><code>담당자: 이번 주 재고 현황을 확인해 주시겠어요?
       (Ibeon ju jaego hyeonhwangeul hwaginhae jusigesseoyo?)
       Anh/chị kiểm tra giúp tình trạng tồn kho tuần này được không?

창고 직원: 네, 어제 입고된 물량은 이미 확인했습니다.
         (Ne, eoje ipgodoen mullyangeun imi hwaginhaetsseumnida.)
         Vâng, số hàng nhập kho hôm qua tôi đã kiểm tra rồi.

담당자: 재고가 부족하면 공급업체에 발주해 주세요.
       (Jaegoga bujokhamyeon gonggeupeopchee baljuhae juseyo.)
       Nếu thiếu hàng thì hãy đặt hàng với nhà cung cấp giúp tôi.
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>이 제품은 재고가 부족합니다.</strong> (I jepumeun jaegoga bujokhamnida.) — This product is low in stock.</li>
<li><strong>공급망 관리가 물류비를 줄이는 핵심이다.</strong> (Gonggeupmang gwalliga mullyubireul jurineun haeksimida.) — Supply chain management is key to cutting logistics costs.</li>
<li><strong>새 물류센터에서 입고와 출고를 동시에 처리한다.</strong> (Sae mullyu senteoeseo ipgowa chulgoreul dongsie cheorihanda.) — The new logistics center handles stock-in and stock-out at once.</li>
</ul>
<div class="callout"><span class="badge">Note</span> Remember the pair <strong>입고 ↔ 출고</strong> (stock-in vs. stock-out) — it reappears constantly through the logistics half, including in Chapter 6's warehouse operations.</div>`,
    `<span class="eyebrow">KCL401 · Chương 5 · Bài 5.1</span>
<h2>물류 &amp; 공급망 — Từ vựng logistics &amp; chuỗi cung ứng</h2>
<p class="lead">Nửa sau của môn chuyển sang <strong>물류 (logistics)</strong>. Bài này dựng từ vựng nền của <strong>공급망 (chuỗi cung ứng)</strong>: kho bãi, đặt hàng, tồn kho.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>물류        mullyu            logistics
공급망      gonggeupmang      chuỗi cung ứng
재고        jaego             hàng tồn kho
창고        changgo           kho bãi
발주        balju             đặt hàng (mua)
입고        ipgo              nhập kho
출고        chulgo            xuất kho
유통        yutong            lưu thông, phân phối
물류센터    mullyu senteo     trung tâm logistics
공급업체    gonggeupeopche    nhà cung cấp
수요        suyo              nhu cầu
물류비      mullyubi          chi phí logistics
</code></pre>
<h3>Hội thoại — kiểm tra tồn kho trước khi đặt hàng</h3>
<pre><code>담당자: 이번 주 재고 현황을 확인해 주시겠어요?
       (Ibeon ju jaego hyeonhwangeul hwaginhae jusigesseoyo?)
       Anh/chị kiểm tra giúp tình trạng tồn kho tuần này được không?

창고 직원: 네, 어제 입고된 물량은 이미 확인했습니다.
         (Ne, eoje ipgodoen mullyangeun imi hwaginhaetsseumnida.)
         Vâng, số hàng nhập kho hôm qua tôi đã kiểm tra rồi.

담당자: 재고가 부족하면 공급업체에 발주해 주세요.
       (Jaegoga bujokhamyeon gonggeupeopchee baljuhae juseyo.)
       Nếu thiếu hàng thì hãy đặt hàng với nhà cung cấp giúp tôi.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>이 제품은 재고가 부족합니다.</strong> (I jepumeun jaegoga bujokhamnida.) — Sản phẩm này đang thiếu hàng tồn kho.</li>
<li><strong>공급망 관리가 물류비를 줄이는 핵심이다.</strong> (Gonggeupmang gwalliga mullyubireul jurineun haeksimida.) — Quản lý chuỗi cung ứng là chìa khoá để giảm chi phí logistics.</li>
<li><strong>새 물류센터에서 입고와 출고를 동시에 처리한다.</strong> (Sae mullyu senteoeseo ipgowa chulgoreul dongsie cheorihanda.) — Trung tâm logistics mới xử lý nhập kho và xuất kho cùng lúc.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Nhớ cặp <strong>입고 ↔ 출고</strong> (nhập kho vs xuất kho) — cặp này lặp lại xuyên suốt nửa logistics, kể cả trong vận hành kho ở Chương 6.</div>`,
  ]]);

const c5q = quiz('kcl401-quiz-5', 'Quiz 5 — Logistics & supply chain|||Quiz 5 — Logistics & chuỗi cung ứng', [
  { id: 'q1', question: '"공급망" nghĩa là gì?', options: ['Chuỗi cung ứng', 'Chuỗi truyền hình', 'Mạng xã hội', 'Hệ thống báo chí'], correctIndex: 0, explanation: '공급망 (gonggeupmang) = supply chain, chuỗi cung ứng.' },
  { id: 'q2', question: '"재고" là gì?', options: ['Hàng tồn kho', 'Bài báo', 'Thông cáo báo chí', 'Container'], correctIndex: 0, explanation: '재고 (jaego) = inventory, hàng tồn kho.' },
  { id: 'q3', question: 'Từ nào nghĩa "nhập kho"?', options: ['입고', '출고', '통관', '배송'], correctIndex: 0, explanation: '입고 (ipgo) = stock-in, nhập kho; 출고 là xuất kho (nghĩa ngược lại).' },
]);

const c6 = doc('kcl401-6-1-unsong-changgo-baesong', '6.1 — Transport, warehousing & delivery (운송, 창고, 배송)|||6.1 — Vận tải, kho bãi & giao nhận (운송, 창고, 배송)',
  '운송/배송: vận chuyển, container, đường biển/hàng không, giao hàng tận nơi, điều phối xe, bốc dỡ.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 6 · Lesson 6.1</span>
<h2>운송 &amp; 배송 — Transport, warehousing &amp; delivery</h2>
<p class="lead">Once goods leave the warehouse they need <strong>운송 (transport)</strong> and <strong>배송 (delivery)</strong>. This lesson covers the modes and operations of moving 화물 (cargo).</p>
<h3>Core vocabulary</h3>
<pre><code>운송        unsong            vận chuyển / transport
배송        baesong           giao hàng / delivery
화물        hwamul            hàng hóa / cargo
컨테이너    keonteineo        container
트럭        teureok           xe tải / truck
항공 운송   hanggong unsong   vận chuyển hàng không / air freight
해상 운송   haesang unsong    vận chuyển đường biển / sea freight
택배        taekbae           chuyển phát nhanh, giao tận nơi / parcel delivery
배차        baecha            điều phối xe / vehicle dispatch
물류창고    mullyu changgo    kho vận / logistics warehouse
픽업        pigeop            lấy hàng / pick-up
상하차      sanghacha         bốc dỡ hàng / loading & unloading
</code></pre>
<h3>Dialogue — arranging a delivery</h3>
<pre><code>고객: 이 화물을 언제 배송받을 수 있나요?
     (I hwamureul eonje baesongbadeul su innayo?)
     Khi nào tôi nhận được lô hàng này?

배차 담당: 내일 오전 트럭으로 픽업 후 해상 운송할 예정입니다.
         (Naeil ojeon teureogeuro pigeop hu haesang unsonghal yejeongimnida.)
         Xe tải sẽ lấy hàng sáng mai, sau đó vận chuyển bằng đường biển.

고객: 급하면 항공 운송도 가능한가요?
     (Geupamyeon hanggong unsongdo ganeunghangayo?)
     Nếu gấp thì có thể chuyển bằng đường hàng không không?
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>컨테이너 상하차 작업이 오늘 끝났다.</strong> (Keonteineo sanghacha jageobi oneul kkeutnatda.) — Container loading/unloading finished today.</li>
<li><strong>택배는 보통 이틀 안에 도착한다.</strong> (Taekbaeneun botong iteul ane dochakhanda.) — Parcels usually arrive within two days.</li>
<li><strong>배차 담당자가 트럭 경로를 조정했다.</strong> (Baecha damdangjaga teureok gyeongnoreul jojeonghaetda.) — The dispatcher adjusted the truck route.</li>
</ul>
<div class="callout"><span class="badge">Note</span> <strong>해상 운송</strong> (sea) is cheaper but slower; <strong>항공 운송</strong> (air) is fast but costlier — exactly the trade-off you'll see again in Chapter 7's export documents.</div>`,
    `<span class="eyebrow">KCL401 · Chương 6 · Bài 6.1</span>
<h2>운송 &amp; 배송 — Vận tải, kho bãi &amp; giao nhận</h2>
<p class="lead">Hàng rời kho thì cần <strong>운송 (vận chuyển)</strong> và <strong>배송 (giao hàng)</strong>. Bài này học các phương thức và thao tác di chuyển 화물 (hàng hóa).</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>운송        unsong            vận chuyển
배송        baesong           giao hàng
화물        hwamul            hàng hóa
컨테이너    keonteineo        container
트럭        teureok           xe tải
항공 운송   hanggong unsong   vận chuyển hàng không
해상 운송   haesang unsong    vận chuyển đường biển
택배        taekbae           chuyển phát nhanh, giao tận nơi
배차        baecha            điều phối xe
물류창고    mullyu changgo    kho vận
픽업        pigeop            lấy hàng
상하차      sanghacha         bốc dỡ hàng
</code></pre>
<h3>Hội thoại — sắp xếp giao hàng</h3>
<pre><code>고객: 이 화물을 언제 배송받을 수 있나요?
     (I hwamureul eonje baesongbadeul su innayo?)
     Khi nào tôi nhận được lô hàng này?

배차 담당: 내일 오전 트럭으로 픽업 후 해상 운송할 예정입니다.
         (Naeil ojeon teureogeuro pigeop hu haesang unsonghal yejeongimnida.)
         Xe tải sẽ lấy hàng sáng mai, sau đó vận chuyển bằng đường biển.

고객: 급하면 항공 운송도 가능한가요?
     (Geupamyeon hanggong unsongdo ganeunghangayo?)
     Nếu gấp thì có thể chuyển bằng đường hàng không không?
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>컨테이너 상하차 작업이 오늘 끝났다.</strong> (Keonteineo sanghacha jageobi oneul kkeutnatda.) — Việc bốc dỡ container đã xong hôm nay.</li>
<li><strong>택배는 보통 이틀 안에 도착한다.</strong> (Taekbaeneun botong iteul ane dochakhanda.) — Hàng chuyển phát thường đến trong hai ngày.</li>
<li><strong>배차 담당자가 트럭 경로를 조정했다.</strong> (Baecha damdangjaga teureok gyeongnoreul jojeonghaetda.) — Người điều phối đã chỉnh lại tuyến đường xe tải.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> <strong>해상 운송</strong> (đường biển) rẻ hơn nhưng chậm; <strong>항공 운송</strong> (đường hàng không) nhanh nhưng đắt hơn — đúng sự đánh đổi bạn sẽ gặp lại ở chứng từ xuất khẩu Chương 7.</div>`,
  ]]);

const c6q = quiz('kcl401-quiz-6', 'Quiz 6 — Transport & delivery|||Quiz 6 — Vận tải & giao nhận', [
  { id: 'q1', question: '"택배" nghĩa là gì?', options: ['Giao hàng tận nơi, chuyển phát nhanh', 'Thông quan', 'Xã luận', 'Hợp đồng quảng cáo'], correctIndex: 0, explanation: '택배 (taekbae) = parcel delivery, giao hàng tận nơi.' },
  { id: 'q2', question: '"해상 운송" nghĩa là gì?', options: ['Vận chuyển đường biển', 'Vận chuyển hàng không', 'Vận chuyển đường sắt', 'Giao hàng nội thành'], correctIndex: 0, explanation: '해상 운송 (haesang unsong) = sea freight, vận chuyển đường biển.' },
  { id: 'q3', question: '"배차" nghĩa là gì?', options: ['Điều phối xe', 'Đặt hàng', 'Khai báo hải quan', 'Họp báo'], correctIndex: 0, explanation: '배차 (baecha) = vehicle dispatch, điều phối xe vận chuyển.' },
]);

const c7 = doc('kcl401-7-1-suchul-suip-tonggwan', '7.1 — Export/import, customs & documents (수출입, 통관)|||7.1 — Xuất nhập khẩu, hải quan & chứng từ (수출입, 통관)',
  '수출입/통관: xuất khẩu, nhập khẩu, thông quan, thuế quan, hải quan, B/L, C/O, invoice, packing list.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 7 · Lesson 7.1</span>
<h2>수출입 &amp; 통관 — Import/export, customs &amp; documents</h2>
<p class="lead">Cross-border logistics needs paperwork. This lesson names the documents that get cargo through <strong>세관 (customs)</strong> and clear <strong>통관 (customs clearance)</strong>.</p>
<h3>Core vocabulary</h3>
<pre><code>수출          suchul                 xuất khẩu / export
수입          suip                   nhập khẩu / import
통관          tonggwan               thông quan / customs clearance
관세          gwanse                 thuế quan / tariff, duty
세관          segwan                 hải quan / customs (office)
선하증권      seonhajeunggwon        vận đơn đường biển / Bill of Lading (B/L)
원산지증명서  wonsanji jeungmyeongseo  giấy chứng nhận xuất xứ / Certificate of Origin (C/O)
인보이스      inboiseu               hóa đơn / invoice
패킹리스트    paekingriseuteu        phiếu đóng gói / packing list
무역          muyeok                 thương mại, ngoại thương / trade
관세청        gwansecheong           Tổng cục Hải quan / Customs Service
신고하다      singohada              khai báo / to declare
</code></pre>
<h3>Dialogue — clearing a shipment</h3>
<pre><code>수입 담당자: 이 화물의 통관 서류가 다 준비됐나요?
           (I hwamurui tonggwan seoryuga da junbidwaennayo?)
           Chứng từ thông quan của lô hàng này chuẩn bị đủ chưa?

물류팀: 네, 선하증권과 원산지증명서, 인보이스까지 다 있습니다.
       (Ne, seonhajeunggwongwa wonsanji jeungmyeongseo, inboiseukkaji da itsseumnida.)
       Vâng, có đủ vận đơn, giấy chứng nhận xuất xứ và hóa đơn.

세관 직원: 관세를 신고하신 후 통관이 완료됩니다.
         (Gwanseereul singohasin hu tonggwani wallyodoemnida.)
         Sau khi khai báo thuế quan thì thông quan sẽ hoàn tất.
</code></pre>
<h3>Sample sentences</h3>
<ul>
<li><strong>이 제품은 수출 통관 절차를 거쳐야 한다.</strong> (I jepumeun suchul tonggwan jeolchareul geochyeoya handa.) — This product must go through export customs clearance.</li>
<li><strong>관세청에 원산지증명서를 제출했다.</strong> (Gwansecheonge wonsanji jeungmyeongseoreul jechulhaetda.) — The certificate of origin was submitted to the Customs Service.</li>
<li><strong>패킹리스트와 인보이스가 일치해야 한다.</strong> (Paekingriseuteuwa inboiseuga ilchihaeya handa.) — The packing list and invoice must match.</li>
</ul>
<div class="callout"><span class="badge">Note</span> Three documents almost always travel together: <strong>인보이스</strong> (value), <strong>패킹리스트</strong> (contents/weight), <strong>선하증권</strong> (proof of shipment) — customs checks all three agree before granting 통관.</div>`,
    `<span class="eyebrow">KCL401 · Chương 7 · Bài 7.1</span>
<h2>수출입 &amp; 통관 — Xuất nhập khẩu, hải quan &amp; chứng từ</h2>
<p class="lead">Logistics xuyên biên giới cần giấy tờ. Bài này gọi tên các chứng từ giúp hàng qua <strong>세관 (hải quan)</strong> và hoàn tất <strong>통관 (thông quan)</strong>.</p>
<h3>Từ vựng cốt lõi</h3>
<pre><code>수출          suchul                 xuất khẩu
수입          suip                   nhập khẩu
통관          tonggwan               thông quan
관세          gwanse                 thuế quan
세관          segwan                 hải quan
선하증권      seonhajeunggwon        vận đơn đường biển (B/L)
원산지증명서  wonsanji jeungmyeongseo  giấy chứng nhận xuất xứ (C/O)
인보이스      inboiseu               hóa đơn
패킹리스트    paekingriseuteu        phiếu đóng gói
무역          muyeok                 thương mại, ngoại thương
관세청        gwansecheong           Tổng cục Hải quan
신고하다      singohada              khai báo
</code></pre>
<h3>Hội thoại — làm thủ tục thông quan</h3>
<pre><code>수입 담당자: 이 화물의 통관 서류가 다 준비됐나요?
           (I hwamurui tonggwan seoryuga da junbidwaennayo?)
           Chứng từ thông quan của lô hàng này chuẩn bị đủ chưa?

물류팀: 네, 선하증권과 원산지증명서, 인보이스까지 다 있습니다.
       (Ne, seonhajeunggwongwa wonsanji jeungmyeongseo, inboiseukkaji da itsseumnida.)
       Vâng, có đủ vận đơn, giấy chứng nhận xuất xứ và hóa đơn.

세관 직원: 관세를 신고하신 후 통관이 완료됩니다.
         (Gwanseereul singohasin hu tonggwani wallyodoemnida.)
         Sau khi khai báo thuế quan thì thông quan sẽ hoàn tất.
</code></pre>
<h3>Mẫu câu</h3>
<ul>
<li><strong>이 제품은 수출 통관 절차를 거쳐야 한다.</strong> (I jepumeun suchul tonggwan jeolchareul geochyeoya handa.) — Sản phẩm này phải qua thủ tục thông quan xuất khẩu.</li>
<li><strong>관세청에 원산지증명서를 제출했다.</strong> (Gwansecheonge wonsanji jeungmyeongseoreul jechulhaetda.) — Giấy chứng nhận xuất xứ đã nộp cho Tổng cục Hải quan.</li>
<li><strong>패킹리스트와 인보이스가 일치해야 한다.</strong> (Paekingriseuteuwa inboiseuga ilchihaeya handa.) — Phiếu đóng gói và hóa đơn phải khớp nhau.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Ba chứng từ luôn đi cùng nhau: <strong>인보이스</strong> (giá trị), <strong>패킹리스트</strong> (nội dung/trọng lượng), <strong>선하증권</strong> (bằng chứng đã gửi hàng) — hải quan đối chiếu cả ba khớp nhau mới cho <strong>통관</strong>.</div>`,
  ]]);

const c7q = quiz('kcl401-quiz-7', 'Quiz 7 — Export/import & customs|||Quiz 7 — Xuất nhập khẩu & hải quan', [
  { id: 'q1', question: '"통관" nghĩa là gì?', options: ['Thông quan', 'Xuất khẩu', 'Nhập khẩu', 'Vận đơn'], correctIndex: 0, explanation: '통관 (tonggwan) = customs clearance, thông quan.' },
  { id: 'q2', question: '"원산지증명서" là chứng từ nào?', options: ['Giấy chứng nhận xuất xứ (C/O)', 'Hóa đơn', 'Phiếu đóng gói', 'Vận đơn đường biển'], correctIndex: 0, explanation: '원산지증명서 (wonsanji jeungmyeongseo) = Certificate of Origin, C/O.' },
  { id: 'q3', question: '"선하증권" tương ứng chứng từ nào?', options: ['Bill of Lading (vận đơn đường biển, B/L)', 'Invoice (hóa đơn)', 'Packing List (phiếu đóng gói)', 'Certificate of Origin (C/O)'], correctIndex: 0, explanation: '선하증권 (seonhajeunggwon) = Bill of Lading, B/L — chứng từ vận tải biển.' },
]);

const c8 = doc('kcl401-8-1-on-tap-tong-hop', '8.1 — Review: combined media & logistics scenario|||8.1 — Ôn tập: tình huống truyền thông & logistics tổng hợp',
  'Ôn tập toàn bộ 7 chương qua một tình huống: đội PR của công ty logistics tổ chức họp báo khai trương trung tâm mới.',
  [[
    `<span class="eyebrow">KCL401 · Chapter 8 · Lesson 8.1</span>
<h2>Review — a media &amp; logistics crossover story</h2>
<p class="lead">The final lesson combines both halves: a logistics company's <strong>홍보팀 (PR team)</strong> holds a <strong>기자회견 (press conference)</strong> about its new <strong>물류센터 (logistics center)</strong>, and a journalist writes it up.</p>
<h3>Full vocabulary recap</h3>
<pre><code>Media/PR:   언론, 미디어, 기자, 편집자, 방송, 뉴스, 특종, 언론사,
            속보, 사설, 여론, 보도하다, 광고, SNS, 콘텐츠,
            인플루언서, 조회수, 바이럴, 보도자료, 기자회견,
            홍보팀, 위기관리, 공식 입장

Logistics:  물류, 공급망, 재고, 창고, 발주, 입고, 출고, 유통,
            물류센터, 공급업체, 운송, 배송, 화물, 컨테이너,
            해상 운송, 항공 운송, 택배, 배차, 상하차,
            수출, 수입, 통관, 관세, 세관, 선하증권,
            원산지증명서, 인보이스, 패킹리스트
</code></pre>
<h3>Reading — the crossover press release</h3>
<pre><code>[보도자료] OO물류, 신규 물류센터 기자회견 개최

OO물류 홍보팀은 오늘 신규 물류센터 개장을 알리는 기자회견을
열었다. 담당자는 "이번 물류센터로 입고·출고 처리 속도가
빨라지고, 해상·항공 운송을 연계한 통관 절차도 간소화된다"고
답변했다. 여러 언론사 기자들이 취재했으며, 저녁 뉴스에도
관련 소식이 보도됐다. SNS에서도 관련 콘텐츠의 조회수가
빠르게 늘고 있다.

Dịch: [Thông cáo báo chí] OO Logistics tổ chức họp báo khai
trương trung tâm logistics mới
Đội PR của OO Logistics hôm nay đã tổ chức họp báo công bố khai
trương trung tâm logistics mới. Người phụ trách trả lời: "Trung
tâm này giúp tăng tốc xử lý nhập/xuất kho, và đơn giản hoá thủ
tục thông quan kết hợp vận chuyển đường biển-hàng không." Nhiều
phóng viên từ các cơ quan báo chí đã tác nghiệp, và tin liên quan
cũng được đưa trong bản tin tối. Trên SNS, lượt xem nội dung liên
quan cũng đang tăng nhanh.
</code></pre>
<div class="callout"><span class="badge">Exam tip</span> Notice how one story pulls vocabulary from every chapter — press release (Ch.4) + logistics center (Ch.5) + transport modes (Ch.6) + customs (Ch.7) + news coverage (Ch.1–2) + SNS buzz (Ch.3). Real Korean business news mixes domains exactly like this.</div>`,
    `<span class="eyebrow">KCL401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập — tình huống giao thoa truyền thông &amp; logistics</h2>
<p class="lead">Bài cuối gộp cả hai nửa: <strong>홍보팀 (đội PR)</strong> của một công ty logistics tổ chức <strong>기자회견 (họp báo)</strong> về <strong>물류센터 (trung tâm logistics)</strong> mới, và một phóng viên viết bài đưa tin.</p>
<h3>Ôn lại toàn bộ từ vựng</h3>
<pre><code>Truyền thông/PR:  언론, 미디어, 기자, 편집자, 방송, 뉴스, 특종, 언론사,
                  속보, 사설, 여론, 보도하다, 광고, SNS, 콘텐츠,
                  인플루언서, 조회수, 바이럴, 보도자료, 기자회견,
                  홍보팀, 위기관리, 공식 입장

Logistics:        물류, 공급망, 재고, 창고, 발주, 입고, 출고, 유통,
                  물류센터, 공급업체, 운송, 배송, 화물, 컨테이너,
                  해상 운송, 항공 운송, 택배, 배차, 상하차,
                  수출, 수입, 통관, 관세, 세관, 선하증권,
                  원산지증명서, 인보이스, 패킹리스트
</code></pre>
<h3>Đọc hiểu — thông cáo báo chí giao thoa</h3>
<pre><code>[보도자료] OO물류, 신규 물류센터 기자회견 개최

OO물류 홍보팀은 오늘 신규 물류센터 개장을 알리는 기자회견을
열었다. 담당자는 "이번 물류센터로 입고·출고 처리 속도가
빨라지고, 해상·항공 운송을 연계한 통관 절차도 간소화된다"고
답변했다. 여러 언론사 기자들이 취재했으며, 저녁 뉴스에도
관련 소식이 보도됐다. SNS에서도 관련 콘텐츠의 조회수가
빠르게 늘고 있다.

Dịch: [Thông cáo báo chí] OO Logistics tổ chức họp báo khai
trương trung tâm logistics mới
Đội PR của OO Logistics hôm nay đã tổ chức họp báo công bố khai
trương trung tâm logistics mới. Người phụ trách trả lời: "Trung
tâm này giúp tăng tốc xử lý nhập/xuất kho, và đơn giản hoá thủ
tục thông quan kết hợp vận chuyển đường biển-hàng không." Nhiều
phóng viên từ các cơ quan báo chí đã tác nghiệp, và tin liên quan
cũng được đưa trong bản tin tối. Trên SNS, lượt xem nội dung liên
quan cũng đang tăng nhanh.
</code></pre>
<div class="callout"><span class="badge">Mẹo thi</span> Để ý một bài viết duy nhất kéo từ vựng từ mọi chương — thông cáo báo chí (C.4) + trung tâm logistics (C.5) + phương thức vận tải (C.6) + hải quan (C.7) + đưa tin (C.1–2) + hiệu ứng SNS (C.3). Tin kinh tế Hàn Quốc thật sự trộn các lĩnh vực đúng kiểu này.</div>`,
  ]]);

const c8q = quiz('kcl401-quiz-8', 'Quiz 8 — Final review|||Quiz 8 — Ôn tập tổng hợp', [
  { id: 'q1', question: 'Từ nào thuộc lĩnh vực truyền thông (không phải logistics)?', options: ['보도자료', '창고', '통관', '컨테이너'], correctIndex: 0, explanation: '보도자료 (bodojaryo, thông cáo báo chí) thuộc truyền thông/PR; ba từ còn lại thuộc logistics.' },
  { id: 'q2', question: 'Từ nào thuộc lĩnh vực logistics?', options: ['기자회견', '공급망', '인플루언서', '헤드라인'], correctIndex: 1, explanation: '공급망 (gonggeupmang, chuỗi cung ứng) thuộc logistics; ba từ còn lại thuộc truyền thông.' },
  { id: 'q3', question: '"물류센터" nghĩa là gì?', options: ['Trung tâm logistics', 'Trung tâm báo chí', 'Trung tâm quảng cáo', 'Trung tâm PR'], correctIndex: 0, explanation: '물류센터 (mullyu senteo) = logistics center, trung tâm logistics.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'KCL401',
    slug: 'kcl401-tieng-han-truyen-thong-va-logictics',
    title: 'Tiếng Hàn truyền thông và Logistics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KCL401.webp',
    shortDescription: 'Korean for media & logistics: press/broadcast vocab, news reading, ads & SNS, PR press releases — then supply chain, transport/warehousing, import-export customs docs. Hangeul + romaja + Vietnamese, dialogues & quizzes.|||Tiếng Hàn chuyên ngành Truyền thông & Logistics: từ vựng báo chí/phát thanh, đọc tin tức, quảng cáo & SNS, PR/thông cáo báo chí — rồi chuỗi cung ứng, vận tải/kho bãi, chứng từ xuất nhập khẩu hải quan. Hangeul + romaja + nghĩa Việt, hội thoại & quiz.',
    description: 'Môn <strong>KCL401 — Tiếng Hàn truyền thông và Logistics</strong> (ngành Ngôn ngữ Hàn, kỳ 5) dạy từ vựng &amp; hội thoại chuyên ngành kép, bám giáo trình <em>미디어 한국어 (Media Korean)</em> và <em>물류 한국어 (Logistics Korean)</em>.<br><br><strong>4 chương truyền thông:</strong> từ vựng báo chí (언론, 미디어) → đọc-hiểu tin tức (뉴스) → quảng cáo &amp; SNS (광고) → phỏng vấn, thông cáo báo chí &amp; PR (보도자료).<br><br><strong>4 chương logistics:</strong> từ vựng chuỗi cung ứng (물류, 공급망) → vận tải, kho bãi &amp; giao nhận (운송, 창고, 배송) → xuất nhập khẩu &amp; hải quan (수출입, 통관) → ôn tập tình huống tổng hợp.<br><br>Mỗi chương có bảng từ vựng Hangeul + romaja + nghĩa Việt/Anh, hội thoại hoặc bài đọc thực tế, mẫu câu, và quiz kiểm tra.',
    whatYouLearn: 'Từ vựng báo chí & truyền thông (언론, 기자, 방송, 특종); đọc-hiểu bản tin (속보, 여론, 보도하다); quảng cáo & mạng xã hội (광고, SNS, 인플루언서, 바이럴); thông cáo báo chí & PR (보도자료, 기자회견, 위기관리); từ vựng logistics & chuỗi cung ứng (물류, 공급망, 재고, 입고/출고); vận tải, kho bãi & giao nhận (운송, 배송, 컨테이너, 해상/항공 운송); xuất nhập khẩu & hải quan (수출입, 통관, 관세, 선하증권, 인보이스); đọc hiểu tình huống truyền thông-logistics tổng hợp.',
    requirements: 'Đã học tiếng Hàn sơ-trung cấp (đọc được Hangeul, ngữ pháp câu cơ bản). Xem điều kiện tiên quyết chính thức trong khung chương trình ngành Ngôn ngữ Hàn trên FLM.',
  },
  sections: [
    { title: 'Chương 1 — Từ vựng báo chí & truyền thông|||Chapter 1 — Press & media vocabulary', description: '언론, 미디어: nhà báo, biên tập viên, phát sóng, tin độc quyền.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đọc-hiểu tin tức|||Chapter 2 — News reading', description: '뉴스: tin nóng, xã luận, dư luận, đưa tin.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Quảng cáo & mạng xã hội|||Chapter 3 — Advertising & SNS', description: '광고, SNS: influencer, hashtag, lượt xem, viral.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phỏng vấn, thông cáo báo chí & PR|||Chapter 4 — Interviews & PR', description: '보도자료: họp báo, đội PR, quản lý khủng hoảng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Từ vựng logistics & chuỗi cung ứng|||Chapter 5 — Logistics & supply chain', description: '물류, 공급망: tồn kho, kho bãi, nhập/xuất kho.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Vận tải, kho bãi & giao nhận|||Chapter 6 — Transport & delivery', description: '운송, 배송: container, đường biển/hàng không, chuyển phát.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Xuất nhập khẩu, hải quan & chứng từ|||Chapter 7 — Import/export & customs', description: '수출입, 통관: B/L, C/O, invoice, packing list.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập tổng hợp|||Chapter 8 — Final review', description: 'Tình huống giao thoa truyền thông & logistics.', lessons: [c8, c8q] },
  ],
};

