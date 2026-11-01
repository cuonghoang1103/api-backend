// policy.js — bài 6.2: MỘT chỗ trả lời "người này có được làm việc này với BẢN GHI này không?"
import { HttpError } from './http.js';
import { VULN } from './vuln.js';

const isManager = (u) => u.role === 'LAB_MANAGER';
export const POLICIES = {
  'booking:read': (u, b) => isManager(u) || b.userId === u.id,
  'booking:cancel': (u, b) => isManager(u) || b.userId === u.id,
  'device:write': (u) => isManager(u),
  'issue:resolve': (u) => isManager(u),
  'waitlist:cancel': (u, e) => isManager(u) || e.userId === u.id,   // Lab 7
};
export const can = (user, action, resource) => Boolean(POLICIES[action]?.(user, resource));

// Không được ⇒ 404 như thể bản ghi không tồn tại: không lộ cả việc "có lượt đặt bk_2"
export function authorize(req, action, resource, notFound) {
  if (VULN && action === 'booking:read') return;                  // Lab 6: lỗ BOLA được bật lại để bộ kiểm thấy ĐỎ
  if (!can(req.user, action, resource)) throw notFound;
}
