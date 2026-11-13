/**
 * IELTS Tập 2 · Ngày 4 — Từ vựng AWL sublist 1 (30 họ còn lại) + Health & diet + hệ thống tiền tố / hậu tố
 * [VB1 VC09 VD1] · Reading: Note completion [R08] · Writing: Task 1 line graph trọn bài, overview 2 câu
 * [W02 W08 W17] · Bài tập (34 câu).
 *
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N4. AWL sublist 1 họ 31–60 (indicate → vary) — nửa đầu ở
 * Ngày 2. Ngày chẵn không ghi 🔊 trong bảng 3.2 ⇒ khối `phatam` (1/ngày) đặt ở bài Từ vựng: /ʃ/ /tʃ/ /dʒ/ trong
 * từ sức khoẻ – ăn uống. Bài đọc, biểu đồ, bài mẫu, câu bài tập đều tự soạn; số liệu biểu đồ là số tự đặt.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Từ vựng ─────────────────────────── */

const T2D4_VOCAB: Lesson = {
  id: 't2d4-tu-vung',
  kind: 'vocab',
  title: 'AWL sublist 1 (30 họ còn lại) + Health & diet + tiền tố / hậu tố',
  goal: 'Dùng được 30 họ từ AWL còn lại của sublist 1 và 20 từ + 10 cụm về sức khoẻ – ăn uống; nhìn tiền tố / hậu tố là đoán được nghĩa và loại từ, tự tạo được họ từ để paraphrase trong Writing và đoán từ trong Reading.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Lexical Resource** lên band 5: chủ đề **sức khoẻ – ăn uống** là một trong những đề Task 2 và Part 1–3 hay gặp nhất (diet, exercise, fast food, obesity).',
        'Hoàn tất **AWL sublist 1** (60 họ): hôm nay 30 họ **indicate → vary**. Cộng với Ngày 2, bạn đã có đủ 60 họ từ học thuật hay gặp nhất trong Reading.',
        '**Hệ thống tiền tố / hậu tố** (affixes): **un-, dis-, mis-, over-, re-…** đổi **nghĩa**; **-tion, -ment, -ity, -ful, -ous, -ise, -ly…** đổi **loại từ**. Đây là "chìa khoá" đoán nghĩa từ lạ và paraphrase.',
        'Tập 1 mỗi bài từ vựng có vài họ từ lẻ; hôm nay **gom thành hệ thống** (VD1).',
        '🔊 Phát âm: **/ʃ/ /tʃ/ /dʒ/** trong từ sức khoẻ (nutrition, sugar, cheese, vegetables).',
      ],
    },

    { t: 'h', text: '1. AWL sublist 1 — họ từ 31–45' },
    {
      t: 'vocab',
      items: [
        { w: 'indicate', pos: 'v', ipa: '/ˈɪndɪkeɪt/', vi: 'cho thấy, chỉ ra', ex: 'Recent studies indicate that teenagers sleep less than before.', exVi: 'Các nghiên cứu gần đây cho thấy thiếu niên ngủ ít hơn trước.', more: 'Họ từ: **indication** (n, dấu hiệu) · **indicator** (n, chỉ số). Gần nghĩa: **show, suggest**.' },
        { w: 'individual', pos: 'n, adj', ipa: '/ˌɪndɪˈvɪdʒuəl/', vi: 'cá nhân; riêng lẻ', ex: 'Every individual needs a different amount of sleep.', exVi: 'Mỗi cá nhân cần lượng giấc ngủ khác nhau.', more: '**individually** (adv) · **individuality** (n, cá tính). Trọng âm: indi**VI**dual.' },
        { w: 'interpret', pos: 'v', ipa: '/ɪnˈtɜːprɪt/', vi: 'diễn giải, hiểu; phiên dịch (nói)', ex: 'Doctors interpret test results differently.', exVi: 'Các bác sĩ diễn giải kết quả xét nghiệm khác nhau.', more: '**interpretation** (n) · **interpreter** (phiên dịch viên — nói; **translator** — viết).' },
        { w: 'involve', pos: 'v', ipa: '/ɪnˈvɒlv/', vi: 'bao gồm, liên quan; lôi cuốn tham gia', ex: 'The job involves working at night.', exVi: 'Công việc bao gồm làm đêm.', more: '**involve + V-ing** (không to V) · **be involved in** sth (tham gia) · **involvement** (n).' },
        { w: 'issue', pos: 'n', ipa: '/ˈɪʃuː/', vi: 'vấn đề (cần bàn, giải quyết)', ex: 'Obesity is a serious health issue in many countries.', exVi: 'Béo phì là vấn đề sức khoẻ nghiêm trọng ở nhiều nước.', more: '**raise / address / tackle an issue**. Đọc /ˈɪʃuː/ (Anh cũng /ˈɪsjuː/) — có âm /ʃ/.' },
        { w: 'labour', pos: 'n', ipa: '/ˈleɪbə(r)/', vi: 'lao động (sức lao động, người lao động)', ex: 'Machines have replaced a lot of manual labour on farms.', exVi: 'Máy móc đã thay thế nhiều lao động chân tay ở nông trại.', more: 'Mỹ viết **labor**. Cụm: **the labour market** (thị trường lao động) · **cheap labour** · **labour costs**.' },
        { w: 'legal', pos: 'adj', ipa: '/ˈliːɡl/', vi: 'hợp pháp; thuộc pháp luật', ex: 'Selling cigarettes to children is not legal.', exVi: 'Bán thuốc lá cho trẻ em là không hợp pháp.', more: 'Trái nghĩa **illegal** (tiền tố il- — mục 4). **legally** (adv) · **legal advice**.' },
        { w: 'legislation', pos: 'n', ipa: '/ˌledʒɪsˈleɪʃn/', vi: 'luật pháp, việc lập pháp', ex: 'New legislation limits the amount of sugar in soft drinks.', exVi: 'Luật mới giới hạn lượng đường trong nước ngọt.', more: '**không đếm được**: ~~a legislation~~ → **a piece of legislation / a law**. Động từ **legislate**.' },
        { w: 'major', pos: 'adj', ipa: '/ˈmeɪdʒə(r)/', vi: 'chính, lớn, quan trọng', ex: 'Stress is a major cause of poor sleep.', exVi: 'Căng thẳng là nguyên nhân chính gây ngủ kém.', more: '**majority** (n, đa số): **the majority of** people. Trái nghĩa **minor / minority**.' },
        { w: 'method', pos: 'n', ipa: '/ˈmeθəd/', vi: 'phương pháp', ex: 'Walking is the cheapest method of keeping fit.', exVi: 'Đi bộ là phương pháp giữ dáng rẻ nhất.', more: '**methodology** (phương pháp luận) · **methodical** (có phương pháp). Đọc **/θ/** — lưỡi giữa răng.' },
        { w: 'occur', pos: 'v', ipa: '/əˈkɜː(r)/', vi: 'xảy ra', ex: 'Most accidents occur at home.', exVi: 'Phần lớn tai nạn xảy ra ở nhà.', more: 'Quá khứ **occurred** (hai r) · **occurrence** (n). Trang trọng hơn **happen**. **Không** dùng bị động.' },
        { w: 'per cent', pos: 'n', ipa: '/pə ˈsent/', vi: 'phần trăm', ex: 'Thirty per cent of adults do not get enough exercise.', exVi: 'Ba mươi phần trăm người lớn không tập thể dục đủ.', more: 'Mỹ viết **percent**. **percentage** (n) đi **không có số**: a high **percentage of** people · ~~30 percentage~~.' },
        { w: 'period', pos: 'n', ipa: '/ˈpɪəriəd/', vi: 'giai đoạn, khoảng thời gian', ex: 'Sugar consumption rose over the period shown.', exVi: 'Lượng tiêu thụ đường tăng trong suốt giai đoạn được thể hiện.', more: 'Task 1: **over the period · throughout the period · over a ten-year period**.' },
        { w: 'policy', pos: 'n', ipa: '/ˈpɒləsi/', vi: 'chính sách', ex: 'The school has a policy of serving no fried food.', exVi: 'Trường có chính sách không phục vụ đồ chiên.', more: '**a government policy on** sth · **introduce / adopt a policy**. Số nhiều **policies**.' },
        { w: 'principle', pos: 'n', ipa: '/ˈprɪnsəpl/', vi: 'nguyên tắc', ex: 'The basic principle of a healthy diet is balance.', exVi: 'Nguyên tắc cơ bản của chế độ ăn lành mạnh là cân bằng.', more: 'Đừng nhầm **principal** (hiệu trưởng; chính) — đọc giống nhau. **in principle** = về nguyên tắc.' },
      ],
    },

    { t: 'h', text: '2. AWL sublist 1 — họ từ 46–60' },
    {
      t: 'vocab',
      items: [
        { w: 'proceed', pos: 'v', ipa: '/prəˈsiːd/', vi: 'tiếp tục, tiến hành', ex: 'After the check-up, please proceed to room 4.', exVi: 'Sau khi khám, vui lòng đi tiếp tới phòng 4.', more: '**procedure** (n, thủ tục; ca thủ thuật) · **proceedings** (tiến trình). Gặp nhiều ở Listening (thông báo).' },
        { w: 'process', pos: 'n, v', ipa: '/ˈprəʊses/', vi: 'quá trình; chế biến, xử lý', ex: 'Losing weight is a slow process.', exVi: 'Giảm cân là một quá trình chậm.', more: '**processed food** (đồ ăn chế biến sẵn) · Task 1 **process diagram** (Ngày 20).' },
        { w: 'require', pos: 'v', ipa: '/rɪˈkwaɪə(r)/', vi: 'đòi hỏi, yêu cầu', ex: 'Children require more sleep than adults.', exVi: 'Trẻ em cần ngủ nhiều hơn người lớn.', more: '**requirement** (n) · **be required to + V**. Trang trọng hơn **need**.' },
        { w: 'research', pos: 'n, v', ipa: '/rɪˈsɜːtʃ/', vi: 'nghiên cứu', ex: 'Research shows that breakfast improves concentration.', exVi: 'Nghiên cứu cho thấy bữa sáng giúp tập trung tốt hơn.', more: 'Danh từ **không đếm được**: ~~a research~~, ~~researches~~ → **a study / some research**. **do research on / into** sth · **researcher**.' },
        { w: 'respond', pos: 'v', ipa: '/rɪˈspɒnd/', vi: 'phản hồi, đáp lại; phản ứng (với thuốc)', ex: 'Most patients respond well to the treatment.', exVi: 'Phần lớn bệnh nhân đáp ứng tốt với cách điều trị.', more: '**respond to** sth · **response** (n) · **responsive** (adj).' },
        { w: 'role', pos: 'n', ipa: '/rəʊl/', vi: 'vai trò', ex: 'Parents play a key role in children’s eating habits.', exVi: 'Cha mẹ đóng vai trò then chốt trong thói quen ăn uống của trẻ.', more: '**play a role / part in** + N / V-ing.' },
        { w: 'section', pos: 'n', ipa: '/ˈsekʃn/', vi: 'phần, mục, khu', ex: 'Read section 3 before the lecture.', exVi: 'Đọc mục 3 trước buổi giảng.' },
        { w: 'sector', pos: 'n', ipa: '/ˈsektə(r)/', vi: 'khu vực, ngành (kinh tế)', ex: 'The health sector employs over a million people.', exVi: 'Ngành y tế sử dụng hơn một triệu lao động.', more: '**the public / private sector** · **the service sector**.' },
        { w: 'significant', pos: 'adj', ipa: '/sɪɡˈnɪfɪkənt/', vi: 'đáng kể, quan trọng', ex: 'There was a significant fall in smoking rates.', exVi: 'Tỉ lệ hút thuốc giảm đáng kể.', more: '**significantly** (adv, rất dùng trong Task 1) · **significance** (n). Trái nghĩa **insignificant**.' },
        { w: 'similar', pos: 'adj', ipa: '/ˈsɪmələ(r)/', vi: 'tương tự', ex: 'The two diets are similar in calories.', exVi: 'Hai chế độ ăn tương tự nhau về lượng calo.', more: '**similar to** sth (không ~~similar with~~) · **similarity** · **similarly** (adv — từ nối "tương tự,").' },
        { w: 'source', pos: 'n', ipa: '/sɔːs/', vi: 'nguồn', ex: 'Fish is a good source of protein.', exVi: 'Cá là nguồn đạm tốt.', more: '**a source of** + N. Đọc /sɔːs/ — giống **sauce** (nước sốt) ở Anh-Anh.' },
        { w: 'specific', pos: 'adj', ipa: '/spəˈsɪfɪk/', vi: 'cụ thể, riêng biệt', ex: 'Give a specific example in each body paragraph.', exVi: 'Đưa một ví dụ cụ thể trong mỗi thân bài.', more: '**specifically** · **specify** (v, nêu rõ). Trái nghĩa **general**.' },
        { w: 'structure', pos: 'n', ipa: '/ˈstrʌktʃə(r)/', vi: 'cấu trúc', ex: 'An essay needs a clear structure.', exVi: 'Một bài luận cần cấu trúc rõ ràng.', more: '**structural** (adj) · **well-structured** (được tổ chức tốt). Đọc /tʃ/ ở giữa.' },
        { w: 'theory', pos: 'n', ipa: '/ˈθɪəri/', vi: 'lý thuyết, giả thuyết', ex: 'In theory, the diet should work, but in practice it is hard to follow.', exVi: 'Về lý thuyết chế độ ăn này phải hiệu quả, nhưng thực tế rất khó theo.', more: '**in theory ↔ in practice** · **theoretical** (adj).' },
        { w: 'vary', pos: 'v', ipa: '/ˈveəri/', vi: 'thay đổi, khác nhau', ex: 'Calorie needs vary from person to person.', exVi: 'Nhu cầu calo khác nhau ở mỗi người.', more: 'Họ từ: **variation** · **variety** (a variety of = nhiều loại) · **various** (adj) · **variable**. **vary from… to…**.' },
      ],
    },
    {
      t: 'mcq',
      id: 't2d4-awl-chon',
      title: 'Kiểm tra nhanh — AWL 31–60 (8 câu)',
      items: [
        { q: 'The survey ___ that most students skip breakfast.', options: ['occurs', 'indicates', 'involves'], correct: 1, why: '**indicate that** + mệnh đề = cho thấy rằng. occur không có tân ngữ; involve + N / V-ing.' },
        { q: 'Being a nurse ___ working long hours.', options: ['involves', 'requires to', 'proceeds'], correct: 0, why: '**involve + V-ing** = bao gồm việc. ~~requires to working~~ sai cấu trúc.' },
        { q: 'They have done a lot of ___ on the effects of coffee.', options: ['researches', 'a research', 'research'], correct: 2, why: '**research** không đếm được: không -s, không a.' },
        { q: 'Fruit is a good ___ of vitamins.', options: ['sector', 'source', 'section'], correct: 1, why: '**a source of** = một nguồn (cung cấp) cái gì.' },
        { q: 'A high ___ of teenagers spend over five hours a day online.', options: ['percentage', 'per cent', 'period'], correct: 0, why: '**a high percentage of** (không có số). **per cent** đi sau con số (30 per cent).' },
        { q: 'Prices ___ from shop to shop.', options: ['variety', 'various', 'vary'], correct: 2, why: 'Cần **động từ** sau chủ ngữ "Prices": **vary** (khác nhau). variety là danh từ, various là tính từ.' },
        { q: 'My diet is very ___ to yours: we both eat a lot of rice and fish.', options: ['similar with', 'similar to', 'same to'], correct: 1, why: '**similar to**. ~~same to~~ → **the same as**.' },
        { q: 'Exercise plays a key ___ in preventing heart disease.', options: ['principle', 'policy', 'role'], correct: 2, why: '**play a key role in** + V-ing.' },
      ],
    },

    { t: 'h', text: '3. Health & diet — 20 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'nutrition', pos: 'n', ipa: '/njuˈtrɪʃn/', vi: 'dinh dưỡng', ex: 'Good nutrition is important for children’s growth.', exVi: 'Dinh dưỡng tốt quan trọng cho sự phát triển của trẻ.', more: '**nutritious** (adj, bổ dưỡng) · **nutrient** (n, chất dinh dưỡng) · **nutritionist** (chuyên gia dinh dưỡng).' },
        { w: 'nutritious', pos: 'adj', ipa: '/njuˈtrɪʃəs/', vi: 'bổ dưỡng', ex: 'Pho can be a nutritious meal if it has plenty of vegetables.', exVi: 'Phở có thể là bữa ăn bổ dưỡng nếu có nhiều rau.', anh: 'green-salad' },
        { w: 'balanced diet', pos: 'n', ipa: '/ˌbælənst ˈdaɪət/', vi: 'chế độ ăn cân bằng', ex: 'A balanced diet includes fruit, vegetables, protein and grains.', exVi: 'Chế độ ăn cân bằng gồm trái cây, rau, đạm và ngũ cốc.', more: '**diet** = chế độ ăn hằng ngày (không chỉ "ăn kiêng"). **be on a diet** = đang ăn kiêng.' },
        { w: 'processed food', pos: 'n', ipa: '/ˌprəʊsest ˈfuːd/', vi: 'thực phẩm chế biến sẵn', ex: 'Processed food often contains a lot of salt.', exVi: 'Thực phẩm chế biến sẵn thường chứa nhiều muối.', more: 'Ngược nghĩa: **fresh / whole food**.', anh: 'canned-food' },
        { w: 'junk food', pos: 'n', ipa: '/ˈdʒʌŋk fuːd/', vi: 'đồ ăn vặt kém dinh dưỡng', ex: 'Children see too many adverts for junk food.', exVi: 'Trẻ em xem quá nhiều quảng cáo đồ ăn vặt.', more: '**không đếm được**. Gần nghĩa: **fast food** (đồ ăn nhanh).', anh: 'french-fries' },
        { w: 'obesity', pos: 'n', ipa: '/əʊˈbiːsəti/', vi: 'bệnh béo phì', ex: 'Childhood obesity has doubled in twenty years.', exVi: 'Béo phì ở trẻ em đã tăng gấp đôi trong hai mươi năm.', more: 'Tính từ **obese** /əʊˈbiːs/. Nhẹ hơn: **overweight**. **childhood obesity · obesity rates**.' },
        { w: 'overweight', pos: 'adj', ipa: '/ˌəʊvəˈweɪt/', vi: 'thừa cân', ex: 'About a third of adults in the city are overweight.', exVi: 'Khoảng một phần ba người lớn trong thành phố thừa cân.', more: 'Tiền tố **over-** = quá (mục 4). Trái nghĩa: **underweight**.' },
        { w: 'calorie', pos: 'n', ipa: '/ˈkæləri/', vi: 'calo', ex: 'A can of cola contains about 140 calories.', exVi: 'Một lon cola chứa khoảng 140 calo.', more: '**high-calorie / low-calorie** food · **burn calories**.' },
        { w: 'protein', pos: 'n', ipa: '/ˈprəʊtiːn/', vi: 'chất đạm', ex: 'Eggs and tofu are rich in protein.', exVi: 'Trứng và đậu phụ giàu chất đạm.', more: '**rich in** protein / vitamins / fibre (giàu…).', anh: 'egg' },
        { w: 'fibre', pos: 'n', ipa: '/ˈfaɪbə(r)/', vi: 'chất xơ', ex: 'Brown rice has more fibre than white rice.', exVi: 'Gạo lứt nhiều chất xơ hơn gạo trắng.', more: 'Mỹ viết **fiber**. Không đếm được.' },
        { w: 'sugary', pos: 'adj', ipa: '/ˈʃʊɡəri/', vi: 'nhiều đường', ex: 'Sugary drinks are a major cause of tooth decay.', exVi: 'Đồ uống nhiều đường là nguyên nhân chính gây sâu răng.', more: 'Hậu tố **-y** tạo tính từ (sugar → sugary, salt → salty, oil → oily). Chữ **s** đọc /ʃ/.', anh: 'cup-with-straw' },
        { w: 'portion', pos: 'n', ipa: '/ˈpɔːʃn/', vi: 'khẩu phần, suất ăn', ex: 'Restaurant portions are much bigger than they used to be.', exVi: 'Suất ăn ở nhà hàng lớn hơn trước nhiều.', more: '**portion size** · **a large / small portion of** sth.' },
        { w: 'sedentary', pos: 'adj', ipa: '/ˈsedntri/', vi: 'ít vận động (ngồi nhiều)', ex: 'Office workers often lead a sedentary lifestyle.', exVi: 'Nhân viên văn phòng thường có lối sống ít vận động.', more: '**a sedentary lifestyle / job**. Từ band 6+ — dùng đúng chỗ là ăn điểm LR.' },
        { w: 'chronic', pos: 'adj', ipa: '/ˈkrɒnɪk/', vi: 'mãn tính, kéo dài', ex: 'Diabetes is a chronic disease.', exVi: 'Tiểu đường là bệnh mãn tính.', more: 'Chữ **ch** đọc /k/. Trái nghĩa **acute** (cấp tính).' },
        { w: 'diabetes', pos: 'n', ipa: '/ˌdaɪəˈbiːtiːz/', vi: 'bệnh tiểu đường', ex: 'Too much sugar increases the risk of diabetes.', exVi: 'Quá nhiều đường làm tăng nguy cơ tiểu đường.', more: 'Có **-s** nhưng là danh từ **số ít**: Diabetes **is**… · **diabetic** (adj / n).' },
        { w: 'heart disease', pos: 'n', ipa: '/ˈhɑːt dɪˌziːz/', vi: 'bệnh tim', ex: 'Heart disease is the leading cause of death in many countries.', exVi: 'Bệnh tim là nguyên nhân gây tử vong hàng đầu ở nhiều nước.', more: '**the leading cause of** = nguyên nhân hàng đầu. disease đọc /dɪˈziːz/, hai âm /z/.', anh: 'anatomical-heart' },
        { w: 'life expectancy', pos: 'n', ipa: '/ˈlaɪf ɪkˌspektənsi/', vi: 'tuổi thọ trung bình', ex: 'Life expectancy in Vietnam is now over 73 years.', exVi: 'Tuổi thọ trung bình ở Việt Nam hiện trên 73 năm.', more: 'Hay gặp trong Task 1. **rise in life expectancy**.' },
        { w: 'immune system', pos: 'n', ipa: '/ɪˈmjuːn ˌsɪstəm/', vi: 'hệ miễn dịch', ex: 'Sleep helps your immune system fight infections.', exVi: 'Giấc ngủ giúp hệ miễn dịch chống nhiễm trùng.' },
        { w: 'stress', pos: 'n', ipa: '/stres/', vi: 'căng thẳng', ex: 'Regular exercise reduces stress.', exVi: 'Tập thể dục đều đặn giảm căng thẳng.', more: '**stressful** (adj, gây căng thẳng) · **stressed** (adj, bị căng thẳng) · **under stress**.', anh: 'exploding-head' },
        { w: 'well-being', pos: 'n', ipa: '/ˌwel ˈbiːɪŋ/', vi: 'sức khoẻ tinh thần và thể chất, sự an lạc', ex: 'Spending time in nature improves mental well-being.', exVi: 'Ở giữa thiên nhiên cải thiện sức khoẻ tinh thần.', more: '**physical / mental well-being**. Mỹ hay viết **wellbeing**.' },
      ],
    },

    { t: 'h', text: '4. 10 cụm sức khoẻ ăn điểm' },
    {
      t: 'vocab',
      items: [
        { w: 'keep fit', pos: 'phr', ipa: '/kiːp ˈfɪt/', vi: 'giữ dáng, giữ sức khoẻ', ex: 'I cycle to work to keep fit.', exVi: 'Tôi đạp xe đi làm để giữ sức khoẻ.', more: 'Gần nghĩa **stay in shape**.' },
        { w: 'work out', pos: 'phr v', ipa: '/wɜːk ˈaʊt/', vi: 'tập luyện (thể hình)', ex: 'She works out at the gym three times a week.', exVi: 'Cô ấy tập ở phòng gym ba lần một tuần.', more: 'Danh từ **a workout** (một buổi tập).', anh: 'person-lifting-weights' },
        { w: 'take regular exercise', pos: 'phr', ipa: '/teɪk ˈreɡjələr ˈeksəsaɪz/', vi: 'tập thể dục đều đặn', ex: 'Doctors advise adults to take regular exercise.', exVi: 'Bác sĩ khuyên người lớn tập thể dục đều đặn.', more: '**exercise** (n) chung là **không đếm được**: do / take exercise. ~~do exercises~~ = làm bài tập (cụ thể).' },
        { w: 'put on weight', pos: 'phr', ipa: '/pʊt ɒn ˈweɪt/', vi: 'tăng cân', ex: 'I put on weight when I stopped playing football.', exVi: 'Tôi tăng cân khi thôi đá bóng.', more: 'Đồng nghĩa **gain weight**. Ngược: **lose weight**.' },
        { w: 'lose weight', pos: 'phr', ipa: '/luːz ˈweɪt/', vi: 'giảm cân', ex: 'He lost five kilos by walking every evening.', exVi: 'Anh ấy giảm năm ký nhờ đi bộ mỗi tối.', more: '**lose** /luːz/ (động từ) ≠ **loose** /luːs/ (lỏng). Quá khứ **lost**.' },
        { w: 'skip meals', pos: 'phr', ipa: '/skɪp ˈmiːlz/', vi: 'bỏ bữa', ex: 'Students often skip breakfast before exams.', exVi: 'Học sinh hay bỏ bữa sáng trước kỳ thi.' },
        { w: 'give up', pos: 'phr v', ipa: '/ɡɪv ˈʌp/', vi: 'bỏ (thói quen)', ex: 'My father gave up smoking ten years ago.', exVi: 'Bố tôi bỏ thuốc lá mười năm trước.', more: '**give up + V-ing / N**: give up smoking / sugar.' },
        { w: 'cut back on', pos: 'phr v', ipa: '/kʌt ˈbæk ɒn/', vi: 'giảm bớt', ex: 'Try to cut back on salty snacks.', exVi: 'Cố gắng giảm bớt đồ ăn vặt mặn.', more: 'Gần nghĩa **cut down on** (Ngày 2).' },
        { w: 'lead a healthy lifestyle', pos: 'phr', ipa: '/liːd ə ˈhelθi ˈlaɪfstaɪl/', vi: 'sống lành mạnh', ex: 'It is never too late to lead a healthy lifestyle.', exVi: 'Không bao giờ là quá muộn để sống lành mạnh.', more: 'Đi với **lead / live / have** a … lifestyle. Đối nghĩa: **a sedentary lifestyle**.' },
        { w: 'be at risk of', pos: 'phr', ipa: '/bi ət ˈrɪsk əv/', vi: 'có nguy cơ bị', ex: 'People who sit all day are at risk of heart disease.', exVi: 'Người ngồi cả ngày có nguy cơ mắc bệnh tim.', more: '**increase / reduce the risk of** + N / V-ing.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'A sedentary lifestyle, combined with a diet high in processed food, puts many office workers at risk of chronic diseases such as diabetes.', vi: 'Lối sống ít vận động, cộng với chế độ ăn nhiều đồ chế biến sẵn, khiến nhiều nhân viên văn phòng có nguy cơ mắc bệnh mãn tính như tiểu đường.' },
        { en: 'Governments could tax sugary drinks to encourage people to cut back on sugar.', vi: 'Chính phủ có thể đánh thuế đồ uống có đường để khuyến khích người dân giảm đường.' },
        { en: 'Schools play a key role in teaching children about nutrition and the importance of a balanced diet.', vi: 'Trường học đóng vai trò then chốt trong việc dạy trẻ về dinh dưỡng và tầm quan trọng của chế độ ăn cân bằng.' },
        { en: 'Taking regular exercise not only helps people keep fit but also reduces stress.', vi: 'Tập thể dục đều đặn không chỉ giúp giữ sức khoẻ mà còn giảm căng thẳng.' },
      ],
    },

    { t: 'h', text: '5. Hệ thống tiền tố và hậu tố' },
    {
      t: 'p',
      text: 'Một từ tiếng Anh thường có 3 phần: **tiền tố** (prefix, đứng trước — đổi **nghĩa**) + **gốc** (root) + **hậu tố** (suffix, đứng sau — đổi **loại từ**). Ví dụ **un-health-y**: health (sức khoẻ, danh từ) + **-y** → healthy (tính từ) + **un-** → unhealthy (không lành mạnh). Biết khoảng 25 tiền tố / hậu tố dưới đây, bạn đoán được nghĩa và loại của hàng nghìn từ.',
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Một gốc, nhiều từ',
      steps: [
        { label: 'health (n)', sub: 'sức khoẻ' },
        { label: 'health**y** (adj)', sub: '-y → tính từ: lành mạnh' },
        { label: '**un**healthy (adj)', sub: 'un- → nghĩa phủ định: không lành mạnh' },
        { label: 'health**ily** (adv)', sub: '-ly → trạng từ: một cách lành mạnh' },
        { label: '**un**health**iness** (n)', sub: '-ness → danh từ: sự không lành mạnh' },
      ],
      caption: 'Khi thêm hậu tố vào từ tận cùng -y sau phụ âm: đổi y → i (healthy → healthily, happiness).',
    },
    {
      t: 'table',
      caption: 'Tiền tố (prefix) — đổi nghĩa, KHÔNG đổi loại từ',
      head: ['Tiền tố', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['**un-**', 'không, ngược lại', 'unhealthy · unusual · unemployed · unlock'],
        ['**in- / im- / il- / ir-**', 'không (im- trước p, b, m · il- trước l · ir- trước r)', 'inactive · impossible · illegal · irregular'],
        ['**dis-**', 'không, ngược lại', 'dislike · disagree · disadvantage · disappear'],
        ['**mis-**', 'sai, nhầm', 'misunderstand · misuse · mislead'],
        ['**re-**', 'lại, làm lần nữa', 'recycle · rebuild · rewrite'],
        ['**over- / under-**', 'quá mức / dưới mức', 'overweight · overeat · underweight · underestimate'],
        ['**pre- / post-**', 'trước / sau', 'preschool · post-war · postgraduate'],
        ['**co-**', 'cùng, chung', 'co-worker · cooperate'],
        ['**non-**', 'không phải', 'non-smoker · non-profit'],
        ['**anti-**', 'chống', 'antibiotic · anti-smoking'],
      ],
    },
    {
      t: 'table',
      caption: 'Hậu tố (suffix) — đổi LOẠI TỪ',
      head: ['Tạo ra', 'Hậu tố', 'Ví dụ'],
      rows: [
        ['**Danh từ** (việc, tính chất)', '-tion / -sion · -ment · -ness · -ity · -ance / -ence · -ure', 'pollution · treatment · fitness · obesity · importance · pressure'],
        ['**Danh từ** (người)', '-er / -or · -ist · -ian · -ee', 'researcher · doctor · nutritionist · physician · employee'],
        ['**Tính từ**', '-ful · -less · -able / -ible · -al · -ive · -ous · -ic · -y', 'harmful · useless · avoidable · medical · active · nutritious · economic · salty'],
        ['**Động từ**', '-ise / -ize · -en · -ify', 'modernise · strengthen · identify'],
        ['**Trạng từ**', '-ly', 'regularly · significantly · healthily'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '**-ful** ≠ **-less**: harm**ful** (có hại) ↔ harm**less** (vô hại). care**ful** ↔ care**less**.',
        'Không phải từ nào cũng ghép được mọi tiền tố: ~~unpossible~~ → **im**possible; ~~inhealthy~~ → **un**healthy. Khi không chắc, tra từ điển.',
        'Một số từ có **-ly** là **tính từ**, không phải trạng từ: **friendly, lonely, lovely, likely** — ~~She smiled friendly~~ → She smiled **in a friendly way**.',
        'Trọng âm có thể **chuyển** khi thêm hậu tố: **E**conomy → eco**NO**mic; **PHO**tograph → pho**TO**graphy. Ngày 13 học kỹ.',
      ],
    },
    {
      t: 'rule',
      formula: 'Tiền tố (un- dis- in- mis- re- over-) đổi NGHĨA · Hậu tố (-tion -ment -ness -ity → N · -ful -ous -al -ive → adj · -ise -ify → V · -ly → adv) đổi LOẠI TỪ',
      vi: 'Gặp từ lạ: tách tiền tố – gốc – hậu tố để đoán nghĩa và biết nó đứng được ở đâu trong câu.',
    },
    {
      t: 'quiz',
      id: 't2d4-tien-hau-to',
      title: 'Điền dạng đúng — tiền tố / hậu tố (10 câu)',
      kind: 'fill',
      items: [
        { q: 'Eating too much fast food is ___ for your heart. (harm → tính từ "có hại")', answers: ['harmful'] },
        { q: 'Smoking in restaurants is ___ in many countries. (legal → "bất hợp pháp")', answers: ['illegal'] },
        { q: 'It is ___ to run a marathon without training. (possible → "không thể")', answers: ['impossible'] },
        { q: 'People who ___ often feel tired after lunch. (eat → "ăn quá nhiều")', answers: ['overeat'] },
        { q: 'Regular exercise improves your ___. (fit → danh từ)', answers: ['fitness'] },
        { q: 'He became a ___ after studying food science. (nutrition → người)', answers: ['nutritionist'] },
        { q: 'Many young people are physically ___ because they sit all day. (active → "không năng động")', answers: ['inactive'] },
        { q: 'The new law will ___ the rules on food labels. (strong → động từ "làm mạnh hơn")', answers: ['strengthen'] },
        { q: 'You should eat ___ if you want to live longer. (healthy → trạng từ)', answers: ['healthily'] },
        { q: 'One ___ of living in a city is the lack of green space. (advantage → "bất lợi")', answers: ['disadvantage'] },
      ],
    },
    {
      t: 'quiz',
      id: 't2d4-tu-vung-dich',
      title: 'Dịch câu sức khoẻ (5 câu)',
      kind: 'translate',
      grammar: 'Cụm: lead a healthy lifestyle · take regular exercise · be at risk of · cut back on · a good source of. Ø + N chung (Obesity, Junk food).',
      items: [
        { q: 'Béo phì là một vấn đề sức khoẻ nghiêm trọng.', hint: 'Obesity (Ø), is, a serious health issue / problem', answers: ['Obesity is a serious health issue.', 'Obesity is a serious health problem.', 'Obesity is a serious issue for health.'] },
        { q: 'Cá là nguồn đạm tốt.', hint: 'Fish, is, a good source of protein', answers: ['Fish is a good source of protein.', 'Fish is a great source of protein.', 'Fish is a rich source of protein.'] },
        { q: 'Người ít vận động có nguy cơ mắc bệnh tim.', hint: 'People who…, are at risk of, heart disease', answers: ['People who do not exercise are at risk of heart disease.', "People who don't exercise are at risk of heart disease.", 'People who exercise little are at risk of heart disease.', 'Inactive people are at risk of heart disease.', 'People who are inactive are at risk of heart disease.', 'People with a sedentary lifestyle are at risk of heart disease.', 'People who do little exercise are at risk of heart disease.', 'People who lead a sedentary lifestyle are at risk of heart disease.'] },
        { q: 'Tôi đang cố giảm bớt đồ uống có đường.', hint: 'am trying to, cut back on / cut down on, sugary drinks', answers: ['I am trying to cut back on sugary drinks.', "I'm trying to cut back on sugary drinks.", 'I am trying to cut down on sugary drinks.', "I'm trying to cut down on sugary drinks."] },
        { q: 'Nghiên cứu cho thấy bữa sáng giúp học sinh tập trung.', hint: 'Research (không a), shows / indicates, that breakfast helps students concentrate', answers: ['Research shows that breakfast helps students concentrate.', 'Research indicates that breakfast helps students concentrate.', 'Research shows that breakfast helps students to concentrate.', 'Research indicates that breakfast helps students to concentrate.', 'Research shows breakfast helps students concentrate.', 'Research suggests that breakfast helps students concentrate.', 'Research shows that breakfast helps students focus.', 'Research shows that having breakfast helps students concentrate.'] },
      ],
    },

    { t: 'h', text: '6. Thêm: phát âm /ʃ/ · /tʃ/ · /dʒ/ trong từ sức khoẻ' },
    {
      t: 'table',
      head: ['Âm', 'Cách đọc', 'Từ hôm nay'],
      rows: [
        ['/ʃ/', 'môi tròn đẩy ra, hơi xì liên tục, **không** chạm lưỡi ("sh")', 'nutri**tion** · **s**ugar · i**ss**ue · por**tion** · na**ti**onal'],
        ['/tʃ/', 'đầu lưỡi chạm lợi rồi bật ra thành /ʃ/ ("ch" bật)', '**ch**eese · **ch**icken · struc**t**ure · ri**ch**'],
        ['/dʒ/', 'như /tʃ/ nhưng **rung** cổ', '**j**unk · ve**g**etable · lar**g**e · ener**g**y'],
      ],
    },
    {
      t: 'phatam',
      id: 't2d4-phat-am',
      title: 'Luyện phát âm — /ʃ/ /tʃ/ /dʒ/',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. /ʃ/ kéo dài được (shhh), /tʃ/ và /dʒ/ bật một lần. vegetable đọc 3 âm tiết: VEJ-tə-bl.',
      items: [
        { text: 'sugar, nutrition, portion', ipa: 'ʃʊɡə njutrɪʃn pɔːʃn', vi: '/ʃ/' },
        { text: 'cheese, chicken, structure', ipa: 'tʃiːz tʃɪkɪn strʌktʃə', vi: '/tʃ/' },
        { text: 'junk, vegetables, energy', ipa: 'dʒʌŋk vedʒtəblz enədʒi', vi: '/dʒ/' },
        { text: 'sheep, cheap, jeep', ipa: 'ʃiːp tʃiːp dʒiːp', vi: '/ʃ/ ≠ /tʃ/ ≠ /dʒ/' },
        { text: 'Sugary drinks are a major issue.', ipa: 'ʃʊɡəri drɪŋks ər ə meɪdʒər ɪʃuː', vi: 'sugary /ʃ/ · major /dʒ/ · issue /ʃ/' },
        { text: 'Junk food is cheap but not nutritious.', ipa: 'dʒʌŋk fuːd ɪz tʃiːp bət nɒt njutrɪʃəs', vi: 'junk /dʒ/ · cheap /tʃ/ · nutritious /ʃ/' },
        { text: 'Children should eat more fresh vegetables.', ipa: 'tʃɪldrən ʃʊd iːt mɔː freʃ vedʒtəblz', vi: '/tʃ/ /ʃ/ /ʃ/ /dʒ/' },
        { text: 'A balanced diet gives you energy.', ipa: 'ə bælənst daɪət ɡɪvz ju enədʒi', vi: 'balanced /st/ · energy /dʒ/' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Reading ─────────────────────────── */

const T2D4_READING: Lesson = {
  id: 't2d4-doc',
  kind: 'reading',
  title: 'Reading: Note completion',
  goal: 'Làm đúng dạng Note completion: dùng tiêu đề ghi chú để định vị đoạn, đoán loại từ trong câu ghi chú viết tắt, chép đúng từ trong bài theo giới hạn — đạt ≥ 9/12 câu với bài đọc ~400 từ về bữa trưa học đường ở Nhật.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Reading** về đích **Passage 1 + 2 ≥ 15/27** (band 5). Note completion là dạng **điền từ** dễ lấy điểm nhất nếu biết dùng **tiêu đề** của ghi chú.',
        'Note completion = **ghi chú** có tiêu đề và gạch đầu dòng, câu **viết tắt** (bỏ chủ ngữ, bỏ động từ to be). Khác Summary (Ngày 2): Summary là **đoạn văn liền**.',
        'Hai kỹ năng: (1) **tiêu đề ghi chú** cho biết thông tin nằm ở **đoạn nào**; (2) chữ quanh chỗ trống cho biết **loại từ** (số? danh từ số nhiều? tính từ?).',
        'Đáp án luôn là từ **nguyên văn** trong bài, đúng giới hạn số từ, và thường đi **theo thứ tự** bài.',
        'Bài đọc: **School Lunch, Japanese Style** — 12 câu, chủ đề sức khoẻ – ăn uống (từ vựng bài 1).',
      ],
    },

    { t: 'h', text: '1. Note completion trông như thế nào?' },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Summary (Ngày 2) và Notes (hôm nay)',
      cols: [
        { title: '**Summary completion**', anh: 'page-facing-up', items: ['Đoạn văn liền, câu đầy đủ', 'Từ quanh chỗ trống paraphrase bài', 'Ngữ pháp câu giúp đoán loại từ'] },
        { title: '**Note completion**', anh: 'spiral-notepad', items: ['Tiêu đề + gạch đầu dòng', 'Câu rút gọn: "Eaten in ___, not a canteen"', 'Tiêu đề mục → định vị đoạn văn', 'Hay hỏi số, tên, danh từ'] },
      ],
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Năm bước làm Note completion',
      steps: [
        { label: '① Gạch giới hạn số từ', sub: 'ONE WORD ONLY / NO MORE THAN TWO WORDS AND/OR A NUMBER.' },
        { label: '② Đọc **tiêu đề lớn và tiêu đề mục**', sub: 'Mỗi tiêu đề mục ~ một đoạn văn (Typical meal → đoạn tả bữa ăn).' },
        { label: '③ **Đoán loại từ** từng dòng', sub: '"in ___" → năm / nơi chốn · "paid by ___" → người / tổ chức · "about ___ yen" → số.' },
        { label: '④ Định vị bằng **từ khoá dễ thấy**', sub: 'Số, tên riêng, từ hiếm: 1954, yen, white coats, obesity.' },
        { label: '⑤ Chép nguyên văn, soát ngữ pháp + số từ', sub: 'Đọc lại cả dòng ghi chú đã điền.' },
      ],
      caption: 'Ghi chú bỏ bớt chữ, nên đừng tìm câu giống y ghi chú — tìm Ý giống.',
    },
    {
      t: 'mcq',
      id: 't2d4-doc-doan',
      title: 'Khởi động — chỗ trống cần gì? (4 câu)',
      items: [
        { q: 'Law introduced in ______', options: ['một năm', 'một người', 'một tính từ'], correct: 0, why: '"introduced in" + năm / tháng → một **con số năm** (ví dụ 1954).' },
        { q: 'Parents pay about ______ yen per meal', options: ['một danh từ số nhiều', 'một con số', 'một động từ'], correct: 1, why: '"about ___ yen" → **con số**.' },
        { q: 'Salaries paid by ______', options: ['tính từ', 'trạng từ', 'người / tổ chức (danh từ)'], correct: 2, why: '"paid by" + **ai trả** → danh từ chỉ người / tổ chức.' },
        { q: 'Low rate of childhood ______', options: ['danh từ (một bệnh / tình trạng)', 'động từ quá khứ', 'con số'], correct: 0, why: '"rate of childhood ___" → danh từ (một tình trạng sức khoẻ): obesity.' },
      ],
    },

    { t: 'h', text: '2. Bài đọc — School Lunch, Japanese Style' },
    {
      t: 'canh',
      anh: ['bento-box', 'cooked-rice', 'glass-of-milk', 'school'],
      caption: 'Bài kiểu **Passage 1** về **kyushoku** — bữa trưa ở trường tiểu học Nhật Bản: ăn gì, ai nấu, ai dọn, có tác dụng gì với sức khoẻ, giá bao nhiêu.',
    },
    {
      t: 'passage',
      title: 'School Lunch, Japanese Style',
      intro: 'You should spend about 20 minutes on Questions 1–12, which are based on the reading passage below.',
      paras: [
        { label: 'A', text: 'In most Japanese state primary schools, lunch is not simply a break between lessons. It is called kyushoku, and it is treated as part of the curriculum. Since 1954, a national law has supported school lunch as part of education, and today the meals are also meant to teach children about nutrition, local food and good manners. Millions of pupils sit down to the same balanced meal as their classmates, in their own classrooms rather than in a canteen.' },
        { label: 'B', text: 'A typical meal consists of rice, a bowl of soup, a main dish of fish or meat with vegetables, and a small carton of milk. Menus are planned by a qualified nutritionist who works at the school or for the local area, and each meal provides about a third of the energy a child needs in a day. Fried dishes are served less often than grilled or steamed ones, and soft drinks are never served.' },
        { label: 'C', text: 'Perhaps the most surprising feature for foreign visitors is that the children serve the food themselves. Each week a different group puts on white coats and hats, collects the food from the kitchen and serves their classmates. After eating, pupils clear the tables, separate the milk cartons for recycling and clean the classroom. Teachers say this teaches responsibility and respect for the people who grow and cook the food.' },
        { label: 'D', text: 'Many schools also use kyushoku to teach children where food comes from. Ingredients are often bought from farms near the school, and on special days the menu features a dish from another region of Japan or from another country. Some schools invite local farmers to have lunch with the pupils and talk about their work.' },
        { label: 'E', text: 'The system appears to work. Japan has one of the lowest rates of childhood obesity among wealthy nations, and studies have found that children eat more vegetables on school days than at weekends. Researchers point out, however, that diet is only one factor: most Japanese children also walk to school, usually in small groups, and this daily exercise plays a part as well.' },
        { label: 'F', text: 'Kyushoku is not free, but it is cheap. Parents pay around 250 yen per meal, which covers only the cost of the ingredients; the salaries of the cooks and nutritionists are paid by local governments. In recent years, some cities have made school meals free for all families, arguing that every child should have at least one healthy meal a day.' },
      ],
    },
    {
      t: 'p',
      text: '**Questions 1–12.** Complete the notes below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
    },
    {
      t: 'table',
      caption: 'Kyushoku — Japanese school lunch',
      head: ['Tiêu đề mục', 'Ghi chú'],
      rows: [
        ['**Background**', '• seen as part of the (1) ______ · • national law since (2) ______ · • eaten in (3) ______, not a canteen'],
        ['**Typical meal**', '• rice, soup, main dish and a small carton of (4) ______ · • menus planned by a (5) ______ · • (6) ______ are never served'],
        ['**Children’s role**', '• serving group wears white coats and (7) ______ · • milk cartons separated for (8) ______'],
        ['**Results**', '• low rate of childhood (9) ______ · • children also get exercise by walking to (10) ______'],
        ['**Cost**', '• parents pay about (11) ______ yen per meal · • staff salaries paid by (12) ______'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d4-doc-ghi-chu',
      title: 'Questions 1–12 — NO MORE THAN TWO WORDS AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '(1) seen as part of the ___', answers: ['curriculum'] },
        { q: '(2) national law since ___', answers: ['1954'] },
        { q: '(3) eaten in ___, not a canteen', answers: ['classrooms', 'their classrooms', 'own classrooms'] },
        { q: '(4) a small carton of ___', answers: ['milk'] },
        { q: '(5) menus planned by a ___', answers: ['nutritionist', 'qualified nutritionist'] },
        { q: '(6) ___ are never served', answers: ['soft drinks'] },
        { q: '(7) wears white coats and ___', answers: ['hats'] },
        { q: '(8) milk cartons separated for ___', answers: ['recycling'] },
        { q: '(9) low rate of childhood ___', answers: ['obesity'] },
        { q: '(10) walking to ___', answers: ['school'] },
        { q: '(11) about ___ yen per meal', answers: ['250'] },
        { q: '(12) staff salaries paid by ___', answers: ['local governments'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Questions 1–12',
      items: [
        '**(1) curriculum** — A: "it is treated as **part of the curriculum**". seen as = treated as.',
        '**(2) 1954** — A: "**Since 1954**, a national law has supported school lunch…".',
        '**(3) classrooms** — A: "in their own **classrooms rather than in a canteen**". rather than = not. Ghi "their classrooms" / "own classrooms" (2 từ) cũng hợp lệ.',
        '**(4) milk** — B: "and **a small carton of milk**".',
        '**(5) nutritionist** — B: "Menus are planned by a **qualified nutritionist**". Có "a" → số ít. "qualified nutritionist" (2 từ) cũng đúng.',
        '**(6) soft drinks** — B: "**soft drinks are never served**". Bẫy: fried dishes are served **less often** (vẫn có, chỉ ít hơn) → không phải "never".',
        '**(7) hats** — C: "puts on **white coats and hats**". wears = puts on.',
        '**(8) recycling** — C: "separate the milk cartons **for recycling**".',
        '**(9) obesity** — E: "one of the lowest rates of **childhood obesity**".',
        '**(10) school** — E: "most Japanese children also **walk to school**… this daily exercise plays a part".',
        '**(11) 250** — F: "Parents pay **around 250 yen** per meal". about = around.',
        '**(12) local governments** — F: "the salaries of the cooks and nutritionists **are paid by local governments**". Bẫy: parents pay for **ingredients**, không trả lương.',
      ],
    },
    {
      t: 'note',
      title: 'Nhìn lại — vì sao tiêu đề quan trọng',
      items: [
        'Năm tiêu đề mục (Background · Typical meal · Children’s role · Results · Cost) khớp gần đúng với đoạn **A · B · C · E · F**. Đoạn **D** không có câu hỏi — đề thật cũng có đoạn "trống" như vậy.',
        'Câu (6) và (12) là hai câu **hai từ** — nếu bạn ghi ~~drinks~~ hay ~~governments~~ thì thiếu ý; ghi ~~the local governments~~ thì quá số từ.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'curriculum', pos: 'n', ipa: '/kəˈrɪkjələm/', vi: 'chương trình học', ex: 'Cooking is part of the school curriculum in Japan.', exVi: 'Nấu ăn là một phần chương trình học ở Nhật.', more: 'Số nhiều **curricula** hoặc **curriculums**. **extra-curricular activities** = hoạt động ngoại khoá.' },
        { w: 'canteen', pos: 'n', ipa: '/kænˈtiːn/', vi: 'căng tin, nhà ăn', ex: 'Most students eat in the school canteen.', exVi: 'Phần lớn học sinh ăn ở căng tin trường.', more: 'Mỹ: **cafeteria**.' },
        { w: 'qualified', pos: 'adj', ipa: '/ˈkwɒlɪfaɪd/', vi: 'có chuyên môn, có bằng cấp', ex: 'Only qualified teachers can work in state schools.', exVi: 'Chỉ giáo viên có chứng chỉ mới được dạy ở trường công.', more: '**qualification** (n, bằng cấp) · **qualify** (v).' },
        { w: 'ingredient', pos: 'n', ipa: '/ɪnˈɡriːdiənt/', vi: 'nguyên liệu (nấu ăn)', ex: 'Fresh ingredients make a big difference.', exVi: 'Nguyên liệu tươi tạo khác biệt lớn.' },
        { w: 'occasionally', pos: 'adv', ipa: '/əˈkeɪʒnəli/', vi: 'thỉnh thoảng', ex: 'We occasionally have dessert after dinner.', exVi: 'Thỉnh thoảng chúng tôi ăn tráng miệng sau bữa tối.', more: 'Trạng từ tần suất (Tập 1 Ngày 1): always > usually > often > sometimes > **occasionally** > rarely > never.' },
        { w: 'wealthy', pos: 'adj', ipa: '/ˈwelθi/', vi: 'giàu có', ex: 'Obesity is rising in both wealthy and poor countries.', exVi: 'Béo phì tăng ở cả nước giàu lẫn nước nghèo.', more: 'Danh từ **wealth** (của cải). Gần nghĩa: **rich, affluent**.' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Writing ─────────────────────────── */

const T2D4_WRITING: Lesson = {
  id: 't2d4-viet',
  kind: 'writing',
  title: 'Writing Task 1: biểu đồ đường (line graph) trọn bài — overview 2 câu',
  goal: 'Viết trọn một bài Task 1 biểu đồ đường 160–190 từ trong 20 phút: mở bài paraphrase, overview đúng 2 câu không số, hai thân bài gom nhóm hợp lý, số liệu khớp hình và có so sánh.',
  minutes: 95,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Task 1** lên band 5–5.5 ở tiêu chí **Task Achievement (TA)**: band descriptors tả band 5 là "kể chi tiết **máy móc**", chưa có overview rõ; band 6 mới "**có overview**". Vì vậy viết được **overview rõ + số liệu chọn lọc** là cách chắc nhất để không kẹt dưới band 5.',
        'Ôn **vòng 2** của Tập 1 Ngày 4 (Task 1 là gì, 6 dạng), Ngày 11–12 (từ xu hướng, viết line graph). Hôm nay: **overview đúng 2 câu** + **gom nhóm thân bài** + **soát số**.',
        'Khung: ==Mở bài (1 câu paraphrase) → Overview (2 câu, KHÔNG số) → Body 1 → Body 2 (có số + so sánh)==.',
        'Ngôn ngữ số liệu (W17): **rise / fall / peak / remain stable** + trạng từ **slightly / steadily / sharply** + giới từ **to / by / at / from…to** (Ngày 3).',
        'Bài mẫu biểu đồ **lượng đường tiêu thụ** (nối từ vựng sức khoẻ), rồi bạn tự viết một bài cho AI chấm.',
        'Bộ công cụ dùng cho **mọi dạng Task 1** (mục 5–6): bảng paraphrase câu mở bài · **number / amount / proportion / figure** · 5 cách gọi chủ ngữ số liệu · **by + năm** · cách **chia thân bài theo số hạng mục** · biểu đồ có đường **Total**.',
        '**Biến thể có năm dự báo** (mục 7): phần đã qua dùng quá khứ, năm dự báo dùng **is expected / projected / predicted to** — có bài mẫu riêng.',
      ],
    },

    { t: 'h', text: '1. Task 1 — 7 dạng hình (Tập 2 học 6 dạng đầu)' },
    {
      t: 'table',
      head: ['Dạng hình', 'Mô tả gì', 'Học ở'],
      rows: [
        ['**Line graph** (biểu đồ đường)', 'xu hướng **theo thời gian**', '**Hôm nay** (Ngày 4)'],
        ['Bar chart (biểu đồ cột)', 'so sánh nhóm, có / không có thời gian', 'Ngày 8'],
        ['Pie chart (biểu đồ tròn)', 'tỉ lệ các phần của một tổng', 'Ngày 12'],
        ['Table (bảng)', 'nhiều số — chọn số nổi bật', 'Ngày 16'],
        ['Process (quy trình)', 'các bước, bị động', 'Ngày 20'],
        ['Map (bản đồ)', 'thay đổi trước – sau', 'Ngày 22'],
        ['Mixed (2 hình)', 'kết hợp hai loại', 'Tập 3'],
      ],
    },
    {
      t: 'p',
      text: '**Gặp hình lạ** (không thuộc 7 dạng — ví dụ hình so sánh hai chiếc xe, hai thiết kế nhà, các giai đoạn phát triển của một con vật)? Đừng hoảng: **coi nó là bài so sánh**. Mở bài paraphrase như thường; overview nêu **2–3 khác biệt (hoặc điểm giống) lớn nhất**; thân bài 1 tả vật A, thân bài 2 tả vật B và so luôn với A. Không có số thì so bằng **kích thước, vị trí, số bộ phận, chất liệu**.',
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Bài Task 1 line graph — 4 đoạn, 20 phút',
      steps: [
        { label: '3′ — Đọc hình', sub: 'Cái gì · đơn vị · ở đâu · năm nào · mỗi đường đi thế nào · điểm đặc biệt' },
        { label: '1′ — Mở bài', sub: '1 câu paraphrase đề' },
        { label: '3′ — Overview', sub: '2 câu, không số: xu hướng chung + điểm nổi bật nhất' },
        { label: '10′ — Body 1 + Body 2', sub: 'Gom nhóm: đường giống nhau đi chung; số liệu + so sánh' },
        { label: '3′ — Soát', sub: 'Số khớp hình? Thì quá khứ? to / by / at?' },
      ],
      caption: 'Task 1 KHÔNG có kết bài nêu ý kiến. Overview đã làm việc tổng kết.',
    },

    { t: 'h', text: '2. Overview đúng 2 câu' },
    {
      t: 'table',
      head: ['Câu', 'Nói gì', 'Khung câu'],
      rows: [
        ['**Câu 1** — xu hướng', 'Mỗi đường (hoặc nhóm đường) **tăng / giảm / ổn định** cả giai đoạn.', 'Overall, + A rose…, while B fell…, and C remained stable.'],
        ['**Câu 2** — điểm nổi bật', '**Cao nhất / thấp nhất**, **vượt nhau**, **đạt đỉnh**, **khoảng cách** lớn nhất.', 'A had the highest figure for most of the period, but B had overtaken it by + năm.'],
      ],
    },
    {
      t: 'note',
      title: 'Overview — người Việt hay sai',
      items: [
        '**Có số trong overview**: ~~Overall, the UK rose from 95 to 100 grams.~~ — số để dành cho thân bài.',
        '**Tả một đường**: overview phải nói về **cả hình**, không chỉ một đường.',
        '**Ý kiến / lý do**: ~~Overall, people in Vietnam eat more sugar because they like sweet food.~~ — Task 1 **chỉ mô tả**, không giải thích nguyên nhân.',
        '**Để overview ở cuối với "In conclusion"** — được chấp nhận, nhưng dễ bị quên khi hết giờ. Đặt ngay sau mở bài là an toàn nhất.',
      ],
    },
    {
      t: 'rule',
      formula: 'Overall, + A + rose / fell…, while B…, and C remained stable. + A had the highest… / B overtook A…',
      vi: 'Overview = 2 câu: xu hướng chung của mọi đường + một điểm nổi bật nhất. Không số, không lý do.',
    },

    { t: 'h', text: '3. Ngôn ngữ xu hướng (ôn + mở rộng)' },
    {
      t: 'table',
      caption: 'Hai cách viết cùng một ý',
      head: ['Kiểu', 'Khung', 'Ví dụ'],
      rows: [
        ['**Động từ + trạng từ**', 'S + rose / fell / increased / declined + slightly / steadily / sharply / dramatically', 'Sugar consumption **rose steadily**.'],
        ['**There was + tính từ + danh từ**', 'There was a slight / steady / sharp / dramatic + rise / fall / increase / decline + **in** + N', 'There was **a steady rise in** sugar consumption.'],
        ['**Đỉnh / đáy**', 'peaked at / reached a peak of · hit a low of / fell to a low of', 'UK consumption **peaked at** 100 grams in 2005.'],
        ['**Không đổi**', 'remained stable / stayed at around / levelled off at', 'The figure **remained stable at around** 60 grams.'],
        ['**Vượt**', 'overtook / exceeded / surpassed', 'Vietnam **overtook** the UK between 2015 and 2020.'],
        ['**Giới từ số liệu** (Ngày 3)', 'rose **to** + mức · rose **by** + lượng · **from** X **to** Y · **at** + mức', 'It fell **from** 100 **to** 70 grams, a drop **of** 30 grams.'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d4-viet-xu-huong',
      title: 'Viết lại câu theo kiểu "There was a… in…" (4 câu)',
      kind: 'translate',
      grammar: 'S + V + adv → There was a + adj + N + in + S. sharply → a sharp rise / fall · slightly → a slight · gradually → a gradual.',
      items: [
        { q: 'Viết lại: "The number of gym members rose sharply."', hint: 'There was a sharp rise / increase in…', answers: ['There was a sharp rise in the number of gym members.', 'There was a sharp increase in the number of gym members.'] },
        { q: 'Viết lại: "Smoking rates fell gradually."', hint: 'There was a gradual fall / decline / decrease in…', answers: ['There was a gradual fall in smoking rates.', 'There was a gradual decline in smoking rates.', 'There was a gradual decrease in smoking rates.', 'There was a gradual drop in smoking rates.'] },
        { q: 'Viết lại: "Sugar consumption increased slightly."', hint: 'There was a slight increase / rise in…', answers: ['There was a slight increase in sugar consumption.', 'There was a slight rise in sugar consumption.'] },
        { q: 'Dịch: Con số đạt đỉnh 100 gram vào năm 2005.', hint: 'The figure, peaked at, 100 grams, in 2005', answers: ['The figure peaked at 100 grams in 2005.', 'The figure reached a peak of 100 grams in 2005.', 'In 2005, the figure peaked at 100 grams.', 'In 2005 the figure peaked at 100 grams.'] },
      ],
    },

    { t: 'h', text: '4. Bài mẫu — phân tích từng bước' },
    {
      t: 'p',
      text: '**Đề:** The line graph below shows the average amount of sugar eaten per person per day in the UK, Vietnam and Japan between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    },
    {
      t: 'figure',
      fig: {
        kind: 'line',
        title: 'Average daily sugar consumption per person (grams), 2000–2020',
        note: 'Số liệu tự đặt cho bài luyện.',
        unit: 'grams',
        categories: ['2000', '2005', '2010', '2015', '2020'],
        series: [
          { name: 'UK', values: [95, 100, 98, 85, 70] },
          { name: 'Vietnam', values: [30, 42, 55, 68, 80] },
          { name: 'Japan', values: [60, 58, 60, 59, 57] },
        ],
      },
    },
    {
      t: 'table',
      caption: 'Bước 1 — đọc hình (ghi nháp 3 phút)',
      head: ['Đường', 'Xu hướng', 'Điểm đặc biệt'],
      rows: [
        ['UK', 'tăng nhẹ rồi **giảm** (chậm, sau đó mạnh)', '**đỉnh 100** năm 2005; cao nhất 2000–2015'],
        ['Vietnam', '**tăng đều** (+12–13 mỗi 5 năm)', 'thấp nhất năm 2000 (30) → **cao nhất** năm 2020 (80); vượt UK giữa 2015 và 2020'],
        ['Japan', '**gần như không đổi** (57–60)', 'từ hạng 2 (2000) xuống **thấp nhất** (2020)'],
        ['**Gom nhóm**', 'Body 1 = UK + Vietnam (hai đường **ngược nhau**, cắt nhau) · Body 2 = Japan (đường **phẳng**)', ''],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '[Introduction] The line graph illustrates how much sugar the average person in the UK, Vietnam and Japan consumed per day between 2000 and 2020.', vi: '[Mở bài] Biểu đồ đường cho thấy lượng đường trung bình mỗi người ở Anh, Việt Nam và Nhật tiêu thụ mỗi ngày từ 2000 đến 2020.' },
        { en: '[Overview] Overall, sugar consumption rose steadily in Vietnam but fell in the UK after 2005, while the figure for Japan hardly changed. Although the UK had the highest level for most of the period, Vietnam had overtaken it by 2020.', vi: '[Tổng quan] Nhìn chung, lượng đường tiêu thụ tăng đều ở Việt Nam nhưng giảm ở Anh sau 2005, trong khi con số của Nhật hầu như không đổi. Dù Anh có mức cao nhất trong phần lớn giai đoạn, đến năm 2020 Việt Nam đã vượt Anh.' },
        { en: '[Body 1] In 2000, a person in the UK ate 95 grams of sugar a day on average, more than three times the figure for Vietnam (30 grams). UK consumption increased slightly to a peak of 100 grams in 2005, but then it declined, gradually at first and then more sharply, reaching 70 grams in 2020. In contrast, consumption in Vietnam climbed by 12 or 13 grams every five years and finished at 80 grams, ten grams more than in the UK.', vi: '[Thân bài 1] Năm 2000, một người Anh ăn trung bình 95 gram đường mỗi ngày, gấp hơn ba lần con số của Việt Nam (30 gram). Lượng tiêu thụ ở Anh tăng nhẹ lên đỉnh 100 gram năm 2005, rồi giảm, lúc đầu chậm rồi mạnh hơn, còn 70 gram năm 2020. Ngược lại, ở Việt Nam con số tăng 12–13 gram mỗi năm năm và kết thúc ở 80 gram, nhiều hơn Anh mười gram.' },
        { en: '[Body 2] Japan showed a very different pattern. Its consumption remained stable at around 60 grams throughout the period, never rising above 60 or falling below 57. As a result, Japan went from having the second-highest level in 2000 to the lowest in 2020.', vi: '[Thân bài 2] Nhật cho thấy một mô hình rất khác. Lượng tiêu thụ ổn định quanh 60 gram suốt giai đoạn, không bao giờ trên 60 hay dưới 57. Kết quả là Nhật từ mức cao thứ hai năm 2000 xuống thấp nhất năm 2020.' },
      ],
    },
    {
      t: 'table',
      caption: 'Soát số — mọi con số trong bài mẫu khớp hình',
      head: ['Câu trong bài mẫu', 'Hình', 'Khớp?'],
      rows: [
        ['UK 95 grams in 2000 · "more than three times" Vietnam (30)', '95 ÷ 30 ≈ 3,2', '✓'],
        ['peak of 100 grams in 2005', 'UK 2005 = 100 (cao nhất của UK)', '✓'],
        ['declined gradually at first, then more sharply · 70 in 2020', '100 → 98 (−2) → 85 (−13) → 70 (−15)', '✓'],
        ['Vietnam climbed by 12 or 13 grams every five years · finished at 80', '30 → 42 → 55 → 68 → 80 (+12, +13, +13, +12)', '✓'],
        ['ten grams more than in the UK', '2020: 80 − 70 = 10', '✓'],
        ['Japan stable around 60, never above 60 or below 57', '60 · 58 · 60 · 59 · 57', '✓'],
        ['second-highest in 2000 → lowest in 2020', '2000: UK 95 > Japan 60 > VN 30 · 2020: VN 80 > UK 70 > Japan 57', '✓'],
        ['UK highest for most of the period · Vietnam had overtaken it by 2020', 'UK cao nhất 2000–2015; 2020 VN 80 > UK 70', '✓'],
      ],
    },
    {
      t: 'table',
      caption: 'Vì sao bài mẫu (184 từ, đã đếm) đạt khoảng band 6.0–6.5 (ước tính)',
      head: ['Tiêu chí', 'Bài mẫu làm được', 'Để lên band 7 cần'],
      rows: [
        ['**Task Achievement**', 'Overview 2 câu rõ, không số; mọi đường có số chính (đầu, đỉnh, cuối); có so sánh.', 'Chọn số tinh hơn, ví dụ nêu năm cụ thể hai đường cắt nhau (sau 2015).'],
        ['**Coherence & Cohesion**', 'Gom nhóm hợp lý (hai đường ngược nhau / một đường phẳng); từ nối: **In contrast, As a result, at first, then**; referencing **Its, it, the figure**.', 'Nối câu tự nhiên hơn, ít khung cố định.'],
        ['**Lexical Resource**', 'Xoay vòng: consumed · ate · consumption · the figure · level; xu hướng: increased slightly, peaked, declined gradually, climbed, remained stable.', 'Thêm vài từ chính xác hơn (plateaued, a marginal dip).'],
        ['**Grammatical Range**', 'Quá khứ đơn chuẩn; quá khứ hoàn thành (**had overtaken**); cụm V-ing (**reaching 70 grams, never rising above**); so sánh (**more than three times, ten grams more than**).', 'Thêm mệnh đề quan hệ / cấu trúc so sánh nâng cao (Ngày 9).'],
      ],
    },
    {
      t: 'mcq',
      id: 't2d4-viet-overview',
      title: 'Chọn overview tốt nhất cho hình trên (3 câu)',
      items: [
        {
          q: 'Câu overview nào tốt nhất?',
          options: [
            'Overall, the UK rose from 95 to 100 grams, and Vietnam rose from 30 to 80 grams.',
            'Overall, Vietnam saw a steady increase in sugar consumption, the UK saw a decline after 2005, and Japan’s figure stayed almost the same.',
            'Overall, people in Vietnam eat more sugar now because they drink more bubble tea.',
          ],
          correct: 1,
          why: 'B nói xu hướng của **cả ba** đường, không số. A có số (để dành thân bài). C đưa **lý do** — Task 1 không giải thích nguyên nhân.',
        },
        {
          q: 'Câu overview thứ hai nên nói gì?',
          options: ['Vietnam overtook the UK at the end of the period.', 'Japan had 58 grams in 2005.', 'I think the UK should eat less sugar.'],
          correct: 0,
          why: 'Điểm **nổi bật nhất** của hình: thứ hạng đổi — Vietnam vượt UK. B là chi tiết nhỏ có số; C là ý kiến.',
        },
        {
          q: 'Chia thân bài thế nào hợp lý nhất?',
          options: ['Body 1: năm 2000 và 2005 · Body 2: năm 2010–2020', 'Body 1: Japan · Body 2: UK + Vietnam + Japan', 'Body 1: UK + Vietnam (đổi chiều, cắt nhau) · Body 2: Japan (ổn định)'],
          correct: 2,
          why: 'Gom các đường **có câu chuyện liên quan** (hai đường ngược nhau, cắt nhau) và tách đường **phẳng** riêng. Chia theo năm làm bài thành liệt kê.',
        },
      ],
    },

    { t: 'h', text: '5. Câu mở bài & cách gọi số liệu — dùng cho cả 7 dạng' },
    {
      t: 'p',
      text: 'Câu mở bài Task 1 luôn có cùng một khung: **tên hình + động từ + cái gì + ở đâu + khi nào**. Mỗi phần có sẵn vài cách đổi. Bạn chỉ cần đổi **2–3 chỗ** là đủ "paraphrase" — **không** đổi tên riêng, đơn vị, năm.',
    },
    {
      t: 'table',
      caption: 'Bảng paraphrase câu mở bài (dùng cho mọi dạng)',
      head: ['Trong đề', 'Đổi thành', 'Ghi chú'],
      rows: [
        ['The graph / The chart', 'The **line graph** / **bar chart** / **pie charts** / **table** / **diagram** / **maps**', 'Gọi **đúng tên** hình; 2 hình → số nhiều (the two pie charts).'],
        ['shows', '**illustrates** · **compares** (từ 2 nhóm trở lên) · **presents** · **gives information about**', 'compares chỉ dùng khi hình thật sự có nhiều nhóm.'],
        ['the number of people who…', '**how many** people…', 'đếm được → how many'],
        ['the amount of money spent on…', '**how much** money was spent on… · **spending on**…', 'không đếm được → how much'],
        ['the percentage of…', '**the proportion of**… · **what percentage of**…', ''],
        ['information about / data on', '**data on** · **figures for**', ''],
        ['between 2000 and 2020', '**from** 2000 **to** 2020 · **over a twenty-year period**', 'Đếm đúng số năm!'],
        ['in three countries', 'in **Japan, Canada and Vietnam**', 'Gọi tên luôn cho rõ.'],
        ['(Process) how X is made', 'the **stages in the production of** X · **how** X **is produced**', 'Ngày 20'],
        ['(Map) changes to a town', '**how** the town **changed / was developed** between… and…', 'Ngày 22'],
      ],
    },
    {
      t: 'rule',
      formula: 'The + tên hình + illustrates / compares + how many / how much / the proportion of + N + in + nơi + from … to … / over a … period.',
      vi: 'Câu mở bài: đổi 2–3 phần (tên hình, động từ, cụm số liệu, thời gian); giữ nguyên tên riêng, đơn vị, năm.',
    },
    {
      t: 'table',
      caption: 'number / amount / proportion / figure — dùng với gì',
      head: ['Cụm', 'Đi với', 'Đúng', 'Sai hay gặp'],
      rows: [
        ['**the number of**', 'danh từ **đếm được** số nhiều', 'the number of **cars / tourists**', '~~the number of money~~'],
        ['**the amount of**', 'danh từ **không đếm được**', 'the amount of **sugar / water / money**', '~~the amount of people~~'],
        ['**the proportion / percentage of**', 'tỉ lệ (%), cả hai loại danh từ', 'the proportion of **adults who exercise**', '~~the percentage of 30%~~ → **30% of** adults'],
        ['**the figure for**', 'thay cho cả cụm số liệu đã nhắc', 'the figure **for** Japan', '~~the figure of Japan~~'],
        ['**percentage points**', 'khoảng cách giữa hai con số %', 'rose from 20% to 30% = **by 10 percentage points**', '~~rose by 10%~~ (10% của 20 chỉ là 2)'],
      ],
    },
    {
      t: 'note',
      title: 'Số lớn — người Việt hay sai million / thousand',
      items: [
        'Có **số đứng trước** → million / thousand / billion **không thêm -s, không có of**: **five million people**, **2.5 million tonnes**, **three hundred thousand visitors**. ~~five millions people~~ · ~~five million of people~~.',
        'Không có số đứng trước (nghĩa "hàng triệu") → **-s + of**: **millions of people**, **thousands of tourists**.',
        'Đơn vị trên trục là "thousands" / "millions" → viết lại cho đủ: trục ghi 8 (millions) ⇒ **8 million visitors**, đừng viết ~~8 visitors~~.',
      ],
    },
    {
      t: 'table',
      caption: '5 cách gọi chủ ngữ số liệu — xoay vòng để không lặp "the figure"',
      head: ['Cách', 'Ví dụ (cùng một ý: du khách đến Đà Nẵng)'],
      rows: [
        ['1. **the number of** + N', 'The number of visitors to Da Nang rose to 8 million.'],
        ['2. **Con số làm chủ ngữ**', 'Around 8 million tourists visited Da Nang in 2020.'],
        ['3. **Danh từ khác / danh từ hoá**', 'Visitor numbers in Da Nang grew rapidly. · Tourism in Da Nang grew rapidly.'],
        ['4. **Nơi chốn / nhóm người làm chủ ngữ**', 'Da Nang welcomed 8 million visitors. · Hoi An attracted far fewer.'],
        ['5. **the figure for** + nơi / nhóm', 'The figure for Hoi An was much lower, at 3 million.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo xoay vòng chủ ngữ',
      items: [
        'Mỗi 1–2 câu đổi một cách gọi. **Không** để "the figure" đứng đầu hai câu liền nhau.',
        'Cách 2 (con số làm chủ ngữ) **không** mở câu bằng chữ số: ~~8 million tourists…~~ ở đầu câu → **Around 8 million…** hoặc **Some 8 million…**.',
      ],
    },
    {
      t: 'table',
      caption: '"in + năm" khác "by + năm"',
      head: ['Cụm', 'Nghĩa', 'Thì', 'Ví dụ'],
      rows: [
        ['**in** 2010', 'đúng vào năm đó', 'quá khứ đơn', 'In 2010, the figure **reached** 50%.'],
        ['**by** 2010', 'tính dồn **đến** mốc đó (xảy ra lúc nào đó trước hoặc đúng 2010)', '**quá khứ hoàn thành** had + V3', 'By 2010, the figure **had reached** 50%. · Vietnam **had overtaken** the UK **by** 2020.'],
        ['**by** 2040 (dự báo)', 'đến mốc tương lai', 'is expected to + V (band 5) · will have + V3 (band 6+)', 'The figure **is expected to reach** 35% **by** 2040.'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d4-viet-goi-so',
      title: 'Dịch câu số liệu (4 câu)',
      kind: 'translate',
      grammar: 'number (đếm được) / amount (không đếm được) · số + million (không -s) · by + năm + had V3.',
      items: [
        { q: 'Lượng nước tiêu thụ tăng gấp đôi.', hint: 'The amount of water consumed / Water consumption, doubled', answers: ['The amount of water consumed doubled.', 'Water consumption doubled.', 'The amount of water used doubled.', 'The amount of water consumed has doubled.', 'Water consumption has doubled.'] },
        { q: 'Khoảng năm triệu du khách đã tới thành phố vào năm 2019.', hint: 'Around five million tourists, visited', answers: ['Around five million tourists visited the city in 2019.', 'About five million tourists visited the city in 2019.', 'Around 5 million tourists visited the city in 2019.', 'About 5 million tourists visited the city in 2019.', 'In 2019, around five million tourists visited the city.', 'In 2019, about five million tourists visited the city.', 'Approximately five million tourists visited the city in 2019.'] },
        { q: 'Đến năm 2015, con số đã giảm xuống 20%.', hint: 'By 2015, the figure, had fallen to', answers: ['By 2015, the figure had fallen to 20%.', 'By 2015 the figure had fallen to 20%.', 'By 2015, the figure had dropped to 20%.', 'By 2015, the figure had decreased to 20%.', 'By 2015, the figure had declined to 20%.', 'The figure had fallen to 20% by 2015.', 'By 2015, the figure had fallen to 20 per cent.'] },
        { q: 'Con số của Nhật thấp hơn nhiều.', hint: 'The figure for Japan, much lower', answers: ['The figure for Japan was much lower.', "Japan's figure was much lower.", 'The figure for Japan was far lower.', 'The figure for Japan is much lower.'] },
      ],
    },

    { t: 'h', text: '6. Chia thân bài theo số hạng mục' },
    {
      t: 'p',
      text: '"Hạng mục" = mỗi đường, mỗi loại cột, mỗi phần của bánh. Trước khi viết, **đếm số hạng mục** rồi chọn cách chia theo bảng dưới — đỡ mất 3–4 phút phân vân và không bị kể máy móc.',
    },
    {
      t: 'table',
      caption: 'Bảng quyết định chia thân bài',
      head: ['Hình có…', 'Chia thân bài', 'Ghi chú'],
      rows: [
        ['**2–3 hạng mục**, theo thời gian', 'Theo **giai đoạn** (trước / sau điểm đổi chiều) **hoặc** mỗi khổ một nhóm đường có "câu chuyện" chung', 'Như bài mẫu: UK + Vietnam (cắt nhau) / Japan (phẳng).'],
        ['**4 hạng mục**', '**2 + 2** theo xu hướng: nhóm tăng / nhóm giảm (hoặc nhóm cao / nhóm thấp)', ''],
        ['**5–6 hạng mục trở lên**', 'Gom thành **tối đa 4 khối**: khổ 1 = các mục lớn / thay đổi mạnh, khổ 2 = phần còn lại; mỗi khổ 2–3 câu', 'Mục **"Other"** luôn tả **cuối cùng**, 1 câu là đủ.'],
        ['Chỉ **2 mốc năm** (bar / pie / table)', 'Theo **nhóm tăng / nhóm giảm** — **không** chia "năm đầu / năm cuối"', 'Chia theo năm = kể hai lần cùng các mục.'],
        ['Có **năm dự báo**', '**Đã qua → dự báo** (ngoại lệ — mục 7)', 'Mỗi khổ một nhóm thì.'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'Spending on both housing and transport rose, housing to a greater extent.', vi: 'Chi tiêu cho cả nhà ở và đi lại đều tăng, nhà ở tăng nhiều hơn. (**to a greater extent** = ở mức lớn hơn — gộp hai mục cùng chiều, khác độ lớn)' },
        { en: 'Coffee and tea sales both declined, although tea fell to a lesser extent.', vi: 'Doanh số cà phê và trà đều giảm, dù trà giảm ít hơn. (**to a lesser extent** = ở mức nhỏ hơn)' },
        { en: 'The remaining category, "Other", stayed at around 5% throughout.', vi: 'Hạng mục còn lại, "Khác", giữ quanh 5% suốt giai đoạn. (Other: một câu, đặt cuối)' },
      ],
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Đường lên xuống nhiều lần → tối đa 3–4 chặng',
      steps: [
        { label: '1. Đánh dấu đầu & cuối', sub: 'Số năm đầu, số năm cuối' },
        { label: '2. Khoanh đỉnh & đáy', sub: 'Điểm cao nhất, điểm thấp nhất (chỉ những điểm đổi chiều lớn)' },
        { label: '3. Cắt thành 3–4 chặng', sub: 'Mỗi chặng nằm giữa hai điểm đã khoanh' },
        { label: '4. Mỗi chặng 1 câu', sub: 'Động từ xu hướng + số đầu / cuối chặng' },
      ],
      caption: 'Dao động nhỏ giữa một chặng → gom bằng "fluctuated between X and Y". Không tả từng năm một.',
    },
    {
      t: 'examples',
      items: [
        { en: 'The number of visitors rose from 20,000 to a peak of 45,000 in 2008, then fell sharply to 25,000 in 2012. After fluctuating between 25,000 and 30,000 for several years, it recovered to 40,000 in 2020.', vi: 'Một đường lên xuống 7–8 lần, nhưng chỉ tả 3 chặng: lên đỉnh → rơi xuống → dao động rồi hồi lại. Đủ ý, kịp giờ.' },
      ],
    },
    {
      t: 'note',
      title: 'Biểu đồ có đường / cột "Total" — tả tổng trước',
      items: [
        'Đường (hoặc cột) **Total** = cộng các phần lại. Số đã có sẵn trên hình — **không** cần tự cộng.',
        '**Overview**: câu 1 nói **tổng** tăng / giảm thế nào; câu 2 nói **phần nào gây ra** phần lớn thay đổi đó. Ví dụ: Overall, **total** energy use rose over the period, **mainly because of** a sharp increase in electricity, while gas use fell.',
        '**Thân bài 1** mở bằng số của **tổng** (đầu → cuối); **thân bài 2** tả các thành phần, phần đóng góp lớn nhất trước.',
        'Bảng có **hàng / cột Total** làm y như vậy (Ngày 16).',
      ],
    },
    {
      t: 'rule',
      formula: 'Đếm hạng mục → 2–3: theo giai đoạn / nhóm · 4: 2 + 2 · 5+: ≤ 4 khối, Other cuối · 2 mốc năm: tăng / giảm · Total: tổng trước.',
      vi: 'Chọn cách chia thân bài TRƯỚC khi viết, theo số hạng mục và loại hình.',
    },

    { t: 'h', text: '7. Biến thể: biểu đồ đường có năm dự báo' },
    {
      t: 'p',
      text: 'Một số đề có các năm **trong tương lai** (thường đánh dấu * hoặc ghi "projected / forecast"). Đây là số **dự báo** — chưa xảy ra. Khó nhất của dạng này là **đổi thì ngay trong một đường**: phần đã qua dùng quá khứ đơn, phần dự báo dùng khung "được dự đoán là sẽ…".',
    },
    {
      t: 'p',
      text: '**Đề:** The line graph below shows the percentage of the population aged 65 and over in Japan, Canada and Vietnam between 2000 and 2020, with projections for 2030 and 2040. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    },
    {
      t: 'figure',
      fig: {
        kind: 'line',
        title: 'Percentage of the population aged 65 and over, 2000–2040 (* = projection)',
        note: 'Số liệu tự đặt cho bài luyện. 2030 và 2040 là số dự báo.',
        unit: '%',
        categories: ['2000', '2010', '2020', '2030*', '2040*'],
        series: [
          { name: 'Japan', values: [17, 23, 29, 31, 35] },
          { name: 'Canada', values: [13, 14, 18, 23, 25] },
          { name: 'Vietnam', values: [6, 7, 8, 13, 18] },
        ],
      },
    },
    {
      t: 'table',
      caption: 'Ba phần thời gian — ba nhóm thì',
      head: ['Phần', 'Năm', 'Thì / khung', 'Ví dụ'],
      rows: [
        ['**Đã qua**', '2000 → 2010', 'quá khứ đơn: rose, climbed, saw', 'The figure for Japan **climbed** steadily.'],
        ['**Mốc hiện tại** (năm cuối có số thật)', '2020', 'quá khứ đơn: stood at, reached, was', 'In 2020, it **stood at** 18%.'],
        ['**Dự báo**', '2030*, 2040*', '**is expected / projected / predicted / forecast to** + V · **is likely to** + V', 'It **is projected to reach** 25% **by** 2040.'],
        ['**Overview** (bao cả hai)', 'cả giai đoạn', 'quá khứ + **is expected to continue / keep + V-ing**', 'The share **rose** … and **is expected to keep rising**.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + is expected / projected / predicted / forecast + to V (+ by + năm)', vi: 'chủ ngữ "được dự đoán sẽ…" — khung chính, xoay vòng 4 động từ', examples: [{ en: 'The figure for Japan is predicted to rise to 35% by 2040.', vi: 'Con số của Nhật được dự đoán tăng lên 35% vào năm 2040.' }] },
        { formula: 'S + is likely to + V', vi: 'nhiều khả năng sẽ…', examples: [{ en: 'Canada is likely to follow a similar pattern.', vi: 'Canada nhiều khả năng đi theo xu hướng tương tự.' }] },
        { formula: 'It is predicted / expected that + S + will + V', vi: 'người ta dự đoán rằng…', examples: [{ en: 'It is expected that the figure will double.', vi: 'Người ta dự đoán con số sẽ tăng gấp đôi.' }] },
        { formula: '…, with + N + forecast / projected + to V', vi: 'gói thêm một ý dự báo vào cuối câu (band 6)', examples: [{ en: 'Canada is likely to follow, with its figure forecast to hit 25%.', vi: 'Canada nhiều khả năng theo sau, với con số dự báo đạt 25%.' }] },
      ],
    },
    {
      t: 'note',
      title: 'Ngoại lệ — cẩn thận đừng áp nhầm',
      items: [
        'Mục 4 dặn **"chia theo năm làm bài thành liệt kê"** — đúng với hình thường. Hình có dự báo là **NGOẠI LỆ**: ranh giới "số thật / số dự báo" là một mốc tự nhiên, nên **thân bài 1 = phần đã qua**, **thân bài 2 = phần dự báo**. Trong mỗi khổ **vẫn phải so các đường** với nhau, không kể từng năm.',
        'Không viết số dự báo bằng quá khứ: ~~In 2040, Japan rose to 35%.~~ → Japan **is predicted to rise** to 35% by 2040.',
        'Không lặp **will** ở mọi câu: luân phiên **expected → projected → predicted → is likely to**.',
        'Overview phải **bao cả hai giai đoạn** (đã tăng VÀ được dự đoán tiếp tục tăng), không chỉ nói phần quá khứ.',
      ],
    },
    {
      t: 'rule',
      formula: 'Đã qua → V-ed · Dự báo → is expected / projected / predicted to + V (by + năm)',
      vi: 'Một đường, hai thì: số thật dùng quá khứ đơn, số dự báo dùng khung "được dự đoán". Thân 1 = đã qua, thân 2 = dự báo.',
    },
    {
      t: 'examples',
      items: [
        { en: '[Introduction] The line graph compares the proportion of people aged 65 and over in Japan, Canada and Vietnam from 2000 to 2020, with projections for 2030 and 2040.', vi: '[Mở bài] Biểu đồ đường so sánh tỉ lệ người từ 65 tuổi trở lên ở Nhật, Canada và Việt Nam từ 2000 đến 2020, kèm số dự báo cho 2030 và 2040.' },
        { en: '[Overview] Overall, the share of older people rose in all three countries and is expected to keep rising until 2040. Japan had the oldest population throughout the period, while Vietnam is projected to see the fastest growth in the future.', vi: '[Tổng quan] Nhìn chung, tỉ lệ người cao tuổi tăng ở cả ba nước và được dự đoán tiếp tục tăng tới 2040. Nhật có dân số già nhất suốt giai đoạn, còn Việt Nam được dự báo tăng nhanh nhất trong tương lai.' },
        { en: '[Body 1] In 2000, 17% of Japanese people were aged 65 or over, compared with 13% in Canada and only 6% in Vietnam. Over the next twenty years, the figure for Japan climbed steadily to 29%, whereas the Canadian figure rose more slowly, reaching 18% in 2020. Vietnam saw only a slight increase, to 8%.', vi: '[Thân bài 1 — đã qua, quá khứ đơn] Năm 2000, 17% người Nhật từ 65 tuổi trở lên, so với 13% ở Canada và chỉ 6% ở Việt Nam. Trong hai mươi năm sau, con số của Nhật tăng đều lên 29%, còn của Canada tăng chậm hơn, đạt 18% năm 2020. Việt Nam chỉ tăng nhẹ, lên 8%.' },
        { en: '[Body 2] Looking ahead, the proportion in Japan is predicted to rise to 35% by 2040. Canada is likely to follow a similar pattern, with its figure forecast to hit 25%. The most dramatic change, however, is expected in Vietnam, where older people are projected to make up 18% of the population in 2040, more than double the 2020 level.', vi: '[Thân bài 2 — dự báo] Nhìn về sau, tỉ lệ ở Nhật được dự đoán tăng lên 35% vào 2040. Canada nhiều khả năng theo xu hướng tương tự, với con số dự báo đạt 25%. Tuy nhiên, thay đổi mạnh nhất được dự đoán ở Việt Nam, nơi người cao tuổi được dự báo chiếm 18% dân số năm 2040, hơn gấp đôi mức năm 2020.' },
      ],
    },
    {
      t: 'table',
      caption: 'Soát số + vì sao bài mẫu (177 từ, đã đếm) đạt khoảng band 6.0 (ước tính)',
      head: ['Câu / tiêu chí', 'Kiểm'],
      rows: [
        ['17% · 13% · 6% (2000)', '✓ khớp hình'],
        ['Japan climbed steadily to 29% · Canada rose more slowly, 18% in 2020 · Vietnam slight, to 8%', '✓ 17→23→29 (+12) · 13→14→18 (+5) · 6→7→8'],
        ['Japan 35% by 2040 · Canada 25% · Vietnam 18%, more than double 2020', '✓ 18 ÷ 8 = 2,25'],
        ['"fastest growth" / "most dramatic change" — Vietnam', '✓ 2020→2040: VN +10 điểm, Canada +7, Japan +6'],
        ['**TA**', 'Overview bao cả quá khứ và dự báo; số chọn lọc (đầu, 2020, 2040).'],
        ['**CC**', 'Chia thân bài đã qua / dự báo; nối **Over the next twenty years, Looking ahead, however, whereas**.'],
        ['**LR**', 'Xoay vòng **proportion / share / figure / level**; **expected / predicted / projected / forecast / is likely to**.'],
        ['**GRA**', 'Hai nhóm thì đúng chỗ; mệnh đề **where**; cụm **with + N + forecast to**; **compared with**.'],
      ],
    },

    { t: 'h', text: '8. Viết bài — AI chấm 4 tiêu chí' },
    {
      t: 'figure',
      fig: {
        kind: 'line',
        title: 'Percentage of adults in one city who exercise at least three times a week, 2010–2025',
        note: 'Số liệu tự đặt cho bài luyện.',
        unit: '%',
        categories: ['2010', '2013', '2016', '2019', '2022', '2025'],
        series: [
          { name: 'Men', values: [35, 38, 40, 44, 47, 50] },
          { name: 'Women', values: [22, 25, 30, 36, 41, 46] },
          { name: 'Over 65s', values: [15, 15, 14, 18, 23, 27] },
        ],
      },
    },
    {
      t: 'essay',
      id: 't2d4-viet-bai',
      task: 'Task 1',
      prompt: 'The line graph above shows the percentage of adults in one city who exercised at least three times a week between 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — Men: 2010 35%, 2013 38%, 2016 40%, 2019 44%, 2022 47%, 2025 50% · Women: 22%, 25%, 30%, 36%, 41%, 46% · Over 65s: 15%, 15%, 14%, 18%, 23%, 27%)',
      minWords: 150,
      tips: [
        'Mở bài: shows → **illustrates**; the percentage of adults → **the proportion of adults**; between 2010 and 2025 → **over a fifteen-year period**.',
        'Overview 2 câu: cả ba nhóm **đều tăng**; nam **luôn cao nhất**, nhưng nữ **tăng nhanh nhất** và gần đuổi kịp; nhóm trên 65 thấp nhất.',
        'Gom nhóm: Body 1 = **Men + Women** (khoảng cách thu hẹp từ 13 xuống 4 điểm %); Body 2 = **Over 65s** (đi ngang / giảm nhẹ đến 2016 rồi tăng).',
        'Từ + giới từ: **rose steadily, climbed significantly, dipped slightly, remained unchanged**; **from… to…, by… percentage points**. Số liệu đã qua → **quá khứ đơn**.',
        'Soát số từng câu với hình; nhắm 160–190 từ.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D4_HOMEWORK: Lesson = {
  id: 't2d4-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 4',
  goal: 'Tự kiểm tra Ngày 4 bằng 44 câu có đáp án: 8 câu nghĩa từ, 8 câu tiền tố / hậu tố, 5 câu Note completion, 6 câu ngôn ngữ xu hướng, 7 câu dịch, 3 câu chọn cách chia thân bài, 3 câu "saw + xu hướng", 4 câu thì cho năm dự báo — và một bài viết line graph có năm dự báo cho AI chấm.',
  minutes: 70,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (44 câu + 1 bài viết)',
      items: [
        '**Phần I** — AWL & sức khoẻ (8 câu trắc nghiệm).',
        '**Phần II** — Tiền tố / hậu tố (8 câu điền).',
        '**Phần III** — Note completion trên đoạn đọc ngắn (5 câu).',
        '**Phần IV** — Ngôn ngữ xu hướng Task 1 (6 câu điền).',
        '**Phần V** — Dịch (7 câu).',
        '**Phần VI** — Chọn cách chia thân bài (3 câu trắc nghiệm).',
        '**Phần VII** — Viết lại câu "năm / nơi + saw + xu hướng" (3 câu).',
        '**Phần VIII** — Thì cho năm dự báo (4 câu điền).',
        '**Phần IX** — Viết trọn một bài line graph có năm dự báo (AI chấm).',
      ],
    },

    { t: 'h', text: 'Phần I — Từ vựng (8 câu)' },
    {
      t: 'mcq',
      id: 't2d4-bt-tu-vung',
      title: 'Phần I — Chọn từ đúng (8 câu)',
      items: [
        { q: 'The new ___ bans the sale of energy drinks to under-16s.', options: ['labour', 'sector', 'legislation'], correct: 2, why: '**legislation** = luật (không đếm được) — bans = cấm.' },
        { q: 'Many office workers lead a ___ lifestyle.', options: ['nutritious', 'sedentary', 'chronic'], correct: 1, why: '**a sedentary lifestyle** = lối sống ít vận động.' },
        { q: 'Accidents often ___ when drivers are tired.', options: ['occur', 'require', 'indicate'], correct: 0, why: '**occur** = xảy ra (nội động từ).' },
        { q: 'He ___ weight after he started working from home.', options: ['put on', 'gave up', 'worked out'], correct: 0, why: '**put on weight** = tăng cân.' },
        { q: 'Brown rice is high in ___, which is good for digestion.', options: ['obesity', 'fibre', 'stress'], correct: 1, why: '**fibre** = chất xơ, tốt cho tiêu hoá.' },
        { q: 'The ___ of Japanese people say they eat rice every day.', options: ['major', 'majority', 'minor'], correct: 1, why: '**the majority of** + N = đa số.' },
        { q: 'Students need to learn how to ___ data in charts.', options: ['involve', 'occur', 'interpret'], correct: 2, why: '**interpret data** = diễn giải số liệu.' },
        { q: 'There was a ___ increase in the number of diabetes patients.', options: ['significance', 'significant', 'significantly'], correct: 1, why: 'Trước danh từ **increase** cần **tính từ**: significant.' },
      ],
    },

    { t: 'h', text: 'Phần II — Tiền tố / hậu tố (8 câu)' },
    {
      t: 'quiz',
      id: 't2d4-bt-tien-hau-to',
      title: 'Phần II — Điền dạng đúng (8 câu)',
      kind: 'fill',
      items: [
        { q: 'I completely ___ with the idea of banning fast food. (agree → "không đồng ý")', answers: ['disagree'] },
        { q: 'Many people ___ how much sugar is in fruit juice. (estimate → "đánh giá thấp")', answers: ['underestimate'] },
        { q: 'Eating fruit every day is a simple ___ habit. (health → tính từ)', answers: ['healthy'] },
        { q: 'Some medicines are ___ if you take too much. (danger → tính từ)', answers: ['dangerous'] },
        { q: 'The ___ of the new hospital took three years. (construct → danh từ)', answers: ['construction'] },
        { q: 'After the accident, my grandfather was ___ to walk for a month. (able → "không thể")', answers: ['unable'] },
        { q: 'This old fitness app is completely ___ now. (use → tính từ "vô dụng")', answers: ['useless'] },
        { q: 'Ask the ___ whether you can take this medicine with food. (pharmacy → người: dược sĩ)', answers: ['pharmacist'] },
      ],
    },

    { t: 'h', text: 'Phần III — Note completion (5 câu)' },
    {
      t: 'passage',
      title: 'Walking Meetings',
      paras: [
        { label: 'A', text: 'At a software company in Seattle, managers have replaced many of their weekly meetings with "walking meetings". Instead of sitting around a table, two or three colleagues walk around a nearby park for about thirty minutes while they talk.' },
        { label: 'B', text: 'The idea began in 2019, when the company noticed that staff were spending up to six hours a day sitting. A survey after the first year found that 70 per cent of employees felt more creative after walking meetings, and many said they were more honest with each other when they were not looking at screens.' },
        { label: 'C', text: 'There are limits, however. Walking meetings do not work well for more than three people, and they are not suitable when someone needs to take detailed notes. In bad weather, the company uses an indoor running track instead.' },
      ],
    },
    {
      t: 'table',
      caption: 'Walking meetings — notes (ONE WORD AND/OR A NUMBER)',
      head: ['Mục', 'Ghi chú'],
      rows: [
        ['What', 'colleagues talk while walking around a (1) ______ · length: about (2) ______ minutes'],
        ['Why', 'staff were sitting for up to six (3) ______ a day'],
        ['Results', '70% felt more (4) ______'],
        ['Limits', 'not suitable for taking detailed notes · in bad weather: indoor running (5) ______'],
      ],
    },
    {
      t: 'quiz',
      id: 't2d4-bt-ghi-chu',
      title: 'Phần III — ONE WORD AND/OR A NUMBER (5 câu)',
      kind: 'fill',
      items: [
        { q: '(1) walking around a ___', answers: ['park'] },
        { q: '(2) about ___ minutes', answers: ['30', 'thirty'] },
        { q: '(3) up to six ___ a day', answers: ['hours'] },
        { q: '(4) 70% felt more ___', answers: ['creative'] },
        { q: '(5) indoor running ___', answers: ['track'] },
      ],
    },

    { t: 'h', text: 'Phần IV — Ngôn ngữ xu hướng (6 câu)' },
    {
      t: 'p',
      text: 'Dựa vào biểu đồ lượng đường ở bài Viết (UK 95 · 100 · 98 · 85 · 70; Vietnam 30 · 42 · 55 · 68 · 80; Japan 60 · 58 · 60 · 59 · 57), điền **một từ** vào mỗi chỗ trống.',
    },
    {
      t: 'quiz',
      id: 't2d4-bt-xu-huong',
      title: 'Phần IV — Điền một từ (6 câu)',
      kind: 'fill',
      items: [
        { q: 'UK consumption ___ at 100 grams in 2005. (đạt đỉnh, quá khứ)', answers: ['peaked'] },
        { q: 'Between 2015 and 2020, UK consumption fell ___ 15 grams. (giới từ: lượng giảm)', answers: ['by'] },
        { q: 'Vietnamese consumption rose ___ 30 grams to 80 grams. (giới từ)', answers: ['from'] },
        { q: 'Japanese consumption remained ___ at around 60 grams. (ổn định)', answers: ['stable', 'steady', 'constant'] },
        { q: 'There was a steady ___ in sugar consumption in Vietnam. (danh từ: sự tăng)', answers: ['rise', 'increase', 'growth'] },
        { q: 'In 2020, Japan had the ___ figure of the three countries. (so sánh nhất: thấp)', answers: ['lowest'] },
      ],
    },

    { t: 'h', text: 'Phần V — Dịch (7 câu)' },
    {
      t: 'quiz',
      id: 't2d4-bt-dich',
      title: 'Phần V — Dịch (7 câu)',
      kind: 'translate',
      grammar: 'Cụm sức khoẻ · tiền tố / hậu tố · câu Task 1 (quá khứ đơn + to / by / from…to).',
      items: [
        { q: 'Đồ ăn chế biến sẵn thường chứa nhiều muối.', hint: 'Processed food, often contains, a lot of salt', answers: ['Processed food often contains a lot of salt.', 'Processed food often contains lots of salt.', 'Processed food often has a lot of salt.', 'Processed foods often contain a lot of salt.', 'Processed food usually contains a lot of salt.'] },
        { q: 'Bố tôi đã bỏ thuốc lá năm năm trước.', hint: 'My father, gave up smoking, five years ago', answers: ['My father gave up smoking five years ago.', 'My dad gave up smoking five years ago.', 'My father quit smoking five years ago.', 'My dad quit smoking five years ago.'] },
        { q: 'Tập thể dục đều đặn giúp giảm căng thẳng.', hint: 'Taking regular exercise / Regular exercise, helps (to) reduce stress', answers: ['Regular exercise helps reduce stress.', 'Regular exercise helps to reduce stress.', 'Taking regular exercise helps reduce stress.', 'Taking regular exercise helps to reduce stress.', 'Doing regular exercise helps reduce stress.', 'Exercising regularly helps reduce stress.', 'Exercising regularly helps to reduce stress.'] },
        { q: 'Tỉ lệ béo phì ở trẻ em tăng gấp đôi.', hint: 'The rate of childhood obesity / Childhood obesity rates, doubled', answers: ['The rate of childhood obesity doubled.', 'Childhood obesity rates doubled.', 'The rate of obesity among children doubled.', 'The childhood obesity rate doubled.', 'The rate of childhood obesity has doubled.', 'Childhood obesity rates have doubled.'] },
        { q: 'Số người tập gym tăng từ 200 lên 500.', hint: 'The number of people who go to the gym / gym members, rose / increased from 200 to 500', answers: ['The number of gym members rose from 200 to 500.', 'The number of gym members increased from 200 to 500.', 'The number of people who go to the gym rose from 200 to 500.', 'The number of people going to the gym rose from 200 to 500.', 'The number of people who went to the gym rose from 200 to 500.', 'The number of gym-goers rose from 200 to 500.', 'The number of people who go to the gym increased from 200 to 500.', 'The number of people going to the gym increased from 200 to 500.'] },
        { q: 'Nhìn chung, lượng tiêu thụ đường ở Nhật hầu như không đổi.', hint: 'Overall, sugar consumption in Japan, hardly changed / remained almost unchanged', answers: ['Overall, sugar consumption in Japan hardly changed.', 'Overall, sugar consumption in Japan remained almost unchanged.', 'Overall, sugar consumption in Japan remained almost the same.', 'Overall, sugar consumption in Japan stayed almost the same.', 'Overall, sugar consumption in Japan remained almost stable.', 'Overall sugar consumption in Japan hardly changed.'] },
        { q: 'Hút thuốc trong bệnh viện là bất hợp pháp.', hint: 'Smoking in hospitals, is illegal', answers: ['Smoking in hospitals is illegal.', 'It is illegal to smoke in hospitals.', "It's illegal to smoke in hospitals.", 'Smoking in hospital is illegal.', 'Smoking in a hospital is illegal.'] },
      ],
    },

    { t: 'h', text: 'Phần VI — Chọn cách chia thân bài (3 câu)' },
    {
      t: 'mcq',
      id: 't2d4-bt-chia-than',
      title: 'Phần VI — Chia thân bài thế nào? (3 câu)',
      items: [
        {
          q: 'Bar chart: chi tiêu của hộ gia đình cho 6 mục (food, housing, transport, education, health, other) năm 2000 và 2020. Food, housing, education tăng; transport, health giảm; Other gần như không đổi.',
          options: [
            'Body 1: năm 2000 · Body 2: năm 2020',
            'Body 1: ba mục tăng · Body 2: hai mục giảm, rồi một câu về Other ở cuối',
            'Sáu khổ, mỗi mục một khổ',
          ],
          correct: 1,
          why: 'Chỉ 2 mốc năm + 6 mục ⇒ gom theo **nhóm tăng / nhóm giảm**, "Other" tả **cuối**. A kể hai lần cùng sáu mục; C quá vụn, không gom nhóm.',
        },
        {
          q: 'Line graph: 4 loại phương tiện đi làm 1990–2020 — xe máy và xe buýt tăng, xe đạp và đi bộ giảm.',
          options: [
            'Body 1: xe máy + xe buýt (tăng) · Body 2: xe đạp + đi bộ (giảm)',
            'Body 1: 1990–2000 · Body 2: 2000–2020',
            'Body 1: xe máy · Body 2: ba loại còn lại',
          ],
          correct: 0,
          why: '4 hạng mục ⇒ **2 + 2 theo xu hướng**. B chia theo năm làm bài thành liệt kê; C lệch (một khổ quá ngắn, một khổ trộn cả tăng lẫn giảm).',
        },
        {
          q: 'Line graph: tỉ lệ người trên 65 tuổi ở 3 nước, 2000–2020, kèm số dự báo 2030 và 2040.',
          options: [
            'Chỉ tả 2030 và 2040 vì đó là phần mới',
            'Body 1: 2000–2020 (đã qua, quá khứ đơn) · Body 2: 2030–2040 (dự báo, is expected to)',
            'Body 1: năm 2000 · Body 2: năm 2040, bỏ qua các năm giữa',
          ],
          correct: 1,
          why: 'Đây là **ngoại lệ**: ranh giới số thật / số dự báo là mốc tự nhiên, mỗi khổ một nhóm thì. Trong mỗi khổ vẫn so ba nước. A bỏ mất nửa hình; C bỏ năm 2020 (mốc quan trọng nhất).',
        },
      ],
    },

    { t: 'h', text: 'Phần VII — "năm / nơi + saw + xu hướng" (3 câu)' },
    {
      t: 'quiz',
      id: 't2d4-bt-saw',
      title: 'Phần VII — Viết lại câu bắt đầu bằng thời gian / nơi chốn (3 câu)',
      kind: 'translate',
      grammar: 'S + rose sharply → [Năm / Giai đoạn / Nơi] + saw / witnessed + a sharp rise + in + N. Đổi trạng từ → tính từ (sharply → sharp). Không mở câu bằng chữ số: "2020 saw…" → "The year 2020 saw…".',
      items: [
        { q: 'Viết lại, bắt đầu bằng "The period between 2000 and 2020": "Sugar consumption in Vietnam rose sharply between 2000 and 2020."', hint: 'The period between 2000 and 2020 saw a sharp rise in…', answers: ['The period between 2000 and 2020 saw a sharp rise in sugar consumption in Vietnam.', 'The period between 2000 and 2020 witnessed a sharp rise in sugar consumption in Vietnam.', 'The period between 2000 and 2020 saw a sharp increase in sugar consumption in Vietnam.', 'The period between 2000 and 2020 witnessed a sharp increase in sugar consumption in Vietnam.'] },
        { q: 'Viết lại, bắt đầu bằng "The year 2020": "The number of cinema visitors fell dramatically in 2020."', hint: 'The year 2020 saw a dramatic fall / drop in…', answers: ['The year 2020 saw a dramatic fall in the number of cinema visitors.', 'The year 2020 saw a dramatic drop in the number of cinema visitors.', 'The year 2020 witnessed a dramatic fall in the number of cinema visitors.', 'The year 2020 witnessed a dramatic drop in the number of cinema visitors.', 'The year 2020 saw a dramatic decline in the number of cinema visitors.', 'The year 2020 saw a dramatic decrease in the number of cinema visitors.'] },
        { q: 'Viết lại, bắt đầu bằng "Hanoi": "Car ownership in Hanoi increased steadily over the decade."', hint: 'Hanoi saw / witnessed a steady increase in…', answers: ['Hanoi saw a steady increase in car ownership over the decade.', 'Hanoi witnessed a steady increase in car ownership over the decade.', 'Hanoi saw a steady rise in car ownership over the decade.', 'Hanoi witnessed a steady rise in car ownership over the decade.', 'Over the decade, Hanoi saw a steady increase in car ownership.'] },
      ],
    },

    { t: 'h', text: 'Phần VIII — Thì cho năm dự báo (4 câu)' },
    {
      t: 'p',
      text: 'Dựa vào hình tuổi già ở bài Viết (Japan 17 · 23 · 29 · 31* · 35*; Canada 13 · 14 · 18 · 23* · 25*; Vietnam 6 · 7 · 8 · 13* · 18*; * = dự báo). Điền dạng đúng của động từ trong ngoặc. Năm đã qua → quá khứ đơn; năm dự báo → khung "is … to".',
    },
    {
      t: 'quiz',
      id: 't2d4-bt-du-bao',
      title: 'Phần VIII — Điền dạng đúng (4 câu)',
      kind: 'fill',
      items: [
        { q: 'Between 2000 and 2020, the Canadian figure ___ (rise) from 13% to 18%.', answers: ['rose'] },
        { q: 'In 2020, the proportion in Vietnam ___ (stand) at 8%.', answers: ['stood'] },
        { q: 'By 2040, the figure for Japan ___ (project) to reach 35%. (bị động, hiện tại)', answers: ['is projected'] },
        { q: 'Vietnam is expected ___ (see) the fastest growth after 2020.', answers: ['to see'] },
      ],
    },

    { t: 'h', text: 'Phần IX — Viết: line graph có năm dự báo' },
    {
      t: 'figure',
      fig: {
        kind: 'line',
        title: 'International students at universities in one city (thousands), 2005–2035 (* = projection)',
        note: 'Số liệu tự đặt cho bài luyện. 2030 và 2035 là số dự báo.',
        unit: 'thousands',
        categories: ['2005', '2010', '2015', '2020', '2025', '2030*', '2035*'],
        series: [
          { name: 'From Asia', values: [12, 18, 25, 20, 30, 38, 45] },
          { name: 'From Europe', values: [10, 11, 12, 9, 11, 12, 13] },
          { name: 'From other regions', values: [3, 4, 4, 3, 5, 7, 10] },
        ],
      },
    },
    {
      t: 'essay',
      id: 't2d4-bt-viet-du-bao',
      task: 'Task 1',
      prompt: 'The line graph above shows the number of international students at universities in one city, by region of origin, between 2005 and 2025, with projections for 2030 and 2035. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data, thousands — From Asia: 2005 12, 2010 18, 2015 25, 2020 20, 2025 30, 2030* 38, 2035* 45 · From Europe: 10, 11, 12, 9, 11, 12*, 13* · From other regions: 3, 4, 4, 3, 5, 7*, 10* · * = projection)',
      minWords: 150,
      tips: [
        'Mở bài: shows the number of → **compares how many**; between 2005 and 2025 → **over a twenty-year period**; nhớ thêm **with projections for 2030 and 2035**.',
        'Overview bao **cả hai phần**: cả ba nhóm nhìn chung tăng và **được dự đoán tiếp tục tăng**; sinh viên châu Á **luôn đông nhất** và khoảng cách ngày càng lớn.',
        'Thân 1 = **2005–2025** (quá khứ đơn): châu Á 12 → đỉnh 25 (2015) → giảm còn 20 (2020) → 30; châu Âu dao động quanh 10–12; nhóm khác 3–5. Đường châu Á có 3 chặng — đừng tả từng năm.',
        'Thân 2 = **2030*–2035*** (dự báo): **is expected / projected / predicted to**, **is likely to** — luân phiên, không lặp will. Số đơn vị nghìn → **45,000 students** hoặc **45 thousand**, không ~~45 thousands~~.',
        'Soát: không viết số dự báo bằng quá khứ; overview không có số.',
      ],
    },
  ],
};

export const NGAY_4: Lesson[] = [T2D4_VOCAB, T2D4_READING, T2D4_WRITING, T2D4_HOMEWORK];
