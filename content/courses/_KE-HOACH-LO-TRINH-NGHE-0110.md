# Kế hoạch lộ trình 6 nghề chuyên sâu (01/10/2026) — user đã đồng ý, làm SAU khi SWD392 Chương 3 xong

User hỏi: web đã có khoá chuyên sâu từ số 0 → chuyên gia cho **AI Engineer, Data Engineer, Cloud Architect, Software
Architect, Blockchain Engineer, Data Scientist** chưa — *"đừng trùng nhau mà có mối liên kết với nhau để học cho hiệu quả"*.

## Hiện trạng (rà 01/10)
- Khoá liên quan phần lớn mới là KHUNG (~1k ký tự/bài): python, machine-learning, deep-learning, llm-apps, rag-vector-search,
  ai-agents, ai-coding, data-engineering, kafka, cloud-aws, kubernetes, infrastructure-as-code, system-design,
  distributed-systems, api-design, applied-cryptography, network-security, cloud-container-security.
- **Chưa có gì**: blockchain; data science (thống kê suy luận, EDA, trực quan hoá, A/B test).
- **Trùng**: ai-coding Ch4–8 ↔ llm-apps/rag/ai-agents · api-design Ch8–11 ↔ system-design · cloud-aws Ch8 ↔ IaC ·
  machine-learning Ch1–2 ↔ (math-for-ml mới) · SWD392 ⭐ Chuyên sâu (C4/ADR/DDD/microservices) ↔ (software-architecture mới).
- `/roadmap` (bảng `roadmaps`/`roadmap_nodes`, seed `src/services/roadmap.service.ts` + `scripts/roadmap-seed.mjs`) ĐÃ CÓ
  role: ai-engineer, data-scientist, blockchain, software-architect (+ data-analyst…). CHƯA có data-engineer, cloud-architect.
  Nút chỉ link `code-lab | roadmap | external` — CHƯA link được `/courses/<slug>`.

## Nguyên tắc
**Mỗi chủ đề chỉ MỘT khoá sở hữu.** Khoá khác chạm tới ⇒ một bài ngắn "Nếu đã học <khoá>…" nhắc cốt lõi + link rồi đi tiếp.
Dự án cuối khoá của mọi nghề xoay quanh **LabFlow AI** (chuỗi: DE dựng pipeline dữ liệu lab → DS phân tích → AI Engineer
làm trợ lý → Cloud Architect đưa lên cloud → Software Architect viết ADR/C4 → Blockchain: chứng nhận on-chain, tuỳ chọn).

## Việc
1. **7 khoá khung mới** (khuôn `_KE-HOACH-KHOA-MOI-3009.md` + `kafka.mjs` + `_chung/khung.mjs`, Mục 0 hai bài "Bắt đầu tại
   đây", 0 → chuyên gia, chương cuối dự án LabFlow, chương phỏng vấn/chứng chỉ, ảnh bìa):
   | slug | danh mục | level | sở hữu |
   |---|---|---|---|
   | `math-for-ml` | ai | BEGINNER | đại số tuyến tính, giải tích, xác suất cho ML (ML Ch1–2 thu gọn thành link) |
   | `statistics-data-science` | ai | INTERMEDIATE | thống kê suy luận, EDA, trực quan hoá, A/B test, nhân quả, kể chuyện bằng dữ liệu |
   | `mlops-llmops` | ai | ADVANCED | đóng gói/serve model, vLLM, registry, giám sát drift, eval trên prod, pipeline fine-tune |
   | `spark-lakehouse` | databases | ADVANCED | Spark, Delta/Iceberg, Airflow sâu (DE Ch5/Ch7 thu gọn thành link) |
   | `cloud-architecture` | devops | ADVANCED | Well-Architected, landing zone đa tài khoản, HA/DR, FinOps, Azure/GCP đối chiếu, SAA/SAP |
   | `software-architecture` | backend | ADVANCED | DDD, clean/hexagonal, saga/outbox/CQRS, event-driven, C4/ADR, ATAM, vai trò kiến trúc sư |
   | `blockchain-fundamentals` + `smart-contracts-solidity` | backend | INTERMEDIATE / ADVANCED | Bitcoin/Ethereum/EVM · Solidity, Foundry, audit, DeFi, dApp React |
   (thực ra 8 file — blockchain tách hai.)
2. **Cắt trùng** (giữ slug bài — seeder neo bằng slug; đổi title/ý bài): ai-coding Ch4–8 → "dùng AI để code" thuần + link;
   api-design Ch8–11 → API thuần + link system-design; cloud-aws Ch8 → link IaC; machine-learning Ch1–2 → ôn nhanh + link math-for-ml.
   SWD392 ⭐ Chuyên sâu: giữ ngắn, dẫn sang software-architecture.
3. **/roadmap**: thêm linkType `course` (FE `RoadmapDetail.tsx` linkFor + nhãn), thêm role `data-engineer`, `cloud-architect`;
   6 role trỏ nút vào đúng khoá theo thứ tự (tầng nền chung: python · postgresql · linux-bash · git · docker ·
   networking-for-developers · operating-systems-for-developers · math-for-ml).
