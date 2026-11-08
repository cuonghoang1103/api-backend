/**
 * Phiên đăng nhập HẾT HẠN THẬT ⇒ đăng xuất gọn, đưa về /login kèm lời nhắc tiếng Việt và đường quay lại.
 *
 * Vì sao có file này (08/11/2026, nhiều người dùng gặp): `auth-storage` (zustand persist) giữ
 * `isAuthenticated = true` trong localStorage VÔ HẠN, còn cookie httpOnly `backend_token` chỉ sống 7 ngày.
 * Vắng mặt quá 7 ngày ⇒ avatar vẫn hiện như đang đăng nhập, nhưng mọi request trả 401
 * "No authentication token provided", `/api/auth/refresh` cũng 401 (không còn cookie để làm mới) — và
 * interceptor cũ chỉ `reject` ⇒ thông báo đỏ tiếng Anh ở mọi trang, người dùng tưởng web hỏng và bỏ đi;
 * cách duy nhất là tự bấm Đăng xuất rồi đăng nhập lại.
 *
 * Chỉ chạy khi giao diện ĐANG tin là đã đăng nhập (khách vào trang cần đăng nhập không bị đá đi), chỉ một
 * lần mỗi lần tải trang (nhiều request 401 cùng lúc dùng chung), và không chạy trên chính trang /login.
 */
let dangXuLy = false;

export async function xuLyHetPhien(): Promise<void> {
  if (typeof window === 'undefined' || dangXuLy) return;
  const { useAuthStore } = await import('@/store/authStore');
  if (!useAuthStore.getState().isAuthenticated) return;
  dangXuLy = true;

  const duong = window.location.pathname;
  const quayVe = duong.startsWith('/login') ? '' : duong + window.location.search;
  const veTrang = `/login?error=session_expired${quayVe ? `&redirect=${encodeURIComponent(quayVe)}` : ''}`;

  // Phiên NextAuth (người đăng nhập Google/GitHub/Apple) cũng phải bỏ, không thì nó dựng lại trạng thái cũ.
  try {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
  } catch { /* không có phiên NextAuth */ }

  // Cùng trình tự với nút Đăng xuất (xoá cookie phụ, store, cache tin nhắn…), chỉ khác trang đích.
  useAuthStore.getState().logout(veTrang);
}

/** Mốc lần gia hạn gần nhất (localStorage) — xem `giaHanPhienNeuCan`. */
const KHOA_GIA_HAN = 'ct_phien_gia_han_luc';
const CACH_GIA_HAN_MS = 12 * 60 * 60 * 1000;

/**
 * Gia hạn trượt: mỗi lần mở web (tối đa 12 giờ một lần) xin cookie mới 7 ngày ⇒ người vào web ít nhất mỗi tuần
 * một lần KHÔNG BAO GIỜ gặp hết phiên. Trước đây cookie chỉ được cấp lại khi JWT 24 giờ đã hết hạn và một request
 * vừa 401, nên mốc 7 ngày tính từ lần đăng nhập/làm mới cuối, không phải từ lần ghé cuối.
 * Cookie đã mất từ trước ⇒ biết NGAY lúc mở trang (thay vì ở cú bấm đầu tiên) và đăng xuất gọn.
 */
export async function giaHanPhienNeuCan(): Promise<void> {
  if (typeof window === 'undefined') return;
  let lanCuoi = 0;
  try { lanCuoi = Number(localStorage.getItem(KHOA_GIA_HAN) || 0); } catch { /* chế độ riêng tư */ }
  if (Date.now() - lanCuoi < CACH_GIA_HAN_MS) return;

  const kq = await lamMoiPhien();
  if (kq === 'ok') {
    try { localStorage.setItem(KHOA_GIA_HAN, String(Date.now())); } catch { /* bỏ qua */ }
  } else if (kq === 'het') {
    await xuLyHetPhien();
  }
}

/**
 * Gọi `/api/auth/refresh` (route Next cấp lại JWT + đặt lại cookie 7 ngày).
 * 'ok' = đã làm mới · 'het' = phiên chết thật (401/403) · 'loi' = mạng/máy chủ trục trặc — KHÔNG đăng xuất vì
 * một lần mất mạng.
 */
let dangLamMoi: Promise<'ok' | 'het' | 'loi'> | null = null;
export function lamMoiPhien(): Promise<'ok' | 'het' | 'loi'> {
  if (!dangLamMoi) {
    dangLamMoi = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then((r): 'ok' | 'het' | 'loi' => (r.ok ? 'ok' : r.status === 401 || r.status === 403 ? 'het' : 'loi'))
      .catch((): 'loi' => 'loi')
      .finally(() => { dangLamMoi = null; });
  }
  return dangLamMoi;
}
