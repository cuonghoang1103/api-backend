/**
 * Exp Hub guide for SDN302 — Node/Express/MongoDB dev environment (Vietnamese).
 * Academy SDN302 bài 0.4 links its "Cài đặt" card to /exp-hub/sdn302-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Postman + MongoDB Compass + MongoDB Atlas.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'sdn302-cai-dat-moi-truong',
    title: 'SDN302 — Cài môi trường Node.js + Express + MongoDB + Postman',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ môi trường back-end cho SDN302: Node.js LTS, VS Code, Postman, MongoDB Compass và kết nối MongoDB Atlas (cloud miễn phí) — kèm lệnh kiểm tra và một app Express + Mongoose tối thiểu để chạy thử.',
    referenceUrl: 'https://nodejs.org/en/download',
    noteContent: `
<h2>Cài môi trường cho SDN302 — Node.js + Express + MongoDB</h2>
<p>Làm theo thứ tự dưới đây một lần, mọi bài học và cả Practical Exam sẽ chạy trơn tru.</p>

<h3>1) Node.js LTS (20.x trở lên)</h3>
<p>Tải bản LTS từ nodejs.org (đi kèm npm). Kiểm tra sau khi cài bằng <code>node -v</code> và <code>npm -v</code>. Nếu cần nhiều phiên bản Node, dùng nvm (nvm-windows trên Windows).</p>

<h3>2) Visual Studio Code + extension</h3>
<p>Cài VS Code, rồi thêm extension: <b>ESLint</b>, <b>Prettier</b>, <b>REST Client</b> (hoặc dùng Postman riêng), và <b>MongoDB for VS Code</b>.</p>

<h3>3) Postman — test API không cần front-end</h3>
<p>Tải Postman để gửi GET/POST/PUT/DELETE tới API của bạn và xem response + status code. Tạo một Collection cho project để lưu lại các request.</p>

<h3>4) MongoDB — Atlas (khuyến nghị) hoặc local</h3>
<p><b>MongoDB Atlas</b> (miễn phí): tạo tài khoản → tạo một Cluster free → tạo user database → lấy connection string dạng <code>mongodb+srv://...</code>. Cách này chạy từ mọi nơi và giống production. Cài thêm <b>MongoDB Compass</b> (GUI) để xem dữ liệu trực quan. Nếu muốn local, cài MongoDB Community Server.</p>

<h3>5) Chạy thử một app Express + Mongoose tối thiểu</h3>
<p>Xem code block bên dưới — tạo project, cài package, và chạy <code>node server.js</code>. Mở Postman gọi <code>GET http://localhost:3000/api/health</code> để xác nhận server sống.</p>

<h3>Checklist đã sẵn sàng</h3>
<ul>
  <li>✓ <code>node -v</code> ra 20.x trở lên</li>
  <li>✓ VS Code + ESLint/Prettier</li>
  <li>✓ Postman gửi được request</li>
  <li>✓ Có connection string MongoDB Atlas + Compass xem được dữ liệu</li>
  <li>✓ Chạy được app Express mẫu và gọi /api/health thành công</li>
</ul>
`,
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ + tạo project',
        language: 'bash',
        code: `# Node phai la 20.x tro len
node -v
npm -v

# Tao project va cai package
mkdir sdn302-demo && cd sdn302-demo
npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon`,
      },
      {
        name: 'server.js — Express + Mongoose tối thiểu',
        language: 'javascript',
        code: `require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.error('DB error', e.message));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on ' + PORT));`,
      },
      {
        name: '.env (KHÔNG commit — thêm vào .gitignore)',
        language: 'bash',
        code: `# Lay tu MongoDB Atlas: Connect > Drivers
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/sdn302
JWT_SECRET=doi-thanh-mot-chuoi-ngau-nhien-dai
PORT=3000`,
      },
    ],
  },
};
