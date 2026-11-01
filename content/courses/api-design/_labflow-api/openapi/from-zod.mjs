// from-zod.mjs — bài 7.4: code-first — sinh JSON Schema thẳng từ lược đồ Zod mà server đang dùng
import { z } from 'zod';
import { BookingCreateV2, IssueCreate } from '../src/schemas.js';

// regex ngày giờ Zod sinh ra dài ~400 ký tự — thu gọn khi IN cho dễ đọc (lược đồ thật vẫn đủ)
const short = (k, v) => (k === 'pattern' && v.length > 40 ? `…(${v.length} ký tự)` : v);
console.log(JSON.stringify(z.toJSONSchema(BookingCreateV2, { target: 'draft-2020-12' }), short, 2));
console.log(JSON.stringify(z.toJSONSchema(IssueCreate), null, 1).split('\n').length, 'dòng cho IssueCreate');
