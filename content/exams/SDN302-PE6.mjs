export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE6",
      "title": "SDN302 – Practical Exam (Spring 2025, Đề 1), E-Commerce Products/Orders API|||SDN302 – Thi thực hành (Spring 2025, Đề 1), API E-Commerce sản phẩm/đơn hàng",
      "description": "SDN302 PE (CODE): products with category populate, two different order views (brief and full-detail), order creation with server-computed total, and JWT login/profile, AI-graded.|||PE SDN302 (viết mã): sản phẩm kèm populate category, 2 view đơn hàng khác nhau (rút gọn và chi tiết đầy đủ), tạo đơn tính tổng phía server, và đăng nhập/profile JWT, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Spring 2025) — E-Commerce API</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for categories, customers, orders, and products. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given schema (collections: categories, customers, orders, products — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// category\n{ name: String, description: String }\n// customer\n{ name: String, email: String, password: String, address: String, phone: String }\n// product\n{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// order\n{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Schema đề cho (bảng: categories, customers, orders, products — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// category\n{ name: String, description: String }\n// customer\n{ name: String, email: String, password: String, address: String, phone: String }\n// product\n{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// order\n{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Spring 2025) — API E-Commerce</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho categories, customers, orders, products. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given schema (collections: categories, customers, orders, products — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// category\n{ name: String, description: String }\n// customer\n{ name: String, email: String, password: String, address: String, phone: String }\n// product\n{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// order\n{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Schema đề cho (bảng: categories, customers, orders, products — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// category\n{ name: String, description: String }\n// customer\n{ name: String, email: String, password: String, address: String, phone: String }\n// product\n{ name: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// order\n{ customerId: ObjectId /* ref customers */, products: [{ productId: ObjectId, quantity: Number }], totalPrice: Number, orderDate: Date }</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (2 points) - Retrieve All Products.</strong> Return a list of all products, including <code>_id, name, price, stock</code>, and <code>category</code> (Category information: _id, name, description). Endpoint: <code>GET /api/products</code>.</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"67bc8ff7d100471c0d9a4c57\",\n    \"name\": \"iPhone 14\",\n    \"price\": 999,\n    \"stock\": 50,\n    \"category\": { \"_id\": \"67bc8e6fd100471c0d9a4c4d\", \"name\": \"Electronics\", \"description\": \"Devices and gadgets including phones, laptops, and accessories.\" }\n  }\n]</code></pre>|||<p><strong>Câu 1 (2 điểm) - Lấy tất cả sản phẩm.</strong> Trả về danh sách sản phẩm, gồm <code>_id, name, price, stock</code>, và <code>category</code> (thông tin danh mục: _id, name, description). Endpoint: <code>GET /api/products</code>.</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"67bc8ff7d100471c0d9a4c57\",\n    \"name\": \"iPhone 14\",\n    \"price\": 999,\n    \"stock\": 50,\n    \"category\": { \"_id\": \"67bc8e6fd100471c0d9a4c4d\", \"name\": \"Electronics\", \"description\": \"Devices and gadgets including phones, laptops, and accessories.\" }\n  }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Product = db.product;\n\nconst getAllProducts = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllProducts };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Product = db.product;\n\nconst getAllProducts = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const products = await Product.find()\n            .populate(\"category\", \"name description\")\n            .lean();\n\n        res.json(products);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllProducts };",
          "explanation": "<p><code>.populate(\"category\", \"name description\")</code> still includes <code>_id</code> by default (Mongoose only excludes it if you explicitly write <code>\"-_id name description\"</code>) — matching the paper's own example, which shows the populated category WITH its <code>_id</code>, unlike some other exams' category responses that omit it.</p>|||<p><code>.populate(\"category\", \"name description\")</code> vẫn giữ <code>_id</code> mặc định (Mongoose chỉ loại nếu ghi tường minh <code>\"-_id name description\"</code>) — khớp đúng ví dụ đề, category populate CÓ <code>_id</code>, khác vài đề khác lược bỏ nó.</p>",
          "rubric": [
            {
              "id": "returns_all_products",
              "criterion": "Returns all products from the database.|||Trả về tất cả sản phẩm trong database.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "category_populated_with_id",
              "criterion": "category is populated into an object including _id, name, and description (not a raw ObjectId, and not missing _id).|||category populate thành object có đủ _id, name, description (không phải ObjectId thô, không thiếu _id).",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "field_shape_correct",
              "criterion": "Each product has exactly _id, name, price, stock, category, matching the paper's example.|||Mỗi sản phẩm có đúng _id, name, price, stock, category, khớp ví dụ đề.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (1.5 points) - Retrieve Orders by Customer ID.</strong> Fetch all orders placed by a given customer. Endpoint: <code>GET /api/orders/customer/:customerId</code>. Output: each order contains <code>_id, orderDate</code>, and <code>products</code> (with <code>_id, name, price</code> — no quantity in this view).</p><pre><code class=\"language-json\">// with customerId = \"67bca0086fac80b67916672f\"\n[\n  {\n    \"_id\": \"67bde89a75ca2d0f404e8719\",\n    \"orderDate\": \"2025-02-25T15:58:18.878Z\",\n    \"products\": [\n      { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999 },\n      { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899 }\n    ]\n  }\n]</code></pre>|||<p><strong>Câu 2 (1.5 điểm) - Lấy đơn hàng theo Customer ID.</strong> Lấy mọi đơn của 1 khách hàng. Endpoint: <code>GET /api/orders/customer/:customerId</code>. Output: mỗi đơn có <code>_id, orderDate</code>, và <code>products</code> (chỉ <code>_id, name, price</code> — không có quantity ở view này).</p><pre><code class=\"language-json\">// với customerId = \"67bca0086fac80b67916672f\"\n[\n  {\n    \"_id\": \"67bde89a75ca2d0f404e8719\",\n    \"orderDate\": \"2025-02-25T15:58:18.878Z\",\n    \"products\": [\n      { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999 },\n      { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899 }\n    ]\n  }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getOrdersByCustomer = async (req, res, next) => {\n    const { customerId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getOrdersByCustomer };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getOrdersByCustomer = async (req, res, next) => {\n    const { customerId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const orders = await Order.find({ customerId })\n            .populate(\"products.productId\", \"name price\")\n            .lean();\n\n        const formatted = orders.map((order) => ({\n            _id: order._id,\n            orderDate: order.orderDate,\n            products: order.products.map((p) => ({\n                _id: p.productId._id,\n                name: p.productId.name,\n                price: p.productId.price,\n            })),\n        }));\n\n        res.json(formatted);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getOrdersByCustomer };",
          "explanation": "<p>This view deliberately drops <code>quantity</code> and <code>totalPrice</code> — the paper's own example response for THIS endpoint only shows the product's brief info (<code>_id/name/price</code>) per order, unlike Question 3's full order-detail view which does include quantity and totalPrice. Reshaping the response explicitly (rather than returning the populated document as-is) is what drops those extra fields cleanly.</p>|||<p>View này cố tình bỏ <code>quantity</code> và <code>totalPrice</code> — ví dụ response của đề cho ĐÚNG endpoint này chỉ hiện thông tin sản phẩm rút gọn (<code>_id/name/price</code>) mỗi đơn, khác view chi tiết đầy đủ ở Câu 3 có cả quantity và totalPrice. Định dạng lại response tường minh (thay vì trả nguyên document đã populate) là cách bỏ gọn các field thừa đó.</p>",
          "rubric": [
            {
              "id": "finds_orders_by_customer",
              "criterion": "Correctly finds all orders belonging to the given customerId.|||Tìm đúng mọi đơn hàng thuộc customerId đã cho.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "products_populated_brief",
              "criterion": "Each product in the order is populated into brief info (_id, name, price) — not a raw ObjectId, and without extra fields like quantity.|||Mỗi sản phẩm trong đơn populate đúng rút gọn (_id, name, price) — không phải ObjectId thô, không có field thừa như quantity.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "order_level_fields_correct",
              "criterion": "Each order object has exactly _id, orderDate, and products, matching the paper's example.|||Mỗi order có đúng _id, orderDate, và products, khớp ví dụ đề.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 3,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (3 points) - Retrieve Order Details with Customer and Product Information.</strong> Return the detailed information of an order by orderId, including complete customer and product information. Endpoint: <code>GET /api/orders/:orderId</code>. Output: <code>_id, orderDate</code>; <code>customer</code> (_id, name, email); <code>products</code> (_id, name, price, quantity); <code>totalPrice</code>.</p><pre><code class=\"language-json\">// with orderId = \"67bde89a75ca2d0f404e8719\"\n{\n  \"_id\": \"67bde89a75ca2d0f404e8719\",\n  \"orderDate\": \"2025-02-25T15:58:18.878Z\",\n  \"customer\": { \"_id\": \"67bca0086fac80b67916672f\", \"name\": \"John Doe\", \"email\": \"john@example.com\" },\n  \"products\": [\n    { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999, \"quantity\": 2 },\n    { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899, \"quantity\": 1 }\n  ],\n  \"totalPrice\": 2897\n}</code></pre>|||<p><strong>Câu 3 (3 điểm) - Chi tiết đơn hàng đầy đủ khách hàng và sản phẩm.</strong> Trả về chi tiết đơn theo orderId, gồm đầy đủ thông tin khách hàng và sản phẩm. Endpoint: <code>GET /api/orders/:orderId</code>. Output: <code>_id, orderDate</code>; <code>customer</code> (_id, name, email); <code>products</code> (_id, name, price, quantity); <code>totalPrice</code>.</p><pre><code class=\"language-json\">// với orderId = \"67bde89a75ca2d0f404e8719\"\n{\n  \"_id\": \"67bde89a75ca2d0f404e8719\",\n  \"orderDate\": \"2025-02-25T15:58:18.878Z\",\n  \"customer\": { \"_id\": \"67bca0086fac80b67916672f\", \"name\": \"John Doe\", \"email\": \"john@example.com\" },\n  \"products\": [\n    { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999, \"quantity\": 2 },\n    { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899, \"quantity\": 1 }\n  ],\n  \"totalPrice\": 2897\n}</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getOrderDetails = async (req, res, next) => {\n    const { orderId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getOrderDetails };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getOrderDetails = async (req, res, next) => {\n    const { orderId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const order = await Order.findById(orderId)\n            .populate(\"customerId\", \"name email\")\n            .populate(\"products.productId\", \"name price\")\n            .lean();\n\n        if (!order) {\n            return res.status(404).json({ error: \"Order not found\" });\n        }\n\n        res.json({\n            _id: order._id,\n            orderDate: order.orderDate,\n            customer: {\n                _id: order.customerId._id,\n                name: order.customerId.name,\n                email: order.customerId.email,\n            },\n            products: order.products.map((p) => ({\n                _id: p.productId._id,\n                name: p.productId.name,\n                price: p.productId.price,\n                quantity: p.quantity,\n            })),\n            totalPrice: order.totalPrice,\n        });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getOrderDetails };",
          "explanation": "<p>Both <code>customerId</code> and <code>products.productId</code> are populated in one query (two separate <code>.populate()</code> calls chained). Unlike Question 2, this view keeps <code>quantity</code> per product (from the order's own subdocument, not from the populated product) and the stored <code>totalPrice</code> — the paper's own example confirms 999×2 + 899×1 = 2897 matches the stored total exactly, so it's returned as-is rather than recomputed.</p>|||<p>Cả <code>customerId</code> và <code>products.productId</code> đều populate trong 1 truy vấn (2 lời gọi <code>.populate()</code> nối chuỗi). Khác Câu 2, view này giữ <code>quantity</code> mỗi sản phẩm (từ subdocument của order, không phải từ product đã populate) và <code>totalPrice</code> đã lưu — ví dụ đề xác nhận 999×2 + 899×1 = 2897 khớp đúng tổng đã lưu, nên trả nguyên chứ không tính lại.</p>",
          "rubric": [
            {
              "id": "customer_populated",
              "criterion": "customerId is correctly populated into an object with at least _id, name, and email.|||customerId populate đúng thành object có ít nhất _id, name, email.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "products_populated_with_quantity",
              "criterion": "Each product is populated with _id, name, price, AND correctly keeps the order-specific quantity (not the product's stock).|||Mỗi sản phẩm populate đủ _id, name, price, VÀ giữ đúng quantity riêng của đơn (không phải stock của sản phẩm).",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "not_found_handling",
              "criterion": "Returns an appropriate 404 error when the orderId doesn't match any order.|||Trả đúng lỗi 404 khi orderId không khớp đơn nào.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "response_shape_correct",
              "criterion": "Full response shape matches the paper's example exactly (_id, orderDate, customer, products, totalPrice).|||Hình dạng response đầy đủ khớp đúng ví dụ đề (_id, orderDate, customer, products, totalPrice).",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2.5 points) - Create a New Order.</strong> Enable a customer to create a new order. Endpoint: <code>POST /api/orders/create</code>. Input: JSON with <code>customerId</code>, <code>products</code> (array of productId and quantity). Output: the newly created order's details.</p><pre><code class=\"language-json\">// Request body\n{\n  \"customerId\": \"67bca5a616951b6b54b79eb5\",\n  \"products\": [\n    { \"productId\": \"67bc8ff7d100471c0d9a4c57\", \"quantity\": 1 },\n    { \"productId\": \"67bc8ff7d100471c0d9a4c58\", \"quantity\": 4 }\n  ]\n}\n\n// Response (201 Created)\n{\n  \"_id\": \"67bf514d77ce2f236c2c1e4a\",\n  \"customerId\": \"67bca5a616951b6b54b79eb5\",\n  \"orderDate\": \"2025-02-26T17:37:17.119Z\",\n  \"products\": [\n    { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999, \"quantity\": 1 },\n    { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899, \"quantity\": 4 }\n  ],\n  \"totalPrice\": 4595\n}</code></pre><p><i>The newly created order is saved into the orders collection storing the raw {productId, quantity} per item (no per-item price snapshot in this schema — only the aggregate totalPrice is stored).</i></p>|||<p><strong>Câu 4 (2.5 điểm) - Tạo đơn hàng mới.</strong> Cho phép khách hàng tạo đơn mới. Endpoint: <code>POST /api/orders/create</code>. Input: JSON gồm <code>customerId</code>, <code>products</code> (mảng productId và quantity). Output: chi tiết đơn vừa tạo.</p><pre><code class=\"language-json\">// Request body\n{\n  \"customerId\": \"67bca5a616951b6b54b79eb5\",\n  \"products\": [\n    { \"productId\": \"67bc8ff7d100471c0d9a4c57\", \"quantity\": 1 },\n    { \"productId\": \"67bc8ff7d100471c0d9a4c58\", \"quantity\": 4 }\n  ]\n}\n\n// Response (201 Created)\n{\n  \"_id\": \"67bf514d77ce2f236c2c1e4a\",\n  \"customerId\": \"67bca5a616951b6b54b79eb5\",\n  \"orderDate\": \"2025-02-26T17:37:17.119Z\",\n  \"products\": [\n    { \"_id\": \"67bc8ff7d100471c0d9a4c57\", \"name\": \"iPhone 14\", \"price\": 999, \"quantity\": 1 },\n    { \"_id\": \"67bc8ff7d100471c0d9a4c58\", \"name\": \"Samsung Galaxy S23\", \"price\": 899, \"quantity\": 4 }\n  ],\n  \"totalPrice\": 4595\n}</code></pre><p><i>Đơn mới lưu vào bảng orders dưới dạng {productId, quantity} thô mỗi item (schema này không lưu giá theo item — chỉ lưu totalPrice tổng).</i></p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Product = db.product;\nconst Order = db.order;\n\nconst createOrder = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createOrder };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Product = db.product;\nconst Order = db.order;\n\nconst createOrder = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { customerId, products } = req.body;\n\n        if (!Array.isArray(products) || products.length === 0) {\n            return res.status(400).json({ error: \"Products are required\" });\n        }\n\n        let totalPrice = 0;\n        const orderProducts = [];\n        for (const { productId, quantity } of products) {\n            const product = await Product.findById(productId);\n            if (!product) {\n                return res.status(404).json({ error: \"Product not found\" });\n            }\n            totalPrice += product.price * quantity;\n            orderProducts.push({ productId, quantity });\n        }\n\n        const order = await Order.create({\n            customerId,\n            products: orderProducts,\n            totalPrice,\n            orderDate: new Date(),\n        });\n\n        const populatedOrder = await Order.findById(order._id)\n            .populate(\"products.productId\", \"name price\")\n            .lean();\n\n        res.status(201).json({\n            _id: populatedOrder._id,\n            customerId: populatedOrder.customerId,\n            orderDate: populatedOrder.orderDate,\n            products: populatedOrder.products.map((p) => ({\n                _id: p.productId._id,\n                name: p.productId.name,\n                price: p.productId.price,\n                quantity: p.quantity,\n            })),\n            totalPrice: populatedOrder.totalPrice,\n        });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createOrder };",
          "explanation": "<p><code>totalPrice</code> is computed server-side from each product's CURRENT price at order time (999×1 + 899×4 = 4595, matching the paper's example exactly), never trusted from the request body. The order is saved with plain <code>{productId, quantity}</code> per item — matching this exam's given schema, which has no per-item price field — then re-fetched with <code>.populate()</code> just to build the enriched response; a real limitation of this schema (also present in the paper's own design, not introduced here) is that a later price change on a product would make Question 2/3's re-reads of this order show the NEW price rather than what was actually paid, since no price snapshot is stored per item.</p>|||<p><code>totalPrice</code> tính phía server từ giá HIỆN TẠI của từng sản phẩm lúc đặt đơn (999×1 + 899×4 = 4595, khớp đúng ví dụ đề), không bao giờ tin từ request body. Đơn lưu dạng <code>{productId, quantity}</code> thô mỗi item — khớp đúng schema đề cho, không có field giá theo item — rồi truy vấn lại kèm <code>.populate()</code> chỉ để dựng response đầy đủ; 1 giới hạn thật của schema này (cũng có sẵn trong thiết kế gốc của đề, không phải lỗi đưa vào ở đây) là nếu giá sản phẩm đổi sau đó, đọc lại đơn này ở Câu 2/3 sẽ hiện giá MỚI thay vì giá thực đã trả, vì không lưu chụp giá theo item.</p>",
          "rubric": [
            {
              "id": "validates_products",
              "criterion": "Validates that products are provided and that each referenced product actually exists.|||Kiểm products được cung cấp và mỗi sản phẩm tham chiếu thực sự tồn tại.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "server_side_total_price",
              "criterion": "totalPrice is computed server-side from each product's current price and quantity, never trusted from the client.|||totalPrice tính phía server từ giá hiện tại và quantity mỗi sản phẩm, không bao giờ tin từ client.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "order_saved_correctly",
              "criterion": "The new order is correctly saved with customerId, products ({productId, quantity} per item), totalPrice, and orderDate.|||Đơn mới lưu đúng customerId, products ({productId, quantity} mỗi item), totalPrice, orderDate.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "response_shape_correct",
              "criterion": "The response returns the newly created order with products enriched with name/price/quantity, matching the paper's example.|||Response trả đúng đơn vừa tạo với products đủ name/price/quantity, khớp ví dụ đề.",
              "weight": 1,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "javascript",
          "prompt": "<p><strong>Question 5 (1 point) - Authentication with JWT.</strong> Support customer login and protect certain endpoints using JWT authentication.</p><p><b>1. Login API:</b> <code>POST /api/customers/login</code>. Input: JSON with email and password. Output: returns a JWT token when the credentials are valid (payload = {id: customer._id}; JWT_SECRET read from .env; expiresIn: '1h').</p><pre><code class=\"language-json\">// Request: { \"email\": \"john@example.com\", \"password\": \"abc@123\" }\n// Response 200: { \"token\": \"eyJhbGciOiJJIUzI1NiIsInR5cCI6...\" }</code></pre><p><b>2. Protected API: Retrieve Customer Profile.</b> <code>GET /api/customers/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Returns the customer's details if the token is valid.</p><pre><code class=\"language-json\">// Response 200\n{ \"_id\": \"67bca0086fac80b67916672f\", \"name\": \"John Doe\", \"email\": \"john@example.com\", \"address\": \"1234 Elm Street, Springfield, IL\", \"phone\": \"1234567890\" }</code></pre>|||<p><strong>Câu 5 (1 điểm) - Xác thực JWT.</strong> Hỗ trợ đăng nhập khách hàng và bảo vệ 1 số endpoint bằng JWT.</p><p><b>1. API đăng nhập:</b> <code>POST /api/customers/login</code>. Input: JSON email và password. Output: trả JWT khi thông tin đúng (payload = {id: customer._id}; JWT_SECRET đọc từ .env; expiresIn: '1h').</p><pre><code class=\"language-json\">// Request: { \"email\": \"john@example.com\", \"password\": \"abc@123\" }\n// Response 200: { \"token\": \"eyJhbGciOiJJIUzI1NiIsInR5cCI6...\" }</code></pre><p><b>2. API bảo vệ: Lấy hồ sơ khách hàng.</b> <code>GET /api/customers/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Trả chi tiết khách hàng nếu token hợp lệ.</p><pre><code class=\"language-json\">// Response 200\n{ \"_id\": \"67bca0086fac80b67916672f\", \"name\": \"John Doe\", \"email\": \"john@example.com\", \"address\": \"1234 Elm Street, Springfield, IL\", \"phone\": \"1234567890\" }</code></pre>",
          "starterCode": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst Customer = db.customer;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "sampleSolution": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst Customer = db.customer;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { email, password } = req.body;\n\n        const customer = await Customer.findOne({ email });\n        if (!customer) {\n            return res.status(401).json({ error: \"Invalid credentials\" });\n        }\n\n        // customers.json stores 'password' already bcrypt-hashed — compare, never string-equal\n        const isMatch = await bcrypt.compare(password, customer.password);\n        if (!isMatch) {\n            return res.status(401).json({ error: \"Invalid credentials\" });\n        }\n\n        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\n        res.json({ token });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    const authHeader = req.headers[\"authorization\"];\n    const token = authHeader && authHeader.split(\" \")[1];\n\n    if (!token) {\n        return res.status(401).json({ error: \"No token provided\" });\n    }\n\n    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {\n        if (err) {\n            return res.status(403).json({ error: \"Invalid or expired token\" });\n        }\n        req.user = decoded;\n        next();\n    });\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const customer = await Customer.findById(req.user.id).select(\"-password\").lean();\n        if (!customer) {\n            return res.status(404).json({ error: \"Customer not found\" });\n        }\n        res.json(customer);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "explanation": "<p><b>Caught a real detail from the given seed data</b>: <code>customers.json</code>'s field is literally named <code>password</code> (not <code>passwordHash</code>), but its stored VALUE is already a bcrypt hash (<code>$2b$10$...</code>) — the field name alone doesn't tell you whether it's hashed, so <code>login</code> must still use <code>bcrypt.compare()</code>, never a direct string comparison. <code>.select(\"-password\")</code> keeps the hash out of the profile response, matching the paper's example (which never shows a password field).</p>|||<p><b>Bắt đúng 1 chi tiết thật từ dữ liệu seed đề cho</b>: field trong <code>customers.json</code> đặt tên đúng là <code>password</code> (không phải <code>passwordHash</code>), nhưng GIÁ TRỊ lưu đã là hash bcrypt (<code>$2b$10$...</code>) — chỉ tên field không nói lên nó có băm hay không, nên <code>login</code> vẫn phải dùng <code>bcrypt.compare()</code>, không bao giờ so chuỗi trực tiếp. <code>.select(\"-password\")</code> giữ hash không lộ ra response profile, khớp ví dụ đề (không bao giờ hiện field password).</p>",
          "rubric": [
            {
              "id": "login_bcrypt_compare_and_jwt",
              "criterion": "Login validates credentials using bcrypt.compare (not a plaintext comparison) and returns a valid JWT signed with the secret from .env, with payload {id: customer._id}.|||Đăng nhập kiểm đúng bằng bcrypt.compare (không so chuỗi thô), trả JWT hợp lệ ký bằng secret từ .env, payload {id: customer._id}.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "middleware_protects_profile",
              "criterion": "The profile endpoint is protected by JWT middleware that correctly rejects missing/invalid tokens.|||Endpoint profile được bảo vệ bởi middleware JWT từ chối đúng token thiếu/sai.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "profile_excludes_password",
              "criterion": "The profile response includes the customer's details but never exposes the password/hash field.|||Response profile có đủ chi tiết khách hàng nhưng không bao giờ lộ field password/hash.",
              "weight": 1,
              "maxScore": 0.2
            }
          ]
        }
      ]
    }
  ]
};
