/**
 * IELTS Tập 2 · Ngày 3 — Giới từ thời gian / nơi chốn / chuyển động + giới từ phụ thuộc [G11]
 * · Listening: số, ngày, giá, địa chỉ nâng cao — đặt phòng, hỏi đường [L01 E02] (`canh` + `dialogue`)
 * · Speaking: Part 2 lần đầu — Describe a person (cue card, 1 phút ghi chú) [S05] + gọi điện đặt lịch [S16]
 * 🔊 /θ/ /ð/ trong câu [S11] · Bài tập (34 câu).
 *
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N3. Tập 1 Ngày 11 mới nhập in / on / at; hôm nay dạy
 * trọn hệ thống (vòng 1 của G11). Kịch bản nghe, bài nói mẫu, câu bài tập tự soạn.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D3_GRAMMAR: Lesson = {
  id: 't2d3-ngu-phap',
  kind: 'grammar',
  title: 'Giới từ thời gian, nơi chốn, chuyển động + giới từ phụ thuộc',
  goal: 'Chọn đúng giới từ chỉ thời gian (at / on / in, for / during / by / until), nơi chốn (in / on / at + vị trí), chuyển động (into, through, across, along, past…) và 30 cụm giới từ đi kèm động từ – tính từ – danh từ hay gặp nhất trong IELTS (depend on, interested in, an increase in…).',
  minutes: 80,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **GRA** và **LR** (Writing + Speaking) lên band 5: giới từ sai là lỗi "nhỏ mà dày" — một bài Task 2 band 4 thường có 4–6 lỗi giới từ.',
        'Đẩy **Listening**: Part 1–2 có địa chỉ (**at** 25 Mill Road, **on** the second floor) và chỉ đường (**past** the bank, **across** the bridge) — hiểu sai giới từ là đi sai đường trên bản đồ.',
        '**Thời gian**: ==at + giờ · on + ngày · in + tháng / năm / mùa==; không giới từ trước **this / next / last / every**.',
        '**Nơi chốn**: ==in = bên trong · on = trên bề mặt / trên đường phố · at = một điểm, một địa chỉ==.',
        '**Giới từ phụ thuộc** (dependent prepositions): phải **học thuộc theo cụm**: depend **on**, interested **in**, an increase **in** — không suy luận được từ tiếng Việt.',
        'Tập 1 Ngày 11 đã nhập in / on / at; hôm nay là **bản đầy đủ** + bài dịch 💡 từng mục.',
      ],
    },
    {
      t: 'p',
      text: '**Giới từ** (preposition) là từ nhỏ đứng trước danh từ / cụm danh từ để chỉ **thời gian, vị trí, hướng, quan hệ**: **in** the morning, **on** the table, **through** the park, interested **in** music. Tiếng Việt cũng có giới từ (ở, trong, trên, vào, qua…) nhưng **không khớp một–một**: "vào thứ Hai" = **on** Monday, "vào tháng Năm" = **in** May, "vào lúc 7 giờ" = **at** 7. Vì vậy cách học duy nhất là học theo **nhóm quy tắc** + **cụm cố định**.',
    },

    { t: 'h', text: '1. Giới từ thời gian: at · on · in' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Kim tự tháp thời gian — từ nhỏ đến lớn',
      steps: [
        { label: '**at** — điểm thời gian', sub: 'at 7 o’clock · at noon · at midnight · at night · at the weekend (Anh) · at Christmas · at the moment' },
        { label: '**on** — ngày', sub: 'on Monday · on 2 September · on my birthday · on Monday morning · on New Year’s Day · on weekdays' },
        { label: '**in** — khoảng dài', sub: 'in May · in 2025 · in summer · in the 1990s · in the 21st century · in the morning / afternoon / evening' },
      ],
      caption: 'Càng đi xuống, khoảng thời gian càng lớn. Ngoại lệ dễ nhớ: in the morning NHƯNG on Monday morning (có ngày cụ thể → on); in the night (hiếm) NHƯNG at night.',
    },
    {
      t: 'table',
      caption: 'Những chỗ KHÔNG dùng giới từ',
      head: ['Trước từ', 'Ví dụ đúng', 'Sai hay gặp'],
      rows: [
        ['**this / next / last / every**', 'I met her **last** Sunday. · See you **next** week. · We play **every** Friday.', '~~on last Sunday~~ · ~~in next week~~'],
        ['**today / tomorrow / yesterday / tonight**', 'I am busy **tomorrow**.', '~~in tomorrow~~ · ~~at tonight~~'],
        ['**ago**', 'He moved here three years **ago**.', '~~before three years~~ (dịch "cách đây")'],
      ],
    },
    {
      t: 'table',
      caption: 'Các giới từ thời gian khác — hay gặp trong Listening và Task 1',
      head: ['Giới từ', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['**for** + khoảng thời gian', 'trong (bao lâu)', 'I studied there **for** three years.'],
        ['**during** + danh từ (sự kiện / giai đoạn)', 'trong suốt (lúc diễn ra việc gì)', 'Please switch off your phone **during** the test.'],
        ['**by** + mốc', 'trước hoặc đúng lúc (hạn chót)', 'Send me the form **by** Friday.'],
        ['**until / till** + mốc', 'cho đến khi (việc kéo dài tới lúc đó)', 'The shop is open **until** 9 p.m.'],
        ['**from … to / until …**', 'từ … đến …', 'Classes run **from** Monday **to** Thursday.'],
        ['**between … and …**', 'giữa (hai mốc)', 'Sales rose **between** 2010 **and** 2015. (Task 1)'],
        ['**within** + khoảng', 'trong vòng (không quá)', 'You will get a reply **within** 24 hours.'],
        ['**in** + khoảng (tương lai)', 'sau (bao lâu nữa) kể từ bây giờ', 'The bus will leave **in** ten minutes.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**by** ≠ **until**: "Nộp bài **trước thứ Sáu**" → hand it in **by** Friday (một hành động, hạn chót). "Ở đây **đến thứ Sáu**" → stay here **until** Friday (kéo dài).',
        '**for** ≠ **during**: **for** trả lời "bao lâu?" (for two hours); **during** trả lời "khi nào?" (during the meeting). ~~during two hours~~ là sai.',
        '**in ten minutes** = **mười phút nữa** (không phải "trong vòng mười phút" — đó là **within** ten minutes).',
        'Ngày tháng: **on** 21 March (Anh: on the twenty-first of March) — ~~in 21 March~~.',
      ],
    },
    {
      t: 'rule',
      formula: 'at + giờ / night / the weekend · on + ngày / thứ / ngày tháng · in + tháng / năm / mùa / the morning · Ø + this / next / last / every',
      vi: 'for = bao lâu · during = trong lúc (sự kiện) · by = hạn chót · until = kéo dài tới.',
    },
    {
      t: 'quiz',
      id: 't2d3-thoi-gian-dich',
      title: 'Dịch nhanh — giới từ thời gian (5 câu)',
      kind: 'translate',
      grammar: 'at + giờ · on + ngày / thứ · in + tháng / năm · Ø + next / last · by (hạn chót) · for (bao lâu) · during (trong lúc).',
      items: [
        { q: 'Lớp học bắt đầu lúc 7 giờ tối thứ Hai.', hint: 'The class, starts, at 7 p.m., on Monday', answers: ['The class starts at 7 p.m. on Monday.', 'The class starts at 7 pm on Monday.', 'The class starts at 7 on Monday evening.', 'The class starts at seven on Monday evening.', 'The class starts at 7 p.m. on Mondays.', 'The lesson starts at 7 p.m. on Monday.', 'The class begins at 7 p.m. on Monday.', 'The class starts at 7pm on Monday.'] },
        { q: 'Tôi sinh vào mùa hè năm 2005.', hint: 'was born, in the summer of 2005 / in summer 2005', answers: ['I was born in the summer of 2005.', 'I was born in summer 2005.'] },
        { q: 'Vui lòng nộp mẫu đơn trước thứ Sáu.', hint: 'Please, send / submit / hand in, the form, by Friday', answers: ['Please send the form by Friday.', 'Please submit the form by Friday.', 'Please hand in the form by Friday.', 'Please send the form before Friday.', 'Please submit the form before Friday.', 'Please return the form by Friday.'] },
        { q: 'Tôi đã sống ở Đà Nẵng ba năm.', hint: 'lived, in Da Nang, for three years', answers: ['I lived in Da Nang for three years.', 'I have lived in Da Nang for three years.', "I've lived in Da Nang for three years.", 'I lived in Danang for three years.', 'I have lived in Danang for three years.'] },
        { q: 'Tuần sau chúng tôi sẽ đi Huế.', hint: 'next week (không giới từ), will go / are going to Hue', answers: ['We will go to Hue next week.', "We'll go to Hue next week.", 'We are going to Hue next week.', "We're going to Hue next week.", 'Next week we will go to Hue.', 'Next week, we are going to Hue.', 'Next week we are going to Hue.', 'We are going to go to Hue next week.'] },
      ],
    },

    { t: 'h', text: '2. Giới từ nơi chốn: in · on · at và giới từ vị trí' },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'in · on · at chỉ nơi chốn',
      cols: [
        { title: '**in** — bên trong (3 chiều / vùng)', anh: 'house', items: ['in the room · in a box · in the car', 'in Hanoi · in Vietnam · in Asia', 'in the park · in the garden', 'in the newspaper · in a photo · in the queue'] },
        { title: '**on** — trên bề mặt / trên tuyến', anh: 'bus', items: ['on the table · on the wall · on the floor', 'on Tran Phu Street (đường không số nhà)', 'on the second floor · on the left / right', 'on the bus / train / plane · on the internet · on the coast'] },
        { title: '**at** — một điểm', anh: 'round-pushpin', items: ['at 25 Hang Bai Street (có số nhà)', 'at the station · at the bus stop · at the door', 'at home · at work · at school · at university', 'at the cinema · at a party · at the end of the road'] },
      ],
      caption: 'Cùng một nơi có thể dùng khác nhau theo ý: I am **in** the cinema (bên trong toà nhà) · I am **at** the cinema (đang đi xem phim, ở điểm đó).',
    },
    {
      t: 'table',
      caption: 'Giới từ vị trí khác (hay gặp trong Map Labelling)',
      head: ['Giới từ', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['next to / beside', 'ngay cạnh', 'The café is **next to** the bank.'],
        ['opposite', 'đối diện', 'The library is **opposite** the post office.'],
        ['between A and B', 'giữa A và B', 'The toilets are **between** the shop and the lift.'],
        ['in front of / behind', 'phía trước / phía sau', 'There is a car park **behind** the hotel.'],
        ['above / below', 'cao hơn / thấp hơn (không chạm)', 'My flat is **above** a pharmacy.'],
        ['over / under', 'ngay trên (phủ) / ngay dưới', 'There is a bridge **over** the river. · The cat is **under** the bed.'],
        ['near / close to', 'gần', 'We live **near** the airport.'],
        ['inside / outside', 'bên trong / bên ngoài', 'Please wait **outside** the room.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**Địa chỉ**: có **số nhà** → **at** 25 Hang Bai Street; chỉ tên đường → **on** Hang Bai Street (Anh cũng nói **in** … Street); thành phố → **in** Hanoi. ~~at Hanoi~~ là sai.',
        '**Tầng**: **on** the fifth floor — ~~at the fifth floor~~, ~~in the fifth floor~~.',
        '**Phương tiện**: **on** the bus / train / plane (lên được, đứng được) nhưng **in** a car / taxi (ngồi bên trong, cúi vào).',
        '**at home** (Ø) — ~~at the home~~, ~~in home~~. **at university** = đang học đại học; **at the university** = ở khuôn viên trường cụ thể.',
      ],
    },
    {
      t: 'rule',
      formula: 'in + thành phố / nước / phòng · on + đường / tầng / bề mặt / bus, train · at + số nhà / điểm (station, home, work)',
      vi: 'Tự hỏi: không gian bao quanh (in), bề mặt hay tuyến (on), hay một điểm trên bản đồ (at)?',
    },
    {
      t: 'quiz',
      id: 't2d3-noi-chon-dich',
      title: 'Dịch nhanh — nơi chốn (5 câu)',
      kind: 'translate',
      grammar: 'at + số nhà / điểm · on + đường / tầng · in + thành phố · next to / opposite / between.',
      items: [
        { q: 'Tôi sống ở số 12 đường Lê Lợi.', hint: 'live, at 12 Le Loi Street', answers: ['I live at 12 Le Loi Street.', 'I live at number 12 Le Loi Street.', 'I live at No. 12 Le Loi Street.'] },
        { q: 'Văn phòng của chúng tôi ở tầng ba.', hint: 'Our office, is, on the third floor', answers: ['Our office is on the third floor.', 'Our office is located on the third floor.'] },
        { q: 'Hiệu thuốc ở đối diện ngân hàng.', hint: 'The pharmacy, is opposite, the bank', answers: ['The pharmacy is opposite the bank.', "The chemist's is opposite the bank.", 'The pharmacy is across from the bank.', 'The drugstore is opposite the bank.'] },
        { q: 'Tôi đọc tin đó trên mạng.', hint: 'read the news, on the internet / online', answers: ['I read the news on the internet.', 'I read the news online.', 'I read that news on the internet.', 'I read that news online.', 'I read about it on the internet.', 'I read about it online.', 'I read the news on the Internet.'] },
        { q: 'Có một bãi đỗ xe phía sau khách sạn.', hint: 'There is, a car park, behind the hotel', answers: ['There is a car park behind the hotel.', "There's a car park behind the hotel.", 'There is a parking lot behind the hotel.', "There's a parking lot behind the hotel."] },
      ],
    },

    { t: 'h', text: '3. Giới từ chuyển động' },
    {
      t: 'p',
      text: 'Giới từ chuyển động trả lời câu hỏi "**đi về đâu / đi qua đâu?**", luôn đi với động từ chuyển động: go, walk, drive, run, come, cross… Đây là ngôn ngữ của **chỉ đường** (Listening Part 2 bản đồ, Ngày 7) và **Task 1 bản đồ** (Ngày 22).',
    },
    {
      t: 'table',
      head: ['Giới từ', 'Hình dung', 'Ví dụ'],
      rows: [
        ['**to**', 'đi tới một đích', 'I walk **to** school.'],
        ['**into / out of**', 'đi vào trong / ra khỏi', 'She ran **into** the room. · Get **out of** the car.'],
        ['**onto / off**', 'lên trên bề mặt / rời khỏi', 'The cat jumped **onto** the table. · Get **off** the bus at the next stop.'],
        ['**through**', 'xuyên qua (bên trong một không gian)', 'Walk **through** the park.'],
        ['**across**', 'băng qua (từ bên này sang bên kia một bề mặt)', 'Go **across** the bridge / the road.'],
        ['**along**', 'dọc theo', 'Walk **along** the river for 200 metres.'],
        ['**past**', 'đi ngang qua (không dừng)', 'Go **past** the cinema.'],
        ['**towards**', 'về phía (chưa tới)', 'Head **towards** the station.'],
        ['**up / down**', 'lên / xuống (dốc, cầu thang, phố)', 'Walk **up** the hill. · Go **down** this street.'],
        ['**round / around**', 'vòng quanh', 'Drive **round** the roundabout.'],
        ['**over**', 'vượt qua phía trên', 'The plane flew **over** the mountains.'],
      ],
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Một lời chỉ đường = chuỗi giới từ chuyển động',
      steps: [
        { label: 'Go **out of** the hotel', sub: 'ra khỏi khách sạn' },
        { label: 'walk **along** the seafront', sub: 'đi dọc bờ biển' },
        { label: 'go **past** the clock tower', sub: 'đi ngang qua tháp đồng hồ' },
        { label: 'go **across** the bridge', sub: 'qua cầu' },
        { label: 'the museum is **on your left**, **opposite** the post office', sub: 'đích đến — giới từ vị trí' },
      ],
      caption: 'Nghe chỉ đường: mỗi giới từ là một bước. Ghi nhanh bằng mũi tên: → along · ⤳ past · ⟂ across.',
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '**arrive at** + điểm nhỏ (station, airport, hotel) · **arrive in** + thành phố / nước — **không bao giờ** ~~arrive to~~.',
        '**go home** · **come home** (không to): ~~go to home~~.',
        '**enter** không đi với giới từ: ~~enter into the room~~ → **enter the room** / **go into the room**.',
        '**across** (bề mặt phẳng: road, bridge, field) ≠ **through** (có "bên trong": forest, tunnel, park có cây, crowd).',
      ],
    },
    {
      t: 'rule',
      formula: 'V chuyển động + to / into / out of / through / across / along / past / towards / up / down',
      vi: 'arrive at (điểm) / in (thành phố) · go home (không to) · enter + N (không giới từ).',
    },
    {
      t: 'quiz',
      id: 't2d3-chuyen-dong-dich',
      title: 'Dịch nhanh — chuyển động (4 câu)',
      kind: 'translate',
      grammar: 'walk along / past / across / through · arrive at / in · go home.',
      items: [
        { q: 'Đi dọc bờ sông khoảng 200 mét.', hint: 'Walk along the river, for about 200 metres', answers: ['Walk along the river for about 200 metres.', 'Walk along the river for about 200 meters.', 'Go along the river for about 200 metres.', 'Walk along the river for around 200 metres.', 'Walk about 200 metres along the river.'] },
        { q: 'Băng qua cầu rồi rẽ trái.', hint: 'Go / Walk across the bridge, then turn left', answers: ['Go across the bridge and then turn left.', 'Go across the bridge, then turn left.', 'Walk across the bridge and then turn left.', 'Walk across the bridge, then turn left.', 'Cross the bridge and then turn left.', 'Cross the bridge, then turn left.', 'Go across the bridge and turn left.', 'Cross the bridge and turn left.'] },
        { q: 'Chúng tôi đến sân bay lúc nửa đêm.', hint: 'arrived at the airport, at midnight', answers: ['We arrived at the airport at midnight.', 'We got to the airport at midnight.', 'We reached the airport at midnight.'] },
        { q: 'Tôi về nhà muộn tối qua.', hint: 'went / came home (không to), late, last night', answers: ['I went home late last night.', 'I came home late last night.', 'I got home late last night.', 'Last night I went home late.', 'Last night I came home late.', 'Last night I got home late.'] },
      ],
    },

    { t: 'h', text: '4. Giới từ phụ thuộc — 30 cụm phải thuộc' },
    {
      t: 'p',
      text: '**Giới từ phụ thuộc** (dependent prepositions) là giới từ "dính" vào một động từ, tính từ hoặc danh từ nhất định. Không có quy tắc — chỉ có **thuộc theo cụm**. Học kèm một câu ví dụ, và khi viết thì **viết cả cụm**.',
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: '30 cụm giới từ phụ thuộc hay gặp nhất trong IELTS',
      center: 'Giới từ phụ thuộc',
      branches: [
        { label: 'Động từ + giới từ', items: ['depend on · rely on · focus on', 'listen to · belong to · contribute to', 'wait for · pay for · apply for', 'agree with · deal with', 'suffer from · benefit from'], anh: 'writing-hand' },
        { label: 'Tính từ + giới từ', items: ['interested in · good at · bad at', 'afraid of · aware of · proud of', 'responsible for · famous for', 'similar to · different from', 'worried about · keen on'], anh: 'thinking-face' },
        { label: 'Danh từ + giới từ', items: ['an increase / a decrease in', 'an impact / effect on', 'a reason for · demand for', 'a solution to · access to', 'an advantage of'], anh: 'chart-increasing' },
      ],
      caption: 'Sau giới từ, động từ phải ở dạng V-ing: interested in **learning**, responsible for **protecting**, the reason for **leaving** (Ngày 11 học kỹ).',
    },
    {
      t: 'table',
      caption: 'Cụm danh từ + giới từ trong Writing Task 1 — đừng nhầm in / by / to',
      head: ['Cụm', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['an **increase / a rise / a fall in** + cái gì', 'sự tăng / giảm **của cái gì**', 'There was a sharp **increase in** car sales.'],
        ['increase / rise / fall **by** + lượng', 'tăng / giảm **thêm** bao nhiêu', 'Car sales **rose by** 20 %.'],
        ['increase / rise / fall **to** + mức', 'tăng / giảm **tới** mức', 'Car sales **rose to** 5 million.'],
        ['**from** X **to** Y', 'từ mức X lên / xuống mức Y', 'Sales fell **from** 40 % **to** 25 %.'],
        ['an increase **of** + lượng', 'mức tăng là bao nhiêu', 'an increase **of** 20 %'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~depend in~~ / ~~depend of~~ → **depend on** ("phụ thuộc **vào**" — dịch "vào" thành in là sai).',
        '~~discuss about~~ → **discuss** sth (không giới từ). Nhưng **a discussion about** sth (danh từ có about).',
        '~~married with~~ → **married to** sb. ~~different with~~ → **different from**.',
        '~~the impact to~~ → **the impact on**. ~~the reason of~~ → **the reason for**. ~~the solution for~~ → **the solution to**.',
        'Sau giới từ dùng V-ing: ~~interested in learn~~ → interested in **learning**.',
      ],
    },
    {
      t: 'rule',
      formula: 'depend on · interested in · responsible for · different from · an increase in · rise by + lượng · rise to + mức · the impact on · the reason for · a solution to',
      vi: 'Học theo cụm, viết cả cụm; sau giới từ là danh từ hoặc V-ing.',
    },
    {
      t: 'quiz',
      id: 't2d3-phu-thuoc-dich',
      title: 'Dịch nhanh — giới từ phụ thuộc (5 câu)',
      kind: 'translate',
      grammar: 'V / adj / N + giới từ cố định; sau giới từ dùng N hoặc V-ing.',
      items: [
        { q: 'Kết quả phụ thuộc vào thời tiết.', hint: 'The result, depends on, the weather', answers: ['The result depends on the weather.', 'The results depend on the weather.', 'The outcome depends on the weather.', 'It depends on the weather.'] },
        { q: 'Tôi rất quan tâm đến việc học tiếng Anh.', hint: 'am very interested in, learning English', answers: ['I am very interested in learning English.', "I'm very interested in learning English.", 'I am really interested in learning English.', "I'm really interested in learning English."] },
        { q: 'Mạng xã hội có tác động lớn đến người trẻ.', hint: 'Social media, has, a big / great impact on, young people', answers: ['Social media has a big impact on young people.', 'Social media has a great impact on young people.', 'Social media has a huge impact on young people.', 'Social media has a major impact on young people.', 'Social media has a significant impact on young people.', 'Social media has a strong impact on young people.', 'Social media has a big effect on young people.', 'Social media has a great effect on young people.', 'Social media have a big impact on young people.'] },
        { q: 'Số lượng khách du lịch tăng thêm 15%.', hint: 'The number of tourists, rose / increased, by 15%', answers: ['The number of tourists rose by 15%.', 'The number of tourists increased by 15%.', 'The number of tourists rose by 15 per cent.', 'The number of tourists increased by 15 per cent.', 'The number of tourists grew by 15%.', 'The number of tourists rose by 15 percent.', 'The number of tourists increased by 15 percent.', 'The number of tourists went up by 15%.'] },
        { q: 'Ai chịu trách nhiệm bảo vệ môi trường?', hint: 'Who, is responsible for, protecting the environment', answers: ['Who is responsible for protecting the environment?', "Who's responsible for protecting the environment?", 'Who should be responsible for protecting the environment?'] },
      ],
    },
    {
      t: 'mcq',
      id: 't2d3-tong-hop-chon',
      title: 'Kiểm tra cuối bài — chọn giới từ đúng (10 câu)',
      items: [
        { q: 'The museum is closed ___ Mondays.', options: ['in', 'on', 'at'], correct: 1, why: 'Ngày trong tuần → **on** Mondays.' },
        { q: 'I usually feel tired ___ the afternoon.', options: ['in', 'at', 'on'], correct: 0, why: 'Buổi trong ngày → **in** the afternoon (nhưng **at** night).' },
        { q: 'Please finish the report ___ 5 p.m. — the manager needs it tonight.', options: ['until', 'by', 'during'], correct: 1, why: '**by** = hạn chót (một hành động xong trước hoặc đúng lúc đó).' },
        { q: 'My aunt lives ___ 48 Quang Trung Street.', options: ['on', 'in', 'at'], correct: 2, why: 'Địa chỉ **có số nhà** → **at**.' },
        { q: 'We arrived ___ Bangkok late at night.', options: ['to', 'in', 'at'], correct: 1, why: '**arrive in** + thành phố / nước. Không bao giờ ~~arrive to~~.' },
        { q: 'The children ran ___ the field to the river.', options: ['across', 'along', 'onto'], correct: 0, why: 'Băng **từ bên này sang bên kia** một bề mặt (field) → **across**.' },
        { q: 'There was a significant fall ___ the number of smokers.', options: ['of', 'by', 'in'], correct: 2, why: '**a fall in** + cái gì giảm. (fall **by** + lượng: fell **by** 10 %.)' },
        { q: 'Vietnam is famous ___ its street food.', options: ['for', 'of', 'with'], correct: 0, why: '**famous for** sth.' },
        { q: 'My phone rang twice ___ the interview.', options: ['for', 'during', 'while'], correct: 1, why: '**during** + danh từ (sự kiện). **for** + khoảng thời gian; **while** + mệnh đề (while I was waiting).' },
        { q: 'This phone is very different ___ my old one.', options: ['with', 'of', 'from'], correct: 2, why: '**different from** (chuẩn nhất; Mỹ còn nói different than, Anh còn nói different to). ~~different with~~ là dịch từ tiếng Việt "khác với".' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Listening ─────────────────────────── */

const T2D3_SCRIPT_HOTEL: { who: string; voice: 'uk-nam' | 'us-nu'; text: string }[] = [
  { who: 'Receptionist', voice: 'uk-nam', text: 'Good afternoon, Seaview Hotel, Tom speaking. How can I help?' },
  { who: 'Anna', voice: 'us-nu', text: "Hi, I'd like to book a room for this summer, please." },
  { who: 'Receptionist', voice: 'uk-nam', text: "Certainly. Could I have your name, please?" },
  { who: 'Anna', voice: 'us-nu', text: "It's Anna Brennan. That's B, R, E, double N, A, N." },
  { who: 'Receptionist', voice: 'uk-nam', text: 'Thank you, Ms Brennan. And when would you like to arrive?' },
  { who: 'Anna', voice: 'us-nu', text: "I was planning to arrive on the fifteenth of July, but my flight has changed, so it'll be the sixteenth now." },
  { who: 'Receptionist', voice: 'uk-nam', text: 'The sixteenth of July. And how many nights?' },
  { who: 'Anna', voice: 'us-nu', text: 'Three nights, please. I leave on the morning of the nineteenth.' },
  { who: 'Receptionist', voice: 'uk-nam', text: 'Right. What kind of room are you looking for? We have single, twin and double rooms.' },
  { who: 'Anna', voice: 'us-nu', text: "I'm travelling with my husband, so a double, please. And if possible, one with a sea view." },
  { who: 'Receptionist', voice: 'uk-nam', text: "Let me check… yes, we have a double with a sea view on the third floor. That's ninety-five pounds a night. Oh, actually, sorry — for stays of three nights or more there's a summer offer, so it's eighty-nine pounds fifty a night, and that includes breakfast." },
  { who: 'Anna', voice: 'us-nu', text: "Great, that's even better." },
  { who: 'Receptionist', voice: 'uk-nam', text: 'Can I have an email address to send the confirmation to?' },
  { who: 'Anna', voice: 'us-nu', text: "Sure. It's A, double N, A, B, seven seven, all one word, at fastmail dot com." },
  { who: 'Receptionist', voice: 'uk-nam', text: 'And your home postcode, please?' },
  { who: 'Anna', voice: 'us-nu', text: "We're in England at the moment, so it's B, H, one two, four, Q, T." },
  { who: 'Receptionist', voice: 'uk-nam', text: 'BH12 4QT. Lovely. Is there anything else we can do for you?' },
  { who: 'Anna', voice: 'us-nu', text: "Yes, we're renting a car. Is there anywhere to park?" },
  { who: 'Receptionist', voice: 'uk-nam', text: "We have a small car park behind the hotel, but it fills up quickly in July, so I'll reserve a parking space for you now. There's no extra charge." },
  { who: 'Anna', voice: 'us-nu', text: "Perfect. Thank you so much." },
];

const T2D3_SCRIPT_DIRECTIONS: { who: string; voice: 'uk-nam' | 'us-nu'; text: string }[] = [
  { who: 'Anna', voice: 'us-nu', text: "Excuse me, could you tell me how to get to the Maritime Museum from here?" },
  { who: 'Receptionist', voice: 'uk-nam', text: "Of course. When you go out of the hotel, turn right and walk along the seafront. Don't take the road behind the hotel, it's much longer." },
  { who: 'Anna', voice: 'us-nu', text: 'OK, along the seafront.' },
  { who: 'Receptionist', voice: 'uk-nam', text: "Keep going until you see the pier on your right. Go past the pier, and at the clock tower, turn left into Harbour Street." },
  { who: 'Anna', voice: 'us-nu', text: 'Left at the clock tower. Got it.' },
  { who: 'Receptionist', voice: 'uk-nam', text: "Walk up Harbour Street. You'll go across a small bridge, and the museum is just after that, on your left. It's opposite the post office, a big red building, so you can't miss it." },
  { who: 'Anna', voice: 'us-nu', text: 'How long does it take on foot?' },
  { who: 'Receptionist', voice: 'uk-nam', text: "Usually about ten minutes, but it's quite windy today, so give yourself fifteen." },
];

const T2D3_LISTENING: Lesson = {
  id: 't2d3-nghe',
  kind: 'listening',
  title: 'Nghe số, ngày, giá, địa chỉ nâng cao — đặt phòng, hỏi đường',
  goal: 'Nghe và ghi đúng số lớn, số thập phân, giá tiền, ngày tháng, mã bưu điện, địa chỉ email khi người nói đọc nhanh và có sửa lời; làm được bài Part 1 đặt phòng khách sạn (8 câu) và bài chỉ đường (4 câu); tự hỏi đường, đặt phòng bằng tiếng Anh.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Listening** Part 1–2 lên band 5: **mỗi đề** có 3–6 câu đáp án là **số, ngày, giá, mã, email**. Sai một chữ số = mất trọn câu. Đây là vòng 2 của Tập 1 Ngày 1 (bảng chữ cái, đánh vần).',
        'Mới hôm nay: số **lớn** (1,250 · 2.5 million), **thập phân**, **phân số / phần trăm**, **email** (dot, at, underscore, all one word), **mã bưu điện** chữ + số.',
        'Tiếng Anh đời sống: **đặt phòng** khách sạn và **hỏi đường** — câu mẫu dùng được ngay khi đi du lịch, cũng là bối cảnh quen thuộc của Part 1.',
        'Hai bài nghe có **giọng Mỹ** (khách) và **giọng Anh** (lễ tân); bẫy: ngày bị đổi, giá được giảm, đường không nên đi, thời gian đi bộ "thật".',
        'Nối Ngữ pháp Ngày 3: giới từ chỉ đường **along, past, across, opposite, on your left**.',
      ],
    },

    { t: 'h', text: '1. Nghe số và ký hiệu — bảng tổng hợp' },
    {
      t: 'table',
      head: ['Loại', 'Người nói đọc', 'Bạn viết'],
      rows: [
        ['Số lớn', 'one thousand two hundred and fifty · two point five million', '1,250 · 2.5 million'],
        ['Số đọc theo “trăm”', 'twelve hundred · fifteen hundred pounds · eighteen hundred metres', '1,200 · £1,500 · 1,800 m (twelve hundred = one thousand two hundred)'],
        ['Số thập phân', 'three point seven five', '3.75'],
        ['Phần trăm / phân số', 'fifteen per cent · a quarter · two thirds · half', '15% · 1/4 (25%) · 2/3 · 1/2'],
        ['Giá (Anh)', 'eighty-nine pounds fifty · twelve ninety-nine', '£89.50 · £12.99'],
        ['Giá (Mỹ)', 'nineteen dollars and ninety-five cents', '$19.95'],
        ['Ngày tháng', 'the sixteenth of July (Anh) · July sixteenth (Mỹ)', '16 July · July 16'],
        ['Năm', 'twenty twenty-five · nineteen ninety-eight · two thousand and five', '2025 · 1998 · 2005'],
        ['Giờ', 'a quarter to seven · half past eight · six forty-five', '6.45 · 8.30 · 6.45'],
        ['Số điện thoại', 'oh seven seven, double four, triple nine', '077 44 999'],
        ['Email', 'anna underscore b at fastmail dot com · all one word · hyphen · capital A', 'anna_b@fastmail.com · (viết liền) · - · A'],
        ['Mã bưu điện (Anh)', 'B, H, one two, four, Q, T', 'BH12 4QT'],
      ],
    },
    {
      t: 'note',
      title: 'Bẫy hay gặp khi nghe số',
      items: [
        '**-teen / -ty**: fif**TEEN** (nhấn sau, /t/ rõ) ≠ **FIF**ty (nhấn trước). Mỹ đọc /t/ trong -ty gần như "đ": "fifdy".',
        '**Sửa lời**: "It’s ninety-five… **actually, sorry**, eighty-nine fifty" → lấy số sau.',
        '**Số đếm vs số thứ tự**: the six**teenth** of July → viết **16** (hoặc 16th), không viết ~~60~~.',
        '**at** trong email: người nói đọc "at" → bạn viết **@**. "dot" → **.** · "dash / hyphen" → **-** · "underscore" → **_**.',
        '**Ký hiệu tiền đã in sẵn trên phiếu** (“£ ___”, “Cost: $ ___”) → chỉ ghi **số**: ghi “£1,500” vào ô đã có “£” là thừa ký hiệu. Ô không có ký hiệu thì ghi kèm £ / $ hoặc chữ pounds / dollars cho rõ. Dấu phẩy nghìn (1,500) viết hay không đều được chấm đúng.',
      ],
    },
    {
      t: 'dictation',
      id: 't2d3-nghe-so',
      title: 'Nghe và viết đúng (10 mục)',
      items: [
        { label: 'Giá — dạng £00.00', spell: 'The room costs eighty-nine pounds fifty a night.', answer: '£89.50', alt: ['89.50', '£89.5'] },
        { label: 'Số lớn — dạng 0,000', spell: 'The stadium holds twelve thousand four hundred people.', answer: '12,400', alt: ['12400', '12 400'] },
        { label: 'Thập phân', spell: 'The average was three point seven five.', answer: '3.75' },
        { label: 'Phần trăm', spell: 'Sales fell by fifteen per cent.', answer: '15%', alt: ['15 %', '15 per cent', '15 percent'] },
        { label: 'Ngày — dạng 16 July', spell: 'We arrive on the sixteenth of July.', answer: '16 July', alt: ['16th July', 'July 16', 'July 16th', '16 Jul'] },
        { label: 'Năm', spell: 'The bridge opened in nineteen ninety-eight.', answer: '1998' },
        { label: 'Giờ — dạng 0.00', spell: 'The tour starts at a quarter to seven.', answer: '6.45', alt: ['6:45', '06.45', '06:45'] },
        { label: 'Email', spell: 'My email is tran underscore minh at mailbox dot com.', answer: 'tran_minh@mailbox.com' },
        { label: 'Mã bưu điện — có một dấu cách', spell: 'The postcode is E, C, one A, four, J, J.', answer: 'EC1A 4JJ', alt: ['EC1A4JJ'] },
        { label: 'Số tiền (Mỹ) — dạng $00.00', spell: 'The ticket is nineteen dollars and ninety-five cents.', answer: '$19.95', alt: ['19.95'] },
      ],
    },
    {
      t: 'rule',
      formula: 'oh = 0 · double / triple · point = dấu thập phân · at = @ · dot = . · all one word = viết liền · -teen nhấn sau, -ty nhấn trước',
      vi: 'Ghi số bằng chữ số, không viết bằng chữ; nghe hết câu vì số hay bị sửa.',
    },

    { t: 'h', text: '2. Tiếng Anh đời sống — hỏi đường' },
    {
      t: 'canh',
      anh: ['world-map', 'woman-tipping-hand', 'man-walking', 'classical-building'],
      caption: 'Ở một thành phố du lịch ven biển: **Mai** (khách) hỏi một người dân (**local**) đường đến bảo tàng. Để ý giới từ chuyển động ở Bài Ngữ pháp mục 3.',
    },
    {
      t: 'dialogue',
      title: 'Asking for directions — hỏi đường',
      lines: [
        { who: 'Mai', role: 'a', text: "Excuse me, sorry to bother you. Is there a pharmacy near here?", vi: 'Xin lỗi đã làm phiền. Gần đây có hiệu thuốc nào không ạ?' },
        { who: 'Local', role: 'b', text: "Yes, there's one on King Street. It's about five minutes' walk.", vi: 'Có, có một hiệu trên phố King. Đi bộ khoảng năm phút.' },
        { who: 'Mai', role: 'a', text: 'Could you tell me how to get there?', vi: 'Anh chỉ giúp tôi đường đến đó được không?' },
        { who: 'Local', role: 'b', text: "Sure. Go straight on to the traffic lights, then turn left. Walk past the bank, and it's on your right, between a bakery and a bookshop.", vi: 'Được. Đi thẳng tới đèn giao thông rồi rẽ trái. Đi qua ngân hàng, hiệu thuốc ở bên phải, giữa một tiệm bánh và một hiệu sách.' },
        { who: 'Mai', role: 'a', text: 'So, left at the traffic lights, past the bank, and it’s on the right. Is that right?', vi: 'Vậy là rẽ trái ở đèn giao thông, qua ngân hàng, rồi ở bên phải. Đúng không ạ?' },
        { who: 'Local', role: 'b', text: "Exactly. If you get lost, just ask for the bookshop. Everyone knows it.", vi: 'Chính xác. Nếu lạc thì cứ hỏi hiệu sách. Ai cũng biết chỗ đó.' },
        { who: 'Mai', role: 'a', text: 'Thank you so much. You’ve been very helpful.', vi: 'Cảm ơn anh rất nhiều. Anh giúp tôi nhiều quá.' },
      ],
    },
    {
      t: 'table',
      caption: 'Câu dùng được ngay — hỏi đường và đặt phòng',
      head: ['Tình huống', 'Hỏi / nói', 'Nghe được câu trả lời kiểu'],
      rows: [
        ['Mở lời lịch sự', 'Excuse me, sorry to bother you. · Could you help me?', 'Sure. / Of course. / How can I help?'],
        ['Hỏi đường', 'How do I get to…? · Is there a… near here? · Could you tell me the way to…?', 'Go straight on… · Take the second left… · It’s on your right.'],
        ['Kiểm tra lại', 'So, I go…, then…, is that right? · Sorry, could you say that again?', 'Exactly. / That’s it. / No, the second left.'],
        ['Đặt phòng', 'I’d like to book a double room for three nights. · Is breakfast included?', 'We have a room available… · That’s £… a night.'],
        ['Yêu cầu thêm', 'Is there anywhere to park? · Could I have a room with a sea view?', 'I’ll reserve a space for you. · There’s no extra charge.'],
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'book', pos: 'v', ipa: '/bʊk/', vi: 'đặt (phòng, vé, bàn)', ex: 'I booked a room online last night.', exVi: 'Tối qua tôi đã đặt phòng trên mạng.', more: 'Danh từ: **booking** = **reservation**. **fully booked** = hết chỗ. Mỹ hay dùng **reserve / make a reservation**.' },
        { w: 'double room', pos: 'n', ipa: '/ˌdʌbl ˈruːm/', vi: 'phòng một giường đôi', ex: 'A double room costs ninety pounds a night.', exVi: 'Phòng giường đôi giá chín mươi bảng một đêm.', more: '**single room** (một người) · **twin room** (hai giường đơn) · **en-suite** (có phòng tắm riêng).', anh: 'bed' },
        { w: 'available', pos: 'adj', ipa: '/əˈveɪləbl/', vi: 'còn trống, có sẵn', ex: 'Do you have any rooms available for tonight?', exVi: 'Tối nay còn phòng trống không?', more: 'Đã học ở Ngày 2 (AWL). Gần nghĩa ở khách sạn: **vacancies** — "No vacancies" = hết phòng.' },
        { w: 'include', pos: 'v', ipa: '/ɪnˈkluːd/', vi: 'bao gồm', ex: 'The price includes breakfast.', exVi: 'Giá đã bao gồm bữa sáng.', more: '**Is breakfast included?** · **including tax** (đã gồm thuế). Ngược nghĩa: **exclude / excluding**.' },
        { w: 'extra charge', pos: 'n', ipa: '/ˌekstrə ˈtʃɑːdʒ/', vi: 'phụ phí', ex: 'There is no extra charge for parking.', exVi: 'Đỗ xe không mất phụ phí.', more: '**free of charge** = miễn phí · **charge** (v) = tính phí: They charge £5 for parking.' },
        { w: 'reception', pos: 'n', ipa: '/rɪˈsepʃn/', vi: 'quầy lễ tân', ex: 'Please leave your key at reception.', exVi: 'Vui lòng để chìa khoá ở quầy lễ tân.', more: '**receptionist** = nhân viên lễ tân. **at reception** (không mạo từ trong khách sạn).', anh: 'bellhop-bell' },
        { w: 'traffic lights', pos: 'n', ipa: '/ˈtræfɪk laɪts/', vi: 'đèn giao thông', ex: 'Turn left at the traffic lights.', exVi: 'Rẽ trái ở đèn giao thông.', more: 'Luôn số nhiều. Chỗ giao nhau: **crossroads** (ngã tư), **roundabout** (vòng xuyến), **junction**.', anh: 'construction' },
        { w: 'seafront', pos: 'n', ipa: '/ˈsiːfrʌnt/', vi: 'đường / khu bờ biển (của thành phố)', ex: 'We walked along the seafront after dinner.', exVi: 'Chúng tôi đi dạo dọc bờ biển sau bữa tối.', more: 'Gần nghĩa: **promenade**. **pier** = cầu tàu nhô ra biển.', anh: 'beach-with-umbrella' },
      ],
    },

    { t: 'h', text: '3. Bài luyện 1 — Questions 1–8 (đặt phòng khách sạn)' },
    {
      t: 'canh',
      anh: ['telephone-receiver', 'hotel', 'woman-raising-hand', 'automobile'],
      caption: 'Chị **Anna Brennan** (người Mỹ, đang sống ở Anh) gọi cho **khách sạn Seaview** để đặt phòng mùa hè. Lễ tân **Tom** điền phiếu.',
    },
    {
      t: 'p',
      text: 'Complete the form below. Write **NO MORE THAN TWO WORDS AND/OR A NUMBER** for each answer. — Mỗi chỗ trống **tối đa hai từ và/hoặc một con số**.',
    },
    {
      t: 'table',
      caption: 'Seaview Hotel — Booking form',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Name', 'Anna (1) ______'],
        ['Arrival date', '(2) ______ July'],
        ['Number of nights', '(3) ______'],
        ['Room', 'a (4) ______ room with a sea view'],
        ['Price per night', '£ (5) ______ (breakfast included)'],
        ['Email', '(6) ______ @fastmail.com'],
        ['Postcode', '(7) ______'],
        ['Other', 'reserve a (8) ______ (no extra charge)'],
      ],
    },
    {
      t: 'listen',
      id: 't2d3-nghe-bai-1',
      title: 'Booking a hotel room',
      dan: { so: 'Day 3, Recording 1', boiCanh: 'a telephone conversation between a hotel receptionist and a woman who wants to book a room.', cau: [1, 8] },
      note: 'Lễ tân: giọng Anh (nam). Khách: giọng Mỹ (nữ). Khoảng 2 phút 30. Bẫy ở câu 2 (ngày đổi), câu 5 (giá đổi), câu 6 (đọc email).',
      lines: T2D3_SCRIPT_HOTEL,
    },
    {
      t: 'quiz',
      id: 't2d3-nghe-form',
      title: 'Questions 1–8 — NO MORE THAN TWO WORDS AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '1. Name: Anna ___', answers: ['Brennan'] },
        { q: '2. Arrival date: ___ July', answers: ['16', '16th', 'sixteenth', 'the 16th', 'the sixteenth'] },
        { q: '3. Number of nights: ___', answers: ['3', 'three'] },
        { q: '4. Room: a ___ room with a sea view', answers: ['double'] },
        { q: '5. Price per night: £ ___', answers: ['89.50', '89.5'] },
        { q: '6. Email: ___ @fastmail.com', answers: ['annab77'] },
        { q: '7. Postcode: ___', answers: ['BH12 4QT', 'BH124QT'] },
        { q: '8. Other: reserve a ___', answers: ['parking space', 'car parking space'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án 1–8',
      items: [
        '**1 Brennan** — "B, R, E, **double N**, A, N". double N = hai chữ N.',
        '**2 16** — "I was planning to arrive on the **fifteenth**… **but** my flight has changed, so it’ll be the **sixteenth** now."',
        '**3 three / 3** — "Three nights, please. I leave on the morning of the nineteenth" (16 → 19 = 3 đêm, khớp).',
        '**4 double** — "single, twin and double… I’m travelling with my husband, so **a double**". Phía trước đã có "a" → chỉ ghi double.',
        '**5 89.50** — £95 là giá thường; "**actually, sorry** — for stays of three nights or more… **eighty-nine pounds fifty**".',
        '**6 annab77** — "A, double N, A, B, seven seven, **all one word**". Phần @fastmail.com đã in sẵn.',
        '**7 BH12 4QT** — "B, H, one two, four, Q, T". Viết hoa, có hoặc không có dấu cách đều được.',
        '**8 parking space** — "I’ll reserve **a parking space** for you now". car park là cả bãi; thứ được giữ là **một chỗ**.',
      ],
    },

    { t: 'h', text: '4. Bài luyện 2 — chỉ đường (4 câu)' },
    {
      t: 'p',
      text: 'Anna hỏi lễ tân đường đến **Maritime Museum** (bảo tàng hàng hải). Complete the notes. Write **ONE WORD AND/OR A NUMBER** for each answer. Trước khi nghe, nhìn lại sơ đồ chuỗi giới từ ở Bài Ngữ pháp mục 3.',
    },
    {
      t: 'table',
      caption: 'Route to the Maritime Museum',
      head: ['Bước', 'Ghi chú'],
      rows: [
        ['1', 'Turn right and walk along the (1) ______'],
        ['2', 'Go past the pier; turn left at the (2) ______ tower'],
        ['3', 'Cross a bridge; the museum is opposite the (3) ______ office'],
        ['4', 'Walking time: about (4) ______ minutes today'],
      ],
    },
    {
      t: 'listen',
      id: 't2d3-nghe-bai-2',
      title: 'Directions to the museum',
      dan: { so: 'Day 3, Recording 2', boiCanh: 'a hotel receptionist giving directions to a guest.', cau: [1, 4] },
      note: 'Khoảng 1 phút. Bẫy ở câu 1 (con đường không nên đi) và câu 4 (thời gian thường lệ ≠ hôm nay).',
      lines: T2D3_SCRIPT_DIRECTIONS,
    },
    {
      t: 'quiz',
      id: 't2d3-nghe-duong',
      title: 'Route notes — ONE WORD AND/OR A NUMBER (4 câu)',
      kind: 'fill',
      items: [
        { q: '(1) walk along the ___', answers: ['seafront', 'sea front', 'sea-front'] },
        { q: '(2) turn left at the ___ tower', answers: ['clock'] },
        { q: '(3) the museum is opposite the ___ office', answers: ['post'] },
        { q: '(4) Walking time: about ___ minutes today', answers: ['15', 'fifteen'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích bài luyện 2',
      items: [
        '**(1) seafront** — "turn right and walk **along the seafront**. **Don’t** take the road behind the hotel" — con đường bị phủ định là bẫy.',
        '**(2) clock** — "at the **clock tower**, turn left into Harbour Street". (pier là chỗ **đi ngang qua** — past the pier.)',
        '**(3) post** — "It’s **opposite the post office**, a big red building". "office" đã in sẵn → chỉ ghi **post**.',
        '**(4) 15** — "Usually about ten minutes, **but** it’s quite windy today, so give yourself **fifteen**". Ghi chú hỏi "**today**".',
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Speaking ─────────────────────────── */

const T2D3_SPEAKING: Lesson = {
  id: 't2d3-noi',
  kind: 'speaking',
  title: 'Speaking Part 2 lần đầu: Describe a person — cue card, 1 phút ghi chú (+ gọi điện đặt lịch)',
  goal: 'Hiểu đúng thể lệ Part 2, dùng 1 phút chuẩn bị để ghi chú theo 4 dòng gợi ý, nói liền 1 phút 30 – 2 phút về một người theo khung 4 phần; có sẵn ngân hàng 3–5 tính cách kèm chuyện chứng minh để dùng cho mọi đề người; gọi điện đặt lịch hẹn bằng câu lịch sự; đọc rõ /θ/ /ð/ trong câu.',
  minutes: 70,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Speaking** từ 4.0 lên 5.0 ở **Fluency & Coherence**: band descriptors tả band 5 là "**thường giữ được mạch nói**" (dù còn lặp, tự sửa, nói chậm) — ở Part 2 nghĩa là nói được gần đủ thời gian; band 4 "**không trả lời được nếu không ngừng rõ rệt**", thường **dừng sau 30–40 giây**.',
        '**Part 2** (long turn): nhận **cue card** 4 dòng → **1 phút** chuẩn bị, được ghi chú → nói **1–2 phút** không bị ngắt → giám khảo có thể hỏi thêm 1 câu ngắn.',
        'Khung 4 phần: ==Mở đầu 1 câu → kể theo dòng 1–3 (chi tiết + quá khứ đơn) → dòng "explain" (cảm xúc, lý do) — phần dài nhất → câu chốt==.',
        'Ghi chú 1 phút: **4 ô từ khoá**, không viết câu. Đề hôm nay: **Describe a person** — loại đề dễ nhất trong 6 loại Part 2 (người · nơi · đồ vật · sự kiện · hoạt động · trừu tượng).',
        'Tiếng Anh ứng dụng: **gọi điện đặt lịch** (phòng khám, cắt tóc…). 🔊 Phát âm: **/θ/ /ð/** trong câu (think, three, the, mother).',
        '**Ngân hàng tính cách** (mục 4b): chuẩn bị 3–5 tính cách, mỗi tính cách 2 cách nói + một chuyện chứng minh — dùng cho mọi đề người; bảng **ô thông tin → cách kéo dài**.',
      ],
    },

    { t: 'h', text: '1. Thể lệ Part 2' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Part 2 diễn ra thế nào (3–4 phút)',
      steps: [
        { label: 'Giám khảo đưa **cue card**, giấy và bút chì', sub: '"I’m going to give you a topic and I’d like you to talk about it for one to two minutes."' },
        { label: '**1 phút chuẩn bị** — được ghi chú', sub: 'Không được hỏi lại đề; ghi từ khoá theo 4 dòng.' },
        { label: '**Nói 1–2 phút**, giám khảo không ngắt', sub: 'Nhắm 1 phút 45 – 2 phút. Giám khảo sẽ dừng bạn ở 2 phút.' },
        { label: 'Có thể có **1 câu hỏi kết** (rounding-off)', sub: 'Ví dụ: "Do you still see this person?" — trả lời 1–2 câu.' },
      ],
      caption: 'Ngừng ở 50 giây là lỗi lớn nhất: giám khảo chỉ có 50 giây ngôn ngữ để chấm. Nói quá 2 phút thì không sao — bị ngắt là bình thường.',
    },
    {
      t: 'table',
      caption: 'Giải phẫu một cue card',
      head: ['Dòng trên thẻ', 'Câu hỏi thật sự', 'Nói khoảng'],
      rows: [
        ['**Describe a person who has helped you a lot.**', 'Chủ đề — câu mở đầu nhắc lại bằng lời mình.', '1 câu'],
        ['You should say: **who this person is**', 'Là ai, quan hệ gì với bạn.', '15–20 giây'],
        ['**how you know him or her**', 'Quen thế nào, từ khi nào.', '15–20 giây'],
        ['**what this person did to help you**', 'Kể **chuyện** (quá khứ đơn) — một sự việc cụ thể.', '30–40 giây'],
        ['and **explain why this help was important to you**', 'Lý do + cảm xúc + kết quả — **dòng ăn điểm nhất**.', '30–40 giây'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai ở Part 2',
      items: [
        'Dùng 1 phút để **viết câu hoàn chỉnh** → hết giờ mới viết được 2 câu. Chỉ ghi **từ khoá**.',
        '**Đọc** ghi chú thành tiếng — giọng đều đều, giám khảo trừ FC. Nhìn ghi chú, rồi **nhìn giám khảo** mà nói.',
        'Kể **chung chung** ("she is very kind and helpful, she always helps me") → hết ý sau 30 giây. Phải có **một câu chuyện cụ thể** (ngày nào, ở đâu, chuyện gì).',
        'Trả lời dòng "explain" một câu ("because she is kind") — đây là phần dài nhất, cần lý do + kết quả + cảm xúc.',
      ],
    },

    { t: 'h', text: '2. 1 phút ghi chú — 4 ô từ khoá' },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Ghi chú mẫu cho "Describe a person who has helped you a lot"',
      center: '**Ms Hoa** — English teacher',
      branches: [
        { label: 'Who', items: ['grade 10–12 teacher', 'strict but kind', 'sense of humour'], anh: 'woman-teacher' },
        { label: 'How I know her', items: ['high school, 2019', 'I was shy, weak at English', 'sat at the back'], anh: 'school' },
        { label: 'What she did', items: ['free lessons after school', 'every Tue & Thu, 3 months', 'speaking club', 'mock test → 6.0'], anh: 'books' },
        { label: 'Why important', items: ['confidence ↑', 'scholarship → university', 'want to be like her', 'still message on Teachers’ Day'], anh: 'sparkles' },
      ],
      caption: 'Mỗi ô 3–4 từ khoá, có SỐ và TÊN cụ thể. 1 phút đủ để ghi chừng này nếu không viết câu.',
    },
    {
      t: 'rule',
      formula: '1 phút: 4 ô (who · how · what · why) × 3–4 từ khoá có số, tên, thời gian — không viết câu',
      vi: 'Ô "why" phải nhiều từ khoá nhất: lý do + kết quả + cảm xúc.',
    },

    { t: 'h', text: '3. Khung nói 4 phần + câu nối' },
    {
      t: 'table',
      head: ['Phần', 'Câu mở / câu nối dùng được', 'Ngữ pháp'],
      rows: [
        ['**Mở đầu** (1 câu)', 'I’d like to talk about… · The person I’m going to describe is…', 'Hiện tại đơn'],
        ['**Dòng 1–2**: ai, quen thế nào', 'She was my… · I first met her when… · We got to know each other at…', 'Quá khứ đơn (was, met)'],
        ['**Dòng 3**: chuyện cụ thể', 'One thing I’ll never forget is… · What happened was… · After that, … · In the end, …', 'Quá khứ đơn + **giới từ thời gian** (in 2019, on Tuesdays, for three months)'],
        ['**Dòng explain**', 'The main reason this was important is that… · Thanks to her, … · Looking back, I realise…', 'Hiện tại đơn / quá khứ đơn'],
        ['**Câu chốt** (khi còn thời gian)', 'So that’s why she has had such a big influence on me. · So if I had to choose someone who has helped me, it would have to be her.', '—'],
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'look up to', pos: 'phr v', ipa: '/lʊk ˈʌp tə/', vi: 'ngưỡng mộ, kính trọng', ex: 'I have always looked up to my older cousin.', exVi: 'Tôi luôn ngưỡng mộ người anh họ.', more: 'Ngược nghĩa: **look down on** (coi thường). Gần nghĩa: **admire**, **respect**.' },
        { w: 'get on well with', pos: 'phr v', ipa: '/ɡet ɒn ˈwel wɪð/', vi: 'hợp, thân với', ex: 'I get on well with all my classmates.', exVi: 'Tôi hợp với tất cả bạn cùng lớp.', more: 'Mỹ: **get along with**. ~~get on well to~~ là sai giới từ.' },
        { w: 'role model', pos: 'n', ipa: '/ˈrəʊl ˌmɒdl/', vi: 'tấm gương, hình mẫu', ex: 'My mother is my biggest role model.', exVi: 'Mẹ tôi là tấm gương lớn nhất của tôi.', anh: 'person-with-crown' },
        { w: 'patient', pos: 'adj', ipa: '/ˈpeɪʃnt/', vi: 'kiên nhẫn', ex: 'She was very patient with weak students.', exVi: 'Cô rất kiên nhẫn với học sinh yếu.', more: '**patient with** sb. Danh từ: **patience**. Trái nghĩa: **impatient**. (Cùng chữ **patient** = bệnh nhân.)' },
        { w: 'generous', pos: 'adj', ipa: '/ˈdʒenərəs/', vi: 'hào phóng, rộng lượng', ex: 'My uncle is generous with his time and money.', exVi: 'Chú tôi rộng rãi cả thời gian lẫn tiền bạc.', more: '**generous with** sth. Danh từ: **generosity**.' },
        { w: 'strict', pos: 'adj', ipa: '/strɪkt/', vi: 'nghiêm khắc', ex: 'Our maths teacher was strict but fair.', exVi: 'Thầy dạy toán của chúng tôi nghiêm nhưng công bằng.', more: 'Cụm hay dùng: **strict but fair / kind**. Âm cuối /kt/ rõ.' },
        { w: 'sense of humour', pos: 'n', ipa: '/ˌsens əv ˈhjuːmə(r)/', vi: 'óc hài hước', ex: 'He has a great sense of humour.', exVi: 'Anh ấy rất có óc hài hước.', more: 'Mỹ viết **humor**. **have a good / great sense of humour**.', anh: 'face-with-tears-of-joy' },
        { w: 'encourage', pos: 'v', ipa: '/ɪnˈkʌrɪdʒ/', vi: 'động viên, khuyến khích', ex: 'She encouraged me to join the speaking club.', exVi: 'Cô khuyến khích tôi tham gia câu lạc bộ nói.', more: '**encourage sb to do sth**. Danh từ: **encouragement**. Trái nghĩa: **discourage sb from doing**.' },
        { w: 'confidence', pos: 'n', ipa: '/ˈkɒnfɪdəns/', vi: 'sự tự tin', ex: 'The speaking club gave me more confidence.', exVi: 'Câu lạc bộ nói giúp tôi tự tin hơn.', more: 'Tính từ: **confident**. Cụm: **gain / build confidence** · **lack confidence**.' },
        { w: 'influence', pos: 'n, v', ipa: '/ˈɪnfluəns/', vi: 'ảnh hưởng; ảnh hưởng đến', ex: 'My grandfather had a big influence on my career choice.', exVi: 'Ông tôi có ảnh hưởng lớn đến lựa chọn nghề nghiệp của tôi.', more: '**have an influence on** sb/sth (danh từ + on). Động từ không giới từ: he **influenced** me.' },
      ],
    },

    { t: 'h', text: '4. Bài nói mẫu (khoảng 1 phút 45, 237 từ)' },
    {
      t: 'canh',
      anh: ['woman-teacher', 'woman-student', 'school', 'graduation-cap'],
      caption: 'Thí sinh **Nam** nhận cue card "Describe a person who has helped you a lot". Sau 1 phút ghi chú (sơ đồ ở mục 2), Nam bắt đầu nói.',
    },
    {
      t: 'dialogue',
      title: 'Part 2 — Describe a person who has helped you a lot',
      lines: [
        { who: 'Examiner', role: 'examiner', text: "Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish. Here's your topic: describe a person who has helped you a lot." },
        { who: 'Candidate', role: 'candidate', text: "I'd like to talk about Ms Hoa, who was my English teacher in high school.", vi: 'Tôi muốn kể về cô Hoa, cô giáo tiếng Anh của tôi hồi cấp ba.' },
        { who: 'Candidate', role: 'candidate', text: "I first met her in 2019, when I started grade ten. At that time I was very shy, and my English was quite weak, so I always sat at the back of the class and tried not to speak. Ms Hoa was strict but kind, and she had a great sense of humour, so her lessons were never boring.", vi: 'Tôi gặp cô lần đầu năm 2019, khi vào lớp mười. Hồi đó tôi rất nhút nhát, tiếng Anh khá yếu, nên lúc nào cũng ngồi cuối lớp và cố không phải nói. Cô Hoa nghiêm nhưng tốt bụng, lại rất hài hước nên giờ học của cô không bao giờ chán.' },
        { who: 'Candidate', role: 'candidate', text: "One thing I'll never forget is what she did after our first test. I got the lowest mark in the class, and I was really upset. Instead of criticising me, she offered me free lessons after school. For three months, every Tuesday and Thursday, we practised speaking together in the library. She also encouraged me to join the school's speaking club, which I was afraid of at first. In the end, I got a six point zero in a mock IELTS test, which was a huge surprise for everyone, including me.", vi: 'Một điều tôi sẽ không bao giờ quên là việc cô làm sau bài kiểm tra đầu tiên. Tôi bị điểm thấp nhất lớp và rất buồn. Thay vì chê trách, cô đề nghị dạy thêm miễn phí sau giờ học. Suốt ba tháng, mỗi thứ Ba và thứ Năm, chúng tôi luyện nói cùng nhau ở thư viện. Cô còn khuyến khích tôi vào câu lạc bộ nói của trường, điều mà lúc đầu tôi rất sợ. Cuối cùng, tôi được 6.0 trong một bài thi thử IELTS — một bất ngờ lớn với mọi người, kể cả tôi.' },
        { who: 'Candidate', role: 'candidate', text: "The main reason her help was so important is that it changed how I saw myself. Thanks to her, I gained a lot of confidence, and later I won a scholarship to study at university. Looking back, I realise that she gave me much more than English lessons. I still send her a message every year on Teachers' Day, and I really hope I can help someone the way she helped me.", vi: 'Lý do chính sự giúp đỡ của cô quan trọng như vậy là nó thay đổi cách tôi nhìn bản thân. Nhờ cô, tôi tự tin hơn rất nhiều, và sau đó giành được học bổng vào đại học. Nhìn lại, tôi nhận ra cô cho tôi nhiều hơn những giờ học tiếng Anh. Năm nào tôi cũng nhắn tin cho cô vào Ngày Nhà giáo, và tôi rất mong có thể giúp ai đó như cô đã giúp tôi.' },
        { who: 'Examiner', role: 'examiner', text: 'Do you still see her?' },
        { who: 'Candidate', role: 'candidate', text: "Not very often, because I live in another city now, but I visit her whenever I go back home.", vi: 'Không thường xuyên lắm vì giờ tôi sống ở thành phố khác, nhưng mỗi lần về quê tôi đều ghé thăm cô.' },
      ],
    },
    {
      t: 'table',
      caption: 'Vì sao bài mẫu được khoảng band 6 (cao hơn đích band 5 một bậc để bắt chước)',
      head: ['Tiêu chí', 'Bài mẫu làm được'],
      rows: [
        ['**Fluency & Coherence**', 'Đủ 4 phần theo đúng thứ tự cue card; câu nối thời gian: **At that time, One thing I’ll never forget, For three months, In the end, Looking back**.'],
        ['**Lexical Resource**', 'Từ tả người: strict but kind, sense of humour; cụm: **gained confidence, won a scholarship, encouraged me to join**.'],
        ['**Grammatical Range**', 'Quá khứ đơn chuẩn; mệnh đề quan hệ (**who was my English teacher**, **which I was afraid of**); giới từ thời gian đúng (**in 2019, every Tuesday, for three months, on Teachers’ Day**).'],
        ['**Pronunciation**', 'Nhiều /θ/ /ð/: **Thursday, three, thanks, the, that, together** — luyện ở mục 6.'],
      ],
    },

    { t: 'h', text: '4b. Ngân hàng tính cách — chuẩn bị một lần, dùng cho mọi đề "người"' },
    {
      t: 'p',
      text: 'Đề người rất nhiều: thầy cô, người thân, bạn cũ, người nổi tiếng, hàng xóm, người bạn ngưỡng mộ… Bạn **không** cần chuẩn bị riêng cho từng đề. Hãy chuẩn bị sẵn **3–5 tính cách**, mỗi tính cách gồm: **2 cách nói** (để khỏi lặp) + **một chi tiết / câu chuyện chứng minh**. Vào phòng thi, chọn 2 tính cách hợp với người trong đề là có ngay 30–40 giây nội dung.',
    },
    {
      t: 'table',
      head: ['Tính cách', '2 cách nói', 'Chi tiết chứng minh (ví dụ)'],
      rows: [
        ['**Kiên nhẫn**', 'patient · never loses her temper', 'She explained the same grammar point to me five times and never got annoyed.'],
        ['**Hào phóng**', 'generous · always willing to share', 'He lent me his laptop for a whole month when mine broke before my exams.'],
        ['**Chăm chỉ**', 'hard-working · a workaholic (hơi quá)', 'My mum gets up at five every morning to open her shop, even on Tết.'],
        ['**Hài hước**', 'has a great sense of humour · always makes people laugh', 'Whenever our class was stressed before a test, he told a silly joke and everyone relaxed.'],
        ['**Thoải mái, dễ tính**', 'laid-back · easy-going', 'When I broke her favourite cup, she just laughed and said, "It’s only a cup."'],
        ['**Quyết tâm**', 'determined · never gives up', 'My cousin failed the university entrance exam once, studied for another year and got in.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo — "nói tính cách thì phải có bằng chứng"',
      items: [
        'Chỉ nói "She is very kind and patient" là **câu chung chung** — band 4. Thêm **một việc người đó đã làm** là câu có giá trị: She is very patient. **For example, once** she explained… → giám khảo thấy quá khứ đơn, chi tiết, mạch kể.',
        'Đổi cách nói ở lần nhắc thứ hai: patient → **never loses her temper**; generous → **always willing to share**. Đó là điểm Lexical Resource.',
        'Một câu chuyện có thể chứng minh nhiều tính cách: chuyện cô dạy thêm miễn phí (mục 4) = **kiên nhẫn** + **hào phóng** với thời gian.',
      ],
    },
    {
      t: 'table',
      caption: 'Ô thông tin → cách kéo dài (đề người)',
      head: ['Ô trên thẻ', 'Thêm gì cho dài mà vẫn đúng đề', 'Ví dụ'],
      rows: [
        ['**Who** — là ai', 'tên + biệt danh · tuổi bây giờ + sinh nhật sắp tới · nghề + số năm làm', 'His name is Tuấn, but everyone calls him "Tom". He’s 52 now — he’ll be 53 next month — and he has been a bus driver for almost 30 years.'],
        ['**How you know** — quen thế nào', 'used to live… but moved to… · gặp lần đầu ở đâu, ấn tượng đầu tiên', 'We used to live next door, but his family moved to Da Nang in 2018. My first impression was that he looked quite strict.'],
        ['**What he / she is like / does**', '2 tính cách trong ngân hàng + chi tiết chứng minh', 'He’s very generous — once he drove me to the hospital at midnight and refused to take any money.'],
        ['**Explain why**', 'ảnh hưởng tới bạn bây giờ · bạn học được gì · bạn muốn giống họ ở điểm nào', 'Because of him, I’ve learned to help strangers without expecting anything back.'],
      ],
    },
    {
      t: 'rule',
      formula: 'Tính cách (2 cách nói) + For example, once + chuyện quá khứ · Ô Who: tên + tuổi + nghề + số năm · Ô How: used to… but moved to…',
      vi: 'Mỗi tính cách phải đi kèm một việc cụ thể đã xảy ra.',
    },
    {
      t: 'mcq',
      id: 't2d3-noi-tinh-cach',
      title: 'Ghép tính cách ↔ chi tiết chứng minh (5 câu)',
      items: [
        { q: 'Chi tiết nào chứng minh rõ nhất "She is very **patient**"?', options: ['She has long hair and wears glasses.', 'She taught my grandmother to use a smartphone, step by step, for a whole week, without ever raising her voice.', 'She is a teacher at a big school.'], correct: 1, why: 'B là **một việc cụ thể** cho thấy kiên nhẫn (dạy đi dạy lại cả tuần, không cáu). A là ngoại hình; C là nghề — không chứng minh tính cách.' },
        { q: 'Chi tiết nào chứng minh "He is **generous**"?', options: ['He gave half of his first salary to his parents and bought his little sister a bike.', 'He works in a bank.', 'He is always busy.'], correct: 0, why: '**generous** = hào phóng, sẵn sàng cho đi → chia lương, mua quà. B, C không liên quan.' },
        { q: '"My aunt is very **determined**." Câu nào nối tiếp tốt nhất?', options: ['She likes cooking.', 'She is 45 years old.', 'She failed her driving test three times, but she kept practising and finally passed on her fourth try.'], correct: 2, why: '**determined** = quyết tâm, không bỏ cuộc → trượt ba lần vẫn thi tiếp.' },
        { q: 'Cách nói thứ hai nào thay được cho "**easy-going**" để khỏi lặp?', options: ['laid-back', 'hard-working', 'strict'], correct: 0, why: '**laid-back** ≈ easy-going (thoải mái, dễ tính). hard-working = chăm chỉ; strict = nghiêm khắc (gần như ngược nghĩa).' },
        { q: 'Câu nào kéo dài ô "**Who**" đúng cách?', options: ['He is a good person and I like him very much.', 'His name is Long, but we call him "Professor" because he knows everything. He’s a doctor and has worked at Bach Mai Hospital for over ten years.', 'He has helped me a lot, which is why he is important to me.'], correct: 1, why: 'B thêm **biệt danh + lý do**, **nghề + số năm** — đúng mẹo ô Who. A chung chung; C là nội dung của ô **explain**, nói sớm thì phần cuối hết ý.' },
      ],
    },

    { t: 'h', text: '5. Tiếng Anh ứng dụng — gọi điện đặt lịch hẹn' },
    {
      t: 'canh',
      anh: ['telephone-receiver', 'tooth', 'spiral-calendar'],
      caption: '**Linh** gọi điện cho phòng khám nha khoa **Smile Dental** để đặt lịch khám. Để ý: câu hỏi **lịch sự** (Could I…? / Would… be possible?) và giới từ thời gian (**on** Friday, **at** 3, **in** the morning).',
    },
    {
      t: 'dialogue',
      title: 'Making an appointment by phone — gọi điện đặt lịch',
      lines: [
        { who: 'Receptionist', role: 'b', text: 'Good morning, Smile Dental. How can I help you?', vi: 'Chào buổi sáng, Nha khoa Smile xin nghe. Tôi giúp gì được ạ?' },
        { who: 'Linh', role: 'a', text: "Hello. I'd like to make an appointment for a check-up, please.", vi: 'Xin chào. Tôi muốn đặt lịch khám tổng quát răng.' },
        { who: 'Receptionist', role: 'b', text: 'Certainly. Are you an existing patient?', vi: 'Vâng. Chị đã là bệnh nhân ở đây chưa ạ?' },
        { who: 'Linh', role: 'a', text: "No, this is my first visit. Would Thursday afternoon be possible?", vi: 'Chưa, đây là lần đầu. Chiều thứ Năm có được không ạ?' },
        { who: 'Receptionist', role: 'b', text: "I'm afraid Thursday is fully booked. We have a slot on Friday at three, or on Monday morning at nine thirty.", vi: 'Rất tiếc thứ Năm đã kín lịch. Chúng tôi còn chỗ thứ Sáu lúc ba giờ, hoặc sáng thứ Hai lúc chín giờ rưỡi.' },
        { who: 'Linh', role: 'a', text: "Friday at three suits me. Could you tell me how much a check-up costs?", vi: 'Thứ Sáu lúc ba giờ hợp với tôi. Chị cho tôi hỏi khám tổng quát giá bao nhiêu ạ?' },
        { who: 'Receptionist', role: 'b', text: "It's three hundred thousand dong, and it takes about thirty minutes. Could I have your full name and phone number?", vi: 'Ba trăm nghìn đồng, mất khoảng ba mươi phút. Cho tôi xin họ tên đầy đủ và số điện thoại ạ.' },
        { who: 'Linh', role: 'a', text: "It's Nguyen Thuy Linh, and my number is oh nine one two, three four five, six seven eight.", vi: 'Nguyễn Thùy Linh, số điện thoại 0912 345 678.' },
        { who: 'Receptionist', role: 'b', text: "Thank you. So that's Friday the eighth at three p.m. Please arrive ten minutes early to fill in a form.", vi: 'Cảm ơn chị. Vậy là thứ Sáu ngày 8 lúc 3 giờ chiều. Vui lòng đến sớm mười phút để điền phiếu.' },
        { who: 'Linh', role: 'a', text: 'Great, thank you. See you on Friday.', vi: 'Tuyệt, cảm ơn chị. Hẹn gặp thứ Sáu.' },
      ],
    },
    {
      t: 'table',
      caption: 'Khung câu gọi điện đặt lịch',
      head: ['Bước', 'Câu mẫu'],
      rows: [
        ['Nói mục đích', 'I’d like to make / book an appointment (with Dr…) for… · I’m calling to…'],
        ['Đề nghị thời gian', 'Would Thursday afternoon be possible? · Do you have anything on Friday?'],
        ['Nhận / từ chối giờ', 'Friday at three suits me. · I’m afraid I can’t make Monday morning.'],
        ['Hỏi thêm', 'Could you tell me how much it costs? · How long does it take? · Do I need to bring anything?'],
        ['Chốt lại', 'So that’s Friday the eighth at 3 p.m., is that right? · Thank you, see you then.'],
      ],
    },
    {
      t: 'rule',
      formula: "I'd like to make an appointment for… → Would + [thời gian] + be possible? → [thời gian] suits me → So that's…, is that right?",
      vi: 'Luôn nhắc lại ngày giờ để kiểm tra — đúng thói quen người nói tiếng Anh, và đúng bẫy "sửa lời" của Listening Part 1.',
    },

    { t: 'h', text: '6. Phát âm: /θ/ và /ð/ trong câu' },
    {
      t: 'p',
      text: '**/θ/** (vô thanh — think, three, thanks, month) và **/ð/** (hữu thanh — the, this, mother, with) đều đặt **đầu lưỡi giữa hai hàm răng**, thổi hơi qua. /θ/ không rung cổ; /ð/ rung cổ. Người Việt hay thay /θ/ bằng "th" Việt (bật hơi) hoặc /s/, /t/; thay /ð/ bằng "d" hoặc "đ". Ở Tập 1 bạn đã luyện từng từ; hôm nay luyện **trong câu nói nhanh**, nơi "the, this, that, with" xuất hiện liên tục.',
    },
    {
      t: 'table',
      head: ['Âm', 'Cách đặt lưỡi', 'Hay bị đọc thành', 'Cặp tối thiểu'],
      rows: [
        ['/θ/', 'lưỡi giữa răng, thổi hơi, **không rung**', '/s/ (sink), /t/ (tank)', '**th**ink – sink · **th**ree – tree · mou**th** – mouse'],
        ['/ð/', 'lưỡi giữa răng, **rung** cổ họng', '/d/ (day), /z/', '**th**ey – day · brea**the** – breeze · **th**ough – dough'],
      ],
    },
    {
      t: 'phatam',
      id: 't2d3-phat-am',
      title: 'Luyện phát âm — /θ/ /ð/ trong câu Part 2',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Thè đầu lưỡi ra giữa răng ở mọi chữ “th”. Dòng 1–2 luyện cặp tối thiểu, dòng 3–8 là câu trong bài nói mẫu.',
      items: [
        { text: 'think, sink, three, tree', ipa: 'θɪŋk sɪŋk θriː triː', vi: '/θ/ ≠ /s/, /θ/ ≠ /t/' },
        { text: 'they, day, though, dough', ipa: 'ðeɪ deɪ ðəʊ dəʊ', vi: '/ð/ ≠ /d/' },
        { text: 'Thanks to her, I gained a lot of confidence.', ipa: 'θæŋks tə hɜː aɪ ɡeɪnd ə lɒt əv kɒnfɪdəns', vi: 'thanks /θ/' },
        { text: 'Every Tuesday and Thursday for three months.', ipa: 'evri tjuːzdeɪ ənd θɜːzdeɪ fə θriː mʌnθs', vi: 'Thursday, three /θ/ · months /nθs/' },
        { text: 'This is the person I think about the most.', ipa: 'ðɪs ɪz ðə pɜːsn aɪ θɪŋk əbaʊt ðə məʊst', vi: 'this, the /ð/ · think /θ/' },
        { text: 'My mother and father both work together.', ipa: 'maɪ mʌðə ənd fɑːðə bəʊθ wɜːk təɡeðə', vi: 'mother, father, together /ð/ · both /θ/' },
        { text: 'I think that her method was something special.', ipa: 'aɪ θɪŋk ðət hɜː meθəd wɒz sʌmθɪŋ speʃl', vi: 'think, method, something /θ/ · that /ð/' },
        { text: 'There was nothing else that I could do.', ipa: 'ðeə wəz nʌθɪŋ els ðət aɪ kʊd duː', vi: 'there, that /ð/ · nothing /θ/' },
      ],
    },

    { t: 'h', text: '7. Luyện nói với AI chấm' },
    {
      t: 'p',
      text: 'Mỗi cue card: bấm giờ **1 phút ghi chú** (4 ô từ khoá) rồi nói **1 phút 30 – 2 phút**. Đừng nhìn bài mẫu. Chọn **người thật**, có **một câu chuyện cụ thể** (ngày, nơi, việc gì).',
    },
    {
      t: 'speak',
      id: 't2d3-noi-part2',
      part: '2',
      questions: [
        'Describe a person who has helped you a lot. You should say: who this person is; how you know him or her; what this person did to help you; and explain why this help was important to you.',
        'Describe a family member you admire. You should say: who this person is; what he or she is like; what he or she does; and explain why you admire this person.',
        'Describe a friend you have known for a long time. You should say: who this friend is; when and where you met; what you usually do together; and explain why your friendship has lasted so long.',
      ],
    },
    {
      t: 'speak',
      id: 't2d3-noi-hen',
      part: '1',
      questions: [
        'Do you usually make appointments by phone or online?',
        'Are you usually on time for appointments?',
        'What do you do if you are late for an appointment?',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm Part 2',
      items: [
        'Thời lượng: **≥ 1 phút 30**? Nếu dừng sớm, ô nào ghi chú quá ít?',
        'Có **một câu chuyện cụ thể** ở dòng 3 không? Có ít nhất **2 mốc thời gian** đúng giới từ (in 2019, on Sundays…)?',
        'Dòng "explain" có ≥ 3 câu (lý do + kết quả + cảm xúc)?',
        'Nghe lại: các chữ **th** có thè lưỡi không?',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D3_HOMEWORK: Lesson = {
  id: 't2d3-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 3',
  goal: 'Tự kiểm tra Ngày 3 bằng 34 câu có đáp án: 12 câu chọn giới từ, 8 câu điền giới từ phụ thuộc, 4 mục nghe số – ngày – email, 6 câu dịch và 4 câu về Part 2.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (34 câu)',
      items: [
        '**Phần I** — Giới từ thời gian · nơi chốn · chuyển động (12 câu trắc nghiệm).',
        '**Phần II** — Giới từ phụ thuộc (8 câu điền).',
        '**Phần III** — Nghe và ghi số, ngày, email (4 mục).',
        '**Phần IV** — Dịch (6 câu): chỉ đường, đặt lịch, Task 1.',
        '**Phần V** — Part 2 (4 câu trắc nghiệm).',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Ngày 3 trong một hình',
      center: '**Ngày 3**',
      branches: [
        { label: 'Ngữ pháp: giới từ', items: ['at giờ · on ngày · in tháng / năm', 'at số nhà · on đường / tầng · in thành phố', 'along · past · across · through', 'depend on · increase in / by / to'] },
        { label: 'Nghe: số & ký hiệu', items: ['oh · double · point · at · dot', '-teen / -ty', 'sửa lời → số sau', 'hỏi đường · đặt phòng'] },
        { label: 'Nói: Part 2', items: ['1 phút: 4 ô từ khoá', '4 phần: mở · kể · explain · chốt', '1′30 – 2′', 'gọi điện đặt lịch · /θ/ /ð/'] },
      ],
    },

    { t: 'h', text: 'Phần I — Chọn giới từ (12 câu)' },
    {
      t: 'mcq',
      id: 't2d3-bt-gioi-tu',
      title: 'Phần I — Giới từ (12 câu)',
      items: [
        { q: 'The concert starts ___ 8 p.m.', options: ['at', 'on', 'in'], correct: 0, why: 'Giờ → **at**.' },
        { q: 'Vietnam’s National Day is ___ 2 September.', options: ['in', 'on', 'at'], correct: 1, why: 'Ngày tháng cụ thể → **on**.' },
        { q: 'I started learning English ___ 2015.', options: ['on', 'at', 'in'], correct: 2, why: 'Năm → **in**.' },
        { q: 'We are going to Sapa ___ next month.', options: ['Ø (không giới từ)', 'in', 'on'], correct: 0, why: 'Trước **next / last / this / every** → không giới từ.' },
        { q: 'The library is open ___ 10 p.m. every night.', options: ['by', 'until', 'during'], correct: 1, why: 'Kéo dài **tới** 10 giờ → **until**.' },
        { q: 'I fell asleep ___ the film.', options: ['during', 'for', 'while'], correct: 0, why: '**during** + danh từ (bộ phim — một sự kiện).' },
        { q: 'His flat is ___ the tenth floor.', options: ['in', 'at', 'on'], correct: 2, why: 'Tầng → **on** the tenth floor.' },
        { q: 'There is a small garden ___ the house.', options: ['behind', 'between', 'across'], correct: 0, why: '**behind** = phía sau. between cần hai vật (between A and B); across là chuyển động / ở phía bên kia.' },
        { q: 'We walked ___ the forest for two hours.', options: ['across', 'through', 'over'], correct: 1, why: 'Rừng có "bên trong" (cây bao quanh) → **through**.' },
        { q: 'Get ___ the bus at the third stop.', options: ['off', 'out', 'down'], correct: 0, why: 'Xuống **bus / train** → **get off**. (Xuống ô tô → get **out of** the car.)' },
        { q: 'They arrived ___ the hotel just before midnight.', options: ['to', 'in', 'at'], correct: 2, why: 'Điểm nhỏ (hotel) → **arrive at**.' },
        { q: 'Drive ___ the hill and the school is at the top.', options: ['along', 'up', 'past'], correct: 1, why: 'Lên dốc → **up** the hill.' },
      ],
    },

    { t: 'h', text: 'Phần II — Giới từ phụ thuộc (8 câu)' },
    {
      t: 'quiz',
      id: 't2d3-bt-phu-thuoc',
      title: 'Phần II — Điền một giới từ (8 câu)',
      kind: 'fill',
      items: [
        { q: 'Many young people rely ___ their parents for money.', answers: ['on'] },
        { q: 'She is very good ___ solving problems.', answers: ['at'] },
        { q: 'Who is responsible ___ cleaning the office?', answers: ['for'] },
        { q: 'There has been a sharp increase ___ the price of rice.', answers: ['in'] },
        { q: 'The price of rice rose ___ 12 per cent last year.', answers: ['by'] },
        { q: 'Smoking has a terrible effect ___ your health.', answers: ['on'] },
        { q: 'I am worried ___ my exam results.', answers: ['about'] },
        { q: 'There is no easy solution ___ this problem.', answers: ['to'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Phần II',
      items: [
        'rely **on** · good **at** · responsible **for** · an increase **in** (cái gì tăng) · rose **by** (tăng thêm bao nhiêu) · an effect **on** · worried **about** · a solution **to**.',
      ],
    },

    { t: 'h', text: 'Phần III — Nghe và ghi (4 mục)' },
    {
      t: 'dictation',
      id: 't2d3-bt-nghe',
      title: 'Phần III — Nghe số, ngày, email (4 mục)',
      items: [
        { label: 'Số người — dạng 0,000', spell: 'About three thousand seven hundred people live on the island.', answer: '3,700', alt: ['3700', '3 700'] },
        { label: 'Ngày — dạng 30 June', spell: 'The course ends on the thirtieth of June, not the thirteenth.', answer: '30 June', alt: ['30th June', 'June 30', 'June 30th'] },
        { label: 'Email', spell: 'Please write to info dash hanoi at learnhub dot org.', answer: 'info-hanoi@learnhub.org' },
        { label: 'Giá — dạng £00.00', spell: 'It was going to be fourteen ninety-nine, but in the sale it is twelve fifty.', answer: '£12.50', alt: ['12.50', '£12.5'] },
      ],
    },

    { t: 'h', text: 'Phần IV — Dịch (6 câu)' },
    {
      t: 'quiz',
      id: 't2d3-bt-dich',
      title: 'Phần IV — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'Giới từ thời gian / nơi chốn / chuyển động · giới từ phụ thuộc · câu gọi điện đặt lịch.',
      items: [
        { q: 'Đi qua ngân hàng, bưu điện ở bên trái bạn.', hint: 'Go / Walk past the bank, the post office is on your left', answers: ['Go past the bank, and the post office is on your left.', 'Go past the bank and the post office is on your left.', 'Walk past the bank, and the post office is on your left.', 'Walk past the bank and the post office is on your left.', 'Go past the bank. The post office is on your left.', 'Walk past the bank. The post office is on your left.', 'Go past the bank, the post office is on your left.', 'Walk past the bank, the post office is on your left.'] },
        { q: 'Tôi muốn đặt lịch hẹn vào sáng thứ Hai.', hint: "I'd like to make / book an appointment, for / on Monday morning", answers: ["I'd like to make an appointment for Monday morning.", 'I would like to make an appointment for Monday morning.', "I'd like to book an appointment for Monday morning.", 'I would like to book an appointment for Monday morning.', "I'd like to make an appointment on Monday morning.", 'I would like to make an appointment on Monday morning.', "I'd like to book an appointment on Monday morning."] },
        { q: 'Sáu giờ chiều thứ Sáu có được không?', hint: 'Would six o’clock on Friday / Friday at six, be possible?', answers: ['Would six o’clock on Friday be possible?', "Would six o'clock on Friday be possible?", 'Would 6 p.m. on Friday be possible?', 'Would Friday at six be possible?', 'Would six p.m. on Friday be possible?', 'Is six o’clock on Friday possible?', "Is six o'clock on Friday possible?", 'Would 6 pm on Friday be possible?'] },
        { q: 'Số lượng học sinh tăng từ 200 lên 350.', hint: 'The number of students, rose / increased, from 200 to 350', answers: ['The number of students rose from 200 to 350.', 'The number of students increased from 200 to 350.', 'The number of students grew from 200 to 350.', 'The number of students went up from 200 to 350.'] },
        { q: 'Hội An nổi tiếng với phố cổ.', hint: 'Hoi An, is famous for, its old town / old streets', answers: ['Hoi An is famous for its old town.', 'Hoi An is famous for its old streets.', 'Hoi An is famous for its ancient town.', 'Hoi An is famous for the old town.', 'Hoi An is well known for its old town.'] },
        { q: 'Cô ấy đã khuyến khích tôi tham gia câu lạc bộ.', hint: 'She, encouraged me, to join the club', answers: ['She encouraged me to join the club.', 'She encouraged me to join a club.'] },
      ],
    },

    { t: 'h', text: 'Phần V — Part 2 (4 câu)' },
    {
      t: 'mcq',
      id: 't2d3-bt-part2',
      title: 'Phần V — Speaking Part 2 (4 câu)',
      items: [
        { q: 'Trong 1 phút chuẩn bị Part 2, bạn nên:', options: ['viết sẵn 4–5 câu hoàn chỉnh để đọc', 'ghi 4 ô từ khoá theo 4 dòng cue card, có số và tên', 'ngồi im suy nghĩ, không ghi gì'], correct: 1, why: 'Từ khoá ngắn, theo 4 dòng — đủ để nhìn và nói. Viết câu thì không kịp và khi nói sẽ thành **đọc**.' },
        { q: 'Bạn nói được 50 giây thì hết ý. Cách tốt nhất là:', options: ['dừng lại và nói "That’s all."', 'nhắc lại câu mở đầu', 'quay về dòng "explain": thêm một lý do, kết quả hoặc cảm xúc'], correct: 2, why: 'Dòng **explain** luôn mở rộng được (vì sao, kết quả, giờ nghĩ thế nào). Dừng ở 50 giây làm giảm mạnh FC.' },
        { q: 'Dòng nào thường cần nói DÀI nhất?', options: ['and explain why…', 'who this person is', 'how you know him or her'], correct: 0, why: 'Dòng **explain** cần lý do + kết quả + cảm xúc — nơi giám khảo thấy rõ khả năng phát triển ý.' },
        { q: 'Câu nào là câu mở đầu Part 2 tốt?', options: ['My topic is describe a person.', "I'd like to talk about my uncle, Tuan, who is a doctor in Hue.", 'Person who helped me is very good person.'], correct: 1, why: '"I’d like to talk about…" + tên + một chi tiết (mệnh đề who…). A lặp đề sai ngữ pháp; C thiếu mạo từ và vô nghĩa.' },
      ],
    },
  ],
};

export const NGAY_3: Lesson[] = [T2D3_GRAMMAR, T2D3_LISTENING, T2D3_SPEAKING, T2D3_HOMEWORK];
