export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE4",
      "title": "SDN302 – Practical Exam (Fall 2025, Block 3), E-Commerce Orders API|||SDN302 – Thi thực hành (Fall 2025, Block 3), API đơn hàng E-Commerce",
      "description": "SDN302 PE (CODE): customer purchase history, aggregation-based sales report, order creation with stock validation, and Pending-only order-item update with stock restore/rollback, AI-graded.|||PE SDN302 (viết mã): lịch sử mua hàng, báo cáo doanh số qua aggregation, tạo đơn kiểm tồn kho, cập nhật item đơn hàng chỉ khi Pending kèm phục hồi/hoàn tác tồn kho, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Fall 2025, Block 3)</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for an e-commerce system managing customers, products, and orders. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: customers, products, orders — database \"SDN302_FA25_B5\"):</b><pre><code class=\"language-javascript\">// customer\n{ name: String, phone: String, email: String, address: String }\n\n// product\n{ name: String, price: Number, category: String, stock: Number }\n\n// order\n{\n  customer_id: ObjectId,   // ref customer\n  items: [{ product_id: ObjectId, quantity: Number, price_at_order: Number, total: Number }],\n  total_amount: Number,\n  payment_method: String,\n  status: String,          // \"Pending\" | \"Completed\" | ...\n  order_date: Date\n}</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: customers, products, orders — database \"SDN302_FA25_B5\"):</b><pre><code class=\"language-javascript\">// customer\n{ name: String, phone: String, email: String, address: String }\n\n// product\n{ name: String, price: Number, category: String, stock: Number }\n\n// order\n{\n  customer_id: ObjectId,   // ref customer\n  items: [{ product_id: ObjectId, quantity: Number, price_at_order: Number, total: Number }],\n  total_amount: Number,\n  payment_method: String,\n  status: String,          // \"Pending\" | \"Completed\" | ...\n  order_date: Date\n}</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Fall 2025, Block 3)</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho hệ thống e-commerce quản lý customers, products, orders. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: customers, products, orders — database \"SDN302_FA25_B5\"):</b><pre><code class=\"language-javascript\">// customer\n{ name: String, phone: String, email: String, address: String }\n\n// product\n{ name: String, price: Number, category: String, stock: Number }\n\n// order\n{\n  customer_id: ObjectId,   // ref customer\n  items: [{ product_id: ObjectId, quantity: Number, price_at_order: Number, total: Number }],\n  total_amount: Number,\n  payment_method: String,\n  status: String,          // \"Pending\" | \"Completed\" | ...\n  order_date: Date\n}</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: customers, products, orders — database \"SDN302_FA25_B5\"):</b><pre><code class=\"language-javascript\">// customer\n{ name: String, phone: String, email: String, address: String }\n\n// product\n{ name: String, price: Number, category: String, stock: Number }\n\n// order\n{\n  customer_id: ObjectId,   // ref customer\n  items: [{ product_id: ObjectId, quantity: Number, price_at_order: Number, total: Number }],\n  total_amount: Number,\n  payment_method: String,\n  status: String,          // \"Pending\" | \"Completed\" | ...\n  order_date: Date\n}</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (2.5 points): Retrieve Customer Purchase History.</strong> Return all orders of a specified customer based on the customer ID, with brief product information included in each order. Endpoint: <code>GET /api/customers/{customerId}/orders</code>. Request Parameter: customerId (ObjectId).</p><pre><code class=\"language-json\">// Response 200 (OK)\n[\n  {\n    \"_id\": \"6936f4c6f2937fc51e5f7cb1\",\n    \"order_date\": \"2025-12-02T10:15:00.000Z\",\n    \"status\": \"Pending\",\n    \"items\": [\n      { \"product\": \"Logitech Mouse\", \"quantity\": 2, \"total\": 1000000 },\n      { \"product\": \"Mechanical Keyboard\", \"quantity\": 1, \"total\": 1500000 }\n    ],\n    \"total_amount\": 2500000\n  }\n]\n\n// Response 404 (Not Found): if no orders found\n{ \"error\": \"No orders found for this customer\" }</code></pre>|||<p><strong>Câu 1 (2.5 điểm): Lấy lịch sử mua hàng khách hàng.</strong> Trả về mọi đơn hàng của 1 khách hàng theo customerId, kèm thông tin sản phẩm rút gọn trong mỗi đơn. Endpoint: <code>GET /api/customers/{customerId}/orders</code>. Tham số: customerId (ObjectId).</p><pre><code class=\"language-json\">// Response 200 (OK)\n[\n  {\n    \"_id\": \"6936f4c6f2937fc51e5f7cb1\",\n    \"order_date\": \"2025-12-02T10:15:00.000Z\",\n    \"status\": \"Pending\",\n    \"items\": [\n      { \"product\": \"Logitech Mouse\", \"quantity\": 2, \"total\": 1000000 },\n      { \"product\": \"Mechanical Keyboard\", \"quantity\": 1, \"total\": 1500000 }\n    ],\n    \"total_amount\": 2500000\n  }\n]\n\n// Response 404 (Not Found): nếu không có đơn nào\n{ \"error\": \"No orders found for this customer\" }</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getCustomerOrders = async (req, res, next) => {\n    const { customerId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getCustomerOrders };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst getCustomerOrders = async (req, res, next) => {\n    const { customerId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const orders = await Order.find({ customer_id: customerId })\n            .populate(\"items.product_id\", \"name\")\n            .lean();\n\n        if (!orders.length) {\n            return res.status(404).json({ error: \"No orders found for this customer\" });\n        }\n\n        const formatted = orders.map((order) => ({\n            _id: order._id,\n            order_date: order.order_date,\n            status: order.status,\n            items: order.items.map((item) => ({\n                product: item.product_id?.name,\n                quantity: item.quantity,\n                total: item.total,\n            })),\n            total_amount: order.total_amount,\n        }));\n\n        res.json(formatted);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getCustomerOrders };",
          "explanation": "<p>Mongoose supports populating a nested array subdocument path directly (<code>\"items.product_id\"</code>), resolving each item's product reference into just its <code>name</code> (matching the response's brief <code>\"product\": \"Logitech Mouse\"</code> field, not a full product object). The response re-shapes each order to show only <code>product</code>/<code>quantity</code>/<code>total</code> per item, dropping the stored <code>price_at_order</code> and <code>product_id</code> fields, since the paper's own example response only shows those three per-item fields.</p>|||<p>Mongoose hỗ trợ populate trực tiếp đường dẫn subdocument mảng lồng (<code>\"items.product_id\"</code>), phân giải tham chiếu sản phẩm mỗi item chỉ thành <code>name</code> (khớp field rút gọn <code>\"product\": \"Logitech Mouse\"</code> của response, không phải object product đầy đủ). Response định dạng lại mỗi order chỉ hiện <code>product</code>/<code>quantity</code>/<code>total</code> mỗi item, bỏ <code>price_at_order</code> và <code>product_id</code> đã lưu, vì ví dụ response của đề chỉ hiện đúng 3 field đó mỗi item.</p>",
          "rubric": [
            {
              "id": "finds_orders_by_customer",
              "criterion": "Correctly finds all orders belonging to the given customerId.|||Tìm đúng mọi đơn hàng thuộc customerId đã cho.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "product_info_populated",
              "criterion": "Each item's product_id is correctly resolved into brief product information (at least the product name), not a raw ObjectId.|||product_id mỗi item được phân giải đúng thành thông tin sản phẩm rút gọn (ít nhất tên), không phải ObjectId thô.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "response_shape_correct",
              "criterion": "Response matches the paper's shape (order-level date/status/items/total_amount, item-level product/quantity/total).|||Response khớp đúng hình dạng đề (cấp đơn: date/status/items/total_amount; cấp item: product/quantity/total).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "not_found_handling",
              "criterion": "Returns the exact 404 error message when the customer has no orders.|||Trả đúng thông điệp lỗi 404 khi khách hàng không có đơn nào.",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (2.5 points): Product Sales Ranking Report.</strong> Create a report showing the total quantity sold of each product, sorted by the highest sales. Endpoint: <code>GET /api/orders/reports/product-sales</code>.</p><pre><code class=\"language-json\">[\n  { \"total_quantity_sold\": 3, \"product\": \"Mechanical Keyboard\" },\n  { \"total_quantity_sold\": 2, \"product\": \"Logitech Mouse\" }\n]</code></pre><p><strong>Business Rules:</strong> count total quantity sold for each product across all orders. Sort results by total_quantity_sold in descending order. Include only products that appear in at least one order.</p>|||<p><strong>Câu 2 (2.5 điểm): Báo cáo xếp hạng bán hàng theo sản phẩm.</strong> Tạo báo cáo tổng số lượng bán mỗi sản phẩm, sắp theo doanh số cao nhất. Endpoint: <code>GET /api/orders/reports/product-sales</code>.</p><pre><code class=\"language-json\">[\n  { \"total_quantity_sold\": 3, \"product\": \"Mechanical Keyboard\" },\n  { \"total_quantity_sold\": 2, \"product\": \"Logitech Mouse\" }\n]</code></pre><p><strong>Quy tắc nghiệp vụ:</strong> đếm tổng số lượng bán mỗi sản phẩm qua mọi đơn hàng. Sắp kết quả theo total_quantity_sold giảm dần. Chỉ gồm sản phẩm xuất hiện trong ít nhất 1 đơn hàng.</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst productSalesReport = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { productSalesReport };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Order = db.order;\n\nconst productSalesReport = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const report = await Order.aggregate([\n            { $unwind: \"$items\" },\n            {\n                $group: {\n                    _id: \"$items.product_id\",\n                    total_quantity_sold: { $sum: \"$items.quantity\" },\n                },\n            },\n            {\n                $lookup: {\n                    from: \"products\",\n                    localField: \"_id\",\n                    foreignField: \"_id\",\n                    as: \"productInfo\",\n                },\n            },\n            { $unwind: \"$productInfo\" },\n            {\n                $project: {\n                    _id: 0,\n                    total_quantity_sold: 1,\n                    product: \"$productInfo.name\",\n                },\n            },\n            { $sort: { total_quantity_sold: -1 } },\n        ]);\n\n        res.json(report);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { productSalesReport };",
          "explanation": "<p>Starting the aggregation FROM the <code>Order</code> collection (rather than from <code>Product</code> with a reverse <code>$lookup</code>) automatically satisfies \"include only products that appear in at least one order\" for free — a product that was never ordered simply never produces a group in the <code>$unwind</code>/<code>$group</code> stage, with no extra filter needed. <code>$sum: \"$items.quantity\"</code> correctly accumulates across every order that references the product, not just the first one found.</p>|||<p>Bắt đầu aggregation TỪ bảng <code>Order</code> (thay vì từ <code>Product</code> rồi <code>$lookup</code> ngược) tự động thoả \"chỉ gồm sản phẩm xuất hiện trong ít nhất 1 đơn\" miễn phí — sản phẩm chưa từng được đặt đơn giản không bao giờ sinh ra nhóm ở giai đoạn <code>$unwind</code>/<code>$group</code>, không cần lọc thêm. <code>$sum: \"$items.quantity\"</code> cộng dồn đúng qua mọi đơn có tham chiếu sản phẩm đó, không chỉ đơn đầu tiên tìm thấy.</p>",
          "rubric": [
            {
              "id": "aggregates_across_all_orders",
              "criterion": "Correctly sums total quantity sold per product across ALL orders (not just one order or one item per product).|||Cộng dồn đúng tổng số lượng bán mỗi sản phẩm qua TẤT CẢ đơn hàng (không chỉ 1 đơn hay 1 item mỗi sản phẩm).",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "sorted_descending",
              "criterion": "Results are sorted by total_quantity_sold in descending order.|||Kết quả sắp theo total_quantity_sold giảm dần.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "only_ordered_products",
              "criterion": "Only includes products that appear in at least one order (never-ordered products are absent, not shown with 0).|||Chỉ gồm sản phẩm xuất hiện ít nhất 1 đơn (sản phẩm chưa từng bán không xuất hiện, không hiện 0).",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "response_shape_correct",
              "criterion": "Each result object has exactly total_quantity_sold and product (product name, not id).|||Mỗi object kết quả có đúng total_quantity_sold và product (tên sản phẩm, không phải id).",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 3,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (3 points): Create a New Order.</strong> Place a new order, check stock availability, and automatically update product inventory. Endpoint: <code>POST /api/orders</code>.</p><pre><code class=\"language-json\">// Request body\n{\n  \"customer_id\": \"6936f4c6f2937fc51e5f7ca8\",\n  \"items\": [\n    { \"product_id\": \"6936f4c6f2937fc51e5f7cab\", \"quantity\": 2 },\n    { \"product_id\": \"6936f4c6f2937fc51e5f7cac\", \"quantity\": 10 }\n  ],\n  \"payment_method\": \"Credit Card\"\n}\n\n// Response 201 (Created)\n{\n  \"message\": \"Order created successfully\",\n  \"order_id\": \"693aa018083b21879dc5f3a2\",\n  \"updated_products\": [\n    { \"name\": \"Laptop Dell XPS 15\", \"stock\": 18 },\n    { \"name\": \"Logitech Mouse\", \"stock\": 90 }\n  ],\n  \"total_amount\": 75000000\n}\n\n// Response 404: { \"error\": \"Customer not found\" }\n// Response 400: { \"error\": \"Items required\" }          (items missing/empty)\n// Response 404: { \"error\": \"Product not found\" }        (a product_id doesn't exist)\n// Response 400: { \"error\": \"Insufficient quantity to purchase\" }</code></pre><p><strong>Business Rules:</strong> validate customer_id. For each product: reject request if stock &lt; quantity; set price_at_order = product.price. After order creation, decrease stock accordingly. Recalculate total_amount on the server side.</p>|||<p><strong>Câu 3 (3 điểm): Tạo đơn hàng mới.</strong> Đặt đơn mới, kiểm tồn kho, tự động cập nhật tồn kho sản phẩm. Endpoint: <code>POST /api/orders</code>.</p><pre><code class=\"language-json\">// Request body\n{\n  \"customer_id\": \"6936f4c6f2937fc51e5f7ca8\",\n  \"items\": [\n    { \"product_id\": \"6936f4c6f2937fc51e5f7cab\", \"quantity\": 2 },\n    { \"product_id\": \"6936f4c6f2937fc51e5f7cac\", \"quantity\": 10 }\n  ],\n  \"payment_method\": \"Credit Card\"\n}\n\n// Response 201 (Created)\n{\n  \"message\": \"Order created successfully\",\n  \"order_id\": \"693aa018083b21879dc5f3a2\",\n  \"updated_products\": [\n    { \"name\": \"Laptop Dell XPS 15\", \"stock\": 18 },\n    { \"name\": \"Logitech Mouse\", \"stock\": 90 }\n  ],\n  \"total_amount\": 75000000\n}\n\n// Response 404: { \"error\": \"Customer not found\" }\n// Response 400: { \"error\": \"Items required\" }          (thiếu/rỗng items)\n// Response 404: { \"error\": \"Product not found\" }        (1 product_id không tồn tại)\n// Response 400: { \"error\": \"Insufficient quantity to purchase\" }</code></pre><p><strong>Quy tắc nghiệp vụ:</strong> kiểm customer_id. Mỗi sản phẩm: từ chối nếu stock &lt; quantity; gán price_at_order = product.price. Sau khi tạo đơn, giảm tồn kho tương ứng. Tính lại total_amount phía server.</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Customer = db.customer;\nconst Product = db.product;\nconst Order = db.order;\n\nconst createOrder = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createOrder };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Customer = db.customer;\nconst Product = db.product;\nconst Order = db.order;\n\nconst createOrder = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { customer_id, items, payment_method } = req.body;\n\n        const customer = await Customer.findById(customer_id);\n        if (!customer) {\n            return res.status(404).json({ error: \"Customer not found\" });\n        }\n\n        if (!Array.isArray(items) || items.length === 0) {\n            return res.status(400).json({ error: \"Items required\" });\n        }\n\n        // Pass 1: validate every item WITHOUT mutating any stock yet, so a\n        // failure partway through never leaves stock half-decremented\n        const resolvedItems = [];\n        for (const { product_id, quantity } of items) {\n            const product = await Product.findById(product_id);\n            if (!product) {\n                return res.status(404).json({ error: \"Product not found\" });\n            }\n            if (product.stock < quantity) {\n                return res.status(400).json({ error: \"Insufficient quantity to purchase\" });\n            }\n            resolvedItems.push({ product, quantity });\n        }\n\n        // Pass 2: all items validated — now build the order, decrease stock,\n        // and recompute total_amount server-side (never trust a client-sent total)\n        let total_amount = 0;\n        const orderItems = [];\n        const updated_products = [];\n        for (const { product, quantity } of resolvedItems) {\n            const price_at_order = product.price;\n            const itemTotal = price_at_order * quantity;\n            total_amount += itemTotal;\n\n            orderItems.push({\n                product_id: product._id,\n                quantity,\n                price_at_order,\n                total: itemTotal,\n            });\n\n            product.stock -= quantity;\n            await product.save();\n            updated_products.push({ name: product.name, stock: product.stock });\n        }\n\n        const order = await Order.create({\n            customer_id,\n            items: orderItems,\n            total_amount,\n            payment_method,\n            status: \"Pending\",\n            order_date: new Date(),\n        });\n\n        res.status(201).json({\n            message: \"Order created successfully\",\n            order_id: order._id,\n            updated_products,\n            total_amount,\n        });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createOrder };",
          "explanation": "<p><b>Deliberate two-pass design</b>: Pass 1 validates every item (product exists, stock sufficient) without writing anything; Pass 2 only runs once every item has already passed, then decrements stock and builds the order. A naive single-pass implementation that decremented stock immediately inside the same loop that checks it would leave EARLIER items' stock permanently decremented even if a LATER item fails validation — since this exam's local MongoDB has no replica set (no multi-document transactions available), this two-pass validate-then-mutate structure is the practical way to avoid that partial-write bug without needing <code>session.startTransaction()</code>. <code>price_at_order</code> is always taken from the current <code>product.price</code> at order time (never trusted from the request body), matching \"set price_at_order = product.price.\"</p>|||<p><b>Thiết kế 2 pha có chủ đích</b>: Pha 1 kiểm mọi item (sản phẩm tồn tại, đủ tồn kho) mà không ghi gì; Pha 2 chỉ chạy khi mọi item đã qua hết, rồi mới trừ tồn kho và dựng đơn. Cài đặt 1 pha ngây thơ trừ tồn kho ngay trong vòng lặp kiểm sẽ để tồn kho các item TRƯỚC bị trừ vĩnh viễn dù item SAU thất bại kiểm tra — vì MongoDB local của đề này không có replica set (không dùng được transaction đa document), cấu trúc 2 pha kiểm-trước-ghi-sau là cách thực tế tránh lỗi ghi nửa vời đó mà không cần <code>session.startTransaction()</code>. <code>price_at_order</code> luôn lấy từ <code>product.price</code> hiện tại lúc đặt đơn (không bao giờ tin từ request body), khớp đúng \"gán price_at_order = product.price.\"</p>",
          "rubric": [
            {
              "id": "customer_validation",
              "criterion": "Validates customer_id exists before proceeding, returning the correct 404 error if not.|||Kiểm customer_id tồn tại trước khi tiếp tục, trả đúng lỗi 404 nếu không.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "items_required_validation",
              "criterion": "Rejects a missing or empty items array with the correct 400 error.|||Từ chối items thiếu/rỗng với đúng lỗi 400.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "stock_and_product_validation",
              "criterion": "For every item, correctly validates the product exists and has sufficient stock, with the correct error and status code for each failure case.|||Với mọi item, kiểm đúng sản phẩm tồn tại và đủ tồn kho, đúng lỗi/status cho từng trường hợp thất bại.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "no_partial_write_on_failure",
              "criterion": "Validates all items BEFORE decrementing any stock, so a failure partway through never leaves some products' stock decremented while the order itself fails to create.|||Kiểm hết mọi item TRƯỚC KHI trừ bất kỳ tồn kho nào, để thất bại giữa chừng không bao giờ để lại tồn kho vài sản phẩm đã trừ trong khi đơn hàng không được tạo.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "server_side_total_and_price",
              "criterion": "price_at_order and total_amount are computed server-side from the current product price, never trusted from the client request.|||price_at_order và total_amount tính phía server từ giá sản phẩm hiện tại, không bao giờ tin từ request client.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "stock_decreased_and_response_correct",
              "criterion": "Stock is correctly decreased after order creation, and the response matches the paper's shape (message, order_id, updated_products, total_amount).|||Tồn kho giảm đúng sau khi tạo đơn, response khớp đúng hình dạng đề (message, order_id, updated_products, total_amount).",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2 points): Update Order Items (Only If Status Is Pending).</strong> Update the items of an order only while its status is still \"Pending\". Endpoint: <code>PUT /api/orders/{orderId}</code>. Request Parameter: orderId (ObjectId, required).</p><pre><code class=\"language-json\">// Request body\n{ \"items\": [ { \"product_id\": \"6936f4c6f2937fc51e5f7cae\", \"quantity\": 10 } ] }\n\n// Response 200 (OK)\n{ \"message\": \"Order updated successfully\", \"new_total_amount\": 55000000 }\n\n// Response 404: { \"error\": \"Order not found\" }\n// Response 400: { \"error\": \"Items required\" }\n// Response 409 (Conflict): { \"error\": \"Order is not in Pending status. Update denied.\" }</code></pre><p><strong>Business Rules:</strong> updating is allowed only if <code>status === \"Pending\"</code>. When updating: return the original stock (restore previous quantity); check stock availability for the new quantity; subtract stock based on the updated quantity; recalculate total_amount.</p>|||<p><strong>Câu 4 (2 điểm): Cập nhật item đơn hàng (chỉ khi trạng thái Pending).</strong> Chỉ cập nhật item đơn hàng khi status vẫn còn \"Pending\". Endpoint: <code>PUT /api/orders/{orderId}</code>. Tham số: orderId (ObjectId, bắt buộc).</p><pre><code class=\"language-json\">// Request body\n{ \"items\": [ { \"product_id\": \"6936f4c6f2937fc51e5f7cae\", \"quantity\": 10 } ] }\n\n// Response 200 (OK)\n{ \"message\": \"Order updated successfully\", \"new_total_amount\": 55000000 }\n\n// Response 404: { \"error\": \"Order not found\" }\n// Response 400: { \"error\": \"Items required\" }\n// Response 409 (Conflict): { \"error\": \"Order is not in Pending status. Update denied.\" }</code></pre><p><strong>Quy tắc nghiệp vụ:</strong> chỉ cho cập nhật khi <code>status === \"Pending\"</code>. Khi cập nhật: trả lại tồn kho cũ (phục hồi số lượng trước); kiểm tồn kho cho số lượng mới; trừ tồn kho theo số lượng mới; tính lại total_amount.</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Product = db.product;\nconst Order = db.order;\n\nconst updateOrderItems = async (req, res, next) => {\n    const { orderId } = req.params;\n    const { items } = req.body;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { updateOrderItems };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Product = db.product;\nconst Order = db.order;\n\nconst updateOrderItems = async (req, res, next) => {\n    const { orderId } = req.params;\n    const { items } = req.body;\n    // ---------- Student's code starts from here ----------\n    try {\n        const order = await Order.findById(orderId);\n        if (!order) {\n            return res.status(404).json({ error: \"Order not found\" });\n        }\n        if (!Array.isArray(items) || items.length === 0) {\n            return res.status(400).json({ error: \"Items required\" });\n        }\n        if (order.status !== \"Pending\") {\n            return res.status(409).json({ error: \"Order is not in Pending status. Update denied.\" });\n        }\n\n        // Step 1: restore stock reserved by the order's CURRENT items\n        for (const oldItem of order.items) {\n            await Product.findByIdAndUpdate(oldItem.product_id, {\n                $inc: { stock: oldItem.quantity },\n            });\n        }\n\n        // Step 2: validate the new items against the now-restored stock\n        const resolvedItems = [];\n        let validationError = null;\n        for (const { product_id, quantity } of items) {\n            const product = await Product.findById(product_id);\n            if (!product) {\n                validationError = { status: 404, error: \"Product not found\" };\n                break;\n            }\n            if (product.stock < quantity) {\n                validationError = { status: 400, error: \"Insufficient quantity to purchase\" };\n                break;\n            }\n            resolvedItems.push({ product, quantity });\n        }\n\n        if (validationError) {\n            // Roll back Step 1's restoration since the update is being rejected\n            // (no multi-document transaction available on this local MongoDB)\n            for (const oldItem of order.items) {\n                await Product.findByIdAndUpdate(oldItem.product_id, {\n                    $inc: { stock: -oldItem.quantity },\n                });\n            }\n            return res.status(validationError.status).json({ error: validationError.error });\n        }\n\n        // Step 3: subtract stock for the new quantities, recompute total_amount\n        let total_amount = 0;\n        const newOrderItems = [];\n        for (const { product, quantity } of resolvedItems) {\n            product.stock -= quantity;\n            await product.save();\n\n            const itemTotal = product.price * quantity;\n            total_amount += itemTotal;\n            newOrderItems.push({\n                product_id: product._id,\n                quantity,\n                price_at_order: product.price,\n                total: itemTotal,\n            });\n        }\n\n        order.items = newOrderItems;\n        order.total_amount = total_amount;\n        await order.save();\n\n        res.json({ message: \"Order updated successfully\", new_total_amount: total_amount });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { updateOrderItems };",
          "explanation": "<p>The 3 business-rule steps are implemented in the exact order specified: restore old stock FIRST (Step 1) — unconditionally, for every item currently on the order, not just ones reappearing in the new list — THEN validate the new items against that now-restored stock (Step 2), THEN subtract the new quantities and recompute (Step 3). If Step 2 fails partway, Step 1's restoration is explicitly rolled back before responding with the error, so a rejected update never leaves stock in a different state than before the request — again a manual rollback rather than a real transaction, since this exam's local MongoDB has no replica set.</p>|||<p>3 bước quy tắc nghiệp vụ triển khai đúng thứ tự yêu cầu: phục hồi tồn kho cũ TRƯỚC (Bước 1) — vô điều kiện, cho MỌI item hiện có trên đơn, không chỉ cái xuất hiện lại trong danh sách mới — RỒI kiểm item mới so tồn kho đã phục hồi (Bước 2), RỒI trừ số lượng mới và tính lại (Bước 3). Nếu Bước 2 thất bại giữa chừng, việc phục hồi ở Bước 1 được hoàn tác tường minh trước khi trả lỗi, để 1 lần cập nhật bị từ chối không bao giờ để lại tồn kho khác trạng thái trước request — vẫn là hoàn tác thủ công chứ không phải transaction thật, vì MongoDB local của đề này không có replica set.</p>",
          "rubric": [
            {
              "id": "pending_only_check",
              "criterion": "Only allows the update when the order's status is exactly \"Pending\", returning the correct 409 error otherwise.|||Chỉ cho cập nhật khi status đúng \"Pending\", trả đúng lỗi 409 nếu không.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "restores_original_stock",
              "criterion": "Restores the stock previously reserved by the order's current items before validating the new ones.|||Phục hồi tồn kho đã giữ bởi item hiện tại của đơn trước khi kiểm item mới.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "validates_new_stock",
              "criterion": "Correctly checks stock availability for the new item quantities (against the restored stock), with correct error handling for a missing product or insufficient stock.|||Kiểm đúng tồn kho cho số lượng item mới (so tồn kho đã phục hồi), xử lý lỗi đúng khi thiếu sản phẩm hoặc không đủ tồn kho.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "no_inconsistent_state_on_rejection",
              "criterion": "A rejected update (insufficient stock, missing product) does not leave stock in a different state than before the request — the restoration from step 1 is undone if the new validation fails.|||Cập nhật bị từ chối (thiếu tồn kho, thiếu sản phẩm) không để lại tồn kho khác trạng thái trước request — việc phục hồi ở bước 1 được hoàn tác nếu kiểm mới thất bại.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "subtracts_and_recalculates",
              "criterion": "Correctly subtracts stock for the new quantities and recalculates total_amount, matching the response shape.|||Trừ đúng tồn kho cho số lượng mới và tính lại total_amount, khớp hình dạng response.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        }
      ]
    }
  ]
};
