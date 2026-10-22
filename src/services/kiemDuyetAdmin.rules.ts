/**
 * Tài khoản quản trị tối cao — không khoá được từ màn kiểm duyệt (cùng danh sách `isProtectedAccount` trong
 * admin.routes.ts; tách ra đây để service dùng được mà không nạp cả router).
 */
const TEN = ['cuong03dx', 'cuong123'];
const EMAIL = ['cuong03dx@gmail.com'];

export function laTaiKhoanToiCao(u: { username?: string | null; email?: string | null }): boolean {
  return (!!u.username && TEN.includes(u.username.toLowerCase())) || (!!u.email && EMAIL.includes(u.email.toLowerCase()));
}
