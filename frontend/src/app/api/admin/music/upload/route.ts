import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Compatibility upload proxy for older frontend bundles.
 *
 * Some deployed/stale bundles still POST to `/api/v1/music/admin/upload`,
 * which historically forwarded here. Keep this route functional so uploads
 * continue working even when the browser hits an older compiled bundle.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    const startedAt = Date.now();

    try {
        console.log('[music/upload compat] Request content-type:', request.headers.get('content-type'));
        const formData = await request.formData();
        const audio = formData.get("audio") as File | null;
        const title = (formData.get("title") as string) || "";
        const artist = (formData.get("artist") as string) || "";
        const durationSeconds = parseInt((formData.get("durationSeconds") as string) || "0", 10);
        const cover = formData.get("cover") as File | null;

        console.log('[music/upload compat] Incoming fields:', Array.from(formData.keys()));
        console.log('[music/upload compat] Incoming metadata:', {
            title,
            artist,
            durationSeconds,
            hasAudio: !!audio,
            audioName: audio?.name,
            audioType: audio?.type,
            audioSize: audio?.size,
            hasCover: !!cover,
            coverName: cover?.name,
        });

        if (!audio) {
            const fields: string[] = [];
            formData.forEach((_, key) => fields.push(key));
            console.error(`[music/upload compat] No "audio" field. Available: ${fields.join(", ")}`);
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        const MAX_SIZE = 100 * 1024 * 1024;
        if (audio.size > MAX_SIZE) {
            return NextResponse.json(
                { success: false, message: `File too large. Max 100MB. Your file is ${(audio.size / 1024 / 1024).toFixed(1)}MB.` },
                { status: 413 }
            );
        }

        let token = request.cookies.get("backend_token")?.value;
        const authHeader = request.headers.get("Authorization");
        if (!token && authHeader?.startsWith("Bearer ")) {
            token = authHeader.slice(7);
        }

        if (!token) {
            try {
                const { auth } = await import("@/lib/auth");
                const session = await auth();
                if (session?.user?.email) {
                    const user = session.user as any;
                    const res = await fetch(`${BACKEND_URL}/api/v1/auth/oauth/token`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: session.user.email,
                            fullName: session.user.name ?? session.user.email.split("@")[0],
                            provider: user.provider ?? "google",
                            providerId: user.id ?? "",
                        }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        token = data.data?.token ?? "";
                    }
                }
            } catch (error) {
                console.error('[music/upload compat] OAuth token fetch failed:', error);
            }
        }

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const backendFormData = new FormData();
        backendFormData.append("audio", audio);
        backendFormData.append("title", title);
        backendFormData.append("artist", artist);
        backendFormData.append("durationSeconds", String(durationSeconds));
        if (cover) {
            backendFormData.append("cover", cover);
        }

        console.log('[music/upload compat] Forwarding to backend:', `${BACKEND_URL}/api/v1/music/tracks`);
        const response = await fetch(`${BACKEND_URL}/api/v1/music/tracks`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: backendFormData,
        });

        const rawText = await response.text();
        console.log('[music/upload compat] Backend response:', {
            status: response.status,
            elapsedMs: Date.now() - startedAt,
            bodyPreview: rawText.slice(0, 500),
        });

        try {
            const data = JSON.parse(rawText);
            return NextResponse.json(data, { status: response.status });
        } catch (error) {
            console.error('[music/upload compat] Failed to parse backend JSON:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: rawText.slice(0, 200) || "Invalid backend response",
                },
                { status: response.status || 502 }
            );
        }
    } catch (error) {
        console.error('[music/upload compat] Error:', error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        },
    });
}
