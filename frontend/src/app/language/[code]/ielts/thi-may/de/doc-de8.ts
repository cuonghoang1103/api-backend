/**
 * Đề 8 — Academic Reading, THI CUỐI TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 30). TỰ SOẠN 18/11/2026.
 * Mức band 7.0 — khó hơn Đề 7 nửa bậc: câu dài nhiều tầng mệnh đề, từ vựng C1 (stunted, canopy, inertia, procrastinate, flatters,
 * heavy-handed, structural, sinister, unobjectionable…), paraphrase mức 4 ở hầu hết câu (ý ẩn, đổi cấu trúc + đổi góc nhìn), tiêu
 * đề đoạn TRỪU TƯỢNG (không trùng chữ nào với đoạn), bẫy "được nhắc nhưng không phải đáp án" ở mọi nhóm; Passage 3 là bài LẬP LUẬN
 * ~950 từ, tác giả ngôi thứ nhất phản biện một ý tưởng chính sách đang thịnh hành, có nhượng bộ rồi mới phản bác.
 * Thể loại theo mục 4.2: Khảo cổ · Năng lượng · Kinh tế học hành vi. Đề CUỐI tập ⇒ phủ dạng nửa sau Tập 4 (N17 flow/diagram đã ở
 * Đề 7 · N19 Matching information 3 · N23 Matching features 3 · N25 Summary 3 hộp từ + từ trong bài) + dạng chủ lực (N3 headings,
 * N5 TFNG/YNNG, N7 MCQ, N15 sentence endings); cùng Đề 6 + Đề 7 phủ đủ 16 dạng Reading:
 *   Passage 1 (khảo cổ — nhìn từ trên cao: ảnh máy bay, lidar, vệ tinh): Matching information (A–F) · TFNG · Summary (từ trong bài)
 *   Passage 2 (năng lượng — đường dài của pin mặt trời):               Matching headings (7 đoạn, 10 tiêu đề) · Matching features ·
 *                                                                      Summary (hộp từ)
 *   Passage 3 (kinh tế học hành vi — giới hạn của "cú hích"):          YNNG · MCQ (4 lựa chọn) · Matching sentence endings
 * KHÔNG trùng đề tài với Đề 0–7 và passage Tập 3–4 (đã grep: lidar, cropmark, Crawford, Angkor, Becquerel, Fritts, photovoltaic,
 * Vanguard, Swanson, nudge, Kahneman, Sunstein = 0 kết quả; vòng gỗ / Douglass ĐÃ có ở Tập 3 Ngày 12 nên Passage 1 KHÔNG dùng).
 * DỮ KIỆN: kiến thức phổ thông, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát trước khi dùng làm tài
 * liệu tham khảo). Khảo cổ: O. G. S. Crawford, sĩ quan khảo cổ đầu tiên của Ordnance Survey (1920), sách ảnh "Wessex from the Air"
 * 1928 cùng Alexander Keiller (người bỏ tiền thuê máy bay); vết cây trồng (cropmark) trên mương / tường chôn; đợt nắng nóng 2018 ở
 * Anh + Ireland lộ hàng trăm di chỉ; lidar Angkor 2012; lidar bắc Guatemala 2018, hơn 60.000 công trình Maya; vệ tinh theo dõi nạn
 * đào trộm. Pin mặt trời: Edmond Becquerel 1839 (19 tuổi); Charles Fritts thập niên 1880 (selen + vàng, khoảng 1%); Einstein 1905 —
 * Nobel cho hiệu ứng quang điện; Bell Labs: Chapin (nguồn điện cho thiết bị điện thoại vùng xa, ẩm), Fuller, Pearson, tháng 4/1954,
 * khoảng 6%; Vanguard 1 (1958, pin hoá học chết sau vài tuần, máy phát chạy pin mặt trời tới 1964, vệ tinh vẫn còn trên quỹ đạo);
 * khủng hoảng dầu 1973; luật giá mua điện cố định 20 năm của Đức (2000); Swanson (sáng lập SunPower): sản lượng cộng dồn gấp đôi ⇒
 * giá giảm khoảng 1/5; giá mô-đun giảm hơn 99% từ giữa thập niên 1970; IEA 2020 "some of the cheapest electricity ever". Cú hích:
 * Thaler & Sunstein 2008; Behavioural Insights Team 2010; khoảng hơn 200 đơn vị tương tự (OECD); Nobel Kahneman 2002, Thaler 2017;
 * tự động ghi danh quỹ hưu; thư so sánh điện năng với hàng xóm (hiệu quả nhỏ, nhạt dần); so sánh 2022 hơn 100 thử nghiệm của hai đơn
 * vị chính phủ ≈ 1/6 hiệu quả đăng trên tạp chí (DellaVigna & Linos). Phần nhận định ở đoạn 6–8 là QUAN ĐIỂM của bài (có giới
 * nghiên cứu ủng hộ nhưng còn tranh luận) — Passage 3 là bài quan điểm tự viết, không phải tổng thuật trung lập.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE8: DeDoc = {
  id: 'doc-de8',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 8 (thi cuối Tập 4)',
  boDe: 'Đề 8',
  capDo: 'Band 7.0',
  moTa: 'The view from above (archaeology from the air) · The long road to cheap sunlight (the solar cell) · The trouble with nudges (the limits of behavioural policy)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Khảo cổ: nhìn từ trên cao ════════════════ */
    {
      so: 1,
      tieuDe: 'The View from Above',
      phuDe: 'How aircraft, lasers and satellites have changed the search for the past',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { nhan: 'A', s: `For most of its history, archaeology has been carried out on the ground, with a spade. An excavation reveals a great deal about a small area, but it is slow and expensive, and it is by its nature destructive: once a layer of soil has been removed, it can never again be examined in its original position. Since the early twentieth century, however, a growing share of archaeological discoveries has been made not by digging but by looking down from above — first from aircraft, then from satellites, and most recently with lasers that can, in effect, see through a forest.` },
        { nhan: 'B', s: `The potential of the aerial view was recognised almost as soon as people could fly. During the First World War, pilots photographing enemy positions noticed patterns in the fields below that had nothing to do with the fighting: the faint outlines of ancient enclosures, roads and buildings. One of those who studied such photographs was O. G. S. Crawford, who in 1920 became the first archaeology officer of the Ordnance Survey, the British government's map-making agency. Crawford spent much of the following decade arguing that photography from the air should become a routine part of archaeological work, and in 1928 he published, together with a wealthy amateur archaeologist named Alexander Keiller, who had paid for the flights, a book of photographs of southern England that demonstrated what could be achieved.` },
        { nhan: 'C', s: `What made the photographs so revealing was a phenomenon that farmers had long observed without understanding its significance. Where an ancient ditch has filled up with soil, the ground holds more moisture, and a crop growing above it tends to grow taller and to stay green for longer. Over a buried wall, by contrast, the soil is shallow and dries out quickly, so that the plants above it are stunted and ripen early. From ground level these differences are almost invisible, but from a height of a few hundred metres they form clear lines of light and dark, the 'cropmarks' that have led to the discovery of many thousands of sites. They are, however, frustratingly unreliable. They appear only in certain crops, notably cereals, and only in certain conditions, so that a field may show nothing for decades and then, in a single dry summer, display an entire settlement. In the heatwave of 2018, aerial surveyors in Britain and Ireland recorded hundreds of previously unknown sites in a matter of weeks.` },
        { nhan: 'D', s: `Cropmarks are of no help where the ground is covered by trees, and for most of the twentieth century the world's great forests remained closed to aerial survey. That changed with lidar, a technique in which an aircraft fires hundreds of thousands of laser pulses at the ground every second and records how long each one takes to return. In a forest, most of the pulses strike leaves and branches, but a small proportion pass through gaps in the canopy and reach the earth. Computer software then removes every point that does not belong to the ground, leaving a detailed model of the bare surface. In 2012, a lidar survey of the area around Angkor in Cambodia showed that the famous temples had been surrounded by an extensive network of streets, ponds and canals, all hidden by vegetation, and that the medieval city had been far larger than anyone had believed. Six years later, a survey of the forests of northern Guatemala identified more than 60,000 structures built by the Maya, many of them in areas that had been thought almost empty.` },
        { nhan: 'E', s: `The most recent addition to the archaeologist's equipment is the satellite. Commercial satellites now photograph the entire surface of the earth at resolutions fine enough to show a single block of stone, and they can record wavelengths of light, such as infrared, that the human eye cannot detect. Because buried materials affect the health of the vegetation above them, images taken in these wavelengths can reveal features that would be invisible in an ordinary photograph. Satellites have proved particularly valuable in regions where political conflict makes fieldwork dangerous or impossible. They have also been used to monitor looting: by comparing images taken a few months apart, researchers can count the pits dug by illegal treasure hunters and identify the sites that are most at risk, so that the authorities know where protection is needed most urgently.` },
        { nhan: 'F', s: `None of these methods has made the spade unnecessary. An image from above can show that something lies beneath the surface, but it can rarely reveal the age of that thing, or what it was used for; a dark circle in a field might be a prehistoric burial mound or a nineteenth-century pond. The usual practice is therefore to treat aerial evidence as a means of deciding where to dig, and to test the most promising features with a small trench, or with instruments that measure the magnetism or the electrical resistance of the soil. The result has been a quiet change in the way that archaeologists think about the past. Instead of studying isolated sites, they increasingly study entire landscapes — the fields, tracks and boundaries that connected one settlement to another — and this, perhaps, is the most valuable thing that the view from above has given them.` },
      ],
      nhom: [
        {
          id: 'p1-info', tu: 1, den: 4, dang: 'match-info',
          huongDan: 'Reading Passage 1 has six paragraphs, **A–F**.\nWhich paragraph contains the following information?\nWrite the correct letter, **A–F**.',
          hop: { ds: 'ABCDEF'.split('').map((k) => ({ k, t: `Paragraph ${k}` })) },
          cau: [
            { n: 1, s: 'a way in which a new technique has helped to prevent damage to sites' },
            { n: 2, s: 'an explanation of why a certain kind of evidence may be visible in one year but not in another' },
            { n: 3, s: 'a reason why a traditional method of investigation cannot be repeated' },
            { n: 4, s: 'a change in the scale at which the past is studied' },
          ],
        },
        {
          id: 'p1-tfng', tu: 5, den: 10, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 5, s: 'Nobody had held a post in archaeology at the Ordnance Survey before Crawford.' },
            { n: 6, s: 'The book that Crawford published in 1928 was the first collection of aerial photographs of ancient sites to appear in any country.' },
            { n: 7, s: 'The effect of buried features on crops had been noticed before its importance to archaeology was understood.' },
            { n: 8, s: 'Plants growing above a buried wall usually remain green longer than the plants around them.' },
            { n: 9, s: 'Lidar is of little value in areas that are covered by forest.' },
            { n: 10, s: 'Satellite images are less expensive to obtain than photographs taken from aircraft.' },
          ],
        },
        {
          id: 'p1-summary', tu: 11, den: 13, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'From the air to the ground',
          dong: [
            'A lidar survey depends on the few laser pulses that find their way through openings in the [[11]] of a forest; software then turns the remaining points into a model of the bare ground. Like every other method of looking from above, however, lidar seldom tells archaeologists the [[12]] of a feature or what its purpose was. Aerial evidence is therefore used mainly to decide where excavation should take place, and promising features are checked by digging a small [[13]] or by measuring certain properties of the soil.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Năng lượng: đường dài của pin mặt trời ════════════════ */
    {
      so: 2,
      tieuDe: 'The Long Road to Cheap Sunlight',
      phuDe: 'How the solar cell went from laboratory curiosity to one of the world\'s main sources of new electricity',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `In 1839, a nineteen-year-old Frenchman named Edmond Becquerel was experimenting with metal plates placed in a solution that conducted electricity when he noticed something curious: the current flowing between the plates grew slightly stronger when they were exposed to light. Becquerel had discovered what is now called the photovoltaic effect, the direct conversion of light into electricity. Nobody at the time had any idea how it worked, and for the rest of the century it remained a scientific curiosity, of interest chiefly to physicists who were studying the nature of light and who saw no reason to think that it might one day be put to work.` },
        { nhan: 'B', s: `The first attempt to make practical use of the effect came in the 1880s. In New York, the inventor Charles Fritts coated a thin layer of the element selenium with an even thinner film of gold and announced, with great confidence, that his device would one day compete with the coal-burning power stations that were then being built. His cells converted only about one per cent of the sunlight that fell on them into electricity, and most scientists regarded them as little more than a toy, partly because nobody could explain where the energy was coming from. That objection was not finally answered until 1905, when Albert Einstein proposed that light consists of tiny packets of energy which can knock electrons loose from certain materials. It was this work, rather than his theory of relativity, for which he was later awarded the Nobel Prize.` },
        { nhan: 'C', s: `The breakthrough came, as many did in the middle of the twentieth century, from the research laboratories of the American telephone company Bell. In the early 1950s, an engineer named Daryl Chapin was asked to find a source of power for telephone equipment in remote, humid regions, where ordinary batteries deteriorated quickly. Selenium proved hopeless. But two of his colleagues, the chemist Calvin Fuller and the physicist Gerald Pearson, had been working for quite different reasons with silicon to which small amounts of other elements had been added, and when Chapin tested their material in sunlight, it performed far better than anything he had tried. In April 1954, the three men demonstrated a silicon cell that converted about six per cent of the sunlight reaching it into electricity, and one newspaper greeted the announcement as possibly the beginning of a new era.` },
        { nhan: 'D', s: `The new cell, however, was extraordinarily expensive. In the mid-1950s the electricity it produced cost many times as much as power from the grid, and the first consumer products to use it, such as a solar-powered radio, sold poorly. What rescued the technology was a customer for whom the price hardly mattered. Satellites needed a source of power that would last for years without refuelling, and in 1958 the United States launched Vanguard 1, a small satellite powered partly by solar cells. Its chemical batteries were exhausted within a few months, but its solar-powered transmitter continued to send signals until 1964, and the satellite itself is still in orbit today. Within a decade, almost every satellite carried solar panels, and space would remain the solar cell's principal market for many years.` },
        { nhan: 'E', s: `It was on Earth, though, that the price had to fall, and for that to happen, demand on a far larger scale was needed. The oil crisis of 1973 persuaded several governments to fund research into alternatives to fossil fuels, and solar cells began to find small markets in places that no power line reached: lighthouses, navigation buoys, remote telecommunications masts and offshore oil platforms. The decisive change came in 2000, when Germany introduced a law that guaranteed households and businesses which installed solar panels a fixed payment for every unit of electricity they supplied to the grid, for a period of twenty years. Similar schemes followed in other countries, and the sudden growth in demand persuaded manufacturers, above all in China, to build factories on a scale that had never been seen before.` },
        { nhan: 'F', s: `The effect on prices has been dramatic. Since the mid-1970s, the cost of solar modules has fallen by more than 99 per cent. The pattern was described by Richard Swanson, the founder of an American solar company, who observed that every time the total number of modules ever manufactured doubled, their price fell by about a fifth. The rule, which has held with remarkable consistency for decades, reflects not one great invention but thousands of small improvements: thinner slices of silicon, less waste when cutting them, larger factories and more automated production lines. By 2020, the International Energy Agency was describing the best solar projects as offering some of the cheapest electricity ever produced.` },
        { nhan: 'G', s: `Cheap panels have not solved every problem. The sun does not shine at night, and the output of a solar farm varies with the weather and the seasons, so that a power system which relies heavily on solar energy must find ways of storing electricity or of matching demand to supply. The panels themselves contain materials that are difficult to recover, and the first generation of large installations will reach the end of its working life within the next two decades, creating a considerable quantity of waste. These, however, are problems of a kind that the industry has grown used to solving. A technology that spent more than a century as a curiosity, and two decades as an expensive tool for space engineers, has become, within a single generation, one of the main sources of new electricity in the world.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 20, dang: 'heading',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–x**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'Official guarantees that transformed demand' },
              { k: 'ii', t: 'A customer to whom cost mattered little' },
              { k: 'iii', t: 'A single invention that cut costs' },
              { k: 'iv', t: 'Scepticism that theory eventually removed' },
              { k: 'v', t: 'Many modest gains rather than one breakthrough' },
              { k: 'vi', t: 'Rivalry between laboratories on two continents' },
              { k: 'vii', t: 'A curiosity with no obvious use' },
              { k: 'viii', t: 'Difficulties that have yet to be overcome' },
              { k: 'ix', t: 'An answer found in a colleague\'s work' },
              { k: 'x', t: 'The first solar panels on people\'s homes' },
            ],
          },
          cau: [
            { n: 14, s: 'Paragraph A' },
            { n: 15, s: 'Paragraph B' },
            { n: 16, s: 'Paragraph C' },
            { n: 17, s: 'Paragraph D' },
            { n: 18, s: 'Paragraph E' },
            { n: 19, s: 'Paragraph F' },
            { n: 20, s: 'Paragraph G' },
          ],
        },
        {
          id: 'p2-feature', tu: 21, den: 23, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 21–23) and the list of people below.\nMatch each statement with the correct person, **A–E**.',
          hop: {
            tieuDe: 'List of People',
            ds: [
              { k: 'A', t: 'Edmond Becquerel' },
              { k: 'B', t: 'Charles Fritts' },
              { k: 'C', t: 'Albert Einstein' },
              { k: 'D', t: 'Daryl Chapin' },
              { k: 'E', t: 'Richard Swanson' },
            ],
          },
          cau: [
            { n: 21, s: 'He accounted for the ability of some materials to produce electricity from light.' },
            { n: 22, s: 'He made predictions about his invention that were far too optimistic.' },
            { n: 23, s: 'He identified a regular connection between the quantity produced and the price.' },
          ],
        },
        {
          id: 'p2-summary-box', tu: 24, den: 26, dang: 'summary-box',
          huongDan: 'Complete the summary using the list of words, **A–G**, below.',
          tieuDe: 'From space to the rooftop',
          dong: [
            'When silicon cells first appeared, they were far too [[24]] to compete with electricity from the grid. Space programmes, however, needed power that would last for years, and on Vanguard 1 the solar cells continued to work long after the satellite\'s [[25]] had run out. Back on Earth, after the oil crisis of 1973, solar power was used mainly in [[26]] locations which had no connection to the grid, until government schemes created demand on a mass scale.',
          ],
          hop: {
            ds: [
              { k: 'A', t: 'heavy' },
              { k: 'B', t: 'transmitter' },
              { k: 'C', t: 'batteries' },
              { k: 'D', t: 'unreliable' },
              { k: 'E', t: 'expensive' },
              { k: 'F', t: 'isolated' },
              { k: 'G', t: 'crowded' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — Kinh tế học hành vi: giới hạn của "cú hích" (bài lập luận) ════════════════ */
    {
      so: 3,
      tieuDe: 'The Trouble with Nudges',
      phuDe: 'Can small changes in the way choices are presented really change how people behave?',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Few ideas from the social sciences have travelled as quickly from the seminar room to the corridors of government as the 'nudge'. The term was popularised by the economist Richard Thaler and the legal scholar Cass Sunstein in a book published in 2008, and it rests on a simple observation: people do not always choose in the careful, calculating way that traditional economic models assume. They procrastinate, they follow the crowd, and they are strongly influenced by the way in which a choice is presented to them. If that is so, Thaler and Sunstein argued, governments and businesses can steer people towards better decisions — saving more, eating more healthily — not by banning anything or by changing prices, but by redesigning the context in which decisions are made, while leaving everyone free to choose otherwise.` },
        { s: `The idea proved irresistible to politicians. It promised results at almost no cost, and it allowed them to act without being accused of heavy-handed regulation. In 2010 the British government set up a Behavioural Insights Team, soon known as the 'Nudge Unit', and within a decade some two hundred organisations applying similar methods had been established around the world. Thaler was awarded the Nobel Prize in economics in 2017, fifteen years after the psychologist Daniel Kahneman had received the same honour for research that had laid much of the foundation for the field.` },
        { s: `Some of the early successes were genuinely impressive, and they share a feature that is worth noticing. The most celebrated concerns pensions. When American companies changed their rules so that new employees were enrolled in a savings plan automatically unless they asked to leave it, instead of having to ask to join, the proportion who saved rose dramatically — not because anyone's interests or incentives had changed, but because most people simply accept whichever option has been selected for them. Defaults of this kind work because they exploit inertia, one of the most dependable features of human behaviour. It is no accident that the strongest evidence for nudging concerns decisions which are made once and then left alone.` },
        { s: `The difficulty is that most of the problems that governments care about are not like this. Eating, exercising, paying bills on time and using less energy are decisions that people make again and again, and it is precisely here that the evidence is weakest. A letter telling households how their energy use compares with that of their neighbours may reduce consumption slightly, but the effect tends to fade once the letters stop. A canteen that places fruit at eye level and moves chocolate out of easy reach may well sell more fruit; whether its customers eat less chocolate over the course of a week is another matter entirely.` },
        { s: `There is also reason to suspect that the published evidence flatters the approach. Academic journals have traditionally preferred studies that report striking effects, and experiments that find nothing are less likely to be written up at all. When researchers compared the results published in journals with those of more than a hundred trials run by two government nudge units, which were obliged to report every result they obtained, the average effect in the government trials turned out to be roughly a sixth of the size. Small effects are not worthless: a measure that costs almost nothing and changes the behaviour of a few per cent of a large population can still be a sensible investment. But they are a long way from the transformations that were once promised.` },
        { s: `My deeper objection, however, is not that nudges achieve too little but that their popularity may encourage governments to attempt too little. A nudge is attractive precisely because it asks nothing of the powerful. Encouraging people to choose healthier food is cheaper and less controversial than regulating what manufacturers put into it; sending reminders about saving is easier than raising the wages from which savings must come. The danger is that the modest tool becomes a substitute for the difficult policy rather than a complement to it — that, faced with a problem whose causes are structural, a government reaches for a better-designed leaflet. Some of the most prominent researchers in the field have themselves begun to warn against exactly this.` },
        { s: `Then there is the question of manipulation, which defenders of nudging tend to answer too quickly. Their standard reply is that every choice has to be presented in some way, so that there is no neutral option: a canteen must put the fruit somewhere. This is true, and it is a good reason not to regard every nudge as sinister. But it does not follow that all designs are equally innocent. A default that serves the chooser's own interests, and that could be explained openly without losing its effect, seems to me unobjectionable. One that works only because people fail to notice it, or that serves the interests of whoever designed it, is something else — and the techniques that encourage saving are used every day by companies that make subscriptions easy to start and almost impossible to cancel.` },
        { s: `None of this means that the behavioural insight was mistaken. The discovery that small details of presentation can change what people do is real, and any government that ignores it will design worse forms, worse letters and worse websites. But the lesson I draw is a humbler one than that of the early enthusiasts. Nudges are best understood as a way of making good policies work better, not as a way of avoiding the need for them. Used like that, they deserve a modest and permanent place in the practice of government. Treated as a cheap alternative to everything else, they will disappoint the very people who rely on them most.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'Thaler and Sunstein proposed that certain harmful options should be removed altogether.' },
            { n: 28, s: 'Part of the appeal of nudges to politicians was that they seemed inexpensive.' },
            { n: 29, s: 'The award of the Nobel Prize to Thaler was criticised by other economists.' },
            { n: 30, s: 'Automatic enrolment increased saving because it altered the financial rewards that employees received.' },
            { n: 31, s: 'Letters comparing a household\'s energy use with its neighbours\' stop having any effect within a year.' },
            { n: 32, s: 'The gap between the results of academic and government studies can be partly explained by which studies get published.' },
          ],
        },
        {
          id: 'p3-mcq', tu: 33, den: 36, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 33, s: 'What point does the writer make about the pension example in the third paragraph?', chon: [
              { k: 'A', t: 'It shows that people respond most strongly to financial rewards.' },
              { k: 'B', t: 'It is typical of the decisions that governments most want to influence.' },
              { k: 'C', t: 'Its success depended on a choice that people seldom return to.' },
              { k: 'D', t: 'Its results were later found to have been exaggerated.' },
            ] },
            { n: 34, s: 'The writer refers to the canteen in the fourth paragraph in order to suggest that', chon: [
              { k: 'A', t: 'a change in one situation may not alter behaviour as a whole.' },
              { k: 'B', t: 'people choose healthy food whenever it is easy to reach.' },
              { k: 'C', t: 'canteens have been slow to adopt behavioural methods.' },
              { k: 'D', t: 'nudges work better in public places than in the home.' },
            ] },
            { n: 35, s: 'What is the writer\'s main concern in the sixth paragraph?', chon: [
              { k: 'A', t: 'Nudges are too costly for most governments to use widely.' },
              { k: 'B', t: 'Manufacturers have successfully opposed the use of nudges.' },
              { k: 'C', t: 'Researchers in the field have exaggerated its achievements.' },
              { k: 'D', t: 'Nudges may be used in place of measures that deal with the real causes of a problem.' },
            ] },
            { n: 36, s: 'According to the writer, which kind of default is acceptable?', chon: [
              { k: 'A', t: 'one that has been tested in a large number of trials' },
              { k: 'B', t: 'one that would still work if people were told about it' },
              { k: 'C', t: 'one that has been designed by an independent organisation' },
              { k: 'D', t: 'one that people are unlikely to notice' },
            ] },
          ],
        },
        {
          id: 'p3-ending', tu: 37, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'does not prove that every design is equally acceptable.' },
              { k: 'B', t: 'may still be worth the small cost involved.' },
              { k: 'C', t: 'is the kind most easily influenced by a default.' },
              { k: 'D', t: 'produced effects considerably smaller than those reported in journals.' },
              { k: 'E', t: 'have rarely been repeated by independent researchers.' },
              { k: 'F', t: 'tends to grow stronger over time.' },
            ],
          },
          cau: [
            { n: 37, s: 'A decision that is taken only once' },
            { n: 38, s: 'Trials run by government nudge units' },
            { n: 39, s: 'A small change in the behaviour of a large population' },
            { n: 40, s: 'The argument that a choice can never be presented neutrally' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['E'], vi: `"a way in which a new technique has helped to prevent damage to sites" — đoạn E: vệ tinh được dùng "to monitor looting": so ảnh cách nhau vài tháng để đếm hố đào trộm, xác định di chỉ nguy cấp "so that the authorities know where protection is needed most urgently" ⇒ **E**. Paraphrase mức 4: "prevent damage" không có trong bài, phải suy từ "looting… at risk… protection". Bẫy A: đoạn A nói khai quật PHÁ HUỶ ("destructive") — nói về thiệt hại nhưng không phải cách NGĂN thiệt hại. 📘 Ôn Matching information 3: Tập 4 Ngày 19.`, ev: `so that the authorities know where protection is needed most urgently` },
    2: { a: ['C'], vi: `"why a certain kind of evidence may be visible in one year but not in another" — đoạn C: cropmark chỉ hiện ở một số cây trồng và điều kiện nhất định, "so that a field may show nothing for decades and then, in a single dry summer, display an entire settlement" ⇒ **C**. "visible in one year but not in another" = "show nothing for decades… then, in a single dry summer". Bẫy D: rừng che mặt đất là lý do KHÔNG BAO GIỜ thấy, không phải năm có năm không.`, ev: `so that a field may show nothing for decades and then, in a single dry summer, display an entire settlement` },
    3: { a: ['A'], vi: `"a reason why a traditional method of investigation cannot be repeated" — đoạn A: khai quật "is by its nature destructive: once a layer of soil has been removed, it can never again be examined in its original position" ⇒ **A**. "cannot be repeated" là ý ẩn của "can never again be examined in its original position". Bẫy F: đoạn F nói vẫn phải đào — nhưng không nói vì sao không làm lại được.`, ev: `once a layer of soil has been removed, it can never again be examined in its original position` },
    4: { a: ['F'], vi: `"a change in the scale at which the past is studied" — đoạn F: "Instead of studying isolated sites, they increasingly study entire landscapes" — từ từng di chỉ lẻ sang cả vùng cảnh quan = đổi QUY MÔ nghiên cứu ⇒ **F**. Bẫy D: Angkor "far larger than anyone had believed" là thành phố LỚN hơn, không phải cách nghiên cứu đổi quy mô. Chữ "scale" không có trong bài.`, ev: `Instead of studying isolated sites, they increasingly study entire landscapes` },
    5: { a: ['TRUE'], vi: `"Crawford, who in 1920 became the first archaeology officer of the Ordnance Survey" — "the first" ⇒ trước ông không ai giữ chức đó ⇒ **TRUE**. Paraphrase đổi góc nhìn (mức 4): bài nói "ông là người ĐẦU TIÊN", câu hỏi nói "KHÔNG AI trước ông" — cùng một sự thật. 📘 Ôn TFNG bẫy band 7: Tập 4 Ngày 5.`, ev: `who in 1920 became the first archaeology officer of the Ordnance Survey` },
    6: { a: ['NOT GIVEN'], vi: `Bài chỉ nói cuốn sách 1928 "demonstrated what could be achieved" — KHÔNG so với sách nào khác, ở nước nào khác ⇒ **NOT GIVEN**. Bẫy so sánh ngầm: chữ "first" xuất hiện ngay câu trước (chức vụ đầu tiên) dễ khiến bạn gán "first" cho cả cuốn sách.`, ev: `a book of photographs of southern England that demonstrated what could be achieved` },
    7: { a: ['TRUE'], vi: `"a phenomenon that farmers had long observed without understanding its significance" — nông dân thấy hiện tượng từ lâu mà chưa hiểu ý nghĩa (với khảo cổ) ⇒ **TRUE**. "had been noticed before its importance… was understood" = "had long observed without understanding its significance". Không nói ai nhận thấy cũng không sao — câu hỏi dùng bị động.`, ev: `What made the photographs so revealing was a phenomenon that farmers had long observed without understanding its significance.` },
    8: { a: ['FALSE'], vi: `Trên tường chôn: "the plants above it are stunted and ripen early" — còi cọc và chín SỚM (tức vàng sớm). Cây "stay green for longer" là cây trên MƯƠNG lấp đất ⇒ câu hỏi gán đặc điểm của mương cho tường ⇒ **FALSE**. Bẫy đảo đối tượng: hai vế đối lập nằm cạnh nhau, nối bằng "by contrast".`, ev: `Over a buried wall, by contrast, the soil is shallow and dries out quickly, so that the plants above it are stunted and ripen early.` },
    9: { a: ['FALSE'], vi: `Đoạn D: cropmark vô dụng dưới tán rừng, nhưng "That changed with lidar" — một phần nhỏ xung laser "pass through gaps in the canopy and reach the earth"; khảo sát Angkor và rừng Guatemala tìm ra hàng chục nghìn công trình ⇒ lidar có giá trị ĐẶC BIỆT ở vùng rừng ⇒ **FALSE**. Bẫy: "of no help where the ground is covered by trees" ở đầu đoạn nói về CROPMARK, không phải lidar.`, ev: `but a small proportion pass through gaps in the canopy and reach the earth` },
    10: { a: ['NOT GIVEN'], vi: `Đoạn E nói vệ tinh "commercial", độ phân giải cao, ghi được tia hồng ngoại, hữu ích ở vùng xung đột — KHÔNG có thông tin giá so với ảnh chụp từ máy bay ⇒ **NOT GIVEN**. Chữ "commercial" gợi tiền nhưng không cho biết đắt hay rẻ.`, ev: `Commercial satellites now photograph the entire surface of the earth at resolutions fine enough to show a single block of stone` },
    11: { a: ['canopy'], vi: `"a small proportion pass through gaps in the canopy and reach the earth" — "openings in the ___ of a forest" = "gaps in the canopy" ⇒ **canopy** (tán rừng). Bẫy: "leaves" / "branches" — đó là thứ xung laser ĐẬP vào, không phải chỗ có khe hở. 📘 Ôn Summary completion (từ trong bài): Tập 4 Ngày 25.`, ev: `a small proportion pass through gaps in the canopy and reach the earth` },
    12: { a: ['age'], vi: `"it can rarely reveal the age of that thing, or what it was used for" — "seldom tells… the ___ of a feature or what its purpose was" ⇒ **age**. "seldom" = "rarely"; "what its purpose was" = "what it was used for" đã chiếm vế sau nên ô trống là vế đầu.`, ev: `but it can rarely reveal the age of that thing, or what it was used for` },
    13: { a: ['trench'], vi: `"to test the most promising features with a small trench, or with instruments that measure the magnetism or the electrical resistance of the soil" — "checked by digging a small ___" ⇒ **trench** (hố thám sát). "measuring certain properties of the soil" đã gói vế "magnetism… resistance", nên không điền "magnetism".`, ev: `to test the most promising features with a small trench` },

    /* ── Passage 2 ── */
    14: { a: ['vii'], vi: `Đoạn A: Becquerel phát hiện hiệu ứng quang điện, không ai hiểu cơ chế, nó "remained a scientific curiosity… who saw no reason to think that it might one day be put to work" ⇒ **vii** (A curiosity with no obvious use). Bẫy iv: đoạn A chưa có hoài nghi nào bị lý thuyết gỡ — đó là đoạn B. 📘 Ôn Matching headings 3: Tập 4 Ngày 3.`, ev: `for the rest of the century it remained a scientific curiosity` },
    15: { a: ['iv'], vi: `Đoạn B: pin của Fritts bị giới khoa học coi như đồ chơi "partly because nobody could explain where the energy was coming from"; phản bác đó "was not finally answered until 1905" — Einstein đưa ra lý thuyết ⇒ hoài nghi bị LÝ THUYẾT gỡ bỏ ⇒ **iv**. Bẫy x: Fritts không lắp pin lên nhà ai trong bài này — đừng điền theo hiểu biết ngoài bài.`, ev: `That objection was not finally answered until 1905` },
    16: { a: ['ix'], vi: `Đoạn C: Chapin được giao tìm nguồn điện cho thiết bị điện thoại; selen thất bại; hai đồng nghiệp Fuller và Pearson "had been working for quite different reasons with silicon", và vật liệu của HỌ cho kết quả tốt ⇒ lời giải nằm trong việc của đồng nghiệp ⇒ **ix**. Bẫy vi: chỉ có một phòng thí nghiệm (Bell) — không có "rivalry".`, ev: `had been working for quite different reasons with silicon to which small amounts of other elements had been added` },
    17: { a: ['ii'], vi: `Đoạn D: pin silic quá đắt, radio dùng pin bán ế; "What rescued the technology was a customer for whom the price hardly mattered" — vệ tinh ⇒ **ii** (A customer to whom cost mattered little). Tiêu đề gần như dịch lại câu chủ đề, nhưng câu này đứng GIỮA đoạn — người chỉ đọc câu đầu ("extraordinarily expensive") dễ chọn sai.`, ev: `What rescued the technology was a customer for whom the price hardly mattered.` },
    18: { a: ['i'], vi: `Đoạn E: "The decisive change came in 2000": luật của Đức "guaranteed… a fixed payment for every unit of electricity… for a period of twenty years", các nước khác làm theo, nhu cầu tăng vọt ⇒ **i** (Official guarantees that transformed demand). Bẫy x: "households… which installed solar panels" — có nhà dân lắp pin, nhưng ý đoạn là CHÍNH SÁCH bảo đảm tạo cầu, không phải "những tấm pin đầu tiên trên mái nhà".`, ev: `The decisive change came in 2000, when Germany introduced a law that guaranteed households and businesses which installed solar panels a fixed payment for every unit of electricity they supplied to the grid` },
    19: { a: ['v'], vi: `Đoạn F: giá giảm hơn 99%; quy luật Swanson "reflects not one great invention but thousands of small improvements" ⇒ **v** (Many modest gains rather than one breakthrough). Bẫy iii ("A single invention that cut costs") nói NGƯỢC đúng câu then chốt — tiêu đề nhiễu được dựng để bắt người chỉ thấy "invention".`, ev: `reflects not one great invention but thousands of small improvements` },
    20: { a: ['viii'], vi: `Đoạn G: "Cheap panels have not solved every problem" — trời tối, thời tiết, lưu trữ, vật liệu khó thu hồi, rác thải khi tấm pin hết đời ⇒ **viii** (Difficulties that have yet to be overcome). Câu cuối đoạn nhìn lại cả chặng đường nhưng chỉ là câu kết; ý chi phối đoạn là các khó khăn CÒN LẠI.`, ev: `Cheap panels have not solved every problem.` },
    21: { a: ['C'], vi: `"He accounted for the ability of some materials to produce electricity from light" = GIẢI THÍCH cơ chế: Einstein "proposed that light consists of tiny packets of energy which can knock electrons loose from certain materials" ⇒ **C**. Bẫy A: Becquerel PHÁT HIỆN hiệu ứng nhưng "Nobody at the time had any idea how it worked". "accounted for" = explained. 📘 Ôn Matching features 3: Tập 4 Ngày 23.`, ev: `when Albert Einstein proposed that light consists of tiny packets of energy which can knock electrons loose from certain materials` },
    22: { a: ['B'], vi: `Fritts "announced, with great confidence, that his device would one day compete with the coal-burning power stations" trong khi pin chỉ đạt khoảng 1% ⇒ dự đoán quá lạc quan ⇒ **B**. "far too optimistic" không có trong bài — phải ghép lời tuyên bố với con số 1% và phản ứng "little more than a toy".`, ev: `announced, with great confidence, that his device would one day compete with the coal-burning power stations that were then being built` },
    23: { a: ['E'], vi: `Swanson "observed that every time the total number of modules ever manufactured doubled, their price fell by about a fifth" — "a regular connection between the quantity produced and the price" ⇒ **E**. "regular" = "held with remarkable consistency"; "quantity produced" = "total number of modules ever manufactured".`, ev: `every time the total number of modules ever manufactured doubled, their price fell by about a fifth` },
    24: { a: ['E'], vi: `"The new cell, however, was extraordinarily expensive… the electricity it produced cost many times as much as power from the grid" ⇒ **E** (expensive). Bẫy D "unreliable": bài không chê pin kém tin cậy — vệ tinh còn chạy tới 1964. 📘 Ôn Summary hộp từ: Tập 4 Ngày 25.`, ev: `The new cell, however, was extraordinarily expensive.` },
    25: { a: ['C'], vi: `"Its chemical batteries were exhausted within a few months, but its solar-powered transmitter continued to send signals until 1964" — "the solar cells continued to work long after the satellite's ___ had run out" ⇒ **C** (batteries). "run out" = "were exhausted". Bẫy B "transmitter": máy phát là thứ VẪN chạy nhờ pin mặt trời.`, ev: `Its chemical batteries were exhausted within a few months` },
    26: { a: ['F'], vi: `"solar cells began to find small markets in places that no power line reached: lighthouses, navigation buoys, remote telecommunications masts and offshore oil platforms" — hải đăng, phao, cột viễn thông xa, giàn khoan = nơi BIỆT LẬP ⇒ **F** (isolated). Câu tóm tắt đã có "which had no connection to the grid", nên ô trống là tính từ chỉ vị trí. Bẫy G "crowded" — ngược nghĩa.`, ev: `solar cells began to find small markets in places that no power line reached` },

    /* ── Passage 3 ── */
    27: { a: ['NO'], vi: `Thaler và Sunstein chủ trương lái người ta tới lựa chọn tốt hơn "not by banning anything or by changing prices… while leaving everyone free to choose otherwise" — KHÔNG loại bỏ lựa chọn nào ⇒ trái với "should be removed altogether" ⇒ **NO**. 📘 Ôn YNNG bẫy band 7: Tập 4 Ngày 5.`, ev: `not by banning anything or by changing prices, but by redesigning the context in which decisions are made, while leaving everyone free to choose otherwise` },
    28: { a: ['YES'], vi: `"The idea proved irresistible to politicians. It promised results at almost no cost" — "seemed inexpensive" = "promised results at almost no cost"; "part of the appeal" vì còn lý do thứ hai (tránh bị chê can thiệp nặng tay) ⇒ **YES**.`, ev: `It promised results at almost no cost` },
    29: { a: ['NOT GIVEN'], vi: `Bài chỉ nêu Thaler nhận Nobel năm 2017, 15 năm sau Kahneman — KHÔNG nói ai phản đối hay chỉ trích giải thưởng ⇒ **NOT GIVEN**. Bài CÓ phê phán (ở đoạn 4–7), nhưng phê phán CÚ HÍCH, không phải giải Nobel — đừng chuyển thái độ của tác giả sang "other economists".`, ev: `Thaler was awarded the Nobel Prize in economics in 2017` },
    30: { a: ['NO'], vi: `"the proportion who saved rose dramatically — not because anyone's interests or incentives had changed, but because most people simply accept whichever option has been selected for them" — tác giả bác thẳng lý do "financial rewards" ⇒ **NO**. "altered the financial rewards" = "incentives had changed" (bị phủ định bằng "not because").`, ev: `not because anyone's interests or incentives had changed` },
    31: { a: ['NOT GIVEN'], vi: `Bài nói thư so sánh "may reduce consumption slightly, but the effect tends to fade once the letters stop" — hiệu quả NHẠT DẦN khi thôi gửi thư; không có mốc "within a year", không nói "stop having ANY effect" ⇒ **NOT GIVEN**. Bẫy "đúng một nửa" + con số tự thêm: hướng đúng (giảm) nhưng mức độ và thời gian không có trong bài.`, ev: `but the effect tends to fade once the letters stop` },
    32: { a: ['YES'], vi: `"There is also reason to suspect that the published evidence flatters the approach": tạp chí chuộng kết quả ấn tượng, thí nghiệm không ra gì ít được đăng; còn các đơn vị chính phủ "were obliged to report every result" và hiệu quả chỉ bằng khoảng 1/6 ⇒ khoảng cách một phần do việc CHỌN đăng ⇒ **YES**. "partly" khớp với "reason to suspect" — tác giả không nói đó là lý do duy nhất.`, ev: `experiments that find nothing are less likely to be written up at all` },
    33: { a: ['C'], vi: `Câu chốt đoạn 3: "It is no accident that the strongest evidence for nudging concerns decisions which are made once and then left alone" — quỹ hưu tự ghi danh thành công vì đó là quyết định làm MỘT lần rồi để yên ⇒ **C** ("a choice that people seldom return to"). A ngược ("not because… incentives had changed"); B ngược với câu mở đoạn 4 ("most of the problems that governments care about are not like this"); D không được nhắc. 📘 Ôn MCQ Passage 3: Tập 4 Ngày 7.`, ev: `It is no accident that the strongest evidence for nudging concerns decisions which are made once and then left alone.` },
    34: { a: ['A'], vi: `"may well sell more fruit; whether its customers eat less chocolate over the course of a week is another matter entirely" — đổi một chỗ (quầy) chưa chắc đổi hành vi TỔNG THỂ (cả tuần) ⇒ **A**. B nói quá ("whenever"); C, D không có trong bài. "is another matter" = cách nói hoài nghi của tác giả (Tập 4 Ngày 9 — giọng điệu).`, ev: `whether its customers eat less chocolate over the course of a week is another matter entirely` },
    35: { a: ['D'], vi: `"The danger is that the modest tool becomes a substitute for the difficult policy rather than a complement to it — that, faced with a problem whose causes are structural, a government reaches for a better-designed leaflet" ⇒ **D** ("used in place of measures that deal with the real causes"). A ngược (cú hích hấp dẫn vì RẺ); B: bài nói quản lý nhà sản xuất khó, không nói họ phản đối cú hích; C: các nhà nghiên cứu CẢNH BÁO, không phải phóng đại.`, ev: `The danger is that the modest tool becomes a substitute for the difficult policy rather than a complement to it` },
    36: { a: ['B'], vi: `"A default that serves the chooser's own interests, and that could be explained openly without losing its effect, seems to me unobjectionable" — "would still work if people were told about it" = "could be explained openly without losing its effect" ⇒ **B**. Bẫy D ngược hẳn: loại "works only because people fail to notice it" là loại tác giả BÁC; A, C không được nhắc.`, ev: `A default that serves the chooser's own interests, and that could be explained openly without losing its effect, seems to me unobjectionable.` },
    37: { a: ['C'], vi: `"Defaults of this kind work because they exploit inertia… the strongest evidence for nudging concerns decisions which are made once and then left alone" — "A decision that is taken only once is the kind most easily influenced by a default" ⇒ **C**. 📘 Ôn Matching sentence endings: Tập 4 Ngày 15.`, ev: `the strongest evidence for nudging concerns decisions which are made once and then left alone` },
    38: { a: ['D'], vi: `"the average effect in the government trials turned out to be roughly a sixth of the size" (so với kết quả đăng tạp chí) ⇒ "Trials run by government nudge units produced effects considerably smaller than those reported in journals" ⇒ **D**. Bẫy E (cũng chủ ngữ số nhiều): bài không nói các thử nghiệm ít được lặp lại — ngữ pháp loại được B, C, F nhưng phải đọc mới loại được E.`, ev: `the average effect in the government trials turned out to be roughly a sixth of the size` },
    39: { a: ['B'], vi: `"a measure that costs almost nothing and changes the behaviour of a few per cent of a large population can still be a sensible investment" — "may still be worth the small cost involved" ⇒ **B**. "a sensible investment" ↔ "worth the cost". Bẫy F: bài nói hiệu quả NHẠT dần (đoạn 4), không mạnh lên.`, ev: `a measure that costs almost nothing and changes the behaviour of a few per cent of a large population can still be a sensible investment` },
    40: { a: ['A'], vi: `Lập luận "every choice has to be presented in some way, so that there is no neutral option" — tác giả nhận là đúng, "But it does not follow that all designs are equally innocent" ⇒ "does not prove that every design is equally acceptable" ⇒ **A**. "does not follow" = "does not prove"; "innocent" = "acceptable". Câu nhượng bộ rồi phản bác — khuôn lập luận của Passage 3 band 7.`, ev: `But it does not follow that all designs are equally innocent.` },
  },
};
