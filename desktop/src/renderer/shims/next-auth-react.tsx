/**
 * Shim `next-auth/react` cho các trang web dùng lại trong app desktop (08/11/2026).
 *
 * Trước đây app không ghim gói này ⇒ trang web nạp `next-auth/react` THẬT, mà ở app không có
 * `<SessionProvider>` (nó nằm trong `app/layout.tsx` của web — app không dùng layout đó). `useSession()`
 * trả `undefined` ⇒ `const { status } = useSession()` của trang chi tiết khoá học ném TypeError và cả
 * trang sập ("trang nổ"). Đo thật bằng app đã build, tài khoản thử, 08/11/2026.
 *
 * App đăng nhập bằng phiên RIÊNG và nạp nó vào `useAuthStore` của cây web (`auth/session.tsx` →
 * `setAuth`), nên ở đây suy trạng thái từ chính kho đó — một nguồn sự thật cho cả cây web.
 * `signIn`/`signOut` không có nghĩa trong app (đăng nhập/đăng xuất là việc của vỏ app) ⇒ no-op.
 */
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

type TrangThai = 'authenticated' | 'unauthenticated' | 'loading';
type PhienNextAuth = { user?: { id?: number | string | undefined; name?: string | null; email?: string | null; image?: string | null } } | null;

type KhoXacThuc = {
  isAuthenticated?: boolean;
  user?: { id?: number | string; username?: string; fullName?: string | null; email?: string | null; avatarUrl?: string | null } | null;
};

export function useSession(): { data: PhienNextAuth; status: TrangThai; update: () => Promise<null> } {
  const kho = (useAuthStore as unknown as <T>(chon: (s: KhoXacThuc) => T) => T);
  const daDangNhap = kho((s) => !!s.isAuthenticated && !!s.user);
  const u = kho((s) => s.user ?? null);
  return {
    data: daDangNhap && u
      ? { user: { id: u.id, name: u.fullName || u.username || null, email: u.email ?? null, image: u.avatarUrl ?? null } }
      : null,
    status: daDangNhap ? 'authenticated' : 'unauthenticated',
    update: async () => null,
  };
}

export function SessionProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export async function signIn(): Promise<undefined> { return undefined; }
export async function signOut(): Promise<undefined> { return undefined; }
export async function getSession(): Promise<null> { return null; }
