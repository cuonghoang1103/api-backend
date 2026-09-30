/**
 * DevSecOps: bảo mật trong CI/CD — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo kế hoạch
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm B). Soạn chi tiết SAU theo content/courses/docker/_HOP-DONG.md. Xem _chung/khung.mjs.
 * Không trùng: web-security Ch7–8 (bí mật, npm audit/Dependabot/SBOM mức nhập môn), github-actions Ch6 (bí mật, GITHUB_TOKEN, OIDC)
 * và Ch14 (máy quét, attestation), docker 6.5 (quét image) — mỗi chỗ chạm có bài "Nếu đã học …" rồi đi sâu thành một
 * chương trình DevSecOps hoàn chỉnh (SAST/SCA/DAST/IaC/SBOM/ký/SLSA/policy, đo lường, văn hoá).
 * Ảnh bìa: người điều phối dựng (logo simple-icons githubactions).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 },
  course: {
    slug: 'devsecops',
    title: 'DevSecOps: Security in CI/CD',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/devsecops.png?v=1',
    shortDescription: 'Security inside CI/CD: secret scanning, SAST, dependency and IaC scanning, DAST with ZAP, SBOM, signing with Sigstore, SLSA and a hardened GitHub Actions pipeline.|||Bảo mật trong CI/CD: quét bí mật, SAST, quét thư viện và IaC, DAST với ZAP, SBOM, ký bằng Sigstore, SLSA và một pipeline GitHub Actions được siết.',
    description: 'Khoá cho lập trình viên và DevOps muốn biến bảo mật thành một phần của mỗi lần commit thay vì một đợt kiểm tra cuối. Bắt đầu từ các vụ tấn công chuỗi cung ứng có thật (SolarWinds 2020, Codecov 2021, Log4Shell 2021, xz-utils 2024, action tj-actions/changed-files bị chiếm 2025) để hiểu vì sao pipeline chính là mục tiêu. Học: mô hình dịch trái và vòng đời phát triển an toàn; pre-commit và quét bí mật (gitleaks, trufflehog, push protection); SAST (Semgrep, CodeQL, SpotBugs/Find Security Bugs cho Java); SCA (Dependabot, Renovate, OSV-Scanner, Snyk) và đánh giá khả năng bị khai thác; quét image và IaC (Trivy, Checkov, tfsec/Trivy config, kube-linter); DAST với OWASP ZAP trên môi trường tạm; SBOM (CycloneDX, SPDX, Syft) và VEX; ký artifact và image với Sigstore/cosign, chứng nhận nguồn gốc SLSA; policy as code (OPA/Conftest); siết chính GitHub Actions (quyền tối thiểu, OIDC, ghim action theo SHA, runner, pull_request_target); quản lý lỗ hổng, SLA vá, đo lường và văn hoá. Dự án cuối khoá: dựng pipeline DevSecOps đầy đủ cho LabFlow (Spring Boot + React) và backend Node.js kiểu cuongthai.com.',
    whatYouLearn: 'Thiết kế một pipeline có cổng bảo mật ở từng giai đoạn; chặn bí mật trước khi vào Git; chạy và tinh chỉnh Semgrep/CodeQL, viết quy tắc Semgrep riêng; phân loại cảnh báo phụ thuộc theo khả năng khai thác (EPSS, KEV, reachability); quét image và Terraform/Kubernetes trong CI; chạy ZAP baseline/API scan an toàn; sinh SBOM, ký image bằng cosign keyless và kiểm chữ ký khi deploy; đạt SLSA build level có provenance; viết chính sách Conftest; siết GitHub Actions theo khuyến nghị OpenSSF Scorecard; đặt SLA vá và đo tiến bộ.',
    requirements: 'Git, một ngôn ngữ backend (Java/Spring Boot hoặc Node.js), Docker cơ bản, GitHub Actions cơ bản. Nên học trước: Bảo mật web, GitHub Actions, Docker, Testing.',
    documentsNote: 'Tài liệu chính: owasp.org/www-project-devsecops-guideline • NIST SP 800-218 (SSDF) • slsa.dev • docs.sigstore.dev • cyclonedx.org • spdx.dev • semgrep.dev/docs • codeql.github.com/docs • osv.dev • zaproxy.org/docs • checkov.io • openssf.org (Scorecard) • docs.github.com/actions/security-guides • first.org/epss • cisa.gov/known-exploited-vulnerabilities-catalog.',
  },
  sections: khung('dso', [
    ['Section 0 — Why security moved into the pipeline', 'Mục 0 — Vì sao bảo mật chuyển vào đường ống', 'Khi phát hành mỗi ngày, kiểm tra bảo mật cuối kỳ không còn theo kịp.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What DevSecOps is, where it came from, and the supply-chain attacks that made it urgent', 'Bắt đầu tại đây (1/2) — DevSecOps là gì, từ đâu ra, và những vụ tấn công chuỗi cung ứng khiến nó thành cấp bách', 'Bảo mật là việc của mọi người, sớm và tự động · Mốc: Microsoft SDL (2004), DevOps (khoảng 2009), NIST SSDF (2022) · SolarWinds 2020: mã độc cài vào lúc build · Codecov 2021 · Log4Shell 2021 · xz-utils 2024 · tj-actions/changed-files 2025 · Chi phí sửa lỗi theo giai đoạn'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, roles, and the learning path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, vị trí công việc, và lộ trình', 'Vị trí: DevSecOps Engineer, Application Security Engineer, Platform Engineer · Việc làm được sau khoá: một pipeline có cổng bảo mật cho dự án của mình · Khoá nền: Bảo mật web, GitHub Actions, Docker'],
      ['lab', 'Lab setup: a sample repo, GitHub Actions, local scanners and a vulnerable app', 'Dựng lab: một repo mẫu, GitHub Actions, máy quét chạy tại máy và một ứng dụng có lỗ hổng', 'Fork một repo mẫu Spring Boot + Node.js · Cài semgrep, trivy, gitleaks, syft, cosign · OWASP Juice Shop/WebGoat làm mục tiêu DAST · act để chạy workflow tại máy'],
    ]],
    ['Chapter 1 — The secure development lifecycle and shift-left', 'Chương 1 — Vòng đời phát triển an toàn và dịch trái', 'Bản đồ: kiểm gì, ở đâu, chặn hay chỉ báo.', [
      ['sdlc', 'SDL, SSDF and OWASP SAMM: the frameworks in plain words', 'SDL, SSDF và OWASP SAMM: các khung bằng lời đời thường', 'Yêu cầu → thiết kế → code → build → deploy → vận hành · Mỗi giai đoạn một loại kiểm tra · Mức trưởng thành · Trỏ khoá Threat Modeling cho giai đoạn thiết kế'],
      ['ban-do', 'Mapping tools to stages: pre-commit, PR, main, release, runtime', 'Ánh xạ công cụ vào giai đoạn: pre-commit, PR, main, phát hành, lúc chạy', 'Nhanh ở trái, sâu ở phải · Cái gì chặn merge, cái gì chỉ báo · Thời gian pipeline có giới hạn'],
      ['canh-bao', 'The findings problem: noise, triage and developer trust', 'Bài toán cảnh báo: nhiễu, phân loại và niềm tin của lập trình viên', 'Một nghìn cảnh báo thì không ai đọc · Chỉ chặn trên lỗi mới (diff-aware) · Baseline cho nợ cũ · Người sở hữu mỗi cảnh báo'],
      ['champions', 'Security champions and making it a team habit', 'Security champion và biến bảo mật thành thói quen của đội', 'Mỗi đội một người đầu mối · Checklist review bảo mật trong PR · Không đổ lỗi · Đào tạo theo lỗi thật của đội'],
    ]],
    ['Chapter 2 — Secrets: prevent, detect, respond', 'Chương 2 — Bí mật: ngăn, phát hiện, xử lý', 'Chặn bí mật trước khi vào Git và biết làm gì khi đã lọt.', [
      ['neu-da-hoc', 'If you took Web Security and GitHub Actions: where secrets live (recap)', 'Nếu đã học Bảo mật web và GitHub Actions: bí mật sống ở đâu (nhắc lại)', 'Link /courses/web-security chương Bí mật và /courses/github-actions Chương 6 · Khoá này đi tiếp: chặn tự động, quét lịch sử, quy trình thu hồi'],
      ['pre-commit', 'pre-commit hooks with gitleaks', 'Hook pre-commit với gitleaks', 'Khung pre-commit · Cấu hình gitleaks.toml và allow-list · Hook bị bỏ qua bằng --no-verify nên vẫn cần CI · Tốc độ'],
      ['quet-lich-su', 'Scanning history and verified secrets with TruffleHog', 'Quét lịch sử và bí mật đã xác thực với TruffleHog', 'Bí mật trong commit cũ vẫn là bí mật · Chế độ verified giảm nhiễu · Quét cả issue, wiki, image'],
      ['push-protection', 'GitHub secret scanning and push protection', 'Quét bí mật và push protection của GitHub', 'Đối tác tự thu hồi khoá · Mẫu tuỳ chỉnh · Bỏ qua có lý do và có nhật ký'],
      ['lo-roi', 'A secret leaked: the rotate-first playbook', 'Bí mật đã lộ: kịch bản thu hồi trước', 'Thu hồi và xoay ngay · Kiểm nhật ký sử dụng · Viết lại lịch sử Git không đủ · Rút quy tắc chặn mới'],
    ]],
    ['Chapter 3 — Static analysis (SAST)', 'Chương 3 — Phân tích tĩnh (SAST)', 'Tìm lỗi bảo mật trong mã nguồn mà không cần chạy.', [
      ['sast-la-gi', 'How SAST works: patterns, data flow and taint tracking', 'SAST hoạt động thế nào: mẫu, luồng dữ liệu và theo dấu dữ liệu bẩn', 'Source → sink · Vì sao SAST báo giả và bỏ sót · So với linter · Ngôn ngữ nào khó phân tích'],
      ['semgrep', 'Semgrep: running rule packs and writing your own rules', 'Semgrep: chạy bộ quy tắc và tự viết quy tắc', 'p/owasp-top-ten, p/java, p/nodejs · Viết quy tắc cấm $queryRawUnsafe · Chế độ taint · Chỉ báo trên diff của PR'],
      ['codeql', 'CodeQL and GitHub code scanning', 'CodeQL và code scanning của GitHub', 'Cơ sở dữ liệu mã và truy vấn QL · Bộ security-extended · SARIF và tab Security · Chi phí thời gian build với Java'],
      ['java', 'Java specifics: SpotBugs with Find Security Bugs, and Spring pitfalls', 'Riêng cho Java: SpotBugs với Find Security Bugs, và các bẫy của Spring', 'Tích hợp Maven/Gradle · Deserialization, SpEL, mass assignment · Actuator phơi ra · Áp vào LabFlow'],
      ['phan-loai', 'Triage and suppression that does not rot', 'Phân loại và tắt cảnh báo mà không mục ruỗng', 'nosemgrep có lý do · Dismiss trên GitHub có ghi chú · Rà lại định kỳ · Đo tỉ lệ dương tính thật'],
    ]],
    ['Chapter 4 — Dependencies and software composition analysis (SCA)', 'Chương 4 — Thư viện phụ thuộc và phân tích thành phần phần mềm (SCA)', 'Phần lớn mã chạy trong ứng dụng không phải do bạn viết.', [
      ['neu-da-hoc', 'If you took Web Security: npm audit, Dependabot and malicious packages (recap)', 'Nếu đã học Bảo mật web: npm audit, Dependabot và gói độc (nhắc lại)', 'Link /courses/web-security chương Chuỗi cung ứng · Khoá này đi tiếp: ưu tiên theo khả năng khai thác, chính sách, tự động hoá cập nhật'],
      ['osv', 'OSV-Scanner, Snyk, OWASP Dependency-Check and Trivy fs compared', 'So sánh OSV-Scanner, Snyk, OWASP Dependency-Check và Trivy fs', 'Nguồn dữ liệu lỗ hổng: NVD, GHSA, OSV · Lockfile là bắt buộc · Maven/Gradle vs npm · Độ phủ và độ nhiễu'],
      ['uu-tien', 'Prioritising: CVSS, EPSS, CISA KEV and reachability', 'Xếp ưu tiên: CVSS, EPSS, CISA KEV và khả năng chạy tới', 'CVSS cao chưa chắc nguy hiểm · EPSS là xác suất bị khai thác · KEV là đang bị khai thác thật · Hàm lỗi có được gọi không'],
      ['cap-nhat', 'Automated updates at scale: Renovate and Dependabot grouping', 'Cập nhật tự động quy mô lớn: gom nhóm với Renovate và Dependabot', 'Gom PR theo nhóm · Tự merge bản vá khi test xanh · Độ trễ phát hành (chờ vài ngày) chống gói độc mới · Lịch cập nhật'],
      ['giay-phep', 'License compliance and dependency policy', 'Tuân thủ giấy phép và chính sách phụ thuộc', 'GPL/AGPL trong sản phẩm đóng · Danh sách cho phép · Gói bị bỏ rơi · OpenSSF Scorecard của thư viện'],
    ]],
    ['Chapter 5 — Containers and infrastructure as code in the pipeline', 'Chương 5 — Container và IaC trong đường ống', 'Quét cấu hình trước khi nó thành hạ tầng.', [
      ['neu-da-hoc-docker', 'If you took Docker: image scanning basics (recap)', 'Nếu đã học Docker: quét image cơ bản (nhắc lại)', 'Link /courses/docker bài 6.5 · Khoá này đi tiếp: cổng chặn theo chính sách, quét lại image đã phát hành'],
      ['trivy-ci', 'Trivy in CI: image, filesystem and config scans with gates', 'Trivy trong CI: quét image, filesystem và cấu hình có cổng chặn', 'Mức chặn theo severity và có bản vá · Cache DB lỗ hổng · Xuất SARIF · Quét lại image đang chạy mỗi đêm'],
      ['iac', 'IaC scanning: Checkov, Trivy config, tfsec and kube-linter', 'Quét IaC: Checkov, Trivy config, tfsec và kube-linter', 'Bucket công khai, security group 0.0.0.0/0, pod privileged · Quét Dockerfile và docker-compose.yml · Ngoại lệ bằng annotation · Trỏ khoá Infrastructure as Code'],
      ['dockerfile', 'Dockerfile linting with Hadolint', 'Kiểm lỗi Dockerfile với Hadolint', 'USER, ghim phiên bản, ADD vs COPY · Kết hợp ShellCheck · Chặn trong PR'],
    ]],
    ['Chapter 6 — Dynamic testing (DAST) and API security testing', 'Chương 6 — Kiểm thử động (DAST) và kiểm thử bảo mật API', 'Tấn công ứng dụng đang chạy — trên môi trường của chính mình.', [
      ['zap', 'OWASP ZAP: baseline, full and API scans', 'OWASP ZAP: quét baseline, full và API', 'Baseline chỉ quan sát, full thì tấn công · Chỉ chạy trên môi trường tạm của mình · Nạp OpenAPI · Đọc báo cáo'],
      ['moi-truong', 'Ephemeral environments for DAST: Compose in CI', 'Môi trường tạm cho DAST: Docker Compose trong CI', 'Dựng app + PostgreSQL trong job · Dữ liệu seed giả · Xác thực cho scanner · Dọn sạch sau khi chạy'],
      ['api', 'API-focused testing: authz checks, fuzzing and Nuclei templates', 'Kiểm thử tập trung vào API: kiểm phân quyền, fuzzing và template Nuclei', 'Test IDOR tự động bằng hai tài khoản · Schemathesis từ OpenAPI · Nuclei với template tự viết · Trỏ khoá API design'],
      ['gioi-han', 'What DAST cannot find, and where manual testing still wins', 'DAST không tìm được gì, và chỗ kiểm thử thủ công vẫn thắng', 'Lỗi logic nghiệp vụ · Luồng nhiều bước · Pentest định kỳ · Trỏ khoá Ethical Hacking'],
    ]],
    ['Chapter 7 — SBOM, signing and provenance', 'Chương 7 — SBOM, ký số và chứng nhận nguồn gốc', 'Chứng minh được thứ đang chạy là thứ bạn đã build.', [
      ['sbom', 'SBOMs: CycloneDX vs SPDX, generating with Syft and cdxgen', 'SBOM: CycloneDX và SPDX, sinh bằng Syft và cdxgen', 'SBOM để làm gì · Sinh từ source vs từ image · Lưu kèm mỗi bản phát hành · Tra nhanh khi có Log4Shell tiếp theo'],
      ['vex', 'VEX: saying which vulnerabilities do not affect you', 'VEX: tuyên bố lỗ hổng nào không ảnh hưởng tới bạn', 'OpenVEX · Trạng thái not_affected có lý do · Scanner đọc VEX để giảm nhiễu'],
      ['cosign', 'Signing images and artifacts with Sigstore cosign (keyless)', 'Ký image và artifact bằng Sigstore cosign (keyless)', 'Fulcio cấp chứng chỉ ngắn hạn qua OIDC · Rekor là sổ công khai · Ký trong GitHub Actions · Kiểm chữ ký với danh tính workflow'],
      ['slsa', 'SLSA levels and build provenance', 'Các mức SLSA và chứng nhận nguồn gốc build', 'Build L1–L3 nghĩa là gì · slsa-github-generator · actions/attest-build-provenance · Kiểm provenance trước khi deploy'],
      ['kiem-khi-deploy', 'Verifying before deploy: from a script to an admission policy', 'Kiểm trước khi deploy: từ một script tới một chính sách admission', 'cosign verify trong deploy-nha.sh · Kyverno verifyImages trên Kubernetes · Chuyện gì xảy ra khi kiểm thất bại'],
    ]],
    ['Chapter 8 — Hardening the pipeline itself', 'Chương 8 — Siết chính đường ống', 'CI có quyền deploy lên prod — nó là mục tiêu giá trị nhất.', [
      ['neu-da-hoc-gha', 'If you took GitHub Actions: tokens, OIDC and attack surface (recap)', 'Nếu đã học GitHub Actions: token, OIDC và bề mặt tấn công (nhắc lại)', 'Link /courses/github-actions Chương 6 và 14 · Khoá này đi tiếp: mô hình mối đe doạ cho CI, kiểm tự động, runner'],
      ['ghim-action', 'Pinning actions by SHA, and the tj-actions lesson', 'Ghim action theo SHA, và bài học tj-actions', 'Tag có thể bị dời · Renovate cập nhật SHA có chú thích phiên bản · Danh sách action cho phép ở mức tổ chức · Đọc code action trước khi dùng'],
      ['quyen', 'Least-privilege workflows: permissions, environments and required reviewers', 'Workflow quyền tối thiểu: permissions, environment và người duyệt bắt buộc', 'permissions: {} mặc định · Environment prod có người duyệt · Bí mật theo environment · Branch protection và ruleset'],
      ['tiem-lenh', 'Injection and untrusted input: pull_request_target, script injection, cache poisoning', 'Tiêm lệnh và đầu vào không tin cậy: pull_request_target, tiêm script, đầu độc cache', 'Tiêu đề PR vào run: là tiêm lệnh · Dùng biến môi trường trung gian · pull_request_target + checkout code PR là lỗ hổng · Công cụ zizmor/actionlint'],
      ['runner', 'Runner security: hosted vs self-hosted, ephemeral runners, egress control', 'Bảo mật runner: runner của GitHub vs tự host, runner dùng một lần, kiểm soát chiều ra', 'Self-hosted cho repo công khai là nguy hiểm · Runner dùng một lần · Harden-Runner giám sát kết nối ra · Máy build ở nhà của web này'],
      ['scorecard', 'Measuring with OpenSSF Scorecard', 'Đo bằng OpenSSF Scorecard', 'Các kiểm tra và ý nghĩa · Chạy như một workflow · Sửa theo thứ tự rủi ro'],
    ]],
    ['Chapter 9 — Policy as code', 'Chương 9 — Policy as code', 'Luật bảo mật viết thành code, kiểm tự động và có phiên bản.', [
      ['opa', 'OPA, Rego and Conftest for config files', 'OPA, Rego và Conftest cho file cấu hình', 'Kiểm Dockerfile, docker-compose, Kubernetes YAML, Terraform plan · Viết một chính sách cấm cổng PostgreSQL phơi ra · Kiểm thử chính sách'],
      ['cong', 'Security gates: what blocks a merge and what blocks a release', 'Cổng bảo mật: cái gì chặn merge, cái gì chặn phát hành', 'Chặn cứng vs cảnh báo · Ngoại lệ có hạn và có người duyệt · Tránh cổng khiến đội tắt hết'],
      ['tuan-thu', 'Compliance evidence from the pipeline', 'Bằng chứng tuân thủ lấy từ đường ống', 'SBOM, chữ ký, kết quả quét lưu theo bản phát hành · Truy vết từ commit tới prod · Nhẹ nhàng cho đội nhỏ'],
    ]],
    ['Chapter 10 — Vulnerability management and metrics', 'Chương 10 — Quản lý lỗ hổng và đo lường', 'Biến cảnh báo thành việc được làm xong.', [
      ['quy-trinh', 'From finding to fix: ownership, SLAs and exceptions', 'Từ phát hiện tới bản vá: người sở hữu, SLA và ngoại lệ', 'SLA theo mức độ · Tự tạo issue · Chấp nhận rủi ro có ký tên và hạn · Không để cảnh báo mồ côi'],
      ['defectdojo', 'Aggregating findings with DefectDojo', 'Gom cảnh báo bằng DefectDojo', 'Nhập SARIF từ nhiều công cụ · Loại trùng · Theo dõi theo sản phẩm · Khi nào quá nặng cho đội nhỏ'],
      ['chi-so', 'Metrics: mean time to remediate, escape rate, coverage', 'Chỉ số: thời gian vá trung bình, tỉ lệ lọt, độ phủ', 'Đo xu hướng, không đo số tuyệt đối · Lỗi lọt ra prod · Tỉ lệ repo có đủ cổng · Báo cáo gọn cho quản lý'],
      ['cong-bo', 'Security.txt, disclosure policy and bug bounty basics', 'security.txt, chính sách công bố lỗ hổng và bug bounty cơ bản', 'Kênh nhận báo cáo lỗ hổng · Cam kết thời gian phản hồi · Safe harbor · Khi nào mở bug bounty'],
    ]],
    ['Chapter 11 — Capstone: a full DevSecOps pipeline for LabFlow and a Node.js backend', 'Chương 11 — Dự án cuối khoá: pipeline DevSecOps đầy đủ cho LabFlow và một backend Node.js', 'Ghép mọi cổng bảo mật vào hai dự án giống hạ tầng thật.', [
      ['thiet-ke', 'Design: threat model of the pipeline and the gate map', 'Thiết kế: mô hình mối đe doạ của đường ống và bản đồ cổng', 'Ai có thể đẩy code, ai có quyền deploy · GHCR, máy build nhà, VPS · Cổng nào ở đâu · Thời gian pipeline mục tiêu'],
      ['xay', 'Build: gitleaks, Semgrep/CodeQL, OSV, Trivy, Checkov, Hadolint in GitHub Actions', 'Dựng: gitleaks, Semgrep/CodeQL, OSV, Trivy, Checkov, Hadolint trong GitHub Actions', 'Workflow dùng lại cho hai repo · SARIF vào tab Security · Chỉ chặn lỗi mới · Action ghim SHA'],
      ['phat-hanh', 'Release: SBOM, cosign signature, SLSA provenance and verification at deploy', 'Phát hành: SBOM, chữ ký cosign, provenance SLSA và kiểm khi deploy', 'Đẩy image lên GHCR kèm attestation · Script deploy kiểm chữ ký trước khi tráo · Thử đẩy image chưa ký và thấy bị chặn'],
      ['dast', 'Verify: ZAP API scan on an ephemeral environment and a planted-bug drill', 'Kiểm chứng: ZAP quét API trên môi trường tạm và diễn tập cài lỗi', 'Cài cố ý một SQL injection và một bí mật · Xem cổng nào bắt · Viết báo cáo trước/sau · Scorecard trước/sau'],
    ]],
    ['Chapter 12 — Interviews and certifications', 'Chương 12 — Phỏng vấn và chứng chỉ', 'Chuẩn bị cho vị trí AppSec/DevSecOps.', [
      ['chung-chi', 'Certifications worth knowing: Security+, GitHub Advanced Security, CKS, and practitioner courses', 'Chứng chỉ nên biết: Security+, GitHub Advanced Security, CKS, và các khoá thực hành', 'Chứng chỉ nào có giá trị cho DevSecOps · Hồ sơ dự án quan trọng hơn chứng chỉ · Kiểm thông tin mới nhất trên trang chính thức'],
      ['cau-hoi', 'Interview questions: design a secure pipeline, explain SolarWinds and xz-utils', 'Câu hỏi phỏng vấn: thiết kế pipeline an toàn, giải thích SolarWinds và xz-utils', 'Vẽ pipeline có cổng · SAST khác DAST khác SCA · Vì sao ghim SHA · SBOM giúp gì khi có CVE mới'],
      ['ho-so', 'Building a portfolio: public repo with a hardened pipeline and write-ups', 'Xây hồ sơ: repo công khai có pipeline đã siết và bài viết', 'Repo mẫu có badge Scorecard · Quy tắc Semgrep tự viết · Bài viết phân tích một sự cố chuỗi cung ứng'],
    ]],
  ]),
};
