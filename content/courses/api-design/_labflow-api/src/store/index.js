// store/index.js — chọn kho theo LABFLOW_STORE (bài 12.3). Route chỉ biết `store.x()`, không biết dữ liệu nằm ở đâu.
import { config } from '../config.js';

const base = config.store === 'pg' ? await import('./pg.js') : await import('./memory.js');
// Lab 12: báo hỏng (issues) có module riêng — bạn viết issues-pg.js cùng giao diện với issues-memory.js
const issues = config.store === 'pg' ? await import('./issues-pg.js') : await import('./issues-memory.js');
export const store = { ...base, ...issues };
