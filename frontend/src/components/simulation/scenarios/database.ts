/**
 * Kịch bản 4 — Bên trong một truy vấn cơ sở dữ liệu.
 *
 * Đây là kịch bản khó "thấy" nhất bằng lời nói và dễ thấy nhất bằng hoạt
 * hình: cùng một câu SELECT, chỉ khác chỗ có hay không có chỉ mục, mà một
 * bên chạm 4 trang dữ liệu còn một bên quét 128.000 dòng. Người xem nhìn
 * thấy quãng đường và thời lượng khác nhau rõ rệt trên cùng một sơ đồ.
 */

import { Database } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'api', label: 'API', kind: 'server' as const, x: 105, y: 300, sublabel: { vi: 'Prisma client', en: 'Prisma client' } },
  { id: 'planner', label: 'Query Planner', kind: 'db' as const, x: 340, y: 300, sublabel: { vi: 'Parse · Plan · Cost', en: 'Parse · Plan · Cost' } },
  { id: 'idx', label: 'B-Tree Index', kind: 'index' as const, x: 620, y: 130, sublabel: { vi: 'posts_author_idx', en: 'posts_author_idx' } },
  { id: 'heap', label: 'Heap / Table', kind: 'db' as const, x: 620, y: 455, sublabel: { vi: '128.000 dòng · 8KB/trang', en: '128,000 rows · 8KB pages' } },
  { id: 'wal', label: 'WAL + Buffer', kind: 'db' as const, x: 885, y: 300, sublabel: { vi: 'Nhật ký ghi trước', en: 'Write-ahead log' } },
];

const edges = [
  { id: 'e_api_planner', from: 'api', to: 'planner' },
  { id: 'e_planner_idx', from: 'planner', to: 'idx' },
  { id: 'e_planner_heap', from: 'planner', to: 'heap' },
  { id: 'e_idx_heap', from: 'idx', to: 'heap', curve: 120, ghost: true, label: { vi: 'ctid → trang', en: 'ctid → page' } },
  { id: 'e_heap_wal', from: 'heap', to: 'wal' },
  { id: 'e_idx_wal', from: 'idx', to: 'wal', ghost: true },
];

export const databaseScenario: Scenario = {
  id: 'database',
  name: { vi: 'Truy vấn CSDL — Chỉ mục & Ghi', en: 'Database query — Index & Write' },
  tagline: {
    vi: 'Cùng một câu lệnh, có chỉ mục và không có chỉ mục: nhìn tận mắt vì sao chênh nhau hàng trăm lần.',
    en: 'The same statement with and without an index: watch exactly where the hundredfold difference comes from.',
  },
  icon: Database,
  accent: '#60a5fa',
  nodes,
  edges,
  options: [
    {
      id: 'op',
      label: { vi: 'Thao tác', en: 'Operation' },
      defaultValue: 'read',
      choices: [
        { value: 'read', label: 'SELECT (đọc)', color: '#10b981' },
        { value: 'write', label: 'INSERT (ghi)', color: '#22d3ee' },
        { value: 'tx', label: 'Giao dịch + khoá', color: '#f59e0b', hint: { vi: 'Hai request tranh cùng một dòng', en: 'Two requests contend on one row' } },
      ],
    },
    {
      id: 'indexed',
      label: { vi: 'Chỉ mục', en: 'Index' },
      defaultValue: 'yes',
      choices: [
        { value: 'yes', label: 'Có chỉ mục', color: '#2dd4bf' },
        { value: 'no', label: 'Không có chỉ mục', color: '#f43f5e', hint: { vi: 'Buộc phải quét toàn bảng', en: 'Forces a sequential scan' } },
      ],
    },
  ],

  build({ op = 'read', indexed = 'yes' }) {
    const steps: SimStep[] = [];
    const hasIdx = indexed === 'yes';

    steps.push({
      id: 'send',
      edge: 'e_api_planner',
      kind: op === 'read' ? 'QUERY' : 'POST',
      duration: 1000,
      latencyMs: 1,
      packetLabel: op === 'read' ? 'SELECT …' : op === 'write' ? 'INSERT …' : 'BEGIN',
      title: { vi: 'Câu lệnh rời ứng dụng', en: 'The statement leaves the application' },
      detail: {
        vi: 'Prisma mượn một kết nối từ pool. Kích thước pool là con số hay bị đặt sai nhất: đặt quá lớn thì hàng nghìn kết nối tranh nhau CPU của Postgres và mọi thứ chậm đi; công thức khởi điểm hợp lý là khoảng (số nhân CPU × 2) + số đĩa.',
        en: 'Prisma borrows a connection from the pool. Pool size is the most commonly mis-set number in a backend: too large and thousands of connections fight over Postgres\' CPU until everything slows down. A sane starting formula is roughly (cores × 2) + spindles.',
      },
      payload:
        op === 'read'
          ? { sql: 'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC LIMIT 20', params: [7] }
          : { sql: 'INSERT INTO posts (author_id, title, body) VALUES ($1,$2,$3) RETURNING id', params: [7, 'Bài mới', '…'] },
      nodeStates: { api: 'active', planner: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'plan',
      at: 'planner',
      kind: 'INTERNAL',
      duration: 1100,
      latencyMs: 0.4,
      title: { vi: 'Phân tích cú pháp và lập kế hoạch', en: 'Parse, then plan' },
      detail: {
        vi: 'SQL là ngôn ngữ KHAI BÁO: bạn nói muốn gì, bộ tối ưu tự quyết định làm thế nào. Nó ước lượng chi phí của từng phương án dựa trên thống kê thu thập bởi ANALYZE. Thống kê cũ là nguyên nhân số một khiến kế hoạch đột nhiên tệ đi dù truy vấn không đổi.',
        en: 'SQL is DECLARATIVE: you state what you want, the optimiser decides how. It costs each candidate plan using statistics gathered by ANALYZE. Stale statistics are the number-one reason a plan suddenly degrades while the query itself never changed.',
      },
      nodeStates: { planner: 'processing' },
      sfx: 'click',
    });

    /* ── Nhánh giao dịch + khoá ────────────────────────────────── */
    if (op === 'tx') {
      steps.push({
        id: 'tx-begin',
        at: 'planner',
        kind: 'INTERNAL',
        duration: 1000,
        title: { vi: 'BEGIN — mở giao dịch', en: 'BEGIN — open a transaction' },
        detail: {
          vi: 'Từ giây phút này, mọi thay đổi chỉ hiện hữu với chính giao dịch đó cho tới khi COMMIT. Postgres dùng MVCC: mỗi lệnh UPDATE tạo ra một PHIÊN BẢN mới của dòng thay vì ghi đè, nhờ vậy người đọc không bao giờ phải chờ người ghi.',
          en: 'From this moment every change is visible only inside the transaction until COMMIT. Postgres uses MVCC: an UPDATE creates a new VERSION of the row instead of overwriting it, which is why readers never block on writers.',
        },
        nodeStates: { planner: 'active' },
        sfx: 'blip',
      });
      steps.push({
        id: 'tx-lock',
        edge: 'e_planner_heap',
        kind: 'PUT',
        duration: 1100,
        latencyMs: 3,
        packetLabel: 'SELECT … FOR UPDATE',
        title: { vi: 'Giao dịch A khoá dòng', en: 'Transaction A locks the row' },
        detail: {
          vi: 'SELECT … FOR UPDATE đặt khoá ghi trên dòng số dư ví. Không có khoá này, hai lệnh rút tiền chạy song song có thể cùng đọc số dư 100.000đ rồi cùng trừ — kết quả là rút được 200.000đ từ một ví chỉ có 100.000đ. Đó là lost update.',
          en: 'SELECT … FOR UPDATE takes a write lock on the wallet balance row. Without it two concurrent withdrawals can both read a balance of 100,000 and both subtract from it — 200,000 withdrawn from a wallet holding 100,000. That is a lost update.',
        },
        nodeStates: { heap: 'processing' },
        sfx: 'lock',
        teachingNote: {
          vi: 'Đây là điểm dừng đắt giá nhất của kịch bản CSDL: giảng lost update bằng ví dụ ví tiền, ai cũng hiểu ngay.',
          en: 'The most valuable pause in the database scenario: explain lost updates with the wallet example — it lands instantly.',
        },
      });
      steps.push({
        id: 'tx-wait',
        at: 'heap',
        kind: 'CACHE_MISS',
        duration: 1400,
        latencyMs: 840,
        title: { vi: 'Giao dịch B phải CHỜ', en: 'Transaction B has to WAIT' },
        detail: {
          vi: 'Request thứ hai chạm đúng dòng đó và bị chặn lại. Nó không lỗi, chỉ đứng xếp hàng. Giữ giao dịch mở càng lâu thì hàng chờ càng dài — nguyên tắc: giao dịch phải NGẮN, và tuyệt đối không gọi API bên ngoài khi đang mở giao dịch.',
          en: 'A second request touches the same row and blocks. It does not fail, it queues. The longer the transaction stays open the longer the queue — hence the rule: keep transactions SHORT, and never call an external API while one is open.',
        },
        nodeStates: { heap: 'waiting' },
        sfx: 'buzz',
        log: { vi: 'process 8821 waits for ShareLock on transaction 4471', en: 'process 8821 waits for ShareLock on transaction 4471' },
      });
      steps.push({
        id: 'tx-wal',
        edge: 'e_heap_wal',
        kind: 'PUT',
        duration: 1000,
        latencyMs: 6,
        packetLabel: 'COMMIT',
        title: { vi: 'COMMIT — ghi WAL rồi nhả khoá', en: 'COMMIT — flush the WAL, release the lock' },
        detail: {
          vi: 'COMMIT chỉ trả về sau khi bản ghi WAL đã thực sự nằm trên đĩa (fsync). Đó là lý do một commit tốn vài mili giây chứ không phải vài micro giây — và cũng là lý do gom nhiều thao tác vào một giao dịch lại nhanh hơn nhiều giao dịch nhỏ.',
          en: 'COMMIT returns only once the WAL record is physically on disk (fsync). That is why a commit costs milliseconds rather than microseconds — and why batching work into one transaction beats many tiny ones.',
        },
        nodeStates: { wal: 'processing', heap: 'success' },
        sfx: 'ping',
      });
      steps.push({
        id: 'tx-b-go',
        at: 'heap',
        kind: 'RESPONSE',
        duration: 1000,
        title: { vi: 'Giao dịch B được tiếp tục', en: 'Transaction B resumes' },
        detail: {
          vi: 'B đọc lại số dư — lần này là giá trị đã trừ của A. Tính đúng đắn được giữ nguyên, cái giá phải trả là 840ms chờ đợi. Nếu hai giao dịch khoá hai dòng theo thứ tự ngược nhau, ta có deadlock; Postgres tự phát hiện và huỷ một bên.',
          en: 'B re-reads the balance — now the value A already decremented. Correctness is preserved; the price was 840ms of waiting. If two transactions lock two rows in opposite order you get a deadlock, which Postgres detects and resolves by aborting one side.',
        },
        nodeStates: { heap: 'success', wal: 'success' },
        sfx: 'success',
      });
      steps.push({
        id: 'tx-done',
        edge: 'e_api_planner',
        reverse: true,
        kind: 'RESPONSE',
        duration: 950,
        status: 200,
        packetLabel: 'COMMIT ok',
        title: { vi: 'Cả hai giao dịch hoàn tất đúng', en: 'Both transactions complete correctly' },
        detail: {
          vi: 'Tổng kết ACID qua chính ví dụ này: Atomicity (được cả hoặc không gì cả), Consistency (số dư không âm), Isolation (B không thấy trạng thái dở dang của A), Durability (WAL đã fsync nên mất điện vẫn còn).',
          en: 'ACID summarised through this very example: Atomicity (all or nothing), Consistency (the balance never goes negative), Isolation (B never saw A half-done), Durability (the WAL was fsynced, so a power cut cannot erase it).',
        },
        nodeStates: { planner: 'idle', api: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Nhánh ĐỌC ─────────────────────────────────────────────── */
    if (op === 'read') {
      if (hasIdx) {
        steps.push({
          id: 'plan-idx',
          at: 'planner',
          kind: 'INTERNAL',
          duration: 950,
          title: { vi: 'Kế hoạch: Index Scan', en: 'Plan chosen: Index Scan' },
          detail: {
            vi: 'Bộ tối ưu ước lượng Index Scan tốn cost=8.4 còn Seq Scan tốn cost=2841. Nó chọn phương án rẻ hơn. Lưu ý: với bảng nhỏ hoặc khi truy vấn lấy về phần lớn số dòng, Seq Scan mới là lựa chọn đúng — chỉ mục không phải lúc nào cũng thắng.',
            en: 'The optimiser prices an Index Scan at cost=8.4 versus cost=2841 for a Seq Scan, and takes the cheaper one. Note: on a small table, or when the query returns most of the rows, a Seq Scan is genuinely the right plan — indexes do not always win.',
          },
          payload: { plan: 'Index Scan using posts_author_idx', estimatedCost: 8.4, alternative: { plan: 'Seq Scan', cost: 2841 } },
          nodeStates: { planner: 'success' },
          sfx: 'click',
        });
        steps.push({
          id: 'idx-walk',
          edge: 'e_planner_idx',
          kind: 'QUERY',
          duration: 1100,
          latencyMs: 0.6,
          packetLabel: 'author_id = 7',
          title: { vi: 'Đi xuống cây B-Tree', en: 'Descend the B-Tree' },
          detail: {
            vi: 'Cây B-Tree của 128.000 dòng chỉ sâu 3 tầng. Mỗi tầng là một lần đọc trang: root → internal → leaf. Ba lần đọc thay vì 128.000 lần — đó là toàn bộ phép màu, và nó là logarit chứ không phải tuyến tính.',
            en: 'A B-Tree over 128,000 rows is only three levels deep. Each level is one page read: root → internal → leaf. Three reads instead of 128,000 — that is the entire trick, and it is logarithmic rather than linear.',
          },
          payload: { depth: 3, pagesRead: 3, matchingCtids: 20 },
          nodeStates: { idx: 'processing' },
          sfx: 'blip',
        });
        steps.push({
          id: 'idx-fetch',
          edge: 'e_idx_heap',
          kind: 'QUERY',
          duration: 1050,
          latencyMs: 1.2,
          packetLabel: '20 × ctid',
          title: { vi: 'Nhảy tới đúng trang chứa dữ liệu', en: 'Jump straight to the right heap pages' },
          detail: {
            vi: 'Lá của chỉ mục chứa ctid — địa chỉ vật lý (trang, dòng) của bản ghi. Postgres nhảy thẳng tới đó. Nếu chỉ mục chứa sẵn mọi cột cần lấy thì bước này biến mất hoàn toàn: đó gọi là index-only scan, nhanh hơn nữa.',
            en: 'Index leaves store the ctid — the physical (page, offset) address of the row. Postgres jumps straight there. If the index already contains every column the query needs, this step disappears entirely: that is an index-only scan, faster still.',
          },
          nodeStates: { idx: 'success', heap: 'processing' },
          sfx: 'swoosh',
        });
        steps.push({
          id: 'read-done',
          at: 'heap',
          kind: 'RESPONSE',
          duration: 1000,
          latencyMs: 2.1,
          title: { vi: 'Đọc 4 trang · 2,1ms', en: '4 pages read · 2.1ms' },
          detail: {
            vi: 'Phần lớn các trang này nằm sẵn trong shared_buffers (RAM), nên không hề chạm tới đĩa. Tỷ lệ trúng buffer cache là chỉ số sức khoẻ quan trọng nhất của một CSDL đang chạy.',
            en: 'Most of these pages are already in shared_buffers (RAM), so the disk is never touched. Buffer cache hit ratio is the single most important health metric of a running database.',
          },
          payload: { rows: 20, buffers: { hit: 4, read: 0 }, executionTime: '2.1ms' },
          nodeStates: { heap: 'success' },
          sfx: 'ping',
          log: { vi: 'Index Scan · rows=20 · shared hit=4 · 2.1ms', en: 'Index Scan · rows=20 · shared hit=4 · 2.1ms' },
        });
      } else {
        steps.push({
          id: 'plan-seq',
          at: 'planner',
          kind: 'CACHE_MISS',
          duration: 1000,
          title: { vi: 'Không có chỉ mục — buộc Seq Scan', en: 'No index — forced Seq Scan' },
          detail: {
            vi: 'Không có cấu trúc nào giúp tìm nhanh, bộ tối ưu chỉ còn một lựa chọn: đọc TỪNG dòng và tự kiểm điều kiện. Chi phí tăng tuyến tính theo số dòng — hôm nay 128.000 dòng còn chịu được, sang năm 5 triệu dòng thì trang web sập.',
            en: 'With no structure to search, the optimiser has exactly one option: read EVERY row and test the predicate itself. Cost grows linearly with row count — 128,000 rows is survivable today, five million next year takes the site down.',
          },
          payload: { plan: 'Seq Scan on posts', estimatedCost: 2841, filter: 'author_id = 7' },
          nodeStates: { planner: 'error' },
          sfx: 'buzz',
        });
        steps.push({
          id: 'seq-scan',
          edge: 'e_planner_heap',
          kind: 'CACHE_MISS',
          duration: 2000,
          latencyMs: 412,
          packetLabel: 'quét 128.000 dòng',
          title: { vi: 'Quét toàn bảng — 128.000 dòng', en: 'Full table scan — 128,000 rows' },
          detail: {
            vi: 'Hãy để ý hoạt hình chậm hẳn lại ở đây: đó không phải hiệu ứng trang trí mà là tỷ lệ thời gian THẬT. Postgres đọc 1.842 trang từ đĩa, kiểm 128.000 dòng để rồi giữ lại đúng 20 dòng. 99,98% công sức bị vứt đi.',
            en: 'Notice the animation slow to a crawl here: that is not decoration, it is the real time ratio. Postgres reads 1,842 pages off disk and tests 128,000 rows to keep exactly 20. 99.98% of the work is thrown away.',
          },
          nodeStates: { heap: 'processing' },
          sfx: 'buzz',
          teachingNote: {
            vi: 'Điểm chốt của cả kịch bản: 2,1ms so với 412ms — chênh gần 200 lần chỉ vì một dòng CREATE INDEX.',
            en: 'The punchline of the whole scenario: 2.1ms versus 412ms — a ~200× gap created by one CREATE INDEX line.',
          },
        });
        steps.push({
          id: 'seq-done',
          at: 'heap',
          kind: 'ERROR',
          duration: 1100,
          latencyMs: 412,
          title: { vi: 'Xong sau 412ms — chậm hơn 196 lần', en: 'Done after 412ms — 196× slower' },
          detail: {
            vi: 'Cách sửa gọn gàng: CREATE INDEX CONCURRENTLY posts_author_idx ON posts(author_id, created_at DESC). Từ khoá CONCURRENTLY khiến việc tạo chỉ mục không khoá bảng — bắt buộc trên môi trường thật. Đổi lại, mỗi chỉ mục làm chậm INSERT/UPDATE và tốn thêm dung lượng, nên đừng đánh chỉ mục tràn lan.',
            en: 'The clean fix: CREATE INDEX CONCURRENTLY posts_author_idx ON posts(author_id, created_at DESC). CONCURRENTLY builds it without locking the table — mandatory in production. The trade-off: every index slows INSERT/UPDATE and costs disk, so do not index everything.',
          },
          payload: { rows: 20, buffers: { hit: 302, read: 1540 }, executionTime: '412ms' },
          nodeStates: { heap: 'error' },
          sfx: 'error',
          log: { vi: 'Seq Scan · rows=128000 filtered → 20 · read=1540 pages · 412ms', en: 'Seq Scan · rows=128000 filtered → 20 · read=1540 pages · 412ms' },
        });
      }

      steps.push({
        id: 'read-back',
        edge: 'e_api_planner',
        reverse: true,
        kind: 'RESPONSE',
        duration: 950,
        status: 200,
        packetLabel: '20 rows',
        title: { vi: 'Trả kết quả về ứng dụng', en: 'Return the rows to the application' },
        detail: {
          vi: `Tổng thời gian truy vấn: ${hasIdx ? '2,1ms' : '412ms'}. Công cụ để tự kiểm chứng điều vừa xem: EXPLAIN (ANALYZE, BUFFERS) đặt trước câu lệnh của bạn — nó in ra đúng kế hoạch và số trang đã đọc.`,
          en: `Total query time: ${hasIdx ? '2.1ms' : '412ms'}. The tool to verify all of this yourself: prefix your statement with EXPLAIN (ANALYZE, BUFFERS) — it prints the exact plan and the pages touched.`,
        },
        nodeStates: { planner: 'idle', api: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Nhánh GHI ─────────────────────────────────────────────── */
    steps.push({
      id: 'write-heap',
      edge: 'e_planner_heap',
      kind: 'POST',
      duration: 1050,
      latencyMs: 0.8,
      packetLabel: 'tuple mới',
      title: { vi: 'Ghi dòng mới vào trang dữ liệu', en: 'Write the new tuple into a heap page' },
      detail: {
        vi: 'Bản ghi được đặt vào một trang còn chỗ trong shared_buffers — tức là ghi vào RAM, chưa chạm đĩa. Trang đó nay "bẩn" (dirty) và sẽ được đẩy xuống đĩa sau, bởi tiến trình checkpoint.',
        en: 'The tuple goes into a page with free space inside shared_buffers — a memory write, not a disk write. That page is now dirty and will be flushed later by the checkpointer.',
      },
      nodeStates: { heap: 'processing' },
      sfx: 'click',
    });

    steps.push({
      id: 'wal',
      edge: 'e_heap_wal',
      kind: 'PUT',
      duration: 1200,
      latencyMs: 5.4,
      packetLabel: 'WAL record + fsync',
      title: { vi: 'Ghi WAL và fsync — bước đắt nhất', en: 'WAL record + fsync — the expensive part' },
      detail: {
        vi: 'Nguyên tắc write-ahead: nhật ký phải nằm trên đĩa TRƯỚC khi trang dữ liệu được coi là đã đổi. Nhờ trật tự đó, nếu mất điện ngay lúc này, Postgres khởi động lại và phát lại WAL để dựng lại đúng trạng thái. Toàn bộ chi phí của một lệnh ghi nằm ở fsync này, không phải ở việc "ghi dữ liệu".',
        en: 'The write-ahead rule: the log must hit disk BEFORE the data page counts as changed. Because of that ordering, a power cut right now is survivable — Postgres restarts and replays the WAL back to a correct state. Essentially all the cost of a write lives in this fsync, not in "writing the data".',
      },
      nodeStates: { wal: 'processing' },
      sfx: 'ping',
      teachingNote: {
        vi: 'Giải thích vì sao gom 1.000 INSERT vào MỘT giao dịch nhanh hơn 1.000 giao dịch riêng: bạn trả tiền fsync một lần thay vì một nghìn lần.',
        en: 'Explain why 1,000 INSERTs in ONE transaction beat 1,000 separate ones: you pay for fsync once instead of a thousand times.',
      },
    });

    if (hasIdx) {
      steps.push({
        id: 'idx-update',
        edge: 'e_idx_wal',
        reverse: true,
        kind: 'PUT',
        duration: 1000,
        latencyMs: 1.1,
        packetLabel: 'cập nhật chỉ mục',
        title: { vi: 'Mọi chỉ mục cũng phải cập nhật', en: 'Every index must be updated too' },
        detail: {
          vi: 'Đây là mặt trái của chỉ mục mà ít người nói tới: một bảng có 6 chỉ mục thì mỗi lần INSERT là 7 lần ghi chứ không phải 1. Chỉ mục làm đọc nhanh lên và làm ghi chậm đi — luôn phải cân theo tỷ lệ đọc/ghi thực tế của bảng đó.',
          en: 'The rarely mentioned downside of indexes: a table with six indexes turns one INSERT into seven writes. Indexes buy read speed with write speed — always weigh them against that table\'s real read/write ratio.',
        },
        nodeStates: { idx: 'processing' },
        sfx: 'blip',
      });
    }

    steps.push({
      id: 'commit',
      at: 'wal',
      kind: 'RESPONSE',
      duration: 1000,
      latencyMs: 0.3,
      title: { vi: 'COMMIT — thay đổi trở nên bền vững', en: 'COMMIT — the change becomes durable' },
      detail: {
        vi: 'Từ khoảnh khắc này, dữ liệu chính thức tồn tại kể cả khi máy chủ mất điện ngay lập tức. Các giao dịch khác bắt đầu nhìn thấy dòng mới. Chữ D trong ACID được bảo đảm bằng đúng một lệnh fsync ở bước trước.',
        en: 'From this instant the data officially exists even if the machine loses power immediately. Other transactions begin to see the new row. The D in ACID is guaranteed by exactly that one fsync in the previous step.',
      },
      nodeStates: { wal: 'success', heap: 'success' },
      sfx: 'success',
    });

    steps.push({
      id: 'write-back',
      edge: 'e_api_planner',
      reverse: true,
      kind: 'RESPONSE',
      duration: 950,
      status: 201,
      packetLabel: 'RETURNING id',
      title: { vi: 'Trả về id vừa tạo', en: 'Return the generated id' },
      detail: {
        vi: 'RETURNING id giúp lấy khoá chính ngay trong cùng một vòng gọi, thay vì phải SELECT lại. Tổng thời gian ghi khoảng 7,6ms — trong đó 5,4ms là fsync.',
        en: 'RETURNING id hands back the primary key within the same round trip instead of a follow-up SELECT. Total write time about 7.6ms, of which 5.4ms was fsync.',
      },
      payload: { id: 128441, createdAt: '2026-07-28T09:20:11.442Z' },
      nodeStates: { planner: 'idle', api: 'success' },
      sfx: 'ping',
    });

    return steps;
  },
};
