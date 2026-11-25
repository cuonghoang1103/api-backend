// Ai đó "nâng thư viện cho mới" bằng npm install nanoid@latest — repo vẫn là CommonJS
const { nanoid } = require('nanoid');
console.log('ma phieu: ' + nanoid(8).length + ' ky tu');
