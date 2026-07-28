/**
 * Kịch bản 6 — Microservices và hàng đợi tin nhắn.
 *
 * Ý tưởng trung tâm cần truyền đạt: hàng đợi không làm việc nặng biến mất,
 * nó chỉ DỜI việc nặng ra khỏi thời gian chờ của người dùng. Người xem thấy
 * gói tin 202 quay về client trong khi các worker vẫn đang cặm cụi chạy —
 * hình ảnh đó giải thích "bất đồng bộ" tốt hơn bất kỳ định nghĩa nào.
 */

import { Boxes } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'client', label: 'Client', kind: 'client' as const, x: 95, y: 300, sublabel: { vi: 'Tải ảnh lên', en: 'Uploads an image' } },
  { id: 'gw', label: 'API Gateway', kind: 'gateway' as const, x: 315, y: 300, sublabel: { vi: 'Xác thực · định tuyến', en: 'Auth · routing' } },
  { id: 'broker', label: 'Message Broker', kind: 'queue' as const, x: 560, y: 300, sublabel: { vi: 'Hàng đợi bền vững', en: 'Durable queue' } },
  { id: 'w1', label: 'Image Worker', kind: 'worker' as const, x: 820, y: 130, sublabel: { vi: 'sharp · tạo ảnh nhỏ', en: 'sharp · thumbnails' } },
  { id: 'w2', label: 'Email Worker', kind: 'worker' as const, x: 820, y: 310, sublabel: { vi: 'Gửi thông báo', en: 'Notification mail' } },
  { id: 'dlq', label: 'Dead Letter', kind: 'queue' as const, x: 820, y: 480, sublabel: { vi: 'Việc thất bại vĩnh viễn', en: 'Permanently failed jobs' } },
];

const edges = [
  { id: 'e_client_gw', from: 'client', to: 'gw' },
  { id: 'e_gw_broker', from: 'gw', to: 'broker' },
  { id: 'e_broker_w1', from: 'broker', to: 'w1' },
  { id: 'e_broker_w2', from: 'broker', to: 'w2' },
  { id: 'e_broker_dlq', from: 'broker', to: 'dlq' },
];

export const microservicesScenario: Scenario = {
  id: 'microservices',
  name: { vi: 'Microservices & Hàng đợi', en: 'Microservices & Message Queue' },
  tagline: {
    vi: 'Vì sao trả 202 ngay lại tốt hơn bắt người dùng chờ 8 giây — kèm retry, DLQ và tính bất biến khi lặp.',
    en: 'Why answering 202 immediately beats making the user wait eight seconds — with retries, DLQ and idempotency.',
  },
  icon: Boxes,
  accent: '#fb923c',
  lesson: {
    course: 'nodejs',
    code: '18.4',
    slug: 'nodejs-18-4-monolith-hay-tach',
    title: { vi: 'Khối nguyên hay tách dịch vụ: quyết định bằng số', en: 'Monolith or services: deciding with numbers' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'broker',
      label: { vi: 'Message broker', en: 'Message broker' },
      defaultValue: 'rabbitmq',
      choices: [
        { value: 'rabbitmq', label: 'RabbitMQ', color: '#fb923c', hint: { vi: 'Hàng đợi · ack từng việc', en: 'Queue · per-job ack' } },
        { value: 'kafka', label: 'Kafka', color: '#a855f7', hint: { vi: 'Nhật ký · giữ lại, đọc lại được', en: 'Log · retained and replayable' } },
      ],
    },
    {
      id: 'outcome',
      label: { vi: 'Diễn biến worker', en: 'Worker outcome' },
      defaultValue: 'ok',
      choices: [
        { value: 'ok', label: 'Xử lý thành công', color: '#4ade80' },
        { value: 'retry', label: 'Lỗi → thử lại → DLQ', color: '#f43f5e' },
        { value: 'burst', label: 'Tăng tải đột biến', color: '#f59e0b', hint: { vi: 'Hàng đợi làm bộ giảm chấn', en: 'The queue as a shock absorber' } },
      ],
    },
  ],

  build({ broker = 'rabbitmq', outcome = 'ok' }) {
    const isKafka = broker === 'kafka';
    const steps: SimStep[] = [];

    steps.push({
      id: 'upload',
      edge: 'e_client_gw',
      kind: 'POST',
      duration: 1200,
      latencyMs: 180,
      packetLabel: 'POST /uploads (4,2 MB)',
      title: { vi: 'Người dùng tải ảnh lên', en: 'User uploads an image' },
      detail: {
        vi: 'Ảnh gốc 4,2 MB được lưu thẳng vào R2 rồi thôi. Cách làm ĐỒNG BỘ sẽ là: tạo 4 kích thước ảnh, quét virus, gửi email — người dùng ngồi nhìn vòng quay 8 giây và có thể bỏ đi giữa chừng. Chúng ta sẽ không làm thế.',
        en: 'The 4.2 MB original goes straight to R2 and that is all. The SYNCHRONOUS approach would be: generate four sizes, virus-scan, send an email — leaving the user staring at a spinner for eight seconds, quite possibly abandoning it. We are not doing that.',
      },
      payload: { filename: 'bai-giang-13.png', size: 4404019, mime: 'image/png' },
      nodeStates: { client: 'active', gw: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'enqueue',
      edge: 'e_gw_broker',
      kind: 'POST',
      duration: 1100,
      latencyMs: 4,
      packetLabel: isKafka ? 'produce → topic' : 'publish → exchange',
      title: {
        vi: isKafka ? 'Ghi sự kiện vào topic Kafka' : 'Đẩy việc vào hàng đợi RabbitMQ',
        en: isKafka ? 'Append the event to a Kafka topic' : 'Publish the job to a RabbitMQ queue',
      },
      detail: {
        vi: isKafka
          ? 'Kafka là NHẬT KÝ, không phải hàng đợi. Sự kiện được ghi nối tiếp vào một partition và ở lại đó theo chính sách lưu giữ (ví dụ 7 ngày), kể cả sau khi đã được xử lý. Nhờ vậy, thêm một dịch vụ mới hôm nay vẫn đọc lại được toàn bộ lịch sử tuần trước — điều RabbitMQ không làm được.'
          : 'RabbitMQ là HÀNG ĐỢI: mỗi việc được giao cho đúng một consumer, xử lý xong thì ack và việc biến mất khỏi hàng. Đặt cờ persistent để việc sống sót qua lần khởi động lại broker — mặc định không bền vững là cái bẫy hay gặp.',
        en: isKafka
          ? 'Kafka is a LOG, not a queue. The event is appended to a partition and stays there for the retention window (say seven days) even after being processed. So a brand-new service added today can replay last week\'s entire history — something RabbitMQ cannot offer.'
          : 'RabbitMQ is a QUEUE: each job goes to exactly one consumer, which acks on success and the job disappears. Mark it persistent so it survives a broker restart — the non-durable default is a common trap.',
      },
      payload: isKafka
        ? { topic: 'media.uploaded', partition: 2, offset: 884213, key: 'user:1' }
        : { exchange: 'media', routingKey: 'image.process', persistent: true, jobId: 'job_44a1' },
      nodeStates: { broker: 'processing' },
      sfx: 'click',
    });

    steps.push({
      id: 'accepted',
      edge: 'e_client_gw',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1200,
      status: 202,
      latencyMs: 190,
      packetLabel: '202 Accepted',
      title: { vi: '202 Accepted — người dùng được trả tự do', en: '202 Accepted — the user is released' },
      detail: {
        vi: 'Đây là khoảnh khắc quan trọng nhất của cả kịch bản. Mã 202 nghĩa là "đã nhận, sẽ làm, chưa xong" — khác hẳn 200 ("đã xong"). Người dùng đi tiếp sau 190ms trong khi công việc thật còn nguyên phía trước. Hãy để ý: các bước sau đây diễn ra khi người dùng ĐÃ RỜI ĐI.',
        en: 'This is the pivotal moment of the whole scenario. A 202 means "received, will do, not done yet" — quite different from 200 ("done"). The user moves on after 190ms while the real work has not even started. Notice: everything after this happens once the user has ALREADY LEFT.',
      },
      payload: { jobId: 'job_44a1', status: 'queued', pollUrl: '/api/v1/uploads/job_44a1' },
      nodeStates: { gw: 'success', client: 'success' },
      sfx: 'success',
      teachingNote: {
        vi: 'Dừng ở đây. Hỏi lớp: "202 khác 200 chỗ nào?" Đây là đường ranh giới giữa tư duy đồng bộ và bất đồng bộ.',
        en: 'Pause here. Ask the room: "how does 202 differ from 200?" This is the dividing line between synchronous and asynchronous thinking.',
      },
    });

    /* ── Nhánh tăng tải đột biến ───────────────────────────────── */
    if (outcome === 'burst') {
      steps.push({
        id: 'burst',
        at: 'broker',
        kind: 'PUT',
        duration: 1500,
        title: { vi: '2.000 lượt tải lên trong 30 giây', en: '2,000 uploads in 30 seconds' },
        detail: {
          vi: 'Một bài viết lên xu hướng. Nếu xử lý đồng bộ, 2.000 tiến trình sharp cùng chạy sẽ ăn hết RAM và VPS 8GB chết ngay. Với hàng đợi, 2.000 việc chỉ nằm xếp hàng — bộ nhớ tiêu tốn là vài KB mỗi việc.',
          en: 'A post goes viral. Handled synchronously, 2,000 concurrent sharp processes eat all the RAM and the 8GB VPS dies instantly. With a queue those 2,000 jobs simply line up, costing a few kilobytes each.',
        },
        payload: { queueDepth: 2000, consumers: 4, prefetch: 2, estimatedDrainTime: '9m 20s' },
        nodeStates: { broker: 'waiting' },
        sfx: 'buzz',
      });
      steps.push({
        id: 'backpressure',
        edge: 'e_broker_w1',
        kind: 'INTERNAL',
        duration: 1300,
        packetLabel: 'prefetch = 2',
        title: { vi: 'Hàng đợi làm bộ giảm chấn', en: 'The queue acts as a shock absorber' },
        detail: {
          vi: 'prefetch=2 nghĩa là mỗi worker chỉ nhận tối đa 2 việc một lúc. Tải cao không làm hệ thống sập — nó chỉ làm hàng đợi dài ra. Đây chính là backpressure: thay vì gãy, hệ thống chậm lại một cách có kiểm soát.',
          en: 'prefetch=2 means each worker holds at most two jobs at a time. A traffic spike no longer breaks the system — it only lengthens the queue. That is backpressure: instead of snapping, the system degrades in a controlled way.',
        },
        nodeStates: { w1: 'processing', w2: 'processing' },
        sfx: 'blip',
        teachingNote: {
          vi: 'Giá trị thật của hàng đợi không phải là "nhanh hơn" mà là "không sập". Chậm mà xong hết vẫn tốt hơn nhanh mà mất việc.',
          en: 'The real value of a queue is not "faster", it is "does not fall over". Slow but complete beats fast but lossy.',
        },
      });
      steps.push({
        id: 'autoscale',
        at: 'broker',
        kind: 'RESPONSE',
        duration: 1300,
        title: { vi: 'Đo hàng đợi để tự động mở rộng', en: 'Scale on queue depth' },
        detail: {
          vi: 'Độ sâu hàng đợi là tín hiệu mở rộng tốt hơn nhiều so với phần trăm CPU: nó phản ánh CÔNG VIỆC CÒN TỒN, không phải mức bận nhất thời. Tăng từ 4 lên 12 worker, thời gian rút hàng giảm còn khoảng 3 phút; hàng đợi rỗng thì thu về 4.',
          en: 'Queue depth is a far better scaling signal than CPU percentage: it reflects OUTSTANDING WORK rather than momentary busyness. Going from 4 to 12 workers drops the drain time to roughly three minutes; when the queue empties, scale back to 4.',
        },
        payload: { metric: 'queue_depth', threshold: 500, action: 'scale workers 4 → 12' },
        nodeStates: { broker: 'success', w1: 'success', w2: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Nhánh lỗi → thử lại → DLQ ─────────────────────────────── */
    if (outcome === 'retry') {
      steps.push({
        id: 'consume-fail',
        edge: 'e_broker_w1',
        kind: 'POST',
        duration: 1100,
        packetLabel: 'job_44a1',
        title: { vi: 'Worker nhận việc', en: 'Worker picks the job up' },
        detail: {
          vi: 'Worker bắt đầu tải ảnh gốc từ R2 để tạo các kích thước nhỏ hơn.',
          en: 'The worker starts pulling the original from R2 to generate the smaller sizes.',
        },
        nodeStates: { broker: 'active', w1: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'fail-1',
        at: 'w1',
        kind: 'ERROR',
        duration: 1200,
        latencyMs: 5000,
        title: { vi: 'Thất bại lần 1 — R2 hết thời gian chờ', en: 'Attempt 1 fails — R2 times out' },
        detail: {
          vi: 'Worker KHÔNG ack. Vì không ack, RabbitMQ hiểu là việc chưa xong và sẽ giao lại. Đây là ngữ nghĩa "ít nhất một lần" (at-least-once): không mất việc, nhưng có thể chạy lặp.',
          en: 'The worker does NOT ack. Without an ack RabbitMQ concludes the job is unfinished and will redeliver it. These are at-least-once semantics: nothing is lost, but things may run twice.',
        },
        payload: { error: 'TimeoutError', attempt: 1, maxAttempts: 3 },
        nodeStates: { w1: 'error' },
        sfx: 'error',
      });
      steps.push({
        id: 'retry-2',
        edge: 'e_broker_w1',
        reverse: true,
        kind: 'PUT',
        duration: 1100,
        latencyMs: 2000,
        packetLabel: 'requeue (chờ 2s)',
        title: { vi: 'Thử lại lần 2 sau khoảng lùi', en: 'Retry 2 after a backoff delay' },
        detail: {
          vi: 'Thử lại NGAY lập tức là sai: nếu R2 đang quá tải, việc lao vào lần nữa chỉ làm mọi thứ tệ hơn. Khoảng lùi tăng dần (2s, 8s, 32s) cho bên kia thời gian hồi phục.',
          en: 'Retrying immediately is wrong: if R2 is overloaded, slamming it again makes things worse. An increasing backoff (2s, 8s, 32s) gives the other side room to recover.',
        },
        nodeStates: { w1: 'waiting', broker: 'processing' },
        sfx: 'blip',
        teachingNote: {
          vi: 'Ở đây phải nói về tính bất biến khi lặp (idempotency): việc chạy lần 2 KHÔNG được tạo thêm bản ghi hay gửi thêm email. Dùng jobId làm khoá duy nhất.',
          en: 'This is where idempotency belongs: the second run must NOT create a duplicate row or send a second email. Use the jobId as a uniqueness key.',
        },
      });
      steps.push({
        id: 'fail-3',
        at: 'w1',
        kind: 'ERROR',
        duration: 1200,
        title: { vi: 'Lần 3 cũng hỏng — ảnh thật sự lỗi', en: 'Attempt 3 fails too — the file really is corrupt' },
        detail: {
          vi: 'Ba lần đều hỏng thì gần như chắc chắn đây không phải trục trặc tạm thời mà là lỗi dữ liệu: file PNG bị hỏng phần đầu. Thử lại lần thứ tư cũng vô nghĩa. Cần phân biệt lỗi TẠM THỜI (đáng thử lại) với lỗi VĨNH VIỄN (không bao giờ thành công).',
          en: 'Three failures almost certainly mean this is not a transient blip but a data fault: the PNG header is corrupt. A fourth attempt is pointless. Distinguish TRANSIENT failures (worth retrying) from PERMANENT ones (never going to succeed).',
        },
        payload: { error: 'Input buffer contains unsupported image format', attempt: 3, maxAttempts: 3 },
        nodeStates: { w1: 'error' },
        sfx: 'error',
      });
      steps.push({
        id: 'dlq',
        edge: 'e_broker_dlq',
        kind: 'DELETE',
        duration: 1300,
        packetLabel: '→ dead letter queue',
        title: { vi: 'Chuyển sang hàng đợi chết (DLQ)', en: 'Move to the dead letter queue' },
        detail: {
          vi: 'Việc hỏng được đưa sang DLQ kèm nguyên nhân và toàn bộ nội dung gốc. Đây là chi tiết phân biệt hệ thống nghiệp dư với hệ thống nghiêm túc: không có DLQ thì việc hỏng hoặc quay vòng vô tận (nghẽn hàng đợi) hoặc biến mất lặng lẽ (mất dữ liệu). Có DLQ thì nó nằm im chờ người xem xét.',
          en: 'The failed job moves to the DLQ with its cause and full original payload. This is what separates an amateur pipeline from a serious one: without a DLQ a poisoned job either loops forever (clogging the queue) or vanishes silently (data loss). With one, it waits quietly for a human.',
        },
        payload: { jobId: 'job_44a1', reason: 'unsupported image format', attempts: 3, firstFailedAt: '2026-07-28T09:40:02.000Z' },
        nodeStates: { w1: 'idle', dlq: 'error', broker: 'active' },
        sfx: 'buzz',
      });
      steps.push({
        id: 'alert',
        edge: 'e_broker_w2',
        kind: 'EVENT',
        duration: 1150,
        packetLabel: 'thông báo cho người dùng',
        title: { vi: 'Báo cho người dùng biết việc đã hỏng', en: 'Tell the user the job failed' },
        detail: {
          vi: 'Thất bại âm thầm là kiểu hỏng tệ nhất: người dùng tưởng đã xong. Phải phát một sự kiện để giao diện đổi trạng thái sang "xử lý thất bại — tải lại ảnh khác", đồng thời cảnh báo cho đội vận hành khi DLQ có phần tử mới.',
          en: 'Silent failure is the worst failure mode: the user believes it worked. Emit an event so the UI flips to "processing failed — upload another file", and alert the on-call channel whenever the DLQ gains an item.',
        },
        nodeStates: { w2: 'processing', dlq: 'active' },
        sfx: 'ping',
      });
      return steps;
    }

    /* ── Nhánh thành công ──────────────────────────────────────── */
    steps.push({
      id: 'consume-1',
      edge: 'e_broker_w1',
      kind: 'POST',
      duration: 1100,
      latencyMs: 3,
      packetLabel: isKafka ? 'offset 884213' : 'job_44a1',
      title: { vi: 'Image Worker nhận việc', en: 'Image Worker consumes the job' },
      detail: {
        vi: isKafka
          ? 'Consumer đọc theo offset của chính nó. Hai nhóm consumer khác nhau đọc cùng một sự kiện độc lập — thêm dịch vụ mới không ảnh hưởng gì tới dịch vụ cũ.'
          : 'Broker giao việc cho đúng MỘT consumer rảnh. Hai worker không bao giờ nhận trùng một việc, nên không cần khoá phân tán cho trường hợp thường.',
        en: isKafka
          ? 'The consumer reads at its own offset. Two different consumer groups read the same event independently — adding a new service disturbs nothing existing.'
          : 'The broker hands the job to exactly ONE free consumer. Two workers never receive the same job, so the common case needs no distributed lock.',
      },
      nodeStates: { broker: 'active', w1: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'process',
      at: 'w1',
      kind: 'INTERNAL',
      duration: 1600,
      latencyMs: 6400,
      title: { vi: 'Tạo 4 kích thước ảnh — 6,4 giây', en: 'Generate four sizes — 6.4 seconds' },
      detail: {
        vi: 'Đây chính là 6,4 giây mà người dùng ĐÃ KHÔNG phải chờ. Việc nặng vẫn nặng y như cũ — hàng đợi không làm nó nhẹ đi. Điều thay đổi là nó không còn nằm trên đường đi của người dùng nữa. Đó là toàn bộ ý nghĩa của xử lý bất đồng bộ.',
        en: 'These are the 6.4 seconds the user did NOT wait for. The heavy work is exactly as heavy as before — a queue does not make it lighter. What changed is that it no longer sits on the user\'s path. That is the whole point of asynchronous processing.',
      },
      payload: { sizes: ['320w', '640w', '1280w', '1920w'], format: 'webp', totalBytes: 812443, saved: '81%' },
      nodeStates: { w1: 'processing' },
      sfx: 'blip',
      log: { vi: 'sharp: 4 variants · webp q80 · 6.4s · -81% dung lượng', en: 'sharp: 4 variants · webp q80 · 6.4s · -81% size' },
    });

    steps.push({
      id: 'ack',
      edge: 'e_broker_w1',
      reverse: true,
      kind: 'ACK',
      duration: 1000,
      packetLabel: isKafka ? 'commit offset' : 'ack',
      title: {
        vi: isKafka ? 'Ghi nhận offset đã xử lý' : 'Ack — việc rời khỏi hàng đợi',
        en: isKafka ? 'Commit the processed offset' : 'Ack — the job leaves the queue',
      },
      detail: {
        vi: isKafka
          ? 'Consumer ghi nhận đã xử lý tới offset 884213. Nếu tiến trình chết trước khi commit, nó sẽ đọc lại từ offset cũ — nên bản thân việc xử lý phải bất biến khi lặp.'
          : 'Chỉ ack SAU KHI hoàn tất, tuyệt đối không ack ngay lúc nhận. Ack sớm mà tiến trình chết giữa chừng thì việc mất vĩnh viễn — không ai biết, không ai thử lại.',
        en: isKafka
          ? 'The consumer records that it processed up to offset 884213. If the process dies before committing it re-reads from the old offset — hence the handler itself must be idempotent.'
          : 'Ack only AFTER completing, never on receipt. Ack early and crash mid-way and the job is gone for good — nobody knows, nobody retries.',
      },
      nodeStates: { w1: 'success', broker: 'success' },
      sfx: 'ping',
    });

    steps.push({
      id: 'fanout',
      edge: 'e_broker_w2',
      kind: 'EVENT',
      duration: 1150,
      packetLabel: 'media.processed',
      title: { vi: 'Phát tiếp sự kiện cho dịch vụ khác', en: 'Fan the event out to another service' },
      detail: {
        vi: 'Image Worker không tự gọi Email Worker — nó chỉ phát ra sự kiện "ảnh đã xử lý xong" và không cần biết ai đang nghe. Đó là kiến trúc hướng sự kiện: thêm dịch vụ tìm kiếm, dịch vụ thống kê hay dịch vụ kiểm duyệt sau này đều KHÔNG phải sửa một dòng nào ở Image Worker.',
        en: 'Image Worker never calls Email Worker — it merely emits "image processed" and has no idea who listens. That is event-driven architecture: adding a search indexer, an analytics service or a moderation service later requires ZERO changes to Image Worker.',
      },
      payload: { event: 'media.processed', mediaId: 9921, userId: 1, variants: 4 },
      nodeStates: { w2: 'processing' },
      sfx: 'blip',
      teachingNote: {
        vi: 'Đây là điểm mạnh thật sự của microservices: không phải "chia nhỏ cho oai" mà là ghép nối lỏng — dịch vụ mới cắm vào không đụng tới dịch vụ cũ.',
        en: 'This is the genuine strength of microservices: not "splitting things up for the sake of it" but loose coupling — a new service plugs in without touching the old ones.',
      },
    });

    steps.push({
      id: 'notify',
      edge: 'e_client_gw',
      reverse: true,
      kind: 'EVENT',
      duration: 1200,
      packetLabel: 'socket: media.ready',
      title: { vi: 'Người dùng được báo qua realtime', en: 'The user is notified over realtime' },
      detail: {
        vi: 'Toàn bộ 6,4 giây xử lý diễn ra khi người dùng đang xem trang khác. Khi xong, một sự kiện WebSocket đẩy ảnh nhỏ về và giao diện tự cập nhật. Người dùng cảm nhận hệ thống nhanh 190ms, còn máy chủ vẫn làm đủ 6,4 giây công việc — hai con số này không mâu thuẫn, chúng chỉ nằm ở hai trục thời gian khác nhau.',
        en: 'All 6.4 seconds of work happened while the user was on another page. When it finishes a WebSocket event pushes the thumbnails down and the UI updates itself. The user experiences a 190ms system while the server did the full 6.4 seconds — the two numbers do not contradict each other, they simply live on different timelines.',
      },
      payload: { event: 'media.ready', mediaId: 9921, thumbnails: ['…320.webp', '…640.webp', '…1280.webp', '…1920.webp'] },
      nodeStates: { w2: 'success', client: 'success', gw: 'active' },
      sfx: 'success',
    });

    return steps;
  },
};
