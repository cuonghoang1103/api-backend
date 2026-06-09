import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * POST /api/auth/login
 *
 * Credentials login — calls the Node.js backend directly.
 * Sets backend_token cookie so all /api/v1/* proxy calls are authenticated.
 *
 * For credentials users: NextAuth session is NOT needed — the backend_token cookie
 * is sufficient for auth. NextAuth is used only for OAuth sessions.
 */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    // #region agent log
    fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'pre-fix',hypothesisId:'H1,H2',location:'frontend/src/app/api/auth/login/route.ts:18',message:'auth login proxy received request',data:{username,hasPassword:!!password,backendUrl:BACKEND_URL},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Call Node.js backend
    console.log("[login] Calling backend:", `${BACKEND_URL}/api/v1/auth/login`);
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log("[login] Backend response status:", res.status);
    // #region agent log
    fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'pre-fix',hypothesisId:'H1,H2,H3',location:'frontend/src/app/api/auth/login/route.ts:35',message:'auth login backend responded',data:{backendUrl:BACKEND_URL,status:res.status,ok:res.ok,contentType:res.headers.get('content-type')},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!res.ok) {
      let message = 'Incorrect username or password';
      let status = res.status;
      try {
        const err = await res.json();
        message = err.message ?? message;
      } catch {
        // use default
      }
      return NextResponse.json({ success: false, message }, { status });
    }

    const data = await res.json();
    const { token, userId, email, role } = data.data ?? {};
    // #region agent log
    fetch('http://127.0.0.1:7305/ingest/6d5fb7f6-cb51-4802-937b-44b6d8aa05b5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b41c56'},body:JSON.stringify({sessionId:'b41c56',runId:'pre-fix',hypothesisId:'H3,H4',location:'frontend/src/app/api/auth/login/route.ts:50',message:'auth login parsed backend payload',data:{success:!!data?.success,hasData:!!data?.data,hasToken:!!token,userId:userId ?? null,role:role ?? null,emailDomain:typeof email==='string'&&email.includes('@')?email.split('@')[1]:null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 500 }
      );
    }

    // Store backend JWT in httpOnly cookie (7 days)
    const response = NextResponse.json({
      success: true,
      data: { userId, username, email, role, token },
    });

    response.cookies.set("backend_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // admin_role cookie: httpOnly=true vì middleware Edge Runtime vẫn đọc được raw cookie header
    // Giá trị: "1" cho admin, "0" cho non-admin
    response.cookies.set("admin_role", role === "ROLE_ADMIN" ? "1" : "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[login] Error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
