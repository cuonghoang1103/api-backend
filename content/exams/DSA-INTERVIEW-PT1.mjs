/**
 * Coding Interview Prep — Progress Test 1: Mục 0 → Chương 3 (độ phức tạp & khung giải đề, mảng và băm, hai con trỏ
 * và cửa sổ trượt, stack/queue/danh sách liên kết). 24 câu trắc nghiệm + 2 câu lập trình JavaScript.
 *
 * Đề tự soạn, bám `content/courses/dsa-interview/s00…s03`; mọi kết quả "in ra gì" và số đo lấy nguyên từ bài học.
 * Hai câu lập trình (tổng tiền tố + map đếm; stack đơn điệu) đã đối chiếu với bản vét cạn trên 300 đầu vào
 * ngẫu nhiên (0 khác biệt); mỗi câu có ca lớn n = 2·10⁵ sinh bằng Park–Miller.
 * Phân bố: M0 ×4 · C1 ×7 · C2 ×7 · C3 ×6. Kiểm: node scripts/exam-check.mjs content/exams/DSA-INTERVIEW-PT1.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DSA-INTERVIEW-PT1.mjs --apply
 */
import { B, c, Q, codeQ, starter, PARK, ptInstructions } from './_lib/dsa-exam-kit.mjs';

const C1_STARTER = starter({
  head: `
// Đồng hồ điện của phòng máy ghi mỗi giờ một số kWh chênh lệch so với định mức (có thể âm).
// Đếm số đoạn giờ LIÊN TIẾP (khác rỗng) có tổng ĐÚNG BẰNG k.  1 ≤ n ≤ 2·10⁵ · -1000 ≤ nums[i] ≤ 1000 · |k| ≤ 10⁷`,
  stub: `
function countSumK(nums, k) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [[1, 2, -1, 3, -2, 2], 3],
  [[1, 1, 1], 2],
  [[0, 0, 0], 0],
  [[3], 3],
  [[-1, -1, 1], 0],
  [[5, -5, 5, -5], 0],
];
for (const [nums, k] of cases) console.log(JSON.stringify(nums) + ' k=' + k + ' -> ' + countSumK(nums, k));
const r = park(560);
const big = Array.from({ length: 200000 }, () => (r() % 21) - 10);
console.log('large n=200000 k=7 -> ' + countSumK(big, 7));`,
});
const C1_SOLUTION = `// O(n) thời gian, O(n) bộ nhớ.
// Đoạn (i, j] có tổng k ⇔ prefix[j] − prefix[i] = k. Duyệt một lượt, đếm xem prefix − k đã xuất hiện bao nhiêu lần.
// Map phải khởi đầu {0: 1} (tiền tố rỗng) — thiếu nó thì mọi đoạn bắt đầu ở chỉ số 0 bị bỏ sót (bài 1.2).
// Tra TRƯỚC rồi mới ghi: ghi trước thì với k = 0 mỗi tiền tố tự ghép với chính nó.
function countSumK(nums, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}`;

const C2_STARTER = starter({
  head: `
// Dãy toà nhà trên một con phố, heights[i] là chiều cao toà i (từ trái sang phải).
// Với mỗi toà, trả về CHỈ SỐ toà gần nhất bên phải CAO HƠN HẲN nó, hoặc -1 nếu không có.  1 ≤ n ≤ 2·10⁵`,
  stub: `
function nextTaller(heights) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [30, 60, 90, 80, 70, 100],
  [5, 5, 5],
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [2, 1, 2, 3],
  [7],
];
for (const h of cases) console.log(JSON.stringify(h) + ' -> ' + JSON.stringify(nextTaller(h)));
const r = park(739);
const big = Array.from({ length: 200000 }, (_, i) => 200000 - i);   // giảm hẳn: vét cạn là O(n²)
big[199999] = 300000;
const res = nextTaller(big);
let checksum = 0;
for (let i = 0; i < res.length; i++) checksum = (checksum * 31 + res[i] + 1) % 1000000007;
console.log('large decreasing n=200000 -> first=' + res[0] + ' last=' + res[199999] + ' checksum=' + checksum);
const rnd = Array.from({ length: 200000 }, () => r() % 1000);
const res2 = nextTaller(rnd);
let cs2 = 0;
for (let i = 0; i < res2.length; i++) cs2 = (cs2 * 31 + res2[i] + 1) % 1000000007;
console.log('large random n=200000 -> checksum=' + cs2);`,
});
const C2_SOLUTION = `// O(n) thời gian, O(n) bộ nhớ: mỗi chỉ số vào stack một lần, ra một lần.
// Stack GIẢM DẦN chứa chỉ số những toà CHƯA tìm được toà cao hơn. Toà i cao hơn hẳn toà ở đỉnh ⇒ i chính là
// câu trả lời cho toà đó, pop ra. "Cao hơn HẲN" ⇒ so bằng >, nên các toà bằng nhau vẫn chờ (ca [5, 5, 5]).
function nextTaller(heights) {
  const answer = new Array(heights.length).fill(-1);
  const waiting = [];
  for (let i = 0; i < heights.length; i++) {
    while (waiting.length > 0 && heights[i] > heights[waiting[waiting.length - 1]]) {
      answer[waiting.pop()] = i;
    }
    waiting.push(i);
  }
  return answer;
}`;

const questions = [
  /* ══════════════ Mục 0 ══════════════ */
  Q(`How many times does the inner body run for n = 16? ${c('for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) count++')}`,
    `Thân vòng trong chạy bao nhiêu lần với n = 16? ${c('for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) count++')}`,
    [['256', '256'],
     ['64', '64'],
     ['120', '120'],
     ['136', '136']],
    2,
    `Every pair once: n(n−1)/2 = 16·15/2 = 120 — the measured output in lesson 0.1. 256 is the full n×n loop (j from 0); 64 is n·log₂n, the shape you get with j *= 2. Halving n² does not change its class.`,
    `Mỗi cặp một lần: n(n−1)/2 = 16·15/2 = 120 — đúng kết quả đo ở bài 0.1. 256 là vòng n×n đầy đủ (j từ 0); 64 là n·log₂n, dáng vòng khi j *= 2. Chia đôi n² không đổi lớp độ phức tạp.`),

  Q(`Naive recursive fib made 21,891 calls for n = 20 and 2,692,537 for n = 30. About how many for n = 40?`,
    `fib đệ quy ngây thơ gọi 21.891 lần với n = 20 và 2.692.537 lần với n = 30. Với n = 40 khoảng bao nhiêu?`,
    [['About 3.6 million — it grows by ~900,000 per +10.', 'Khoảng 3,6 triệu — mỗi +10 tăng ~900.000.'],
     ['About 3·10⁸ — each +10 multiplies by ~123.', 'Khoảng 3·10⁸ — mỗi +10 nhân ~123 lần.'],
     ['About 5 million — it doubles per +10.', 'Khoảng 5 triệu — mỗi +10 gấp đôi.'],
     ['About 10¹⁵ — it squares per +10.', 'Khoảng 10¹⁵ — mỗi +10 bình phương lên.']],
    1,
    `2,692,537 / 21,891 ≈ 123, the same ratio as from n = 10 (177 calls) to 20: exponential growth multiplies by a constant per fixed step, so ×123 again ≈ 3.3·10⁸ (lesson 0.1). Treating it as linear is the most common misreading.`,
    `2.692.537 / 21.891 ≈ 123, cùng tỉ lệ như từ n = 10 (177 lời gọi) lên 20: tăng theo hàm mũ là nhân một hằng số sau mỗi bước cố định, nên ×123 nữa ≈ 3,3·10⁸ (bài 0.1). Coi nó là tuyến tính là cách đọc sai phổ biến nhất.`),

  Q(`For LC 121 (best time to buy and sell once), why is [2, 4, 1, 3] — answer 2 — a valuable test case?`,
    `Với LC 121 (mua bán cổ phiếu một lần), vì sao [2, 4, 1, 3] — đáp án 2 — là một ca thử đáng giá?`,
    [['It is the smallest non-trivial input.', 'Đó là đầu vào không tầm thường nhỏ nhất.'],
     ['It has no profit at all.', 'Nó không có lãi nào.'],
     ['It is sorted, which breaks two pointers.', 'Nó đã sắp xếp, làm hỏng hai con trỏ.'],
     ['The minimum comes after the best pair, so max − min is wrong.', 'Giá nhỏ nhất đến sau cặp tốt nhất, nên max − min sai.']],
    3,
    `max − min would be 4 − 1 = 3, but you cannot buy at 1 (day 2) and sell at 4 (day 1) (lesson 0.2). A test that separates a tempting wrong idea from the right one is worth more than ten random ones.`,
    `max − min sẽ là 4 − 1 = 3, nhưng không thể mua ở 1 (ngày 2) rồi bán ở 4 (ngày 1) (bài 0.2). Một ca thử tách được ý tưởng sai hấp dẫn khỏi ý tưởng đúng đáng giá hơn mười ca ngẫu nhiên.`),

  Q(`A "recruiter" sends a GitHub repository and asks you to run ${c('npm install && npm start')} before the interview. What do you do?`,
    `Một "nhà tuyển dụng" gửi kho GitHub và nhờ bạn chạy ${c('npm install && npm start')} trước buổi phỏng vấn. Bạn làm gì?`,
    [['Verify the sender, read the scripts, run it only in a throw-away VM.', 'Xác minh người gửi, đọc các script, chỉ chạy trong máy ảo dùng một lần.'],
     ['Run it with sudo so installs do not fail.', 'Chạy bằng sudo để cài không lỗi.'],
     ['Run it — npm vets every package.', 'Cứ chạy — npm kiểm duyệt mọi gói.'],
     ['Run it offline, then reconnect Wi-Fi.', 'Chạy khi ngắt mạng rồi bật lại Wi-Fi.']],
    0,
    `This is the "Contagious Interview" pattern documented since 2023: the project carries malware that runs on install/start (lesson 0.9). npm does not vet packages; sudo gives the malware more power; reconnecting lets it phone home later.`,
    `Đây là kiểu lừa "Contagious Interview" được ghi nhận từ 2023: dự án mang mã độc chạy khi cài/khởi động (bài 0.9). npm không kiểm duyệt gói; sudo cho mã độc nhiều quyền hơn; bật lại mạng là để nó "gọi về nhà" sau đó.`),

  /* ══════════════ Chương 1 ══════════════ */
  Q(`Count contiguous subarrays whose sum is divisible by k; n ≤ 10⁵, values between −10⁴ and 10⁴. Which plan?`,
    `Đếm mảng con liên tiếp có tổng chia hết cho k; n ≤ 10⁵, giá trị từ −10⁴ tới 10⁴. Hướng nào?`,
    [['A sliding window that shrinks when the sum is too big.', 'Cửa sổ trượt co lại khi tổng quá lớn.'],
     ['Prefix remainders in a count map starting {0: 1}.', 'Phần dư tiền tố trong map đếm khởi đầu {0: 1}.'],
     ['Sort, then two pointers.', 'Sắp xếp rồi hai con trỏ.'],
     ['Check every pair of indexes.', 'Duyệt mọi cặp chỉ số.']],
    1,
    `Two prefixes with the same remainder differ by a multiple of k — count remainders like LC 974, and normalise the sign because −7 % 5 is −2 in both JavaScript and Java (lesson 1.2). A window needs non-negative values; sorting destroys contiguity.`,
    `Hai tiền tố cùng phần dư thì hiệu là bội của k — đếm phần dư như LC 974, và chuẩn hoá dấu vì −7 % 5 là −2 trong cả JavaScript lẫn Java (bài 1.2). Cửa sổ cần giá trị không âm; sắp xếp phá tính liên tiếp.`),

  Q(`Bookings as half-open hours [0, 2), [1, 5), [1, 3), [4, 6) over hours 0–5. With ${c('diff[enter] += 1, diff[leave] -= 1')} and one prefix pass, the occupancy per hour is…`,
    `Các lượt đặt dạng giờ nửa mở [0, 2), [1, 5), [1, 3), [4, 6) trong các giờ 0–5. Với ${c('diff[enter] += 1, diff[leave] -= 1')} và một lượt cộng dồn, số người theo từng giờ là…`,
    [['[1, 3, 3, 2, 2, 2]', '[1, 3, 3, 2, 2, 2]'],
     ['[1, 2, -1, -1, 1, -1]', '[1, 2, -1, -1, 1, -1]'],
     ['[1, 3, 2, 1, 2, 1]', '[1, 3, 2, 1, 2, 1]'],
     ['[4, 4, 4, 4, 4, 4]', '[4, 4, 4, 4, 4, 4]']],
    2,
    `diff = [1, 2, −1, −1, 1, −1, −1]; its running sums over hours 0–5 are [1, 3, 2, 1, 2, 1] (lesson 1.2, checked by running it). [1, 3, 3, 2, 2, 2] treats the leave hour as still inside; the second option is the diff array itself.`,
    `diff = [1, 2, −1, −1, 1, −1, −1]; tổng cộng dồn của nó qua giờ 0–5 là [1, 3, 2, 1, 2, 1] (bài 1.2, đã chạy thử). [1, 3, 3, 2, 2, 2] là coi giờ rời đi vẫn ở trong; lựa chọn thứ hai chính là mảng diff.`),

  Q(`P is the (m+1)×(n+1) 2-D prefix table: P[r][c] = sum of rows < r and columns < c. Which gives the sum of rows r1..r2 and columns c1..c2, inclusive?`,
    `P là bảng tiền tố 2 chiều (m+1)×(n+1): P[r][c] = tổng các hàng < r và cột < c. Biểu thức nào cho tổng hàng r1..r2, cột c1..c2, tính cả biên?`,
    [[`${c('P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]')}`, `${c('P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]')}`],
     [`${c('P[r2][c2] − P[r1][c2] − P[r2][c1] + P[r1][c1]')}`, `${c('P[r2][c2] − P[r1][c2] − P[r2][c1] + P[r1][c1]')}`],
     [`${c('P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] − P[r1][c1]')}`, `${c('P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] − P[r1][c1]')}`],
     [`${c('P[r2+1][c2+1] − P[r1][c1]')}`, `${c('P[r2+1][c2+1] − P[r1][c1]')}`]],
    0,
    `Inclusion–exclusion: the big rectangle, minus the rows above, minus the columns to the left, plus the corner cut twice. On the lesson's matrix sumRegion(1, 1, 2, 2) = 21 − 4 − 9 + 3 = 11, the real output (lesson 1.2). The second option is off by one row and column.`,
    `Bao hàm – loại trừ: hình chữ nhật lớn, trừ các hàng phía trên, trừ các cột bên trái, cộng lại góc bị trừ hai lần. Trên ma trận của bài, sumRegion(1, 1, 2, 2) = 21 − 4 − 9 + 3 = 11, đúng kết quả chạy (bài 1.2). Lựa chọn thứ hai lệch một hàng và một cột.`),

  Q(`A list ordered by name — An:8 Bao:8 Chi:9 … — is sorted by score with a hand-written selection sort. The result starts Chi:9 Bao:8 An:8. Why is Bao before An?`,
    `Một danh sách đã xếp theo tên — An:8 Bao:8 Chi:9 … — được sắp theo điểm bằng selection sort tự viết. Kết quả mở đầu Chi:9 Bao:8 An:8. Vì sao Bao đứng trước An?`,
    [['The comparator is wrong.', 'Comparator viết sai.'],
     ['Selection sort sorts in descending name order.', 'Selection sort sắp tên giảm dần.'],
     ['JavaScript sort is not stable.', 'sort của JavaScript không ổn định.'],
     ['Selection sort is not stable: a long-distance swap jumped An past Bao.', 'Selection sort không ổn định: một lần đổi chỗ xa đã đẩy An vượt qua Bao.']],
    3,
    `Swapping An (index 0) with Chi (index 2) moved An past an equal element; the built-in sort printed Chi:9 An:8 Bao:8 (lesson 1.3). Array.prototype.sort has been required to be stable since ES2019, so sorting by score keeps the name order among ties.`,
    `Đổi chỗ An (chỉ số 0) với Chi (chỉ số 2) đã đẩy An vượt qua một phần tử bằng nó; sort có sẵn in Chi:9 An:8 Bao:8 (bài 1.3). Array.prototype.sort bắt buộc ổn định từ ES2019, nên sắp theo điểm vẫn giữ thứ tự tên giữa các bản bằng điểm.`),

  Q(`Node: what does ${c('console.log(2 ** 31 | 0)')} print?`,
    `Node: ${c('console.log(2 ** 31 | 0)')} in ra gì?`,
    [['2147483648', '2147483648'],
     ['-2147483648', '-2147483648'],
     ['0', '0'],
     ['2147483647', '2147483647']],
    1,
    `Every bitwise operator first converts its operands to 32-bit SIGNED integers; 2³¹ is a 1 followed by 31 zeros, which is −2³¹ in two's complement (real run, lesson 1.4). Use ${c('>>> 0')} to keep unsigned 32-bit values.`,
    `Mọi toán tử bit đều đổi toán hạng sang số nguyên 32 bit CÓ DẤU trước; 2³¹ là một bit 1 theo sau 31 bit 0, tức −2³¹ trong bù hai (lần chạy thật, bài 1.4). Dùng ${c('>>> 0')} để giữ giá trị 32 bit không dấu.`),

  Q(`Two Sum with a map. You insert ${c('nums[i]')} into the map BEFORE looking up ${c('target − nums[i]')}. For [3] with target 6 it returns…`,
    `Two Sum dùng map. Bạn chèn ${c('nums[i]')} vào map TRƯỚC khi tra ${c('target − nums[i]')}. Với [3] và target 6 nó trả…`,
    [['[] — no pair exists.', '[] — không có cặp nào.'],
     ['undefined', 'undefined'],
     ['[0, 0] — the element finds itself.', '[0, 0] — phần tử tự tìm thấy chính nó.'],
     ['An error: index out of range.', 'Lỗi: chỉ số vượt phạm vi.']],
    2,
    `At i = 0 the map already holds 3 → 0, and need = 3, so it pairs with itself — the real run printed [0, 0] for both [3] and [3, 3] (the course's final check, 11.6). Looking up before inserting guarantees the partner has a smaller index.`,
    `Ở i = 0 map đã có 3 → 0, và need = 3, nên nó ghép với chính nó — lần chạy thật in [0, 0] cho cả [3] lẫn [3, 3] (bài kiểm tra cuối khoá 11.6). Tra trước rồi mới chèn đảm bảo "bạn ghép" có chỉ số nhỏ hơn.`),

  Q(`Which statement about a JavaScript ${c('Map')} used as a hash map is correct?`,
    `Câu nào đúng về ${c('Map')} của JavaScript khi dùng làm hash map?`,
    [['Average O(1) get/set; iteration follows insertion order.', 'get/set trung bình O(1); duyệt theo thứ tự chèn.'],
     ['O(log n) per operation because it is a tree.', 'O(log n) mỗi thao tác vì nó là cây.'],
     ['Keys are compared by value, so [1] and [1] are the same key.', 'Khoá so theo giá trị, nên [1] và [1] là cùng khoá.'],
     ['Iteration is sorted by key.', 'Duyệt theo khoá đã sắp xếp.']],
    0,
    `A Map is a hash table: average O(1) operations, iteration in insertion order — not by key and not by frequency (lessons 1.1 and 1.3). Object keys are compared by identity, so two different [1] arrays are two keys; use a string or number key for values.`,
    `Map là bảng băm: thao tác trung bình O(1), duyệt theo thứ tự chèn — không theo khoá, không theo tần suất (bài 1.1 và 1.3). Khoá object so theo danh tính, nên hai mảng [1] khác nhau là hai khoá; muốn so theo giá trị thì dùng khoá chuỗi hoặc số.`),

  /* ══════════════ Chương 2 ══════════════ */
  Q(`LC 3 "jump" version written as ${c('l = last[c] + 1')} (no max). It passes "abcabcbb" and "pwwkew". For "abba" it returns…`,
    `LC 3 bản "nhảy" viết ${c('l = last[c] + 1')} (không có max). Nó qua "abcabcbb" và "pwwkew". Với "abba" nó trả…`,
    [['2', '2'],
     ['4', '4'],
     ['1', '1'],
     ['3', '3']],
    3,
    `At the last "a", last[a] = 0 is already outside the window, so l = 0 + 1 = 1 moves BACKWARDS and "bba" (two b's) is counted as 3 — the real run (lesson 2.2). l = max(l, last[c] + 1) keeps the window from ever moving left.`,
    `Ở chữ "a" cuối, last[a] = 0 đã nằm ngoài cửa sổ, nên l = 0 + 1 = 1 bị LÙI LẠI và "bba" (hai chữ b) được tính là 3 — lần chạy thật (bài 2.2). l = max(l, last[c] + 1) giữ cho cửa sổ không bao giờ lùi.`),

  Q(`Two-pointer Container With Most Water on [1, 2, 4, 3] returns…`,
    `Container With Most Water bằng hai con trỏ trên [1, 2, 4, 3] trả…`,
    [['8', '8'],
     ['4', '4'],
     ['6', '6'],
     ['3', '3']],
    1,
    `Walls 2 and 3 at distance 2 give min(2, 3) × 2 = 4; the real output matched brute force (lesson 2.1). 8 uses the taller wall, but the water level is set by the SHORTER one; 3 is the widest container (min(1, 3) × 3).`,
    `Hai tường 2 và 3 cách nhau 2 cho min(2, 3) × 2 = 4; kết quả chạy thật khớp vét cạn (bài 2.1). 8 là dùng tường cao hơn, nhưng mực nước do tường THẤP hơn quyết định; 3 là bình rộng nhất (min(1, 3) × 3).`),

  Q(`You remove the three duplicate-skipping lines from 3Sum (sort + fix one + two pointers). On [-2, 0, 0, 2, 2] it returns…`,
    `Bạn xoá ba dòng bỏ trùng trong 3Sum (sắp xếp + cố định một + hai con trỏ). Trên [-2, 0, 0, 2, 2] nó trả…`,
    [['[[-2, 0, 2]]', '[[-2, 0, 2]]'],
     ['[]', '[]'],
     ['[[-2, 0, 2], [-2, 0, 2]]', '[[-2, 0, 2], [-2, 0, 2]]'],
     ['[[-2, 0, 2], [0, 0, 0]]', '[[-2, 0, 2], [0, 0, 0]]']],
    2,
    `After the first hit, l++ and r-- land on another 0 and another 2, which make the same triple — the real run printed it twice (lesson 2.1). Sorting puts equal values side by side; it does not remove them.`,
    `Sau lần trúng đầu, l++ và r-- rơi vào một số 0 khác và một số 2 khác, tạo lại đúng bộ ba đó — lần chạy thật in hai lần (bài 2.1). Sắp xếp đặt các giá trị bằng nhau cạnh nhau; nó không xoá chúng.`),

  Q(`An endpoint allows 10 requests per 60 s with a FIXED window that opens at the key's first hit. An attacker sends 1 at t = 0, 9 at 59.91–59.99 s and 10 at 60.00–60.09 s. How many are accepted inside those 200 ms?`,
    `Một endpoint cho 10 request mỗi 60 s với cửa sổ CỐ ĐỊNH mở từ lần gọi đầu của khoá. Kẻ tấn công gửi 1 lúc t = 0, 9 lúc 59,91–59,99 s và 10 lúc 60,00–60,09 s. Bao nhiêu request được nhận trong 200 ms đó?`,
    [['19', '19'],
     ['10', '10'],
     ['11', '11'],
     ['20', '20']],
    0,
    `9 fit at the end of the first window, then at 60.00 s the window expires and a fresh one accepts 10: 2 × max − 1 = 19 (real run, lesson 2.2). 10 is what a sliding-window LOG allows — the fix when bursts at the boundary matter.`,
    `9 lọt vào cuối cửa sổ đầu, rồi lúc 60,00 s cửa sổ hết hạn và cửa sổ mới nhận 10: 2 × max − 1 = 19 (lần chạy thật, bài 2.2). 10 là con số của cửa sổ trượt dạng NHẬT KÝ — cách sửa khi các đợt dồn ở ranh giới là vấn đề.`),

  Q(`A teammate writes the cycle check as ${c('while (fast.next !== null && fast !== null)')}. On 1 → 2 → 3 → 4 (no cycle) in JavaScript…`,
    `Đồng đội viết kiểm chu trình là ${c('while (fast.next !== null && fast !== null)')}. Trên 1 → 2 → 3 → 4 (không chu trình) trong JavaScript…`,
    [['It returns false correctly.', 'Nó trả false đúng.'],
     ['It loops forever.', 'Nó lặp vô hạn.'],
     ['It returns true.', 'Nó trả true.'],
     ['TypeError: cannot read "next" of null.', 'TypeError: không đọc được "next" của null.']],
    3,
    `On an even length fast jumps to null, and the condition reads fast.next BEFORE checking fast — real run: TypeError (lesson 2.3). On odd lengths it exits cleanly, which is why 1 → 2 → 3 passes. Check fast first.`,
    `Với độ dài chẵn, fast nhảy thành null, mà điều kiện đọc fast.next TRƯỚC khi kiểm fast — lần chạy thật: TypeError (bài 2.3). Với độ dài lẻ nó thoát êm, nên 1 → 2 → 3 vẫn qua. Hãy kiểm fast trước.`),

  Q(`Shortest subarray with sum ≥ target, all values POSITIVE, n ≤ 10⁵. Which is the best plan?`,
    `Mảng con ngắn nhất có tổng ≥ target, mọi giá trị DƯƠNG, n ≤ 10⁵. Hướng tốt nhất?`,
    [['Prefix sums with a hash map, O(n).', 'Tổng tiền tố với hash map, O(n).'],
     ['A variable-size sliding window, O(n).', 'Cửa sổ trượt co giãn, O(n).'],
     ['Sort and binary search, O(n log n).', 'Sắp xếp rồi tìm nhị phân, O(n log n).'],
     ['Check all pairs, O(n²).', 'Duyệt mọi cặp, O(n²).']],
    1,
    `With positive values, growing the window only increases the sum and shrinking only decreases it, so "grow right, shrink left while ≥ target" is correct and O(n) (LC 209, lesson 2.2). A hash map looks for an EXACT sum; sorting destroys contiguity.`,
    `Với giá trị dương, nới cửa sổ chỉ làm tổng tăng và co chỉ làm tổng giảm, nên "nới phải, co trái khi ≥ target" là đúng và O(n) (LC 209, bài 2.2). Hash map dùng để tìm tổng ĐÚNG BẰNG; sắp xếp phá tính liên tiếp.`),

  Q(`Which problem is a natural fit for fast and slow pointers?`,
    `Bài nào hợp tự nhiên với con trỏ nhanh – chậm?`,
    [['Find a duplicate in an array of n + 1 values in 1..n, O(1) memory.', 'Tìm số trùng trong mảng n + 1 giá trị thuộc 1..n, bộ nhớ O(1).'],
     ['Find the k-th largest element of an array.', 'Tìm phần tử lớn thứ k của một mảng.'],
     ['Merge two sorted arrays into one.', 'Trộn hai mảng đã sắp thành một.'],
     ['Count the distinct values in an array.', 'Đếm số giá trị khác nhau trong mảng.']],
    0,
    `Treat i → nums[i] as a "hidden linked list": a duplicate value means two arrows enter the same node, i.e. a cycle, and Floyd finds its entry with O(1) memory (LC 287, lesson 2.3). k-th largest is a heap or quickselect; merging uses two pointers but not fast/slow.`,
    `Coi i → nums[i] là một "danh sách liên kết ẩn": giá trị trùng nghĩa là hai mũi tên cùng vào một nút, tức có chu trình, và Floyd tìm điểm vào với bộ nhớ O(1) (LC 287, bài 2.3). Phần tử lớn thứ k là heap hoặc quickselect; trộn mảng dùng hai con trỏ nhưng không phải nhanh – chậm.`),

  /* ══════════════ Chương 3 ══════════════ */
  Q(`Valid Parentheses pushes openers and pops on closers, but ends with ${c('return true')} instead of checking the stack is empty. Which input exposes it?`,
    `Valid Parentheses push dấu mở và pop khi gặp dấu đóng, nhưng kết thúc bằng ${c('return true')} thay vì kiểm stack rỗng. Đầu vào nào làm lộ bug?`,
    [['"([)]"', '"([)]"'],
     ['")("', '")("'],
     ['"(("', '"(("'],
     ['"()[]{}"', '"()[]{}"']],
    2,
    `"((" pushes two openers and never pops; without the final empty check the function returns true (real run, lesson 3.1). "([)]" is caught inside the loop — ")" meets "[" on top; ")(" fails at the first closer on an empty stack.`,
    `"((" push hai dấu mở và không bao giờ pop; thiếu bước kiểm rỗng cuối cùng thì hàm trả true (lần chạy thật, bài 3.1). "([)]" bị bắt ngay trong vòng lặp — ")" gặp "[" ở đỉnh; ")(" hỏng ở dấu đóng đầu tiên khi stack rỗng.`),

  Q(`${c('dailyTemperatures([30, 60, 90, 80, 70, 100])')} with the monotonic stack returns…`,
    `${c('dailyTemperatures([30, 60, 90, 80, 70, 100])')} với stack đơn điệu trả về…`,
    [['[1, 1, 3, 1, 1, 0]', '[1, 1, 3, 1, 1, 0]'],
     ['[1, 1, 1, 1, 1, 0]', '[1, 1, 1, 1, 1, 0]'],
     ['[5, 4, 3, 2, 1, 0]', '[5, 4, 3, 2, 1, 0]'],
     ['[1, 1, 3, 2, 1, 0]', '[1, 1, 3, 2, 1, 0]']],
    3,
    `90, 80 and 70 wait on the stack (indexes 2, 3, 4) until 100 arrives at index 5 and pops them: 5 − 4 = 1, 5 − 3 = 2, 5 − 2 = 3 (lesson 3.1). The tempting [1, 1, 3, 1, 1, 0] counts the distance to the next element instead of the next warmer day for 80.`,
    `90, 80 và 70 chờ trong stack (chỉ số 2, 3, 4) tới khi 100 đến ở chỉ số 5 và pop chúng: 5 − 4 = 1, 5 − 3 = 2, 5 − 2 = 3 (bài 3.1). Đáp án hấp dẫn [1, 1, 3, 1, 1, 0] đếm khoảng cách tới phần tử kế bên thay vì tới ngày ấm hơn của 80.`),

  Q(`Java: ${c('Deque<Integer> dq = new ArrayDeque<>(); dq.push(1); dq.push(2); dq.push(3);')} then three ${c('dq.poll()')} calls print…`,
    `Java: ${c('Deque<Integer> dq = new ArrayDeque<>(); dq.push(1); dq.push(2); dq.push(3);')} rồi ba lần ${c('dq.poll()')} in ra…`,
    [['1,2,3', '1,2,3'],
     ['3,2,1', '3,2,1'],
     ['1,3,2', '1,3,2'],
     ['null,null,null', 'null,null,null']],
    1,
    `push = addFirst and poll = pollFirst, so both work at the head: LIFO, 3,2,1 (real run, lesson 3.2). 1,2,3 is what offer (addLast) + poll gives. Pick one vocabulary per deque and stick to it.`,
    `push = addFirst và poll = pollFirst, nên cả hai làm việc ở đầu: LIFO, 3,2,1 (lần chạy thật, bài 3.2). 1,2,3 là kết quả của offer (addLast) + poll. Hãy chọn một bộ từ vựng cho mỗi deque và dùng nhất quán.`),

  Q(`Your evalRPN uses ${c('Math.floor(a / b)')} for "/". Which test fails?`,
    `evalRPN của bạn dùng ${c('Math.floor(a / b)')} cho "/". Test nào đỏ?`,
    [['["7", "-2", "/"] — returns -4, expected -3', '["7", "-2", "/"] — trả -4, mong -3'],
     ['["13", "5", "/"] — returns 2, expected 3', '["13", "5", "/"] — trả 2, mong 3'],
     ['["2", "1", "+", "3", "*"] — returns 9, expected 6', '["2", "1", "+", "3", "*"] — trả 9, mong 6'],
     ['["4", "2", "/"] — returns 1, expected 2', '["4", "2", "/"] — trả 1, mong 2']],
    0,
    `7 / −2 = −3.5; Math.floor rounds down to −4, while LeetCode (like Java's int division) truncates toward zero: −3 (lesson 3.1). For positive results floor and trunc agree, which is why 13 / 5 = 2 passes. Use Math.trunc.`,
    `7 / −2 = −3,5; Math.floor làm tròn xuống thành −4, còn LeetCode (như phép chia int của Java) cắt về phía 0: −3 (bài 3.1). Với kết quả dương, floor và trunc cho cùng giá trị, nên 13 / 5 = 2 vẫn qua. Hãy dùng Math.trunc.`),

  Q(`Sliding Window Maximum on [1, 3, −1, −3, 5, 3, 6, 7], k = 3, monotonic deque of indexes. The deque right after index 4 (value 5) is…`,
    `Sliding Window Maximum trên [1, 3, −1, −3, 5, 3, 6, 7], k = 3, deque đơn điệu chứa chỉ số. Deque ngay sau chỉ số 4 (giá trị 5) là…`,
    [['[2, 3, 4]', '[2, 3, 4]'],
     ['[1, 4]', '[1, 4]'],
     ['[4]', '[4]'],
     ['[1, 2, 3, 4]', '[1, 2, 3, 4]']],
    2,
    `Before index 4 the deque is [1, 2, 3]; index 1 has left the window [2..4] and is dropped from the front, then 5 pops −3 and −1 from the back; push 4 ⇒ [4] (lesson 3.2). Smaller, older values can never be a maximum again.`,
    `Trước chỉ số 4 deque là [1, 2, 3]; chỉ số 1 đã rời cửa sổ [2..4] nên bị bỏ ở đầu, rồi 5 pop −3 và −1 ở cuối; đẩy 4 vào ⇒ [4] (bài 3.2). Giá trị nhỏ hơn mà cũ hơn không bao giờ còn là lớn nhất được nữa.`),

  Q(`Remove Nth Node From End without a dummy node crashes on [1, 2] with n = 2. What is the clean fix?`,
    `Remove Nth Node From End không dùng nút giả bị sập trên [1, 2] với n = 2. Cách sửa gọn là gì?`,
    [['Move fast n − 1 steps instead of n.', 'Cho fast đi n − 1 bước thay vì n.'],
     ['Wrap it in try/catch and return head.next.', 'Bọc try/catch rồi trả head.next.'],
     ['Reverse the list first.', 'Đảo danh sách trước.'],
     ['Start both pointers at a dummy before the head.', 'Cho cả hai con trỏ bắt đầu ở một nút giả trước đầu.']],
    3,
    `n = 2 means removing the head, which has no predecessor for slow to stand on (lesson 3.3). A dummy gives every node a predecessor; move fast n + 1 steps from it and return dummy.next = [2]. Changing the gap just moves the bug to another case.`,
    `n = 2 nghĩa là xoá nút đầu, mà nút đầu không có nút đứng trước để slow đứng (bài 3.3). Nút giả cho mọi nút một nút đứng trước; cho fast đi n + 1 bước từ nó và trả dummy.next = [2]. Đổi khoảng cách chỉ dời bug sang ca khác.`),
];

export default {
  course: { slug: 'dsa-interview' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 3 (complexity, hashing, two pointers, stacks and queues)',
        'Kiểm tra tiến độ 1 — Mục 0 tới Chương 3 (độ phức tạp, băm, hai con trỏ, stack và queue)',
      ),
      description: B(
        'The first third of Coding Interview Prep: reading complexity, the problem-solving framework, hash maps, prefix and difference arrays, sorting traps, bits, two pointers, sliding windows, fast and slow pointers, monotonic stacks, deques and linked lists. 24 multiple-choice questions plus 2 coding questions with a large generated test.',
        'Một phần ba đầu của khoá Coding Interview Prep: đọc độ phức tạp, khung giải đề, hash map, mảng tiền tố và hiệu, bẫy sắp xếp, thao tác bit, hai con trỏ, cửa sổ trượt, con trỏ nhanh – chậm, stack đơn điệu, deque và danh sách liên kết. 24 câu trắc nghiệm cùng 2 câu lập trình có ca kiểm cỡ lớn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, 'Section 0 to Chapter 3', 'Mục 0 tới Chương 3'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — Hours whose total is exactly k (chapter 1).</b> ' + c('countSumK(nums, k)') + ' counts the non-empty contiguous ranges whose sum is exactly <code>k</code>. Values can be negative, so a sliding window is wrong; n reaches 2·10⁵, so checking every range is too slow.</p>' +
            '<p>Use prefix sums and a count map. Two details decide the result: the map must start with the empty prefix, and you must look up <i>before</i> you record the current prefix (try <code>[0, 0, 0]</code> with <code>k = 0</code>: the answer is 6).</p>',
            '<p><b>Câu 25 — Các đoạn giờ có tổng đúng bằng k (chương 1).</b> ' + c('countSumK(nums, k)') + ' đếm số đoạn liên tiếp khác rỗng có tổng đúng bằng <code>k</code>. Có số âm nên cửa sổ trượt là sai; n tới 2·10⁵ nên duyệt mọi đoạn là quá chậm.</p>' +
            '<p>Dùng tổng tiền tố và map đếm. Hai chi tiết quyết định kết quả: map phải khởi đầu với tiền tố rỗng, và phải tra <i>trước</i> khi ghi tiền tố hiện tại (thử <code>[0, 0, 0]</code> với <code>k = 0</code>: đáp án là 6).</p>',
          ),
          starterCode: C1_STARTER,
          expectedOutput: "[1,2,-1,3,-2,2] k=3 -> 4\n[1,1,1] k=2 -> 2\n[0,0,0] k=0 -> 6\n[3] k=3 -> 1\n[-1,-1,1] k=0 -> 1\n[5,-5,5,-5] k=0 -> 4\nlarge n=200000 k=7 -> 6904580",
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — The next strictly taller building (chapter 3).</b> ' + c('nextTaller(heights)') + ' returns, for every building, the index of the nearest building to its right that is <b>strictly</b> taller, or <code>-1</code>. Equal heights do not count.</p>' +
            '<p>The scan "until a taller one" is O(n²) on a decreasing street — and the given block tests exactly that street with n = 2·10⁵. Use the monotonic stack of lesson 3.1; the block prints a checksum of the whole answer.</p>',
            '<p><b>Câu 26 — Toà nhà cao hơn hẳn tiếp theo (chương 3).</b> ' + c('nextTaller(heights)') + ' trả về, với mỗi toà, chỉ số toà gần nhất bên phải cao hơn <b>hẳn</b>, hoặc <code>-1</code>. Cao bằng nhau thì không tính.</p>' +
            '<p>Cách quét "tới khi gặp toà cao hơn" là O(n²) trên một con phố giảm dần — và khối cho sẵn thử đúng con phố đó với n = 2·10⁵. Hãy dùng stack đơn điệu của bài 3.1; khối cho sẵn in một mã kiểm (checksum) của toàn bộ đáp án.</p>',
          ),
          starterCode: C2_STARTER,
          expectedOutput: "[30,60,90,80,70,100] -> [1,2,5,5,5,-1]\n[5,5,5] -> [-1,-1,-1]\n[1,2,3,4] -> [1,2,3,-1]\n[4,3,2,1] -> [-1,-1,-1,-1]\n[2,1,2,3] -> [3,2,3,-1]\n[7] -> [-1]\nlarge decreasing n=200000 -> first=199999 last=-1 checksum=201291018\nlarge random n=200000 -> checksum=864741176",
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
