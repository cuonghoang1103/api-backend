/**
 * Extra project (DevOps) — DevOps Platform (Kubernetes + Terraform).
 *
 * Opens with the same warning as the microservices study: most systems do not
 * need this. Build it anyway for one idea — the reconciliation loop, which is
 * a design pattern rather than a feature of a tool, and which explains why
 * manual fixes never survive.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./devops-kubernetes-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./devops-kubernetes-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'devops-kubernetes-platform',
  title: 'DevOps Platform (Kubernetes + Terraform)',
  titleEn: 'DevOps Platform (Kubernetes + Terraform)',
  description:
    'Hạ tầng khai báo bằng mã, triển khai theo giai đoạn có tự quay lui, và quan sát được. Bài mở đầu bằng lời cảnh báo: phần lớn hệ thống KHÔNG cần Kubernetes. Nhưng ý tưởng trung tâm của nó — vòng lặp hoà giải — là một trong những ý tưởng đẹp nhất trong kỹ thuật phần mềm, và áp dụng được ngoài hạ tầng.',
  descriptionEn:
    'Declarative infrastructure as code, progressive delivery with automatic rollback, and observability. It opens with a warning: most systems do NOT need Kubernetes. But its central idea — the reconciliation loop — is one of the most elegant in software engineering, and it applies beyond infrastructure.',
  techStack: [
    'Kubernetes', 'Terraform', 'Helm', 'Argo CD', 'Prometheus', 'Grafana',
    'OpenTelemetry', 'Loki', 'HashiCorp Vault', 'GitHub Actions', 'Go',
  ],
  role: 'Hạ tầng / vận hành (một người)',
  roleEn: 'Infrastructure / operations (solo)',
  duration: '6–8 tuần',
  durationEn: '6–8 weeks',
  status: 'PLANNING',
  category: 'DevOps',
  difficulty: 'ADVANCED',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/devops-kubernetes-platform.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `# VÒNG LẶP HOÀ GIẢI — ý tưởng đáng học nhất của cả dự án.
# Cách nghĩ quen thuộc là RA LỆNH: chạy lệnh này, sửa cấu hình kia. Vấn đề là
# sau một trăm lệnh, KHÔNG AI BIẾT trạng thái hiện tại là gì — nó là kết quả
# tích luỹ của mọi thứ từng được gõ.
#
# Ở đây bạn KHAI BÁO trạng thái mong muốn, và một bộ điều khiển liên tục so
# sánh với trạng thái thực tế rồi hành động để thu hẹp khoảng cách. Mãi mãi.
#
#   Hệ quả 1: máy chủ chết ⇒ bản sao mất ⇒ tự khởi động lại chỗ khác
#   Hệ quả 2: sửa TAY thì nó QUAY LẠI — phải sửa BẢN KHAI BÁO
#   Hệ quả 3: trạng thái mong muốn là một TỆP ⇒ vào kho mã, có lịch sử,
#             xem xét được, quay lui được
#
# Ý tưởng này rộng hơn Kubernetes rất nhiều: bất cứ khi nào có "trạng thái
# mong muốn" viết được ra và "trạng thái thực tế" đọc được ra, bạn viết được
# một vòng lặp hoà giải. Nó là MẪU HÌNH THIẾT KẾ, không phải tính năng.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: prod
  labels:
    team: platform          # quy trách nhiệm chi phí và sự cố
spec:
  replicas: 3               # trạng thái MONG MUỐN — vòng lặp đuổi theo
  template:
    spec:
      containers:
        - name: api
          # ⚠️ GHIM THEO MÃ BĂM, KHÔNG dùng nhãn động. Nhãn "latest" nghĩa là
          # hai bản sao khởi động cách nhau một giờ có thể chạy HAI PHIÊN BẢN
          # KHÁC NHAU, và bạn không có cách nào biết. Quay lui cũng vô nghĩa.
          image: ghcr.io/org/api@sha256:9f2a...c41e
          resources:
            requests:
              cpu: 250m       # thiếu request thì bộ lập lịch xếp sai chỗ
              memory: 256Mi
            limits:
              # ⚠️ Vượt hạn mức BỘ NHỚ là bị GIẾT, không phải bị làm chậm.
              # Khác hẳn CPU (vượt thì bị điều tiết). Đặt quá thấp là tự tạo
              # ra sự cố khởi động lại liên tục.
              memory: 512Mi
          env:
            # ❌ KHÔNG: ghi thẳng bí mật ở đây ⇒ nằm trong kho mã VĨNH VIỄN,
            #    kể cả sau khi xoá đi, vì lịch sử git còn.
            # ⚠️ Đối tượng Secret mặc định CHỈ MÃ HOÁ BASE64 — mà base64 là
            #    phép mã hoá KÝ TỰ, KHÔNG phải mã hoá bảo mật. Ai cũng giải
            #    ngược trong một lệnh. Đây là hiểu lầm phổ biến nhất.
            # ✓ Kho bí mật ngoài + danh tính theo tải công việc: ứng dụng
            #    chứng minh nó là ai, kho cấp mã thông báo NGẮN HẠN, và không
            #    có bí mật dài hạn nào nằm trên đĩa. Rò rỉ một bản sao cấu
            #    hình KHÔNG còn là rò rỉ mật khẩu, và xoay vòng bí mật không
            #    cần triển khai lại.
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef: { name: db-creds, key: password }

---
# HẠN MỨC THEO KHÔNG GIAN TÊN: không có thì một đội chiếm hết cụm.
apiVersion: v1
kind: ResourceQuota
metadata: { name: prod-quota, namespace: prod }
spec:
  hard:
    limits.cpu: "40"
    limits.memory: 80Gi
    pods: "150"

---
# CỔNG CHỈ SỐ CHO PHÁT HÀNH THEO GIAI ĐOẠN.
# Triển khai theo giai đoạn mà KHÔNG có ngưỡng tự động thì chỉ là triển khai
# CHẬM — vẫn cần người ngồi nhìn bảng chỉ số. Quay lui phải TỰ ĐỘNG và nhanh
# hơn thời gian một người kịp đọc cảnh báo: sự cố 30 giây khác hẳn sự cố 30
# phút, và khác biệt đó nằm ở chỗ có ai phải thức dậy hay không.
analysis:
  steps: [5, 25, 50, 100]        # phần trăm lưu lượng
  metrics:
    - name: error-rate
      threshold: 0.01            # vượt ⇒ quay lui TỰ ĐỘNG
    - name: latency-p99-ms
      threshold: 800`,

  schemaCodeEn: `# THE RECONCILIATION LOOP — the idea most worth learning here.
# The familiar way of thinking is IMPERATIVE: run this command, edit that
# config. The problem is that after a hundred commands, NOBODY KNOWS what the
# current state is — it is the accumulated result of everything ever typed.
#
# Here you DECLARE the desired state, and a controller continuously compares
# it against actual state and acts to close the gap. Forever.
#
#   Consequence 1: a node dies ⇒ a replica is lost ⇒ it restarts elsewhere
#   Consequence 2: fix it BY HAND and it COMES BACK — change the DECLARATION
#   Consequence 3: the desired state is a FILE ⇒ it lives in the repository,
#                  has history, gets reviewed, and can be reverted
#
# The idea generalises far beyond Kubernetes: whenever you have a writable
# "desired state" and a readable "actual state", you can write a reconciliation
# loop. It is a DESIGN PATTERN, not a feature.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: prod
  labels:
    team: platform          # attributes cost and incidents
spec:
  replicas: 3               # the DESIRED state the loop chases
  template:
    spec:
      containers:
        - name: api
          # ⚠️ PIN BY DIGEST, never a moving tag. A "latest" tag means two
          # replicas started an hour apart can run TWO DIFFERENT VERSIONS,
          # with no way for you to know. It also renders rollback meaningless.
          image: ghcr.io/org/api@sha256:9f2a...c41e
          resources:
            requests:
              cpu: 250m       # without requests the scheduler places badly
              memory: 256Mi
            limits:
              # ⚠️ Exceeding a MEMORY limit KILLS the container rather than
              # slowing it — importantly different from CPU, where exceeding
              # causes throttling. Setting it too low manufactures a restart
              # loop.
              memory: 512Mi
          env:
            # ❌ NOT: secrets written here ⇒ in the repository PERMANENTLY,
            #    even after deletion, because git history keeps them.
            # ⚠️ The default Secret object is ONLY BASE64 ENCODED — and base64
            #    is a CHARACTER encoding, NOT encryption. Anyone reverses it
            #    with one command. This is the field's commonest misunderstanding.
            # ✓ External secret store + workload identity: the application
            #    proves who it is, the store issues a SHORT-LIVED token, and no
            #    long-lived secret sits on disk. Leaking a config copy is NO
            #    LONGER leaking the password, and rotation needs no redeploy.
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef: { name: db-creds, key: password }

---
# PER-NAMESPACE QUOTAS: without them, one team consumes the cluster.
apiVersion: v1
kind: ResourceQuota
metadata: { name: prod-quota, namespace: prod }
spec:
  hard:
    limits.cpu: "40"
    limits.memory: 80Gi
    pods: "150"

---
# METRIC GATES FOR PROGRESSIVE DELIVERY.
# Staged rollout WITHOUT automatic thresholds is merely SLOW deployment —
# somebody still has to watch a dashboard. Rollback must be AUTOMATIC and
# faster than a human can read an alert: a 30-second incident differs
# fundamentally from a 30-minute one, and the difference is whether anybody
# has to wake up.
analysis:
  steps: [5, 25, 50, 100]        # traffic percentages
  metrics:
    - name: error-rate
      threshold: 0.01            # breaching it triggers AUTOMATIC rollback
    - name: latency-p99-ms
      threshold: 800`,
  schemaLang: 'yaml',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Biết vì sao phần lớn hệ thống KHÔNG cần cái này',
      titleEn: 'Know why most systems do NOT need this',
      description:
        'Ba dịch vụ và một database trên hai máy chủ với docker compose là kiến trúc hoàn toàn hợp lý — rẻ hơn, dễ gỡ lỗi hơn, ít thứ hỏng hơn. Vẫn nên làm dự án này, nhưng vì ý tưởng trung tâm chứ không vì công cụ: vòng lặp hoà giải là mẫu hình thiết kế áp dụng được ở nhiều nơi ngoài hạ tầng.',
      descriptionEn:
        'Three services and a database on two servers with docker compose is a perfectly reasonable architecture — cheaper, easier to debug, fewer moving parts. Build this project anyway, but for the central idea rather than the tool: the reconciliation loop is a design pattern that applies well beyond infrastructure.',
    },
    {
      phase: 'BACKEND',
      title: 'Vòng lặp hoà giải: khai báo trạng thái, đừng ra lệnh',
      titleEn: 'The reconciliation loop: declare state, do not issue commands',
      description:
        'Sau một trăm lệnh ra tay, không ai biết trạng thái hiện tại là gì. Khai báo trạng thái mong muốn rồi để bộ điều khiển liên tục so sánh và thu hẹp khoảng cách. Hệ quả gây bối rối nhất cho người mới: sửa tay thì nó tự quay lại — bạn không sửa hệ thống, bạn sửa MÔ TẢ về hệ thống. Nhưng đó cũng là điều làm nó đáng tin: không thao tác tay nào tồn tại lâu.',
      descriptionEn:
        'After a hundred imperative commands, nobody knows the current state. Declare the desired state and let a controller continuously compare and close the gap. The most disorienting consequence for newcomers: manual edits revert — you do not fix the system, you fix the DESCRIPTION of it. But that is also what makes it trustworthy: no manual action survives.',
    },
    {
      phase: 'BACKEND',
      title: 'Hạ tầng bằng mã, và bài toán tệp trạng thái',
      titleEn: 'Infrastructure as code, and the state file problem',
      description:
        'Cái bẫy lớn nhất không phải cú pháp mà là tệp trạng thái: để trên máy cá nhân thì đồng nghiệp chạy sẽ tạo trùng toàn bộ hạ tầng; hai người chạy cùng lúc thì trạng thái hỏng. Và điều rất nhiều người không biết — tệp trạng thái CHỨA GIÁ TRỊ THẬT của mọi thứ được tạo ra, gồm cả mật khẩu ban đầu của database, nên phải bảo vệ ngang với bí mật sản xuất.',
      descriptionEn:
        'The biggest trap is not syntax but the state file: kept on a laptop, a colleague\'s run duplicates the entire infrastructure; two simultaneous runs corrupt it. And what many people do not know — the state file CONTAINS THE ACTUAL VALUES of everything created, including a database\'s initial password, so it deserves production-secret protection.',
    },
    {
      phase: 'BACKEND',
      title: 'Bí mật: base64 KHÔNG phải mã hoá',
      titleEn: 'Secrets: base64 is NOT encryption',
      description:
        'Hiểu lầm phổ biến nhất của lĩnh vực: đối tượng bí mật mặc định chỉ mã hoá base64, mà base64 là phép mã hoá ký tự chứ không phải mã hoá bảo mật — ai cũng giải ngược trong một lệnh. Cách đúng là kho bí mật ngoài cộng danh tính theo tải công việc: ứng dụng chứng minh nó là ai, kho cấp mã thông báo ngắn hạn, và rò rỉ một bản sao cấu hình không còn là rò rỉ mật khẩu.',
      descriptionEn:
        'The field\'s commonest misunderstanding: the default Secret object is only base64 encoded, and base64 is a character encoding rather than encryption — anyone reverses it in one command. The correct approach is an external store plus workload identity: the application proves who it is, the store issues short-lived tokens, and leaking a config copy no longer leaks the password.',
    },
    {
      phase: 'BACKEND',
      title: 'Phát hành theo giai đoạn có cổng chỉ số tự động',
      titleEn: 'Progressive delivery with automatic metric gates',
      description:
        'Triển khai theo giai đoạn mà không có ngưỡng tự động thì chỉ là triển khai chậm — vẫn cần người ngồi nhìn bảng chỉ số và tự quyết. Quay lui phải tự động và nhanh hơn thời gian một người kịp đọc cảnh báo. Điều kiện để nó hoạt động: phải có chỉ số ĐO ĐƯỢC ứng với "hỏng" — tỉ lệ lỗi, độ trễ p99, tỉ lệ giao dịch thất bại.',
      descriptionEn:
        'Staged rollout without automatic thresholds is merely slow deployment — somebody still watches a dashboard and decides. Rollback must be automatic and faster than a human can read an alert. The precondition: a MEASURABLE metric corresponding to "broken" — error rate, p99 latency, transaction failure rate.',
    },
    {
      phase: 'BACKEND',
      title: 'Quan sát: ba loại dữ liệu, dùng theo đúng thứ tự',
      titleEn: 'Observability: three data types, used in the right order',
      description:
        'Chỉ số trả lời "có đang hỏng không", truy vết trả lời "chậm ở đâu", nhật ký trả lời "chuyện gì đã xảy ra". Thứ tự dùng gần như luôn là chỉ số báo động → truy vết chỉ ra dịch vụ → nhật ký cho chi tiết. Ai cũng bắt đầu bằng nhật ký vì nó quen thuộc, nhưng nhật ký là thứ đắt nhất và khó tổng hợp nhất.',
      descriptionEn:
        'Metrics answer "is something broken", traces answer "where is it slow", logs answer "what happened". The usage order is almost always metrics raise the alarm → traces identify the service → logs give detail. Everyone starts with logs because they are familiar, but logs are the most expensive and hardest to aggregate.',
    },
    {
      phase: 'BACKEND',
      title: 'Cảnh báo phải HÀNH ĐỘNG ĐƯỢC, nếu không nó tự vô hiệu hoá',
      titleEn: 'Alerts must be ACTIONABLE, or they disable themselves',
      description:
        '"CPU trên 80%" không phải cảnh báo — có thể hoàn toàn bình thường. "Tỉ lệ lỗi thanh toán vượt 1% trong 5 phút" mới là cảnh báo, vì nó nói rõ ai bị ảnh hưởng và cần làm gì. Cảnh báo không hành động được sẽ bị bỏ qua, và rồi cảnh báo thật cũng bị bỏ qua theo — đây là cơ chế tự huỷ của mọi hệ thống giám sát non tay.',
      descriptionEn:
        '"CPU above 80%" is not an alert — it may be entirely normal. "Payment error rate above 1% for 5 minutes" is, because it names who is affected and what to do. Unactionable alerts get ignored, and then real alerts get ignored with them — the self-destruct mechanism of every immature monitoring setup.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách xoá sạch rồi dựng lại chỉ từ mã',
      titleEn: 'Verify by destroying everything and rebuilding from code alone',
      description:
        'Phép kiểm quyết định của cả dự án: xoá toàn bộ hạ tầng rồi dựng lại CHỈ TỪ MÃ và hệ thống phải hoạt động trở lại. Kèm theo: xoá tay một bản sao thì nó quay lại dưới 30 giây, triển khai bản có lỗi thì quay lui tự động dưới 2 phút, và hai người chạy công cụ hạ tầng cùng lúc thì người thứ hai bị chặn chứ không làm hỏng trạng thái.',
      descriptionEn:
        'The decisive check of this project: destroy the whole infrastructure and rebuild FROM CODE ALONE, and the system must work again. Alongside: a hand-deleted replica returns within 30 seconds, a broken deployment rolls back automatically within 2 minutes, and two simultaneous infrastructure runs block the second rather than corrupting state.',
    },
  ],

  features: [
    { title: 'Hạ tầng khai báo dựng lại được từ số không', titleEn: 'Declarative infrastructure rebuildable from nothing', description: 'Mọi thứ ở trong kho mã, có lịch sử và xem xét được.', descriptionEn: 'Everything in the repository, with history and review.', status: 'PLANNED' },
    { title: 'Triển khai tự động từ kho mã', titleEn: 'Automated deployment from the repository', description: 'Trạng thái cụm luôn khớp với thứ được ghi trong git.', descriptionEn: 'Cluster state always matches what git says.', status: 'PLANNED' },
    { title: 'Phát hành theo giai đoạn có cổng chỉ số', titleEn: 'Progressive delivery with metric gates', description: '5% → 25% → 50% → 100%, quay lui tự động khi vượt ngưỡng.', descriptionEn: '5% → 25% → 50% → 100%, with automatic rollback on breach.', status: 'PLANNED' },
    { title: 'Bí mật từ kho ngoài, mã thông báo ngắn hạn', titleEn: 'Secrets from an external store with short-lived tokens', description: 'Xoay vòng mật khẩu không cần triển khai lại ứng dụng.', descriptionEn: 'Rotating a password needs no application redeploy.', status: 'PLANNED' },
    { title: 'Quan sát đủ ba loại dữ liệu', titleEn: 'Observability across all three data types', description: 'Chỉ số, truy vết, nhật ký có cấu trúc, nối bằng mã truy vết.', descriptionEn: 'Metrics, traces and structured logs joined by a trace id.', status: 'PLANNED' },
    { title: 'Hạn mức tài nguyên theo không gian tên', titleEn: 'Per-namespace resource quotas', description: 'Một đội không thể chiếm hết cụm của các đội khác.', descriptionEn: 'No team can consume the cluster at another team\'s expense.', status: 'PLANNED' },
    { title: 'Phát hiện lệch giữa mã và thực tế', titleEn: 'Drift detection between code and reality', description: 'Sửa tay bị hoàn nguyên, và có cảnh báo cho biết đã có ai sửa.', descriptionEn: 'Manual edits revert, with an alert that somebody changed something.', status: 'PLANNED' },
    { title: 'Ảnh container ghim theo mã băm', titleEn: 'Digest-pinned container images', description: 'Không nhãn động, để quay lui có ý nghĩa thật.', descriptionEn: 'No moving tags, so rollback actually means something.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Kubernetes — Controllers and the reconciliation loop', titleEn: 'Kubernetes — Controllers and the reconciliation loop', url: 'https://kubernetes.io/docs/concepts/architecture/controller/', type: 'LINK', description: 'Mô tả ngắn gọn ý tưởng trung tâm của cả dự án này.', descriptionEn: 'A concise description of this project\'s central idea.' },
    { title: 'Google SRE Book', titleEn: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/', type: 'LINK', description: 'Đọc miễn phí. Chương về cảnh báo và mục tiêu mức dịch vụ đáng đọc trước khi dựng giám sát.', descriptionEn: 'Free to read. The alerting and service-level chapters are worth reading before building monitoring.' },
    { title: 'Terraform — State and remote backends', titleEn: 'Terraform — State and remote backends', url: 'https://developer.hashicorp.com/terraform/language/state', type: 'LINK', description: 'Gồm cả cảnh báo rằng tệp trạng thái chứa giá trị thật của bí mật.', descriptionEn: 'Including the warning that state files contain secrets in plain form.' },
    { title: 'Kubernetes — Encrypting secret data at rest', titleEn: 'Kubernetes — Encrypting secret data at rest', url: 'https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/', type: 'LINK', description: 'Chính tài liệu nói rõ Secret mặc định chỉ mã hoá base64.', descriptionEn: 'The documentation stating plainly that Secrets are only base64 encoded by default.' },
    { title: 'OpenTelemetry', titleEn: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/', type: 'LINK', description: 'Chuẩn chung cho cả ba loại dữ liệu quan sát, và cách truyền ngữ cảnh xuyên dịch vụ.', descriptionEn: 'One standard for all three observability signals, and how context propagates across services.' },
  ],

  coreKnowledge: [
    { vi: 'Vòng lặp hoà giải như một mẫu hình thiết kế, không chỉ một công cụ', en: 'The reconciliation loop as a design pattern rather than a tool feature' },
    { vi: 'Khai báo so với ra lệnh, và vì sao khai báo dựng lại được', en: 'Declarative versus imperative, and why declarative is reproducible' },
    { vi: 'Hạ tầng bằng mã và quản lý trạng thái dùng chung', en: 'Infrastructure as code and shared state management' },
    { vi: 'Quản lý bí mật: danh tính theo tải công việc và mã thông báo ngắn hạn', en: 'Secret management: workload identity and short-lived tokens' },
    { vi: 'Phát hành theo giai đoạn và quay lui tự động theo chỉ số', en: 'Progressive delivery and metric-driven automatic rollback' },
    { vi: 'Ba loại dữ liệu quan sát và chi phí của từng loại', en: 'The three observability signals and what each one costs' },
    { vi: 'Thiết kế cảnh báo theo tác động, không theo tài nguyên', en: 'Designing alerts around impact rather than around resources' },
    { vi: 'Giới hạn tài nguyên và cách ly nhiều đội trên một cụm', en: 'Resource limits and multi-team isolation on one cluster' },
  ],

  portfolioBonus: [
    { vi: 'Video xoá sạch hạ tầng rồi dựng lại chỉ từ mã', en: 'A video destroying the infrastructure and rebuilding from code alone' },
    { vi: 'Video triển khai bản có lỗi và hệ thống tự quay lui', en: 'A video deploying a broken version and the system rolling back on its own' },
    { vi: 'Mục README giải thích vì sao dự án của bạn CÓ hoặc KHÔNG cần Kubernetes', en: 'A README arguing whether your project does or does not need Kubernetes' },
    { vi: 'Biểu đồ chi phí theo đội, dựng từ nhãn tài nguyên', en: 'A per-team cost chart built from resource labels' },
    { vi: 'Báo cáo kiểm thử hỗn loạn: đã giết gì, hệ thống phản ứng ra sao', en: 'A chaos test report: what was killed and how the system responded' },
  ],

  completionOutcomes: [
    { vi: 'Vận hành được hệ thống nhiều thành phần mà không cần thao tác tay', en: 'Operate multi-component systems without manual intervention' },
    { vi: 'Áp dụng vòng lặp hoà giải cho những bài toán ngoài hạ tầng', en: 'Apply reconciliation loops to problems outside infrastructure' },
    { vi: 'Thiết kế quy trình phát hành mà sự cố tự giới hạn phạm vi', en: 'Design release processes where incidents limit their own blast radius' },
    { vi: 'Xử lý bí mật đúng cách trong hệ thống tự động hoá', en: 'Handle secrets correctly inside automated systems' },
    { vi: 'Biết khi nào một công cụ mạnh là lựa chọn sai cho quy mô của mình', en: 'Know when a powerful tool is the wrong choice for your scale' },
  ],

  bodyMdx,
  bodyMdxEn,
};
