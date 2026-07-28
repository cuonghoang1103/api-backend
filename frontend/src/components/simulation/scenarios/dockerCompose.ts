/**
 * VPS & Docker · `docker compose up` — thứ tự khởi động và cái bẫy depends_on.
 *
 * Ai cũng nghĩ `depends_on` nghĩa là "đợi Postgres sẵn sàng rồi hãy chạy
 * backend". Nó KHÔNG có nghĩa đó. `depends_on` chỉ đợi container KHỞI ĐỘNG —
 * tức là đợi tiến trình đầu tiên được tạo ra, không đợi tiến trình đó sẵn sàng
 * nhận việc. Postgres mất khoảng 2 giây nữa để nạp xong dữ liệu và mở cổng
 * 5432; trong 2 giây đó backend đã chạy, đã gọi `prisma.$connect()` và đã chết.
 *
 * Triệu chứng đặc trưng, và là lý do bài này đáng dạy: deploy "thỉnh thoảng"
 * hỏng. Máy nhanh thì qua, máy chậm hoặc VPS đang bận thì trượt. Một lỗi phụ
 * thuộc vào thời gian luôn khó chịu hơn một lỗi luôn luôn sai.
 *
 * Cách chữa đúng có hai lớp, kịch bản dạy cả hai:
 *   healthcheck + condition: service_healthy   — compose đợi ĐÚNG thứ cần đợi
 *   thử lại có nhường bước ở phía ứng dụng     — vì healthcheck không cứu được
 *                                                lúc Postgres restart giữa chừng
 *
 * Phần thứ hai của kịch bản là mạng bridge: vì sao trong compose ta viết
 * `postgres:5432` chứ không phải `localhost:5432`, và vì sao `localhost` bên
 * trong container backend lại trỏ về chính nó.
 */

import { Workflow } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'compose',
    label: 'docker compose',
    kind: 'ci' as const,
    x: 110,
    y: 300,
    sublabel: { vi: 'Đọc compose.yml', en: 'Reads compose.yml' },
  },
  {
    id: 'pg',
    label: 'postgres',
    kind: 'db' as const,
    x: 380,
    y: 130,
    sublabel: { vi: 'Nạp dữ liệu · mở 5432', en: 'Loads data · opens 5432' },
  },
  {
    id: 'redis',
    label: 'redis',
    kind: 'cache' as const,
    x: 380,
    y: 470,
    sublabel: { vi: 'Sẵn sàng gần như tức thì', en: 'Ready almost instantly' },
  },
  {
    id: 'backend',
    label: 'backend',
    kind: 'server' as const,
    x: 650,
    y: 300,
    sublabel: { vi: 'Express · Prisma', en: 'Express · Prisma' },
  },
  {
    id: 'frontend',
    label: 'frontend',
    kind: 'client' as const,
    x: 890,
    y: 300,
    sublabel: { vi: 'Next.js', en: 'Next.js' },
  },
];

const edges = [
  { id: 'e_c_pg', from: 'compose', to: 'pg' },
  { id: 'e_c_redis', from: 'compose', to: 'redis' },
  { id: 'e_pg_be', from: 'pg', to: 'backend' },
  { id: 'e_redis_be', from: 'redis', to: 'backend' },
  { id: 'e_be_fe', from: 'backend', to: 'frontend' },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — depends_on TRẦN: backend chết vì chạy quá sớm
   ──────────────────────────────────────────────────────────── */

function buildNaive(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'read',
    title: { vi: 'compose đọc file và dựng đồ thị phụ thuộc', en: 'compose reads the file and builds a dependency graph' },
    detail: {
      vi: '`depends_on: [postgres, redis]` cho compose biết backend phải khởi động SAU hai dịch vụ kia. Compose dựng một đồ thị, sắp thứ tự, rồi bắt đầu tạo container theo đúng thứ tự đó. Tới đây mọi thứ vẫn đúng như bạn nghĩ.',
      en: '`depends_on: [postgres, redis]` tells compose the backend must start AFTER those two. Compose builds a graph, orders it, and creates containers in that order. So far everything matches your expectation.',
    },
    duration: 2400,
    at: 'compose',
    nodeStates: { compose: 'active' },
    packetLabel: 'compose.yml',
    sfx: 'click',
    log: { vi: 'Network cuonghoangdev_default  Created', en: 'Network cuonghoangdev_default  Created' },
  });

  push({
    id: 'start-deps',
    title: { vi: 'postgres và redis được TẠO ra', en: 'postgres and redis are CREATED' },
    detail: {
      vi: 'Chú ý chữ dùng ở đây: container được *tạo* và tiến trình đầu tiên được *chạy*. Redis sẵn sàng gần như tức thì. Postgres thì khác hẳn — nó còn phải kiểm tra thư mục dữ liệu, phát lại WAL nếu lần trước tắt đột ngột, rồi mới mở cổng 5432.',
      en: 'Note the wording: the container is *created* and its first process *starts*. Redis is ready almost immediately. Postgres is different — it still has to check the data directory, replay the WAL if the last shutdown was unclean, and only then open port 5432.',
    },
    duration: 2600,
    edge: 'e_c_pg',
    kind: 'INTERNAL',
    nodeStates: { compose: 'success', pg: 'processing', redis: 'success' },
    packetLabel: 'create',
    sfx: 'swoosh',
    log: { vi: 'Container postgres  Started · Container redis  Started', en: 'Container postgres  Started · Container redis  Started' },
  });

  push({
    id: 'start-be',
    title: { vi: 'compose coi như xong việc, chạy backend ngay', en: 'compose considers it done and starts the backend' },
    detail: {
      vi: 'Đây là chỗ hiểu lầm nằm. `depends_on` được thoả mãn NGAY KHI container kia bước vào trạng thái "running" — không phải khi dịch vụ bên trong sẵn sàng nhận kết nối. Với compose, Postgres "đã xong" rồi, dù nó còn 2 giây nữa mới mở cổng.',
      en: 'This is where the misunderstanding lives. `depends_on` is satisfied THE MOMENT the other container enters the "running" state — not when the service inside is ready to accept connections. As far as compose is concerned Postgres is done, even though it needs two more seconds to open the port.',
    },
    duration: 2800,
    edge: 'e_pg_be',
    nodeStates: { backend: 'processing' },
    packetLabel: 'start backend',
    sfx: 'blip',
    teachingNote: {
      vi: 'Hỏi lớp: "running" và "sẵn sàng nhận kết nối" có phải một không? Cả bài nằm ở câu này.',
      en: 'Ask the class: are "running" and "ready to accept connections" the same thing? The whole lesson is in that question.',
    },
  });

  push({
    id: 'connect',
    title: { vi: 'Prisma gọi $connect() — cổng 5432 chưa mở', en: 'Prisma calls $connect() — port 5432 is not open yet' },
    detail: {
      vi: 'Backend làm đúng thứ nó được dạy: kết nối CSDL ngay khi khởi động. Nhưng Postgres vẫn đang phát lại WAL. Kết nối TCP bị từ chối thẳng thừng — không phải hết giờ chờ, mà là ECONNREFUSED, vì không có ai đang lắng nghe cổng đó.',
      en: 'The backend does exactly what it was taught: connect to the database on startup. But Postgres is still replaying the WAL. The TCP connection is refused outright — not a timeout, an ECONNREFUSED, because nothing is listening on that port yet.',
    },
    duration: 2900,
    edge: 'e_pg_be',
    reverse: true,
    kind: 'ERROR',
    nodeStates: { backend: 'error', pg: 'processing' },
    packetLabel: 'ECONNREFUSED',
    status: 500,
    sfx: 'error',
    log: { vi: 'backend  Error: connect ECONNREFUSED 172.18.0.2:5432', en: 'backend  Error: connect ECONNREFUSED 172.18.0.2:5432' },
  });

  push({
    id: 'exit',
    title: { vi: 'backend thoát với mã 1, frontend gọi vào chỗ trống', en: 'backend exits with code 1, the frontend calls into nothing' },
    detail: {
      vi: 'Không có chính sách thử lại thì tiến trình chết luôn. Frontend khởi động bình thường và bắt đầu gọi API — nhận về lỗi 502 hoặc kết nối bị từ chối. Điều tệ nhất là hai giây sau Postgres sẵn sàng hoàn toàn, nên nếu bạn vào xem thì mọi thứ trông vẫn ổn: cái duy nhất chết đã chết từ lúc nào rồi.',
      en: 'Without a retry policy the process simply dies. The frontend starts fine and begins calling the API — getting 502s or refused connections. The cruel part is that two seconds later Postgres is perfectly ready, so if you go and look everything seems fine: the only thing that died died a while ago.',
    },
    duration: 3000,
    at: 'backend',
    kind: 'ERROR',
    nodeStates: { backend: 'error', pg: 'success', frontend: 'error' },
    sfx: 'buzz',
    log: { vi: 'backend exited with code 1  ·  postgres  ready to accept connections', en: 'backend exited with code 1  ·  postgres  ready to accept connections' },
    teachingNote: {
      vi: 'Đây là loại lỗi "thỉnh thoảng mới hỏng": máy nhanh thì qua, VPS đang bận thì trượt.',
      en: 'This is the "only sometimes broken" class of bug: fast machine passes, busy VPS fails.',
    },
  });

  push({
    id: 'verdict',
    title: { vi: 'depends_on đợi CONTAINER, không đợi DỊCH VỤ', en: 'depends_on waits for the CONTAINER, not the SERVICE' },
    detail: {
      vi: 'Nhớ đúng một câu này là đủ. Compose không biết gì về Postgres, về Redis hay về ứng dụng của bạn — nó chỉ biết tiến trình đã được tạo hay chưa. Muốn nó đợi đúng thứ cần đợi thì phải NÓI cho nó biết thế nào là "sẵn sàng", và đó chính là việc của healthcheck. Chọn lựa chọn bên trái để xem.',
      en: 'One sentence is enough to remember. Compose knows nothing about Postgres, Redis or your app — it only knows whether a process was created. To make it wait for the right thing you must TELL it what "ready" means, and that is exactly what a healthcheck is for. Pick the other option to see it.',
    },
    duration: 2800,
    at: 'compose',
    nodeStates: { compose: 'active', backend: 'error' },
    sfx: 'lock',
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — HEALTHCHECK: đợi đúng thứ cần đợi
   ──────────────────────────────────────────────────────────── */

function buildHealthy(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'declare',
    title: { vi: 'Khai báo thế nào là "khoẻ" cho postgres', en: 'Declare what "healthy" means for postgres' },
    detail: {
      vi: '`healthcheck: test: ["CMD-SHELL", "pg_isready -U postgres"]`, chạy lại mỗi 2 giây. `pg_isready` là lệnh có sẵn của Postgres, trả về 0 đúng khi máy chủ đã nhận kết nối được. Bên backend đổi `depends_on` sang dạng dài với `condition: service_healthy`.',
      en: '`healthcheck: test: ["CMD-SHELL", "pg_isready -U postgres"]`, retried every 2 seconds. `pg_isready` ships with Postgres and returns 0 exactly when the server can accept connections. On the backend side, `depends_on` switches to the long form with `condition: service_healthy`.',
    },
    duration: 2700,
    at: 'compose',
    nodeStates: { compose: 'active' },
    packetLabel: 'healthcheck',
    sfx: 'click',
    log: { vi: 'compose.yml: condition: service_healthy', en: 'compose.yml: condition: service_healthy' },
  });

  push({
    id: 'probe1',
    title: { vi: 'Lần dò thứ nhất — chưa khoẻ', en: 'First probe — not healthy yet' },
    detail: {
      vi: 'Container postgres đã "running", nhưng `pg_isready` trả về mã khác 0 vì cổng chưa mở. Trạng thái sức khoẻ của container là `starting`. Backend CHƯA được tạo — compose đang giữ nó lại, và đây chính là điều `depends_on` trần không bao giờ làm.',
      en: 'The postgres container is already "running", but `pg_isready` returns non-zero because the port is not open. The container’s health state is `starting`. The backend has NOT been created — compose is holding it back, which is precisely what bare `depends_on` never does.',
    },
    duration: 2600,
    at: 'pg',
    kind: 'QUERY',
    nodeStates: { pg: 'processing', backend: 'idle' },
    packetLabel: 'pg_isready',
    sfx: 'blip',
    log: { vi: 'postgres  health: starting  (1/5)', en: 'postgres  health: starting  (1/5)' },
  });

  push({
    id: 'probe2',
    title: { vi: 'Lần dò thứ hai — khoẻ', en: 'Second probe — healthy' },
    detail: {
      vi: 'WAL phát lại xong, cổng 5432 mở, `pg_isready` trả 0. Container chuyển sang `healthy`. Toàn bộ khoảng chờ này là 2 giây — đúng bằng khoảng thời gian mà ở nhánh kia đã giết chết backend.',
      en: 'The WAL replay finishes, port 5432 opens, `pg_isready` returns 0. The container flips to `healthy`. This entire wait was 2 seconds — exactly the window that killed the backend in the other branch.',
    },
    duration: 2500,
    at: 'pg',
    kind: 'ACK',
    nodeStates: { pg: 'success' },
    packetLabel: 'healthy',
    sfx: 'ping',
    log: { vi: 'postgres  health: healthy', en: 'postgres  health: healthy' },
  });

  push({
    id: 'start-be',
    title: { vi: 'Bây giờ compose mới tạo backend', en: 'Only now does compose create the backend' },
    detail: {
      vi: 'Điều kiện đã thoả, backend khởi động và `prisma.$connect()` thành công ngay lần đầu. Không có lỗi nào để bắt, không cần thử lại. Khác biệt so với nhánh kia chỉ là bốn dòng YAML.',
      en: 'The condition is met, the backend starts and `prisma.$connect()` succeeds on the first attempt. There is no error to catch and no retry needed. The difference from the other branch is four lines of YAML.',
    },
    duration: 2600,
    edge: 'e_pg_be',
    kind: 'QUERY',
    nodeStates: { backend: 'success' },
    packetLabel: 'connect OK',
    sfx: 'success',
    log: { vi: 'backend  Prisma connected · listening on :3001', en: 'backend  Prisma connected · listening on :3001' },
  });

  push({
    id: 'dns',
    title: { vi: 'Vì sao là postgres:5432 chứ không phải localhost:5432', en: 'Why postgres:5432 and not localhost:5432' },
    detail: {
      vi: 'Compose tạo một mạng bridge riêng và cắm mọi dịch vụ vào đó. TÊN DỊCH VỤ trở thành tên miền: backend gọi `postgres:5432` và Docker phân giải thành 172.18.0.2. Còn `localhost` bên trong container backend trỏ về CHÍNH NÓ — mỗi container có ngăn xếp mạng riêng (net namespace). Đây là lỗi copy-paste kinh điển khi mang chuỗi kết nối từ máy cá nhân vào compose.',
      en: 'Compose creates a private bridge network and attaches every service to it. The SERVICE NAME becomes a hostname: the backend dials `postgres:5432` and Docker resolves it to 172.18.0.2. Meanwhile `localhost` inside the backend container points at ITSELF — each container has its own network stack (net namespace). This is the classic copy-paste bug when moving a connection string from your laptop into compose.',
    },
    duration: 3100,
    edge: 'e_redis_be',
    kind: 'INTERNAL',
    nodeStates: { redis: 'success', backend: 'success' },
    packetLabel: 'redis:6379',
    sfx: 'stream',
    log: { vi: 'DATABASE_URL=postgresql://postgres@postgres:5432/app', en: 'DATABASE_URL=postgresql://postgres@postgres:5432/app' },
    teachingNote: {
      vi: 'Nhấn mạnh: chỉ cổng nào ĐƯỢC ÁNH XẠ ra ngoài (`ports:`) mới thấy từ máy chủ; giữa các container thì không cần ánh xạ gì cả.',
      en: 'Stress: only ports explicitly mapped (`ports:`) are reachable from the host; container-to-container needs no mapping at all.',
    },
  });

  push({
    id: 'retry',
    title: { vi: 'Healthcheck vẫn chưa đủ — cần thử lại ở phía ứng dụng', en: 'A healthcheck is still not enough — the app needs retries' },
    detail: {
      vi: 'Healthcheck chỉ bảo vệ được LÚC KHỞI ĐỘNG. Nếu Postgres restart lúc 3 giờ sáng, hoặc mạng chớp một cái, backend đang chạy sẽ gặp đúng lỗi ECONNREFUSED đó mà chẳng có compose nào đứng ra giữ nữa. Cho nên vẫn cần thử lại có nhường bước ở tầng ứng dụng. Hai lớp bảo vệ này giải quyết hai vấn đề khác nhau — đừng dùng cái này để thay cái kia.',
      en: 'A healthcheck only protects STARTUP. If Postgres restarts at 3am, or the network blinks, the already-running backend hits that same ECONNREFUSED and no compose is there to hold anything back. So you still need backoff retries at the application layer. These two protections solve different problems — do not use one as a substitute for the other.',
    },
    duration: 3100,
    at: 'backend',
    nodeStates: { backend: 'waiting' },
    sfx: 'lock',
    log: { vi: 'retry 1s → 2s → 4s → 8s (có nhường bước)', en: 'retry 1s → 2s → 4s → 8s (with backoff)' },
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const dockerComposeScenario: Scenario = {
  id: 'docker-compose',
  name: { vi: 'docker compose — thứ tự khởi động', en: 'docker compose — startup order' },
  tagline: {
    vi: '`depends_on` chỉ đợi container được TẠO, không đợi dịch vụ bên trong sẵn sàng. Hai giây Postgres nạp dữ liệu là đủ để backend chết — và deploy chỉ hỏng "thỉnh thoảng", tuỳ máy nhanh hay chậm.',
    en: '`depends_on` waits for the container to be CREATED, not for the service inside to be ready. The two seconds Postgres spends loading are enough to kill the backend — and the deploy breaks only "sometimes", depending on how fast the machine is.',
  },
  icon: Workflow,
  accent: '#a78bfa',
  group: 'devops',
  lesson: {
    course: 'nodejs',
    code: '17.3',
    slug: 'nodejs-17-3-pid-1-tat-em',
    title: { vi: 'PID 1: dòng CMD làm mất mọi request đang xử lý', en: 'PID 1: the CMD line that loses every in-flight request' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách khai phụ thuộc', en: 'How dependencies are declared' },
      defaultValue: 'naive',
      choices: [
        {
          value: 'naive',
          label: 'depends_on trần',
          fullLabel: 'Chỉ depends_on, không healthcheck',
          color: '#f43f5e',
          hint: { vi: 'backend chết vì chạy sớm 2 giây', en: 'backend dies two seconds too early' },
        },
        {
          value: 'healthy',
          label: 'service_healthy',
          fullLabel: 'healthcheck + condition: service_healthy',
          color: '#34d399',
          hint: { vi: 'đợi đúng thứ cần đợi', en: 'waits for the right thing' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.mode === 'healthy' ? buildHealthy() : buildNaive()),
};
