// Lộ trình 6 tuần (B) và 4 tuần (A) — DỮ LIỆU + phép tính lịch ôn cách quãng chạy THẬT (bài 11.1 dựng bảng từ đây).
// Mỗi ngày: loai = 'hoc' (học bài + 2 đề mới) | 'on' (ôn tuần) | 'thu' (phỏng vấn thử) | 'nop' (ôn + nộp hồ sơ).
// Đề đầu tiên của mỗi ngày học là "đề neo": nó đi vào thang ôn 1 · 3 · 7 · 14 ngày. Ngày bắt đầu: thứ Hai 16/11/2026.
export const NGAY_DAU = '2026-11-16';
export const KHOANG = [1, 3, 7, 14];

const E = 'Easy', M = 'Medium', H = 'Hard';
const D = {
  217: [217, 'contains-duplicate', 'Contains Duplicate', E],
  1480: [1480, 'running-sum-of-1d-array', 'Running Sum of 1d Array', E],
  1: [1, 'two-sum', 'Two Sum', E],
  242: [242, 'valid-anagram', 'Valid Anagram', E],
  303: [303, 'range-sum-query-immutable', 'Range Sum Query - Immutable', E],
  560: [560, 'subarray-sum-equals-k', 'Subarray Sum Equals K', M],
  347: [347, 'top-k-frequent-elements', 'Top K Frequent Elements', M],
  56: [56, 'merge-intervals', 'Merge Intervals', M],
  136: [136, 'single-number', 'Single Number', E],
  49: [49, 'group-anagrams', 'Group Anagrams', M],
  167: [167, 'two-sum-ii-input-array-is-sorted', 'Two Sum II - Input Array Is Sorted', M],
  15: [15, '3sum', '3Sum', M],
  3: [3, 'longest-substring-without-repeating-characters', 'Longest Substring Without Repeating Characters', M],
  567: [567, 'permutation-in-string', 'Permutation in String', M],
  141: [141, 'linked-list-cycle', 'Linked List Cycle', E],
  11: [11, 'container-with-most-water', 'Container With Most Water', M],
  20: [20, 'valid-parentheses', 'Valid Parentheses', E],
  739: [739, 'daily-temperatures', 'Daily Temperatures', M],
  232: [232, 'implement-queue-using-stacks', 'Implement Queue using Stacks', E],
  239: [239, 'sliding-window-maximum', 'Sliding Window Maximum', H],
  206: [206, 'reverse-linked-list', 'Reverse Linked List', E],
  146: [146, 'lru-cache', 'LRU Cache', M],
  155: [155, 'min-stack', 'Min Stack', M],
  394: [394, 'decode-string', 'Decode String', M],
  704: [704, 'binary-search', 'Binary Search', E],
  34: [34, 'find-first-and-last-position-of-element-in-sorted-array', 'Find First and Last Position of Element in Sorted Array', M],
  33: [33, 'search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', M],
  153: [153, 'find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', M],
  875: [875, 'koko-eating-bananas', 'Koko Eating Bananas', M],
  1011: [1011, 'capacity-to-ship-packages-within-d-days', 'Capacity To Ship Packages Within D Days', M],
  102: [102, 'binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', M],
  199: [199, 'binary-tree-right-side-view', 'Binary Tree Right Side View', M],
  104: [104, 'maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', E],
  543: [543, 'diameter-of-binary-tree', 'Diameter of Binary Tree', E],
  98: [98, 'validate-binary-search-tree', 'Validate Binary Search Tree', M],
  208: [208, 'implement-trie-prefix-tree', 'Implement Trie (Prefix Tree)', M],
  215: [215, 'kth-largest-element-in-an-array', 'Kth Largest Element in an Array', M],
  973: [973, 'k-closest-points-to-origin', 'K Closest Points to Origin', M],
  295: [295, 'find-median-from-data-stream', 'Find Median from Data Stream', H],
  703: [703, 'kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', E],
  57: [57, 'insert-interval', 'Insert Interval', M],
  435: [435, 'non-overlapping-intervals', 'Non-overlapping Intervals', M],
  547: [547, 'number-of-provinces', 'Number of Provinces', M],
  997: [997, 'find-the-town-judge', 'Find the Town Judge', E],
  200: [200, 'number-of-islands', 'Number of Islands', M],
  994: [994, 'rotting-oranges', 'Rotting Oranges', M],
  207: [207, 'course-schedule', 'Course Schedule', M],
  210: [210, 'course-schedule-ii', 'Course Schedule II', M],
  238: [238, 'product-of-array-except-self', 'Product of Array Except Self', M],
  228: [228, 'summary-ranges', 'Summary Ranges', E],
  54: [54, 'spiral-matrix', 'Spiral Matrix', M],
  35: [35, 'search-insert-position', 'Search Insert Position', E],
  1010: [1010, 'pairs-of-songs-with-total-durations-divisible-by-60', 'Pairs of Songs With Total Durations Divisible by 60', M],
  1094: [1094, 'car-pooling', 'Car Pooling', M],
  743: [743, 'network-delay-time', 'Network Delay Time', M],
  684: [684, 'redundant-connection', 'Redundant Connection', M],
  78: [78, 'subsets', 'Subsets', M],
  46: [46, 'permutations', 'Permutations', M],
  39: [39, 'combination-sum', 'Combination Sum', M],
  79: [79, 'word-search', 'Word Search', M],
  70: [70, 'climbing-stairs', 'Climbing Stairs', E],
  198: [198, 'house-robber', 'House Robber', M],
  1143: [1143, 'longest-common-subsequence', 'Longest Common Subsequence', M],
  322: [322, 'coin-change', 'Coin Change', M],
  55: [55, 'jump-game', 'Jump Game', M],
  72: [72, 'edit-distance', 'Edit Distance', M],
  139: [139, 'word-break', 'Word Break', M],
  290: [290, 'word-pattern', 'Word Pattern', E],
};
const de = (...ids) => ids.map((i) => D[i]);
const hoc = (bai, ...ids) => ({ loai: 'hoc', bai, de: de(...ids) });

// slug ngắn: '1-2' ⇒ 'dsa-1-2-…' do bài 11.1 tra trong danh sách thật của khoá.
export const B = [
  /* T1 */ hoc(['0-8', '0-9', '0-1'], 217, 1480), hoc(['0-2', '1-1'], 1, 242), hoc(['1-2'], 303, 560), hoc(['1-3'], 347, 56),
  hoc(['1-5', '1-4'], 136, 49), hoc(['2-1'], 167, 15), { loai: 'on', bai: ['0-3', '1-6'], moc: 1 },
  /* T2 */ hoc(['2-2'], 3, 567), hoc(['2-3', '2-4'], 141, 11), hoc(['3-1'], 20, 739), hoc(['3-2'], 232, 239),
  hoc(['3-3'], 206, 146), hoc(['3-4'], 155, 394), { loai: 'on', bai: ['2-5', '3-5'], moc: 2 },
  /* T3 */ hoc(['4-1'], 704, 34), hoc(['4-2'], 33, 153), hoc(['4-3', '4-4'], 875, 1011), hoc(['5-1'], 102, 199),
  hoc(['5-2'], 104, 543), hoc(['5-3', '5-5'], 98, 208), { loai: 'on', bai: ['4-5', '5-6', '5-4'], moc: 3, thuNho: true },
  /* T4 */ { ...hoc(['6-1'], 215, 973), cv: 1 }, { ...hoc(['6-2'], 295, 703), cv: 2 }, { ...hoc(['6-3', '6-4'], 57, 435), cv: 3 },
  { ...hoc(['7-1'], 547, 997), cv: 4 }, { ...hoc(['7-2'], 200, 994), cv: 5 }, { ...hoc(['7-3'], 207, 210), cv: 6 },
  { loai: 'nop', bai: [], moc: 4 },
  /* T5 */ hoc(['10-1'], 238, 228), hoc(['10-2', '10-3'], 54, 35), hoc(['10-4'], 1010, 1094), { loai: 'thu', bai: ['11-2'] },
  hoc(['7-4'], 743, 684), hoc(['8-1'], 78, 46), { loai: 'on', bai: [], moc: 5 },
  /* T6 */ hoc(['8-2', '8-3'], 39, 79), hoc(['9-1', '9-2'], 70, 198), { loai: 'thu', bai: ['11-3'] },
  hoc(['9-3', '9-4'], 1143, 322), hoc(['9-5', '9-6'], 55, 72), { loai: 'thu', bai: ['11-5'] },
  { loai: 'on', bai: ['11-4', '11-6'], moc: 6 },
];

export const A = [
  /* T1 */ hoc(['0-8', '0-9', '0-1', '0-2'], 217, 1480), hoc(['1-1'], 1, 242), hoc(['1-2'], 303, 560), hoc(['1-3'], 347, 56),
  hoc(['2-1'], 167, 15), hoc(['2-2', '2-3'], 3, 141), { loai: 'on', bai: ['0-3', '1-6', '2-5'], moc: 1 },
  /* T2 */ hoc(['3-1'], 20, 739), hoc(['3-2', '3-3'], 206, 146), hoc(['4-1'], 704, 34), hoc(['4-2', '4-3'], 33, 875),
  hoc(['5-1'], 102, 199), hoc(['5-2', '5-3'], 104, 98), { loai: 'on', bai: ['3-5', '4-5'], moc: 2, thuNho: true },
  /* T3 */ hoc(['6-1'], 215, 973), hoc(['6-3'], 57, 435), hoc(['7-1', '7-2'], 200, 997), hoc(['7-3'], 207, 994),
  hoc(['9-1'], 70, 198), hoc(['9-2'], 322, 139), { loai: 'on', bai: ['5-6'], moc: 3 },
  /* T4 */ { ...hoc(['10-1', '10-3'], 238, 35), cv: 1 }, { loai: 'thu', bai: ['11-2'], cv: 2 }, { ...hoc(['10-4'], 1010, 1094), cv: 3 },
  { loai: 'thu', bai: ['11-3'], cv: 4 }, { loai: 'on', bai: [], cv: 5 }, { ...hoc(['10-2'], 54, 228), cv: 6 },
  { loai: 'nop', bai: [], moc: 4 },
];

export const DE_KHOI_DONG = D[290];   // đề phỏng vấn thử nhỏ 20′ cuối tuần 3 (bài 11.2 › đề dự phòng)

function ngayLich(i) {
  const d = new Date(NGAY_DAU + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + i);
  return d;
}

/** Chạy thang ôn: đề neo của ngày d được ôn ở ngày d + 1, d + 3, d + 7, d + 14 (trong phạm vi lộ trình). */
export function tinhLich(ke) {
  const on = ke.map(() => []);
  ke.forEach((n, i) => {
    if (n.loai !== 'hoc') return;
    for (const k of KHOANG) if (i + k < ke.length) on[i + k].push({ de: n.de[0], k });
  });
  return ke.map((n, i) => {
    const d = ngayLich(i);
    return { ...n, so: i + 1, ngay: `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`, thu: d.getUTCDay(), on: on[i] };
  });
}

/** Thống kê tải ôn: số đề ôn nhiều nhất trong một ngày, tổng số lượt ôn, số đề mới. */
export function thongKe(ke) {
  const l = tinhLich(ke);
  return {
    toiDa: Math.max(...l.map((n) => n.on.length)),
    tongOn: l.reduce((s, n) => s + n.on.length, 0),
    deMoi: l.reduce((s, n) => s + (n.de ? n.de.length : 0), 0),
    ngayHoc: l.filter((n) => n.loai === 'hoc').length,
  };
}
