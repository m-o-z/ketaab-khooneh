import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { URL } from "url";

// Helper to block localhost/private/undefined URLs (basic SSRF defense)
function isUnsafeUrl(target: string): boolean {
  try {
    const u = new URL(target);
    // Reject non-http(s)
    if (!/^https?:$/.test(u.protocol)) return true;
    // Basic SSRF mitigation: block localhost & private IPs
    const host = u.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".internal") ||
      /^\[::1\]/.test(host)
    )
      return true;
    return false;
  } catch {
    return true; // Invalid URL
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Missing ?url query param." },
      { status: 400 },
    );
  }
  if (isUnsafeUrl(imageUrl)) {
    return NextResponse.json(
      { error: "Blocked or invalid URL." },
      { status: 400 },
    );
  }

  let remoteRes: Response;
  try {
    remoteRes = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NextImageProxy/1.0", // To avoid some anti-bot mitigations
        // No Referer to avoid leaking user URL
      },
      // 15s timeout via AbortController
      signal: AbortSignal.timeout ? AbortSignal.timeout(15000) : undefined,
      next: { revalidate: 0 },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch remote image." },
      { status: 502 },
    );
  }

  if (!remoteRes.ok) {
    return NextResponse.json(
      { error: `Failed to fetch image: ${remoteRes.status}` },
      { status: 502 },
    );
  }

  // Validate content-type is image/*
  const ct = remoteRes.headers.get("content-type") || "";
  if (!ct.startsWith("image/")) {
    return NextResponse.json(
      { error: "URL does not point to an image." },
      { status: 415 },
    );
  }

  // Use filename from remote Content-Disposition, fallback to url
  let fileName = "downloaded-image";
  const contentDisp = remoteRes.headers.get("content-disposition");
  if (contentDisp && /filename="?([^"]+)"?/.test(contentDisp)) {
    fileName = decodeURIComponent(RegExp.$1);
  } else {
    try {
      fileName = decodeURIComponent(
        imageUrl.split("/").pop() || "downloaded-image",
      );
    } catch {}
  }

  // Set headers for download
  const headers = new Headers();
  headers.set("Content-Type", ct);
  headers.set("Content-Disposition", `inline; filename="${fileName}"`);
  const contentLength = remoteRes.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  // Stream the image
  return new Response(remoteRes.body, {
    status: 200,
    headers,
  });
}
