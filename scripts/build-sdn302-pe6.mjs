/**
 * build-sdn302-pe6.mjs — sinh content/exams/SDN302-PE6.mjs.
 *
 * Nguồn thật: "SDN302 - PE - SP 2025 - Đề số 1" — e-commerce
 * (categories/customers/orders/products), JWT login + protected
 * profile. Không có solution — chỉ có seed JSON + SampleTest.json.
 * Đã đọc kỹ customers.json xác nhận field `password` (tên field, KHÔNG
 * phải `passwordHash` như đề PE5) NHƯNG giá trị thực tế ĐÃ băm bcrypt
 * sẵn ($2b$10$...) — vẫn phải dùng bcrypt.compare(), tên field không
 * nói lên nó có băm hay không.
 *
 * Điểm gốc: Q1=2, Q2=1.5, Q3=3, Q4=2.5, Q5=1 (tổng 10). Lưu ý Q2 chỉ
 * hiện product rút gọn KHÔNG có quantity, còn Q3/Q4 hiện đủ quantity —
 * khác biệt thật giữa 2 response mẫu của đề, không phải nhầm lẫn.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE6.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE6.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given schema (collections: categories, customers, orders, products — database "SDN302_SP25_B1"):</b>` +
  `<pre><code class="language-javascript">// category
{ name: String, description: String }
// customer
{ name: String, email: String, password: String, address: String, phone: String }
// product
{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }
// order
{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div>`,
  `<div class="pe-system"><b>Schema đề cho (bảng: categories, customers, orders, products — database "SDN302_SP25_B1"):</b>` +
  `<pre><code class="language-javascript">// category
{ name: String, description: String }
// customer
{ name: String, email: String, password: String, address: String, phone: String }
// product
{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }
// order
{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2025) — E-Commerce API</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for categories, customers, orders, and products. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2025) — API E-Commerce</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho categories, customers, orders, products. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 2, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (2 points) - Retrieve All Products.</strong> Return a list of all products, including <code>_id, name, price, stock</code>, and <code>category</code> (Category information: _id, name, description). Endpoint: <code>GET /api/products</code>.</p>` +
    `<pre><code class="language-json">[
  {
    "_id": "67bc8ff7d100471c0d9a4c57",
    "name": "iPhone 14",
    "price": 999,
    "stock": 50,
    "category": { "_id": "67bc8e6fd100471c0d9a4c4d", "name": "Electronics", "description": "Devices and gadgets including phones, laptops, and accessories." }
  }
]</code></pre>`,
    `<p><strong>Câu 1 (2 điểm) - Lấy tất cả sản phẩm.</strong> Trả về danh sách sản phẩm, gồm <code>_id, name, price, stock</code>, và <code>category</code> (thông tin danh mục: _id, name, description). Endpoint: <code>GET /api/products</code>.</p>` +
    `<pre><code class="language-json">[
  {
    "_id": "67bc8ff7d100471c0d9a4c57",
    "name": "iPhone 14",
    "price": 999,
    "stock": 50,
    "category": { "_id": "67bc8e6fd100471c0d9a4c4d", "name": "Electronics", "description": "Devices and gadgets including phones, laptops, and accessories." }
  }
]</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Product = db.product;

const getAllProducts = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getAllProducts };`,
  sampleSolution:
`const db = require("../models/index");
const Product = db.product;

const getAllProducts = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const products = await Product.find()
            .populate("category", "name description")
            .lean();

        res.json(products);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getAllProducts };`,
  explanation: B(
    `<p><code>.populate("category", "name description")</code> still includes <code>_id</code> by default (Mongoose only excludes it if you explicitly write <code>"-_id name description"</code>) — matching the paper's own example, which shows the populated category WITH its <code>_id</code>, unlike some other exams' category responses that omit it.</p>`,
    `<p><code>.populate("category", "name description")</code> vẫn giữ <code>_id</code> mặc định (Mongoose chỉ loại nếu ghi tường minh <code>"-_id name description"</code>) — khớp đúng ví dụ đề, category populate CÓ <code>_id</code>, khác vài đề khác lược bỏ nó.</p>`,
  ),
  rubric: [
    { id: 'returns_all_products', criterion: B('Returns all products from the database.', 'Trả về tất cả sản phẩm trong database.'), weight: 1, maxScore: 0.6 },
    { id: 'category_populated_with_id', criterion: B('category is populated into an object including _id, name, and description (not a raw ObjectId, and not missing _id).', 'category populate thành object có đủ _id, name, description (không phải ObjectId thô, không thiếu _id).'), weight: 1, maxScore: 0.9 },
    { id: 'field_shape_correct', criterion: B('Each product has exactly _id, name, price, stock, category, matching the paper\'s example.', 'Mỗi sản phẩm có đúng _id, name, price, stock, category, khớp ví dụ đề.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (1.5 points) - Retrieve Orders by Customer ID.</strong> Fetch all orders placed by a given customer. Endpoint: <code>GET /api/orders/customer/:customerId</code>. Output: each order contains <code>_id, orderDate</code>, and <code>products</code> (with <code>_id, name, price</code> — no quantity in this view).</p>` +
    `<pre><code class="language-json">// with customerId = "67bca0086fac80b67916672f"
[
  {
    "_id": "67bde89a75ca2d0f404e8719",
    "orderDate": "2025-02-25T15:58:18.878Z",
    "products": [
      { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999 },
      { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899 }
    ]
  }
]</code></pre>`,
    `<p><strong>Câu 2 (1.5 điểm) - Lấy đơn hàng theo Customer ID.</strong> Lấy mọi đơn của 1 khách hàng. Endpoint: <code>GET /api/orders/customer/:customerId</code>. Output: mỗi đơn có <code>_id, orderDate</code>, và <code>products</code> (chỉ <code>_id, name, price</code> — không có quantity ở view này).</p>` +
    `<pre><code class="language-json">// với customerId = "67bca0086fac80b67916672f"
[
  {
    "_id": "67bde89a75ca2d0f404e8719",
    "orderDate": "2025-02-25T15:58:18.878Z",
    "products": [
      { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999 },
      { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899 }
    ]
  }
]</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Order = db.order;

const getOrdersByCustomer = async (req, res, next) => {
    const { customerId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getOrdersByCustomer };`,
  sampleSolution:
`const db = require("../models/index");
const Order = db.order;

const getOrdersByCustomer = async (req, res, next) => {
    const { customerId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        const orders = await Order.find({ customerId })
            .populate("products.productId", "name price")
            .lean();

        const formatted = orders.map((order) => ({
            _id: order._id,
            orderDate: order.orderDate,
            products: order.products.map((p) => ({
                _id: p.productId._id,
                name: p.productId.name,
                price: p.productId.price,
            })),
        }));

        res.json(formatted);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getOrdersByCustomer };`,
  explanation: B(
    `<p>This view deliberately drops <code>quantity</code> and <code>totalPrice</code> — the paper's own example response for THIS endpoint only shows the product's brief info (<code>_id/name/price</code>) per order, unlike Question 3's full order-detail view which does include quantity and totalPrice. Reshaping the response explicitly (rather than returning the populated document as-is) is what drops those extra fields cleanly.</p>`,
    `<p>View này cố tình bỏ <code>quantity</code> và <code>totalPrice</code> — ví dụ response của đề cho ĐÚNG endpoint này chỉ hiện thông tin sản phẩm rút gọn (<code>_id/name/price</code>) mỗi đơn, khác view chi tiết đầy đủ ở Câu 3 có cả quantity và totalPrice. Định dạng lại response tường minh (thay vì trả nguyên document đã populate) là cách bỏ gọn các field thừa đó.</p>`,
  ),
  rubric: [
    { id: 'finds_orders_by_customer', criterion: B('Correctly finds all orders belonging to the given customerId.', 'Tìm đúng mọi đơn hàng thuộc customerId đã cho.'), weight: 1, maxScore: 0.5 },
    { id: 'products_populated_brief', criterion: B('Each product in the order is populated into brief info (_id, name, price) — not a raw ObjectId, and without extra fields like quantity.', 'Mỗi sản phẩm trong đơn populate đúng rút gọn (_id, name, price) — không phải ObjectId thô, không có field thừa như quantity.'), weight: 1, maxScore: 0.7 },
    { id: 'order_level_fields_correct', criterion: B('Each order object has exactly _id, orderDate, and products, matching the paper\'s example.', 'Mỗi order có đúng _id, orderDate, và products, khớp ví dụ đề.'), weight: 1, maxScore: 0.3 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (3 points) - Retrieve Order Details with Customer and Product Information.</strong> Return the detailed information of an order by orderId, including complete customer and product information. Endpoint: <code>GET /api/orders/:orderId</code>. Output: <code>_id, orderDate</code>; <code>customer</code> (_id, name, email); <code>products</code> (_id, name, price, quantity); <code>totalPrice</code>.</p>` +
    `<pre><code class="language-json">// with orderId = "67bde89a75ca2d0f404e8719"
{
  "_id": "67bde89a75ca2d0f404e8719",
  "orderDate": "2025-02-25T15:58:18.878Z",
  "customer": { "_id": "67bca0086fac80b67916672f", "name": "John Doe", "email": "john@example.com" },
  "products": [
    { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999, "quantity": 2 },
    { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899, "quantity": 1 }
  ],
  "totalPrice": 2897
}</code></pre>`,
    `<p><strong>Câu 3 (3 điểm) - Chi tiết đơn hàng đầy đủ khách hàng và sản phẩm.</strong> Trả về chi tiết đơn theo orderId, gồm đầy đủ thông tin khách hàng và sản phẩm. Endpoint: <code>GET /api/orders/:orderId</code>. Output: <code>_id, orderDate</code>; <code>customer</code> (_id, name, email); <code>products</code> (_id, name, price, quantity); <code>totalPrice</code>.</p>` +
    `<pre><code class="language-json">// với orderId = "67bde89a75ca2d0f404e8719"
{
  "_id": "67bde89a75ca2d0f404e8719",
  "orderDate": "2025-02-25T15:58:18.878Z",
  "customer": { "_id": "67bca0086fac80b67916672f", "name": "John Doe", "email": "john@example.com" },
  "products": [
    { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999, "quantity": 2 },
    { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899, "quantity": 1 }
  ],
  "totalPrice": 2897
}</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Order = db.order;

const getOrderDetails = async (req, res, next) => {
    const { orderId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getOrderDetails };`,
  sampleSolution:
`const db = require("../models/index");
const Order = db.order;

const getOrderDetails = async (req, res, next) => {
    const { orderId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        const order = await Order.findById(orderId)
            .populate("customerId", "name email")
            .populate("products.productId", "name price")
            .lean();

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({
            _id: order._id,
            orderDate: order.orderDate,
            customer: {
                _id: order.customerId._id,
                name: order.customerId.name,
                email: order.customerId.email,
            },
            products: order.products.map((p) => ({
                _id: p.productId._id,
                name: p.productId.name,
                price: p.productId.price,
                quantity: p.quantity,
            })),
            totalPrice: order.totalPrice,
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getOrderDetails };`,
  explanation: B(
    `<p>Both <code>customerId</code> and <code>products.productId</code> are populated in one query (two separate <code>.populate()</code> calls chained). Unlike Question 2, this view keeps <code>quantity</code> per product (from the order's own subdocument, not from the populated product) and the stored <code>totalPrice</code> — the paper's own example confirms 999×2 + 899×1 = 2897 matches the stored total exactly, so it's returned as-is rather than recomputed.</p>`,
    `<p>Cả <code>customerId</code> và <code>products.productId</code> đều populate trong 1 truy vấn (2 lời gọi <code>.populate()</code> nối chuỗi). Khác Câu 2, view này giữ <code>quantity</code> mỗi sản phẩm (từ subdocument của order, không phải từ product đã populate) và <code>totalPrice</code> đã lưu — ví dụ đề xác nhận 999×2 + 899×1 = 2897 khớp đúng tổng đã lưu, nên trả nguyên chứ không tính lại.</p>`,
  ),
  rubric: [
    { id: 'customer_populated', criterion: B('customerId is correctly populated into an object with at least _id, name, and email.', 'customerId populate đúng thành object có ít nhất _id, name, email.'), weight: 1, maxScore: 0.8 },
    { id: 'products_populated_with_quantity', criterion: B('Each product is populated with _id, name, price, AND correctly keeps the order-specific quantity (not the product\'s stock).', 'Mỗi sản phẩm populate đủ _id, name, price, VÀ giữ đúng quantity riêng của đơn (không phải stock của sản phẩm).'), weight: 1, maxScore: 1 },
    { id: 'not_found_handling', criterion: B('Returns an appropriate 404 error when the orderId doesn\'t match any order.', 'Trả đúng lỗi 404 khi orderId không khớp đơn nào.'), weight: 1, maxScore: 0.5 },
    { id: 'response_shape_correct', criterion: B('Full response shape matches the paper\'s example exactly (_id, orderDate, customer, products, totalPrice).', 'Hình dạng response đầy đủ khớp đúng ví dụ đề (_id, orderDate, customer, products, totalPrice).'), weight: 1, maxScore: 0.7 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (2.5 points) - Create a New Order.</strong> Enable a customer to create a new order. Endpoint: <code>POST /api/orders/create</code>. Input: JSON with <code>customerId</code>, <code>products</code> (array of productId and quantity). Output: the newly created order's details.</p>` +
    `<pre><code class="language-json">// Request body
{
  "customerId": "67bca5a616951b6b54b79eb5",
  "products": [
    { "productId": "67bc8ff7d100471c0d9a4c57", "quantity": 1 },
    { "productId": "67bc8ff7d100471c0d9a4c58", "quantity": 4 }
  ]
}

// Response (201 Created)
{
  "_id": "67bf514d77ce2f236c2c1e4a",
  "customerId": "67bca5a616951b6b54b79eb5",
  "orderDate": "2025-02-26T17:37:17.119Z",
  "products": [
    { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999, "quantity": 1 },
    { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899, "quantity": 4 }
  ],
  "totalPrice": 4595
}</code></pre>` +
    `<p><i>The newly created order is saved into the orders collection storing the raw {productId, quantity} per item (no per-item price snapshot in this schema — only the aggregate totalPrice is stored).</i></p>`,
    `<p><strong>Câu 4 (2.5 điểm) - Tạo đơn hàng mới.</strong> Cho phép khách hàng tạo đơn mới. Endpoint: <code>POST /api/orders/create</code>. Input: JSON gồm <code>customerId</code>, <code>products</code> (mảng productId và quantity). Output: chi tiết đơn vừa tạo.</p>` +
    `<pre><code class="language-json">// Request body
{
  "customerId": "67bca5a616951b6b54b79eb5",
  "products": [
    { "productId": "67bc8ff7d100471c0d9a4c57", "quantity": 1 },
    { "productId": "67bc8ff7d100471c0d9a4c58", "quantity": 4 }
  ]
}

// Response (201 Created)
{
  "_id": "67bf514d77ce2f236c2c1e4a",
  "customerId": "67bca5a616951b6b54b79eb5",
  "orderDate": "2025-02-26T17:37:17.119Z",
  "products": [
    { "_id": "67bc8ff7d100471c0d9a4c57", "name": "iPhone 14", "price": 999, "quantity": 1 },
    { "_id": "67bc8ff7d100471c0d9a4c58", "name": "Samsung Galaxy S23", "price": 899, "quantity": 4 }
  ],
  "totalPrice": 4595
}</code></pre>` +
    `<p><i>Đơn mới lưu vào bảng orders dưới dạng {productId, quantity} thô mỗi item (schema này không lưu giá theo item — chỉ lưu totalPrice tổng).</i></p>`,
  ),
  starterCode:
`const db = require("../models/index");
const Product = db.product;
const Order = db.order;

const createOrder = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { createOrder };`,
  sampleSolution:
`const db = require("../models/index");
const Product = db.product;
const Order = db.order;

const createOrder = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { customerId, products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products are required" });
        }

        let totalPrice = 0;
        const orderProducts = [];
        for (const { productId, quantity } of products) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            totalPrice += product.price * quantity;
            orderProducts.push({ productId, quantity });
        }

        const order = await Order.create({
            customerId,
            products: orderProducts,
            totalPrice,
            orderDate: new Date(),
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("products.productId", "name price")
            .lean();

        res.status(201).json({
            _id: populatedOrder._id,
            customerId: populatedOrder.customerId,
            orderDate: populatedOrder.orderDate,
            products: populatedOrder.products.map((p) => ({
                _id: p.productId._id,
                name: p.productId.name,
                price: p.productId.price,
                quantity: p.quantity,
            })),
            totalPrice: populatedOrder.totalPrice,
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { createOrder };`,
  explanation: B(
    `<p><code>totalPrice</code> is computed server-side from each product's CURRENT price at order time (999×1 + 899×4 = 4595, matching the paper's example exactly), never trusted from the request body. The order is saved with plain <code>{productId, quantity}</code> per item — matching this exam's given schema, which has no per-item price field — then re-fetched with <code>.populate()</code> just to build the enriched response; a real limitation of this schema (also present in the paper's own design, not introduced here) is that a later price change on a product would make Question 2/3's re-reads of this order show the NEW price rather than what was actually paid, since no price snapshot is stored per item.</p>`,
    `<p><code>totalPrice</code> tính phía server từ giá HIỆN TẠI của từng sản phẩm lúc đặt đơn (999×1 + 899×4 = 4595, khớp đúng ví dụ đề), không bao giờ tin từ request body. Đơn lưu dạng <code>{productId, quantity}</code> thô mỗi item — khớp đúng schema đề cho, không có field giá theo item — rồi truy vấn lại kèm <code>.populate()</code> chỉ để dựng response đầy đủ; 1 giới hạn thật của schema này (cũng có sẵn trong thiết kế gốc của đề, không phải lỗi đưa vào ở đây) là nếu giá sản phẩm đổi sau đó, đọc lại đơn này ở Câu 2/3 sẽ hiện giá MỚI thay vì giá thực đã trả, vì không lưu chụp giá theo item.</p>`,
  ),
  rubric: [
    { id: 'validates_products', criterion: B('Validates that products are provided and that each referenced product actually exists.', 'Kiểm products được cung cấp và mỗi sản phẩm tham chiếu thực sự tồn tại.'), weight: 1, maxScore: 0.5 },
    { id: 'server_side_total_price', criterion: B('totalPrice is computed server-side from each product\'s current price and quantity, never trusted from the client.', 'totalPrice tính phía server từ giá hiện tại và quantity mỗi sản phẩm, không bao giờ tin từ client.'), weight: 1, maxScore: 0.8 },
    { id: 'order_saved_correctly', criterion: B('The new order is correctly saved with customerId, products ({productId, quantity} per item), totalPrice, and orderDate.', 'Đơn mới lưu đúng customerId, products ({productId, quantity} mỗi item), totalPrice, orderDate.'), weight: 1, maxScore: 0.6 },
    { id: 'response_shape_correct', criterion: B('The response returns the newly created order with products enriched with name/price/quantity, matching the paper\'s example.', 'Response trả đúng đơn vừa tạo với products đủ name/price/quantity, khớp ví dụ đề.'), weight: 1, maxScore: 0.6 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Question 5 (1 point) - Authentication with JWT.</strong> Support customer login and protect certain endpoints using JWT authentication.</p>` +
    `<p><b>1. Login API:</b> <code>POST /api/customers/login</code>. Input: JSON with email and password. Output: returns a JWT token when the credentials are valid (payload = {id: customer._id}; JWT_SECRET read from .env; expiresIn: '1h').</p>` +
    `<pre><code class="language-json">// Request: { "email": "john@example.com", "password": "abc@123" }
// Response 200: { "token": "eyJhbGciOiJJIUzI1NiIsInR5cCI6..." }</code></pre>` +
    `<p><b>2. Protected API: Retrieve Customer Profile.</b> <code>GET /api/customers/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Returns the customer's details if the token is valid.</p>` +
    `<pre><code class="language-json">// Response 200
{ "_id": "67bca0086fac80b67916672f", "name": "John Doe", "email": "john@example.com", "address": "1234 Elm Street, Springfield, IL", "phone": "1234567890" }</code></pre>`,
    `<p><strong>Câu 5 (1 điểm) - Xác thực JWT.</strong> Hỗ trợ đăng nhập khách hàng và bảo vệ 1 số endpoint bằng JWT.</p>` +
    `<p><b>1. API đăng nhập:</b> <code>POST /api/customers/login</code>. Input: JSON email và password. Output: trả JWT khi thông tin đúng (payload = {id: customer._id}; JWT_SECRET đọc từ .env; expiresIn: '1h').</p>` +
    `<pre><code class="language-json">// Request: { "email": "john@example.com", "password": "abc@123" }
// Response 200: { "token": "eyJhbGciOiJJIUzI1NiIsInR5cCI6..." }</code></pre>` +
    `<p><b>2. API bảo vệ: Lấy hồ sơ khách hàng.</b> <code>GET /api/customers/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Trả chi tiết khách hàng nếu token hợp lệ.</p>` +
    `<pre><code class="language-json">// Response 200
{ "_id": "67bca0086fac80b67916672f", "name": "John Doe", "email": "john@example.com", "address": "1234 Elm Street, Springfield, IL", "phone": "1234567890" }</code></pre>`,
  ),
  starterCode:
`const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Customer = db.customer;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const getProfile = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { login, authenticateToken, getProfile };`,
  sampleSolution:
`const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Customer = db.customer;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // customers.json stores 'password' already bcrypt-hashed — compare, never string-equal
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
    // -------------------------------------------------------
};

const getProfile = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const customer = await Customer.findById(req.user.id).select("-password").lean();
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        res.json(customer);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { login, authenticateToken, getProfile };`,
  explanation: B(
    `<p><b>Caught a real detail from the given seed data</b>: <code>customers.json</code>'s field is literally named <code>password</code> (not <code>passwordHash</code>), but its stored VALUE is already a bcrypt hash (<code>$2b$10$...</code>) — the field name alone doesn't tell you whether it's hashed, so <code>login</code> must still use <code>bcrypt.compare()</code>, never a direct string comparison. <code>.select("-password")</code> keeps the hash out of the profile response, matching the paper's example (which never shows a password field).</p>`,
    `<p><b>Bắt đúng 1 chi tiết thật từ dữ liệu seed đề cho</b>: field trong <code>customers.json</code> đặt tên đúng là <code>password</code> (không phải <code>passwordHash</code>), nhưng GIÁ TRỊ lưu đã là hash bcrypt (<code>$2b$10$...</code>) — chỉ tên field không nói lên nó có băm hay không, nên <code>login</code> vẫn phải dùng <code>bcrypt.compare()</code>, không bao giờ so chuỗi trực tiếp. <code>.select("-password")</code> giữ hash không lộ ra response profile, khớp ví dụ đề (không bao giờ hiện field password).</p>`,
  ),
  rubric: [
    { id: 'login_bcrypt_compare_and_jwt', criterion: B('Login validates credentials using bcrypt.compare (not a plaintext comparison) and returns a valid JWT signed with the secret from .env, with payload {id: customer._id}.', 'Đăng nhập kiểm đúng bằng bcrypt.compare (không so chuỗi thô), trả JWT hợp lệ ký bằng secret từ .env, payload {id: customer._id}.'), weight: 1, maxScore: 0.5 },
    { id: 'middleware_protects_profile', criterion: B('The profile endpoint is protected by JWT middleware that correctly rejects missing/invalid tokens.', 'Endpoint profile được bảo vệ bởi middleware JWT từ chối đúng token thiếu/sai.'), weight: 1, maxScore: 0.3 },
    { id: 'profile_excludes_password', criterion: B('The profile response includes the customer\'s details but never exposes the password/hash field.', 'Response profile có đủ chi tiết khách hàng nhưng không bao giờ lộ field password/hash.'), weight: 1, maxScore: 0.2 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE6',
    title: 'SDN302 – Practical Exam (Spring 2025, Đề 1), E-Commerce Products/Orders API|||SDN302 – Thi thực hành (Spring 2025, Đề 1), API E-Commerce sản phẩm/đơn hàng',
    description: 'SDN302 PE (CODE): products with category populate, two different order views (brief and full-detail), order creation with server-computed total, and JWT login/profile, AI-graded.|||PE SDN302 (viết mã): sản phẩm kèm populate category, 2 view đơn hàng khác nhau (rút gọn và chi tiết đầy đủ), tạo đơn tính tổng phía server, và đăng nhập/profile JWT, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
