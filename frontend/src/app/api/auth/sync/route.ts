import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authApi } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/sync
 * Syncs a NextAuth social user to the Node.js backend so they appear
 * in the admin user list and can be managed alongside regular users.
 *
 * Only social users (google, github, facebook) need to be synced.
 * Credentials users are already managed by the backend directly.
 * No Prisma/DB dependency — NextAuth social users are JWT-only.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // A social user is identified by having a provider (Google/GitHub/Facebook)
    // vs credentials which have provider === undefined in the JWT
    const isSocial = (session.user as any).isSocialUser === true ||
                     !!(session.user as any).provider;

    if (!isSocial) {
      return NextResponse.json({
        success: true,
        message: "User is not a social user — no sync needed",
        synced: false,
      });
    }

    const backendUser = {
      username: (session.user as any).username || session.user.email?.split("@")[0] || `social_${session.user.id.slice(0, 8)}`,
      email: session.user.email || "",
      password: `social_${session.user.id.slice(0, 12)}`,
      fullName: session.user.name || "",
    };

    // Try to register in backend (will fail silently if user already exists)
    try {
      await authApi.register(backendUser);
    } catch (err: any) {
      // 409 Conflict = user already exists — that's fine
      if (err?.response?.status !== 409) {
        console.warn("[AuthSync] Failed to sync user to backend:", err?.response?.data?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User synced successfully",
      synced: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role,
        provider: (session.user as any).provider,
      },
    });
  } catch (error) {
    console.error("[AuthSync] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
