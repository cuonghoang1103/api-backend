/**
 * Shim cho `@/lib/og/*` của web (UX-D 09/10/2026).
 *
 * Các trang web có `generateMetadata`/ảnh OG (khoá học, blog, projects, CT Work…) import `@/lib/og/*`,
 * mà `og.tsx` đọc phông bằng `node:fs` + `next/headers` — chỉ chạy được ở MÁY CHỦ. App desktop gói lại
 * nguyên các trang đó nên Rollup vấp `"readFile" is not exported by "__vite-browser-external"` và cả ba
 * bản dựng (mac/win/linux) chết (phát hành 0.5.171 lần 1).
 *
 * App không bao giờ gọi `generateMetadata` hay dựng ảnh OG ⇒ mọi hàm ở đây là rỗng, chỉ để biên dịch được.
 * Thêm export mới vào `frontend/src/lib/og/*` thì thêm tên tương ứng ở đây (thiếu là lỗi lúc dựng app,
 * không im lặng).
 */
const rong = (): undefined => undefined;
const rongAsync = async (): Promise<null> => null;

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_FONT = 'Inter';
export const OG_SITE = '';
export const ctWorkLogo = '';
export const genericImage = rong;
export const truncate = (s: string) => s;

export const absMedia = (s?: string | null) => s ?? null;
export const apiData = rongAsync;
export const coverImage = rong;
export const fetchCard = rongAsync;
export const initialsOf = (s?: string | null) => (s ?? '').slice(0, 2).toUpperCase();
export const inviteImage = rong;
export const inviteMetadata = async () => ({});
export const lockedImage = rong;
export const ogFonts = async () => [];
export const ogImageOr = (_a?: unknown, b?: unknown) => b;
export const plain = (s?: string | null) => s ?? '';
export const remoteImage = rongAsync;
export const shareImage = rong;
export const shareMetadata = async () => ({});
export const siteImage = rong;
export const unavailableImage = rong;
export const workspaceMetadata = async () => ({});

export type InviteCardData = Record<string, unknown>;
export type ShareCardData = Record<string, unknown>;
export type SiteCardInput = Record<string, unknown>;
