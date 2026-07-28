/**
 * VPS & Docker · Đường đi của một lần `bash deploy.sh`.
 *
 * Kịch bản này mô tả ĐÚNG `deploy.sh` đang dùng cho cuongthai.com, không phải
 * một quy trình deploy chung chung trong sách. Mọi bước, mọi chốt chặn ở đây
 * đều có thật, và phần lớn được thêm vào SAU khi một sự cố buộc phải thêm:
 *
 *   build TUẦN TỰ            ← 2026-07-06: build song song trên VPS 6GB làm
 *                              kernel giết `next build` (exit 137)
 *   `up -d` KHÔNG có --build ← 2026-07-07: `--build` khiến compose bake dựng
 *                              song song CẢ HAI ảnh, vô hiệu hoá chốt trên
 *   `-p cuonghoangdev`       ← thiếu cờ này thì compose dựng một project TÊN
 *                              KHÁC ("repo"), deploy báo thành công mà site
 *                              vẫn chạy ảnh cũ
 *   smoke-test 404           ← 2026-07-02: `--no-build` đẩy ảnh cũ lên prod,
 *                              route /gifs không được gắn, GIF chết mà không
 *                              ai biết cho tới khi người dùng báo
 *
 * Nhánh thứ hai của kịch bản chạy lại đúng sự cố `--no-build` đó, vì nó là
 * cách nhanh nhất để hiểu vì sao smoke-test tồn tại.
 */

import { Rocket } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'mac',
    label: 'MacBook',
    kind: 'client' as const,
    x: 95,
    y: 300,
    sublabel: { vi: 'bash deploy.sh', en: 'bash deploy.sh' },
  },
  {
    id: 'repo',
    label: '/home/deployer/repo',
    kind: 'storage' as const,
    x: 330,
    y: 300,
    sublabel: { vi: 'Mã nguồn trên VPS', en: 'Source on the VPS' },
  },
  {
    id: 'build',
    label: 'docker build',
    kind: 'ci' as const,
    x: 570,
    y: 130,
    sublabel: { vi: 'Tuần tự: backend rồi frontend', en: 'Sequential: backend then frontend' },
  },
  {
    id: 'stack',
    label: 'cuonghoangdev',
    kind: 'server' as const,
    x: 570,
    y: 440,
    sublabel: { vi: 'Container đang phục vụ', en: 'The serving containers' },
  },
  {
    id: 'db',
    label: 'postgres',
    kind: 'db' as const,
    x: 820,
    y: 440,
    sublabel: { vi: 'migrate deploy', en: 'migrate deploy' },
  },
  {
    id: 'smoke',
    label: 'smoke-test',
    kind: 'gateway' as const,
    x: 820,
    y: 130,
    sublabel: { vi: '28 route · 404 = hỏng', en: '28 routes · 404 = broken' },
  },
];

const edges = [
  { id: 'e_mac_repo', from: 'mac', to: 'repo' },
  { id: 'e_repo_build', from: 'repo', to: 'build' },
  { id: 'e_build_stack', from: 'build', to: 'stack' },
  { id: 'e_stack_db', from: 'stack', to: 'db' },
  { id: 'e_stack_smoke', from: 'stack', to: 'smoke' },
  { id: 'e_repo_stack', from: 'repo', to: 'stack', ghost: true },
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
   A — DEPLOY ĐẦY ĐỦ
   ──────────────────────────────────────────────────────────── */

function buildFull(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'rsync',
    title: { vi: 'rsync đẩy mã nguồn lên VPS', en: 'rsync pushes the source to the VPS' },
    detail: {
      vi: 'Không phải `git push`. Script đồng bộ thẳng thư mục làm việc sang `/home/deployer/repo`, bỏ qua `node_modules`, `.next` và — quan trọng nhất — bỏ qua mọi file `.env*`. Nhờ đó bí mật sản xuất nằm ở `/opt/cuonghoangdev/.env` trên VPS sống sót qua mọi lần deploy, không bao giờ bị bản `.env` trên máy cá nhân ghi đè.',
      en: 'Not `git push`. The script syncs your working directory straight to `/home/deployer/repo`, skipping `node_modules`, `.next` and — most importantly — every `.env*` file. That is how production secrets in `/opt/cuonghoangdev/.env` survive every deploy and are never overwritten by your laptop’s `.env`.',
    },
    duration: 2700,
    edge: 'e_mac_repo',
    kind: 'PUT',
    nodeStates: { mac: 'active', repo: 'processing' },
    packetLabel: 'rsync -azP',
    sfx: 'swoosh',
    log: { vi: 'sent 1.284 files · 4,2 MB · loại trừ .env*', en: 'sent 1,284 files · 4.2 MB · excluding .env*' },
  });

  push({
    id: 'env',
    title: { vi: 'VPS nạp bí mật sản xuất từ /opt/cuonghoangdev/.env', en: 'The VPS loads production secrets from /opt/cuonghoangdev/.env' },
    detail: {
      vi: 'Script tự nhận ra mình đang chạy trên VPS (thư mục `/opt/cuonghoangdev` tồn tại) rồi đọc từng dòng env, bỏ qua dòng hỏng thay vì `source` cả file — một dòng sai cú pháp mà `source` thì cả lần deploy chết ngay tại đây.',
      en: 'The script detects it is on the VPS (the `/opt/cuonghoangdev` directory exists) and parses the env file line by line, skipping malformed lines instead of `source`-ing the file — one bad line with `source` would kill the whole deploy right here.',
    },
    duration: 2400,
    at: 'repo',
    nodeStates: { repo: 'success' },
    sfx: 'lock',
    log: { vi: 'Loaded env from /opt/cuonghoangdev/.env', en: 'Loaded env from /opt/cuonghoangdev/.env' },
  });

  push({
    id: 'build-be',
    title: { vi: 'Dựng ảnh backend — MỘT ảnh tại một thời điểm', en: 'Build the backend image — ONE image at a time' },
    detail: {
      vi: 'Đây là chốt chặn tràn RAM. VPS chia RAM với cả bộ container đang phục vụ, mà bộ nhớ đệm build bị dọn sau mỗi lần deploy nên lần nào cũng là build lạnh. Dựng song song hai ảnh thì đỉnh RAM vượt ngưỡng và kernel giết `next build` — chính là exit 137 gặp ngày 06/07. Dựng tuần tự giữ đỉnh ở mức một ảnh; khi cache còn ấm thì cả hai bước gần như tức thì, nên không mất gì.',
      en: 'This is the OOM guard. The VPS shares RAM with the live stack, and the build cache is pruned after every deploy so every build is cold. Building both images in parallel pushes the peak over the limit and the kernel kills `next build` — the exit 137 seen on 6 July. Sequential builds keep the peak at one image; with a warm cache both steps are near-instant, so nothing is lost.',
    },
    duration: 3000,
    edge: 'e_repo_build',
    kind: 'INTERNAL',
    nodeStates: { build: 'processing' },
    packetLabel: 'build backend',
    sfx: 'stream',
    log: { vi: 'Building backend image... ok', en: 'Building backend image... ok' },
    teachingNote: {
      vi: 'Chỉ ra: đây là ví dụ hiếm khi làm TUẦN TỰ lại đúng hơn song song — vì trần cứng là RAM.',
      en: 'Point out: a rare case where sequential beats parallel — the hard limit is RAM, not time.',
    },
  });

  push({
    id: 'build-fe',
    title: { vi: 'Rồi mới dựng ảnh frontend', en: 'Then build the frontend image' },
    detail: {
      vi: '`next build` là bước ngốn RAM nhất trong cả quy trình. Nó chỉ bắt đầu khi ảnh backend đã xong hẳn và bộ nhớ của bước đó đã được trả lại. Cũng vì thế mà lát nữa, khi hoán container, tuyệt đối không được thêm cờ `--build` — compose sẽ coi đó là lệnh dựng lại song song cả hai ảnh và phá đúng chốt chặn này.',
      en: '`next build` is the most memory-hungry step in the pipeline. It only starts once the backend image is completely finished and its memory has been returned. That is also why, when swapping containers in a moment, you must never add `--build` — compose treats it as a fresh parallel build of both images and defeats this very guard.',
    },
    duration: 2900,
    at: 'build',
    nodeStates: { build: 'success' },
    sfx: 'stream',
    log: { vi: 'Building frontend image... ok', en: 'Building frontend image... ok' },
  });

  push({
    id: 'swap',
    title: { vi: 'up -d hoán container sang ảnh vừa dựng', en: 'up -d swaps the containers to the fresh images' },
    detail: {
      vi: 'Cờ `-p cuonghoangdev` ghim tên project đúng bằng tên bộ container ĐANG PHỤC VỤ. Thiếu nó, compose lấy tên thư mục (`repo`) làm tên project và dựng ra một bộ container hoàn toàn khác — deploy chạy trơn tru, báo thành công, mà website vẫn phục vụ ảnh cũ. Đây là loại lỗi tốn nhiều giờ nhất vì không có gì báo đỏ cả.',
      en: 'The `-p cuonghoangdev` flag pins the project name to the one the LIVE containers carry. Without it, compose uses the directory name (`repo`) and spins up a completely separate set of containers — the deploy runs cleanly, reports success, and the site keeps serving the old image. This is the most expensive class of bug because nothing ever turns red.',
    },
    duration: 3000,
    edge: 'e_build_stack',
    kind: 'INTERNAL',
    nodeStates: { stack: 'processing' },
    packetLabel: 'up -d --force-recreate',
    sfx: 'swoosh',
    log: { vi: 'Container cuonghoangdev_backend  Recreated', en: 'Container cuonghoangdev_backend  Recreated' },
  });

  push({
    id: 'migrate',
    title: { vi: 'prisma migrate deploy — không phải db push', en: 'prisma migrate deploy — not db push' },
    detail: {
      vi: 'Ba lý do dùng `migrate deploy`: nó chạy cả SQL thô trong file migration (cột tsvector sinh tự động, chỉ mục GIN, trigger) mà `db push` bỏ qua trong im lặng; nó ghi từng migration đã áp vào `_prisma_migrations` nên lần deploy sau là bất biến; và nó không có `--accept-data-loss`, thứ có thể lặng lẽ xoá cột trên CSDL đang chạy.',
      en: 'Three reasons for `migrate deploy`: it applies the raw SQL inside migration files (generated tsvector columns, GIN indexes, triggers) that `db push` silently skips; it records each applied migration in `_prisma_migrations` so later deploys are idempotent; and it has no `--accept-data-loss`, which could quietly drop columns on a live database.',
    },
    duration: 3000,
    edge: 'e_stack_db',
    kind: 'QUERY',
    nodeStates: { stack: 'success', db: 'processing' },
    packetLabel: 'migrate deploy',
    sfx: 'blip',
    log: { vi: 'Database schema already in sync', en: 'Database schema already in sync' },
  });

  push({
    id: 'smoke',
    title: { vi: 'Smoke-test: gọi 28 route, 404 là hỏng', en: 'Smoke test: hit 28 routes, a 404 means broken' },
    detail: {
      vi: 'Chốt chặn cuối, và là chốt hữu dụng nhất. Script gọi GET không xác thực vào 28 route lõi. 401 hoặc 200 đều là khoẻ — nghĩa là route đã được gắn. Chỉ 404 mới là hỏng: route không tồn tại trong ảnh đang chạy, tức là ảnh cũ hoặc build thiếu. Deploy thất bại ngay tại đây thay vì để người dùng phát hiện hộ.',
      en: 'The final and most useful gate. The script issues unauthenticated GETs against 28 core routes. 401 or 200 both mean healthy — the route is mounted. Only a 404 means broken: the route does not exist in the running image, i.e. a stale or partial build. The deploy fails here instead of letting users find out for you.',
    },
    duration: 3100,
    edge: 'e_stack_smoke',
    kind: 'GET',
    nodeStates: { smoke: 'success', db: 'success' },
    packetLabel: 'GET × 28',
    status: 401,
    sfx: 'ping',
    log: { vi: '28/28 route đã gắn (401/200) — không có 404', en: '28/28 routes mounted (401/200) — no 404s' },
    teachingNote: {
      vi: 'Nhắc: thêm module mới thì phải thêm MỘT route GET không tham số vào danh sách này.',
      en: 'Remind: when adding a new module, add ONE param-less GET route to this list.',
    },
  });

  push({
    id: 'done',
    title: { vi: 'Dọn cache build rồi kết thúc', en: 'Prune the build cache and finish' },
    detail: {
      vi: 'Bước cuối dọn cache Docker để đĩa VPS không đầy dần — đã có lần đĩa đầy làm Postgres chết. Cái giá phải trả là lần deploy sau luôn là build lạnh, và đó chính là lý do chốt chặn build tuần tự ở trên phải tồn tại. Hai quyết định này dính chặt vào nhau: bỏ dọn cache thì đĩa đầy, giữ dọn cache thì bắt buộc phải build tuần tự.',
      en: 'The last step prunes the Docker cache so the VPS disk does not fill up — a full disk once took Postgres down. The price is that the next deploy is always a cold build, which is exactly why the sequential guard above must exist. The two decisions are locked together: drop the prune and the disk fills; keep it and sequential building becomes mandatory.',
    },
    duration: 2900,
    at: 'stack',
    nodeStates: { stack: 'success', smoke: 'success', mac: 'success' },
    sfx: 'success',
    log: { vi: 'Deploy hoàn tất · site khoẻ', en: 'Deploy complete · site healthy' },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — --no-build: SỰ CỐ 02/07 CHẠY LẠI
   ──────────────────────────────────────────────────────────── */

function buildNoBuild(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'intent',
    title: { vi: '"Chỉ sửa tí xíu, khỏi build cho nhanh"', en: '"Tiny change, let’s skip the build"' },
    detail: {
      vi: '`bash deploy.sh --no-build` sinh ra để đẩy nhanh thay đổi CẤU HÌNH — sửa một biến môi trường, một dòng nginx. Dùng đúng mục đích thì nó tiết kiệm được vài phút. Vấn đề là nó trông y hệt một lần deploy bình thường, nên rất dễ dùng cho cả thay đổi mã nguồn.',
      en: '`bash deploy.sh --no-build` exists to push CONFIG changes quickly — an env var, a line of nginx. Used for its purpose it saves a few minutes. The problem is it looks exactly like a normal deploy, so it is very easy to reach for after a code change too.',
    },
    duration: 2600,
    at: 'mac',
    nodeStates: { mac: 'active' },
    packetLabel: '--no-build',
    sfx: 'click',
  });

  push({
    id: 'rsync',
    title: { vi: 'rsync vẫn chạy — mã nguồn MỚI đã nằm trên VPS', en: 'rsync still runs — the NEW source is on the VPS' },
    detail: {
      vi: 'Và đây là chỗ đánh lừa. Bạn SSH vào VPS, mở file ra xem, mã mới nằm đó đầy đủ. `dist/routes/gifs.routes.js` có thật. Mọi bằng chứng dễ kiểm tra nhất đều nói rằng deploy đã thành công.',
      en: 'And here is the deception. You SSH into the VPS, open the file, and the new code is right there. `dist/routes/gifs.routes.js` genuinely exists. Every easy-to-check piece of evidence says the deploy worked.',
    },
    duration: 2800,
    edge: 'e_mac_repo',
    kind: 'PUT',
    nodeStates: { repo: 'success' },
    packetLabel: 'mã mới',
    sfx: 'swoosh',
    log: { vi: 'sent 1.284 files · mã mới đã lên VPS', en: 'sent 1,284 files · new code on the VPS' },
  });

  push({
    id: 'skip',
    title: { vi: 'Nhưng KHÔNG dựng ảnh mới', en: 'But no new image is built' },
    detail: {
      vi: 'Ảnh Docker là một bản chụp ĐÔNG CỨNG, được tạo lúc build. Mã nguồn mới nằm trong `/home/deployer/repo` trên máy chủ, còn container thì chạy bằng hệ thống tệp riêng của ảnh cũ. Hai thứ đó không liên quan gì tới nhau cho tới khi có người chạy `docker build`.',
      en: 'A Docker image is a FROZEN snapshot taken at build time. The new source sits in `/home/deployer/repo` on the host, while the container runs from the old image’s own filesystem. The two have nothing to do with each other until somebody runs `docker build`.',
    },
    duration: 2900,
    edge: 'e_repo_build',
    kind: 'ERROR',
    nodeStates: { build: 'error' },
    packetLabel: 'BỎ QUA build',
    sfx: 'buzz',
    log: { vi: '--no-build: skipping docker build', en: '--no-build: skipping docker build' },
  });

  push({
    id: 'stale',
    title: { vi: 'Container vẫn chạy dist/index.js CŨ', en: 'The container still runs the OLD dist/index.js' },
    detail: {
      vi: 'Bên trong ảnh cũ, `index.js` không có dòng nào gắn router `/gifs` — vì lúc dựng ảnh đó, tính năng GIF chưa tồn tại. Ứng dụng khởi động bình thường, không lỗi, không cảnh báo. Nó chỉ đơn giản là một phiên bản khác của phần mềm.',
      en: 'Inside the old image, `index.js` contains no line mounting the `/gifs` router — when that image was built the GIF feature did not exist. The app starts normally, no error, no warning. It is simply a different version of the software.',
    },
    duration: 2900,
    edge: 'e_repo_stack',
    kind: 'INTERNAL',
    nodeStates: { stack: 'waiting', repo: 'success' },
    packetLabel: 'ảnh cũ',
    sfx: 'blip',
    log: { vi: 'backend Up 3 seconds (ảnh dựng từ 5 ngày trước)', en: 'backend Up 3 seconds (image built 5 days ago)' },
  });

  push({
    id: 'nosmoke',
    title: { vi: 'Và --no-build cũng BỎ LUÔN smoke-test', en: 'And --no-build skips the smoke test as well' },
    detail: {
      vi: 'Đây mới là phần khiến sự cố kéo dài. Chốt chặn duy nhất có khả năng phát hiện chuyện này đã bị nhảy qua cùng lúc. Deploy in ra toàn dòng xanh, không ai nghi ngờ gì, và tính năng GIF chết im lặng trên sản xuất cho tới khi người dùng báo.',
      en: 'This is what turns a mistake into an outage. The one gate capable of catching this was skipped at the same time. The deploy prints all green, nobody suspects anything, and the GIF feature is silently dead in production until a user reports it.',
    },
    duration: 3000,
    edge: 'e_stack_smoke',
    kind: 'ERROR',
    nodeStates: { smoke: 'error' },
    packetLabel: 'không chạy',
    sfx: 'error',
    log: { vi: '(smoke-test không được chạy)', en: '(smoke test never ran)' },
    teachingNote: {
      vi: 'Đây là sự cố 02/07 thật: GIF 404 + "tin nhắn biến mất", mất hàng giờ mới lần ra ảnh cũ.',
      en: 'This is the real 2 July incident: GIF 404s plus "vanishing messages", hours lost before the stale image was found.',
    },
  });

  push({
    id: 'diagnose',
    title: { vi: 'Cách chẩn đoán trong 5 giây: curl không xác thực', en: 'The five-second diagnosis: an unauthenticated curl' },
    detail: {
      vi: 'Đừng mở trình duyệt — trình duyệt trộn lẫn lỗi xác thực, CORS và cache thành một mớ. Gọi thẳng: `curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/<route>`. 401 = route đã gắn (chỉ thiếu đăng nhập), 200 = gắn và công khai, 404 = route KHÔNG có trong ảnh đang chạy — tức là build cũ hoặc thiếu. Ba con số đó phân biệt "lỗi của tôi" với "sai ảnh".',
      en: 'Do not open a browser — it blends auth errors, CORS and caching into one mess. Ask directly: `curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/api/v1/<route>`. 401 = mounted (you are just not logged in), 200 = mounted and public, 404 = the route is NOT in the running image — a stale or partial build. Those three numbers separate "my bug" from "wrong image".',
    },
    duration: 3200,
    at: 'smoke',
    kind: 'GET',
    nodeStates: { smoke: 'active' },
    packetLabel: '404',
    status: 404,
    sfx: 'blip',
    log: { vi: 'curl /api/v1/gifs → 404   ← ảnh cũ, không phải lỗi mã', en: 'curl /api/v1/gifs → 404   ← stale image, not a code bug' },
  });

  push({
    id: 'rule',
    title: { vi: 'Luật: đổi mã thì LUÔN deploy đầy đủ', en: 'The rule: code changed means a FULL deploy, always' },
    detail: {
      vi: '`--no-build` chỉ dành cho thay đổi thuần cấu hình, và ngay cả khi đó cũng nên cân nhắc chạy đầy đủ cho chắc. Một lần build lạnh tốn vài phút; một lần truy tìm ảnh cũ trên sản xuất tốn vài giờ và đi kèm người dùng đang gặp lỗi.',
      en: '`--no-build` is for pure config changes only, and even then a full run is usually worth it. A cold build costs a few minutes; hunting a stale image in production costs hours, with users hitting errors the whole time.',
    },
    duration: 2900,
    at: 'mac',
    nodeStates: { mac: 'active', stack: 'error' },
    sfx: 'lock',
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const deployPipelineScenario: Scenario = {
  id: 'deploy-pipeline',
  name: { vi: 'Một lần deploy đi qua những đâu', en: 'What one deploy actually does' },
  tagline: {
    vi: 'rsync → build tuần tự (chốt chặn tràn RAM) → hoán container → migrate → smoke-test 28 route. Mỗi chốt chặn trong đó đều được thêm vào sau một sự cố thật.',
    en: 'rsync → sequential build (the OOM guard) → container swap → migrate → a 28-route smoke test. Every one of those gates was added after a real incident.',
  },
  icon: Rocket,
  accent: '#f59e0b',
  group: 'devops',
  nodes,
  edges,
  options: [
    {
      id: 'mode',
      label: { vi: 'Kiểu chạy', en: 'How it is run' },
      defaultValue: 'full',
      choices: [
        {
          value: 'full',
          label: 'deploy đầy đủ',
          fullLabel: 'bash deploy.sh — đủ mọi chốt chặn',
          color: '#34d399',
          hint: { vi: 'build tuần tự + smoke-test', en: 'sequential build + smoke test' },
        },
        {
          value: 'nobuild',
          label: '--no-build',
          fullLabel: 'Sự cố ảnh cũ ngày 02/07',
          color: '#f43f5e',
          hint: { vi: 'mã mới trên VPS, ảnh vẫn cũ', en: 'new source, old image' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.mode === 'nobuild' ? buildNoBuild() : buildFull()),
};
