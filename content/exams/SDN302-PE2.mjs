export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE2",
      "title": "SDN302 – Practical Exam (Fall 2024, Block 5), Tutorials/Categories/Comments Full-Stack|||SDN302 – Thi thực hành (Fall 2024, Block 5), Full-stack Tutorials/Categories/Comments",
      "description": "SDN302 PE (CODE): full-stack MERN — Express+Mongoose REST API (populate, embedded subdocuments, dual-write images) plus a React frontend (category filter, comments table), AI-graded.|||PE SDN302 (viết mã): full-stack MERN — REST API Express+Mongoose (populate, subdocument nhúng, ghi kép ảnh) cộng frontend React (lọc category, bảng comment), chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Fall 2024, Block 5)</strong>. Full-stack MERN exam: build a backend Express/Mongoose REST API (Question 1) and a React frontend (Question 2) managing Tutorials, Categories, and Comments. The real exam runs with MongoDB Compass + a live database on <code>http://localhost:9999</code> (backend) and <code>http://localhost:3000</code> (frontend). This exam room has no live runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the backend at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Schema (collections: Images, Tutorials, Categories, Comments — database \"PE_Fall2024_B5\"):</b><pre><code class=\"language-javascript\">// Images collection (full, standalone records)\n{ _id: ObjectId, path: String, url: String, caption: String, createAt: Date }\n\n// Tutorials collection — images is an EMBEDDED, REDUCED subdocument (not the full Image record)\n{\n  _id: ObjectId, title: String, author: String,\n  images: [{ _id: ObjectId, url: String, caption: String }],\n  comments: [ObjectId],   // ref Comments\n  category: ObjectId      // ref Categories\n}\n\n// Categories collection\n{ _id: ObjectId, name: String, description: String }\n\n// Comments collection\n{ _id: ObjectId, username: String, text: String, createAt: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Schema (bảng: Images, Tutorials, Categories, Comments — database \"PE_Fall2024_B5\"):</b><pre><code class=\"language-javascript\">// Bảng Images (bản ghi đầy đủ, độc lập)\n{ _id: ObjectId, path: String, url: String, caption: String, createAt: Date }\n\n// Bảng Tutorials — images là subdocument NHÚNG, RÚT GỌN (không phải bản ghi Image đầy đủ)\n{\n  _id: ObjectId, title: String, author: String,\n  images: [{ _id: ObjectId, url: String, caption: String }],\n  comments: [ObjectId],   // ref Comments\n  category: ObjectId      // ref Categories\n}\n\n// Bảng Categories\n{ _id: ObjectId, name: String, description: String }\n\n// Bảng Comments\n{ _id: ObjectId, username: String, text: String, createAt: Date }</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Fall 2024, Block 5)</strong>. Đề full-stack MERN: xây backend REST API Express/Mongoose (Câu 1) và frontend React (Câu 2) quản lý Tutorials, Categories, Comments. Đề thi thật chạy với MongoDB Compass + database sống trên <code>http://localhost:9999</code> (backend) và <code>http://localhost:3000</code> (frontend). Phòng thi này không có môi trường sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ backend tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Schema (collections: Images, Tutorials, Categories, Comments — database \"PE_Fall2024_B5\"):</b><pre><code class=\"language-javascript\">// Images collection (full, standalone records)\n{ _id: ObjectId, path: String, url: String, caption: String, createAt: Date }\n\n// Tutorials collection — images is an EMBEDDED, REDUCED subdocument (not the full Image record)\n{\n  _id: ObjectId, title: String, author: String,\n  images: [{ _id: ObjectId, url: String, caption: String }],\n  comments: [ObjectId],   // ref Comments\n  category: ObjectId      // ref Categories\n}\n\n// Categories collection\n{ _id: ObjectId, name: String, description: String }\n\n// Comments collection\n{ _id: ObjectId, username: String, text: String, createAt: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Schema (bảng: Images, Tutorials, Categories, Comments — database \"PE_Fall2024_B5\"):</b><pre><code class=\"language-javascript\">// Bảng Images (bản ghi đầy đủ, độc lập)\n{ _id: ObjectId, path: String, url: String, caption: String, createAt: Date }\n\n// Bảng Tutorials — images là subdocument NHÚNG, RÚT GỌN (không phải bản ghi Image đầy đủ)\n{\n  _id: ObjectId, title: String, author: String,\n  images: [{ _id: ObjectId, url: String, caption: String }],\n  comments: [ObjectId],   // ref Comments\n  category: ObjectId      // ref Categories\n}\n\n// Bảng Categories\n{ _id: ObjectId, name: String, description: String }\n\n// Bảng Comments\n{ _id: ObjectId, username: String, text: String, createAt: Date }</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 1.1 (1.5 points):</strong> the API at <code>GET http://localhost:9999/tutorials</code> returns information of all tutorials stored in the database. Each tutorial must include: <code>images</code> (embedded attribute from the Images entities), <code>comments</code> (a reference attribute of the Comments entities), <code>category</code> (a reference attribute of the Categories entities).</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"652c1cd546a765d027fb163c\",\n    \"title\": \"Internet of Things (IoT) Tutorial\",\n    \"author\": \"David Packer\",\n    \"images\": [\n      { \"_id\": \"652c1cd546a765d027fb163e\", \"url\": \"/images/iot.png\", \"caption\": \"IoT Tutorial\" },\n      { \"...\": \"...\" }\n    ],\n    \"comments\": [\n      { \"_id\": \"652cc6cd83c0aab446fd6a06\", \"username\": \"Tom Cruise\", \"text\": \"Hi, everyone!\", \"createAt\": \"2023-10-16T05:14:53.257Z\" },\n      { \"...\": \"...\" }\n    ],\n    \"category\": { \"name\": \"Computer Science\", \"description\": \"Computer science description ....\" }\n  }\n]</code></pre>|||<p><strong>Câu 1.1 (1.5 điểm):</strong> API <code>GET http://localhost:9999/tutorials</code> trả về thông tin tất cả tutorial trong database. Mỗi tutorial phải có: <code>images</code> (thuộc tính nhúng từ Images), <code>comments</code> (thuộc tính tham chiếu Comments), <code>category</code> (thuộc tính tham chiếu Categories).</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"652c1cd546a765d027fb163c\",\n    \"title\": \"Internet of Things (IoT) Tutorial\",\n    \"author\": \"David Packer\",\n    \"images\": [\n      { \"_id\": \"652c1cd546a765d027fb163e\", \"url\": \"/images/iot.png\", \"caption\": \"IoT Tutorial\" },\n      { \"...\": \"...\" }\n    ],\n    \"comments\": [\n      { \"_id\": \"652cc6cd83c0aab446fd6a06\", \"username\": \"Tom Cruise\", \"text\": \"Hi, everyone!\", \"createAt\": \"2023-10-16T05:14:53.257Z\" },\n      { \"...\": \"...\" }\n    ],\n    \"category\": { \"name\": \"Computer Science\", \"description\": \"Computer science description ....\" }\n  }\n]</code></pre>",
          "starterCode": "// ===== models/tutorial.model.js =====\nconst mongoose = require(\"mongoose\");\nconst { Schema } = mongoose;\n\nconst TutorialSchema = new Schema({\n    title: { type: String, required: true },\n    author: { type: String, required: true },\n    images: [{ url: String, caption: String }],\n    comments: [{ type: Schema.Types.ObjectId, ref: \"comment\" }],\n    category: { type: Schema.Types.ObjectId, ref: \"category\" }\n});\n\nmodule.exports = mongoose.model(\"tutorial\", TutorialSchema);\n\n// ===== controllers/tutorial.controller.js =====\nconst db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\n\nconst findAll = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { findAll };",
          "sampleSolution": "// ===== models/tutorial.model.js =====\nconst mongoose = require(\"mongoose\");\nconst { Schema } = mongoose;\n\nconst TutorialSchema = new Schema({\n    title: { type: String, required: true },\n    author: { type: String, required: true },\n    images: [{ url: String, caption: String }],\n    comments: [{ type: Schema.Types.ObjectId, ref: \"comment\" }],\n    category: { type: Schema.Types.ObjectId, ref: \"category\" }\n});\n\nmodule.exports = mongoose.model(\"tutorial\", TutorialSchema);\n\n// ===== controllers/tutorial.controller.js =====\nconst db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\n\nconst findAll = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const tutorials = await Tutorial.find()\n            .populate(\"comments\", \"-__v\")\n            .populate(\"category\", \"-_id name description\")\n            .lean();\n\n        res.json(tutorials);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { findAll };",
          "explanation": "<p><code>images</code> is already embedded on the Tutorial document itself (a reduced subdocument, not the full Images-collection record) so it needs no populate — it's returned as-is by <code>find()</code>. <code>comments</code> and <code>category</code> are both stored as ObjectId references and need <code>.populate()</code> to resolve into full/partial objects: comments populate fully (matching the paper's example, which shows the complete comment fields), while category populates with only <code>name</code>/<code>description</code> and explicitly excludes <code>_id</code> (<code>\"-_id name description\"</code>) since the paper's own example response shows a category object with no <code>_id</code> field at all.</p>|||<p><code>images</code> đã nhúng sẵn ngay trên document Tutorial (subdocument rút gọn, không phải bản ghi đầy đủ từ bảng Images) nên không cần populate — <code>find()</code> trả về nguyên. <code>comments</code> và <code>category</code> đều lưu dạng ObjectId tham chiếu, cần <code>.populate()</code> để phân giải thành object đầy/rút gọn: comments populate đầy đủ (khớp ví dụ đề, có đủ field comment), còn category populate chỉ <code>name</code>/<code>description</code> và loại trừ tường minh <code>_id</code> (<code>\"-_id name description\"</code>) vì ví dụ response của đề cho object category không có field <code>_id</code> nào.</p>",
          "rubric": [
            {
              "id": "returns_all_tutorials",
              "criterion": "Returns an array of all tutorials from the database.|||Trả về mảng tất cả tutorial trong database.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "images_embedded_present",
              "criterion": "images is correctly included as the embedded subdocument array (no populate needed/attempted on it).|||images có đúng dạng mảng subdocument nhúng (không cần/không cố populate nó).",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "comments_populated",
              "criterion": "comments is correctly populated into full comment objects (not raw ObjectIds).|||comments populate đúng thành object comment đầy đủ (không phải ObjectId thô).",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "category_populated",
              "criterion": "category is correctly populated into an object with at least name and description.|||category populate đúng thành object có ít nhất name và description.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 1.2 (1.5 points):</strong> the API at <code>GET http://localhost:9999/tutorials/:id/comments</code> (where <code>:id</code> is the ObjectId of the Tutorial) returns all comments of the tutorial matching that Id.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"652cc6cd83c0aab446fd6a06\", \"username\": \"Tom Cruise\", \"text\": \"Hi, everyone!\", \"createAt\": \"2023-10-16T05:14:53.257Z\" },\n  { \"_id\": \"652cc74483c0aab446fd6a09\", \"username\": \"Scarlett Johansson\", \"text\": \"Perfect self-study topic. Thank you!\", \"createAt\": \"2023-10-16T05:16:52.418Z\" }\n]</code></pre>|||<p><strong>Câu 1.2 (1.5 điểm):</strong> API <code>GET http://localhost:9999/tutorials/:id/comments</code> (<code>:id</code> là ObjectId của Tutorial) trả về mọi comment của tutorial khớp Id đó.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"652cc6cd83c0aab446fd6a06\", \"username\": \"Tom Cruise\", \"text\": \"Hi, everyone!\", \"createAt\": \"2023-10-16T05:14:53.257Z\" },\n  { \"_id\": \"652cc74483c0aab446fd6a09\", \"username\": \"Scarlett Johansson\", \"text\": \"Perfect self-study topic. Thank you!\", \"createAt\": \"2023-10-16T05:16:52.418Z\" }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\n\nconst findComments = async (req, res, next) => {\n    const { id } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { findComments };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\n\nconst findComments = async (req, res, next) => {\n    const { id } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const tutorial = await Tutorial.findById(id)\n            .populate(\"comments\", \"-__v\")\n            .lean();\n\n        if (!tutorial) {\n            return res.status(404).json({ message: \"Tutorial not found.\" });\n        }\n\n        res.json(tutorial.comments || []);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { findComments };",
          "explanation": "<p>Fetches the single Tutorial by <code>:id</code>, populates just its <code>comments</code> array, and returns that array directly (not the whole tutorial) — matching the paper's example, which returns a bare array of comment objects, not a tutorial-wrapped object. A 404 guard is added for a non-existent tutorial ID, since silently returning an empty array would be indistinguishable from \"tutorial exists but has no comments.\"</p>|||<p>Lấy đúng 1 Tutorial theo <code>:id</code>, populate đúng mảng <code>comments</code> của nó, trả về mảng đó trực tiếp (không phải cả tutorial) — khớp ví dụ đề, trả về mảng comment thuần, không bọc trong object tutorial. Thêm chốt 404 cho id tutorial không tồn tại, vì lặng lẽ trả mảng rỗng sẽ không phân biệt được với \"tutorial có thật nhưng không có comment nào.\"</p>",
          "rubric": [
            {
              "id": "finds_correct_tutorial",
              "criterion": "Correctly finds the Tutorial matching the :id path parameter.|||Tìm đúng Tutorial khớp tham số đường dẫn :id.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "comments_populated_and_returned",
              "criterion": "Returns the tutorial's comments populated into full comment objects, as a bare array (not wrapped in the tutorial object).|||Trả về comments của tutorial populate đầy đủ thành object comment, dạng mảng thuần (không bọc trong object tutorial).",
              "weight": 1,
              "maxScore": 1
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 1.3 (2 points):</strong> the API at <code>POST http://localhost:9999/tutorials/create</code> creates a new Tutorial. The list of images is saved to the Images collection, and each image object's information, including <b>_id</b>, <b>URL</b>, and <b>caption</b>, is also stored in the Tutorial being added.</p><pre><code class=\"language-json\">// Request body (raw JSON)\n{\n  \"title\": \"Google Charts Tutorial 123\",\n  \"author\": \"Teddy Walker\",\n  \"category\": \"652c0578b766198f0e43c609\",\n  \"images\": [\n    { \"path\": \"/sites/images/google.png\", \"url\": \"/images/google.png\", \"caption\": \"Google\" },\n    { \"path\": \"/sites/images/google1.png\", \"url\": \"/images/google1.png\", \"caption\": \"Google - 1\" }\n  ],\n  \"comments\": []\n}\n// Response: 201 Created</code></pre>|||<p><strong>Câu 1.3 (2 điểm):</strong> API <code>POST http://localhost:9999/tutorials/create</code> tạo Tutorial mới. Danh sách ảnh được lưu vào bảng Images, và thông tin mỗi ảnh gồm <b>_id</b>, <b>URL</b>, <b>caption</b> cũng được lưu trong Tutorial vừa thêm.</p><pre><code class=\"language-json\">// Request body (raw JSON)\n{\n  \"title\": \"Google Charts Tutorial 123\",\n  \"author\": \"Teddy Walker\",\n  \"category\": \"652c0578b766198f0e43c609\",\n  \"images\": [\n    { \"path\": \"/sites/images/google.png\", \"url\": \"/images/google.png\", \"caption\": \"Google\" },\n    { \"path\": \"/sites/images/google1.png\", \"url\": \"/images/google1.png\", \"caption\": \"Google - 1\" }\n  ],\n  \"comments\": []\n}\n// Response: 201 Created</code></pre>",
          "starterCode": "// ===== models/image.model.js =====\nconst mongoose = require(\"mongoose\");\nconst { Schema } = mongoose;\n\nconst ImageSchema = new Schema({\n    path: { type: String },\n    url: { type: String, required: true },\n    caption: { type: String },\n    createAt: { type: Date, default: Date.now }\n});\n\nmodule.exports = mongoose.model(\"image\", ImageSchema);\n\n// ===== controllers/tutorial.controller.js =====\nconst db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\nconst Image = db.image;\n\nconst create = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { create };",
          "sampleSolution": "// ===== models/image.model.js =====\nconst mongoose = require(\"mongoose\");\nconst { Schema } = mongoose;\n\nconst ImageSchema = new Schema({\n    path: { type: String },\n    url: { type: String, required: true },\n    caption: { type: String },\n    createAt: { type: Date, default: Date.now }\n});\n\nmodule.exports = mongoose.model(\"image\", ImageSchema);\n\n// ===== controllers/tutorial.controller.js =====\nconst db = require(\"../models/index\");\nconst Tutorial = db.tutorial;\nconst Image = db.image;\n\nconst create = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { title, author, category, images, comments } = req.body;\n\n        // Save each image into the standalone Images collection first\n        const createdImages = await Promise.all(\n            (images || []).map((img) =>\n                Image.create({ path: img.path, url: img.url, caption: img.caption })\n            )\n        );\n\n        // Embed only {_id, url, caption} of each SAVED image into the Tutorial,\n        // so the Tutorial's embedded copy shares the same _id as the Images record\n        const tutorial = await Tutorial.create({\n            title,\n            author,\n            category,\n            comments: comments || [],\n            images: createdImages.map((img) => ({\n                _id: img._id,\n                url: img.url,\n                caption: img.caption,\n            })),\n        });\n\n        res.status(201).json(tutorial);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { create };",
          "explanation": "<p>Images are created in the standalone Images collection FIRST (getting their own real <code>_id</code>s from MongoDB), and only THEN embedded into the new Tutorial — using each created image's actual <code>_id</code> (not a fresh, unrelated one) so the embedded copy and the Images-collection record are traceably the same image, exactly matching \"each image object's information, including _id... is also stored in the Tutorial.\" Creating images before the tutorial (rather than in parallel) is deliberate: the tutorial's embedded array needs the images' real ids, which only exist after the image documents are actually saved.</p>|||<p>Ảnh được tạo trong bảng Images độc lập TRƯỚC (nhận <code>_id</code> thật từ MongoDB), rồi MỚI nhúng vào Tutorial mới — dùng đúng <code>_id</code> thật của ảnh đã tạo (không phải _id mới không liên quan) để bản nhúng và bản ghi bảng Images truy vết được là cùng 1 ảnh, khớp đúng \"thông tin mỗi ảnh gồm _id... cũng được lưu trong Tutorial.\" Tạo ảnh trước tutorial (không phải song song) là có chủ đích: mảng nhúng của tutorial cần _id thật của ảnh, thứ chỉ có sau khi các document ảnh đã thực sự lưu xong.</p>",
          "rubric": [
            {
              "id": "images_saved_to_collection",
              "criterion": "Each image in the request is saved as its own document in the Images collection.|||Mỗi ảnh trong request được lưu thành bản ghi riêng trong bảng Images.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "images_embedded_with_same_id",
              "criterion": "Each image's _id, url, and caption are embedded into the new Tutorial, and the embedded _id is the SAME _id as the one saved to the Images collection (not a newly generated, unrelated id).|||Mỗi _id, url, caption của ảnh được nhúng vào Tutorial mới, và _id nhúng TRÙNG với _id đã lưu vào bảng Images (không phải id mới sinh ra không liên quan).",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "tutorial_created_correctly",
              "criterion": "The new Tutorial is created with title, author, category, and comments correctly set from the request body, returning 201 Created.|||Tutorial mới tạo đúng title, author, category, comments từ request body, trả về 201 Created.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2.1 (2.5 points):</strong> when the user opens <code>http://localhost:3000/</code>, load all Tutorials from the database. The page title is \"Tutorial Online Courses\", with a dropdown \"-- Select category to filter --\" and a grid of tutorial cards showing thumbnail, title, author, category, and comment count. Reduce 0.5 points if the design does not have the correct layout. Reduce 0.5 points if the number of comments for each Tutorial is not counted. Reduced by 0.5 points if there is no drop-down list to filter data, with data being the [name] attribute of the Category entity.</p>|||<p><strong>Câu 2.1 (2.5 điểm):</strong> khi người dùng mở <code>http://localhost:3000/</code>, tải tất cả Tutorial từ database. Tiêu đề trang \"Tutorial Online Courses\", có dropdown \"-- Select category to filter --\" và lưới thẻ tutorial hiện thumbnail, title, author, category, số lượng comment. Trừ 0.5đ nếu thiết kế không đúng bố cục. Trừ 0.5đ nếu không đếm số comment mỗi Tutorial. Trừ 0.5đ nếu không có dropdown lọc dữ liệu theo thuộc tính [name] của Category.</p>",
          "starterCode": "// ===== src/pages/TutorialsPage.jsx =====\nimport { useEffect, useState } from \"react\";\n\nfunction TutorialsPage() {\n    const [tutorials, setTutorials] = useState([]);\n\n    useEffect(() => {\n        // ---------- Student's code starts from here ----------\n\n        // -------------------------------------------------------\n    }, []);\n\n    return (\n        <div className=\"tutorials-page\">\n            {/* ---------- Student's code starts from here ---------- */}\n\n            {/* ------------------------------------------------------- */}\n        </div>\n    );\n}\n\nexport default TutorialsPage;",
          "sampleSolution": "// ===== src/pages/TutorialsPage.jsx =====\nimport { useEffect, useMemo, useState } from \"react\";\nimport { Link } from \"react-router-dom\";\nimport axios from \"axios\";\n\nconst API_BASE = \"http://localhost:9999\";\n\nfunction TutorialsPage() {\n    const [tutorials, setTutorials] = useState([]);\n    const [selectedCategory, setSelectedCategory] = useState(\"\");\n\n    // ---------- Student's code starts from here ----------\n    useEffect(() => {\n        axios.get(`${API_BASE}/tutorials`).then((res) => setTutorials(res.data));\n    }, []);\n\n    const categoryNames = useMemo(\n        () => [...new Set(tutorials.map((t) => t.category?.name).filter(Boolean))],\n        [tutorials]\n    );\n\n    const filteredTutorials = selectedCategory\n        ? tutorials.filter((t) => t.category?.name === selectedCategory)\n        : tutorials;\n\n    return (\n        <div className=\"tutorials-page\">\n            <h1>Tutorial Online Courses</h1>\n            <select\n                value={selectedCategory}\n                onChange={(e) => setSelectedCategory(e.target.value)}\n            >\n                <option value=\"\">-- Select category to filter --</option>\n                {categoryNames.map((name) => (\n                    <option key={name} value={name}>{name}</option>\n                ))}\n            </select>\n\n            <div className=\"tutorial-grid\">\n                {filteredTutorials.map((tutorial) => (\n                    <div className=\"tutorial-card\" key={tutorial._id}>\n                        <img\n                            src={tutorial.images?.[0]?.url}\n                            alt={tutorial.images?.[0]?.caption || tutorial.title}\n                        />\n                        <h3>{tutorial.title}</h3>\n                        <p>Author: {tutorial.author}</p>\n                        <p>Category: {tutorial.category?.name}</p>\n                        <Link to={`/tutorials/${tutorial._id}/comments`}>\n                            Comments ({tutorial.comments?.length || 0})\n                        </Link>\n                    </div>\n                ))}\n            </div>\n        </div>\n    );\n}\n// -------------------------------------------------------\n\nexport default TutorialsPage;",
          "explanation": "<p>Image <code>src</code> uses the tutorial's own embedded <code>url</code> (e.g. <code>/images/iot.png</code>) as a relative path resolved against the React app's own <code>public/</code> folder — matching the paper's own instruction to \"copy the image folder... into the public folder,\" rather than pointing at the backend origin. The category dropdown's options are derived from the actual <code>category.name</code> values present in the loaded tutorials (the [name] attribute of the Category entity, per the requirement), not a hardcoded list, so it stays correct if categories change.</p>|||<p><code>src</code> ảnh dùng đúng <code>url</code> nhúng sẵn của tutorial (VD <code>/images/iot.png</code>) làm đường dẫn tương đối phân giải theo thư mục <code>public/</code> của chính app React — khớp đúng chỉ dẫn của đề \"copy thư mục ảnh... vào thư mục public,\" không trỏ tới gốc backend. Tuỳ chọn dropdown category lấy từ giá trị <code>category.name</code> thật có trong tutorial đã tải (thuộc tính [name] của Category theo yêu cầu), không phải danh sách cứng, nên vẫn đúng nếu category đổi.</p>",
          "rubric": [
            {
              "id": "loads_all_tutorials_on_open",
              "criterion": "Fetches and displays all tutorials when the page first loads.|||Tải và hiện tất cả tutorial ngay khi trang mở lần đầu.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "correct_layout",
              "criterion": "Renders the correct layout: page title \"Tutorial Online Courses\" and a grid of tutorial cards with thumbnail, title, author, and category.|||Hiện đúng bố cục: tiêu đề \"Tutorial Online Courses\" và lưới thẻ tutorial có thumbnail, title, author, category.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "comment_count_shown",
              "criterion": "Each tutorial card correctly counts and displays the number of comments.|||Mỗi thẻ tutorial đếm và hiện đúng số lượng comment.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "category_dropdown_from_data",
              "criterion": "The filter dropdown is populated from the actual category name attribute of the loaded data (not hardcoded), with the \"-- Select category to filter --\" placeholder option.|||Dropdown lọc lấy dữ liệu từ đúng thuộc tính name category của dữ liệu đã tải (không cứng), có option mặc định \"-- Select category to filter --\".",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "javascript",
          "prompt": "<p><strong>Question 2.2 (1 point):</strong> when a user selects a Category from the dropdown list, filter out all Tutorials of that Category (e.g. selecting \"Big Data & Analytics\" shows only Google Charts Tutor..., Apache Storm Tutori..., Learn Power BA..., Kibana Tutorial..., Big Data Analytics...).</p>|||<p><strong>Câu 2.2 (1 điểm):</strong> khi người dùng chọn 1 Category từ dropdown, lọc ra mọi Tutorial thuộc Category đó (VD chọn \"Big Data & Analytics\" chỉ hiện Google Charts Tutor..., Apache Storm Tutori..., Learn Power BA..., Kibana Tutorial..., Big Data Analytics...).</p>",
          "starterCode": "// (continuing TutorialsPage.jsx from Question 2.1)\nconst filteredTutorials = /* ---------- Student's code starts from here ---------- */ tutorials;",
          "sampleSolution": "// (continuing TutorialsPage.jsx from Question 2.1)\nconst filteredTutorials = selectedCategory\n    // ---------- Student's code starts from here ----------\n    ? tutorials.filter((t) => t.category?.name === selectedCategory)\n    : tutorials;\n    // -------------------------------------------------------",
          "explanation": "<p>Filtering is done client-side against the already-loaded <code>tutorials</code> state (no extra API call needed) by comparing each tutorial's populated <code>category.name</code> to the dropdown's selected value; an empty selection (\"-- Select category to filter --\") shows every tutorial unfiltered.</p>|||<p>Lọc thực hiện phía client trên state <code>tutorials</code> đã tải sẵn (không cần gọi API thêm), so <code>category.name</code> đã populate của mỗi tutorial với giá trị dropdown đã chọn; chọn rỗng (\"-- Select category to filter --\") hiện mọi tutorial không lọc.</p>",
          "rubric": [
            {
              "id": "filters_by_selected_category",
              "criterion": "Correctly filters the displayed tutorials to only those matching the selected category name.|||Lọc đúng tutorial hiển thị chỉ còn khớp tên category đã chọn.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "no_selection_shows_all",
              "criterion": "Shows all tutorials again when the placeholder (\"-- Select category to filter --\") is selected.|||Hiện lại tất cả tutorial khi chọn placeholder (\"-- Select category to filter --\").",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2.3 (1.5 points):</strong> when the user clicks the \"comments\" link, the app navigates to a URL displaying the list of comments of the corresponding Tutorial. Table columns: Id, Username, Text, Create At.</p><p><i>Note: the paper's own text describes the target route inconsistently — the prose says <code>http://localhost:3000/posts/:id/comments</code>, but the \"Example rows at\" line and Figure 6's own caption both use <code>http://localhost:3000/tutorials/:id/comments</code>. The route used below is <code>/tutorials/:id/comments</code>, matching the data model (Tutorials, not \"posts\") and the majority of the paper's own references.</i></p>|||<p><strong>Câu 2.3 (1.5 điểm):</strong> khi người dùng bấm link \"comments\", app điều hướng tới URL hiện danh sách comment của Tutorial tương ứng. Cột bảng: Id, Username, Text, Create At.</p><p><i>Lưu ý: văn bản đề gốc tự mâu thuẫn khi mô tả route đích — phần chữ ghi <code>http://localhost:3000/posts/:id/comments</code>, nhưng dòng \"Example rows at\" và chú thích Figure 6 đều dùng <code>http://localhost:3000/tutorials/:id/comments</code>. Route dùng dưới đây là <code>/tutorials/:id/comments</code>, khớp mô hình dữ liệu (Tutorials, không phải \"posts\") và đa số tham chiếu của chính đề.</i></p>",
          "starterCode": "// ===== src/pages/CommentsPage.jsx =====\nimport { useEffect, useState } from \"react\";\nimport { useParams } from \"react-router-dom\";\n\nfunction CommentsPage() {\n    const { id } = useParams();\n    const [comments, setComments] = useState([]);\n\n    useEffect(() => {\n        // ---------- Student's code starts from here ----------\n\n        // -------------------------------------------------------\n    }, [id]);\n\n    return (\n        <table>\n            {/* ---------- Student's code starts from here ---------- */}\n\n            {/* ------------------------------------------------------- */}\n        </table>\n    );\n}\n\nexport default CommentsPage;\n\n// ===== src/App.jsx (routing) =====\nimport { BrowserRouter, Routes, Route } from \"react-router-dom\";\nimport TutorialsPage from \"./pages/TutorialsPage\";\nimport CommentsPage from \"./pages/CommentsPage\";\n\nfunction App() {\n    return (\n        <BrowserRouter>\n            <Routes>\n                <Route path=\"/\" element={<TutorialsPage />} />\n                {/* ---------- Student's code starts from here ---------- */}\n\n                {/* ------------------------------------------------------- */}\n            </Routes>\n        </BrowserRouter>\n    );\n}\n\nexport default App;",
          "sampleSolution": "// ===== src/pages/CommentsPage.jsx =====\nimport { useEffect, useState } from \"react\";\nimport { useParams } from \"react-router-dom\";\nimport axios from \"axios\";\n\nconst API_BASE = \"http://localhost:9999\";\n\nfunction CommentsPage() {\n    const { id } = useParams();\n    const [comments, setComments] = useState([]);\n\n    useEffect(() => {\n        // ---------- Student's code starts from here ----------\n        axios.get(`${API_BASE}/tutorials/${id}/comments`).then((res) => setComments(res.data));\n        // -------------------------------------------------------\n    }, [id]);\n\n    return (\n        <table>\n            <thead>\n                <tr>\n                    <th>Id</th>\n                    <th>Username</th>\n                    <th>Text</th>\n                    <th>Create At</th>\n                </tr>\n            </thead>\n            <tbody>\n                {/* ---------- Student's code starts from here ---------- */}\n                {comments.map((c) => (\n                    <tr key={c._id}>\n                        <td>{c._id}</td>\n                        <td>{c.username}</td>\n                        <td>{c.text}</td>\n                        <td>{c.createAt}</td>\n                    </tr>\n                ))}\n                {/* ------------------------------------------------------- */}\n            </tbody>\n        </table>\n    );\n}\n\nexport default CommentsPage;\n\n// ===== src/App.jsx (routing) =====\nimport { BrowserRouter, Routes, Route } from \"react-router-dom\";\nimport TutorialsPage from \"./pages/TutorialsPage\";\nimport CommentsPage from \"./pages/CommentsPage\";\n\nfunction App() {\n    return (\n        <BrowserRouter>\n            <Routes>\n                <Route path=\"/\" element={<TutorialsPage />} />\n                {/* ---------- Student's code starts from here ---------- */}\n                <Route path=\"/tutorials/:id/comments\" element={<CommentsPage />} />\n                {/* ------------------------------------------------------- */}\n            </Routes>\n        </BrowserRouter>\n    );\n}\n\nexport default App;",
          "explanation": "<p>The \"comments\" link on each tutorial card (from Question 2.1) is a <code>&lt;Link to={`/tutorials/${tutorial._id}/comments`}&gt;</code>, matching this route exactly. <code>useParams()</code> reads the <code>:id</code> segment to call <code>GET /tutorials/:id/comments</code> (from Question 1.2), and the response array is rendered directly into table rows with the 4 required columns.</p>|||<p>Link \"comments\" trên mỗi thẻ tutorial (từ Câu 2.1) là <code>&lt;Link to={`/tutorials/${tutorial._id}/comments`}&gt;</code>, khớp đúng route này. <code>useParams()</code> đọc đoạn <code>:id</code> để gọi <code>GET /tutorials/:id/comments</code> (từ Câu 1.2), mảng phản hồi render trực tiếp thành các dòng bảng với đủ 4 cột yêu cầu.</p>",
          "rubric": [
            {
              "id": "correct_navigation",
              "criterion": "Clicking the comments link navigates to the correct per-tutorial comments route (consistent with the corresponding Tutorial's id).|||Bấm link comments điều hướng đúng route comment theo từng tutorial (khớp id đúng Tutorial tương ứng).",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "correct_table_columns",
              "criterion": "Renders a table with exactly the 4 required columns: Id, Username, Text, Create At.|||Render bảng đúng đủ 4 cột yêu cầu: Id, Username, Text, Create At.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "data_fetched_and_displayed",
              "criterion": "Correctly fetches and displays the comments belonging to that specific tutorial.|||Tải và hiện đúng comment thuộc đúng tutorial cụ thể đó.",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        }
      ]
    }
  ]
};
