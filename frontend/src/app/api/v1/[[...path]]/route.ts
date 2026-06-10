import { NextRequest, NextResponse } from "next/server";

// Use Docker internal DNS for frontend→backend communication within the container.
// This bypasses Nginx and avoids circular routing (frontend → Nginx → backend).
// process.env.INTERNAL_BACKEND_URL is set in the frontend Dockerfile/container env.
const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || "http://backend:3001";

async function parseBackendResponse(response: Response) {
  const rawText = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!rawText.trim()) {
    return null;
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawText);
    } catch {
      return {
        success: false,
        message: rawText,
      };
    }
  }

  return {
    success: response.ok,
    message: rawText,
  };
}

function toNextResponse(response: Response, data: unknown) {
  if (data === null) {
    return new NextResponse(null, { status: response.status });
  }

  if (typeof data === "string") {
    return new NextResponse(data, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json(data, { status: response.status });
}

/**
 * ALL backend API calls go through this proxy route: /api/v1/*
 * The browser attaches the backend_token from the httpOnly cookie automatically.
 * We additionally pass it as Authorization: Bearer header to satisfy JwtAuthenticationFilter.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const search = request.nextUrl.search;

  const response = await fetch(`${BACKEND_URL}/api/v1${path}${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  const data = await parseBackendResponse(response);
  return toNextResponse(response, data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const search = request.nextUrl.search;
  const contentType = request.headers.get("content-type");
  const body = await request.arrayBuffer();

  // Only pass Content-Type for non-FormData requests.
  // For FormData (multipart), browser sets the boundary automatically.
  // Overriding it causes Express/multer to fail parsing the body.
  const isFormData = contentType?.includes("multipart/form-data");
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData && contentType) {
    headers["Content-Type"] = contentType;
  }

  const response = await fetch(`${BACKEND_URL}/api/v1${path}${search}`, {
    method: "POST",
    headers,
    credentials: "include",
    body,
  });

  const data = await parseBackendResponse(response);
  return toNextResponse(response, data);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const search = request.nextUrl.search;
  const contentType = request.headers.get("content-type");
  const body = await request.arrayBuffer();

  const isFormData = contentType?.includes("multipart/form-data");
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData && contentType) {
    headers["Content-Type"] = contentType;
  }

  const response = await fetch(`${BACKEND_URL}/api/v1${path}${search}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body,
  });

  const data = await parseBackendResponse(response);
  return toNextResponse(response, data);
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const search = request.nextUrl.search;
  const contentType = request.headers.get("content-type");
  const body = await request.arrayBuffer();

  const isFormData = contentType?.includes("multipart/form-data");
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (!isFormData && contentType) {
    headers["Content-Type"] = contentType;
  }

  const response = await fetch(`${BACKEND_URL}/api/v1${path}${search}`, {
    method: "PATCH",
    headers,
    credentials: "include",
    body,
  });

  const data = await parseBackendResponse(response);
  return toNextResponse(response, data);
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("backend_token")?.value;
  const path = request.nextUrl.pathname.replace("/api/v1", "");
  const search = request.nextUrl.search;

  const response = await fetch(`${BACKEND_URL}/api/v1${path}${search}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  const data = await parseBackendResponse(response);
  return toNextResponse(response, data);
}
