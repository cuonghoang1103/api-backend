/**
 * Kubernetes — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nối tiếp
 * khoá Docker Ch15.4 (Từ Compose tới Kubernetes). Thực hành trên cụm kind/k3d cục bộ. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'kubernetes',
    title: 'Kubernetes',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/kubernetes.png?v=1',
    shortDescription: 'From Docker Compose to Kubernetes without the magic: pods, deployments, services, config and secrets, storage, ingress, health, scaling, Helm and GitOps — all on a local cluster you can break and rebuild.|||Từ Docker Compose tới Kubernetes không phép màu: pod, deployment, service, cấu hình và bí mật, lưu trữ, ingress, sức khoẻ, co giãn, Helm và GitOps — tất cả trên một cụm cục bộ bạn phá được và dựng lại được.',
    description: 'Khoá Kubernetes cho người đã biết Docker. Mọi bài chạy trên cụm kind/k3d ngay trên laptop. Đi từ vì sao cần orchestration, kiến trúc cụm, kubectl, pod, deployment và rollout, service và DNS, ConfigMap/Secret, volume và StatefulSet, ingress và TLS, probe và tài nguyên, co giãn tự động, Helm, GitOps với Argo CD, bảo mật (RBAC, NetworkPolicy, Pod Security), quan sát và gỡ lỗi, tới đưa app đặt lịch lên cụm và câu hỏi phỏng vấn.',
    whatYouLearn: 'Đọc và viết manifest YAML; triển khai, cập nhật và quay lui ứng dụng; nối các dịch vụ qua Service/Ingress; quản lý cấu hình và bí mật; chạy Postgres có dữ liệu bền; đặt probe và giới hạn tài nguyên đúng; đóng gói bằng Helm; triển khai theo GitOps; gỡ lỗi pod CrashLoopBackOff; và biết khi nào KHÔNG cần Kubernetes.',
    requirements: 'Vững Docker và Docker Compose (khoá Docker trên trang này), Linux cơ bản, YAML.',
    documentsNote: 'Tài liệu chính: kubernetes.io/docs • kind.sigs.k8s.io • k3d.io • helm.sh/docs • argo-cd.readthedocs.io • "Kubernetes Up & Running".',
  },
  sections: khung('k8s', [
    ['Section 0 — Why Kubernetes', 'Mục 0 — Vì sao Kubernetes', 'Orchestration giải quyết gì, và khi nào không cần nó.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What Kubernetes is, where it came from, and why companies use it', 'Bắt đầu tại đây (1/2) — Kubernetes là gì, ra đời thế nào, vì sao công ty dùng', 'Kubernetes bằng hình ảnh đời thường · Lịch sử: Borg của Google → Kubernetes 2014 → CNCF · Ai dùng · Câu hỏi phỏng vấn'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Kubernetes horror stories, and when you do not need it', 'Bắt đầu tại đây (2/2) — Chuyện kinh dị với Kubernetes, và khi nào không cần nó', 'Sự cố thật có nguồn · Đồ án SV dùng K8s là quá tay · Lộ trình học'],
      ['cum-cuc-bo', 'A local cluster with kind', 'Một cụm cục bộ bằng kind', 'Cài kind/kubectl · Tạo và xoá cụm · k9s'],
      ['kien-truc', 'Cluster architecture in one picture', 'Kiến trúc cụm trong một hình', 'Control plane · Node · kubelet · etcd'],
    ]],
    ['Chapter 1 — Pods and kubectl', 'Chương 1 — Pod và kubectl', 'Đơn vị nhỏ nhất và công cụ bạn dùng mỗi ngày.', [
      ['pod', 'Pods: one or more containers', 'Pod: một hay nhiều container', 'Manifest đầu tiên · Sidecar · Vòng đời'],
      ['kubectl', 'kubectl you use every day', 'kubectl dùng hằng ngày', 'get/describe/logs/exec · -o yaml · context'],
      ['yaml', 'Reading and writing manifests', 'Đọc và viết manifest', 'apiVersion/kind/metadata/spec · kubectl explain'],
      ['label', 'Labels, selectors and namespaces', 'Label, selector và namespace', 'Gắn nhãn · Chọn theo nhãn · Tách môi trường'],
    ]],
    ['Chapter 2 — Deployments', 'Chương 2 — Deployment', 'Chạy nhiều bản, cập nhật dần và quay lui.', [
      ['deployment', 'Deployments and ReplicaSets', 'Deployment và ReplicaSet', 'Số bản sao · Tự dựng lại pod chết'],
      ['rollout', 'Rolling updates and rollbacks', 'Cập nhật dần và quay lui', 'maxSurge/maxUnavailable · rollout undo'],
      ['chien-luoc', 'Blue-green and canary', 'Blue-green và canary', 'Làm tay bằng label · Khi nào cần công cụ'],
      ['jobs', 'Jobs and CronJobs', 'Job và CronJob', 'Migration một lần · Việc định kỳ'],
    ]],
    ['Chapter 3 — Services and networking', 'Chương 3 — Service và mạng', 'Pod gọi nhau bằng tên, và đưa ra ngoài.', [
      ['service', 'Service types: ClusterIP, NodePort, LoadBalancer', 'Các loại Service', 'Vì sao IP pod không dùng được · Endpoint'],
      ['dns', 'Cluster DNS', 'DNS trong cụm', 'tên.namespace.svc · Gỡ lỗi phân giải'],
      ['ingress', 'Ingress and TLS', 'Ingress và TLS', 'ingress-nginx · Route theo host/path · cert-manager'],
      ['gateway', 'Gateway API', 'Gateway API', 'Thế hệ sau của Ingress · Có nên dùng ngay'],
    ]],
    ['Chapter 4 — Configuration and secrets', 'Chương 4 — Cấu hình và bí mật', 'ConfigMap, Secret, và bí mật thật sự an toàn.', [
      ['configmap', 'ConfigMaps', 'ConfigMap', 'Biến môi trường · File cấu hình · Cập nhật'],
      ['secret', 'Secrets, and why base64 is not encryption', 'Secret, và vì sao base64 không phải mã hoá', 'Giải mã lại được · Mã hoá lúc lưu'],
      ['sealed', 'Sealed Secrets and External Secrets', 'Sealed Secrets và External Secrets', 'Để bí mật trong Git an toàn · Kéo từ secret manager'],
      ['kustomize', 'Kustomize for environments', 'Kustomize cho nhiều môi trường', 'Base + overlay · dev/prod'],
    ]],
    ['Chapter 5 — Storage and stateful apps', 'Chương 5 — Lưu trữ và ứng dụng có trạng thái', 'Volume, PVC, StatefulSet và cơ sở dữ liệu.', [
      ['volume', 'Volumes, PV and PVC', 'Volume, PV và PVC', 'StorageClass · Cấp phát động'],
      ['statefulset', 'StatefulSets', 'StatefulSet', 'Tên ổn định · Volume riêng mỗi pod'],
      ['postgres', 'Running Postgres on Kubernetes (and whether you should)', 'Chạy Postgres trên Kubernetes (và có nên không)', 'Operator · Sao lưu · Dùng dịch vụ quản lý'],
      ['sao-luu', 'Backups with Velero', 'Sao lưu bằng Velero', 'Sao lưu tài nguyên và volume · Khôi phục'],
    ]],
    ['Chapter 6 — Health, resources and scaling', 'Chương 6 — Sức khoẻ, tài nguyên và co giãn', 'Probe, request/limit và HPA.', [
      ['probe', 'Liveness, readiness and startup probes', 'Probe liveness, readiness và startup', 'Sai lầm kinh điển · Pod bị giết vòng lặp'],
      ['tai-nguyen', 'Requests, limits and OOMKilled', 'Request, limit và OOMKilled', 'QoS · Exit 137 trên K8s · Trỏ khoá Docker Ch11'],
      ['hpa', 'Horizontal Pod Autoscaler', 'Horizontal Pod Autoscaler', 'Co giãn theo CPU · metrics-server · Thử tải'],
      ['pdb', 'Disruption budgets and graceful shutdown', 'Ngân sách gián đoạn và tắt êm', 'PDB · preStop · SIGTERM'],
    ]],
    ['Chapter 7 — Packaging and delivery', 'Chương 7 — Đóng gói và đưa lên', 'Helm, GitOps và CI/CD.', [
      ['helm', 'Helm charts', 'Helm chart', 'Dùng chart có sẵn · Tự viết chart · values'],
      ['gitops', 'GitOps with Argo CD', 'GitOps với Argo CD', 'Git là nguồn sự thật · Đồng bộ · Quay lui'],
      ['cicd', 'CI/CD into a cluster', 'CI/CD vào cụm', 'Build ảnh → cập nhật manifest · Trỏ khoá GitHub Actions'],
      ['moi-truong', 'Environments and promotion', 'Môi trường và thăng cấp', 'dev → staging → prod · Ai duyệt'],
    ]],
    ['Chapter 8 — Security', 'Chương 8 — Bảo mật', 'RBAC, NetworkPolicy và Pod Security.', [
      ['rbac', 'RBAC and service accounts', 'RBAC và service account', 'Role/RoleBinding · Quyền tối thiểu'],
      ['network-policy', 'NetworkPolicies', 'NetworkPolicy', 'Mặc định mở hết · Chặn theo nhãn'],
      ['pod-security', 'Pod Security Standards', 'Pod Security Standards', 'Không root · Chỉ đọc · Capabilities'],
      ['chuoi-cung-ung', 'Image security and admission', 'Bảo mật ảnh và kiểm soát nhận', 'Quét ảnh · Chỉ cho ảnh có chữ ký'],
    ]],
    ['Chapter 9 — Observability and debugging', 'Chương 9 — Quan sát và gỡ lỗi', 'Khi pod không lên, và nhìn thấy bên trong cụm.', [
      ['go-loi', 'Debugging Pending, CrashLoopBackOff, ImagePullBackOff', 'Gỡ lỗi Pending, CrashLoopBackOff, ImagePullBackOff', 'Cây quyết định · describe + events + logs'],
      ['log-metrics', 'Logs and metrics: Prometheus and Grafana', 'Log và chỉ số: Prometheus và Grafana', 'kube-prometheus-stack · Dashboard'],
      ['ephemeral', 'Ephemeral debug containers', 'Container gỡ lỗi tạm', 'kubectl debug · Soi image không có shell'],
      ['su-co', 'Classic incidents', 'Sự cố kinh điển', 'Hết IP · Node đầy đĩa · DNS chậm'],
    ]],
    ['Chapter 10 — Managed Kubernetes and the interview', 'Chương 10 — Kubernetes được quản lý và phỏng vấn', 'EKS/GKE/AKS, chi phí và câu hỏi hay gặp.', [
      ['managed', 'EKS, GKE, AKS: what they manage for you', 'EKS, GKE, AKS: họ quản lý hộ gì', 'Control plane · Node group · Chi phí'],
      ['chi-phi', 'The real cost of running Kubernetes', 'Chi phí thật của việc chạy Kubernetes', 'Tiền · Công vận hành · So với Compose + VPS'],
      ['phong-van', 'Kubernetes interview questions', 'Câu hỏi phỏng vấn Kubernetes', 'Câu hay gặp và ý trả lời'],
      ['chung-chi', 'CKAD/CKA: worth it?', 'CKAD/CKA: có đáng thi không', 'Nội dung · Cách ôn'],
    ]],
    ['Chapter 11 — Capstone: the booking app on Kubernetes', 'Chương 11 — Dự án cuối khoá: app đặt lịch trên Kubernetes', 'Từ file Compose tới Helm chart và GitOps.', [
      ['chuyen-doi', 'From Compose to manifests', 'Từ Compose sang manifest', 'Từng service một · Lỗi Kompose'],
      ['helm-chart', 'Packaging as a Helm chart', 'Đóng gói thành Helm chart', 'values dev/prod'],
      ['gitops', 'Delivering with Argo CD', 'Đưa lên bằng Argo CD', 'Cập nhật · Quay lui'],
      ['tong-ket', 'Operate, break, fix — and the checklist', 'Vận hành, phá, sửa — và checklist', 'Diễn tập sự cố · Checklist cả khoá'],
    ]],
  ]),
};
