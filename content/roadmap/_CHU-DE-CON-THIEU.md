# /roadmap — chủ đề web còn THIẾU bài (12/11/2026)

Sau đợt làm lại /roadmap: **4.070/4.070 bước có bài đọc tự đủ**, **2.954 bước (73%)** mở thẳng được bài học / slide /
mô phỏng / Code Lab trên web. 1.116 bước còn lại chỉ có bài đọc + link ngoài vì web **chưa có bài thật** dạy đúng chủ đề.
Danh sách dưới đây gom theo mức đáng soạn nhất (soạn xong ⇒ chạy lại `scripts/roadmap-*` để gắn tự động).

## 1. Khoá Courses đã có khung nhưng toàn bài giữ chỗ ("đang được biên soạn") — soạn là phủ được nhiều nhất

| Khoá | Lộ trình hưởng lợi |
|---|---|
| `llm-apps`, `rag-vector-search`, `ai-agents`, `ai-coding`, `mlops-llmops` | AI Engineer, Vibe Coding, Claude Code, OpenClaw, Backend (AI) |
| `system-design`, `software-architecture`, `distributed-systems`, `kafka` | System Design, Software Architect, Backend |
| `kubernetes`, `cloud-aws`, `cloud-architecture`, `infrastructure-as-code`, `cloud-container-security`, `network-security` | Kubernetes, DevOps, Cloud Architect |
| `python`, `fastapi`, `math-for-ml`, `statistics-data-science`, `machine-learning`, `deep-learning`, `data-engineering`, `spark-lakehouse` | Python, Data Analyst/Scientist/Engineer, AI Engineer |
| `web-security`, `applied-cryptography`, `performance-load-testing`, `ddos-protection`, `email-infrastructure`, `search-elasticsearch` | Cyber Security, QA, Backend, DevOps |
| `dsa-interview`, `interview-prep` | DSA, LeetCode |
| `react-native`, `blockchain-fundamentals`, `smart-contracts-solidity`, `privacy-data-law`, `seo-analytics`, `ux-ui-for-developers`, `self-hosting`, `domains-dns-tls` | React, Blockchain, Frontend, Data Engineer |

Ngoài ra **137 khoá Academy tự soạn đang ở chế độ KHUNG** (4.697 bài chỉ có mục tiêu + khái niệm) — đã bị loại khỏi chỗ học.

## 2. Ngôn ngữ / nền tảng CHƯA có khoá nào (chỉ có Code Lab hoặc không có gì)

- **Go**, **Rust** (chỉ Code Lab), **Swift/iOS** (Code Lab `swiftui-ios`, không có bài đọc), **Kotlin/Jetpack Compose**,
  **C++ hiện đại** (template nâng cao, CMake, C++17/20/23), **Ruby/Rails**, **PHP/Laravel** (chỉ Code Lab), **.NET** ngoài môn trường.
- **Game dev**: đồ hoạ/shader (PBR, shadow, DirectX/Vulkan/WebGPU), vật lý game (SAT/GJK/BVH), Unity/Unreal/Godot, game AI (minimax, behavior tree).
- **Blockchain kỹ thuật**: Solidity, Hardhat/Foundry, bảo mật smart contract, ethers/viem, L2/ZK.

## 3. Chủ đề lẻ hay gặp ở nhiều lộ trình

- **Công cụ AI coding**: Claude Code (CLAUDE.md, skills, subagents, hooks, MCP, plugins), Cursor, Copilot, Codex, Gemini CLI.
- **Frontend**: Web APIs, PWA/Service Worker, Web Components, Sass/PostCSS/CSS-in-JS, build tool (esbuild/SWC/Rollup), Nuxt/SvelteKit/Astro,
  GraphQL client (Apollo/Relay), Motion/animation, Storybook, Cypress, Chrome DevTools, Lighthouse.
- **Backend/DevOps**: RabbitMQ, service mesh, circuit breaker/CQRS/saga, Terraform/Ansible, Jenkins/GitLab CI, ELK/Datadog, Vault/SOPS,
  Helm/ArgoCD, SAML/Kerberos/LDAP, Memcached, MySQL/Oracle/SQLite riêng, Nginx/Apache/IIS so sánh.
- **Bảo mật**: pentest & RoE, OSINT, nmap, Wi-Fi/802.1X, forensics tools, SIEM thực hành, Zero Trust, cloud security, chứng chỉ (Security+/CEH/OSCP).
- **Data**: Excel chuyên sâu, Power BI/Tableau sâu, R, PyTorch, dbt/Airflow/Parquet, web scraping.
- **QA**: Selenium/Appium/k6/JMeter/Postman thực hành, BDD/Cucumber, quản lý test (TestRail/Zephyr).
- **Git/GitHub**: tag/release, submodule, LFS, GitHub Apps/API, Conventional Commits.

## 4. Lỗi dữ liệu đã sửa / cần xem

- Đã sửa: "Thuật toán Anthropic" ⇒ "Thuật toán Minimax" (lỗi thay chữ cũ trong `roadmap.seed.mo-rong.ts`).
- Cần xem: Game Dev nhóm "Vật lý & Va chạm" chứa nhầm bước đồ hoạ (Cascaded/Cube/Horizon); Software Architect bước IAF ghi
  "Intangible Assets Framework" (thường là Integrated Architecture Framework); React có mục "Formish", "GSock" không rõ thư viện.

Bản chi tiết theo từng phần soạn: `~/Documents/roadmap-lam/thieu-bai.md` (ngoài repo).
