/**
 * Bộ phận / chức năng tham gia một dự án — trang /about/quy-trinh (bản 2).
 *
 * "Bộ phận" ở đây là VAI (chức năng), không phải số người hay sơ đồ tổ chức
 * của một công ty có tên. Dự án nhỏ, một người có thể kiêm nhiều vai; dù vậy
 * mỗi vai vẫn có trách nhiệm và đầu ra riêng, và — khi có thể — người làm (R)
 * tách khỏi người duyệt (A).
 *
 * Phụ thuộc MỘT CHIỀU: file này import `data.ts`, `data.ts` không import lại
 * (chỉ dùng kiểu `DeptKey`). Đừng để `data.ts` import giá trị từ đây — vòng
 * import sẽ làm hằng số chưa kịp khởi tạo.
 *
 * RACI tổng (bộ phận × giai đoạn) KHÔNG gõ tay: `raciOverview()` gộp từ RACI
 * của từng giai đoạn trong `data.ts`, nên sửa một chỗ là cả hai khớp nhau.
 */
import {
  DEPT_KEYS,
  DEPT_NAMES,
  LEARN,
  STAGES,
  type Bi,
  type DeptKey,
  type LearnLink,
  type RaciRole,
} from './data';

const L = LEARN;

export interface Handoff {
  /** Chuyển cho bộ phận nào. */
  to: DeptKey;
  /** Chuyển cái gì. */
  what: Bi;
}

export interface Department {
  key: DeptKey;
  name: Bi;
  /** Bộ phận ngoài nhà cung cấp (khách hàng). */
  external?: boolean;
  /** Một câu: bộ phận này tồn tại để làm gì. */
  mission: Bi;
  responsibilities: Bi[];
  outputs: Bi[];
  /** Luồng liên kết: chuyển giao gì cho ai. */
  handoffs: Handoff[];
  skills: Bi[];
  learn: LearnLink[];
}

export const DEPARTMENTS: Department[] = [
  {
    key: 'sales',
    name: DEPT_NAMES.sales,
    mission: ['Hiểu đúng nhu cầu của khách và chỉ cam kết những gì đội làm được.', 'Understand the client’s need and commit only to what the team can deliver.'],
    responsibilities: [
      ['Tiếp nhận yêu cầu, làm đầu mối liên lạc ban đầu', 'Receive requests and act as the first point of contact'],
      ['Sàng lọc cơ hội (BANT) và đề xuất go/no-go', 'Qualify opportunities (BANT) and recommend go/no-go'],
      ['Soạn và trình bày đề xuất, đàm phán điều khoản thương mại', 'Write and present proposals, negotiate commercial terms'],
    ],
    outputs: [
      ['Phiếu tiếp nhận, biên bản tư vấn', 'Intake ticket, call notes'],
      ['Bảng đánh giá phù hợp', 'Qualification scorecard'],
      ['Đề xuất giải pháp & báo giá (gửi riêng)', 'Proposal & quote (sent privately)'],
    ],
    handoffs: [
      { to: 'ba', what: ['Phiếu yêu cầu và biên bản tư vấn', 'Intake ticket and call notes'] },
      { to: 'pmo', what: ['Đề xuất go/no-go kèm bảng chấm điểm', 'Go/no-go recommendation with the scorecard'] },
      { to: 'legal', what: ['Điều khoản thương mại đã đàm phán', 'Negotiated commercial terms'] },
      { to: 'pm', what: ['Cam kết mốc và kỳ vọng của khách', 'Committed milestones and client expectations'] },
    ],
    skills: [
      ['Lắng nghe và đặt câu hỏi mở', 'Active listening and open questions'],
      ['Hiểu chi phí và ước lượng ở mức tổng thể', 'Understanding cost and high-level estimation'],
      ['Viết đề xuất rõ ràng, trung thực', 'Writing clear, honest proposals'],
    ],
    learn: [L.solo, L.PMG201c, L.SSG104],
  },
  {
    key: 'ba',
    name: DEPT_NAMES.ba,
    mission: ['Biến nhu cầu nghiệp vụ thành yêu cầu kiểm chứng được.', 'Turn business needs into verifiable requirements.'],
    responsibilities: [
      ['Khảo sát, phỏng vấn, mô hình hoá quy trình as-is / to-be', 'Run discovery, interviews, as-is / to-be modelling'],
      ['Viết SRS, user story, tiêu chí chấp nhận, quy tắc nghiệp vụ', 'Write the SRS, user stories, acceptance criteria, business rules'],
      ['Giữ ma trận truy vết (RTM), phân tích ảnh hưởng của CR', 'Maintain the RTM, analyse change-request impact'],
      ['Viết kịch bản UAT, hướng dẫn người dùng nghiệm thu', 'Write UAT scripts, guide users through acceptance'],
    ],
    outputs: [
      ['Tài liệu phân tích nghiệp vụ, glossary', 'Business analysis document, glossary'],
      ['SRS, backlog có tiêu chí chấp nhận, RTM', 'SRS, backlog with acceptance criteria, RTM'],
      ['Kịch bản UAT', 'UAT scripts'],
    ],
    handoffs: [
      { to: 'ux', what: ['User story, persona, luồng nghiệp vụ', 'User stories, personas, business flows'] },
      { to: 'arch', what: ['Yêu cầu chức năng và phi chức năng', 'Functional and non-functional requirements'] },
      { to: 'qa', what: ['Tiêu chí chấp nhận và RTM', 'Acceptance criteria and RTM'] },
      { to: 'data', what: ['Quy tắc nghiệp vụ cho chuyển đổi dữ liệu', 'Business rules for data transformation'] },
      { to: 'client', what: ['SRS để ký duyệt', 'SRS for sign-off'] },
    ],
    skills: [
      ['Kỹ thuật elicitation (phỏng vấn, quan sát, workshop)', 'Elicitation techniques (interviews, shadowing, workshops)'],
      ['BPMN, use case, user story, Gherkin', 'BPMN, use cases, user stories, Gherkin'],
      ['Viết yêu cầu không mơ hồ', 'Writing unambiguous requirements'],
    ],
    learn: [L.SWR302, L.SWE201c, L.agile],
  },
  {
    key: 'ux',
    name: DEPT_NAMES.ux,
    mission: ['Làm cho sản phẩm dễ hiểu, dễ dùng và dùng được cho mọi người.', 'Make the product understandable, usable and accessible to everyone.'],
    responsibilities: [
      ['User flow, wireframe, mockup, prototype', 'User flows, wireframes, mockups, prototypes'],
      ['Kiểm thử khả dụng với người dùng thật', 'Usability testing with real users'],
      ['Xây design system và design tokens', 'Build the design system and design tokens'],
    ],
    outputs: [
      ['Mockup và prototype đã duyệt', 'Approved mockups and prototype'],
      ['Báo cáo kiểm thử khả dụng', 'Usability test report'],
      ['Design tokens / thư viện component', 'Design tokens / component library'],
    ],
    handoffs: [
      { to: 'dev', what: ['Mockup, design tokens, đặc tả tương tác', 'Mockups, design tokens, interaction specs'] },
      { to: 'qa', what: ['Luồng và tiêu chí truy cập (a11y) để kiểm', 'Flows and accessibility criteria to test'] },
      { to: 'ba', what: ['Phát hiện từ kiểm thử khả dụng ảnh hưởng yêu cầu', 'Usability findings that affect requirements'] },
    ],
    skills: [
      ['Nghiên cứu người dùng', 'User research'],
      ['Figma, prototype tương tác', 'Figma, interactive prototyping'],
      ['WCAG 2.2, thiết kế responsive', 'WCAG 2.2, responsive design'],
    ],
    learn: [L.ux, L.tailwind, L.react],
  },
  {
    key: 'arch',
    name: DEPT_NAMES.arch,
    mission: ['Chọn cấu trúc hệ thống vừa với quy mô thật và ghi lại vì sao.', 'Choose a system structure that fits the real scale, and record why.'],
    responsibilities: [
      ['Đánh giá khả thi kỹ thuật, so sánh phương án', 'Assess technical feasibility, compare options'],
      ['Kiến trúc tổng thể (C4), thiết kế CSDL, hợp đồng API', 'Overall architecture (C4), database design, API contracts'],
      ['Ghi ADR, chủ trì review thiết kế', 'Write ADRs, lead design reviews'],
      ['Danh mục giấy phép và thành phần bên thứ ba', 'Third-party component and licence inventory'],
    ],
    outputs: [
      ['SDD, ERD, OpenAPI', 'SDD, ERD, OpenAPI'],
      ['Nhật ký ADR', 'ADR log'],
      ['Ước tính chi phí vận hành', 'Running-cost estimate'],
    ],
    handoffs: [
      { to: 'dev', what: ['SDD, hợp đồng API, ADR', 'SDD, API contract, ADRs'] },
      { to: 'devops', what: ['Sơ đồ triển khai và NFR vận hành', 'Deployment view and operational NFRs'] },
      { to: 'sec', what: ['Luồng dữ liệu cho threat model', 'Data flows for threat modelling'] },
      { to: 'data', what: ['ERD và chiến lược migration', 'ERD and migration strategy'] },
      { to: 'legal', what: ['Danh mục giấy phép bên thứ ba', 'Third-party licence inventory'] },
    ],
    skills: [
      ['Kiểu kiến trúc và đánh đổi', 'Architecture styles and trade-offs'],
      ['Mô hình hoá dữ liệu, thiết kế API', 'Data modelling, API design'],
      ['Ước lượng tải và chi phí', 'Load and cost estimation'],
    ],
    learn: [L.SWD392, L.sysdesign, L.api, L.DBI202],
  },
  {
    key: 'pm',
    name: DEPT_NAMES.pm,
    mission: ['Giữ dự án đi đúng phạm vi, thời gian, chất lượng — và để khách luôn biết dự án đang ở đâu.', 'Keep the project on scope, time and quality — and keep the client informed.'],
    responsibilities: [
      ['Lập kế hoạch có baseline, chia sprint, theo dõi tiến độ', 'Baselined planning, sprint slicing, progress tracking'],
      ['Điều phối sự kiện Scrum, demo, báo cáo tuần', 'Run Scrum events, demos, weekly reports'],
      ['Quản lý rủi ro, thay đổi (CR) và leo thang', 'Manage risks, change requests and escalation'],
      ['Chủ trì kick-off, bàn giao và đóng dự án', 'Lead kick-off, handover and closure'],
    ],
    outputs: [
      ['Kế hoạch dự án, lịch sprint, Definition of Done', 'Project plan, sprint calendar, Definition of Done'],
      ['Sổ rủi ro, nhật ký CR, báo cáo tuần', 'Risk register, CR log, weekly reports'],
      ['Biên bản kick-off, bàn giao, đóng dự án', 'Kick-off, handover and closure records'],
    ],
    handoffs: [
      { to: 'dev', what: ['Mục tiêu sprint và backlog ưu tiên', 'Sprint goals and prioritised backlog'] },
      { to: 'client', what: ['Báo cáo tuần, yêu cầu quyết định', 'Weekly reports, decision requests'] },
      { to: 'pmo', what: ['Tình trạng dự án và rủi ro cần leo thang', 'Project status and risks to escalate'] },
      { to: 'support', what: ['Danh sách hạng mục chuyển sang bảo hành', 'Items moving into warranty'] },
    ],
    skills: [
      ['Scrum / Kanban, ước lượng, lập lịch', 'Scrum / Kanban, estimation, scheduling'],
      ['Giao tiếp với bên liên quan, điều phối họp', 'Stakeholder communication, facilitation'],
      ['Quản lý rủi ro', 'Risk management'],
    ],
    learn: [L.PMG201c, L.agile, L.SWP391, L.IAA202],
  },
  {
    key: 'dev',
    name: DEPT_NAMES.dev,
    mission: ['Viết phần mềm chạy đúng, đọc được, kiểm thử được và triển khai được.', 'Write software that is correct, readable, testable and deployable.'],
    responsibilities: [
      ['Backend, frontend, mobile theo thiết kế và hợp đồng API', 'Backend, frontend and mobile against designs and API contracts'],
      ['Unit / integration test, review chéo mọi PR', 'Unit / integration tests, peer review on every PR'],
      ['Migration CSDL có phiên bản, feature flag', 'Versioned DB migrations, feature flags'],
      ['Sửa lỗi kiểm thử, UAT và bảo hành', 'Fix defects from testing, UAT and warranty'],
    ],
    outputs: [
      ['Mã nguồn đã review, CI xanh', 'Reviewed source code, green CI'],
      ['Bản build staging mỗi sprint', 'Staging build every sprint'],
      ['Tài liệu API và sổ tay dev', 'API docs and developer handbook'],
    ],
    handoffs: [
      { to: 'qa', what: ['Bản build staging kèm ghi chú thay đổi', 'Staging build with change notes'] },
      { to: 'devops', what: ['Artefact build (ảnh container, bản cài)', 'Build artefacts (container images, installers)'] },
      { to: 'support', what: ['Ghi chú sửa lỗi và hướng dẫn xử lý', 'Fix notes and troubleshooting guidance'] },
    ],
    skills: [
      ['TypeScript, Node.js, Next.js / React, Java Spring Boot, React Native', 'TypeScript, Node.js, Next.js / React, Java Spring Boot, React Native'],
      ['SQL, ORM, thiết kế API', 'SQL, ORMs, API design'],
      ['Git, review mã, kiểm thử tự động', 'Git, code review, automated testing'],
    ],
    learn: [L.next, L.node, L.spring, L.react, L.rn, L.ts, L.prisma, L.fullstack],
  },
  {
    key: 'qa',
    name: DEPT_NAMES.qa,
    mission: ['Tìm lỗi trước khách hàng và chứng minh sản phẩm đạt tiêu chí đã ký.', 'Find defects before the client does and prove the product meets the signed criteria.'],
    responsibilities: [
      ['Kế hoạch kiểm thử, thiết kế test case truy vết về yêu cầu', 'Test planning, test cases traced to requirements'],
      ['Kiểm thử hệ thống, hồi quy, hiệu năng, truy cập', 'System, regression, performance and accessibility testing'],
      ['Phân loại lỗi, báo cáo kiểm thử', 'Defect triage, test reporting'],
      ['Đồng thiết kế Definition of Done; đối soát dữ liệu chuyển đổi', 'Co-design the Definition of Done; reconcile migrated data'],
    ],
    outputs: [
      ['Kế hoạch kiểm thử, bộ test case', 'Test plan, test cases'],
      ['Báo cáo kiểm thử, báo cáo tải', 'Test report, load test report'],
      ['Báo cáo đối soát dữ liệu', 'Data reconciliation report'],
    ],
    handoffs: [
      { to: 'dev', what: ['Lỗi có bước tái hiện, mức độ, ưu tiên', 'Defects with repro steps, severity, priority'] },
      { to: 'pm', what: ['Báo cáo kiểm thử để quyết định phát hành', 'Test report for the release decision'] },
      { to: 'client', what: ['Hỗ trợ và bằng chứng trong vòng UAT', 'Support and evidence during UAT'] },
    ],
    skills: [
      ['Kỹ thuật thiết kế test (phân vùng, giá trị biên, bảng quyết định)', 'Test design techniques (partitioning, boundaries, decision tables)'],
      ['Playwright, Postman, k6', 'Playwright, Postman, k6'],
      ['Viết báo cáo lỗi rõ ràng', 'Writing clear defect reports'],
    ],
    learn: [L.SWT301, L.testing, L.perf],
  },
  {
    key: 'sec',
    name: DEPT_NAMES.sec,
    mission: ['Làm cho bảo mật là yêu cầu có kiểm chứng, không phải lời hứa.', 'Make security a verified requirement, not a promise.'],
    responsibilities: [
      ['Threat model, yêu cầu bảo mật', 'Threat models, security requirements'],
      ['Review mã bảo mật, SCA / SAST / DAST, kiểm theo ASVS', 'Security code review, SCA / SAST / DAST, ASVS verification'],
      ['Theo dõi CVE, điều phối vá bảo mật', 'Track CVEs, coordinate security patches'],
      ['Xác nhận thu hồi quyền và xoá dữ liệu an toàn', 'Confirm access revocation and secure deletion'],
    ],
    outputs: [
      ['Threat model + biện pháp giảm thiểu', 'Threat model + mitigations'],
      ['Checklist ASVS có bằng chứng, báo cáo quét', 'ASVS checklist with evidence, scan reports'],
      ['Chấp nhận rủi ro bằng văn bản (nếu có)', 'Written risk acceptances (if any)'],
    ],
    handoffs: [
      { to: 'dev', what: ['Lỗ hổng kèm cách vá', 'Findings with remediation guidance'] },
      { to: 'pm', what: ['Rủi ro bảo mật còn lại', 'Residual security risk'] },
      { to: 'legal', what: ['Dữ liệu cho đánh giá tác động dữ liệu cá nhân', 'Input for the personal-data impact assessment'] },
    ],
    skills: [
      ['OWASP Top 10 / ASVS, STRIDE', 'OWASP Top 10 / ASVS, STRIDE'],
      ['Xác thực, phân quyền, mật mã ứng dụng', 'Authentication, authorisation, applied cryptography'],
      ['Công cụ quét bảo mật', 'Security scanning tools'],
    ],
    learn: [L.websec, L.threat, L.devsecops, L.auth],
  },
  {
    key: 'devops',
    name: DEPT_NAMES.devops,
    mission: ['Đưa thay đổi lên môi trường an toàn, lặp lại được, và giữ dịch vụ chạy ổn định.', 'Ship changes safely and repeatably, and keep the service running reliably.'],
    responsibilities: [
      ['CI/CD, các môi trường dev / staging / production', 'CI/CD and dev / staging / production environments'],
      ['Đóng gói, phát hành, quay lui', 'Packaging, release, roll-back'],
      ['Giám sát, cảnh báo, SLO, xử lý sự cố', 'Monitoring, alerting, SLOs, incident response'],
      ['Sao lưu và thử khôi phục; tắt và huỷ tài nguyên khi ngừng hệ thống', 'Backups and restore tests; shut down and retire resources at decommissioning'],
    ],
    outputs: [
      ['Pipeline CI/CD, IaC, runbook', 'CI/CD pipeline, IaC, runbooks'],
      ['Dashboard giám sát, nhật ký sự cố, postmortem', 'Monitoring dashboards, incident log, postmortems'],
      ['Biên bản thử khôi phục', 'Restore-test records'],
    ],
    handoffs: [
      { to: 'dev', what: ['Môi trường và pipeline sẵn sàng', 'Ready environments and pipelines'] },
      { to: 'support', what: ['Runbook, dashboard, kênh cảnh báo', 'Runbooks, dashboards, alert channels'] },
      { to: 'client', what: ['Báo cáo khả dụng (uptime) và sự cố', 'Availability (uptime) and incident reports'] },
    ],
    skills: [
      ['Docker, CI/CD, IaC', 'Docker, CI/CD, IaC'],
      ['Linux, giám sát, ứng phó sự cố', 'Linux, monitoring, incident response'],
      ['Chiến lược phát hành và quay lui', 'Release and roll-back strategies'],
    ],
    learn: [L.docker, L.gha, L.deploy, L.obs, L.iac, L.incident],
  },
  {
    key: 'infra',
    name: DEPT_NAMES.infra,
    mission: ['Cho sản phẩm một nơi sống an toàn: mạng, tên miền, chứng chỉ, máy chủ.', 'Give the product a safe home: network, domains, certificates, servers.'],
    responsibilities: [
      ['Tên miền, DNS, xác thực email (SPF / DKIM / DMARC)', 'Domains, DNS, email authentication (SPF / DKIM / DMARC)'],
      ['TLS, CDN / WAF, reverse proxy, tường lửa', 'TLS, CDN / WAF, reverse proxy, firewall'],
      ['Máy chủ, quyền truy cập tối thiểu', 'Servers, least-privilege access'],
    ],
    outputs: [
      ['Sơ đồ hạ tầng & mạng', 'Infrastructure & network diagram'],
      ['Cấu hình DNS / TLS / proxy có kiểm soát phiên bản', 'Version-controlled DNS / TLS / proxy configuration'],
    ],
    handoffs: [
      { to: 'devops', what: ['Mạng, DNS, chứng chỉ đã sẵn sàng', 'Network, DNS and certificates ready'] },
      { to: 'sec', what: ['Cấu hình tường lửa và cổng mở để rà soát', 'Firewall and open-port configuration for review'] },
    ],
    skills: [
      ['Mạng máy tính, DNS, TLS', 'Networking, DNS, TLS'],
      ['Nginx, Cloudflare, Linux', 'Nginx, Cloudflare, Linux'],
    ],
    learn: [L.net, L.nginx, L.linux, L.selfhost, L.netsec],
  },
  {
    key: 'data',
    name: DEPT_NAMES.data,
    mission: ['Giữ dữ liệu đúng, đủ, hợp pháp — và làm cho AI đo được, chặn được chi phí.', 'Keep data correct, complete and lawful — and make AI measurable and cost-capped.'],
    responsibilities: [
      ['Đánh giá dữ liệu hiện có, ERD, từ điển dữ liệu', 'Assess existing data, ERD, data dictionary'],
      ['Chuyển đổi và đối soát dữ liệu; trả và xoá dữ liệu khi ngừng hệ thống', 'Data migration and reconciliation; data return and deletion at decommissioning'],
      ['Tính năng AI: prompt có phiên bản, bộ đánh giá, trần chi phí', 'AI features: versioned prompts, eval sets, cost caps'],
      ['Số liệu sản phẩm cho cải tiến', 'Product metrics for improvement'],
    ],
    outputs: [
      ['Kế hoạch chuyển dữ liệu, bảng ánh xạ, báo cáo đối soát', 'Migration plan, field mapping, reconciliation report'],
      ['Bộ eval và báo cáo chất lượng AI', 'Eval sets and AI quality reports'],
      ['Gói dữ liệu trả lại, biên bản xoá', 'Returned data package, deletion record'],
    ],
    handoffs: [
      { to: 'dev', what: ['Script chuyển đổi, bộ dữ liệu, cấu hình AI', 'Migration scripts, datasets, AI configuration'] },
      { to: 'qa', what: ['Dữ liệu cần đối soát và tiêu chí khớp', 'Data to reconcile and matching criteria'] },
      { to: 'client', what: ['Gói dữ liệu trả lại kèm checksum', 'Returned data package with checksums'] },
    ],
    skills: [
      ['SQL, PostgreSQL, ETL', 'SQL, PostgreSQL, ETL'],
      ['Chất lượng dữ liệu, bảo vệ dữ liệu cá nhân', 'Data quality, personal-data protection'],
      ['LLM, RAG, đánh giá mô hình', 'LLMs, RAG, model evaluation'],
    ],
    learn: [L.DBI202, L.pg, L.dataeng, L.llm, L.rag],
  },
  {
    key: 'support',
    name: DEPT_NAMES.support,
    mission: ['Giúp người dùng của khách dùng được sản phẩm và được lắng nghe khi có sự cố.', 'Help the client’s users succeed with the product and be heard when things go wrong.'],
    responsibilities: [
      ['Đào tạo người dùng và quản trị viên, tài liệu hướng dẫn', 'Train users and admins, write user guides'],
      ['Tiếp nhận, phân loại yêu cầu và sự cố theo SLA', 'Take in and triage requests and incidents under the SLA'],
      ['Thông báo phát hành, thông báo ngừng hệ thống', 'Release announcements, decommissioning notices'],
      ['Rà soát định kỳ với khách, thu phản hồi', 'Periodic client reviews, collecting feedback'],
    ],
    outputs: [
      ['Tài liệu người dùng, video hướng dẫn', 'User guides, how-to videos'],
      ['Nhật ký yêu cầu / sự cố, báo cáo bảo trì', 'Request / incident log, maintenance reports'],
    ],
    handoffs: [
      { to: 'dev', what: ['Lỗi đã phân loại, có bước tái hiện', 'Triaged defects with repro steps'] },
      { to: 'devops', what: ['Sự cố cần khắc phục khẩn', 'Incidents needing urgent resolution'] },
      { to: 'ba', what: ['Yêu cầu cải tiến từ người dùng', 'Improvement requests from users'] },
      { to: 'pm', what: ['Số liệu SLA cho báo cáo', 'SLA figures for reporting'] },
    ],
    skills: [
      ['Giao tiếp, viết hướng dẫn dễ hiểu', 'Communication, writing plain-language guides'],
      ['Quy trình quản lý sự cố', 'Incident management process'],
    ],
    learn: [L.incident, L.obs, L.SSG104],
  },
  {
    key: 'legal',
    name: DEPT_NAMES.legal,
    mission: ['Bảo vệ cả hai bên bằng hợp đồng rõ ràng, thanh toán đúng hạn và xử lý dữ liệu đúng luật.', 'Protect both sides with clear contracts, timely payments and lawful data handling.'],
    responsibilities: [
      ['NDA, MSA, SOW, phụ lục, DPA', 'NDA, MSA, SOW, appendices, DPA'],
      ['Sở hữu trí tuệ, giấy phép bên thứ ba', 'Intellectual property, third-party licences'],
      ['Thanh toán theo mốc, hoá đơn điện tử, thanh lý hợp đồng', 'Milestone payments, e-invoicing, contract liquidation'],
      ['Tuân thủ dữ liệu cá nhân: đồng ý, đánh giá tác động, xoá dữ liệu', 'Personal-data compliance: consent, impact assessment, deletion'],
    ],
    outputs: [
      ['Hợp đồng và phụ lục đã ký', 'Signed contracts and appendices'],
      ['Hoá đơn, biên bản thanh lý', 'Invoices, liquidation records'],
      ['Hồ sơ tuân thủ dữ liệu cá nhân, biên bản xoá', 'Personal-data compliance file, deletion records'],
    ],
    handoffs: [
      { to: 'pm', what: ['SOW đã ký, mốc thanh toán, tiêu chí nghiệm thu', 'Signed SOW, payment milestones, acceptance criteria'] },
      { to: 'sales', what: ['Hợp đồng đã ký để thông báo khách', 'Signed contract to share with the client'] },
      { to: 'pmo', what: ['Hồ sơ pháp lý để lưu trữ', 'Legal records for the archive'] },
    ],
    skills: [
      ['Pháp luật hợp đồng, sở hữu trí tuệ', 'Contract and IP law'],
      ['Bảo vệ dữ liệu cá nhân', 'Personal-data protection'],
      ['Kế toán, hoá đơn chứng từ', 'Accounting, invoicing'],
    ],
    learn: [L.LAW102, L.privacy, L.payments, L.ITE302c],
  },
  {
    key: 'pmo',
    name: DEPT_NAMES.pmo,
    mission: ['Giữ chuẩn chung cho mọi dự án: quyết định nhận dự án, mẫu tài liệu, lưu trữ, bài học.', 'Keep shared standards across projects: intake decisions, templates, archives, lessons.'],
    responsibilities: [
      ['Quyết định go/no-go trong danh mục dự án', 'Make go/no-go calls within the portfolio'],
      ['Duyệt đề xuất, điều khoản và baseline kế hoạch', 'Approve proposals, terms and plan baselines'],
      ['Duy trì mẫu tài liệu, checklist, quy trình', 'Maintain templates, checklists and the process'],
      ['Lưu trữ hồ sơ và đưa bài học vào quy trình', 'Archive records and feed lessons into the process'],
    ],
    outputs: [
      ['Quyết định go/no-go', 'Go/no-go decisions'],
      ['Bộ mẫu tài liệu và quy trình (trang này)', 'Template set and process (this page)'],
      ['Kho hồ sơ dự án', 'Project archive'],
    ],
    handoffs: [
      { to: 'pm', what: ['Mẫu, chuẩn và các phê duyệt', 'Templates, standards and approvals'] },
      { to: 'sales', what: ['Quyết định go/no-go', 'Go/no-go decisions'] },
    ],
    skills: [
      ['Quản trị danh mục dự án', 'Portfolio governance'],
      ['Cải tiến quy trình', 'Process improvement'],
    ],
    learn: [L.PMG201c, L.IAA202, L.SEP490],
  },
  {
    key: 'client',
    name: DEPT_NAMES.client,
    external: true,
    mission: ['Nắm quyền quyết định về giá trị: ưu tiên gì, chấp nhận gì, đầu tư tiếp vào đâu.', 'Own the value decisions: what to prioritise, what to accept, where to invest next.'],
    responsibilities: [
      ['Cung cấp thông tin nghiệp vụ, người dùng, dữ liệu mẫu', 'Provide business knowledge, users and sample data'],
      ['Ký duyệt SRS, prototype, chi phí vận hành, nghiệm thu', 'Sign off the SRS, prototype, running cost and acceptance'],
      ['Duyệt hoặc từ chối phiếu CR; ưu tiên backlog', 'Approve or reject CRs; prioritise the backlog'],
      ['Sở hữu tài khoản gốc, tên miền, dữ liệu', 'Own root accounts, domains and data'],
    ],
    outputs: [
      ['Các phê duyệt có chữ ký', 'Signed approvals'],
      ['Kết quả UAT', 'UAT results'],
    ],
    handoffs: [
      { to: 'ba', what: ['Thông tin nghiệp vụ, dữ liệu mẫu', 'Business knowledge, sample data'] },
      { to: 'pm', what: ['Quyết định và phê duyệt', 'Decisions and approvals'] },
      { to: 'qa', what: ['Kết quả và bằng chứng UAT', 'UAT results and evidence'] },
      { to: 'support', what: ['Báo sự cố qua kênh đã thống nhất', 'Incident reports via the agreed channel'] },
    ],
    skills: [
      ['Hiểu mục tiêu kinh doanh', 'Clear business goals'],
      ['Ra quyết định kịp thời', 'Timely decision-making'],
    ],
    learn: [],
  },
];

export const deptByKey = (k: DeptKey): Department => DEPARTMENTS.find((d) => d.key === k)!;

/** Thứ tự ưu tiên khi gộp nhiều dòng RACI của cùng một giai đoạn. */
const STRENGTH: Record<RaciRole, number> = { A: 4, R: 3, C: 2, I: 1 };

/**
 * RACI tổng: mỗi ô (bộ phận × giai đoạn) lấy vai MẠNH NHẤT của bộ phận đó
 * trong các hoạt động của giai đoạn (A > R > C > I). Ô trống = không tham gia.
 * Lưu ý: một giai đoạn có thể có nhiều A ở bảng tổng vì mỗi hoạt động có
 * người giải trình riêng — xem RACI chi tiết của giai đoạn để biết ai duyệt gì.
 */
export function raciOverview(): { slug: string; n: number; cells: Partial<Record<DeptKey, RaciRole>> }[] {
  return STAGES.map((s) => {
    const cells: Partial<Record<DeptKey, RaciRole>> = {};
    for (const row of s.raci ?? []) {
      for (const [k, r] of Object.entries(row.roles) as [DeptKey, RaciRole][]) {
        const cur = cells[k];
        if (!cur || STRENGTH[r] > STRENGTH[cur]) cells[k] = r;
      }
    }
    return { slug: s.slug, n: s.n, cells };
  });
}

/** Bộ phận theo đúng thứ tự khai báo (để vẽ cột của bảng RACI tổng). */
export const DEPT_ORDER: readonly DeptKey[] = DEPT_KEYS;
