// cfg.js — "ứng dụng" khởi động hỏng với một thông báo lỗi chung chung (rất giống đời thật).
const fs = require('fs');
const path = require('path');

const file = path.join(process.env.APP_HOME || '/srv/app', 'config', 'settings.json');
try {
  JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log('started');
} catch {
  console.error('Error: could not load configuration');
  process.exit(1);
}
