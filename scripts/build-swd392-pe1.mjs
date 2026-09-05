/**
 * build-swd392-pe1.mjs — sinh content/exams/SWD392-PE1.mjs.
 *
 * Nguồn thật: "SWD392 - PE - FA25" ("SWD392 – Software Architecture and
 * Design, Practical Exam"), hệ thống đặt món ăn online. Đề gốc yêu cầu
 * vẽ bằng Draw.io desktop trong file Word — ở đây thay bằng sơ đồ
 * Mermaid render trực tiếp trong trình xem đề (ERD/class/sequence/state
 * đều được `pre.mermaid` hỗ trợ sẵn, xem ExamRichContent.tsx). Không có
 * solution.
 *
 * Tách câu hỏi theo ĐÚNG từng mục con đã có điểm riêng trong đề gốc
 * (Part 1: 1+1+1.5+1.5=5đ; Part 2: 1+2=3đ; Part 3: 0.5+1+0.5=2đ) thay vì
 * gộp theo Part, để điểm số minh bạch khớp đúng đề — tổng 9 câu = 10đ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE1.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;
const CODE = (code, lang) => `<pre><code class="language-${lang}">${code
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Problem statement:</b><p>A company plans to develop an online food ordering system to improve customer convenience and simplify restaurant management. Users are able to browse menus, view <b>dish</b> details, place orders, and track <b>order</b> status. Restaurants can manage menus and receive orders in real time. The system supports multiple <b>users</b> and <b>restaurants</b>, with each restaurant having many dishes. In addition, each order can contain many dishes, and dishes can appear in many orders.</p>
   <p>The system follows a client-server model: the client is built with React; the server is a REST API following the MVC pattern (e.g., ASP.NET Core Web API, Spring Boot Rest API, REST API with node.js); the database can be Microsoft SQL Server, MySQL, or PostgreSQL; communication is via HTTP requests/responses using JSON.</p></div>`,
  `<div class="pe-system"><b>Đề bài:</b><p>Một công ty dự định xây hệ thống đặt món ăn online để tăng tiện lợi cho khách hàng và đơn giản hoá quản lý nhà hàng. Người dùng có thể duyệt thực đơn, xem chi tiết <b>món ăn</b> (dish), đặt đơn, theo dõi trạng thái <b>đơn hàng</b> (order). Nhà hàng có thể quản lý thực đơn và nhận đơn theo thời gian thực. Hệ thống hỗ trợ nhiều <b>người dùng</b> và <b>nhà hàng</b>, mỗi nhà hàng có nhiều món. Ngoài ra, mỗi đơn hàng có thể chứa nhiều món, và mỗi món có thể xuất hiện trong nhiều đơn.</p>
   <p>Hệ thống theo mô hình client-server: client dựng bằng React; server là REST API theo mẫu MVC (VD ASP.NET Core Web API, Spring Boot Rest API, REST API node.js); database dùng Microsoft SQL Server, MySQL, hoặc PostgreSQL; giao tiếp qua HTTP request/response dạng JSON.</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Software Architecture and Design, Practical Exam (Fall 2025)</strong>. This is a written practical exam on data modeling, REST API design, and design patterns. The original paper asks for Draw.io diagrams in a Word file — here, diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Kiến trúc và Thiết kế Phần mềm, Thi thực hành (Fall 2025)</strong>. Đây là bài thi thực hành về mô hình hoá dữ liệu, thiết kế REST API, và design pattern dạng viết. Đề gốc yêu cầu vẽ Draw.io trong file Word — ở đây sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.1 (1 point):</strong> LIST the main entities and their key attributes based on the problem description.</p>`,
    `<p><strong>Phần 1.1 (1 điểm):</strong> LIỆT KÊ các thực thể chính và thuộc tính chính, dựa trên đề bài.</p>`,
  ),
  sampleSolution: B(
    `<ul><li><b>User</b>: userId, name, email, passwordHash, role (Customer/RestaurantOwner), phone.</li>
     <li><b>Restaurant</b>: restaurantId, name, address, description, ownerUserId.</li>
     <li><b>Dish</b>: dishId, name, description, price, status, restaurantId.</li>
     <li><b>Order</b>: orderId, status, orderDate, totalAmount, userId.</li>
     <li><b>OrderItem</b> (resolves the many-to-many between Order and Dish): orderItemId, quantity, subtotal, orderId, dishId.</li></ul>`,
    `<ul><li><b>User</b> (người dùng): userId, name, email, passwordHash, role (Customer/RestaurantOwner), phone.</li>
     <li><b>Restaurant</b> (nhà hàng): restaurantId, name, address, description, ownerUserId.</li>
     <li><b>Dish</b> (món ăn): dishId, name, description, price, status, restaurantId.</li>
     <li><b>Order</b> (đơn hàng): orderId, status, orderDate, totalAmount, userId.</li>
     <li><b>OrderItem</b> (giải quyết quan hệ N-N giữa Order và Dish): orderItemId, quantity, subtotal, orderId, dishId.</li></ul>`,
  ),
  explanation: B(
    `<p>No source solution existed. The 5th entity (OrderItem) is not explicitly named in the problem statement but is a required modeling insight — the description says "each order can contain many dishes, and dishes can appear in many orders" (M:N), which cannot be represented by two entities alone and needs a junction/associative entity.</p>`,
    `<p>Đề không có solution nguồn. Thực thể thứ 5 (OrderItem) không được đề gọi tên trực tiếp nhưng là hiểu biết mô hình hoá bắt buộc — đề nói "mỗi đơn có thể chứa nhiều món, mỗi món có thể ở nhiều đơn" (N-N), không thể biểu diễn chỉ bằng 2 thực thể mà cần thực thể trung gian/liên kết.</p>`,
  ),
  rubric: [
    { id: 'five_entities', criterion: B('Identifies all 5 needed entities (User, Restaurant, Dish, Order, and a junction entity resolving the Order-Dish M:N relationship).', 'Xác định đủ 5 thực thể cần thiết (User, Restaurant, Dish, Order, và thực thể trung gian giải quyết quan hệ N-N Order-Dish).'), weight: 1, maxScore: 0.6 },
    { id: 'key_attributes', criterion: B('Each entity lists reasonable key attributes matching the problem description.', 'Mỗi thực thể liệt kê thuộc tính chính hợp lý, khớp đề bài.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.2 (1 point):</strong> DRAW the conceptual ERD for the system (entities and relationships only, no attributes/data types).</p>`,
    `<p><strong>Phần 1.2 (1 điểm):</strong> VẼ ERD mức khái niệm cho hệ thống (chỉ thực thể và quan hệ, không thuộc tính/kiểu dữ liệu).</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    USER ||--o{ RESTAURANT : owns
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ DISH : offers
    ORDER }o--o{ DISH : contains`),
    MMD(`erDiagram
    USER ||--o{ RESTAURANT : owns
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ DISH : offers
    ORDER }o--o{ DISH : contains`),
  ),
  explanation: B(
    `<p>At the conceptual level, Order-Dish is drawn as a direct many-to-many (}o--o{) since the junction entity is a logical/physical design decision, not a conceptual one.</p>`,
    `<p>Ở mức khái niệm, Order-Dish vẽ trực tiếp là N-N (}o--o{) vì thực thể trung gian là quyết định thiết kế logical/physical, không phải khái niệm.</p>`,
  ),
  rubric: [
    { id: 'entities_present', criterion: B('Diagram includes User, Restaurant, Dish, and Order as distinct entities.', 'Sơ đồ có đủ User, Restaurant, Dish, Order là các thực thể riêng.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_cardinality', criterion: B('Relationships and cardinalities are correct: User-Restaurant (1:N, owns), User-Order (1:N, places), Restaurant-Dish (1:N, offers), Order-Dish (M:N, contains).', 'Quan hệ và cardinality đúng: User-Restaurant (1:N, sở hữu), User-Order (1:N, đặt), Restaurant-Dish (1:N, cung cấp), Order-Dish (N:N, chứa).'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.3 (1.5 points):</strong> DRAW the logical ERD (with primary/foreign keys and basic data types).</p>`,
    `<p><strong>Phần 1.3 (1.5 điểm):</strong> VẼ ERD mức logic (có khoá chính/khoá ngoại và kiểu dữ liệu cơ bản).</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    USER {
        int userId PK
        varchar name
        varchar email
        varchar passwordHash
        varchar role
        varchar phone
    }
    RESTAURANT {
        int restaurantId PK
        varchar name
        varchar address
        varchar description
        int ownerUserId FK
    }
    DISH {
        int dishId PK
        varchar name
        varchar description
        decimal price
        varchar status
        int restaurantId FK
    }
    ORDER {
        int orderId PK
        varchar status
        datetime orderDate
        decimal totalAmount
        int userId FK
    }
    ORDER_ITEM {
        int orderItemId PK
        int quantity
        decimal subtotal
        int orderId FK
        int dishId FK
    }
    USER ||--o{ RESTAURANT : owns
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ DISH : offers
    ORDER ||--o{ ORDER_ITEM : contains
    DISH ||--o{ ORDER_ITEM : "appears in"`),
    MMD(`erDiagram
    USER {
        int userId PK
        varchar name
        varchar email
        varchar passwordHash
        varchar role
        varchar phone
    }
    RESTAURANT {
        int restaurantId PK
        varchar name
        varchar address
        varchar description
        int ownerUserId FK
    }
    DISH {
        int dishId PK
        varchar name
        varchar description
        decimal price
        varchar status
        int restaurantId FK
    }
    ORDER {
        int orderId PK
        varchar status
        datetime orderDate
        decimal totalAmount
        int userId FK
    }
    ORDER_ITEM {
        int orderItemId PK
        int quantity
        decimal subtotal
        int orderId FK
        int dishId FK
    }
    USER ||--o{ RESTAURANT : owns
    USER ||--o{ ORDER : places
    RESTAURANT ||--o{ DISH : offers
    ORDER ||--o{ ORDER_ITEM : contains
    DISH ||--o{ ORDER_ITEM : "appears in"`),
  ),
  explanation: B(
    `<p>The logical model resolves the Order-Dish M:N from Part 1.2 into an ORDER_ITEM associative table with its own PK plus two FKs — the standard relational-modeling technique, required at logical/physical level even though it wasn't drawn at conceptual level.</p>`,
    `<p>Mô hình logic giải quyết N-N Order-Dish ở Phần 1.2 thành bảng liên kết ORDER_ITEM có PK riêng cộng 2 FK — kỹ thuật mô hình quan hệ chuẩn, bắt buộc ở mức logic/vật lý dù không vẽ ở mức khái niệm.</p>`,
  ),
  rubric: [
    { id: 'pk_fk_correct', criterion: B('Every entity has a correctly marked PK, and every FK correctly points to its referenced entity\'s PK.', 'Mỗi thực thể có PK đánh dấu đúng, mỗi FK trỏ đúng PK thực thể tham chiếu.'), weight: 1, maxScore: 0.6 },
    { id: 'order_item_resolves_mn', criterion: B('Introduces an ORDER_ITEM (or equivalently named) associative entity that correctly resolves the Order-Dish many-to-many relationship into two 1:N relationships.', 'Có thực thể liên kết ORDER_ITEM (hoặc tên tương đương) giải quyết đúng quan hệ N-N Order-Dish thành 2 quan hệ 1:N.'), weight: 1, maxScore: 0.6 },
    { id: 'data_types', criterion: B('Attributes have reasonable basic data types (int, varchar, decimal, datetime).', 'Thuộc tính có kiểu dữ liệu cơ bản hợp lý (int, varchar, decimal, datetime).'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.4 (1.5 points):</strong> LIST the main states of the Order entity during the order process, and DRAW the state diagram for Dish.</p>`,
    `<p><strong>Phần 1.4 (1.5 điểm):</strong> LIỆT KÊ các trạng thái chính của thực thể Order trong quá trình đặt hàng, và VẼ sơ đồ trạng thái cho Dish.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Order states:</strong> Pending (just placed by customer) → Confirmed (restaurant accepts) → Preparing (kitchen is cooking) → Ready (ready for pickup/delivery) → Delivered/Completed (customer received it). Alternate path: Cancelled, reachable from Pending or Confirmed (before Preparing starts — once the kitchen has started preparing, cancellation is no longer allowed since food/ingredients are already committed).</p>
     <p><strong>Dish state diagram:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Draft
    Draft --> Available : restaurant publishes dish
    Available --> Unavailable : marked out of stock
    Unavailable --> Available : restocked
    Available --> Discontinued : restaurant removes dish
    Unavailable --> Discontinued : restaurant removes dish
    Discontinued --> [*]`),
    `<p><strong>Trạng thái Order:</strong> Pending (vừa đặt) → Confirmed (nhà hàng chấp nhận) → Preparing (bếp đang nấu) → Ready (sẵn sàng lấy/giao) → Delivered/Completed (khách đã nhận). Nhánh khác: Cancelled, tới được từ Pending hoặc Confirmed (trước khi Preparing bắt đầu — một khi bếp đã bắt đầu nấu thì không cho huỷ nữa vì nguyên liệu/món đã cam kết).</p>
     <p><strong>Sơ đồ trạng thái Dish:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Draft
    Draft --> Available : nhà hàng đăng món
    Available --> Unavailable : hết hàng
    Unavailable --> Available : có hàng lại
    Available --> Discontinued : nhà hàng gỡ món
    Unavailable --> Discontinued : nhà hàng gỡ món
    Discontinued --> [*]`),
  ),
  explanation: B(
    `<p>No source solution existed. Cancellation is deliberately restricted to the Pending/Confirmed states, not any state — allowing cancellation after Preparing has started would contradict how a real kitchen commits ingredients once cooking begins.</p>`,
    `<p>Đề không có solution nguồn. Huỷ đơn cố tình chỉ giới hạn ở Pending/Confirmed, không phải mọi trạng thái — cho huỷ sau khi Preparing đã bắt đầu sẽ mâu thuẫn với cách bếp thật cam kết nguyên liệu khi đã bắt đầu nấu.</p>`,
  ),
  rubric: [
    { id: 'order_states_list', criterion: B('Lists a coherent, ordered sequence of Order states covering the full lifecycle (placed → confirmed → preparing → ready → completed), plus a cancellation path.', 'Liệt kê chuỗi trạng thái Order mạch lạc, có thứ tự, bao quát vòng đời đầy đủ (đặt → xác nhận → chuẩn bị → sẵn sàng → hoàn thành), kèm nhánh huỷ.'), weight: 1, maxScore: 0.7 },
    { id: 'dish_state_diagram', criterion: B('Draws a valid Dish state diagram with a start state, clear transitions, and a terminal/discontinued state.', 'Vẽ sơ đồ trạng thái Dish hợp lệ, có trạng thái bắt đầu, chuyển tiếp rõ ràng, và trạng thái kết thúc/ngừng bán.'), weight: 1, maxScore: 0.8 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 2.1 (1 point):</strong> DESCRIBE the classes/tables used on the client side, server side (Controller, Service, Repository), and database for the "place order" function.</p>`,
    `<p><strong>Phần 2.1 (1 điểm):</strong> MÔ TẢ các class/bảng dùng ở client, server (Controller, Service, Repository), và database cho chức năng "đặt đơn".</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Client:</strong> <code>CartPage</code> (React component rendering the cart and triggering submission) and <code>OrderApiService</code> (client-side wrapper calling <code>POST /api/orders</code> with the JWT auth token and cart items).</p>
     <p><strong>Server (MVC):</strong> <code>OrderController</code> (REST endpoint <code>POST /api/orders</code>, verifies authentication/authorization, delegates to the service layer); <code>OrderService</code> (business logic — validates each dish exists and is <code>Available</code>, computes the order total, and creates the Order + OrderItem records); <code>DishRepository</code> (read-only lookup used by OrderService to fetch current dish price/status); <code>OrderRepository</code> (persists the new Order and its OrderItem rows).</p>
     <p><strong>Database:</strong> <code>Order</code> table and <code>OrderItem</code> table (both written to), <code>Dish</code> table (read, to validate price/availability), and <code>User</code> table (read, via the authenticated user's ID from the JWT).</p>`,
    `<p><strong>Client:</strong> <code>CartPage</code> (component React hiển thị giỏ hàng, kích hoạt gửi đơn) và <code>OrderApiService</code> (wrapper client gọi <code>POST /api/orders</code> kèm JWT auth token và các món trong giỏ).</p>
     <p><strong>Server (MVC):</strong> <code>OrderController</code> (endpoint REST <code>POST /api/orders</code>, xác thực/phân quyền, giao cho tầng service); <code>OrderService</code> (logic nghiệp vụ — kiểm tra từng món tồn tại và ở trạng thái <code>Available</code>, tính tổng tiền, tạo bản ghi Order + OrderItem); <code>DishRepository</code> (tra cứu chỉ đọc, OrderService dùng lấy giá/trạng thái món hiện tại); <code>OrderRepository</code> (lưu Order mới và các dòng OrderItem của nó).</p>
     <p><strong>Database:</strong> bảng <code>Order</code> và <code>OrderItem</code> (đều được ghi), bảng <code>Dish</code> (đọc, kiểm tra giá/trạng thái), và bảng <code>User</code> (đọc, qua ID người dùng đã xác thực từ JWT).</p>`,
  ),
  rubric: [
    { id: 'client_classes', criterion: B('Names at least one client-side component/service responsible for triggering and calling the place-order request.', 'Nêu ít nhất 1 component/service phía client chịu trách nhiệm kích hoạt và gọi request đặt đơn.'), weight: 1, maxScore: 0.2 },
    { id: 'server_mvc_classes', criterion: B('Correctly names and describes Controller, Service, and Repository classes with distinct, correct responsibilities (Controller=endpoint/auth, Service=business logic, Repository=data access).', 'Nêu đúng và mô tả Controller, Service, Repository với trách nhiệm rõ ràng, đúng vai trò (Controller=endpoint/xác thực, Service=logic nghiệp vụ, Repository=truy cập dữ liệu).'), weight: 1, maxScore: 0.6 },
    { id: 'database_tables', criterion: B('Correctly identifies which tables are written (Order, OrderItem) vs. only read (Dish, User) for this function.', 'Xác định đúng bảng nào được ghi (Order, OrderItem) và bảng nào chỉ đọc (Dish, User) cho chức năng này.'), weight: 1, maxScore: 0.2 },
  ],
};

const q6 = {
  kind: 'WRITE', points: 2,
  prompt: B(
    `<p><strong>Part 2.2 (2 points):</strong> DRAW a sequence diagram for the "place order" function between client and server (REST API), including authentication and authorization.</p>`,
    `<p><strong>Phần 2.2 (2 điểm):</strong> VẼ sequence diagram cho chức năng "đặt đơn" giữa client và server (REST API), bao gồm xác thực và phân quyền.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Customer
    participant Client as ReactClient
    participant Ctrl as OrderController
    participant Auth as AuthMiddleware
    participant Svc as OrderService
    participant DishRepo as DishRepository
    participant OrderRepo as OrderRepository
    participant DB as Database

    Customer->>Client: Click "Place Order"
    Client->>Ctrl: POST /api/orders (JWT token, cart items)
    Ctrl->>Auth: Verify JWT token
    Auth-->>Ctrl: Authenticated (userId, role=Customer)
    Ctrl->>Auth: Check authorization (role must be Customer)
    Auth-->>Ctrl: Authorized
    Ctrl->>Svc: placeOrder(userId, cartItems)
    Svc->>DishRepo: findDishesByIds(dishIds)
    DishRepo->>DB: SELECT * FROM Dish WHERE dishId IN (...)
    DB-->>DishRepo: dish rows (price, status)
    DishRepo-->>Svc: dish list
    Svc->>Svc: Validate availability & compute total
    Svc->>OrderRepo: createOrder(userId, items, total)
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
    participant DishRepo as DishRepository
    participant OrderRepo as OrderRepository
    participant DB as Database

    Customer->>Client: Bấm "Đặt hàng"
    Client->>Ctrl: POST /api/orders (JWT token, món trong giỏ)
    Ctrl->>Auth: Xác thực JWT token
    Auth-->>Ctrl: Đã xác thực (userId, role=Customer)
    Ctrl->>Auth: Kiểm tra phân quyền (role phải là Customer)
    Auth-->>Ctrl: Đã cấp quyền
    Ctrl->>Svc: placeOrder(userId, cartItems)
    Svc->>DishRepo: findDishesByIds(dishIds)
    DishRepo->>DB: SELECT * FROM Dish WHERE dishId IN (...)
    DB-->>DishRepo: dòng dữ liệu món (giá, trạng thái)
    DishRepo-->>Svc: danh sách món
    Svc->>Svc: Kiểm tra tồn kho & tính tổng tiền
    Svc->>OrderRepo: createOrder(userId, items, total)
    OrderRepo->>DB: INSERT INTO Order, INSERT INTO OrderItem
    DB-->>OrderRepo: orderId mới
    OrderRepo-->>Svc: Order đã tạo
    Svc-->>Ctrl: Xác nhận đơn hàng
    Ctrl-->>Client: 201 Created (JSON đơn hàng)
    Client-->>Customer: Hiện xác nhận đơn hàng`),
  ),
  explanation: B(
    `<p>Authentication (verifying the JWT identifies a real user) and authorization (checking that user's role is allowed to place an order) are drawn as two distinct steps, since the paper explicitly requires "including authentication and authorization" — collapsing them into one step would miss half of that requirement.</p>`,
    `<p>Xác thực (xác nhận JWT là người dùng thật) và phân quyền (kiểm tra vai trò người đó được phép đặt đơn) vẽ thành 2 bước riêng, vì đề yêu cầu rõ "bao gồm xác thực và phân quyền" — gộp làm 1 bước sẽ thiếu mất nửa yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'client_server_flow', criterion: B('Shows the correct client-to-server REST call flow (client request → controller → service → repository → database, and the response flowing back).', 'Thể hiện đúng luồng gọi REST client-tới-server (client gửi → controller → service → repository → database, và phản hồi đi ngược lại).'), weight: 1, maxScore: 0.6 },
    { id: 'auth_authz_present', criterion: B('Explicitly shows BOTH an authentication step (verifying identity/JWT) AND an authorization step (checking the role/permission), as distinct steps.', 'Thể hiện rõ CẢ bước xác thực (kiểm tra danh tính/JWT) LẪN bước phân quyền (kiểm tra vai trò/quyền), là 2 bước riêng.'), weight: 1, maxScore: 0.8 },
    { id: 'business_logic_steps', criterion: B('Includes the dish-validation and total-computation step before creating the order, reflecting real business logic rather than a blind insert.', 'Có bước kiểm tra món và tính tổng tiền trước khi tạo đơn, phản ánh logic nghiệp vụ thật thay vì chèn dữ liệu mù.'), weight: 1, maxScore: 0.6 },
  ],
};

const q7 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.1 (0.5 points):</strong> Given the pseudocode below, WHAT design pattern is used? Identify its name and pattern family (creational, structural, or behavioral).</p>` +
    CODE(`interface Dish {
    String getDescription();
    double getCost();
}

class BasicDish implements Dish {
    public String getDescription() { return "Basic Dish"; }
    public double getCost() { return 5.0; }
}

abstract class DishDecorator implements Dish {
    protected Dish decoratedDish;
    public DishDecorator(Dish dish) {
        this.decoratedDish = dish;
    }
    public String getDescription() { return decoratedDish.getDescription(); }
    public double getCost() { return decoratedDish.getCost(); }
}

class CheeseDecorator extends DishDecorator {
    public CheeseDecorator(Dish dish) { super(dish); }
    public String getDescription() {
        return decoratedDish.getDescription() + ", Cheese";
    }
    public double getCost() {
        return decoratedDish.getCost() + 1.5;
    }
}

class SauceDecorator extends DishDecorator {
    public SauceDecorator(Dish dish) { super(dish); }
    public String getDescription() {
        return decoratedDish.getDescription() + ", Sauce";
    }
    public double getCost() {
        return decoratedDish.getCost() + 0.75;
    }
}`, 'java'),
    `<p><strong>Phần 3.1 (0.5 điểm):</strong> Cho pseudocode dưới, ĐÂY LÀ design pattern nào? Nêu tên và họ pattern (creational, structural, hay behavioral).</p>` +
    CODE(`interface Dish {
    String getDescription();
    double getCost();
}

class BasicDish implements Dish {
    public String getDescription() { return "Basic Dish"; }
    public double getCost() { return 5.0; }
}

abstract class DishDecorator implements Dish {
    protected Dish decoratedDish;
    public DishDecorator(Dish dish) {
        this.decoratedDish = dish;
    }
    public String getDescription() { return decoratedDish.getDescription(); }
    public double getCost() { return decoratedDish.getCost(); }
}

class CheeseDecorator extends DishDecorator {
    public CheeseDecorator(Dish dish) { super(dish); }
    public String getDescription() {
        return decoratedDish.getDescription() + ", Cheese";
    }
    public double getCost() {
        return decoratedDish.getCost() + 1.5;
    }
}

class SauceDecorator extends DishDecorator {
    public SauceDecorator(Dish dish) { super(dish); }
    public String getDescription() {
        return decoratedDish.getDescription() + ", Sauce";
    }
    public double getCost() {
        return decoratedDish.getCost() + 0.75;
    }
}`, 'java'),
  ),
  sampleSolution: B(
    `<p><strong>Pattern:</strong> Decorator. <strong>Family:</strong> Structural.</p>
     <p>The giveaway: <code>DishDecorator</code> implements the same <code>Dish</code> interface it wraps (<code>decoratedDish</code>) and delegates to it, letting <code>CheeseDecorator</code>/<code>SauceDecorator</code> stack additional behavior (cost, description) around a <code>BasicDish</code> at runtime without subclassing every combination.</p>`,
    `<p><strong>Pattern:</strong> Decorator. <strong>Họ:</strong> Structural (cấu trúc).</p>
     <p>Dấu hiệu: <code>DishDecorator</code> triển khai cùng interface <code>Dish</code> mà nó bọc (<code>decoratedDish</code>) và ủy quyền cho nó, cho phép <code>CheeseDecorator</code>/<code>SauceDecorator</code> chồng thêm hành vi (giá, mô tả) quanh <code>BasicDish</code> tại runtime mà không cần tạo subclass cho mọi tổ hợp.</p>`,
  ),
  rubric: [
    { id: 'correct_pattern_and_family', criterion: B('Correctly identifies Decorator as the pattern and Structural as its family.', 'Xác định đúng Decorator là pattern và Structural là họ của nó.'), weight: 1, maxScore: 1 },
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
    class Dish {
        <<interface>>
        +getDescription() String
        +getCost() double
    }
    class BasicDish {
        +getDescription() String
        +getCost() double
    }
    class DishDecorator {
        <<abstract>>
        #decoratedDish : Dish
        +getDescription() String
        +getCost() double
    }
    class CheeseDecorator {
        +getDescription() String
        +getCost() double
    }
    class SauceDecorator {
        +getDescription() String
        +getCost() double
    }
    Dish <|.. BasicDish
    Dish <|.. DishDecorator
    DishDecorator <|-- CheeseDecorator
    DishDecorator <|-- SauceDecorator
    DishDecorator o-- Dish : decoratedDish`),
    MMD(`classDiagram
    class Dish {
        <<interface>>
        +getDescription() String
        +getCost() double
    }
    class BasicDish {
        +getDescription() String
        +getCost() double
    }
    class DishDecorator {
        <<abstract>>
        #decoratedDish : Dish
        +getDescription() String
        +getCost() double
    }
    class CheeseDecorator {
        +getDescription() String
        +getCost() double
    }
    class SauceDecorator {
        +getDescription() String
        +getCost() double
    }
    Dish <|.. BasicDish
    Dish <|.. DishDecorator
    DishDecorator <|-- CheeseDecorator
    DishDecorator <|-- SauceDecorator
    DishDecorator o-- Dish : decoratedDish`),
  ),
  rubric: [
    { id: 'all_classes_present', criterion: B('Includes Dish (interface), BasicDish, DishDecorator (abstract), and both concrete decorators (CheeseDecorator, SauceDecorator).', 'Có đủ Dish (interface), BasicDish, DishDecorator (abstract), và cả 2 decorator cụ thể (CheeseDecorator, SauceDecorator).'), weight: 1, maxScore: 0.5 },
    { id: 'correct_relationships', criterion: B('Correctly shows BasicDish and DishDecorator both implementing Dish, the concrete decorators extending DishDecorator, and DishDecorator holding a composition/aggregation reference to a Dish (the wrapped object).', 'Thể hiện đúng BasicDish và DishDecorator đều triển khai Dish, các decorator cụ thể kế thừa DishDecorator, và DishDecorator giữ tham chiếu composition/aggregation tới 1 Dish (đối tượng bị bọc).'), weight: 1, maxScore: 0.5 },
  ],
};

const q9 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.3 (0.5 points):</strong> DESCRIBE a practical situation in software development where this pattern would be appropriate.</p>`,
    `<p><strong>Phần 3.3 (0.5 điểm):</strong> MÔ TẢ 1 tình huống thực tế trong phát triển phần mềm mà pattern này phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Within this exact system:</strong> letting customers add optional toppings/add-ons to a dish (cheese, sauce, extra spice, etc.) at order time, in any combination, without creating a new subclass for every possible combination (CheeseDish, SauceDish, CheeseSauceDish, ...) — exactly what the pseudocode already demonstrates.</p>
     <p><strong>A different general example:</strong> Java's I/O stream library, where a plain <code>FileInputStream</code> can be wrapped in a <code>BufferedInputStream</code> for buffering, and further wrapped in a <code>GZIPInputStream</code> for decompression — each decorator adds one behavior around the same <code>InputStream</code> interface, and any combination can be composed at runtime without a combinatorial explosion of subclasses.</p>`,
    `<p><strong>Ngay trong hệ thống này:</strong> cho khách thêm topping/tuỳ chọn (phô mai, sốt, thêm cay...) cho món khi đặt, ở bất kỳ tổ hợp nào, mà không cần tạo subclass mới cho mọi tổ hợp có thể (CheeseDish, SauceDish, CheeseSauceDish...) — đúng như pseudocode đã minh hoạ.</p>
     <p><strong>Một ví dụ tổng quát khác:</strong> thư viện I/O của Java, nơi 1 <code>FileInputStream</code> thuần có thể bọc trong <code>BufferedInputStream</code> để đệm, rồi bọc tiếp trong <code>GZIPInputStream</code> để giải nén — mỗi decorator thêm 1 hành vi quanh cùng interface <code>InputStream</code>, và bất kỳ tổ hợp nào cũng ghép được tại runtime mà không nổ tổ hợp subclass.</p>`,
  ),
  rubric: [
    { id: 'valid_situation', criterion: B('Describes a genuine situation where behavior needs to be added dynamically/in combination to an object without subclass explosion — the defining use case for Decorator.', 'Mô tả tình huống thật cần thêm hành vi động/theo tổ hợp cho đối tượng mà không nổ tổ hợp subclass — đúng trường hợp dùng đặc trưng của Decorator.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE1',
    title: 'SWD392 – Practical Exam (Fall 2025), Online Food Ordering System|||SWD392 – Thi thực hành (Fall 2025), Hệ thống đặt món ăn online',
    description: 'SWD392 PE (WRITE): ERD (conceptual/logical), state diagrams, REST API class design, sequence diagram, and Decorator design-pattern analysis — diagrams rendered as Mermaid, AI-graded.|||PE SWD392 (viết): ERD (khái niệm/logic), sơ đồ trạng thái, thiết kế class REST API, sequence diagram, và phân tích design pattern Decorator — sơ đồ hiển thị dạng Mermaid, chấm AI.',
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
