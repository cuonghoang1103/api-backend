/**
 * Software Architecture — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 01/10/2026 theo lộ trình 6 nghề
 * (content/courses/_KE-HOACH-LO-TRINH-NGHE-0110.md, gói B). Khoá SỞ HỮU phần sâu: vai trò kiến trúc sư, đặc tính kiến trúc,
 * C4/ADR/arc42, phong cách kiến trúc, clean/hexagonal, DDD chiến lược + chiến thuật, event-driven, saga/outbox/CQRS/event
 * sourcing ở tầm thiết kế, tích hợp & di chuyển, ATAM & fitness function, Team Topologies.
 * Môn Academy SWD392 (UML, COMET, GoF, Gomaa Ch12–18/20–24, SOLID + giới thiệu clean/DDD ở Ch7) dẫn SANG đây — bài 0.1.
 * Chạm khoá cũ: system-design Ch12 (design doc, ADR, monolith vs microservices), distributed-systems Ch8 (2PC, saga,
 * outbox — phần lý thuyết), kafka Ch7–8 (outbox+CDC, event sourcing/CQRS trên Kafka), api-design — bài "Nếu đã học …" + link.
 * Soạn chi tiết sau theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'software-architecture',
    title: 'Software Architecture',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/software-architecture.png?v=4',
    shortDescription: 'Beyond UML and design patterns: architecture characteristics, C4 and ADRs, architecture styles, clean and hexagonal architecture, domain-driven design, event-driven systems, sagas, outbox and CQRS, ATAM reviews and the architect role.|||Đi tiếp sau UML và design pattern: đặc tính kiến trúc, C4 và ADR, các phong cách kiến trúc, clean/hexagonal, DDD, hệ hướng sự kiện, saga, outbox, CQRS, đánh giá ATAM và vai trò kiến trúc sư.',
    description: 'Khoá dành cho lập trình viên backend đã học SWD392 (UML, COMET, GoF) hoặc tương đương và đã làm ít nhất một dự án nhiều module, muốn thiết kế hệ thống có lý do và bảo vệ được thiết kế trước hội đồng hay nhà tuyển dụng. Kiến trúc là những quyết định khó đổi; đặc tính kiến trúc và đánh đổi; ghi và truyền đạt bằng C4, ADR, arc42; các phong cách nguyên khối và phân tán; clean/hexagonal/onion trong Spring Boot; DDD chiến lược (bounded context, context map, EventStorming) và chiến thuật (aggregate, value object, domain event); event-driven; nhất quán giữa dịch vụ bằng saga, outbox, CQRS, event sourcing ở tầm thiết kế; tích hợp, strangler fig, contract test; đánh giá kiến trúc theo ATAM và fitness function; vai trò kiến trúc sư trong tổ chức; dự án cuối khoá thiết kế và dựng hai bounded context của LabFlow AI.',
    whatYouLearn: 'Rút đặc tính kiến trúc từ yêu cầu và chọn phong cách có lý do; vẽ sơ đồ C4 bằng code và viết ADR đúng chuẩn; dựng ứng dụng Spring Boot theo hexagonal và giữ ranh giới bằng ArchUnit; chạy một buổi EventStorming và vẽ context map; thiết kế aggregate bảo vệ bất biến; thiết kế saga có bù trừ, outbox/inbox và read model CQRS; tách dần một khối nguyên khối bằng strangler fig; chạy một buổi ATAM rút gọn; viết fitness function trong CI; trình bày và bảo vệ kiến trúc.',
    requirements: 'Java/Spring Boot hoặc Node.js/TypeScript ở mức làm được dự án; SQL; Docker cơ bản. Nên học trước: môn Academy SWD392 (UML, COMET, GoF), khoá API Design, System Design. Nên học song song hoặc trước phần Chương 8–9: Distributed Systems và Apache Kafka. Sau khoá này: Cloud Architecture.',
    documentsNote: 'Tài liệu chính: "Fundamentals of Software Architecture" (Richards & Ford, O’Reilly, 2nd ed.) • "Software Architecture: The Hard Parts" (Ford, Richards, Sadalage, Dehghani) • "Domain-Driven Design" (Eric Evans, 2003) • "Implementing Domain-Driven Design" (Vaughn Vernon) • "Microservices Patterns" (Chris Richardson) và microservices.io • "Clean Architecture" (Robert C. Martin) • "Building Evolutionary Architectures" (Ford, Parsons, Kua) • "Team Topologies" (Skelton & Pais) • c4model.com • adr.github.io • arc42.org • SEI: ATAM (Carnegie Mellon Software Engineering Institute) • ISO/IEC/IEEE 42010 • iSAQB CPSA-F (isaqb.org).',
  },
  sections: khung('swarch', [
    ['Section 0 — Why software architecture is its own discipline', 'Mục 0 — Vì sao kiến trúc phần mềm là một nghề riêng', 'Kiến trúc là gì, lịch sử, những thất bại do kiến trúc, và nối tiếp từ SWD392.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Software architecture in everyday words, its history, and failures caused by architecture', 'Bắt đầu tại đây (1/2) — Kiến trúc phần mềm bằng lời đời thường, lịch sử, và những thất bại do kiến trúc', 'Kiến trúc = những quyết định khó đổi · Mốc: Dijkstra hệ THE (1968), Parnas che giấu thông tin (1972), Perry & Wolf (1992), Shaw & Garlan (1996), Kruchten 4+1 (1995), GoF (1994), Evans DDD (2003), Cockburn hexagonal (2005), Fowler & Lewis microservices (2014) · Healthcare.gov ra mắt sập (2013) · Knight Capital mất 440 triệu USD trong 45 phút (2012) · Prime Video quay về nguyên khối cho một luồng (2023)'],
      ['bat-dau-lo-trinh', 'Start here (2/2) — What you can do after this course, the architect career, and where it sits in the path', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, nghề kiến trúc sư, và vị trí khoá trong lộ trình', 'Dev → senior → tech lead → software/solution architect · Kiến trúc sư không chỉ vẽ: còn code, viết, thương lượng · Lộ trình: SWD392 → API Design → System Design → Distributed Systems → Kafka → khoá này → Cloud Architecture · Chuỗi LabFlow: Software Architect viết C4/ADR cho đồ án SEP490'],
      ['neu-da-hoc-swd392', 'If you took SWD392: UML, COMET, GoF and Gomaa’s architecture chapters in one page — and what this course adds', 'Nếu đã học SWD392: UML, COMET, GoF và các chương kiến trúc của Gomaa trong một trang — và khoá này thêm gì', 'Nhắc nhanh: sơ đồ UML, COMET, 4+1, thuộc tính chất lượng (Ch.20), kiến trúc OO, client/server, SOA, component, thời gian thực (Ch.12–18) · GoF 23 mẫu · SOLID và giới thiệu clean/DDD ở Ch.7 · Trỏ /academy SWD392 · Khoá này đi tiếp: quyết định, đánh đổi, DDD sâu, hướng sự kiện, đánh giá'],
      ['neu-da-hoc-khoa-khac', 'If you took System Design, Distributed Systems or Kafka: who owns which topic', 'Nếu đã học System Design, Distributed Systems hay Kafka: khoá nào sở hữu chủ đề nào', 'System Design Ch12: design doc, ADR, monolith vs microservices (nhắc) · Distributed Systems Ch8: 2PC, saga, outbox ở mức lý thuyết · Kafka Ch7–8: outbox + CDC, event sourcing trên Kafka · Ở đây: quyết định thiết kế và mô hình miền'],
      ['cai-dat', 'Setting up the lab: Java 21 + Spring Boot, Docker Compose, Structurizr, ArchUnit and an EventStorming board', 'Dựng lab: Java 21 + Spring Boot, Docker Compose, Structurizr, ArchUnit và bảng EventStorming', 'Structurizr Lite hoặc C4-PlantUML · ArchUnit, Spring Modulith · Công cụ ADR (adr-tools, log4brains) · Bảng ảo Excalidraw/Miro cho EventStorming · Repo mẫu LabFlow'],
    ]],
    ['Chapter 1 — The architect’s job and thinking in trade-offs', 'Chương 1 — Việc của kiến trúc sư và tư duy đánh đổi', 'Kiến trúc sư làm gì, đặc tính kiến trúc, và vì sao mọi thứ đều là đánh đổi.', [
      ['dinh-nghia', 'What counts as architecture: structure, characteristics, decisions, principles', 'Thế nào là kiến trúc: cấu trúc, đặc tính, quyết định, nguyên tắc', 'Bốn chiều theo Richards & Ford · Kiến trúc vs thiết kế chi tiết · Ví dụ quyết định khó đổi trong LabFlow'],
      ['dac-tinh', 'Architecture characteristics: finding the "-ilities" that really matter', 'Đặc tính kiến trúc: tìm ra những "-ility" thật sự quan trọng', 'Nếu đã học SWD392 3.A: chín thuộc tính chất lượng · Rút đặc tính ngầm từ yêu cầu · Chọn tối đa ba đặc tính chủ đạo · Đo được thì mới quản được'],
      ['kich-ban-chat-luong', 'Quality attribute scenarios: making characteristics testable', 'Kịch bản thuộc tính chất lượng: biến đặc tính thành thứ kiểm được', 'Nguồn kích thích, kích thích, môi trường, phản hồi, thước đo · Viết kịch bản cho LabFlow · Dùng lại ở ATAM Chương 11'],
      ['danh-doi', 'Everything is a trade-off: reasoning with options and consequences', 'Mọi thứ đều là đánh đổi: lập luận bằng phương án và hệ quả', 'Không có "tốt nhất", chỉ có "ít tệ nhất" · Bảng so sánh phương án · Chi phí thay đổi về sau'],
      ['loai-kien-truc-su', 'Kinds of architects: enterprise, solution, software, technical lead', 'Các loại kiến trúc sư: doanh nghiệp, giải pháp, phần mềm, tech lead', 'Phạm vi và đầu ra mỗi vai · Kiến trúc sư vẫn phải code · Kỹ năng mềm là kỹ năng chính'],
    ]],
    ['Chapter 2 — Documenting and communicating architecture: C4, ADR, arc42', 'Chương 2 — Ghi lại và truyền đạt kiến trúc: C4, ADR, arc42', 'Sơ đồ người ta đọc được và quyết định có lý do được lưu lại.', [
      ['c4', 'The C4 model: context, containers, components, code', 'Mô hình C4: ngữ cảnh, container, component, code', 'Bốn mức phóng to · Ký hiệu tối giản và chú thích · Sơ đồ phụ: động, triển khai · So với UML đã học ở SWD392'],
      ['so-do-ma', 'Diagrams as code: Structurizr DSL and C4-PlantUML', 'Sơ đồ dạng code: Structurizr DSL và C4-PlantUML', 'Một mô hình, nhiều góc nhìn · Lưu trong Git cạnh mã nguồn · Tự sinh sơ đồ trong CI'],
      ['adr', 'Architecture Decision Records in depth: templates, lifecycle and review', 'Architecture Decision Record chuyên sâu: mẫu, vòng đời và review', 'Nếu đã học System Design 12.2: chỉ nhắc mẫu Nygard (2011) · MADR · Trạng thái đề xuất/chấp nhận/bị thay thế · Ghi phương án bị loại · Log4brains'],
      ['arc42-42010', 'arc42 and ISO/IEC/IEEE 42010: views, viewpoints and stakeholders', 'arc42 và ISO/IEC/IEEE 42010: góc nhìn, điểm nhìn và bên liên quan', '12 mục của arc42 · Từ 4+1 của Kruchten tới 42010 · Mỗi bên liên quan cần góc nhìn nào · Tài liệu đủ, không thừa'],
      ['rfc', 'RFCs and design reviews that people actually read', 'RFC và buổi review thiết kế mà người ta thật sự đọc', 'Trỏ /courses/system-design 12.1 · Quy trình RFC · Hỏi để thiết kế tốt lên, không để thắng'],
    ]],
    ['Chapter 3 — Monolithic architecture styles', 'Chương 3 — Các phong cách kiến trúc nguyên khối', 'Một đơn vị triển khai, nhiều cách tổ chức bên trong.', [
      ['layered', 'Layered architecture revisited: when it works and how it rots', 'Nhìn lại kiến trúc phân tầng: khi nào ổn và mục ruỗng ra sao', 'Nếu đã học SWD392 Ch.12–15: chỉ nhắc · Tầng đóng/mở · Anti-pattern hố sụt (sinkhole) · Package theo tầng vs theo tính năng'],
      ['modular-monolith', 'The modular monolith: strong boundaries without a network', 'Modular monolith: ranh giới chặt mà không cần mạng', 'Module theo miền · Spring Modulith, kiểm ranh giới · Sự kiện trong tiến trình · Bước đệm trước microservices · Trỏ /courses/system-design 12.3'],
      ['microkernel', 'Microkernel (plug-in) architecture', 'Kiến trúc microkernel (plug-in)', 'Lõi + plug-in · Ví dụ: VS Code, Eclipse, trình duyệt · Hợp đồng plug-in và phiên bản'],
      ['pipeline', 'Pipeline (pipes and filters) architecture', 'Kiến trúc đường ống (pipes and filters)', 'Bộ lọc độc lập · ETL, xử lý ảnh, xử lý dữ liệu cảm biến LabFlow · Giới hạn khi cần trạng thái'],
    ]],
    ['Chapter 4 — Distributed architecture styles and choosing one', 'Chương 4 — Các phong cách kiến trúc phân tán và cách chọn', 'Nhiều đơn vị triển khai — được gì, trả giá gì.', [
      ['service-based', 'Service-based architecture: the pragmatic middle ground', 'Kiến trúc dựa trên dịch vụ: lựa chọn trung dung thực dụng', 'Vài dịch vụ thô dùng chung CSDL · So với SOA đã học ở SWD392 Ch.16 · Khi nào đủ tốt'],
      ['microservices', 'Microservices: bounded services, independent deployment, and the real costs', 'Microservices: dịch vụ có ranh giới, triển khai độc lập, và cái giá thật', 'Mỗi dịch vụ sở hữu dữ liệu · Kích cỡ dịch vụ · Chi phí vận hành và quan sát · Distributed monolith'],
      ['event-driven-style', 'Event-driven architecture as a style: broker and mediator topologies', 'Kiến trúc hướng sự kiện như một phong cách: topology broker và mediator', 'Broker: không ai điều phối · Mediator: có bộ điều phối · Lỗi và khả năng quan sát · Chương 8 đi sâu'],
      ['space-serverless', 'Space-based and serverless architectures', 'Kiến trúc space-based và serverless', 'Lưới dữ liệu trong bộ nhớ cho đỉnh tải · Serverless như một phong cách · Trỏ /courses/cloud-architecture Ch4'],
      ['chon-phong-cach', 'Choosing a style: star ratings, team size, and starting simple', 'Chọn phong cách: bảng chấm sao, cỡ đội, và bắt đầu đơn giản', 'Bảng so sánh theo đặc tính · Định luật Conway nhắc nhanh · Quantum kiến trúc · Chọn cho LabFlow kèm ADR'],
    ]],
    ['Chapter 5 — Clean, hexagonal and onion architecture', 'Chương 5 — Clean, hexagonal và onion architecture', 'Giữ lõi nghiệp vụ độc lập khỏi framework, CSDL và giao diện.', [
      ['hexagonal', 'Ports and adapters (hexagonal) by Alistair Cockburn', 'Ports and adapters (hexagonal) của Alistair Cockburn', 'Cổng vào/cổng ra · Adapter điều khiển và bị điều khiển · Vì sao "hexagonal" chỉ là hình vẽ · Đổi CSDL, đổi giao diện không đụng lõi'],
      ['onion-clean', 'Onion (2008) and Clean Architecture (2012): the dependency rule', 'Onion (2008) và Clean Architecture (2012): quy tắc phụ thuộc', 'Phụ thuộc chỉ hướng vào trong · Entity, use case, interface adapter, framework · Liên hệ DIP trong SOLID đã học'],
      ['spring-hexagonal', 'Implementing hexagonal architecture in Spring Boot', 'Dựng hexagonal trong Spring Boot', 'Cấu trúc package theo tính năng · Lõi không chú thích JPA · Ánh xạ giữa mô hình miền và entity lưu trữ · Cấu hình bean ở rìa'],
      ['archunit', 'Enforcing boundaries automatically with ArchUnit and jMolecules', 'Tự động giữ ranh giới bằng ArchUnit và jMolecules', 'Luật cấm phụ thuộc ngược · Chạy trong test · Ranh giới hỏng thì build đỏ'],
      ['khi-nao-qua-tay', 'Testing benefits, and when clean architecture is overkill', 'Lợi ích cho kiểm thử, và khi nào clean architecture là quá tay', 'Test lõi không cần CSDL · Ứng dụng CRUD mỏng không cần nhiều tầng · Chi phí ánh xạ'],
    ]],
    ['Chapter 6 — Strategic domain-driven design', 'Chương 6 — Domain-Driven Design chiến lược', 'Chia hệ thống theo miền nghiệp vụ, không theo bảng dữ liệu.', [
      ['ngon-ngu-chung', 'Ubiquitous language: one vocabulary for code and business', 'Ngôn ngữ chung: một bộ từ vựng cho cả code lẫn nghiệp vụ', 'Từ "thiết bị" có mấy nghĩa trong LabFlow · Bảng thuật ngữ sống · Tên trong code theo tên nghiệp vụ'],
      ['subdomain', 'Subdomains: core, supporting and generic — where to invest', 'Miền con: cốt lõi, hỗ trợ và chung — đầu tư vào đâu', 'Cốt lõi tự xây · Chung thì mua/dùng sẵn · Phân loại miền của LabFlow'],
      ['bounded-context', 'Bounded contexts: where a model is valid', 'Bounded context: ranh giới nơi một mô hình có hiệu lực', 'Một khái niệm, nhiều mô hình · Ranh giới ngôn ngữ, ranh giới đội · Bounded context ≠ microservice'],
      ['context-map', 'Context mapping: partnership, customer–supplier, conformist, anti-corruption layer, open host, published language', 'Context map: đối tác, khách–nhà cung cấp, tuân theo, lớp chống hỏng, dịch vụ mở, ngôn ngữ công bố', 'Quan hệ giữa đội và giữa mô hình · Vẽ context map · Lớp chống hỏng khi nối hệ cũ của trường'],
      ['eventstorming', 'EventStorming (Brandolini, 2013) and domain storytelling', 'EventStorming (Brandolini, 2013) và domain storytelling', 'Big picture → process level → design level · Thẻ màu: sự kiện, lệnh, actor, chính sách, điểm nóng · Chạy một buổi cho LabFlow'],
    ]],
    ['Chapter 7 — Tactical domain-driven design', 'Chương 7 — Domain-Driven Design chiến thuật', 'Các khối xây dựng mô hình miền bên trong một bounded context.', [
      ['entity-vo', 'Entities and value objects', 'Entity và value object', 'Định danh vs giá trị · Value object bất biến, tự kiểm tra · Java record · Tiền, khoảng thời gian, mã phòng lab'],
      ['aggregate', 'Aggregates and invariants: Vernon’s rules for aggregate design', 'Aggregate và bất biến: các quy tắc thiết kế aggregate của Vernon', 'Bảo vệ bất biến trong ranh giới nhất quán · Aggregate nhỏ · Tham chiếu bằng ID · Một giao dịch sửa một aggregate'],
      ['repository-service', 'Repositories, domain services, application services and factories', 'Repository, domain service, application service và factory', 'Repository theo aggregate, không theo bảng · Logic nào vào đâu · Application service mỏng'],
      ['domain-event', 'Domain events inside a bounded context', 'Domain event bên trong một bounded context', 'Đặt tên ở thì quá khứ · Phát sau khi lưu · Spring ApplicationEvent và @TransactionalEventListener'],
      ['anemic-jpa', 'The anemic domain model, JPA pitfalls and optimistic locking', 'Mô hình miền thiếu máu, bẫy JPA và khoá lạc quan', 'Getter/setter khắp nơi là dấu hiệu · Lazy loading và ranh giới aggregate · @Version · Trỏ /courses/api-design 5.4'],
    ]],
    ['Chapter 8 — Event-driven architecture in depth', 'Chương 8 — Kiến trúc hướng sự kiện chuyên sâu', 'Bốn nghĩa khác nhau của "event-driven" và cách thiết kế cho đúng.', [
      ['bon-nghia', 'Four meanings of "event-driven": notification, event-carried state transfer, event sourcing, CQRS', 'Bốn nghĩa của "event-driven": thông báo, mang theo trạng thái, event sourcing, CQRS', 'Bài viết của Martin Fowler (2017) · Mỗi kiểu được gì, mất gì · Đừng trộn lẫn khi bàn thiết kế'],
      ['choreography-orchestration', 'Choreography vs orchestration', 'Vũ đạo (choreography) vs điều phối (orchestration)', 'Ai biết toàn bộ quy trình · Khó theo dõi khi nhiều bước · Chọn theo độ phức tạp nghiệp vụ'],
      ['hop-dong-su-kien', 'Event contracts: schema, versioning and AsyncAPI', 'Hợp đồng sự kiện: schema, phiên bản và AsyncAPI', 'Nếu đã học Kafka 5.1–5.3: chỉ nhắc · Sự kiện là API công khai · Tương thích ngược · Tài liệu bằng AsyncAPI'],
      ['nhat-quan-cuoi', 'Living with eventual consistency, including in the UI', 'Sống chung với nhất quán cuối cùng, kể cả trên giao diện', 'Đọc ngay sau khi ghi · Trạng thái "đang xử lý" · Thông báo khi xong · Nói với nghiệp vụ thế nào'],
      ['loi-su-kien', 'Failure in event-driven systems: poison messages, ordering and replay', 'Lỗi trong hệ hướng sự kiện: thông điệp độc, thứ tự và phát lại', 'Dead-letter · Consumer idempotent · Phát lại để dựng lại trạng thái · Trỏ /courses/kafka Ch4'],
    ]],
    ['Chapter 9 — Data consistency across services: saga, outbox, CQRS, event sourcing', 'Chương 9 — Nhất quán dữ liệu giữa dịch vụ: saga, outbox, CQRS, event sourcing', 'Thiết kế quy trình nhiều dịch vụ mà không có giao dịch phân tán.', [
      ['neu-da-hoc', 'If you took Distributed Systems Ch8 and Kafka Ch7–8: the theory in one page', 'Nếu đã học Distributed Systems Ch8 và Kafka Ch7–8: lý thuyết trong một trang', 'Ghi kép, 2PC và vấn đề chặn · Saga, outbox, CDC đã học · Ở đây: mô hình hoá và cài đặt trong ứng dụng'],
      ['saga-thiet-ke', 'Designing sagas: compensations as domain actions, semantic locks and countermeasures', 'Thiết kế saga: bù trừ là hành động nghiệp vụ, khoá ngữ nghĩa và biện pháp chống bất thường', 'Bước có thể bù, bước chốt, bước thử lại được (Richardson) · Trạng thái "đang chờ" · Process manager · Saga đặt thiết bị lab của LabFlow'],
      ['outbox-inbox', 'Transactional outbox and inbox in Spring Boot: polling publisher vs CDC', 'Transactional outbox và inbox trong Spring Boot: đọc định kỳ vs CDC', 'Bảng outbox cùng giao dịch · Inbox chống xử lý trùng · Dọn bảng · Trỏ /courses/kafka 7.3 cho Debezium'],
      ['cqrs', 'CQRS: separate read models and projections', 'CQRS: mô hình đọc riêng và projection', 'Khi nào đáng tách đọc/ghi · Dựng projection từ sự kiện · Độ trễ của mô hình đọc · Không cần hai CSDL mới là CQRS'],
      ['event-sourcing', 'Event sourcing: when it is worth it, snapshots and upcasting', 'Event sourcing: khi nào đáng, snapshot và nâng phiên bản sự kiện', 'Kiểm toán và du hành thời gian · Chi phí: truy vấn, đổi schema, xoá dữ liệu cá nhân · Snapshot · Axon, EventStoreDB'],
      ['workflow-engine', 'Workflow engines for long-running processes: Temporal and Camunda', 'Workflow engine cho quy trình dài: Temporal và Camunda', 'Khi nào thay saga tự viết · Durable execution · BPMN · Cái giá thêm một hạ tầng'],
    ]],
    ['Chapter 10 — Integration, boundaries and migration', 'Chương 10 — Tích hợp, ranh giới và di chuyển kiến trúc', 'Nối các phần lại với nhau và thay đổi hệ thống đang chạy.', [
      ['dong-bo-bat-dong-bo', 'Synchronous vs asynchronous communication: a decision guide', 'Giao tiếp đồng bộ vs bất đồng bộ: hướng dẫn quyết định', 'Ghép nối thời gian · Chuỗi gọi dài và tính sẵn sàng · Trỏ /courses/api-design'],
      ['gateway-bff', 'API gateway, backend-for-frontend and service mesh at the architecture level', 'API gateway, backend-for-frontend và service mesh ở tầm kiến trúc', 'BFF cho web và app · Gateway không chứa nghiệp vụ · Mesh giải quyết gì và không giải quyết gì'],
      ['anti-pattern', 'Integration anti-patterns: shared database, distributed monolith, chatty services', 'Anti-pattern tích hợp: dùng chung CSDL, distributed monolith, dịch vụ nói quá nhiều', 'Dấu hiệu nhận biết · Đo độ ghép nối · Cách gỡ dần'],
      ['strangler', 'Strangler fig and anti-corruption layers for legacy systems', 'Strangler fig và lớp chống hỏng cho hệ thống cũ', 'Bài viết của Fowler (2004) · Định tuyến dần sang phần mới · Branch by abstraction · Ví dụ tách module khỏi một nguyên khối'],
      ['contract-test', 'Consumer-driven contract testing with Pact', 'Kiểm thử hợp đồng do bên dùng dẫn dắt với Pact', 'Thay test end-to-end giòn · Broker hợp đồng · Trỏ /courses/testing'],
    ]],
    ['Chapter 11 — Evaluating and evolving architecture', 'Chương 11 — Đánh giá và tiến hoá kiến trúc', 'ATAM, fitness function, nợ kỹ thuật và luyện tập bằng kata.', [
      ['atam', 'ATAM: the SEI’s Architecture Tradeoff Analysis Method step by step', 'ATAM: phương pháp phân tích đánh đổi kiến trúc của SEI, từng bước', 'Chín bước, hai giai đoạn · Cây tiện ích (utility tree) · Điểm nhạy, điểm đánh đổi, rủi ro, không rủi ro · Đầu ra của buổi đánh giá'],
      ['atam-rut-gon', 'A lightweight ATAM for student and small-team projects', 'ATAM rút gọn cho đồ án sinh viên và đội nhỏ', 'Hai giờ thay vì hai ngày · Mẫu biên bản · Chạy thử trên LabFlow'],
      ['fitness-function', 'Fitness functions and evolutionary architecture', 'Fitness function và kiến trúc tiến hoá', 'Ford, Parsons, Kua · Kiểm đặc tính tự động: phụ thuộc, hiệu năng, bảo mật · Chạy trong CI'],
      ['no-ky-thuat', 'Technical debt: making it visible and paying it down deliberately', 'Nợ kỹ thuật: làm cho nó hiện ra và trả có chủ đích', 'Góc phần tư nợ của Fowler · Đo bằng tần suất sửa và độ phức tạp · Ghi nợ thành ADR'],
      ['kata', 'Architecture katas: practising design under constraints', 'Architecture kata: luyện thiết kế với ràng buộc', 'Đề kata mẫu · Làm nhóm, trình bày, nhận phản biện · Thói quen hằng tuần'],
    ]],
    ['Chapter 12 — The architect in the organisation', 'Chương 12 — Kiến trúc sư trong tổ chức', 'Đội, giao tiếp, ra quyết định và quản trị kiến trúc không thành tháp ngà.', [
      ['conway-team-topologies', 'Conway’s law and Team Topologies', 'Định luật Conway và Team Topologies', 'Conway (1968) · Bốn kiểu đội và ba kiểu tương tác (Skelton & Pais, 2019) · Inverse Conway maneuver · Tải nhận thức của đội'],
      ['ra-quyet-dinh', 'Decision-making: advice process, consensus and when the architect decides', 'Ra quyết định: advice process, đồng thuận và khi nào kiến trúc sư quyết', 'Advice process (Harmel-Law) · Quyết định có thể đảo ngược vs không · Ghi lại bằng ADR'],
      ['giao-tiep', 'Communicating with stakeholders: presenting, negotiating, saying no', 'Giao tiếp với các bên: trình bày, thương lượng, nói không', 'Nói bằng rủi ro và chi phí, không bằng thuật ngữ · Thuyết trình trước hội đồng đồ án · Đàm phán phạm vi'],
      ['quan-tri', 'Architecture governance without the ivory tower', 'Quản trị kiến trúc mà không thành tháp ngà', 'Nguyên tắc thay vì luật chi tiết · Hướng dẫn và mẫu dự án · Fitness function thay cho duyệt tay'],
      ['nghe-nghiep', 'Growing from developer to architect', 'Từ lập trình viên trở thành kiến trúc sư', 'Kỹ năng cần tích luỹ · Danh mục quyết định đã làm · Đọc gì, theo ai, luyện gì'],
    ]],
    ['Chapter 13 — Interviews and certifications', 'Chương 13 — Phỏng vấn và chứng chỉ', 'Chứng chỉ có thật và vòng phỏng vấn kiến trúc.', [
      ['isaqb', 'iSAQB CPSA-F (Certified Professional for Software Architecture – Foundation Level)', 'iSAQB CPSA-F (Certified Professional for Software Architecture – Foundation Level)', 'Đề cương chính thức và cách ánh xạ sang khoá này · Hình thức thi · Kiểm thông tin mới nhất trên isaqb.org'],
      ['togaf-cloud', 'TOGAF and cloud architect certifications: when they help a software architect', 'TOGAF và chứng chỉ kiến trúc cloud: khi nào có ích cho kiến trúc sư phần mềm', 'TOGAF thiên về kiến trúc doanh nghiệp · AWS SAP (trỏ /courses/cloud-architecture Ch13) · Danh mục dự án quan trọng hơn chứng chỉ'],
      ['cau-hoi', 'Architecture interview questions with reasoning', 'Câu hỏi phỏng vấn kiến trúc kèm lập luận', 'Monolith hay microservices · Nhất quán giữa dịch vụ · DDD trong thực tế · Kể một quyết định sai và cách sửa'],
      ['kata-phong-van', 'The architecture kata interview round', 'Vòng phỏng vấn dạng architecture kata', 'Hỏi lại yêu cầu · Vẽ C4 nhanh · Nói rõ đánh đổi · Trỏ /courses/system-design Ch11'],
    ]],
    ['Chapter 14 — Capstone: architecting LabFlow AI end to end', 'Chương 14 — Dự án cuối khoá: kiến trúc LabFlow AI từ đầu tới cuối', 'Từ EventStorming tới hai bounded context chạy thật, có ADR, ATAM và fitness function — dùng được cho hồ sơ SEP490.', [
      ['kham-pha-mien', 'Domain discovery: EventStorming, subdomains and a context map for LabFlow', 'Khám phá miền: EventStorming, miền con và context map cho LabFlow', 'Đặt lịch phòng lab, mượn thiết bị, thu dữ liệu IoT, trợ lý AI · Phân loại miền · Context map và ngôn ngữ chung'],
      ['kien-truc', 'Architecture: characteristics, style choice, C4 diagrams and the first ADRs', 'Kiến trúc: đặc tính, chọn phong cách, sơ đồ C4 và các ADR đầu tiên', 'Kịch bản chất lượng · Modular monolith hay dịch vụ · Structurizr trong repo · Năm ADR quan trọng'],
      ['xay-dung', 'Building two bounded contexts: hexagonal Spring Boot, outbox and a booking saga', 'Dựng hai bounded context: Spring Boot hexagonal, outbox và saga đặt lịch', 'Aggregate bảo vệ bất biến · Outbox + inbox · Saga có bù trừ · ArchUnit giữ ranh giới'],
      ['danh-gia', 'Evaluation: lightweight ATAM and fitness functions in CI', 'Đánh giá: ATAM rút gọn và fitness function trong CI', 'Cây tiện ích · Rủi ro và điểm đánh đổi · Fitness function chạy mỗi lần push'],
      ['bao-ve', 'Defending the architecture: thesis committee and interview story', 'Bảo vệ kiến trúc: trước hội đồng đồ án và trong phỏng vấn', 'Tài liệu arc42 rút gọn · Trả lời "vì sao không làm X" · Câu chuyện phỏng vấn'],
    ]],
  ]),
};
