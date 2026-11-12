/**
 * Đề 2 — Academic Reading, sau TẬP 2 NGÀY 12 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 12/11/2026.
 * Mức band 4.5: đúng format thật (3 passage · 40 câu · 60 phút), từ vựng A2–B1, paraphrase chủ yếu đồng nghĩa / đổi loại từ,
 * vài câu đổi cấu trúc. Chỉ dùng dạng ĐÃ DẠY tới Tập 2 Ngày 12 (Tập 1 + T2 N2 Summary từ trong bài · N4 Note · N6 TFNG 2 ·
 * N8 Short answer · N10 MCQ · N12 Matching headings):
 *   Passage 1 (môi trường — túi ni lông):          Note completion · TFNG
 *   Passage 2 (sức khoẻ — Semmelweis và rửa tay):  Matching headings · MCQ (4 lựa chọn) · Summary (từ trong bài)
 *   Passage 3 (giao thông — xe đạp công cộng):     Short answer · Matching features · Sentence completion
 * DỮ KIỆN THẬT đã đối chiếu 12/11/2026 (Wikipedia: Plastic shopping bag · Phase-out of lightweight plastic bags · Ignaz
 * Semmelweis · Bicycle-sharing system · Vélib' · Provo (movement) · Copenhagen City Bikes): Thulin/Celloplast, bằng sáng chế 1965; Kroger + Safeway 1982; lũ Bangladesh
 * 1988 & 1998, lệnh cấm 2002; Ireland 3/2002, 15 cent, giảm ~90%; Đan Mạch 1993; Rwanda 2008; Kenya 2017; Anh 5p 2015;
 * Semmelweis 1818 Buda, 1846 Vienna, ~10% vs <4%, Kolletschka 1847, 5/1847 chlorinated lime, 18% (4/1847) → ~2% (6) → ~1% (7),
 * rời Vienna 1850, sách 1861, mất 1865 tuổi 47; Provo 1965; Copenhagen 1995; Rennes 1998; Lyon 2005; Vélib' 7/2007 ~7.000 xe /
 * 750 trạm, 20 triệu chuyến năm đầu, ≥3.000 xe mất; Trung Quốc 2017: >70 hãng, ~16 triệu xe, Bắc Kinh >2 triệu; ~3.000 thành phố;
 * Copenhagen City Bikes (5/1995): đặt cọc đồng xu, nhà tài trợ quảng cáo trên xe. SOÁT ĐỘC LẬP 12/11/2026 (web): túi cotton 131 lần
 * (UK Environment Agency 2011) ✓; Thulin mang túi gấp trong túi áo (lời con trai, BBC 2019 qua The Week) ✓; linh mục đổi đường,
 * thôi rung chuông ✓; rửa dụng cụ (1848) ✓; chlorinated lime vì khử mùi tử thi ✓; "irresponsible murderers" ✓; WHO 5/5 ✓;
 * Copenhagen lốp cao su đặc + đồng xu 20 DKK ✓ (đổi "worth very little" → "much less than a bicycle"); ofo 2015 ✓; ~70 hãng /
 * 16 triệu xe / Bắc Kinh 2,35 triệu (China Daily 2017) ✓. White Bicycle Plan: KHÔNG kiểm được "lasted less than a month" / ném
 * xuống kênh ⇒ viết lại theo Wikipedia (xe không khoá, luật buộc khoá, cảnh sát thu); Q28/Q33 sửa theo. Còn theo nghiên cứu, không
 * đối chiếu nguồn cụ thể: phần lớn chuyến xe chia sẻ thay cho đi bộ / phương tiện công cộng chứ không thay ô tô.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE2: DeDoc = {
  id: 'doc-de2',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 2 (Tập 2 · Ngày 12)',
  boDe: 'Đề 2',
  capDo: 'Band 4.5',
  moTa: 'The rise and fall of the plastic bag · The doctor who asked people to wash their hands · Sharing the bicycle',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — môi trường ════════════════ */
    {
      so: 1,
      tieuDe: 'The Rise and Fall of the Plastic Bag',
      phuDe: 'It was invented to help the planet. So what went wrong?',
      gioiThieu: 'You should spend about 20 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      doan: [
        { s: `Go into almost any shop in the world, and your shopping will probably be handed to you in a thin plastic bag. It weighs only a few grams, yet it can carry several kilos of food. It is also extremely cheap to produce. It is no surprise, then, that by some estimates people now use between 500 billion and one trillion plastic bags every year. What is surprising is that this everyday object is only about sixty years old.` },
        { s: `The modern plastic bag was created in the early 1960s by a Swedish engineer, Sten Gustaf Thulin. He worked for a packaging company called Celloplast, in the town of Norrköping. Thulin found a way to fold and cut a flat tube of plastic so that it became a strong bag with handles, made from a single piece. The company patented his design in 1965. According to his son, Thulin believed that his invention would be good for the planet. At that time, shops gave their customers paper bags, and making paper meant cutting down trees. A plastic bag was light and strong, and it could be used again and again. Thulin himself always carried a folded bag in his pocket.` },
        { s: `For some years, plastic bags were used mainly in Europe. Then, in 1982, two of the largest supermarket companies in the United States began to offer them instead of paper bags, because they cost less. Other shops quickly followed, and within a few years the plastic bag had replaced paper in many countries. Unfortunately, customers did not behave as Thulin had expected. Because the bags were given away free, people saw them as rubbish. A typical bag was used for only about twelve minutes – the time it takes to carry the shopping home – and was then thrown away.` },
        { s: `The problems soon became clear. A plastic bag does not break down easily, and scientists think that it may stay in the environment for hundreds of years. Light bags are carried by the wind into trees, rivers and finally the sea. There, turtles sometimes eat them, because a bag floating in the water looks like a jellyfish, which is their natural food. On land, bags cause a different kind of damage. In Bangladesh, plastic bags blocked the drains of the cities, and this made the terrible floods of 1988 and 1998 even worse. In 2002, Bangladesh became the first country in the world to ban thin plastic bags.` },
        { s: `Other countries chose a different method. In March 2002, Ireland introduced a tax of 15 cents on every plastic bag. Shops had to charge customers for each bag, and the money was spent on environmental projects. The result was dramatic: within weeks, the number of bags used fell by about 90 per cent. Denmark had in fact taxed bags since 1993, but Ireland's success was the example that many governments decided to follow. Rwanda banned plastic bags completely in 2008, and Kenya did the same in 2017. England waited until 2015 before it introduced a charge of five pence.` },
        { s: `Is the answer, then, to go back to paper, or to use cotton bags? It is not so simple. Making a paper bag uses more energy and water than making a plastic one, and paper bags tear easily, so they are rarely used twice. A cotton bag is strong, but growing cotton needs a great deal of land and water. Studies suggest that a cotton bag must be used more than a hundred times before it is better for the environment than a plastic bag. Thick plastic "bags for life" are another choice, but they contain much more plastic than a thin bag, so they are only useful if shoppers really do bring them back to the shop every time.` },
        { s: `In the end, the most important thing is not what a bag is made of, but how many times it is used. This is exactly what Sten Gustaf Thulin understood sixty years ago. His son has said that his father would find it very strange that people simply throw the bags away. Perhaps the plastic bag was never the real problem. The real problem is the habit of using something once and then forgetting about it.` },
      ],
      nhom: [
        {
          id: 'p1-note', tu: 1, den: 6, dang: 'note',
          huongDan: 'Complete the notes below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'The plastic bag',
          dong: [
            '## Invention',
            '• created by a Swedish [[1]] who worked for a packaging company',
            '• the design was patented in [[2]]',
            '• the inventor preferred plastic to paper because no [[3]] had to be cut down',
            '## Spread',
            '• 1982: two big American supermarket companies started to use plastic bags',
            '• the bags cost nothing, so customers thought of them as [[4]]',
            '## Problems',
            '• in the sea: to a turtle, a floating bag looks like a [[5]]',
            '• on land: in Bangladesh, bags blocked the [[6]] in cities and made floods worse',
          ],
        },
        {
          id: 'p1-tfng', tu: 7, den: 13, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 7, s: 'Thulin expected people to use each plastic bag many times.' },
            { n: 8, s: 'Celloplast became a very rich company because of the plastic bag.' },
            { n: 9, s: 'Plastic bags were more expensive for American supermarkets than paper bags.' },
            { n: 10, s: 'A typical plastic bag is used for less than a quarter of an hour.' },
            { n: 11, s: 'Bangladesh banned thin plastic bags before any other country did.' },
            { n: 12, s: 'In Ireland, the number of plastic bags used fell slowly after the tax was introduced.' },
            { n: 13, s: 'Most shoppers in England were against the five-pence charge.' },
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — sức khoẻ ════════════════ */
    {
      so: 2,
      tieuDe: 'The Doctor Who Asked People to Wash Their Hands',
      phuDe: 'Ignaz Semmelweis found a simple way to save lives – but he could not make other doctors listen',
      gioiThieu: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `Today, everybody knows that washing your hands is one of the simplest ways to stay healthy. Parents teach it to small children, and posters in hospitals remind doctors and nurses to do it before they touch a patient. Yet less than two hundred years ago, most doctors did not wash their hands at all. They often went from one patient to the next in the same dirty coat. The man who first showed that clean hands could save lives was a Hungarian doctor, Ignaz Semmelweis – and for most of his life, almost nobody believed him.` },
        { nhan: 'B', s: `Semmelweis was born in 1818 in Buda, which is now part of Budapest. In 1846, he began work as an assistant at the Vienna General Hospital, one of the largest hospitals in Europe. The hospital had two clinics where women could give birth. In the First Clinic, the women were looked after by doctors and medical students. In the Second Clinic, the work was done by midwives – women who are trained to help mothers during a birth. Semmelweis soon noticed something very strange. In the First Clinic, about ten per cent of the mothers died from a fever a few days after their babies were born. In the Second Clinic, the figure was under four per cent. The difference was well known in the city, and some women begged on their knees to be sent to the midwives instead of the doctors.` },
        { nhan: 'C', s: `Semmelweis wanted to find the reason. He compared everything in the two clinics: the food, the air, the number of patients, even the position in which the women gave birth. Nothing explained the difference. He even asked the priest of the hospital to stop ringing his bell when he walked through the First Clinic, because he thought that the sound might frighten the women. Then, in 1847, his friend and colleague Jakob Kolletschka died. Kolletschka had been examining a dead body with his students when one of them accidentally cut him with a knife. He quickly developed a fever, and his illness was just like the illness of the mothers. Semmelweis suddenly understood. The doctors and students of the First Clinic often examined dead bodies in the morning and then went straight to the women in the clinic. Something from the bodies was being carried on their hands. The midwives never did this kind of work, so their patients were safer.` },
        { nhan: 'D', s: `In May 1847, Semmelweis introduced a new rule. Before entering the clinic, every doctor and student had to wash his hands in a bowl of water mixed with a strong chemical called chlorinated lime. He chose it because it removed the smell of the dead bodies better than soap did. Later, he ordered that the instruments used in the clinic should be washed in the same way. The results came immediately. In April, before the rule, 18 per cent of the mothers in the First Clinic had died. In June, the figure was about two per cent, and in July it was just over one per cent.` },
        { nhan: 'E', s: `We might expect that Semmelweis became famous at once. In fact, the opposite happened. Many doctors were angry. They were educated gentlemen, and they did not like the idea that their own hands were killing patients. Besides, nobody at that time knew about germs, so Semmelweis could not explain exactly why his method worked. He did not make things easier for himself, either. He was slow to publish his results – his book did not appear until 1861 – and he wrote rude letters to doctors who disagreed with him, calling them murderers. In 1850, he left Vienna and returned to Hungary. Later, his health became worse, and in 1865 he was taken to a hospital for the mentally ill. He died there two weeks later, at the age of 47.` },
        { nhan: 'F', s: `In the 1860s, the French scientist Louis Pasteur showed that tiny living things, called germs, cause many diseases. In Britain, a surgeon called Joseph Lister then used this idea to make operations much safer. At last, doctors could understand why Semmelweis had been right, and hand washing slowly became normal in hospitals. Today, Semmelweis is known as the "saviour of mothers", and a university in Budapest carries his name. Every year on 5 May, the World Health Organization holds a special day to remind health workers to clean their hands. In many hospitals, there is now a bottle of hand gel beside every bed. It is a simple message, but, as the story of Semmelweis shows, simple messages are not always easy to accept.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 19, dang: 'heading',
          huongDan: 'Reading Passage 2 has six paragraphs, **A–F**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–ix**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'A simple rule and a sudden improvement' },
              { k: 'ii', t: 'The dangers of modern hospitals' },
              { k: 'iii', t: 'Two clinics with very different results' },
              { k: 'iv', t: 'Recognition that came too late' },
              { k: 'v', t: 'A habit that was once unknown in medicine' },
              { k: 'vi', t: 'How Semmelweis trained the midwives' },
              { k: 'vii', t: 'A death that provided the answer' },
              { k: 'viii', t: 'An idea that other doctors refused to accept' },
              { k: 'ix', t: 'The high cost of keeping hospitals clean' },
            ],
          },
          cau: [
            { n: 14, s: 'Paragraph A' },
            { n: 15, s: 'Paragraph B' },
            { n: 16, s: 'Paragraph C' },
            { n: 17, s: 'Paragraph D' },
            { n: 18, s: 'Paragraph E' },
            { n: 19, s: 'Paragraph F' },
          ],
        },
        {
          id: 'p2-mcq', tu: 20, den: 23, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            {
              n: 20, s: 'What did Semmelweis notice soon after he began working at the hospital?',
              chon: [
                { k: 'A', t: 'The First Clinic had far more patients than the Second Clinic.' },
                { k: 'B', t: 'The medical students were badly trained.' },
                { k: 'C', t: 'Mothers were more likely to die in the clinic run by doctors.' },
                { k: 'D', t: 'Most women preferred to give birth at home.' },
              ],
            },
            {
              n: 21, s: 'Why were the patients in the Second Clinic safer?',
              chon: [
                { k: 'A', t: 'The midwives did not examine dead bodies.' },
                { k: 'B', t: 'The midwives washed their hands regularly.' },
                { k: 'C', t: 'The food and the air were better there.' },
                { k: 'D', t: 'There were fewer patients there.' },
              ],
            },
            {
              n: 22, s: 'Why did Semmelweis choose chlorinated lime?',
              chon: [
                { k: 'A', t: 'It was cheaper than soap.' },
                { k: 'B', t: 'The midwives were already using it.' },
                { k: 'C', t: 'Other doctors had recommended it.' },
                { k: 'D', t: 'It was better than soap at getting rid of a smell.' },
              ],
            },
            {
              n: 23, s: 'According to the writer, one reason why other doctors did not accept the idea was that Semmelweis',
              chon: [
                { k: 'A', t: 'refused to write a book about it.' },
                { k: 'B', t: 'was unable to say exactly why it worked.' },
                { k: 'C', t: 'could not show any clear results.' },
                { k: 'D', t: 'left Vienna before he had tested it.' },
              ],
            },
          ],
        },
        {
          id: 'p2-summary', tu: 24, den: 26, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'After Semmelweis',
          dong: [
            'In the 1860s, Louis Pasteur proved that many diseases are caused by [[24]]. Joseph Lister, a British [[25]], used this discovery to make operations less dangerous. Doctors finally understood that Semmelweis had been right. He is now called the "saviour of [[26]]", and a university in Budapest is named after him.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — giao thông ════════════════ */
    {
      so: 3,
      tieuDe: 'Sharing the Bicycle',
      phuDe: 'How a failed experiment in Amsterdam became part of city transport all over the world',
      gioiThieu: 'You should spend about 20 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      doan: [
        { s: `In many cities around the world, you can now pick up a bicycle on one street, ride it across town and leave it on another. You do not own the bicycle; you simply borrow it for a short time. Bike-sharing schemes like this exist today in about 3,000 cities. They seem like a very modern idea, but the first one was tried sixty years ago – and it was a complete failure.` },
        { s: `In the summer of 1965, a group of young people in Amsterdam, who called themselves the Provos, were angry about the growing number of cars in their city. One of them, Luud Schimmelpennink, suggested a simple plan. The group painted some bicycles white and left them in the streets for anyone to use, free of charge. The "White Bicycle Plan" did not last long. The bicycles had no locks, and a city law said that bicycles in the street had to be locked, so the police soon took them away.` },
        { s: `Thirty years later, the city of Copenhagen tried again, with a cleverer system. In 1995, it put specially designed bicycles in stands around the city centre. To take one, a user had to put a coin into a lock on the bicycle, in the same way as with a supermarket trolley. When the bicycle was returned to any stand, the coin came back. The bikes were heavy and had solid rubber tyres which could not go flat, and their unusual shape made them easy to recognise. The cost of the scheme was covered by advertisements on the bicycles. However, the coin was worth much less than a bicycle, and nobody knew who was using each bicycle. Many simply disappeared.` },
        { s: `The real change came with technology. In 1998, the French city of Rennes introduced a scheme in which users opened the lock with an electronic card. For the first time, the operator knew exactly who had taken each bicycle and when. People who did not bring a bicycle back could be asked to pay for it. In 2005, the city of Lyon used the same idea on a much larger scale, and two years later Paris followed with the most famous scheme of all, Vélib'. It opened in July 2007 with about 7,000 bicycles at 750 stations, and the first thirty minutes of every journey were free for members. In its first year, people made about 20 million trips. There was bad news too: at least 3,000 bikes were stolen in that year, and many more were damaged.` },
        { s: `After Paris, cities everywhere wanted a scheme of their own. But stations full of locked bicycles are expensive to build. They also take away space for parking cars, which is not always popular with local shopkeepers. And they have another weakness. In the morning, thousands of people ride into the city centre, so the stations there fill up while stations in the suburbs become empty. In the evening, the opposite can happen. The operators therefore have to pay workers to move bicycles around the city in lorries all day.` },
        { s: `Around 2015, companies in China offered a solution: bicycles without stations. Each bike had its own lock, which a user opened with a mobile phone. At the end of the journey, the bicycle could be left almost anywhere. A ride cost very little, and there was no station to look for. The idea spread extremely fast. By 2017, more than 70 companies had put about 16 million of these bikes onto the streets of Chinese cities, and Beijing alone had over two million. It was far more than people needed. Pavements were blocked by carelessly parked bicycles, and when several companies went out of business, millions of unwanted bikes ended up in enormous piles outside the cities.` },
        { s: `Since then, cities have learned to control bike sharing more carefully. Many now limit the number of bicycles and mark special parking areas. The newest schemes offer electric bicycles, which make hills and long distances easier, although they cost more to rent. In hilly cities, they have attracted riders who would never have used an ordinary bike. Researchers who have studied bike sharing say that we should be realistic about it. Most trips on shared bikes replace journeys on foot or by public transport, not journeys by car, so the effect on traffic is small. On the other hand, users get more exercise, and a shared bicycle is often the fastest way to travel the last kilometre between a railway station and the office. Sixty years after the white bicycles of Amsterdam, the idea of Schimmelpennink and his friends has finally found its place.` },
      ],
      nhom: [
        {
          id: 'p3-short', tu: 27, den: 30, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS** from the passage for each answer.',
          gioiHan: { tu: 2 },
          dong: [
            'What colour were the bicycles in the Amsterdam plan? [[27]]',
            'Who took the white bicycles away from the streets of Amsterdam? [[28]]',
            'What did users in Copenhagen have to put into the lock in order to take a bicycle? [[29]]',
            'In which French city were electronic cards first used to open the locks? [[30]]',
          ],
        },
        {
          id: 'p3-feature', tu: 31, den: 35, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 31–35) and the list of bike-sharing schemes below.\nMatch each statement with the correct scheme, **A–D**.\nNB You may use any letter more than once.',
          hop: {
            tieuDe: 'List of Schemes',
            ds: [
              { k: 'A', t: 'the scheme in Amsterdam (1965)' },
              { k: 'B', t: 'the scheme in Copenhagen (1995)' },
              { k: 'C', t: 'the scheme in Paris (2007)' },
              { k: 'D', t: 'the schemes in Chinese cities (from about 2015)' },
            ],
          },
          cau: [
            { n: 31, s: 'Users unlocked the bicycles with a mobile phone.' },
            { n: 32, s: 'The bicycles had tyres that could not lose their air.' },
            { n: 33, s: 'The scheme was started by people who were unhappy about the number of cars.' },
            { n: 34, s: 'Members paid nothing for the first half hour of a trip.' },
            { n: 35, s: 'There were many more bicycles than users needed.' },
          ],
        },
        {
          id: 'p3-sentence', tu: 36, den: 40, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'Operators of schemes with stations use [[36]] to carry bicycles from one part of the city to another.',
            'In Chinese cities, bicycles that were parked without care blocked the [[37]].',
            'Millions of bicycles that nobody wanted were left in huge [[38]] outside the cities.',
            'The most recent schemes have [[39]] bicycles, which are more expensive to rent.',
            'According to researchers, bike sharing has only a small effect on [[40]].',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['engineer'], vi: `"The modern plastic bag was created in the early 1960s by a Swedish engineer, Sten Gustaf Thulin. He worked for a packaging company called Celloplast" ⇒ **engineer**. Ô trống đứng sau "a Swedish" nên cần DANH TỪ chỉ người. Bẫy: "company" cũng là danh từ gần đó nhưng ghi chú đã có sẵn "who worked for a packaging company". 📘 Ôn dạng Note completion: Tập 2 Ngày 4 — đọc tiêu đề nhỏ (Invention / Spread / Problems) để biết đang ở đoạn nào.`, ev: `The modern plastic bag was created in the early 1960s by a Swedish engineer, Sten Gustaf Thulin.` },
    2: { a: ['1965'], vi: `"The company patented his design in 1965." ⇒ **1965**. Bẫy số: "the early 1960s" là lúc ông NGHĨ RA cách làm; 1982 là năm siêu thị Mỹ bắt đầu dùng; ghi chú hỏi năm ĐĂNG KÝ SÁNG CHẾ ("patented").`, ev: `The company patented his design in 1965.` },
    3: { a: ['trees'], vi: `"shops gave their customers paper bags, and making paper meant cutting down trees" — ghi chú đổi sang bị động "no ___ had to be cut down" ⇒ **trees** (số nhiều như trong bài).`, ev: `making paper meant cutting down trees` },
    4: { a: ['rubbish'], vi: `"Because the bags were given away free, people saw them as rubbish." — "cost nothing" = "given away free", "thought of them as" = "saw them as" ⇒ **rubbish**. Chính tả: hai chữ b.`, ev: `Because the bags were given away free, people saw them as rubbish.` },
    5: { a: ['jellyfish'], vi: `"turtles sometimes eat them, because a bag floating in the water looks like a jellyfish, which is their natural food" ⇒ **jellyfish** (con sứa — viết liền một từ). Bẫy: "food" cũng đứng gần nhưng "looks like a food" sai ngữ pháp và sai ý.`, ev: `a bag floating in the water looks like a jellyfish, which is their natural food` },
    6: { a: ['drains'], vi: `"In Bangladesh, plastic bags blocked the drains of the cities, and this made the terrible floods of 1988 and 1998 even worse." ⇒ **drains** (cống thoát nước). Bẫy: "floods" là HẬU QUẢ — đã in sẵn ở cuối dòng ghi chú; "rivers" thuộc câu nói về gió thổi túi đi, không phải Bangladesh.`, ev: `In Bangladesh, plastic bags blocked the drains of the cities` },
    7: { a: ['TRUE'], vi: `Thulin tin rằng túi "could be used again and again", bản thân ông luôn mang sẵn một cái túi gấp trong túi áo; bài còn viết "customers did not behave as Thulin had expected" (khách KHÔNG làm như ông mong đợi — tức ông mong họ dùng lại). "many times" = "again and again" ⇒ **TRUE**. 📘 Ôn TFNG: Tập 1 Ngày 12 + Tập 2 Ngày 6 (5 bẫy cơ bản).`, ev: `A plastic bag was light and strong, and it could be used again and again.` },
    8: { a: ['NOT GIVEN'], vi: `Bài chỉ nói Celloplast là công ty bao bì ở Norrköping và công ty đăng ký sáng chế năm 1965. KHÔNG có thông tin nào về việc công ty giàu lên hay không ⇒ **NOT GIVEN**. Đừng suy "phát minh nổi tiếng ⇒ chắc là giàu": TFNG chỉ chấm theo điều bài VIẾT.`, ev: `He worked for a packaging company called Celloplast, in the town of Norrköping.` },
    9: { a: ['FALSE'], vi: `Hai chuỗi siêu thị Mỹ chuyển sang túi ni lông "because they cost less" — túi ni lông RẺ hơn túi giấy. Câu hỏi nói ĐẮT hơn ⇒ ngược hẳn ⇒ **FALSE**.`, ev: `began to offer them instead of paper bags, because they cost less` },
    10: { a: ['TRUE'], vi: `"A typical bag was used for only about twelve minutes" — 12 phút ÍT HƠN 15 phút ("a quarter of an hour" = một phần tư giờ) ⇒ **TRUE**. Dạng bẫy đổi cách nói con số: phải tự quy "a quarter of an hour" ra 15 phút.`, ev: `A typical bag was used for only about twelve minutes` },
    11: { a: ['TRUE'], vi: `"In 2002, Bangladesh became the first country in the world to ban thin plastic bags." — "before any other country did" = "the first country in the world" ⇒ **TRUE**. (Đan Mạch đánh THUẾ từ 1993 — thuế không phải lệnh CẤM, nên không mâu thuẫn.)`, ev: `In 2002, Bangladesh became the first country in the world to ban thin plastic bags.` },
    12: { a: ['FALSE'], vi: `"within weeks, the number of bags used fell by about 90 per cent" — giảm RẤT NHANH (chỉ trong vài tuần). Câu hỏi nói "fell slowly" ⇒ trái ngược ⇒ **FALSE**. Phần "the number… fell" thì đúng, nhưng chỉ cần MỘT chi tiết sai (slowly) là cả câu FALSE.`, ev: `within weeks, the number of bags used fell by about 90 per cent` },
    13: { a: ['NOT GIVEN'], vi: `Về nước Anh, bài chỉ có một câu: năm 2015 mới thu phí 5 penny. KHÔNG nói người mua hàng ủng hộ hay phản đối ⇒ **NOT GIVEN**. Đừng chọn FALSE: muốn FALSE thì bài phải nói điều ngược lại (ví dụ "most shoppers supported the charge").`, ev: `England waited until 2015 before it introduced a charge of five pence.` },

    /* ── Passage 2 ── */
    14: { a: ['v'], vi: `Đoạn A: ngày nay ai cũng biết rửa tay, nhưng "less than two hundred years ago, most doctors did not wash their hands at all" ⇒ thói quen này TỪNG không tồn tại trong ngành y ⇒ **v**. Bẫy: ii ("modern hospitals") — đoạn có nhắc bệnh viện ngày nay nhưng không nói gì về NGUY HIỂM của chúng. 📘 Ôn Matching headings: Tập 2 Ngày 12 — tìm Ý CHÍNH cả đoạn (thường ở câu đầu + câu chuyển ý "Yet / But"), đừng chọn theo một từ trùng.`, ev: `Yet less than two hundred years ago, most doctors did not wash their hands at all.` },
    15: { a: ['iii'], vi: `Đoạn B tả hai khoa sản: Khoa Một (bác sĩ, sinh viên) khoảng 10% sản phụ chết, Khoa Hai (bà đỡ) dưới 4% ⇒ hai khoa, kết quả rất khác nhau ⇒ **iii**. Bẫy: vi ("trained the midwives") — bài nói bà đỡ là người "are trained", nhưng không hề nói Semmelweis đào tạo họ.`, ev: `In the Second Clinic, the figure was under four per cent.` },
    16: { a: ['vii'], vi: `Đoạn C: Semmelweis so sánh mọi thứ mà không ra ("Nothing explained the difference"), rồi cái chết của bạn ông, Kolletschka, khiến ông hiểu ra ("Semmelweis suddenly understood") ⇒ một cái chết đem lại câu trả lời ⇒ **vii**.`, ev: `Then, in 1847, his friend and colleague Jakob Kolletschka died.` },
    17: { a: ['i'], vi: `Đoạn D: "Semmelweis introduced a new rule" (rửa tay bằng nước pha chlorinated lime) và "The results came immediately" — 18% xuống khoảng 2% rồi 1% ⇒ quy định đơn giản + cải thiện tức thì ⇒ **i**. Bẫy: ix ("high cost") — đoạn không nói gì về chi phí.`, ev: `The results came immediately.` },
    18: { a: ['viii'], vi: `Đoạn E: "the opposite happened. Many doctors were angry…" — các bác sĩ khác không chấp nhận, ông rời Vienna rồi mất ⇒ **viii**. Bẫy: iv ("Recognition that came too late") nghe cũng buồn như đoạn này, nhưng đoạn E chưa hề nói đến sự CÔNG NHẬN — phần đó nằm ở đoạn F.`, ev: `In fact, the opposite happened. Many doctors were angry.` },
    19: { a: ['iv'], vi: `Đoạn F: sau công trình của Pasteur và Lister, "At last, doctors could understand why Semmelweis had been right"; ngày nay ông được gọi là "saviour of mothers" — nhưng lúc đó ông đã mất ⇒ sự công nhận đến quá muộn ⇒ **iv**.`, ev: `At last, doctors could understand why Semmelweis had been right, and hand washing slowly became normal in hospitals.` },
    20: { a: ['C'], vi: `"Semmelweis soon noticed something very strange. In the First Clinic (do bác sĩ và sinh viên phụ trách), about ten per cent of the mothers died… In the Second Clinic, the figure was under four per cent." ⇒ sản phụ dễ chết hơn ở khoa của BÁC SĨ ⇒ **C**. A: bài không so số bệnh nhân hai khoa ở đoạn này; B, D: không được nhắc. 📘 Ôn MCQ một đáp án: Tập 2 Ngày 10 — gạch từ khoá câu hỏi ("notice… soon after"), tìm đúng chỗ rồi mới đọc 4 lựa chọn.`, ev: `In the First Clinic, about ten per cent of the mothers died from a fever a few days after their babies were born.` },
    21: { a: ['A'], vi: `"The midwives never did this kind of work, so their patients were safer." — "this kind of work" = khám nghiệm tử thi ("examined dead bodies") ⇒ **A**. Bẫy B: nghe rất hợp lý (bài nói về rửa tay!) nhưng bài KHÔNG nói bà đỡ rửa tay; C và D là những thứ Semmelweis đã so sánh và "Nothing explained the difference".`, ev: `The midwives never did this kind of work, so their patients were safer.` },
    22: { a: ['D'], vi: `"He chose it because it removed the smell of the dead bodies better than soap did." — "getting rid of a smell" = "removed the smell" ⇒ **D**. A (rẻ hơn) không được nhắc; "soap" xuất hiện ở cả A và D nên phải đọc kỹ điều được SO SÁNH.`, ev: `He chose it because it removed the smell of the dead bodies better than soap did.` },
    23: { a: ['B'], vi: `"nobody at that time knew about germs, so Semmelweis could not explain exactly why his method worked" ⇒ **B**. A sai: ông CHẬM xuất bản chứ không từ chối (sách ra năm 1861). C sai: kết quả rất rõ (18% → khoảng 1%). D sai: ông áp dụng quy định năm 1847, đến 1850 mới rời Vienna.`, ev: `Besides, nobody at that time knew about germs, so Semmelweis could not explain exactly why his method worked.` },
    24: { a: ['germs'], vi: `"Louis Pasteur showed that tiny living things, called germs, cause many diseases." — tóm tắt đổi sang bị động "many diseases are caused by ___" ⇒ **germs** (vi trùng). ONE WORD ONLY nên không viết "living things". 📘 Ôn Summary completion (từ trong bài): Tập 2 Ngày 2.`, ev: `the French scientist Louis Pasteur showed that tiny living things, called germs, cause many diseases` },
    25: { a: ['surgeon'], vi: `"In Britain, a surgeon called Joseph Lister then used this idea to make operations much safer." — "a British ___" cần danh từ chỉ nghề ⇒ **surgeon** (bác sĩ phẫu thuật). Bẫy: "scientist" là nghề của Pasteur (người Pháp).`, ev: `In Britain, a surgeon called Joseph Lister then used this idea to make operations much safer.` },
    26: { a: ['mothers'], vi: `"Today, Semmelweis is known as the "saviour of mothers"" ⇒ **mothers** (số nhiều như trong bài).`, ev: `Today, Semmelweis is known as the "saviour of mothers", and a university in Budapest carries his name.` },

    /* ── Passage 3 ── */
    27: { a: ['white'], vi: `"The group painted some bicycles white" (và tên kế hoạch là "White Bicycle Plan") ⇒ **white**. 📘 Ôn Short answer: Tập 2 Ngày 8 — từ để hỏi "What colour" ⇒ đáp án phải là một MÀU, lấy nguyên từ trong bài.`, ev: `The group painted some bicycles white and left them in the streets for anyone to use, free of charge.` },
    28: { a: ['the police', 'police'], vi: `"a city law said that bicycles in the street had to be locked, so the police soon took them away" — "took… away from the streets" = "took them away" ⇒ **(the) police**. Bẫy: "the Provos" là nhóm ĐẶT xe ra đường, không phải người dọn đi; "a city law" là LÝ DO, không phải người làm.`, ev: `so the police soon took them away` },
    29: { a: ['a coin', 'coin'], vi: `"To take one, a user had to put a coin into a lock on the bicycle" ⇒ **(a) coin** (đồng xu). Bẫy: "electronic card" là của Rennes năm 1998; "mobile phone" là của Trung Quốc.`, ev: `To take one, a user had to put a coin into a lock on the bicycle, in the same way as with a supermarket trolley.` },
    30: { a: ['Rennes'], vi: `"In 1998, the French city of Rennes introduced a scheme in which users opened the lock with an electronic card. For the first time…" ⇒ **Rennes**. Bẫy: Lyon (2005) và Paris (2007) cũng là thành phố Pháp nhưng chỉ làm LẠI ý tưởng đó ở quy mô lớn hơn; câu hỏi có chữ "first".`, ev: `In 1998, the French city of Rennes introduced a scheme in which users opened the lock with an electronic card.` },
    31: { a: ['D'], vi: `Trung Quốc: "Each bike had its own lock, which a user opened with a mobile phone." ⇒ **D**. Ba nơi kia: Amsterdam xe không có khoá, Copenhagen dùng đồng xu, Paris dùng thẻ điện tử (ý tưởng của Rennes). 📘 Ôn Matching features: Tập 1 Ngày 10 — khoanh tên từng thành phố trong bài trước, rồi đọc quanh đó.`, ev: `Each bike had its own lock, which a user opened with a mobile phone.` },
    32: { a: ['B'], vi: `Copenhagen: "The bikes were heavy and had solid rubber tyres which could not go flat" — "could not lose their air" = "could not go flat" (lốp đặc, không xẹp) ⇒ **B**.`, ev: `The bikes were heavy and had solid rubber tyres which could not go flat` },
    33: { a: ['A'], vi: `Amsterdam: nhóm Provos "were angry about the growing number of cars in their city" rồi mới bày ra kế hoạch xe trắng — "unhappy about" = "angry about" ⇒ **A**. Ba chương trình kia: bài không nói ai lập ra chúng vì muốn bớt ô tô (đoạn cuối chỉ nói xe đạp chia sẻ hiện nay ít thay được chuyến đi bằng ô tô).`, ev: `were angry about the growing number of cars in their city` },
    34: { a: ['C'], vi: `Paris (Vélib'): "the first thirty minutes of every journey were free for members" — "half hour" = "thirty minutes", "paid nothing" = "free" ⇒ **C**. Bẫy: xe ở Amsterdam cũng "free of charge", nhưng ở đó không có "members" và không có giới hạn nửa giờ đầu.`, ev: `the first thirty minutes of every journey were free for members` },
    35: { a: ['D'], vi: `Trung Quốc: 16 triệu xe — "It was far more than people needed." ⇒ **D** (dùng D lần thứ hai; đề đã báo "You may use any letter more than once").`, ev: `It was far more than people needed.` },
    36: { a: ['lorries'], vi: `"The operators therefore have to pay workers to move bicycles around the city in lorries all day." — "carry… from one part of the city to another" = "move bicycles around the city" ⇒ **lorries** (xe tải; số nhiều của "lorry"). Bẫy: "workers" là NGƯỜI làm việc đó — câu hỏi "use ___ to carry" cần phương tiện. 📘 Ôn Sentence completion: Tập 1 Ngày 4.`, ev: `The operators therefore have to pay workers to move bicycles around the city in lorries all day.` },
    37: { a: ['pavements', 'pavement'], vi: `"Pavements were blocked by carelessly parked bicycles" — câu hỏi đổi bị động thành chủ động và "carelessly parked" thành "parked without care" ⇒ **pavements** (vỉa hè).`, ev: `Pavements were blocked by carelessly parked bicycles` },
    38: { a: ['piles'], vi: `"millions of unwanted bikes ended up in enormous piles outside the cities" — "that nobody wanted" = "unwanted", "huge" = "enormous" ⇒ **piles** (đống).`, ev: `millions of unwanted bikes ended up in enormous piles outside the cities` },
    39: { a: ['electric'], vi: `"The newest schemes offer electric bicycles… although they cost more to rent." — "most recent" = "newest", "more expensive to rent" = "cost more to rent" ⇒ **electric**. Ô trống đứng trước danh từ "bicycles" nên cần TÍNH TỪ.`, ev: `The newest schemes offer electric bicycles, which make hills and long distances easier, although they cost more to rent.` },
    40: { a: ['traffic'], vi: `"Most trips on shared bikes replace journeys on foot or by public transport, not journeys by car, so the effect on traffic is small." ⇒ **traffic**. Bẫy: "exercise" ở câu sau là LỢI ÍCH (users get more exercise), không phải thứ bị "ảnh hưởng nhỏ".`, ev: `so the effect on traffic is small` },
  },
};
