/**
 * Luyện phỏng vấn thuật toán — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn
 * sau. Bổ trợ môn CSD201 (DSA) ở Academy: khoá này thiên về MẪU BÀI + cách trình bày khi phỏng vấn. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'languages', name: 'Ngôn ngữ lập trình', icon: 'Code2', sortOrder: 0 },
  course: {
    slug: 'dsa-interview',
    title: 'Coding Interview Prep',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/dsa-interview.png?v=1',
    shortDescription: 'Pass the coding round: the patterns behind most interview problems (two pointers, sliding window, hashing, BFS/DFS, binary search, heaps, DP), how to talk through a solution, and a 6-week practice plan.|||Qua vòng coding: những mẫu bài đứng sau phần lớn đề phỏng vấn (hai con trỏ, cửa sổ trượt, băm, BFS/DFS, tìm kiếm nhị phân, heap, quy hoạch động), cách nói ra lời giải, và lộ trình luyện 6 tuần.',
    description: 'Khoá luyện phỏng vấn thuật toán theo MẪU BÀI, không học thuộc đề. Mỗi chương: một mẫu, khi nào nhận ra nó, khung code bằng TypeScript/JavaScript (và Java cho người học FPT), độ phức tạp, 6–10 đề luyện từ dễ tới khó với lời giải giải thích từng bước, và cách trình bày trước người phỏng vấn. Kết thúc bằng lộ trình 6 tuần, phỏng vấn thử và cách xử lý khi bí.',
    whatYouLearn: 'Nhận ra mẫu bài trong vài phút; phân tích Big-O chắc tay; viết lời giải sạch dưới áp lực thời gian; nói to suy nghĩ theo khung rõ ràng; test lời giải bằng ví dụ biên; và có lộ trình luyện đều đặn.',
    requirements: 'Biết một ngôn ngữ lập trình (JavaScript/TypeScript hoặc Java) và cấu trúc dữ liệu cơ bản (mảng, danh sách, cây) — môn CSD201 ở Academy là nền tốt.',
    documentsNote: 'Tài liệu chính: leetcode.com • neetcode.io • "Cracking the Coding Interview" (Gayle Laakmann McDowell) • visualgo.net • bigocheatsheet.com.',
  },
  sections: khung('dsa', [
    ['Section 0 — How coding interviews work', 'Mục 0 — Vòng phỏng vấn coding diễn ra thế nào', 'Luật chơi và cách luyện không nản.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What the coding round tests, and why companies still use it', 'Bắt đầu tại đây (1/2) — Vòng coding kiểm tra gì, và vì sao công ty vẫn dùng', 'Các dạng vòng: online test, live coding, take-home · Người phỏng vấn chấm gì · Lịch sử và tranh cãi quanh LeetCode'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Why people fail it, and a practice plan that sticks', 'Bắt đầu tại đây (2/2) — Vì sao người ta trượt, và lộ trình luyện bền', 'Học thuộc đề · Im lặng khi code · Lộ trình 6 tuần · Cách không nản'],
      ['big-o', 'Big-O you can reason with', 'Big-O dùng được để suy luận', 'Thời gian và bộ nhớ · Đếm vòng lặp · Bảng giới hạn n'],
      ['khung', 'A framework for any problem', 'Khung giải mọi bài', 'Hỏi làm rõ · Ví dụ · Brute force · Tối ưu · Code · Test'],
    ]],
    ['Chapter 1 — Arrays and hashing', 'Chương 1 — Mảng và băm', 'Map/Set giải một nửa đề dễ.', [
      ['hash-map', 'Hash maps and sets', 'Hash map và set', 'Two Sum · Đếm tần suất · Nhóm anagram'],
      ['prefix-sum', 'Prefix sums', 'Tổng tiền tố', 'Tổng đoạn · Subarray sum = k'],
      ['sap-xep', 'Sorting as a tool', 'Sắp xếp như công cụ', 'Gộp khoảng · Top K bằng sort'],
      ['luyen', 'Practice set 1', 'Bộ luyện 1', '8 đề có lời giải từng bước'],
    ]],
    ['Chapter 2 — Two pointers and sliding window', 'Chương 2 — Hai con trỏ và cửa sổ trượt', 'Duyệt một lần thay vì hai vòng lồng nhau.', [
      ['hai-con-tro', 'Two pointers', 'Hai con trỏ', 'Mảng đã sắp xếp · Palindrome · Container with most water'],
      ['cua-so', 'Fixed and variable sliding windows', 'Cửa sổ trượt cố định và co giãn', 'Chuỗi con dài nhất không lặp · Cửa sổ nhỏ nhất chứa đủ'],
      ['nhanh-cham', 'Fast and slow pointers', 'Con trỏ nhanh chậm', 'Chu trình danh sách liên kết · Điểm giữa'],
      ['luyen', 'Practice set 2', 'Bộ luyện 2', '8 đề có lời giải'],
    ]],
    ['Chapter 3 — Stacks, queues and linked lists', 'Chương 3 — Stack, queue và danh sách liên kết', 'Cấu trúc tuyến tính và mẹo con trỏ.', [
      ['stack', 'Stack problems', 'Bài dùng stack', 'Ngoặc hợp lệ · Monotonic stack · Nhiệt độ ngày tới'],
      ['queue', 'Queues and deques', 'Queue và deque', 'Cửa sổ trượt max bằng deque'],
      ['linked-list', 'Linked list manipulation', 'Thao tác danh sách liên kết', 'Đảo ngược · Gộp hai danh sách · Node giả'],
      ['luyen', 'Practice set 3', 'Bộ luyện 3', '8 đề có lời giải'],
    ]],
    ['Chapter 4 — Binary search', 'Chương 4 — Tìm kiếm nhị phân', 'Không chỉ trên mảng: tìm trên không gian đáp án.', [
      ['co-ban', 'Binary search without off-by-one bugs', 'Nhị phân không lệch một', 'Mẫu lo/hi · Điều kiện dừng · Biên trái/phải'],
      ['xoay', 'Rotated arrays and search variants', 'Mảng xoay và biến thể', 'Tìm trong mảng xoay · Điểm nhỏ nhất'],
      ['khong-gian-dap-an', 'Binary search on the answer', 'Nhị phân trên đáp án', 'Tốc độ ăn chuối · Chia mảng'],
      ['luyen', 'Practice set 4', 'Bộ luyện 4', '6 đề có lời giải'],
    ]],
    ['Chapter 5 — Trees', 'Chương 5 — Cây', 'Đệ quy, duyệt và cây nhị phân tìm kiếm.', [
      ['duyet', 'Traversals: DFS and BFS on trees', 'Duyệt cây: DFS và BFS', 'Pre/in/post-order · Theo tầng'],
      ['de-quy', 'Recursion patterns on trees', 'Mẫu đệ quy trên cây', 'Độ sâu · Đường kính · Cây cân bằng'],
      ['bst', 'Binary search trees', 'Cây nhị phân tìm kiếm', 'Kiểm hợp lệ · Phần tử nhỏ thứ k · LCA'],
      ['luyen', 'Practice set 5', 'Bộ luyện 5', '8 đề có lời giải'],
    ]],
    ['Chapter 6 — Heaps and intervals', 'Chương 6 — Heap và khoảng', 'Top K, trung vị, và bài lịch trùng.', [
      ['heap', 'Heaps and priority queues', 'Heap và hàng đợi ưu tiên', 'Top K · Gộp K danh sách · Heap trong JS không có sẵn'],
      ['trung-vi', 'Two heaps: running median', 'Hai heap: trung vị động', 'Cân bằng hai heap'],
      ['khoang', 'Interval problems', 'Bài toán khoảng', 'Gộp · Chèn · Số phòng họp tối thiểu (đặt lịch!)'],
      ['luyen', 'Practice set 6', 'Bộ luyện 6', '6 đề có lời giải'],
    ]],
    ['Chapter 7 — Graphs', 'Chương 7 — Đồ thị', 'BFS/DFS trên lưới và đồ thị, topo sort, Dijkstra.', [
      ['bieu-dien', 'Representing graphs and grids', 'Biểu diễn đồ thị và lưới', 'Danh sách kề · Lưới 4 hướng'],
      ['bfs-dfs', 'BFS and DFS on graphs', 'BFS và DFS trên đồ thị', 'Số hòn đảo · Đường ngắn nhất không trọng số'],
      ['topo', 'Topological sort and cycle detection', 'Sắp xếp topo và phát hiện chu trình', 'Lịch học môn tiên quyết'],
      ['dijkstra', 'Weighted shortest paths and union-find', 'Đường ngắn nhất có trọng số và union-find', 'Dijkstra · DSU'],
    ]],
    ['Chapter 8 — Backtracking', 'Chương 8 — Quay lui', 'Sinh tổ hợp, hoán vị và cắt nhánh.', [
      ['mau', 'The backtracking template', 'Khung quay lui', 'Chọn · Đệ quy · Bỏ chọn'],
      ['to-hop', 'Subsets, permutations, combinations', 'Tập con, hoán vị, tổ hợp', 'Tránh trùng · Độ phức tạp'],
      ['cat-nhanh', 'Pruning and constraint problems', 'Cắt nhánh và bài ràng buộc', 'N-Queens · Word search'],
      ['luyen', 'Practice set 8', 'Bộ luyện 8', '6 đề có lời giải'],
    ]],
    ['Chapter 9 — Dynamic programming', 'Chương 9 — Quy hoạch động', 'Từ đệ quy có nhớ tới bảng.', [
      ['nhap-mon', 'From recursion to memoisation to tables', 'Từ đệ quy tới nhớ tới bảng', 'Leo cầu thang · Trạng thái và chuyển trạng thái'],
      ['mot-chieu', '1-D DP patterns', 'Mẫu DP một chiều', 'House robber · Coin change · LIS'],
      ['hai-chieu', '2-D DP patterns', 'Mẫu DP hai chiều', 'Đường đi trên lưới · LCS · Edit distance'],
      ['nhan-dien', 'Recognising DP in an interview', 'Nhận ra DP khi phỏng vấn', 'Dấu hiệu · Nói về trạng thái trước khi code'],
    ]],
    ['Chapter 10 — Performing in the interview', 'Chương 10 — Thể hiện trong buổi phỏng vấn', 'Nói, code, test và xử lý khi bí.', [
      ['noi', 'Thinking out loud (in English and Vietnamese)', 'Nói to suy nghĩ (tiếng Anh và tiếng Việt)', 'Câu mẫu tiếng Anh · Xin gợi ý đúng cách'],
      ['code-sach', 'Clean code under time pressure', 'Code sạch dưới áp lực thời gian', 'Tên biến · Hàm phụ · Tránh tối ưu sớm'],
      ['test', 'Testing your own solution', 'Tự test lời giải', 'Chạy tay ví dụ · Trường hợp biên'],
      ['online', 'Online assessments (HackerRank, Codility)', 'Bài thi online (HackerRank, Codility)', 'Đọc đề · Nhập xuất · Quản lý thời gian'],
    ]],
    ['Chapter 11 — Mock interviews and the 6-week plan', 'Chương 11 — Phỏng vấn thử và lộ trình 6 tuần', 'Luyện đều và tự đánh giá.', [
      ['lo-trinh', 'The 6-week practice plan', 'Lộ trình luyện 6 tuần', 'Mỗi ngày làm gì · Ôn lặp lại có khoảng cách'],
      ['thu-1', 'Mock interview 1: easy/medium', 'Phỏng vấn thử 1: dễ/vừa', 'Đề + ghi hình mẫu cách trình bày'],
      ['thu-2', 'Mock interview 2: medium/hard', 'Phỏng vấn thử 2: vừa/khó', 'Đề + chấm theo tiêu chí người phỏng vấn'],
      ['tong-ket', 'After the interview', 'Sau buổi phỏng vấn', 'Ghi lại đề · Rút kinh nghiệm · Checklist'],
    ]],
  ]),
};
