/**
 * build-swd392-pe4.mjs — sinh content/exams/SWD392-PE4.mjs.
 *
 * Nguồn thật: "SWD392_SU25_PE_2" ("SWD392 – Software Architecture and
 * Design, Practical Exam"), hệ thống quản lý cửa hàng hoa (flower shop).
 *
 * ⚠️ Có 1 bài làm .doc của sinh viên khác (tìm thấy nhầm chỗ, đính kèm
 * trong .rar của folder "SWD392 - SU25 - PE - 1 - RE" chứ không phải
 * folder này) khớp ĐÚNG bối cảnh flower shop này (cùng 8 thực thể:
 * Customer/Flower/Arrangement/Category/Order/Inventory/Staff/Payment,
 * cùng pseudocode Strategy pattern RegularPricing/SeasonalPricing/
 * VIPPricing/FlowerOrder) — NHƯNG Part 1.4 của bài đó lại hỏi/trả lời
 * về thực thể "Booking" trong "ticket booking process", trong khi
 * paper.pdf THẬT của đề này hỏi về thực thể "Order" — một lệch lạc rõ
 * ràng (có thể sinh viên dán nhầm từ 1 đề luyện tập khác). Đã KHÔNG
 * copy phần đó; toàn bộ Part 1.4 (trạng thái Order) tự thiết kế mới,
 * đúng đề. Phần liệt kê thực thể (Part 1.1) dùng độc lập, chỉ khớp
 * TÌNH CỜ với đúng vấn đề đề bài (không sao chép mù).
 *
 * Điểm gốc: Part 1: 1+1+1.5+1.5=5đ; Part 2: 1.5+1.5=3đ (câu 2.1 giờ là
 * VẼ class diagram chi tiết, không chỉ mô tả như PE1/PE3); Part 3:
 * 0.5+1+0.5=2đ (Strategy pattern, behavioral).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE4.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE4.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;
const CODE = (code, lang) => `<pre><code class="language-${lang}">${code
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Problem statement:</b><p>To improve the flower shopping experience and streamline operations, a flower shop intends to build a comprehensive flower shop management system. Through this system, customers can browse flowers, view available arrangements, and place online orders for bouquets. Users are able to pick specific flowers, personalize arrangements, and view flower details such as type, color, seasonal availability, care instructions, and pricing.</p>
   <p>The shop offers several flower categories, including fresh flowers, artificial flowers, and seasonal arrangements. Customers can review their past orders and receive confirmation emails. Pricing in the system depends on flower type (premium, standard, budget), arrangement complexity (simple bouquet, elaborate arrangement, wedding package), and delivery options (same-day, next-day, scheduled delivery). Staff members can manage the flower inventory, keep track of stock levels, create custom arrangements, and process payments. The system accommodates both online ordering and in-store walk-in purchases.</p>
   <p>Client-server architecture: React client; REST API server (MVC pattern); relational database; JSON over HTTP.</p></div>`,
  `<div class="pe-system"><b>Đề bài:</b><p>Để cải thiện trải nghiệm mua hoa và tinh gọn vận hành, 1 cửa hàng hoa dự định xây hệ thống quản lý cửa hàng hoa toàn diện. Qua đó, khách hàng duyệt hoa, xem các bó hoa/lẵng hoa (arrangement) có sẵn, và đặt đơn online cho bó hoa. Người dùng chọn hoa cụ thể, cá nhân hoá lẵng hoa, xem chi tiết hoa (loại, màu, mùa có sẵn, hướng dẫn chăm sóc, giá).</p>
   <p>Cửa hàng có nhiều danh mục hoa: hoa tươi, hoa giả, lẵng hoa theo mùa. Khách hàng xem lại đơn cũ và nhận email xác nhận. Giá phụ thuộc loại hoa (cao cấp, tiêu chuẩn, bình dân), độ phức tạp lẵng hoa (bó đơn giản, lẵng cầu kỳ, gói cưới), và tùy chọn giao hàng (trong ngày, hôm sau, hẹn lịch). Nhân viên quản lý tồn kho hoa, theo dõi mức tồn, tạo lẵng hoa tuỳ chỉnh, xử lý thanh toán. Hệ thống phục vụ cả đặt online và mua trực tiếp tại cửa hàng.</p>
   <p>Kiến trúc client-server: client React; server REST API (mẫu MVC); database quan hệ; JSON qua HTTP.</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Software Architecture and Design, Practical Exam (Summer 2025)</strong>. This is a written practical exam on data modeling, REST API design, and design patterns. The original paper asks for Draw.io diagrams in a Word file — here, diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Kiến trúc và Thiết kế Phần mềm, Thi thực hành (Summer 2025)</strong>. Đây là bài thi thực hành về mô hình hoá dữ liệu, thiết kế REST API, và design pattern dạng viết. Đề gốc yêu cầu vẽ Draw.io trong file Word — ở đây sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.1 (1 point):</strong> LIST the primary entities and their key attributes derived from the problem description.</p>`,
    `<p><strong>Phần 1.1 (1 điểm):</strong> LIỆT KÊ các thực thể chính và thuộc tính chính, dựa vào đề bài.</p>`,
  ),
  sampleSolution: B(
    `<ul><li><b>Customer</b>: customerId, name, email, address, phone.</li>
     <li><b>Category</b>: categoryId, categoryName (e.g., fresh flowers, artificial flowers, seasonal).</li>
     <li><b>Flower</b>: flowerId, type, color, seasonAvailability, careInstructions, price, categoryId.</li>
     <li><b>Arrangement</b> (custom bouquet, composed of flowers): arrangementId, complexity, price, staffId.</li>
     <li><b>Order</b>: orderId, customerId, orderDate, totalAmount, orderStatus, deliveryOption.</li>
     <li><b>Inventory</b>: inventoryId, flowerId, quantityOnHand.</li>
     <li><b>Staff</b>: staffId, name, role.</li>
     <li><b>Payment</b>: paymentId, orderId, amount, paymentMethod, transactionId.</li></ul>
     <p><i>Note: since an order can contain multiple arrangements and an arrangement can be composed of multiple flower types, two junction entities (OrderItem, ArrangementFlower) are also needed at the logical level — see Part 1.3.</i></p>`,
    `<ul><li><b>Customer</b> (khách hàng): customerId, name, email, address, phone.</li>
     <li><b>Category</b> (danh mục): categoryId, categoryName (VD hoa tươi, hoa giả, theo mùa).</li>
     <li><b>Flower</b> (hoa): flowerId, type, color, seasonAvailability, careInstructions, price, categoryId.</li>
     <li><b>Arrangement</b> (lẵng hoa tuỳ chỉnh, gồm nhiều hoa): arrangementId, complexity, price, staffId.</li>
     <li><b>Order</b> (đơn hàng): orderId, customerId, orderDate, totalAmount, orderStatus, deliveryOption.</li>
     <li><b>Inventory</b> (tồn kho): inventoryId, flowerId, quantityOnHand.</li>
     <li><b>Staff</b> (nhân viên): staffId, name, role.</li>
     <li><b>Payment</b> (thanh toán): paymentId, orderId, amount, paymentMethod, transactionId.</li></ul>
     <p><i>Lưu ý: vì 1 đơn có thể chứa nhiều lẵng hoa và 1 lẵng hoa có thể gồm nhiều loại hoa, cần thêm 2 thực thể trung gian (OrderItem, ArrangementFlower) ở mức logic — xem Phần 1.3.</i></p>`,
  ),
  explanation: B(
    `<p>A student answer found elsewhere lists the same 8 core entities for this exact scenario, but its Part 1.4 answer discusses a "Booking" entity in a "ticket booking process" — that mismatches this paper's own Part 1.4, which asks about the Order entity. That mismatched section was not used anywhere in this deck; every answer here was independently designed against this paper's actual text.</p>`,
    `<p>1 bài làm của sinh viên tìm thấy ở nơi khác liệt kê đúng 8 thực thể cốt lõi cho tình huống này, nhưng Phần 1.4 của họ lại bàn về thực thể "Booking" trong "quy trình đặt vé" — lệch với chính Phần 1.4 của đề này (hỏi về thực thể Order). Phần lệch đó không được dùng ở đâu trong đề này; mọi câu trả lời ở đây tự thiết kế độc lập theo đúng văn bản thật của đề.</p>`,
  ),
  rubric: [
    { id: 'eight_entities', criterion: B('Identifies all 8 core entities: Customer, Category, Flower, Arrangement, Order, Inventory, Staff, Payment.', 'Xác định đủ 8 thực thể cốt lõi: Customer, Category, Flower, Arrangement, Order, Inventory, Staff, Payment.'), weight: 1, maxScore: 0.6 },
    { id: 'key_attributes', criterion: B('Each entity lists reasonable key attributes matching the problem description.', 'Mỗi thực thể liệt kê thuộc tính chính hợp lý, khớp đề bài.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.2 (1 point):</strong> DRAW the conceptual ERD for the system.</p>`,
    `<p><strong>Phần 1.2 (1 điểm):</strong> VẼ ERD mức khái niệm cho hệ thống.</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER }o--o{ ARRANGEMENT : contains
    ARRANGEMENT }o--o{ FLOWER : includes
    FLOWER }o--|| CATEGORY : belongsTo
    FLOWER ||--|| INVENTORY : trackedBy
    ORDER ||--o| PAYMENT : paidBy
    STAFF ||--o{ ARRANGEMENT : creates
    STAFF ||--o{ PAYMENT : processes`),
    MMD(`erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER }o--o{ ARRANGEMENT : contains
    ARRANGEMENT }o--o{ FLOWER : includes
    FLOWER }o--|| CATEGORY : belongsTo
    FLOWER ||--|| INVENTORY : trackedBy
    ORDER ||--o| PAYMENT : paidBy
    STAFF ||--o{ ARRANGEMENT : creates
    STAFF ||--o{ PAYMENT : processes`),
  ),
  rubric: [
    { id: 'entities_present', criterion: B('Includes Customer, Order, Arrangement, Flower, Category, Inventory, Staff, and Payment as distinct entities.', 'Có đủ Customer, Order, Arrangement, Flower, Category, Inventory, Staff, Payment là thực thể riêng.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_cardinality', criterion: B('Correct cardinalities: Customer-Order 1:N; Order-Arrangement M:N; Arrangement-Flower M:N; Flower-Category N:1; Order-Payment 1:0..1; Staff creates Arrangements and processes Payments (1:N).', 'Cardinality đúng: Customer-Order 1:N; Order-Arrangement N:N; Arrangement-Flower N:N; Flower-Category N:1; Order-Payment 1:0..1; Staff tạo Arrangement và xử lý Payment (1:N).'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.3 (1.5 points):</strong> DRAW the logical ERD (with primary/foreign keys and basic data types).</p>`,
    `<p><strong>Phần 1.3 (1.5 điểm):</strong> VẼ ERD mức logic (khoá chính/khoá ngoại và kiểu dữ liệu cơ bản).</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    CUSTOMER {
        int customerId PK
        varchar name
        varchar email
        varchar address
        varchar phone
    }
    CATEGORY {
        int categoryId PK
        varchar categoryName
    }
    FLOWER {
        int flowerId PK
        varchar type
        varchar color
        varchar seasonAvailability
        varchar careInstructions
        decimal price
        int categoryId FK
    }
    STAFF {
        int staffId PK
        varchar name
        varchar role
    }
    ARRANGEMENT {
        int arrangementId PK
        varchar complexity
        decimal price
        int staffId FK
    }
    ARRANGEMENT_FLOWER {
        int arrangementFlowerId PK
        int arrangementId FK
        int flowerId FK
        int quantity
    }
    ORDER {
        int orderId PK
        int customerId FK
        datetime orderDate
        decimal totalAmount
        varchar orderStatus
        varchar deliveryOption
    }
    ORDER_ITEM {
        int orderItemId PK
        int orderId FK
        int arrangementId FK
        int quantity
        decimal subtotal
    }
    INVENTORY {
        int inventoryId PK
        int flowerId FK
        int quantityOnHand
    }
    PAYMENT {
        int paymentId PK
        int orderId FK
        decimal amount
        varchar paymentMethod
        varchar transactionId
    }
    CATEGORY ||--o{ FLOWER : has
    STAFF ||--o{ ARRANGEMENT : creates
    ARRANGEMENT ||--o{ ARRANGEMENT_FLOWER : has
    FLOWER ||--o{ ARRANGEMENT_FLOWER : "used in"
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : has
    ARRANGEMENT ||--o{ ORDER_ITEM : "appears in"
    FLOWER ||--|| INVENTORY : "tracked by"
    ORDER ||--o| PAYMENT : "paid by"`),
    MMD(`erDiagram
    CUSTOMER {
        int customerId PK
        varchar name
        varchar email
        varchar address
        varchar phone
    }
    CATEGORY {
        int categoryId PK
        varchar categoryName
    }
    FLOWER {
        int flowerId PK
        varchar type
        varchar color
        varchar seasonAvailability
        varchar careInstructions
        decimal price
        int categoryId FK
    }
    STAFF {
        int staffId PK
        varchar name
        varchar role
    }
    ARRANGEMENT {
        int arrangementId PK
        varchar complexity
        decimal price
        int staffId FK
    }
    ARRANGEMENT_FLOWER {
        int arrangementFlowerId PK
        int arrangementId FK
        int flowerId FK
        int quantity
    }
    ORDER {
        int orderId PK
        int customerId FK
        datetime orderDate
        decimal totalAmount
        varchar orderStatus
        varchar deliveryOption
    }
    ORDER_ITEM {
        int orderItemId PK
        int orderId FK
        int arrangementId FK
        int quantity
        decimal subtotal
    }
    INVENTORY {
        int inventoryId PK
        int flowerId FK
        int quantityOnHand
    }
    PAYMENT {
        int paymentId PK
        int orderId FK
        decimal amount
        varchar paymentMethod
        varchar transactionId
    }
    CATEGORY ||--o{ FLOWER : has
    STAFF ||--o{ ARRANGEMENT : creates
    ARRANGEMENT ||--o{ ARRANGEMENT_FLOWER : has
    FLOWER ||--o{ ARRANGEMENT_FLOWER : "used in"
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--o{ ORDER_ITEM : has
    ARRANGEMENT ||--o{ ORDER_ITEM : "appears in"
    FLOWER ||--|| INVENTORY : "tracked by"
    ORDER ||--o| PAYMENT : "paid by"`),
  ),
  explanation: B(
    `<p>Two junction tables resolve the two M:N relationships from Part 1.2: ORDER_ITEM (Order-Arrangement) and ARRANGEMENT_FLOWER (Arrangement-Flower) — needed because an order can hold several arrangements and an arrangement recipe reuses flower types across many arrangements.</p>`,
    `<p>2 bảng trung gian giải quyết 2 quan hệ N-N ở Phần 1.2: ORDER_ITEM (Order-Arrangement) và ARRANGEMENT_FLOWER (Arrangement-Flower) — cần vì 1 đơn có thể chứa nhiều lẵng hoa và 1 công thức lẵng hoa dùng lại loại hoa qua nhiều lẵng khác nhau.</p>`,
  ),
  rubric: [
    { id: 'pk_fk_correct', criterion: B('Every entity has a correctly marked PK, and every FK correctly points to its referenced entity\'s PK.', 'Mỗi thực thể có PK đánh dấu đúng, mỗi FK trỏ đúng PK thực thể tham chiếu.'), weight: 1, maxScore: 0.5 },
    { id: 'both_junctions_present', criterion: B('Both required junction entities are present and correctly resolve their respective many-to-many relationships: ORDER_ITEM (Order-Arrangement) and ARRANGEMENT_FLOWER (Arrangement-Flower).', 'Có đủ 2 thực thể trung gian yêu cầu, giải quyết đúng quan hệ N-N tương ứng: ORDER_ITEM (Order-Arrangement) và ARRANGEMENT_FLOWER (Arrangement-Flower).'), weight: 1, maxScore: 0.7 },
    { id: 'data_types', criterion: B('Attributes have reasonable basic data types (int, varchar, decimal, datetime).', 'Thuộc tính có kiểu dữ liệu cơ bản hợp lý (int, varchar, decimal, datetime).'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.4 (1.5 points):</strong> LIST the main states of the Order entity throughout the order process, and DRAW the state diagram for Order.</p>`,
    `<p><strong>Phần 1.4 (1.5 điểm):</strong> LIỆT KÊ các trạng thái chính của thực thể Order xuyên suốt quá trình đặt hàng, và VẼ sơ đồ trạng thái cho Order.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Main states:</strong> Pending (order just placed, awaiting payment confirmation) → Paid (payment confirmed) → Preparing (staff assembling the arrangement) → then, depending on <code>deliveryOption</code>: OutForDelivery (same-day/next-day/scheduled delivery) or ReadyForPickup (in-store walk-in) → Completed (delivered or picked up). Alternate path: Cancelled, reachable from Pending or Paid — but not from Preparing onward, since staff have already committed flowers to the arrangement by then.</p>
     <p><strong>State diagram:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Pending : createOrder
    Pending --> Paid : confirmPayment
    Pending --> Cancelled : cancelOrder
    Paid --> Preparing : startPreparation
    Paid --> Cancelled : cancelOrder
    Preparing --> OutForDelivery : dispatchForDelivery
    Preparing --> ReadyForPickup : markReadyForPickup
    OutForDelivery --> Completed : confirmDelivery
    ReadyForPickup --> Completed : confirmPickup
    Completed --> [*]
    Cancelled --> [*]`),
    `<p><strong>Trạng thái chính:</strong> Pending (vừa đặt, chờ xác nhận thanh toán) → Paid (đã xác nhận thanh toán) → Preparing (nhân viên đang chuẩn bị lẵng hoa) → tuỳ <code>deliveryOption</code>: OutForDelivery (giao trong ngày/hôm sau/hẹn lịch) hoặc ReadyForPickup (mua tại cửa hàng) → Completed (đã giao hoặc đã lấy). Nhánh khác: Cancelled, tới được từ Pending hoặc Paid — không từ Preparing trở đi, vì nhân viên đã cam kết hoa cho lẵng lúc đó.</p>
     <p><strong>Sơ đồ trạng thái:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Pending : createOrder
    Pending --> Paid : confirmPayment
    Pending --> Cancelled : cancelOrder
    Paid --> Preparing : startPreparation
    Paid --> Cancelled : cancelOrder
    Preparing --> OutForDelivery : dispatchForDelivery
    Preparing --> ReadyForPickup : markReadyForPickup
    OutForDelivery --> Completed : confirmDelivery
    ReadyForPickup --> Completed : confirmPickup
    Completed --> [*]
    Cancelled --> [*]`),
  ),
  explanation: B(
    `<p>Cancellation is restricted to Pending/Paid, mirroring the physical reality that once Preparing has started, flowers are already being committed to that specific arrangement. The branch into OutForDelivery vs. ReadyForPickup directly reflects the problem statement's "same-day/next-day/scheduled delivery" vs. "in-store walk-in purchases" distinction.</p>`,
    `<p>Huỷ đơn giới hạn ở Pending/Paid, phản ánh thực tế vật lý rằng một khi Preparing bắt đầu, hoa đã được cam kết cho đúng lẵng đó. Nhánh rẽ OutForDelivery và ReadyForPickup phản ánh trực tiếp phân biệt "giao trong ngày/hôm sau/hẹn lịch" và "mua trực tiếp tại cửa hàng" của đề bài.</p>`,
  ),
  rubric: [
    { id: 'states_list', criterion: B('Lists a coherent, ordered sequence of Order states covering the full lifecycle (placed → paid → preparing → delivery/pickup → completed), with a cancellation path.', 'Liệt kê chuỗi trạng thái Order mạch lạc, có thứ tự, bao quát vòng đời đầy đủ (đặt → thanh toán → chuẩn bị → giao/lấy → hoàn thành), kèm nhánh huỷ.'), weight: 1, maxScore: 0.7 },
    { id: 'state_diagram_valid', criterion: B('Draws a valid Order state diagram with a start state, a branch reflecting delivery vs. in-store pickup, and a correctly restricted cancellation path.', 'Vẽ sơ đồ trạng thái Order hợp lệ, có trạng thái bắt đầu, rẽ nhánh phản ánh giao hàng và mua tại cửa hàng, và nhánh huỷ giới hạn đúng.'), weight: 1, maxScore: 0.8 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 2.1 (1.5 points):</strong> DRAW a class diagram (detailed design) depicting the client-side and server-side classes (Controller, Service, Repository) used for the "create order" function.</p>`,
    `<p><strong>Phần 2.1 (1.5 điểm):</strong> VẼ class diagram (thiết kế chi tiết) thể hiện class phía client và server (Controller, Service, Repository) cho chức năng "tạo đơn hàng".</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class OrderPage {
        +submitOrder(items) void
    }
    class OrderApiService {
        +createOrder(payload) OrderDto
    }
    class OrderController {
        +createOrder(request) OrderDto
    }
    class OrderService {
        -orderRepository : IRepository~Order~
        -arrangementRepository : IRepository~Arrangement~
        +createOrder(customerId int, items OrderItemInput) Order
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +save(entity T) void
    }
    class OrderRepository {
        +findById(id int) Order
        +save(entity Order) void
    }
    class ArrangementRepository {
        +findById(id int) Arrangement
        +save(entity Arrangement) void
    }
    class Order {
        -orderId : int
        -customerId : int
        -orderStatus : string
        -totalAmount : decimal
    }
    class Arrangement {
        -arrangementId : int
        -complexity : string
        -price : decimal
    }

    OrderPage --> OrderApiService : uses
    OrderApiService --> OrderController : HTTP POST /api/orders
    OrderController --> OrderService : delegates
    OrderService ..> IRepository : depends on
    IRepository <|.. OrderRepository
    IRepository <|.. ArrangementRepository
    OrderService --> Order : creates
    OrderService ..> Arrangement : validates`),
    MMD(`classDiagram
    class OrderPage {
        +submitOrder(items) void
    }
    class OrderApiService {
        +createOrder(payload) OrderDto
    }
    class OrderController {
        +createOrder(request) OrderDto
    }
    class OrderService {
        -orderRepository : IRepository~Order~
        -arrangementRepository : IRepository~Arrangement~
        +createOrder(customerId int, items OrderItemInput) Order
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +save(entity T) void
    }
    class OrderRepository {
        +findById(id int) Order
        +save(entity Order) void
    }
    class ArrangementRepository {
        +findById(id int) Arrangement
        +save(entity Arrangement) void
    }
    class Order {
        -orderId : int
        -customerId : int
        -orderStatus : string
        -totalAmount : decimal
    }
    class Arrangement {
        -arrangementId : int
        -complexity : string
        -price : decimal
    }

    OrderPage --> OrderApiService : dùng
    OrderApiService --> OrderController : HTTP POST /api/orders
    OrderController --> OrderService : giao cho
    OrderService ..> IRepository : phụ thuộc
    IRepository <|.. OrderRepository
    IRepository <|.. ArrangementRepository
    OrderService --> Order : tạo
    OrderService ..> Arrangement : kiểm tra`),
  ),
  explanation: B(
    `<p>Both OrderRepository and ArrangementRepository implement the same generic IRepository&lt;T&gt; interface (Repository Pattern), and OrderService depends on the interface rather than concrete repository classes — matching how Part 2.1 explicitly names Controller/Service/Repository as the required layers.</p>`,
    `<p>Cả OrderRepository và ArrangementRepository đều triển khai cùng interface generic IRepository&lt;T&gt; (Repository Pattern), và OrderService phụ thuộc interface thay vì lớp repository cụ thể — khớp cách Phần 2.1 nêu rõ Controller/Service/Repository là các tầng yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'client_and_server_classes', criterion: B('Includes both a client-side class (component/service triggering the request) and the full server-side MVC trio (Controller, Service, Repository).', 'Có cả class phía client (component/service kích hoạt request) và đủ bộ 3 MVC phía server (Controller, Service, Repository).'), weight: 1, maxScore: 0.6 },
    { id: 'repository_interface', criterion: B('Repository classes implement a common repository interface/abstraction rather than being called directly by name from the service without any interface.', 'Lớp repository triển khai 1 interface/abstraction repository chung thay vì service gọi thẳng theo tên cụ thể không qua interface.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_flow_and_relationships', criterion: B('Shows a coherent flow from client through Controller → Service → Repository, with correctly typed relationships (dependency, association) between them.', 'Thể hiện luồng mạch lạc từ client qua Controller → Service → Repository, quan hệ đúng loại (dependency, association) giữa các lớp.'), weight: 1, maxScore: 0.4 },
  ],
};

const q6 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 2.2 (1.5 points):</strong> DRAW a sequence diagram for the "create order" function between client and server (REST API), with authentication and authorization.</p>`,
    `<p><strong>Phần 2.2 (1.5 điểm):</strong> VẼ sequence diagram cho chức năng "tạo đơn hàng" giữa client và server (REST API), có xác thực và phân quyền.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Customer
    participant Client as ReactClient
    participant Ctrl as OrderController
    participant Auth as AuthMiddleware
    participant Svc as OrderService
    participant ArrRepo as ArrangementRepository
    participant OrderRepo as OrderRepository
    participant DB as Database

    Customer->>Client: Select arrangements & submit order
    Client->>Ctrl: POST /api/orders (JWT token, order items)
    Ctrl->>Auth: Verify JWT token
    Auth-->>Ctrl: Authenticated (customerId, role=Customer)
    Ctrl->>Auth: Check authorization (role must be Customer)
    Auth-->>Ctrl: Authorized
    Ctrl->>Svc: createOrder(customerId, items)
    Svc->>ArrRepo: findByIds(arrangementIds)
    ArrRepo->>DB: SELECT * FROM Arrangement WHERE arrangementId IN (...)
    DB-->>ArrRepo: arrangement rows (price)
    ArrRepo-->>Svc: arrangement list
    Svc->>Svc: Compute total amount
    Svc->>OrderRepo: save(new Order(customerId, items, total))
    OrderRepo->>DB: INSERT INTO Order, INSERT INTO OrderItem
    DB-->>OrderRepo: new orderId
    OrderRepo-->>Svc: created Order
    Svc-->>Ctrl: Order confirmation
    Ctrl-->>Client: 201 Created (order JSON)
    Client-->>Customer: Show order confirmation`),
    MMD(`sequenceDiagram
    actor Customer
    participant Client as ReactClient
    participant Ctrl as OrderController
    participant Auth as AuthMiddleware
    participant Svc as OrderService
    participant ArrRepo as ArrangementRepository
    participant OrderRepo as OrderRepository
    participant DB as Database

    Customer->>Client: Chọn lẵng hoa & gửi đơn
    Client->>Ctrl: POST /api/orders (JWT token, các món trong đơn)
    Ctrl->>Auth: Xác thực JWT token
    Auth-->>Ctrl: Đã xác thực (customerId, role=Customer)
    Ctrl->>Auth: Kiểm tra phân quyền (role phải là Customer)
    Auth-->>Ctrl: Đã cấp quyền
    Ctrl->>Svc: createOrder(customerId, items)
    Svc->>ArrRepo: findByIds(arrangementIds)
    ArrRepo->>DB: SELECT * FROM Arrangement WHERE arrangementId IN (...)
    DB-->>ArrRepo: dòng lẵng hoa (giá)
    ArrRepo-->>Svc: danh sách lẵng hoa
    Svc->>Svc: Tính tổng tiền
    Svc->>OrderRepo: save(new Order(customerId, items, total))
    OrderRepo->>DB: INSERT INTO Order, INSERT INTO OrderItem
    DB-->>OrderRepo: orderId mới
    OrderRepo-->>Svc: Order đã tạo
    Svc-->>Ctrl: Xác nhận đơn hàng
    Ctrl-->>Client: 201 Created (JSON đơn hàng)
    Client-->>Customer: Hiện xác nhận đơn hàng`),
  ),
  rubric: [
    { id: 'client_server_flow', criterion: B('Shows the correct client-to-server REST call flow (client request → controller → service → repository → database, and the response flowing back).', 'Thể hiện đúng luồng gọi REST client-tới-server (client gửi → controller → service → repository → database, và phản hồi đi ngược lại).'), weight: 1, maxScore: 0.5 },
    { id: 'auth_authz_present', criterion: B('Explicitly shows BOTH an authentication step AND an authorization step, as distinct steps.', 'Thể hiện rõ CẢ bước xác thực LẪN bước phân quyền, là 2 bước riêng.'), weight: 1, maxScore: 0.6 },
    { id: 'business_logic_steps', criterion: B('Includes an arrangement-lookup and total-computation step before creating the order, reflecting real business logic rather than a blind insert.', 'Có bước tra cứu lẵng hoa và tính tổng tiền trước khi tạo đơn, phản ánh logic nghiệp vụ thật thay vì chèn dữ liệu mù.'), weight: 1, maxScore: 0.4 },
  ],
};

const q7 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.1 (0.5 points):</strong> consider the pseudocode below. WHAT DESIGN PATTERN is used in the code above? Identify its name and pattern family (creational, structural, or behavioral).</p>` +
    CODE(`public interface Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType);
}
public class RegularPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        return basePrice * quantity;
    }
}
public class SeasonalPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        double seasonalDiscount = 0.15; // 15% seasonal discount
        return basePrice * quantity * (1 - seasonalDiscount);
    }
}
public class VIPPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        double vipDiscount = 0.20; // 20% VIP discount
        return basePrice * quantity * (1 - vipDiscount);
    }
}
public class FlowerOrder {
    private Pricing pricing;
    public void setPricing(Pricing p) {
        this.pricing = p;
    }
    public double calculateOrderTotal(double basePrice, int quantity, String customerType) {
        return pricing.calculatePrice(basePrice, quantity, customerType);
    }
}`, 'java'),
    `<p><strong>Phần 3.1 (0.5 điểm):</strong> xem pseudocode dưới. ĐÂY LÀ design pattern nào? Nêu tên và họ pattern (creational, structural, hay behavioral).</p>` +
    CODE(`public interface Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType);
}
public class RegularPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        return basePrice * quantity;
    }
}
public class SeasonalPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        double seasonalDiscount = 0.15; // giảm 15% theo mùa
        return basePrice * quantity * (1 - seasonalDiscount);
    }
}
public class VIPPricing implements Pricing {
    public double calculatePrice(double basePrice, int quantity, String customerType) {
        double vipDiscount = 0.20; // giảm 20% cho VIP
        return basePrice * quantity * (1 - vipDiscount);
    }
}
public class FlowerOrder {
    private Pricing pricing;
    public void setPricing(Pricing p) {
        this.pricing = p;
    }
    public double calculateOrderTotal(double basePrice, int quantity, String customerType) {
        return pricing.calculatePrice(basePrice, quantity, customerType);
    }
}`, 'java'),
  ),
  sampleSolution: B(
    `<p><strong>Pattern:</strong> Strategy. <strong>Family:</strong> Behavioral.</p>
     <p>The giveaway: <code>FlowerOrder</code> (the context) holds a reference to a <code>Pricing</code> interface and delegates the price calculation to whichever concrete strategy (<code>RegularPricing</code>/<code>SeasonalPricing</code>/<code>VIPPricing</code>) is injected via <code>setPricing()</code> — the calculation algorithm is swapped at runtime without changing <code>FlowerOrder</code>'s own code.</p>`,
    `<p><strong>Pattern:</strong> Strategy. <strong>Họ:</strong> Behavioral (hành vi).</p>
     <p>Dấu hiệu: <code>FlowerOrder</code> (context) giữ tham chiếu tới interface <code>Pricing</code> và ủy quyền tính giá cho bất kỳ strategy cụ thể nào (<code>RegularPricing</code>/<code>SeasonalPricing</code>/<code>VIPPricing</code>) được gán qua <code>setPricing()</code> — thuật toán tính được đổi tại runtime mà không sửa mã của <code>FlowerOrder</code>.</p>`,
  ),
  rubric: [
    { id: 'correct_pattern_and_family', criterion: B('Correctly identifies Strategy as the pattern and Behavioral as its family.', 'Xác định đúng Strategy là pattern và Behavioral là họ của nó.'), weight: 1, maxScore: 1 },
  ],
};

const q8 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 3.2 (1 point):</strong> DRAW the class diagram for this pattern.</p>`,
    `<p><strong>Phần 3.2 (1 điểm):</strong> VẼ class diagram cho pattern này.</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class Pricing {
        <<interface>>
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class RegularPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class SeasonalPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class VIPPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class FlowerOrder {
        -pricing : Pricing
        +setPricing(p Pricing) void
        +calculateOrderTotal(basePrice double, quantity int, customerType String) double
    }
    Pricing <|.. RegularPricing
    Pricing <|.. SeasonalPricing
    Pricing <|.. VIPPricing
    FlowerOrder o-- Pricing : pricing`),
    MMD(`classDiagram
    class Pricing {
        <<interface>>
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class RegularPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class SeasonalPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class VIPPricing {
        +calculatePrice(basePrice double, quantity int, customerType String) double
    }
    class FlowerOrder {
        -pricing : Pricing
        +setPricing(p Pricing) void
        +calculateOrderTotal(basePrice double, quantity int, customerType String) double
    }
    Pricing <|.. RegularPricing
    Pricing <|.. SeasonalPricing
    Pricing <|.. VIPPricing
    FlowerOrder o-- Pricing : pricing`),
  ),
  rubric: [
    { id: 'all_classes_present', criterion: B('Includes Pricing (interface), all 3 concrete strategies (RegularPricing, SeasonalPricing, VIPPricing), and FlowerOrder (context).', 'Có đủ Pricing (interface), cả 3 strategy cụ thể (RegularPricing, SeasonalPricing, VIPPricing), và FlowerOrder (context).'), weight: 1, maxScore: 0.5 },
    { id: 'correct_relationships', criterion: B('Correctly shows all 3 strategies implementing Pricing, and FlowerOrder holding a composition/aggregation reference to a Pricing (the injected strategy).', 'Thể hiện đúng cả 3 strategy đều triển khai Pricing, và FlowerOrder giữ tham chiếu composition/aggregation tới 1 Pricing (strategy được gán).'), weight: 1, maxScore: 0.5 },
  ],
};

const q9 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.3 (0.5 points):</strong> DESCRIBE a practical situation in software development in which this pattern would be appropriate.</p>`,
    `<p><strong>Phần 3.3 (0.5 điểm):</strong> MÔ TẢ 1 tình huống thực tế trong phát triển phần mềm mà pattern này phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Within this exact system:</strong> the flower shop needs to switch pricing rules based on customer type and season (regular price, seasonal discount, VIP discount) without an ever-growing if/else chain inside <code>FlowerOrder</code>, and without rebuilding the class every time a new pricing rule (e.g. a holiday promotion) is added — exactly what the pseudocode already demonstrates.</p>
     <p><strong>A different general example:</strong> a navigation app choosing between route-calculation algorithms (fastest route, shortest distance, avoid tolls) — each algorithm is a separate strategy implementing a common <code>RouteStrategy</code> interface, and the app swaps which one is active based on the user's selected travel preference, without the core navigation engine needing to know the details of any specific algorithm.</p>`,
    `<p><strong>Ngay trong hệ thống này:</strong> cửa hàng hoa cần đổi quy tắc tính giá theo loại khách và mùa (giá thường, giảm theo mùa, giảm VIP) mà không cần chuỗi if/else phình to trong <code>FlowerOrder</code>, và không cần dựng lại lớp mỗi khi thêm quy tắc giá mới (VD khuyến mãi lễ) — đúng như pseudocode đã minh hoạ.</p>
     <p><strong>Một ví dụ tổng quát khác:</strong> app chỉ đường chọn giữa các thuật toán tính tuyến (nhanh nhất, ngắn nhất, tránh trạm thu phí) — mỗi thuật toán là 1 strategy riêng triển khai chung interface <code>RouteStrategy</code>, và app đổi cái nào đang dùng theo lựa chọn của người dùng, mà lõi điều hướng không cần biết chi tiết bất kỳ thuật toán cụ thể nào.</p>`,
  ),
  rubric: [
    { id: 'valid_situation', criterion: B('Describes a genuine situation where an interchangeable algorithm/behavior needs to be swapped at runtime without conditional branching or subclassing the context class — the defining use case for Strategy.', 'Mô tả tình huống thật cần đổi thuật toán/hành vi có thể hoán đổi tại runtime mà không rẽ nhánh điều kiện hay subclass lớp context — đúng trường hợp dùng đặc trưng của Strategy.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE4',
    title: 'SWD392 – Practical Exam (Summer 2025), Flower Shop Management System|||SWD392 – Thi thực hành (Summer 2025), Hệ thống quản lý cửa hàng hoa',
    description: 'SWD392 PE (WRITE): ERD (conceptual/logical), Order state diagram, detailed class diagram (Repository Pattern), sequence diagram, and Strategy design-pattern analysis — diagrams rendered as Mermaid, AI-graded.|||PE SWD392 (viết): ERD (khái niệm/logic), state diagram Order, class diagram chi tiết (Repository Pattern), sequence diagram, và phân tích design pattern Strategy — sơ đồ hiển thị dạng Mermaid, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5, q6, q7, q8, q9],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
