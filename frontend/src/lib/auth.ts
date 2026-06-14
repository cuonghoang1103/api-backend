import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

/* ─── OAuth env validation (fail-fast khi user click sign-in) ──────────
 * Trước đây: `clientId: process.env.GOOGLE_CLIENT_ID ?? ""` — khi deploy thiếu
 * env, URL OAuth vẫn build được nhưng thiếu `client_id` → Google trả 400,
 * GitHub trả 404, user thấy lỗi "invalid_request" không rõ nguyên nhân.
 *
 * Bây giờ: provider CHỈ được khởi tạo nếu env tồn tại. Nếu thiếu, callback
 * `signIn` sẽ từ chối và trả lỗi rõ ràng cho user. Log cảnh báo ở startup.
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
          endpoint = `${BACKEND_URL}/api/v1/auth/oauth/register`;
          options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              fullName: (token.name as string) ?? email.split("@")[0],
              provider: account.provider,
              providerId: token.sub ?? "",
            }),
            cache: "no-store",
          };
        } else {
          // Token refresh (account == null): query role by email
          endpoint = `${BACKEND_URL}/api/v1/auth/role?email=${encodeURIComponent(email)}`;
        }

        const res = await fetch(endpoint, options);
        if (!res.ok) {
          console.warn(`[nextauth] backend returned ${res.status}, keeping current token`);
          return token;
        }

        const data = await res.json();
        const freshRole = normalizeRole(data.data?.primaryRole ?? data.data?.role ?? "USER");
        const freshVersion: number = data.data?.roleVersion ?? 0;

        console.log(`[nextauth] ${account ? "signIn" : "refresh"} → role=${freshRole}, version=${freshVersion}`);

        token.id = String(data.data?.id ?? token.id ?? token.sub ?? "");
        token.role = freshRole;
        token.username = (data.data?.username as string) ?? (token.username as string) ?? email.split("@")[0];
        token.backendRoleVersion = freshVersion;
      } catch (err) {
        console.error("[nextauth] backend unreachable:", err);
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

function normalizeRole(role: string | null | undefined): string {
  if (!role) return "USER";
  const r = role.toUpperCase();
  if (r === "ADMIN" || r === "ROLE_ADMIN") return "ADMIN";
  if (r === "MODERATOR" || r === "ROLE_MODERATOR") return "MODERATOR";
  if (r === "EDITOR" || r === "ROLE_EDITOR") return "EDITOR";
  return "USER";
}
