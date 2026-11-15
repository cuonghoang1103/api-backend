/** 10.1 — Nói lời giải: 30 câu theo pha, đọc ký hiệu thành tiếng, quy trình khi bí, xin gợi ý, hai kịch bản dài.
 *  Mọi mã/output đọc từ ../ma/ch10/b1 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetProduct } from '../ma/ch10/b1/product.vet.mjs';

/* Bảng vết LC 238 (hai lượt). */
const P = [1, 2, 3, 4];
const BANG = bangVet(['pass', 'i', 'nums', 'running product', 'write', 'answer'],
  vetProduct(P).map((h) => [
    h.luot, String(h.i),
    oMang(P, { to: h.luot.startsWith('→')
      ? Object.fromEntries([[h.i, 'r'], ...P.map((_, k) => [k, 'l']).filter(([k]) => k < h.i)])
      : Object.fromEntries([[h.i, 'r'], ...P.map((_, k) => [k, 'l']).filter(([k]) => k > h.i)]) }),
    h.bien, h.ghi, oMang(h.answer, { to: { [h.i]: 'ok' } }),
  ]));

/* 30 câu theo pha: [pha, câu tiếng Anh, khi nào dùng (EN), nghĩa Việt, từ khó + cách đọc (VI)] */
const CAU = [
  [1, 'Let me restate the problem to make sure I understand it.', 'The first sentence after reading the problem. It buys thinking time and catches misunderstandings.', 'Để em nói lại đề cho chắc là em hiểu đúng.', 'restate /ˌriːˈsteɪt/ — ri-XTÊ(t), nhấn âm sau'],
  [1, 'Can the input be empty? Can it contain duplicates or negative numbers?', 'The three questions that change code most often.', 'Đầu vào có thể rỗng không ạ? Có phần tử trùng hay số âm không?', 'duplicate /ˈduːplɪkət/ — ĐU-pli-cợt · negative /ˈneɡətɪv/ — NÉ-gơ-tiv'],
  [1, 'Roughly how large can n be?', 'The answer tells you the target complexity (lesson 0.1 table).', 'n lớn khoảng tới đâu ạ?', 'roughly /ˈrʌfli/ — RẤP-li'],
  [1, 'Should I return the indices or the values? And what if there is no valid answer?', 'Output format and the "not found" case.', 'Em trả về chỉ số hay giá trị ạ? Và nếu không có đáp án thì trả gì?', 'indices /ˈɪndɪsiːz/ — ÍN-đi-xiz (số nhiều của index)'],
  [2, 'Let me walk through a small example by hand.', 'Before any algorithm: one normal example, worked out loud.', 'Em chạy tay một ví dụ nhỏ nhé.', 'walk through /wɔːk θruː/ — uók thru (th đặt lưỡi giữa răng)'],
  [2, 'For an edge case like an empty array, I would expect zero. Is that right?', 'Turns an edge case into a question the interviewer confirms.', 'Với trường hợp biên như mảng rỗng, em nghĩ kết quả là 0. Đúng không ạ?', 'edge /edʒ/ — ÉT-giơ (một âm tiết, "giơ" rất nhẹ)'],
  [3, 'The brute-force approach would be to check every pair.', 'Name the simplest correct idea first — your safety net.', 'Cách vét cạn là thử mọi cặp.', 'brute force /bruːt fɔːrs/ — BRUT pho(s) · approach /əˈproʊtʃ/ — ơ-PRÂU-ch'],
  [3, 'That is O of n squared time and constant extra space.', 'How to READ O(n²) and O(1) aloud.', 'Cách đó tốn O(n²) thời gian và bộ nhớ phụ hằng số.', 'squared /skwerd/ — XQUE(d) · constant /ˈkɑːnstənt/ — CON-xtần'],
  [3, 'It is correct, but too slow for n up to ten to the fifth.', 'Say WHY you are not coding it: the constraint.', 'Nó đúng, nhưng quá chậm khi n lên tới 10⁵.', '"ten to the fifth" = 10⁵; cũng có thể nói "a hundred thousand"'],
  [4, 'The bottleneck is the inner loop, which is searching for one value.', 'Point at the repeated work. This sentence IS the insight.', 'Điểm nghẽn là vòng lặp trong, nó chỉ đang đi tìm một giá trị.', 'bottleneck /ˈbɑːtlnek/ — BÁ-tồ-néc'],
  [4, 'If I store what I have seen in a hash map, I can look it up in constant time.', 'Propose the tool and its effect.', 'Nếu em lưu những gì đã thấy vào hash map, em tra được trong thời gian hằng số.', 'hash /hæʃ/ — giữa "hét" và "hách", cuối bật "sh"'],
  [4, 'That brings it down to O of n time, at the cost of O of n space. That is the trade-off.', 'New complexity + what it costs.', 'Như vậy giảm xuống O(n) thời gian, đổi lại O(n) bộ nhớ. Đó là sự đánh đổi.', 'trade-off /ˈtreɪdɔːf/ — TRÊ-đo(f), nhấn âm đầu'],
  [5, 'Does this approach sound good to you? Shall I start coding?', 'Always ask before typing. A "no" here saves you 15 minutes.', 'Anh/chị thấy hướng này ổn không ạ? Em bắt đầu code nhé?', 'shall /ʃæl/ — SHEN (âm l cuối nhẹ)'],
  [5, 'I will write a helper function for this part and fill it in at the end.', 'Keeps the main function readable; buys time on the hard bit.', 'Phần này em viết một hàm phụ, cuối cùng em điền nội dung sau.', 'helper /ˈhelpər/ — HEO-pơ'],
  [6, 'I am iterating from left to right and keeping track of the best answer so far.', 'Narrate the loop in one sentence, not line by line.', 'Em duyệt từ trái sang phải và lưu lại đáp án tốt nhất tới giờ.', 'iterate /ˈɪtəreɪt/ — Í-tơ-rây(t), nhấn âm ĐẦU · keep track of = theo dõi'],
  [6, 'I use "less than" rather than "less than or equal" here, because the last index is n minus one.', 'Say the subtle decision out loud — this is where points are.', 'Ở đây em dùng "nhỏ hơn" chứ không phải "nhỏ hơn hoặc bằng", vì chỉ số cuối là n − 1.', 'equal /ˈiːkwəl/ — I-quồ · minus /ˈmaɪnəs/ — MAI-nợt(s)'],
  [6, 'This variable holds the product of everything to the left of i.', 'Explain what a variable MEANS, not what it is called.', 'Biến này giữ tích của mọi phần tử bên trái i.', 'variable /ˈveriəbl/ — VE-ri-ơ-bồ'],
  [6, 'Let me double-check this boundary.', 'Shows care at the place bugs live.', 'Để em kiểm lại chỗ biên này.', 'boundary /ˈbaʊndri/ — BAO-đơ-ri'],
  [7, 'Let me think about this for a moment.', 'Permission to be silent for 20–30 seconds. Then talk again.', 'Cho em nghĩ một chút ạ.', 'moment /ˈmoʊmənt/ — MÂU-mần(t)'],
  [7, 'I am stuck on how to avoid recomputing this. Let me try a smaller example.', 'Say WHERE you are stuck, then act.', 'Em đang kẹt ở chỗ làm sao để khỏi tính lại phần này. Em thử một ví dụ nhỏ hơn.', 'recompute /ˌriːkəmˈpjuːt/ — ri-cơm-PIUT'],
  [7, 'Going back to the constraints: n is at most ten to the fifth, so I need something like n log n.', 'The constraint is a hint the problem already gave you.', 'Quay lại ràng buộc: n tối đa 10⁵, nên em cần cỡ n log n.', 'constraint /kənˈstreɪnt/ — cơn-XTRÊN(t)'],
  [8, 'I have two ideas: sorting first, or a hash map. I am leaning towards the hash map because it keeps the order. Am I heading in the right direction?', 'The good way to ask: show your options and your reasoning, then ask.', 'Em có hai hướng: sắp xếp trước, hoặc hash map. Em nghiêng về hash map vì nó giữ thứ tự. Em có đang đi đúng hướng không ạ?', 'leaning towards = nghiêng về · heading /ˈhedɪŋ/ — HÉ-đinh'],
  [8, 'Could you give me a small hint about which part I should focus on?', 'Ask for the SMALLEST hint, not the answer.', 'Anh/chị gợi ý giúp em một chút là em nên tập trung vào phần nào được không ạ?', 'focus /ˈfoʊkəs/ — PHÂU-cợt(s)'],
  [9, 'Now let me test it with the example from earlier.', 'Start step 6 on your own — do not wait to be asked.', 'Giờ em test với ví dụ lúc nãy.', ''],
  [9, 'Let me trace through the code line by line with this input.', 'Tracing = running the code by hand, writing variable values.', 'Em chạy tay code từng dòng với đầu vào này.', 'trace /treɪs/ — TRÊ(s)'],
  [9, 'I found a bug: this should start from one, not zero. Let me fix it.', 'Finding your own bug scores. Say symptom → cause → fix.', 'Em thấy một lỗi: chỗ này phải bắt đầu từ 1 chứ không phải 0. Em sửa nhé.', 'bug /bʌɡ/ — BẤG (không đọc "búc")'],
  [10, 'The time complexity is O of n log n because of the sort, and the space complexity is O of n.', 'Always both: time AND space, each with a reason.', 'Độ phức tạp thời gian là O(n log n) vì có bước sắp xếp, bộ nhớ là O(n).', 'complexity /kəmˈpleksəti/ — cơm-PLÉC-xơ-ti, nhấn âm HAI'],
  [10, 'In the worst case it is linear; on average each element is touched a constant number of times.', 'Worst case vs amortised / average — the precise version.', 'Trường hợp xấu nhất là tuyến tính; trung bình mỗi phần tử chỉ bị đụng một số lần hằng số.', 'linear /ˈlɪniər/ — LÍ-ni-ơ · average /ˈævərɪdʒ/ — E-vơ-rịch'],
  [11, 'What does a typical week look like for an intern on your team?', 'A real question about the job — shows you imagine yourself there.', 'Một tuần điển hình của thực tập sinh trong nhóm anh/chị trông thế nào ạ?', 'typical /ˈtɪpɪkl/ — TÍ-pi-cồ · intern /ˈɪntɜːrn/ — ÍN-tơn'],
  [11, 'How does your team review code, and how do interns get feedback?', 'Shows you care about learning and quality.', 'Nhóm mình review code thế nào, và thực tập sinh nhận góp ý ra sao ạ?', 'review /rɪˈvjuː/ — ri-VIU · feedback /ˈfiːdbæk/ — PHÍT-béc'],
];
const PHA_EN = ['', 'Clarify', 'Examples', 'Brute force', 'Optimise', 'Ask to code', 'Narrate while coding', 'When stuck', 'Asking for a hint', 'Testing', 'Complexity', 'Questions at the end'];
const PHA_VI = ['', 'Hỏi làm rõ', 'Ví dụ', 'Vét cạn', 'Tối ưu', 'Xin phép code', 'Thuật lại khi code', 'Khi bí', 'Xin gợi ý', 'Test', 'Độ phức tạp', 'Hỏi ngược cuối buổi'];
const bangCau = (lang) => {
  const en = lang === 'en';
  const dau = en ? ['#', 'Phase', 'Phrase', 'When / why'] : ['#', 'Pha', 'Câu tiếng Anh', 'Nghĩa', 'Từ khó — đọc thế nào'];
  return `<table>\n<thead><tr>${dau.map((c) => `<th>${c}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    CAU.map((c, i) => en
      ? `<tr><td>${i + 1}</td><td>${PHA_EN[c[0]]}</td><td><em>${c[1]}</em></td><td>${c[2]}</td></tr>`
      : `<tr><td>${i + 1}</td><td>${PHA_VI[c[0]]}</td><td><em>${c[1]}</em></td><td>${c[3]}</td><td>${c[4]}</td></tr>`).join('\n') +
    '\n</tbody></table>';
};

/* Đọc ký hiệu thành tiếng: [ký hiệu, tiếng Anh, tiếng Việt khi phỏng vấn trong nước] */
const KY_HIEU = [
  ['O(1)', '"O of one" / "constant time"', '"ô một", "thời gian hằng số"'],
  ['O(log n)', '"O of log n" / "logarithmic"', '"ô lốc en"'],
  ['O(n)', '"O of n" / "linear"', '"ô en", "tuyến tính"'],
  ['O(n log n)', '"O of n log n"', '"ô en lốc en"'],
  ['O(n²)', '"O of n squared" / "quadratic"', '"ô en bình phương"'],
  ['O(2ⁿ)', '"O of two to the n" / "exponential"', '"ô hai mũ en", "hàm mũ"'],
  ['10⁵', '"ten to the fifth" / "a hundred thousand"', '"mười mũ năm"'],
  ['n − 1', '"n minus one"', '"en trừ một"'],
  ['a[i]', '"a of i" / "a at index i"', '"a i", "phần tử thứ i"'],
  ['i ≤ n', '"i less than or equal to n"', '"i nhỏ hơn hoặc bằng en"'],
  ['x % 2', '"x mod two"', '"x chia lấy dư cho hai", "x mod hai"'],
  ['a != b', '"a not equal to b"', '"a khác b"'],
];
const bangKyHieu = (lang) => `<table>\n<thead><tr><th>${lang === 'en' ? 'Written' : 'Viết'}</th><th>${lang === 'en' ? 'Say (English)' : 'Đọc (tiếng Anh)'}</th>${lang === 'en' ? '' : '<th>Đọc khi phỏng vấn bằng tiếng Việt</th>'}</tr></thead>\n<tbody>\n` +
  KY_HIEU.map((k) => `<tr><td><code>${k[0]}</code></td><td>${k[1]}</td>${lang === 'en' ? '' : `<td>${k[2]}</td>`}</tr>`).join('\n') + '\n</tbody></table>';

/* 20 từ hay đọc sai: [từ, IPA, ghi chú EN, cách đọc gần đúng VI] */
const TU = [
  ['algorithm', '/ˈælɡərɪðəm/', 'stress on the FIRST syllable; "th" as in "this"', 'ÁL-gơ-ri-đầm (nhấn âm đầu, "th" như "đ" mềm)'],
  ['complexity', '/kəmˈpleksəti/', 'stress on PLEX', 'cơm-PLÉC-xơ-ti'],
  ['iterate', '/ˈɪtəreɪt/', 'stress on the FIRST syllable', 'Í-tơ-rây(t)'],
  ['integer', '/ˈɪntɪdʒər/', 'the "g" is soft, like "j"', 'ÍN-ti-giơ (không đọc "in-tê-gơ")'],
  ['index / indices', '/ˈɪndeks/ · /ˈɪndɪsiːz/', 'plural ends in "-seez"', 'ÍN-đéc(x) · ÍN-đi-xiz'],
  ['array', '/əˈreɪ/', 'stress on the SECOND syllable', 'ơ-RÂY'],
  ['recursion', '/rɪˈkɜːrʒn/', 'stress on CUR', 'ri-CƠ-giần'],
  ['queue', '/kjuː/', 'sounds exactly like the letter Q', 'KIU (như chữ Q)'],
  ['character', '/ˈkærəktər/', 'starts with a "k" sound', 'KÉ-rợc-tơ (không đọc "cha-")'],
  ['binary', '/ˈbaɪnəri/', 'stress on BI, "bye"', 'BAI-nơ-ri'],
  ['logarithm', '/ˈlɔːɡərɪðəm/', 'stress on the FIRST syllable', 'LÓ-gơ-ri-đầm'],
  ['linear', '/ˈlɪniər/', 'three short syllables', 'LÍ-ni-ơ'],
  ['quadratic', '/kwɑːˈdrætɪk/', 'stress on DRAT', 'quơ-ĐRÉ-tic'],
  ['constraint', '/kənˈstreɪnt/', 'stress on STRAINT', 'cơn-XTRÊN(t)'],
  ['variable', '/ˈveriəbl/', 'four syllables, stress on the first', 'VE-ri-ơ-bồ'],
  ['duplicate (noun)', '/ˈduːplɪkət/', 'the noun ends in "-kət"; the verb in "-keɪt"', 'ĐU-pli-cợt (danh từ) · ĐU-pli-kêi(t) (động từ)'],
  ['pseudocode', '/ˈsuːdoʊkoʊd/', 'the "p" is silent', 'XU-đâu-câu(d) (âm "p" câm)'],
  ['parentheses', '/pəˈrenθəsiːz/', 'stress on REN', 'pơ-REN-thơ-xiz'],
  ['vertex / vertices', '/ˈvɜːrteks/ · /ˈvɜːrtɪsiːz/', 'plural like "indices"', 'VƠ-tếch(x) · VƠ-ti-xiz'],
  ['height', '/haɪt/', 'no "th" at the end', 'HAI(t) (không có "th" như width)'],
];
const bangTu = (lang) => `<table>\n<thead><tr><th>${lang === 'en' ? 'Word' : 'Từ'}</th><th>IPA</th><th>${lang === 'en' ? 'Note' : 'Đọc gần đúng (CHỮ HOA = âm nhấn)'}</th></tr></thead>\n<tbody>\n` +
  TU.map((t) => `<tr><td><strong>${t[0]}</strong></td><td>${t[1]}</td><td>${lang === 'en' ? t[2] : t[3]}</td></tr>`).join('\n') + '\n</tbody></table>';

const DE = [
  [lc(1, 'two-sum', 'Two Sum', 'Easy'), 'Warm-up for the full script: clarify duplicates, brute force, hash map, test [3, 3].', 'Khởi động cho trọn kịch bản: hỏi về phần tử trùng, vét cạn, hash map, test [3, 3].'],
  [lc(3, 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', 'Medium'), 'The smooth conversation of this lesson; practise narrating the jump of left.', 'Kịch bản trơn tru của bài; luyện thuật lại cú nhảy của left.'],
  [lc(238, 'product-of-array-except-self', 'Product of Array Except Self', 'Medium'), 'The stuck conversation; practise asking for the hint the good way.', 'Kịch bản bị bí; luyện xin gợi ý đúng cách.'],
  [lc(49, 'group-anagrams', 'Group Anagrams', 'Medium'), 'Explain a KEY choice aloud: sorted letters vs counts, with both costs.', 'Nói to lựa chọn KHOÁ: chữ đã sắp vs bộ đếm, kèm chi phí của cả hai.'],
  [lc(56, 'merge-intervals', 'Merge Intervals', 'Medium'), 'Clarify "touching" intervals ([1,2] and [2,3]) before coding.', 'Hỏi rõ hai khoảng "chạm nhau" ([1,2] và [2,3]) trước khi code.'],
  [lc(739, 'daily-temperatures', 'Daily Temperatures', 'Medium'), 'Narrate what the stack holds — "indices of days still waiting".', 'Thuật lại stack đang giữ gì — "chỉ số của những ngày còn đang chờ".'],
  [lc(200, 'number-of-islands', 'Number of Islands', 'Medium'), 'Practise saying the complexity of a grid: O(rows × cols).', 'Luyện nói độ phức tạp trên lưới: O(số hàng × số cột).'],
  [lc(15, '3sum', '3Sum', 'Medium'), 'Long enough to need a helper and a narrated duplicate-skip.', 'Đủ dài để cần một hàm phụ và một đoạn "bỏ trùng" phải thuật lại.'],
];

export default {
  title: '10.1 — Talking through a solution: 30 phrases, getting unstuck, asking for hints|||10.1 — Nói lời giải: 30 câu theo pha, gỡ khi bí, xin gợi ý đúng cách',
  slug: 'dsa-10-1-noi',
  type: 'LESSON',
  isFreePreview: true,
  description: '30 câu tiếng Anh theo từng pha của buổi phỏng vấn (nghĩa Việt + cách đọc từ khó), đọc ký hiệu O(n) thành tiếng, quy trình khi bí, cách xin gợi ý vẫn được điểm, hai kịch bản dài (LC 3 trơn tru, LC 238 bí rồi gỡ được) và phỏng vấn bằng tiếng Việt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Talking through a solution: 30 phrases, getting unstuck, asking for hints</h2>
<p class="lead">Section 0 made two promises to this lesson: "the 30 phrases you actually need to speak" and "a protocol for when you are stuck — re-read the constraints, try a smaller example, name the brute force, ask for a hint in a way that still scores". Here they are, plus how to read <code>O(n log n)</code> aloud without freezing, two long conversations (one smooth, one where the candidate gets stuck and recovers), and how the same interview sounds in Vietnamese at a local company.</p>

<h3>The everyday picture: the motorbike mechanic</h3>
<p>Take your motorbike to a good mechanic. He does not silently take the engine apart. He asks what happens ("does it die when cold or when hot?"), tells you the cheap option and the proper option with their prices, asks "shall I replace the spark plug?", says what he finds while he works ("the filter is clogged, that's why"), starts the engine to check, and tells you the bill. You trust him — even if the bike takes an hour — because you could follow every decision. A mechanic who works in silence and then says "200k, done" makes you nervous even when he did a perfect job.</p>
<p>A coding interview is that shop with you behind the counter. Clarify = asking about symptoms. Brute force vs optimal = cheap vs proper option. Complexity = the price. "Shall I start coding?" = asking before replacing the part. Testing = starting the engine. Communication is one of the four axes on the scoring sheet (lesson 0.8), and the interviewer can only give you a hint if they can hear where you are.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Nói lời giải: 30 câu theo pha, gỡ khi bí, xin gợi ý đúng cách</h2>
<p class="lead">Mục 0 đã hứa hai thứ với bài này: "30 câu bạn thật sự cần để nói" và "một quy trình khi bí — đọc lại ràng buộc, thử ví dụ nhỏ hơn, gọi tên vét cạn, xin gợi ý theo cách vẫn được điểm". Chúng ở đây, kèm cách đọc to <code>O(n log n)</code> mà không khựng, hai kịch bản hội thoại dài (một trơn tru, một bị bí rồi gỡ được), và cùng buổi phỏng vấn đó nghe thế nào khi nói bằng tiếng Việt ở công ty trong nước.</p>

<h3>Hình dung đời thường: anh thợ sửa xe máy</h3>
<p>Bạn dắt xe vào một tiệm sửa xe tử tế. Anh thợ không im lặng tháo tung máy ra. Anh hỏi triệu chứng ("xe chết máy lúc nguội hay lúc nóng?"), nói phương án rẻ và phương án làm cho đàng hoàng kèm giá từng cái, hỏi "anh thay bugi nhé?", vừa làm vừa nói mình thấy gì ("lọc gió tắc rồi, tại cái này đây"), nổ máy chạy thử, rồi báo tiền. Bạn tin anh — kể cả khi mất một tiếng — vì bạn theo được mọi quyết định của anh. Một ông thợ làm trong im lặng rồi buông một câu "200 nghìn, xong" làm bạn bất an, kể cả khi ông làm hoàn hảo.</p>
<p>Buổi phỏng vấn coding chính là tiệm sửa xe đó, và bạn đứng sau quầy. Hỏi làm rõ = hỏi triệu chứng. Vét cạn với tối ưu = phương án rẻ với phương án đàng hoàng. Độ phức tạp = báo giá. "Em bắt đầu code nhé?" = hỏi trước khi thay đồ. Test = nổ máy chạy thử. Giao tiếp là một trong bốn trục của phiếu chấm (bài 0.8), và người phỏng vấn chỉ gợi ý được cho bạn khi họ nghe được bạn đang ở đâu.</p>
${lienKet({ bai: 'dsa-0-8-bat-dau-tai-day', title: '0.8 — Vòng coding kiểm tra gì', sub: 'Bốn trục của phiếu chấm: giao tiếp, giải quyết vấn đề, code, test', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>What "thinking out loud" means — and what it does not</h3>
<p><strong>Thinking out loud</strong> is saying your <em>decisions and reasons</em>, not reading your code. "I set i to zero, i is less than n, i plus plus" scores nothing — the interviewer can read. "I walk from left to right and keep the cheapest price so far, because for each sell day only the cheapest earlier day matters" scores, because it shows the idea. A useful rule: <strong>one sentence per decision</strong>, said <em>before</em> you type it. Between decisions, silence while you type is fine; silence for more than about a minute without a word is not.</p>
<p>Three things to say out loud even when you are confident: (1) the brute force and its complexity, (2) the one subtle decision in your code (why <code>&lt;</code> and not <code>&lt;=</code>, why check before insert), (3) the final time and space. These three are what an interviewer writes on the scoring sheet under "problem solving" and "communication".</p>
</div>
<div class="ml-vi">
<h3>"Nghĩ thành tiếng" là gì — và không phải là gì</h3>
<p><strong>Thinking out loud (nghĩ thành tiếng)</strong> là nói ra <em>quyết định và lý do</em>, không phải đọc lại code. "Em gán i bằng 0, i nhỏ hơn n, i cộng cộng" không được điểm nào — người phỏng vấn tự đọc được. "Em đi từ trái sang phải và giữ giá rẻ nhất tới giờ, vì với mỗi ngày bán chỉ ngày mua rẻ nhất trước đó là quan trọng" thì được điểm, vì nó cho thấy ý tưởng. Một luật dễ nhớ: <strong>mỗi quyết định một câu</strong>, nói <em>trước khi</em> gõ nó. Giữa hai quyết định, im lặng lúc gõ là bình thường; im quá khoảng một phút không một lời thì không ổn.</p>
<p>Ba thứ phải nói ra kể cả khi bạn chắc chắn: (1) lời giải vét cạn và độ phức tạp của nó, (2) đúng MỘT quyết định tinh tế trong code (vì sao <code>&lt;</code> chứ không phải <code>&lt;=</code>, vì sao tra trước rồi mới cất), (3) thời gian và bộ nhớ cuối cùng. Ba thứ này là những gì người phỏng vấn ghi vào phiếu ở mục "giải quyết vấn đề" và "giao tiếp".</p>
<p>Với người yếu tiếng Anh như nhiều bạn sinh viên mình, mẹo quan trọng nhất là: <strong>đừng cố nói câu dài và hay — hãy nói câu ngắn và đúng</strong>. Người phỏng vấn ở công ty quốc tế gặp ứng viên từ khắp nơi; họ chấm việc bạn truyền được ý, không chấm giọng. Ba mươi câu dưới đây được chọn để bạn học thuộc như học công thức: thay từ trong ngoặc là dùng được cho hầu hết mọi đề.</p>
</div>

<div class="ml-en">
<h3>The 30 phrases, phase by phase</h3>
<p>Learn them as templates: swap the nouns ("every pair" → "every subarray", "hash map" → "stack") and they fit almost any problem. The phases follow the six-step framework of lesson 0.2, plus three moments that framework does not script: being stuck, asking for a hint, and the questions you ask at the end.</p>
${bangCau('en')}
</div>
<div class="ml-vi">
<h3>30 câu, theo từng pha</h3>
<p>Học như học khuôn: thay danh từ ("every pair" → "every subarray", "hash map" → "stack") là chúng vừa với gần như mọi đề. Các pha đi theo khung 6 bước của bài 0.2, cộng thêm ba lúc khung đó chưa viết sẵn lời: khi bí, khi xin gợi ý, và câu bạn hỏi lại ở cuối buổi. Cột cuối là cách đọc gần đúng những từ người Việt hay đọc sai — CHỮ HOA là âm tiết phải nhấn.</p>
${bangCau('vi')}
<p>Cách học 30 câu này trong một tuần: mỗi ngày 5 câu, đọc to theo kiểu <em>shadowing</em> (nhại theo — nghe một câu mẫu rồi nói đè lên ngay sau nó, cùng nhịp), rồi dùng chúng khi tự giải một đề Easy. Không cần thuộc cả 30 câu mới bắt đầu luyện đề: chỉ cần câu 1, 7, 8, 13, 24 và 27 là bạn đã đi trọn một vòng phỏng vấn.</p>
${lienKet({ bai: 'dsa-0-2-khung', title: '0.2 — Khung 6 bước', sub: 'Các pha ở bảng trên đi theo đúng sáu bước này', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>Reading symbols aloud</h3>
<p>The moment people freeze is often not the idea but the notation: how do you <em>say</em> <code>O(n log n)</code>? This table is the whole vocabulary you need for complexities and indices.</p>
${bangKyHieu('en')}
<h3>Twenty words that are often mispronounced</h3>
<p>Interviewers will understand you anyway, but a wrong stress on a key word ("al-GO-rithm", "com-PLEX-i-ty" said flat) makes them ask you to repeat, and repeating eats your confidence. The stressed syllable matters more than any single sound.</p>
${bangTu('en')}
</div>
<div class="ml-vi">
<h3>Đọc ký hiệu thành tiếng</h3>
<p>Lúc người ta khựng nhiều khi không phải vì ý tưởng mà vì ký hiệu: <code>O(n log n)</code> thì <em>nói</em> thế nào? Bảng này là toàn bộ vốn từ bạn cần cho độ phức tạp và chỉ số, kèm cách người Việt hay đọc khi phỏng vấn bằng tiếng Việt.</p>
${bangKyHieu('vi')}
<h3>Hai mươi từ hay đọc sai</h3>
<p>Người phỏng vấn vẫn hiểu bạn thôi, nhưng nhấn sai trọng âm ở một từ khoá (đọc "al-gô-rít" đều đều, hay "com-pơ-lếch-xi-ty") khiến họ phải hỏi lại, và việc phải nhắc lại ăn mòn sự tự tin của bạn. Âm tiết được nhấn quan trọng hơn bất kỳ một âm đơn lẻ nào. Phiên âm IPA (bảng ký hiệu ngữ âm quốc tế) để bạn tra từ điển; cột cuối là cách đọc gần đúng bằng chữ Việt, chỉ để định hướng — nghe bản gốc trên từ điển một lần là chắc nhất.</p>
${bangTu('vi')}
</div>

<div class="ml-en">
<h3>The stuck protocol: six moves, in order</h3>
<p>Everybody gets stuck. What the interviewer watches is what you do in the next two minutes. Panic looks like silence, then "sorry, I don't know". A protocol looks like this:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Say it</span><span class="lz-d">"Let me think about this for a moment." You have bought 20–30 seconds of legitimate silence.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Re-read the constraints</span><span class="lz-d">n ≤ 10⁵ means O(n log n) or O(n); n ≤ 20 means 2ⁿ is allowed. The constraint is a hint the problem already gave you (lesson 0.1).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Smaller, concrete example</span><span class="lz-d">Write a 4-element example and compute the answer BY HAND, for one position. Look at what you computed: which parts repeat across positions?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Name the brute force</span><span class="lz-d">Say it with its complexity, then point at the waste: "the inner loop recomputes the left part every time". The waste is where the trick lives.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Scan the toolbox</span><span class="lz-d">Go down the pattern map of lesson 0.2: sort? hash map? two pointers? prefix sums? stack? heap? binary search on the answer? Say the two most likely ones.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Ask for a hint — with your work attached</span><span class="lz-d">"I see each answer is a left part times a right part, but recomputing them is O(n²). Am I on the right track?" A specific question gets a small hint.</span></div>
</div>
<p>Moves 1–5 take about two minutes. If nothing has clicked by then, move 6 is not giving up — it is the efficient choice. Interviewers note the <em>size</em> of the hint you needed and what you did with it; a small hint used well costs far less than five minutes of silence, and five minutes of silence leaves them nothing to write at all.</p>
</div>
<div class="ml-vi">
<h3>Quy trình khi bí: sáu nước, theo thứ tự</h3>
<p>Ai cũng có lúc bí. Thứ người phỏng vấn nhìn là bạn làm gì trong hai phút tiếp theo. Hoảng trông như thế này: im lặng, rồi "sorry, em không biết". Có quy trình trông như thế này:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nói ra</span><span class="lz-d">"Let me think about this for a moment." (Cho em nghĩ một chút.) Bạn vừa mua được 20–30 giây im lặng hợp lệ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đọc lại ràng buộc</span><span class="lz-d">n ≤ 10⁵ nghĩa là O(n log n) hoặc O(n); n ≤ 20 nghĩa là 2ⁿ được phép. Ràng buộc là gợi ý mà chính đề đã cho bạn (bài 0.1).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ví dụ nhỏ hơn, cụ thể</span><span class="lz-d">Viết một ví dụ 4 phần tử và tính đáp án BẰNG TAY cho một vị trí. Nhìn vào cái mình vừa tính: phần nào lặp lại giữa các vị trí?</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Gọi tên vét cạn</span><span class="lz-d">Nói nó kèm độ phức tạp, rồi chỉ ra chỗ phí: "vòng trong tính lại phần bên trái mỗi lần". Chỗ phí là nơi mẹo đang trốn.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Lục hộp đồ nghề</span><span class="lz-d">Đi dọc bản đồ mẫu bài ở bài 0.2: sắp xếp? hash map? hai con trỏ? tổng tiền tố? stack? heap? nhị phân trên đáp án? Nói ra hai hướng khả dĩ nhất.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Xin gợi ý — kèm phần đã làm</span><span class="lz-d">"Em thấy mỗi đáp án là phần trái nhân phần phải, nhưng tính lại chúng tốn O(n²). Em đi đúng hướng chưa ạ?" Câu hỏi cụ thể thì nhận được gợi ý nhỏ.</span></div>
</div>
<p>Nước 1–5 mất khoảng hai phút. Nếu tới lúc đó vẫn chưa "sáng" ra, nước 6 không phải là bỏ cuộc — nó là lựa chọn hiệu quả. Người phỏng vấn ghi lại <em>độ lớn</em> của gợi ý bạn cần và việc bạn làm gì với nó; một gợi ý nhỏ được dùng tốt mất ít điểm hơn nhiều so với năm phút im lặng, mà năm phút im lặng thì họ chẳng có gì để ghi cả.</p>
<p>Liên hệ đời thật: đi thực tập, bạn sẽ bí hằng ngày — một lỗi build lạ, một API không chạy như tài liệu. Thực tập sinh được đánh giá cao không phải người không bao giờ hỏi, mà là người hỏi sau khi đã tự thử, và hỏi kèm bằng chứng: "em đã thử A và B, log ra thế này, em nghĩ là do C, anh xem giúp em hướng này đúng không". Quy trình sáu nước ở trên chính là thói quen đó, được tập trước trong 45 phút.</p>
</div>

<div class="ml-en">
<h3>Asking for a hint: bad, okay, good</h3>
<table>
<thead><tr><th>Quality</th><th>What you say</th><th>What the interviewer hears</th></tr></thead>
<tbody>
<tr><td>Bad</td><td>"I don't know. Can you tell me the answer?"</td><td>No attempt; they must give a big hint — or end the problem.</td></tr>
<tr><td>Bad</td><td>(silence for five minutes)</td><td>Nothing to score, nothing to help with.</td></tr>
<tr><td>Okay</td><td>"Could you give me a hint?"</td><td>Willing, but they have to guess where you are, so the hint may be bigger than needed.</td></tr>
<tr><td>Good</td><td>"I have a brute force in O(n²). The waste is recomputing the left part. I'm thinking of storing something, but I'm not sure what. Am I on the right track?"</td><td>Clear progress, a precise gap. They can answer with one sentence — the smallest hint possible.</td></tr>
<tr><td>Good</td><td>"I have two ideas, sorting or a hash map. I'm leaning towards the hash map because it keeps the order. Does that sound reasonable?"</td><td>Options + reasoning. Often the reply is just "yes, go on".</td></tr>
</tbody></table>
<p>And when the hint comes: <strong>repeat it in your own words and connect it</strong> — "So if I had the product of everything on the left for every index, that's like a prefix sum but with multiplication…" — then continue. Arguing with a hint, or ignoring it, is the most expensive mistake of the hour.</p>
</div>
<div class="ml-vi">
<h3>Xin gợi ý: tệ, tạm, tốt</h3>
<table>
<thead><tr><th>Mức</th><th>Bạn nói</th><th>Người phỏng vấn nghe thấy</th></tr></thead>
<tbody>
<tr><td>Tệ</td><td>"I don't know. Can you tell me the answer?" (Em không biết, anh/chị nói đáp án được không?)</td><td>Không hề thử; họ phải cho gợi ý lớn — hoặc chuyển bài.</td></tr>
<tr><td>Tệ</td><td>(im lặng năm phút)</td><td>Không có gì để chấm, không biết giúp từ đâu.</td></tr>
<tr><td>Tạm</td><td>"Could you give me a hint?" (Anh/chị gợi ý giúp em được không?)</td><td>Có thiện chí, nhưng họ phải đoán bạn đang ở đâu, nên gợi ý có thể to hơn mức cần.</td></tr>
<tr><td>Tốt</td><td>"I have a brute force in O(n²). The waste is recomputing the left part. I'm thinking of storing something, but I'm not sure what. Am I on the right track?" (Em có bản vét cạn O(n²). Chỗ phí là tính lại phần bên trái. Em đang nghĩ cách lưu lại gì đó mà chưa rõ lưu gì. Em đi đúng hướng chưa ạ?)</td><td>Tiến độ rõ, lỗ hổng chính xác. Họ trả lời được bằng một câu — gợi ý nhỏ nhất có thể.</td></tr>
<tr><td>Tốt</td><td>"I have two ideas, sorting or a hash map. I'm leaning towards the hash map because it keeps the order. Does that sound reasonable?" (Em có hai hướng… em nghiêng về hash map vì nó giữ thứ tự. Nghe có hợp lý không ạ?)</td><td>Có lựa chọn + lý do. Thường câu trả lời chỉ là "đúng rồi, làm tiếp đi".</td></tr>
</tbody></table>
<p>Và khi gợi ý tới: <strong>nhắc lại nó bằng lời của mình và nối nó vào bài</strong> — "Vậy nếu em có tích của mọi phần tử bên trái cho từng chỉ số, thì giống tổng tiền tố nhưng là phép nhân…" — rồi làm tiếp. Cãi lại gợi ý, hoặc lờ nó đi, là lỗi đắt nhất trong cả giờ phỏng vấn: người phỏng vấn đang cố giúp bạn qua, và họ ghi lại chuyện bạn có "nhận được góp ý" hay không — đúng thứ họ sẽ cần ở bạn khi làm chung.</p>
</div>

<div class="ml-en">
<h3>Conversation 1 — smooth: Longest Substring Without Repeating Characters (LC 3)</h3>
<p>You met this problem in lesson 2.2. Here the focus is not the algorithm but what is said, when, and why. Read the English version aloud — twice.</p>
${hoiThoai([
  ['I', 'Given a string, find the length of the longest substring without repeating characters.'],
  ['C', 'Let me restate it: a substring is contiguous, and inside it no character appears twice. I return only the length. Can the string be empty, and what characters can it contain?'],
  ['I', 'It can be empty. Letters, digits, symbols and spaces. Length up to 5 times ten to the fourth.'],
  ['N', 'Restate + two questions. "Contiguous" is the word that rules out subsequences; the size rules out O(n²) comfortably.'],
  ['C', 'Let me walk through "abcabcbb": "abc" has length 3, then the next a repeats. The answer is 3. For "bbbbb" it is 1, for the empty string 0. A tricky one is "abba": when the second a arrives, the old a is already outside my window, so I must not jump back.'],
  ['C', 'The brute force checks every substring and tests it for duplicates — O of n cubed, or n squared with a set. Too slow for five times ten to the fourth.'],
  ['C', 'Better: a sliding window. I extend the right end one character at a time and keep a map from each character to the last index where I saw it. If the new character was seen inside the window, I move the left end just past that old copy. Each index moves forward only, so it is O of n time, and the map is bounded by the alphabet. Shall I code it?'],
  ['I', 'Sounds good.'],
  ['C', '(coding) lastSeen maps character to index… The subtle part is this condition: I only jump if the previous index is at least left — that is the "abba" case. The window length is right minus left plus one.'],
  ['C', 'Testing "abba": right 0 and 1 give window "ab", best 2. At right 2, b was seen at 1, so left becomes 2. At right 3, a was seen at 0, which is before left, so left stays 2. Best stays 2. Correct. Empty string: the loop does not run, returns 0.'],
  ['N', 'The candidate tests the exact case the subtle condition exists for — the strongest possible test.'],
  ['C', 'Time O of n, space O of the alphabet size, at most n.'],
  ['I', 'What if I asked for the substring itself, not the length?'],
  ['C', 'I would also store the left index whenever best improves, and return the slice at the end. Same complexity.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>Kịch bản 1 — trơn tru: Longest Substring Without Repeating Characters (LC 3)</h3>
<p>Bạn đã gặp đề này ở bài 2.2. Ở đây trọng tâm không phải thuật toán mà là nói gì, lúc nào, vì sao. Bản tiếng Anh ở khối EN (bật tiếng Anh để đọc to — hai lần); dưới đây là cùng mạch bằng tiếng Việt, kèm câu tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho một chuỗi, tìm độ dài chuỗi con dài nhất không có ký tự lặp.'],
  ['C', 'Em nói lại nhé: chuỗi con là liên tiếp, và trong đó không ký tự nào xuất hiện hai lần. Em chỉ trả độ dài. Chuỗi có thể rỗng không ạ, và gồm những ký tự gì? <em>("Let me restate it… Can the string be empty?")</em>'],
  ['I', 'Có thể rỗng. Chữ, số, ký hiệu và dấu cách. Dài tới 5·10⁴.'],
  ['N', 'Nói lại đề + hai câu hỏi. "Liên tiếp" (contiguous) là chữ loại trừ dãy con không liền; kích thước cho biết O(n²) là sát nút.'],
  ['C', 'Em chạy tay "abcabcbb": "abc" dài 3, rồi chữ a kế tiếp bị lặp. Đáp án 3. "bbbbb" là 1, chuỗi rỗng là 0. Có một ca khó là "abba": khi chữ a thứ hai tới, chữ a cũ đã nằm ngoài cửa sổ rồi, nên em không được nhảy lùi. <em>("A tricky one is…")</em>'],
  ['C', 'Vét cạn là xét mọi chuỗi con rồi kiểm trùng — O(n³), hoặc O(n²) nếu dùng set. Quá chậm với 5·10⁴. <em>("The brute force… too slow for…")</em>'],
  ['C', 'Tốt hơn: cửa sổ trượt. Em kéo đầu phải từng ký tự một và giữ một map từ ký tự tới vị trí gần nhất em thấy nó. Nếu ký tự mới đã xuất hiện bên trong cửa sổ, em dời đầu trái tới ngay sau bản cũ. Mỗi chỉ số chỉ đi tới, nên O(n) thời gian, map bị chặn bởi bảng chữ. Em code nhé? <em>("Shall I code it?")</em>'],
  ['I', 'Ổn đấy.'],
  ['C', '(vừa code) lastSeen ánh xạ ký tự tới chỉ số… Chỗ tinh tế là điều kiện này: em chỉ nhảy khi chỉ số cũ lớn hơn hoặc bằng left — đó là ca "abba". Độ dài cửa sổ là right trừ left cộng một. <em>("The subtle part is this condition…")</em>'],
  ['C', 'Test "abba": right 0 và 1 cho cửa sổ "ab", best 2. Ở right 2, b từng thấy ở 1, nên left thành 2. Ở right 3, a từng thấy ở 0, nằm trước left, nên left giữ 2. Best vẫn 2. Đúng. Chuỗi rỗng: vòng không chạy, trả 0.'],
  ['N', 'Ứng viên test đúng cái ca mà điều kiện tinh tế sinh ra để xử lý — phép test mạnh nhất có thể.'],
  ['C', 'Thời gian O(n), bộ nhớ O(cỡ bảng chữ), tối đa n.'],
  ['I', 'Nếu anh hỏi chính chuỗi con chứ không phải độ dài thì sao?'],
  ['C', 'Em lưu thêm vị trí left mỗi lần best tăng, cuối cùng cắt chuỗi ra trả về. Độ phức tạp không đổi.'],
], 'vi')}
</div>
${maHai('ch10/b1/longest-substring.ts', 'ch10/b1/LongestSubstring.java', { vung: 'giai' })}
${ketQua('ch10/b1/longest-substring.ts')}
${ketQua('ch10/b1/LongestSubstring.java')}
<div class="ml-en">
<p>The code is exactly what was narrated: one map, one condition, one length formula. Notice "abba" → 2 in the output — the case the candidate named before coding. If you remove <code>prev &gt;= left</code>, "abba" returns 3 (left jumps back to 1 at the last step) — the classic bug of this problem, caught by the example chosen in the second turn.</p>
</div>
<div class="ml-vi">
<p>Code đúng như những gì đã thuật: một map, một điều kiện, một công thức độ dài. Để ý "abba" → 2 trong output — đúng ca ứng viên đã gọi tên trước khi code. Bỏ điều kiện <code>prev &gt;= left</code> đi thì "abba" trả 3 (ở bước cuối left nhảy lùi về 1) — lỗi kinh điển của đề này, bị bắt bởi chính ví dụ được chọn ở lượt nói thứ hai.</p>
${lienKet({ bai: 'dsa-2-2-cua-so', title: '2.2 — Cửa sổ trượt', sub: 'Bảng vết LC 3 từng bước, bẫy thiếu max(l, last + 1)', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>Conversation 2 — stuck, then rescued by a good hint request: Product of Array Except Self (LC 238)</h3>
<p>This is the conversation to study most. The candidate's first idea is forbidden, the second is too slow, and they get stuck — then follow the protocol, ask a precise question, and finish strongly.</p>
${hoiThoai([
  ['I', 'Return an array where each position holds the product of all the other elements. Do not use division, and aim for O(n).'],
  ['C', 'Let me make sure: for [1, 2, 3, 4] the answer is [24, 12, 8, 6]. Can there be zeros or negative numbers? Does the product fit in a 32-bit integer?'],
  ['I', 'Zeros and negatives are possible. Any product fits in 32 bits.'],
  ['C', 'My first thought is the total product divided by each element — but you said no division, and it breaks with a zero anyway: zero divided by zero. So the honest brute force is: for each i, multiply everything except i. That is O of n squared.'],
  ['N', 'The candidate names the forbidden idea AND why it fails — a zero — showing they understand the constraint, not just obey it.'],
  ['C', 'Let me think about this for a moment.'],
  ['N', 'Move 1 of the protocol: silence is now legitimate.'],
  ['C', 'Small example, index 2 of [1, 2, 3, 4]: the answer is 1 times 2, times 4. That is the part on the left, times the part on the right. For index 1 it is 1, times 3 times 4. The right part 3 times 4 was also inside the answer for index 0… so the brute force recomputes the same left and right products again and again.'],
  ['N', 'Moves 3 and 4: a concrete example by hand, and the waste named precisely.'],
  ['C', 'I am stuck on how to reuse them without division. I see each answer is a left product times a right product, but if I compute both for every index, that is still n squared. Am I on the right track, or is there a structure I should be reusing?'],
  ['N', 'Move 6, the good way: what I have, where exactly I am stuck, a yes/no question.'],
  ['I', 'You are on the right track. What if you already knew the product of everything to the left of i, for every i?'],
  ['C', 'Oh — that is a prefix product, like a prefix sum but with multiplication. One pass left to right builds it, one pass right to left can multiply in the right part with a single running variable. O of n time, and constant extra space if I write directly into the answer array. Shall I code it?'],
  ['N', 'Repeat the hint in your own words, connect it to a known pattern, give the new complexity — then ask.'],
  ['I', 'Go ahead.'],
  ['C', '(coding) left is the product of everything before i; I write it into answer before multiplying nums of i in, so position i never includes itself. Then the same from the right.'],
  ['C', 'Testing [1, 2, 3, 4]: after the first pass answer is [1, 1, 2, 6], after the second [24, 12, 8, 6]. With a zero, [1, 2, 0, 4]: only index 2 gets a non-zero value, 8. Correct, and no division anywhere.'],
  ['I', 'What if the product could overflow?'],
  ['C', 'Then I would use 64-bit longs in Java, or BigInt in JavaScript, and mention the cost. With your guarantee of 32 bits, int is enough.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>Kịch bản 2 — bí, rồi được cứu nhờ xin gợi ý đúng cách: Product of Array Except Self (LC 238)</h3>
<p>Đây là kịch bản nên học kỹ nhất. Ý đầu tiên của ứng viên bị cấm, ý thứ hai quá chậm, và họ bí — rồi đi theo quy trình, hỏi một câu chính xác, và kết thúc chắc chắn.</p>
${hoiThoai([
  ['I', 'Trả về một mảng mà mỗi vị trí là tích của mọi phần tử còn lại. Không dùng phép chia, nhắm tới O(n).'],
  ['C', 'Em kiểm lại: với [1, 2, 3, 4] đáp án là [24, 12, 8, 6]. Có thể có số 0 hay số âm không ạ? Tích có vừa số nguyên 32 bit không? <em>("Can there be zeros? Does the product fit in 32 bits?")</em>'],
  ['I', 'Có thể có 0 và số âm. Tích nào cũng vừa 32 bit.'],
  ['C', 'Ý đầu tiên của em là lấy tích tổng chia cho từng phần tử — nhưng anh/chị nói không dùng phép chia, mà gặp số 0 nó cũng hỏng: 0 chia 0. Nên vét cạn thật thà là: với mỗi i, nhân mọi phần tử trừ i. Như vậy là O(n²).'],
  ['N', 'Ứng viên gọi tên ý bị cấm VÀ lý do nó hỏng — số 0 — cho thấy họ hiểu ràng buộc chứ không chỉ tuân theo.'],
  ['C', 'Cho em nghĩ một chút ạ. <em>("Let me think about this for a moment.")</em>'],
  ['N', 'Nước 1 của quy trình: từ giờ im lặng là hợp lệ.'],
  ['C', 'Ví dụ nhỏ, chỉ số 2 của [1, 2, 3, 4]: đáp án là 1 nhân 2, nhân 4. Tức là phần bên trái nhân phần bên phải. Chỉ số 1 là 1, nhân 3 nhân 4. Phần phải 3 nhân 4 cũng nằm trong đáp án của chỉ số 0… vậy vét cạn đang tính lại cùng những tích trái và phải hết lần này tới lần khác.'],
  ['N', 'Nước 3 và 4: một ví dụ cụ thể làm bằng tay, và gọi tên chính xác chỗ phí.'],
  ['C', 'Em đang kẹt ở chỗ làm sao dùng lại chúng mà không chia. Em thấy mỗi đáp án là tích trái nhân tích phải, nhưng nếu tính cả hai cho từng chỉ số thì vẫn là n². Em đi đúng hướng chưa ạ, hay có cấu trúc nào em nên dùng lại? <em>("Am I on the right track, or is there a structure I should be reusing?")</em>'],
  ['N', 'Nước 6, đúng cách: mình đã có gì, kẹt chính xác ở đâu, một câu hỏi có/không.'],
  ['I', 'Đúng hướng rồi. Nếu em đã biết sẵn tích của mọi phần tử bên trái i, cho mọi i, thì sao?'],
  ['C', 'À — đó là tích tiền tố, giống tổng tiền tố nhưng là phép nhân. Một lượt trái sang phải dựng nó, một lượt phải sang trái nhân phần bên phải vào bằng một biến chạy. O(n) thời gian, và bộ nhớ phụ hằng số nếu em ghi thẳng vào mảng đáp án. Em code nhé?'],
  ['N', 'Nhắc lại gợi ý bằng lời của mình, nối nó với một mẫu đã biết, nói độ phức tạp mới — rồi mới hỏi.'],
  ['I', 'Làm đi.'],
  ['C', '(vừa code) left là tích mọi phần tử trước i; em ghi nó vào answer TRƯỚC khi nhân nums[i] vào, nên vị trí i không bao giờ tính cả chính nó. Rồi làm y vậy từ bên phải.'],
  ['C', 'Test [1, 2, 3, 4]: sau lượt một answer là [1, 1, 2, 6], sau lượt hai là [24, 12, 8, 6]. Có số 0, [1, 2, 0, 4]: chỉ chỉ số 2 nhận giá trị khác 0, là 8. Đúng, và không có phép chia nào.'],
  ['I', 'Nếu tích có thể tràn số thì sao?'],
  ['C', 'Khi đó em dùng long 64 bit trong Java, hoặc BigInt trong JavaScript, và nói rõ cái giá phải trả. Với đảm bảo 32 bit anh/chị đưa ra thì int là đủ.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Why the first idea had to die: division, run for real</h3>
<p>The candidate claimed "division breaks with a zero". Claims in an interview should be things you have seen happen. Here it is in both languages — JavaScript silently produces <code>NaN</code>, Java throws:</p>
</div>
<div class="ml-vi">
<h3>Vì sao ý đầu tiên phải bỏ: phép chia, chạy thật</h3>
<p>Ứng viên nói "phép chia hỏng khi có số 0". Điều bạn khẳng định khi phỏng vấn nên là thứ bạn đã thấy xảy ra. Đây là nó ở cả hai ngôn ngữ — JavaScript lặng lẽ cho ra <code>NaN</code> (not a number — không phải số), Java thì ném ngoại lệ:</p>
</div>
${ma('ch10/b1/chia-bay.ts', { vung: 'chia', nhan: 'TypeScript — the forbidden idea' })}
${ketQua('ch10/b1/chia-bay.ts')}
${ketQua('ch10/b1/ChiaBay.java')}
<div class="ml-en">
<p>Read the second line: for <code>[1, 2, 0, 4]</code> the total is 0, so every non-zero position gets 0 / x = 0 (correct by luck) and the zero position gets 0 / 0 = <code>NaN</code> instead of 8. With two zeros, <code>[0, 2, 0]</code>, two positions become <code>NaN</code>. JavaScript did not crash — it returned garbage, which on an OA means a silent Wrong Answer. Java's integer division throws <code>ArithmeticException: / by zero</code>, which at least tells you where.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng thứ hai: với <code>[1, 2, 0, 4]</code> tích tổng là 0, nên mọi vị trí khác 0 nhận 0 / x = 0 (đúng nhờ may), còn vị trí số 0 nhận 0 / 0 = <code>NaN</code> thay vì 8. Có hai số 0, <code>[0, 2, 0]</code>, hai vị trí thành <code>NaN</code>. JavaScript không sập — nó trả về rác, mà trên bài OA thì đó là một Wrong Answer (sai đáp án) câm lặng. Phép chia số nguyên của Java ném <code>ArithmeticException: / by zero</code>, ít ra còn chỉ cho bạn chỗ hỏng.</p>
</div>

<div class="ml-en">
<h3>The solution the hint unlocked</h3>
</div>
<div class="ml-vi">
<h3>Lời giải mà gợi ý mở ra</h3>
</div>
${maHai('ch10/b1/product-except-self.ts', 'ch10/b1/ProductExceptSelf.java', { vung: 'giai' })}
${ketQua('ch10/b1/product-except-self.ts')}
${ketQua('ch10/b1/ProductExceptSelf.java')}
<div class="ml-en">
<p>The state after every step, produced by running the algorithm on <code>[1, 2, 3, 4]</code>. Red = the current index; blue = the elements already folded into the running product (left side in pass 1, right side in pass 2); green = the cell just written.</p>
</div>
<div class="ml-vi">
<p>Trạng thái sau từng bước, sinh ra bằng cách chạy thuật toán thật trên <code>[1, 2, 3, 4]</code>. Đỏ = chỉ số đang xét; xanh dương = các phần tử đã được gộp vào tích đang chạy (bên trái ở lượt 1, bên phải ở lượt 2); xanh lá = ô vừa ghi.</p>
</div>
${BANG}
<div class="ml-en">
<p>Eight rows: four for the left pass, four for the right pass. After row 4, <code>answer</code> holds exactly the left products [1, 1, 2, 6] that the candidate said aloud; rows 5–8 multiply in 1, 4, 12, 24 from the right and reach [24, 12, 8, 6]. Notice the order inside each step: <em>write first, then multiply <code>nums[i]</code> in</em> — the same "check before insert" discipline as Two Sum in lesson 1.1. That one ordering decision is the sentence worth saying while coding.</p>
${moPhong('ch10/b1/product.sim.js', 'en', 'LC 238 — two passes, no division', 'Watch the left products fill the answer, then the right products multiply in; the log narrates each step.')}
</div>
<div class="ml-vi">
<p>Tám dòng: bốn cho lượt trái, bốn cho lượt phải. Sau dòng 4, <code>answer</code> giữ đúng các tích bên trái [1, 1, 2, 6] mà ứng viên đã nói to; dòng 5–8 nhân lần lượt 1, 4, 12, 24 từ bên phải vào và ra [24, 12, 8, 6]. Để ý thứ tự trong mỗi bước: <em>ghi trước, rồi mới nhân <code>nums[i]</code> vào</em> — cùng kỷ luật "tra trước, cất sau" như Two Sum ở bài 1.1. Đúng quyết định thứ tự đó là câu đáng nói to khi code.</p>
${moPhong('ch10/b1/product.sim.js', 'vi', 'LC 238 — hai lượt, không phép chia', 'Xem tích bên trái lấp đầy answer, rồi tích bên phải nhân vào; nhật ký thuật lại từng bước.')}
${lienKet({ bai: 'dsa-1-2-prefix-sum', title: '1.2 — Tổng tiền tố', sub: 'Gợi ý "tích bên trái" chính là tổng tiền tố đổi phép cộng thành phép nhân', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>Interviews in Vietnamese at a local company</h3>
<p>Many companies in Vietnam interview interns in Vietnamese; teams that work with foreign clients often add an English round or switch language mid-interview. In a Vietnamese interview the technical terms usually <strong>stay in English</strong>: people say "hash map", "stack", "queue", "binary search", "brute force", "edge case", "deploy", "merge", not forced translations. Some Vietnamese terms are common and fine: arrays, pointers, recursion, "traversing", "complexity", and competitive-programming slang for binary search ("cutting in half"). Practical rules:</p>
<ul>
<li><strong>Use the interviewer's words.</strong> If they say "array", you say "array"; if they use the Vietnamese word, follow them. Mirroring reduces friction.</li>
<li><strong>Read complexity the local way</strong> (third column of the symbols table above) — and do not translate "O" into anything else.</li>
<li><strong>Polite forms matter.</strong> Address the interviewer as an older sibling ("anh/chị") and yourself as the younger ("em"); end questions with the polite particle. It is the Vietnamese equivalent of "Could you…".</li>
<li><strong>The structure is identical.</strong> Restate, examples, brute force, optimise, ask before coding, narrate, test, complexity. Only the language changes.</li>
<li><strong>Be ready to switch.</strong> "Can we continue in English?" can come at any moment at outsourcing companies; the 30 phrases are your safety net.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Phỏng vấn bằng tiếng Việt ở công ty trong nước</h3>
<p>Nhiều công ty ở Việt Nam phỏng vấn thực tập sinh bằng tiếng Việt; các nhóm làm cho khách nước ngoài thường thêm một vòng tiếng Anh hoặc đổi ngôn ngữ giữa chừng. Khi phỏng vấn bằng tiếng Việt, thuật ngữ kỹ thuật thường <strong>giữ nguyên tiếng Anh</strong>: người ta nói "hash map", "stack", "queue", "binary search", "brute force", "edge case", "deploy", "merge" — không dịch gượng. Một số từ Việt rất phổ biến và dùng thoải mái: mảng, con trỏ, đệ quy, duyệt, độ phức tạp, quy hoạch động, tham lam, và tiếng lóng dân thi lập trình "chặt nhị phân". Mấy luật thực dụng:</p>
<ul>
<li><strong>Dùng từ của người phỏng vấn.</strong> Họ nói "array" thì bạn nói "array"; họ nói "mảng" thì theo "mảng". Nói giống nhau giảm ma sát.</li>
<li><strong>Đọc độ phức tạp kiểu trong nước</strong> (cột thứ ba của bảng ký hiệu ở trên): "ô en", "ô en lốc en", "ô en bình phương" — đừng dịch chữ "O" thành gì khác.</li>
<li><strong>Xưng hô.</strong> "Em" – "anh/chị", cuối câu hỏi có "ạ": "Anh cho em hỏi mảng có thể rỗng không ạ?". Đó là bản tiếng Việt của "Could you…".</li>
<li><strong>Cấu trúc y hệt.</strong> Nói lại đề, ví dụ, vét cạn, tối ưu, xin phép code, thuật lại, test, độ phức tạp. Chỉ ngôn ngữ đổi.</li>
<li><strong>Sẵn sàng đổi ngôn ngữ.</strong> Câu "Mình chuyển qua tiếng Anh nhé?" có thể tới bất cứ lúc nào ở công ty outsource; 30 câu ở trên là lưới an toàn của bạn.</li>
</ul>
<p>Ví dụ một đoạn mở đầu "chuẩn" bằng tiếng Việt: <em>"Em nói lại đề nhé: cho mảng số nguyên, tìm hai phần tử có tổng bằng target, trả về chỉ số. Anh cho em hỏi mảng có phần tử trùng không ạ, và luôn có đúng một đáp án chứ ạ? … Cách brute force là duyệt mọi cặp, ô en bình phương. Em thấy vòng trong chỉ đang tìm target trừ phần tử hiện tại, nên em dùng hash map lưu những số đã gặp, còn ô en thời gian, ô en bộ nhớ. Em code bản này nhé?"</em> — trộn tiếng Anh đúng chỗ, câu ngắn, có lý do, có xin phép.</p>
</div>

<div class="ml-en">
<h3>Where this habit lives at work</h3>
<ul>
<li><strong>Daily stand-up.</strong> "Yesterday I…, today I…, I'm blocked on…" is the stuck protocol in 30 seconds: say where you are and the precise gap, so someone can help with one sentence.</li>
<li><strong>Pull request descriptions and code review.</strong> A good PR description is "thinking out loud" written down: the problem, the approach, the trade-off, how it was tested. Reviewers who can follow your decisions approve faster.</li>
<li><strong>Bug reports in this very repository.</strong> The project behind this website keeps a bug log, <code>docs/so-loi.md</code>, with a fixed five-line entry: symptom · root cause (file and line) · fix (commit) · impact · lesson. That is exactly phrase 26 — "I found a bug: symptom, cause, fix" — as a team habit.</li>
<li><strong>Asking seniors.</strong> "I tried A and B, the log says X, I think it's C — am I on the right track?" is phrase 22. Seniors answer these in a minute; "it doesn't work, help" costs them half an hour.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Thói quen này sống ở đâu khi đi làm</h3>
<ul>
<li><strong>Họp đứng hằng ngày (daily stand-up).</strong> "Hôm qua em…, hôm nay em…, em đang kẹt ở…" chính là quy trình khi bí rút gọn còn 30 giây: nói mình ở đâu và lỗ hổng chính xác là gì, để người khác giúp được bằng một câu.</li>
<li><strong>Mô tả pull request và code review.</strong> Một mô tả PR tốt là "nghĩ thành tiếng" viết ra giấy: vấn đề, hướng giải, sự đánh đổi, đã test thế nào. Người review theo được quyết định của bạn thì duyệt nhanh hơn.</li>
<li><strong>Báo lỗi ngay trong repo này.</strong> Dự án đứng sau website bạn đang học giữ một sổ lỗi, <code>docs/so-loi.md</code>, mỗi mục đúng năm dòng cố định: triệu chứng · nguyên nhân gốc (tệp và dòng) · cách sửa (commit) · ảnh hưởng · bài học. Đó chính là câu 26 — "I found a bug: triệu chứng, nguyên nhân, cách sửa" — thành thói quen của cả nhóm.</li>
<li><strong>Hỏi người đi trước.</strong> "Em đã thử A và B, log báo X, em nghĩ là do C — em đi đúng hướng chưa ạ?" là câu 22. Anh chị senior trả lời câu kiểu này trong một phút; còn "nó không chạy, anh giúp em với" tốn của họ nửa tiếng. Ở đồ án SWP391 cũng vậy: nhắn nhóm kèm ảnh log và điều đã thử, đừng chỉ nhắn "lỗi rồi".</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: the "interview" that is really an information grab</h3>
<p>Talking freely is good — about <em>your</em> reasoning. Social engineers exploit the same eagerness. Fake recruiters and fake "technical interviews" ask candidates to "walk through the architecture of your current company's system", share internal documents "as a portfolio", or send identity papers and bank details "for onboarding" before any contract exists. Cybersecurity firms have documented recruitment scams that impersonate well-known brands to do exactly this. Rules: explain the <em>ideas</em> of past work, never internal names, credentials, customer data or code you do not own; never send ID or bank information before a signed offer from a verified company address; and if an interviewer pushes for confidential details, saying "I'm not able to share that, but I can describe the approach" is itself a good professional answer.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: "buổi phỏng vấn" thật ra là để moi thông tin</h3>
<p>Nói nhiều là tốt — khi nói về cách <em>bạn</em> suy luận. Kẻ lừa đảo kiểu social engineering (lừa bằng tâm lý) lợi dụng đúng sự nhiệt tình đó. Nhà tuyển dụng giả và "phỏng vấn kỹ thuật" giả đòi ứng viên "trình bày kiến trúc hệ thống ở công ty hiện tại", gửi tài liệu nội bộ "làm portfolio", hoặc gửi CCCD và số tài khoản "để làm thủ tục" khi chưa có hợp đồng nào. Các hãng bảo mật đã ghi nhận những chiến dịch lừa tuyển dụng mạo danh thương hiệu lớn để làm đúng việc này. Luật: kể <em>ý tưởng</em> của việc đã làm, không bao giờ kể tên nội bộ, mật khẩu, dữ liệu khách hàng hay code không thuộc về bạn; không gửi giấy tờ tuỳ thân hay thông tin ngân hàng trước khi có offer ký từ một địa chỉ công ty đã kiểm chứng; và nếu người phỏng vấn ép hỏi chi tiết mật, câu "Em không chia sẻ được phần đó, nhưng em có thể mô tả cách tiếp cận" (I'm not able to share that, but I can describe the approach) bản thân nó đã là một câu trả lời chuyên nghiệp được điểm. Bài 10.4 nói tiếp về link bài test online giả.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Reading the code instead of explaining it.</strong></p><p>"For int i equals zero, i less than n, i plus plus, if nums of i…" — thirty seconds of words, zero information. Say the intention ("I scan once and keep the last index of each character") and only read a line aloud when it is the subtle one.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Saying "yes" when you did not understand the question.</strong></p><p>Weak English makes this tempting, and it is the most expensive habit: you then solve the wrong problem for 20 minutes. Use the rescue phrases: "Sorry, could you repeat the last part?", "Could you rephrase that?", "Do you mean the indices or the values?". Interviewers expect these; nobody deducts points for them.</p></div>
<h3>Common communication mistakes</h3>
<ul>
<li>Long silences (over a minute) with no "let me think" first.</li>
<li>Filler without content — "hmm… so… yeah…" in a loop. A short silence is better than noise.</li>
<li>Apologising repeatedly ("sorry, sorry, I'm bad at this") — it lowers the interviewer's confidence in you without adding anything.</li>
<li>Giving a complexity without a reason ("I think it's O(n)") — always add "because…".</li>
<li>Arguing with a hint, or ignoring it and continuing your own path.</li>
<li>Saying "done" without testing — the next lesson (10.3) is about exactly this.</li>
</ul>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Đọc code thay vì giải thích.</strong></p><p>"For int i bằng không, i nhỏ hơn n, i cộng cộng, if nums của i…" — ba mươi giây toàn chữ, không một chút thông tin. Hãy nói ý định ("em quét một lượt và giữ vị trí gần nhất của mỗi ký tự") và chỉ đọc to một dòng khi đó là dòng tinh tế.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Nói "yes" khi không hiểu câu hỏi.</strong></p><p>Yếu tiếng Anh thì rất dễ làm vậy, và đó là thói quen đắt nhất: sau đó bạn giải sai đề suốt 20 phút. Dùng các câu cứu hộ: "Sorry, could you repeat the last part?" (Xin lỗi, anh/chị nhắc lại đoạn cuối được không?), "Could you rephrase that?" (Anh/chị nói cách khác được không?), "Do you mean the indices or the values?" (Ý anh/chị là chỉ số hay giá trị?). Người phỏng vấn chờ sẵn những câu này; không ai trừ điểm vì chúng.</p></div>
<h3>Lỗi giao tiếp hay gặp</h3>
<ul>
<li>Im lặng lâu (quá một phút) mà không có câu "cho em nghĩ một chút" trước.</li>
<li>Nói đệm không nội dung — "ừm… thì… kiểu…" lặp đi lặp lại. Im ngắn còn hơn nói ồn.</li>
<li>Xin lỗi liên tục ("sorry, sorry, em kém phần này") — làm người phỏng vấn bớt tin bạn mà không thêm được gì.</li>
<li>Nói độ phức tạp không kèm lý do ("em nghĩ là O(n)") — luôn thêm "vì…".</li>
<li>Cãi gợi ý, hoặc lờ nó đi rồi tiếp tục đường của mình.</li>
<li>Nói "xong rồi ạ" mà chưa test — bài kế tiếp (10.3) nói đúng chuyện này.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems — solve them OUT LOUD</h3>
${bangDe(DE, 'en')}
<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Read the 30 phrases aloud once. Then pick phrases 1, 7, 8, 13, 24, 27 and write them on a card.</li>
<li>Record yourself (phone) solving LC 238 from a blank file, in English, using only the card. Follow conversation 2, but pretend nobody gives you the hint: run the six-move protocol aloud.</li>
<li>Listen back. Count (a) silences longer than 30 seconds, (b) times you read code instead of explaining, (c) whether you said time AND space at the end.</li>
<li>Repeat with LC 3 in Vietnamese, as if at a local company, reading complexities the local way.</li>
</ol>
<p><strong>Done when:</strong> two recordings exist, LC 238 and LC 3 are accepted, and your three counts are written in the error log (target next week: (a) = 0, (b) ≤ 1, (c) = yes).</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">thinking out loud</span><span class="v">Saying decisions and reasons while you work — not reading the code.</span></div>
  <div class="kv"><span class="k">restate</span><span class="v">Say the problem again in your own words to confirm understanding.</span></div>
  <div class="kv"><span class="k">bottleneck</span><span class="v">The part of the solution that dominates the cost; where to optimise.</span></div>
  <div class="kv"><span class="k">trade-off</span><span class="v">What you pay for a gain (memory for time, simplicity for speed).</span></div>
  <div class="kv"><span class="k">hint</span><span class="v">A nudge from the interviewer; its size is noted, using it well scores.</span></div>
  <div class="kv"><span class="k">prefix product</span><span class="v">Product of all elements before i, built in one pass — the multiplication twin of prefix sums.</span></div>
  <div class="kv"><span class="k">shadowing</span><span class="v">Speaking along right after a recording, same rhythm — the fastest pronunciation drill.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Talk decisions and reasons, one sentence per decision, before you type it.</li>
<li>Always say: the brute force with its complexity, the one subtle decision, the final time and space.</li>
<li>Thirty phrases across eleven phases cover a whole interview; learn them as templates.</li>
<li>Stuck protocol: say it, re-read constraints, smaller example, name the brute force and its waste, scan the toolbox, ask a precise question.</li>
<li>A good hint request shows your work and the exact gap; repeat the hint in your own words and connect it.</li>
<li>In Vietnamese interviews, terms stay in English, structure stays the same.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview techniques', 'Thinking out loud, asking for hints, what to do when stuck', 'https://www.techinterviewhandbook.org/coding-interview-techniques/')}
${nguon('📗', 'Tech Interview Handbook — questions to ask at the end', 'Good final questions for engineers and managers', 'https://www.techinterviewhandbook.org/final-questions/')}
</div>
<div class="ml-vi">
<h3>Đề luyện — giải và NÓI TO</h3>
${bangDe(DE, 'vi')}
<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Đọc to 30 câu một lượt. Rồi chọn câu 1, 7, 8, 13, 24, 27 chép ra một tấm thẻ.</li>
<li>Ghi âm (điện thoại) chính mình giải LC 238 từ tệp trắng, bằng tiếng Anh, chỉ nhìn tấm thẻ. Đi theo kịch bản 2, nhưng giả sử không ai cho gợi ý: chạy to quy trình sáu nước.</li>
<li>Nghe lại. Đếm (a) số lần im lặng quá 30 giây, (b) số lần đọc code thay vì giải thích, (c) cuối cùng có nói cả thời gian LẪN bộ nhớ không.</li>
<li>Làm lại với LC 3 bằng tiếng Việt, như đang phỏng vấn ở công ty trong nước, đọc độ phức tạp kiểu "ô en".</li>
</ol>
<p><strong>Đạt khi:</strong> có hai bản ghi âm, LC 238 và LC 3 đã Accepted, và ba con số đếm được ghi vào sổ lỗi (đích tuần sau: (a) = 0, (b) ≤ 1, (c) = có).</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">thinking out loud (nghĩ thành tiếng)</span><span class="v">Nói ra quyết định và lý do trong lúc làm — không phải đọc lại code.</span></div>
  <div class="kv"><span class="k">restate (nói lại đề)</span><span class="v">Diễn đạt lại đề bằng lời của mình để xác nhận đã hiểu đúng.</span></div>
  <div class="kv"><span class="k">bottleneck (điểm nghẽn)</span><span class="v">Phần chiếm phần lớn chi phí của lời giải; chỗ cần tối ưu.</span></div>
  <div class="kv"><span class="k">trade-off (sự đánh đổi)</span><span class="v">Cái phải trả cho một cái lợi (bộ nhớ đổi lấy thời gian, đơn giản đổi lấy tốc độ).</span></div>
  <div class="kv"><span class="k">hint (gợi ý)</span><span class="v">Cú hích từ người phỏng vấn; độ lớn của nó được ghi lại, dùng tốt thì được điểm.</span></div>
  <div class="kv"><span class="k">prefix product (tích tiền tố)</span><span class="v">Tích mọi phần tử trước i, dựng trong một lượt — anh em sinh đôi phép nhân của tổng tiền tố.</span></div>
  <div class="kv"><span class="k">shadowing (nói nhại theo)</span><span class="v">Nói đè ngay sau một bản ghi, cùng nhịp — cách luyện phát âm nhanh nhất.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Nói quyết định và lý do, mỗi quyết định một câu, nói trước khi gõ.</li>
<li>Luôn nói: vét cạn kèm độ phức tạp, đúng một quyết định tinh tế, thời gian và bộ nhớ cuối cùng.</li>
<li>Ba mươi câu trải mười một pha phủ cả buổi phỏng vấn; học như học khuôn.</li>
<li>Quy trình khi bí: nói ra, đọc lại ràng buộc, ví dụ nhỏ hơn, gọi tên vét cạn và chỗ phí, lục hộp đồ nghề, hỏi một câu chính xác.</li>
<li>Xin gợi ý tốt là cho thấy phần đã làm và lỗ hổng chính xác; nhắc lại gợi ý bằng lời mình rồi nối vào bài.</li>
<li>Phỏng vấn bằng tiếng Việt: thuật ngữ giữ tiếng Anh, cấu trúc giữ nguyên.</li>
</ul>
${nguon('📗', 'Tech Interview Handbook — coding interview techniques', 'Nghĩ thành tiếng, xin gợi ý, làm gì khi bí (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-techniques/')}
${nguon('📗', 'Tech Interview Handbook — câu hỏi cuối buổi', 'Những câu nên hỏi lại kỹ sư và quản lý (tiếng Anh)', 'https://www.techinterviewhandbook.org/final-questions/')}
</div>
`,
};
