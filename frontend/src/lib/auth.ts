import NextAuth from "next-auth";
import { goiBackend, maNhaCungCap } from '@/lib/backendServer';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import AppleProvider from "next-auth/providers/apple";
import { biMatApple } from "@/lib/appleSecret";
import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/next-auth";

/* ─── OAuth env validation (fail-fast khi user click sign-in) ──────────
 * Trước đây: `clientId: process.env.GOOGLE_CLIENT_ID ?? ""` — khi deploy thiếu
 * env, URL OAuth vẫn build được nhưng thiếu `client_id` → Google trả 400,
 * GitHub trả 404, user thấy lỗi "invalid_request" không rõ nguyên nhân.
 *
 * Bây giờ: warn ở startup nếu env rỗng (giúp dev phát hiện sớm qua Vercel
 * / Docker logs), và callback `signIn` từ chối ngay khi user click provider
 * nếu env chưa set, trả error thân thiện thay vì redirect ra Google rồi mới
 * lỗi 400.
 */
function warnMissingEnv(name: string): void {
  if (!process.env[name] || process.env[name]!.trim() === '') {
    // eslint-disable-next-line no-console
    console.error(
      `[nextauth] Missing required env var: ${name}. ` +
      `OAuth provider sẽ fail khi user click sign-in. ` +
      `Set trong /opt/cuonghoangdev/.env (VPS) hoặc .env.local (local dev).`
    );
  }
}

warnMissingEnv('GOOGLE_CLIENT_ID');
warnMissingEnv('GOOGLE_CLIENT_SECRET');
warnMissingEnv('GITHUB_CLIENT_ID');
warnMissingEnv('GITHUB_CLIENT_SECRET');
warnMissingEnv('AUTH_SECRET');

/* Apple KHÔNG bắt buộc — thiếu thì nút Apple đơn giản là không hiện ra. Vì thế
 * nó dùng `biMatApple()` (trả null khi chưa cấu hình) chứ không `warnMissingEnv`:
 * một dòng đỏ mỗi lần khởi động cho một tính năng cố ý chưa bật là cách nhanh
 * nhất để người ta thôi đọc log. */
const APPLE_SECRET = biMatApple();

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * NextAuth config — used ONLY for OAuth providers (Google, GitHub).
 *
 * The ONLY source of truth for user ROLES is the Node.js backend database.
 * On EVERY JWT callback (sign-in AND token refresh), we call the backend to get
 * the FRESH role. No role is ever trusted from a cached NextAuth JWT.
 *
 * For credentials users: NextAuth is NOT used. Backend auth is handled by
 * /api/auth/login which sets a backend_token httpOnly cookie.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
    /* Apple chỉ được nạp KHI ĐÃ CÓ khoá. Nạp sẵn rồi để trống bí mật thì
     * `/api/auth/signin/apple` vẫn tồn tại và trả `invalid_client` — một nút
     * bấm được nhưng luôn hỏng, tệ hơn hẳn một nút không có. */
    ...(APPLE_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID ?? "",
            clientSecret: APPLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    /**
     * signIn() chạy TRƯỚC khi NextAuth tạo session — dùng để chặn OAuth khi env
     * chưa được cấu hình đúng. Trước đây thiếu check này, user click Google →
     * redirect sang Google → Google trả 400 vì client_id rỗng.
     */
    async signIn({ account, profile }) {
      if (!account || account.provider === "credentials") return true;

      // Block ngay nếu OAuth secret chưa set
      if (account.provider === "google") {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
          throw new Error(
            "Google OAuth chưa được cấu hình. Vui lòng liên hệ admin."
          );
        }
      }
      if (account.provider === "github") {
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
          throw new Error(
            "GitHub OAuth chưa được cấu hình. Vui lòng liên hệ admin."
          );
        }
      }

      if (account.provider === "apple" && !APPLE_SECRET) {
        throw new Error("Apple Sign-In chưa được cấu hình. Vui lòng liên hệ admin.");
      }

      // Sanity check: email phải có
      if (!profile?.email) {
        throw new Error(
          `Cannot sign in with ${account.provider}: no email returned. ` +
          `Make sure ${account.provider} account has a verified email.`
        );
      }

      return true;
    },
    /**
     * jwt() is called on EVERY sign-in AND on every token refresh.
     * We ALWAYS fetch the role from the backend DB — never trust the cached token role.
     */
    async jwt({ token, account, trigger }) {
      const email = token.email as string | undefined;
      if (!email) return token;

      try {
        let endpoint: string;
        let options: RequestInit = { cache: "no-store" };

        if (account && account.provider !== "credentials") {
          // Fresh OAuth sign-in: create/find user in backend and get role
          endpoint = `/api/v1/auth/oauth/register`;
          options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              fullName: (token.name as string) ?? email.split("@")[0],
              provider: account.provider,
              // Có đường lùi: `token.sub` rỗng thì backend trả 422 và tài khoản
              // KHÔNG BAO GIỜ được tạo — xem `maNhaCungCap`.
              providerId: maNhaCungCap(token.sub, account.provider, email),
            }),
            cache: "no-store",
          };
        } else {
          // Token refresh (account == null): query role by email. This is a
          // server→server call; send the internal secret so the backend
          // accepts it while rejecting external callers. (Server-side env,
          // never exposed to the browser.)
          endpoint = `/api/v1/auth/role?email=${encodeURIComponent(email)}`;
          options = {
            cache: "no-store",
            headers: { "X-Internal-Token": process.env.INTERNAL_API_SECRET ?? "" },
          };
        }

        const res = await goiBackend(endpoint, options);
        if (!res.ok) {
          /* ⛔ ĐĂNG NHẬP OAUTH MÀ BACKEND TỪ CHỐI = KHÔNG CÓ TÀI KHOẢN.
           *
           * Trước đây chỗ này chỉ `console.warn` rồi `return token`, nên
           * NextAuth vẫn cấp phiên: người dùng thấy mình đã đăng nhập, còn
           * backend thì chưa hề có tài khoản nào. Hệ quả (19/08/2026): tìm
           * không ra user, trang cá nhân quay mãi, mã Pro báo sai — ba triệu
           * chứng ở ba chỗ khác nhau, không chỗ nào chỉ về đây.
           *
           * Đánh dấu vào token để `session` biết mà báo cho người dùng, thay
           * vì im lặng giả vờ mọi thứ ổn. */
          const chiTiet = await res.text().catch(() => '');
          console.error(`[nextauth] backend từ chối ${res.status} cho ${email}: ${chiTiet.slice(0, 200)}`);
          token.backendLoi = `HTTP ${res.status}`;
          return token;
        }
        delete (token as Record<string, unknown>).backendLoi;

        const data = await res.json();
        const freshRole = normalizeRole(data.data?.primaryRole ?? data.data?.role ?? "USER");
        const freshVersion: number = data.data?.roleVersion ?? 0;

        // (debug log removed 2026-06-17 — role/ver visible to every browser)

        token.id = String(data.data?.id ?? token.id ?? token.sub ?? "");
        token.role = freshRole;
        token.username = (data.data?.username as string) ?? (token.username as string) ?? email.split("@")[0];
        token.backendRoleVersion = freshVersion;
      } catch (err) {
        // Đã thử nội bộ lẫn công khai, mỗi đường 3 lần — tới đây là hỏng thật.
        console.error("[nextauth] backend unreachable:", err);
        token.backendLoi = 'unreachable';
      }

      if (account && account.provider !== "credentials") {
        token.isSocialUser = true;
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        /* Đưa lỗi backend RA TỚI giao diện. Không có trường này thì phiên
         * trông y hệt một phiên lành lặn, và người dùng chỉ phát hiện có gì
         * đó sai khi mọi tính năng lần lượt hỏng theo những cách khác nhau. */
        (session.user as unknown as Record<string, unknown>).backendLoi = token.backendLoi ?? null;
        session.user.role = (token.role as string) as any ?? "USER";
        session.user.username = (token.username as string | null) ?? null;
        session.user.isSocialUser = (token.isSocialUser as boolean) ?? true;
        session.user.provider = (token.provider as string | null) ?? null;
        // Expose roleVersion so client components can detect role changes
        (session.user as any).roleVersion = (token.backendRoleVersion as number) ?? 0;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function normalizeRole(role: string | null | undefined): UserRole {
  if (!role) return "USER";
  const r = role.toUpperCase();
  if (r === "ADMIN" || r === "ROLE_ADMIN") return "ADMIN";
  if (r === "MODERATOR" || r === "ROLE_MODERATOR") return "MODERATOR";
  if (r === "EDITOR" || r === "ROLE_EDITOR") return "EDITOR";
  return "USER";
}
