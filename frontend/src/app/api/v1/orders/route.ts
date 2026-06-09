import { NextRequest } from "next/server";
import { POST as proxyPost } from "../[[...path]]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Backward-compatible alias for older frontend bundles that still POST to `/api/v1/orders`.
 * Internally rewrites to `/api/v1/shop/orders` so stale clients continue working.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  url.pathname = "/api/v1/shop/orders";

  const rewrittenRequest = new NextRequest(url, request);
  return proxyPost(rewrittenRequest);
}
