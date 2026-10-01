# Đề giao agent dựng KHUNG khoá — lộ trình 6 nghề (01/10/2026)

Đọc trước, theo đúng: `content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md` (vì sao, nguyên tắc "mỗi chủ đề MỘT khoá sở hữu",
chuỗi dự án LabFlow) · `content/courses/_KE-HOACH-KHOA-MOI-3009.md` (cách dựng một khoá khung — Mục 0 hai bài "Bắt đầu tại đây"
1/2 + 2/2 rồi bài cài môi trường, 0 → chuyên gia 10–14 chương × 3–6 bài, ý bài cụ thể tách " · ", chương cuối dự án LabFlow,
chương phỏng vấn & chứng chỉ thật, documentsNote nguồn CHÍNH THỨC không bịa link, tiêu đề bài ≤ 255) · mẫu `content/courses/kafka.mjs`
+ `content/courses/_chung/khung.mjs`. Người học: SV SE FPTU, yếu tiếng Anh, đồ án LabFlow AI (Spring Boot + React + PostgreSQL + AIoT
+ AI service), tự host cuongthai.com. Song ngữ EN|||VI như mẫu.

**KHÔNG TRÙNG** — trước khi viết, đọc tiêu đề chương (`node -e "import('./content/courses/<slug>.mjs').then(m=>m.default.sections.forEach(s=>console.log(s.title)))"`)
của MỌI khoá liên quan ghi trong bảng gói. Chỗ chạm nhau ⇒ một bài ngắn "Nếu đã học <khoá> …" nhắc cốt lõi + trỏ `/courses/<slug>`
rồi ĐI SÂU hơn; không dạy lại. Ở `requirements` ghi khoá nên học trước; ở bài "Bắt đầu tại đây (2/2)" vẽ vị trí khoá trong lộ trình nghề.

Danh mục (đúng object): ai `{ slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 }` · databases
`{ slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 }` · devops `{ slug: 'devops', name: 'DevOps & Vận hành',
icon: 'Server', sortOrder: 4 }` · backend `{ slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 }`.
`thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/<slug>.png?v=1'` (người điều phối dựng ảnh).

Chỉ tạo file `content/courses/<slug>.mjs` của gói mình. Không sửa khoá cũ, không commit. Kiểm mỗi file:
`node -e "import('./content/courses/<slug>.mjs').then(m=>{const s=m.default.sections;console.log(s.length, s.reduce((a,x)=>a+x.lessons.length,0)); const t=s.flatMap(x=>x.lessons).filter(l=>l.title.length>255); console.log('dài',t.length); const sl=s.flatMap(x=>x.lessons.map(l=>l.slug)); console.log('trùng slug', sl.length-new Set(sl).size)})"`
và seed thử `node scripts/academy-seed-course.mjs --file ./content/courses/<slug>.mjs` nếu script nhận file courses (nếu không, báo lại).
Trả về: mỗi khoá — số chương/bài, danh sách tiêu đề chương, các chỗ chạm khoá cũ đã xử lý thế nào, logo simple-icons đề xuất.

| Gói | Khoá (slug · danh mục · level) | Khoá cũ phải đọc để không trùng |
|---|---|---|
| A | `math-for-ml` · ai · BEGINNER · `statistics-data-science` · ai · INTERMEDIATE · `mlops-llmops` · ai · ADVANCED · `spark-lakehouse` · databases · ADVANCED | python, machine-learning, deep-learning, llm-apps, rag-vector-search, ai-agents, ai-coding, data-engineering, kafka, observability-monitoring, docker, kubernetes |
| B | `cloud-architecture` · devops · ADVANCED · `software-architecture` · backend · ADVANCED · `blockchain-fundamentals` · backend · INTERMEDIATE · `smart-contracts-solidity` · backend · ADVANCED | cloud-aws, infrastructure-as-code, kubernetes, network-security, cloud-container-security, system-design, distributed-systems, api-design, kafka, applied-cryptography, web-security, online-payments; Academy SWD392 (`content/academy/SWD392.mjs` — UML/COMET/GoF đã dạy ở đó) |
