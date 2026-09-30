/**
 * Bảo mật Cloud, Container & Kubernetes — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo kế hoạch
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Công khai như các khoá khung khác (bài chưa soạn hiện "Đang soạn").
 * Soạn chi tiết SAU theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 * Không trùng: docker (Ch6 ảnh an toàn, Ch15 rootless), kubernetes (Ch8 RBAC/NetworkPolicy/PSS cơ bản), cloud-aws (Ch1 IAM),
 * web-security (Ch7 bí mật) — ở đây có bài "Nếu đã học …" rồi đi sâu (tấn công thật, CIS, admission, runtime, CSPM).
 * Ảnh bìa: người điều phối dựng (logo simple-icons kubernetes).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 },
  course: {
    slug: 'cloud-container-security',
    title: 'Cloud, Container & Kubernetes Security',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/cloud-container-security.png?v=1',
    shortDescription: 'Cloud and container security: shared responsibility, least-privilege IAM, exposed buckets, secrets and KMS, image scanning, runtime hardening, Kubernetes policy, Falco, CIS and CSPM.|||Bảo mật cloud và container: trách nhiệm chia sẻ, IAM quyền tối thiểu, bucket lộ công khai, bí mật và KMS, quét image, siết runtime, chính sách Kubernetes, Falco, CIS và CSPM.',
    description: 'Khoá nâng cao cho người đã biết Docker, Linux và (tối thiểu) Kubernetes cơ bản. Bắt đầu từ các vụ lộ dữ liệu cloud có thật (Capital One 2019, cụm Kubernetes của Tesla bị đào coin 2018) để hiểu kẻ tấn công thật sự đi đường nào; mô hình trách nhiệm chia sẻ; IAM quyền tối thiểu ở mức chính sách và điều kiện; bucket S3/R2 lộ công khai và URL ký; quản lý bí mật, KMS và envelope encryption; chuỗi an toàn của image (quét Trivy/Grype, distroless, ký); siết runtime container (non-root, rootless, capabilities, seccomp, AppArmor, read-only); Kubernetes: API server, RBAC, NetworkPolicy, Pod Security Admission, admission bằng Kyverno/OPA Gatekeeper, bí mật trong etcd; phát hiện lúc chạy bằng Falco; CIS Benchmark với kube-bench/docker-bench; CSPM và tư thế bảo mật đa cloud; và dự án cuối khoá: siết toàn bộ hạ tầng kiểu cuongthai.com (VPS Ubuntu + Docker Compose + R2 + Cloudflare) và một cụm k3s chạy LabFlow.',
    whatYouLearn: 'Giải thích mô hình trách nhiệm chia sẻ và chỉ ra phần nào là việc của bạn; viết chính sách IAM quyền tối thiểu và kiểm bằng công cụ phân tích; phát hiện và đóng bucket lộ công khai; đưa bí mật ra khỏi image và biến môi trường vào secrets manager; quét và ký image trong CI; chạy container non-root, read-only, drop capabilities, có seccomp/AppArmor; viết RBAC, NetworkPolicy, Pod Security và chính sách Kyverno cho một cụm thật; dựng Falco bắt hành vi lạ; chạy kube-bench/docker-bench và sửa theo CIS; chuẩn bị cho CKS và AWS Security Specialty.',
    requirements: 'Linux dòng lệnh, Docker và Docker Compose thành thạo, Kubernetes cơ bản (Pod, Deployment, Service), biết một cloud (AWS hoặc Cloudflare). Nên học trước: khoá Docker, Kubernetes, Cloud AWS và Bảo mật web.',
    documentsNote: 'Tài liệu chính: kubernetes.io/docs/concepts/security • CIS Benchmarks (cisecurity.org) • NSA/CISA "Kubernetes Hardening Guidance" • OWASP Kubernetes Top Ten • docs.aws.amazon.com/IAM • aquasecurity.github.io/trivy • falco.org/docs • kyverno.io/docs • open-policy-agent.github.io/gatekeeper • developers.cloudflare.com/r2 • "Container Security" (Liz Rice, O’Reilly).',
  },
  sections: khung('ccs', [
    ['Section 0 — Why cloud and container security is its own discipline', 'Mục 0 — Vì sao bảo mật cloud & container là một nghề riêng', 'Bảo mật khi máy chủ không còn là của mình và ứng dụng chạy trong container.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What cloud and container security is, its history, and the breaches that shaped it', 'Bắt đầu tại đây (1/2) — Bảo mật cloud & container là gì, lịch sử, và những vụ lộ dữ liệu đã định hình nó', 'Thuê máy người khác thì bảo vệ cái gì · Mốc: AWS 2006, Docker 2013, Kubernetes 2014, Pod Security Policy bị gỡ ở 1.25 (2022) · Capital One 2019: SSRF → metadata → khoá IAM → ~100 triệu hồ sơ · Tesla 2018: bảng điều khiển Kubernetes không mật khẩu bị đào coin · CVE-2019-5736: thoát container qua runc · Vì sao cấu hình sai là nguyên nhân số một'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and the path through it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và lộ trình', 'Vị trí: Cloud Security Engineer, DevSecOps, Platform/SRE có mảng bảo mật · Việc làm được sau khoá: siết VPS + Compose + R2 của chính mình, siết một cụm k3s · Chứng chỉ liên quan: CKS, AWS Security Specialty · Khoá nền cần có: Docker, Kubernetes, Cloud AWS, Bảo mật web'],
      ['lab', 'Building the lab: a disposable VPS, k3s and kind, and a free cloud account', 'Dựng lab: VPS dùng xong vứt, k3s và kind, và một tài khoản cloud miễn phí', 'kind/k3d trên máy nhà · k3s trên một VPS riêng cho lab (không đụng prod) · Tài khoản AWS free tier + cảnh báo chi phí · Công cụ: trivy, kube-bench, kubectl, falco · Quy tắc: chỉ tấn công lab của mình'],
    ]],
    ['Chapter 1 — Shared responsibility and the cloud attack surface', 'Chương 1 — Trách nhiệm chia sẻ và bề mặt tấn công của cloud', 'Nhà cung cấp lo gì, bạn lo gì, và kẻ tấn công nhìn cloud của bạn ra sao.', [
      ['shared-responsibility', 'The shared responsibility model across IaaS, PaaS, SaaS and containers', 'Mô hình trách nhiệm chia sẻ qua IaaS, PaaS, SaaS và container', 'Bảng ai lo phần nào · VPS Ubuntu: bạn lo từ kernel trở lên · R2/Cloudflare: bạn lo quyền và cấu hình · Chỗ hay bị bỏ quên: log, sao lưu, danh tính'],
      ['ke-tan-cong', 'How attackers actually get in: credentials, misconfiguration, exposed services', 'Kẻ tấn công thật sự vào bằng đường nào: khoá lộ, cấu hình sai, dịch vụ phơi ra', 'Khoá truy cập lộ trên GitHub bị quét trong vài phút · Dashboard/etcd/Docker API mở ra Internet · SSRF tới metadata · Chuỗi tấn công điển hình từ một lỗi nhỏ'],
      ['metadata', 'The instance metadata service and why IMDSv2 exists', 'Dịch vụ metadata của máy ảo và vì sao có IMDSv2', '169.254.169.254 trả khoá tạm · Tái hiện kịch bản Capital One trong lab · IMDSv2 bắt token + hop limit · Chặn metadata từ container'],
      ['nhat-ky-cloud', 'Cloud audit logs: CloudTrail, Cloudflare audit logs and what to keep', 'Nhật ký kiểm toán của cloud: CloudTrail, audit log Cloudflare và nên giữ gì', 'Ai gọi API gì lúc nào · Bật từ ngày đầu, không bật lúc có sự cố · Lưu tách tài khoản · Trỏ khoá Blue Team SIEM để phân tích'],
    ]],
    ['Chapter 2 — Identity and least privilege, in depth', 'Chương 2 — Danh tính và quyền tối thiểu, đi sâu', 'IAM là tường lửa mới của cloud.', [
      ['neu-da-hoc-aws', 'If you took the Cloud AWS course: the IAM core in ten minutes', 'Nếu đã học khoá Cloud AWS: cốt lõi IAM trong mười phút', 'User/role/policy nhắc lại · Link /courses/cloud-aws · Khoá này đi tiếp: điều kiện, ranh giới quyền, phân tích quyền'],
      ['chinh-sach', 'Reading and writing policies: conditions, resource scoping, deny wins', 'Đọc và viết chính sách: điều kiện, giới hạn tài nguyên, deny luôn thắng', 'Condition theo IP/VPC/MFA/tag · Wildcard nguy hiểm ở đâu · Explicit deny · Permission boundary và SCP'],
      ['phan-tich', 'Finding excess permissions: Access Analyzer, last-used data and policy linting', 'Tìm quyền thừa: Access Analyzer, dữ liệu dùng lần cuối và kiểm lỗi chính sách', 'IAM Access Analyzer tạo chính sách từ CloudTrail · Quyền chưa dùng 90 ngày · Parliament/cfn-lint · Leo thang quyền qua iam:PassRole'],
      ['khoa-may', 'Machine identity without long-lived keys: roles, OIDC, workload identity', 'Danh tính cho máy mà không cần khoá sống lâu: role, OIDC, workload identity', 'GitHub Actions → OIDC → role tạm · IRSA/Workload Identity trong Kubernetes · Token R2 phạm vi một bucket · Xoay vòng khoá còn lại'],
      ['tai-khoan', 'Account structure: separate prod, root account hygiene, break-glass', 'Cấu trúc tài khoản: tách prod, giữ tài khoản root sạch, tài khoản khẩn cấp', 'Nhiều tài khoản thay vì một · Root có MFA phần cứng, không có khoá · Tài khoản break-glass có cảnh báo · Cloudflare: thành viên và API token theo quyền'],
    ]],
    ['Chapter 3 — Storage: buckets, public exposure and data protection', 'Chương 3 — Lưu trữ: bucket, lộ công khai và bảo vệ dữ liệu', 'Bucket mở công khai vẫn là một trong những cách lộ dữ liệu phổ biến nhất.', [
      ['bucket-lo', 'How buckets end up public, and how to find yours', 'Bucket bị lộ công khai bằng cách nào, và cách tìm bucket của mình', 'ACL, bucket policy, public access block · R2: public bucket, r2.dev và custom domain · Liệt kê được khác đọc được · Quét bằng công cụ của chính nhà cung cấp'],
      ['url-ky', 'Presigned URLs done right', 'URL ký trước làm cho đúng', 'Thời hạn ngắn · Ràng buộc content-type và kích thước khi upload · Không ký URL cho khoá người dùng tự chọn · Áp vào upload ảnh của cuongthai.com'],
      ['ma-hoa', 'Encryption at rest and in transit: what it protects and what it does not', 'Mã hoá lúc lưu và lúc truyền: bảo vệ được gì và không bảo vệ được gì', 'SSE-S3 vs SSE-KMS vs mã hoá phía client · Mã hoá không cứu được quyền đọc quá rộng · TLS tới origin · Trỏ khoá Mật mã học ứng dụng'],
      ['sao-luu-bat-bien', 'Immutable backups and ransomware-resistant storage', 'Sao lưu bất biến và lưu trữ chống mã độc tống tiền', 'Object Lock / versioning · Khoá sao lưu không nằm cùng máy prod · Thử phục hồi định kỳ · Bucket log truy cập'],
    ]],
    ['Chapter 4 — Secrets management and KMS', 'Chương 4 — Quản lý bí mật và KMS', 'Đưa bí mật ra khỏi code, image và biến môi trường.', [
      ['neu-da-hoc-web', 'If you took Web Security: where secrets must never live (recap)', 'Nếu đã học Bảo mật web: nơi bí mật không được ở (nhắc lại)', 'Link /courses/web-security chương Bí mật · .env, lịch sử Git, image, log CI · Khoá này đi tiếp: kho bí mật, KMS, xoay vòng'],
      ['kho-bi-mat', 'Secrets managers: AWS Secrets Manager, HashiCorp Vault, SOPS, Docker/K8s secrets', 'Kho bí mật: AWS Secrets Manager, HashiCorp Vault, SOPS, secret của Docker/K8s', 'So sánh theo quy mô · SOPS + age cho đội nhỏ, lưu được trong Git · Vault dynamic secrets cho PostgreSQL · Docker secrets là file, không phải env'],
      ['kms', 'KMS and envelope encryption', 'KMS và mã hoá phong bì', 'Khoá chính không rời KMS · Data key mã hoá dữ liệu · Chính sách khoá tách quyền dùng và quyền quản · Nhật ký mọi lần giải mã'],
      ['xoay-vong', 'Rotation, revocation and what to do when a key leaks', 'Xoay vòng, thu hồi và làm gì khi khoá bị lộ', 'Thu hồi trước, điều tra sau · Kiểm nhật ký xem khoá đã bị dùng chưa · Tự động xoay vòng mật khẩu DB · Diễn tập lộ khoá R2'],
    ]],
    ['Chapter 5 — Image security and the container supply chain', 'Chương 5 — Bảo mật image và chuỗi cung ứng container', 'Thứ gì nằm trong image thì chạy trên máy bạn.', [
      ['neu-da-hoc-docker', 'If you took the Docker course: small and safe images (recap)', 'Nếu đã học khoá Docker: image nhỏ và an toàn (nhắc lại)', 'Link /courses/docker Chương 6 và 15 · Multi-stage, non-root, quét cơ bản · Khoá này đi tiếp: chính sách, ký, registry'],
      ['trivy', 'Scanning in depth: Trivy and Grype, reading results, triaging CVEs', 'Quét sâu: Trivy và Grype, đọc kết quả, phân loại CVE', 'OS package vs thư viện ứng dụng · CVSS không phải rủi ro thật · Có bản vá chưa, có chạy tới không · .trivyignore có hạn và lý do'],
      ['distroless', 'Base images: distroless, Chainguard/Wolfi, Alpine and the musl trap', 'Ảnh nền: distroless, Chainguard/Wolfi, Alpine và bẫy musl', 'Ít gói ít CVE · Không shell thì gỡ lỗi thế nào (kubectl debug, ephemeral container) · Bẫy musl với engine Prisma (sự cố thật của web này) · Ghim bằng digest'],
      ['registry', 'Registry security: private registries, GHCR permissions, pull by digest', 'Bảo mật registry: registry riêng, quyền GHCR, kéo theo digest', 'Tag có thể bị ghi đè · Quyền đọc/ghi package · Xoá image cũ · Mirror image công khai để không phụ thuộc Docker Hub'],
      ['ky-anh', 'Signing and verifying images with cosign', 'Ký và kiểm chữ ký image bằng cosign', 'Keyless với Sigstore · Kiểm chữ ký trước khi deploy · Attestation SBOM · Chi tiết pipeline ở khoá DevSecOps'],
    ]],
    ['Chapter 6 — Hardening the container runtime', 'Chương 6 — Siết runtime của container', 'Container không phải máy ảo: cô lập nhờ kernel, và kernel là dùng chung.', [
      ['co-lap', 'How isolation really works: namespaces, cgroups and the shared kernel', 'Cô lập thật sự hoạt động thế nào: namespace, cgroup và kernel dùng chung', 'Container là tiến trình · --privileged xoá gần hết ranh giới · Mount docker.sock = root trên host · Thoát container: các lớp lỗi đã gặp'],
      ['non-root', 'Non-root, rootless Docker, user namespaces and Podman', 'Non-root, Docker rootless, user namespace và Podman', 'USER trong Dockerfile · userns-remap · Rootless daemon và giới hạn của nó · Podman không daemon'],
      ['capabilities', 'Linux capabilities and no-new-privileges', 'Linux capabilities và no-new-privileges', 'cap_drop: [ALL] rồi thêm đúng thứ cần · NET_BIND_SERVICE · no-new-privileges chặn setuid · Viết vào docker-compose.yml'],
      ['seccomp-apparmor', 'seccomp and AppArmor profiles', 'Hồ sơ seccomp và AppArmor', 'Hồ sơ seccomp mặc định chặn gì · Sinh hồ sơ riêng từ hành vi thật · AppArmor trên Ubuntu · SELinux ở họ RHEL'],
      ['read-only', 'Read-only filesystems, resource limits and tmpfs', 'Filesystem chỉ đọc, giới hạn tài nguyên và tmpfs', 'read_only: true + tmpfs cho /tmp · Giới hạn RAM/CPU/pids chống fork bomb · Không mount thư mục host thừa · Kiểm bằng docker-bench-security'],
    ]],
    ['Chapter 7 — Kubernetes security: the control plane and access', 'Chương 7 — Bảo mật Kubernetes: control plane và quyền truy cập', 'Ai được nói chuyện với API server và được làm gì.', [
      ['neu-da-hoc-k8s', 'If you took the Kubernetes course: RBAC, NetworkPolicy, Pod Security (recap)', 'Nếu đã học khoá Kubernetes: RBAC, NetworkPolicy, Pod Security (nhắc lại)', 'Link /courses/kubernetes Chương 8 · Khái niệm cơ bản · Khoá này đi tiếp: tấn công thật, kiểm quyền, chính sách chặn'],
      ['kien-truc', 'The attack surface: API server, kubelet, etcd, dashboard', 'Bề mặt tấn công: API server, kubelet, etcd, dashboard', 'Cổng nào không được phơi ra · Kubelet anonymous auth · etcd chứa mọi Secret · Bài học Tesla 2018'],
      ['rbac-sau', 'RBAC in depth: auditing who can do what', 'RBAC đi sâu: kiểm ai làm được gì', 'kubectl auth can-i --list · Quyền nguy hiểm: create pods, get secrets, escalate, bind, impersonate · rbac-tool/kubectl-who-can · Service account token tự động mount'],
      ['audit-log', 'API server audit logging', 'Nhật ký kiểm toán của API server', 'Audit policy theo mức · Ghi ai đọc Secret · Đẩy về SIEM · Kích thước log và chi phí'],
      ['etcd-secret', 'Secrets at rest in etcd, and external secret operators', 'Secret lưu trong etcd, và các operator bí mật bên ngoài', 'Secret chỉ là base64 · EncryptionConfiguration với KMS · External Secrets Operator · Sealed Secrets cho GitOps'],
    ]],
    ['Chapter 8 — Kubernetes security: workloads, network and admission', 'Chương 8 — Bảo mật Kubernetes: workload, mạng và admission', 'Chặn cấu hình nguy hiểm trước khi nó chạy.', [
      ['pod-security', 'Pod Security Admission: privileged, baseline, restricted', 'Pod Security Admission: privileged, baseline, restricted', 'Nhãn namespace enforce/audit/warn · securityContext đầy đủ · Chuyển từ PodSecurityPolicy cũ · Ngoại lệ có kiểm soát'],
      ['network-policy', 'NetworkPolicy that actually isolates: default deny and egress', 'NetworkPolicy cô lập thật: mặc định chặn và chặn chiều ra', 'CNI có hỗ trợ không (Calico, Cilium) · Default deny ingress + egress · Cho phép DNS · Chặn Pod gọi metadata cloud'],
      ['kyverno', 'Admission control with Kyverno', 'Kiểm soát admission bằng Kyverno', 'Chính sách validate/mutate/generate · Bắt buộc image có chữ ký · Cấm tag latest · Chế độ audit trước enforce'],
      ['opa', 'OPA Gatekeeper and Rego at a glance', 'Lướt qua OPA Gatekeeper và Rego', 'ConstraintTemplate và Constraint · Rego đọc thế nào · Khi nào chọn Gatekeeper, khi nào Kyverno · ValidatingAdmissionPolicy (CEL) có sẵn trong Kubernetes'],
      ['service-mesh', 'mTLS between services and the service mesh question', 'mTLS giữa các dịch vụ và câu hỏi service mesh', 'Linkerd/Istio/Cilium cho mTLS · Chi phí vận hành · Khi nào không cần mesh · Trỏ khoá Bảo mật mạng & Zero Trust'],
    ]],
    ['Chapter 9 — Runtime detection and response', 'Chương 9 — Phát hiện và phản ứng lúc chạy', 'Khi phòng thủ phía trước đã lọt, phải thấy được hành vi lạ.', [
      ['falco', 'Falco: detecting suspicious behaviour from syscalls', 'Falco: phát hiện hành vi đáng ngờ từ syscall', 'Driver eBPF · Quy tắc có sẵn: shell trong container, đọc /etc/shadow, ghi vào /bin · Viết quy tắc riêng · Giảm báo động giả'],
      ['canh-bao', 'Routing runtime alerts: Falcosidekick, Slack, SIEM', 'Đưa cảnh báo runtime đi: Falcosidekick, Slack, SIEM', 'Mức ưu tiên · Gửi Telegram/Slack · Đẩy vào Wazuh/OpenSearch · Trỏ khoá Blue Team SIEM'],
      ['tetragon', 'eBPF enforcement: Tetragon and Tracee at a glance', 'Chặn bằng eBPF: lướt qua Tetragon và Tracee', 'Phát hiện khác chặn · Kill tiến trình theo chính sách · Rủi ro chặn nhầm trên prod'],
      ['dieu-tra-container', 'Investigating a compromised container without destroying evidence', 'Điều tra một container bị xâm nhập mà không phá bằng chứng', 'Cô lập mạng trước khi xoá · docker diff, docker export, checkpoint · Chụp bộ nhớ khi cần · Quy trình ứng phó ở khoá Incident Response'],
    ]],
    ['Chapter 10 — Benchmarks, compliance and posture management', 'Chương 10 — Benchmark, tuân thủ và quản lý tư thế bảo mật', 'Đo mức an toàn bằng chuẩn chung thay vì cảm giác.', [
      ['cis', 'CIS Benchmarks: Ubuntu, Docker, Kubernetes', 'CIS Benchmark: Ubuntu, Docker, Kubernetes', 'Level 1 vs Level 2 · Mục nào đáng làm trên VPS nhỏ · Ngoại lệ có ghi lý do · NSA/CISA Kubernetes Hardening Guidance'],
      ['kube-bench', 'Running kube-bench, docker-bench-security and Lynis', 'Chạy kube-bench, docker-bench-security và Lynis', 'Đọc báo cáo PASS/WARN/FAIL · Sửa theo thứ tự rủi ro · Chạy định kỳ bằng cron/CI · So sánh trước và sau'],
      ['cspm', 'CSPM: Prowler, ScoutSuite and cloud-native posture tools', 'CSPM: Prowler, ScoutSuite và công cụ tư thế bảo mật có sẵn của cloud', 'Quét toàn tài khoản AWS · Security Hub/GuardDuty ở mức khái niệm · Cloudflare Security Center · Ưu tiên phát hiện nào trước'],
      ['iac-scan', 'Catching misconfiguration before it ships: scanning manifests and IaC', 'Bắt cấu hình sai trước khi đưa lên: quét manifest và IaC', 'kubescape, trivy config · Checkov cho Terraform · Chạy trong CI · Chi tiết ở khoá DevSecOps và Infrastructure as Code'],
    ]],
    ['Chapter 11 — Capstone: hardening a real small-team stack', 'Chương 11 — Dự án cuối khoá: siết một hệ thống đội nhỏ có thật', 'Áp toàn bộ khoá vào hạ tầng giống cuongthai.com và LabFlow.', [
      ['danh-gia', 'Assessment: inventory and threat model of VPS + Compose + R2 + Cloudflare', 'Đánh giá: kiểm kê và mô hình hoá mối đe doạ cho VPS + Compose + R2 + Cloudflare', 'Liệt kê mọi cổng, khoá, bucket, token · Sơ đồ luồng dữ liệu · Xếp hạng rủi ro · Trỏ khoá Threat Modeling'],
      ['siet-compose', 'Hardening the Compose stack: non-root, caps, read-only, secrets, scanned images', 'Siết cụm Compose: non-root, capabilities, chỉ đọc, bí mật, image đã quét', 'Sửa docker-compose.yml từng dịch vụ · PostgreSQL không phơi cổng · Bí mật từ file · Trivy chặn trong CI'],
      ['siet-cloud', 'Hardening cloud edges: R2 tokens, Cloudflare API tokens, origin lock-down', 'Siết rìa cloud: token R2, token API Cloudflare, khoá origin', 'Token phạm vi hẹp · Origin chỉ nhận IP Cloudflare/Authenticated Origin Pulls · Bucket riêng tư + URL ký · Nhật ký kiểm toán'],
      ['k3s-labflow', 'LabFlow on k3s: RBAC, NetworkPolicy, restricted pods, Kyverno and Falco', 'LabFlow trên k3s: RBAC, NetworkPolicy, pod restricted, Kyverno và Falco', 'Spring Boot non-root trên distroless Java · Default deny · Chính sách chặn image chưa ký · Falco báo shell trong pod'],
      ['bao-cao', 'Before/after report: benchmarks, residual risk and a maintenance schedule', 'Báo cáo trước/sau: điểm benchmark, rủi ro còn lại và lịch bảo trì', 'kube-bench/docker-bench/Prowler trước và sau · Rủi ro chấp nhận có lý do · Lịch quét và xoay khoá · Trình bày như một buổi review bảo mật'],
    ]],
    ['Chapter 12 — Interviews and certifications', 'Chương 12 — Phỏng vấn và chứng chỉ', 'Chuẩn bị cho vị trí cloud/container security và kỳ thi liên quan.', [
      ['cks', 'Certified Kubernetes Security Specialist (CKS): scope and how to practise', 'Certified Kubernetes Security Specialist (CKS): phạm vi và cách luyện', 'Yêu cầu có CKA trước · Thi thực hành trên terminal · Các mảng: cluster setup, hardening, supply chain, runtime · Luyện bằng killer.sh (đi kèm đăng ký thi)'],
      ['aws-security', 'AWS Certified Security – Specialty and cloud security interviews', 'AWS Certified Security – Specialty và phỏng vấn cloud security', 'Các mảng thi · IAM, KMS, logging, incident response · Câu hỏi hay gặp: Capital One sai ở đâu · Kiểm đề cương mới nhất trên trang AWS'],
      ['cau-hoi', 'Common interview questions with reasoning', 'Câu hỏi phỏng vấn hay gặp kèm lập luận', 'Container khác VM về bảo mật · Vì sao không mount docker.sock · Secret K8s có an toàn không · Thiết kế quyền cho CI deploy'],
    ]],
  ]),
};
