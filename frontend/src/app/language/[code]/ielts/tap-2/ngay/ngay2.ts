/**
 * IELTS Tập 2 · Ngày 2 — Từ vựng AWL sublist 1 (30 họ đầu) + Environment & pollution [VB1 VC08]
 * · Reading: Summary completion — điền từ trong bài [R07] · Writing: Opinion essay trọn bài band 5,
 * thân bài P-E-E [W01 W03 W15] · Bài tập (34 câu).
 *
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N2. Ngày chẵn không có 🔊 trong bảng — khối `phatam`
 * (bắt buộc 1/ngày) đặt ở bài Từ vựng: /ʃ/ trong -tion / -cial và âm cuối -ment / -st của từ môi trường.
 * AWL sublist 1 chia đôi: 30 họ đầu theo ABC (analyse → income) ở đây, 30 họ còn lại ở Ngày 4.
 * Bài đọc, bài mẫu, câu bài tập đều tự soạn.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T2D2_VOCAB: Lesson = {
  id: 't2d2-tu-vung',
  kind: 'vocab',
  title: 'AWL sublist 1 (30 họ đầu) + Environment & pollution',
  goal: 'Hiểu và dùng được 30 họ từ học thuật đầu tiên của Academic Word List cùng 20 từ + 10 cụm về môi trường – ô nhiễm, đủ để đọc hiểu bài Reading chủ đề môi trường và viết một bài Task 2 về môi trường không lặp từ.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Lexical Resource** (Writing + Speaking) từ 4.0 lên 5.0: band 5 = "đủ từ cho đề" — với đề **môi trường** (một trong 5 chủ đề Task 2 hay gặp nhất) bạn phải có sẵn từ đúng.',
        'Đẩy **Reading**: từ **AWL** (Academic Word List — 570 họ từ xuất hiện nhiều nhất trong văn bản học thuật, chia 10 sublist) chiếm khoảng **10 %** chữ trong một bài Reading. Sublist 1 là 60 họ **hay gặp nhất** — hôm nay 30 họ đầu, Ngày 4 học tiếp 30 họ.',
        'Học **họ từ** (word family), không học từ lẻ: **analyse → analysis → analytical → analyst**. Đổi loại từ là cách **paraphrase** cơ bản nhất (sẽ học kỹ ở Ngày 8).',
        '**Môi trường**: 20 từ + 10 cụm động từ / collocation + 5 họ từ + 4 câu mẫu ăn điểm cho Task 2.',
        '🔊 Phát âm: **/ʃ/** trong -tion, -cial (pollution, financial) và **âm cuối** -ment, -st (environment, against).',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Hôm nay học gì',
      center: 'Ngày 2 · Từ vựng',
      branches: [
        { label: 'AWL sublist 1 (1–15)', items: ['analyse · approach · area · assess · assume', 'authority · available · benefit · concept · consist', 'constitute · context · contract · create · data'], anh: 'books' },
        { label: 'AWL sublist 1 (16–30)', items: ['define · derive · distribute · economy · environment', 'establish · estimate · evident · export · factor', 'finance · formula · function · identify · income'], anh: 'bar-chart' },
        { label: 'Environment & pollution', items: ['20 từ: pollution, emission, fossil fuel…', '10 cụm: reduce emissions, raise awareness of…', '5 họ từ · 4 câu mẫu Task 2'], anh: 'globe-showing-asia-australia' },
      ],
    },

    { t: 'h', text: '1. AWL sublist 1 — họ từ 1–15' },
    {
      t: 'p',
      text: 'Mỗi từ ghi **dạng gốc** (dạng hay gặp nhất) + **các dạng khác trong họ** ở dòng "more". Đọc câu ví dụ — đó là câu kiểu Reading / Writing học thuật. Mẹo: che cột nghĩa, nhìn từ, nói ra nghĩa và **một dạng khác** của họ từ.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'analyse', pos: 'v', ipa: '/ˈænəlaɪz/', vi: 'phân tích', ex: 'Scientists analysed water samples from forty rivers.', exVi: 'Các nhà khoa học đã phân tích mẫu nước từ bốn mươi con sông.', more: 'Họ từ: **analysis** /əˈnæləsɪs/ (n, số nhiều analyses) · **analytical** (adj) · **analyst** (n, nhà phân tích). Mỹ viết **analyze**.' },
        { w: 'approach', pos: 'n, v', ipa: '/əˈprəʊtʃ/', vi: 'cách tiếp cận; tiến lại gần', ex: 'We need a new approach to the problem of plastic waste.', exVi: 'Chúng ta cần một cách tiếp cận mới cho vấn đề rác thải nhựa.', more: '**an approach to** + N / V-ing (to là giới từ): an approach to solving… ~~approach to solve~~.' },
        { w: 'area', pos: 'n', ipa: '/ˈeəriə/', vi: 'khu vực; lĩnh vực', ex: 'Air quality is worse in urban areas than in rural areas.', exVi: 'Chất lượng không khí ở khu đô thị tệ hơn ở nông thôn.', more: '**urban / rural / residential area** · **an area of research** (lĩnh vực nghiên cứu).' },
        { w: 'assess', pos: 'v', ipa: '/əˈses/', vi: 'đánh giá', ex: 'The report assesses the impact of tourism on the coast.', exVi: 'Báo cáo đánh giá tác động của du lịch lên vùng bờ biển.', more: 'Họ từ: **assessment** (n) — **an environmental impact assessment**. Gần nghĩa: **evaluate**.' },
        { w: 'assume', pos: 'v', ipa: '/əˈsjuːm/', vi: 'cho rằng (khi chưa có bằng chứng)', ex: 'Many people assume that recycling solves the waste problem.', exVi: 'Nhiều người cho rằng tái chế giải quyết được vấn đề rác.', more: 'Họ từ: **assumption** (n) — **make an assumption**. Trong Reading, "assume" thường báo ý **chưa chắc đúng** → hay là bẫy TFNG.' },
        { w: 'authority', pos: 'n', ipa: '/ɔːˈθɒrəti/', vi: 'chính quyền, cơ quan có thẩm quyền; quyền lực', ex: 'Local authorities collect household waste twice a week.', exVi: 'Chính quyền địa phương thu gom rác sinh hoạt hai lần mỗi tuần.', more: '**the authorities** (số nhiều = nhà chức trách) · **authorise** (v, cho phép) · **authoritative** (adj).' },
        { w: 'available', pos: 'adj', ipa: '/əˈveɪləbl/', vi: 'có sẵn, sẵn dùng', ex: 'Clean drinking water is not available in some villages.', exVi: 'Một số làng không có sẵn nước sạch để uống.', more: 'Họ từ: **availability** (n) · trái nghĩa **unavailable**. **available to** sb · **available for** sth.' },
        { w: 'benefit', pos: 'n, v', ipa: '/ˈbenɪfɪt/', vi: 'lợi ích; có lợi cho', ex: 'Cycling to work benefits both your health and the environment.', exVi: 'Đạp xe đi làm có lợi cho cả sức khoẻ lẫn môi trường.', more: 'Họ từ: **beneficial** /ˌbenɪˈfɪʃl/ (adj) — **beneficial to / for**. Cụm: **the benefits of** + N · **benefit from** sth (được lợi từ).' },
        { w: 'concept', pos: 'n', ipa: '/ˈkɒnsept/', vi: 'khái niệm', ex: 'The concept of a "green city" is becoming popular in Asia.', exVi: 'Khái niệm "thành phố xanh" đang trở nên phổ biến ở châu Á.', more: 'Họ từ: **conceptual** (adj). Gần nghĩa: **idea**, **notion**.' },
        { w: 'consist of', pos: 'v', ipa: '/kənˈsɪst əv/', vi: 'gồm có', ex: 'The committee consists of ten scientists and five residents.', exVi: 'Uỷ ban gồm mười nhà khoa học và năm cư dân.', more: '**Không** dùng bị động, **không** dùng tiếp diễn: ~~is consisted of~~, ~~is consisting of~~. Khác **consistent** (adj) = nhất quán.' },
        { w: 'constitute', pos: 'v', ipa: '/ˈkɒnstɪtjuːt/', vi: 'cấu thành, chiếm (một phần)', ex: 'Plastic constitutes about ten per cent of household waste.', exVi: 'Nhựa chiếm khoảng mười phần trăm rác sinh hoạt.', more: 'Trang trọng hơn **make up**. Họ từ: **constitution** (n, hiến pháp; thể trạng) · **constituent** (n, thành phần).' },
        { w: 'context', pos: 'n', ipa: '/ˈkɒntekst/', vi: 'bối cảnh, ngữ cảnh', ex: 'You can often guess the meaning of a word from its context.', exVi: 'Bạn thường đoán được nghĩa của một từ từ ngữ cảnh.', more: '**in the context of** + N · **in this context** · **out of context** (tách khỏi ngữ cảnh).' },
        { w: 'contract', pos: 'n', ipa: '/ˈkɒntrækt/', vi: 'hợp đồng', ex: 'The company signed a contract to clean the city’s canals.', exVi: 'Công ty đã ký hợp đồng làm sạch kênh rạch của thành phố.', more: 'Trọng âm: danh từ **CON**tract; động từ con**TRACT** = co lại, nhiễm (bệnh). Cụm: **sign / win / break a contract**.' },
        { w: 'create', pos: 'v', ipa: '/kriˈeɪt/', vi: 'tạo ra', ex: 'The new park created a cooler space in the city centre.', exVi: 'Công viên mới tạo ra một không gian mát hơn ở trung tâm.', more: 'Họ từ: **creation** · **creative** · **creativity** · **creator**. Cụm: **create jobs** (tạo việc làm).' },
        { w: 'data', pos: 'n', ipa: '/ˈdeɪtə/', vi: 'dữ liệu, số liệu', ex: 'The data show that air pollution peaks in winter.', exVi: 'Số liệu cho thấy ô nhiễm không khí lên đỉnh vào mùa đông.', more: 'Văn học thuật coi **data** là số nhiều (The data **show**); nói thường dùng số ít (The data **shows**) — cả hai được chấp nhận. **Không** viết ~~datas~~.', anh: 'bar-chart' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d2-awl-1-chon',
      title: 'Kiểm tra nhanh — họ từ 1–15 (6 câu)',
      items: [
        { q: 'The team spent six months collecting and ___ the data.', options: ['analysis', 'analysing', 'analytical'], correct: 1, why: 'Sau **and** cần một động từ cùng dạng với **collecting** → **analysing** (V-ing). analysis là danh từ, analytical là tính từ.' },
        { q: 'Water ___ about 60 per cent of the human body.', options: ['constitutes', 'assumes', 'consists'], correct: 0, why: '**constitute** = chiếm (một tỉ lệ). consist phải đi với **of** và nghĩa ngược chiều: The body **consists of** water, bone…' },
        { q: 'Free bicycles are ___ to all students at the university.', options: ['evident', 'beneficial', 'available'], correct: 2, why: '**available to** sb = có sẵn cho ai dùng.' },
        { q: 'The government will ___ the damage caused by the flood before giving money.', options: ['assess', 'create', 'consist'], correct: 0, why: '**assess the damage** = đánh giá thiệt hại — collocation rất hay gặp.' },
        { q: 'Planting trees is ___ for both people and wildlife.', options: ['benefit', 'beneficial', 'benefits'], correct: 1, why: 'Sau **is** cần **tính từ**: beneficial (for / to).' },
        { q: 'Our school uses a new ___ to teaching science: students learn outdoors.', options: ['contract', 'concept of', 'approach'], correct: 2, why: '**an approach to** + V-ing = cách tiếp cận để làm gì.' },
      ],
    },

    { t: 'h', text: '2. AWL sublist 1 — họ từ 16–30' },
    {
      t: 'vocab',
      items: [
        { w: 'define', pos: 'v', ipa: '/dɪˈfaɪn/', vi: 'định nghĩa, xác định rõ', ex: 'It is difficult to define what a "green" product is.', exVi: 'Thật khó định nghĩa thế nào là sản phẩm "xanh".', more: 'Họ từ: **definition** /ˌdefɪˈnɪʃn/ (n) · **definite** (adj, chắc chắn) · **definitely** (adv).' },
        { w: 'derive (from)', pos: 'v', ipa: '/dɪˈraɪv/', vi: 'bắt nguồn từ, lấy được từ', ex: 'Most of the country’s energy is derived from coal.', exVi: 'Phần lớn năng lượng của nước này lấy từ than đá.', more: 'Thường dùng bị động: **be derived from**. Danh từ: **derivation**.' },
        { w: 'distribute', pos: 'v', ipa: '/dɪˈstrɪbjuːt/', vi: 'phân phát, phân bố', ex: 'Volunteers distributed free water filters to 500 families.', exVi: 'Tình nguyện viên phát miễn phí máy lọc nước cho 500 gia đình.', more: 'Họ từ: **distribution** (n) — **the distribution of wealth** (sự phân bố của cải) · **distributor** (nhà phân phối).' },
        { w: 'economy', pos: 'n', ipa: '/ɪˈkɒnəmi/', vi: 'nền kinh tế', ex: 'Tourism is very important to the local economy.', exVi: 'Du lịch rất quan trọng với kinh tế địa phương.', more: '**economic** /ˌiːkəˈnɒmɪk/ = thuộc kinh tế (economic growth) ≠ **economical** = tiết kiệm (an economical car). **economist** = nhà kinh tế học. Trọng âm đổi: e**CO**nomy → eco**NO**mic.' },
        { w: 'environment', pos: 'n', ipa: '/ɪnˈvaɪrənmənt/', vi: 'môi trường', ex: 'Plastic bags cause serious damage to the environment.', exVi: 'Túi nhựa gây hại nghiêm trọng cho môi trường.', more: 'Họ từ: **environmental** (adj) · **environmentally friendly** · **environmentalist**. Môi trường tự nhiên nói chung → **the environment**. Đừng quên chữ **n** thứ hai: envi**ron**ment.', anh: 'globe-showing-asia-australia' },
        { w: 'establish', pos: 'v', ipa: '/ɪˈstæblɪʃ/', vi: 'thành lập; xác lập', ex: 'The national park was established in 1962.', exVi: 'Vườn quốc gia được thành lập năm 1962.', more: 'Họ từ: **establishment** (n). Cụm: **establish a link between A and B** (xác lập mối liên hệ — rất hay gặp trong Reading).' },
        { w: 'estimate', pos: 'v, n', ipa: '/ˈestɪmeɪt/ (v) · /ˈestɪmət/ (n)', vi: 'ước tính; con số ước tính', ex: 'Experts estimate that the river will be clean within ten years.', exVi: 'Các chuyên gia ước tính con sông sẽ sạch trong mười năm.', more: '**It is estimated that** + mệnh đề (câu học thuật). Họ từ: **estimation** · **underestimate / overestimate**.' },
        { w: 'evident', pos: 'adj', ipa: '/ˈevɪdənt/', vi: 'hiển nhiên, rõ ràng', ex: 'The effects of climate change are already evident in the Mekong Delta.', exVi: 'Tác động của biến đổi khí hậu đã hiện rõ ở Đồng bằng sông Cửu Long.', more: 'Họ từ: **evidence** (n, **không đếm được**: ~~an evidence~~, ~~evidences~~ → **a piece of evidence**) · **evidently** (adv).' },
        { w: 'export', pos: 'v, n', ipa: '/ɪkˈspɔːt/ (v) · /ˈekspɔːt/ (n)', vi: 'xuất khẩu; hàng xuất khẩu', ex: 'Vietnam exports large amounts of rice and coffee.', exVi: 'Việt Nam xuất khẩu lượng lớn gạo và cà phê.', more: 'Trái nghĩa **import**. Trọng âm: động từ ex**PORT**, danh từ **EX**port.' },
        { w: 'factor', pos: 'n', ipa: '/ˈfæktə(r)/', vi: 'yếu tố', ex: 'Traffic is the main factor in the city’s air pollution.', exVi: 'Giao thông là yếu tố chính gây ô nhiễm không khí của thành phố.', more: '**a key / major / contributing factor in** sth.' },
        { w: 'finance', pos: 'n, v', ipa: '/ˈfaɪnæns/', vi: 'tài chính; cấp vốn', ex: 'The project was financed by a Japanese bank.', exVi: 'Dự án được một ngân hàng Nhật cấp vốn.', more: 'Họ từ: **financial** /faɪˈnænʃl/ (adj) — **financial support**. Đọc **/ʃ/** ở -cial.' },
        { w: 'formula', pos: 'n', ipa: '/ˈfɔːmjələ/', vi: 'công thức', ex: 'There is no simple formula for a successful green policy.', exVi: 'Không có công thức đơn giản nào cho một chính sách xanh thành công.', more: 'Số nhiều: **formulas** hoặc **formulae** /ˈfɔːmjəliː/ (học thuật). Động từ **formulate** = xây dựng (kế hoạch, chính sách).' },
        { w: 'function', pos: 'n, v', ipa: '/ˈfʌŋkʃn/', vi: 'chức năng; hoạt động', ex: 'One function of wetlands is to clean river water.', exVi: 'Một chức năng của vùng đất ngập nước là làm sạch nước sông.', more: 'Họ từ: **functional** (adj). Cụm: **function as** sth (hoạt động như là).' },
        { w: 'identify', pos: 'v', ipa: '/aɪˈdentɪfaɪ/', vi: 'xác định, nhận ra', ex: 'Researchers identified three main sources of the pollution.', exVi: 'Các nhà nghiên cứu đã xác định ba nguồn gây ô nhiễm chính.', more: 'Họ từ: **identification** (n) · **identity** (n, danh tính) · **identifiable**. Quá khứ: identif**ied**.' },
        { w: 'income', pos: 'n', ipa: '/ˈɪnkʌm/', vi: 'thu nhập', ex: 'Families on low incomes spend more on energy as a share of income.', exVi: 'Gia đình thu nhập thấp chi cho năng lượng một phần thu nhập lớn hơn.', more: '**high / low income** (không dùng ~~big / small~~) · **low-income families** · **a source of income**.', anh: 'money-bag' },
      ],
    },
    {
      t: 'table',
      caption: 'Họ từ AWL đổi loại từ — dùng để paraphrase',
      head: ['Động từ', 'Danh từ', 'Tính từ', 'Câu paraphrase'],
      rows: [
        ['analyse', 'analysis', 'analytical', 'We **analysed** the data. → Our **analysis** of the data showed…'],
        ['assess', 'assessment', '—', 'They **assessed** the risk. → Their **assessment** of the risk was…'],
        ['benefit', 'benefit', 'beneficial', 'Trees **benefit** cities. → Trees are **beneficial** to cities.'],
        ['create', 'creation', 'creative', 'The plan **created** jobs. → The plan led to the **creation** of jobs.'],
        ['define', 'definition', 'definite', 'It is hard to **define** "green". → There is no clear **definition** of "green".'],
        ['distribute', 'distribution', '—', 'Wealth is unequally **distributed**. → The **distribution** of wealth is unequal.'],
        ['identify', 'identification', 'identifiable', 'They **identified** the cause. → The **identification** of the cause took months.'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d2-awl-dang-tu',
      title: 'Điền đúng dạng từ trong ngoặc (8 câu)',
      kind: 'fill',
      items: [
        { q: 'A careful ___ of the results is needed before we decide. (analyse)', answers: ['analysis'] },
        { q: 'Exercise has many ___ for older people. (benefit — số nhiều)', answers: ['benefits'] },
        { q: 'Tourism brings ___ growth but also pollution. (economy — tính từ "thuộc kinh tế")', answers: ['economic'] },
        { q: 'There is clear ___ that the lake is getting warmer. (evident — danh từ)', answers: ['evidence'] },
        { q: 'Many students need ___ support to study abroad. (finance — tính từ)', answers: ['financial'] },
        { q: 'The ___ of new jobs in solar energy is good news. (create — danh từ)', answers: ['creation'] },
        { q: 'The company ___ the problem quickly and fixed it. (identify — quá khứ)', answers: ['identified'] },
        { q: 'Most ___ groups protest against the new airport. (environment — tính từ)', answers: ['environmental'] },
      ],
    },

    { t: 'h', text: '3. Environment & pollution — 20 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'pollution', pos: 'n', ipa: '/pəˈluːʃn/', vi: 'sự ô nhiễm', ex: 'Air pollution in Hanoi is worst in winter.', exVi: 'Ô nhiễm không khí ở Hà Nội tệ nhất vào mùa đông.', more: '**không đếm được**: ~~a pollution~~, ~~pollutions~~. Loại: **air / water / noise / plastic pollution**.', anh: 'factory' },
        { w: 'emissions', pos: 'n', ipa: '/iˈmɪʃnz/', vi: 'khí thải (lượng thải ra)', ex: 'Cars are responsible for a large share of carbon emissions.', exVi: 'Ô tô chịu trách nhiệm cho một phần lớn lượng khí thải carbon.', more: 'Hay ở dạng số nhiều. **carbon / CO2 / greenhouse gas emissions**. Động từ **emit** (thải ra).' },
        { w: 'greenhouse gas', pos: 'n', ipa: '/ˈɡriːnhaʊs ɡæs/', vi: 'khí nhà kính', ex: 'Carbon dioxide is the main greenhouse gas produced by human activity.', exVi: 'CO2 là khí nhà kính chính do hoạt động của con người thải ra.', more: '**the greenhouse effect** = hiệu ứng nhà kính.' },
        { w: 'climate change', pos: 'n', ipa: '/ˈklaɪmət tʃeɪndʒ/', vi: 'biến đổi khí hậu', ex: 'Climate change is causing more extreme weather.', exVi: 'Biến đổi khí hậu đang gây ra thời tiết cực đoan hơn.', more: 'Dùng **Ø** (không the) khi nói chung. Gần nghĩa: **global warming** (trái đất nóng lên — một phần của climate change).' },
        { w: 'fossil fuel', pos: 'n', ipa: '/ˈfɒsl fjuːəl/', vi: 'nhiên liệu hoá thạch', ex: 'Coal, oil and gas are fossil fuels.', exVi: 'Than, dầu và khí đốt là nhiên liệu hoá thạch.', more: '**burn fossil fuels** · **dependence on fossil fuels**.', anh: 'fuel-pump' },
        { w: 'renewable', pos: 'adj', ipa: '/rɪˈnjuːəbl/', vi: 'tái tạo được', ex: 'Renewable energy, such as solar and wind power, is getting cheaper.', exVi: 'Năng lượng tái tạo như điện mặt trời và gió đang rẻ dần.', more: '**renewable energy / sources** · trái nghĩa **non-renewable**.', anh: 'sun' },
        { w: 'waste', pos: 'n, v', ipa: '/weɪst/', vi: 'rác thải; lãng phí', ex: 'Each person produces about one kilo of waste a day.', exVi: 'Mỗi người thải ra khoảng một ký rác mỗi ngày.', more: 'Danh từ **không đếm được**: **household / plastic / food waste**. Động từ: **waste water / time / money**.', anh: 'wastebasket' },
        { w: 'landfill', pos: 'n', ipa: '/ˈlændfɪl/', vi: 'bãi chôn lấp rác', ex: 'Most plastic ends up in landfill or in the sea.', exVi: 'Phần lớn nhựa cuối cùng nằm ở bãi chôn lấp hoặc dưới biển.', more: '**end up in landfill** · **a landfill site**.' },
        { w: 'recycle', pos: 'v', ipa: '/ˌriːˈsaɪkl/', vi: 'tái chế', ex: 'Only nine per cent of plastic is recycled worldwide.', exVi: 'Chỉ chín phần trăm nhựa được tái chế trên toàn thế giới.', more: 'Họ từ: **recycling** (n) · **recyclable** (adj, tái chế được). Cụm: **reduce, reuse, recycle**.', anh: 'recycling-symbol' },
        { w: 'deforestation', pos: 'n', ipa: '/ˌdiːˌfɒrɪˈsteɪʃn/', vi: 'nạn phá rừng', ex: 'Deforestation destroys the homes of many animals.', exVi: 'Phá rừng huỷ hoại nơi ở của nhiều loài động vật.', more: 'Ngược lại: **reforestation / tree planting**. Tiền tố **de-** = bỏ đi, làm mất.', anh: 'deciduous-tree' },
        { w: 'habitat', pos: 'n', ipa: '/ˈhæbɪtæt/', vi: 'môi trường sống (của sinh vật)', ex: 'Rising sea levels threaten the habitat of many birds.', exVi: 'Mực nước biển dâng đe doạ môi trường sống của nhiều loài chim.', more: '**natural habitat** · **habitat loss** (mất môi trường sống).' },
        { w: 'endangered', pos: 'adj', ipa: '/ɪnˈdeɪndʒəd/', vi: 'có nguy cơ tuyệt chủng', ex: 'The saola is one of the most endangered animals in the world.', exVi: 'Sao la là một trong những loài thú có nguy cơ tuyệt chủng cao nhất thế giới.', more: '**endangered species** · gần nghĩa **at risk of extinction**. Họ: **endanger** (v), **extinct** (adj, đã tuyệt chủng).' },
        { w: 'biodiversity', pos: 'n', ipa: '/ˌbaɪəʊdaɪˈvɜːsəti/', vi: 'đa dạng sinh học', ex: 'Coral reefs have very high biodiversity.', exVi: 'Rạn san hô có mức đa dạng sinh học rất cao.', more: '**không đếm được**. Cụm: **protect / lose biodiversity**.' },
        { w: 'sustainable', pos: 'adj', ipa: '/səˈsteɪnəbl/', vi: 'bền vững', ex: 'Tourism must become more sustainable.', exVi: 'Du lịch phải trở nên bền vững hơn.', more: 'Họ từ: **sustainability** (n) · **sustain** (v, duy trì). **sustainable development / fishing / farming**.' },
        { w: 'conservation', pos: 'n', ipa: '/ˌkɒnsəˈveɪʃn/', vi: 'sự bảo tồn', ex: 'The government spends more on wildlife conservation than before.', exVi: 'Chính phủ chi cho bảo tồn động vật hoang dã nhiều hơn trước.', more: 'Họ từ: **conserve** (v) · **conservationist** (n). Đừng nhầm **conversation** (cuộc trò chuyện).' },
        { w: 'contaminate', pos: 'v', ipa: '/kənˈtæmɪneɪt/', vi: 'làm nhiễm bẩn, nhiễm độc', ex: 'Chemicals from the factory contaminated the river.', exVi: 'Hoá chất từ nhà máy làm nhiễm bẩn con sông.', more: 'Họ từ: **contamination** (n) · **contaminated water / soil**.' },
        { w: 'exhaust fumes', pos: 'n', ipa: '/ɪɡˈzɔːst fjuːmz/', vi: 'khói xả (xe cộ)', ex: 'Exhaust fumes from motorbikes are a major problem in Vietnam.', exVi: 'Khói xả từ xe máy là một vấn đề lớn ở Việt Nam.', more: 'Chữ **h** trong exhaust câm: /ɪɡˈzɔːst/.', anh: 'motor-scooter' },
        { w: 'drought', pos: 'n', ipa: '/draʊt/', vi: 'hạn hán', ex: 'The 2020 drought destroyed rice fields across the Mekong Delta.', exVi: 'Đợt hạn hán năm 2020 tàn phá ruộng lúa khắp Đồng bằng sông Cửu Long.', more: 'Đọc /draʊt/ (vần "ao"), không đọc "đrốt". **a severe drought**.', anh: 'desert' },
        { w: 'flood', pos: 'n, v', ipa: '/flʌd/', vi: 'lũ lụt; làm ngập', ex: 'Heavy rain flooded hundreds of homes in Hue.', exVi: 'Mưa lớn làm ngập hàng trăm ngôi nhà ở Huế.', more: 'Đọc /flʌd/ (như "flớt") — **không** đọc "flút". **flooding** (n, tình trạng ngập).', anh: 'water-wave' },
        { w: 'single-use', pos: 'adj', ipa: '/ˌsɪŋɡl ˈjuːs/', vi: 'dùng một lần', ex: 'Many cafés no longer give out single-use plastic straws.', exVi: 'Nhiều quán cà phê không còn phát ống hút nhựa dùng một lần.', more: '**single-use plastics** (đồ nhựa dùng một lần) · gần nghĩa **disposable**.' },
      ],
    },

    { t: 'h', text: '4. 10 cụm từ ăn điểm (collocation & cụm động từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'reduce emissions', pos: 'phr', ipa: '/rɪˈdjuːs iˈmɪʃnz/', vi: 'giảm khí thải', ex: 'The city plans to reduce emissions by 30 per cent.', exVi: 'Thành phố dự định giảm khí thải 30 phần trăm.', more: 'Đồng nghĩa: **cut emissions**. ~~decrease emissions~~ ít tự nhiên hơn.' },
        { w: 'tackle pollution', pos: 'phr', ipa: '/ˈtækl pəˈluːʃn/', vi: 'giải quyết (đối phó) ô nhiễm', ex: 'Governments must act quickly to tackle pollution.', exVi: 'Chính phủ phải hành động nhanh để giải quyết ô nhiễm.', more: '**tackle / address / combat** + a problem. ~~solve pollution~~ không tự nhiên.' },
        { w: 'protect the environment', pos: 'phr', ipa: '/prəˈtekt ði ɪnˈvaɪrənmənt/', vi: 'bảo vệ môi trường', ex: 'Everyone has a duty to protect the environment.', exVi: 'Mọi người đều có trách nhiệm bảo vệ môi trường.', more: 'Danh từ: **environmental protection**. Viết Task 2 đừng lặp cụm này quá 2 lần — xoay với **conserve natural resources, reduce our impact on the planet**.' },
        { w: 'cut down on', pos: 'phr v', ipa: '/kʌt daʊn ɒn/', vi: 'cắt giảm (dùng ít đi)', ex: 'We should cut down on plastic packaging.', exVi: 'Chúng ta nên giảm dùng bao bì nhựa.', more: 'Khác **cut down** (a tree) = chặt (cây).' },
        { w: 'throw away', pos: 'phr v', ipa: '/θrəʊ əˈweɪ/', vi: 'vứt đi', ex: 'People throw away millions of tonnes of food every year.', exVi: 'Mỗi năm con người vứt đi hàng triệu tấn thức ăn.', more: 'Tính từ: **throwaway** (a throwaway culture — văn hoá dùng xong vứt).' },
        { w: 'run out of', pos: 'phr v', ipa: '/rʌn aʊt əv/', vi: 'cạn kiệt, hết', ex: 'Some countries may run out of fresh water by 2050.', exVi: 'Một số nước có thể cạn nước ngọt trước năm 2050.', more: 'Chủ ngữ là **người dùng**: **we run out of** water. Chủ ngữ là **tài nguyên**: water **runs out**.' },
        { w: 'switch to', pos: 'phr v', ipa: '/swɪtʃ tə/', vi: 'chuyển sang', ex: 'Many factories have switched to solar power.', exVi: 'Nhiều nhà máy đã chuyển sang điện mặt trời.', more: '**switch from A to B**. Gần nghĩa: **move to, change to**.' },
        { w: 'raise awareness of', pos: 'phr', ipa: '/reɪz əˈweənəs əv/', vi: 'nâng cao nhận thức về', ex: 'Schools can raise awareness of the dangers of plastic.', exVi: 'Trường học có thể nâng cao nhận thức về tác hại của nhựa.', more: '**raise** (ngoại động từ: nâng cái gì) ≠ **rise** (tự tăng). ~~rise awareness~~ là lỗi rất hay gặp.' },
        { w: 'impose a ban on', pos: 'phr', ipa: '/ɪmˈpəʊz ə bæn ɒn/', vi: 'ban hành lệnh cấm đối với', ex: 'Several countries have imposed a ban on plastic bags.', exVi: 'Một số nước đã ban hành lệnh cấm túi nhựa.', more: 'Đơn giản hơn: **ban** sth (v). Cụm: **a ban on** + N.' },
        { w: 'take public transport', pos: 'phr', ipa: '/teɪk ˈpʌblɪk ˈtrænspɔːt/', vi: 'đi phương tiện công cộng', ex: 'If more people took public transport, the air would be cleaner.', exVi: 'Nếu nhiều người đi phương tiện công cộng hơn, không khí sẽ sạch hơn.', more: '**public transport** không đếm được, Ø (Ngày 1). Mỹ: **public transportation**. Cũng nói **use public transport**.' },
      ],
    },
    {
      t: 'table',
      caption: '5 họ từ môi trường — đổi loại từ khi viết',
      head: ['Động từ', 'Danh từ (vật / việc)', 'Danh từ (người / tác nhân)', 'Tính từ'],
      rows: [
        ['pollute', 'pollution', 'polluter · pollutant (chất gây ô nhiễm)', 'polluted'],
        ['protect', 'protection', 'protector', 'protective · protected (a protected area)'],
        ['sustain', 'sustainability', '—', 'sustainable · unsustainable'],
        ['conserve', 'conservation', 'conservationist', 'conservative (≠ nghĩa: bảo thủ!)'],
        ['emit', 'emission(s)', 'emitter', '—'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'Governments should impose a ban on single-use plastics, which end up in landfill or in the sea.', vi: 'Chính phủ nên ban hành lệnh cấm đồ nhựa dùng một lần — thứ cuối cùng nằm ở bãi chôn lấp hoặc dưới biển. (mệnh đề quan hệ "which" — Ngày 15)' },
        { en: 'Switching from fossil fuels to renewable energy is the most effective way to reduce carbon emissions.', vi: 'Chuyển từ nhiên liệu hoá thạch sang năng lượng tái tạo là cách hiệu quả nhất để giảm khí thải carbon. (V-ing làm chủ ngữ)' },
        { en: 'If more people took public transport, there would be far fewer exhaust fumes in city centres.', vi: 'Nếu nhiều người đi phương tiện công cộng hơn, trung tâm thành phố sẽ ít khói xả hơn nhiều. (câu giả định — dùng như cụm có sẵn, Tập 3 học kỹ)' },
        { en: 'Schools play a key role in raising awareness of environmental problems among young people.', vi: 'Trường học đóng vai trò then chốt trong việc nâng cao nhận thức về vấn đề môi trường cho người trẻ. (play a key role in + V-ing)' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d2-moi-truong-chon',
      title: 'Chọn từ / cụm đúng — môi trường (8 câu)',
      items: [
        { q: 'Many cities are trying to ___ air pollution by limiting cars in the centre.', options: ['tackle', 'solve out', 'make'], correct: 0, why: '**tackle pollution / a problem** = giải quyết, đối phó. ~~solve out~~ không tồn tại.' },
        { q: 'Campaigns on social media can ___ awareness of plastic waste.', options: ['rise', 'raise', 'arise'], correct: 1, why: '**raise awareness** — raise là ngoại động từ (nâng **cái gì**). rise / arise là nội động từ, không có tân ngữ.' },
        { q: 'Solar and wind power are ___ sources of energy.', options: ['renewable', 'fossil', 'endangered'], correct: 0, why: '**renewable** = tái tạo được. fossil fuels là than, dầu, khí; endangered dùng cho loài vật.' },
        { q: 'The factory was fined for ___ the river with chemicals.', options: ['recycling', 'conserving', 'contaminating'], correct: 2, why: '**contaminate** sth **with** sth = làm nhiễm bẩn bằng.' },
        { q: 'The farmers lost their crops because of a severe ___.', options: ['drought', 'habitat', 'landfill'], correct: 0, why: '**drought** = hạn hán → mất mùa.' },
        { q: 'If we keep using water like this, we will ___ clean water.', options: ['run out', 'run out of', 'cut down'], correct: 1, why: 'Chủ ngữ là **người** (we) + tân ngữ → **run out of** + N.' },
        { q: 'The panda is no longer on the list of ___ species.', options: ['sustainable', 'endangered', 'renewable'], correct: 1, why: '**endangered species** = loài có nguy cơ tuyệt chủng.' },
        { q: 'A ___ amount of food is thrown away every day.', options: ['heavy', 'strong', 'huge'], correct: 2, why: '**a huge / large amount of** + N không đếm được. heavy đi với traffic / rain; strong đi với wind.' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d2-tu-vung-dich',
      title: 'Dịch câu Task 2 — dùng từ hôm nay (5 câu)',
      kind: 'translate',
      grammar: 'Ø + N nói chung (pollution, plastic waste) · the environment · collocation: reduce emissions, raise awareness of, switch to, run out of.',
      items: [
        { q: 'Nhiều nước đang chuyển sang năng lượng tái tạo.', hint: 'Many countries, are switching to, renewable energy', answers: ['Many countries are switching to renewable energy.', 'Many countries are moving to renewable energy.', 'Many countries are changing to renewable energy.', 'Many nations are switching to renewable energy.'] },
        { q: 'Rác thải nhựa gây hại cho môi trường.', hint: 'Plastic waste (Ø), harms / damages, the environment', answers: ['Plastic waste harms the environment.', 'Plastic waste damages the environment.', 'Plastic waste is harmful to the environment.', 'Plastic waste causes damage to the environment.', 'Plastic waste is bad for the environment.'] },
        { q: 'Trường học nên nâng cao nhận thức về biến đổi khí hậu.', hint: 'Schools, should raise awareness of, climate change', answers: ['Schools should raise awareness of climate change.', 'Schools should raise awareness about climate change.', 'Schools should raise students’ awareness of climate change.', "Schools should raise students' awareness of climate change."] },
        { q: 'Chúng ta có thể cạn kiệt nước sạch.', hint: 'We, may / might / could, run out of, clean water', answers: ['We may run out of clean water.', 'We might run out of clean water.', 'We could run out of clean water.', 'We can run out of clean water.', 'We may run out of fresh water.', 'We might run out of fresh water.'] },
        { q: 'Ô tô là một nguồn khí thải lớn.', hint: 'Cars, are, a major / big source of emissions', answers: ['Cars are a major source of emissions.', 'Cars are a big source of emissions.', 'Cars are a large source of emissions.', 'Cars are a major source of carbon emissions.', 'Cars are a main source of emissions.'] },
      ],
    },

    { t: 'h', text: '5. Thêm: phát âm từ học thuật — /ʃ/ và âm cuối' },
    {
      t: 'p',
      text: 'Từ AWL và từ môi trường có rất nhiều đuôi **-tion, -sion, -cial, -cious** — tất cả đọc **/ʃ/** ("sh"), không đọc "ti-ôn" hay "xi-ần": pollu**tion** /pəˈluːʃn/, finan**cial** /faɪˈnænʃl/. Và nhiều từ kết thúc bằng **cụm phụ âm** -ment, -st, -ct — người Việt hay bỏ âm cuối, làm từ nghe như từ khác.',
    },
    {
      t: 'phatam',
      id: 't2d2-phat-am',
      title: 'Luyện phát âm — /ʃ/ trong -tion / -cial và âm cuối -nt / -st / -kt',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. -tion / -sion / -cial đọc /ʃn/, /ʃl/ — âm tiết cuối rất nhẹ. Giữ rõ /t/ cuối của environment, contract, exhaust.',
      items: [
        { text: 'pollution, emission, conservation', ipa: 'pəluːʃn imɪʃn kɒnsəveɪʃn', vi: '-tion / -sion = /ʃn/' },
        { text: 'financial, beneficial, function', ipa: 'faɪnænʃl benɪfɪʃl fʌŋkʃn', vi: '-cial = /ʃl/ · function /ŋkʃ/' },
        { text: 'environment, establishment, assessment', ipa: 'ɪnvaɪrənmənt ɪstæblɪʃmənt əsesmənt', vi: 'âm cuối -ment /mənt/ — giữ /t/' },
        { text: 'contract, context, exhaust', ipa: 'kɒntrækt kɒntekst ɪɡzɔːst', vi: 'cụm cuối /kt/ /kst/ /st/' },
        { text: 'Air pollution is a serious problem.', ipa: 'eə pəluːʃn ɪz ə sɪəriəs prɒbləm', vi: 'pollution /ʃn/' },
        { text: 'We need financial support for conservation.', ipa: 'wi niːd faɪnænʃl səpɔːt fə kɒnsəveɪʃn', vi: 'financial /ʃl/ · support /t/ cuối' },
        { text: 'The data show a clear link between traffic and disease.', ipa: 'ðə deɪtə ʃəʊ ə klɪə lɪŋk bɪtwiːn træfɪk ənd dɪziːz', vi: 'data /ˈdeɪtə/ · link /ŋk/ · disease /z/ cuối' },
        { text: 'It is estimated that most plastic ends up in landfill.', ipa: 'ɪt ɪz estɪmeɪtɪd ðət məʊst plæstɪk endz ʌp ɪn lændfɪl', vi: 'estimated /ɪd/ · most /st/ · ends /dz/' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Reading ─────────────────────────── */

const T2D2_READING: Lesson = {
  id: 't2d2-doc',
  kind: 'reading',
  title: 'Reading: Summary completion — điền từ lấy trong bài',
  goal: 'Làm đúng dạng Summary completion lấy từ trong bài (không có hộp từ): khoanh vùng đoạn văn, đoán loại từ, chép đúng từ trong bài theo giới hạn số từ — đạt ≥ 9/12 câu với bài đọc ~500 từ về cây xanh đô thị.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Reading** từ 4.0 lên 5.0: đích cuối Tập 2 là **Passage 1 + 2 ≥ 15/27**. Summary completion xuất hiện trong khoảng **nửa số đề** — thường 4–7 câu một lần.',
        'Ở **Tập 1 Ngày 14** bạn làm Summary **có hộp từ** (chọn A–H). Hôm nay là dạng **khó hơn**: **không có hộp**, phải **tự tìm và chép** từ trong bài.',
        'Ba điều quyết định điểm: (1) khoanh đúng **đoạn văn** chứa bản tóm tắt; (2) đoán **loại từ** của chỗ trống (danh từ? động từ? số ít/nhiều?); (3) chép **đúng chính tả, đúng số từ**.',
        'Bản tóm tắt **paraphrase** bài đọc — từ quanh chỗ trống thường **khác** từ trong bài, nhưng **đáp án** thì luôn là **từ nguyên văn** của bài.',
        'Bài đọc tự soạn: **The Cooling Power of City Trees** (khoa học môi trường, ~500 từ) — 12 câu, hai bản tóm tắt.',
      ],
    },

    { t: 'h', text: '1. Summary completion lấy từ trong bài là gì?' },
    {
      t: 'p',
      text: 'Đề cho một đoạn **tóm tắt** (summary) một phần của bài đọc, có các chỗ trống đánh số. Lời dẫn luôn có dạng: **Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.** — điền **không quá hai từ lấy từ bài đọc**. Lời dẫn có thể là ONE WORD ONLY, NO MORE THAN TWO WORDS, hoặc NO MORE THAN THREE WORDS AND/OR A NUMBER — **đọc kỹ và gạch dưới**.',
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Hai kiểu Summary completion',
      cols: [
        {
          title: '**Có hộp từ** (Tập 1 Ngày 14)',
          anh: 'card-index',
          items: ['Chọn chữ cái A–H trong hộp', 'Từ trong hộp thường là **từ đồng nghĩa** với bài', 'Không lo chính tả', 'Có từ thừa gây nhiễu'],
        },
        {
          title: '**Lấy từ trong bài** (hôm nay)',
          anh: 'open-book',
          items: ['Tự **chép** từ trong bài', 'Đáp án là **nguyên văn** bài đọc', 'Sai chính tả / thừa từ = **sai**', 'Phải tôn trọng **giới hạn số từ**'],
        },
      ],
      caption: 'Không được đổi dạng từ: bài viết "absorb" mà bạn ghi "absorbs" hay "absorption" là sai — trừ khi bản tóm tắt bắt buộc dạng đó và bài có đúng dạng đó.',
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Sáu bước làm Summary completion',
      steps: [
        { label: '① Đọc **tiêu đề** + lời dẫn', sub: 'Gạch giới hạn số từ: ONE WORD ONLY / NO MORE THAN TWO WORDS.' },
        { label: '② Đọc lướt **cả bản tóm tắt**', sub: 'Nó tóm tắt đoạn nào? Tìm tên riêng, số, từ hiếm để định vị (London, Medellín, four degrees…).' },
        { label: '③ **Đoán loại từ** từng chỗ trống', sub: 'Sau a / the → danh từ · sau to / can → động từ nguyên mẫu · trước danh từ → tính từ · sau "many" → số nhiều.' },
        { label: '④ **Khoanh vùng** trong bài', sub: 'Các câu hỏi đi theo **thứ tự** bài đọc, thường gói trong 1–2 đoạn.' },
        { label: '⑤ Đọc kỹ câu chứa ý, **tìm từ khớp**', sub: 'Ý giống (paraphrase), từ chép nguyên văn, vừa ngữ pháp câu tóm tắt.' },
        { label: '⑥ **Soát**', sub: 'Đọc lại câu tóm tắt đã điền: đúng ngữ pháp? đúng số từ? đúng chính tả?' },
      ],
      caption: 'Đừng điền theo "từ nghe quen". Điền xong, câu tóm tắt phải đúng cả NGHĨA (khớp bài) lẫn NGỮ PHÁP.',
    },
    {
      t: 'table',
      caption: 'Đoán loại từ từ chữ đứng quanh chỗ trống',
      head: ['Câu tóm tắt', 'Loại từ cần', 'Vì sao'],
      rows: [
        ['roads and roofs ______ heat in the day', '**động từ** (hiện tại, số nhiều)', 'Sau chủ ngữ "roads and roofs", trước tân ngữ "heat".'],
        ['by providing ______', '**danh từ** (tân ngữ của providing)', 'Sau V-ing ngoại động từ.'],
        ['which is called ______', '**danh từ** (tên một quá trình)', '"is called" + tên gọi.'],
        ['the number of ______', '**danh từ số nhiều**', 'the number of + N số nhiều.'],
        ['a ______ effect', '**tính từ** hoặc danh từ làm tính từ', 'Giữa "a" và danh từ.'],
      ],
    },
    {
      t: 'mcq',
      id: 't2d2-doc-loai-tu',
      title: 'Khởi động — chỗ trống cần loại từ nào? (5 câu)',
      items: [
        { q: 'Many residents find it difficult to ______ on hot nights.', options: ['danh từ', 'động từ nguyên mẫu', 'tính từ'], correct: 1, why: 'Sau **to** (difficult to + V) → động từ nguyên mẫu. Đáp án kiểu: **sleep**.' },
        { q: 'Leaves can trap fine ______ from traffic.', options: ['danh từ', 'trạng từ', 'động từ V-ing'], correct: 0, why: 'Sau tính từ **fine**, làm tân ngữ của trap → **danh từ**: dust.' },
        { q: 'The project employed local people as ______.', options: ['tính từ', 'danh từ số ít có a', 'danh từ số nhiều'], correct: 2, why: 'people (số nhiều) **as** + vai trò → danh từ **số nhiều**: gardeners.' },
        { q: 'Planners prefer ______ species, which are adapted to the local climate.', options: ['danh từ số nhiều', 'tính từ', 'động từ quá khứ'], correct: 1, why: 'Đứng trước danh từ **species** → **tính từ** (hoặc danh từ làm tính từ): native.' },
        { q: 'A street with trees was four degrees cooler at ______.', options: ['thời điểm (danh từ)', 'động từ', 'tính từ so sánh'], correct: 0, why: '**at** + thời điểm → danh từ chỉ thời gian: midday, night, 3 p.m.' },
      ],
    },
    {
      t: 'rule',
      formula: 'Giới hạn từ → định vị (tên riêng, số) → loại từ (a/the + N · to + V · adj + N) → chép NGUYÊN VĂN → đọc lại câu',
      vi: 'Đáp án phải đúng nghĩa, vừa ngữ pháp câu tóm tắt và nằm nguyên văn trong bài.',
    },

    { t: 'h', text: '2. Bài đọc — The Cooling Power of City Trees' },
    {
      t: 'canh',
      anh: ['cityscape', 'deciduous-tree', 'thermometer', 'sun'],
      caption: 'Một bài khoa học phổ thông kiểu **Passage 1**: vì sao thành phố nóng hơn nông thôn, cây xanh làm mát bằng cách nào, khó khăn khi trồng cây và vài giải pháp ở Medellín và một số thành phố khác.',
    },
    {
      t: 'p',
      text: '**Làm như thi thật:** đặt giờ **20 phút** cho bài đọc + 12 câu. Đọc lời dẫn và hai bản tóm tắt (cuộn xuống) **trước**, rồi mới đọc bài.',
    },
    {
      t: 'passage',
      title: 'The Cooling Power of City Trees',
      intro: 'You should spend about 20 minutes on Questions 1–12, which are based on the reading passage below.',
      paras: [
        { label: 'A', text: 'On a hot summer afternoon, the temperature in the centre of a large city can be several degrees higher than in the surrounding countryside. Scientists call this the "urban heat island" effect. It happens because roads, roofs and car parks absorb heat during the day and release it slowly at night, while cars and air conditioners add even more. In large tropical cities the difference is often even greater, and on the hottest nights many residents find it difficult to sleep.' },
        { label: 'B', text: 'One of the cheapest ways to reduce this effect is to plant more trees. A large tree cools the air around it in two ways. First, its leaves block sunlight before it reaches the ground, creating shade. Second, it releases water through tiny holes in its leaves, a process known as transpiration. As this water evaporates, it takes heat from the air, in the same way that sweat cools the human body. Researchers in one Australian city found that a street with a full line of trees was, on average, four degrees cooler at midday than a similar street with none.' },
        { label: 'C', text: 'Trees also improve air quality, although this effect is often exaggerated. Leaves can trap fine dust from traffic, which is later washed to the ground by rain. However, a study in London calculated that the city’s eight million trees remove less than two per cent of the dust in the air each year. The main benefit for health, the authors concluded, is not cleaner air but lower temperatures, which reduce the number of heat-related illnesses among older people.' },
        { label: 'D', text: 'Planting trees in a crowded city is not as simple as it sounds. Roots need space, and underground pipes and cables often leave little room for them. In addition, young trees need regular watering for their first three years, and many cities do not have the budget to employ enough gardeners. In one European capital, almost a quarter of the trees planted in a recent five-year programme died before they were five years old, mostly because of dry summers.' },
        { label: 'E', text: 'Some cities have found creative solutions. Medellín in Colombia turned thirty roads and waterways into "green corridors": lines of trees and plants that connect parks across the city. The project, which cost around sixteen million dollars, employed people from poor neighbourhoods as gardeners, and the city reported a fall of two degrees in average temperature along the corridors within three years. Other cities ask residents to look after the tree outside their own home, often through a smartphone app that reminds them when to water it.' },
        { label: 'F', text: 'Experts agree that the choice of trees matters as much as the number. Trees with wide crowns and large leaves provide the most shade, but some of them use too much water to survive in hot, dry places. For this reason, planners increasingly choose native species, which are already adapted to the local climate and are more likely to survive without much care.' },
      ],
    },

    { t: 'h', text: 'Questions 1–7 — Complete the summary (NO MORE THAN TWO WORDS)' },
    {
      t: 'p',
      text: 'Complete the summary below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — Điền **không quá hai từ** lấy từ bài.',
    },
    {
      t: 'examples',
      items: [
        { en: 'Why are cities hotter, and how do trees help?', vi: 'Tiêu đề bản tóm tắt 1 — gói trong đoạn A–C.' },
        { en: 'City centres are often hotter than the countryside because roads, roofs and car parks (1) ______ heat during the day. Trees lower temperatures by providing (2) ______ and by losing water through their leaves, which is called (3) ______. In one Australian city, a street lined with trees was four degrees cooler at (4) ______ than a street without trees. Trees can also catch (5) ______ produced by traffic, although in London this has only a small effect. According to researchers, the main health benefit of trees is a reduction in (6) ______, especially among (7) ______.', vi: 'Thành phố nóng hơn nông thôn vì đường, mái nhà, bãi đỗ xe (1) ___ nhiệt ban ngày. Cây hạ nhiệt bằng cách tạo (2) ___ và thoát nước qua lá, gọi là (3) ___. Ở một thành phố của Úc, phố có cây mát hơn 4 độ lúc (4) ___. Cây còn giữ lại (5) ___ từ xe cộ, dù ở London tác dụng nhỏ. Theo các nhà nghiên cứu, lợi ích sức khoẻ chính là giảm (6) ___, nhất là ở (7) ___.' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d2-doc-tom-tat-1',
      title: 'Questions 1–7 — NO MORE THAN TWO WORDS',
      kind: 'fill',
      items: [
        { q: '(1) roads, roofs and car parks ___ heat during the day', answers: ['absorb'] },
        { q: '(2) Trees lower temperatures by providing ___', answers: ['shade'] },
        { q: '(3) losing water through their leaves, which is called ___', answers: ['transpiration'] },
        { q: '(4) four degrees cooler at ___', answers: ['midday'] },
        { q: '(5) Trees can also catch ___ produced by traffic', answers: ['fine dust', 'dust'] },
        { q: '(6) the main health benefit is a reduction in ___', answers: ['heat-related illnesses', 'heat related illnesses'] },
        { q: '(7) especially among ___', answers: ['older people'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Questions 1–7',
      items: [
        '**(1) absorb** — đoạn A: "roads, roofs and car parks **absorb** heat during the day". Chỗ trống sau chủ ngữ số nhiều → động từ nguyên dạng; không viết ~~absorbs~~.',
        '**(2) shade** — đoạn B: "its leaves block sunlight… **creating shade**". providing shade = creating shade (paraphrase). ~~sunlight~~ sai nghĩa (cây **chặn** ánh nắng).',
        '**(3) transpiration** — "a process **known as transpiration**" = which is called… Chép đúng chính tả.',
        '**(4) midday** — "four degrees cooler **at midday**". Câu tóm tắt đổi "a street with a full line of trees" thành "a street lined with trees".',
        '**(5) fine dust / dust** — đoạn C: "Leaves can **trap fine dust** from traffic". trap = catch. Cả hai cách đều trong giới hạn hai từ.',
        '**(6) heat-related illnesses** — "lower temperatures, which **reduce the number of heat-related illnesses**". Từ có gạch nối tính là **một từ** → tổng hai từ, hợp lệ. Bẫy: ~~cleaner air~~ — bài nói rõ "**not** cleaner air".',
        '**(7) older people** — "…among **older people**". Không viết ~~old people~~ (đổi từ là sai).',
      ],
    },

    { t: 'h', text: 'Questions 8–12 — Complete the summary (ONE WORD ONLY)' },
    {
      t: 'examples',
      items: [
        { en: 'Problems and solutions', vi: 'Tiêu đề bản tóm tắt 2 — gói trong đoạn D–F.' },
        { en: 'Planting trees in cities is difficult. There is often not enough space underground for (8) ______, and young trees must be watered regularly for three years. In one European capital, many new trees died because of dry (9) ______. In Medellín, green corridors were created to link (10) ______, and local people were employed as (11) ______. Today planners often choose (12) ______ species because they need little care.', vi: 'Trồng cây trong thành phố khó. Dưới đất thường không đủ chỗ cho (8) ___, cây non phải được tưới ba năm. Ở một thủ đô châu Âu, nhiều cây mới chết vì (9) ___ khô. Ở Medellín, hành lang xanh được làm để nối (10) ___, người dân địa phương được thuê làm (11) ___. Ngày nay nhà quy hoạch hay chọn loài (12) ___ vì chúng ít cần chăm sóc.' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d2-doc-tom-tat-2',
      title: 'Questions 8–12 — ONE WORD ONLY',
      kind: 'fill',
      items: [
        { q: '(8) not enough space underground for ___', answers: ['roots'] },
        { q: '(9) many new trees died because of dry ___', answers: ['summers'] },
        { q: '(10) green corridors were created to link ___', answers: ['parks'] },
        { q: '(11) local people were employed as ___', answers: ['gardeners'] },
        { q: '(12) planners often choose ___ species', answers: ['native'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Questions 8–12',
      items: [
        '**(8) roots** — đoạn D: "**Roots need space**, and underground pipes and cables often leave little room for them". ~~pipes~~ / ~~cables~~ là thứ **chiếm chỗ**, không phải thứ cần chỗ.',
        '**(9) summers** — "mostly because of **dry summers**". Giữ **số nhiều** như bài.',
        '**(10) parks** — đoạn E: "lines of trees and plants that **connect parks** across the city". link = connect.',
        '**(11) gardeners** — "employed people from poor neighbourhoods **as gardeners**". Bẫy: đoạn D cũng có "gardeners" nhưng nói về **ngân sách thiếu** — câu tóm tắt nói Medellín → đoạn E.',
        '**(12) native** — đoạn F: "planners increasingly choose **native species**… more likely to survive **without much care**". need little care = without much care.',
      ],
    },
    {
      t: 'note',
      title: 'Những lỗi làm mất điểm ở dạng này',
      items: [
        '**Vượt số từ**: (6) viết ~~the number of heat-related illnesses~~ — đúng ý nhưng 5 từ → sai.',
        '**Đổi dạng từ**: (1) viết ~~absorbs~~ / ~~absorption~~; (9) viết ~~summer~~. Chép **đúng y** bài.',
        '**Lấy từ đúng chủ đề nhưng sai đoạn**: (11) — luôn kiểm tên riêng (Medellín) để biết đúng đoạn.',
        '**Dùng từ của mình**: ~~old people~~, ~~hot weather~~ — nghĩa đúng nhưng không có trong bài → sai.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'absorb', pos: 'v', ipa: '/əbˈzɔːb/', vi: 'hấp thụ', ex: 'Dark roofs absorb more heat than white ones.', exVi: 'Mái nhà tối màu hấp thụ nhiều nhiệt hơn mái trắng.', more: 'Danh từ **absorption**. Ngược nghĩa: **reflect** (phản xạ), **release** (giải phóng).' },
        { w: 'shade', pos: 'n', ipa: '/ʃeɪd/', vi: 'bóng râm', ex: 'We sat in the shade of a big tree.', exVi: 'Chúng tôi ngồi dưới bóng râm của một cây lớn.', more: '**in the shade** (dưới bóng râm) ≠ **shadow** (cái bóng có hình dạng).', anh: 'umbrella-on-ground' },
        { w: 'evaporate', pos: 'v', ipa: '/ɪˈvæpəreɪt/', vi: 'bay hơi', ex: 'Water evaporates faster on hot, windy days.', exVi: 'Nước bay hơi nhanh hơn vào ngày nóng, có gió.', more: 'Danh từ **evaporation** — hay gặp ở Task 1 dạng quy trình (vòng tuần hoàn của nước).' },
        { w: 'exaggerate', pos: 'v', ipa: '/ɪɡˈzædʒəreɪt/', vi: 'phóng đại', ex: 'The benefits of the new law were exaggerated.', exVi: 'Lợi ích của luật mới đã bị phóng đại.', more: 'Hai chữ **g**: exa**gg**erate. Trong Reading, "is exaggerated" báo **tác giả không đồng ý hoàn toàn**.' },
        { w: 'budget', pos: 'n', ipa: '/ˈbʌdʒɪt/', vi: 'ngân sách', ex: 'The city does not have the budget to plant more trees.', exVi: 'Thành phố không có ngân sách để trồng thêm cây.', more: '**on a tight budget** (eo hẹp) · **a budget for** sth.' },
        { w: 'native', pos: 'adj', ipa: '/ˈneɪtɪv/', vi: 'bản địa', ex: 'Native plants need less water than imported ones.', exVi: 'Cây bản địa cần ít nước hơn cây nhập về.', more: '**native species** · **a native speaker** (người bản ngữ).' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Writing ─────────────────────────── */

const T2D2_WRITING: Lesson = {
  id: 't2d2-viet',
  kind: 'writing',
  title: 'Writing Task 2: Opinion essay trọn bài band 5 — thân bài P-E-E',
  goal: 'Biết một bài Task 2 band 5 trông thế nào và vì sao chưa lên 6; viết trọn một bài Opinion 4 đoạn ≥ 250 từ trong 40 phút với hai thân bài theo khung P-E-E (Point – Explain – Example) và quan điểm nhất quán từ mở bài đến kết bài.',
  minutes: 80,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Writing Task 2** từ 4.0 lên 5.0 — chủ yếu ở **Task Response (TR)** (trả lời đủ các phần, có quan điểm rõ) và **Coherence & Cohesion (CC)** (mỗi đoạn một ý, từ nối đúng vai).',
        'Ôn **vòng 2** của Tập 1: mở bài 5 bước (Ngày 6), thân bài (Ngày 8), kết bài và trọn bài (Ngày 10). Hôm nay **gộp lại thành một bài đủ 250+ từ**.',
        'Khung thân bài **P-E-E**: ==Point (câu chủ đề) → Explain (giải thích 1–2 câu) → Example (ví dụ cụ thể)==. Band 4–5 hay thiếu E thứ nhất (giải thích) hoặc ví dụ chung chung.',
        'So **bài band 5** (có thật những lỗi người Việt hay mắc) với **bài khoảng band 6.0–6.5 (ước tính)** cùng đề — thấy rõ mất điểm ở đâu theo **4 tiêu chí**.',
        'Cuối bài: tự viết một bài Opinion cho AI chấm (≥ 250 từ, 40 phút).',
      ],
    },

    { t: 'h', text: '1. Band 5 trông thế nào? — đọc band descriptors' },
    {
      t: 'table',
      caption: 'Task 2 theo 4 tiêu chí — band 4 · 5 · 6 (tóm tắt từ band descriptors công khai)',
      head: ['Tiêu chí', 'Band 4', 'Band 5 (đích Tập 2)', 'Band 6'],
      rows: [
        ['**Task Response** — trả lời đề', 'Trả lời một phần; quan điểm mờ', 'Trả lời **đủ** các phần nhưng chỗ sâu chỗ nông; có quan điểm nhưng **kết luận lặp / chưa rõ**', 'Trả lời đủ mọi phần; **quan điểm rõ xuyên bài**; ý chính có giải thích'],
        ['**Coherence & Cohesion** — mạch lạc', 'Ý có xếp nhưng chưa mạch; and / but / because lặp', 'Có tổ chức; **lạm dụng** Firstly / Moreover / Furthermore hoặc dùng sai; có chia đoạn', 'Ý logic, có tiến triển; từ nối đủ loại; mỗi đoạn một ý trung tâm'],
        ['**Lexical Resource** — từ vựng', 'Từ cơ bản, lặp nhiều; lỗi chính tả làm khó đọc', 'Đủ dùng cho đề nhưng **hạn chế**, lặp; lỗi từ gây khó hiểu chỗ này chỗ kia', 'Đủ rộng; dám dùng từ ít gặp, còn sai nhưng không cản hiểu'],
        ['**Grammatical Range & Accuracy**', 'Câu đơn đúng; lỗi chia động từ, mạo từ thường xuyên', 'Có **thử** câu phức nhưng sai nhiều; lỗi vẫn hay gặp', 'Trộn câu đơn + phức; có lỗi nhưng **hiếm khi** làm sai nghĩa'],
      ],
    },
    {
      t: 'note',
      title: 'Ba điều đẩy bạn từ band 4 lên band 5 nhanh nhất',
      items: [
        '**Đủ 250 từ và đủ 4 đoạn.** Dưới 250 từ bị trừ TR; không chia đoạn thì CC tối đa band 5 → thường 4.',
        '**Một quan điểm, giữ từ đầu đến cuối.** Mở bài nói "agree", kết bài nói "both sides" là lỗi TR phổ biến nhất của band 4–5.',
        '**Mỗi thân bài có giải thích và ví dụ thật** (một người, một nơi, một con số) — không chỉ liệt kê ý.',
      ],
    },

    { t: 'h', text: '2. Khung bài Opinion 4 đoạn' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Opinion essay — "To what extent do you agree or disagree?"',
      steps: [
        { label: '**Mở bài** (2–3 câu, ~45 từ)', sub: 'Bối cảnh / paraphrase đề → **thesis**: quan điểm + (tuỳ) 2 lý do.' },
        { label: '**Thân bài 1** (~90 từ)', sub: 'P: lý do 1 → E: giải thích → E: ví dụ cụ thể.' },
        { label: '**Thân bài 2** (~90 từ)', sub: 'P: lý do 2 (hoặc mặt kia nếu đồng ý một phần) → E → E.' },
        { label: '**Kết bài** (2 câu, ~35 từ)', sub: 'Nhắc lại quan điểm bằng **lời khác** + tóm tắt 2 lý do. Không thêm ý mới.' },
      ],
      caption: 'Tổng ~260–290 từ. Ba lựa chọn quan điểm: hoàn toàn đồng ý · hoàn toàn phản đối · đồng ý một phần (thân bài 1 = mặt đồng ý, thân bài 2 = mặt không).',
    },

    { t: 'h', text: '3. Thân bài P-E-E' },
    {
      t: 'table',
      head: ['Phần', 'Làm gì', 'Câu mở đầu dùng được'],
      rows: [
        ['**P — Point** (câu chủ đề)', 'Nêu **một** lý do, bám đúng thesis. Người đọc chỉ đọc câu này cũng biết cả đoạn nói gì.', 'The main reason is that… · Firstly, … · On the one hand, it is clear that…'],
        ['**E — Explain** (1–2 câu)', 'Giải thích **vì sao / dẫn tới đâu** — đây là phần band 4–5 hay bỏ.', 'This means that… · As a result, … · This is because… · In other words, …'],
        ['**E — Example** (1–2 câu)', 'Ví dụ **cụ thể**: một nơi, một người, một con số, một sự việc. Không viết ví dụ chung chung.', 'For example, … · For instance, … · A good example of this is…'],
        ['(L — Link, tuỳ chọn)', 'Câu chốt nối về thesis — chỉ dùng khi đoạn còn thiếu từ.', 'Therefore, … · This shows that…'],
      ],
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Ví dụ chung chung (band 4–5) vs ví dụ cụ thể (band 6)',
      cols: [
        { title: '**Chung chung**', anh: 'thinking-face', items: ['For example, many people recycle and it is good.', 'For example, the government can make laws.', 'For example, in my country there is a lot of pollution.'] },
        { title: '**Cụ thể**', anh: 'round-pushpin', items: ['For example, since 2019 several supermarkets in Vietnam have wrapped vegetables in banana leaves instead of plastic.', 'For instance, when Hanoi opened its first metro line in 2021, thousands of commuters left their motorbikes at home.', 'A good example is the 2020 drought in the Mekong Delta, which destroyed thousands of hectares of rice.'] },
      ],
      caption: 'Ví dụ cụ thể có ít nhất một trong: tên nơi chốn · thời gian · con số · sự việc có thật hoặc rất có thể xảy ra.',
    },
    {
      t: 'rule',
      formula: 'P (The main reason is that + S + V) → E (This means that + S + V) → E (For example, + nơi / người / số)',
      vi: 'Mỗi thân bài một lý do, đủ ba phần, khoảng 80–100 từ.',
    },
    {
      t: 'mcq',
      id: 't2d2-viet-pee',
      title: 'Câu này là P, E (giải thích) hay E (ví dụ)? (5 câu)',
      items: [
        { q: '"The main reason is that large companies control the biggest sources of pollution."', options: ['Point', 'Explain', 'Example'], correct: 0, why: 'Câu nêu **lý do** chính của đoạn, mở bằng "The main reason is that" → **Point** (câu chủ đề).' },
        { q: '"This means that one decision by a company can reduce emissions more than millions of individual efforts."', options: ['Point', 'Explain', 'Example'], correct: 1, why: '"This means that" giải thích **hệ quả** của Point → **Explain**.' },
        { q: '"For instance, when a factory in one coastal province installed new filters, the dust in nearby villages fell sharply."', options: ['Example', 'Point', 'Explain'], correct: 0, why: 'Có sự việc cụ thể (một nhà máy lắp bộ lọc, bụi ở làng bên giảm) → **Example**.' },
        { q: '"As a result, ordinary people feel that their small actions are pointless."', options: ['Example', 'Point', 'Explain'], correct: 2, why: '"As a result" nối **hệ quả** → **Explain**.' },
        { q: 'Đoạn nào thiếu phần Explain? A: "Firstly, cars cause pollution. For example, Hanoi has six million motorbikes." · B: "Firstly, cars cause pollution. This is because they burn petrol, which releases harmful gases. For example, Hanoi has six million motorbikes."', options: ['Đoạn B', 'Đoạn A', 'Cả hai đủ'], correct: 1, why: 'Đoạn A nhảy thẳng từ Point sang Example — người đọc không biết **vì sao** xe gây ô nhiễm. Đoạn B có câu "This is because…".' },
      ],
    },

    { t: 'h', text: '4. Hai bài mẫu cùng một đề — band 5 và band 6.0–6.5 (ước tính)' },
    {
      t: 'p',
      text: '**Đề:** Some people believe that individuals can do little to protect the environment, and that only governments and large companies can make a real difference. **To what extent do you agree or disagree?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    },
    {
      t: 'note',
      title: 'Bài A — khoảng band 5.0 (252 từ, đã đếm) — đọc và tìm lỗi trước khi xem phân tích',
      items: [
        'Nowadays, the environment problem is more and more serious. Some people think individuals can not do anything to protect the environment and only government and big company can make the difference. In my opinion, I disagree with this opinion.',
        'Firstly, individuals can protect the environment by many ways. For example, we can recycle and use less plastic bag when we go to the supermarket. Moreover, we can go to school by bicycle instead of motorbike, it is also good for our health. Furthermore, if everybody do these things, the pollution will reduce. Therefore, individuals is very important for protecting the environment.',
        'Secondly, the government and company is also important. Because they have a lot of money and power. For example, government can make the law to stop factories make pollution. However, they cannot do everything, people also need to help. Moreover, government can give money to people who buy electric motorbike. In addition, companies can produce more green products, so people can buy them and this is good for the environment.',
        'In Vietnam, many people do not care about the environment. They throw rubbish on the street and in the river. This make the river very dirty and the fish die. So that, we need to change our habit first before we ask the government to do something.',
        'In conclusion, I think individuals can protect the environment and the government and companies also can protect it. Everybody must work together to make the earth become more green and clean in the future.',
      ],
    },
    {
      t: 'table',
      caption: 'Vì sao Bài A dừng ở band 5',
      head: ['Tiêu chí', 'Điểm được', 'Điểm mất'],
      rows: [
        ['**TR** ≈ 5', 'Đủ 250+ từ; trả lời đúng đề; có nhắc cả cá nhân lẫn chính phủ.', '**Quan điểm không nhất quán**: mở bài "disagree" (cá nhân quan trọng), thân bài 2 lại khen chính phủ, kết bài "cả hai" → người đọc không biết bạn đứng đâu. Ý thân bài 1 chỉ liệt kê, không giải thích.'],
        ['**CC** ≈ 5', 'Chia 5 đoạn; có từ nối.', '**Lạm dụng** Firstly / Moreover / Furthermore / Therefore / In addition; đoạn 4 không có câu chủ đề; "**So that**," dùng sai (nghĩa đúng là "So," / "Therefore,"); "In my opinion, I disagree with this opinion" lặp.'],
        ['**LR** ≈ 5', 'Có vài từ đúng chủ đề: recycle, green products, rubbish.', 'Lặp động từ **protect** 5 lần (riêng "protect the environment" 3 lần); collocation sai "~~the pollution will reduce~~" (pollution không tự "reduce" → will **fall / decrease**); "~~make pollution~~" (→ **cause / produce** pollution); "~~more green~~" (→ **greener**); "~~by many ways~~" (→ **in** many ways).'],
        ['**GRA** ≈ 5', 'Có thử câu điều kiện (if…), mệnh đề "so…".', 'Lỗi hoà hợp chủ – vị: ~~everybody do~~, ~~individuals is~~, ~~government and company is~~, ~~This make~~; mạo từ: ~~the environment problem~~, ~~the pollution~~ (nói chung → Ø), ~~government~~ (thiếu the / số nhiều); câu cụt: "~~Because they have a lot of money and power.~~"; ~~stop factories make~~ (→ stop factories **from making**); câu dính liền bằng dấu phẩy (comma splice): "~~…instead of motorbike, it is also good…~~" (→ tách thành hai câu); số nhiều: ~~less plastic bag~~ (→ **fewer** plastic **bags**), ~~big company~~ (→ big **companies**), ~~our habit~~ (→ our **habits**); ~~can not~~ (→ **cannot**); ~~also can~~ (→ **can also**).'],
      ],
    },
    {
      t: 'note',
      title: 'Bài B — khoảng band 6.0–6.5, ước tính (268 từ, đã đếm): câu đơn giản, chính xác, quan điểm rõ',
      items: [
        '[Mở bài] Environmental problems such as air pollution and climate change are becoming more serious every year. Some people argue that ordinary citizens can do very little about these problems and that real change can only come from governments and large companies. I partly agree with this view: although governments and businesses have far more power, individuals still play an important role.',
        '[Thân bài 1 — P-E-E] On the one hand, it is clear that governments and large corporations can achieve much more than individuals. The main reason is that they control the biggest sources of pollution, such as power stations, factories and transport systems. This means that a single government decision can reduce emissions far more than millions of people changing their habits. For example, when a country builds a metro system or switches from coal to solar power, the air quality in its cities can improve within a few years.',
        '[Thân bài 2 — P-E-E ×2] On the other hand, individuals are not powerless. Firstly, everyday choices add up when millions of people make them. If every family in a city recycles its plastic waste and takes public transport twice a week, the total amount of rubbish and exhaust fumes falls significantly. Secondly, ordinary people influence the decisions of governments and companies. For instance, several supermarkets in Vietnam have started wrapping vegetables in banana leaves instead of plastic because their customers asked for this change.',
        '[Kết bài] In conclusion, I believe that governments and large companies have the greatest power to protect the environment, but individuals can still make a real difference. Both their daily habits and the pressure they put on decision-makers are necessary if we want a cleaner future.',
      ],
    },
    {
      t: 'table',
      caption: 'Vì sao Bài B được khoảng band 6.0–6.5, ước tính (chưa lên 7)',
      head: ['Tiêu chí', 'Bài B làm được', 'Vì sao chưa band 7'],
      rows: [
        ['**TR** ≈ 6–6.5', 'Thesis "partly agree" rõ ngay mở bài; thân bài 1 = mặt đồng ý, thân bài 2 = mặt không; kết bài **khớp** thesis. Mỗi ý có giải thích + ví dụ.', 'Ví dụ thân bài 1 còn **giả định chung** (a country builds a metro…), chưa có nơi / năm cụ thể; ý chưa đào sâu tới "vì sao chính phủ không tự làm".'],
        ['**CC** ≈ 6–6.5', 'Mỗi đoạn một ý trung tâm; từ nối đúng vai: On the one hand / On the other hand / Firstly / Secondly / This means that / For instance. Dùng **referencing**: these problems, this view, this change.', 'Từ nối vẫn đúng "công thức", hơi máy móc.'],
        ['**LR** ≈ 6–6.5', 'Từ đúng chủ đề và **xoay vòng**: governments and large companies → businesses → large corporations → decision-makers; collocation đúng: reduce emissions, switch from coal to solar power, take public transport, make a real difference.', 'Ít từ ít gặp, ít sắc thái (chưa có kiểu "a drop in the ocean", "bear the main responsibility").'],
        ['**GRA** ≈ 6–6.5', 'Trộn câu đơn – phức: although…, when…, If… , because…, such as…; mạo từ và hoà hợp chủ – vị đúng (every family **recycles**, the total amount… **falls**).', 'Cấu trúc còn an toàn, chưa đa dạng (chưa có bị động, mệnh đề quan hệ không xác định…).'],
      ],
    },
    {
      t: 'table',
      caption: 'Sửa từng lỗi của Bài A theo Bài B',
      head: ['Bài A (band 5)', 'Sửa theo Bài B (band 6.0–6.5, ước tính)'],
      rows: [
        ['~~the environment problem is more and more serious~~', '**environmental problems** … **are becoming more serious**'],
        ['~~In my opinion, I disagree with this opinion.~~', '**I partly agree with this view:** although…, …'],
        ['~~if everybody do these things, the pollution will reduce~~', 'If **every family recycles** …, **the total amount of rubbish falls** significantly.'],
        ['~~Because they have a lot of money and power.~~ (câu cụt)', '**The main reason is that** they control the biggest sources of pollution.'],
        ['~~make the law to stop factories make pollution~~', '**pass laws to stop factories from causing** pollution'],
        ['~~make the earth become more green~~', '**if we want a cleaner future** / make the planet **greener**'],
      ],
    },

    { t: 'h', text: '5. Viết lại đoạn — luyện P-E-E' },
    {
      t: 'quiz',
      id: 't2d2-viet-dich',
      title: 'Dịch câu thân bài (5 câu) — ghép thành một đoạn P-E-E',
      kind: 'translate',
      grammar: 'P: The main reason is that + S + V. · E: This means that + S + V. · E: For example, + câu cụ thể. Hoà hợp chủ – vị; Ø + N nói chung.',
      items: [
        { q: 'Lý do chính là túi nhựa mất hàng trăm năm để phân huỷ.', hint: 'The main reason is that, plastic bags, take hundreds of years, to break down / to decompose', answers: ['The main reason is that plastic bags take hundreds of years to break down.', 'The main reason is that plastic bags take hundreds of years to decompose.', 'The main reason is that plastic bags take hundreds of years to break down completely.', 'The main reason is that plastic bags need hundreds of years to break down.', 'The main reason is that it takes hundreds of years for plastic bags to break down.'] },
        { q: 'Điều này có nghĩa là chúng gây hại cho động vật biển trong một thời gian rất dài.', hint: 'This means that, they harm, sea animals / marine animals, for a very long time', answers: ['This means that they harm sea animals for a very long time.', 'This means that they harm marine animals for a very long time.', 'This means they harm sea animals for a very long time.', 'This means that they harm sea creatures for a very long time.', 'This means that they can harm sea animals for a very long time.', 'This means that they damage marine life for a very long time.'] },
        { q: 'Ví dụ, người ta đã tìm thấy hơn 20 cái túi nhựa trong dạ dày một con rùa biển.', hint: 'For example, more than 20 plastic bags, were / have been found, in the stomach of a sea turtle', answers: ['For example, more than 20 plastic bags were found in the stomach of a sea turtle.', 'For example, more than 20 plastic bags have been found in the stomach of a sea turtle.', "For example, more than 20 plastic bags were found in a sea turtle's stomach.", "For example, more than 20 plastic bags have been found in a sea turtle's stomach.", 'For example, people found more than 20 plastic bags in the stomach of a sea turtle.', 'For example, people have found more than 20 plastic bags in the stomach of a sea turtle.', 'For example, scientists found more than 20 plastic bags in the stomach of a sea turtle.', 'For example, more than twenty plastic bags were found in the stomach of a sea turtle.', 'For example, more than twenty plastic bags have been found in the stomach of a sea turtle.', 'For example, over 20 plastic bags were found in the stomach of a sea turtle.', 'For example, over 20 plastic bags have been found in the stomach of a sea turtle.', 'For instance, more than 20 plastic bags were found in the stomach of a sea turtle.', 'For instance, more than 20 plastic bags have been found in the stomach of a sea turtle.', 'For example, more than 20 plastic bags were found in the stomach of a turtle.', 'For example, more than 20 plastic bags were found in the stomach of a marine turtle.'] },
        { q: 'Tôi đồng ý một phần với quan điểm này.', hint: 'partly agree, with this view', answers: ['I partly agree with this view.', 'I partly agree with this opinion.', 'I partially agree with this view.', 'I agree with this view to some extent.', 'I partly agree with this idea.'] },
        { q: 'Cá nhân vẫn đóng một vai trò quan trọng.', hint: 'Individuals, still play, an important role', answers: ['Individuals still play an important role.', 'Individuals still have an important role.', 'Individuals still play an important part.', 'Individuals still play a significant role.'] },
      ],
    },
    {
      t: 'rule',
      formula: 'Mở bài (paraphrase + thesis) → TB1 P-E-E → TB2 P-E-E → Kết bài (quan điểm lời khác + 2 lý do) · 260–290 từ · 40 phút',
      vi: 'Một quan điểm từ đầu đến cuối; mỗi thân bài một lý do có giải thích và ví dụ cụ thể.',
    },

    { t: 'h', text: '6. Viết bài — AI chấm 4 tiêu chí' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Phân bổ 40 phút',
      steps: [
        { label: '5′ — Đọc đề, chọn quan điểm, dàn ý', sub: 'Viết nháp: thesis + 2 Point + 2 Example (chỉ từ khoá).' },
        { label: '5′ — Mở bài', sub: 'Bối cảnh 1 câu + thesis 1 câu.' },
        { label: '22′ — Hai thân bài', sub: 'Mỗi đoạn ~11 phút: P → E → E.' },
        { label: '4′ — Kết bài', sub: 'In conclusion, + quan điểm lời khác + gói 2 lý do.' },
        { label: '4′ — Soát', sub: 'Đếm từ · hoà hợp chủ – vị · mạo từ (Ngày 1) · từ lặp.' },
      ],
      caption: 'Ngày 6 học kỹ cách lập dàn ý 5 phút và quản lý 20/40 phút cho cả hai Task.',
    },
    {
      t: 'essay',
      id: 't2d2-viet-bai',
      task: 'Task 2',
      prompt: 'Some people think that single-use plastic products, such as bags, cups and straws, should be banned completely. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
      minWords: 250,
      tips: [
        'Chọn **một** quan điểm: hoàn toàn đồng ý / đồng ý một phần (cấm nhưng có ngoại lệ, ví dụ ống hút cho người bệnh) / phản đối. Viết thesis rõ ở cuối mở bài.',
        'Mỗi thân bài **P-E-E**: The main reason is that… → This means that… → For example, … (nơi / năm / con số).',
        'Dùng từ Ngày 2: **single-use plastics, end up in landfill, impose a ban on, switch to, raise awareness of, environmentally friendly alternatives**.',
        'Soát mạo từ (Ngày 1): **Plastic waste** (Ø, nói chung) · **the environment** · **a ban on**.',
        'Kết bài **không thêm ý mới**, không chép nguyên thesis.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D2_HOMEWORK: Lesson = {
  id: 't2d2-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 2',
  goal: 'Tự kiểm tra Ngày 2 bằng 34 câu có đáp án: 10 câu nghĩa từ AWL, 8 câu dạng từ, 6 câu Summary completion trên bài đọc mới, 6 câu dịch câu Task 2 và 4 câu sắp xếp đoạn P-E-E.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (34 câu)',
      items: [
        '**Phần I** — Nghĩa từ AWL & môi trường (10 câu trắc nghiệm).',
        '**Phần II** — Dạng từ (8 câu điền).',
        '**Phần III** — Summary completion trên một đoạn đọc mới (6 câu, ONE WORD ONLY).',
        '**Phần IV** — Dịch câu Task 2 (6 câu).',
        '**Phần V** — Câu nào là P / E / E trong một đoạn (4 câu trắc nghiệm).',
      ],
    },

    { t: 'h', text: 'Phần I — Nghĩa từ (10 câu)' },
    {
      t: 'mcq',
      id: 't2d2-bt-nghia',
      title: 'Phần I — Chọn từ đúng (10 câu)',
      items: [
        { q: 'We need more ___ before we can say that the new drug works.', options: ['evident', 'evidence', 'evidences'], correct: 1, why: 'Cần **danh từ** sau "more": **evidence** — không đếm được, không thêm -s.' },
        { q: 'Most of the town’s ___ comes from fishing and tourism.', options: ['income', 'factor', 'formula'], correct: 0, why: '**income** = thu nhập — nguồn tiền của thị trấn.' },
        { q: 'The museum was ___ in 1910 by a group of teachers.', options: ['derived', 'established', 'distributed'], correct: 1, why: '**establish** = thành lập (bảo tàng, công ty, trường).' },
        { q: 'Experts ___ that the forest will disappear in fifty years if nothing changes.', options: ['estimate', 'export', 'consist'], correct: 0, why: '**estimate that** + mệnh đề = ước tính rằng.' },
        { q: 'Many English words are ___ from Latin.', options: ['created', 'derived', 'assessed'], correct: 1, why: '**be derived from** = bắt nguồn từ.' },
        { q: 'Teachers ___ students’ progress every month with short tests.', options: ['assume', 'identify', 'assess'], correct: 2, why: '**assess progress** = đánh giá sự tiến bộ.' },
        { q: 'Exhaust ___ from old buses make the air in the city centre dirty.', options: ['habitats', 'fumes', 'droughts'], correct: 1, why: '**exhaust fumes** = khói xả từ xe.' },
        { q: 'The government plans to ___ a ban on plastic straws next year.', options: ['impose', 'raise', 'run'], correct: 0, why: '**impose a ban on** sth = ban hành lệnh cấm.' },
        { q: 'Cutting down forests destroys the natural ___ of many animals.', options: ['landfill', 'emission', 'habitat'], correct: 2, why: '**natural habitat** = môi trường sống tự nhiên.' },
        { q: 'Fishing must be ___ so that there are still fish for our grandchildren.', options: ['sustainable', 'endangered', 'available'], correct: 0, why: '**sustainable** = bền vững — dùng được lâu dài mà không cạn kiệt.' },
      ],
    },

    { t: 'h', text: 'Phần II — Dạng từ (8 câu)' },
    {
      t: 'quiz',
      id: 't2d2-bt-dang-tu',
      title: 'Phần II — Điền dạng đúng của từ trong ngoặc (8 câu)',
      kind: 'fill',
      items: [
        { q: 'There is no clear ___ of "success". (define)', answers: ['definition'] },
        { q: 'The ___ of food to poor families was organised by students. (distribute)', answers: ['distribution'] },
        { q: 'Buying a small car is more ___ than buying a big one. (economy — "tiết kiệm")', answers: ['economical'] },
        { q: 'This chemical is a dangerous ___. (pollute — "chất gây ô nhiễm")', answers: ['pollutant'] },
        { q: 'The government has created three new ___ areas for wild birds. (protect — "được bảo vệ")', answers: ['protected'] },
        { q: 'The ___ of the tourism industry depends on clean beaches. (sustainable — danh từ)', answers: ['sustainability'] },
        { q: 'Ms Lan is a well-known ___ who works to save sea turtles. (conserve — "nhà bảo tồn")', answers: ['conservationist'] },
        { q: 'The report made several wrong ___ about future costs. (assume — số nhiều)', answers: ['assumptions'] },
      ],
    },

    { t: 'h', text: 'Phần III — Summary completion (6 câu)' },
    {
      t: 'passage',
      title: 'A River Brought Back to Life',
      paras: [
        { label: 'A', text: 'For almost half a century, the Cheonggyecheon stream in Seoul was hidden under a concrete road. The stream had become so polluted by waste from homes and markets that the authorities simply covered it. Above it, a busy motorway carried about 170,000 vehicles a day.' },
        { label: 'B', text: 'In 2003, the city decided to remove the motorway and restore the stream. Critics warned that traffic would become impossible, but the city improved its bus network at the same time, and most drivers switched to public transport. The new riverside park opened in 2005 and now attracts thousands of visitors every day.' },
        { label: 'C', text: 'The project changed more than the view. Scientists measured air temperatures along the stream that were up to five degrees lower than on nearby streets. The number of fish species in the water also rose from four to twenty-five, showing that the stream had become a habitat again.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'For many years, a stream in Seoul was hidden because it was so (1) ______. A motorway was built over it. In 2003, the city chose to (2) ______ the stream. Many drivers moved to (3) ______ transport because buses had been improved. The new park is visited by thousands of people daily. Temperatures near the stream are up to five (4) ______ lower than on surrounding streets, and the number of fish (5) ______ has increased, which shows the stream is once again a (6) ______.', vi: 'Tóm tắt — ONE WORD ONLY từ bài đọc.' },
      ],
    },
    {
      t: 'quiz',
      id: 't2d2-bt-tom-tat',
      title: 'Phần III — ONE WORD ONLY (6 câu)',
      kind: 'fill',
      items: [
        { q: '(1) hidden because it was so ___', answers: ['polluted'] },
        { q: '(2) the city chose to ___ the stream', answers: ['restore'] },
        { q: '(3) many drivers moved to ___ transport', answers: ['public'] },
        { q: '(4) up to five ___ lower', answers: ['degrees'] },
        { q: '(5) the number of fish ___ has increased', answers: ['species'] },
        { q: '(6) the stream is once again a ___', answers: ['habitat'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Phần III',
      items: [
        '**(1) polluted** — đoạn A "so **polluted** by waste… that the authorities simply covered it". Sau "so" cần tính từ.',
        '**(2) restore** — đoạn B "remove the motorway and **restore** the stream". Sau "to" cần động từ nguyên mẫu. ~~remove~~ là việc làm với **motorway**, không phải stream.',
        '**(3) public** — "most drivers **switched to public transport**" (moved to = switched to).',
        '**(4) degrees** — đoạn C "up to five **degrees** lower". Số nhiều sau "five".',
        '**(5) species** — "the number of fish **species**… rose from four to twenty-five". species số ít và số nhiều cùng một dạng.',
        '**(6) habitat** — "the stream had become a **habitat** again". Phía trước có "a" → danh từ số ít.',
      ],
    },

    { t: 'h', text: 'Phần IV — Dịch câu Task 2 (6 câu)' },
    {
      t: 'quiz',
      id: 't2d2-bt-dich',
      title: 'Phần IV — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'Collocation môi trường · Ø + N nói chung · P-E-E: The main reason is that… / This means that… / For example, …',
      items: [
        { q: 'Ngày nay, ô nhiễm không khí đang trở nên nghiêm trọng hơn.', hint: 'Nowadays, air pollution (Ø), is becoming, more serious', answers: ['Nowadays, air pollution is becoming more serious.', 'Nowadays air pollution is becoming more serious.', 'Nowadays, air pollution is getting more serious.', 'Nowadays air pollution is getting more serious.', 'Nowadays, air pollution is getting worse.', 'Nowadays, air pollution is becoming worse.', 'These days, air pollution is becoming more serious.'] },
        { q: 'Chính phủ nên cấm đồ nhựa dùng một lần.', hint: 'Governments / The government, should ban / impose a ban on, single-use plastics', answers: ['Governments should ban single-use plastics.', 'The government should ban single-use plastics.', 'Governments should impose a ban on single-use plastics.', 'The government should impose a ban on single-use plastics.', 'Governments should ban single-use plastic products.', 'The government should ban single-use plastic products.', 'Governments should ban single-use plastic.', 'The government should ban single-use plastic.'] },
        { q: 'Phần lớn rác thải nhựa cuối cùng nằm ở bãi chôn lấp.', hint: 'Most plastic waste, ends up, in landfill', answers: ['Most plastic waste ends up in landfill.', 'Most plastic waste ends up in landfills.', 'Most plastic waste ends up in a landfill.', 'Most of the plastic waste ends up in landfill.', 'Most plastic rubbish ends up in landfill.'] },
        { q: 'Điều này có nghĩa là các thành phố sẽ sạch hơn.', hint: 'This means that, cities, will be, cleaner', answers: ['This means that cities will be cleaner.', 'This means cities will be cleaner.', 'This means that the cities will be cleaner.', 'This means that cities will become cleaner.'] },
        { q: 'Người dân nên đi phương tiện công cộng thay vì đi xe máy.', hint: 'People, should take / use public transport, instead of, riding motorbikes', answers: ['People should take public transport instead of riding motorbikes.', 'People should use public transport instead of riding motorbikes.', 'People should take public transport instead of using motorbikes.', 'People should use public transport instead of using motorbikes.', 'People should take public transport instead of motorbikes.', 'People should use public transport instead of motorbikes.', 'People should take public transport rather than ride motorbikes.'] },
        { q: 'Năng lượng tái tạo có lợi cho cả nền kinh tế và môi trường.', hint: 'Renewable energy, is beneficial to / benefits, both the economy and the environment', answers: ['Renewable energy is beneficial to both the economy and the environment.', 'Renewable energy benefits both the economy and the environment.', 'Renewable energy is beneficial for both the economy and the environment.', 'Renewable energy is good for both the economy and the environment.'] },
      ],
    },

    { t: 'h', text: 'Phần V — Nhận ra P-E-E (4 câu)' },
    {
      t: 'p',
      text: 'Đọc đoạn thân bài sau (câu ① – ④ đã bị xáo thứ tự), rồi trả lời.',
    },
    {
      t: 'examples',
      items: [
        { en: '① For example, after Ireland introduced a small charge on plastic bags in 2002, the number of bags used fell by around 90 per cent.', vi: '' },
        { en: '② Secondly, a ban or a charge quickly changes people’s habits.', vi: '' },
        { en: '③ As a result, much less plastic ends up in rivers and the sea.', vi: '' },
        { en: '④ When shoppers have to pay even a small amount, they start bringing their own bags.', vi: '' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d2-bt-pee',
      title: 'Phần V — P-E-E (4 câu)',
      items: [
        { q: 'Câu nào là Point (câu chủ đề)?', options: ['①', '②', '③'], correct: 1, why: '② nêu **lý do** của cả đoạn ("Secondly, a ban… changes people’s habits") — các câu khác đều phục vụ ý này.' },
        { q: 'Câu nào là Example?', options: ['④', '③', '①'], correct: 2, why: '① có nơi chốn (Ireland), năm (2002), con số (90 %) → ví dụ cụ thể.' },
        { q: 'Thứ tự P-E-E hợp lý nhất là:', options: ['② ④ ③ ①', '① ② ③ ④', '③ ① ④ ②'], correct: 0, why: 'P ② → giải thích ④ (vì sao thói quen đổi) → hệ quả ③ (As a result) → ví dụ ① (For example). Example đặt cuối là an toàn nhất.' },
        { q: 'Câu ③ "As a result, much less plastic ends up in rivers and the sea" thuộc phần nào?', options: ['Point', 'Explain', 'Example'], correct: 1, why: '"As a result" nêu **hệ quả** → phần Explain (giải thích).' },
      ],
    },
  ],
};

export const NGAY_2: Lesson[] = [T2D2_VOCAB, T2D2_READING, T2D2_WRITING, T2D2_HOMEWORK];
