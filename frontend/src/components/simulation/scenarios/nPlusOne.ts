/**
 * Kịch bản 9 — Bẫy N+1 query.
 *
 * Lỗi hiệu năng phổ biến nhất trong mọi dự án dùng ORM, và cũng là lỗi khó
 * thấy nhất: code đọc rất sạch, không có vòng lặp nào trông đáng ngờ, mỗi
 * truy vấn riêng lẻ đều nhanh. Chỉ khi đếm SỐ LƯỢT đi về mới lộ ra.
 *
 * Hoạt hình hợp với bài này hơn mọi biểu đồ: người xem đếm được từng lượt
 * gói tin chạy qua chạy lại, và hiểu ngay "nhanh" không giống "ít lượt".
 */

import { Repeat } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'api', label: 'API', kind: 'server' as const, x: 110, y: 300, sublabel: { vi: 'GET /posts', en: 'GET /posts' } },
  { id: 'orm', label: 'Prisma', kind: 'server' as const, x: 400, y: 300, sublabel: { vi: 'Sinh SQL · pool', en: 'Builds SQL · pool' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 700, y: 300, sublabel: { vi: 'posts · users', en: 'posts · users' } },
  { id: 'cache', label: 'Redis', kind: 'cache' as const, x: 950, y: 300, sublabel: { vi: 'Đệm kết quả', en: 'Result cache' } },
];

const edges = [
  { id: 'e_api_orm', from: 'api', to: 'orm' },
  { id: 'e_orm_db', from: 'orm', to: 'db' },
  { id: 'e_db_cache', from: 'db', to: 'cache', ghost: true },
];

export const nPlusOneScenario: Scenario = {
  id: 'n-plus-one',
  name: { vi: 'Bẫy N+1 query', en: 'The N+1 query trap' },
  tagline: {
    vi: 'Cùng một trang, cùng một kết quả: 21 lượt đi về so với 1. Đếm bằng mắt xem thời gian bốc hơi ở đâu.',
    en: 'Same page, same result: 21 round trips versus one. Watch with your own eyes where the time evaporates.',
  },
  icon: Repeat,
  accent: '#38bdf8',
  nodes,
  edges,
  options: [
    {
      id: 'pattern',
      label: { vi: 'Cách viết truy vấn', en: 'Query style' },
      defaultValue: 'naive',
      choices: [
        { value: 'naive', label: 'Vòng lặp (N+1)', color: '#f43f5e', hint: { vi: 'Trông sạch nhưng 21 lượt đi về', en: 'Reads clean, costs 21 round trips' } },
        { value: 'include', label: 'include / JOIN', color: '#34d399', hint: { vi: 'Một lượt duy nhất', en: 'One single round trip' } },
        { value: 'batch', label: 'DataLoader (gom lô)', color: '#a855f7', hint: { vi: 'Cứu tinh của GraphQL', en: 'The GraphQL rescue' } },
      ],
    },
    {
      id: 'rows',
      label: { vi: 'Số bài trên trang', en: 'Rows per page' },
      defaultValue: '20',
      choices: [
        { value: '20', label: '20 bài', color: '#38bdf8' },
        { value: '200', label: '200 bài', color: '#fb923c', hint: { vi: 'Xem chi phí tăng tuyến tính', en: 'Watch the cost grow linearly' } },
      ],
    },
  ],

  build({ pattern = 'naive', rows = '20' }) {
    const n = Number(rows);
    const steps: SimStep[] = [];
    // 1,2ms cho mỗi lượt đi về (mạng nội bộ + phân tích cú pháp + lập kế hoạch).
    const perTrip = 1.2;

    steps.push({
      id: 'req',
      edge: 'e_api_orm',
      kind: 'GET',
      duration: 1100,
      latencyMs: 1,
      packetLabel: 'GET /posts',
      title: { vi: 'Cần danh sách bài viết kèm tên tác giả', en: 'Need a list of posts with author names' },
      detail: {
        vi: `Yêu cầu rất bình thường: ${n} bài viết, mỗi bài hiện tên và ảnh đại diện tác giả. Cách bạn viết đoạn code này quyết định trang tải trong 3 mili giây hay 250 mili giây — trong khi kết quả trả về giống hệt nhau.`,
        en: `An entirely ordinary requirement: ${n} posts, each showing its author's name and avatar. How you write this decides whether the page takes 3 milliseconds or 250 — while the result is byte-for-byte identical.`,
      },
      nodeStates: { api: 'active', orm: 'processing' },
      sfx: 'swoosh',
    });

    /* ── Nhánh N+1 ────────────────────────────────────────────── */
    if (pattern === 'naive') {
      steps.push({
        id: 'q1',
        edge: 'e_orm_db',
        kind: 'QUERY',
        duration: 1100,
        latencyMs: perTrip,
        packetLabel: 'SELECT posts',
        title: { vi: 'Truy vấn 1: lấy danh sách bài', en: 'Query 1: fetch the posts' },
        detail: {
          vi: 'Truy vấn đầu tiên hoàn toàn ổn — nhanh, có chỉ mục, lấy về đúng thứ cần. Đây là chữ "1" trong N+1. Vấn đề chưa xuất hiện; nó nằm ở dòng code ngay phía dưới.',
          en: 'The first query is perfectly fine — fast, indexed, returns exactly what is needed. This is the "1" in N+1. Nothing is wrong yet; the problem lives in the line of code just below it.',
        },
        payload: { sql: 'SELECT id, title, author_id FROM posts ORDER BY created_at DESC LIMIT ' + n, rows: n },
        nodeStates: { db: 'processing' },
        sfx: 'blip',
      });

      steps.push({
        id: 'loop-code',
        at: 'orm',
        kind: 'INTERNAL',
        duration: 1400,
        title: { vi: 'Đoạn code trông vô hại', en: 'The innocent-looking code' },
        detail: {
          vi: 'for (const post of posts) { post.author = await prisma.user.findUnique({ where: { id: post.authorId } }) }\n\nĐọc lên nghe rất hợp lý và không có gì báo động. Nhưng mỗi vòng lặp là một lượt đi về CSDL riêng biệt. Vòng lặp không tạo ra "một truy vấn có vòng lặp" — nó tạo ra N truy vấn.',
          en: 'for (const post of posts) { post.author = await prisma.user.findUnique({ where: { id: post.authorId } }) }\n\nIt reads perfectly reasonably and nothing raises an alarm. But every iteration is its own round trip to the database. The loop does not create "one query with a loop" — it creates N queries.',
        },
        nodeStates: { orm: 'error' },
        sfx: 'buzz',
        teachingNote: {
          vi: 'Hỏi lớp: "đoạn này sai ở đâu?" Hầu như không ai chỉ ra được khi chỉ nhìn code. Đó chính là lý do N+1 sống sót qua code review.',
          en: 'Ask the room: "what is wrong here?" Almost nobody spots it from the code alone. That is exactly why N+1 survives code review.',
        },
      });

      // Ba lượt minh hoạ, kèm các gói tin phụ để thấy "còn nữa".
      steps.push({
        id: 'q2',
        edge: 'e_orm_db',
        kind: 'QUERY',
        duration: 900,
        latencyMs: perTrip,
        packetLabel: 'SELECT user #1',
        title: { vi: 'Truy vấn 2: tác giả của bài thứ nhất', en: 'Query 2: author of post #1' },
        detail: {
          vi: 'Một truy vấn tí hon: lấy đúng một dòng theo khoá chính, mất 0,3ms trong CSDL. Nhìn riêng nó thì không có gì để tối ưu. Chi phí thật không nằm ở truy vấn mà ở LƯỢT ĐI VỀ bao quanh nó.',
          en: 'A tiny query: one row by primary key, 0.3ms inside the database. In isolation there is nothing to optimise. The real cost is not the query, it is the ROUND TRIP wrapped around it.',
        },
        payload: { sql: 'SELECT id, name, avatar FROM users WHERE id = $1', params: [7] },
        nodeStates: { db: 'processing' },
        sfx: 'blip',
      });

      steps.push({
        id: 'q3',
        edge: 'e_orm_db',
        kind: 'QUERY',
        duration: 750,
        latencyMs: perTrip,
        packetLabel: 'SELECT user #2',
        alsoInFlight: [{ edge: 'e_orm_db', at: 0.35, label: 'user #3' }],
        title: { vi: 'Truy vấn 3, 4, 5… lặp lại y hệt', en: 'Query 3, 4, 5… the same again' },
        detail: {
          vi: 'Tệ hơn nữa: nhiều bài viết chung một tác giả, nên cùng một dòng dữ liệu bị hỏi đi hỏi lại. Prisma không tự gom lại giúp bạn — nó thực thi đúng những gì bạn viết.',
          en: 'Worse still: several posts share an author, so the same row is fetched over and over. Prisma will not deduplicate for you — it executes exactly what you wrote.',
        },
        nodeStates: { db: 'processing', orm: 'error' },
        sfx: 'blip',
      });

      steps.push({
        id: 'qn',
        edge: 'e_orm_db',
        kind: 'ERROR',
        duration: 1900,
        latencyMs: n * perTrip,
        packetLabel: `… còn ${n - 3} lượt nữa`,
        alsoInFlight: [
          { edge: 'e_orm_db', at: 0.25, label: 'user #k' },
          { edge: 'e_orm_db', at: 0.55, label: 'user #k+1' },
          { edge: 'e_orm_db', at: 0.8, label: 'user #k+2' },
        ],
        title: { vi: `Tổng cộng ${n + 1} lượt đi về`, en: `${n + 1} round trips in total` },
        detail: {
          vi: `Mỗi lượt tốn khoảng ${perTrip}ms cho mạng và việc lập kế hoạch, dù truy vấn chỉ mất 0,3ms. Với ${n} bài: khoảng ${Math.round((n + 1) * perTrip)}ms chỉ để đi lại. Chỉ số cần theo dõi KHÔNG phải "truy vấn chậm nhất" mà là "số truy vấn mỗi request" — công cụ APM nào cũng có, và nó phát hiện N+1 ngay lập tức.`,
          en: `Each trip costs roughly ${perTrip}ms of network and planning even though the query itself takes 0.3ms. With ${n} posts that is about ${Math.round((n + 1) * perTrip)}ms spent purely on travel. The metric to watch is NOT "slowest query" but "queries per request" — every APM exposes it, and it catches N+1 instantly.`,
        },
        payload: { queries: n + 1, dbTimeMs: +(n * 0.3).toFixed(1), roundTripMs: +((n + 1) * perTrip).toFixed(1) },
        nodeStates: { db: 'error', orm: 'error' },
        sfx: 'error',
        log: {
          vi: `prisma:query ×${n + 1} · tổng ${Math.round((n + 1) * perTrip)}ms · thời gian trong CSDL chỉ ${(n * 0.3).toFixed(1)}ms`,
          en: `prisma:query ×${n + 1} · total ${Math.round((n + 1) * perTrip)}ms · only ${(n * 0.3).toFixed(1)}ms spent inside the database`,
        },
        teachingNote: {
          vi: `Chốt lại: ${Math.round((n * 0.3 / ((n + 1) * perTrip)) * 100)}% thời gian nằm TRONG cơ sở dữ liệu, phần còn lại là đi lại. Tối ưu câu SQL ở đây là chữa nhầm bệnh.`,
          en: `The punchline: only ${Math.round((n * 0.3 / ((n + 1) * perTrip)) * 100)}% of the time is spent INSIDE the database; the rest is travel. Tuning the SQL here treats the wrong illness.`,
        },
      });

      steps.push({
        id: 'naive-res',
        edge: 'e_api_orm',
        reverse: true,
        kind: 'ERROR',
        duration: 1200,
        status: 200,
        latencyMs: Math.round((n + 1) * perTrip + 4),
        packetLabel: `200 OK · ${Math.round((n + 1) * perTrip + 4)}ms`,
        title: { vi: 'Trả về đúng dữ liệu, chỉ là chậm', en: 'The right data, just slowly' },
        detail: {
          vi: 'Không có lỗi nào để bắt, không có cảnh báo nào nổ, test vẫn xanh. N+1 chỉ hiện hình khi dữ liệu lớn lên hoặc lượng truy cập tăng — tức là đúng lúc bạn ít muốn gặp sự cố nhất.',
          en: 'No error to catch, no alert to fire, tests still green. N+1 only reveals itself once data grows or traffic rises — precisely when you least want an incident.',
        },
        nodeStates: { api: 'error' },
        sfx: 'buzz',
      });
      return steps;
    }

    /* ── Nhánh include / JOIN ─────────────────────────────────── */
    if (pattern === 'include') {
      steps.push({
        id: 'join',
        edge: 'e_orm_db',
        kind: 'QUERY',
        duration: 1400,
        latencyMs: 2.6,
        packetLabel: 'SELECT + JOIN',
        title: { vi: 'Một truy vấn duy nhất', en: 'One single query' },
        detail: {
          vi: 'prisma.post.findMany({ include: { author: true } }) — chỉ thêm một chữ, và N+1 biến mất. Prisma sinh ra một truy vấn có JOIN (hoặc hai truy vấn gom lô, tuỳ quan hệ), cầm về đủ dữ liệu trong MỘT lượt đi về.',
          en: 'prisma.post.findMany({ include: { author: true } }) — one added word and N+1 is gone. Prisma emits a single JOINed query (or two batched ones, depending on the relation) and brings everything back in ONE round trip.',
        },
        payload: {
          sql: `SELECT p.id, p.title, u.name, u.avatar FROM posts p JOIN users u ON u.id = p.author_id ORDER BY p.created_at DESC LIMIT ${n}`,
          rows: n,
        },
        nodeStates: { db: 'processing' },
        sfx: 'blip',
      });
      steps.push({
        id: 'join-done',
        at: 'db',
        kind: 'RESPONSE',
        duration: 1200,
        latencyMs: 2.6,
        title: { vi: `${n + 1} lượt → 1 lượt`, en: `${n + 1} round trips → 1` },
        detail: {
          vi: `Cùng dữ liệu, cùng kết quả, nhưng ${Math.round(((n + 1) * perTrip) / 2.6)} lần nhanh hơn — và quan trọng hơn: chi phí giờ gần như KHÔNG tăng theo số bài. Tăng từ 20 lên 200 bài chỉ làm câu JOIN nặng thêm chút ít, chứ không nhân đôi số lượt đi về.`,
          en: `Same data, same result, about ${Math.round(((n + 1) * perTrip) / 2.6)}× faster — and more importantly the cost barely grows with row count. Going from 20 to 200 posts makes the JOIN slightly heavier; it does not multiply the round trips.`,
        },
        payload: { queries: 1, totalMs: 2.6 },
        nodeStates: { db: 'success', orm: 'success' },
        sfx: 'ping',
        teachingNote: {
          vi: 'Cảnh báo ngược chiều: include lồng quá sâu (bài → tác giả → tổ chức → …) sinh ra JOIN khổng lồ và nhân bản dòng. Lấy đủ dùng, đừng lấy cho đã.',
          en: 'The counter-warning: deeply nested includes (post → author → org → …) produce monstrous JOINs and row explosion. Fetch what you render, not everything reachable.',
        },
      });
      steps.push({
        id: 'select',
        edge: 'e_api_orm',
        reverse: true,
        kind: 'RESPONSE',
        duration: 1200,
        status: 200,
        latencyMs: 6,
        packetLabel: '200 OK · 6ms',
        title: { vi: 'Nhớ kèm select — đừng lấy cả bảng', en: 'Pair it with select — do not haul whole rows' },
        detail: {
          vi: 'include mà không có select là lấy về MỌI cột, gồm cả passwordHash và những trường nặng bạn không dùng. Vừa tốn băng thông, vừa là rủi ro rò rỉ dữ liệu nếu quên lọc ở tầng tuần tự hoá. Chỉ chọn đúng cột cần hiển thị.',
          en: 'An include without a select pulls EVERY column, including passwordHash and heavy fields you never render. It wastes bandwidth and becomes a leak the moment someone forgets to filter at serialisation. Select only the columns you display.',
        },
        payload: { select: { id: true, title: true, author: { select: { name: true, avatar: true } } } },
        nodeStates: { api: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Nhánh DataLoader ─────────────────────────────────────── */
    steps.push({
      id: 'collect',
      at: 'orm',
      kind: 'INTERNAL',
      duration: 1400,
      title: { vi: 'Gom yêu cầu trong cùng một vòng lặp sự kiện', en: 'Collect requests within one event-loop tick' },
      detail: {
        vi: `Code vẫn viết theo kiểu vòng lặp — không phải sửa gì ở tầng nghiệp vụ. Nhưng thay vì gọi thẳng CSDL, mỗi lời gọi được đưa vào một hàng đợi tí hon. DataLoader chờ hết tick hiện tại của event loop rồi mới gom ${n} yêu cầu thành MỘT.`,
        en: `The business code still reads as a loop — nothing changes there. But instead of hitting the database, each call drops into a tiny queue. DataLoader waits for the current event-loop tick to drain, then merges all ${n} requests into ONE.`,
      },
      payload: { pending: n, willBatchInto: 1 },
      nodeStates: { orm: 'processing' },
      sfx: 'click',
      teachingNote: {
        vi: 'Đây là lý do DataLoader gắn liền với GraphQL: ở GraphQL bạn KHÔNG biết trước client sẽ hỏi những gì, nên không thể viết sẵn include. Gom lô tự động là cách duy nhất.',
        en: 'This is why DataLoader is inseparable from GraphQL: there you cannot know in advance what the client will ask for, so you cannot pre-write an include. Automatic batching is the only way.',
      },
    });

    steps.push({
      id: 'batched',
      edge: 'e_orm_db',
      kind: 'QUERY',
      duration: 1400,
      latencyMs: 2.9,
      packetLabel: 'WHERE id IN (…)',
      title: { vi: `Một truy vấn IN (…) thay cho ${n} truy vấn`, en: `One IN (…) query instead of ${n}` },
      detail: {
        vi: 'SELECT * FROM users WHERE id IN (7, 12, 31, …). DataLoader còn tự loại trùng: mười bài cùng một tác giả chỉ hỏi một lần. Trong cùng một request, mỗi khoá được nạp đúng một lần và mọi nơi dùng chung kết quả đó.',
        en: 'SELECT * FROM users WHERE id IN (7, 12, 31, …). DataLoader also deduplicates: ten posts by one author ask once. Within a request each key is loaded exactly once and every caller shares that result.',
      },
      payload: { sql: 'SELECT id, name, avatar FROM users WHERE id IN ($1..$k)', uniqueKeys: Math.ceil(n * 0.6), requested: n },
      nodeStates: { db: 'processing' },
      sfx: 'blip',
    });

    steps.push({
      id: 'batch-done',
      edge: 'e_api_orm',
      reverse: true,
      kind: 'CACHE_HIT',
      duration: 1300,
      status: 200,
      latencyMs: 7,
      packetLabel: '200 OK · 7ms',
      title: { vi: 'Giữ nguyên cách viết, mất hẳn N+1', en: 'Same code shape, N+1 gone' },
      detail: {
        vi: 'Ưu điểm lớn nhất của DataLoader là nó vá được N+1 mà không bắt bạn viết lại tầng nghiệp vụ. Hai điều phải nhớ: bộ nhớ đệm của nó chỉ sống trong MỘT request (tạo mới mỗi request, nếu dùng chung giữa các request thì người này sẽ thấy dữ liệu của người kia), và nó chỉ gom được trong cùng một tick — gọi tuần tự có await ở giữa thì không gom được gì.',
        en: 'DataLoader\'s biggest virtue is fixing N+1 without rewriting your business layer. Two things to remember: its cache lives for ONE request only (create a fresh loader per request — share it across requests and one user starts seeing another\'s data), and it can only batch within a single tick, so sequential awaits defeat it entirely.',
      },
      payload: { queries: 2, totalMs: 7, dedupedFrom: n },
      nodeStates: { db: 'success', api: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};
