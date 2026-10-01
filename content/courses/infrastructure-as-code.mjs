/**
 * Infrastructure as Code: Terraform & Ansible — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo kế hoạch
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Soạn chi tiết SAU theo content/courses/docker/_HOP-DONG.md. Xem _chung/khung.mjs.
 * Không trùng: cloud-aws Ch8 (Terraform 1 chương trên AWS) — ở đây có bài "Nếu đã học …" rồi đi sâu (state, module, import, drift,
 * test, bảo mật state, OpenTofu); deploy-vps (script deploy) và self-hosting (dựng tay home lab) — ở đây biến chúng thành code.
 * Hạ tầng thực hành bám hạ tầng thật của user: VPS Ubuntu + Cloudflare DNS/R2 + Docker Compose + GitHub Actions.
 * Ảnh bìa: người điều phối dựng (logo simple-icons terraform).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'infrastructure-as-code',
    title: 'Infrastructure as Code: Terraform & Ansible',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/infrastructure-as-code.png?v=4',
    shortDescription: 'Infrastructure you can rebuild: Terraform/OpenTofu (state, modules, import, drift), Ansible roles, Packer, IaC testing and GitOps — a VPS, Cloudflare DNS and R2 built from code.|||Hạ tầng dựng lại được: Terraform/OpenTofu (state, module, import, drift), role Ansible, Packer, kiểm thử IaC và GitOps — VPS, DNS Cloudflare và R2 dựng từ code.',
    description: 'Khoá cho người đã tự dựng server bằng tay và muốn không bao giờ phải nhớ lại "lần trước mình đã gõ những gì". Bắt đầu từ các sự cố do cấu hình trôi dạt và thao tác tay (Knight Capital 2012 mất khoảng 440 triệu USD trong 45 phút vì một máy chủ còn mã cũ; sự cố S3 us-east-1 tháng 2/2017 do một lệnh gõ sai tham số) và lịch sử công cụ (CFEngine 1993, Puppet 2005, Chef 2009, Ansible 2012, Terraform 2014, OpenTofu 2023). Học Terraform/OpenTofu từ HCL tới state từ xa, khoá state, module, workspace và môi trường, import tài nguyên có sẵn, phát hiện drift, refactor bằng moved/removed; Ansible từ inventory, playbook, handler, template Jinja2 tới role, Vault và Molecule; Packer và cloud-init để dựng image; kiểm thử IaC (validate, tflint, terraform test, Terratest) và quét bảo mật (Checkov, Trivy); bảo mật state và bí mật; IaC trong CI (plan trên PR, apply có duyệt) và GitOps nhập môn (Argo CD/Flux). Dự án cuối khoá: dựng lại toàn bộ hạ tầng kiểu cuongthai.com (VPS Ubuntu, DNS và WAF Cloudflare, bucket R2, Docker Compose, PostgreSQL, sao lưu) và LabFlow chỉ bằng code, rồi phá máy và dựng lại có bấm giờ.',
    whatYouLearn: 'Giải thích vì sao IaC và khi nào dùng Terraform, khi nào dùng Ansible; viết Terraform quản lý DNS, WAF, R2 trên Cloudflare và một VPS; lưu state từ xa có khoá và mã hoá; tách module và môi trường dev/prod; import tài nguyên đang chạy mà không phá; phát hiện và xử lý drift; viết playbook Ansible idempotent cài Docker, siết SSH, triển khai Compose; đóng gói thành role có test Molecule; dựng image với Packer và cloud-init; chạy plan/apply trong GitHub Actions với OIDC và duyệt tay; quét IaC bằng Checkov; dựng lại hạ tầng từ số 0 trong thời gian đo được.',
    requirements: 'Linux dòng lệnh, SSH, Git, Docker Compose cơ bản, có một tài khoản Cloudflare và (tuỳ chọn) một VPS dùng cho lab. Nên học trước: Linux & Bash, Deploy lên VPS, Docker, GitHub Actions; khoá Cloud AWS là điểm cộng.',
    documentsNote: 'Tài liệu chính: developer.hashicorp.com/terraform • opentofu.org/docs • registry.terraform.io/providers/cloudflare/cloudflare • docs.ansible.com • docs.ansible.com/ansible-lint • ansible.readthedocs.io/projects/molecule • developer.hashicorp.com/packer • cloudinit.readthedocs.io • checkov.io • github.com/terraform-linters/tflint • argo-cd.readthedocs.io • fluxcd.io • "Terraform: Up & Running" (Yevgeniy Brikman, O’Reilly) • "Infrastructure as Code" (Kief Morris, O’Reilly).',
  },
  sections: khung('iac', [
    ['Section 0 — Why infrastructure should be code', 'Mục 0 — Vì sao hạ tầng nên là code', 'Từ server "bông tuyết" gõ tay tới hạ tầng dựng lại được.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What Infrastructure as Code is, its history, and the outages caused by hand-built servers', 'Bắt đầu tại đây (1/2) — Infrastructure as Code là gì, lịch sử, và những sự cố do server dựng tay', 'Công thức nấu ăn thay cho trí nhớ · Mốc: CFEngine 1993, Puppet 2005, Chef 2009, Ansible 2012, Terraform 2014, Terraform đổi giấy phép và OpenTofu ra đời 2023 · Knight Capital 2012: một máy chủ lệch cấu hình · S3 us-east-1 02/2017: một lệnh gõ sai · Pets vs cattle'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, roles, and the learning path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, vị trí công việc, và lộ trình', 'Vị trí: DevOps, Platform Engineer, SRE, Cloud Engineer · Việc làm được sau khoá: dựng lại hạ tầng của mình từ số 0 bằng một lệnh · Chứng chỉ: HashiCorp Terraform Associate, Red Hat (EX294) · Khoá nền nên học trước'],
      ['lab', 'Lab setup: Terraform/OpenTofu, Ansible, a Cloudflare test zone, local VMs with Multipass or Vagrant', 'Dựng lab: Terraform/OpenTofu, Ansible, một zone Cloudflare để thử, VM tại máy bằng Multipass hoặc Vagrant', 'Cài tfenv/tofu và ansible bằng pipx · API token Cloudflare phạm vi hẹp · VM Ubuntu tại máy nhà thay cho VPS · Tách hẳn khỏi prod'],
    ]],
    ['Chapter 1 — IaC concepts and choosing tools', 'Chương 1 — Khái niệm IaC và chọn công cụ', 'Khai báo vs mệnh lệnh, cấp phát vs cấu hình.', [
      ['khai-bao', 'Declarative vs imperative, and the idea of desired state', 'Khai báo vs mệnh lệnh, và ý tưởng trạng thái mong muốn', 'Mô tả kết quả thay vì các bước · Hội tụ về trạng thái · So với script bash deploy · Tính idempotent'],
      ['cap-phat-cau-hinh', 'Provisioning vs configuration management vs image building', 'Cấp phát vs quản lý cấu hình vs dựng image', 'Terraform tạo máy, Ansible cấu hình máy, Packer đóng image · Mutable vs immutable · Chỗ giao nhau'],
      ['chon', 'The landscape: Terraform, OpenTofu, Pulumi, CloudFormation, CDK, Ansible, Salt, Nix', 'Toàn cảnh: Terraform, OpenTofu, Pulumi, CloudFormation, CDK, Ansible, Salt, Nix', 'HCL vs ngôn ngữ lập trình thật · Khoá vào một cloud hay đa cloud · Giấy phép BSL và OpenTofu · Chọn gì cho đội nhỏ'],
      ['git', 'IaC workflow: Git, pull requests, review of plans', 'Quy trình IaC: Git, pull request, review bản plan', 'Mọi thay đổi hạ tầng qua PR · Đọc plan như đọc diff · Không sửa tay trên console'],
    ]],
    ['Chapter 2 — Terraform fundamentals', 'Chương 2 — Terraform căn bản', 'HCL, provider, resource và vòng đời plan/apply.', [
      ['neu-da-hoc-aws', 'If you took Cloud AWS: the Terraform chapter in ten minutes', 'Nếu đã học khoá Cloud AWS: chương Terraform trong mười phút', 'Link /courses/cloud-aws Chương 8 · init/plan/apply nhắc lại · Khoá này đi tiếp: không phụ thuộc AWS, Cloudflare và VPS, state và module sâu'],
      ['hcl', 'HCL: blocks, arguments, expressions, types', 'HCL: block, đối số, biểu thức, kiểu dữ liệu', 'resource, data, variable, output, locals · Chuỗi nội suy · list/map/object · terraform fmt và validate'],
      ['provider', 'Providers and the registry: Cloudflare, a VPS provider, random, tls', 'Provider và registry: Cloudflare, một nhà cung cấp VPS, random, tls', 'Khai báo required_providers và ghim phiên bản · .terraform.lock.hcl · Xác thực bằng biến môi trường · Đọc tài liệu provider'],
      ['vong-doi', 'The lifecycle: init, plan, apply, destroy, and reading a plan', 'Vòng đời: init, plan, apply, destroy, và đọc một bản plan', 'Tạo/sửa/thay thế/xoá · Dấu ~ và -/+ · Plan lưu ra file · Thay đổi nào gây xoá dữ liệu'],
      ['cloudflare', 'First real resources: Cloudflare DNS records and an R2 bucket', 'Tài nguyên thật đầu tiên: bản ghi DNS Cloudflare và một bucket R2', 'Zone có sẵn qua data source · A/CNAME/MX/TXT · Proxied hay không · Bucket R2 và CORS'],
    ]],
    ['Chapter 3 — Variables, expressions and dependencies', 'Chương 3 — Biến, biểu thức và phụ thuộc', 'Viết cấu hình linh hoạt mà vẫn đọc được.', [
      ['bien', 'Input variables, validation, sensitive values and tfvars', 'Biến đầu vào, kiểm tra hợp lệ, giá trị nhạy cảm và tfvars', 'Kiểu và giá trị mặc định · validation block · sensitive = true không có nghĩa là mã hoá · tfvars theo môi trường'],
      ['vong-lap', 'count, for_each, dynamic blocks and conditionals', 'count, for_each, dynamic block và điều kiện', 'for_each theo map ổn định hơn count · Tạo nhiều bản ghi DNS từ một map · dynamic cho quy tắc lặp · Toán tử ba ngôi'],
      ['phu-thuoc', 'Dependencies: implicit references, depends_on and the resource graph', 'Phụ thuộc: tham chiếu ngầm, depends_on và đồ thị tài nguyên', 'terraform graph · Khi nào cần depends_on · Vòng phụ thuộc · Song song hoá'],
      ['lifecycle', 'lifecycle rules: prevent_destroy, create_before_destroy, ignore_changes', 'Quy tắc lifecycle: prevent_destroy, create_before_destroy, ignore_changes', 'Chặn xoá nhầm CSDL/bucket · Thay mới không downtime · Bỏ qua trường do hệ khác sửa · Dùng có chừng mực'],
    ]],
    ['Chapter 4 — State: the heart and the danger', 'Chương 4 — State: trái tim và mối nguy', 'State là thứ Terraform tin — mất hay lộ state đều đau.', [
      ['state-la-gi', 'What state is and why Terraform needs it', 'State là gì và vì sao Terraform cần nó', 'Ánh xạ code ↔ tài nguyên thật · terraform state list/show · State chứa bí mật dạng rõ · Không sửa tay file state'],
      ['remote', 'Remote state and locking: S3-compatible backends (R2), Terraform Cloud, pg backend', 'State từ xa và khoá: backend tương thích S3 (R2), Terraform Cloud, backend pg', 'Backend s3 trỏ vào R2 · Khoá state để hai người không apply cùng lúc · Backend PostgreSQL · Phiên bản hoá state'],
      ['bao-mat', 'Securing state: encryption, access control, and OpenTofu state encryption', 'Bảo mật state: mã hoá, kiểm soát truy cập, và mã hoá state của OpenTofu', 'Ai đọc được bucket state · Mã hoá phía client trong OpenTofu · Bí mật không nên qua state (dùng tham chiếu) · Nhật ký truy cập'],
      ['phau-thuat', 'State surgery: moved, removed, state mv/rm and recovering from mistakes', 'Phẫu thuật state: moved, removed, state mv/rm và cứu khi lỡ tay', 'Refactor tên resource không xoá tạo lại · Bỏ quản lý mà không xoá tài nguyên · Khôi phục từ phiên bản state cũ · Diễn tập trong lab'],
    ]],
    ['Chapter 5 — Modules and environments', 'Chương 5 — Module và môi trường', 'Tái sử dụng và tách dev/staging/prod.', [
      ['module', 'Writing modules: inputs, outputs, composition', 'Viết module: đầu vào, đầu ra, kết hợp', 'Module "site" gồm DNS + bucket + WAF · Giao diện nhỏ, rõ · Không lồng quá sâu · README và ví dụ'],
      ['registry', 'Using registry modules safely and versioning your own', 'Dùng module từ registry an toàn và phiên bản hoá module của mình', 'Ghim phiên bản · Đọc code trước khi dùng · Tag Git cho module nội bộ · Semantic versioning'],
      ['moi-truong', 'Environments: workspaces vs directory layout vs Terragrunt', 'Môi trường: workspace vs cấu trúc thư mục vs Terragrunt', 'Workspace dễ nhầm prod · Mỗi môi trường một thư mục và một state · Terragrunt giảm lặp · Chọn cho đội nhỏ'],
      ['cau-truc', 'Structuring a real repository and limiting blast radius', 'Cấu trúc một repo thật và giới hạn phạm vi ảnh hưởng', 'Tách state theo tầng: mạng/DNS, dữ liệu, ứng dụng · Plan nhỏ, review dễ · Quyền apply theo tầng'],
    ]],
    ['Chapter 6 — Living with existing infrastructure: import and drift', 'Chương 6 — Sống với hạ tầng có sẵn: import và drift', 'Đưa hạ tầng dựng tay vào code mà không phá nó.', [
      ['import', 'Importing existing resources: import blocks and generated config', 'Nhập tài nguyên có sẵn: import block và sinh cấu hình', 'import {} + terraform plan -generate-config-out · Nhập zone Cloudflare đang chạy · cf-terraforming · Plan phải rỗng sau khi nhập'],
      ['drift', 'Detecting and handling drift', 'Phát hiện và xử lý drift', 'plan -refresh-only · Plan định kỳ trong CI báo drift · Sửa code theo thực tế hay ép thực tế theo code · Nguồn drift: sửa tay trên dashboard'],
      ['nang-cap', 'Upgrading Terraform and providers without surprises', 'Nâng cấp Terraform và provider không bất ngờ', 'Đọc changelog và hướng dẫn nâng cấp · Nâng từng bước · Provider Cloudflare đổi phiên bản lớn · Chuyển Terraform sang OpenTofu'],
    ]],
    ['Chapter 7 — Ansible fundamentals', 'Chương 7 — Ansible căn bản', 'Cấu hình máy qua SSH, không cần agent.', [
      ['inventory', 'Inventory, connection and ad-hoc commands', 'Inventory, kết nối và lệnh ad-hoc', 'Inventory INI/YAML · Nhóm và biến nhóm · ansible all -m ping · SSH key và ProxyJump (như đường vào máy nhà qua VPS)'],
      ['playbook', 'Playbooks, tasks, modules and handlers', 'Playbook, task, module và handler', 'apt, copy, template, service, user · Handler khởi động lại khi đổi cấu hình · --check và --diff · Thứ tự thực thi'],
      ['idempotent', 'Idempotency: why shell tasks break it and how to fix them', 'Tính idempotent: vì sao task shell phá nó và cách sửa', 'Chạy hai lần kết quả như nhau · changed_when/creates · Ưu tiên module thay cho shell · Kiểm bằng lần chạy thứ hai phải changed=0'],
      ['bien-template', 'Variables, facts, Jinja2 templates and precedence', 'Biến, facts, template Jinja2 và thứ tự ưu tiên', 'group_vars/host_vars · ansible_facts · Template nginx.conf · Thứ tự ưu tiên biến và cái bẫy của nó'],
      ['ssh-hardening', 'A first real playbook: users, SSH hardening, firewall, unattended upgrades', 'Playbook thật đầu tiên: người dùng, siết SSH, tường lửa, tự cập nhật bảo mật', 'Drop-in sshd tên 01- (bài học thứ tự file của web này) · Kiểm bằng sshd -T · ufw · unattended-upgrades'],
    ]],
    ['Chapter 8 — Ansible at scale', 'Chương 8 — Ansible ở quy mô lớn', 'Role, bí mật, kiểm thử và chất lượng.', [
      ['role', 'Roles and collections: structure, defaults, dependencies, Galaxy', 'Role và collection: cấu trúc, defaults, phụ thuộc, Galaxy', 'Role docker, nginx, postgres · defaults vs vars · Collection community.docker · Ghim phiên bản trong requirements.yml'],
      ['vault', 'Secrets with Ansible Vault and external lookups', 'Bí mật với Ansible Vault và tra cứu bên ngoài', 'Mã hoá file biến · Mật khẩu vault ở đâu · Lookup từ SOPS/1Password/Vault · no_log cho task nhạy cảm'],
      ['molecule', 'Testing roles with Molecule and ansible-lint', 'Kiểm thử role với Molecule và ansible-lint', 'Kịch bản Molecule trên container · Kiểm idempotent tự động · ansible-lint trong CI'],
      ['compose', 'Deploying Docker Compose stacks with Ansible', 'Triển khai cụm Docker Compose bằng Ansible', 'Chép compose + .env từ vault · docker_compose_v2 module · Ghi đè file tại chỗ cho bind-mount (bài học inode của web này) · Rolling restart'],
    ]],
    ['Chapter 9 — Images and bootstrapping: Packer and cloud-init', 'Chương 9 — Image và khởi tạo máy: Packer và cloud-init', 'Máy mới lên là đã đúng cấu hình.', [
      ['cloud-init', 'cloud-init: user-data for first boot', 'cloud-init: user-data cho lần khởi động đầu', 'Tạo user, SSH key, gói cài sẵn · Gọi Ansible pull · Log cloud-init để gỡ lỗi · Bẫy: cloud-init ghi drop-in sshd'],
      ['packer', 'Building golden images with Packer', 'Dựng golden image với Packer', 'Template HCL · Provisioner Ansible · Image cho nhiều cloud · Phiên bản hoá image'],
      ['immutable', 'Immutable infrastructure: replace, do not patch', 'Hạ tầng bất biến: thay, không vá', 'Khi nào hợp (máy stateless) · Khi nào không (máy có PostgreSQL) · Kết hợp với Terraform'],
    ]],
    ['Chapter 10 — Testing, security and policy for IaC', 'Chương 10 — Kiểm thử, bảo mật và chính sách cho IaC', 'Hạ tầng cũng cần test như code.', [
      ['kiem-tra', 'Static checks: fmt, validate, tflint, ansible-lint', 'Kiểm tĩnh: fmt, validate, tflint, ansible-lint', 'Chạy trong pre-commit và CI · Quy tắc tflint cho provider · Chặn biến không dùng'],
      ['test', 'Testing Terraform: terraform test, Terratest and ephemeral environments', 'Kiểm thử Terraform: terraform test, Terratest và môi trường tạm', 'terraform test với mock provider · Terratest (Go) dựng thật rồi huỷ · Chi phí và thời gian · Test cái gì cho đáng'],
      ['bao-mat', 'Security scanning: Checkov, Trivy config, and the misconfigurations that matter', 'Quét bảo mật: Checkov, Trivy config, và những cấu hình sai quan trọng', 'Bucket công khai, cổng mở, thiếu mã hoá · Ngoại lệ có lý do · Trỏ khoá DevSecOps và Bảo mật Cloud'],
      ['policy', 'Policy as code for plans: OPA/Conftest on plan JSON', 'Policy as code cho plan: OPA/Conftest trên plan dạng JSON', 'terraform show -json · Cấm xoá tài nguyên có nhãn prod · Giới hạn loại máy · Chạy trước apply'],
    ]],
    ['Chapter 11 — IaC in CI/CD and GitOps', 'Chương 11 — IaC trong CI/CD và GitOps', 'Không ai apply từ laptop nữa.', [
      ['ci', 'Plan on pull request, apply on merge with approval, in GitHub Actions', 'Plan trên pull request, apply khi merge có duyệt, trong GitHub Actions', 'Bình luận plan vào PR · Environment prod có người duyệt · Apply đúng plan đã duyệt · Khoá concurrency'],
      ['oidc', 'Credentials in CI: OIDC, scoped Cloudflare tokens, no long-lived keys', 'Thông tin xác thực trong CI: OIDC, token Cloudflare phạm vi hẹp, không khoá sống lâu', 'OIDC tới AWS/GCP · Token Cloudflare chỉ quyền DNS của một zone · Bí mật theo environment'],
      ['atlantis', 'Atlantis and Terraform Cloud/HCP at a glance', 'Lướt qua Atlantis và Terraform Cloud/HCP', 'Chạy plan/apply qua bình luận PR · Khi nào đáng dùng · Chi phí'],
      ['gitops', 'GitOps with Argo CD or Flux: Git as the source of truth for clusters', 'GitOps với Argo CD hoặc Flux: Git là nguồn sự thật cho cụm', 'Kéo thay vì đẩy · Tự đồng bộ và phát hiện lệch · Quản bí mật với Sealed Secrets/SOPS · Trỏ khoá Kubernetes'],
    ]],
    ['Chapter 12 — Capstone: rebuild a real stack from nothing', 'Chương 12 — Dự án cuối khoá: dựng lại một hệ thống thật từ con số 0', 'Hạ tầng kiểu cuongthai.com và LabFlow, chỉ bằng code.', [
      ['terraform', 'Terraform: VPS, firewall, Cloudflare DNS, WAF rules, R2 buckets, remote state on R2', 'Terraform: VPS, tường lửa, DNS Cloudflare, quy tắc WAF, bucket R2, state từ xa trên R2', 'Import zone thật (ở zone thử) · Module theo tầng · prevent_destroy cho bucket dữ liệu'],
      ['ansible', 'Ansible: base hardening, Docker, nginx, Compose stack with PostgreSQL and backups', 'Ansible: siết cơ bản, Docker, nginx, cụm Compose có PostgreSQL và sao lưu', 'Role tái sử dụng · Bí mật qua Vault · Sao lưu pg_dump lên R2 bằng cron · LabFlow Spring Boot trong Compose'],
      ['ci', 'Pipeline: plan/apply and playbook runs from GitHub Actions with approvals', 'Pipeline: plan/apply và chạy playbook từ GitHub Actions có duyệt', 'Drift check hằng đêm · Checkov chặn cấu hình sai · Ghi nhật ký mọi lần apply'],
      ['dien-tap', 'Disaster drill: destroy the server and rebuild it, timed, including data restore', 'Diễn tập thảm hoạ: xoá máy và dựng lại, có bấm giờ, gồm cả phục hồi dữ liệu', 'Đo thời gian từ số 0 tới web sống · Phục hồi PostgreSQL từ bản sao lưu · Ghi lại mọi bước còn phải làm tay và loại bỏ chúng'],
    ]],
    ['Chapter 13 — Interviews and certifications', 'Chương 13 — Phỏng vấn và chứng chỉ', 'Chuẩn bị cho vị trí DevOps/Platform.', [
      ['terraform-associate', 'HashiCorp Certified: Terraform Associate — scope and practice', 'HashiCorp Certified: Terraform Associate — phạm vi và cách luyện', 'Các mảng thi · Câu hỏi về state, module, workflow · Kiểm phiên bản đề mới nhất trên trang HashiCorp'],
      ['ansible-cert', 'Red Hat Certified Engineer (EX294) and Ansible skills employers look for', 'Red Hat Certified Engineer (EX294) và kỹ năng Ansible nhà tuyển dụng tìm', 'Thi thực hành · Chủ đề chính · Có đáng với sinh viên không'],
      ['cau-hoi', 'Interview questions: state, drift, Terraform vs Ansible, zero-downtime changes', 'Câu hỏi phỏng vấn: state, drift, Terraform vs Ansible, thay đổi không downtime', 'State lưu ở đâu và vì sao · Hai người apply cùng lúc thì sao · Import tài nguyên có sẵn · Kể một lần plan cứu bạn'],
    ]],
  ]),
};
