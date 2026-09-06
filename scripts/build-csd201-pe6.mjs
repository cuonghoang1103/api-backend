/**
 * build-csd201-pe6.mjs — sinh content/exams/CSD201-PE6.mjs.
 *
 * Nguồn thật: Đề 6 (Fall 2025, Block 3-Week, chỉ có paper.pdf, KHÔNG có
 * project NetBeans given nào đi kèm). Cùng kiểu "viết từ đầu" như PE7, nhưng
 * khác PE7 ở chỗ đề này TỰ GHI RÕ: "The input and expected output below are
 * provided only to test your codes. The input and expected output in the
 * real testcases (for marking) are different from the examples below. Do
 * not hardcode the given expected results." — nghĩa là ví dụ minh hoạ trong
 * đề chỉ để SINH VIÊN tự test, KHÔNG phải bộ test thật dùng để chấm. Vì vậy
 * expectedOutput dưới đây dùng CHÍNH bộ dữ liệu mẫu mà đề đã cho (Song
 * S01-S05 của ban nhạc The_Beatles, dùng lại y nguyên tên bài hát/nghệ sĩ đề
 * đã liệt kê) để tái tạo ĐÚNG các ví dụ minh hoạ của đề — không bịa dữ liệu
 * mới, chỉ dùng lại dữ liệu đề đã công khai làm ví dụ.
 *
 * Đề: quản lý thư viện nhạc — SongBST (cây nhị phân tìm kiếm, khoá songId)
 * lưu toàn bộ bài hát; PlaylistCLL (danh sách liên kết vòng) quản playlist
 * đang phát lặp. 4 method (f1-f4), mỗi câu 2.5 điểm = 10 điểm.
 *
 * Toàn bộ lời giải (Song/PlaylistCLL/SongBST/Main) đã viết tay, COMPILE +
 * CHẠY THẬT (javac/java), đối chiếu output với đúng ví dụ minh hoạ trong
 * paper.pdf — khớp 100% cả 4 câu (dùng lại đúng test data đề đã công khai:
 * playlist ví dụ S03→S01 cho f1; playlist rỗng rồi thêm S99 cho f2; thư viện
 * S01-S05 The_Beatles cho f3/f4; đếm khoảng [S02,S04] = 3 bài cho f4).
 *
 * Không có given.zip để tải (đề gốc không phát mã nguồn) — mỗi câu CODE có
 * khung `PlaylistCLL.java`/`SongBST.java` tự thiết kế theo đúng chữ ký
 * method + quy ước "//You should write here...", mỗi file đã verify compile
 * ĐỘC LẬP (given lẫn solved) trước khi ghép vào đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE6.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE6.mjs');
const SRC = '/tmp/csd201-pe6-final';

// Một trường song ngữ hay được ghép từ những mảnh mà bản thân mảnh đó ĐÃ là
// chuỗi song ngữ — hoặc nhét vào trong B() (`B(scenario + task_en, ...)`), hoặc
// nối ở ngoài (`prompt: SCENARIO + B(task_en, task_vi)`). Cả hai kiểu đều làm
// một trường mang 2-5 dấu "|||", trong khi pickLang() (frontend/src/lib/utils.ts)
// chỉ tách ở dấu ĐẦU TIÊN — hậu quả: người đọc bản tiếng Việt lãnh nguyên cả
// đoạn tiếng Anh, kèm dấu "|||" hiện ra màn hình.
//
// KHÔNG tách được bằng "tiền tố chung của hai vế": phần mở đầu của task tiếng
// Anh và tiếng Việt cũng trùng nhau ("Câu 1: addLast() - 1 " rồi mới mark/điểm)
// nên tách kiểu đó sẽ cắt cụt vế Anh. Nên B() ghi nhớ mọi chuỗi song ngữ chính
// nó đã tạo; gặp lại chuỗi đó ở bất kỳ đâu thì thay bằng đúng vế cần dùng —
// ranh giới biết chính xác, không phải suy đoán. __biNormalize() quét lần cuối
// toàn bộ spec trước khi ghi, bắt nốt kiểu nối ở ngoài B().
const __biReg = [];
const __biResolve = (s, side) => {
  let out = s;
  for (let guard = 0; guard < 40; guard++) {
    const hit = __biReg
      .filter((r) => out.includes(r))
      .sort((a, b) => b.length - a.length)[0];
    if (!hit) return out;
    const k = hit.indexOf('|||');
    out = out.split(hit).join(side === 'en' ? hit.slice(0, k) : hit.slice(k + 3));
  }
  throw new Error('B(): gỡ ||| lồng nhau không hội tụ');
};
const B = (en, vi) => {
  const out = `${__biResolve(en, 'en')}|||${__biResolve(vi, 'vi')}`;
  if ((out.match(/\|\|\|/g) || []).length !== 1) {
    throw new Error('B(): còn dấu ||| lồng nhau chưa gỡ được — kiểm tay chỗ gọi B()');
  }
  __biReg.push(out);
  return out;
};
const __biNormalize = (v) => {
  if (typeof v === 'string') {
    if ((v.match(/\|\|\|/g) || []).length <= 1) return v;
    const out = `${__biResolve(v, 'en')}|||${__biResolve(v, 'vi')}`;
    if ((out.match(/\|\|\|/g) || []).length !== 1) {
      throw new Error('__biNormalize(): trường vẫn còn ||| lồng nhau: ' + v.slice(0, 120));
    }
    return out;
  }
  if (Array.isArray(v)) return v.map(__biNormalize);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, __biNormalize(x)]));
  }
  return v;
};
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Fall 2025, Block 3-Week). Your task is to complete the method bodies only — do not change any method signature or add new import statements.</p>
   <p><strong>Scenario:</strong> complete a Java program that manages a <strong>music library</strong>. The system uses a <strong>Binary Search Tree (BST)</strong>, <code>SongBST</code>, to store all available songs, sorted alphabetically by <code>songId</code>. It also uses a <strong>Circularly Linked List (CLL)</strong>, <code>PlaylistCLL</code>, to manage a user's current playlist, which can be played in a loop.</p>
   <p><strong>Class structure (given, do not edit):</strong> <code>Song</code> — <code>songId: String</code>, <code>artist: String</code>, <code>title: String</code>.</p>
   <p><b>Note:</b> the sample input/output shown per question is only to help you test your own code — the real grading testcases use different data, so do not hardcode the specific results shown below.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Fall 2025, Block 3-Week). Chỉ hoàn thiện phần thân method — không đổi chữ ký method hay thêm import mới.</p>
   <p><strong>Bối cảnh:</strong> hoàn thiện chương trình Java quản lý <strong>thư viện nhạc</strong>. Hệ thống dùng <strong>cây nhị phân tìm kiếm (BST)</strong>, <code>SongBST</code>, lưu toàn bộ bài hát, sắp theo <code>songId</code>. Còn dùng <strong>danh sách liên kết vòng (CLL)</strong>, <code>PlaylistCLL</code>, quản lý playlist đang phát, có thể phát lặp.</p>
   <p><strong>Cấu trúc lớp (cho sẵn, không sửa):</strong> <code>Song</code> — <code>songId: String</code>, <code>artist: String</code>, <code>title: String</code>.</p>
   <p><b>Lưu ý:</b> input/output mẫu ở mỗi câu chỉ để bạn tự test — bộ test chấm điểm thật dùng dữ liệu khác, đừng hardcode kết quả mẫu dưới đây.</p>`,
);

const noGivenNote = B(
  `<p><b>Note on this deck:</b> the original exam paper does not distribute any starter/given project — students write the whole solution from scratch, using only the <code>Song</code> class described above. The skeleton below was authored to match this paper's exact requirements. All sample output has been verified by compiling and running a full reference solution using the exact sample data (Song titles/artists) this paper itself provides as its worked example.</p>`,
  `<p><b>Lưu ý về đề này:</b> đề gốc không phát project mẫu nào — sinh viên viết toàn bộ lời giải từ đầu, chỉ dùng lớp <code>Song</code> mô tả ở trên. Khung bên dưới được soạn đúng theo yêu cầu của đề gốc. Mọi output mẫu đã được xác nhận bằng cách biên dịch và chạy thật 1 lời giải tham chiếu, dùng đúng dữ liệu mẫu (tên bài hát/nghệ sĩ) mà chính đề đã cho làm ví dụ minh hoạ.</p>`,
);

const plGiven = fs.readFileSync(path.join(SRC, 'PlaylistCLL.given.java'), 'utf8');
const plSolved = fs.readFileSync(path.join(SRC, 'PlaylistCLL.solved.java'), 'utf8');
const bstGiven = fs.readFileSync(path.join(SRC, 'SongBST.given.java'), 'utf8');
const bstSolved = fs.readFileSync(path.join(SRC, 'SongBST.solved.java'), 'utf8');

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    noGivenNote + `<p><strong>f1() – 2.5 marks: Count Songs in Playlist</strong></p><ul><li>File: PlaylistCLL.java</li><li>Method to Complete: <code>countSongs()</code></li><li>Task: traverse the circularly linked list and return the total number of songs currently in the playlist. If the playlist is empty, return 0.</li></ul>`,
    noGivenNote + `<p><strong>f1() – 2.5 điểm: Đếm số bài trong playlist</strong></p><ul><li>File: PlaylistCLL.java</li><li>Method cần hoàn thiện: <code>countSongs()</code></li><li>Nhiệm vụ: duyệt danh sách liên kết vòng và trả về tổng số bài hát hiện có trong playlist. Nếu playlist rỗng, trả về 0.</li></ul>`,
  ),
  starterCode: plGiven,
  sampleSolution: plSolved,
  expectedOutput: `--- Current Playlist ---
(S03, Yesterday, The_Beatles)
(S01, Hey_Jude, The_Beatles)
Total songs in playlist: 2`,
  explanation: B(
    `<p>Verified by compiling and running a full reference solution with a playlist containing (S03, Yesterday) then (S01, Hey_Jude) added, matching this paper's own worked example exactly. A do-while loop starting from the head (last.next) and stopping when it returns to the head counts every node exactly once; an empty list (last == null) returns 0 immediately.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật 1 lời giải tham chiếu, với playlist chứa (S03, Yesterday) rồi thêm (S01, Hey_Jude), khớp đúng ví dụ minh hoạ của đề. Vòng lặp do-while bắt đầu từ head (last.next) và dừng khi quay lại head đếm đúng mỗi node 1 lần; danh sách rỗng (last == null) trả về 0 ngay.</p>`,
  ),
  rubric: [
    { id: 'empty_check', criterion: B('Returns 0 for an empty playlist.', 'Trả về 0 khi playlist rỗng.'), weight: 1, maxScore: 0.5 },
    { id: 'full_traversal', criterion: B('Correctly traverses the full circular list exactly once (no infinite loop, no missed node) and returns the correct count.', 'Duyệt đúng toàn bộ danh sách vòng đúng 1 lượt (không lặp vô hạn, không bỏ sót node) và trả về đúng số lượng.'), weight: 1, maxScore: 2 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>f2() – 2.5 marks: Add a Song to the Playlist</strong></p><ul><li>File: PlaylistCLL.java</li><li>Method to Complete: <code>addToPlaylist(Song song)</code></li><li>Task: implement the logic to add a new Song to the end of the circularly linked playlist. Must correctly handle adding a song to an initially empty playlist.</li></ul>`,
    `<p><strong>f2() – 2.5 điểm: Thêm bài hát vào playlist</strong></p><ul><li>File: PlaylistCLL.java</li><li>Method cần hoàn thiện: <code>addToPlaylist(Song song)</code></li><li>Nhiệm vụ: cài đặt logic thêm 1 Song mới vào CUỐI danh sách liên kết vòng. Phải xử lý đúng trường hợp playlist ban đầu đang rỗng.</li></ul>`,
  ),
  starterCode: plGiven,
  sampleSolution: plSolved,
  expectedOutput: `--- Initial Playlist State ---
--- Current Playlist ---
Empty
--- Final Playlist State ---
--- Current Playlist ---
(S99, New_Song, Test_Artist)`,
  explanation: B(
    `<p>Verified by compiling and running a full reference solution, adding (S99, New_Song, Test_Artist) to an initially empty playlist, matching this paper's own worked example exactly. When the list is empty (last == null), the new node becomes its own circular successor (last = p; p.next = p). Otherwise the new node is linked in right after the current last, and last is updated to the new node, keeping the list circular.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật 1 lời giải tham chiếu, thêm (S99, New_Song, Test_Artist) vào playlist ban đầu rỗng, khớp đúng ví dụ minh hoạ của đề. Khi danh sách rỗng (last == null), node mới tự trỏ vòng về chính nó (last = p; p.next = p). Ngược lại, node mới được nối ngay sau last hiện tại, và last cập nhật thành node mới, giữ đúng tính chất vòng.</p>`,
  ),
  rubric: [
    { id: 'empty_case', criterion: B('Correctly handles adding the first song to an initially empty playlist (the new node must link to itself).', 'Xử lý đúng khi thêm bài đầu tiên vào playlist ban đầu rỗng (node mới phải tự trỏ vòng về chính nó).'), weight: 1, maxScore: 1 },
    { id: 'append_and_stay_circular', criterion: B('Correctly appends to the end of a non-empty list while keeping the circular structure intact.', 'Nối đúng vào cuối danh sách khi không rỗng, vẫn giữ đúng cấu trúc vòng.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>f3() – 2.5 marks: Insert a Song into the Library</strong></p><ul><li>File: SongBST.java</li><li>Method to Complete: <code>insert(Song song)</code></li><li>Task: implement the logic to insert a new Song object into the Binary Search Tree. The tree must be ordered alphabetically based on the songId.</li></ul>`,
    `<p><strong>f3() – 2.5 điểm: Chèn bài hát vào thư viện</strong></p><ul><li>File: SongBST.java</li><li>Method cần hoàn thiện: <code>insert(Song song)</code></li><li>Nhiệm vụ: cài đặt logic chèn 1 Song mới vào cây nhị phân tìm kiếm. Cây phải sắp theo thứ tự chữ cái của songId.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `--- Song Library (In-Order) ---
(S01, Hey_Jude, The_Beatles)
(S02, Eleanor_Rigby, The_Beatles)
(S03, Yesterday, The_Beatles)
(S04, Come_Together, The_Beatles)
(S05, Let_It_Be, The_Beatles)`,
  explanation: B(
    `<p>Verified by compiling and running a full reference solution, inserting S03, S01, S04, S02, S05 (in that scrambled order, to genuinely exercise the BST insert logic rather than relying on already-sorted input) and printing in-order — the result comes out sorted S01→S05 alphabetically by songId, matching this paper's own worked example exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật 1 lời giải tham chiếu, chèn S03, S01, S04, S02, S05 (theo thứ tự xáo trộn này, để thực sự kiểm tra logic chèn BST chứ không dựa vào input đã sắp sẵn) rồi in in-order — kết quả ra đúng thứ tự S01→S05 theo chữ cái songId, khớp đúng ví dụ minh hoạ của đề.</p>`,
  ),
  rubric: [
    { id: 'string_key_order', criterion: B('Correctly compares songId as strings (e.g. via compareTo) to decide left/right, not numeric or reference comparison.', 'So sánh đúng songId dạng chuỗi (ví dụ dùng compareTo) để quyết định trái/phải, không so sánh kiểu số hay tham chiếu.'), weight: 1, maxScore: 1 },
    { id: 'bst_insert', criterion: B('Correctly attaches the new node at the right empty spot found by descending the tree, for both an empty tree and a non-empty one.', 'Gắn đúng node mới vào đúng chỗ trống tìm được khi đi xuống cây, đúng cho cả cây rỗng lẫn không rỗng.'), weight: 1, maxScore: 1.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>f4() – 2.5 marks: Count Songs within an ID Range</strong></p><ul><li>File: SongBST.java</li><li>Method to Complete: <code>countInRange(String minId, String maxId)</code></li><li>Task: efficiently count the number of songs in the library whose songId falls within a given alphabetical range (inclusive). For example, count all songs between "S02" and "S04". To do this efficiently, use the BST property to avoid searching branches that are entirely outside the desired range. This method should return an int.</li></ul>`,
    `<p><strong>f4() – 2.5 điểm: Đếm bài hát trong 1 khoảng ID</strong></p><ul><li>File: SongBST.java</li><li>Method cần hoàn thiện: <code>countInRange(String minId, String maxId)</code></li><li>Nhiệm vụ: đếm HIỆU QUẢ số bài hát trong thư viện có songId nằm trong khoảng chữ cái cho trước (bao gồm cả 2 đầu). Ví dụ, đếm mọi bài giữa "S02" và "S04". Để hiệu quả, dùng tính chất BST để tránh tìm các nhánh nằm hoàn toàn ngoài khoảng cần đếm. Method này trả về int.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `--- Initial Library State ---
--- Song Library (In-Order) ---
(S01, Hey_Jude, The_Beatles)
(S02, Eleanor_Rigby, The_Beatles)
(S03, Yesterday, The_Beatles)
(S04, Come_Together, The_Beatles)
(S05, Let_It_Be, The_Beatles)
Result: Found 3 songs in the specified range.`,
  explanation: B(
    `<p>Verified by compiling and running a full reference solution against the same S01-S05 library, counting songs in range [S02, S04] — result is 3 (S02, S03, S04), matching this paper's own worked example exactly. The recursion only descends left when the current node's songId is greater than minId (there could be values &gt;= minId on that side), and only descends right when the current node's songId is less than maxId — pruning branches entirely outside the range instead of visiting every node.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy thật 1 lời giải tham chiếu trên cùng thư viện S01-S05, đếm bài trong khoảng [S02, S04] — kết quả là 3 (S02, S03, S04), khớp đúng ví dụ minh hoạ của đề. Đệ quy chỉ đi xuống trái khi songId của node hiện tại lớn hơn minId (bên đó có thể còn giá trị &gt;= minId), và chỉ đi xuống phải khi songId của node hiện tại nhỏ hơn maxId — cắt bỏ nhánh nằm hoàn toàn ngoài khoảng thay vì duyệt hết mọi node.</p>`,
  ),
  rubric: [
    { id: 'inclusive_range', criterion: B('Correctly counts nodes with songId in the inclusive range [minId, maxId].', 'Đếm đúng node có songId trong khoảng bao gồm cả 2 đầu [minId, maxId].'), weight: 1, maxScore: 1 },
    { id: 'bst_pruning', criterion: B('Uses the BST ordering to skip descending into a subtree that cannot contain any value in range, rather than visiting every node unconditionally.', 'Dùng thứ tự BST để bỏ qua việc đi vào cây con không thể chứa giá trị nào trong khoảng, thay vì duyệt vô điều kiện mọi node.'), weight: 1, maxScore: 1.5 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE6',
    title: 'PE Đề 6 — Practical Exam (Fall 2025, Block 3-Week)|||PE Đề 6 — Thi thực hành (Fall 2025, Block 3-Week)',
    description: 'CSD201 PE (CODE): music library with a BST (SongBST) and a circular linked list playlist (PlaylistCLL), written from scratch (no given project), AI-graded.|||PE CSD201 (viết mã): thư viện nhạc dùng BST (SongBST) và playlist danh sách liên kết vòng (PlaylistCLL), viết từ đầu (không có project given), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
