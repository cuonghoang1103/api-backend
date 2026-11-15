/**
 * IT Interview Prep — Chương 7: Vòng coding và system design (soạn 15/11/2026).
 * Khoá chữ (không slide ảnh), khuôn Mục 0 + helper ./_pv.mjs. GIỮ slug bài của khung cũ (pv-7-1 … pv-7-4).
 * Khoá dsa-interview và system-design trên trang mới là KHUNG ⇒ phần cốt lõi nằm ngay trong bài này.
 * LUẬT: backtick → &#96;; không viết "${" trong chữ hay code mẫu; < > & trong chữ → &lt; &gt; &amp;; không gạch chéo ngược.
 * Code mẫu (JavaScript + Java) đặt trong hằng template riêng, dòng đóng đứng một mình, đưa qua ma().
 */
import { ma, ra, lienKet, nguon, yt, flow, stack, bang, bay, keXau, doiThuong, neu, qa, thucHanh, thuatNgu, tomTat, lienQuan, rubric, cau } from './_pv.mjs';

/* ─────────────── code mẫu 7.1: tám mẫu bài ─────────────── */
const JS_HASH = `
// Two Sum — return indices of two numbers that add up to target. O(n) time, O(n) space.
function twoSum(nums, target) {
  const seen = new Map();                    // value -> index where we saw it
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
`;
const JAVA_HASH = `
int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> seen = new HashMap<>();   // value -> index
  for (int i = 0; i < nums.length; i++) {
    Integer j = seen.get(target - nums[i]);
    if (j != null) return new int[] { j, i };
    seen.put(nums[i], i);
  }
  return new int[0];
}
`;
const JS_TWO = `
// Valid palindrome, ignoring case and anything that is not a letter or digit. O(n), O(1).
function isPalindrome(s) {
  const ok = (c) => /[a-z0-9]/i.test(c);
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (!ok(s[i])) { i++; continue; }
    if (!ok(s[j])) { j--; continue; }
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++; j--;
  }
  return true;
}
`;
const JAVA_TWO = `
boolean isPalindrome(String s) {
  int i = 0, j = s.length() - 1;
  while (i < j) {
    char a = s.charAt(i), b = s.charAt(j);
    if (!Character.isLetterOrDigit(a)) { i++; continue; }
    if (!Character.isLetterOrDigit(b)) { j--; continue; }
    if (Character.toLowerCase(a) != Character.toLowerCase(b)) return false;
    i++; j--;
  }
  return true;
}
`;
const JS_WIN = `
// Length of the longest substring without repeating characters. O(n), O(k) for k distinct chars.
function longestUnique(s) {
  const last = new Map();                    // char -> last index seen
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;   // shrink past the repeat
    last.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
`;
const JAVA_WIN = `
int longestUnique(String s) {
  Map<Character, Integer> last = new HashMap<>();
  int best = 0, left = 0;
  for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    Integer p = last.get(c);
    if (p != null && p >= left) left = p + 1;
    last.put(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
`;
const JS_STACK = `
// Valid brackets: "([]{})" is valid, "(]" and "((" are not. O(n), O(n).
function isValid(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c);
    else if (stack.pop() !== pair[c]) return false;   // empty stack pops undefined -> false
  }
  return stack.length === 0;
}
`;
const JAVA_STACK = `
boolean isValid(String s) {
  Deque<Character> stack = new ArrayDeque<>();
  for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') { stack.push(c); continue; }
    if (stack.isEmpty()) return false;
    char open = stack.pop();
    if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
  }
  return stack.isEmpty();
}
`;
const JS_BIN = `
// First index whose value is >= target in a sorted array (lower bound). O(log n).
function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;              // the answer is somewhere in [lo, hi]
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) lo = mid + 1;    // answer is to the right of mid
    else hi = mid;                           // mid could be the answer
  }
  return lo;                                 // nums.length if every value < target
}
`;
const JAVA_BIN = `
int lowerBound(int[] nums, int target) {
  int lo = 0, hi = nums.length;
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;            // not (lo + hi) / 2: that can overflow int
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
`;
const JS_BFS = `
// Count islands of '1' in a grid, moving up/down/left/right. O(rows * cols).
function countIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  const seen = grid.map((row) => row.map(() => false));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '1' || seen[r][c]) continue;
      islands++;
      const queue = [[r, c]];
      seen[r][c] = true;
      for (let head = 0; head < queue.length; head++) {   // index instead of shift(): O(1)
        const [y, x] = queue[head];
        for (const [dy, dx] of dirs) {
          const ny = y + dy, nx = x + dx;
          if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
          if (grid[ny][nx] !== '1' || seen[ny][nx]) continue;
          seen[ny][nx] = true;
          queue.push([ny, nx]);
        }
      }
    }
  }
  return islands;
}
`;
const JAVA_BFS = `
int countIslands(char[][] grid) {
  int rows = grid.length, cols = grid[0].length, islands = 0;
  boolean[][] seen = new boolean[rows][cols];
  int[][] dirs = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (grid[r][c] != '1' || seen[r][c]) continue;
      islands++;
      Deque<int[]> queue = new ArrayDeque<>();
      queue.add(new int[] { r, c });
      seen[r][c] = true;
      while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        for (int[] d : dirs) {
          int ny = cur[0] + d[0], nx = cur[1] + d[1];
          if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
          if (grid[ny][nx] != '1' || seen[ny][nx]) continue;
          seen[ny][nx] = true;
          queue.add(new int[] { ny, nx });
        }
      }
    }
  }
  return islands;
}
`;
const JS_GREEDY = `
// Merge overlapping bookings: [[9,11],[10,12],[14,15]] -> [[9,12],[14,15]]. O(n log n).
function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // copy, do not mutate input
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}
`;
const JAVA_GREEDY = `
int[][] merge(int[][] intervals) {
  int[][] sorted = intervals.clone();
  Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
  List<int[]> out = new ArrayList<>();
  for (int[] cur : sorted) {
    int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
    if (last != null && cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else out.add(new int[] { cur[0], cur[1] });
  }
  return out.toArray(new int[0][]);
}
`;
const JS_DP = `
// Fewest coins to make amount (or -1). dp[x] = fewest coins for x. O(amount * coins).
function minCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++) {
    for (const c of coins) {
      if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
`;
const JAVA_DP = `
int minCoins(int[] coins, int amount) {
  int INF = amount + 1;                      // more coins than could ever be needed
  int[] dp = new int[amount + 1];
  Arrays.fill(dp, INF);
  dp[0] = 0;
  for (int x = 1; x <= amount; x++)
    for (int c : coins)
      if (c <= x && dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
  return dp[amount] == INF ? -1 : dp[amount];
}
`;

/** Một mẫu bài: lời giải ngắn + JS + Java (dùng chung cho hai khối ngôn ngữ). */
const giai = (p, js, java) => `<p>${p}</p>${ma('js', js)}${ma('java', java)}`;

const L71 = {
  title: '7.1 — The coding round in one lesson: a solving framework, Big-O, and eight patterns with solutions in JavaScript and Java|||7.1 — Vòng coding trong một bài: khung giải, Big-O, và tám mẫu bài có lời giải bằng JavaScript và Java',
  slug: 'pv-7-1-coding',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khung sáu bước để giải mọi bài coding phỏng vấn (hiểu đề, ví dụ, brute force, tối ưu, code, test), Big-O đủ dùng, và tám mẫu hay gặp nhất ở vòng thực tập — hash map, hai con trỏ, cửa sổ trượt, stack, tìm kiếm nhị phân, BFS/DFS, sắp xếp + tham lam, quy hoạch động nhập môn — mỗi mẫu một bài giải bằng JavaScript và Java.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The coding round in one lesson: a framework, Big-O, and eight patterns</h2>
<p class="lead">Many internship processes in Vietnam include one coding step: an online test on a platform such as HackerRank or Codility, or one problem solved live with an engineer. The problems for interns are usually "easy" to "medium" and come from a small set of patterns. You do not need hundreds of problems before your first interview; you need a <strong>repeatable way to solve</strong>, enough <strong>Big-O</strong> to talk about cost, and the <strong>eight patterns</strong> below, each practised until you can write it from a blank page.</p>

<h3>An everyday picture: a recipe, not a memory test</h3>
${doiThuong('en', 'A cook who memorised fifty dishes is lost when the fridge has different ingredients. A cook who knows techniques — braise, stir-fry, steam — can make something good from anything. Coding problems are the same: the interviewer changes the story ("lab bookings" instead of "meetings"), but underneath it is one of a few techniques. Learn to recognise the technique from the shape of the problem.')}

<h3>The six-step framework (say each step out loud)</h3>
${flow([
  ['1 · Understand', 'restate and ask', 'Repeat the problem in your own words. Ask about input size, empty input, duplicates, negative numbers, sorted or not, what to return when there is no answer.'],
  ['2 · Examples', 'two small cases + one edge case', 'Write them down. They become your tests in step 6.'],
  ['3 · Brute force', 'the obvious solution and its cost', '"Check every pair — O(n²)." Saying it proves you understand the problem, and gives you a fallback.'],
  ['4 · Optimise', 'find the pattern', 'Which repeated work can a hash map, two pointers, sorting or a stack remove? Agree on the approach with the interviewer before coding.'],
  ['5 · Code', 'clean, named, narrated', 'Meaningful names, small helper functions. Talk while you type.'],
  ['6 · Test', 'run your examples by hand', 'Trace the code line by line on an example, then the edge case. Fix bugs calmly; finish with time and space complexity.'],
])}

<h3>Big-O, just enough</h3>
${bang(['Big-O', 'Name', 'Typical source', 'n = 100,000 feels like'], [
  ['O(1)', 'constant', 'array index, hash map get/set (average)', 'instant'],
  ['O(log n)', 'logarithmic', 'binary search, balanced tree', 'about 17 steps'],
  ['O(n)', 'linear', 'one pass over the input', 'instant'],
  ['O(n log n)', 'linearithmic', 'sorting', 'fast'],
  ['O(n²)', 'quadratic', 'nested loops over the input', '10 billion steps — too slow'],
  ['O(2ⁿ)', 'exponential', 'trying every subset', 'impossible beyond n ≈ 30'],
])}
<p>A rule of thumb for online tests: if n can be around 10⁵, an O(n²) solution will usually time out; aim for O(n log n) or O(n). Always state space too — a hash map that buys O(n) time costs O(n) memory.</p>

<h3>Eight patterns, with solutions</h3>
${bang(['Pattern', 'Signals in the problem', 'Typical cost'], [
  ['Hash map / set', '"find a pair", "count", "seen before", "duplicates"', 'O(n) time, O(n) space'],
  ['Two pointers', 'sorted array, palindrome, "pair in sorted"', 'O(n), O(1)'],
  ['Sliding window', '"longest/shortest substring or subarray that…"', 'O(n)'],
  ['Stack', 'brackets, "next greater", undo, nested structure', 'O(n)'],
  ['Binary search', 'sorted data, "first/last position", "minimum that works"', 'O(log n)'],
  ['BFS / DFS', 'grid, graph, "connected", "shortest number of steps"', 'O(V + E)'],
  ['Sort + greedy', 'intervals, scheduling, "maximum number of…"', 'O(n log n)'],
  ['Dynamic programming', '"number of ways", "minimum cost", overlapping subproblems', 'O(states × choices)'],
])}
${qa('en', { so: '7.1-1 · Hash map', q: 'Two Sum: given an array and a target, return the indices of two numbers that add up to the target.', chu: 'trading memory for time — the most common first question.',
  a: giai('Brute force checks every pair: O(n²). Instead, walk once and remember each value’s index in a map; for each number, check whether <code>target − number</code> was already seen. One pass, O(n) time and O(n) space. Check the value before inserting the current one, so a number is not paired with itself.', JS_HASH, JAVA_HASH),
  sau: ['What if the array is sorted? (two pointers, O(1) space)', 'What if there can be many answers — return all pairs?'],
  loi: 'Jumping straight to code without saying the brute force and its cost.' })}
${qa('en', { so: '7.1-2 · Two pointers', q: 'Is a string a palindrome if you ignore case and non-alphanumeric characters?', chu: 'pointer movement and edge cases.',
  a: giai('One pointer at each end, moving inward, skipping characters that are not letters or digits, and comparing in lower case. O(n) time, O(1) extra space — no reversed copy needed.', JS_TWO, JAVA_TWO),
  sau: ['What about Vietnamese letters with diacritics?', 'Can you allow deleting at most one character?'],
  loi: 'Building a cleaned, reversed copy and calling it optimal — it works but uses O(n) memory, and you should say so.' })}
${qa('en', { so: '7.1-3 · Sliding window', q: 'Find the length of the longest substring without repeating characters.', chu: 'maintaining a window invariant.',
  a: giai('Keep a window [left, right] with no repeats. Move right one step at a time; if the new character was seen inside the window, jump left past its previous position. Track the best length. Each index moves forward only, so O(n).', JS_WIN, JAVA_WIN),
  sau: ['Why must you check that the last position is ≥ left?', 'Return the substring itself, not only its length.'],
  loi: 'Restarting the scan from scratch at every repeat — O(n²) in disguise.' })}
${qa('en', { so: '7.1-4 · Stack', q: 'Given a string of brackets ()[]{}, decide whether it is valid.', chu: 'recognising last-in-first-out structure.',
  a: giai('Push every opening bracket; on a closing bracket, the top of the stack must be its partner. At the end the stack must be empty. Edge cases: a closing bracket on an empty stack, and leftover openers.', JS_STACK, JAVA_STACK),
  sau: ['Where else does this pattern appear? (undo, expression evaluation, HTML tag matching)'],
  loi: 'Counting brackets instead of matching them — "([)]" has equal counts and is invalid.' })}
${qa('en', { so: '7.1-5 · Binary search', q: 'In a sorted array, find the first index whose value is at least target.', chu: 'off-by-one discipline.',
  a: giai('Search a half-open range [lo, hi). If the middle value is too small, the answer is to the right; otherwise mid itself may be the answer, so keep it. When lo meets hi, that is the answer — possibly the array length if every value is smaller. In Java, compute mid as lo + (hi − lo) / 2 to avoid integer overflow.', JS_BIN, JAVA_BIN),
  sau: ['How do you find the last index equal to target?', '"Binary search on the answer": the smallest capacity that ships all packages in D days.'],
  loi: 'Mixing closed and half-open ranges, causing an infinite loop or a missed element.' })}
${qa('en', { so: '7.1-6 · BFS / DFS', q: 'Count the islands of land ("1") in a grid, connecting up, down, left and right.', chu: 'graph traversal on a grid.',
  a: giai('Scan every cell; each unvisited land cell starts a new island, and a breadth-first search marks all land connected to it. Every cell is visited once: O(rows × cols). In JavaScript, use a head index instead of <code>queue.shift()</code>, which is O(n) per call. DFS with a stack or recursion works too; recursion can overflow the call stack on a large grid.', JS_BFS, JAVA_BFS),
  sau: ['Shortest number of steps from start to exit in a maze — why BFS and not DFS?', 'Can you do it without the seen array?'],
  loi: 'Forgetting to mark a cell as seen when it is added to the queue, so it is added many times.' })}
${qa('en', { so: '7.1-7 · Sort + greedy', q: 'Merge overlapping lab bookings given as [start, end] pairs.', chu: 'seeing that sorting makes a greedy choice safe.',
  a: giai('Sort by start time. Then a booking either overlaps the last merged one (extend its end) or starts a new block. Sorting dominates: O(n log n). Copy before sorting if the caller should not see the input reordered.', JS_GREEDY, JAVA_GREEDY),
  sau: ['How many rooms are needed so no bookings clash? (sort starts and ends, or a min-heap)', 'Do touching intervals like [9,10] and [10,11] merge? Ask!'],
  loi: 'Not asking whether touching intervals count as overlapping.' })}
${qa('en', { so: '7.1-8 · Dynamic programming', q: 'Given coin values and an amount, return the fewest coins that make the amount, or −1.', chu: 'defining a state and a transition.',
  a: giai('Greedy (always the biggest coin) fails for coins like [1, 3, 4] and amount 6 (greedy gives 4+1+1, the best is 3+3). Define dp[x] = fewest coins for amount x; dp[0] = 0; dp[x] = 1 + min over coins c ≤ x of dp[x − c]. Fill from small to large: O(amount × number of coins) time, O(amount) space.', JS_DP, JAVA_DP),
  sau: ['Count the number of ways instead of the minimum.', 'How would you write it top-down with memoisation?'],
  loi: 'Trying greedy without testing a counter-example first.' })}
${qa('en', { so: '7.1-9', q: 'Why is a hash map lookup "O(1)", and is it always?', chu: 'whether you know averages vs worst cases.',
  a: '<p>The key is hashed to a bucket index, so on average a lookup touches one bucket — constant time. The worst case is O(n) when many keys collide into the same bucket; Java’s HashMap turns a long bucket into a balanced tree, making that worst case O(log n). The map also resizes when it fills up, which is occasionally expensive but O(1) amortised. In Java, keys need consistent <code>equals</code> and <code>hashCode</code>.</p>',
  sau: ['What breaks if you mutate a key object after putting it in a HashMap?'],
  loi: 'Saying "always O(1)".' })}
${qa('en', { so: '7.1-10', q: 'What does the built-in sort cost in JavaScript and Java?', chu: 'knowing your tools.',
  a: '<p>Comparison sorting is O(n log n). V8 (Node and Chrome) uses TimSort for <code>Array.prototype.sort</code>, which is stable. Java uses a dual-pivot quicksort for arrays of primitives (not stable, but stability does not matter for primitives) and TimSort for objects (stable). And a JavaScript trap: <code>[10, 9, 1].sort()</code> compares as strings and gives [1, 10, 9] — always pass a comparator for numbers.</p>',
  sau: ['What does "stable" mean, and when does it matter?'],
  loi: 'Not knowing the default JavaScript sort is lexicographic.' })}

${bay('en', 'grinding hundreds of problems without the framework.', 'Solving silently and fast at home does not transfer to an interview where you must talk, ask and test. Ten problems done with all six steps out loud beat fifty done in silence. Re-solve the eight patterns above from a blank file until each takes under fifteen minutes.')}
${keXau('en', 'online coding tests are monitored more and more: copy-paste detection, tab-switch logging, webcam proctoring, and follow-up interviews where you must explain your submitted code. Using an AI tool or a friend in a test that forbids it is not a shortcut; it gets flagged or exposed in the next round. Use AI to learn the patterns beforehand — honestly — and solve the test yourself.')}
${neu('en', 'you recognise no pattern at all? Do not freeze. Say the brute force, code it cleanly, test it, and state its cost. A correct O(n²) solution with clear reasoning often passes an internship round; a half-written "clever" solution does not.')}

${thucHanh('en', { phut: '60–90', steps: [
  'Create a folder <code>~/interview-kit/tech/patterns</code>. For each of the eight problems, write the solution from a blank file in your main language, without looking.',
  'For each, write three tests (two normal, one edge case) and run them.',
  'Pick three problems and solve them again out loud using the six steps, recording yourself; keep each under 20 minutes.',
  'Write the time and space complexity in a comment at the top of each file.',
], dat: 'eight working solutions with tests and complexity, and three recordings where you followed all six steps.' })}
${thuatNgu('en', [
  ['Big-O', 'How cost grows with input size, ignoring constants.'],
  ['Brute force', 'The straightforward solution that tries everything.'],
  ['Edge case', 'An unusual input: empty, one element, duplicates, negatives, very large.'],
  ['Two pointers', 'Two indices moving through the data, often from both ends.'],
  ['Sliding window', 'A moving range over a sequence, kept valid as it slides.'],
  ['BFS / DFS', 'Breadth-first (by layers, finds shortest steps) / depth-first traversal.'],
  ['Greedy', 'Taking the locally best choice at each step — correct only for some problems.'],
  ['Dynamic programming', 'Building the answer from answers to smaller subproblems.'],
])}
${tomTat('en', [
  'Use six steps every time: understand, examples, brute force, optimise, code, test — out loud.',
  'Know Big-O well enough to reject O(n²) for n ≈ 10⁵ and to state space cost.',
  'Recognise eight patterns from signals in the problem statement.',
  'Re-solve each pattern from a blank file until it takes under fifteen minutes.',
  'A clean, tested brute force beats an unfinished clever idea.',
  'Never cheat in monitored tests; the next round asks you to explain your code.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-big-o', academy: true, L: 'en', title: 'Academy · CSD201 0.3 — Big-O: the language of efficiency', sub: 'The theory behind the table above, with Java.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bam', academy: true, L: 'en', title: 'Academy · CSD201 7.1 — Hash tables and collisions', sub: 'Why hash maps are O(1) on average.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bfs', academy: true, L: 'en', title: 'Academy · CSD201 5.4 — BFS and shortest paths', sub: 'The graph view of pattern 7.1-6.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-cs1-on', academy: true, L: 'en', title: 'Academy · CSD201 ⭐ CS.1 — Seven interview-style binary search problems', sub: 'More practice for pattern 7.1-5.' }),
  yt('Q4C3ZRJLnac', 'Anthony D. Mays', 'How to Solve ANY Coding Interview Question in 6 Steps', 13, 'en'),
  nguon('🗺️', 'NeetCode Roadmap', 'A free, ordered list of problems grouped by these patterns.', 'https://neetcode.io/roadmap'),
  nguon('📊', 'Big-O Cheat Sheet', 'Costs of common data structures and sorts on one page.', 'https://bigocheatsheet.com/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Vòng coding trong một bài: một khung giải, Big-O, và tám mẫu bài</h2>
<p class="lead">Nhiều quy trình thực tập ở Việt Nam có một bước coding: bài test online trên nền tảng như HackerRank hay Codility, hoặc một bài giải trực tiếp với kỹ sư. Đề cho thực tập sinh thường ở mức "dễ" tới "trung bình" và đến từ một tập mẫu nhỏ. Bạn không cần giải hàng trăm bài trước buổi phỏng vấn đầu tiên; bạn cần một <strong>cách giải lặp lại được</strong>, đủ <strong>Big-O</strong> để nói về chi phí, và <strong>tám mẫu</strong> dưới đây, mỗi mẫu luyện tới mức viết lại được từ trang trắng.</p>

<h3>Liên tưởng đời thường: công thức nấu, không phải bài kiểm tra trí nhớ</h3>
${doiThuong('vi', 'Một đầu bếp thuộc lòng năm mươi món sẽ lúng túng khi tủ lạnh có nguyên liệu khác. Một đầu bếp nắm kỹ thuật — kho, xào, hấp — nấu được món ngon từ bất cứ thứ gì. Bài coding cũng vậy: người phỏng vấn đổi câu chuyện ("lịch đặt phòng lab" thay vì "cuộc họp"), nhưng bên dưới là một trong vài kỹ thuật. Hãy học nhận ra kỹ thuật từ HÌNH DẠNG của đề.')}

<h3>Khung sáu bước (nói từng bước thành tiếng)</h3>
${flow([
  ['1 · Hiểu đề', 'nhắc lại và hỏi', 'Nhắc lại đề bằng lời của bạn. Hỏi về kích thước đầu vào, đầu vào rỗng, phần tử trùng, số âm, đã sắp xếp chưa, trả về gì khi không có đáp án.'],
  ['2 · Ví dụ', 'hai trường hợp nhỏ + một trường hợp biên', 'Viết ra. Chúng thành test của bạn ở bước 6.'],
  ['3 · Brute force (vét cạn)', 'lời giải hiển nhiên và chi phí của nó', '"Thử mọi cặp — O(n²)." Nói ra cho thấy bạn hiểu đề, và cho bạn một đường lùi.'],
  ['4 · Tối ưu', 'tìm mẫu', 'Phần việc lặp lại nào bỏ được nhờ hash map, hai con trỏ, sắp xếp hay stack? Thống nhất hướng làm với người phỏng vấn TRƯỚC khi code.'],
  ['5 · Code', 'sạch, đặt tên rõ, vừa làm vừa nói', 'Tên có nghĩa, hàm phụ nhỏ. Nói trong lúc gõ.'],
  ['6 · Test', 'chạy tay các ví dụ', 'Dò code từng dòng trên một ví dụ, rồi trường hợp biên. Sửa lỗi bình tĩnh; kết thúc bằng độ phức tạp thời gian và bộ nhớ.'],
])}

<h3>Big-O, vừa đủ dùng</h3>
${bang(['Big-O', 'Tên', 'Hay gặp ở', 'n = 100.000 cảm giác như'], [
  ['O(1)', 'hằng số', 'truy cập mảng theo chỉ số, get/set hash map (trung bình)', 'tức thì'],
  ['O(log n)', 'logarit', 'tìm kiếm nhị phân, cây cân bằng', 'khoảng 17 bước'],
  ['O(n)', 'tuyến tính', 'một lượt duyệt đầu vào', 'tức thì'],
  ['O(n log n)', 'n log n', 'sắp xếp', 'nhanh'],
  ['O(n²)', 'bình phương', 'hai vòng lặp lồng nhau trên đầu vào', '10 tỉ bước — quá chậm'],
  ['O(2ⁿ)', 'mũ', 'thử mọi tập con', 'bất khả thi khi n quá ~30'],
])}
<p>Luật kinh nghiệm cho bài test online: nếu n có thể tới khoảng 10⁵, lời giải O(n²) thường quá giờ; nhắm O(n log n) hoặc O(n). Luôn nói cả bộ nhớ — một hash map mua được thời gian O(n) thì tốn O(n) bộ nhớ.</p>

<h3>Tám mẫu, kèm lời giải</h3>
${bang(['Mẫu', 'Dấu hiệu trong đề', 'Chi phí thường gặp'], [
  ['Hash map / set', '"tìm một cặp", "đếm", "đã gặp chưa", "trùng lặp"', 'O(n) thời gian, O(n) bộ nhớ'],
  ['Hai con trỏ', 'mảng đã sắp xếp, palindrome, "cặp trong mảng đã sắp"', 'O(n), O(1)'],
  ['Cửa sổ trượt', '"chuỗi con/mảng con dài nhất/ngắn nhất mà…"', 'O(n)'],
  ['Stack', 'ngoặc, "phần tử lớn hơn kế tiếp", hoàn tác, cấu trúc lồng nhau', 'O(n)'],
  ['Tìm kiếm nhị phân', 'dữ liệu đã sắp, "vị trí đầu/cuối", "giá trị nhỏ nhất thoả"', 'O(log n)'],
  ['BFS / DFS', 'lưới, đồ thị, "liên thông", "số bước ít nhất"', 'O(V + E)'],
  ['Sắp xếp + tham lam', 'khoảng thời gian, xếp lịch, "số lượng lớn nhất…"', 'O(n log n)'],
  ['Quy hoạch động', '"số cách", "chi phí nhỏ nhất", bài toán con chồng lặp', 'O(số trạng thái × số lựa chọn)'],
])}
${qa('vi', { so: '7.1-1 · Hash map', q: 'Two Sum: cho một mảng và một target, trả về chỉ số của hai số có tổng bằng target.', chu: 'đổi bộ nhớ lấy thời gian — câu đầu tiên hay gặp nhất.',
  a: giai('Vét cạn thử mọi cặp: O(n²). Thay vào đó, duyệt một lượt và nhớ chỉ số của từng giá trị trong một map; với mỗi số, xem <code>target − số</code> đã gặp chưa. Một lượt, O(n) thời gian và O(n) bộ nhớ. Kiểm giá trị TRƯỚC khi chèn số hiện tại, để một số không tự ghép với chính nó.', JS_HASH, JAVA_HASH),
  sau: ['Nếu mảng đã sắp xếp thì sao? (hai con trỏ, bộ nhớ O(1))', 'Nếu có nhiều đáp án — trả về mọi cặp?'],
  loi: 'Nhảy thẳng vào code mà không nói lời giải vét cạn và chi phí của nó.' })}
${qa('vi', { so: '7.1-2 · Hai con trỏ', q: 'Một chuỗi có phải palindrome không nếu bỏ qua hoa thường và các ký tự không phải chữ/số?', chu: 'cách di chuyển con trỏ và trường hợp biên.',
  a: giai('Mỗi đầu một con trỏ, đi dần vào giữa, bỏ qua ký tự không phải chữ hay số, so sánh ở dạng chữ thường. O(n) thời gian, O(1) bộ nhớ thêm — không cần tạo bản đảo ngược.', JS_TWO, JAVA_TWO),
  sau: ['Còn chữ tiếng Việt có dấu thì sao?', 'Cho phép xoá tối đa một ký tự thì làm thế nào?'],
  loi: 'Tạo một bản sao đã làm sạch rồi đảo ngược và gọi đó là tối ưu — nó chạy được nhưng tốn O(n) bộ nhớ, và bạn nên nói ra điều đó.' })}
${qa('vi', { so: '7.1-3 · Cửa sổ trượt', q: 'Tìm độ dài chuỗi con dài nhất không có ký tự lặp.', chu: 'giữ một bất biến của cửa sổ.',
  a: giai('Giữ một cửa sổ [left, right] không có ký tự lặp. Đẩy right từng bước; nếu ký tự mới đã xuất hiện bên trong cửa sổ, nhảy left qua vị trí cũ của nó. Ghi lại độ dài tốt nhất. Mỗi chỉ số chỉ đi tới, nên O(n).', JS_WIN, JAVA_WIN),
  sau: ['Vì sao phải kiểm vị trí cũ ≥ left?', 'Trả về chính chuỗi con, không chỉ độ dài.'],
  loi: 'Duyệt lại từ đầu mỗi khi gặp ký tự lặp — O(n²) trá hình.' })}
${qa('vi', { so: '7.1-4 · Stack', q: 'Cho một chuỗi ngoặc ()[]{}, xác định nó có hợp lệ không.', chu: 'nhận ra cấu trúc vào sau ra trước (LIFO).',
  a: giai('Đẩy mọi ngoặc mở vào stack; gặp ngoặc đóng thì đỉnh stack phải là ngoặc mở tương ứng. Cuối cùng stack phải rỗng. Trường hợp biên: ngoặc đóng khi stack rỗng, và ngoặc mở còn sót lại.', JS_STACK, JAVA_STACK),
  sau: ['Mẫu này còn xuất hiện ở đâu? (hoàn tác, tính biểu thức, khớp thẻ HTML)'],
  loi: 'Đếm số ngoặc thay vì khớp chúng — "([)]" có số lượng bằng nhau mà vẫn sai.' })}
${qa('vi', { so: '7.1-5 · Tìm kiếm nhị phân', q: 'Trong một mảng đã sắp xếp, tìm chỉ số đầu tiên có giá trị lớn hơn hoặc bằng target.', chu: 'kỷ luật về lệch một (off-by-one).',
  a: giai('Tìm trong khoảng nửa mở [lo, hi). Nếu giá trị ở giữa quá nhỏ, đáp án nằm bên phải; ngược lại chính mid có thể là đáp án, nên giữ nó lại. Khi lo gặp hi, đó là đáp án — có thể bằng độ dài mảng nếu mọi giá trị đều nhỏ hơn. Trong Java, tính mid bằng lo + (hi − lo) / 2 để tránh tràn số nguyên.', JS_BIN, JAVA_BIN),
  sau: ['Tìm chỉ số CUỐI CÙNG bằng target thế nào?', '"Tìm kiếm nhị phân trên đáp án": tải trọng nhỏ nhất để chở hết hàng trong D ngày.'],
  loi: 'Trộn khoảng đóng và khoảng nửa mở, gây vòng lặp vô tận hoặc sót phần tử.' })}
${qa('vi', { so: '7.1-6 · BFS / DFS', q: 'Đếm số hòn đảo đất ("1") trong một lưới, nối theo trên, dưới, trái, phải.', chu: 'duyệt đồ thị trên lưới.',
  a: giai('Quét mọi ô; mỗi ô đất chưa thăm mở ra một đảo mới, và một lượt tìm kiếm theo chiều rộng (BFS) đánh dấu toàn bộ đất nối với nó. Mỗi ô thăm một lần: O(số hàng × số cột). Trong JavaScript dùng một chỉ số đầu hàng đợi thay vì <code>queue.shift()</code> — mỗi lần shift tốn O(n). DFS bằng stack hay đệ quy cũng được; đệ quy có thể tràn ngăn xếp gọi hàm với lưới lớn.', JS_BFS, JAVA_BFS),
  sau: ['Số bước ít nhất từ cửa vào tới cửa ra trong mê cung — vì sao BFS mà không phải DFS?', 'Làm được mà không cần mảng seen không?'],
  loi: 'Quên đánh dấu ô là đã thăm ngay khi cho vào hàng đợi, khiến nó bị thêm nhiều lần.' })}
${qa('vi', { so: '7.1-7 · Sắp xếp + tham lam', q: 'Gộp các lượt đặt phòng lab chồng nhau, cho dưới dạng cặp [bắt đầu, kết thúc].', chu: 'thấy rằng sắp xếp làm cho lựa chọn tham lam trở nên an toàn.',
  a: giai('Sắp xếp theo giờ bắt đầu. Khi đó một lượt đặt hoặc chồng lên khối vừa gộp (kéo dài giờ kết thúc), hoặc mở một khối mới. Sắp xếp chiếm phần lớn chi phí: O(n log n). Sao chép trước khi sắp xếp nếu người gọi không muốn thấy đầu vào bị đổi thứ tự.', JS_GREEDY, JAVA_GREEDY),
  sau: ['Cần bao nhiêu phòng để không lượt nào đụng nhau? (sắp xếp giờ bắt đầu và kết thúc, hoặc min-heap)', 'Hai khoảng chạm nhau như [9,10] và [10,11] có gộp không? Hãy hỏi!'],
  loi: 'Không hỏi khoảng chạm nhau có tính là chồng không.' })}
${qa('vi', { so: '7.1-8 · Quy hoạch động', q: 'Cho mệnh giá các đồng xu và một số tiền, trả về số đồng xu ít nhất để tạo ra số tiền đó, hoặc −1.', chu: 'định nghĩa trạng thái và công thức chuyển.',
  a: giai('Tham lam (luôn lấy đồng lớn nhất) sai với mệnh giá [1, 3, 4] và số tiền 6 (tham lam ra 4+1+1, tốt nhất là 3+3). Định nghĩa dp[x] = số đồng ít nhất cho số tiền x; dp[0] = 0; dp[x] = 1 + nhỏ nhất của dp[x − c] với mọi đồng c ≤ x. Điền từ nhỏ tới lớn: O(số tiền × số mệnh giá) thời gian, O(số tiền) bộ nhớ.', JS_DP, JAVA_DP),
  sau: ['Đếm SỐ CÁCH thay vì số đồng ít nhất.', 'Viết từ trên xuống có ghi nhớ (memoisation) thế nào?'],
  loi: 'Thử tham lam mà không thử tìm phản ví dụ trước.' })}
${qa('vi', { so: '7.1-9', q: 'Vì sao tra hash map là "O(1)", và có phải lúc nào cũng vậy?', chu: 'bạn có phân biệt trung bình với trường hợp xấu nhất.',
  a: '<p>Khoá được băm ra chỉ số một ngăn (bucket), nên trung bình mỗi lần tra chỉ đụng một ngăn — thời gian hằng số. Trường hợp xấu nhất là O(n) khi nhiều khoá đụng cùng một ngăn; HashMap của Java biến một ngăn dài thành cây cân bằng, đưa trường hợp xấu đó về O(log n). Map còn tự nới rộng khi đầy, thỉnh thoảng tốn kém nhưng tính bình quân vẫn O(1). Trong Java, khoá cần <code>equals</code> và <code>hashCode</code> nhất quán với nhau.</p>',
  sau: ['Đổi nội dung một đối tượng khoá sau khi đã put vào HashMap thì hỏng gì?'],
  loi: 'Nói "luôn luôn O(1)".' })}
${qa('vi', { so: '7.1-10', q: 'Hàm sort có sẵn trong JavaScript và Java tốn bao nhiêu?', chu: 'hiểu công cụ của mình.',
  a: '<p>Sắp xếp so sánh là O(n log n). V8 (Node và Chrome) dùng TimSort cho <code>Array.prototype.sort</code>, và nó ổn định (stable). Java dùng quicksort hai trục (dual-pivot) cho mảng kiểu nguyên thuỷ (không ổn định, nhưng với kiểu nguyên thuỷ thì điều đó không quan trọng) và TimSort cho đối tượng (ổn định). Và một bẫy JavaScript: <code>[10, 9, 1].sort()</code> so sánh như chuỗi và ra [1, 10, 9] — luôn truyền hàm so sánh khi sắp số.</p>',
  sau: ['"Ổn định" nghĩa là gì, khi nào nó quan trọng?'],
  loi: 'Không biết sort mặc định của JavaScript là theo thứ tự từ điển.' })}

${bay('vi', 'cày hàng trăm bài mà không có khung giải.', 'Giải im lặng và nhanh ở nhà không chuyển được sang buổi phỏng vấn, nơi bạn phải nói, hỏi và tự test. Mười bài làm đủ sáu bước thành tiếng hơn năm mươi bài làm trong im lặng. Hãy giải lại tám mẫu trên từ một tệp trắng cho tới khi mỗi bài dưới mười lăm phút.')}
${keXau('vi', 'bài test coding online ngày càng được giám sát: phát hiện sao chép–dán, ghi lại việc chuyển tab, giám sát qua webcam, và vòng sau bắt bạn giải thích code đã nộp. Dùng AI hay nhờ bạn làm hộ trong bài test cấm điều đó không phải đường tắt; nó bị gắn cờ hoặc lộ ra ở vòng sau. Hãy dùng AI để HỌC các mẫu từ trước — một cách trung thực — và tự làm bài test.')}
${neu('vi', 'bạn chẳng nhận ra mẫu nào cả? Đừng đứng hình. Nói lời giải vét cạn, code nó cho sạch, test nó, và nêu chi phí. Một lời giải O(n²) đúng kèm suy luận rõ ràng nhiều khi qua được vòng thực tập; một lời giải "thông minh" viết dở thì không.')}

${thucHanh('vi', { phut: '60–90', steps: [
  'Tạo thư mục <code>~/interview-kit/tech/patterns</code>. Với mỗi bài trong tám bài, viết lời giải từ tệp trắng bằng ngôn ngữ chính của bạn, không nhìn.',
  'Mỗi bài viết ba test (hai bình thường, một biên) và chạy chúng.',
  'Chọn ba bài và giải lại thành tiếng theo sáu bước, tự ghi hình; mỗi bài dưới 20 phút.',
  'Ghi độ phức tạp thời gian và bộ nhớ trong một dòng chú thích ở đầu mỗi tệp.',
], dat: 'tám lời giải chạy được kèm test và độ phức tạp, và ba bản ghi trong đó bạn đi đủ sáu bước.' })}
${thuatNgu('vi', [
  ['Big-O', 'Chi phí tăng ra sao theo kích thước đầu vào, bỏ qua hằng số.'],
  ['Brute force (vét cạn)', 'Lời giải thẳng thắn thử mọi khả năng.'],
  ['Edge case (trường hợp biên)', 'Đầu vào bất thường: rỗng, một phần tử, trùng, số âm, rất lớn.'],
  ['Two pointers (hai con trỏ)', 'Hai chỉ số cùng đi qua dữ liệu, thường từ hai đầu.'],
  ['Sliding window (cửa sổ trượt)', 'Một khoảng di động trên dãy, giữ hợp lệ trong lúc trượt.'],
  ['BFS / DFS', 'Duyệt theo chiều rộng (theo lớp, tìm số bước ít nhất) / theo chiều sâu.'],
  ['Greedy (tham lam)', 'Chọn cái tốt nhất tại chỗ ở mỗi bước — chỉ đúng với một số bài.'],
  ['Dynamic programming (quy hoạch động)', 'Dựng đáp án từ đáp án của các bài toán con nhỏ hơn.'],
])}
${tomTat('vi', [
  'Lần nào cũng đi sáu bước: hiểu đề, ví dụ, vét cạn, tối ưu, code, test — thành tiếng.',
  'Nắm Big-O đủ để loại O(n²) khi n ≈ 10⁵ và nói được chi phí bộ nhớ.',
  'Nhận ra tám mẫu từ dấu hiệu trong đề.',
  'Giải lại từng mẫu từ tệp trắng tới khi mỗi bài dưới mười lăm phút.',
  'Một lời giải vét cạn sạch, có test thắng một ý tưởng thông minh viết dở.',
  'Không gian lận trong bài test có giám sát; vòng sau sẽ bắt bạn giải thích code.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-big-o', academy: true, title: 'Academy · CSD201 0.3 — Big-O: ngôn ngữ của hiệu quả', sub: 'Lý thuyết đứng sau bảng ở trên, bằng Java.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bam', academy: true, title: 'Academy · CSD201 7.1 — Bảng băm và va chạm', sub: 'Vì sao hash map trung bình là O(1).' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bfs', academy: true, title: 'Academy · CSD201 5.4 — BFS và đường đi ngắn nhất', sub: 'Góc nhìn đồ thị của mẫu 7.1-6.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-cs1-on', academy: true, title: 'Academy · CSD201 ⭐ CS.1 — Bảy bài tìm kiếm nhị phân kiểu phỏng vấn', sub: 'Luyện thêm cho mẫu 7.1-5.' }),
  yt('Q4C3ZRJLnac', 'Anthony D. Mays', 'How to Solve ANY Coding Interview Question in 6 Steps', 13),
  nguon('🗺️', 'NeetCode Roadmap', 'Danh sách bài miễn phí, có thứ tự, nhóm theo đúng các mẫu này (tiếng Anh).', 'https://neetcode.io/roadmap'),
  nguon('📊', 'Big-O Cheat Sheet', 'Chi phí của các cấu trúc dữ liệu và thuật toán sắp xếp thông dụng trên một trang.', 'https://bigocheatsheet.com/'),
])}
</div>
`,
};

/* ═══════════════════════ 7.2 — Code trực tiếp ═══════════════════════ */
const HOI_THOAI_EN = `
Interviewer: Move all zeros in an array to the end, keeping the order of the other numbers.
You:  Let me restate: [0,1,0,3,12] becomes [1,3,12,0,0]. Should I change the array in place,
      or return a new one? And can it be empty?
Interviewer: In place, please. Yes, it can be empty.
You:  Brute force: copy the non-zeros into a new array, then pad with zeros — O(n) time but O(n)
      extra space. Since you want in place, I'll use two pointers: "write" marks where the next
      non-zero goes, "read" scans everything. Then I fill the rest with zeros. O(n), O(1).
      Does that sound OK before I code it?
Interviewer: Go ahead.
You:  (typing) write starts at 0... for each read... if the value isn't zero, copy it to write
      and move write... after the loop, from write to the end, set zeros.
You:  Let me test with [0,1,0,3,12]. read=0 is zero, skip. read=1: copy 1 to index 0, write=1...
      ...end: [1,3,12,3,12], then zeros from index 3: [1,3,12,0,0]. Correct.
      Edge cases: empty array — the loops don't run, fine. All zeros — write stays 0, all zeros. Fine.
You:  Complexity: one pass plus the fill, O(n) time, O(1) extra space.
`;

const HOI_THOAI_VI = `
Người PV: Dồn mọi số 0 trong mảng xuống cuối, giữ nguyên thứ tự các số còn lại.
Bạn:  Em nhắc lại: [0,1,0,3,12] thành [1,3,12,0,0]. Em sửa ngay trên mảng (in place)
      hay trả về mảng mới ạ? Mảng có thể rỗng không ạ?
Người PV: Sửa tại chỗ nhé. Có, có thể rỗng.
Bạn:  Vét cạn: chép các số khác 0 sang mảng mới rồi đệm số 0 — O(n) thời gian nhưng tốn O(n)
      bộ nhớ thêm. Vì anh muốn sửa tại chỗ, em dùng hai con trỏ: "write" đánh dấu chỗ đặt số khác 0
      tiếp theo, "read" quét toàn bộ. Xong thì điền số 0 vào phần còn lại. O(n), O(1).
      Hướng này ổn chưa ạ, trước khi em code?
Người PV: Cứ làm đi.
Bạn:  (vừa gõ vừa nói) write bắt đầu từ 0... với mỗi read... nếu giá trị khác 0 thì chép sang write
      rồi tăng write... hết vòng lặp, từ write tới cuối đặt bằng 0.
Bạn:  Em test với [0,1,0,3,12]. read=0 là 0, bỏ qua. read=1: chép 1 vào chỉ số 0, write=1...
      ...cuối cùng: [1,3,12,3,12], rồi điền 0 từ chỉ số 3: [1,3,12,0,0]. Đúng.
      Trường hợp biên: mảng rỗng — vòng lặp không chạy, ổn. Toàn số 0 — write giữ 0, toàn 0. Ổn.
Bạn:  Độ phức tạp: một lượt cộng lượt điền, O(n) thời gian, O(1) bộ nhớ thêm.
`;

const L72 = {
  title: '7.2 — Live coding and pair programming: thinking out loud, taking hints, testing by hand|||7.2 — Code trực tiếp và lập trình cặp: nghĩ thành tiếng, nhận gợi ý, tự test bằng tay',
  slug: 'pv-7-2-live-coding',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Code trước mặt người khác là một kỹ năng riêng: người phỏng vấn thật ra chấm gì, một đoạn hội thoại mẫu từ đầu tới cuối, câu nói mẫu khi nghĩ, khi bí, khi nhận gợi ý, cách dò code bằng tay, lập trình cặp trên codebase có sẵn, và tám tình huống hay gặp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Live coding: the skill of solving while someone watches</h2>
<p class="lead">Solving a problem at your desk and solving it in front of an engineer are different skills. In a live round the interviewer cannot see inside your head, so <strong>what you say is the evidence</strong>. A candidate who reaches a correct answer in silence leaves the interviewer with nothing to write; a candidate who explains, asks, tests and fixes one bug calmly gives them a full page. This lesson shows what that looks like, word by word.</p>

<h3>An everyday picture: a driving test</h3>
${doiThuong('en', 'In a driving test, arriving at the destination is not enough. The examiner watches whether you check the mirrors, signal before turning, and slow down at the crossing — habits that show you will be safe when nobody is watching. Live coding is the same: clarifying questions are the mirror check, stating your plan is the signal, testing by hand is slowing down at the crossing.')}

<h3>What the interviewer is writing down</h3>
${stack([
  ['Communication', 'Did they restate the problem, ask about constraints, explain the plan before typing?'],
  ['Problem solving', 'Brute force first, then a reasoned improvement; did they use hints well?'],
  ['Coding', 'Readable names, correct syntax in their chosen language, no unnecessary complexity.'],
  ['Verification', 'Did they trace their code on an example and an edge case without being asked?'],
  ['Collaboration', 'Did it feel like working with a teammate — calm, open to suggestions?'],
])}

<h3>A full dialogue, start to finish</h3>
<p>Read it once silently, then read your lines out loud. Notice the questions before coding, the plan agreed before typing, and the hand test at the end.</p>
${ra(HOI_THOAI_EN)}

<h3>Phrases to have ready</h3>
${bang(['Moment', 'Say'], [
  ['Restating', '"Let me make sure I understand: …"'],
  ['Asking constraints', '"How large can the input be? Can it be empty? Are there duplicates?"'],
  ['Brute force', '"The straightforward way is …, which is O(n²). Let me see if I can do better."'],
  ['Agreeing the plan', '"I plan to … Does that sound reasonable before I code it?"'],
  ['While typing', '"Here I handle the case where … "'],
  ['Stuck', '"I’m stuck on how to avoid the second loop. Can I think for a moment?"'],
  ['Taking a hint', '"That’s helpful — so if I sort first, then …"'],
  ['Testing', '"Let me trace this with the example: i is 0, …"'],
  ['Finding a bug', '"I see a bug: when the array is empty this line fails. Let me fix it."'],
  ['Closing', '"Time is O(n), space O(1). With more time I would add …"'],
])}

<h3>Eight situations</h3>
${qa('en', { so: '7.2-1', q: 'The interviewer says "Before you start, tell me your approach." You have only a vague idea.', chu: 'whether you plan before typing.',
  a: '<p>Say the vague idea honestly and make it concrete with an example: "I think a hash map helps, because we keep asking whether we have seen a value. Let me try it on the example…" Walking the example often turns the vague idea into a plan. If it does not, state the brute force — that is a plan too.</p>',
  sau: ['Why did you pick a map and not sorting?'], loi: 'Starting to type immediately to look busy.' })}
${qa('en', { so: '7.2-2', q: 'The interviewer gives you a hint. How do you use it?', chu: 'coachability — a strong signal for interns.',
  a: '<p>Acknowledge it, repeat it in your own words, and show how it changes your plan: "So the array is sorted — that means I can move two pointers inward instead of storing values." Hints are normal; good candidates use them quickly. Arguing with a hint, or ignoring it, costs much more than needing it.</p>',
  sau: ['Do hints lower my score?'], loi: 'Saying "yes, yes" and continuing the old approach.' })}
${qa('en', { so: '7.2-3', q: 'While testing by hand, you find a bug in your own code.', chu: 'composure and verification.',
  a: '<p>This is a good moment, not a bad one. Say it: "Here is a bug — when the input has one element, the loop never runs and I return undefined." Fix it, then re-run the same example. Interviewers expect bugs; they score whether you find them yourself.</p>',
  sau: ['What other edge cases would you test?'], loi: 'Hiding it and hoping the interviewer does not notice.' })}
${qa('en', { so: '7.2-4', q: 'You finish a working solution and the interviewer asks "Can you do better?"', chu: 'whether you know where the cost comes from.',
  a: '<p>Point at the bottleneck: "The cost is the nested loop, O(n²). If I store what I have seen in a set, the inner loop becomes a lookup, O(n) overall, at the cost of O(n) memory." If you believe it is already optimal, say why: "Every element must be read at least once, so O(n) is a lower bound."</p>',
  sau: ['What if memory is limited?'], loi: 'Guessing random data structures without naming the bottleneck.' })}
${qa('en', { so: '7.2-5', q: 'Your mind goes blank.', chu: 'recovery under stress.',
  a: '<p>Buy time honestly and go back to the method: "Let me take a moment and go back to the example." Write the example, solve it by hand slowly, and describe what you did — that is often the algorithm. Breathing out slowly helps, too. Interviewers have seen this many times; recovering is a positive signal.</p>',
  sau: [], loi: 'Apologising repeatedly or giving up.' })}
${qa('en', { so: '7.2-6', q: 'You forget the exact name of a library method (for example, how to sort a list in Java).', chu: 'whether you get stuck on syntax.',
  a: '<p>Say what you need and move on: "I would sort with the standard library — Collections.sort or list.sort with a comparator; I may not have the exact signature, I’ll write it this way and we can check." Most interviewers care far more about the logic than exact API names. In a test with a compiler, look it up only if the rules allow.</p>',
  sau: ['Which language do you want to use? (pick the one you are fastest in)'], loi: 'Spending five minutes trying to remember a method name.' })}
${qa('en', { so: '7.2-7', q: 'Pair programming: "Here is our function that calculates late fees. Add a rule for weekends."', chu: 'working in existing code — closer to a real job.',
  a: '<p>Read before writing: "Let me read what it does now… it takes the due date and the return date and multiplies days by the daily fee. Are there tests?" Run the existing tests first, add a test for the weekend rule, then change the code in a small step, then run all tests. Ask where business rules are defined. Keep the change small and in the existing style.</p>',
  sau: ['How do you know you did not break something?'], loi: 'Rewriting the whole function in your own style.' })}
${qa('en', { so: '7.2-8', q: 'Time is almost up and your solution is not finished.', chu: 'prioritisation and communication.',
  a: '<p>Stop adding and summarise: "I have the main loop working for normal input; what remains is the empty-array case and the final return. The approach is O(n log n) because of the sort." A clear summary of a partly finished, well-reasoned solution scores better than a rushed, broken final minute.</p>',
  sau: [], loi: 'Typing frantically until the interviewer stops you.' })}

${bay('en', 'thinking out loud means narrating every keystroke.', '"Now I type for, open parenthesis…" is noise. Narrate decisions, not characters: why this data structure, what this loop maintains, which edge case this line handles. When you need to think quietly, say so — "give me thirty seconds" — and then share the result.')}
${keXau('en', 'some live rounds are now done in tools that record keystrokes and paste events, and interviewers are trained to notice answers being read from another screen. Hidden AI helpers in a live round are usually obvious — the pause, the eye movement, the sudden perfect code — and end the process. If the company allows AI in the round, they will say so; ask if unsure.')}
${neu('en', 'the interviewer is silent and gives no feedback at all? Some do that on purpose to keep the round consistent. Check in occasionally — "Does this approach make sense so far?" — and continue with your method. Silence is not disapproval.')}

${thucHanh('en', { phut: '45–60', steps: [
  'Read the dialogue above out loud twice, playing both roles.',
  'Pick two problems from Lesson 7.1 you have not memorised. Solve each with a friend or on camera, saying every step; no silence longer than 30 seconds without a check-in phrase.',
  'After each, list the phrases from the table you actually used and the ones you forgot.',
  'Do one pair-programming exercise: ask a friend to give you a small function from their project and a change to make.',
], dat: 'two recordings with no long silences, a hand test at the end of each, and your own list of phrases to improve.' })}
${thuatNgu('en', [
  ['Live coding', 'Solving a problem while the interviewer watches, usually in a shared editor.'],
  ['Pair programming', 'Two people working on the same code; in interviews, often on an existing codebase.'],
  ['Dry run / hand trace', 'Executing your code step by step on paper or out loud.'],
  ['In place', 'Changing the input itself rather than creating a new copy.'],
  ['Hint', 'A nudge from the interviewer; using it well is a positive signal.'],
  ['Check-in', 'A short question to confirm the interviewer is following.'],
])}
${tomTat('en', [
  'In live coding, what you say is the evidence the interviewer writes down.',
  'Restate, ask constraints, give the brute force, agree a plan — then type.',
  'Narrate decisions, not keystrokes; say when you need a moment to think.',
  'Use hints quickly and openly; finding your own bugs is a strength.',
  'Always trace your code on an example and an edge case, then state complexity.',
  'If time runs out, summarise what works and what remains.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-luyen-tap-list', academy: true, L: 'en', title: 'Academy · CSD201 1.5 — Three classic list problems, solved', sub: 'Good problems to practise saying the steps out loud.' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-0-1-tim-viec', L: 'en', title: 'This course · 0.1 — Where to find jobs', sub: 'Check which postings mention a live coding round, and prepare for those first.' }),
  yt('Ti5vfu9arXQ', 'Life at Google', 'How to solve a Google coding interview question', 26, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Code trực tiếp: kỹ năng giải bài khi có người đang nhìn</h2>
<p class="lead">Giải bài ở bàn học và giải trước mặt một kỹ sư là hai kỹ năng khác nhau. Trong vòng trực tiếp, người phỏng vấn không nhìn được vào đầu bạn, nên <strong>những gì bạn nói chính là bằng chứng</strong>. Một ứng viên tới được đáp án đúng trong im lặng để lại cho người phỏng vấn một trang trắng; một ứng viên giải thích, hỏi, tự test và bình tĩnh sửa một lỗi cho họ cả một trang ghi chép. Bài này chỉ ra điều đó trông như thế nào, từng câu từng chữ.</p>

<h3>Liên tưởng đời thường: thi sát hạch lái xe</h3>
${doiThuong('vi', 'Khi thi bằng lái, tới được đích là chưa đủ. Giám khảo nhìn xem bạn có nhìn gương, xi nhan trước khi rẽ, giảm tốc ở vạch qua đường không — những thói quen cho thấy bạn sẽ an toàn khi không ai nhìn. Code trực tiếp cũng vậy: câu hỏi làm rõ là nhìn gương, nói kế hoạch là xi nhan, tự test bằng tay là giảm tốc ở vạch qua đường.')}

<h3>Người phỏng vấn đang ghi lại những gì</h3>
${stack([
  ['Giao tiếp', 'Có nhắc lại đề, hỏi về ràng buộc, giải thích kế hoạch trước khi gõ không?'],
  ['Giải quyết vấn đề', 'Vét cạn trước, rồi cải tiến có lý lẽ; có dùng tốt gợi ý không?'],
  ['Code', 'Tên dễ đọc, cú pháp đúng với ngôn ngữ đã chọn, không phức tạp thừa.'],
  ['Kiểm chứng', 'Có tự dò code trên một ví dụ và một trường hợp biên mà không cần ai nhắc?'],
  ['Hợp tác', 'Có cảm giác như làm với một đồng đội không — bình tĩnh, cởi mở với góp ý?'],
])}

<h3>Một đoạn hội thoại trọn vẹn, từ đầu tới cuối</h3>
<p>Đọc thầm một lần, rồi đọc to phần lời của bạn. Để ý các câu hỏi trước khi code, kế hoạch được thống nhất trước khi gõ, và lượt test bằng tay ở cuối.</p>
${ra(HOI_THOAI_VI)}

<h3>Câu nói chuẩn bị sẵn</h3>
${bang(['Lúc', 'Nói'], [
  ['Nhắc lại đề', '"Em xin nhắc lại cho chắc: …" / "Let me make sure I understand: …"'],
  ['Hỏi ràng buộc', '"Đầu vào lớn tối đa bao nhiêu? Có rỗng được không? Có phần tử trùng không?"'],
  ['Vét cạn', '"Cách thẳng nhất là …, tốn O(n²). Em thử xem có cách tốt hơn không."'],
  ['Thống nhất kế hoạch', '"Em định … Hướng này ổn chưa ạ, trước khi em code?"'],
  ['Trong lúc gõ', '"Chỗ này em xử lý trường hợp … "'],
  ['Khi bí', '"Em đang bí chỗ làm sao bỏ được vòng lặp thứ hai. Cho em nghĩ một chút được không ạ?"'],
  ['Nhận gợi ý', '"Gợi ý đó giúp em — vậy nếu sắp xếp trước, thì …"'],
  ['Test', '"Em dò thử với ví dụ: i bằng 0, …"'],
  ['Thấy lỗi', '"Em thấy một lỗi: khi mảng rỗng dòng này hỏng. Em sửa nhé."'],
  ['Kết thúc', '"Thời gian O(n), bộ nhớ O(1). Có thêm thời gian em sẽ thêm …"'],
])}

<h3>Tám tình huống</h3>
${qa('vi', { so: '7.2-1', q: 'Người phỏng vấn nói "Trước khi bắt đầu, em nói hướng làm đi." Bạn mới chỉ có một ý mơ hồ.', chu: 'bạn có lập kế hoạch trước khi gõ.',
  a: '<p>Nói thật cái ý mơ hồ và làm nó cụ thể bằng một ví dụ: "Em nghĩ hash map sẽ giúp, vì mình cứ phải hỏi đã gặp giá trị này chưa. Em thử trên ví dụ nhé…" Đi qua ví dụ thường biến ý mơ hồ thành kế hoạch. Nếu không, nói lời giải vét cạn — đó cũng là một kế hoạch.</p>',
  sau: ['Vì sao em chọn map mà không sắp xếp?'], loi: 'Gõ ngay lập tức cho có vẻ bận rộn.' })}
${qa('vi', { so: '7.2-2', q: 'Người phỏng vấn đưa gợi ý. Bạn dùng nó thế nào?', chu: 'khả năng tiếp thu — tín hiệu mạnh với thực tập sinh.',
  a: '<p>Ghi nhận, nhắc lại bằng lời của bạn, và cho thấy nó đổi kế hoạch thế nào: "Vậy là mảng đã sắp xếp — nghĩa là em có thể đưa hai con trỏ vào giữa thay vì lưu giá trị." Được gợi ý là bình thường; ứng viên giỏi dùng nó nhanh. Cãi lại gợi ý, hay lờ nó đi, tốn điểm hơn nhiều so với việc cần gợi ý.</p>',
  sau: ['Được gợi ý có bị trừ điểm không?'], loi: 'Nói "dạ dạ" rồi tiếp tục hướng cũ.' })}
${qa('vi', { so: '7.2-3', q: 'Đang tự test bằng tay, bạn phát hiện lỗi trong code của mình.', chu: 'sự điềm tĩnh và việc tự kiểm chứng.',
  a: '<p>Đây là khoảnh khắc tốt, không phải xấu. Nói ra: "Có một lỗi — khi đầu vào chỉ có một phần tử, vòng lặp không chạy và em trả về undefined." Sửa nó, rồi chạy lại đúng ví dụ đó. Người phỏng vấn đã tính trước là có lỗi; họ chấm việc bạn TỰ tìm ra.</p>',
  sau: ['Em còn test những trường hợp biên nào nữa?'], loi: 'Giấu đi và cầu cho người phỏng vấn không thấy.' })}
${qa('vi', { so: '7.2-4', q: 'Bạn xong một lời giải chạy được và người phỏng vấn hỏi "Làm tốt hơn được không?"', chu: 'bạn có biết chi phí đến từ đâu.',
  a: '<p>Chỉ vào chỗ thắt cổ chai: "Chi phí nằm ở vòng lặp lồng, O(n²). Nếu em lưu những gì đã gặp vào một set, vòng lặp trong thành một phép tra, tổng O(n), đổi lại tốn O(n) bộ nhớ." Nếu bạn tin nó đã tối ưu, nói vì sao: "Phần tử nào cũng phải đọc ít nhất một lần, nên O(n) là cận dưới."</p>',
  sau: ['Nếu bộ nhớ có hạn thì sao?'], loi: 'Đoán bừa các cấu trúc dữ liệu mà không gọi tên chỗ thắt cổ chai.' })}
${qa('vi', { so: '7.2-5', q: 'Đầu óc bạn trống rỗng.', chu: 'khả năng hồi phục khi căng thẳng.',
  a: '<p>Xin thời gian một cách thành thật và quay về phương pháp: "Cho em một chút để quay lại ví dụ." Viết ví dụ ra, giải bằng tay thật chậm, và tả lại mình đã làm gì — nhiều khi đó chính là thuật toán. Thở ra chậm cũng giúp. Người phỏng vấn đã gặp chuyện này nhiều lần; gỡ lại được là một tín hiệu tốt.</p>',
  sau: [], loi: 'Xin lỗi liên tục hoặc bỏ cuộc.' })}
${qa('vi', { so: '7.2-6', q: 'Bạn quên đúng tên một hàm thư viện (ví dụ cách sắp xếp một List trong Java).', chu: 'bạn có bị kẹt vì cú pháp không.',
  a: '<p>Nói cái mình cần rồi đi tiếp: "Em sẽ sắp xếp bằng thư viện chuẩn — Collections.sort hoặc list.sort với một comparator; có thể em không nhớ chính xác chữ ký hàm, em viết thế này rồi mình kiểm sau ạ." Phần lớn người phỏng vấn quan tâm logic hơn nhiều so với tên API chính xác. Trong bài test có trình biên dịch, chỉ tra cứu nếu luật cho phép.</p>',
  sau: ['Em muốn dùng ngôn ngữ nào? (chọn ngôn ngữ bạn nhanh nhất)'], loi: 'Mất năm phút cố nhớ một tên hàm.' })}
${qa('vi', { so: '7.2-7', q: 'Lập trình cặp: "Đây là hàm tính phí trả sách muộn của bên anh. Thêm luật cho cuối tuần nhé."', chu: 'làm việc trên code có sẵn — gần với việc thật hơn.',
  a: '<p>Đọc trước khi viết: "Em đọc xem bây giờ nó làm gì… nó nhận ngày hạn và ngày trả rồi nhân số ngày với phí mỗi ngày. Có test không ạ?" Chạy test có sẵn trước, thêm một test cho luật cuối tuần, rồi sửa code một bước nhỏ, rồi chạy lại toàn bộ test. Hỏi luật nghiệp vụ được định nghĩa ở đâu. Giữ thay đổi nhỏ và theo đúng phong cách sẵn có.</p>',
  sau: ['Làm sao em biết mình không làm hỏng chỗ khác?'], loi: 'Viết lại cả hàm theo phong cách của mình.' })}
${qa('vi', { so: '7.2-8', q: 'Sắp hết giờ mà lời giải chưa xong.', chu: 'sắp xếp ưu tiên và giao tiếp.',
  a: '<p>Ngừng thêm và tóm lại: "Vòng lặp chính đã chạy với đầu vào bình thường; còn lại trường hợp mảng rỗng và lệnh return cuối. Hướng làm là O(n log n) vì bước sắp xếp." Một bản tóm tắt rõ ràng cho một lời giải chưa xong nhưng có lý lẽ được điểm cao hơn một phút cuối vội vàng mà hỏng.</p>',
  sau: [], loi: 'Gõ cuống cuồng tới khi người phỏng vấn ngắt.' })}

${bay('vi', 'tưởng nghĩ thành tiếng là thuật lại từng phím gõ.', '"Giờ em gõ for, mở ngoặc…" chỉ là tiếng ồn. Thuật lại QUYẾT ĐỊNH, không phải ký tự: vì sao chọn cấu trúc dữ liệu này, vòng lặp này giữ điều gì đúng, dòng này xử lý trường hợp biên nào. Khi cần nghĩ yên lặng, hãy nói ra — "cho em ba mươi giây" — rồi chia sẻ kết quả.')}
${keXau('vi', 'nhiều vòng trực tiếp giờ chạy trên công cụ ghi lại phím gõ và thao tác dán, và người phỏng vấn được huấn luyện để nhận ra câu trả lời đang được đọc từ một màn hình khác. Trợ lý AI giấu giếm trong vòng trực tiếp thường lộ rõ — khoảng ngừng, ánh mắt, đoạn code bỗng dưng hoàn hảo — và chấm dứt quy trình. Nếu công ty cho dùng AI trong vòng đó, họ sẽ nói; chưa chắc thì hỏi.')}
${neu('vi', 'người phỏng vấn im lặng, không phản hồi gì cả? Có người cố tình làm vậy để vòng thi nhất quán. Thỉnh thoảng kiểm tra — "Hướng này tới giờ có hợp lý không ạ?" — và tiếp tục theo phương pháp của mình. Im lặng không có nghĩa là không đồng ý.')}

${thucHanh('vi', { phut: '45–60', steps: [
  'Đọc to đoạn hội thoại ở trên hai lần, đóng cả hai vai.',
  'Chọn hai bài trong bài 7.1 mà bạn chưa thuộc. Giải từng bài với một người bạn hoặc trước camera, nói ra mọi bước; không im lặng quá 30 giây mà không có một câu kiểm tra.',
  'Sau mỗi bài, liệt kê các câu trong bảng bạn đã thật sự dùng và các câu bạn quên.',
  'Làm một bài lập trình cặp: nhờ một người bạn đưa một hàm nhỏ trong dự án của họ và một thay đổi cần làm.',
], dat: 'hai bản ghi không có khoảng im lặng dài, mỗi bản có lượt tự test bằng tay ở cuối, và danh sách câu nói cần cải thiện của riêng bạn.' })}
${thuatNgu('vi', [
  ['Live coding (code trực tiếp)', 'Giải bài trong khi người phỏng vấn xem, thường trên trình soạn thảo chung.'],
  ['Pair programming (lập trình cặp)', 'Hai người cùng làm trên một đoạn code; khi phỏng vấn thường là trên codebase có sẵn.'],
  ['Dry run / hand trace (dò tay)', 'Chạy code của mình từng bước trên giấy hoặc thành tiếng.'],
  ['In place (sửa tại chỗ)', 'Sửa chính đầu vào thay vì tạo một bản sao mới.'],
  ['Hint (gợi ý)', 'Một cú hích từ người phỏng vấn; dùng tốt là tín hiệu tích cực.'],
  ['Check-in (câu kiểm tra)', 'Một câu hỏi ngắn để chắc người phỏng vấn đang theo kịp.'],
])}
${tomTat('vi', [
  'Trong code trực tiếp, những gì bạn nói là bằng chứng người phỏng vấn ghi lại.',
  'Nhắc lại đề, hỏi ràng buộc, nêu vét cạn, thống nhất kế hoạch — rồi mới gõ.',
  'Thuật lại quyết định, không thuật phím gõ; nói ra khi cần một lúc để nghĩ.',
  'Dùng gợi ý nhanh và cởi mở; tự tìm ra lỗi của mình là điểm mạnh.',
  'Luôn dò code trên một ví dụ và một trường hợp biên, rồi nêu độ phức tạp.',
  'Hết giờ thì tóm lại phần đã chạy và phần còn lại.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-luyen-tap-list', academy: true, title: 'Academy · CSD201 1.5 — Ba bài danh sách kinh điển, có lời giải', sub: 'Bài hợp để tập nói thành tiếng từng bước.' }),
  lienKet({ khoa: 'interview-prep', bai: 'pv-0-1-tim-viec', title: 'Khoá này · 0.1 — Tìm việc ở đâu', sub: 'Xem tin nào nhắc tới vòng code trực tiếp, và chuẩn bị cho những tin đó trước.' }),
  yt('Ti5vfu9arXQ', 'Life at Google', 'How to solve a Google coding interview question', 26),
])}
</div>
`,
};

/* ═══════════════════════ 7.3 — System design cho junior ═══════════════════════ */
const UOC_LUONG_EN = `
Back-of-the-envelope for a URL shortener (assumptions stated out loud):
  new links       1,000,000 / day   ->  1,000,000 / 86,400 s  ≈ 12 writes / s
  reads           100 x writes       ->  ≈ 1,200 redirects / s  (peak maybe 3-5x)
  one row         ~500 bytes (code, long URL, owner, created_at)
  storage / year  1,000,000 x 500 B x 365  ≈ 180 GB
Conclusion: read-heavy, small writes -> one SQL database is fine for a long time;
put a cache in front of the redirect path; the code generator must avoid collisions.
`;
const UOC_LUONG_VI = `
Ước lượng nhanh cho dịch vụ rút gọn link (nói to các giả định):
  link mới        1.000.000 / ngày  ->  1.000.000 / 86.400 giây  ≈ 12 lượt ghi / giây
  lượt đọc        gấp 100 lượt ghi  ->  ≈ 1.200 lượt chuyển hướng / giây (giờ cao điểm có thể gấp 3-5)
  một dòng        ~500 byte (mã, URL dài, chủ sở hữu, created_at)
  dung lượng/năm  1.000.000 x 500 B x 365  ≈ 180 GB
Kết luận: đọc nhiều, ghi ít và nhỏ -> một CSDL SQL dùng tốt trong thời gian dài;
đặt cache trước đường chuyển hướng; bộ sinh mã phải tránh trùng.
`;

const L73 = {
  title: '7.3 — System design for juniors: what is really expected, a four-step framework, a URL shortener, and your own project redrawn|||7.3 — System design cho junior: kỳ vọng thật, khung bốn bước, dịch vụ rút gọn link, và vẽ lại chính dự án của bạn',
  slug: 'pv-7-3-system-design',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Với thực tập/fresher, system design là "giải thích được kiến trúc dự án của mình và nói được đánh đổi": khung bốn bước (yêu cầu, ước lượng, thiết kế tổng thể, đi sâu), các khối xây dựng (CDN, proxy, cache, CSDL, object storage, hàng đợi), ví dụ rút gọn link có số ước lượng, và vẽ lại một nền tảng web thật chạy trên một VPS — kèm điểm yếu thật của nó.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>System design for juniors: explain your system, then grow it</h2>
<p class="lead">"Design Twitter" sounds terrifying for an intern. The good news: nobody expects an intern to design Twitter. At internship and fresher level, system design usually means two things: <strong>explain the architecture of a project you built</strong> — every box and why it is there — and <strong>reason through a small design</strong> with sensible building blocks and honest trade-offs. This lesson gives you a framework, a worked example with numbers, and a full redrawing of a real web platform running on a single server.</p>

<h3>An everyday picture: a phở shop that gets popular</h3>
${doiThuong('en', 'One cook, one pot, ten tables: that is a single server. When the queue reaches the street, you do not rebuild the shop; you add a second cook (another app instance), prepare broth in advance (a cache), give takeaway customers a ticket and call them later (a queue), and keep the recipe book in one safe place (the database). System design is deciding which of these the shop needs next — and noticing what happens if the only cook gets sick (a single point of failure).')}

<h3>What a junior is actually expected to do</h3>
${bang(['Expected', 'Not expected'], [
  ['Ask what the system must do and for how many users', 'Know the internal design of Google or Facebook'],
  ['Draw clients, server, database, cache, storage, queue and explain each', 'Invent a new consensus algorithm'],
  ['Estimate roughly (requests per second, storage per year)', 'Exact capacity planning'],
  ['Name one or two trade-offs per decision', 'Optimal answers — there are none'],
  ['Explain your own project’s architecture in depth', 'Experience with systems of millions of users'],
])}

<h3>The four-step framework</h3>
${flow([
  ['1 · Requirements', 'what and how much', 'Functional: what users can do. Non-functional: number of users, read/write ratio, latency, availability, data that must never be lost. Write them down.'],
  ['2 · Estimate', 'back-of-the-envelope', 'Requests per second, storage per year, bandwidth. Rounded numbers — the goal is to know whether one server is enough.'],
  ['3 · High-level design', 'API, data model, boxes and arrows', 'Two or three endpoints, the main tables, then the components the request passes through.'],
  ['4 · Deep dive', 'bottlenecks and trade-offs', 'Where will it break first? Cache, indexes, a queue, replicas, a CDN — each with its cost. Mention monitoring.'],
])}

<h3>Building blocks you should be able to explain</h3>
${stack([
  ['CDN', 'Copies of static files and media at the edge, near users. Cheapest way to make a site fast globally.'],
  ['Reverse proxy / load balancer (nginx)', 'One entry point: TLS, routing to app instances, compression, rate limits, caching headers.'],
  ['Stateless app servers', 'Keep no user state in memory, so you can run two or ten behind the proxy.'],
  ['Cache (Redis)', 'Fast copies of answers that are expensive to compute; needs an invalidation plan.'],
  ['Relational database (PostgreSQL)', 'The source of truth with transactions; scale reads with indexes and replicas first.'],
  ['Object storage (S3, R2)', 'Files and media, uploaded directly from the browser with presigned URLs, served through the CDN.'],
  ['Queue + worker', 'Slow or retryable work (email, video processing, reports) moved out of the request.'],
])}

<h3>Worked example: a URL shortener</h3>
<p>Requirements: create a short link for a long URL; visiting the short link redirects; optional click counts. Then estimate, out loud:</p>
${ra(UOC_LUONG_EN)}
<p>High-level design: <code>POST /links</code> returns a code; <code>GET /:code</code> redirects. One table <code>links(code primary key, long_url, owner_id, created_at)</code>. The redirect path reads the cache first (Redis, key = code), falls back to the database, then fills the cache. Codes: a base-62 encoding of an auto-increment id (short, unique, but guessable) or random 7 characters with a uniqueness check (unguessable). Redirect with <strong>302</strong> if you want to count every click (browsers cache 301 permanently); count clicks asynchronously through a queue so the redirect stays fast.</p>

<h3>Your own project, redrawn: a real personal web platform</h3>
<p>The strongest system-design answer a student can give is a deep, honest explanation of a system they actually run. Here is one, from the project this course is built on: a learning and social platform built with Next.js, Express and TypeScript, PostgreSQL with Prisma, Redis and Cloudflare R2, deployed with Docker Compose on one Ubuntu VPS.</p>
${flow([
  ['Browser / desktop app', 'the clients', 'A Next.js web app and an Electron desktop app call the same API.'],
  ['Cloudflare', 'DNS + CDN', 'Media (avatars, videos, course files) is served from an R2 bucket through the CDN on its own subdomain — the server never streams those bytes.'],
  ['nginx on the VPS', 'reverse proxy', 'TLS, routing of /api to the backend and everything else to Next.js, cache headers. (It once overrode the app’s cache headers — Lesson 6.3.)'],
  ['Next.js + Express API', 'app containers', 'Stateless containers built on a separate home machine, pushed to a registry, and swapped on the VPS by a deploy script with a smoke test.'],
  ['PostgreSQL + Redis', 'data', 'PostgreSQL is the source of truth (migrations with Prisma); Redis holds caches and realtime state.'],
  ['Background work', 'off the request path', 'Slow jobs run outside the request; heavy AI features call external model providers with daily cost limits.'],
])}
<p>Then the honest part interviewers love — the weaknesses and what happened:</p>
<ul>
<li><strong>Single point of failure:</strong> one VPS holds the app and the database. If it dies, everything is down, and restoring the database from a backup would be manual work.</li>
<li><strong>Disk is shared:</strong> on 18 August 2026 a Docker build cache of 7.6 GB filled the same disk as PostgreSQL during a build; the fix was moving image builds off the VPS entirely.</li>
<li><strong>Deploys raced:</strong> two CI workflows triggered by the same push recreated the backend at the same time and caused real outages, so deploying became an explicit script instead of a side effect of pushing.</li>
<li><strong>Next steps if traffic grew:</strong> move PostgreSQL to a managed service or add a read replica, run two API containers behind nginx (they are stateless), use Redis for shared realtime state between them, and add alerting on disk and error rate.</li>
</ul>

<h3>Eight questions</h3>
${qa('en', { so: '7.3-1', q: 'Walk me through the architecture of your project.', chu: 'depth and ownership — the most common "system design" question for interns.',
  a: '<p>Draw it while you talk, following one request: "A user opens a course page: DNS and CDN at Cloudflare, nginx on the VPS terminates TLS and forwards to the Next.js container, which renders the page and calls the Express API, which reads PostgreSQL through Prisma and Redis for cached data. Videos come straight from object storage through the CDN." Then one decision with its reason, and one weakness with its fix.</p>',
  sau: ['Why did you choose PostgreSQL?', 'What happens if the VPS restarts?', 'Which part did you build yourself, and which with AI help?'],
  loi: 'Listing technologies without the request path or any trade-off.' })}
${qa('en', { so: '7.3-2', q: 'Design a URL shortener.', chu: 'the full four steps on a small problem.',
  a: '<p>Follow the worked example: requirements, the estimate (≈ 12 writes/s, ≈ 1,200 reads/s, ≈ 180 GB/year), two endpoints, one table, cache on the redirect path, the code-generation choice and its trade-off, 301 vs 302, and asynchronous click counting.</p>',
  sau: ['How do you stop people creating links to malware?', 'How would you handle a custom alias that is already taken?'],
  loi: 'Jumping to "use Kafka and Cassandra" without numbers.' })}
${qa('en', { so: '7.3-3', q: 'Our API is slow because many users read the same data. What do you do?', chu: 'scaling reads in the right order.',
  a: '<p>Measure first: which endpoint, which query. Then in order of cost: add the missing index and fix N+1 queries; cache the result (in HTTP headers for public data, Redis for computed data) with an expiry and an invalidation on write; put static parts behind the CDN; add read replicas if the database itself is the bottleneck. Each step has a cost — caches can serve stale data, replicas lag behind the primary.</p>',
  sau: ['What is a cache stampede and how do you prevent it?'], loi: '"Add more servers" before finding the slow query.' })}
${qa('en', { so: '7.3-4', q: 'How would you let users upload videos of up to 2 GB?', chu: 'not routing big files through the app server.',
  a: '<p>Do not send the file through the API. The API checks the user and issues a <strong>presigned URL</strong>; the browser uploads directly to object storage (multipart for large files); the API records the object when the upload is confirmed; a worker processes the video (thumbnails, compression) from a queue; the CDN serves it. The API server never holds 2 GB in memory, and uploads survive app restarts.</p>',
  sau: ['How do you stop someone uploading a 2 GB file to a key that is not theirs?'], loi: 'Multer to the app server’s disk, then copying to storage.' })}
${qa('en', { so: '7.3-5', q: 'Why put a queue between the API and sending emails?', chu: 'asynchronous work and retries.',
  a: '<p>Sending an email can take seconds and can fail. If it happens inside the request, the user waits and a failure breaks the request. With a queue, the API records the job and returns immediately; a worker sends it, retries with backoff on failure, and the job survives restarts. The cost: more moving parts, and the job must be safe to run twice (idempotent), because retries happen.</p>',
  sau: ['What does idempotent mean here?'], loi: 'Saying "queues make it faster" — they make the request faster and the work more reliable, not the email faster.' })}
${qa('en', { so: '7.3-6', q: 'SQL or NoSQL for a course platform?', chu: 'choosing by data shape, not fashion.',
  a: '<p>Courses, lessons, users, enrolments and progress are related data with constraints — a relational database fits, with transactions for things like payments. A document database can fit data that is read whole and has a flexible shape, but PostgreSQL’s JSONB already covers much of that. My default for a student-sized system is PostgreSQL, and I would move a specific workload elsewhere only when a measured need appears.</p>',
  sau: ['Give an example where you would pick a NoSQL store.'], loi: '"NoSQL scales better" as the whole answer.' })}
${qa('en', { so: '7.3-7', q: 'What is the single point of failure in your system, and what would you do about it?', chu: 'honesty about weaknesses.',
  a: '<p>Name it plainly: "The one VPS: app and database live there. Mitigations today: database backups (say honestly how often yours run) and a fast rollback — an old image can be re-tagged and started again in under a minute. The next step would be a managed database with automatic backups, then a second app server behind a load balancer." Interviewers trust a candidate who sees their own system’s weak spots.</p>',
  sau: ['How long would recovery take today?'], loi: '"There is none."' })}
${qa('en', { so: '7.3-8', q: 'How do you protect an API from being flooded?', chu: 'rate limiting basics.',
  a: '<p>Limit requests per user or per IP over a time window (a token bucket or fixed window in Redis, or at nginx), return 429 with a Retry-After header, put the CDN or a WAF in front for large attacks, and cap expensive operations (for example daily limits on AI calls). Limits must be shared across app instances, which is why they live in Redis or the proxy, not in process memory.</p>',
  sau: ['Per IP or per user — what is the problem with each?'], loi: 'Only answering "use Cloudflare".' })}

${bay('en', 'drawing a "big tech" architecture for a small problem.', 'Microservices, Kafka and Kubernetes for a student project with a hundred users is a warning sign, not an achievement. The interviewer wants to see that the design matches the numbers from step 2 — and that you know when you would need the bigger pieces.')}
${keXau('en', 'every box you draw is also an attack surface. A Redis port published to the internet without a password, a database reachable from outside, or an object-storage bucket that lists its files publicly are classic real-world leaks. In the deep-dive step, say which components are reachable from the internet (only the proxy and the CDN) and which stay on a private network.')}
${neu('en', 'the interviewer asks about a technology you have never used, such as Kafka? Say so, then reason from what you know: "I have not used Kafka; I understand it as a durable log that several consumers read at their own pace. For this design a simple queue in Redis would be enough at 12 writes per second — I would reach for Kafka if we needed replay or many independent consumers."')}

${thucHanh('en', { phut: '45–60', steps: [
  'Draw the architecture of your own main project on paper: every box, every arrow, and where data is stored.',
  'Explain it out loud in three minutes, following one request, then list two weaknesses and how you would fix them.',
  'Do the four steps for a URL shortener on paper with your own estimates, without looking at the lesson.',
  'Pick one feature of your project (for example uploads or notifications) and write how it changes at 100× the users.',
], dat: 'a dated diagram of your own system, a three-minute recording explaining it, and a one-page URL-shortener design with numbers.' })}
${thuatNgu('en', [
  ['Functional / non-functional requirements', 'What the system does / how well (scale, latency, availability).'],
  ['Back-of-the-envelope estimate', 'A rough calculation to see the order of magnitude.'],
  ['Stateless service', 'Keeps no per-user state in memory, so it can run as many copies.'],
  ['Read replica', 'A copy of the database that serves reads and lags slightly behind.'],
  ['Presigned URL', 'A time-limited URL that lets a client upload or download one object directly.'],
  ['Single point of failure', 'One component whose failure takes the whole system down.'],
  ['Rate limiting', 'Capping how many requests a client may make in a time window.'],
])}
${tomTat('en', [
  'For juniors, system design means explaining your own architecture deeply and reasoning through a small design.',
  'Use four steps: requirements, estimate, high-level design, deep dive with trade-offs.',
  'Know the building blocks: CDN, reverse proxy, stateless servers, cache, SQL database, object storage, queue.',
  'Let the numbers decide: one SQL database and a cache go a long way.',
  'Naming your own system’s single point of failure and its fix is a strong answer.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'api-design', bai: 'api-11-2-rut-gon-link', L: 'en', title: 'API & System Design 11.2 — Interview: a URL shortener', sub: 'The same problem in depth: requirements, contract and hot path.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-2-cache-aside', L: 'en', title: 'Node.js 12.2 — Cache-aside and its four betrayals', sub: 'The cache on the redirect path, done properly.' }),
  lienKet({ khoa: 'object-storage', bai: 'os-4-1-vi-sao', L: 'en', title: 'Object Storage 4.1 — Why presigned URLs', sub: 'The upload design of question 7.3-4.' }),
  lienKet({ khoa: 'api-design', bai: 'api-5-3-rate-limit', L: 'en', title: 'API & System Design 5.3 — Rate limiting and quotas', sub: 'Token buckets and the RateLimit headers.' }),
  yt('i7twT3x5yv8', 'ByteByteGo', 'System Design Interview: A Step-By-Step Guide', 10, 'en'),
  nguon('📘', 'The System Design Primer (GitHub)', 'A free, well-known collection of building blocks and worked designs.', 'https://github.com/donnemartin/system-design-primer'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>System design cho junior: giải thích hệ thống của mình, rồi cho nó lớn lên</h2>
<p class="lead">"Thiết kế Twitter" nghe đáng sợ với một thực tập sinh. Tin tốt: không ai mong thực tập sinh thiết kế Twitter. Ở mức thực tập và fresher, system design (thiết kế hệ thống) thường có nghĩa hai việc: <strong>giải thích kiến trúc một dự án bạn đã làm</strong> — từng cái hộp và vì sao nó ở đó — và <strong>suy luận qua một thiết kế nhỏ</strong> với các khối xây dựng hợp lý và đánh đổi trung thực. Bài này cho bạn một khung, một ví dụ có số liệu, và một bản vẽ lại đầy đủ của một nền tảng web thật chạy trên đúng một máy chủ.</p>

<h3>Liên tưởng đời thường: quán phở bỗng đông khách</h3>
${doiThuong('vi', 'Một người nấu, một nồi nước dùng, mười bàn: đó là một máy chủ. Khi hàng người xếp ra tới đường, bạn không xây lại quán; bạn thêm một người nấu thứ hai (thêm một bản ứng dụng), nấu sẵn nước dùng từ trước (cache), phát số cho khách mua mang về rồi gọi sau (hàng đợi), và giữ cuốn công thức ở một chỗ an toàn duy nhất (CSDL). Thiết kế hệ thống là quyết định quán cần thứ nào tiếp theo — và để ý chuyện gì xảy ra nếu người nấu duy nhất bị ốm (điểm hỏng duy nhất).')}

<h3>Junior thật sự được kỳ vọng làm gì</h3>
${bang(['Được kỳ vọng', 'Không bị kỳ vọng'], [
  ['Hỏi hệ thống phải làm gì và cho bao nhiêu người dùng', 'Biết thiết kế bên trong của Google hay Facebook'],
  ['Vẽ client, máy chủ, CSDL, cache, kho lưu trữ, hàng đợi và giải thích từng cái', 'Nghĩ ra một thuật toán đồng thuận mới'],
  ['Ước lượng thô (request mỗi giây, dung lượng mỗi năm)', 'Lập kế hoạch năng lực chính xác'],
  ['Nêu một hai đánh đổi cho mỗi quyết định', 'Đáp án tối ưu — không có đáp án tối ưu'],
  ['Giải thích sâu kiến trúc dự án của chính mình', 'Kinh nghiệm với hệ thống hàng triệu người dùng'],
])}

<h3>Khung bốn bước</h3>
${flow([
  ['1 · Yêu cầu', 'làm gì và bao nhiêu', 'Chức năng: người dùng làm được gì. Phi chức năng: số người dùng, tỉ lệ đọc/ghi, độ trễ, độ sẵn sàng, dữ liệu nào không bao giờ được mất. Viết ra.'],
  ['2 · Ước lượng', 'tính nhanh trên giấy', 'Request mỗi giây, dung lượng mỗi năm, băng thông. Số làm tròn — mục đích là biết một máy chủ có đủ không.'],
  ['3 · Thiết kế tổng thể', 'API, mô hình dữ liệu, hộp và mũi tên', 'Hai ba endpoint, các bảng chính, rồi các thành phần mà request đi qua.'],
  ['4 · Đi sâu', 'chỗ thắt cổ chai và đánh đổi', 'Nó sẽ gãy ở đâu trước? Cache, chỉ mục, hàng đợi, bản sao, CDN — mỗi thứ một cái giá. Nhắc tới giám sát.'],
])}

<h3>Các khối xây dựng bạn phải giải thích được</h3>
${stack([
  ['CDN', 'Bản sao tệp tĩnh và media ở biên mạng, gần người dùng. Cách rẻ nhất để trang nhanh khắp nơi.'],
  ['Reverse proxy / bộ cân bằng tải (nginx)', 'Một cửa vào duy nhất: TLS, chuyển request tới các bản ứng dụng, nén, giới hạn tần suất, header cache.'],
  ['Máy chủ ứng dụng phi trạng thái (stateless)', 'Không giữ trạng thái người dùng trong bộ nhớ, nên chạy được hai hay mười bản sau proxy.'],
  ['Cache (Redis)', 'Bản sao nhanh của những câu trả lời tốn kém để tính; cần một kế hoạch làm mất hiệu lực (invalidation).'],
  ['CSDL quan hệ (PostgreSQL)', 'Nguồn sự thật có giao dịch; mở rộng việc đọc bằng chỉ mục và bản sao trước tiên.'],
  ['Object storage (S3, R2)', 'Tệp và media, tải lên thẳng từ trình duyệt bằng URL ký sẵn, phục vụ qua CDN.'],
  ['Hàng đợi + worker', 'Việc chậm hoặc cần thử lại (email, xử lý video, báo cáo) được đưa ra khỏi request.'],
])}

<h3>Ví dụ làm mẫu: dịch vụ rút gọn link</h3>
<p>Yêu cầu: tạo link ngắn cho một URL dài; vào link ngắn thì chuyển hướng; đếm lượt bấm là tuỳ chọn. Rồi ước lượng, nói thành tiếng:</p>
${ra(UOC_LUONG_VI)}
<p>Thiết kế tổng thể: <code>POST /links</code> trả về một mã; <code>GET /:code</code> chuyển hướng. Một bảng <code>links(code khoá chính, long_url, owner_id, created_at)</code>. Đường chuyển hướng đọc cache trước (Redis, khoá = mã), hụt thì đọc CSDL rồi điền vào cache. Sinh mã: mã hoá base-62 một id tự tăng (ngắn, duy nhất, nhưng đoán được) hoặc 7 ký tự ngẫu nhiên kèm kiểm trùng (không đoán được). Chuyển hướng bằng <strong>302</strong> nếu muốn đếm mọi lượt bấm (trình duyệt cache 301 vĩnh viễn); đếm lượt bấm bất đồng bộ qua hàng đợi để việc chuyển hướng vẫn nhanh.</p>

<h3>Vẽ lại chính dự án của bạn: một nền tảng web cá nhân thật</h3>
<p>Câu trả lời system design mạnh nhất mà một sinh viên đưa ra được là lời giải thích sâu và trung thực về một hệ thống mình thật sự vận hành. Đây là một ví dụ, từ chính dự án mà khoá học này chạy trên đó: một nền tảng học tập và mạng xã hội làm bằng Next.js, Express và TypeScript, PostgreSQL với Prisma, Redis và Cloudflare R2, deploy bằng Docker Compose trên một VPS Ubuntu.</p>
${flow([
  ['Trình duyệt / app desktop', 'các client', 'Một web Next.js và một app desktop Electron cùng gọi một API.'],
  ['Cloudflare', 'DNS + CDN', 'Media (ảnh đại diện, video, tệp khoá học) phục vụ từ một bucket R2 qua CDN trên tên miền con riêng — máy chủ không bao giờ phải truyền những byte đó.'],
  ['nginx trên VPS', 'reverse proxy', 'TLS, chuyển /api tới backend và mọi thứ khác tới Next.js, header cache. (Nó từng ghi đè header cache của ứng dụng — bài 6.3.)'],
  ['Next.js + Express API', 'các container ứng dụng', 'Container phi trạng thái được dựng trên một máy riêng ở nhà, đẩy lên kho ảnh, rồi được một script deploy tráo trên VPS kèm smoke-test.'],
  ['PostgreSQL + Redis', 'dữ liệu', 'PostgreSQL là nguồn sự thật (migration bằng Prisma); Redis giữ cache và trạng thái realtime.'],
  ['Việc chạy nền', 'ra khỏi đường request', 'Việc chậm chạy bên ngoài request; tính năng AI nặng gọi nhà cung cấp mô hình bên ngoài, có trần chi phí mỗi ngày.'],
])}
<p>Rồi tới phần trung thực mà người phỏng vấn rất thích — điểm yếu và chuyện đã xảy ra:</p>
<ul>
<li><strong>Điểm hỏng duy nhất:</strong> một VPS chứa cả ứng dụng lẫn CSDL. Nó chết là mọi thứ chết, và khôi phục CSDL từ bản sao lưu sẽ là việc làm tay.</li>
<li><strong>Ổ đĩa dùng chung:</strong> ngày 18/08/2026 bộ đệm build Docker 7,6 GB làm đầy chính ổ đĩa chứa PostgreSQL trong lúc build; cách sửa là đưa việc dựng ảnh ra khỏi VPS hoàn toàn.</li>
<li><strong>Deploy giẫm nhau:</strong> hai workflow CI cùng được kích hoạt bởi một lần push đã cùng lúc tạo lại backend và gây sự cố thật, nên việc deploy trở thành một script chạy có chủ đích thay vì tác dụng phụ của việc push.</li>
<li><strong>Bước tiếp theo nếu lưu lượng tăng:</strong> chuyển PostgreSQL sang dịch vụ được quản lý hoặc thêm bản sao chỉ-đọc, chạy hai container API sau nginx (chúng phi trạng thái), dùng Redis cho trạng thái realtime dùng chung giữa chúng, và thêm cảnh báo về ổ đĩa và tỉ lệ lỗi.</li>
</ul>

<h3>Tám câu hỏi</h3>
${qa('vi', { so: '7.3-1', q: 'Dẫn anh đi qua kiến trúc dự án của em.', chu: 'độ sâu và sự làm chủ — câu "system design" hay gặp nhất với thực tập sinh.',
  a: '<p>Vừa nói vừa vẽ, đi theo MỘT request: "Người dùng mở trang khoá học: DNS và CDN ở Cloudflare, nginx trên VPS kết thúc TLS và chuyển tới container Next.js, nơi render trang và gọi API Express, API đọc PostgreSQL qua Prisma và Redis cho dữ liệu đã cache. Video thì đi thẳng từ object storage qua CDN." Rồi một quyết định kèm lý do, và một điểm yếu kèm cách sửa.</p>',
  sau: ['Vì sao em chọn PostgreSQL?', 'VPS khởi động lại thì sao?', 'Phần nào em tự làm, phần nào làm cùng AI?'],
  loi: 'Liệt kê công nghệ mà không có đường đi của request hay một đánh đổi nào.' })}
${qa('vi', { so: '7.3-2', q: 'Thiết kế một dịch vụ rút gọn link.', chu: 'đi đủ bốn bước trên một bài nhỏ.',
  a: '<p>Theo ví dụ làm mẫu: yêu cầu, ước lượng (≈ 12 lượt ghi/giây, ≈ 1.200 lượt đọc/giây, ≈ 180 GB/năm), hai endpoint, một bảng, cache trên đường chuyển hướng, lựa chọn cách sinh mã và đánh đổi của nó, 301 hay 302, và đếm lượt bấm bất đồng bộ.</p>',
  sau: ['Chặn người ta tạo link tới mã độc thế nào?', 'Xử lý thế nào khi tên tuỳ chọn đã có người dùng?'],
  loi: 'Nhảy ngay tới "dùng Kafka và Cassandra" mà không có số liệu.' })}
${qa('vi', { so: '7.3-3', q: 'API của bên anh chậm vì nhiều người đọc cùng một dữ liệu. Em làm gì?', chu: 'mở rộng việc đọc theo đúng thứ tự.',
  a: '<p>Đo trước: endpoint nào, truy vấn nào. Rồi theo thứ tự chi phí: thêm chỉ mục còn thiếu và sửa truy vấn N+1; cache kết quả (header HTTP cho dữ liệu công khai, Redis cho dữ liệu tính toán) có thời hạn và làm mất hiệu lực khi ghi; đưa phần tĩnh ra sau CDN; thêm bản sao chỉ-đọc nếu chính CSDL là nút thắt. Bước nào cũng có giá — cache có thể trả dữ liệu cũ, bản sao chạy chậm hơn bản chính một chút.</p>',
  sau: ['Cache stampede (dồn ập khi cache hết hạn) là gì và chặn thế nào?'], loi: '"Thêm máy chủ" trước khi tìm ra truy vấn chậm.' })}
${qa('vi', { so: '7.3-4', q: 'Em cho người dùng tải lên video tới 2 GB thế nào?', chu: 'không cho tệp lớn đi xuyên qua máy chủ ứng dụng.',
  a: '<p>Đừng gửi tệp qua API. API kiểm người dùng rồi cấp một <strong>URL ký sẵn (presigned URL)</strong>; trình duyệt tải thẳng lên object storage (multipart cho tệp lớn); API ghi nhận đối tượng khi việc tải được xác nhận; một worker xử lý video (ảnh thu nhỏ, nén) từ hàng đợi; CDN phục vụ nó. Máy chủ API không bao giờ phải giữ 2 GB trong bộ nhớ, và việc tải lên sống sót qua các lần khởi động lại ứng dụng.</p>',
  sau: ['Chặn ai đó tải tệp 2 GB lên một key không phải của họ thế nào?'], loi: 'Multer ghi xuống đĩa máy chủ ứng dụng, rồi chép sang kho lưu trữ.' })}
${qa('vi', { so: '7.3-5', q: 'Vì sao đặt một hàng đợi giữa API và việc gửi email?', chu: 'việc bất đồng bộ và thử lại.',
  a: '<p>Gửi một email có thể mất vài giây và có thể lỗi. Nếu nó xảy ra trong request, người dùng phải chờ và một lỗi làm hỏng request. Có hàng đợi, API ghi lại việc và trả về ngay; một worker gửi nó, thử lại có giãn cách khi lỗi, và việc sống sót qua các lần khởi động lại. Cái giá: thêm thành phần chuyển động, và việc phải an toàn khi chạy hai lần (idempotent), vì thử lại là chuyện sẽ xảy ra.</p>',
  sau: ['Idempotent ở đây nghĩa là gì?'], loi: 'Nói "hàng đợi làm cho nhanh hơn" — nó làm request nhanh hơn và công việc đáng tin hơn, chứ không làm email nhanh hơn.' })}
${qa('vi', { so: '7.3-6', q: 'SQL hay NoSQL cho một nền tảng khoá học?', chu: 'chọn theo hình dạng dữ liệu, không theo trào lưu.',
  a: '<p>Khoá học, bài học, người dùng, đăng ký và tiến độ là dữ liệu có quan hệ và ràng buộc — CSDL quan hệ hợp, có giao dịch cho những thứ như thanh toán. CSDL tài liệu hợp với dữ liệu được đọc nguyên khối và có hình dạng linh hoạt, nhưng JSONB của PostgreSQL đã che được phần lớn nhu cầu đó. Mặc định của em cho một hệ thống cỡ sinh viên là PostgreSQL, và em chỉ chuyển một phần việc cụ thể sang chỗ khác khi đo được nhu cầu thật.</p>',
  sau: ['Cho một ví dụ em sẽ chọn kho NoSQL.'], loi: '"NoSQL mở rộng tốt hơn" và hết.' })}
${qa('vi', { so: '7.3-7', q: 'Điểm hỏng duy nhất trong hệ thống của em là gì, em sẽ làm gì với nó?', chu: 'sự trung thực về điểm yếu.',
  a: '<p>Gọi tên thẳng: "Chính con VPS: ứng dụng và CSDL đều ở đó. Biện pháp hiện có: sao lưu CSDL (nói thật bản sao lưu của bạn chạy bao lâu một lần) và quay lui nhanh — ảnh cũ có thể gắn lại tag và chạy lại trong chưa tới một phút. Bước tiếp theo sẽ là CSDL được quản lý có sao lưu tự động, rồi một máy chủ ứng dụng thứ hai sau bộ cân bằng tải." Người phỏng vấn tin ứng viên thấy được điểm yếu của chính hệ thống mình.</p>',
  sau: ['Hôm nay khôi phục mất bao lâu?'], loi: '"Không có ạ."' })}
${qa('vi', { so: '7.3-8', q: 'Em bảo vệ một API khỏi bị dội request thế nào?', chu: 'kiến thức cơ bản về giới hạn tần suất.',
  a: '<p>Giới hạn số request mỗi người dùng hoặc mỗi IP trong một khung thời gian (token bucket hoặc cửa sổ cố định trong Redis, hoặc ở nginx), trả 429 kèm header Retry-After, đặt CDN hay WAF phía trước cho các đợt tấn công lớn, và đặt trần cho thao tác đắt (ví dụ giới hạn lượt gọi AI mỗi ngày). Giới hạn phải dùng chung giữa các bản ứng dụng, nên nó nằm ở Redis hoặc proxy, không nằm trong bộ nhớ tiến trình.</p>',
  sau: ['Theo IP hay theo người dùng — mỗi cách có vấn đề gì?'], loi: 'Chỉ trả lời "dùng Cloudflare".' })}

${bay('vi', 'vẽ kiến trúc kiểu "big tech" cho một bài toán nhỏ.', 'Microservices, Kafka và Kubernetes cho một dự án sinh viên có một trăm người dùng là dấu hiệu đáng lo, không phải thành tích. Người phỏng vấn muốn thấy thiết kế khớp với con số ở bước 2 — và bạn biết khi nào mới cần tới những mảnh lớn hơn.')}
${keXau('vi', 'mỗi cái hộp bạn vẽ cũng là một bề mặt tấn công. Cổng Redis mở ra Internet không mật khẩu, CSDL truy cập được từ bên ngoài, hay một bucket object storage cho liệt kê tệp công khai là những vụ rò rỉ kinh điển ngoài đời thật. Ở bước đi sâu, hãy nói thành phần nào với tới được từ Internet (chỉ proxy và CDN) và thành phần nào nằm trong mạng riêng.')}
${neu('vi', 'người phỏng vấn hỏi về một công nghệ bạn chưa từng dùng, như Kafka? Nói thật, rồi suy luận từ cái bạn biết: "Em chưa dùng Kafka; em hiểu nó là một nhật ký bền vững mà nhiều bên tiêu thụ đọc theo nhịp riêng. Với thiết kế này một hàng đợi đơn giản trên Redis là đủ ở mức 12 lượt ghi mỗi giây — em sẽ tìm tới Kafka nếu cần phát lại hoặc nhiều bên tiêu thụ độc lập."')}

${thucHanh('vi', { phut: '45–60', steps: [
  'Vẽ kiến trúc dự án chính của bạn lên giấy: mọi cái hộp, mọi mũi tên, và dữ liệu được lưu ở đâu.',
  'Giải thích nó thành tiếng trong ba phút, đi theo một request, rồi nêu hai điểm yếu và cách bạn sẽ sửa.',
  'Làm bốn bước cho dịch vụ rút gọn link trên giấy bằng số ước lượng của riêng bạn, không nhìn bài.',
  'Chọn một tính năng trong dự án (ví dụ tải tệp lên hoặc thông báo) và viết nó đổi ra sao khi người dùng gấp 100 lần.',
], dat: 'một sơ đồ hệ thống của chính bạn có ghi ngày, một bản ghi ba phút giải thích nó, và một trang thiết kế rút gọn link có số liệu.' })}
${thuatNgu('vi', [
  ['Yêu cầu chức năng / phi chức năng', 'Hệ thống làm gì / làm tốt tới đâu (quy mô, độ trễ, độ sẵn sàng).'],
  ['Back-of-the-envelope (ước lượng nhanh)', 'Phép tính thô để biết cỡ độ lớn.'],
  ['Stateless service (dịch vụ phi trạng thái)', 'Không giữ trạng thái từng người dùng trong bộ nhớ, nên chạy được nhiều bản.'],
  ['Read replica (bản sao chỉ-đọc)', 'Một bản sao CSDL phục vụ việc đọc, chậm hơn bản chính một chút.'],
  ['Presigned URL (URL ký sẵn)', 'URL có hạn cho phép client tải lên hoặc tải về đúng một đối tượng, trực tiếp.'],
  ['Single point of failure (điểm hỏng duy nhất)', 'Một thành phần mà hỏng là cả hệ thống sập.'],
  ['Rate limiting (giới hạn tần suất)', 'Giới hạn số request một client được gửi trong một khung thời gian.'],
])}
${tomTat('vi', [
  'Với junior, system design là giải thích sâu kiến trúc của chính mình và suy luận qua một thiết kế nhỏ.',
  'Đi bốn bước: yêu cầu, ước lượng, thiết kế tổng thể, đi sâu kèm đánh đổi.',
  'Nắm các khối xây dựng: CDN, reverse proxy, máy chủ phi trạng thái, cache, CSDL SQL, object storage, hàng đợi.',
  'Để con số quyết định: một CSDL SQL và một cache đi được rất xa.',
  'Gọi tên điểm hỏng duy nhất của chính hệ thống mình kèm cách sửa là một câu trả lời mạnh.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'api-design', bai: 'api-11-2-rut-gon-link', title: 'API & System Design 11.2 — Phỏng vấn: dịch vụ rút gọn link', sub: 'Cùng bài toán, đi sâu: yêu cầu, hợp đồng API và đường nóng.' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-2-cache-aside', title: 'Node.js 12.2 — Cache-aside và bốn lần phản bội', sub: 'Cache trên đường chuyển hướng, làm cho đúng.' }),
  lienKet({ khoa: 'object-storage', bai: 'os-4-1-vi-sao', title: 'Object Storage 4.1 — Vì sao cần URL ký sẵn', sub: 'Thiết kế tải lên của câu 7.3-4.' }),
  lienKet({ khoa: 'api-design', bai: 'api-5-3-rate-limit', title: 'API & System Design 5.3 — Giới hạn tần suất và hạn mức', sub: 'Token bucket và các header RateLimit.' }),
  yt('i7twT3x5yv8', 'ByteByteGo', 'System Design Interview: A Step-By-Step Guide', 10),
  nguon('📘', 'The System Design Primer (GitHub)', 'Bộ tài liệu miễn phí nổi tiếng về các khối xây dựng và thiết kế mẫu (tiếng Anh).', 'https://github.com/donnemartin/system-design-primer'),
])}
</div>
`,
};

/* ═══════════════════════ 7.4 — Dự án làm ở nhà ═══════════════════════ */
const CAY_EN = `
lab-booking-api/
├── README.md              how to run, decisions, trade-offs, not done, AI use
├── docker-compose.yml     api + postgres, one command: docker compose up
├── .env.example           every variable, with fake values (never the real .env)
├── prisma/ (or src/main/resources/db/migration for Flyway)
│   └── migrations/        schema as code, plus a seed script with demo data
├── src/
│   ├── routes/            HTTP only: parse, validate, call the service
│   ├── services/          the business rules (no double booking, opening hours)
│   └── middleware/        auth, error handler -> one JSON error format
└── tests/                 a few unit tests for rules + API tests for the main flow
`;
const CAY_VI = `
lab-booking-api/
├── README.md              cách chạy, quyết định, đánh đổi, chưa làm, dùng AI
├── docker-compose.yml     api + postgres, một lệnh: docker compose up
├── .env.example           mọi biến, giá trị giả (không bao giờ là .env thật)
├── prisma/ (hoặc src/main/resources/db/migration nếu dùng Flyway)
│   └── migrations/        lược đồ dạng code, kèm script seed dữ liệu mẫu
├── src/
│   ├── routes/            chỉ HTTP: đọc, kiểm hợp lệ, gọi service
│   ├── services/          luật nghiệp vụ (không đặt trùng, giờ mở cửa)
│   └── middleware/        xác thực, xử lý lỗi -> một định dạng lỗi JSON
└── tests/                 vài unit test cho luật + API test cho luồng chính
`;

const L74 = {
  title: '7.4 — Take-home projects: scope, quality, presentation, honest AI use, and running a stranger’s repository safely|||7.4 — Dự án làm ở nhà: phạm vi, chất lượng, trình bày, dùng AI trung thực, và chạy kho mã của người lạ an toàn',
  slug: 'pv-7-4-take-home',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án làm ở nhà kiểu backend/fullstack (ví dụ API đặt lịch phòng lab): chốt phạm vi và giới hạn thời gian, cấu trúc thư mục, chạy được bằng một lệnh, luật nghiệp vụ có test, README, buổi trình bày, khi nào bài làm ở nhà là "lao động không công", cách dùng AI trung thực, và cách chạy kho mã lạ không dính mã độc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Take-home projects: a small real product, judged like one</h2>
<p class="lead">For backend and fullstack roles, the take-home is usually a small API or app: "Build a REST API for booking lab rooms with authentication and no double booking. You have five days." The reviewer will run it, read it, and then talk to you about it. Treat it as a tiny real product: <strong>scoped</strong>, <strong>runnable with one command</strong>, with the <strong>business rules tested</strong>, and <strong>explained</strong> in a README you would be happy for a colleague to read. Lesson 6.4 covered the frontend version; this lesson covers the backend and the parts that apply to every take-home.</p>

<h3>An everyday picture: renovating one room in an exam</h3>
${doiThuong('en', 'A builder applying for a job is asked to redo one bathroom, not the whole house. The client judges whether the water runs, the tiles are straight, nothing leaks — and whether the builder left a note saying which pipe they did not replace and why. A take-home is that bathroom: finish the scope well, leave a clear note, and do not start knocking down walls nobody asked about.')}

<h3>The five decisions that matter</h3>
${flow([
  ['1 · Scope', 'must-haves first, written down', 'List the requirements from the brief. Ask about anything ambiguous in one email on day one. Decide what you will not build and say so in the README.'],
  ['2 · Time-box', 'about the time they suggest', 'If they say "about 4 hours", spend about 4–6 — not 30. Note your real time in the README; reviewers compare fairly when everyone is honest.'],
  ['3 · Runnability', 'one command', 'docker compose up, or two commands with exact versions. A seed script with demo data and a ready test account.'],
  ['4 · Rules + tests', 'the business logic is the point', 'No double booking, opening hours, permissions — tested at the service level, plus one or two API tests for the main flow.'],
  ['5 · Presentation', 'README + a 10-minute walkthrough', 'How to run, the design in five lines, trade-offs, what is not done, how AI was used.'],
])}

<h3>A structure that reviewers read quickly</h3>
${ra(CAY_EN)}
<p>The layering matters more than the framework: routes only deal with HTTP, services hold the rules, data access is in one place, and errors come out in one consistent JSON format with the right status codes (400/422 for invalid input, 401 vs 403, 404, 409 for a booking conflict). For a Java company, the same shape in Spring Boot is controller → service → repository, with Flyway or Liquibase migrations.</p>

<h3>Eight questions from the walkthrough</h3>
${qa('en', { so: '7.4-1', q: 'How did you prevent double booking?', chu: 'whether the core rule is correct under concurrency.',
  a: '<p>Checking "is the slot free?" and then inserting is not enough — two requests can both see it free. The robust answer is in the database: a unique constraint on (room, slot), or for overlapping time ranges in PostgreSQL an exclusion constraint, or a transaction that locks the room row. The service catches the constraint error and returns 409 Conflict. I wrote a test that sends two bookings for the same slot and expects exactly one success.</p>',
  sau: ['What isolation level does that need?', 'How would you test it with two concurrent requests?'],
  loi: 'Only checking in application code and calling it safe.' })}
${qa('en', { so: '7.4-2', q: 'Why this structure (routes, services, repositories)?', chu: 'separation of concerns with a reason.',
  a: '<p>It keeps each kind of change in one place: an HTTP change touches routes, a business rule touches a service, a database change touches the data layer. It also makes the rules testable without starting a server. For a project this size I avoided further layers — no generic repository abstraction — because they would add files without adding clarity.</p>',
  sau: ['Where would validation live?'], loi: '"Because that is clean architecture."' })}
${qa('en', { so: '7.4-3', q: 'What did you leave out, and why?', chu: 'scoping judgement.',
  a: '<p>"I did not build email notifications or an admin panel; the brief listed them as optional and I preferred to spend the time on the double-booking guarantee and tests. With another day I would add pagination on the bookings list and rate limiting on login." Leaving things out on purpose, and saying so, reads as maturity.</p>',
  sau: ['Which of those is the biggest risk if it went to production now?'], loi: 'Pretending it is complete.' })}
${qa('en', { so: '7.4-4', q: 'How do I run it, and how are secrets handled?', chu: 'operational basics.',
  a: '<p>"<code>docker compose up</code> starts the API and PostgreSQL, runs migrations and seeds demo data; the README lists the test account. Configuration comes from environment variables; <code>.env.example</code> documents them with fake values, and the real <code>.env</code> is in <code>.gitignore</code>. JWT secrets and database passwords are never in the repository."</p>',
  sau: ['What would change for production?'], loi: 'A hard-coded password in the source or a committed .env.' })}
${qa('en', { so: '7.4-5', q: 'How did you use AI on this?', chu: 'honesty and judgement.',
  a: '<p>Be specific: "I used an AI assistant to scaffold the Docker Compose file and some test boilerplate, and to review my double-booking query. I wrote the service logic myself and rejected one suggestion that checked availability in application code only, because of the race condition." Then be ready for the reviewer to ask you to change any part live.</p>',
  sau: ['Show me where it was wrong.'], loi: 'Saying "no" when you did, or "it wrote everything" with nothing you can defend.' })}
${qa('en', { so: '7.4-6', q: 'How would this behave with ten times the users?', chu: 'scaling thinking proportional to the project.',
  a: '<p>"The API is stateless, so I could run two instances behind a load balancer. The first bottleneck would be the bookings query — I added an index on (room_id, start_time). Login would need rate limiting shared in Redis. I would not change the architecture before measuring." Keep it proportional; a booking API does not need microservices.</p>',
  sau: ['What would you monitor first?'], loi: 'Proposing Kafka for a few hundred users.' })}
${qa('en', { so: '7.4-7', q: 'The brief asks you to build a complete feature for the company’s real product in two weeks. Is that normal?', chu: 'recognising unfair or fake take-homes.',
  a: '<p>No. A normal take-home is a few hours to a couple of days on a toy problem. A long task on the company’s own product, especially unpaid and with vague "we will decide later", can be free labour. It is reasonable to ask politely about the expected time and whether it is paid, or to offer a smaller sample instead. And a take-home that asks you to run their private repository before you even talk to anyone deserves extra suspicion (see the next box).</p>',
  sau: [], loi: 'Doing three weeks of work because you are afraid to ask.' })}
${qa('en', { so: '7.4-8', q: 'What would you improve in your code if you started again?', chu: 'reflection.',
  a: '<p>Choose a real point: "I would write the double-booking test first; I found the race only after writing the happy path. And I would agree the error format before writing routes — I had to change three handlers later." Real reflection beats a generic "more tests".</p>',
  sau: [], loi: '"Nothing" or a vague answer.' })}

${bay('en', 'gold-plating — building far beyond the brief.', 'Adding Kubernetes manifests, a message broker and a full admin UI to a five-day booking API does not impress; it signals that you cannot scope. Reviewers spend about the same time on every submission. Spend yours where they will look: the rules, the tests, the README and the one-command run.')}
${keXau('en', 'take-home repositories are a real infection route. The "Contagious Interview" campaign (Palo Alto Networks Unit 42, 2023) sends developers projects whose install step runs hidden code that steals browser passwords and crypto wallets. Before running any repository from a stranger: read <code>package.json</code> scripts (<code>preinstall</code>, <code>postinstall</code>, <code>prepare</code>), search for obfuscated files and unexpected network calls, and run it inside a container or a disposable virtual machine with no access to your real accounts. Never use your real GitHub token, cloud keys or wallet on the same machine session.')}
${neu('en', 'you discover halfway through that you misunderstood a requirement? Email the company, explain the two interpretations briefly, and ask which they meant. If there is no reply in time, choose one, implement it, and state the assumption in the README. Clear assumptions are part of the work, not a weakness.')}

${thucHanh('en', { phut: '240–360', steps: [
  'Give yourself the brief: "REST API for booking lab rooms: register/login, list rooms, create and cancel bookings, no double booking, only the owner or an admin can cancel." Time-box it to six hours.',
  'Use the folder structure above, a migration, a seed script and docker compose. It must run with one command on a friend’s machine.',
  'Write a test that fires two bookings for the same slot and expects one 201 and one 409.',
  'Write the README (run, design, trade-offs, not done, AI use) and do a 10-minute recorded walkthrough answering the eight questions.',
], dat: 'a friend can clone and run it with one command, the concurrency test passes, and you have a recorded walkthrough.' })}
${thuatNgu('en', [
  ['Scope', 'What is included in the work and what is explicitly left out.'],
  ['Gold-plating', 'Adding features or polish that nobody asked for.'],
  ['Seed data', 'Demo data loaded automatically so the reviewer can try the app at once.'],
  ['Unique / exclusion constraint', 'A database rule that rejects duplicate or overlapping rows.'],
  ['409 Conflict', 'The HTTP status for a request that clashes with current state.'],
  ['Walkthrough', 'A short guided tour of your solution for the reviewer.'],
])}
${tomTat('en', [
  'Treat a take-home as a tiny real product: scoped, runnable with one command, rules tested, explained.',
  'Spend about the suggested time and report it honestly.',
  'Guarantee core rules like "no double booking" in the database, and prove them with a concurrency test.',
  'Say what you left out and why, and how you used AI.',
  'Long, unpaid work on the company’s real product is a red flag; so is "run our repo first".',
  'Run strangers’ code only in isolation, after reading its install scripts.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', L: 'en', title: 'PostgreSQL 11.4 — Row locks, lost updates and deadlocks', sub: 'The concurrency behind question 7.4-1.' }),
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', L: 'en', title: 'API & System Design 1.3 — Status codes that mean something', sub: '400 vs 422, 401 vs 403, 409 — the error format reviewers check.' }),
  lienKet({ khoa: 'docker', bai: 'dk-9-1-file-dau-tien', L: 'en', title: 'Docker 9.1 — Your first compose file', sub: 'How to make "one command to run" true.' }),
  yt('YrrW-pVMDEU', 'Aced (formerly Exponent)', 'How to Prepare for a Product/Technical Take Home Interview', 4, 'en'),
  nguon('🛡️', 'Unit 42 (2023) — Job-related campaigns targeting developers', 'The research behind the "run this repository" warning.', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Dự án làm ở nhà: một sản phẩm thật tí hon, được chấm như sản phẩm thật</h2>
<p class="lead">Với vị trí backend và fullstack, bài làm ở nhà thường là một API hay app nhỏ: "Dựng REST API đặt lịch phòng lab, có xác thực và không được đặt trùng. Bạn có năm ngày." Người review sẽ chạy nó, đọc nó, rồi nói chuyện với bạn về nó. Hãy coi nó là một sản phẩm thật tí hon: <strong>có phạm vi rõ</strong>, <strong>chạy được bằng một lệnh</strong>, <strong>luật nghiệp vụ có test</strong>, và <strong>được giải thích</strong> trong một README mà bạn vui lòng để đồng nghiệp đọc. Bài 6.4 đã nói về bản frontend; bài này nói phần backend và những gì áp dụng cho mọi bài làm ở nhà.</p>

<h3>Liên tưởng đời thường: sửa đúng một phòng trong buổi thử việc</h3>
${doiThuong('vi', 'Một người thợ xin việc được giao làm lại một phòng tắm, không phải cả căn nhà. Chủ nhà chấm xem nước có chảy không, gạch có thẳng không, có rò rỉ không — và người thợ có để lại tờ giấy ghi đường ống nào chưa thay, vì sao. Bài làm ở nhà chính là phòng tắm đó: làm tốt phạm vi được giao, để lại ghi chú rõ ràng, và đừng bắt đầu đập những bức tường không ai nhờ.')}

<h3>Năm quyết định quan trọng</h3>
${flow([
  ['1 · Phạm vi', 'việc bắt buộc trước, viết ra giấy', 'Liệt kê yêu cầu trong đề. Hỏi mọi chỗ mơ hồ trong một email ngay ngày đầu. Quyết định thứ bạn sẽ KHÔNG làm và ghi trong README.'],
  ['2 · Giới hạn thời gian', 'xấp xỉ thời gian họ gợi ý', 'Họ nói "khoảng 4 giờ" thì dành khoảng 4–6 giờ — không phải 30. Ghi thời gian thật trong README; người review so sánh công bằng khi ai cũng thành thật.'],
  ['3 · Chạy được', 'một lệnh', 'docker compose up, hoặc hai lệnh có ghi rõ phiên bản. Một script seed dữ liệu mẫu và sẵn một tài khoản thử.'],
  ['4 · Luật + test', 'logic nghiệp vụ mới là trọng tâm', 'Không đặt trùng, giờ mở cửa, quyền hạn — test ở tầng service, cộng một hai API test cho luồng chính.'],
  ['5 · Trình bày', 'README + buổi dẫn giải 10 phút', 'Cách chạy, thiết kế trong năm dòng, đánh đổi, phần chưa làm, đã dùng AI thế nào.'],
])}

<h3>Một cấu trúc người review đọc nhanh</h3>
${ra(CAY_VI)}
<p>Cách chia tầng quan trọng hơn framework: route chỉ lo HTTP, service giữ luật, truy cập dữ liệu nằm một chỗ, và lỗi đi ra theo một định dạng JSON nhất quán với mã trạng thái đúng (400/422 cho đầu vào sai, 401 khác 403, 404, 409 cho đặt lịch bị đụng). Với công ty dùng Java, cùng hình dạng đó trong Spring Boot là controller → service → repository, kèm migration bằng Flyway hoặc Liquibase.</p>

<h3>Tám câu hỏi trong buổi dẫn giải</h3>
${qa('vi', { so: '7.4-1', q: 'Em chặn việc đặt trùng lịch thế nào?', chu: 'luật cốt lõi có đúng khi có nhiều request cùng lúc không.',
  a: '<p>Kiểm "khung giờ này còn trống không?" rồi mới chèn là chưa đủ — hai request có thể cùng thấy trống. Câu trả lời vững nằm ở CSDL: một ràng buộc unique trên (phòng, khung giờ), hoặc với khoảng thời gian chồng nhau trong PostgreSQL là một exclusion constraint, hoặc một giao dịch khoá dòng của phòng. Service bắt lỗi ràng buộc và trả 409 Conflict. Em viết một test gửi hai lượt đặt cùng khung giờ và mong đúng một lượt thành công.</p>',
  sau: ['Cần mức cô lập (isolation level) nào?', 'Em test bằng hai request đồng thời thế nào?'],
  loi: 'Chỉ kiểm trong code ứng dụng rồi coi là an toàn.' })}
${qa('vi', { so: '7.4-2', q: 'Vì sao lại chia cấu trúc thế này (route, service, repository)?', chu: 'tách trách nhiệm có lý do.',
  a: '<p>Nó giữ mỗi loại thay đổi ở một chỗ: đổi HTTP thì đụng route, đổi luật nghiệp vụ thì đụng service, đổi CSDL thì đụng tầng dữ liệu. Nó còn cho phép test luật mà không cần khởi động máy chủ. Với dự án cỡ này em tránh thêm tầng — không có lớp repository chung chung — vì chúng thêm tệp mà không thêm sự rõ ràng.</p>',
  sau: ['Kiểm hợp lệ nằm ở đâu?'], loi: '"Vì đó là clean architecture."' })}
${qa('vi', { so: '7.4-3', q: 'Em đã bỏ ra những gì, vì sao?', chu: 'óc phán đoán về phạm vi.',
  a: '<p>"Em không làm thông báo email hay trang quản trị; đề ghi chúng là tuỳ chọn và em muốn dành thời gian cho việc bảo đảm không đặt trùng và cho test. Có thêm một ngày em sẽ thêm phân trang cho danh sách đặt lịch và giới hạn tần suất ở đăng nhập." Cố ý bỏ bớt, và nói ra, được đọc là chín chắn.</p>',
  sau: ['Nếu đưa lên production ngay bây giờ thì cái nào rủi ro nhất?'], loi: 'Làm như nó đã hoàn chỉnh.' })}
${qa('vi', { so: '7.4-4', q: 'Anh chạy nó thế nào, và bí mật được xử lý ra sao?', chu: 'kiến thức vận hành cơ bản.',
  a: '<p>"<code>docker compose up</code> khởi động API và PostgreSQL, chạy migration và seed dữ liệu mẫu; README có tài khoản thử. Cấu hình lấy từ biến môi trường; <code>.env.example</code> ghi lại chúng bằng giá trị giả, còn <code>.env</code> thật nằm trong <code>.gitignore</code>. Khoá bí mật JWT và mật khẩu CSDL không bao giờ nằm trong kho mã."</p>',
  sau: ['Lên production thì đổi gì?'], loi: 'Mật khẩu viết cứng trong mã nguồn hoặc commit luôn .env.' })}
${qa('vi', { so: '7.4-5', q: 'Em đã dùng AI cho bài này thế nào?', chu: 'trung thực và óc phán đoán.',
  a: '<p>Nói cụ thể: "Em dùng trợ lý AI dựng khung tệp Docker Compose và một ít khung test, và nhờ nó soát truy vấn chống đặt trùng. Phần logic service em tự viết, và em đã bỏ một gợi ý chỉ kiểm lịch trống trong code ứng dụng, vì nó dính cuộc đua (race condition)." Rồi sẵn sàng để người review nhờ bạn sửa bất kỳ phần nào ngay tại chỗ.</p>',
  sau: ['Chỉ cho anh chỗ nó đã sai.'], loi: 'Nói "không" khi có dùng, hoặc "nó viết hết" mà không có gì bạn bảo vệ được.' })}
${qa('vi', { so: '7.4-6', q: 'Với số người dùng gấp mười thì nó ra sao?', chu: 'tư duy mở rộng tương xứng với dự án.',
  a: '<p>"API phi trạng thái, nên em chạy được hai bản sau một bộ cân bằng tải. Nút thắt đầu tiên sẽ là truy vấn danh sách đặt lịch — em đã thêm chỉ mục trên (room_id, start_time). Đăng nhập sẽ cần giới hạn tần suất dùng chung trong Redis. Em sẽ không đổi kiến trúc trước khi đo." Giữ cho tương xứng; một API đặt lịch không cần microservices.</p>',
  sau: ['Em sẽ giám sát cái gì đầu tiên?'], loi: 'Đề xuất Kafka cho vài trăm người dùng.' })}
${qa('vi', { so: '7.4-7', q: 'Đề bài bắt bạn làm trọn một tính năng cho sản phẩm thật của công ty trong hai tuần. Có bình thường không?', chu: 'nhận ra bài làm ở nhà không công bằng hoặc giả.',
  a: '<p>Không. Bài làm ở nhà bình thường là vài giờ tới vài ngày cho một bài toán mô phỏng. Một việc dài trên chính sản phẩm của công ty, nhất là không trả công và kèm câu mơ hồ "tính sau", có thể là lao động không công. Hoàn toàn hợp lý khi lịch sự hỏi thời gian mong đợi và có được trả công không, hoặc đề nghị một bài mẫu nhỏ hơn. Và một bài làm ở nhà bắt bạn chạy kho mã riêng của họ trước cả khi nói chuyện với ai càng đáng nghi (xem ô bên dưới).</p>',
  sau: [], loi: 'Làm ba tuần vì sợ hỏi.' })}
${qa('vi', { so: '7.4-8', q: 'Nếu làm lại từ đầu em sẽ cải thiện gì trong code?', chu: 'khả năng tự nhìn lại.',
  a: '<p>Chọn một điểm thật: "Em sẽ viết test chống đặt trùng trước; em chỉ phát hiện ra cuộc đua sau khi viết xong đường suôn sẻ. Và em sẽ thống nhất định dạng lỗi trước khi viết route — sau đó em phải sửa ba hàm xử lý." Tự nhìn lại thật lòng thắng một câu chung chung "thêm test".</p>',
  sau: [], loi: '"Không có gì" hoặc một câu mơ hồ.' })}

${bay('vi', 'mạ vàng (gold-plating) — làm vượt xa đề bài.', 'Thêm manifest Kubernetes, một message broker và cả một giao diện quản trị cho một API đặt lịch năm ngày không gây ấn tượng; nó báo hiệu bạn không biết khoanh phạm vi. Người review dành thời gian gần như nhau cho mọi bài nộp. Hãy dành thời gian của bạn vào chỗ họ sẽ nhìn: luật, test, README và việc chạy bằng một lệnh.')}
${keXau('vi', 'kho mã bài làm ở nhà là một đường lây nhiễm có thật. Chiến dịch "Contagious Interview" (Unit 42 của Palo Alto Networks, 2023) gửi cho lập trình viên những dự án mà bước cài đặt chạy mã ẩn lấy cắp mật khẩu trình duyệt và ví tiền điện tử. Trước khi chạy bất kỳ kho mã nào của người lạ: đọc phần scripts trong <code>package.json</code> (<code>preinstall</code>, <code>postinstall</code>, <code>prepare</code>), tìm tệp bị làm rối mã và các lời gọi mạng bất thường, và chạy nó trong container hoặc máy ảo dùng một lần, không đụng tới tài khoản thật của bạn. Không dùng token GitHub thật, khoá cloud hay ví tiền trong cùng phiên máy đó.')}
${neu('vi', 'làm được nửa chừng bạn phát hiện mình hiểu sai một yêu cầu? Email cho công ty, giải thích ngắn gọn hai cách hiểu, và hỏi họ muốn cách nào. Nếu không kịp có trả lời, chọn một cách, làm nó, và ghi rõ giả định trong README. Giả định rõ ràng là một phần của công việc, không phải điểm yếu.')}

${thucHanh('vi', { phut: '240–360', steps: [
  'Tự giao đề: "REST API đặt lịch phòng lab: đăng ký/đăng nhập, xem danh sách phòng, tạo và huỷ lượt đặt, không được đặt trùng, chỉ chủ lượt đặt hoặc admin được huỷ." Giới hạn sáu giờ.',
  'Dùng cấu trúc thư mục ở trên, một migration, một script seed và docker compose. Nó phải chạy được bằng một lệnh trên máy một người bạn.',
  'Viết một test bắn hai lượt đặt cùng khung giờ và mong một 201 và một 409.',
  'Viết README (cách chạy, thiết kế, đánh đổi, chưa làm, dùng AI) và quay một buổi dẫn giải 10 phút trả lời tám câu hỏi trên.',
], dat: 'một người bạn clone về và chạy được bằng một lệnh, test đồng thời chạy xanh, và bạn có bản ghi buổi dẫn giải.' })}
${thuatNgu('vi', [
  ['Scope (phạm vi)', 'Thứ được bao gồm trong công việc và thứ được bỏ ra một cách rõ ràng.'],
  ['Gold-plating (mạ vàng)', 'Thêm tính năng hay đánh bóng mà không ai yêu cầu.'],
  ['Seed data (dữ liệu mẫu)', 'Dữ liệu demo nạp tự động để người review thử app ngay.'],
  ['Unique / exclusion constraint (ràng buộc)', 'Luật CSDL từ chối dòng trùng hoặc khoảng chồng nhau.'],
  ['409 Conflict', 'Mã HTTP cho request đụng với trạng thái hiện tại.'],
  ['Walkthrough (buổi dẫn giải)', 'Một chuyến dẫn đường ngắn qua lời giải của bạn cho người review.'],
])}
${tomTat('vi', [
  'Coi bài làm ở nhà là một sản phẩm thật tí hon: có phạm vi, chạy bằng một lệnh, luật có test, có giải thích.',
  'Dành xấp xỉ thời gian được gợi ý và báo thật.',
  'Bảo đảm luật cốt lõi như "không đặt trùng" ở CSDL, và chứng minh bằng một test đồng thời.',
  'Nói rõ đã bỏ gì, vì sao, và đã dùng AI thế nào.',
  'Việc dài, không công trên sản phẩm thật của công ty là cờ đỏ; "chạy kho mã của bên anh trước đã" cũng vậy.',
  'Chỉ chạy code của người lạ trong môi trường cô lập, sau khi đọc script cài đặt.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-4-khoa-deadlock', title: 'PostgreSQL 11.4 — Khoá dòng, mất cập nhật và deadlock', sub: 'Phần đồng thời nằm sau câu 7.4-1.' }),
  lienKet({ khoa: 'api-design', bai: 'api-1-3-status', title: 'API & System Design 1.3 — Mã trạng thái có ý nghĩa', sub: '400 khác 422, 401 khác 403, 409 — định dạng lỗi người review kiểm.' }),
  lienKet({ khoa: 'docker', bai: 'dk-9-1-file-dau-tien', title: 'Docker 9.1 — Tệp compose đầu tiên', sub: 'Làm cho "một lệnh là chạy" trở thành sự thật.' }),
  yt('YrrW-pVMDEU', 'Aced (formerly Exponent)', 'How to Prepare for a Product/Technical Take Home Interview', 4),
  nguon('🛡️', 'Unit 42 (2023) — Các chiến dịch liên quan tới việc làm nhắm vào lập trình viên', 'Nghiên cứu đứng sau lời cảnh báo "chạy kho mã này" (tiếng Anh).', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/'),
])}
</div>
`,
};

/* ═══════════════════════ 7.5 — Lab: mock coding ═══════════════════════ */
const DE_LAB_EN = `
PROBLEM A — 20 minutes (easy)
A string of student check-in codes, one character per student, e.g. "aabbcdde".
Return the index of the first character that appears exactly once, or -1.
  "leetcode"  -> 0      "loveleetcode" -> 2      "aabb" -> -1      "" -> -1

PROBLEM B — 30 minutes (medium)
A lab floor plan is a grid of strings: 'S' start, 'E' exit, '#' wall, '.' free.
You may move up, down, left or right. Return the fewest moves from S to E, or -1.
  ["S.#",          ["S#E",
   "..#",           ".#.",          ["S#",
   "#.E"]  -> 4     "..."]  -> 6     "#E"]  -> -1
`;
const DE_LAB_VI = `
BÀI A — 20 phút (dễ)
Một chuỗi mã điểm danh, mỗi sinh viên một ký tự, ví dụ "aabbcdde".
Trả về chỉ số của ký tự đầu tiên xuất hiện đúng một lần, hoặc -1.
  "leetcode"  -> 0      "loveleetcode" -> 2      "aabb" -> -1      "" -> -1

BÀI B — 30 phút (trung bình)
Sơ đồ phòng lab là một lưới chuỗi: 'S' xuất phát, 'E' lối ra, '#' tường, '.' trống.
Được đi lên, xuống, trái, phải. Trả về số bước ít nhất từ S tới E, hoặc -1.
  ["S.#",          ["S#E",
   "..#",           ".#.",          ["S#",
   "#.E"]  -> 4     "..."]  -> 6     "#E"]  -> -1
`;
const JS_A = `
function firstUnique(s) {
  const count = new Map();                         // pass 1: how many times each char appears
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) {             // pass 2: first one with count 1
    if (count.get(s[i]) === 1) return i;
  }
  return -1;
}
// O(n) time, O(k) space for k distinct characters
`;
const JAVA_A = `
int firstUnique(String s) {
  Map<Character, Integer> count = new HashMap<>();
  for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);
  for (int i = 0; i < s.length(); i++) {
    if (count.get(s.charAt(i)) == 1) return i;
  }
  return -1;
}
`;
const JS_B = `
function shortestPath(grid) {
  const rows = grid.length, cols = rows ? grid[0].length : 0;
  let start = null;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) if (grid[r][c] === 'S') start = [r, c];
  if (!start) return -1;
  const dist = grid.map((row) => Array.from(row, () => -1));   // -1 = not visited
  dist[start[0]][start[1]] = 0;
  const queue = [start];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let head = 0; head < queue.length; head++) {
    const [y, x] = queue[head];
    if (grid[y][x] === 'E') return dist[y][x];      // BFS: the first time we reach E is the shortest
    for (const [dy, dx] of dirs) {
      const ny = y + dy, nx = x + dx;
      if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
      if (grid[ny][nx] === '#' || dist[ny][nx] !== -1) continue;
      dist[ny][nx] = dist[y][x] + 1;
      queue.push([ny, nx]);
    }
  }
  return -1;
}
// O(rows * cols) time and space
`;
const JAVA_B = `
int shortestPath(String[] grid) {
  int rows = grid.length, cols = rows == 0 ? 0 : grid[0].length();
  int[][] dist = new int[rows][cols];
  Deque<int[]> queue = new ArrayDeque<>();
  for (int r = 0; r < rows; r++) {
    Arrays.fill(dist[r], -1);
    for (int c = 0; c < cols; c++)
      if (grid[r].charAt(c) == 'S') { dist[r][c] = 0; queue.add(new int[] { r, c }); }
  }
  int[][] dirs = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
  while (!queue.isEmpty()) {
    int[] cur = queue.poll();
    if (grid[cur[0]].charAt(cur[1]) == 'E') return dist[cur[0]][cur[1]];
    for (int[] d : dirs) {
      int ny = cur[0] + d[0], nx = cur[1] + d[1];
      if (ny < 0 || ny >= rows || nx < 0 || nx >= cols) continue;
      if (grid[ny].charAt(nx) == '#' || dist[ny][nx] != -1) continue;
      dist[ny][nx] = dist[cur[0]][cur[1]] + 1;
      queue.add(new int[] { ny, nx });
    }
  }
  return -1;
}
`;

const L75 = {
  title: '7.5 — Lab: a timed mock coding round — two problems, a score sheet, and full solutions|||7.5 — Lab: vòng coding thử có giờ — hai bài, phiếu chấm, và lời giải đầy đủ',
  slug: 'pv-7-5-lab-mock-coding',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab chương 7: một vòng coding thử 50 phút theo đúng khung sáu bước — bài A dễ (ký tự xuất hiện một lần đầu tiên, hash map) và bài B trung bình (đường ngắn nhất trong sơ đồ phòng lab, BFS) — kèm kịch bản người chấm, gợi ý từng bậc, phiếu chấm 20 điểm và lời giải JavaScript + Java.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab</span>
<h2>Lab — a timed mock coding round</h2>
<p class="lead">This lab is a full 50-minute coding round. Two problems: one easy (20 minutes) and one medium (30 minutes), the same mix many internship tests use. Do it with a partner who plays the interviewer, or alone with a timer and a camera. Use the six steps from Lesson 7.1 and the phrases from Lesson 7.2. Then score yourself honestly with the sheet and compare with the reference solutions — which are hidden until you have tried.</p>

<h3>The situation</h3>
<p>A company invited you to a one-hour technical call. The engineer says: "We will do two short problems. Use any language you like. Talk me through your thinking." You pick your strongest language — JavaScript or Java.</p>
${flow([
  ['0–2 min', 'setup', 'Open an empty file or a shared editor; no autocomplete-AI. Start the timer.'],
  ['2–22 min', 'problem A', 'Restate, examples, brute force, plan, code, hand test, complexity.'],
  ['22–52 min', 'problem B', 'Same steps; this one needs a pattern you must recognise.'],
  ['52–60 min', 'review', 'Run the given examples for real, then score with the sheet.'],
])}
${ra(DE_LAB_EN)}

<h3>For the person playing the interviewer</h3>
<ol>
<li>Read problem A aloud. Answer clarifying questions: characters are lowercase letters; the string can be empty.</li>
<li>If the candidate codes in silence for over two minutes, ask "What are you thinking?".</li>
<li>Problem B: if no approach after eight minutes, give hint 1; after fifteen, hint 2.</li>
<li>After each problem: "What is the time and space complexity?" and "What test cases would you add?"</li>
</ol>
<details><summary>Hint A</summary><p>You need to know, for each character, how many times it appears in the whole string — before you can decide about any position. Two passes are fine.</p></details>
<details><summary>Hint B1</summary><p>"Fewest moves" in a grid where every move costs the same is a shortest path in an unweighted graph. Which traversal explores by distance?</p></details>
<details><summary>Hint B2</summary><p>Breadth-first search from S, recording the distance of each cell when you first add it to the queue; walls and visited cells are skipped. The first time you take E out of the queue, its distance is the answer.</p></details>
<details><summary>Reference solution A (JavaScript + Java)</summary>
${ma('js', JS_A)}${ma('java', JAVA_A)}
<p>Common mistakes: returning the character instead of the index; one nested loop counting for every position (O(n²) — acceptable as a brute force if you say so); forgetting the empty string.</p>
</details>
<details><summary>Reference solution B (JavaScript + Java)</summary>
${ma('js', JS_B)}${ma('java', JAVA_B)}
<p>Common mistakes: using DFS, which finds <em>a</em> path but not the shortest; marking cells visited when they are taken out of the queue instead of when they are added (cells get added many times); not handling "no S" or "E unreachable"; using <code>queue.shift()</code> in JavaScript on a large grid.</p>
</details>

<h3>Score sheet (out of 20)</h3>
${rubric('en', [
  ['Restating + clarifying', 'Started coding at once', 'Restated only', 'Restated and asked about empty input, characters, unreachable exit'],
  ['Examples first', 'None', 'Used the given ones only', 'Added an own edge case before coding'],
  ['Brute force stated', 'No', 'Implied', 'Stated with its complexity'],
  ['Pattern found (B)', 'No approach', 'DFS / partly right', 'BFS with distances, explained why'],
  ['Plan agreed', 'No', 'Mentioned', 'Asked "does this sound OK?" before typing'],
  ['Code correctness', 'Does not run', 'Runs, fails an example', 'All given examples pass'],
  ['Code clarity', 'Single letters, one long block', 'Mostly clear', 'Clear names, small steps'],
  ['Hand test', 'None', 'Partial', 'Traced an example and an edge case'],
  ['Complexity', 'Not stated', 'Time only', 'Time and space, correct'],
  ['Communication', 'Long silences', 'Some narration', 'Narrated decisions, used check-ins, stayed calm'],
])}
<p>Rough reading of the total: 16–20 is ready for most internship coding rounds; 11–15 means practise the steps more than new problems; under 11 means redo Lesson 7.1’s eight patterns from blank files first.</p>
${bay('en', 'checking the solution after two minutes of being stuck.', 'Struggling for ten or fifteen minutes is where the learning happens — and where you practise the phrases for being stuck. Open a hint only at the times given, and the solution only after the timer ends.')}
${keXau('en', 'practice platforms and "leaked interview question" sites are sometimes used to distribute malicious browser extensions or "answer helper" programs. Practise on well-known platforms, never install tools that promise to answer live interviews for you, and never enter your real company or school credentials into a site that offers "the real questions".')}
${neu('en', 'you solve problem A in five minutes? Use the extra time well: discuss a follow-up out loud — "what if the string is a stream and I cannot store it all?" (keep counts plus a queue of candidates) — instead of sitting idle.')}
${thucHanh('en', { phut: '60', steps: [
  'Run the 50-minute round with the timer, recording yourself.',
  'Run the examples in a real environment and fix anything that fails.',
  'Score yourself with the sheet from the recording, not from memory.',
  'Within a week, repeat with two different problems of the same patterns (hash map counting; BFS on a grid) and compare scores.',
], dat: 'two recorded rounds with score sheets, and both problems passing all given examples.' })}
${thuatNgu('en', [
  ['Unweighted shortest path', 'Fewest steps when every step costs the same — solved by BFS.'],
  ['Visited set / distance grid', 'A record of cells already reached, so none is processed twice.'],
  ['Two-pass solution', 'First collect information over the whole input, then use it.'],
  ['Timed round', 'A coding round with a strict time limit per problem.'],
  ['Stream', 'Input that arrives piece by piece and cannot all be stored.'],
])}
${tomTat('en', [
  'Practise the full round under time: easy problem, medium problem, review.',
  'Clarify, state the brute force, agree the plan, then code and hand-test.',
  '"Fewest moves on a grid" means BFS with distances; mark cells when you add them.',
  'Score from the recording, then repeat with new problems of the same patterns.',
  'Never install tools that promise to answer interviews for you.',
])}
${lienQuan('en', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bfs', academy: true, L: 'en', title: 'Academy · CSD201 5.4 — BFS and shortest paths in unweighted graphs', sub: 'The theory behind problem B.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-ham-bam', academy: true, L: 'en', title: 'Academy · CSD201 7.2 — Hash functions and the hashCode/equals contract', sub: 'What happens inside the Map of problem A.' }),
  yt('1qw5ITr3k9E', 'freeCodeCamp.org', 'Software Engineering Job Interview – Full Mock Interview', 74, 'en'),
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab</span>
<h2>Lab — vòng coding thử có giờ</h2>
<p class="lead">Lab này là một vòng coding trọn 50 phút. Hai bài: một dễ (20 phút) và một trung bình (30 phút), đúng tỉ lệ nhiều bài test thực tập hay dùng. Làm với một người đóng vai phỏng vấn, hoặc một mình với đồng hồ và camera. Dùng sáu bước ở bài 7.1 và các câu nói ở bài 7.2. Rồi tự chấm trung thực bằng phiếu và so với lời giải tham khảo — được giấu cho tới khi bạn đã thử.</p>

<h3>Tình huống</h3>
<p>Một công ty mời bạn vào cuộc gọi kỹ thuật một tiếng. Kỹ sư nói: "Mình làm hai bài ngắn nhé. Em dùng ngôn ngữ nào cũng được. Vừa làm vừa nói cho anh nghe em đang nghĩ gì." Bạn chọn ngôn ngữ mạnh nhất — JavaScript hoặc Java.</p>
${flow([
  ['0–2 phút', 'chuẩn bị', 'Mở một tệp trống hoặc trình soạn thảo chung; không dùng AI gợi ý code. Bấm đồng hồ.'],
  ['2–22 phút', 'bài A', 'Nhắc lại đề, ví dụ, vét cạn, kế hoạch, code, dò tay, độ phức tạp.'],
  ['22–52 phút', 'bài B', 'Cùng các bước; bài này cần một mẫu bạn phải nhận ra.'],
  ['52–60 phút', 'xem lại', 'Chạy thật các ví dụ đã cho, rồi chấm bằng phiếu.'],
])}
${ra(DE_LAB_VI)}

<h3>Cho người đóng vai phỏng vấn</h3>
<ol>
<li>Đọc to bài A. Trả lời câu hỏi làm rõ: ký tự là chữ thường; chuỗi có thể rỗng.</li>
<li>Nếu ứng viên code im lặng quá hai phút, hỏi "Em đang nghĩ gì?".</li>
<li>Bài B: nếu sau tám phút chưa có hướng, đưa gợi ý 1; sau mười lăm phút, gợi ý 2.</li>
<li>Sau mỗi bài: "Độ phức tạp thời gian và bộ nhớ là bao nhiêu?" và "Em sẽ thêm test nào?"</li>
</ol>
<details><summary>Gợi ý A</summary><p>Bạn cần biết, với mỗi ký tự, nó xuất hiện bao nhiêu lần trong CẢ chuỗi — trước khi quyết định cho bất kỳ vị trí nào. Hai lượt duyệt là ổn.</p></details>
<details><summary>Gợi ý B1</summary><p>"Số bước ít nhất" trên một lưới mà bước nào cũng tốn như nhau là bài đường đi ngắn nhất trên đồ thị không trọng số. Cách duyệt nào đi theo từng lớp khoảng cách?</p></details>
<details><summary>Gợi ý B2</summary><p>Tìm kiếm theo chiều rộng (BFS) từ S, ghi khoảng cách của mỗi ô ngay lúc thêm nó vào hàng đợi; bỏ qua tường và ô đã thăm. Lần đầu tiên lấy E ra khỏi hàng đợi, khoảng cách của nó là đáp án.</p></details>
<details><summary>Lời giải tham khảo A (JavaScript + Java)</summary>
${ma('js', JS_A)}${ma('java', JAVA_A)}
<p>Lỗi hay gặp: trả về ký tự thay vì chỉ số; một vòng lặp lồng đếm lại cho từng vị trí (O(n²) — chấp nhận được như lời giải vét cạn nếu bạn nói rõ); quên chuỗi rỗng.</p>
</details>
<details><summary>Lời giải tham khảo B (JavaScript + Java)</summary>
${ma('js', JS_B)}${ma('java', JAVA_B)}
<p>Lỗi hay gặp: dùng DFS, tìm được <em>một</em> đường nhưng không phải đường ngắn nhất; đánh dấu đã thăm lúc lấy ô ra khỏi hàng đợi thay vì lúc thêm vào (ô bị thêm nhiều lần); không xử lý "không có S" hoặc "không tới được E"; dùng <code>queue.shift()</code> trong JavaScript trên lưới lớn.</p>
</details>

<h3>Phiếu chấm (thang 20)</h3>
${rubric('vi', [
  ['Nhắc lại đề + hỏi làm rõ', 'Bắt tay code ngay', 'Chỉ nhắc lại', 'Nhắc lại và hỏi về đầu vào rỗng, loại ký tự, lối ra không tới được'],
  ['Ví dụ trước', 'Không có', 'Chỉ dùng ví dụ đã cho', 'Thêm một trường hợp biên của riêng mình trước khi code'],
  ['Nêu lời giải vét cạn', 'Không', 'Ngầm hiểu', 'Nói ra kèm độ phức tạp'],
  ['Tìm ra mẫu (bài B)', 'Không có hướng', 'DFS / đúng một phần', 'BFS có khoảng cách, giải thích được vì sao'],
  ['Thống nhất kế hoạch', 'Không', 'Có nhắc', 'Hỏi "hướng này ổn chưa ạ?" trước khi gõ'],
  ['Code đúng', 'Không chạy', 'Chạy, sai một ví dụ', 'Qua mọi ví dụ đã cho'],
  ['Code rõ ràng', 'Tên một chữ cái, một khối dài', 'Phần lớn rõ', 'Tên rõ, từng bước nhỏ'],
  ['Dò tay', 'Không có', 'Một phần', 'Dò một ví dụ và một trường hợp biên'],
  ['Độ phức tạp', 'Không nêu', 'Chỉ thời gian', 'Cả thời gian lẫn bộ nhớ, đúng'],
  ['Giao tiếp', 'Im lặng lâu', 'Có thuật lại một phần', 'Thuật lại quyết định, có câu kiểm tra, bình tĩnh'],
])}
<p>Đọc tổng điểm thô: 16–20 là sẵn sàng cho phần lớn vòng coding thực tập; 11–15 nghĩa là luyện các bước hơn là luyện bài mới; dưới 11 nghĩa là làm lại tám mẫu ở bài 7.1 từ tệp trắng trước đã.</p>
${bay('vi', 'mở lời giải sau hai phút bị bí.', 'Vật lộn mười, mười lăm phút mới là lúc học — và là lúc bạn tập những câu nói khi bí. Chỉ mở gợi ý đúng các mốc thời gian đã ghi, và chỉ mở lời giải khi đồng hồ đã hết.')}
${keXau('vi', 'các trang luyện tập và trang "rò rỉ câu hỏi phỏng vấn" đôi khi bị dùng để phát tán tiện ích trình duyệt độc hại hoặc chương trình "trợ giúp trả lời". Hãy luyện trên nền tảng nổi tiếng, không bao giờ cài công cụ hứa trả lời phỏng vấn trực tiếp hộ bạn, và không bao giờ nhập tài khoản thật của công ty hay trường vào một trang hứa cho "đề thật".')}
${neu('vi', 'bạn giải bài A trong năm phút? Dùng thời gian dư cho tốt: bàn thành tiếng một câu mở rộng — "nếu chuỗi là một dòng chảy (stream) và em không lưu hết được thì sao?" (giữ bộ đếm cộng một hàng đợi các ứng viên) — thay vì ngồi không.')}
${thucHanh('vi', { phut: '60', steps: [
  'Chạy đủ vòng 50 phút với đồng hồ, tự ghi hình.',
  'Chạy các ví dụ trong môi trường thật và sửa mọi chỗ sai.',
  'Tự chấm bằng phiếu dựa trên bản ghi, không dựa trên trí nhớ.',
  'Trong vòng một tuần, làm lại với hai bài khác cùng mẫu (đếm bằng hash map; BFS trên lưới) và so điểm.',
], dat: 'hai vòng có ghi hình kèm phiếu chấm, và cả hai bài đều qua mọi ví dụ đã cho.' })}
${thuatNgu('vi', [
  ['Unweighted shortest path (đường ngắn nhất không trọng số)', 'Số bước ít nhất khi bước nào cũng tốn như nhau — giải bằng BFS.'],
  ['Visited set / distance grid (tập đã thăm / lưới khoảng cách)', 'Ghi lại các ô đã tới, để không ô nào bị xử lý hai lần.'],
  ['Two-pass solution (lời giải hai lượt)', 'Lượt đầu gom thông tin trên toàn bộ đầu vào, lượt sau dùng nó.'],
  ['Timed round (vòng có giờ)', 'Vòng coding có giới hạn thời gian chặt cho mỗi bài.'],
  ['Stream (dòng dữ liệu)', 'Đầu vào tới từng mẩu và không lưu được toàn bộ.'],
])}
${tomTat('vi', [
  'Tập trọn vòng có giờ: bài dễ, bài trung bình, xem lại.',
  'Hỏi làm rõ, nêu vét cạn, thống nhất kế hoạch, rồi code và dò tay.',
  '"Số bước ít nhất trên lưới" nghĩa là BFS có khoảng cách; đánh dấu ô lúc thêm vào hàng đợi.',
  'Chấm theo bản ghi, rồi làm lại với bài mới cùng mẫu.',
  'Không bao giờ cài công cụ hứa trả lời phỏng vấn hộ bạn.',
])}
${lienQuan('vi', [
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-bfs', academy: true, title: 'Academy · CSD201 5.4 — BFS và đường đi ngắn nhất trên đồ thị không trọng số', sub: 'Lý thuyết đứng sau bài B.' }),
  lienKet({ khoa: 'data-structures-and-algorithms', bai: 'csd201-ham-bam', academy: true, title: 'Academy · CSD201 7.2 — Hàm băm và hợp đồng hashCode/equals', sub: 'Chuyện gì xảy ra bên trong cái Map của bài A.' }),
  yt('1qw5ITr3k9E', 'freeCodeCamp.org', 'Software Engineering Job Interview – Full Mock Interview', 74),
])}
</div>
`,
};

/* ═══════════════════════ 7.6 — Quiz ═══════════════════════ */
const Q76 = {
  title: '7.6 — Chapter 7 check|||7.6 — Kiểm tra Chương 7',
  slug: 'pv-7-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về khung giải bài coding, Big-O, các mẫu bài, code trực tiếp, system design cho junior và bài làm ở nhà — mỗi câu có giải thích vì sao đúng và vì sao phương án hấp dẫn nhất sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check — coding and system design</h2>
<p class="lead">Ten situations. Some are about algorithms; most are about behaviour in the round, because that is where interns lose points.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can use the six steps out loud on a new problem.</li>
<li>I can recognise the eight patterns and state time and space complexity.</li>
<li>I know what to say when I am stuck, when I get a hint and when time runs out.</li>
<li>I can explain my own project’s architecture and its single point of failure.</li>
<li>I can scope a take-home and run a stranger’s repository safely.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7 — coding và system design</h2>
<p class="lead">Mười tình huống. Vài câu về thuật toán; phần lớn về cách cư xử trong vòng thi, vì đó là chỗ thực tập sinh mất điểm.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dùng được sáu bước thành tiếng trên một bài mới.</li>
<li>Tôi nhận ra được tám mẫu và nêu được độ phức tạp thời gian và bộ nhớ.</li>
<li>Tôi biết nói gì khi bí, khi được gợi ý và khi hết giờ.</li>
<li>Tôi giải thích được kiến trúc dự án của mình và điểm hỏng duy nhất của nó.</li>
<li>Tôi khoanh được phạm vi một bài làm ở nhà và chạy kho mã của người lạ một cách an toàn.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      cau('An online test says n can be up to 200,000. Your first idea compares every pair. What should you do?|||Một bài test online ghi n có thể tới 200.000. Ý đầu tiên của bạn là so mọi cặp. Bạn nên làm gì?', [
        'Submit it — the test data is usually small|||Nộp luôn — dữ liệu test thường nhỏ',
        'Recognise O(n²) is about 4×10¹⁰ steps and look for an O(n) or O(n log n) pattern such as a hash map or sorting|||Nhận ra O(n²) là khoảng 4×10¹⁰ bước và tìm một mẫu O(n) hoặc O(n log n) như hash map hay sắp xếp',
        'Rewrite the same loops in a faster language|||Viết lại đúng hai vòng lặp đó bằng ngôn ngữ nhanh hơn',
        'Add memoisation to the inner loop|||Thêm ghi nhớ (memoisation) cho vòng lặp trong',
      ], 1, 'EN: At n = 2×10⁵ a quadratic solution will time out regardless of language; the fix is a better pattern. Switching language is the tempting answer but only changes the constant factor. Memoisation does not help when there are no repeated subproblems.|||VI: Với n = 2×10⁵ lời giải bình phương sẽ quá giờ bất kể ngôn ngữ; cách sửa là một mẫu tốt hơn. Đổi ngôn ngữ là đáp án hấp dẫn nhưng chỉ đổi hằng số. Ghi nhớ không giúp khi không có bài toán con lặp lại.'),
      cau('You must find the fewest moves from start to exit in a grid maze where each move costs the same. Which approach is correct?|||Bạn phải tìm số bước ít nhất từ cửa vào tới cửa ra trong một mê cung dạng lưới, mỗi bước tốn như nhau. Cách nào đúng?', [
        'Depth-first search, stopping at the first path found|||Tìm theo chiều sâu, dừng ở đường đầu tiên tìm được',
        'Sort the cells by distance to the exit|||Sắp xếp các ô theo khoảng cách tới cửa ra',
        'Dynamic programming over rows from top to bottom|||Quy hoạch động theo hàng từ trên xuống',
        'Breadth-first search from the start, recording distances|||Tìm theo chiều rộng từ cửa vào, ghi lại khoảng cách',
      ], 3, 'EN: BFS explores in layers of distance, so the first time it reaches the exit is the shortest. DFS is tempting because it is easy to write, but the first path it finds can be long. Row-by-row DP fails when the path must go back up.|||VI: BFS duyệt theo từng lớp khoảng cách, nên lần đầu tới được cửa ra là đường ngắn nhất. DFS hấp dẫn vì dễ viết, nhưng đường đầu tiên nó tìm có thể rất dài. Quy hoạch động theo hàng hỏng khi đường đi phải vòng ngược lên.'),
      cau('In a live round you have coded silently for four minutes and you are unsure about your approach. What is best?|||Trong vòng code trực tiếp bạn đã gõ im lặng bốn phút và không chắc hướng làm. Cách tốt nhất là gì?', [
        'Pause, explain your current approach and your doubt, and ask if it sounds reasonable|||Dừng lại, giải thích hướng hiện tại và chỗ bạn còn băn khoăn, rồi hỏi hướng đó có hợp lý không',
        'Keep typing so the interviewer sees progress|||Cứ tiếp tục gõ để người phỏng vấn thấy có tiến triển',
        'Delete everything and start a different idea without saying why|||Xoá hết và chuyển sang ý khác mà không nói vì sao',
        'Ask the interviewer for the solution|||Xin người phỏng vấn lời giải',
      ], 0, 'EN: What you say is the evidence; a check-in turns silent struggle into visible reasoning and invites a useful hint. Typing to look busy gives the interviewer nothing to score and may go further in the wrong direction.|||VI: Những gì bạn nói là bằng chứng; một câu kiểm tra biến sự vật lộn im lặng thành suy luận nhìn thấy được và mở đường cho một gợi ý hữu ích. Gõ cho có vẻ bận không cho người phỏng vấn gì để chấm, và có thể đi xa hơn theo hướng sai.'),
      cau('While hand-testing you find that your function fails on an empty array. What do you do?|||Trong lúc dò tay bạn thấy hàm của mình hỏng với mảng rỗng. Bạn làm gì?', [
        'Say nothing; the interviewer probably did not notice|||Không nói gì; chắc người phỏng vấn không để ý',
        'Apologise and say you are not good under pressure|||Xin lỗi và nói mình không giỏi khi bị áp lực',
        'Say you found a bug, fix it, and re-run the same test|||Nói là mình vừa thấy một lỗi, sửa nó, và chạy lại đúng test đó',
        'Say empty arrays are out of scope|||Nói mảng rỗng nằm ngoài phạm vi',
      ], 2, 'EN: Finding and fixing your own bug is exactly the verification signal interviewers score. Declaring the case out of scope is tempting but you should have asked earlier; now it reads as avoidance.|||VI: Tự tìm và sửa lỗi của mình chính là tín hiệu kiểm chứng mà người phỏng vấn chấm. Tuyên bố trường hợp đó nằm ngoài phạm vi nghe hấp dẫn, nhưng lẽ ra phải hỏi từ đầu; giờ nói vậy bị đọc là né tránh.'),
      cau('Coins are [1, 3, 4] and the amount is 6. A candidate always takes the largest coin first. What should a strong candidate notice?|||Mệnh giá là [1, 3, 4] và số tiền là 6. Một ứng viên luôn lấy đồng lớn nhất trước. Một ứng viên giỏi phải nhận ra điều gì?', [
        'Greedy is always optimal for coins|||Tham lam luôn tối ưu với bài đồng xu',
        'The answer is 3 coins, so greedy works here|||Đáp án là 3 đồng, nên tham lam đúng ở đây',
        'Sorting the coins descending fixes greedy|||Sắp xếp mệnh giá giảm dần là sửa được tham lam',
        'Greedy gives 4+1+1 (3 coins) but 3+3 uses 2, so this needs dynamic programming|||Tham lam cho 4+1+1 (3 đồng) nhưng 3+3 chỉ cần 2, nên bài này cần quy hoạch động',
      ], 3, 'EN: A single counter-example shows greedy is wrong for arbitrary coin sets; dp[x] = 1 + min dp[x − c] is correct. "Greedy always works" is true for some currencies, which is why it is tempting.|||VI: Chỉ một phản ví dụ là đủ cho thấy tham lam sai với bộ mệnh giá tuỳ ý; dp[x] = 1 + min dp[x − c] mới đúng. "Tham lam luôn đúng" đúng với một số hệ tiền tệ, vì vậy nó hấp dẫn.'),
      cau('An interviewer asks an intern: "Walk me through the architecture of your project." Which answer is strongest?|||Người phỏng vấn hỏi một thực tập sinh: "Dẫn anh đi qua kiến trúc dự án của em." Câu trả lời nào mạnh nhất?', [
        'A list of every technology used, from React to Docker|||Liệt kê mọi công nghệ đã dùng, từ React tới Docker',
        'Following one request from the browser through CDN, proxy, app and database, with one decision and one weakness|||Đi theo một request từ trình duyệt qua CDN, proxy, ứng dụng và CSDL, kèm một quyết định và một điểm yếu',
        'Saying it uses microservices so it can scale to millions|||Nói nó dùng microservices nên mở rộng được tới hàng triệu người',
        'Showing the GitHub repository and letting them read it|||Mở kho GitHub và để họ tự đọc',
      ], 1, 'EN: A request path shows understanding of how the parts connect; a decision and a weakness show judgement and honesty. A technology list is tempting but says nothing about how the system works.|||VI: Đường đi của một request cho thấy bạn hiểu các phần nối với nhau thế nào; một quyết định và một điểm yếu cho thấy óc phán đoán và sự trung thực. Liệt kê công nghệ hấp dẫn nhưng không nói gì về cách hệ thống chạy.'),
      cau('Users must upload videos up to 2 GB. Which design is best?|||Người dùng phải tải lên video tới 2 GB. Thiết kế nào tốt nhất?', [
        'The browser uploads directly to object storage with a presigned URL; a worker processes it from a queue; a CDN serves it|||Trình duyệt tải thẳng lên object storage bằng URL ký sẵn; một worker xử lý từ hàng đợi; CDN phục vụ',
        'Send the file to the API, save it on the server disk, then copy it to storage|||Gửi tệp lên API, lưu xuống đĩa máy chủ, rồi chép sang kho lưu trữ',
        'Store the video as a binary column in PostgreSQL|||Lưu video thành cột nhị phân trong PostgreSQL',
        'Split the video into many small API requests to the app server|||Cắt video thành nhiều request nhỏ gửi tới máy chủ ứng dụng',
      ], 0, 'EN: Direct upload keeps large bytes off the app server and survives restarts; processing in a worker keeps requests fast. Routing through the API disk is the common tutorial approach — and the one that fills disks and memory in production.|||VI: Tải thẳng giữ những byte lớn khỏi máy chủ ứng dụng và sống sót qua khởi động lại; xử lý trong worker giữ request nhanh. Đi qua đĩa của API là cách hay gặp trong tutorial — và là cách làm đầy đĩa, đầy bộ nhớ trên production.'),
      cau('Your booking API checks "is the slot free?" and then inserts. Under load, two users sometimes get the same slot. What is the robust fix?|||API đặt lịch của bạn kiểm "khung giờ còn trống không?" rồi mới chèn. Khi tải cao, thỉnh thoảng hai người cùng nhận một khung giờ. Cách sửa vững chắc là gì?', [
        'Add a one-second sleep between the check and the insert|||Thêm một giây chờ giữa bước kiểm và bước chèn',
        'Check twice before inserting|||Kiểm hai lần trước khi chèn',
        'Enforce it in the database (unique or exclusion constraint, or a locking transaction) and return 409 on conflict|||Bảo đảm ở CSDL (ràng buộc unique hoặc exclusion, hoặc giao dịch có khoá) và trả 409 khi đụng',
        'Show the user a warning to refresh before booking|||Hiện cảnh báo nhắc người dùng tải lại trước khi đặt',
      ], 2, 'EN: The race exists between the check and the insert; only the database can make it atomic. Checking twice is tempting but the gap remains, just smaller.|||VI: Cuộc đua nằm giữa bước kiểm và bước chèn; chỉ CSDL mới làm nó thành nguyên tử được. Kiểm hai lần nghe hấp dẫn nhưng khe hở vẫn còn, chỉ nhỏ hơn.'),
      cau('A "recruiter" sends a take-home repository and asks you to run npm install and npm start before any call. What is the safest first step?|||Một "recruiter" gửi kho mã bài làm ở nhà và bảo bạn chạy npm install, npm start trước mọi cuộc gọi. Bước đầu an toàn nhất là gì?', [
        'Run it on your laptop but close your browser first|||Chạy trên laptop nhưng đóng trình duyệt trước',
        'Run it with administrator rights so it installs correctly|||Chạy với quyền quản trị để cài cho đúng',
        'Ask a friend to run it on their laptop|||Nhờ một người bạn chạy trên laptop của họ',
        'Read package.json scripts and the code first, verify the company, and run it only in an isolated container or VM|||Đọc scripts trong package.json và code trước, xác minh công ty, và chỉ chạy trong container hoặc máy ảo cô lập',
      ], 3, 'EN: Install scripts run automatically and can steal saved passwords and wallets, which is how the Contagious Interview campaign works. Closing the browser does not protect stored credentials; a friend’s laptop just moves the risk.|||VI: Script cài đặt tự chạy và có thể lấy cắp mật khẩu đã lưu và ví tiền, đúng cách chiến dịch Contagious Interview hoạt động. Đóng trình duyệt không bảo vệ được mật khẩu đã lưu; laptop của bạn bè chỉ chuyển rủi ro sang người khác.'),
      cau('A take-home brief suggests "about 4 hours". What is the best plan?|||Đề bài làm ở nhà gợi ý "khoảng 4 giờ". Kế hoạch tốt nhất là gì?', [
        'Spend two weeks to be sure it is perfect|||Dành hai tuần cho chắc nó hoàn hảo',
        'Skip tests to save time and add more features|||Bỏ test cho đỡ tốn thời gian và thêm nhiều tính năng',
        'Spend about 4–6 hours on the must-haves, tests and README, list what you left out, and report your real time|||Dành khoảng 4–6 giờ cho phần bắt buộc, test và README, liệt kê phần đã bỏ, và báo thời gian thật',
        'Copy a similar project from GitHub and rename it|||Chép một dự án tương tự trên GitHub rồi đổi tên',
      ], 2, 'EN: Reviewers compare submissions made in similar time; scope, tests and an honest README are what they check. Two weeks of gold-plating signals poor scoping, and skipping tests removes the part reviewers value most.|||VI: Người review so các bài làm trong khoảng thời gian tương tự; phạm vi, test và README trung thực là thứ họ kiểm. Hai tuần mạ vàng báo hiệu không biết khoanh phạm vi, còn bỏ test là bỏ đúng phần người review coi trọng nhất.'),
    ],
  },
};

export default {
  title: 'Chapter 7 — Coding and system design rounds|||Chương 7 — Vòng coding và system design',
  description: 'Khung sáu bước và Big-O, tám mẫu bài coding có lời giải JavaScript + Java, code trực tiếp và lập trình cặp, system design cho junior (bốn bước, khối xây dựng, rút gọn link, vẽ lại dự án thật), dự án làm ở nhà an toàn và trung thực, vòng coding thử có giờ và quiz.',
  lessons: [L71, L72, L73, L74, L75, Q76],
};
