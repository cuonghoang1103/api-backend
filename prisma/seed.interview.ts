/* eslint-disable */
/**
 * Prisma seed — Interview Simulator STARTER bank. Run: tsx prisma/seed.interview.ts
 *
 * Fully idempotent & safe to re-run on prod:
 *  - domains/tracks/topics/concepts/company-profiles upserted by unique slug
 *  - questions are find-before-create (by topicId + body); nothing deleted
 *
 * ⚠️ CONTENT WARNING (read the prompt's SEED DATA section):
 * The rubrics + reference answers ARE the product. These are a STRUCTURED
 * FIRST DRAFT for a human to rewrite — every question is marked
 * `rubricReviewed: false` so the admin panel flags it as low-confidence and
 * excludes it from any future golden set. The seed's job is to give the human
 * a starting point to edit, NOT to pretend the content problem is solved.
 *
 * Starter scope: 3 priority tracks (Node.js, Database, Behavioral) with
 * concept variants for the spaced-repetition drill. Expand over time.
 */
import { PrismaClient } from '@prisma/client';
import type { InterviewLevel, InterviewQuestionType } from '@prisma/client';

const prisma = new PrismaClient();

interface QSeed {
  level: InterviewLevel;
  type?: InterviewQuestionType;
  difficulty?: number;
  body: string;
  referenceAnswer: string;
  rubric: Array<{ id: string; criterion: string; weight: number }>;
  mustMention: string[];
  shouldMention?: string[];
  redFlags?: string[];
  synonyms?: Record<string, string[]>;
  tags?: string[];
}
interface ConceptSeed { slug: string; name: string; questions: QSeed[]; }
interface TopicSeed { slug: string; name: string; nameVi: string; weight: number; concepts: ConceptSeed[]; }
interface TrackSeed { slug: string; name: string; nameVi: string; domainSlug: string; topics: TopicSeed[]; }

const DOMAINS = [
  { slug: 'backend', name: 'Backend', nameVi: 'Backend', icon: 'server' },
  { slug: 'general', name: 'General', nameVi: 'Tổng quát', icon: 'users' },
];

const COMPANY_PROFILES = [
  { slug: 'faang', name: 'FAANG-style', rigor: 5, styleDescriptor: 'A large global tech company. Deep, rigorous, follow-up heavy. Expects precise terminology, complexity analysis, and trade-off reasoning. Politely relentless; probes every claim.' },
  { slug: 'vn-product', name: 'Vietnamese product company', rigor: 4, styleDescriptor: 'A Vietnamese product company. Values solid fundamentals plus real system-design depth and ownership. Practical, scenario-driven; asks how you would ship and operate it.' },
  { slug: 'outsourcing', name: 'Outsourcing / agency', rigor: 3, styleDescriptor: 'A Vietnamese outsourcing/agency. Heavy on fundamentals and clear English communication. Broad coverage over extreme depth; expects you to explain concepts a client could follow.' },
  { slug: 'startup', name: 'Startup', rigor: 3, styleDescriptor: 'An early-stage startup. Pragmatic and scrappy; values shipping, breadth, and judgement under ambiguity over textbook perfection.' },
];

const TRACKS: TrackSeed[] = [
  {
    slug: 'nodejs-backend', name: 'Node.js Backend Engineer', nameVi: 'Node.js Backend', domainSlug: 'backend',
    topics: [
      {
        slug: 'nodejs-event-loop', name: 'Event Loop', nameVi: 'Vòng lặp sự kiện', weight: 3,
        concepts: [
          {
            slug: 'event-loop-model', name: 'Event loop model & phases',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Giải thích Node.js event loop hoạt động như thế nào? Kể tên các phase chính và cho biết vì sao Node được coi là "single-threaded nhưng non-blocking".',
                referenceAnswer: 'Node chạy JS trên một luồng duy nhất với một event loop do libuv cung cấp. Mỗi vòng lặp đi qua các phase theo thứ tự: timers (setTimeout/setInterval), pending callbacks, poll (I/O), check (setImmediate), close callbacks. Giữa mỗi phase (và sau mỗi callback ở tick), microtask queue (Promise) và process.nextTick được rút cạn. I/O thực sự được đẩy xuống thread pool của libuv hoặc kernel async, nên luồng JS không bị chặn — "single-threaded" cho code JS nhưng "non-blocking" nhờ I/O bất đồng bộ.',
                rubric: [
                  { id: 'c1', criterion: 'Nêu Node chạy JS một luồng + event loop của libuv', weight: 0.25 },
                  { id: 'c2', criterion: 'Kể tên các phase (timers, poll, check, close) đúng thứ tự', weight: 0.3 },
                  { id: 'c3', criterion: 'Giải thích I/O được offload (libuv thread pool / kernel) nên không chặn', weight: 0.25 },
                  { id: 'c4', criterion: 'Phân biệt được microtask được rút cạn giữa các phase', weight: 0.2 },
                ],
                mustMention: ['event loop', 'phase', 'non-blocking'],
                shouldMention: ['libuv', 'poll', 'timers', 'thread pool', 'setImmediate'],
                redFlags: ['Node.js là đa luồng mặc định', 'Node chạy mỗi request một thread'],
                synonyms: { 'non-blocking': ['non blocking', 'bất đồng bộ', 'không chặn'], 'thread pool': ['threadpool', 'nhóm luồng'], 'event loop': ['vòng lặp sự kiện', 'eventloop'] },
                tags: ['event-loop', 'libuv', 'async'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Một hàm đồng bộ nặng CPU (ví dụ tính toán lớn hoặc JSON.parse chuỗi khổng lồ) ảnh hưởng thế nào tới event loop? Làm sao phát hiện và tránh chặn?',
                referenceAnswer: 'Vì JS chạy trên một luồng, một hàm sync nặng CPU sẽ chiếm luồng và chặn toàn bộ event loop: mọi request/callback khác phải chờ, latency tăng vọt, health check có thể timeout. Cách tránh: chia nhỏ tác vụ (chunking + setImmediate), đẩy sang worker_threads hoặc child process, dùng thư viện native/stream cho parse lớn, hoặc offload sang hàng đợi/dịch vụ khác. Phát hiện bằng cách đo event loop lag (ví dụ perf_hooks.monitorEventLoopDelay), theo dõi p99 latency, hoặc log khi lag vượt ngưỡng.',
                rubric: [
                  { id: 'c1', criterion: 'Giải thích code sync nặng chặn cả loop vì một luồng', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu hậu quả cụ thể (mọi request chờ, latency, timeout)', weight: 0.2 },
                  { id: 'c3', criterion: 'Đề xuất worker_threads / child process / chunking', weight: 0.3 },
                  { id: 'c4', criterion: 'Cách đo event loop lag để phát hiện', weight: 0.2 },
                ],
                mustMention: ['chặn', 'worker', 'một luồng'],
                shouldMention: ['worker_threads', 'event loop lag', 'setImmediate', 'child process'],
                redFlags: ['thêm CPU sẽ tự động chạy song song', 'Node tự tạo thread cho mỗi hàm nặng'],
                synonyms: { 'chặn': ['block', 'blocking', 'chặn luồng'], 'worker': ['worker_threads', 'worker thread', 'luồng phụ'], 'một luồng': ['single thread', 'single-threaded', 'đơn luồng'] },
                tags: ['event-loop', 'cpu-bound', 'performance'],
              },
            ],
          },
          {
            slug: 'microtask-vs-macrotask', name: 'Microtask vs macrotask',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Phân biệt microtask queue và macrotask queue trong Node. Với đoạn code có cả setTimeout(fn,0) và Promise.resolve().then(fn), cái nào chạy trước? Vì sao?',
                referenceAnswer: 'Macrotask (task) gồm setTimeout/setInterval/setImmediate/I/O callbacks — mỗi phase của event loop xử lý chúng. Microtask gồm Promise.then/catch/finally và queueMicrotask; process.nextTick còn ưu tiên cao hơn cả microtask. Sau mỗi callback, Node rút CẠN toàn bộ microtask queue trước khi sang macrotask tiếp theo. Nên Promise.then chạy TRƯỚC setTimeout(fn,0) dù timeout là 0, vì microtask được xử lý ngay sau tick hiện tại còn timer phải đợi tới phase timers.',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa đúng microtask (Promise) vs macrotask (setTimeout/IO)', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu microtask được rút cạn giữa mỗi macrotask', weight: 0.3 },
                  { id: 'c3', criterion: 'Kết luận Promise.then chạy trước setTimeout(0) + lý do', weight: 0.3 },
                  { id: 'c4', criterion: 'Đề cập process.nextTick ưu tiên hơn microtask', weight: 0.1 },
                ],
                mustMention: ['microtask', 'macrotask', 'promise'],
                shouldMention: ['nextTick', 'queueMicrotask', 'rút cạn', 'setTimeout'],
                redFlags: ['setTimeout(0) luôn chạy trước Promise', 'microtask và macrotask giống nhau'],
                synonyms: { 'microtask': ['micro task', 'microtask queue', 'promise queue', 'hàng đợi vi mô'], 'macrotask': ['macro task', 'task queue', 'macrotask queue'], 'rút cạn': ['drain', 'xử lý hết', 'flush'] },
                tags: ['event-loop', 'microtask', 'promise'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'process.nextTick khác gì so với một Promise microtask? Vì sao lạm dụng process.nextTick có thể gây "starvation" cho event loop?',
                referenceAnswer: 'process.nextTick đẩy callback vào một hàng đợi riêng được xử lý NGAY sau operation hiện tại, TRƯỚC cả microtask (Promise) và trước khi loop tiếp tục. Promise microtask cũng chạy trước macrotask nhưng SAU nextTick queue. Vì nextTick queue được rút cạn hoàn toàn trước khi loop đi tiếp, nếu bạn liên tục schedule nextTick bên trong nextTick, event loop không bao giờ tới được phase I/O/timers → starvation: I/O bị "đói", request treo. Vì vậy nên dùng setImmediate khi muốn nhường loop.',
                rubric: [
                  { id: 'c1', criterion: 'nextTick chạy trước cả Promise microtask', weight: 0.3 },
                  { id: 'c2', criterion: 'Giải thích cơ chế starvation (nextTick lồng nhau chặn loop)', weight: 0.4 },
                  { id: 'c3', criterion: 'Đề xuất setImmediate để nhường loop', weight: 0.3 },
                ],
                mustMention: ['nexttick', 'starvation'],
                shouldMention: ['setImmediate', 'microtask', 'I/O'],
                redFlags: ['nextTick chạy sau setTimeout', 'nextTick là macrotask'],
                synonyms: { 'nexttick': ['process.nexttick', 'next tick'], 'starvation': ['đói', 'bỏ đói', 'starve'] },
                tags: ['event-loop', 'nexttick', 'starvation'],
              },
            ],
          },
        ],
      },
      {
        slug: 'nodejs-async', name: 'Async Patterns', nameVi: 'Mẫu bất đồng bộ', weight: 2,
        concepts: [
          {
            slug: 'promise-async-await', name: 'Promises & async/await',
            questions: [
              {
                level: 'JUNIOR', difficulty: 2,
                body: 'async/await khác Promise.then() như thế nào? Từ khoá await có "chặn" luồng không?',
                referenceAnswer: 'async/await là cú pháp đường (syntactic sugar) trên Promise: một hàm async luôn trả về Promise, await tạm dừng thực thi của hàm đó cho tới khi Promise resolve rồi trả về giá trị đã unwrap. await KHÔNG chặn luồng — nó chỉ tạm dừng hàm async hiện tại và trả quyền điều khiển về event loop để xử lý việc khác; khi Promise xong, phần còn lại chạy tiếp như một microtask. .then() thì nối callback thay vì viết tuần tự.',
                rubric: [
                  { id: 'c1', criterion: 'async fn trả về Promise, await unwrap giá trị', weight: 0.3 },
                  { id: 'c2', criterion: 'await KHÔNG chặn luồng, chỉ tạm dừng hàm async', weight: 0.4 },
                  { id: 'c3', criterion: 'Nêu tương đương với .then() (syntactic sugar)', weight: 0.3 },
                ],
                mustMention: ['promise', 'await', 'không chặn'],
                shouldMention: ['microtask', 'syntactic sugar', 'tạm dừng'],
                redFlags: ['await chặn cả event loop', 'async làm code chạy song song trên nhiều luồng'],
                synonyms: { 'không chặn': ['non-blocking', 'không block', 'không chặn luồng'], 'await': ['từ khoá await'], 'promise': ['lời hứa'] },
                tags: ['async', 'promise', 'async-await'],
              },
              {
                level: 'MID', difficulty: 3,
                body: 'Bạn cần gọi 3 API độc lập rồi tổng hợp kết quả. So sánh `await` từng cái trong vòng lặp với Promise.all(). Khi nào KHÔNG nên dùng Promise.all?',
                referenceAnswer: 'await tuần tự trong vòng lặp chạy lần lượt: tổng thời gian = tổng các call → chậm khi chúng độc lập. Promise.all() khởi động cả 3 song song, chờ tất cả xong, tổng thời gian ≈ call chậm nhất. Nhược điểm Promise.all: nó fail-fast — một Promise reject là cả nhóm reject (các kết quả khác bị bỏ). Khi cần "chờ tất cả bất kể lỗi" dùng Promise.allSettled; khi cần giới hạn đồng thời (rate limit) thì dùng batching/p-limit thay vì bắn hết một lúc.',
                rubric: [
                  { id: 'c1', criterion: 'await-trong-loop là tuần tự (tổng thời gian cộng dồn)', weight: 0.3 },
                  { id: 'c2', criterion: 'Promise.all chạy song song, thời gian ≈ call chậm nhất', weight: 0.3 },
                  { id: 'c3', criterion: 'Nêu fail-fast của Promise.all + allSettled', weight: 0.25 },
                  { id: 'c4', criterion: 'Nhắc giới hạn concurrency khi cần (rate limit)', weight: 0.15 },
                ],
                mustMention: ['promise.all', 'song song', 'tuần tự'],
                shouldMention: ['allsettled', 'fail-fast', 'concurrency', 'batching'],
                redFlags: ['await trong vòng lặp chạy song song', 'Promise.all tạo nhiều thread'],
                synonyms: { 'song song': ['parallel', 'đồng thời', 'concurrent'], 'tuần tự': ['sequential', 'lần lượt'], 'promise.all': ['promiseall'] },
                tags: ['async', 'promise-all', 'concurrency'],
              },
            ],
          },
          {
            slug: 'stream-backpressure', name: 'Stream backpressure',
            questions: [
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Backpressure trong Node streams là gì? Vì sao `source.pipe(dest)` xử lý được nó, còn tự đọc rồi ghi thủ công thì dễ gây tràn bộ nhớ?',
                referenceAnswer: 'Backpressure là cơ chế điều tiết khi bên tiêu thụ (writable) chậm hơn bên sản xuất (readable): nếu cứ đọc và ghi mà không quan tâm, dữ liệu dồn vào buffer nội bộ và RAM phình ra. pipe() tự động xử lý: khi dest.write() trả về false (buffer đầy, vượt highWaterMark), pipe pause() source, và resume() khi dest phát sự kiện "drain". Khi tự viết vòng lặp read→write mà bỏ qua giá trị trả về của write() và sự kiện drain, bạn ghi nhanh hơn khả năng tiêu thụ → buffer tăng vô hạn, dẫn tới tốn RAM/OOM.',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa backpressure (producer nhanh hơn consumer)', weight: 0.3 },
                  { id: 'c2', criterion: 'pipe() pause/resume dựa trên write()===false + drain', weight: 0.35 },
                  { id: 'c3', criterion: 'Nêu highWaterMark / buffer', weight: 0.15 },
                  { id: 'c4', criterion: 'Hậu quả bỏ qua backpressure: RAM/OOM', weight: 0.2 },
                ],
                mustMention: ['backpressure', 'pipe', 'drain'],
                shouldMention: ['highwatermark', 'buffer', 'writable', 'readable'],
                redFlags: ['stream không bao giờ tốn RAM', 'pipe làm dữ liệu chạy nhanh hơn'],
                synonyms: { 'backpressure': ['back pressure', 'áp lực ngược', 'điều tiết luồng'], 'drain': ['sự kiện drain'], 'pipe': ['.pipe', 'ống dẫn'] },
                tags: ['streams', 'backpressure', 'memory'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'database', name: 'Database Engineer', nameVi: 'Cơ sở dữ liệu', domainSlug: 'backend',
    topics: [
      {
        slug: 'db-indexing', name: 'Indexing', nameVi: 'Đánh chỉ mục', weight: 3,
        concepts: [
          {
            slug: 'btree-index', name: 'B-tree index behavior',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'B-tree index giúp tăng tốc truy vấn như thế nào? Nêu vài trường hợp index KHÔNG được sử dụng dù cột đã có index.',
                referenceAnswer: 'B-tree lưu khoá đã sắp xếp theo cây cân bằng, cho phép tìm kiếm/khoảng/sắp xếp với độ phức tạp O(log n) thay vì quét toàn bảng O(n). Index không được dùng khi: (1) hàm/biến đổi trên cột (WHERE lower(col)=... ) trừ khi có functional index; (2) leading wildcard LIKE \'%abc\'; (3) kiểu dữ liệu không khớp/ép kiểu ngầm; (4) độ chọn lọc thấp — optimizer thấy quét bảng rẻ hơn; (5) OR trên các cột khác nhau. Khi đó phải xem EXPLAIN để biết plan thực tế.',
                rubric: [
                  { id: 'c1', criterion: 'B-tree = khoá sắp xếp, tra cứu O(log n) thay vì full scan', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu hỗ trợ range + order by nhờ tính đã sắp xếp', weight: 0.2 },
                  { id: 'c3', criterion: 'Ít nhất 2 trường hợp index bị bỏ qua (function, leading wildcard, low selectivity, ép kiểu)', weight: 0.35 },
                  { id: 'c4', criterion: 'Nhắc dùng EXPLAIN để kiểm chứng', weight: 0.15 },
                ],
                mustMention: ['b-tree', 'sắp xếp', 'full scan'],
                shouldMention: ['explain', 'selectivity', 'wildcard', 'o(log n)'],
                redFlags: ['index luôn được dùng nếu cột có index', 'index làm ghi nhanh hơn'],
                synonyms: { 'b-tree': ['btree', 'b tree', 'cây b'], 'full scan': ['seq scan', 'quét toàn bảng', 'sequential scan'], 'sắp xếp': ['sorted', 'đã sắp xếp'] },
                tags: ['indexing', 'btree', 'query-plan'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Với composite index (a, b, c), thứ tự cột quan trọng ra sao? Giải thích "leftmost prefix" và cho biết truy vấn nào dùng được index này, truy vấn nào thì không.',
                referenceAnswer: 'Composite index sắp xếp theo a, rồi b, rồi c. Nguyên tắc leftmost prefix: index chỉ hữu ích khi truy vấn dùng một tiền tố liên tục từ trái: (a), (a,b), (a,b,c). WHERE a=? dùng được; a=? AND b=? dùng được; a=? AND b=? AND c=? tối ưu nhất. Nhưng WHERE b=? (bỏ a) KHÔNG dùng được index (thiếu cột dẫn đầu); a=? AND c=? chỉ dùng được phần a rồi lọc c. Range trên cột giữa (a=? AND b>? AND c=?) làm phần sau c không tận dụng được thứ tự. Vì vậy đặt cột equality trước, range sau, và cột chọn lọc cao/thường lọc lên đầu.',
                rubric: [
                  { id: 'c1', criterion: 'Index sắp theo thứ tự cột a→b→c', weight: 0.25 },
                  { id: 'c2', criterion: 'Giải thích đúng leftmost prefix', weight: 0.35 },
                  { id: 'c3', criterion: 'Ví dụ truy vấn dùng được vs không (bỏ cột dẫn đầu)', weight: 0.25 },
                  { id: 'c4', criterion: 'Nhắc equality trước range sau', weight: 0.15 },
                ],
                mustMention: ['leftmost prefix', 'thứ tự cột'],
                shouldMention: ['equality', 'range', 'composite index', 'selectivity'],
                redFlags: ['thứ tự cột trong composite index không quan trọng', 'index dùng được với mọi cột riêng lẻ'],
                synonyms: { 'leftmost prefix': ['left-most prefix', 'tiền tố trái', 'prefix trái nhất'], 'thứ tự cột': ['column order', 'thứ tự các cột'], 'composite index': ['index tổng hợp', 'multi-column index'] },
                tags: ['indexing', 'composite-index', 'leftmost-prefix'],
              },
            ],
          },
          {
            slug: 'index-tradeoffs', name: 'Index trade-offs',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Vì sao KHÔNG nên đánh index cho mọi cột? Nêu các chi phí của việc thêm index.',
                referenceAnswer: 'Mỗi index là một cấu trúc phải được cập nhật cùng dữ liệu: INSERT/UPDATE/DELETE trở nên chậm hơn vì phải sửa cả bảng lẫn từng index. Index tốn dung lượng đĩa và RAM (cache). Quá nhiều index còn làm query planner cân nhắc lâu hơn và đôi khi chọn nhầm. Index trên cột chọn lọc thấp (ví dụ boolean) gần như vô dụng. Vì vậy chỉ đánh index theo truy vấn thực tế (đo bằng EXPLAIN / slow query log), ưu tiên cột lọc/join/sort có độ chọn lọc cao.',
                rubric: [
                  { id: 'c1', criterion: 'Index làm chậm ghi (INSERT/UPDATE/DELETE)', weight: 0.35 },
                  { id: 'c2', criterion: 'Tốn dung lượng đĩa/RAM', weight: 0.25 },
                  { id: 'c3', criterion: 'Index cột chọn lọc thấp vô dụng', weight: 0.2 },
                  { id: 'c4', criterion: 'Đánh index theo truy vấn thực tế (đo lường)', weight: 0.2 },
                ],
                mustMention: ['ghi', 'dung lượng', 'chọn lọc'],
                shouldMention: ['insert', 'update', 'selectivity', 'slow query'],
                redFlags: ['thêm index luôn tốt', 'index không ảnh hưởng tốc độ ghi'],
                synonyms: { 'ghi': ['write', 'insert', 'update', 'ghi dữ liệu'], 'dung lượng': ['disk', 'storage', 'bộ nhớ đĩa'], 'chọn lọc': ['selectivity', 'độ chọn lọc'] },
                tags: ['indexing', 'trade-offs', 'write-cost'],
              },
            ],
          },
        ],
      },
      {
        slug: 'db-transactions', name: 'Transactions & Isolation', nameVi: 'Giao dịch & cô lập', weight: 2,
        concepts: [
          {
            slug: 'isolation-levels', name: 'Isolation levels',
            questions: [
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Kể các mức isolation (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) và anomaly mà mỗi mức ngăn được (dirty read, non-repeatable read, phantom read).',
                referenceAnswer: 'Từ lỏng đến chặt: READ UNCOMMITTED cho phép dirty read (đọc dữ liệu chưa commit). READ COMMITTED chặn dirty read nhưng còn non-repeatable read (đọc lại cùng hàng ra giá trị khác vì transaction khác đã commit). REPEATABLE READ chặn thêm non-repeatable read (cùng hàng đọc lại nhất quán) nhưng lý thuyết còn phantom read (query theo điều kiện ra thêm/bớt hàng); một số engine như InnoDB dùng gap lock/MVCC hạn chế phantom. SERIALIZABLE chặn tất cả, như thể các transaction chạy tuần tự, đổi lại giảm concurrency và dễ deadlock/serialization failure.',
                rubric: [
                  { id: 'c1', criterion: 'Xếp đúng 4 mức từ lỏng đến chặt', weight: 0.25 },
                  { id: 'c2', criterion: 'Dirty read ↔ READ UNCOMMITTED', weight: 0.2 },
                  { id: 'c3', criterion: 'Non-repeatable read ↔ READ COMMITTED cho phép, REPEATABLE READ chặn', weight: 0.3 },
                  { id: 'c4', criterion: 'Phantom read ↔ SERIALIZABLE (hoặc gap lock)', weight: 0.25 },
                ],
                mustMention: ['dirty read', 'non-repeatable read', 'phantom'],
                shouldMention: ['serializable', 'repeatable read', 'mvcc', 'read committed'],
                redFlags: ['SERIALIZABLE nhanh hơn READ COMMITTED', 'isolation level không ảnh hưởng tính đúng đắn'],
                synonyms: { 'dirty read': ['đọc bẩn', 'dirty-read'], 'non-repeatable read': ['non repeatable read', 'đọc không lặp lại được'], 'phantom': ['phantom read', 'đọc ma', 'bóng ma'] },
                tags: ['transactions', 'isolation', 'anomalies'],
              },
              {
                level: 'MID', difficulty: 3,
                body: 'READ COMMITTED nghĩa là gì? Mô tả một tình huống non-repeatable read xảy ra ở mức này.',
                referenceAnswer: 'READ COMMITTED: mỗi câu lệnh chỉ nhìn thấy dữ liệu đã được commit tại thời điểm câu lệnh đó bắt đầu — không đọc dữ liệu chưa commit (không dirty read). Nhưng vì mỗi statement lấy snapshot mới, trong cùng một transaction đọc cùng một hàng hai lần có thể ra giá trị khác nếu giữa hai lần đọc có transaction khác commit thay đổi — đó là non-repeatable read. Ví dụ: T1 đọc balance=100; T2 update balance=50 rồi commit; T1 đọc lại balance=50 trong cùng transaction.',
                rubric: [
                  { id: 'c1', criterion: 'READ COMMITTED chỉ thấy dữ liệu đã commit (không dirty read)', weight: 0.4 },
                  { id: 'c2', criterion: 'Định nghĩa non-repeatable read', weight: 0.3 },
                  { id: 'c3', criterion: 'Ví dụ cụ thể có hai lần đọc khác nhau', weight: 0.3 },
                ],
                mustMention: ['committed', 'non-repeatable'],
                shouldMention: ['snapshot', 'dirty read', 'commit'],
                redFlags: ['READ COMMITTED cho phép đọc dữ liệu chưa commit'],
                synonyms: { 'committed': ['đã commit', 'read committed'], 'non-repeatable': ['non repeatable read', 'đọc không lặp lại'] },
                tags: ['transactions', 'read-committed'],
              },
            ],
          },
        ],
      },
      {
        slug: 'db-nplusone', name: 'N+1 Query', nameVi: 'Truy vấn N+1', weight: 2,
        concepts: [
          {
            slug: 'n-plus-one', name: 'The N+1 query problem',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'N+1 query problem là gì? Cho một ví dụ cụ thể và nêu cách khắc phục.',
                referenceAnswer: 'N+1 xảy ra khi bạn chạy 1 truy vấn lấy N bản ghi, rồi lặp qua từng bản ghi chạy thêm 1 truy vấn con → tổng 1 + N truy vấn. Ví dụ: lấy 100 bài viết (1 query) rồi với mỗi bài query tác giả (100 query) = 101 round-trip tới DB, rất chậm. Khắc phục: dùng JOIN để lấy một lần; hoặc eager-load/include của ORM; hoặc gom id rồi query IN (...) một lần (batching, dataloader). Mấu chốt là biến N truy vấn con thành 1 truy vấn theo lô.',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa 1 + N truy vấn (query trong vòng lặp)', weight: 0.4 },
                  { id: 'c2', criterion: 'Ví dụ cụ thể (list + quan hệ con)', weight: 0.25 },
                  { id: 'c3', criterion: 'Khắc phục: JOIN / eager load / IN batching', weight: 0.35 },
                ],
                mustMention: ['n+1', 'join', 'vòng lặp'],
                shouldMention: ['eager', 'batching', 'dataloader', 'in ('],
                redFlags: ['N+1 là tính năng tối ưu', 'thêm index sửa được N+1'],
                synonyms: { 'n+1': ['n + 1', 'n plus one', 'n cộng 1'], 'join': ['phép join', 'nối bảng'], 'vòng lặp': ['loop', 'lặp'] },
                tags: ['n-plus-one', 'orm', 'performance'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Vì sao ORM rất dễ vô tình tạo N+1? Phân biệt eager vs lazy loading và khi nào JOIN không phải lựa chọn tốt (dùng batch/dataloader thay thế).',
                referenceAnswer: 'ORM ánh xạ quan hệ thành thuộc tính, nên truy cập order.customer trong vòng lặp trông như đọc thuộc tính nhưng thực chất bắn một query — lazy loading ẩn chi phí. Eager loading (include/join fetch) tải quan hệ ngay từ đầu, tránh N+1 nhưng nếu JOIN nhiều quan hệ one-to-many sẽ nhân bản hàng (cartesian) và truyền dữ liệu dư. Khi đó batch loading (gom khoá, một query IN mỗi quan hệ, như DataLoader) thường tốt hơn: giữ số query nhỏ mà không nhân bản. Chọn JOIN cho quan hệ to-one hoặc lọc; batch cho nhiều collection.',
                rubric: [
                  { id: 'c1', criterion: 'Lazy loading ẩn query sau truy cập thuộc tính → dễ N+1', weight: 0.3 },
                  { id: 'c2', criterion: 'Phân biệt eager vs lazy', weight: 0.25 },
                  { id: 'c3', criterion: 'JOIN one-to-many gây nhân bản hàng (cartesian)', weight: 0.25 },
                  { id: 'c4', criterion: 'Batch/dataloader là giải pháp cho nhiều collection', weight: 0.2 },
                ],
                mustMention: ['lazy', 'eager', 'batch'],
                shouldMention: ['dataloader', 'cartesian', 'join fetch', 'include'],
                redFlags: ['JOIN luôn là cách tốt nhất cho mọi quan hệ', 'ORM không bao giờ gây N+1'],
                synonyms: { 'lazy': ['lazy loading', 'tải lười'], 'eager': ['eager loading', 'tải sớm'], 'batch': ['batching', 'gom lô', 'theo lô'] },
                tags: ['n-plus-one', 'orm', 'eager-lazy'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'behavioral', name: 'Behavioral (STAR)', nameVi: 'Hành vi (STAR)', domainSlug: 'general',
    topics: [
      {
        slug: 'bhv-conflict', name: 'Conflict & Disagreement', nameVi: 'Xung đột & bất đồng', weight: 2,
        concepts: [
          {
            slug: 'star-conflict', name: 'Handling technical disagreement',
            questions: [
              {
                level: 'MID', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về một lần bạn bất đồng với đồng nghiệp hoặc quản lý về một quyết định kỹ thuật. Bạn đã xử lý thế nào và kết quả ra sao? (Trả lời theo cấu trúc STAR)',
                referenceAnswer: 'Một câu trả lời mạnh theo STAR: Situation — nêu bối cảnh cụ thể (dự án, thời điểm, các bên). Task — vai trò và điều bạn cần đạt. Action — hành động CỦA BẠN: lắng nghe quan điểm đối phương, đưa dữ liệu/benchmark thay vì cãi cảm tính, đề xuất thử nghiệm nhỏ (spike/POC) để so sánh khách quan, hoặc leo thang đúng cách. Result — kết quả có số liệu (giảm latency X%, quyết định được chốt, quan hệ vẫn tốt) và bài học. Điểm mấu chốt: tôn trọng, dựa trên bằng chứng, không biến bất đồng thành cá nhân.',
                rubric: [
                  { id: 'c1', criterion: 'Situation: bối cảnh cụ thể, không chung chung', weight: 0.2 },
                  { id: 'c2', criterion: 'Task: vai trò/mục tiêu của bản thân rõ ràng', weight: 0.15 },
                  { id: 'c3', criterion: 'Action: hành động cụ thể, dựa trên dữ liệu/thử nghiệm, tôn trọng', weight: 0.35 },
                  { id: 'c4', criterion: 'Result: kết quả có số liệu + bài học rút ra', weight: 0.3 },
                ],
                mustMention: ['bối cảnh', 'hành động', 'kết quả'],
                shouldMention: ['dữ liệu', 'bài học', 'lắng nghe', 'thử nghiệm'],
                redFlags: ['tôi luôn đúng', 'đồng nghiệp kém nên tôi mặc kệ', 'không bao giờ có bất đồng'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống', 'hoàn cảnh'], 'hành động': ['action', 'việc tôi làm'], 'kết quả': ['result', 'kết cục', 'outcome'] },
                tags: ['behavioral', 'star', 'conflict'],
              },
              {
                level: 'SENIOR', difficulty: 4, type: 'BEHAVIORAL',
                body: 'Kể về lần bạn phải thuyết phục cả team đi theo một hướng kỹ thuật mà ban đầu đa số phản đối. Bạn xây dựng sự đồng thuận như thế nào? (STAR)',
                referenceAnswer: 'Câu trả lời mạnh cho thấy lãnh đạo qua ảnh hưởng chứ không áp đặt: Situation — quyết định có rủi ro cao, team nghi ngờ. Action — hiểu vì sao họ phản đối (lắng nghe từng lo ngại), làm POC/benchmark để chứng minh, chia rủi ro thành bước nhỏ có thể rollback, mời người phản đối nhất cùng review, minh bạch về trade-off. Result — team đồng thuận (không chỉ tuân lệnh), kết quả đo được, và quan trọng là quy trình ra quyết định tốt hơn cho lần sau. Tránh: "tôi là senior nên họ phải nghe".',
                rubric: [
                  { id: 'c1', criterion: 'Situation + Task rõ, rủi ro/độ khó cụ thể', weight: 0.2 },
                  { id: 'c2', criterion: 'Action: lắng nghe phản đối + bằng chứng (POC/benchmark)', weight: 0.35 },
                  { id: 'c3', criterion: 'Xây đồng thuận (không áp đặt quyền lực)', weight: 0.25 },
                  { id: 'c4', criterion: 'Result đo được + bài học về quy trình', weight: 0.2 },
                ],
                mustMention: ['bối cảnh', 'hành động', 'kết quả'],
                shouldMention: ['đồng thuận', 'benchmark', 'lắng nghe', 'trade-off'],
                redFlags: ['tôi là senior nên họ phải nghe', 'ép team làm theo'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống'], 'hành động': ['action', 'việc tôi làm'], 'kết quả': ['result', 'outcome'], 'đồng thuận': ['consensus', 'nhất trí'] },
                tags: ['behavioral', 'star', 'influence'],
              },
            ],
          },
        ],
      },
      {
        slug: 'bhv-failure', name: 'Failure & Ownership', nameVi: 'Thất bại & trách nhiệm', weight: 2,
        concepts: [
          {
            slug: 'star-failure', name: 'Learning from failure',
            questions: [
              {
                level: 'MID', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về một nhiệm vụ hoặc dự án bạn từng thất bại. Điều gì đã xảy ra và bạn học được gì? (STAR)',
                referenceAnswer: 'Câu trả lời mạnh dám nhận một thất bại THẬT (không phải "điểm yếu là quá cầu toàn"): Situation — điều gì đã sai, hậu quả cụ thể. Task — trách nhiệm của bạn. Action — bạn đã làm gì để xử lý/giảm thiệt hại và NHẬN phần lỗi của mình thay vì đổ cho hoàn cảnh. Result — bài học cụ thể và thay đổi hành vi đo được ở lần sau (ví dụ thêm test, đổi quy trình review, giao tiếp sớm hơn). Nhà tuyển dụng đánh giá sự tự nhận thức và khả năng học, không phải sự hoàn hảo.',
                rubric: [
                  { id: 'c1', criterion: 'Thừa nhận thất bại thật + hậu quả cụ thể', weight: 0.3 },
                  { id: 'c2', criterion: 'Nhận trách nhiệm (không đổ lỗi hoàn toàn cho ngoại cảnh)', weight: 0.3 },
                  { id: 'c3', criterion: 'Hành động khắc phục cụ thể', weight: 0.2 },
                  { id: 'c4', criterion: 'Bài học + thay đổi hành vi đo được sau đó', weight: 0.2 },
                ],
                mustMention: ['bối cảnh', 'trách nhiệm', 'bài học'],
                shouldMention: ['hành động', 'kết quả', 'thay đổi'],
                redFlags: ['tôi chưa từng thất bại', 'toàn bộ là lỗi người khác', 'điểm yếu của tôi là quá cầu toàn'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống'], 'trách nhiệm': ['ownership', 'nhận lỗi', 'phần lỗi'], 'bài học': ['lesson', 'điều học được'] },
                tags: ['behavioral', 'star', 'failure'],
              },
            ],
          },
          {
            slug: 'star-ownership', name: 'Taking ownership beyond scope',
            questions: [
              {
                level: 'SENIOR', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về lần bạn chủ động nhận trách nhiệm giải quyết một vấn đề nằm ngoài phạm vi được giao. (STAR)',
                referenceAnswer: 'Câu trả lời mạnh thể hiện ownership: Situation — vấn đề không ai "sở hữu" (ví dụ flaky test, sự cố prod, nợ kỹ thuật) đang gây hại. Action — bạn chủ động đứng ra: điều tra, huy động đúng người, sửa gốc rễ chứ không vá tạm, và tài liệu hoá để không tái diễn. Result — tác động đo được (giảm sự cố, tiết kiệm thời gian team) và việc bạn nâng chuẩn chung. Tránh khoe khoang cá nhân — nhấn mạnh tác động tới team/sản phẩm.',
                rubric: [
                  { id: 'c1', criterion: 'Vấn đề ngoài phạm vi, không ai sở hữu, có tác hại', weight: 0.25 },
                  { id: 'c2', criterion: 'Chủ động đứng ra + hành động cụ thể (sửa gốc rễ)', weight: 0.35 },
                  { id: 'c3', criterion: 'Kết quả đo được cho team/sản phẩm', weight: 0.25 },
                  { id: 'c4', criterion: 'Tài liệu hoá/nâng chuẩn để không tái diễn', weight: 0.15 },
                ],
                mustMention: ['chủ động', 'hành động', 'kết quả'],
                shouldMention: ['gốc rễ', 'tác động', 'tài liệu'],
                redFlags: ['tôi làm hết một mình để được ghi nhận', 'vá tạm cho xong'],
                synonyms: { 'chủ động': ['proactive', 'tự nguyện', 'đứng ra'], 'hành động': ['action', 'việc làm'], 'kết quả': ['result', 'tác động', 'outcome'] },
                tags: ['behavioral', 'star', 'ownership'],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  let domains = 0, tracks = 0, topics = 0, concepts = 0, questions = 0, skipped = 0, companies = 0;

  for (const d of DOMAINS) {
    await prisma.interviewDomain.upsert({
      where: { slug: d.slug },
      update: { name: d.name, nameVi: d.nameVi, icon: d.icon },
      create: { slug: d.slug, name: d.name, nameVi: d.nameVi, icon: d.icon, status: 'PUBLISHED' },
    });
    domains++;
  }

  for (const cp of COMPANY_PROFILES) {
    await prisma.interviewCompanyProfile.upsert({
      where: { slug: cp.slug },
      update: { name: cp.name, styleDescriptor: cp.styleDescriptor, rigor: cp.rigor },
      create: { slug: cp.slug, name: cp.name, styleDescriptor: cp.styleDescriptor, rigor: cp.rigor, status: 'PUBLISHED' },
    });
    companies++;
  }

  for (const t of TRACKS) {
    const domain = await prisma.interviewDomain.findUnique({ where: { slug: t.domainSlug } });
    if (!domain) continue;
    const track = await prisma.interviewTrack.upsert({
      where: { slug: t.slug },
      update: { name: t.name, nameVi: t.nameVi, domainId: domain.id },
      create: { slug: t.slug, name: t.name, nameVi: t.nameVi, domainId: domain.id, status: 'PUBLISHED' },
    });
    tracks++;

    for (const tp of t.topics) {
      const topic = await prisma.interviewTopic.upsert({
        where: { slug: tp.slug },
        update: { name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id },
        create: { slug: tp.slug, name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id, status: 'PUBLISHED' },
      });
      topics++;

      for (const cSeed of tp.concepts) {
        const concept = await prisma.interviewConcept.upsert({
          where: { slug: cSeed.slug },
          update: { name: cSeed.name, topicId: topic.id },
          create: { slug: cSeed.slug, name: cSeed.name, topicId: topic.id },
        });
        concepts++;

        for (const q of cSeed.questions) {
          const exists = await prisma.interviewQuestion.findFirst({ where: { topicId: topic.id, body: q.body } });
          if (exists) { skipped++; continue; }
          await prisma.interviewQuestion.create({
            data: {
              topicId: topic.id,
              conceptId: concept.id,
              level: q.level,
              type: q.type ?? 'CONCEPTUAL',
              difficulty: q.difficulty ?? 3,
              body: q.body,
              bodyVi: q.body,
              referenceAnswer: q.referenceAnswer,
              rubric: q.rubric as never,
              mustMention: q.mustMention,
              shouldMention: q.shouldMention ?? [],
              redFlags: q.redFlags ?? [],
              synonyms: (q.synonyms ?? {}) as never,
              tags: q.tags ?? [],
              source: 'SEED',
              status: 'PUBLISHED',
              rubricReviewed: false, // ← human must review; flagged low-confidence
            },
          });
          questions++;
        }
      }
    }
  }

  console.log(`[seed:interview] domains=${domains} companies=${companies} tracks=${tracks} topics=${topics} concepts=${concepts} questions +${questions} (skipped existing ${skipped})`);
  console.log('[seed:interview] NOTE: every seeded rubric is rubricReviewed=false — a human must rewrite them before they count.');
}

main()
  .catch((e) => { console.error('[seed:interview] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
