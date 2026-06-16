import type { DefaultSession } from "next-auth";
import type { JWT } from "@auth/core/jwt";

// ─── NextAuth v5 type extensions ───────────────────────────────────────────────

type UserRole = "USER" | "ADMIN" | "MODERATOR" | "EDITOR";
export type { UserRole };

// Extend the next-auth Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      username?: string | null;
      isSocialUser: boolean;
      provider?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    username?: string | null;
    isSocialUser?: boolean;
    provider?: string | null;
  }
}

// Extend the JWT token with our custom fields
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    username?: string | null;
    isSocialUser: boolean;
    provider?: string;
  }
}
