/**
 * VPS & Docker · CI/CD — và vì sao hai workflow cùng chạy lại làm sập site.
 *
 * Đường CI/CD lý tưởng rất dễ vẽ: đẩy mã lên nhánh chính, GitHub Actions kiểm
 * tra kiểu, dựng ảnh, đẩy lên registry, VPS kéo ảnh về và khởi động lại. Mỗi
 * bước là một chốt chặn, và chốt nào đỏ thì dừng lại — đúng như mong đợi.
 *
 * Phần đáng học nằm ở nhánh thứ hai. Trên kho này có HAI workflow cùng lắng
 * nghe một sự kiện push vào `main`. Mỗi cái tự nó đều đúng. Chạy cùng lúc thì
 * cả hai cùng gọi `docker compose up -d` trên MỘT máy chủ, và Docker không hề
 * biết có kẻ thứ hai đang làm y hệt: container bị tạo lại hai lần chồng nhau,
 * một bản bị giết giữa chừng (`Exited 137`), một bản thành container mồ côi
 * giữ mất tên — website chết cho tới khi có người vào gỡ tay.
 *
 * Đây là lý do quy trình chuẩn của dự án là **deploy bằng `bash deploy.sh` từ
 * máy cá nhân, và chỉ push lên GitHub SAU KHI đã kiểm tra xong trên sản xuất**
 * — push lúc đó chỉ còn là đồng bộ mã, không còn là hành động deploy.
 */

import { GitPullRequest } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'dev',
    label: 'git push',
    kind: 'client' as const,
    x: 90,
    y: 300,
    sublabel: { vi: 'nhánh main', en: 'branch main' },
  },
  {
    id: 'ci',
    label: 'Actions — CI',
    kind: 'ci' as const,
    x: 320,
    y: 150,
    sublabel: { vi: 'lint · tsc · build', en: 'lint · tsc · build' },
  },
  {
    id: 'ci2',
    label: 'Actions — VPS',
    kind: 'ci' as const,
    x: 320,
    y: 450,
    sublabel: { vi: 'Workflow THỨ HAI', en: 'The SECOND workflow' },
  },
  {
    id: 'ghcr',
    label: 'GHCR',
    kind: 'storage' as const,
    x: 570,
    y: 150,
    sublabel: { vi: 'Kho ảnh Docker', en: 'Docker image registry' },
  },
  {
    id: 'vps',
    label: 'VPS',
    kind: 'server' as const,
    x: 820,
    y: 300,
    sublabel: { vi: 'docker compose up -d', en: 'docker compose up -d' },
  },
];

const edges = [
  { id: 'e_dev_ci', from: 'dev', to: 'ci' },
  { id: 'e_dev_ci2', from: 'dev', to: 'ci2' },
  { id: 'e_ci_ghcr', from: 'ci', to: 'ghcr' },
  { id: 'e_ghcr_vps', from: 'ghcr', to: 'vps' },
  { id: 'e_ci2_vps', from: 'ci2', to: 'vps' },
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
   A — ĐƯỜNG CI/CD ĐÚNG
   ──────────────────────────────────────────────────────────── */

function buildHappy(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'push',
    title: { vi: 'Đẩy mã lên main kích hoạt workflow', en: 'A push to main triggers the workflow' },
    detail: {
      vi: 'GitHub nhận commit và tìm trong `.github/workflows/` xem file nào khai `on: push: branches: [main]`. Mỗi file khớp sẽ được chạy — và đó là chi tiết sẽ quay lại cắn ở nhánh sau: số workflow chạy KHÔNG phải một, mà là số file khớp.',
      en: 'GitHub receives the commit and scans `.github/workflows/` for files declaring `on: push: branches: [main]`. Every match runs — and that detail comes back to bite in the other branch: the number of workflows that run is not one, it is however many files match.',
    },
    duration: 2600,
    edge: 'e_dev_ci',
    kind: 'POST',
    nodeStates: { dev: 'active', ci: 'processing' },
    packetLabel: 'push main',
    sfx: 'swoosh',
    log: { vi: 'Triggered: deploy-ghcr.yml', en: 'Triggered: deploy-ghcr.yml' },
  });

  push({
    id: 'lint',
    title: { vi: 'Chốt chặn 1 — kiểm kiểu và lint', en: 'Gate 1 — type check and lint' },
    detail: {
      vi: '`npx tsc --noEmit` chạy cho backend và frontend. Chốt này rẻ nhất và bắt được nhiều lỗi nhất, nên nó phải đứng TRƯỚC bước dựng ảnh: hỏng ở đây thì dừng ngay, chưa tốn phút build nào. Đây cũng chính là hai lệnh trong danh sách kiểm trước khi đẩy mã.',
      en: '`npx tsc --noEmit` runs for both backend and frontend. This gate is the cheapest and catches the most, so it belongs BEFORE the image build: fail here and you stop immediately, having spent no build minutes. These are the same two commands on the pre-push checklist.',
    },
    duration: 2700,
    at: 'ci',
    kind: 'INTERNAL',
    nodeStates: { ci: 'processing' },
    sfx: 'blip',
    log: { vi: 'tsc --noEmit ✓ · next build ✓', en: 'tsc --noEmit ✓ · next build ✓' },
  });

  push({
    id: 'image',
    title: { vi: 'Dựng ảnh và đẩy lên GHCR', en: 'Build the images and push to GHCR' },
    detail: {
      vi: 'Ảnh được gắn thẻ theo mã băm commit, không phải `latest`. Nhờ vậy mỗi bản triển khai luôn truy ngược được về đúng một commit, và khi cần quay lui thì chỉ việc trỏ lại thẻ cũ thay vì dựng lại từ đầu. Dùng `latest` là tự bỏ mất khả năng đó.',
      en: 'Images are tagged with the commit SHA, not `latest`. That way every deployment traces back to exactly one commit, and rolling back means pointing at an older tag instead of rebuilding. Using `latest` throws that ability away.',
    },
    duration: 2800,
    edge: 'e_ci_ghcr',
    kind: 'PUT',
    nodeStates: { ci: 'success', ghcr: 'processing' },
    packetLabel: 'ghcr.io/...:sha',
    sfx: 'stream',
    log: { vi: 'pushed ghcr.io/cuonghoangdev/backend:8baa047', en: 'pushed ghcr.io/cuonghoangdev/backend:8baa047' },
  });

  push({
    id: 'pull',
    title: { vi: 'VPS kéo ảnh về và hoán container', en: 'The VPS pulls the image and swaps containers' },
    detail: {
      vi: 'Khác hẳn `deploy.sh`, ở đây VPS KHÔNG dựng ảnh — nó chỉ tải bản đã dựng sẵn về. Đổi lại là RAM của VPS được tha, không còn chuyện `next build` bị kernel giết. Cái giá phải trả là mỗi lần deploy phải tải vài trăm MB qua mạng, và bí mật đăng nhập registry phải được giữ trên máy chủ.',
      en: 'Unlike `deploy.sh`, the VPS does NOT build here — it downloads a pre-built image. In exchange the VPS’s RAM is spared and `next build` can no longer be OOM-killed. The price is a few hundred MB pulled over the network each deploy, plus registry credentials living on the server.',
    },
    duration: 2900,
    edge: 'e_ghcr_vps',
    kind: 'GET',
    nodeStates: { ghcr: 'success', vps: 'processing' },
    packetLabel: 'docker pull',
    sfx: 'swoosh',
    log: { vi: 'Container cuonghoangdev_backend  Recreated', en: 'Container cuonghoangdev_backend  Recreated' },
  });

  push({
    id: 'migrate',
    title: { vi: 'Chạy migration rồi kiểm tra sức khoẻ', en: 'Run migrations, then health-check' },
    detail: {
      vi: '`prisma migrate deploy` chạy trong container backend. Nếu migration hỏng thì PHẢI dừng lại và báo người — không được tự chữa. Tự chạy `migrate resolve` trên một migration mới áp một nửa là cách nhanh nhất để làm hỏng lược đồ CSDL sản xuất một cách âm thầm.',
      en: '`prisma migrate deploy` runs inside the backend container. If a migration fails the pipeline MUST stop and tell a human — never self-heal. Auto-running `migrate resolve` on a half-applied migration is the fastest way to silently corrupt a production schema.',
    },
    duration: 2900,
    at: 'vps',
    kind: 'QUERY',
    nodeStates: { vps: 'success' },
    sfx: 'success',
    log: { vi: 'migrate deploy ✓ · /health 200', en: 'migrate deploy ✓ · /health 200' },
    teachingNote: {
      vi: 'Nhấn mạnh: migration hỏng thì DỪNG và báo người. Không bao giờ tự resolve.',
      en: 'Stress: on a failed migration, STOP and tell a human. Never auto-resolve.',
    },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — HAI WORKFLOW ĐUA NHAU
   ──────────────────────────────────────────────────────────── */

function buildRace(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'two',
    title: { vi: 'Một cú push, HAI workflow cùng khởi động', en: 'One push, TWO workflows start' },
    detail: {
      vi: 'Kho có `deploy-ghcr.yml` và `backend-vps.yml`, cả hai đều khai `on: push` vào `main`. Không ai cố ý tạo ra tình huống này — nó lớn dần lên: workflow thứ hai được thêm vào cho một mục đích khác, ở một thời điểm khác, và không ai nhớ rằng cái thứ nhất cũng deploy.',
      en: 'The repo has `deploy-ghcr.yml` and `backend-vps.yml`, both declaring `on: push` to `main`. Nobody set this up on purpose — it accumulated: the second workflow was added for a different reason at a different time, and nobody remembered the first one also deploys.',
    },
    duration: 2800,
    edge: 'e_dev_ci',
    kind: 'POST',
    nodeStates: { dev: 'active', ci: 'processing', ci2: 'processing' },
    packetLabel: 'push main',
    alsoInFlight: [{ edge: 'e_dev_ci2', at: 0.5, label: 'cùng lúc', kind: 'POST' }],
    sfx: 'swoosh',
    log: { vi: '2 workflow đang chạy cho cùng một commit', en: '2 workflows running for the same commit' },
  });

  push({
    id: 'both',
    title: { vi: 'Cả hai đều đi tới cùng một máy chủ', en: 'Both reach the same server' },
    detail: {
      vi: 'Chúng chạy trên hai runner khác nhau, không biết gì về nhau, và không có khoá nào ngăn cách. Mỗi cái SSH vào VPS rồi gọi `docker compose up -d` — hai lệnh giống hệt nhau, cách nhau vài giây, tác động lên đúng một bộ container.',
      en: 'They run on different runners, know nothing about each other, and no lock separates them. Each SSHes into the VPS and issues `docker compose up -d` — two identical commands, seconds apart, acting on the very same set of containers.',
    },
    duration: 2900,
    edge: 'e_ci2_vps',
    kind: 'INTERNAL',
    nodeStates: { vps: 'processing', ci2: 'success' },
    packetLabel: 'up -d (lần 2)',
    alsoInFlight: [{ edge: 'e_ghcr_vps', at: 0.6, label: 'up -d (lần 1)', kind: 'INTERNAL' }],
    sfx: 'buzz',
  });

  push({
    id: 'collide',
    title: { vi: 'Va chạm: container bị tạo lại khi đang được tạo lại', en: 'Collision: a container is recreated while being recreated' },
    detail: {
      vi: 'Lệnh thứ hai bắt đầu gỡ container mà lệnh thứ nhất vừa dựng lên. Docker không có hàng đợi cho việc này — nó thực hiện đúng điều được yêu cầu. Kết quả là một tiến trình bị SIGKILL giữa chừng: `Exited (137)`, đúng mã thoát của lần OOM, nhưng lần này RAM hoàn toàn bình thường.',
      en: 'The second command starts tearing down the container the first just brought up. Docker has no queue for this — it does exactly what it was told. The result is a process SIGKILLed mid-flight: `Exited (137)`, the same exit code as an OOM, except memory here is perfectly fine.',
    },
    duration: 3200,
    at: 'vps',
    kind: 'ERROR',
    nodeStates: { vps: 'error' },
    packetLabel: 'Exited (137)',
    sfx: 'error',
    log: { vi: 'cuonghoangdev_backend  Exited (137)', en: 'cuonghoangdev_backend  Exited (137)' },
    teachingNote: {
      vi: 'Điểm dễ chẩn đoán nhầm nhất: 137 ở đây KHÔNG phải hết RAM, mà là bị lệnh song song giết.',
      en: 'The easiest misdiagnosis: this 137 is not memory exhaustion, it is a parallel command killing it.',
    },
  });

  push({
    id: 'orphan',
    title: { vi: 'Container mồ côi giữ mất tên, cái mới không dựng được', en: 'An orphan holds the name and the new container cannot start' },
    detail: {
      vi: 'Compose từ chối tạo container trùng `container_name`, nên khi một bản dở dang còn nằm đó thì bản mới không bao giờ lên được. Website chết — và nó chết SAU KHI cả hai workflow đều báo màu xanh, vì mỗi workflow chỉ nhìn thấy phần việc của chính nó.',
      en: 'Compose refuses to create a container with a duplicate `container_name`, so while a half-dead one lingers the replacement never comes up. The site is down — and it went down AFTER both workflows reported green, because each only ever saw its own half of the story.',
    },
    duration: 3100,
    at: 'vps',
    kind: 'ERROR',
    nodeStates: { vps: 'error', ci: 'success', ci2: 'success' },
    sfx: 'buzz',
    log: { vi: 'Conflict: container name đã được dùng · site 502', en: 'Conflict: container name already in use · site 502' },
  });

  push({
    id: 'recover',
    title: { vi: 'Cứu tại chỗ: khởi động lại container đang nằm', en: 'On-the-spot recovery: start the stopped container' },
    detail: {
      vi: 'Ảnh vẫn nguyên vẹn, dữ liệu vẫn nguyên vẹn — chỉ có tiến trình bị giết. `docker start cuonghoangdev_backend` đưa site trở lại trong vài giây. Sau đó mới dọn container mồ côi bằng `docker compose up -d --remove-orphans`, lúc chắc chắn không còn workflow nào đang chạy.',
      en: 'The image is intact, the data is intact — only the process was killed. `docker start cuonghoangdev_backend` brings the site back within seconds. Only then clean up the orphans with `docker compose up -d --remove-orphans`, once you are certain no workflow is still running.',
    },
    duration: 3000,
    at: 'vps',
    kind: 'ACK',
    nodeStates: { vps: 'success' },
    packetLabel: 'docker start',
    sfx: 'success',
    log: { vi: '$ docker start cuonghoangdev_backend → Up', en: '$ docker start cuonghoangdev_backend → Up' },
  });

  push({
    id: 'prevent',
    title: { vi: 'Cách phòng: một đường deploy duy nhất', en: 'Prevention: exactly one deployment path' },
    detail: {
      vi: 'Ba cách, xếp theo độ chắc chắn. Chắc nhất: chỉ để MỘT workflow được phép deploy, cái còn lại chỉ kiểm tra. Kế đó: dùng `concurrency: { group: deploy, cancel-in-progress: false }` để GitHub tự xếp hàng thay vì chạy song song. Và cách dự án này đang dùng: deploy bằng `bash deploy.sh` từ máy cá nhân, kiểm tra sản xuất xong mới push lên GitHub — khi đó push chỉ còn là đồng bộ mã, không còn là hành động deploy nữa.',
      en: 'Three options, ordered by robustness. Strongest: let exactly ONE workflow deploy and reduce the other to checks. Next: add `concurrency: { group: deploy, cancel-in-progress: false }` so GitHub queues them instead of running both. And what this project actually does: deploy with `bash deploy.sh` from the laptop, verify production, and only then push to GitHub — at which point the push is just code sync, no longer a deployment.',
    },
    duration: 3300,
    at: 'dev',
    nodeStates: { dev: 'active', vps: 'success' },
    sfx: 'lock',
    log: { vi: 'concurrency: group: deploy · cancel-in-progress: false', en: 'concurrency: group: deploy · cancel-in-progress: false' },
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const cicdPipelineScenario: Scenario = {
  id: 'cicd-pipeline',
  name: { vi: 'CI/CD — và cuộc đua giữa hai workflow', en: 'CI/CD — and the race between two workflows' },
  tagline: {
    vi: 'push → kiểm kiểu → dựng ảnh → GHCR → VPS kéo về. Nhưng hai workflow cùng nghe một sự kiện push sẽ cùng gọi `up -d` trên một máy chủ: container bị giết giữa chừng, mã thoát 137, site chết sau khi cả hai đều báo xanh.',
    en: 'push → type check → build → GHCR → the VPS pulls. But two workflows listening to one push both call `up -d` on the same server: a container killed mid-flight, exit code 137, and the site goes down after both report green.',
  },
  icon: GitPullRequest,
  accent: '#a78bfa',
  group: 'devops',
  lesson: {
    course: 'nodejs',
    code: '17.6',
    slug: 'nodejs-17-6-deploy-hong-quay-lui',
    title: { vi: 'Khi deploy nói dối: build cũ, smoke test, quay lui', en: 'When the deploy lies: stale builds, smoke tests, rollback' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'mode',
      label: { vi: 'Tình huống', en: 'Situation' },
      defaultValue: 'happy',
      choices: [
        {
          value: 'happy',
          label: 'Một workflow',
          fullLabel: 'Đường CI/CD chạy đúng',
          color: '#34d399',
          hint: { vi: 'thẻ theo commit, không dùng latest', en: 'SHA tags, never latest' },
        },
        {
          value: 'race',
          label: 'Hai workflow đua nhau',
          fullLabel: 'Exited(137) mà RAM vẫn bình thường',
          color: '#f43f5e',
          hint: { vi: 'cả hai báo xanh, site vẫn chết', en: 'both green, site still down' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.mode === 'race' ? buildRace() : buildHappy()),
};
